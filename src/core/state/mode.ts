// Phase 2: externalize shared mutable navigation state from public/app.js.
//
// The legacy scripts declare `var currentMode = 'cards'` and
// `var filterPanelOpen = false` at the top level. They become properties on
// `window`. stateBridge installs Object.defineProperty descriptors that read
// and write through to the typed state held in this module's closure, so any
// legacy caller of `currentMode = 'foo'` and any typed caller of setMode()
// share the same source of truth.
//
// Derived booleans (dashboardMode, shadowingMode, ...) stay in app.js as
// plain `var`; they're written by the legacy setMode() body and are not
// externalized here.

import type { ModeKey } from '../types';

let currentMode: ModeKey = 'cards';
let filterPanelOpen = false;

export function getMode(): ModeKey {
  return currentMode;
}

export function setMode(m: ModeKey): void {
  currentMode = m;
}

export function isMode(m: ModeKey): boolean {
  return currentMode === m;
}

export function isFilterPanelOpen(): boolean {
  return filterPanelOpen;
}

export function setFilterPanelOpen(v: boolean): void {
  filterPanelOpen = v;
}

export function toggleFilterPanel(): boolean {
  filterPanelOpen = !filterPanelOpen;
  return filterPanelOpen;
}
