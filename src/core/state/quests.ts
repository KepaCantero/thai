// Solo Leveling Phase 5: Daily Quests — pure definitions + math.
//
// No localStorage, no DOM, no event-bus subscriptions. The engine
// (questEngine.ts) is the only thing that persists quest state; this module
// holds the schema, the quest catalogue, and the pure transition functions
// that the engine and the UI both consume.
//
// Penalty model: if the previous day's quests were not all completed, the
// next day's goals double (penaltyMultiplier = 2) and a `penalty` flag is
// set so the UI can render the red-border "PENALTY" state.

import type { GameEvent, GameEventType } from './events';
import { dayDiff } from './player';

export type QuestId = 'srs-reviews' | 'new-known' | 'lessons' | 'study-time';

export interface QuestDef {
  id: QuestId;
  label: string; // "Review 30 cards"
  hint: string; // "SRS sessions of any deck"
  goal: number; // target value at multiplier=1
  unit: string; // "cards" / "entries" / "lessons" / "sec"
  eventType: GameEventType; // which event increments this quest
  // For events with payload (study:tick carries seconds), accumulate by that
  // amount. Default (no accumulator) = +1 per matching event.
  accumulate?: (event: GameEvent, current: number) => number;
}

export const QUEST_DEFS: readonly QuestDef[] = [
  {
    id: 'srs-reviews',
    label: 'Review 30 cards',
    hint: 'Any SRS deck',
    goal: 30,
    unit: 'cards',
    eventType: 'srs:review',
  },
  {
    id: 'new-known',
    label: 'Learn 10 entries',
    hint: 'Mark known',
    goal: 10,
    unit: 'entries',
    eventType: 'card:known',
  },
  {
    id: 'lessons',
    label: 'Complete 1 lesson',
    hint: 'Any mode',
    goal: 1,
    unit: 'lessons',
    eventType: 'lesson:complete',
  },
  {
    id: 'study-time',
    label: 'Study 10 minutes',
    hint: 'Active time',
    goal: 600,
    unit: 'sec',
    eventType: 'study:tick',
    accumulate: (e, c) => c + (e as { seconds: number }).seconds,
  },
];

export interface QuestProgress {
  id: QuestId;
  progress: number; // current value (clamped 0..goal)
  goal: number; // today's goal (already multiplied if penalty)
  completed: boolean; // sticky once progress >= goal
  completedAt?: number; // ts when the goal was crossed
}

export interface DailyQuestsState {
  v: 1;
  date: string; // YYYY-MM-DD these quests were generated for
  penalty: boolean; // true if today's goals were inflated due to a prior miss
  penaltyUntil?: string; // YYYY-MM-DD the penalty window ends (exclusive)
  quests: QuestProgress[]; // 4 entries, in QUEST_DEFS order
}

const clamp = (n: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, n));

/** Add exactly one calendar day to a YYYY-MM-DD string. Pure. */
export function addDays(date: string, days: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/**
 * Build a fresh state for `date`. When `penaltyMultiplier > 1` (e.g. 2 for a
 * missed day), every quest goal is multiplied — progress resets to 0.
 */
export function freshDailyQuests(
  date: string,
  penaltyMultiplier = 1,
): DailyQuestsState {
  const mult = penaltyMultiplier < 1 ? 1 : Math.floor(penaltyMultiplier);
  const quests: QuestProgress[] = QUEST_DEFS.map((def) => ({
    id: def.id,
    progress: 0,
    goal: def.goal * mult,
    completed: false,
  }));
  return {
    v: 1,
    date,
    penalty: mult > 1,
    quests,
  };
}

/**
 * Initial state persisted by the store before the engine runs rollover on
 * first boot. `date: ''` forces rollover to populate today's quests.
 */
export function freshDailyQuestsInitialState(): DailyQuestsState {
  return {
    v: 1,
    date: '',
    penalty: false,
    quests: QUEST_DEFS.map((def) => ({
      id: def.id,
      progress: 0,
      goal: def.goal,
      completed: false,
    })),
  };
}

/**
 * Apply one game event to today's quests. Pure — returns a new state.
 *
 * - Only the quest whose `eventType` matches is touched.
 * - Progress is clamped to [0, goal].
 * - `completed` is sticky: once true it stays true for the rest of the day.
 * - `completedAt` is recorded the first time the goal is crossed.
 */
export function applyEventToQuests(
  state: DailyQuestsState,
  event: GameEvent,
): DailyQuestsState {
  const def = QUEST_DEFS.find((d) => d.eventType === event.type);
  if (!def) return state;

  const idx = state.quests.findIndex((q) => q.id === def.id);
  if (idx < 0) return state;

  const cur = state.quests[idx];
  const delta = def.accumulate
    ? def.accumulate(event, cur.progress) - cur.progress
    : 1;
  if (!Number.isFinite(delta) || delta <= 0) return state;

  const progress = clamp(cur.progress + delta, 0, cur.goal);
  const justCompleted = !cur.completed && progress >= cur.goal;

  const nextQuest: QuestProgress = justCompleted
    ? { ...cur, progress, completed: true, completedAt: Date.now() }
    : { ...cur, progress };

  const quests = state.quests.slice();
  quests[idx] = nextQuest;

  return { ...state, quests };
}

/** True iff every quest in the state has `completed === true`. */
export function allCompleted(state: DailyQuestsState): boolean {
  return state.quests.length > 0 && state.quests.every((q) => q.completed);
}

/**
 * Roll the daily window forward to `today`.
 *
 * - Same day → no-op, returns the state unchanged with `missedYesterday: false`.
 * - New day, all of yesterday's quests completed → fresh quests, no penalty.
 * - New day, some quests incomplete → fresh quests with goals doubled and a
 *   `penaltyUntil` of `today+1` (penalty lasts one day).
 *
 * The returned `state.date` always equals `today`.
 */
export function rolloverQuests(
  state: DailyQuestsState,
  today: string,
): { state: DailyQuestsState; missedYesterday: boolean } {
  if (state.date === today) {
    return { state, missedYesterday: false };
  }

  // Initial boot (date === '') — no prior day to penalize.
  if (state.date === '') {
    return { state: freshDailyQuests(today), missedYesterday: false };
  }

  const missedYesterday = !allCompleted(state);
  if (missedYesterday) {
    const next = freshDailyQuests(today, 2);
    next.penaltyUntil = addDays(today, 1);
    return { state: next, missedYesterday: true };
  }
  return { state: freshDailyQuests(today), missedYesterday: false };
}

/**
 * True iff a penalty window is currently active for `today`.
 * Penalty is active when `penalty` is set AND `today` is strictly before
 * `penaltyUntil` (the day AFTER the miss). Once `today >= penaltyUntil`,
 * the flag clears even if the persisted state still carries it.
 */
export function penaltyActive(state: DailyQuestsState, today: string): boolean {
  if (!state.penalty) return false;
  if (!state.penaltyUntil) return false;
  const gap = dayDiff(today, state.penaltyUntil);
  if (Number.isNaN(gap)) return false;
  return gap > 0;
}
