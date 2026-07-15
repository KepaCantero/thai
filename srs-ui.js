// SRS UI — Mobile-first Anki-style study interface
// Depends on: srs.js (engine), $ (config.js), speakText (audio.js), renderTone (config.js)
//
// Three screens inside #srsView:
//   1. .srs-deck-picker — choose deck
//   2. .srs-study — one card at a time + rating buttons
//   3. .srs-done — session complete

var srsCurrent = null; // { deckKey, queue, idx, sessionStart, sessionStats, revealed }

// Host-container awareness — lets the same SRS UI mount either in the top-level
// #srsView (Lessons SRS) or inline inside #top1000View (Top 1000 → Estudiar sub-tab).
// srsDeckKeys restricts which decks the picker shows (null = all).
var srsHostId = 'srsView';
var srsOnExit = null;     // callback when user exits inline SRS (restores parent view)
var srsDeckKeys = null;   // null = all SRS_DECKS, array = restrict to these keys

function getActiveSrsDeckKeys() {
  return srsDeckKeys || Object.keys(SRS_DECKS);
}

function mountSrsInline(hostId, onExit, deckKeys) {
  if (srsHostId !== hostId) {
    var old = document.getElementById(srsHostId);
    if (old) old.classList.remove('srs-host');
  }
  srsHostId = hostId;
  srsOnExit = onExit || null;
  srsDeckKeys = deckKeys || null;
  var host = document.getElementById(hostId);
  if (host) host.classList.add('srs-host');
}

function unmountSrsInline() {
  var host = document.getElementById(srsHostId);
  if (host) host.classList.remove('srs-host');
  srsHostId = 'srsView';
  srsOnExit = null;
  srsDeckKeys = null;
}

// Go back to the deck picker (or the inline host's parent view if mounted inline).
function srsGoHome() {
  if (srsOnExit) {
    var cb = srsOnExit;
    unmountSrsInline();
    cb();
  } else {
    renderSrsView();
  }
}

// Top-level SRS mode shows the LESSONS decks (palabras/frases/preguntas from DATA.*).
// The Top 1000 → Estudiar sub-tab calls mountSrsInline() with a different host
// and a Top-1000-only deck filter (see top1000-ui.js).
var SRS_LESSON_DECK_KEYS = ['lec-palabras', 'lec-frases', 'lec-preguntas'];
var SRS_TOP1000_DECK_KEYS = ['palabras', 'estructuras', 'frases'];

function renderSrsView() {
  mountSrsInline('srsView', null, SRS_LESSON_DECK_KEYS);
  var view = $('srsView');
  if (!view) return;
  view.innerHTML = renderDeckPicker();
}

// ============================================================
// 1. DECK PICKER
// ============================================================
function renderDeckPicker() {
  var stats = loadSrsStats();
  var totalDue = 0;
  var totalNew = 0;
  var keys = getActiveSrsDeckKeys();
  var firstKey = null;

  var decks = keys.map(function(key) {
    var d = SRS_DECKS[key];
    if (!d) return '';
    if (!firstKey) firstKey = key;
    var s = getDeckStats(key);
    totalDue += s.due;
    totalNew += s.new;
    return renderDeckCard(d, s);
  }).join('');

  var subtitle = (srsHostId === 'top1000View')
    ? 'Repetición espaciada · Top 1000'
    : 'Repetición espaciada · Lecciones';

  var quick = '<div class="srs-quick">' +
    (totalDue > 0
      ? '<button class="srs-cta-primary" onclick="startMixedSession()">▶ Estudiar todo (' + totalDue + ' due)</button>'
      : '<button class="srs-cta-primary" onclick="startSrsSession(\'' + firstKey + '\')">▶ Empezar</button>') +
    '</div>';

  var today = '<div class="srs-today">' +
    '<span class="srs-today-label">Hoy</span>' +
    '<span class="srs-today-stat">' + (stats.reviewed || 0) + ' repasadas</span>' +
    '<span class="srs-today-stat">' + (stats.learned || 0) + ' nuevas</span>' +
    '<span class="srs-today-time">' + formatDuration(stats.timeSec || 0) + '</span>' +
    '</div>';

  return '<div class="srs-screen srs-deck-picker">' +
    '<header class="srs-header">' +
      '<h1 class="srs-title">Estudiar</h1>' +
      '<p class="srs-subtitle">' + subtitle + '</p>' +
    '</header>' +
    today +
    quick +
    '<div class="srs-deck-list">' + decks + '</div>' +
    '<div class="srs-reset-row">' +
      '<button class="srs-reset-btn" onclick="confirmResetAll()">↺ Reiniciar progreso</button>' +
    '</div>' +
  '</div>';
}

