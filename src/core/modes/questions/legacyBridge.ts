// Spike 5d: bridge between the typed QuestionsModule and the legacy global
// scripts in public/app.js. Runs during boot (after data load, after the
// state bridge and cards bridge install). Constructs a QuestionsModule with
// adapters for the legacy globals, then overrides window.renderQuestions,
// window.renderQCard, window.qCardClick, window.playQAudio, window.deleteQCard
// so every legacy caller (setMode at app.js:903, inline onclick handlers
// emitted by renderQCard) lands in the typed implementation.
//
// buildQuestionsDeck comes from the cards module (cards owns the data
// shaping). The cards bridge installs w.buildQuestionsDeck, so we read it
// from window lazily — that decouples boot order (cards wires first, but
// even if it didn't, the closure resolves at call time).
//
// The legacy function declarations are not deleted — overwriting window.* is
// enough because top-level function declarations in classic scripts resolve
// to properties on the global object, and legacy bare-identifier call sites
// resolve against window at call time.

import { createQuestionsModule } from './module';
import type { QuestionsModule } from './module';
import { renderWB as typedRenderWB } from '../../render';

let questionsModule: QuestionsModule | undefined;

export function wireLegacyQuestions(): QuestionsModule {
  const w = window as unknown as Record<string, any>;

  const deps = {
    buildQuestionsDeck: () => {
      if (typeof w.buildQuestionsDeck === 'function') return w.buildQuestionsDeck();
      return [];
    },
    speakText: (text: string, onDone?: () => void) => {
      if (typeof w.speakText === 'function') w.speakText(text, onDone);
      else if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      if (typeof w.stopCurrentAudio === 'function') w.stopCurrentAudio();
    },
    renderWB: (thai: string) => typedRenderWB(thai),
    haptic: (ms: number) => {
      if (typeof w.haptic === 'function') w.haptic(ms);
    },
    confirm: (message: string) =>
      typeof w.confirm === 'function' ? w.confirm(message) : false,
    dom: {
      setGridHtml: (html: string) => {
        const el = document.getElementById('questionsGrid');
        if (el) el.innerHTML = html;
      },
      setProgress: (text: string) => {
        const el = document.getElementById('progress');
        if (el) el.textContent = text;
      },
    },
  };

  questionsModule = createQuestionsModule(deps);

  // Override the legacy global surface. Every legacy caller (setMode in
  // app.js:901-903, inline onclick handlers emitted by renderQCard) goes
  // through these.
  w.renderQuestions = questionsModule.renderQuestions;
  w.renderQCard = questionsModule.renderQCard;
  w.qCardClick = questionsModule.qCardClick;
  w.playQAudio = questionsModule.playQAudio;
  w.deleteQCard = questionsModule.deleteQCard;

  return questionsModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getQuestionsModule(): QuestionsModule | undefined {
  return questionsModule;
}
