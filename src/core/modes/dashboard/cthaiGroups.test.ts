// Tests for the CT grouping + tile rendering helpers. Pure functions —
// no DOM, no module deps.

import { describe, it, expect } from 'vitest';
import {
  avgFreqRank,
  bucketSourcesByLevel,
  computeSourceDifficulty,
  countUniqueThaiChars,
  cthaiSourceLabel,
  escapeAttr,
  groupCthaiByCategory,
  groupCthaiBySource,
  renderCategoryTile,
  renderProgress,
  renderSourceTile,
  sortByEasiestFirst,
  sortSourcesByEasiestFirst,
  wrapCategoryTiles,
  wrapSourceTiles,
  type CthaiGroupingDeps,
} from './cthaiGroups';
import type { Card } from '../../types';

const deps: CthaiGroupingDeps = {
  isDone: () => false,
  freqRank: (c) => (c as unknown as { rank?: number }).rank ?? 9999,
  aThaiLength: (c) =>
    ((c as unknown as { a_thai?: string }).a_thai ?? '').length,
  uniqueCharCount: (c) => {
    const q = (c as unknown as { q_thai?: string }).q_thai;
    const a = (c as unknown as { a_thai?: string }).a_thai;
    return countUniqueThaiChars(q, a);
  },
};

function ctCard(opts: {
  category: string;
  source: string;
  rank?: number;
  q_thai?: string;
  a_thai?: string;
}): Card {
  return {
    type: 'conversation',
    thai: '',
    category: opts.category,
    source: opts.source,
    rank: opts.rank,
    q_thai: opts.q_thai,
    a_thai: opts.a_thai,
  } as unknown as Card;
}

describe('cthaiGroups · groupCthaiByCategory', () => {
  it('buckets cards by category and preserves insertion order', () => {
    const cards = [
      ctCard({ category: 'comida', source: 'cthai:a', rank: 5 }),
      ctCard({ category: 'saludos', source: 'cthai:b', rank: 50 }),
      ctCard({ category: 'comida', source: 'cthai:c', rank: 10 }),
    ];
    const groups = groupCthaiByCategory(cards, deps);
    expect(groups.map((g) => g.name)).toEqual(['comida', 'saludos']);
    expect(groups[0].cards.length).toBe(2);
    expect(groups[1].cards.length).toBe(1);
    expect(groups[0].freqSum).toBe(15);
  });

  it('falls back to "otros" when category is missing', () => {
    const card = { type: 'conversation', source: 'cthai:x' } as unknown as Card;
    const groups = groupCthaiByCategory([card], deps);
    expect(groups[0].name).toBe('otros');
  });
});

describe('cthaiGroups · groupCthaiBySource', () => {
  it('produces one group per source with a friendly label', () => {
    const cards = [
      ctCard({ category: 'comida', source: 'cthai:market_directions' }),
      ctCard({ category: 'comida', source: 'cthai:market_directions' }),
      ctCard({ category: 'comida', source: 'cthai:breakfast_foods' }),
    ];
    const groups = groupCthaiBySource(cards, deps);
    expect(groups.length).toBe(2);
    expect(groups[0].source).toBe('cthai:market_directions');
    expect(groups[0].label).toBe('Market Directions');
    expect(groups[0].cards.length).toBe(2);
  });

  it('skips cards without a source', () => {
    const cards = [{ type: 'conversation', category: 'x' } as unknown as Card];
    expect(groupCthaiBySource(cards, deps)).toEqual([]);
  });
});

describe('cthaiGroups · sorting', () => {
  it('sorts categories easiest → hardest by avg freqRank', () => {
    const cards = [
      ctCard({ category: 'rare', source: 'cthai:a', rank: 9000 }),
      ctCard({ category: 'common', source: 'cthai:b', rank: 5 }),
    ];
    const groups = groupCthaiByCategory(cards, deps);
    const sorted = sortByEasiestFirst(groups);
    expect(sorted[0].name).toBe('common');
    expect(sorted[1].name).toBe('rare');
  });

  it('sortSourcesByEasiestFirst uses avg freqRank of source contents', () => {
    const cards = [
      ctCard({ category: 'c', source: 'cthai:hard', rank: 8000 }),
      ctCard({ category: 'c', source: 'cthai:easy', rank: 10 }),
      ctCard({ category: 'c', source: 'cthai:easy', rank: 20 }),
    ];
    const sources = groupCthaiBySource(cards, deps);
    const sorted = sortSourcesByEasiestFirst(sources, deps.freqRank);
    expect(sorted[0].source).toBe('cthai:easy');
    expect(sorted[1].source).toBe('cthai:hard');
  });

  it('avgFreqRank returns 9999 for empty groups', () => {
    expect(avgFreqRank({ cards: [], freqSum: 0 })).toBe(9999);
  });
});

