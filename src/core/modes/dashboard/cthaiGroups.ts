// CT dashboard grouping + tile rendering — pure helpers.
//
// Extracted from dashboard/module.ts so the grouping logic is testable
// without booting the whole module, and so renderCthaiGroups in module.ts
// becomes a thin orchestrator that picks a level (overview / category /
// source) and delegates here.
//
// SRP: this file owns (a) how CT cards are bucketed into groups and
// (b) how a group becomes a tile's HTML. It does not own the drill-down
// state machine — that lives in module.ts.

import type { Card } from '../../types';

/** A card plus its original deck index (so dash-card click handlers work). */
export interface CthaiCardRef {
  item: Card;
  idx: number;
}

/** Cards bucketed by `category` (numeros / sustantivos / …). */
export interface CthaiCategoryGroup {
  name: string;
  cards: CthaiCardRef[];
  freqSum: number;
  done: number;
}

/** Cards bucketed by `source` (one transcript per source). */
export interface CthaiSourceGroup {
  source: string;
  label: string;
  cards: CthaiCardRef[];
  done: number;
}

/** Injected per-card queries — supplied by the dashboard module. */
export interface CthaiGroupingDeps {
  isDone(item: Card): boolean;
  freqRank(item: Card): number;
}

/** Fallback for cards without an explicit category. */
export const CTHAI_FALLBACK_CATEGORY = 'otros';

/**
 * Bucket CT cards by their `category` field. Within a category, preserve
 * insertion order (the order cards appeared in the deck). Also accumulate
 * the sum of frequency ranks so callers can compute the per-category
 * average to sort "easiest → hardest".
 */
export function groupCthaiByCategory(
  cards: Card[],
  deps: CthaiGroupingDeps,
): CthaiCategoryGroup[] {
  const order: string[] = [];
  const byCat: Record<string, CthaiCardRef[]> = {};
  const freqSum: Record<string, number> = {};

  cards.forEach((item, idx) => {
    const cat = getCategory(item) || CTHAI_FALLBACK_CATEGORY;
    if (!byCat[cat]) {
      byCat[cat] = [];
      freqSum[cat] = 0;
      order.push(cat);
    }
    byCat[cat].push({ item, idx });
    freqSum[cat] += deps.freqRank(item);
  });

  return order.map((name) => {
    const groupCards = byCat[name];
    const done = groupCards.reduce(
      (acc, ref) => acc + (deps.isDone(ref.item) ? 1 : 0),
      0,
    );
    return { name, cards: groupCards, freqSum: freqSum[name], done };
  });
}

/**
 * Bucket CT cards by their `source` (one transcript = one group).
 * Sources are not sorted here — the caller decides the order (typically
 * easiest → hardest by avg freqRank, same rule as categories).
 */
export function groupCthaiBySource(
  cards: Card[],
  deps: CthaiGroupingDeps,
): CthaiSourceGroup[] {
  const order: string[] = [];
  const bySrc: Record<string, CthaiCardRef[]> = {};

  cards.forEach((item, idx) => {
    const src = getSource(item);
    if (!src) return;
    if (!bySrc[src]) {
      bySrc[src] = [];
      order.push(src);
    }
    bySrc[src].push({ item, idx });
  });

  return order.map((source) => {
    const groupCards = bySrc[source];
    const done = groupCards.reduce(
      (acc, ref) => acc + (deps.isDone(ref.item) ? 1 : 0),
      0,
    );
    return { source, label: cthaiSourceLabel(source), cards: groupCards, done };
  });
}

/** Average freqRank for a group; high numbers (rare words) sort last. */
export function avgFreqRank(
  group: Pick<CthaiCategoryGroup, 'cards' | 'freqSum'>,
): number {
  return group.cards.length ? group.freqSum / group.cards.length : 9999;
}

/** Sort groups easiest → hardest. Returns a new array; input is not mutated. */
export function sortByEasiestFirst(groups: CthaiCategoryGroup[]): CthaiCategoryGroup[] {
  return [...groups].sort((a, b) => avgFreqRank(a) - avgFreqRank(b));
}

/** Same idea but for source groups — needs its own helper since sources
 *  don't carry a freqSum on the group object. */
