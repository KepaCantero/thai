// Spike 5: bridge between the typed TonesModule and the legacy global-scope
// scripts. Runs on DOMContentLoaded (after data.js, config.js, audio.js,
// app.js have all executed). Constructs a TonesModule with adapters for the
// globals, then overrides the legacy window.* functions so setMode, the
// inline onclick handlers in renderTonesView, and any other caller all reach
// the typed implementation.
//
// The legacy function declarations in app.js are not deleted — overwriting
// window.renderTonesView is enough because top-level function declarations
// in classic scripts resolve to properties on the global object.

import { createTonesModule } from './module';
import type { TonesModule } from './module';
import { renderTone as typedRenderTone, THAI_EN, TONES } from '../../format';

export function wireLegacyTones(): TonesModule {
  const w = window as unknown as Record<string, any>;

  // All item outline updates share one selector. We use a single function so
  // tests don't need a DOM; legacy runs against the real document.
  const setItemOutlines = (thai: string | null) => {
    const nodes = document.querySelectorAll<HTMLElement>('.tones-section .tone-item');
    nodes.forEach((el) => {
      el.style.outline = el.getAttribute('data-thai') === thai ? '2px solid #e94560' : '';
    });
  };

  const mod = createTonesModule({
    getData: () => w.DATA,
    getTones: () => TONES,
    getThaiEn: () => THAI_EN,
    getActiveLesson: () => (w.activeLesson ?? 'all'),
    renderTone: (s, h) => typedRenderTone(s, h),
    speakText: (t, onDone) => {
      if (typeof w.speakText === 'function') w.speakText(t, onDone);
      else if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      if (typeof w.stopCurrentAudio === 'function') w.stopCurrentAudio();
    },
    setStripHtml: (html) => {
      const el = document.getElementById('tonesStrip');
      if (el) el.innerHTML = html;
    },
    setContentHtml: (html) => {
      const el = document.getElementById('tonesContent');
      if (el) el.innerHTML = html;
    },
    setItemOutlines,
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    clearTimeout: (id) => { if (id !== undefined) window.clearTimeout(id); },
  });

  // Override the legacy global surface. Every legacy caller (setMode,
  // rebuild, inline onclick) goes through these.
  w.renderTonesView = mod.render;
  w.getToneItems = mod.getToneItems;
  w.countAllWordsForLesson = mod.countAllWordsForLesson;
  w.selectTone = mod.selectTone;
  w.tonesPlayAllWords = mod.playAllWords;
  w.tonesPlayGroup = mod.playGroup;
  w.tonesPlayWord = mod.playWord;
  w.tonesPlayPair = mod.playPair;
  w.highlightToneItem = (word: { thai?: string } | null) => {
    setItemOutlines(word?.thai ?? null);
  };
  w.stopTonesPlay = mod.stop;
  // Sync legacy state with module state on every render call.
  // activeToneSel is owned by the module now; legacy code that still reads it
  // (none outside tones, per audit) gets the module's value.
  Object.defineProperty(w, 'activeToneSel', {
    get: () => mod.getActiveToneSel(),
    set: (v) => mod.setActiveToneSel(v),
    configurable: true,
  });

  return mod;
}
