// Spike 5h: tests for the SrsModule factory.
//
// Focus is the pure scheduling engine + session building + stats — the parts
// that need correctness guarantees. DOM-heavy UI rendering is exercised
// through the legacy surface override and is verified visually at boot.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createSrsModule,
  SRS_DAY_SEC,
  SRS_LAPSE_SEC,
  SRS_LEARN_AGAIN_SEC,
  SRS_LEARN_HARD_SEC,
  SRS_NEW_PER_DAY,
} from './module';
import type { SrsCardState, SrsDom, SrsModuleDeps, SrsPersistence } from './module';

// Make a tiny in-memory persistence + DOM surface.
function makeInfra() {
  const store = new Map<string, string>();
  const persistence: SrsPersistence = {
    readStateRaw: () => store.get('thai_srs_state') ?? null,
    writeStateRaw: (raw) => {
      store.set('thai_srs_state', raw);
    },
    readStatsRaw: () => store.get('thai_srs_stats') ?? null,
    writeStatsRaw: (raw) => {
      store.set('thai_srs_stats', raw);
    },
    removeStats: () => {
      store.delete('thai_srs_stats');
    },
  };
  const elements = new Map<string, HTMLElement>();
  const bodyChildren: HTMLElement[] = [];
  const dom: SrsDom = {
    getHost: () => null,
    setHostHtml: () => {},
    addHostClass: () => {},
    removeHostClassFromCurrent: () => {},
    getById: (id) => elements.get(id) ?? null,
    querySelector: () => null,
    appendToBody: (el) => {
      bodyChildren.push(el);
    },
    vibrate: () => {},
  };
  function setElement(id: string, el: HTMLElement): void {
    elements.set(id, el);
  }
  return { store, persistence, dom, setElement, bodyChildren };
}

function makeDeps(overrides: Partial<SrsModuleDeps> = {}): SrsModuleDeps {
  const infra = makeInfra();
  return {
    getData: () => undefined,
    getTop1000Words: () => [],
    getTop1000Structures: () => [],
    getTop1000Phrases: () => [],
    getShowUnverified: () => false,
    getFsrs: () => undefined, // force SM-2 path in tests
    speakText: () => {},
    renderTone: (t) => t || '',
    persistence: infra.persistence,
    dom: infra.dom,
    ...overrides,
  };
}

// Short helper: build a module with default deps + any overrides.
function createSepsWithDeps(overrides: Partial<SrsModuleDeps> = {}): ReturnType<typeof createSrsModule> {
  return createSrsModule(makeDeps(overrides));
}

const NOW = 1_700_000_000; // fixed reference timestamp

describe('SrsModule · SM-2 engine — new cards', () => {
  it('Again on a brand-new card keeps it in learn with the 1-min interval', () => {
    const mod = createSrsModule(makeDeps());
    const next = mod.scheduleNextSM2(null, 1, NOW);
    expect(next.state).toBe('learn');
    expect(next.due - NOW).toBe(SRS_LEARN_AGAIN_SEC); // 60s
    expect(next.ivl).toBe(0);
    expect(next.reps).toBe(1);
  });

  it('Hard on a new card schedules the 5-min learn step', () => {
    const mod = createSrsModule(makeDeps());
    const next = mod.scheduleNextSM2(null, 2, NOW);
    expect(next.state).toBe('learn');
    expect(next.due - NOW).toBe(SRS_LEARN_HARD_SEC); // 300s
  });

  it('Good on a new card graduates to review with ivl=1d and no ef change', () => {
    const mod = createSrsModule(makeDeps());
    const next = mod.scheduleNextSM2(null, 3, NOW);
    expect(next.state).toBe('review');
    expect(next.ivl).toBe(1);
    expect(next.due - NOW).toBe(1 * SRS_DAY_SEC);
    expect(next.ef).toBe(2.5); // unchanged
  });

  it('Easy on a new card graduates with ivl=4d and ef +0.15', () => {
    const mod = createSepsWithDeps();
    const next = mod.scheduleNextSM2(null, 4, NOW);
    expect(next.state).toBe('review');
    expect(next.ivl).toBe(4);
    expect(next.ef).toBeCloseTo(2.65, 5);
  });

  it('passes reps through from the previous state and increments by 1', () => {
    const mod = createSepsWithDeps();
    const prev: SrsCardState = {
      ef: 2.5,
      ivl: 0,
      due: NOW,
      reps: 7,
      lapses: 0,
      state: 'new',
    };
    const next = mod.scheduleNextSM2(prev, 3, NOW);
    expect(next.reps).toBe(8);
  });
});

