// Spike 5c PR1: Cards mode — pure-logic half extraction.
//
// Moves the data/filtering/scoring helpers that power the cards mode out of
// public/app.js into a typed module. PR2 will follow up and extract the DOM
// writes (showCard, flipCard, play-all FSM, rebuild, updateStats) — those
// callers will import this module via legacyBridge.
//
// The function bodies are line-for-line ports of public/app.js:262-460, 526-528,
// 21-22, and 933-978. Behavior is preserved exactly:
//   - activeType accepts both legacy plural ('words'/'phrases'/'conversations')
//     and typed singular ('word'/'phrase'/'conversation') forms. Legacy code
//     sets the plural values (public/app.js setType('words')); the typed state
//     module stores singular. Both flows reach this module via the bridge.
//   - Deleted Q&A keys are sourced from the injected `getDeletedQaKeys` dep
//     so the legacy `thai_deleted_qa` localStorage stays the source of truth.
//   - SHOW_UNVERIFIED is injected too (not inlined) for the same reason.
//
// External surface is intentionally a factory (`createCardsModule`) returning
// closures that share one lazy `thaiFreqMap`. The legacyBridge constructs a
// single instance and overrides window.* with its methods.

import {
  getActiveCategory,
  getActiveLesson,
  getActiveType,
  getSearchQuery,
} from '../../state';
import { cthaiPlaysStore } from '../../persistence/stores';
import type {
  Card,
  Conversation,
  DataShape,
  Pair,
  QaItem,
} from '../../types';

// ---------------------------------------------------------------------------
// Constants — mirrored verbatim from public/app.js (L17 + L935)
// ---------------------------------------------------------------------------

/** Audio repetitions per card during Play All. */
export const PLAY_REPS = 4;
/** Gap between repetitions of the same side (ms). */
export const REPEAT_GAP = 2000;
/** Gap between cards during Play All (ms). */
export const CARD_GAP = 3000;
/** cthai card is "done" once both Q and A reach this many plays. */
export const CTHAI_THRESHOLD = 10;

// ---------------------------------------------------------------------------
// Dependency injection — the bridge fills these with adapters for window.*
// ---------------------------------------------------------------------------

/** English-side cross-field lookup maps (config.js). */
export interface PhraseEnEntry {
  q: string;
  a: string;
}

export interface CardsModuleDeps {
  /** Active DATA object; undefined during bootstrap before data.js loads. */
  getData(): DataShape | undefined;
  /** Tone map (config.js). Always available. */
  getTones(): Record<string, { symbol: string; name: string; color: string }>;
  /** Optional Thai→English word lookup from config.js; {} if absent. */
  getThaiEn(): Record<string, string>;
  /** Optional Thai→English phrase lookup from config.js. */
  getPhraseEn(): Record<string, PhraseEnEntry | { q: string; a: string }>;
  /** Optional Thai→English conversation Q/A lookup from config.js. */
  getConvEn(): Record<string, PhraseEnEntry | { q: string; a: string }>;
  /** Category slug → display label. */
  getCatLabels(): Record<string, string>;
  /** TOP1000 word list (window.TOP1000_WORDS). */
  getTop1000Words(): Array<{ thai: string; rank: number }>;
  /** Deleted Q&A card keys (localStorage 'thai_deleted_qa'). */
  getDeletedQaKeys(): Set<string>;
  /** Whether to surface verified:false entries (cthai pilot content). */
  getShowUnverified(): boolean;
}

