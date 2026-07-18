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

if (typeof document !== 'undefined') {
  const boot = async () => {
    // Phase 2: fetch the four data JSON bundles (app, top1000, top1000
    // segments, audio manifest) and install them on window.* before any
    // legacy boot code runs. The legacy DOMContentLoaded listener in
    // public/app.js was retargeted to 'thai-data-ready' so it waits for
    // this signal — see loader.ts for the identity-caching contract.
    try {
      await loadAllData();
    } catch (e) {
      console.error('[data] load failed:', e);
      // Fall through and dispatch anyway so the legacy app can render its
      // own degraded state instead of hanging on a blank page.
    }
    window.dispatchEvent(new Event('thai-data-ready'));

    const wire = (name: string, fn: () => unknown) => {
      try { fn(); } catch (e) { console.error('[boot] failed to wire ' + name, e); }
    };
    wire('tones', wireLegacyTones);
    wire('alphabet', wireLegacyAlphabet);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    void boot();
  }
}
