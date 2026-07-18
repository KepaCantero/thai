var TONES = {
  m: { symbol: "→", name: "Mid", color: "#4ecdc4" },
  l: { symbol: "↘", name: "Low", color: "#7b8cff" },
  r: { symbol: "↑", name: "Rising", color: "#95e876" },
  f: { symbol: "↓", name: "Falling", color: "#ff6b6b" },
  h: { symbol: "↗", name: "High", color: "#ffd166" }
};

var CAT_LABELS = {
  pronombres: "Pronouns", saludos: "Greetings", verbos: "Verbs",
  sabores: "Tastes", comida: "Food", "números": "Numbers",
  preguntas: "Questions", tiendas: "Shops", sustantivos: "Nouns",
  tiempo: "Time", colores: "Colors", preposiciones: "Prepositions",
  direcciones: "Directions", cuerpo: "Body", youtube: "YouTube",
  pares: "Pairs (Tone)", homework: "Homework", practica: "Practice",
  dificiles: "★ Difíciles"
};

// English translations — Thai → English
var THAI_EN = {
  "ฉัน":"I (informal)","ผม":"I (masculine)","คุณ":"you","เรา":"we","เขา":"he/she",
  "สวัสดี":"hello/goodbye","สวัสดีค่ะ":"hello (female)","สวัสดีครับ":"hello (male)",
  "ครับ":"polite particle (male)","ค่ะ":"polite particle (female)",
  "ขอบคุณ":"thank you","ขอโทษ":"sorry/excuse me",
  "กิน":"to eat","กินข้าว":"to eat (meal)","อร่อย":"delicious",
  "ไม่":"not/no","ใช่":"yes (affirming)","อยาก":"to want",
  "ชอบ":"to like","มี":"to have","เป็น":"to be",
  "จะ":"will/future","เอา":"to want/take","มา":"to come","ไป":"to go",
  "อาหาร":"food","ข้าว":"rice","ไก่":"chicken","ไข่":"egg",
  "หมู":"pork","เนื้อ":"beef","ปลา":"fish","ผัก":"vegetables",
  "ผลไม้":"fruit","ผัดไทย":"pad thai","น้ำ":"water",
  "เผ็ด":"spicy","หวาน":"sweet","เค็ม":"salty","เปรี้ยว":"sour",
  "ร้อน":"hot","เย็น":"cold",
  "หนึ่ง":"one","สอง":"two","สาม":"three","สี่":"four","ห้า":"five",
  "หก":"six","เจ็ด":"seven","แปด":"eight","เก้า":"nine","สิบ":"ten",
  "ร้านอาหาร":"restaurant","ร้านกาแฟ":"café","ร้านชา":"tea house",
  "ร้านขายยา":"pharmacy","ร้านสะดวกซื้อ":"convenience store",
  "ร้านหนังสือ":"bookstore","สถานีตำรวจ":"police station",
  "โรง":"building/hall","โรงเรียน":"school","โรงพยาบาล":"hospital","โรงแรม":"hotel","โรงหนัง":"cinema",
  "อยู่":"to stay/be","ที่ไหน":"where?","อะไร":"what?","หนังสือ":"book",
  // Lesson 3
  "ทำ":"to do/make","งาน":"work","ทำงาน":"to work","ทำอาหาร":"to cook",
  "พูด":"to speak","ฟัง":"to listen","ได้":"can","สอน":"to teach",
  "ครู":"teacher","ยินดีค่ะ":"you're welcome (female)","ยินดีครับ":"you're welcome (male)",
  "ได้รับ":"to receive","นิดหน่อย":"a little","ภาษา":"language",
  "ไหม":"question particle",
  "อยากได้":"to want to get","รู้จัก":"to know/meet",
  // Extra particles & grammar
  "ไม่เป็นไร":"no worries","ห้องน้ำ":"bathroom","ห้อง":"room",
  "ไหม":"question particle","ที่":"at/in","และ":"and","หรือ":"or",
  "กี่":"how many?","มาก":"very","คน":"person","ตัว":"classifier",
  "จาน":"plate","แก้ว":"glass","ฟอง":"classifier","เล่ม":"classifier",
  "อัน":"classifier","นี้":"this","นั้น":"that","ดี":"good",
  "สบายดี":"I'm fine","สบาย":"fine","จาก":"from",
  "เท่าไหร่":"how much?","บาท":"baht","ดื่ม":"to drink",
  "ไทย":"Thai","สเปน":"Spain","เวลา":"time","เบอร์โทร":"phone",
  "หมายเลข":"number","พวกเขา":"they",
  // Lesson 12 map places
  "ธนาคาร":"bank","สนามเด็กเล่น":"playground","สวนสาธารณะ":"public park"
};