describe('SrsModule · SM-2 engine — review cards', () => {
  function reviewState(ivl: number, ef = 2.5): SrsCardState {
    return {
      ef,
      ivl,
      due: NOW,
      reps: 3,
      lapses: 0,
      state: 'review',
    };
  }

  it('Again lapses a review card → state=learn, 10-min interval, lapses+1, ef-0.2', () => {
    const mod = createSepsWithDeps();
    const next = mod.scheduleNextSM2(reviewState(10), 1, NOW);
    expect(next.state).toBe('learn');
    expect(next.due - NOW).toBe(SRS_LAPSE_SEC);
    expect(next.lapses).toBe(1);
    expect(next.ef).toBeCloseTo(2.3, 5);
  });

  it('Hard scales ivl by 1.2 and decreases ef by 0.15', () => {
    const mod = createSepsWithDeps();
    const next = mod.scheduleNextSM2(reviewState(10), 2, NOW);
    expect(next.state).toBe('review');
    expect(next.ivl).toBe(12); // 10 * 1.2
    expect(next.due - NOW).toBe(12 * SRS_DAY_SEC);
    expect(next.ef).toBeCloseTo(2.35, 5);
  });

  it('Good scales ivl by ef and keeps ef constant', () => {
    const mod = createSepsWithDeps();
    const next = mod.scheduleNextSM2(reviewState(10, 2.5), 3, NOW);
    expect(next.ivl).toBe(25); // 10 * 2.5
    expect(next.ef).toBe(2.5);
  });

  it('Easy scales ivl by ef*1.3 and bumps ef by +0.15', () => {
    const mod = createSepsWithDeps();
    const next = mod.scheduleNextSM2(reviewState(10, 2.5), 4, NOW);
    expect(next.ivl).toBeCloseTo(10 * 2.5 * 1.3, 5); // 32.5
    expect(next.ef).toBeCloseTo(2.65, 5);
  });

  it('clamps ef into [1.3, 3.0]', () => {
    const mod = createSepsWithDeps();
    expect(mod.clampEf(0.5)).toBe(1.3);
    expect(mod.clampEf(5)).toBe(3.0);
    expect(mod.clampEf(2.5)).toBe(2.5);
  });
});

