// Tones data + tone-string renderer. Ported line-for-line from
// public/config.js:1-7 and 179-190 so renderTone output stays byte-identical.

import type { ToneKey, ToneMap } from '../types';

export const TONES: ToneMap = {
  m: { symbol: '→', name: 'Mid', color: '#4ecdc4' },
  l: { symbol: '↘', name: 'Low', color: '#7b8cff' },
  r: { symbol: '↑', name: 'Rising', color: '#95e876' },
  f: { symbol: '↓', name: 'Falling', color: '#ff6b6b' },
  h: { symbol: '↗', name: 'High', color: '#ffd166' },
};

/**
 * Renders a hyphen-joined tone string as colored spans. Mirrors
 * public/config.js:179-190 verbatim — output must stay byte-identical so
 * existing snapshots and DOM structure don't drift.
 *
 * `highlight` (when set) underlines the matching tone key and hides the
 * name label for non-matching segments.
 */
export function renderTone(
  toneStr: string | undefined,
  highlight?: string,
): string {
  if (!toneStr) return '';
  return toneStr
    .split('-')
    .map(function (t: string) {
      const info = TONES[t as ToneKey];
      if (!info) return '';
      const hl = highlight && t === highlight;
      const style = hl
        ? 'color:' +
          info.color +
          ';font-size:1.05rem;text-decoration:underline;text-underline-offset:3px'
        : 'color:' + (highlight ? '#555' : info.color);
      return (
        '<span style="' +
        style +
        '"><span class="tone-symbol">' +
        info.symbol +
        '</span> ' +
        (hl ? '' : info.name) +
        '</span>'
      );
    })
    .join('  ');
}
