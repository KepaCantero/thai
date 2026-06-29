var currentAudio = null, audioLoading = false;
var kanyaVoice = null;

function pickThaiVoice(voices) {
  if (!voices || !voices.length) return null;
  for (var i = 0; i < voices.length; i++) {
    var n = (voices[i].name || '').toLowerCase();
    if (n.indexOf('kanya') !== -1) return voices[i];
  }
  for (var i = 0; i < voices.length; i++) {
    var l = voices[i].lang || '';
    if (l.toLowerCase().indexOf('th') === 0) return voices[i];
  }
  for (var i = 0; i < voices.length; i++) {
    var l = voices[i].lang || '';
    if (l.toLowerCase().indexOf('th-th') !== -1) return voices[i];
  }
  return null;
}

function loadKanya() {
  var voices = speechSynthesis.getVoices();
  kanyaVoice = pickThaiVoice(voices);
  if (!kanyaVoice) {
    console.warn('[audio] No Thai voice found in', voices.length, 'voices. Run listTtsVoices() to inspect.');
  } else {
    console.log('[audio] Thai voice selected:', kanyaVoice.name, '| lang=', kanyaVoice.lang);
  }
}
if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadKanya;
loadKanya();

window.listTtsVoices = function() {
  var voices = speechSynthesis.getVoices();
  var thai = voices.filter(function(v){ return (v.lang||'').toLowerCase().indexOf('th') === 0; });
  console.table(voices.map(function(v){ return { name: v.name, lang: v.lang, default: v.default }; }));
  console.log('Thai voices visible to browser:', thai.length);
  return thai;
};

// Sync dropdown with current engine on load
document.addEventListener('DOMContentLoaded', function() {
  var sel = document.getElementById('ttsSelect');
  if (sel) sel.value = AUDIO_ENGINE;
});

// Audio engine selector: 'static' (pre-generated mp3) | 'kanya' (OS voice) | 'google'
var AUDIO_ENGINE = 'static';
try {
  // One-time migration: previous default was 'kanya' which silently fails in Chrome.
  // Bump users to 'static' once; their subsequent choices are respected.
  if (localStorage.getItem('ttsEngineVersion') !== '2') {
    AUDIO_ENGINE = 'static';
    localStorage.setItem('ttsEngine', 'static');
    localStorage.setItem('ttsEngineVersion', '2');
  } else {
    var savedEngine = localStorage.getItem('ttsEngine');
    if (savedEngine && ['static','kanya','google'].indexOf(savedEngine) !== -1) {
      AUDIO_ENGINE = savedEngine;
    }
  }
} catch (e) {}

function setTtsEngine(engine) {
  if (['static','kanya','google'].indexOf(engine) === -1) return;
  AUDIO_ENGINE = engine;
  try { localStorage.setItem('ttsEngine', engine); } catch (e) {}
  var sel = document.getElementById('ttsSelect');
  if (sel) sel.value = engine;
}

function getAudioText(item) {
  if (item.type === 'conversation') {
    return item.q_thai + ' ... ' + item.a_thai;
  }
  if (item.type === 'pair') {
    return item.w1.thai + ' ... ' + item.w2.thai;
  }
  return item.thai;
}

function stopCurrentAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  speechSynthesis.cancel();
}

function speakGoogle(text, onDone) {
  var thai = encodeURIComponent(text);
  var audio = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=' + thai);
  currentAudio = audio;
  audio.oncanplaythrough = function() { audio.play(); };
  audio.onended = function() { if (onDone) onDone(); };
  audio.onerror = function() { if (onDone) onDone(); };
  audio.load();
}

function speakStatic(text, onDone) {
  if (typeof AUDIO_MANIFEST === 'undefined' || !AUDIO_MANIFEST) return false;
  // Handle compound strings from getAudioText (e.g. "q_thai ... a_thai")
  var parts = text.split(' ... ');
  if (parts.length > 1) {
    return speakStaticSequence(parts, onDone);
  }
  return speakStaticSingle(text, onDone);
}

function speakStaticSingle(text, onDone) {
  var id = AUDIO_MANIFEST[text];
  if (!id) {
    console.warn('[audio] static: no entry for', JSON.stringify(text));
    return false;
  }
  var audio = new Audio('audio/' + id + '.mp3');
  currentAudio = audio;
  audio.oncanplaythrough = function() { audio.play(); };
  audio.onended = function() { if (onDone) onDone(); };
  audio.onerror = function(e) {
    console.error('[audio] static error', id, e);
    if (onDone) onDone();
  };
  audio.load();
  return true;
}

function speakStaticSequence(texts, onDone) {
  var i = 0;
  function playNext() {
    if (i >= texts.length) { if (onDone) onDone(); return; }
    var t = texts[i++];
    if (!speakStaticSingle(t, playNext)) {
      console.warn('[audio] static miss in sequence:', t);
      playNext();
    }
  }
  playNext();
  return true;
}

function speakKanya(text, onDone) {
  if (!kanyaVoice) loadKanya();
  if (!kanyaVoice) {
    console.warn('[audio] speakKanya: no Thai voice available. Falling back.');
    return false;
  }
  var u = new SpeechSynthesisUtterance(text);
  u.voice = kanyaVoice;
  u.lang = kanyaVoice.lang || 'th-TH';
  u.rate = 0.85;
  u.pitch = 1;
  u.volume = 1;
  u.onstart = function() { console.log('[audio] Kanya speaking:', text); };
  u.onend = function() { if (onDone) onDone(); };
  u.onerror = function(e) { console.error('[audio] Kanya error:', e); if (onDone) onDone(); };
  speechSynthesis.cancel();
  try { speechSynthesis.speak(u); } catch (e) { console.error(e); return false; }
  return true;
}

function speakText(text, onDone) {
  if (AUDIO_ENGINE === 'static') {
    if (speakStatic(text, onDone)) return;
    console.warn('[audio] static miss, falling through. Text:', text);
  }
  if (AUDIO_ENGINE === 'kanya') {
    if (speakKanya(text, onDone)) return;
  }
  speakGoogle(text, onDone);
}

function playAudio() {
  if (!deck.length || audioLoading) return;
  var item = deck[idx];
  var btn = $('playBtn');
  btn.disabled = true;
  btn.textContent = '⏳';
  audioLoading = true;

  stopCurrentAudio();

  var text = getAudioText(item);
  speakText(text, function() {
    btn.disabled = false;
    btn.textContent = '▶ Audio';
    audioLoading = false;
  });
}

function playAudioItem(item, onDone) {
  stopCurrentAudio();
  var text = getAudioText(item);
  speakText(text, onDone);
}
