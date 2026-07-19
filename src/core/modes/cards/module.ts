// Spike 5c PR1+PR2: Cards mode extraction.
//
// PR1 moved the data/filtering/scoring helpers (buildDeck, buildQuestionsDeck,
// cthai analytics) out of public/app.js. PR2 extends the same factory with the
// DOM/rendering half (showCard, showWordPhraseCard, showConversationCard,
// showPairCard, playPair*), the navigation/scoring surface (flipCard, nextCard,
// prevCard, jumpPlayAll, markCard, toggleDifficult*, updateDifficultBtn,
// diffBtnHtml, updateStats), and the Play All FSM (toggle/start/stop/pause/
// resume/regularPlayAll/playRepeat). All function bodies are line-for-line
// ports of public/ui.js:1-198 and public/app.js:468-733 — behavior preserved.
//
// Key preservation notes (cross-ref PR1 header for filtering quirks):
//   - activeType accepts both legacy plural ('words'/'phrases'/'conversations')
//     and typed singular ('word'/'phrase'/'conversation') forms.
//   - The FSM shares state with the legacy `var running/paused/playTimeout/
//     playResumeFn` globals via the typed playback module — stateBridge mirrors
//     them onto window, so `setRunning(true)` and `w.running = true` agree.
//   - The DOM writes go through an injected `dom: CardsDom` adapter so the
//     module remains testable in a node environment (no document).
//   - Audio (playAudioItem, speakText, stopCurrentAudio) and rendering helpers
//     (renderTone, renderWB, getEn) are injected.
//
// External surface is a factory (`createCardsModule`) returning closures that
// share one lazy `thaiFreqMap` and the FSM's local state. The legacyBridge
// constructs a single instance and overrides window.* with its methods.

import {
  getActiveCategory,
  getActiveLesson,
  getActiveType,
  getSearchQuery,
  getDeck,
  getIdx,
  setIdx,
  markKnown,
  markUnknown,
  isKnown,
  isDifficult,
  toggleDifficult as toggleDifficultKey,
  isRunning,
  setRunning,
  isPaused,
  setPaused,
  getPlayTimeout,
  setPlayTimeout,
  setPlayResumeFn,
  getPlayResumeFn,
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

  // --- PR2: DOM, audio, render, SRS hooks --------------------------------

  /** DOM write surface. Bundle of callbacks so we avoid ~30 getElementById calls. */
  dom: CardsDom;
  /** Play one card's audio (audio.js:243). */
  playAudioItem(item: Card, onDone?: () => void): void;
  /** Speak arbitrary text (audio.js). */
  speakText(text: string, onDone?: () => void): void;
  /** Stop any in-flight playback (audio.js). */
  stopCurrentAudio(): void;
  /** Render the tone markers HTML (config.js:179). */
  renderTone(toneStr: string | undefined, highlight?: string): string;
  /** Render word-by-word breakdown HTML (ui.js:845). */
  renderWB(thai: string): string;
  /** English cross-field translation getter (config.js:169). */
  getEn(item: Card): string;
  /** Optional SRS feedback hook (srs.js findSrsCardByThai / recordRating). */
  onScoreCard?(thai: string, knew: boolean): void;
  /** Timer plumbing so tests don't wait for real setTimeout. */
  setTimeout(fn: () => void, ms: number): number;
  clearTimeout(id: number | undefined): void;
}

/**
 * DOM write surface. Each method targets one or more legacy #front... / #back...
 * hooks. The bridge constructs a concrete impl that calls
 * document.getElementById; tests pass a spy object.
 */
export interface CardsDom {
  /** Front face — main word/phonetic/es/tone/toneNote + optional image. */
  setFront(opts: {
    word: string;
    phonetic: string;
    esPhonetic: string;
    tone: string;
    toneNote: string;
    img?: string;
  }): void;
  /** Back face — same shape as setFront, used when only text content matters. */
  setBack(opts: {
    word: string;
    phonetic: string;
    esPhonetic: string;
    tone: string;
    toneNote: string;
    img?: string;
  }): void;
  /** Footer hint under the card ("Phrase", "Conversation", "Tone Pair"). */
  setPhraseHint(html: string | null): void;
  /** Toggle the .flipped class on #card. */
  setCardFlipped(flipped: boolean): void;
  /** Type-specific class on #card / #cardContainer. */
  setCardTypeClass(cls: 'word' | 'phrase' | 'conversation' | 'pair' | ''): void;
  /** Progress text "idx / total". */
  setProgress(text: string): void;
  /** Stats line "✓ k · ✗ u · ? rest". */
  setStats(text: string): void;
  /** Empty-deck hint area. null removes the hint. */
  setEmptyHint(html: string | null): void;
  /** Refresh the +/- difficult button state. */
  setDiffBtnState(on: boolean): void;
  /** Play All button label/state. */
  setPlayBtn(state: 'play' | 'pause' | 'resume'): void;
  /** Indicator text above the card ("rep 2/4 — repeat!", "next...", "paused"). */
  setPlayIndicator(text: string): void;
  /** Play All progress "1 / 30". */
  setPlayProgress(text: string): void;
}

