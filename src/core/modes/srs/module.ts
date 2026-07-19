// Spike 5h: SRS mode extraction.
//
// Moves the Spaced Repetition System (SM-2 + FSRS scheduling engine + study
// UI) out of public/srs.js (434 lines) + public/srs-ui.js (661 lines) into a
// typed module. Behavior preserved line-for-line.
//
// Engine (from srs.js):
//   - State: loadSrsState, freshSrsState, saveSrsState, ensureSrsState,
//     resetSrsDeck.
//   - Stats: getDeckStats, getTodayStr, loadSrsStats, defaultStats,
//     saveSrsStats, bumpSrsStats.
//   - Session: buildSession, recordRating, findSrsCardByThai.
//   - Scheduling: scheduleNext, scheduleNextSM2, scheduleNextFSRS,
//     getFsrsScheduler, toFsrsCard, fromFsrsCard, previewIntervals,
//     formatInterval, clampEf.
//
// UI (from srs-ui.js):
//   - Inline host: mountSrsInline, unmountSrsInline, srsGoHome,
//     getActiveSrsDeckKeys.
//   - Top-level render: renderSrsView, renderDeckPicker, renderDeckCard.
//   - Session: startSrsSession, startMixedSession, renderStudyScreen,
//     renderSrsCardFront, rateCurrent, revealCard, advanceCard,
//     exitSrsSession, finishSession, renderSessionEmpty, undoSrsLast,
//     playSrsPhrase.
//   - Reset: confirmResetAll.
//   - Render helpers: stars, speakBtn, formatDuration, vibrate.
//
// Module owns: srsCurrent, srsHostId, srsOnExit, srsDeckKeys, SRS_STATE,
// FSRS_SCHEDULER, FSRS_TRIED.

import { isCthaiEntry } from '../../types';
import type {
  Conversation,
  Phrase,
  Top1000PhraseSegment,
  Top1000Word,
  Word,
} from '../../types';
import type { SrsStats } from '../../persistence/stores';
import { gameBus, type SrsRating } from '../../state/events';

// ---------------------------------------------------------------------------
// Constants (from srs.js L7-13)
// ---------------------------------------------------------------------------

export const SRS_VERSION = 1;
export const SRS_NEW_PER_DAY = 20;
export const SRS_LEARN_AGAIN_SEC = 60;
export const SRS_LEARN_HARD_SEC = 300;
export const SRS_LEARN_GOOD_SEC = 600;
export const SRS_LAPSE_SEC = 600;
export const SRS_DAY_SEC = 86400;

// Top 1000 structure shape (subset used by SRS renderers). Modeled locally
// because Top1000Structure is not yet defined in src/core/types.ts.
export interface Top1000Structure {
  id: string;
  name: string;
  importance: number;
  when: string;
  mistakes: string;
  examples: Top1000StructureExample[];
  [k: string]: unknown;
}

export interface Top1000StructureExample {
  rtgs?: string;
  thai: string;
  spanish?: string;
  [k: string]: unknown;
}

// ---------------------------------------------------------------------------
// State shape (from srs.js L75)
// ---------------------------------------------------------------------------

export type SrsCardStateName = 'new' | 'learn' | 'review';

export interface SrsCardState {
  engine?: 'fsrs' | 'sm2';
  ef: number;
  ivl: number;
  due: number; // unix seconds
  reps: number;
  lapses: number;
  state: SrsCardStateName;
  s?: number;
  d?: number;
  lastReview?: number;
  elapsedDays?: number;
  scheduledDays?: number;
  lastRated?: number;
  [k: string]: unknown;
}

/** Per-deck map: cardId → state. */
export type SrsDeckState = Record<string, SrsCardState>;

/** All decks: deckKey → deck state. */
export type SrsAllState = Record<string, SrsDeckState>;

// ---------------------------------------------------------------------------
// Deck definitions (from srs.js L15-73)
// ---------------------------------------------------------------------------

export type SrsDeckKind =
  | 'word'
  | 'structure'
  | 'phrase'
  | 'lesson-word'
  | 'lesson-phrase'
  | 'lesson-question'
  | 'cthai-question';

export type SrsDeckKey =
  | 'palabras'
  | 'estructuras'
  | 'frases'
  | 'lec-palabras'
  | 'lec-frases'
  | 'lec-preguntas'
  | string;

export interface SrsDeck<
  TCard = AnyCard,
  TId = string | number,
> {
  key: SrsDeckKey;
  label: string;
  icon: string;
  source: () => TCard[];
  idOf: (c: TCard) => TId;
  kind: SrsDeckKind;
}

// ---------------------------------------------------------------------------
// Card types — untyped enough to model all 6 decks. Each deck provides its
// own source()/idOf(), so the engine just needs a generic shape with the
// fields the renderer reads.
// ---------------------------------------------------------------------------

export interface AnyCard {
  thai?: string;
  rank?: number;
  id?: string | number;
  name?: string;
  importance?: number;
  when?: string;
  mistakes?: string;
  examples?: Top1000StructureExample[];
  es?: string;
  rtgs?: string;
  spanish?: string;
  english?: string;
  en?: string;
  tone?: string;
  category?: string;
  lesson?: number;
  phrase?: { thai?: string; spanish?: string; es?: string; en?: string };
  structureId?: string;
  note?: string;
  // Lesson question (Q&A from DATA.conversations):
  q_thai?: string;
  q_es?: string;
  q_spanish?: string;
  a_thai?: string;
  a_es?: string;
  a_spanish?: string;
  verified?: boolean;
  [k: string]: unknown;
}

// ---------------------------------------------------------------------------
// Session items
// ---------------------------------------------------------------------------

export interface SrsSessionItem {
  card: AnyCard;
  cardState: SrsCardState | null;
  isNew: boolean;
  isLearning?: boolean;
  deckKey?: SrsDeckKey;
  presentations?: number;
}

export interface SrsSessionStats {
  reviewed: number;
  learned: number;
}

export interface SrsCurrent {
  deckKey: SrsDeckKey;
  mixed: boolean;
  queue: SrsSessionItem[];
  idx: number;
  sessionStart: number;
  sessionStats: SrsSessionStats;
  revealed: boolean;
}

// ---------------------------------------------------------------------------
// FSRS surface — provided lazily from window.FSRS at runtime. Modeled as an
// opaque dependency so the module never imports the CDN-loaded library.
// ---------------------------------------------------------------------------

export interface FsrsRatingButton {
  /** ts-fsrs Rating enum value: 1=Again,2=Hard,3=Good,4=Easy. */
  Again: 1;
  Hard: 2;
  Good: 3;
  Easy: 4;
}

export interface FsrsStateEnum {
  New: 0;
  Learning: 1;
  Review: 2;
  Relearning: 3;
}

export interface FsrsCard {
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  due: Date;
  last_review?: Date;
}

export interface FsrsScheduler {
  next(card: FsrsCard, now: Date, rating: number): { card: FsrsCard };
}

export interface FsrsLibrary {
  fsrs(params: unknown): FsrsScheduler;
  generatorParameters(opts: unknown): unknown;
  createEmptyCard(now: Date): FsrsCard;
  State: FsrsStateEnum;
  Rating: FsrsRatingButton;
}

// ---------------------------------------------------------------------------
// Persistence (uses raw key names from legacy code)
// ---------------------------------------------------------------------------

export interface SrsPersistence {
  /** Read thai_srs_state payload (string), or null. */
  readStateRaw(): string | null;
  /** Write thai_srs_state payload (string). */
  writeStateRaw(raw: string): void;
  /** Read thai_srs_stats payload (string), or null. */
  readStatsRaw(): string | null;
  /** Write thai_srs_stats payload (string). */
  writeStatsRaw(raw: string): void;
  /** Remove thai_srs_stats. */
  removeStats(): void;
}

