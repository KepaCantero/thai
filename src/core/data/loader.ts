// Lazy JSON loaders for the four data-as-JS files that previously loaded via
// synchronous <script> tags (data.js, top1000.js, top1000-segments.js,
// audio-manifest.js).
//
// Each loader:
//   - fetches the JSON once, then caches the parsed object;
//   - assigns the result to its corresponding `window.*` global(s) so legacy
//     classic scripts (public/app.js and friends) keep reading the same
//     object reference they always did;
//   - preserves object identity on subsequent calls (cache hit returns the
//     same reference), which is load-bearing for staticBackend.ts's
//     `m === cachedManifest` invalidation check.
//
// `loadAllData()` runs every loader in parallel. Once it resolves, the caller
// dispatches the 'thai-data-ready' event so the legacy DOMContentLoaded
// listener in public/app.js can fire.
//
// On failure, each loader throws — the boot wrapper in src/main.ts catches,
// logs, and dispatches 'thai-data-ready' anyway so the legacy UI can render
// its own degraded state instead of hanging forever.

import type {
  AudioManifest,
  DataShape,
  JanusPart,
  Top1000Category,
  Top1000PhraseSegmentMap,
  Top1000Word,
} from '../types';

// ---------------------------------------------------------------------------
// Types — bundle shapes
// ---------------------------------------------------------------------------

/** Shape of public/data/pronouns.json — `no_plural1` is precomputed at conversion. */
export interface PronounsBundle {
  all: JanusPart[];
  no_plural1: JanusPart[];
}

/**
 * Shape of public/data/top1000.json.
 *
 * `structures` and `conversations` are loosely typed because the original
 * globals (`TOP1000_STRUCTURES`, `TOP1000_CONVERSATIONS`) don't have precise
 * domain types in src/core/types.ts yet. Tightening them is a separate
 * cleanup — see globals.d.ts which also leaves them as `unknown[]`.
 */
export interface Top1000StructureExample {
  thai: string;
  rtgs: string;
  spanish: string;
  english: string;
}

export interface Top1000Structure {
  id: number;
  name: string;
  category: string;
  importance: number;
  explanation: string;
  when: string;
  mistakes: string;
  colloquial?: string;
  examples: Top1000StructureExample[];
  [extra: string]: unknown;
}

export interface Top1000ConversationLine {
  thai: string;
  rtgs: string;
  spanish: string;
  english: string;
}

export interface Top1000Conversation {
  id: number;
  situation: string;
  difficulty: string;
  lines: Top1000ConversationLine[];
  [extra: string]: unknown;
}

export interface Top1000Bundle {
  words: Top1000Word[];
  categories: Top1000Category[];
  structureCategories: string[];
  situations: string[];
  structures: Top1000Structure[];
  phrases: unknown[];
  conversations: Top1000Conversation[];
}

// ---------------------------------------------------------------------------
// Cached singletons — module-private. Same reference returned on every call.
// ---------------------------------------------------------------------------

let appData: DataShape | undefined;
let pronouns: PronounsBundle | undefined;
let top1000: Top1000Bundle | undefined;
let top1000Segments: Top1000PhraseSegmentMap | undefined;
let audioManifest: AudioManifest | undefined;

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/** Fetch and install every data global. Idempotent; safe to call repeatedly. */
export async function loadAllData(): Promise<void> {
  await Promise.all([
    loadAppData(),
    loadPronouns(),
    loadTop1000(),
    loadTop1000Segments(),
    loadAudioManifest(),
  ]);
}

// ---------------------------------------------------------------------------
// Per-dataset loaders — each one assigns the corresponding window.* globals
// (multiple globals for the top1000 bundle) so legacy classic scripts see the
// same shape they always did.
// ---------------------------------------------------------------------------

async function loadAppData(): Promise<void> {
  if (appData) return;
  const r = await fetch('/data/app.json');
  if (!r.ok) throw new Error(`app.json HTTP ${r.status}`);
  appData = (await r.json()) as DataShape;
  // Preserve object identity: legacy code reads window.DATA.
  (window as unknown as { DATA: DataShape }).DATA = appData;
}

