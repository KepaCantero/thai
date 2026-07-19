// Spike 5i: Dashboard mode extraction.
//
// Moves the dashboard / grid-of-cards view out of public/app.js
// (L980-1402) into a typed module. Behavior preserved line-for-line:
//   - renderDashboard(): rebuild deck via injected buildDeck(), filter by
//     activeLesson === 'dificiles', special-case activeLesson === 'cthai'
//     (groups view), then dispatch per card type to renderDashWordPhrase /
//     renderDashConversation / renderDashPair.
//   - renderCthaiGroups(): grouped view for cthai cards with progress bar
//     and frequency-rank sort.
//   - renderDashWordPhrase / renderDashConversation / renderDashPair: build
//     the per-card HTML strings. Conversation has two paths — verified:false
//     (cthai-only single-face with Q+A counters + play buttons) and the
//     normal flip-card.
//   - dashCardClick(el, i): flip + speak. cthai cards render without
//     onclick; this handler is defensive.
//   - clearDashboardHighlights(): strip playing/played classes.
//   - dashPlayAll(cardIdx) / dashRepeat(cardIdx, rep): the dashboard
//     play-all FSM. Uses shared running/paused/playResumeFn/playTimeout
//     from the playback state.
//   - toggleDashboard(): setMode(dashboardMode ? 'cards' : 'dashboard').
//
// Module owns: dashboardMode (mirrored via defineProperty in the bridge).
//
// Deps that are SHARED with the cards mode — buildDeck, cardKey, diffBtnHtml,
// getEn, renderTone, renderWB, getAudioText, playAudioItem, speakText,
// stopCurrentAudio — are injected. cthai bookkeeping (cthaiCardDone,
// cthaiCountPlays, cthaiCardId, cthaiCardFreqRank, cthaiPlays, saveCthaiPlays,
// CTHAI_THRESHOLD) is also injected because it lives in the cards module.

import type { Card } from '../../types';
import { gameBus } from '../../state/events';
import {
  renderCategoryTile,
  renderProgress,
  renderSourceTile,
  sortByEasiestFirst,
  sortSourcesByEasiestFirst,
  groupCthaiByCategory,
  groupCthaiBySource,
  wrapCategoryTiles,
  wrapSourceTiles,
  type CthaiGroupingDeps,
} from './cthaiGroups';

// ---------------------------------------------------------------------------
// Dependency injection
// ---------------------------------------------------------------------------

export interface DashboardDom {
  /** Returns the dashboard grid element (window.$('dashboardGrid')). */
  getGrid(): HTMLElement | null;
  /** Set the grid's innerHTML. */
  setGridHtml(html: string): void;
  /** Set the grid's style.display ('grid' | 'block' | 'none'). */
  setGridDisplay(display: string): void;
  /** Query all rendered dash-card elements (used by highlight reset + FSM). */
  queryCards(): HTMLElement[];
  /** setText on #playAllProgress. */
  setProgress(text: string): void;
  /** setText on #playAllIndicator. */
  setIndicator(text: string): void;
}

export interface DashboardModuleDeps {
  /** Rebuild deck (cards mode's buildDeck). */
  buildDeck(): Card[];
  /** Active lesson filter — 'all' | 'dificiles' | 'cthai' | <n> | 'youtube'. */
  getActiveLesson(): string;
  /** Difficult-Set facade (cards mode scoring). */
  isDifficult(key: string): boolean;
  /** cardKey(item) from cards mode. */
  cardKey(item: Card): string;
  /** renderTone(toneStr, highlight?) from config.js. */
  renderTone(toneStr: string | undefined, highlight?: string): string;
  /** renderWB(thai) from ui.js — word-boundary markers. */
  renderWB(thai: string | undefined): string;
  /** getEn(item) from config.js — best English translation for the back. */
  getEn(item: Card): string;
  /** diffBtnHtml(item, i) from cards mode — the +/− difficult button. */
  diffBtnHtml(item: Card, i: number): string;

  // --- shared translation maps (config.js globals) -------------------------

  /** THAI_EN map (config.js) — used by renderDashPair back face. */
  getThaiEn(): Record<string, string>;
  /** CONV_EN map keyed by q_thai (config.js) — used by renderDashConversation. */
  getConvEn(): Record<string, { q?: string; a?: string }>;

  // --- shared deck read (cards module owns window.deck) --------------------

