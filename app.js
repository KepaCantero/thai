var deck = [], idx = 0;
var activeLesson = 'all', activeCategory = 'all', activeType = 'all', searchQuery = '';
var known = new Set(), unknown = new Set();
var difficult = new Set();
try {
  JSON.parse(localStorage.getItem('thai_difficult') || '[]').forEach(function(k) { if (k) difficult.add(k); });
} catch (e) {}
var dashboardMode = false, shadowingMode = false, matrixMode = false, tonesMode = false, questionsMode = false;
var currentMode = 'cards';
var activeToneSel = null; // selected tone in Tones mode view (null = all)
var filterPanelOpen = false;

var PLAY_REPS = 4, REPEAT_GAP = 2000, CARD_GAP = 3000;
var running = false, paused = false, playTimeout = null, playResumeFn = null;

// --- Get all categories ---
function getCategories() {
  var cats = [], seen = {};
  DATA.words.forEach(function(w) { if (!seen[w.category]) { seen[w.category] = true; cats.push(w.category); } });
  DATA.phrases.forEach(function(p) { if (!seen[p.category]) { seen[p.category] = true; cats.push(p.category); } });
  if (DATA.conversations) {
    DATA.conversations.forEach(function(c) { if (!seen[c.category]) { seen[c.category] = true; cats.push(c.category); } });
  }
  return cats;
}

