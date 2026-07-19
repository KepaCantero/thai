// Solo Leveling Phase 1: orchestrator that ties events → player state.
//
// The engine is the only thing that mutates `playerStore`. Modes stay dumb:
// they emit `gameBus.emit({type:'srs:review', ...})` and never import the
// store. Tests can replace the engine or the rules table without touching
// mode code.
//
// SRP: player.ts has the math; this file has the wiring + the policy table
// (which event → how much XP → which stat). The policy is data, not code —
// see XP_RULES.

import { gameBus, type GameEventType, type SrsRating } from './events';
import {
  applyXp,
  bumpStat,
  rolloverStreak,
  type Rank,
  type StatKey,
} from './player';
import {
  playerStore,
  xpLogStore,
  type PlayerStatePayload,
  type XpLogEntry,
} from '../persistence/stores';

const XP_LOG_CAP = 200;

/**
 * Declarative rule table — adding a new XP source is one line here + (if it
 * has a new event type) one variant in `GameEvent`. No code branches to
 * touch. This is the policy; everything else in this file is mechanism.
 */
interface FlatRule {
  type: GameEventType;
  xp: number;
  stat?: StatKey;
}

const XP_BY_RATING: Record<SrsRating, number> = {
  again: 2, // showed up — small consolation
  hard: 8,
  good: 10,
  easy: 15,
};

// Every SRS deck key (see SrsDeckKey in src/core/modes/srs/module.ts:115-122)
// mapped to the stat it trains. `lec-preguntas` (lesson Q&A) trains grammar
// because the format is "prompt → full sentence" grammar drill.
const STAT_BY_DECK: Record<string, StatKey> = {
  // Top1000 decks
  palabras: 'vocab',
  estructuras: 'grammar',
  frases: 'reading',
  // Lesson-based decks
  'lec-palabras': 'vocab',
  'lec-frases': 'reading',
  'lec-preguntas': 'grammar',
  // Comprehensible Thai
  cthai: 'listening',
};

const FLAT_RULES: readonly FlatRule[] = [
  { type: 'card:known', xp: 15, stat: 'vocab' },
  { type: 'lesson:complete', xp: 50 },
  { type: 'conv:play', xp: 5, stat: 'listening' },
  { type: 'tone:correct', xp: 8, stat: 'pronunciation' },
  { type: 'tone:wrong', xp: 2 },
  { type: 'shadow:rep', xp: 6, stat: 'pronunciation' },
];

/** 1 XP per 30s of study time. Awards in whole-XP chunks. */
const XP_PER_STUDY_SECOND = 1 / 30;

const today = (): string => new Date().toISOString().slice(0, 10);

function appendXpLog(entry: XpLogEntry): void {
  xpLogStore.update((cur) => {
    const next = [...cur, entry];
    return next.length > XP_LOG_CAP ? next.slice(next.length - XP_LOG_CAP) : next;
  });
}

/**
 * Mutate playerStore: roll streak over if a new day started, apply XP, bump
 * stat, log the change. Centralizes every state transition so future hooks
 * (level-up notifications, daily quest progress) plug in here.
 *
 * Emits `level:up` on `gameBus` when the award crosses one or more tier
 * boundaries. The notification engine subscribes to that for the modal.
 */
function awardXp(amount: number, source: string, stat?: StatKey): void {
  if (!Number.isFinite(amount) || amount <= 0) return;

  // Closure-captured so we can emit AFTER the store write committed.
  let levelUp: {
    rank: Rank;
    tier: number;
    levelsGained: number;
    rankUp: boolean;
  } | null = null;

  playerStore.update((prev) => {
    const rolled = rolloverStreak(prev, today());
    // First activity of the day → start the streak at 1. Subsequent same-day
    // activity: streak was already bumped on the first action, so leave it.
    const newDay = rolled.lastActiveDate !== today();
    const streak = newDay ? rolled.streak + 1 : rolled.streak || 1;
    const longestStreak = Math.max(rolled.longestStreak, streak);

    const base: PlayerStatePayload = {
      ...rolled,
      v: 1,
      streak,
      longestStreak,
      lastActiveDate: today(),
    };

    const withStat = stat ? bumpStat(base, stat, 1) : base;
    const result = applyXp(withStat, amount);
    if (result.levelsGained > 0) {
      levelUp = {
        rank: result.state.rank,
        tier: result.state.tier,
        levelsGained: result.levelsGained,
        rankUp: result.rankUp,
      };
    }
    // applyXp returns a PlayerState (no `v`); we know base was a Payload so
    // re-attach the schema version before persisting.
    return { ...result.state, v: 1 };
  });

  appendXpLog({ ts: Date.now(), amount, source, stat });

  if (levelUp) {
    gameBus.emit({ type: 'level:up', ...levelUp });
  }
}

/**
 * Wire all event subscriptions. Returns an `unsubscribe` for tests; in prod
 * the engine is wired once at boot and lives for the page lifetime.
 */
export function wirePlayerEngine(): () => void {
  const offs: Array<() => void> = [];

  offs.push(
    gameBus.on('srs:review', (e) => {
      const xp = XP_BY_RATING[e.rating] ?? XP_BY_RATING.good;
      awardXp(xp, `srs:review:${e.rating}`, STAT_BY_DECK[e.deck]);
    }),
  );

  for (const rule of FLAT_RULES) {
    // Listener takes no args — TS allows functions with fewer params
    // (contravariance). We don't need the payload; the rule has everything.
    const off = gameBus.on(rule.type, () => {
      awardXp(rule.xp, rule.type, rule.stat);
    });
    offs.push(off);
  }

  offs.push(
    gameBus.on('study:tick', (e) => {
      const xp = Math.floor(e.seconds * XP_PER_STUDY_SECOND);
      if (xp > 0) awardXp(xp, 'study:tick');
    }),
  );

  // 'card:unknown' and 'mode:open' currently carry no XP — subscribed here
  // so future hooks (e.g. quest progress) get a single integration point.
  offs.push(gameBus.on('card:unknown', () => {}));
  offs.push(gameBus.on('mode:open', () => {}));

  return () => {
    for (const off of offs) off();
  };
}

/**
 * Test/diagnostic helper — exposes the current player state as a snapshot.
 * Read-only; never mutate the returned object.
 */
export function snapshotPlayer(): PlayerStatePayload {
  return playerStore.get();
}
