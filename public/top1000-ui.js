// Top 1000 — Dashboard view with sub-tabs (Palabras | Estructuras | Frases | Conversaciones)
// Depends on: TOP1000_WORDS, TOP1000_STRUCTURES, TOP1000_PHRASES, TOP1000_CONVERSATIONS,
//             TOP1000_CATEGORIES, TOP1000_STRUCTURE_CATEGORIES, TOP1000_SITUATIONS (top1000.js),
//             $ (config.js), renderTone (config.js), speakText (audio.js)

var top1000Filter = { tab: 'palabras', category: 'all', search: '' };

// Word dictionary for phrase segmentation (built once, cached)
var TOP1000_WORD_BY_THAI = null;
var TOP1000_WORD_MAXLEN = 0;
function getTop1000WordDict() {
  if (!TOP1000_WORD_BY_THAI) {
    TOP1000_WORD_BY_THAI = {};
    TOP1000_WORDS.forEach(function(w) {
      if (!TOP1000_WORD_BY_THAI[w.thai]) TOP1000_WORD_BY_THAI[w.thai] = w;
      if (w.thai.length > TOP1000_WORD_MAXLEN) TOP1000_WORD_MAXLEN = w.thai.length;
    });
  }
  return TOP1000_WORD_BY_THAI;
}
function segmentPhraseThai(thai) {
  var dict = getTop1000WordDict();
  var segments = [];
  var parts = thai.split(/\s+/);
  for (var pi = 0; pi < parts.length; pi++) {
    var p = parts[pi];
    if (!p) continue;
    if (dict[p]) { segments.push(dict[p]); continue; }
    var i = 0;
    while (i < p.length) {
      var matched = null;
      var max = Math.min(TOP1000_WORD_MAXLEN, p.length - i);
      for (var len = max; len >= 1; len--) {
        var sub = p.substring(i, i + len);
        if (dict[sub]) { matched = dict[sub]; break; }
      }
      if (matched) { segments.push(matched); i += matched.thai.length; }
      else { segments.push({ thai: p.charAt(i), _unknown: true }); i++; }
    }
  }
  return segments;
}

var TOP1000_TABS = [
  { key: 'palabras',       label: 'Palabras',       count: function() { return TOP1000_WORDS.length; } },
  { key: 'estructuras',    label: 'Estructuras',    count: function() { return TOP1000_STRUCTURES.length; } },
  { key: 'frases',         label: 'Frases',         count: function() { return TOP1000_PHRASES.length; } },
  { key: 'conversaciones', label: 'Conversaciones', count: function() { return TOP1000_CONVERSATIONS.length; } },
  {
    key: 'estudiar',
    label: 'Estudiar',
    count: function() {
      if (typeof getDeckStats !== 'function') return 0;
      var due = 0;
      ['palabras', 'estructuras', 'frases'].forEach(function(k) {
        try { due += getDeckStats(k).due; } catch (e) {}
      });
      return due;
    }
  }
];

function renderTop1000() {
  var view = $('top1000View');
  if (!view) return;

  // Sub-tabs
  var tabs = '<div class="top1000-tabs">' + TOP1000_TABS.map(function(t) {
    var active = top1000Filter.tab === t.key ? ' active' : '';
    var count = t.count();
    var countLabel = (t.key === 'estudiar')
      ? (count > 0 ? '(' + count + ' due)' : '✓')
      : '(' + count + ')';
    return '<button class="top1000-tab' + active + '" onclick="setTop1000Tab(\'' + t.key + '\')">' +
      t.label + ' <span class="top1000-tab-count">' + countLabel + '</span></button>';
  }).join('') + '</div>';

  // Dispatch to active tab renderer
  var body;
  if (top1000Filter.tab === 'palabras') body = renderTop1000Words();
  else if (top1000Filter.tab === 'estructuras') body = renderTop1000Structures();
  else if (top1000Filter.tab === 'frases') body = renderTop1000Phrases();
  else if (top1000Filter.tab === 'conversaciones') body = renderTop1000Conversations();
  else if (top1000Filter.tab === 'estudiar') {
    body = renderTop1000StudyBody();
  } else body = '';

  view.innerHTML = tabs + body;
}