// --- Lesson tabs (row 1) ---
function buildLessonTabs() {
  var allLessons = [], seen = {};
  DATA.words.forEach(function(w) { var l = w.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  DATA.phrases.forEach(function(p) { var l = p.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  if (DATA.conversations) {
    DATA.conversations.forEach(function(c) { var l = c.lesson || 1; if (!seen[l]) { seen[l] = true; allLessons.push(l); } });
  }
  allLessons.sort(function(a, b) { return a - b; });

  var tabs = [{ key: 'all', label: 'All' }];
  allLessons.forEach(function(l) { tabs.push({ key: String(l), label: 'Lesson ' + l }); });
  tabs.push({ key: 'youtube', label: 'YouTube' });
  tabs.push({ key: 'dificiles', label: '★ Difíciles (' + difficult.size + ')' });

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
  var lessonNum = (activeLesson === 'all' || youtubeOnly || dificilesOnly) ? null : parseInt(activeLesson);
  var isTone = activeCategory.startsWith('tone:');
  var isPares = activeCategory === 'pares';
  var isPractica = activeCategory === 'practica';
  var cat = (isTone || isPares || isPractica) ? null : activeCategory;
  var tone = isTone ? activeCategory.slice(5) : null;
  var type = activeType;

  function matchLesson(item) {
    if (youtubeOnly) return item.category === 'youtube';
    if (dificilesOnly) return true; // membership filter applied at call sites
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
    DATA.conversations.filter(function(c) {
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
  (DATA.conversations || []).forEach(function(c) {
    if ((c.lesson || 1) > maxL) return;
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


function flipCard() { $('card').classList.toggle('flipped'); if (!running) playAudio(); }

// Attach click handler (not inline onclick, more reliable during Play All)
document.addEventListener('DOMContentLoaded', function() {
  var cc = $('cardContainer');
  if (cc) cc.addEventListener('click', function(e) { flipCard(); });
  var ttsSel = $('ttsSelect');
  if (ttsSel && typeof AUDIO_ENGINE !== 'undefined') ttsSel.value = AUDIO_ENGINE;
  document.body.classList.toggle('mode-cards', currentMode === 'cards');
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
  var key = deck[idx].thai || deck[idx].q_thai || (deck[idx].w1 && deck[idx].w1.thai);
  if (knew) { known.add(key); unknown.delete(key); }
  else { unknown.add(key); known.delete(key); }
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
  { key: 'srs',        icon: '&#9851;&#65039;', label: 'Estudiar', cls: 'srs' }
];

function buildModeTabs() {
  $('modeTabs').innerHTML = MODES.map(function(m) {
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
  $('srsView').style.display = (mode === 'srs') ? 'flex' : 'none';

  // Filters + search only relevant in cards/dashboard
  var showFilters = (mode === 'cards' || mode === 'dashboard');
  $('filterBar').style.display = showFilters ? '' : 'none';
  $('searchBar').style.display = showFilters ? '' : 'none';
  $('audioBar').style.display = showFilters ? '' : 'none';
  // Lesson tabs always visible (scope is global)
  $('lessonTabs').style.display = '';

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
  } else if (mode === 'srs') {
    var s = (typeof loadSrsStats === 'function') ? loadSrsStats() : null;
    $('progress').textContent = s ? ('SRS · ' + (s.reviewed||0) + ' hoy') : 'SRS';
    if (typeof renderSrsView === 'function') renderSrsView();
  } else {
    $('progress').textContent = deck.length + ' cards';
    showCard();
  }
}

function renderDashboard() {
  var grid = $('dashboardGrid');
  deck = buildDeck();
  if (activeLesson === 'dificiles') deck = deck.filter(function(it) { return difficult.has(cardKey(it)); });
  if (!deck.length) {
    grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No cards for this filter</p>';
    return;
  }
  grid.innerHTML = deck.map(function(item, i) {
    if (item.type === 'conversation') {
      return renderDashConversation(item, i);
    }
    if (item.type === 'pair') {
      return renderDashPair(item, i);
    }
    return renderDashWordPhrase(item, i);
  }).join('');
}

function renderDashWordPhrase(item, i) {
  var toneHtml = renderTone(item.tone, item.highlightTone);
  var img = item.image ? '<img src="' + item.image + '" alt="" loading="lazy">' : '';
  var tnNote = item.toneNote ? '<div class="dc-tone" style="color:#888;font-size:0.58rem">' + item.toneNote + '</div>' : '';
  return '<div class="dash-card" data-idx="' + i + '" onclick="dashCardClick(this, ' + i + ')">' +
    diffBtnHtml(item, i) +
    '<div class="dc-play-icon">▶</div>' +
    '<div class="dc-type-badge">' + (item.type === 'phrase' ? 'F' : 'W') + '</div>' +
    '<div class="dc-front">' + img +
      '<div class="dc-thai">' + item.thai + '</div>' +
      '<div class="dc-phonetic">' + item.phonetic + '</div>' +
      (item.es ? '<div class="dc-es">ES: ' + item.es + '</div>' : '') +
      (toneHtml ? '<div class="dc-tone">' + toneHtml + '</div>' : '') +
      tnNote +
    '</div>' +
    '<div class="dc-back">' + img +
      '<div class="dc-translation">' + getEn(item) + '</div>' +
      (item.type === 'phrase' ? '<div class="dc-wb">' + renderWB(item.thai) + '</div>' : '') +
    '</div>' +
  '</div>';
}

function renderDashConversation(item, i) {
  var qTone = renderTone(item.q_tone, item.highlightTone);
  var aTone = renderTone(item.a_tone, item.highlightTone);
  var convEn = CONV_EN[item.q_thai] || {};
  return '<div class="dash-card dash-conv" data-idx="' + i + '" onclick="dashCardClick(this, ' + i + ')">' +
    diffBtnHtml(item, i) +
    '<div class="dc-play-icon">▶</div>' +
    '<div class="dc-type-badge conv">C</div>' +
    '<div class="dc-front">' +
      '<div class="dc-qa-label">Q</div>' +
      '<div class="dc-thai">' + item.q_thai + '</div>' +
      '<div class="dc-phonetic">' + item.q_phonetic + '</div>' +
      (qTone ? '<div class="dc-tone">' + qTone + '</div>' : '') +
    '</div>' +
    '<div class="dc-back">' +
      '<div class="dc-qa-label">Q</div>' +
      '<div class="dc-thai">' + item.q_thai + '</div>' +
      '<div class="dc-phonetic">' + item.q_phonetic + '</div>' +
      '<div class="dc-translation">' + (convEn.q || item.q_spanish) + '</div>' +
      '<div class="dc-wb">' + renderWB(item.q_thai) + '</div>' +
      '<div class="dc-sep"></div>' +
      '<div class="dc-qa-label">A</div>' +
      '<div class="dc-thai">' + item.a_thai + '</div>' +
      '<div class="dc-phonetic">' + item.a_phonetic + '</div>' +
      (aTone ? '<div class="dc-tone">' + aTone + '</div>' : '') +
      '<div class="dc-translation">' + (convEn.a || item.a_spanish) + '</div>' +
      '<div class="dc-wb">' + renderWB(item.a_thai) + '</div>' +
    '</div>' +
  '</div>';
}

function renderDashPair(item, i) {
  var w1 = item.w1, w2 = item.w2;
  var t1 = renderTone(w1.tone), t2 = renderTone(w2.tone);
  return '<div class="dash-card dash-pair" data-idx="' + i + '" onclick="dashCardClick(this, ' + i + ')">' +
    diffBtnHtml(item, i) +
    '<div class="dc-play-icon">▶▶</div>' +
    '<div class="dc-type-badge" style="color:#ff6bff;background:#ff6bff22">P</div>' +
    '<div class="dc-front">' +
      '<div class="dc-pair-row">' +
        '<div class="dc-pair-col">' +
          '<div class="dc-thai">' + w1.thai + '</div>' +
          '<div class="dc-phonetic">' + w1.phonetic + '</div>' +
          (t1 ? '<div class="dc-tone">' + t1 + '</div>' : '') +
        '</div>' +
        '<div class="dc-pair-vs">vs</div>' +
        '<div class="dc-pair-col">' +
          '<div class="dc-thai">' + w2.thai + '</div>' +
          '<div class="dc-phonetic">' + w2.phonetic + '</div>' +
          (t2 ? '<div class="dc-tone">' + t2 + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="dc-back">' +
      '<div class="dc-pair-row">' +
        '<div class="dc-pair-col">' +
          '<div class="dc-thai">' + w1.thai + '</div>' +
          '<div class="dc-translation">' + (THAI_EN[w1.thai] || w1.spanish) + '</div>' +
        '</div>' +
        '<div class="dc-pair-vs">vs</div>' +
        '<div class="dc-pair-col">' +
          '<div class="dc-thai">' + w2.thai + '</div>' +
          '<div class="dc-translation">' + (THAI_EN[w2.thai] || w2.spanish) + '</div>' +
        '</div>' +
      '</div>' +
      (item.note ? '<div class="dc-pair-note">' + item.note + '</div>' : '') +
    '</div>' +
  '</div>';
}

var Q_TOPIC_LABELS = {
  pronombres: 'Pronombres', saludos: 'Saludos', verbos: 'Verbos',
  sabores: 'Sabores', comida: 'Comida', números: 'Números',
  preguntas: 'Preguntas', tiendas: 'Tiendas', sustantivos: 'Sustantivos',
  tiempo: 'Tiempo', días: 'Días'
};

var Q_TENSE_LABELS = {
  presente: 'Presente', futuro: 'Futuro', querer: 'Querer',
  gustar: 'Gustar', negación: 'Negación', pasado: 'Pasado',
  progresivo: 'Progresivo',
  'pregunta sí/no': 'Pregunta Sí/No',
  'pregunta dónde': 'Pregunta ¿Dónde?',
  'pregunta qué': 'Pregunta ¿Qué?',
  'pregunta cuánto': 'Pregunta ¿Cuánto?'
};

var qDeck = [];
var qFlipped = {}; // track flip state per index across re-renders

function renderQuestions() {
  var grid = $('questionsGrid');
  qDeck = buildQuestionsDeck();
  qFlipped = {};
  if (!qDeck.length) {
    grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No hay preguntas para esta lección</p>';
    $('progress').textContent = '0 Q&A';
    return;
  }
  // Sort: by topic, then tense — so related practice clusters together.
  qDeck.sort(function(a, b) {
    var ta = (a.topic || '') + '|' + (a.tense || '');
    var tb = (b.topic || '') + '|' + (b.tense || '');
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });
  $('progress').textContent = qDeck.length + ' Q&A';
  grid.innerHTML = qDeck.map(renderQCard).join('');
}

function renderQCard(item, i) {
  var topicTxt = Q_TOPIC_LABELS[item.topic] || item.topic || '';
  var tenseTxt = Q_TENSE_LABELS[item.tense] || item.tense || '';
  var srcTxt = item.source || '';

  // Front side: Q on top, A on bottom (English/Spanish).
  var frontQtxt = item.q_spanish || item.q_en || '';
  var frontAtxt = (item.a_spanish && item.a_spanish !== frontQtxt)
    ? (item.a_spanish || item.a_en || '')
    : '';
  var frontHtml =
    '<div class="qc-block">' +
      '<div class="qc-qa-label">Pregunta</div>' +
      (frontQtxt ? '<div class="qc-prompt">' + frontQtxt + '</div>' : '<div class="qc-empty">(voltea para ver)</div>') +
    '</div>' +
    (frontAtxt ? '<div class="qc-sep"></div>' +
      '<div class="qc-block">' +
        '<div class="qc-qa-label">Respuesta</div>' +
        '<div class="qc-prompt">' + frontAtxt + '</div>' +
      '</div>' : '');

  // Back side: Q on top, A on bottom (Thai + phonetic + ES phonetic).
  function thaiBlock(label, thai, phonetic, es) {
    if (!thai) return '<div class="qc-block">' +
      '<div class="qc-qa-label">' + label + '</div>' +
      '<div class="qc-empty">—</div></div>';
    return '<div class="qc-block">' +
      '<div class="qc-qa-label">' + label + '</div>' +
      '<div class="qc-thai">' + thai + '</div>' +
      (phonetic ? '<div class="qc-phonetic">' + phonetic + '</div>' : '') +
      (es ? '<div class="qc-es">ES: ' + es + '</div>' : '') +
    '</div>';
  }
  var backHtml = thaiBlock('Pregunta', item.q_thai, item.q_phonetic, item.q_es) +
    (item.q_thai && typeof renderWB === 'function' ? '<div class="qc-wb">' + renderWB(item.q_thai) + '</div>' : '') +
    (item.a_thai ? '<div class="qc-sep"></div>' + thaiBlock('Respuesta', item.a_thai, item.a_phonetic, item.a_es) : '') +
    (item.a_thai && typeof renderWB === 'function' ? '<div class="qc-wb">' + renderWB(item.a_thai) + '</div>' : '');

  return '<div class="q-card' + (qFlipped[i] ? ' flipped' : '') + '" data-idx="' + i + '" onclick="qCardClick(this, ' + i + ')">' +
    '<div class="qc-play-icon">▶</div>' +
    '<div class="qc-badges">' +
      (topicTxt ? '<span class="qc-topic">' + topicTxt + '</span>' : '') +
      (tenseTxt ? '<span class="qc-tense">' + tenseTxt + '</span>' : '') +
      (srcTxt ? '<span class="qc-src">' + srcTxt + '</span>' : '') +
    '</div>' +
    '<div class="qc-front">' + frontHtml + '</div>' +
    '<div class="qc-back">' + backHtml + '</div>' +
  '</div>';
}

function qCardClick(el, i) {
  el.classList.toggle('flipped');
  qFlipped[i] = el.classList.contains('flipped');
  if (typeof stopCurrentAudio === 'function') stopCurrentAudio();
  var item = qDeck[i];
  if (!item || typeof speakText !== 'function') return;
  // Speak the Thai question first (if present), then the Thai answer.
  var qThai = item.q_thai || '';
  var aThai = item.a_thai || '';
  if (qThai && aThai) {
    speakText(qThai, function() { speakText(aThai); });
  } else if (aThai) {
    speakText(aThai);
  } else if (qThai) {
    speakText(qThai);
  }
}

function dashCardClick(el, i) {
  if (running) {
    stopPlayAll();
    el.classList.remove('flipped');
    startPlayAll(i);
    return;
  }
  el.classList.toggle('flipped');
  stopCurrentAudio();
  speakText(getAudioText(deck[i]));
}

function clearDashboardHighlights() {
  document.querySelectorAll('.dash-card').forEach(function(c) { c.classList.remove('playing', 'played'); });
}

function dashPlayAll(cardIdx) {
  if (!running || cardIdx >= deck.length) { stopPlayAll(); return; }
  var cards = document.querySelectorAll('.dash-card');
  cards.forEach(function(c) { c.classList.remove('playing'); });
  if (cards[cardIdx]) {
    cards[cardIdx].classList.add('playing');
    cards[cardIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (cardIdx > 0 && cards[cardIdx - 1]) cards[cardIdx - 1].classList.add('played');
  $('playAllProgress').textContent = (cardIdx + 1) + ' / ' + deck.length;
  $('playAllIndicator').textContent = 'playing...';
  dashRepeat(cardIdx, 1);
}

function dashRepeat(cardIdx, rep) {
  if (!running) return;
  if (rep > PLAY_REPS) {
    $('playAllIndicator').textContent = 'next...';
    playResumeFn = function() { dashPlayAll(cardIdx + 1); };
    playTimeout = setTimeout(playResumeFn, CARD_GAP);
    return;
  }
  $('playAllIndicator').textContent = 'rep ' + rep + '/' + PLAY_REPS;
  playAudioItem(deck[cardIdx], function() {
    if (!running || paused) return;
    playResumeFn = function() { dashRepeat(cardIdx, rep + 1); };
    playTimeout = setTimeout(playResumeFn, REPEAT_GAP);
  });
}

// --- Matrix Mode ---
var matrixTheme = 0;

var matrixSel = { subjects: 0, motives: 0, actions: 0, objects: 0 };
var matrixRunning = false, matrixPlayIdx = 0, matrixPlayTimeout = null;

var MC = [
  { key: 'subjects', label: 'Who', cls: 'mc-subj' },
  { key: 'motives', label: 'Intent', cls: 'mc-mot' },
  { key: 'actions', label: 'Action', cls: 'mc-act' },
  { key: 'objects', label: 'What', cls: 'mc-obj' }
];

function getJanus() { return DATA.janus[matrixTheme]; }

function getMC() {
  return MC;
}

function getColData(key) {
  var J = getJanus();
  return J[key];
}



function getFilteredJanus() {
  var lessonNum = (activeLesson === 'all' || activeLesson === 'youtube') ? null : parseInt(activeLesson);
  if (!lessonNum) return DATA.janus;
  return DATA.janus.filter(function(t) { return !t.lesson || t.lesson === lessonNum; });
}

function resetMatrixTheme() {
  var filtered = getFilteredJanus();
  matrixTheme = filtered.length ? DATA.janus.indexOf(filtered[0]) : 0;
  getMC().forEach(function(col) { matrixSel[col.key] = 0; });
}

function setMatrixTheme(i) {
  matrixTheme = i;
  getMC().forEach(function(col) { matrixSel[col.key] = 0; });
  renderMatrix();
}



function renderMatrix() {
  var filtered = getFilteredJanus();
  if (!filtered.length) { $('matrixGrid').innerHTML = '<div style="color:#888;padding:40px">No themes for this lesson</div>'; updateMatrixResult(); return; }
  var J = DATA.janus[matrixTheme];
  if (!J || (activeLesson !== 'all' && J.lesson !== parseInt(activeLesson))) { resetMatrixTheme(); J = DATA.janus[matrixTheme]; }
  var cols = getMC();
  var grid = $('matrixGrid');
  var html = '<div class="matrix-themes" id="matrixThemes">';
  filtered.forEach(function(t) {
    var i = DATA.janus.indexOf(t);
    html += '<button class="mt-btn' + (i === matrixTheme ? ' active' : '') + '" onclick="setMatrixTheme(' + i + ')">' + t.icon + ' ' + t.theme + '</button>';
  });
  html += '</div>';
  html += '<div class="matrix-grid-inner">';
  cols.forEach(function(col, ci) {
    var items = getColData(col.key);
    if (!items || !items.length) return;
    html += '<div class="matrix-col">';
    html += '<div class="matrix-col-head ' + col.cls + '">' + col.label + '</div>';
    items.forEach(function(item, ii) {
      var sel = matrixSel[col.key] === ii ? ' selected ' + col.cls : '';
      html += '<div class="matrix-cell' + sel + '" onclick="matrixCellTap(\'' + col.key + '\',' + ii + ')">';
      html += '<div class="mc-thai">' + item.thai + '</div>';
      html += '<div class="mc-ph">' + item.phonetic + '</div>';
      html += '<div class="mc-en">' + item.en + '</div>';
      html += '</div>';
    });
    html += '</div>';
    if (ci < cols.length - 1) html += '<div class="matrix-flow-arrow" style="display:flex;align-items:center;color:#444;font-size:1.2rem;padding:0 2px">→</div>';
  });
  html += '</div>';
  grid.innerHTML = html;
  updateMatrixResult();
}

function matrixCellTap(colKey, idx) {
  matrixSel[colKey] = idx;
  renderMatrix();
  speakMatrixSelection();
}

function speakMatrixSelection() {
  var cols = getMC();
  var parts = cols.map(function(col) { return getColData(col.key)[matrixSel[col.key]]; }).filter(function(p){return p && p.thai;});
  if (!parts.length) return;
  stopCurrentAudio();
  // Play each part sequentially so static audio lookups succeed per-word
  function playNext(i) {
    if (i >= parts.length) return;
    speakText(parts[i].thai, function() { playNext(i + 1); });
  }
  playNext(0);
}

function buildMatrixSentence(sel) {
  var cols = getMC();
  var parts = cols.map(function(col) { return getColData(col.key)[sel[col.key]]; });
  return {
    thai: parts.map(function(p) { return p.thai; }).join(''),
    phonetic: parts.map(function(p) { return p.phonetic; }).join(' '),
    es: parts.map(function(p) { return p.es; }).join(' '),
    en: parts.map(function(p) { return p.en; }).join(' ')
  };
}

function buildMatrixConversation(sel) {
  var J = getJanus();
  var sub = J.subjects[sel.subjects];
  var mot = J.motives[sel.motives];
  var act = J.actions[sel.actions];
  var obj = J.objects[sel.objects];
  var qSub = J.subjects[Math.min(2, J.subjects.length - 1)];
  var qThai = qSub.thai + mot.thai + act.thai + obj.thai + 'ไหม';
  var qPh = qSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + obj.phonetic + ' mai';
  var qEn = qSub.en + ' ' + mot.en + ' ' + act.en + ' ' + obj.en + '?';
  var aSub = (sel.subjects === 2) ? J.subjects[1] : sub;
  var aThai = 'ใช่ ' + aSub.thai + mot.thai + act.thai + obj.thai + 'ครับ';
  var aPh = 'chai ' + aSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + obj.phonetic + ' krap';
  var aEn = 'Yes, ' + aSub.en + ' ' + mot.en + ' ' + act.en + ' ' + obj.en;
  var altObjIdx = (sel.objects + 1) % J.objects.length;
  var altObj = J.objects[altObjIdx];
  var nThai = 'ไม่ ' + aSub.thai + mot.thai + act.thai + altObj.thai;
  var nPh = 'mai ' + aSub.phonetic + ' ' + mot.phonetic + ' ' + act.phonetic + ' ' + altObj.phonetic;
  var nEn = 'No, ' + aSub.en + ' ' + mot.en + ' ' + act.en + ' ' + altObj.en;
  return {
    q: { thai: qThai, phonetic: qPh, es: qPh, en: qEn },
    a: { thai: aThai, phonetic: aPh, es: aPh, en: aEn },
    n: { thai: nThai, phonetic: nPh, es: nPh, en: nEn }
  };
}

function updateMatrixResult() {
  var cols = getMC();
  var result = $('matrixResult');
  var sent = buildMatrixSentence(matrixSel);
  var conv = buildMatrixConversation(matrixSel);
  var parts = cols.map(function(col) { return getColData(col.key)[matrixSel[col.key]]; });
  var chipsHtml = parts.map(function(p, i) {
    var cls = cols[i].cls;
    var arrow = i < parts.length - 1 ? '<span class="matrix-chip-arrow">→</span>' : '';
    return '<span class="matrix-chip mc-c-' + cls.replace('mc-', '') + '"><span class="mch-thai">' + p.thai + '</span><span class="mch-en">' + p.en + '</span></span>' + arrow;
  }).join('');
  var html = '<div class="matrix-sentence">' +
    '<div class="ms-thai">' + sent.thai + '</div>' +
    '<div class="ms-ph">' + sent.phonetic + '</div>' +
    '<div class="ms-en">' + sent.en + '</div>' +
    '<div class="matrix-chips">' + chipsHtml + '</div></div>';
  html += '<div class="matrix-conv">' +
    '<div><span class="mconv-label mconv-q">Q</span></div>' +
    '<div class="mconv-thai">' + conv.q.thai + '</div><div class="mconv-ph">' + conv.q.phonetic + '</div><div class="mconv-en">' + conv.q.en + '</div>' +
    '<div class="mconv-sep"></div>' +
    '<div><span class="mconv-label mconv-a">A+</span></div>' +
    '<div class="mconv-thai">' + conv.a.thai + '</div><div class="mconv-ph">' + conv.a.phonetic + '</div><div class="mconv-en">' + conv.a.en + '</div>' +
    '<div class="mconv-sep"></div>' +
    '<div><span class="mconv-label mconv-a" style="background:#ff6b6b22;color:#ff6b6b">A-</span></div>' +
    '<div class="mconv-thai">' + conv.n.thai + '</div><div class="mconv-ph">' + conv.n.phonetic + '</div><div class="mconv-en">' + conv.n.en + '</div></div>';
  html += '<div class="matrix-controls">' +
    '<button class="mc-nav" onclick="matrixNav(-1)">←</button>' +
    '<button class="mc-random" onclick="randomMatrix()">Shuffle</button>' +
    '<button class="mc-play" onclick="playMatrixConv()">▶ Conv</button>' +
    '<button class="mc-practice" onclick="toggleMatrixPractice()">' + (matrixRunning ? '■ Stop' : '▶▶ Practice') + '</button>' +
    '<button class="mc-nav" onclick="matrixNav(1)">→</button></div>';
  result.innerHTML = html;
}

function matrixNav(dir) {
  var cols = getMC(), total = 1;
  cols.forEach(function(col) { var d = getColData(col.key); if (d && d.length) total *= d.length; });
  var flat = matrixSelToFlat();
  flat = (flat + dir + total) % total;
  flatToMatrixSel(flat);
  renderMatrix();
  speakMatrixSelection();
}

function randomMatrix() {
  var cols = getMC();
  cols.forEach(function(col) { var d = getColData(col.key); if (d && d.length) matrixSel[col.key] = Math.floor(Math.random() * d.length); });
  renderMatrix();
  speakMatrixSelection();
}

function matrixSelToFlat() {
  var cols = getMC(), flat = 0, mult = 1;
  cols.forEach(function(col) { var d = getColData(col.key); if (d && d.length) { flat += matrixSel[col.key] * mult; mult *= d.length; } });
  return flat;
}

function flatToMatrixSel(flat) {
  var cols = getMC();
  cols.forEach(function(col) { var d = getColData(col.key); if (d && d.length) { var len = d.length; matrixSel[col.key] = flat % len; flat = Math.floor(flat / len); } });
}

function playMatrixConv() {
  var conv = buildMatrixConversation(matrixSel);
  stopCurrentAudio();
  speakText(conv.q.thai, function() { setTimeout(function() { speakText(conv.a.thai); }, 1500); });
}

function toggleMatrixPractice() { if (matrixRunning) stopMatrixPractice(); else startMatrixPractice(); }

function startMatrixPractice() {
  matrixRunning = true;
  var btn = document.querySelector('.mc-practice');
  if (btn) btn.textContent = '■ Stop';
  matrixPracticeNext();
}

function stopMatrixPractice() {
  matrixRunning = false;
  clearTimeout(matrixPlayTimeout);
  stopCurrentAudio();
  var btn = document.querySelector('.mc-practice');
  if (btn) btn.textContent = '▶▶ Practice';
}

function matrixPracticeNext() {
  if (!matrixRunning) return;
  matrixTheme = Math.floor(Math.random() * DATA.janus.length);
  var cols = getMC();
  cols.forEach(function(col) { var d = getColData(col.key); if (d && d.length) matrixSel[col.key] = Math.floor(Math.random() * d.length); });
  renderMatrix();
  var sent = buildMatrixSentence(matrixSel);
  speakText(sent.thai, function() {
    if (!matrixRunning) return;
    var conv = buildMatrixConversation(matrixSel);
    matrixPlayTimeout = setTimeout(function() {
      speakText(conv.q.thai, function() {
        if (!matrixRunning) return;
        matrixPlayTimeout = setTimeout(function() {
          speakText(conv.a.thai, function() {
            if (!matrixRunning) return;
            matrixPlayTimeout = setTimeout(matrixPracticeNext, 2000);
          });
        }, 1200);
      });
    }, 1000);
  });
}

// --- Shadowing Mode ---
var shConvId = null;
var shLineIdx = -1;
var shPlaying = false;
var shTimeout = null;
var shSpeed = 1;

function toggleShadowing() { setMode(shadowingMode ? 'cards' : 'shadowing'); }
function toggleMatrix() { setMode(matrixMode ? 'cards' : 'matrix'); }
function toggleDashboard() { setMode(dashboardMode ? 'cards' : 'dashboard'); }

function exitShadowingMode() {
  shadowingMode = false;
  stopShPlay();
  $('modeShadow').classList.remove('active');
  $('shadowingView').style.display = 'none';
}

function renderShadowingList() {
  var lessonNum = activeLesson === 'all' ? null : parseInt(activeLesson);
  var convs = SHADOWING.filter(function(c) { return !lessonNum || c.lesson === lessonNum; });
  var html = '';
  convs.forEach(function(c) {
    html += '<div class="sh-card" onclick="openShadowing(\'' + c.id + '\')">';
    html += '<div class="sh-card-lesson">Lesson ' + c.lesson + '</div>';
    html += '<div class="sh-card-title">' + c.title + '</div>';
    html += '<div class="sh-card-title-th">' + c.titleTh + '</div>';
    html += '<div class="sh-card-desc">' + c.description + '</div>';
    html += '<div class="sh-card-meta">' + c.lines.length + ' lines</div>';
    html += '</div>';
  });
  if (!convs.length) html = '<div class="sh-empty">No conversations for this lesson</div>';
  $('shList').innerHTML = html;
  $('shList').style.display = '';
  $('shPlayer').style.display = 'none';
}

function openShadowing(id) {
  shConvId = id; shLineIdx = -1; stopShPlay();
  $('shList').style.display = 'none';
  $('shPlayer').style.display = 'flex';
  renderShadowingPlayer();
}

function exitShadowingPlayer() {
  stopShPlay(); shConvId = null;
  $('shPlayer').style.display = 'none';
  $('shList').style.display = '';
  renderShadowingList();
}

function getShConv() { return SHADOWING.find(function(c) { return c.id === shConvId; }); }

function renderShadowingPlayer() {
  var conv = getShConv(); if (!conv) return;
  loadShTimes(conv);
  var isAudio = !!conv.audio;
  var html = '<div class="sh-header">';
  html += '<button class="sh-back" onclick="exitShadowingPlayer()">&#8592; Conversations</button>';
  html += '<div class="sh-title">' + conv.title + '</div>';
  html += '<div class="sh-card-title-th">' + conv.titleTh + '</div>';
  html += '<div class="sh-desc">' + conv.description + '</div></div>';
  if (isAudio) {
    html += '<audio id="shAudio" src="' + conv.audio + '" preload="metadata"></audio>';
    html += '<div class="sh-audio-controls">';
    html += '<button class="sh-play-all" id="shPlayAllBtn" onclick="toggleShPlayAll()">&#9654; Play</button>';
    html += '<button class="sh-stop-btn" id="shStopBtn" onclick="stopShPlay()" style="display:none">&#9632;</button>';
    html += '<button class="sh-sync-btn" id="shSyncBtn" onclick="toggleShSync()">&#9881; Sync</button>';
    html += '<div class="sh-indicator" id="shIndicator"></div>';
    html += '</div>';
    html += '<div class="sh-sync-panel" id="shSyncPanel" style="display:none">';
    html += '<p>Play the audio. Tap <b>MARK</b> at the start of each line to sync timestamps.</p>';
    html += '<button class="sh-sync-mark" id="shSyncMark" onclick="shSyncTap()">MARK line ' + (shSyncIdx + 1) + '</button>';
    html += '<button class="sh-sync-reset" onclick="resetShTimes()">Reset</button>';
    html += '</div>';
  } else {
    html += '<div class="sh-controls">';
    html += '<button class="sh-play-all" id="shPlayAllBtn" onclick="toggleShPlayAll()">&#9654; Play All</button>';
    html += '<button class="sh-stop-btn" id="shStopBtn" onclick="stopShPlay()" style="display:none">&#9632; Stop</button>';
    html += '<button class="sh-speed-btn" onclick="cycleShSpeed()">' + shSpeed + 'x</button>';
    html += '<div class="sh-indicator" id="shIndicator"></div></div>';
  }
  html += '<div class="sh-lines" id="shLines">';
  conv.lines.forEach(function(line, i) {
    var isYou = line.speaker === 'B';
    html += '<div class="sh-line' + (isYou ? ' sh-line-you' : '') + (i === shLineIdx ? ' active' : '') + '" onclick="playShLine(' + i + ')">';
    html += '<div class="sh-speaker">' + line.speakerLabel + '</div>';
    html += '<div class="sh-line-body">';
    if (isAudio) {
      html += '<div class="sh-es">' + line.es + '</div>';
      html += '<div class="sh-en">' + line.english + '</div>';
      if (line.t) html += '<div class="sh-time">' + formatTime(line.t) + '</div>';
    } else {
      html += '<div class="sh-thai">' + line.thai + '</div>';
      html += '<div class="sh-es">' + line.es + '</div>';
      html += '<div class="sh-tone">' + renderTone(line.tone) + '</div>';
      html += '<div class="sh-en">' + line.english + '</div>';
      html += '<div class="sh-sp">' + line.spanish + '</div>';
    }
    html += '</div><div class="sh-play-icon">&#9654;</div></div>';
  });
  html += '</div>';
  $('shPlayer').innerHTML = html;
  if (isAudio) {
    var a = $('shAudio');
    a.addEventListener('timeupdate', shAudioTimeUpdate);
    a.addEventListener('ended', stopShPlay);
    a.addEventListener('play', function() { shPlaying = true; updateShPlayBtn(); });
    a.addEventListener('pause', function() { if (!shSyncing) { shPlaying = false; updateShPlayBtn(); } });
  }
}

function formatTime(s) {
  var m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function loadShTimes(conv) {
  var saved = localStorage.getItem('sh_times_' + conv.id);
  if (saved) {
    var times = JSON.parse(saved);
    conv.lines.forEach(function(l, i) { if (times[i] != null) l.t = times[i]; });
  }
}

function saveShTimes() {
  var conv = getShConv(); if (!conv) return;
  var times = conv.lines.map(function(l) { return l.t || 0; });
  localStorage.setItem('sh_times_' + conv.id, JSON.stringify(times));
}

function resetShTimes() {
  var conv = getShConv(); if (!conv) return;
  conv.lines.forEach(function(l) { l.t = 0; });
  localStorage.removeItem('sh_times_' + conv.id);
  shSyncIdx = 0;
  renderShadowingPlayer();
}

function playShLine(idx) {
  var conv = getShConv();
  if (!conv || idx < 0 || idx >= conv.lines.length) return;
  shLineIdx = idx;
  updateShHighlight();
  if (conv.audio) {
    var a = $('shAudio');
    if (a && conv.lines[idx].t) a.currentTime = conv.lines[idx].t;
    if (a && a.paused) { a.play(); shPlaying = true; updateShPlayBtn(); }
  } else {
    stopCurrentAudio();
    speakText(conv.lines[idx].thai);
  }
}

function updateShHighlight() {
  var lines = document.querySelectorAll('.sh-line');
  lines.forEach(function(el, i) { el.classList.toggle('active', i === shLineIdx); });
  if (lines[shLineIdx]) lines[shLineIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleShPlayAll() {
  var conv = getShConv();
  if (conv && conv.audio) {
    var a = $('shAudio');
    if (!a) return;
    if (shPlaying) { a.pause(); shPlaying = false; }
    else { a.play(); shPlaying = true; }
    updateShPlayBtn();
  } else {
    if (shPlaying) stopShPlay();
    else startShPlay(shLineIdx >= 0 ? shLineIdx : 0);
  }
}

function shAudioTimeUpdate() {
  var conv = getShConv(); if (!conv) return;
  var a = $('shAudio'); if (!a) return;
  var t = a.currentTime;
  var newIdx = -1;
  for (var i = 0; i < conv.lines.length; i++) {
    if (conv.lines[i].t && t >= conv.lines[i].t) newIdx = i;
    else if (conv.lines[i].t && t < conv.lines[i].t) break;
  }
  if (newIdx >= 0 && newIdx !== shLineIdx) { shLineIdx = newIdx; updateShHighlight(); }
  $('shIndicator').textContent = formatTime(t);
}

function updateShPlayBtn() {
  var btn = $('shPlayAllBtn');
  if (!btn) return;
  if (shPlaying) {
    btn.innerHTML = '&#9208; Pause'; btn.style.background = '#0f3460'; btn.style.color = '#ffd166';
    $('shStopBtn').style.display = '';
  } else {
    btn.innerHTML = '&#9654; Play'; btn.style.background = '#e94560'; btn.style.color = '#fff';
    $('shStopBtn').style.display = 'none';
  }
}

// --- Tap-to-sync ---
var shSyncing = false;
var shSyncIdx = 0;

function toggleShSync() {
  shSyncing = !shSyncing;
  var panel = $('shSyncPanel');
  var btn = $('shSyncBtn');
  if (shSyncing) {
    panel.style.display = '';
    btn.style.background = '#ffd166'; btn.style.color = '#0f3460';
    shSyncIdx = 0;
    updateSyncMarkBtn();
    var a = $('shAudio');
    if (a) { a.currentTime = 0; a.play(); }
  } else {
    panel.style.display = 'none';
    btn.style.background = ''; btn.style.color = '';
    var a = $('shAudio'); if (a) a.pause();
  }
}

function updateSyncMarkBtn() {
  var conv = getShConv();
  var btn = $('shSyncMark');
  if (btn && conv) {
    btn.textContent = 'MARK line ' + (shSyncIdx + 1) + ' / ' + conv.lines.length;
    btn.disabled = shSyncIdx >= conv.lines.length;
  }
}

function shSyncTap() {
  var conv = getShConv(); if (!conv) return;
  var a = $('shAudio'); if (!a) return;
  if (shSyncIdx >= conv.lines.length) return;
  conv.lines[shSyncIdx].t = Math.round(a.currentTime * 10) / 10;
  saveShTimes();
  shSyncIdx++;
  shLineIdx = shSyncIdx - 1;
  updateShHighlight();
  updateSyncMarkBtn();
  if (shSyncIdx >= conv.lines.length) {
    var markBtn = $('shSyncMark');
    if (markBtn) markBtn.textContent = 'DONE — synced!';
  }
}

function startShPlay(fromIdx) {
  if (!getShConv()) return;
  shPlaying = true;
  var btn = $('shPlayAllBtn');
  btn.innerHTML = '&#9208; Pause'; btn.style.background = '#0f3460'; btn.style.color = '#ffd166';
  $('shStopBtn').style.display = '';
  shPlayNext(fromIdx);
}

function shPlayNext(idx) {
  var conv = getShConv();
  if (!shPlaying || !conv || idx >= conv.lines.length) { stopShPlay(); return; }
  shLineIdx = idx; updateShHighlight();
  $('shIndicator').textContent = (idx + 1) + ' / ' + conv.lines.length;
  stopCurrentAudio();
  speakText(conv.lines[idx].thai, function() {
    if (!shPlaying) return;
    shTimeout = setTimeout(function() { shPlayNext(idx + 1); }, Math.round(2500 / shSpeed));
  });
}

function stopShPlay() {
  shPlaying = false; clearTimeout(shTimeout);
  var conv = getShConv();
  if (conv && conv.audio) {
    var a = $('shAudio'); if (a) { a.pause(); }
  } else {
    stopCurrentAudio();
  }
  var btn = $('shPlayAllBtn');
  if (btn) { btn.innerHTML = '&#9654; Play All'; btn.style.background = '#e94560'; btn.style.color = '#fff'; }
  var stop = $('shStopBtn'); if (stop) stop.style.display = 'none';
  var ind = $('shIndicator'); if (ind) ind.textContent = '';
}

function cycleShSpeed() {
  var speeds = [0.75, 1, 1.25, 1.5];
  shSpeed = speeds[(speeds.indexOf(shSpeed) + 1) % speeds.length];
  document.querySelectorAll('.sh-speed-btn').forEach(function(b) { b.textContent = shSpeed + 'x'; });
}

// --- Tones Mode ---
function getToneItems() {
  // Returns { words: [...], pairs: [...] } filtered by lesson + activeToneSel
  var lessonNum = activeLesson === 'all' ? null : parseInt(activeLesson);
  var tone = activeToneSel;

  function matchLesson(item) { return !lessonNum || (item.lesson || 1) === lessonNum; }
  function matchTone(t) { return !tone || (t && t.split('-').indexOf(tone) !== -1); }

  var words = DATA.words.filter(function(w) {
    return matchLesson(w) && matchTone(w.tone);
  });

  var pairs = [];
  if (DATA.pairs) {
    var wordMap = {};
    DATA.words.forEach(function(w) { wordMap[w.thai] = w; });
    pairs = DATA.pairs.filter(function(p) {
      if (!matchLesson(p)) return false;
      var w1 = wordMap[p.w1], w2 = wordMap[p.w2];
      if (!w1 || !w2) return false;
      if (!tone) return true;
      // pair is relevant if either side has the selected tone
      return (w1.tone && w1.tone.split('-').indexOf(tone) !== -1) ||
             (w2.tone && w2.tone.split('-').indexOf(tone) !== -1);
    }).map(function(p) {
      return { w1: wordMap[p.w1], w2: wordMap[p.w2], note: p.note };
    });
  }

  // Count per tone (for the strip badges)
  var counts = {};
  Object.keys(TONES).forEach(function(k) { counts[k] = 0; });
  DATA.words.forEach(function(w) {
    if (!matchLesson(w) || !w.tone) return;
    w.tone.split('-').forEach(function(t) { if (counts[t] != null) counts[t]++; });
  });

  return { words: words, pairs: pairs, counts: counts };
}

function renderTonesView() {
  var data = getToneItems();

  // Strip of 5 tones + All
  var stripHtml = '<button class="tone-card' + (!activeToneSel ? ' active' : '') + '" style="color:#aaa" onclick="selectTone(null)">' +
    '<div class="tc-symbol">&#9834;</div><div class="tc-name">All</div><div class="tc-count">' + countAllWordsForLesson() + ' words</div></button>';
  Object.keys(TONES).forEach(function(k) {
    var info = TONES[k];
    var cls = activeToneSel === k ? ' active' : '';
    stripHtml += '<button class="tone-card' + cls + '" style="color:' + info.color + '" onclick="selectTone(\'' + k + '\')">' +
      '<div class="tc-symbol">' + info.symbol + '</div>' +
      '<div class="tc-name">' + info.name + '</div>' +
      '<div class="tc-count">' + data.counts[k] + ' words</div></button>';
  });
  $('tonesStrip').innerHTML = stripHtml;

  // Index map: thai -> position in data.words (so tonesPlayWord(i) stays correct in grouped sections)
  var idxMap = {};
  data.words.forEach(function(w, i) { idxMap[w.thai] = i; });

  // Reset per-render groups registry (used by tonesPlayGroup)
  tonesGroups = {};

  var html = '';

  if (activeToneSel) {
    // Specific tone -> single section (existing behavior)
    if (data.words.length) {
      html += renderTonesWordsSection(activeToneSel, data.words, idxMap, false);
    }
  } else {
    // "All" -> one section per tone, in TONES order, classified by primary (first) tone
    Object.keys(TONES).forEach(function(k) {
      var group = data.words.filter(function(w) {
        return w.tone && w.tone.split('-')[0] === k;
      });
      if (group.length) {
        tonesGroups[k] = group;
        html += renderTonesWordsSection(k, group, idxMap, true);
      }
    });
  }

  // Minimal pairs section
  if (data.pairs.length) {
    html += '<div class="tones-section">' +
      '<div class="tones-section-head">' +
        '<div><div class="tones-section-title">Minimal pairs' + (activeToneSel ? ' contrasting ' + TONES[activeToneSel].name : '') + '</div>' +
        '<div class="tones-section-sub">' + data.pairs.length + ' pairs — tap to compare</div></div>' +
      '</div><div class="tones-grid">' +
      data.pairs.map(function(p, i) {
        return '<div class="tone-item" onclick="tonesPlayPair(' + i + ')">' +
          '<div class="ti-thai">' + p.w1.thai + ' / ' + p.w2.thai + '</div>' +
          '<div class="ti-ph">' + p.w1.phonetic + ' · ' + p.w2.phonetic + '</div>' +
          '<div class="ti-en">' + (THAI_EN[p.w1.thai] || p.w1.spanish) + ' / ' + (THAI_EN[p.w2.thai] || p.w2.spanish) + '</div>' +
          '<div class="ti-tone">' + renderTone(p.w1.tone, activeToneSel) + ' vs ' + renderTone(p.w2.tone, activeToneSel) + '</div>' +
        '</div>';
      }).join('') + '</div></div>';
  }

  if (!html && !data.pairs.length) {
    html = '<div class="tones-empty">No tone-tagged content' +
      (activeLesson !== 'all' ? ' for Lesson ' + activeLesson : '') + '.</div>';
  }

  $('tonesContent').innerHTML = html;
}

function renderTonesWordsSection(toneKey, words, idxMap, isGroup) {
  var info = TONES[toneKey];
  var titleHtml = '<span style="color:' + info.color + '">' + info.symbol + ' ' + info.name + '</span>';
  var playCall = isGroup ? 'tonesPlayGroup(\'' + toneKey + '\')' : 'tonesPlayAllWords()';
  return '<div class="tones-section">' +
    '<div class="tones-section-head">' +
      '<div><div class="tones-section-title">' + titleHtml + ' — ' + words.length + ' words</div></div>' +
      '<button class="ts-play-all" onclick="' + playCall + '">&#9654; Play all</button>' +
    '</div><div class="tones-grid">' +
    words.map(function(w) {
      var gi = idxMap[w.thai];
      return '<div class="tone-item" data-thai="' + w.thai + '" onclick="tonesPlayWord(' + gi + ')">' +
        '<div class="ti-thai">' + w.thai + '</div>' +
        '<div class="ti-ph">' + w.phonetic + '</div>' +
        '<div class="ti-en">' + (THAI_EN[w.thai] || w.spanish) + '</div>' +
        (w.tone ? '<div class="ti-tone">' + renderTone(w.tone, toneKey) + '</div>' : '') +
      '</div>';
    }).join('') + '</div></div>';
}

function countAllWordsForLesson() {
  var lessonNum = activeLesson === 'all' ? null : parseInt(activeLesson);
  return DATA.words.filter(function(w) { return !lessonNum || (w.lesson || 1) === lessonNum; }).length;
}

function selectTone(t) {
  activeToneSel = t;
  renderTonesView();
}

var tonesPlayingQueue = null, tonesPlayingIdx = 0, tonesPlayingTimer = null;
var tonesGroups = {}; // tone key -> array of words (populated by renderTonesView for grouped playback)
function tonesPlayAllWords() {
  var data = getToneItems();
  if (!data.words.length) return;
  if (tonesPlayingQueue) { stopTonesPlay(); return; }
  tonesPlayingQueue = data.words;
  tonesPlayingIdx = 0;
  tonesPlayNextWord();
}

function tonesPlayGroup(key) {
  var list = tonesGroups[key] || [];
  if (!list.length) return;
  if (tonesPlayingQueue) { stopTonesPlay(); return; }
  tonesPlayingQueue = list;
  tonesPlayingIdx = 0;
  tonesPlayNextWord();
}
function tonesPlayNextWord() {
  if (!tonesPlayingQueue || tonesPlayingIdx >= tonesPlayingQueue.length) { stopTonesPlay(); return; }
  var w = tonesPlayingQueue[tonesPlayingIdx];
  highlightToneItem(w);
  stopCurrentAudio();
  speakText(w.thai, function() {
    if (!tonesPlayingQueue) return;
    tonesPlayingTimer = setTimeout(function() {
      tonesPlayingIdx++;
      tonesPlayNextWord();
    }, 800);
  });
}
function tonesPlayWord(i) {
  var data = getToneItems();
  if (!data.words[i]) return;
  stopCurrentAudio();
  speakText(data.words[i].thai);
}
function tonesPlayPair(i) {
  var data = getToneItems();
  if (!data.pairs[i]) return;
  stopCurrentAudio();
  speakText(data.pairs[i].w1.thai, function() {
    setTimeout(function() { speakText(data.pairs[i].w2.thai); }, 1200);
  });
}
function highlightToneItem(w) {
  if (!w) return;
  document.querySelectorAll('.tones-section .tone-item').forEach(function(el) {
    el.style.outline = (el.getAttribute('data-thai') === w.thai) ? '2px solid #e94560' : '';
  });
}
function stopTonesPlay() {
  tonesPlayingQueue = null;
  clearTimeout(tonesPlayingTimer);
  stopCurrentAudio();
  document.querySelectorAll('.tones-section .tone-item').forEach(function(el) { el.style.outline = ''; });
}

// --- Init ---
buildLessonTabs();
buildModeTabs();
buildFilterChips();
deck = buildDeck();
if (activeLesson === 'dificiles') deck = deck.filter(function(it) { return difficult.has(cardKey(it)); });
$('progress').textContent = deck.length + ' cards';
showCard();
updatePlayBtn();
