// State vars declared WITHOUT `var` so they become configurable implicit
// globals. The stateBridge in src/core/state/stateBridge.ts wraps each in an
// Object.defineProperty accessor (get/set) that proxies through to the typed
// stores. Browser `var` declarations at script top level are non-configurable,
// which breaks defineProperty — implicit globals are configurable.
deck = []; idx = 0;
activeLesson = 'all'; activeCategory = 'all'; activeType = 'all'; searchQuery = '';
known = new Set(); unknown = new Set();
difficult = new Set();
try {
  JSON.parse(localStorage.getItem('thai_difficult') || '[]').forEach(function(k) { if (k) difficult.add(k); });
} catch (e) {}
dashboardMode = false; shadowingMode = false; matrixMode = false; tonesMode = false; questionsMode = false;
currentMode = 'cards';
// Top-level scope: 'lecciones' | 'top1000' | 'comprehensive'. Filters the whole
// app down to one content source. Hidden scopes (no cards) are omitted from the menu.
activeScope = 'lecciones';
try { activeScope = localStorage.getItem('thai_scope') || 'lecciones'; } catch (e) {}
activeToneSel = null; // selected tone in Tones mode view (null = all)
filterPanelOpen = false;

var PLAY_REPS = 4, REPEAT_GAP = 2000, CARD_GAP = 3000;
running = false; paused = false; playTimeout = null; playResumeFn = null;

// Set to true to include entries marked verified:false (pending teacher review).
var SHOW_UNVERIFIED = true;
function isVerifiedEntry(c) { return SHOW_UNVERIFIED || c.verified !== false; }

// --- Get all categories ---
function getCategories() {
  var cats = [], seen = {};
  DATA.words.forEach(function(w) { if (!seen[w.category]) { seen[w.category] = true; cats.push(w.category); } });
  DATA.phrases.forEach(function(p) { if (!seen[p.category]) { seen[p.category] = true; cats.push(p.category); } });
  if (DATA.conversations) {
    DATA.conversations.forEach(function(c) { if (isVerifiedEntry(c) && !seen[c.category]) { seen[c.category] = true; cats.push(c.category); } });
  }
  return cats;
}