// Phrase translations — Thai phrase → English
var PHRASE_EN = {
  "สวัสดีครับผม":"hello, I am (male)","สวัสดีค่ะฉัน":"hello, I am (female)",
  "ขอบคุณครับ":"thank you (male)","ขอบคุณค่ะ":"thank you (female)",
  "ขอโทษครับ":"excuse me (male)","ขอโทษค่ะ":"excuse me (female)",
  "เรากิน":"we eat","เขาไป":"he/she goes","คุณมี":"you have",
  "เราชอบ":"we like","เขามา":"he/she comes",
  "ฉันไป":"I go","ผมมา":"I come","เขาเป็น":"he/she is","ฉันมี":"I have",
  "ผมไม่":"I don't","ใช่ไหม":"right?","ไม่ใช่":"it's not",
  "ผมเอา":"I want (something)","ฉันจะไป":"I will go","ผมจะกิน":"I will eat",
  "เขาอยากไป":"he/she wants to go",
  "น้ำเย็น":"cold water","ผักอร่อย":"vegetables are delicious",
  "อาหารเผ็ด":"food is spicy","อาหารอร่อย":"food is delicious",
  "ผลไม้หวาน":"sweet fruit","อาหารไม่เค็ม":"food is not salty",
  "ฉันไม่เผ็ด":"I don't want spicy","ผมไม่ชอบเปรี้ยว":"I don't like sour",
  "ข้าวผัดไก่":"chicken fried rice","ฉันกินข้าว":"I eat rice",
  "ผมกินไก่":"I eat chicken","เขากินหมู":"he/she eats pork",
  "ผมชอบผัดไทย":"I like pad thai","ฉันชอบข้าว":"I like rice",
  "ผมไม่อยากกินเนื้อ":"I don't want to eat beef",
  "ฉันอยากกินผลไม้":"I want to eat fruit",
  "คุณชอบกินอะไร":"what do you like to eat?",
  "น้ำสองแก้ว":"two glasses of water","ไก่ห้าตัว":"five chickens",
  "ผมกินข้าวสองจาน":"I eat two plates of rice",
  "เขามีปลาสิบตัว":"he/she has ten fish",
  "ผมกินไข่สามฟอง":"I eat three eggs",
  "อยากกินหมูหนึ่งจาน":"want one plate of pork",
  "ฉันอยากกินผัดไทยสองจาน":"I want two plates of pad thai",
  "คุณกินปลาไหม":"do you eat fish?","คุณไปที่ไหน":"where are you going?",
  "คุณเป็นอะไร":"what are you?","เขามีอะไร":"what does he/she have?",
  "อาหารอะไรอร่อย":"what food is delicious?",
  "ผมไปร้านอาหาร":"I go to the restaurant",
  "เราไปร้านกาแฟ":"we go to the café",
  "เขามีหนังสือ":"he/she has a book",
  "ฉันเอาหนังสือ":"I want a book",
  "ผมเอาอันนี้":"I want this one","เอาอันนั้นครับ":"I want that one, please",
  "ผมอยากไปห้องน้ำ":"I want to go to the bathroom",
  "ห้องน้ำอยู่ที่นี่":"the bathroom is here",
  "คุณมาจากที่ไหน":"where do you come from?",
  "ผมมาจากห้อง":"I come from the room",
  "คุณอยากไปที่ไหน":"where do you want to go?",
  "ผมอยากกินข้าวที่ร้านอาหาร":"I want to eat at the restaurant",
  // Lesson 3
  "ผมกินอาหารไทยได้":"I can eat Thai food",
  "ผมอยากได้ครูไทย":"I want a Thai teacher",
  "คุณพูดไทยได้ไหม":"can you speak Thai?",
  "ผมฟังไทยได้":"I can understand Thai",
  "ผมทำอาหารได้":"I can cook",
  "ผมทำงาน":"I work",
  "ผมพูดไทยได้นิดหน่อย":"I can speak Thai a little",
  "ครูสอนอะไร":"what does the teacher teach?",
  "ผมทำอาหารไทย":"I cook Thai food",
  "ยินดีที่ได้รู้จัก":"nice to meet you",
  // Lesson 12 map directions
  "ตรงไปสถานีตำรวจ":"go straight to the police station",
  "ตรงไปโรงหนัง":"go straight to the cinema",
  "ตรงไปสนามเด็กเล่น":"go straight to the playground",
  "ตรงไปเลี้ยวซ้ายโรงพยาบาล":"go straight and turn left to the hospital",
  "ตรงไปเลี้ยวขวาธนาคาร":"go straight and turn right to the bank",
  "ตรงไปร้านอาหาร":"go straight to the restaurant",
  "ตรงไปเลี้ยวซ้ายโรงแรม":"go straight and turn left to the hotel",
  "ตรงไปเลี้ยวซ้ายโรงเรียน":"go straight and turn left to the school",
  "ตรงไปเลี้ยวซ้ายสวนสาธารณะ":"go straight and turn left to the park"
};

