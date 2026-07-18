// Spike 3: AudioGateway interfaces.
//
// The legacy public/audio.js hardcodes three playback strategies (static mp3,
// kanya OS voice, google translate TTS) plus the engine selection logic plus
// the localStorage persistence. This module separates "how each engine plays
// audio" (AudioBackend) from "which engine is selected and what happens on a
// miss" (AudioGateway).
//
// The legacy file keeps its global speakText/stopCurrentAudio/setTtsEngine
// surface until the modes that call them are extracted (Spike 5+). New code
// imports from here instead.

/** Selector for one of the three playback strategies. */
export type AudioEngine = 'static' | 'kanya' | 'google';

/**
 * A single playback strategy. Returns true if it accepted the text and started
 * (or queued) playback. Returns false if it cannot handle the text — the
 * gateway uses this to fall through to another engine (e.g. static miss →
 * google). When speak() returns false it MUST NOT call onDone.
 */
export interface AudioBackend {
  speak(text: string, onDone?: () => void): boolean;
  /** Stop any in-flight playback owned by this backend. Idempotent. */
  stop(): void;
}

/** High-level entry point used by UI code. */
export interface AudioGateway {
  speak(text: string, onDone?: () => void): void;
  stop(): void;
  setEngine(engine: AudioEngine): void;
  getEngine(): AudioEngine;
  /** Subscribe to engine changes. Returns an unsubscribe function. */
  onEngineChange(cb: (engine: AudioEngine) => void): () => void;
}

const VALID_ENGINES: readonly AudioEngine[] = ['static', 'kanya', 'google'];

export function isValidEngine(value: string | null | undefined): value is AudioEngine {
  return !!value && (VALID_ENGINES as readonly string[]).indexOf(value) !== -1;
}
