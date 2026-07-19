// Tests for the CT grouping + tile rendering helpers. Pure functions —
// no DOM, no module deps.

import { describe, it, expect } from 'vitest';
import {
  avgFreqRank,
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
};

function ctCard(opts: {
  category: string;
  source: string;
  rank?: number;
}): Card {
  return {
    type: 'conversation',
    thai: '',
    category: opts.category,
    source: opts.source,
    rank: opts.rank,
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
});
