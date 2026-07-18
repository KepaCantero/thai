// Spike 3: static mp3 backend.
//
// Plays pre-generated audio files indexed by AUDIO_MANIFEST (key = Thai text,
// value = file id under /audio/<id>.mp3). Same greedy longest-match
// segmentation as the legacy implementation: if the full text isn't a manifest
// key, split it into known sub-keys and play them as a sequence.

import type { AudioManifest } from '../types';
import type { AudioBackend } from './types';

export interface StaticBackendOptions {
  /** Lazy accessor for the manifest; defaults to window.AUDIO_MANIFEST. */
  manifest?: () => AudioManifest | undefined;
  /** Builds the audio URL for a manifest id; defaults to `audio/<id>.mp3`. */
  urlFor?: (id: string) => string;
  /** Audio element factory; defaults to `new Audio()`. Mockable in tests. */
  createAudio?: () => HTMLAudioElement;
}

export function createStaticBackend(opts: StaticBackendOptions = {}): AudioBackend {
  const getManifest = opts.manifest ?? (() => (typeof window !== 'undefined' ? (window as any).AUDIO_MANIFEST : undefined));
  const urlFor = opts.urlFor ?? ((id) => `audio/${id}.mp3`);
  const createAudio = opts.createAudio ?? (() => new Audio());

  let current: HTMLAudioElement | null = null;

  // Cached manifest key set + max key length (rebuilt when manifest identity
  // changes — cheap because the manifest is a single object loaded once).
  let cachedManifest: AudioManifest | undefined;
  let keySet: Set<string> = new Set();
  let maxLen = 0;

  function refreshCache(): void {
    const m = getManifest();
    if (m === cachedManifest) return;
    cachedManifest = m;
    keySet = new Set();
    maxLen = 0;
    if (m) {
      for (const k of Object.keys(m)) {
        keySet.add(k);
        if (k.length > maxLen) maxLen = k.length;
      }
    }
  }

  /** Greedy longest-match segmentation. Returns null on any unmapped chunk. */
  function segment(text: string): string[] | null {
    refreshCache();
    if (!keySet.size) return null;
    const out: string[] = [];
    let pos = 0;
    while (pos < text.length) {
      if (/\s/.test(text[pos])) { pos++; continue; }
      const remaining = text.length - pos;
      let matched: string | null = null;
      for (let len = Math.min(maxLen, remaining); len >= 1; len--) {
        const sub = text.substr(pos, len);
        if (keySet.has(sub)) { matched = sub; break; }
      }
      if (!matched) return null;
      out.push(matched);
      pos += matched.length;
    }
    return out;
  }

  function playSingle(text: string, onDone: () => void): boolean {
    const m = getManifest();
    if (!m) return false;
    const id = m[text];
    if (!id) return false;
    const audio = createAudio();
    audio.src = urlFor(id);
    current = audio;
    audio.oncanplaythrough = () => { audio.play(); };
    audio.onended = () => { if (current === audio) current = null; onDone(); };
    audio.onerror = () => {
      console.error('[audio/static] error', id);
      if (current === audio) current = null;
      onDone();
    };
    audio.load();
    return true;
  }

  function playSequence(texts: string[], onDone: () => void): boolean {
    let i = 0;
    const next = () => {
      if (i >= texts.length) { onDone(); return; }
      const t = texts[i++];
      if (!playSingle(t, next)) {
        console.warn('[audio/static] miss in sequence:', t);
        next();
      }
    };
    next();
    return true;
  }

  return {
    speak(text, onDone) {
      const done = onDone ?? (() => {});
      const m = getManifest();
      if (!m) return false;

      // Compound strings from getAudioText: "q_thai ... a_thai"
      const parts = text.split(' ... ');
      if (parts.length > 1) {
        return playSequence(parts, done);
      }
      if (m[text]) {
        return playSingle(text, done);
      }
      const segs = segment(text);
      if (segs && segs.length > 0) {
        console.log('[audio/static] segmented:', text, '→', segs);
        return playSequence(segs, done);
      }
      console.warn('[audio/static] no entry for', JSON.stringify(text));
      return false;
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