describe('cthaiGroups · rendering', () => {
  it('renderProgress includes totalDone / total and threshold', () => {
    const html = renderProgress(3, 10, 7);
    expect(html).toContain('3/10');
    expect(html).toContain('≥7 Q');
  });

  it('renderCategoryTile emits setCthaiGroup onclick', () => {
    const group = {
      name: 'comida',
      cards: [{ item: {} as Card, idx: 0 }],
      freqSum: 10,
      done: 0,
    };
    const html = renderCategoryTile(group, 0);
    expect(html).toContain("setCthaiGroup('comida')");
    expect(html).not.toContain('cthai-group-done'); // 0/1 → not complete
    expect(html).toContain('0/1');
  });

  it('renderCategoryTile marks complete groups as done', () => {
    const group = {
      name: 'saludos',
      cards: [{ item: {} as Card, idx: 0 }],
      freqSum: 10,
      done: 1,
    };
    expect(renderCategoryTile(group, 0)).toContain('cthai-group-done');
  });

  it('renderSourceTile emits setCthaiSource onclick', () => {
    const group = {
      source: 'cthai:market_directions',
      label: 'Market Directions',
      cards: [{ item: {} as Card, idx: 0 }],
      done: 0,
    };
    const html = renderSourceTile(group, 0);
    expect(html).toContain("setCthaiSource('cthai:market_directions')");
    expect(html).toContain('Market Directions');
  });

  it('wrapCategoryTiles / wrapSourceTiles emit the right grid class', () => {
    expect(wrapCategoryTiles([])).toContain('cthai-groups-grid');
    expect(wrapSourceTiles([])).toContain('cthai-sources-grid');
  });
});

describe('cthaiGroups · utilities', () => {
  it('cthaiSourceLabel strips prefix, title-cases, replaces underscores', () => {
    expect(cthaiSourceLabel('cthai:breakfast_foods_students')).toBe(
      'Breakfast Foods Students',
    );
    expect(cthaiSourceLabel('not-prefixed')).toBe('Not-Prefixed');
  });

  it('escapeAttr escapes single quotes', () => {
    expect(escapeAttr("foo'bar")).toBe("foo\\'bar");
  });

  it('countUniqueThaiChars ignores whitespace and dedupes', () => {
    expect(countUniqueThaiChars('สวัสดี', 'สวัสดี')).toBe(5);
    expect(countUniqueThaiChars('a b c', 'a b')).toBe(3);
    expect(countUniqueThaiChars(undefined, undefined)).toBe(0);
  });
});

describe('cthaiGroups · computeSourceDifficulty', () => {
  it('normalizes each factor to [0,1] and applies the 0.4/0.4/0.2 weights', () => {
    // Two sources: 'easy' has tiny freqRank, short a_thai, few unique chars.
    // 'hard' has huge freqRank, long a_thai, many unique chars.
    const cards = [
      ctCard({ category: 'c', source: 'cthai:hard', rank: 9999, q_thai: 'ผม', a_thai: 'ฉันไปตลาดกับเพื่อนเมื่อวานนี้' }),
      ctCard({ category: 'c', source: 'cthai:easy', rank: 1, q_thai: 'สวัสดี', a_thai: 'สวัสดี' }),
    ];
    const sources = groupCthaiBySource(cards, deps);
    const scores = new Map(
      computeSourceDifficulty(sources, deps).map((s) => [s.source, s]),
    );
    expect(scores.get('cthai:easy')!.score).toBeCloseTo(0, 5);
    expect(scores.get('cthai:hard')!.score).toBeCloseTo(1, 5);
  });

  it('returns score 0 when all sources are identical (degenerate normalization)', () => {
    const cards = [
      ctCard({ category: 'c', source: 'cthai:a', rank: 100, q_thai: 'x', a_thai: 'y' }),
      ctCard({ category: 'c', source: 'cthai:b', rank: 100, q_thai: 'x', a_thai: 'y' }),
    ];
    const sources = groupCthaiBySource(cards, deps);
    const scores = computeSourceDifficulty(sources, deps);
    expect(scores.every((s) => s.score === 0)).toBe(true);
  });
});

