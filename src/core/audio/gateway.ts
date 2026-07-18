// Spike 3: AudioGateway — the high-level dispatch.
//
// Owns three concerns that were tangled together in public/audio.js:
//   1. Which engine is selected (state + localStorage persistence + migration).
//   2. What happens when an engine returns false (static miss → google; kanya
//      unavailable → google). Google never falls through.
//   3. Stopping all engines (callers don't know which is mid-playback).

import type { PersistenceAdapter } from '../persistence/repository';
import { localStorageAdapter } from '../persistence/repository';
import { createGoogleBackend } from './googleBackend';
import { createKanyaBackend } from './kanyaBackend';
import { createStaticBackend } from './staticBackend';
import type { AudioBackend, AudioEngine, AudioGateway } from './types';
import { isValidEngine } from './types';

export interface AudioGatewayOptions {
  storage?: PersistenceAdapter;
  backends?: Partial<Record<AudioEngine, AudioBackend>>;
  defaultEngine?: AudioEngine;
}

const STORAGE_KEY = 'ttsEngine';
const VERSION_KEY = 'ttsEngineVersion';
const VERSION_VALUE = '2';

export function createAudioGateway(opts: AudioGatewayOptions = {}): AudioGateway {
  const storage = opts.storage ?? localStorageAdapter;
  const backends: Record<AudioEngine, AudioBackend | undefined> = {
    static: opts.backends?.static ?? createStaticBackend(),
    kanya: opts.backends?.kanya ?? createKanyaBackend(),
    google: opts.backends?.google ?? createGoogleBackend(),
  };
  const defaultEngine: AudioEngine = opts.defaultEngine ?? 'static';

  // One-time migration: legacy default was 'kanya' which silently fails in
  // Chrome. Bump users to 'static' once; subsequent choices are respected.
  let engine: AudioEngine;
  if (storage.getItem(VERSION_KEY) !== VERSION_VALUE) {
    engine = 'static';
    storage.setItem(STORAGE_KEY, 'static');
    storage.setItem(VERSION_KEY, VERSION_VALUE);
  } else {
    const saved = storage.getItem(STORAGE_KEY);
    engine = isValidEngine(saved) ? saved : defaultEngine;
  }

  const listeners = new Set<(e: AudioEngine) => void>();

  function dispatch(current: AudioEngine, text: string, onDone: () => void): void {
    const backend = backends[current];
    if (backend && backend.speak(text, onDone)) return;
    // Fall through. Google is the terminal engine — never falls through itself.
    if (current !== 'google' && backends.google) {
      backends.google.speak(text, onDone);
      return;
    }
    // No fallback left.
    onDone();
  }

  return {
    speak(text, onDone) {
      dispatch(engine, text, onDone ?? (() => {}));
    },
    stop() {
      // We don't track which backend last played, so stop all. Each backend's
      // stop() is a no-op when nothing is in flight.
      for (const key of Object.keys(backends) as AudioEngine[]) {
        backends[key]?.stop();
      }
    },
    setEngine(next) {
      if (!isValidEngine(next) || next === engine) return;
      engine = next;
      storage.setItem(STORAGE_KEY, next);
      for (const cb of listeners) cb(next);
    },
    getEngine() {
      return engine;
    },
    onEngineChange(cb) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
  };
}
