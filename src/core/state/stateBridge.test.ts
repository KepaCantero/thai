// Integration tests for the state bridge. Each test creates a fresh fake
// window-like object, installs the bridge, and asserts that the descriptors
// read/write through to the typed state.

import { describe, expect, it } from 'vitest';

import type { Card } from '../types';
import * as deck from './deck';
import * as filters from './filters';
import * as mode from './mode';
import * as playback from './playback';
import { installStateBridge } from './stateBridge';

interface FakeWindow {
  currentMode?: string;
  filterPanelOpen?: boolean;
  deck?: unknown[];
  idx?: number;
  activeLesson?: string;
  activeCategory?: string;
  activeType?: string;
  searchQuery?: string;
  activeScope?: string;
  running?: boolean;
  paused?: boolean;
  playTimeout?: number | null;
  playResumeFn?: (() => void) | null;
  known?: Set<string>;
  unknown?: Set<string>;
  difficult?: Set<string>;
}

function fakeWindow(initial: FakeWindow = {}): Window & typeof globalThis {
  // Minimal stub: the bridge only reads/writes own properties and installs
  // descriptors. We don't need the full Window surface.
  const w = { ...initial } as unknown as Window & typeof globalThis;
  return w;
}

describe('installStateBridge', () => {
  it('seeds currentMode from the existing window value', () => {
    const before = mode.getMode();
    const w = fakeWindow({ currentMode: 'tones' });
    installStateBridge(w);
    expect(mode.getMode()).toBe('tones');
    mode.setMode(before);
  });

  it('mirrors window.deck reads through to deck.getDeck()', () => {
    const before = deck.getDeck();
    const w = fakeWindow({ deck: [] });
    installStateBridge(w);
    const next: Card[] = [
      { type: 'word', thai: 'x' as never },
      { type: 'word', thai: 'y' as never },
    ];
    w.deck = next;
    expect(deck.getDeck()).toBe(next);
    deck.setDeck(before);
  });

  it('mirrors window.idx writes through to deck.setIdx()', () => {
    const before = deck.getIdx();
    const w = fakeWindow({ idx: 0 });
    installStateBridge(w);
    w.idx = 7;
    expect(deck.getIdx()).toBe(7);
    deck.setIdx(before);
  });

  it('mirrors window.searchQuery', () => {
    const before = filters.getSearchQuery();
    const w = fakeWindow({ searchQuery: '' });
    installStateBridge(w);
    w.searchQuery = 'hello';
    expect(filters.getSearchQuery()).toBe('hello');
    filters.setSearchQuery(before);
  });

  it('mirrors window.playTimeout including null', () => {
    const before = playback.getPlayTimeout();
    const w = fakeWindow({ playTimeout: null });
    installStateBridge(w);
    w.playTimeout = 99;
    expect(playback.getPlayTimeout()).toBe(99);
    w.playTimeout = null;
    expect(playback.getPlayTimeout()).toBeNull();
    playback.setPlayTimeout(before);
  });

  it('mirrors window.filterPanelOpen', () => {
    const before = mode.isFilterPanelOpen();
    const w = fakeWindow({ filterPanelOpen: false });
    installStateBridge(w);
    w.filterPanelOpen = true;
    expect(mode.isFilterPanelOpen()).toBe(true);
    w.filterPanelOpen = false;
    expect(mode.isFilterPanelOpen()).toBe(false);
    mode.setFilterPanelOpen(before);
  });

  it('mirrors window.running and window.paused', () => {
    const beforeR = playback.isRunning();
    const beforeP = playback.isPaused();
    const w = fakeWindow({ running: false, paused: false });
    installStateBridge(w);
    w.running = true;
    w.paused = true;
    expect(playback.isRunning()).toBe(true);
    expect(playback.isPaused()).toBe(true);
    playback.setRunning(beforeR);
    playback.setPaused(beforeP);
  });

  it('reads the same value back through the descriptor (identity for deck)', () => {
    const before = deck.getDeck();
    const w = fakeWindow({ deck: [] });
    installStateBridge(w);
    const arr: Card[] = [];
    w.deck = arr;
    expect(w.deck).toBe(arr);
    expect(w.deck).toBe(deck.getDeck());
    deck.setDeck(before);
  });

  it('seeds known/unknown Sets from the existing window values', () => {
    const w = fakeWindow({
      known: new Set(['seeded']),
      unknown: new Set(['unseeded']),
    });
    installStateBridge(w);
    expect((w.known as Set<string>).has('seeded')).toBe(true);
    // marking known again is idempotent
    expect((w.known as Set<string>).has('unseeded')).toBe(false);
  });
});
