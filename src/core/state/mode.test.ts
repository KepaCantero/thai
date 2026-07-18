import { describe, expect, it } from 'vitest';

import {
  getMode,
  isFilterPanelOpen,
  isMode,
  setFilterPanelOpen,
  setMode,
  toggleFilterPanel,
} from './mode';

describe('mode state', () => {
  it('defaults to "cards"', () => {
    // NOTE: state is module-level and shared across tests. We restore at end.
    const before = getMode();
    setMode('cards');
    expect(getMode()).toBe('cards');
    setMode(before);
  });

  it('round-trips every supported mode', () => {
    const before = getMode();
    const modes = [
      'cards',
      'dashboard',
      'questions',
      'shadowing',
      'matrix',
      'tones',
      'top1000',
      'alphabet',
      'srs',
    ] as const;
    for (const m of modes) {
      setMode(m);
      expect(getMode()).toBe(m);
      expect(isMode(m)).toBe(true);
      expect(isMode('cards')).toBe(m === 'cards');
    }
    setMode(before);
  });

  it('setFilterPanelOpen toggles the value', () => {
    setFilterPanelOpen(true);
    expect(isFilterPanelOpen()).toBe(true);
    setFilterPanelOpen(false);
    expect(isFilterPanelOpen()).toBe(false);
  });

  it('toggleFilterPanel flips state and returns the new value', () => {
    setFilterPanelOpen(false);
    expect(toggleFilterPanel()).toBe(true);
    expect(isFilterPanelOpen()).toBe(true);
    expect(toggleFilterPanel()).toBe(false);
    expect(isFilterPanelOpen()).toBe(false);
  });
});
