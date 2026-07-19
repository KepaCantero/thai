// Spike 5g: bridge between the typed ShadowingModule and the legacy global
// scripts in public/app.js. Runs during boot after data load, the state
// bridge, and prior mode bridges. Constructs a ShadowingModule with adapters
// for the legacy globals, then overrides the shadowing-related window.*
// functions so every legacy caller (setMode at app.js:906, inline onclick
// handlers emitted by renderShadowingPlayer/renderShadowingList, the keydown
// handler at app.js:615-622, and toggleShadowing) lands in the typed
// implementation.
//
// SHADOWING is read lazily via the injected closure so this module does not
// import the loader directly — keeps boot-order coupling loose.

import { createShadowingModule } from './module';
import type { ShadowingModule } from './module';
import type { ShadowingConversation } from '../../types';

let shadowingModule: ShadowingModule | undefined;

export function wireLegacyShadowing(): ShadowingModule {
  const w = window as unknown as Record<string, any>;

  const deps = {
    shadowing: (): ShadowingConversation[] => {
      const arr = w.SHADOWING;
      return Array.isArray(arr) ? arr : [];
    },
    speakText: (text: string, onDone?: () => void) => {
      if (typeof w.speakText === 'function') w.speakText(text, onDone);
      else if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      if (typeof w.stopCurrentAudio === 'function') w.stopCurrentAudio();
    },
    renderTone: (toneStr: string | undefined) => {
      if (typeof w.renderTone === 'function') return w.renderTone(toneStr);
      return toneStr || '';
    },
    dom: {
      setListHtml: (html: string) => {
        const el = document.getElementById('shList');
        if (el) el.innerHTML = html;
      },
      showListView: () => {
        const list = document.getElementById('shList');
        const player = document.getElementById('shPlayer');
        if (list) list.style.display = '';
        if (player) player.style.display = 'none';
      },
      showPlayerView: () => {
        const list = document.getElementById('shList');
        const player = document.getElementById('shPlayer');
        if (list) list.style.display = 'none';
        if (player) player.style.display = 'flex';
      },
      hidePlayerView: () => {
        const player = document.getElementById('shPlayer');
        const list = document.getElementById('shList');
        if (player) player.style.display = 'none';
        if (list) list.style.display = '';
      },
      setPlayerHtml: (html: string) => {
        const el = document.getElementById('shPlayer');
        if (el) el.innerHTML = html;
      },
      getAudio: () => document.getElementById('shAudio') as HTMLAudioElement | null,
      queryLines: () =>
        Array.from(document.querySelectorAll('.sh-line')) as HTMLElement[],
      getById: (id: string) => document.getElementById(id),
      querySelector: (sel: string) =>
        document.querySelector(sel) as HTMLElement | null,
    },
  };

  shadowingModule = createShadowingModule(deps);

  // Override the legacy global surface. Every legacy caller — setMode
  // (app.js:906), inline onclick handlers in renderShadowingPlayer /
  // renderShadowingList, the keydown handler at app.js:615-622, and
  // toggleShadowing — goes through these.
  w.renderShadowingList = shadowingModule.renderShadowingList;
  w.openShadowing = shadowingModule.openShadowing;
  w.exitShadowingMode = shadowingModule.exitShadowingMode;
  w.exitShadowingPlayer = shadowingModule.exitShadowingPlayer;
  w.renderShadowingPlayer = shadowingModule.renderShadowingPlayer;
  w.playShLine = shadowingModule.playShLine;
  w.toggleShPlayAll = shadowingModule.toggleShPlayAll;
  w.startShPlay = shadowingModule.startShPlay;
  w.stopShPlay = shadowingModule.stopShPlay;
  w.shAudioTimeUpdate = shadowingModule.shAudioTimeUpdate;
  w.cycleShSpeed = shadowingModule.cycleShSpeed;
  w.toggleShSync = shadowingModule.toggleShSync;
  w.shSyncTap = shadowingModule.shSyncTap;
  w.resetShTimes = shadowingModule.resetShTimes;

  // Expose shPlaying and shSyncing as getters on window so legacy bare-
  // identifier reads (e.g. app.js:858 `if (typeof shPlaying !== 'undefined'
  // && shPlaying) stopShPlay()`) resolve against the module's internal state.
  Object.defineProperty(w, 'shPlaying', {
    configurable: true,
    enumerable: true,
    get: () => shadowingModule.isShPlaying(),
  });

  return shadowingModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getShadowingModule(): ShadowingModule | undefined {
  return shadowingModule;
}
