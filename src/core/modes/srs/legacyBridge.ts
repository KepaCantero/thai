// Spike 5h: bridge between the typed SrsModule and the legacy global scripts
// in public/srs.js + public/srs-ui.js. Runs during boot after data load, the
// state bridge, and prior mode bridges. Constructs an SrsModule with adapters
// for the legacy globals, then overrides the SRS-related window.* functions
// so every legacy caller (setMode at app.js:923, inline onclick handlers
// emitted by renderDeckPicker/renderStudyScreen, markCard at app.js:517, and
// the srsCurrent null-guard at app.js:865) lands in the typed implementation.
//
// SRS_DECKS / TOP1000_* / DATA / SHOW_UNVERIFIED / FSRS are all read lazily
// via the injected closures so this module does not import the loaders
// directly — keeps boot-order coupling loose.

import { createSrsModule } from './module';
import type {
  AnyCard,
  FsrsLibrary,
  SrsDom,
  SrsModule,
  SrsModuleDeps,
  SrsPersistence,
} from './module';
import { renderTone as typedRenderTone } from '../../format';
import { getCardsModule } from '../cards/legacyBridge';

let srsModule: SrsModule | undefined;

export function wireLegacySrs(): SrsModule {
  const w = window as unknown as Record<string, any>;

  const persistence: SrsPersistence = {
    readStateRaw: () => {
      try {
        return localStorage.getItem('thai_srs_state');
      } catch {
        return null;
      }
    },
    writeStateRaw: (raw) => {
      try {
        localStorage.setItem('thai_srs_state', raw);
      } catch (e) {
        console.warn('[srs] save failed', e);
      }
    },
    readStatsRaw: () => {
      try {
        return localStorage.getItem('thai_srs_stats');
      } catch {
        return null;
      }
    },
    writeStatsRaw: (raw) => {
      try {
        localStorage.setItem('thai_srs_stats', raw);
      } catch {
        // silent — matches legacy behavior (srs.js L424)
      }
    },
    removeStats: () => {
      try {
        localStorage.removeItem('thai_srs_stats');
      } catch {
        // silent
      }
    },
  };

  const dom: SrsDom = {
    getHost: () => null, // not used by module directly
    setHostHtml: () => {
      // Module writes via getById(hostId).innerHTML — no separate setter used.
    },
    addHostClass: (cls) => {
      const el = document.getElementById(srsModule!.getSrsHostId());
      if (el) el.classList.add(cls);
    },
    removeHostClassFromCurrent: (cls) => {
      const el = document.getElementById(srsModule!.getSrsHostId());
      if (el) el.classList.remove(cls);
    },
    getById: (id) => document.getElementById(id),
    querySelector: (sel) => document.querySelector(sel) as HTMLElement | null,
    appendToBody: (el) => document.body.appendChild(el),
    vibrate: (ms) => {
      try {
        if (navigator.vibrate) navigator.vibrate(ms);
      } catch {
        // silent
      }
    },
  };

  const deps: SrsModuleDeps = {
    getData: () => w.DATA,
    getTop1000Words: () => w.TOP1000_WORDS,
    getTop1000Structures: () => w.TOP1000_STRUCTURES,
    getTop1000Phrases: () => w.TOP1000_PHRASES,
    getShowUnverified: () => !!w.SHOW_UNVERIFIED,
    getActiveScope: () => (typeof w.activeScope === 'string' ? w.activeScope : 'lecciones'),
    getFsrs: () => w.FSRS as FsrsLibrary | undefined,
    speakText: (text) => {
      if (typeof w.speakText === 'function') w.speakText(text);
    },
    renderTone: (toneStr) => typedRenderTone(toneStr),
    persistence,
    dom,
    freqRankOf: (card: AnyCard) => {
      const cm = getCardsModule();
      if (!cm) return 9999;
      return cm.cthaiCardFreqRank(card as any);
    },
  };

  srsModule = createSrsModule(deps);

  // ----- Engine (from srs.js) ---------------------------------------------
  w.SRS_VERSION = 1;
  w.SRS_NEW_PER_DAY = 20;
  w.SRS_LEARN_AGAIN_SEC = 60;
  w.SRS_LEARN_HARD_SEC = 300;
  w.SRS_LEARN_GOOD_SEC = 600;
  w.SRS_LAPSE_SEC = 600;
  w.SRS_DAY_SEC = 86400;
  w.SRS_DECKS = new Proxy(
    {},
    {
      get(_t, prop) {
        return srsModule!.getSrsDecks()[prop as string];
      },
      ownKeys() {
        return Object.keys(srsModule!.getSrsDecks());
      },
      getOwnPropertyDescriptor(_t, prop) {
        const decks = srsModule!.getSrsDecks();
        if (Object.prototype.hasOwnProperty.call(decks, prop)) {
          return { configurable: true, enumerable: true, value: decks[prop as string] };
        }
        return undefined;
      },
    }
  );

  w.loadSrsState = srsModule.loadSrsState;
  w.freshSrsState = srsModule.freshSrsState;
  w.saveSrsState = srsModule.saveSrsState;
  w.ensureSrsState = srsModule.ensureSrsState;
  w.resetSrsDeck = srsModule.resetSrsDeck;
  w.getDeckStats = srsModule.getDeckStats;
  w.getTodayStr = () => srsModule.defaultStats().today;
  w.loadSrsStats = srsModule.loadSrsStats;
  w.defaultStats = srsModule.defaultStats;
  w.saveSrsStats = srsModule.saveSrsStats;
  w.bumpSrsStats = srsModule.bumpSrsStats;
  w.buildSession = srsModule.buildSession;
  w.recordRating = srsModule.recordRating;
  w.findSrsCardByThai = srsModule.findSrsCardByThai;
  w.scheduleNext = srsModule.scheduleNext;
  w.scheduleNextSM2 = srsModule.scheduleNextSM2;
  w.scheduleNextFSRS = srsModule.scheduleNextFSRS;
  w.getFsrsScheduler = srsModule.getFsrsScheduler;
  w.toFsrsCard = () => {
    throw new Error('[srs] toFsrsCard is internal to the typed module');
  };
  w.fromFsrsCard = () => {
    throw new Error('[srs] fromFsrsCard is internal to the typed module');
  };
  w.previewIntervals = srsModule.previewIntervals;
  w.formatInterval = srsModule.formatInterval;
  w.clampEf = srsModule.clampEf;

  // ----- UI (from srs-ui.js) ---------------------------------------------
  w.getActiveSrsDeckKeys = srsModule.getActiveSrsDeckKeys;
  w.mountSrsInline = srsModule.mountSrsInline;
  w.unmountSrsInline = srsModule.unmountSrsInline;
  w.srsGoHome = srsModule.srsGoHome;
  w.renderSrsView = srsModule.renderSrsView;
  w.renderDeckPicker = srsModule.renderDeckPicker;
  w.renderDeckCard = srsModule.renderDeckCard;
  w.startSrsSession = srsModule.startSrsSession;
  w.startMixedSession = srsModule.startMixedSession;
  w.renderStudyScreen = srsModule.renderStudyScreen;
  w.renderSrsCardFront = () => {
    throw new Error('[srs] renderSrsCardFront is internal to the typed module');
  };
  w.playSrsPhrase = srsModule.playSrsPhrase;
  w.srsSpeak = srsModule.srsSpeak;
  w.bindCardStageTap = () => {
    // internal to renderStudyScreen in the typed module — no-op stub for any
    // legacy caller that still references the bare identifier.
  };
  w.revealCard = srsModule.revealCard;
  w.rateCurrent = srsModule.rateCurrent;
  w.reinsertOffset = () => 4;
  w.showSrsToast = () => {
    // internal to rateCurrent in the typed module — no-op stub.
  };
  w.advanceCard = srsModule.advanceCard;
  w.undoSrsLast = srsModule.undoSrsLast;
  w.exitSrsSession = srsModule.exitSrsSession;
  w.finishSession = srsModule.finishSession;
  w.renderSessionEmpty = srsModule.renderSessionEmpty;
  w.priorityRank = () => 0;
  w.renderMixedStudyScreen = () => srsModule.renderStudyScreen();
  w.vibrate = (ms: number) => deps.dom.vibrate(ms);
  w.confirmResetAll = srsModule.confirmResetAll;
  // resetAll is referenced in the spec but not present in the legacy
  // source — alias to confirmResetAll to be safe.
  w.resetAll = srsModule.confirmResetAll;

  // ----- Bare-identifier reads from app.js --------------------------------
  // app.js:865 reads `if (typeof srsCurrent !== 'undefined') srsCurrent = null;`
  // — define it as a mutable accessor against the module's internal state.
  // The setter lets legacy code null it out (mode-switch cleanup) without
  // bypassing the module.
  Object.defineProperty(w, 'srsCurrent', {
    configurable: true,
    enumerable: true,
    get: () => srsModule!.getSrsCurrent(),
    set: (v) => srsModule!.setSrsCurrent(v),
  });
  Object.defineProperty(w, 'srsHostId', {
    configurable: true,
    enumerable: true,
    get: () => srsModule!.getSrsHostId(),
    set: () => {
      // Legacy code never assigns srsHostId directly; mountSrsInline owns it.
    },
  });
  Object.defineProperty(w, 'srsOnExit', {
    configurable: true,
    enumerable: true,
    get: () => srsModule!.getSrsOnExit(),
    set: () => {},
  });
  Object.defineProperty(w, 'srsDeckKeys', {
    configurable: true,
    enumerable: true,
    get: () => srsModule!.getSrsDeckKeys(),
    set: () => {},
  });

  return srsModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getSrsModule(): SrsModule | undefined {
  return srsModule;
}
