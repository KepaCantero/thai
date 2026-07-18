// Spike 5d: Questions mode extraction.
//
// Moves the Q&A grid rendering + card interactions out of public/app.js
// (L1208-1354) into a typed module. Behavior is preserved line-for-line:
//   - renderQuestions(): build deck via injected buildQuestionsDeck, sort by
//     topic|tense, write innerHTML of #questionsGrid, update #progress.
//   - renderQCard(item, i): per-card HTML (front Spanish, back Thai with
//     phonetic + ES phonetic, badges, play buttons). cthai mode shows only
//     the back (no flip).
//   - qCardClick(el, i): toggle flip + speak Q then A (chained).
//   - playQAudio(i, which): speak just Q or just A from inline buttons.
//   - deleteQCard(i): persist deletion to localStorage 'thai_deleted_qa'
//     (shared key space with cards mode) and re-render.
//
// The module owns qDeck and qFlipped locally. Other state (activeLesson,
// currentMode, deck for the cards-branch of deleteQCard) is read via the
// typed state accessors so it stays in sync with src/core/state/* and the
// legacy globals mirrored by stateBridge.
//
// External touchpoints:
//   - buildQuestionsDeck(): comes from the cards module (cards owns the data
//     shaping). Injected so questions doesn't import cards directly.
//   - speakText/stopCurrentAudio: audio.js globals.
//   - renderWB: ui.js word-breakdown helper.
//   - haptic: navigator.vibrate wrapper in app.js.

import { getActiveLesson, getDeck, getMode } from '../../state';
import { deletedQaStore } from '../../persistence/stores';
import type { QaItem, QaTopic } from '../../types';

// ---------------------------------------------------------------------------
// Labels — mirrored verbatim from public/app.js (L1208-1223)
// ---------------------------------------------------------------------------

const Q_TOPIC_LABELS: Record<string, string> = {
  pronombres: 'Pronombres',
  saludos: 'Saludos',
  verbos: 'Verbos',
  sabores: 'Sabores',
  comida: 'Comida',
  números: 'Números',
  preguntas: 'Preguntas',
  tiendas: 'Tiendas',
  sustantivos: 'Sustantivos',
  tiempo: 'Tiempo',
  días: 'Días',
};

const Q_TENSE_LABELS: Record<string, string> = {
  presente: 'Presente',
  futuro: 'Futuro',
  querer: 'Querer',
  gustar: 'Gustar',
  negación: 'Negación',
  pasado: 'Pasado',
  progresivo: 'Progresivo',
  'pregunta sí/no': 'Pregunta Sí/No',
  'pregunta dónde': 'Pregunta ¿Dónde?',
  'pregunta qué': 'Pregunta ¿Qué?',
  'pregunta cuánto': 'Pregunta ¿Cuánto?',
};

// ---------------------------------------------------------------------------
// Dependency injection
// ---------------------------------------------------------------------------

export interface QuestionsModuleDeps {
  /** Builds the Q&A deck from DATA.conversations (owned by cards module). */
  buildQuestionsDeck(): QaItem[];
  /** Speak arbitrary text (audio.js). */
  speakText(text: string, onDone?: () => void): void;
  /** Stop any in-flight playback (audio.js). */
  stopCurrentAudio(): void;
  /** Render word-by-word breakdown HTML (ui.js:845). Optional. */
  renderWB?(thai: string): string;
  /** Vibrate wrapper (app.js:467). Optional. */
  haptic?(ms: number): void;
  /** confirm() wrapper so tests can simulate user input. */
  confirm(message: string): boolean;
  /** DOM write surface — bundled so we avoid N getElementById calls. */
  dom: QuestionsDom;
}

export interface QuestionsDom {
  /** Write innerHTML for #questionsGrid. */
  setGridHtml(html: string): void;
  /** Write textContent for #progress. */
  setProgress(text: string): void;
}

