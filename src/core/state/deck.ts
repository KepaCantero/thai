// Phase 2: externalize the active flashcard deck and cursor.
//
// app.js declares `var deck = [], idx = 0` at the top level. The bridge
// mirrors both so legacy mutations (deck = deck.filter(...), idx++) and
// typed mutations share state.

import type { Card } from '../types';

let deck: Card[] = [];
let idx = 0;

export function getDeck(): Card[] {
  return deck;
}

export function setDeck(d: Card[]): void {
  deck = d;
}

export function getIdx(): number {
  return idx;
}

export function setIdx(i: number): void {
  idx = i;
}

export function next(): void {
  idx++;
}

export function prev(): void {
  idx--;
}

export function currentCard(): Card | undefined {
  return deck[idx];
}