export function sortSourcesByEasiestFirst(
  groups: CthaiSourceGroup[],
  freqRank: (item: Card) => number,
): CthaiSourceGroup[] {
  const avg = (g: CthaiSourceGroup): number => {
    if (!g.cards.length) return 9999;
    const sum = g.cards.reduce((acc, ref) => acc + freqRank(ref.item), 0);
    return sum / g.cards.length;
  };
  return [...groups].sort((a, b) => avg(a) - avg(b));
}

/** "cthai:foo_bar_baz" → "Foo Bar Baz". Non-destructive on unknown shapes. */
export function cthaiSourceLabel(src: string): string {
  return src
    .replace(/^cthai:/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Escape single quotes so the tile's onclick="setCthaiGroup('...')" is safe. */
export function escapeAttr(value: string): string {
  return value.replace(/'/g, "\\'");
}

// ---------------------------------------------------------------------------
// Rendering — pure string builders. The orchestrator in module.ts owns the
// surrounding markup (progress bar, back button) and the click-handler names.
// ---------------------------------------------------------------------------

const HUE_STRIDE = 47;

function accentVars(index: number): string {
  const hue = (index * HUE_STRIDE) % 360;
  return (
    '--accent:hsl(' + hue + ', 65%, 55%);' +
    '--accent-soft:hsl(' + hue + ', 65%, 22%)'
  );
}

export function renderProgress(
  totalDone: number,
  total: number,
  threshold: number,
): string {
  const pct = total ? Math.round((100 * totalDone) / total) : 0;
  return (
    '<div class="cthai-progress">' +
    '<div class="cthai-progress-text"><b>' +
    totalDone +
    '/' +
    total +
    '</b> cards completed ' +
    '<span class="cthai-progress-sub">(≥' +
    threshold +
    ' Q and ≥' +
    threshold +
    ' A)</span></div>' +
    '<div class="cthai-progress-bar"><div style="width:' +
    pct +
    '%"></div></div>' +
    '</div>'
  );
}

export function renderCategoryTile(group: CthaiCategoryGroup, index: number): string {
  const total = group.cards.length;
  const done = group.done;
  const complete = total > 0 && done === total;
  const pct = total ? Math.round((100 * done) / total) : 0;
  return (
    '<div class="cthai-group-tile' +
    (complete ? ' cthai-group-done' : '') +
    '" style="' +
    accentVars(index) +
    '"' +
    ' onclick="setCthaiGroup(\'' +
    escapeAttr(group.name) +
    '\')">' +
    '<div class="cthai-group-tile-title">' +
    group.name +
    '</div>' +
    '<div class="cthai-group-tile-count">' +
    done +
    '/' +
    total +
    '</div>' +
    '<div class="cthai-group-tile-bar"><div style="width:' +
    pct +
    '%"></div></div>' +
    '</div>'
  );
}

export function renderSourceTile(group: CthaiSourceGroup, index: number): string {
  const total = group.cards.length;
  const done = group.done;
  const complete = total > 0 && done === total;
  const pct = total ? Math.round((100 * done) / total) : 0;
  return (
    '<div class="cthai-group-tile cthai-source-tile' +
    (complete ? ' cthai-group-done' : '') +
    '" style="' +
    accentVars(index) +
    '"' +
    ' onclick="setCthaiSource(\'' +
    escapeAttr(group.source) +
    '\')">' +
    '<div class="cthai-group-tile-title">' +
    group.label +
    '</div>' +
    '<div class="cthai-group-tile-count">' +
    done +
    '/' +
    total +
    '</div>' +
    '<div class="cthai-group-tile-bar"><div style="width:' +
    pct +
    '%"></div></div>' +
    '</div>'
  );
}

/** Grid wrapper for category overview. */
export function wrapCategoryTiles(tiles: string[]): string {
  return '<div class="cthai-groups-grid">' + tiles.join('') + '</div>';
}

/** Grid wrapper for source drill-down. */
export function wrapSourceTiles(tiles: string[]): string {
  return '<div class="cthai-sources-grid">' + tiles.join('') + '</div>';
}

// ---------------------------------------------------------------------------
// Field accessors — tiny helpers so the rest of the file doesn't reach into
// `as unknown as { ... }` casts inline. CT cards are Conversations in
// practice, but the dashboard also feeds Word/Phrase objects through here
// when a non-CT deck slips in (defensive).
// ---------------------------------------------------------------------------

function getCategory(item: Card): string | undefined {
  return (item as unknown as { category?: string }).category;
}

function getSource(item: Card): string | undefined {
  return (item as unknown as { source?: string }).source;
}