// ---------------------------------------------------------------------------
// DOM write surface
// ---------------------------------------------------------------------------

export interface SrsDom {
  /** Read #<hostId> and return it (null if absent). */
  getHost(): HTMLElement | null;
  /** Replace #<hostId> innerHTML. */
  setHostHtml(html: string): void;
  /** Add a CSS class to #<hostId>. */
  addHostClass(cls: string): void;
  /** Remove a CSS class from #<hostId> (current host id read via getHostId). */
  removeHostClassFromCurrent(cls: string): void;
  /** Read element by id. */
  getById(id: string): HTMLElement | null;
  /** Read the first element matching the selector. */
  querySelector(sel: string): HTMLElement | null;
  /** Append a child to document.body. */
  appendToBody(el: HTMLElement): void;
  /** Trigger a haptic vibration (no-op on unsupported devices). */
  vibrate(ms: number): void;
}

// ---------------------------------------------------------------------------
// Module deps
// ---------------------------------------------------------------------------

export interface SrsModuleDeps {
  /** Returns DATA lookups object { words, phrases, conversations }. */
  getData(): { words?: Word[]; phrases?: Phrase[]; conversations?: Conversation[] } | undefined;
  /** Returns TOP1000_WORDS. */
  getTop1000Words(): Top1000Word[] | undefined;
  /** Returns TOP1000_STRUCTURES. */
  getTop1000Structures(): Top1000Structure[] | undefined;
  /** Returns TOP1000_PHRASES. */
  getTop1000Phrases(): Top1000PhraseSegment[] | undefined;
  /** Returns the SHOW_UNVERIFIED flag (whether unverified Q&A is visible). */
  getShowUnverified(): boolean;
  /** Returns the active scope ('lecciones' | 'top1000' | 'comprehensive'). */
  getActiveScope?(): string;
  /** Lazy FSRS library accessor (window.FSRS). May return null/undefined. */
  getFsrs(): FsrsLibrary | undefined;
  /** speakText from audio.js. */
  speakText(text: string): void;
  /** renderTone from config.js. */
  renderTone(toneStr: string | undefined): string;
  /** persistence surface. */
  persistence: SrsPersistence;
  /** DOM write surface. */
  dom: SrsDom;
}

// ---------------------------------------------------------------------------
// Module contract
// ---------------------------------------------------------------------------

export interface SrsModule {
  // State
  loadSrsState(): SrsAllState;
  freshSrsState(): SrsAllState;
  saveSrsState(): void;
  ensureSrsState(): void;
  resetSrsDeck(deckKey: SrsDeckKey): void;
  // Decks
  getSrsDecks(): Record<SrsDeckKey, SrsDeck>;
  getActiveSrsDeckKeys(): SrsDeckKey[];
  // Stats
  getDeckStats(deckKey: SrsDeckKey): DeckStats;
  loadSrsStats(): SrsStats;
  defaultStats(): SrsStats;
  saveSrsStats(stats: SrsStats): void;
  bumpSrsStats(reviewed: number, learned: number, timeSec: number): SrsStats;
  // Session
  buildSession(deckKey: SrsDeckKey): SrsSessionItem[];
  recordRating(deckKey: SrsDeckKey, cardId: string | number, rating: number): SrsCardState;
  findSrsCardByThai(thai: string): { deckKey: SrsDeckKey; cardId: string | number } | null;
  // Scheduling
  scheduleNext(prevState: SrsCardState | null, rating: number, now?: number): SrsCardState;
  scheduleNextSM2(prevState: SrsCardState | null, rating: number, now?: number): SrsCardState;
  scheduleNextFSRS(prevState: SrsCardState | null, rating: number, now: number, scheduler: FsrsScheduler): SrsCardState;
  getFsrsScheduler(): FsrsScheduler | null;
  previewIntervals(prevState: SrsCardState | null): Record<number, string>;
  formatInterval(sec: number): string;
  clampEf(ef: number): number;
  // UI — inline host
  mountSrsInline(hostId: string, onExit: (() => void) | null, deckKeys: SrsDeckKey[] | null): void;
  unmountSrsInline(): void;
  srsGoHome(): void;
  // UI — top-level
  renderSrsView(): void;
  renderDeckPicker(): string;
  renderDeckCard(deck: SrsDeck, stats: DeckStats): string;
  // UI — session
  startSrsSession(deckKey: SrsDeckKey, opts?: { queue?: SrsSessionItem[]; mixed?: boolean }): void;
  startMixedSession(): void;
  renderStudyScreen(): void;
  rateCurrent(rating: number): void;
  revealCard(): void;
  advanceCard(): void;
  exitSrsSession(): void;
  finishSession(): void;
  renderSessionEmpty(deckKey: SrsDeckKey): void;
  undoSrsLast(): void;
  playSrsPhrase(): void;
  srsSpeak(text: string): void;
  // UI — reset
  confirmResetAll(): void;
  // Inspection helpers (used by tests + bridge)
  getSrsCurrent(): SrsCurrent | null;
  setSrsCurrent(c: SrsCurrent | null): void;
  getSrsHostId(): string;
  getSrsOnExit(): (() => void) | null;
  getSrsDeckKeys(): SrsDeckKey[] | null;
}

