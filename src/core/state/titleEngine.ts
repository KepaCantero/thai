// Solo Leveling Phase 7: orchestrator that ties events → title unlocks.
//
// Mirrors playerEngine.ts / questEngine.ts: subscribe to the event bus, mutate
// the titles store, emit `title:unlock` for each newly-eligible title. SRP —
// the engine owns the lifetime accumulators + unlock notifications, nothing
// else. The UI reads via snapshotTitles() / TITLE_DEFS.
//
// Lifetime accumulators only ever bump up. They persist across streak resets
// and prestige so the player never loses credit for past effort. We bump the
// accumulator BEFORE computing unlocks so the triggering event's predicate
// (e.g. lifetimeKnown >= 10) can be satisfied by that very event.

import { gameBus, type GameEventType } from './events';
import { snapshotPlayer } from './playerEngine';
import { titlesStore } from '../persistence/stores';
import {
  applyUnlocks,
  buildCtx,
  computeNewUnlocks,
  TITLE_DEFS,
  type TitleDef,
  type TitleId,
  type TitlesState,
} from './titles';

/** Event types that should trigger a title re-check. */
const WATCHED_TYPES: readonly GameEventType[] = [
  'card:known',
  'srs:review',
  'conv:play',
  'shadow:rep',
  'quest:allclear',
  'level:up',
];

/** Map an event type to the accumulator field it bumps (+1). */
function bumpFor(
  type: GameEventType,
): keyof Pick<
  TitlesState,
  | 'lifetimeKnown'
  | 'lifetimeReviews'
  | 'lifetimeConvPlays'
  | 'lifetimeShadowReps'
  | 'allClearDays'
> | null {
  switch (type) {
    case 'card:known':
      return 'lifetimeKnown';
    case 'srs:review':
      return 'lifetimeReviews';
    case 'conv:play':
      return 'lifetimeConvPlays';
    case 'shadow:rep':
      return 'lifetimeShadowReps';
    case 'quest:allclear':
      return 'allClearDays';
    default:
      return null;
  }
}

/**
 * Single integration point for every watched event. Reads the player snapshot
 * + the current titles state, bumps the matching accumulator, evaluates every
 * predicate, emits `title:unlock` for each newly-unlocked title, and persists
 * the result. Wrapped in try/catch by each subscriber so a store failure
 * can never throw back into the bus.
 */
function handleEvent(type: GameEventType): void {
  // Read player + titles state once.
  const player = snapshotPlayer();
  const state = titlesStore.get();

  // Bump accumulator if applicable. We mutate defensively — never let a NaN
  // or negative value leak in.
  const field = bumpFor(type);
  const next: TitlesState =
    field !== null
      ? { ...state, [field]: Math.max(0, Math.floor(state[field] | 0)) + 1 }
      : state;

  // Evaluate predicates.
  const ctx = buildCtx(next, {
    rank: player.rank,
    tier: player.tier,
    stats: player.stats,
    totalXp: player.totalXp,
    streak: player.streak,
    longestStreak: player.longestStreak,
  });
  const newlyUnlocked = computeNewUnlocks(next, ctx);

  // Persist (always — accumulator bumps deserve to be saved even when no
  // title unlocks this tick).
  const applied = applyUnlocks(next, newlyUnlocked);
  titlesStore.set(applied);

  // Emit AFTER commit so listeners see a consistent store.
  for (const def of newlyUnlocked) {
    try {
      gameBus.emit({ type: 'title:unlock', titleId: def.id, label: def.label });
    } catch (err) {
      console.error('[titleEngine] title:unlock emit failed', err);
    }
  }
}

/**
 * Wire all event subscriptions. Returns an `unsubscribe` for tests; in prod
 * the engine lives for the page lifetime. Subscribers are individually
 * wrapped in try/catch so a throwing predicate chain never takes down the
 * bus for unrelated listeners.
 */
export function wireTitleEngine(): () => void {
  const offs: Array<() => void> = [];
  for (const type of WATCHED_TYPES) {
    offs.push(
      gameBus.on(type, () => {
        try {
          handleEvent(type);
        } catch (err) {
          console.error('[titleEngine] handler for', type, 'threw', err);
        }
      }),
    );
  }
  return () => {
    for (const off of offs) off();
  };
}

/** Read-only snapshot of the current titles state. */
export function snapshotTitles(): TitlesState {
  return titlesStore.get();
}

/**
 * Equip a title. Validates that the title id is unlocked (or null to clear
 * the active slot). Returns true on success, false on rejection. No-ops if
 * the id is already active.
 */
export function setActiveTitle(id: TitleId | null): boolean {
  const state = titlesStore.get();
  if (id === null) {
    if (state.activeTitle === null) return true;
    titlesStore.set({ ...state, activeTitle: null });
    return true;
  }
  // Reject unknown ids defensively even if somehow unlocked.
  const def: TitleDef | undefined = TITLE_DEFS.find((d) => d.id === id);
  if (!def) return false;
  if (!state.unlocked.includes(id)) return false;
  if (state.activeTitle === id) return true;
  titlesStore.set({ ...state, activeTitle: id });
  return true;
}
