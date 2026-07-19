// Solo Leveling Phase 7: titles catalogue + pure unlock rules.
//
// Pure data + pure functions only. The catalogue (`TITLE_DEFS`) lists every
// title in the game with a category and a predicate. Predicates read from a
// `TitleUnlockCtx` snapshot — they never touch stores, so unit tests can drive
// them without mocking persistence.
//
// `defaultTitlesInitialState` lives here (re-exported from stores.ts) so the
// store factory has the schema without creating a circular import.

import type { Rank, StatKey } from './player';
import { absoluteLevel, TIERS_PER_RANK } from './player';

export type TitleId = string;

export type TitleCategory =
  | 'rank'
  | 'vocab'
  | 'grammar'
  | 'listening'
  | 'pronunciation'
  | 'reading'
  | 'streak'
  | 'quests';

export interface TitleDef {
  id: TitleId;
  label: string;
  description: string;
  category: TitleCategory;
  isUnlocked: (ctx: TitleUnlockCtx) => boolean;
}

export interface TitleUnlockCtx {
  rank: Rank;
  tier: number;
  absoluteLevel: number;
  stats: Record<StatKey, number>;
  totalXp: number;
  streak: number;
  longestStreak: number;
  // Lifetime accumulators — only bump up, never reset.
  lifetimeKnown: number;
  lifetimeReviews: number;
  lifetimeConvPlays: number;
  lifetimeShadowReps: number;
  allClearDays: number;
}

const RANK_AT_OR_ABOVE =
  (target: Rank): ((c: TitleUnlockCtx) => boolean) =>
  (c) => {
    const order = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
    const cur = order.indexOf(c.rank as (typeof order)[number]);
    const tgt = order.indexOf(target);
    return cur >= 0 && cur >= tgt;
  };

export const TITLE_DEFS: readonly TitleDef[] = [
  // Rank milestones
  {
    id: 'awakened',
    label: 'The Awakened',
    description: 'Reached D rank.',
    category: 'rank',
    isUnlocked: RANK_AT_OR_ABOVE('D'),
  },
  {
    id: 'hunter',
    label: 'The Hunter',
    description: 'Reached C rank.',
    category: 'rank',
    isUnlocked: RANK_AT_OR_ABOVE('C'),
  },
  {
    id: 'elite',
    label: 'The Elite Hunter',
    description: 'Reached B rank.',
    category: 'rank',
    isUnlocked: RANK_AT_OR_ABOVE('B'),
  },
  {
    id: 'sovereign',
    label: 'The Sovereign',
    description: 'Reached A rank.',
    category: 'rank',
    isUnlocked: RANK_AT_OR_ABOVE('A'),
  },
  {
    id: 'monarch',
    label: 'The Monarch',
    description: 'Reached S rank.',
    category: 'rank',
    isUnlocked: (c) => c.rank === 'S',
  },
  // Vocab
  {
    id: 'first-steps',
    label: 'First Steps',
    description: 'Learned your first 10 words.',
    category: 'vocab',
    isUnlocked: (c) => c.lifetimeKnown >= 10,
  },
  {
    id: 'word-collector',
    label: 'The Word Collector',
    description: 'Learned 100 words lifetime.',
    category: 'vocab',
    isUnlocked: (c) => c.lifetimeKnown >= 100,
  },
  {
    id: 'lexicon',
    label: 'The Living Lexicon',
    description: 'Learned 500 words lifetime.',
    category: 'vocab',
    isUnlocked: (c) => c.lifetimeKnown >= 500,
  },
  // Reviews
  {
    id: 'review-novice',
    label: 'The Disciplined',
    description: 'Completed 100 SRS reviews.',
    category: 'grammar',
    isUnlocked: (c) => c.lifetimeReviews >= 100,
  },
  {
    id: 'review-master',
    label: 'The Unrelenting',
    description: 'Completed 1000 SRS reviews.',
    category: 'grammar',
    isUnlocked: (c) => c.lifetimeReviews >= 1000,
  },
  // Listening
  {
    id: 'first-listen',
    label: 'The Listener',
    description: 'Played 50 conversations.',
    category: 'listening',
    isUnlocked: (c) => c.lifetimeConvPlays >= 50,
  },
  // Pronunciation
  {
    id: 'shadow-init',
    label: 'The Echo',
    description: 'Completed 30 shadowing reps.',
    category: 'pronunciation',
    isUnlocked: (c) => c.lifetimeShadowReps >= 30,
  },
  // Streak
  {
    id: 'streak-7',
    label: 'The Consistent',
    description: 'Maintained a 7-day streak.',
    category: 'streak',
    isUnlocked: (c) => c.longestStreak >= 7,
  },
  {
    id: 'streak-30',
    label: 'The Unbroken',
    description: 'Maintained a 30-day streak.',
    category: 'streak',
    isUnlocked: (c) => c.longestStreak >= 30,
  },
  // Daily quests
  {
    id: 'first-allclear',
    label: 'The Diligent',
    description: 'Cleared all daily quests once.',
    category: 'quests',
    isUnlocked: (c) => c.allClearDays >= 1,
  },
  {
    id: 'allclear-7',
    label: 'The Methodical',
    description: 'Cleared all daily quests 7 times.',
    category: 'quests',
    isUnlocked: (c) => c.allClearDays >= 7,
  },
] as const;

