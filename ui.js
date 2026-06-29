// --- Show card ---
function showCard() {
  updateDifficultBtn();
  if (!deck.length) {
    $('frontWord').textContent = 'No cards';
    $('frontPhonetic').textContent = '';
    $('frontEsPhonetic').style.display = 'none';
    $('frontTone').innerHTML = '';
    $('frontToneNote').textContent = '';
    $('frontImg').style.display = 'none';
    $('backWord').textContent = '';
    $('backPhonetic').textContent = '';
    $('backEsPhonetic').style.display = 'none';
    $('backTone').innerHTML = '';
    $('backToneNote').textContent = '';
    $('backImg').style.display = 'none';
    $('phraseHint').textContent = '';
    $('progress').textContent = '0 / 0';
    $('stats').textContent = '';
    return;
  }

  var item = deck[idx];
  $('card').classList.remove('flipped');

  ['frontImg', 'backImg'].forEach(function(id) {
    var el = $(id);
    if (item.image) { el.src = item.image; el.style.display = 'block'; }
    else { el.style.display = 'none'; }
  });

  if (item.type === 'conversation') {
    $('card').classList.add('card-conv-type');
    $('cardContainer').classList.add('card-conv');
    $('cardContainer').classList.remove('card-pair');
    showConversationCard(item);
  } else if (item.type === 'pair') {
    $('card').classList.remove('card-conv-type');
    $('cardContainer').classList.add('card-conv');
    $('cardContainer').classList.add('card-pair');
    showPairCard(item);
  } else {
    $('card').classList.remove('card-conv-type');
    $('cardContainer').classList.remove('card-conv');
    $('cardContainer').classList.remove('card-pair');
    showWordPhraseCard(item);
  }

  $('progress').textContent = (idx + 1) + ' / ' + deck.length;
  updateStats();
}

function showWordPhraseCard(item) {
  var toneHtml = renderTone(item.tone, item.highlightTone);

  $('frontWord').textContent = item.thai;
  $('frontPhonetic').textContent = item.phonetic;
  $('frontPhonetic').style.display = 'block';
  if (item.es) { $('frontEsPhonetic').textContent = item.es; $('frontEsPhonetic').style.display = 'block'; }
  else { $('frontEsPhonetic').style.display = 'none'; }
  $('frontTone').innerHTML = toneHtml;
  $('frontToneNote').textContent = item.toneNote || '';

  $('backWord').innerHTML = '<div class="back-translation">' + getEn(item) + '</div>' +
    (item.type === 'phrase' ? renderWB(item.thai) : '');
  $('backPhonetic').textContent = '';
  $('backPhonetic').style.display = 'none';
  $('backEsPhonetic').style.display = 'none';
  $('backTone').innerHTML = '';
  $('backToneNote').textContent = '';

  $('phraseHint').textContent = item.type === 'phrase' ? 'Phrase' : '';
}

function showConversationCard(item) {
  var qTone = renderTone(item.q_tone, item.highlightTone);
  var aTone = renderTone(item.a_tone, item.highlightTone);

  $('frontWord').innerHTML = '<span class="qa-label">Q</span>' + item.q_thai;
  $('frontPhonetic').textContent = item.q_phonetic;
  $('frontPhonetic').style.display = 'block';
  if (item.q_es) { $('frontEsPhonetic').textContent = item.q_es; $('frontEsPhonetic').style.display = 'block'; }
  else { $('frontEsPhonetic').style.display = 'none'; }
  $('frontTone').innerHTML = qTone;
  $('frontToneNote').textContent = '';

  var backHtml = '<div class="qa-section"><span class="qa-label">Q</span>' +
    '<div class="qa-thai">' + item.q_thai + '</div>' +
    '<div class="qa-phonetic">' + item.q_phonetic + '</div>' +
    (item.q_es ? '<div class="qa-es">ES: ' + item.q_es + '</div>' : '') +
    (qTone ? '<div class="qa-tone">' + qTone + '</div>' : '') +
    '<div class="qa-wb-inline">' + renderWB(item.q_thai) + '</div>' +
    '</div>' +
    '<div class="qa-sep"></div>' +
    '<div class="qa-section"><span class="qa-label">A</span>' +
    '<div class="qa-thai">' + item.a_thai + '</div>' +
    '<div class="qa-phonetic">' + item.a_phonetic + '</div>' +
    (item.a_es ? '<div class="qa-es">ES: ' + item.a_es + '</div>' : '') +
    (aTone ? '<div class="qa-tone">' + aTone + '</div>' : '') +
    '<div class="qa-wb-inline">' + renderWB(item.a_thai) + '</div>' +
    '</div>' +
    '<div class="qa-sep"></div>' +
    '<div class="qa-section"><span class="qa-label">Translation</span>' +
    '<div class="qa-translation"><b>Q:</b> ' + (CONV_EN[item.q_thai] ? CONV_EN[item.q_thai].q : item.q_spanish) + '</div>' +
    '<div class="qa-translation"><b>A:</b> ' + (CONV_EN[item.q_thai] ? CONV_EN[item.q_thai].a : item.a_spanish) + '</div>' +
    '</div>';

  $('backWord').innerHTML = backHtml;
  $('backPhonetic').style.display = 'none';
  $('backEsPhonetic').style.display = 'none';
  $('backTone').innerHTML = '';
  $('backToneNote').textContent = '';

  $('phraseHint').textContent = 'Conversation';
}