describe('SrsModule · FSRS fallback', () => {
  it('scheduleNext falls back to SM-2 when FSRS is unavailable', () => {
    const mod = createSepsWithDeps(); // getFsrs() → undefined
    const next = mod.scheduleNext(null, 3, NOW);
    expect(next.state).toBe('review');
    expect(next.engine).not.toBe('fsrs');
  });

  it('scheduleNext uses FSRS when getFsrs() returns a library', () => {
    // Stub scheduler that just returns the input card unchanged.
    const fakeCard = {
      stability: 1,
      difficulty: 5,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      due: new Date((NOW + SRS_DAY_SEC) * 1000),
    };
    const lib = {
      fsrs: () => ({
        next: (card: typeof fakeCard) => ({ card }),
      }),
      generatorParameters: () => ({}),
      createEmptyCard: () => ({ ...fakeCard }),
      State: { New: 0, Learning: 1, Review: 2, Relearning: 3 },
      Rating: { Again: 1, Hard: 2, Good: 3, Easy: 4 },
    };
    const mod = createSepsWithDeps({ getFsrs: () => lib as any });
    const next = mod.scheduleNext(null, 3, NOW);
    expect(next.engine).toBe('fsrs');
    expect(next.state).toBe('review');
  });

  it('scheduleNext swallows FSRS runtime errors and falls back to SM-2', () => {
    const lib = {
      fsrs: () => ({
        next: () => {
          throw new Error('boom');
        },
      }),
      generatorParameters: () => ({}),
      createEmptyCard: () => ({
        stability: 1,
        difficulty: 5,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        due: new Date(NOW * 1000),
      }),
      State: { New: 0, Learning: 1, Review: 2, Relearning: 3 },
      Rating: { Again: 1, Hard: 2, Good: 3, Easy: 4 },
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mod = createSepsWithDeps({ getFsrs: () => lib as any });
    const next = mod.scheduleNext(null, 3, NOW);
    expect(next.engine).not.toBe('fsrs');
    expect(next.state).toBe('review');
    warn.mockRestore();
  });

  it('getFsrsScheduler only tries FSRS once across calls', () => {
    let calls = 0;
    const lib = {
      fsrs: () => {
        calls++;
        throw new Error('init-fail');
      },
      generatorParameters: () => ({}),
      createEmptyCard: () => ({} as any),
      State: { New: 0, Learning: 1, Review: 2, Relearning: 3 },
      Rating: { Again: 1, Hard: 2, Good: 3, Easy: 4 },
    };
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mod = createSepsWithDeps({ getFsrs: () => lib as any });
    mod.getFsrsScheduler();
    mod.getFsrsScheduler();
    mod.getFsrsScheduler();
    expect(calls).toBe(1);
  });
});

describe('SrsModule · formatInterval boundaries', () => {
  const mod = createSepsWithDeps();

  it('<60s → "<1min"', () => {
    expect(mod.formatInterval(59)).toBe('<1min');
  });

  it('60-3599s → "<n>min"', () => {
    expect(mod.formatInterval(60)).toBe('1min');
    expect(mod.formatInterval(600)).toBe('10min');
  });

  it('3600-86399s → "<n>h"', () => {
    expect(mod.formatInterval(3600)).toBe('1h');
    expect(mod.formatInterval(7200)).toBe('2h');
  });

  it('exactly 1 day → "1d"', () => {
    expect(mod.formatInterval(SRS_DAY_SEC)).toBe('1d');
  });

  it('2-29 days → "<n>d"', () => {
    expect(mod.formatInterval(2 * SRS_DAY_SEC)).toBe('2d');
    expect(mod.formatInterval(15 * SRS_DAY_SEC)).toBe('15d');
  });

  it('30-364 days → "<n>mo"', () => {
    expect(mod.formatInterval(60 * SRS_DAY_SEC)).toBe('2mo');
  });

  it('>=365 days → "<n>a"', () => {
    expect(mod.formatInterval(365 * SRS_DAY_SEC)).toBe('1a');
    expect(mod.formatInterval(730 * SRS_DAY_SEC)).toBe('2a');
  });
});

describe('SrsModule · buildSession easiest-first ordering', () => {
  function makeWords(n: number) {
    return Array.from({ length: n }, (_, i) => ({
      rank: i + 1,
      thai: 'k' + i,
      es: 'e' + i,
      spanish: 's' + i,
      english: 'en' + i,
      rtgs: 'r' + i,
      tone: 'm',
      phrase: { thai: 'p' + i },
    }));
  }

  it('returns SRS_NEW_PER_DAY new cards max when there are many unseen', () => {
    const words = makeWords(100);
    const mod = createSepsWithDeps({ getTop1000Words: () => words as any });
    const q = mod.buildSession('palabras');
    expect(q.length).toBe(SRS_NEW_PER_DAY);
    expect(q.every((it) => it.isNew)).toBe(true);
  });

  it('surfaces the whole deck easiest-first by ascending rank, mixing new + due', () => {
    const words = makeWords(50);
    // Make 12 due-review cards (ranks 1-12) and leave the rest new.
    const preState: Record<string, SrsCardState> = {};
    for (let i = 0; i < 12; i++) {
      preState[String(i + 1)] = {
        ef: 2.5,
        ivl: 1,
        due: NOW - 100,
        reps: 2,
        lapses: 0,
        state: 'review',
      };
    }
    const infra = makeInfra();
    infra.store.set(
      'thai_srs_state',
      JSON.stringify({ v: 1, decks: { palabras: preState } })
    );
    vi.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    const mod = createSepsWithDeps({
      getTop1000Words: () => words as any,
      persistence: infra.persistence,
      dom: infra.dom,
    });
    const q = mod.buildSession('palabras');
    const ranks = q.map((it) => (it.card as unknown as { rank: number }).rank);
    // Queue is strictly ascending — easiest card first regardless of state.
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]);
    }
    expect(ranks[0]).toBe(1);
    vi.useRealTimers();
  });

  it('sorts Top1000 structures by inverted importance (5 stars = easiest)', () => {
    const structs = [
      { id: 'a', name: 'A', importance: 2 },
      { id: 'b', name: 'B', importance: 5 },
      { id: 'c', name: 'C', importance: 4 },
    ];
    const mod = createSepsWithDeps({
      getTop1000Structures: () => structs as any,
    });
    const q = mod.buildSession('estructuras');
    expect(q.map((it) => it.card.id)).toEqual(['b', 'c', 'a']);
  });

  it('uses injected freqRankOf for lesson Q&A decks', () => {
    const convs = [
      { q_thai: 'hardq', a_thai: '', lesson: 1 },
      { q_thai: 'easyx', a_thai: '', lesson: 1 },
    ];
    const rankByText: Record<string, number> = { easyx: 1, hardq: 100 };
    const mod = createSepsWithDeps({
      getData: () => ({ conversations: convs as any }),
      freqRankOf: (c) => rankByText[(c.q_thai || '') + (c.a_thai || '')] ?? 9999,
    });
    const q = mod.buildSession('lec-preguntas');
    expect(q.map((it) => it.card.q_thai)).toEqual(['easyx', 'hardq']);
  });

  it('surfaces N0 sources before A1-B2 regardless of freqRank (CT deck)', () => {
    // Source 'breakfast_foods_students' is in the curated N0_SOURCES set;
    // 'embarrassing_stories_elevator_temple_airplane' is not.
    const convs = [
      { q_thai: 'hardq', a_thai: '', source: 'cthai:breakfast_foods_students' },
      { q_thai: 'easyx', a_thai: '', source: 'cthai:embarrassing_stories_elevator_temple_airplane' },
      { q_thai: 'midq', a_thai: '', source: 'cthai:breakfast_foods_students' },
    ];
    const rankByText: Record<string, number> = { easyx: 1, midq: 50, hardq: 100 };
    const mod = createSepsWithDeps({
      getData: () => ({ conversations: convs as any }),
      freqRankOf: (c) => rankByText[(c.q_thai || '') + (c.a_thai || '')] ?? 9999,
    });
    const q = mod.buildSession('cthai');
    // N0 tier first (midq before hardq by freqRank), then non-N0 (easyx).
    expect(q.map((it) => it.card.q_thai)).toEqual(['midq', 'hardq', 'easyx']);
  });

  it('returns an empty queue when deck has no cards', () => {
    const mod = createSepsWithDeps();
    expect(mod.buildSession('palabras')).toEqual([]);
  });

  it('returns an empty queue when the deck key is unknown', () => {
    const mod = createSepsWithDeps();
    expect(mod.buildSession('does-not-exist')).toEqual([]);
  });
});