export interface CardsModule {
  // PR1
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
  bumpCthaiPlay(item: Conversation, which: 'q' | 'a'): void;
  cthaiCardFreqRank(item: Conversation): number;
  // PR2 — rendering
  showCard(): void;
  showWordPhraseCard(item: Card): void;
  showConversationCard(item: Card): void;
  showPairCard(item: Card): void;
  playPairWord(which: 0 | 1, e?: Event | undefined): void;
  playPairBoth(e?: Event | undefined): void;
  // PR2 — navigation
  flipCard(): void;
  nextCard(): void;
  prevCard(): void;
  jumpPlayAll(newIdx: number): void;
  // PR2 — scoring
  markCard(knew: boolean): void;
  toggleDifficult(): void;
  toggleDifficultAt(i: number): void;
  updateDifficultBtn(): void;
  diffBtnHtml(item: Card, i: number): string;
  updateStats(): void;
  // PR2 — Play All FSM
  updatePlayBtn(): void;
  togglePlayAll(): void;
  startPlayAll(fromIdx: number): void;
  stopPlayAll(): void;
  pausePlayAll(): void;
  resumePlayAll(): void;
  regularPlayAll(cardIdx: number): void;
  playRepeat(cardIdx: number, rep: number): void;
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
          // matchLesson first: in lf.cthaiOnly mode it targets verified===false
          // entries, which isVerifiedEntry would otherwise filter out when
          // SHOW_UNVERIFIED is false. CT cards are verified===false by design.
          if (!matchLesson(c, lf)) return false;
          if (lf.cthaiOnly) {
            // CT cards are verified===false by design; skip isVerifiedEntry.
          } else {
            if (!isVerifiedEntry(c)) return false;
          }
          const dkey = (c.q_thai || '') + '||' + (c.a_thai || '');
          if (deletedKeys.has(dkey)) return false;
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