function showPairCard(item) {
  var w1 = item.w1, w2 = item.w2;
  var t1 = renderTone(w1.tone), t2 = renderTone(w2.tone);

  var frontHtml = '<div class="pair-row">' +
    '<div class="pair-col">' +
      '<div class="pair-thai">' + w1.thai + '</div>' +
      '<div class="pair-ph">' + w1.phonetic + '</div>' +
      (w1.es ? '<div class="pair-es">ES: ' + w1.es + '</div>' : '') +
      (t1 ? '<div class="pair-tone">' + t1 + '</div>' : '') +
    '</div>' +
    '<div class="pair-vs">vs</div>' +
    '<div class="pair-col">' +
      '<div class="pair-thai">' + w2.thai + '</div>' +
      '<div class="pair-ph">' + w2.phonetic + '</div>' +
      (w2.es ? '<div class="pair-es">ES: ' + w2.es + '</div>' : '') +
      (t2 ? '<div class="pair-tone">' + t2 + '</div>' : '') +
    '</div>' +
  '</div>' +
  '<div class="pair-btns">' +
    '<button class="pair-btn" onclick="playPairWord(0, event)">▶ 1st</button>' +
    '<button class="pair-btn pair-btn-both" onclick="playPairBoth(event)">▶▶ Compare</button>' +
    '<button class="pair-btn" onclick="playPairWord(1, event)">▶ 2nd</button>' +
  '</div>';

  $('frontWord').innerHTML = frontHtml;
  $('frontPhonetic').style.display = 'none';
  $('frontEsPhonetic').style.display = 'none';
  $('frontTone').innerHTML = '';
  $('frontToneNote').textContent = '';

  var backHtml = '<div class="pair-row">' +
    '<div class="pair-col">' +
      '<div class="pair-thai">' + w1.thai + '</div>' +
      '<div class="pair-ph">' + w1.phonetic + '</div>' +
      (w1.es ? '<div class="pair-es">ES: ' + w1.es + '</div>' : '') +
      (t1 ? '<div class="pair-tone">' + t1 + '</div>' : '') +
      '<div class="pair-translation">' + w1.spanish + '</div>' +
    '</div>' +
    '<div class="pair-vs">vs</div>' +
    '<div class="pair-col">' +
      '<div class="pair-thai">' + w2.thai + '</div>' +
      '<div class="pair-ph">' + w2.phonetic + '</div>' +
      (w2.es ? '<div class="pair-es">ES: ' + w2.es + '</div>' : '') +
      (t2 ? '<div class="pair-tone">' + t2 + '</div>' : '') +
      '<div class="pair-translation">' + w2.spanish + '</div>' +
    '</div>' +
  '</div>' +
  '<div class="pair-note">' + item.note + '</div>' +
  '<div class="pair-btns">' +
    '<button class="pair-btn" onclick="playPairWord(0, event)">▶ 1st</button>' +
    '<button class="pair-btn pair-btn-both" onclick="playPairBoth(event)">▶▶ Compare</button>' +
    '<button class="pair-btn" onclick="playPairWord(1, event)">▶ 2nd</button>' +
  '</div>';

  $('backWord').innerHTML = backHtml;
  $('backPhonetic').style.display = 'none';
  $('backEsPhonetic').style.display = 'none';
  $('backTone').innerHTML = '';
  $('backToneNote').textContent = '';

  $('phraseHint').textContent = 'Tone Pair';
}