/** Category display labels (uppercase form rendered by CSS). */
export const TITLE_CATEGORY_LABELS: Record<TitleCategory, string> = {
  rank: 'Rank',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  listening: 'Listening',
  pronunciation: 'Pronunciation',
  reading: 'Reading',
  streak: 'Streak',
  quests: 'Daily Quests',
};

/** Category order — drives the rendering order in the Status Window. */
export const TITLE_CATEGORY_ORDER: readonly TitleCategory[] = [
  'rank',
  'vocab',
  'grammar',
  'listening',
  'pronunciation',
  'reading',
  'streak',
  'quests',
] as const;

export interface TitlesState {
  v: 1;
  unlocked: TitleId[]; // chronological unlock order
  activeTitle: TitleId | null;
  lifetimeKnown: number;
  lifetimeReviews: number;
  lifetimeConvPlays: number;
  lifetimeShadowReps: number;
  allClearDays: number;
}

/**
 * Initial state used by both the store factory and unit tests. Lives here so
 * `stores.ts` can import it without pulling in the predicate helpers.
 */
export function defaultTitlesInitialState(): TitlesState {
  return {
    v: 1,
    unlocked: [],
    activeTitle: null,
    lifetimeKnown: 0,
    lifetimeReviews: 0,
    lifetimeConvPlays: 0,
    lifetimeShadowReps: 0,
    allClearDays: 0,
  };
}

/**
 * Build a TitleUnlockCtx from a TitlesState + the bits of player state we
 * need. Pure — exposed so tests and the engine share one construction path.
 */
export function buildCtx(
  state: TitlesState,
  player: {
    rank: Rank;
    tier: number;
    stats: Record<StatKey, number>;
    totalXp: number;
    streak: number;
    longestStreak: number;
  },
): TitleUnlockCtx {
  const tier = Math.max(1, Math.min(TIERS_PER_RANK, player.tier | 0));
  return {
    rank: player.rank,
    tier,
    absoluteLevel: absoluteLevel(player.rank, tier),
    stats: { ...player.stats },
    totalXp: player.totalXp,
    streak: player.streak,
    longestStreak: player.longestStreak,
    lifetimeKnown: state.lifetimeKnown,
    lifetimeReviews: state.lifetimeReviews,
    lifetimeConvPlays: state.lifetimeConvPlays,
    lifetimeShadowReps: state.lifetimeShadowReps,
    allClearDays: state.allClearDays,
  };
}

/**
 * Pure: titles that SHOULD be unlocked given `ctx` but aren't yet in
 * `state.unlocked`. Returned in catalogue order (which is also the intended
 * chronological unlock order within a single event).
 */
export function computeNewUnlocks(
  state: TitlesState,
  ctx: TitleUnlockCtx,
): TitleDef[] {
  const have = new Set(state.unlocked);
  const out: TitleDef[] = [];
  for (const def of TITLE_DEFS) {
    if (have.has(def.id)) continue;
    try {
      if (def.isUnlocked(ctx)) out.push(def);
    } catch {
      // A throwing predicate never blocks the rest of the catalogue.
    }
  }
  return out;
}

/**
 * Pure: append newly-unlocked titles to state.unlocked (deduped, order
 * preserved). Never touches accumulators — the engine bumps those separately.
 */
export function applyUnlocks(
  state: TitlesState,
  newlyUnlocked: TitleDef[],
): TitlesState {
  if (newlyUnlocked.length === 0) return state;
  const have = new Set(state.unlocked);
  const next = [...state.unlocked];
  for (const def of newlyUnlocked) {
    if (!have.has(def.id)) {
      have.add(def.id);
      next.push(def.id);
    }
  }
  return { ...state, unlocked: next };
}