function renderDeckCard(deck, stats) {
  var due = stats.due;
  var hasWork = due > 0 || stats.new > 0;
  var dueBadge = due > 0
    ? '<span class="srs-deck-due">' + due + ' due</span>'
    : '<span class="srs-deck-due srs-deck-due-zero">al día ✓</span>';

  return '<button class="srs-deck-card" onclick="startSrsSession(\'' + deck.key + '\')">' +
    '<div class="srs-deck-icon">' + deck.icon + '</div>' +
    '<div class="srs-deck-info">' +
      '<div class="srs-deck-name">' + deck.label + '</div>' +
      '<div class="srs-deck-meta">' +
        dueBadge +
        '<span class="srs-deck-new">' + stats.new + ' nuevas</span>' +
        '<span class="srs-deck-seen">' + stats.seen + '/' + stats.total + ' vistas</span>' +
      '</div>' +
    '</div>' +
    '<div class="srs-deck-arrow">' + (hasWork ? '▶' : '✓') + '</div>' +
  '</button>';
}

// ============================================================
// 2. STUDY SESSION
// ============================================================
function startSrsSession(deckKey, opts) {
  opts = opts || {};
  if (!SRS_DECKS[deckKey]) return;
  var queue = opts.queue || buildSession(deckKey);
  srsCurrent = {
    deckKey: deckKey,
    mixed: !!opts.mixed,
    queue: queue,
    idx: 0,
    sessionStart: Date.now(),
    sessionStats: { reviewed: 0, learned: 0 },
    revealed: false
  };
  if (!queue.length) {
    renderSessionEmpty(deckKey);
    return;
  }
  renderStudyScreen();
}

function renderStudyScreen() {
  var view = $(srsHostId);
  var item = srsCurrent.queue[srsCurrent.idx];
  var total = srsCurrent.queue.length;
  var pos = srsCurrent.idx + 1;
  var deck = SRS_DECKS[srsCurrent.deckKey];
  srsCurrent.revealed = false;

  var card = item.card;
  var deckKind = deck.kind;

  // Header (sticky)
  var header = '<header class="srs-study-top">' +
    '<button class="srs-icon-btn" onclick="exitSrsSession()" aria-label="Salir">✕</button>' +
    '<div class="srs-progress">' +
      '<div class="srs-progress-count">' + pos + ' / ' + total + '</div>' +
      '<div class="srs-progress-bar"><div class="srs-progress-fill" style="width:' + (pos/total*100).toFixed(1) + '%"></div></div>' +
    '</div>' +
    '<button class="srs-icon-btn" onclick="undoSrsLast()" aria-label="Deshacer" ' + (srsCurrent.sessionStats.reviewed === 0 ? 'disabled' : '') + '>↶</button>' +
  '</header>';

  // Card stage
  var cardHtml = renderSrsCardFront(card, deckKind, item);

  // Bottom thumb zone: play phrase + rating actions (hidden until reveal)
  var intervals = previewIntervals(item.cardState);
  var bottomBar = renderBottomBar(card, deckKind, intervals, !srsCurrent.revealed);

  view.innerHTML =
    '<div class="srs-screen srs-study">' +
      header +
      '<div class="srs-card-stage" id="srsCardStage">' + cardHtml + '</div>' +
      bottomBar +
    '</div>';

  bindCardStageTap();
  // Audio at the start: auto-play when card appears (al principio)
  setTimeout(playSrsPhrase, 200);
}

