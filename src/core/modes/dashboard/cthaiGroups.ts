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
  /** Char length of the Thai answer text — proxy for answer complexity. */
  aThaiLength(item: Card): number;
  /** Count of unique Thai chars across Q+A — proxy for lexical variety
   *  (Thai isn't whitespace-tokenized, so char-level is the honest signal). */
  uniqueCharCount(item: Card): number;
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

export type CthaiLevel = 'N0' | 'A1' | 'A2' | 'B1' | 'B2';

export const CTHAI_LEVELS: readonly CthaiLevel[] = ['N0', 'A1', 'A2', 'B1', 'B2'] as const;

export interface CthaiLevelMeta {
  level: CthaiLevel;
  label: string;
  hint: string;
}

export const CTHAI_LEVEL_META: Record<CthaiLevel, CthaiLevelMeta> = {
  N0: { level: 'N0', label: 'Nivel 0 · Absoluto', hint: 'Palabras más frecuentes, respuestas de una sola palabra o sílaba' },
  A1: { level: 'A1', label: 'A1 · Principiante', hint: 'Palabras frecuentes, frases cortas' },
  A2: { level: 'A2', label: 'A2 · Básico', hint: 'Vocabulario común' },
  B1: { level: 'B1', label: 'B1 · Intermedio', hint: 'Frases más largas' },
  B2: { level: 'B2', label: 'B2 · Avanzado', hint: 'Vocabulario raro y marcadores formales' },
};

export interface CthaiLevelGroup {
  level: CthaiLevel;
  sources: CthaiSourceGroup[];
}

import { N0_SOURCES } from './n0_sources';

// ---------------------------------------------------------------------------
// Multi-factor difficulty scoring for the non-N0 buckets. freqRank alone
// ranked very different sources as similar; bringing in a_thai length
// (longer answers = harder) and unique-char density (lexically varied =
// harder) separates true beginner clips from advanced ones. N0 itself is
// curated externally — see n0_sources.ts.
// ---------------------------------------------------------------------------

export interface SourceDifficulty {
  source: string;
  /** Weighted normalized score in [0, 1] — lower = easier. */
  score: number;
  /** Raw avg freqRank, kept for the N0 floor check. */
  avgFreq: number;
  /** Raw avg a_thai length, kept for the N0 floor check. */
  avgLen: number;
}

/**
 * Compute per-source difficulty scores. Each of the three factors is
 * min-max normalized across all sources to [0, 1] before weighting, so no
 * single factor dominates due to scale. Weights: 0.40 freq, 0.40 len, 0.20
 * unique. Returns scores in arbitrary order; callers sort as needed.
 */
export function computeSourceDifficulty(
  groups: CthaiSourceGroup[],
  deps: CthaiGroupingDeps,
): SourceDifficulty[] {
  const raws = groups.map((g) => {
    const n = g.cards.length || 1;
    const avgFreq = g.cards.reduce((s, r) => s + deps.freqRank(r.item), 0) / n;
    const avgLen = g.cards.reduce((s, r) => s + deps.aThaiLength(r.item), 0) / n;
    const avgUnique =
      g.cards.reduce((s, r) => s + deps.uniqueCharCount(r.item), 0) / n;
    return { source: g.source, avgFreq, avgLen, avgUnique };
  });

  const minMax = (vals: number[]) =>
    [Math.min(...vals), Math.max(...vals)] as const;
  const [minFreq, maxFreq] = minMax(raws.map((r) => r.avgFreq));
  const [minLen, maxLen] = minMax(raws.map((r) => r.avgLen));
  const [minUni, maxUni] = minMax(raws.map((r) => r.avgUnique));
  const norm = (v: number, lo: number, hi: number) =>
    hi === lo ? 0 : (v - lo) / (hi - lo);

  return raws.map((r) => ({
    source: r.source,
    avgFreq: r.avgFreq,
    avgLen: r.avgLen,
    score:
      0.4 * norm(r.avgFreq, minFreq, maxFreq) +
      0.4 * norm(r.avgLen, minLen, maxLen) +
      0.2 * norm(r.avgUnique, minUni, maxUni),
  }));
}

/**
 * Count unique Thai chars across Q + A, ignoring ASCII whitespace. Thai
 * isn't whitespace-tokenized, so char-level variety is the honest lexical
 * signal we have without a segmenter. Used as the third difficulty factor.
 */
/**
 * Count unique Thai characters across Q + A, ignoring ASCII whitespace.
 * Thai isn't whitespace-tokenized, so char-level variety is the honest
 * lexical signal we have without a segmenter. Used as the third difficulty
 * factor — denser cards have more distinct characters to learn.
 */
export function countUniqueThaiChars(q?: string, a?: string): number {
  const text = (q ?? '') + (a ?? '');
  const stripped = text.replace(/\s+/g, '');
  return new Set(stripped).size;
}

export function bucketSourcesByLevel(
  groups: CthaiSourceGroup[],
  deps: CthaiGroupingDeps,
): CthaiLevelGroup[] {
  if (!groups.length) {
    return CTHAI_LEVELS.map((level) => ({ level, sources: [] }));
  }

  const forcedN0 = groups.filter((g) => N0_SOURCES.has(g.source));
  const rest = groups.filter((g) => !N0_SOURCES.has(g.source));

  if (!rest.length) {
    return [
      { level: 'N0', sources: forcedN0 },
      { level: 'A1', sources: [] },
      { level: 'A2', sources: [] },
      { level: 'B1', sources: [] },
      { level: 'B2', sources: [] },
    ];
  }

  const scores = computeSourceDifficulty(rest, deps);
  const bySource = new Map(scores.map((s) => [s.source, s]));
  const sorted = [...rest].sort(
    (a, b) => bySource.get(a.source)!.score - bySource.get(b.source)!.score,
  );

  const n = sorted.length;
  const q = Math.max(1, Math.floor(n / 4));
  const a1 = sorted.slice(0, q);
  const a2 = sorted.slice(q, 2 * q);
  const b1 = sorted.slice(2 * q, 3 * q);
  const b2 = sorted.slice(3 * q);

  return [
    { level: 'N0', sources: forcedN0 },
    { level: 'A1', sources: a1 },
    { level: 'A2', sources: a2 },
    { level: 'B1', sources: b1 },
    { level: 'B2', sources: b2 },
  ];
}/** "cthai:foo_bar_baz" → "Foo Bar Baz". Non-destructive on unknown shapes. */
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
