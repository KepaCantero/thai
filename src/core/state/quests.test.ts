import { describe, expect, it } from 'vitest';
import {
  addDays,
  allCompleted,
  applyEventToQuests,
  freshDailyQuests,
  freshDailyQuestsInitialState,
  penaltyActive,
  QUEST_DEFS,
  rolloverQuests,
} from './quests';

const TODAY = '2026-07-19';
const YESTERDAY = '2026-07-18';
const TOMORROW = '2026-07-20';

describe('quests — freshDailyQuests', () => {
  it('creates 4 quests with default goals', () => {
    const s = freshDailyQuests(TODAY);
    expect(s.date).toBe(TODAY);
    expect(s.penalty).toBe(false);
    expect(s.quests).toHaveLength(4);
    expect(s.quests.map((q) => q.id)).toEqual(QUEST_DEFS.map((d) => d.id));
    expect(s.quests.every((q) => q.progress === 0)).toBe(true);
    expect(s.quests.every((q) => !q.completed)).toBe(true);
  });

  it('doubles goals when penalty multiplier is 2', () => {
    const s = freshDailyQuests(TODAY, 2);
    expect(s.penalty).toBe(true);
    const reviews = s.quests.find((q) => q.id === 'srs-reviews')!;
    expect(reviews.goal).toBe(60);
    const known = s.quests.find((q) => q.id === 'new-known')!;
    expect(known.goal).toBe(20);
    const lessons = s.quests.find((q) => q.id === 'lessons')!;
    expect(lessons.goal).toBe(2);
    const study = s.quests.find((q) => q.id === 'study-time')!;
    expect(study.goal).toBe(1200);
  });

  it('initial state has empty date so rollover will populate', () => {
    const s = freshDailyQuestsInitialState();
    expect(s.date).toBe('');
    expect(s.quests).toHaveLength(4);
  });
});

describe('quests — applyEventToQuests', () => {
  it('increments srs-reviews by 1 per event', () => {
    const s = freshDailyQuests(TODAY);
    const after = applyEventToQuests(s, {
      type: 'srs:review',
      rating: 'good',
      deck: 'palabras',
    });
    const q = after.quests.find((x) => x.id === 'srs-reviews')!;
    expect(q.progress).toBe(1);
    expect(q.completed).toBe(false);
  });

  it('increments new-known by 1 per card:known', () => {
    const s = freshDailyQuests(TODAY);
    const after = applyEventToQuests(s, {
      type: 'card:known',
      entryId: 'w-001',
    });
    expect(after.quests.find((q) => q.id === 'new-known')!.progress).toBe(1);
  });

  it('completes lessons on a single lesson:complete', () => {
    const s = freshDailyQuests(TODAY);
    const after = applyEventToQuests(s, {
      type: 'lesson:complete',
      lesson: 'L01',
    });
    const q = after.quests.find((x) => x.id === 'lessons')!;
    expect(q.progress).toBe(1);
    expect(q.completed).toBe(true);
    expect(q.completedAt).toBeGreaterThan(0);
  });

  it('accumulates study:tick seconds', () => {
    const s = freshDailyQuests(TODAY);
    let after = applyEventToQuests(s, { type: 'study:tick', seconds: 120 });
    after = applyEventToQuests(after, { type: 'study:tick', seconds: 90 });
    expect(after.quests.find((q) => q.id === 'study-time')!.progress).toBe(210);
  });

  it('clamps progress at goal and marks completed', () => {
    const s = freshDailyQuests(TODAY);
    let after = s;
    for (let i = 0; i < 35; i++) {
      after = applyEventToQuests(after, {
        type: 'srs:review',
        rating: 'good',
        deck: 'palabras',
      });
    }
    const q = after.quests.find((x) => x.id === 'srs-reviews')!;
    expect(q.progress).toBe(30);
    expect(q.completed).toBe(true);
  });

  it('keeps completed sticky after crossing goal', () => {
    const s = freshDailyQuests(TODAY);
    const after = applyEventToQuests(s, {
      type: 'lesson:complete',
      lesson: 'L01',
    });
    const again = applyEventToQuests(after, {
      type: 'lesson:complete',
      lesson: 'L02',
    });
    const q = again.quests.find((x) => x.id === 'lessons')!;
    expect(q.progress).toBe(1);
    expect(q.completed).toBe(true);
  });

  it('ignores events that do not match any quest', () => {
    const s = freshDailyQuests(TODAY);
    const after = applyEventToQuests(s, { type: 'tone:correct' });
    expect(after).toBe(s);
  });
});

