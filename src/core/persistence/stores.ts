// Spike 2: typed store instances for each known localStorage key.
//
// One export per legacy key. Values are typed to match the data the legacy
// code reads/writes. Schemas that are versioned (thai_srs_state) or that we
// haven't fully modeled yet (SRS internals) are kept as opaque JSON — tight
// types arrive when the mode that owns them is migrated.

import type { PlayerState } from '../state/player';
import {
  freshDailyQuestsInitialState,
  type DailyQuestsState,
} from '../state/quests';
import {
  defaultTitlesInitialState,
  type TitlesState,
} from '../state/titles';
import type { Scope } from '../types';
import { defineNamespacedStore, defineStore } from './repository';

// --- app.js: difficult set -------------------------------------------------
export const difficultStore = defineStore<string[]>('thai_difficult', []);

// --- app.js: top-level scope ('lecciones' | 'top1000' | 'comprehensive') ---
// Legacy app.js reads/writes `thai_scope` as a RAW string (no JSON wrapping):
//   localStorage.setItem('thai_scope', scope);
//   activeScope = localStorage.getItem('thai_scope') || 'lecciones';
// Override the default JSON serialize/deserialize to match.
export const scopeStore = defineStore<Scope>('thai_scope', 'lecciones', {
  serialize: (v) => v,
  deserialize: (raw) => raw as Scope,
});

// --- app.js: deleted Q&A ids ----------------------------------------------
export const deletedQaStore = defineStore<string[]>('thai_deleted_qa', []);

// --- app.js: cthai play counts per card id --------------------------------
export interface CthaiPlayCount {
  q?: number;
  a?: number;
}
export const cthaiPlaysStore = defineStore<Record<string, CthaiPlayCount>>(
  'thai_cthai_plays_v1',
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

// --- Solo Leveling: player state + XP log ----------------------------------
//
// One store for the whole player record — atomic updates when XP, stats and
// streak all change in a single review event. Versioned (`v: 1`) so future
// schema changes can migrate in place without nuking the player's progress.
export interface PlayerStatePayload extends PlayerState {
  v: 1;
}

export const playerStore = defineStore<PlayerStatePayload>('thai_player_v1', {
  v: 1,
  rank: 'E',
  tier: 1,
  xp: 0,
  totalXp: 0,
  stats: {
    vocab: 0,
    grammar: 0,
    pronunciation: 0,
    listening: 0,
    reading: 0,
  },
  streak: 0,
  longestStreak: 0,
  lastActiveDate: '',
});

export interface XpLogEntry {
  ts: number; // Date.now() at award time
  amount: number; // XP awarded (always > 0)
  source: string; // game event type, e.g. 'srs:review' / 'card:known'
  stat?: string; // which stat also bumped (if any)
}

// Ring buffer capped at 200 entries — keeps the log useful for the Status
// Window "recent activity" feed without bloating localStorage.
export const xpLogStore = defineStore<XpLogEntry[]>('thai_xp_log_v1', []);

// --- Solo Leveling Phase 5: Daily Quests window ----------------------------
//
// Versioned (`v: 1`). The store ships with a placeholder initial state
// (`date: ''`) so the engine's first-boot rollover populates today's quests.
export const dailyQuestsStore = defineStore<DailyQuestsState>(
  'thai_daily_quests_v1',
  freshDailyQuestsInitialState(),
);

// --- Solo Leveling Phase 6: SFX enable/disable toggle -----------------------
export const sfxEnabledStore = defineStore<boolean>('thai_sfx_enabled_v1', true);

// --- Solo Leveling Phase 7: Titles -----------------------------------------
//
// Versioned (`v: 1`). Lifetime accumulators (lifetimeKnown, ...) only ever
// bump UP — they survive prestige / streak resets so the player never loses
// title credit for past effort. `unlocked` is the chronological unlock order;
// `activeTitle` is what the player chose to display.
export const titlesStore = defineStore<TitlesState>(
  'thai_titles_v1',
  defaultTitlesInitialState(),
);
