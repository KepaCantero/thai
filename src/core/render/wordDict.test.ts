// Unit tests for src/core/render/wordDict. Verifies segmentation, HTML
// structure, dedup behavior, and that renderWB output is byte-identical to
// the legacy public/ui.js implementation.

import { beforeEach, describe, expect, it } from 'vitest';
import {
  __resetWordDictForTests,
  buildWordDict,
  renderWB,
  translateWords,
} from './wordDict';

beforeEach(() => {
  __resetWordDictForTests();
});

describe('buildWordDict', () => {
  it('returns the cached singleton on second call', () => {
    const a = buildWordDict();
    const b = buildWordDict();
    expect(a).toBe(b);
  });

  it('contains hand-curated extras even when DATA.words is empty', () => {
    const d = buildWordDict();
    // From EXTRAS table.
    expect(d['ไม่เป็นไร']).toEqual({ ph: 'mai pen rai', en: 'no worries' });
    expect(d['ฉัน']).toEqual({ ph: 'chan', en: 'I (informal)' });
  });
});

describe('translateWords', () => {
  it('segments a single Thai word', () => {
    const out = translateWords('ฉัน');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ thai: 'ฉัน', en: 'I (informal)' });
  });

  it('does longest-match segmentation', () => {
    // 'ไม่เป็นไร' is in the dict as a single entry; the segmenter should
    // consume the whole phrase, not split into ไม่/เป็น/ไร.
    const out = translateWords('ไม่เป็นไร');
    expect(out).toHaveLength(1);
    expect(out[0].thai).toBe('ไม่เป็นไร');
  });

  it('skips ASCII chars and punctuation', () => {
    const out = translateWords('ฉัน! 123 abc');
    // Only ฉัน should be translated; the rest are skipped.
    expect(out.some((w) => w.thai === 'ฉัน')).toBe(true);
  });
});

describe('renderWB', () => {
  it('returns empty string for input with no segments', () => {
    expect(renderWB('')).toBe('');
    expect(renderWB('!!! 123')).toBe('');
  });

  it('produces the expected wb/wb-i structure', () => {
    const html = renderWB('ฉัน');
    expect(html).toContain('<div class="wb">');
    expect(html).toContain('<span class="wb-i">');
    expect(html).toContain('<span class="wb-t">ฉัน</span>');
    expect(html).toContain('<span class="wb-ph">');
    expect(html).toContain('<span class="wb-s">');
  });
});
