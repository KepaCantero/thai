// Phase 2: externalize the playback loop state.
//
// app.js declares `var running = false, paused = false, playTimeout = null,
// playResumeFn = null`. All four become window.* globals; the bridge mirrors
// them so legacy clearTimeout(playTimeout) and typed setPlayTimeout share the
// same slot.

let running = false;
let paused = false;
let playTimeout: number | null = null;
let playResumeFn: (() => void) | null = null;

export function isRunning(): boolean {
  return running;
}

export function setRunning(v: boolean): void {
  running = v;
}

export function isPaused(): boolean {
  return paused;
}

export function setPaused(v: boolean): void {
  paused = v;
}

export function getPlayTimeout(): number | null {
  return playTimeout;
}

export function setPlayTimeout(id: number | null): void {
  playTimeout = id;
}

export function getPlayResumeFn(): (() => void) | null {
  return playResumeFn;
}

export function setPlayResumeFn(fn: (() => void) | null): void {
  playResumeFn = fn;
}
