// Spike 5e: tests for the Top 1000 module.
//
// Setup mirrors the questions module tests: createTop1000Module is fed
// in-memory deps via makeModule(). DOM writes go through a spy Top1000Dom
// so the rendering functions can be exercised without a real document.
// The bundle is built fresh per test via makeBundle() so cases can mutate
// it independently.

import { describe, expect, it, vi } from 'vitest';

import type {
  Top1000Bundle,
  Top1000Conversation,
  Top1000Structure,
} from '../../data/loader';
import type { Top1000Word } from '../../types';
import {
  createTop1000Module,
  type Top1000Dom,
  type Top1000ModuleDeps,
  type Top1000PhraseSegmentLite,
  type Top1000SubTab,
} from './module';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeWord(overrides: Partial<Top1000Word> = {}): Top1000Word {
  return {
    rank: 1,
    thai: 'สวัสดี',
    es: 'sawatdi',
    spanish: 'hola',
    english: 'hello',
    rtgs: 'sawatdi',
    cefr: 'A1',
    freq: 1000,
    notes: '',
    category: 'expresiones',
    tone: 'mid',
    phrase: { thai: 'สวัสดีครับ', es: 'sawatdi khrap', spanish: 'hola', en: 'hello' },
    question: { thai: 'กินข้าวหรือยัง', es: 'kin khao reuu yang', spanish: '¿has comido?' },
    answer: { thai: 'กินแล้ว', es: 'kin laeo', spanish: 'ya comí' },
    ...overrides,
  };
}

function makeStructure(overrides: Partial<Top1000Structure> = {}): Top1000Structure {
  return {
    id: 1,
    name: 'SVO',
    category: 'declarative',
    importance: 4,
    explanation: 'Sujeto-Verbo-Objeto',
    when: 'oraciones simples',
    mistakes: 'orden incorrecto',
    colloquial: '',
    examples: [
      { thai: 'ฉันกินข้าว', rtgs: 'chan kin khao', spanish: 'como arroz', english: 'I eat rice' },
    ],
    ...overrides,
  };
}

function makeConversation(
  overrides: Partial<Top1000Conversation> = {},
): Top1000Conversation {
  return {
    id: 1,
    situation: 'restaurante',
    difficulty: 'A1',
    lines: [
      { thai: 'ขอเมนู', rtgs: 'kho menu', spanish: '¿la carta?', english: 'menu please' },
    ],
    ...overrides,
  };
}

interface PhraseRow {
  id: string | number;
  thai: string;
  rtgs?: string;
  spanish?: string;
  english?: string;
  note?: string;
  structureId?: string | number | null;
}

function makeBundle(overrides: {
  words?: Top1000Word[];
  structures?: Top1000Structure[];
  phrases?: PhraseRow[];
  conversations?: Top1000Conversation[];
  categories?: string[];
  structureCategories?: string[];
  situations?: string[];
} = {}): Top1000Bundle {
  return {
    words: overrides.words ?? [makeWord()],
    categories: (overrides.categories ?? ['expresiones']) as never,
    structureCategories: overrides.structureCategories ?? ['declarative'],
    situations: overrides.situations ?? ['restaurante'],
    structures: overrides.structures ?? [makeStructure()],
    phrases: (overrides.phrases ?? []) as unknown[],
    conversations: overrides.conversations ?? [makeConversation()],
  };
}

interface SpyDom extends Top1000Dom {
  html: string;
}

function makeSpyDom(): SpyDom {
  return {
    html: '',
    setViewHtml(h: string) {
      this.html = h;
    },
    getViewHtml() {
      return this.html;
    },
  };
}

