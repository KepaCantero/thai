// Spike 5c PR1: tests for the cards module pure-logic half.
//
// Setup pattern: state is manipulated via the real typed setters (no mocks),
// cthai plays store is reset between tests (mocked in-memory because the test
// environment is node, not jsdom), and createCardsModule is fed in-memory
// deps via makeModule(). This mirrors the tones module test style.

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test environment is node (vitest.config.ts) so the real cthaiPlaysStore
// would no-op every write. Stub it with an in-memory map.
let cthaiPlaysState: Record<string, { q?: number; a?: number }> = {};
vi.mock('../../persistence/stores', () => ({
  cthaiPlaysStore: {
    get: () => cthaiPlaysState,
    set: (v: typeof cthaiPlaysState) => { cthaiPlaysState = v; },
  },
}));

import {
  setActiveCategory,
  setActiveLesson,
  setActiveType,
  setSearchQuery,
} from '../../state';
import { cthaiPlaysStore } from '../../persistence/stores';
import type { Conversation, DataShape } from '../../types';
import { createCardsModule, type CardsModuleDeps } from './module';

beforeEach(() => {
  setActiveLesson('all');
  setActiveCategory('all');
  setActiveType('all');
  setSearchQuery('');
  cthaiPlaysState = {};
});

function makeData(overrides: Partial<DataShape> = {}): DataShape {
  return {
    words: [
      { thai: 'หมา', phonetic: 'mǎa', es: 'maa', tone: 'r', spanish: 'perro', en: 'dog', category: 'animales', lesson: 1 },
      { thai: 'ม้า', phonetic: 'máa', es: 'maa', tone: 'h', spanish: 'caballo', en: 'horse', category: 'animales', lesson: 1 },
      { thai: 'ข้าว', phonetic: 'kâao', es: 'kao', tone: 'f-l', spanish: 'arroz', en: 'rice', category: 'comida', lesson: 2 },
    ],
    phrases: [
      { thai: 'สวัสดี', phonetic: 'sàwàtdii', es: 'sawadi', tone: 'f-l', spanish: 'hola', en: 'hello', category: 'saludos', lesson: 1 },
    ],
    conversations: [
      {
        thai: 'ไปไหน', phonetic: 'pai nǎi', es: 'pai nai', tone: 'm',
        q_thai: 'ไปไหน', q_phonetic: 'pai nǎi', q_es: 'pai nai', q_tone: 'm', q_spanish: '¿A dónde vas?', q_en: 'Where are you going?',
        a_thai: 'ไปตลาด', a_phonetic: 'pai dtalàat', a_es: 'pai talat', a_tone: 'f-l', a_spanish: 'Voy al mercado.', a_en: "I'm going to the market.",
        category: 'saludos', lesson: 1, verified: true,
      },
      {
        thai: 'cthai-1', phonetic: '', es: '', tone: '',
        q_thai: 'cthai q', q_phonetic: '', q_es: '', q_tone: '', q_spanish: 'q es', q_en: 'q en',
        a_thai: 'cthai a', a_phonetic: '', a_es: '', a_tone: '', a_spanish: 'a es', a_en: 'a en',
        category: 'youtube', lesson: 0, verified: false, source: 'yt-ABC',
      },
    ],
    pairs: [
      { w1: 'หมา', w2: 'ม้า', note: 'r vs h', category: 'tones' },
    ],
    practica: [],
    janus: [],
    ...overrides,
  } as unknown as DataShape;
}

function makeModule(overrides: Partial<CardsModuleDeps> = {}) {
  const data = makeData();
  return createCardsModule({
    getData: () => data,
    getTones: () => ({
      m: { symbol: '→', name: 'mid', color: '#888' },
      l: { symbol: '↓', name: 'low', color: '#3aa' },
      r: { symbol: '↗', name: 'rising', color: '#a3a' },
      f: { symbol: '↘', name: 'falling', color: '#a33' },
      h: { symbol: '↑', name: 'high', color: '#3a3' },
    }),
    getThaiEn: () => ({ 'หมา': 'dog' }),
    getPhraseEn: () => ({ 'สวัสดี': { q: 'hello', a: '' } }),
    getConvEn: () => ({ 'ไปไหน': { q: 'Where are you going?', a: "I'm going to the market." } }),
    getCatLabels: () => ({ animales: 'Animales', comida: 'Comida' }),
    getTop1000Words: () => [
      { thai: 'ไป', rank: 5 },
      { thai: 'ตลาด', rank: 800 },
    ],
    getDeletedQaKeys: () => new Set<string>(),
    getShowUnverified: () => true,
    ...overrides,
  });
}

