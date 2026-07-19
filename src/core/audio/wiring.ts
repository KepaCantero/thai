// Spike 6: high-level audio wiring.
//
// Wraps createAudioGateway() with the adapter surface that the rest of the
// app consumes (speakText, stopCurrentAudio, playAudioItem, getAudioText,
// setTtsEngine). This module is the single source of truth for which engine
// is the default ('static') and how the manifest is discovered
// (window.AUDIO_MANIFEST, installed by loader.ts from data/audio-manifest.json).
//
// The gateway itself owns engine state + dispatch + fallback. This module
// only adds:
//   - item-aware playback (playAudioItem) via getAudioText
//   - a setTtsEngine adapter that also mirrors the current engine onto
//     window.AUDIO_ENGINE for legacy readers (e.g. the app.js dropdown sync)
//   - a noop-safe stop() (gateway already tolerates empty state)

import { createAudioGateway } from './gateway';
import type { AudioGatewayOptions } from './gateway';
import type { AudioEngine, AudioGateway } from './types';
import { getAudioText } from './item';
import type { AudioItem } from './item';

export interface AudioWiring {
  readonly gateway: AudioGateway;
  speakText: (text: string, onDone?: () => void) => void;
  stopCurrentAudio: () => void;
  playAudioItem: (item: AudioItem, onDone?: () => void) => void;
  getAudioText: (item: AudioItem) => string;
  setTtsEngine: (engine: AudioEngine) => void;
}

/**
 * Build the audio wiring. The static backend is the default engine, matching
 * the legacy public/audio.js behaviour (AUDIO_ENGINE = 'static' after the
 * one-time migration baked into createAudioGateway).
 */
export function createAudioWiring(opts: AudioGatewayOptions = {}): AudioWiring {
  const gateway = createAudioGateway(opts);

  const speakText = (text: string, onDone?: () => void): void => {
    gateway.speak(text, onDone ?? (() => {}));
  };

  const stopCurrentAudio = (): void => {
    gateway.stop();
  };

  const playAudioItem = (item: AudioItem, onDone?: () => void): void => {
    stopCurrentAudio();
    const text = getAudioText(item);
    speakText(text, onDone);
  };

  const setTtsEngine = (engine: AudioEngine): void => {
    gateway.setEngine(engine);
    // Mirror onto window.AUDIO_ENGINE for legacy readers (public/app.js
    // syncs the #ttsSelect dropdown to this value on DOMContentLoaded).
    if (typeof window !== 'undefined') {
      (window as unknown as { AUDIO_ENGINE: AudioEngine }).AUDIO_ENGINE = engine;
    }
    // Keep the dropdown in sync, mirroring audio.js:setTtsEngine.
    if (typeof document !== 'undefined') {
      const sel = document.getElementById('ttsSelect') as HTMLSelectElement | null;
      if (sel) sel.value = engine;
    }
  };

  return {
    gateway,
    speakText,
    stopCurrentAudio,
    playAudioItem,
    getAudioText,
    setTtsEngine,
  };
}
