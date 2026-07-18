import { describe, expect, it } from 'vitest';

import {
  getPlayResumeFn,
  getPlayTimeout,
  isPaused,
  isRunning,
  setPaused,
  setPlayResumeFn,
  setPlayTimeout,
  setRunning,
} from './playback';

describe('playback state', () => {
  it('running round-trips', () => {
    setRunning(true);
    expect(isRunning()).toBe(true);
    setRunning(false);
    expect(isRunning()).toBe(false);
  });

  it('paused round-trips', () => {
    setPaused(true);
    expect(isPaused()).toBe(true);
    setPaused(false);
    expect(isPaused()).toBe(false);
  });

  it('playTimeout round-trips and accepts null', () => {
    setPlayTimeout(42);
    expect(getPlayTimeout()).toBe(42);
    setPlayTimeout(null);
    expect(getPlayTimeout()).toBeNull();
  });

  it('playResumeFn round-trips and accepts null', () => {
    const fn = () => {};
    setPlayResumeFn(fn);
    expect(getPlayResumeFn()).toBe(fn);
    setPlayResumeFn(null);
    expect(getPlayResumeFn()).toBeNull();
  });
});