async function loadPronouns(): Promise<void> {
  if (pronouns) return;
  const r = await fetch('/data/pronouns.json');
  if (!r.ok) throw new Error(`pronouns.json HTTP ${r.status}`);
  pronouns = (await r.json()) as PronounsBundle;
  const w = window as unknown as {
    PRONOUNS: JanusPart[];
    PRONOUNS_NO_PLURAL1: JanusPart[];
  };
  // PRONOUNS_NO_PLURAL1 was previously a fresh array reference derived from
  // PRONOUNS via .filter(). We replace it with the precomputed bundle slice.
  // Any code that captured the old reference at module load has already
  // happened by the time this loader runs (legacy scripts load first), so we
  // must verify via grep that no consumer stashed it — they all read the
  // global lazily, which is what makes this safe.
  w.PRONOUNS = pronouns.all;
  w.PRONOUNS_NO_PLURAL1 = pronouns.no_plural1;
}

async function loadTop1000(): Promise<void> {
  if (top1000) return;
  const r = await fetch('/data/top1000.json');
  if (!r.ok) throw new Error(`top1000.json HTTP ${r.status}`);
  top1000 = (await r.json()) as Top1000Bundle;

  // Backward-compat shim: assign all 7 globals individually from the single
  // bundle so legacy consumers don't have to know about `TOP1000.words`.
  const w = window as unknown as {
    TOP1000_WORDS: Top1000Word[];
    TOP1000_CATEGORIES: Top1000Category[];
    TOP1000_STRUCTURE_CATEGORIES: string[];
    TOP1000_SITUATIONS: string[];
    TOP1000_STRUCTURES: Top1000Structure[];
    TOP1000_PHRASES: unknown[];
    TOP1000_CONVERSATIONS: Top1000Conversation[];
  };
  w.TOP1000_WORDS = top1000.words;
  w.TOP1000_CATEGORIES = top1000.categories;
  w.TOP1000_STRUCTURE_CATEGORIES = top1000.structureCategories;
  w.TOP1000_SITUATIONS = top1000.situations;
  w.TOP1000_STRUCTURES = top1000.structures;
  w.TOP1000_PHRASES = top1000.phrases;
  w.TOP1000_CONVERSATIONS = top1000.conversations;
}

async function loadTop1000Segments(): Promise<void> {
  if (top1000Segments) return;
  const r = await fetch('/data/top1000-segments.json');
  if (!r.ok) throw new Error(`top1000-segments.json HTTP ${r.status}`);
  top1000Segments = (await r.json()) as Top1000PhraseSegmentMap;
  (window as unknown as { TOP1000_PHRASE_SEGMENTS: Top1000PhraseSegmentMap }).TOP1000_PHRASE_SEGMENTS =
    top1000Segments;
}

async function loadAudioManifest(): Promise<void> {
  if (audioManifest) return;
  const r = await fetch('/data/audio-manifest.json');
  if (!r.ok) throw new Error(`audio-manifest.json HTTP ${r.status}`);
  audioManifest = (await r.json()) as AudioManifest;
  // Critical: staticBackend.ts:29-35 invalidates its key-set cache when the
  // manifest identity changes. By caching the manifest object in this module
  // and assigning the same reference every call, we guarantee the identity
  // check stays stable across re-boots within a single page session.
  (window as unknown as { AUDIO_MANIFEST: AudioManifest }).AUDIO_MANIFEST = audioManifest;
}

// ---------------------------------------------------------------------------
// Test/debug accessors — not used by production code. Lets unit tests
// (or a future typed consumer) read the loaded data without going through
// window.*.
// ---------------------------------------------------------------------------

export function getAppData(): DataShape | undefined { return appData; }
export function getPronouns(): PronounsBundle | undefined { return pronouns; }
export function getTop1000(): Top1000Bundle | undefined { return top1000; }
export function getTop1000Segments(): Top1000PhraseSegmentMap | undefined { return top1000Segments; }
export function getAudioManifest(): AudioManifest | undefined { return audioManifest; }
