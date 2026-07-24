// Spike 5c PR1+PR2: tests for the cards module.
//
// PR1 covers the pure-logic half (buildDeck, buildQuestionsDeck, cthai
// analytics, cardKey). PR2 adds DOM/rendering/scoring/FSM coverage. Setup
// pattern: state is manipulated via the real typed setters (no mocks), cthai
// plays store is reset between tests (mocked in-memory because the test
// environment is node, not jsdom), and createCardsModule is fed in-memory
// deps via makeModule(). PR2 tests inject a CardsDom spy object so the
// rendering/FSM functions can be exercised without a real document.

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test environment is node (vitest.config.ts) so the real cthaiPlaysStore
// would no-op every write. Stub it with an in-memory map. difficultStore is
// stubbed the same way so toggleDifficult / isDifficult round-trip in tests.
let cthaiPlaysState: Record<string, { q?: number; a?: number }> = {};
let difficultState: string[] = [];
vi.mock('../../persistence/stores', () => ({
  cthaiPlaysStore: {
    get: () => cthaiPlaysState,
    set: (v: typeof cthaiPlaysState) => { cthaiPlaysState = v; },
    update: (fn: (cur: typeof cthaiPlaysState) => typeof cthaiPlaysState) => {
      cthaiPlaysState = fn(cthaiPlaysState);
    },
  },
  difficultStore: {
    get: () => difficultState,
    set: (v: string[]) => { difficultState = v; },
  },
  modeStore: {
    get: () => 'cards',
    set: (_v: string) => { /* no-op for tests */ },
  },
}));

import {
  setActiveCategory,
  setActiveLesson,
  setActiveType,
  setSearchQuery,
  setDeck,
  setIdx,
  clearKnown,
} from '../../state';
import { cthaiPlaysStore } from '../../persistence/stores';
import type { Card, Conversation, DataShape } from '../../types';
import {
  createCardsModule,
  type CardsDom,
  type CardsModuleDeps,
} from './module';

beforeEach(() => {
  setActiveLesson('all');
  setActiveCategory('all');
  setActiveType('all');
  setSearchQuery('');
  cthaiPlaysState = {};
  // PR2: reset deck + scoring state so tests don't leak across cases.
  setDeck([]);
  setIdx(0);
  clearKnown();
  difficultState = [];
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
        category: 'youtube', lesson: 0, source: 'cthai:yt-ABC',
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
    // PR2 default stubs — overridable per-test. PR1 tests don't touch the DOM
    // surface, so a no-op object suffices.
    dom: makeNoopDom(),
    playAudioItem: () => {},
    speakText: () => {},
    stopCurrentAudio: () => {},
    renderTone: () => '',
    renderWB: () => '',
    getEn: (item: Card) =>
      (item as { spanish?: string }).spanish ??
      (item as { q_spanish?: string }).q_spanish ??
      '',
    setTimeout: () => 0,
    clearTimeout: () => {},
    ...overrides,
  });
}

/** No-op CardsDom for PR1 tests that never touch rendering. */
function makeNoopDom(): CardsDom {
  return {
    setFront: () => {},
    setBack: () => {},
    setPhraseHint: () => {},
    setCardFlipped: () => {},
    setCardTypeClass: () => {},
    setProgress: () => {},
    setStats: () => {},
    setEmptyHint: () => {},
    setDiffBtnState: () => {},
    setPlayBtn: () => {},
    setPlayIndicator: () => {},
    setPlayProgress: () => {},
  };
}

/**
 * PR2 helper: build a CardsDom backed by vi.fn() spies and return both the
 * adapter and the spies record so tests can assert call args.
 */
