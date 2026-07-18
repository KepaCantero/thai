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

import { wireLegacyTones } from './core/modes/tones/legacyBridge';
import { wireLegacyAlphabet } from './core/modes/alphabet/legacyBridge';

if (typeof document !== 'undefined') {
  const boot = () => {
    const wire = (name: string, fn: () => unknown) => {
      try { fn(); } catch (e) { console.error('[boot] failed to wire ' + name, e); }
    };
    wire('tones', wireLegacyTones);
    wire('alphabet', wireLegacyAlphabet);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
