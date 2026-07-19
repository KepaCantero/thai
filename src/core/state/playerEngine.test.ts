import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory backing for the mocked stores. Each test resets them.
let playerValue: Record<string, unknown> = freshPlayer();
let xpLogValue: unknown[] = [];

function freshPlayer(): Record<string, unknown> {
  return {
    v: 1,
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

vi.mock('../persistence/stores', () => ({
  playerStore: {
    get: () => playerValue,
    set: (v: Record<string, unknown>) => {
      playerValue = v;
    },
    update: (fn: (cur: Record<string, unknown>) => Record<string, unknown>) => {
      playerValue = fn(playerValue);
    },
  },
  xpLogStore: {
    get: () => xpLogValue,
    set: (v: unknown[]) => {
      xpLogValue = v;
    },
    update: (fn: (cur: unknown[]) => unknown[]) => {
      xpLogValue = fn(xpLogValue);
    },
  },
}));

import { gameBus } from './events';
import { wirePlayerEngine, snapshotPlayer } from './playerEngine';

describe('playerEngine — wiring + unsubscribe', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
  });

  it('returns an unsubscribe function that stops further XP gains', () => {
    const off = wirePlayerEngine();
    off();
    gameBus.emit({ type: 'tone:correct' });
    expect(snapshotPlayer().totalXp).toBe(0);
  });
});

describe('playerEngine — flat XP rules', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
    wirePlayerEngine();
  });

  it('card:known awards 15 XP and bumps vocab', () => {
    gameBus.emit({ type: 'card:known', entryId: 'w-001' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(15);
    expect(snap.stats.vocab).toBe(1);
  });

  it('lesson:complete awards 50 XP and bumps no stat', () => {
    gameBus.emit({ type: 'lesson:complete', lesson: 'L01' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(50);
    expect(snap.stats.vocab).toBe(0);
  });

  it('conv:play awards 5 XP and bumps listening', () => {
    gameBus.emit({ type: 'conv:play', source: 'cthai', entryId: 'c-1' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(5);
    expect(snap.stats.listening).toBe(1);
  });

  it('tone:correct awards 8 XP and bumps pronunciation', () => {
    gameBus.emit({ type: 'tone:correct' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(8);
    expect(snap.stats.pronunciation).toBe(1);
  });

  it('tone:wrong awards 2 XP and bumps no stat', () => {
    gameBus.emit({ type: 'tone:wrong' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(2);
    expect(snap.stats.pronunciation).toBe(0);
  });

  it('shadow:rep awards 6 XP and bumps pronunciation', () => {
    gameBus.emit({ type: 'shadow:rep', level: 'shadowing-1' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(6);
    expect(snap.stats.pronunciation).toBe(1);
  });
});

describe('playerEngine — SRS rating table', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
    wirePlayerEngine();
  });

  it.each([
    ['again', 2],
    ['hard', 8],
    ['good', 10],
    ['easy', 15],
  ] as const)('rating %s awards %d XP', (rating, xp) => {
    gameBus.emit({ type: 'srs:review', rating, deck: 'palabras' });
    expect(snapshotPlayer().totalXp).toBe(xp);
  });

  it('palabras deck bumps vocab', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    expect(snapshotPlayer().stats.vocab).toBe(1);
  });

  it('estructuras deck bumps grammar', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'estructuras' });
    expect(snapshotPlayer().stats.grammar).toBe(1);
  });

  it('frases deck bumps reading', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'frases' });
    expect(snapshotPlayer().stats.reading).toBe(1);
  });

  it('cthai deck bumps listening', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'cthai' });
    expect(snapshotPlayer().stats.listening).toBe(1);
  });

  it('unknown deck awards XP but bumps no stat', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'mystery' });
    const snap = snapshotPlayer();
    expect(snap.totalXp).toBe(10);
    expect(snap.stats.vocab).toBe(0);
  });
});

describe('playerEngine — study:tick', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
    wirePlayerEngine();
  });

  it('awards 1 XP per 30 seconds (rounded down)', () => {
    gameBus.emit({ type: 'study:tick', seconds: 90 });
    expect(snapshotPlayer().totalXp).toBe(3);
  });

  it('awards 0 XP for ticks below the threshold', () => {
    gameBus.emit({ type: 'study:tick', seconds: 29 });
    expect(snapshotPlayer().totalXp).toBe(0);
  });
});

describe('playerEngine — XP log', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
    wirePlayerEngine();
  });

  it('appends one entry per award', () => {
    gameBus.emit({ type: 'card:known', entryId: 'a' });
    gameBus.emit({ type: 'tone:correct' });
    expect(xpLogValue.length).toBe(2);
  });

  it('records source + amount + stat on each entry', () => {
    gameBus.emit({ type: 'card:known', entryId: 'a' });
    const entry = xpLogValue[0] as {
      ts: number;
      amount: number;
      source: string;
      stat?: string;
    };
    expect(entry.amount).toBe(15);
    expect(entry.source).toBe('card:known');
    expect(entry.stat).toBe('vocab');
    expect(entry.ts).toBeGreaterThan(0);
  });
});

describe('playerEngine — streak', () => {
  beforeEach(() => {
    playerValue = freshPlayer();
    xpLogValue = [];
    gameBus.clear();
    wirePlayerEngine();
  });

  it('starts the streak at 1 on first-ever activity', () => {
    gameBus.emit({ type: 'tone:correct' });
    const snap = snapshotPlayer();
    expect(snap.streak).toBe(1);
    expect(snap.longestStreak).toBe(1);
    expect(snap.lastActiveDate).toBe(new Date().toISOString().slice(0, 10));
  });

  it('does not double-increment the streak for same-day activity', () => {
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:correct' });
    expect(snapshotPlayer().streak).toBe(1);
  });

  it('keeps the highest streak in longestStreak', () => {
    // Simulate a previous streak of 5 ending today.
    playerValue = {
      ...freshPlayer(),
      streak: 5,
      longestStreak: 5,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };
    gameBus.emit({ type: 'tone:correct' });
    const snap = snapshotPlayer();
    expect(snap.streak).toBe(5);
    expect(snap.longestStreak).toBe(5);
  });
});
