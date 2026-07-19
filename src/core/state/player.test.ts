import { describe, expect, it } from 'vitest';
import {
  absoluteLevel,
  applyXp,
  bumpStat,
  dayDiff,
  defaultPlayerState,
  rankFromAbsoluteLevel,
  rolloverStreak,
  xpForNextLevel,
  RANKS,
  TIERS_PER_RANK,
  TOTAL_LEVELS,
  type PlayerState,
} from './player';

const baseState = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  ...defaultPlayerState(),
  ...overrides,
});

describe('player — absoluteLevel + rankFromAbsoluteLevel', () => {
  it('E-1 maps to absolute level 1', () => {
    expect(absoluteLevel('E', 1)).toBe(1);
  });

  it('E-10 maps to absolute level 10', () => {
    expect(absoluteLevel('E', 10)).toBe(10);
  });

  it('D-1 maps to absolute level 11 (rank boundary)', () => {
    expect(absoluteLevel('D', 1)).toBe(11);
  });

  it('S-10 maps to absolute level 60 (the cap)', () => {
    expect(absoluteLevel('S', 10)).toBe(60);
  });

  it('rankFromAbsoluteLevel is the inverse of absoluteLevel', () => {
    for (const rank of RANKS) {
      for (let tier = 1; tier <= TIERS_PER_RANK; tier++) {
        const level = absoluteLevel(rank, tier);
        expect(rankFromAbsoluteLevel(level)).toEqual({ rank, tier });
      }
    }
  });

  it('rankFromAbsoluteLevel clamps out-of-range values', () => {
    expect(rankFromAbsoluteLevel(0)).toEqual({ rank: 'E', tier: 1 });
    expect(rankFromAbsoluteLevel(-5)).toEqual({ rank: 'E', tier: 1 });
    expect(rankFromAbsoluteLevel(TOTAL_LEVELS + 1)).toEqual({
      rank: 'S',
      tier: 10,
    });
    expect(rankFromAbsoluteLevel(99)).toEqual({ rank: 'S', tier: 10 });
  });
});

describe('player — xpForNextLevel (geometric curve)', () => {
  it('E-1 requires exactly 100 XP', () => {
    expect(xpForNextLevel('E', 1)).toBe(100);
  });

  it('returns Infinity at S-10 (cap reached)', () => {
    expect(xpForNextLevel('S', 10)).toBe(Infinity);
  });

  it('each level requires strictly more XP than the previous', () => {
    let prev = 0;
    for (let level = 1; level <= TOTAL_LEVELS; level++) {
      const { rank, tier } = rankFromAbsoluteLevel(level);
      const need = xpForNextLevel(rank, tier);
      expect(need).toBeGreaterThan(prev);
      prev = need;
    }
  });

  it('approximates 1.4x growth within ~1 unit of floor rounding', () => {
    // L1 = 100, L2 should be ~140 (floor may shave up to 1).
    expect(xpForNextLevel('E', 2)).toBeGreaterThanOrEqual(139);
    expect(xpForNextLevel('E', 2)).toBeLessThanOrEqual(141);
  });
});

