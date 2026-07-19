// Solo Leveling Phase 1: typed event bus.
//
// Decouples mode-level actions (SRS review, mark known, lesson complete, ...)
// from the XP/stats engine. Modes emit; the engine subscribes. Adding a new
// XP source is a one-line emit + a one-line subscriber — no mode knows about
// player state, and the engine doesn't know how modes render.

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

// Outbound events emitted BY engines (playerEngine, questEngine, titleEngine),
// consumed BY renderers (notifications, level-up modal, status window).
// Kept in the same union so listeners can subscribe with full type safety.
export type LevelUpEvent = {
  type: 'level:up';
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  tier: number;
  levelsGained: number;
  rankUp: boolean; // crossed a rank boundary (E-10 → D-1)
};

export type TitleUnlockEvent = {
  type: 'title:unlock';
  titleId: string;
  // Optional: short label snapshot so listeners don't have to import the
  // catalogue to render a toast.
  label: string;
};

export type QuestCompleteEvent = {
  type: 'quest:complete';
  questId: string;
};

export type GameEvent =
  // Inbound (modes → engines)
  | { type: 'srs:review'; rating: SrsRating; deck: string }
  | { type: 'card:known'; entryId: string }
  | { type: 'card:unknown'; entryId: string }
  | { type: 'lesson:complete'; lesson: string }
  | { type: 'conv:play'; source: string; entryId: string }
  | { type: 'tone:correct' }
  | { type: 'tone:wrong' }
  | { type: 'shadow:rep'; level: string }
  | { type: 'mode:open'; mode: string }
  | { type: 'study:tick'; seconds: number }
  // Outbound (engines → renderers)
  | LevelUpEvent
  | TitleUnlockEvent
  | QuestCompleteEvent
  | { type: 'quest:allclear' };

export type GameEventType = GameEvent['type'];

type AnyListener = (event: GameEvent) => void;
type TypedListener<T extends GameEventType> = (
  event: Extract<GameEvent, { type: T }>
) => void;

class EventBus {
  private listeners = new Map<GameEventType, Set<AnyListener>>();

  on<T extends GameEventType>(type: T, fn: TypedListener<T>): () => void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(fn as AnyListener);
    this.listeners.set(type, set);
    return () => this.off(type, fn as AnyListener);
  }

  once<T extends GameEventType>(type: T, fn: TypedListener<T>): () => void {
    const wrapper: TypedListener<T> = (event) => {
      this.off(type, wrapper as AnyListener);
      fn(event);
    };
    return this.on(type, wrapper);
  }

  off(type: GameEventType, fn: AnyListener): void {
    const set = this.listeners.get(type);
    if (!set) return;
    set.delete(fn);
    if (set.size === 0) this.listeners.delete(type);
  }

  emit(event: GameEvent): void {
    const set = this.listeners.get(event.type);
    if (!set) return;
    // Snapshot so a listener can unsubscribe itself during emit without
    // skipping siblings (matches DOM EventTarget ordering).
    for (const fn of [...set]) {
      try {
        fn(event);
      } catch (err) {
        console.error('[events] listener for', event.type, 'threw', err);
      }
    }
  }

  /** Test helper — removes every subscription. Not called from prod code. */
  clear(): void {
    this.listeners.clear();
  }

  /** Test helper — for asserting no listeners leak across cases. */
  size(type?: GameEventType): number {
    if (type) return this.listeners.get(type)?.size ?? 0;
    let total = 0;
    for (const set of this.listeners.values()) total += set.size;
    return total;
  }
}

export const gameBus = new EventBus();
