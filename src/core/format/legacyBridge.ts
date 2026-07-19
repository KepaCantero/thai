// Spike 5h: format legacy bridge.
//
// Installs the typed format helpers (TONES, renderTone, getEn, THAI_EN,
// PHRASE_EN, CONV_EN, CAT_LABELS, $) onto window.* so legacy classic
// scripts (public/app.js, public/shadowing.js, ...) and any other caller
// still resolving bare identifiers against window sees the typed
// implementation.
//
// Runs in main.ts BEFORE the mode bridges so they can read typed values
// from window during their own wiring (and so their `w.renderTone ===
// 'function'` checks succeed).

import { $, CAT_LABELS, CONV_EN, getEn, PHRASE_EN, renderTone, THAI_EN, TONES } from './index';

export function wireLegacyFormat(): void {
  const w = window as unknown as Record<string, unknown>;

  w.TONES = TONES;
  w.CAT_LABELS = CAT_LABELS;
  w.THAI_EN = THAI_EN;
  w.PHRASE_EN = PHRASE_EN;
  w.CONV_EN = CONV_EN;
  w.renderTone = renderTone;
  w.getEn = getEn;
  w.$ = $;
}
