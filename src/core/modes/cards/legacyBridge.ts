// Spike 5c PR1+PR2: bridge between the typed CardsModule and the legacy global
// scripts in public/app.js + public/ui.js. Runs during boot (after data load,
// after the state bridge installs). Constructs a CardsModule with adapters for
// the legacy globals, then overrides window.* so every legacy caller (rebuild,
// renderDashboard, renderCthaiGroups, markCard, showCard, play-all FSM, ...)
// lands in the typed implementation.
//
// PR1 installed the pure-logic overrides (buildDeck, buildQuestionsDeck,
// cardKey, cthai*, getThaiFreqMap). PR2 adds the DOM/rendering/scoring/FSM
// overrides (showCard, show*Card, flipCard, nextCard, prevCard, jumpPlayAll,
// markCard, toggleDifficult*, updateDifficultBtn, diffBtnHtml, updateStats,
// updatePlayBtn, togglePlayAll, start/stop/pause/resumePlayAll,
// regularPlayAll, playRepeat, playPair*).
//
// The legacy function declarations are not deleted — overwriting window.* is
// enough because top-level function declarations in classic scripts resolve to
// properties on the global object, and legacy bare-identifier call sites
// resolve against window at call time.

import { createCardsModule } from './module';
import type { CardsDom, CardsModule, CardsModuleDeps } from './module';
import { getAppData, getTop1000 } from '../../data/loader';
import { cthaiPlaysStore, deletedQaStore } from '../../persistence/stores';
import { getEn as typedGetEn, renderTone as typedRenderTone } from '../../format';
import { renderWB as typedRenderWB } from '../../render';
import type { Card } from '../../types';

let cardsModule: CardsModule | undefined;

/**
 * Adapter that maps CardsDom calls onto the legacy front/back DOM hooks plus
 * the play-all indicator cluster. Mirrors public/ui.js:1-51 and
 * public/app.js:555-570, 647-669 line-for-line. Reads element references
 * lazily so the bridge can install before the DOM is ready (the FSM and
 * rendering only fire on user action).
 */
