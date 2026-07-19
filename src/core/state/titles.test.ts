import { describe, expect, it } from 'vitest';

import {
  applyUnlocks,
  buildCtx,
  computeNewUnlocks,
  defaultTitlesInitialState,
  TITLE_CATEGORY_ORDER,
  TITLE_DEFS,
  type TitleDef,
  type TitleUnlockCtx,
} from './titles';

/** Build a ctx with everything zeroed except overrides. */
function ctx(overrides: Partial<TitleUnlockCtx> = {}): TitleUnlockCtx {
  return {
    rank: 'E',
    tier: 1,
    absoluteLevel: 1,
    stats: {
      vocab: 0,
      grammar: 0,
      pronunciation: 0,
      listening: 0,
      reading: 0,
    },
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    lifetimeKnown: 0,
    lifetimeReviews: 0,
    lifetimeConvPlays: 0,
    lifetimeShadowReps: 0,
    allClearDays: 0,
    ...overrides,
  };
}

function def(id: string): TitleDef {
  const d = TITLE_DEFS.find((t) => t.id === id);
  if (!d) throw new Error(`Unknown title id: ${id}`);
  return d;
}

describe('TITLE_DEFS — shape sanity', () => {
  it('every def has a unique id', () => {
    const ids = TITLE_DEFS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every category is in TITLE_CATEGORY_ORDER', () => {
    for (const d of TITLE_DEFS) {
      expect(TITLE_CATEGORY_ORDER).toContain(d.category);
    }
  });

  it('every def has non-empty label + description', () => {
    for (const d of TITLE_DEFS) {
      expect(d.label.length).toBeGreaterThan(0);
      expect(d.description.length).toBeGreaterThan(0);
    }
  });
});

describe('TITLE_DEFS — rank predicates', () => {
  it('awakened unlocks at D-1', () => {
    expect(def('awakened').isUnlocked(ctx({ rank: 'D', tier: 1 }))).toBe(true);
  });
  it('awakened does NOT unlock at E-10', () => {
    expect(def('awakened').isUnlocked(ctx({ rank: 'E', tier: 10 }))).toBe(false);
  });
  it('hunter unlocks at C', () => {
    expect(def('hunter').isUnlocked(ctx({ rank: 'C' }))).toBe(true);
    expect(def('hunter').isUnlocked(ctx({ rank: 'D' }))).toBe(false);
  });
  it('elite unlocks at B', () => {
    expect(def('elite').isUnlocked(ctx({ rank: 'B' }))).toBe(true);
    expect(def('elite').isUnlocked(ctx({ rank: 'C' }))).toBe(false);
  });
  it('sovereign unlocks at A', () => {
    expect(def('sovereign').isUnlocked(ctx({ rank: 'A' }))).toBe(true);
    expect(def('sovereign').isUnlocked(ctx({ rank: 'B' }))).toBe(false);
  });
  it('monarch unlocks only at S', () => {
    expect(def('monarch').isUnlocked(ctx({ rank: 'S' }))).toBe(true);
    expect(def('monarch').isUnlocked(ctx({ rank: 'A' }))).toBe(false);
  });
  it('S rank unlocks every rank title (cascades)', () => {
    const c = ctx({ rank: 'S' });
    for (const id of ['awakened', 'hunter', 'elite', 'sovereign', 'monarch']) {
      expect(def(id).isUnlocked(c)).toBe(true);
    }
  });
});

describe('TITLE_DEFS — vocab predicates', () => {
  it('first-steps unlocks at 10', () => {
    expect(def('first-steps').isUnlocked(ctx({ lifetimeKnown: 10 }))).toBe(true);
    expect(def('first-steps').isUnlocked(ctx({ lifetimeKnown: 9 }))).toBe(false);
  });
  it('word-collector unlocks at 100', () => {
    expect(def('word-collector').isUnlocked(ctx({ lifetimeKnown: 100 }))).toBe(true);
    expect(def('word-collector').isUnlocked(ctx({ lifetimeKnown: 99 }))).toBe(false);
  });
  it('lexicon unlocks at 500', () => {
    expect(def('lexicon').isUnlocked(ctx({ lifetimeKnown: 500 }))).toBe(true);
    expect(def('lexicon').isUnlocked(ctx({ lifetimeKnown: 499 }))).toBe(false);
  });
});

describe('TITLE_DEFS — reviews / listening / shadow', () => {
  it('review-novice unlocks at 100 reviews', () => {
    expect(def('review-novice').isUnlocked(ctx({ lifetimeReviews: 100 }))).toBe(true);
    expect(def('review-novice').isUnlocked(ctx({ lifetimeReviews: 99 }))).toBe(false);
  });
  it('review-master unlocks at 1000 reviews', () => {
    expect(def('review-master').isUnlocked(ctx({ lifetimeReviews: 1000 }))).toBe(true);
  });
  it('first-listen unlocks at 50 conv plays', () => {
    expect(def('first-listen').isUnlocked(ctx({ lifetimeConvPlays: 50 }))).toBe(true);
    expect(def('first-listen').isUnlocked(ctx({ lifetimeConvPlays: 49 }))).toBe(false);
  });
  it('shadow-init unlocks at 30 reps', () => {
    expect(def('shadow-init').isUnlocked(ctx({ lifetimeShadowReps: 30 }))).toBe(true);
    expect(def('shadow-init').isUnlocked(ctx({ lifetimeShadowReps: 29 }))).toBe(false);
  });
});

