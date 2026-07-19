// Solo Leveling Phase 6: SFX unit tests.
//
// vitest's default env is 'node' — no AudioContext. These tests assert
// playSfx is defensive (no throw) and the enable/disable toggle gates
// future calls.

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../persistence/stores', () => ({
  sfxEnabledStore: {
    get: () => true,
    set: () => {},
  },
}));

describe('sfx', () => {
  beforeEach(async () => {
    const mod = await import('./sfx');
    mod.__resetSfxForTests();
  });

  it('playSfx does not throw without an AudioContext', async () => {
    const { playSfx } = await import('./sfx');
    expect(() => playSfx('level-up')).not.toThrow();
    expect(() => playSfx('rank-up')).not.toThrow();
    expect(() => playSfx('penalty')).not.toThrow();
  });

  it('isSfxEnabled defaults to true', async () => {
    const { isSfxEnabled } = await import('./sfx');
    expect(isSfxEnabled()).toBe(true);
  });

  it('setSfxEnabled(false) blocks future calls and isSfxEnabled reflects state', async () => {
    const { setSfxEnabled, isSfxEnabled, playSfx } = await import('./sfx');
    setSfxEnabled(false);
    expect(isSfxEnabled()).toBe(false);
    // Still defensive — never throws.
    expect(() => playSfx('tick')).not.toThrow();
    setSfxEnabled(true);
    expect(isSfxEnabled()).toBe(true);
  });

  it('handles missing window gracefully', async () => {
    const { playSfx } = await import('./sfx');
    expect(() => playSfx('all-clear')).not.toThrow();
  });
});
