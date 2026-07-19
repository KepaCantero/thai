// getEn(item) — looks up the English translation for a card item. Ported
// line-for-line from public/config.js:169-177. The `item` shape mirrors
// the loose Card type from src/core/types.ts.

import type { Card } from '../types';
import { CONV_EN, PHRASE_EN, THAI_EN } from './translations';

/**
 * Returns the English gloss for a card item. Branches on `item.type`:
 *   - 'pair'         → "en(w1) / en(w2)"
 *   - 'conversation' → "q → a" (falls back to spanish if no translation)
 *   - 'phrase'       → PHRASE_EN lookup (falls back to spanish)
 *   - default        → THAI_EN lookup (falls back to spanish)
 *
 * Mirrors public/config.js:169-177 exactly. Output must stay byte-identical
 * for snapshot tests in cards/dashboard modes.
 *
 * NOTE: the pair branch reads `item.w1.thai` / `item.w2.thai`, which on the
 * legacy Pair shape are strings — matching the original code. We accept the
 * Card type's wider w1/w2: string | object and cast at the boundary.
 */
export function getEn(item: Card): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const it = item as any;
  if (it.type === 'pair') {
    const w1thai = typeof it.w1 === 'string' ? it.w1 : it.w1?.thai;
    const w2thai = typeof it.w2 === 'string' ? it.w2 : it.w2?.thai;
    return THAI_EN[w1thai] + ' / ' + THAI_EN[w2thai];
  }
  if (it.type === 'conversation') {
    const en = CONV_EN[it.q_thai];
    return en ? en.q + ' → ' + en.a : it.q_spanish + ' → ' + it.a_spanish;
  }
  if (it.type === 'phrase') return PHRASE_EN[it.thai] || it.spanish;
  return THAI_EN[it.thai] || it.spanish;
}
