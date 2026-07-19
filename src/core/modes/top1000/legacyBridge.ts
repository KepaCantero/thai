// Spike 5e: bridge between the typed Top1000Module and the still-legacy
// global scripts in public/top1000-ui.js + public/app.js. Runs during boot
// (after data load, after the cards bridge installs). Constructs a
// Top1000Module with adapters, then overrides window.renderTop1000 etc.
// so every legacy caller (setMode, inline onclick handlers) lands in the
// typed implementation.
//
// SRS coupling (Spike 5h): resolved directly against the typed SrsModule
// exported from ../srs/legacyBridge. The lookup is lazy because the SRS
// bridge runs after this one in main.ts.

import { getTop1000, getTop1000Segments } from '../../data/loader';
import { createTop1000Module } from './module';
import type { Top1000Module } from './module';
import { getSrsModule } from '../srs/legacyBridge';
import { renderTone as typedRenderTone } from '../../format';

let top1000Module: Top1000Module | undefined;

export function wireLegacyTop1000(): Top1000Module {
  const w = window as unknown as Record<string, any>;

  const deps = {
    getBundle: () => getTop1000(),
    getPhraseSegments: () => getTop1000Segments(),
    speakText: (text: string) => {
      if (typeof w.speakText === 'function') w.speakText(text);
    },
    renderTone: (tone: string) => typedRenderTone(tone),
    mountSrsInline: (
      hostId: string,
      onExit: () => void,
      deckKeys: string[],
    ) => {
      getSrsModule()?.mountSrsInline(hostId, onExit, deckKeys);
    },
    unmountSrsInline: () => {
      getSrsModule()?.unmountSrsInline();
    },
    renderDeckPicker: () => getSrsModule()?.renderDeckPicker() ?? '',
    getDeckStats: (deckKey: string) => {
      const srs = getSrsModule();
      if (!srs) return undefined;
      try {
        return srs.getDeckStats(deckKey as any);
      } catch {
        return undefined;
      }
    },
    srsTop1000DeckKeys: ['palabras', 'estructuras', 'frases'],
    dom: {
      setViewHtml: (html: string) => {
        const el = document.getElementById('top1000View');
        if (el) el.innerHTML = html;
      },
    },
  };

  top1000Module = createTop1000Module(deps);

  w.renderTop1000 = top1000Module.renderTop1000;
  w.setTop1000Tab = top1000Module.setTop1000Tab;
  w.setTop1000Cat = top1000Module.setTop1000Cat;
  w.setTop1000Search = top1000Module.setTop1000Search;
  w.top1000Speak = top1000Module.top1000Speak;
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