function renderBottomBar(card, kind, intervals, hidden) {
  var phraseThai = getCardPhraseThai(card, kind);
  var playBtn = phraseThai
    ? '<button class="srs-play-phrase" id="srsPlayPhrase" onclick="playSrsPhrase()"' + (hidden ? ' hidden' : '') + '>' +
        '<span class="srs-play-icon">▶</span>' +
        '<span class="srs-play-label">Frase</span>' +
      '</button>'
    : '';
  return '<div class="srs-bottom-bar">' +
    playBtn +
    renderRatingActions(intervals, hidden) +
  '</div>';
}

function getCardPhraseThai(card, kind) {
  if (kind === 'word') return card.phrase && card.phrase.thai;
  if (kind === 'phrase') return card.thai;
  if (kind === 'structure') {
    var ex = card.examples && card.examples[0];
    return ex && ex.thai;
  }
  if (kind === 'lesson-word') return card.thai;
  if (kind === 'lesson-phrase') return card.thai;
  if (kind === 'lesson-question') return card.q_thai || card.a_thai;
  return null;
}

function playSrsPhrase() {
  if (!srsCurrent) return;
  var item = srsCurrent.queue[srsCurrent.idx];
  var deck = SRS_DECKS[srsCurrent.deckKey];
  var text = getCardPhraseThai(item.card, deck.kind);
  if (text && typeof speakText === 'function') speakText(text);
}

function renderSrsCardFront(card, kind, item) {
  var front, back;
  if (kind === 'word') { front = renderWordFront(card); back = renderWordBack(card); }
  else if (kind === 'structure') { front = renderStructureFront(card); back = renderStructureBack(card); }
  else if (kind === 'phrase') { front = renderPhraseFront(card); back = renderPhraseBack(card); }
  else if (kind === 'lesson-word') { front = renderLessonWordFront(card); back = renderLessonWordBack(card); }
  else if (kind === 'lesson-phrase') { front = renderLessonPhraseFront(card); back = renderLessonPhraseBack(card); }
  else if (kind === 'lesson-question') { front = renderLessonQuestionFront(card); back = renderLessonQuestionBack(card); }
  var tagText = item.isNew ? 'NUEVA' : (item.isLearning ? 'APRENDIENDO' : 'REVISIÓN');
  var tagKind = item.isNew ? 'new' : (item.isLearning ? 'learn' : 'review');
  return '<div class="srs-card" id="srsCard" data-kind="' + kind + '" data-tag="' + tagKind + '">' +
    '<div class="srs-card-face srs-card-front">' + front + '</div>' +
    '<div class="srs-card-face srs-card-back">' + back + '</div>' +
    '<div class="srs-card-tag">' + tagText + '</div>' +
  '</div>';
}

function renderRatingActions(intervals, hidden) {
  return '<div class="srs-actions' + (hidden ? ' srs-actions-hidden' : '') + '" id="srsActions">' +
    '<button class="srs-rating srs-again" onclick="rateCurrent(1)">' +
      '<span class="srs-r-label">Otra vez</span>' +
      '<span class="srs-r-interval">' + intervals[1] + '</span>' +
    '</button>' +
    '<button class="srs-rating srs-hard" onclick="rateCurrent(2)">' +
      '<span class="srs-r-label">Difícil</span>' +
      '<span class="srs-r-interval">' + intervals[2] + '</span>' +
    '</button>' +
    '<button class="srs-rating srs-good" onclick="rateCurrent(3)">' +
      '<span class="srs-r-label">Bien</span>' +
      '<span class="srs-r-interval">' + intervals[3] + '</span>' +
    '</button>' +
    '<button class="srs-rating srs-easy" onclick="rateCurrent(4)">' +
      '<span class="srs-r-label">Fácil</span>' +
      '<span class="srs-r-interval">' + intervals[4] + '</span>' +
    '</button>' +
  '</div>';
}

