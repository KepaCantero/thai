import { describe, expect, it } from 'vitest';

import type { Card } from '../types';
import {
  currentCard,
  getDeck,
  getIdx,
  next,
  prev,
  setDeck,
  setIdx,
} from './deck';

function makeCard(t: string): Card {
  return { type: 'word', thai: t as never };
}

describe('deck state', () => {
  it('setDeck/getDeck preserve reference identity', () => {
    const d = [makeCard('a'), makeCard('b')];
    setDeck(d);
    expect(getDeck()).toBe(d);
  });

  it('setIdx/getIdx round-trip', () => {
    setIdx(3);
    expect(getIdx()).toBe(3);
    setIdx(0);
    expect(getIdx()).toBe(0);
  });

  it('next increments and prev decrements', () => {
    setIdx(5);
    next();
    expect(getIdx()).toBe(6);
    prev();
    expect(getIdx()).toBe(5);
    prev();
    expect(getIdx()).toBe(4);
  });

  it('currentCard returns the card at idx', () => {
    const d = [makeCard('a'), makeCard('b'), makeCard('c')];
    setDeck(d);
    setIdx(1);
    expect(currentCard()).toBe(d[1]);
    setIdx(2);
    expect(currentCard()).toBe(d[2]);
  });

  it('currentCard returns undefined when idx is past the end', () => {
    setDeck([makeCard('only')]);
    setIdx(1);
    expect(currentCard()).toBeUndefined();
    setIdx(99);
    expect(currentCard()).toBeUndefined();
  });

  it('currentCard returns undefined when idx is negative', () => {
    setDeck([makeCard('only')]);
    setIdx(-1);
    expect(currentCard()).toBeUndefined();
  });

  it('currentCard returns undefined on an empty deck', () => {
    setDeck([]);
    setIdx(0);
    expect(currentCard()).toBeUndefined();
  });
});
