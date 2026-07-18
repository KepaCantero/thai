// Spike 5c PR1: bridge between the typed CardsModule and the legacy global
// scripts in public/app.js. Runs during boot (after data load, after the
// state bridge installs). Constructs a CardsModule with adapters for the
// legacy globals, then overrides window.buildDeck / window.buildQuestionsDeck
// / window.cardKey / window.cthai* / window.getThaiFreqMap so every legacy
// caller (rebuild, renderDashboard, renderCthaiGroups, markCard, etc.) lands
// in the typed implementation.
//
// The legacy function declarations in app.js are not deleted — overwriting
// window.buildDeck is enough because top-level function declarations in
// classic scripts resolve to properties on the global object, and the legacy
// bare-identifier call sites resolve against window at call time.
//
// PR2 will follow up by extracting the DOM/audio side (showCard, flipCard,
// rebuild, play-all FSM). When it does, it can import { wireLegacyCards }
// from here for the pure-logic half and add its own DOM-writing bridge
// alongside.

import { createCardsModule } from './module';
import type { CardsModule, CardsModuleDeps } from './module';
import { getAppData, getTop1000 } from '../../data/loader';
import { cthaiPlaysStore, deletedQaStore } from '../../persistence/stores';

let cardsModule: CardsModule | undefined;

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
  };

  cardsModule = createCardsModule(deps);

  // Override the legacy global surface. Every legacy caller (rebuild,
  // renderDashboard, markCard, renderCthaiGroups, buildQuestionsDeck, ...)
  // goes through these.
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
