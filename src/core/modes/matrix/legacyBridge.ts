// Spike 5f: bridge between the typed MatrixModule and the legacy global
// scripts in public/app.js. Runs during boot (after data load, after the
// state bridge and prior mode bridges install). Constructs a MatrixModule
// with adapters for the legacy globals, then overrides the matrix-related
// window.* functions so every legacy caller (setMode at app.js:907-910,
// inline onclick handlers emitted by renderMatrix/updateMatrixResult, and
// the keydown handler at app.js:606-611) lands in the typed implementation.
//
// DATA.janus is read lazily via the injected closure so this module does not
// import the loader directly — that keeps the boot-order coupling loose.
//
// The legacy function declarations are not deleted — overwriting window.* is
// enough because top-level function declarations in classic scripts resolve
// to properties on the global object, and legacy bare-identifier call sites
// resolve against window at call time.

import { createMatrixModule } from './module';
import type { MatrixModule } from './module';
import type { JanusTheme } from '../../types';

let matrixModule: MatrixModule | undefined;

export function wireLegacyMatrix(): MatrixModule {
  const w = window as unknown as Record<string, any>;

  const deps = {
    janus: (): JanusTheme[] => {
      // DATA is a global injected by the data loader (src/core/data/loader.ts
      // → window.DATA). Falls back to [] so boot races don't crash.
      const data = (w.DATA || {}) as { janus?: JanusTheme[] };
      return Array.isArray(data.janus) ? data.janus : [];
    },
    speakText: (text: string, onDone?: () => void) => {
      if (typeof w.speakText === 'function') w.speakText(text, onDone);
      else if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      if (typeof w.stopCurrentAudio === 'function') w.stopCurrentAudio();
    },
    dom: {
      setGridHtml: (html: string) => {
        const el = document.getElementById('matrixGrid');
        if (el) el.innerHTML = html;
      },
      setResultHtml: (html: string) => {
        const el = document.getElementById('matrixResult');
        if (el) el.innerHTML = html;
      },
      setPracticeLabel: (text: string) => {
        const btn = document.querySelector('.mc-practice');
        if (btn) btn.textContent = text;
      },
    },
  };

  matrixModule = createMatrixModule(deps);

  // Override the legacy global surface. Every legacy caller — setMode
  // (app.js:909-910), inline onclick handlers in renderMatrix/updateMatrixResult,
  // and the keydown handler at app.js:606-611 — goes through these.
  w.renderMatrix = matrixModule.renderMatrix;
  w.matrixCellTap = matrixModule.matrixCellTap;
  w.setMatrixTheme = matrixModule.setMatrixTheme;
  w.resetMatrixTheme = matrixModule.resetMatrixTheme;
  w.speakMatrixSelection = matrixModule.speakMatrixSelection;
  w.buildMatrixSentence = matrixModule.buildMatrixSentence;
  w.buildMatrixConversation = matrixModule.buildMatrixConversation;
  w.updateMatrixResult = () => {
    // updateMatrixResult is private to renderMatrix; legacy only calls it via
    // the per-render path. Expose a no-op so any stray call doesn't throw.
    // Re-render is the safe legacy-equivalent action.
    matrixModule.renderMatrix();
  };
  w.matrixNav = matrixModule.matrixNav;
  w.randomMatrix = matrixModule.randomMatrix;
  w.playMatrixConv = matrixModule.playMatrixConv;
  w.toggleMatrixPractice = matrixModule.toggleMatrixPractice;
  w.startMatrixPractice = matrixModule.startMatrixPractice;
  w.stopMatrixPractice = matrixModule.stopMatrixPractice;

  // Expose matrixRunning as a getter on window so legacy bare-identifier reads
  // (e.g., app.js setMode: `if (matrixRunning) stopMatrixPractice();`) resolve
  // against the module's internal state. Configurable+non-enumerable to match
  // the implicit global surface of a legacy `var`.
  Object.defineProperty(w, 'matrixRunning', {
    configurable: true,
    enumerable: true,
    get: () => matrixModule.isMatrixRunning(),
  });

  return matrixModule;
}

/** Test/inspection helper: returns the most recently wired module, if any. */
export function getMatrixModule(): MatrixModule | undefined {
  return matrixModule;
}
