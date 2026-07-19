// Word-breakdown dictionary + segmentation. Ported line-for-line from
// public/ui.js:201-852. Preserves the build/translate/render semantics so
// renderWB output stays byte-identical (cards + dashboard + questions modes
// snapshot the structure).
//
// The original code:
//   - builds WORD_DICT lazily from DATA.words + a hard-coded `extras` table;
//   - translateWords() does greedy longest-match segmentation, skipping
//     ASCII chars and a small punctuation set;
//   - renderWB() wraps each segment in `.wb > .wb-i > (.wb-t, .wb-ph, .wb-s)`.
//
// The extras object is large (~600 entries) and was hand-curated; porting
// it verbatim is the only way to keep segmentation byte-identical.

import { getAppData } from '../data/loader';
import { THAI_EN } from '../format';

export interface WordDictEntry {
  ph: string;
  en: string;
}

export type WordDict = Record<string, WordDictEntry>;

export interface TranslatedWord {
  thai: string;
  ph: string;
  en: string;
}

// Module-level cache mirrors the original WORD_DICT singleton. The first
// call to buildWordDict() populates it; later calls return the cached ref.
let WORD_DICT: WordDict | null = null;

// Hand-curated extras table. Public/ui.js lines 206-815. Preserved verbatim
// — every duplicate key in the original literal stays a duplicate (JS
// object literals dedupe at parse time with last-wins, which we mimic by
// writing each entry once on its own key).
const EXTRAS: WordDict = {
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
  'อร่อย': { ph: 'a-roi', en: 'delicious' },
  'ผัดไทย': { ph: 'pat-tai', en: 'pad thai' },
  'แม่ค้า': { ph: 'me-kha', en: 'vendor' },
  'รถเมล์': { ph: 'rot-me', en: 'bus' },
  'ดูทีวี': { ph: 'du-ti-vi', en: 'watch TV' },
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
  'บ้าน': { ph: 'ban', en: 'house/home' },
  'แม่': { ph: 'mae', en: 'mother' },
  'พ่อ': { ph: 'pho', en: 'father' },
  'พี่': { ph: 'phi', en: 'older sibling' },
  'น้อง': { ph: 'nong', en: 'younger sibling' },
  'เพื่อน': { ph: 'peuan', en: 'friend' },
  'ครู': { ph: 'kru', en: 'teacher' },
  'หมอ': { ph: 'mor', en: 'doctor' },
  // Places & things
  'โต๊ะ': { ph: 'to', en: 'table' },
  'เก้าอี้': { ph: 'kao-i', en: 'chair' },
  'ร้าน': { ph: 'ran', en: 'shop' },
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
  'ชา': { ph: 'cha', en: 'tea' },
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
  'อีก': { ph: 'ik', en: 'again/more' },
  'ก็': { ph: 'ko', en: 'then/also' },
  'แต่': { ph: 'tae', en: 'but' },
  'ถ้า': { ph: 'tha', en: 'if' },
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
  'ฟัง': { ph: 'fang', en: 'to listen' },
  'พูด': { ph: 'phut', en: 'to speak' },
  'อ่าน': { ph: 'an', en: 'to read' },
  'เขียน': { ph: 'khian', en: 'to write' },
  // Prepositions
  'ใน': { ph: 'nai', en: 'in/inside' },
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
  'ทำ': { ph: 'tam', en: 'to do/make' },
  'ไป': { ph: 'pai', en: 'to go' },
  'มา': { ph: 'ma', en: 'to come' },
  'เข้า': { ph: 'khao', en: 'to enter' },
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
  'เมื่อไหร่': { ph: 'muea-rai', en: 'when?' },
  'ทำไม': { ph: 'tham-mai', en: 'why?' },
  'อย่างไร': { ph: 'yang-rai', en: 'how?' },
  // Polite particles (very high frequency in Q&A)
  'ครับ': { ph: 'kráp', en: 'polite particle (m)' },
  'ค่ะ': { ph: 'khâ', en: 'polite particle (f)' },
  'คะ': { ph: 'khá', en: 'polite particle (f, question)' },
  'นะคะ': { ph: 'ná khá', en: 'polite softener (f)' },
  'นะครับ': { ph: 'ná kráp', en: 'polite softener (m)' },
  'เจ้าคะ': { ph: 'jao-khá', en: 'polite particle (formal, f)' },
  'เจ้า': { ph: 'jao', en: 'polite/classifier' },
  // Time
  'วันนี้': { ph: 'wan-nîi', en: 'today' },
  'เมื่อวานนี้': { ph: 'müea-waan-nîi', en: 'yesterday' },
  'พรุ่งนี้': { ph: 'phrûng-nîi', en: 'tomorrow' },
  'มะรืน': { ph: 'ma-rüen', en: 'day after tomorrow' },
  'มะรืนนี้': { ph: 'ma-rüen-nîi', en: 'day after tomorrow' },
  'วันที่': { ph: 'wan-thîi', en: 'date' },
  'ทุกวัน': { ph: 'thúk-wan', en: 'every day' },
  'ทุกคืน': { ph: 'thúk-kheuen', en: 'every night' },
  'ทุกเช้า': { ph: 'thúk-cháao', en: 'every morning' },
  'คืน': { ph: 'kheuen', en: 'night' },
  'เช้า': { ph: 'cháao', en: 'morning' },
  'กี่โมง': { ph: 'kii-mong', en: 'what time?' },
  'โมง': { ph: 'mong', en: "o'clock (hour)" },
  'โมงครึ่ง': { ph: 'mong-khrűen', en: 'half past hour' },
  'โมงคะ': { ph: 'mong-khá', en: "o'clock (polite)" },
  'บ่ายโมง': { ph: 'bàai-mong', en: '1 p.m.' },
  'บ่ายสามโมง': { ph: 'bàai-sǎam-mong', en: '3 p.m.' },
  'บ่ายสามโมงครึ่ง': { ph: 'bàai-sǎam-mong-khrűen', en: '3:30 p.m.' },
  'สามโมง': { ph: 'sǎam-mong', en: '9 a.m.' },
  'สองโมง': { ph: 'sǎawng-mong', en: '8 a.m.' },
  'เที่ยงคืน': { ph: 'thìang-kheuen', en: 'midnight' },
  'เที่ยงวัน': { ph: 'thìang-wan', en: 'noon' },
  'ตอนเช้า': { ph: 'dton-cháao', en: 'in the morning' },
  'ตอนบ่าย': { ph: 'dton-bàai', en: 'in the afternoon' },
  'ตอนค่ำ': { ph: 'dton-khàm', en: 'in the evening' },
  'ตอนนี้': { ph: 'dton-nîi', en: 'now' },
  'เดี๋ยวนี้': { ph: 'dǐao-nîi', en: 'right now' },
  'นาที': { ph: 'naa-thîi', en: 'minute' },
  'ชั่วโมง': { ph: 'chùa-mong', en: 'hour' },
  'เดือน': { ph: 'duean', en: 'month' },
  'ปี': { ph: 'bpii', en: 'year' },
  'สัปดาห์': { ph: 'sàp-daa', en: 'week' },
  'เมื่อกี้': { ph: 'müea-gîi', en: 'just now' },
  // Days of week (full forms with วัน)
  'วันอาทิตย์': { ph: 'wan-aa-thít', en: 'Sunday' },
  'วันจันทร์': { ph: 'wan-jan', en: 'Monday' },
  'วันอังคาร': { ph: 'wan-ang-kaan', en: 'Tuesday' },
  'วันพุธ': { ph: 'wan-phút', en: 'Wednesday' },
  'วันพฤหัส': { ph: 'wan-phrúe-hàt', en: 'Thursday (short)' },
  'วันพฤหัสบดี': { ph: 'wan-phrúe-hàt-sà-bor-dii', en: 'Thursday' },
  'วันศุกร์': { ph: 'wan-sùk', en: 'Friday' },
  'วันเสาร์': { ph: 'wan-sao', en: 'Saturday' },
  // Weather / nature
  'อากาศ': { ph: 'aa-gàat', en: 'weather / atmosphere' },
  'หนาว': { ph: 'nǎao', en: 'cold' },
  'ร้อน': { ph: 'rón', en: 'hot' },
  'ฝน': { ph: 'fǒn', en: 'rain' },
  'ฝนตก': { ph: 'fǒn-dtòk', en: 'raining' },
  'หิมะ': { ph: 'hì-má', en: 'snow' },
  'หิมะตก': { ph: 'hì-má-dtòk', en: 'snowing' },
  'รุ้ง': { ph: 'rûeng', en: 'rainbow' },
  'พระอาทิตย์': { ph: 'phrá-aa-thít', en: 'sun' },
  'พระจันทร์': { ph: 'phrá-jan', en: 'moon' },
  'พระ': { ph: 'phrá', en: 'monk / royal prefix' },
  'ดวง': { ph: 'duang', en: 'classifier (sun/moon/star)' },
  'ดวงจันทร์': { ph: 'duang-jan', en: 'moon' },
  'ดวงอาทิตย์': { ph: 'duang-aa-thít', en: 'sun' },
  'ฤดู': { ph: 'ré-duu', en: 'season' },
  'ฤดูร้อน': { ph: 'ré-duu-ron', en: 'summer' },
  'ฤดูหนาว': { ph: 'ré-duu-nǎao', en: 'winter' },
  'ฤดูฝน': { ph: 'ré-duu-fǒn', en: 'rainy season' },
  'ฤดูใบไม้ผลิ': { ph: 'ré-duu-bai-mâi-phlì', en: 'spring' },
  'ฤดูใบไม้ร่วง': { ph: 'ré-duu-bai-mâi-rùang', en: 'autumn' },
  'องศา': { ph: 'ong-saai', en: 'degree' },
  'เซลเซียส': { ph: 'sel-siaat', en: 'Celsius' },
  'ประมาณ': { ph: 'prà-maan', en: 'approximately' },
  'ประเทศ': { ph: 'prà-thêet', en: 'country' },
  'ประเทศไทย': { ph: 'prà-thêet-thai', en: 'Thailand' },
  'กรุงเทพฯ': { ph: 'krung-thêep', en: 'Bangkok' },
  'กรุงเทพ': { ph: 'krung-thêep', en: 'Bangkok' },
  'ละแวก': { ph: 'lá-wâek', en: 'neighborhood' },
  'ละแวกบ้าน': { ph: 'lá-wâek-baan', en: 'neighborhood (around home)' },
  // Verbs
  'เคย': { ph: 'khoei', en: 'ever / have (past exp.)' },
  'ใช้': { ph: 'chái', en: 'to use' },
  'ใส่': { ph: 'sài', en: 'to wear / put on' },
  'เลือก': { ph: 'lûeak', en: 'to choose' },
  'ตื่น': { ph: 'dtùen', en: 'to wake up' },
  'ตื่นนอน': { ph: 'dtùen-non', en: 'to wake up (from sleep)' },
  'อาบ': { ph: 'àap', en: 'to bathe' },
  'อาบน้ำ': { ph: 'àap-náam', en: 'to take a shower' },
  'อาบน้ำใช้เวลา': { ph: 'àap-náam-chái-wee-laa', en: 'take a shower takes (time)' },
  'เตรียม': { ph: 'dtriiam', en: 'to prepare' },
  'เตรียมนอน': { ph: 'dtriiam-non', en: 'to get ready for bed' },
  'ขี่': { ph: 'khìi', en: 'to ride' },
  'เล่น': { ph: 'lên', en: 'to play' },
  'หั่น': { ph: 'hàn', en: 'to dice / cut' },
  'สับ': { ph: 'sàp', en: 'to chop / mince' },
  'ต้ม': { ph: 'dtom', en: 'to boil' },
  'ทอด': { ph: 'thôat', en: 'to deep-fry' },
  'ปิ้ง': { ph: 'pìng', en: 'to grill / roast' },
  'ผู้หญิง': { ph: 'phûu-yǐng', en: 'woman' },
  'ผู้ชาย': { ph: 'phûu-chaai', en: 'man' },
  'ผู้': { ph: 'phûu', en: 'person (prefix)' },
  'เสมอ': { ph: 'sà-moe', en: 'always' },
  'เงียบ': { ph: 'ngîap', en: 'quiet' },
  'สกปรก': { ph: 'sòk-pràp', en: 'dirty' },
  'สะอาด': { ph: 'sà-àat', en: 'clean' },
  'อาบน้ำใน': { ph: 'àap-náam-nai', en: 'bathe in' },
  // Body / fingers
  'นิ้วโป้ง': { ph: 'níu-pôong', en: 'thumb' },
  'นิ้วชี้': { ph: 'níu-chîi', en: 'index finger' },
  'นิ้วกลาง': { ph: 'níu-glaang', en: 'middle finger' },
  'นิ้วนาง': { ph: 'níu-naang', en: 'ring finger' },
  'นิ้วก้อย': { ph: 'níu-gôoi', en: 'pinky' },
  'ลิ้น': { ph: 'lín', en: 'tongue' },
  'ประสาทสัมผัส': { ph: 'prà-sàat-sàp-phàt', en: 'senses' },
  'ซี่': { ph: 'sîi', en: 'classifier (teeth)' },
  // Food / kitchen
  'ขนมปัง': { ph: 'khà-nǒm-pang', en: 'bread' },
  'ข้าวเหนียว': { ph: 'kâao-nǐao', en: 'sticky rice' },
  'เหนียว': { ph: 'nǐao', en: 'sticky' },
  'หมูปิ้ง': { ph: 'mǔu-pìng', en: 'grilled pork' },
  'ปาท่องโก๋': { ph: 'paa-thòng-goo', en: 'Chinese cruller / donut' },
  'โจ๊ก': { ph: 'jók', en: 'congee' },
  'ข้าวต้ม': { ph: 'kâao-dtom', en: 'rice soup' },
  'พิซซ่า': { ph: 'phít-sâa', en: 'pizza' },
  'รส': { ph: 'ròt', en: 'taste' },
  'รสชาติ': { ph: 'ròt-chàat', en: 'flavor' },
  'เกลือ': { ph: 'kluea', en: 'salt' },
  'น้ำตาล': { ph: 'náam-taan', en: 'sugar' },
  'เค็ม': { ph: 'khem', en: 'salty' },
  'หวาน': { ph: 'wǎan', en: 'sweet' },
  'เปรี้ยว': { ph: 'prìao', en: 'sour' },
  'เผ็ด': { ph: 'phèt', en: 'spicy' },
  'เปรี้ยวจี๊ด': { ph: 'prìao-jîit', en: 'very sour' },
  'น้ำมัน': { ph: 'náam-man', en: 'oil' },
  'เตา': { ph: 'tao', en: 'stove' },
  'ตู้เย็น': { ph: 'dtûu-yen', en: 'fridge' },
  'ตู้': { ph: 'dtûu', en: 'cabinet' },
  'ช้อน': { ph: 'chón', en: 'spoon' },
  'ส้อม': { ph: 'sôoi', en: 'fork' },
  'หม้อ': { ph: 'mǒe', en: 'pot' },
  'ห่อ': { ph: 'hòr', en: 'to wrap / bundle' },
  'แผ่น': { ph: 'phàaen', en: 'classifier (flat items)' },
  // Bedroom / furniture
  'ห้องนอน': { ph: 'hǒng-non', en: 'bedroom' },
  'เตียง': { ph: 'tiang', en: 'bed' },
  'เตียงนอน': { ph: 'tiang-non', en: 'bed (for sleeping)' },
  'หมอน': { ph: 'mǒn', en: 'pillow' },
  'ใบ': { ph: 'bai', en: 'classifier (leaves/papers)' },
  'ตู้เสื้อผ้า': { ph: 'dtûu-sûea-phâa', en: 'wardrobe' },
  'เสื้อผ้า': { ph: 'sûea-phâa', en: 'clothes' },
  'เสื้อยืด': { ph: 'sûea-yǔeut', en: 't-shirt' },
  'เสื้อ': { ph: 'sûea', en: 'shirt' },
  'ผ้า': { ph: 'phâa', en: 'cloth' },
  'กางเกง': { ph: 'gaang-geng', en: 'pants' },
  'กางเกงขาสั้น': { ph: 'gaang-geng-khǎa-sân', en: 'shorts' },
  'กางเกงขายาว': { ph: 'gaang-geng-khǎa-yaao', en: 'long pants' },
  'ขาสั้น': { ph: 'khǎa-sân', en: 'short leg' },
  'ขายาว': { ph: 'khǎa-yaao', en: 'long leg' },
  'รองเท้า': { ph: 'rong-tháo', en: 'shoes' },
  'รองเท้าผ้าใบ': { ph: 'rong-tháo-phâa-bai', en: 'sneakers' },
  'รองเท้าแตะ': { ph: 'rong-tháo-dtàe', en: 'slippers / flip-flops' },
  'ผ้าใบ': { ph: 'phâa-bai', en: 'canvas' },
  'แตะ': { ph: 'dtàe', en: 'to touch / tap' },
  'แว่นตา': { ph: 'wâen-taa', en: 'glasses' },
  'แว่น': { ph: 'wâen', en: 'glasses' },
  'แปรงสีฟัน': { ph: 'bprèng-sǐi-fan', en: 'toothbrush' },
  'แปรง': { ph: 'bprèng', en: 'brush' },
  'สีฟัน': { ph: 'sǐi-fan', en: 'toothpaste' },
  'หวี': { ph: 'wǐi', en: 'comb' },
  'ลิปสติก': { ph: 'líp-sà-dtìk', en: 'lipstick' },
  'อ่าง': { ph: 'àang', en: 'basin / sink' },
  'อ่างอาบน้ำ': { ph: 'àang-àap-náam', en: 'bathtub' },
  // Shapes
  'รูป': { ph: 'rûup', en: 'picture / shape' },
  'วงกลม': { ph: 'wong-glon', en: 'circle' },
  'เหลี่ยม': { ph: 'lìeam', en: 'polygon / shape' },
  'สามเหลี่ยม': { ph: 'sǎam-lìeam', en: 'triangle' },
  'สี่เหลี่ยม': { ph: 'sǐi-lìeam', en: 'quadrilateral' },
  'สี่เหลี่ยมผืนผ้า': { ph: 'sǐi-lìeam-phrǔen-phâa', en: 'rectangle' },
  'เหลี่ยมผืนผ้า': { ph: 'lìeam-phrǔen-phâa', en: 'rectangle' },
  'ผืนผ้า': { ph: 'phrǔen-phâa', en: 'rectangular shape' },
  'มุม': { ph: 'mum', en: 'corner / angle' },
  // Animals (cthai)
  'สัตว์': { ph: 'sàt', en: 'animal' },
  'กระต่าย': { ph: 'grà-dtàai', en: 'rabbit' },
  'ช้าง': { ph: 'cháang', en: 'elephant' },
  'ม้า': { ph: 'máa', en: 'horse' },
  'กบ': { ph: 'gòp', en: 'frog' },
  // Transport
  'เครื่องบิน': { ph: 'khrûeang-bin', en: 'airplane' },
  'รถไฟ': { ph: 'rót-fai', en: 'train' },
  'เรือ': { ph: 'ruea', en: 'boat' },
  'จักรยาน': { ph: 'jàk-khrà-yaan', en: 'bicycle' },
  'นั่งรถไฟ': { ph: 'nâng-rót-fai', en: 'take the train' },
  'นั่งเครื่องบิน': { ph: 'nâng-khrûeang-bin', en: 'take a plane' },
  'นั่งเรือ': { ph: 'nâng-ruea', en: 'take a boat' },
  'ขี่ม้า': { ph: 'khìi-máa', en: 'ride a horse' },
  'ขี่ช้าง': { ph: 'khìi-cháang', en: 'ride an elephant' },
  'ขึ้นต้นไม้': { ph: 'khǔen-dton-máai', en: 'climb a tree' },
  'ต้นไม้': { ph: 'dton-máai', en: 'tree / plant' },
  'เล่นสกี': { ph: 'lên-sà-gǐi', en: 'ski' },
  'สกี': { ph: 'sà-gǐi', en: 'ski' },
  // Classroom
  'ครูฟ้า': { ph: 'khrúu-fáa', en: 'Teacher Fah (host)' },
  'ฟ้า': { ph: 'fáa', en: 'sky / blue / Fah (name)' },
  'หน้าปัด': { ph: 'nâa-bpàt', en: 'clock face' },
  'นาฬิกา': { ph: 'naa-lí-gaa', en: 'clock' },
  'เข็ม': { ph: 'khěm', en: 'hand (of clock) / needle' },
  'เข็มสั้น': { ph: 'khěm-sân', en: 'short hand (hour)' },
  'เข็มยาว': { ph: 'khěm-yaao', en: 'long hand (minute)' },
  // Question / linking words
  'คือ': { ph: 'kheue', en: 'to be (is / equals)' },
  'เรียก': { ph: 'rîak', en: 'to call' },
  'เรียกว่า': { ph: 'rîak-wâa', en: 'is called' },
  'ทำจาก': { ph: 'tam-jaak', en: 'made of / from' },
  'เหมือนกัน': { ph: 'mǔean-gan', en: 'same / alike' },
  'เหมือน': { ph: 'mǔean', en: 'same / like' },
  'ต่างกัน': { ph: 'dtàang-gan', en: 'different' },
  'ต่าง': { ph: 'dtàang', en: 'different' },
  'ยังไง': { ph: 'yang-ngai', en: 'how (colloquial)' },
  'ที่สุด': { ph: 'thîi-sùt', en: 'the most' },
  'สุด': { ph: 'sùt', en: 'most / end' },
  'แบบ': { ph: 'bàaep', en: 'type / style' },
  'เอา': { ph: 'ao', en: 'to take / want' },
  'ได้': { ph: 'dâai', en: 'can / to get' },
  'ไม่ได้': { ph: 'mâi-dâai', en: 'cannot' },
  'หน่อย': { ph: 'nòi', en: 'a little (with verb)' },
  'ค่าเช่า': { ph: 'kâa-chào', en: 'rent' },
  'กิโล': { ph: 'gì-loo', en: 'kilogram' },
  'ละ': { ph: 'lá', en: 'per (unit price)' },
  // Place / direction
  'ตะวันออก': { ph: 'dtà-wan-òok', en: 'east' },
  'ตะวันตก': { ph: 'dtà-wan-dtòk', en: 'west' },
  'เหนือ': { ph: 'nǔea', en: 'north' },
  'ตะวันออกเฉียงเหนือ': { ph: 'dtà-wan-òok-chìang-nǔea', en: 'northeast' },
  'ตะวันออกเฉียงใต้': { ph: 'dtà-wan-òok-chìang-dtâai', en: 'southeast' },
  'ตะวันตกเฉียงเหนือ': { ph: 'dtà-wan-dtòk-chìang-nǔea', en: 'northwest' },
  'ตะวันตกเฉียงใต้': { ph: 'dtà-wan-dtòk-chìang-dtâai', en: 'southwest' },
  'เฉียง': { ph: 'chìang', en: 'inclined' },
  'ทิศ': { ph: 'thît', en: 'direction' },
  'ออก': { ph: 'òok', en: 'exit / east' },
  'ตะวัน': { ph: 'dtà-wan', en: 'sun' },
  // Misc common
  'อะไรคะ': { ph: 'a-rai-khá', en: 'what? (polite)' },
  'วันอะไร': { ph: 'wan-a-rai', en: 'what day' },
  'วันอะไรคะ': { ph: 'wan-a-rai-khá', en: 'what day? (polite f)' },
  'เป็นยังไง': { ph: 'bpen-yang-ngai', en: 'how is / how about' },
  'กี่ขา': { ph: 'kii-khǎa', en: 'how many legs' },
  'กี่ตู้': { ph: 'kii-dtûu', en: 'how many cabinets' },
  'กี่แผ่น': { ph: 'kii-phàaen', en: 'how many slices' },
  'กี่โมงคะ': { ph: 'kii-mong-khá', en: 'what time? (polite)' },
  'กี่นาที': { ph: 'kii-naa-thîi', en: 'how many minutes' },
  'กี่ชั่วโมง': { ph: 'kii-chùa-mong', en: 'how many hours' },
  'กี่ซี่': { ph: 'kii-sîi', en: 'how many (teeth)' },
  'กี่มุม': { ph: 'kii-mum', en: 'how many corners' },
  'กี่แบบ': { ph: 'kii-bàaep', en: 'how many types' },
  'กี่ดวง': { ph: 'kii-duang', en: 'how many (celestial)' },
  'กี่เข็ม': { ph: 'kii-khěm', en: 'how many hands (clock)' },
  'กี่อย่าง': { ph: 'kii-yàang', en: 'how many kinds' },
  'กี่ครั้ง': { ph: 'kii-khráng', en: 'how many times' },
  'กี่เดือน': { ph: 'kii-duean', en: 'how many months' },
  'กี่ปี': { ph: 'kii-bpii', en: 'how many years' },
  'อย่าง': { ph: 'yàang', en: 'kind / sort' },
  'ที่กรุงเทพฯ': { ph: 'thîi-krung-thêep', en: 'in Bangkok' },
  'ที่ไทย': { ph: 'thîi-thai', en: 'in Thailand' },
  'เป็นเดือนที่': { ph: 'bpen-duean-thîi', en: 'is month number' },
  'ห้าเดือน': { ph: 'hâa-duean', en: 'five months' },
  'หกเดือน': { ph: 'hòk-duean', en: 'six months' },
  'ท้อง': { ph: 'thóng', en: 'pregnant' },
  // Second pass — remaining high-frequency
  'ทีวี': { ph: 'thii-vii', en: 'TV' },
  'ที่วี': { ph: 'thîi-vii', en: 'TV (alt)' },
  'รู้': { ph: 'rúu', en: 'to know' },
  'ไม่รู้': { ph: 'mâi-rúu', en: "don't know" },
  'เยอะ': { ph: 'yø', en: 'a lot / many' },
  'ต่อ': { ph: 'dtòr', en: 'per' },
  'ต่อวัน': { ph: 'dtòr-wan', en: 'per day' },
  'สบู่': { ph: 'sà-bùu', en: 'soap' },
  'สบู่ก้อน': { ph: 'sà-bùu-gòrn', en: 'bar soap' },
  'สบู่เหลว': { ph: 'sà-bùu-lǎao', en: 'liquid soap' },
  'ก้อน': { ph: 'gòrn', en: 'lump / bar' },
  'เหลว': { ph: 'lǎao', en: 'liquid' },
  'ท่วม': { ph: 'thùam', en: 'flood' },
  'น้ำท่วม': { ph: 'náam-thùam', en: 'floodwater' },
  'เละ': { ph: 'lé', en: 'mushy / soggy' },
  'เม็ด': { ph: 'mét', en: 'grain / seed' },
  'ยังเป็น': { ph: 'yang-bpen', en: 'still is' },
  'เพราะ': { ph: 'phró', en: 'because' },
  'เดือนมกราคม': { ph: 'duean-mók-kraa-khom', en: 'January' },
  'เดือนกุมภาพันธ์': { ph: 'duean-gum-phaa-phan', en: 'February' },
  'เดือนมีนาคม': { ph: 'duean-mii-naa-khom', en: 'March' },
  'เดือนเมษายน': { ph: 'duean-mee-saa-yon', en: 'April' },
  'เดือนพฤษภาคม': { ph: 'duean-phrút-sà-phaa-khom', en: 'May' },
  'เดือนมิถุนายน': { ph: 'duean-mí-thù-naa-yon', en: 'June' },
  'เดือนกรกฎาคม': { ph: 'duean-gor-rá-kà-daa-khom', en: 'July' },
  'เดือนสิงหาคม': { ph: 'duean-sǐng-hǎa-khom', en: 'August' },
  'เดือนกันยายน': { ph: 'duean-kan-yaa-yon', en: 'September' },
  'เดือนตุลาคม': { ph: 'duean-dtu-laa-khom', en: 'October' },
  'เดือนพฤศจิกายน': { ph: 'duean-phrút-sà-jì-gaa-yon', en: 'November' },
  'เดือนธันวาคม': { ph: 'duean-than-waa-khom', en: 'December' },
  'มกราคม': { ph: 'mók-kraa-khom', en: 'January' },
  'กุมภาพันธ์': { ph: 'gum-phaa-phan', en: 'February' },
  'มีนาคม': { ph: 'mii-naa-khom', en: 'March' },
  'เมษายน': { ph: 'mee-saa-yon', en: 'April' },
  'พฤษภาคม': { ph: 'phrút-sà-phaa-khom', en: 'May' },
  'มิถุนายน': { ph: 'mí-thù-naa-yon', en: 'June' },
  'กรกฎาคม': { ph: 'gor-rá-kà-daa-khom', en: 'July' },
  'สิงหาคม': { ph: 'sǐng-hǎa-khom', en: 'August' },
  'กันยายน': { ph: 'kan-yaa-yon', en: 'September' },
  'ตุลาคม': { ph: 'dtu-laa-khom', en: 'October' },
  'พฤศจิกายน': { ph: 'phrút-sà-jì-gaa-yon', en: 'November' },
  'ธันวาคม': { ph: 'than-waa-khom', en: 'December' },
};

