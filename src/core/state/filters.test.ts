import { beforeEach, describe, expect, it, vi } from 'vitest';

let scopeValue: 'lecciones' | 'top1000' | 'comprehensive' = 'lecciones';
vi.mock('../persistence/stores', () => ({
  difficultStore: {
    get: () => [] as string[],
    set: () => {},
  },
  scopeStore: {
    get: () => scopeValue,
    set: (v: 'lecciones' | 'top1000' | 'comprehensive') => {
      scopeValue = v;
    },
  },
}));

import {
  getActiveCategory,
  getActiveLesson,
  getActiveScope,
  getActiveType,
  getSearchQuery,
  setActiveCategory,
  setActiveLesson,
  setActiveScope,
  setActiveType,
  setSearchQuery,
} from './filters';

describe('filters state', () => {
  beforeEach(() => {
    setActiveLesson('all');
    setActiveCategory('all');
    setActiveType('all');
    setSearchQuery('');
    scopeValue = 'lecciones';
  });

  it('defaults to the "all" / empty state', () => {
    expect(getActiveLesson()).toBe('all');
    expect(getActiveCategory()).toBe('all');
    expect(getActiveType()).toBe('all');
    expect(getSearchQuery()).toBe('');
  });

  it('activeLesson round-trips', () => {
    setActiveLesson('leccion-3');
    expect(getActiveLesson()).toBe('leccion-3');
    setActiveLesson('dificiles');
    expect(getActiveLesson()).toBe('dificiles');
  });

  it('activeCategory round-trips', () => {
    setActiveCategory('noun');
    expect(getActiveCategory()).toBe('noun');
  });

  it('activeType round-trips for all allowed values', () => {
    const values = ['all', 'word', 'phrase', 'conversation'] as const;
    for (const v of values) {
      setActiveType(v);
      expect(getActiveType()).toBe(v);
    }
  });

  it('searchQuery round-trips', () => {
    setSearchQuery('sawatdee');
    expect(getSearchQuery()).toBe('sawatdee');
    setSearchQuery('');
    expect(getSearchQuery()).toBe('');
  });

  it('activeScope reads through to scopeStore', () => {
    expect(getActiveScope()).toBe('lecciones');
    setActiveScope('top1000');
    expect(getActiveScope()).toBe('top1000');
    setActiveScope('comprehensive');
    expect(getActiveScope()).toBe('comprehensive');
  });
});