describe('player — applyXp', () => {
  it('no-op for zero or negative amount', () => {
    const s = baseState();
    const r = applyXp(s, 0);
    expect(r.state).toEqual(s);
    expect(r.levelsGained).toBe(0);

    const r2 = applyXp(s, -50);
    expect(r2.state).toEqual(s);
    expect(r2.levelsGained).toBe(0);
  });

  it('accumulates XP without leveling up when below the threshold', () => {
    const r = applyXp(baseState(), 50);
    expect(r.state.xp).toBe(50);
    expect(r.state.tier).toBe(1);
    expect(r.state.rank).toBe('E');
    expect(r.levelsGained).toBe(0);
    expect(r.state.totalXp).toBe(50);
  });

  it('levels up exactly when XP crosses the threshold', () => {
    const r = applyXp(baseState(), 100);
    expect(r.state.xp).toBe(0);
    expect(r.state.tier).toBe(2);
    expect(r.state.rank).toBe('E');
    expect(r.levelsGained).toBe(1);
    expect(r.rankUp).toBe(false);
  });

  it('carries overflow XP across a single tier', () => {
    // E-1 needs 100 to clear; E-2 needs ~140. Award 150 → 50 left after
    // clearing E-1, sits in E-2 with 50 XP banked.
    const r = applyXp(baseState(), 150);
    expect(r.state.rank).toBe('E');
    expect(r.state.tier).toBe(2);
    expect(r.state.xp).toBe(50);
    expect(r.levelsGained).toBe(1);
  });

  it('rolls through multiple tiers when XP is huge', () => {
    // 3000 XP clears several E-tiers (E-1..E-6 sum to ~1632, E-7 needs 753
    // leaving ~615, E-8 needs 1054 — so we stop at E-8).
    const r = applyXp(baseState(), 3_000);
    expect(r.levelsGained).toBeGreaterThanOrEqual(6);
    expect(r.state.totalXp).toBe(3_000);
    expect(r.state.rank).toBe('E');
    expect(r.state.tier).toBeGreaterThanOrEqual(7);
  });

  it('triggers rankUp when crossing E-10 → D-1', () => {
    // Push to E-10 first, then award enough to clear E-10's threshold.
    let s = baseState({ rank: 'E', tier: 10, xp: 0 });
    const need = xpForNextLevel('E', 10);
    const r = applyXp(s, need);
    expect(r.state.rank).toBe('D');
    expect(r.state.tier).toBe(1);
    expect(r.rankUp).toBe(true);
    expect(r.levelsGained).toBe(1);
    // sanity: state matches a fresh rankFromAbsoluteLevel
    expect(r.state.rank).toBe(rankFromAbsoluteLevel(11).rank);
    s = r.state;
  });

  it('caps at S-10 and silently drops excess XP', () => {
    let s = baseState({ rank: 'S', tier: 10, xp: 0 });
    const r = applyXp(s, 999_999);
    expect(r.state.rank).toBe('S');
    expect(r.state.tier).toBe(10);
    expect(r.state.xp).toBe(0);
    expect(r.maxed).toBe(true);
    expect(r.levelsGained).toBe(0);
  });

  it('totalXp always equals the sum of every award even after level-ups', () => {
    let s = baseState();
    s = applyXp(s, 80).state;
    s = applyXp(s, 80).state;
    s = applyXp(s, 80).state;
    expect(s.totalXp).toBe(240);
  });
});

describe('player — bumpStat', () => {
  it('adds delta to the requested stat', () => {
    const s = bumpStat(baseState(), 'vocab', 1);
    expect(s.stats.vocab).toBe(1);
    expect(s.stats.grammar).toBe(0);
  });

  it('does not mutate the original state', () => {
    const s = baseState();
    const next = bumpStat(s, 'listening', 5);
    expect(s.stats.listening).toBe(0);
    expect(next.stats.listening).toBe(5);
  });
});

describe('player — dayDiff', () => {
  it('returns 0 for the same day', () => {
    expect(dayDiff('2026-07-19', '2026-07-19')).toBe(0);
  });

  it('returns 1 for the next day', () => {
    expect(dayDiff('2026-07-18', '2026-07-19')).toBe(1);
  });

  it('returns N for N days later', () => {
    expect(dayDiff('2026-07-01', '2026-07-19')).toBe(18);
  });

  it('handles month and year boundaries', () => {
    expect(dayDiff('2026-12-31', '2027-01-01')).toBe(1);
    expect(dayDiff('2026-02-28', '2026-03-01')).toBe(1); // 2026 non-leap
  });

  it('returns NaN for malformed input', () => {
    expect(dayDiff('', '2026-07-19')).toBeNaN();
    expect(dayDiff('2026-07-19', '')).toBeNaN();
    expect(dayDiff('garbage', '2026-07-19')).toBeNaN();
  });
});

describe('player — rolloverStreak', () => {
  it('does nothing if lastActiveDate is empty (first-ever run)', () => {
    const s = baseState({ lastActiveDate: '', streak: 0 });
    expect(rolloverStreak(s, '2026-07-19')).toEqual(s);
  });

  it('does nothing if lastActiveDate is today (same-day activity)', () => {
    const s = baseState({
      lastActiveDate: '2026-07-19',
      streak: 3,
      longestStreak: 5,
    });
    expect(rolloverStreak(s, '2026-07-19')).toEqual(s);
  });

  it('does nothing if lastActiveDate is yesterday (gap of 1, still alive)', () => {
    const s = baseState({
      lastActiveDate: '2026-07-18',
      streak: 3,
      longestStreak: 5,
    });
    expect(rolloverStreak(s, '2026-07-19')).toEqual(s);
  });

  it('resets streak to 0 when the gap is ≥2 days', () => {
    const s = baseState({
      lastActiveDate: '2026-07-16',
      streak: 10,
      longestStreak: 12,
    });
    const r = rolloverStreak(s, '2026-07-19');
    expect(r.streak).toBe(0);
    expect(r.longestStreak).toBe(12); // longest is preserved
  });

  it('resets streak to 0 on malformed previous date', () => {
    const s = baseState({ lastActiveDate: 'garbage', streak: 7 });
    expect(rolloverStreak(s, '2026-07-19').streak).toBe(0);
  });
});