describe('TITLE_DEFS — streak / quests', () => {
  it('streak-7 unlocks at 7-day longest streak', () => {
    expect(def('streak-7').isUnlocked(ctx({ longestStreak: 7 }))).toBe(true);
    expect(def('streak-7').isUnlocked(ctx({ longestStreak: 6 }))).toBe(false);
  });
  it('streak-30 unlocks at 30-day longest streak', () => {
    expect(def('streak-30').isUnlocked(ctx({ longestStreak: 30 }))).toBe(true);
  });
  it('first-allclear unlocks at 1 all-clear day', () => {
    expect(def('first-allclear').isUnlocked(ctx({ allClearDays: 1 }))).toBe(true);
    expect(def('first-allclear').isUnlocked(ctx({ allClearDays: 0 }))).toBe(false);
  });
  it('allclear-7 unlocks at 7 all-clear days', () => {
    expect(def('allclear-7').isUnlocked(ctx({ allClearDays: 7 }))).toBe(true);
    expect(def('allclear-7').isUnlocked(ctx({ allClearDays: 6 }))).toBe(false);
  });
});

describe('buildCtx', () => {
  it('clamps tier to [1, TIERS_PER_RANK]', () => {
    const c = buildCtx(defaultTitlesInitialState(), {
      rank: 'E',
      tier: 99,
      stats: {
        vocab: 0, grammar: 0, pronunciation: 0, listening: 0, reading: 0,
      },
      totalXp: 0,
      streak: 0,
      longestStreak: 0,
    });
    expect(c.tier).toBe(10);
    expect(c.absoluteLevel).toBe(10);
  });
  it('copies accumulators from state', () => {
    const state = { ...defaultTitlesInitialState(), lifetimeKnown: 42 };
    const c = buildCtx(state, {
      rank: 'E',
      tier: 1,
      stats: { vocab: 0, grammar: 0, pronunciation: 0, listening: 0, reading: 0 },
      totalXp: 0,
      streak: 0,
      longestStreak: 0,
    });
    expect(c.lifetimeKnown).toBe(42);
  });
});

describe('computeNewUnlocks', () => {
  it('returns empty when nothing is satisfied', () => {
    const state = defaultTitlesInitialState();
    const out = computeNewUnlocks(state, ctx());
    expect(out).toEqual([]);
  });

  it('returns every rank title when rank is S', () => {
    const state = defaultTitlesInitialState();
    const out = computeNewUnlocks(state, ctx({ rank: 'S' }));
    const ids = out.map((d) => d.id);
    expect(ids).toEqual(['awakened', 'hunter', 'elite', 'sovereign', 'monarch']);
  });

  it('respects catalogue order', () => {
    const state = defaultTitlesInitialState();
    const out = computeNewUnlocks(state, ctx({ rank: 'S', lifetimeKnown: 500 }));
    const catalogueOrder = TITLE_DEFS.map((d) => d.id);
    const outIds = out.map((d) => d.id);
    // outIds must be a subsequence of catalogueOrder.
    let i = 0;
    for (const id of outIds) {
      i = catalogueOrder.indexOf(id, i);
      expect(i).toBeGreaterThanOrEqual(0);
      i += 1;
    }
  });

  it('excludes already-unlocked ids', () => {
    const state: ReturnType<typeof defaultTitlesInitialState> = {
      ...defaultTitlesInitialState(),
      unlocked: ['awakened', 'hunter'],
    };
    const out = computeNewUnlocks(state, ctx({ rank: 'S' }));
    const ids = out.map((d) => d.id);
    expect(ids).toEqual(['elite', 'sovereign', 'monarch']);
  });

  it('handles all categories simultaneously', () => {
    const state = defaultTitlesInitialState();
    const out = computeNewUnlocks(state, ctx({
      rank: 'S',
      lifetimeKnown: 500,
      lifetimeReviews: 1000,
      lifetimeConvPlays: 50,
      lifetimeShadowReps: 30,
      longestStreak: 30,
      allClearDays: 7,
    }));
    // Every title should unlock.
    expect(out.length).toBe(TITLE_DEFS.length);
  });
});

describe('applyUnlocks', () => {
  it('returns state unchanged when newlyUnlocked is empty', () => {
    const state = defaultTitlesInitialState();
    expect(applyUnlocks(state, [])).toBe(state);
  });

  it('appends ids in order', () => {
    const state = defaultTitlesInitialState();
    const next = applyUnlocks(state, [
      def('awakened'),
      def('hunter'),
    ]);
    expect(next.unlocked).toEqual(['awakened', 'hunter']);
  });

  it('dedupes ids already present', () => {
    const state: ReturnType<typeof defaultTitlesInitialState> = {
      ...defaultTitlesInitialState(),
      unlocked: ['awakened'],
    };
    const next = applyUnlocks(state, [def('awakened'), def('hunter')]);
    expect(next.unlocked).toEqual(['awakened', 'hunter']);
  });

  it('does not mutate the input state', () => {
    const state = defaultTitlesInitialState();
    applyUnlocks(state, [def('awakened')]);
    expect(state.unlocked).toEqual([]);
  });

  it('preserves other state fields (accumulators, activeTitle)', () => {
    const state: ReturnType<typeof defaultTitlesInitialState> = {
      ...defaultTitlesInitialState(),
      unlocked: [],
      activeTitle: null,
      lifetimeKnown: 42,
      lifetimeReviews: 7,
    };
    const next = applyUnlocks(state, [def('first-steps')]);
    expect(next.lifetimeKnown).toBe(42);
    expect(next.lifetimeReviews).toBe(7);
    expect(next.activeTitle).toBeNull();
  });
});

describe('defaultTitlesInitialState', () => {
  it('returns a fresh object each call', () => {
    const a = defaultTitlesInitialState();
    const b = defaultTitlesInitialState();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
  it('starts empty', () => {
    const s = defaultTitlesInitialState();
    expect(s.v).toBe(1);
    expect(s.unlocked).toEqual([]);
    expect(s.activeTitle).toBeNull();
    expect(s.lifetimeKnown).toBe(0);
  });
});