function playPairWord(which, e) {
  if (e) e.stopPropagation();
  var item = deck[idx];
  if (!item || item.type !== 'pair') return;
  var word = which === 0 ? item.w1 : item.w2;
  stopCurrentAudio();
  speakText(word.thai);
}

function playPairBoth(e) {
  if (e) e.stopPropagation();
  var item = deck[idx];
  if (!item || item.type !== 'pair') return;
  stopCurrentAudio();
  speakText(item.w1.thai, function() {
    setTimeout(function() { speakText(item.w2.thai); }, 1200);
  });
}

// --- Word-by-word translation ---
var WORD_DICT = null;
function buildWordDict() {
  if (WORD_DICT) return WORD_DICT;
  var d = {};
  DATA.words.forEach(function(w) { d[w.thai] = { ph: w.es || w.phonetic, en: THAI_EN[w.thai] || w.spanish }; });
  var extras = {
    'ไม่เป็นไร': { ph: 'mai pen rai', en: 'no worries' },
    'ห้องน้ำ': { ph: 'jong-nam', en: 'bathroom' },
    'ห้อง': { ph: 'jong', en: 'room' },
    'ไหม': { ph: 'mai', en: 'question particle' },
    'ที่': { ph: 'ti', en: 'at/in' },
    'และ': { ph: 'lae', en: 'and' },
    'หรือ': { ph: 'rue', en: 'or' },
    'กี่': { ph: 'ki', en: 'how many?' },
    'มาก': { ph: 'mak', en: 'very' },
    'คน': { ph: 'kon', en: 'person' },
    'ตัว': { ph: 'tua', en: 'classifier' },
    'จาน': { ph: 'yan', en: 'plate' },
    'แก้ว': { ph: 'keo', en: 'glass' },
    'ฟอง': { ph: 'fong', en: 'classifier' },
    'เล่ม': { ph: 'lem', en: 'classifier' },
    'อัน': { ph: 'an', en: 'classifier' },
    'นี้': { ph: 'ni', en: 'this' },
    'นั้น': { ph: 'nan', en: 'that' },
    'ดี': { ph: 'di', en: 'good' },
    'สบายดี': { ph: 'sa-bai di', en: "I'm fine" },
    'สบาย': { ph: 'sa-bai', en: 'fine' },
    'จาก': { ph: 'yak', en: 'from' },
    'เท่าไหร่': { ph: 'tao-rai', en: 'how much?' },
    'บาท': { ph: 'bat', en: 'baht' },
    'ดื่ม': { ph: 'duem', en: 'to drink' },
    'ไทย': { ph: 'tai', en: 'Thai' },
    'สเปน': { ph: 'sa-pen', en: 'Spain' },
    'เวลา': { ph: 'ui-la', en: 'time' },
    'เบอร์โทร': { ph: 'bo-to', en: 'phone' },
    'หมายเลข': { ph: 'mai-le', en: 'number' },
    'พวกเขา': { ph: 'puak kao', en: 'they' },
    'อร่อย': { ph: 'a-roi', en: 'delicious' },
    'ผัดไทย': { ph: 'pat-tai', en: 'pad thai' },
    'แม่ค้า': { ph: 'me-kha', en: 'vendor' },
    'รถเมล์': { ph: 'rot-me', en: 'bus' },
    'ดูทีวี': { ph: 'du-ti-vi', en: 'watch TV' },
    'พรุ่งนี้': { ph: 'prung-ni', en: 'tomorrow' },
    'กาแฟ': { ph: 'ga-fe', en: 'coffee' },
    'ช่วย': { ph: 'chuai', en: 'to help' },
    'เงิน': { ph: 'ngen', en: 'money' },
    'ดูแล': { ph: 'du-lae', en: 'to take care' },
    'ตลาด': { ph: 'ta-lat', en: 'market' },
    'ไหน': { ph: 'nai', en: 'which/where' },
    'ผัด': { ph: 'pat', en: 'stir-fry' },
    'นี่': { ph: 'ni', en: 'this' },
    'ยินดี': { ph: 'yin-di', en: 'glad' },
    'ดู': { ph: 'du', en: 'to look/watch' },
    'หนึ่งร้อย': { ph: 'nung roi', en: 'one hundred' },
    'หนึ่ง': { ph: 'nung', en: 'one' },
    'ร้อย': { ph: 'roi', en: 'hundred' },
    'สิบ': { ph: 'sip', en: 'ten' },
    'ยี่สิบ': { ph: 'yi-sip', en: 'twenty' },
    'ยี่': { ph: 'yi', en: 'twenty (irregular)' },
    'เก้าสิบ': { ph: 'kao-sip', en: 'ninety' },
    'พัน': { ph: 'pan', en: 'thousand' },
    'หมื่น': { ph: 'meun', en: 'ten thousand' },
    'แสน': { ph: 'saen', en: 'hundred thousand' },
    'ล้าน': { ph: 'lan', en: 'million' },
    'ตอน': { ph: 'ton', en: 'time/period' },
    'กลางวัน': { ph: 'klang-wan', en: 'midday' },
    'ตอนกลางวัน': { ph: 'ton-klang-wan', en: 'noon' },
    'ตอนบ่าย': { ph: 'ton-bai', en: 'afternoon' },
    'บ่าย': { ph: 'bai', en: 'afternoon' },
    'ปากกา': { ph: 'pa-ka', en: 'pen' },
    'วัน': { ph: 'wan', en: 'day' },
    'เมื่อวาน': { ph: 'meua-wan', en: 'yesterday' },
    'อาทิตย์': { ph: 'a-tit', en: 'Sunday' },
    'จันทร์': { ph: 'jan', en: 'Monday' },
    'นิดหน่อย': { ph: 'nit-noi', en: 'a little bit' },
    'ภาษา': { ph: 'pa-sa', en: 'language' },
    'นั่น': { ph: 'nan', en: 'that (over there)' },
    'รู้จัก': { ph: 'ru-jak', en: 'to know (someone)' },
    'ยัง': { ph: 'yang', en: 'still' },
    'ถึง': { ph: 'teung', en: 'to arrive / to reach' },
    'สุข': { ph: 'suk', en: 'happy' },
    'งาน': { ph: 'ngan', en: 'work / event' },
    // Animals & common nouns (lessons 1-12)
    'แมว': { ph: 'maeo', en: 'cat' },
    'หมา': { ph: 'maa', en: 'dog' },
    'นก': { ph: 'nok', en: 'bird' },
    'ปลา': { ph: 'bpla', en: 'fish' },
    'รถ': { ph: 'rot', en: 'car/vehicle' },
    'รถเมล์': { ph: 'rot-me', en: 'bus' },
    'บ้าน': { ph: 'ban', en: 'house/home' },
    'แม่': { ph: 'mae', en: 'mother' },
    'พ่อ': { ph: 'pho', en: 'father' },
    'พี่': { ph: 'phi', en: 'older sibling' },
    'น้อง': { ph: 'nong', en: 'younger sibling' },
    'เพื่อน': { ph: 'peuan', en: 'friend' },
    'คน': { ph: 'kon', en: 'person' },
    'ครู': { ph: 'kru', en: 'teacher' },
    'หมอ': { ph: 'mor', en: 'doctor' },
    // Places & things
    'โต๊ะ': { ph: 'to', en: 'table' },
    'เก้าอี้': { ph: 'kao-i', en: 'chair' },
    'ร้าน': { ph: 'ran', en: 'shop' },
    'ตลาด': { ph: 'ta-lat', en: 'market' },
    'ธนาคาร': { ph: 'tha-na-khan', en: 'bank' },
    'สนามบิน': { ph: 'sa-nam-bin', en: 'airport' },
    'ปั๊ม': { ph: 'pam', en: 'gas station' },
    'สะพาน': { ph: 'sa-phan', en: 'bridge' },
    'ถนน': { ph: 'tha-non', en: 'street/road' },
    'สามแยก': { ph: 'sam-yaek', en: 'three-way junction' },
    'แยก': { ph: 'yaek', en: 'intersection' },
    'ทาง': { ph: 'thang', en: 'way/side' },
    'แยกทาง': { ph: 'yaek-thang', en: 'fork in road' },
    'โรงเรียน': { ph: 'rong-rian', en: 'school' },
    'โรงแรม': { ph: 'rong-rem', en: 'hotel' },
    'โรงหนัง': { ph: 'rong-nang', en: 'cinema' },
    'โรงพยาบาล': { ph: 'rong-pha-ya-ban', en: 'hospital' },
    'ห้อง': { ph: 'hong', en: 'room' },
    'ห้องน้ำ': { ph: 'hong-nam', en: 'bathroom' },
    'ห้องครัว': { ph: 'hong-khrua', en: 'kitchen' },
    'ครัว': { ph: 'khrua', en: 'kitchen' },
    'หน้าต่าง': { ph: 'na-tang', en: 'window' },
    'ประตู': { ph: 'pra-tu', en: 'door' },
    'ของ': { ph: 'khong', en: 'thing/of' },
    'ของกิน': { ph: 'khong-gin', en: 'food/snack' },
    'ชิ้น': { ph: 'chin', en: 'piece/item' },
    'อาหาร': { ph: 'a-han', en: 'food' },
    'ข้าว': { ph: 'khao', en: 'rice/meal' },
    'ข้าวเช้า': { ph: 'khao-chao', en: 'breakfast' },
    'ข้าวเย็น': { ph: 'khao-yen', en: 'dinner' },
    'ข้าวเที่ยง': { ph: 'khao-thiang', en: 'lunch' },
    'กาแฟ': { ph: 'ga-fe', en: 'coffee' },
    'ชา': { ph: 'cha', en: 'tea' },
    'น้ำ': { ph: 'nam', en: 'water' },
    'น้ำดื่ม': { ph: 'nam-deum', en: 'drinking water' },
    'นม': { ph: 'nom', en: 'milk' },
    'เบียร์': { ph: 'bia', en: 'beer' },
    'ไฟ': { ph: 'fai', en: 'light/fire' },
    'แอร์': { ph: 'ae', en: 'AC' },
    'พัดลม': { ph: 'phat-lom', en: 'fan' },
    'โทรศัพท์': { ph: 'tho-ra-sap', en: 'telephone' },
    'มือถือ': { ph: 'mue-thue', en: 'mobile phone' },
    // Body / face (lesson 12)
    'หัว': { ph: 'hua', en: 'head' },
    'ตา': { ph: 'ta', en: 'eye(s)' },
    'จมูก': { ph: 'ja-muk', en: 'nose' },
    'ปาก': { ph: 'pak', en: 'mouth' },
    'ฟัน': { ph: 'fan', en: 'tooth/teeth' },
    'หู': { ph: 'hu', en: 'ear(s)' },
    'ใบหน้า': { ph: 'bai-na', en: 'face' },
    'หน้า': { ph: 'na', en: 'face/front' },
    'คอ': { ph: 'kho', en: 'neck' },
    'มือ': { ph: 'mue', en: 'hand' },
    'เท้า': { ph: 'thao', en: 'foot/leg' },
    'ขา': { ph: 'kha', en: 'leg' },
    'แขน': { ph: 'khaen', en: 'arm' },
    'นิ้ว': { ph: 'niu', en: 'finger' },
    'หลัง': { ph: 'lang', en: 'back' },
    'ใต้': { ph: 'tai', en: 'under/below' },
    'บน': { ph: 'bon', en: 'on/top' },
    'ข้างใต้': { ph: 'khang-tai', en: 'underneath' },
    'ซ้าย': { ph: 'sai', en: 'left' },
    'ขวา': { ph: 'khwa', en: 'right' },
    'ตรง': { ph: 'trong', en: 'straight' },
    'ตรงไป': { ph: 'trong-pai', en: 'go straight' },
    'เลี้ยว': { ph: 'liao', en: 'to turn' },
    // Common verbs
    'ต้อง': { ph: 'tong', en: 'must/have to' },
    'ล้าง': { ph: 'lang', en: 'to wash' },
    'นอน': { ph: 'non', en: 'to sleep' },
    'นั่ง': { ph: 'nang', en: 'to sit' },
    'ยืน': { ph: 'yeun', en: 'to stand' },
    'เดิน': { ph: 'doen', en: 'to walk' },
    'วิ่ง': { ph: 'wing', en: 'to run' },
    'ปวด': { ph: 'puat', en: 'to hurt/ache' },
    'ใหญ่': { ph: 'yai', en: 'big' },
    'เล็ก': { ph: 'lek', en: 'small' },
    'สูง': { ph: 'sung', en: 'tall/high' },
    'ต่ำ': { ph: 'tam', en: 'low/short' },
    'ยาว': { ph: 'yao', en: 'long' },
    'สั้น': { ph: 'san', en: 'short' },
    'ดี': { ph: 'di', en: 'good' },
    'ไม่ดี': { ph: 'mai-di', en: 'not good' },
    'ใหม่': { ph: 'mai', en: 'new' },
    'เก่า': { ph: 'kao', en: 'old (thing)' },
    'ขาว': { ph: 'khao', en: 'white' },
    'ดำ': { ph: 'dam', en: 'black' },
    'แดง': { ph: 'daeng', en: 'red' },
    'เขียว': { ph: 'khiao', en: 'green' },
    'เหลือง': { ph: 'lueang', en: 'yellow' },
    'สี': { ph: 'si', en: 'color' },
    'สีแดง': { ph: 'si-daeng', en: 'red' },
    'สีเขียว': { ph: 'si-khiao', en: 'green' },
    'สีดำ': { ph: 'si-dam', en: 'black' },
    'สีขาว': { ph: 'si-khao', en: 'white' },
    // Particles & grammar
    'นะ': { ph: 'na', en: 'softening particle' },
    'เลย': { ph: 'loei', en: 'particle (go ahead)' },
    'ไว้': { ph: 'wai', en: 'to keep/put (also particle)' },
    'ที': { ph: 'thi', en: 'time/turn (also: please)' },
    'ว่า': { ph: 'wa', en: 'that (complementizer)' },
    'ให้': { ph: 'hai', en: 'to give/let' },
    'จะ': { ph: 'ja', en: 'will/future' },
    'กำลัง': { ph: 'gam-lang', en: 'currently (-ing)' },
    'แล้ว': { ph: 'laeo', en: 'already/then' },
    'ยัง': { ph: 'yang', en: 'still/not yet' },
    'อีก': { ph: 'ik', en: 'again/more' },
    'ก็': { ph: 'ko', en: 'then/also' },
    'แต่': { ph: 'tae', en: 'but' },
    'เพราะ': { ph: 'phro', en: 'because' },
    'ถ้า': { ph: 'tha', en: 'if' },
    'มาก': { ph: 'mak', en: 'very' },
    'น้อย': { ph: 'noi', en: 'little/few' },
    'มากๆ': { ph: 'mak-mak', en: 'very much' },
    'จริงๆ': { ph: 'jing-jing', en: 'really' },
    'จริง': { ph: 'jing', en: 'true' },
    'ด้วยกัน': { ph: 'duai-kan', en: 'together' },
    'ทั้งหมด': { ph: 'thang-mod', en: 'all' },
    'ทั้งสอง': { ph: 'thang-song', en: 'both' },
    'บาง': { ph: 'bang', en: 'some' },
    'ทุก': { ph: 'thuk', en: 'every' },
    'อีกครั้ง': { ph: 'ik-khrang', en: 'again' },
    'ครั้ง': { ph: 'khrang', en: 'time/occurrence' },
    'ครบ': { ph: 'khrap', en: 'complete' },
    'เร็วๆ': { ph: 'reo-reo', en: 'quickly' },
    'เร็ว': { ph: 'reo', en: 'fast' },
    'ช้า': { ph: 'cha', en: 'slow/late' },
    'ดู': { ph: 'du', en: 'to look/watch' },
    'ฟัง': { ph: 'fang', en: 'to listen' },
    'พูด': { ph: 'phut', en: 'to speak' },
    'อ่าน': { ph: 'an', en: 'to read' },
    'เขียน': { ph: 'khian', en: 'to write' },
    // Prepositions
    'ใน': { ph: 'nai', en: 'in/inside' },
    'ที่': { ph: 'thi', en: 'at/in/on (place)' },
    'ข้าง': { ph: 'khang', en: 'side' },
    'ข้างใน': { ph: 'khang-nai', en: 'inside' },
    'ข้างนอก': { ph: 'khang-nok', en: 'outside' },
    'ข้างๆ': { ph: 'khang-khang', en: 'beside' },
    'ข้างหน้า': { ph: 'khang-na', en: 'in front of' },
    'ข้างหลัง': { ph: 'khang-lang', en: 'behind' },
    'ข้างบน': { ph: 'khang-bon', en: 'above/on top' },
    'ข้างล่าง': { ph: 'khang-lang', en: 'below/under' },
    'ตรงข้าม': { ph: 'trong-kham', en: 'opposite' },
    'ข้าม': { ph: 'kham', en: 'across' },
    'ระหว่าง': { ph: 'ra-wang', en: 'between' },
    'ก่อน': { ph: 'kon', en: 'before/first' },
    'ผ่าน': { ph: 'phan', en: 'past/through' },
    'เพื่อ': { ph: 'phua', en: 'for (purpose)' },
    'สำหรับ': { ph: 'sam-rap', en: 'for (intended)' },
    'กับ': { ph: 'kap', en: 'with' },
    'และ': { ph: 'lae', en: 'and' },
    'หรือ': { ph: 'rue', en: 'or' },
    'แมวอยู่': { ph: 'maeo yu', en: 'the cat is' },
    'เจอ': { ph: 'joe', en: 'to meet/see' },
    'บอก': { ph: 'bok', en: 'to tell/say' },
    // Useful common ones
    'อยู่': { ph: 'yu', en: 'to be at/stay' },
    'มี': { ph: 'mi', en: 'to have' },
    'เป็น': { ph: 'bpen', en: 'to be' },
    'ไม่': { ph: 'mai', en: 'no/not' },
    'ใช่': { ph: 'chai', en: 'yes (affirming)' },
    'อยาก': { ph: 'yak', en: 'to want' },
    'ชอบ': { ph: 'chop', en: 'to like' },
    'กิน': { ph: 'gin', en: 'to eat' },
    'ดื่ม': { ph: 'deum', en: 'to drink' },
    'ทำ': { ph: 'tam', en: 'to do/make' },
    'ไป': { ph: 'pai', en: 'to go' },
    'มา': { ph: 'ma', en: 'to come' },
    'เข้า': { ph: 'khao', en: 'to enter' },
    'ออก': { ph: 'ok', en: 'to exit/out' },
    'ปิด': { ph: 'pit', en: 'to close/turn off' },
    'เปิด': { ph: 'poet', en: 'to open/turn on' },
    'ผม': { ph: 'phom', en: 'I (male)' },
    'ฉัน': { ph: 'chan', en: 'I (informal)' },
    'คุณ': { ph: 'khun', en: 'you' },
    'เขา': { ph: 'khao', en: 'he/she' },
    'เรา': { ph: 'rao', en: 'we' },
    'พวกเขา': { ph: 'puak-khao', en: 'they' },
    'ใคร': { ph: 'khrai', en: 'who?' },
    'อะไร': { ph: 'a-rai', en: 'what?' },
    'ที่ไหน': { ph: 'thi-nai', en: 'where?' },
    'ไหน': { ph: 'nai', en: 'which/where' },
    'กี่': { ph: 'ki', en: 'how many?' },
    'เท่าไหร่': { ph: 'thao-rai', en: 'how much?' },
    'เมื่อไหร่': { ph: 'muea-rai', en: 'when?' },
    'ทำไม': { ph: 'tham-mai', en: 'why?' },
    'อย่างไร': { ph: 'yang-rai', en: 'how?' }
  };
  Object.keys(extras).forEach(function(k) { if (!d[k]) d[k] = extras[k]; });
  WORD_DICT = d;
  return d;
}