function makeSpyDom(): { dom: CardsDom; spies: Record<string, ReturnType<typeof vi.fn>> } {
  const spies = {
    setFront: vi.fn(),
    setBack: vi.fn(),
    setPhraseHint: vi.fn(),
    setCardFlipped: vi.fn(),
    setCardTypeClass: vi.fn(),
    setProgress: vi.fn(),
    setStats: vi.fn(),
    setEmptyHint: vi.fn(),
    setDiffBtnState: vi.fn(),
    setPlayBtn: vi.fn(),
    setPlayIndicator: vi.fn(),
    setPlayProgress: vi.fn(),
  };
  return { dom: spies as unknown as CardsDom, spies };
}

/**
 * Fake timer bag that captures scheduled callbacks for synchronous FSM tests.
 * runAll() flushes the queue in insertion order. Tests assert against
 * pendingCount() and the spy calls on the deps they passed in.
 */
function makeFakeTimers(): {
  setTimeout: (fn: () => void, ms: number) => number;
  clearTimeout: (id: number | undefined) => void;
  runAll: () => void;
  pendingCount: () => number;
} {
  let next = 1;
  const queue = new Map<number, () => void>();
  return {
    setTimeout: (fn, _ms) => {
      const id = next++;
      queue.set(id, fn);
      return id;
    },
    clearTimeout: (id) => {
      if (id != null) queue.delete(id);
    },
    runAll: () => {
      const fns = [...queue.values()];
      queue.clear();
      fns.forEach((f) => f());
    },
    pendingCount: () => queue.size,
  };
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
    // cthai: only CT entries (source starts with 'cthai:')
    setActiveLesson('cthai');
    const ct = m.buildDeck();
    expect(ct.length).toBe(1);
    expect((ct[0] as unknown as { source?: string }).source).toBe('cthai:yt-ABC');
  });

  it('cthai: regression — CT cards appear even when SHOW_UNVERIFIED is false', () => {
    // Regression for the filter-ordering bug at module.ts:~404. Before the
    // fix, isVerifiedEntry(c) ran BEFORE matchLesson(c, lf) — so when
    // SHOW_UNVERIFIED was false, all CT cards were silently dropped from the
    // cthai deck. CT detection is now source-based (`source: 'cthai:*'`),
    // so this test pins the dangerous default-off path. If isVerifiedEntry
    // is ever re-ordered before matchLesson again, the deck here would be
    // empty and the assertion would fail.
    const m = makeModule({ getShowUnverified: () => false });
    setActiveLesson('cthai');
    const ct = m.buildDeck();
    // Deck is non-empty…
    expect(ct.length).toBeGreaterThan(0);
    // …and every entry is a CT conversation (source-based contract).
    expect(
      ct.every(
        (c) =>
          c.type === 'conversation' &&
          (c as unknown as { source?: string }).source?.startsWith('cthai:') === true,
      ),
    ).toBe(true);
  });
});

describe('createCardsModule — buildQuestionsDeck', () => {

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
    // Use lesson 1 so both fixture conversations are eligible: ไปไหน has
    // lesson=1 directly, cthai-1 has lesson=0 (normalized to 1 by legacy
    // `(item.lesson || 1)` fallback). In 'all', cthai-1 is excluded by
    // matchLesson's !isCthaiEntry guard, which would leave no survivor to
    // observe the deleted-key filter against.
    setActiveLesson('1');
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
    expect(id1.startsWith('cthai:yt-ABC||')).toBe(true);
  });

  it('bumpCthaiPlay round-trips through cthaiPlaysStore so cthaiCardDone flips true (regression for 1a60430)', () => {
    // Regression for commit 1a60430: legacy app.js used to write to an
    // in-memory `cthaiPlays` map while the typed cards module read from
    // `cthaiPlaysStore` — two separate stores, so plays silently
    // disappeared and cthaiCardDone never flipped. This test pins the
    // contract: bumpCthaiPlay MUST write through cthaiPlaysStore (the same
    // store cthaiCardDone reads), and reaching the threshold on both Q and
    // A sides MUST mark the card done. An item below the threshold on
    // either side MUST stay undone.
    const m = makeModule();
    const item = makeData().conversations[1] as Conversation;

    // 9 bumps on Q: below threshold, not done.
    for (let i = 0; i < 9; i++) m.bumpCthaiPlay(item, 'q');
    expect(m.cthaiCountPlays(item, 'q')).toBe(9);
    expect(m.cthaiCardDone(item)).toBe(false);

    // 10th Q bump reaches threshold on Q, but A is still 0 → not done.
    m.bumpCthaiPlay(item, 'q');
    expect(m.cthaiCountPlays(item, 'q')).toBe(10);
    expect(m.cthaiCardDone(item)).toBe(false);

    // 10 A bumps complete the contract → done.
    for (let i = 0; i < 10; i++) m.bumpCthaiPlay(item, 'a');
    expect(m.cthaiCountPlays(item, 'a')).toBe(10);
    expect(m.cthaiCardDone(item)).toBe(true);

    // Sanity: a different item with zero plays is not done.
    const other = { ...item, q_thai: 'other-q', a_thai: 'other-a' } as Conversation;
    expect(m.cthaiCardDone(other)).toBe(false);
  });
});