// Conversation translations — Q Thai → { q, a }
var CONV_EN = {
  "สวัสดีครับ คุณชื่ออะไร":{q:"Hello, what's your name?",a:"Hello, my name is..."},
  "ขอบคุณครับ":{q:"Thank you",a:"You're welcome"},
  "ขอโทษครับ":{q:"Excuse me",a:"No problem"},
  "สวัสดีครับ สบายดีไหม":{q:"Hello, how are you?",a:"I'm fine, thank you"},
  "คุณไปไหน":{q:"Where are you going?",a:"I'm going to the restaurant"},
  "เขามีอะไร":{q:"What does he have?",a:"He has a book"},
  "เรากินอะไร":{q:"What do we eat?",a:"We eat pad thai"},
  "พวกเขาชอบอะไร":{q:"What do they like?",a:"They like to eat vegetables"},
  "คุณอยากไปไหม":{q:"Do you want to go?",a:"Yes, I want to go"},
  "คุณจะกินอะไร":{q:"What are you going to eat?",a:"I'm going to eat chicken fried rice"},
  "เขาเป็นคนไทยไหม":{q:"Is he Thai?",a:"No, he's Spanish"},
  "คุณชอบกินไหม":{q:"Do you like to eat?",a:"Yes, I like eating a lot"},
  "คุณมีเวลาไหม":{q:"Do you have time?",a:"No, I have to go"},
  "อาหารอร่อยไหม":{q:"Is the food delicious?",a:"Very delicious!"},
  "เผ็ดไหม":{q:"Is it spicy?",a:"Very spicy!"},
  "คุณชอบหวานไหม":{q:"Do you like sweet?",a:"No, I like salty"},
  "ผลไม้หวานไหม":{q:"Is the fruit sweet?",a:"Very sweet and delicious"},
  "คุณเอาอะไร":{q:"What would you like?",a:"I'd like pad thai"},
  "มีอาหารอะไร":{q:"What food is there?",a:"There's rice, chicken, fish"},
  "อยากกินไก่ไหม":{q:"Do you want to eat chicken?",a:"No chicken, I want pork"},
  "คุณกินผักไหม":{q:"Do you eat vegetables?",a:"Yes, I like vegetables a lot"},
  "มีน้ำไหม":{q:"Is there water?",a:"Yes, cold or hot water"},
  "คุณกินข้าวกี่จาน":{q:"How many plates of rice do you eat?",a:"I eat two plates of rice"},
  "เบอร์โทรคุณหมายเลขอะไร":{q:"What's your phone number?",a:"One, two, three, four, five"},
  "มีไก่กี่ตัว":{q:"How many chickens are there?",a:"There are five chickens"},
  "ผลไม้เท่าไหร่":{q:"How much is the fruit?",a:"Fifty baht"},
  "คุณชื่ออะไร":{q:"What's your name?",a:"My name is..."},
  "ห้องน้ำอยู่ที่ไหน":{q:"Where's the bathroom?",a:"The bathroom is here"},
  "คุณมาจากที่ไหน":{q:"Where do you come from?",a:"I come from Spain"},
  "อาหารอะไรอร่อย":{q:"What food is delicious?",a:"Pad thai is very delicious"},
  "ร้านอาหารอยู่ที่ไหน":{q:"Where's the restaurant?",a:"The restaurant is here"},
  "คุณไปร้านกาแฟไหม":{q:"Are you going to the café?",a:"Yes, I'm going for coffee"},
  "หนังสือเล่มนี้ดีไหม":{q:"Is this book good?",a:"Very good, I like it"},
  "คุณมีหนังสือไหม":{q:"Do you have a book?",a:"Yes, I have one book"},
  // Lesson 3
  "คุณพูดไทยได้ไหม":{q:"Can you speak Thai?",a:"I can speak Thai a little"},
  "คุณทำอาหารได้ไหม":{q:"Can you cook?",a:"I can cook Thai food"},
  "คุณฟังไทยได้ไหม":{q:"Can you understand Thai?",a:"I can understand a little"},
  "ครูสอนอะไร":{q:"What does the teacher teach?",a:"The teacher teaches Thai"}
};

function getEn(item) {
  if (item.type === 'pair') return THAI_EN[item.w1.thai] + ' / ' + THAI_EN[item.w2.thai];
  if (item.type === 'conversation') {
    var en = CONV_EN[item.q_thai];
    return en ? en.q + ' → ' + en.a : item.q_spanish + ' → ' + item.a_spanish;
  }
  if (item.type === 'phrase') return PHRASE_EN[item.thai] || item.spanish;
  return THAI_EN[item.thai] || item.spanish;
}

function renderTone(toneStr, highlight) {
  if (!toneStr) return '';
  return toneStr.split('-').map(function(t) {
    var info = TONES[t];
    if (!info) return '';
    var hl = highlight && t === highlight;
    var style = hl
      ? 'color:' + info.color + ';font-size:1.05rem;text-decoration:underline;text-underline-offset:3px'
      : 'color:' + (highlight ? '#555' : info.color);
    return '<span style="' + style + '"><span class="tone-symbol">' + info.symbol + '</span> ' + (hl ? '' : info.name) + '</span>';
  }).join('  ');
}

function $(id) { return document.getElementById(id); }