describe('SrsModule · getDeckStats', () => {
  function makeWords(n: number) {
    return Array.from({ length: n }, (_, i) => ({
      rank: i + 1,
      thai: 'k' + i,
    }));
  }

  it('reports new=SRS_NEW_PER_DAY when many unseen and total=card count', () => {
    const words = makeWords(50);
    const mod = createSepsWithDeps({ getTop1000Words: () => words as any });
    const s = mod.getDeckStats('palabras');
    expect(s.total).toBe(50);
    expect(s.seen).toBe(0);
    expect(s.new).toBe(SRS_NEW_PER_DAY);
    expect(s.newRemaining).toBe(50);
    expect(s.due).toBe(0);
    expect(s.learning).toBe(0);
    expect(s.mature).toBe(0);
  });

  it('counts learning and due separately', () => {
    const words = makeWords(20);
    const preState: Record<string, SrsCardState> = {
      // 2 learning cards (due now)
      '1': { ef: 2.5, ivl: 0, due: NOW - 60, reps: 1, lapses: 0, state: 'learn' },
      '2': { ef: 2.5, ivl: 0, due: NOW - 30, reps: 1, lapses: 0, state: 'learn' },
      // 3 due review cards
      '3': { ef: 2.5, ivl: 5, due: NOW - 100, reps: 3, lapses: 0, state: 'review' },
      '4': { ef: 2.5, ivl: 5, due: NOW - 50, reps: 3, lapses: 0, state: 'review' },
      // 1 mature (not due) — ivl >= 21
      '5': { ef: 2.5, ivl: 30, due: NOW + 99999, reps: 10, lapses: 0, state: 'review' },
    };
    const infra = makeInfra();
    infra.store.set(
      'thai_srs_state',
      JSON.stringify({ v: 1, decks: { palabras: preState } })
    );
    vi.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    const mod = createSepsWithDeps({
      getTop1000Words: () => words as any,
      persistence: infra.persistence,
      dom: infra.dom,
    });
    const s = mod.getDeckStats('palabras');
    expect(s.seen).toBe(5);
    expect(s.learning).toBe(2);
    expect(s.due).toBe(4); // due(2 review) + learning(2)
    expect(s.mature).toBe(1);
    expect(s.newRemaining).toBe(15);
  });

  it('returns a zero-stats object for an unknown deck', () => {
    const mod = createSepsWithDeps();
    const s = mod.getDeckStats('ghost');
    expect(s.total).toBe(0);
    expect(s.due).toBe(0);
  });
});