export interface DeckStats {
  due: number;
  learning: number;
  new: number;
  newRemaining: number;
  total: number;
  mature: number;
  seen: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createSrsModule(deps: SrsModuleDeps): SrsModule {
  // ----- internal state (from srs.js L76, L207-208) -----------------------
  let SRS_STATE: SrsAllState | null = null;
  let FSRS_SCHEDULER: FsrsScheduler | null = null;
  let FSRS_TRIED = false;

  // ----- inline host state (from srs-ui.js L9-16) -------------------------
  let srsCurrent: SrsCurrent | null = null;
  let srsHostId = 'srsView';
  let srsOnExit: (() => void) | null = null;
  let srsDeckKeys: SrsDeckKey[] | null = null;

  // ----- deck definitions (from srs.js L15-73) ----------------------------

  function buildSrsDecks(): Record<SrsDeckKey, SrsDeck> {
    return {
      palabras: {
        key: 'palabras',
        label: 'Palabras',
        icon: '📝',
        source: () => (deps.getTop1000Words() as unknown as AnyCard[] | undefined) ?? [],
        idOf: (c) => (c as unknown as Top1000Word).rank,
        kind: 'word',
      },
      estructuras: {
        key: 'estructuras',
        label: 'Estructuras',
        icon: '🏗️',
        source: () =>
          (deps.getTop1000Structures() as unknown as AnyCard[] | undefined) ?? [],
        idOf: (c) => (c as unknown as Top1000Structure).id,
        kind: 'structure',
      },
      frases: {
        key: 'frases',
        label: 'Frases',
        icon: '💬',
        source: () => (deps.getTop1000Phrases() as unknown as AnyCard[] | undefined) ?? [],
        idOf: (c) => (c as unknown as { id: string }).id,
        kind: 'phrase',
      },
      'lec-palabras': {
        key: 'lec-palabras',
        label: 'Palabras (lecciones)',
        icon: '📘',
        source: () => (deps.getData()?.words as unknown as AnyCard[]) ?? [],
        idOf: (c) => (c as unknown as Word).thai,
        kind: 'lesson-word',
      },
      'lec-frases': {
        key: 'lec-frases',
        label: 'Frases (lecciones)',
        icon: '📗',
        source: () => (deps.getData()?.phrases as unknown as AnyCard[]) ?? [],
        idOf: (c) => (c as unknown as Phrase).thai,
        kind: 'lesson-phrase',
      },
      'lec-preguntas': {
        key: 'lec-preguntas',
        label: 'Preguntas (lecciones)',
        icon: '❓',
        source: () => {
          const data = deps.getData();
          if (!data || !data.conversations) return [];
          const showUnverified = deps.getShowUnverified();
          const convs = data.conversations as unknown as AnyCard[];
          return showUnverified
            ? convs
            : convs.filter((c) => !isCthaiEntry(c as unknown as Conversation));
        },
        idOf: (c) => {
          const conv = c as unknown as Conversation;
          return (conv.q_thai || '') + '||' + (conv.a_thai || '');
        },
        kind: 'lesson-question',
      },
      cthai: {
        key: 'cthai',
        label: 'Comprehensible Thai',
        icon: '🎬',
        source: () => {
          const data = deps.getData();
          if (!data || !data.conversations) return [];
          return data.conversations.filter(
            (c) => isCthaiEntry(c as unknown as Conversation),
          ) as unknown as AnyCard[];
        },
        idOf: (c) => {
          const conv = c as unknown as Conversation;
          return (conv.q_thai || '') + '||' + (conv.a_thai || '');
        },
        kind: 'lesson-question',
      },
    };
  }

  function getSrsDecks(): Record<SrsDeckKey, SrsDeck> {
    return buildSrsDecks();
  }

  // ----- state (from srs.js L78-104) ---------------------------------------

  function freshSrsState(): SrsAllState {
    return {
      palabras: {},
      estructuras: {},
      frases: {},
      'lec-palabras': {},
      'lec-frases': {},
      'lec-preguntas': {},
      cthai: {},
    };
  }

  function loadSrsState(): SrsAllState {
    try {
      const raw = deps.persistence.readStateRaw();
      if (!raw) return freshSrsState();
      const parsed = JSON.parse(raw) as { v: number; decks?: SrsAllState };
      if (!parsed || parsed.v !== SRS_VERSION) return freshSrsState();
      return (parsed.decks as SrsAllState) ?? freshSrsState();
    } catch {
      return freshSrsState();
    }
  }

  function saveSrsState(): void {
    if (!SRS_STATE) return;
    try {
      deps.persistence.writeStateRaw(JSON.stringify({ v: SRS_VERSION, decks: SRS_STATE }));
    } catch (e) {
      console.warn('[srs] save failed', e);
    }
  }

  function ensureSrsState(): void {
    if (!SRS_STATE) SRS_STATE = loadSrsState();
  }

  function resetSrsDeck(deckKey: SrsDeckKey): void {
    ensureSrsState();
    const decks = getSrsDecks();
    if (!decks[deckKey]) return;
    SRS_STATE![deckKey] = {};
    saveSrsState();
  }

  // ----- deck stats (from srs.js L115-146) ---------------------------------

  function getDeckStats(deckKey: SrsDeckKey): DeckStats {
    ensureSrsState();
    const decks = getSrsDecks();
    const deck = decks[deckKey];
    const empty: DeckStats = {
      due: 0,
      learning: 0,
      new: 0,
      newRemaining: 0,
      total: 0,
      mature: 0,
      seen: 0,
    };
    if (!deck) return empty;
    const cards = deck.source();
    const state = SRS_STATE![deckKey] || {};
    const now = Math.floor(Date.now() / 1000);
    let due = 0,
      learning = 0,
      mature = 0,
      seen = 0;
    cards.forEach((c) => {
      const id = String(deck.idOf(c));
      const cs = state[id];
      if (!cs) return;
      seen++;
      if (cs.state === 'learn') {
        if (cs.due <= now) learning++;
      } else if (cs.state === 'review') {
        if (cs.due <= now) due++;
        else if (cs.ivl >= 21) mature++;
      }
    });
    const newCount = Math.max(0, cards.length - seen);
    const newToday = Math.min(SRS_NEW_PER_DAY, newCount);
    return {
      due: due + learning,
      learning,
      new: newToday,
      newRemaining: newCount,
      total: cards.length,
      mature,
      seen,
    };
  }

  // ----- session builder (from srs.js L150-199) ----------------------------

  function buildSession(deckKey: SrsDeckKey): SrsSessionItem[] {
    ensureSrsState();
    const decks = getSrsDecks();
    const deck = decks[deckKey];
    if (!deck) return [];
    const cards = deck.source();
    const state = SRS_STATE![deckKey] || {};
    const now = Math.floor(Date.now() / 1000);

    const dueReviews: SrsSessionItem[] = [];
    const learning: SrsSessionItem[] = [];
    const newCards: AnyCard[] = [];

    cards.forEach((c) => {
      const id = String(deck.idOf(c));
      const cs = state[id];
      if (!cs) {
        newCards.push(c);
        return;
      }
      if (cs.state === 'learn') {
        if (cs.due <= now) learning.push({ card: c, cardState: cs, isNew: false });
      } else if (cs.state === 'review') {
        if (cs.due <= now) dueReviews.push({ card: c, cardState: cs, isNew: false });
      }
    });

    dueReviews.sort((a, b) => (a.cardState!.due - b.cardState!.due));
    // New cards: easiest first. For Top1000 decks, `rank` is the word's
    // frequency rank (1 = most frequent = easiest). Lower rank sorts first.
    // Cards without `rank` (lesson / CT decks) keep their deck order via the
    // stable sort fallback (Infinity).
    const rankOf = (c: AnyCard): number =>
      typeof (c as unknown as { rank?: number }).rank === 'number'
        ? (c as unknown as { rank: number }).rank
        : Infinity;
    const rankedNew = [...newCards].sort((a, b) => rankOf(a) - rankOf(b));
    const newToday = rankedNew.slice(0, SRS_NEW_PER_DAY);

    const queue: SrsSessionItem[] = [];
    learning.forEach((item) =>
      queue.push({ card: item.card, cardState: item.cardState, isNew: false, isLearning: true })
    );
    let i = 0,
      ni = 0;
    while (i < dueReviews.length) {
      queue.push({
        card: dueReviews[i].card,
        cardState: dueReviews[i].cardState,
        isNew: false,
      });
      i++;
      if (i % 4 === 0 && ni < newToday.length) {
        queue.push({ card: newToday[ni], cardState: null, isNew: true });
        ni++;
      }
    }
    while (ni < newToday.length) {
      queue.push({ card: newToday[ni], cardState: null, isNew: true });
      ni++;
    }
    return queue;
  }

  // ----- FSRS engine (from srs.js L207-272) --------------------------------

  function getFsrsScheduler(): FsrsScheduler | null {
    if (FSRS_TRIED) return FSRS_SCHEDULER;
    FSRS_TRIED = true;
    const lib = deps.getFsrs();
    if (!lib) return null;
    try {
      FSRS_SCHEDULER = lib.fsrs(lib.generatorParameters({}));
      console.info('[srs] FSRS engine active (ts-fsrs)');
      return FSRS_SCHEDULER;
    } catch (e) {
      console.warn('[srs] FSRS init failed, using SM-2:', e);
      return null;
    }
  }

  function toFsrsCard(prevState: SrsCardState | null, now: number): FsrsCard {
    const lib = deps.getFsrs()!;
    const card = lib.createEmptyCard(new Date(now * 1000));
    if (!prevState || prevState.state === 'new') return card;
    card.stability =
      prevState.s !== undefined ? prevState.s : Math.max(0.4, prevState.ivl || 1);
    card.difficulty =
      prevState.d !== undefined
        ? prevState.d
        : Math.min(10, Math.max(1, 10 - (prevState.ef || 2.5) * 3 + 5));
    card.elapsed_days = prevState.elapsedDays || 0;
    card.scheduled_days = prevState.scheduledDays || prevState.ivl || 0;
    card.reps = prevState.reps || 0;
    card.lapses = prevState.lapses || 0;
    card.state =
      prevState.state === 'learn' ? lib.State.Learning : lib.State.Review;
    card.due = new Date((prevState.due || now) * 1000);
    if (prevState.lastReview) card.last_review = new Date(prevState.lastReview * 1000);
    return card;
  }

  function fromFsrsCard(card: FsrsCard, prevEf: number | undefined, now: number): SrsCardState {
    const lib = deps.getFsrs()!;
    let stateStr: SrsCardStateName = 'review';
    if (card.state === lib.State.New) stateStr = 'new';
    else if (card.state === lib.State.Learning || card.state === lib.State.Relearning)
      stateStr = 'learn';
    const dueSec = Math.floor(new Date(card.due).getTime() / 1000);
    return {
      engine: 'fsrs',
      ef: prevEf || 2.5,
      ivl: card.scheduled_days || Math.max(0.01, (dueSec - now) / SRS_DAY_SEC),
      due: dueSec,
      reps: card.reps,
      lapses: card.lapses,
      state: stateStr,
      s: card.stability,
      d: card.difficulty,
      lastReview: now,
      elapsedDays: card.elapsed_days,
      scheduledDays: card.scheduled_days,
    };
  }

  function scheduleNextFSRS(
    prevState: SrsCardState | null,
    rating: number,
    now: number,
    scheduler: FsrsScheduler
  ): SrsCardState {
    const card = toFsrsCard(prevState, now);
    const result = scheduler.next(card, new Date(now * 1000), rating);
    return fromFsrsCard(result.card, prevState && prevState.ef, now);
  }

  function scheduleNext(
    prevState: SrsCardState | null,
    rating: number,
    now?: number
  ): SrsCardState {
    const t = now ?? Math.floor(Date.now() / 1000);
    const scheduler = getFsrsScheduler();
    if (scheduler) {
      try {
        return scheduleNextFSRS(prevState, rating, t, scheduler);
      } catch (e) {
        console.warn('[srs] FSRS scheduling failed, falling back to SM-2:', e);
      }
    }
    return scheduleNextSM2(prevState, rating, t);
  }

  // ----- SM-2 (from srs.js L286-336) ---------------------------------------

  function clampEf(ef: number): number {
    return Math.max(1.3, Math.min(3.0, ef));
  }

  function scheduleNextSM2(
    prevState: SrsCardState | null,
    rating: number,
    now?: number
  ): SrsCardState {
    const t = now ?? Math.floor(Date.now() / 1000);
    const cs: SrsCardState = prevState
      ? { ...prevState }
      : { ef: 2.5, ivl: 0, due: t, reps: 0, lapses: 0, state: 'new' };
    const isNew = cs.state === 'new';
    const isLearn = cs.state === 'learn';

    function graduate(intervalDays: number, efDelta: number): void {
      cs.state = 'review';
      cs.ivl = Math.max(1, intervalDays);
      cs.due = t + cs.ivl * SRS_DAY_SEC;
      cs.ef = clampEf(cs.ef + efDelta);
    }
    function stayLearn(sec: number): void {
      cs.state = 'learn';
      cs.ivl = 0;
      cs.due = t + sec;
    }

    if (isNew || isLearn) {
      if (rating === 1) stayLearn(SRS_LEARN_AGAIN_SEC);
      else if (rating === 2) stayLearn(SRS_LEARN_HARD_SEC);
      else if (rating === 3) graduate(1, 0);
      else graduate(4, 0.15);
    } else {
      // review
      if (rating === 1) {
        cs.state = 'learn';
        cs.ivl = 0;
        cs.due = t + SRS_LAPSE_SEC;
        cs.lapses = (cs.lapses || 0) + 1;
        cs.ef = clampEf(cs.ef - 0.2);
      } else if (rating === 2) {
        const ni = Math.max(cs.ivl * 1.2, 1);
        cs.ivl = ni;
        cs.due = t + ni * SRS_DAY_SEC;
        cs.ef = clampEf(cs.ef - 0.15);
      } else if (rating === 3) {
        const ni = Math.max(cs.ivl * cs.ef, 1);
        cs.ivl = ni;
        cs.due = t + ni * SRS_DAY_SEC;
      } else {
        const ni = Math.max(cs.ivl * cs.ef * 1.3, 2);
        cs.ivl = ni;
        cs.due = t + ni * SRS_DAY_SEC;
        cs.ef = clampEf(cs.ef + 0.15);
      }
    }
    cs.reps = (cs.reps || 0) + 1;
    cs.lastRated = t;
    return cs;
  }

  // ----- interval preview / formatting (from srs.js L341-365) -------------

  function previewIntervals(prevState: SrsCardState | null): Record<number, string> {
    const now = Math.floor(Date.now() / 1000);
    const out: Record<number, string> = {};
    [1, 2, 3, 4].forEach((r) => {
      const next = scheduleNext(prevState, r, now);
      out[r] = formatInterval(next.due - now);
    });
    return out;
  }

  function formatInterval(sec: number): string {
    if (sec < 60) return '<1min';
    if (sec < 3600) return Math.round(sec / 60) + 'min';
    if (sec < SRS_DAY_SEC) return Math.round(sec / 3600) + 'h';
    const days = Math.round(sec / SRS_DAY_SEC);
    if (days === 1) return '1d';
    if (days < 30) return days + 'd';
    if (days < 365) {
      const mo = Math.round(days / 30);
      return mo + 'mo';
    }
    const y = (days / 365).toFixed(1);
    return (y.endsWith('.0') ? y.slice(0, -2) : y) + 'a';
  }

  // ----- record rating (from srs.js L368-377) ------------------------------

  function recordRating(
    deckKey: SrsDeckKey,
    cardId: string | number,
    rating: number
  ): SrsCardState {
    ensureSrsState();
    const state = SRS_STATE![deckKey] || {};
    const id = String(cardId);
    const prev = state[id] || null;
    const next = scheduleNext(prev, rating);
    state[id] = next;
    SRS_STATE![deckKey] = state;
    saveSrsState();
    return next;
  }

  // ----- find by thai (from srs.js L388-401) --------------------------------

  function findSrsCardByThai(
    thai: string
  ): { deckKey: SrsDeckKey; cardId: string | number } | null {
    if (!thai) return null;
    const decks = getSrsDecks();
    const deckKeys: SrsDeckKey[] = ['lec-palabras', 'lec-frases', 'palabras', 'frases'];
    for (const dk of deckKeys) {
      const deck = decks[dk];
      if (!deck) continue;
      const src = deck.source();
      for (const c of src) {
        if (c.thai === thai) return { deckKey: dk, cardId: deck.idOf(c) };
      }
    }
    return null;
  }

  // ----- daily stats (from srs.js L404-434) --------------------------------

  function getTodayStr(): string {
    const d = new Date();
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  function defaultStats(): SrsStats {
    return { today: getTodayStr(), reviewed: 0, learned: 0, timeSec: 0 };
  }

  function loadSrsStats(): SrsStats {
    try {
      const raw = deps.persistence.readStatsRaw();
      if (!raw) return defaultStats();
      const p = JSON.parse(raw) as SrsStats;
      if (p.today !== getTodayStr()) return defaultStats();
      return p;
    } catch {
      return defaultStats();
    }
  }

  function saveSrsStats(stats: SrsStats): void {
    try {
      deps.persistence.writeStatsRaw(JSON.stringify(stats));
    } catch {
      // swallow — matches legacy behavior (silent catch).
    }
  }

  function bumpSrsStats(reviewed: number, learned: number, timeSec: number): SrsStats {
    const s = loadSrsStats();
    s.reviewed += reviewed || 0;
    s.learned += learned || 0;
    s.timeSec += timeSec || 0;
    saveSrsStats(s);
    return s;
  }

  // ----- inline host (from srs-ui.js L18-51) -------------------------------

  function getActiveSrsDeckKeys(): SrsDeckKey[] {
    return srsDeckKeys || (Object.keys(getSrsDecks()) as SrsDeckKey[]);
  }

  function mountSrsInline(
    hostId: string,
    onExit: (() => void) | null,
    deckKeys: SrsDeckKey[] | null
  ): void {
    if (srsHostId !== hostId) {
      deps.dom.removeHostClassFromCurrent('srs-host');
    }
    srsHostId = hostId;
    srsOnExit = onExit || null;
    srsDeckKeys = deckKeys || null;
    deps.dom.addHostClass('srs-host');
  }

  function unmountSrsInline(): void {
    deps.dom.removeHostClassFromCurrent('srs-host');
    srsHostId = 'srsView';
    srsOnExit = null;
    srsDeckKeys = null;
  }

  function srsGoHome(): void {
    if (srsOnExit) {
      const cb = srsOnExit;
      unmountSrsInline();
      cb();
    } else {
      renderSrsView();
    }
  }

  // ----- top-level render (from srs-ui.js L56-115) -------------------------

  function renderSrsView(): void {
    // In comprehensive scope, SRS only offers the CT (verified===false) deck.
    const scope = deps.getActiveScope?.() ?? 'lecciones';
    const deckKeys = scope === 'comprehensive' ? ['cthai'] : ['lec-palabras', 'lec-frases', 'lec-preguntas'];
    mountSrsInline('srsView', null, deckKeys);
    const view = deps.dom.getById('srsView');
    if (!view) return;
    view.innerHTML = renderDeckPicker();
  }

  function renderDeckPicker(): string {
    const stats = loadSrsStats();
    let totalDue = 0;
    let totalNew = 0;
    const keys = getActiveSrsDeckKeys();
    let firstKey: SrsDeckKey | null = null;

    const decks = getSrsDecks();
    const decksHtml = keys
      .map((key) => {
        const d = decks[key];
        if (!d) return '';
        if (!firstKey) firstKey = key;
        const s = getDeckStats(key);
        totalDue += s.due;
        totalNew += s.new;
        return renderDeckCard(d, s);
      })
      .join('');

    const subtitle =
      srsHostId === 'top1000View'
        ? 'Repetición espaciada · Top 1000'
        : 'Repetición espaciada · Lecciones';

    const quick =
      '<div class="srs-quick">' +
      (totalDue > 0
        ? '<button class="srs-cta-primary" onclick="startMixedSession()">▶ Estudiar todo (' +
          totalDue +
          ' due)</button>'
        : '<button class="srs-cta-primary" onclick="startSrsSession(\'' +
          (firstKey || '') +
          '\')">▶ Empezar</button>') +
      '</div>';

    const today =
      '<div class="srs-today">' +
      '<span class="srs-today-label">Hoy</span>' +
      '<span class="srs-today-stat">' +
      (stats.reviewed || 0) +
      ' repasadas</span>' +
      '<span class="srs-today-stat">' +
      (stats.learned || 0) +
      ' nuevas</span>' +
      '<span class="srs-today-time">' +
      formatDuration(stats.timeSec || 0) +
      '</span>' +
      '</div>';

    return (
      '<div class="srs-screen srs-deck-picker">' +
      '<header class="srs-header">' +
      '<h1 class="srs-title">Estudiar</h1>' +
      '<p class="srs-subtitle">' +
      subtitle +
      '</p>' +
      '</header>' +
      today +
      quick +
      '<div class="srs-deck-list">' +
      decksHtml +
      '</div>' +
      '<div class="srs-reset-row">' +
      '<button class="srs-reset-btn" onclick="confirmResetAll()">↺ Reiniciar progreso</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderDeckCard(deck: SrsDeck, stats: DeckStats): string {
    const due = stats.due;
    const hasWork = due > 0 || stats.new > 0;
    const dueBadge =
      due > 0
        ? '<span class="srs-deck-due">' + due + ' due</span>'
        : '<span class="srs-deck-due srs-deck-due-zero">al día ✓</span>';

    return (
      '<button class="srs-deck-card" onclick="startSrsSession(\'' +
      deck.key +
      "')\">" +
      '<div class="srs-deck-icon">' +
      deck.icon +
      '</div>' +
      '<div class="srs-deck-info">' +
      '<div class="srs-deck-name">' +
      deck.label +
      '</div>' +
      '<div class="srs-deck-meta">' +
      dueBadge +
      '<span class="srs-deck-new">' +
      stats.new +
      ' nuevas</span>' +
      '<span class="srs-deck-seen">' +
      stats.seen +
      '/' +
      stats.total +
      ' vistas</span>' +
      '</div>' +
      '</div>' +
      '<div class="srs-deck-arrow">' +
      (hasWork ? '▶' : '✓') +
      '</div>' +
      '</button>'
    );
  }

  // ----- session (from srs-ui.js L141-572) ---------------------------------

  function startSrsSession(
    deckKey: SrsDeckKey,
    opts: { queue?: SrsSessionItem[]; mixed?: boolean } = {}
  ): void {
    const decks = getSrsDecks();
    if (!decks[deckKey]) return;
    const queue = opts.queue || buildSession(deckKey);
    srsCurrent = {
      deckKey,
      mixed: !!opts.mixed,
      queue,
      idx: 0,
      sessionStart: Date.now(),
      sessionStats: { reviewed: 0, learned: 0 },
      revealed: false,
    };
    if (!queue.length) {
      renderSessionEmpty(deckKey);
      return;
    }
    renderStudyScreen();
  }

  function renderStudyScreen(): void {
    const view = deps.dom.getById(srsHostId);
    if (!view || !srsCurrent) return;
    const item = srsCurrent.queue[srsCurrent.idx];
    const total = srsCurrent.queue.length;
    const pos = srsCurrent.idx + 1;
    const decks = getSrsDecks();
    const deck = decks[srsCurrent.deckKey];
    srsCurrent.revealed = false;

    const card = item.card;
    const deckKind = deck.kind;

    const header =
      '<header class="srs-study-top">' +
      '<button class="srs-icon-btn" onclick="exitSrsSession()" aria-label="Salir">✕</button>' +
      '<div class="srs-progress">' +
      '<div class="srs-progress-count">' +
      pos +
      ' / ' +
      total +
      '</div>' +
      '<div class="srs-progress-bar"><div class="srs-progress-fill" style="width:' +
      ((pos / total) * 100).toFixed(1) +
      '%"></div></div>' +
      '</div>' +
      '<button class="srs-icon-btn" onclick="undoSrsLast()" aria-label="Deshacer" ' +
      (srsCurrent.sessionStats.reviewed === 0 ? 'disabled' : '') +
      '>↶</button>' +
      '</header>';

    const cardHtml = renderSrsCardFront(card, deckKind, item);
    const intervals = previewIntervals(item.cardState);
    const bottomBar = renderBottomBar(card, deckKind, intervals, !srsCurrent.revealed);

    view.innerHTML =
      '<div class="srs-screen srs-study">' +
      header +
      '<div class="srs-card-stage" id="srsCardStage">' +
      cardHtml +
      '</div>' +
      bottomBar +
      '</div>';

    bindCardStageTap();
    setTimeout(playSrsPhrase, 200);
  }

  function renderBottomBar(
    card: AnyCard,
    kind: SrsDeckKind,
    intervals: Record<number, string>,
    hidden: boolean
  ): string {
    const phraseThai = getCardPhraseThai(card, kind);
    const playBtn = phraseThai
      ? '<button class="srs-play-phrase" id="srsPlayPhrase" onclick="playSrsPhrase()"' +
        (hidden ? ' hidden' : '') +
        '><span class="srs-play-icon">▶</span><span class="srs-play-label">Frase</span></button>'
      : '';
    return (
      '<div class="srs-bottom-bar">' +
      playBtn +
      renderRatingActions(intervals, hidden) +
      '</div>'
    );
  }

  function getCardPhraseThai(card: AnyCard, kind: SrsDeckKind): string | null {
    if (kind === 'word') return (card.phrase && card.phrase.thai) || null;
    if (kind === 'phrase') return card.thai || null;
    if (kind === 'structure') {
      const ex = card.examples && card.examples[0];
      return (ex && ex.thai) || null;
    }
    if (kind === 'lesson-word') return card.thai || null;
    if (kind === 'lesson-phrase') return card.thai || null;
    if (kind === 'lesson-question') return card.q_thai || card.a_thai || null;
    return null;
  }

  function playSrsPhrase(): void {
    if (!srsCurrent) return;
    const item = srsCurrent.queue[srsCurrent.idx];
    const decks = getSrsDecks();
    const deck = decks[srsCurrent.deckKey];
    const text = getCardPhraseThai(item.card, deck.kind);
    if (text) deps.speakText(text);
  }

  function renderSrsCardFront(
    card: AnyCard,
    kind: SrsDeckKind,
    item: SrsSessionItem
  ): string {
    let front = '';
    let back = '';
    if (kind === 'word') {
      front = renderWordFront(card);
      back = renderWordBack(card);
    } else if (kind === 'structure') {
      front = renderStructureFront(card);
      back = renderStructureBack(card);
    } else if (kind === 'phrase') {
      front = renderPhraseFront(card);
      back = renderPhraseBack(card);
    } else if (kind === 'lesson-word') {
      front = renderLessonWordFront(card);
      back = renderLessonWordBack(card);
    } else if (kind === 'lesson-phrase') {
      front = renderLessonPhraseFront(card);
      back = renderLessonPhraseBack(card);
    } else if (kind === 'lesson-question') {
      front = renderLessonQuestionFront(card);
      back = renderLessonQuestionBack(card);
    }
    const tagText = item.isNew ? 'NUEVA' : item.isLearning ? 'APRENDIENDO' : 'REVISIÓN';
    const tagKind = item.isNew ? 'new' : item.isLearning ? 'learn' : 'review';
    return (
      '<div class="srs-card" id="srsCard" data-kind="' +
      kind +
      '" data-tag="' +
      tagKind +
      '">' +
      '<div class="srs-card-face srs-card-front">' +
      front +
      '</div>' +
      '<div class="srs-card-face srs-card-back">' +
      back +
      '</div>' +
      '<div class="srs-card-tag">' +
      tagText +
      '</div>' +
      '</div>'
    );
  }

  function renderRatingActions(
    intervals: Record<number, string>,
    hidden: boolean
  ): string {
    return (
      '<div class="srs-actions' +
      (hidden ? ' srs-actions-hidden' : '') +
      '" id="srsActions">' +
      '<button class="srs-rating srs-again" onclick="rateCurrent(1)"><span class="srs-r-label">Otra vez</span><span class="srs-r-interval">' +
      intervals[1] +
      '</span></button>' +
      '<button class="srs-rating srs-hard" onclick="rateCurrent(2)"><span class="srs-r-label">Difícil</span><span class="srs-r-interval">' +
      intervals[2] +
      '</span></button>' +
      '<button class="srs-rating srs-good" onclick="rateCurrent(3)"><span class="srs-r-label">Bien</span><span class="srs-r-interval">' +
      intervals[3] +
      '</span></button>' +
      '<button class="srs-rating srs-easy" onclick="rateCurrent(4)"><span class="srs-r-label">Fácil</span><span class="srs-r-interval">' +
      intervals[4] +
      '</span></button>' +
      '</div>'
    );
  }

  // ----- WORD / STRUCTURE / PHRASE renderers (from srs-ui.js L275-351) ----

  function renderWordFront(w: AnyCard): string {
    const tone = deps.renderTone(w.tone);
    return (
      '<div class="srs-card-type">PALABRA · #' +
      w.rank +
      '</div>' +
      '<div class="srs-thai-big">' +
      w.thai +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (w.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '<div class="srs-card-hint">Toca para revelar ↻</div>'
    );
  }

  function renderWordBack(w: AnyCard): string {
    const tone = deps.renderTone(w.tone);
    const head =
      '<div class="srs-back-head">' +
      '<div class="srs-thai-med">' +
      w.thai +
      ' ' +
      speakBtn(w.thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (w.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '</div>';
    const meaning =
      '<div class="srs-meaning">' +
      '<div class="srs-meaning-es">' +
      (w.spanish || '') +
      '</div>' +
      (w.english ? '<div class="srs-meaning-en">' + w.english + '</div>' : '') +
      '</div>';
    const phrase =
      w.phrase && w.phrase.thai
        ? '<div class="srs-example-block">' +
          '<div class="srs-example-label">Frase ' +
          speakBtn(w.phrase.thai) +
          '</div>' +
          '<div class="srs-example-thai">' +
          w.phrase.thai +
          '</div>' +
          '<div class="srs-example-es">' +
          (w.phrase.spanish || '') +
          '</div>' +
          '</div>'
        : '';
    return head + meaning + phrase;
  }

  function renderStructureFront(s: AnyCard): string {
    return (
      '<div class="srs-card-type">ESTRUCTURA · #' +
      s.id +
      '</div>' +
      '<div class="srs-thai-med">' +
      (s.name || '') +
      '</div>' +
      '<div class="srs-importance">' +
      stars(s.importance || 0) +
      '</div>' +
      '<div class="srs-card-hint">Toca para ver explicación ↻</div>'
    );
  }

  function renderStructureBack(s: AnyCard): string {
    const examples = (s.examples || []).slice(0, 3)
      .map((e) => {
        return (
          '<div class="srs-example-block">' +
          '<div class="srs-example-label">' +
          (e.rtgs || '') +
          ' ' +
          speakBtn(e.thai) +
          '</div>' +
          '<div class="srs-example-thai">' +
          e.thai +
          '</div>' +
          '<div class="srs-example-es">' +
          (e.spanish || '') +
          '</div>' +
          '</div>'
        );
      })
      .join('');
    return (
      '<div class="srs-back-head">' +
      '<div class="srs-thai-med">' +
      (s.name || '') +
      '</div>' +
      '<div class="srs-importance">' +
      stars(s.importance || 0) +
      '</div>' +
      '</div>' +
      '<div class="srs-section"><div class="srs-section-label">Cuándo</div><div class="srs-section-text">' +
      (s.when || '') +
      '</div></div>' +
      '<div class="srs-section"><div class="srs-section-label">Errores típicos</div><div class="srs-section-text">' +
      (s.mistakes || '') +
      '</div></div>' +
      examples
    );
  }

  function renderPhraseFront(p: AnyCard): string {
    return (
      '<div class="srs-card-type">FRASE · #' +
      p.id +
      '</div>' +
      '<div class="srs-thai-med">' +
      (p.thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (p.rtgs || '') +
      '</div>' +
      '<div class="srs-card-hint">Toca para traducir ↻</div>'
    );
  }

  function renderPhraseBack(p: AnyCard): string {
    const structs = deps.getTop1000Structures();
    const struct = p.structureId
      ? (structs || []).find((s) => s.id === p.structureId)
      : null;
    const structTag = struct
      ? '<div class="srs-struct-ref">Estructura #' + struct.id + ': ' + struct.name + '</div>'
      : '';
    return (
      '<div class="srs-back-head">' +
      '<div class="srs-thai-med">' +
      (p.thai || '') +
      ' ' +
      speakBtn(p.thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (p.rtgs || '') +
      '</div>' +
      '</div>' +
      '<div class="srs-meaning">' +
      '<div class="srs-meaning-es">' +
      (p.spanish || '') +
      '</div>' +
      (p.english ? '<div class="srs-meaning-en">' + p.english + '</div>' : '') +
      '</div>' +
      (p.note
        ? '<div class="srs-section"><div class="srs-section-text srs-note">' + p.note + '</div></div>'
        : '') +
      structTag
    );
  }

  // ----- LESSON renderers (from srs-ui.js L355-425) -----------------------

  function renderLessonWordFront(w: AnyCard): string {
    const tone = deps.renderTone(w.tone);
    return (
      '<div class="srs-card-type">PALABRA · LECCIÓN ' +
      (w.lesson || 1) +
      '</div>' +
      '<div class="srs-thai-big">' +
      w.thai +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (w.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '<div class="srs-card-hint">Toca para revelar ↻</div>'
    );
  }

  function renderLessonWordBack(w: AnyCard): string {
    const tone = deps.renderTone(w.tone);
    const head =
      '<div class="srs-back-head">' +
      '<div class="srs-thai-med">' +
      w.thai +
      ' ' +
      speakBtn(w.thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (w.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '</div>';
    const meaning =
      '<div class="srs-meaning">' +
      '<div class="srs-meaning-es">' +
      (w.spanish || '') +
      '</div>' +
      (w.en ? '<div class="srs-meaning-en">' + w.en + '</div>' : '') +
      '</div>';
    const cat = w.category
      ? '<div class="srs-struct-ref">Categoría: ' + w.category + '</div>'
      : '';
    return head + meaning + cat;
  }

  function renderLessonPhraseFront(p: AnyCard): string {
    const tone = deps.renderTone(p.tone);
    return (
      '<div class="srs-card-type">FRASE · LECCIÓN ' +
      (p.lesson || 1) +
      '</div>' +
      '<div class="srs-thai-med">' +
      p.thai +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (p.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '<div class="srs-card-hint">Toca para traducir ↻</div>'
    );
  }

  function renderLessonPhraseBack(p: AnyCard): string {
    const tone = deps.renderTone(p.tone);
    return (
      '<div class="srs-back-head">' +
      '<div class="srs-thai-med">' +
      p.thai +
      ' ' +
      speakBtn(p.thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (p.es || '') +
      '</div>' +
      (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
      '</div>' +
      '<div class="srs-meaning">' +
      '<div class="srs-meaning-es">' +
      (p.spanish || '') +
      '</div>' +
      (p.en ? '<div class="srs-meaning-en">' + p.en + '</div>' : '') +
      '</div>' +
      (p.category ? '<div class="srs-struct-ref">Categoría: ' + p.category + '</div>' : '')
    );
  }

  function renderLessonQuestionFront(q: AnyCard): string {
    return (
      '<div class="srs-card-type">PREGUNTA · LECCIÓN ' +
      (q.lesson || 1) +
      '</div>' +
      '<div class="srs-question-label">Pregunta</div>' +
      '<div class="srs-thai-med">' +
      (q.q_thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (q.q_es || '') +
      '</div>' +
      '<div class="srs-card-hint">Toca para ver respuesta ↻</div>'
    );
  }

  function renderLessonQuestionBack(q: AnyCard): string {
    return (
      '<div class="srs-back-head">' +
      '<div class="srs-question-label">Pregunta</div>' +
      '<div class="srs-thai-med">' +
      (q.q_thai || '') +
      ' ' +
      speakBtn(q.q_thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (q.q_es || '') +
      '</div>' +
      '<div class="srs-meaning-es srs-mini">' +
      (q.q_spanish || '') +
      '</div>' +
      '</div>' +
      '<div class="srs-section srs-answer-block">' +
      '<div class="srs-question-label">Respuesta</div>' +
      '<div class="srs-thai-med">' +
      (q.a_thai || '') +
      ' ' +
      speakBtn(q.a_thai || '') +
      '</div>' +
      '<div class="srs-phonetic-es">' +
      (q.a_es || '') +
      '</div>' +
      '<div class="srs-meaning-es srs-mini">' +
      (q.a_spanish || '') +
      '</div>' +
      '</div>'
    );
  }

  // ----- helpers (from srs-ui.js L428-450) ---------------------------------

  function stars(n: number): string {
    const full = '★'.repeat(Math.max(0, Math.min(5, n)));
    const empty = '☆'.repeat(5 - Math.max(0, Math.min(5, n)));
    return '<span class="srs-stars">' + full + empty + '</span>';
  }

  function speakBtn(text: string): string {
    function q(s: string): string {
      return (s || '').replace(/'/g, "\\'");
    }
    return (
      '<button class="srs-speak" onclick="event.stopPropagation();srsSpeak(\'' +
      q(text) +
      '\')" aria-label="Reproducir">▶</button>'
    );
  }

  function srsSpeak(text: string): void {
    deps.speakText(text);
  }

  function formatDuration(sec: number): string {
    if (!sec) return '0min';
    if (sec < 60) return sec + 's';
    const m = Math.round(sec / 60);
    if (m < 60) return m + 'min';
    const h = Math.floor(m / 60);
    return h + 'h ' + (m % 60) + 'min';
  }

  // ----- flip + rating (from srs-ui.js L455-564) --------------------------

  function bindCardStageTap(): void {
    const stage = deps.dom.getById('srsCardStage');
    if (!stage) return;
    stage.onclick = (e) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.srs-speak')) return;
      if (!srsCurrent || srsCurrent.revealed) return;
      revealCard();
    };
  }

  function revealCard(): void {
    if (!srsCurrent) return;
    srsCurrent.revealed = true;
    const card = deps.dom.getById('srsCard');
    if (card) card.classList.add('srs-card-revealed');
    const actions = deps.dom.getById('srsActions');
    if (actions) actions.classList.remove('srs-actions-hidden');
    const playBtn = deps.dom.getById('srsPlayPhrase') as HTMLButtonElement | null;
    if (playBtn) playBtn.hidden = false;
    const hint = deps.dom.querySelector('.srs-card-hint');
    if (hint) hint.style.display = 'none';
    deps.dom.vibrate(8);
    setTimeout(playSrsPhrase, 200);
  }

  function rateCurrent(rating: number): void {
    if (!srsCurrent) return;
    if (!srsCurrent.revealed) {
      revealCard();
      return;
    }
    const item = srsCurrent.queue[srsCurrent.idx];
    const deckKey = (item.deckKey || srsCurrent.deckKey) as SrsDeckKey;
    const decks = getSrsDecks();
    const deck = decks[deckKey];
    const cardId = deck.idOf(item.card);
    const intervals = previewIntervals(item.cardState);
    const nextState = recordRating(deckKey, cardId, rating);
    srsCurrent.sessionStats.reviewed++;
    if (item.isNew && rating >= 3) srsCurrent.sessionStats.learned++;
    deps.dom.vibrate(rating === 1 ? 30 : 10);
    showSrsToast('→ ' + intervals[rating], rating);
    if (nextState && nextState.state === 'learn') {
      const presentations = (item.presentations || 1) + 1;
      if (presentations <= 5) {
        const offset = reinsertOffset(nextState);
        const insertAt = Math.min(srsCurrent.idx + offset, srsCurrent.queue.length);
        const reinsertItem: SrsSessionItem = {
          card: item.card,
          cardState: nextState,
          isNew: false,
          isLearning: true,
          deckKey: item.deckKey,
          presentations,
        };
        srsCurrent.queue.splice(insertAt, 0, reinsertItem);
      }
    }
    setTimeout(advanceCard, 380);
    const ratingNames: SrsRating[] = ['again', 'hard', 'good', 'easy'];
    const r = ratingNames[rating - 1];
    if (r) gameBus.emit({ type: 'srs:review', rating: r, deck: String(deckKey) });
  }

  function reinsertOffset(nextState: SrsCardState): number {
    const now = Math.floor(Date.now() / 1000);
    const sec = nextState.due - now;
    if (sec <= 90) return 4;
    if (sec <= 600) return 8;
    return 12;
  }

  function showSrsToast(msg: string, rating: number): void {
    const existing = deps.dom.getById('srsToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'srsToast';
    toast.className = 'srs-toast srs-toast-r' + (rating || 3);
    toast.textContent = msg;
    deps.dom.appendToBody(toast);
    void toast.offsetWidth;
    toast.classList.add('srs-toast-show');
    setTimeout(() => {
      toast.classList.remove('srs-toast-show');
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 200);
    }, 700);
  }

  function advanceCard(): void {
    if (!srsCurrent) return;
    srsCurrent.idx++;
    if (srsCurrent.idx >= srsCurrent.queue.length) {
      finishSession();
      return;
    }
    if (srsCurrent.mixed) {
      const item = srsCurrent.queue[srsCurrent.idx];
      srsCurrent.deckKey = item.deckKey as SrsDeckKey;
    }
    renderStudyScreen();
  }

  function undoSrsLast(): void {
    if (!srsCurrent || srsCurrent.idx === 0) return;
    srsCurrent.idx--;
    srsCurrent.sessionStats.reviewed = Math.max(
      0,
      srsCurrent.sessionStats.reviewed - 1
    );
    renderStudyScreen();
  }

  function exitSrsSession(): void {
    if (!srsCurrent) return;
    const elapsed = Math.floor((Date.now() - srsCurrent.sessionStart) / 1000);
    bumpSrsStats(
      srsCurrent.sessionStats.reviewed,
      srsCurrent.sessionStats.learned,
      elapsed
    );
    srsCurrent = null;
    srsGoHome();
  }

  function finishSession(): void {
    if (!srsCurrent) return;
    const elapsed = Math.floor((Date.now() - srsCurrent.sessionStart) / 1000);
    const stats = bumpSrsStats(
      srsCurrent.sessionStats.reviewed,
      srsCurrent.sessionStats.learned,
      elapsed
    );
    const total = srsCurrent.queue.length;
    const learned = srsCurrent.sessionStats.learned;
    srsCurrent = null;
    const view = deps.dom.getById(srsHostId);
    if (!view) return;
    view.innerHTML =
      '<div class="srs-screen srs-done">' +
      '<div class="srs-done-check">✓</div>' +
      '<h2 class="srs-done-title">¡Hecho!</h2>' +
      '<div class="srs-done-stats">' +
      '<div class="srs-done-stat"><span class="num">' +
      total +
      '</span><span class="lbl">cartas</span></div>' +
      '<div class="srs-done-stat"><span class="num">' +
      learned +
      '</span><span class="lbl">nuevas</span></div>' +
      '<div class="srs-done-stat"><span class="num">' +
      formatDuration(elapsed) +
      '</span><span class="lbl">tiempo</span></div>' +
      '</div>' +
      '<div class="srs-done-today">Hoy llevas ' +
      (stats.reviewed || 0) +
      ' repasadas en ' +
      formatDuration(stats.timeSec || 0) +
      '</div>' +
      '<button class="srs-cta-primary" onclick="srsGoHome()">Volver a mazos</button>' +
      '</div>';
  }

  function renderSessionEmpty(deckKey: SrsDeckKey): string | void {
    const decks = getSrsDecks();
    const d = decks[deckKey];
    const view = deps.dom.getById(srsHostId);
    if (!view) return;
    view.innerHTML =
      '<div class="srs-screen srs-done">' +
      '<div class="srs-done-check">✓</div>' +
      '<h2 class="srs-done-title">' +
      (d ? d.label : 'Mazo') +
      ' al día</h2>' +
      '<div class="srs-done-sub">No hay cartas que repasar ahora.</div>' +
      '<button class="srs-cta-primary" onclick="srsGoHome()">Volver</button>' +
      '</div>';
  }

  // ----- mixed session (from srs-ui.js L610-647) --------------------------

  function priorityRank(item: SrsSessionItem): number {
    if (item.isLearning) return 0;
    if (item.cardState && item.cardState.due) return item.cardState.due;
    if (item.isNew) return Math.floor(Date.now() / 1000) + 1000000;
    return Math.floor(Date.now() / 1000);
  }

  function startMixedSession(): void {
    const keys = getActiveSrsDeckKeys();
    const all: SrsSessionItem[] = [];
    keys.forEach((key) => {
      const q = buildSession(key);
      q.forEach((item) => {
        all.push({
          deckKey: key,
          card: item.card,
          cardState: item.cardState,
          isNew: item.isNew,
        });
      });
    });
    all.sort((a, b) => priorityRank(a) - priorityRank(b));
    if (!all.length) {
      renderSessionEmpty(keys[0]);
      return;
    }
    srsCurrent = {
      deckKey: all[0].deckKey as SrsDeckKey,
      mixed: true,
      queue: all,
      idx: 0,
      sessionStart: Date.now(),
      sessionStats: { reviewed: 0, learned: 0 },
      revealed: false,
    };
    renderStudyScreen();
  }

  // ----- reset (from srs-ui.js L656-661) -----------------------------------

  function confirmResetAll(): void {
    // Legacy uses the global confirm() — preserved.
    const ok = typeof confirm === 'function'
      ? confirm(
          '¿Reiniciar todo el progreso SRS de este contexto? Esto borra las programaciones de cartas de los mazos visibles.'
        )
      : false;
    if (!ok) return;
    getActiveSrsDeckKeys().forEach((key) => resetSrsDeck(key));
    deps.persistence.removeStats();
    srsGoHome();
  }

  // ----- inspection helpers (used by tests + bridge) ----------------------

  return {
    loadSrsState,
    freshSrsState,
    saveSrsState,
    ensureSrsState,
    resetSrsDeck,
    getSrsDecks,
    getActiveSrsDeckKeys,
    getDeckStats,
    loadSrsStats,
    defaultStats,
    saveSrsStats,
    bumpSrsStats,
    buildSession,
    recordRating,
    findSrsCardByThai,
    scheduleNext,
    scheduleNextSM2,
    scheduleNextFSRS,
    getFsrsScheduler,
    previewIntervals,
    formatInterval,
    clampEf,
    mountSrsInline,
    unmountSrsInline,
    srsGoHome,
    renderSrsView,
    renderDeckPicker,
    renderDeckCard,
    startSrsSession,
    startMixedSession,
    renderStudyScreen,
    rateCurrent,
    revealCard,
    advanceCard,
    exitSrsSession,
    finishSession,
    renderSessionEmpty,
    undoSrsLast,
    playSrsPhrase,
    srsSpeak,
    confirmResetAll,
    getSrsCurrent: () => srsCurrent,
    setSrsCurrent: (c: SrsCurrent | null) => {
      srsCurrent = c;
    },
    getSrsHostId: () => srsHostId,
    getSrsOnExit: () => srsOnExit,
    getSrsDeckKeys: () => srsDeckKeys,
  };
}
