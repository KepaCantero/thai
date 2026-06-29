var PRONOUNS = [
  { thai: "ฉัน", phonetic: "chǎn", es: "chan", en: "I" },
  { thai: "ผม", phonetic: "phǒm", es: "pom", en: "I (m)" },
  { thai: "คุณ", phonetic: "khun", es: "kun", en: "you" },
  { thai: "เรา", phonetic: "rao", es: "rao", en: "we" },
  { thai: "เขา", phonetic: "khǎo", es: "kǎo", en: "he/she" },
  { thai: "พวกคุณ", phonetic: "phǔuak khun", es: "puak-kun", en: "you (pl)" },
  { thai: "พวกเขา", phonetic: "phǔuak khǎo", es: "puak-kao", en: "they" }
];
var PRONOUNS_NO_PLURAL1 = PRONOUNS.filter(function(p) { return p.thai !== 'พวกคุณ'; });

const DATA = {
  words: [
    { thai: "ฉัน", phonetic: "chǎn", es: "chǎn", tone: "r", spanish: "I (informal)", category: "pronombres", en: "I (informal)" },
    { thai: "ผม", phonetic: "phǒm", es: "pǒm", tone: "r", toneNote: "hablado: Ascendente / lectura: Alto; la 'r' casi no suena, la 'p' final no se suelta (se cierran los labios)", spanish: "I (male)", category: "pronombres", en: "I (male)" },
    { thai: "คุณ", phonetic: "khun", es: "kun", tone: "m", spanish: "you", category: "pronombres", en: "you" },
    { thai: "เรา", phonetic: "rao", es: "rao", tone: "m", spanish: "we", category: "pronombres", en: "we" },
    { thai: "เขา", phonetic: "khǎo", es: "kǎo", tone: "r", spanish: "he / she", category: "pronombres", en: "he / she" },

    { thai: "สวัสดี", phonetic: "sà-wàt-dee", es: "sà-uàt-di", tone: "l-l-m", spanish: "hello / goodbye", category: "saludos", en: "hello / goodbye" },
    { thai: "ครับ", phonetic: "khráp", es: "kráp", tone: "h", toneNote: "la 'r' casi no suena; la 'p' final se corta sin soltar aire", spanish: "yes (male particle)", category: "saludos", en: "yes (male particle)" },
    { thai: "ค่ะ", phonetic: "khâ", es: "kâ", tone: "f", spanish: "polite particle (female)", category: "saludos", en: "polite particle (female)" },
    { thai: "ขอบคุณ", phonetic: "khòp-khun", es: "kòp-kun", tone: "l-m", spanish: "thank you", category: "saludos", en: "thank you" },
    { thai: "ขอโทษ", phonetic: "khǎaw-thôot", es: "kǒ-tôt", tone: "r-f", spanish: "sorry / excuse me", category: "saludos", en: "sorry / excuse me" },

    { thai: "กิน", phonetic: "gin", es: "guin", tone: "m", spanish: "to eat", category: "verbos", en: "to eat" },
    { thai: "กินข้าว", phonetic: "gin-khâaw", es: "guin-kâo", tone: "m-f", spanish: "to eat (rice/food)", category: "verbos", en: "to eat (rice/food)" },
    { thai: "อร่อย", phonetic: "à-rôi", es: "à-rôi", tone: "l-f", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=180&h=180&fit=crop&auto=format", spanish: "delicious", category: "sabores", en: "delicious" },
    { thai: "ไม่", phonetic: "mâi", es: "mâi", tone: "f", spanish: "no / not", category: "verbos", en: "no / not" },
    { thai: "ใช่", phonetic: "châi", es: "châi", tone: "f", spanish: "yes (affirmation)", category: "verbos", en: "yes (affirmation)" },
    { thai: "อยาก", phonetic: "yàak", es: "yàk", tone: "l", spanish: "to want", category: "verbos", en: "to want" },
    { thai: "ชอบ", phonetic: "chôop", es: "chôp", tone: "f", spanish: "to like / to prefer", category: "verbos", en: "to like / to prefer" },
    { thai: "มี", phonetic: "mee", es: "mi", tone: "m", spanish: "to have / there is", category: "verbos", en: "to have / there is" },
    { thai: "เป็น", phonetic: "pen", es: "bpen", tone: "m", spanish: "to be", category: "verbos", en: "to be" },
    { thai: "จะ", phonetic: "jà", es: "chà", tone: "l", toneNote: "se usa antes de verbos: voy a / quiero ir", spanish: "will / going to (future)", category: "verbos", en: "will / going to (future)" },
    { thai: "เอา", phonetic: "ao", es: "ao", tone: "m", toneNote: "se usa para cosas: quiero pad thai, dame...", spanish: "to want / to take (things)", category: "verbos", en: "to want / to take (things)" },
    { thai: "มา", phonetic: "maa", es: "ma", tone: "m", spanish: "to come", category: "verbos", en: "to come" },
    { thai: "ไป", phonetic: "bpai", es: "bpai", tone: "m", spanish: "to go", category: "verbos", en: "to go" },

    { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", tone: "m-r", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=180&h=180&fit=crop&auto=format", spanish: "food", category: "comida", en: "food" },
    { thai: "ข้าว", phonetic: "khâaw", es: "kâo", tone: "f", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=180&h=180&fit=crop&auto=format", spanish: "rice", category: "comida", en: "rice" },
    { thai: "ไก่", phonetic: "gài", es: "gài", tone: "l", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=180&h=180&fit=crop&auto=format", spanish: "chicken", category: "comida", en: "chicken" },
    { thai: "ไข่", phonetic: "khài", es: "kài", tone: "l", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=180&h=180&fit=crop&auto=format", spanish: "egg", category: "comida", en: "egg" },
    { thai: "หมู", phonetic: "mǔu", es: "mǔ", tone: "r", image: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=180&h=180&fit=crop&auto=format", spanish: "pork", category: "comida", en: "pork" },
    { thai: "เนื้อ", phonetic: "núea", es: "ñúa", tone: "h", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=180&h=180&fit=crop&auto=format", spanish: "beef", category: "comida", en: "beef" },
    { thai: "ปลา", phonetic: "plaa", es: "bpla", tone: "m", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=180&h=180&fit=crop&auto=format", spanish: "fish", category: "comida", en: "fish" },
    { thai: "ผัก", phonetic: "phàk", es: "pàk", tone: "l", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=180&h=180&fit=crop&auto=format", spanish: "vegetables", category: "comida", en: "vegetables" },
    { thai: "ผลไม้", phonetic: "phǒn-lá-mái", es: "pǒn-lá-mái", tone: "r-h-h", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=180&h=180&fit=crop&auto=format", spanish: "fruit", category: "comida", en: "fruit" },
    { thai: "ผัดไทย", phonetic: "phàt-thai", es: "pàt-tai", tone: "l-m", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=180&h=180&fit=crop&auto=format", spanish: "pad thai", category: "comida", en: "pad thai" },
    { thai: "น้ำ", phonetic: "náam", es: "nám", tone: "h", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=180&h=180&fit=crop&auto=format", spanish: "water", category: "comida", en: "water" },

    { thai: "เผ็ด", phonetic: "phèt", es: "bpèt", tone: "l", image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=180&h=180&fit=crop&auto=format", spanish: "spicy", category: "sabores", en: "spicy" },
    { thai: "หวาน", phonetic: "waan", es: "uǎn", tone: "r", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=180&h=180&fit=crop&auto=format", spanish: "sweet", category: "sabores", en: "sweet" },
    { thai: "เค็ม", phonetic: "khem", es: "kem", tone: "m", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=180&h=180&fit=crop&auto=format", spanish: "salty", category: "sabores", en: "salty" },
    { thai: "เปรี้ยว", phonetic: "prîao", es: "bprîao", tone: "f", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=180&h=180&fit=crop&auto=format", spanish: "sour", category: "sabores", en: "sour" },
    { thai: "ร้อน", phonetic: "râwn", es: "rôn", tone: "f", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=180&h=180&fit=crop&auto=format", spanish: "hot", category: "sabores", en: "hot" },
    { thai: "เย็น", phonetic: "yen", es: "ien", tone: "m", image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=180&h=180&fit=crop&auto=format", spanish: "cold", category: "sabores", en: "cold" },

    { thai: "หนึ่ง", phonetic: "nùeng", es: "nùng", tone: "l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "one (1)", category: "números", lesson: 6, en: "one (1)" },
    { thai: "สอง", phonetic: "sǎawng", es: "sǒng", tone: "r", image: "https://images.unsplash.com/photo-1701395545526-ab40aab52ac1?w=180&h=180&fit=crop&auto=format", spanish: "two (2)", category: "números", lesson: 6, en: "two (2)" },
    { thai: "สาม", phonetic: "sǎam", es: "sǎm", tone: "r", image: "https://images.unsplash.com/photo-1513612254505-fb553147a2e8?w=180&h=180&fit=crop&auto=format", spanish: "three (3)", category: "números", lesson: 6, en: "three (3)" },
    { thai: "สี่", phonetic: "sìi", es: "sì", tone: "l", image: "https://images.unsplash.com/photo-1719384980808-0f3b833a2468?w=180&h=180&fit=crop&auto=format", spanish: "four (4)", category: "números", lesson: 6, en: "four (4)" },
    { thai: "ห้า", phonetic: "hâa", es: "jâ", tone: "f", image: "https://images.unsplash.com/photo-1542990254-85e6a9a2ef92?w=180&h=180&fit=crop&auto=format", spanish: "five (5)", category: "números", lesson: 6, en: "five (5)" },
    { thai: "หก", phonetic: "hòk", es: "jòk", tone: "l", image: "https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=180&h=180&fit=crop&auto=format", spanish: "six (6)", category: "números", lesson: 6, en: "six (6)" },
    { thai: "เจ็ด", phonetic: "jèt", es: "chèt", tone: "l", image: "https://images.unsplash.com/photo-1555526148-0fa555bb2e78?w=180&h=180&fit=crop&auto=format", spanish: "seven (7)", category: "números", lesson: 6, en: "seven (7)" },
    { thai: "แปด", phonetic: "pàaet", es: "bpèt", tone: "l", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=180&h=180&fit=crop&auto=format", spanish: "eight (8)", category: "números", lesson: 6, en: "eight (8)" },
    { thai: "เก้า", phonetic: "kâao", es: "kâo", tone: "f", image: "https://images.unsplash.com/photo-1558745010-d2a3c21762ab?w=180&h=180&fit=crop&auto=format", spanish: "nine (9)", category: "números", lesson: 6, en: "nine (9)" },
    { thai: "สิบ", phonetic: "sìp", es: "sìp", tone: "l", image: "https://images.unsplash.com/photo-1728660509598-b7b2a2563929?w=180&h=180&fit=crop&auto=format", spanish: "ten (10)", category: "números", lesson: 6, en: "ten (10)" },

    { thai: "ร้านอาหาร", phonetic: "ráan-aa-hǎan", es: "rán-a-jǎn", tone: "h-m-r", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=180&h=180&fit=crop&auto=format", spanish: "restaurant", category: "tiendas", lesson: 2, en: "restaurant" },
    { thai: "ร้านกาแฟ", phonetic: "ráan-gaa-faa", es: "rán-ga-fa", tone: "h-m-m", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=180&h=180&fit=crop&auto=format", spanish: "cafe", category: "tiendas", lesson: 2, en: "cafe" },
    { thai: "ร้านชา", phonetic: "ráan-chaa", es: "rán-cha", tone: "h-m", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=180&h=180&fit=crop&auto=format", spanish: "tea house", category: "tiendas", lesson: 2, en: "tea house" },
    { thai: "ร้านขายยา", phonetic: "ráan-khǎai-yaa", es: "rán-kǎi-ya", tone: "h-r-m", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=180&h=180&fit=crop&auto=format", spanish: "pharmacy", category: "tiendas", lesson: 2, en: "pharmacy" },
    { thai: "ร้านสะดวกซื้อ", phonetic: "ráan-sà-dùuak-súea", es: "rán-sà-dùak-súa", tone: "h-l-l-h", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=180&h=180&fit=crop&auto=format", spanish: "convenience store", category: "tiendas", lesson: 2, en: "convenience store" },
    { thai: "ร้านหนังสือ", phonetic: "ráan-nǎng-sǔeu", es: "rán-nǎng-sǔe", tone: "h-r-r", image: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=180&h=180&fit=crop&auto=format", spanish: "bookstore", category: "tiendas", lesson: 2, en: "bookstore" },
    { thai: "โรง", phonetic: "roong", es: "rong", tone: "m", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=180&h=180&fit=crop&auto=format", spanish: "building / hall", category: "tiendas", lesson: 2, en: "building / hall" },
    { thai: "โรงเรียน", phonetic: "roong-riian", es: "rong-rian", tone: "m-m", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=180&h=180&fit=crop&auto=format", spanish: "school", category: "tiendas", lesson: 2, en: "school" },
    { thai: "โรงพยาบาล", phonetic: "roong-phaa-baan", es: "rong-pa-ya-ban", tone: "m-m-m", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0a?w=180&h=180&fit=crop&auto=format", spanish: "hospital", category: "tiendas", lesson: 2, en: "hospital" },
    { thai: "โรงแรม", phonetic: "roong-raem", es: "rong-rem", tone: "m-m", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=180&h=180&fit=crop&auto=format", spanish: "hotel", category: "tiendas", lesson: 2, en: "hotel" },
    { thai: "โรงหนัง", phonetic: "roong-nǎng", es: "rong-nǎng", tone: "m-r", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=180&h=180&fit=crop&auto=format", spanish: "cinema", category: "tiendas", lesson: 2, en: "cinema" },

    // Lección 2 - Verbos y preguntas
    { thai: "อยู่", phonetic: "yùu", es: "iù", tone: "l", spanish: "to be / to stay", category: "verbos", lesson: 2, en: "to be at / live" },
    { thai: "ที่ไหน", phonetic: "thîi-nǎi", es: "tî-nǎi", tone: "f-r", spanish: "where?", category: "preguntas", lesson: 2, en: "where?" },
    { thai: "อะไร", phonetic: "a-rai", es: "à-rai", tone: "l-m", spanish: "what?", category: "preguntas", lesson: 2, en: "what?" },
    { thai: "หนังสือ", phonetic: "nǎng-sǔeu", es: "nǎng-sǔe", tone: "r-r", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=180&h=180&fit=crop&auto=format", spanish: "book", category: "sustantivos", lesson: 2, en: "book" },

    // Lesson 3 - New verbs
    { thai: "ทำ", phonetic: "tam", es: "tam", tone: "m", spanish: "to do / to make", category: "verbos", lesson: 3, en: "to do / to make" },
    { thai: "งาน", phonetic: "ngaan", es: "ngan", tone: "m", image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=180&h=180&fit=crop&auto=format", spanish: "work", category: "sustantivos", lesson: 3, en: "work" },
    { thai: "ทำงาน", phonetic: "tam-ngaan", es: "tam-ngan", tone: "m-m", spanish: "to work", category: "verbos", lesson: 3, en: "to work" },
    { thai: "ทำอาหาร", phonetic: "tam-aa-hǎan", es: "tam-a-jǎn", tone: "m-m-r", spanish: "to cook", category: "verbos", lesson: 3, en: "to cook" },
    { thai: "พูด", phonetic: "phûut", es: "pût", tone: "f", spanish: "to speak", category: "verbos", lesson: 3, en: "to speak" },
    { thai: "ฟัง", phonetic: "fang", es: "fang", tone: "m", spanish: "to listen", category: "verbos", lesson: 3, en: "to listen" },
    { thai: "ได้", phonetic: "dâi", es: "dâi", tone: "f", spanish: "can / to be able to receive", category: "verbos", lesson: 3, en: "can / to be able to" },
    { thai: "สอน", phonetic: "sɔ̌ɔn", es: "sǒn", tone: "r", spanish: "to teach", category: "verbos", lesson: 3, en: "to teach" },
    { thai: "ครู", phonetic: "khruu", es: "kru", tone: "m", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=180&h=180&fit=crop&auto=format", spanish: "teacher", category: "sustantivos", lesson: 3, en: "teacher" },
    { thai: "ได้รับ", phonetic: "dâi-ráp", es: "dâi-ráp", tone: "f-h", spanish: "to receive", category: "verbos", lesson: 3, en: "to receive" },
    { thai: "ไหม", phonetic: "măi", es: "mǎi", tone: "r", spanish: "question particle", category: "verbos", lesson: 3, en: "question particle" },

    // Tone minimal pairs
    { thai: "ขาว", phonetic: "khǎao", es: "kǎo", tone: "r", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=180&h=180&fit=crop&auto=format", spanish: "white", category: "sabores", lesson: 3, en: "white" },
    { thai: "เข่า", phonetic: "khào", es: "kào", tone: "l", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=180&h=180&fit=crop&auto=format", spanish: "knee", category: "sustantivos", lesson: 3, en: "knee" },
    { thai: "ม้า", phonetic: "máa", es: "má", tone: "h", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=180&h=180&fit=crop&auto=format", spanish: "horse", category: "sustantivos", lesson: 3, en: "horse" },
    { thai: "ไกล", phonetic: "glai", es: "glai", tone: "m", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=180&h=180&fit=crop&auto=format", spanish: "far", category: "sustantivos", lesson: 3, en: "far" },
    { thai: "ใกล้", phonetic: "glâi", es: "glâi", tone: "f", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=180&h=180&fit=crop&auto=format", spanish: "near", category: "sustantivos", lesson: 3, en: "near" },
    { thai: "หมู่", phonetic: "mùu", es: "mù", tone: "l", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=180&h=180&fit=crop&auto=format", spanish: "group", category: "sustantivos", lesson: 3, en: "group" },
    { thai: "หน้า", phonetic: "nâa", es: "nâ", tone: "f", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&auto=format", spanish: "face / forehead", category: "sustantivos", lesson: 3, en: "face / forehead" },
    { thai: "หนา", phonetic: "nǎa", es: "nǎ", tone: "r", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=180&h=180&fit=crop&auto=format", spanish: "thick", category: "sustantivos", lesson: 3, en: "thick" },
    { thai: "ชา", phonetic: "chaa", es: "cha", tone: "m", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=180&h=180&fit=crop&auto=format", spanish: "tea", category: "comida", lesson: 3, en: "tea" },
    { thai: "ช้า", phonetic: "cháa", es: "chá", tone: "h", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=180&h=180&fit=crop&auto=format", spanish: "slow", category: "sustantivos", lesson: 3, en: "slow" },

    // Lección 4
    { thai: "มัน", phonetic: "man", es: "man", tone: "m", spanish: "it", category: "pronombres", lesson: 4, en: "it" },
    { thai: "ห้องน้ำ", phonetic: "hông-náam", es: "jông-nám", tone: "f-h", image: "https://images.unsplash.com/photo-1585128903994-9788298932a4?w=180&h=180&fit=crop&auto=format", spanish: "bathroom", category: "sustantivos", lesson: 4, en: "bathroom" },
    { thai: "นอน", phonetic: "nɔɔn", es: "non", tone: "m", spanish: "to sleep", category: "verbos", lesson: 4, en: "to sleep" },
    { thai: "พยาบาล", phonetic: "pha-yaa-baan", es: "pa-ya-ban", tone: "m-m-m", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=180&h=180&fit=crop&auto=format", spanish: "nurse / to care", category: "sustantivos", lesson: 4, en: "nurse" },
    { thai: "ประเทศ", phonetic: "prà-thêet", es: "bprà-tét", tone: "l-h", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=180&h=180&fit=crop&auto=format", spanish: "country", category: "sustantivos", lesson: 4, en: "country" },
    { thai: "สเปน", phonetic: "sà-pen", es: "sà-bpen", tone: "l-m", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=180&h=180&fit=crop&auto=format", spanish: "Spain", category: "sustantivos", lesson: 4, en: "Spain" },
    { thai: "กรุงเทพ", phonetic: "krung-thêep", es: "krung-tép", tone: "m-h", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=180&h=180&fit=crop&auto=format", spanish: "Bangkok", category: "sustantivos", lesson: 4, en: "Bangkok" },
    { thai: "สบาย", phonetic: "sà-baai", es: "sà-bai", tone: "l-m", spanish: "comfortable / fine", category: "saludos", lesson: 4, en: "comfortable / fine" },

    // Lesson 5
    { thai: "เรียน", phonetic: "rian", es: "rian", tone: "m", spanish: "to study", category: "verbos", lesson: 5, en: "to study" },
    { thai: "โรงเรียน", phonetic: "roong-riian", es: "rong-rian", tone: "m-m", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=180&h=180&fit=crop&auto=format", spanish: "school", category: "sustantivos", lesson: 5, en: "school" },
    { thai: "คิด", phonetic: "khít", es: "kìd", tone: "l", spanish: "to think", category: "verbos", lesson: 5, en: "to think" },
    { thai: "คิดถึง", phonetic: "khít-teung", es: "kìd-těung", tone: "l-r", spanish: "to miss (someone)", category: "verbos", lesson: 5, en: "to miss (someone)" },
    { thai: "เที่ยว", phonetic: "thîao", es: "tîo", tone: "f", spanish: "to travel / to go out", category: "verbos", lesson: 5, en: "to travel / to go out" },
    { thai: "เข้าใจ", phonetic: "khâo-jai", es: "kâo-chai", tone: "f-m", spanish: "to understand", category: "verbos", lesson: 5, en: "to understand" },
    { thai: "เข้า", phonetic: "khâo", es: "kâo", tone: "f", spanish: "to get in / enter", category: "verbos", lesson: 5, en: "to enter" },
    { thai: "ออก", phonetic: "ɔ̀ɔk", es: "òk", tone: "l", spanish: "to get out / exit", category: "verbos", lesson: 5, en: "to exit" },
    { thai: "ใจ", phonetic: "jai", es: "chai", tone: "m", image: "https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?w=180&h=180&fit=crop&auto=format", spanish: "heart / mind", category: "sustantivos", lesson: 5, en: "heart / mind" },
    { thai: "ซื้อ", phonetic: "súeu", es: "sú", tone: "h", spanish: "to buy", category: "verbos", lesson: 5, en: "to buy" },
    { thai: "ของ", phonetic: "kǒng", es: "kǒng", tone: "r", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=180&h=180&fit=crop&auto=format", spanish: "thing / stuff", category: "sustantivos", lesson: 5, en: "thing / stuff" },
    { thai: "ห้าง", phonetic: "hâng", es: "jâng", tone: "f", image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=180&h=180&fit=crop&auto=format", spanish: "mall", category: "tiendas", lesson: 5, en: "mall" },
    { thai: "กลางคืน", phonetic: "klang-kheun", es: "klang-ken", tone: "m-m", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=180&h=180&fit=crop&auto=format", spanish: "night", category: "sustantivos", lesson: 5, en: "night" },
    { thai: "เช้า", phonetic: "cháo", es: "chǎo", tone: "r", image: "https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?w=180&h=180&fit=crop&auto=format", spanish: "morning", category: "sustantivos", lesson: 5, en: "morning" },
    { thai: "ขาย", phonetic: "khǎay", es: "kǎi", tone: "r", spanish: "to sell", category: "verbos", lesson: 5, en: "to sell" },

    // Lesson 6 - Numbers, Prices, Questions
    { thai: "สิบเอ็ด", phonetic: "sìp-èt", es: "sìp-èt", tone: "l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "eleven (11)", category: "números", lesson: 6, en: "eleven (11)" },
    { thai: "เอ็ด", phonetic: "èt", es: "èt", tone: "l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "one (in compounds, 11,21...)", category: "números", lesson: 6, en: "one (in compounds)" },
    { thai: "ยี่สิบ", phonetic: "yîi-sìp", es: "yî-sìp", tone: "f-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "twenty (20)", category: "números", lesson: 6, en: "twenty (20)" },
    { thai: "ยี่สิบเอ็ด", phonetic: "yîi-sìp-èt", es: "yî-sìp-èt", tone: "f-l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "twenty-one (21)", category: "números", lesson: 6, en: "twenty-one (21)" },
    { thai: "สามสิบ", phonetic: "sǎam-sìp", es: "sǎm-sìp", tone: "r-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "thirty (30)", category: "números", lesson: 6, en: "thirty (30)" },
    { thai: "สี่สิบ", phonetic: "sìi-sìp", es: "sì-sìp", tone: "l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "forty (40)", category: "números", lesson: 6, en: "forty (40)" },
    { thai: "ห้าสิบ", phonetic: "hâa-sìp", es: "jâ-sìp", tone: "f-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "fifty (50)", category: "números", lesson: 6, en: "fifty (50)" },
    { thai: "หกสิบ", phonetic: "hòk-sìp", es: "jòk-sìp", tone: "l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "sixty (60)", category: "números", lesson: 6, en: "sixty (60)" },
    { thai: "เจ็ดสิบ", phonetic: "jèt-sìp", es: "chèt-sìp", tone: "l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "seventy (70)", category: "números", lesson: 6, en: "seventy (70)" },
    { thai: "แปดสิบ", phonetic: "bpàaet-sìp", es: "bpèt-sìp", tone: "l-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "eighty (80)", category: "números", lesson: 6, en: "eighty (80)" },
    { thai: "เก้าสิบ", phonetic: "kâo-sìp", es: "kâo-sìp", tone: "f-l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "ninety (90)", category: "números", lesson: 6, en: "ninety (90)" },
    { thai: "ร้อย", phonetic: "rɔ́ɔy", es: "rói", tone: "h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "hundred (100)", category: "números", lesson: 6, en: "hundred (100)" },
    { thai: "พัน", phonetic: "phan", es: "pan", tone: "m", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "thousand (1,000)", category: "números", lesson: 6, en: "thousand (1,000)" },
    { thai: "บาท", phonetic: "bàat", es: "bàt", tone: "l", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "baht (currency)", category: "números", lesson: 6, en: "baht (currency)" },
    { thai: "ยูโร", phonetic: "yuu-roo", es: "yu-ro", tone: "m-m", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "euro", category: "números", lesson: 6, en: "euro" },

    { thai: "ใคร", phonetic: "khrai", es: "krai", tone: "m", spanish: "who", category: "preguntas", lesson: 6, en: "who" },
    { thai: "อย่างไร", phonetic: "yàng-rai", es: "yâng-rai", tone: "f-m", spanish: "how", category: "preguntas", lesson: 6, en: "how" },
    { thai: "เมื่อไร", phonetic: "mʉ̂a-rai", es: "mûa-rai", tone: "f-m", spanish: "when", category: "preguntas", lesson: 6, en: "when" },
    { thai: "กี่", phonetic: "kìi", es: "kì", tone: "l", spanish: "how many / how much", category: "preguntas", lesson: 6, en: "how many / how much" },
    { thai: "เท่าไหร่", phonetic: "thâo-rài", es: "tâo-râi", tone: "f-f", spanish: "how much / how many", category: "preguntas", lesson: 6, en: "how much / how many" },
    { thai: "ราคา", phonetic: "raa-khaa", es: "ra-ka", tone: "m-m", spanish: "price", category: "preguntas", lesson: 6, en: "price" },

    { thai: "แล้ว", phonetic: "lɛ̂ɛo", es: "lêo", tone: "f", spanish: "already", category: "verbos", lesson: 6, en: "already" },
    { thai: "กำลัง", phonetic: "gam-lang", es: "gam-lang", tone: "m-m", spanish: "-ing (present continuous)", category: "verbos", lesson: 6, en: "-ing (present continuous)" },

    { thai: "สายไหม", phonetic: "sǎai-mǎi", es: "sǎi-mǎi", tone: "r-r", image: "https://images.unsplash.com/photo-1555992457-b8a78e0bc669?w=180&h=180&fit=crop&auto=format", spanish: "Sai Mai (Bangkok district)", category: "sustantivos", lesson: 6, en: "Sai Mai (Bangkok district)" },

    // Lesson 7
    { thai: "แก้ว", phonetic: "gâaew", es: "kéo", tone: "h", image: "https://images.unsplash.com/photo-1600206223000-36eeb7a4d3ff?w=180&h=180&fit=crop&auto=format", spanish: "glass/cup", category: "sustantivos", lesson: 7, en: "glass / cup" },
    { thai: "ส่ง", phonetic: "sòng", es: "sòng", tone: "l", spanish: "to send", category: "verbos", lesson: 7, en: "to send" },
    { thai: "สอน", phonetic: "sɔ̌ɔn", es: "sǒn", tone: "l", spanish: "to teach", category: "verbos", lesson: 7, en: "to teach" },
    { thai: "ชื่อ", phonetic: "chûue", es: "chûe", tone: "f", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=180&h=180&fit=crop&auto=format", spanish: "name", category: "sustantivos", lesson: 7, en: "name" },
    { thai: "อ่าน", phonetic: "àan", es: "àn", tone: "l", spanish: "to read", category: "verbos", lesson: 7, en: "to read" },
    { thai: "การ์ตูน", phonetic: "gaai-dtuun", es: "ga-dtun", tone: "m-m", image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=180&h=180&fit=crop&auto=format", spanish: "cartoon", category: "sustantivos", lesson: 7, en: "cartoon" },
    { thai: "อังกฤษ", phonetic: "ang-grìt", es: "an-grìt", tone: "m-l", image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=180&h=180&fit=crop&auto=format", spanish: "English / England", category: "sustantivos", lesson: 7, en: "English / England" },
    { thai: "ปาเอยา", phonetic: "paa-ee-yaa", es: "bpa-e-yâ", tone: "m-m-f", image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=180&h=180&fit=crop&auto=format", spanish: "paella", category: "comida", lesson: 7, en: "paella" },
    { thai: "บ้าน", phonetic: "bâan", es: "bân", tone: "f", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=180&h=180&fit=crop&auto=format", spanish: "house / home", category: "sustantivos", lesson: 7, en: "house / home" },
    { thai: "บิลเบา", phonetic: "bin-bao", es: "bil-bao", tone: "m-m", image: "https://images.unsplash.com/photo-1601556249636-4c4f6a30c2b3?w=180&h=180&fit=crop&auto=format", spanish: "Bilbao (Spain)", category: "sustantivos", lesson: 7, en: "Bilbao (Spain)" },
    { thai: "อยู่", phonetic: "yùu", es: "iù", tone: "l", spanish: "to be at / live", category: "verbos", lesson: 7, en: "to be at / live" },

    { thai: "ตี", phonetic: "dtii", es: "dtii", tone: "m", spanish: "to strike (used for 1-5 AM)", en: "to strike (used for 1-5 AM hours)", category: "tiempo", lesson: 9 },
    { thai: "เที่ยง", phonetic: "thîang", es: "tîeng", tone: "f", spanish: "noon / midday", en: "noon / midday", category: "tiempo", lesson: 9 },
    { thai: "ทุ่ม", phonetic: "thùm", es: "tûm", tone: "f", spanish: "bell unit (evening hours; 1 ทุ่ม = 7 PM)", en: "bell unit (1 tum = 7 PM)", category: "tiempo", lesson: 9 },
    { thai: "ตอนนี้", phonetic: "dton-níi", es: "dton-ní", tone: "m-h", spanish: "now", en: "now", category: "tiempo", lesson: 9 },
    { thai: "นาที", phonetic: "naa-thii", es: "na-tí", tone: "m-m", spanish: "minute", en: "minute", category: "tiempo", lesson: 9 },
    { thai: "จอง", phonetic: "jong", es: "chong", tone: "m", spanish: "to book / to reserve", en: "to book / to reserve", category: "verbos", lesson: 9 },
    { thai: "เวลา", phonetic: "way-laa", es: "ue-la", tone: "m-m", spanish: "time", en: "time", category: "tiempo", lesson: 9 },

    { thai: "ยี่สิบเอ็ด", phonetic: "yîi-sìp-èt", es: "yî-sìp-èt", tone: "f-l-l", spanish: "twenty-one (21)", category: "números", lesson: 6, en: "twenty-one (21)" },
    { thai: "ห้าสิบ", phonetic: "hâa-sìp", es: "jâ-sìp", tone: "f-l", spanish: "fifty (50)", category: "números", lesson: 6, en: "fifty (50)" },
    { thai: "แปดสิบสี่", phonetic: "bpàaet-sìp-sìi", es: "bpèt-sìp-sì", tone: "l-l-l", spanish: "eighty-four (84)", category: "números", lesson: 6, en: "eighty-four (84)" },
    { thai: "เก้าสิบเอ็ด", phonetic: "kâo-sìp-èt", es: "kâo-sìp-èt", tone: "f-l-l", spanish: "ninety-one (91)", category: "números", lesson: 6, en: "ninety-one (91)" },
    { thai: "เท่าไหร่", phonetic: "thâo-rài", es: "tâo-râi", tone: "f-f", spanish: "how much?", category: "preguntas", lesson: 6, en: "how much / how many" },
    { thai: "อย่างไร", phonetic: "yàng-rai", es: "yâng-rai", tone: "f-m", spanish: "how?", category: "preguntas", lesson: 6, en: "how" },
    { thai: "กรุงเทพ", phonetic: "krung-thêep", es: "krung-têp", tone: "m-f", spanish: "Bangkok", category: "sustantivos", lesson: 8, en: "Bangkok" },
    { thai: "ที่นี่", phonetic: "thîi-nîi", es: "tî-nî", tone: "f-f", spanish: "here", category: "pronombres", lesson: 8, en: "here" },
    { thai: "ที่นั่น", phonetic: "thîi-nân", es: "tî-nân", tone: "f-f", spanish: "there", category: "pronombres", lesson: 8, en: "there" },
    { thai: "อันนี้", phonetic: "an-níi", es: "an-ní", tone: "m-h", spanish: "this one", category: "pronombres", lesson: 8, en: "this one" },
    { thai: "อันนั้น", phonetic: "an-nán", es: "an-nán", tone: "m-h", spanish: "that one", category: "pronombres", lesson: 8, en: "that one" },
    { thai: "วัน", phonetic: "wan", es: "wan", tone: "m", spanish: "day", category: "tiempo", lesson: 8, en: "day" },
    { thai: "วันนี้", phonetic: "wan-nîi", es: "wan-ní", tone: "m-h", spanish: "today", category: "tiempo", lesson: 8, en: "today" },
    { thai: "พรุ่งนี้", phonetic: "prûng-níi", es: "prûng-ní", tone: "f-h", spanish: "tomorrow", category: "tiempo", lesson: 8, en: "tomorrow" },
    { thai: "เมื่อวานนี้", phonetic: "mûea-waan-níi", es: "mêa-wan-ní", tone: "f-m-h", spanish: "yesterday", category: "tiempo", lesson: 8, en: "yesterday" },
    { thai: "กลางวัน", phonetic: "klang-wan", es: "klang-wan", tone: "m-m", spanish: "daytime", category: "tiempo", lesson: 8, en: "daytime" },
    { thai: "ตอนกลางวัน", phonetic: "dton-klang-wan", es: "dton-klang-wan", tone: "m-m-m", spanish: "during the day", category: "tiempo", lesson: 8, en: "during the day" },
    { thai: "กลางคืน", phonetic: "klang-kheun", es: "klang-ken", tone: "m-m", spanish: "nighttime", category: "tiempo", lesson: 8, en: "night" },
    { thai: "ตอนกลางคืน", phonetic: "dton-klang-kheun", es: "dton-klang-ken", tone: "m-m-m", spanish: "at night", category: "tiempo", lesson: 8, en: "at night" },
    { thai: "ตอนเช้า", phonetic: "dton-cháo", es: "dton-cháo", tone: "m-h", spanish: "in the morning", category: "tiempo", lesson: 8, en: "in the morning" },
    { thai: "เที่ยง", phonetic: "thîang", es: "tîeng", tone: "f", spanish: "noon", category: "tiempo", lesson: 8, en: "noon" },
    { thai: "ตอนเที่ยง", phonetic: "dton-thîang", es: "dton-tîeng", tone: "m-f", spanish: "at noon", category: "tiempo", lesson: 8, en: "at noon" },
    { thai: "บ่าย", phonetic: "bàai", es: "bài", tone: "l", spanish: "afternoon", category: "tiempo", lesson: 8, en: "afternoon" },
    { thai: "ตอนบ่าย", phonetic: "dton-bàai", es: "dton-bài", tone: "m-l", spanish: "in the afternoon", category: "tiempo", lesson: 8, en: "in the afternoon" },
    { thai: "เย็น", phonetic: "yen", es: "ien", tone: "m", spanish: "evening / cool", category: "tiempo", lesson: 8, en: "cold" },
    { thai: "ตอนเย็น", phonetic: "dton-yen", es: "dton-ien", tone: "m-m", spanish: "in the evening", category: "tiempo", lesson: 8, en: "in the evening" },
    { thai: "จันทร์", phonetic: "jan", es: "chan", tone: "m", spanish: "moon", category: "sustantivos", lesson: 8, en: "moon" },
    { thai: "สุข", phonetic: "sùk", es: "sùk", tone: "l", spanish: "happiness / happy", category: "sustantivos", lesson: 8, en: "happiness / happy" },
    { thai: "อาทิตย์", phonetic: "aa-thít", es: "a-tíd", tone: "m-h", spanish: "sun", category: "sustantivos", lesson: 8, en: "sun" },
    { thai: "ปากกา", phonetic: "paa-gaa", es: "bpa-ga", tone: "m-m", spanish: "pen", category: "sustantivos", lesson: 8, en: "pen" },

    // === LESSON 10: COLORES ===
    { thai: "สี", phonetic: "sǐi", es: "sǐ", tone: "m", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=180&h=180&fit=crop&auto=format", spanish: "color", category: "colores", lesson: 10, en: "color" },
    { thai: "สีแดง", phonetic: "sǐi-dǎeng", es: "sǐ-dǎeng", tone: "l-r", image: "https://images.unsplash.com/photo-1620207418302-439b387441b0?w=180&h=180&fit=crop&auto=format", spanish: "red", category: "colores", lesson: 10, en: "red" },
    { thai: "สีเขียว", phonetic: "sǐi-khǐao", es: "sǐ-kǐao", tone: "l-r", image: "https://images.unsplash.com/photo-1541252607-3593f8f8e3da?w=180&h=180&fit=crop&auto=format", spanish: "green", category: "colores", lesson: 10, en: "green" },
    { thai: "สีเหลือง", phonetic: "sǐi-lǔeang", es: "sǐ-lǔeang", tone: "l-r", image: "https://images.unsplash.com/photo-1509335802812-51ecf8e9c9b3?w=180&h=180&fit=crop&auto=format", spanish: "yellow", category: "colores", lesson: 10, en: "yellow" },
    { thai: "สีดำ", phonetic: "sǐi-dam", es: "sǐ-dam", tone: "l-m", image: "https://images.unsplash.com/photo-1526483502397-8e9c8b4f2d97?w=180&h=180&fit=crop&auto=format", spanish: "black", category: "colores", lesson: 10, en: "black" },
    { thai: "สีขาว", phonetic: "sǐi-khǎao", es: "sǐ-kǎo", tone: "l-r", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=180&h=180&fit=crop&auto=format", spanish: "white", category: "colores", lesson: 10, en: "white" },
    { thai: "สีฟ้า", phonetic: "sǐi-fáa", es: "sǐ-fá", tone: "l-h", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=180&h=180&fit=crop&auto=format", spanish: "blue (light)", category: "colores", lesson: 10, en: "blue (light)" },
    { thai: "สีส้ม", phonetic: "sǐi-sôm", es: "sǐ-sôm", tone: "l-h", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=180&h=180&fit=crop&auto=format", spanish: "orange (color)", category: "colores", lesson: 10, en: "orange (color)" },
    { thai: "สีชมพู", phonetic: "sǐi-chom-puun", es: "sǐ-chom-pûn", tone: "l-m-m", image: "https://images.unsplash.com/photo-1599689019338-d2dde3024f70?w=180&h=180&fit=crop&auto=format", spanish: "pink", category: "colores", lesson: 10, en: "pink" },
    { thai: "สีน้ำตาล", phonetic: "sǐi-nám-dtaan", es: "sǐ-nám-dtân", tone: "l-h-m", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=180&h=180&fit=crop&auto=format", spanish: "brown", category: "colores", lesson: 10, en: "brown" },
    { thai: "สีเทา", phonetic: "sǐi-thao", es: "sǐ-tao", tone: "l-m", image: "https://images.unsplash.com/photo-1519187903022-e00e4c1d83bb?w=180&h=180&fit=crop&auto=format", spanish: "gray", category: "colores", lesson: 10, en: "gray" },

    // === LESSON 10: RUTINA DIARIA (DAILY ROUTINE) ===
    { thai: "ตื่นนอน", phonetic: "dtùen-nɔɔn", es: "dtùen-non", tone: "l-m", spanish: "to wake up", category: "verbos", lesson: 10, en: "to wake up" },
    { thai: "อาบน้ำ", phonetic: "àap-nám", es: "àap-nám", tone: "l-h", spanish: "to shower / to bathe", category: "verbos", lesson: 10, en: "to shower / to bathe" },
    { thai: "แปรงฟัน", phonetic: "bprɛɛng-fan", es: "bprɛng-fan", tone: "m-m", spanish: "to brush teeth", category: "verbos", lesson: 10, en: "to brush teeth" },
    { thai: "สระผม", phonetic: "sà-phǒm", es: "sà-pǒm", tone: "l-r", spanish: "to wash hair", category: "verbos", lesson: 10, en: "to wash hair" },
    { thai: "แต่งตัว", phonetic: "dtàeng-dtuua", es: "dtàeng-dtuá", tone: "l-m", spanish: "to get dressed", category: "verbos", lesson: 10, en: "to get dressed" },
    { thai: "กลับบ้าน", phonetic: "glàp-bâan", es: "glàp-bân", tone: "l-f", spanish: "to go back home", category: "verbos", lesson: 10, en: "to go back home" },
    { thai: "พักผ่อน", phonetic: "phák-phòon", es: "pák-pôn", tone: "l-l", spanish: "to rest", category: "verbos", lesson: 10, en: "to rest" },

    // === LESSON 10: RESERVAS Y CITAS (BOOKING & APPOINTMENTS) ===
    { thai: "นัด", phonetic: "nát", es: "nát", tone: "l", spanish: "to set an appointment / a date", category: "verbos", lesson: 10, en: "to set an appointment" },
    { thai: "นัดหมาย", phonetic: "nát-mǎai", es: "nát-mǎi", tone: "l-r", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0a?w=180&h=180&fit=crop&auto=format", spanish: "appointment (formal)", category: "sustantivos", lesson: 10, en: "appointment (formal)" },
    { thai: "คิว", phonetic: "khiu", es: "khiu", tone: "h", image: "https://images.unsplash.com/photo-1559521932-6caccba6fcd6?w=180&h=180&fit=crop&auto=format", spanish: "queue / turn / appointment slot", category: "sustantivos", lesson: 10, en: "queue / turn / slot" },
    { thai: "หมอ", phonetic: "mǒe", es: "mǒe", tone: "r", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=180&h=180&fit=crop&auto=format", spanish: "doctor", category: "sustantivos", lesson: 10, en: "doctor" },
    { thai: "พบ", phonetic: "phóp", es: "póp", tone: "l", spanish: "to meet / to see (a person)", category: "verbos", lesson: 10, en: "to meet / to see (person)" },
    { thai: "จองคิว", phonetic: "jong khiu", es: "chong khiu", tone: "m-h", spanish: "to book an appointment / a slot", category: "verbos", lesson: 10, en: "to book an appointment" },
    { thai: "จองโต๊ะ", phonetic: "jong tó", es: "chong tó", tone: "m-h", spanish: "to book a table", category: "verbos", lesson: 10, en: "to book a table" },
    { thai: "จองห้อง", phonetic: "jong hɔ̂ɔng", es: "chong hóng", tone: "m-h", spanish: "to book a room", category: "verbos", lesson: 10, en: "to book a room" },
    { thai: "เวลานัด", phonetic: "way-laa nát", es: "ue-la nát", tone: "m-m-l", spanish: "appointment time", category: "tiempo", lesson: 10, en: "appointment time" },
    { thai: "เช็คอิน", phonetic: "chék-in", es: "chék-in", tone: "h-m", spanish: "check-in (hotel/airport)", category: "verbos", lesson: 10, en: "check-in" },
    { thai: "เช็คเอาท์", phonetic: "chék-ao", es: "chék-ao", tone: "h-m", spanish: "check-out (hotel)", category: "verbos", lesson: 10, en: "check-out" },

    // === LESSON 10: SUPPORT VOCAB (needed by phrases/conversations) ===
    { thai: "รถ", phonetic: "rót", es: "rót", tone: "h", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=180&h=180&fit=crop&auto=format", spanish: "car / vehicle", category: "sustantivos", lesson: 10, en: "car" },
    { thai: "เสื้อ", phonetic: "sûea", es: "súa", tone: "h", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=180&h=180&fit=crop&auto=format", spanish: "shirt", category: "sustantivos", lesson: 10, en: "shirt" },
    { thai: "โต๊ะ", phonetic: "tó", es: "tó", tone: "h", image: "https://images.unsplash.com/photo-1531518324215-45bdb92f705c?w=180&h=180&fit=crop&auto=format", spanish: "table", category: "sustantivos", lesson: 10, en: "table" },
    { thai: "คัน", phonetic: "khan", es: "kan", tone: "m", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=180&h=180&fit=crop&auto=format", spanish: "classifier for vehicles", category: "sustantivos", lesson: 10, en: "classifier (vehicles)" },
    { thai: "คือ", phonetic: "kheu", es: "keu", tone: "m", spanish: "to be (is / equals)", category: "verbos", lesson: 10, en: "to be (identity)" },
    { thai: "โปรด", phonetic: "pròot", es: "pròt", tone: "l", image: "https://images.unsplash.com/photo-1526413232644-8a40f03cc038?w=180&h=180&fit=crop&auto=format", spanish: "favorite", category: "sabores", lesson: 10, en: "favorite" },
    { thai: "สวย", phonetic: "sǔai", es: "sǔai", tone: "h", image: "https://images.unsplash.com/photo-1500964757637-c85e5a162a99?w=180&h=180&fit=crop&auto=format", spanish: "beautiful", category: "sabores", lesson: 10, en: "beautiful" },
    { thai: "ตัด", phonetic: "dtàt", es: "dtàt", tone: "l", spanish: "to cut", category: "verbos", lesson: 10, en: "to cut" },
    { thai: "นะ", phonetic: "ná", es: "ná", tone: "h", spanish: "softening particle (ná)", category: "saludos", lesson: 10, en: "softening particle" },

    // === LESSON 11: PREPOSICIONES (PREPOSITIONS) ===
    { thai: "ใน", phonetic: "nai", es: "nai", tone: "m", spanish: "in / inside", category: "preposiciones", lesson: 11, en: "in / inside" },
    { thai: "บน", phonetic: "bon", es: "bon", tone: "m", spanish: "on / on top", category: "preposiciones", lesson: 11, en: "on / on top" },
    { thai: "ที่", phonetic: "thîi", es: "tî", tone: "f", spanish: "at / in / on (locative)", category: "preposiciones", lesson: 11, en: "at / in / on (locative)" },
    { thai: "ข้าง", phonetic: "khâang", es: "kâang", tone: "f", spanish: "side", category: "preposiciones", lesson: 11, en: "side" },
    { thai: "ข้างใน", phonetic: "khâang-nai", es: "kâang-nai", tone: "f-m", spanish: "inside", category: "preposiciones", lesson: 11, en: "inside" },
    { thai: "ข้างนอก", phonetic: "khâang-nɔ̀ɔk", es: "kâang-nòk", tone: "f-l", spanish: "outside", category: "preposiciones", lesson: 11, en: "outside" },
    { thai: "ข้างหน้า", phonetic: "khâang-nâa", es: "kâang-ná", tone: "f-f", spanish: "in front of", category: "preposiciones", lesson: 11, en: "in front of" },
    { thai: "ข้างหลัง", phonetic: "khâang-lǎng", es: "kâang-lǎng", tone: "f-l", spanish: "behind", category: "preposiciones", lesson: 11, en: "behind" },
    { thai: "ข้างบน", phonetic: "khâang-bon", es: "kâang-bon", tone: "f-m", spanish: "above / on top of", category: "preposiciones", lesson: 11, en: "above / on top of" },
    { thai: "ข้างล่าง", phonetic: "khâang-lâang", es: "kâang-lâang", tone: "f-f", spanish: "below / under", category: "preposiciones", lesson: 11, en: "below / under" },
    { thai: "ข้างๆ", phonetic: "khâang-khâang", es: "kâang-kâang", tone: "f-f", spanish: "beside / next to", category: "preposiciones", lesson: 11, en: "beside / next to" },
    { thai: "ล่าง", phonetic: "lâang", es: "lâang", tone: "f", spanish: "under / below / bottom", category: "preposiciones", lesson: 11, en: "under / below" },
    { thai: "หลัง", phonetic: "lǎng", es: "lǎng", tone: "l", spanish: "back / behind / after", category: "preposiciones", lesson: 11, en: "back / after" },
    { thai: "ระหว่าง", phonetic: "rá-wàaang", es: "rá-uáang", tone: "h-f", spanish: "between", category: "preposiciones", lesson: 11, en: "between" },
    { thai: "ตรงข้าม", phonetic: "trom-khâam", es: "trong-kâam", tone: "m-f", spanish: "opposite", category: "preposiciones", lesson: 11, en: "opposite" },
    { thai: "ข้าม", phonetic: "khâam", es: "kâam", tone: "f", spanish: "across / cross", category: "preposiciones", lesson: 11, en: "across / cross" },
    { thai: "ก่อน", phonetic: "kɔ̀ɔn", es: "kòn", tone: "l", spanish: "before / first", category: "preposiciones", lesson: 11, en: "before / first" },
    { thai: "ผ่าน", phonetic: "phâan", es: "pâan", tone: "f", spanish: "past / through / pass", category: "preposiciones", lesson: 11, en: "past / through" },
    { thai: "เพื่อ", phonetic: "phûea", es: "púa", tone: "f", spanish: "for (purpose)", category: "preposiciones", lesson: 11, en: "for (purpose)" },
    { thai: "สำหรับ", phonetic: "sǎm-ràp", es: "sǎm-ràp", tone: "h-h", spanish: "for (intended for)", category: "preposiciones", lesson: 11, en: "for (intended for)" },
    { thai: "กับ", phonetic: "kàp", es: "gàp", tone: "l", spanish: "with", category: "preposiciones", lesson: 11, en: "with" },
    { thai: "และ", phonetic: "lɛ̀ɛ", es: "lè", tone: "l", spanish: "and", category: "preposiciones", lesson: 11, en: "and" },
    { thai: "หรือ", phonetic: "rǔe", es: "rǔe", tone: "r", spanish: "or", category: "preposiciones", lesson: 11, en: "or" },
    { thai: "ทั้งหมด", phonetic: "thâang-mòt", es: "tâang-mòt", tone: "f-l", spanish: "all / everything", category: "preposiciones", lesson: 11, en: "all" },
    { thai: "ทั้งสอง", phonetic: "thâang-sǎawng", es: "tâang-sǒng", tone: "f-r", spanish: "both", category: "preposiciones", lesson: 11, en: "both" },
    { thai: "เข้าข้างใน", phonetic: "khâo khâang-nai", es: "kǎo kâang-nai", tone: "f-f-m", spanish: "to get inside / go in", category: "verbos", lesson: 11, en: "to get inside" },
    { thai: "ออกไปข้างนอก", phonetic: "ɔ̀ɔk bpai khâang-nɔ̀ɔk", es: "òk bpai kâang-nòk", tone: "l-m-f-l", spanish: "to go outside / get out", category: "verbos", lesson: 11, en: "to go outside" },
    { thai: "ปิด", phonetic: "pìt", es: "bpìt", tone: "l", spanish: "to close / turn off", category: "verbos", lesson: 11, en: "to close / turn off" },
    { thai: "เปิด", phonetic: "pòet", es: "bpöet", tone: "l", spanish: "to open / turn on", category: "verbos", lesson: 11, en: "to open / turn on" },
    { thai: "เดิน", phonetic: "dəən", es: "dəən", tone: "m", spanish: "to walk", category: "verbos", lesson: 11, en: "to walk" },
    { thai: "เจอคุณ", phonetic: "jəə khun", es: "jo kun", tone: "m-m", spanish: "to meet you", category: "verbos", lesson: 11, en: "to meet you" },

    // === LESSON 12: DIRECCIONES Y PARTES DE LA CARA ===
    // Directions
    { thai: "ซ้าย", phonetic: "sáai", es: "sáai", tone: "h", spanish: "left", category: "direcciones", lesson: 12, en: "left" },
    { thai: "ขวา", phonetic: "khwǎa", es: "kuǎa", tone: "r", spanish: "right", category: "direcciones", lesson: 12, en: "right" },
    { thai: "ตรง", phonetic: "trom", es: "trom", tone: "m", spanish: "straight", category: "direcciones", lesson: 12, en: "straight" },
    { thai: "ตรงไป", phonetic: "trom bpai", es: "trom bpai", tone: "m-m", spanish: "go straight / go ahead", category: "direcciones", lesson: 12, en: "go straight / ahead" },
    { thai: "เลี้ยว", phonetic: "lîao", es: "lîao", tone: "f", spanish: "to turn (a corner)", category: "direcciones", lesson: 12, en: "to turn" },
    { thai: "เลี้ยวซ้าย", phonetic: "lîao sáai", es: "lîao sáai", tone: "f-h", spanish: "turn left", category: "direcciones", lesson: 12, en: "turn left" },
    { thai: "เลี้ยวขวา", phonetic: "lîao khwǎa", es: "lîao kuǎa", tone: "f-r", spanish: "turn right", category: "direcciones", lesson: 12, en: "turn right" },
    // Map places (lesson 12 directions context)
    { thai: "ธนาคาร", phonetic: "thá-náa-khaan", es: "tá-ná-kan", tone: "h-h-h", image: "https://images.unsplash.com/photo-1518109330907-7715a8e1e16c?w=180&h=180&fit=crop&auto=format", spanish: "bank", category: "tiendas", lesson: 12, en: "bank" },
    { thai: "สนามเด็กเล่น", phonetic: "sà-nǎam dèk lên", es: "sà-nǎm dék lên", tone: "l-r-l-f", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=180&h=180&fit=crop&auto=format", spanish: "playground", category: "tiendas", lesson: 12, en: "playground" },
    { thai: "สวนสาธารณะ", phonetic: "sŭuan săa-taa-rá-ná", es: "sǔan sǎ-ta-rá-ná", tone: "r-h-m-h-h", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=180&h=180&fit=crop&auto=format", spanish: "public park", category: "tiendas", lesson: 12, en: "public park" },
    // Body / face parts
    { thai: "หัว", phonetic: "hǔa", es: "hǔa", tone: "r", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&auto=format", spanish: "head", category: "cuerpo", lesson: 12, en: "head" },
    { thai: "ตา", phonetic: "taa", es: "ta", tone: "m", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&auto=format", spanish: "eye(s)", category: "cuerpo", lesson: 12, en: "eye(s)" },
    { thai: "จมูก", phonetic: "jà-mùuk", es: "jà-mùuk", tone: "l-h", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&auto=format", spanish: "nose", category: "cuerpo", lesson: 12, en: "nose" },
    { thai: "ปาก", phonetic: "pàak", es: "pàak", tone: "l", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&auto=format", spanish: "mouth", category: "cuerpo", lesson: 12, en: "mouth" },
    { thai: "ฟัน", phonetic: "fan", es: "fan", tone: "m", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&auto=format", spanish: "tooth / teeth", category: "cuerpo", lesson: 12, en: "tooth / teeth" },
    { thai: "หู", phonetic: "hǔu", es: "hǔu", tone: "r", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop&auto=format", spanish: "ear(s)", category: "cuerpo", lesson: 12, en: "ear(s)" },
    // Verbs
    { thai: "บอก", phonetic: "bɔ̀ɔk", es: "bòk", tone: "l", spanish: "to tell / to say", category: "verbos", lesson: 12, en: "to tell / to say" },
    { thai: "เจอกัน", phonetic: "jəə gan", es: "jo gan", tone: "m-m", spanish: "see you / meet each other", category: "verbos", lesson: 12, en: "see you / meet each other" },

    // === YouTube — Slow Thai Conversation ===
    { thai: "หวัดดี", phonetic: "wàt dee", es: "wàt di", spanish: "hi / hello (casual)", en: "hi / hello (casual)", category: "youtube", toneNote: "shortened form of สวัสดี" },
    { thai: "เธอ", phonetic: "ter", es: "ter", spanish: "you (informal) / she", en: "you (informal) / she", category: "youtube" },
    { thai: "ชื่อ", phonetic: "chêu", es: "chǔe", spanish: "to be named / name", en: "to be named / name", category: "youtube" },
    { thai: "ประเทศ", phonetic: "bprà-têt", es: "bprà-têt", spanish: "country / nation", en: "country / nation", category: "youtube" },
    { thai: "คนไทย", phonetic: "kon tai", es: "kon tai", spanish: "Thai (person)", en: "Thai (person)", category: "youtube" },
    { thai: "เหมือนกัน", phonetic: "mĕuuan gan", es: "mǔan gan", spanish: "also / as well / too", en: "also / as well / too", category: "youtube" },
    { thai: "เหมือน", phonetic: "mĕuuan", es: "mǔan", spanish: "like / as / similar to", en: "like / as / similar to", category: "youtube" },
    { thai: "เกาหลี", phonetic: "gao-lĕe", es: "gao-lǐ", spanish: "Korea / Korean", en: "Korea / Korean", category: "youtube" },
    { thai: "ลูกครึ่ง", phonetic: "lôok krêung", es: "lôk kreüng", spanish: "half-breed / mixed race", en: "half-breed / mixed race", category: "youtube" },
    { thai: "พ่อ", phonetic: "pôr", es: "por", spanish: "dad / father", en: "dad / father", category: "youtube" },
    { thai: "แม่", phonetic: "mâe", es: "mae", spanish: "mom / mother", en: "mom / mother", category: "youtube" },
    { thai: "ภาษาเกาหลี", phonetic: "paa-săa gao-lĕe", es: "ba-sǎa gao-lǐ", spanish: "Korean language", en: "Korean language", category: "youtube" },
    { thai: "ภาษาไทย", phonetic: "phaa-sǎa thai", es: "pa-sǎa tai", spanish: "Thai language", en: "Thai language", category: "youtube" },
    { thai: "เก่ง", phonetic: "gèng", es: "gèng", spanish: "skilled / good at", en: "skilled / good at", category: "youtube" },
    { thai: "กว่า", phonetic: "gwàa", es: "guá", spanish: "more / more than", en: "more / more than", category: "youtube" },
    { thai: "น่าอิจฉา", phonetic: "nâa ìt-chăa", es: "ná ìt-chǎa", spanish: "enviable / causes jealousy", en: "enviable / causes jealousy", category: "youtube" },
    { thai: "จังเลย", phonetic: "jang loiie", es: "yang loi", spanish: "so much / extremely", en: "so much / extremely", category: "youtube" },
    { thai: "สามี", phonetic: "săa-mee", es: "sǎ-mi", spanish: "husband", en: "husband", category: "youtube" },
    { thai: "ภรรยา", phonetic: "pan-rá-yaa", es: "pan-rá-ya", spanish: "wife (formal)", en: "wife (formal)", category: "youtube" },
    { thai: "เมือง", phonetic: "meuuang", es: "mûang", spanish: "city / town", en: "city / town", category: "youtube" },
    { thai: "สวนสาธารณะ", phonetic: "sŭuan săa-taa-rá-ná", es: "sǔan sǎ-ta-rá-ná", spanish: "public park", en: "public park", category: "youtube" },
    { thai: "ใจกลาง", phonetic: "jai glaang", es: "chai glang", spanish: "middle / center / heart", en: "middle / center / heart", category: "youtube" },
    { thai: "หญิงแก่", phonetic: "yĭng gàe", es: "yíng káe", spanish: "old woman", en: "old woman", category: "youtube" },
    { thai: "กำลัง", phonetic: "gam-lang", es: "gam-lang", spanish: "progressive marker (doing now)", en: "progressive marker (doing now)", category: "youtube" },
    { thai: "คุย", phonetic: "kui", es: "kui", spanish: "to chat / talk", en: "to chat / talk", category: "youtube" },
    { thai: "เพื่อน", phonetic: "pêuuan", es: "púan", spanish: "friend", en: "friend", category: "youtube" },
    { thai: "เพื่อนสนิท", phonetic: "pêuuan sà-nìt", es: "púan sà-nìt", spanish: "best friend / close friend", en: "best friend / close friend", category: "youtube" },
    { thai: "สนิท", phonetic: "sà-nìt", es: "sà-nìt", spanish: "close / intimate", en: "close / intimate", category: "youtube" },
    { thai: "คนแรก", phonetic: "kon râek", es: "kon rêk", spanish: "first person", en: "first person", category: "youtube" },
    { thai: "แรก", phonetic: "râek", es: "rêk", spanish: "first", en: "first", category: "youtube" },
    { thai: "ลูกชาย", phonetic: "lôok chaai", es: "lôk chai", spanish: "son", en: "son", category: "youtube" },
    { thai: "ลูกสาว", phonetic: "lôok săao", es: "lôk sao", spanish: "daughter", en: "daughter", category: "youtube" },
    { thai: "ลูก", phonetic: "lôok", es: "lôk", spanish: "child", en: "child", category: "youtube" },
    { thai: "ยังไง", phonetic: "yang ngai", es: "yang ngai", spanish: "how (informal)", en: "how (informal)", category: "youtube" },
    { thai: "บ้าง", phonetic: "bâang", es: "bâng", spanish: "any / some (question softener)", en: "any / some (question softener)", category: "youtube" },
    { thai: "ชีวิต", phonetic: "chee-wít", es: "chi-wít", spanish: "life", en: "life", category: "youtube" },
    { thai: "แต่งงาน", phonetic: "dtàeng ngaan", es: "dtàeng ngan", spanish: "to marry / married", en: "to marry / married", category: "youtube" },
    { thai: "ตอบ", phonetic: "dtòp", es: "dtòb", spanish: "to answer / reply", en: "to answer / reply", category: "youtube" },
    { thai: "แย่", phonetic: "yâe", es: "yé", spanish: "bad / terrible", en: "bad / terrible", category: "youtube" },
    { thai: "โทร", phonetic: "toh", es: "to", spanish: "to call (phone)", en: "to call (phone)", category: "youtube" },
    { thai: "บ่น", phonetic: "bòn", es: "bòn", spanish: "to complain / nag", en: "to complain / nag", category: "youtube" },
    { thai: "ทุกวัน", phonetic: "túk wan", es: "túk wan", spanish: "every day", en: "every day", category: "youtube" },
    { thai: "ทั้งวัน", phonetic: "táng wan", es: "táng wan", spanish: "all day / the whole day", en: "all day / the whole day", category: "youtube" },
    { thai: "งานบ้าน", phonetic: "ngaan bâan", es: "ngan ban", spanish: "housework", en: "housework", category: "youtube" },
    { thai: "ช่วย", phonetic: "chûuay", es: "chuái", spanish: "to help", en: "to help", category: "youtube" },
    { thai: "ดูแล", phonetic: "doo lae", es: "du lae", spanish: "to take care of", en: "to take care of", category: "youtube" },
    { thai: "ผู้หญิง", phonetic: "pôo yĭng", es: "pu yíng", spanish: "woman / female", en: "woman / female", category: "youtube" },
    { thai: "ถาม", phonetic: "tăam", es: "tǎm", spanish: "to ask", en: "to ask", category: "youtube" },
    { thai: "กลับ", phonetic: "glàp", es: "glàp", spanish: "to return / back", en: "to return / back", category: "youtube" },
    { thai: "ครอบครัว", phonetic: "krôp kruua", es: "krôp krua", spanish: "family", en: "family", category: "youtube" },
    { thai: "ความสุข", phonetic: "kwaam sùk", es: "kuam sùk", spanish: "happiness", en: "happiness", category: "youtube" },
    { thai: "คนดี", phonetic: "kon dee", es: "kon di", spanish: "good person", en: "good person", category: "youtube" },
    { thai: "ตั้งใจ", phonetic: "dtâng jai", es: "dtáng chai", spanish: "intention / diligent", en: "intention / diligent", category: "youtube" },
    { thai: "สะอาด", phonetic: "sà-àat", es: "sà-àt", spanish: "clean", en: "clean", category: "youtube" },
    { thai: "ความสะอาด", phonetic: "kwaam sà-àat", es: "kuam sà-àt", spanish: "cleanliness", en: "cleanliness", category: "youtube" },
    { thai: "ด้วย", phonetic: "dûuay", es: "dûai", spanish: "also / too / as well", en: "also / too / as well", category: "youtube" },
    { thai: "ถ้า", phonetic: "tâa", es: "tâ", spanish: "if", en: "if", category: "youtube" },
    { thai: "ใคร", phonetic: "krai", es: "krai", spanish: "who", en: "who", category: "youtube" },
    { thai: "วีดีโอ", phonetic: "wee-dee-oh", es: "wi-di-o", spanish: "video (loanword)", en: "video (loanword)", category: "youtube" },
    { thai: "สไตล์", phonetic: "style", es: "style", spanish: "style (loanword)", en: "style (loanword)", category: "youtube" },
    { thai: "เขียน", phonetic: "kĭian", es: "kiǎn", spanish: "to write", en: "to write", category: "youtube" },
    { thai: "คอมเม้น", phonetic: "kom mén", es: "kom mén", spanish: "comment (loanword)", en: "comment (loanword)", category: "youtube" },
    { thai: "บ้าย", phonetic: "bâai", es: "bai", spanish: "bye (informal loanword)", en: "bye (informal loanword)", category: "youtube" },

    // --- Lesson 13: Human Body & Health ---
    { thai: "คอ", phonetic: "kɔɔ", es: "kor", tone: "m", spanish: "neck", en: "neck", category: "cuerpo", lesson: 13 },
    { thai: "ไหล่", phonetic: "lài", es: "lài", tone: "l", spanish: "shoulder", en: "shoulder", category: "cuerpo", lesson: 13 },
    { thai: "แขน", phonetic: "khǎen", es: "kǎen", tone: "r", spanish: "arm", en: "arm", category: "cuerpo", lesson: 13 },
    { thai: "ท้อง", phonetic: "tong", es: "tong", tone: "m", spanish: "stomach / belly / pregnant", en: "stomach / belly / pregnant", category: "cuerpo", lesson: 13 },
    { thai: "ขา", phonetic: "khǎa", es: "kǎa", tone: "r", spanish: "leg", en: "leg", category: "cuerpo", lesson: 13 },
    { thai: "เท้า", phonetic: "tháo", es: "táo", tone: "h", spanish: "foot", en: "foot", category: "cuerpo", lesson: 13 },
    { thai: "มือ", phonetic: "muu", es: "muu", tone: "m", spanish: "hand", en: "hand", category: "cuerpo", lesson: 13 },
    { thai: "ปวด", phonetic: "pùuat", es: "pùuat", tone: "l", spanish: "to ache / to hurt (pain)", en: "to ache / to hurt (pain)", category: "cuerpo", lesson: 13 },
    { thai: "เจ็บ", phonetic: "jèp", es: "jèp", tone: "l", spanish: "to hurt / to be sore", en: "to hurt / to be sore", category: "cuerpo", lesson: 13 },
    { thai: "คลอด", phonetic: "khlôot", es: "klôt", tone: "f", spanish: "to give birth", en: "to give birth", category: "cuerpo", lesson: 13 },
    { thai: "ท้องแก้ว", phonetic: "tong-gâaew", es: "tong-gâew", tone: "m-l", spanish: "pregnant (formal)", en: "pregnant (formal)", category: "cuerpo", lesson: 13 },
    { thai: "กำลังกาย", phonetic: "gam-lang-gaai", es: "gam-lang-gaai", tone: "m-m-m", spanish: "body / exercise (gam-lang-gaai)", en: "body / exercise (gam-lang-gaai)", category: "cuerpo", lesson: 13 },
    { thai: "ออกกำลังกาย", phonetic: "ɔ̀ɔk gam-lang-gaai", es: "òk gam-lang-gaai", tone: "l-m-m-m", spanish: "to exercise", en: "to exercise", category: "cuerpo", lesson: 13 },
    { thai: "กีฬา", phonetic: "kii-laa", es: "kii-laa", tone: "m-m", spanish: "sport", en: "sport", category: "cuerpo", lesson: 13 },
    { thai: "เล่นกีฬา", phonetic: "lên kii-laa", es: "lên kii-laa", tone: "l-m-m", spanish: "to play sport", en: "to play sport", category: "cuerpo", lesson: 13 },
    { thai: "ทิศ", phonetic: "thít", es: "tít", tone: "h", spanish: "direction / cardinal point", en: "direction / cardinal point", category: "direcciones", lesson: 13 },
    { thai: "เหนือ", phonetic: "nǔea", es: "nǔea", tone: "r", spanish: "north", en: "north", category: "direcciones", lesson: 13 },
    { thai: "ใต้", phonetic: "dtâai", es: "dtâi", tone: "f", spanish: "south", en: "south", category: "direcciones", lesson: 13 },
    { thai: "ทิศตะวันออก", phonetic: "thít tà-wan-òk", es: "tít tà-wan-òk", tone: "h-m-m-l", spanish: "east", en: "east", category: "direcciones", lesson: 13 },
    { thai: "ทิศตะวันตก", phonetic: "thít tà-wan-tòk", es: "tít tà-wan-tòk", tone: "h-m-m-l", spanish: "west", en: "west", category: "direcciones", lesson: 13 },
    { thai: "อีสาน", phonetic: "ii-sǎam", es: "ii-sǎam", tone: "m-m", spanish: "Northeast (region of Thailand)", en: "Northeast (Isan)", category: "direcciones", lesson: 13 },
    { thai: "กลาง", phonetic: "klang", es: "klang", tone: "m", spanish: "center / middle", en: "center / middle", category: "direcciones", lesson: 13 },
    { thai: "ตรงกลาง", phonetic: "trom klang", es: "trom klang", tone: "m-m", spanish: "in the middle / center", en: "in the middle / center", category: "direcciones", lesson: 13 },
    { thai: "แยก", phonetic: "yâaek", es: "iâek", tone: "h", spanish: "intersection", en: "intersection", category: "direcciones", lesson: 13 },
    { thai: "ทางแยก", phonetic: "thaang yâaek", es: "tang iâek", tone: "m-h", spanish: "intersection / junction", en: "intersection / junction", category: "direcciones", lesson: 13 },
    { thai: "ตก", phonetic: "dtòk", es: "dtòk", tone: "l", spanish: "to fall", en: "to fall", category: "verbos", lesson: 13 },
    { thai: "ขอ", phonetic: "khɔ̌ɔ", es: "kǒr", tone: "r", spanish: "please / may I request", en: "please / may I request", category: "saludos", lesson: 13 },
    { thai: "ช่วยผมหน่อยครับ", phonetic: "chûai phǒm nòi khráp", es: "chuái pǒm nòi kráp", tone: "h-r-l-h", spanish: "please help me (male speaker)", en: "please help me (male speaker)", category: "saludos", lesson: 13 }
  ],
  phrases: [
    { thai: "สวัสดีครับผม", phonetic: "sà-wàt-dee khráp phǒm", es: "sà-uàt-di kráp pǒm", tone: "l-l-m-h-r", spanish: "hello, I am (male)", category: "saludos", lesson: 1, en: "hello, I am (male)" },
    { thai: "สวัสดีค่ะฉัน", phonetic: "sà-wàt-dee khâ chǎn", es: "sà-uàt-di kâ chǎn", tone: "l-l-m-f-r", spanish: "hello, I am (female)", category: "saludos", lesson: 1, en: "hello, I am (female)" },
    { thai: "ขอบคุณครับ", phonetic: "khòp-khun khráp", es: "kòp-kun kráp", tone: "l-m-h", spanish: "thank you (male)", category: "saludos", lesson: 1, en: "thank you (male)" },
    { thai: "ขอบคุณค่ะ", phonetic: "khòp-khun khâ", es: "kòp-kun kâ", tone: "l-m-f", spanish: "thank you (female)", category: "saludos", lesson: 1, en: "thank you (female)" },
    { thai: "ขอโทษครับ", phonetic: "khǎaw-thôot khráp", es: "kǒ-tôt kráp", tone: "r-f-h", spanish: "excuse me (male)", category: "saludos", lesson: 1, en: "excuse me (male)" },
    { thai: "ขอโทษค่ะ", phonetic: "khǎaw-thôot khâ", es: "kǒ-tôt kâ", tone: "r-f-f", spanish: "excuse me (female)", category: "saludos", lesson: 1, en: "excuse me (female)" },

    { thai: "เรากิน", phonetic: "rao gin", es: "rao guin", tone: "m-m", spanish: "we eat", category: "pronombres", lesson: 1, en: "we eat" },
    { thai: "เขาไป", phonetic: "khǎo bpai", es: "kǎo bpai", tone: "r-m", spanish: "he/she goes", category: "pronombres", lesson: 1, en: "he/she goes" },
    { thai: "คุณมี", phonetic: "khun mee", es: "kun mi", tone: "m-m", spanish: "you have", category: "pronombres", lesson: 1, en: "you have" },
    { thai: "เราชอบ", phonetic: "rao chôop", es: "rao chôp", tone: "m-f", spanish: "we like", category: "pronombres", lesson: 1, en: "we like" },
    { thai: "เขามา", phonetic: "khǎo maa", es: "kǎo ma", tone: "r-m", spanish: "he/she comes", category: "pronombres", lesson: 1, en: "he/she comes" },

    { thai: "ฉันไป", phonetic: "chǎn bpai", es: "chǎn bpai", tone: "r-m", spanish: "I go", category: "verbos", lesson: 1, en: "I go" },
    { thai: "ผมมา", phonetic: "phǒm maa", es: "pǒm ma", tone: "r-m", spanish: "I come", category: "verbos", lesson: 1, en: "I come" },
    { thai: "เขาเป็น", phonetic: "khǎo pen", es: "kǎo bpen", tone: "r-m", spanish: "he is", category: "verbos", lesson: 1, en: "he is" },
    { thai: "ฉันมี", phonetic: "chǎn mee", es: "chǎn mi", tone: "r-m", spanish: "I have", category: "verbos", lesson: 1, en: "I have" },
    { thai: "ผมไม่", phonetic: "phǒm mâi", es: "pǒm mâi", tone: "r-f", spanish: "I don't / I not", category: "verbos", lesson: 1, en: "I don't / I not" },
    { thai: "ใช่ไหม", phonetic: "châi măi", es: "châi mǎi", tone: "f-r", spanish: "right? / yes?", category: "verbos", lesson: 3, en: "right? / yes?" },
    { thai: "ไม่ใช่", phonetic: "mâi châi", es: "mâi châi", tone: "f-f", spanish: "is not / it's not", category: "verbos", lesson: 1, en: "is not / it's not" },
    { thai: "ผมเอา", phonetic: "phǒm ao", es: "pǒm ao", tone: "r-m", spanish: "I want (something)", category: "verbos", lesson: 1, en: "I want (something)" },
    { thai: "ฉันจะไป", phonetic: "chǎn jà bpai", es: "chǎn chà bpai", tone: "r-l-m", spanish: "I will go", category: "verbos", lesson: 1, en: "I will go" },
    { thai: "ผมจะกิน", phonetic: "phǒm jà gin", es: "pǒm chà guin", tone: "r-l-m", spanish: "I will eat", category: "verbos", lesson: 1, en: "I will eat" },
    { thai: "เขาอยากไป", phonetic: "khǎo yàak bpai", es: "kǎo yàk bpai", tone: "r-l-m", spanish: "he wants to go", category: "verbos", lesson: 1, en: "he wants to go" },

    { thai: "น้ำเย็น", phonetic: "náam yen", es: "nám ien", tone: "h-m", spanish: "cold water", category: "sabores", lesson: 1, en: "cold water" },
    { thai: "ผักอร่อย", phonetic: "phàk à-rôi", es: "pàk à-rôi", tone: "l-l-f", spanish: "the vegetables are delicious", category: "sabores", lesson: 1, en: "the vegetables are delicious" },
    { thai: "อาหารเผ็ด", phonetic: "aa-hǎan phèt", es: "a-jǎn pèt", tone: "m-r-l", spanish: "the food is spicy", category: "sabores", lesson: 1, en: "the food is spicy" },
    { thai: "อาหารอร่อย", phonetic: "aa-hǎan à-rôi", es: "a-jǎn à-rôi", tone: "m-r-l-f", spanish: "the food is delicious", category: "sabores", lesson: 1, en: "the food is delicious" },
    { thai: "ผลไม้หวาน", phonetic: "phǒn-lá-mái waan", es: "pǒn-lá-mái uan", tone: "r-h-h-m", spanish: "sweet fruit", category: "sabores", lesson: 1, en: "sweet fruit" },
    { thai: "อาหารไม่เค็ม", phonetic: "aa-hǎan mâi khem", es: "a-jǎn mâi kem", tone: "m-r-f-m", spanish: "the food is not salty", category: "sabores", lesson: 1, en: "the food is not salty" },
    { thai: "ฉันกินเผ็ดไม่ได้", phonetic: "chǎn gin phèt mâi dâi", es: "chǎn guin pèt mâi dâi", tone: "r-m-l-f-l", spanish: "No puedo comer picante", category: "sabores", lesson: 1, en: "I can't eat spicy" },
    { thai: "ผมไม่ชอบเปรี้ยว", phonetic: "phǒm mâi chôop prîao", es: "pǒm mâi chôp prîao", tone: "r-f-f-f", spanish: "I don't like sour", category: "sabores", lesson: 1, en: "I don't like sour" },

    { thai: "ข้าวผัดไก่", phonetic: "khâaw phàt gài", es: "kâo pàt gài", tone: "f-l-l", spanish: "fried rice with chicken", category: "comida", lesson: 1, en: "fried rice with chicken" },
    { thai: "ฉันกินข้าว", phonetic: "chǎn gin khâaw", es: "chǎn guin kâo", tone: "r-m-f", spanish: "I eat rice", category: "comida", lesson: 1, en: "I eat rice" },
    { thai: "ผมกินไก่", phonetic: "phǒm gin gài", es: "pǒm guin gài", tone: "r-m-l", spanish: "I eat chicken", category: "comida", lesson: 1, en: "I eat chicken" },
    { thai: "เขากินหมู", phonetic: "khǎo gin mǔu", es: "kǎo guin mǔ", tone: "r-m-r", spanish: "he eats pork", category: "comida", lesson: 1, en: "he eats pork" },
    { thai: "ผมชอบผัดไทย", phonetic: "phǒm chôop phàt-thai", es: "pǒm chôp pàt-tai", tone: "r-f-l-m", spanish: "I like pad thai", category: "comida", lesson: 1, en: "I like pad thai" },
    { thai: "ฉันชอบข้าว", phonetic: "chǎn chôop khâaw", es: "chǎn chôp kâo", tone: "r-f-f", spanish: "I like rice", category: "comida", lesson: 1, en: "I like rice" },
    { thai: "ผมไม่อยากกินเนื้อ", phonetic: "phǒm mâi yàak gin núea", es: "pǒm mâi yàk guin ñúa", tone: "r-f-l-m-h", spanish: "I don't want to eat meat", category: "comida", lesson: 1, en: "I don't want to eat meat" },
    { thai: "ฉันอยากกินผลไม้", phonetic: "chǎn yàak gin phǒn-lá-mái", es: "chǎn yàk guin pǒn-lá-mái", tone: "r-l-m-r-h-h", spanish: "I want to eat fruit", category: "comida", lesson: 1, en: "I want to eat fruit" },
    { thai: "คุณชอบกินอะไร", phonetic: "khun chôop gin a-rai", es: "kun chôp guin a-rai", tone: "m-f-m-m-m", spanish: "what do you like to eat?", category: "comida", lesson: 2, en: "what do you like to eat?" },

    { thai: "น้ำสองแก้ว", phonetic: "náam sǎawng kâaew", es: "nám sǒng kêo", tone: "h-r-f", spanish: "two glasses of water", category: "números", lesson: 7, en: "two glasses of water" },
    { thai: "ไก่ห้าตัว", phonetic: "gài hâa tua", es: "gài jâ dtua", tone: "l-f-m", spanish: "five chickens", category: "números", lesson: 6, en: "five chickens" },
    { thai: "ผมกินข้าวสองจาน", phonetic: "phǒm gin khâaw sǎawng jaan", es: "pǒm gûin kǎo sòng chan", tone: "r-f-r-l-m", spanish: "I eat two plates of rice", category: "números", lesson: 6, en: "I eat two plates of rice" },
    { thai: "เขามีปลาสิบตัว", phonetic: "khǎo mee plaa sìp tua", es: "kǎo mi bpla sìp dtua", tone: "r-m-m-l-m", spanish: "he has ten fish", category: "números", lesson: 6, en: "he has ten fish" },
    { thai: "ผมกินไข่สามฟอง", phonetic: "phǒm gin khài sǎam fong", es: "pǒm guin kài sǎm fong", tone: "r-m-l-r-m", spanish: "I eat three eggs", category: "números", lesson: 6, en: "I eat three eggs" },
    { thai: "อยากกินหมูหนึ่งจาน", phonetic: "yàak gin mǔu nùeng jaan", es: "chàk guin mǔ nùng chan", tone: "l-m-r-l-m", spanish: "I want to eat a plate of pork", category: "números", lesson: 6, en: "I want to eat a plate of pork" },
    { thai: "ฉันอยากกินผัดไทยสองจาน", phonetic: "chǎn yàak gin phàt-thai sǎawng jaan", es: "chǎn chàk guin pàt-tai sǒng chàn", tone: "r-l-m-l-m-r-l-m", spanish: "I want to eat two plates of pad thai", category: "números", lesson: 6, en: "I want to eat two plates of pad thai" },

    { thai: "คุณกินปลาไหม", phonetic: "khun gin plaa măi", es: "kun guin bpla mǎi", tone: "m-m-m-r", spanish: "do you eat fish?", category: "preguntas", lesson: 3, en: "do you eat fish?" },
    { thai: "คุณไปที่ไหน", phonetic: "khun bpai thîi-nǎi", es: "kun bpai tî-nǎi", tone: "m-m-f-r", spanish: "where are you going?", category: "preguntas", lesson: 2, en: "where are you going?" },
    { thai: "คุณเป็นอะไร", phonetic: "khun pen a-rai", es: "kun bpen à-rai", tone: "m-m-l-m", spanish: "what are you?", category: "preguntas", lesson: 2, en: "what are you?" },
    { thai: "เขามีอะไร", phonetic: "khǎo mee a-rai", es: "kǎo mi à-rai", tone: "r-m-l-m", spanish: "what does he have?", category: "preguntas", lesson: 2, en: "what does he have?" },
    { thai: "อาหารอะไรอร่อย", phonetic: "aa-hǎan a-rai à-rôi", es: "a-jǎn à-rai à-rôi", tone: "m-r-l-m-l-f", spanish: "what food is delicious?", category: "preguntas", lesson: 2, en: "what food is delicious?" },

    { thai: "ผมไปร้านอาหาร", phonetic: "phǒm bpai ráan-aa-hǎan", es: "pǒm bpai rán-a-jǎn", tone: "r-m-h-m-r", spanish: "I go to the restaurant", category: "tiendas", lesson: 2, en: "I go to the restaurant" },
    { thai: "เราไปร้านกาแฟ", phonetic: "rao bpai ráan-gaa-faa", es: "rao bpai rán-ga-fa", tone: "m-m-h-m-m", spanish: "we go to the cafe", category: "tiendas", lesson: 2, en: "we go to the cafe" },

    { thai: "เขามีหนังสือ", phonetic: "khǎo mee nǎng-sǔeu", es: "kǎo mi nǎng-sǔe", tone: "r-m-r-r", spanish: "he has a book", category: "sustantivos", lesson: 2, en: "he has a book" },
    { thai: "ฉันเอาหนังสือ", phonetic: "chǎn ao nǎng-sǔeu", es: "chǎn ao nǎng-sǔe", tone: "r-m-r-r", spanish: "I want a book", category: "sustantivos", lesson: 2, en: "I want a book" },

    { thai: "ผมเอาอันนี้", phonetic: "phǒm ao an-nîi", es: "pǒm ao an-ní", tone: "r-m-m-h", spanish: "I want this (object)", category: "verbos", lesson: 2, en: "I want this (object)" },
    { thai: "เอาอันนั้นครับ", phonetic: "ao an-nân khráp", es: "ao an-nán kráp", tone: "m-m-h-h", spanish: "I want that one, please", category: "verbos", lesson: 2, en: "I want that one, please" },
    { thai: "ผมอยากไปห้องน้ำ", phonetic: "phǒm yàak bpai hông-náam", es: "pǒm yàk bpai jông-nâm", tone: "r-l-m-f-f", spanish: "I want to go to the bathroom", category: "preguntas", lesson: 2, en: "I want to go to the bathroom" },
    { thai: "ห้องน้ำอยู่ที่นี่", phonetic: "hông-náam yùu thîi-nîi", es: "jông-nâm iû tî-nî", tone: "f-f-f-f-f", spanish: "the bathroom is here", category: "preguntas", lesson: 2, en: "the bathroom is here" },
    { thai: "คุณมาจากที่ไหน", phonetic: "khun maa jàak thîi-nǎi", es: "kun ma chàk tî-nǎi", tone: "m-m-l-f-r", spanish: "where do you come from?", category: "preguntas", lesson: 2, en: "where do you come from?" },
    { thai: "ผมมาจากห้อง", phonetic: "phǒm maa jàak hông", es: "pǒm ma chàk chông", tone: "r-m-l-f", spanish: "I come from the room", category: "pronombres", lesson: 2, en: "I come from the room" },
    { thai: "คุณอยากไปที่ไหน", phonetic: "khun yàak bpai thîi-nǎi", es: "kun yàk bpai tî-nǎi", tone: "m-l-m-f-r", spanish: "where do you want to go?", category: "preguntas", lesson: 2, en: "where do you want to go?" },
    { thai: "ผมอยากกินข้าวที่ร้านอาหาร", phonetic: "phǒm yàak gin khâaw thîi ráan-aa-hǎan", es: "pǒm yàk guin kâo tî rán-a-jǎn", tone: "r-l-m-f-f-h-m-r", spanish: "I want to eat at the restaurant", category: "tiendas", lesson: 2, en: "I want to eat at the restaurant" },

    // Lesson 3 - Phrases
    { thai: "ผมกินอาหารไทยได้", phonetic: "phǒm gin aa-hǎan thai dâi", es: "pǒm gin a-jǎn tai dâi", tone: "r-m-m-r-m-f", spanish: "I can eat Thai food", category: "verbos", lesson: 3, en: "I can eat Thai food" },
    { thai: "ผมอยากได้ครูไทย", phonetic: "phǒm yàak dâi khruu thai", es: "pǒm yàk dâi kru tai", tone: "r-l-f-m-m", spanish: "I want a Thai teacher", category: "sustantivos", lesson: 3, en: "I want a Thai teacher" },
    { thai: "คุณพูดไทยได้ไหม", phonetic: "khun phûut thai dâi măi", es: "kun pût tai dâi mǎi", tone: "m-f-m-f-r", spanish: "can you speak Thai?", category: "preguntas", lesson: 3, en: "can you speak Thai?" },
    { thai: "ผมฟังไทยได้", phonetic: "phǒm fang thai dâi", es: "pǒm fang tai dâi", tone: "r-m-m-f", spanish: "I can understand Thai", category: "verbos", lesson: 3, en: "I can understand Thai" },
    { thai: "ผมทำอาหารได้", phonetic: "phǒm tam-aa-hǎan dâi", es: "pǒm tam-a-jǎn dâi", tone: "r-m-m-r-f", spanish: "I can cook", category: "verbos", lesson: 3, en: "I can cook" },
    { thai: "ผมทำงาน", phonetic: "phǒm tam-ngaan", es: "pǒm tam-ngan", tone: "r-m-m", spanish: "I work", category: "verbos", lesson: 3, en: "I work" },
    { thai: "ผมพูดไทยได้นิดหน่อย", phonetic: "phǒm phûut thai dâi nìt-nɔ̀ɔy", es: "pǒm pût tai dâi nìt-nòi", tone: "r-f-m-f-l-l", spanish: "I can speak Thai a little", category: "verbos", lesson: 3, en: "I can speak Thai a little" },
    { thai: "ครูสอนอะไร", phonetic: "khruu sɔ̌ɔn a-rai", es: "kru sǒn à-rai", tone: "m-r-l-m", spanish: "what does the teacher teach?", category: "preguntas", lesson: 3, en: "what does the teacher teach?" },
    { thai: "ผมทำอาหารไทย", phonetic: "phǒm tam-aa-hǎan thai", es: "pǒm tam-a-jǎn tai", tone: "r-m-m-r-m", spanish: "I cook Thai food", category: "verbos", lesson: 3, en: "I cook Thai food" },
    { thai: "ยินดีที่ได้รู้จัก", phonetic: "yin-dee thîi dâi rúu-jàk", es: "chin-di tî dâi rǔ-chàk", tone: "m-m-f-f-r-l", spanish: "nice to meet you", category: "saludos", lesson: 3, en: "nice to meet you" },

    // Lesson 4 - Phrases
    { thai: "สบายดีไหมครับ", phonetic: "sà-baai dee măi khráp", es: "sà-bai di mǎi kráp", tone: "l-m-m-r-h", spanish: "how are you? (male)", category: "saludos", lesson: 4, en: "how are you? (male)" },
    { thai: "สบายดีไหมค่ะ", phonetic: "sà-baai dee măi khâ", es: "sà-bai di mǎi kâ", tone: "l-m-m-r-f", spanish: "how are you? (female)", category: "saludos", lesson: 4, en: "how are you? (female)" },
    { thai: "สบายดีครับ", phonetic: "sà-baai dee khráp", es: "sà-bai di kráp", tone: "l-m-m-h", spanish: "I'm fine (male)", category: "saludos", lesson: 4, en: "I'm fine (male)" },
    { thai: "สบายดีค่ะ", phonetic: "sà-baai dee khâ", es: "sà-bai di kâ", tone: "l-m-m-f", spanish: "I'm fine (female)", category: "saludos", lesson: 4, en: "I'm fine (female)" },
    { thai: "ผมทำงานโรงแรม", phonetic: "phǒm tam-ngaan roong-raem", es: "pǒm tam-ngan rong-rem", tone: "r-m-m-m-m", spanish: "I work at the hotel", category: "verbos", lesson: 4, en: "I work at the hotel" },
    { thai: "ฉันมาจากสเปน", phonetic: "chǎn maa jàak sà-pen", es: "chǎn ma chàk sà-bpen", tone: "r-m-l-l-m", spanish: "I come from Spain", category: "pronombres", lesson: 4, en: "I come from Spain" },
    { thai: "เรามาจากประเทศไทย", phonetic: "rao maa jàak prà-thêet thai", es: "rao ma chàk bprà-tét tai", tone: "m-m-l-l-h-m", spanish: "we come from Thailand", category: "pronombres", lesson: 4, en: "we come from Thailand" },
    { thai: "พวกเขานอน", phonetic: "phǔuak khǎo nɔɔn", es: "púak kǎo non", tone: "h-r-m", spanish: "they sleep", category: "verbos", lesson: 4, en: "they sleep" },
    { thai: "พยาบาลดูแล", phonetic: "pha-yaa-baan duu-lɛɛ", es: "pa-ya-ban du-lě", tone: "m-m-m-m-r", spanish: "the nurse takes care", category: "sustantivos", lesson: 4, en: "the nurse takes care" },
    { thai: "มันดีมาก", phonetic: "man dee mâak", es: "man di mâk", tone: "m-m-f", spanish: "that is very good", category: "pronombres", lesson: 4, en: "that is very good" },

    // Lesson 5 - Phrases
    { thai: "ผมเรียน", phonetic: "phǒm rian", es: "pǒm rian", tone: "r-m", spanish: "I study", category: "verbos", lesson: 5, en: "I study" },
    { thai: "ผมเรียนที่โรงเรียน", phonetic: "phǒm rian thîi roong-riian", es: "pǒm rian tî rong-rian", tone: "r-m-f-m-m", spanish: "I study at school", category: "verbos", lesson: 5, en: "I study at school" },
    { thai: "ผมคิดถึงคุณ", phonetic: "phǒm khít-teung khun", es: "pǒm kìd-těung kun", tone: "r-l-r-m", spanish: "I miss you", category: "verbos", lesson: 5, en: "I miss you" },
    { thai: "เราเที่ยว", phonetic: "rao thîao", es: "rao tîo", tone: "m-f", spanish: "we travel", category: "verbos", lesson: 5, en: "we travel" },
    { thai: "เข้าใจไหม", phonetic: "khâo-jai măi", es: "kâo-chai mǎi", tone: "f-m-r", spanish: "do you understand?", category: "preguntas", lesson: 5, en: "do you understand?" },
    { thai: "ผมเข้าใจ", phonetic: "phǒm khâo-jai", es: "pǒm kâo-chai", tone: "r-f-m", spanish: "I understand", category: "verbos", lesson: 5, en: "I understand" },
    { thai: "ผมไม่เข้าใจ", phonetic: "phǒm mâi khâo-jai", es: "pǒm mâi kâo-chai", tone: "r-f-f-m", spanish: "I don't understand", category: "verbos", lesson: 5, en: "I don't understand" },
    { thai: "ผมซื้อของ", phonetic: "phǒm súeu kǒng", es: "pǒm sú-kǒng", tone: "r-h-r", spanish: "I go shopping", category: "verbos", lesson: 5, en: "I go shopping" },
    { thai: "เราไปห้าง", phonetic: "rao bpai hâng", es: "rao bpai jâng", tone: "m-m-f", spanish: "we go to the mall", category: "tiendas", lesson: 5, en: "we go to the mall" },
    { thai: "เขาซื้อของที่ตลาด", phonetic: "khǎo súeu kǒng thîi tà-làat", es: "kǎo sú-kǒng tî tà-lat", tone: "r-h-r-f-l-m", spanish: "he buys things at the market", category: "tiendas", lesson: 5, en: "he buys things at the market" },
    { thai: "เราไปตลาดกลางคืน", phonetic: "rao bpai tà-làat klang-kheun", es: "rao bpai dtà-lat-klang-ken", tone: "m-m-l-m-m-m", spanish: "we go to the night market", category: "tiendas", lesson: 5, en: "we go to the night market" },
    { thai: "ของกินที่ตลาดเช้าอร่อย", phonetic: "kǒng-gin thîi tà-làat cháo à-rôi", es: "kǒng-guin tî dtà-lat-chǎo à-rôi", tone: "r-m-f-l-m-r-m-f", spanish: "la comida del mercado matutino es deliciosa", category: "tiendas", lesson: 5, en: "the food at the morning market is delicious" },
    { thai: "เขาเข้าห้องน้ำ", phonetic: "khǎo khâo hông-náam", es: "kǎo kâo jông-nám", tone: "r-f-f-h", spanish: "he goes into the bathroom", category: "verbos", lesson: 5, en: "he goes into the bathroom" },
    { thai: "เราออกไป", phonetic: "rao ɔ̀ɔk bpai", es: "rao òk-bpai", tone: "m-l-m", spanish: "we go out", category: "verbos", lesson: 5, en: "we go out" },

    // Lesson 6 - Number phrases
    { thai: "หนึ่งร้อย", phonetic: "nùeng rɔ́ɔy", es: "nùng rói", tone: "l-h", spanish: "one hundred (100)", category: "números", lesson: 6, en: "one hundred (100)" },
    { thai: "หนึ่งร้อยเอ็ด", phonetic: "nùeng rɔ́ɔy èt", es: "nùng rói èt", tone: "l-h-l", spanish: "one hundred and one (101)", category: "números", lesson: 6, en: "one hundred and one (101)" },
    { thai: "หนึ่งร้อยสิบเอ็ด", phonetic: "nùeng rɔ́ɔy sìp-èt", es: "nùng rói sìp-èt", tone: "l-h-l-l", spanish: "one hundred and eleven (111)", category: "números", lesson: 6, en: "one hundred and eleven (111)" },
    { thai: "เจ็ดร้อยห้าสิบเอ็ด", phonetic: "jèt rɔ́ɔy hâa-sìp èt", es: "chèt rói châ-sìp èt", tone: "l-h-f-l-l", spanish: "seven hundred fifty-one (751)", category: "números", lesson: 6, en: "seven hundred fifty-one (751)" },
    { thai: "เก้าร้อยสี่สิบแปด", phonetic: "kâo rɔ́ɔy sìi-sìp bpàaet", es: "kâo rói sì-sìp bpèt", tone: "f-h-l-l-l", spanish: "nine hundred forty-eight (948)", category: "números", lesson: 6, en: "nine hundred forty-eight (948)" },
    { thai: "เก้าพันหกร้อยยี่สิบเอ็ด", phonetic: "kâo phan hòk rɔ́ɔy yîi-sìp èt", es: "kâo pan jòk rói yî-sìp èt", tone: "f-m-l-h-f-l-l", spanish: "nine thousand six hundred twenty-one (9,621)", category: "números", lesson: 6, en: "nine thousand six hundred twenty-one (9,621)" },
    { thai: "กี่บาท", phonetic: "kìi bàat", es: "kì bàt", tone: "l-l", spanish: "how many baht?", category: "preguntas", lesson: 6, en: "how many baht?" },
    { thai: "กี่อัน", phonetic: "kìi an", es: "kì an", tone: "l-m", spanish: "how many (things)?", category: "preguntas", lesson: 6, en: "how many (things)?" },
    { thai: "ราคาเท่าไหร่", phonetic: "raa-khaa thâo-rài", es: "ra-ka tâo-râi", tone: "m-m-f-f", spanish: "how much is the price?", category: "preguntas", lesson: 6, en: "how much is the price?" },
    { thai: "ผมกินแล้ว", phonetic: "phǒm gin lɛ̂ɛo", es: "pǒm guin lêo", tone: "r-m-f", spanish: "I already ate", category: "verbos", lesson: 6, en: "I already ate" },
    { thai: "ผมกำลังกิน", phonetic: "phǒm gam-lang gin", es: "pǒm gam-lang guin", tone: "r-m-m-m", spanish: "I am eating (-ing)", category: "verbos", lesson: 6, en: "I am eating (-ing)" },
    { thai: "เขากำลังเรียน", phonetic: "khǎo gam-lang rian", es: "kǎo gam-lang rian", tone: "r-m-m-m", spanish: "he is studying (-ing)", category: "verbos", lesson: 6, en: "he is studying (-ing)" },
    { thai: "คุณจะไปเมื่อไร", phonetic: "khun jà bpai mʉ̂a-rai", es: "kun chà bpai mûa-rai", tone: "m-l-m-f-m", spanish: "when will you go?", category: "preguntas", lesson: 6, en: "when will you go?" },
    { thai: "ใครขาย", phonetic: "khrai khǎay", es: "krai kǎi", tone: "m-r", spanish: "who sells?", category: "preguntas", lesson: 6, en: "who sells?" },

    // Lesson 7 - Phrases
    { thai: "คุณชื่ออะไร", phonetic: "khun chûue a-rai", es: "kun chûe à-rai", tone: "m-f-l-m", spanish: "what's your name?", category: "preguntas", lesson: 7, en: "what's your name?" },
    { thai: "ผมชื่อ", phonetic: "phǒm chûue", es: "pǒm chûe", tone: "r-f", spanish: "my name is", category: "pronombres", lesson: 7, en: "my name is" },
    { thai: "คุณอยู่ที่ไหน", phonetic: "khun yùu thîi-nǎi", es: "kun iù tî-nǎi", tone: "m-l-f-r", spanish: "where do you live?", category: "preguntas", lesson: 7, en: "where do you live?" },
    { thai: "ผมอยู่บ้าน", phonetic: "phǒm yùu bâan", es: "pǒm iù bân", tone: "r-l-f", spanish: "I'm at home", category: "sustantivos", lesson: 7, en: "I'm at home" },
    { thai: "ผมอยู่กรุงเทพ", phonetic: "phǒm yùu krung-thêep", es: "pǒm iù krung-tép", tone: "r-l-m-h", spanish: "I live in Bangkok", category: "sustantivos", lesson: 7, en: "I live in Bangkok" },
    { thai: "ผมอ่านหนังสือ", phonetic: "phǒm àan nǎng-sǔeu", es: "pǒm àn nǎng-sǔe", tone: "r-l-r-r", spanish: "I read a book", category: "verbos", lesson: 7, en: "I read a book" },
    { thai: "ผมดูทีวี", phonetic: "phǒm duu thii-wii", es: "pǒm du ti-wi", tone: "r-m-m-m", spanish: "I watch TV", category: "verbos", lesson: 7, en: "I watch TV" },
    { thai: "ผมดูการ์ตูน", phonetic: "phǒm duu gaai-dtuun", es: "pǒm du ga-dtun", tone: "r-m-m-m", spanish: "I watch cartoons", category: "verbos", lesson: 7, en: "I watch cartoons" },
    { thai: "ครูสอนอังกฤษ", phonetic: "khruu sɔ̌ɔn ang-grìt", es: "kru sòn an-grìt", tone: "m-l-m-l", spanish: "the teacher teaches English", category: "verbos", lesson: 7, en: "the teacher teaches English" },
    { thai: "ผมเรียนภาษาอังกฤษ", phonetic: "phǒm rian phaa-sǎa ang-grìt", es: "pǒm rian pǎ-sa an-grìt", tone: "r-m-r-m-m-l", spanish: "I study English", category: "verbos", lesson: 7, en: "I study English" },
    { thai: "น้ำหนึ่งแก้ว", phonetic: "náam nùeng gâaew", es: "nám nùng kéo", tone: "h-l-h", spanish: "one glass of water", category: "sustantivos", lesson: 7, en: "one glass of water" },
    { thai: "บิลเบาอยู่สเปน", phonetic: "bin-bao yùu sà-pen", es: "bil-bao iù sà-bpen", tone: "m-m-l-l-m", spanish: "Bilbao is in Spain", category: "sustantivos", lesson: 7, en: "Bilbao is in Spain" },
    { thai: "กินปาเอยา", phonetic: "gin paa-ee-yaa", es: "guin bpa-e-yâ", tone: "m-m-m-f", spanish: "to eat paella", category: "comida", lesson: 7, en: "to eat paella" },
    { thai: "ส่งของ", phonetic: "sòng kǒng", es: "sòng kǒng", tone: "l-r", spanish: "to send things", category: "verbos", lesson: 7, en: "to send things" },

    // Lesson 8 — Lugares y demostrativos

    // Lesson 8 — Tiempo (días y momentos del día)

    // Lesson 8 — Días de la semana

    // Lesson 8 — Bolígrafos con clasificador อัน
    { thai: "ปากกา หนึ่ง อัน", phonetic: "paa-gaa nùeng an", es: "bpa-ga nùng an", tone: "m-m-l-m", spanish: "one pen", category: "sustantivos", lesson: 8, en: "one pen" },
    { thai: "ปากกา สอง อัน", phonetic: "paa-gaa sǎawng an", es: "bpa-ga sǒng an", tone: "m-m-r-m", spanish: "two pens", category: "sustantivos", lesson: 8, en: "two pens" },
    // Lesson 9 — Telling Time (phrases)
    { thai: "ตอนนี้กี่โมง", phonetic: "dton-níi kìi mong", es: "dton-ní kì mong", tone: "m-h-l-m", spanish: "what time is it now?", en: "what time is it now?", category: "tiempo", lesson: 9 },
    { thai: "เที่ยงแล้ว", phonetic: "thîang lɛ̂ɛo", es: "tîeng leâo", tone: "f-f", spanish: "it's noon already", en: "it's noon already", category: "tiempo", lesson: 9 },
    { thai: "เที่ยงคืนแล้ว", phonetic: "thîang kheun lɛ̂ɛo", es: "tîeng ken leâo", tone: "f-m-f", spanish: "it's midnight already", en: "it's midnight already", category: "tiempo", lesson: 9 },
    { thai: "สองทุ่มแล้ว", phonetic: "sǎawng thùm lɛ̂ɛo", es: "sǒng tum leâo", tone: "r-f-f", spanish: "it's 8 PM already (2 tum)", en: "it's 8 PM already (2 tum)", category: "tiempo", lesson: 9 },
    { thai: "ตีสามแล้ว", phonetic: "dtii sǎam lɛ̂ɛo", es: "dtii sǎm leâo", tone: "m-m-f", spanish: "it's 3 AM already", en: "it's 3 AM already", category: "tiempo", lesson: 9 },
    { thai: "เวลากี่โมง", phonetic: "way-laa kìi mong", es: "ue-la kì mong", tone: "m-m-l-m", spanish: "what time? (time + how many hours)", en: "what time?", category: "tiempo", lesson: 9 },
    { thai: "จองเวลา", phonetic: "jong way-laa", es: "chong ue-la", tone: "m-m-m", spanish: "to book a time", en: "to book a time", category: "verbos", lesson: 9 },
    { thai: "อาหารเที่ยงอร่อย", phonetic: "aa-hǎan thîang à-rôi", es: "a-jǎn tîeng à-rôi", tone: "m-r-f-l-f", spanish: "lunch is delicious", en: "lunch is delicious", category: "comida", lesson: 9 },
    { thai: "ตอนนี้เที่ยง", phonetic: "dton-níi thîang", es: "dton-ní tîeng", tone: "m-h-f", spanish: "now it's noon", en: "now it's noon", category: "tiempo", lesson: 9 },
    { thai: "เตรียมนอนสองทุ่ม", phonetic: "dtriiam nɔɔn sǎawng thùm", es: "dtrîam non sǒng tûm", tone: "f-m-r-f", spanish: "bedtime at 8 PM (2 tum)", en: "bedtime at 8 PM (2 tum)", category: "tiempo", lesson: 9 },
    { thai: "เตรียมนอนเที่ยงคืน", phonetic: "dtriiam nɔɔn thîang kheun", es: "dtrîam non tîeng ken", tone: "f-m-f-m", spanish: "bedtime at midnight", en: "bedtime at midnight", category: "tiempo", lesson: 9 },
    { thai: "ถึงเวลาเตรียมนอน", phonetic: "thǔeng way-laa dtriiam nɔɔn", es: "tǔeng ue-la dtrîam non", tone: "r-m-m-f-m", spanish: "it's time for bed", en: "it's time for bed", category: "tiempo", lesson: 9 },

    { thai: "สวัสดีค่ะ", phonetic: "sà-wàt-dee khâ", es: "sà-uàt-di kâ", tone: "l-l-m-f", spanish: "hello (female)", category: "saludos", en: "hello (female)" },
    { thai: "สวัสดีครับ", phonetic: "sà-wàt-dee khráp", es: "sà-uàt-di kráp", tone: "l-l-m-h", spanish: "hello (male)", category: "saludos", en: "hello (male)" },
    { thai: "สถานีตำรวจ", phonetic: "sa-thaa-nii tam-rùat", es: "sà-tǎ-ni-tam-rúat", tone: "l-r-m-m-h", image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=180&h=180&fit=crop&auto=format", spanish: "police station", category: "tiendas", lesson: 2, en: "police station" },
    { thai: "ยินดีค่ะ", phonetic: "yin-dee khâ", es: "yin-di kâ", tone: "m-m-f", spanish: "you're welcome (female)", category: "saludos", lesson: 3, en: "you're welcome (female)" },
    { thai: "ยินดีครับ", phonetic: "yin-dee khráp", es: "yin-di kráp", tone: "m-m-h", spanish: "you're welcome (male)", category: "saludos", lesson: 3, en: "you're welcome (male)" },
    { thai: "มาจาก", phonetic: "maa jàak", es: "ma chàk", tone: "m-l", spanish: "to come from", category: "verbos", lesson: 4, en: "to come from" },
    { thai: "ประเทศไทย", phonetic: "prà-thêet thai", es: "bprà-tét tai", tone: "l-h-m", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=180&h=180&fit=crop&auto=format", spanish: "Thailand", category: "sustantivos", lesson: 4, en: "Thailand" },
    { thai: "สบายดี", phonetic: "sà-baai dee", es: "sà-bai di", tone: "l-m-m", spanish: "I'm fine / how are you?", category: "saludos", lesson: 4, en: "I'm fine / how are you?" },
    { thai: "สบายดีไหม", phonetic: "sà-baai dee măi", es: "sà-bai di mǎi", tone: "l-m-m-r", spanish: "how are you? (are you fine?)", category: "saludos", lesson: 4, en: "how are you?" },
    { thai: "สบายดีครับ", phonetic: "sà-baai dee khráp", es: "sà-bai di kráp", tone: "l-m-m-h", spanish: "I'm fine (male)", category: "saludos", lesson: 4, en: "I'm fine (male)" },
    { thai: "สบายดีค่ะ", phonetic: "sà-baai dee khâ", es: "sà-bai di kâ", tone: "l-m-m-f", spanish: "I'm fine (female)", category: "saludos", lesson: 4, en: "I'm fine (female)" },
    { thai: "ออกไป", phonetic: "ɔ̀ɔk bpai", es: "òk-bpai", tone: "l-m", spanish: "to go out", category: "verbos", lesson: 5, en: "to go out" },
    { thai: "ซื้อของ", phonetic: "súeu kǒng", es: "sú-kǒng", tone: "h-r", spanish: "to shop / shopping", category: "verbos", lesson: 5, en: "to shop" },
    { thai: "ตลาดกลางคืน", phonetic: "tà-làat klang-kheun", es: "dtà-lat-klang-ken", tone: "l-m-m-m", image: "https://images.unsplash.com/photo-1555992457-b8a78e0bc669?w=180&h=180&fit=crop&auto=format", spanish: "night market", category: "tiendas", lesson: 5, en: "night market" },
    { thai: "ตลาดเช้า", phonetic: "tà-làat cháo", es: "dtà-lat-chǎo", tone: "l-m-r", image: "https://images.unsplash.com/photo-1555992457-b8a78e0bc669?w=180&h=180&fit=crop&auto=format", spanish: "morning market", category: "tiendas", lesson: 5, en: "morning market" },
    { thai: "หนึ่งร้อย", phonetic: "nùeng rɔ́ɔy", es: "nùng rói", tone: "l-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "one hundred (100)", category: "números", lesson: 6, en: "one hundred (100)" },
    { thai: "สองร้อย", phonetic: "sǎawng rɔ́ɔy", es: "sǒng rói", tone: "r-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "two hundred (200)", category: "números", lesson: 6, en: "two hundred (200)" },
    { thai: "สามร้อย", phonetic: "sǎam rɔ́ɔy", es: "sǎm rói", tone: "r-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "three hundred (300)", category: "números", lesson: 6, en: "three hundred (300)" },
    { thai: "สี่ร้อย", phonetic: "sìi rɔ́ɔy", es: "sì rói", tone: "l-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "four hundred (400)", category: "números", lesson: 6, en: "four hundred (400)" },
    { thai: "ห้าร้อย", phonetic: "hâa rɔ́ɔy", es: "jâ rói", tone: "f-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "five hundred (500)", category: "números", lesson: 6, en: "five hundred (500)" },
    { thai: "หกร้อย", phonetic: "hòk rɔ́ɔy", es: "jòk rói", tone: "l-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "six hundred (600)", category: "números", lesson: 6, en: "six hundred (600)" },
    { thai: "เจ็ดร้อย", phonetic: "jèt rɔ́ɔy", es: "chèt rói", tone: "l-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "seven hundred (700)", category: "números", lesson: 6, en: "seven hundred (700)" },
    { thai: "แปดร้อย", phonetic: "bpàaet rɔ́ɔy", es: "bpèt rói", tone: "l-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "eight hundred (800)", category: "números", lesson: 6, en: "eight hundred (800)" },
    { thai: "เก้าร้อย", phonetic: "kâo rɔ́ɔy", es: "kâo rói", tone: "f-h", image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=180&h=180&fit=crop&auto=format", spanish: "nine hundred (900)", category: "números", lesson: 6, en: "nine hundred (900)" },
    { thai: "รายการทีวี", phonetic: "raai-gaan thii-wii", es: "rai-gan ti-wi", tone: "m-m-m-m", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=180&h=180&fit=crop&auto=format", spanish: "TV show", category: "sustantivos", lesson: 7, en: "TV show" },
    { thai: "ตีหนึ่ง", phonetic: "dtii nùeng", es: "dtii nùng", tone: "m-l", spanish: "1 AM", en: "1 AM", category: "tiempo", lesson: 9 },
    { thai: "ตีสอง", phonetic: "dtii sǎawng", es: "dtii sǒng", tone: "m-r", spanish: "2 AM", en: "2 AM", category: "tiempo", lesson: 9 },
    { thai: "ตีสาม", phonetic: "dtii sǎam", es: "dtii sǎm", tone: "m-m", spanish: "3 AM", en: "3 AM", category: "tiempo", lesson: 9 },
    { thai: "ตีสี่", phonetic: "dtii sìi", es: "dtii sì", tone: "m-l", spanish: "4 AM", en: "4 AM", category: "tiempo", lesson: 9 },
    { thai: "ตีห้า", phonetic: "dtii hâa", es: "dtii jâ", tone: "m-f", spanish: "5 AM", en: "5 AM", category: "tiempo", lesson: 9 },
    { thai: "โมงเช้า", phonetic: "mong cháo", es: "mong cháo", tone: "m-h", spanish: "morning hour (6-11 AM)", en: "morning hour (6-11 AM)", category: "tiempo", lesson: 9 },
    { thai: "หกโมงเช้า", phonetic: "hòk mong cháo", es: "hòk mong cháo", tone: "l-m-h", spanish: "6 AM", en: "6 AM", category: "tiempo", lesson: 9 },
    { thai: "เจ็ดโมงเช้า", phonetic: "jèt mong cháo", es: "chèt mong cháo", tone: "l-m-h", spanish: "7 AM", en: "7 AM", category: "tiempo", lesson: 9 },
    { thai: "แปดโมงเช้า", phonetic: "bpàet mong cháo", es: "bpèt mong cháo", tone: "l-m-h", spanish: "8 AM", en: "8 AM", category: "tiempo", lesson: 9 },
    { thai: "เก้าโมงเช้า", phonetic: "kâao mong cháo", es: "kâo mong cháo", tone: "f-m-h", spanish: "9 AM", en: "9 AM", category: "tiempo", lesson: 9 },
    { thai: "สิบโมงเช้า", phonetic: "sìp mong cháo", es: "sip mong cháo", tone: "l-m-h", spanish: "10 AM", en: "10 AM", category: "tiempo", lesson: 9 },
    { thai: "สิบเอ็ดโมงเช้า", phonetic: "sìp-ét mong cháo", es: "sip-ét mong cháo", tone: "l-h-m-h", spanish: "11 AM", en: "11 AM", category: "tiempo", lesson: 9 },
    { thai: "อาหารเที่ยง", phonetic: "aa-hǎan thîang", es: "a-jǎn tîeng", tone: "m-r-f", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=180&h=180&fit=crop&auto=format", spanish: "lunch (noon food)", en: "lunch (noon food)", category: "comida", lesson: 9 },
    { thai: "บ่ายโมง", phonetic: "bàai mong", es: "bài mong", tone: "l-m", spanish: "1 PM (afternoon hour)", en: "1 PM", category: "tiempo", lesson: 9 },
    { thai: "บ่ายสองโมง", phonetic: "bàai sǎawng mong", es: "bài sǒng mong", tone: "l-r-m", spanish: "2 PM", en: "2 PM", category: "tiempo", lesson: 9 },
    { thai: "บ่ายสามโมง", phonetic: "bàai sǎam mong", es: "bài sǎm mong", tone: "l-m-m", spanish: "3 PM", en: "3 PM", category: "tiempo", lesson: 9 },
    { thai: "บ่ายสี่โมง", phonetic: "bàai sìi mong", es: "bài sì mong", tone: "l-l-m", spanish: "4 PM", en: "4 PM", category: "tiempo", lesson: 9 },
    { thai: "โมงเย็น", phonetic: "mong yen", es: "mong ien", tone: "m-m", spanish: "evening hour (4-6 PM)", en: "evening hour (4-6 PM)", category: "tiempo", lesson: 9 },
    { thai: "ห้าโมงเย็น", phonetic: "hâa mong yen", es: "jâ mong ien", tone: "f-m-m", spanish: "5 PM", en: "5 PM", category: "tiempo", lesson: 9 },
    { thai: "หกโมงเย็น", phonetic: "hòk mong yen", es: "hòk mong ien", tone: "l-m-m", spanish: "6 PM", en: "6 PM", category: "tiempo", lesson: 9 },
    { thai: "หนึ่งทุ่ม", phonetic: "nùeng thùm", es: "nùng tum", tone: "l-f", spanish: "7 PM (1 tum)", en: "7 PM (1 tum)", category: "tiempo", lesson: 9 },
    { thai: "สองทุ่ม", phonetic: "sǎawng thùm", es: "sǒng tum", tone: "r-f", spanish: "8 PM (2 tum)", en: "8 PM (2 tum)", category: "tiempo", lesson: 9 },
    { thai: "สามทุ่ม", phonetic: "sǎam thùm", es: "sǎm tum", tone: "m-f", spanish: "9 PM (3 tum)", en: "9 PM (3 tum)", category: "tiempo", lesson: 9 },
    { thai: "สี่ทุ่ม", phonetic: "sìi thùm", es: "sì tum", tone: "l-f", spanish: "10 PM (4 tum)", en: "10 PM (4 tum)", category: "tiempo", lesson: 9 },
    { thai: "ห้าทุ่ม", phonetic: "hâa thùm", es: "jâ tum", tone: "f-f", spanish: "11 PM (5 tum)", en: "11 PM (5 tum)", category: "tiempo", lesson: 9 },
    { thai: "เที่ยงคืน", phonetic: "thîang kheun", es: "tîeng ken", tone: "f-m", spanish: "midnight", en: "midnight", category: "tiempo", lesson: 9 },
    { thai: "กี่โมง", phonetic: "kìi mong", es: "kì mong", tone: "l-m", spanish: "what time? (daytime)", en: "what time? (daytime)", category: "preguntas", lesson: 9 },
    { thai: "เตรียมนอน", phonetic: "dtriiam nɔɔn", es: "dtrîam non", tone: "f-m", spanish: "bedtime (prepare to sleep)", en: "bedtime (prepare to sleep)", category: "tiempo", lesson: 9 },

    // === LESSON 10: FRASES — COLORES ===
    { thai: "สีอะไร", phonetic: "sǐi a-rai", es: "sǐ à-rai", tone: "m-l-m", spanish: "what color?", en: "what color?", category: "colores", lesson: 10 },
    { thai: "สีโปรด", phonetic: "sǐi pròot", es: "sǐ pròt", tone: "m-l", spanish: "favorite color", en: "favorite color", category: "colores", lesson: 10 },
    { thai: "ชอบสีแดง", phonetic: "chôop sǐi-dǎeng", es: "chóp sǐ-dǎeng", tone: "f-l-r", spanish: "I like red", en: "I like red", category: "colores", lesson: 10 },
    { thai: "ไม่ชอบสีดำ", phonetic: "mâi chôop sǐi-dam", es: "mâi chóp sǐ-dam", tone: "f-f-l-m", spanish: "I don't like black", en: "I don't like black", category: "colores", lesson: 10 },
    { thai: "สีเขียวสวย", phonetic: "sǐi-khǐao sǔai", es: "sǐ-kǐao sǔai", tone: "l-r-h", spanish: "green is beautiful", en: "green is beautiful", category: "colores", lesson: 10 },
    { thai: "รถสีแดง", phonetic: "rót sǐi-dǎeng", es: "rót sǐ-dǎeng", tone: "h-l-r", spanish: "red car", en: "red car", category: "colores", lesson: 10 },
    { thai: "เสื้อสีฟ้า", phonetic: "sûea sǐi-fáa", es: "súa sǐ-fá", tone: "h-l-h", spanish: "blue shirt", en: "blue shirt", category: "colores", lesson: 10 },

    // === LESSON 10: FRASES — RUTINA DIARIA ===
    { thai: "ตื่นนอนกี่โมง", phonetic: "dtùen-nɔɔn kìi mong", es: "dtùen-non kì mong", tone: "l-m-l-m", spanish: "what time do you wake up?", en: "what time do you wake up?", category: "verbos", lesson: 10 },
    { thai: "ผมตื่นนอนหกโมงเช้า", phonetic: "phǒm dtùen-nɔɔn hòk mong cháo", es: "pǒm dtùen-non hòk mong cháo", tone: "r-l-m-l-m-h", spanish: "I wake up at 6 AM", en: "I wake up at 6 AM", category: "verbos", lesson: 10 },
    { thai: "อาบน้ำทุกเช้า", phonetic: "àap-nám thúk-cháo", es: "àap-nám túk-cháo", tone: "l-h-h-h", spanish: "I shower every morning", en: "I shower every morning", category: "verbos", lesson: 10 },
    { thai: "แปรงฟันทุกคืน", phonetic: "bprɛɛng fan thúk-kheun", es: "bprɛng fan túk-ken", tone: "m-m-h-m", spanish: "brush teeth every night", en: "brush teeth every night", category: "verbos", lesson: 10 },
    { thai: "แต่งตัวไปทำงาน", phonetic: "dtàeng-dtuua bpai tam-ngaan", es: "dtàeng-dtuá bpai tam-ngan", tone: "l-m-m-m-m", spanish: "get dressed to go to work", en: "get dressed for work", category: "verbos", lesson: 10 },
    { thai: "กลับบ้านห้าโมงเย็น", phonetic: "glàp-bâan hâa mong yen", es: "glàp-bân jâ mong ien", tone: "l-f-f-m-m", spanish: "go back home at 5 PM", en: "go home at 5 PM", category: "verbos", lesson: 10 },
    { thai: "พักผ่อนวันหยุด", phonetic: "phák-phòon wan-yùt", es: "pák-pôn wan-iùt", tone: "l-l-m-l", spanish: "rest on the day off", en: "rest on the day off", category: "verbos", lesson: 10 },

    // === LESSON 10: FRASES — RESERVAS Y CITAS ===
    { thai: "จองโต๊ะสองที่นะครับ", phonetic: "jong tó sǎawng thîi ná-khráp", es: "chong tó sǒng tî ná-kráp", tone: "m-h-r-f-m-h", spanish: "I'd like to book a table for two, please", en: "book a table for two please", category: "verbos", lesson: 10 },
    { thai: "จองห้องคืนนี้", phonetic: "jong hɔ̂ɔng kheun-níi", es: "chong hóng ken-ní", tone: "m-h-m-h", spanish: "book a room for tonight", en: "book a room for tonight", category: "verbos", lesson: 10 },
    { thai: "นัดหมอ", phonetic: "nát mǒe", es: "nát mǒe", tone: "l-r", spanish: "doctor's appointment", en: "doctor's appointment", category: "verbos", lesson: 10 },
    { thai: "จองคิวตัดผม", phonetic: "jong khiu dtàt-phǒm", es: "chong khiu dtàt-pǒm", tone: "m-h-l-r", spanish: "book a haircut appointment", en: "book a haircut slot", category: "verbos", lesson: 10 },
    { thai: "เวลานัดกี่โมง", phonetic: "way-laa nát kìi mong", es: "ue-la nát kì mong", tone: "m-m-l-l-m", spanish: "what time is the appointment?", en: "what time is the appointment?", category: "tiempo", lesson: 10 },
    { thai: "นัดสามโมงเย็น", phonetic: "nát sǎam mong yen", es: "nát sǎm mong ien", tone: "l-r-m-m-m", spanish: "the appointment is at 3 PM", en: "appointment at 3 PM", category: "tiempo", lesson: 10 },

    // === LESSON 11: FRASES — PREPOSICIONES ===
    { thai: "ผมกินก่อน", phonetic: "phǒm gin kɔ̀ɔn", es: "pǒm guin kòn", tone: "r-m-l", spanish: "I eat first", en: "I eat first", category: "preposiciones", lesson: 11 },
    { thai: "ในห้อง", phonetic: "nai hɔ̂ɔng", es: "nai hóng", tone: "m-h", spanish: "inside the room", en: "inside the room", category: "preposiciones", lesson: 11 },
    { thai: "บนโต๊ะ", phonetic: "bon tó", es: "bon tó", tone: "m-h", spanish: "on the table", en: "on the table", category: "preposiciones", lesson: 11 },
    { thai: "ข้างนอกร้าน", phonetic: "khâang-nɔ̀ɔk ráan", es: "kâang-nòk rán", tone: "f-l-h", spanish: "outside the shop", en: "outside the shop", category: "preposiciones", lesson: 11 },
    { thai: "ระหว่างฉันกับคุณ", phonetic: "rá-wàaang chǎn gàp khun", es: "rá-uáang chǎn gàp kun", tone: "h-f-r-l-m", spanish: "between you and me", en: "between you and me", category: "preposiciones", lesson: 11 },
    { thai: "ตรงข้ามร้านอาหาร", phonetic: "trom-khâam ráan-aa-hǎan", es: "trong-kâam rán-a-jǎn", tone: "m-f-h-m-r", spanish: "opposite the restaurant", en: "opposite the restaurant", category: "preposiciones", lesson: 11 },
    { thai: "ข้างๆ ฉัน", phonetic: "khâang-khâang chǎn", es: "kâang-kâang chǎn", tone: "f-f-r", spanish: "next to me / beside me", en: "beside me", category: "preposiciones", lesson: 11 },
    { thai: "เดินผ่านตลาด", phonetic: "dəən phâan tà-làat", es: "dəən pâan dtà-làat", tone: "m-f-l-h", spanish: "walk past the market", en: "walk past the market", category: "preposiciones", lesson: 11 },
    { thai: "ปิดไฟ", phonetic: "pìt fai", es: "bpìt fai", tone: "l-m", spanish: "turn off the light", en: "turn off the light", category: "preposiciones", lesson: 11 },
    { thai: "เปิดไฟ", phonetic: "pòet fai", es: "bpöet fai", tone: "l-m", spanish: "turn on the light", en: "turn on the light", category: "preposiciones", lesson: 11 },
    { thai: "ทั้งสองคน", phonetic: "thâang-sǎawng khon", es: "tâang-sǒng kon", tone: "f-r-m", spanish: "both people / both of them", en: "both of them", category: "preposiciones", lesson: 11 },
    { thai: "ทั้งหมดนี้", phonetic: "thâang-mòt níi", es: "tâang-mòt ní", tone: "f-l-h", spanish: "all of this", en: "all of this", category: "preposiciones", lesson: 11 },
    { thai: "เพื่อคุณ", phonetic: "phûea khun", es: "púa kun", tone: "f-m", spanish: "for you (purpose)", en: "for you", category: "preposiciones", lesson: 11 },
    { thai: "สำหรับคุณ", phonetic: "sǎm-ràp khun", es: "sǎm-ràp kun", tone: "h-h-m", spanish: "for you (intended)", en: "intended for you", category: "preposiciones", lesson: 11 },
    { thai: "ออกไปข้างนอก", phonetic: "ɔ̀ɔk bpai khâang-nɔ̀ɔk", es: "òk bpai kâang-nòk", tone: "l-m-f-l", spanish: "go outside / get out", en: "go outside", category: "preposiciones", lesson: 11 },
    { thai: "เข้าข้างใน", phonetic: "khâo khâang-nai", es: "kǎo kâang-nai", tone: "f-f-m", spanish: "get inside / come in", en: "get inside", category: "preposiciones", lesson: 11 },

    // === LESSON 12: FRASES — DIRECCIONES Y CARA ===
    { thai: "ตรงไปเลี้ยวซ้าย", phonetic: "trom bpai lîao sáai", es: "trom bpai lîao sáai", tone: "m-m-f-h", spanish: "go straight and turn left", en: "go straight and turn left", category: "direcciones", lesson: 12 },
    { thai: "ตรงไปเลี้ยวขวา", phonetic: "trom bpai lîao khwǎa", es: "trom bpai lîao kuǎa", tone: "m-m-f-r", spanish: "go straight and turn right", en: "go straight and turn right", category: "direcciones", lesson: 12 },
    { thai: "เลี้ยวซ้ายสามแยก", phonetic: "lîao sáai sǎam-yâaek", es: "lîao sáai sǎm-iâek", tone: "f-h-r-f", spanish: "turn left at the three-way intersection", en: "turn left at the junction", category: "direcciones", lesson: 12 },
    { thai: "ทางซ้าย", phonetic: "thaang sáai", es: "tang sáai", tone: "m-h", spanish: "on the left / left side", en: "on the left", category: "direcciones", lesson: 12 },
    { thai: "ทางขวา", phonetic: "thaang khwǎa", es: "tang kuǎa", tone: "m-r", spanish: "on the right / right side", en: "on the right", category: "direcciones", lesson: 12 },
    // Routes from the house (bottom-left on Park Road) to each place on the map
    { thai: "ตรงไปสถานีตำรวจ", phonetic: "trom bpai sa-thaa-nii tam-rùat", es: "trom bpai sà-tǎ-ni-tam-rúat", tone: "m-m-l-r-m-m-h", spanish: "go straight to the police station", en: "go straight to the police station", category: "homework", lesson: 12 },
    { thai: "ตรงไปโรงหนัง", phonetic: "trom bpai roong-nǎng", es: "trom bpai rong-nǎng", tone: "m-m-m-r", spanish: "go straight to the cinema", en: "go straight to the cinema", category: "homework", lesson: 12 },
    { thai: "ตรงไปสนามเด็กเล่น", phonetic: "trom bpai sà-nǎam dèk lên", es: "trom bpai sà-nǎm dék lên", tone: "m-m-l-r-l-f", spanish: "go straight to the playground", en: "go straight to the playground", category: "homework", lesson: 12 },
    { thai: "ตรงไปเลี้ยวซ้ายโรงพยาบาล", phonetic: "trom bpai lîao sáai roong-phaa-baan", es: "trom bpai lîao sáai rong-pa-ya-ban", tone: "m-m-f-h-m-m-m", spanish: "go straight and turn left to the hospital", en: "go straight and turn left to the hospital", category: "homework", lesson: 12 },
    { thai: "ตรงไปเลี้ยวขวาธนาคาร", phonetic: "trom bpai lîao khwǎa thá-náa-khaan", es: "trom bpai lîao kuǎa tá-ná-kan", tone: "m-m-f-r-h-h-h", spanish: "go straight and turn right to the bank", en: "go straight and turn right to the bank", category: "homework", lesson: 12 },
    { thai: "ตรงไปร้านอาหาร", phonetic: "trom bpai ráan-aa-hǎan", es: "trom bpai rán-a-jǎn", tone: "m-m-h-m-r", spanish: "go straight to the restaurant", en: "go straight to the restaurant", category: "homework", lesson: 12 },
    { thai: "ตรงไปเลี้ยวซ้ายโรงแรม", phonetic: "trom bpai lîao sáai roong-raem", es: "trom bpai lîao sáai rong-rem", tone: "m-m-f-h-m-m", spanish: "go straight and turn left to the hotel", en: "go straight and turn left to the hotel", category: "homework", lesson: 12 },
    { thai: "ตรงไปเลี้ยวซ้ายโรงเรียน", phonetic: "trom bpai lîao sáai roong-rian", es: "trom bpai lîao sáai rong-rian", tone: "m-m-f-h-m-m", spanish: "go straight and turn left to the school", en: "go straight and turn left to the school", category: "homework", lesson: 12 },
    { thai: "ตรงไปเลี้ยวซ้ายสวนสาธารณะ", phonetic: "trom bpai lîao sáai sŭuan săa-taa-rá-ná", es: "trom bpai lîao sáai sǔan sǎ-ta-rá-ná", tone: "m-m-f-h-r-h-m-h-h", spanish: "go straight and turn left to the park", en: "go straight and turn left to the park", category: "homework", lesson: 12 },
    { thai: "ล้างหน้า", phonetic: "láang nâa", es: "láang ná", tone: "h-f", spanish: "to wash one's face", en: "to wash one's face", category: "cuerpo", lesson: 12 },
    { thai: "ปวดหัว", phonetic: "bpùat hǔa", es: "bpùat hǔa", tone: "l-r", spanish: "headache (lit. hurt-head)", en: "headache", category: "cuerpo", lesson: 12 },
    { thai: "ตาดำ", phonetic: "taa dam", es: "ta dam", tone: "m-m", spanish: "dark / black eyes", en: "dark eyes", category: "cuerpo", lesson: 12 },
    { thai: "ฟันขาว", phonetic: "fan khǎao", es: "fan kǎo", tone: "m-r", spanish: "white teeth", en: "white teeth", category: "cuerpo", lesson: 12 },
    { thai: "บอกผม", phonetic: "bɔ̀ɔk phǒm", es: "bòk pǒm", tone: "l-r", spanish: "tell me", en: "tell me", category: "verbos", lesson: 12 },
    { thai: "เจอกันพรุ่งนี้", phonetic: "jəə gan phrûng-nîi", es: "jo gan prung-ní", tone: "m-m-r-h", spanish: "see you tomorrow", en: "see you tomorrow", category: "verbos", lesson: 12 },
    { thai: "ไว้เจอกันใหม่", phonetic: "wái jəə gan mài", es: "wái jo kan mài", tone: "f-m-m-f", spanish: "see you again", en: "see you again", category: "verbos", lesson: 12 },

    // === YouTube — Slow Thai Conversation: phrase chunks ===
    { thai: "เธอล่ะ", phonetic: "ter lâ", es: "ter lâ", spanish: "what about you?", en: "what about you?", category: "youtube" },
    { thai: "เธอชื่ออะไร", phonetic: "ter chêu à-rai", es: "ter chǔe à-rai", spanish: "what's your name?", en: "what's your name?", category: "youtube" },
    { thai: "เธอเป็นคนประเทศอะไร", phonetic: "ter bpen kon bprà-têt à-rai", es: "ter bpen kon bprà-têt à-rai", spanish: "what's your nationality?", en: "what's your nationality?", category: "youtube" },
    { thai: "เราเป็นคนไทย", phonetic: "rao bpen kon tai", es: "rao bpen kon tai", spanish: "I'm Thai", en: "I'm Thai", category: "youtube" },
    { thai: "เราเป็นคนไทยเหมือนกัน", phonetic: "rao bpen kon tai mĕuuan gan", es: "rao bpen kon tai mǔan gan", spanish: "I'm Thai too", en: "I'm Thai too", category: "youtube" },
    { thai: "เราเป็นลูกครึ่ง", phonetic: "rao bpen lôok krêung", es: "rao bpen lôk kreüng", spanish: "I'm mixed (half-breed)", en: "I'm mixed (half-breed)", category: "youtube" },
    { thai: "เราพูดได้ทั้งสองภาษา", phonetic: "rao pôot dâai táng sŏng paa-săa", es: "rao pût dâi táng song ba-sǎa", spanish: "I can speak both languages", en: "I can speak both languages", category: "youtube" },
    { thai: "น่าอิจฉาจังเลย", phonetic: "nâa ìt-chăa jang loiie", es: "ná ìt-chǎa yang loi", spanish: "I'm so jealous", en: "I'm so jealous", category: "youtube" },
    { thai: "เราอยากพูดภาษาเกาหลีเป็น", phonetic: "rao yàak pôot paa-săa gao-lĕe bpen", es: "rao yàk pût ba-sǎa gao-lǐ bpen", spanish: "I want to know how to speak Korean", en: "I want to know how to speak Korean", category: "youtube" },
    { thai: "ลูกชายเธอเป็นยังไงบ้าง", phonetic: "lôok chaai ter bpen yang ngai bâang", es: "lôk chai ter bpen yang ngai bâng", spanish: "How is your son?", en: "How is your son?", category: "youtube" },
    { thai: "ชีวิตแต่งงานเป็นยังไงบ้าง", phonetic: "chee-wít dtàeng ngaan bpen yang ngai bâang", es: "chi-wít dtàeng ngan bpen yang ngai bâng", spanish: "How's the married life?", en: "How's the married life?", category: "youtube" },
    { thai: "ภรรยาไม่ทำงานบ้านเลย", phonetic: "pan-rá-yaa mâi tam ngaan bâan loiie", es: "pan-rá-ya mâi tam ngan ban loi", spanish: "the wife doesn't do any housework", en: "the wife doesn't do any housework", category: "youtube" },
    { thai: "นอนทั้งวัน ไม่อาบน้ำ", phonetic: "non táng wan mâi àap náam", es: "non táng wan mâi àap nám", spanish: "sleeps all day, doesn't shower", en: "sleeps all day, doesn't shower", category: "youtube" },
    { thai: "ชีวิตครอบครัวมีความสุข", phonetic: "chee-wít krôp kruua mee kwaam sùk", es: "chi-wít krôp krua mi kuam sùk", spanish: "family life is happy", en: "family life is happy", category: "youtube" },
    { thai: "สามีเป็นคนดี ตั้งใจทำงาน", phonetic: "săa-mee bpen kon dee dtâng jai tam ngaan", es: "sǎ-mi bpen kon di dtáng chai tam ngan", spanish: "husband is a good person, hardworking", en: "husband is a good person, hardworking", category: "youtube" },
    { thai: "ช่วยดูแลลูกด้วย", phonetic: "chûuay doo lae lôok dûuay", es: "chuái du lae lôk dûai", spanish: "also helps take care of the kids", en: "also helps take care of the kids", category: "youtube" },
    { thai: "ขอบคุณมากคะ บ้าย", phonetic: "kòp kun mâak ká bâai", es: "kòp kun mâk ká bai", spanish: "Thank you. Bye-bye.", en: "Thank you. Bye-bye.", category: "youtube" },

    // === YouTube — Conversation 1: What's your name? (Lee + Nui) ===
    { thai: "หวัดดี ชื่ออะไร", phonetic: "wàt dee · chêu à-rai", es: "wàt di · chǔe à-rai", spanish: "Hi, what's your name?", en: "Hi, what's your name?", category: "youtube" },
    { thai: "ชื่อนุ้ย เธอล่ะ เธอชื่ออะไร", phonetic: "chêu núi · ter lâ · ter chêu à-rai", es: "chǔe núi · ter lâ · ter chǔe à-rai", spanish: "My name is Nui, and you? What's your name?", en: "My name is Nui, and you? What's your name?", category: "youtube" },
    { thai: "เราชื่อลี เธอเป็นคนประเทศอะไร", phonetic: "rao chêu lee · ter bpen kon bprà-têt à-rai", es: "rao chǔe li · ter bpen kon bprà-têt à-rai", spanish: "My name is Lee. What is your nationality?", en: "My name is Lee. What is your nationality?", category: "youtube" },
    { thai: "เราเป็นคนไทย เธอล่ะ เธอเป็นคนประเทศอะไร", phonetic: "rao bpen kon tai · ter lâ · ter bpen kon bprà-têt à-rai", es: "rao bpen kon tai · ter lâ · ter bpen kon bprà-têt à-rai", spanish: "I'm Thai. How about you, what is your nationality?", en: "I'm Thai. How about you, what is your nationality?", category: "youtube" },
    { thai: "เธอชื่อเหมือนเกาหลี", phonetic: "ter chêu mĕuuan gao-lĕe", es: "ter chǔe mǔan gao-lǐ", spanish: "Your name sounds Korean.", en: "Your name sounds Korean.", category: "youtube" },
    { thai: "ลูกครึ่งอะไร", phonetic: "lôok krêung à-rai", es: "lôk kreüng à-rai", spanish: "What half?", en: "What half?", category: "youtube" },
    { thai: "ลูกครึ่งเกาหลี", phonetic: "lôok krêung gao-lĕe", es: "lôk kreüng gao-lǐ", spanish: "Half-Korean.", en: "Half-Korean.", category: "youtube" },
    { thai: "พ่อหรือแม่เป็นคนเกาหลี", phonetic: "pôr rĕu mâe bpen kon gao-lĕe", es: "por rǔe mae bpen kon gao-lǐ", spanish: "Is your father or mother Korean?", en: "Is your father or mother Korean?", category: "youtube" },
    { thai: "แม่เป็นเกาหลี พ่อเป็นคนไทย", phonetic: "mâe bpen gao-lĕe · pôr bpen kon tai", es: "mae bpen gao-lǐ · por bpen kon tai", spanish: "My mother is Korean. My father is Thai.", en: "My mother is Korean. My father is Thai.", category: "youtube" },
    { thai: "ลีพูดภาษาเกาหลีหรือภาษาไทยเก่งกว่า", phonetic: "Lee pôot paa-săa gao-lĕe rĕu paa-săa tai gèng gwàa", es: "li pût ba-sǎa gao-lǐ rǔe ba-sǎa tai gèng guá", spanish: "Do you speak Korean or Thai better?", en: "Do you speak Korean or Thai better?", category: "youtube" },
    { thai: "พูดภาษาเกาหลีกับแม่ พูดภาษาไทยกับพ่อ", phonetic: "pôot paa-săa gao-lĕe gàp mâe · pôot paa-săa tai gàp pôr", es: "pût ba-sǎa gao-lǐ gàp mae · pût ba-sǎa tai gàp por", spanish: "I speak Korean with my mother and Thai with my father.", en: "I speak Korean with my mother and Thai with my father.", category: "youtube" },

    // === YouTube — Conversation 2: Husband and wife (สามี ภรรยา) ===
    { thai: "มีวันหนึ่งในเมืองเล็กๆ", phonetic: "mee wan nèung nai meuuang lék lék", es: "mi wan nùng nai mûang lék lék", spanish: "Once upon a time, in a small town.", en: "Once upon a time, in a small town.", category: "youtube" },
    { thai: "ที่สวนสาธารณะในใจกลางเมือง", phonetic: "têe sŭuan săa-taa-rá-ná nai jai glaang meuuang", es: "tî sǔan sǎ-ta-rá-ná nai chai glang mûang", spanish: "At a public park, in the middle of the city.", en: "At a public park, in the middle of the city.", category: "youtube" },
    { thai: "มีหญิงแก่สองคนกำลังคุยกัน", phonetic: "mee yĭng gàe sŏng kon gam-lang kui gan", es: "mi yíng káe song kon gam-lang kui gan", spanish: "There were two old ladies talking to each other.", en: "There were two old ladies talking to each other.", category: "youtube" },
    { thai: "ทั้งสองคนเป็นเพื่อนสนิทกัน", phonetic: "táng sŏng kon bpen pêuuan sà-nìt gan", es: "táng song kon bpen púan sà-nìt gan", spanish: "Both ladies were best friends.", en: "Both ladies were best friends.", category: "youtube" },
    { thai: "หญิงแก่คนแรกพูดว่า", phonetic: "yĭng gàe kon râek pôot wâa", es: "yíng káe kon rêk pût uá", spanish: "The first old lady said:", en: "The first old lady said:", category: "youtube" },
    { thai: "หญิงแก่อีกหนึ่งคนตอบว่า", phonetic: "yĭng gàe èek nèung kon dtòp wâa", es: "yíng káe èk nùng kon dtòb uá", spanish: "The other old lady answered:", en: "The other old lady answered:", category: "youtube" },
    { thai: "แย่มาก ลูกโทรมาบ่นทุกวัน", phonetic: "yâe mâak · lôok toh maa bòn túk wan", es: "yé mâk · lôk to maa bòn túk wan", spanish: "Horrible, he calls me to complain every day.", en: "Horrible, he calls me to complain every day.", category: "youtube" },
    { thai: "ไม่ทำอาหาร ไม่ช่วยดูแลลูก", phonetic: "mâi tam aa-hăan · mâi chûuay doo lae lôok", es: "mâi tam a-jǎn · mâi chuái du lae lôk", spanish: "she doesn't cook and doesn't help take care of the children.", en: "she doesn't cook and doesn't help take care of the children.", category: "youtube" },
    { thai: "แล้วผู้หญิงคนนั้นก็ถามกลับไปว่า", phonetic: "láew pôo yĭng kon nán gôr tăam glàp bpai wâa", es: "léo pu yíng kon nán gor tǎm glàp bpai uá", spanish: "Then that woman asked back:", en: "Then that woman asked back:", category: "youtube" },
    { thai: "แล้วลูกสาวเธอละ", phonetic: "láew lôok săao ter lá", es: "léo lôk sao ter lá", spanish: "And your daughter?", en: "And your daughter?", category: "youtube" },
    { thai: "ชีวิตครอบครัวเป็นยังไงบ้าง", phonetic: "chee-wít krôp kruua bpen yang ngai bâang", es: "chi-wít krôp krua bpen yang ngai bâng", spanish: "How is her family life?", en: "How is her family life?", category: "youtube" },
    { thai: "หญิงแก่คนแรกตอบกลับว่า", phonetic: "yĭng gàe kon râek dtòp glàp wâa", es: "yíng káe kon rêk dtòb glàp uá", spanish: "The first old lady replied:", en: "The first old lady replied:", category: "youtube" },
    { thai: "ฉันก็คุยกับลูกทุกวันเหมือนกัน", phonetic: "chăn gôr kui gàp lôok túk wan mĕuuan gan", es: "chán gor kui gàp lôk túk wan mǔan gan", spanish: "I talk to my daughter every day as well.", en: "I talk to my daughter every day as well.", category: "youtube" },
    { thai: "ตอนนี้สบายดี", phonetic: "dton-née sà-baai dee", es: "dton-ní sà-bai di", spanish: "Now she's fine.", en: "Now she's fine.", category: "youtube" },
    { thai: "ทำความสะอาดบ้านทุกวัน", phonetic: "tam kwaam sà-àat bâan túk wan", es: "tam kuam sà-àt ban túk wan", spanish: "He cleans the house every day.", en: "He cleans the house every day.", category: "youtube" },
    { thai: "ถ้ามีใครชอบวีดีโอสไตล์นี้", phonetic: "tâa mee krai chôp wee-dee-oh style née", es: "tâ mi krai chop wi-di-o style ní", spanish: "If any of you like this type of video.", en: "If any of you like this type of video.", category: "youtube" },
    { thai: "เขียนลงไปในคอมเม้นด้วยนะคะ", phonetic: "kĭian long bpai nai kom mén dûuay ná ká", es: "kiǎn lon bpai nai kom mén dûai ná ká", spanish: "please write in the comments.", en: "please write in the comments.", category: "youtube" },

    // --- Lesson 13: Human Body & Health phrases ---
    { thai: "ปวดหัว", phonetic: "pùuat hǔa", es: "pùuat hǔa", tone: "l-r", spanish: "headache", en: "headache", category: "cuerpo", lesson: 13 },
    { thai: "ปวดท้อง", phonetic: "pùuat tong", es: "pùuat tong", tone: "l-m", spanish: "stomachache", en: "stomachache", category: "cuerpo", lesson: 13 },
    { thai: "ปวดขา", phonetic: "pùuat khǎa", es: "pùuat kǎa", tone: "l-r", spanish: "leg ache", en: "leg ache", category: "cuerpo", lesson: 13 },
    { thai: "ปวดเท้า", phonetic: "pùuat tháo", es: "pùuat táo", tone: "l-h", spanish: "foot ache / sore feet", en: "foot ache / sore feet", category: "cuerpo", lesson: 13 },
    { thai: "ปวดคอ", phonetic: "pùuat kɔɔ", es: "pùuat kor", tone: "l-m", spanish: "neck ache", en: "neck ache", category: "cuerpo", lesson: 13 },
    { thai: "ปวดแขน", phonetic: "pùuat khǎen", es: "pùuat kǎen", tone: "l-r", spanish: "arm ache", en: "arm ache", category: "cuerpo", lesson: 13 },
    { thai: "เจ็บไหล่", phonetic: "jèp lài", es: "jèp lài", tone: "l-l", spanish: "shoulder hurts", en: "shoulder hurts", category: "cuerpo", lesson: 13 },
    { thai: "เจ็บมือ", phonetic: "jèp muu", es: "jèp muu", tone: "l-m", spanish: "hand hurts", en: "hand hurts", category: "cuerpo", lesson: 13 },
    { thai: "เธอท้อง", phonetic: "thəə tong", es: "ter tong", tone: "m-m", spanish: "she is pregnant", en: "she is pregnant", category: "cuerpo", lesson: 13 },
    { thai: "คลอดลูก", phonetic: "khlôot lûuk", es: "klôt lûk", tone: "f-l", spanish: "to give birth (to a child)", en: "to give birth (to a child)", category: "cuerpo", lesson: 13 },
    { thai: "ออกกำลังกาย", phonetic: "ɔ̀ɔk gam-lang-gaai", es: "òk gam-lang-gaai", tone: "l-m-m-m", spanish: "to exercise", en: "to exercise", category: "cuerpo", lesson: 13 },
    { thai: "เล่นกีฬา", phonetic: "lên kii-laa", es: "lên kii-laa", tone: "l-m-m", spanish: "to play sport", en: "to play sport", category: "cuerpo", lesson: 13 },
    { thai: "ขอช่วยหน่อย", phonetic: "khɔ̌ɔ chûai nòi", es: "kǒr chuái nòi", tone: "r-h-l", spanish: "please help me", en: "please help me", category: "saludos", lesson: 13 },
    { thai: "ทิศเหนือ", phonetic: "thít nǔea", es: "tít nǔea", tone: "h-r", spanish: "north (direction)", en: "north (direction)", category: "direcciones", lesson: 13 },
    { thai: "ทิศใต้", phonetic: "thít dtâai", es: "tít dtâi", tone: "h-f", spanish: "south (direction)", en: "south (direction)", category: "direcciones", lesson: 13 },
    { thai: "ทิศตะวันออก", phonetic: "thít tà-wan-òk", es: "tít tà-wan-òk", tone: "h-m-m-l", spanish: "east (direction)", en: "east (direction)", category: "direcciones", lesson: 13 },
    { thai: "ทิศตะวันตก", phonetic: "thít tà-wan-tòk", es: "tít tà-wan-tòk", tone: "h-m-m-l", spanish: "west (direction)", en: "west (direction)", category: "direcciones", lesson: 13 },
    { thai: "ตรงกลาง", phonetic: "trom klang", es: "trom klang", tone: "m-m", spanish: "in the center / middle", en: "in the center / middle", category: "direcciones", lesson: 13 },

    // === Coverage gap fills — PHRASES ===
    // Lesson 2 — shops, hospital, cinema
    { thai: "ผมไปร้านชา", phonetic: "phǒm bpai ráan-chaa", es: "pǒm bpai rán-cha", tone: "r-m-h-m", spanish: "I go to the tea house", en: "I go to the tea house", category: "tiendas", lesson: 2 },
    { thai: "ผมไปร้านขายยา", phonetic: "phǒm bpai ráan-kǎai-yaa", es: "pǒm bpai rán-kǎi-ya", tone: "r-m-h-l-f-m", spanish: "I go to the pharmacy", en: "I go to the pharmacy", category: "tiendas", lesson: 2 },
    { thai: "ผมไปร้านสะดวกซื้อ", phonetic: "phǒm bpai ráan sà-dùuak-súeu", es: "pǒm bpai rán sà-duak-sú", tone: "r-m-h-l-f-l-h", spanish: "I go to the convenience store", en: "I go to the convenience store", category: "tiendas", lesson: 2 },
    { thai: "ผมไปร้านหนังสือ", phonetic: "phǒm bpai ráan nǎng-sǔeu", es: "pǒm bpai rán náng-sú", tone: "r-m-h-l-r", spanish: "I go to the bookstore", en: "I go to the bookstore", category: "tiendas", lesson: 2 },
    { thai: "ผมไปโรงพยาบาล", phonetic: "phǒm bpai roong-phaa-baan", es: "pǒm bpai rong-pa-ya-ban", tone: "r-m-m-m-m", spanish: "I go to the hospital", en: "I go to the hospital", category: "tiendas", lesson: 2 },
    { thai: "ผมไปโรงหนัง", phonetic: "phǒm bpai roong-nǎng", es: "pǒm bpai rong-nǎng", tone: "r-m-m-r", spanish: "I go to the cinema", en: "I go to the cinema", category: "tiendas", lesson: 2 },
    // Lesson 3 — missing verbs/body/directions
    { thai: "ได้รับจดหมาย", phonetic: "dâai-ráp jòt-mǎai", es: "dâi-ráp yòt-mǎai", tone: "f-f-l-m-r", spanish: "to receive a letter", en: "to receive a letter", category: "verbos", lesson: 3 },
    { thai: "เข่าเจ็บ", phonetic: "kào jèp", es: "kào chèp", tone: "l-l", spanish: "knee hurts", en: "knee hurts", category: "cuerpo", lesson: 3 },
    { thai: "ขี่ม้า", phonetic: "khìi mǎa", es: "kì mǎ", tone: "h-h", spanish: "to ride a horse", en: "to ride a horse", category: "verbos", lesson: 3 },
    { thai: "บ้านไกล", phonetic: "bâan klai", es: "bân glai", tone: "f-m", spanish: "the house is far", en: "the house is far", category: "direcciones", lesson: 3 },
    { thai: "บ้านใกล้", phonetic: "bâan glâi", es: "bân glâi", tone: "f-f", spanish: "the house is near", en: "the house is near", category: "direcciones", lesson: 3 },
    { thai: "หมู่บ้านใหญ่", phonetic: "mùu bâan yài", es: "mù bân yài", tone: "h-f-l", spanish: "big village", en: "big village", category: "sustantivos", lesson: 3 },
    { thai: "อากาศหนาว", phonetic: "aa-kàat nǎao", es: "a-kàt nǎao", tone: "m-l-r", spanish: "the weather is cold", en: "the weather is cold", category: "sabores", lesson: 3 },
    // Lesson 6 — missing numbers/currency/question words
    { thai: "สามสิบบาท", phonetic: "sǎam-sìp bàat", es: "sǎm-sìp bàt", tone: "r-l-l", spanish: "thirty baht", en: "thirty baht", category: "números", lesson: 6 },
    { thai: "หกสิบบาท", phonetic: "hòk-sìp bàat", es: "jòk-sìp bàt", tone: "l-l-l", spanish: "sixty baht", en: "sixty baht", category: "números", lesson: 6 },
    { thai: "เจ็ดสิบบาท", phonetic: "jèt-sìp bàat", es: "chèt-sìp bàt", tone: "l-l-l", spanish: "seventy baht", en: "seventy baht", category: "números", lesson: 6 },
    { thai: "แปดสิบบาท", phonetic: "bpàaet-sìp bàat", es: "bpèt-sìp bàt", tone: "l-l-l", spanish: "eighty baht", en: "eighty baht", category: "números", lesson: 6 },
    { thai: "เก้าสิบบาท", phonetic: "kâo-sìp bàat", es: "kâo-sìp bàt", tone: "f-l-l", spanish: "ninety baht", en: "ninety baht", category: "números", lesson: 6 },
    { thai: "หนึ่งยูโร", phonetic: "nùeng yoo-roo", es: "nùng yu-ro", tone: "l-m-m", spanish: "one euro", en: "one euro", category: "números", lesson: 6 },
    { thai: "อย่างไรดี", phonetic: "yàang-rai dii", es: "yàng-rai di", tone: "l-m-m", spanish: "what should we do?", en: "what should we do?", category: "preguntas", lesson: 6 },
    { thai: "เสื้อสายไหม", phonetic: "sǔea sǎai-mǎi", es: "sǔea sǎai-mǎi", tone: "f-r-r", spanish: "silk shirt", en: "silk shirt", category: "sustantivos", lesson: 6 },
    { thai: "แปดสิบสี่บาท", phonetic: "bpàaet-sìp sìi bàat", es: "bpèt-sìp sì bàt", tone: "l-l-l-l", spanish: "eighty-four baht", en: "eighty-four baht", category: "números", lesson: 6 },
    { thai: "เก้าสิบเอ็ดบาท", phonetic: "kâo-sìp èt bàat", es: "kâo-sìp èt bàt", tone: "f-l-l-l", spanish: "ninety-one baht", en: "ninety-one baht", category: "números", lesson: 6 },
    // Lesson 8 — missing time/days
    { thai: "อยู่ที่นั่น", phonetic: "yùu thîi-nân", es: "iù tî-nân", tone: "l-f-f", spanish: "to be there", en: "to be there", category: "preposiciones", lesson: 8 },
    { thai: "วันนี้", phonetic: "wan-nîi", es: "wan-ní", tone: "m-h", spanish: "today", en: "today", category: "tiempo", lesson: 8 },
    { thai: "เมื่อวานนี้", phonetic: "mêua-waan-nîi", es: "mûa-wan-ní", tone: "h-m-h", spanish: "yesterday", en: "yesterday", category: "tiempo", lesson: 8 },
    { thai: "ตอนเช้า", phonetic: "dton-cháo", es: "dton-cháo", tone: "m-r", spanish: "in the morning", en: "in the morning", category: "tiempo", lesson: 8 },
    { thai: "ตอนกลางวัน", phonetic: "dton klang-wan", es: "dton klang-wan", tone: "m-m-m", spanish: "at noon", en: "at noon", category: "tiempo", lesson: 8 },
    { thai: "ตอนบ่าย", phonetic: "dton-bàai", es: "dton-bài", tone: "m-l", spanish: "in the afternoon", en: "in the afternoon", category: "tiempo", lesson: 8 },
    { thai: "ตอนเย็น", phonetic: "dton-yen", es: "dton-ien", tone: "m-m", spanish: "in the evening", en: "in the evening", category: "tiempo", lesson: 8 },
    { thai: "ตอนกลางคืน", phonetic: "dton klang-kheun", es: "dton klang-ken", tone: "m-m-m", spanish: "at midnight", en: "at midnight", category: "tiempo", lesson: 8 },
    { thai: "ตอนเที่ยง", phonetic: "dton-thîang", es: "dton-tîeng", tone: "m-f", spanish: "at noon", en: "at noon", category: "tiempo", lesson: 8 },
    { thai: "วันจันทร์", phonetic: "wan-jan", es: "wan-jan", tone: "m-m", spanish: "Monday", en: "Monday", category: "tiempo", lesson: 8 },
    { thai: "วันอาทิตย์", phonetic: "wan-aa-thít", es: "wan-a-tít", tone: "m-m-h", spanish: "Sunday", en: "Sunday", category: "tiempo", lesson: 8 },
    // Lesson 9 — missing minute
    { thai: "สิบห้านาที", phonetic: "sìp-hâa naa-thii", es: "sìp-jâ na-tí", tone: "l-f-m-m", spanish: "fifteen minutes", en: "fifteen minutes", category: "tiempo", lesson: 9 },
    // Lesson 10 — missing colors/grooming/appointments
    { thai: "สีเหลือง", phonetic: "sǐi lǔeax", es: "sì lǔea", tone: "l-r", spanish: "yellow color", en: "yellow color", category: "colores", lesson: 10 },
    { thai: "สีขาว", phonetic: "sǐi khǎao", es: "sì kǎao", tone: "l-r", spanish: "white color", en: "white color", category: "colores", lesson: 10 },
    { thai: "สีส้ม", phonetic: "sǐi sôm", es: "sì sôm", tone: "l-h", spanish: "orange color", en: "orange color", category: "colores", lesson: 10 },
    { thai: "สีชมพู", phonetic: "sǐi chom-phuu", es: "sì chom-pū", tone: "l-h-m", spanish: "pink color", en: "pink color", category: "colores", lesson: 10 },
    { thai: "สีน้ำตาล", phonetic: "sǐi nám-taan", es: "sì nám-tan", tone: "l-f-m", spanish: "brown color", en: "brown color", category: "colores", lesson: 10 },
    { thai: "สีเทา", phonetic: "sǐi thao", es: "sì tao", tone: "l-m", spanish: "gray color", en: "gray color", category: "colores", lesson: 10 },
    { thai: "สระผม", phonetic: "sà phǒm", es: "sà pǒm", tone: "l-r", spanish: "to wash hair", en: "to wash hair", category: "verbos", lesson: 10 },
    { thai: "มีนัดหมาย", phonetic: "mii nát-mǎai", es: "mi nát-mǎai", tone: "m-h-f", spanish: "to have an appointment", en: "to have an appointment", category: "verbos", lesson: 10 },
    { thai: "พบหมอ", phonetic: "phǒp mǒo", es: "pǒb mǒ", tone: "l-m", spanish: "to see a doctor", en: "to see a doctor", category: "verbos", lesson: 10 },
    { thai: "เช็คอินโรงแรม", phonetic: "chék-in roong-raem", es: "chék-in rong-rem", tone: "h-m-m-m", spanish: "to check in to the hotel", en: "to check in to the hotel", category: "verbos", lesson: 10 },
    { thai: "เช็คเอาท์", phonetic: "chék-ao", es: "chék-ao", tone: "h-m", spanish: "to check out", en: "to check out", category: "verbos", lesson: 10 },
    { thai: "รถคันนี้", phonetic: "rót khan nîi", es: "rót kán ní", tone: "h-m-h", spanish: "this car (classifier khan)", en: "this car", category: "sustantivos", lesson: 10 },
    { thai: "นี่คืออะไร", phonetic: "nîi kheu a-rai", es: "ní keu a-rai", tone: "h-m-l-m", spanish: "what is this?", en: "what is this?", category: "preguntas", lesson: 10 },
    // Lesson 11 — missing position words
    { thai: "ข้างหน้า", phonetic: "khâang-nâa", es: "kâang-ná", tone: "f-f", spanish: "in front", en: "in front", category: "preposiciones", lesson: 11 },
    { thai: "ข้างหลัง", phonetic: "khâang-lǎng", es: "kâang-lǎng", tone: "f-l", spanish: "behind", en: "behind", category: "preposiciones", lesson: 11 },
    { thai: "ข้างบน", phonetic: "khâang-bon", es: "kâang-bon", tone: "f-m", spanish: "above / on top", en: "above / on top", category: "preposiciones", lesson: 11 },
    { thai: "ข้างล่าง", phonetic: "khâang-lâang", es: "kâang-lâang", tone: "f-f", spanish: "below / underneath", en: "below / underneath", category: "preposiciones", lesson: 11 },
    { thai: "ในและนอก", phonetic: "nai læ nɔɔk", es: "nai lae nòk", tone: "m-l-l", spanish: "inside and outside", en: "inside and outside", category: "preposiciones", lesson: 11 },
    { thai: "เจอคุณใหม่", phonetic: "jəə khun mài", es: "jo kun mài", tone: "m-m-f", spanish: "see you again", en: "see you again", category: "saludos", lesson: 11 },
    // Lesson 12 — missing body parts in phrases
    { thai: "จมูกใหญ่", phonetic: "jà-mùuk yài", es: "jà-mùuk yài", tone: "l-h-l", spanish: "big nose", en: "big nose", category: "cuerpo", lesson: 12 },
    { thai: "หูเจ็บ", phonetic: "hǔu jèp", es: "hǔu chèp", tone: "r-l", spanish: "ear hurts", en: "ear hurts", category: "cuerpo", lesson: 12 },
    // Lesson 13 — missing phrases
    { thai: "ท้องแก้ว", phonetic: "tong-gâeo", es: "tong-gěo", tone: "m-f", spanish: "pregnant (euphemism)", en: "pregnant (euphemism)", category: "cuerpo", lesson: 13 },
    { thai: "ภาคอีสาน", phonetic: "phâak ii-sǎan", es: "pâk ii-sǎan", tone: "h-h-m-r", spanish: "Isan region", en: "Isan region", category: "sustantivos", lesson: 13 },
    { thai: "ทางแยก", phonetic: "thaang-yâaek", es: "tang-iâek", tone: "m-f", spanish: "intersection / junction", en: "intersection / junction", category: "direcciones", lesson: 13 },
    { thai: "ช่วยผมหน่อยครับ", phonetic: "chûai phǒm nòi khráp", es: "chuái pǒm nòi kráp", tone: "h-r-l-h", spanish: "please help me", en: "please help me", category: "saludos", lesson: 13 },

    // === LESSON 14: HEALTH, SHOPPING & CONNECTORS ===
    // Salud — síntomas y medicamentos
    { thai: "แพง", phonetic: "phǎaeng", es: "pang", tone: "r", spanish: "caro", en: "expensive", category: "salud", lesson: 14 },
    { thai: "ไม่แพง", phonetic: "mâi phǎaeng", es: "mâi pang", tone: "f-r", spanish: "barato", en: "cheap", category: "salud", lesson: 14 },
    { thai: "ยา", phonetic: "yaa", es: "ya", tone: "m", spanish: "medicina", en: "medicine", category: "salud", lesson: 14 },
    { thai: "ไข้", phonetic: "khâai", es: "kâi", tone: "f", spanish: "fiebre", en: "fever", category: "salud", lesson: 14 },
    { thai: "มีไข้", phonetic: "mee khâai", es: "mi kâi", tone: "m-f", spanish: "tener fiebre", en: "have a fever", category: "salud", lesson: 14 },
    { thai: "น้ำมูก", phonetic: "náam-mùuk", es: "nám-mùuk", tone: "h-h", spanish: "moco", en: "snot / mucus", category: "salud", lesson: 14 },
    { thai: "มีน้ำมูก", phonetic: "mee náam-mùuk", es: "mi nám-mùuk", tone: "m-h-h", spanish: "tener moqueo (lit. tengo moco)", en: "have a runny nose", category: "salud", lesson: 14 },
    { thai: "คัดจมูก", phonetic: "khat ja-mùuk", es: "kat ya-mùuk", tone: "l-l-h", spanish: "congestión nasal (lit. bloquear nariz)", en: "stuffy nose / congested", category: "salud", lesson: 14 },
    { thai: "ท้องเสีย", phonetic: "thong-sǐa", es: "tong-sǐa", tone: "m-f", spanish: "diarrea (lit. estómago-malo)", en: "diarrhea", category: "salud", lesson: 14 },
    { thai: "หัก", phonetic: "hàk", es: "hák", tone: "l", spanish: "romper / quebrarse", en: "to break", category: "salud", lesson: 14 },
    { thai: "ลด", phonetic: "lót", es: "lót", tone: "f", spanish: "bajar / reducir", en: "to reduce / to lower", category: "salud", lesson: 14 },
    { thai: "ลดราคา", phonetic: "lót raa-khaa", es: "lót ra-ká", tone: "f-m-m", spanish: "descuento / rebajar el precio", en: "discount / to lower the price", category: "salud", lesson: 14 },
    { thai: "พยายาม", phonetic: "pha-yaa-yàam", es: "pa-ya-yám", tone: "m-m-l", spanish: "intentar / esforzarse", en: "to try / to attempt", category: "salud", lesson: 14 },
    { thai: "ขอ", phonetic: "khoo", es: "kor", tone: "r", spanish: "pedir / por favor", en: "to request / please", category: "salud", lesson: 14 },

    // Compras — tienda y transacciones
    { thai: "ทุกวัน", phonetic: "túk wan", es: "túk wan", tone: "l-m", spanish: "cada día / todos los días", en: "every day", category: "salud", lesson: 14 },
    { thai: "ทั้งวัน", phonetic: "táng wan", es: "táng wan", tone: "f-m", spanish: "todo el día", en: "all day", category: "salud", lesson: 14 },
    { thai: "ทั้งหมด", phonetic: "táng-mòt", es: "táng-mòt", tone: "f-l", spanish: "todo / entero", en: "all / everything", category: "salud", lesson: 14 },
    { thai: "เพราะว่า", phonetic: "phráw wâa", es: "prao uá", tone: "h-f", spanish: "porque", en: "because", category: "salud", lesson: 14 },

    // Direcciones — relleno de huecos
    { thai: "อาทิตย์", phonetic: "aa-thít", es: "a-tít", tone: "m-h", spanish: "sol / domingo", en: "sun / Sunday", category: "direcciones", lesson: 14 },
    { thai: "ตก", phonetic: "dtok", es: "dtók", tone: "l", spanish: "caer", en: "to fall", category: "direcciones", lesson: 14 },

    // INDICACIONES DESDE CASA A CADA EDIFICIO DEL MAPA — Lección 14
    // Home está en la esquina superior izquierda; las calles son Maple (↔) y Main (↕)
    { thai: "ตรงไปเลี้ยวขวาร้านขายยา", phonetic: "trom bpai lîao khwǎa ráan-khǎai-yaa", es: "trom bpai lîao kuǎa rán-kǎi-ya", tone: "m-m-f-r-h-r-m", spanish: "ve recto y gira a la derecha a la farmacia", en: "go straight and turn right to the pharmacy", category: "homework", lesson: 14 },
    { thai: "ตรงไปไปรษณีย์", phonetic: "trom bpai prai-sà-nii", es: "trom bpai prai-sà-ni", tone: "m-m-m-h-l-m", spanish: "ve recto a la oficina de correos", en: "go straight to the post office", category: "homework", lesson: 14 },
    { thai: "ตรงไปร้านค้า", phonetic: "trom bpai ráan-kháa", es: "trom bpai rán-ká", tone: "m-m-h-f", spanish: "ve recto a la tienda", en: "go straight to the store", category: "homework", lesson: 14 },
    { thai: "ตรงไปธนาคาร", phonetic: "trom bpai thá-náa-khaan", es: "trom bpai tá-ná-kan", tone: "m-m-h-h-h", spanish: "ve recto al banco", en: "go straight to the bank", category: "homework", lesson: 14 },
    { thai: "ตรงไปเลี้ยวซ้ายโรงเรียน", phonetic: "trom bpai lîao sáai roong-rian", es: "trom bpai lîao sáai rong-rian", tone: "m-m-f-h-m-m", spanish: "ve recto y gira a la izquierda a la escuela", en: "go straight and turn left to the school", category: "homework", lesson: 14 },

    // Lección 14 — homework: diario personal (solo vocabulario de lecciones)
    // Nota: ยาก (difícil), แต่ (pero), ตื่น (despertar), เป็น (ser) son palabras básicas que faltaban en lecciones previas pero son necesarias para estas frases
    { thai: "อาทิตย์นี้ที่ประเทศสเปนร้อนมาก", phonetic: "aa-thít-níi thîi prà-thêet sà-pen râwn mâak", es: "a-tíd-ní tîi bprà-tét sà-bpen rôn mâk", tone: "m-h-h-h-l-h-l-m-f-f", spanish: "esta semana hizo mucho calor en España", en: "this week it was very hot in Spain", category: "homework", lesson: 14 },
    { thai: "ผมอยู่ที่เมืองบิลบาโอ", phonetic: "phǒm yùu thîi meuuang bin-baao", es: "pǒm iù tîi mûang bin-ba-ao", tone: "r-l-h-m-m-m-m", spanish: "yo vivo en Bilbao", en: "I live in Bilbao", category: "homework", lesson: 14 },
    { thai: "บิลบาโอเป็นเมือง", phonetic: "bin-baao pen meuuang", es: "bin-ba-ao bpen mûang", tone: "m-m-m-m-m", spanish: "Bilbao es una ciudad", en: "Bilbao is a city", category: "homework", lesson: 14 },
    { thai: "บิลบาโออยู่ทางเหนือของประเทศสเปน", phonetic: "bin-baao yùu thaang nǔea khǒng prà-thêet sà-pen", es: "bin-ba-ao iù tang nǔa kǒng bprà-tét sà-bpen", tone: "m-m-l-m-r-r-l-h-l-m", spanish: "Bilbao está al norte de España", en: "Bilbao is in the north of Spain", category: "homework", lesson: 14 },
    { thai: "เพราะว่าร้อนมาก นอนยากมาก", phonetic: "phráw wâa râwn mâak, nɔɔn yâak mâak", es: "prao uá rôn mâk, non yák mâk", tone: "h-f-f-f-m-l-f", spanish: "porque hizo mucho calor, fue muy difícil dormir", en: "because it was very hot, it was very difficult to sleep", category: "homework", lesson: 14 },
    { thai: "ผมตื่นเช้าเพื่อเรียนภาษาไทย", phonetic: "phǒm dtùuen cháo phûea rian phaa-sǎa thai", es: "pǒm dtùun cháo púea rian pa-sǎa tai", tone: "r-h-r-h-m-m-h-m", spanish: "me levanto pronto para estudiar tailandés", en: "I get up early to study Thai", category: "homework", lesson: 14 },
    { thai: "พูดภาษาไทยยาก แต่ผมพยายามพูดภาษาไทยทุกวัน", phonetic: "phûut phaa-sǎa thai yâak, tàe phǒm pha-yaa-yàam phûut phaa-sǎa thai túk-wan", es: "pût pa-sǎa tai yák, tè pǒm pa-ya-yám pût pa-sǎa tai túk-wan", tone: "f-m-h-m-l, l-r-m-m-l-f-m-h-m-l-m", spanish: "hablar tailandés es difícil, pero intento hablar tailandés todos los días", en: "speaking Thai is difficult, but I try to speak Thai every day", category: "homework", lesson: 14 },
    { thai: "แล้วผมออกกำลังกายที่สวนสาธารณะ อาบน้ำและทำงาน", phonetic: "lɛ́ɛo phǒm ɔ̀ɔk-gam-lang-gaai thîi sǔuan săa-taa-rá-ná, àap-nám lɛ̀ɛ tam-ngaan", es: "léo pǒm òk-gam-lang-gaai tîi sǔan sǎ-ta-rá-ná, àap-nám lè tam-ngan", tone: "f-r-l-m-m-m-h-r-h-m-h-h, l-h-l-m-m", spanish: "luego hago ejercicio en el parque, me ducho y trabajo", en: "then I exercise in the park, shower and work", category: "homework", lesson: 14 },
    { thai: "ผมชอบเมืองบิลบาโอ", phonetic: "phǒm chôop meuuang bin-baao", es: "pǒm chôp mûang bin-ba-ao", tone: "r-f-m-m-m-m", spanish: "me gusta Bilbao", en: "I like Bilbao", category: "homework", lesson: 14 },
    { thai: "ผมเรียนภาษาไทยทุกเย็น", phonetic: "phǒm rian phaa-sǎa thai túk yen", es: "pǒm rian pa-sǎa tai túk ien", tone: "r-m-m-h-m-l-m", spanish: "estudio tailandés cada tarde", en: "I study Thai every evening", category: "homework", lesson: 14 },
    { thai: "ที่ประเทศสเปนเย็นกว่าที่นี่", phonetic: "thîi prà-thêet sà-pen yen gwàa thîi nîi", es: "tîi bprà-tét sà-bpen ien guà tîi nî", tone: "h-l-h-l-m-m-l-h-h", spanish: "en España hace más frío que aquí", en: "in Spain it's colder than here", category: "homework", lesson: 14 },
    { thai: "ผมอยากไปเที่ยวประเทศไทย", phonetic: "phǒm yàak bpai thîao prà-thêet thai", es: "pǒm yàk bpai tîo bprà-tét tai", tone: "r-l-m-f-l-h-m", spanish: "quiero viajar a Tailandia", en: "I want to travel to Thailand", category: "homework", lesson: 14 },
    { thai: "เมื่อวานผมนอนดึก", phonetic: "mʉ̂a-waan phǒm nɔɔn dùek", es: "mûa-uan pǒm non dùek", tone: "f-m-r-m-l", spanish: "ayer me acosté tarde", en: "yesterday I went to bed late", category: "homework", lesson: 14 },
    { thai: "ผมพูดภาษาไทยไม่เก่ง แต่ผมพยายาม", phonetic: "phǒm phûut phaa-sǎa thai mâi gèng, tàe phǒm pha-yaa-yàam", es: "pǒm pût pa-sǎa tai mâi gèng, tè pǒm pa-ya-yám", tone: "r-f-m-h-m-f-l, l-r-m-m-l", spanish: "no hablo tailandés bien, pero intento", en: "I don't speak Thai well, but I try", category: "homework", lesson: 14 },
    { thai: "ตอนเช้าผมดื่มกาแฟแล้วทำงาน", phonetic: "dton-cháo phǒm dùuem gaa-faae lɛ́ɛo tam-ngaan", es: "dton-cháo pǒm dùum ga-fae léo tam-ngan", tone: "m-h-r-l-m-h-f-m-m", spanish: "por la mañana bebo café y luego trabajo", en: "in the morning I drink coffee and then work", category: "homework", lesson: 14 },
    { thai: "อาหารไทยอร่อยมาก แต่เผ็ดมาก", phonetic: "aa-hǎan thai à-rôi mâak, tàe phèt mâak", es: "a-jǎn tai à-rôi mâk, tè pèt mâk", tone: "m-r-m-l-l-f, l-f-f", spanish: "la comida tailandesa es muy rica pero muy picante", en: "Thai food is very delicious but very spicy", category: "homework", lesson: 14 },
    { thai: "ครูสอนภาษาไทยที่โรงเรียน", phonetic: "khruu sɔ̌ɔn phaa-sǎa thai thîi roong-rian", es: "krú sǒn pa-sǎa tai tîi rong-rian", tone: "m-r-m-h-m-h-m-m", spanish: "el profesor enseña tailandés en la escuela", en: "the teacher teaches Thai at school", category: "homework", lesson: 14 },
    { thai: "ผมมีเวลาน้อย เพราะว่าผมทำงานทุกวัน", phonetic: "phǒm mee wee-laa nòi, phráw wâa phǒm tam-ngaan túk-wan", es: "pǒm mi ui-la nòi, prao uá pǒm tam-ngan túk-wan", tone: "r-m-m-m-r, h-f-r-m-m-l-m", spanish: "tengo poco tiempo porque trabajo todos los días", en: "I have little time because I work every day", category: "homework", lesson: 14 },

    // Lección 14 — vocabulario para homework (palabras nuevas necesarias)
    { thai: "หนัก", phonetic: "nàk", es: "nàk", tone: "l", spanish: "duro / pesado (intensidad)", en: "hard / heavy (intensity)", category: "homework", lesson: 14 },
    { thai: "คำ", phonetic: "kham", es: "kam", tone: "m", spanish: "palabra", en: "word", category: "homework", lesson: 14 },
    { thai: "การบ้าน", phonetic: "gaan-bâan", es: "gan-bân", tone: "m-f", spanish: "deberes / tarea", en: "homework", category: "homework", lesson: 14 },
    { thai: "ต้อง", phonetic: "dtɔ̂ɔng", es: "dtóng", tone: "f", spanish: "deber / tener que", en: "must / have to", category: "homework", lesson: 14 },
    { thai: "คิดว่า", phonetic: "khít wâa", es: "kíd uá", tone: "l-f", spanish: "pensar que / creer que", en: "to think that", category: "homework", lesson: 14 },
    { thai: "ที่ต้อง", phonetic: "thîi dtɔ̂ɔng", es: "tîi dtóng", tone: "h-f", spanish: "que tengo que / que debo", en: "that I must", category: "homework", lesson: 14 },
    { thai: "เจ็ดสิบหก", phonetic: "jèt-sìp-hòk", es: "chèt-sìp-hòk", tone: "l-l-l", spanish: "setenta y seis (76)", en: "seventy-six (76)", category: "homework", lesson: 14 },

    // Lección 14 — homework: frases del estudiante
    { thai: "ผมคิดว่าผมเรียนหนักมาก", phonetic: "phǒm khít wâa phǒm rian nàk mâak", es: "pǒm kíd uá pǒm rian nàk mâak", tone: "r-l-f-r-m-l-f", spanish: "creo que estudio mucho / muy duro", en: "I think I study very hard", category: "homework", lesson: 14 },
    { thai: "ผมไม่ได้ทำการบ้านเพราะว่าอยากเรียนคำยากๆ ก่อน", phonetic: "phǒm mâi-dâai tam gaan-bâan phráw wâa yàak rian kham yâak-yâak kɔ̀ɔn", es: "pǒm mâi-dâi tam gan-bân prao uá yàk rian kam yák-yák kòn", tone: "r-f-f-m-m-f-h-f-l-m-l-l-l-l-l", spanish: "no hice los deberes porque quería aprender palabras difíciles primero", en: "I didn't do the homework because I wanted to learn difficult words first", category: "homework", lesson: 14 },
    { thai: "และผมมีคำยากๆ ที่ต้องเรียนเจ็ดสิบหกคำ", phonetic: "lɛ̀ɛ phǒm mee kham yâak-yâak thîi dtɔ̂ɔng rian jèt-sìp-hòk kham", es: "lè pǒm mi kam yák-yák tîi dtóng rian chèt-sìp-hòk kam", tone: "l-r-m-m-l-l-l-h-f-m-l-l-l-l-m", spanish: "y tengo 76 palabras difíciles que aprender", en: "and I have 76 difficult words to learn", category: "homework", lesson: 14 },

    // Lección 14 — vocabulario tienda / ropa / dinero / cervezas
    { thai: "ร้านขายของ", phonetic: "ráan-khǎai-khǒong", es: "rán-kǎi-kǒng", tone: "h-r-r", spanish: "tienda", en: "shop / store", category: "tiendas", lesson: 14 },
    { thai: "ผมไปร้านขายของ", phonetic: "phǒm bpai ráan-khǎai-khǒong", es: "pǒm bpai rán-kǎi-kǒng", tone: "r-m-h-r-r", spanish: "voy a la tienda", en: "I go to the shop", category: "tiendas", lesson: 14 },
    { thai: "เสื้อผ้า", phonetic: "sûea-phâa", es: "súea-pâa", tone: "f-f", spanish: "ropa", en: "clothes", category: "tiendas", lesson: 14 },
    { thai: "ซื้อเสื้อผ้าใหม่", phonetic: "súeu sûea-phâa mài", es: "sú súea-pâa mài", tone: "h-f-f-f", spanish: "comprar ropa nueva", en: "to buy new clothes", category: "tiendas", lesson: 14 },
    { thai: "สามคน", phonetic: "sǎam khon", es: "sǎm kon", tone: "r-m", spanish: "3 personas", en: "3 people", category: "números", lesson: 14 },
    { thai: "เราสามคน", phonetic: "rao sǎam khon", es: "rao sǎm kon", tone: "m-r-m", spanish: "nosotros tres", en: "the three of us", category: "números", lesson: 14 },
    { thai: "เงิน", phonetic: "ngoen", es: "ngoen", tone: "m", spanish: "dinero", en: "money", category: "sustantivos", lesson: 14 },
    { thai: "มีเงินไหม", phonetic: "mee ngoen măi", es: "mi ngoen mǎi", tone: "m-m-r", spanish: "¿tienes dinero?", en: "do you have money?", category: "sustantivos", lesson: 14 },
    { thai: "ยี่สิบเอ็ดบาท", phonetic: "yîi-sìp-èt bàat", es: "yî-sìp-èt bàt", tone: "f-l-h-l", spanish: "21 baht", en: "21 baht", category: "números", lesson: 14 },
    { thai: "เงินยี่สิบเอ็ดบาท", phonetic: "ngoen yîi-sìp-èt bàat", es: "ngoen yî-sìp-èt bàt", tone: "m-f-l-h-l", spanish: "21 baht (en dinero)", en: "21 baht (in money)", category: "números", lesson: 14 },
    { thai: "สองห้อง", phonetic: "sǎawng hɔ̂ɔng", es: "sǒng hóng", tone: "r-f", spanish: "2 habitaciones", en: "2 rooms", category: "números", lesson: 14 },
    { thai: "จองสองห้อง", phonetic: "jong sǎawng hɔ̂ɔng", es: "chong sǒng hóng", tone: "m-r-f", spanish: "reservar dos habitaciones", en: "to book two rooms", category: "números", lesson: 14 },
    { thai: "แก้วน้ำ", phonetic: "gâaew-náam", es: "káo-nám", tone: "h-h", spanish: "vaso de agua", en: "drinking glass", category: "sustantivos", lesson: 14 },
    { thai: "ขอแก้วน้ำหน่อย", phonetic: "khǒo gâaew-náam nòi", es: "kǒo káo-nám nòi", tone: "r-h-h-l", spanish: "¿un vaso de agua, por favor?", en: "a glass of water, please", category: "sustantivos", lesson: 14 },
    { thai: "ขอโทษค่ะ", phonetic: "khǎaw-thôot khâ", es: "kǒ-tôt kâ", tone: "r-f-f", spanish: "disculpe (femenino)", en: "excuse me (female)", category: "saludos", lesson: 14 },
    { thai: "ขอโทษครับ อยู่ไหน", phonetic: "khǎaw-thôot khráp, yùu nǎi", es: "kǒ-tôt kráp, iù nǎi", tone: "r-f-h-m-r", spanish: "disculpe, ¿dónde está?", en: "excuse me, where is it?", category: "saludos", lesson: 14 },
    { thai: "ถึงแล้วค่ะ", phonetic: "thǔeng lɛ́ɛo khâ", es: "tǔng léo kâ", tone: "r-f-f", spanish: "ya llegué (femenino)", en: "I've arrived (female)", category: "verbos", lesson: 14 },
    { thai: "ถึงโรงแรมแล้ว", phonetic: "thǔeng roong-raem lɛ́ɛo", es: "tǔng rong-rem léo", tone: "r-m-m-f", spanish: "ya llegué al hotel", en: "I've arrived at the hotel", category: "verbos", lesson: 14 },
    { thai: "เบียร์สด", phonetic: "bia-sòt", es: "bia-sòt", tone: "m-l", spanish: "cerveza de barril", en: "draft beer", category: "comida", lesson: 14 },
    { thai: "ขอเบียร์สดหนึ่งแก้ว", phonetic: "khǒo bia-sòt nùeng gâaew", es: "kǒo bia-sòt nung káo", tone: "r-m-l-l-h", spanish: "una cerveza de barril, por favor", en: "one draft beer, please", category: "comida", lesson: 14 },
    { thai: "เบียร์ขวด", phonetic: "bia-khuàat", es: "bia-kùat", tone: "m-l", spanish: "cerveza de botella", en: "bottled beer", category: "comida", lesson: 14 },
    { thai: "เบียร์ขวดสองขวด", phonetic: "bia-khuàat sǎawng khuàat", es: "bia-kùat sǒng kùat", tone: "m-l-r-l", spanish: "dos cervezas de botella", en: "two bottled beers", category: "comida", lesson: 14 },
    { thai: "เบียร์กระป๋อง", phonetic: "bia-grà-pǒong", es: "bia-gra-pǒng", tone: "m-l-r", spanish: "cerveza de lata", en: "canned beer", category: "comida", lesson: 14 },
    { thai: "เบียร์กระป๋องสามกระป๋อง", phonetic: "bia-grà-pǒong sǎam grà-pǒong", es: "bia-gra-pǒng sǎm gra-pǒng", tone: "m-l-r-r-l-r", spanish: "tres cervezas de lata", en: "three canned beers", category: "comida", lesson: 14 }
  ],
  conversations: [
    // Saludos
    { q_thai: "สวัสดีครับ คุณชื่ออะไร", q_phonetic: "sà-wàt-dee khráp, khun chêu a-rai", q_es: "sà-uàt-di kráp, kun chǔe à-rai", q_tone: "l-l-m-h-m-r-l-m", q_spanish: "Hello, what's your name?", a_thai: "สวัสดีค่ะ ฉันชื่อ...", a_phonetic: "sà-wàt-dee khâ, chǎn chêu...", a_es: "sà-uàt-di kâ, chǎn chǔe...", a_tone: "l-l-m-f-r-r", a_spanish: "Hello, my name is...", category: "saludos", lesson: 7, q_en: "Hello, what's your name?", a_en: "Hello, my name is..." },
    { q_thai: "ขอบคุณครับ", q_phonetic: "khòp-khun khráp", q_es: "kòp-kun kráp", q_tone: "l-m-h", q_spanish: "Thank you", a_thai: "ไม่เป็นไรค่ะ", a_phonetic: "mâi pen rai khâ", a_es: "mâi bpen rai kâ", a_tone: "f-m-m-f", a_spanish: "You're welcome", category: "saludos", lesson: 1, q_en: "Thank you", a_en: "You're welcome" },
    { q_thai: "ขอโทษครับ", q_phonetic: "khǎaw-thôot khráp", q_es: "kǒ-tôt kráp", q_tone: "r-f-h", q_spanish: "Excuse me", a_thai: "ไม่เป็นไรครับ", a_phonetic: "mâi pen rai khráp", a_es: "mâi bpen rai kráp", a_tone: "f-m-m-h", a_spanish: "Don't worry", category: "saludos", lesson: 1, q_en: "Excuse me", a_en: "Don't worry" },
    { q_thai: "สวัสดีครับ สบายดีไหม", q_phonetic: "sà-wàt-dee khráp, sà-baai dee măi", q_es: "sà-uàt-di kráp, sà-bai di mǎi", q_tone: "l-l-m-h-l-m-m-r", q_spanish: "Hello, how are you?", a_thai: "สบายดีครับ ขอบคุณ", a_phonetic: "sà-baai dee khráp, khòp-khun", a_es: "sà-bai di kráp, kòp-kun", a_tone: "l-m-m-h-l-m", a_spanish: "I'm fine, thank you", category: "saludos", lesson: 4, q_en: "Hello, how are you?", a_en: "I'm fine, thank you" },

    // Pronombres
    { q_thai: "คุณไปไหน", q_phonetic: "khun bpai nǎi", q_es: "kun bpai nǎi", q_tone: "m-m-r", q_spanish: "Where are you going?", a_thai: "ผมไปร้านอาหาร", a_phonetic: "phǒm bpai ráan-aa-hǎan", a_es: "pǒm bpai rán-a-jǎn", a_tone: "r-m-h-m-r", a_spanish: "I go to the restaurant", category: "pronombres", lesson: 2, q_en: "Where are you going?", a_en: "I go to the restaurant" },
    { q_thai: "เขามีอะไร", q_phonetic: "khǎo mee a-rai", q_es: "kǎo mi à-rai", q_tone: "r-m-l-m", q_spanish: "What does he have?", a_thai: "เขามีหนังสือ", a_phonetic: "khǎo mee nǎng-sǔeu", a_es: "kǎo mi nǎng-sǔe", a_tone: "r-m-r-r", a_spanish: "He has a book", category: "pronombres", lesson: 2, q_en: "What does he have?", a_en: "He has a book" },
    { q_thai: "เรากินอะไร", q_phonetic: "rao gin a-rai", q_es: "rao guin à-rai", q_tone: "m-m-l-m", q_spanish: "What do we eat?", a_thai: "เรากินข้าวผัดไทย", a_phonetic: "rao gin khâaw phàt-thai", a_es: "rao guin kâo pàt-tai", a_tone: "m-m-f-l-m", a_spanish: "We eat pad thai", category: "pronombres", lesson: 2, q_en: "What do we eat?", a_en: "We eat pad thai" },
    { q_thai: "พวกเขาชอบอะไร", q_phonetic: "phûuak khǎo chôop a-rai", q_es: "púak kǎo chôp à-rai", q_tone: "h-r-f-l-m", q_spanish: "What do they like?", a_thai: "พวกเขาชอบกินผัก", a_phonetic: "phûuak khǎo chôop gin phàk", a_es: "púak kǎo chôp guin pàk", a_tone: "h-r-f-m-l", a_spanish: "They like to eat vegetables", category: "pronombres", lesson: 2, q_en: "What do they like?", a_en: "They like to eat vegetables" },

    // Verbos
    { q_thai: "คุณอยากไปไหม", q_phonetic: "khun yàak bpai măi", q_es: "kun yàk bpai mǎi", q_tone: "m-l-m-r", q_spanish: "Do you want to go?", a_thai: "อยากครับ ผมอยากไป", a_phonetic: "yàak khráp, phǒm yàak bpai", a_es: "yàk kráp, pǒm yàk bpai", a_tone: "l-h-r-l-m", a_spanish: "Sí, quiero ir", category: "verbos", lesson: 3, q_en: "Do you want to go?", a_en: "Yes, I want to go" },
    { q_thai: "คุณจะกินอะไร", q_phonetic: "khun jà gin a-rai", q_es: "kun chà guin à-rai", q_tone: "m-l-m-l-m", q_spanish: "What are you going to eat?", a_thai: "ผมจะกินข้าวผัดไก่", a_phonetic: "phǒm jà gin khâaw phàt gài", a_es: "pǒm chà guin kâo pàt gài", a_tone: "r-l-m-f-l-l", a_spanish: "I am going to eat fried rice with chicken", category: "verbos", lesson: 2, q_en: "What are you going to eat?", a_en: "I am going to eat fried rice with chicken" },
    { q_thai: "เขาเป็นคนไทยไหม", q_phonetic: "khǎo pen khon thai măi", q_es: "kǎo bpen kon tai mǎi", q_tone: "r-m-m-m-r", q_spanish: "Is he Thai?", a_thai: "ไม่ใช่ เขาเป็นคนสเปน", a_phonetic: "mâi châi, khǎo pen khon sa-pen", a_es: "mâi châi, kǎo bpen kon sa-bpen", a_tone: "f-f-r-m-m-m-m", a_spanish: "No, he is Spanish", category: "verbos", lesson: 3, q_en: "Is he Thai?", a_en: "No, he is Spanish" },
    { q_thai: "คุณชอบกินไหม", q_phonetic: "khun chôop gin măi", q_es: "kun chôp guin mǎi", q_tone: "m-f-m-r", q_spanish: "Do you like to eat?", a_thai: "ชอบครับ กินเก่ง", a_phonetic: "chôop khráp, gin gèng", a_es: "chôp kráp, gin gèng", a_tone: "f-h-m-l", a_spanish: "Sí, soy de buen comer", category: "verbos", lesson: 3, q_en: "Do you like to eat?", a_en: "Yes, I like to eat a lot" },
    { q_thai: "คุณมีเวลาไหม", q_phonetic: "khun mee wee-laa măi", q_es: "kun mi ui-la mǎi", q_tone: "m-m-m-m-r", q_spanish: "Do you have time?", a_thai: "ไม่มีครับ ผมต้องไปแล้ว", a_phonetic: "mâi mee khráp, phǒm dtông bpai lɛ́ɛo", a_es: "mâi mi kráp, pǒm tóng bpai lêo", a_tone: "f-m-h-r-f-m-h", a_spanish: "No tengo, tengo que irme", category: "verbos", lesson: 2, q_en: "Do you have time?", a_en: "No I don't, I'm going" },

    // Sabores
    { q_thai: "อาหารอร่อยไหม", q_phonetic: "aa-hǎan à-rôi măi", q_es: "a-jǎn à-rôi mǎi", q_tone: "m-r-l-f-r", q_spanish: "Is the food delicious?", a_thai: "อร่อยมาก!", a_phonetic: "à-rôi mâak", a_es: "à-rôi mâk", a_tone: "l-f-f", a_spanish: "Very delicious!", category: "sabores", lesson: 3, q_en: "Is the food delicious?", a_en: "Very delicious!" },
    { q_thai: "เผ็ดไหม", q_phonetic: "phèt măi", q_es: "pèt mǎi", q_tone: "l-r", q_spanish: "Is it spicy?", a_thai: "เผ็ดมาก!", a_phonetic: "phèt mâak", a_es: "pèt mâk", a_tone: "l-f", a_spanish: "Very spicy!", category: "sabores", lesson: 3, q_en: "Is it spicy?", a_en: "Very spicy!" },
    { q_thai: "คุณชอบหวานไหม", q_phonetic: "khun chôop waan măi", q_es: "kun chôp uǎn mǎi", q_tone: "m-f-r-r", q_spanish: "Do you like sweet?", a_thai: "ไม่ชอบ ผมชอบเค็ม", a_phonetic: "mâi chôop, phǒm chôop khem", a_es: "mâi chôp, pǒm chôp kem", a_tone: "f-f-r-f-m", a_spanish: "No, I like salty", category: "sabores", lesson: 3, q_en: "Do you like sweet?", a_en: "No, I like salty" },
    { q_thai: "ผลไม้หวานไหม", q_phonetic: "phǒn-lá-mái waan măi", q_es: "pǒn-lá-mái uǎn mǎi", q_tone: "r-h-h-r-r", q_spanish: "Is the fruit sweet?", a_thai: "หวานมาก อร่อยด้วย", a_phonetic: "waan mâak, à-rôi dûuai", a_es: "uǎn mâk, à-rôi dûai", a_tone: "r-l-m-f-f", a_spanish: "Muy dulce y también deliciosa", category: "sabores", lesson: 3, q_en: "Is the fruit sweet?", a_en: "Very sweet and delicious" },

    // Comida
    { q_thai: "คุณเอาอะไร", q_phonetic: "khun ao a-rai", q_es: "kun ao à-rai", q_tone: "m-m-l-m", q_spanish: "What would you like (to order)?", a_thai: "ผมเอาผัดไทย", a_phonetic: "phǒm ao phàt-thai", a_es: "pǒm ao pàt-tai", a_tone: "r-m-l-m", a_spanish: "I want pad thai", category: "comida", lesson: 2, q_en: "What would you like (to order)?", a_en: "I want pad thai" },
    { q_thai: "มีอาหารอะไร", q_phonetic: "mee aa-hǎan a-rai", q_es: "mi a-jǎn à-rai", q_tone: "m-m-r-l-m", q_spanish: "What food is there?", a_thai: "มีข้าว กินไก่ ปลา", a_phonetic: "mee khâaw, gin gài, plaa", a_es: "mi kâo, guin gài, bpla", a_tone: "m-f-m-l-m", a_spanish: "There is rice, chicken, fish", category: "comida", lesson: 2, q_en: "What food is there?", a_en: "There is rice, chicken, fish" },
    { q_thai: "อยากกินไก่ไหม", q_phonetic: "yàak gin gài măi", q_es: "yàk guin gài mǎi", q_tone: "l-m-l-r", q_spanish: "Do you want to eat chicken?", a_thai: "ไม่อยากกินไก่ ผมเอาหมู", a_phonetic: "mâi yàak gin gài, phǒm ao mǔu", a_es: "mâi yàk guin gài, pǒm ao mǔ", a_tone: "f-l-m-l-r-m-r", a_spanish: "I don't want chicken, I want pork", category: "comida", lesson: 3, q_en: "Do you want to eat chicken?", a_en: "I don't want chicken, I want pork" },
    { q_thai: "คุณกินผักไหม", q_phonetic: "khun gin phàk măi", q_es: "kun guin pàk mǎi", q_tone: "m-m-l-r", q_spanish: "Do you eat vegetables?", a_thai: "กินครับ ผมชอบผักมาก", a_phonetic: "gin khráp, phǒm chôop phàk mâak", a_es: "guin kráp, pǒm chôp pàk mâk", a_tone: "m-h-r-f-l-f", a_spanish: "Yes, I like vegetables a lot", category: "comida", lesson: 3, q_en: "Do you eat vegetables?", a_en: "Yes, I like vegetables a lot" },
    { q_thai: "มีน้ำไหม", q_phonetic: "mee náam măi", q_es: "mi nám mǎi", q_tone: "m-h-r", q_spanish: "Is there water?", a_thai: "มีครับ น้ำเย็นหรือน้ำร้อน", a_phonetic: "mee khráp, náam yen rǔeu náam râwn", a_es: "mi kráp, nám ian rǔe nám rôn", a_tone: "m-h-h-m-r-h-f", a_spanish: "Yes, cold water or hot water", category: "comida", lesson: 3, q_en: "Is there water?", a_en: "Yes, cold water or hot water" },

    // Números
    { q_thai: "คุณกินข้าวกี่จาน", q_phonetic: "khun gin khâaw gìi jaan", q_es: "kun guin kâo kì chan", q_tone: "m-m-f-l-m", q_spanish: "How many plates of rice do you eat?", a_thai: "ผมกินข้าวสองจาน", a_phonetic: "phǒm gin khâaw sǎawng jaan", a_es: "pǒm guin kâo sǒng chàn", a_tone: "r-m-f-r-l-m", a_spanish: "I eat two plates of rice", category: "números", lesson: 6, q_en: "How many plates of rice do you eat?", a_en: "I eat two plates of rice" },
    { q_thai: "เบอร์โทรคุณหมายเลขอะไร", q_phonetic: "boe-tho khun mǎai-le a-rai", q_es: "bò-to kun mǎi-lè à-rai", q_tone: "l-m-m-r-l-l-m", q_spanish: "What is your phone number?", a_thai: "หนึ่ง สอง สาม สี่ ห้า", a_phonetic: "nùeng sǎawng sǎam sìi hâa", a_es: "nùng sǒng sǎm sì jâ", a_tone: "l-r-r-l-f", a_spanish: "One, two, three, four, five", category: "números", lesson: 2, q_en: "What is your phone number?", a_en: "One, two, three, four, five" },
    { q_thai: "มีไก่กี่ตัว", q_phonetic: "mee gài gìi tua", q_es: "mi gài kì dtua", q_tone: "m-l-l-m", q_spanish: "How many chickens are there?", a_thai: "มีไก่ห้าตัว", a_phonetic: "mee gài hâa tua", a_es: "mi gài jâ dtua", a_tone: "m-l-f-m", a_spanish: "There are five chickens", category: "números", lesson: 6, q_en: "How many chickens are there?", a_en: "There are five chickens" },
    { q_thai: "ผลไม้เท่าไหร่", q_phonetic: "phǒn-lá-mái thâo-rài", q_es: "pǒn-lá-mái tâo-rǎi", q_tone: "r-h-h-f-r", q_spanish: "How much does the fruit cost?", a_thai: "ห้าสิบบาท", a_phonetic: "hâa sìp bàat", a_es: "jâ sìp bàt", a_tone: "f-l-l", a_spanish: "Fifty baht", category: "números", lesson: 6, q_en: "How much does the fruit cost?", a_en: "Fifty baht" },

    // Preguntas
    { q_thai: "คุณชื่ออะไร", q_phonetic: "khun chêu a-rai", q_es: "kun chǔe à-rai", q_tone: "m-r-l-m", q_spanish: "What's your name?", a_thai: "ผมชื่อ...", a_phonetic: "phǒm chêu...", a_es: "pǒm chǔe...", a_tone: "r-r", a_spanish: "My name is...", category: "preguntas", lesson: 2, q_en: "What's your name?", a_en: "My name is..." },
    { q_thai: "ห้องน้ำอยู่ที่ไหน", q_phonetic: "hông-náam yùu thîi-nǎi", q_es: "jông-nâm iû tî-nǎi", q_tone: "f-f-f-f-r", q_spanish: "Where is the bathroom?", a_thai: "ห้องน้ำอยู่ที่นี่", a_phonetic: "hông-náam yùu thîi-nîi", a_es: "jông-nâm iû tî-nî", a_tone: "f-f-f-f-f", a_spanish: "The bathroom is here", category: "preguntas", lesson: 2, q_en: "Where is the bathroom?", a_en: "The bathroom is here" },
    { q_thai: "คุณมาจากที่ไหน", q_phonetic: "khun maa jàak thîi-nǎi", q_es: "kun ma chàk tî-nǎi", q_tone: "m-m-l-f-r", q_spanish: "Where do you come from?", a_thai: "ผมมาจากสเปน", a_phonetic: "phǒm maa jàak sa-pen", a_es: "pǒm ma chàk sa-pen", a_tone: "r-m-l-m-m-m", a_spanish: "I come from Spain", category: "preguntas", lesson: 2, q_en: "Where do you come from?", a_en: "I come from Spain" },
    { q_thai: "อาหารอะไรอร่อย", q_phonetic: "aa-hǎan a-rai à-rôi", q_es: "a-jǎn à-rai à-rôi", q_tone: "m-r-l-m-l-f", q_spanish: "What food is good?", a_thai: "ผัดไทยอร่อยมาก", a_phonetic: "phàt-thai à-rôi mâak", a_es: "pàt-tai à-rôi mâk", a_tone: "l-m-l-f-f", a_spanish: "Pad thai is very good", category: "preguntas", lesson: 2, q_en: "What food is good?", a_en: "Pad thai is very good" },

    // Tiendas
    { q_thai: "ร้านอาหารอยู่ที่ไหน", q_phonetic: "ráan-aa-hǎan yùu thîi-nǎi", q_es: "rán-a-jǎn iû tî-nǎi", q_tone: "h-m-r-f-f-r", q_spanish: "Where is the restaurant?", a_thai: "ร้านอาหารอยู่ที่นี่", a_phonetic: "ráan-aa-hǎan yùu thîi-nîi", a_es: "rán-a-jǎn iû tî-nî", a_tone: "h-m-r-f-f-f", a_spanish: "The restaurant is here", category: "tiendas", lesson: 2, q_en: "Where is the restaurant?", a_en: "The restaurant is here" },
    { q_thai: "คุณไปร้านกาแฟไหม", q_phonetic: "khun bpai ráan-gaa-faa măi", q_es: "kun bpai rán-ga-fa mǎi", q_tone: "m-m-h-m-m-r", q_spanish: "Are you going to the cafe?", a_thai: "ไปครับ ไปกินกาแฟ", a_phonetic: "bpai khráp, bpai gin gaa-faa", a_es: "bpai kráp, bpai guin ga-fa", a_tone: "m-h-m-m-m-r", a_spanish: "Sí, voy a tomar café", category: "tiendas", lesson: 2, q_en: "Are you going to the cafe?", a_en: "Yes, I'm going to drink coffee" },

    // Sustantivos
    { q_thai: "หนังสือเล่มนี้ดีไหม", q_phonetic: "nǎng-sǔeu lém nîi dee măi", q_es: "nǎng-sǔe lèm ní di mǎi", q_tone: "r-r-l-h-m-r", q_spanish: "Is this book good?", a_thai: "ดีมาก ผมชอบ", a_phonetic: "dee mâak, phǒm chôop", a_es: "di mâk, pǒm chôp", a_tone: "m-f-r-f", a_spanish: "Very good, I like it", category: "sustantivos", lesson: 2, q_en: "Is this book good?", a_en: "Very good, I like it" },
    { q_thai: "คุณมีหนังสือไหม", q_phonetic: "khun mee nǎng-sǔeu măi", q_es: "kun mi nǎng-sǔe mǎi", q_tone: "m-m-r-r-r", q_spanish: "Do you have a book?", a_thai: "มีครับ ผมมีหนังสือหนึ่งเล่ม", a_phonetic: "mee khráp, phǒm mee nǎng-sǔeu nùeng lém", a_es: "mi kráp, pǒm mi nǎng-sǔe nùng lèm", a_tone: "m-h-r-m-r-r-l-l", a_spanish: "Yes, I have a book", category: "sustantivos", lesson: 2, q_en: "Do you have a book?", a_en: "Yes, I have a book" },

    // Lesson 3 - Conversations
    { q_thai: "คุณพูดไทยได้ไหม", q_phonetic: "khun phûut thai dâi măi", q_es: "kun pût tai dâi mǎi", q_tone: "m-f-m-f-r", q_spanish: "Can you speak Thai?", a_thai: "ผมพูดไทยได้นิดหน่อย", a_phonetic: "phǒm phûut thai dâi nìt-nɔ̀ɔy", a_es: "pǒm pût tai dâi nìt-nòi", a_tone: "r-f-m-f-l-l", a_spanish: "I can speak Thai a little", category: "verbos", lesson: 3, q_en: "Can you speak Thai?", a_en: "I can speak Thai a little" },
    { q_thai: "ขอบคุณค่ะ", q_phonetic: "khòp-khun khâ", q_es: "kòp-kun kâ", q_tone: "l-m-f", q_spanish: "Thank you", a_thai: "ยินดีครับ", a_phonetic: "yin-dee khráp", a_es: "yin-di kráp", a_tone: "m-m-h", a_spanish: "You're welcome", category: "saludos", lesson: 3, q_en: "Thank you", a_en: "You're welcome" },
    { q_thai: "ครูสอนอะไร", q_phonetic: "khruu sɔ̌ɔn a-rai", q_es: "kru sǒn à-rai", q_tone: "m-r-l-m", q_spanish: "What does the teacher teach?", a_thai: "ครูสอนภาษาไทย", a_phonetic: "khruu sɔ̌ɔn phaa-sǎa thai", a_es: "kru sǒn pǎ-sa tai", a_tone: "m-r-r-m", a_spanish: "The teacher teaches Thai", category: "verbos", lesson: 3, q_en: "What does the teacher teach?", a_en: "The teacher teaches Thai" },
    { q_thai: "คุณทำอาหารได้ไหม", q_phonetic: "khun tam-aa-hǎan dâi măi", q_es: "kun tam-a-jǎn dâi mǎi", q_tone: "m-m-m-r-f-r", q_spanish: "Can you cook?", a_thai: "ผมทำอาหารไทยได้", a_phonetic: "phǒm tam-aa-hǎan thai dâi", a_es: "pǒm tam-a-jǎn tai dâi", a_tone: "r-m-m-r-m-f", a_spanish: "I can cook Thai food", category: "verbos", lesson: 3, q_en: "Can you cook?", a_en: "I can cook Thai food" },
    { q_thai: "คุณฟังไทยได้ไหม", q_phonetic: "khun fang thai dâi măi", q_es: "kun fang tai dâi mǎi", q_tone: "m-m-m-f-r", q_spanish: "Can you understand Thai?", a_thai: "ฟังได้นิดหน่อย", a_phonetic: "fang dâi nìt-nɔ̀ɔy", a_es: "fang dâi nìt-nòi", a_tone: "m-f-l-l", a_spanish: "I can understand a little", category: "verbos", lesson: 3, q_en: "Can you understand Thai?", a_en: "I can understand a little" },

    // Lesson 4 - Conversations
    { q_thai: "สบายดีไหมครับ", q_phonetic: "sà-baai dee măi khráp", q_es: "sà-bai di mǎi kráp", q_tone: "l-m-m-r-h", q_spanish: "How are you? (male asking)", a_thai: "สบายดีครับ ขอบคุณ", a_phonetic: "sà-baai dee khráp, khòp-khun", a_es: "sà-bai di kráp, kòp-kun", a_tone: "l-m-m-h-l-m", a_spanish: "I'm fine, thank you", category: "saludos", lesson: 4, q_en: "How are you? (male)", a_en: "I'm fine, thank you" },
    { q_thai: "สบายดีไหมค่ะ", q_phonetic: "sà-baai dee măi khâ", q_es: "sà-bai di mǎi kâ", q_tone: "l-m-m-r-f", q_spanish: "How are you? (female asking)", a_thai: "สบายดีค่ะ ขอบคุณ", a_phonetic: "sà-baai dee khâ, khòp-khun", a_es: "sà-bai di kâ, kòp-kun", a_tone: "l-m-m-f-l-m", a_spanish: "I'm fine, thank you", category: "saludos", lesson: 4, q_en: "How are you? (female)", a_en: "I'm fine, thank you" },
    { q_thai: "คุณมาจากที่ไหน", q_phonetic: "khun maa jàak thîi-nǎi", q_es: "kun ma chàk tî-nǎi", q_tone: "m-m-l-f-r", q_spanish: "Where do you come from?", a_thai: "ผมมาจากสเปน", a_phonetic: "phǒm maa jàak sà-pen", a_es: "pǒm ma chàk sà-pen", a_tone: "r-m-l-l-m", a_spanish: "I come from Spain", category: "preguntas", lesson: 4, q_en: "Where do you come from?", a_en: "I come from Spain" },
    { q_thai: "คุณทำงานที่ไหน", q_phonetic: "khun tam-ngaan thîi-nǎi", q_es: "kun tam-ngan tî-nǎi", q_tone: "m-m-m-f-r", q_spanish: "Where do you work?", a_thai: "ผมทำงานโรงแรม", a_phonetic: "phǒm tam-ngaan roong-raem", a_es: "pǒm tam-ngan rong-rem", a_tone: "r-m-m-m-m", a_spanish: "I work at the hotel", category: "verbos", lesson: 4, q_en: "Where do you work?", a_en: "I work at the hotel" },
    { q_thai: "พยาบาลชื่ออะไร", q_phonetic: "pha-yaa-baan chêu a-rai", q_es: "pa-ya-ban chǔe à-rai", q_tone: "m-m-m-r-l-m", q_spanish: "What is the nurse's name?", a_thai: "พยาบาลชื่อ...", a_phonetic: "pha-yaa-baan chêu...", a_es: "pa-ya-ban chǔe...", a_tone: "m-m-m-r", a_spanish: "The nurse's name is...", category: "sustantivos", lesson: 4, q_en: "What is the nurse's name?", a_en: "The nurse's name is..." },
    { q_thai: "คุณนอนที่ไหน", q_phonetic: "khun nɔɔn thîi-nǎi", q_es: "kun non tî-nǎi", q_tone: "m-m-f-r", q_spanish: "Where do you sleep?", a_thai: "ผมนอนที่โรงแรม", a_phonetic: "phǒm nɔɔn thîi roong-raem", a_es: "pǒm non tî rong-rem", a_tone: "r-m-f-m-m", a_spanish: "I sleep at the hotel", category: "verbos", lesson: 4, q_en: "Where do you sleep?", a_en: "I sleep at the hotel" },

    // Lesson 5 - Conversations
    { q_thai: "คุณเรียนอะไร", q_phonetic: "khun rian a-rai", q_es: "kun rian à-rai", q_tone: "m-m-l-m", q_spanish: "What do you study?", a_thai: "ผมเรียนภาษาไทย", a_phonetic: "phǒm rian phaa-sǎa thai", a_es: "pǒm rian pǎ-sa tai", a_tone: "r-m-r-m-m", a_spanish: "I study Thai language", category: "verbos", lesson: 5, q_en: "What do you study?", a_en: "I study Thai language" },
    { q_thai: "คุณเข้าใจไหม", q_phonetic: "khun khâo-jai măi", q_es: "kun kâo-chai mǎi", q_tone: "m-f-m-r", q_spanish: "Do you understand?", a_thai: "เข้าใจครับ", a_phonetic: "khâo-jai khráp", a_es: "kâo-chai kráp", a_tone: "f-m-h", a_spanish: "I understand", category: "verbos", lesson: 5, q_en: "Do you understand?", a_en: "I understand" },
    { q_thai: "ผมไม่เข้าใจ", q_phonetic: "phǒm mâi khâo-jai", q_es: "pǒm mâi kâo-chai", q_tone: "r-f-f-m", q_spanish: "I don't understand", a_thai: "ไม่เป็นไร ผมช่วย", a_phonetic: "mâi pen rai, phǒm chûuai", a_es: "mâi pen rai, pǒm chuai", a_tone: "f-m-m-r-m-f", a_spanish: "No problem, I'll help", category: "verbos", lesson: 5, q_en: "I don't understand", a_en: "No problem, I'll help" },
    { q_thai: "คุณคิดถึงใคร", q_phonetic: "khun khít-teung khrai", q_es: "kun kìd-těung krai", q_tone: "m-l-r-m", q_spanish: "Who do you miss?", a_thai: "ผมคิดถึงครู", a_phonetic: "phǒm khít-teung khruu", a_es: "pǒm kìd-těung kru", a_tone: "r-l-r-m", a_spanish: "I miss the teacher", category: "verbos", lesson: 5, q_en: "Who do you miss?", a_en: "I miss the teacher" },
    { q_thai: "คุณไปเที่ยวไหม", q_phonetic: "khun bpai thîao măi", q_es: "kun bpai tîo mǎi", q_tone: "m-m-f-r", q_spanish: "Do you go traveling?", a_thai: "ไปครับ ผมไปเที่ยวตลาดกลางคืน", a_phonetic: "bpai khráp, phǒm bpai thîao tà-làat klang-kheun", a_es: "bpai kráp, pǒm bpai tîo tà-lat-klang-ken", a_tone: "m-h-r-m-f-l-m-m-m", a_spanish: "Yes, I go to the night market", category: "verbos", lesson: 5, q_en: "Do you go traveling?", a_en: "Yes, I go to the night market" },
    { q_thai: "คุณไปซื้อของที่ไหน", q_phonetic: "khun bpai súeu kǒng thîi-nǎi", q_es: "kun bpai sú-kǒng tî-nǎi", q_tone: "m-m-h-r-f-r", q_spanish: "Where do you go shopping?", a_thai: "ผมไปห้าง", a_phonetic: "phǒm bpai hâng", a_es: "pǒm bpai jâng", a_tone: "r-m-f", a_spanish: "I go to the mall", category: "tiendas", lesson: 5, q_en: "Where do you go shopping?", a_en: "I go to the mall" },
    { q_thai: "ตลาดเช้าอยู่ที่ไหน", q_phonetic: "tà-làat cháo yùu thîi-nǎi", q_es: "tà-lat-chǎo iu tî-nǎi", q_tone: "l-m-r-m-f-r", q_spanish: "Where is the morning market?", a_thai: "อยู่ใกล้ที่นี่", a_phonetic: "yùu glai thîi-nîi", a_es: "iu glai tî-nî", a_tone: "m-m-f-f", a_spanish: "It's near here", category: "tiendas", lesson: 5, q_en: "Where is the morning market?", a_en: "It's near here" },
    { q_thai: "คุณซื้ออะไร", q_phonetic: "khun súeu a-rai", q_es: "kun sú à-rai", q_tone: "m-h-l-m", q_spanish: "What do you buy?", a_thai: "ผมซื้อผลไม้", a_phonetic: "phǒm súeu phǒn-lá-mái", a_es: "pǒm sú pǒn-lá-mái", a_tone: "r-h-r-h-h", a_spanish: "I buy fruit", category: "tiendas", lesson: 5, q_en: "What do you buy?", a_en: "I buy fruit" },

    // Lesson 6 - Conversations
    { q_thai: "นี่ราคาเท่าไหร่", q_phonetic: "nîi raa-khaa thâo-rài", q_es: "ní ra-ka tâo-râi", q_tone: "h-m-m-f-f", q_spanish: "How much is this?", a_thai: "ห้าสิบบาท", a_phonetic: "hâa sìp bàat", a_es: "jâ sìp bàt", a_tone: "f-l-l", a_spanish: "Fifty baht", category: "números", lesson: 6, q_en: "How much is this?", a_en: "Fifty baht" },
    { q_thai: "ผลไม้กี่บาท", q_phonetic: "phǒn-lá-mái kìi bàat", q_es: "pǒn-lá-mái kì bàt", q_tone: "r-h-h-l-l", q_spanish: "How many baht is the fruit?", a_thai: "ยี่สิบบาท", a_phonetic: "yîi sìp bàat", a_es: "yî sìp bàt", a_tone: "f-l-l", a_spanish: "Twenty baht", category: "números", lesson: 6, q_en: "How many baht is the fruit?", a_en: "Twenty baht" },
    { q_thai: "คุณมีเงินกี่บาท", q_phonetic: "khun mee ngern kìi bàat", q_es: "kun mi ñgen kì bàt", q_tone: "m-m-m-l-l", q_spanish: "How much money do you have?", a_thai: "ผมมีหนึ่งร้อยบาท", a_phonetic: "phǒm mee nùeng rɔ́ɔy bàat", a_es: "pǒm mi nùng rói bàt", a_tone: "r-m-l-h-l", a_spanish: "I have one hundred baht", category: "números", lesson: 6, q_en: "How much money do you have?", a_en: "I have one hundred baht" },
    { q_thai: "ใครขายอาหาร", q_phonetic: "khrai khǎay aa-hǎan", q_es: "krai kǎi a-jǎn", q_tone: "m-r-m-r", q_spanish: "Who sells food?", a_thai: "แม่ค้าขาย", a_phonetic: "mɛ̂ɛ-khâa khǎay", a_es: "mê-kâ kǎi", a_tone: "f-f-r", a_spanish: "The vendor sells", category: "preguntas", lesson: 6, q_en: "Who sells food?", a_en: "The vendor sells" },
    { q_thai: "คุณไปอย่างไร", q_phonetic: "khun bpai yàng-rai", q_es: "kun bpai yâng-rai", q_tone: "m-m-f-m", q_spanish: "How do you go?", a_thai: "ผมไปรถเมล์", a_phonetic: "phǒm bpai rót-me", a_es: "pǒm bpai rót-me", a_tone: "r-m-h-m", a_spanish: "I go by bus", category: "preguntas", lesson: 6, q_en: "How do you go?", a_en: "I go by bus" },
    { q_thai: "คุณจะไปเมื่อไร", q_phonetic: "khun jà bpai mʉ̂a-rai", q_es: "kun chà bpai mûa-rai", q_tone: "m-l-m-f-m", q_spanish: "When will you go?", a_thai: "ผมจะไปพรุ่งนี้", a_phonetic: "phǒm jà bpai prûeng-nîi", a_es: "pǒm chà bpai prúng-ní", a_tone: "r-l-m-h-h", a_spanish: "I will go tomorrow", category: "preguntas", lesson: 6, q_en: "When will you go?", a_en: "I will go tomorrow" },
    { q_thai: "คุณกินแล้วไหม", q_phonetic: "khun gin lɛ̂ɛo măi", q_es: "kun guin lêo mǎi", q_tone: "m-m-f-r", q_spanish: "Have you eaten already?", a_thai: "กินแล้วครับ", a_phonetic: "gin lɛ̂ɛo khráp", a_es: "guin lêo kráp", a_tone: "m-f-h", a_spanish: "I have already eaten", category: "verbos", lesson: 6, q_en: "Have you eaten already?", a_en: "I have already eaten" },
    { q_thai: "คุณกำลังทำอะไร", q_phonetic: "khun gam-lang tam a-rai", q_es: "kun gam-lang tàm à-rai", q_tone: "m-m-m-l-l-m", q_spanish: "What are you doing? (-ing)", a_thai: "ผมกำลังเรียน", a_phonetic: "phǒm gam-lang rian", a_es: "pǒm gam-lang rian", a_tone: "r-m-m-m", a_spanish: "I am studying (-ing)", category: "verbos", lesson: 6, q_en: "What are you doing?", a_en: "I am studying" },

    // Lesson 7 - Conversations
    { q_thai: "คุณชื่ออะไร", q_phonetic: "khun chûue a-rai", q_es: "kun chûe à-rai", q_tone: "m-f-l-m", q_spanish: "What's your name?", a_thai: "ผมชื่อ...", a_phonetic: "phǒm chûue...", a_es: "pǒm chûe...", a_tone: "r-f", a_spanish: "My name is...", category: "preguntas", lesson: 7, q_en: "What's your name?", a_en: "My name is..." },
    { q_thai: "คุณอยู่ที่ไหน", q_phonetic: "khun yùu thîi-nǎi", q_es: "kun iù tî-nǎi", q_tone: "m-l-f-r", q_spanish: "Where do you live?", a_thai: "ผมอยู่กรุงเทพ", a_phonetic: "phǒm yùu krung-thêep", a_es: "pǒm iù krung-tép", a_tone: "r-l-m-h", a_spanish: "I live in Bangkok", category: "preguntas", lesson: 7, q_en: "Where do you live?", a_en: "I live in Bangkok" },
    { q_thai: "บิลเบาอยู่ที่ไหน", q_phonetic: "bin-bao yùu thîi-nǎi", q_es: "bil-bao iù tî-nǎi", q_tone: "m-m-l-f-r", q_spanish: "Where is Bilbao?", a_thai: "บิลเบาอยู่สเปน", a_phonetic: "bin-bao yùu sà-pen", a_es: "bil-bao iù sà-bpen", a_tone: "m-m-l-l-m", a_spanish: "Bilbao is in Spain", category: "sustantivos", lesson: 7, q_en: "Where is Bilbao?", a_en: "Bilbao is in Spain" },
    { q_thai: "คุณดูอะไร", q_phonetic: "khun duu a-rai", q_es: "kun du à-rai", q_tone: "m-m-l-m", q_spanish: "What do you watch?", a_thai: "ผมดูการ์ตูน", a_phonetic: "phǒm duu gaai-dtuun", a_es: "pǒm du ga-dtun", a_tone: "r-m-m-m", a_spanish: "I watch cartoons", category: "verbos", lesson: 7, q_en: "What do you watch?", a_en: "I watch cartoons" },
    { q_thai: "ครูสอนอะไร", q_phonetic: "khruu sɔ̌ɔn a-rai", q_es: "kru sòn à-rai", q_tone: "m-l-l-m", q_spanish: "What does the teacher teach?", a_thai: "ครูสอนอังกฤษ", a_phonetic: "khruu sɔ̌ɔn ang-grìt", a_es: "kru sòn an-grìt", a_tone: "m-l-m-l", a_spanish: "The teacher teaches English", category: "verbos", lesson: 7, q_en: "What does the teacher teach?", a_en: "The teacher teaches English" },
    { q_thai: "คุณอ่านอะไร", q_phonetic: "khun àan a-rai", q_es: "kun àn à-rai", q_tone: "m-l-l-m", q_spanish: "What do you read?", a_thai: "ผมอ่านหนังสือ", a_phonetic: "phǒm àan nǎng-sǔeu", a_es: "pǒm àn nǎng-sǔe", a_tone: "r-l-r-r", a_spanish: "I read a book", category: "verbos", lesson: 7, q_en: "What do you read?", a_en: "I read a book" },
    { q_thai: "ใครส่งของ", q_phonetic: "khrai sòng kǒng", q_es: "krai sòng kǒng", q_tone: "m-l-r", q_spanish: "Who sends things?", a_thai: "พยาบาลส่งของ", a_phonetic: "pha-yaa-baan sòng kǒng", a_es: "pa-ya-bàn sǒng kong", a_tone: "m-m-l-r", a_spanish: "The nurse sends things", category: "verbos", lesson: 7, q_en: "Who sends things?", a_en: "The nurse sends things" },
    { q_thai: "คุณดื่มอะไร", q_phonetic: "khun dùuem a-rai", q_es: "kun dùem à-rai", q_tone: "m-l-l-m", q_spanish: "What do you drink?", a_thai: "น้ำหนึ่งแก้ว", a_phonetic: "náam nùeng gâaew", a_es: "nám nùng kéo", a_tone: "h-l-h", a_spanish: "One glass of water", category: "comida", lesson: 7, q_en: "What do you drink?", a_en: "One glass of water" },
    { q_thai: "คุณกินปาเอยาไหม", q_phonetic: "khun gin paa-ee-yaa măi", q_es: "kun guin bpa-e-yâ mǎi", q_tone: "m-m-m-m-f-r", q_spanish: "Do you eat paella?", a_thai: "กินครับ อร่อยมาก", a_phonetic: "gin khráp, à-rôi mâak", a_es: "guin kráp, à-rôi mâk", a_tone: "m-h-l-f-f", a_spanish: "Yes, it's very delicious", category: "comida", lesson: 7, q_en: "Do you eat paella?", a_en: "Yes, it's very delicious" },

    // Lesson 8 — Tiempo, lugares y objetos
    { q_thai: "คุณกินตอนเช้าไหม", q_phonetic: "khun gin dton-cháo măi", q_es: "kun guin dton-cháo mǎi", q_tone: "m-m-m-h-r", q_spanish: "Do you eat in the morning?", a_thai: "กินครับ ทุกวัน", a_phonetic: "gin khráp, thúk-wan", a_es: "guin kráp, túk-wan", a_tone: "m-h-h-m", a_spanish: "Sí, todos los días", category: "tiempo", lesson: 8, q_en: "Do you eat in the morning?", a_en: "Yes, I eat in the morning" },
    { q_thai: "วันนี้คุณอยู่ที่ไหน", q_phonetic: "wan-níi khun yùu thîi-nǎi", q_es: "wan-ní kun iù tî-nǎi", q_tone: "m-h-m-l-f-r", q_spanish: "Today, where are you?", a_thai: "ผมอยู่กรุงเทพวันนี้", a_phonetic: "phǒm yùu krung-thêep wan-níi", a_es: "pǒm iù krung-tép wan-ní", a_tone: "r-l-m-f-m-h", a_spanish: "Today I'm in Bangkok", category: "tiempo", lesson: 8, q_en: "Today, where are you?", a_en: "Today I'm in Bangkok" },
    { q_thai: "พรุ่งนี้คุณทำงานไหม", q_phonetic: "phrûng-níi khun tam-ngaan măi", q_es: "prûng-ní kun tam-ngan mǎi", q_tone: "f-h-m-m-m-r", q_spanish: "Tomorrow, do you work?", a_thai: "ทำครับ ทั้งวัน", a_phonetic: "tam khráp, thâng-wan", a_es: "tam kráp, tâng-wan", a_tone: "m-h-h-m", a_spanish: "Sí, todo el día", category: "tiempo", lesson: 8, q_en: "Tomorrow, do you work?", a_en: "Yes, tomorrow I work" },
    { q_thai: "คุณนอนตอนกลางคืนไหม", q_phonetic: "khun nɔɔn dton-klang-kheun măi", q_es: "kun non dton-klang-ken mǎi", q_tone: "m-m-m-m-m-r", q_spanish: "Do you sleep at night?", a_thai: "นอนครับ ทุกคืน", a_phonetic: "nɔɔn khráp, thúk-kheun", a_es: "non kráp, túk-ken", a_tone: "m-h-h-m", a_spanish: "Sí, todas las noches", category: "tiempo", lesson: 8, q_en: "Do you sleep at night?", a_en: "Yes, I sleep at night" },
    { q_thai: "เมื่อวานนี้คุณกินอะไร", q_phonetic: "mûea-waan-níi khun gin a-rai", q_es: "mûea-wan-ní kun guin à-rai", q_tone: "f-m-h-m-m-l-m", q_spanish: "Yesterday, what did you eat?", a_thai: "ผมกินข้าวเมื่อวานนี้", a_phonetic: "phǒm gin khâaw mûea-waan-níi", a_es: "pǒm guin kâo mûea-wan-ní", a_tone: "r-m-f-f-m-h", a_spanish: "Yesterday I ate rice", category: "tiempo", lesson: 8, q_en: "Yesterday, what did you eat?", a_en: "Yesterday I ate rice" },
    { q_thai: "ตอนเที่ยงคุณกินไหม", q_phonetic: "dton-thîang khun gin măi", q_es: "dton-tîeng kun guin mǎi", q_tone: "m-f-m-m-r", q_spanish: "At noon, do you eat?", a_thai: "กินครับ เสมอ", a_phonetic: "gin khráp, sà-mǒe", a_es: "guin kráp, sà-mö", a_tone: "m-h-r-m", a_spanish: "Sí, siempre", category: "tiempo", lesson: 8, q_en: "At noon, do you eat?", a_en: "Yes, I eat at noon" },
    { q_thai: "คุณอยู่ที่นี่ไหม", q_phonetic: "khun yùu thîi-nîi măi", q_es: "kun iù tî-nî mǎi", q_tone: "m-l-f-f-r", q_spanish: "Are you here?", a_thai: "อยู่ครับ", a_phonetic: "yùu khráp", a_es: "iù kráp", a_tone: "l-h", a_spanish: "Sí", category: "pronombres", lesson: 8, q_en: "Are you here?", a_en: "Yes, I'm here" },
    { q_thai: "คุณมีปากกากี่อัน", q_phonetic: "khun mee paa-gaa kìi an", q_es: "kun mi bpa-ga kì an", q_tone: "m-m-m-m-l-m", q_spanish: "How many pens do you have?", a_thai: "ผมมีปากกาสองอัน", a_phonetic: "phǒm mee paa-gaa sǎawng an", a_es: "pǒm mi pa-ga sǒng an", a_tone: "r-m-m-m-r-m", a_spanish: "I have two pens", category: "sustantivos", lesson: 8, q_en: "How many pens do you have?", a_en: "I have two pens" },
    { q_thai: "คุณอยู่กรุงเทพไหม", q_phonetic: "khun yùu krung-thêep măi", q_es: "kun iù krung-tép mǎi", q_tone: "m-l-m-f-r", q_spanish: "Are you in Bangkok?", a_thai: "อยู่ครับ", a_phonetic: "yùu khráp", a_es: "iù kráp", a_tone: "l-h", a_spanish: "Sí", category: "sustantivos", lesson: 8, q_en: "Are you in Bangkok?", a_en: "Yes, I'm in Bangkok" },
    { q_thai: "อาทิตย์ร้อนไหม", q_phonetic: "aa-thít râwn măi", q_es: "a-tíd rôn mǎi", q_tone: "m-h-f-r", q_spanish: "Is the sun hot?", a_thai: "ร้อนครับ ร้อนมาก", a_phonetic: "râwn khráp, râwn mâak", a_es: "rôn kráp, rôn mâk", a_tone: "h-h-h-l", a_spanish: "Sí, mucho", category: "sustantivos", lesson: 8, q_en: "Is the sun hot?", a_en: "Yes, the sun is very hot" },
    // Lesson 9 — Telling Time (conversations)
    { q_thai: "ตอนนี้กี่โมง", q_phonetic: "dton-níi kìi mong", q_es: "dton-ní kì mong", q_tone: "m-h-l-m", q_spanish: "What time is it now?", q_en: "What time is it now?", a_thai: "เที่ยงแล้วครับ", a_phonetic: "thîang lɛ̂ɛo khráp", a_es: "tîeng leâo kráp", a_tone: "f-f-h", a_spanish: "It's noon already", a_en: "It's noon already", category: "tiempo", lesson: 9 },
    { q_thai: "ตีสองใช่ไหม", q_phonetic: "dtii sǎawng châi măi", q_es: "dtii sǒng châi mǎi", q_tone: "m-r-f-r", q_spanish: "Is it 2 AM?", q_en: "Is it 2 AM?", a_thai: "ใช่ครับ ตีสอง", a_phonetic: "châi khráp, dtii sǎawng", a_es: "châi kráp, dtii sǒng", a_tone: "f-h-m-r", a_spanish: "Yes, 2 AM", a_en: "Yes, 2 AM", category: "tiempo", lesson: 9 },
    { q_thai: "คุณจองกี่โมง", q_phonetic: "khun jong kìi mong", q_es: "kun chong kì mong", q_tone: "m-m-l-m", q_spanish: "What time did you book?", q_en: "What time did you book?", a_thai: "ผมจองบ่ายโมง", a_phonetic: "phǒm jong bàai mong", a_es: "pǒm chong bài mong", a_tone: "r-m-l-m", a_spanish: "I booked 1 PM", a_en: "I booked 1 PM", category: "tiempo", lesson: 9 },
    { q_thai: "เที่ยงคืนหรือยัง", q_phonetic: "thîang kheun rǔeu yang", q_es: "tîeng ken rǔe ian", q_tone: "f-m-r-m", q_spanish: "Is it midnight yet?", q_en: "Is it midnight yet?", a_thai: "ยังครับ", a_phonetic: "yang khráp", a_es: "ian kráp", a_tone: "m-h", a_spanish: "Not yet", a_en: "Not yet", category: "tiempo", lesson: 9 },
    { q_thai: "คุณเตรียมนอนกี่โมง", q_phonetic: "khun dtriiam nɔɔn kìi mong", q_es: "kun dtriam non kì mong", q_tone: "m-f-m-l-m", q_spanish: "What time do you prepare to sleep?", q_en: "What time do you prepare to sleep?", a_thai: "สองทุ่มครับ", a_phonetic: "sǎawng thùm khráp", a_es: "sǒng tum kráp", a_tone: "r-f-h", a_spanish: "8 PM (2 tum)", a_en: "8 PM (2 tum)", category: "tiempo", lesson: 9 },
    { q_thai: "อาหารเที่ยงอร่อยไหม", q_phonetic: "aa-hǎan thîang à-rôi măi", q_es: "a-jǎn tîeng à-rôi mǎi", q_tone: "m-r-f-l-f-r", q_spanish: "Is lunch delicious?", q_en: "Is lunch delicious?", a_thai: "อร่อยครับ", a_phonetic: "à-rôi khráp", a_es: "à-rôi kráp", a_tone: "l-f-h", a_spanish: "Yes, it's delicious", a_en: "Yes, it's delicious", category: "comida", lesson: 9 },
    { q_thai: "ตอนนี้กี่ทุ่ม", q_phonetic: "dton-níi kìi thùm", q_es: "dton-ní kì tum", q_tone: "m-h-l-f", q_spanish: "What tum is it now? (nighttime)", q_en: "What tum is it now? (nighttime)", a_thai: "สามทุ่มครับ", a_phonetic: "sǎam thùm khráp", a_es: "sǎm tum kráp", a_tone: "m-f-h", a_spanish: "9 PM (3 tum)", a_en: "9 PM (3 tum)", category: "tiempo", lesson: 9 },

    // Lesson 9 — Hours & times of day (morning / afternoon / evening)
    { q_thai: "คุณกินข้าวกี่โมง", q_phonetic: "khun gin khâaw kìi mong", q_es: "kun gin kâo kì mong", q_tone: "m-m-f-l-m", q_spanish: "What time do you eat?", q_en: "What time do you eat?", a_thai: "เที่ยงครับ", a_phonetic: "thîang khráp", a_es: "tîeng kráp", a_tone: "f-h", a_spanish: "At noon", a_en: "At noon", category: "tiempo", lesson: 9 },
    { q_thai: "ตอนบ่ายคุณทำอะไร", q_phonetic: "dton bàai khun tam a-rai", q_es: "dton bài kun tam a-rai", q_tone: "m-l-m-m-m", q_spanish: "What do you do in the afternoon?", q_en: "What do you do in the afternoon?", a_thai: "ผมทำงานครับ", a_phonetic: "phǒm tam-ngaan khráp", a_es: "pǒm tam-ngan kráp", a_tone: "r-m-m-h", a_spanish: "I work", a_en: "I work", category: "tiempo", lesson: 9 },
    { q_thai: "ตอนเย็นคุณทำอะไร", q_phonetic: "dton yen khun tam a-rai", q_es: "dton yen kun tam a-rai", q_tone: "m-m-m-m-m", q_spanish: "What do you do in the evening?", q_en: "What do you do in the evening?", a_thai: "ผมดูทีวีครับ", a_phonetic: "phǒm duu thii-wii khráp", a_es: "pǒm du ti-wí kráp", a_tone: "r-m-m-m-h", a_spanish: "I watch TV", a_en: "I watch TV", category: "tiempo", lesson: 9 },
    { q_thai: "วันนี้วันอะไร", q_phonetic: "wan-níi wan a-rai", q_es: "wan-ní wan a-rai", q_tone: "m-h-m-m", q_spanish: "What day is today?", q_en: "What day is today?", a_thai: "วันอาทิตย์ครับ", a_phonetic: "wan aa-thít khráp", a_es: "wan a-tít kráp", a_tone: "m-m-h-h", a_spanish: "Sunday", a_en: "Sunday", category: "tiempo", lesson: 9 },
    { q_thai: "คุณไปกี่โมง", q_phonetic: "khun bpai kìi mong", q_es: "kun bpai kì mong", q_tone: "m-m-l-m", q_spanish: "What time do you go?", q_en: "What time do you go?", a_thai: "บ่ายสามโมงครับ", a_phonetic: "bàai sǎam mong khráp", a_es: "bài sǎm mong kráp", a_tone: "l-m-m-h", a_spanish: "3 PM", a_en: "3 PM", category: "tiempo", lesson: 9 },
    { q_thai: "หกโมงเช้าใช่ไหม", q_phonetic: "hòk mong cháo châi măi", q_es: "hòk mong cháo châi mǎi", q_tone: "l-m-h-f-r", q_spanish: "Is it 6 AM?", q_en: "Is it 6 AM?", a_thai: "ใช่ครับ", a_phonetic: "châi khráp", a_es: "châi kráp", a_tone: "f-h", a_spanish: "Yes", a_en: "Yes", category: "tiempo", lesson: 9 },
    { q_thai: "ตอนเย็นใช่ไหม", q_phonetic: "dton yen châi măi", q_es: "dton yen châi mǎi", q_tone: "m-m-f-r", q_spanish: "Is it evening?", q_en: "Is it evening?", a_thai: "ไม่ใช่ครับ ตอนบ่าย", a_phonetic: "mâi châi khráp, dton bàai", a_es: "mâi châi kráp, dton bài", a_tone: "f-f-h-m-l", a_spanish: "No, it's afternoon", a_en: "No, it's afternoon", category: "tiempo", lesson: 9 },
    { q_thai: "ข้าวเช้ากี่โมง", q_phonetic: "khâaw cháo kìi mong", q_es: "kâo cháo kì mong", q_tone: "f-h-l-m", q_spanish: "What time is breakfast?", q_en: "What time is breakfast?", a_thai: "เจ็ดโมงเช้าครับ", a_phonetic: "jèt mong cháo khráp", a_es: "chèt mong cháo kráp", a_tone: "l-m-h-h", a_spanish: "7 AM", a_en: "7 AM", category: "tiempo", lesson: 9 },
    { q_thai: "ข้าวเย็นกี่โมง", q_phonetic: "khâaw yen kìi mong", q_es: "kâo yen kì mong", q_tone: "f-m-l-m", q_spanish: "What time is dinner?", q_en: "What time is dinner?", a_thai: "ห้าโมงเย็นครับ", a_phonetic: "hâa mong yen khráp", a_es: "jâ mong yen kráp", a_tone: "f-m-m-h", a_spanish: "5 PM", a_en: "5 PM", category: "tiempo", lesson: 9 },
    { q_thai: "ตอนบ่ายใช่ไหม", q_phonetic: "dton bàai châi măi", q_es: "dton bài châi mǎi", q_tone: "m-l-f-r", q_spanish: "Is it afternoon?", q_en: "Is it afternoon?", a_thai: "ใช่ครับ", a_phonetic: "châi khráp", a_es: "châi kráp", a_tone: "f-h", a_spanish: "Yes", a_en: "Yes", category: "tiempo", lesson: 9 },
    { q_thai: "คุณนอนกี่โมง", q_phonetic: "khun nɔɔn kìi mong", q_es: "kun non kì mong", q_tone: "m-m-l-m", q_spanish: "What time do you sleep?", q_en: "What time do you sleep?", a_thai: "เที่ยงคืนครับ", a_phonetic: "thîang kheun khráp", a_es: "tîeng ken kráp", a_tone: "f-m-h", a_spanish: "Midnight", a_en: "Midnight", category: "tiempo", lesson: 9 },
    { q_thai: "อาหารเที่ยงกี่โมง", q_phonetic: "aa-hǎan thîang kìi mong", q_es: "a-jǎn tîeng kì mong", q_tone: "m-r-f-l-m", q_spanish: "What time is lunch?", q_en: "What time is lunch?", a_thai: "เที่ยงครับ", a_phonetic: "thîang khráp", a_es: "tîeng kráp", a_tone: "f-h", a_spanish: "At noon", a_en: "At noon", category: "tiempo", lesson: 9 },

    // === LESSON 10: CONVERSATIONS — COLORES ===
    { q_thai: "คุณชอบสีอะไร", q_phonetic: "khun chôop sǐi a-rai", q_es: "kun chóp sǐ à-rai", q_tone: "m-f-l-m-l-m", q_spanish: "What color do you like?", q_en: "What color do you like?", a_thai: "ผมชอบสีเขียว", a_phonetic: "phǒm chôop sǐi-khǐao", a_es: "pǒm chóp sǐ-kǐao", a_tone: "r-f-l-r", a_spanish: "I like green", a_en: "I like green", category: "colores", lesson: 10 },
    { q_thai: "สีโปรดของคุณคืออะไร", q_phonetic: "sǐi pròot khǎng khun kheu a-rai", q_es: "sǐ pròt kǎng kun keu à-rai", q_tone: "m-l-h-m-m-l-m", q_spanish: "What is your favorite color?", q_en: "What is your favorite color?", a_thai: "สีโปรดคือสีฟ้า", a_phonetic: "sǐi pròot kheu sǐi-fáa", a_es: "sǐ pròt keu sǐ-fá", a_tone: "m-l-m-l-h", a_spanish: "My favorite color is light blue", a_en: "My favorite color is light blue", category: "colores", lesson: 10 },
    { q_thai: "รถคันนี้สีอะไร", q_phonetic: "rót khan níi sǐi a-rai", q_es: "rót kan ní sǐ à-rai", q_tone: "h-m-h-m-l-m", q_spanish: "What color is this car?", q_en: "What color is this car?", a_thai: "รถสีแดง", a_phonetic: "rót sǐi-dǎeng", a_es: "rót sǐ-dǎeng", a_tone: "h-l-r", a_spanish: "The car is red", a_en: "The car is red", category: "colores", lesson: 10 },
    { q_thai: "คุณชอบสีดำไหม", q_phonetic: "khun chôop sǐi-dam măi", q_es: "kun chóp sǐ-dam mǎi", q_tone: "m-f-l-m-r", q_spanish: "Do you like black?", q_en: "Do you like black?", a_thai: "ไม่ชอบครับ", a_phonetic: "mâi chôop khráp", a_es: "mâi chóp kráp", a_tone: "f-f-h", a_spanish: "No, I don't", a_en: "No, I don't", category: "colores", lesson: 10 },

    // === LESSON 10: CONVERSATIONS — RUTINA DIARIA ===
    { q_thai: "คุณตื่นนอนกี่โมง", q_phonetic: "khun dtùen-nɔɔn kìi mong", q_es: "kun dtùen-non kì mong", q_tone: "m-l-m-l-m", q_spanish: "What time do you wake up?", q_en: "What time do you wake up?", a_thai: "ผมตื่นนอนหกโมงเช้า", a_phonetic: "phǒm dtùen-nɔɔn hòk mong cháo", a_es: "pǒm dtùen-non hòk mong cháo", a_tone: "r-l-m-l-m-h", a_spanish: "I wake up at 6 AM", a_en: "I wake up at 6 AM", category: "verbos", lesson: 10 },
    { q_thai: "คุณอาบน้ำตอนเช้าไหม", q_phonetic: "khun àap-nám dton-cháo măi", q_es: "kun àap-nám dton-cháo mǎi", q_tone: "m-l-h-m-h-r", q_spanish: "Do you shower in the morning?", q_en: "Do you shower in the morning?", a_thai: "อาบครับ ทุกเช้า", a_phonetic: "àap khráp, thúk-cháo", a_es: "àap kráp, túk-cháo", a_tone: "l-h-h-h", a_spanish: "Yes, every morning", a_en: "Yes, every morning", category: "verbos", lesson: 10 },
    { q_thai: "คุณกลับบ้านกี่โมง", q_phonetic: "khun glàp-bâan kìi mong", q_es: "kun glàp-bân kì mong", q_tone: "m-l-f-l-m", q_spanish: "What time do you go back home?", q_en: "What time do you go back home?", a_thai: "ห้าโมงเย็นครับ", a_phonetic: "hâa mong yen khráp", a_es: "jâ mong ien kráp", a_tone: "f-m-m-h", a_spanish: "5 PM", a_en: "5 PM", category: "verbos", lesson: 10 },
    { q_thai: "คุณนอนกี่โมง", q_phonetic: "khun nɔɔn kìi mong", q_es: "kun non kì mong", q_tone: "m-m-l-m", q_spanish: "What time do you go to sleep?", q_en: "What time do you go to sleep?", a_thai: "สี่ทุ่มครับ", a_phonetic: "sìi thùm khráp", a_es: "sì tum kráp", a_tone: "l-f-h", a_spanish: "10 PM (4 tum)", a_en: "10 PM", category: "verbos", lesson: 10 },

    // === LESSON 10: CONVERSATIONS — RESERVAS Y CITAS ===
    { q_thai: "คุณจองโต๊ะกี่ที่", q_phonetic: "khun jong tó kìi thîi", q_es: "kun chong tó kì tî", q_tone: "m-m-h-l-f", q_spanish: "How many seats did you book?", q_en: "For how many people did you book?", a_thai: "ผมจองสองที่ครับ", a_phonetic: "phǒm jong sǎawng thîi khráp", a_es: "pǒm chong sǒng tî kráp", a_tone: "r-m-r-f-h", a_spanish: "I booked a table for two", a_en: "I booked for two", category: "verbos", lesson: 10 },
    { q_thai: "คุณนัดหมอไหม", q_phonetic: "khun nát mǒe măi", q_es: "kun nát mǒe mǎi", q_tone: "m-l-r-r", q_spanish: "Do you have a doctor's appointment?", q_en: "Do you have a doctor's appointment?", a_thai: "มีครับ บ่ายสามโมง", a_phonetic: "mee khráp, bàai sǎam mong", a_es: "mi kráp, bài sǎm mong", a_tone: "m-h-l-m-m", a_spanish: "Yes, at 3 PM", a_en: "Yes, at 3 PM", category: "verbos", lesson: 10 },
    { q_thai: "เวลานัดกี่โมง", q_phonetic: "way-laa nát kìi mong", q_es: "ue-la nát kì mong", q_tone: "m-m-l-l-m", q_spanish: "What time is the appointment?", q_en: "What time is the appointment?", a_thai: "สองโมงเย็นครับ", a_phonetic: "sǎawng mong yen khráp", a_es: "sǒng mong ien kráp", a_tone: "r-m-m-h", a_spanish: "2 PM", a_en: "2 PM", category: "tiempo", lesson: 10 },
    { q_thai: "คุณจองห้องกี่คืน", q_phonetic: "khun jong hɔ̂ɔng kìi kheun", q_es: "kun chong hóng kì ken", q_tone: "m-m-h-l-m", q_spanish: "How many nights did you book the room?", q_en: "How many nights did you book?", a_thai: "สองคืนครับ", a_phonetic: "sǎawng kheun khráp", a_es: "sǒng ken kráp", a_tone: "r-m-h", a_spanish: "Two nights", a_en: "Two nights", category: "verbos", lesson: 10 },
    { q_thai: "เช็คอินกี่โมง", q_phonetic: "chék-in kìi mong", q_es: "chék-in kì mong", q_tone: "h-m-l-m", q_spanish: "What time is check-in?", q_en: "What time is check-in?", a_thai: "บ่ายสองโมงครับ", a_phonetic: "bàai sǎawng mong khráp", a_es: "bài sǒng mong kráp", a_tone: "l-r-m-h", a_spanish: "2 PM", a_en: "2 PM", category: "verbos", lesson: 10 },
    { q_thai: "เช็คเอาท์กี่โมง", q_phonetic: "chék-ao kìi mong", q_es: "chék-ao kì mong", q_tone: "h-m-l-m", q_spanish: "What time is check-out?", q_en: "What time is check-out?", a_thai: "เที่ยงครับ", a_phonetic: "thîang khráp", a_es: "tîeng kráp", a_tone: "f-h", a_spanish: "12 (mediodía)", a_en: "At noon", category: "verbos", lesson: 10 },

    // Lesson 11 — Prepositions (conversations)
    { q_thai: "ห้องน้ำอยู่ที่ไหน", q_phonetic: "hɔ̂ɔng-náam yùu thîi-nǎi", q_es: "hóng-nám iù tî-nǎi", q_tone: "h-h-m-f-r", q_spanish: "Where is the bathroom?", q_en: "Where is the bathroom?", a_thai: "ข้างในร้าน", a_phonetic: "khâang-nai ráan", a_es: "kâang-nai rán", a_tone: "f-m-h", a_spanish: "Inside the shop", a_en: "Inside the shop", category: "preposiciones", lesson: 11 },
    { q_thai: "ร้านกาแฟอยู่ข้างนอกไหม", q_phonetic: "ráan-gaa-faa yùu khâang-nɔ̀ɔk măi", q_es: "rán-ga-fa iù kâang-nòk mǎi", q_tone: "h-m-m-m-f-l-r", q_spanish: "Is the café outside?", q_en: "Is the café outside?", a_thai: "ใช่ครับ ข้างนอก", a_phonetic: "châi khráp, khâang-nɔ̀ɔk", a_es: "châi kráp, kâang-nòk", a_tone: "f-h-f-l", a_spanish: "Yes, outside", a_en: "Yes, outside", category: "preposiciones", lesson: 11 },
    { q_thai: "คุณนั่งข้างๆ ผมได้ไหม", q_phonetic: "khun náng khâang-khâang phǒm dâi măi", q_es: "kun náng kâang-kâang pǒm dâi mǎi", q_tone: "m-r-f-f-r-f-r", q_spanish: "Can you sit beside me?", q_en: "Can you sit next to me?", a_thai: "ได้ครับ", a_phonetic: "dâi khráp", a_es: "dâi kráp", a_tone: "f-h", a_spanish: "Yes", a_en: "Sure", category: "preposiciones", lesson: 11 },
    { q_thai: "โรงแรมอยู่ตรงข้ามไหม", q_phonetic: "roong-raem yùu trom-khâam măi", q_es: "rong-rem iù trong-kâam mǎi", q_tone: "m-m-m-m-f-r", q_spanish: "Is the hotel opposite?", q_en: "Is the hotel opposite?", a_thai: "ใช่ครับ ตรงข้าม", a_phonetic: "châi khráp, trom-khâam", a_es: "châi kráp, trong-kâam", a_tone: "f-h-m-f", a_spanish: "Yes, opposite", a_en: "Yes, opposite", category: "preposiciones", lesson: 11 },
    { q_thai: "โรงเรียนอยู่ระหว่างอะไร", q_phonetic: "roong-rian yùu rá-wàaang a-rai", q_es: "rong-rian iù rá-uáang a-rai", q_tone: "m-m-m-h-f-l-m", q_spanish: "What is the school between?", q_en: "What is the school between?", a_thai: "ระหว่างร้านกับโรงหนัง", a_phonetic: "rá-wàaang ráan gàp roong-nǎng", a_es: "rá-uáang rán gàp rong-nǎng", a_tone: "h-f-h-l-m-r", a_spanish: "Between the shop and the cinema", a_en: "Between the shop and the cinema", category: "preposiciones", lesson: 11 },
    { q_thai: "ผมกินก่อนนะ", q_phonetic: "phǒm gin kɔ̀ɔn ná", q_es: "pǒm guin kòn ná", q_tone: "r-m-l-m", q_spanish: "I'll eat first, OK?", q_en: "I'll eat first, OK?", a_thai: "ได้เลย", a_phonetic: "dâi ləəi", a_es: "dâi ləei", a_tone: "f-m", a_spanish: "Go ahead", a_en: "Go ahead", category: "preposiciones", lesson: 11 },
    { q_thai: "หนังสืออยู่บนโต๊ะไหม", q_phonetic: "nǎng-sǔeu yùu bon tó măi", q_es: "nǎng-sǔe iù bon tó mǎi", q_tone: "r-r-m-m-h-r", q_spanish: "Is the book on the table?", q_en: "Is the book on the table?", a_thai: "ใช่ครับ บนโต๊ะ", a_phonetic: "châi khráp, bon tó", a_es: "châi kráp, bon tó", a_tone: "f-h-m-h", a_spanish: "Yes, on the table", a_en: "Yes, on the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ใต้โต๊ะไหม", q_phonetic: "mɛɛo yùu dtâi tó măi", q_es: "meo iù dtâi tó mǎi", q_tone: "h-m-f-f-h-r", q_spanish: "Is the cat under the table?", q_en: "Is the cat under the table?", a_thai: "ใช่ครับ ข้างล่าง", a_phonetic: "châi khráp, khâang-lâang", a_es: "châi kráp, kâang-lâang", a_tone: "f-h-f-f", a_spanish: "Yes, underneath", a_en: "Yes, underneath", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่บนโต๊ะไหม", q_phonetic: "mɛɛo yùu bon tó măi", q_es: "meo iù bon tó mǎi", q_tone: "h-m-m-h-r", q_spanish: "Is the cat on the table?", q_en: "Is the cat on the table?", a_thai: "ใช่ครับ บนโต๊ะ", a_phonetic: "châi khráp, bon tó", a_es: "châi kráp, bon tó", a_tone: "f-h-m-h", a_spanish: "Sí, sobre la mesa", a_en: "Yes, on the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ข้างๆ โต๊ะไหม", q_phonetic: "mɛɛo yùu khâang-khâang tó măi", q_es: "meo iù kâang-kâang tó mǎi", q_tone: "h-m-f-f-h-r", q_spanish: "Is the cat beside the table?", q_en: "Is the cat beside the table?", a_thai: "ใช่ครับ ข้างๆ โต๊ะ", a_phonetic: "châi khráp, khâang-khâang tó", a_es: "châi kráp, kâang-kâang tó", a_tone: "f-h-f-f-h", a_spanish: "Sí, al lado de la mesa", a_en: "Yes, beside the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ข้างหน้าโต๊ะไหม", q_phonetic: "mɛɛo yùu khâang-nâa tó măi", q_es: "meo iù kâang-ná tó mǎi", q_tone: "h-m-f-f-h-r", q_spanish: "Is the cat in front of the table?", q_en: "Is the cat in front of the table?", a_thai: "ใช่ครับ ข้างหน้าโต๊ะ", a_phonetic: "châi khráp, khâang-nâa tó", a_es: "châi kráp, kâang-ná tó", a_tone: "f-h-f-f-h", a_spanish: "Sí, delante de la mesa", a_en: "Yes, in front of the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ข้างหลังโต๊ะไหม", q_phonetic: "mɛɛo yùu khâang-lǎng tó măi", q_es: "meo iù kâang-lǎng tó mǎi", q_tone: "h-m-f-l-h-r", q_spanish: "Is the cat behind the table?", q_en: "Is the cat behind the table?", a_thai: "ใช่ครับ ข้างหลังโต๊ะ", a_phonetic: "châi khráp, khâang-lǎng tó", a_es: "châi kráp, kâang-lǎng tó", a_tone: "f-h-f-l-h", a_spanish: "Sí, detrás de la mesa", a_en: "Yes, behind the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ข้างบนโต๊ะไหม", q_phonetic: "mɛɛo yùu khâang-bon tó măi", q_es: "meo iù kâang-bon tó mǎi", q_tone: "h-m-f-m-h-r", q_spanish: "Is the cat on top of the table?", q_en: "Is the cat on top of the table?", a_thai: "ใช่ครับ ข้างบนโต๊ะ", a_phonetic: "châi khráp, khâang-bon tó", a_es: "châi kráp, kâang-bon tó", a_tone: "f-h-f-m-h", a_spanish: "Sí, encima de la mesa", a_en: "Yes, on top of the table", category: "preposiciones", lesson: 11 },
    { q_thai: "แมวอยู่ข้างล่างโต๊ะไหม", q_phonetic: "mɛɛo yùu khâang-lâang tó măi", q_es: "meo iù kâang-lâang tó mǎi", q_tone: "h-m-f-f-h-r", q_spanish: "Is the cat below the table?", q_en: "Is the cat below the table?", a_thai: "ใช่ครับ ข้างล่างโต๊ะ", a_phonetic: "châi khráp, khâang-lâang tó", a_es: "châi kráp, kâang-lâang tó", a_tone: "f-h-f-f-h", a_spanish: "Sí, debajo de la mesa", a_en: "Yes, below the table", category: "preposiciones", lesson: 11 },
    { q_thai: "ปิดไฟไหม", q_phonetic: "pìt fai măi", q_es: "bpìt fai mǎi", q_tone: "l-m-r", q_spanish: "Turn off the light?", q_en: "Turn off the light?", a_thai: "ปิดเลย", a_phonetic: "pìt ləəi", a_es: "bpìt ləei", a_tone: "l-m", a_spanish: "Turn it off", a_en: "Turn it off", category: "preposiciones", lesson: 11 },
    { q_thai: "เปิดแอร์ได้ไหม", q_phonetic: "pòet ɛɛ dâi măi", q_es: "bpöet êe dâi mǎi", q_tone: "l-m-f-r", q_spanish: "Can you turn on the AC?", q_en: "Can you turn on the AC?", a_thai: "ได้ครับ เปิดให้", a_phonetic: "dâi khráp, pòet hâi", a_es: "dâi kráp, bpöet jâi", a_tone: "f-h-l-f", a_spanish: "Sure, I'll turn it on", a_en: "Sure, turning it on", category: "preposiciones", lesson: 11 },
    { q_thai: "คุณเดินผ่านตลาดไหม", q_phonetic: "khun dəən phâan tà-làat măi", q_es: "kun dəən pâan dtà-làat mǎi", q_tone: "m-m-f-l-h-r", q_spanish: "Do you walk past the market?", q_en: "Do you walk past the market?", a_thai: "ผ่านครับ ทุกวัน", a_phonetic: "phâan khráp, thúk-wan", a_es: "pâan kráp, túk-uan", a_tone: "f-h-h-m", a_spanish: "Yes, every day", a_en: "Yes, every day", category: "preposiciones", lesson: 11 },
    { q_thai: "ของชิ้นนี้เพื่อใคร", q_phonetic: "khǒŋ chîn níi phûea khrai", q_es: "kǒng chín ní púa krai", q_tone: "h-l-m-h-f-m", q_spanish: "Who is this thing for?", q_en: "Who is this for?", a_thai: "เพื่อคุณครับ", a_phonetic: "phûea khun khráp", a_es: "púa kun kráp", a_tone: "f-m-h", a_spanish: "For you", a_en: "For you", category: "preposiciones", lesson: 11 },
    { q_thai: "คุณทำเพื่อใคร", q_phonetic: "khun tam phûea khrai", q_es: "kun tam púa krai", q_tone: "m-m-f-m", q_spanish: "¿Por quién lo haces? (propósito)", q_en: "Who do you do it for? (purpose)", a_thai: "ผมทำเพื่อคุณครับ", a_phonetic: "phǒm tam phûea khun khráp", a_es: "pǒm tam púa kun kráp", a_tone: "r-m-f-m-h", a_spanish: "Lo hago por ti (con propósito)", a_en: "I do it for you (with purpose)", category: "preposiciones", lesson: 11 },
    { q_thai: "ของชิ้นนี้สำหรับใคร", q_phonetic: "khǎawng chîn níi sǎm-ràp khrai", q_es: "kǎwng chín ní sǎm-ràp krai", q_tone: "h-l-m-h-h-m", q_spanish: "¿Para quién es esto? (destinado)", q_en: "Who is this intended for?", a_thai: "สำหรับคุณครับ", a_phonetic: "sǎm-ràp khun khráp", a_es: "sǎm-ràp kun kráp", a_tone: "h-h-m-h", a_spanish: "Es para ti (destinado)", a_en: "It's intended for you", category: "preposiciones", lesson: 11 },
    { q_thai: "ทั้งสองคนไปด้วยกันไหม", q_phonetic: "thâang-sǎawng khon bpai dûuai-kan măi", q_es: "tâang-sǒng kon bpai dûai-kan mǎi", q_tone: "f-r-m-m-h-h-r", q_spanish: "Do both of you go together?", q_en: "Do both of you go together?", a_thai: "ไปครับ ด้วยกัน", a_phonetic: "bpai khráp, dûuai-kan", a_es: "bpai kráp, dûai-kan", a_tone: "m-h-h-h", a_spanish: "Yes, together", a_en: "Yes, together", category: "preposiciones", lesson: 11 },
    { q_thai: "กาแฟหรือชา", q_phonetic: "gaa-faa rǔe chaa", q_es: "ga-fa rǔe cha", q_tone: "m-m-r-m", q_spanish: "Coffee or tea?", q_en: "Coffee or tea?", a_thai: "ชาครับ", a_phonetic: "chaa khráp", a_es: "cha kráp", a_tone: "m-h", a_spanish: "Tea, please", a_en: "Tea, please", category: "preposiciones", lesson: 11 },
    { q_thai: "เจอคุณที่ไหน", q_phonetic: "jəə khun thîi-nǎi", q_es: "jo kun tî-nǎi", q_tone: "m-m-f-r", q_spanish: "Where do I meet you?", q_en: "Where do I meet you?", a_thai: "เจอในร้านกาแฟ", a_phonetic: "jəə nai ráan-gaa-faa", a_es: "jo nai rán-ga-fa", a_tone: "m-m-h-m-m", a_spanish: "Meet inside the café", a_en: "Inside the café", category: "preposiciones", lesson: 11 },

    // Lesson 12 — Directions & face parts (conversations)
    { q_thai: "ไปโรงแรมต้องเลี้ยวทางไหน", q_phonetic: "bpai roong-raem dtông lîao thaang-nǎi", q_es: "bpai rong-rem dtóng lîao tang-nǎi", q_tone: "m-m-m-m-f-m-r", q_spanish: "Which way do I turn to go to the hotel?", q_en: "Which way to the hotel?", a_thai: "เลี้ยวขวาครับ", a_phonetic: "lîao khwǎa khráp", a_es: "lîao kuǎa kráp", a_tone: "f-r-h", a_spanish: "Turn right", a_en: "Turn right", category: "direcciones", lesson: 12 },
    { q_thai: "ธนาคารอยู่ทางซ้ายไหม", q_phonetic: "thá-náa-khaan yùu thaang sáai măi", q_es: "tá-ná-kan iù tang sáai mǎi", q_tone: "h-h-h-m-m-h-r", q_spanish: "Is the bank on the left?", q_en: "Is the bank on the left?", a_thai: "ใช่ครับ ทางซ้าย", a_phonetic: "châi khráp, thaang sáai", a_es: "châi kráp, tang sáai", a_tone: "f-h-m-h", a_spanish: "Yes, on the left", a_en: "Yes, on the left", category: "direcciones", lesson: 12 },
    { q_thai: "ตรงไปหรือเลี้ยวซ้าย", q_phonetic: "trom bpai rǔe lîao sáai", q_es: "trom bpai rǔe lîao sáai", q_tone: "m-m-r-f-h", q_spanish: "Straight or turn left?", q_en: "Straight or turn left?", a_thai: "ตรงไปครับ", a_phonetic: "trom bpai khráp", a_es: "trom bpai kráp", a_tone: "m-m-h", a_spanish: "Straight ahead", a_en: "Straight ahead", category: "direcciones", lesson: 12 },
    { q_thai: "ห้องน้ำอยู่ทางขวาไหม", q_phonetic: "hɔ̂ɔng-náam yùu thaang khwǎa măi", q_es: "hóng-nám iù tang kuǎa mǎi", q_tone: "h-h-m-m-r-r", q_spanish: "Is the bathroom on the right?", q_en: "Is the bathroom on the right?", a_thai: "ไม่ครับ ทางซ้าย", a_phonetic: "mâi khráp, thaang sáai", a_es: "mâi kráp, tang sáai", a_tone: "f-h-m-h", a_spanish: "No, on the left", a_en: "No, on the left", category: "direcciones", lesson: 12 },
    { q_thai: "คุณบอกอะไร", q_phonetic: "khun bɔ̀ɔk a-rai", q_es: "kun bòk à-rai", q_tone: "m-l-l-m", q_spanish: "What did you say?", q_en: "What did you say?", a_thai: "บอกว่าให้ไปก่อน", a_phonetic: "bɔ̀ɔk wâa hâi bpai kɔ̀ɔn", a_es: "bòk uâ jâi bpai kòn", a_tone: "l-f-f-m-l", a_spanish: "I said to go first", a_en: "I said go first", category: "verbos", lesson: 12 },
    { q_thai: "บอกผมที", q_phonetic: "bɔ̀ɔk phǒm thii", q_es: "bòk pǒm tî", q_tone: "l-r-f", q_spanish: "Tell me", q_en: "Tell me", a_thai: "ได้ครับ บอก", a_phonetic: "dâi khráp, bɔ̀ɔk", a_es: "dâi kráp, bòk", a_tone: "f-h-l", a_spanish: "OK, I'll tell", a_en: "Sure, I'll tell", category: "verbos", lesson: 12 },
    { q_thai: "ไว้เจอกันพรุ่งนี้", q_phonetic: "wái jəə gan phrûng-nîi", q_es: "wái jo gan prung-ní", q_tone: "f-m-m-r-h", q_spanish: "See you tomorrow", q_en: "See you tomorrow", a_thai: "ไว้เจอกันครับ", a_phonetic: "wái jəə gan khráp", a_es: "wái jo gan kráp", a_tone: "f-m-m-h", a_spanish: "See you", a_en: "See you", category: "verbos", lesson: 12 },
    { q_thai: "คุณปวดหัวไหม", q_phonetic: "khun bpùat hǔa măi", q_es: "kun bpùat hǔa mǎi", q_tone: "m-l-r-r", q_spanish: "Do you have a headache?", q_en: "Do you have a headache?", a_thai: "ปวดครับ", a_phonetic: "bpùat khráp", a_es: "bpùat kráp", a_tone: "l-h", a_spanish: "Yes, it hurts", a_en: "Yes, it hurts", category: "cuerpo", lesson: 12 },
    { q_thai: "ล้างหน้าก่อนนอนไหม", q_phonetic: "láang nâa kɔ̀ɔn nɔɔn măi", q_es: "láang ná kòn non mǎi", q_tone: "h-f-l-m-r", q_spanish: "Do you wash your face before sleeping?", q_en: "Do you wash your face before bed?", a_thai: "ล้างครับ", a_phonetic: "láang khráp", a_es: "láang kráp", a_tone: "h-h", a_spanish: "Yes, I wash it", a_en: "Yes, I do", category: "cuerpo", lesson: 12 },
    { q_thai: "ตาคุณสีอะไร", q_phonetic: "taa khun sǐi a-rai", q_es: "ta kun sǐ à-rai", q_tone: "m-m-l-m", q_spanish: "What color are your eyes?", q_en: "What color are your eyes?", a_thai: "สีดำครับ", a_phonetic: "sǐi-dam khráp", a_es: "sǐ-dam kráp", a_tone: "l-m-h", a_spanish: "Black", a_en: "Black", category: "cuerpo", lesson: 12 },
    { q_thai: "ฟันคุณขาวไหม", q_phonetic: "fan khun khǎao măi", q_es: "fan kun kǎo mǎi", q_tone: "m-m-r-r", q_spanish: "Are your teeth white?", q_en: "Are your teeth white?", a_thai: "ขาวครับ", a_phonetic: "khǎao khráp", a_es: "kǎo kráp", a_tone: "r-h", a_spanish: "Yes, white", a_en: "Yes, white", category: "cuerpo", lesson: 12 },
    { q_thai: "จมูกคุณใหญ่ไหม", q_phonetic: "jà-mùuk khun yài măi", q_es: "jà-mùuk kun yài mǎi", q_tone: "l-h-m-l-r", q_spanish: "Is your nose big?", q_en: "Is your nose big?", a_thai: "ไม่ใหญ่ครับ", a_phonetic: "mâi yài khráp", a_es: "mâi yài kráp", a_tone: "f-l-h", a_spanish: "Not big", a_en: "Not big", category: "cuerpo", lesson: 12 },
    { q_thai: "หูคุณดีไหม", q_phonetic: "hǔu khun dee măi", q_es: "hǔu kun di mǎi", q_tone: "r-m-m-r", q_spanish: "Is your hearing good? (lit. ears good)", q_en: "Is your hearing good?", a_thai: "ดีครับ", a_phonetic: "dee khráp", a_es: "di kráp", a_tone: "m-h", a_spanish: "Yes, good", a_en: "Yes, good", category: "cuerpo", lesson: 12 },

    // --- Lesson 13: Human Body & Health — Q&A ---
    { q_thai: "คอคุณเจ็บไหม", q_phonetic: "kɔɔ khun jèp măi", q_es: "kor kun jèp mǎi", q_tone: "m-m-l-r", q_spanish: "Does your neck hurt?", q_en: "Does your neck hurt?", a_thai: "เจ็บครับ", a_phonetic: "jèp khráp", a_es: "jèp kráp", a_tone: "l-h", a_spanish: "Yes, it hurts", a_en: "Yes, it hurts", category: "cuerpo", lesson: 13 },
    { q_thai: "ไหล่คุณเจ็บไหม", q_phonetic: "lài khun jèp măi", q_es: "lài kun jèp mǎi", q_tone: "l-m-l-r", q_spanish: "Does your shoulder hurt?", q_en: "Does your shoulder hurt?", a_thai: "ไม่เจ็บครับ", a_phonetic: "mâi jèp khráp", a_es: "mâi jèp kráp", a_tone: "f-l-h", a_spanish: "It doesn't hurt", a_en: "It doesn't hurt", category: "cuerpo", lesson: 13 },
    { q_thai: "แขนคุณปวดไหม", q_phonetic: "khǎen khun pùuat măi", q_es: "kǎen kun pùuat mǎi", q_tone: "r-m-l-r", q_spanish: "Does your arm ache?", q_en: "Does your arm ache?", a_thai: "ปวดครับ", a_phonetic: "pùuat khráp", a_es: "pùuat kráp", a_tone: "l-h", a_spanish: "Yes, it aches", a_en: "Yes, it aches", category: "cuerpo", lesson: 13 },
    { q_thai: "ท้องคุณปวดไหม", q_phonetic: "tong khun pùuat măi", q_es: "tong kun pùuat mǎi", q_tone: "m-m-l-r", q_spanish: "Does your stomach ache?", q_en: "Does your stomach ache?", a_thai: "ปวดท้องครับ", a_phonetic: "pùuat tong khráp", a_es: "pùuat tong kráp", a_tone: "l-m-h", a_spanish: "Yes, stomachache", a_en: "Yes, stomachache", category: "cuerpo", lesson: 13 },
    { q_thai: "ขาคุณปวดไหม", q_phonetic: "khǎa khun pùuat măi", q_es: "kǎa kun pùuat mǎi", q_tone: "r-m-l-r", q_spanish: "Does your leg ache?", q_en: "Does your leg ache?", a_thai: "ปวดครับ", a_phonetic: "pùuat khráp", a_es: "pùuat kráp", a_tone: "l-h", a_spanish: "Yes, it aches", a_en: "Yes, it aches", category: "cuerpo", lesson: 13 },
    { q_thai: "เท้าคุณปวดไหม", q_phonetic: "tháo khun pùuat măi", q_es: "táo kun pùuat mǎi", q_tone: "h-m-l-r", q_spanish: "Do your feet ache?", q_en: "Do your feet ache?", a_thai: "ปวดเท้าครับ", a_phonetic: "pùuat tháo khráp", a_es: "pùuat táo kráp", a_tone: "l-h-h", a_spanish: "Yes, my feet ache", a_en: "Yes, my feet ache", category: "cuerpo", lesson: 13 },
    { q_thai: "มือคุณเจ็บไหม", q_phonetic: "muu khun jèp măi", q_es: "muu kun jèp mǎi", q_tone: "m-m-l-r", q_spanish: "Does your hand hurt?", q_en: "Does your hand hurt?", a_thai: "เจ็บมือครับ", a_phonetic: "jèp muu khráp", a_es: "jèp muu kráp", a_tone: "l-m-h", a_spanish: "Yes, hand hurts", a_en: "Yes, hand hurts", category: "cuerpo", lesson: 13 },
    { q_thai: "เขาท้องไหม", q_phonetic: "khǎo tong măi", q_es: "kǎo tong mǎi", q_tone: "r-m-r", q_spanish: "Is she pregnant?", q_en: "Is she pregnant?", a_thai: "ท้องครับ", a_phonetic: "tong khráp", a_es: "tong kráp", a_tone: "m-h", a_spanish: "Yes, pregnant", a_en: "Yes, pregnant", category: "cuerpo", lesson: 13 },
    { q_thai: "คุณออกกำลังกายไหม", q_phonetic: "khun ɔ̀ɔk gam-lang-gaai măi", q_es: "kun òk gam-lang-gaai mǎi", q_tone: "m-l-m-m-m-r", q_spanish: "Do you exercise?", q_en: "Do you exercise?", a_thai: "เล่นกีฬาครับ", a_phonetic: "lên kii-laa khráp", a_es: "lên kii-laa kráp", a_tone: "l-m-m-h", a_spanish: "Yes, I play sports", a_en: "Yes, I play sports", category: "cuerpo", lesson: 13 },
    { q_thai: "ช่วยผมหน่อยได้ไหม", q_phonetic: "chûai phǒm nòi dâi măi", q_es: "chuái pǒm nòi dâi mǎi", q_tone: "h-r-l-f-r", q_spanish: "Can you help me please?", q_en: "Can you help me please?", a_thai: "ได้ครับ", a_phonetic: "dâi khráp", a_es: "dâi kráp", a_tone: "f-h", a_spanish: "Yes (I can)", a_en: "Yes (I can)", category: "saludos", lesson: 13 },

    // === Coverage gap fills — Q&A ===
    // Lesson 2 — shops, hospital, cinema
    { q_thai: "ร้านชาอยู่ที่ไหน", q_phonetic: "ráan-chaa yùu thîi-nǎi", q_es: "rán-cha iù tî-nǎi", q_tone: "h-m-m-f-f-r", q_spanish: "Where is the tea house?", q_en: "Where is the tea house?", a_thai: "ร้านชาอยู่ที่นี่", a_phonetic: "ráan-chaa yùu thîi-nîi", a_es: "rán-cha iù tî-nî", a_tone: "h-m-m-f-f-f", a_spanish: "The tea house is here", a_en: "The tea house is here", category: "tiendas", lesson: 2 },
    { q_thai: "ร้านขายยาอยู่ที่ไหน", q_phonetic: "ráan-kǎai-yaa yùu thîi-nǎi", q_es: "rán-kǎi-ya iù tî-nǎi", q_tone: "h-l-f-m-m-f-f-r", q_spanish: "Where is the pharmacy?", q_en: "Where is the pharmacy?", a_thai: "ร้านขายยาอยู่ที่นี่", a_phonetic: "ráan-kǎai-yaa yùu thîi-nîi", a_es: "rán-kǎi-ya iù tî-nî", a_tone: "h-l-f-m-m-f-f-f", a_spanish: "The pharmacy is here", a_en: "The pharmacy is here", category: "tiendas", lesson: 2 },
    { q_thai: "ร้านสะดวกซื้ออยู่ที่ไหน", q_phonetic: "ráan sà-dùuak-súeu yùu thîi-nǎi", q_es: "rán sà-duak-sú iù tî-nǎi", q_tone: "h-l-f-l-h-m-f-f-r", q_spanish: "Where is the convenience store?", q_en: "Where is the convenience store?", a_thai: "ร้านสะดวกซื้ออยู่ที่นี่", a_phonetic: "ráan sà-dùuak-súeu yùu thîi-nîi", a_es: "rán sà-duak-sú iù tî-nî", a_tone: "h-l-f-l-h-m-f-f-f", a_spanish: "The convenience store is here", a_en: "The convenience store is here", category: "tiendas", lesson: 2 },
    { q_thai: "ร้านหนังสืออยู่ที่ไหน", q_phonetic: "ráan nǎng-sǔeu yùu thîi-nǎi", q_es: "rán náng-sú iù tî-nǎi", q_tone: "h-l-r-m-f-f-r", q_spanish: "Where is the bookstore?", q_en: "Where is the bookstore?", a_thai: "ร้านหนังสืออยู่ที่นี่", a_phonetic: "ráan nǎng-sǔeu yùu thîi-nîi", a_es: "rán náng-sú iù tî-nî", a_tone: "h-l-r-m-f-f-f", a_spanish: "The bookstore is here", a_en: "The bookstore is here", category: "tiendas", lesson: 2 },
    { q_thai: "โรงพยาบาลอยู่ที่ไหน", q_phonetic: "roong-phaa-baan yùu thîi-nǎi", q_es: "rong-pa-ya-ban iù tî-nǎi", q_tone: "m-m-m-m-f-f-r", q_spanish: "Where is the hospital?", q_en: "Where is the hospital?", a_thai: "โรงพยาบาลอยู่ที่นี่", a_phonetic: "roong-phaa-baan yùu thîi-nîi", a_es: "rong-pa-ya-ban iù tî-nî", a_tone: "m-m-m-m-f-f-f", a_spanish: "The hospital is here", a_en: "The hospital is here", category: "tiendas", lesson: 2 },
    { q_thai: "โรงหนังอยู่ที่ไหน", q_phonetic: "roong-nǎng yùu thîi-nǎi", q_es: "rong-nǎng iù tî-nǎi", q_tone: "m-r-f-f-r", q_spanish: "Where is the cinema?", q_en: "Where is the cinema?", a_thai: "โรงหนังอยู่ที่นี่", a_phonetic: "roong-nǎng yùu thîi-nîi", a_es: "rong-nǎng iù tî-nî", a_tone: "m-r-f-f-f", a_spanish: "The cinema is here", a_en: "The cinema is here", category: "tiendas", lesson: 2 },
    // Lesson 3 — missing
    { q_thai: "คุณได้รับอะไร", q_phonetic: "khun dâai-ráp a-rai", q_es: "kun dâi-ráp à-rai", q_tone: "m-f-f-l-m", q_spanish: "What did you receive?", q_en: "What did you receive?", a_thai: "ผมได้รับจดหมาย", a_phonetic: "phǒm dâai-ráp jòt-mǎai", a_es: "pǒm dâi-ráp yòt-mǎai", a_tone: "r-f-f-l-r", a_spanish: "I received a letter", a_en: "I received a letter", category: "verbos", lesson: 3 },
    { q_thai: "เข่าเจ็บไหม", q_phonetic: "kào jèp măi", q_es: "kào chèp mǎi", q_tone: "l-l-r", q_spanish: "Does your knee hurt?", q_en: "Does your knee hurt?", a_thai: "เข่าเจ็บครับ", a_phonetic: "kào jèp khráp", a_es: "kào chèp kráp", a_tone: "l-l-h", a_spanish: "Yes, my knee hurts", a_en: "Yes, my knee hurts", category: "cuerpo", lesson: 3 },
    { q_thai: "คุณขี่ม้าไหม", q_phonetic: "khun khìi mǎa măi", q_es: "kun kì mǎ mǎi", q_tone: "m-h-h-r", q_spanish: "Do you ride horses?", q_en: "Do you ride horses?", a_thai: "ไม่ขี่ครับ", a_phonetic: "mâi khìi khráp", a_es: "mâi kì kráp", a_tone: "f-h-h", a_spanish: "No, I don't", a_en: "No, I don't", category: "verbos", lesson: 3 },
    { q_thai: "บ้านไกลไหม", q_phonetic: "bâan klai măi", q_es: "bân glai mǎi", q_tone: "f-m-r", q_spanish: "Is the house far?", q_en: "Is the house far?", a_thai: "ไม่ไกลครับ ใกล้", a_phonetic: "mâi klai khráp, glâi", a_es: "mâi glai kráp, glâi", a_tone: "f-m-h, f", a_spanish: "Not far, near", a_en: "Not far, near", category: "direcciones", lesson: 3 },
    { q_thai: "หมู่บ้านอยู่ไหน", q_phonetic: "mùu bâan yùu nǎi", q_es: "mù bân iù nǎi", q_tone: "h-f-l-r", q_spanish: "Where is the village?", q_en: "Where is the village?", a_thai: "หมู่บ้านอยู่นี่", a_phonetic: "mùu bâan yùu nîi", a_es: "mù bân iù nî", a_tone: "h-f-l-h", a_spanish: "The village is here", a_en: "The village is here", category: "sustantivos", lesson: 3 },
    { q_thai: "อากาศหนาวไหม", q_phonetic: "aa-kàat nǎao măi", q_es: "a-kàt nǎao mǎi", q_tone: "m-l-r-r", q_spanish: "Is the weather cold?", q_en: "Is the weather cold?", a_thai: "หนาวครับ", a_phonetic: "nǎao khráp", a_es: "nǎao kráp", a_tone: "r-h", a_spanish: "Yes, it's cold", a_en: "Yes, it's cold", category: "sabores", lesson: 3 },
    // Lesson 4 — missing
    { q_thai: "มันคืออะไร", q_phonetic: "man kheu a-rai", q_es: "man keu a-rai", q_tone: "m-m-l-m", q_spanish: "What is it?", q_en: "What is it?", a_thai: "มันหมา", a_phonetic: "man mǎa", a_es: "man mǎ", a_tone: "m-h", a_spanish: "It's a dog", a_en: "It's a dog", category: "pronombres", lesson: 4 },
    { q_thai: "คุณมาจากประเทศอะไร", q_phonetic: "khun maa jàak prà-thêet a-rai", q_es: "kun ma chàk bprà-tét a-rai", q_tone: "m-m-l-l-h-l-m", q_spanish: "What country are you from?", q_en: "What country are you from?", a_thai: "ผมมาจากสเปน", a_phonetic: "phǒm maa jàak sà-pēen", a_es: "pǒm ma chàk sà-pen", a_tone: "r-m-l-l", a_spanish: "I'm from Spain", a_en: "I'm from Spain", category: "sustantivos", lesson: 4 },
    // Lesson 5 — missing
    { q_thai: "ห้างอยู่ที่ไหน", q_phonetic: "hâng yùu thîi-nǎi", q_es: "jâng iù tî-nǎi", q_tone: "f-m-f-f-r", q_spanish: "Where is the mall?", q_en: "Where is the mall?", a_thai: "ห้างอยู่ใกล้บ้าน", a_phonetic: "hâng yùu glâi bâan", a_es: "jâng iù glâi bân", a_tone: "f-m-f-f", a_spanish: "The mall is near home", a_en: "The mall is near home", category: "tiendas", lesson: 5 },
    // Lesson 6 — missing numbers/currency
    { q_thai: "ราคาเท่าไหร่", q_phonetic: "raa-khaa thâo-rài", q_es: "ra-ká tao-rài", q_tone: "m-h-f-f", q_spanish: "How much is the price?", q_en: "How much is the price?", a_thai: "สามสิบบาท", a_phonetic: "sǎam-sìp bàat", a_es: "sǎm-sìp bàt", a_tone: "r-l-l", a_spanish: "Thirty baht", a_en: "Thirty baht", category: "números", lesson: 6 },
    { q_thai: "เป็นยูโรไหม", q_phonetic: "pen yoo-roo măi", q_es: "ben yu-ro mǎi", q_tone: "m-m-m-r", q_spanish: "Is it in euros?", q_en: "Is it in euros?", a_thai: "ไม่ใช่ บาท", a_phonetic: "mâi châi, bàat", a_es: "mâi châi, bàt", a_tone: "f-f, l", a_spanish: "No, baht", a_en: "No, baht", category: "números", lesson: 6 },
    { q_thai: "อย่างไรดี", q_phonetic: "yàang-rai dii", q_es: "yàng-rai di", q_tone: "l-m-m", q_spanish: "What should we do?", q_en: "What should we do?", a_thai: "ไม่รู้", a_phonetic: "mâi rúu", a_es: "mâi rú", a_tone: "f-m", a_spanish: "I don't know", a_en: "I don't know", category: "preguntas", lesson: 6 },
    { q_thai: "เสื้อสายไหมไหม", q_phonetic: "sǔea sǎai-mǎi măi", q_es: "sǔea sǎai-mǎi mǎi", q_tone: "f-r-r-r", q_spanish: "Is the shirt silk?", q_en: "Is the shirt silk?", a_thai: "ใช่ครับ สายไหม", a_phonetic: "châi khráp, sǎai-mǎi", a_es: "châi kráp, sǎai-mǎi", a_tone: "f-h, r-r", a_spanish: "Yes, silk", a_en: "Yes, silk", category: "sustantivos", lesson: 6 },
    { q_thai: "หมายเลขเท่าไหร่", q_phonetic: "mǎai-lǎek thâo-rài", q_es: "mǎi-lěk tao-rài", q_tone: "l-l-f-f", q_spanish: "What's the number?", q_en: "What's the number?", a_thai: "แปดสิบสี่", a_phonetic: "bpàaet-sìp-sìi", a_es: "bpèt-sìp-sì", a_tone: "l-l-l", a_spanish: "Eighty-four", a_en: "Eighty-four", category: "números", lesson: 6 },
    // Lesson 7 — missing
    { q_thai: "คุณดื่มแก้วอะไร", q_phonetic: "khun dùuem kâeo a-rai", q_es: "kun dëm kéo a-rai", q_tone: "m-f-f-l-m", q_spanish: "What glass do you drink?", q_en: "What glass do you drink?", a_thai: "แก้วน้ำ", a_phonetic: "kâeo nám", a_es: "kéo nám", a_tone: "f-f", a_spanish: "A glass of water", a_en: "A glass of water", category: "sustantivos", lesson: 7 },
    { q_thai: "คุณดูการ์ตูนไหม", q_phonetic: "khun duu kaa-tuun măi", q_es: "kun du ka-tun mǎi", q_tone: "m-m-m-r", q_spanish: "Do you watch cartoons?", q_en: "Do you watch cartoons?", a_thai: "ดูครับ", a_phonetic: "duu khráp", a_es: "du kráp", a_tone: "m-h", a_spanish: "Yes, I watch", a_en: "Yes, I watch", category: "sustantivos", lesson: 7 },
    { q_thai: "คุณพูดอังกฤษได้ไหม", q_phonetic: "khun phûut ang-grìt dâai măi", q_es: "kun pût ang-grìt dâi mǎi", q_tone: "m-f-m-l-f-r", q_spanish: "Can you speak English?", q_en: "Can you speak English?", a_thai: "ได้นิดหน่อย", a_phonetic: "dâai nìt-nòi", a_es: "dâi nìt-nòi", a_tone: "f-l-l", a_spanish: "A little", a_en: "A little", category: "preguntas", lesson: 7 },
    // Lesson 8 — missing time/days
    { q_thai: "คุณอยู่ที่นั่นไหม", q_phonetic: "khun yùu thîi-nân măi", q_es: "kun iù tî-nân mǎi", q_tone: "m-l-f-f-r", q_spanish: "Are you there?", q_en: "Are you there?", a_thai: "ใช่ครับ ที่นั่น", a_phonetic: "châi khráp, thîi-nân", a_es: "châi kráp, tî-nân", a_tone: "f-h, f-f", a_spanish: "Yes, there", a_en: "Yes, there", category: "preposiciones", lesson: 8 },
    { q_thai: "อันนี้อันไหน", q_phonetic: "an nîi an nǎi", q_es: "an ní an nǎi", q_tone: "m-h-m-r", q_spanish: "This one, which one?", q_en: "This one, which one?", a_thai: "อันนี้ครับ", a_phonetic: "an nîi khráp", a_es: "an ní kráp", a_tone: "m-h-h", a_spanish: "This one", a_en: "This one", category: "preguntas", lesson: 8 },
    { q_thai: "อันนั้นคืออะไร", q_phonetic: "an nán kheu a-rai", q_es: "an nán keu a-rai", q_tone: "m-f-m-l-m", q_spanish: "What is that one?", q_en: "What is that one?", a_thai: "ไม่รู้ครับ", a_phonetic: "mâi rúu khráp", a_es: "mâi rú kráp", a_tone: "f-m-h", a_spanish: "I don't know", a_en: "I don't know", category: "preguntas", lesson: 8 },
    { q_thai: "ตอนกลางวันคุณกินอะไร", q_phonetic: "dton klang-wan khun gin a-rai", q_es: "dton klang-wan kun gin a-rai", q_tone: "m-m-m-m-m-l-m", q_spanish: "What do you eat at noon?", q_en: "What do you eat at noon?", a_thai: "ผมกินข้าว", a_phonetic: "phǒm gin khâaw", a_es: "pǒm guin kâo", a_tone: "r-m-f", a_spanish: "I eat rice", a_en: "I eat rice", category: "tiempo", lesson: 8 },
    { q_thai: "วันจันทร์คุณทำงานไหม", q_phonetic: "wan-jan khun tam-ngaan măi", q_es: "wan-jan kun tam-ngan mǎi", q_tone: "m-m-m-m-m-r", q_spanish: "Do you work on Monday?", q_en: "Do you work on Monday?", a_thai: "ทำงานครับ", a_phonetic: "tam-ngaan khráp", a_es: "tam-ngan kráp", a_tone: "m-m-h", a_spanish: "Yes, I work", a_en: "Yes, I work", category: "tiempo", lesson: 8 },
    { q_thai: "วันอาทิตย์สุขไหม", q_phonetic: "wan-aa-thít sùk măi", q_es: "wan-a-tít sùk mǎi", q_tone: "m-m-h-l-r", q_spanish: "Are you happy on Sunday?", q_en: "Are you happy on Sunday?", a_thai: "สุขครับ", a_phonetic: "sùk khráp", a_es: "sùk kráp", a_tone: "l-h", a_spanish: "Yes, happy", a_en: "Yes, happy", category: "saludos", lesson: 8 },
    // Lesson 9 — missing
    { q_thai: "รอกี่นาที", q_phonetic: "rɔɔ kìi naa-thii", q_es: "ro kì na-tí", q_tone: "m-l-m-m", q_spanish: "How many minutes to wait?", q_en: "How many minutes to wait?", a_thai: "สิบห้านาที", a_phonetic: "sìp-hâa naa-thii", a_es: "sìp-jâ na-tí", a_tone: "l-f-m-m", a_spanish: "Fifteen minutes", a_en: "Fifteen minutes", category: "tiempo", lesson: 9 },
    // Lesson 10 — missing colors/grooming
    { q_thai: "สีเหลืองสวยไหม", q_phonetic: "sǐi lǔeax sǔai măi", q_es: "sì lǔea sǔai mǎi", q_tone: "l-r-f-r", q_spanish: "Is yellow beautiful?", q_en: "Is yellow beautiful?", a_thai: "สวยครับ", a_phonetic: "sǔai khráp", a_es: "sǔai kráp", a_tone: "f-h", a_spanish: "Yes, beautiful", a_en: "Yes, beautiful", category: "colores", lesson: 10 },
    { q_thai: "คุณชอบสีขาวไหม", q_phonetic: "khun chôop sǐi khǎao măi", q_es: "kun chóp sì kǎao mǎi", q_tone: "m-h-l-r-r", q_spanish: "Do you like white?", q_en: "Do you like white?", a_thai: "ชอบครับ", a_phonetic: "chôop khráp", a_es: "chóp kráp", a_tone: "h-h", a_spanish: "Yes, I like it", a_en: "Yes, I like it", category: "colores", lesson: 10 },
    { q_thai: "สีส้มหรือสีชมพู", q_phonetic: "sǐi sôm rǔeu sǐi chom-phuu", q_es: "sì sôm rúe sì chom-pū", q_tone: "l-h-l-l-h-m", q_spanish: "Orange or pink?", q_en: "Orange or pink?", a_thai: "สีส้มครับ", a_phonetic: "sǐi sôm khráp", a_es: "sì sôm kráp", a_tone: "l-h-h", a_spanish: "Orange", a_en: "Orange", category: "colores", lesson: 10 },
    { q_thai: "สีน้ำตาลหรือสีเทา", q_phonetic: "sǐi nám-taan rǔeu sǐi thao", q_es: "sì nám-tan rúe sì tao", q_tone: "l-f-m-l-l-m", q_spanish: "Brown or gray?", q_en: "Brown or gray?", a_thai: "สีเทาครับ", a_phonetic: "sǐi thao khráp", a_es: "sì tao kráp", a_tone: "l-m-h", a_spanish: "Gray", a_en: "Gray", category: "colores", lesson: 10 },
    { q_thai: "คุณแปรงฟันไหม", q_phonetic: "khun bprēeng fan măi", q_es: "kun bprēng fan mǎi", q_tone: "m-m-m-r", q_spanish: "Do you brush your teeth?", q_en: "Do you brush your teeth?", a_thai: "แปรงฟันครับ", a_phonetic: "bprēeng fan khráp", a_es: "bprēng fan kráp", a_tone: "m-m-h", a_spanish: "Yes, I brush", a_en: "Yes, I brush", category: "cuerpo", lesson: 10 },
    { q_thai: "คุณสระผมกี่โมง", q_phonetic: "khun sà phǒm kìi mong", q_es: "kun sà pǒm kì mong", q_tone: "m-l-r-l-m", q_spanish: "What time do you wash your hair?", q_en: "What time do you wash your hair?", a_thai: "เช้าครับ", a_phonetic: "cháo khráp", a_es: "chǎo kráp", a_tone: "r-h", a_spanish: "In the morning", a_en: "In the morning", category: "verbos", lesson: 10 },
    { q_thai: "คุณแต่งตัวไหม", q_phonetic: "khun dtàeng dtuua măi", q_es: "kun dtèng dtu-a mǎi", q_tone: "m-f-m-r", q_spanish: "Are you getting dressed?", q_en: "Are you getting dressed?", a_thai: "แต่งตัวครับ", a_phonetic: "dtàeng dtuua khráp", a_es: "dtèng dtu-a kráp", a_tone: "f-m-h", a_spanish: "Yes, getting dressed", a_en: "Yes, getting dressed", category: "verbos", lesson: 10 },
    { q_thai: "คุณพักผ่อนไหม", q_phonetic: "khun phàk-phòn măi", q_es: "kun pàk-pòn mǎi", q_tone: "m-l-l-r", q_spanish: "Are you resting?", q_en: "Are you resting?", a_thai: "พักผ่อนครับ", a_phonetic: "phàk-phòn khráp", a_es: "pàk-pòn kráp", a_tone: "l-l-h", a_spanish: "Yes, resting", a_en: "Yes, resting", category: "verbos", lesson: 10 },
    { q_thai: "มีนัดหมายไหม", q_phonetic: "mii nát-mǎai măi", q_es: "mi nát-mǎai mǎi", q_tone: "m-h-f-r", q_spanish: "Do you have an appointment?", q_en: "Do you have an appointment?", a_thai: "มีครับ", a_phonetic: "mii khráp", a_es: "mi kráp", a_tone: "m-h", a_spanish: "Yes, I have", a_en: "Yes, I have", category: "verbos", lesson: 10 },
    { q_thai: "คิวยาวไหม", q_phonetic: "khiu yao măi", q_es: "kiú yao mǎi", q_tone: "m-m-r", q_spanish: "Is the queue long?", q_en: "Is the queue long?", a_thai: "ไม่ยาวครับ", a_phonetic: "mâi yao khráp", a_es: "mâi yao kráp", a_tone: "f-m-h", a_spanish: "Not long", a_en: "Not long", category: "sustantivos", lesson: 10 },
    { q_thai: "คุณจองคิวไหม", q_phonetic: "khun jɔɔng khiu măi", q_es: "kun yong kiú mǎi", q_tone: "m-m-m-r", q_spanish: "Did you book a queue?", q_en: "Did you book a queue?", a_thai: "จองครับ", a_phonetic: "jɔɔng khráp", a_es: "yong kráp", a_tone: "m-h", a_spanish: "Yes, booked", a_en: "Yes, booked", category: "verbos", lesson: 10 },
    { q_thai: "เสื้อสวยไหม", q_phonetic: "sǔea sǔai măi", q_es: "sǔea sǔai mǎi", q_tone: "f-f-r", q_spanish: "Is the shirt beautiful?", q_en: "Is the shirt beautiful?", a_thai: "สวยมาก", a_phonetic: "sǔai mâak", a_es: "sǔai mâk", a_tone: "f-h", a_spanish: "Very beautiful", a_en: "Very beautiful", category: "sustantivos", lesson: 10 },
    { q_thai: "คุณตัดผมไหม", q_phonetic: "khun dtàt phǒm măi", q_es: "kun dtàt pǒm mǎi", q_tone: "m-l-r-r", q_spanish: "Are you cutting your hair?", q_en: "Are you cutting your hair?", a_thai: "ตัดครับ", a_phonetic: "dtàt khráp", a_es: "dtàt kráp", a_tone: "l-h", a_spanish: "Yes, cutting", a_en: "Yes, cutting", category: "verbos", lesson: 10 },
    // Lesson 11 — missing
    { q_thai: "อยู่ในห้องไหม", q_phonetic: "yùu nai hɔ̂ŋ măi", q_es: "iù nai hóng mǎi", q_tone: "l-m-f-r", q_spanish: "Are you inside the room?", q_en: "Are you inside the room?", a_thai: "ใช่ครับ ข้างใน", a_phonetic: "châi khráp, khâang-nai", a_es: "châi kráp, kâang-nai", a_tone: "f-h, f-m", a_spanish: "Yes, inside", a_en: "Yes, inside", category: "preposiciones", lesson: 11 },
    { q_thai: "ไปกับใคร", q_phonetic: "bpai gàp khrai", q_es: "bpai gàp krái", q_tone: "m-l-m", q_spanish: "Who are you going with?", q_en: "Who are you going with?", a_thai: "ไปกับเพื่อน", a_phonetic: "bpai gàp pheûan", a_es: "bpai gàp pûean", a_tone: "m-l-f", a_spanish: "Going with a friend", a_en: "Going with a friend", category: "preposiciones", lesson: 11 },
    { q_thai: "ทั้งหมดกี่บาท", q_phonetic: "táng-hmòt kìi bàat", q_es: "táng-mòt kì bàt", q_tone: "f-l-l-l", q_spanish: "How much in total?", q_en: "How much in total?", a_thai: "ร้อยบาท", a_phonetic: "rɔ́ɔy bàat", a_es: "rói bàt", a_tone: "h-l", a_spanish: "One hundred baht", a_en: "One hundred baht", category: "preposiciones", lesson: 11 },
    { q_thai: "เข้าข้างในได้ไหม", q_phonetic: "khâo khâang-nai dâai măi", q_es: "kǎo kâang-nai dâi mǎi", q_tone: "f-f-m-f-r", q_spanish: "Can I come inside?", q_en: "Can I come inside?", a_thai: "เข้าได้ครับ", a_phonetic: "khâo dâai khráp", a_es: "kǎo dâi kráp", a_tone: "f-f-h", a_spanish: "Yes, you can come in", a_en: "Yes, you can come in", category: "preposiciones", lesson: 11 },
    { q_thai: "ออกไปข้างนอกได้ไหม", q_phonetic: "ɔ̀ɔk bpai khâang-nɔ̂ɔk dâai măi", q_es: "òk bpai kâang-nòk dâi mǎi", q_tone: "l-m-f-l-f-r", q_spanish: "Can I go outside?", q_en: "Can I go outside?", a_thai: "ออกได้ครับ", a_phonetic: "ɔ̀ɔk dâai khráp", a_es: "òk dâi kráp", a_tone: "l-f-h", a_spanish: "Yes, you can go out", a_en: "Yes, you can go out", category: "preposiciones", lesson: 11 },
    // Lesson 12 — missing
    { q_thai: "ไปสนามเด็กเล่นเลี้ยวขวาไหม", q_phonetic: "bpai sà-nǎam dèk lên lîao khwǎa măi", q_es: "bpai sà-nǎm dék lên lîao kuǎa mǎi", q_tone: "m-l-r-l-f-f-r-r", q_spanish: "To go to the playground, turn right?", q_en: "Turn right to the playground?", a_thai: "ใช่ครับ เลี้ยวขวา", a_phonetic: "châi khráp, lîao khwǎa", a_es: "châi kráp, lîao kuǎa", a_tone: "f-h, f-r", a_spanish: "Yes, turn right", a_en: "Yes, turn right", category: "homework", lesson: 12 },
    { q_thai: "สวนสาธารณะอยู่ไกลไหม", q_phonetic: "sǔuan săa-taa-rá-ná yùu klai măi", q_es: "sǔan sǎ-ta-rá-ná iù glai mǎi", q_tone: "r-h-m-h-h-l-m-r", q_spanish: "Is the park far?", q_en: "Is the park far?", a_thai: "ไม่ไกลครับ", a_phonetic: "mâi klai khráp", a_es: "mâi glai kráp", a_tone: "f-m-h", a_spanish: "Not far", a_en: "Not far", category: "homework", lesson: 12 },
    // Lesson 13 — missing
    { q_thai: "คลอดลูกที่ไหน", q_phonetic: "khlôot lûuk thîi-nǎi", q_es: "klôt lûk tî-nǎi", q_tone: "f-f-f-f-r", q_spanish: "Where did you give birth?", q_en: "Where did you give birth?", a_thai: "ที่โรงพยาบาล", a_phonetic: "thîi roong-phaa-baan", a_es: "tî rong-pa-ya-ban", a_tone: "f-m-m-m", a_spanish: "At the hospital", a_en: "At the hospital", category: "cuerpo", lesson: 13 },
    { q_thai: "เขาท้องแก้วที่เดือนกี่", q_phonetic: "khǎo tong-gâeo thîi duean kìi", q_es: "kǎo tong-gěo tî deuan kì", q_tone: "r-m-f-f-m-l", q_spanish: "How many months pregnant is she?", q_en: "How many months pregnant is she?", a_thai: "ห้าเดือน", a_phonetic: "hâa duean", a_es: "jâ deuan", a_tone: "f-m", a_spanish: "Five months", a_en: "Five months", category: "cuerpo", lesson: 13 },
    { q_thai: "คุณเล่นกีฬาอะไร", q_phonetic: "khun lên kii-laa a-rai", q_es: "kun lên kii-la a-rai", q_tone: "m-l-m-l-m", q_spanish: "What sport do you play?", q_en: "What sport do you play?", a_thai: "เล่นฟุตบอล", a_phonetic: "lên fút-bon", a_es: "lên fút-bon", a_tone: "l-f-m", a_spanish: "I play football", a_en: "I play football", category: "cuerpo", lesson: 13 },
    { q_thai: "ทิศเหนือหนาวไหม", q_phonetic: "thít nǔea nǎao măi", q_es: "tít nǔea nǎao mǎi", q_tone: "h-r-r-r", q_spanish: "Is the north cold?", q_en: "Is the north cold?", a_thai: "หนาวครับ", a_phonetic: "nǎao khráp", a_es: "nǎao kráp", a_tone: "r-h", a_spanish: "Yes, cold", a_en: "Yes, cold", category: "direcciones", lesson: 13 },
    { q_thai: "ทิศตะวันออกคืออะไร", q_phonetic: "thít tà-wan-òk kheu a-rai", q_es: "tít tà-wan-òk keu a-rai", q_tone: "h-m-l-m-l-m", q_spanish: "What is the east?", q_en: "What is the east?", a_thai: "ทิศตะวันออกครับ", a_phonetic: "thít tà-wan-òk khráp", a_es: "tít tà-wan-òk kráp", a_tone: "h-m-l-h", a_spanish: "It's the east", a_en: "It's the east", category: "direcciones", lesson: 13 },
    { q_thai: "ทิศตะวันตกคือทางไหน", q_phonetic: "thít tà-wan-tòk kheu thaang-nǎi", q_es: "tít tà-wan-tòk keu tang-nǎi", q_tone: "h-m-l-m-m-r", q_spanish: "Which way is west?", q_en: "Which way is west?", a_thai: "ทางนี้ครับ", a_phonetic: "thaang nîi khráp", a_es: "tang ní kráp", a_tone: "m-h-h", a_spanish: "This way", a_en: "This way", category: "direcciones", lesson: 13 },
    { q_thai: "อีสานอยู่ที่ไหน", q_phonetic: "ii-sǎan yùu thîi-nǎi", q_es: "ii-sǎan iù tî-nǎi", q_tone: "m-r-m-f-f-r", q_spanish: "Where is Isan?", q_en: "Where is Isan?", a_thai: "ตะวันออกเฉียงเหนือ", a_phonetic: "tà-wan-òk chǐang nǔea", a_es: "tà-wan-òk chǐang nǔea", a_tone: "m-l-l-r-r", a_spanish: "Northeast", a_en: "Northeast", category: "sustantivos", lesson: 13 },
    { q_thai: "ทางแยกอยู่ตรงไหน", q_phonetic: "thaang-yâaek yùu trom nǎi", q_es: "tang-iâek iù trom nǎi", q_tone: "m-f-m-m-r", q_spanish: "Where is the intersection?", q_en: "Where is the intersection?", a_thai: "อยู่ตรงหน้า", a_phonetic: "yùu trom nâa", a_es: "iù trom ná", a_tone: "l-m-f", a_spanish: "It's in front", a_en: "It's in front", category: "direcciones", lesson: 13 },
    { q_thai: "บ้านอยู่ตรงกลางไหม", q_phonetic: "bâan yùu trom klang măi", q_es: "bân iù trom klang mǎi", q_tone: "f-l-m-m-r", q_spanish: "Is the house in the middle?", q_en: "Is the house in the middle?", a_thai: "ใช่ครับ ตรงกลาง", a_phonetic: "châi khráp, trom klang", a_es: "châi kráp, trom klang", a_tone: "f-h, m-m", a_spanish: "Yes, in the middle", a_en: "Yes, in the middle", category: "direcciones", lesson: 13 },
    { q_thai: "ฝนตกทุกวันไหม", q_phonetic: "fǒn dtòk túk wan măi", q_es: "fǒn dtòk túk wan mǎi", q_tone: "h-l-l-m-r", q_spanish: "Does it rain every day?", q_en: "Does it rain every day?", a_thai: "ตกบ่อยครับ", a_phonetic: "dtòk bòi khráp", a_es: "dtòk bòi kráp", a_tone: "l-h-h", a_spanish: "It rains often", a_en: "It rains often", category: "direcciones", lesson: 13 },
    { q_thai: "ช่วยผมหน่อยได้ไหม", q_phonetic: "chûai phǒm nòi dâi măi", q_es: "chuái pǒm nòi dâi mǎi", q_tone: "h-r-l-f-r", q_spanish: "Can you help me please?", q_en: "Can you help me please?", a_thai: "ได้ครับ", a_phonetic: "dâi khráp", a_es: "dâi kráp", a_tone: "f-h", a_spanish: "Yes (I can)", a_en: "Yes (I can)", category: "saludos", lesson: 13 },

    // === Final coverage gap fills ===
    // Lesson 6 — numbers coverage
    { q_thai: "เบอร์โทรคุณเท่าไหร่", q_phonetic: "booe-thoo khun thâo-rài", q_es: "boe-to kun tao-rài", q_tone: "m-m-m-f-f", q_spanish: "What's your phone number?", q_en: "What's your phone number?", a_thai: "ศูนย์ สอง แปด เก้า สิบเอ็ด ยี่สิบเอ็ด", a_phonetic: "sǔun sǎawng bpàaet kâo sìp-èt yîi-sìp-èt", a_es: "sūn sǒng bpèt kâo sìp-èt yî-sìp-èt", a_tone: "m-r-l-f-l-l-f-l-l", a_spanish: "0 2 8 9 11 21", a_en: "0 2 8 9 11 21", category: "números", lesson: 6 },
    { q_thai: "ราคาเท่าไหร่", q_phonetic: "raa-khaa thâo-rài", q_es: "ra-ká tao-rài", q_tone: "m-h-f-f", q_spanish: "How much is it?", q_en: "How much is it?", a_thai: "สี่สิบบาท", a_phonetic: "sìi-sìp bàat", a_es: "sì-sìp bàt", a_tone: "l-l-l", a_spanish: "Forty baht", a_en: "Forty baht", category: "números", lesson: 6 },
    { q_thai: "คนกี่คน", q_phonetic: "khon kìi khon", q_es: "kon kì kon", q_tone: "m-l-m", q_spanish: "How many people?", q_en: "How many people?", a_thai: "หกสิบคน", a_phonetic: "hòk-sìp khon", a_es: "jòk-sìp kon", a_tone: "l-l-m", a_spanish: "Sixty people", a_en: "Sixty people", category: "números", lesson: 6 },
    { q_thai: "อายุเท่าไหร่", q_phonetic: "aa-yú thâo-rài", q_es: "a-iú tao-rài", q_tone: "m-f-f-f", q_spanish: "How old?", q_en: "How old?", a_thai: "เจ็ดสิบปี", a_phonetic: "jèt-sìp bpii", a_es: "chèt-sìp bpi", a_tone: "l-l-m", a_spanish: "Seventy years", a_en: "Seventy years", category: "números", lesson: 6 },
    { q_thai: "บ้านเลขที่เท่าไหร่", q_phonetic: "bâan lǎek-thîi thâo-rài", q_es: "bân lěk-tî tao-rài", q_tone: "f-l-f-f-f", q_spanish: "What's the house number?", q_en: "What's the house number?", a_thai: "เก้าสิบเอ็ด", a_phonetic: "kâo-sìp èt", a_es: "kâo-sìp èt", a_tone: "f-l-l", a_spanish: "Ninety-one", a_en: "Ninety-one", category: "números", lesson: 6 },
    { q_thai: "ค่าเช่าเท่าไหร่", q_phonetic: "khâa châo thâo-rài", q_es: "ká chao tao-rài", q_tone: "f-r-f-f", q_spanish: "How much is the rent?", q_en: "How much is the rent?", a_thai: "พันบาท", a_phonetic: "phan bàat", a_es: "pan bàt", a_tone: "m-l", a_spanish: "One thousand baht", a_en: "One thousand baht", category: "números", lesson: 6 },
    // Lesson 10 — พบ
    { q_thai: "คุณพบหมอไหม", q_phonetic: "khun phǒp mǒo măi", q_es: "kun pǒb mǒ mǎi", q_tone: "m-l-m-r", q_spanish: "Did you see the doctor?", q_en: "Did you see the doctor?", a_thai: "พบครับ", a_phonetic: "phǒp khráp", a_es: "pǒb kráp", a_tone: "l-h", a_spanish: "Yes, I saw", a_en: "Yes, I saw", category: "verbos", lesson: 10 },
    // Lesson 11 — และ
    { q_thai: "ข้าวและไก่หรือข้าวและปลา", q_phonetic: "khâaw læ gài rǔeu khâaw læ plaa", q_es: "kâo lae gài rúe kâo lae bpla", q_tone: "f-l-l-r-l-f-l-l-f-l-m", q_spanish: "Rice and chicken, or rice and fish?", q_en: "Rice and chicken, or rice and fish?", a_thai: "ข้าวและไก่ครับ", a_phonetic: "khâaw læ gài khráp", a_es: "kâo lae gài kráp", a_tone: "f-l-l-h", a_spanish: "Rice and chicken", a_en: "Rice and chicken", category: "preposiciones", lesson: 11 },
    // Lesson 13 — ช่วยผมหน่อยครับ
    { q_thai: "ช่วยผมหน่อยครับได้ไหม", q_phonetic: "chûai phǒm nòi khráp dâai măi", q_es: "chuái pǒm nòi kráp dâi mǎi", q_tone: "h-r-l-h-f-r", q_spanish: "Please help me, can you?", q_en: "Please help me, can you?", a_thai: "ได้ครับ ช่วยอะไรดี", a_phonetic: "dâai khráp, chûai a-rai dii", a_es: "dâi kráp, chuái a-rai di", a_tone: "f-h, h-l-m-m", a_spanish: "Yes, help with what?", a_en: "Yes, help with what?", category: "saludos", lesson: 13 }
  ],
  janus: [
    {
      theme: "Food",
      icon: "🍜",
      lesson: 1,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" }
      ],
      actions: [
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ดื่ม", phonetic: "dùuem", es: "duem", en: "drink" }
      ],
      objects: [
        { thai: "ผัดไทย", phonetic: "phàt-thai", es: "pat-tai", en: "pad thai" },
        { thai: "ข้าว", phonetic: "khâaw", es: "kâo", en: "rice" },
        { thai: "ไก่", phonetic: "gài", es: "gái", en: "chicken" },
        { thai: "ไข่", phonetic: "khài", es: "kái", en: "egg" },
        { thai: "หมู", phonetic: "mǔu", es: "mu", en: "pork" },
        { thai: "เนื้อ", phonetic: "núea", es: "ñua", en: "beef" },
        { thai: "ปลา", phonetic: "plaa", es: "bpla", en: "fish" },
        { thai: "ผัก", phonetic: "phàk", es: "pak", en: "vegetables" },
        { thai: "ผลไม้", phonetic: "phǒn-lá-mái", es: "pǒn-lá-mái", en: "fruit" },
        { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", en: "food" },
        { thai: "น้ำ", phonetic: "náam", es: "nam", en: "water" }
      ]
    },
    {
      theme: "Tastes",
      icon: "🌶",
      lesson: 1,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like" },
        { thai: "ไม่ชอบ", phonetic: "mâi chôop", es: "mai chop", en: "don't like" },
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want" },
        { thai: "ไม่อยาก", phonetic: "mâi yàak", es: "mai yak", en: "don't want" }
      ],
      actions: [
        { thai: "เผ็ด", phonetic: "phèt", es: "bpet", en: "spicy" },
        { thai: "หวาน", phonetic: "waan", es: "uan", en: "sweet" },
        { thai: "เค็ม", phonetic: "khem", es: "kem", en: "salty" },
        { thai: "เปรี้ยว", phonetic: "prîao", es: "bpriao", en: "sour" },
        { thai: "ร้อน", phonetic: "râwn", es: "ron", en: "hot" },
        { thai: "เย็น", phonetic: "yen", es: "ien", en: "cold" },
        { thai: "อร่อย", phonetic: "à-rôi", es: "a-roi", en: "delicious" }
      ],
      objects: [
        { thai: "มาก", phonetic: "mâak", es: "mak", en: "very" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" },
        { thai: "ไหม", phonetic: "măi", es: "mǎi", en: "?" }
      ]
    },
    {
      theme: "Places",
      icon: "📍",
      lesson: 1,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ได้", phonetic: "dâi", es: "dâi", en: "can" }
      ],
      actions: [
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "มา", phonetic: "maa", es: "ma", en: "come" },
        { thai: "อยู่", phonetic: "yùu", es: "iù", en: "be/stay" }
      ],
      objects: [
        { thai: "ร้านอาหาร", phonetic: "ráan-aa-hǎan", es: "ran-a-jan", en: "restaurant" },
        { thai: "ร้านกาแฟ", phonetic: "ráan-gaa-faa", es: "rán-ga-fa", en: "café" },
        { thai: "ร้านชา", phonetic: "ráan-chaa", es: "ran-cha", en: "tea house" },
        { thai: "ร้านขายยา", phonetic: "ráan-khǎai-yaa", es: "ran-kai-ya", en: "pharmacy" },
        { thai: "ร้านสะดวกซื้อ", phonetic: "ráan-sà-dùuak-súea", es: "ran-sa-duak-sua", en: "convenience store" },
        { thai: "ร้านหนังสือ", phonetic: "ráan-nǎng-sǔeu", es: "ran-nang-sue", en: "bookstore" },
        { thai: "สถานีตำรวจ", phonetic: "sa-thaa-nii tam-rùat", es: "sa-ta-ni-tam-ruat", en: "police station" },
        { thai: "ห้องน้ำ", phonetic: "hông-náam", es: "jong-nam", en: "bathroom" },
        { thai: "โรงเรียน", phonetic: "roong-riian", es: "rong-rian", en: "school" },
        { thai: "โรงพยาบาล", phonetic: "roong-phayaa-baan", es: "rong-pa-ya-ban", en: "hospital" },
        { thai: "โรงแรม", phonetic: "roong-raem", es: "rong-rem", en: "hotel" },
        { thai: "โรงหนัง", phonetic: "roong-nǎng", es: "rong-nang", en: "cinema" }
      ]
    },
    {
      theme: "Skills",
      icon: "💬",
      lesson: 1,
      subjects: [...PRONOUNS,
        { thai: "ครู", phonetic: "khruu", es: "kru", en: "teacher" },
        { thai: "พยาบาล", phonetic: "pha-yaa-baan", es: "pa-ya-ban", en: "nurse" }
      ],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ได้", phonetic: "dâi", es: "dâi", en: "can" }
      ],
      actions: [
        { thai: "พูด", phonetic: "phûut", es: "pût", en: "speak" },
        { thai: "ฟัง", phonetic: "fang", es: "fang", en: "listen" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do/make" },
        { thai: "สอน", phonetic: "sɔ̌ɔn", es: "sǒn", en: "teach" },
        { thai: "ทำงาน", phonetic: "tam-ngaan", es: "tam-ngan", en: "work" },
        { thai: "ดูแล", phonetic: "duu-lɛɛ", es: "du-le", en: "take care" }
      ],
      objects: [
        { thai: "ภาษาไทย", phonetic: "phaa-sǎa thai", es: "pa-sǎa tai", en: "Thai" },
        { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", en: "food" },
        { thai: "อาหารไทย", phonetic: "aa-hǎan-thai", es: "a-jan-tai", en: "Thai food" },
        { thai: "งาน", phonetic: "ngaan", es: "ngan", en: "work" },
        { thai: "หนังสือ", phonetic: "nǎng-sǔeu", es: "nǎng-sǔe", en: "book" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" }
      ]
    },
    {
      theme: "Questions",
      icon: "❓",
      lesson: 1,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" }
      ],
      actions: [
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "มา", phonetic: "maa", es: "ma", en: "come" },
        { thai: "พูด", phonetic: "phûut", es: "pût", en: "speak" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do" }
      ],
      objects: [
        { thai: "อะไร", phonetic: "a-rai", es: "a-rai", en: "what?" },
        { thai: "ที่ไหน", phonetic: "thîi-nǎi", es: "tî-nǎi", en: "where?" },
        { thai: "ไหม", phonetic: "măi", es: "mǎi", en: "?" },
        { thai: "เท่าไหร่", phonetic: "thâo-rài", es: "tâo-râi", en: "how much?" },
        { thai: "ใคร", phonetic: "khrai", es: "krai", en: "who?" },
        { thai: "อย่างไร", phonetic: "yàng-rai", es: "yâng-rai", en: "how?" },
        { thai: "เมื่อไร", phonetic: "mʉ̂a-rai", es: "mua-rai", en: "when?" }
      ]
    },
    {
      theme: "Quantities",
      icon: "🔢",
      lesson: 6,
      subjects: [...PRONOUNS, { thai: "แม่ค้า", phonetic: "mɛ̂ɛ-khâa", es: "me-ka", en: "vendor" }],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "เอา", phonetic: "ao", es: "ao", en: "take" },
        { thai: "มี", phonetic: "mee", es: "mi", en: "have" }
      ],
      actions: [
        { thai: "สั่ง", phonetic: "sàng", es: "sang", en: "order" },
        { thai: "ซื้อ", phonetic: "súeu", es: "sú", en: "buy" },
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ขาย", phonetic: "khǎay", es: "kǎi", en: "sell" },
        { thai: "เอา", phonetic: "ao", es: "ao", en: "take" },
        { thai: "หา", phonetic: "hǎa", es: "ja", en: "look for" }
      ],
      objects: [
        { thai: "ไก่สองตัว", phonetic: "gài sǎawng tua", es: "gái song dtua", en: "2 chickens" },
        { thai: "ข้าวหนึ่งจาน", phonetic: "khâaw nùeng jaan", es: "káo nung jan", en: "1 plate of rice" },
        { thai: "น้ำสามขวด", phonetic: "náam sǎam khùat", es: "nam sam kuat", en: "3 bottles of water" },
        { thai: "ไข่ห้าใบ", phonetic: "khài hâa bai", es: "kái já bai", en: "5 eggs" },
        { thai: "ผัดไทยสองจาน", phonetic: "phàt-thai sǎawng jaan", es: "pat-tai song jan", en: "2 pad thais" },
        { thai: "ผักหนึ่งจาน", phonetic: "phàk nùeng jaan", es: "pak nung jan", en: "1 plate of vegetables" },
        { thai: "ยี่สิบบาท", phonetic: "yîi-sìp bàat", es: "yí-sip bat", en: "20 baht" },
        { thai: "สิบยูโร", phonetic: "sìp yuu-roo", es: "sip yu-ro", en: "10 euros" }
      ]
    },
    {
      theme: "Descriptions",
      icon: "🎨",
      lesson: 2,
      subjects: [
        { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", en: "food" },
        { thai: "คน", phonetic: "khon", es: "kon", en: "person" },
        { thai: "ที่นี่", phonetic: "thîi-nîi", es: "ti-ni", en: "here" },
        { thai: "ที่นั่น", phonetic: "thîi-nân", es: "ti-nan", en: "there" },
        { thai: "เขา", phonetic: "khǎo", es: "kǎo", en: "he/she" },
        { thai: "พวกคุณ", phonetic: "phǔuak khun", es: "puak-kun", en: "you (pl)" },
        { thai: "พวกเขา", phonetic: "phǔuak khǎo", es: "puak-kao", en: "they" },
        { thai: "มัน", phonetic: "man", es: "man", en: "it" }
      ],
      motives: [
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "ค่อนข้าง", phonetic: "khɔ̂ɔn-khâang", es: "kon-kang", en: "quite" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will be" },
        { thai: "น่าจะ", phonetic: "nâa-jà", es: "na-cha", en: "probably" },
        { thai: "คง", phonetic: "khong", es: "kong", en: "might be" },
        { thai: "ดู", phonetic: "duu", es: "du", en: "looks" }
      ],
      actions: [
        { thai: "ดี", phonetic: "dee", es: "di", en: "good" },
        { thai: "ไกล", phonetic: "glai", es: "glai", en: "far" },
        { thai: "ใกล้", phonetic: "glâi", es: "glai", en: "near" },
        { thai: "ช้า", phonetic: "cháa", es: "cha", en: "slow" },
        { thai: "เร็ว", phonetic: "reo", es: "reo", en: "fast" },
        { thai: "สวย", phonetic: "sǔuai", es: "suai", en: "beautiful" },
        { thai: "ใหญ่", phonetic: "yài", es: "chai", en: "big" },
        { thai: "เล็ก", phonetic: "lék", es: "lek", en: "small" }
      ],
      objects: [
        { thai: "มาก", phonetic: "mâak", es: "mak", en: "very" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" },
        { thai: "ไหม", phonetic: "măi", es: "mǎi", en: "?" },
        { thai: "ใช่ไหม", phonetic: "châi măi", es: "chai mai", en: "right?", lesson: 3 }
      ]
    },
    {
      theme: "Body & Things",
      icon: "🧍",
      lesson: 2,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ได้", phonetic: "dâi", es: "dâi", en: "can" }
      ],
      actions: [
        { thai: "ใช้", phonetic: "chái", es: "chái", en: "use" },
        { thai: "หา", phonetic: "hǎa", es: "ja", en: "look for" },
        { thai: "ซื้อ", phonetic: "súeu", es: "sú", en: "buy" },
        { thai: "วาง", phonetic: "waang", es: "uang", en: "put" },
        { thai: "เสีย", phonetic: "sǐia", es: "sía", en: "lose/break" },
        { thai: "ลืม", phonetic: "lʉʉm", es: "luem", en: "forget" }
      ],
      objects: [
        { thai: "หนังสือ", phonetic: "nǎng-sǔeu", es: "nǎng-sǔe", en: "book" },
        { thai: "เบอร์โทร", phonetic: "boe-tho", es: "bo-to", en: "phone" },
        { thai: "เวลา", phonetic: "wee-laa", es: "ui-la", en: "time" },
        { thai: "เงิน", phonetic: "ngoen", es: "ngoen", en: "money" },
        { thai: "รถ", phonetic: "rót", es: "rot", en: "car" },
        { thai: "คอมพิวเตอร์", phonetic: "khaawm-phíu-dtoe", es: "kom-piu-toe", en: "computer" },
        { thai: "กระเป๋า", phonetic: "gra-pǎw", es: "gra-bpao", en: "bag" }
      ]
    },
    {
      theme: "Shopping",
      icon: "🛍",
      lesson: 2,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" }
      ],
      actions: [
        { thai: "ซื้อ", phonetic: "súeu", es: "sú", en: "buy" },
        { thai: "ขาย", phonetic: "khǎay", es: "kǎi", en: "sell" },
        { thai: "เอา", phonetic: "ao", es: "ao", en: "take/have" },
        { thai: "ดู", phonetic: "duu", es: "du", en: "look at" }
      ],
      objects: [
        { thai: "เสื้อ", phonetic: "sǔêa", es: "suea", en: "shirt" },
        { thai: "กางเกง", phonetic: "kaang-keng", es: "kang-keng", en: "pants" },
        { thai: "รองเท้า", phonetic: "roong-tháw", es: "rong-tao", en: "shoes" },
        { thai: "กระเป๋า", phonetic: "gra-pǎw", es: "gra-bpao", en: "bag" },
        { thai: "ของขวัญ", phonetic: "khǎawng-khwan", es: "kong-kuan", en: "gift" },
        { thai: "ของฝาก", phonetic: "khǎawng-fàak", es: "kong-fak", en: "souvenir" },
        { thai: "ของ", phonetic: "kǒng", es: "kong", en: "things/stuff" },
        { thai: "ผลไม้", phonetic: "phǒn-lá-mái", es: "pǒn-lá-mái", en: "fruit" },
        { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", en: "food" }
      ]
    },
    {
      theme: "Time",
      icon: "🕐",
      lesson: 3,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "ตอนเช้า", phonetic: "dton-cháo", es: "dton-cháo", en: "morning" },
        { thai: "ตอนบ่าย", phonetic: "dton-bàai", es: "dton-bai", en: "afternoon" },
        { thai: "ตอนเย็น", phonetic: "dton-yen", es: "dton-ien", en: "evening" },
        { thai: "วันนี้", phonetic: "wan-nîi", es: "uan-ni", en: "today" },
        { thai: "พรุ่งนี้", phonetic: "phrûng-nîi", es: "prung-ni", en: "tomorrow" },
        { thai: "เมื่อวาน", phonetic: "mʉea-waan", es: "mua-uan", en: "yesterday" }
      ],
      actions: [
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do/make" },
        { thai: "นอน", phonetic: "nɔɔn", es: "non", en: "sleep" }
      ],
      objects: [
        { thai: "ข้าว", phonetic: "khâaw", es: "kâo", en: "rice/meal" },
        { thai: "บ้าน", phonetic: "bâan", es: "ban", en: "home" },
        { thai: "โรงเรียน", phonetic: "roong-riian", es: "rong-rian", en: "school" },
        { thai: "ตลาด", phonetic: "tà-làat", es: "dta-lat", en: "market" },
        { thai: "อาหาร", phonetic: "aa-hǎan", es: "a-jǎn", en: "food" },
        { thai: "งาน", phonetic: "ngaan", es: "ngan", en: "work" }
      ]
    },
    {
      theme: "Origins",
      icon: "🌍",
      lesson: 4,
      subjects: [...PRONOUNS, { thai: "พยาบาล", phonetic: "pha-yaa-baan", es: "pa-ya-ban", en: "nurse" }],
      motives: [
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "เคย", phonetic: "khooei", es: "koei", en: "ever" },
        { thai: "กำลัง", phonetic: "gam-lang", es: "gam-lang", en: "currently" },
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" }
      ],
      actions: [
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go to" },
        { thai: "มาจาก", phonetic: "maa-jàak", es: "ma-chak", en: "come from" },
        { thai: "อยู่", phonetic: "yùu", es: "iù", en: "live in" },
        { thai: "เกิด", phonetic: "gòuet", es: "gueot", en: "be born in" }
      ],
      objects: [
        { thai: "สเปน", phonetic: "sà-pěen", es: "sa-pen", en: "Spain" },
        { thai: "ไทย", phonetic: "thai", es: "tai", en: "Thailand" },
        { thai: "กรุงเทพ", phonetic: "krung-thêep", es: "krung-têp", en: "Bangkok" },
        { thai: "อังกฤษ", phonetic: "ang-grìt", es: "an-grit", en: "England" },
        { thai: "จีน", phonetic: "jeen", es: "chin", en: "China" },
        { thai: "ญี่ปุ่น", phonetic: "yîi-pùn", es: "yi-bpun", en: "Japan" }
      ]
    },
    {
      theme: "Well-being",
      icon: "💬",
      lesson: 4,
      subjects: [...PRONOUNS, { thai: "พยาบาล", phonetic: "pha-yaa-baan", es: "pa-ya-ban", en: "nurse" }],
      motives: [
        { thai: "รู้สึก", phonetic: "rúu-sùuek", es: "ru-suek", en: "feel" },
        { thai: "สบาย", phonetic: "sà-baai", es: "sa-bai", en: "comfortable/fine" },
        { thai: "เหนื่อย", phonetic: "nʉ̀ʉai", es: "ñuai", en: "tired" },
        { thai: "ดีใจ", phonetic: "dee-jai", es: "di-chai", en: "happy" },
        { thai: "ป่วย", phonetic: "bpùuai", es: "bpuai", en: "sick" },
        { thai: "หิว", phonetic: "hǐu", es: "hiu", en: "hungry" }
      ],
      actions: [
        { thai: "ดี", phonetic: "dee", es: "di", en: "good" },
        { thai: "ไม่ดี", phonetic: "mâi-dee", es: "mái-di", en: "not good" },
        { thai: "มาก", phonetic: "mâak", es: "mak", en: "very" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" }
      ],
      objects: [
        { thai: "ไหม", phonetic: "măi", es: "mǎi", en: "?" },
        { thai: "ครับ", phonetic: "khráp", es: "krap", en: "polite (m)" },
        { thai: "ค่ะ", phonetic: "khâ", es: "ká", en: "polite (f)" },
        { thai: "ขอบคุณ", phonetic: "khòp-khun", es: "kop-kun", en: "thank you" },
        { thai: "แล้วคุณล่ะ", phonetic: "lɛ̂ɛo khun lâ", es: "leo-kun-la", en: "and you?" }
      ]
    },
    {
      theme: "Travel",
      icon: "✈️",
      lesson: 5,
      subjects: [...PRONOUNS],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" }
      ],
      actions: [
        { thai: "เที่ยว", phonetic: "thîao", es: "tio", en: "travel" },
        { thai: "เข้า", phonetic: "khâo", es: "kao", en: "go in" },
        { thai: "ออก", phonetic: "ɔ̀ɔk", es: "ok", en: "go out" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "ซื้อของ", phonetic: "súeu kǒng", es: "su-kong", en: "shop" },
        { thai: "ขาย", phonetic: "khǎay", es: "kǎi", en: "sell" }
      ],
      objects: [
        { thai: "ห้าง", phonetic: "hâng", es: "jang", en: "mall" },
        { thai: "ตลาด", phonetic: "tà-làat", es: "dta-lat", en: "market" },
        { thai: "ตลาดกลางคืน", phonetic: "tà-làat klang-kheun", es: "dta-lat-klang-ken", en: "night market" },
        { thai: "ตลาดเช้า", phonetic: "tà-làat cháo", es: "dta-lat-chao", en: "morning market" },
        { thai: "โรงแรม", phonetic: "roong-raem", es: "rong-rem", en: "hotel" },
        { thai: "กรุงเทพ", phonetic: "krung-thêep", es: "krung-têp", en: "Bangkok" }
      ]
    },
    {
      theme: "Learning",
      icon: "📚",
      lesson: 5,
      subjects: [...PRONOUNS,
        { thai: "ครู", phonetic: "khruu", es: "kru", en: "teacher" },
        { thai: "พยาบาล", phonetic: "pha-yaa-baan", es: "pa-ya-ban", en: "nurse" }
      ],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" }
      ],
      actions: [
        { thai: "เรียน", phonetic: "rian", es: "rian", en: "study" },
        { thai: "เข้าใจ", phonetic: "khâo-jai", es: "kao-chai", en: "understand" },
        { thai: "คิด", phonetic: "khít", es: "kid", en: "think" },
        { thai: "คิดถึง", phonetic: "khít-teung", es: "kid-teung", en: "miss" },
        { thai: "พูด", phonetic: "phûut", es: "pût", en: "speak" },
        { thai: "ทำงาน", phonetic: "tam-ngaan", es: "tam-ngan", en: "work" }
      ],
      objects: [
        { thai: "ภาษาไทย", phonetic: "phaa-sǎa thai", es: "pa-sǎa tai", en: "Thai language" },
        { thai: "โรงเรียน", phonetic: "roong-riian", es: "rong-rian", en: "school" },
        { thai: "คุณ", phonetic: "khun", es: "kun", en: "you" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" }
      ]
    },
    {
      theme: "Questions L6",
      icon: "❔",
      lesson: 6,
      subjects: [
        PRONOUNS[2], PRONOUNS[4], PRONOUNS[3], PRONOUNS[6],
        { thai: "ครู", phonetic: "khruu", es: "kru", en: "teacher" },
        { thai: "แม่ค้า", phonetic: "mɛ̂ɛ-khâa", es: "me-ka", en: "vendor" }
      ],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ได้", phonetic: "dâi", es: "dâi", en: "can" },
        { thai: "มักจะ", phonetic: "mák-jà", es: "mak-cha", en: "usually" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" }
      ],
      actions: [
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "ซื้อ", phonetic: "súeu", es: "sú", en: "buy" },
        { thai: "ขาย", phonetic: "khǎay", es: "kǎi", en: "sell" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do" },
        { thai: "เรียน", phonetic: "rian", es: "rian", en: "study" }
      ],
      objects: [
        { thai: "อะไร", phonetic: "a-rai", es: "a-rai", en: "what?" },
        { thai: "ที่ไหน", phonetic: "thîi-nǎi", es: "tî-nǎi", en: "where?" },
        { thai: "อย่างไร", phonetic: "yàng-rai", es: "yâng-rai", en: "how?" },
        { thai: "เมื่อไร", phonetic: "mʉ̂a-rai", es: "mua-rai", en: "when?" },
        { thai: "กี่", phonetic: "kìi", es: "ki", en: "how many?" },
        { thai: "เท่าไหร่", phonetic: "thâo-rài", es: "tâo-râi", en: "how much?" }
      ]
    },
    {
      theme: "Tenses",
      icon: "⏳",
      lesson: 6,
      subjects: [...PRONOUNS_NO_PLURAL1],
      motives: [
        { thai: "กำลัง", phonetic: "gam-lang", es: "gam-lang", en: "-ing (now)" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will (future)" },
        { thai: "แล้ว", phonetic: "lɛ̂ɛo", es: "leo", en: "already (past)" }
      ],
      actions: [
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "เรียน", phonetic: "rian", es: "rian", en: "study" },
        { thai: "ทำงาน", phonetic: "tam-ngaan", es: "tam-ngan", en: "work" },
        { thai: "ซื้อ", phonetic: "súeu", es: "sú", en: "buy" },
        { thai: "พูด", phonetic: "phûut", es: "pût", en: "speak" }
      ],
      objects: [
        { thai: "ข้าว", phonetic: "khâaw", es: "kâo", en: "rice" },
        { thai: "ที่โรงเรียน", phonetic: "thîi roong-riian", es: "ti rong-rian", en: "at school" },
        { thai: "ที่ห้าง", phonetic: "thîi hâng", es: "ti jang", en: "at the mall" },
        { thai: "ภาษาไทย", phonetic: "phaa-sǎa thai", es: "pa-sǎa tai", en: "Thai" },
        { thai: "ที่บ้าน", phonetic: "thîi bâan", es: "ti ban", en: "at home" },
        { thai: "กับเพื่อน", phonetic: "gàp phʉ̂uan", es: "gap peuan", en: "with friends" }
      ]
    },
    {
      theme: "School",
      icon: "🎓",
      lesson: 7,
      subjects: [
        PRONOUNS[0], PRONOUNS[1], PRONOUNS[2], PRONOUNS[3],
        { thai: "ครู", phonetic: "khruu", es: "kru", en: "teacher" },
        { thai: "นักเรียน", phonetic: "nák-riian", es: "nak-rian", en: "student" }
      ],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "ชอบ", phonetic: "chôop", es: "chôp", en: "like to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ต้อง", phonetic: "dtông", es: "dtong", en: "must" }
      ],
      actions: [
        { thai: "สอน", phonetic: "sɔ̌ɔn", es: "sǒn", en: "teach" },
        { thai: "เรียน", phonetic: "rian", es: "rian", en: "study" },
        { thai: "อ่าน", phonetic: "àan", es: "an", en: "read" },
        { thai: "เขียน", phonetic: "khǐian", es: "kián", en: "write" },
        { thai: "ส่ง", phonetic: "sòng", es: "song", en: "send" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do" }
      ],
      objects: [
        { thai: "หนังสือ", phonetic: "nǎng-sǔeu", es: "nǎng-sǔe", en: "book" },
        { thai: "การ์ตูน", phonetic: "kaa-tuun", es: "ka-tun", en: "cartoon" },
        { thai: "การบ้าน", phonetic: "gaan-bâan", es: "gan-ban", en: "homework" },
        { thai: "ภาษาอังกฤษ", phonetic: "phaa-sǎa ang-grìt", es: "pa-sa an-grit", en: "English" },
        { thai: "ชื่อ", phonetic: "chûue", es: "chue", en: "name" },
        { thai: "แก้ว", phonetic: "gàɛo", es: "káo", en: "glass" }
      ]
    },
    {
      theme: "Schedule",
      icon: "📅",
      lesson: 8,
      subjects: [...PRONOUNS_NO_PLURAL1],
      motives: [
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "เคย", phonetic: "khooei", es: "koei", en: "ever" },
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" }
      ],
      actions: [
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "มา", phonetic: "maa", es: "ma", en: "come" },
        { thai: "นัด", phonetic: "nát", es: "nát", en: "meet/appoint" },
        { thai: "พบ", phonetic: "phóp", es: "pop", en: "see (person)" },
        { thai: "กิน", phonetic: "gin", es: "guin", en: "eat" },
        { thai: "ทำ", phonetic: "tam", es: "tam", en: "do" }
      ],
      objects: [
        { thai: "วันนี้", phonetic: "wan-nîi", es: "uan-ni", en: "today" },
        { thai: "พรุ่งนี้", phonetic: "phrûng-nîi", es: "prung-ni", en: "tomorrow" },
        { thai: "เมื่อวาน", phonetic: "mʉ̂a-waan", es: "mua-uan", en: "yesterday" },
        { thai: "วันจันทร์", phonetic: "wan-jan", es: "uan-chan", en: "Monday" },
        { thai: "วันศุกร์", phonetic: "wan-sùk", es: "uan-suk", en: "Friday" },
        { thai: "วันเสาร์", phonetic: "wan-sǎo", es: "uan-sao", en: "Saturday" },
        { thai: "วันอาทิตย์", phonetic: "wan-aa-thít", es: "uan-a-tit", en: "Sunday" },
        { thai: "กลางวัน", phonetic: "glaang-wan", es: "glang-uan", en: "daytime" },
        { thai: "กลางคืน", phonetic: "glaang-kheun", es: "glang-keun", en: "nighttime" }
      ]
    },
    {
      theme: "Appointments",
      icon: "🗓",
      lesson: 9,
      subjects: [
        PRONOUNS[0], PRONOUNS[1], PRONOUNS[2], PRONOUNS[3],
        { thai: "หมอ", phonetic: "mɔ̌ɔ", es: "mor", en: "doctor" },
        { thai: "พนักงาน", phonetic: "phá-nák-ngaan", es: "pa-nak-ngan", en: "employee" }
      ],
      motives: [
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ต้อง", phonetic: "dtông", es: "dtong", en: "must" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" }
      ],
      actions: [
        { thai: "จอง", phonetic: "jɔɔng", es: "chong", en: "book/reserve" },
        { thai: "ยกเลิก", phonetic: "yók-lǒeu", es: "yok-leuk", en: "cancel" },
        { thai: "เปลี่ยน", phonetic: "plìian", es: "plian", en: "change" },
        { thai: "เช็คอิน", phonetic: "chék-in", es: "chék-in", en: "check in" },
        { thai: "เช็คเอาท์", phonetic: "chék-ao", es: "chék-ao", en: "check out" },
        { thai: "นัด", phonetic: "nát", es: "nát", en: "schedule" }
      ],
      objects: [
        { thai: "ห้อง", phonetic: "hɔ̂ɔng", es: "hong", en: "room" },
        { thai: "โต๊ะ", phonetic: "dtó", es: "dtó", en: "table" },
        { thai: "ตั๋ว", phonetic: "tǔua", es: "túa", en: "ticket" },
        { thai: "ที่นั่ง", phonetic: "thîi-nâng", es: "ti-nang", en: "seat" },
        { thai: "คิว", phonetic: "khiu", es: "kiu", en: "slot/turn" },
        { thai: "นัดหมาย", phonetic: "nát-mǎai", es: "nát-mai", en: "appointment" }
      ]
    },
    {
      theme: "Daily Routine",
      icon: "🪥",
      lesson: 10,
      subjects: [...PRONOUNS_NO_PLURAL1],
      motives: [
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "กำลัง", phonetic: "gam-lang", es: "gam-lang", en: "currently" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "ต้อง", phonetic: "dtông", es: "dtong", en: "must" }
      ],
      actions: [
        { thai: "ตื่นนอน", phonetic: "dtùue-nɔɔn", es: "dtue-non", en: "wake up" },
        { thai: "อาบน้ำ", phonetic: "àap-náam", es: "ap-nam", en: "shower" },
        { thai: "แปรงฟัน", phonetic: "prɛɛng-fan", es: "preng-fan", en: "brush teeth" },
        { thai: "สระผม", phonetic: "sà-phǒm", es: "sa-pom", en: "wash hair" },
        { thai: "แต่งตัว", phonetic: "dtàaeng-dtuua", es: "dteng-túa", en: "get dressed" },
        { thai: "พักผ่อน", phonetic: "phák-phòuen", es: "pak-pon", en: "rest" }
      ],
      objects: [
        { thai: "ตอนเช้า", phonetic: "dton-cháo", es: "dton-cháo", en: "in the morning" },
        { thai: "ตอนเย็น", phonetic: "dton-yen", es: "dton-ien", en: "in the evening" },
        { thai: "ทุกวัน", phonetic: "thúk-wan", es: "tuk-uan", en: "every day" },
        { thai: "เร็ว ๆ", phonetic: "reo-reo", es: "reo-reo", en: "quickly" },
        { thai: "ช้า ๆ", phonetic: "cháa-cháa", es: "cha-cha", en: "slowly" },
        { thai: "ครบ", phonetic: "khróp", es: "krop", en: "completely" }
      ]
    },
    {
      theme: "Colors",
      icon: "🎨",
      lesson: 10,
      subjects: [
        { thai: "รถ", phonetic: "rót", es: "rot", en: "car" },
        { thai: "บ้าน", phonetic: "bâan", es: "ban", en: "house" },
        { thai: "เสื้อ", phonetic: "sǔêa", es: "suea", en: "shirt" },
        { thai: "ดอกไม้", phonetic: "dòok-máai", es: "dok-mai", en: "flower" },
        { thai: "แมว", phonetic: "mɛɛo", es: "meo", en: "cat" },
        { thai: "กล่อง", phonetic: "glɔ̂ɔng", es: "glong", en: "box" }
      ],
      motives: [
        { thai: "ค่อนข้าง", phonetic: "khɔ̂ɔn-khâang", es: "kon-kang", en: "quite" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "น่าจะ", phonetic: "nâa-jà", es: "na-cha", en: "probably" },
        { thai: "ดู", phonetic: "duu", es: "du", en: "looks" }
      ],
      actions: [
        { thai: "สีแดง", phonetic: "sǐi-daaeng", es: "si-dáeng", en: "red" },
        { thai: "สีเขียว", phonetic: "sǐi-khǐiao", es: "si-kiáo", en: "green" },
        { thai: "สีเหลือง", phonetic: "sǐi-lǔeang", es: "si-lueang", en: "yellow" },
        { thai: "สีดำ", phonetic: "sǐi-dam", es: "si-dam", en: "black" },
        { thai: "สีขาว", phonetic: "sǐi-khǎao", es: "si-kao", en: "white" },
        { thai: "สีฟ้า", phonetic: "sǐi-fáa", es: "si-fa", en: "blue" },
        { thai: "สีส้ม", phonetic: "sǐi-sôm", es: "si-som", en: "orange" },
        { thai: "สีชมพู", phonetic: "sǐi-chom-phuu", es: "si-chom-pu", en: "pink" }
      ],
      objects: [
        { thai: "สวย", phonetic: "sǔuai", es: "suai", en: "beautiful" },
        { thai: "สด", phonetic: "sòt", es: "sot", en: "fresh/bright" },
        { thai: "สว่าง", phonetic: "sà-wàaang", es: "sa-uang", en: "bright" },
        { thai: "หม่น", phonetic: "mòuen", es: "mon", en: "dull" },
        { thai: "มาก", phonetic: "mâak", es: "mak", en: "very" },
        { thai: "นิดหน่อย", phonetic: "nìt-nɔ̀ɔy", es: "nit-noi", en: "a little" }
      ]
    },
    {
      theme: "Positions",
      icon: "🧭",
      lesson: 11,
      subjects: [...PRONOUNS,
        { thai: "แมว", phonetic: "mɛɛo", es: "meo", en: "cat" },
        { thai: "หนังสือ", phonetic: "nǎng-sǔeu", es: "nǎng-sǔe", en: "book" },
        { thai: "ร้านกาแฟ", phonetic: "ráan-gaa-faa", es: "rán-ga-fa", en: "café" }
      ],
      motives: [
        { thai: "อยู่", phonetic: "yùu", es: "iù", en: "be at" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "ไป", phonetic: "bpai", es: "bpai", en: "go" },
        { thai: "เดิน", phonetic: "dəən", es: "doen", en: "walk" }
      ],
      actions: [
        { thai: "ข้างใน", phonetic: "khâang-nai", es: "kang-nai", en: "inside" },
        { thai: "ข้างนอก", phonetic: "khâang-nɔ̀ɔk", es: "kang-nok", en: "outside" },
        { thai: "ข้างหน้า", phonetic: "khâang-nâa", es: "kang-na", en: "in front of" },
        { thai: "ข้างหลัง", phonetic: "khâang-lǎng", es: "kang-lang", en: "behind" },
        { thai: "ตรงข้าม", phonetic: "trom-khâam", es: "trong-kam", en: "opposite" },
        { thai: "ระหว่าง", phonetic: "rá-wàaang", es: "ra-uang", en: "between" }
      ],
      objects: [
        { thai: "บน", phonetic: "bon", es: "bon", en: "on" },
        { thai: "ใน", phonetic: "nai", es: "nai", en: "in" },
        { thai: "ใต้", phonetic: "dtâi", es: "dtai", en: "under" },
        { thai: "ข้างๆ", phonetic: "khâang-khâang", es: "kang-kang", en: "beside" },
        { thai: "ก่อน", phonetic: "kɔ̀ɔn", es: "kon", en: "before/first" },
        { thai: "เพื่อ", phonetic: "phûea", es: "pua", en: "for" }
      ]
    },
    {
      theme: "Directions & Body",
      icon: "🗺️",
      lesson: 12,
      subjects: [...PRONOUNS,
        { thai: "แมว", phonetic: "mɛɛo", es: "meo", en: "cat" },
        { thai: "หมอ", phonetic: "mɔ̌ɔ", es: "mor", en: "doctor" }
      ],
      motives: [
        { thai: "ต้อง", phonetic: "dtông", es: "dtong", en: "must" },
        { thai: "จะ", phonetic: "jà", es: "chà", en: "will" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" },
        { thai: "อยาก", phonetic: "yàak", es: "yàk", en: "want to" }
      ],
      actions: [
        { thai: "เลี้ยวซ้าย", phonetic: "lîao sáai", es: "liao sai", en: "turn left" },
        { thai: "เลี้ยวขวา", phonetic: "lîao khwǎa", es: "liao khwa", en: "turn right" },
        { thai: "ตรงไป", phonetic: "trom bpai", es: "trong bpai", en: "go straight" },
        { thai: "บอก", phonetic: "bɔ̀ɔk", es: "bok", en: "tell" },
        { thai: "ล้าง", phonetic: "láang", es: "lang", en: "wash" }
      ],
      objects: [
        { thai: "หัว", phonetic: "hǔa", es: "hua", en: "head" },
        { thai: "ตา", phonetic: "taa", es: "ta", en: "eyes" },
        { thai: "จมูก", phonetic: "jà-mùuk", es: "ja-muk", en: "nose" },
        { thai: "ปาก", phonetic: "pàak", es: "pak", en: "mouth" },
        { thai: "ฟัน", phonetic: "fan", es: "fan", en: "teeth" },
        { thai: "หู", phonetic: "hǔu", es: "hu", en: "ears" }
      ]
    },
    {
      theme: "Body & Health",
      icon: "🫁",
      lesson: 13,
      subjects: [...PRONOUNS,
        { thai: "หมอ", phonetic: "mɔ̌ɔ", es: "mor", en: "doctor" }
      ],
      motives: [
        { thai: "ปวด", phonetic: "pùuat", es: "pùuat", en: "ache" },
        { thai: "เจ็บ", phonetic: "jèp", es: "jèp", en: "hurt" },
        { thai: "ท้อง", phonetic: "tong", es: "tong", en: "pregnant" },
        { thai: "ไม่", phonetic: "mâi", es: "mâi", en: "not" }
      ],
      actions: [
        { thai: "ออกกำลังกาย", phonetic: "ɔ̀ɔk gam-lang-gaai", es: "òk gam-lang-gaai", en: "exercise" },
        { thai: "เล่นกีฬา", phonetic: "lên kii-laa", es: "lên kii-laa", en: "play sport" },
        { thai: "คลอด", phonetic: "khlôot", es: "klôt", en: "give birth" },
        { thai: "ช่วย", phonetic: "chûai", es: "chuái", en: "help" }
      ],
      objects: [
        { thai: "หัว", phonetic: "hǔa", es: "hǔa", en: "head" },
        { thai: "คอ", phonetic: "kɔɔ", es: "kor", en: "neck" },
        { thai: "ไหล่", phonetic: "lài", es: "lài", en: "shoulder" },
        { thai: "แขน", phonetic: "khǎen", es: "kǎen", en: "arm" },
        { thai: "ท้อง", phonetic: "tong", es: "tong", en: "stomach" },
        { thai: "ขา", phonetic: "khǎa", es: "kǎa", en: "leg" },
        { thai: "เท้า", phonetic: "tháo", es: "táo", en: "foot" },
        { thai: "มือ", phonetic: "muu", es: "muu", en: "hand" }
      ]
    }
  ],
  pairs: [
    { w1: "ไม่", w2: "ไหม", note: "Same 'mai' — Falling ↓ vs Rising ↑", category: "verbos" },
    { w1: "ข้าว", w2: "ขาว", note: "Same 'khao' — Falling ↓ vs Rising ↑", category: "comida" },
    { w1: "เขา", w2: "เข่า", note: "Same 'khao' — Rising ↑ vs Low ↘", category: "pronombres" },
    { w1: "มา", w2: "ม้า", note: "Same 'maa' — Mid → vs High ↗", category: "verbos" },
    { w1: "ไกล", w2: "ใกล้", note: "Same 'glai' — Mid → vs Falling ↓", category: "sustantivos" },
    { w1: "หมู", w2: "หมู่", note: "Same 'muu' — Rising ↑ vs Low ↘", category: "comida" },
    { w1: "หน้า", w2: "หนา", note: "Same 'naa' — Falling ↓ vs Rising ↑", category: "sustantivos" },
    { w1: "ชา", w2: "ช้า", note: "Same 'chaa' — Mid → vs High ↗", category: "comida" },
    { w1: "เข้า", w2: "เขา", note: "Same 'khao' — Falling ↓ vs Rising ↑", category: "verbos" },
    { w1: "เข้า", w2: "เข่า", note: "Same 'khao' — Falling ↓ vs Low ↘ (enter vs knee)", category: "verbos" },
    { w1: "เขา", w2: "ข้าว", note: "Similar 'khao/khaow' — Rising ↑ vs Falling ↓ (open mouth)", category: "pronombres" },
    { w1: "เช้า", w2: "ช้า", note: "Same 'chao' — Rising ↑ vs High ↗", category: "sustantivos" },
    { w1: "เก้า", w2: "ข้าว", note: "Similar 'kao/khaow' — Falling ↓ vs Falling ↓ (close/open mouth)", category: "números" },
    { w1: "สี่", w2: "สี", note: "Same 'see' — Low ↘ vs Mid → (four vs color)", category: "números" },
    { w1: "ไก่", w2: "ไข่", note: "Similar 'kai' — Low ↘ vs Low ↘ (chicken gài vs egg kài, hard vs soft k)", category: "comida" },
    { w1: "สอน", w2: "ส่ง", note: "Similar 'son' — Low ↘ vs Low ↘ (teach sǒn vs send sòng, n vs ng)", category: "verbos" },
    { w1: "นอน", w2: "นัด", note: "Similar 'non/nát' — sleep vs appointment (different final sound)", category: "verbos" }
  ],

  // === PRACTICE: daily-life sentences using existing vocabulary ===
  practica: [
    { thai: "ฉันเหนื่อยนิดหน่อย", phonetic: "chǎn nʉ̀ʉai nìt-nòi", es: "chán ñuai nìt-nòi", tone: "r-l-l-l", spanish: "estoy un poco cansado", en: "I'm a little tired", category: "practica", lesson: 12 },
    { thai: "กลางคืนร้อนแล้ว", phonetic: "klang-kheun râwn lɛ̂ɛo", es: "klang-ken rôn lêo", tone: "m-m-f-f", spanish: "hice calor a la noche", en: "it was hot at night", category: "practica", lesson: 12 },
    { thai: "สามสิบองศา", phonetic: "sǎam-sìp ʔoŋ-sǎa", es: "sǎm-sìp ong-sá", tone: "r-l-h", spanish: "hice unos treinta grados", en: "it was about thirty degrees", category: "practica", lesson: 12 },
    { thai: "ตื่นนอนตีห้า", phonetic: "dtùen-nɔɔn dtii hâa", es: "dtùen-non dtii jâ", tone: "l-m-m-f", spanish: "me levanté a las 5", en: "I got up at 5 AM", category: "practica", lesson: 12 },
    { thai: "เรียนภาษาไทย", phonetic: "rian phaa-sǎa thai", es: "rian ba-sǎa tai", tone: "m-m-m-m", spanish: "estudié tailandés", en: "I studied Thai", category: "practica", lesson: 12 },
    { thai: "ออกไปข้างนอก", phonetic: "ɔ̀ɔk bpai khâang-nɔ̀ɔk", es: "òk bpai kâang-nòk", tone: "l-m-f-l", spanish: "salí afuera", en: "I went outside", category: "practica", lesson: 12 },
    { thai: "เล่นกีฬา", phonetic: "lên kii-laa", es: "lên kii-laa", tone: "l-m", spanish: "hice deporte", en: "I did sport", category: "practica", lesson: 12 },
    { thai: "ทำงาน", phonetic: "tam-ngaan", es: "tam-ngan", tone: "m-m", spanish: "trabajé", en: "I worked", category: "practica", lesson: 12 }
  ]
};