describe('quests — allCompleted', () => {
  it('returns false on fresh quests', () => {
    expect(allCompleted(freshDailyQuests(TODAY))).toBe(false);
  });

  it('returns true once every quest is completed', () => {
    let s = freshDailyQuests(TODAY);
    for (let i = 0; i < 30; i++) {
      s = applyEventToQuests(s, {
        type: 'srs:review',
        rating: 'good',
        deck: 'palabras',
      });
    }
    for (let i = 0; i < 10; i++) {
      s = applyEventToQuests(s, { type: 'card:known', entryId: `w-${i}` });
    }
    s = applyEventToQuests(s, { type: 'lesson:complete', lesson: 'L01' });
    s = applyEventToQuests(s, { type: 'study:tick', seconds: 600 });
    expect(allCompleted(s)).toBe(true);
  });
});

describe('quests — rolloverQuests', () => {
  it('is a no-op when state.date equals today', () => {
    const s = freshDailyQuests(TODAY);
    const { state, missedYesterday } = rolloverQuests(s, TODAY);
    expect(state).toBe(s);
    expect(missedYesterday).toBe(false);
  });

  it('populates today with no penalty on first boot (date = "")', () => {
    const initial = freshDailyQuestsInitialState();
    const { state, missedYesterday } = rolloverQuests(initial, TODAY);
    expect(state.date).toBe(TODAY);
    expect(state.penalty).toBe(false);
    expect(missedYesterday).toBe(false);
  });

  it('does not penalize when previous day was fully completed', () => {
    let yesterday = freshDailyQuests(YESTERDAY);
    // Complete all quests.
    for (let i = 0; i < 30; i++) {
      yesterday = applyEventToQuests(yesterday, {
        type: 'srs:review',
        rating: 'good',
        deck: 'palabras',
      });
    }
    for (let i = 0; i < 10; i++) {
      yesterday = applyEventToQuests(yesterday, {
        type: 'card:known',
        entryId: `w-${i}`,
      });
    }
    yesterday = applyEventToQuests(yesterday, {
      type: 'lesson:complete',
      lesson: 'L01',
    });
    yesterday = applyEventToQuests(yesterday, { type: 'study:tick', seconds: 600 });

    const { state, missedYesterday } = rolloverQuests(yesterday, TODAY);
    expect(state.date).toBe(TODAY);
    expect(state.penalty).toBe(false);
    expect(state.quests.every((q) => !q.completed)).toBe(true);
    expect(missedYesterday).toBe(false);
  });

  it('penalizes when previous day was incomplete', () => {
    const yesterday = freshDailyQuests(YESTERDAY);
    const { state, missedYesterday } = rolloverQuests(yesterday, TODAY);
    expect(state.date).toBe(TODAY);
    expect(state.penalty).toBe(true);
    expect(state.penaltyUntil).toBe(TOMORROW);
    expect(state.quests.find((q) => q.id === 'srs-reviews')!.goal).toBe(60);
    expect(missedYesterday).toBe(true);
  });
});

describe('quests — penaltyActive', () => {
  it('is false when penalty flag is not set', () => {
    const s = freshDailyQuests(TODAY);
    expect(penaltyActive(s, TODAY)).toBe(false);
  });

  it('is true when penalty is set and today < penaltyUntil', () => {
    const s = freshDailyQuests(TODAY, 2);
    s.penaltyUntil = TOMORROW;
    expect(penaltyActive(s, TODAY)).toBe(true);
  });

  it('clears once today >= penaltyUntil', () => {
    const s = freshDailyQuests(TODAY, 2);
    s.penaltyUntil = TODAY;
    expect(penaltyActive(s, TODAY)).toBe(false);
  });
});

describe('quests — addDays', () => {
  it('adds one day across a month boundary', () => {
    expect(addDays('2026-07-31', 1)).toBe('2026-08-01');
  });
  it('subtracts one day', () => {
    expect(addDays('2026-08-01', -1)).toBe('2026-07-31');
  });
});
