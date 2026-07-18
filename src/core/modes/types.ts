// Spike 4: Mode contract.
//
// Legacy setMode (public/app.js:843) is a 77-line switch that does, for every
// mode: stop active playback → toggle body class → show/hide 9 section divs →
// build mode tabs → call a mode-specific render function. This interface
// splits that into one Mode per mode, orchestrated by a Router.
//
// A Mode owns its host element completely: mount() shows it, unmount() hides
// it. The router does not touch the DOM — it only sequences the calls.
//
// Migration strategy: Spike 5+ extracts modes one at a time (tones first
// because it's the simplest). Until all modes are registered, the legacy
// setMode keeps running for the un-migrated ones.

import type { ModeKey, Scope } from '../types';

/** Services the host element needs from the app shell. */
export interface ModeContext {
  /** Top progress bar updater (e.g. "Tones", "12 cards"). */
  setProgress(text: string): void;
  /** Current content scope. Modes that depend on data source read this. */
  scope: Scope;
}

/**
 * A user-facing app mode. Each mode owns one host element in the DOM.
 * Lifecycle: register() once at startup → switchTo() calls mount/unmount
 * as the user navigates.
 */
export interface Mode {
  key: ModeKey;
  /** Called when this mode becomes active. Show host, render initial state. */
  mount(ctx: ModeContext): void;
  /** Called when this mode is being left. Stop playback, hide host. */
  unmount(): void;
  /** Called when the global scope changes while this mode is active. */
  onScopeChange?(scope: Scope): void;
}

/**
 * Mode orchestrator. Strict: switchTo to an unregistered key unmounts the
 * current mode but mounts nothing. Callers are responsible for falling back
 * to legacy behavior if needed.
 */
export interface Router {
  register(mode: Mode): void;
  has(key: ModeKey): boolean;
  switchTo(key: ModeKey, ctx: ModeContext): void;
  /** Notify the active mode (if any) that scope changed. No-op otherwise. */
  notifyScopeChange(scope: Scope): void;
  /** Current mode key, or null if none is mounted. */
  current(): ModeKey | null;
}
