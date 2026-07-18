// Phase 2: externalize filter state from public/app.js.
//
// app.js declares `var activeLesson = 'all', activeCategory = 'all',
// activeType = 'all', searchQuery = '';` and `var activeScope = 'lecciones'`.
//
// activeScope is special: it already has a typed persistence layer
// (scopeStore backed by the `thai_scope` localStorage key). We delegate
// getActiveScope/setActiveScope to that store rather than holding an
// in-memory copy, so the legacy `var activeScope` and the typed store stay
// consistent. The legacy bootstrap code reads localStorage on startup and
// assigns the result to `activeScope`; the bridge mirrors that assignment
// back into scopeStore on first install.

import type { Scope } from '../types';
import { scopeStore } from '../persistence/stores';

let activeLesson: string = 'all';
let activeCategory: string = 'all';
let activeType: 'all' | 'word' | 'phrase' | 'conversation' = 'all';
let searchQuery: string = '';

export function getActiveLesson(): string {
  return activeLesson;
}

export function setActiveLesson(l: string): void {
  activeLesson = l;
}

export function getActiveCategory(): string {
  return activeCategory;
}

export function setActiveCategory(c: string): void {
  activeCategory = c;
}

export function getActiveType(): 'all' | 'word' | 'phrase' | 'conversation' {
  return activeType;
}

export function setActiveType(t: 'all' | 'word' | 'phrase' | 'conversation'): void {
  activeType = t;
}

export function getSearchQuery(): string {
  return searchQuery;
}

export function setSearchQuery(q: string): void {
  searchQuery = q;
}

export function getActiveScope(): Scope {
  return scopeStore.get();
}

export function setActiveScope(s: Scope): void {
  scopeStore.set(s);
}