function makeDomAdapter(): CardsDom {
  // `$(id)` mirrors the legacy helper from config.js:192. Resolved at call
  // time so the adapter survives DOM mutations.
  const $ = (id: string): HTMLElement | null =>
    typeof document === 'undefined' ? null : document.getElementById(id);

  const setText = (id: string, text: string): void => {
    const el = $(id);
    if (el) el.textContent = text;
  };
  const setHtml = (id: string, html: string): void => {
    const el = $(id);
    if (el) el.innerHTML = html;
  };
  const setDisplay = (id: string, visible: boolean): void => {
    const el = $(id);
    if (el) el.style.display = visible ? '' : 'none';
  };

  return {
    setFront: ({ word, phonetic, esPhonetic, tone, toneNote, img }) => {
      // ui.js:56-62. Word/phrase uses textContent; conv/pair build innerHTML.
      // The adapter writes textContent for the simple fields and innerHTML for
      // tone, matching the legacy behavior.
      setHtml('frontWord', word);
      setText('frontPhonetic', phonetic);
      setDisplay('frontPhonetic', phonetic !== '');
      if (esPhonetic) {
        setText('frontEsPhonetic', esPhonetic);
        setDisplay('frontEsPhonetic', true);
      } else {
        setDisplay('frontEsPhonetic', false);
      }
      setHtml('frontTone', tone);
      setText('frontToneNote', toneNote);
      const imgEl = $('frontImg') as HTMLImageElement | null;
      if (imgEl) {
        if (img) { imgEl.src = img; setDisplay('frontImg', true); }
        else setDisplay('frontImg', false);
      }
      // Suppress unused-var warning under strict TS when img is undefined.
      void img;
    },

    setBack: ({ word, phonetic, esPhonetic, tone, toneNote }) => {
      setHtml('backWord', word);
      // ui.js:66-70 hides phonetic/es/tone on the back face for word/phrase.
      setDisplay('backPhonetic', phonetic !== '');
      if (phonetic) setText('backPhonetic', phonetic);
      setDisplay('backEsPhonetic', esPhonetic !== '');
      if (esPhonetic) setText('backEsPhonetic', esPhonetic);
      setHtml('backTone', tone);
      setText('backToneNote', toneNote);
    },

    setPhraseHint: (html) => {
      setText('phraseHint', html ?? '');
    },

    setCardFlipped: (flipped) => {
      // Legacy app.js:468 uses classList.toggle. The module calls setCardFlipped
      // on every flip, so the adapter toggles the class on each call.
      const c = $('card');
      if (!c) return;
      if (flipped) c.classList.add('flipped');
      else c.classList.remove('flipped');
    },

    setCardTypeClass: (cls) => {
      const card = $('card');
      const container = $('cardContainer');
      if (card) {
        if (cls === 'conversation') card.classList.add('card-conv-type');
        else card.classList.remove('card-conv-type');
      }
      if (container) {
        if (cls === 'conversation' || cls === 'pair') {
          container.classList.add('card-conv');
        } else {
          container.classList.remove('card-conv');
        }
        if (cls === 'pair') container.classList.add('card-pair');
        else container.classList.remove('card-pair');
      }
    },

    setProgress: (text) => setText('progress', text),
    setStats: (text) => setText('stats', text),

    setEmptyHint: (html) => {
      // Legacy updateEmptyHint() (app.js:222-259) builds a structured DOM node.
      // This adapter only handles the showCard() empty path (clears the hint
      // when deck is empty); the rich hint rendering stays in app.js until the
      // full rebuild path is migrated.
      const existing = $('emptyHint');
      if (html === null) {
        if (existing) existing.remove();
      }
    },

    setDiffBtnState: (on) => {
      // app.js:555-571 queries .diff-btn and .diff-btn-bottom, updates text
      // content, className, title, aria-*.
      const btns = document.querySelectorAll('.diff-btn, .diff-btn-bottom');
      const deckRef = (window as unknown as { deck?: Card[] }).deck ?? [];
      const show = deckRef.length > 0;
      const label = on ? '−' : '+';
      const title = on ? 'Quitar de Difíciles' : 'Añadir a Difíciles';
      btns.forEach((b) => {
        const el = b as HTMLElement;
        el.style.display = show ? '' : 'none';
        el.textContent = label;
        const baseCls = el.classList.contains('diff-btn-bottom') ? 'diff-btn-bottom' : 'diff-btn';
        el.className = baseCls + (on ? ' diff-btn-on' : '');
        el.title = title;
        el.setAttribute('aria-label', title);
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    },

    setPlayBtn: (state) => {
      // app.js:647-669. Three states with distinct styling.
      const btn = $('playAllBtn') as HTMLElement | null;
      const stop = $('stopBtn') as HTMLElement | null;
      if (!btn) return;
      if (state === 'pause') {
        btn.textContent = '⏸ Pause';
        btn.style.background = '#0f3460';
        btn.style.color = '#ffd166';
        btn.style.borderColor = '#ffd166';
        if (stop) stop.style.display = '';
      } else if (state === 'resume') {
        btn.textContent = '▶ Resume';
        btn.style.background = '#e94560';
        btn.style.color = '#fff';
        btn.style.borderColor = '#e94560';
        if (stop) stop.style.display = '';
      } else {
        btn.textContent = '▶ Play All';
        btn.style.background = '#e94560';
        btn.style.color = '#fff';
        btn.style.borderColor = '#e94560';
        if (stop) stop.style.display = 'none';
      }
    },

    setPlayIndicator: (text) => setText('playAllIndicator', text),
    setPlayProgress: (text) => setText('playAllProgress', text),
  };
}

export function wireLegacyCards(): CardsModule {
  const w = window as unknown as Record<string, any>;

  const deps: CardsModuleDeps = {
    getData: () => w.DATA ?? getAppData(),
    getTones: () => w.TONES ?? {},
    getThaiEn: () => w.THAI_EN ?? {},
    getPhraseEn: () => w.PHRASE_EN ?? {},
    getConvEn: () => w.CONV_EN ?? {},
    getCatLabels: () => w.CAT_LABELS ?? {},
    // loader.ts installs TOP1000_WORDS from top1000.json's `.words`. Fall back
    // to the loader's bundle for tests / direct entry.
    getTop1000Words: () => w.TOP1000_WORDS ?? getTop1000()?.words ?? [],
    // Legacy 'thai_deleted_qa' localStorage is the source of truth. Reading
    // through deletedQaStore keeps us consistent with the typed persistence
    // layer (Spike 2) without coupling the module to localStorage.
    getDeletedQaKeys: () => new Set(deletedQaStore.get()),
    // SHOW_UNVERIFIED stays a legacy `var` in app.js (L21); we read it lazily
    // so flipping it at runtime takes effect on the next buildDeck() call.
    getShowUnverified: () => {
      const v = w.SHOW_UNVERIFIED;
      return typeof v === 'boolean' ? v : true;
    },

    // --- PR2 deps ----------------------------------------------------------

    dom: makeDomAdapter(),

    // audio.js globals (playAudioItem at audio.js:243, speakText in audio.js,
    // stopCurrentAudio in audio.js).
    playAudioItem: (item, onDone) => w.playAudioItem(item, onDone),
    speakText: (text, onDone) => w.speakText(text, onDone),
    stopCurrentAudio: () => w.stopCurrentAudio(),

    // Format/render are typed imports now (Spike 5h). The window.* surface
    // is still seeded by wireLegacyFormat / wireLegacyRender for any
    // not-yet-migrated caller, but the cards module reads the typed
    // implementations directly so behavior is independent of boot order.
    renderTone: (toneStr, highlight) => typedRenderTone(toneStr, highlight),
    renderWB: (thai) => typedRenderWB(thai),
    getEn: (item) => typedGetEn(item),

    // SRS feedback hook. Mirrors app.js:517-520: look up the card in any SRS
    // deck, then record a rating (3 for known, 1 for unknown). Silent when the
    // card isn't scheduled. The window functions come from public/srs.js.
    onScoreCard: (thai, knew) => {
      if (typeof w.findSrsCardByThai === 'function' && typeof w.recordRating === 'function') {
        const match = w.findSrsCardByThai(thai);
        if (match) w.recordRating(match.deckKey, match.cardId, knew ? 3 : 1);
      }
    },

    // Timer plumbing — global setTimeout/clearTimeout. Tests inject fakes.
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    clearTimeout: (id) => window.clearTimeout(id ?? undefined),
  };

  cardsModule = createCardsModule(deps);

  // --- Override the legacy global surface --------------------------------
  //
  // Every legacy caller goes through these. The PR1 surface (pure logic) and
  // PR2 surface (DOM + FSM) are installed together so the bridge stays a
  // single source of truth.

  // PR1: pure logic
  w.buildDeck = cardsModule.buildDeck;
  w.buildQuestionsDeck = cardsModule.buildQuestionsDeck;
  w.detectQTopic = cardsModule.detectQTopic;
  w.cardKey = cardsModule.cardKey;
  w.isVerifiedEntry = cardsModule.isVerifiedEntry;
  w.cthaiCardId = cardsModule.cthaiCardId;
  w.cthaiPlaysOf = cardsModule.cthaiPlaysOf;
  w.cthaiCardDone = cardsModule.cthaiCardDone;
  w.cthaiCountPlays = cardsModule.cthaiCountPlays;
  w.cthaiCardFreqRank = cardsModule.cthaiCardFreqRank;
  w.getThaiFreqMap = cardsModule.getThaiFreqMap;

  // PR2: rendering
  w.showCard = cardsModule.showCard;
  w.showWordPhraseCard = cardsModule.showWordPhraseCard;
  w.showConversationCard = cardsModule.showConversationCard;
  w.showPairCard = cardsModule.showPairCard;
  w.playPairWord = cardsModule.playPairWord;
  w.playPairBoth = cardsModule.playPairBoth;

  // PR2: navigation
  w.flipCard = cardsModule.flipCard;
  w.nextCard = cardsModule.nextCard;
  w.prevCard = cardsModule.prevCard;
  w.jumpPlayAll = cardsModule.jumpPlayAll;

  // PR2: scoring
  w.markCard = cardsModule.markCard;
  w.toggleDifficult = cardsModule.toggleDifficult;
  w.toggleDifficultAt = cardsModule.toggleDifficultAt;
  w.updateDifficultBtn = cardsModule.updateDifficultBtn;
  w.diffBtnHtml = cardsModule.diffBtnHtml;
  w.updateStats = cardsModule.updateStats;

  // PR2: Play All FSM
  w.updatePlayBtn = cardsModule.updatePlayBtn;
  w.togglePlayAll = cardsModule.togglePlayAll;
  w.startPlayAll = cardsModule.startPlayAll;
  w.stopPlayAll = cardsModule.stopPlayAll;
  w.pausePlayAll = cardsModule.pausePlayAll;
  w.resumePlayAll = cardsModule.resumePlayAll;
  w.regularPlayAll = cardsModule.regularPlayAll;
  w.playRepeat = cardsModule.playRepeat;

  // Mirror the legacy constants so any legacy caller reading PLAY_REPS,
  // CARD_GAP, REPEAT_GAP, CTHAI_THRESHOLD sees the typed values.
  w.PLAY_REPS = 4;
  w.REPEAT_GAP = 2000;
  w.CARD_GAP = 3000;
  w.CTHAI_THRESHOLD = 10;

  return cardsModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getCardsModule(): CardsModule | undefined {
  return cardsModule;
}