// --- Lesson tabs (row 1) ---
function buildLessonTabs() {
  var allLessons = [], seen = {};
  DATA.words.forEach(function(w) { var l = w.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  DATA.phrases.forEach(function(p) { var l = p.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  if (DATA.conversations) {
    DATA.conversations.forEach(function(c) { if (!isVerifiedEntry(c)) return; var l = c.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  }
  allLessons.sort(function(a, b) { return a - b; });

  var tabs = [{ key: 'all', label: 'All' }];
  allLessons.forEach(function(l) { tabs.push({ key: String(l), label: 'Lesson ' + l }); });
  tabs.push({ key: 'youtube', label: 'YouTube' });
  tabs.push({ key: 'dificiles', label: '★ Difíciles (' + difficult.size + ')' });
  if (typeof SHOW_UNVERIFIED !== 'undefined' && SHOW_UNVERIFIED) {
    var cthaiCount = (DATA.conversations || []).filter(function(c) { return c.verified === false; }).length;
    tabs.push({ key: 'cthai', label: '🎬 C.Thai (' + cthaiCount + ')' });
  }

  $('lessonTabs').innerHTML = tabs.map(function(t) {
    return '<button class="tab ' + (activeLesson === t.key ? 'active' : '') + '" onclick="setLesson(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');
}

function setLesson(l) {
  activeLesson = l;
  idx = 0;
  buildLessonTabs();
  buildFilterChips();
  if (matrixMode) { resetMatrixTheme(); renderMatrix(); }
  if (shadowingMode) { exitShadowingPlayer(); return; }
  if (tonesMode) { renderTonesView(); return; }
  rebuild();
}

// --- Search ---
function onSearch(val) {
  searchQuery = val.trim().toLowerCase();
  idx = 0;
  if (searchQuery) {
    // auto-switch to cards mode to see results
    if (currentMode === 'tones' || currentMode === 'matrix' || currentMode === 'shadowing') setMode('cards');
  }
  buildFilterChips();
  rebuild();
}

// --- Filter chips (active filters shown as removable chips) ---
function buildFilterChips() {
  var chips = [];
  if (activeType !== 'all') chips.push({ k: 'type', val: activeType, label: capitalize(activeType) });
  if (activeCategory !== 'all') {
    if (activeCategory.startsWith('tone:')) {
      var tk = activeCategory.slice(5);
      chips.push({ k: 'category', val: activeCategory, label: TONES[tk].symbol + ' ' + TONES[tk].name + ' tone', toneCls: 'tone-opt' });
    } else {
      chips.push({ k: 'category', val: activeCategory, label: CAT_LABELS[activeCategory] || capitalize(activeCategory) });
    }
  }
  if (searchQuery) chips.push({ k: 'search', val: '', label: '"' + searchQuery + '"' });

  var container = $('filterChips');
  if (!chips.length) {
    container.innerHTML = '<span class="filter-chips-empty">All content — open Filters to narrow</span>';
    return;
  }
  container.innerHTML = chips.map(function(c) {
    return '<button class="filter-chip' + (c.toneCls ? ' ' + c.toneCls : '') + '" onclick="clearFilter(\'' + c.k + '\')">' +
      c.label + '<span class="fc-x">&#10005;</span></button>';
  }).join('');
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// --- Filter panel (collapsible, holds type + topic + tone) ---
function toggleFilterPanel() {
  filterPanelOpen = !filterPanelOpen;
  $('filterPanel').style.display = filterPanelOpen ? '' : 'none';
  $('filterToggle').classList.toggle('open', filterPanelOpen);
  $('filterToggle').innerHTML = (filterPanelOpen ? '&#9650; ' : '&#9776; ') + 'Filters';
  document.body.classList.toggle('fp-open', filterPanelOpen);
  if (filterPanelOpen) buildFilterPanel();
}

function buildFilterPanel() {
  // Type options
  var types = [
    { key: 'all', label: 'All' },
    { key: 'words', label: 'Words' },
    { key: 'phrases', label: 'Phrases' },
    { key: 'conversations', label: 'Conversations' },
    { key: 'pairs', label: 'Pairs' }
  ];
  $('fpType').innerHTML = types.map(function(t) {
    return '<button class="fp-opt' + (activeType === t.key ? ' active' : '') + '" onclick="setType(\'' + t.key + '\')">' + t.label + '</button>';
  }).join('');

  // Topic options
  var cats = getCategories();
  var topicHtml = '<button class="fp-opt' + (activeCategory === 'all' ? ' active' : '') + '" onclick="setCategory(\'all\')">All</button>';
  cats.forEach(function(c) {
    var label = CAT_LABELS[c] || capitalize(c);
    topicHtml += '<button class="fp-opt' + (activeCategory === c ? ' active' : '') + '" onclick="setCategory(\'' + c + '\')">' + label + '</button>';
  });
  // Pares — special category: shows only tone-minimal-pair cards
  topicHtml += '<button class="fp-opt pair-opt' + (activeCategory === 'pares' ? ' active' : '') + '" onclick="setCategory(\'pares\')">⚖ Pairs (Tone)</button>';
  // Practica — daily-life sentences
  topicHtml += '<button class="fp-opt practica-opt' + (activeCategory === 'practica' ? ' active' : '') + '" onclick="setCategory(\'practica\')">✍ Practice</button>';
  // Tone options (sub-section)
  topicHtml += '<span class="tab-sep" style="align-self:center">&#9615; Tone</span>';
  Object.keys(TONES).forEach(function(k) {
    var key = 'tone:' + k;
    var info = TONES[k];
    topicHtml += '<button class="fp-opt tone-opt' + (activeCategory === key ? ' active' : '') + '" style="' + (activeCategory === key ? 'background:' + info.color + ';color:#1a1a2e;border-color:' + info.color : 'color:' + info.color) + '" onclick="setCategory(\'' + key + '\')">' + info.symbol + ' ' + info.name + '</button>';
  });
  $('fpTopic').innerHTML = topicHtml;
}

function clearFilters() {
  activeType = 'all';
  activeCategory = 'all';
  searchQuery = '';
  $('searchInput').value = '';
  idx = 0;
  buildFilterChips();
  buildFilterPanel();
  rebuild();
}

function clearFilter(k) {
  if (k === 'type') activeType = 'all';
  else if (k === 'category') activeCategory = 'all';
  else if (k === 'lesson') {
    activeLesson = 'all';
    buildLessonTabs();
  }
  else if (k === 'search') { searchQuery = ''; $('searchInput').value = ''; }
  else if (k === 'all') {
    activeType = 'all'; activeCategory = 'all'; activeLesson = 'all';
    searchQuery = ''; $('searchInput').value = '';
    buildLessonTabs();
  }
  idx = 0;
  buildFilterChips();
  if (filterPanelOpen) buildFilterPanel();
  if (k === 'lesson' || k === 'all') {
    if (matrixMode) { resetMatrixTheme(); renderMatrix(); }
    if (shadowingMode) { exitShadowingPlayer(); return; }
    if (tonesMode) { renderTonesView(); return; }
  }
  rebuild();
}

function setCategory(c) {
  activeCategory = c;
  idx = 0;
  // Pares/tone filters only make sense in cards/dashboard — leave special modes
  if (c !== 'all' && (currentMode === 'tones' || currentMode === 'matrix' || currentMode === 'shadowing' || currentMode === 'questions')) {
    setMode('cards');
  }
  buildFilterChips();
  if (filterPanelOpen) buildFilterPanel();
  rebuild();
}

function setType(t) {
  activeType = t;
  idx = 0;
  buildFilterChips();
  if (filterPanelOpen) buildFilterPanel();
  rebuild();
}

// --- Rebuild after any filter change ---
function rebuild() {
  deck = buildDeck();
  if (activeLesson === 'dificiles') deck = deck.filter(function(it) { return difficult.has(cardKey(it)); });
  buildFilterChips();
  updateEmptyHint();
  $('progress').textContent = deck.length + ' cards';
  if (currentMode === 'dashboard') renderDashboard();
  else if (currentMode === 'questions') renderQuestions();
  else if (currentMode === 'tones') renderTonesView();
  else if (currentMode === 'cards') showCard();
}

// --- Empty deck feedback ---
function updateEmptyHint() {
  var existing = $('emptyHint');
  if (deck.length > 0) {
    if (existing) existing.remove();
    return;
  }
  if (currentMode !== 'cards' && currentMode !== 'dashboard') return;

  var suggestions = [];
  if (activeCategory !== 'all') {
    var label = activeCategory.startsWith('tone:')
      ? TONES[activeCategory.slice(5)].name + ' tone'
      : (CAT_LABELS[activeCategory] || activeCategory);
    suggestions.push({ k: 'category', label: 'clear ' + label });
  }
  if (activeType !== 'all') suggestions.push({ k: 'type', label: 'clear ' + activeType });
  if (activeLesson !== 'all') suggestions.push({ k: 'lesson', label: activeLesson === 'youtube' ? 'clear YouTube' : (activeLesson === 'dificiles' ? 'clear Difíciles' : 'clear Lesson ' + activeLesson) });
  if (searchQuery) suggestions.push({ k: 'search', label: 'clear search "' + searchQuery + '"' });

  if (!suggestions.length) {
    suggestions.push({ k: 'all', label: 'reset all filters' });
  }

  var prefix = '0 cards for this combination — ';
  if (activeLesson === 'dificiles' && difficult.size === 0) {
    prefix = 'No cards marked as difficult yet. Use the + button on any card to add it. — ';
  }

  var hint = existing || document.createElement('div');
  hint.id = 'emptyHint';
  hint.className = 'empty-hint';
  hint.innerHTML = prefix + suggestions.map(function(s) {
    return '<button onclick="clearFilter(\'' + s.k + '\')">' + s.label + '</button>';
  }).join(' ');
  // insert after filter panel
  var anchor = $('filterPanel');
  anchor.parentNode.insertBefore(hint, anchor.nextSibling);
}

// --- Build deck ---
function buildDeck() {
  var items = [];
  var youtubeOnly = activeLesson === 'youtube';
  var dificilesOnly = activeLesson === 'dificiles';
  var cthaiOnly = activeLesson === 'cthai';
  var lessonNum = (activeLesson === 'all' || youtubeOnly || dificilesOnly || cthaiOnly) ? null : parseInt(activeLesson);
  var isTone = activeCategory.startsWith('tone:');
  var isPares = activeCategory === 'pares';
  var isPractica = activeCategory === 'practica';
  var cat = (isTone || isPares || isPractica) ? null : activeCategory;
  var tone = isTone ? activeCategory.slice(5) : null;
  var type = activeType;

  function matchLesson(item) {
    if (youtubeOnly) return item.category === 'youtube';
    if (dificilesOnly) return true; // membership filter applied at call sites
    if (cthaiOnly) return item.verified === false;
    return !lessonNum || (item.lesson || 1) === lessonNum;
  }
  function matchCategory(item) { return cat === 'all' || item.category === cat; }
  function matchTone(itemTone) { return tone && itemTone && itemTone.split('-').indexOf(tone) !== -1; }

  function matchSearch(item) {
    if (!searchQuery) return true;
    var fields = [item.spanish, item.es, item.en, item.thai, item.phonetic,
                  item.q_spanish, item.a_spanish, item.q_es, item.a_es,
                  item.q_en, item.a_en,
                  item.note].filter(Boolean);
    // English translations live in config.js maps, not on the item itself
    if (typeof THAI_EN !== 'undefined') {
      if (item.thai && THAI_EN[item.thai]) fields.push(THAI_EN[item.thai]);
      if (item.w1 && item.w1.thai && THAI_EN[item.w1.thai]) fields.push(THAI_EN[item.w1.thai]);
      if (item.w2 && item.w2.thai && THAI_EN[item.w2.thai]) fields.push(THAI_EN[item.w2.thai]);
    }
    if (typeof PHRASE_EN !== 'undefined' && item.thai && PHRASE_EN[item.thai]) fields.push(PHRASE_EN[item.thai]);
    if (typeof CONV_EN !== 'undefined' && item.q_thai && CONV_EN[item.q_thai]) {
      fields.push(CONV_EN[item.q_thai].q, CONV_EN[item.q_thai].a);
    }
    return fields.some(function(f) { return f.toLowerCase().indexOf(searchQuery) !== -1; });
  }

  // Pares mode: only pair cards, ignoring type filter and per-pair sub-category
  if (isPares) {
    if (DATA.pairs) {
      var wordMap = {};
      DATA.words.forEach(function(w) { wordMap[w.thai] = w; });
      DATA.pairs.filter(function(p) {
        if (searchQuery) {
          var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
          var pairItem = { spanish: (w1 && w1.spanish) + ' ' + (w2 && w2.spanish), note: p.note };
          if (!matchSearch(pairItem) && !(w1 && matchSearch(w1)) && !(w2 && matchSearch(w2))) return false;
        }
        return true;
      }).forEach(function(p) {
        var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
        if (w1 && w2) {
          items.push({ type: 'pair', w1: w1, w2: w2, note: p.note, category: p.category, thai: p.w1 + ' / ' + p.w2 });
        }
      });
    }
    return items;
  }

  // Practica mode: only practice-phrase cards
  if (isPractica) {
    if (DATA.practica) {
      DATA.practica.filter(function(p) {
        if (!matchLesson(p)) return false;
        return matchSearch(p);
      }).forEach(function(p) {
        items.push(Object.assign({}, p, { type: 'phrase', highlightTone: null }));
      });
    }
    return items;
  }

  if (type === 'all' || type === 'words') {
    DATA.words.filter(function(w) {
      if (!matchLesson(w)) return false;
      if (isTone) return matchTone(w.tone) && matchSearch(w);
      if (!matchSearch(w)) return false;
      return matchCategory(w);
    }).forEach(function(w) {
      items.push(Object.assign({}, w, { type: 'word' }));
    });
  }

  if (type === 'all' || type === 'phrases') {
    DATA.phrases.filter(function(p) {
      if (!matchLesson(p)) return false;
      if (!matchSearch(p)) return false;
      if (isTone) return matchTone(p.tone);
      return matchCategory(p);
    }).forEach(function(p) {
      items.push(Object.assign({}, p, { type: 'phrase', highlightTone: tone }));
    });
  }

  if (DATA.conversations && (type === 'all' || type === 'conversations')) {
    var deletedKeys = {};
    try { JSON.parse(localStorage.getItem('thai_deleted_qa') || '[]').forEach(function(k){ deletedKeys[k] = 1; }); } catch (e) {}
    DATA.conversations.filter(function(c) {
      if (!isVerifiedEntry(c)) return false;
      var dkey = (c.q_thai || '') + '||' + (c.a_thai || '');
      if (deletedKeys[dkey]) return false;
      if (!matchLesson(c)) return false;
      if (!matchSearch(c)) return false;
      if (isTone) return matchTone(c.q_tone) || matchTone(c.a_tone);
      return matchCategory(c);
    }).forEach(function(c) {
      items.push(Object.assign({}, c, { type: 'conversation', highlightTone: tone }));
    });
  }

  if (DATA.pairs && (type === 'all' || type === 'pairs')) {
    var wordMap = {};
    DATA.words.forEach(function(w) { wordMap[w.thai] = w; });
    DATA.pairs.filter(function(p) {
      // cthai scope: pairs are not cthai content — skip them entirely.
      if (activeLesson === 'cthai') return false;
      if (searchQuery) {
        var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
        var pairItem = { spanish: (w1 && w1.spanish) + ' ' + (w2 && w2.spanish), note: p.note };
        if (!matchSearch(pairItem) && !(w1 && matchSearch(w1)) && !(w2 && matchSearch(w2))) return false;
      }
      if (isTone) {
        var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
        return (w1 && matchTone(w1.tone)) || (w2 && matchTone(w2.tone));
      }
      return matchCategory(p);
    }).forEach(function(p) {
      var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
      if (w1 && w2) {
        items.push({ type: 'pair', w1: w1, w2: w2, note: p.note, category: p.category, thai: p.w1 + ' / ' + p.w2 });
      }
    });
  }

  return items;
}

function detectQTopic(thai) {
  if (!thai) return 'presente';
  if (thai.indexOf('จะ') !== -1) return 'futuro';
  if (thai.indexOf('อยาก') !== -1) return 'querer';
  if (thai.indexOf('ชอบ') !== -1) return 'gustar';
  if (thai.indexOf('ไม่') !== -1) return 'negación';
  if (thai.indexOf('กำลัง') !== -1) return 'progresivo';
  if (thai.indexOf('แล้ว') !== -1) return 'pasado';
  if (thai.indexOf('ไหม') !== -1) return 'pregunta sí/no';
  if (thai.indexOf('ที่ไหน') !== -1) return 'pregunta dónde';
  if (thai.indexOf('อะไร') !== -1) return 'pregunta qué';
  if (thai.indexOf('กี่') !== -1 || thai.indexOf('เท่าไหร่') !== -1) return 'pregunta cuánto';
  return 'presente';
}

// Build Q&A deck: cumulative by lesson (1..N).
// Sources: existing conversations + phrases + generated pronoun×verb combinations.
function buildQuestionsDeck() {
  var maxL = activeLesson === 'all' ? Infinity : parseInt(activeLesson);
  var items = [];
  var seen = {};

  function push(item) {
    var key = (item.q_thai || '') + '||' + (item.a_thai || '') + '||' +
              (item.q_spanish || '') + '||' + (item.a_spanish || '');
    if (seen[key]) return;
    seen[key] = true;
    items.push(item);
  }

  // 1. Existing conversations — proper Q&A pairs.
  // Skip cards the user deleted via the 🗑️ button (persisted in localStorage).
  var deleted = {};
  try { JSON.parse(localStorage.getItem('thai_deleted_qa') || '[]').forEach(function(k){ deleted[k] = 1; }); } catch (e) {}
  (DATA.conversations || []).forEach(function(c) {
    if ((c.lesson || 1) > maxL) return;
    var dkey = (c.q_thai || '') + '||' + (c.a_thai || '');
    if (deleted[dkey]) return;
    push({
      type: 'qa',
      source: 'conversación',
      topic: c.category,
      tense: detectQTopic(c.q_thai),
      q_thai: c.q_thai,
      q_phonetic: c.q_phonetic,
      q_es: c.q_es,
      q_en: c.q_en || c.q_spanish,
      q_spanish: c.q_spanish,
      a_thai: c.a_thai,
      a_phonetic: c.a_phonetic,
      a_es: c.a_es,
      a_en: c.a_en || c.a_spanish,
      a_spanish: c.a_spanish
    });
  });

  return items;
}



// Strip leading "to " from English-style verb for natural sentence generation.


function haptic(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }
function flipCard() { $('card').classList.toggle('flipped'); haptic(8); if (!running) playAudio(); }

// Attach click handler (not inline onclick, more reliable during Play All).
// Phase 2: this listener was originally on DOMContentLoaded. The four data
// files (data.js, top1000*.js, audio-manifest.js) were migrated to JSON
// fetched lazily by src/core/data/loader.ts, so the DOM may be ready before
// the data globals are populated. The TS entry point dispatches
// 'thai-data-ready' after loadAllData() resolves — wait for that.
window.addEventListener('thai-data-ready', function() {
  try {
    var cc = $('cardContainer');
    if (cc) cc.addEventListener('click', function(e) { flipCard(); });
    var ttsSel = $('ttsSelect');
    if (ttsSel && typeof AUDIO_ENGINE !== 'undefined') ttsSel.value = AUDIO_ENGINE;
    document.body.classList.toggle('mode-cards', currentMode === 'cards');
  } catch (e) {
    console.error('[app] boot failed:', e);
  }
});
function nextCard() {
  if (!deck.length) return;
  idx = (idx + 1) % deck.length;
  if (running) { jumpPlayAll(idx); } else { showCard(); }
}
function prevCard() {
  if (!deck.length) return;
  idx = (idx - 1 + deck.length) % deck.length;
  if (running) { jumpPlayAll(idx); } else { showCard(); }
}
function jumpPlayAll(newIdx) {
  clearTimeout(playTimeout);
  stopCurrentAudio();
  idx = newIdx;
  showCard();
  $('card').classList.remove('flipped');
  playRepeat(idx, 1);
}

// --- Scoring ---
function markCard(knew) {
  if (!deck.length) return;
  var card = deck[idx];
  var key = card.thai || card.q_thai || (card.w1 && card.w1.thai);
  if (knew) { known.add(key); unknown.delete(key); haptic(10); }
  else { unknown.add(key); known.delete(key); haptic(20); }
  // Feed SRS: if this card exists in an SRS deck (palabras/frases), record a
  // rating so it gets scheduled. ✓ = Bien (3), ✗ = Otra vez (1). Silent —
  // the user sees the effect in Estudiar mode. Falls through cleanly when the
  // card isn't in any SRS deck (lesson-only vocab, pairs, conversations).
  if (key && typeof findSrsCardByThai === 'function') {
    var match = findSrsCardByThai(card.thai || (card.w1 && card.w1.thai));
    if (match) recordRating(match.deckKey, match.cardId, knew ? 3 : 1);
  }
  updateStats();
  nextCard();
}


function cardKey(item) {
  if (!item) return '';
  return item.thai || item.q_thai || (item.w1 && item.w1.thai) || '';
}

function saveDifficult() {
  try { localStorage.setItem('thai_difficult', JSON.stringify(Array.from(difficult))); } catch (e) {}
}

function toggleDifficult() {
  if (!deck.length) return;
  var key = cardKey(deck[idx]);
  if (!key) return;
  var removing = difficult.has(key);
  if (removing) difficult.delete(key); else difficult.add(key);
  haptic(12);
  saveDifficult();
  buildLessonTabs(); // refresh count on the ★ Difíciles tab
  if (activeLesson === 'dificiles' && removing) {
    // Clamp idx before rebuild so the showCard inside rebuild doesn't read OOB
    if (idx > 0 && idx >= deck.length - 1) idx--;
    rebuild();
    if (idx > deck.length - 1) idx = Math.max(0, deck.length - 1);
    showCard();
  } else {
    updateDifficultBtn();
  }
}

function updateDifficultBtn() {
  var btns = document.querySelectorAll('.diff-btn, .diff-btn-bottom');
  if (!btns.length) return;
  var show = deck.length > 0;
  var inDiff = show && difficult.has(cardKey(deck[idx]));
  var label = inDiff ? '−' : '+';
  var title = inDiff ? 'Quitar de Difíciles' : 'Añadir a Difíciles';
  btns.forEach(function(b) {
    b.style.display = show ? '' : 'none';
    b.textContent = label;
    var onCls = b.classList.contains('diff-btn-bottom') ? 'diff-btn-bottom' : 'diff-btn';
    b.className = onCls + (inDiff ? (onCls === 'diff-btn-bottom' ? ' diff-btn-on' : ' diff-btn-on') : '');
    b.title = title;
    b.setAttribute('aria-label', title);
    b.setAttribute('aria-pressed', inDiff ? 'true' : 'false');
  });
}


function diffBtnHtml(item, i) {
  var inDiff = difficult.has(cardKey(item));
  return '<button class="dc-diff-btn' + (inDiff ? ' dc-diff-on' : '') +
    '" title="' + (inDiff ? 'Quitar de Difíciles' : 'Añadir a Difíciles') +
    '" onclick="event.stopPropagation(); toggleDifficultAt(' + i + ')">' +
    (inDiff ? '−' : '+') + '</button>';
}

function toggleDifficultAt(i) {
  if (i < 0 || i >= deck.length) return;
  var key = cardKey(deck[i]);
  if (!key) return;
  if (difficult.has(key)) difficult.delete(key); else difficult.add(key);
  saveDifficult();
  buildLessonTabs(); // refresh count on the ★ Difíciles tab
  if (filterPanelOpen) buildFilterPanel();
  renderDashboard();
}

function updateStats() {
  var t = deck.length;
  var k = 0, u = 0;
  known.forEach(function(x) { if (deck.some(function(c) { return (c.thai || c.q_thai || (c.w1 && c.w1.thai)) === x; })) k++; });
  unknown.forEach(function(x) { if (deck.some(function(c) { return (c.thai || c.q_thai || (c.w1 && c.w1.thai)) === x; })) u++; });
  $('stats').textContent = '✓ ' + k + '  ·  ✗ ' + u + '  ·  ? ' + (t - k - u);
}

// --- Keyboard ---
document.addEventListener('keydown', function(e) {
  // Don't intercept keystrokes when the user is typing in a field
  var tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (matrixMode) {
    if (e.key === 'ArrowRight') { e.preventDefault(); matrixNav(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); matrixNav(-1); }
    else if (e.key === 'r' || e.key === 'R') randomMatrix();
    else if (e.key === ' ') { e.preventDefault(); playMatrixConv(); }
    else if (e.key === 'm' || e.key === 'M') toggleMatrix();
    else if (e.key === 'Escape') setMode('cards');
    return;
  }
  if (shadowingMode) {
    if (shConvId) {
      if (e.key === 'ArrowDown') { e.preventDefault(); playShLine(shLineIdx < 0 ? 0 : Math.min(shLineIdx + 1, getShConv().lines.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (shLineIdx > 0) playShLine(shLineIdx - 1); }
      else if (e.key === ' ') { e.preventDefault(); toggleShPlayAll(); }
      else if (e.key === 'Escape') exitShadowingPlayer();
    }
    if (e.key === 'w' || e.key === 'W') toggleShadowing();
    return;
  }
  if (tonesMode) {
    if (e.key === '1') selectTone(null);
    else if (e.key === '2') selectTone('m');
    else if (e.key === '3') selectTone('l');
    else if (e.key === '4') selectTone('r');
    else if (e.key === '5') selectTone('f');
    else if (e.key === '6') selectTone('h');
    else if (e.key === ' ') { e.preventDefault(); tonesPlayAllWords(); }
    else if (e.key === 'Escape') setMode('cards');
    return;
  }
  if (e.key === 'ArrowRight') nextCard();
  else if (e.key === 'ArrowLeft') prevCard();
  else if (e.key === ' ') { e.preventDefault(); flipCard(); }
  else if (e.key === 'p' || e.key === 'P') playAudio();
  else if (e.key === '1') markCard(true);
  else if (e.key === '2') markCard(false);
  else if (e.key === 'm' || e.key === 'M') toggleMatrix();
  else if (e.key === 't' || e.key === 'T') setMode(tonesMode ? 'cards' : 'tones');
});

// --- Play All ---
function updatePlayBtn() {
  var btn = $('playAllBtn');
  var stop = $('stopBtn');
  if (running && !paused) {
    btn.textContent = '⏸ Pause';
    btn.style.background = '#0f3460';
    btn.style.color = '#ffd166';
    btn.style.borderColor = '#ffd166';
    stop.style.display = '';
  } else if (running && paused) {
    btn.textContent = '▶ Resume';
    btn.style.background = '#e94560';
    btn.style.color = '#fff';
    btn.style.borderColor = '#e94560';
    stop.style.display = '';
  } else {
    btn.textContent = '▶ Play All';
    btn.style.background = '#e94560';
    btn.style.color = '#fff';
    btn.style.borderColor = '#e94560';
    stop.style.display = 'none';
  }
}

function togglePlayAll() {
  if (!running) { startPlayAll(0); }
  else if (paused) { resumePlayAll(); }
  else { pausePlayAll(); }
}

function startPlayAll(fromIdx) {
  if (!deck.length) return;
  running = true; paused = false;
  updatePlayBtn();
  if (dashboardMode) { dashPlayAll(fromIdx); }
  else { regularPlayAll(fromIdx); }
}

function stopPlayAll() {
  running = false; paused = false;
  clearTimeout(playTimeout);
  stopCurrentAudio();
  updatePlayBtn();
  $('playAllIndicator').textContent = '';
  $('playAllProgress').textContent = '';
  if (dashboardMode) clearDashboardHighlights();
}

function pausePlayAll() {
  if (!running || paused) return;
  paused = true;
  clearTimeout(playTimeout);
  stopCurrentAudio();
  updatePlayBtn();
  $('playAllIndicator').textContent = '⏸ paused';
}

function resumePlayAll() {
  if (!running || !paused) return;
  paused = false;
  updatePlayBtn();
  if (playResumeFn) playResumeFn();
}

function regularPlayAll(cardIdx) {
  if (!running || cardIdx >= deck.length) { stopPlayAll(); return; }
  idx = cardIdx;
  showCard();
  $('playAllProgress').textContent = (cardIdx + 1) + ' / ' + deck.length;
  playRepeat(cardIdx, 1);
}

function playRepeat(cardIdx, rep) {
  if (!running) return;
  if (rep > PLAY_REPS) {
    $('playAllIndicator').textContent = 'next...';
    playResumeFn = function() { regularPlayAll(cardIdx + 1); };
    playTimeout = setTimeout(playResumeFn, CARD_GAP);
    return;
  }
  $('playAllIndicator').textContent = 'rep ' + rep + '/' + PLAY_REPS + ' — repeat!';
  playAudioItem(deck[cardIdx], function() {
    if (!running || paused) return;
    playResumeFn = function() { playRepeat(cardIdx, rep + 1); };
    playTimeout = setTimeout(playResumeFn, REPEAT_GAP);
  });
}

// --- Mode switching (unified) ---
var MODES = [
  { key: 'cards',      icon: '&#128214;', label: 'Cards',      cls: '' },
  { key: 'dashboard',  icon: '&#128192;', label: 'Dashboard',  cls: 'dashboard' },
  { key: 'questions',  icon: '&#10067;',  label: 'Questions',  cls: 'questions' },
  { key: 'shadowing',  icon: '&#128483;', label: 'Shadowing',  cls: 'shadowing' },
  { key: 'matrix',     icon: '&#129518;', label: 'Matrix',     cls: 'matrix' },
  { key: 'tones',      icon: '&#127925;', label: 'Tones',      cls: 'tones' },
  { key: 'top1000',    icon: '&#127919;', label: 'Top 1000',   cls: 'top1000' },
  { key: 'alphabet',   icon: '&#128292;', label: 'Alphabet',   cls: 'alphabet' },
  { key: 'srs',        icon: '&#9851;&#65039;', label: 'Estudiar', cls: 'srs' }
];

function buildScopeTabs() {
  var scopes = [];
  if (DATA.words && DATA.words.length) {
    var lessonCount = DATA.words.length + (DATA.phrases ? DATA.phrases.length : 0);
    scopes.push({
      key: 'lecciones', icon: '&#128218;',
      label: 'Lecciones', sub: lessonCount + ' entradas'
    });
  }
  if (typeof TOP1000_WORDS !== 'undefined' && TOP1000_WORDS.length) {
    var topN = TOP1000_WORDS.length;
    scopes.push({
      key: 'top1000', icon: '&#127919;',
      label: 'Top 1000', sub: topN + ' palabras'
    });
  }
  var cthaiN = (DATA.conversations || []).filter(function (c) { return c.verified === false; }).length;
  if (cthaiN > 0) {
    scopes.push({
      key: 'comprehensive', icon: '&#127916;',
      label: 'Comprehensible Thai', sub: cthaiN + ' diálogos'
    });
  }
  if (!scopes.some(function (s) { return s.key === activeScope; }) && scopes.length) {
    activeScope = scopes[0].key;
  }
  $('scopeTabs').innerHTML = scopes.map(function (s) {
    var active = activeScope === s.key ? ' active' : '';
    return '<button class="scope-tab' + active + '" onclick="setScope(\'' + s.key + '\')">' +
      '<span class="scope-icon">' + s.icon + '</span>' +
      '<span class="scope-label-wrap">' +
        '<span class="scope-label">' + s.label + '</span>' +
        '<span class="scope-sub">' + s.sub + '</span>' +
      '</span>' +
    '</button>';
  }).join('');
}

function setScope(scope) {
  var isFirstApply = (scope === activeScope && !setScope._applied);
  activeScope = scope;
  setScope._applied = true;
  try { localStorage.setItem('thai_scope', scope); } catch (e) {}
  buildScopeTabs();
  // Lesson tabs only exist inside the Lecciones scope.
  $('lessonTabs').style.display = (scope === 'lecciones') ? '' : 'none';

  if (scope === 'top1000') {
    if (activeLesson === 'cthai') activeLesson = 'all';
    setMode('top1000');
    return;
  }

  if (scope === 'comprehensive') {
    activeLesson = 'cthai';
    // Reset type/category filters so conversations (cthai) aren't blocked.
    activeType = 'all';
    activeCategory = 'all';
    searchQuery = '';
    var si = $('searchInput'); if (si) si.value = '';
    // Snap to an allowed mode if the current one isn't available here.
    if (currentMode !== 'cards' && currentMode !== 'dashboard' && currentMode !== 'srs') {
      currentMode = 'dashboard';
    }
    buildModeTabs();
    // Rebuild the deck with the cthai filter before rendering, otherwise
    // showCard/renderDashboard would reuse a stale deck from the previous scope.
    rebuild();
    setMode(currentMode);
    return;
  }

  // Lecciones
  if (activeLesson === 'cthai') activeLesson = 'all';
  if (currentMode === 'top1000') currentMode = 'cards';
  buildLessonTabs();
  buildModeTabs();
  rebuild();
  setMode(currentMode);
}

function buildModeTabs() {
  // Filter modes by active scope so each section only offers relevant tools.
  var allowed;
  if (activeScope === 'top1000') {
    allowed = { top1000: true, cards: true, dashboard: true, srs: true };
  } else if (activeScope === 'comprehensive') {
    allowed = { cards: true, dashboard: true, srs: true };
  } else {
    allowed = null; // lecciones → all modes
  }
  var visible = allowed
    ? MODES.filter(function (m) { return allowed[m.key]; })
    : MODES;
  // If current mode is not allowed in this scope, snap to a valid one.
  if (!visible.some(function (m) { return m.key === currentMode; })) {
    var fallback = visible[0];
    if (fallback) currentMode = fallback.key;
  }
  $('modeTabs').innerHTML = visible.map(function (m) {
    var active = currentMode === m.key ? ' active' : '';
    return '<button class="mode-tab ' + m.cls + active + '" onclick="setMode(\'' + m.key + '\')">' +
      '<span class="mt-icon">' + m.icon + '</span>' + m.label + '</button>';
  }).join('');
}

function setMode(mode) {
  // Stop any active playback first
  if (running) stopPlayAll();
  if (matrixRunning) stopMatrixPractice();
  if (typeof shPlaying !== 'undefined' && shPlaying) stopShPlay();
  if (filterPanelOpen) toggleFilterPanel();

  // Leaving Top 1000 (where SRS may be mounted inline) → restore normal host styling.
  // Also drops any in-flight inline SRS session UI so it doesn't leak across modes.
  if (currentMode === 'top1000' && mode !== 'top1000' && typeof unmountSrsInline === 'function') {
    unmountSrsInline();
    if (typeof srsCurrent !== 'undefined') srsCurrent = null;
  }

  // Update state
  currentMode = mode;
  dashboardMode = (mode === 'dashboard');
  shadowingMode = (mode === 'shadowing');
  matrixMode = (mode === 'matrix');
  tonesMode = (mode === 'tones');
  questionsMode = (mode === 'questions');
  document.body.classList.toggle('mode-cards', mode === 'cards');

  // Sections visibility
  $('cardArea').style.display = (mode === 'cards') ? 'flex' : 'none';
  $('dashboardGrid').style.display = (mode === 'dashboard') ? 'grid' : 'none';
  $('questionsView').style.display = (mode === 'questions') ? 'flex' : 'none';
  $('shadowingView').style.display = (mode === 'shadowing') ? 'flex' : 'none';
  $('matrixView').style.display = (mode === 'matrix') ? 'flex' : 'none';
  $('tonesView').style.display = (mode === 'tones') ? 'flex' : 'none';
  $('top1000View').style.display = (mode === 'top1000') ? 'flex' : 'none';
  $('alphabetView').style.display = (mode === 'alphabet') ? 'flex' : 'none';
  $('srsView').style.display = (mode === 'srs') ? 'flex' : 'none';

  // Filters + search only relevant in cards/dashboard
  var showFilters = (mode === 'cards' || mode === 'dashboard');
  $('filterBar').style.display = showFilters ? '' : 'none';
  $('searchBar').style.display = showFilters ? '' : 'none';
  $('audioBar').style.display = showFilters ? '' : 'none';
  // Lesson tabs only exist inside the Lecciones scope.
  $('lessonTabs').style.display = (activeScope === 'lecciones') ? '' : 'none';

  buildModeTabs();

  if (mode === 'dashboard') {
    $('progress').textContent = deck.length + ' cards';
    renderDashboard();
  } else if (mode === 'questions') {
    $('progress').textContent = 'Questions';
    renderQuestions();
  } else if (mode === 'shadowing') {
    $('progress').textContent = 'Shadowing';
    renderShadowingList();
  } else if (mode === 'matrix') {
    $('progress').textContent = 'Janus Matrix';
    resetMatrixTheme();
    renderMatrix();
  } else if (mode === 'tones') {
    $('progress').textContent = 'Tones';
    renderTonesView();
  } else if (mode === 'top1000') {
    $('progress').textContent =
      (typeof TOP1000_WORDS !== 'undefined' ? TOP1000_WORDS.length : 0) + ' words · ' +
      (typeof TOP1000_STRUCTURES !== 'undefined' ? TOP1000_STRUCTURES.length : 0) + ' struct · ' +
      (typeof TOP1000_PHRASES !== 'undefined' ? TOP1000_PHRASES.length : 0) + ' phrases';
    if (typeof renderTop1000 === 'function') renderTop1000();
  } else if (mode === 'alphabet') {
    $('progress').textContent = 'Alfabeto tailandés';
    if (typeof renderAlphabetView === 'function') renderAlphabetView();
  } else if (mode === 'srs') {
    var s = (typeof loadSrsStats === 'function') ? loadSrsStats() : null;
    $('progress').textContent = s ? ('SRS · ' + (s.reviewed||0) + ' hoy') : 'SRS';
    if (typeof renderSrsView === 'function') renderSrsView();
  } else {
    $('progress').textContent = deck.length + ' cards';
    showCard();
  }
}

// --- cthai mode: per-card play counts (kept for legacy playConvAudio handler) ---
// cthai* rendering, grouping, frequency-rank, and threshold logic moved to
// src/core/modes/cards (cards module) and src/core/modes/dashboard. The cards
// bridge installs w.cthaiCardId / w.cthaiPlaysOf / w.cthaiCardDone /
// w.cthaiCountPlays / w.cthaiCardFreqRank / w.CTHAI_THRESHOLD, so legacy
// bare-identifier callers resolve to the typed implementations.
//
// playConvAudio (emitted as onclick by dashboard/module.ts) still writes
// play counts to localStorage via these legacy vars — kept here until that
// handler is migrated too.
// cthai play-count state (was CTHAI_PLAY_KEY, cthaiPlays, loadCthaiPlays,
// saveCthaiPlays) now owned by src/core/persistence/stores.ts:cthaiPlaysStore
// and surfaced via src/core/modes/cards bridge as w.bumpCthaiPlay /
// w.cthaiCountPlays. playConvAudio itself is ported to the typed dashboard
// module and exposed as w.playConvAudio.

// (Legacy renderDashPair, dashCardClick, clearDashboardHighlights, dashPlayAll,
// dashRepeat removed — all overridden by src/core/modes/dashboard bridge.)

// --- Matrix Mode (extracted to src/core/modes/matrix; legacy globals wired from main.ts) ---
// Legacy matrix code (was L1404-1648) removed during Spike 5f.
// Bridge overrides window.* so legacy callers (setMode, keydown, inline onclick)
// resolve to the typed module implementation.
void 0; // placeholder anchor
// --- Shadowing Mode (extracted to src/core/modes/shadowing; legacy globals wired from main.ts) ---
// Legacy shadowing code (was L1409-1694) removed during Spike 5g cleanup.
// Bridge overrides window.* so legacy callers (setMode, inline onclick)
// resolve to the typed module implementation.

// --- Tones Mode (extracted to src/core/modes/tones; legacy globals wired from main.ts) ---
// Legacy tones code (was L1414-1610) removed during Spike 5 cleanup.
// Bridge overrides window.* so legacy callers (setMode, inline onclick,
// keyboard handler tonesPlayAllWords) resolve to the typed module implementation.

// --- Init ---
// Phase 2: data is fetched asynchronously by src/core/data/loader.ts and
// installed on window.DATA AFTER this classic script finishes parsing.
// Reading DATA.words here synchronously would throw ReferenceError. Wait
// for 'thai-data-ready' (dispatched by main.ts after loadAllData resolves)
// before building UI that reads DATA.
window.addEventListener('thai-data-ready', function() {
  try {
    buildLessonTabs();
    buildScopeTabs();
    buildModeTabs();
    buildFilterChips();
    deck = buildDeck();
    if (activeLesson === 'dificiles') deck = deck.filter(function(it) { return difficult.has(cardKey(it)); });
    $('progress').textContent = deck.length + ' cards';
    showCard();
    updatePlayBtn();
    // Apply initial scope (restore last-used section; defaults to 'lecciones').
    if (activeScope === 'top1000') {
      setScope('top1000');
    } else if (activeScope === 'comprehensive') {
      setScope('comprehensive');
    }
  } catch (e) {
    console.error('[app] init failed:', e);
  }
});
