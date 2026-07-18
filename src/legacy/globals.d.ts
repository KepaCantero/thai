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
  Category,
  DataShape,
  English,
  JanusPart,
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
}

// Empty export to make this file a module (required for `declare global`).
export {};
