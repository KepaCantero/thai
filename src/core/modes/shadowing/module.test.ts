// Spike 5g: smoke tests for the ShadowingModule factory.
//
// Behavior parity with public/app.js L1409-1688 is verified through the
// key state transitions rather than full DOM rendering (which is covered
// visually by the legacy surface that this module overrides).

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createShadowingModule } from './module';
import type { ShadowingModuleDeps, ShadowingDom } from './module';
import type { ShadowingConversation } from '../../types';

const CONVS: ShadowingConversation[] = [
  {
    id: 'rest',
    title: 'Restaurant',
    titleTh: 'ร้านอาหาร',
    description: 'Ordering food',
    level: 'beginner',
    lesson: 1,
    audio: '',
    lines: [
      { speaker: 'A', speakerLabel: 'Waiter', thai: 'สวัสดี', es: 'sa-uat-di', english: 'Hello', spanish: 'Hola', t: 0 } as any,
      { speaker: 'B', speakerLabel: 'You', thai: 'ผมเอา', es: 'pom ao', english: "I'll take", spanish: 'Quiero', t: 0 } as any,
    ],
  },
];

function makeDoms(): {
  dom: ShadowingDom;
  calls: { listHtml: string; playerHtml: string };
} {
  const calls = { listHtml: '', playerHtml: '' };
  return {
    calls,
    dom: {
      setListHtml: (h: string) => {
        calls.listHtml = h;
      },
      showListView: () => {},
      showPlayerView: () => {},
      hidePlayerView: () => {},
      setPlayerHtml: (h: string) => {
        calls.playerHtml = h;
      },
      getAudio: () => null,
      queryLines: () => [],
      getById: () => null,
      querySelector: () => null,
    },
  };
}

function makeDeps(dom: ShadowingDom): ShadowingModuleDeps {
  return {
    shadowing: () => CONVS,
    speakText: () => {},
    stopCurrentAudio: () => {},
    renderTone: (t) => t || '',
    dom,
  };
}

describe('ShadowingModule', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the list with one card per conversation', () => {
    const { dom, calls } = makeDoms();
    const mod = createShadowingModule(makeDeps(dom));
    mod.renderShadowingList();
    expect(calls.listHtml).toContain('Restaurant');
    expect(calls.listHtml).toContain('openShadowing(\'rest\')');
  });

  it('opening a conversation renders its player body', () => {
    const { dom, calls } = makeDoms();
    const mod = createShadowingModule(makeDeps(dom));
    mod.openShadowing('rest');
    expect(calls.playerHtml).toContain('Ordering food');
    expect(calls.playerHtml).toContain('sh-speaker');
  });

  it('isShPlaying toggles with start/stop on the TTS path', () => {
    const { dom } = makeDoms();
    const deps = makeDeps(dom);
    const spoken: string[] = [];
    deps.speakText = (text: string, onDone?: () => void) => {
      spoken.push(text);
      if (onDone) onDone();
    };
    const mod = createShadowingModule(deps);
    mod.openShadowing('rest');
    mod.startShPlay(0);
    expect(mod.isShPlaying()).toBe(true);
    expect(spoken[0]).toBe('สวัสดี');
    // Auto-advance: the speakText onDone schedules a setTimeout, fire it.
    vi.runOnlyPendingTimers();
    expect(spoken[1]).toBe('ผมเอา');
    mod.stopShPlay();
    expect(mod.isShPlaying()).toBe(false);
  });

  it('cycleShSpeed rotates through 1 → 1.5 → 2 → 0.75 → 1', () => {
    const { dom } = makeDoms();
    const mod = createShadowingModule(makeDeps(dom));
    mod.openShadowing('rest');
    expect(mod.getShSpeed()).toBe(1);
    mod.cycleShSpeed();
    expect(mod.getShSpeed()).toBe(1.5);
    mod.cycleShSpeed();
    expect(mod.getShSpeed()).toBe(2);
    mod.cycleShSpeed();
    expect(mod.getShSpeed()).toBe(0.75);
    mod.cycleShSpeed();
    expect(mod.getShSpeed()).toBe(1);
  });

  it('exitShadowingPlayer clears the conversation and re-renders the list', () => {
    const { dom, calls } = makeDoms();
    const mod = createShadowingModule(makeDeps(dom));
    mod.openShadowing('rest');
    expect(mod.getShConvId()).toBe('rest');
    calls.listHtml = '';
    mod.exitShadowingPlayer();
    expect(mod.getShConvId()).toBeNull();
    expect(calls.listHtml).toContain('Restaurant');
  });
});

// vitest afterEach import
import { afterEach } from 'vitest';