  /** Returns the current deck (window.deck). */
  getDeck(): Card[];
  /** True if a global speakText function is available (cthai play button render). */
  hasSpeakText(): boolean;

  // --- cthai bookkeeping (lives in cards mode) ----------------------------

  /** cthaiCardDone(item): both Q and A counts >= CTHAI_THRESHOLD. */
  cthaiCardDone(item: Card): boolean;
  /** cthaiCountPlays(item, 'q'|'a'): clamped play counter. */
  cthaiCountPlays(item: Card, which: 'q' | 'a'): number;
  /** bumpCthaiPlay(item, 'q'|'a'): increment counter (writes to typed store). */
  bumpCthaiPlay(item: Card, which: 'q' | 'a'): void;
  /** cthaiCardFreqRank(item): min frequency rank across Q+A thai text. */
  cthaiCardFreqRank(item: Card): number;
  /** CTHAI_THRESHOLD constant (10). */
  getCthaiThreshold(): number;

  // --- playback (audio.js + cards FSM) ------------------------------------

  /** audio.js playAudioItem(item, onDone). */
  playAudioItem(item: Card, onDone: () => void): void;
  /** audio.js speakText(text, onDone?). */
  speakText(text: string, onDone?: () => void): void;
  /** audio.js stopCurrentAudio(). */
  stopCurrentAudio(): void;
  /** audio.js getAudioText(item). */
  getAudioText(item: Card): string;

  // --- playback FSM read/write (shared with cards via state bridge) ------

  isRunning(): boolean;
  isPaused(): boolean;
  setPlayResumeFn(fn: (() => void) | null): void;
  setPlayTimeout(id: number | null): void;
  setTimeout(fn: () => void, ms: number): number;
  /** Calls the global stopPlayAll from cards FSM. */
  stopPlayAll(): void;
  /** Calls the global startPlayAll(i) from cards FSM. */
  startPlayAll(i: number): void;

  // --- mode switching -----------------------------------------------------

  /** setMode(key) from app.js (legacy). */
  setMode(key: 'cards' | 'dashboard' | string): void;

  /** DOM write surface. */
  dom: DashboardDom;
}

export interface DashboardModule {
  renderDashboard(): void;
  renderCthaiGroups(cards: Card[]): string;
  renderDashWordPhrase(item: Card, i: number): string;
  renderDashConversation(item: Card, i: number): string;
  renderDashPair(item: Card, i: number): string;
  dashCardClick(el: HTMLElement, i: number): void;
  playConvAudio(i: number, which: 'q' | 'a'): void;
  clearDashboardHighlights(): void;
  dashPlayAll(cardIdx: number): void;
  toggleDashboard(): void;
  /** Drill into a CT category (null = back to overview). Resets source. */
  setCthaiGroup(name: string | null): void;
  /** Drill into a CT source within the active category (null = back to
   *  category source list). */
  setCthaiSource(src: string | null): void;
  /** Inspection helper for tests: active category name (or null). */
  _getActiveCthaiGroup(): string | null;
  /** Inspection helper for tests: active source (or null). */
  _getActiveCthaiSource(): string | null;
  /** Test-only: reset both drill-down slots. */
  _resetCthaiNavForTests(): void;

