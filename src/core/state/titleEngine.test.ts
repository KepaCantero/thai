import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory backing for the mocked titles store.
let titlesValue: Record<string, unknown> = fresh();

function fresh(): Record<string, unknown> {
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

const snapshotPlayerMock = vi.fn();

vi.mock('../persistence/stores', () => ({
  titlesStore: {
    get: () => titlesValue,
    set: (v: Record<string, unknown>) => {
      titlesValue = v;
    },
    update: (fn: (cur: Record<string, unknown>) => Record<string, unknown>) => {
      titlesValue = fn(titlesValue);
    },
  },
}));

vi.mock('./playerEngine', () => ({
  snapshotPlayer: () => snapshotPlayerMock(),
}));

import { gameBus } from './events';
import { wireTitleEngine, snapshotTitles, setActiveTitle } from './titleEngine';

function playerSnap(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    v: 1,
    rank: 'E',
    tier: 1,
    xp: 0,
    totalXp: 0,
    stats: {
      vocab: 0, grammar: 0, pronunciation: 0, listening: 0, reading: 0,
    },
    streak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    ...overrides,
  };
}

describe('titleEngine — wiring + unsubscribe', () => {
  beforeEach(() => {
    titlesValue = fresh();
    snapshotPlayerMock.mockReset();
    snapshotPlayerMock.mockReturnValue(playerSnap());
    gameBus.clear();
  });

  it('returns an unsubscribe that stops further accumulator bumps', () => {
    const off = wireTitleEngine();
    off();
    gameBus.emit({ type: 'card:known', entryId: 'w-1' });
    expect(snapshotTitles().lifetimeKnown).toBe(0);
  });
});

describe('titleEngine — accumulators', () => {
  beforeEach(() => {
    titlesValue = fresh();
    snapshotPlayerMock.mockReset();
    snapshotPlayerMock.mockReturnValue(playerSnap());
    gameBus.clear();
    wireTitleEngine();
  });

  it('card:known bumps lifetimeKnown', () => {
    gameBus.emit({ type: 'card:known', entryId: 'a' });
    gameBus.emit({ type: 'card:known', entryId: 'b' });
    expect(snapshotTitles().lifetimeKnown).toBe(2);
  });

  it('srs:review bumps lifetimeReviews', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    expect(snapshotTitles().lifetimeReviews).toBe(1);
  });

  it('conv:play bumps lifetimeConvPlays', () => {
    gameBus.emit({ type: 'conv:play', source: 'cthai', entryId: 'c-1' });
    expect(snapshotTitles().lifetimeConvPlays).toBe(1);
  });

  it('shadow:rep bumps lifetimeShadowReps', () => {
    gameBus.emit({ type: 'shadow:rep', level: 'shadowing-1' });
    expect(snapshotTitles().lifetimeShadowReps).toBe(1);
  });

  it('quest:allclear bumps allClearDays', () => {
    gameBus.emit({ type: 'quest:allclear' });
    expect(snapshotTitles().allClearDays).toBe(1);
  });

  it('level:up does not bump any accumulator', () => {
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    const s = snapshotTitles();
    expect(s.lifetimeKnown).toBe(0);
    expect(s.lifetimeReviews).toBe(0);
    expect(s.allClearDays).toBe(0);
  });

  it('does not respond to unrelated events', () => {
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:wrong' });
    gameBus.emit({ type: 'mode:open', mode: 'srs' });
    gameBus.emit({ type: 'card:unknown', entryId: 'x' });
    gameBus.emit({ type: 'study:tick', seconds: 30 });
    const s = snapshotTitles();
    expect(s.lifetimeKnown).toBe(0);
    expect(s.lifetimeReviews).toBe(0);
  });
});

