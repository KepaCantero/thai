// Spike 5e: Top 1000 mode extraction.
//
// Moves the Top 1000 dashboard rendering (4 sub-tabs: Palabras, Estructuras,
// Frases, Conversaciones, plus the Estudiar sub-tab that mounts the inline
// SRS deck picker) out of public/top1000-ui.js into a typed module.
// Behavior is preserved line-for-line:
//   - renderTop1000(): renders the sub-tab strip + dispatches to per-tab
//     renderer; writes innerHTML of #top1000View.
//   - setTop1000Tab(tab): unmounts inline SRS when leaving 'estudiar',
//     resets category/search, re-renders.
//   - renderTop1000Words() / renderTop1000Structures() /
//     renderTop1000Phrases() / renderTop1000Conversations(): per-tab bodies
//     with category chips + search + grid.
//   - Per-card renderers (renderTop1000Card, renderTop1000StructureCard,
//     renderTop1000PhraseRow, renderTop1000ConvoCard) build the card HTML
//     with inline onclick handlers bound to setTop1000Cat /
//     setTop1000Search / top1000Speak.
//   - setTop1000Cat / setTop1000Search: shared filter handlers.
//   - top1000Speak: passthrough to speakText.
//   - segmentPhraseThai / getTop1000WordDict: cached word dictionary used
//     to segment phrase strings when TOP1000_PHRASE_SEGMENTS lacks an entry.
//
// Module-local state (mirrors public/top1000-ui.js:6-10):
//   - top1000Filter = { tab, category, search }
//   - TOP1000_WORD_BY_THAI / TOP1000_WORD_MAXLEN: lazy-built dictionary cache
//
// External touchpoints (injected via deps):
//   - getBundle(): returns the typed Top1000Bundle from data/loader.
//   - getPhraseSegments(): optional override reading window.TOP1000_PHRASE_SEGMENTS.
//   - speakText(text): audio.js global.
//   - renderTone(toneStr): config.js global — optional, used by word cards.
//   - SRS hooks (all optional, resolved lazily through the same object):
//       mountSrsInline, unmountSrsInline, renderDeckPicker, getDeckStats,
//       SRS_TOP1000_DECK_KEYS. The module only calls them via typeof guards
//       matching the legacy surface.
//   - dom.setView(html): writes innerHTML of #top1000View.

import type {
  Top1000Bundle,
  Top1000Conversation,
  Top1000Structure,
} from '../../data/loader';
import type {
  Top1000Category,
  Top1000PhraseSegmentMap,
  Top1000Word,
} from '../../types';

// ---------------------------------------------------------------------------
// Sub-tab keys — kept loose to accommodate 'estudiar' (SRS inline mount)
// ---------------------------------------------------------------------------

export type Top1000SubTab =
  | 'palabras'
  | 'estructuras'
  | 'frases'
  | 'conversaciones'
  | 'estudiar';

// ---------------------------------------------------------------------------
// Dependency injection
// ---------------------------------------------------------------------------

export interface Top1000ModuleDeps {
  /** Typed bundle from data/loader. May return undefined if data failed to load. */
  getBundle(): Top1000Bundle | undefined;
  /** Optional override for the segment map (window.TOP1000_PHRASE_SEGMENTS). */
  getPhraseSegments?(): Top1000PhraseSegmentMap | undefined;
  /** Speak arbitrary Thai text (audio.js). Optional. */
  speakText?(text: string): void;
  /** Render the tone badge HTML (config.js:179). Optional. */
  renderTone?(tone: string): string;

  // --- SRS hooks (best-effort; module guards each call) --------------------
  mountSrsInline?(
    hostId: string,
    onExit: () => void,
    deckKeys: string[],
  ): void;
  unmountSrsInline?(): void;
  renderDeckPicker?(): string;
  /** Returns { due } for a deck key, or undefined if SRS isn't loaded. */
  getDeckStats?(deckKey: string): { due: number } | undefined;
  /** Top-1000-only deck keys (defaults to ['palabras','estructuras','frases']). */
  srsTop1000DeckKeys?: string[];