  // Inspection helpers
  isDashboardMode(): boolean;
  /** For bridge: set the dashboardMode flag (mirrors legacy assignment). */
  _setDashboardMode(v: boolean): void;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createDashboardModule(deps: DashboardModuleDeps): DashboardModule {
  let dashboardMode = false;
  // CT drill-down state machine (3 levels):
  //   category=null          → overview (category tiles)
  //   category='<name>', source=null → source tiles within that category
  //   category='<name>', source='<src>' → cards from that source
  let activeCthaiCategory: string | null = null;
  let activeCthaiSource: string | null = null;

  // ----- renderDashboard (app.js L980-1005) ---------------------------------

  function renderDashboard(): void {
    const grid = deps.dom.getGrid();
    if (!grid) return;
    // `deck = buildDeck()` writes through to the shared deck state via
    // app.js's top-level `var deck`. We mirror by mutating window.deck in
    // the bridge; here we only need the local list.
    let deck = deps.buildDeck();
    if (deps.getActiveLesson() === 'dificiles') {
      deck = deck.filter((it) => deps.isDifficult(deps.cardKey(it)));
    }
    if (!deck.length) {
      deps.dom.setGridDisplay('grid');
      deps.dom.setGridHtml(
        '<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No cards for this filter</p>',
      );
      return;
    }
    if (deps.getActiveLesson() === 'cthai') {
      // Groups stack vertically — switch off the 150px card grid.
      deps.dom.setGridDisplay('block');
      deps.dom.setGridHtml(renderCthaiGroups(deck));
      return;
    }
    deps.dom.setGridDisplay('grid');
    deps.dom.setGridHtml(
      deck
        .map((item, i) => {
          if (item.type === 'conversation') return renderDashConversation(item, i);
          if (item.type === 'pair') return renderDashPair(item, i);
          return renderDashWordPhrase(item, i);
        })
        .join(''),
    );
  }

  // ----- renderCthaiGroups: 2-level nav (tiles → group detail) ---------------

  

  function renderCthaiGroups(cards: Card[]): string {
    const groupingDeps: CthaiGroupingDeps = {
      isDone: (item) => deps.cthaiCardDone(item),
      freqRank: (item) => deps.cthaiCardFreqRank(item),
    };

    const categories = sortByEasiestFirst(
      groupCthaiByCategory(cards, groupingDeps),
    );

    // Overall progress counter (always visible, regardless of level).
    const totalDone = categories.reduce(
      (acc, g) => acc + g.done,
      0,
    );
    const progress = renderProgress(
      totalDone,
      cards.length,
      deps.getCthaiThreshold(),
    );

    // Level 1: overview (category tiles).
    if (activeCthaiCategory === null) {
      return (
        progress +
        wrapCategoryTiles(
          categories.map((g, i) => renderCategoryTile(g, i)),
        )
      );
    }

    const category =
      categories.find((g) => g.name === activeCthaiCategory) ?? null;
    const categoryCards = category ? category.cards.map((c) => c.item) : [];

    // Level 2: category drill-down (source tiles).
    if (activeCthaiSource === null) {
      const sources = sortSourcesByEasiestFirst(
        groupCthaiBySource(categoryCards, groupingDeps),
        groupingDeps.freqRank,
      );
      return (
        progress +
        backBtn('setCthaiGroup(null)', '← Todas las categorías') +
        detailHeader(activeCthaiCategory, category?.done ?? 0, categoryCards.length) +
        wrapSourceTiles(
          sources.length
            ? sources.map((s, i) => renderSourceTile(s, i))
            : emptySourceHint(),
        )
      );
    }

    // Level 3: source drill-down (cards).
    const source =
      groupCthaiBySource(categoryCards, groupingDeps).find(
        (s) => s.source === activeCthaiSource,
      ) ?? null;
    const sourceCards = source
      ? [...source.cards].sort(
          (a, b) =>
            deps.cthaiCardFreqRank(a.item) - deps.cthaiCardFreqRank(b.item),
        )
      : [];

    if (!sourceCards.length) {
      return (
        progress +
        backBtn('setCthaiSource(null)', '← Volver a ' + activeCthaiCategory) +
        '<p style="color:#888;text-align:center;padding:40px 0">No hay clips para este source</p>'
      );
    }

    return (
      progress +
      backBtn('setCthaiSource(null)', '← Volver a ' + activeCthaiCategory) +
      sourceHeader(source.label, source.done, sourceCards.length) +
      '<div class="cthai-group-grid">' +
      sourceCards
        .map((ref) => renderDashConversation(ref.item, ref.idx))
        .join('') +
      '</div>'
    );
  }

  function setCthaiGroup(name: string | null): void {
    activeCthaiCategory = name;
    // Reset source whenever category changes — keeps the state machine flat
    // (you can't be inside a source of a different category).
    activeCthaiSource = null;
    renderDashboard();
  }

  function setCthaiSource(src: string | null): void {
    activeCthaiSource = src;
    renderDashboard();
  }

  /** Compact "← back" button. `onclick` is the JS expression to run on click. */
  function backBtn(onclick: string, label: string): string {
    return (
      '<div class="cthai-group-back" onclick="' +
      onclick +
      '">' +
      label +
      '</div>'
    );
  }

  /** Category detail header (label + done/total). */
  function detailHeader(name: string, done: number, total: number): string {
    const complete = total > 0 && done === total;
    return (
      '<div class="cthai-group-detail' +
      (complete ? ' cthai-group-done' : '') +
      '">' +
      '<span class="cthai-group-title">' +
      name +
      '</span>' +
      '<span class="cthai-group-count">' +
      done +
      '/' +
      total +
      '</span>' +
      '</div>'
    );
  }

  /** Source detail header — reuses the same detail chrome. */
  function sourceHeader(label: string, done: number, total: number): string {
    return detailHeader(label, done, total);
  }

  function emptySourceHint(): string[] {
    return [
      '<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">' +
        'No hay clips en esta categoría</p>',
    ];
  }

  // ----- renderDashWordPhrase (app.js L1052-1072) ----------------------------

  function renderDashWordPhrase(item: Card, i: number): string {
    const toneHtml = deps.renderTone(item.tone, item.highlightTone);
    const img = item.image ? '<img src="' + item.image + '" alt="" loading="lazy">' : '';
    const tnNote = item.toneNote
      ? '<div class="dc-tone" style="color:#888;font-size:0.58rem">' + item.toneNote + '</div>'
      : '';
    return (
      '<div class="dash-card" data-idx="' +
      i +
      '" onclick="dashCardClick(this, ' +
      i +
      ')">' +
      deps.diffBtnHtml(item, i) +
      '<div class="dc-play-icon">▶</div>' +
      '<div class="dc-type-badge">' +
      (item.type === 'phrase' ? 'F' : 'W') +
      '</div>' +
      '<div class="dc-front">' +
      img +
      '<div class="dc-thai">' +
      (item.thai || '') +
      '</div>' +
      '<div class="dc-phonetic">' +
      (item.phonetic || '') +
      '</div>' +
      (item.es ? '<div class="dc-es">ES: ' + item.es + '</div>' : '') +
      (toneHtml ? '<div class="dc-tone">' + toneHtml + '</div>' : '') +
      tnNote +
      '</div>' +
      '<div class="dc-back">' +
      img +
      '<div class="dc-translation">' +
      deps.getEn(item) +
      '</div>' +
      (item.type === 'phrase' ? '<div class="dc-wb">' + deps.renderWB(item.thai) + '</div>' : '') +
      '</div>' +
      '</div>'
    );
  }

  // ----- renderDashConversation (app.js L1074-1139) --------------------------

  function renderDashConversation(item: Card, i: number): string {
    const qTone = deps.renderTone(item.q_tone, item.highlightTone);
    const aTone = deps.renderTone(item.a_tone, item.highlightTone);
    const convEn = deps.getConvEn();
    const entry = convEn[item.q_thai || ''] || {};
    const convEnQ: string = entry.q || '';
    const convEnA: string = entry.a || '';
    const threshold = deps.getCthaiThreshold();

    // All conversation cards use the same play-buttons + counter UX
    // (both CT verified===false cards and lesson-tagged verified ones).
    // No flip, no autoplay: two 🔊 buttons let the user play Q / A on demand,
    // each click bumps a per-side counter that shows progress toward the
    // CTHAI_THRESHOLD plays required to mark the card done.
    const pDone = deps.cthaiCardDone(item);
    const pQ = deps.cthaiCountPlays(item, 'q');
    const pA = deps.cthaiCountPlays(item, 'a');
    const cthaiPlayBtn = (which: 'q' | 'a'): string => {
      if (!deps.hasSpeakText()) return '';
      return (
        '<button class="dc-play-btn" data-which="' +
        which +
        '" onclick="event.stopPropagation();playConvAudio(' +
        i +
        ',\'' +
        which +
        '\')" title="Play ' +
        (which === 'q' ? 'question' : 'answer') +
        '" aria-label="Play">🔊</button>'
      );
    };
    const cthaiCounter = (n: number): string => {
      return (
        '<span class="dc-play-count' +
        (n >= threshold ? ' dc-play-count-done' : '') +
        '">' +
        n +
        '/' +
        threshold +
        '</span>'
      );
    };
    return (
      '<div class="dash-card dash-conv cthai-only' +
      (pDone ? ' cthai-done' : '') +
      '" data-idx="' +
      i +
      '">' +
      deps.diffBtnHtml(item, i) +
      '<button class="dc-del-btn" onclick="event.stopPropagation();deleteQCard(' +
      i +
      ')" title="Delete" aria-label="Delete">🗑️</button>' +
      '<div class="dc-type-badge conv">C</div>' +
      '<div class="dc-body">' +
      '<div class="dc-qa-label">Q' +
      cthaiCounter(pQ) +
      cthaiPlayBtn('q') +
      '</div>' +
      '<div class="dc-thai">' +
      (item.q_thai || '') +
      '</div>' +
      '<div class="dc-phonetic">' +
      (item.q_phonetic || '') +
      '</div>' +
      (qTone ? '<div class="dc-tone">' + qTone + '</div>' : '') +
      '<div class="dc-translation">' +
      (convEnQ || item.q_spanish || '') +
      '</div>' +
      '<div class="dc-wb">' +
      deps.renderWB(item.q_thai) +
      '</div>' +
      '<div class="dc-sep"></div>' +
      '<div class="dc-qa-label">A' +
      cthaiCounter(pA) +
      cthaiPlayBtn('a') +
      '</div>' +
      '<div class="dc-thai">' +
      (item.a_thai || '') +
      '</div>' +
      '<div class="dc-phonetic">' +
      (item.a_phonetic || '') +
      '</div>' +
      (aTone ? '<div class="dc-tone">' + aTone + '</div>' : '') +
      '<div class="dc-translation">' +
      (convEnA || item.a_spanish || '') +
      '</div>' +
      '<div class="dc-wb">' +
      deps.renderWB(item.a_thai) +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  // ----- renderDashPair (app.js L1169-1206) ----------------------------------

  function renderDashPair(item: Card, i: number): string {
    // The declared Card.w1 type is `Thai` (string), but the legacy deck
    // stores rich pair-side objects at runtime (see public/app.js L1169-1206
    // accessing w1.thai / w1.phonetic / w1.tone / w1.spanish). Cast through
    // unknown to preserve the legacy shape without weakening Card.
    type PairSide = { thai: string; phonetic?: string; tone?: string; spanish?: string };
    const sideItem = item as unknown as { w1: PairSide; w2: PairSide; note?: string };
    const w1 = sideItem.w1;
    const w2 = sideItem.w2;
    const t1 = deps.renderTone(w1.tone);
    const t2 = deps.renderTone(w2.tone);
    const thaiEn = deps.getThaiEn();
    return (
      '<div class="dash-card dash-pair" data-idx="' +
      i +
      '" onclick="dashCardClick(this, ' +
      i +
      ')">' +
      deps.diffBtnHtml(item, i) +
      '<div class="dc-play-icon">▶▶</div>' +
      '<div class="dc-type-badge" style="color:#ff6bff;background:#ff6bff22">P</div>' +
      '<div class="dc-front">' +
      '<div class="dc-pair-row">' +
      '<div class="dc-pair-col">' +
      '<div class="dc-thai">' +
      (w1.thai || '') +
      '</div>' +
      '<div class="dc-phonetic">' +
      (w1.phonetic || '') +
      '</div>' +
      (t1 ? '<div class="dc-tone">' + t1 + '</div>' : '') +
      '</div>' +
      '<div class="dc-pair-vs">vs</div>' +
      '<div class="dc-pair-col">' +
      '<div class="dc-thai">' +
      (w2.thai || '') +
      '</div>' +
      '<div class="dc-phonetic">' +
      (w2.phonetic || '') +
      '</div>' +
      (t2 ? '<div class="dc-tone">' + t2 + '</div>' : '') +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="dc-back">' +
      '<div class="dc-pair-row">' +
      '<div class="dc-pair-col">' +
      '<div class="dc-thai">' +
      (w1.thai || '') +
      '</div>' +
      '<div class="dc-translation">' +
      (thaiEn[w1.thai] || w1.spanish || '') +
      '</div>' +
      '</div>' +
      '<div class="dc-pair-vs">vs</div>' +
      '<div class="dc-pair-col">' +
      '<div class="dc-thai">' +
      (w2.thai || '') +
      '</div>' +
      '<div class="dc-translation">' +
      (thaiEn[w2.thai] || w2.spanish || '') +
      '</div>' +
      '</div>' +
      '</div>' +
      (item.note ? '<div class="dc-pair-note">' + item.note + '</div>' : '') +
      '</div>' +
      '</div>'
    );
  }

  // ----- dashCardClick (app.js L1356-1368) -----------------------------------

  function dashCardClick(el: HTMLElement, i: number): void {
    // Conversation cards render without flip onclick (play buttons instead).
    // Defend in case of bubbling: any card with q_thai is a conversation.
    const deckRef = deps.getDeck();
    if (deckRef[i] && deckRef[i].q_thai) return;
    if (deps.isRunning()) {
      deps.stopPlayAll();
      el.classList.remove('flipped');
      deps.startPlayAll(i);
      return;
    }
    el.classList.toggle('flipped');
    deps.stopCurrentAudio();
    deps.speakText(deps.getAudioText(deckRef[i]));
  }

  // ----- playConvAudio (app.js L1144-1167) -----------------------------------
  // Plays just the Q or just the A from a conversation dashboard card.
  // Triggered by the 🔊 buttons emitted in renderDashConversation above
  // (the data-stopPropagation + onclick="playConvAudio(...)").

  function playConvAudio(i: number, which: 'q' | 'a'): void {
    const deck = deps.getDeck();
    const item = deck[i];
    if (!item) return;
    if (!deps.hasSpeakText()) return;
    deps.stopCurrentAudio();
    const text = which === 'q' ? (item.q_thai || '') : (item.a_thai || '');
    if (text) {
      deps.bumpCthaiPlay(item, which);
      deps.speakText(text);
      const src = item.source || 'nosrc';
      const entryId = src + '||' + (item.q_thai || '') + '||' + (item.a_thai || '');
      gameBus.emit({ type: 'conv:play', source: src, entryId });
    }
    // Re-render so the counter updates. Focus restoration keeps the
    // clicked button accessible for keyboard users after re-render.
    if (item.q_thai) {
      const btn = document.activeElement as HTMLElement | null;
      renderDashboard();
      if (btn && btn.classList.contains('dc-play-btn')) {
        const restored = document.querySelector<HTMLElement>(
          '.dash-card[data-idx="' + i + '"] .dc-play-btn[data-which="' + which + '"]',
        );
        if (restored) restored.focus();
      }
    }
  }

  // ----- clearDashboardHighlights (app.js L1370-1372) ------------------------

  function clearDashboardHighlights(): void {
    deps.dom.queryCards().forEach((c) => c.classList.remove('playing', 'played'));
  }

  // ----- dashPlayAll FSM (app.js L1374-1402) ---------------------------------

  const PLAY_REPS = 4;
  const REPEAT_GAP = 2000;
  const CARD_GAP = 3000;

  function dashPlayAll(cardIdx: number): void {
    const deckRef = deps.getDeck();
    if (!deps.isRunning() || cardIdx >= deckRef.length) {
      deps.stopPlayAll();
      return;
    }
    const cards = deps.dom.queryCards();
    cards.forEach((c) => c.classList.remove('playing'));
    if (cards[cardIdx]) {
      cards[cardIdx].classList.add('playing');
      cards[cardIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (cardIdx > 0 && cards[cardIdx - 1]) cards[cardIdx - 1].classList.add('played');
    deps.dom.setProgress(cardIdx + 1 + ' / ' + deckRef.length);
    deps.dom.setIndicator('playing...');
    dashRepeat(cardIdx, 1);
  }

  function dashRepeat(cardIdx: number, rep: number): void {
    if (!deps.isRunning()) return;
    const deckRef = deps.getDeck();
    if (rep > PLAY_REPS) {
      deps.dom.setIndicator('next...');
      const resume = () => dashPlayAll(cardIdx + 1);
      deps.setPlayResumeFn(resume);
      deps.setPlayTimeout(deps.setTimeout(resume, CARD_GAP));
      return;
    }
    deps.dom.setIndicator('rep ' + rep + '/' + PLAY_REPS);
    deps.playAudioItem(deckRef[cardIdx], () => {
      if (!deps.isRunning() || deps.isPaused()) return;
      const resume = () => dashRepeat(cardIdx, rep + 1);
      deps.setPlayResumeFn(resume);
      deps.setPlayTimeout(deps.setTimeout(resume, REPEAT_GAP));
    });
  }

  // ----- toggleDashboard (app.js L1418) --------------------------------------

  function toggleDashboard(): void {
    deps.setMode(dashboardMode ? 'cards' : 'dashboard');
  }

  return {
    renderDashboard,
    renderCthaiGroups,
    renderDashWordPhrase,
    renderDashConversation,
    renderDashPair,
    dashCardClick,
    playConvAudio,
    clearDashboardHighlights,
    dashPlayAll,
    toggleDashboard,
    setCthaiGroup,
    setCthaiSource,
    isDashboardMode: () => dashboardMode,
    _setDashboardMode: (v: boolean) => {
      dashboardMode = v;
    },
    _getActiveCthaiGroup: () => activeCthaiCategory,
    _getActiveCthaiSource: () => activeCthaiSource,
    _resetCthaiNavForTests: () => {
      activeCthaiCategory = null;
      activeCthaiSource = null;
    },
  };
}
