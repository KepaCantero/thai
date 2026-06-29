// SRS Engine — SM-2 (Anki-modified) spaced repetition for Top 1000
// Depends on: TOP1000_WORDS, TOP1000_STRUCTURES, TOP1000_PHRASES (top1000.js)
//
// 3 decks: palabras, estructuras, frases
// State persisted in localStorage as 'thai_srs_state'

var SRS_VERSION = 1;
var SRS_NEW_PER_DAY = 20;
var SRS_LEARN_AGAIN_SEC = 60;     // 1 min
var SRS_LEARN_HARD_SEC = 300;     // 5 min
var SRS_LEARN_GOOD_SEC = 600;     // 10 min
var SRS_LAPSE_SEC = 600;          // 10 min relearning
var SRS_DAY_SEC = 86400;

var SRS_DECKS = {
  palabras: {
    key: 'palabras',
    label: 'Palabras',
    icon: '📝',
    source: function() { return (typeof TOP1000_WORDS !== 'undefined') ? TOP1000_WORDS : []; },
    idOf: function(c) { return c.rank; },
    kind: 'word'
  },
  estructuras: {
    key: 'estructuras',
    label: 'Estructuras',
    icon: '🏗️',
    source: function() { return (typeof TOP1000_STRUCTURES !== 'undefined') ? TOP1000_STRUCTURES : []; },
    idOf: function(c) { return c.id; },
    kind: 'structure'
  },
  frases: {
    key: 'frases',
    label: 'Frases',
    icon: '💬',
    source: function() { return (typeof TOP1000_PHRASES !== 'undefined') ? TOP1000_PHRASES : []; },
    idOf: function(c) { return c.id; },
    kind: 'phrase'
  }
};

// In-memory state: { palabras: {id: {ef,ivl,due,reps,lapses,state}}, ... }
var SRS_STATE = null;

function loadSrsState() {
  try {
    var raw = localStorage.getItem('thai_srs_state');
    if (!raw) return freshSrsState();
    var parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== SRS_VERSION) return freshSrsState();
    return parsed.decks;
  } catch (e) { return freshSrsState(); }
}

function freshSrsState() {
  return { palabras: {}, estructuras: {}, frases: {} };
}

function saveSrsState() {
  if (!SRS_STATE) return;
  try {
    localStorage.setItem('thai_srs_state', JSON.stringify({ v: SRS_VERSION, decks: SRS_STATE }));
  } catch (e) { console.warn('[srs] save failed', e); }
}

function ensureSrsState() {
  if (!SRS_STATE) SRS_STATE = loadSrsState();
}

// Reset (debug / "empezar de nuevo")
function resetSrsDeck(deckKey) {
  ensureSrsState();
  if (!SRS_DECKS[deckKey]) return;
  SRS_STATE[deckKey] = {};
  saveSrsState();
}

// --- Stats ---
function getDeckStats(deckKey) {
  ensureSrsState();
  var deck = SRS_DECKS[deckKey];
  if (!deck) return { due: 0, learning: 0, new: 0, total: 0, mature: 0 };
  var cards = deck.source();
  var state = SRS_STATE[deckKey] || {};
  var now = Math.floor(Date.now() / 1000);
  var due = 0, learning = 0, mature = 0, seen = 0;
  cards.forEach(function(c) {
    var id = deck.idOf(c);
    var cs = state[id];
    if (!cs) return;
    seen++;
    if (cs.state === 'learn') {
      if (cs.due <= now) learning++;
    } else if (cs.state === 'review') {
      if (cs.due <= now) due++;
      else if (cs.ivl >= 21) mature++;
    }
  });
  var newCount = Math.max(0, cards.length - seen);
  var newToday = Math.min(SRS_NEW_PER_DAY, newCount);
  return {
    due: due + learning,
    learning: learning,
    new: newToday,
    newRemaining: newCount,
    total: cards.length,
    mature: mature,
    seen: seen
  };
}

// --- Session queue builder ---
// Returns array of { card, cardState, isNew } — interleaved: 1 new every 4 reviews
function buildSession(deckKey) {
  ensureSrsState();
  var deck = SRS_DECKS[deckKey];
  if (!deck) return [];
  var cards = deck.source();
  var state = SRS_STATE[deckKey] || {};
  var now = Math.floor(Date.now() / 1000);

  var dueReviews = [];
  var learning = [];
  var newCards = [];
  var seenCount = 0;

  cards.forEach(function(c) {
    var id = deck.idOf(c);
    var cs = state[id];
    if (!cs) {
      newCards.push(c);
      return;
    }
    seenCount++;
    if (cs.state === 'learn') {
      if (cs.due <= now) learning.push({ card: c, cardState: cs });
    } else if (cs.state === 'review') {
      if (cs.due <= now) dueReviews.push({ card: c, cardState: cs });
    }
  });

  dueReviews.sort(function(a, b) { return a.cardState.due - b.cardState.due; });
  var newToday = newCards.slice(0, SRS_NEW_PER_DAY);

  var queue = [];
  // Start with all learning (most urgent — short intervals)
  learning.forEach(function(item) { queue.push({ card: item.card, cardState: item.cardState, isNew: false, isLearning: true }); });
  // Interleave due reviews with new cards (1 new every 4 reviews)
  var i = 0, ni = 0;
  while (i < dueReviews.length) {
    queue.push({ card: dueReviews[i].card, cardState: dueReviews[i].cardState, isNew: false });
    i++;
    if (i % 4 === 0 && ni < newToday.length) {
      queue.push({ card: newToday[ni], cardState: null, isNew: true });
      ni++;
    }
  }
  while (ni < newToday.length) {
    queue.push({ card: newToday[ni], cardState: null, isNew: true });
    ni++;
  }
  return queue;
}