  /** DOM write surface. */
  dom: Top1000Dom;
}

export interface Top1000Dom {
  /** Write innerHTML for #top1000View. */
  setViewHtml(html: string): void;
  /** Read #top1000View innerHTML (only used by tests). */
  getViewHtml?(): string;
}

export interface Top1000Module {
  renderTop1000(): void;
  setTop1000Tab(tab: Top1000SubTab): void;
  setTop1000Cat(cat: string): void;
  setTop1000Search(q: string): void;
  top1000Speak(text: string): void;
  /** Test/inspection helpers. */
  getFilter(): { tab: Top1000SubTab; category: string; search: string };
  renderTop1000Words(): string;
  renderTop1000Structures(): string;
  renderTop1000Phrases(): string;
  renderTop1000Conversations(): string;
  renderTop1000StudyBody(): string;
  segmentPhraseThai(thai: string): Top1000PhraseSegmentLite[];
}

/** Lightweight phrase segment shape returned by the segmenter. */
export interface Top1000PhraseSegmentLite {
  thai: string;
  es?: string;
  en?: string;
  english?: string;
  _unknown?: boolean;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createTop1000Module(deps: Top1000ModuleDeps): Top1000Module {
  // top1000-ui.js:6
  let top1000Filter: {
    tab: Top1000SubTab;
    category: string;
    search: string;
  } = { tab: 'palabras', category: 'all', search: '' };

  // top1000-ui.js:9-10 — cached word dictionary for phrase segmentation.
  let wordDict: Record<string, Top1000Word> | null = null;
  let wordMaxLen = 0;

  // -------------------------------------------------------------------------
  // Helpers — data accessors (handle missing bundle defensively)
  // -------------------------------------------------------------------------

  function bundle(): Top1000Bundle {
    return (
      deps.getBundle() ?? {
        words: [],
        categories: [],
        structureCategories: [],
        situations: [],
        structures: [],
        phrases: [],
        conversations: [],
      }
    );
  }

  // -------------------------------------------------------------------------
  // Word dictionary (top1000-ui.js:11-20) + phrase segmentation (21-42)
  // -------------------------------------------------------------------------

  function getWordDict(): Record<string, Top1000Word> {
    if (!wordDict) {
      wordDict = {};
      const words = bundle().words;
      for (const w of words) {
        if (!wordDict[w.thai]) wordDict[w.thai] = w;
        if (w.thai.length > wordMaxLen) wordMaxLen = w.thai.length;
      }
    }
    return wordDict;
  }

  function segmentPhraseThai(
    thai: string,
  ): Top1000PhraseSegmentLite[] {
    const dict = getWordDict();
    const segments: Top1000PhraseSegmentLite[] = [];
    const parts = thai.split(/\s+/);
    for (const p of parts) {
      if (!p) continue;
      if (dict[p]) {
        segments.push(dict[p]);
        continue;
      }
      let i = 0;
      while (i < p.length) {
        let matched: Top1000Word | null = null;
        const max = Math.min(wordMaxLen, p.length - i);
        for (let len = max; len >= 1; len--) {
          const sub = p.substring(i, i + len);
          if (dict[sub]) {
            matched = dict[sub];
            break;
          }
        }
        if (matched) {
          segments.push(matched);
          i += matched.thai.length;
        } else {
          segments.push({ thai: p.charAt(i), _unknown: true });
          i++;
        }
      }
    }
    return segments;
  }

  // -------------------------------------------------------------------------
  // Sub-tab metadata + counts (top1000-ui.js:44-61)
  // -------------------------------------------------------------------------

  const TAB_KEYS: Top1000SubTab[] = [
    'palabras',
    'estructuras',
    'frases',
    'conversaciones',
    'estudiar',
  ];

  const TAB_LABELS: Record<Top1000SubTab, string> = {
    palabras: 'Palabras',
    estructuras: 'Estructuras',
    frases: 'Frases',
    conversaciones: 'Conversaciones',
    estudiar: 'Estudiar',
  };

  function tabCount(tab: Top1000SubTab): number {
    const b = bundle();
    if (tab === 'palabras') return b.words.length;
    if (tab === 'estructuras') return b.structures.length;
    if (tab === 'frases') return b.phrases.length;
    if (tab === 'conversaciones') return b.conversations.length;
    // estudiar → due-card count across the 3 deck keys
    if (typeof deps.getDeckStats !== 'function') return 0;
    let due = 0;
    for (const k of deckKeys()) {
      try {
        due += deps.getDeckStats(k)?.due ?? 0;
      } catch {
        // ignore — matches legacy try/catch
      }
    }
    return due;
  }

  function deckKeys(): string[] {
    return deps.srsTop1000DeckKeys ?? ['palabras', 'estructuras', 'frases'];
  }

  // -------------------------------------------------------------------------
  // renderTop1000 (top1000-ui.js:63-89)
  // -------------------------------------------------------------------------

  function renderTop1000(): void {
    const tabsHtml =
      '<div class="top1000-tabs">' +
      TAB_KEYS.map((t) => {
        const active = top1000Filter.tab === t ? ' active' : '';
        const count = tabCount(t);
        const countLabel =
          t === 'estudiar'
            ? count > 0
              ? '(' + count + ' due)'
              : '✓'
            : '(' + count + ')';
        return (
          '<button class="top1000-tab' +
          active +
          '" onclick="setTop1000Tab(\'' +
          t +
          '\')">' +
          TAB_LABELS[t] +
          ' <span class="top1000-tab-count">' +
          countLabel +
          '</span></button>'
        );
      }).join('') +
      '</div>';

    let body = '';
    if (top1000Filter.tab === 'palabras') body = renderTop1000Words();
    else if (top1000Filter.tab === 'estructuras')
      body = renderTop1000Structures();
    else if (top1000Filter.tab === 'frases') body = renderTop1000Phrases();
    else if (top1000Filter.tab === 'conversaciones')
      body = renderTop1000Conversations();
    else if (top1000Filter.tab === 'estudiar') body = renderTop1000StudyBody();

    deps.dom.setViewHtml(tabsHtml + body);
  }

  // -------------------------------------------------------------------------
  // Estudiar sub-tab — inline SRS mount (top1000-ui.js:95-101, duplicated
  // at 107-113 — both definitions are identical so a single function suffices)
  // -------------------------------------------------------------------------

  function renderTop1000StudyBody(): string {
    if (
      typeof deps.mountSrsInline !== 'function' ||
      typeof deps.renderDeckPicker !== 'function'
    ) {
      return '<div class="top1000-empty">SRS no disponible.</div>';
    }
    deps.mountSrsInline(
      'top1000View',
      () => setTop1000Tab('estudiar'),
      deckKeys(),
    );
    return deps.renderDeckPicker();
  }

  // -------------------------------------------------------------------------
  // setTop1000Tab (top1000-ui.js:115-124)
  // -------------------------------------------------------------------------

  function setTop1000Tab(tab: Top1000SubTab): void {
    if (
      top1000Filter.tab === 'estudiar' &&
      tab !== 'estudiar' &&
      typeof deps.unmountSrsInline === 'function'
    ) {
      deps.unmountSrsInline();
    }
    top1000Filter.tab = tab;
    top1000Filter.category = 'all';
    top1000Filter.search = '';
    renderTop1000();
  }

  // -------------------------------------------------------------------------
  // Palabras (top1000-ui.js:127-203)
  // -------------------------------------------------------------------------

  const CAT_SHORT: Record<string, string> = {
    expresiones: 'EXP',
    pronombres: 'PRO',
    verbos: 'VRB',
    sustantivos: 'SUS',
    adjetivos: 'ADJ',
    adverbios: 'ADV',
  };

  function renderTop1000Words(): string {
    const b = bundle();
    const cats: string[] = ['all'].concat(b.categories as Top1000Category[]);
    const chips = cats
      .map((c) => {
        const active = top1000Filter.category === c ? ' active' : '';
        const label =
          c === 'all'
            ? 'Todas (' + b.words.length + ')'
            : c.charAt(0).toUpperCase() + c.slice(1) +
              ' (' +
              b.words.filter((w) => w.category === c).length +
              ')';
        return (
          '<button class="top1000-chip' +
          active +
          '" onclick="setTop1000Cat(\'' +
          c +
          '\')">' +
          label +
          '</button>'
        );
      })
      .join('');

    const filtered = b.words.filter((w) => {
      if (top1000Filter.category !== 'all' && w.category !== top1000Filter.category)
        return false;
      if (top1000Filter.search) {
        const q = top1000Filter.search.toLowerCase();
        if (
          !(
            w.thai.indexOf(q) >= 0 ||
            (w.es || '').toLowerCase().indexOf(q) >= 0 ||
            (w.spanish || '').toLowerCase().indexOf(q) >= 0 ||
            (w.english || '').toLowerCase().indexOf(q) >= 0
          )
        )
          return false;
      }
      return true;
    });

    const search =
      '<div class="top1000-search">' +
      '<input type="text" placeholder="Search (thai/english)..." value="' +
      (top1000Filter.search || '').replace(/"/g, '&quot;') +
      '" oninput="setTop1000Search(this.value)"></div>';

    const header =
      '<div class="top1000-bar">' +
      '<div class="top1000-chips">' +
      chips +
      '</div>' +
      search +
      '<div class="top1000-count">' +
      filtered.length +
      ' palabras</div>' +
      '</div>';

    if (!filtered.length) {
      return (
        header +
        '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>'
      );
    }

    const cards = filtered.map(renderTop1000Card).join('');
    return header + '<div class="top1000-grid">' + cards + '</div>';
  }

  function escAttr(s: string | undefined): string {
    return (s || '').replace(/'/g, "\\'");
  }

  function renderTop1000Card(w: Top1000Word): string {
    const tone =
      typeof deps.renderTone === 'function' ? deps.renderTone(w.tone) : '';
    const cat = w.category as string;
    const catShort = CAT_SHORT[cat] || cat.slice(0, 3).toUpperCase();
    const rank = '#' + w.rank;
    // Legacy top1000-ui.js:193/200 reads `w.question.en` / `w.answer.en`
    // defensively — the typed shape doesn't include `en` on these blocks,
    // so cast to a loose record to preserve the runtime behavior.
    const questionEn = (w.question as Record<string, string | undefined>).en || '';
    const answerEn = (w.answer as Record<string, string | undefined>).en || '';
    return (
      '<div class="top1000-card" data-thai="' + w.thai + '">' +
      '<div class="t1-rank">' + rank + '</div>' +
      '<div class="t1-cat t1-cat-' + cat + '">' + catShort + '</div>' +
      '<div class="t1-head">' +
        '<div class="t1-thai">' + w.thai + '</div>' +
        '<button class="t1-speak-word" onclick="event.stopPropagation();top1000Speak(\'' +
          escAttr(w.thai) + '\')" title="Reproducir palabra">▶</button>' +
      '</div>' +
      '<div class="t1-es">' + (w.es || '') + '</div>' +
      (tone ? '<div class="t1-tone">' + tone + '</div>' : '') +
      '<div class="t1-es-meaning">' + (w.english || '') + '</div>' +
      '<div class="t1-detail">' +
        '<div class="t1-section">' +
          '<div class="t1-label">Frase <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
            escAttr(w.phrase.thai) + '\')" title="Reproducir">▶</button></div>' +
          '<div class="t1-line"><span class="t1-line-thai">' + w.phrase.thai + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es">' + w.phrase.es + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es-meaning">' + (w.phrase.en || '') + '</span></div>' +
        '</div>' +
        '<div class="t1-section">' +
          '<div class="t1-label">Pregunta <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
            escAttr(w.question.thai) + '\')" title="Reproducir">▶</button></div>' +
          '<div class="t1-line"><span class="t1-line-thai">' + w.question.thai + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es">' + w.question.es + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es-meaning">' + questionEn + '</span></div>' +
        '</div>' +
        '<div class="t1-section">' +
          '<div class="t1-label">Respuesta <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
            escAttr(w.answer.thai) + '\')" title="Reproducir">▶</button></div>' +
          '<div class="t1-line"><span class="t1-line-thai">' + w.answer.thai + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es">' + w.answer.es + '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es-meaning">' + answerEn + '</span></div>' +
        '</div>' +
      '</div>' +
      '</div>'
    );
  }

  // -------------------------------------------------------------------------
  // Estructuras (top1000-ui.js:206-271)
  // -------------------------------------------------------------------------

  function renderTop1000Structures(): string {
    const b = bundle();
    const cats: string[] = ['all'].concat(b.structureCategories);
    const chips = cats
      .map((c) => {
        const active = top1000Filter.category === c ? ' active' : '';
        const label =
          c === 'all'
            ? 'Todas (' + b.structures.length + ')'
            : c +
              ' (' +
              b.structures.filter((s) => s.category === c).length +
              ')';
        return (
          '<button class="top1000-chip' +
          active +
          '" onclick="setTop1000Cat(\'' +
          c +
          '\')">' +
          label +
          '</button>'
        );
      })
      .join('');

    const filtered = b.structures.filter((s) => {
      if (top1000Filter.category !== 'all' && s.category !== top1000Filter.category)
        return false;
      if (top1000Filter.search) {
        const q = top1000Filter.search.toLowerCase();
        const hay = (
          s.name +
          ' ' +
          s.explanation +
          ' ' +
          s.examples
            .map((e) => e.thai + ' ' + e.spanish)
            .join(' ')
        ).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });

    const search =
      '<div class="top1000-search">' +
      '<input type="text" placeholder="Buscar estructura..." value="' +
      (top1000Filter.search || '').replace(/"/g, '&quot;') +
      '" oninput="setTop1000Search(this.value)"></div>';

    const header =
      '<div class="top1000-bar">' +
      '<div class="top1000-chips">' +
      chips +
      '</div>' +
      search +
      '<div class="top1000-count">' +
      filtered.length +
      ' estructuras</div>' +
      '</div>';

    if (!filtered.length)
      return (
        header +
        '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>'
      );

    return (
      header +
      '<div class="top1000-grid">' +
      filtered.map(renderTop1000StructureCard).join('') +
      '</div>'
    );
  }

  function renderTop1000StructureCard(s: Top1000Structure): string {
    const stars = (n: number): string => {
      const full = '★'.repeat(n);
      const empty = '☆'.repeat(5 - n);
      return '<span class="t1-stars">' + full + empty + '</span>';
    };
    const examples = s.examples
      .map((e) => {
        return (
          '<div class="t1-example">' +
          '<div class="t1-line"><span class="t1-line-thai">' +
          e.thai +
          ' ' +
          '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
          escAttr(e.thai) +
          '\')">▶</button></span></div>' +
          '<div class="t1-line"><span class="t1-line-es">' +
          e.rtgs +
          '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es-meaning">' +
          e.spanish +
          ' · <i>' +
          e.english +
          '</i></span></div>' +
          '</div>'
        );
      })
      .join('');

    return (
      '<div class="top1000-card t1-structure-card">' +
      '<div class="t1-rank">#' + s.id + '</div>' +
      '<div class="t1-cat t1-cat-structure">' + s.category + '</div>' +
      '<div class="t1-structure-head">' +
        '<div class="t1-thai">' + s.name + '</div>' + stars(s.importance) +
      '</div>' +
      '<div class="t1-section"><div class="t1-label">Explicación</div>' +
        '<div class="t1-line">' + s.explanation + '</div></div>' +
      '<div class="t1-section"><div class="t1-label">Cuándo se usa</div>' +
        '<div class="t1-line">' + s.when + '</div></div>' +
      '<div class="t1-section"><div class="t1-label">Errores típicos</div>' +
        '<div class="t1-line">' + s.mistakes + '</div></div>' +
      (s.colloquial
        ? '<div class="t1-section"><div class="t1-label">Coloquial</div>' +
          '<div class="t1-line">' + s.colloquial + '</div></div>'
        : '') +
      '<div class="t1-section"><div class="t1-label">Ejemplos (' + s.examples.length + ')</div>' + examples + '</div>' +
      '</div>'
    );
  }

  // -------------------------------------------------------------------------
  // Frases (top1000-ui.js:274-327)
  // -------------------------------------------------------------------------

  function renderTop1000Phrases(): string {
    const b = bundle();
    const filtered = (b.phrases as Top1000PhraseRow[]).filter((p) => {
      if (top1000Filter.search) {
        const q = top1000Filter.search.toLowerCase();
        const hay = (
          p.thai +
          ' ' +
          (p.rtgs || '') +
          ' ' +
          (p.spanish || '') +
          ' ' +
          (p.english || '') +
          ' ' +
          (p.note || '')
        ).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });

    const search =
      '<div class="top1000-search">' +
      '<input type="text" placeholder="Buscar frase..." value="' +
      (top1000Filter.search || '').replace(/"/g, '&quot;') +
      '" oninput="setTop1000Search(this.value)"></div>';

    const header =
      '<div class="top1000-bar">' +
      '<div class="top1000-chips"><span class="top1000-hint">Banco de frases — reutiliza palabras y estructuras</span></div>' +
      search +
      '<div class="top1000-count">' +
      filtered.length +
      ' frases</div>' +
      '</div>';

    if (!filtered.length)
      return (
        header +
        '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>'
      );

    return (
      header +
      '<div class="top1000-grid">' +
      filtered.map(renderTop1000PhraseRow).join('') +
      '</div>'
    );
  }

  /**
   * Phrase row shape. The bundle types `phrases` as `unknown[]` in loader.ts
   * (the original data has no precise type); this local interface codifies the
   * fields the renderer actually reads.
   */
  interface Top1000PhraseRow {
    id: string | number;
    thai: string;
    rtgs?: string;
    spanish?: string;
    english?: string;
    note?: string;
    structureId?: string | number | null;
  }

  function renderTop1000PhraseRow(p: Top1000PhraseRow): string {
    const segments =
      (deps.getPhraseSegments?.()?.[String(p.id)] as Top1000PhraseSegmentLite[] | undefined) ||
      segmentPhraseThai(p.thai);
    const wordsHtml = segments
      .map((s) => {
        const en = s.en || s.english || '';
        const es = s.es || '';
        const cls = 't1-phrase-word' + (en ? '' : ' t1-phrase-word-unknown');
        return (
          '<span class="' + cls + '">' +
          '<span class="t1-phrase-word-thai">' + s.thai + '</span> ' +
          '<span class="t1-phrase-word-es">' + es + '</span>' +
          '<span class="t1-phrase-word-en">' + en + '</span>' +
          '</span>'
        );
      })
      .join('');
    const struct = p.structureId
      ? (bundle().structures as Top1000Structure[]).find(
          (s) => s.id === p.structureId,
        )
      : null;
    const structTag = struct
      ? '<span class="t1-phrase-meta-struct">#' + struct.id + ' ' + struct.name + '</span>'
      : '';

    return (
      '<div class="top1000-card t1-phrase-row">' +
      '<div class="t1-rank">#' + p.id + '</div>' +
      '<div class="t1-line"><span class="t1-line-thai">' + p.thai + ' ' +
        '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
          escAttr(p.thai) + '\')">▶</button></span></div>' +
      '<div class="t1-line"><span class="t1-line-es">' + (p.rtgs || '') + '</span></div>' +
      '<div class="t1-line"><span class="t1-line-en">' + (p.english || '') + '</span></div>' +
      '<div class="t1-phrase-meta">' +
        (wordsHtml
          ? '<div class="t1-label">Palabras:</div><div class="t1-phrase-words">' + wordsHtml + '</div>'
          : '') +
        (structTag
          ? '<div class="t1-label">Estructura: ' + structTag + '</div>'
          : '') +
        (p.note ? '<div class="t1-line t1-note">' + p.note + '</div>' : '') +
      '</div>' +
      '</div>'
    );
  }

  // -------------------------------------------------------------------------
  // Conversaciones (top1000-ui.js:330-380)
  // -------------------------------------------------------------------------

  function renderTop1000Conversations(): string {
    const b = bundle();
    const cats: string[] = ['all'].concat(b.situations);
    const chips = cats
      .map((c) => {
        const active = top1000Filter.category === c ? ' active' : '';
        const label =
          c === 'all'
            ? 'Todas (' + b.conversations.length + ')'
            : c +
              ' (' +
              b.conversations.filter((x) => x.situation === c).length +
              ')';
        return (
          '<button class="top1000-chip' +
          active +
          '" onclick="setTop1000Cat(\'' +
          c +
          '\')">' +
          label +
          '</button>'
        );
      })
      .join('');

    const filtered = b.conversations.filter((c: Top1000Conversation) => {
      if (top1000Filter.category !== 'all' && c.situation !== top1000Filter.category)
        return false;
      if (top1000Filter.search) {
        const q = top1000Filter.search.toLowerCase();
        const hay = (
          c.situation +
          ' ' +
          c.lines.map((l) => l.thai + ' ' + l.spanish).join(' ')
        ).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });

    const search =
      '<div class="top1000-search">' +
      '<input type="text" placeholder="Buscar conversación..." value="' +
      (top1000Filter.search || '').replace(/"/g, '&quot;') +
      '" oninput="setTop1000Search(this.value)"></div>';

    const header =
      '<div class="top1000-bar">' +
      '<div class="top1000-chips">' +
      chips +
      '</div>' +
      search +
      '<div class="top1000-count">' +
      filtered.length +
      ' conversaciones</div>' +
      '</div>';

    if (!filtered.length)
      return (
        header +
        '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>'
      );

    return (
      header +
      '<div class="top1000-convo-list">' +
      filtered.map(renderTop1000ConvoCard).join('') +
      '</div>'
    );
  }

  function renderTop1000ConvoCard(c: Top1000Conversation): string {
    const lines = c.lines
      .map((l) => {
        return (
          '<div class="t1-convo-line">' +
          '<div class="t1-line"><span class="t1-line-thai">' +
          l.thai +
          ' ' +
          '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' +
          escAttr(l.thai) +
          '\')">▶</button></span></div>' +
          '<div class="t1-line"><span class="t1-line-es">' +
          l.rtgs +
          '</span></div>' +
          '<div class="t1-line"><span class="t1-line-es-meaning">' +
          l.spanish +
          ' · <i>' +
          l.english +
          '</i></span></div>' +
          '</div>'
        );
      })
      .join('');
    return (
      '<div class="top1000-card t1-convo-card">' +
      '<div class="t1-rank">#' + c.id + '</div>' +
      '<div class="t1-cat t1-cat-convo">' + c.situation + '</div>' +
      '<div class="t1-convo-head">' + c.situation + ' · <span class="t1-convo-meta">' +
        c.difficulty + ' · ' + c.lines.length + ' líneas</span></div>' +
      '<div class="t1-convo-body">' + lines + '</div>' +
      '</div>'
    );
  }

  // -------------------------------------------------------------------------
  // Shared handlers (top1000-ui.js:383-395)
  // -------------------------------------------------------------------------

  function setTop1000Cat(cat: string): void {
    top1000Filter.category = cat;
    renderTop1000();
  }

  function setTop1000Search(q: string): void {
    top1000Filter.search = q;
    renderTop1000();
  }

  function top1000Speak(text: string): void {
    if (typeof deps.speakText === 'function') deps.speakText(text);
  }

  return {
    renderTop1000,
    setTop1000Tab,
    setTop1000Cat,
    setTop1000Search,
    top1000Speak,
    getFilter: () => ({ ...top1000Filter }),
    renderTop1000Words,
    renderTop1000Structures,
    renderTop1000Phrases,
    renderTop1000Conversations,
    renderTop1000StudyBody,
    segmentPhraseThai,
  };
}