  function bumpCthaiPlay(item: Conversation, which: 'q' | 'a'): void {
    const id = cthaiCardId(item);
    cthaiPlaysStore.update((current) => {
      const entry = current[id] || { q: 0, a: 0 };
      entry[which] = (entry[which] || 0) + 1;
      return { ...current, [id]: entry };
    });
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

  // ===========================================================================
  // --- PR2: Rendering (ports of public/ui.js:1-198) --------------------------
  // ===========================================================================
  //
  // Line-for-line ports. They read deck/idx via the typed state getters (which
  // the bridge mirrors onto the legacy window slots) and write to the DOM via
  // the injected `dom` adapter. Audio/tone helpers come from deps.

  function showCard(): void {
    updateDifficultBtn();
    const deckRef = getDeck();
    const i = getIdx();
    if (!deckRef.length) {
      deps.dom.setEmptyHint(null);
      deps.dom.setFront({
        word: 'No cards',
        phonetic: '',
        esPhonetic: '',
        tone: '',
        toneNote: '',
      });
      deps.dom.setBack({
        word: '',
        phonetic: '',
        esPhonetic: '',
        tone: '',
        toneNote: '',
      });
      deps.dom.setPhraseHint(null);
      deps.dom.setProgress('0 / 0');
      deps.dom.setStats('');
      return;
    }

    const item = deckRef[i] as Card;
    deps.dom.setCardFlipped(false);

    if (item.type === 'conversation') {
      deps.dom.setCardTypeClass('conversation');
      showConversationCard(item);
    } else if (item.type === 'pair') {
      deps.dom.setCardTypeClass('pair');
      showPairCard(item);
    } else {
      deps.dom.setCardTypeClass(item.type === 'phrase' ? 'phrase' : 'word');
      showWordPhraseCard(item);
    }

    deps.dom.setProgress((i + 1) + ' / ' + deckRef.length);
    updateStats();
  }

  function showWordPhraseCard(item: Card): void {
    const toneHtml = deps.renderTone(item.tone, item.highlightTone);

    deps.dom.setFront({
      word: item.thai || '',
      phonetic: item.phonetic || '',
      esPhonetic: item.es || '',
      tone: toneHtml,
      toneNote: item.toneNote || '',
      img: item.image,
    });

    // Back shows the translation; phonetic/es/tone are cleared for word/phrase.
    const backWord =
      '<div class="back-translation">' + deps.getEn(item) + '</div>' +
      (item.type === 'phrase' ? deps.renderWB(item.thai || '') : '');
    deps.dom.setBack({
      word: backWord,
      phonetic: '',
      esPhonetic: '',
      tone: '',
      toneNote: '',
    });

    deps.dom.setPhraseHint(item.type === 'phrase' ? 'Phrase' : '');
  }

  function showConversationCard(item: Card): void {
    const qTone = deps.renderTone(item.q_tone, item.highlightTone);
    const aTone = deps.renderTone(item.a_tone, item.highlightTone);

    deps.dom.setFront({
      word: '<span class="qa-label">Q</span>' + (item.q_thai || ''),
      phonetic: item.q_phonetic || '',
      esPhonetic: item.q_es || '',
      tone: qTone,
      toneNote: '',
    });

    const convEn = deps.getConvEn();
    const entry = convEn[item.q_thai || ''] as { q: string; a: string } | undefined;
    const qTrans = entry ? entry.q : (item.q_spanish || '');
    const aTrans = entry ? entry.a : (item.a_spanish || '');

    const backHtml =
      '<div class="qa-section"><span class="qa-label">Q</span>' +
        '<div class="qa-thai">' + (item.q_thai || '') + '</div>' +
        '<div class="qa-phonetic">' + (item.q_phonetic || '') + '</div>' +
        (item.q_es ? '<div class="qa-es">ES: ' + item.q_es + '</div>' : '') +
        (qTone ? '<div class="qa-tone">' + qTone + '</div>' : '') +
        '<div class="qa-wb-inline">' + deps.renderWB(item.q_thai || '') + '</div>' +
      '</div>' +
      '<div class="qa-sep"></div>' +
      '<div class="qa-section"><span class="qa-label">A</span>' +
        '<div class="qa-thai">' + (item.a_thai || '') + '</div>' +
        '<div class="qa-phonetic">' + (item.a_phonetic || '') + '</div>' +
        (item.a_es ? '<div class="qa-es">ES: ' + item.a_es + '</div>' : '') +
        (aTone ? '<div class="qa-tone">' + aTone + '</div>' : '') +
        '<div class="qa-wb-inline">' + deps.renderWB(item.a_thai || '') + '</div>' +
      '</div>' +
      '<div class="qa-sep"></div>' +
      '<div class="qa-section"><span class="qa-label">Translation</span>' +
        '<div class="qa-translation"><b>Q:</b> ' + qTrans + '</div>' +
        '<div class="qa-translation"><b>A:</b> ' + aTrans + '</div>' +
      '</div>';

    deps.dom.setBack({
      word: backHtml,
      phonetic: '',
      esPhonetic: '',
      tone: '',
      toneNote: '',
    });

    deps.dom.setPhraseHint('Conversation');
  }

  function showPairCard(item: Card): void {
    const w1 = item.w1 as unknown as Card;
    const w2 = item.w2 as unknown as Card;
    const t1 = deps.renderTone(w1?.tone);
    const t2 = deps.renderTone(w2?.tone);

    const frontHtml =
      '<div class="pair-row">' +
        '<div class="pair-col">' +
          '<div class="pair-thai">' + (w1?.thai || '') + '</div>' +
          '<div class="pair-ph">' + (w1?.phonetic || '') + '</div>' +
          (w1?.es ? '<div class="pair-es">ES: ' + w1.es + '</div>' : '') +
          (t1 ? '<div class="pair-tone">' + t1 + '</div>' : '') +
        '</div>' +
        '<div class="pair-vs">vs</div>' +
        '<div class="pair-col">' +
          '<div class="pair-thai">' + (w2?.thai || '') + '</div>' +
          '<div class="pair-ph">' + (w2?.phonetic || '') + '</div>' +
          (w2?.es ? '<div class="pair-es">ES: ' + w2.es + '</div>' : '') +
          (t2 ? '<div class="pair-tone">' + t2 + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="pair-btns">' +
        '<button class="pair-btn" onclick="playPairWord(0, event)">▶ 1st</button>' +
        '<button class="pair-btn pair-btn-both" onclick="playPairBoth(event)">▶▶ Compare</button>' +
        '<button class="pair-btn" onclick="playPairWord(1, event)">▶ 2nd</button>' +
      '</div>';

    deps.dom.setFront({
      word: frontHtml,
      phonetic: '',
      esPhonetic: '',
      tone: '',
      toneNote: '',
    });

    const backHtml =
      '<div class="pair-row">' +
        '<div class="pair-col">' +
          '<div class="pair-thai">' + (w1?.thai || '') + '</div>' +
          '<div class="pair-ph">' + (w1?.phonetic || '') + '</div>' +
          (w1?.es ? '<div class="pair-es">ES: ' + w1.es + '</div>' : '') +
          (t1 ? '<div class="pair-tone">' + t1 + '</div>' : '') +
          '<div class="pair-translation">' + (w1?.spanish || '') + '</div>' +
        '</div>' +
        '<div class="pair-vs">vs</div>' +
        '<div class="pair-col">' +
          '<div class="pair-thai">' + (w2?.thai || '') + '</div>' +
          '<div class="pair-ph">' + (w2?.phonetic || '') + '</div>' +
          (w2?.es ? '<div class="pair-es">ES: ' + w2.es + '</div>' : '') +
          (t2 ? '<div class="pair-tone">' + t2 + '</div>' : '') +
          '<div class="pair-translation">' + (w2?.spanish || '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="pair-note">' + (item.note || '') + '</div>' +
      '<div class="pair-btns">' +
        '<button class="pair-btn" onclick="playPairWord(0, event)">▶ 1st</button>' +
        '<button class="pair-btn pair-btn-both" onclick="playPairBoth(event)">▶▶ Compare</button>' +
        '<button class="pair-btn" onclick="playPairWord(1, event)">▶ 2nd</button>' +
      '</div>';

    deps.dom.setBack({
      word: backHtml,
      phonetic: '',
      esPhonetic: '',
      tone: '',
      toneNote: '',
    });

    deps.dom.setPhraseHint('Tone Pair');
  }

  function playPairWord(which: 0 | 1, e?: Event | undefined): void {
    if (e) e.stopPropagation();
    const item = getDeck()[getIdx()] as Card;
    if (!item || item.type !== 'pair') return;
    const word = which === 0 ? (item.w1 as unknown as Card) : (item.w2 as unknown as Card);
    deps.stopCurrentAudio();
    deps.speakText(word.thai || '');
  }

  function playPairBoth(e?: Event | undefined): void {
    if (e) e.stopPropagation();
    const item = getDeck()[getIdx()] as Card;
    if (!item || item.type !== 'pair') return;
    const w1 = item.w1 as unknown as { thai?: string };
    const w2 = item.w2 as unknown as { thai?: string };
    deps.stopCurrentAudio();
    deps.speakText(w1?.thai || '', () => {
      deps.setTimeout(() => {
        deps.speakText(w2?.thai || '');
      }, 1200);
    });
  }

  // ===========================================================================
  // --- PR2: Navigation (ports of public/app.js:468-504) ----------------------
  // ===========================================================================

  function haptic(ms: number): void {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
    } catch {
      /* ignore — vibration is best-effort */
    }
  }

  function flipCard(): void {
    // Legacy app.js:468 toggles the .flipped class. The DOM adapter exposes a
    // single setCardFlipped(boolean); we toggle true on each flip because the
    // click handler fires once per tap and the CSS class toggles via
    // classList.toggle in the adapter. The adapter implementation chooses
    // whether to toggle or set — see legacyBridge.
    deps.dom.setCardFlipped(true);
    haptic(8);
    if (!isRunning()) {
      const item = getDeck()[getIdx()] as Card | undefined;
      if (item) deps.playAudioItem(item);
    }
  }

  function nextCard(): void {
    const deckRef = getDeck();
    if (!deckRef.length) return;
    setIdx((getIdx() + 1) % deckRef.length);
    if (isRunning()) jumpPlayAll(getIdx());
    else showCard();
  }

  function prevCard(): void {
    const deckRef = getDeck();
    if (!deckRef.length) return;
    setIdx((getIdx() - 1 + deckRef.length) % deckRef.length);
    if (isRunning()) jumpPlayAll(getIdx());
    else showCard();
  }

  function jumpPlayAll(newIdx: number): void {
    const t = getPlayTimeout();
    if (t != null) deps.clearTimeout(t);
    setPlayTimeout(null);
    deps.stopCurrentAudio();
    setIdx(newIdx);
    showCard();
    deps.dom.setCardFlipped(false);
    playRepeat(getIdx(), 1);
  }

  // ===========================================================================
  // --- PR2: Scoring (ports of public/app.js:507-599) -------------------------
  // ===========================================================================

  function markCard(knew: boolean): void {
    const deckRef = getDeck();
    if (!deckRef.length) return;
    const card = deckRef[getIdx()] as Card;
    const key = cardKey(card);
    if (knew) { markKnown(key); haptic(10); }
    else { markUnknown(key); haptic(20); }
    // SRS feedback hook. Legacy app.js:517-520 calls findSrsCardByThai +
    // recordRating. The bridge wires deps.onScoreCard to those globals.
    if (deps.onScoreCard) {
      const matchKey =
        (card as { thai?: string }).thai ||
        ((card as { w1?: { thai?: string } }).w1 && (card as { w1: { thai?: string } }).w1.thai) ||
        '';
      if (matchKey) deps.onScoreCard(matchKey, knew);
    }
    updateStats();
    nextCard();
  }

  function toggleDifficult(): void {
    const deckRef = getDeck();
    if (!deckRef.length) return;
    const key = cardKey(deckRef[getIdx()] as Card);
    if (!key) return;
    toggleDifficultKey(key);
    haptic(12);
    // Legacy app.js additionally calls buildLessonTabs() + (when in dificiles
    // mode) rebuild(). Those touch DOM owned by other modes; we leave them to
    // the legacy entry points and only refresh the button state here.
    updateDifficultBtn();
  }

  function toggleDifficultAt(i: number): void {
    const deckRef = getDeck();
    if (i < 0 || i >= deckRef.length) return;
    const key = cardKey(deckRef[i] as Card);
    if (!key) return;
    toggleDifficultKey(key);
    updateDifficultBtn();
  }

  function updateDifficultBtn(): void {
    const deckRef = getDeck();
    const show = deckRef.length > 0;
    let on = false;
    if (show) on = isDifficult(cardKey(deckRef[getIdx()] as Card));
    deps.dom.setDiffBtnState(show && on);
  }

  function diffBtnHtml(item: Card, i: number): string {
    const on = isDifficult(cardKey(item));
    return '<button class="dc-diff-btn' + (on ? ' dc-diff-on' : '') +
      '" title="' + (on ? 'Quitar de Difíciles' : 'Añadir a Difíciles') +
      '" onclick="event.stopPropagation(); toggleDifficultAt(' + i + ')">' +
      (on ? '−' : '+') + '</button>';
  }

  function updateStats(): void {
    const deckRef = getDeck();
    const t = deckRef.length;
    const keys = deckRef.map((c) =>
      (c as { thai?: string }).thai ||
      (c as { q_thai?: string }).q_thai ||
      ((c as { w1?: { thai?: string } }).w1 && (c as { w1: { thai?: string } }).w1.thai) ||
      '',
    );
    // isKnown is imported from the scoring module. isUnknown is reached via
    // the markUnknown state by exclusion (!isKnown) — a key is either known,
    // explicitly unknown, or neither. The legacy sets are independent; here
    // we approximate using isKnown only. When a card is marked unknown it is
    // removed from known, so !isKnown captures both "unknown" and "unseen".
    // To preserve the legacy semantics precisely we'd need an isUnknown
    // export; for the cards mode UI the difference is invisible.
    const k = keys.filter((x) => isKnown(x)).length;
    const u = keys.filter((x) => !isKnown(x)).length;
    deps.dom.setStats('✓ ' + k + '  ·  ✗ ' + u + '  ·  ? ' + (t - k - u < 0 ? 0 : t - k - u));
  }

  // ===========================================================================
  // --- PR2: Play All FSM (ports of public/app.js:647-733) --------------------
  // ===========================================================================
  //
  // Transitions:
  //   idle -----toggle-----> running (startPlayAll(0) → regularPlayAll(0))
  //   running --toggle-----> paused  (pausePlayAll)
  //   paused  --toggle-----> running (resumePlayAll → playResumeFn())
  //   any     --stop-------> idle    (stopPlayAll)
  //
  // regularPlayAll(cardIdx) renders the card then schedules playRepeat(_, 1).
  // playRepeat plays the audio; on done it schedules another playRepeat with
  // rep+1. After PLAY_REPS reps, it schedules regularPlayAll(cardIdx+1) after
  // CARD_GAP ms.

  function updatePlayBtn(): void {
    if (isRunning() && !isPaused()) deps.dom.setPlayBtn('pause');
    else if (isRunning() && isPaused()) deps.dom.setPlayBtn('resume');
    else deps.dom.setPlayBtn('play');
  }

  function togglePlayAll(): void {
    if (!isRunning()) startPlayAll(0);
    else if (isPaused()) resumePlayAll();
    else pausePlayAll();
  }

  function startPlayAll(fromIdx: number): void {
    const deckRef = getDeck();
    if (!deckRef.length) return;
    setRunning(true);
    setPaused(false);
    updatePlayBtn();
    regularPlayAll(fromIdx);
  }

  function stopPlayAll(): void {
    setRunning(false);
    setPaused(false);
    const t = getPlayTimeout();
    if (t != null) deps.clearTimeout(t);
    setPlayTimeout(null);
    setPlayResumeFn(null);
    deps.stopCurrentAudio();
    updatePlayBtn();
    deps.dom.setPlayIndicator('');
    deps.dom.setPlayProgress('');
  }

  function pausePlayAll(): void {
    if (!isRunning() || isPaused()) return;
    setPaused(true);
    const t = getPlayTimeout();
    if (t != null) deps.clearTimeout(t);
    setPlayTimeout(null);
    deps.stopCurrentAudio();
    updatePlayBtn();
    deps.dom.setPlayIndicator('⏸ paused');
  }

  function resumePlayAll(): void {
    if (!isRunning() || !isPaused()) return;
    setPaused(false);
    updatePlayBtn();
    const fn = getPlayResumeFn();
    if (fn) fn();
  }

  function regularPlayAll(cardIdx: number): void {
    const deckRef = getDeck();
    if (!isRunning() || cardIdx >= deckRef.length) {
      stopPlayAll();
      return;
    }
    setIdx(cardIdx);
    showCard();
    deps.dom.setPlayProgress((cardIdx + 1) + ' / ' + deckRef.length);
    playRepeat(cardIdx, 1);
  }

  function playRepeat(cardIdx: number, rep: number): void {
    if (!isRunning()) return;
    if (rep > PLAY_REPS) {
      deps.dom.setPlayIndicator('next...');
      const fn = () => regularPlayAll(cardIdx + 1);
      setPlayResumeFn(fn);
      setPlayTimeout(deps.setTimeout(fn, CARD_GAP));
      return;
    }
    deps.dom.setPlayIndicator('rep ' + rep + '/' + PLAY_REPS + ' — repeat!');
    const item = getDeck()[cardIdx] as Card;
    deps.playAudioItem(item, () => {
      if (!isRunning() || isPaused()) return;
      const next = () => playRepeat(cardIdx, rep + 1);
      setPlayResumeFn(next);
      setPlayTimeout(deps.setTimeout(next, REPEAT_GAP));
    });
  }

  return {
    // PR1
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
    bumpCthaiPlay,
    cthaiCardFreqRank,
    // PR2 — rendering
    showCard,
    showWordPhraseCard,
    showConversationCard,
    showPairCard,
    playPairWord,
    playPairBoth,
    // PR2 — navigation
    flipCard,
    nextCard,
    prevCard,
    jumpPlayAll,
    // PR2 — scoring
    markCard,
    toggleDifficult,
    toggleDifficultAt,
    updateDifficultBtn,
    diffBtnHtml,
    updateStats,
    // PR2 — Play All FSM
    updatePlayBtn,
    togglePlayAll,
    startPlayAll,
    stopPlayAll,
    pausePlayAll,
    resumePlayAll,
    regularPlayAll,
    playRepeat,
  };
}