describe('createCardsModule — buildDeck', () => {
  it('returns words only when activeType is "words"', () => {
    const m = makeModule();
    // Cast through unknown because the typed setter is singular-only but
    // legacy app.js stores the plural form (setType('words')); the module
    // must accept both.
    setActiveType('words' as unknown as Parameters<typeof setActiveType>[0]);
    const deck = m.buildDeck();
    expect(deck.every((c) => c.type === 'word')).toBe(true);
    expect(deck.map((c) => c.thai).sort()).toEqual(['ข้าว', 'ม้า', 'หมา']);
  });

  it('filters by lesson number (boundary: lesson 1, lesson "all")', () => {
    const m = makeModule();
    setActiveLesson('1');
    // Lesson 1: includes words/phrases/conversations with lesson=1. The
    // cthai-1 conv has lesson=0 which matchLesson normalizes to 1, so it
    // stays in the deck when SHOW_UNVERIFIED is true.
    const lesson1Thais = m.buildDeck().map((c) => c.thai || c.q_thai).sort();
    expect(lesson1Thais).toContain('หมา');
    expect(lesson1Thais).toContain('ม้า');
    expect(lesson1Thais).toContain('สวัสดี');
    // Lesson 2: only ข้าว has lesson=2. (Pairs don't apply the lesson
    // filter in legacy app.js, so the tone pair stays in the deck.)
    setActiveLesson('2');
    const lesson2 = m.buildDeck();
    expect(lesson2.filter((c) => c.type === 'word').map((c) => c.thai)).toEqual(['ข้าว']);
    expect(lesson2.filter((c) => c.type === 'pair')).toHaveLength(1);
    // 'all' includes every type.
    setActiveLesson('all');
    const allTypes = m.buildDeck().map((c) => c.type);
    expect(allTypes).toContain('word');
    expect(allTypes).toContain('phrase');
    expect(allTypes).toContain('conversation');
    expect(allTypes).toContain('pair');
  });

  it('virtual lessons: youtube, dificiles, cthai', () => {
    const m = makeModule();
    // youtube: only items with category 'youtube' (legacy behavior — pairs
    // and the cthai conv with category 'youtube' pass through; non-youtube
    // words/phrases/conversations are filtered out).
    setActiveLesson('youtube');
    const yt = m.buildDeck();
    expect(yt.length).toBeGreaterThan(0);
    // Every conversation in the youtube deck has category 'youtube'.
    const ytConvs = yt.filter((c) => c.type === 'conversation');
    expect(ytConvs.every((c) => (c as { category?: string }).category === 'youtube')).toBe(true);
    // dificiles: membership filter applied at call sites — lesson match
    // passes everything, so the deck is non-empty.
    setActiveLesson('dificiles');
    expect(m.buildDeck().length).toBeGreaterThan(0);
    // cthai: only verified:false entries
    setActiveLesson('cthai');
    const ct = m.buildDeck();
    expect(ct.length).toBe(1);
    expect((ct[0] as unknown as { verified?: boolean }).verified).toBe(false);
  });

  it('tone filter "tone:m" matches split tones like "m-l"', () => {
    const m = makeModule();
    setActiveCategory('tone:m');
    // ไปไหน (q_tone 'm', a_tone 'f-l'); conversations match when either side matches
    const deck = m.buildDeck();
    const convs = deck.filter((c) => c.type === 'conversation');
    expect(convs.map((c) => c.q_thai)).toContain('ไปไหน');
  });

  it('pares category returns pair cards and ignores type filter', () => {
    const m = makeModule();
    setActiveCategory('pares');
    setActiveType('words' as unknown as Parameters<typeof setActiveType>[0]);
    const deck = m.buildDeck();
    expect(deck.every((c) => c.type === 'pair')).toBe(true);
    expect(deck).toHaveLength(1);
  });

  it('excludes deleted-QA keys (stubbed non-empty set)', () => {
    const m = makeModule({
      getDeletedQaKeys: () => new Set(['ไปไหน||ไปตลาด']),
    });
    const deck = m.buildDeck();
    const convs = deck.filter((c) => c.type === 'conversation');
    // Only the non-deleted conversation (cthai-1) survives.
    expect(convs).toHaveLength(1);
    expect((convs[0] as { q_thai?: string }).q_thai).toBe('cthai q');
  });

  it('search matches THAI_EN / PHRASE_EN / CONV_EN cross-fields', () => {
    const m = makeModule();
    // 'dog' is only in THAI_EN[หมา]; not on the item's .en field directly.
    setSearchQuery('dog');
    const deck = m.buildDeck();
    expect(deck.map((c) => c.thai)).toContain('หมา');
    setSearchQuery('hello');
    expect(m.buildDeck().map((c) => c.thai)).toContain('สวัสดี');
    setSearchQuery('market');
    expect(m.buildDeck().map((c) => c.q_thai)).toContain('ไปไหน');
  });
});

