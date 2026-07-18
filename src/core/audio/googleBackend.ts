// Spike 3: google translate TTS backend.
//
// Streams audio from translate.google.com/translate_tts. Always returns true
// (best-effort) — network errors surface via onDone so callers don't hang.

import type { AudioBackend } from './types';

export interface GoogleBackendOptions {
  /** Builds the TTS URL for a given text. */
  urlFor?: (text: string) => string;
  /** Audio element factory; defaults to `new Audio()`. */
  createAudio?: () => HTMLAudioElement;
}

export function createGoogleBackend(opts: GoogleBackendOptions = {}): AudioBackend {
  const urlFor = opts.urlFor ?? ((text) =>
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(text)}`
  );
  const createAudio = opts.createAudio ?? (() => new Audio());

  let current: HTMLAudioElement | null = null;

  return {
    speak(text, onDone) {
      const done = onDone ?? (() => {});
      const audio = createAudio();
      audio.src = urlFor(text);
      current = audio;
      audio.oncanplaythrough = () => { audio.play(); };
      audio.onended = () => { if (current === audio) current = null; done(); };
      audio.onerror = () => { if (current === audio) current = null; done(); };
      audio.load();
      return true;
    },
    stop() {
      if (current) {
        try { current.pause(); } catch {}
        current.onended = null;
        current.onerror = null;
        current = null;
      }
    },
  };
}
