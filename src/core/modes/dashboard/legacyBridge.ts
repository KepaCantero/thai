// Spike 5i: bridge between the typed DashboardModule and the still-legacy
// global scripts in public/{app,config,audio}.js. Runs during boot after
// data load, the state bridge, and the cards module (which owns buildDeck,
// cardKey, diffBtnHtml, getEn, and the cthai bookkeeping).
//
// Symbols already extracted to typed modules are imported directly:
//   - cards (buildDeck, cardKey, diffBtnHtml, getEn, cthai*) via getCardsModule
// Symbols still living in legacy public/*.js are routed through window.*:
//   - audio.js: speakText, stopCurrentAudio, getAudioText, playAudioItem
//   - config.js: renderTone, renderWB, THAI_EN, CONV_EN
//   - app.js: setMode, deck, difficult, startPlayAll, stopPlayAll, running, paused
// As each of those is extracted, its window.* routing here collapses to a
// typed import — same pattern as top1000 → srs.

import { createDashboardModule } from './module';
import type { DashboardDom, DashboardModule, DashboardModuleDeps } from './module';
import * as playback from '../../state/playback';
import { getActiveLesson } from '../../state/filters';
import { getCardsModule } from '../cards/legacyBridge';
import { getEn as typedGetEn, renderTone as typedRenderTone, THAI_EN } from '../../format';
import { renderWB as typedRenderWB } from '../../render';
import { CONV_EN } from '../../format';
import type { Card } from '../../types';

let dashboardModule: DashboardModule | undefined;

function makeDomAdapter(): DashboardDom {
  const $ = (id: string): HTMLElement | null =>
    typeof document === 'undefined' ? null : document.getElementById(id);

  return {
    getGrid: () => $('dashboardGrid'),
    setGridHtml: (html: string) => {
      const el = $('dashboardGrid');
      if (el) el.innerHTML = html;
    },
    setGridDisplay: (display: string) => {
      const el = $('dashboardGrid');
      if (el) el.style.display = display;
    },
    queryCards: () =>
      typeof document === 'undefined'
        ? []
        : (Array.from(document.querySelectorAll('.dash-card')) as HTMLElement[]),
    setProgress: (text: string) => {
      const el = $('playAllProgress');
      if (el) el.textContent = text;
    },
    setIndicator: (text: string) => {
      const el = $('playAllIndicator');
      if (el) el.textContent = text;
    },
  };
}

export function wireLegacyDashboard(): DashboardModule {
  const w = window as unknown as Record<string, any>;

  const deps: DashboardModuleDeps = {
    buildDeck: () => getCardsModule()?.buildDeck() ?? [],
    getActiveLesson: () => {
      try {
        return getActiveLesson();
      } catch {
        return (w.activeLesson as string) ?? 'all';
      }
    },
    isDifficult: (key: string) =>
      typeof w.difficult !== 'undefined' && typeof w.difficult.has === 'function'
        ? !!w.difficult.has(key)
        : false,
    cardKey: (item: Card) => getCardsModule()?.cardKey(item) ?? '',
    renderTone: (toneStr, highlight) => typedRenderTone(toneStr, highlight),
    renderWB: (thai) => typedRenderWB(thai),
    getEn: (item) => typedGetEn(item),
    diffBtnHtml: (item, i) => getCardsModule()?.diffBtnHtml(item, i) ?? '',

    getThaiEn: () => THAI_EN,
    getConvEn: () => CONV_EN as Record<string, { q?: string; a?: string }>,
    getDeck: () => (w.deck as Card[]) || [],
    hasSpeakText: () => typeof w.speakText === 'function',

    cthaiCardDone: (item) =>
      typeof w.cthaiCardDone === 'function' ? !!w.cthaiCardDone(item) : false,
    cthaiCountPlays: (item, which) =>
      typeof w.cthaiCountPlays === 'function' ? w.cthaiCountPlays(item, which) : 0,
    bumpCthaiPlay: (item, which) => {
      if (typeof w.bumpCthaiPlay === 'function') w.bumpCthaiPlay(item, which);
    },
    cthaiCardFreqRank: (item) =>
      typeof w.cthaiCardFreqRank === 'function' ? w.cthaiCardFreqRank(item) : 9999,
    getCthaiThreshold: () =>
      typeof w.CTHAI_THRESHOLD === 'number' ? w.CTHAI_THRESHOLD : 10,

    playAudioItem: (item, onDone) => {
      if (typeof w.playAudioItem === 'function') w.playAudioItem(item, onDone);
      else if (onDone) onDone();
    },
    speakText: (text, onDone) => {
      if (typeof w.speakText === 'function') w.speakText(text, onDone);
      else if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      if (typeof w.stopCurrentAudio === 'function') w.stopCurrentAudio();
    },
    getAudioText: (item) =>
      typeof w.getAudioText === 'function' ? w.getAudioText(item) : '',

    // Playback FSM reads/writes go through the typed state bridge so cards
    // mode and dashboard mode share one source of truth.
    isRunning: () => {
      try {
        return playback.isRunning();
      } catch {
        return !!w.running;
      }
    },
    isPaused: () => {
      try {
        return playback.isPaused();
      } catch {
        return !!w.paused;
      }
    },
    setPlayResumeFn: (fn) => {
      try {
        playback.setPlayResumeFn(fn);
      } catch {
        w.playResumeFn = fn;
      }
    },
    setPlayTimeout: (id) => {
      try {
        playback.setPlayTimeout(id);
      } catch {
        w.playTimeout = id;
      }
    },
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    stopPlayAll: () => {
      if (typeof w.stopPlayAll === 'function') w.stopPlayAll();
    },
    startPlayAll: (i) => {
      if (typeof w.startPlayAll === 'function') w.startPlayAll(i);
    },

    setMode: (key) => {
      if (typeof w.setMode === 'function') w.setMode(key);
    },

    dom: makeDomAdapter(),
  };

  dashboardModule = createDashboardModule(deps);

  // Override the legacy global surface.
  w.renderDashboard = dashboardModule.renderDashboard;
  w.renderDashWordPhrase = dashboardModule.renderDashWordPhrase;
  w.renderDashConversation = dashboardModule.renderDashConversation;
  w.renderDashPair = dashboardModule.renderDashPair;
  w.dashCardClick = dashboardModule.dashCardClick;
  w.clearDashboardHighlights = dashboardModule.clearDashboardHighlights;
  w.dashPlayAll = dashboardModule.dashPlayAll;
  w.playConvAudio = dashboardModule.playConvAudio;
  w.toggleDashboard = dashboardModule.toggleDashboard;
  w.setCthaiGroup = dashboardModule.setCthaiGroup;

  // Expose dashboardMode as a getter/setter on window so legacy bare-
  // identifier reads (app.js:8 `var dashboardMode = false`, app.js:215
  // `if (currentMode === 'dashboard') renderDashboard()`, app.js:681
  // `if (dashboardMode) dashPlayAll()`, app.js:692, app.js:870
  // `dashboardMode = (mode === 'dashboard')`, app.js:1418
  // `setMode(dashboardMode ? 'cards' : 'dashboard')`) resolve against the
  // module's internal state. The setter keeps the module flag in sync with
  // setMode assignments from anywhere.
  Object.defineProperty(w, 'dashboardMode', {
    configurable: true,
    enumerable: true,
    get: () => dashboardModule!.isDashboardMode(),
    set: (v: boolean) => dashboardModule!._setDashboardMode(v),
  });

  return dashboardModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getDashboardModule(): DashboardModule | undefined {
  return dashboardModule;
}