describe('cthaiGroups · bucketSourcesByLevel', () => {
  it('returns 5 empty levels when no sources are passed', () => {
    const levels = bucketSourcesByLevel([], deps);
    expect(levels.map((l) => l.level)).toEqual(['N0', 'A1', 'A2', 'B1', 'B2']);
    expect(levels.every((l) => l.sources.length === 0)).toBe(true);
  });

  it('splits non-N0 sources into 4 quartiles (A1→B2), N0 reserved for forced set', () => {
    // 4 sources with increasing difficulty. None are in N0_SOURCES, so N0
    // is empty and the 4 sources fill A1/A2/B1/B2 one each.
    const cards = [1, 2, 3, 4].flatMap((i) => [
      ctCard({
        category: 'c',
        source: `cthai:not_curated_${i}`,
        rank: i * 10,
        q_thai: 'x',
        a_thai: 'y'.repeat(i),
      }),
    ]);
    const sources = groupCthaiBySource(cards, deps);
    const levels = bucketSourcesByLevel(sources, deps);
    expect(levels[0].sources).toEqual([]); // N0 empty
    expect(levels[1].sources[0].source).toBe('cthai:not_curated_1');
    expect(levels[2].sources[0].source).toBe('cthai:not_curated_2');
    expect(levels[3].sources[0].source).toBe('cthai:not_curated_3');
    expect(levels[4].sources[0].source).toBe('cthai:not_curated_4');
  });

  it('forces N0 membership from the curated N0_SOURCES set', () => {
    // 'breakfast_foods_students' is in the generated N0_SOURCES set.
    // Even if its score is the hardest (long a_thai + rare vocab), it
    // still lands in N0 because the playlist curates it as absolute
    // beginner content.
    const cards = [
      ctCard({
        category: 'c',
        source: 'cthai:breakfast_foods_students',
        rank: 9999,
        q_thai: 'ซอยกว้างๆ',
        a_thai: 'ตลาดมีคนขายของมากมายหลายอย่าง',
      }),
      ctCard({ category: 'c', source: 'cthai:easy_a', rank: 1, q_thai: 'a', a_thai: 'a' }),
      ctCard({ category: 'c', source: 'cthai:easy_b', rank: 2, q_thai: 'b', a_thai: 'b' }),
      ctCard({ category: 'c', source: 'cthai:easy_c', rank: 3, q_thai: 'c', a_thai: 'c' }),
      ctCard({ category: 'c', source: 'cthai:easy_d', rank: 4, q_thai: 'd', a_thai: 'd' }),
    ];
    const sources = groupCthaiBySource(cards, deps);
    const levels = bucketSourcesByLevel(sources, deps);
    expect(levels[0].sources.map((s) => s.source)).toEqual([
      'cthai:breakfast_foods_students',
    ]);
    // The four 'easy_*' sources fill A1/B2 via quartiles of `rest`.
    expect(levels[1].sources[0].source).toBe('cthai:easy_a');
    expect(levels[4].sources[0].source).toBe('cthai:easy_d');
  });

  it('when all sources are forced-N0, A1-B2 are empty', () => {
    const cards = [
      ctCard({ category: 'c', source: 'cthai:breakfast_foods_students', rank: 9999 }),
      ctCard({ category: 'c', source: 'cthai:colors_elephant_foods', rank: 9999 }),
    ];
    const sources = groupCthaiBySource(cards, deps);
    const levels = bucketSourcesByLevel(sources, deps);
    expect(levels[0].sources.length).toBe(2);
    expect(levels.slice(1).every((l) => l.sources.length === 0)).toBe(true);
  });
});
