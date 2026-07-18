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
  // --- Top 1000 decks (nested under Top 1000 → Estudiar) ---
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
  },

  // --- Lessons decks (top-level Estudiar mode) ---
  // Schema comes from DATA.* — words/phrases have {thai, phonetic, es, tone, spanish, en, category, lesson}.
  // Questions are Q&A pairs derived from DATA.conversations ({q_thai, q_es, q_spanish, a_thai, a_es, a_spanish, lesson}).
  'lec-palabras': {
    key: 'lec-palabras',
    label: 'Palabras (lecciones)',
    icon: '📘',
    source: function() { return (typeof DATA !== 'undefined' && DATA.words) ? DATA.words : []; },
    idOf: function(c) { return c.thai; },
    kind: 'lesson-word'
  },
  'lec-frases': {
    key: 'lec-frases',
    label: 'Frases (lecciones)',
    icon: '📗',
    source: function() { return (typeof DATA !== 'undefined' && DATA.phrases) ? DATA.phrases : []; },
    idOf: function(c) { return c.thai; },
    kind: 'lesson-phrase'
  },
  'lec-preguntas': {
    key: 'lec-preguntas',
    label: 'Preguntas (lecciones)',
    icon: '❓',
    source: function() {
      if (typeof DATA === 'undefined' || !DATA.conversations) return [];
      var showUnverified = (typeof SHOW_UNVERIFIED !== 'undefined') ? SHOW_UNVERIFIED : false;
      return showUnverified ? DATA.conversations : DATA.conversations.filter(function(c) { return c.verified !== false; });
    },
    idOf: function(c) { return (c.q_thai || '') + '||' + (c.a_thai || ''); },
    kind: 'lesson-question'
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
  return {
    palabras: {}, estructuras: {}, frases: {},
    'lec-palabras': {}, 'lec-frases': {}, 'lec-preguntas': {}
  };
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

// --- Engine dispatch ---
// rating: 1=Again, 2=Hard, 3=Good, 4=Easy (matches FSRS.Rating exactly)
// FSRS (ts-fsrs v5.4.1) loads async from CDN as window.FSRS. When available,
// it's the default engine. SM-2 is the fallback for offline / CDN failure /
// runtime errors so the app always works.

var FSRS_SCHEDULER = null;
var FSRS_TRIED = false;

function getFsrsScheduler() {
  if (FSRS_TRIED) return FSRS_SCHEDULER;
  FSRS_TRIED = true;
  if (typeof FSRS === 'undefined') return null;
  try {
    FSRS_SCHEDULER = FSRS.fsrs(FSRS.generatorParameters({}));
    console.info('[srs] FSRS engine active (ts-fsrs)');
    return FSRS_SCHEDULER;
  } catch (e) {
    console.warn('[srs] FSRS init failed, using SM-2:', e);
    return null;
  }
}

// My state shape → FSRS Card. Tolerates legacy SM-2 data by approximating
// stability from ivl and difficulty from ef (one-time soft migration).
function toFsrsCard(prevState, now) {
  var card = FSRS.createEmptyCard(new Date(now * 1000));
  if (!prevState || prevState.state === 'new') return card;
  card.stability = prevState.s !== undefined
    ? prevState.s
    : Math.max(0.4, prevState.ivl || 1);
  card.difficulty = prevState.d !== undefined
    ? prevState.d
    : Math.min(10, Math.max(1, 10 - (prevState.ef || 2.5) * 3 + 5));
  card.elapsed_days = prevState.elapsedDays || 0;
  card.scheduled_days = prevState.scheduledDays || prevState.ivl || 0;
  card.reps = prevState.reps || 0;
  card.lapses = prevState.lapses || 0;
  card.state = prevState.state === 'learn' ? FSRS.State.Learning : FSRS.State.Review;
  card.due = new Date((prevState.due || now) * 1000);
  if (prevState.lastReview) card.last_review = new Date(prevState.lastReview * 1000);
  return card;
}

// FSRS Card → my state shape. FSRS Relearning collapses to 'learn' so the
// existing UI / session reinsertion logic keeps working without changes.
function fromFsrsCard(card, prevEf, now) {
  var stateStr = 'review';
  if (card.state === FSRS.State.New) stateStr = 'new';
  else if (card.state === FSRS.State.Learning || card.state === FSRS.State.Relearning) stateStr = 'learn';
  var dueSec = Math.floor(new Date(card.due).getTime() / 1000);
  return {
    engine: 'fsrs',
    ef: prevEf || 2.5, // retained for display compat; FSRS ignores it
    ivl: card.scheduled_days || Math.max(0.01, (dueSec - now) / SRS_DAY_SEC),
    due: dueSec,
    reps: card.reps,
    lapses: card.lapses,
    state: stateStr,
    s: card.stability,
    d: card.difficulty,
    lastReview: now,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days
  };
}

function scheduleNextFSRS(prevState, rating, now, scheduler) {
  var card = toFsrsCard(prevState, now);
  var result = scheduler.next(card, new Date(now * 1000), rating);
  return fromFsrsCard(result.card, prevState && prevState.ef, now);
}

function scheduleNext(prevState, rating, now) {
  now = now || Math.floor(Date.now() / 1000);
  var scheduler = getFsrsScheduler();
  if (scheduler) {
    try { return scheduleNextFSRS(prevState, rating, now, scheduler); }
    catch (e) { console.warn('[srs] FSRS scheduling failed, falling back to SM-2:', e); }
  }
  return scheduleNextSM2(prevState, rating, now);
}

// --- SM-2 scheduling (fallback engine) ---
// rating: 1=Again, 2=Hard, 3=Good, 4=Easy
function scheduleNextSM2(prevState, rating, now) {
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


// Lookup a card by its thai string across decks that have a top-level `thai` field
// (palabras, frases). Returns { deckKey, cardId } or null. Used by Cards mode
// to feed SRS ratings without a hard dependency on the Cards-mode card shape.
// Lookup a card by its thai string across decks that have a top-level `thai` field.
// Returns { deckKey, cardId } or null. Used by Cards mode to feed SRS ratings
// without a hard dependency on the Cards-mode card shape.
// Preference order: lesson decks first (cards-mode content is lesson-based),
// then Top 1000 decks as a fallback.
function findSrsCardByThai(thai) {
  if (!thai || typeof SRS_DECKS === 'undefined') return null;
  var deckKeys = ['lec-palabras', 'lec-frases', 'palabras', 'frases'];
  for (var i = 0; i < deckKeys.length; i++) {
    var dk = deckKeys[i];
    var deck = SRS_DECKS[dk];
    if (!deck) continue;
    var src = deck.source();
    for (var j = 0; j < src.length; j++) {
      if (src[j].thai === thai) return { deckKey: dk, cardId: deck.idOf(src[j]) };
    }
  }
  return null;
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
