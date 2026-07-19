// Solo Leveling Phase 6: Web Audio synthesis for UI SFX.
//
// Synthesizes short UI sounds at runtime via the Web Audio API so we don't
// have to ship .mp3 files. Lazy-creates an AudioContext on the first playSfx
// call (browser autoplay policies require a user gesture before audio works;
// we attempt to resume a suspended context defensively).
//
// All public entry points are wrapped in try/catch — audio is a "nice to
// have" and must never break the rest of the page. SSR / non-browser envs
// (vitest's default `node` env) are handled by feature-detecting the API.

import { sfxEnabledStore } from '../persistence/stores';

export type SfxName =
  | 'level-up'
  | 'rank-up'
  | 'quest-complete'
  | 'all-clear'
  | 'title-unlock'
  | 'tick'
  | 'penalty';

// Module-level singleton. Created lazily so we don't pay the cost (or trip
// autoplay restrictions) until the first user-triggered SFX.
let ctx: AudioContext | null = null;
let cachedEnabled: boolean | null = null;

function isEnabled(): boolean {
  if (cachedEnabled === null) {
    try {
      cachedEnabled = sfxEnabledStore.get();
    } catch {
      cachedEnabled = true;
    }
  }
  return cachedEnabled !== false; // default true on read failure
}

export function isSfxEnabled(): boolean {
  try {
    return isEnabled();
  } catch {
    return true;
  }
}

export function setSfxEnabled(on: boolean): void {
  cachedEnabled = !!on;
  try {
    sfxEnabledStore.set(!!on);
  } catch {
    /* ignore persistence failures */
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!ctx) ctx = new Ctor();
    // Some browsers start the context in 'suspended' state until a user
    // gesture. resume() is a no-op if already running.
    if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOpts {
  freq: number;
  start: number; // seconds relative to "now"
  duration: number;
  type: OscillatorType;
  gain: number;
  freqEnd?: number; // optional sweep target
}

function tone(c: AudioContext, opts: ToneOpts): void {
  const t0 = c.currentTime + opts.start;
  const t1 = t0 + opts.duration;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.freq, t0);
  if (opts.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, opts.freqEnd),
      t1,
    );
  }
  // Gain envelope: quick attack, exponential decay to avoid clicks.
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, opts.gain), t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t1);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t1 + 0.02);
}

function synthLevelUp(c: AudioContext): void {
  // C-E-G-C major arpeggio over 0.6s.
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const step = 0.15;
  notes.forEach((f, i) => {
    tone(c, { freq: f, start: i * step, duration: 0.18, type: 'sine', gain: 0.18 });
    tone(c, { freq: f, start: i * step, duration: 0.18, type: 'triangle', gain: 0.06 });
  });
}

function synthRankUp(c: AudioContext): void {
  // Two arpeggios + final sustained chord. 1.2s, brighter sawtooth timbre.
  const arp1 = [523.25, 659.25, 783.99];
  const arp2 = [1046.5, 1318.5, 1567.98];
  arp1.forEach((f, i) => {
    tone(c, { freq: f, start: i * 0.1, duration: 0.14, type: 'sawtooth', gain: 0.1 });
  });
  arp2.forEach((f, i) => {
    tone(c, { freq: f, start: 0.35 + i * 0.1, duration: 0.14, type: 'sawtooth', gain: 0.1 });
  });
  // Final chord (C-E-G up an octave), sustained.
  [1046.5, 1318.5, 1567.98].forEach((f) => {
    tone(c, { freq: f, start: 0.7, duration: 0.5, type: 'sawtooth', gain: 0.08 });
  });
}

function synthQuestComplete(c: AudioContext): void {
  tone(c, { freq: 880, freqEnd: 1320, start: 0, duration: 0.2, type: 'sine', gain: 0.18 });
}

function synthAllClear(c: AudioContext): void {
  // C-E-G-C triumphant 4-note sequence, 0.8s.
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    tone(c, { freq: f, start: i * 0.18, duration: 0.22, type: 'triangle', gain: 0.16 });
  });
}

function synthTitleUnlock(c: AudioContext): void {
  // 660Hz + 990Hz harmonic (perfect fifth) chime, 0.4s.
  tone(c, { freq: 660, start: 0, duration: 0.4, type: 'sine', gain: 0.16 });
  tone(c, { freq: 990, start: 0, duration: 0.4, type: 'sine', gain: 0.1 });
}

function synthTick(c: AudioContext): void {
  tone(c, { freq: 1000, start: 0, duration: 0.04, type: 'square', gain: 0.05 });
}

function synthPenalty(c: AudioContext): void {
  // Dissonant low buzz: 220Hz + 233Hz (a half-step apart), 0.5s, square.
  tone(c, { freq: 220, start: 0, duration: 0.5, type: 'square', gain: 0.12 });
  tone(c, { freq: 233, start: 0, duration: 0.5, type: 'square', gain: 0.12 });
}

const SYNTHS: Record<SfxName, (c: AudioContext) => void> = {
  'level-up': synthLevelUp,
  'rank-up': synthRankUp,
  'quest-complete': synthQuestComplete,
  'all-clear': synthAllClear,
  'title-unlock': synthTitleUnlock,
  tick: synthTick,
  penalty: synthPenalty,
};

export function playSfx(name: SfxName): void {
  try {
    if (!isEnabled()) return;
    const c = getCtx();
    if (!c) return;
    const fn = SYNTHS[name];
    if (!fn) return;
    fn(c);
  } catch {
    /* never let audio break the page */
  }
}

/** Test-only: reset module state between cases. */
export function __resetSfxForTests(): void {
  ctx = null;
  cachedEnabled = null;
}
