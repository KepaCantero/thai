import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the persistence layer so tests don't touch localStorage (which is a
// no-op in vitest's node environment anyway, and would be shared across
// tests if it weren't).
let difficultValue: string[] = [];
vi.mock('../persistence/stores', () => ({
  difficultStore: {
    get: () => difficultValue,
    set: (v: string[]) => {
      difficultValue = v;
    },
  },
  scopeStore: {
    get: () => 'lecciones',
    set: () => {},
  },
}));

import {
  clearKnown,
  getDifficultSize,
  getKnownSize,
  getUnknownSize,
  isDifficult,
  isKnown,
  isUnknown,
  markKnown,
  markUnknown,
  toggleDifficult,
} from './scoring';

describe('scoring state — known/unknown', () => {
  beforeEach(() => {
    clearKnown();
  });

  it('markKnown adds to known and removes from unknown', () => {
    markUnknown('a');
    expect(isUnknown('a')).toBe(true);
    markKnown('a');
    expect(isKnown('a')).toBe(true);
    expect(isUnknown('a')).toBe(false);
  });

  it('markUnknown adds to unknown and removes from known', () => {
    markKnown('b');
    expect(isKnown('b')).toBe(true);
    markUnknown('b');
    expect(isUnknown('b')).toBe(true);
    expect(isKnown('b')).toBe(false);
  });

  it('clearKnown empties both Sets', () => {
    markKnown('x');
    markUnknown('y');
    clearKnown();
    expect(getKnownSize()).toBe(0);
    expect(getUnknownSize()).toBe(0);
  });

  it('size getters report current counts', () => {
    markKnown('k1');
    markKnown('k2');
    markUnknown('u1');
    expect(getKnownSize()).toBe(2);
    expect(getUnknownSize()).toBe(1);
  });
});

describe('scoring state — difficult (via difficultStore)', () => {
  beforeEach(() => {
    difficultValue = [];
  });

  it('toggleDifficult adds and removes the key', () => {
    expect(isDifficult('hard1')).toBe(false);
    toggleDifficult('hard1');
    expect(isDifficult('hard1')).toBe(true);
    toggleDifficult('hard1');
    expect(isDifficult('hard1')).toBe(false);
  });

  it('getDifficultSize reflects store length', () => {
    expect(getDifficultSize()).toBe(0);
    toggleDifficult('s1');
    expect(getDifficultSize()).toBe(1);
    toggleDifficult('s2');
    expect(getDifficultSize()).toBe(2);
  });

  it('toggleDifficult on an existing key is idempotent (toggles off)', () => {
    toggleDifficult('x');
    toggleDifficult('x');
    expect(isDifficult('x')).toBe(false);
  });
});
