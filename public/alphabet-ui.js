// Alphabet section — render the 20 consonants
// Depends on: ALPHABET_CONSONANTS (alphabet.js), speakText (audio.js)

var ALPHA_MN_MODES = [
  { id: 'visual', label: 'Visual' },
  { id: 'full',   label: 'Completo' },
  { id: 'story',  label: 'Historia' }
];
var alphaMnMode = (function() {
  try { return localStorage.getItem('thai_alpha_mn_mode') || 'visual'; }
  catch (e) { return 'visual'; }
})();

function setAlphaMode(mode) {
  if (mode === alphaMnMode) return;
  alphaMnMode = mode;
  try { localStorage.setItem('thai_alpha_mn_mode', mode); } catch (e) {}
  renderAlphabetView();
}

function renderAlphabetView() {
  var el = document.getElementById('alphabetView');
  if (!el) return;
  el.innerHTML = '<div class="alpha-wrap">' + renderAlphabet() + '</div>';
}

function renderAlphabet() {
  var chips = ALPHA_MN_MODES.map(function(m) {
    return '<button class="alpha-chip' + (m.id === alphaMnMode ? ' active' : '') +
      '" onclick="setAlphaMode(\'' + m.id + '\')">MN: ' + m.label + '</button>';
  }).join('');
  var hintByMode = {
    visual: 'Visual — ancla la forma de la letra a la palabra thai',
    full:   'Completo — forma + sonido + clase (alta/media/baja)',
    story:  'Historia — mini-escena tipo memoria-palacio'
  };
  var cards = ALPHABET_CONSONANTS.map(renderAlphaCard).join('');
  return '<div class="alpha-hint">Click ▶ para escuchar · nemotecnia: "as in [sound] [palabra] ([significado])"</div>' +
    '<div class="alpha-chips">' + chips + '</div>' +
    '<div class="alpha-hint">' + (hintByMode[alphaMnMode] || '') + '</div>' +
    '<div class="alpha-grid alpha-mn-' + alphaMnMode + '">' + cards + '</div>';
}

function classLabel(cls) {
  return { high: 'HIGH', mid: 'MID', low: 'LOW' }[cls] || cls.toUpperCase();
}

function renderAlphaCard(c) {
  function q(s) { return (s||'').replace(/'/g, "\\'"); }
  var mn = (c.mnemonic && c.mnemonic[alphaMnMode]) ? c.mnemonic[alphaMnMode] : '';
  return '<div class="alpha-card alpha-cls-' + c.cls + (c.obsolete ? ' alpha-obsolete' : '') + '">' +
    '<div class="alpha-rank">#' + c.i + '</div>' +
    '<div class="alpha-class ' + c.cls + '">' + classLabel(c.cls) + '</div>' +
    '<div class="alpha-thai-row">' +
      (c.emoji ? '<div class="alpha-emoji">' + c.emoji + '</div>' : '') +
      '<div class="alpha-thai">' + c.thai + '</div>' +
      '<button class="alpha-play" onclick="event.stopPropagation();speakText(\'' + q(c.soundLike) + '\')" title="Reproducir sonido">▶</button>' +
    '</div>' +
    '<div class="alpha-sound">' + c.sound + '</div>' +
    '<div class="alpha-mnemonic">as in <b>' + c.soundLike + '</b> ' + c.word.thai + ' (' + c.word.en + ')' +
      (c.obsolete ? ' <span class="alpha-obs">[obsolete]</span>' : '') +
    '</div>' +
    (mn ? '<div class="alpha-trick"><span class="alpha-trick-label">MN[' + alphaMnMode + ']:</span> ' + mn + '</div>' : '') +
  '</div>';
}
