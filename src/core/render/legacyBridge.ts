// Spike 5h: render legacy bridge.
//
// Seeds window.WORD_DICT by calling buildWordDict() once, then installs
// translateWords and renderWB onto window so legacy classic scripts that
// resolve bare identifiers against window see the typed implementation.
//
// Runs in main.ts AFTER wireLegacyFormat (which seeds THAI_EN used by
// buildWordDict) and BEFORE the mode bridges.

import { buildWordDict, renderWB, translateWords } from './wordDict';

export function wireLegacyRender(): void {
  const w = window as unknown as Record<string, unknown>;

  // Seed the singleton cache. The legacy code never reseeded WORD_DICT
  // after first call, and downstream bridges (cards, dashboard, questions)
  // rely on it being populated by the time showCard fires. Doing it here
  // at boot keeps parity.
  w.WORD_DICT = buildWordDict();
  w.translateWords = translateWords;
  w.renderWB = renderWB;
}
