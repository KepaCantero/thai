// Spike 6: legacy audio bridge.
//
// Installs the typed audio wiring onto window.* so the un-migrated bridges
// (cards, questions, shadowing, srs, dashboard, top1000, matrix, tones,
// alphabet) and the still-legacy public/app.js can keep calling
// window.speakText / window.stopCurrentAudio / etc. without noticing that
// public/audio.js has been deleted.
//
// Must be wired BEFORE the mode bridges — audio is a leaf dependency for
// cards/questions/etc.

import { createAudioWiring } from './wiring';
import type { AudioWiring } from './wiring';

declare global {
  interface Window {
    speakText?: (text: string, onDone?: () => void) => void;
    stopCurrentAudio?: () => void;
    playAudioItem?: (item: unknown, onDone?: () => void) => void;
    getAudioText?: (item: unknown) => string;
    setTtsEngine?: (engine: string) => void;
    AUDIO_ENGINE?: string;
    listTtsVoices?: () => unknown;
    // Injected by wireLegacyAudio for tests / introspection.
    __audioWiring?: AudioWiring;
  }
}

/**
 * Install the typed audio gateway as the global audio surface.
 *
 * Idempotent — if called twice, reuses the existing wiring so tests don't
 * accumulate listeners on a fresh gateway.
 */
export function wireLegacyAudio(): AudioWiring {
  if (typeof window === 'undefined') {
    throw new Error('[audio] wireLegacyAudio requires a window');
  }

  // Reuse existing wiring on re-entry (defensive — main.ts only calls once).
  if (window.__audioWiring) return window.__audioWiring;

  const wiring = createAudioWiring();
  window.__audioWiring = wiring;

  window.speakText = wiring.speakText;
  window.stopCurrentAudio = wiring.stopCurrentAudio;
  window.playAudioItem = (item, onDone) =>
    wiring.playAudioItem(item as Parameters<typeof wiring.playAudioItem>[0], onDone);
  window.getAudioText = (item) =>
    wiring.getAudioText(item as Parameters<typeof wiring.getAudioText>[0]);
  window.setTtsEngine = (engine) => wiring.setTtsEngine(engine as Parameters<typeof wiring.setTtsEngine>[0]);
  window.AUDIO_ENGINE = wiring.gateway.getEngine();

  // Debug helper preserved from public/audio.js — exposes the OS voice list
  // for troubleshooting. Reads window.speechSynthesis directly so the helper
  // still works even if the kanya backend hasn't been touched yet.
  window.listTtsVoices = () => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (!synth) return [];
    const voices = synth.getVoices();
    const thai = voices.filter((v) => (v.lang || '').toLowerCase().indexOf('th') === 0);
    // eslint-disable-next-line no-console
    console.table(voices.map((v) => ({ name: v.name, lang: v.lang, default: v.default })));
    // eslint-disable-next-line no-console
    console.log('Thai voices visible to browser:', thai.length);
    return thai;
  };

  return wiring;
}
