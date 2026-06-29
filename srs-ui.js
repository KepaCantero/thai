// SRS UI — Mobile-first Anki-style study interface
// Depends on: srs.js (engine), $ (config.js), speakText (audio.js), renderTone (config.js)
//
// Three screens inside #srsView:
//   1. .srs-deck-picker — choose deck
//   2. .srs-study — one card at a time + rating buttons
//   3. .srs-done — session complete

var srsCurrent = null; // { deckKey, queue, idx, sessionStart, sessionStats, revealed }

function renderSrsView() {
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

  var decks = Object.keys(SRS_DECKS).map(function(key) {
    var d = SRS_DECKS[key];
    var s = getDeckStats(key);
    totalDue += s.due;
    totalNew += s.new;
    return renderDeckCard(d, s);
  }).join('');

  var quick = '<div class="srs-quick">' +
    (totalDue > 0
      ? '<button class="srs-cta-primary" onclick="startMixedSession()">▶ Estudiar todo (' + totalDue + ' due)</button>'
      : '<button class="srs-cta-primary" onclick="startSrsSession(\'palabras\')">▶ Empezar con Palabras</button>') +
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
      '<p class="srs-subtitle">Repetición espaciada · Top 1000</p>' +
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
  var view = $('srsView');
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
  recordRating(deckKey, cardId, rating);
  srsCurrent.sessionStats.reviewed++;
  if (item.isNew && rating >= 3) srsCurrent.sessionStats.learned++;
  vibrate(rating === 1 ? 30 : 10);
  advanceCard();
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
  renderSrsView();
}

function finishSession() {
  var elapsed = Math.floor((Date.now() - srsCurrent.sessionStart) / 1000);
  var stats = bumpSrsStats(srsCurrent.sessionStats.reviewed, srsCurrent.sessionStats.learned, elapsed);
  var total = srsCurrent.queue.length;
  var learned = srsCurrent.sessionStats.learned;
  var reviewed = srsCurrent.sessionStats.reviewed;
  srsCurrent = null;
  var view = $('srsView');
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
      '<button class="srs-cta-primary" onclick="renderSrsView()">Volver a mazos</button>' +
    '</div>';
}

function renderSessionEmpty(deckKey) {
  var d = SRS_DECKS[deckKey];
  var view = $('srsView');
  view.innerHTML =
    '<div class="srs-screen srs-done">' +
      '<div class="srs-done-check">✓</div>' +
      '<h2 class="srs-done-title">' + (d ? d.label : 'Mazo') + ' al día</h2>' +
      '<div class="srs-done-sub">No hay cartas que repasar ahora.</div>' +
      '<button class="srs-cta-primary" onclick="renderSrsView()">Volver</button>' +
    '</div>';
}

// ============================================================
// Mixed session (study all 3 decks at once)
// ============================================================
function startMixedSession() {
  var all = [];
  Object.keys(SRS_DECKS).forEach(function(key) {
    var q = buildSession(key);
    q.forEach(function(item) { all.push({ deckKey: key, card: item.card, cardState: item.cardState, isNew: item.isNew }); });
  });
  // Sort: learning first, then due reviews, then new
  all.sort(function(a, b) {
    var ra = priorityRank(a), rb = priorityRank(b);
    return ra - rb;
  });
  if (!all.length) { renderSessionEmpty('palabras'); return; }
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
  if (!confirm('¿Reiniciar todo el progreso SRS? Esto borra todas las programaciones de cartas.')) return;
  Object.keys(SRS_DECKS).forEach(function(key) { resetSrsDeck(key); });
  try { localStorage.removeItem('thai_srs_stats'); } catch (e) {}
  renderSrsView();
}