export interface CardsModule {
  buildDeck(): Card[];
  buildQuestionsDeck(): QaItem[];
  detectQTopic(thai: string): string;
  cardKey(item: Card | Conversation | { thai?: string; q_thai?: string; w1?: { thai?: string } } | null | undefined): string;
  isVerifiedEntry(c: Conversation): boolean;
  getThaiFreqMap(): Map<string, number>;
  cthaiCardId(item: Conversation): string;
  cthaiPlaysOf(id: string): { q: number; a: number };
  cthaiCardDone(item: Conversation): boolean;
  cthaiCountPlays(item: Conversation, which: 'q' | 'a'): number;
  cthaiCardFreqRank(item: Conversation): number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createCardsModule(deps: CardsModuleDeps): CardsModule {
  // Lazy cache of TOP1000 word→rank. Mirrors `_thaiFreqMap` in app.js.
  // Using Map instead of a plain object so iteration order is insertion-stable
  // and lookups behave identically to the legacy for-in loop.
  let thaiFreqMap: Map<string, number> | null = null;

  // --- filter helpers (buildDeck internals) --------------------------------

  function getLessonFilter() {
    const activeLesson = getActiveLesson();
    const youtubeOnly = activeLesson === 'youtube';
    const dificilesOnly = activeLesson === 'dificiles';
    const cthaiOnly = activeLesson === 'cthai';
    const lessonNum =
      activeLesson === 'all' || youtubeOnly || dificilesOnly || cthaiOnly
        ? null
        : parseInt(activeLesson, 10);
    return { youtubeOnly, dificilesOnly, cthaiOnly, lessonNum };
  }

  function matchLesson(
    item: { category?: string; verified?: boolean; lesson?: number },
    lf: ReturnType<typeof getLessonFilter>,
  ): boolean {
    if (lf.youtubeOnly) return item.category === 'youtube';
    if (lf.dificilesOnly) return true; // membership applied at call sites
    if (lf.cthaiOnly) return item.verified === false;
    return !lf.lessonNum || (item.lesson || 1) === lf.lessonNum;
  }

  function matchCategory(
    item: { category?: string },
    cat: string | null,
  ): boolean {
    return cat === 'all' || item.category === cat;
  }

  function matchTone(itemTone: string | undefined, tone: string | null): boolean {
    return !!tone && !!itemTone && itemTone.split('-').indexOf(tone) !== -1;
  }

  function matchSearch(item: Record<string, unknown>): boolean {
    const searchQuery = getSearchQuery();
    if (!searchQuery) return true;
    const fields: unknown[] = [
      item.spanish,
      item.es,
      item.en,
      item.thai,
      item.phonetic,
      item.q_spanish,
      item.a_spanish,
      item.q_es,
      item.a_es,
      item.q_en,
      item.a_en,
      item.note,
    ].filter((f) => f != null && f !== '');
    const thaiEn = deps.getThaiEn();
    const phraseEn = deps.getPhraseEn();
    const convEn = deps.getConvEn();
    if (item.thai && thaiEn[item.thai as string]) fields.push(thaiEn[item.thai as string]);
    const w1 = item.w1 as { thai?: string } | undefined;
    const w2 = item.w2 as { thai?: string } | undefined;
    if (w1 && w1.thai && thaiEn[w1.thai]) fields.push(thaiEn[w1.thai]);
    if (w2 && w2.thai && thaiEn[w2.thai]) fields.push(thaiEn[w2.thai]);
    if (item.thai && phraseEn[item.thai as string]) fields.push(phraseEn[item.thai as string]);
    if (item.q_thai && convEn[item.q_thai as string]) {
      const entry = convEn[item.q_thai as string];
      fields.push(entry.q, entry.a);
    }
    return fields.some(
      (f) => typeof f === 'string' && f.toLowerCase().indexOf(searchQuery) !== -1,
    );
  }

  // --- buildDeck (app.js:262-401) ------------------------------------------

  function buildDeck(): Card[] {
    const data = deps.getData();
    if (!data) return [];
    const items: Card[] = [];

    const activeCategory = getActiveCategory();
    const activeType = getActiveType();
    const lf = getLessonFilter();
    const isTone = activeCategory.startsWith('tone:');
    const isPares = activeCategory === 'pares';
    const isPractica = activeCategory === 'practica';
    const cat = isTone || isPares || isPractica ? null : activeCategory;
    const tone = isTone ? activeCategory.slice(5) : null;
    // Legacy app.js stores 'words'/'phrases'/'conversations' (plural). Typed
    // state stores singular. Accept both — see file header.
    const typeRaw = activeType as string;
    const isAll = typeRaw === 'all';
    const isWords = isAll || typeRaw === 'words' || typeRaw === 'word';
    const isPhrases = isAll || typeRaw === 'phrases' || typeRaw === 'phrase';
    const isConv = isAll || typeRaw === 'conversations' || typeRaw === 'conversation';
    const isPairs = isAll || typeRaw === 'pairs' || typeRaw === 'pair';

    // Pares mode: only pair cards, ignoring type filter.
    if (isPares) {
      if (data.pairs) {
        const wordMap: Record<string, (typeof data.words)[number]> = {};
        data.words.forEach((w) => { wordMap[w.thai] = w; });
        data.pairs
          .filter((p: Pair) => {
            if (getSearchQuery()) {
              const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
              const pairItem: Record<string, unknown> = {
                spanish: ((w1 && w1.spanish) || '') + ' ' + ((w2 && w2.spanish) || ''),
                note: p.note,
              };
              if (
                !matchSearch(pairItem) &&
                !(w1 && matchSearch(w1 as unknown as Record<string, unknown>)) &&
                !(w2 && matchSearch(w2 as unknown as Record<string, unknown>))
              )
                return false;
            }
            return true;
          })
          .forEach((p: Pair) => {
            const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
            if (w1 && w2) {
              items.push({
                type: 'pair',
                w1: w1,
                w2: w2,
                note: p.note,
                category: p.category,
                thai: (p.w1 + ' / ' + p.w2) as never,
              } as unknown as Card);
            }
          });
      }
      return items;
    }

    // Practica mode: only practice-phrase cards.
    if (isPractica) {
      if (data.practica) {
        data.practica
          .filter((p) => {
            if (!matchLesson(p, lf)) return false;
            return matchSearch(p as unknown as Record<string, unknown>);
          })
          .forEach((p) => {
            items.push(
              Object.assign({}, p, { type: 'phrase', highlightTone: null }) as unknown as Card,
            );
          });
      }
      return items;
    }

    if (isWords) {
      data.words
        .filter((w) => {
          if (!matchLesson(w, lf)) return false;
          if (isTone) return matchTone(w.tone, tone) && matchSearch(w as unknown as Record<string, unknown>);
          if (!matchSearch(w as unknown as Record<string, unknown>)) return false;
          return matchCategory(w, cat);
        })
        .forEach((w) => {
          items.push(Object.assign({}, w, { type: 'word' }) as unknown as Card);
        });
    }

    if (isPhrases) {
      data.phrases
        .filter((p) => {
          if (!matchLesson(p, lf)) return false;
          if (!matchSearch(p as unknown as Record<string, unknown>)) return false;
          if (isTone) return matchTone(p.tone, tone);
          return matchCategory(p, cat);
        })
        .forEach((p) => {
          items.push(
            Object.assign({}, p, { type: 'phrase', highlightTone: tone }) as unknown as Card,
          );
        });
    }

    if (data.conversations && isConv) {
      const deletedKeys = deps.getDeletedQaKeys();
      data.conversations
        .filter((c) => {
          if (!isVerifiedEntry(c)) return false;
          const dkey = (c.q_thai || '') + '||' + (c.a_thai || '');
          if (deletedKeys.has(dkey)) return false;
          if (!matchLesson(c, lf)) return false;
          if (!matchSearch(c as unknown as Record<string, unknown>)) return false;
          if (isTone) return matchTone(c.q_tone, tone) || matchTone(c.a_tone, tone);
          return matchCategory(c, cat);
        })
        .forEach((c) => {
          items.push(
            Object.assign({}, c, { type: 'conversation', highlightTone: tone }) as unknown as Card,
          );
        });
    }

    if (data.pairs && isPairs) {
      const wordMap: Record<string, (typeof data.words)[number]> = {};
      data.words.forEach((w) => { wordMap[w.thai] = w; });
      data.pairs
        .filter((p: Pair) => {
          // cthai scope: pairs are not cthai content — skip entirely.
          if (getActiveLesson() === 'cthai') return false;
          if (getSearchQuery()) {
            const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
            const pairItem: Record<string, unknown> = {
              spanish: ((w1 && w1.spanish) || '') + ' ' + ((w2 && w2.spanish) || ''),
              note: p.note,
            };
            if (
              !matchSearch(pairItem) &&
              !(w1 && matchSearch(w1 as unknown as Record<string, unknown>)) &&
              !(w2 && matchSearch(w2 as unknown as Record<string, unknown>))
            )
              return false;
          }
          if (isTone) {
            const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
            return (
              (w1 && matchTone(w1.tone, tone)) || (w2 && matchTone(w2.tone, tone))
            );
          }
          return matchCategory(p, cat);
        })
        .forEach((p: Pair) => {
          const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
          if (w1 && w2) {
            items.push({
              type: 'pair',
              w1: w1,
              w2: w2,
              note: p.note,
              category: p.category,
              thai: (p.w1 + ' / ' + p.w2) as never,
            } as unknown as Card);
          }
        });
    }

    return items;
  }

  // --- detectQTopic (app.js:403-416) ---------------------------------------

  function detectQTopic(thai: string): string {
    if (!thai) return 'presente';
    if (thai.indexOf('จะ') !== -1) return 'futuro';
    if (thai.indexOf('อยาก') !== -1) return 'querer';
    if (thai.indexOf('ชอบ') !== -1) return 'gustar';
    if (thai.indexOf('ไม่') !== -1) return 'negación';
    if (thai.indexOf('กำลัง') !== -1) return 'progresivo';
    if (thai.indexOf('แล้ว') !== -1) return 'pasado';
    if (thai.indexOf('ไหม') !== -1) return 'pregunta sí/no';
    if (thai.indexOf('ที่ไหน') !== -1) return 'pregunta dónde';
    if (thai.indexOf('อะไร') !== -1) return 'pregunta qué';
    if (thai.indexOf('กี่') !== -1 || thai.indexOf('เท่าไหร่') !== -1) return 'pregunta cuánto';
    return 'presente';
  }

  // --- buildQuestionsDeck (app.js:420-460) ---------------------------------

  function buildQuestionsDeck(): QaItem[] {
    const data = deps.getData();
    if (!data) return [];
    const activeLesson = getActiveLesson();
    const maxL = activeLesson === 'all' ? Infinity : parseInt(activeLesson, 10);
    const items: QaItem[] = [];
    const seen: Record<string, boolean> = {};

    function push(item: QaItem): void {
      const key =
        (item.q_thai || '') + '||' + (item.a_thai || '') + '||' +
        (item.q_spanish || '') + '||' + (item.a_spanish || '');
      if (seen[key]) return;
      seen[key] = true;
      items.push(item);
    }

    // Existing conversations — proper Q&A pairs.
    // Skip cards the user deleted via 🗑️ (persisted in localStorage).
    const deleted = deps.getDeletedQaKeys();
    (data.conversations || []).forEach((c) => {
      if ((c.lesson || 1) > maxL) return;
      const dkey = (c.q_thai || '') + '||' + (c.a_thai || '');
      if (deleted.has(dkey)) return;
      push({
        type: 'qa',
        source: 'conversación',
        topic: c.category,
        tense: detectQTopic(c.q_thai),
        q_thai: c.q_thai,
        q_phonetic: c.q_phonetic,
        q_es: c.q_es,
        q_en: c.q_en || c.q_spanish,
        q_spanish: c.q_spanish,
        a_thai: c.a_thai,
        a_phonetic: c.a_phonetic,
        a_es: c.a_es,
        a_en: c.a_en || c.a_spanish,
        a_spanish: c.a_spanish,
      } as unknown as QaItem);
    });

    return items;
  }

  // --- cardKey (app.js:526-528) --------------------------------------------

  function cardKey(
    item: Card | Conversation | { thai?: string; q_thai?: string; w1?: { thai?: string } } | null | undefined,
  ): string {
    if (!item) return '';
    const c = item as { thai?: string; q_thai?: string; w1?: { thai?: string } };
    return c.thai || c.q_thai || (c.w1 && c.w1.thai) || '';
  }

  // --- isVerifiedEntry (app.js:21-22) --------------------------------------

  function isVerifiedEntry(c: Conversation): boolean {
    return deps.getShowUnverified() || c.verified !== false;
  }

  // --- cthai helpers (app.js:933-978) --------------------------------------

  function getThaiFreqMap(): Map<string, number> {
    if (thaiFreqMap) return thaiFreqMap;
    thaiFreqMap = new Map<string, number>();
    const words = deps.getTop1000Words();
    for (const w of words) {
      if (w.thai && w.rank && !thaiFreqMap.has(w.thai)) {
        thaiFreqMap.set(w.thai, w.rank);
      }
    }
    return thaiFreqMap;
  }

  function cthaiCardId(item: Conversation): string {
    return (
      ((item as unknown as { source?: string }).source || 'nosrc') + '||' +
      (item.q_thai || '') + '||' + (item.a_thai || '')
    );
  }

  function cthaiPlaysOf(id: string): { q: number; a: number } {
    const p = cthaiPlaysStore.get()[id];
    return { q: p?.q ?? 0, a: p?.a ?? 0 };
  }

  function cthaiCardDone(item: Conversation): boolean {
    const p = cthaiPlaysOf(cthaiCardId(item));
    return (p.q || 0) >= CTHAI_THRESHOLD && (p.a || 0) >= CTHAI_THRESHOLD;
  }

  function cthaiCountPlays(item: Conversation, which: 'q' | 'a'): number {
    return Math.min(cthaiPlaysOf(cthaiCardId(item))[which] || 0, CTHAI_THRESHOLD);
  }

  function cthaiCardFreqRank(item: Conversation): number {
    const fm = getThaiFreqMap();
    const text = (item.q_thai || '') + (item.a_thai || '');
    let minRank = Infinity;
    for (const [word, rank] of fm) {
      if (text.indexOf(word) !== -1 && rank < minRank) minRank = rank;
    }
    return minRank === Infinity ? 9999 : minRank;
  }

  return {
    buildDeck,
    buildQuestionsDeck,
    detectQTopic,
    cardKey,
    isVerifiedEntry,
    getThaiFreqMap,
    cthaiCardId,
    cthaiPlaysOf,
    cthaiCardDone,
    cthaiCountPlays,
    cthaiCardFreqRank,
  };
}