describe('createCardsModule — misc', () => {
  it('isVerifiedEntry honors SHOW_UNVERIFIED flag (CT detected by source)', () => {
    // CT entry (source starts with 'cthai:') — filtered out unless SHOW_UNVERIFIED.
    const ct = { source: 'cthai:test' } as unknown as Conversation;
    expect(makeModule({ getShowUnverified: () => true }).isVerifiedEntry(ct)).toBe(true);
    expect(makeModule({ getShowUnverified: () => false }).isVerifiedEntry(ct)).toBe(false);
    // Non-CT entry (no source) — always passes.
    const ok = {} as Conversation;
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

// ---------------------------------------------------------------------------
// PR2 — showCard / rendering
// ---------------------------------------------------------------------------

describe('createCardsModule — showCard rendering', () => {
  it('showCard on empty deck clears the face and writes "0 / 0" progress', () => {
    const { dom, spies } = makeSpyDom();
    const m = makeModule({ dom });
    setDeck([]);
    m.showCard();
    expect(spies.setProgress).toHaveBeenCalledWith('0 / 0');
    expect(spies.setStats).toHaveBeenCalledWith('');
    // Empty path clears the back face.
    expect(spies.setBack).toHaveBeenCalledWith(
      expect.objectContaining({ word: '', phonetic: '' }),
    );
  });

  it('showCard for a conversation card sets the conversation type class', () => {
    const { dom, spies } = makeSpyDom();
    const m = makeModule({
      dom,
      renderTone: () => '<tone>',
      renderWB: () => '<wb>',
      getEn: () => 'q -> a',
    });
    const conv = makeData().conversations[0] as unknown as Card;
    conv.type = 'conversation';
    setDeck([conv]);
    setIdx(0);
    m.showCard();
    expect(spies.setCardTypeClass).toHaveBeenCalledWith('conversation');
    expect(spies.setPhraseHint).toHaveBeenCalledWith('Conversation');
    // Front shows the Q label prefixed.
    expect(spies.setFront).toHaveBeenCalledWith(
      expect.objectContaining({ word: '<span class="qa-label">Q</span>ไปไหน' }),
    );
  });

  it('showCard for a pair card sets the pair type class and uses composite thai', () => {
    const { dom, spies } = makeSpyDom();
    const m = makeModule({
      dom,
      renderTone: () => '<t>',
      renderWB: () => '',
      getEn: () => 'dog / horse',
    });
    // Build a pair card with w1/w2 resolved (as buildDeck does).
    const data = makeData();
    const pair = {
      type: 'pair',
      w1: data.words[0],
      w2: data.words[1],
      note: 'r vs h',
      category: 'tones',
      thai: 'หมา / ม้า',
    } as unknown as Card;
    setDeck([pair]);
    setIdx(0);
    m.showCard();
    expect(spies.setCardTypeClass).toHaveBeenCalledWith('pair');
    expect(spies.setPhraseHint).toHaveBeenCalledWith('Tone Pair');
    // Front html includes both thai words.
    expect(spies.setFront).toHaveBeenCalledWith(
      expect.objectContaining({ word: expect.stringContaining('หมา') }),
    );
    const frontCall = spies.setFront.mock.calls[0][0];
    expect(frontCall.word).toContain('ม้า');
    expect(frontCall.word).toContain('vs');
  });
});

// ---------------------------------------------------------------------------
// PR2 — scoring
// ---------------------------------------------------------------------------

describe('createCardsModule — scoring', () => {
  it('markCard(true) records known, fires onScoreCard, advances idx', () => {
    const onScoreCard = vi.fn();
    const { dom, spies } = makeSpyDom();
    const m = makeModule({ dom, onScoreCard, renderTone: () => '', getEn: () => 'dog' });
    const card = { type: 'word', thai: 'หมา', spanish: 'perro' } as unknown as Card;
    const card2 = { ...card, thai: 'ม้า' } as unknown as Card;
    setDeck([card, card2]);
    setIdx(0);
    m.markCard(true);
    // The SRS hook received the card's thai.
    expect(onScoreCard).toHaveBeenCalledWith('หมา', true);
    // markCard calls nextCard at the end -> idx advances from 0 to 1, which
    // causes showCard (called by nextCard) to write progress "2 / 2".
    expect(spies.setProgress).toHaveBeenLastCalledWith('2 / 2');
  });

  it('toggleDifficult flips the difficult state for the current card key', () => {
    const { dom, spies } = makeSpyDom();
    const m = makeModule({ dom });
    const card = { type: 'word', thai: 'หมา' } as unknown as Card;
    setDeck([card]);
    setIdx(0);
    // Initially off.
    m.updateDifficultBtn();
    expect(spies.setDiffBtnState).toHaveBeenLastCalledWith(false);
    // Toggle on.
    m.toggleDifficult();
    m.updateDifficultBtn();
    expect(spies.setDiffBtnState).toHaveBeenLastCalledWith(true);
    // Toggle back off.
    m.toggleDifficult();
    m.updateDifficultBtn();
    expect(spies.setDiffBtnState).toHaveBeenLastCalledWith(false);
  });
});

// ---------------------------------------------------------------------------
// PR2 — Play All FSM
// ---------------------------------------------------------------------------

describe('createCardsModule — Play All FSM', () => {
  it('startPlayAll sets running, renders the pause button, schedules playRepeat', () => {
    const { dom, spies } = makeSpyDom();
    const timers = makeFakeTimers();
    const playAudioItem = vi.fn((_item: Card, onDone?: () => void) => {
      // Immediately fire onDone so the FSM schedules the next rep.
      if (onDone) onDone();
    });
    const m = makeModule({
      dom,
      setTimeout: timers.setTimeout,
      clearTimeout: timers.clearTimeout,
      playAudioItem,
    });
    const card = { type: 'word', thai: 'หมา', spanish: 'perro' } as unknown as Card;
    setDeck([card]);
    setIdx(0);

    m.startPlayAll(0);
    // Running flag flipped, button shows pause.
    expect(spies.setPlayBtn).toHaveBeenCalledWith('pause');
    // Indicator shows rep 1/4.
    expect(spies.setPlayIndicator).toHaveBeenCalledWith('rep 1/4 — repeat!');
    // Audio was invoked.
    expect(playAudioItem).toHaveBeenCalled();
    // Because playAudioItem fired onDone synchronously, the FSM scheduled the
    // next rep via setTimeout — one timer pending.
    expect(timers.pendingCount()).toBe(1);
  });

  it('stopPlayAll clears running, the timer, and resets the play button', () => {
    const { dom, spies } = makeSpyDom();
    const timers = makeFakeTimers();
    const playAudioItem = vi.fn();
    const m = makeModule({
      dom,
      setTimeout: timers.setTimeout,
      clearTimeout: timers.clearTimeout,
      playAudioItem,
    });
    const card = { type: 'word', thai: 'หมา' } as unknown as Card;
    setDeck([card]);
    setIdx(0);
    m.startPlayAll(0);
    expect(timers.pendingCount()).toBe(0); // no onDone -> no timer from playRepeat
    m.stopPlayAll();
    // Button reset to play.
    expect(spies.setPlayBtn).toHaveBeenLastCalledWith('play');
    // Indicator + progress cleared.
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('');
    expect(spies.setPlayProgress).toHaveBeenLastCalledWith('');
  });

  it('pausePlayAll then resumePlayAll flips paused and runs the saved resume fn', () => {
    const { dom, spies } = makeSpyDom();
    const timers = makeFakeTimers();
    // playAudioItem captures onDone without firing — we drive it manually so
    // we can observe the pause/resume transition.
    let capturedOnDone: (() => void) | null = null;
    const playAudioItem = vi.fn((_item: Card, onDone?: () => void) => {
      capturedOnDone = onDone ?? null;
    });
    const m = makeModule({
      dom,
      setTimeout: timers.setTimeout,
      clearTimeout: timers.clearTimeout,
      playAudioItem,
    });
    const card = { type: 'word', thai: 'หมา' } as unknown as Card;
    setDeck([card]);
    setIdx(0);

    m.startPlayAll(0);
    expect(spies.setPlayBtn).toHaveBeenLastCalledWith('pause');
    // Fire the audio completion -> FSM schedules the next rep via setTimeout.
    expect(capturedOnDone).not.toBeNull();
    capturedOnDone!();
    expect(timers.pendingCount()).toBe(1);

    // Pause: pending timer cleared, button shows resume, indicator says paused.
    m.pausePlayAll();
    expect(timers.pendingCount()).toBe(0);
    expect(spies.setPlayBtn).toHaveBeenLastCalledWith('resume');
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('⏸ paused');

    // Resume runs the saved resume fn, which re-enters playRepeat(rep+1).
    m.resumePlayAll();
    expect(spies.setPlayBtn).toHaveBeenLastCalledWith('pause');
    // playRepeat(rep+1) = rep 2 fired another indicator write.
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('rep 2/4 — repeat!');
  });

  it('playRepeat after PLAY_REPS schedules regularPlayAll(idx+1) via CARD_GAP', () => {
    const { dom, spies } = makeSpyDom();
    const timers = makeFakeTimers();
    // Fire onDone synchronously so each rep chains immediately.
    const playAudioItem = vi.fn((_item: Card, onDone?: () => void) => {
      if (onDone) onDone();
    });
    const m = makeModule({
      dom,
      setTimeout: timers.setTimeout,
      clearTimeout: timers.clearTimeout,
      playAudioItem,
    });
    const c1 = { type: 'word', thai: 'หมา' } as unknown as Card;
    const c2 = { type: 'word', thai: 'ม้า' } as unknown as Card;
    setDeck([c1, c2]);
    setIdx(0);

    m.startPlayAll(0);
    // Each rep fires onDone synchronously, which schedules the next rep via
    // REPEAT_GAP. runAll() snapshots and drains pending timers in one wave;
    // new timers added during execution land in a fresh queue. So each
    // runAll() advances exactly one rep.
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('rep 1/4 — repeat!');
    timers.runAll(); // -> rep 2/4
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('rep 2/4 — repeat!');
    timers.runAll(); // -> rep 3/4
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('rep 3/4 — repeat!');
    timers.runAll(); // -> rep 4/4
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('rep 4/4 — repeat!');
    timers.runAll(); // rep > PLAY_REPS -> "next...", schedules regularPlayAll(1)
    expect(spies.setPlayIndicator).toHaveBeenLastCalledWith('next...');
    // Flush the CARD_GAP timer -> regularPlayAll(1) renders card 2 and writes
    // progress "2 / 2".
    timers.runAll();
    expect(spies.setPlayProgress).toHaveBeenLastCalledWith('2 / 2');
  });
});