/**
 * Builds (and caches) the word-breakdown dictionary. Reads DATA.words via
 * the typed loader (window.DATA, seeded by loader.ts) and merges with the
 * hard-coded extras. Mirrors public/ui.js:202-819 — only extras that
 * aren't already present in DATA.words get added (the original `if (!d[k])`
 * guard is preserved so DATA.words entries always win).
 */
export function buildWordDict(): WordDict {
  if (WORD_DICT) return WORD_DICT;
  const d: WordDict = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = (typeof window !== 'undefined' ? (window as any) : {}) as Record<string, any>;
  const data = w.DATA ?? getAppData();
  const words = (data?.words ?? []) as Array<{
    thai: string;
    es?: string;
    phonetic?: string;
    spanish?: string;
  }>;
  words.forEach(function (word) {
    d[word.thai] = {
      ph: word.es || word.phonetic || '',
      en: THAI_EN[word.thai] || word.spanish || '',
    };
  });
  Object.keys(EXTRAS).forEach(function (k) {
    if (!d[k]) d[k] = EXTRAS[k];
  });
  WORD_DICT = d;
  return d;
}

/**
 * Greedy longest-match segmentation of a Thai string. Skips ASCII chars
 * (0x41–0x7A), spaces, and a small set of punctuation, exactly like
 * public/ui.js:821-843.
 */
