// Spike 5 entry point.
//
// The legacy scripts in public/*.js still load first via <script> tags and
// share state through globals on `window`. This module runs after them
// (module scripts are deferred), wires each extracted mode's bridge so its
// typed implementation overrides the legacy global surface, then exits.
//
// As more modes are extracted (matrix, shadowing, srs, ...), each gets its
// own wireLegacyXxx() call here. Until then, the legacy code paths stay
// authoritative for the un-migrated modes.

import { loadAllData } from './core/data/loader';
import { wireLegacyTones } from './core/modes/tones/legacyBridge';
import { wireLegacyAlphabet } from './core/modes/alphabet/legacyBridge';
import { wireLegacyCards } from './core/modes/cards/legacyBridge';
import { wireLegacyQuestions } from './core/modes/questions/legacyBridge';
import { wireLegacyTop1000 } from './core/modes/top1000/legacyBridge';
import { wireLegacyMatrix } from './core/modes/matrix/legacyBridge';
import { wireLegacyShadowing } from './core/modes/shadowing/legacyBridge';
import { wireLegacySrs } from './core/modes/srs/legacyBridge';
import { wireLegacyDashboard } from './core/modes/dashboard/legacyBridge';
import { wireLegacyAudio } from './core/audio/legacyBridge';
import { wireLegacyFormat } from './core/format/legacyBridge';
import { wireLegacyRender } from './core/render/legacyBridge';
import { wireSlHud, wireSlLevelUpModal, wireSlNotifications, wireSlQuests, wireSlStatusWindow } from './core/render';
import {
  installStateBridge,
  wirePlayerEngine,
  wireQuestEngine,
  wireTitleEngine,
} from './core/state';

if (typeof document !== 'undefined') {
  const boot = async () => {
    // Phase 2: install the typed state bridge BEFORE loading data. Legacy
    // top-level `var` declarations in public/app.js have already run by now
    // (module scripts are deferred), so their initial values seed the typed
    // state, and the descriptors we install proxy all subsequent reads /
    // writes through to src/core/state/*.
    try {
      installStateBridge();
    } catch (e) {
      console.error('[state] bridge install failed:', e);
    }

    // Solo Leveling Phase 1: subscribe the XP engine to the event bus before
    // any mode boots, so the very first user action gets rewarded. Runs in
    // its own try/catch so a store failure never blocks the rest of boot.
    try {
      wirePlayerEngine();
    } catch (e) {
      console.error('[player] engine wiring failed:', e);
    }

    // Solo Leveling Phase 5: subscribe the quest engine so the first user
    // action of the day starts populating the daily window.
    try {
      wireQuestEngine();
    } catch (e) {
      console.error('[quests] engine wiring failed:', e);
    }

    // Solo Leveling Phase 7: subscribe the title engine so the first
    // qualifying event unlocks the corresponding title (and emits the
    // toast event Fase 6 listens to).
    try {
      wireTitleEngine();
    } catch (e) {
      console.error('[titles] engine wiring failed:', e);
    }

    // Phase 2: fetch the four data JSON bundles (app, top1000, top1000
    // segments, audio manifest) and install them on window.* before any
    // legacy boot code runs. The legacy init listener in app.js waits for
    // 'thai-data-ready' (dispatched below, AFTER all bridges are wired so
    // init-time calls to setScope → setMode → renderTop1000/renderDashboard/
    // etc. resolve to typed implementations).
    try {
      await loadAllData();
    } catch (e) {
      console.error('[data] load failed:', e);
      // Fall through and dispatch anyway so the legacy app can render its
      // own degraded state instead of hanging on a blank page.
    }

    const wire = (name: string, fn: () => unknown) => {
      try { fn(); } catch (e) { console.error('[boot] failed to wire ' + name, e); }
    };
    // Audio is a leaf dependency for every mode bridge — install it first so
    // window.speakText / window.stopCurrentAudio / window.playAudioItem
    // exist before any mode reads them. public/audio.js is gone (Spike 6);
    // this wiring replaces it.
    wire('audio', wireLegacyAudio);
    // Format (renderTone/getEn/THAI_EN/CONV_EN/...) and render (word-breakdown)
    // are leaf dependencies for every mode bridge — install them before any
    // mode reads from window. public/config.js + public/ui.js are gone
    // (Spike 5h); these wirings replace them.
    wire('format', wireLegacyFormat);
    wire('render', wireLegacyRender);
    wire('tones', wireLegacyTones);
    wire('alphabet', wireLegacyAlphabet);
    wire('cards', wireLegacyCards);
    wire('questions', wireLegacyQuestions);
    wire('top1000', wireLegacyTop1000);
    wire('matrix', wireLegacyMatrix);
    wire('shadowing', wireLegacyShadowing);
    wire('srs', wireLegacySrs);
    wire('dashboard', wireLegacyDashboard);
    // Solo Leveling Phase 2: mount the HUD after the player engine is
    // wired (above) so the first render reflects persisted state, and
    // before 'thai-data-ready' so the legacy UI sees it in place.
    wire('sl-hud', wireSlHud);
    // Solo Leveling Phase 4: Status Window overlay. Mounts AFTER the HUD so
    // #sl-hud exists when slStatusWindow attaches its click-delegation.
    wire('sl-window', wireSlStatusWindow);
    // Solo Leveling Phase 5: Daily Quests floating panel. Mounts after the
    // other overlays so its z-index sits below the status window.
    wire('sl-quests', wireSlQuests);
    // Solo Leveling Phase 6: SFX synthesis (no-op wiring — AudioContext lazy),
    // floating notifications, and rank-up modal.
    wire('sfx', () => { /* nothing to wire; store-loaded */ });
    wire('sl-notifications', wireSlNotifications);
    wire('sl-levelup', wireSlLevelUpModal);

    // Dispatch 'thai-data-ready' AFTER all bridges have wired so the
    // legacy init listener in app.js can safely call setScope → setMode →
    // renderTop1000/renderDashboard/etc. (each bridge has installed its
    // typed implementation on window.* by this point).
    window.dispatchEvent(new Event('thai-data-ready'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    void boot();
  }
}