describe('SrsModule · findSrsCardByThai', () => {
  it('prefers lesson decks over Top 1000 decks', () => {
    const lessonWords = [{ thai: 'same', lesson: 1 }];
    const topWords = [{ rank: 1, thai: 'same' }];
    const mod = createSepsWithDeps({
      getData: () => ({ words: lessonWords as any }),
      getTop1000Words: () => topWords as any,
    });
    const match = mod.findSrsCardByThai('same');
    expect(match).not.toBeNull();
    expect(match!.deckKey).toBe('lec-palabras');
  });

  it('falls back to Top 1000 palabras when no lesson match', () => {
    const topWords = [{ rank: 7, thai: 'alpha' }];
    const mod = createSepsWithDeps({
      getData: () => ({ words: [] }),
      getTop1000Words: () => topWords as any,
    });
    const match = mod.findSrsCardByThai('alpha');
    expect(match!.deckKey).toBe('palabras');
    expect(match!.cardId).toBe(7);
  });

  it('returns null for empty input', () => {
    const mod = createSepsWithDeps();
    expect(mod.findSrsCardByThai('')).toBeNull();
  });

  it('returns null when the thai string is not in any deck', () => {
    const mod = createSepsWithDeps();
    expect(mod.findSrsCardByThai('ghost')).toBeNull();
  });
});

describe('SrsModule · recordRating + persistence', () => {
  it('writes the scheduled state back to the persistence layer', () => {
    const words = [{ rank: 1, thai: 'a' }];
    const infra = makeInfra();
    vi.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    const mod = createSepsWithDeps({
      getTop1000Words: () => words as any,
      persistence: infra.persistence,
      dom: infra.dom,
    });
    const next = mod.recordRating('palabras', 1, 3);
    expect(next.state).toBe('review');
    const raw = infra.store.get('thai_srs_state');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.v).toBe(1);
    expect(parsed.decks.palabras['1'].state).toBe('review');
  });

  it('loads prior state from persistence before scheduling', () => {
    const words = [{ rank: 1, thai: 'a' }];
    const infra = makeInfra();
    infra.store.set(
      'thai_srs_state',
      JSON.stringify({
        v: 1,
        decks: {
          palabras: {
            '1': {
              ef: 2.5,
              ivl: 10,
              due: NOW - 100,
              reps: 5,
              lapses: 0,
              state: 'review',
            },
          },
        },
      })
    );
    vi.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    const mod = createSepsWithDeps({
      getTop1000Words: () => words as any,
      persistence: infra.persistence,
      dom: infra.dom,
    });
    // Good on a review card with ivl=10, ef=2.5 → 10*2.5 = 25d.
    const next = mod.recordRating('palabras', 1, 3);
    expect(next.ivl).toBe(25);
  });

  it('resets a deck to empty and persists', () => {
    const words = [{ rank: 1, thai: 'a' }];
    const infra = makeInfra();
    infra.store.set(
      'thai_srs_state',
      JSON.stringify({
        v: 1,
        decks: { palabras: { '1': { state: 'review', ef: 2.5, ivl: 1, due: 0, reps: 1, lapses: 0 } } },
      })
    );
    const mod = createSepsWithDeps({
      getTop1000Words: () => words as any,
      persistence: infra.persistence,
      dom: infra.dom,
    });
    mod.resetSrsDeck('palabras');
    const raw = JSON.parse(infra.store.get('thai_srs_state')!);
    expect(raw.decks.palabras).toEqual({});
  });
});

