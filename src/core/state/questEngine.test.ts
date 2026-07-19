import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory backing for the mocked store. Reset every test.
let questsValue: Record<string, unknown> = freshInitial();

function freshInitial(): Record<string, unknown> {
  return {
    v: 1,
    date: '',
    penalty: false,
    quests: [
      { id: 'srs-reviews', progress: 0, goal: 30, completed: false },
      { id: 'new-known', progress: 0, goal: 10, completed: false },
      { id: 'lessons', progress: 0, goal: 1, completed: false },
      { id: 'study-time', progress: 0, goal: 600, completed: false },
    ],
  };
}

vi.mock('../persistence/stores', () => ({
  dailyQuestsStore: {
    get: () => questsValue,
    set: (v: Record<string, unknown>) => {
      questsValue = v;
    },
    update: (fn: (cur: Record<string, unknown>) => Record<string, unknown>) => {
      questsValue = fn(questsValue);
    },
  },
}));

import { gameBus } from './events';
import { wireQuestEngine, snapshotQuests } from './questEngine';

const today = (): string => new Date().toISOString().slice(0, 10);

describe('questEngine — wiring + unsubscribe', () => {
  beforeEach(() => {
    questsValue = freshInitial();
    gameBus.clear();
  });

  it('returns an unsubscribe that stops further progress', () => {
    const off = wireQuestEngine();
    off();
    gameBus.emit({ type: 'card:known', entryId: 'w-1' });
    const snap = snapshotQuests();
    const known = snap.quests.find((q) => q.id === 'new-known')!;
    expect(known.progress).toBe(0);
  });
});

describe('questEngine — events update progress', () => {
  beforeEach(() => {
    questsValue = freshInitial();
    gameBus.clear();
    wireQuestEngine();
  });

  it('srs:review increments the srs-reviews quest', () => {
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    const q = snapshotQuests().quests.find((x) => x.id === 'srs-reviews')!;
    expect(q.progress).toBe(1);
  });

  it('card:known increments the new-known quest', () => {
    gameBus.emit({ type: 'card:known', entryId: 'w-1' });
    const q = snapshotQuests().quests.find((x) => x.id === 'new-known')!;
    expect(q.progress).toBe(1);
  });

  it('lesson:complete completes the lessons quest', () => {
    gameBus.emit({ type: 'lesson:complete', lesson: 'L01' });
    const q = snapshotQuests().quests.find((x) => x.id === 'lessons')!;
    expect(q.progress).toBe(1);
    expect(q.completed).toBe(true);
  });

  it('study:tick accumulates seconds', () => {
    gameBus.emit({ type: 'study:tick', seconds: 200 });
    gameBus.emit({ type: 'study:tick', seconds: 100 });
    const q = snapshotQuests().quests.find((x) => x.id === 'study-time')!;
    expect(q.progress).toBe(300);
  });

  it('does not respond to non-quest events', () => {
    gameBus.emit({ type: 'tone:correct' });
    const snap = snapshotQuests();
    expect(snap.quests.every((q) => q.progress === 0)).toBe(true);
  });
});

describe('questEngine — rollover on new day', () => {
  beforeEach(() => {
    questsValue = freshInitial();
    gameBus.clear();
  });

  it('rolls over to today on first snapshot read', () => {
    const snap = snapshotQuests();
    expect(snap.date).toBe(today());
    expect(snap.quests).toHaveLength(4);
  });

  it('marks penalty when previous day was incomplete', () => {
    // Seed with yesterday's incomplete state.
    const yesterday = new Date(Date.now() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    questsValue = {
      v: 1,
      date: yesterday,
      penalty: false,
      quests: [
        { id: 'srs-reviews', progress: 5, goal: 30, completed: false },
        { id: 'new-known', progress: 0, goal: 10, completed: false },
        { id: 'lessons', progress: 0, goal: 1, completed: false },
        { id: 'study-time', progress: 0, goal: 600, completed: false },
      ],
    };
    const snap = snapshotQuests();
    expect(snap.date).toBe(today());
    expect(snap.penalty).toBe(true);
    expect(snap.quests.find((q) => q.id === 'srs-reviews')!.goal).toBe(60);
  });

  it('engine applies rollover before applying the event', () => {
    const yesterday = new Date(Date.now() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    questsValue = {
      v: 1,
      date: yesterday,
      penalty: false,
      quests: [
        { id: 'srs-reviews', progress: 25, goal: 30, completed: false },
        { id: 'new-known', progress: 0, goal: 10, completed: false },
        { id: 'lessons', progress: 0, goal: 1, completed: false },
        { id: 'study-time', progress: 0, goal: 600, completed: false },
      ],
    };
    wireQuestEngine();
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    const snap = snapshotQuests();
    expect(snap.date).toBe(today());
    // Penalty doubles the goal; the single review resets progress to 1.
    expect(snap.quests.find((q) => q.id === 'srs-reviews')!.progress).toBe(1);
    expect(snap.penalty).toBe(true);
  });
});