// Top 1000 → Estudiar sub-tab body. Mounts the SRS UI inline in #top1000View
// with a Top-1000-only deck filter. When the user starts a session, the SRS
// engine overwrites #top1000View with the full-screen study UI; on exit, the
// srsOnExit callback restores this sub-tab.
function renderTop1000StudyBody() {
  if (typeof mountSrsInline !== 'function' || typeof renderDeckPicker !== 'function') {
    return '<div class="top1000-empty">SRS no disponible.</div>';
  }
  mountSrsInline('top1000View', function() { setTop1000Tab('estudiar'); }, SRS_TOP1000_DECK_KEYS);
  return renderDeckPicker();
}

// Top 1000 → Estudiar sub-tab body. Mounts the SRS UI inline in #top1000View
// with a Top-1000-only deck filter. When the user starts a session, the SRS
// engine overwrites #top1000View with the full-screen study UI; on exit, the
// srsOnExit callback restores this sub-tab.
function renderTop1000StudyBody() {
  if (typeof mountSrsInline !== 'function' || typeof renderDeckPicker !== 'function') {
    return '<div class="top1000-empty">SRS no disponible.</div>';
  }
  mountSrsInline('top1000View', function() { setTop1000Tab('estudiar'); }, SRS_TOP1000_DECK_KEYS);
  return renderDeckPicker();
}

function setTop1000Tab(tab) {
  // Leaving the inline SRS sub-tab → restore the parent view's normal styling.
  if (top1000Filter.tab === 'estudiar' && tab !== 'estudiar' && typeof unmountSrsInline === 'function') {
    unmountSrsInline();
  }
  top1000Filter.tab = tab;
  top1000Filter.category = 'all';
  top1000Filter.search = '';
  renderTop1000();
}

