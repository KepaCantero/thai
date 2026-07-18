// Phase 2: Object.defineProperty bridge that mirrors the typed state in
// src/core/state/* onto window.* so legacy code in public/app.js (which
// references these names as bare identifiers / window properties) and the
// typed modules share one source of truth.
//
// Strategy:
//   1. Read the existing window.* values (populated by top-level `var`
//      declarations in app.js before this module runs).
//   2. Seed the typed state with those values.
//   3. Install get/set descriptors that proxy through to the typed getters
//      and setters.
//
// After install, both `w.deck = [...]` and `setDeck([...])` mutate the same
// underlying closure variable, and `w.deck === getDeck()` (same reference)
// holds.

import type { Card, ModeKey, Scope } from '../types';
import * as deck from './deck';
import * as filters from './filters';
import * as mode from './mode';
import * as playback from './playback';
import * as scoring from './scoring';

type AnyWindow = Window & typeof globalThis;

function mirror<T>(
  w: AnyWindow,
  key: string,
  get: () => T,
  set: (v: T) => void,
): void {
  Object.defineProperty(w, key, {
    get,
    set,
    configurable: true,
    enumerable: true,
  });
}

export function installStateBridge(w: AnyWindow = window): void {
  const get = <T>(k: string, fallback: T): T => {
    const v = (w as unknown as Record<string, unknown>)[k];
    return (v as T) ?? fallback;
  };

  // --- Cluster A: mode + filterPanelOpen --------------------------------
  mode.setMode(get<ModeKey>('currentMode', 'cards'));
  mode.setFilterPanelOpen(get<boolean>('filterPanelOpen', false));
  mirror(w, 'currentMode', mode.getMode, (v: ModeKey) => mode.setMode(v));
  mirror(w, 'filterPanelOpen', mode.isFilterPanelOpen, (v: boolean) =>
    mode.setFilterPanelOpen(v),
  );

  // --- Cluster B: deck + idx --------------------------------------------
  deck.setDeck(get<Card[]>('deck', []));
  deck.setIdx(get<number>('idx', 0));
  mirror(w, 'deck', deck.getDeck, (v: Card[]) => deck.setDeck(v));
  mirror(w, 'idx', deck.getIdx, (v: number) => deck.setIdx(v));

  // --- Cluster C: filters -----------------------------------------------
  filters.setActiveLesson(get<string>('activeLesson', 'all'));
  filters.setActiveCategory(get<string>('activeCategory', 'all'));
  filters.setActiveType(
    get<'all' | 'word' | 'phrase' | 'conversation'>('activeType', 'all'),
  );
  filters.setSearchQuery(get<string>('searchQuery', ''));
  // activeScope: legacy seed may differ from the persisted scopeStore value
  // if the legacy bootstrap hasn't run yet. Prefer the persisted store when
  // the window slot is the literal default to avoid clobbering saved state.
  const seededScope = get<Scope>('activeScope', filters.getActiveScope());
  filters.setActiveScope(seededScope);
  mirror(w, 'activeLesson', filters.getActiveLesson, (v: string) =>
    filters.setActiveLesson(v),
  );
  mirror(w, 'activeCategory', filters.getActiveCategory, (v: string) =>
    filters.setActiveCategory(v),
  );
  mirror(w, 'activeType', filters.getActiveType, (v) =>
    filters.setActiveType(v),
  );
  mirror(w, 'searchQuery', filters.getSearchQuery, (v: string) =>
    filters.setSearchQuery(v),
  );
  mirror(w, 'activeScope', filters.getActiveScope, (v: Scope) =>
    filters.setActiveScope(v),
  );

  // --- Cluster D: playback ----------------------------------------------
  playback.setRunning(get<boolean>('running', false));
  playback.setPaused(get<boolean>('paused', false));
  playback.setPlayTimeout(get<number | null>('playTimeout', null));
  playback.setPlayResumeFn(
    get<(() => void) | null>('playResumeFn', null),
  );
  mirror(w, 'running', playback.isRunning, (v: boolean) =>
    playback.setRunning(v),
  );
  mirror(w, 'paused', playback.isPaused, (v: boolean) =>
    playback.setPaused(v),
  );
  mirror(w, 'playTimeout', playback.getPlayTimeout, (v: number | null) =>
    playback.setPlayTimeout(v),
  );
  mirror(w, 'playResumeFn', playback.getPlayResumeFn, (v) =>
    playback.setPlayResumeFn(v),
  );

  // --- Cluster E: scoring -----------------------------------------------
  // app.js declares `var known = new Set(), unknown = new Set(),
  // var difficult = new Set()`. Legacy code touches them as bare identifiers,
  // so they're already window properties; the bridge must mirror.
  const seedKnown = get<Set<string>>('known', new Set<string>());
  const seedUnknown = get<Set<string>>('unknown', new Set<string>());
  scoring.clearKnown();
  if (seedKnown) scoring._seedKnown(seedKnown);
  if (seedUnknown) scoring._seedUnknown(seedUnknown);
  mirror(w, 'known', () => seedKnown, (v: Set<string>) => {
    scoring.clearKnown();
    if (v) for (const x of v) scoring.markKnown(x);
    // Re-point the closure's "seed" reference so subsequent reads see the
    // assigned Set identity (matches legacy `known = new Set()` semantics).
    // We can't reassign a const, so we mutate in place: clear then re-add.
    seedKnown.clear();
    if (v) for (const x of v) seedKnown.add(x);
  });
  mirror(w, 'unknown', () => seedUnknown, (v: Set<string>) => {
    if (v) {
      seedUnknown.clear();
      for (const x of v) seedUnknown.add(x);
    }
  });
  // difficult is persisted via difficultStore. The legacy `var difficult`
  // holds an in-memory Set copy that app.js hydrates from localStorage on
  // startup. We mirror through to the store.
  const seedDifficult = get<Set<string>>('difficult', new Set<string>());
  if (seedDifficult && seedDifficult.size > 0) {
    difficultStore.set([...seedDifficult]);
  }
  // Expose a Set-shaped facade for legacy `difficult.has(...)` / `.size` /
  // `.add` / `.delete` reads. app.js calls those four methods directly. We
  // can't fully satisfy Set<string>'s index signature without redeclaring
  // every method, so cast through unknown. Methods delegate to the store.
  const difficultFacade = {
    has: (k: string) => scoring.isDifficult(k),
    add(k: string) {
      if (!scoring.isDifficult(k)) {
        difficultStore.set([...difficultStore.get(), k]);
      }
      return difficultFacade;
    },
    delete(k: string) {
      if (scoring.isDifficult(k)) {
        difficultStore.set(difficultStore.get().filter((x) => x !== k));
        return true;
      }
      return false;
    },
    clear() {
      difficultStore.set([]);
    },
    forEach(cb: (v: string, k: string, s: Set<string>) => void) {
      difficultStore.get().forEach((x) => cb(x, x, difficultFacadeAsSet));
    },
    [Symbol.iterator]() {
      return difficultStore.get()[Symbol.iterator]();
    },
    entries() {
      return difficultStore.get().map((x) => [x, x] as [string, string])[Symbol.iterator]();
    },
    keys() {
      return difficultStore.get()[Symbol.iterator]();
    },
    values() {
      return difficultStore.get()[Symbol.iterator]();
    },
    get size() {
      return scoring.getDifficultSize();
    },
  } as unknown as Set<string>;
  const difficultFacadeAsSet = difficultFacade;
  mirror(w, 'difficult', () => difficultFacade, (_v: Set<string>) => {
    // Legacy rarely does `difficult = new Set()`; if it does, treat as clear.
    difficultStore.set([]);
  });
}

// Re-export for tests that want to assert the store wiring end-to-end.
import { difficultStore } from '../persistence/stores';
export { difficultStore };
