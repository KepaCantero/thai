// Spike 5e: bridge between the typed Top1000Module and the legacy global
// scripts in public/top1000-ui.js + public/srs-ui.js. Runs during boot
// (after data load, after the cards bridge installs). Constructs a
// Top1000Module with adapters for the legacy globals, then overrides:
//   - window.renderTop1000
//   - window.setTop1000Tab
//   - window.setTop1000Cat
//   - window.setTop1000Search
//   - window.top1000Speak
//   - window.renderTop1000Words / Structures / Phrases / Conversations /
//     StudyBody (so any legacy caller — and the duplicate declaration at
//     top1000-ui.js:107 — resolves to the typed implementation)
//   - window.segmentPhraseThai / getTop1000WordDict (called by app.js)
//
// SRS coupling is preserved as-is: the module looks up mountSrsInline /
// unmountSrsInline / renderDeckPicker / getDeckStats / SRS_TOP1000_DECK_KEYS
// via window lazily, so a future srs extraction can simply install the
// typed versions on window and the top1000 module picks them up.
//
// The legacy function declarations in top1000-ui.js are not deleted —
// overwriting window.* is enough because top-level function declarations
// in classic scripts resolve to properties on the global object, and
// legacy bare-identifier call sites resolve against window at call time.

import { getTop1000, getTop1000Segments } from '../../data/loader';
import { createTop1000Module } from './module';
import type { Top1000Module } from './module';

let top1000Module: Top1000Module | undefined;

export function wireLegacyTop1000(): Top1000Module {
  const w = window as unknown as Record<string, any>;

  const deps = {
    getBundle: () => getTop1000(),
    getPhraseSegments: () => getTop1000Segments(),
    speakText: (text: string) => {
      if (typeof w.speakText === 'function') w.speakText(text);
    },
    renderTone: (tone: string) =>
      typeof w.renderTone === 'function' ? w.renderTone(tone) : '',
    mountSrsInline: (
      hostId: string,
      onExit: () => void,
      deckKeys: string[],
    ) => {
      if (typeof w.mountSrsInline === 'function')
        w.mountSrsInline(hostId, onExit, deckKeys);
    },
    unmountSrsInline: () => {
      if (typeof w.unmountSrsInline === 'function') w.unmountSrsInline();
    },
    renderDeckPicker: () =>
      typeof w.renderDeckPicker === 'function' ? w.renderDeckPicker() : '',
    getDeckStats: (deckKey: string) => {
      if (typeof w.getDeckStats === 'function') {
        try {
          return w.getDeckStats(deckKey);
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    srsTop1000DeckKeys: w.SRS_TOP1000_DECK_KEYS,
    dom: {
      setViewHtml: (html: string) => {
        const el = document.getElementById('top1000View');
        if (el) el.innerHTML = html;
      },
    },
  };

  top1000Module = createTop1000Module(deps);

  // Override the legacy global surface. Every legacy caller (setMode in
  // app.js:919, inline onclick handlers emitted by the card renderers) goes
  // through these.
  w.renderTop1000 = top1000Module.renderTop1000;
  w.setTop1000Tab = top1000Module.setTop1000Tab;
  w.setTop1000Cat = top1000Module.setTop1000Cat;
  w.setTop1000Search = top1000Module.setTop1000Search;
  w.top1000Speak = top1000Module.top1000Speak;

  // Per-tab renderers — exported so tests can call them directly, and so
  // the duplicate `renderTop1000StudyBody` declaration at top1000-ui.js:107
  // is overridden by this single typed implementation.
  w.renderTop1000Words = top1000Module.renderTop1000Words;
  w.renderTop1000Structures = top1000Module.renderTop1000Structures;
  w.renderTop1000Phrases = top1000Module.renderTop1000Phrases;
  w.renderTop1000Conversations = top1000Module.renderTop1000Conversations;
  w.renderTop1000StudyBody = top1000Module.renderTop1000StudyBody;
  w.segmentPhraseThai = top1000Module.segmentPhraseThai;

  return top1000Module;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getTop1000Module(): Top1000Module | undefined {
  return top1000Module;
}