// ============ Palabras ============
function renderTop1000Words() {
  var cats = ['all'].concat(TOP1000_CATEGORIES);
  var chips = cats.map(function(c) {
    var active = top1000Filter.category === c ? ' active' : '';
    var label = c === 'all' ? 'Todas (' + TOP1000_WORDS.length + ')' :
      c.charAt(0).toUpperCase() + c.slice(1) + ' (' + TOP1000_WORDS.filter(function(w){return w.category===c;}).length + ')';
    return '<button class="top1000-chip' + active + '" onclick="setTop1000Cat(\'' + c + '\')">' + label + '</button>';
  }).join('');

  var filtered = TOP1000_WORDS.filter(function(w) {
    if (top1000Filter.category !== 'all' && w.category !== top1000Filter.category) return false;
    if (top1000Filter.search) {
      var q = top1000Filter.search.toLowerCase();
      if (!(w.thai.indexOf(q) >= 0 ||
            (w.es || '').toLowerCase().indexOf(q) >= 0 ||
            (w.spanish || '').toLowerCase().indexOf(q) >= 0 ||
            (w.english || '').toLowerCase().indexOf(q) >= 0)) return false;
    }
    return true;
  });

  var search = '<div class="top1000-search">' +
    '<input type="text" placeholder="Search (thai/english)..." value="' + (top1000Filter.search||'').replace(/"/g,'&quot;') + '" ' +
    'oninput="setTop1000Search(this.value)"></div>';

  var header = '<div class="top1000-bar">' +
    '<div class="top1000-chips">' + chips + '</div>' +
    search +
    '<div class="top1000-count">' + filtered.length + ' palabras</div>' +
  '</div>';

  if (!filtered.length) {
    return header + '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>';
  }

  var cards = filtered.map(renderTop1000Card).join('');
  return header + '<div class="top1000-grid">' + cards + '</div>';
}

function renderTop1000Card(w) {
  var tone = (typeof renderTone === 'function') ? renderTone(w.tone) : '';
  var cat = w.category;
  var catShort = { expresiones:'EXP', pronombres:'PRO', verbos:'VRB', sustantivos:'SUS', adjetivos:'ADJ', adverbios:'ADV' }[cat] || cat.slice(0,3).toUpperCase();
  var rank = '#' + w.rank;
  function q(s) { return (s||'').replace(/'/g,"\\'"); }
  return '<div class="top1000-card" data-thai="' + w.thai + '">' +
    '<div class="t1-rank">' + rank + '</div>' +
    '<div class="t1-cat t1-cat-' + cat + '">' + catShort + '</div>' +
    '<div class="t1-head">' +
      '<div class="t1-thai">' + w.thai + '</div>' +
      '<button class="t1-speak-word" onclick="event.stopPropagation();top1000Speak(\'' + q(w.thai) + '\')" title="Reproducir palabra">▶</button>' +
    '</div>' +
    '<div class="t1-es">' + (w.es || '') + '</div>' +
    (tone ? '<div class="t1-tone">' + tone + '</div>' : '') +
    '<div class="t1-es-meaning">' + (w.english || '') + '</div>' +
    '<div class="t1-detail">' +
      '<div class="t1-section">' +
        '<div class="t1-label">Frase <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(w.phrase.thai) + '\')" title="Reproducir">▶</button></div>' +
        '<div class="t1-line"><span class="t1-line-thai">' + w.phrase.thai + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es">' + w.phrase.es + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es-meaning">' + (w.phrase.en || '') + '</span></div>' +
      '</div>' +
      '<div class="t1-section">' +
        '<div class="t1-label">Pregunta <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(w.question.thai) + '\')" title="Reproducir">▶</button></div>' +
        '<div class="t1-line"><span class="t1-line-thai">' + w.question.thai + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es">' + w.question.es + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es-meaning">' + (w.question.en || '') + '</span></div>' +
      '</div>' +
      '<div class="t1-section">' +
        '<div class="t1-label">Respuesta <button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(w.answer.thai) + '\')" title="Reproducir">▶</button></div>' +
        '<div class="t1-line"><span class="t1-line-thai">' + w.answer.thai + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es">' + w.answer.es + '</span></div>' +
        '<div class="t1-line"><span class="t1-line-es-meaning">' + (w.answer.en || '') + '</span></div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ============ Estructuras ============
function renderTop1000Structures() {
  var cats = ['all'].concat(TOP1000_STRUCTURE_CATEGORIES);
  var chips = cats.map(function(c) {
    var active = top1000Filter.category === c ? ' active' : '';
    var label = c === 'all' ? 'Todas (' + TOP1000_STRUCTURES.length + ')' :
      c + ' (' + TOP1000_STRUCTURES.filter(function(s){return s.category===c;}).length + ')';
    return '<button class="top1000-chip' + active + '" onclick="setTop1000Cat(\'' + c + '\')">' + label + '</button>';
  }).join('');

  var filtered = TOP1000_STRUCTURES.filter(function(s) {
    if (top1000Filter.category !== 'all' && s.category !== top1000Filter.category) return false;
    if (top1000Filter.search) {
      var q = top1000Filter.search.toLowerCase();
      var hay = (s.name + ' ' + s.explanation + ' ' + s.examples.map(function(e){return e.thai+' '+e.spanish;}).join(' ')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });

  var search = '<div class="top1000-search">' +
    '<input type="text" placeholder="Buscar estructura..." value="' + (top1000Filter.search||'').replace(/"/g,'&quot;') + '" ' +
    'oninput="setTop1000Search(this.value)"></div>';

  var header = '<div class="top1000-bar">' +
    '<div class="top1000-chips">' + chips + '</div>' +
    search +
    '<div class="top1000-count">' + filtered.length + ' estructuras</div>' +
  '</div>';

  if (!filtered.length) return header + '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>';

  return header + '<div class="top1000-grid">' + filtered.map(renderTop1000StructureCard).join('') + '</div>';
}

function renderTop1000StructureCard(s) {
  function stars(n) {
    var full = '★'.repeat(n), empty = '☆'.repeat(5-n);
    return '<span class="t1-stars">' + full + empty + '</span>';
  }
  function q(str) { return (str||'').replace(/'/g,"\\'"); }
  var examples = s.examples.map(function(e) {
    return '<div class="t1-example">' +
      '<div class="t1-line"><span class="t1-line-thai">' + e.thai + ' ' +
        '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(e.thai) + '\')">▶</button></span></div>' +
      '<div class="t1-line"><span class="t1-line-es">' + e.rtgs + '</span></div>' +
      '<div class="t1-line"><span class="t1-line-es-meaning">' + e.spanish + ' · <i>' + e.english + '</i></span></div>' +
    '</div>';
  }).join('');

  return '<div class="top1000-card t1-structure-card">' +
    '<div class="t1-rank">#' + s.id + '</div>' +
    '<div class="t1-cat t1-cat-structure">' + s.category + '</div>' +
    '<div class="t1-structure-head">' +
      '<div class="t1-thai">' + s.name + '</div>' + stars(s.importance) +
    '</div>' +
    '<div class="t1-section"><div class="t1-label">Explicación</div>' +
      '<div class="t1-line">' + s.explanation + '</div></div>' +
    '<div class="t1-section"><div class="t1-label">Cuándo se usa</div>' +
      '<div class="t1-line">' + s.when + '</div></div>' +
    '<div class="t1-section"><div class="t1-label">Errores típicos</div>' +
      '<div class="t1-line">' + s.mistakes + '</div></div>' +
    (s.colloquial ? '<div class="t1-section"><div class="t1-label">Coloquial</div>' +
      '<div class="t1-line">' + s.colloquial + '</div></div>' : '') +
    '<div class="t1-section"><div class="t1-label">Ejemplos (' + s.examples.length + ')</div>' + examples + '</div>' +
  '</div>';
}

// ============ Frases ============
function renderTop1000Phrases() {
  var filtered = TOP1000_PHRASES.filter(function(p) {
    if (top1000Filter.search) {
      var q = top1000Filter.search.toLowerCase();
      var hay = (p.thai + ' ' + p.rtgs + ' ' + p.spanish + ' ' + p.english + ' ' + (p.note||'')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });

  var search = '<div class="top1000-search">' +
    '<input type="text" placeholder="Buscar frase..." value="' + (top1000Filter.search||'').replace(/"/g,'&quot;') + '" ' +
    'oninput="setTop1000Search(this.value)"></div>';

  var header = '<div class="top1000-bar">' +
    '<div class="top1000-chips"><span class="top1000-hint">Banco de frases — reutiliza palabras y estructuras</span></div>' +
    search +
    '<div class="top1000-count">' + filtered.length + ' frases</div>' +
  '</div>';

  if (!filtered.length) return header + '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>';

  return header + '<div class="top1000-grid">' + filtered.map(renderTop1000PhraseRow).join('') + '</div>';
}

function renderTop1000PhraseRow(p) {
  function q(str) { return (str||'').replace(/'/g,"\\'"); }
  var segments = (typeof TOP1000_PHRASE_SEGMENTS !== 'undefined' && TOP1000_PHRASE_SEGMENTS[p.id]) || segmentPhraseThai(p.thai);
  var wordsHtml = segments.map(function(s) {
    var en = s.en || s.english || '';
    var es = s.es || '';
    var cls = 't1-phrase-word' + (en ? '' : ' t1-phrase-word-unknown');
    return '<span class="' + cls + '">' +
      '<span class="t1-phrase-word-thai">' + s.thai + '</span> ' +
      '<span class="t1-phrase-word-es">' + es + '</span>' +
      '<span class="t1-phrase-word-en">' + en + '</span>' +
    '</span>';
  }).join('');
  var struct = p.structureId ? TOP1000_STRUCTURES.find(function(s){return s.id===p.structureId;}) : null;
  var structTag = struct ? '<span class="t1-phrase-meta-struct">#' + struct.id + ' ' + struct.name + '</span>' : '';

  return '<div class="top1000-card t1-phrase-row">' +
    '<div class="t1-rank">#' + p.id + '</div>' +
    '<div class="t1-line"><span class="t1-line-thai">' + p.thai + ' ' +
      '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(p.thai) + '\')">▶</button></span></div>' +
    '<div class="t1-line"><span class="t1-line-es">' + (p.rtgs || '') + '</span></div>' +
    '<div class="t1-line"><span class="t1-line-en">' + (p.english || '') + '</span></div>' +
    '<div class="t1-phrase-meta">' +
      (wordsHtml ? '<div class="t1-label">Palabras:</div><div class="t1-phrase-words">' + wordsHtml + '</div>' : '') +
      (structTag ? '<div class="t1-label">Estructura: ' + structTag + '</div>' : '') +
      (p.note ? '<div class="t1-line t1-note">' + p.note + '</div>' : '') +
    '</div>' +
  '</div>';
}

// ============ Conversaciones ============
function renderTop1000Conversations() {
  var cats = ['all'].concat(TOP1000_SITUATIONS);
  var chips = cats.map(function(c) {
    var active = top1000Filter.category === c ? ' active' : '';
    var label = c === 'all' ? 'Todas (' + TOP1000_CONVERSATIONS.length + ')' :
      c + ' (' + TOP1000_CONVERSATIONS.filter(function(x){return x.situation===c;}).length + ')';
    return '<button class="top1000-chip' + active + '" onclick="setTop1000Cat(\'' + c + '\')">' + label + '</button>';
  }).join('');

  var filtered = TOP1000_CONVERSATIONS.filter(function(c) {
    if (top1000Filter.category !== 'all' && c.situation !== top1000Filter.category) return false;
    if (top1000Filter.search) {
      var q = top1000Filter.search.toLowerCase();
      var hay = (c.situation + ' ' + c.lines.map(function(l){return l.thai+' '+l.spanish;}).join(' ')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });

  var search = '<div class="top1000-search">' +
    '<input type="text" placeholder="Buscar conversación..." value="' + (top1000Filter.search||'').replace(/"/g,'&quot;') + '" ' +
    'oninput="setTop1000Search(this.value)"></div>';

  var header = '<div class="top1000-bar">' +
    '<div class="top1000-chips">' + chips + '</div>' +
    search +
    '<div class="top1000-count">' + filtered.length + ' conversaciones</div>' +
  '</div>';

  if (!filtered.length) return header + '<p style="color:#888;text-align:center;padding:40px 0">Sin resultados</p>';

  return header + '<div class="top1000-convo-list">' + filtered.map(renderTop1000ConvoCard).join('') + '</div>';
}

function renderTop1000ConvoCard(c) {
  function q(str) { return (str||'').replace(/'/g,"\\'"); }
  var lines = c.lines.map(function(l) {
    return '<div class="t1-convo-line">' +
      '<div class="t1-line"><span class="t1-line-thai">' + l.thai + ' ' +
        '<button class="t1-mini-play" onclick="event.stopPropagation();top1000Speak(\'' + q(l.thai) + '\')">▶</button></span></div>' +
      '<div class="t1-line"><span class="t1-line-es">' + l.rtgs + '</span></div>' +
      '<div class="t1-line"><span class="t1-line-es-meaning">' + l.spanish + ' · <i>' + l.english + '</i></span></div>' +
    '</div>';
  }).join('');
  return '<div class="top1000-card t1-convo-card">' +
    '<div class="t1-rank">#' + c.id + '</div>' +
    '<div class="t1-cat t1-cat-convo">' + c.situation + '</div>' +
    '<div class="t1-convo-head">' + c.situation + ' · <span class="t1-convo-meta">' + c.difficulty + ' · ' + c.lines.length + ' líneas</span></div>' +
    '<div class="t1-convo-body">' + lines + '</div>' +
  '</div>';
}

// ============ Handlers compartidos ============
function setTop1000Cat(cat) {
  top1000Filter.category = cat;
  renderTop1000();
}

function setTop1000Search(q) {
  top1000Filter.search = q;
  renderTop1000();
}

function top1000Speak(text) {
  if (typeof speakText === 'function') speakText(text);
}