describe('SrsModule · daily stats', () => {
  function todayStr() {
    const d = new Date();
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  it('defaultStats carries today\'s date and zero counts', () => {
    const mod = createSepsWithDeps();
    const s = mod.defaultStats();
    expect(s.today).toBe(todayStr());
    expect(s.reviewed).toBe(0);
    expect(s.learned).toBe(0);
    expect(s.timeSec).toBe(0);
  });

  it('bumpSrsStats accumulates within the same day', () => {
    const infra = makeInfra();
    const mod = createSepsWithDeps({ persistence: infra.persistence, dom: infra.dom });
    mod.bumpSrsStats(5, 2, 120);
    mod.bumpSrsStats(3, 1, 60);
    const s = mod.loadSrsStats();
    expect(s.reviewed).toBe(8);
    expect(s.learned).toBe(3);
    expect(s.timeSec).toBe(180);
  });

  it('loadSrsStats resets when the stored day differs from today', () => {
    const infra = makeInfra();
    infra.store.set(
      'thai_srs_stats',
      JSON.stringify({ today: '1999-01-01', reviewed: 99, learned: 99, timeSec: 999 })
    );
    const mod = createSepsWithDeps({ persistence: infra.persistence, dom: infra.dom });
    const s = mod.loadSrsStats();
    expect(s.reviewed).toBe(0);
    expect(s.today).toBe(todayStr());
  });
});

describe('SrsModule · previewIntervals', () => {
  it('returns a label for each of the 4 rating buttons', () => {
    const mod = createSepsWithDeps();
    vi.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    const out = mod.previewIntervals(null);
    expect(Object.keys(out).sort()).toEqual(['1', '2', '3', '4']);
    // New card: Again → 1min, Hard → 5min, Good → 1d, Easy → 4d.
    expect(out[1]).toBe('1min');
    expect(out[2]).toBe('5min');
    expect(out[3]).toBe('1d');
    expect(out[4]).toBe('4d');
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// Smoke test for mountSrsInline / unmountSrsInline.
//
// Note: the real mountSrsInline signature is (hostId: string, onExit, deckKeys)
// — it does NOT take a DOM element and does NOT append children directly.
// Instead it records the host id and delegates DOM writes to deps.dom
// (addHostClass / removeHostClassFromCurrent). The test environment is node
// (vitest.config.ts) and jsdom is not installed, so we assert against spy
// dom callbacks rather than against a real host element's childNodes. This
// still gives the regression guarantee: the inline-mount entry point can be
// invoked with a minimal deps bag without throwing, and it routes through the
// typed SrsDom abstraction the dashboard relies on.
// ---------------------------------------------------------------------------

describe('SrsModule · mountSrsInline smoke', () => {
  it('mountSrsInline + unmountSrsInline round-trip without throwing and route through SrsDom', () => {
    const addHostClass = vi.fn();
    const removeHostClassFromCurrent = vi.fn();
    const dom: SrsDom = {
      ...makeInfra().dom,
      addHostClass,
      removeHostClassFromCurrent,
    };
    const mod = createSrsModule(makeDeps({ dom }));

    // Mount: must not throw, and must tag the host via deps.dom.addHostClass.
    expect(() => mod.mountSrsInline('srsView', null, null)).not.toThrow();
    expect(addHostClass).toHaveBeenCalledWith('srs-host');

    // Unmount: must clear the class via deps.dom and also not throw.
    expect(() => mod.unmountSrsInline()).not.toThrow();
    expect(removeHostClassFromCurrent).toHaveBeenCalledWith('srs-host');
  });
});