describe('titleEngine — unlock emissions', () => {
  beforeEach(() => {
    titlesValue = fresh();
    snapshotPlayerMock.mockReset();
    snapshotPlayerMock.mockReturnValue(playerSnap());
    gameBus.clear();
    wireTitleEngine();
  });

  it('reaching D rank unlocks awakened and emits title:unlock', () => {
    const seen: Array<{ type: string; titleId?: string; label?: string }> = [];
    gameBus.on('title:unlock', (e) => seen.push(e));
    snapshotPlayerMock.mockReturnValue(playerSnap({ rank: 'D', tier: 1 }));
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    expect(seen.find((e) => e.titleId === 'awakened')).toBeTruthy();
    expect(snapshotTitles().unlocked).toContain('awakened');
  });

  it('unlocking is idempotent (no double-emit on subsequent events)', () => {
    const seen: string[] = [];
    gameBus.on('title:unlock', (e) => seen.push(e.titleId!));
    snapshotPlayerMock.mockReturnValue(playerSnap({ rank: 'D', tier: 1 }));
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    gameBus.emit({ type: 'card:known', entryId: 'a' });
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    expect(seen.filter((id) => id === 'awakened').length).toBe(1);
  });

  it('first 10 known cards unlock first-steps exactly once', () => {
    const seen: string[] = [];
    gameBus.on('title:unlock', (e) => seen.push(e.titleId!));
    for (let i = 0; i < 9; i++) {
      gameBus.emit({ type: 'card:known', entryId: `w-${i}` });
    }
    expect(seen).toEqual([]);
    gameBus.emit({ type: 'card:known', entryId: 'w-9' });
    expect(seen).toEqual(['first-steps']);
    gameBus.emit({ type: 'card:known', entryId: 'w-10' });
    expect(seen).toEqual(['first-steps']);
  });

  it('S rank emits all 5 rank titles in one event', () => {
    const seen: string[] = [];
    gameBus.on('title:unlock', (e) => seen.push(e.titleId!));
    snapshotPlayerMock.mockReturnValue(playerSnap({ rank: 'S', tier: 1 }));
    gameBus.emit({ type: 'level:up', rank: 'S', tier: 1, levelsGained: 1, rankUp: true });
    expect(seen).toEqual(['awakened', 'hunter', 'elite', 'sovereign', 'monarch']);
  });

  it('persists accumulators even when no title unlocks', () => {
    gameBus.emit({ type: 'conv:play', source: 'x', entryId: 'y' });
    expect(snapshotTitles().lifetimeConvPlays).toBe(1);
    expect(snapshotTitles().unlocked).toEqual([]);
  });
});

describe('titleEngine — defensive behavior', () => {
  beforeEach(() => {
    titlesValue = fresh();
    snapshotPlayerMock.mockReset();
    snapshotPlayerMock.mockReturnValue(playerSnap());
    gameBus.clear();
    wireTitleEngine();
  });

  it('survives a throwing snapshotPlayer', () => {
    snapshotPlayerMock.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() =>
      gameBus.emit({ type: 'card:known', entryId: 'a' }),
    ).not.toThrow();
  });
});

describe('setActiveTitle', () => {
  beforeEach(() => {
    titlesValue = fresh();
    snapshotPlayerMock.mockReset();
    snapshotPlayerMock.mockReturnValue(playerSnap());
    gameBus.clear();
    wireTitleEngine();
    // Force-unlock awakened + first-steps for these cases.
    titlesValue = {
      ...fresh(),
      unlocked: ['awakened', 'first-steps'],
    };
  });

  it('equips an unlocked title', () => {
    expect(setActiveTitle('awakened')).toBe(true);
    expect(snapshotTitles().activeTitle).toBe('awakened');
  });

  it('rejects a locked title', () => {
    expect(setActiveTitle('hunter')).toBe(false);
    expect(snapshotTitles().activeTitle).toBeNull();
  });

  it('rejects an unknown id', () => {
    expect(setActiveTitle('does-not-exist')).toBe(false);
  });

  it('null clears the active slot', () => {
    setActiveTitle('awakened');
    expect(snapshotTitles().activeTitle).toBe('awakened');
    expect(setActiveTitle(null)).toBe(true);
    expect(snapshotTitles().activeTitle).toBeNull();
  });

  it('re-equipping the active title is a successful no-op', () => {
    setActiveTitle('awakened');
    const before = snapshotTitles();
    expect(setActiveTitle('awakened')).toBe(true);
    expect(snapshotTitles()).toEqual(before);
  });
});
