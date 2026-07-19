// Spike 5f: Matrix mode extraction.
//
// Moves the Janus matrix sentence-builder out of public/app.js (L1404-1648)
// into a typed module. Behavior is preserved line-for-line:
//   - renderMatrix(): rebuilds the theme buttons, the 4-column grid, and the
//     #matrixResult pane (sentence + Q/A+/A- conversation + control buttons).
//   - matrixCellTap(colKey, idx): select a cell, re-render, speak.
//   - setMatrixTheme(i): switch the active Janus theme and reset selections.
//   - matrixNav(±1): flatten the 4D selection to a 1D ordinal and step it.
//   - randomMatrix(): pick a random cell in each column.
//   - playMatrixConv(): speak Q then A+ of the current conversation.
//   - toggleMatrixPractice / startMatrixPractice / stopMatrixPractice /
//     matrixPracticeNext: the auto-loop "Practice" mode that reshuffles and
//     speaks sentence, Q, A+, then waits 2s and recurs.
//
// The module owns matrixTheme, matrixSel, matrixRunning, matrixPlayIdx, and
// matrixPlayTimeout locally. activeLesson is read via the typed state
// accessor so it stays in sync with src/core/state/filters and the legacy
// global mirrored by stateBridge.
//
// External touchpoints:
//   - janus: DATA.janus — injected so the module doesn't import the loader.
//   - speakText/stopCurrentAudio: audio.js globals.
//   - dom.setGridHtml / dom.setResultHtml: writers for #matrixGrid and
//     #matrixResult, bundled so we avoid N getElementById calls.

import { getActiveLesson } from '../../state';
import type { JanusPart, JanusTheme } from '../../types';

// ---------------------------------------------------------------------------
// Column definitions — mirrored verbatim from app.js L1410-1415
// ---------------------------------------------------------------------------

export interface MatrixCol {
  key: 'subjects' | 'motives' | 'actions' | 'objects';
  label: string;
  cls: string;
}

const MATRIX_COLS: MatrixCol[] = [
  { key: 'subjects', label: 'Who', cls: 'mc-subj' },
  { key: 'motives', label: 'Intent', cls: 'mc-mot' },
  { key: 'actions', label: 'Action', cls: 'mc-act' },
  { key: 'objects', label: 'What', cls: 'mc-obj' },
];

export type MatrixSel = Record<MatrixCol['key'], number>;

// ---------------------------------------------------------------------------
// Built sentence / conversation shapes
// ---------------------------------------------------------------------------

export interface MatrixSentence {
  thai: string;
  phonetic: string;
  es: string;
  en: string;
}

export interface MatrixConvPart {
  thai: string;
  phonetic: string;
  es: string;
  en: string;
}

export interface MatrixConversation {
  q: MatrixConvPart;
  a: MatrixConvPart;
  n: MatrixConvPart;
}

// ---------------------------------------------------------------------------
// Dependency injection
// ---------------------------------------------------------------------------

export interface MatrixModuleDeps {
  /** Returns DATA.janus (all themes). */
  janus(): JanusTheme[];
  /** Speak arbitrary text (audio.js). */
  speakText(text: string, onDone?: () => void): void;
  /** Stop any in-flight playback (audio.js). */
  stopCurrentAudio(): void;
  /** DOM write surface — bundled so we avoid N getElementById calls. */
  dom: MatrixDom;
}

export interface MatrixDom {
  /** Write innerHTML for #matrixGrid. */
  setGridHtml(html: string): void;
  /** Write innerHTML for #matrixResult. */
  setResultHtml(html: string): void;
  /** Update the .mc-practice button label (text only). */
  setPracticeLabel(text: string): void;
}

