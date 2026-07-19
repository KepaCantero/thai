// Solo Leveling Phase 5: orchestrator that ties events → daily quest state.
//
// Mirrors playerEngine.ts in shape: subscribe to the event bus, mutate the
// store, expose a snapshot for the UI. SRP — playerEngine owns XP, this
// engine owns quest progress. Neither knows about the other.
//
// Rollover happens lazily on the first event of a new day (no background
// timer), matching how playerEngine handles streak rollover.

import { gameBus } from './events';
import {
  applyEventToQuests,
  rolloverQuests,
} from './quests';
import { dailyQuestsStore } from '../persistence/stores';

const today = (): string => new Date().toISOString().slice(0, 10);

/**
 * Mutate dailyQuestsStore for an incoming event: roll over if a new day
 * started, then apply the event. Centralizes the read-modify-write so the
 * UI just calls snapshotQuests().
 */
function handleEvent(event: Parameters<typeof applyEventToQuests>[1]): void {
  // Capture per-quest completion transitions so we can emit events after the
  // store write commits. Pre-compute "was completed" snapshot from old state.
  const before = dailyQuestsStore.get();
  const beforeCompleted = new Set(before.quests.filter((q) => q.completed).map((q) => q.id));
  const beforeAllClear = beforeCompleted.size === before.quests.length;

  dailyQuestsStore.update((cur) => {
    const { state: rolled } = rolloverQuests(cur, today());
    return applyEventToQuests(rolled, event);
  });

  const after = dailyQuestsStore.get();
  for (const q of after.quests) {
    if (q.completed && !beforeCompleted.has(q.id)) {
      gameBus.emit({ type: 'quest:complete', questId: q.id });
    }
  }
  const afterAllClear = after.quests.every((q) => q.completed);
  if (afterAllClear && !beforeAllClear) {
    gameBus.emit({ type: 'quest:allclear' });
  }
}

/**
 * Subscribe to every event type referenced by QUEST_DEFS. Returns an
 * unsubscribe for tests; in prod the engine lives for the page lifetime.
 */
export function wireQuestEngine(): () => void {
  const offs: Array<() => void> = [];

  offs.push(
    gameBus.on('srs:review', (e) => handleEvent(e)),
    gameBus.on('card:known', (e) => handleEvent(e)),
    gameBus.on('lesson:complete', (e) => handleEvent(e)),
    gameBus.on('study:tick', (e) => handleEvent(e)),
  );

  return () => {
    for (const off of offs) off();
  };
}

/**
 * Test/diagnostic helper — read-only snapshot of current quest state.
 * Triggers rollover on read so callers always see today's quests.
 */
export function snapshotQuests() {
  const cur = dailyQuestsStore.get();
  if (cur.date === today()) return cur;
  const { state } = rolloverQuests(cur, today());
  dailyQuestsStore.set(state);
  return state;
}
