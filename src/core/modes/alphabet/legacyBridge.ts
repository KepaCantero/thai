// Spike 5b: bridge for the alphabet mode. Same pattern as tones — construct
// the module with adapters for legacy globals and override window.* so the
// inline onclick handlers and setMode('alphabet') call path reach the typed
// implementation.

import { createAlphaModule } from './module';
import type { AlphaModule, AlphaConsonant, AlphaMnMode } from './module';

export interface AlphaLegacyConsonant {
  i: number;
  thai: string;
  cls: 'high' | 'mid' | 'low' | string;
  sound: string;
  soundLike: string;
  word: { thai: string; en: string };
  emoji?: string;
  obsolete?: boolean;
  mnemonic?: Partial<Record<AlphaMnMode, string>>;
}

export function wireLegacyAlphabet(): AlphaModule {
  const w = window as unknown as Record<string, any>;

  const mod = createAlphaModule({
    getConsonants: () => (w.ALPHABET_CONSONANTS ?? []) as AlphaConsonant[],
    getModes: () => (w.ALPHA_MN_MODES ?? [
      { id: 'visual', label: 'Visual' },
      { id: 'full', label: 'Completo' },
      { id: 'story', label: 'Historia' },
    ]) as { id: AlphaMnMode; label: string }[],
    getStore: () => ({
      getItem: (k: string) => {
        try { return window.localStorage.getItem(k); } catch { return null; }
      },
      setItem: (k: string, v: string) => {
        try { window.localStorage.setItem(k, v); } catch {}
      },
    }),
    setHostHtml: (html: string) => {
      const el = document.getElementById('alphabetView');
      if (el) el.innerHTML = html;
    },
  });

  w.renderAlphabetView = mod.renderView;
  w.renderAlphabet = mod.render;
  w.setAlphaMode = mod.setMode;
  // alphaMnMode is read by other code paths (none outside alphabet-ui per
  // audit) — mirror it via a property for compatibility.
  Object.defineProperty(w, 'alphaMnMode', {
    get: () => mod.getMode(),
    set: () => { /* no-op: setAlphaMode is the canonical entry point */ },
    configurable: true,
  });

  return mod;
}