export interface MatrixModule {
  renderMatrix(): void;
  matrixCellTap(colKey: MatrixCol['key'], idx: number): void;
  setMatrixTheme(i: number): void;
  resetMatrixTheme(): void;
  speakMatrixSelection(): void;
  buildMatrixSentence(sel: MatrixSel): MatrixSentence;
  buildMatrixConversation(sel: MatrixConversation | MatrixSel): MatrixConversation;
  matrixNav(dir: number): void;
  randomMatrix(): void;
  playMatrixConv(): void;
  toggleMatrixPractice(): void;
  startMatrixPractice(): void;
  stopMatrixPractice(): void;
  /** Test/inspection helpers. */
  getMatrixTheme(): number;
  getMatrixSel(): MatrixSel;
  isMatrixRunning(): boolean;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createMatrixModule(deps: MatrixModuleDeps): MatrixModule {
  // Module-local state (mirrors app.js L1405-1408).
  let matrixTheme = 0;
  let matrixSel: MatrixSel = { subjects: 0, motives: 0, actions: 0, objects: 0 };
  let matrixRunning = false;
  let matrixPlayIdx = 0; // preserved for parity; legacy value is unused
  let matrixPlayTimeout: ReturnType<typeof setTimeout> | null = null;

  // ----- helpers (app.js L1417-1434) ----------------------------------------

  function getJanus(): JanusTheme | undefined {
    return deps.janus()[matrixTheme];
  }

  function getColData(key: MatrixCol['key']): JanusPart[] {
    const J = getJanus();
    return J ? J[key] : [];
  }

  function getFilteredJanus(): JanusTheme[] {
    const al = getActiveLesson();
    const lessonNum = al === 'all' || al === 'youtube' ? null : parseInt(al, 10);
    const all = deps.janus();
    if (!lessonNum) return all;
    return all.filter((t) => !t.lesson || t.lesson === lessonNum);
  }

  function resetMatrixTheme(): void {
    const filtered = getFilteredJanus();
    const all = deps.janus();
    matrixTheme = filtered.length ? all.indexOf(filtered[0]) : 0;
    MATRIX_COLS.forEach((col) => {
      matrixSel[col.key] = 0;
    });
  }

  // ----- rendering (app.js L1450-1483) --------------------------------------

  function renderMatrix(): void {
    const filtered = getFilteredJanus();
    if (!filtered.length) {
      deps.dom.setGridHtml(
        '<div style="color:#888;padding:40px">No themes for this lesson</div>',
      );
      updateMatrixResult();
      return;
    }
    const all = deps.janus();
    const al = getActiveLesson();
    let J = all[matrixTheme];
    if (!J || (al !== 'all' && J.lesson !== parseInt(al, 10))) {
      resetMatrixTheme();
      J = all[matrixTheme];
    }
    let html = '<div class="matrix-themes" id="matrixThemes">';
    filtered.forEach((t) => {
      const i = all.indexOf(t);
      html +=
        '<button class="mt-btn' +
        (i === matrixTheme ? ' active' : '') +
        '" onclick="setMatrixTheme(' +
        i +
        ')">' +
        t.icon +
        ' ' +
        t.theme +
        '</button>';
    });
    html += '</div>';
    html += '<div class="matrix-grid-inner">';
    MATRIX_COLS.forEach((col, ci) => {
      const items = getColData(col.key);
      if (!items || !items.length) return;
      html += '<div class="matrix-col">';
      html += '<div class="matrix-col-head ' + col.cls + '">' + col.label + '</div>';
      items.forEach((item, ii) => {
        const sel = matrixSel[col.key] === ii ? ' selected ' + col.cls : '';
        html +=
          '<div class="matrix-cell' +
          sel +
          '" onclick="matrixCellTap(\'' +
          col.key +
          '\',' +
          ii +
          ')">';
        html += '<div class="mc-thai">' + item.thai + '</div>';
        html += '<div class="mc-ph">' + item.phonetic + '</div>';
        html += '<div class="mc-en">' + item.en + '</div>';
        html += '</div>';
      });
      html += '</div>';
      if (ci < MATRIX_COLS.length - 1) {
        html +=
          '<div class="matrix-flow-arrow" style="display:flex;align-items:center;color:#444;font-size:1.2rem;padding:0 2px">→</div>';
      }
    });
    html += '</div>';
    deps.dom.setGridHtml(html);
    updateMatrixResult();
  }

  // ----- interactions (app.js L1485-1607) -----------------------------------

  function matrixCellTap(colKey: MatrixCol['key'], idx: number): void {
    matrixSel[colKey] = idx;
    renderMatrix();
    speakMatrixSelection();
  }

  function speakMatrixSelection(): void {
    const parts = MATRIX_COLS.map((col) => {
      const arr = getColData(col.key);
      return arr[matrixSel[col.key]];
    }).filter((p): p is JanusPart => !!p && !!p.thai);
    if (!parts.length) return;
    deps.stopCurrentAudio();
    function playNext(i: number): void {
      if (i >= parts.length) return;
      deps.speakText(parts[i].thai, () => playNext(i + 1));
    }
    playNext(0);
  }

  function setMatrixTheme(i: number): void {
    matrixTheme = i;
    MATRIX_COLS.forEach((col) => {
      matrixSel[col.key] = 0;
    });
    renderMatrix();
  }

  function buildMatrixSentence(sel: MatrixSel): MatrixSentence {
    const parts = MATRIX_COLS.map((col) => {
      const arr = getColData(col.key);
      return arr[sel[col.key]];
    });
    return {
      thai: parts.map((p) => (p ? p.thai : '')).join(''),
      phonetic: parts.map((p) => (p ? p.phonetic : '')).join(' '),
      es: parts.map((p) => (p ? p.es : '')).join(' '),
      en: parts.map((p) => (p ? p.en : '')).join(' '),
    };
  }

  function buildMatrixConversation(sel: MatrixSel): MatrixConversation {
    const J = getJanus();
    // Defensive: callers always pass a MatrixSel. If J is missing (no theme),
    // return empty strings to avoid runtime crashes during boot races.
    if (!J) {
      const empty: MatrixConvPart = { thai: '', phonetic: '', es: '', en: '' };
      return { q: empty, a: { ...empty }, n: { ...empty } };
    }
    const sub = J.subjects[sel.subjects];
    const mot = J.motives[sel.motives];
    const act = J.actions[sel.actions];
    const obj = J.objects[sel.objects];
    const qSub = J.subjects[Math.min(2, J.subjects.length - 1)];
    const qThai = qSub.thai + mot.thai + act.thai + obj.thai + 'ไหม';
    const qPh = qSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + obj.phonetic + ' mai';
    const qEn = qSub.en + ' ' + mot.en + ' ' + act.en + ' ' + obj.en + '?';
    const aSub = sel.subjects === 2 ? J.subjects[1] : sub;
    const aThai = 'ใช่ ' + aSub.thai + mot.thai + act.thai + obj.thai + 'ครับ';
    const aPh = 'chai ' + aSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + obj.phonetic + ' krap';
    const aEn = 'Yes, ' + aSub.en + ' ' + mot.en + ' ' + act.en + ' ' + obj.en;
    const altObjIdx = (sel.objects + 1) % J.objects.length;
    const altObj = J.objects[altObjIdx];
    const nThai = 'ไม่ ' + aSub.thai + mot.thai + act.thai + altObj.thai;
    const nPh = 'mai ' + aSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + altObj.phonetic;
    const nEn = 'No, ' + aSub.en + ' ' + mot.en + ' ' + act.en + ' ' + altObj.en;
    return {
      q: { thai: qThai, phonetic: qPh, es: qPh, en: qEn },
      a: { thai: aThai, phonetic: aPh, es: aPh, en: aEn },
      n: { thai: nThai, phonetic: nPh, es: nPh, en: nEn },
    };
  }

  function updateMatrixResult(): void {
    const sent = buildMatrixSentence(matrixSel);
    const conv = buildMatrixConversation(matrixSel);
    const parts = MATRIX_COLS.map((col) => {
      const arr = getColData(col.key);
      return arr[matrixSel[col.key]];
    });
    const chipsHtml = parts
      .map((p, i) => {
        const cls = MATRIX_COLS[i].cls;
        const arrow = i < parts.length - 1 ? '<span class="matrix-chip-arrow">→</span>' : '';
        return (
          '<span class="matrix-chip mc-c-' +
          cls.replace('mc-', '') +
          '"><span class="mch-thai">' +
          (p ? p.thai : '') +
          '</span><span class="mch-en">' +
          (p ? p.en : '') +
          '</span></span>' +
          arrow
        );
      })
      .join('');
    let html =
      '<div class="matrix-sentence">' +
      '<div class="ms-thai">' +
      sent.thai +
      '</div>' +
      '<div class="ms-ph">' +
      sent.phonetic +
      '</div>' +
      '<div class="ms-en">' +
      sent.en +
      '</div>' +
      '<div class="matrix-chips">' +
      chipsHtml +
      '</div></div>';
    html +=
      '<div class="matrix-conv">' +
      '<div><span class="mconv-label mconv-q">Q</span></div>' +
      '<div class="mconv-thai">' +
      conv.q.thai +
      '</div><div class="mconv-ph">' +
      conv.q.phonetic +
      '</div><div class="mconv-en">' +
      conv.q.en +
      '</div>' +
      '<div class="mconv-sep"></div>' +
      '<div><span class="mconv-label mconv-a">A+</span></div>' +
      '<div class="mconv-thai">' +
      conv.a.thai +
      '</div><div class="mconv-ph">' +
      conv.a.phonetic +
      '</div><div class="mconv-en">' +
      conv.a.en +
      '</div>' +
      '<div class="mconv-sep"></div>' +
      '<div><span class="mconv-label mconv-a" style="background:#ff6b6b22;color:#ff6b6b">A-</span></div>' +
      '<div class="mconv-thai">' +
      conv.n.thai +
      '</div><div class="mconv-ph">' +
      conv.n.phonetic +
      '</div><div class="mconv-en">' +
      conv.n.en +
      '</div></div>';
    html +=
      '<div class="matrix-controls">' +
      '<button class="mc-nav" onclick="matrixNav(-1)">←</button>' +
      '<button class="mc-random" onclick="randomMatrix()">Shuffle</button>' +
      '<button class="mc-play" onclick="playMatrixConv()">▶ Conv</button>' +
      '<button class="mc-practice" onclick="toggleMatrixPractice()">' +
      (matrixRunning ? '■ Stop' : '▶▶ Practice') +
      '</button>' +
      '<button class="mc-nav" onclick="matrixNav(1)">→</button></div>';
    deps.dom.setResultHtml(html);
  }

  function matrixSelToFlat(): number {
    let flat = 0;
    let mult = 1;
    MATRIX_COLS.forEach((col) => {
      const d = getColData(col.key);
      if (d && d.length) {
        flat += matrixSel[col.key] * mult;
        mult *= d.length;
      }
    });
    return flat;
  }

  function flatToMatrixSel(flatIn: number): void {
    let flat = flatIn;
    MATRIX_COLS.forEach((col) => {
      const d = getColData(col.key);
      if (d && d.length) {
        const len = d.length;
        matrixSel[col.key] = flat % len;
        flat = Math.floor(flat / len);
      }
    });
  }

  function matrixNav(dir: number): void {
    let total = 1;
    MATRIX_COLS.forEach((col) => {
      const d = getColData(col.key);
      if (d && d.length) total *= d.length;
    });
    let flat = matrixSelToFlat();
    flat = (flat + dir + total) % total;
    flatToMatrixSel(flat);
    renderMatrix();
    speakMatrixSelection();
  }

  function randomMatrix(): void {
    MATRIX_COLS.forEach((col) => {
      const d = getColData(col.key);
      if (d && d.length) {
        matrixSel[col.key] = Math.floor(Math.random() * d.length);
      }
    });
    renderMatrix();
    speakMatrixSelection();
  }

  function playMatrixConv(): void {
    const conv = buildMatrixConversation(matrixSel);
    deps.stopCurrentAudio();
    deps.speakText(conv.q.thai, () => {
      setTimeout(() => deps.speakText(conv.a.thai), 1500);
    });
  }

  // ----- practice loop (app.js L1609-1648) ----------------------------------

  function toggleMatrixPractice(): void {
    if (matrixRunning) stopMatrixPractice();
    else startMatrixPractice();
  }

  function startMatrixPractice(): void {
    matrixRunning = true;
    deps.dom.setPracticeLabel('■ Stop');
    matrixPracticeNext();
  }

  function stopMatrixPractice(): void {
    matrixRunning = false;
    if (matrixPlayTimeout !== null) {
      clearTimeout(matrixPlayTimeout);
      matrixPlayTimeout = null;
    }
    deps.stopCurrentAudio();
    deps.dom.setPracticeLabel('▶▶ Practice');
  }

  function matrixPracticeNext(): void {
    if (!matrixRunning) return;
    const all = deps.janus();
    matrixTheme = Math.floor(Math.random() * all.length);
    MATRIX_COLS.forEach((col) => {
      const d = getColData(col.key);
      if (d && d.length) {
        matrixSel[col.key] = Math.floor(Math.random() * d.length);
      }
    });
    renderMatrix();
    const sent = buildMatrixSentence(matrixSel);
    deps.speakText(sent.thai, () => {
      if (!matrixRunning) return;
      const conv = buildMatrixConversation(matrixSel);
      matrixPlayTimeout = setTimeout(() => {
        deps.speakText(conv.q.thai, () => {
          if (!matrixRunning) return;
          matrixPlayTimeout = setTimeout(() => {
            deps.speakText(conv.a.thai, () => {
              if (!matrixRunning) return;
              matrixPlayTimeout = setTimeout(matrixPracticeNext, 2000);
            });
          }, 1200);
        });
      }, 1000);
    });
  }

  return {
    renderMatrix,
    matrixCellTap,
    setMatrixTheme,
    resetMatrixTheme,
    speakMatrixSelection,
    buildMatrixSentence,
    buildMatrixConversation,
    matrixNav,
    randomMatrix,
    playMatrixConv,
    toggleMatrixPractice,
    startMatrixPractice,
    stopMatrixPractice,
    getMatrixTheme: () => matrixTheme,
    getMatrixSel: () => matrixSel,
    isMatrixRunning: () => matrixRunning,
  };
}
