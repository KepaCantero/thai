// Solo Leveling Phase 1: player state + pure math.
//
// Pure functions only — no localStorage, no DOM. The engine (playerEngine.ts)
// is the only thing that should mutate the persisted player state via stores.
// Tests can drive these functions directly without mocking persistence.

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export const RANKS: readonly Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
export const TIERS_PER_RANK = 10;
export const TOTAL_LEVELS = RANKS.length * TIERS_PER_RANK; // 60

export type StatKey =
  | 'vocab'
  | 'grammar'
  | 'pronunciation'
  | 'listening'
  | 'reading';

export const STAT_KEYS: readonly StatKey[] = [
  'vocab',
  'grammar',
  'pronunciation',
  'listening',
  'reading',
] as const;

export type Stats = Record<StatKey, number>;

export interface PlayerState {
  rank: Rank;
  tier: number; // 1..TIERS_PER_RANK
  xp: number; // accumulated toward next tier
  totalXp: number; // never decreases — used for leaderboard-style totals
  stats: Stats;
  streak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export function defaultPlayerState(): PlayerState {
  return {
    rank: 'E',
    tier: 1,
    xp: 0,
    totalXp: 0,
    stats: {
      vocab: 0,
      grammar: 0,
      pronunciation: 0,
      listening: 0,
      reading: 0,
    },
    streak: 0,
    longestStreak: 0,
    lastActiveDate: '',
  };
}

/**
 * Absolute level (1..60). E-1 = 1, E-10 = 10, D-1 = 11, ... S-10 = 60.
 * Useful for "xp needed for level N" and for rank-up math.
 */
export function absoluteLevel(rank: Rank, tier: number): number {
  return RANKS.indexOf(rank) * TIERS_PER_RANK + tier;
}

/**
 * XP required to clear the current tier (i.e. advance from current level
 * to current+1). Geometric curve: `100 × 1.4^(level-1)`.
 *
 * Examples:
 *   L1 (E-1) → 100 XP
 *   L10 (E-10) → ~2060 XP
 *   L30 (C-10) → ~24K XP
 *   L60 (S-10) → ~5.7M XP
 *
 * Capped at S-10 (returns Infinity once maxed so applyXp stops leveling).
 */
export function xpForNextLevel(rank: Rank, tier: number): number {
  if (rank === 'S' && tier >= TIERS_PER_RANK) return Infinity;
  const level = absoluteLevel(rank, tier);
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

/**
 * Decompose an absolute level (1..60) back into rank + tier.
 * Levels outside the 1..60 range clamp to the nearest boundary.
 */
export function rankFromAbsoluteLevel(level: number): { rank: Rank; tier: number } {
  const clamped = Math.max(1, Math.min(TOTAL_LEVELS, Math.floor(level)));
  const rankIndex = Math.floor((clamped - 1) / TIERS_PER_RANK);
  const tier = ((clamped - 1) % TIERS_PER_RANK) + 1;
  return { rank: RANKS[rankIndex], tier };
}

export interface ApplyXpResult {
  state: PlayerState;
  levelsGained: number;
  rankUp: boolean; // true if the level-up crossed a rank boundary (e.g. E-10 → D-1)
  maxed: boolean; // true if state reached S-10
}

/**
 * Apply XP to a player state, rolling over as many tiers as needed.
 * Pure — returns a new state, does not mutate the input.
 */
export function applyXp(input: PlayerState, amount: number): ApplyXpResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { state: input, levelsGained: 0, rankUp: false, maxed: input.rank === 'S' && input.tier >= TIERS_PER_RANK };
  }

  let rank = input.rank;
  let tier = input.tier;
  let xp = input.xp + amount;
  let levelsGained = 0;
  const startingRank = rank;

  // Cap progress at S-10. XP past the cap is silently dropped — the player
  // has finished the game. If we ever want prestige, this is where it'd hook.
  while (!(rank === 'S' && tier >= TIERS_PER_RANK)) {
    const need = xpForNextLevel(rank, tier);
    if (xp < need) break;
    xp -= need;
    levelsGained += 1;
    if (tier < TIERS_PER_RANK) {
      tier += 1;
    } else {
      const nextRankIndex = RANKS.indexOf(rank) + 1;
      rank = RANKS[Math.min(nextRankIndex, RANKS.length - 1)];
      tier = 1;
    }
  }

  if (rank === 'S' && tier >= TIERS_PER_RANK) xp = 0;

  const rankUp = rank !== startingRank && levelsGained > 0;
  const maxed = rank === 'S' && tier >= TIERS_PER_RANK;

  return {
    state: {
      ...input,
      rank,
      tier,
      xp,
      totalXp: input.totalXp + amount,
      stats: { ...input.stats },
    },
    levelsGained,
    rankUp,
    maxed,
  };
}

/**
 * Bump a single stat by `delta` (typically +1 per qualifying action).
 * Pure — returns a new state.
 */
export function bumpStat(input: PlayerState, stat: StatKey, delta: number): PlayerState {
  return {
    ...input,
    stats: { ...input.stats, [stat]: input.stats[stat] + delta },
  };
}

/**
 * Days between two YYYY-MM-DD dates (positive = `later` is after `earlier`).
 * Returns NaN if either string is malformed.
 */
export function dayDiff(earlier: string, later: string): number {
  const a = parseDate(earlier);
  const b = parseDate(later);
  if (!a || !b) return NaN;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function parseDate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  // Construct at UTC midnight so the diff is exactly N*86400000.
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return Number.isNaN(dt.getTime()) ? null : dt;
}

/**
 * Roll the streak over for `today`. Rules:
 *   - lastActiveDate is '' or today         → no change (caller bumps to 1 if streak is 0)
 *   - lastActiveDate is yesterday           → streak continues (caller increments)
 *   - lastActiveDate is ≥2 days ago         → streak resets to 0
 *
 * Pure — returns a new state. The engine decides when to call this and how
 * to handle the "first activity of the day" increment.
 */
export function rolloverStreak(input: PlayerState, today: string): PlayerState {
  if (input.lastActiveDate === '' || input.lastActiveDate === today) {
    return input;
  }
  const gap = dayDiff(input.lastActiveDate, today);
  if (Number.isNaN(gap) || gap >= 2) {
    return { ...input, streak: 0 };
  }
  return input;
}