function translateWords(thaiStr) {
  var dict = buildWordDict();
  var keys = Object.keys(dict).sort(function(a, b) { return b.length - a.length; });
  var result = [];
  var i = 0;
  while (i < thaiStr.length) {
    var ch = thaiStr.charCodeAt(i);
    if (thaiStr[i] === ' ' || thaiStr[i] === '.' || thaiStr[i] === ',' ||
        thaiStr[i] === '!' || thaiStr[i] === '?' || thaiStr[i] === '…' ||
        (ch >= 0x0041 && ch <= 0x007A)) { i++; continue; }
    var found = false;
    for (var k = 0; k < keys.length; k++) {
      if (thaiStr.indexOf(keys[k], i) === i) {
        result.push({ thai: keys[k], ph: dict[keys[k]].ph, en: dict[keys[k]].en });
        i += keys[k].length;
        found = true;
        break;
      }
    }
    if (!found) { i++; }
  }
  return result;
}

function renderWB(thaiStr) {
  var words = translateWords(thaiStr);
  if (!words.length) return '';
  return '<div class="wb">' +
    words.map(function(w) {
      return '<span class="wb-i"><span class="wb-t">' + w.thai + '</span><span class="wb-ph">' + w.ph + '</span><span class="wb-s">' + w.en + '</span></span>';
    }).join('') + '</div>';
}