describe('createCardsModule — buildQuestionsDeck', () => {
  it('dedupes by 4-tuple (q_thai||a_thai||q_spanish||a_spanish)', () => {
    // Duplicate conversations should collapse to one entry.
    const conv = makeData().conversations[0];
    const data = makeData({
      conversations: [conv, { ...conv }, { ...conv }] as Conversation[],
    });
    const m = makeModule({ getData: () => data });
    const items = m.buildQuestionsDeck();
    expect(items).toHaveLength(1);
  });
});

describe('createCardsModule — cthai helpers', () => {
  it('cthaiCardFreqRank returns min rank across Q+A text; 9999 when no match', () => {
    const m = makeModule();
    // Conv with q_thai='cthai q', a_thai='cthai a' — no TOP1000 words present.
    const cthaiConv = makeData().conversations[1] as Conversation;
    expect(m.cthaiCardFreqRank(cthaiConv)).toBe(9999);

    // Conv with 'ไป' (rank 5) and 'ตลาด' (rank 800) → min is 5.
    const rankConv = {
      ...cthaiConv,
      q_thai: 'ไป',
      a_thai: 'ตลาด',
    } as Conversation;
    expect(m.cthaiCardFreqRank(rankConv)).toBe(5);
  });

  it('cthaiCardDone requires both Q and A plays ≥ CTHAI_THRESHOLD', () => {
    const m = makeModule();
    const item = makeData().conversations[1] as Conversation;
    const id = m.cthaiCardId(item);
    // Empty: not done.
    expect(m.cthaiCardDone(item)).toBe(false);
    // Only Q reaches threshold.
    cthaiPlaysStore.set({ [id]: { q: 10, a: 5 } });
    expect(m.cthaiCardDone(item)).toBe(false);
    // Both reach threshold.
    cthaiPlaysStore.set({ [id]: { q: 10, a: 10 } });
    expect(m.cthaiCardDone(item)).toBe(true);
    // Above threshold counts as done.
    cthaiPlaysStore.set({ [id]: { q: 99, a: 99 } });
    expect(m.cthaiCardDone(item)).toBe(true);
  });

  it('cthaiCountPlays clamps at CTHAI_THRESHOLD', () => {
    const m = makeModule();
    const item = makeData().conversations[1] as Conversation;
    const id = m.cthaiCardId(item);
    cthaiPlaysStore.set({ [id]: { q: 25, a: 3 } });
    expect(m.cthaiCountPlays(item, 'q')).toBe(10);
    expect(m.cthaiCountPlays(item, 'a')).toBe(3);
  });

  it('cthaiCardId is stable across calls and includes source', () => {
    const m = makeModule();
    const item = makeData().conversations[1] as Conversation;
    const id1 = m.cthaiCardId(item);
    const id2 = m.cthaiCardId(item);
    expect(id1).toBe(id2);
    expect(id1.startsWith('yt-ABC||')).toBe(true);
  });
});

describe('createCardsModule — misc', () => {
  it('isVerifiedEntry honors SHOW_UNVERIFIED flag', () => {
    const item = { verified: false } as Conversation;
    expect(makeModule({ getShowUnverified: () => true }).isVerifiedEntry(item)).toBe(true);
    expect(makeModule({ getShowUnverified: () => false }).isVerifiedEntry(item)).toBe(false);
    // verified:true passes regardless
    const ok = { verified: true } as Conversation;
    expect(makeModule({ getShowUnverified: () => false }).isVerifiedEntry(ok)).toBe(true);
  });

  it('cardKey falls back through thai → q_thai → w1.thai', () => {
    const m = makeModule();
    expect(m.cardKey({ thai: 'a' } as never)).toBe('a');
    expect(m.cardKey({ q_thai: 'b' } as never)).toBe('b');
    expect(m.cardKey({ w1: { thai: 'c' } } as never)).toBe('c');
    expect(m.cardKey({} as never)).toBe('');
    expect(m.cardKey(null)).toBe('');
  });

  it('getThaiFreqMap is cached and rebuilt only when empty', () => {
    const wordsSpy = vi.fn(() => [{ thai: 'ไป', rank: 5 }]);
    const m = makeModule({ getTop1000Words: wordsSpy });
    m.getThaiFreqMap();
    m.getThaiFreqMap();
    expect(wordsSpy).toHaveBeenCalledTimes(1);
  });
});