// --- WORD cards ---
function renderWordFront(w) {
  var tone = (typeof renderTone === 'function' && w.tone) ? renderTone(w.tone) : '';
  return '<div class="srs-card-type">PALABRA · #' + w.rank + '</div>' +
    '<div class="srs-thai-big">' + w.thai + '</div>' +
    '<div class="srs-phonetic-es">' + (w.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
    '<div class="srs-card-hint">Toca para revelar ↻</div>';
}

function renderWordBack(w) {
  var tone = (typeof renderTone === 'function' && w.tone) ? renderTone(w.tone) : '';
  var head = '<div class="srs-back-head">' +
    '<div class="srs-thai-med">' + w.thai + ' ' + speakBtn(w.thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (w.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
  '</div>';
  var meaning = '<div class="srs-meaning">' +
    '<div class="srs-meaning-es">' + w.spanish + '</div>' +
    (w.english ? '<div class="srs-meaning-en">' + w.english + '</div>' : '') +
  '</div>';
  var phrase = w.phrase && w.phrase.thai
    ? '<div class="srs-example-block">' +
        '<div class="srs-example-label">Frase ' + speakBtn(w.phrase.thai) + '</div>' +
        '<div class="srs-example-thai">' + w.phrase.thai + '</div>' +
        '<div class="srs-example-es">' + (w.phrase.spanish || '') + '</div>' +
      '</div>'
    : '';
  return head + meaning + phrase;
}

// --- STRUCTURE cards ---
function renderStructureFront(s) {
  return '<div class="srs-card-type">ESTRUCTURA · #' + s.id + '</div>' +
    '<div class="srs-thai-med">' + s.name + '</div>' +
    '<div class="srs-importance">' + stars(s.importance) + '</div>' +
    '<div class="srs-card-hint">Toca para ver explicación ↻</div>';
}

function renderStructureBack(s) {
  var examples = (s.examples || []).slice(0, 3).map(function(e) {
    return '<div class="srs-example-block">' +
      '<div class="srs-example-label">' + (e.rtgs||'') + ' ' + speakBtn(e.thai) + '</div>' +
      '<div class="srs-example-thai">' + e.thai + '</div>' +
      '<div class="srs-example-es">' + (e.spanish||'') + '</div>' +
    '</div>';
  }).join('');
  return '<div class="srs-back-head">' +
    '<div class="srs-thai-med">' + s.name + '</div>' +
    '<div class="srs-importance">' + stars(s.importance) + '</div>' +
  '</div>' +
  '<div class="srs-section"><div class="srs-section-label">Cuándo</div><div class="srs-section-text">' + s.when + '</div></div>' +
  '<div class="srs-section"><div class="srs-section-label">Errores típicos</div><div class="srs-section-text">' + s.mistakes + '</div></div>' +
  examples;
}

// --- PHRASE cards ---
function renderPhraseFront(p) {
  return '<div class="srs-card-type">FRASE · #' + p.id + '</div>' +
    '<div class="srs-thai-med">' + p.thai + '</div>' +
    '<div class="srs-phonetic-es">' + (p.rtgs || '') + '</div>' +
    '<div class="srs-card-hint">Toca para traducir ↻</div>';
}

function renderPhraseBack(p) {
  var struct = p.structureId ? (TOP1000_STRUCTURES.find(function(s){return s.id===p.structureId;})) : null;
  var structTag = struct ? '<div class="srs-struct-ref">Estructura #' + struct.id + ': ' + struct.name + '</div>' : '';
  return '<div class="srs-back-head">' +
    '<div class="srs-thai-med">' + p.thai + ' ' + speakBtn(p.thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (p.rtgs || '') + '</div>' +
  '</div>' +
  '<div class="srs-meaning">' +
    '<div class="srs-meaning-es">' + p.spanish + '</div>' +
    (p.english ? '<div class="srs-meaning-en">' + p.english + '</div>' : '') +
  '</div>' +
  (p.note ? '<div class="srs-section"><div class="srs-section-text srs-note">' + p.note + '</div></div>' : '') +
  structTag;
}


// --- LESSON WORD cards (DATA.words schema) ---
function renderLessonWordFront(w) {
  var tone = (typeof renderTone === 'function' && w.tone) ? renderTone(w.tone) : '';
  return '<div class="srs-card-type">PALABRA · LECCIÓN ' + (w.lesson || 1) + '</div>' +
    '<div class="srs-thai-big">' + w.thai + '</div>' +
    '<div class="srs-phonetic-es">' + (w.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
    '<div class="srs-card-hint">Toca para revelar ↻</div>';
}

function renderLessonWordBack(w) {
  var tone = (typeof renderTone === 'function' && w.tone) ? renderTone(w.tone) : '';
  var head = '<div class="srs-back-head">' +
    '<div class="srs-thai-med">' + w.thai + ' ' + speakBtn(w.thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (w.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
  '</div>';
  var meaning = '<div class="srs-meaning">' +
    '<div class="srs-meaning-es">' + (w.spanish || '') + '</div>' +
    (w.en ? '<div class="srs-meaning-en">' + w.en + '</div>' : '') +
  '</div>';
  var cat = w.category ? '<div class="srs-struct-ref">Categoría: ' + w.category + '</div>' : '';
  return head + meaning + cat;
}

// --- LESSON PHRASE cards (DATA.phrases schema) ---
function renderLessonPhraseFront(p) {
  var tone = (typeof renderTone === 'function' && p.tone) ? renderTone(p.tone) : '';
  return '<div class="srs-card-type">FRASE · LECCIÓN ' + (p.lesson || 1) + '</div>' +
    '<div class="srs-thai-med">' + p.thai + '</div>' +
    '<div class="srs-phonetic-es">' + (p.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
    '<div class="srs-card-hint">Toca para traducir ↻</div>';
}

function renderLessonPhraseBack(p) {
  var tone = (typeof renderTone === 'function' && p.tone) ? renderTone(p.tone) : '';
  return '<div class="srs-back-head">' +
    '<div class="srs-thai-med">' + p.thai + ' ' + speakBtn(p.thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (p.es || '') + '</div>' +
    (tone ? '<div class="srs-tone-row">' + tone + '</div>' : '') +
  '</div>' +
  '<div class="srs-meaning">' +
    '<div class="srs-meaning-es">' + (p.spanish || '') + '</div>' +
    (p.en ? '<div class="srs-meaning-en">' + p.en + '</div>' : '') +
  '</div>' +
  (p.category ? '<div class="srs-struct-ref">Categoría: ' + p.category + '</div>' : '');
}

// --- LESSON QUESTION cards (DATA.conversations Q&A schema) ---
function renderLessonQuestionFront(q) {
  return '<div class="srs-card-type">PREGUNTA · LECCIÓN ' + (q.lesson || 1) + '</div>' +
    '<div class="srs-question-label">Pregunta</div>' +
    '<div class="srs-thai-med">' + q.q_thai + '</div>' +
    '<div class="srs-phonetic-es">' + (q.q_es || '') + '</div>' +
    '<div class="srs-card-hint">Toca para ver respuesta ↻</div>';
}

function renderLessonQuestionBack(q) {
  return '<div class="srs-back-head">' +
    '<div class="srs-question-label">Pregunta</div>' +
    '<div class="srs-thai-med">' + q.q_thai + ' ' + speakBtn(q.q_thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (q.q_es || '') + '</div>' +
    '<div class="srs-meaning-es srs-mini">' + (q.q_spanish || '') + '</div>' +
  '</div>' +
  '<div class="srs-section srs-answer-block">' +
    '<div class="srs-question-label">Respuesta</div>' +
    '<div class="srs-thai-med">' + q.a_thai + ' ' + speakBtn(q.a_thai) + '</div>' +
    '<div class="srs-phonetic-es">' + (q.a_es || '') + '</div>' +
    '<div class="srs-meaning-es srs-mini">' + (q.a_spanish || '') + '</div>' +
  '</div>';
}

// --- Helpers ---
function stars(n) {
  var full = '★'.repeat(Math.max(0, Math.min(5, n)));
  var empty = '☆'.repeat(5 - Math.max(0, Math.min(5, n)));
  return '<span class="srs-stars">' + full + empty + '</span>';
}

function speakBtn(text) {
  function q(s) { return (s||'').replace(/'/g,"\\'"); }
  return '<button class="srs-speak" onclick="event.stopPropagation();srsSpeak(\'' + q(text) + '\')" aria-label="Reproducir">▶</button>';
}

function srsSpeak(text) {
  if (typeof speakText === 'function') speakText(text);
}

function formatDuration(sec) {
  if (!sec) return '0min';
  if (sec < 60) return sec + 's';
  var m = Math.round(sec / 60);
  if (m < 60) return m + 'min';
  var h = Math.floor(m / 60);
  return h + 'h ' + (m % 60) + 'min';
}

// ============================================================
// Flip + rating
// ============================================================
function bindCardStageTap() {
  var stage = $('srsCardStage');
  if (!stage) return;
  stage.onclick = function(e) {
    // Ignore taps on speaker button or interactive children
    if (e.target.closest('.srs-speak')) return;
    if (srsCurrent.revealed) return;
    revealCard();
  };
}

function revealCard() {
  if (!srsCurrent) return;
  srsCurrent.revealed = true;
  var card = $('srsCard');
  if (card) card.classList.add('srs-card-revealed');
  var actions = $('srsActions');
  if (actions) actions.classList.remove('srs-actions-hidden');
  var playBtn = $('srsPlayPhrase');
  if (playBtn) playBtn.hidden = false;
  var hint = document.querySelector('.srs-card-hint');
  if (hint) hint.style.display = 'none';
  vibrate(8);
  // Auto-play the phrase so user hears it without reaching for the button
  setTimeout(playSrsPhrase, 200);
}

function rateCurrent(rating) {
  if (!srsCurrent) return;
  if (!srsCurrent.revealed) { revealCard(); return; }
  var item = srsCurrent.queue[srsCurrent.idx];
  var deckKey = item.deckKey || srsCurrent.deckKey;
  var deck = SRS_DECKS[deckKey];
  var cardId = deck.idOf(item.card);
  var intervals = previewIntervals(item.cardState);
  var nextState = recordRating(deckKey, cardId, rating);
  srsCurrent.sessionStats.reviewed++;
  if (item.isNew && rating >= 3) srsCurrent.sessionStats.learned++;
  vibrate(rating === 1 ? 30 : 10);
  // Visual feedback: show scheduled interval before advancing
  showSrsToast('→ ' + intervals[rating], rating);
  // Anki-style learning steps: if the card is still in 'learn' state after
  // rating (Again/Hard on a new or learning card, or a lapsed review card),
  // reinsert it into the queue a few positions ahead so it reappears within
  // this session. Skip when the card graduates to 'review' or when we have
  // already shown it too many times (prevents infinite loops).
  if (nextState && nextState.state === 'learn') {
    var presentations = (item.presentations || 1) + 1;
    if (presentations <= 5) {
      var offset = reinsertOffset(nextState);
      var insertAt = Math.min(srsCurrent.idx + offset, srsCurrent.queue.length);
      var reinsertItem = {
        card: item.card,
        cardState: nextState,
        isNew: false,
        isLearning: true,
        deckKey: item.deckKey,
        presentations: presentations
      };
      srsCurrent.queue.splice(insertAt, 0, reinsertItem);
    }
  }
  setTimeout(advanceCard, 380);
}

// How many positions ahead to reinsert a learning card, based on its scheduled
// interval. Approximate — assumes ~10s per card so the card reappears close to
// its true due time without holding up the session.
function reinsertOffset(nextState) {
  var now = Math.floor(Date.now() / 1000);
  var sec = nextState.due - now;
  if (sec <= 90) return 4;    // Again (1min): ~4 cards
  if (sec <= 600) return 8;   // Hard / lapse (5–10min): ~8 cards
  return 12;                   // Long learn step: ~12 cards
}

function showSrsToast(msg, rating) {
  var existing = document.getElementById('srsToast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'srsToast';
  toast.className = 'srs-toast srs-toast-r' + (rating || 3);
  toast.textContent = msg;
  document.body.appendChild(toast);
  // force reflow then animate in
  void toast.offsetWidth;
  toast.classList.add('srs-toast-show');
  setTimeout(function() {
    toast.classList.remove('srs-toast-show');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 200);
  }, 700);
}

function advanceCard() {
  srsCurrent.idx++;
  if (srsCurrent.idx >= srsCurrent.queue.length) {
    finishSession();
    return;
  }
  if (srsCurrent.mixed) renderMixedStudyScreen();
  else renderStudyScreen();
}

function undoSrsLast() {
  // Note: full SM-2 undo is complex. v1: just step back and let user re-rate.
  if (!srsCurrent || srsCurrent.idx === 0) return;
  srsCurrent.idx--;
  srsCurrent.sessionStats.reviewed = Math.max(0, srsCurrent.sessionStats.reviewed - 1);
  renderStudyScreen();
}

function exitSrsSession() {
  var elapsed = Math.floor((Date.now() - srsCurrent.sessionStart) / 1000);
  bumpSrsStats(srsCurrent.sessionStats.reviewed, srsCurrent.sessionStats.learned, elapsed);
  srsCurrent = null;
  srsGoHome();
}

function finishSession() {
  var elapsed = Math.floor((Date.now() - srsCurrent.sessionStart) / 1000);
  var stats = bumpSrsStats(srsCurrent.sessionStats.reviewed, srsCurrent.sessionStats.learned, elapsed);
  var total = srsCurrent.queue.length;
  var learned = srsCurrent.sessionStats.learned;
  var reviewed = srsCurrent.sessionStats.reviewed;
  srsCurrent = null;
  var view = $(srsHostId);
  view.innerHTML =
    '<div class="srs-screen srs-done">' +
      '<div class="srs-done-check">✓</div>' +
      '<h2 class="srs-done-title">¡Hecho!</h2>' +
      '<div class="srs-done-stats">' +
        '<div class="srs-done-stat"><span class="num">' + total + '</span><span class="lbl">cartas</span></div>' +
        '<div class="srs-done-stat"><span class="num">' + learned + '</span><span class="lbl">nuevas</span></div>' +
        '<div class="srs-done-stat"><span class="num">' + formatDuration(elapsed) + '</span><span class="lbl">tiempo</span></div>' +
      '</div>' +
      '<div class="srs-done-today">Hoy llevas ' + (stats.reviewed || 0) + ' repasadas en ' + formatDuration(stats.timeSec || 0) + '</div>' +
      '<button class="srs-cta-primary" onclick="srsGoHome()">Volver a mazos</button>' +
    '</div>';
}

function renderSessionEmpty(deckKey) {
  var d = SRS_DECKS[deckKey];
  var view = $(srsHostId);
  view.innerHTML =
    '<div class="srs-screen srs-done">' +
      '<div class="srs-done-check">✓</div>' +
      '<h2 class="srs-done-title">' + (d ? d.label : 'Mazo') + ' al día</h2>' +
      '<div class="srs-done-sub">No hay cartas que repasar ahora.</div>' +
      '<button class="srs-cta-primary" onclick="srsGoHome()">Volver</button>' +
    '</div>';
}

// ============================================================
// Mixed session (study all 3 decks at once)
// ============================================================
function startMixedSession() {
  var keys = getActiveSrsDeckKeys();
  var all = [];
  keys.forEach(function(key) {
    var q = buildSession(key);
    q.forEach(function(item) { all.push({ deckKey: key, card: item.card, cardState: item.cardState, isNew: item.isNew }); });
  });
  // Sort: learning first, then due reviews, then new
  all.sort(function(a, b) {
    var ra = priorityRank(a), rb = priorityRank(b);
    return ra - rb;
  });
  if (!all.length) { renderSessionEmpty(keys[0]); return; }
  srsCurrent = {
    deckKey: all[0].deckKey,
    mixed: true,
    queue: all,
    idx: 0,
    sessionStart: Date.now(),
    sessionStats: { reviewed: 0, learned: 0 },
    revealed: false
  };
  renderMixedStudyScreen();
}

function priorityRank(item) {
  if (item.isLearning) return 0;
  if (item.cardState && item.cardState.due) return item.cardState.due;
  if (item.isNew) return Math.floor(Date.now()/1000) + 1000000;
  return Math.floor(Date.now()/1000);
}

function renderMixedStudyScreen() {
  // Reuse per-card deck-aware rendering by temporarily pointing deckKey
  var item = srsCurrent.queue[srsCurrent.idx];
  srsCurrent.deckKey = item.deckKey;
  renderStudyScreen();
}

// ============================================================
// Misc
// ============================================================
function vibrate(ms) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
}

function confirmResetAll() {
  if (!confirm('¿Reiniciar todo el progreso SRS de este contexto? Esto borra las programaciones de cartas de los mazos visibles.')) return;
  getActiveSrsDeckKeys().forEach(function(key) { resetSrsDeck(key); });
  try { localStorage.removeItem('thai_srs_stats'); } catch (e) {}
  srsGoHome();
}