function makeModule(overrides: Partial<Top1000ModuleDeps> = {}): {
  mod: ReturnType<typeof createTop1000Module>;
  dom: SpyDom;
  bundle: Top1000Bundle;
  speakText: ReturnType<typeof vi.fn>;
  renderTone: ReturnType<typeof vi.fn>;
  mountSrsInline: ReturnType<typeof vi.fn>;
  unmountSrsInline: ReturnType<typeof vi.fn>;
  renderDeckPicker: ReturnType<typeof vi.fn>;
  getDeckStats: ReturnType<typeof vi.fn>;
} {
  const bundle = makeBundle();
  const dom = makeSpyDom();
  const speakText = vi.fn();
  const renderTone = vi.fn((t: string) => `<tone>${t}</tone>`);
  const mountSrsInline = vi.fn();
  const unmountSrsInline = vi.fn();
  const renderDeckPicker = vi.fn(() => '<picker/>');
  const getDeckStats = vi.fn(() => ({ due: 0 }));
  const mod = createTop1000Module({
    getBundle: () => bundle,
    speakText,
    renderTone,
    mountSrsInline,
    unmountSrsInline,
    renderDeckPicker,
    getDeckStats,
    srsTop1000DeckKeys: ['palabras', 'estructuras', 'frases'],
    dom,
    ...overrides,
  });
  return {
    mod,
    dom,
    bundle,
    speakText,
    renderTone,
    mountSrsInline,
    unmountSrsInline,
    renderDeckPicker,
    getDeckStats,
  };
}