export interface QuestionsModule {
  renderQuestions(): void;
  renderQCard(item: QaItem, i: number): string;
  qCardClick(el: HTMLElement, i: number): void;
  playQAudio(i: number, which: 'q' | 'a'): void;
  deleteQCard(i: number): void;
  /** Test/inspection helper: returns the current qDeck. */
  getQDeck(): QaItem[];
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createQuestionsModule(deps: QuestionsModuleDeps): QuestionsModule {
  // Module-local state (mirrors app.js L1225-1226).
  let qDeck: QaItem[] = [];
  let qFlipped: Record<number, boolean> = {};

  function renderQuestions(): void {
    // app.js:1228-1245
    qDeck = deps.buildQuestionsDeck();
    qFlipped = {};
    if (!qDeck.length) {
      deps.dom.setGridHtml(
        '<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No hay preguntas para esta lección</p>',
      );
      deps.dom.setProgress('0 Q&A');
      return;
    }
    // Sort: by topic, then tense — so related practice clusters together.
    qDeck.sort((a, b) => {
      const ta = (a.topic || '') + '|' + (a.tense || '');
      const tb = (b.topic || '') + '|' + (b.tense || '');
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
    deps.dom.setProgress(qDeck.length + ' Q&A');
    deps.dom.setGridHtml(qDeck.map((item, i) => renderQCard(item, i)).join(''));
  }

  function renderQCard(item: QaItem, i: number): string {
    // app.js:1247-1307
    const topicTxt = Q_TOPIC_LABELS[item.topic] || item.topic || '';
    const tenseTxt = Q_TENSE_LABELS[item.tense as QaTopic] || (item.tense as string) || '';
    const srcTxt = item.source || '';

    // Front side: Q on top, A on bottom (English/Spanish).
    const frontQtxt = item.q_spanish || item.q_en || '';
    const frontAtxt =
      item.a_spanish && item.a_spanish !== frontQtxt
        ? item.a_spanish || item.a_en || ''
        : '';
    const frontHtml =
      '<div class="qc-block">' +
      '<div class="qc-qa-label">Pregunta</div>' +
      (frontQtxt
        ? '<div class="qc-prompt">' + frontQtxt + '</div>'
        : '<div class="qc-empty">(voltea para ver)</div>') +
      '</div>' +
      (frontAtxt
        ? '<div class="qc-sep"></div>' +
          '<div class="qc-block">' +
          '<div class="qc-qa-label">Respuesta</div>' +
          '<div class="qc-prompt">' + frontAtxt + '</div>' +
          '</div>'
        : '');

    // Back side: Q on top, A on bottom (Thai + phonetic + ES phonetic).
    // Each block has its own 🔊 button so the user can hear Q and A
    // independently without flipping the card or triggering the combined
    // Q→A playback.
    const playBtn = (which: 'q' | 'a'): string => {
      if (typeof deps.speakText !== 'function') return '';
      return (
        '<button class="qc-play-btn" onclick="event.stopPropagation();playQAudio(' +
        i +
        ',\'' + which + '\')" title="Reproducir ' +
        (which === 'q' ? 'pregunta' : 'respuesta') +
        '" aria-label="Reproducir">🔊</button>'
      );
    };
    const thaiBlock = (
      label: string,
      thai: string | undefined,
      phonetic: string | undefined,
      es: string | undefined,
      which: 'q' | 'a',
    ): string => {
      if (!thai) {
        return (
          '<div class="qc-block">' +
          '<div class="qc-qa-label">' + label + '</div>' +
          '<div class="qc-empty">—</div></div>'
        );
      }
      return (
        '<div class="qc-block">' +
        '<div class="qc-qa-label">' + label + playBtn(which) + '</div>' +
        '<div class="qc-thai">' + thai + '</div>' +
        (phonetic ? '<div class="qc-phonetic">' + phonetic + '</div>' : '') +
        (es ? '<div class="qc-es">ES: ' + es + '</div>' : '') +
        '</div>'
      );
    };
    const backHtml =
      thaiBlock('Pregunta', item.q_thai, item.q_phonetic, item.q_es, 'q') +
      (item.q_thai && typeof deps.renderWB === 'function'
        ? '<div class="qc-wb">' + deps.renderWB(item.q_thai) + '</div>'
        : '') +
      (item.a_thai
        ? '<div class="qc-sep"></div>' + thaiBlock('Respuesta', item.a_thai, item.a_phonetic, item.a_es, 'a')
        : '') +
      (item.a_thai && typeof deps.renderWB === 'function'
        ? '<div class="qc-wb">' + deps.renderWB(item.a_thai) + '</div>'
        : '');

    // In cthai mode we show only the Thai side (no flip, no Spanish front).
    // Elsewhere the card flips between Spanish (front) and Thai (back).
    const cthaiMode = getActiveLesson() === 'cthai';
    const cardClass =
      'q-card' +
      (cthaiMode ? ' flipped cthai-only' : qFlipped[i] ? ' flipped' : '');
    const onclick = cthaiMode ? '' : ' onclick="qCardClick(this, ' + i + ')"';
    return (
      '<div class="' + cardClass + '" data-idx="' + i + '"' + onclick + '>' +
      (cthaiMode ? '' : '<div class="qc-play-icon">▶</div>') +
      '<button class="qc-del-btn" onclick="event.stopPropagation();deleteQCard(' + i + ')" title="Eliminar" aria-label="Eliminar">🗑️</button>' +
      '<div class="qc-badges">' +
      (topicTxt ? '<span class="qc-topic">' + topicTxt + '</span>' : '') +
      (tenseTxt ? '<span class="qc-tense">' + tenseTxt + '</span>' : '') +
      (srcTxt ? '<span class="qc-src">' + srcTxt + '</span>' : '') +
      '</div>' +
      (cthaiMode ? '' : '<div class="qc-front">' + frontHtml + '</div>') +
      '<div class="qc-back">' + backHtml + '</div>' +
      '</div>'
    );
  }

  function qCardClick(el: HTMLElement, i: number): void {
    // app.js:1309-1325
    el.classList.toggle('flipped');
    qFlipped[i] = el.classList.contains('flipped');
    if (typeof deps.stopCurrentAudio === 'function') deps.stopCurrentAudio();
    const item = qDeck[i];
    if (!item || typeof deps.speakText !== 'function') return;
    // Speak the Thai question first (if present), then the Thai answer.
    const qThai = item.q_thai || '';
    const aThai = item.a_thai || '';
    if (qThai && aThai) {
      deps.speakText(qThai, () => deps.speakText(aThai));
    } else if (aThai) {
      deps.speakText(aThai);
    } else if (qThai) {
      deps.speakText(qThai);
    }
  }

  function playQAudio(i: number, which: 'q' | 'a'): void {
    // app.js:1331-1337
    const item = qDeck[i];
    if (!item || typeof deps.speakText !== 'function') return;
    if (typeof deps.stopCurrentAudio === 'function') deps.stopCurrentAudio();
    const txt = which === 'q' ? item.q_thai || '' : item.a_thai || '';
    if (txt) deps.speakText(txt);
  }

  function deleteQCard(i: number): void {
    // app.js:1343-1354
    // Branch: in questions mode qDeck is authoritative; otherwise fall back to
    // the shared `deck` (cards mode) so the same button works on dash cards.
    const deckArr = getDeck();
    const item =
      getMode() === 'questions'
        ? (qDeck[i] as unknown as { q_thai?: string; a_thai?: string } | undefined)
        : (deckArr[i] as unknown as { q_thai?: string; a_thai?: string } | undefined);
    if (!item) return;
    if (!deps.confirm('¿Eliminar esta tarjeta? Se ocultará en futuras sesiones.')) return;
    const key = (item.q_thai || '') + '||' + (item.a_thai || '');
    const list = deletedQaStore.get().slice();
    if (list.indexOf(key) === -1) list.push(key);
    deletedQaStore.set(list);
    if (typeof deps.haptic === 'function') deps.haptic(15);
    if (getMode() === 'questions') renderQuestions();
    else (globalThis as unknown as { renderDashboard?: () => void }).renderDashboard?.();
  }

  return {
    renderQuestions,
    renderQCard,
    qCardClick,
    playQAudio,
    deleteQCard,
    getQDeck: () => qDeck,
  };
}
