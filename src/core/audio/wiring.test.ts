// Tests for the audio wiring layer (item text extraction + speakText smoke).

import { describe, expect, it, vi } from 'vitest';
import { createAudioWiring } from './wiring';
import { getAudioText } from './item';
import type { AudioBackend } from './types';

function makeBackend(accepted: boolean): AudioBackend & { speakMock: ReturnType<typeof vi.fn> } {
  const speakMock = vi.fn((_: string, onDone?: () => void) => {
    if (accepted) {
      if (onDone) onDone();
      return true;
    }
    return false;
  });
  return { speak: speakMock, stop: vi.fn(), speakMock };
}

function makeStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
}

describe('getAudioText', () => {
  it('returns item.thai for a plain word', () => {
    expect(getAudioText({ type: 'word', thai: 'สวัสดี' })).toBe('สวัสดี');
  });

  it('returns item.thai for a phrase (no explicit type)', () => {
    expect(getAudioText({ thai: 'กระจายเสียง' })).toBe('กระจายเสียง');
  });

  it('joins conversation q/a with " ... "', () => {
    const t = getAudioText({ type: 'conversation', q_thai: 'กินข้าว', a_thai: 'กินแล้ว' });
    expect(t).toBe('กินข้าว ... กินแล้ว');
  });

  it('joins pair w1/w2 with " ... "', () => {
    const t = getAudioText({
      type: 'pair',
      w1: { thai: 'รถ' },
      w2: { thai: 'รถไฟ' },
    });
    expect(t).toBe('รถ ... รถไฟ');
  });

  it('returns empty string for falsy item', () => {
    expect(getAudioText(null as unknown as never)).toBe('');
  });
});

describe('createAudioWiring', () => {
  it('speakText dispatches to the gateway with a default onDone', () => {
    const staticB = makeBackend(true);
    const wiring = createAudioWiring({
      storage: makeStorage({ ttsEngine: 'static', ttsEngineVersion: '2' }),
      backends: { static: staticB, kanya: makeBackend(true), google: makeBackend(true) },
    });
    wiring.speakText('hello');
    expect(staticB.speakMock).toHaveBeenCalledWith('hello', expect.any(Function));
  });

  it('playAudioItem extracts text, stops, then speaks', () => {
    const staticB = makeBackend(true);
    const stopSpy = vi.fn();
    const wiring = createAudioWiring({
      storage: makeStorage({ ttsEngine: 'static', ttsEngineVersion: '2' }),
      backends: {
        static: { ...staticB, stop: stopSpy },
        kanya: makeBackend(true),
        google: makeBackend(true),
      },
    });
    const done = vi.fn();
    wiring.playAudioItem({ type: 'conversation', q_thai: 'q', a_thai: 'a' }, done);
    expect(stopSpy).toHaveBeenCalled();
    expect(staticB.speakMock).toHaveBeenCalledWith('q ... a', done);
  });

  it('setTtsEngine forwards to the gateway', () => {
    const wiring = createAudioWiring({
      storage: makeStorage({ ttsEngine: 'static', ttsEngineVersion: '2' }),
      backends: { static: makeBackend(true), kanya: makeBackend(true), google: makeBackend(true) },
    });
    wiring.setTtsEngine('google');
    expect(wiring.gateway.getEngine()).toBe('google');
  });
});