export function translateWords(thaiStr: string): TranslatedWord[] {
  const dict = buildWordDict();
  const keys = Object.keys(dict).sort(function (a, b) {
    return b.length - a.length;
  });
  const result: TranslatedWord[] = [];
  let i = 0;
  while (i < thaiStr.length) {
    const ch = thaiStr.charCodeAt(i);
    if (
      thaiStr[i] === ' ' ||
      thaiStr[i] === '.' ||
      thaiStr[i] === ',' ||
      thaiStr[i] === '!' ||
      thaiStr[i] === '?' ||
      thaiStr[i] === '…' ||
      (ch >= 0x0041 && ch <= 0x007a)
    ) {
      i++;
      continue;
    }
    let found = false;
    for (let k = 0; k < keys.length; k++) {
      if (thaiStr.indexOf(keys[k], i) === i) {
        const entry = dict[keys[k]];
        result.push({ thai: keys[k], ph: entry.ph, en: entry.en });
        i += keys[k].length;
        found = true;
        break;
      }
    }
    if (!found) {
      i++;
    }
  }
  return result;
}

/**
 * Renders the word-breakdown HTML for a Thai string. Empty string in,
 * empty string out. Mirrors public/ui.js:845-852 — output is byte-identical.
 */
export function renderWB(thaiStr: string): string {
  const words = translateWords(thaiStr);
  if (!words.length) return '';
  return (
    '<div class="wb">' +
    words
      .map(function (word) {
        return (
          '<span class="wb-i"><span class="wb-t">' +
          word.thai +
          '</span><span class="wb-ph">' +
          word.ph +
          '</span><span class="wb-s">' +
          word.en +
          '</span></span>'
        );
      })
      .join('') +
    '</div>'
  );
}

/** Test-only helper: resets the singleton cache between tests. */
export function __resetWordDictForTests(): void {
  WORD_DICT = null;
}
