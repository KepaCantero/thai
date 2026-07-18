// Spike 2: typed store instances for each known localStorage key.
//
// One export per legacy key. Values are typed to match the data the legacy
// code reads/writes. Schemas that are versioned (thai_srs_state) or that we
// haven't fully modeled yet (SRS internals) are kept as opaque JSON — tight
// types arrive when the mode that owns them is migrated.

import type { Scope } from '../types';
import { defineNamespacedStore, defineStore } from './repository';

// --- app.js: difficult set -------------------------------------------------
export const difficultStore = defineStore<string[]>('thai_difficult', []);

// --- app.js: top-level scope ('lecciones' | 'top1000' | 'comprehensive') ---
export const scopeStore = defineStore<Scope>('thai_scope', 'lecciones');

// --- app.js: deleted Q&A ids ----------------------------------------------
export const deletedQaStore = defineStore<string[]>('thai_deleted_qa', []);

// --- app.js: pilot play counts per card id --------------------------------
export interface PilotPlayCount {
  q?: number;
  a?: number;
}
export const pilotPlaysStore = defineStore<Record<string, PilotPlayCount>>(
  'thai_pilot_plays_v1',
  {}
);

// --- alphabet-ui.js: alphabet mode (mnemonic vs visual) -------------------
export const alphaMnModeStore = defineStore<string>('thai_alpha_mn_mode', 'visual');

// --- audio.js: TTS engine selection + schema version ----------------------
export type TtsEngine = 'static' | 'kanya' | 'google';
export const ttsEngineStore = defineStore<TtsEngine>('ttsEngine', 'static');
export const ttsEngineVersionStore = defineStore<string>('ttsEngineVersion', '');

// --- srs.js: SRS state (opaque payload — versioned) -----------------------
export interface SrsStatePayload {
  v: number;
  decks: unknown;
}
export const srsStateStore = defineStore<SrsStatePayload>('thai_srs_state', {
  v: 0,
  decks: {},
});

// --- srs.js: SRS daily stats ----------------------------------------------
export interface SrsStats {
  today: string;
  learned: number;
  reviewed: number;
  timeSec: number;
  [key: string]: unknown;
}
export const srsStatsStore = defineStore<SrsStats>('thai_srs_stats', {
  today: '',
  learned: 0,
  reviewed: 0,
  timeSec: 0,
});

// --- app.js shadowing: per-conversation line timestamps -------------------
export const shTimesStore = defineNamespacedStore<number[]>('sh_times_', []);
