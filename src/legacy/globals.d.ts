// Spike 1: ambient declarations for legacy global scripts.
//
// The legacy files (public/data.js, public/top1000*.js, public/shadowing.js,
// public/audio-manifest.js, public/config.js) attach objects to `window` via
// top-level `var`. TS doesn't know about them — this file teaches TS.
//
// This file is a module (because it has a top-level import) and augments the
// global scope via `declare global`. Once a dataset is migrated to JSON + a
// typed loader, remove its declaration here and import it explicitly instead.

import type {
  AudioManifest,
  Card,
  Category,
  DataShape,
  English,
  JanusPart,
  ModeKey,
  Scope,
  ShadowingConversation,
  Top1000Category,
  Top1000PhraseSegmentMap,
  Top1000Word,
  ToneKey,
  ToneMap,
} from '../core/types';

declare global {
  // --- public/data.js ---
  const PRONOUNS: JanusPart[];
  const PRONOUNS_NO_PLURAL1: JanusPart[];
  const DATA: DataShape;

  // --- public/config.js ---
  const TONES: ToneMap;
  const CAT_LABELS: Record<Category, string>;
  const THAI_EN: Record<string, English>;
  const PHRASE_EN: Record<string, English>;
  const CONV_EN: Record<string, { q: string; a: string }>;

  function $<T extends HTMLElement = HTMLElement>(id: string): T | null;

  function getEn(item: {
    type?: string;
    thai?: string;
    q_thai?: string;
    q_spanish?: string;
    spanish?: string;
    w1?: { thai: string };
    w2?: { thai: string };
  }): string;

  function renderTone(toneStr: string | undefined, highlight?: ToneKey): string;

  // --- public/top1000.js + public/top1000-segments.js ---
  const TOP1000_WORDS: Top1000Word[];
  const TOP1000_CATEGORIES: Top1000Category[];
  const TOP1000_STRUCTURE_CATEGORIES: string[];
  const TOP1000_SITUATIONS: string[];
  const TOP1000_STRUCTURES: unknown[];
  const TOP1000_PHRASE_SEGMENTS: Top1000PhraseSegmentMap;

  // --- public/shadowing.js ---
  const SHADOWING: ShadowingConversation[];

  // --- public/audio-manifest.js ---
  const AUDIO_MANIFEST: AudioManifest;

  // --- Phase 2 state bridge (src/core/state/*) -----------------------------
  // These top-level `var` declarations in public/app.js are mirrored onto
  // window via installStateBridge(). They are typed here so TS files that
  // still reference the legacy globals compile. New code should prefer the
  // typed getters/setters from src/core/state.
  const currentMode: ModeKey;
  var filterPanelOpen: boolean;
  var deck: Card[];
  var idx: number;
  var activeLesson: string;
  var activeCategory: string;
  var activeType: 'all' | 'word' | 'phrase' | 'conversation';
  var searchQuery: string;
  var activeScope: Scope;
  var running: boolean;
  var paused: boolean;
  var playTimeout: number | null;
  var playResumeFn: (() => void) | null;
  var known: Set<string>;
  var unknown: Set<string>;
  var difficult: Set<string>;
}

// Empty export to make this file a module (required for `declare global`).
export {};
