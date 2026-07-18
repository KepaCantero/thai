// Spike 3: kanya OS voice backend.
//
// Uses Web Speech API (speechSynthesis) with the OS-installed Thai voice
// ("kanya" on macOS). Returns false when no Thai voice is installed so the
// gateway can fall through to google.

import type { AudioBackend } from './types';

export interface KanyaBackendOptions {
  speechSynthesis?: SpeechSynthesis;
  getVoices?: () => SpeechSynthesisVoice[];
  createUtterance?: (text: string) => SpeechSynthesisUtterance;
  /** Voice selection predicate; defaults to "first voice named 'kanya'". */
  pickVoice?: (voices: SpeechSynthesisVoice[]) => SpeechSynthesisVoice | null;
  /** Rate passed to the utterance; defaults to 0.85 (matches legacy). */
  rate?: number;
}

export function createKanyaBackend(opts: KanyaBackendOptions = {}): AudioBackend {
  const synth = opts.speechSynthesis ?? (typeof window !== 'undefined' ? window.speechSynthesis : undefined);
  const getVoices = opts.getVoices ?? (() => (synth ? synth.getVoices() : []));
  const createUtterance = opts.createUtterance ?? ((text) => new SpeechSynthesisUtterance(text));
  const rate = opts.rate ?? 0.85;

  const pickVoice = opts.pickVoice ?? ((voices) => {
    if (!voices || !voices.length) return null;
    for (const v of voices) {
      if ((v.name || '').toLowerCase().indexOf('kanya') !== -1) return v;
    }
    for (const v of voices) {
      if ((v.lang || '').toLowerCase().indexOf('th') === 0) return v;
    }
    return null;
  });

  let cachedVoice: SpeechSynthesisVoice | null | undefined;

  function resolveVoice(): SpeechSynthesisVoice | null {
    if (cachedVoice !== undefined) return cachedVoice;
    cachedVoice = pickVoice(getVoices());
    if (!cachedVoice) {
      console.warn('[audio/kanya] no Thai voice found in', getVoices().length, 'voices');
    }
    return cachedVoice;
  }

  // The browser fires onvoiceschanged asynchronously. Pre-attach so the
  // cache populates as soon as the OS reports voices.
  if (synth && (synth as any).onvoiceschanged !== undefined) {
    (synth as any).onvoiceschanged = () => { cachedVoice = pickVoice(getVoices()); };
  }

  return {
    speak(text, onDone) {
      const done = onDone ?? (() => {});
      const voice = resolveVoice();
      if (!voice) return false;
      const u = createUtterance(text);
      u.voice = voice;
      u.lang = voice.lang || 'th-TH';
      u.rate = rate;
      u.onend = () => done();
      u.onerror = (e) => { console.error('[audio/kanya] error', e); done(); };
      synth!.cancel();
      try { synth!.speak(u); } catch (e) { console.error(e); return false; }
      return true;
    },
    stop() {
      try { synth?.cancel(); } catch {}
    },
  };
}