describe('top1000 module', () => {
  describe('renderTop1000 (sub-tab strip + dispatch)', () => {
    it('renders 5 sub-tab buttons (palabras/estructuras/frases/conversaciones/estudiar)', () => {
      const { mod, dom } = makeModule();
      mod.renderTop1000();
      expect(dom.html).toContain('Palabras');
      expect(dom.html).toContain('Estructuras');
      expect(dom.html).toContain('Frases');
      expect(dom.html).toContain('Conversaciones');
      expect(dom.html).toContain('Estudiar');
      const tabMatches = dom.html.match(/class="top1000-tab(?: active)?"/g) || [];
      expect(tabMatches.length).toBe(5);
    });

    it('marks the active tab based on getFilter().tab', () => {
      const { mod, dom } = makeModule();
      mod.setTop1000Tab('estructuras');
      // setTop1000Tab re-renders automatically; assert active class on Estructuras.
      const tabBlock = dom.html.match(
        /<button class="top1000-tab active" onclick="setTop1000Tab\('estructuras'\)">/,
      );
      expect(tabBlock).not.toBeNull();
    });

    it('dispatches to palabras renderer by default and shows word card', () => {
      const { mod, dom } = makeModule({ getBundle: () => makeBundle({ words: [makeWord()] }) });
      mod.renderTop1000();
      expect(dom.html).toContain('top1000-grid');
      expect(dom.html).toContain('data-thai="สวัสดี"');
    });

    it('renders count badges with per-tab counts', () => {
      const words = [makeWord(), makeWord({ thai: 'อีกคำ', rank: 2 })];
      const { mod, dom } = makeModule({ getBundle: () => makeBundle({ words }) });
      mod.renderTop1000();
      // Palabras tab count = 2.
      const palabrasTab = dom.html.match(
        /onclick="setTop1000Tab\('palabras'\)">Palabras <span class="top1000-tab-count">\((\d+)\)<\/span>/,
      );
      expect(palabrasTab).not.toBeNull();
      expect(palabrasTab![1]).toBe('2');
    });

    it('estudiar tab shows ✓ when no due cards', () => {
      const { mod, dom, getDeckStats } = makeModule();
      getDeckStats.mockReturnValue({ due: 0 });
      mod.renderTop1000();
      const estudiarTab = dom.html.match(
        /onclick="setTop1000Tab\('estudiar'\)">Estudiar <span class="top1000-tab-count">(.*?)<\/span>/,
      );
      expect(estudiarTab).not.toBeNull();
      expect(estudiarTab![1]).toBe('✓');
    });

    it('estudiar tab shows (N due) when SRS has due cards', () => {
      const { mod, dom, getDeckStats } = makeModule();
      getDeckStats.mockImplementation((key: string) => ({
        due: key === 'palabras' ? 5 : 0,
      }));
      mod.renderTop1000();
      const estudiarTab = dom.html.match(
        /onclick="setTop1000Tab\('estudiar'\)">Estudiar <span class="top1000-tab-count">(.*?)<\/span>/,
      );
      expect(estudiarTab).not.toBeNull();
      expect(estudiarTab![1]).toBe('(5 due)');
    });

    it('renders empty shell when bundle is undefined', () => {
      const dom = makeSpyDom();
      const mod = createTop1000Module({
        getBundle: () => undefined,
        dom,
      });
      mod.renderTop1000();
      // Words tab is active by default → "Sin resultados" path.
      expect(dom.html).toContain('Sin resultados');
    });
  });

  describe('setTop1000Tab', () => {
    it('unmounts inline SRS when leaving estudiar', () => {
      const { mod, unmountSrsInline } = makeModule();
      mod.setTop1000Tab('estudiar');
      mod.setTop1000Tab('palabras');
      expect(unmountSrsInline).toHaveBeenCalledTimes(1);
    });

    it('does not unmount SRS when switching between non-estudiar tabs', () => {
      const { mod, unmountSrsInline } = makeModule();
      mod.setTop1000Tab('palabras');
      mod.setTop1000Tab('estructuras');
      expect(unmountSrsInline).not.toHaveBeenCalled();
    });

    it('resets category and search on every tab switch', () => {
      const { mod } = makeModule();
      mod.setTop1000Cat('verbos');
      mod.setTop1000Search('abc');
      mod.setTop1000Tab('frases');
      const filter = mod.getFilter();
      expect(filter.tab).toBe('frases');
      expect(filter.category).toBe('all');
      expect(filter.search).toBe('');
    });
  });

  describe('renderTop1000Words', () => {
    it('shows "Sin resultados" when filter matches nothing', () => {
      const { mod, dom } = makeModule({
        getBundle: () => makeBundle({ words: [makeWord({ category: 'verbos' })] }),
      });
      mod.setTop1000Cat('sustantivos');
      expect(dom.html).toContain('Sin resultados');
    });

    it('filters words by search across thai/es/spanish/english', () => {
      const words = [
        makeWord({ thai: 'อาหาร', spanish: 'comida', english: 'food', rank: 1 }),
        makeWord({ thai: 'น้ำ', spanish: 'agua', english: 'water', rank: 2 }),
      ];
      const { mod, dom } = makeModule({ getBundle: () => makeBundle({ words }) });
      mod.setTop1000Search('agua');
      expect(dom.html).toContain('data-thai="น้ำ"');
      expect(dom.html).not.toContain('data-thai="อาหาร"');
    });

    it('renders tone badge via injected renderTone', () => {
      const { mod, dom, renderTone } = makeModule();
      mod.setTop1000Tab('palabras');
      expect(renderTone).toHaveBeenCalledWith('mid');
      expect(dom.html).toContain('<tone>mid</tone>');
    });

    it('emits inline onclick handlers for category chips and speak buttons', () => {
      const { mod, dom } = makeModule();
      mod.setTop1000Tab('palabras');
      expect(dom.html).toContain("onclick=\"setTop1000Cat('expresiones')\"");
      // Word card speak button (uses top1000Speak).
      expect(dom.html).toContain('top1000Speak(\'สวัสดี\')');
    });

    it('shows category chip counts', () => {
      const words = [
        makeWord({ category: 'verbos', thai: 'v1' }),
        makeWord({ category: 'verbos', thai: 'v2' }),
        makeWord({ category: 'sustantivos', thai: 'n1' }),
      ];
      const { mod, dom } = makeModule({
        getBundle: () =>
          makeBundle({ words, categories: ['verbos', 'sustantivos'] }),
      });
      mod.setTop1000Tab('palabras');
      expect(dom.html).toContain('Verbos (2)');
      expect(dom.html).toContain('Sustantivos (1)');
    });
  });

  describe('renderTop1000Structures', () => {
    it('renders structure cards with rank, category, examples', () => {
      const s = makeStructure();
      const { mod, dom } = makeModule({
        getBundle: () => makeBundle({ structures: [s] }),
      });
      mod.setTop1000Tab('estructuras');
      expect(dom.html).toContain('#1');
      expect(dom.html).toContain('t1-structure-card');
      expect(dom.html).toContain('SVO');
      expect(dom.html).toContain('Ejemplos (1)');
    });

    it('filters structures by search across name + explanation + examples', () => {
      const structures = [
        makeStructure({ id: 1, name: 'SVO', explanation: 'sujeto verbo' }),
        makeStructure({ id: 2, name: 'Negación', explanation: 'no usar mai' }),
      ];
      const { mod, dom } = makeModule({
        getBundle: () =>
          makeBundle({
            structures,
            structureCategories: ['declarative', 'negation'],
          }),
      });
      mod.setTop1000Tab('estructuras');
      mod.setTop1000Search('negación');
      expect(dom.html).toContain('#2');
      expect(dom.html).not.toContain('>#1<'); // rank badge format `>#1<`
    });

    it('renders colloquial section only when present', () => {
      const { mod, dom } = makeModule({
        getBundle: () =>
          makeBundle({
            structures: [
              makeStructure({ id: 1, colloquial: 'en la calle se dice X' }),
              makeStructure({ id: 2, colloquial: '' }),
            ],
          }),
      });
      mod.setTop1000Tab('estructuras');
      expect(dom.html).toContain('en la calle se dice X');
    });
  });

  describe('renderTop1000Phrases', () => {
    it('renders phrase rows with rank + segmented words', () => {
      const phrases: PhraseRow[] = [
        {
          id: 1,
          thai: 'สวัสดี ครับ',
          rtgs: 'sawatdi khrap',
          spanish: 'hola',
          english: 'hello',
        },
      ];
      const { mod, dom } = makeModule({
        getBundle: () =>
          makeBundle({
            words: [makeWord({ thai: 'สวัสดี' }), makeWord({ thai: 'ครับ', rank: 2 })],
            phrases,
          }),
      });
      mod.setTop1000Tab('frases');
      expect(dom.html).toContain('t1-phrase-row');
      expect(dom.html).toContain('t1-phrase-word');
    });

    it('uses injected segment map when available', () => {
      const phrases: PhraseRow[] = [{ id: 'p1', thai: 'abc def' }];
      const segs: Record<string, Top1000PhraseSegmentLite[]> = {
        p1: [{ thai: 'abc', en: 'X' }, { thai: 'def', en: 'Y' }],
      };
      const { mod, dom } = makeModule({
        getBundle: () => makeBundle({ phrases }),
        getPhraseSegments: () => segs as never,
      });
      mod.setTop1000Tab('frases');
      expect(dom.html).toContain('abc');
      expect(dom.html).toContain('def');
    });

    it('filters phrases by search across all fields', () => {
      const phrases: PhraseRow[] = [
        { id: 1, thai: 'aaa', spanish: 'gato', english: 'cat' },
        { id: 2, thai: 'bbb', spanish: 'perro', english: 'dog' },
      ];
      const { mod, dom } = makeModule({
        getBundle: () => makeBundle({ phrases }),
      });
      mod.setTop1000Tab('frases');
      mod.setTop1000Search('perro');
      expect(dom.html).toContain('#2');
      expect(dom.html).not.toContain('>#1<');
    });
  });

  describe('renderTop1000Conversations', () => {
    it('renders conversation cards with situation + difficulty + line count', () => {
      const c = makeConversation({
        id: 7,
        situation: 'restaurante',
        difficulty: 'A1',
        lines: [
          { thai: 'l1', rtgs: 'r1', spanish: 's1', english: 'e1' },
          { thai: 'l2', rtgs: 'r2', spanish: 's2', english: 'e2' },
        ],
      });
      const { mod, dom } = makeModule({
        getBundle: () => makeBundle({ conversations: [c] }),
      });
      mod.setTop1000Tab('conversaciones');
      expect(dom.html).toContain('t1-convo-card');
      expect(dom.html).toContain('A1 · 2 líneas');
      expect(dom.html).toContain('t1-convo-line');
    });

    it('filters conversations by situation chip', () => {
      const conversations = [
        makeConversation({ id: 1, situation: 'restaurante' }),
        makeConversation({ id: 2, situation: 'taxi' }),
      ];
      const { mod, dom } = makeModule({
        getBundle: () =>
          makeBundle({
            conversations,
            situations: ['restaurante', 'taxi'],
          }),
      });
      mod.setTop1000Tab('conversaciones');
      mod.setTop1000Cat('taxi');
      expect(dom.html).toContain('#2');
      expect(dom.html).not.toContain('>#1<');
    });
  });

  describe('renderTop1000StudyBody', () => {
    it('returns SRS-unavailable message when hooks are missing', () => {
      const dom = makeSpyDom();
      const mod = createTop1000Module({
        getBundle: () => undefined,
        dom,
        // no mountSrsInline / renderDeckPicker
      });
      const html = mod.renderTop1000StudyBody();
      expect(html).toContain('SRS no disponible');
    });

    it('mounts inline SRS and returns deck picker HTML', () => {
      const { mod, mountSrsInline, renderDeckPicker } = makeModule();
      const html = mod.renderTop1000StudyBody();
      expect(mountSrsInline).toHaveBeenCalledWith(
        'top1000View',
        expect.any(Function),
        ['palabras', 'estructuras', 'frases'],
      );
      expect(renderDeckPicker).toHaveBeenCalled();
      expect(html).toBe('<picker/>');
    });

    it('onExit callback routes back to the estudiar tab', () => {
      const { mod, mountSrsInline } = makeModule();
      mod.renderTop1000StudyBody();
      const onExit = mountSrsInline.mock.calls[0][1] as () => void;
      const before = mod.getFilter().tab;
      onExit();
      const after = mod.getFilter().tab;
      // Calling onExit should land on 'estudiar' (per legacy contract).
      expect(before).not.toBe('estudiar');
      expect(after).toBe('estudiar');
    });
  });

  describe('top1000Speak', () => {
    it('forwards to deps.speakText', () => {
      const { mod, speakText } = makeModule();
      mod.top1000Speak('hi');
      expect(speakText).toHaveBeenCalledWith('hi');
    });

    it('is a no-op when speakText is not provided', () => {
      const dom = makeSpyDom();
      const mod = createTop1000Module({
        getBundle: () => undefined,
        dom,
      });
      expect(() => mod.top1000Speak('hi')).not.toThrow();
    });
  });

  describe('segmentPhraseThai', () => {
    it('returns the whole-word lookup when the phrase matches a word', () => {
      const words = [makeWord({ thai: 'ครับ' })];
      const { mod } = makeModule({ getBundle: () => makeBundle({ words }) });
      const segs = mod.segmentPhraseThai('ครับ');
      expect(segs).toHaveLength(1);
      expect(segs[0].thai).toBe('ครับ');
    });

    it('marks unknown chars with _unknown when no dictionary entry matches', () => {
      const { mod } = makeModule({ getBundle: () => makeBundle({ words: [] }) });
      const segs = mod.segmentPhraseThai('xyz');
      expect(segs).toHaveLength(3);
      expect(segs.every((s) => s._unknown === true)).toBe(true);
    });

    it('greedy-matches longest dictionary entry first', () => {
      const words = [
        makeWord({ thai: 'abc', rank: 1 }),
        makeWord({ thai: 'a', rank: 2 }),
      ];
      const { mod } = makeModule({ getBundle: () => makeBundle({ words }) });
      const segs = mod.segmentPhraseThai('abc');
      expect(segs).toHaveLength(1);
      expect(segs[0].thai).toBe('abc');
    });
  });

  describe('getFilter', () => {
    it('returns a snapshot copy (mutation does not bleed into module)', () => {
      const { mod } = makeModule();
      const f1 = mod.getFilter();
      f1.tab = 'estructuras' as Top1000SubTab;
      const f2 = mod.getFilter();
      expect(f2.tab).toBe('palabras');
    });
  });
});
