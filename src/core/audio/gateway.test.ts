// Spike 3: gateway tests. The backends are mocked — we verify dispatch,
// persistence, and fallback behavior. Backend-level browser interactions
// (Audio, speechSynthesis) are exercised via the dev server, not unit tests.

import { describe, expect, it, vi } from 'vitest';
import { createAudioGateway } from './gateway';
import type { AudioBackend } from './types';

function makeBackend(accepted: boolean): AudioBackend & { speakMock: ReturnType<typeof vi.fn>; stopMock: ReturnType<typeof vi.fn> } {
  const speakMock = vi.fn((_: string, onDone?: () => void) => {
    if (accepted) {
      if (onDone) onDone();
      return true;
    }
    return false;
  });
  const stopMock = vi.fn(() => {});
  return { speak: speakMock, stop: stopMock, speakMock, stopMock };
}

function makeMemoryStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
    _dump: () => Object.fromEntries(store),
  };
}

describe('createAudioGateway', () => {
  it('migrates to static on first run (version !== 2)', () => {
    const storage = makeMemoryStorage({ ttsEngine: 'kanya' });
    const gw = createAudioGateway({
      storage,
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    expect(gw.getEngine()).toBe('static');
    expect(storage._dump().ttsEngine).toBe('static');
    expect(storage._dump().ttsEngineVersion).toBe('2');
  });

  it('respects a previously saved engine once version=2 is set', () => {
    const storage = makeMemoryStorage({ ttsEngine: 'kanya', ttsEngineVersion: '2' });
    const gw = createAudioGateway({
      storage,
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    expect(gw.getEngine()).toBe('kanya');
  });

  it('falls back to default when saved engine is invalid', () => {
    const storage = makeMemoryStorage({ ttsEngine: 'banana', ttsEngineVersion: '2' });
    const gw = createAudioGateway({
      storage,
      defaultEngine: 'google',
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    expect(gw.getEngine()).toBe('google');
  });

  it('setEngine persists and notifies subscribers', () => {
    const storage = makeMemoryStorage({ ttsEngine: 'static', ttsEngineVersion: '2' });
    const gw = createAudioGateway({
      storage,
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    const cb = vi.fn();
    const unsub = gw.onEngineChange(cb);
    gw.setEngine('google');
    expect(cb).toHaveBeenCalledWith('google');
    expect(storage._dump().ttsEngine).toBe('google');
    unsub();
    gw.setEngine('kanya');
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('dispatches speak to the current engine', () => {
    const static_ = makeBackend(true);
    const gw = createAudioGateway({
      storage: makeMemoryStorage({ ttsEngine: 'static', ttsEngineVersion: '2' }),
      backends: { static: static_, kanya: makeBackend(true), google: makeBackend(true) },
    });
    const done = vi.fn();
    gw.speak('สวัสดี', done);
    expect(static_.speakMock).toHaveBeenCalledWith('สวัสดี', done);
  });

  it('falls through static → google when static returns false', () => {
    const static_ = makeBackend(false);
    const google = makeBackend(true);
    const gw = createAudioGateway({
      storage: makeMemoryStorage({ ttsEngine: 'static', ttsEngineVersion: '2' }),
      backends: { static: static_, kanya: makeBackend(true), google },
    });
    const done = vi.fn();
    gw.speak('ไม่มี', done);
    expect(static_.speakMock).toHaveBeenCalled();
    expect(google.speakMock).toHaveBeenCalledWith('ไม่มี', done);
  });

  it('falls through kanya → google when kanya returns false', () => {
    const kanya = makeBackend(false);
    const google = makeBackend(true);
    const gw = createAudioGateway({
      storage: makeMemoryStorage({ ttsEngine: 'kanya', ttsEngineVersion: '2' }),
      backends: { static: makeBackend(true), kanya, google },
    });
    gw.speak('หวัดดี');
    expect(kanya.speakMock).toHaveBeenCalled();
    expect(google.speakMock).toHaveBeenCalled();
  });

  it('never falls through when google is the current engine', () => {
    const google = makeBackend(true);
    const static_ = makeBackend(true);
    const gw = createAudioGateway({
      storage: makeMemoryStorage({ ttsEngine: 'google', ttsEngineVersion: '2' }),
      backends: { static: static_, kanya: makeBackend(true), google },
    });
    gw.speak('a');
    expect(google.speakMock).toHaveBeenCalled();
    expect(static_.speakMock).not.toHaveBeenCalled();
  });

  it('stop() calls stop on every backend', () => {
    const static_ = makeBackend(true);
    const kanya = makeBackend(true);
    const google = makeBackend(true);
    const gw = createAudioGateway({
      storage: makeMemoryStorage({ ttsEngineVersion: '2' }),
      backends: { static: static_, kanya, google },
    });
    gw.stop();
    expect(static_.stopMock).toHaveBeenCalled();
    expect(kanya.stopMock).toHaveBeenCalled();
    expect(google.stopMock).toHaveBeenCalled();
  });

  it('setEngine rejects invalid values silently', () => {
    const storage = makeMemoryStorage({ ttsEngine: 'static', ttsEngineVersion: '2' });
    const gw = createAudioGateway({
      storage,
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    // @ts-expect-error testing runtime guard
    gw.setEngine('banana');
    expect(gw.getEngine()).toBe('static');
    expect(storage._dump().ttsEngine).toBe('static');
  });
});