// --- SM-2 scheduling ---
// rating: 1=Again, 2=Hard, 3=Good, 4=Easy
function scheduleNext(prevState, rating, now) {
  now = now || Math.floor(Date.now() / 1000);
  var cs = prevState ? Object.assign({}, prevState) : { ef: 2.5, ivl: 0, due: now, reps: 0, lapses: 0, state: 'new' };
  var isNew = (cs.state === 'new');
  var isLearn = (cs.state === 'learn');

  function graduate(intervalDays, efDelta) {
    cs.state = 'review';
    cs.ivl = Math.max(1, intervalDays);
    cs.due = now + cs.ivl * SRS_DAY_SEC;
    cs.ef = clampEf(cs.ef + efDelta);
  }
  function stayLearn(sec) {
    cs.state = 'learn';
    cs.ivl = 0;
    cs.due = now + sec;
  }

  if (isNew || isLearn) {
    if (rating === 1) stayLearn(SRS_LEARN_AGAIN_SEC);
    else if (rating === 2) stayLearn(SRS_LEARN_HARD_SEC);
    else if (rating === 3) graduate(1, 0);
    else graduate(4, 0.15);
  } else {
    // review
    if (rating === 1) {
      cs.state = 'learn';
      cs.ivl = 0;
      cs.due = now + SRS_LAPSE_SEC;
      cs.lapses = (cs.lapses || 0) + 1;
      cs.ef = clampEf(cs.ef - 0.2);
    } else if (rating === 2) {
      var ni = Math.max(cs.ivl * 1.2, 1);
      cs.ivl = ni;
      cs.due = now + ni * SRS_DAY_SEC;
      cs.ef = clampEf(cs.ef - 0.15);
    } else if (rating === 3) {
      var ni = Math.max(cs.ivl * cs.ef, 1);
      cs.ivl = ni;
      cs.due = now + ni * SRS_DAY_SEC;
    } else {
      var ni = Math.max(cs.ivl * cs.ef * 1.3, 2);
      cs.ivl = ni;
      cs.due = now + ni * SRS_DAY_SEC;
      cs.ef = clampEf(cs.ef + 0.15);
    }
  }
  cs.reps = (cs.reps || 0) + 1;
  cs.lastRated = now;
  return cs;
}

function clampEf(ef) { return Math.max(1.3, Math.min(3.0, ef)); }

// Preview the next interval (in human format) for each rating button
function previewIntervals(prevState) {
  var now = Math.floor(Date.now() / 1000);
  var out = {};
  [1,2,3,4].forEach(function(r) {
    var next = scheduleNext(prevState, r, now);
    out[r] = formatInterval(next.due - now);
  });
  return out;
}

// Format seconds → "1min", "10min", "1d", "2mo", "1y", "<1min"
function formatInterval(sec) {
  if (sec < 60) return '<1min';
  if (sec < 3600) return Math.round(sec / 60) + 'min';
  if (sec < SRS_DAY_SEC) return Math.round(sec / 3600) + 'h';
  var days = Math.round(sec / SRS_DAY_SEC);
  if (days === 1) return '1d';
  if (days < 30) return days + 'd';
  if (days < 365) {
    var mo = Math.round(days / 30);
    return mo + 'mo';
  }
  var y = (days / 365).toFixed(1);
  return (y.endsWith('.0') ? y.slice(0, -2) : y) + 'a';
}

// Persist a rating
function recordRating(deckKey, cardId, rating) {
  ensureSrsState();
  var state = SRS_STATE[deckKey] || {};
  var prev = state[cardId] || null;
  var next = scheduleNext(prev, rating);
  state[cardId] = next;
  SRS_STATE[deckKey] = state;
  saveSrsState();
  return next;
}

// --- Daily stats ---
function getTodayStr() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function loadSrsStats() {
  try {
    var raw = localStorage.getItem('thai_srs_stats');
    if (!raw) return defaultStats();
    var p = JSON.parse(raw);
    if (p.today !== getTodayStr()) return defaultStats();
    return p;
  } catch (e) { return defaultStats(); }
}

function defaultStats() {
  return { today: getTodayStr(), reviewed: 0, learned: 0, timeSec: 0 };
}

function saveSrsStats(stats) {
  try { localStorage.setItem('thai_srs_stats', JSON.stringify(stats)); } catch (e) {}
}

function bumpSrsStats(reviewed, learned, timeSec) {
  var s = loadSrsStats();
  s.reviewed += reviewed || 0;
  s.learned += learned || 0;
  s.timeSec += timeSec || 0;
  saveSrsStats(s);
  return s;
}
