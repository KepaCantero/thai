// Phase 2: externalize the user's per-card scoring state.
//
// app.js declares `var known = new Set(), unknown = new Set()` and
// `var difficult = new Set()`. known/unknown are session-only (cleared on
// reload); difficult is persisted via localStorage key `thai_difficult` and
// is already wrapped by difficultStore in src/core/persistence/stores.ts.
//
// We hold known/unknown in module-level Sets and delegate difficult to the
// existing store. The bridge mirrors all three onto window so legacy code
// that does `known.add(key)` and typed code that does `markKnown(key)` agree.

import { difficultStore } from '../persistence/stores';

const known = new Set<string>();
const unknown = new Set<string>();

// --- known / unknown (session-only) ---------------------------------------

export function markKnown(key: string): void {
  known.add(key);
  unknown.delete(key);
}

export function markUnknown(key: string): void {
  unknown.add(key);
  known.delete(key);
}

export function isKnown(key: string): boolean {
  return known.has(key);
}

export function isUnknown(key: string): boolean {
  return unknown.has(key);
}

export function clearKnown(): void {
  known.clear();
  unknown.clear();
}

export function getKnownSize(): number {
  return known.size;
}

export function getUnknownSize(): number {
  return unknown.size;
}

// Internal: used by the bridge to seed the Sets from existing window values
// at install time (e.g. after a hot reload). Not part of the public API.
export function _seedKnown(k: Iterable<string>): void {
  for (const x of k) known.add(x);
}
export function _seedUnknown(u: Iterable<string>): void {
  for (const x of u) unknown.add(x);
}

// --- difficult (persisted via difficultStore) -----------------------------

export function isDifficult(key: string): boolean {
  return difficultStore.get().includes(key);
}

export function toggleDifficult(key: string): string[] {
  const cur = difficultStore.get();
  const next = cur.includes(key)
    ? cur.filter((k) => k !== key)
    : [...cur, key];
  difficultStore.set(next);
  return next;
}

export function getDifficultSize(): number {
  return difficultStore.get().length;
}
