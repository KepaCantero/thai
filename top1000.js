// Top 1000 Thai words by frequency (Chulalongkorn University corpus)
// Source: https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Thai_Chula
// Schema: { rank, thai, es (phonetic ES with tone marks), spanish, english, rtgs, cefr, freq, notes, category, tone, phrase, question, answer }
// Legacy nested phrase/question/answer are preserved; new phrase bank lives in TOP1000_PHRASES.

var TOP1000_WORDS = [
  {
    rank: 1, thai: "ที่", es: "tîi", spanish: "que / lugar", english: "that / place", rtgs: "", cefr: null, freq: 1, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "บ้านที่ฉันอยู่", es: "bâan thîi chǎn yùu", spanish: "la casa donde vivo, en: "the house where I live" },
    question: { thai: "ที่คือใคร", es: "tîi khuu khrai", spanish: "¿Quién es que?" },
    answer: { thai: "ที่", es: "tîi", spanish: "que / lugar" }
  },
  {
    rank: 2, thai: "การ", es: "gaan", spanish: "acción / suf. -ción", english: "action / -ing", rtgs: "", cefr: null, freq: 2, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "การดี", es: "gaan dii", spanish: "acción / suf. -ción bueno" },
    question: { thai: "มีการไหม", es: "mii gaan mǎi", spanish: "¿Hay acción?" },
    answer: { thai: "มีการ", es: "mii gaan", spanish: "Sí, hay" }
  },
  {
    rank: 3, thai: "เป็น", es: "pen", spanish: "ser / estar", english: "to be", rtgs: "", cefr: null, freq: 3, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเป็นครู", es: "chǎn pen khruu", spanish: "Soy profesor" },
    question: { thai: "คุณเป็นครูใช่ไหม", es: "khun pen khruu châi mǎi", spanish: "¿Eres profesor?" },
    answer: { thai: "ใช่ ฉันเป็นครู", es: "châi chǎn pen khruu", spanish: "Sí, soy profesor" }
  },
  {
    rank: 4, thai: "ใน", es: "nai", spanish: "en / dentro de", english: "in", rtgs: "", cefr: null, freq: 4, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "อยู่ในบ้าน", es: "yùu nai bâan", spanish: "estar en casa", en: "be in the house" },
    question: { thai: "คุณอยู่ในบ้านไหม", es: "khun yùu nai bâan mǎi", spanish: "¿Estás en casa?", en: "Are you in the house?" },
    answer: { thai: "ใช่ อยู่ในบ้าน", es: "châi, yùu nai bâan", spanish: "Sí, estoy en casa", en: "Yes, I'm in the house" }
  },
  {
    rank: 5, thai: "จะ", es: "jà", spanish: "futuro", english: "will", rtgs: "", cefr: null, freq: 5, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "พรุ่งนี้ฉันจะไป", es: "prùng-níi chǎn jà bpai", spanish: "mañana iré", en: "tomorrow I will go" },
    question: { thai: "พรุ่งนี้คุณจะไปไหม", es: "prùng-níi khun jà bpai mǎi", spanish: "¿Irás mañana?", en: "Will you go tomorrow?" },
    answer: { thai: "จะไป", es: "jà bpai", spanish: "iré", en: "I will go" }
  },
  {
    rank: 6, thai: "มี", es: "mii", spanish: "tener / haber", english: "to have", rtgs: "", cefr: null, freq: 6, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันมีรถ", es: "chǎn mii rót", spanish: "Tengo coche" },
    question: { thai: "คุณมีเวลาไหม", es: "khun mii welaa mǎi", spanish: "¿Tienes tiempo?" },
    answer: { thai: "มี ฉันมีเวลา", es: "mii chǎn mii welaa", spanish: "Sí, tengo tiempo" }
  },
  {
    rank: 7, thai: "ของ", es: "khǒɔŋ", spanish: "de (pertenencia)", english: "of", rtgs: "", cefr: null, freq: 7, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "นั่นรถของเขาเอง", es: "nân rót khǒng khǎo eeng", spanish: "ese es el coche de él", en: "that's his own car" },
    question: { thai: "รถคันนี้ของใคร", es: "ród kan níi khǒng khrai", spanish: "¿De quién es este coche?", en: "Whose car is this?" },
    answer: { thai: "ของเขา", es: "khǒng khǎo", spanish: "es suyo (de él)", en: "it's his" }
  },
  {
    rank: 8, thai: "ไม่", es: "mâi", spanish: "no", english: "not", rtgs: "", cefr: null, freq: 8, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "ฉันไม่ไป", es: "chǎn mâi bpai", spanish: "No voy" },
    question: { thai: "คุณไปไหม", es: "khun bpai mǎi", spanish: "¿Vas?" },
    answer: { thai: "ไม่ไป", es: "mâi bpai", spanish: "No voy" }
  },
  {
    rank: 9, thai: "และ", es: "lɛ́", spanish: "y", english: "and", rtgs: "", cefr: null, freq: 9, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "สวยและดี", es: "sǔuai lɛ́ dii", spanish: "hermoso y bueno, en: "beautiful and good" },
    question: { thai: "และ", es: "lɛ́", spanish: "y" },
    answer: { thai: "และ", es: "lɛ́", spanish: "y" }
  },
  {
    rank: 10, thai: "ได้", es: "dâai", spanish: "poder / obtener", english: "can / get", rtgs: "", cefr: null, freq: 10, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันได้", es: "chǎn dâai", spanish: "Yo puedo" },
    question: { thai: "คุณได้ไหม", es: "khun dâai mǎi", spanish: "¿Tú puedes?" },
    answer: { thai: "ได้", es: "dâai", spanish: "poder / obtener" }
  },
  {
    rank: 11, thai: "ว่า", es: "wâa", spanish: "que (conjunción)", english: "that (conjunction)", rtgs: "", cefr: null, freq: 11, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "เขาคิดว่าคุณมา", es: "khǎo kít wâa khun maa", spanish: "él piensa que tú vienes", en: "he thinks that you came" },
    question: { thai: "เขาบอกว่าอะไร", es: "khǎo bòok wâa a-rai", spanish: "¿Qué dijo él?", en: "What did he say?" },
    answer: { thai: "บอกว่าจะมา", es: "bòok wâa jà maa", spanish: "dijo que vendría", en: "he said he would come" }
  },
  {
    rank: 12, thai: "ไป", es: "bpai", spanish: "ir", english: "to go", rtgs: "", cefr: null, freq: 12, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันไปตลาด", es: "chǎn bpai dtà-làat", spanish: "Voy al mercado" },
    question: { thai: "คุณจะไปไหน", es: "khun jà bpai nǎi", spanish: "¿A dónde vas?" },
    answer: { thai: "ไปบ้าน", es: "bpai bâan", spanish: "Voy a casa" }
  },
  {
    rank: 13, thai: "ให้", es: "hâi", spanish: "dar / para", english: "to give", rtgs: "", cefr: null, freq: 13, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันให้", es: "chǎn hâi", spanish: "Yo doy" },
    question: { thai: "คุณให้ไหม", es: "khun hâi mǎi", spanish: "¿Tú das?" },
    answer: { thai: "ให้", es: "hâi", spanish: "dar / para" }
  },
  {
    rank: 14, thai: "มา", es: "maa", spanish: "venir", english: "to come", rtgs: "", cefr: null, freq: 14, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "เขามาแล้ว", es: "khǎo maa lɛ́ɛw", spanish: "Él ya vino" },
    question: { thai: "คุณมาจากไหน", es: "khun maa jàak nǎi", spanish: "¿De dónde vienes?" },
    answer: { thai: "มาจากสเปน", es: "maa jàak sà-pěen", spanish: "Vengo de España" }
  },
  {
    rank: 15, thai: "ก็", es: "gɔ̂ɔ", spanish: "pues / entonces", english: "then", rtgs: "", cefr: null, freq: 15, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ฝนตก ฉันก็ไม่ไป", es: "fǒn dtòk, chǎn gâ mâi bpai", spanish: "llueve, entonces no voy", en: "it's raining, so I won't go" },
    question: { thai: "ฝนตกจะไปไหม", es: "fǒn dtòk jà bpai mǎi", spanish: "¿Llueve, vas a ir?", en: "It's raining, will you go?" },
    answer: { thai: "ไม่ไป ฝนตกก็ไม่ไป", es: "mâi bpai, fǒn dtòk gâ mâi bpai", spanish: "no voy, si llueve no voy", en: "I won't, if it rains I won't go" }
  },
  {
    rank: 16, thai: "คน", es: "khon", spanish: "persona", english: "person", rtgs: "", cefr: null, freq: 16, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คนนี้ใจดี", es: "khon níi jai-dii", spanish: "Esta persona es amable" },
    question: { thai: "คนนั้นเป็นใคร", es: "khon nán pen khrai", spanish: "¿Quién es esa persona?" },
    answer: { thai: "เป็นเพื่อนฉัน", es: "pen phʉ̂an chǎn", spanish: "Es mi amigo" }
  },
  {
    rank: 17, thai: "ความ", es: "khwaam", spanish: "sustantivo abstracto", english: "abstract noun", rtgs: "", cefr: null, freq: 17, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ความดี", es: "khwaam dii", spanish: "sustantivo abstracto bueno" },
    question: { thai: "มีความไหม", es: "mii khwaam mǎi", spanish: "¿Hay sustantivo abstracto?" },
    answer: { thai: "มีความ", es: "mii khwaam", spanish: "Sí, hay" }
  },
  {
    rank: 18, thai: "แล้ว", es: "lɛ́ɛw", spanish: "ya / entonces", english: "already", rtgs: "", cefr: null, freq: 18, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ฉันกินข้าวแล้ว", es: "chǎn gin kâao lɛ́ɛo", spanish: "ya comí", en: "I've already eaten" },
    question: { thai: "คุณกินข้าวหรือยัง", es: "khun gin kâao rʉ̌ʉ yang", spanish: "¿Ya comiste?", en: "Have you eaten yet?" },
    answer: { thai: "กินแล้ว", es: "gin lɛ́ɛo", spanish: "ya comí", en: "I've already eaten" }
  },
  {
    rank: 19, thai: "กับ", es: "gàp", spanish: "con", english: "with", rtgs: "", cefr: null, freq: 19, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ฉันจะไปกับเธอ", es: "chǎn jà bpai gàp thər", spanish: "iré contigo", en: "I'll go with you" },
    question: { thai: "คุณไปกับใคร", es: "khun bpai gàp khrai", spanish: "¿Con quién vas?", en: "Who are you going with?" },
    answer: { thai: "ไปกับเพื่อน", es: "bpai gàp phʉ̂an", spanish: "voy con un amigo", en: "I'm going with a friend" }
  },
  {
    rank: 20, thai: "อยู่", es: "yùu", spanish: "estar (ubicarse)", english: "to be at", rtgs: "", cefr: null, freq: 20, notes: "",
    category: "verbos", tone: "n",
    phrase: { thai: "ฉันอยู่", es: "chǎn yùu", spanish: "Yo estoy (ubicarse)" },
    question: { thai: "คุณอยู่ไหม", es: "khun yùu mǎi", spanish: "¿Tú estás (ubicarse)?" },
    answer: { thai: "อยู่", es: "yùu", spanish: "estar (ubicarse)" }
  },
  {
    rank: 21, thai: "หรือ", es: "rǔɯ", spanish: "o / ¿...?", english: "or", rtgs: "", cefr: null, freq: 21, notes: "",
    category: "expresiones", tone: "r",
    phrase: { thai: "ชาหรือกาแฟ", es: "chaa rǔɯ gaa-fae", spanish: "¿té o café?, en: "tea or coffee?" },
    question: { thai: "หรือ", es: "rǔɯ", spanish: "o / ¿...?" },
    answer: { thai: "หรือ", es: "rǔɯ", spanish: "o / ¿...?" }
  },
  {
    rank: 22, thai: "กัน", es: "gan", spanish: "juntos / mutuamente", english: "together", rtgs: "", cefr: null, freq: 22, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เราไปด้วยกัน", es: "rao bpai dûuai gan", spanish: "vamos juntos", en: "we go together" },
    question: { thai: "ไปด้วยกันไหม", es: "bpai dûuai gan mǎi", spanish: "¿Vamos juntos?", en: "Shall we go together?" },
    answer: { thai: "ไปด้วยกัน", es: "bpai dûuai gan", spanish: "vamos juntos", en: "let's go together" }
  },
  {
    rank: 23, thai: "นี้", es: "níi", spanish: "este / esta", english: "this", rtgs: "", cefr: null, freq: 23, notes: "",
    category: "pronombres", tone: "h",
    phrase: { thai: "คนนี้ใจดี", es: "khon níi jai-dii", spanish: "esta persona es amable, en: "this person is kind" },
    question: { thai: "นี้คือใคร", es: "níi khuu khrai", spanish: "¿Quién es este?" },
    answer: { thai: "นี้", es: "níi", spanish: "este / esta" }
  },
  {
    rank: 24, thai: "แต่", es: "dtɛ̀ɛ", spanish: "pero", english: "but", rtgs: "", cefr: null, freq: 24, notes: "",
    category: "expresiones", tone: "l",
    phrase: { thai: "ดีแต่แพง", es: "dii dtɛ̀ɛ pɛɛng", spanish: "bueno pero caro, en: "good but expensive" },
    question: { thai: "แต่", es: "dtɛ̀ɛ", spanish: "pero" },
    answer: { thai: "แต่", es: "dtɛ̀ɛ", spanish: "pero" }
  },
  {
    rank: 25, thai: "จาก", es: "jàak", spanish: "de / desde", english: "from", rtgs: "", cefr: null, freq: 25, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ฉันมาจากสเปน", es: "chǎn maa jàak sà-pĕen", spanish: "vengo de España", en: "I come from Spain" },
    question: { thai: "คุณมาจากไหน", es: "khun maa jàak nǎi", spanish: "¿De dónde vienes?", en: "Where do you come from?" },
    answer: { thai: "มาจากสเปน", es: "maa jàak sà-pĕen", spanish: "vengo de España", en: "I come from Spain" }
  },
  {
    rank: 26, thai: "อย่าง", es: "yàaŋ", spanish: "como / manera", english: "like / way", rtgs: "", cefr: null, freq: 26, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "เขาพูดเร็วอย่างนั้น", es: "khǎo phûut reo yàang nán", spanish: "él habla así de rápido", en: "he speaks that fast" },
    question: { thai: "เขาพูดอย่างไร", es: "khǎo phûut yàang rai", spanish: "¿Cómo habla él?", en: "How does he speak?" },
    answer: { thai: "พูดเร็วมาก", es: "phûut reo mâak", spanish: "habla muy rápido", en: "he speaks very fast" }
  },
  {
    rank: 27, thai: "เขา", es: "khǎo", spanish: "él / ella", english: "he / she", rtgs: "", cefr: null, freq: 27, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "เขาเป็นเพื่อนฉัน", es: "khǎo pen phʉ̂an chǎn", spanish: "Él es mi amigo" },
    question: { thai: "เขามาไหม", es: "khǎo maa mǎi", spanish: "¿Viene él?" },
    answer: { thai: "เขามาแล้ว", es: "khǎo maa lɛ́ɛw", spanish: "Ya vino" }
  },
  {
    rank: 28, thai: "ต้อง", es: "dtɔ̂ɔŋ", spanish: "deber / tener que", english: "must", rtgs: "", cefr: null, freq: 28, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันต้อง", es: "chǎn dtɔ̂ɔŋ", spanish: "Yo debo" },
    question: { thai: "คุณต้องไหม", es: "khun dtɔ̂ɔŋ mǎi", spanish: "¿Tú debes?" },
    answer: { thai: "ต้อง", es: "dtɔ̂ɔŋ", spanish: "deber / tener que" }
  },
  {
    rank: 29, thai: "ด้วย", es: "dûai", spanish: "también / con", english: "also", rtgs: "", cefr: null, freq: 29, notes: "",
    category: "adverbios", tone: "n",
        phrase: { thai: "ฉันอยากไปด้วย", es: "chǎn yàak bpai dûuai", spanish: "yo también quiero ir", en: "I also want to go" },
    question: { thai: "คุณอยากไปด้วยไหม", es: "khun yàak bpai dûuai mǎi", spanish: "¿Quieres ir también?", en: "Do you also want to go?" },
    answer: { thai: "อยากไปด้วย", es: "yàak bpai dûuai", spanish: "sí, quiero ir también", en: "yes, I want to go too" }
  },
  {
    rank: 30, thai: "ขึ้น", es: "khʉ̂n", spanish: "subir", english: "to go up", rtgs: "", cefr: null, freq: 30, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันขึ้น", es: "chǎn khʉ̂n", spanish: "Yo subo" },
    question: { thai: "คุณขึ้นไหม", es: "khun khʉ̂n mǎi", spanish: "¿Tú subes?" },
    answer: { thai: "ขึ้น", es: "khʉ̂n", spanish: "subir" }
  },
  {
    rank: 31, thai: "นั้น", es: "nán", spanish: "ese / aquel", english: "that", rtgs: "", cefr: null, freq: 31, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "คนนั้นสูง", es: "khon nán sǔung", spanish: "esa persona es alta, en: "that person is tall" },
    question: { thai: "นั้นคือใคร", es: "nán khuu khrai", spanish: "¿Quién es ese?" },
    answer: { thai: "นั้น", es: "nán", spanish: "ese / aquel" }
  },
  {
    rank: 32, thai: "ผู้", es: "phûu", spanish: "persona (prefijo)", english: "person prefix", rtgs: "", cefr: null, freq: 32, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "ผู้ชาย", es: "phûu-chaai", spanish: "hombre (persona masculina), en: "man (male person)" },
    question: { thai: "ผู้คือใคร", es: "phûu khuu khrai", spanish: "¿Quién es persona (prefijo)?" },
    answer: { thai: "ผู้", es: "phûu", spanish: "persona (prefijo)" }
  },
  {
    rank: 33, thai: "ซึ่ง", es: "sʉ̂ŋ", spanish: "el cual", english: "which", rtgs: "", cefr: null, freq: 33, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "คนซึ่งมา", es: "khon sʉ̂ŋ maa", spanish: "la persona que vino, en: "the person who came" },
    question: { thai: "ซึ่งคือใคร", es: "sʉ̂ŋ khuu khrai", spanish: "¿Quién es el cual?" },
    answer: { thai: "ซึ่ง", es: "sʉ̂ŋ", spanish: "el cual" }
  },
  {
    rank: 34, thai: "ตาม", es: "dtaam", spanish: "según / tras", english: "according to", rtgs: "", cefr: null, freq: 34, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เด็กเดินตามแม่", es: "dèk dəən dtaam mɛ̂ɛ", spanish: "el niño camina detrás de la madre", en: "the child walks behind the mother" },
    question: { thai: "เด็กเดินตามใคร", es: "dèk dəən dtaam khrai", spanish: "¿Detrás de quién camina el niño?", en: "Who does the child walk behind?" },
    answer: { thai: "ตามแม่", es: "dtaam mɛ̂ɛ", spanish: "detrás de la madre", en: "behind the mother" }
  },
  {
    rank: 35, thai: "มาก", es: "mâak", spanish: "muy / mucho", english: "very", rtgs: "", cefr: null, freq: 35, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ร้อนมาก", es: "rɔ́ɔn mâak", spanish: "Hace mucho calor" },
    question: { thai: "อร่อยมากไหม", es: "à-ròii mâak mǎi", spanish: "¿Está muy rico?" },
    answer: { thai: "อร่อยมาก", es: "à-ròii mâak", spanish: "Muy rico" }
  },
  {
    rank: 36, thai: "โดย", es: "dooi", spanish: "por / mediante", english: "by", rtgs: "", cefr: null, freq: 36, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เขาเดินทางโดยเครื่องบิน", es: "khǎo dəən-thaang dooi khrʉ̂ang-bin", spanish: "él viaja en avión", en: "he travels by plane" },
    question: { thai: "เขาเดินทางโดยอะไร", es: "khǎo dəən-thaang dooi a-rai", spanish: "¿En qué viaja él?", en: "What does he travel by?" },
    answer: { thai: "โดยเครื่องบิน", es: "dooi khrʉ̂ang-bin", spanish: "en avión", en: "by plane" }
  },
  {
    rank: 37, thai: "ใช้", es: "chái", spanish: "usar", english: "to use", rtgs: "", cefr: null, freq: 37, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันใช้", es: "chǎn chái", spanish: "Yo uso" },
    question: { thai: "คุณใช้ไหม", es: "khun chái mǎi", spanish: "¿Tú usas?" },
    answer: { thai: "ใช้", es: "chái", spanish: "usar" }
  },
  {
    rank: 38, thai: "เรื่อง", es: "rʉ̂aŋ", spanish: "asunto / tema", english: "story", rtgs: "", cefr: null, freq: 38, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เรื่องดี", es: "rʉ̂aŋ dii", spanish: "asunto / tema bueno" },
    question: { thai: "มีเรื่องไหม", es: "mii rʉ̂aŋ mǎi", spanish: "¿Hay asunto?" },
    answer: { thai: "มีเรื่อง", es: "mii rʉ̂aŋ", spanish: "Sí, hay" }
  },
  {
    rank: 39, thai: "ยัง", es: "yaŋ", spanish: "todavía", english: "still", rtgs: "", cefr: null, freq: 39, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฉันยังไม่กิน", es: "chǎn yang mâi gin", spanish: "todavía no he comido", en: "I haven't eaten yet" },
    question: { thai: "คุณกินข้าวหรือยัง", es: "khun gin kâao rʉ̌ʉ yang", spanish: "¿Ya comiste?", en: "Have you eaten yet?" },
    answer: { thai: "ยังไม่กิน", es: "yang mâi gin", spanish: "todavía no", en: "not yet" }
  },
  {
    rank: 40, thai: "ทาง", es: "thaang", spanish: "camino / dirección", english: "way", rtgs: "", cefr: null, freq: 40, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทางดี", es: "thaang dii", spanish: "camino / dirección bueno" },
    question: { thai: "มีทางไหม", es: "mii thaang mǎi", spanish: "¿Hay camino?" },
    answer: { thai: "มีทาง", es: "mii thaang", spanish: "Sí, hay" }
  },
  {
    rank: 41, thai: "เรา", es: "rao", spanish: "nosotros", english: "we", rtgs: "", cefr: null, freq: 41, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "เราไปด้วยกัน", es: "rao bpai dûuai gan", spanish: "vamos juntos, en: "let's go together" },
    question: { thai: "เราคือใคร", es: "rao khuu khrai", spanish: "¿Quién es nosotros?" },
    answer: { thai: "เรา", es: "rao", spanish: "nosotros" }
  },
  {
    rank: 42, thai: "ผม", es: "phǒm", spanish: "yo (hombre)", english: "I (male)", rtgs: "", cefr: null, freq: 42, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "ผมเป็นครู", es: "phǒm pen khruu", spanish: "yo soy profesor, en: "I am a teacher" },
    question: { thai: "ผมคือใคร", es: "phǒm khuu khrai", spanish: "¿Quién es yo (hombre)?" },
    answer: { thai: "ผม", es: "phǒm", spanish: "yo (hombre)" }
  },
  {
    rank: 43, thai: "ทำ", es: "tham", spanish: "hacer", english: "to do", rtgs: "", cefr: null, freq: 43, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "คุณทำอะไร", es: "khun tham à-rai", spanish: "¿Qué haces?" },
    question: { thai: "วันนี้คุณทำอะไร", es: "wan-níi khun tham à-rai", spanish: "¿Qué haces hoy?" },
    answer: { thai: "ฉันทำงาน", es: "chǎn tham ŋaan", spanish: "Estoy trabajando" }
  },
  {
    rank: 44, thai: "อีก", es: "ìik", spanish: "más / otro", english: "more", rtgs: "", cefr: null, freq: 44, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ฉันต้องการอีกหนึ่งแก้ว", es: "chǎn dtông-gaan ìik nǔng gɛ̂ɛo", spanish: "quiero otro vaso más", en: "I want one more glass" },
    question: { thai: "ต้องการอีกไหม", es: "dtông-gaan ìik mǎi", spanish: "¿Quieres más?", en: "Do you want more?" },
    answer: { thai: "เอาอีกหน่อย", es: "ao ìik nòi", spanish: "sí, un poco más", en: "yes, a little more" }
  },
  {
    rank: 45, thai: "เมื่อ", es: "mʉ̂a", spanish: "cuando", english: "when", rtgs: "", cefr: null, freq: 45, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "เมื่อวานฉันไปตลาด", es: "mʉ̂a-waan chǎn bpai dtà-làat", spanish: "ayer fui al mercado", en: "yesterday I went to the market" },
    question: { thai: "เมื่อวานคุณไปไหน", es: "mʉ̂a-waan khun bpai nǎi", spanish: "¿A dónde fuiste ayer?", en: "Where did you go yesterday?" },
    answer: { thai: "ไปตลาด", es: "bpai dtà-làat", spanish: "fui al mercado", en: "I went to the market" }
  },
  {
    rank: 46, thai: "ฉัน", es: "chǎn", spanish: "yo (mujer)", english: "I (female)", rtgs: "", cefr: null, freq: 46, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "ฉันสบายดี", es: "chǎn sà-baai-dii", spanish: "Yo estoy bien" },
    question: { thai: "คุณชื่ออะไร", es: "khun chʉ̂a à-rai", spanish: "¿Cómo te llamas?" },
    answer: { thai: "ฉันชื่อเคปา", es: "chǎn chʉ̂a Kepaa", spanish: "Me llamo Kepa" }
  },
  {
    rank: 47, thai: "เข้า", es: "khâo", spanish: "entrar", english: "to enter", rtgs: "", cefr: null, freq: 47, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเข้า", es: "chǎn khâo", spanish: "Yo entro" },
    question: { thai: "คุณเข้าไหม", es: "khun khâo mǎi", spanish: "¿Tú entras?" },
    answer: { thai: "เข้า", es: "khâo", spanish: "entrar" }
  },
  {
    rank: 48, thai: "หนึ่ง", es: "nùŋ", spanish: "uno", english: "one", rtgs: "", cefr: null, freq: 48, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ฉันมีหนึ่งลูก", es: "chǎn mii nǔng lûuk", spanish: "tengo un hijo", en: "I have one child" },
    question: { thai: "คุณมีลูกกี่คน", es: "khun mii lûuk gii khon", spanish: "¿Cuántos hijos tienes?", en: "How many children do you have?" },
    answer: { thai: "มีหนึ่งคน", es: "mii nǔng khon", spanish: "tengo uno", en: "I have one" }
  },
  {
    rank: 49, thai: "เพื่อ", es: "phʉ̂a", spanish: "para", english: "for", rtgs: "", cefr: null, freq: 49, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "ฉันเรียนเพื่อทำงาน", es: "chǎn rian phʉ̂a tam-ngaan", spanish: "estudio para trabajar", en: "I study in order to work" },
    question: { thai: "คุณเรียนเพื่ออะไร", es: "khun rian phʉ̂a a-rai", spanish: "¿Para qué estudias?", en: "What do you study for?" },
    answer: { thai: "เพื่อทำงาน", es: "phʉ̂a tam-ngaan", spanish: "para trabajar", en: "in order to work" }
  },
  {
    rank: 50, thai: "ถึง", es: "thǔŋ", spanish: "llegar a", english: "to reach", rtgs: "", cefr: null, freq: 50, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันถึง", es: "chǎn thǔŋ", spanish: "Yo llego" },
    question: { thai: "คุณถึงไหม", es: "khun thǔŋ mǎi", spanish: "¿Tú llegas?" },
    answer: { thai: "ถึง", es: "thǔŋ", spanish: "llegar a" }
  },
  {
    rank: 51, thai: "เพราะ", es: "phrɔ́", spanish: "porque", english: "because", rtgs: "", cefr: null, freq: 51, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ฉันอยู่บ้านเพราะฝนตก", es: "chǎn yùu bâan phrớ yǎ fǒn dtòk", spanish: "me quedo en casa porque llueve", en: "I stay home because it rains" },
    question: { thai: "ทำไมไม่ไป", es: "tham-mai mâi bpai", spanish: "¿Por qué no vas?", en: "Why don't you go?" },
    answer: { thai: "เพราะฝนตก", es: "phrớ yǎ fǒn dtòk", spanish: "porque llueve", en: "because it rains" }
  },
  {
    rank: 52, thai: "ดี", es: "dii", spanish: "bueno / bien", english: "good", rtgs: "", cefr: null, freq: 52, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "อาหารอร่อยดี", es: "aa-hǎan à-ròii dii", spanish: "La comida está buena" },
    question: { thai: "เป็นยังไงบ้าง", es: "pen yang-ngai bâaŋ", spanish: "¿Cómo estás?" },
    answer: { thai: "สบายดี", es: "sà-baai-dii", spanish: "Estoy bien" }
  },
  {
    rank: 53, thai: "ออก", es: "ɔ̀ɔk", spanish: "salir", english: "to exit", rtgs: "", cefr: null, freq: 53, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันออก", es: "chǎn ɔ̀ɔk", spanish: "Yo salgo" },
    question: { thai: "คุณออกไหม", es: "khun ɔ̀ɔk mǎi", spanish: "¿Tú sales?" },
    answer: { thai: "ออก", es: "ɔ̀ɔk", spanish: "salir" }
  },
  {
    rank: 54, thai: "เห็น", es: "hěn", spanish: "ver", english: "to see", rtgs: "", cefr: null, freq: 54, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเห็น", es: "chǎn hěn", spanish: "Yo veo" },
    question: { thai: "คุณเห็นไหม", es: "khun hěn mǎi", spanish: "¿Tú ves?" },
    answer: { thai: "เห็น", es: "hěn", spanish: "ver" }
  },
  {
    rank: 55, thai: "เกิด", es: "gə̀ət", spanish: "nacer / ocurrir", english: "to happen", rtgs: "", cefr: null, freq: 55, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเกิด", es: "chǎn gə̀ət", spanish: "Yo nazco" },
    question: { thai: "คุณเกิดไหม", es: "khun gə̀ət mǎi", spanish: "¿Tú naces?" },
    answer: { thai: "เกิด", es: "gə̀ət", spanish: "nacer / ocurrir" }
  },
  {
    rank: 56, thai: "คือ", es: "khuu", spanish: "ser / o sea", english: "to be (equals)", rtgs: "", cefr: null, freq: 56, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันคือ", es: "chǎn khuu", spanish: "Yo soy" },
    question: { thai: "คุณคือไหม", es: "khun khuu mǎi", spanish: "¿Tú eres?" },
    answer: { thai: "คือ", es: "khuu", spanish: "ser / o sea" }
  },
  {
    rank: 57, thai: "เธอ", es: "thəə", spanish: "tú / ella", english: "you / she", rtgs: "", cefr: null, freq: 57, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "เธอสวย", es: "thəə sǔuai", spanish: "tú eres hermosa, en: "you are beautiful" },
    question: { thai: "เธอคือใคร", es: "thəə khuu khrai", spanish: "¿Quién es tú?" },
    answer: { thai: "เธอ", es: "thəə", spanish: "tú / ella" }
  },
  {
    rank: 58, thai: "จึง", es: "jʉŋ", spanish: "por tanto", english: "therefore", rtgs: "", cefr: null, freq: 58, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฝนตก ฉันจึงอยู่บ้าน", es: "fǒn dtòk, chǎn cʉ̌ng yùu bâan", spanish: "llueve, por eso me quedo", en: "it rains, so I stay home" },
    question: { thai: "ทำไมคุณจึงอยู่บ้าน", es: "tham-mai khun cʉ̌ng yùu bâan", spanish: "¿Por qué te quedas en casa?", en: "Why do you stay home?" },
    answer: { thai: "เพราะฝนตกจึงอยู่บ้าน", es: "phrớ yǎ fǒn dtòk cʉ̌ng yùu bâan", spanish: "porque llueve, por eso", en: "because it rains, so" }
  },
  {
    rank: 59, thai: "ไว้", es: "wâi", spanish: "guardar", english: "to keep", rtgs: "", cefr: null, freq: 59, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันไว้", es: "chǎn wâi", spanish: "Yo guardo" },
    question: { thai: "คุณไว้ไหม", es: "khun wâi mǎi", spanish: "¿Tú guardas?" },
    answer: { thai: "ไว้", es: "wâi", spanish: "guardar" }
  },
  {
    rank: 60, thai: "ตัว", es: "dtua", spanish: "cuerpo / clasificador", english: "body", rtgs: "", cefr: null, freq: 60, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ตัวดี", es: "dtua dii", spanish: "cuerpo / clasificador bueno" },
    question: { thai: "มีตัวไหม", es: "mii dtua mǎi", spanish: "¿Hay cuerpo?" },
    answer: { thai: "มีตัว", es: "mii dtua", spanish: "Sí, hay" }
  },
  {
    rank: 61, thai: "กว่า", es: "kwàa", spanish: "más que", english: "more than", rtgs: "", cefr: null, freq: 61, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "เขาสูงกว่าฉัน", es: "khǎo sǔung gwàa chǎn", spanish: "él es más alto que yo", en: "he is taller than me" },
    question: { thai: "ใครสูงกว่า", es: "khrai sǔung gwàa", spanish: "¿Quién es más alto?", en: "Who is taller?" },
    answer: { thai: "เขาสูงกว่า", es: "khǎo sǔung gwàa", spanish: "él es más alto", en: "he is taller" }
  },
  {
    rank: 62, thai: "ทำให้", es: "tham-hâi", spanish: "causar", english: "to cause", rtgs: "", cefr: null, freq: 62, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันทำให้", es: "chǎn tham-hâi", spanish: "Yo causo" },
    question: { thai: "คุณทำให้ไหม", es: "khun tham-hâi mǎi", spanish: "¿Tú causas?" },
    answer: { thai: "ทำให้", es: "tham-hâi", spanish: "causar" }
  },
  {
    rank: 63, thai: "คุณ", es: "khun", spanish: "tú (formal)", english: "you", rtgs: "", cefr: null, freq: 63, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "คุณสบายดีไหม", es: "khun sà-baai-dii mǎi", spanish: "¿Estás bien?" },
    question: { thai: "คุณอยู่ที่ไหน", es: "khun yùu thîi-nǎi", spanish: "¿Dónde estás?" },
    answer: { thai: "ฉันอยู่บ้าน", es: "chǎn yùu bâan", spanish: "Estoy en casa" }
  },
  {
    rank: 64, thai: "เลย", es: "ləəi", spanish: "entonces", english: "so", rtgs: "", cefr: null, freq: 64, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "อร่อยมากเลย", es: "a-ròi mâak ləəi", spanish: "está riquísimo", en: "it's really delicious" },
    question: { thai: "อร่อยไหม", es: "a-ròi mǎi", spanish: "¿Está rico?", en: "Is it delicious?" },
    answer: { thai: "อร่อยมากเลย", es: "a-ròi mâak ləəi", spanish: "riquísimo", en: "really delicious" }
  },
  {
    rank: 65, thai: "ปี", es: "bpii", spanish: "año", english: "year", rtgs: "", cefr: null, freq: 65, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปีนี้ร้อน", es: "bpii níi rɔ́ɔn", spanish: "Este año hace calor" },
    question: { thai: "คุณอายุกี่ปี", es: "khun aa-yú kìi bpii", spanish: "¿Cuántos años tienes?" },
    answer: { thai: "ยี่สิบห้าปี", es: "yîi-sìp-hâa bpii", spanish: "25 años" }
  },
  {
    rank: 66, thai: "ไทย", es: "thai", spanish: "tailandés", english: "Thai", rtgs: "", cefr: null, freq: 66, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ฉันชอบอาหารไทย", es: "chǎn chôop aa-hǎan thai", spanish: "me gusta la comida tailandesa", en: "I like Thai food" },
    question: { thai: "คุณชอบอาหารไทยไหม", es: "khun chôop aa-hǎan thai mǎi", spanish: "¿Te gusta la comida tailandesa?", en: "Do you like Thai food?" },
    answer: { thai: "ชอบมาก", es: "chôop mâak", spanish: "sí, mucho", en: "yes, a lot" }
  },
  {
    rank: 67, thai: "มัน", es: "man", spanish: "ello / ello", english: "it", rtgs: "", cefr: null, freq: 67, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "มันอร่อย", es: "man a-ròi", spanish: "está delicioso, en: "it is delicious" },
    question: { thai: "มันคือใคร", es: "man khuu khrai", spanish: "¿Quién es ello?" },
    answer: { thai: "มัน", es: "man", spanish: "ello / ello" }
  },
  {
    rank: 68, thai: "ทั้ง", es: "tháŋ", spanish: "todo", english: "all", rtgs: "", cefr: null, freq: 68, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "ทั้งคู่สูง", es: "tháng khuu sǔung", spanish: "ambos son altos", en: "both are tall" },
    question: { thai: "ใครสูง", es: "khrai sǔung", spanish: "¿Quién es alto?", en: "Who is tall?" },
    answer: { thai: "ทั้งคู่", es: "tháng khuu", spanish: "ambos", en: "both" }
  },
  {
    rank: 69, thai: "อะไร", es: "à-rai", spanish: "qué", english: "what", rtgs: "", cefr: null, freq: 69, notes: "",
    category: "pronombres", tone: "l",
    phrase: { thai: "จะกินอะไร", es: "jà gin à-rai", spanish: "¿qué vas a comer?, en: "what will you eat?" },
    question: { thai: "อะไรคือใคร", es: "à-rai khuu khrai", spanish: "¿Quién es qué?" },
    answer: { thai: "อะไร", es: "à-rai", spanish: "qué" }
  },
  {
    rank: 70, thai: "ถ้า", es: "tâa", spanish: "si", english: "if", rtgs: "", cefr: null, freq: 70, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ถ้าพรุ่งนี้ฝนตก ฉันไม่ไป", es: "thâa prùng-níi fǒn dtòk, chǎn mâi bpai", spanish: "si mañana llueve, no voy", en: "if it rains tomorrow, I won't go" },
    question: { thai: "ถ้าฝนตกจะทำอย่างไร", es: "thâa fǒn dtòk jà tam yàang rai", spanish: "Si llueve, ¿qué harás?", en: "If it rains, what will you do?" },
    answer: { thai: "ถ้าตกจะอยู่บ้าน", es: "thâa dtòk jà yùu bâan", spanish: "si llueve, me quedo en casa", en: "if it rains, I'll stay home" }
  },
  {
    rank: 71, thai: "ต่อ", es: "dtɔ̂ɔ", spanish: "continuar", english: "to continue", rtgs: "", cefr: null, freq: 71, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันต่อ", es: "chǎn dtɔ̂ɔ", spanish: "Yo continuo" },
    question: { thai: "คุณต่อไหม", es: "khun dtɔ̂ɔ mǎi", spanish: "¿Tú continúas?" },
    answer: { thai: "ต่อ", es: "dtɔ̂ɔ", spanish: "continuar" }
  },
  {
    rank: 72, thai: "ลง", es: "long", spanish: "bajar", english: "to go down", rtgs: "", cefr: null, freq: 72, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันลง", es: "chǎn long", spanish: "Yo bajo" },
    question: { thai: "คุณลงไหม", es: "khun long mǎi", spanish: "¿Tú bajas?" },
    answer: { thai: "ลง", es: "long", spanish: "bajar" }
  },
  {
    rank: 73, thai: "เวลา", es: "welaa", spanish: "tiempo / hora", english: "time", rtgs: "", cefr: null, freq: 73, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เวลาผ่านไปเร็ว", es: "welaa pâan bpai rew", spanish: "El tiempo pasa rápido" },
    question: { thai: "กี่โมงแล้ว", es: "kii moong lɛ́ɛw", spanish: "¿Qué hora es?" },
    answer: { thai: "สองทุ่ม", es: "sɔ̌ɔŋ thùm", spanish: "Son las 8pm" }
  },
  {
    rank: 74, thai: "ส่วน", es: "sùan", spanish: "parte", english: "part", rtgs: "", cefr: null, freq: 74, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ส่วนดี", es: "sùan dii", spanish: "parte bueno" },
    question: { thai: "มีส่วนไหม", es: "mii sùan mǎi", spanish: "¿Hay parte?" },
    answer: { thai: "มีส่วน", es: "mii sùan", spanish: "Sí, hay" }
  },
  {
    rank: 75, thai: "ต่าง", es: "tàaŋ", spanish: "diferente", english: "different", rtgs: "", cefr: null, freq: 75, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "พวกเขาต่างคนต่างทำ", es: "phûak khǎo tàang khon tàang tam", spanish: "cada uno hace lo suyo", en: "they each do their own thing" },
    question: { thai: "พวกเขาทำเหมือนกันไหม", es: "phûak khǎo tam mʉ̌an-gan mǎi", spanish: "¿Hacen lo mismo?", en: "Do they do the same?" },
    answer: { thai: "ไม่ ต่างคนต่างทำ", es: "mâi, tàang khon tàang tam", spanish: "no, cada uno lo suyo", en: "no, each their own" }
  },
  {
    rank: 76, thai: "วัน", es: "wan", spanish: "día", english: "day", rtgs: "", cefr: null, freq: 76, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วันนี้ดีใจ", es: "wan-níi dii-jai", spanish: "Hoy estoy contento" },
    question: { thai: "วันนี้วันอะไร", es: "wan-níi wan à-rai", spanish: "¿Qué día es hoy?" },
    answer: { thai: "วันจันทร์", es: "wan-jan", spanish: "Lunes" }
  },
  {
    rank: 77, thai: "ทุก", es: "thúk", spanish: "cada", english: "every", rtgs: "", cefr: null, freq: 77, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "ทุกคนมาแล้ว", es: "thúk khon maa lɛ́ɛo", spanish: "todos ya llegaron", en: "everyone has arrived" },
    question: { thai: "ทุกคนมาหรือยัง", es: "thúk khon maa rʉ̌ʉ yang", spanish: "¿Ya llegó todo el mundo?", en: "Has everyone arrived yet?" },
    answer: { thai: "มาแล้ว", es: "maa lɛ́ɛo", spanish: "ya llegaron", en: "they've arrived" }
  },
  {
    rank: 78, thai: "อาจ", es: "àat", spanish: "poder ser", english: "might", rtgs: "", cefr: null, freq: 78, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันอาจ", es: "chǎn àat", spanish: "Yo puedo" },
    question: { thai: "คุณอาจไหม", es: "khun àat mǎi", spanish: "¿Tú puedes?" },
    answer: { thai: "อาจ", es: "àat", spanish: "poder ser" }
  },
  {
    rank: 79, thai: "แบบ", es: "bɛ̀ɛp", spanish: "estilo / tipo", english: "style", rtgs: "", cefr: null, freq: 79, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "แบบดี", es: "bɛ̀ɛp dii", spanish: "estilo / tipo bueno" },
    question: { thai: "มีแบบไหม", es: "mii bɛ̀ɛp mǎi", spanish: "¿Hay estilo?" },
    answer: { thai: "มีแบบ", es: "mii bɛ̀ɛp", spanish: "Sí, hay" }
  },
  {
    rank: 80, thai: "ประเทศ", es: "prathêet", spanish: "país", english: "country", rtgs: "", cefr: null, freq: 80, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประเทศดี", es: "prathêet dii", spanish: "país bueno" },
    question: { thai: "มีประเทศไหม", es: "mii prathêet mǎi", spanish: "¿Hay país?" },
    answer: { thai: "มีประเทศ", es: "mii prathêet", spanish: "Sí, hay" }
  },
  {
    rank: 81, thai: "ก่อน", es: "gɔ̀ɔn", spanish: "antes", english: "before", rtgs: "", cefr: null, freq: 81, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "คุณไปก่อน", es: "khun bpai gɔ̀ɔn", spanish: "tú ve primero", en: "you go first" },
    question: { thai: "ใครไปก่อน", es: "khrai bpai gɔ̀ɔn", spanish: "¿Quién va primero?", en: "Who goes first?" },
    answer: { thai: "คุณไปก่อน", es: "khun bpai gɔ̀ɔn", spanish: "tú primero", en: "you go first" }
  },
  {
    rank: 82, thai: "ถูก", es: "thùuk", spanish: "ser + pasiva / correcto", english: "passive", rtgs: "", cefr: null, freq: 82, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันถูก", es: "chǎn thùuk", spanish: "Yo soy (pasiva)" },
    question: { thai: "คุณถูกไหม", es: "khun thùuk mǎi", spanish: "¿Tú eres (pasiva)?" },
    answer: { thai: "ถูก", es: "thùuk", spanish: "ser + pasiva / correcto" }
  },
  {
    rank: 83, thai: "ดู", es: "duu", spanish: "mirar / ver", english: "to look", rtgs: "", cefr: null, freq: 83, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดู", es: "chǎn duu", spanish: "Yo miro" },
    question: { thai: "คุณดูไหม", es: "khun duu mǎi", spanish: "¿Tú miro?" },
    answer: { thai: "ดู", es: "duu", spanish: "mirar / ver" }
  },
  {
    rank: 84, thai: "รู้", es: "rúu", spanish: "saber", english: "to know", rtgs: "", cefr: null, freq: 84, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรู้", es: "chǎn rúu", spanish: "Yo sabo" },
    question: { thai: "คุณรู้ไหม", es: "khun rúu mǎi", spanish: "¿Tú sabo?" },
    answer: { thai: "รู้", es: "rúu", spanish: "saber" }
  },
  {
    rank: 85, thai: "เอา", es: "ao", spanish: "tomar", english: "to take", rtgs: "", cefr: null, freq: 85, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเอา", es: "chǎn ao", spanish: "Yo tomo" },
    question: { thai: "คุณเอาไหม", es: "khun ao mǎi", spanish: "¿Tú tomo?" },
    answer: { thai: "เอา", es: "ao", spanish: "tomar" }
  },
  {
    rank: 86, thai: "อื่น", es: "ùən", spanish: "otro", english: "other", rtgs: "", cefr: null, freq: 86, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ฉันอยากสีอื่น", es: "chǎn yàak sǐik ùeun", spanish: "quiero otro color", en: "I want a different color" },
    question: { thai: "มีสีอื่นไหม", es: "mii sǐik ùeun mǎi", spanish: "¿Hay otro color?", en: "Is there another color?" },
    answer: { thai: "มีสีอื่น", es: "mii sǐik ùeun", spanish: "sí, hay otro", en: "yes, there is" }
  },
  {
    rank: 87, thai: "ครั้ง", es: "khráŋ", spanish: "vez", english: "time", rtgs: "", cefr: null, freq: 87, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ครั้งดี", es: "khráŋ dii", spanish: "vez bueno" },
    question: { thai: "มีครั้งไหม", es: "mii khráŋ mǎi", spanish: "¿Hay vez?" },
    answer: { thai: "มีครั้ง", es: "mii khráŋ", spanish: "Sí, hay" }
  },
  {
    rank: 88, thai: "เช่น", es: "chên", spanish: "como", english: "such as", rtgs: "", cefr: null, freq: 88, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ผลไม้ เช่น มะม่วง", es: "pǒn-lá-mái chên má-mûuang", spanish: "frutas, por ejemplo, mango", en: "fruits, such as mango" },
    question: { thai: "ผลไม้อะไรบ้าง", es: "pǒn-lá-mái a-rai bàang", spanish: "¿Qué frutas hay?", en: "What fruits are there?" },
    answer: { thai: "เช่น มะม่วงและกล้วย", es: "chên má-mûuang láe glûuai", spanish: "por ejemplo, mango y plátano", en: "for example, mango and banana" }
  },
  {
    rank: 89, thai: "นะ", es: "ná", spanish: "¿vale?", english: "particle", rtgs: "", cefr: null, freq: 89, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "อย่าลืมนะ", es: "yàa lǔem ná", spanish: "no olvides, ¿vale?, en: "don't forget, okay?" },
    question: { thai: "นะ", es: "ná", spanish: "¿vale?" },
    answer: { thai: "นะ", es: "ná", spanish: "¿vale?" }
  },
  {
    rank: 90, thai: "สอง", es: "sɔ̌ɔŋ", spanish: "dos", english: "two", rtgs: "", cefr: null, freq: 90, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ฉันมีสองพี่น้อง", es: "chǎn mii sǒng phîi-náuang", spanish: "tengo dos hermanos", en: "I have two siblings" },
    question: { thai: "คุณมีพี่น้องกี่คน", es: "khun mii phîi-náuang gii khon", spanish: "¿Cuántos hermanos tienes?", en: "How many siblings do you have?" },
    answer: { thai: "มีสองคน", es: "mii sǒng khon", spanish: "tengo dos", en: "I have two" }
  },
  {
    rank: 91, thai: "หน้า", es: "nâa", spanish: "cara / próximo", english: "face / next", rtgs: "", cefr: null, freq: 91, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "หน้าดี", es: "nâa dii", spanish: "cara / próximo bueno" },
    question: { thai: "มีหน้าไหม", es: "mii nâa mǎi", spanish: "¿Hay cara?" },
    answer: { thai: "มีหน้า", es: "mii nâa", spanish: "Sí, hay" }
  },
  {
    rank: 92, thai: "นาย", es: "naai", spanish: "jefe / Sr.", english: "boss", rtgs: "", cefr: null, freq: 92, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นายดี", es: "naai dii", spanish: "jefe / Sr. bueno" },
    question: { thai: "มีนายไหม", es: "mii naai mǎi", spanish: "¿Hay jefe?" },
    answer: { thai: "มีนาย", es: "mii naai", spanish: "Sí, hay" }
  },
  {
    rank: 93, thai: "บอก", es: "bɔ̀ɔk", spanish: "decir", english: "to tell", rtgs: "", cefr: null, freq: 93, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันบอก", es: "chǎn bɔ̀ɔk", spanish: "Yo deco" },
    question: { thai: "คุณบอกไหม", es: "khun bɔ̀ɔk mǎi", spanish: "¿Tú deco?" },
    answer: { thai: "บอก", es: "bɔ̀ɔk", spanish: "decir" }
  },
  {
    rank: 94, thai: "กลับ", es: "glàp", spanish: "volver", english: "to return", rtgs: "", cefr: null, freq: 94, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกลับ", es: "chǎn glàp", spanish: "Yo volvo" },
    question: { thai: "คุณกลับไหม", es: "khun glàp mǎi", spanish: "¿Tú volvo?" },
    answer: { thai: "กลับ", es: "glàp", spanish: "volver" }
  },
  {
    rank: 95, thai: "งาน", es: "ŋaan", spanish: "trabajo / evento", english: "work", rtgs: "", cefr: null, freq: 95, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "งานดี", es: "ŋaan dii", spanish: "trabajo / evento bueno" },
    question: { thai: "มีงานไหม", es: "mii ŋaan mǎi", spanish: "¿Hay trabajo?" },
    answer: { thai: "มีงาน", es: "mii ŋaan", spanish: "Sí, hay" }
  },
  {
    rank: 96, thai: "นำ", es: "nam", spanish: "llevar / guiar", english: "to lead", rtgs: "", cefr: null, freq: 96, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันนำ", es: "chǎn nam", spanish: "Yo llevo" },
    question: { thai: "คุณนำไหม", es: "khun nam mǎi", spanish: "¿Tú llevo?" },
    answer: { thai: "นำ", es: "nam", spanish: "llevar / guiar" }
  },
  {
    rank: 97, thai: "แห่ง", es: "hɛ̀ɛŋ", spanish: "de (lugar)", english: "of place", rtgs: "", cefr: null, freq: 97, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ประเทศไทยเป็นประเทศแห่งการท่องเที่ยว", es: "bprà-thêet thai pen bprà-thêet hàeng gaan thâwng-thîaw", spanish: "Tailandia es un país turístico", en: "Thailand is a country of tourism" },
    question: { thai: "ประเทศไทยเป็นประเทศแห่งอะไร", es: "bprà-thêet thai pen bprà-thêet hàeng a-rai", spanish: "¿Tailandia es país de qué?", en: "Thailand is a country of what?" },
    answer: { thai: "แห่งการท่องเที่ยว", es: "hàeng gaan thâwng-thîaw", spanish: "turístico", en: "of tourism" }
  },
  {
    rank: 98, thai: "จน", es: "jon", spanish: "hasta / pobre", english: "until", rtgs: "", cefr: null, freq: 98, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เขาเรียนจนดึก", es: "khǎo rian jon dʉ̀k", spanish: "él estudia hasta tarde", en: "he studies until late" },
    question: { thai: "เขาเรียนถึงกี่โมง", es: "khǎo rian thǔng gii moong", spanish: "¿Hasta qué hora estudia?", en: "Until what time does he study?" },
    answer: { thai: "เรียนจนดึก", es: "rian jon dʉ̀k", spanish: "hasta tarde", en: "until late" }
  },
  {
    rank: 99, thai: "บาง", es: "baaŋ", spanish: "algunos", english: "some", rtgs: "", cefr: null, freq: 99, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "บางคนชอบเผ็ด", es: "baang khon chôop phèt", spanish: "a algunos les gusta picante", en: "some people like spicy" },
    question: { thai: "ทุกคนชอบเผ็ดไหม", es: "thúk khon chôop phèt mǎi", spanish: "¿A todos les gusta picante?", en: "Does everyone like spicy?" },
    answer: { thai: "ไม่ บางคนไม่ชอบ", es: "mâi, baang khon mâi chôop", spanish: "no, a algunos no", en: "no, some don't" }
  },
  {
    rank: 100, thai: "เด็ก", es: "dèk", spanish: "niño", english: "child", rtgs: "", cefr: null, freq: 100, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เด็กดี", es: "dèk dii", spanish: "niño bueno" },
    question: { thai: "มีเด็กไหม", es: "mii dèk mǎi", spanish: "¿Hay niño?" },
    answer: { thai: "มีเด็ก", es: "mii dèk", spanish: "Sí, hay" }
  },
  {
    rank: 101, thai: "เหมือน", es: "mǔəan", spanish: "igual / como", english: "same", rtgs: "", cefr: null, freq: 101, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "เขาเหมือนพ่อ", es: "khǎo mǔean phâw", spanish: "él se parece al padre", en: "he looks like his father" },
    question: { thai: "เขาเหมือนใคร", es: "khǎo mǔean khrai", spanish: "¿A quién se parece?", en: "Who does he look like?" },
    answer: { thai: "เหมือนพ่อ", es: "mǔean phâw", spanish: "al padre", en: "his father" }
  },
  {
    rank: 102, thai: "พระ", es: "phrá", spanish: "monje", english: "monk", rtgs: "", cefr: null, freq: 102, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "พระดี", es: "phrá dii", spanish: "monje bueno" },
    question: { thai: "มีพระไหม", es: "mii phrá mǎi", spanish: "¿Hay monje?" },
    answer: { thai: "มีพระ", es: "mii phrá", spanish: "Sí, hay" }
  },
  {
    rank: 103, thai: "คิด", es: "khít", spanish: "pensar", english: "to think", rtgs: "", cefr: null, freq: 103, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันคิด", es: "chǎn khít", spanish: "Yo penso" },
    question: { thai: "คุณคิดไหม", es: "khun khít mǎi", spanish: "¿Tú penso?" },
    answer: { thai: "คิด", es: "khít", spanish: "pensar" }
  },
  {
    rank: 104, thai: "นี่", es: "nîi", spanish: "esto", english: "this", rtgs: "", cefr: null, freq: 104, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "นี่คือหนังสือ", es: "nîi khuu nǎng-sǔeu", spanish: "esto es un libro, en: "this is a book" },
    question: { thai: "นี่คือใคร", es: "nîi khuu khrai", spanish: "¿Quién es esto?" },
    answer: { thai: "นี่", es: "nîi", spanish: "esto" }
  },
  {
    rank: 105, thai: "ได้รับ", es: "dâai-ráp", spanish: "recibir", english: "to receive", rtgs: "", cefr: null, freq: 105, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันได้รับ", es: "chǎn dâai-ráp", spanish: "Yo recibo" },
    question: { thai: "คุณได้รับไหม", es: "khun dâai-ráp mǎi", spanish: "¿Tú recibo?" },
    answer: { thai: "ได้รับ", es: "dâai-ráp", spanish: "recibir" }
  },
  {
    rank: 106, thai: "เข้าใจ", es: "khâo-jai", spanish: "entender", english: "to understand", rtgs: "", cefr: null, freq: 106, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเข้าใจ", es: "chǎn khâo-jai", spanish: "Yo entendo" },
    question: { thai: "คุณเข้าใจไหม", es: "khun khâo-jai mǎi", spanish: "¿Tú entendo?" },
    answer: { thai: "เข้าใจ", es: "khâo-jai", spanish: "entender" }
  },
  {
    rank: 107, thai: "ใหญ่", es: "yài", spanish: "grande", english: "big", rtgs: "", cefr: null, freq: 107, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "บ้านใหญ่มาก", es: "bâan yài mâak", spanish: "La casa es muy grande" },
    question: { thai: "ห้องใหญ่พอไหม", es: "hɔ̂ɔŋ yài phɔɔ mǎi", spanish: "¿Es bastante grande?" },
    answer: { thai: "ใหญ่พอดี", es: "yài phɔɔ-dii", spanish: "Perfecta" }
  },
  {
    rank: 108, thai: "กลายเป็น", es: "glaai-pen", spanish: "convertirse en", english: "to become", rtgs: "", cefr: null, freq: 108, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันกลายเป็น", es: "chǎn glaai-pen", spanish: "Yo convertirse en" },
    question: { thai: "คุณกลายเป็นไหม", es: "khun glaai-pen mǎi", spanish: "¿Tú convertirse en?" },
    answer: { thai: "กลายเป็น", es: "glaai-pen", spanish: "convertirse en" }
  },
  {
    rank: 109, thai: "ครู", es: "khruu", spanish: "maestro", english: "teacher", rtgs: "", cefr: null, freq: 109, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ครูดี", es: "khruu dii", spanish: "maestro bueno" },
    question: { thai: "มีครูไหม", es: "mii khruu mǎi", spanish: "¿Hay maestro?" },
    answer: { thai: "มีครู", es: "mii khruu", spanish: "Sí, hay" }
  },
  {
    rank: 110, thai: "เปิด", es: "bpə̀ət", spanish: "abrir", english: "to open", rtgs: "", cefr: null, freq: 110, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเปิด", es: "chǎn bpə̀ət", spanish: "Yo abro" },
    question: { thai: "คุณเปิดไหม", es: "khun bpə̀ət mǎi", spanish: "¿Tú abro?" },
    answer: { thai: "เปิด", es: "bpə̀ət", spanish: "abrir" }
  },
  {
    rank: 111, thai: "เดือน", es: "düan", spanish: "mes", english: "month", rtgs: "", cefr: null, freq: 111, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เดือนดี", es: "düan dii", spanish: "mes bueno" },
    question: { thai: "มีเดือนไหม", es: "mii düan mǎi", spanish: "¿Hay mes?" },
    answer: { thai: "มีเดือน", es: "mii düan", spanish: "Sí, hay" }
  },
  {
    rank: 112, thai: "ทราบ", es: "sâap", spanish: "saber (info)", english: "to know", rtgs: "", cefr: null, freq: 112, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันทราบ", es: "chǎn sâap", spanish: "Yo sé (info)" },
    question: { thai: "คุณทราบไหม", es: "khun sâap mǎi", spanish: "¿Tú sabes (info)?" },
    answer: { thai: "ทราบ", es: "sâap", spanish: "saber (info)" }
  },
  {
    rank: 113, thai: "ใช่", es: "châi", spanish: "sí", english: "yes", rtgs: "", cefr: null, freq: 113, notes: "",
    category: "expresiones", tone: "f",
    phrase: { thai: "ใช่แล้ว", es: "châi lɛ́ɛw", spanish: "Así es" },
    question: { thai: "นี่ใช่ไหม", es: "níi châi mǎi", spanish: "¿Es esto?" },
    answer: { thai: "ใช่", es: "châi", spanish: "Sí" }
  },
  {
    rank: 114, thai: "หนังสือ", es: "nǎŋsǔə", spanish: "libro", english: "book", rtgs: "", cefr: null, freq: 114, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หนังสือดี", es: "nǎŋsǔə dii", spanish: "libro bueno" },
    question: { thai: "มีหนังสือไหม", es: "mii nǎŋsǔə mǎi", spanish: "¿Hay libro?" },
    answer: { thai: "มีหนังสือ", es: "mii nǎŋsǔə", spanish: "Sí, hay" }
  },
  {
    rank: 115, thai: "บ้าน", es: "bâan", spanish: "casa", english: "house", rtgs: "", cefr: null, freq: 115, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "บ้านฉันใหญ่", es: "bâan chǎn yài", spanish: "Mi casa es grande" },
    question: { thai: "บ้านคุณอยู่ไหน", es: "bâan khun yùu nǎi", spanish: "¿Dónde está tu casa?" },
    answer: { thai: "อยู่กรุงเทพ", es: "yùu krung-thêep", spanish: "En Bangkok" }
  },
  {
    rank: 116, thai: "สำหรับ", es: "sǎmràp", spanish: "para", english: "for", rtgs: "", cefr: null, freq: 116, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "ของขวัญสำหรับคุณ", es: "kǒng-khwǎn sǎm-ràp khun", spanish: "un regalo para ti", en: "a gift for you" },
    question: { thai: "นี่สำหรับใคร", es: "nîi sǎm-ràp khrai", spanish: "¿Esto es para quién?", en: "Who is this for?" },
    answer: { thai: "สำหรับคุณ", es: "sǎm-ràp khun", spanish: "para ti", en: "for you" }
  },
  {
    rank: 117, thai: "เชื่อ", es: "chʉ̂a", spanish: "creer", english: "to believe", rtgs: "", cefr: null, freq: 117, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเชื่อ", es: "chǎn chʉ̂a", spanish: "Yo creo" },
    question: { thai: "คุณเชื่อไหม", es: "khun chʉ̂a mǎi", spanish: "¿Tú creo?" },
    answer: { thai: "เชื่อ", es: "chʉ̂a", spanish: "creer" }
  },
  {
    rank: 118, thai: "คง", es: "khom", spanish: "probablemente", english: "probably", rtgs: "", cefr: null, freq: 118, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "พรุ่งนี้คงฝนตก", es: "prùng-níi khom fǒn dtòk", spanish: "mañana probablemente llueva", en: "tomorrow it will probably rain" },
    question: { thai: "พรุ่งนี้อากาศเป็นอย่างไร", es: "prùng-níi aa-kàat pen yàang rai", spanish: "¿Cómo estará el clima mañana?", en: "What will the weather be like tomorrow?" },
    answer: { thai: "คงฝนตก", es: "khom fǒn dtòk", spanish: "probablemente llueva", en: "probably rain" }
  },
  {
    rank: 119, thai: "สำคัญ", es: "sǎmkhan", spanish: "importante", english: "important", rtgs: "", cefr: null, freq: 119, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ความสุขสำคัญกว่าเงิน", es: "kwaam-sùk sǎm-khàn gwàa ngern", spanish: "la felicidad es más importante que el dinero", en: "happiness is more important than money" },
    question: { thai: "อะไรสำคัญกว่า", es: "a-rai sǎm-khàn gwàa", spanish: "¿Qué es más importante?", en: "What is more important?" },
    answer: { thai: "ความสุขสำคัญกว่า", es: "kwaam-sùk sǎm-khàn gwàa", spanish: "la felicidad", en: "happiness" }
  },
  {
    rank: 120, thai: "มากๆ", es: "mâak-mâak", spanish: "muchísimo", english: "very much", rtgs: "", cefr: null, freq: 120, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ฉันหิวมากๆ", es: "chǎn hǐu mâak-mâak", spanish: "tengo muchísima hambre", en: "I'm very hungry" },
    question: { thai: "คุณหิวไหม", es: "khun hǐu mǎi", spanish: "¿Tienes hambre?", en: "Are you hungry?" },
    answer: { thai: "หิวมากๆ", es: "hǐu mâak-mâak", spanish: "muchísima", en: "very much" }
  },
  {
    rank: 121, thai: "มอง", es: "mɔɔŋ", spanish: "mirar", english: "to gaze", rtgs: "", cefr: null, freq: 121, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันมอง", es: "chǎn mɔɔŋ", spanish: "Yo miro" },
    question: { thai: "คุณมองไหม", es: "khun mɔɔŋ mǎi", spanish: "¿Tú miro?" },
    answer: { thai: "มอง", es: "mɔɔŋ", spanish: "mirar" }
  },
  {
    rank: 122, thai: "คำ", es: "kham", spanish: "palabra", english: "word", rtgs: "", cefr: null, freq: 122, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คำดี", es: "kham dii", spanish: "palabra bueno" },
    question: { thai: "มีคำไหม", es: "mii kham mǎi", spanish: "¿Hay palabra?" },
    answer: { thai: "มีคำ", es: "mii kham", spanish: "Sí, hay" }
  },
  {
    rank: 123, thai: "ปัญหา", es: "panyǎa", spanish: "problema", english: "problem", rtgs: "", cefr: null, freq: 123, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ปัญหาดี", es: "panyǎa dii", spanish: "problema bueno" },
    question: { thai: "มีปัญหาไหม", es: "mii panyǎa mǎi", spanish: "¿Hay problema?" },
    answer: { thai: "มีปัญหา", es: "mii panyǎa", spanish: "Sí, hay" }
  },
  {
    rank: 124, thai: "สังคม", es: "saŋkhom", spanish: "sociedad", english: "society", rtgs: "", cefr: null, freq: 124, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "สังคมดี", es: "saŋkhom dii", spanish: "sociedad bueno" },
    question: { thai: "มีสังคมไหม", es: "mii saŋkhom mǎi", spanish: "¿Hay sociedad?" },
    answer: { thai: "มีสังคม", es: "mii saŋkhom", spanish: "Sí, hay" }
  },
  {
    rank: 125, thai: "กลุ่ม", es: "klùm", spanish: "grupo", english: "group", rtgs: "", cefr: null, freq: 125, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "กลุ่มดี", es: "klùm dii", spanish: "grupo bueno" },
    question: { thai: "มีกลุ่มไหม", es: "mii klùm mǎi", spanish: "¿Hay grupo?" },
    answer: { thai: "มีกลุ่ม", es: "mii klùm", spanish: "Sí, hay" }
  },
  {
    rank: 126, thai: "ใด", es: "dai", spanish: "algún / cualquier", english: "any", rtgs: "", cefr: null, freq: 126, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "คนใดคนหนึ่ง", es: "khon dai khon nùeng", spanish: "alguna persona, en: "some person" },
    question: { thai: "ใดคือใคร", es: "dai khuu khrai", spanish: "¿Quién es algún?" },
    answer: { thai: "ใด", es: "dai", spanish: "algún / cualquier" }
  },
  {
    rank: 127, thai: "ท่าน", es: "thân", spanish: "usted (respetuoso)", english: "you (formal)", rtgs: "", cefr: null, freq: 127, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "ท่านครู", es: "thân khruu", spanish: "usted maestro, en: "you (respectful) teacher" },
    question: { thai: "ท่านคือใคร", es: "thân khuu khrai", spanish: "¿Quién es usted (respetuoso)?" },
    answer: { thai: "ท่าน", es: "thân", spanish: "usted (respetuoso)" }
  },
  {
    rank: 128, thai: "น้ำ", es: "náam", spanish: "agua", english: "water", rtgs: "", cefr: null, freq: 128, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "น้ำดี", es: "náam dii", spanish: "agua bueno" },
    question: { thai: "มีน้ำไหม", es: "mii náam mǎi", spanish: "¿Hay agua?" },
    answer: { thai: "มีน้ำ", es: "mii náam", spanish: "Sí, hay" }
  },
  {
    rank: 129, thai: "กำลัง", es: "gamlaŋ", spanish: "estar + gerundio", english: "progressive", rtgs: "", cefr: null, freq: 129, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฉันกำลังกินข้าว", es: "chǎn gam-lang gin kâao", spanish: "estoy comiendo", en: "I'm eating" },
    question: { thai: "คุณกำลังทำอะไร", es: "khun gam-lang tam a-rai", spanish: "¿Qué estás haciendo?", en: "What are you doing?" },
    answer: { thai: "กำลังกินข้าว", es: "gam-lang gin kâao", spanish: "estoy comiendo", en: "I'm eating" }
  },
  {
    rank: 130, thai: "ลูก", es: "lûuk", spanish: "hijo / bola", english: "child", rtgs: "", cefr: null, freq: 130, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ลูกดี", es: "lûuk dii", spanish: "hijo / bola bueno" },
    question: { thai: "มีลูกไหม", es: "mii lûuk mǎi", spanish: "¿Hay hijo?" },
    answer: { thai: "มีลูก", es: "mii lûuk", spanish: "Sí, hay" }
  },
  {
    rank: 131, thai: "ขอ", es: "khɔ̌ɔ", spanish: "pedir / solicitar", english: "to request", rtgs: "", cefr: null, freq: 131, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันขอ", es: "chǎn khɔ̌ɔ", spanish: "Yo pedo" },
    question: { thai: "คุณขอไหม", es: "khun khɔ̌ɔ mǎi", spanish: "¿Tú pedo?" },
    answer: { thai: "ขอ", es: "khɔ̌ɔ", spanish: "pedir / solicitar" }
  },
  {
    rank: 132, thai: "จริง", es: "jiŋ", spanish: "verdadero", english: "true", rtgs: "", cefr: null, freq: 132, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "เขาพูดจริง", es: "khǎo phûut jing", spanish: "él habla en serio", en: "he speaks seriously" },
    question: { thai: "เขาพูดจริงไหม", es: "khǎo phûut jing mǎi", spanish: "¿Él habla en serio?", en: "Is he speaking seriously?" },
    answer: { thai: "จริง ไม่ได้ล้อ", es: "jing, mâi dâai lê", spanish: "sí, no bromea", en: "yes, he's not joking" }
  },
  {
    rank: 133, thai: "แม่", es: "mɛ̂ɛ", spanish: "madre", english: "mother", rtgs: "", cefr: null, freq: 133, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "แม่ดี", es: "mɛ̂ɛ dii", spanish: "madre bueno" },
    question: { thai: "มีแม่ไหม", es: "mii mɛ̂ɛ mǎi", spanish: "¿Hay madre?" },
    answer: { thai: "มีแม่", es: "mii mɛ̂ɛ", spanish: "Sí, hay" }
  },
  {
    rank: 134, thai: "ช่วย", es: "chûai", spanish: "ayudar", english: "to help", rtgs: "", cefr: null, freq: 134, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันช่วย", es: "chǎn chûai", spanish: "Yo ayudo" },
    question: { thai: "คุณช่วยไหม", es: "khun chûai mǎi", spanish: "¿Tú ayudo?" },
    answer: { thai: "ช่วย", es: "chûai", spanish: "ayudar" }
  },
  {
    rank: 135, thai: "พอ", es: "phɔɔ", spanish: "suficiente", english: "enough", rtgs: "", cefr: null, freq: 135, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ฉันพอกินแล้ว", es: "chǎn phŏ gin lɛ́ɛo", spanish: "ya comí suficiente", en: "I've eaten enough" },
    question: { thai: "คุณอิ่มหรือยัง", es: "khun ìm rʉ̌ʉ yang", spanish: "¿Ya estás lleno?", en: "Are you full yet?" },
    answer: { thai: "พอแล้ว", es: "phŏ lɛ́ɛo", spanish: "es suficiente", en: "enough" }
  },
  {
    rank: 136, thai: "ระหว่าง", es: "ráwàaŋ", spanish: "entre / durante", english: "between", rtgs: "", cefr: null, freq: 136, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ระหว่างทางฉันหิว", es: "rá-wàang thaang chǎn hǐu", spanish: "durante el camino tuve hambre", en: "during the way I got hungry" },
    question: { thai: "เมื่อไรคุณหิว", es: "mʉ̂a-rai khun hǐu", spanish: "¿Cuándo tuviste hambre?", en: "When did you get hungry?" },
    answer: { thai: "ระหว่างทาง", es: "rá-wàang thaang", spanish: "durante el camino", en: "during the way" }
  },
  {
    rank: 137, thai: "เงิน", es: "ngən", spanish: "dinero", english: "money", rtgs: "", cefr: null, freq: 137, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เงินดี", es: "ngən dii", spanish: "dinero bueno" },
    question: { thai: "มีเงินไหม", es: "mii ngən mǎi", spanish: "¿Hay dinero?" },
    answer: { thai: "มีเงิน", es: "mii ngən", spanish: "Sí, hay" }
  },
  {
    rank: 138, thai: "เอง", es: "eeŋ", spanish: "mismo / por sí", english: "self", rtgs: "", cefr: null, freq: 138, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "ฉันเองทำ", es: "chǎn een tham", spanish: "yo mismo lo hice, en: "I did it myself" },
    question: { thai: "เองคือใคร", es: "eeŋ khuu khrai", spanish: "¿Quién es mismo?" },
    answer: { thai: "เอง", es: "eeŋ", spanish: "mismo / por sí" }
  },
  {
    rank: 139, thai: "เสีย", es: "sǐa", spanish: "perder / gastar", english: "to lose", rtgs: "", cefr: null, freq: 139, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเสีย", es: "chǎn sǐa", spanish: "Yo perdo" },
    question: { thai: "คุณเสียไหม", es: "khun sǐa mǎi", spanish: "¿Tú perdo?" },
    answer: { thai: "เสีย", es: "sǐa", spanish: "perder / gastar" }
  },
  {
    rank: 140, thai: "ผล", es: "pǒn", spanish: "resultado", english: "result", rtgs: "", cefr: null, freq: 140, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ผลดี", es: "pǒn dii", spanish: "resultado bueno" },
    question: { thai: "มีผลไหม", es: "mii pǒn mǎi", spanish: "¿Hay resultado?" },
    answer: { thai: "มีผล", es: "mii pǒn", spanish: "Sí, hay" }
  },
  {
    rank: 141, thai: "แสดง", es: "sàdɛɛŋ", spanish: "mostrar", english: "to show", rtgs: "", cefr: null, freq: 141, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันแสดง", es: "chǎn sàdɛɛŋ", spanish: "Yo mostro" },
    question: { thai: "คุณแสดงไหม", es: "khun sàdɛɛŋ mǎi", spanish: "¿Tú mostro?" },
    answer: { thai: "แสดง", es: "sàdɛɛŋ", spanish: "mostrar" }
  },
  {
    rank: 142, thai: "อัน", es: "?an", spanish: "clasificador", english: "classifier", rtgs: "", cefr: null, freq: 142, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "อันนี้", es: "an níi", spanish: "este (clasificador), en: "this one (classifier)" },
    question: { thai: "อันคือใคร", es: "?an khuu khrai", spanish: "¿Quién es clasificador?" },
    answer: { thai: "อัน", es: "?an", spanish: "clasificador" }
  },
  {
    rank: 143, thai: "เดิน", es: "dəən", spanish: "caminar", english: "to walk", rtgs: "", cefr: null, freq: 143, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเดิน", es: "chǎn dəən", spanish: "Yo camino" },
    question: { thai: "คุณเดินไหม", es: "khun dəən mǎi", spanish: "¿Tú camino?" },
    answer: { thai: "เดิน", es: "dəən", spanish: "caminar" }
  },
  {
    rank: 144, thai: "พี่", es: "phîi", spanish: "hermano mayor", english: "older sibling", rtgs: "", cefr: null, freq: 144, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พี่ดี", es: "phîi dii", spanish: "hermano mayor bueno" },
    question: { thai: "มีพี่ไหม", es: "mii phîi mǎi", spanish: "¿Hay hermano mayor?" },
    answer: { thai: "มีพี่", es: "mii phîi", spanish: "Sí, hay" }
  },
  {
    rank: 145, thai: "สร้าง", es: "sâaŋ", spanish: "crear / construir", english: "to build", rtgs: "", cefr: null, freq: 145, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันสร้าง", es: "chǎn sâaŋ", spanish: "Yo creo" },
    question: { thai: "คุณสร้างไหม", es: "khun sâaŋ mǎi", spanish: "¿Tú creo?" },
    answer: { thai: "สร้าง", es: "sâaŋ", spanish: "crear / construir" }
  },
  {
    rank: 146, thai: "พบ", es: "phóp", spanish: "encontrar", english: "to meet", rtgs: "", cefr: null, freq: 146, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันพบ", es: "chǎn phóp", spanish: "Yo encontro" },
    question: { thai: "คุณพบไหม", es: "khun phóp mǎi", spanish: "¿Tú encontro?" },
    answer: { thai: "พบ", es: "phóp", spanish: "encontrar" }
  },
  {
    rank: 147, thai: "ทำงาน", es: "tham-ŋaan", spanish: "trabajar", english: "to work", rtgs: "", cefr: null, freq: 147, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันทำงาน", es: "chǎn tham-ŋaan", spanish: "Yo trabajo" },
    question: { thai: "คุณทำงานไหม", es: "khun tham-ŋaan mǎi", spanish: "¿Tú trabajo?" },
    answer: { thai: "ทำงาน", es: "tham-ŋaan", spanish: "trabajar" }
  },
  {
    rank: 148, thai: "สี", es: "sǐi", spanish: "color", english: "color", rtgs: "", cefr: null, freq: 148, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สีดี", es: "sǐi dii", spanish: "color bueno" },
    question: { thai: "มีสีไหม", es: "mii sǐi mǎi", spanish: "¿Hay color?" },
    answer: { thai: "มีสี", es: "mii sǐi", spanish: "Sí, hay" }
  },
  {
    rank: 149, thai: "ใจ", es: "jai", spanish: "corazón / mente", english: "heart", rtgs: "", cefr: null, freq: 149, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ใจดี", es: "jai dii", spanish: "corazón / mente bueno" },
    question: { thai: "มีใจไหม", es: "mii jai mǎi", spanish: "¿Hay corazón?" },
    answer: { thai: "มีใจ", es: "mii jai", spanish: "Sí, hay" }
  },
  {
    rank: 150, thai: "น่า", es: "nâa", spanish: "dar (sensación)", english: "worth -ing", rtgs: "", cefr: null, freq: 150, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันน่า", es: "chǎn nâa", spanish: "Yo doy (sensación)" },
    question: { thai: "คุณน่าไหม", es: "khun nâa mǎi", spanish: "¿Tú das (sensación)?" },
    answer: { thai: "น่า", es: "nâa", spanish: "dar (sensación)" }
  },
  {
    rank: 151, thai: "กำหนด", es: "gamnòt", spanish: "determinar / fijar", english: "to set", rtgs: "", cefr: null, freq: 151, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกำหนด", es: "chǎn gamnòt", spanish: "Yo determino" },
    question: { thai: "คุณกำหนดไหม", es: "khun gamnòt mǎi", spanish: "¿Tú determino?" },
    answer: { thai: "กำหนด", es: "gamnòt", spanish: "determinar / fijar" }
  },
  {
    rank: 152, thai: "เมือง", es: "mɯaŋ", spanish: "ciudad", english: "city", rtgs: "", cefr: null, freq: 152, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เมืองดี", es: "mɯaŋ dii", spanish: "ciudad bueno" },
    question: { thai: "มีเมืองไหม", es: "mii mɯaŋ mǎi", spanish: "¿Hay ciudad?" },
    answer: { thai: "มีเมือง", es: "mii mɯaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 153, thai: "บน", es: "bon", spanish: "sobre / encima", english: "on", rtgs: "", cefr: null, freq: 153, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "แมวอยู่บนโต๊ะ", es: "mɛɛo yùu bon dto", spanish: "el gato está sobre la mesa", en: "the cat is on the table" },
    question: { thai: "แมวอยู่ที่ไหน", es: "mɛɛo yùu thîi nǎi", spanish: "¿Dónde está el gato?", en: "Where is the cat?" },
    answer: { thai: "อยู่บนโต๊ะ", es: "yùu bon dto", spanish: "está sobre la mesa", en: "on the table" }
  },
  {
    rank: 154, thai: "ที่สุด", es: "thîisùt", spanish: "lo más", english: "the most", rtgs: "", cefr: null, freq: 154, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "นี่คือของที่ดีที่สุด", es: "nîi khuue kǒng thîi dii thîi-sùt", spanish: "esto es lo mejor", en: "this is the best thing" },
    question: { thai: "ของไหนดีที่สุด", es: "kǒng nǎi dii thîi-sùt", spanish: "¿Cuál es el mejor?", en: "Which is the best?" },
    answer: { thai: "อันนี้ดีที่สุด", es: "an níi dii thîi-sùt", spanish: "este es el mejor", en: "this one is the best" }
  },
  {
    rank: 155, thai: "แก่", es: "kɛ̀ɛ", spanish: "viejo (edad)", english: "old (age)", rtgs: "", cefr: null, freq: 155, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "คุณยายแก่มาก", es: "khun-yai glàai mâak", spanish: "la abuela es muy anciana", en: "the grandmother is very old" },
    question: { thai: "คุณยายอายุเท่าไร", es: "khun-yai aa-yu thâo rai", spanish: "¿Cuántos años tiene la abuela?", en: "How old is the grandmother?" },
    answer: { thai: "แก่มากแล้ว", es: "glàai mâak lɛ́ɛo", spanish: "ya es muy mayor", en: "she's very old now" }
  },
  {
    rank: 156, thai: "น้อย", es: "nɔ̂ɔi", spanish: "poco", english: "few", rtgs: "", cefr: null, freq: 156, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "ฉันมีเวลาน้อย", es: "chǎn mii welaa nŏi", spanish: "tengo poco tiempo", en: "I have little time" },
    question: { thai: "คุณมีเวลามากไหม", es: "khun mii welaa mâak mǎi", spanish: "¿Tienes mucho tiempo?", en: "Do you have a lot of time?" },
    answer: { thai: "ไม่ มีน้อย", es: "mâi, mii nŏi", spanish: "no, poco", en: "no, little" }
  },
  {
    rank: 157, thai: "กิน", es: "gin", spanish: "comer", english: "to eat", rtgs: "", cefr: null, freq: 157, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันกินข้าว", es: "chǎn gin khâao", spanish: "Como arroz" },
    question: { thai: "คุณกินอะไร", es: "khun gin à-rai", spanish: "¿Qué comes?" },
    answer: { thai: "กินข้าวผัด", es: "gin khâao-phàt", spanish: "Como arroz frito" }
  },
  {
    rank: 158, thai: "ระบบ", es: "rabop", spanish: "sistema", english: "system", rtgs: "", cefr: null, freq: 158, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ระบบดี", es: "rabop dii", spanish: "sistema bueno" },
    question: { thai: "มีระบบไหม", es: "mii rabop mǎi", spanish: "¿Hay sistema?" },
    answer: { thai: "มีระบบ", es: "mii rabop", spanish: "Sí, hay" }
  },
  {
    rank: 159, thai: "ร่วม", es: "rùam", spanish: "junto / cooperar", english: "together", rtgs: "", cefr: null, freq: 159, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "เราร่วมงานกัน", es: "rao rûam ngaan gan", spanish: "trabajamos juntos", en: "we work together" },
    question: { thai: "พวกเขาทำงานด้วยกันไหม", es: "phûak khǎo tam-ngaan dûuai gan mǎi", spanish: "¿Trabajan juntos?", en: "Do they work together?" },
    answer: { thai: "ใช่ ร่วมกัน", es: "châi, rûam gan", spanish: "sí, juntos", en: "yes, together" }
  },
  {
    rank: 160, thai: "หาก", es: "hàak", spanish: "si", english: "if", rtgs: "", cefr: null, freq: 160, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "หากมีเวลา ฉันจะไป", es: "hàak mii welaa, chǎn jà bpai", spanish: "si tengo tiempo, iré", en: "if I have time, I'll go" },
    question: { thai: "หากว่างจะไปไหม", es: "hàak wâang jà bpai mǎi", spanish: "Si estás libre, ¿irás?", en: "If you're free, will you go?" },
    answer: { thai: "หากว่างจะไป", es: "hàak wâang jà bpai", spanish: "si estoy libre, iré", en: "if I'm free, I'll go" }
  },
  {
    rank: 161, thai: "ควร", es: "khruan", spanish: "deber (consejo)", english: "should", rtgs: "", cefr: null, freq: 161, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันควร", es: "chǎn khruan", spanish: "Yo debo (consejo)" },
    question: { thai: "คุณควรไหม", es: "khun khruan mǎi", spanish: "¿Tú debes (consejo)?" },
    answer: { thai: "ควร", es: "khruan", spanish: "deber (consejo)" }
  },
  {
    rank: 162, thai: "พัฒนา", es: "phátthánaa", spanish: "desarrollar", english: "to develop", rtgs: "", cefr: null, freq: 162, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันพัฒนา", es: "chǎn phátthánaa", spanish: "Yo desarrollo" },
    question: { thai: "คุณพัฒนาไหม", es: "khun phátthánaa mǎi", spanish: "¿Tú desarrollo?" },
    answer: { thai: "พัฒนา", es: "phátthánaa", spanish: "desarrollar" }
  },
  {
    rank: 163, thai: "สูง", es: "sǔuŋ", spanish: "alto", english: "tall", rtgs: "", cefr: null, freq: 163, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ตึกนี้สูงมาก", es: "dtʉk níi sǔung mâak", spanish: "este edificio es muy alto", en: "this building is very tall" },
    question: { thai: "ตึกนี้สูงไหม", es: "dtʉk níi sǔung mǎi", spanish: "¿Es alto este edificio?", en: "Is this building tall?" },
    answer: { thai: "สูงมาก", es: "sǔung mâak", spanish: "sí, muy alto", en: "yes, very tall" }
  },
  {
    rank: 164, thai: "เดียว", es: "diau", spanish: "solo / único", english: "single", rtgs: "", cefr: null, freq: 164, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ฉันมีลูกคนเดียว", es: "chǎn mii lûuk khon diao", spanish: "tengo un solo hijo", en: "I have only one child" },
    question: { thai: "คุณมีลูกกี่คน", es: "khun mii lûuk gii khon", spanish: "¿Cuántos hijos tienes?", en: "How many children do you have?" },
    answer: { thai: "คนเดียว", es: "khon diao", spanish: "solo uno", en: "only one" }
  },
  {
    rank: 165, thai: "ตัวเอง", es: "dtua-eeŋ", spanish: "uno mismo", english: "oneself", rtgs: "", cefr: null, freq: 165, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "ดูแลตัวเอง", es: "duu-lɛɛ dtua-een", spanish: "cuidar de uno mismo, en: "take care of oneself" },
    question: { thai: "ตัวเองคือใคร", es: "dtua-eeŋ khuu khrai", spanish: "¿Quién es uno mismo?" },
    answer: { thai: "ตัวเอง", es: "dtua-eeŋ", spanish: "uno mismo" }
  },
  {
    rank: 166, thai: "แรก", es: "rɛ̂ɛk", spanish: "primero", english: "first", rtgs: "", cefr: null, freq: 166, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ครั้งแรกฉันไม่เข้าใจ", es: "kráng rɛ̂ɛk chǎn mâi kâo-jai", spanish: "la primera vez no entendí", en: "the first time I didn't understand" },
    question: { thai: "คุณเข้าใจตั้งแต่ครั้งแรกไหม", es: "khun kâo-jai dtâng dtɛ̀ɛ kráng rɛ̂ɛk mǎi", spanish: "¿Entendiste desde la primera vez?", en: "Did you understand from the first time?" },
    answer: { thai: "ไม่เข้าใจครั้งแรก", es: "mâi kâo-jai kráng rɛ̂ɛk", spanish: "no entendí la primera vez", en: "I didn't understand the first time" }
  },
  {
    rank: 167, thai: "อาหาร", es: "aa-hǎan", spanish: "comida", english: "food", rtgs: "", cefr: null, freq: 167, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาหารดี", es: "aa-hǎan dii", spanish: "comida bueno" },
    question: { thai: "มีอาหารไหม", es: "mii aa-hǎan mǎi", spanish: "¿Hay comida?" },
    answer: { thai: "มีอาหาร", es: "mii aa-hǎan", spanish: "Sí, hay" }
  },
  {
    rank: 168, thai: "พวก", es: "phûak", spanish: "grupo", english: "group", rtgs: "", cefr: null, freq: 168, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "พวกเรา", es: "phûak rao", spanish: "nosotros, en: "we (group)" },
    question: { thai: "พวกคือใคร", es: "phûak khuu khrai", spanish: "¿Quién es grupo?" },
    answer: { thai: "พวก", es: "phûak", spanish: "grupo" }
  },
  {
    rank: 169, thai: "สาว", es: "sǎao", spanish: "chica", english: "girl", rtgs: "", cefr: null, freq: 169, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สาวดี", es: "sǎao dii", spanish: "chica bueno" },
    question: { thai: "มีสาวไหม", es: "mii sǎao mǎi", spanish: "¿Hay chica?" },
    answer: { thai: "มีสาว", es: "mii sǎao", spanish: "Sí, hay" }
  },
  {
    rank: 170, thai: "ครับ", es: "khráp", spanish: "sí (cortesía masc.)", english: "polite particle", rtgs: "", cefr: null, freq: 170, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "ครับ ผมชื่อสมชาย", es: "khráp, phǒm chûue sǒm-chaai", spanish: "sí, me llamo Somchai, en: "yes, my name is Somchai" },
    question: { thai: "ครับ", es: "khráp", spanish: "sí (cortesía masc.)" },
    answer: { thai: "ครับ", es: "khráp", spanish: "sí (cortesía masc.)" }
  },
  {
    rank: 171, thai: "หลัง", es: "lǎŋ", spanish: "detrás / después", english: "back", rtgs: "", cefr: null, freq: 171, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "หลังบ้านมีต้นไม้", es: "lǎang bâan mii dtôn-mái", spanish: "detrás de la casa hay árboles", en: "behind the house there are trees" },
    question: { thai: "ด้านหลังมีอะไร", es: "dàan lǎang mii a-rai", spanish: "¿Qué hay detrás?", en: "What is behind?" },
    answer: { thai: "มีต้นไม้", es: "mii dtôn-mái", spanish: "hay árboles", en: "there are trees" }
  },
  {
    rank: 172, thai: "นัก", es: "nák", spanish: "muy / experto", english: "very", rtgs: "", cefr: null, freq: 172, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "อร่อยนัก", es: "a-ròi nák", spanish: "es muy delicioso", en: "it's very delicious" },
    question: { thai: "อร่อยไหม", es: "a-ròi mǎi", spanish: "¿Está rico?", en: "Is it delicious?" },
    answer: { thai: "อร่อยนัก", es: "a-ròi nák", spanish: "riquísimo", en: "very delicious" }
  },
  {
    rank: 173, thai: "ฝ่าย", es: "fàai", spanish: "parte / bando", english: "side", rtgs: "", cefr: null, freq: 173, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ฝ่ายดี", es: "fàai dii", spanish: "parte / bando bueno" },
    question: { thai: "มีฝ่ายไหม", es: "mii fàai mǎi", spanish: "¿Hay parte?" },
    answer: { thai: "มีฝ่าย", es: "mii fàai", spanish: "Sí, hay" }
  },
  {
    rank: 174, thai: "เพื่อน", es: "phʉ̂an", spanish: "amigo", english: "friend", rtgs: "", cefr: null, freq: 174, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เพื่อนดี", es: "phʉ̂an dii", spanish: "amigo bueno" },
    question: { thai: "มีเพื่อนไหม", es: "mii phʉ̂an mǎi", spanish: "¿Hay amigo?" },
    answer: { thai: "มีเพื่อน", es: "mii phʉ̂an", spanish: "Sí, hay" }
  },
  {
    rank: 175, thai: "ถาม", es: "thǎam", spanish: "preguntar", english: "to ask", rtgs: "", cefr: null, freq: 175, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันถาม", es: "chǎn thǎam", spanish: "Yo pregunto" },
    question: { thai: "คุณถามไหม", es: "khun thǎam mǎi", spanish: "¿Tú pregunto?" },
    answer: { thai: "ถาม", es: "thǎam", spanish: "preguntar" }
  },
  {
    rank: 176, thai: "กล่าว", es: "klàaw", spanish: "decir / hablar", english: "to say", rtgs: "", cefr: null, freq: 176, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกล่าว", es: "chǎn klàaw", spanish: "Yo deco" },
    question: { thai: "คุณกล่าวไหม", es: "khun klàaw mǎi", spanish: "¿Tú deco?" },
    answer: { thai: "กล่าว", es: "klàaw", spanish: "decir / hablar" }
  },
  {
    rank: 177, thai: "กรณี", es: "gànraii", spanish: "caso", english: "case", rtgs: "", cefr: null, freq: 177, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "กรณีดี", es: "gànraii dii", spanish: "caso bueno" },
    question: { thai: "มีกรณีไหม", es: "mii gànraii mǎi", spanish: "¿Hay caso?" },
    answer: { thai: "มีกรณี", es: "mii gànraii", spanish: "Sí, hay" }
  },
  {
    rank: 178, thai: "ส่ง", es: "sòŋ", spanish: "enviar", english: "to send", rtgs: "", cefr: null, freq: 178, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันส่ง", es: "chǎn sòŋ", spanish: "Yo envio" },
    question: { thai: "คุณส่งไหม", es: "khun sòŋ mǎi", spanish: "¿Tú envio?" },
    answer: { thai: "ส่ง", es: "sòŋ", spanish: "enviar" }
  },
  {
    rank: 179, thai: "เพียง", es: "phiaŋ", spanish: "solo / apenas", english: "only", rtgs: "", cefr: null, freq: 179, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฉันเพียงแค่อยากรู้", es: "chǎn phia kǎe yàak rúu", spanish: "solo quiero saber", en: "I just want to know" },
    question: { thai: "คุณต้องการอะไร", es: "khun dtông-gaan a-rai", spanish: "¿Qué quieres?", en: "What do you want?" },
    answer: { thai: "เพียงแค่รู้", es: "phia kǎe rúu", spanish: "solo saber", en: "just to know" }
  },
  {
    rank: 180, thai: "เริ่ม", es: "rôəm", spanish: "empezar", english: "to begin", rtgs: "", cefr: null, freq: 180, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเริ่ม", es: "chǎn rôəm", spanish: "Yo empezo" },
    question: { thai: "คุณเริ่มไหม", es: "khun rôəm mǎi", spanish: "¿Tú empezo?" },
    answer: { thai: "เริ่ม", es: "rôəm", spanish: "empezar" }
  },
  {
    rank: 181, thai: "ตา", es: "dtaa", spanish: "ojo", english: "eye", rtgs: "", cefr: null, freq: 181, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ตาดี", es: "dtaa dii", spanish: "ojo bueno" },
    question: { thai: "มีตาไหม", es: "mii dtaa mǎi", spanish: "¿Hay ojo?" },
    answer: { thai: "มีตา", es: "mii dtaa", spanish: "Sí, hay" }
  },
  {
    rank: 182, thai: "บ้าง", es: "bâaŋ", spanish: "algunos", english: "some", rtgs: "", cefr: null, freq: 182, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "บางครั้งฉันเหนื่อยบ้าง", es: "baang kráng chǎn nǔeai bàang", spanish: "a veces estoy un poco cansado", en: "sometimes I'm a bit tired" },
    question: { thai: "คุณเหนื่อยไหม", es: "khun nǔeai mǎi", spanish: "¿Estás cansado?", en: "Are you tired?" },
    answer: { thai: "เหนื่อยบ้าง", es: "nǔeai bàang", spanish: "un poco", en: "a bit" }
  },
  {
    rank: 183, thai: "ข้อ", es: "khɔ̂ɔ", spanish: "punto / cuestión", english: "point", rtgs: "", cefr: null, freq: 183, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ข้อดี", es: "khɔ̂ɔ dii", spanish: "punto / cuestión bueno" },
    question: { thai: "มีข้อไหม", es: "mii khɔ̂ɔ mǎi", spanish: "¿Hay punto?" },
    answer: { thai: "มีข้อ", es: "mii khɔ̂ɔ", spanish: "Sí, hay" }
  },
  {
    rank: 184, thai: "ช่วง", es: "chûaŋ", spanish: "período", english: "period", rtgs: "", cefr: null, freq: 184, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ช่วงดี", es: "chûaŋ dii", spanish: "período bueno" },
    question: { thai: "มีช่วงไหม", es: "mii chûaŋ mǎi", spanish: "¿Hay período?" },
    answer: { thai: "มีช่วง", es: "mii chûaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 185, thai: "ระดับ", es: "radàp", spanish: "nivel", english: "level", rtgs: "", cefr: null, freq: 185, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ระดับดี", es: "radàp dii", spanish: "nivel bueno" },
    question: { thai: "มีระดับไหม", es: "mii radàp mǎi", spanish: "¿Hay nivel?" },
    answer: { thai: "มีระดับ", es: "mii radàp", spanish: "Sí, hay" }
  },
  {
    rank: 186, thai: "ตน", es: "ton", spanish: "uno mismo (formal)", english: "self", rtgs: "", cefr: null, freq: 186, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "ตนเอง", es: "ton een", spanish: "uno mismo (formal), en: "oneself (formal)" },
    question: { thai: "ตนคือใคร", es: "ton khuu khrai", spanish: "¿Quién es uno mismo (formal)?" },
    answer: { thai: "ตน", es: "ton", spanish: "uno mismo (formal)" }
  },
  {
    rank: 187, thai: "รัก", es: "rák", spanish: "amar", english: "to love", rtgs: "", cefr: null, freq: 187, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรัก", es: "chǎn rák", spanish: "Yo amo" },
    question: { thai: "คุณรักไหม", es: "khun rák mǎi", spanish: "¿Tú amas?" },
    answer: { thai: "รัก", es: "rák", spanish: "amar" }
  },
  {
    rank: 188, thai: "เกี่ยวกับ", es: "kìaw-gàp", spanish: "sobre / acerca de", english: "about", rtgs: "", cefr: null, freq: 188, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "หนังสือเกี่ยวกับประวัติศาสตร์", es: "nǎng-sǔe gìao gàp bprà-wàt sǎat", spanish: "un libro sobre historia", en: "a book about history" },
    question: { thai: "หนังสือเล่มนี้เกี่ยวกับอะไร", es: "nǎng-sǔe lêm níi gìao gàp a-rai", spanish: "¿De qué trata este libro?", en: "What is this book about?" },
    answer: { thai: "เกี่ยวกับประวัติศาสตร์", es: "gìao gàp bprà-wàt sǎat", spanish: "sobre historia", en: "about history" }
  },
  {
    rank: 189, thai: "จัด", es: "jàt", spanish: "organizar", english: "to arrange", rtgs: "", cefr: null, freq: 189, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจัด", es: "chǎn jàt", spanish: "Yo organizo" },
    question: { thai: "คุณจัดไหม", es: "khun jàt mǎi", spanish: "¿Tú organizo?" },
    answer: { thai: "จัด", es: "jàt", spanish: "organizar" }
  },
  {
    rank: 190, thai: "ห้อง", es: "hɔ̂ɔŋ", spanish: "habitación", english: "room", rtgs: "", cefr: null, freq: 190, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ห้องดี", es: "hɔ̂ɔŋ dii", spanish: "habitación bueno" },
    question: { thai: "มีห้องไหม", es: "mii hɔ̂ɔŋ mǎi", spanish: "¿Hay habitación?" },
    answer: { thai: "มีห้อง", es: "mii hɔ̂ɔŋ", spanish: "Sí, hay" }
  },
  {
    rank: 191, thai: "ลักษณะ", es: "laksàna", spanish: "característica", english: "characteristic", rtgs: "", cefr: null, freq: 191, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ลักษณะดี", es: "laksàna dii", spanish: "característica bueno" },
    question: { thai: "มีลักษณะไหม", es: "mii laksàna mǎi", spanish: "¿Hay característica?" },
    answer: { thai: "มีลักษณะ", es: "mii laksàna", spanish: "Sí, hay" }
  },
  {
    rank: 192, thai: "วันที่", es: "wan-thîi", spanish: "fecha", english: "date", rtgs: "", cefr: null, freq: 192, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "วันที่ดี", es: "wan-thîi dii", spanish: "fecha bueno" },
    question: { thai: "มีวันที่ไหม", es: "mii wan-thîi mǎi", spanish: "¿Hay fecha?" },
    answer: { thai: "มีวันที่", es: "mii wan-thîi", spanish: "Sí, hay" }
  },
  {
    rank: 193, thai: "กฎหมาย", es: "kòt-mǎai", spanish: "ley", english: "law", rtgs: "", cefr: null, freq: 193, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "กฎหมายดี", es: "kòt-mǎai dii", spanish: "ley bueno" },
    question: { thai: "มีกฎหมายไหม", es: "mii kòt-mǎai mǎi", spanish: "¿Hay ley?" },
    answer: { thai: "มีกฎหมาย", es: "mii kòt-mǎai", spanish: "Sí, hay" }
  },
  {
    rank: 194, thai: "ดังกล่าว", es: "daŋ-glàaw", spanish: "mencionado", english: "as said", rtgs: "", cefr: null, freq: 194, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "บุคคลดังกล่าวมาแล้ว", es: "bùk-khon dang-glài maa lɛ́ɛo", spanish: "la persona mencionada", en: "the aforementioned person" },
    question: { thai: "บุคคลดังกล่าวมาถึงไหน", es: "bùk-khon dang-glài maa thǔng nǎi", spanish: "¿La persona mencionada llegó?", en: "Did the mentioned person arrive?" },
    answer: { thai: "มาแล้ว", es: "maa lɛ́ɛo", spanish: "ya llegó", en: "has arrived" }
  },
  {
    rank: 195, thai: "อำนาจ", es: "amnaat", spanish: "poder", english: "power", rtgs: "", cefr: null, freq: 195, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อำนาจดี", es: "amnaat dii", spanish: "poder bueno" },
    question: { thai: "มีอำนาจไหม", es: "mii amnaat mǎi", spanish: "¿Hay poder?" },
    answer: { thai: "มีอำนาจ", es: "mii amnaat", spanish: "Sí, hay" }
  },
  {
    rank: 196, thai: "พ่อ", es: "phɔ̂ɔ", spanish: "padre", english: "father", rtgs: "", cefr: null, freq: 196, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พ่อดี", es: "phɔ̂ɔ dii", spanish: "padre bueno" },
    question: { thai: "มีพ่อไหม", es: "mii phɔ̂ɔ mǎi", spanish: "¿Hay padre?" },
    answer: { thai: "มีพ่อ", es: "mii phɔ̂ɔ", spanish: "Sí, hay" }
  },
  {
    rank: 197, thai: "ไหน", es: "nǎi", spanish: "cuál / dónde", english: "which", rtgs: "", cefr: null, freq: 197, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "อันไหน", es: "an nǎi", spanish: "¿cuál?, en: "which one?" },
    question: { thai: "ไหนคือใคร", es: "nǎi khuu khrai", spanish: "¿Quién es cuál?" },
    answer: { thai: "ไหน", es: "nǎi", spanish: "cuál / dónde" }
  },
  {
    rank: 198, thai: "บุคคล", es: "bùkkhon", spanish: "individuo", english: "person", rtgs: "", cefr: null, freq: 198, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บุคคลดี", es: "bùkkhon dii", spanish: "individuo bueno" },
    question: { thai: "มีบุคคลไหม", es: "mii bùkkhon mǎi", spanish: "¿Hay individuo?" },
    answer: { thai: "มีบุคคล", es: "mii bùkkhon", spanish: "Sí, hay" }
  },
  {
    rank: 199, thai: "รวม", es: "ruam", spanish: "incluir / total", english: "to include", rtgs: "", cefr: null, freq: 199, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันรวม", es: "chǎn ruam", spanish: "Yo incluo" },
    question: { thai: "คุณรวมไหม", es: "khun ruam mǎi", spanish: "¿Tú incluo?" },
    answer: { thai: "รวม", es: "ruam", spanish: "incluir / total" }
  },
  {
    rank: 200, thai: "จำนวน", es: "jamnǔan", spanish: "cantidad", english: "amount", rtgs: "", cefr: null, freq: 200, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จำนวนดี", es: "jamnǔan dii", spanish: "cantidad bueno" },
    question: { thai: "มีจำนวนไหม", es: "mii jamnǔan mǎi", spanish: "¿Hay cantidad?" },
    answer: { thai: "มีจำนวน", es: "mii jamnǔan", spanish: "Sí, hay" }
  },
  {
    rank: 201, thai: "ตอน", es: "tɔɔn", spanish: "parte / momento", english: "section", rtgs: "", cefr: null, freq: 201, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ตอนดี", es: "tɔɔn dii", spanish: "parte / momento bueno" },
    question: { thai: "มีตอนไหม", es: "mii tɔɔn mǎi", spanish: "¿Hay parte?" },
    answer: { thai: "มีตอน", es: "mii tɔɔn", spanish: "Sí, hay" }
  },
  {
    rank: 202, thai: "พิจารณา", es: "phítjǎanaa", spanish: "considerar", english: "to consider", rtgs: "", cefr: null, freq: 202, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันพิจารณา", es: "chǎn phítjǎanaa", spanish: "Yo considero" },
    question: { thai: "คุณพิจารณาไหม", es: "khun phítjǎanaa mǎi", spanish: "¿Tú considero?" },
    answer: { thai: "พิจารณา", es: "phítjǎanaa", spanish: "considerar" }
  },
  {
    rank: 203, thai: "เรียน", es: "riian", spanish: "estudiar", english: "to study", rtgs: "", cefr: null, freq: 203, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเรียน", es: "chǎn riian", spanish: "Yo estudio" },
    question: { thai: "คุณเรียนไหม", es: "khun riian mǎi", spanish: "¿Tú estudio?" },
    answer: { thai: "เรียน", es: "riian", spanish: "estudiar" }
  },
  {
    rank: 204, thai: "ทรง", es: "soŋ", spanish: "realzar (verbo real)", english: "royal verb", rtgs: "", cefr: null, freq: 204, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันทรง", es: "chǎn soŋ", spanish: "Yo realzo (verbo real)" },
    question: { thai: "คุณทรงไหม", es: "khun soŋ mǎi", spanish: "¿Tú realzas (verbo real)?" },
    answer: { thai: "ทรง", es: "soŋ", spanish: "realzar (verbo real)" }
  },
  {
    rank: 205, thai: "ภาพ", es: "phâap", spanish: "imagen", english: "picture", rtgs: "", cefr: null, freq: 205, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ภาพดี", es: "phâap dii", spanish: "imagen bueno" },
    question: { thai: "มีภาพไหม", es: "mii phâap mǎi", spanish: "¿Hay imagen?" },
    answer: { thai: "มีภาพ", es: "mii phâap", spanish: "Sí, hay" }
  },
  {
    rank: 206, thai: "ตรง", es: "troŋ", spanish: "recto / directo", english: "straight", rtgs: "", cefr: null, freq: 206, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ถนนตรงไป", es: "thà-nǒn dtrong bpai", spanish: "la calle va recta", en: "the road goes straight" },
    question: { thai: "ถนนตรงหรือคด", es: "thà-nǒn dtrong rʉ̌ʉ kòt", spanish: "¿La calle es recta o curva?", en: "Is the road straight or curved?" },
    answer: { thai: "ตรง", es: "dtrong", spanish: "recta", en: "straight" }
  },
  {
    rank: 207, thai: "ยิ่ง", es: "yîŋ", spanish: "aún más", english: "more", rtgs: "", cefr: null, freq: 207, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ยิ่งร้อนยิ่งเหนื่อย", es: "yîng róon yîng nǔeai", spanish: "cuanto más calor, más cansancio", en: "the hotter, the more tired" },
    question: { thai: "ยิ่งกินยิ่งอ้วนไหม", es: "yîng gin yîng uân mǎi", spanish: "¿Cuanto más comes, más engordas?", en: "The more you eat, the fatter?" },
    answer: { thai: "ใช่ ยิ่งกินยิ่งอ้วน", es: "châi, yîng gin yîng uân", spanish: "sí, cuanto más como, más engordo", en: "yes, the more I eat, the fatter" }
  },
  {
    rank: 208, thai: "ชอบ", es: "chɔ̂ɔp", spanish: "gustar", english: "to like", rtgs: "", cefr: null, freq: 208, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันชอบ", es: "chǎn chɔ̂ɔp", spanish: "Yo gusto" },
    question: { thai: "คุณชอบไหม", es: "khun chɔ̂ɔp mǎi", spanish: "¿Tú gusto?" },
    answer: { thai: "ชอบ", es: "chɔ̂ɔp", spanish: "gustar" }
  },
  {
    rank: 209, thai: "ภาษา", es: "phaasǎa", spanish: "idioma", english: "language", rtgs: "", cefr: null, freq: 209, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ภาษาดี", es: "phaasǎa dii", spanish: "idioma bueno" },
    question: { thai: "มีภาษาไหม", es: "mii phaasǎa mǎi", spanish: "¿Hay idioma?" },
    answer: { thai: "มีภาษา", es: "mii phaasǎa", spanish: "Sí, hay" }
  },
  {
    rank: 210, thai: "ตั้งแต่", es: "dtàŋ-dtɛ̀ɛ", spanish: "desde", english: "since", rtgs: "", cefr: null, freq: 210, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ตั้งแต่เมื่อวาน", es: "dtâng dtɛ̀ɛ mʉ̂a-waan", spanish: "desde ayer", en: "since yesterday" },
    question: { thai: "คุณอยู่นี่ตั้งแต่เมื่อไร", es: "khun yùu nîi dtâng dtɛ̀ɛ mʉ̂a-rai", spanish: "¿Desde cuándo estás aquí?", en: "Since when are you here?" },
    answer: { thai: "ตั้งแต่เมื่อวาน", es: "dtâng dtɛ̀ɛ mʉ̂a-waan", spanish: "desde ayer", en: "since yesterday" }
  },
  {
    rank: 211, thai: "ดัง", es: "daŋ", spanish: "como / tal", english: "as", rtgs: "", cefr: null, freq: 211, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เสียงดังมาก", es: "sǐang dang mâak", spanish: "el sonido es muy fuerte", en: "the sound is very loud" },
    question: { thai: "เสียงดังไหม", es: "sǐang dang mǎi", spanish: "¿Está fuerte el sonido?", en: "Is the sound loud?" },
    answer: { thai: "ดังมาก", es: "dang mâak", spanish: "sí, muy fuerte", en: "yes, very loud" }
  },
  {
    rank: 212, thai: "ตั้ง", es: "dtàŋ", spanish: "establecer", english: "to set up", rtgs: "", cefr: null, freq: 212, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันตั้ง", es: "chǎn dtàŋ", spanish: "Yo estableco" },
    question: { thai: "คุณตั้งไหม", es: "khun dtàŋ mǎi", spanish: "¿Tú estableco?" },
    answer: { thai: "ตั้ง", es: "dtàŋ", spanish: "establecer" }
  },
  {
    rank: 213, thai: "ผ่าน", es: "pàan", spanish: "pasar / atravesar", english: "to pass", rtgs: "", cefr: null, freq: 213, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันผ่าน", es: "chǎn pàan", spanish: "Yo paso" },
    question: { thai: "คุณผ่านไหม", es: "khun pàan mǎi", spanish: "¿Tú paso?" },
    answer: { thai: "ผ่าน", es: "pàan", spanish: "pasar / atravesar" }
  },
  {
    rank: 214, thai: "นั่ง", es: "nâŋ", spanish: "sentarse", english: "to sit", rtgs: "", cefr: null, freq: 214, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันนั่ง", es: "chǎn nâŋ", spanish: "Yo sentarse" },
    question: { thai: "คุณนั่งไหม", es: "khun nâŋ mǎi", spanish: "¿Tú sentarse?" },
    answer: { thai: "นั่ง", es: "nâŋ", spanish: "sentarse" }
  },
  {
    rank: 215, thai: "ต่อไป", es: "dtɔ̂ɔ-bpai", spanish: "continuar / siguiente", english: "next", rtgs: "", cefr: null, freq: 215, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ทำต่อไป", es: "tam dtòà-bpai", spanish: "continúa", en: "continue" },
    question: { thai: "หยุดหรือทำต่อไป", es: "yùt rʉ̌ʉ tam dtòà-bpai", spanish: "¿Paras o continúas?", en: "Stop or continue?" },
    answer: { thai: "ทำต่อไป", es: "tam dtòà-bpai", spanish: "continúa", en: "continue" }
  },
  {
    rank: 216, thai: "รู้สึก", es: "rúusǔk", spanish: "sentir", english: "to feel", rtgs: "", cefr: null, freq: 216, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรู้สึก", es: "chǎn rúusǔk", spanish: "Yo sento" },
    question: { thai: "คุณรู้สึกไหม", es: "khun rúusǔk mǎi", spanish: "¿Tú sento?" },
    answer: { thai: "รู้สึก", es: "rúusǔk", spanish: "sentir" }
  },
  {
    rank: 217, thai: "ก็ได้", es: "gɔ̂ɔ-dâai", spanish: "también es posible", english: "either way", rtgs: "", cefr: null, freq: 217, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "อันไหนก็ได้", es: "an nǎi gâ dâai", spanish: "cualquiera", en: "any one is fine" },
    question: { thai: "เอาอันไหน", es: "ao an nǎi", spanish: "¿Cuál quieres?", en: "Which one do you want?" },
    answer: { thai: "อันไหนก็ได้", es: "an nǎi gâ dâai", spanish: "cualquiera", en: "any one" }
  },
  {
    rank: 218, thai: "กระทำ", es: "kratham", spanish: "hacer (formal)", english: "to do", rtgs: "", cefr: null, freq: 218, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกระทำ", es: "chǎn kratham", spanish: "Yo hago (formal)" },
    question: { thai: "คุณกระทำไหม", es: "khun kratham mǎi", spanish: "¿Tú haces (formal)?" },
    answer: { thai: "กระทำ", es: "kratham", spanish: "hacer (formal)" }
  },
  {
    rank: 219, thai: "นาน", es: "naan", spanish: "largo tiempo", english: "long time", rtgs: "", cefr: null, freq: 219, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ฉันรอนานแล้ว", es: "chǎn rɔɔ naan lɛ́ɛo", spanish: "esperé mucho tiempo", en: "I've waited a long time" },
    question: { thai: "คุณรอนานไหม", es: "khun rɔɔ naan mǎi", spanish: "¿Esperaste mucho?", en: "Did you wait long?" },
    answer: { thai: "รอนานมาก", es: "rɔɔ naan mâak", spanish: "sí, mucho", en: "yes, a lot" }
  },
  {
    rank: 220, thai: "จีน", es: "jiin", spanish: "China", english: "China", rtgs: "", cefr: null, freq: 220, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "จีนดี", es: "jiin dii", spanish: "China bueno" },
    question: { thai: "มีจีนไหม", es: "mii jiin mǎi", spanish: "¿Hay china?" },
    answer: { thai: "มีจีน", es: "mii jiin", spanish: "Sí, hay" }
  },
  {
    rank: 221, thai: "ชื่อ", es: "chʉ̂a", spanish: "nombre", english: "name", rtgs: "", cefr: null, freq: 221, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ชื่อดี", es: "chʉ̂a dii", spanish: "nombre bueno" },
    question: { thai: "มีชื่อไหม", es: "mii chʉ̂a mǎi", spanish: "¿Hay nombre?" },
    answer: { thai: "มีชื่อ", es: "mii chʉ̂a", spanish: "Sí, hay" }
  },
  {
    rank: 222, thai: "รถ", es: "rót", spanish: "vehículo", english: "vehicle", rtgs: "", cefr: null, freq: 222, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รถดี", es: "rót dii", spanish: "vehículo bueno" },
    question: { thai: "มีรถไหม", es: "mii rót mǎi", spanish: "¿Hay vehículo?" },
    answer: { thai: "มีรถ", es: "mii rót", spanish: "Sí, hay" }
  },
  {
    rank: 223, thai: "เศรษฐกิจ", es: "sètthàgìt", spanish: "economía", english: "economy", rtgs: "", cefr: null, freq: 223, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เศรษฐกิจดี", es: "sètthàgìt dii", spanish: "economía bueno" },
    question: { thai: "มีเศรษฐกิจไหม", es: "mii sètthàgìt mǎi", spanish: "¿Hay economía?" },
    answer: { thai: "มีเศรษฐกิจ", es: "mii sètthàgìt", spanish: "Sí, hay" }
  },
  {
    rank: 224, thai: "มือ", es: "mɯɯ", spanish: "mano", english: "hand", rtgs: "", cefr: null, freq: 224, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "มือดี", es: "mɯɯ dii", spanish: "mano bueno" },
    question: { thai: "มีมือไหม", es: "mii mɯɯ mǎi", spanish: "¿Hay mano?" },
    answer: { thai: "มีมือ", es: "mii mɯɯ", spanish: "Sí, hay" }
  },
  {
    rank: 225, thai: "ตาย", es: "dtaai", spanish: "morir", english: "to die", rtgs: "", cefr: null, freq: 225, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันตาย", es: "chǎn dtaai", spanish: "Yo moro" },
    question: { thai: "คุณตายไหม", es: "khun dtaai mǎi", spanish: "¿Tú moro?" },
    answer: { thai: "ตาย", es: "dtaai", spanish: "morir" }
  },
  {
    rank: 226, thai: "ชาติ", es: "châat", spanish: "nación", english: "nation", rtgs: "", cefr: null, freq: 226, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ชาติดี", es: "châat dii", spanish: "nación bueno" },
    question: { thai: "มีชาติไหม", es: "mii châat mǎi", spanish: "¿Hay nación?" },
    answer: { thai: "มีชาติ", es: "mii châat", spanish: "Sí, hay" }
  },
  {
    rank: 227, thai: "เท่านั้น", es: "thâonán", spanish: "solamente", english: "only", rtgs: "", cefr: null, freq: 227, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "มีเพียงคนเดียวเท่านั้น", es: "mii phia khon diao thâo nán", spanish: "hay solo una persona", en: "there is only one person" },
    question: { thai: "มีกี่คน", es: "mii gii khon", spanish: "¿Cuántos hay?", en: "How many are there?" },
    answer: { thai: "คนเดียวเท่านั้น", es: "khon diao thâo nán", spanish: "solo uno", en: "only one" }
  },
  {
    rank: 228, thai: "การศึกษา", es: "gaansǔeksǎa", spanish: "educación", english: "education", rtgs: "", cefr: null, freq: 228, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "การศึกษาดี", es: "gaansǔeksǎa dii", spanish: "educación bueno" },
    question: { thai: "มีการศึกษาไหม", es: "mii gaansǔeksǎa mǎi", spanish: "¿Hay educación?" },
    answer: { thai: "มีการศึกษา", es: "mii gaansǔeksǎa", spanish: "Sí, hay" }
  },
  {
    rank: 229, thai: "ฟัง", es: "fang", spanish: "escuchar", english: "to listen", rtgs: "", cefr: null, freq: 229, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันฟัง", es: "chǎn fang", spanish: "Yo escucho" },
    question: { thai: "คุณฟังไหม", es: "khun fang mǎi", spanish: "¿Tú escucho?" },
    answer: { thai: "ฟัง", es: "fang", spanish: "escuchar" }
  },
  {
    rank: 230, thai: "ละ", es: "lá", spanish: "o / dejar", english: "or", rtgs: "", cefr: null, freq: 230, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "แล้วจะทำอย่างไรละ", es: "lɛ́ɛw jà tham yàang-rai lá", spanish: "y entonces, ¿qué harás?, en: "so what will you do?" },
    question: { thai: "ละ", es: "lá", spanish: "o / dejar" },
    answer: { thai: "ละ", es: "lá", spanish: "o / dejar" }
  },
  {
    rank: 231, thai: "เล็ก", es: "lék", spanish: "pequeño", english: "small", rtgs: "", cefr: null, freq: 231, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "แมวตัวเล็ก", es: "mɛɛo tua lék", spanish: "gato pequeño", en: "small cat" },
    question: { thai: "แมวตัวใหญ่หรือเล็ก", es: "mɛɛo tua yài rʉ̌ʉ lék", spanish: "¿El gato es grande o pequeño?", en: "Is the cat big or small?" },
    answer: { thai: "ตัวเล็ก", es: "tua lék", spanish: "pequeño", en: "small" }
  },
  {
    rank: 232, thai: "รัฐบาล", es: "ratthában", spanish: "gobierno", english: "government", rtgs: "", cefr: null, freq: 232, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "รัฐบาลดี", es: "ratthában dii", spanish: "gobierno bueno" },
    question: { thai: "มีรัฐบาลไหม", es: "mii ratthában mǎi", spanish: "¿Hay gobierno?" },
    answer: { thai: "มีรัฐบาล", es: "mii ratthában", spanish: "Sí, hay" }
  },
  {
    rank: 233, thai: "หญิง", es: "yǐŋ", spanish: "mujer", english: "woman", rtgs: "", cefr: null, freq: 233, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หญิงดี", es: "yǐŋ dii", spanish: "mujer bueno" },
    question: { thai: "มีหญิงไหม", es: "mii yǐŋ mǎi", spanish: "¿Hay mujer?" },
    answer: { thai: "มีหญิง", es: "mii yǐŋ", spanish: "Sí, hay" }
  },
  {
    rank: 234, thai: "รัฐ", es: "rát", spanish: "estado", english: "state", rtgs: "", cefr: null, freq: 234, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รัฐดี", es: "rát dii", spanish: "estado bueno" },
    question: { thai: "มีรัฐไหม", es: "mii rát mǎi", spanish: "¿Hay estado?" },
    answer: { thai: "มีรัฐ", es: "mii rát", spanish: "Sí, hay" }
  },
  {
    rank: 235, thai: "เพิ่ม", es: "phôəm", spanish: "añadir / aumentar", english: "to add", rtgs: "", cefr: null, freq: 235, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเพิ่ม", es: "chǎn phôəm", spanish: "Yo añado" },
    question: { thai: "คุณเพิ่มไหม", es: "khun phôəm mǎi", spanish: "¿Tú añado?" },
    answer: { thai: "เพิ่ม", es: "phôəm", spanish: "añadir / aumentar" }
  },
  {
    rank: 236, thai: "ผิด", es: "phìt", spanish: "equivocado / error", english: "wrong", rtgs: "", cefr: null, freq: 236, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "คำตอบนี้ผิด", es: "kam dtòp níi pìt", spanish: "esta respuesta es incorrecta", en: "this answer is wrong" },
    question: { thai: "คำตอบถูกหรือผิด", es: "kam dtòp thǔuk rʉ̌ʉ pìt", spanish: "¿La respuesta es correcta o incorrecta?", en: "Is the answer right or wrong?" },
    answer: { thai: "ผิด", es: "pìt", spanish: "incorrecta", en: "wrong" }
  },
  {
    rank: 237, thai: "ขนาด", es: "khanàat", spanish: "tamaño", english: "size", rtgs: "", cefr: null, freq: 237, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ขนาดดี", es: "khanàat dii", spanish: "tamaño bueno" },
    question: { thai: "มีขนาดไหม", es: "mii khanàat mǎi", spanish: "¿Hay tamaño?" },
    answer: { thai: "มีขนาด", es: "mii khanàat", spanish: "Sí, hay" }
  },
  {
    rank: 238, thai: "ยา", es: "yaa", spanish: "medicina", english: "medicine", rtgs: "", cefr: null, freq: 238, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ยาดี", es: "yaa dii", spanish: "medicina bueno" },
    question: { thai: "มียาไหม", es: "mii yaa mǎi", spanish: "¿Hay medicina?" },
    answer: { thai: "มียา", es: "mii yaa", spanish: "Sí, hay" }
  },
  {
    rank: 239, thai: "เรียก", es: "rîak", spanish: "llamar", english: "to call", rtgs: "", cefr: null, freq: 239, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเรียก", es: "chǎn rîak", spanish: "Yo llamo" },
    question: { thai: "คุณเรียกไหม", es: "khun rîak mǎi", spanish: "¿Tú llamo?" },
    answer: { thai: "เรียก", es: "rîak", spanish: "llamar" }
  },
  {
    rank: 240, thai: "ล่ะ", es: "lâ", spanish: "¿y? (partícula)", english: "particle", rtgs: "", cefr: null, freq: 240, notes: "",
    category: "expresiones", tone: "f",
    phrase: { thai: "แล้วเธอล่ะ", es: "lɛ́ɛw thəə lâ", spanish: "¿y tú?, en: "and you?" },
    question: { thai: "ล่ะ", es: "lâ", spanish: "¿y? (partícula)" },
    answer: { thai: "ล่ะ", es: "lâ", spanish: "¿y? (partícula)" }
  },
  {
    rank: 241, thai: "หมด", es: "mòt", spanish: "terminar / todo", english: "all / end", rtgs: "", cefr: null, freq: 241, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันหมด", es: "chǎn mòt", spanish: "Yo termino" },
    question: { thai: "คุณหมดไหม", es: "khun mòt mǎi", spanish: "¿Tú termino?" },
    answer: { thai: "หมด", es: "mòt", spanish: "terminar / todo" }
  },
  {
    rank: 242, thai: "เล่น", es: "lên", spanish: "jugar", english: "to play", rtgs: "", cefr: null, freq: 242, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเล่น", es: "chǎn lên", spanish: "Yo jugo" },
    question: { thai: "คุณเล่นไหม", es: "khun lên mǎi", spanish: "¿Tú jugo?" },
    answer: { thai: "เล่น", es: "lên", spanish: "jugar" }
  },
  {
    rank: 243, thai: "สาม", es: "sǎam", spanish: "tres", english: "three", rtgs: "", cefr: null, freq: 243, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ฉันมีสามเพื่อน", es: "chǎn mii sǎam phʉ̂an", spanish: "tengo tres amigos", en: "I have three friends" },
    question: { thai: "คุณมีเพื่อนกี่คน", es: "khun mii phʉ̂an gii khon", spanish: "¿Cuántos amigos tienes?", en: "How many friends do you have?" },
    answer: { thai: "สามคน", es: "sǎam khon", spanish: "tres", en: "three" }
  },
  {
    rank: 244, thai: "ค่ะ", es: "khâ", spanish: "sí (cortesía fem.)", english: "polite particle", rtgs: "", cefr: null, freq: 244, notes: "",
    category: "expresiones", tone: "f",
    phrase: { thai: "ค่ะ ดิฉันสบายดี", es: "khâ, dì-chǎn sà-baai-dii", spanish: "sí, estoy bien, en: "yes, I'm fine" },
    question: { thai: "ค่ะ", es: "khâ", spanish: "sí (cortesía fem.)" },
    answer: { thai: "ค่ะ", es: "khâ", spanish: "sí (cortesía fem.)" }
  },
  {
    rank: 245, thai: "ค่า", es: "khâa", spanish: "valor / precio", english: "value", rtgs: "", cefr: null, freq: 245, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ค่าดี", es: "khâa dii", spanish: "valor / precio bueno" },
    question: { thai: "มีค่าไหม", es: "mii khâa mǎi", spanish: "¿Hay valor?" },
    answer: { thai: "มีค่า", es: "mii khâa", spanish: "Sí, hay" }
  },
  {
    rank: 246, thai: "ภายใน", es: "phajnǎi", spanish: "dentro de", english: "inside", rtgs: "", cefr: null, freq: 246, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ภายในห้องมีโต๊ะ", es: "phǎai-khǎi hâwng mii dto", spanish: "dentro de la habitación hay una mesa", en: "inside the room there is a table" },
    question: { thai: "ภายในห้องมีอะไร", es: "phǎai-khǎi hâwng mii a-rai", spanish: "¿Qué hay dentro de la habitación?", en: "What is inside the room?" },
    answer: { thai: "มีโต๊ะ", es: "mii dto", spanish: "hay una mesa", en: "a table" }
  },
  {
    rank: 247, thai: "บาท", es: "bàat", spanish: "baht (moneda)", english: "baht", rtgs: "", cefr: null, freq: 247, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บาทดี", es: "bàat dii", spanish: "baht (moneda) bueno" },
    question: { thai: "มีบาทไหม", es: "mii bàat mǎi", spanish: "¿Hay baht (moneda)?" },
    answer: { thai: "มีบาท", es: "mii bàat", spanish: "Sí, hay" }
  },
  {
    rank: 248, thai: "มนุษย์", es: "manút", spanish: "ser humano", english: "human", rtgs: "", cefr: null, freq: 248, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "มนุษย์ดี", es: "manút dii", spanish: "ser humano bueno" },
    question: { thai: "มีมนุษย์ไหม", es: "mii manút mǎi", spanish: "¿Hay ser humano?" },
    answer: { thai: "มีมนุษย์", es: "mii manút", spanish: "Sí, hay" }
  },
  {
    rank: 249, thai: "หลัก", es: "làk", spanish: "principio", english: "principle", rtgs: "", cefr: null, freq: 249, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "หลักดี", es: "làk dii", spanish: "principio bueno" },
    question: { thai: "มีหลักไหม", es: "mii làk mǎi", spanish: "¿Hay principio?" },
    answer: { thai: "มีหลัก", es: "mii làk", spanish: "Sí, hay" }
  },
  {
    rank: 250, thai: "การเมือง", es: "gaanmɯaŋ", spanish: "política", english: "politics", rtgs: "", cefr: null, freq: 250, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "การเมืองดี", es: "gaanmɯaŋ dii", spanish: "política bueno" },
    question: { thai: "มีการเมืองไหม", es: "mii gaanmɯaŋ mǎi", spanish: "¿Hay política?" },
    answer: { thai: "มีการเมือง", es: "mii gaanmɯaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 251, thai: "ประชาชน", es: "prachaa-chon", spanish: "pueblo / ciudadanos", english: "citizens", rtgs: "", cefr: null, freq: 251, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ประชาชนดี", es: "prachaa-chon dii", spanish: "pueblo / ciudadanos bueno" },
    question: { thai: "มีประชาชนไหม", es: "mii prachaa-chon mǎi", spanish: "¿Hay pueblo?" },
    answer: { thai: "มีประชาชน", es: "mii prachaa-chon", spanish: "Sí, hay" }
  },
  {
    rank: 252, thai: "ซื้อ", es: "sʉ́ʉ", spanish: "comprar", english: "to buy", rtgs: "", cefr: null, freq: 252, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันซื้อ", es: "chǎn sʉ́ʉ", spanish: "Yo compro" },
    question: { thai: "คุณซื้อไหม", es: "khun sʉ́ʉ mǎi", spanish: "¿Tú compro?" },
    answer: { thai: "ซื้อ", es: "sʉ́ʉ", spanish: "comprar" }
  },
  {
    rank: 253, thai: "อ่าน", es: "àan", spanish: "leer", english: "to read", rtgs: "", cefr: null, freq: 253, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันอ่าน", es: "chǎn àan", spanish: "Yo leo" },
    question: { thai: "คุณอ่านไหม", es: "khun àan mǎi", spanish: "¿Tú lees?" },
    answer: { thai: "อ่าน", es: "àan", spanish: "leer" }
  },
  {
    rank: 254, thai: "เสนอ", es: "sanǒə", spanish: "proponer", english: "to propose", rtgs: "", cefr: null, freq: 254, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเสนอ", es: "chǎn sanǒə", spanish: "Yo propono" },
    question: { thai: "คุณเสนอไหม", es: "khun sanǒə mǎi", spanish: "¿Tú propono?" },
    answer: { thai: "เสนอ", es: "sanǒə", spanish: "proponer" }
  },
  {
    rank: 255, thai: "อย่างไร", es: "yàaŋ-rai", spanish: "cómo", english: "how", rtgs: "", cefr: null, freq: 255, notes: "",
    category: "pronombres", tone: "l",
    phrase: { thai: "เป็นอย่างไร", es: "bpen yàang-rai", spanish: "¿cómo estás?, en: "how are you?" },
    question: { thai: "อย่างไรคือใคร", es: "yàaŋ-rai khuu khrai", spanish: "¿Quién es cómo?" },
    answer: { thai: "อย่างไร", es: "yàaŋ-rai", spanish: "cómo" }
  },
  {
    rank: 256, thai: "ผู้หญิง", es: "phûu-yǐŋ", spanish: "mujer", english: "woman", rtgs: "", cefr: null, freq: 256, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ผู้หญิงดี", es: "phûu-yǐŋ dii", spanish: "mujer bueno" },
    question: { thai: "มีผู้หญิงไหม", es: "mii phûu-yǐŋ mǎi", spanish: "¿Hay mujer?" },
    answer: { thai: "มีผู้หญิง", es: "mii phûu-yǐŋ", spanish: "Sí, hay" }
  },
  {
    rank: 257, thai: "ชาว", es: "chaao", spanish: "gente de", english: "people of", rtgs: "", cefr: null, freq: 257, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ชาวดี", es: "chaao dii", spanish: "gente de bueno" },
    question: { thai: "มีชาวไหม", es: "mii chaao mǎi", spanish: "¿Hay gente de?" },
    answer: { thai: "มีชาว", es: "mii chaao", spanish: "Sí, hay" }
  },
  {
    rank: 258, thai: "แต่ละ", es: "dtɛ̀ɛ-lá", spanish: "cada uno", english: "each", rtgs: "", cefr: null, freq: 258, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "แต่ละคนมีความคิดต่างกัน", es: "dtɛ̀ɛ-lá khon mii kwaam-kít tàang gan", spanish: "cada persona piensa distinto", en: "each person thinks differently" },
    question: { thai: "ทุกคนคิดเหมือนกันไหม", es: "thúk khon kít mǔean gan mǎi", spanish: "¿Todos piensan igual?", en: "Does everyone think the same?" },
    answer: { thai: "ไม่ แต่ละคนต่างกัน", es: "mâi, dtɛ̀ɛ-lá khon tàang gan", spanish: "no, cada uno distinto", en: "no, each differently" }
  },
  {
    rank: 259, thai: "ต้องการ", es: "dtɔ̂ɔŋ-gaan", spanish: "necesitar", english: "to need", rtgs: "", cefr: null, freq: 259, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันต้องการ", es: "chǎn dtɔ̂ɔŋ-gaan", spanish: "Yo necesito" },
    question: { thai: "คุณต้องการไหม", es: "khun dtɔ̂ɔŋ-gaan mǎi", spanish: "¿Tú necesito?" },
    answer: { thai: "ต้องการ", es: "dtɔ̂ɔŋ-gaan", spanish: "necesitar" }
  },
  {
    rank: 260, thai: "ข้อมูล", es: "kǎaw-muun", spanish: "datos", english: "data", rtgs: "", cefr: null, freq: 260, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ข้อมูลดี", es: "kǎaw-muun dii", spanish: "datos bueno" },
    question: { thai: "มีข้อมูลไหม", es: "mii kǎaw-muun mǎi", spanish: "¿Hay datos?" },
    answer: { thai: "มีข้อมูล", es: "mii kǎaw-muun", spanish: "Sí, hay" }
  },
  {
    rank: 261, thai: "รักษา", es: "raksǎa", spanish: "curar / proteger", english: "to cure", rtgs: "", cefr: null, freq: 261, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรักษา", es: "chǎn raksǎa", spanish: "Yo curo" },
    question: { thai: "คุณรักษาไหม", es: "khun raksǎa mǎi", spanish: "¿Tú curo?" },
    answer: { thai: "รักษา", es: "raksǎa", spanish: "curar / proteger" }
  },
  {
    rank: 262, thai: "ใส่", es: "sài", spanish: "poner / llevar", english: "to put on", rtgs: "", cefr: null, freq: 262, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันใส่", es: "chǎn sài", spanish: "Yo pono" },
    question: { thai: "คุณใส่ไหม", es: "khun sài mǎi", spanish: "¿Tú pono?" },
    answer: { thai: "ใส่", es: "sài", spanish: "poner / llevar" }
  },
  {
    rank: 263, thai: "พร้อม", es: "prôom", spanish: "listo", english: "ready", rtgs: "", cefr: null, freq: 263, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ฉันพร้อมแล้ว", es: "chǎn prôm lɛ́ɛo", spanish: "estoy listo", en: "I'm ready" },
    question: { thai: "พร้อมไปหรือยัง", es: "prôm bpai rʉ̌ʉ yang", spanish: "¿Estás listo para ir?", en: "Are you ready to go?" },
    answer: { thai: "พร้อมแล้ว", es: "prôm lɛ́ɛo", spanish: "ya estoy listo", en: "I'm ready now" }
  },
  {
    rank: 264, thai: "เจ้า", es: "jâao", spanish: "amo / señor", english: "lord", rtgs: "", cefr: null, freq: 264, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เจ้าดี", es: "jâao dii", spanish: "amo / señor bueno" },
    question: { thai: "มีเจ้าไหม", es: "mii jâao mǎi", spanish: "¿Hay amo?" },
    answer: { thai: "มีเจ้า", es: "mii jâao", spanish: "Sí, hay" }
  },
  {
    rank: 265, thai: "ปฏิบัติ", es: "patìbàt", spanish: "realizar", english: "to perform", rtgs: "", cefr: null, freq: 265, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันปฏิบัติ", es: "chǎn patìbàt", spanish: "Yo realizo" },
    question: { thai: "คุณปฏิบัติไหม", es: "khun patìbàt mǎi", spanish: "¿Tú realizo?" },
    answer: { thai: "ปฏิบัติ", es: "patìbàt", spanish: "realizar" }
  },
  {
    rank: 266, thai: "ลด", es: "lót", spanish: "reducir", english: "to reduce", rtgs: "", cefr: null, freq: 266, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันลด", es: "chǎn lót", spanish: "Yo reduco" },
    question: { thai: "คุณลดไหม", es: "khun lót mǎi", spanish: "¿Tú reduco?" },
    answer: { thai: "ลด", es: "lót", spanish: "reducir" }
  },
  {
    rank: 267, thai: "ขาย", es: "khǎai", spanish: "vender", english: "to sell", rtgs: "", cefr: null, freq: 267, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันขาย", es: "chǎn khǎai", spanish: "Yo vendo" },
    question: { thai: "คุณขายไหม", es: "khun khǎai mǎi", spanish: "¿Tú vendo?" },
    answer: { thai: "ขาย", es: "khǎai", spanish: "vender" }
  },
  {
    rank: 268, thai: "ตลอด", es: "dtalòot", spanish: "durante / continuo", english: "throughout", rtgs: "", cefr: null, freq: 268, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ฉันรอตลอดคืน", es: "chǎn rɔɔ dtà-lòot kheuu", spanish: "esperé toda la noche", en: "I waited all night" },
    question: { thai: "คุณรอนานไหม", es: "khun rɔɔ naan mǎi", spanish: "¿Esperaste mucho?", en: "Did you wait long?" },
    answer: { thai: "รอตลอดคืน", es: "rɔɔ dtà-lòot kheuu", spanish: "toda la noche", en: "all night" }
  },
  {
    rank: 269, thai: "มัก", es: "mák", spanish: "soler / a menudo", english: "often", rtgs: "", cefr: null, freq: 269, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "เขามักมาสาย", es: "khǎo mák maa sǎai", spanish: "él suele llegar tarde", en: "he often arrives late" },
    question: { thai: "เขามาตรงเวลาไหม", es: "khǎo maa dtrong welaa mǎi", spanish: "¿Él llega puntual?", en: "Does he arrive on time?" },
    answer: { thai: "ไม่ มักสาย", es: "mâi, mák sǎai", spanish: "no, suele tarde", en: "no, often late" }
  },
  {
    rank: 270, thai: "ติด", es: "tìt", spanish: "pegar / conectar", english: "to attach", rtgs: "", cefr: null, freq: 270, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันติด", es: "chǎn tìt", spanish: "Yo pego" },
    question: { thai: "คุณติดไหม", es: "khun tìt mǎi", spanish: "¿Tú pego?" },
    answer: { thai: "ติด", es: "tìt", spanish: "pegar / conectar" }
  },
  {
    rank: 271, thai: "เขียน", es: "khǐan", spanish: "escribir", english: "to write", rtgs: "", cefr: null, freq: 271, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเขียน", es: "chǎn khǐan", spanish: "Yo escribo" },
    question: { thai: "คุณเขียนไหม", es: "khun khǐan mǎi", spanish: "¿Tú escribo?" },
    answer: { thai: "เขียน", es: "khǐan", spanish: "escribir" }
  },
  {
    rank: 272, thai: "ก็คือ", es: "gɔ̂ɔ-khuu", spanish: "o sea", english: "that is", rtgs: "", cefr: null, freq: 272, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ปัญหาก็คือเวลา", es: "pan-hǎa gâ khuue welaa", spanish: "el problema es el tiempo", en: "the problem is time" },
    question: { thai: "ปัญหาคืออะไร", es: "pan-hǎa khuue a-rai", spanish: "¿Cuál es el problema?", en: "What is the problem?" },
    answer: { thai: "ก็คือเวลา", es: "gâ khuue welaa", spanish: "es el tiempo", en: "it's time" }
  },
  {
    rank: 273, thai: "ประชุม", es: "prachum", spanish: "reunión", english: "meeting", rtgs: "", cefr: null, freq: 273, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประชุมดี", es: "prachum dii", spanish: "reunión bueno" },
    question: { thai: "มีประชุมไหม", es: "mii prachum mǎi", spanish: "¿Hay reunión?" },
    answer: { thai: "มีประชุม", es: "mii prachum", spanish: "Sí, hay" }
  },
  {
    rank: 274, thai: "คณะกรรมการ", es: "khaná-kam-ma-kaan", spanish: "comité", english: "committee", rtgs: "", cefr: null, freq: 274, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "คณะกรรมการดี", es: "khaná-kam-ma-kaan dii", spanish: "comité bueno" },
    question: { thai: "มีคณะกรรมการไหม", es: "mii khaná-kam-ma-kaan mǎi", spanish: "¿Hay comité?" },
    answer: { thai: "มีคณะกรรมการ", es: "mii khaná-kam-ma-kaan", spanish: "Sí, hay" }
  },
  {
    rank: 275, thai: "ทำไม", es: "tham-mai", spanish: "por qué", english: "why", rtgs: "", cefr: null, freq: 275, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "ทำไมไม่มา", es: "tham-mai mâi maa", spanish: "¿por qué no vienes?, en: "why don't you come?" },
    question: { thai: "ทำไมคือใคร", es: "tham-mai khuu khrai", spanish: "¿Quién es por qué?" },
    answer: { thai: "ทำไม", es: "tham-mai", spanish: "por qué" }
  },
  {
    rank: 276, thai: "แค่", es: "khɛ̂ɛ", spanish: "solo / apenas", english: "just", rtgs: "", cefr: null, freq: 276, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ฉันแค่อยากนอน", es: "chǎn khǎe yàak nɔɔn", spanish: "solo quiero dormir", en: "I just want to sleep" },
    question: { thai: "คุณต้องการอะไร", es: "khun dtông-gaan a-rai", spanish: "¿Qué necesitas?", en: "What do you need?" },
    answer: { thai: "แค่นอน", es: "khǎe nɔɔn", spanish: "solo dormir", en: "just sleep" }
  },
  {
    rank: 277, thai: "หน้าที่", es: "nâa-thîi", spanish: "deber / función", english: "duty", rtgs: "", cefr: null, freq: 277, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "หน้าที่ดี", es: "nâa-thîi dii", spanish: "deber / función bueno" },
    question: { thai: "มีหน้าที่ไหม", es: "mii nâa-thîi mǎi", spanish: "¿Hay deber?" },
    answer: { thai: "มีหน้าที่", es: "mii nâa-thîi", spanish: "Sí, hay" }
  },
  {
    rank: 278, thai: "ระยะ", es: "rája", spanish: "distancia / fase", english: "distance", rtgs: "", cefr: null, freq: 278, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ระยะดี", es: "rája dii", spanish: "distancia / fase bueno" },
    question: { thai: "มีระยะไหม", es: "mii rája mǎi", spanish: "¿Hay distancia?" },
    answer: { thai: "มีระยะ", es: "mii rája", spanish: "Sí, hay" }
  },
  {
    rank: 279, thai: "ศึกษา", es: "sǔeksǎa", spanish: "estudiar (formal)", english: "to study", rtgs: "", cefr: null, freq: 279, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันศึกษา", es: "chǎn sǔeksǎa", spanish: "Yo estudio (formal)" },
    question: { thai: "คุณศึกษาไหม", es: "khun sǔeksǎa mǎi", spanish: "¿Tú estudias (formal)?" },
    answer: { thai: "ศึกษา", es: "sǔeksǎa", spanish: "estudiar (formal)" }
  },
  {
    rank: 280, thai: "รูป", es: "rûup", spanish: "imagen / forma", english: "picture", rtgs: "", cefr: null, freq: 280, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รูปดี", es: "rûup dii", spanish: "imagen / forma bueno" },
    question: { thai: "มีรูปไหม", es: "mii rûup mǎi", spanish: "¿Hay imagen?" },
    answer: { thai: "มีรูป", es: "mii rûup", spanish: "Sí, hay" }
  },
  {
    rank: 281, thai: "ผลิต", es: "phà-lìt", spanish: "producir", english: "to produce", rtgs: "", cefr: null, freq: 281, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันผลิต", es: "chǎn phà-lìt", spanish: "Yo produco" },
    question: { thai: "คุณผลิตไหม", es: "khun phà-lìt mǎi", spanish: "¿Tú produco?" },
    answer: { thai: "ผลิต", es: "phà-lìt", spanish: "producir" }
  },
  {
    rank: 282, thai: "อย่า", es: "yàa", spanish: "no hagas", english: "don't", rtgs: "", cefr: null, freq: 282, notes: "",
    category: "expresiones", tone: "l",
    phrase: { thai: "อย่าไป!", es: "yàa bpai!", spanish: "¡no vayas!, en: "don't go!" },
    question: { thai: "อย่า", es: "yàa", spanish: "no hagas" },
    answer: { thai: "อย่า", es: "yàa", spanish: "no hagas" }
  },
  {
    rank: 283, thai: "เลือก", es: "lʉ̂ak", spanish: "elegir", english: "to choose", rtgs: "", cefr: null, freq: 283, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเลือก", es: "chǎn lʉ̂ak", spanish: "Yo elego" },
    question: { thai: "คุณเลือกไหม", es: "khun lʉ̂ak mǎi", spanish: "¿Tú elego?" },
    answer: { thai: "เลือก", es: "lʉ̂ak", spanish: "elegir" }
  },
  {
    rank: 284, thai: "นั่น", es: "nân", spanish: "eso", english: "that", rtgs: "", cefr: null, freq: 284, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "นั่นคือเพื่อนฉัน", es: "nân khuu phʉ̂an chǎn", spanish: "ese es mi amigo, en: "that is my friend" },
    question: { thai: "นั่นคือใคร", es: "nân khuu khrai", spanish: "¿Quién es eso?" },
    answer: { thai: "นั่น", es: "nân", spanish: "eso" }
  },
  {
    rank: 285, thai: "สู่", es: "sùu", spanish: "hacia", english: "to", rtgs: "", cefr: null, freq: 285, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ฉันไปสู่โรงเรียน", es: "chǎn bpai sùu roong-rian", spanish: "voy hacia la escuela", en: "I go toward school" },
    question: { thai: "คุณไปสู่ไหน", es: "khun bpai sùu nǎi", spanish: "¿Hacia dónde vas?", en: "Where are you heading?" },
    answer: { thai: "สู่โรงเรียน", es: "sùu roong-rian", spanish: "hacia la escuela", en: "toward school" }
  },
  {
    rank: 286, thai: "หรือไม่", es: "rǔɯ-mâi", spanish: "o no", english: "or not", rtgs: "", cefr: null, freq: 286, notes: "",
    category: "expresiones", tone: "r",
    phrase: { thai: "จะไปหรือไม่", es: "jà bpai rǔɯ-mâi", spanish: "¿vas a ir o no?, en: "will you go or not?" },
    question: { thai: "หรือไม่", es: "rǔɯ-mâi", spanish: "o no" },
    answer: { thai: "หรือไม่", es: "rǔɯ-mâi", spanish: "o no" }
  },
  {
    rank: 287, thai: "เดียวกัน", es: "diau-gan", spanish: "mismo / igual", english: "same", rtgs: "", cefr: null, freq: 287, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "เราเรียนโรงเรียนเดียวกัน", es: "rao rian roong-rian diao gan", spanish: "vamos a la misma escuela", en: "we go to the same school" },
    question: { thai: "พวกคุณเรียนที่เดียวกันไหม", es: "phûak khun rian thîi diao gan mǎi", spanish: "¿Van a la misma escuela?", en: "Do you go to the same school?" },
    answer: { thai: "ใช่ โรงเรียนเดียวกัน", es: "châi, roong-rian diao gan", spanish: "sí, la misma", en: "yes, the same" }
  },
  {
    rank: 288, thai: "ตอบ", es: "dtɔ̀ɔp", spanish: "responder", english: "to answer", rtgs: "", cefr: null, freq: 288, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันตอบ", es: "chǎn dtɔ̀ɔp", spanish: "Yo respondo" },
    question: { thai: "คุณตอบไหม", es: "khun dtɔ̀ɔp mǎi", spanish: "¿Tú respondo?" },
    answer: { thai: "ตอบ", es: "dtɔ̀ɔp", spanish: "responder" }
  },
  {
    rank: 289, thai: "ชั้น", es: "chán", spanish: "piso / nivel", english: "floor", rtgs: "", cefr: null, freq: 289, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ชั้นดี", es: "chán dii", spanish: "piso / nivel bueno" },
    question: { thai: "มีชั้นไหม", es: "mii chán mǎi", spanish: "¿Hay piso?" },
    answer: { thai: "มีชั้น", es: "mii chán", spanish: "Sí, hay" }
  },
  {
    rank: 290, thai: "เปลี่ยน", es: "plìan", spanish: "cambiar", english: "to change", rtgs: "", cefr: null, freq: 290, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเปลี่ยน", es: "chǎn plìan", spanish: "Yo cambio" },
    question: { thai: "คุณเปลี่ยนไหม", es: "khun plìan mǎi", spanish: "¿Tú cambio?" },
    answer: { thai: "เปลี่ยน", es: "plìan", spanish: "cambiar" }
  },
  {
    rank: 291, thai: "ตำแหน่ง", es: "tam-nǎeŋ", spanish: "posición / cargo", english: "position", rtgs: "", cefr: null, freq: 291, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ตำแหน่งดี", es: "tam-nǎeŋ dii", spanish: "posición / cargo bueno" },
    question: { thai: "มีตำแหน่งไหม", es: "mii tam-nǎeŋ mǎi", spanish: "¿Hay posición?" },
    answer: { thai: "มีตำแหน่ง", es: "mii tam-nǎeŋ", spanish: "Sí, hay" }
  },
  {
    rank: 292, thai: "สัก", es: "sàk", spanish: "clasif. / unos", english: "about", rtgs: "", cefr: null, freq: 292, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "รอสักครู่", es: "rɔɔ sàk khrûu", spanish: "espera un momento", en: "wait a moment" },
    question: { thai: "รอสักครู่ได้ไหม", es: "rɔɔ sàk khrûu dâai mǎi", spanish: "¿Puedes esperar un momento?", en: "Can you wait a moment?" },
    answer: { thai: "ได้ รอสักครู่", es: "dâai, rɔɔ sàk khrûu", spanish: "sí, espera un momento", en: "yes, wait a moment" }
  },
  {
    rank: 293, thai: "ประโยชน์", es: "prajôot", spanish: "utilidad", english: "benefit", rtgs: "", cefr: null, freq: 293, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประโยชน์ดี", es: "prajôot dii", spanish: "utilidad bueno" },
    question: { thai: "มีประโยชน์ไหม", es: "mii prajôot mǎi", spanish: "¿Hay utilidad?" },
    answer: { thai: "มีประโยชน์", es: "mii prajôot", spanish: "Sí, hay" }
  },
  {
    rank: 294, thai: "ความคิด", es: "khwaam-khít", spanish: "pensamiento", english: "thought", rtgs: "", cefr: null, freq: 294, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ความคิดดี", es: "khwaam-khít dii", spanish: "pensamiento bueno" },
    question: { thai: "มีความคิดไหม", es: "mii khwaam-khít mǎi", spanish: "¿Hay pensamiento?" },
    answer: { thai: "มีความคิด", es: "mii khwaam-khít", spanish: "Sí, hay" }
  },
  {
    rank: 295, thai: "พยายาม", es: "phayaayam", spanish: "esforzarse", english: "to try", rtgs: "", cefr: null, freq: 295, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันพยายาม", es: "chǎn phayaayam", spanish: "Yo esforzarse" },
    question: { thai: "คุณพยายามไหม", es: "khun phayaayam mǎi", spanish: "¿Tú esforzarse?" },
    answer: { thai: "พยายาม", es: "phayaayam", spanish: "esforzarse" }
  },
  {
    rank: 296, thai: "ประจำ", es: "prajam", spanish: "regular / fijo", english: "regular", rtgs: "", cefr: null, freq: 296, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ฉันมาประจำที่นี่", es: "chǎn maa bprà-jam thîi nîi", spanish: "vengo aquí regularmente", en: "I come here regularly" },
    question: { thai: "คุณมาที่นี่บ่อยไหม", es: "khun maa thîi nîi bòi mǎi", spanish: "¿Vienes aquí a menudo?", en: "Do you come here often?" },
    answer: { thai: "มาประจำ", es: "maa bprà-jam", spanish: "sí, regularmente", en: "yes, regularly" }
  },
  {
    rank: 297, thai: "สมัย", es: "samai", spanish: "era / tiempo", english: "era", rtgs: "", cefr: null, freq: 297, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สมัยดี", es: "samai dii", spanish: "era / tiempo bueno" },
    question: { thai: "มีสมัยไหม", es: "mii samai mǎi", spanish: "¿Hay era?" },
    answer: { thai: "มีสมัย", es: "mii samai", spanish: "Sí, hay" }
  },
  {
    rank: 298, thai: "เล่า", es: "lâo", spanish: "contar (historia)", english: "to tell", rtgs: "", cefr: null, freq: 298, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเล่า", es: "chǎn lâo", spanish: "Yo cuento (historia)" },
    question: { thai: "คุณเล่าไหม", es: "khun lâo mǎi", spanish: "¿Tú cuentas (historia)?" },
    answer: { thai: "เล่า", es: "lâo", spanish: "contar (historia)" }
  },
  {
    rank: 299, thai: "เก็บ", es: "kèp", spanish: "guardar", english: "to keep", rtgs: "", cefr: null, freq: 299, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเก็บ", es: "chǎn kèp", spanish: "Yo guardo" },
    question: { thai: "คุณเก็บไหม", es: "khun kèp mǎi", spanish: "¿Tú guardas?" },
    answer: { thai: "เก็บ", es: "kèp", spanish: "guardar" }
  },
  {
    rank: 300, thai: "แม้", es: "mɛ̂ɛ", spanish: "aunque", english: "although", rtgs: "", cefr: null, freq: 300, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "แม้ฝนตก ฉันก็ไป", es: "mɛ́ɛ fǒn dtòk, chǎn gâ bpai", spanish: "aunque llueva, voy", en: "even if it rains, I'll go" },
    question: { thai: "ถ้าฝนตกจะไปไหม", es: "thâa fǒn dtòk jà bpai mǎi", spanish: "Si llueve, ¿irás?", en: "If it rains, will you go?" },
    answer: { thai: "แม้ตกก็ไป", es: "mɛ́ɛ dtòk gâ bpai", spanish: "aunque llueva, voy", en: "even if it rains, I'll go" }
  },
  {
    rank: 301, thai: "แล้วก็", es: "lɛ́ɛw-gɔ̂ɔ", spanish: "y entonces", english: "and then", rtgs: "", cefr: null, freq: 301, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "กินข้าว แล้วก็นอน", es: "gin kâao, lɛ́ɛo gâ nɔɔn", spanish: "comer, y luego dormir", en: "eat, and then sleep" },
    question: { thai: "หลังกินข้าวทำอะไร", es: "lǎang gin kâao tam a-rai", spanish: "¿Qué haces después de comer?", en: "What do you do after eating?" },
    answer: { thai: "แล้วก็นอน", es: "lɛ́ɛo gâ nɔɔn", spanish: "y luego duermo", en: "and then sleep" }
  },
  {
    rank: 302, thai: "นอน", es: "nɔɔn", spanish: "dormir", english: "to sleep", rtgs: "", cefr: null, freq: 302, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันนอน", es: "chǎn nɔɔn", spanish: "Yo dormo" },
    question: { thai: "คุณนอนไหม", es: "khun nɔɔn mǎi", spanish: "¿Tú dormo?" },
    answer: { thai: "นอน", es: "nɔɔn", spanish: "dormir" }
  },
  {
    rank: 303, thai: "ราคา", es: "raa-khaa", spanish: "precio", english: "price", rtgs: "", cefr: null, freq: 303, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ราคาดี", es: "raa-khaa dii", spanish: "precio bueno" },
    question: { thai: "มีราคาไหม", es: "mii raa-khaa mǎi", spanish: "¿Hay precio?" },
    answer: { thai: "มีราคา", es: "mii raa-khaa", spanish: "Sí, hay" }
  },
  {
    rank: 304, thai: "สิทธิ", es: "sìt", spanish: "derecho", english: "right", rtgs: "", cefr: null, freq: 304, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "สิทธิดี", es: "sìt dii", spanish: "derecho bueno" },
    question: { thai: "มีสิทธิไหม", es: "mii sìt mǎi", spanish: "¿Hay derecho?" },
    answer: { thai: "มีสิทธิ", es: "mii sìt", spanish: "Sí, hay" }
  },
  {
    rank: 305, thai: "กระทรวง", es: "krathúaaŋ", spanish: "ministerio", english: "ministry", rtgs: "", cefr: null, freq: 305, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "กระทรวงดี", es: "krathúaaŋ dii", spanish: "ministerio bueno" },
    question: { thai: "มีกระทรวงไหม", es: "mii krathúaaŋ mǎi", spanish: "¿Hay ministerio?" },
    answer: { thai: "มีกระทรวง", es: "mii krathúaaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 306, thai: "วัฒนธรรม", es: "wátthana-tham", spanish: "cultura", english: "culture", rtgs: "", cefr: null, freq: 306, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "วัฒนธรรมดี", es: "wátthana-tham dii", spanish: "cultura bueno" },
    question: { thai: "มีวัฒนธรรมไหม", es: "mii wátthana-tham mǎi", spanish: "¿Hay cultura?" },
    answer: { thai: "มีวัฒนธรรม", es: "mii wátthana-tham", spanish: "Sí, hay" }
  },
  {
    rank: 307, thai: "ชาย", es: "chaai", spanish: "hombre", english: "man", rtgs: "", cefr: null, freq: 307, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ชายดี", es: "chaai dii", spanish: "hombre bueno" },
    question: { thai: "มีชายไหม", es: "mii chaai mǎi", spanish: "¿Hay hombre?" },
    answer: { thai: "มีชาย", es: "mii chaai", spanish: "Sí, hay" }
  },
  {
    rank: 308, thai: "ปัจจุบัน", es: "patjùban", spanish: "actualidad", english: "present", rtgs: "", cefr: null, freq: 308, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ปัจจุบันฉันอยู่กรุงเทพ", es: "bàt-jà-ban chǎn yùu krung-thêep", spanish: "actualmente estoy en Bangkok", en: "currently I'm in Bangkok" },
    question: { thai: "ปัจจุบันคุณอยู่ที่ไหน", es: "bàt-jà-ban khun yùu thîi nǎi", spanish: "¿Dónde estás actualmente?", en: "Where are you currently?" },
    answer: { thai: "อยู่กรุงเทพ", es: "yùu krung-thêep", spanish: "en Bangkok", en: "in Bangkok" }
  },
  {
    rank: 309, thai: "โอกาส", es: "ookàat", spanish: "oportunidad", english: "opportunity", rtgs: "", cefr: null, freq: 309, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "โอกาสดี", es: "ookàat dii", spanish: "oportunidad bueno" },
    question: { thai: "มีโอกาสไหม", es: "mii ookàat mǎi", spanish: "¿Hay oportunidad?" },
    answer: { thai: "มีโอกาส", es: "mii ookàat", spanish: "Sí, hay" }
  },
  {
    rank: 310, thai: "วิธี", es: "wí", spanish: "manera / método", english: "way", rtgs: "", cefr: null, freq: 310, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วิธีดี", es: "wí dii", spanish: "manera / método bueno" },
    question: { thai: "มีวิธีไหม", es: "mii wí mǎi", spanish: "¿Hay manera?" },
    answer: { thai: "มีวิธี", es: "mii wí", spanish: "Sí, hay" }
  },
  {
    rank: 311, thai: "เดิม", es: "dəəm", spanish: "original", english: "original", rtgs: "", cefr: null, freq: 311, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "บ้านเดิมของฉัน", es: "bâan dəəm khǒng chǎn", spanish: "mi casa antigua", en: "my former house" },
    question: { thai: "บ้านเดิมอยู่ที่ไหน", es: "bâan dəəm yùu thîi nǎi", spanish: "¿Dónde está tu casa antigua?", en: "Where is your former house?" },
    answer: { thai: "อยู่เชียงใหม่", es: "yùu chiang-mài", spanish: "en Chiang Mai", en: "in Chiang Mai" }
  },
  {
    rank: 312, thai: "พื้นที่", es: "phʉ̂n-thîi", spanish: "área / lugar", english: "area", rtgs: "", cefr: null, freq: 312, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พื้นที่ดี", es: "phʉ̂n-thîi dii", spanish: "área / lugar bueno" },
    question: { thai: "มีพื้นที่ไหม", es: "mii phʉ̂n-thîi mǎi", spanish: "¿Hay área?" },
    answer: { thai: "มีพื้นที่", es: "mii phʉ̂n-thîi", spanish: "Sí, hay" }
  },
  {
    rank: 313, thai: "หรอก", es: "rɔ̀ɔk", spanish: "¡no! (énfasis)", english: "no way", rtgs: "", cefr: null, freq: 313, notes: "",
    category: "expresiones", tone: "l",
    phrase: { thai: "ไม่เป็นไรหรอก", es: "mâi bpen rai rɔ̀ɔk", spanish: "no te preocupes, en: "never mind" },
    question: { thai: "หรอก", es: "rɔ̀ɔk", spanish: "¡no! (énfasis)" },
    answer: { thai: "หรอก", es: "rɔ̀ɔk", spanish: "¡no! (énfasis)" }
  },
  {
    rank: 314, thai: "ใบ", es: "bai", spanish: "hoja / clasificador", english: "leaf", rtgs: "", cefr: null, freq: 314, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ใบดี", es: "bai dii", spanish: "hoja / clasificador bueno" },
    question: { thai: "มีใบไหม", es: "mii bai mǎi", spanish: "¿Hay hoja?" },
    answer: { thai: "มีใบ", es: "mii bai", spanish: "Sí, hay" }
  },
  {
    rank: 315, thai: "เหตุ", es: "hèt", spanish: "causa / razón", english: "cause", rtgs: "", cefr: null, freq: 315, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เหตุดี", es: "hèt dii", spanish: "causa / razón bueno" },
    question: { thai: "มีเหตุไหม", es: "mii hèt mǎi", spanish: "¿Hay causa?" },
    answer: { thai: "มีเหตุ", es: "mii hèt", spanish: "Sí, hay" }
  },
  {
    rank: 316, thai: "ปรากฏ", es: "pràròot", spanish: "aparecer", english: "to appear", rtgs: "", cefr: null, freq: 316, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันปรากฏ", es: "chǎn pràròot", spanish: "Yo apareco" },
    question: { thai: "คุณปรากฏไหม", es: "khun pràròot mǎi", spanish: "¿Tú apareco?" },
    answer: { thai: "ปรากฏ", es: "pràròot", spanish: "aparecer" }
  },
  {
    rank: 317, thai: "แก", es: "kɛɛ", spanish: "tú (familiar)", english: "you (casual)", rtgs: "", cefr: null, freq: 317, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "แกจะไปไหม", es: "kɛɛ jà bpai mǎi", spanish: "¿vas a ir?, en: "are you going?" },
    question: { thai: "แกคือใคร", es: "kɛɛ khuu khrai", spanish: "¿Quién es tú (familiar)?" },
    answer: { thai: "แก", es: "kɛɛ", spanish: "tú (familiar)" }
  },
  {
    rank: 318, thai: "ถือ", es: "thǔe", spanish: "sostener / considerar", english: "to hold", rtgs: "", cefr: null, freq: 318, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันถือ", es: "chǎn thǔe", spanish: "Yo sosteno" },
    question: { thai: "คุณถือไหม", es: "khun thǔe mǎi", spanish: "¿Tú sosteno?" },
    answer: { thai: "ถือ", es: "thǔe", spanish: "sostener / considerar" }
  },
  {
    rank: 319, thai: "ดำเนินการ", es: "damnoian-gaan", spanish: "proceder", english: "to proceed", rtgs: "", cefr: null, freq: 319, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดำเนินการ", es: "chǎn damnoian-gaan", spanish: "Yo procedo" },
    question: { thai: "คุณดำเนินการไหม", es: "khun damnoian-gaan mǎi", spanish: "¿Tú procedo?" },
    answer: { thai: "ดำเนินการ", es: "damnoian-gaan", spanish: "proceder" }
  },
  {
    rank: 320, thai: "รู้จัก", es: "rúujàk", spanish: "conocer", english: "to know", rtgs: "", cefr: null, freq: 320, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรู้จัก", es: "chǎn rúujàk", spanish: "Yo conoco" },
    question: { thai: "คุณรู้จักไหม", es: "khun rúujàk mǎi", spanish: "¿Tú conoco?" },
    answer: { thai: "รู้จัก", es: "rúujàk", spanish: "conocer" }
  },
  {
    rank: 321, thai: "สุข", es: "sùk", spanish: "feliz / bienaventuranza", english: "happy", rtgs: "", cefr: null, freq: 321, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "ครอบครัวมีความสุข", es: "krôp-kruaa mii kwaam-sùk", spanish: "familia feliz", en: "happy family" },
    question: { thai: "ครอบครัวเป็นอย่างไร", es: "krôp-kruaa pen yàang rai", spanish: "¿Cómo es la familia?", en: "How is the family?" },
    answer: { thai: "มีความสุข", es: "mii kwaam-sùk", spanish: "feliz", en: "happy" }
  },
  {
    rank: 322, thai: "รอบ", es: "rôop", spanish: "alrededor / vuelta", english: "around", rtgs: "", cefr: null, freq: 322, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "รอบบ้านมีต้นไม้", es: "rôp bâan mii dtôn-mái", spanish: "alrededor de la casa hay árboles", en: "around the house there are trees" },
    question: { thai: "รอบบ้านมีอะไร", es: "rôp bâan mii a-rai", spanish: "¿Qué hay alrededor de la casa?", en: "What is around the house?" },
    answer: { thai: "มีต้นไม้", es: "mii dtôn-mái", spanish: "hay árboles", en: "there are trees" }
  },
  {
    rank: 323, thai: "หมอ", es: "mɔ̌ɔ", spanish: "médico", english: "doctor", rtgs: "", cefr: null, freq: 323, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หมอดี", es: "mɔ̌ɔ dii", spanish: "médico bueno" },
    question: { thai: "มีหมอไหม", es: "mii mɔ̌ɔ mǎi", spanish: "¿Hay médico?" },
    answer: { thai: "มีหมอ", es: "mii mɔ̌ɔ", spanish: "Sí, hay" }
  },
  {
    rank: 324, thai: "ข้าง", es: "khâaŋ", spanish: "lado", english: "side", rtgs: "", cefr: null, freq: 324, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้างดี", es: "khâaŋ dii", spanish: "lado bueno" },
    question: { thai: "มีข้างไหม", es: "mii khâaŋ mǎi", spanish: "¿Hay lado?" },
    answer: { thai: "มีข้าง", es: "mii khâaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 325, thai: "สัมพันธ์", es: "samphan", spanish: "relación", english: "relation", rtgs: "", cefr: null, freq: 325, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สัมพันธ์ดี", es: "samphan dii", spanish: "relación bueno" },
    question: { thai: "มีสัมพันธ์ไหม", es: "mii samphan mǎi", spanish: "¿Hay relación?" },
    answer: { thai: "มีสัมพันธ์", es: "mii samphan", spanish: "Sí, hay" }
  },
  {
    rank: 326, thai: "อาการ", es: "aagaa", spanish: "síntoma / estado", english: "symptom", rtgs: "", cefr: null, freq: 326, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาการดี", es: "aagaa dii", spanish: "síntoma / estado bueno" },
    question: { thai: "มีอาการไหม", es: "mii aagaa mǎi", spanish: "¿Hay síntoma?" },
    answer: { thai: "มีอาการ", es: "mii aagaa", spanish: "Sí, hay" }
  },
  {
    rank: 327, thai: "เกิน", es: "gəən", spanish: "demasiado", english: "too much", rtgs: "", cefr: null, freq: 327, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "แพงเกินไป", es: "phaang gəən bpai", spanish: "demasiado caro", en: "too expensive" },
    question: { thai: "ราคาเป็นอย่างไร", es: "raa-khaa pen yàang rai", spanish: "¿Cómo es el precio?", en: "How is the price?" },
    answer: { thai: "แพงเกินไป", es: "phaang gəən bpai", spanish: "demasiado caro", en: "too expensive" }
  },
  {
    rank: 328, thai: "ชนิด", es: "khanít", spanish: "tipo / clase", english: "kind", rtgs: "", cefr: null, freq: 328, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ชนิดดี", es: "khanít dii", spanish: "tipo / clase bueno" },
    question: { thai: "มีชนิดไหม", es: "mii khanít mǎi", spanish: "¿Hay tipo?" },
    answer: { thai: "มีชนิด", es: "mii khanít", spanish: "Sí, hay" }
  },
  {
    rank: 329, thai: "ประเภท", es: "praphêet", spanish: "tipo", english: "type", rtgs: "", cefr: null, freq: 329, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประเภทดี", es: "praphêet dii", spanish: "tipo bueno" },
    question: { thai: "มีประเภทไหม", es: "mii praphêet mǎi", spanish: "¿Hay tipo?" },
    answer: { thai: "มีประเภท", es: "mii praphêet", spanish: "Sí, hay" }
  },
  {
    rank: 330, thai: "จำเป็น", es: "jampen", spanish: "necesario", english: "necessary", rtgs: "", cefr: null, freq: 330, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "การนอนเป็นสิ่งจำเป็น", es: "gaan nɔɔn pen sìng jam-pen", spanish: "dormir es necesario", en: "sleep is necessary" },
    question: { thai: "การนอนจำเป็นไหม", es: "gaan nɔɔn jam-pen mǎi", spanish: "¿Es necesario dormir?", en: "Is sleep necessary?" },
    answer: { thai: "จำเป็นมาก", es: "jam-pen mâak", spanish: "muy necesario", en: "very necessary" }
  },
  {
    rank: 331, thai: "ประกอบ", es: "prakɔ̂ɔp", spanish: "componer / ensamblar", english: "to assemble", rtgs: "", cefr: null, freq: 331, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันประกอบ", es: "chǎn prakɔ̂ɔp", spanish: "Yo compono" },
    question: { thai: "คุณประกอบไหม", es: "khun prakɔ̂ɔp mǎi", spanish: "¿Tú compono?" },
    answer: { thai: "ประกอบ", es: "prakɔ̂ɔp", spanish: "componer / ensamblar" }
  },
  {
    rank: 332, thai: "โรค", es: "rôok", spanish: "enfermedad", english: "disease", rtgs: "", cefr: null, freq: 332, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "โรคดี", es: "rôok dii", spanish: "enfermedad bueno" },
    question: { thai: "มีโรคไหม", es: "mii rôok mǎi", spanish: "¿Hay enfermedad?" },
    answer: { thai: "มีโรค", es: "mii rôok", spanish: "Sí, hay" }
  },
  {
    rank: 333, thai: "ร้าน", es: "ráan", spanish: "tienda", english: "shop", rtgs: "", cefr: null, freq: 333, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ร้านดี", es: "ráan dii", spanish: "tienda bueno" },
    question: { thai: "มีร้านไหม", es: "mii ráan mǎi", spanish: "¿Hay tienda?" },
    answer: { thai: "มีร้าน", es: "mii ráan", spanish: "Sí, hay" }
  },
  {
    rank: 334, thai: "จังหวัด", es: "jaŋ-wát", spanish: "provincia", english: "province", rtgs: "", cefr: null, freq: 334, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "จังหวัดดี", es: "jaŋ-wát dii", spanish: "provincia bueno" },
    question: { thai: "มีจังหวัดไหม", es: "mii jaŋ-wát mǎi", spanish: "¿Hay provincia?" },
    answer: { thai: "มีจังหวัด", es: "mii jaŋ-wát", spanish: "Sí, hay" }
  },
  {
    rank: 335, thai: "พา", es: "phaa", spanish: "llevar / traer", english: "to take", rtgs: "", cefr: null, freq: 335, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันพา", es: "chǎn phaa", spanish: "Yo llevo" },
    question: { thai: "คุณพาไหม", es: "khun phaa mǎi", spanish: "¿Tú llevo?" },
    answer: { thai: "พา", es: "phaa", spanish: "llevar / traer" }
  },
  {
    rank: 336, thai: "เนื่องจาก", es: "nʉ́aŋ-jàak", spanish: "debido a", english: "due to", rtgs: "", cefr: null, freq: 336, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "เนื่องจากฝนตก ฉันไม่ไป", es: "nʉeang jàak fǒn dtòk, chǎn mâi bpai", spanish: "debido a la lluvia, no voy", en: "due to the rain, I won't go" },
    question: { thai: "ทำไมไม่ไป", es: "tham-mai mâi bpai", spanish: "¿Por qué no vas?", en: "Why don't you go?" },
    answer: { thai: "เนื่องจากฝนตก", es: "nʉeang jàak fǒn dtòk", spanish: "debido a la lluvia", en: "due to the rain" }
  },
  {
    rank: 337, thai: "คืน", es: "khüən", spanish: "noche", english: "night", rtgs: "", cefr: null, freq: 337, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คืนดี", es: "khüən dii", spanish: "noche bueno" },
    question: { thai: "มีคืนไหม", es: "mii khüən mǎi", spanish: "¿Hay noche?" },
    answer: { thai: "มีคืน", es: "mii khüən", spanish: "Sí, hay" }
  },
  {
    rank: 338, thai: "น้อง", es: "nɔ́ɔŋ", spanish: "hermano menor", english: "younger sibling", rtgs: "", cefr: null, freq: 338, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "น้องดี", es: "nɔ́ɔŋ dii", spanish: "hermano menor bueno" },
    question: { thai: "มีน้องไหม", es: "mii nɔ́ɔŋ mǎi", spanish: "¿Hay hermano menor?" },
    answer: { thai: "มีน้อง", es: "mii nɔ́ɔŋ", spanish: "Sí, hay" }
  },
  {
    rank: 339, thai: "โดยเฉพาะ", es: "dooi-chà-phɔ̂ɔ", spanish: "especialmente", english: "especially", rtgs: "", cefr: null, freq: 339, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ชอบผลไม้ โดยเฉพาะมะม่วง", es: "chôop pǒn-lá-mái, dooi chà-phǎw má-mûuang", spanish: "me gustan las frutas, especialmente el mango", en: "I like fruits, especially mango" },
    question: { thai: "ชอบผลไม้อะไรเป็นพิเศษ", es: "chôop pǒn-lá-mái a-rai pen phí-sèt", spanish: "¿Qué fruta te gusta especialmente?", en: "Which fruit do you like especially?" },
    answer: { thai: "โดยเฉพาะมะม่วง", es: "dooi chà-phǎw má-mûuang", spanish: "especialmente el mango", en: "especially mango" }
  },
  {
    rank: 340, thai: "ราชการ", es: "raatchá-gaan", spanish: "gobierno (oficial)", english: "government office", rtgs: "", cefr: null, freq: 340, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ราชการดี", es: "raatchá-gaan dii", spanish: "gobierno (oficial) bueno" },
    question: { thai: "มีราชการไหม", es: "mii raatchá-gaan mǎi", spanish: "¿Hay gobierno (oficial)?" },
    answer: { thai: "มีราชการ", es: "mii raatchá-gaan", spanish: "Sí, hay" }
  },
  {
    rank: 341, thai: "ประมาณ", es: "pramǎan", spanish: "aproximadamente", english: "about", rtgs: "", cefr: null, freq: 341, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ประมาณสิบนาที", es: "bprà-maan sìp naa-thii", spanish: "aproximadamente diez minutos", en: "about ten minutes" },
    question: { thai: "ใช้เวลานานเท่าไร", es: "chái welaa naan thâo rai", spanish: "¿Cuánto tiempo toma?", en: "How long does it take?" },
    answer: { thai: "ประมาณสิบนาที", es: "bprà-maan sìp naa-thii", spanish: "unos diez minutos", en: "about ten minutes" }
  },
  {
    rank: 342, thai: "ง่าย", es: "ŋâai", spanish: "fácil", english: "easy", rtgs: "", cefr: null, freq: 342, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "คำถามนี้ง่าย", es: "kam-thǎa níi ngâai", spanish: "esta pregunta es fácil", en: "this question is easy" },
    question: { thai: "คำถามยากหรือง่าย", es: "kam-thǎa yâak rʉ̌ʉ ngâai", spanish: "¿La pregunta es difícil o fácil?", en: "Is the question hard or easy?" },
    answer: { thai: "ง่าย", es: "ngâai", spanish: "fácil", en: "easy" }
  },
  {
    rank: 343, thai: "เปลี่ยนแปลง", es: "plìan-plɛɛŋ", spanish: "cambiar (estado)", english: "to transform", rtgs: "", cefr: null, freq: 343, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเปลี่ยนแปลง", es: "chǎn plìan-plɛɛŋ", spanish: "Yo cambio (estado)" },
    question: { thai: "คุณเปลี่ยนแปลงไหม", es: "khun plìan-plɛɛŋ mǎi", spanish: "¿Tú cambias (estado)?" },
    answer: { thai: "เปลี่ยนแปลง", es: "plìan-plɛɛŋ", spanish: "cambiar (estado)" }
  },
  {
    rank: 344, thai: "ไหม", es: "mǎi", spanish: "¿...o no?", english: "question particle", rtgs: "", cefr: null, freq: 344, notes: "",
    category: "expresiones", tone: "r",
    phrase: { thai: "ไปไหม", es: "bpai mǎi", spanish: "¿vas?, en: "are you going?" },
    question: { thai: "ไหม", es: "mǎi", spanish: "¿...o no?" },
    answer: { thai: "ไหม", es: "mǎi", spanish: "¿...o no?" }
  },
  {
    rank: 345, thai: "อายุ", es: "aayú", spanish: "edad", english: "age", rtgs: "", cefr: null, freq: 345, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อายุดี", es: "aayú dii", spanish: "edad bueno" },
    question: { thai: "มีอายุไหม", es: "mii aayú mǎi", spanish: "¿Hay edad?" },
    answer: { thai: "มีอายุ", es: "mii aayú", spanish: "Sí, hay" }
  },
  {
    rank: 346, thai: "นา", es: "naa", spanish: "campo de arroz", english: "rice field", rtgs: "", cefr: null, freq: 346, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นาดี", es: "naa dii", spanish: "campo de arroz bueno" },
    question: { thai: "มีนาไหม", es: "mii naa mǎi", spanish: "¿Hay campo de arroz?" },
    answer: { thai: "มีนา", es: "mii naa", spanish: "Sí, hay" }
  },
  {
    rank: 347, thai: "ทั้งหมด", es: "tháŋ-mòt", spanish: "todo entero", english: "entirely", rtgs: "", cefr: null, freq: 347, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "ทั้งหมดสามคน", es: "tháng-mòt sǎam khon", spanish: "tres en total", en: "three in total" },
    question: { thai: "มากี่คนทั้งหมด", es: "maa gii khon tháng-mòt", spanish: "¿Cuántos vinieron en total?", en: "How many came in total?" },
    answer: { thai: "สามคนทั้งหมด", es: "sǎam khon tháng-mòt", spanish: "tres en total", en: "three in total" }
  },
  {
    rank: 348, thai: "ความรู้สึก", es: "khwaam-rúusǔk", spanish: "sentimiento", english: "feeling", rtgs: "", cefr: null, freq: 348, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ความรู้สึกดี", es: "khwaam-rúusǔk dii", spanish: "sentimiento bueno" },
    question: { thai: "มีความรู้สึกไหม", es: "mii khwaam-rúusǔk mǎi", spanish: "¿Hay sentimiento?" },
    answer: { thai: "มีความรู้สึก", es: "mii khwaam-rúusǔk", spanish: "Sí, hay" }
  },
  {
    rank: 349, thai: "พรรค", es: "phák", spanish: "partido político", english: "political party", rtgs: "", cefr: null, freq: 349, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "พรรคดี", es: "phák dii", spanish: "partido político bueno" },
    question: { thai: "มีพรรคไหม", es: "mii phák mǎi", spanish: "¿Hay partido político?" },
    answer: { thai: "มีพรรค", es: "mii phák", spanish: "Sí, hay" }
  },
  {
    rank: 350, thai: "สภา", es: "saphǎa", spanish: "asamblea / consejo", english: "council", rtgs: "", cefr: null, freq: 350, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สภาดี", es: "saphǎa dii", spanish: "asamblea / consejo bueno" },
    question: { thai: "มีสภาไหม", es: "mii saphǎa mǎi", spanish: "¿Hay asamblea?" },
    answer: { thai: "มีสภา", es: "mii saphǎa", spanish: "Sí, hay" }
  },
  {
    rank: 351, thai: "เรียกว่า", es: "rîak-wâa", spanish: "se llama", english: "is called", rtgs: "", cefr: null, freq: 351, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเรียกว่า", es: "chǎn rîak-wâa", spanish: "Yo se llama" },
    question: { thai: "คุณเรียกว่าไหม", es: "khun rîak-wâa mǎi", spanish: "¿Tú se llama?" },
    answer: { thai: "เรียกว่า", es: "rîak-wâa", spanish: "se llama" }
  },
  {
    rank: 352, thai: "ที", es: "thii", spanish: "vez / turno", english: "time", rtgs: "", cefr: null, freq: 352, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทีดี", es: "thii dii", spanish: "vez / turno bueno" },
    question: { thai: "มีทีไหม", es: "mii thii mǎi", spanish: "¿Hay vez?" },
    answer: { thai: "มีที", es: "mii thii", spanish: "Sí, hay" }
  },
  {
    rank: 353, thai: "นาง", es: "naaŋ", spanish: "señora", english: "Mrs.", rtgs: "", cefr: null, freq: 353, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นางดี", es: "naaŋ dii", spanish: "señora bueno" },
    question: { thai: "มีนางไหม", es: "mii naaŋ mǎi", spanish: "¿Hay señora?" },
    answer: { thai: "มีนาง", es: "mii naaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 354, thai: "ภาค", es: "phâak", spanish: "región", english: "region", rtgs: "", cefr: null, freq: 354, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ภาคดี", es: "phâak dii", spanish: "región bueno" },
    question: { thai: "มีภาคไหม", es: "mii phâak mǎi", spanish: "¿Hay región?" },
    answer: { thai: "มีภาค", es: "mii phâak", spanish: "Sí, hay" }
  },
  {
    rank: 355, thai: "โครงการ", es: "khroŋ-gaan", spanish: "proyecto", english: "project", rtgs: "", cefr: null, freq: 355, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "โครงการดี", es: "khroŋ-gaan dii", spanish: "proyecto bueno" },
    question: { thai: "มีโครงการไหม", es: "mii khroŋ-gaan mǎi", spanish: "¿Hay proyecto?" },
    answer: { thai: "มีโครงการ", es: "mii khroŋ-gaan", spanish: "Sí, hay" }
  },
  {
    rank: 356, thai: "แทน", es: "thɛɛn", spanish: "en lugar de", english: "instead", rtgs: "", cefr: null, freq: 356, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฉันทำแทนเขา", es: "chǎn tam thǎen khǎo", spanish: "yo lo hago por él", en: "I do it instead of him" },
    question: { thai: "ใครทำแทน", es: "khrai tam thǎen", spanish: "¿Quién lo hace en su lugar?", en: "Who does it instead?" },
    answer: { thai: "ฉันทำแทน", es: "chǎn tam thǎen", spanish: "yo en su lugar", en: "I do instead" }
  },
  {
    rank: 357, thai: "น่ะ", es: "nà", spanish: "¿vale? (partícula)", english: "particle", rtgs: "", cefr: null, freq: 357, notes: "",
    category: "expresiones", tone: "l",
    phrase: { thai: "ไปกันน่ะ", es: "bpai gan nà", spanish: "vamos, ¿vale?, en: "let's go, okay?" },
    question: { thai: "น่ะ", es: "nà", spanish: "¿vale? (partícula)" },
    answer: { thai: "น่ะ", es: "nà", spanish: "¿vale? (partícula)" }
  },
  {
    rank: 358, thai: "โรงเรียน", es: "roŋ-riian", spanish: "escuela", english: "school", rtgs: "", cefr: null, freq: 358, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "โรงเรียนดี", es: "roŋ-riian dii", spanish: "escuela bueno" },
    question: { thai: "มีโรงเรียนไหม", es: "mii roŋ-riian mǎi", spanish: "¿Hay escuela?" },
    answer: { thai: "มีโรงเรียน", es: "mii roŋ-riian", spanish: "Sí, hay" }
  },
  {
    rank: 359, thai: "บริษัท", es: "bɔɔ-rí-sàt", spanish: "empresa", english: "company", rtgs: "", cefr: null, freq: 359, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บริษัทดี", es: "bɔɔ-rí-sàt dii", spanish: "empresa bueno" },
    question: { thai: "มีบริษัทไหม", es: "mii bɔɔ-rí-sàt mǎi", spanish: "¿Hay empresa?" },
    answer: { thai: "มีบริษัท", es: "mii bɔɔ-rí-sàt", spanish: "Sí, hay" }
  },
  {
    rank: 360, thai: "หัว", es: "hǔa", spanish: "cabeza", english: "head", rtgs: "", cefr: null, freq: 360, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หัวดี", es: "hǔa dii", spanish: "cabeza bueno" },
    question: { thai: "มีหัวไหม", es: "mii hǔa mǎi", spanish: "¿Hay cabeza?" },
    answer: { thai: "มีหัว", es: "mii hǔa", spanish: "Sí, hay" }
  },
  {
    rank: 361, thai: "หัน", es: "hǎn", spanish: "volverse / girar", english: "to turn", rtgs: "", cefr: null, freq: 361, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหัน", es: "chǎn hǎn", spanish: "Yo volverse" },
    question: { thai: "คุณหันไหม", es: "khun hǎn mǎi", spanish: "¿Tú volverse?" },
    answer: { thai: "หัน", es: "hǎn", spanish: "volverse / girar" }
  },
  {
    rank: 362, thai: "กลาง", es: "glaaŋ", spanish: "medio / centro", english: "middle", rtgs: "", cefr: null, freq: 362, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "กลางเมืองคนเยอะ", es: "glaang mʉea khon yə", spanish: "en el centro hay mucha gente", en: "in the center there are many people" },
    question: { thai: "กลางเมืองคนเยอะไหม", es: "glaang mʉea khon yə mǎi", spanish: "¿Hay mucha gente en el centro?", en: "Are there many people in the center?" },
    answer: { thai: "เยอะมาก", es: "yə mâak", spanish: "sí, muchísima", en: "yes, very many" }
  },
  {
    rank: 363, thai: "จับ", es: "jàp", spanish: "agarrar", english: "to catch", rtgs: "", cefr: null, freq: 363, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจับ", es: "chǎn jàp", spanish: "Yo agarro" },
    question: { thai: "คุณจับไหม", es: "khun jàp mǎi", spanish: "¿Tú agarro?" },
    answer: { thai: "จับ", es: "jàp", spanish: "agarrar" }
  },
  {
    rank: 364, thai: "ล้าน", es: "láan", spanish: "millón", english: "million", rtgs: "", cefr: null, freq: 364, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "มีเงินล้านบาท", es: "mii ngern láan bàat", spanish: "tiene un millón de baht", en: "has a million baht" },
    question: { thai: "เขามีเงินเท่าไร", es: "khǎo mii ngern thâo rai", spanish: "¿Cuánto dinero tiene?", en: "How much money does he have?" },
    answer: { thai: "ล้านบาท", es: "láan bàat", spanish: "un millón de baht", en: "a million baht" }
  },
  {
    rank: 365, thai: "ยาว", es: "yaao", spanish: "largo", english: "long", rtgs: "", cefr: null, freq: 365, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ผมยาว", es: "phǒm yaao", spanish: "pelo largo", en: "long hair" },
    question: { thai: "ผมสั้นหรือยาว", es: "phǒm sân rʉ̌ʉ yaao", spanish: "¿Pelo corto o largo?", en: "Short or long hair?" },
    answer: { thai: "ยาว", es: "yaao", spanish: "largo", en: "long" }
  },
  {
    rank: 366, thai: "คู่", es: "khûu", spanish: "pareja", english: "pair", rtgs: "", cefr: null, freq: 366, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "คู่ดี", es: "khûu dii", spanish: "pareja bueno" },
    question: { thai: "มีคู่ไหม", es: "mii khûu mǎi", spanish: "¿Hay pareja?" },
    answer: { thai: "มีคู่", es: "mii khûu", spanish: "Sí, hay" }
  },
  {
    rank: 367, thai: "ครอบครัว", es: "khrɔ̂ɔp-khrua", spanish: "familia", english: "family", rtgs: "", cefr: null, freq: 367, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ครอบครัวดี", es: "khrɔ̂ɔp-khrua dii", spanish: "familia bueno" },
    question: { thai: "มีครอบครัวไหม", es: "mii khrɔ̂ɔp-khrua mǎi", spanish: "¿Hay familia?" },
    answer: { thai: "มีครอบครัว", es: "mii khrɔ̂ɔp-khrua", spanish: "Sí, hay" }
  },
  {
    rank: 368, thai: "เดินทาง", es: "dəən-thaaŋ", spanish: "viajar", english: "to travel", rtgs: "", cefr: null, freq: 368, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเดินทาง", es: "chǎn dəən-thaaŋ", spanish: "Yo viajo" },
    question: { thai: "คุณเดินทางไหม", es: "khun dəən-thaaŋ mǎi", spanish: "¿Tú viajo?" },
    answer: { thai: "เดินทาง", es: "dəən-thaaŋ", spanish: "viajar" }
  },
  {
    rank: 369, thai: "ประกาศ", es: "pragàat", spanish: "anunciar", english: "to announce", rtgs: "", cefr: null, freq: 369, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันประกาศ", es: "chǎn pragàat", spanish: "Yo anuncio" },
    question: { thai: "คุณประกาศไหม", es: "khun pragàat mǎi", spanish: "¿Tú anuncio?" },
    answer: { thai: "ประกาศ", es: "pragàat", spanish: "anunciar" }
  },
  {
    rank: 370, thai: "ที่อยู่", es: "thîi-yùu", spanish: "dirección", english: "address", rtgs: "", cefr: null, freq: 370, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ที่อยู่ดี", es: "thîi-yùu dii", spanish: "dirección bueno" },
    question: { thai: "มีที่อยู่ไหม", es: "mii thîi-yùu mǎi", spanish: "¿Hay dirección?" },
    answer: { thai: "มีที่อยู่", es: "mii thîi-yùu", spanish: "Sí, hay" }
  },
  {
    rank: 371, thai: "หนู", es: "nǔu", spanish: "ratón", english: "mouse", rtgs: "", cefr: null, freq: 371, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หนูดี", es: "nǔu dii", spanish: "ratón bueno" },
    question: { thai: "มีหนูไหม", es: "mii nǔu mǎi", spanish: "¿Hay ratón?" },
    answer: { thai: "มีหนู", es: "mii nǔu", spanish: "Sí, hay" }
  },
  {
    rank: 372, thai: "เหล่านี้", es: "lào-níi", spanish: "estos", english: "these", rtgs: "", cefr: null, freq: 372, notes: "",
    category: "pronombres", tone: "l",
    phrase: { thai: "คนเหล่านี้", es: "khon lào-níi", spanish: "estas personas, en: "these people" },
    question: { thai: "เหล่านี้คือใคร", es: "lào-níi khuu khrai", spanish: "¿Quién es estos?" },
    answer: { thai: "เหล่านี้", es: "lào-níi", spanish: "estos" }
  },
  {
    rank: 373, thai: "บริการ", es: "bɔɔ-rí-gaan", spanish: "servicio", english: "service", rtgs: "", cefr: null, freq: 373, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บริการดี", es: "bɔɔ-rí-gaan dii", spanish: "servicio bueno" },
    question: { thai: "มีบริการไหม", es: "mii bɔɔ-rí-gaan mǎi", spanish: "¿Hay servicio?" },
    answer: { thai: "มีบริการ", es: "mii bɔɔ-rí-gaan", spanish: "Sí, hay" }
  },
  {
    rank: 374, thai: "ยืน", es: "yɯɯn", spanish: "estar de pie", english: "to stand", rtgs: "", cefr: null, freq: 374, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันยืน", es: "chǎn yɯɯn", spanish: "Yo estoy de pie" },
    question: { thai: "คุณยืนไหม", es: "khun yɯɯn mǎi", spanish: "¿Tú estás de pie?" },
    answer: { thai: "ยืน", es: "yɯɯn", spanish: "estar de pie" }
  },
  {
    rank: 375, thai: "ข้าว", es: "khâao", spanish: "arroz", english: "rice", rtgs: "", cefr: null, freq: 375, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้าวดี", es: "khâao dii", spanish: "arroz bueno" },
    question: { thai: "มีข้าวไหม", es: "mii khâao mǎi", spanish: "¿Hay arroz?" },
    answer: { thai: "มีข้าว", es: "mii khâao", spanish: "Sí, hay" }
  },
  {
    rank: 376, thai: "คณะ", es: "khana", spanish: "facultad / grupo", english: "faculty", rtgs: "", cefr: null, freq: 376, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "คณะดี", es: "khana dii", spanish: "facultad / grupo bueno" },
    question: { thai: "มีคณะไหม", es: "mii khana mǎi", spanish: "¿Hay facultad?" },
    answer: { thai: "มีคณะ", es: "mii khana", spanish: "Sí, hay" }
  },
  {
    rank: 377, thai: "สิ", es: "sì", spanish: "¿no es?", english: "particle", rtgs: "", cefr: null, freq: 377, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "ไปสิ!", es: "bpai sì!", spanish: "¡ve!, en: "go!" },
    question: { thai: "สิ", es: "sì", spanish: "¿no es?" },
    answer: { thai: "สิ", es: "sì", spanish: "¿no es?" }
  },
  {
    rank: 378, thai: "ยอม", es: "yɔɔm", spanish: "aceptar", english: "to accept", rtgs: "", cefr: null, freq: 378, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันยอม", es: "chǎn yɔɔm", spanish: "Yo acepto" },
    question: { thai: "คุณยอมไหม", es: "khun yɔɔm mǎi", spanish: "¿Tú acepto?" },
    answer: { thai: "ยอม", es: "yɔɔm", spanish: "aceptar" }
  },
  {
    rank: 379, thai: "วิธีการ", es: "wí-gaan", spanish: "método", english: "method", rtgs: "", cefr: null, freq: 379, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วิธีการดี", es: "wí-gaan dii", spanish: "método bueno" },
    question: { thai: "มีวิธีการไหม", es: "mii wí-gaan mǎi", spanish: "¿Hay método?" },
    answer: { thai: "มีวิธีการ", es: "mii wí-gaan", spanish: "Sí, hay" }
  },
  {
    rank: 380, thai: "ดังนั้น", es: "daŋ-nán", spanish: "por lo tanto", english: "therefore", rtgs: "", cefr: null, freq: 380, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฝนตก ดังนั้นฉันไม่ไป", es: "fǒn dtòk, dang-nán chǎn mâi bpai", spanish: "llueve, por lo tanto no voy", en: "it rains, therefore I won't go" },
    question: { thai: "ทำไมไม่ไป", es: "tham-mai mâi bpai", spanish: "¿Por qué no vas?", en: "Why don't you go?" },
    answer: { thai: "ดังนั้นไม่ไป", es: "dang-nán mâi bpai", spanish: "por lo tanto, no voy", en: "therefore, I won't go" }
  },
  {
    rank: 381, thai: "แตกต่าง", es: "dtɛ̀k-tàaŋ", spanish: "diferente", english: "different", rtgs: "", cefr: null, freq: 381, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "สองอย่างแตกต่างกัน", es: "sǒng yàang dtɛ̀k dtàang gan", spanish: "dos cosas son diferentes", en: "two things are different" },
    question: { thai: "สองอย่างเหมือนกันไหม", es: "sǒng yàang mǔean gan mǎi", spanish: "¿Las dos cosas son iguales?", en: "Are the two things the same?" },
    answer: { thai: "ไม่ แตกต่างกัน", es: "mâi, dtɛ̀k dtàang gan", spanish: "no, diferentes", en: "no, different" }
  },
  {
    rank: 382, thai: "สินค้า", es: "sǐn-kháa", spanish: "producto", english: "product", rtgs: "", cefr: null, freq: 382, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สินค้าดี", es: "sǐn-kháa dii", spanish: "producto bueno" },
    question: { thai: "มีสินค้าไหม", es: "mii sǐn-kháa mǎi", spanish: "¿Hay producto?" },
    answer: { thai: "มีสินค้า", es: "mii sǐn-kháa", spanish: "Sí, hay" }
  },
  {
    rank: 383, thai: "วัด", es: "wát", spanish: "templo", english: "temple", rtgs: "", cefr: null, freq: 383, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "วัดดี", es: "wát dii", spanish: "templo bueno" },
    question: { thai: "มีวัดไหม", es: "mii wát mǎi", spanish: "¿Hay templo?" },
    answer: { thai: "มีวัด", es: "mii wát", spanish: "Sí, hay" }
  },
  {
    rank: 384, thai: "สภาพ", es: "saphàap", spanish: "estado / condición", english: "condition", rtgs: "", cefr: null, freq: 384, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สภาพดี", es: "saphàap dii", spanish: "estado / condición bueno" },
    question: { thai: "มีสภาพไหม", es: "mii saphàap mǎi", spanish: "¿Hay estado?" },
    answer: { thai: "มีสภาพ", es: "mii saphàap", spanish: "Sí, hay" }
  },
  {
    rank: 385, thai: "เปล่า", es: "bplào", spanish: "vacío / no", english: "empty", rtgs: "", cefr: null, freq: 385, notes: "",
    category: "adjetivos", tone: "f",
        phrase: { thai: "มือเปล่า", es: "mʉue plào", spanish: "con las manos vacías", en: "empty-handed" },
    question: { thai: "เขามาพร้อมอะไร", es: "khǎo maa prôm a-rai", spanish: "¿Con qué vino?", en: "What did he come with?" },
    answer: { thai: "มือเปล่า", es: "mʉue plào", spanish: "con las manos vacías", en: "empty-handed" }
  },
  {
    rank: 386, thai: "ยก", es: "jók", spanish: "levantantar", english: "to lift", rtgs: "", cefr: null, freq: 386, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันยก", es: "chǎn jók", spanish: "Yo levantanto" },
    question: { thai: "คุณยกไหม", es: "khun jók mǎi", spanish: "¿Tú levantanto?" },
    answer: { thai: "ยก", es: "jók", spanish: "levantantar" }
  },
  {
    rank: 387, thai: "ยิ้ม", es: "yîm", spanish: "sonreír", english: "to smile", rtgs: "", cefr: null, freq: 387, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันยิ้ม", es: "chǎn yîm", spanish: "Yo sonreír" },
    question: { thai: "คุณยิ้มไหม", es: "khun yîm mǎi", spanish: "¿Tú sonreír?" },
    answer: { thai: "ยิ้ม", es: "yîm", spanish: "sonreír" }
  },
  {
    rank: 388, thai: "ชุด", es: "chút", spanish: "conjunto", english: "set", rtgs: "", cefr: null, freq: 388, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ชุดดี", es: "chút dii", spanish: "conjunto bueno" },
    question: { thai: "มีชุดไหม", es: "mii chút mǎi", spanish: "¿Hay conjunto?" },
    answer: { thai: "มีชุด", es: "mii chút", spanish: "Sí, hay" }
  },
  {
    rank: 389, thai: "ปาก", es: "bpàak", spanish: "boca", english: "mouth", rtgs: "", cefr: null, freq: 389, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ปากดี", es: "bpàak dii", spanish: "boca bueno" },
    question: { thai: "มีปากไหม", es: "mii bpàak mǎi", spanish: "¿Hay boca?" },
    answer: { thai: "มีปาก", es: "mii bpàak", spanish: "Sí, hay" }
  },
  {
    rank: 390, thai: "รอ", es: "rɔɔ", spanish: "esperar", english: "to wait", rtgs: "", cefr: null, freq: 390, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันรอ", es: "chǎn rɔɔ", spanish: "Yo espero" },
    question: { thai: "คุณรอไหม", es: "khun rɔɔ mǎi", spanish: "¿Tú espero?" },
    answer: { thai: "รอ", es: "rɔɔ", spanish: "esperar" }
  },
  {
    rank: 391, thai: "จุด", es: "jùt", spanish: "punto", english: "point", rtgs: "", cefr: null, freq: 391, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จุดดี", es: "jùt dii", spanish: "punto bueno" },
    question: { thai: "มีจุดไหม", es: "mii jùt mǎi", spanish: "¿Hay punto?" },
    answer: { thai: "มีจุด", es: "mii jùt", spanish: "Sí, hay" }
  },
  {
    rank: 392, thai: "แรง", es: "rɛɛŋ", spanish: "fuerza / fuerte", english: "strong", rtgs: "", cefr: null, freq: 392, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ลมแรงมาก", es: "lom rɛ̂ng mâak", spanish: "viento muy fuerte", en: "very strong wind" },
    question: { thai: "ลมแรงไหม", es: "lom rɛ̂ng mǎi", spanish: "¿Está fuerte el viento?", en: "Is the wind strong?" },
    answer: { thai: "แรงมาก", es: "rɛ̂ng mâak", spanish: "sí, muy fuerte", en: "yes, very strong" }
  },
  {
    rank: 393, thai: "ไม่ว่า", es: "mâi-wâa", spanish: "sin importar", english: "no matter", rtgs: "", cefr: null, freq: 393, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "ไม่ว่าอย่างไรก็ตาม", es: "mâi wâa yàang-rai gâw-dtaam", spanish: "no importa cómo, en: "no matter what" },
    question: { thai: "ไม่ว่า", es: "mâi-wâa", spanish: "sin importar" },
    answer: { thai: "ไม่ว่า", es: "mâi-wâa", spanish: "sin importar" }
  },
  {
    rank: 394, thai: "บริหาร", es: "bɔɔ-rí-hǎan", spanish: "administrar", english: "to manage", rtgs: "", cefr: null, freq: 394, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันบริหาร", es: "chǎn bɔɔ-rí-hǎan", spanish: "Yo administro" },
    question: { thai: "คุณบริหารไหม", es: "khun bɔɔ-rí-hǎan mǎi", spanish: "¿Tú administro?" },
    answer: { thai: "บริหาร", es: "bɔɔ-rí-hǎan", spanish: "administrar" }
  },
  {
    rank: 395, thai: "ย่อม", es: "yɔ̂ɔm", spanish: "seguramente", english: "certainly", rtgs: "", cefr: null, freq: 395, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ทำดีย่อมได้ดี", es: "tam dii yâam dâai dii", spanish: "haciendo el bien, seguro recibirás el bien", en: "doing good surely leads to good" },
    question: { thai: "ทำดีแล้วจะเป็นอย่างไร", es: "tam dii lɛ́ɛo jà pen yàang rai", spanish: "Si haces el bien, ¿qué pasará?", en: "If you do good, what will happen?" },
    answer: { thai: "ย่อมได้ดี", es: "yâam dâai dii", spanish: "seguro recibirás el bien", en: "surely receive good" }
  },
  {
    rank: 396, thai: "สิบ", es: "sìp", spanish: "diez", english: "ten", rtgs: "", cefr: null, freq: 396, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ฉันซื้อสิบลูก", es: "chǎn sʉ́e sìp lûuk", spanish: "compré diez", en: "I bought ten" },
    question: { thai: "ซื้อกี่ลูก", es: "sʉ́e gii lûuk", spanish: "¿Cuántos compraste?", en: "How many did you buy?" },
    answer: { thai: "สิบลูก", es: "sìp lûuk", spanish: "diez", en: "ten" }
  },
  {
    rank: 397, thai: "ราย", es: "raai", spanish: "artículo / individual", english: "item", rtgs: "", cefr: null, freq: 397, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "รายดี", es: "raai dii", spanish: "artículo / individual bueno" },
    question: { thai: "มีรายไหม", es: "mii raai mǎi", spanish: "¿Hay artículo?" },
    answer: { thai: "มีราย", es: "mii raai", spanish: "Sí, hay" }
  },
  {
    rank: 398, thai: "ต้น", es: "dtôn", spanish: "tronco / origen", english: "origin", rtgs: "", cefr: null, freq: 398, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ต้นดี", es: "dtôn dii", spanish: "tronco / origen bueno" },
    question: { thai: "มีต้นไหม", es: "mii dtôn mǎi", spanish: "¿Hay tronco?" },
    answer: { thai: "มีต้น", es: "mii dtôn", spanish: "Sí, hay" }
  },
  {
    rank: 399, thai: "นโยบาย", es: "ná-jǎa-baai", spanish: "política (plan)", english: "policy", rtgs: "", cefr: null, freq: 399, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นโยบายดี", es: "ná-jǎa-baai dii", spanish: "política (plan) bueno" },
    question: { thai: "มีนโยบายไหม", es: "mii ná-jǎa-baai mǎi", spanish: "¿Hay política (plan)?" },
    answer: { thai: "มีนโยบาย", es: "mii ná-jǎa-baai", spanish: "Sí, hay" }
  },
  {
    rank: 400, thai: "ตัวอย่าง", es: "dtua-yàaŋ", spanish: "ejemplo", english: "example", rtgs: "", cefr: null, freq: 400, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ตัวอย่างดี", es: "dtua-yàaŋ dii", spanish: "ejemplo bueno" },
    question: { thai: "มีตัวอย่างไหม", es: "mii dtua-yàaŋ mǎi", spanish: "¿Hay ejemplo?" },
    answer: { thai: "มีตัวอย่าง", es: "mii dtua-yàaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 401, thai: "เท่า", es: "thâo", spanish: "tanto como", english: "as much", rtgs: "", cefr: null, freq: 401, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "เท่ากัน", es: "thâo gan", spanish: "igual", en: "the same amount" },
    question: { thai: "สองอย่างเท่ากันไหม", es: "sǒng yàang thâo gan mǎi", spanish: "¿Las dos cosas son iguales?", en: "Are the two things equal?" },
    answer: { thai: "เท่ากัน", es: "thâo gan", spanish: "sí, iguales", en: "yes, equal" }
  },
  {
    rank: 402, thai: "ใกล้", es: "klâi", spanish: "cerca", english: "near", rtgs: "", cefr: null, freq: 402, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "บ้านใกล้ตลาด", es: "bâan glâi dtà-làat", spanish: "la casa está cerca del mercado", en: "the house is near the market" },
    question: { thai: "บ้านไกลหรือใกล้", es: "bâan klai rʉ̌ʉ glâi", spanish: "¿La casa está lejos o cerca?", en: "Is the house far or near?" },
    answer: { thai: "ใกล้", es: "glâi", spanish: "cerca", en: "near" }
  },
  {
    rank: 403, thai: "วาง", es: "waaŋ", spanish: "poner / colocar", english: "to place", rtgs: "", cefr: null, freq: 403, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันวาง", es: "chǎn waaŋ", spanish: "Yo pono" },
    question: { thai: "คุณวางไหม", es: "khun waaŋ mǎi", spanish: "¿Tú pono?" },
    answer: { thai: "วาง", es: "waaŋ", spanish: "poner / colocar" }
  },
  {
    rank: 404, thai: "หาย", es: "hǎai", spanish: "desaparecer", english: "to disappear", rtgs: "", cefr: null, freq: 404, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหาย", es: "chǎn hǎai", spanish: "Yo desapareco" },
    question: { thai: "คุณหายไหม", es: "khun hǎai mǎi", spanish: "¿Tú desapareco?" },
    answer: { thai: "หาย", es: "hǎai", spanish: "desaparecer" }
  },
  {
    rank: 405, thai: "ญี่ปุ่น", es: "yîi-bpùn", spanish: "Japón", english: "Japan", rtgs: "", cefr: null, freq: 405, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ญี่ปุ่นดี", es: "yîi-bpùn dii", spanish: "Japón bueno" },
    question: { thai: "มีญี่ปุ่นไหม", es: "mii yîi-bpùn mǎi", spanish: "¿Hay japón?" },
    answer: { thai: "มีญี่ปุ่น", es: "mii yîi-bpùn", spanish: "Sí, hay" }
  },
  {
    rank: 406, thai: "อนุญาต", es: "anú-yâat", spanish: "permitir", english: "to allow", rtgs: "", cefr: null, freq: 406, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันอนุญาต", es: "chǎn anú-yâat", spanish: "Yo permito" },
    question: { thai: "คุณอนุญาตไหม", es: "khun anú-yâat mǎi", spanish: "¿Tú permito?" },
    answer: { thai: "อนุญาต", es: "anú-yâat", spanish: "permitir" }
  },
  {
    rank: 407, thai: "อาศัย", es: "aasǎai", spanish: "vivir en", english: "to live at", rtgs: "", cefr: null, freq: 407, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันอาศัย", es: "chǎn aasǎai", spanish: "Yo vivo en" },
    question: { thai: "คุณอาศัยไหม", es: "khun aasǎai mǎi", spanish: "¿Tú vives en?" },
    answer: { thai: "อาศัย", es: "aasǎai", spanish: "vivir en" }
  },
  {
    rank: 408, thai: "สอน", es: "sɔ̌ɔn", spanish: "enseñar", english: "to teach", rtgs: "", cefr: null, freq: 408, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันสอน", es: "chǎn sɔ̌ɔn", spanish: "Yo enseño" },
    question: { thai: "คุณสอนไหม", es: "khun sɔ̌ɔn mǎi", spanish: "¿Tú enseño?" },
    answer: { thai: "สอน", es: "sɔ̌ɔn", spanish: "enseñar" }
  },
  {
    rank: 409, thai: "แนว", es: "nɛɛo", spanish: "línea / estilo", english: "style", rtgs: "", cefr: null, freq: 409, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แนวดี", es: "nɛɛo dii", spanish: "línea / estilo bueno" },
    question: { thai: "มีแนวไหม", es: "mii nɛɛo mǎi", spanish: "¿Hay línea?" },
    answer: { thai: "มีแนว", es: "mii nɛɛo", spanish: "Sí, hay" }
  },
  {
    rank: 410, thai: "ร่าง", es: "râaŋ", spanish: "borrador", english: "draft", rtgs: "", cefr: null, freq: 410, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ร่างดี", es: "râaŋ dii", spanish: "borrador bueno" },
    question: { thai: "มีร่างไหม", es: "mii râaŋ mǎi", spanish: "¿Hay borrador?" },
    answer: { thai: "มีร่าง", es: "mii râaŋ", spanish: "Sí, hay" }
  },
  {
    rank: 411, thai: "วิจัย", es: "wí-jai", spanish: "investigación", english: "research", rtgs: "", cefr: null, freq: 411, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "วิจัยดี", es: "wí-jai dii", spanish: "investigación bueno" },
    question: { thai: "มีวิจัยไหม", es: "mii wí-jai mǎi", spanish: "¿Hay investigación?" },
    answer: { thai: "มีวิจัย", es: "mii wí-jai", spanish: "Sí, hay" }
  },
  {
    rank: 412, thai: "ความรู้", es: "khwaam-rúu", spanish: "conocimiento", english: "knowledge", rtgs: "", cefr: null, freq: 412, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ความรู้ดี", es: "khwaam-rúu dii", spanish: "conocimiento bueno" },
    question: { thai: "มีความรู้ไหม", es: "mii khwaam-rúu mǎi", spanish: "¿Hay conocimiento?" },
    answer: { thai: "มีความรู้", es: "mii khwaam-rúu", spanish: "Sí, hay" }
  },
  {
    rank: 413, thai: "หลังจาก", es: "laŋ-jàak", spanish: "después de", english: "after", rtgs: "", cefr: null, freq: 413, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "หลังจากกินข้าว ฉันนอน", es: "lǎang-jàak gin kâao, chǎn nɔɔn", spanish: "después de comer, duermo", en: "after eating, I sleep" },
    question: { thai: "หลังจากกินข้าวทำอะไร", es: "lǎang-jàak gin kâao tam a-rai", spanish: "¿Qué haces después de comer?", en: "What do you do after eating?" },
    answer: { thai: "หลังจากกินข้าวฉันนอน", es: "lǎang-jàak gin kâao chǎn nɔɔn", spanish: "después de comer, duermo", en: "after eating, I sleep" }
  },
  {
    rank: 414, thai: "ปกติ", es: "pòk-kà-tì", spanish: "normal", english: "normal", rtgs: "", cefr: null, freq: 414, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "ปกติฉันตื่นหกโมง", es: "bòk-gà-tì chǎn dtʉ̀n hòk moong", spanish: "normalmente me despierto a las seis", en: "normally I wake up at six" },
    question: { thai: "ปกติคุณตื่นกี่โมง", es: "bòk-gà-tì khun dtʉ̀n gii moong", spanish: "¿A qué hora te despiertas normalmente?", en: "What time do you wake up normally?" },
    answer: { thai: "ตื่นหกโมง", es: "dtʉ̀n hòk moong", spanish: "a las seis", en: "at six" }
  },
  {
    rank: 415, thai: "เฉพาะ", es: "chà-phɔ̂ɔ", spanish: "solo / específico", english: "specific", rtgs: "", cefr: null, freq: 415, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "เฉพาะคนที่รู้จัก", es: "chà-phǎw khon thîi rúu-jàk", spanish: "solo personas conocidas", en: "only people who know" },
    question: { thai: "ใครเข้าได้", es: "khrai kâo dâai", spanish: "¿Quién puede entrar?", en: "Who can enter?" },
    answer: { thai: "เฉพาะคนที่รู้จัก", es: "chà-phǎw khon thîi rúu-jàk", spanish: "solo conocidos", en: "only acquaintances" }
  },
  {
    rank: 416, thai: "ธรรมชาติ", es: "tham-châat", spanish: "naturaleza", english: "nature", rtgs: "", cefr: null, freq: 416, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ธรรมชาติดี", es: "tham-châat dii", spanish: "naturaleza bueno" },
    question: { thai: "มีธรรมชาติไหม", es: "mii tham-châat mǎi", spanish: "¿Hay naturaleza?" },
    answer: { thai: "มีธรรมชาติ", es: "mii tham-châat", spanish: "Sí, hay" }
  },
  {
    rank: 417, thai: "ส่วนใหญ่", es: "sùan-yài", spanish: "la mayor parte", english: "mostly", rtgs: "", cefr: null, freq: 417, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ส่วนใหญ่ฉันกินข้าวเย็นหกโมง", es: "sùan-yài chǎn gin kâao-yen hòk moong", spanish: "normalmente ceno a las seis", en: "mostly I have dinner at six" },
    question: { thai: "ส่วนใหญ่คุณกินข้าวเย็นกี่โมง", es: "sùan-yài khun gin kâao-yen gii moong", spanish: "¿A qué hora cenas normalmente?", en: "What time do you mostly have dinner?" },
    answer: { thai: "หกโมง", es: "hòk moong", spanish: "a las seis", en: "at six" }
  },
  {
    rank: 418, thai: "สัตว์", es: "sàt", spanish: "animal", english: "animal", rtgs: "", cefr: null, freq: 418, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สัตว์ดี", es: "sàt dii", spanish: "animal bueno" },
    question: { thai: "มีสัตว์ไหม", es: "mii sàt mǎi", spanish: "¿Hay animal?" },
    answer: { thai: "มีสัตว์", es: "mii sàt", spanish: "Sí, hay" }
  },
  {
    rank: 419, thai: "ไง", es: "ŋai", spanish: "¿cómo? (coloquial)", english: "how", rtgs: "", cefr: null, freq: 419, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "เป็นไง", es: "bpen ngai", spanish: "¿cómo está? (coloquial), en: "how is it? (casual)" },
    question: { thai: "ไงคือใคร", es: "ŋai khuu khrai", spanish: "¿Quién es ¿cómo? (coloquial)?" },
    answer: { thai: "ไง", es: "ŋai", spanish: "¿cómo? (coloquial)" }
  },
  {
    rank: 420, thai: "นิยม", es: "ní-yam", spanish: "popular / preferir", english: "popular", rtgs: "", cefr: null, freq: 420, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันนิยม", es: "chǎn ní-yam", spanish: "Yo populo" },
    question: { thai: "คุณนิยมไหม", es: "khun ní-yam mǎi", spanish: "¿Tú populo?" },
    answer: { thai: "นิยม", es: "ní-yam", spanish: "popular / preferir" }
  },
  {
    rank: 421, thai: "เพลง", es: "pleeŋ", spanish: "canción", english: "song", rtgs: "", cefr: null, freq: 421, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เพลงดี", es: "pleeŋ dii", spanish: "canción bueno" },
    question: { thai: "มีเพลงไหม", es: "mii pleeŋ mǎi", spanish: "¿Hay canción?" },
    answer: { thai: "มีเพลง", es: "mii pleeŋ", spanish: "Sí, hay" }
  },
  {
    rank: 422, thai: "ไม้", es: "máai", spanish: "madera", english: "wood", rtgs: "", cefr: null, freq: 422, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ไม้ดี", es: "máai dii", spanish: "madera bueno" },
    question: { thai: "มีไม้ไหม", es: "mii máai mǎi", spanish: "¿Hay madera?" },
    answer: { thai: "มีไม้", es: "mii máai", spanish: "Sí, hay" }
  },
  {
    rank: 423, thai: "ตลาด", es: "dtalàat", spanish: "mercado", english: "market", rtgs: "", cefr: null, freq: 423, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ตลาดดี", es: "dtalàat dii", spanish: "mercado bueno" },
    question: { thai: "มีตลาดไหม", es: "mii dtalàat mǎi", spanish: "¿Hay mercado?" },
    answer: { thai: "มีตลาด", es: "mii dtalàat", spanish: "Sí, hay" }
  },
  {
    rank: 424, thai: "ผู้ชาย", es: "phûu-chaai", spanish: "hombre", english: "man", rtgs: "", cefr: null, freq: 424, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ผู้ชายดี", es: "phûu-chaai dii", spanish: "hombre bueno" },
    question: { thai: "มีผู้ชายไหม", es: "mii phûu-chaai mǎi", spanish: "¿Hay hombre?" },
    answer: { thai: "มีผู้ชาย", es: "mii phûu-chaai", spanish: "Sí, hay" }
  },
  {
    rank: 425, thai: "ยังไง", es: "yaŋ-ŋai", spanish: "cómo (coloquial)", english: "how", rtgs: "", cefr: null, freq: 425, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "เป็นยังไงบ้าง", es: "bpen yang-ngai bâang", spanish: "¿cómo estás? (coloquial), en: "how are you? (casual)" },
    question: { thai: "ยังไงคือใคร", es: "yaŋ-ŋai khuu khrai", spanish: "¿Quién es cómo (coloquial)?" },
    answer: { thai: "ยังไง", es: "yaŋ-ŋai", spanish: "cómo (coloquial)" }
  },
  {
    rank: 426, thai: "ควบคุม", es: "khúap-khum", spanish: "controlar", english: "to control", rtgs: "", cefr: null, freq: 426, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันควบคุม", es: "chǎn khúap-khum", spanish: "Yo controlo" },
    question: { thai: "คุณควบคุมไหม", es: "khun khúap-khum mǎi", spanish: "¿Tú controlo?" },
    answer: { thai: "ควบคุม", es: "khúap-khum", spanish: "controlar" }
  },
  {
    rank: 427, thai: "หล่อน", es: "lɔ̀ɔn", spanish: "ella (literario)", english: "she", rtgs: "", cefr: null, freq: 427, notes: "",
    category: "pronombres", tone: "l",
    phrase: { thai: "หล่อนสวย", es: "lɔ̀ɔn sǔuai", spanish: "ella es hermosa (literario), en: "she is beautiful (literary)" },
    question: { thai: "หล่อนคือใคร", es: "lɔ̀ɔn khuu khrai", spanish: "¿Quién es ella (literario)?" },
    answer: { thai: "หล่อน", es: "lɔ̀ɔn", spanish: "ella (literario)" }
  },
  {
    rank: 428, thai: "สมาชิก", es: "sǎ-mǎa-chìk", spanish: "miembro", english: "member", rtgs: "", cefr: null, freq: 428, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สมาชิกดี", es: "sǎ-mǎa-chìk dii", spanish: "miembro bueno" },
    question: { thai: "มีสมาชิกไหม", es: "mii sǎ-mǎa-chìk mǎi", spanish: "¿Hay miembro?" },
    answer: { thai: "มีสมาชิก", es: "mii sǎ-mǎa-chìk", spanish: "Sí, hay" }
  },
  {
    rank: 429, thai: "สวย", es: "sǔai", spanish: "hermoso", english: "beautiful", rtgs: "", cefr: null, freq: 429, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "ดอกไม้สวยมาก", es: "dòk-mái sǔai mâak", spanish: "las flores son muy hermosas", en: "the flowers are very beautiful" },
    question: { thai: "ดอกไม้สวยไหม", es: "dòk-mái sǔai mǎi", spanish: "¿Están bonitas las flores?", en: "Are the flowers beautiful?" },
    answer: { thai: "สวยมาก", es: "sǔai mâak", spanish: "sí, muy bonitas", en: "yes, very beautiful" }
  },
  {
    rank: 430, thai: "ทันที", es: "tanthii", spanish: "inmediatamente", english: "immediately", rtgs: "", cefr: null, freq: 430, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "มาทันที", es: "maa than-thii", spanish: "ven inmediatamente", en: "come immediately" },
    question: { thai: "มาเมื่อไร", es: "maa mʉ̂a-rai", spanish: "¿Cuándo vienes?", en: "When are you coming?" },
    answer: { thai: "มาทันที", es: "maa than-thii", spanish: "inmediatamente", en: "immediately" }
  },
  {
    rank: 431, thai: "นอก", es: "nɔ̂ɔk", spanish: "fuera", english: "outside", rtgs: "", cefr: null, freq: 431, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ฉันรอนอกบ้าน", es: "chǎn rɔɔ nâwk bâan", spanish: "espero fuera de la casa", en: "I wait outside the house" },
    question: { thai: "คุณอยู่ในหรือนอก", es: "khun yùu nai rʉ̌ʉ nâwk", spanish: "¿Estás dentro o fuera?", en: "Are you inside or outside?" },
    answer: { thai: "อยู่นอก", es: "yùu nâwk", spanish: "estoy fuera", en: "I'm outside" }
  },
  {
    rank: 432, thai: "อา", es: "aa", spanish: "tía (lado padre)", english: "aunt", rtgs: "", cefr: null, freq: 432, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาดี", es: "aa dii", spanish: "tía (lado padre) bueno" },
    question: { thai: "มีอาไหม", es: "mii aa mǎi", spanish: "¿Hay tía (lado padre)?" },
    answer: { thai: "มีอา", es: "mii aa", spanish: "Sí, hay" }
  },
  {
    rank: 433, thai: "จบ", es: "jòp", spanish: "terminar", english: "to finish", rtgs: "", cefr: null, freq: 433, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจบ", es: "chǎn jòp", spanish: "Yo termino" },
    question: { thai: "คุณจบไหม", es: "khun jòp mǎi", spanish: "¿Tú termino?" },
    answer: { thai: "จบ", es: "jòp", spanish: "terminar" }
  },
  {
    rank: 434, thai: "ดูแล", es: "duu-lɛɛ", spanish: "cuidar", english: "to care", rtgs: "", cefr: null, freq: 434, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดูแล", es: "chǎn duu-lɛɛ", spanish: "Yo cuido" },
    question: { thai: "คุณดูแลไหม", es: "khun duu-lɛɛ mǎi", spanish: "¿Tú cuido?" },
    answer: { thai: "ดูแล", es: "duu-lɛɛ", spanish: "cuidar" }
  },
  {
    rank: 435, thai: "พิเศษ", es: "phí-sèet", spanish: "especial", english: "special", rtgs: "", cefr: null, freq: 435, notes: "",
    category: "adjetivos", tone: "h",
        phrase: { thai: "เมนูพิเศษ", es: "mii-nuuphí-sèt", spanish: "menú especial", en: "special menu" },
    question: { thai: "มีเมนูพิเศษไหม", es: "mii mii-nuu phí-sèt mǎi", spanish: "¿Hay menú especial?", en: "Is there a special menu?" },
    answer: { thai: "มีเมนูพิเศษ", es: "mii mii-nuu phí-sèt", spanish: "sí, hay menú especial", en: "yes, there is" }
  },
  {
    rank: 436, thai: "บริเวณ", es: "bɔɔ-rí-waen", spanish: "zona", english: "area", rtgs: "", cefr: null, freq: 436, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "บริเวณดี", es: "bɔɔ-rí-waen dii", spanish: "zona bueno" },
    question: { thai: "มีบริเวณไหม", es: "mii bɔɔ-rí-waen mǎi", spanish: "¿Hay zona?" },
    answer: { thai: "มีบริเวณ", es: "mii bɔɔ-rí-waen", spanish: "Sí, hay" }
  },
  {
    rank: 437, thai: "สำนักงาน", es: "sǎm-nák-ngaan", spanish: "oficina", english: "office", rtgs: "", cefr: null, freq: 437, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สำนักงานดี", es: "sǎm-nák-ngaan dii", spanish: "oficina bueno" },
    question: { thai: "มีสำนักงานไหม", es: "mii sǎm-nák-ngaan mǎi", spanish: "¿Hay oficina?" },
    answer: { thai: "มีสำนักงาน", es: "mii sǎm-nák-ngaan", spanish: "Sí, hay" }
  },
  {
    rank: 438, thai: "ประการ", es: "prà-gaan", spanish: "ítem / declaración", english: "item", rtgs: "", cefr: null, freq: 438, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประการดี", es: "prà-gaan dii", spanish: "ítem / declaración bueno" },
    question: { thai: "มีประการไหม", es: "mii prà-gaan mǎi", spanish: "¿Hay ítem?" },
    answer: { thai: "มีประการ", es: "mii prà-gaan", spanish: "Sí, hay" }
  },
  {
    rank: 439, thai: "เจอ", es: "jəə", spanish: "encontrarse con", english: "to encounter", rtgs: "", cefr: null, freq: 439, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเจอ", es: "chǎn jəə", spanish: "Yo encontrarse con" },
    question: { thai: "คุณเจอไหม", es: "khun jəə mǎi", spanish: "¿Tú encontrarse con?" },
    answer: { thai: "เจอ", es: "jəə", spanish: "encontrarse con" }
  },
  {
    rank: 440, thai: "วันนี้", es: "wan-níi", spanish: "hoy", english: "today", rtgs: "", cefr: null, freq: 440, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "วันนี้อากาศดี", es: "wan-níi aa-kàat dii", spanish: "hoy el clima está bien", en: "today the weather is good" },
    question: { thai: "วันนี้เป็นอย่างไร", es: "wan-níi pen yàang rai", spanish: "¿Cómo está hoy?", en: "How is today?" },
    answer: { thai: "อากาศดี", es: "aa-kàat dii", spanish: "el clima está bien", en: "the weather is good" }
  },
  {
    rank: 441, thai: "เขต", es: "khèt", spanish: "zona / distrito", english: "district", rtgs: "", cefr: null, freq: 441, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เขตดี", es: "khèt dii", spanish: "zona / distrito bueno" },
    question: { thai: "มีเขตไหม", es: "mii khèt mǎi", spanish: "¿Hay zona?" },
    answer: { thai: "มีเขต", es: "mii khèt", spanish: "Sí, hay" }
  },
  {
    rank: 442, thai: "สาย", es: "sǎai", spanish: "línea / tarde", english: "line", rtgs: "", cefr: null, freq: 442, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สายดี", es: "sǎai dii", spanish: "línea / tarde bueno" },
    question: { thai: "มีสายไหม", es: "mii sǎai mǎi", spanish: "¿Hay línea?" },
    answer: { thai: "มีสาย", es: "mii sǎai", spanish: "Sí, hay" }
  },
  {
    rank: 443, thai: "มิ", es: "mí", spanish: "no (formal)", english: "no", rtgs: "", cefr: null, freq: 443, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "อย่ามิฉะนั้นจะเสียใจ", es: "yàa mì chà nán jà sǐa-jai", spanish: "no lo hagas, si no te arrepentirás", en: "don't, otherwise you'll regret" },
    question: { thai: "ทำไมต้องระวัง", es: "tham-mai dtông rá-waang", spanish: "¿Por qué tener cuidado?", en: "Why be careful?" },
    answer: { thai: "มิฉะนั้นเสียใจ", es: "mì chà nán sǐa-jai", spanish: "si no, te arrepentirás", en: "otherwise you'll regret" }
  },
  {
    rank: 444, thai: "ทั้งนี้", es: "tháŋ-níi", spanish: "habiendo dicho esto", english: "having said that", rtgs: "", cefr: null, freq: 444, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ทั้งนี้เพราะเหตุใด", es: "tháng-nîi phrớ yǎ hèt dii", spanish: "esto es por qué razón", en: "this is for what reason" },
    question: { thai: "ทั้งนี้เพราะอะไร", es: "tháng-nîi phrớ yǎ a-rai", spanish: "¿Esto por qué?", en: "This is because of what?" },
    answer: { thai: "ทั้งนี้เพราะเวลา", es: "tháng-nîi phrớ yǎ welaa", spanish: "esto es por el tiempo", en: "this is because of time" }
  },
  {
    rank: 445, thai: "จัดการ", es: "jàt-gaan", spanish: "gestionar", english: "to manage", rtgs: "", cefr: null, freq: 445, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจัดการ", es: "chǎn jàt-gaan", spanish: "Yo gestiono" },
    question: { thai: "คุณจัดการไหม", es: "khun jàt-gaan mǎi", spanish: "¿Tú gestiono?" },
    answer: { thai: "จัดการ", es: "jàt-gaan", spanish: "gestionar" }
  },
  {
    rank: 446, thai: "ทางการ", es: "thaang-gaan", spanish: "oficial", english: "official", rtgs: "", cefr: null, freq: 446, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "ข่าวทางการ", es: "kàao thaang-gaan", spanish: "noticia oficial", en: "official news" },
    question: { thai: "ข่าวนี้เป็นทางการไหม", es: "kàao níi pen thaang-gaan mǎi", spanish: "¿Esta noticia es oficial?", en: "Is this news official?" },
    answer: { thai: "เป็นข่าวทางการ", es: "pen kàao thaang-gaan", spanish: "sí, oficial", en: "yes, official" }
  },
  {
    rank: 447, thai: "เจ้าของ", es: "jâao-khɔ̌ɔŋ", spanish: "dueño", english: "owner", rtgs: "", cefr: null, freq: 447, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เจ้าของดี", es: "jâao-khɔ̌ɔŋ dii", spanish: "dueño bueno" },
    question: { thai: "มีเจ้าของไหม", es: "mii jâao-khɔ̌ɔŋ mǎi", spanish: "¿Hay dueño?" },
    answer: { thai: "มีเจ้าของ", es: "mii jâao-khɔ̌ɔŋ", spanish: "Sí, hay" }
  },
  {
    rank: 448, thai: "รวมทั้ง", es: "ruam-tháŋ", spanish: "incluyendo", english: "including", rtgs: "", cefr: null, freq: 448, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ผลไม้รวมทั้งผัก", es: "pǒn-lá-mái ruam tháng phàk", spanish: "frutas incluyendo verduras", en: "fruits including vegetables" },
    question: { thai: "มีอะไรบ้าง", es: "mii a-rai bàang", spanish: "¿Qué hay?", en: "What is there?" },
    answer: { thai: "ผลไม้รวมทั้งผัก", es: "pǒn-lá-mái ruam tháng phàk", spanish: "frutas, incluyendo verduras", en: "fruits, including vegetables" }
  },
  {
    rank: 449, thai: "ยุค", es: "júk", spanish: "era / época", english: "era", rtgs: "", cefr: null, freq: 449, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ยุคดี", es: "júk dii", spanish: "era / época bueno" },
    question: { thai: "มียุคไหม", es: "mii júk mǎi", spanish: "¿Hay era?" },
    answer: { thai: "มียุค", es: "mii júk", spanish: "Sí, hay" }
  },
  {
    rank: 450, thai: "แก้ไข", es: "gɛ̂ɛ-khǎi", spanish: "corregir", english: "to fix", rtgs: "", cefr: null, freq: 450, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันแก้ไข", es: "chǎn gɛ̂ɛ-khǎi", spanish: "Yo corrego" },
    question: { thai: "คุณแก้ไขไหม", es: "khun gɛ̂ɛ-khǎi mǎi", spanish: "¿Tú corrego?" },
    answer: { thai: "แก้ไข", es: "gɛ̂ɛ-khǎi", spanish: "corregir" }
  },
  {
    rank: 451, thai: "นอกจาก", es: "nɔ̂ɔk-jàak", spanish: "además de", english: "besides", rtgs: "", cefr: null, freq: 451, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "นอกจากภาษาไทย ฉันพูดสเปน", es: "nâwk-jàak phaa-sǎa thai, chǎn phûut sà-pĕen", spanish: "además de tailandés, hablo español", en: "besides Thai, I speak Spanish" },
    question: { thai: "คุณพูดภาษาอะไรบ้าง", es: "khun phûut phaa-sǎa a-rai bàang", spanish: "¿Qué idiomas hablas?", en: "What languages do you speak?" },
    answer: { thai: "นอกจากไทย ยังพูดสเปน", es: "nâwk-jàak thai, yang phûut sà-pĕen", spanish: "además de tailandés, español", en: "besides Thai, also Spanish" }
  },
  {
    rank: 452, thai: "ตรวจ", es: "trùat", spanish: "inspeccionar", english: "to inspect", rtgs: "", cefr: null, freq: 452, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันตรวจ", es: "chǎn trùat", spanish: "Yo inspecciono" },
    question: { thai: "คุณตรวจไหม", es: "khun trùat mǎi", spanish: "¿Tú inspecciono?" },
    answer: { thai: "ตรวจ", es: "trùat", spanish: "inspeccionar" }
  },
  {
    rank: 453, thai: "ยาก", es: "yâak", spanish: "difícil", english: "difficult", rtgs: "", cefr: null, freq: 453, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "คำถามนี้ยาก", es: "kam-thǎa níi yâak", spanish: "esta pregunta es difícil", en: "this question is hard" },
    question: { thai: "คำถามยากหรือง่าย", es: "kam-thǎa yâak rʉ̌ʉ ngâai", spanish: "¿La pregunta es difícil o fácil?", en: "Is the question hard or easy?" },
    answer: { thai: "ยาก", es: "yâak", spanish: "difícil", en: "hard" }
  },
  {
    rank: 454, thai: "สัญญา", es: "sàn-yaa", spanish: "promesa / contrato", english: "promise", rtgs: "", cefr: null, freq: 454, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สัญญาดี", es: "sàn-yaa dii", spanish: "promesa / contrato bueno" },
    question: { thai: "มีสัญญาไหม", es: "mii sàn-yaa mǎi", spanish: "¿Hay promesa?" },
    answer: { thai: "มีสัญญา", es: "mii sàn-yaa", spanish: "Sí, hay" }
  },
  {
    rank: 455, thai: "ตอนนี้", es: "tɔɔn-níi", spanish: "ahora", english: "now", rtgs: "", cefr: null, freq: 455, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ตอนนี้ฉันไม่ว่าง", es: "dton-níi chǎn mâi wâang", spanish: "ahora no estoy libre", en: "I'm not free now" },
    question: { thai: "ตอนนี้คุณว่างไหม", es: "dton-níi khun wâang mǎi", spanish: "¿Estás libre ahora?", en: "Are you free now?" },
    answer: { thai: "ไม่ว่าง", es: "mâi wâang", spanish: "no, no estoy libre", en: "no, not free" }
  },
  {
    rank: 456, thai: "ประธาน", es: "prà-thaan", spanish: "presidente", english: "chairperson", rtgs: "", cefr: null, freq: 456, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประธานดี", es: "prà-thaan dii", spanish: "presidente bueno" },
    question: { thai: "มีประธานไหม", es: "mii prà-thaan mǎi", spanish: "¿Hay presidente?" },
    answer: { thai: "มีประธาน", es: "mii prà-thaan", spanish: "Sí, hay" }
  },
  {
    rank: 457, thai: "แดง", es: "dɛɛŋ", spanish: "rojo", english: "red", rtgs: "", cefr: null, freq: 457, notes: "",
    category: "adjetivos", tone: "m",
        phrase: { thai: "แอปเปิลสีแดง", es: "ɛ́p-pəəl sǐik dɛɛng", spanish: "manzana roja", en: "red apple" },
    question: { thai: "แอปเปิลสีอะไร", es: "ɛ́p-pəəl sǐik a-rai", spanish: "¿De qué color es la manzana?", en: "What color is the apple?" },
    answer: { thai: "สีแดง", es: "sǐik dɛɛng", spanish: "roja", en: "red" }
  },
  {
    rank: 458, thai: "รีบ", es: "rîip", spanish: "apurarse", english: "to rush", rtgs: "", cefr: null, freq: 458, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันรีบ", es: "chǎn rîip", spanish: "Yo apurarse" },
    question: { thai: "คุณรีบไหม", es: "khun rîip mǎi", spanish: "¿Tú apurarse?" },
    answer: { thai: "รีบ", es: "rîip", spanish: "apurarse" }
  },
  {
    rank: 459, thai: "บังคับ", es: "baŋ-kháp", spanish: "obligar", english: "to force", rtgs: "", cefr: null, freq: 459, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันบังคับ", es: "chǎn baŋ-kháp", spanish: "Yo obligo" },
    question: { thai: "คุณบังคับไหม", es: "khun baŋ-kháp mǎi", spanish: "¿Tú obligo?" },
    answer: { thai: "บังคับ", es: "baŋ-kháp", spanish: "obligar" }
  },
  {
    rank: 460, thai: "ชุมชน", es: "tshum-tshǒn", spanish: "comunidad", english: "community", rtgs: "", cefr: null, freq: 460, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ชุมชนดี", es: "tshum-tshǒn dii", spanish: "comunidad bueno" },
    question: { thai: "มีชุมชนไหม", es: "mii tshum-tshǒn mǎi", spanish: "¿Hay comunidad?" },
    answer: { thai: "มีชุมชน", es: "mii tshum-tshǒn", spanish: "Sí, hay" }
  },
  {
    rank: 461, thai: "ความหมาย", es: "khwaam-mǎai", spanish: "significado", english: "meaning", rtgs: "", cefr: null, freq: 461, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ความหมายดี", es: "khwaam-mǎai dii", spanish: "significado bueno" },
    question: { thai: "มีความหมายไหม", es: "mii khwaam-mǎai mǎi", spanish: "¿Hay significado?" },
    answer: { thai: "มีความหมาย", es: "mii khwaam-mǎai", spanish: "Sí, hay" }
  },
  {
    rank: 462, thai: "บท", es: "bòt", spanish: "capítulo / parte", english: "chapter", rtgs: "", cefr: null, freq: 462, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บทดี", es: "bòt dii", spanish: "capítulo / parte bueno" },
    question: { thai: "มีบทไหม", es: "mii bòt mǎi", spanish: "¿Hay capítulo?" },
    answer: { thai: "มีบท", es: "mii bòt", spanish: "Sí, hay" }
  },
  {
    rank: 463, thai: "โต", es: "dtoo", spanish: "crecer", english: "to grow", rtgs: "", cefr: null, freq: 463, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันโต", es: "chǎn dtoo", spanish: "Yo creco" },
    question: { thai: "คุณโตไหม", es: "khun dtoo mǎi", spanish: "¿Tú creco?" },
    answer: { thai: "โต", es: "dtoo", spanish: "crecer" }
  },
  {
    rank: 464, thai: "ทหาร", es: "thahǎan", spanish: "soldado", english: "soldier", rtgs: "", cefr: null, freq: 464, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ทหารดี", es: "thahǎan dii", spanish: "soldado bueno" },
    question: { thai: "มีทหารไหม", es: "mii thahǎan mǎi", spanish: "¿Hay soldado?" },
    answer: { thai: "มีทหาร", es: "mii thahǎan", spanish: "Sí, hay" }
  },
  {
    rank: 465, thai: "จิต", es: "jìt", spanish: "mente", english: "mind", rtgs: "", cefr: null, freq: 465, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จิตดี", es: "jìt dii", spanish: "mente bueno" },
    question: { thai: "มีจิตไหม", es: "mii jìt mǎi", spanish: "¿Hay mente?" },
    answer: { thai: "มีจิต", es: "mii jìt", spanish: "Sí, hay" }
  },
  {
    rank: 466, thai: "ขาด", es: "khàat", spanish: "carecer / faltar", english: "to lack", rtgs: "", cefr: null, freq: 466, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันขาด", es: "chǎn khàat", spanish: "Yo careco" },
    question: { thai: "คุณขาดไหม", es: "khun khàat mǎi", spanish: "¿Tú careco?" },
    answer: { thai: "ขาด", es: "khàat", spanish: "carecer / faltar" }
  },
  {
    rank: 467, thai: "อารมณ์", es: "aa-rǎm", spanish: "ánimo / emoción", english: "mood", rtgs: "", cefr: null, freq: 467, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อารมณ์ดี", es: "aa-rǎm dii", spanish: "ánimo / emoción bueno" },
    question: { thai: "มีอารมณ์ไหม", es: "mii aa-rǎm mǎi", spanish: "¿Hay ánimo?" },
    answer: { thai: "มีอารมณ์", es: "mii aa-rǎm", spanish: "Sí, hay" }
  },
  {
    rank: 468, thai: "ประตู", es: "prà-too", spanish: "puerta", english: "door", rtgs: "", cefr: null, freq: 468, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ประตูดี", es: "prà-too dii", spanish: "puerta bueno" },
    question: { thai: "มีประตูไหม", es: "mii prà-too mǎi", spanish: "¿Hay puerta?" },
    answer: { thai: "มีประตู", es: "mii prà-too", spanish: "Sí, hay" }
  },
  {
    rank: 469, thai: "ขาว", es: "khǎao", spanish: "blanco", english: "white", rtgs: "", cefr: null, freq: 469, notes: "",
    category: "adjetivos", tone: "r",
        phrase: { thai: "รถสีขาว", es: "ród sǐik kǎao", spanish: "coche blanco", en: "white car" },
    question: { thai: "รถสีอะไร", es: "ród sǐik a-rai", spanish: "¿De qué color es el coche?", en: "What color is the car?" },
    answer: { thai: "สีขาว", es: "sǐik kǎao", spanish: "blanco", en: "white" }
  },
  {
    rank: 470, thai: "สั่ง", es: "sàŋ", spanish: "ordenar", english: "to order", rtgs: "", cefr: null, freq: 470, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันสั่ง", es: "chǎn sàŋ", spanish: "Yo ordeno" },
    question: { thai: "คุณสั่งไหม", es: "khun sàŋ mǎi", spanish: "¿Tú ordeno?" },
    answer: { thai: "สั่ง", es: "sàŋ", spanish: "ordenar" }
  },
  {
    rank: 471, thai: "เป็นต้น", es: "pen-tôn", spanish: "etcétera", english: "etc.", rtgs: "", cefr: null, freq: 471, notes: "",
    category: "expresiones", tone: "m",
    phrase: { thai: "ผลไม้ เช่น มะม่วง เป็นต้น", es: "phon-la-mái chên má-mûang pen-tôn", spanish: "frutas, por ejemplo mango, etc., en: "fruits, e.g. mango, etc." },
    question: { thai: "เป็นต้น", es: "pen-tôn", spanish: "etcétera" },
    answer: { thai: "เป็นต้น", es: "pen-tôn", spanish: "etcétera" }
  },
  {
    rank: 472, thai: "ปลา", es: "bplaa", spanish: "pez", english: "fish", rtgs: "", cefr: null, freq: 472, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปลาดี", es: "bplaa dii", spanish: "pez bueno" },
    question: { thai: "มีปลาไหม", es: "mii bplaa mǎi", spanish: "¿Hay pez?" },
    answer: { thai: "มีปลา", es: "mii bplaa", spanish: "Sí, hay" }
  },
  {
    rank: 473, thai: "ทั่ว", es: "thûa", spanish: "todo / general", english: "throughout", rtgs: "", cefr: null, freq: 473, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ทั่วประเทศ", es: "thùa bprà-thêet", spanish: "por todo el país", en: "throughout the country" },
    question: { thai: "ฝนตกที่ไหนบ้าง", es: "fǒn dtòk thîi nǎi bàang", spanish: "¿Dónde llueve?", en: "Where does it rain?" },
    answer: { thai: "ทั่วประเทศ", es: "thùa bprà-thêet", spanish: "por todo el país", en: "throughout the country" }
  },
  {
    rank: 474, thai: "ปล่อย", es: "blòai", spanish: "soltar", english: "to release", rtgs: "", cefr: null, freq: 474, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันปล่อย", es: "chǎn blòai", spanish: "Yo solto" },
    question: { thai: "คุณปล่อยไหม", es: "khun blòai mǎi", spanish: "¿Tú solto?" },
    answer: { thai: "ปล่อย", es: "blòai", spanish: "soltar" }
  },
  {
    rank: 475, thai: "สถาบัน", es: "sà-thǎa-ban", spanish: "institución", english: "institution", rtgs: "", cefr: null, freq: 475, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สถาบันดี", es: "sà-thǎa-ban dii", spanish: "institución bueno" },
    question: { thai: "มีสถาบันไหม", es: "mii sà-thǎa-ban mǎi", spanish: "¿Hay institución?" },
    answer: { thai: "มีสถาบัน", es: "mii sà-thǎa-ban", spanish: "Sí, hay" }
  },
  {
    rank: 476, thai: "ยอมรับ", es: "yɔɔm-ráp", spanish: "aceptar / admitir", english: "to admit", rtgs: "", cefr: null, freq: 476, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันยอมรับ", es: "chǎn yɔɔm-ráp", spanish: "Yo acepto" },
    question: { thai: "คุณยอมรับไหม", es: "khun yɔɔm-ráp mǎi", spanish: "¿Tú acepto?" },
    answer: { thai: "ยอมรับ", es: "yɔɔm-ráp", spanish: "aceptar / admitir" }
  },
  {
    rank: 477, thai: "ระเบียบ", es: "rá-bìap", spanish: "regla / orden", english: "rule", rtgs: "", cefr: null, freq: 477, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ระเบียบดี", es: "rá-bìap dii", spanish: "regla / orden bueno" },
    question: { thai: "มีระเบียบไหม", es: "mii rá-bìap mǎi", spanish: "¿Hay regla?" },
    answer: { thai: "มีระเบียบ", es: "mii rá-bìap", spanish: "Sí, hay" }
  },
  {
    rank: 478, thai: "เหลือ", es: "lǔea", spanish: "quedar", english: "to remain", rtgs: "", cefr: null, freq: 478, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเหลือ", es: "chǎn lǔea", spanish: "Yo quedo" },
    question: { thai: "คุณเหลือไหม", es: "khun lǔea mǎi", spanish: "¿Tú quedo?" },
    answer: { thai: "เหลือ", es: "lǔea", spanish: "quedar" }
  },
  {
    rank: 479, thai: "ฐานะ", es: "thǎana", spanish: "estatus", english: "status", rtgs: "", cefr: null, freq: 479, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ฐานะดี", es: "thǎana dii", spanish: "estatus bueno" },
    question: { thai: "มีฐานะไหม", es: "mii thǎana mǎi", spanish: "¿Hay estatus?" },
    answer: { thai: "มีฐานะ", es: "mii thǎana", spanish: "Sí, hay" }
  },
  {
    rank: 480, thai: "ฉบับ", es: "chà-bàp", spanish: "edición / copia", english: "edition", rtgs: "", cefr: null, freq: 480, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ฉบับดี", es: "chà-bàp dii", spanish: "edición / copia bueno" },
    question: { thai: "มีฉบับไหม", es: "mii chà-bàp mǎi", spanish: "¿Hay edición?" },
    answer: { thai: "มีฉบับ", es: "mii chà-bàp", spanish: "Sí, hay" }
  },
  {
    rank: 481, thai: "ข่าว", es: "khàao", spanish: "noticia", english: "news", rtgs: "", cefr: null, freq: 481, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ข่าวดี", es: "khàao dii", spanish: "noticia bueno" },
    question: { thai: "มีข่าวไหม", es: "mii khàao mǎi", spanish: "¿Hay noticia?" },
    answer: { thai: "มีข่าว", es: "mii khàao", spanish: "Sí, hay" }
  },
  {
    rank: 482, thai: "รายงาน", es: "raai-ngaan", spanish: "informe", english: "report", rtgs: "", cefr: null, freq: 482, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "รายงานดี", es: "raai-ngaan dii", spanish: "informe bueno" },
    question: { thai: "มีรายงานไหม", es: "mii raai-ngaan mǎi", spanish: "¿Hay informe?" },
    answer: { thai: "มีรายงาน", es: "mii raai-ngaan", spanish: "Sí, hay" }
  },
  {
    rank: 483, thai: "หัวใจ", es: "hǔa-jai", spanish: "corazón", english: "heart", rtgs: "", cefr: null, freq: 483, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หัวใจดี", es: "hǔa-jai dii", spanish: "corazón bueno" },
    question: { thai: "มีหัวใจไหม", es: "mii hǔa-jai mǎi", spanish: "¿Hay corazón?" },
    answer: { thai: "มีหัวใจ", es: "mii hǔa-jai", spanish: "Sí, hay" }
  },
  {
    rank: 484, thai: "ดิฉัน", es: "dì-chǎn", spanish: "yo (mujer formal)", english: "I (formal female)", rtgs: "", cefr: null, freq: 484, notes: "",
    category: "pronombres", tone: "l",
    phrase: { thai: "ดิฉันชื่อมาลี", es: "dì-chǎn chûue maa-lii", spanish: "mi nombre es Malí, en: "my name is Mali" },
    question: { thai: "ดิฉันคือใคร", es: "dì-chǎn khuu khrai", spanish: "¿Quién es yo (mujer formal)?" },
    answer: { thai: "ดิฉัน", es: "dì-chǎn", spanish: "yo (mujer formal)" }
  },
  {
    rank: 485, thai: "อย่างไรก็ตาม", es: "yàaŋ-rai-gɔ̂ɔ-taam", spanish: "sin embargo", english: "however", rtgs: "", cefr: null, freq: 485, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "อย่างไรก็ตาม ฉันจะไป", es: "yàang-rai gâ dtaam, chǎn jà bpai", spanish: "de todos modos, iré", en: "anyway, I will go" },
    question: { thai: "ถ้าลูกไม่สบายจะไปไหม", es: "thâa lûuk mâi sà-baai jà bpai mǎi", spanish: "Si tu hijo está enfermo, ¿irás?", en: "If your child is sick, will you go?" },
    answer: { thai: "อย่างไรก็ตามจะไป", es: "yàang-rai gâ dtaam jà bpai", spanish: "de todos modos, iré", en: "anyway, I will go" }
  },
  {
    rank: 486, thai: "ในขณะที่", es: "nai-khà-ná-thîi", spanish: "mientras", english: "while", rtgs: "", cefr: null, freq: 486, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ในขณะที่ฉันกิน เขาโทรมา", es: "nai khà-ná thîi chǎn gin, khǎo thoo maa", spanish: "mientras yo comía, él llamó", en: "while I was eating, he called" },
    question: { thai: "เขาโทรมาตอนไหน", es: "khǎo thoo maa dton nǎi", spanish: "¿Cuándo llamó?", en: "When did he call?" },
    answer: { thai: "ในขณะที่ฉันกิน", es: "nai khà-ná thîi chǎn gin", spanish: "mientras comía", en: "while I was eating" }
  },
  {
    rank: 487, thai: "น่าจะ", es: "nâ-jà", spanish: "probablemente", english: "probably", rtgs: "", cefr: null, freq: 487, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "พรุ่งนี้น่าจะฝนตก", es: "prùng-níi nâa jà fǒn dtòk", spanish: "mañana probablemente llueva", en: "tomorrow it will probably rain" },
    question: { thai: "พรุ่งนี้อากาศเป็นอย่างไร", es: "prùng-níi aa-kàat pen yàang rai", spanish: "¿Cómo estará el clima mañana?", en: "What will the weather be tomorrow?" },
    answer: { thai: "น่าจะฝนตก", es: "nâa jà fǒn dtòk", spanish: "probablemente llueva", en: "probably rain" }
  },
  {
    rank: 488, thai: "เคย", es: "khooei", spanish: "alguna vez", english: "ever", rtgs: "", cefr: null, freq: 488, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "ฉันเคยไปเชียงใหม่", es: "chǎn khəoe bpai chiang-mài", spanish: "yo he ido a Chiang Mai", en: "I have been to Chiang Mai" },
    question: { thai: "คุณเคยไปเชียงใหม่ไหม", es: "khun khəoe bpai chiang-mài mǎi", spanish: "¿Has ido a Chiang Mai?", en: "Have you been to Chiang Mai?" },
    answer: { thai: "เคยไปแล้ว", es: "khəoe bpai lɛ́ɛo", spanish: "sí, ya fui", en: "yes, I have" }
  },
  {
    rank: 489, thai: "มากกว่า", es: "mâak-kwàa", spanish: "más que", english: "more than", rtgs: "", cefr: null, freq: 489, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "สองมากกว่าหนึ่ง", es: "sǒng mâak gwàa nǔng", spanish: "dos es mayor que uno", en: "two is more than one" },
    question: { thai: "สองกับหนึ่งอันไหนมากกว่า", es: "sǒng gàp nǔng an nǎi mâak gwàa", spanish: "¿Cuál es mayor, dos o uno?", en: "Which is greater, two or one?" },
    answer: { thai: "สองมากกว่า", es: "sǒng mâak gwàa", spanish: "dos es mayor", en: "two is more" }
  },
  {
    rank: 490, thai: "อาจจะ", es: "àat-jà", spanish: "podría", english: "might", rtgs: "", cefr: null, freq: 490, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันอาจจะ", es: "chǎn àat-jà", spanish: "Yo podría" },
    question: { thai: "คุณอาจจะไหม", es: "khun àat-jà mǎi", spanish: "¿Tú podrías?" },
    answer: { thai: "อาจจะ", es: "àat-jà", spanish: "podría" }
  },
  {
    rank: 491, thai: "เพราะว่า", es: "phrɔ́-wâa", spanish: "porque", english: "because", rtgs: "", cefr: null, freq: 491, notes: "",
    category: "adverbios", tone: "h",
        phrase: { thai: "ฉันไปเพราะว่าอยากเรียน", es: "chǎn bpai phrớ yǎ wâa yàak rian", spanish: "voy porque quiero aprender", en: "I go because I want to learn" },
    question: { thai: "ทำไมคุณไป", es: "tham-mai khun bpai", spanish: "¿Por qué vas?", en: "Why do you go?" },
    answer: { thai: "เพราะว่าอยากเรียน", es: "phrớ yǎ wâa yàak rian", spanish: "porque quiero aprender", en: "because I want to learn" }
  },
  {
    rank: 492, thai: "เพื่อให้", es: "phʉ̂a-hâi", spanish: "para que", english: "so that", rtgs: "", cefr: null, freq: 492, notes: "",
    category: "adverbios", tone: "r",
        phrase: { thai: "อ่านหนังสือเพื่อให้รู้", es: "àan nǎng-sǔe phʉ̂a hâi rúu", spanish: "lee para que sepas", en: "read so that you know" },
    question: { thai: "ทำไมต้องอ่าน", es: "tham-mai dtông àan", spanish: "¿Por qué hay que leer?", en: "Why must one read?" },
    answer: { thai: "เพื่อให้รู้", es: "phʉ̂a hâi rúu", spanish: "para que sepas", en: "so that you know" }
  },
  {
    rank: 493, thai: "ก่อนหน้า", es: "gɔ̀ɔn-nǎa", spanish: "anterior", english: "previous", rtgs: "", cefr: null, freq: 493, notes: "",
    category: "adjetivos", tone: "l",
        phrase: { thai: "สัปดาห์ก่อนหน้า", es: "sàp-daa gɔ̀ɔn-nàa", spanish: "la semana anterior", en: "the previous week" },
    question: { thai: "สัปดาห์ไหน", es: "sàp-daa nǎi", spanish: "¿Qué semana?", en: "Which week?" },
    answer: { thai: "สัปดาห์ก่อนหน้า", es: "sàp-daa gɔ̀ɔn-nàa", spanish: "la anterior", en: "the previous one" }
  },
  {
    rank: 494, thai: "ในที่สุด", es: "nai-thîi-sùt", spanish: "finalmente", english: "finally", rtgs: "", cefr: null, freq: 494, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ในที่สุดเขามาถึง", es: "nai thîi sùt khǎo maa thǔng", spanish: "finalmente él llegó", en: "finally he arrived" },
    question: { thai: "เขามาถึงเมื่อไร", es: "khǎo maa thǔng mʉ̂a-rai", spanish: "¿Cuándo llegó?", en: "When did he arrive?" },
    answer: { thai: "ในที่สุด", es: "nai thîi sùt", spanish: "finalmente", en: "finally" }
  },
  {
    rank: 495, thai: "โดยทั่วไป", es: "dooi-thûa-bpai", spanish: "en general", english: "in general", rtgs: "", cefr: null, freq: 495, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "โดยทั่วไปคนไทยกินข้าว", es: "dooi thùa-bpai khon thai gin kâao", spanish: "en general, los tailandeses comen arroz", en: "generally, Thai people eat rice" },
    question: { thai: "โดยทั่วไปคนไทยกินอะไร", es: "dooi thùa-bpai khon thai gin a-rai", spanish: "¿En general, qué comen los tailandeses?", en: "Generally, what do Thai people eat?" },
    answer: { thai: "กินข้าว", es: "gin kâao", spanish: "comen arroz", en: "they eat rice" }
  },
  {
    rank: 496, thai: "ในขณะเดียวกัน", es: "nai-khà-ná-diau-gan", spanish: "al mismo tiempo", english: "at the same time", rtgs: "", cefr: null, freq: 496, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "ในขณะเดียวกันฉันทำงาน", es: "nai khà-ná diao gan chǎn tam-ngaan", spanish: "al mismo tiempo, trabajo", en: "at the same time, I work" },
    question: { thai: "ขณะเรียนคุณทำอะไร", es: "khà-nă rian khun tam a-rai", spanish: "Mientras estudias, ¿qué haces?", en: "While studying, what do you do?" },
    answer: { thai: "ในขณะเดียวกันทำงาน", es: "nai khà-ná diao gan tam-ngaan", spanish: "al mismo tiempo, trabajo", en: "at the same time, I work" }
  },
  {
    rank: 497, thai: "กันและกัน", es: "gan-lɛ́-gan", spanish: "mutuamente", english: "each other", rtgs: "", cefr: null, freq: 497, notes: "",
    category: "adverbios", tone: "m",
        phrase: { thai: "เราช่วยกันและกัน", es: "rao chûai gan láe gan", spanish: "nos ayudamos mutuamente", en: "we help each other" },
    question: { thai: "พวกคุณช่วยกันไหม", es: "phûak khun chûai gan mǎi", spanish: "¿Se ayudan mutuamente?", en: "Do you help each other?" },
    answer: { thai: "ช่วยกันและกัน", es: "chûai gan láe gan", spanish: "sí, mutuamente", en: "yes, each other" }
  },
  {
    rank: 498, thai: "อีกครั้ง", es: "ìik-khráŋ", spanish: "otra vez", english: "again", rtgs: "", cefr: null, freq: 498, notes: "",
    category: "adverbios", tone: "l",
        phrase: { thai: "พูดอีกครั้ง", es: "phûut ìik kráng", spanish: "di otra vez", en: "say again" },
    question: { thai: "ขอโทษไม่ได้ยิน พูดอีกครั้งได้ไหม", es: "khǎa-thôot mâi dâai yin, phûut ìik kráng dâai mǎi", spanish: "Perdón, no oí, ¿puedes repetir?", en: "Sorry, didn't hear, can you repeat?" },
    answer: { thai: "ได้ พูดอีกครั้ง", es: "dâai, phûut ìik kráng", spanish: "sí, repito", en: "yes, I repeat" }
  },
  {
    rank: 499, thai: "ทันทีที่", es: "than-thîi-thîi", spanish: "tan pronto como", english: "as soon as", rtgs: "", cefr: null, freq: 499, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ทันทีที่ฉันเห็น", es: "than-thii thîi chǎn hĕn", spanish: "apenas vi", en: "as soon as I saw" },
    question: { thai: "คุณทำอะไรทันทีที่เห็น", es: "khun tam a-rai than-thii thîi hĕn", spanish: "¿Qué hiciste al ver?", en: "What did you do upon seeing?" },
    answer: { thai: "ทันทีที่เห็นฉันยิ้ม", es: "than-thii thîi hĕn chǎn yîm", spanish: "al ver, sonreí", en: "upon seeing, I smiled" }
  },
  {
    rank: 500, thai: "ต่อจากนี้", es: "dtɔ̂ɔ-jàak-níi", spanish: "a partir de ahora", english: "from now on", rtgs: "", cefr: null, freq: 500, notes: "",
    category: "adverbios", tone: "f",
        phrase: { thai: "ต่อจากนี้ฉันจะตั้งใจ", es: "dtòà-jàak nîi chǎn jà dtâng-jai", spanish: "a partir de ahora, prestaré atención", en: "from now on, I will pay attention" },
    question: { thai: "ต่อจากนี้คุณจะทำอย่างไร", es: "dtòà-jàak nîi khun jà tam yàang rai", spanish: "¿Qué harás a partir de ahora?", en: "What will you do from now on?" },
    answer: { thai: "ต่อจากนี้จะตั้งใจ", es: "dtòà-jàak nîi jà dtâng-jai", spanish: "a partir de ahora, prestaré atención", en: "from now on, I'll pay attention" }
  },
  {
    rank: 501, thai: "เรือ", es: "rǔea", spanish: "barco", english: "boat", rtgs: "", cefr: null, freq: 501, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เรือดี", es: "rǔea dii", spanish: "barco bueno" },
    question: { thai: "มีเรือไหม", es: "mii rǔea mǎi", spanish: "¿Hay barco?" },
    answer: { thai: "มีเรือ", es: "mii rǔea", spanish: "Sí, hay barco" }
  },
  {
    rank: 502, thai: "เต็ม", es: "dtem", spanish: "lleno", english: "full", rtgs: "", cefr: null, freq: 502, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เต็มมาก", es: "dtem mâak", spanish: "Muy lleno" },
    question: { thai: "เต็มไหม", es: "dtem mǎi", spanish: "¿lleno?" },
    answer: { thai: "เต็ม", es: "dtem", spanish: "lleno" }
  },
  {
    rank: 503, thai: "ไอ้", es: "âai", spanish: "prefijo despectivo", english: "derogatory prefix", rtgs: "", cefr: null, freq: 503, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "ไอ้คนนั่น", es: "âai khon nân", spanish: "ese tipo (despectivo), en: "that guy (derogatory)" },
    question: { thai: "ไอ้ไหม", es: "âai mǎi", spanish: "¿prefijo despectivo?" },
    answer: { thai: "ไอ้", es: "âai", spanish: "prefijo despectivo" }
  },
  {
    rank: 504, thai: "ปรับ", es: "bpràp", spanish: "ajustar/multa", english: "adjust/fine", rtgs: "", cefr: null, freq: 504, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันปรับ", es: "chǎn bpràp", spanish: "Yo ajusto/multo" },
    question: { thai: "คุณปรับไหม", es: "khun bpràp mǎi", spanish: "¿ajustar/multa?" },
    answer: { thai: "ปรับ", es: "bpràp", spanish: "ajustar/multa" }
  },
  {
    rank: 505, thai: "เจ้าหน้าที่", es: "jâo-nâa-tii", spanish: "oficial/funcionario", english: "officer/official", rtgs: "", cefr: null, freq: 505, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เจ้าหน้าที่ดี", es: "jâo-nâa-tii dii", spanish: "oficial/funcionario bueno" },
    question: { thai: "มีเจ้าหน้าที่ไหม", es: "mii jâo-nâa-tii mǎi", spanish: "¿Hay oficial/funcionario?" },
    answer: { thai: "มีเจ้าหน้าที่", es: "mii jâo-nâa-tii", spanish: "Sí, hay oficial/funcionario" }
  },
  {
    rank: 506, thai: "หยุด", es: "yùt", spanish: "parar/detener", english: "stop", rtgs: "", cefr: null, freq: 506, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันหยุด", es: "chǎn yùt", spanish: "Yo paro/detengo" },
    question: { thai: "คุณหยุดไหม", es: "khun yùt mǎi", spanish: "¿parar/detener?" },
    answer: { thai: "หยุด", es: "yùt", spanish: "parar/detener" }
  },
  {
    rank: 507, thai: "ยังคง", es: "yang-khong", spanish: "todavía/aún", english: "still", rtgs: "", cefr: null, freq: 507, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ยังคงรออยู่", es: "yang-khong rɔɔ yùu", spanish: "todavía está esperando, en: "still waiting" },
    question: { thai: "ยังคงไหม", es: "yang-khong mǎi", spanish: "¿todavía/aún?" },
    answer: { thai: "ยังคง", es: "yang-khong", spanish: "todavía/aún" }
  },
  {
    rank: 508, thai: "แก้", es: "gâae", spanish: "arreglar/corregir", english: "fix/correct", rtgs: "", cefr: null, freq: 508, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันแก้", es: "chǎn gâae", spanish: "Yo arreglo/corrijo" },
    question: { thai: "คุณแก้ไหม", es: "khun gâae mǎi", spanish: "¿arreglar/corregir?" },
    answer: { thai: "แก้", es: "gâae", spanish: "arreglar/corregir" }
  },
  {
    rank: 509, thai: "ปกครอง", es: "bpòk-khrong", spanish: "gobernar", english: "govern", rtgs: "", cefr: null, freq: 509, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันปกครอง", es: "chǎn bpòk-khrong", spanish: "Yo gobierno" },
    question: { thai: "คุณปกครองไหม", es: "khun bpòk-khrong mǎi", spanish: "¿gobernar?" },
    answer: { thai: "ปกครอง", es: "bpòk-khrong", spanish: "gobernar" }
  },
  {
    rank: 510, thai: "พัก", es: "phák", spanish: "descansar", english: "rest", rtgs: "", cefr: null, freq: 510, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันพัก", es: "chǎn phák", spanish: "Yo descanso" },
    question: { thai: "คุณพักไหม", es: "khun phák mǎi", spanish: "¿descansar?" },
    answer: { thai: "พัก", es: "phák", spanish: "descansar" }
  },
  {
    rank: 511, thai: "คำ", es: "kham", spanish: "palabra", english: "word", rtgs: "", cefr: null, freq: 511, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คำดี", es: "kham dii", spanish: "palabra bueno" },
    question: { thai: "มีคำไหม", es: "mii kham mǎi", spanish: "¿Hay palabra?" },
    answer: { thai: "มีคำ", es: "mii kham", spanish: "Sí, hay palabra" }
  },
  {
    rank: 512, thai: "ทำให้", es: "tam-hâi", spanish: "hacer que", english: "make", rtgs: "", cefr: null, freq: 512, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันทำให้", es: "chǎn tam-hâi", spanish: "Yo hago que" },
    question: { thai: "คุณทำให้ไหม", es: "khun tam-hâi mǎi", spanish: "¿hacer que?" },
    answer: { thai: "ทำให้", es: "tam-hâi", spanish: "hacer que" }
  },
  {
    rank: 513, thai: "หน้า", es: "nâa", spanish: "cara/página", english: "face/page", rtgs: "", cefr: null, freq: 513, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "หน้าดี", es: "nâa dii", spanish: "cara/página bueno" },
    question: { thai: "มีหน้าไหม", es: "mii nâa mǎi", spanish: "¿Hay cara/página?" },
    answer: { thai: "มีหน้า", es: "mii nâa", spanish: "Sí, hay cara/página" }
  },
  {
    rank: 514, thai: "ความเป็น", es: "khwaam-bpen", spanish: "existencia/ser", english: "being", rtgs: "", cefr: null, freq: 514, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ความเป็นดี", es: "khwaam-bpen dii", spanish: "existencia/ser bueno" },
    question: { thai: "มีความเป็นไหม", es: "mii khwaam-bpen mǎi", spanish: "¿Hay existencia/ser?" },
    answer: { thai: "มีความเป็น", es: "mii khwaam-bpen", spanish: "Sí, hay existencia/ser" }
  },
  {
    rank: 515, thai: "หา", es: "hǎa", spanish: "buscar", english: "look for", rtgs: "", cefr: null, freq: 515, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหา", es: "chǎn hǎa", spanish: "Yo busco" },
    question: { thai: "คุณหาไหม", es: "khun hǎa mǎi", spanish: "¿buscar?" },
    answer: { thai: "หา", es: "hǎa", spanish: "buscar" }
  },
  {
    rank: 516, thai: "ใกล้", es: "glâi", spanish: "cerca", english: "near", rtgs: "", cefr: null, freq: 516, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ใกล้บ้าน", es: "glâi bâan", spanish: "cerca de casa, en: "near home" },
    question: { thai: "ใกล้ไหม", es: "glâi mǎi", spanish: "¿cerca?" },
    answer: { thai: "ใกล้", es: "glâi", spanish: "cerca" }
  },
  {
    rank: 517, thai: "ก่อน", es: "gòon", spanish: "antes", english: "before", rtgs: "", cefr: null, freq: 517, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ก่อนนอน", es: "gòon non", spanish: "antes de dormir, en: "before sleeping" },
    question: { thai: "ก่อนไหม", es: "gòon mǎi", spanish: "¿antes?" },
    answer: { thai: "ก่อน", es: "gòon", spanish: "antes" }
  },
  {
    rank: 518, thai: "หลาย", es: "lǎai", spanish: "varios/muchos", english: "many", rtgs: "", cefr: null, freq: 518, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "หลายมาก", es: "lǎai mâak", spanish: "Muy varios/muchos" },
    question: { thai: "หลายไหม", es: "lǎai mǎi", spanish: "¿varios/muchos?" },
    answer: { thai: "หลาย", es: "lǎai", spanish: "varios/muchos" }
  },
  {
    rank: 519, thai: "เช่น", es: "chên", spanish: "como/tal como", english: "such as", rtgs: "", cefr: null, freq: 519, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เช่นเดียวกัน", es: "chên diao gan", spanish: "de la misma manera, en: "likewise / the same" },
    question: { thai: "เช่นไหม", es: "chên mǎi", spanish: "¿como/tal como?" },
    answer: { thai: "เช่น", es: "chên", spanish: "como/tal como" }
  },
  {
    rank: 520, thai: "อย่าง", es: "yàang", spanish: "manera", english: "way", rtgs: "", cefr: null, freq: 520, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "อย่างรวดเร็ว", es: "yàang rûat-reo", spanish: "de manera rápida, en: "in a quick way" },
    question: { thai: "อย่างไหม", es: "yàang mǎi", spanish: "¿manera?" },
    answer: { thai: "อย่าง", es: "yàang", spanish: "manera" }
  },
  {
    rank: 521, thai: "ข้าง", es: "kâang", spanish: "lado", english: "side", rtgs: "", cefr: null, freq: 521, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้างดี", es: "kâang dii", spanish: "lado bueno" },
    question: { thai: "มีข้างไหม", es: "mii kâang mǎi", spanish: "¿Hay lado?" },
    answer: { thai: "มีข้าง", es: "mii kâang", spanish: "Sí, hay lado" }
  },
  {
    rank: 522, thai: "ทั้งหมด", es: "tháng-mòt", spanish: "todo/entero", english: "all", rtgs: "", cefr: null, freq: 522, notes: "",
    category: "expresiones", tone: "h",
    phrase: { thai: "ทั้งหมดนี้", es: "tháng-mòt níi", spanish: "todo esto, en: "all of this" },
    question: { thai: "ทั้งหมดไหม", es: "tháng-mòt mǎi", spanish: "¿todo/entero?" },
    answer: { thai: "ทั้งหมด", es: "tháng-mòt", spanish: "todo/entero" }
  },
  {
    rank: 523, thai: "หนึ่ง", es: "nùeng", spanish: "uno", english: "one", rtgs: "", cefr: null, freq: 523, notes: "",
    category: "números", tone: "l",
    phrase: { thai: "หนึ่งคน", es: "nùeng khon", spanish: "una persona, en: "one person" },
    question: { thai: "หนึ่งไหม", es: "nùeng mǎi", spanish: "¿uno?" },
    answer: { thai: "หนึ่ง", es: "nùeng", spanish: "uno" }
  },
  {
    rank: 524, thai: "ทาง", es: "thaang", spanish: "camino/dirección", english: "way/direction", rtgs: "", cefr: null, freq: 524, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทางดี", es: "thaang dii", spanish: "camino/dirección bueno" },
    question: { thai: "มีทางไหม", es: "mii thaang mǎi", spanish: "¿Hay camino/dirección?" },
    answer: { thai: "มีทาง", es: "mii thaang", spanish: "Sí, hay camino/dirección" }
  },
  {
    rank: 525, thai: "เกิด", es: "gèet", spanish: "nacer/suceder", english: "born/happen", rtgs: "", cefr: null, freq: 525, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเกิด", es: "chǎn gèet", spanish: "Yo nazco/sucedo" },
    question: { thai: "คุณเกิดไหม", es: "khun gèet mǎi", spanish: "¿nacer/suceder?" },
    answer: { thai: "เกิด", es: "gèet", spanish: "nacer/suceder" }
  },
  {
    rank: 526, thai: "ใช่", es: "châi", spanish: "sí (confirmación)", english: "yes", rtgs: "", cefr: null, freq: 526, notes: "",
    category: "expresiones", tone: "f",
    phrase: { thai: "ใช่แล้ว!", es: "châi lɛ́ɛw!", spanish: "¡así es!, en: "that's right!" },
    question: { thai: "ใช่ไหม", es: "châi mǎi", spanish: "¿sí (confirmación)?" },
    answer: { thai: "ใช่", es: "châi", spanish: "sí (confirmación)" }
  },
  {
    rank: 527, thai: "ต้อง", es: "dtôong", spanish: "deber/necesitar", english: "must", rtgs: "", cefr: null, freq: 527, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันต้อง", es: "chǎn dtôong", spanish: "Yo debo/necesito" },
    question: { thai: "คุณต้องไหม", es: "khun dtôong mǎi", spanish: "¿deber/necesitar?" },
    answer: { thai: "ต้อง", es: "dtôong", spanish: "deber/necesitar" }
  },
  {
    rank: 528, thai: "เมื่อ", es: "mûea", spanish: "cuando", english: "when", rtgs: "", cefr: null, freq: 528, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เมื่อวานซืน", es: "mûea waan sǔen", spanish: "ayer, en: "yesterday" },
    question: { thai: "เมื่อไหม", es: "mûea mǎi", spanish: "¿cuando?" },
    answer: { thai: "เมื่อ", es: "mûea", spanish: "cuando" }
  },
  {
    rank: 529, thai: "เพราะ", es: "phrɔ́", spanish: "porque", english: "because", rtgs: "", cefr: null, freq: 529, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "เพราะฝนตก", es: "phrɔ fǒn dtòk", spanish: "porque llueve, en: "because it rains" },
    question: { thai: "เพราะไหม", es: "phrɔ́ mǎi", spanish: "¿porque?" },
    answer: { thai: "เพราะ", es: "phrɔ́", spanish: "porque" }
  },
  {
    rank: 530, thai: "เกิน", es: "gəən", spanish: "exceder", english: "exceed", rtgs: "", cefr: null, freq: 530, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเกิน", es: "chǎn gəən", spanish: "Yo excedo" },
    question: { thai: "คุณเกินไหม", es: "khun gəən mǎi", spanish: "¿exceder?" },
    answer: { thai: "เกิน", es: "gəən", spanish: "exceder" }
  },
  {
    rank: 531, thai: "กว่า", es: "kwàa", spanish: "más que", english: "more than", rtgs: "", cefr: null, freq: 531, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "ดีกว่า", es: "dii kwàa", spanish: "mejor que, en: "better than" },
    question: { thai: "กว่าไหม", es: "kwàa mǎi", spanish: "¿más que?" },
    answer: { thai: "กว่า", es: "kwàa", spanish: "más que" }
  },
  {
    rank: 532, thai: "เห็น", es: "hěn", spanish: "ver", english: "see", rtgs: "", cefr: null, freq: 532, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเห็น", es: "chǎn hěn", spanish: "Yo veo" },
    question: { thai: "คุณเห็นไหม", es: "khun hěn mǎi", spanish: "¿ver?" },
    answer: { thai: "เห็น", es: "hěn", spanish: "ver" }
  },
  {
    rank: 533, thai: "ของ", es: "khǒong", spanish: "cosa/de", english: "of/thing", rtgs: "", cefr: null, freq: 533, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ของดี", es: "khǒong dii", spanish: "cosa/de bueno" },
    question: { thai: "มีของไหม", es: "mii khǒong mǎi", spanish: "¿Hay cosa/de?" },
    answer: { thai: "มีของ", es: "mii khǒong", spanish: "Sí, hay cosa/de" }
  },
  {
    rank: 534, thai: "ออก", es: "òok", spanish: "salir", english: "exit", rtgs: "", cefr: null, freq: 534, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันออก", es: "chǎn òok", spanish: "Yo salgo" },
    question: { thai: "คุณออกไหม", es: "khun òok mǎi", spanish: "¿salir?" },
    answer: { thai: "ออก", es: "òok", spanish: "salir" }
  },
  {
    rank: 535, thai: "ใต้", es: "dtâai", spanish: "debajo", english: "under", rtgs: "", cefr: null, freq: 535, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ใต้โต๊ะ", es: "dtâai tó", spanish: "debajo de la mesa, en: "under the table" },
    question: { thai: "ใต้ไหม", es: "dtâai mǎi", spanish: "¿debajo?" },
    answer: { thai: "ใต้", es: "dtâai", spanish: "debajo" }
  },
  {
    rank: 536, thai: "กลาย", es: "glaai", spanish: "convertirse", english: "become", rtgs: "", cefr: null, freq: 536, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันกลาย", es: "chǎn glaai", spanish: "Yo convertirse" },
    question: { thai: "คุณกลายไหม", es: "khun glaai mǎi", spanish: "¿convertirse?" },
    answer: { thai: "กลาย", es: "glaai", spanish: "convertirse" }
  },
  {
    rank: 537, thai: "ภายใต้", es: "phaai-dtâai", spanish: "debajo de", english: "under", rtgs: "", cefr: null, freq: 537, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ภายใต้น้ำ", es: "phaai-dtâai nám", spanish: "bajo el agua, en: "under water" },
    question: { thai: "ภายใต้ไหม", es: "phaai-dtâai mǎi", spanish: "¿debajo de?" },
    answer: { thai: "ภายใต้", es: "phaai-dtâai", spanish: "debajo de" }
  },
  {
    rank: 538, thai: "มาก", es: "mâak", spanish: "muy/mucho", english: "very/much", rtgs: "", cefr: null, freq: 538, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "อร่อยมาก", es: "a-ròi mâak", spanish: "muy delicioso, en: "very delicious" },
    question: { thai: "มากไหม", es: "mâak mǎi", spanish: "¿muy/mucho?" },
    answer: { thai: "มาก", es: "mâak", spanish: "muy/mucho" }
  },
  {
    rank: 539, thai: "จาก", es: "jàak", spanish: "de/desde", english: "from", rtgs: "", cefr: null, freq: 539, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "จากกรุงเทพ", es: "jàak grung-thêep", spanish: "desde Bangkok, en: "from Bangkok" },
    question: { thai: "จากไหม", es: "jàak mǎi", spanish: "¿de/desde?" },
    answer: { thai: "จาก", es: "jàak", spanish: "de/desde" }
  },
  {
    rank: 540, thai: "พบ", es: "póp", spanish: "encontrar", english: "find/meet", rtgs: "", cefr: null, freq: 540, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันพบ", es: "chǎn póp", spanish: "Yo encuentro" },
    question: { thai: "คุณพบไหม", es: "khun póp mǎi", spanish: "¿encontrar?" },
    answer: { thai: "พบ", es: "póp", spanish: "encontrar" }
  },
  {
    rank: 541, thai: "เพิ่ม", es: "pêrm", spanish: "añadir/incrementar", english: "add/increase", rtgs: "", cefr: null, freq: 541, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเพิ่ม", es: "chǎn pêrm", spanish: "Yo añadir/incrementar" },
    question: { thai: "คุณเพิ่มไหม", es: "khun pêrm mǎi", spanish: "¿añadir/incrementar?" },
    answer: { thai: "เพิ่ม", es: "pêrm", spanish: "añadir/incrementar" }
  },
  {
    rank: 542, thai: "เพื่อ", es: "pêua", spanish: "para", english: "for", rtgs: "", cefr: null, freq: 542, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เพื่อคุณ", es: "pêua khun", spanish: "para ti, en: "for you" },
    question: { thai: "เพื่อไหม", es: "pêua mǎi", spanish: "¿para?" },
    answer: { thai: "เพื่อ", es: "pêua", spanish: "para" }
  },
  {
    rank: 543, thai: "พระ", es: "phrá", spanish: "monje/respetable", english: "monk/venerable", rtgs: "", cefr: null, freq: 543, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "พระดี", es: "phrá dii", spanish: "monje/respetable bueno" },
    question: { thai: "มีพระไหม", es: "mii phrá mǎi", spanish: "¿Hay monje/respetable?" },
    answer: { thai: "มีพระ", es: "mii phrá", spanish: "Sí, hay monje/respetable" }
  },
  {
    rank: 544, thai: "ปี", es: "bpii", spanish: "año", english: "year", rtgs: "", cefr: null, freq: 544, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปีดี", es: "bpii dii", spanish: "año bueno" },
    question: { thai: "มีปีไหม", es: "mii bpii mǎi", spanish: "¿Hay año?" },
    answer: { thai: "มีปี", es: "mii bpii", spanish: "Sí, hay año" }
  },
  {
    rank: 545, thai: "บาง", es: "baang", spanish: "delgado", english: "thin", rtgs: "", cefr: null, freq: 545, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "บางมาก", es: "baang mâak", spanish: "Muy delgado" },
    question: { thai: "บางไหม", es: "baang mǎi", spanish: "¿delgado?" },
    answer: { thai: "บาง", es: "baang", spanish: "delgado" }
  },
  {
    rank: 546, thai: "มีอยู่", es: "mii-yùu", spanish: "existir/haber", english: "exist", rtgs: "", cefr: null, freq: 546, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันมีอยู่", es: "chǎn mii-yùu", spanish: "Yo existo/hay" },
    question: { thai: "คุณมีอยู่ไหม", es: "khun mii-yùu mǎi", spanish: "¿existir/haber?" },
    answer: { thai: "มีอยู่", es: "mii-yùu", spanish: "existir/haber" }
  },
  {
    rank: 547, thai: "กับ", es: "gàp", spanish: "con/y", english: "with/and", rtgs: "", cefr: null, freq: 547, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "กับฉัน", es: "gàp chǎn", spanish: "conmigo, en: "with me" },
    question: { thai: "กับไหม", es: "gàp mǎi", spanish: "¿con/y?" },
    answer: { thai: "กับ", es: "gàp", spanish: "con/y" }
  },
  {
    rank: 548, thai: "หรือ", es: "rǐeu", spanish: "o", english: "or", rtgs: "", cefr: null, freq: 548, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "ชาหรือกาแฟ", es: "chaa rǐeu gaa-fae", spanish: "¿té o café?, en: "tea or coffee?" },
    question: { thai: "หรือไหม", es: "rǐeu mǎi", spanish: "¿o?" },
    answer: { thai: "หรือ", es: "rǐeu", spanish: "o" }
  },
  {
    rank: 549, thai: "ขึ้น", es: "kêun", spanish: "subir", english: "rise", rtgs: "", cefr: null, freq: 549, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันขึ้น", es: "chǎn kêun", spanish: "Yo subo" },
    question: { thai: "คุณขึ้นไหม", es: "khun kêun mǎi", spanish: "¿subir?" },
    answer: { thai: "ขึ้น", es: "kêun", spanish: "subir" }
  },
  {
    rank: 550, thai: "ครั้ง", es: "kráng", spanish: "vez", english: "time/occasion", rtgs: "", cefr: null, freq: 550, notes: "",
    category: "clasificadores", tone: "m",
    phrase: { thai: "สองครั้ง", es: "sǎawng kráng", spanish: "dos veces, en: "two times" },
    question: { thai: "ครั้งไหม", es: "kráng mǎi", spanish: "¿vez?" },
    answer: { thai: "ครั้ง", es: "kráng", spanish: "vez" }
  },
  {
    rank: 551, thai: "คิด", es: "khít", spanish: "pensar", english: "think", rtgs: "", cefr: null, freq: 551, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันคิด", es: "chǎn khít", spanish: "Yo pienso" },
    question: { thai: "คุณคิดไหม", es: "khun khít mǎi", spanish: "¿pensar?" },
    answer: { thai: "คิด", es: "khít", spanish: "pensar" }
  },
  {
    rank: 552, thai: "พูด", es: "pùut", spanish: "hablar", english: "speak", rtgs: "", cefr: null, freq: 552, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันพูด", es: "chǎn pùut", spanish: "Yo hablo" },
    question: { thai: "คุณพูดไหม", es: "khun pùut mǎi", spanish: "¿hablar?" },
    answer: { thai: "พูด", es: "pùut", spanish: "hablar" }
  },
  {
    rank: 553, thai: "ส่ง", es: "sòong", spanish: "enviar", english: "send", rtgs: "", cefr: null, freq: 553, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันส่ง", es: "chǎn sòong", spanish: "Yo envío" },
    question: { thai: "คุณส่งไหม", es: "khun sòong mǎi", spanish: "¿enviar?" },
    answer: { thai: "ส่ง", es: "sòong", spanish: "enviar" }
  },
  {
    rank: 554, thai: "อ่าน", es: "àan", spanish: "leer", english: "read", rtgs: "", cefr: null, freq: 554, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันอ่าน", es: "chǎn àan", spanish: "Yo leo" },
    question: { thai: "คุณอ่านไหม", es: "khun àan mǎi", spanish: "¿leer?" },
    answer: { thai: "อ่าน", es: "àan", spanish: "leer" }
  },
  {
    rank: 555, thai: "เคย", es: "khooei", spanish: "soler/haber", english: "ever", rtgs: "", cefr: null, freq: 555, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "เคยไปเชียงใหม่", es: "khooei bpai chiang-mài", spanish: "haber ido a Chiang Mai, en: "have been to Chiang Mai" },
    question: { thai: "เคยไหม", es: "khooei mǎi", spanish: "¿soler/haber?" },
    answer: { thai: "เคย", es: "khooei", spanish: "soler/haber" }
  },
  {
    rank: 556, thai: "สอน", es: "sǎawn", spanish: "enseñar", english: "teach", rtgs: "", cefr: null, freq: 556, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันสอน", es: "chǎn sǎawn", spanish: "Yo enseñar" },
    question: { thai: "คุณสอนไหม", es: "khun sǎawn mǎi", spanish: "¿enseñar?" },
    answer: { thai: "สอน", es: "sǎawn", spanish: "enseñar" }
  },
  {
    rank: 557, thai: "เลย", es: "looei", spanish: "en absoluto/entonces", english: "at all/then", rtgs: "", cefr: null, freq: 557, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ไม่เลย", es: "mâi looei", spanish: "en absoluto, en: "not at all" },
    question: { thai: "เลยไหม", es: "looei mǎi", spanish: "¿en absoluto/entonces?" },
    answer: { thai: "เลย", es: "looei", spanish: "en absoluto/entonces" }
  },
  {
    rank: 558, thai: "รู้", es: "rúu", spanish: "saber/conocer", english: "know", rtgs: "", cefr: null, freq: 558, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันรู้", es: "chǎn rúu", spanish: "Yo sé/conozco" },
    question: { thai: "คุณรู้ไหม", es: "khun rúu mǎi", spanish: "¿saber/conocer?" },
    answer: { thai: "รู้", es: "rúu", spanish: "saber/conocer" }
  },
  {
    rank: 559, thai: "เสมอ", es: "sà-mǒeo", spanish: "siempre", english: "always", rtgs: "", cefr: null, freq: 559, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "รักกันเสมอ", es: "rák gan sà-mǒeo", spanish: "amarse siempre, en: "always love each other" },
    question: { thai: "เสมอไหม", es: "sà-mǒeo mǎi", spanish: "¿siempre?" },
    answer: { thai: "เสมอ", es: "sà-mǒeo", spanish: "siempre" }
  },
  {
    rank: 560, thai: "เกี่ยวกับ", es: "gìao-gàp", spanish: "sobre", english: "about", rtgs: "", cefr: null, freq: 560, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "เรื่องเกี่ยวกับการงาน", es: "rʉ̂aŋ gìao-gàp gaan-ngaam", spanish: "asunto sobre el trabajo, en: "matter about work" },
    question: { thai: "เกี่ยวกับไหม", es: "gìao-gàp mǎi", spanish: "¿sobre?" },
    answer: { thai: "เกี่ยวกับ", es: "gìao-gàp", spanish: "sobre" }
  },
  {
    rank: 561, thai: "จิตใจ", es: "jìt-jai", spanish: "mente/corazón", english: "mind/heart", rtgs: "", cefr: null, freq: 561, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จิตใจดี", es: "jìt-jai dii", spanish: "mente/corazón bueno" },
    question: { thai: "มีจิตใจไหม", es: "mii jìt-jai mǎi", spanish: "¿Hay mente/corazón?" },
    answer: { thai: "มีจิตใจ", es: "mii jìt-jai", spanish: "Sí, hay mente/corazón" }
  },
  {
    rank: 562, thai: "กลับ", es: "glàp", spanish: "volver/contrario", english: "return/back", rtgs: "", cefr: null, freq: 562, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกลับ", es: "chǎn glàp", spanish: "Yo vuelvo" },
    question: { thai: "คุณกลับไหม", es: "khun glàp mǎi", spanish: "¿volver/contrario?" },
    answer: { thai: "กลับ", es: "glàp", spanish: "volver/contrario" }
  },
  {
    rank: 563, thai: "เก่า", es: "gào", spanish: "viejo", english: "old", rtgs: "", cefr: null, freq: 563, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เก่ามาก", es: "gào mâak", spanish: "Muy viejo" },
    question: { thai: "เก่าไหม", es: "gào mǎi", spanish: "¿viejo?" },
    answer: { thai: "เก่า", es: "gào", spanish: "viejo" }
  },
  {
    rank: 564, thai: "หนังสือ", es: "nǎng-sǔue", spanish: "libro", english: "book", rtgs: "", cefr: null, freq: 564, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หนังสือดี", es: "nǎng-sǔue dii", spanish: "libro bueno" },
    question: { thai: "มีหนังสือไหม", es: "mii nǎng-sǔue mǎi", spanish: "¿Hay libro?" },
    answer: { thai: "มีหนังสือ", es: "mii nǎng-sǔue", spanish: "Sí, hay libro" }
  },
  {
    rank: 565, thai: "หรอก", es: "rǎwk", spanish: "partícula (negación)", english: "particle", rtgs: "", cefr: null, freq: 565, notes: "",
    category: "expresiones", tone: "l",
    phrase: { thai: "ไม่สนใจหรอก", es: "mâi sǒn-jai rǎwk", spanish: "no me importa, en: "I don't care" },
    question: { thai: "หรอกไหม", es: "rǎwk mǎi", spanish: "¿partícula (negación)?" },
    answer: { thai: "หรอก", es: "rǎwk", spanish: "partícula (negación)" }
  },
  {
    rank: 566, thai: "ตัว", es: "dtua", spanish: "cuerpo/clasificador", english: "body/self", rtgs: "", cefr: null, freq: 566, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ตัวดี", es: "dtua dii", spanish: "cuerpo/clasificador bueno" },
    question: { thai: "มีตัวไหม", es: "mii dtua mǎi", spanish: "¿Hay cuerpo/clasificador?" },
    answer: { thai: "มีตัว", es: "mii dtua", spanish: "Sí, hay cuerpo/clasificador" }
  },
  {
    rank: 567, thai: "คุณ", es: "khun", spanish: "tú/bueno", english: "you/good", rtgs: "", cefr: null, freq: 567, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "คุณชื่ออะไร", es: "khun chûue à-rai", spanish: "¿cómo te llamas?, en: "what is your name?" },
    question: { thai: "คุณไหม", es: "khun mǎi", spanish: "¿tú/bueno?" },
    answer: { thai: "คุณ", es: "khun", spanish: "tú/bueno" }
  },
  {
    rank: 568, thai: "เรา", es: "rao", spanish: "nosotros", english: "we", rtgs: "", cefr: null, freq: 568, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "เราเป็นเพื่อน", es: "rao bpen phʉ̂an", spanish: "somos amigos, en: "we are friends" },
    question: { thai: "เราไหม", es: "rao mǎi", spanish: "¿nosotros?" },
    answer: { thai: "เรา", es: "rao", spanish: "nosotros" }
  },
  {
    rank: 569, thai: "คน", es: "khon", spanish: "persona", english: "person", rtgs: "", cefr: null, freq: 569, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คนดี", es: "khon dii", spanish: "persona bueno" },
    question: { thai: "มีคนไหม", es: "mii khon mǎi", spanish: "¿Hay persona?" },
    answer: { thai: "มีคน", es: "mii khon", spanish: "Sí, hay persona" }
  },
  {
    rank: 570, thai: "ใคร", es: "khrai", spanish: "quién", english: "who", rtgs: "", cefr: null, freq: 570, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "ใครมา", es: "khrai maa", spanish: "¿quién vino?, en: "who came?" },
    question: { thai: "ใครไหม", es: "khrai mǎi", spanish: "¿quién?" },
    answer: { thai: "ใคร", es: "khrai", spanish: "quién" }
  },
  {
    rank: 571, thai: "อะไร", es: "a-rai", spanish: "qué", english: "what", rtgs: "", cefr: null, freq: 571, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "นี่อะไร", es: "nîi à-rai", spanish: "¿qué es esto?, en: "what is this?" },
    question: { thai: "อะไรไหม", es: "a-rai mǎi", spanish: "¿qué?" },
    answer: { thai: "อะไร", es: "a-rai", spanish: "qué" }
  },
  {
    rank: 572, thai: "ที่ไหน", es: "thîi-nǎi", spanish: "dónde", english: "where", rtgs: "", cefr: null, freq: 572, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "อยู่ที่ไหน", es: "yùu thîi nǎi", spanish: "¿dónde está?, en: "where is it?" },
    question: { thai: "ที่ไหนไหม", es: "thîi-nǎi mǎi", spanish: "¿dónde?" },
    answer: { thai: "ที่ไหน", es: "thîi-nǎi", spanish: "dónde" }
  },
  {
    rank: 573, thai: "เมื่อไหร่", es: "mûea-rài", spanish: "cuándo", english: "when", rtgs: "", cefr: null, freq: 573, notes: "",
    category: "pronombres", tone: "h",
    phrase: { thai: "เมื่อไหร่จะไป", es: "mûea-rài jà bpai", spanish: "¿cuándo vas a ir?, en: "when will you go?" },
    question: { thai: "เมื่อไหร่ไหม", es: "mûea-rài mǎi", spanish: "¿cuándo?" },
    answer: { thai: "เมื่อไหร่", es: "mûea-rài", spanish: "cuándo" }
  },
  {
    rank: 574, thai: "อย่างไร", es: "yàang-rai", spanish: "cómo", english: "how", rtgs: "", cefr: null, freq: 574, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "ทำอย่างไรดี", es: "tham yàang-rai dii", spanish: "¿qué hacer?, en: "what should we do?" },
    question: { thai: "อย่างไรไหม", es: "yàang-rai mǎi", spanish: "¿cómo?" },
    answer: { thai: "อย่างไร", es: "yàang-rai", spanish: "cómo" }
  },
  {
    rank: 575, thai: "กี่", es: "kìi", spanish: "cuántos", english: "how many", rtgs: "", cefr: null, freq: 575, notes: "",
    category: "pronombres", tone: "f",
    phrase: { thai: "กี่คน", es: "kìi khon", spanish: "¿cuántas personas?, en: "how many people?" },
    question: { thai: "กี่ไหม", es: "kìi mǎi", spanish: "¿cuántos?" },
    answer: { thai: "กี่", es: "kìi", spanish: "cuántos" }
  },
  {
    rank: 576, thai: "ผม", es: "pǒm", spanish: "pelo", english: "hair", rtgs: "", cefr: null, freq: 576, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ผมดี", es: "pǒm dii", spanish: "pelo bueno" },
    question: { thai: "มีผมไหม", es: "mii pǒm mǎi", spanish: "¿Hay pelo?" },
    answer: { thai: "มีผม", es: "mii pǒm", spanish: "Sí, hay pelo" }
  },
  {
    rank: 577, thai: "ฉัน", es: "chǎn", spanish: "yo (mujer)/comer", english: "I (female)", rtgs: "", cefr: null, freq: 577, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "ฉันหิว", es: "chǎn hǐu", spanish: "tengo hambre, en: "I am hungry" },
    question: { thai: "ฉันไหม", es: "chǎn mǎi", spanish: "¿yo (mujer)/comer?" },
    answer: { thai: "ฉัน", es: "chǎn", spanish: "yo (mujer)/comer" }
  },
  {
    rank: 578, thai: "เขา", es: "khǎo", spanish: "él/ella/ellos", english: "he/she/they", rtgs: "", cefr: null, freq: 578, notes: "",
    category: "pronombres", tone: "r",
    phrase: { thai: "เขากำลังกิน", es: "khǎo gam-lang gin", spanish: "él está comiendo, en: "he is eating" },
    question: { thai: "เขาไหม", es: "khǎo mǎi", spanish: "¿él/ella/ellos?" },
    answer: { thai: "เขา", es: "khǎo", spanish: "él/ella/ellos" }
  },
  {
    rank: 579, thai: "มัน", es: "man", spanish: "rico/untuoso", english: "rich/oily", rtgs: "", cefr: null, freq: 579, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "มันมาก", es: "man mâak", spanish: "Muy rico/untuoso" },
    question: { thai: "มันไหม", es: "man mǎi", spanish: "¿rico/untuoso?" },
    answer: { thai: "มัน", es: "man", spanish: "rico/untuoso" }
  },
  {
    rank: 580, thai: "เธอ", es: "thooe", spanish: "ella/tú", english: "she/you", rtgs: "", cefr: null, freq: 580, notes: "",
    category: "pronombres", tone: "m",
    phrase: { thai: "เธอน่ารัก", es: "thooe nâa-rák", spanish: "tú eres linda, en: "you are cute" },
    question: { thai: "เธอไหม", es: "thooe mǎi", spanish: "¿ella/tú?" },
    answer: { thai: "เธอ", es: "thooe", spanish: "ella/tú" }
  },
  {
    rank: 581, thai: "พวก", es: "pûuak", spanish: "grupo/clan", english: "group", rtgs: "", cefr: null, freq: 581, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พวกดี", es: "pûuak dii", spanish: "grupo/clan bueno" },
    question: { thai: "มีพวกไหม", es: "mii pûuak mǎi", spanish: "¿Hay grupo/clan?" },
    answer: { thai: "มีพวก", es: "mii pûuak", spanish: "Sí, hay grupo/clan" }
  },
  {
    rank: 582, thai: "บ้าน", es: "bâan", spanish: "casa", english: "house/home", rtgs: "", cefr: null, freq: 582, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "บ้านดี", es: "bâan dii", spanish: "casa bueno" },
    question: { thai: "มีบ้านไหม", es: "mii bâan mǎi", spanish: "¿Hay casa?" },
    answer: { thai: "มีบ้าน", es: "mii bâan", spanish: "Sí, hay casa" }
  },
  {
    rank: 583, thai: "น้ำ", es: "nám", spanish: "agua", english: "water", rtgs: "", cefr: null, freq: 583, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "น้ำดี", es: "nám dii", spanish: "agua bueno" },
    question: { thai: "มีน้ำไหม", es: "mii nám mǎi", spanish: "¿Hay agua?" },
    answer: { thai: "มีน้ำ", es: "mii nám", spanish: "Sí, hay agua" }
  },
  {
    rank: 584, thai: "ข้าว", es: "kâao", spanish: "arroz/comida", english: "rice/food", rtgs: "", cefr: null, freq: 584, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้าวดี", es: "kâao dii", spanish: "arroz/comida bueno" },
    question: { thai: "มีข้าวไหม", es: "mii kâao mǎi", spanish: "¿Hay arroz/comida?" },
    answer: { thai: "มีข้าว", es: "mii kâao", spanish: "Sí, hay arroz/comida" }
  },
  {
    rank: 585, thai: "กิน", es: "gin", spanish: "comer", english: "eat", rtgs: "", cefr: null, freq: 585, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันกิน", es: "chǎn gin", spanish: "Yo como" },
    question: { thai: "คุณกินไหม", es: "khun gin mǎi", spanish: "¿comer?" },
    answer: { thai: "กิน", es: "gin", spanish: "comer" }
  },
  {
    rank: 586, thai: "ดื่ม", es: "dùuem", spanish: "beber", english: "drink", rtgs: "", cefr: null, freq: 586, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดื่ม", es: "chǎn dùuem", spanish: "Yo bebo" },
    question: { thai: "คุณดื่มไหม", es: "khun dùuem mǎi", spanish: "¿beber?" },
    answer: { thai: "ดื่ม", es: "dùuem", spanish: "beber" }
  },
  {
    rank: 587, thai: "ทำ", es: "tam", spanish: "hacer", english: "do/make", rtgs: "", cefr: null, freq: 587, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันทำ", es: "chǎn tam", spanish: "Yo hago" },
    question: { thai: "คุณทำไหม", es: "khun tam mǎi", spanish: "¿hacer?" },
    answer: { thai: "ทำ", es: "tam", spanish: "hacer" }
  },
  {
    rank: 588, thai: "รัก", es: "rák", spanish: "amar", english: "love", rtgs: "", cefr: null, freq: 588, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรัก", es: "chǎn rák", spanish: "Yo amo" },
    question: { thai: "คุณรักไหม", es: "khun rák mǎi", spanish: "¿amar?" },
    answer: { thai: "รัก", es: "rák", spanish: "amar" }
  },
  {
    rank: 589, thai: "เล่น", es: "lên", spanish: "jugar", english: "play", rtgs: "", cefr: null, freq: 589, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเล่น", es: "chǎn lên", spanish: "Yo juego" },
    question: { thai: "คุณเล่นไหม", es: "khun lên mǎi", spanish: "¿jugar?" },
    answer: { thai: "เล่น", es: "lên", spanish: "jugar" }
  },
  {
    rank: 590, thai: "นอน", es: "non", spanish: "dormir", english: "sleep", rtgs: "", cefr: null, freq: 590, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันนอน", es: "chǎn non", spanish: "Yo duermo" },
    question: { thai: "คุณนอนไหม", es: "khun non mǎi", spanish: "¿dormir?" },
    answer: { thai: "นอน", es: "non", spanish: "dormir" }
  },
  {
    rank: 591, thai: "ตื่น", es: "dtùean", spanish: "despertar", english: "wake up", rtgs: "", cefr: null, freq: 591, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันตื่น", es: "chǎn dtùean", spanish: "Yo despierto" },
    question: { thai: "คุณตื่นไหม", es: "khun dtùean mǎi", spanish: "¿despertar?" },
    answer: { thai: "ตื่น", es: "dtùean", spanish: "despertar" }
  },
  {
    rank: 592, thai: "ลุก", es: "lúk", spanish: "levantarse", english: "stand up", rtgs: "", cefr: null, freq: 592, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันลุก", es: "chǎn lúk", spanish: "Yo levantarse" },
    question: { thai: "คุณลุกไหม", es: "khun lúk mǎi", spanish: "¿levantarse?" },
    answer: { thai: "ลุก", es: "lúk", spanish: "levantarse" }
  },
  {
    rank: 593, thai: "นั่ง", es: "nâng", spanish: "sentarse", english: "sit", rtgs: "", cefr: null, freq: 593, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันนั่ง", es: "chǎn nâng", spanish: "Yo sentarse" },
    question: { thai: "คุณนั่งไหม", es: "khun nâng mǎi", spanish: "¿sentarse?" },
    answer: { thai: "นั่ง", es: "nâng", spanish: "sentarse" }
  },
  {
    rank: 594, thai: "ยืน", es: "yǔuen", spanish: "estar de pie", english: "stand", rtgs: "", cefr: null, freq: 594, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันยืน", es: "chǎn yǔuen", spanish: "Yo estoy de pie" },
    question: { thai: "คุณยืนไหม", es: "khun yǔuen mǎi", spanish: "¿estar de pie?" },
    answer: { thai: "ยืน", es: "yǔuen", spanish: "estar de pie" }
  },
  {
    rank: 595, thai: "เดิน", es: "dooen", spanish: "caminar", english: "walk", rtgs: "", cefr: null, freq: 595, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเดิน", es: "chǎn dooen", spanish: "Yo camino" },
    question: { thai: "คุณเดินไหม", es: "khun dooen mǎi", spanish: "¿caminar?" },
    answer: { thai: "เดิน", es: "dooen", spanish: "caminar" }
  },
  {
    rank: 596, thai: "วิ่ง", es: "wîng", spanish: "correr", english: "run", rtgs: "", cefr: null, freq: 596, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันวิ่ง", es: "chǎn wîng", spanish: "Yo corro" },
    question: { thai: "คุณวิ่งไหม", es: "khun wîng mǎi", spanish: "¿correr?" },
    answer: { thai: "วิ่ง", es: "wîng", spanish: "correr" }
  },
  {
    rank: 597, thai: "ขับ", es: "khàp", spanish: "conducir", english: "drive", rtgs: "", cefr: null, freq: 597, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันขับ", es: "chǎn khàp", spanish: "Yo conduzco" },
    question: { thai: "คุณขับไหม", es: "khun khàp mǎi", spanish: "¿conducir?" },
    answer: { thai: "ขับ", es: "khàp", spanish: "conducir" }
  },
  {
    rank: 598, thai: "จอด", es: "jòt", spanish: "estacionar", english: "park", rtgs: "", cefr: null, freq: 598, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจอด", es: "chǎn jòt", spanish: "Yo estaciono" },
    question: { thai: "คุณจอดไหม", es: "khun jòt mǎi", spanish: "¿estacionar?" },
    answer: { thai: "จอด", es: "jòt", spanish: "estacionar" }
  },
  {
    rank: 599, thai: "ซื้อ", es: "súeu", spanish: "comprar", english: "buy", rtgs: "", cefr: null, freq: 599, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันซื้อ", es: "chǎn súeu", spanish: "Yo compro" },
    question: { thai: "คุณซื้อไหม", es: "khun súeu mǎi", spanish: "¿comprar?" },
    answer: { thai: "ซื้อ", es: "súeu", spanish: "comprar" }
  },
  {
    rank: 600, thai: "ขาย", es: "kǎai", spanish: "vender", english: "sell", rtgs: "", cefr: null, freq: 600, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันขาย", es: "chǎn kǎai", spanish: "Yo vendo" },
    question: { thai: "คุณขายไหม", es: "khun kǎai mǎi", spanish: "¿vender?" },
    answer: { thai: "ขาย", es: "kǎai", spanish: "vender" }
  },
  {
    rank: 601, thai: "จ่าย", es: "jàai", spanish: "pagar", english: "pay", rtgs: "", cefr: null, freq: 601, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันจ่าย", es: "chǎn jàai", spanish: "Yo pago" },
    question: { thai: "คุณจ่ายไหม", es: "khun jàai mǎi", spanish: "¿pagar?" },
    answer: { thai: "จ่าย", es: "jàai", spanish: "pagar" }
  },
  {
    rank: 602, thai: "ให้", es: "hâi", spanish: "dar", english: "give", rtgs: "", cefr: null, freq: 602, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันให้", es: "chǎn hâi", spanish: "Yo doy" },
    question: { thai: "คุณให้ไหม", es: "khun hâi mǎi", spanish: "¿dar?" },
    answer: { thai: "ให้", es: "hâi", spanish: "dar" }
  },
  {
    rank: 603, thai: "รับ", es: "ráp", spanish: "recibir", english: "receive", rtgs: "", cefr: null, freq: 603, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันรับ", es: "chǎn ráp", spanish: "Yo recibo" },
    question: { thai: "คุณรับไหม", es: "khun ráp mǎi", spanish: "¿recibir?" },
    answer: { thai: "รับ", es: "ráp", spanish: "recibir" }
  },
  {
    rank: 604, thai: "เปิด", es: "bpèet", spanish: "abrir", english: "open", rtgs: "", cefr: null, freq: 604, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเปิด", es: "chǎn bpèet", spanish: "Yo abro" },
    question: { thai: "คุณเปิดไหม", es: "khun bpèet mǎi", spanish: "¿abrir?" },
    answer: { thai: "เปิด", es: "bpèet", spanish: "abrir" }
  },
  {
    rank: 605, thai: "ปิด", es: "bpìt", spanish: "cerrar", english: "close", rtgs: "", cefr: null, freq: 605, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันปิด", es: "chǎn bpìt", spanish: "Yo cierro" },
    question: { thai: "คุณปิดไหม", es: "khun bpìt mǎi", spanish: "¿cerrar?" },
    answer: { thai: "ปิด", es: "bpìt", spanish: "cerrar" }
  },
  {
    rank: 606, thai: "เขียน", es: "khǐan", spanish: "escribir", english: "write", rtgs: "", cefr: null, freq: 606, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันเขียน", es: "chǎn khǐan", spanish: "Yo escribo" },
    question: { thai: "คุณเขียนไหม", es: "khun khǐan mǎi", spanish: "¿escribir?" },
    answer: { thai: "เขียน", es: "khǐan", spanish: "escribir" }
  },
  {
    rank: 607, thai: "วาด", es: "wâat", spanish: "dibujar", english: "draw", rtgs: "", cefr: null, freq: 607, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันวาด", es: "chǎn wâat", spanish: "Yo dibujo" },
    question: { thai: "คุณวาดไหม", es: "khun wâat mǎi", spanish: "¿dibujar?" },
    answer: { thai: "วาด", es: "wâat", spanish: "dibujar" }
  },
  {
    rank: 608, thai: "ฟัง", es: "fang", spanish: "escuchar", english: "listen", rtgs: "", cefr: null, freq: 608, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันฟัง", es: "chǎn fang", spanish: "Yo escucho" },
    question: { thai: "คุณฟังไหม", es: "khun fang mǎi", spanish: "¿escuchar?" },
    answer: { thai: "ฟัง", es: "fang", spanish: "escuchar" }
  },
  {
    rank: 609, thai: "มอง", es: "mong", spanish: "mirar", english: "look", rtgs: "", cefr: null, freq: 609, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันมอง", es: "chǎn mong", spanish: "Yo miro" },
    question: { thai: "คุณมองไหม", es: "khun mong mǎi", spanish: "¿mirar?" },
    answer: { thai: "มอง", es: "mong", spanish: "mirar" }
  },
  {
    rank: 610, thai: "ดม", es: "dom", spanish: "oler", english: "smell", rtgs: "", cefr: null, freq: 610, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดม", es: "chǎn dom", spanish: "Yo huelo" },
    question: { thai: "คุณดมไหม", es: "khun dom mǎi", spanish: "¿oler?" },
    answer: { thai: "ดม", es: "dom", spanish: "oler" }
  },
  {
    rank: 611, thai: "ลิ้ม", es: "lím", spanish: "degustar", english: "taste", rtgs: "", cefr: null, freq: 611, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันลิ้ม", es: "chǎn lím", spanish: "Yo degusto" },
    question: { thai: "คุณลิ้มไหม", es: "khun lím mǎi", spanish: "¿degustar?" },
    answer: { thai: "ลิ้ม", es: "lím", spanish: "degustar" }
  },
  {
    rank: 612, thai: "สัมผัส", es: "sǎm-phàt", spanish: "tocar", english: "touch", rtgs: "", cefr: null, freq: 612, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันสัมผัส", es: "chǎn sǎm-phàt", spanish: "Yo toco" },
    question: { thai: "คุณสัมผัสไหม", es: "khun sǎm-phàt mǎi", spanish: "¿tocar?" },
    answer: { thai: "สัมผัส", es: "sǎm-phàt", spanish: "tocar" }
  },
  {
    rank: 613, thai: "เอา", es: "ao", spanish: "tomar/querer", english: "take/want", rtgs: "", cefr: null, freq: 613, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเอา", es: "chǎn ao", spanish: "Yo tomo/quiero" },
    question: { thai: "คุณเอาไหม", es: "khun ao mǎi", spanish: "¿tomar/querer?" },
    answer: { thai: "เอา", es: "ao", spanish: "tomar/querer" }
  },
  {
    rank: 614, thai: "หยิบ", es: "yìp", spanish: "coger (de la mano)", english: "pick up", rtgs: "", cefr: null, freq: 614, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันหยิบ", es: "chǎn yìp", spanish: "Yo cojo (de la mano)" },
    question: { thai: "คุณหยิบไหม", es: "khun yìp mǎi", spanish: "¿coger (de la mano)?" },
    answer: { thai: "หยิบ", es: "yìp", spanish: "coger (de la mano)" }
  },
  {
    rank: 615, thai: "จับ", es: "jàp", spanish: "agarrar", english: "grasp", rtgs: "", cefr: null, freq: 615, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันจับ", es: "chǎn jàp", spanish: "Yo agarro" },
    question: { thai: "คุณจับไหม", es: "khun jàp mǎi", spanish: "¿agarrar?" },
    answer: { thai: "จับ", es: "jàp", spanish: "agarrar" }
  },
  {
    rank: 616, thai: "ถือ", es: "thǔue", spanish: "sostener", english: "hold", rtgs: "", cefr: null, freq: 616, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันถือ", es: "chǎn thǔue", spanish: "Yo sostengo" },
    question: { thai: "คุณถือไหม", es: "khun thǔue mǎi", spanish: "¿sostener?" },
    answer: { thai: "ถือ", es: "thǔue", spanish: "sostener" }
  },
  {
    rank: 617, thai: "ปล่อย", es: "blòi", spanish: "soltar", english: "release", rtgs: "", cefr: null, freq: 617, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันปล่อย", es: "chǎn blòi", spanish: "Yo suelto" },
    question: { thai: "คุณปล่อยไหม", es: "khun blòi mǎi", spanish: "¿soltar?" },
    answer: { thai: "ปล่อย", es: "blòi", spanish: "soltar" }
  },
  {
    rank: 618, thai: "โยน", es: "yoon", spanish: "lanzar", english: "throw", rtgs: "", cefr: null, freq: 618, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันโยน", es: "chǎn yoon", spanish: "Yo lanzo" },
    question: { thai: "คุณโยนไหม", es: "khun yoon mǎi", spanish: "¿lanzar?" },
    answer: { thai: "โยน", es: "yoon", spanish: "lanzar" }
  },
  {
    rank: 619, thai: "เตะ", es: "té", spanish: "patear", english: "kick", rtgs: "", cefr: null, freq: 619, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันเตะ", es: "chǎn té", spanish: "Yo pateo" },
    question: { thai: "คุณเตะไหม", es: "khun té mǎi", spanish: "¿patear?" },
    answer: { thai: "เตะ", es: "té", spanish: "patear" }
  },
  {
    rank: 620, thai: "ต่อย", es: "dtòi", spanish: "golpear (puño)", english: "punch", rtgs: "", cefr: null, freq: 620, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันต่อย", es: "chǎn dtòi", spanish: "Yo golpeo (puño)" },
    question: { thai: "คุณต่อยไหม", es: "khun dtòi mǎi", spanish: "¿golpear (puño)?" },
    answer: { thai: "ต่อย", es: "dtòi", spanish: "golpear (puño)" }
  },
  {
    rank: 621, thai: "ชก", es: "chók", spanish: "boxear/golpear", english: "box/punch", rtgs: "", cefr: null, freq: 621, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันชก", es: "chǎn chók", spanish: "Yo boxeo" },
    question: { thai: "คุณชกไหม", es: "khun chók mǎi", spanish: "¿boxear/golpear?" },
    answer: { thai: "ชก", es: "chók", spanish: "boxear/golpear" }
  },
  {
    rank: 622, thai: "ตบ", es: "dtòp", spanish: "abofetear", english: "slap", rtgs: "", cefr: null, freq: 622, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันตบ", es: "chǎn dtòp", spanish: "Yo abofeteo" },
    question: { thai: "คุณตบไหม", es: "khun dtòp mǎi", spanish: "¿abofetear?" },
    answer: { thai: "ตบ", es: "dtòp", spanish: "abofetear" }
  },
  {
    rank: 623, thai: "ข่วน", es: "kùan", spanish: "arañar", english: "scratch", rtgs: "", cefr: null, freq: 623, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันข่วน", es: "chǎn kùan", spanish: "Yo arañar" },
    question: { thai: "คุณข่วนไหม", es: "khun kùan mǎi", spanish: "¿arañar?" },
    answer: { thai: "ข่วน", es: "kùan", spanish: "arañar" }
  },
  {
    rank: 624, thai: "กัด", es: "gàt", spanish: "morder", english: "bite", rtgs: "", cefr: null, freq: 624, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันกัด", es: "chǎn gàt", spanish: "Yo muerdo" },
    question: { thai: "คุณกัดไหม", es: "khun gàt mǎi", spanish: "¿morder?" },
    answer: { thai: "กัด", es: "gàt", spanish: "morder" }
  },
  {
    rank: 625, thai: "เคี้ยว", es: "kíao", spanish: "masticar", english: "chew", rtgs: "", cefr: null, freq: 625, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันเคี้ยว", es: "chǎn kíao", spanish: "Yo mastico" },
    question: { thai: "คุณเคี้ยวไหม", es: "khun kíao mǎi", spanish: "¿masticar?" },
    answer: { thai: "เคี้ยว", es: "kíao", spanish: "masticar" }
  },
  {
    rank: 626, thai: "ดูด", es: "dùut", spanish: "chupar", english: "suck", rtgs: "", cefr: null, freq: 626, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันดูด", es: "chǎn dùut", spanish: "Yo chupo" },
    question: { thai: "คุณดูดไหม", es: "khun dùut mǎi", spanish: "¿chupar?" },
    answer: { thai: "ดูด", es: "dùut", spanish: "chupar" }
  },
  {
    rank: 627, thai: "หายใจ", es: "hǎai-jai", spanish: "respirar", english: "breathe", rtgs: "", cefr: null, freq: 627, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหายใจ", es: "chǎn hǎai-jai", spanish: "Yo respiro" },
    question: { thai: "คุณหายใจไหม", es: "khun hǎai-jai mǎi", spanish: "¿respirar?" },
    answer: { thai: "หายใจ", es: "hǎai-jai", spanish: "respirar" }
  },
  {
    rank: 628, thai: "หาว", es: "hǎao", spanish: "bostezar", english: "yawn", rtgs: "", cefr: null, freq: 628, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหาว", es: "chǎn hǎao", spanish: "Yo bostezo" },
    question: { thai: "คุณหาวไหม", es: "khun hǎao mǎi", spanish: "¿bostezar?" },
    answer: { thai: "หาว", es: "hǎao", spanish: "bostezar" }
  },
  {
    rank: 629, thai: "จาม", es: "jaam", spanish: "estornudar", english: "sneeze", rtgs: "", cefr: null, freq: 629, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันจาม", es: "chǎn jaam", spanish: "Yo estornudo" },
    question: { thai: "คุณจามไหม", es: "khun jaam mǎi", spanish: "¿estornudar?" },
    answer: { thai: "จาม", es: "jaam", spanish: "estornudar" }
  },
  {
    rank: 630, thai: "น้ำตา", es: "nám-dtaa", spanish: "lágrima", english: "tear", rtgs: "", cefr: null, freq: 630, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "น้ำตาดี", es: "nám-dtaa dii", spanish: "lágrima bueno" },
    question: { thai: "มีน้ำตาไหม", es: "mii nám-dtaa mǎi", spanish: "¿Hay lágrima?" },
    answer: { thai: "มีน้ำตา", es: "mii nám-dtaa", spanish: "Sí, hay lágrima" }
  },
  {
    rank: 631, thai: "เหงื่อ", es: "ngùea", spanish: "sudor", english: "sweat", rtgs: "", cefr: null, freq: 631, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เหงื่อดี", es: "ngùea dii", spanish: "sudor bueno" },
    question: { thai: "มีเหงื่อไหม", es: "mii ngùea mǎi", spanish: "¿Hay sudor?" },
    answer: { thai: "มีเหงื่อ", es: "mii ngùea", spanish: "Sí, hay sudor" }
  },
  {
    rank: 632, thai: "เลือด", es: "lùeua", spanish: "sangre", english: "blood", rtgs: "", cefr: null, freq: 632, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เลือดดี", es: "lùeua dii", spanish: "sangre bueno" },
    question: { thai: "มีเลือดไหม", es: "mii lùeua mǎi", spanish: "¿Hay sangre?" },
    answer: { thai: "มีเลือด", es: "mii lùeua", spanish: "Sí, hay sangre" }
  },
  {
    rank: 633, thai: "หนัง", es: "nǎng", spanish: "piel/cuero", english: "skin/leather", rtgs: "", cefr: null, freq: 633, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หนังดี", es: "nǎng dii", spanish: "piel/cuero bueno" },
    question: { thai: "มีหนังไหม", es: "mii nǎng mǎi", spanish: "¿Hay piel/cuero?" },
    answer: { thai: "มีหนัง", es: "mii nǎng", spanish: "Sí, hay piel/cuero" }
  },
  {
    rank: 634, thai: "กระดูก", es: "grà-dòok", spanish: "hueso", english: "bone", rtgs: "", cefr: null, freq: 634, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "กระดูกดี", es: "grà-dòok dii", spanish: "hueso bueno" },
    question: { thai: "มีกระดูกไหม", es: "mii grà-dòok mǎi", spanish: "¿Hay hueso?" },
    answer: { thai: "มีกระดูก", es: "mii grà-dòok", spanish: "Sí, hay hueso" }
  },
  {
    rank: 635, thai: "กล้ามเนื้อ", es: "glâam-núea", spanish: "músculo", english: "muscle", rtgs: "", cefr: null, freq: 635, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "กล้ามเนื้อดี", es: "glâam-núea dii", spanish: "músculo bueno" },
    question: { thai: "มีกล้ามเนื้อไหม", es: "mii glâam-núea mǎi", spanish: "¿Hay músculo?" },
    answer: { thai: "มีกล้ามเนื้อ", es: "mii glâam-núea", spanish: "Sí, hay músculo" }
  },
  {
    rank: 636, thai: "ตา", es: "dtaa", spanish: "abuelo materno", english: "grandfather", rtgs: "", cefr: null, freq: 636, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ตาดี", es: "dtaa dii", spanish: "abuelo materno bueno" },
    question: { thai: "มีตาไหม", es: "mii dtaa mǎi", spanish: "¿Hay abuelo materno?" },
    answer: { thai: "มีตา", es: "mii dtaa", spanish: "Sí, hay abuelo materno" }
  },
  {
    rank: 637, thai: "หู", es: "hǔu", spanish: "oreja", english: "ear", rtgs: "", cefr: null, freq: 637, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หูดี", es: "hǔu dii", spanish: "oreja bueno" },
    question: { thai: "มีหูไหม", es: "mii hǔu mǎi", spanish: "¿Hay oreja?" },
    answer: { thai: "มีหู", es: "mii hǔu", spanish: "Sí, hay oreja" }
  },
  {
    rank: 638, thai: "จมูก", es: "jà-mùuk", spanish: "nariz", english: "nose", rtgs: "", cefr: null, freq: 638, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จมูกดี", es: "jà-mùuk dii", spanish: "nariz bueno" },
    question: { thai: "มีจมูกไหม", es: "mii jà-mùuk mǎi", spanish: "¿Hay nariz?" },
    answer: { thai: "มีจมูก", es: "mii jà-mùuk", spanish: "Sí, hay nariz" }
  },
  {
    rank: 639, thai: "ปาก", es: "bpàak", spanish: "boca", english: "mouth", rtgs: "", cefr: null, freq: 639, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ปากดี", es: "bpàak dii", spanish: "boca bueno" },
    question: { thai: "มีปากไหม", es: "mii bpàak mǎi", spanish: "¿Hay boca?" },
    answer: { thai: "มีปาก", es: "mii bpàak", spanish: "Sí, hay boca" }
  },
  {
    rank: 640, thai: "ฟัน", es: "fan", spanish: "diente", english: "tooth", rtgs: "", cefr: null, freq: 640, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ฟันดี", es: "fan dii", spanish: "diente bueno" },
    question: { thai: "มีฟันไหม", es: "mii fan mǎi", spanish: "¿Hay diente?" },
    answer: { thai: "มีฟัน", es: "mii fan", spanish: "Sí, hay diente" }
  },
  {
    rank: 641, thai: "ลิ้น", es: "lín", spanish: "lengua", english: "tongue", rtgs: "", cefr: null, freq: 641, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ลิ้นดี", es: "lín dii", spanish: "lengua bueno" },
    question: { thai: "มีลิ้นไหม", es: "mii lín mǎi", spanish: "¿Hay lengua?" },
    answer: { thai: "มีลิ้น", es: "mii lín", spanish: "Sí, hay lengua" }
  },
  {
    rank: 642, thai: "คอ", es: "koo", spanish: "cuello", english: "neck", rtgs: "", cefr: null, freq: 642, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คอดี", es: "koo dii", spanish: "cuello bueno" },
    question: { thai: "มีคอไหม", es: "mii koo mǎi", spanish: "¿Hay cuello?" },
    answer: { thai: "มีคอ", es: "mii koo", spanish: "Sí, hay cuello" }
  },
  {
    rank: 643, thai: "มือ", es: "mǔue", spanish: "mano", english: "hand", rtgs: "", cefr: null, freq: 643, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "มือดี", es: "mǔue dii", spanish: "mano bueno" },
    question: { thai: "มีมือไหม", es: "mii mǔue mǎi", spanish: "¿Hay mano?" },
    answer: { thai: "มีมือ", es: "mii mǔue", spanish: "Sí, hay mano" }
  },
  {
    rank: 644, thai: "แขน", es: "khǎen", spanish: "brazo", english: "arm", rtgs: "", cefr: null, freq: 644, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "แขนดี", es: "khǎen dii", spanish: "brazo bueno" },
    question: { thai: "มีแขนไหม", es: "mii khǎen mǎi", spanish: "¿Hay brazo?" },
    answer: { thai: "มีแขน", es: "mii khǎen", spanish: "Sí, hay brazo" }
  },
  {
    rank: 645, thai: "นิ้ว", es: "níao", spanish: "dedo", english: "finger", rtgs: "", cefr: null, freq: 645, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "นิ้วดี", es: "níao dii", spanish: "dedo bueno" },
    question: { thai: "มีนิ้วไหม", es: "mii níao mǎi", spanish: "¿Hay dedo?" },
    answer: { thai: "มีนิ้ว", es: "mii níao", spanish: "Sí, hay dedo" }
  },
  {
    rank: 646, thai: "ขา", es: "khǎa", spanish: "pierna", english: "leg", rtgs: "", cefr: null, freq: 646, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ขาดี", es: "khǎa dii", spanish: "pierna bueno" },
    question: { thai: "มีขาไหม", es: "mii khǎa mǎi", spanish: "¿Hay pierna?" },
    answer: { thai: "มีขา", es: "mii khǎa", spanish: "Sí, hay pierna" }
  },
  {
    rank: 647, thai: "เท้า", es: "tháo", spanish: "pie", english: "foot", rtgs: "", cefr: null, freq: 647, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เท้าดี", es: "tháo dii", spanish: "pie bueno" },
    question: { thai: "มีเท้าไหม", es: "mii tháo mǎi", spanish: "¿Hay pie?" },
    answer: { thai: "มีเท้า", es: "mii tháo", spanish: "Sí, hay pie" }
  },
  {
    rank: 648, thai: "หัวใจ", es: "hǔua-jai", spanish: "corazón", english: "heart", rtgs: "", cefr: null, freq: 648, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หัวใจดี", es: "hǔua-jai dii", spanish: "corazón bueno" },
    question: { thai: "มีหัวใจไหม", es: "mii hǔua-jai mǎi", spanish: "¿Hay corazón?" },
    answer: { thai: "มีหัวใจ", es: "mii hǔua-jai", spanish: "Sí, hay corazón" }
  },
  {
    rank: 649, thai: "ปอด", es: "bpòt", spanish: "pulmón", english: "lung", rtgs: "", cefr: null, freq: 649, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ปอดดี", es: "bpòt dii", spanish: "pulmón bueno" },
    question: { thai: "มีปอดไหม", es: "mii bpòt mǎi", spanish: "¿Hay pulmón?" },
    answer: { thai: "มีปอด", es: "mii bpòt", spanish: "Sí, hay pulmón" }
  },
  {
    rank: 650, thai: "ท้อง", es: "tóng", spanish: "estómago/barriga", english: "stomach", rtgs: "", cefr: null, freq: 650, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ท้องดี", es: "tóng dii", spanish: "estómago/barriga bueno" },
    question: { thai: "มีท้องไหม", es: "mii tóng mǎi", spanish: "¿Hay estómago/barriga?" },
    answer: { thai: "มีท้อง", es: "mii tóng", spanish: "Sí, hay estómago/barriga" }
  },
  {
    rank: 651, thai: "สมอง", es: "sà-mǒong", spanish: "cerebro", english: "brain", rtgs: "", cefr: null, freq: 651, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "สมองดี", es: "sà-mǒong dii", spanish: "cerebro bueno" },
    question: { thai: "มีสมองไหม", es: "mii sà-mǒong mǎi", spanish: "¿Hay cerebro?" },
    answer: { thai: "มีสมอง", es: "mii sà-mǒong", spanish: "Sí, hay cerebro" }
  },
  {
    rank: 652, thai: "ใจ", es: "jai", spanish: "corazón/mente", english: "heart", rtgs: "", cefr: null, freq: 652, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ใจดี", es: "jai dii", spanish: "corazón/mente bueno" },
    question: { thai: "มีใจไหม", es: "mii jai mǎi", spanish: "¿Hay corazón/mente?" },
    answer: { thai: "มีใจ", es: "mii jai", spanish: "Sí, hay corazón/mente" }
  },
  {
    rank: 653, thai: "ร่างกาย", es: "râang-gaai", spanish: "cuerpo", english: "body", rtgs: "", cefr: null, freq: 653, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ร่างกายดี", es: "râang-gaai dii", spanish: "cuerpo bueno" },
    question: { thai: "มีร่างกายไหม", es: "mii râang-gaai mǎi", spanish: "¿Hay cuerpo?" },
    answer: { thai: "มีร่างกาย", es: "mii râang-gaai", spanish: "Sí, hay cuerpo" }
  },
  {
    rank: 654, thai: "แพทย์", es: "phâai", spanish: "médico", english: "doctor", rtgs: "", cefr: null, freq: 654, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "แพทย์ดี", es: "phâai dii", spanish: "médico bueno" },
    question: { thai: "มีแพทย์ไหม", es: "mii phâai mǎi", spanish: "¿Hay médico?" },
    answer: { thai: "มีแพทย์", es: "mii phâai", spanish: "Sí, hay médico" }
  },
  {
    rank: 655, thai: "พยาบาล", es: "pha-yaa-baan", spanish: "enfermera", english: "nurse", rtgs: "", cefr: null, freq: 655, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "พยาบาลดี", es: "pha-yaa-baan dii", spanish: "enfermera bueno" },
    question: { thai: "มีพยาบาลไหม", es: "mii pha-yaa-baan mǎi", spanish: "¿Hay enfermera?" },
    answer: { thai: "มีพยาบาล", es: "mii pha-yaa-baan", spanish: "Sí, hay enfermera" }
  },
  {
    rank: 656, thai: "คนไข้", es: "khon-khâi", spanish: "paciente", english: "patient", rtgs: "", cefr: null, freq: 656, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คนไข้ดี", es: "khon-khâi dii", spanish: "paciente bueno" },
    question: { thai: "มีคนไข้ไหม", es: "mii khon-khâi mǎi", spanish: "¿Hay paciente?" },
    answer: { thai: "มีคนไข้", es: "mii khon-khâi", spanish: "Sí, hay paciente" }
  },
  {
    rank: 657, thai: "โรค", es: "rôok", spanish: "enfermedad", english: "disease", rtgs: "", cefr: null, freq: 657, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "โรคดี", es: "rôok dii", spanish: "enfermedad bueno" },
    question: { thai: "มีโรคไหม", es: "mii rôok mǎi", spanish: "¿Hay enfermedad?" },
    answer: { thai: "มีโรค", es: "mii rôok", spanish: "Sí, hay enfermedad" }
  },
  {
    rank: 658, thai: "ยา", es: "yaa", spanish: "medicina", english: "medicine", rtgs: "", cefr: null, freq: 658, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ยาดี", es: "yaa dii", spanish: "medicina bueno" },
    question: { thai: "มียาไหม", es: "mii yaa mǎi", spanish: "¿Hay medicina?" },
    answer: { thai: "มียา", es: "mii yaa", spanish: "Sí, hay medicina" }
  },
  {
    rank: 659, thai: "โรงพยาบาล", es: "roong-pha-yaa-baan", spanish: "hospital", english: "hospital", rtgs: "", cefr: null, freq: 659, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "โรงพยาบาลดี", es: "roong-pha-yaa-baan dii", spanish: "hospital bueno" },
    question: { thai: "มีโรงพยาบาลไหม", es: "mii roong-pha-yaa-baan mǎi", spanish: "¿Hay hospital?" },
    answer: { thai: "มีโรงพยาบาล", es: "mii roong-pha-yaa-baan", spanish: "Sí, hay hospital" }
  },
  {
    rank: 660, thai: "ร้าน", es: "ráan", spanish: "tienda", english: "shop", rtgs: "", cefr: null, freq: 660, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ร้านดี", es: "ráan dii", spanish: "tienda bueno" },
    question: { thai: "มีร้านไหม", es: "mii ráan mǎi", spanish: "¿Hay tienda?" },
    answer: { thai: "มีร้าน", es: "mii ráan", spanish: "Sí, hay tienda" }
  },
  {
    rank: 661, thai: "ตลาด", es: "dtà-làat", spanish: "mercado", english: "market", rtgs: "", cefr: null, freq: 661, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ตลาดดี", es: "dtà-làat dii", spanish: "mercado bueno" },
    question: { thai: "มีตลาดไหม", es: "mii dtà-làat mǎi", spanish: "¿Hay mercado?" },
    answer: { thai: "มีตลาด", es: "mii dtà-làat", spanish: "Sí, hay mercado" }
  },
  {
    rank: 662, thai: "ธนาคาร", es: "thá-naa-khaan", spanish: "banco", english: "bank", rtgs: "", cefr: null, freq: 662, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ธนาคารดี", es: "thá-naa-khaan dii", spanish: "banco bueno" },
    question: { thai: "มีธนาคารไหม", es: "mii thá-naa-khaan mǎi", spanish: "¿Hay banco?" },
    answer: { thai: "มีธนาคาร", es: "mii thá-naa-khaan", spanish: "Sí, hay banco" }
  },
  {
    rank: 663, thai: "โรงเรียน", es: "roong-riian", spanish: "escuela", english: "school", rtgs: "", cefr: null, freq: 663, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "โรงเรียนดี", es: "roong-riian dii", spanish: "escuela bueno" },
    question: { thai: "มีโรงเรียนไหม", es: "mii roong-riian mǎi", spanish: "¿Hay escuela?" },
    answer: { thai: "มีโรงเรียน", es: "mii roong-riian", spanish: "Sí, hay escuela" }
  },
  {
    rank: 664, thai: "มหาวิทยาลัย", es: "má-hǎa-wít-tha-yaa-lai", spanish: "universidad", english: "university", rtgs: "", cefr: null, freq: 664, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "มหาวิทยาลัยดี", es: "má-hǎa-wít-tha-yaa-lai dii", spanish: "universidad bueno" },
    question: { thai: "มีมหาวิทยาลัยไหม", es: "mii má-hǎa-wít-tha-yaa-lai mǎi", spanish: "¿Hay universidad?" },
    answer: { thai: "มีมหาวิทยาลัย", es: "mii má-hǎa-wít-tha-yaa-lai", spanish: "Sí, hay universidad" }
  },
  {
    rank: 665, thai: "วัด", es: "wát", spanish: "templo", english: "temple", rtgs: "", cefr: null, freq: 665, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "วัดดี", es: "wát dii", spanish: "templo bueno" },
    question: { thai: "มีวัดไหม", es: "mii wát mǎi", spanish: "¿Hay templo?" },
    answer: { thai: "มีวัด", es: "mii wát", spanish: "Sí, hay templo" }
  },
  {
    rank: 666, thai: "โบสถ์", es: "boo-sòt", spanish: "iglesia", english: "church", rtgs: "", cefr: null, freq: 666, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "โบสถ์ดี", es: "boo-sòt dii", spanish: "iglesia bueno" },
    question: { thai: "มีโบสถ์ไหม", es: "mii boo-sòt mǎi", spanish: "¿Hay iglesia?" },
    answer: { thai: "มีโบสถ์", es: "mii boo-sòt", spanish: "Sí, hay iglesia" }
  },
  {
    rank: 667, thai: "สนามบิน", es: "sà-nǎam-bin", spanish: "aeropuerto", english: "airport", rtgs: "", cefr: null, freq: 667, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "สนามบินดี", es: "sà-nǎam-bin dii", spanish: "aeropuerto bueno" },
    question: { thai: "มีสนามบินไหม", es: "mii sà-nǎam-bin mǎi", spanish: "¿Hay aeropuerto?" },
    answer: { thai: "มีสนามบิน", es: "mii sà-nǎam-bin", spanish: "Sí, hay aeropuerto" }
  },
  {
    rank: 668, thai: "สถานี", es: "sà-thǎa-nii", spanish: "estación", english: "station", rtgs: "", cefr: null, freq: 668, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "สถานีดี", es: "sà-thǎa-nii dii", spanish: "estación bueno" },
    question: { thai: "มีสถานีไหม", es: "mii sà-thǎa-nii mǎi", spanish: "¿Hay estación?" },
    answer: { thai: "มีสถานี", es: "mii sà-thǎa-nii", spanish: "Sí, hay estación" }
  },
  {
    rank: 669, thai: "รถไฟ", es: "rót-fai", spanish: "tren", english: "train", rtgs: "", cefr: null, freq: 669, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รถไฟดี", es: "rót-fai dii", spanish: "tren bueno" },
    question: { thai: "มีรถไฟไหม", es: "mii rót-fai mǎi", spanish: "¿Hay tren?" },
    answer: { thai: "มีรถไฟ", es: "mii rót-fai", spanish: "Sí, hay tren" }
  },
  {
    rank: 670, thai: "รถเมล์", es: "rót-mee", spanish: "autobús", english: "bus", rtgs: "", cefr: null, freq: 670, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รถเมล์ดี", es: "rót-mee dii", spanish: "autobús bueno" },
    question: { thai: "มีรถเมล์ไหม", es: "mii rót-mee mǎi", spanish: "¿Hay autobús?" },
    answer: { thai: "มีรถเมล์", es: "mii rót-mee", spanish: "Sí, hay autobús" }
  },
  {
    rank: 671, thai: "รถแท็กซี่", es: "rót-thaék-sîi", spanish: "taxi", english: "taxi", rtgs: "", cefr: null, freq: 671, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รถแท็กซี่ดี", es: "rót-thaék-sîi dii", spanish: "taxi bueno" },
    question: { thai: "มีรถแท็กซี่ไหม", es: "mii rót-thaék-sîi mǎi", spanish: "¿Hay taxi?" },
    answer: { thai: "มีรถแท็กซี่", es: "mii rót-thaék-sîi", spanish: "Sí, hay taxi" }
  },
  {
    rank: 672, thai: "รถยนต์", es: "rót-yon", spanish: "coche", english: "car", rtgs: "", cefr: null, freq: 672, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "รถยนต์ดี", es: "rót-yon dii", spanish: "coche bueno" },
    question: { thai: "มีรถยนต์ไหม", es: "mii rót-yon mǎi", spanish: "¿Hay coche?" },
    answer: { thai: "มีรถยนต์", es: "mii rót-yon", spanish: "Sí, hay coche" }
  },
  {
    rank: 673, thai: "จักรยาน", es: "jàk-kra-yaan", spanish: "bicicleta", english: "bicycle", rtgs: "", cefr: null, freq: 673, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จักรยานดี", es: "jàk-kra-yaan dii", spanish: "bicicleta bueno" },
    question: { thai: "มีจักรยานไหม", es: "mii jàk-kra-yaan mǎi", spanish: "¿Hay bicicleta?" },
    answer: { thai: "มีจักรยาน", es: "mii jàk-kra-yaan", spanish: "Sí, hay bicicleta" }
  },
  {
    rank: 674, thai: "เครื่องบิน", es: "krûeang-bin", spanish: "avión", english: "airplane", rtgs: "", cefr: null, freq: 674, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เครื่องบินดี", es: "krûeang-bin dii", spanish: "avión bueno" },
    question: { thai: "มีเครื่องบินไหม", es: "mii krûeang-bin mǎi", spanish: "¿Hay avión?" },
    answer: { thai: "มีเครื่องบิน", es: "mii krûeang-bin", spanish: "Sí, hay avión" }
  },
  {
    rank: 675, thai: "ถนน", es: "thà-nǒn", spanish: "calle", english: "road", rtgs: "", cefr: null, freq: 675, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ถนนดี", es: "thà-nǒn dii", spanish: "calle bueno" },
    question: { thai: "มีถนนไหม", es: "mii thà-nǒn mǎi", spanish: "¿Hay calle?" },
    answer: { thai: "มีถนน", es: "mii thà-nǒn", spanish: "Sí, hay calle" }
  },
  {
    rank: 676, thai: "สะพาน", es: "sà-phaan", spanish: "puente", english: "bridge", rtgs: "", cefr: null, freq: 676, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "สะพานดี", es: "sà-phaan dii", spanish: "puente bueno" },
    question: { thai: "มีสะพานไหม", es: "mii sà-phaan mǎi", spanish: "¿Hay puente?" },
    answer: { thai: "มีสะพาน", es: "mii sà-phaan", spanish: "Sí, hay puente" }
  },
  {
    rank: 677, thai: "อาคาร", es: "aa-khǎan", spanish: "edificio", english: "building", rtgs: "", cefr: null, freq: 677, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาคารดี", es: "aa-khǎan dii", spanish: "edificio bueno" },
    question: { thai: "มีอาคารไหม", es: "mii aa-khǎan mǎi", spanish: "¿Hay edificio?" },
    answer: { thai: "มีอาคาร", es: "mii aa-khǎan", spanish: "Sí, hay edificio" }
  },
  {
    rank: 678, thai: "บันได", es: "ban-dai", spanish: "escalera", english: "stairs", rtgs: "", cefr: null, freq: 678, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "บันไดดี", es: "ban-dai dii", spanish: "escalera bueno" },
    question: { thai: "มีบันไดไหม", es: "mii ban-dai mǎi", spanish: "¿Hay escalera?" },
    answer: { thai: "มีบันได", es: "mii ban-dai", spanish: "Sí, hay escalera" }
  },
  {
    rank: 679, thai: "ลิฟต์", es: "líf", spanish: "ascensor", english: "elevator", rtgs: "", cefr: null, freq: 679, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ลิฟต์ดี", es: "líf dii", spanish: "ascensor bueno" },
    question: { thai: "มีลิฟต์ไหม", es: "mii líf mǎi", spanish: "¿Hay ascensor?" },
    answer: { thai: "มีลิฟต์", es: "mii líf", spanish: "Sí, hay ascensor" }
  },
  {
    rank: 680, thai: "ห้อง", es: "hȃng", spanish: "habitación", english: "room", rtgs: "", cefr: null, freq: 680, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ห้องดี", es: "hȃng dii", spanish: "habitación bueno" },
    question: { thai: "มีห้องไหม", es: "mii hȃng mǎi", spanish: "¿Hay habitación?" },
    answer: { thai: "มีห้อง", es: "mii hȃng", spanish: "Sí, hay habitación" }
  },
  {
    rank: 681, thai: "ประตู", es: "bprà-dtuu", spanish: "puerta", english: "door", rtgs: "", cefr: null, freq: 681, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ประตูดี", es: "bprà-dtuu dii", spanish: "puerta bueno" },
    question: { thai: "มีประตูไหม", es: "mii bprà-dtuu mǎi", spanish: "¿Hay puerta?" },
    answer: { thai: "มีประตู", es: "mii bprà-dtuu", spanish: "Sí, hay puerta" }
  },
  {
    rank: 682, thai: "หน้าต่าง", es: "nâa-dtǎang", spanish: "ventana", english: "window", rtgs: "", cefr: null, freq: 682, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "หน้าต่างดี", es: "nâa-dtǎang dii", spanish: "ventana bueno" },
    question: { thai: "มีหน้าต่างไหม", es: "mii nâa-dtǎang mǎi", spanish: "¿Hay ventana?" },
    answer: { thai: "มีหน้าต่าง", es: "mii nâa-dtǎang", spanish: "Sí, hay ventana" }
  },
  {
    rank: 683, thai: "กุญแจ", es: "gun-jaae", spanish: "llave", english: "key", rtgs: "", cefr: null, freq: 683, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "กุญแจดี", es: "gun-jaae dii", spanish: "llave bueno" },
    question: { thai: "มีกุญแจไหม", es: "mii gun-jaae mǎi", spanish: "¿Hay llave?" },
    answer: { thai: "มีกุญแจ", es: "mii gun-jaae", spanish: "Sí, hay llave" }
  },
  {
    rank: 684, thai: "โต๊ะ", es: "tó", spanish: "mesa", english: "table", rtgs: "", cefr: null, freq: 684, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "โต๊ะดี", es: "tó dii", spanish: "mesa bueno" },
    question: { thai: "มีโต๊ะไหม", es: "mii tó mǎi", spanish: "¿Hay mesa?" },
    answer: { thai: "มีโต๊ะ", es: "mii tó", spanish: "Sí, hay mesa" }
  },
  {
    rank: 685, thai: "เก้าอี้", es: "gâo-îi", spanish: "silla", english: "chair", rtgs: "", cefr: null, freq: 685, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "เก้าอี้ดี", es: "gâo-îi dii", spanish: "silla bueno" },
    question: { thai: "มีเก้าอี้ไหม", es: "mii gâo-îi mǎi", spanish: "¿Hay silla?" },
    answer: { thai: "มีเก้าอี้", es: "mii gâo-îi", spanish: "Sí, hay silla" }
  },
  {
    rank: 686, thai: "เตียง", es: "tiia", spanish: "cama", english: "bed", rtgs: "", cefr: null, freq: 686, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เตียงดี", es: "tiia dii", spanish: "cama bueno" },
    question: { thai: "มีเตียงไหม", es: "mii tiia mǎi", spanish: "¿Hay cama?" },
    answer: { thai: "มีเตียง", es: "mii tiia", spanish: "Sí, hay cama" }
  },
  {
    rank: 687, thai: "ตู้", es: "dtóo", spanish: "armario", english: "cabinet", rtgs: "", cefr: null, freq: 687, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ตู้ดี", es: "dtóo dii", spanish: "armario bueno" },
    question: { thai: "มีตู้ไหม", es: "mii dtóo mǎi", spanish: "¿Hay armario?" },
    answer: { thai: "มีตู้", es: "mii dtóo", spanish: "Sí, hay armario" }
  },
  {
    rank: 688, thai: "หลอดไฟ", es: "lǎwt-fai", spanish: "bombilla", english: "light bulb", rtgs: "", cefr: null, freq: 688, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "หลอดไฟดี", es: "lǎwt-fai dii", spanish: "bombilla bueno" },
    question: { thai: "มีหลอดไฟไหม", es: "mii lǎwt-fai mǎi", spanish: "¿Hay bombilla?" },
    answer: { thai: "มีหลอดไฟ", es: "mii lǎwt-fai", spanish: "Sí, hay bombilla" }
  },
  {
    rank: 689, thai: "ไฟ", es: "fai", spanish: "luz/fuego", english: "light/fire", rtgs: "", cefr: null, freq: 689, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ไฟดี", es: "fai dii", spanish: "luz/fuego bueno" },
    question: { thai: "มีไฟไหม", es: "mii fai mǎi", spanish: "¿Hay luz/fuego?" },
    answer: { thai: "มีไฟ", es: "mii fai", spanish: "Sí, hay luz/fuego" }
  },
  {
    rank: 690, thai: "ควัน", es: "khwan", spanish: "humo", english: "smoke", rtgs: "", cefr: null, freq: 690, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ควันดี", es: "khwan dii", spanish: "humo bueno" },
    question: { thai: "มีควันไหม", es: "mii khwan mǎi", spanish: "¿Hay humo?" },
    answer: { thai: "มีควัน", es: "mii khwan", spanish: "Sí, hay humo" }
  },
  {
    rank: 691, thai: "เปลวไฟ", es: "plòe-fai", spanish: "llama", english: "flame", rtgs: "", cefr: null, freq: 691, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เปลวไฟดี", es: "plòe-fai dii", spanish: "llama bueno" },
    question: { thai: "มีเปลวไฟไหม", es: "mii plòe-fai mǎi", spanish: "¿Hay llama?" },
    answer: { thai: "มีเปลวไฟ", es: "mii plòe-fai", spanish: "Sí, hay llama" }
  },
  {
    rank: 692, thai: "ขี้เถ้า", es: "khîi-thâo", spanish: "ceniza", english: "ash", rtgs: "", cefr: null, freq: 692, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ขี้เถ้าดี", es: "khîi-thâo dii", spanish: "ceniza bueno" },
    question: { thai: "มีขี้เถ้าไหม", es: "mii khîi-thâo mǎi", spanish: "¿Hay ceniza?" },
    answer: { thai: "มีขี้เถ้า", es: "mii khîi-thâo", spanish: "Sí, hay ceniza" }
  },
  {
    rank: 693, thai: "น้ำแข็ง", es: "nám-khǎeng", spanish: "hielo", english: "ice", rtgs: "", cefr: null, freq: 693, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "น้ำแข็งดี", es: "nám-khǎeng dii", spanish: "hielo bueno" },
    question: { thai: "มีน้ำแข็งไหม", es: "mii nám-khǎeng mǎi", spanish: "¿Hay hielo?" },
    answer: { thai: "มีน้ำแข็ง", es: "mii nám-khǎeng", spanish: "Sí, hay hielo" }
  },
  {
    rank: 694, thai: "หิมะ", es: "hì-má", spanish: "nieve", english: "snow", rtgs: "", cefr: null, freq: 694, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "หิมะดี", es: "hì-má dii", spanish: "nieve bueno" },
    question: { thai: "มีหิมะไหม", es: "mii hì-má mǎi", spanish: "¿Hay nieve?" },
    answer: { thai: "มีหิมะ", es: "mii hì-má", spanish: "Sí, hay nieve" }
  },
  {
    rank: 695, thai: "ฝน", es: "fǒn", spanish: "lluvia", english: "rain", rtgs: "", cefr: null, freq: 695, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ฝนดี", es: "fǒn dii", spanish: "lluvia bueno" },
    question: { thai: "มีฝนไหม", es: "mii fǒn mǎi", spanish: "¿Hay lluvia?" },
    answer: { thai: "มีฝน", es: "mii fǒn", spanish: "Sí, hay lluvia" }
  },
  {
    rank: 696, thai: "ลม", es: "lom", spanish: "viento", english: "wind", rtgs: "", cefr: null, freq: 696, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ลมดี", es: "lom dii", spanish: "viento bueno" },
    question: { thai: "มีลมไหม", es: "mii lom mǎi", spanish: "¿Hay viento?" },
    answer: { thai: "มีลม", es: "mii lom", spanish: "Sí, hay viento" }
  },
  {
    rank: 697, thai: "เมฆ", es: "mêek", spanish: "nube", english: "cloud", rtgs: "", cefr: null, freq: 697, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เมฆดี", es: "mêek dii", spanish: "nube bueno" },
    question: { thai: "มีเมฆไหม", es: "mii mêek mǎi", spanish: "¿Hay nube?" },
    answer: { thai: "มีเมฆ", es: "mii mêek", spanish: "Sí, hay nube" }
  },
  {
    rank: 698, thai: "ท้องฟ้า", es: "tóng-fáa", spanish: "cielo", english: "sky", rtgs: "", cefr: null, freq: 698, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ท้องฟ้าดี", es: "tóng-fáa dii", spanish: "cielo bueno" },
    question: { thai: "มีท้องฟ้าไหม", es: "mii tóng-fáa mǎi", spanish: "¿Hay cielo?" },
    answer: { thai: "มีท้องฟ้า", es: "mii tóng-fáa", spanish: "Sí, hay cielo" }
  },
  {
    rank: 699, thai: "ดวงอาทิตย์", es: "duang-aa-thít", spanish: "sol", english: "sun", rtgs: "", cefr: null, freq: 699, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ดวงอาทิตย์ดี", es: "duang-aa-thít dii", spanish: "sol bueno" },
    question: { thai: "มีดวงอาทิตย์ไหม", es: "mii duang-aa-thít mǎi", spanish: "¿Hay sol?" },
    answer: { thai: "มีดวงอาทิตย์", es: "mii duang-aa-thít", spanish: "Sí, hay sol" }
  },
  {
    rank: 700, thai: "ดวงจันทร์", es: "duang-jan", spanish: "luna", english: "moon", rtgs: "", cefr: null, freq: 700, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ดวงจันทร์ดี", es: "duang-jan dii", spanish: "luna bueno" },
    question: { thai: "มีดวงจันทร์ไหม", es: "mii duang-jan mǎi", spanish: "¿Hay luna?" },
    answer: { thai: "มีดวงจันทร์", es: "mii duang-jan", spanish: "Sí, hay luna" }
  },
  {
    rank: 701, thai: "ดาว", es: "daao", spanish: "estrella", english: "star", rtgs: "", cefr: null, freq: 701, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ดาวดี", es: "daao dii", spanish: "estrella bueno" },
    question: { thai: "มีดาวไหม", es: "mii daao mǎi", spanish: "¿Hay estrella?" },
    answer: { thai: "มีดาว", es: "mii daao", spanish: "Sí, hay estrella" }
  },
  {
    rank: 702, thai: "โลก", es: "lôok", spanish: "mundo", english: "world", rtgs: "", cefr: null, freq: 702, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "โลกดี", es: "lôok dii", spanish: "mundo bueno" },
    question: { thai: "มีโลกไหม", es: "mii lôok mǎi", spanish: "¿Hay mundo?" },
    answer: { thai: "มีโลก", es: "mii lôok", spanish: "Sí, hay mundo" }
  },
  {
    rank: 703, thai: "ป่า", es: "bpàa", spanish: "bosque", english: "forest", rtgs: "", cefr: null, freq: 703, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ป่าดี", es: "bpàa dii", spanish: "bosque bueno" },
    question: { thai: "มีป่าไหม", es: "mii bpàa mǎi", spanish: "¿Hay bosque?" },
    answer: { thai: "มีป่า", es: "mii bpàa", spanish: "Sí, hay bosque" }
  },
  {
    rank: 704, thai: "ภูเขา", es: "phuu-khǎo", spanish: "montaña", english: "mountain", rtgs: "", cefr: null, freq: 704, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ภูเขาดี", es: "phuu-khǎo dii", spanish: "montaña bueno" },
    question: { thai: "มีภูเขาไหม", es: "mii phuu-khǎo mǎi", spanish: "¿Hay montaña?" },
    answer: { thai: "มีภูเขา", es: "mii phuu-khǎo", spanish: "Sí, hay montaña" }
  },
  {
    rank: 705, thai: "เนินเขา", es: "nəoin-khǎo", spanish: "colina", english: "hill", rtgs: "", cefr: null, freq: 705, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เนินเขาดี", es: "nəoin-khǎo dii", spanish: "colina bueno" },
    question: { thai: "มีเนินเขาไหม", es: "mii nəoin-khǎo mǎi", spanish: "¿Hay colina?" },
    answer: { thai: "มีเนินเขา", es: "mii nəoin-khǎo", spanish: "Sí, hay colina" }
  },
  {
    rank: 706, thai: "หุบเขา", es: "hùp-khǎo", spanish: "valle", english: "valley", rtgs: "", cefr: null, freq: 706, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "หุบเขาดี", es: "hùp-khǎo dii", spanish: "valle bueno" },
    question: { thai: "มีหุบเขาไหม", es: "mii hùp-khǎo mǎi", spanish: "¿Hay valle?" },
    answer: { thai: "มีหุบเขา", es: "mii hùp-khǎo", spanish: "Sí, hay valle" }
  },
  {
    rank: 707, thai: "แม่น้ำ", es: "mâae-nám", spanish: "río", english: "river", rtgs: "", cefr: null, freq: 707, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "แม่น้ำดี", es: "mâae-nám dii", spanish: "río bueno" },
    question: { thai: "มีแม่น้ำไหม", es: "mii mâae-nám mǎi", spanish: "¿Hay río?" },
    answer: { thai: "มีแม่น้ำ", es: "mii mâae-nám", spanish: "Sí, hay río" }
  },
  {
    rank: 708, thai: "ทะเล", es: "thá-lee", spanish: "mar", english: "sea", rtgs: "", cefr: null, freq: 708, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทะเลดี", es: "thá-lee dii", spanish: "mar bueno" },
    question: { thai: "มีทะเลไหม", es: "mii thá-lee mǎi", spanish: "¿Hay mar?" },
    answer: { thai: "มีทะเล", es: "mii thá-lee", spanish: "Sí, hay mar" }
  },
  {
    rank: 709, thai: "ชายหาด", es: "chaai-hàat", spanish: "playa", english: "beach", rtgs: "", cefr: null, freq: 709, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ชายหาดดี", es: "chaai-hàat dii", spanish: "playa bueno" },
    question: { thai: "มีชายหาดไหม", es: "mii chaai-hàat mǎi", spanish: "¿Hay playa?" },
    answer: { thai: "มีชายหาด", es: "mii chaai-hàat", spanish: "Sí, hay playa" }
  },
  {
    rank: 710, thai: "เกาะ", es: "gàw", spanish: "isla", english: "island", rtgs: "", cefr: null, freq: 710, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เกาะดี", es: "gàw dii", spanish: "isla bueno" },
    question: { thai: "มีเกาะไหม", es: "mii gàw mǎi", spanish: "¿Hay isla?" },
    answer: { thai: "มีเกาะ", es: "mii gàw", spanish: "Sí, hay isla" }
  },
  {
    rank: 711, thai: "ปลา", es: "plaa", spanish: "pez", english: "fish", rtgs: "", cefr: null, freq: 711, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปลาดี", es: "plaa dii", spanish: "pez bueno" },
    question: { thai: "มีปลาไหม", es: "mii plaa mǎi", spanish: "¿Hay pez?" },
    answer: { thai: "มีปลา", es: "mii plaa", spanish: "Sí, hay pez" }
  },
  {
    rank: 712, thai: "นก", es: "nók", spanish: "pájaro", english: "bird", rtgs: "", cefr: null, freq: 712, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "นกดี", es: "nók dii", spanish: "pájaro bueno" },
    question: { thai: "มีนกไหม", es: "mii nók mǎi", spanish: "¿Hay pájaro?" },
    answer: { thai: "มีนก", es: "mii nók", spanish: "Sí, hay pájaro" }
  },
  {
    rank: 713, thai: "สัตว์", es: "sàt", spanish: "animal", english: "animal", rtgs: "", cefr: null, freq: 713, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สัตว์ดี", es: "sàt dii", spanish: "animal bueno" },
    question: { thai: "มีสัตว์ไหม", es: "mii sàt mǎi", spanish: "¿Hay animal?" },
    answer: { thai: "มีสัตว์", es: "mii sàt", spanish: "Sí, hay animal" }
  },
  {
    rank: 714, thai: "หมา", es: "mǎa", spanish: "perro", english: "dog", rtgs: "", cefr: null, freq: 714, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หมาดี", es: "mǎa dii", spanish: "perro bueno" },
    question: { thai: "มีหมาไหม", es: "mii mǎa mǎi", spanish: "¿Hay perro?" },
    answer: { thai: "มีหมา", es: "mii mǎa", spanish: "Sí, hay perro" }
  },
  {
    rank: 715, thai: "แมว", es: "maeo", spanish: "gato", english: "cat", rtgs: "", cefr: null, freq: 715, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แมวดี", es: "maeo dii", spanish: "gato bueno" },
    question: { thai: "มีแมวไหม", es: "mii maeo mǎi", spanish: "¿Hay gato?" },
    answer: { thai: "มีแมว", es: "mii maeo", spanish: "Sí, hay gato" }
  },
  {
    rank: 716, thai: "หนู", es: "nǔu", spanish: "ratón/rata", english: "mouse/rat", rtgs: "", cefr: null, freq: 716, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "หนูดี", es: "nǔu dii", spanish: "ratón/rata bueno" },
    question: { thai: "มีหนูไหม", es: "mii nǔu mǎi", spanish: "¿Hay ratón/rata?" },
    answer: { thai: "มีหนู", es: "mii nǔu", spanish: "Sí, hay ratón/rata" }
  },
  {
    rank: 717, thai: "วัว", es: "wuua", spanish: "vaca", english: "cow", rtgs: "", cefr: null, freq: 717, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วัวดี", es: "wuua dii", spanish: "vaca bueno" },
    question: { thai: "มีวัวไหม", es: "mii wuua mǎi", spanish: "¿Hay vaca?" },
    answer: { thai: "มีวัว", es: "mii wuua", spanish: "Sí, hay vaca" }
  },
  {
    rank: 718, thai: "ควาย", es: "khwaai", spanish: "búfalo", english: "buffalo", rtgs: "", cefr: null, freq: 718, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ควายดี", es: "khwaai dii", spanish: "búfalo bueno" },
    question: { thai: "มีควายไหม", es: "mii khwaai mǎi", spanish: "¿Hay búfalo?" },
    answer: { thai: "มีควาย", es: "mii khwaai", spanish: "Sí, hay búfalo" }
  },
  {
    rank: 719, thai: "ม้า", es: "mâa", spanish: "caballo", english: "horse", rtgs: "", cefr: null, freq: 719, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ม้าดี", es: "mâa dii", spanish: "caballo bueno" },
    question: { thai: "มีม้าไหม", es: "mii mâa mǎi", spanish: "¿Hay caballo?" },
    answer: { thai: "มีม้า", es: "mii mâa", spanish: "Sí, hay caballo" }
  },
  {
    rank: 720, thai: "ช้าง", es: "cháang", spanish: "elefante", english: "elephant", rtgs: "", cefr: null, freq: 720, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ช้างดี", es: "cháang dii", spanish: "elefante bueno" },
    question: { thai: "มีช้างไหม", es: "mii cháang mǎi", spanish: "¿Hay elefante?" },
    answer: { thai: "มีช้าง", es: "mii cháang", spanish: "Sí, hay elefante" }
  },
  {
    rank: 721, thai: "สิงโต", es: "sǐng-toon", spanish: "león", english: "lion", rtgs: "", cefr: null, freq: 721, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สิงโตดี", es: "sǐng-toon dii", spanish: "león bueno" },
    question: { thai: "มีสิงโตไหม", es: "mii sǐng-toon mǎi", spanish: "¿Hay león?" },
    answer: { thai: "มีสิงโต", es: "mii sǐng-toon", spanish: "Sí, hay león" }
  },
  {
    rank: 722, thai: "เสือ", es: "sǔea", spanish: "tigre", english: "tiger", rtgs: "", cefr: null, freq: 722, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เสือดี", es: "sǔea dii", spanish: "tigre bueno" },
    question: { thai: "มีเสือไหม", es: "mii sǔea mǎi", spanish: "¿Hay tigre?" },
    answer: { thai: "มีเสือ", es: "mii sǔea", spanish: "Sí, hay tigre" }
  },
  {
    rank: 723, thai: "ลิง", es: "ling", spanish: "mono", english: "monkey", rtgs: "", cefr: null, freq: 723, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ลิงดี", es: "ling dii", spanish: "mono bueno" },
    question: { thai: "มีลิงไหม", es: "mii ling mǎi", spanish: "¿Hay mono?" },
    answer: { thai: "มีลิง", es: "mii ling", spanish: "Sí, hay mono" }
  },
  {
    rank: 724, thai: "งู", es: "nguu", spanish: "serpiente", english: "snake", rtgs: "", cefr: null, freq: 724, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "งูดี", es: "nguu dii", spanish: "serpiente bueno" },
    question: { thai: "มีงูไหม", es: "mii nguu mǎi", spanish: "¿Hay serpiente?" },
    answer: { thai: "มีงู", es: "mii nguu", spanish: "Sí, hay serpiente" }
  },
  {
    rank: 725, thai: "ตุ๊กแก", es: "dtúk-gaae", spanish: "gecko", english: "gecko", rtgs: "", cefr: null, freq: 725, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ตุ๊กแกดี", es: "dtúk-gaae dii", spanish: "gecko bueno" },
    question: { thai: "มีตุ๊กแกไหม", es: "mii dtúk-gaae mǎi", spanish: "¿Hay gecko?" },
    answer: { thai: "มีตุ๊กแก", es: "mii dtúk-gaae", spanish: "Sí, hay gecko" }
  },
  {
    rank: 726, thai: "จิ้งจก", es: "jíng-jòk", spanish: "lagartija", english: "house gecko", rtgs: "", cefr: null, freq: 726, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "จิ้งจกดี", es: "jíng-jòk dii", spanish: "lagartija bueno" },
    question: { thai: "มีจิ้งจกไหม", es: "mii jíng-jòk mǎi", spanish: "¿Hay lagartija?" },
    answer: { thai: "มีจิ้งจก", es: "mii jíng-jòk", spanish: "Sí, hay lagartija" }
  },
  {
    rank: 727, thai: "ผีเสื้อ", es: "phǐi-sǔea", spanish: "mariposa", english: "butterfly", rtgs: "", cefr: null, freq: 727, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ผีเสื้อดี", es: "phǐi-sǔea dii", spanish: "mariposa bueno" },
    question: { thai: "มีผีเสื้อไหม", es: "mii phǐi-sǔea mǎi", spanish: "¿Hay mariposa?" },
    answer: { thai: "มีผีเสื้อ", es: "mii phǐi-sǔea", spanish: "Sí, hay mariposa" }
  },
  {
    rank: 728, thai: "มด", es: "mót", spanish: "hormiga", english: "ant", rtgs: "", cefr: null, freq: 728, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "มดดี", es: "mót dii", spanish: "hormiga bueno" },
    question: { thai: "มีมดไหม", es: "mii mót mǎi", spanish: "¿Hay hormiga?" },
    answer: { thai: "มีมด", es: "mii mót", spanish: "Sí, hay hormiga" }
  },
  {
    rank: 729, thai: "แมลงวัน", es: "mlaeng-wan", spanish: "mosca", english: "fly", rtgs: "", cefr: null, freq: 729, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แมลงวันดี", es: "mlaeng-wan dii", spanish: "mosca bueno" },
    question: { thai: "มีแมลงวันไหม", es: "mii mlaeng-wan mǎi", spanish: "¿Hay mosca?" },
    answer: { thai: "มีแมลงวัน", es: "mii mlaeng-wan", spanish: "Sí, hay mosca" }
  },
  {
    rank: 730, thai: "แมลงสาบ", es: "mlaeng-sàap", spanish: "cucaracha", english: "cockroach", rtgs: "", cefr: null, freq: 730, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แมลงสาบดี", es: "mlaeng-sàap dii", spanish: "cucaracha bueno" },
    question: { thai: "มีแมลงสาบไหม", es: "mii mlaeng-sàap mǎi", spanish: "¿Hay cucaracha?" },
    answer: { thai: "มีแมลงสาบ", es: "mii mlaeng-sàap", spanish: "Sí, hay cucaracha" }
  },
  {
    rank: 731, thai: "ยุง", es: "yung", spanish: "mosquito", english: "mosquito", rtgs: "", cefr: null, freq: 731, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ยุงดี", es: "yung dii", spanish: "mosquito bueno" },
    question: { thai: "มียุงไหม", es: "mii yung mǎi", spanish: "¿Hay mosquito?" },
    answer: { thai: "มียุง", es: "mii yung", spanish: "Sí, hay mosquito" }
  },
  {
    rank: 732, thai: "ต้นไม้", es: "dtôn-máai", spanish: "árbol", english: "tree", rtgs: "", cefr: null, freq: 732, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ต้นไม้ดี", es: "dtôn-máai dii", spanish: "árbol bueno" },
    question: { thai: "มีต้นไม้ไหม", es: "mii dtôn-máai mǎi", spanish: "¿Hay árbol?" },
    answer: { thai: "มีต้นไม้", es: "mii dtôn-máai", spanish: "Sí, hay árbol" }
  },
  {
    rank: 733, thai: "ใบไม้", es: "bai-máai", spanish: "hoja", english: "leaf", rtgs: "", cefr: null, freq: 733, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ใบไม้ดี", es: "bai-máai dii", spanish: "hoja bueno" },
    question: { thai: "มีใบไม้ไหม", es: "mii bai-máai mǎi", spanish: "¿Hay hoja?" },
    answer: { thai: "มีใบไม้", es: "mii bai-máai", spanish: "Sí, hay hoja" }
  },
  {
    rank: 734, thai: "ราก", es: "râak", spanish: "raíz", english: "root", rtgs: "", cefr: null, freq: 734, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "รากดี", es: "râak dii", spanish: "raíz bueno" },
    question: { thai: "มีรากไหม", es: "mii râak mǎi", spanish: "¿Hay raíz?" },
    answer: { thai: "มีราก", es: "mii râak", spanish: "Sí, hay raíz" }
  },
  {
    rank: 735, thai: "ดอกไม้", es: "dòk-máai", spanish: "flor", english: "flower", rtgs: "", cefr: null, freq: 735, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ดอกไม้ดี", es: "dòk-máai dii", spanish: "flor bueno" },
    question: { thai: "มีดอกไม้ไหม", es: "mii dòk-máai mǎi", spanish: "¿Hay flor?" },
    answer: { thai: "มีดอกไม้", es: "mii dòk-máai", spanish: "Sí, hay flor" }
  },
  {
    rank: 736, thai: "หญ้า", es: "yâa", spanish: "hierba", english: "grass", rtgs: "", cefr: null, freq: 736, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "หญ้าดี", es: "yâa dii", spanish: "hierba bueno" },
    question: { thai: "มีหญ้าไหม", es: "mii yâa mǎi", spanish: "¿Hay hierba?" },
    answer: { thai: "มีหญ้า", es: "mii yâa", spanish: "Sí, hay hierba" }
  },
  {
    rank: 737, thai: "ผลไม้", es: "pǒn-máai", spanish: "fruta", english: "fruit", rtgs: "", cefr: null, freq: 737, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ผลไม้ดี", es: "pǒn-máai dii", spanish: "fruta bueno" },
    question: { thai: "มีผลไม้ไหม", es: "mii pǒn-máai mǎi", spanish: "¿Hay fruta?" },
    answer: { thai: "มีผลไม้", es: "mii pǒn-máai", spanish: "Sí, hay fruta" }
  },
  {
    rank: 738, thai: "มะม่วง", es: "má-mûang", spanish: "mango", english: "mango", rtgs: "", cefr: null, freq: 738, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "มะม่วงดี", es: "má-mûang dii", spanish: "mango bueno" },
    question: { thai: "มีมะม่วงไหม", es: "mii má-mûang mǎi", spanish: "¿Hay mango?" },
    answer: { thai: "มีมะม่วง", es: "mii má-mûang", spanish: "Sí, hay mango" }
  },
  {
    rank: 739, thai: "กล้วย", es: "glûaai", spanish: "plátano", english: "banana", rtgs: "", cefr: null, freq: 739, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "กล้วยดี", es: "glûaai dii", spanish: "plátano bueno" },
    question: { thai: "มีกล้วยไหม", es: "mii glûaai mǎi", spanish: "¿Hay plátano?" },
    answer: { thai: "มีกล้วย", es: "mii glûaai", spanish: "Sí, hay plátano" }
  },
  {
    rank: 740, thai: "ส้ม", es: "sôm", spanish: "naranja", english: "orange", rtgs: "", cefr: null, freq: 740, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ส้มดี", es: "sôm dii", spanish: "naranja bueno" },
    question: { thai: "มีส้มไหม", es: "mii sôm mǎi", spanish: "¿Hay naranja?" },
    answer: { thai: "มีส้ม", es: "mii sôm", spanish: "Sí, hay naranja" }
  },
  {
    rank: 741, thai: "แตงโม", es: "dtæng-moo", spanish: "sandía", english: "watermelon", rtgs: "", cefr: null, freq: 741, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แตงโมดี", es: "dtæng-moo dii", spanish: "sandía bueno" },
    question: { thai: "มีแตงโมไหม", es: "mii dtæng-moo mǎi", spanish: "¿Hay sandía?" },
    answer: { thai: "มีแตงโม", es: "mii dtæng-moo", spanish: "Sí, hay sandía" }
  },
  {
    rank: 742, thai: "สับปะรด", es: "sàp-bpà-ròt", spanish: "piña", english: "pineapple", rtgs: "", cefr: null, freq: 742, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "สับปะรดดี", es: "sàp-bpà-ròt dii", spanish: "piña bueno" },
    question: { thai: "มีสับปะรดไหม", es: "mii sàp-bpà-ròt mǎi", spanish: "¿Hay piña?" },
    answer: { thai: "มีสับปะรด", es: "mii sàp-bpà-ròt", spanish: "Sí, hay piña" }
  },
  {
    rank: 743, thai: "ทุเรียน", es: "thú-riian", spanish: "durian", english: "durian", rtgs: "", cefr: null, freq: 743, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทุเรียนดี", es: "thú-riian dii", spanish: "durian bueno" },
    question: { thai: "มีทุเรียนไหม", es: "mii thú-riian mǎi", spanish: "¿Hay durian?" },
    answer: { thai: "มีทุเรียน", es: "mii thú-riian", spanish: "Sí, hay durian" }
  },
  {
    rank: 744, thai: "ขนุน", es: "khà-nún", spanish: "jackfruit", english: "jackfruit", rtgs: "", cefr: null, freq: 744, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ขนุนดี", es: "khà-nún dii", spanish: "jackfruit bueno" },
    question: { thai: "มีขนุนไหม", es: "mii khà-nún mǎi", spanish: "¿Hay jackfruit?" },
    answer: { thai: "มีขนุน", es: "mii khà-nún", spanish: "Sí, hay jackfruit" }
  },
  {
    rank: 745, thai: "ลำไย", es: "lam-yai", spanish: "longan", english: "longan", rtgs: "", cefr: null, freq: 745, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ลำไยดี", es: "lam-yai dii", spanish: "longan bueno" },
    question: { thai: "มีลำไยไหม", es: "mii lam-yai mǎi", spanish: "¿Hay longan?" },
    answer: { thai: "มีลำไย", es: "mii lam-yai", spanish: "Sí, hay longan" }
  },
  {
    rank: 746, thai: "เงาะ", es: "ngɔ́-rá", spanish: "rambután", english: "rambutan", rtgs: "", cefr: null, freq: 746, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "เงาะดี", es: "ngɔ́-rá dii", spanish: "rambután bueno" },
    question: { thai: "มีเงาะไหม", es: "mii ngɔ́-rá mǎi", spanish: "¿Hay rambután?" },
    answer: { thai: "มีเงาะ", es: "mii ngɔ́-rá", spanish: "Sí, hay rambután" }
  },
  {
    rank: 747, thai: "มังคุด", es: "mang-kùt", spanish: "mangostán", english: "mangosteen", rtgs: "", cefr: null, freq: 747, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "มังคุดดี", es: "mang-kùt dii", spanish: "mangostán bueno" },
    question: { thai: "มีมังคุดไหม", es: "mii mang-kùt mǎi", spanish: "¿Hay mangostán?" },
    answer: { thai: "มีมังคุด", es: "mii mang-kùt", spanish: "Sí, hay mangostán" }
  },
  {
    rank: 748, thai: "ข้าวเหนียว", es: "kâao-nǐao", spanish: "arroz glutinoso", english: "sticky rice", rtgs: "", cefr: null, freq: 748, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้าวเหนียวดี", es: "kâao-nǐao dii", spanish: "arroz glutinoso bueno" },
    question: { thai: "มีข้าวเหนียวไหม", es: "mii kâao-nǐao mǎi", spanish: "¿Hay arroz glutinoso?" },
    answer: { thai: "มีข้าวเหนียว", es: "mii kâao-nǐao", spanish: "Sí, hay arroz glutinoso" }
  },
  {
    rank: 749, thai: "ข้าวสวย", es: "kâao-sǔuai", spanish: "arroz cocido", english: "cooked rice", rtgs: "", cefr: null, freq: 749, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ข้าวสวยดี", es: "kâao-sǔuai dii", spanish: "arroz cocido bueno" },
    question: { thai: "มีข้าวสวยไหม", es: "mii kâao-sǔuai mǎi", spanish: "¿Hay arroz cocido?" },
    answer: { thai: "มีข้าวสวย", es: "mii kâao-sǔuai", spanish: "Sí, hay arroz cocido" }
  },
  {
    rank: 750, thai: "ก๋วยเตี๋ยว", es: "gǔai-dtiǎo", spanish: "fideos", english: "noodles", rtgs: "", cefr: null, freq: 750, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ก๋วยเตี๋ยวดี", es: "gǔai-dtiǎo dii", spanish: "fideos bueno" },
    question: { thai: "มีก๋วยเตี๋ยวไหม", es: "mii gǔai-dtiǎo mǎi", spanish: "¿Hay fideos?" },
    answer: { thai: "มีก๋วยเตี๋ยว", es: "mii gǔai-dtiǎo", spanish: "Sí, hay fideos" }
  },
  {
    rank: 751, thai: "ผัด", es: "phàt", spanish: "salteado", english: "stir-fried", rtgs: "", cefr: null, freq: 751, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ผัดดี", es: "phàt dii", spanish: "salteado bueno" },
    question: { thai: "มีผัดไหม", es: "mii phàt mǎi", spanish: "¿Hay salteado?" },
    answer: { thai: "มีผัด", es: "mii phàt", spanish: "Sí, hay salteado" }
  },
  {
    rank: 752, thai: "ต้ม", es: "dtôm", spanish: "hervido", english: "boiled", rtgs: "", cefr: null, freq: 752, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ต้มดี", es: "dtôm dii", spanish: "hervido bueno" },
    question: { thai: "มีต้มไหม", es: "mii dtôm mǎi", spanish: "¿Hay hervido?" },
    answer: { thai: "มีต้ม", es: "mii dtôm", spanish: "Sí, hay hervido" }
  },
  {
    rank: 753, thai: "ปิ้ง", es: "bpîng", spanish: "asado", english: "grilled", rtgs: "", cefr: null, freq: 753, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ปิ้งดี", es: "bpîng dii", spanish: "asado bueno" },
    question: { thai: "มีปิ้งไหม", es: "mii bpîng mǎi", spanish: "¿Hay asado?" },
    answer: { thai: "มีปิ้ง", es: "mii bpîng", spanish: "Sí, hay asado" }
  },
  {
    rank: 754, thai: "ทอด", es: "thâwt", spanish: "frito", english: "fried", rtgs: "", cefr: null, freq: 754, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ทอดดี", es: "thâwt dii", spanish: "frito bueno" },
    question: { thai: "มีทอดไหม", es: "mii thâwt mǎi", spanish: "¿Hay frito?" },
    answer: { thai: "มีทอด", es: "mii thâwt", spanish: "Sí, hay frito" }
  },
  {
    rank: 755, thai: "นึ่ง", es: "nêung", spanish: "al vapor", english: "steamed", rtgs: "", cefr: null, freq: 755, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "นึ่งดี", es: "nêung dii", spanish: "al vapor bueno" },
    question: { thai: "มีนึ่งไหม", es: "mii nêung mǎi", spanish: "¿Hay al vapor?" },
    answer: { thai: "มีนึ่ง", es: "mii nêung", spanish: "Sí, hay al vapor" }
  },
  {
    rank: 756, thai: "เผา", es: "phǎo", spanish: "asado al fuego", english: "roasted", rtgs: "", cefr: null, freq: 756, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เผาดี", es: "phǎo dii", spanish: "asado al fuego bueno" },
    question: { thai: "มีเผาไหม", es: "mii phǎo mǎi", spanish: "¿Hay asado al fuego?" },
    answer: { thai: "มีเผา", es: "mii phǎo", spanish: "Sí, hay asado al fuego" }
  },
  {
    rank: 757, thai: "เผ็ด", es: "phèt", spanish: "picante", english: "spicy", rtgs: "", cefr: null, freq: 757, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เผ็ดมาก", es: "phèt mâak", spanish: "Muy picante" },
    question: { thai: "เผ็ดไหม", es: "phèt mǎi", spanish: "¿picante?" },
    answer: { thai: "เผ็ด", es: "phèt", spanish: "picante" }
  },
  {
    rank: 758, thai: "หวาน", es: "wǎan", spanish: "dulce", english: "sweet", rtgs: "", cefr: null, freq: 758, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "หวานมาก", es: "wǎan mâak", spanish: "Muy dulce" },
    question: { thai: "หวานไหม", es: "wǎan mǎi", spanish: "¿dulce?" },
    answer: { thai: "หวาน", es: "wǎan", spanish: "dulce" }
  },
  {
    rank: 759, thai: "เปรี้ยว", es: "bprìao", spanish: "ácido", english: "sour", rtgs: "", cefr: null, freq: 759, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "เปรี้ยวมาก", es: "bprìao mâak", spanish: "Muy ácido" },
    question: { thai: "เปรี้ยวไหม", es: "bprìao mǎi", spanish: "¿ácido?" },
    answer: { thai: "เปรี้ยว", es: "bprìao", spanish: "ácido" }
  },
  {
    rank: 760, thai: "เค็ม", es: "khem", spanish: "salado", english: "salty", rtgs: "", cefr: null, freq: 760, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "เค็มมาก", es: "khem mâak", spanish: "Muy salado" },
    question: { thai: "เค็มไหม", es: "khem mǎi", spanish: "¿salado?" },
    answer: { thai: "เค็ม", es: "khem", spanish: "salado" }
  },
  {
    rank: 761, thai: "ขม", es: "khǒm", spanish: "amargo", english: "bitter", rtgs: "", cefr: null, freq: 761, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "ขมมาก", es: "khǒm mâak", spanish: "Muy amargo" },
    question: { thai: "ขมไหม", es: "khǒm mǎi", spanish: "¿amargo?" },
    answer: { thai: "ขม", es: "khǒm", spanish: "amargo" }
  },
  {
    rank: 762, thai: "นุ่ม", es: "nùm", spanish: "suave", english: "soft", rtgs: "", cefr: null, freq: 762, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "นุ่มมาก", es: "nùm mâak", spanish: "Muy suave" },
    question: { thai: "นุ่มไหม", es: "nùm mǎi", spanish: "¿suave?" },
    answer: { thai: "นุ่ม", es: "nùm", spanish: "suave" }
  },
  {
    rank: 763, thai: "แข็ง", es: "khǎeng", spanish: "duro", english: "hard", rtgs: "", cefr: null, freq: 763, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "แข็งมาก", es: "khǎeng mâak", spanish: "Muy duro" },
    question: { thai: "แข็งไหม", es: "khǎeng mǎi", spanish: "¿duro?" },
    answer: { thai: "แข็ง", es: "khǎeng", spanish: "duro" }
  },
  {
    rank: 764, thai: "ว่าง", es: "wâang", spanish: "vacío/libre", english: "empty/free", rtgs: "", cefr: null, freq: 764, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ว่างมาก", es: "wâang mâak", spanish: "Muy vacío/libre" },
    question: { thai: "ว่างไหม", es: "wâang mǎi", spanish: "¿vacío/libre?" },
    answer: { thai: "ว่าง", es: "wâang", spanish: "vacío/libre" }
  },
  {
    rank: 765, thai: "เร็ว", es: "reo", spanish: "rápido", english: "fast", rtgs: "", cefr: null, freq: 765, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "เดินเร็ว", es: "dooen reo", spanish: "caminar rápido, en: "walk fast" },
    question: { thai: "เร็วไหม", es: "reo mǎi", spanish: "¿rápido?" },
    answer: { thai: "เร็ว", es: "reo", spanish: "rápido" }
  },
  {
    rank: 766, thai: "ช้า", es: "cháa", spanish: "despacio", english: "slowly", rtgs: "", cefr: null, freq: 766, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "พูดช้า", es: "phûut cháa", spanish: "hablar despacio, en: "speak slowly" },
    question: { thai: "ช้าไหม", es: "cháa mǎi", spanish: "¿despacio?" },
    answer: { thai: "ช้า", es: "cháa", spanish: "despacio" }
  },
  {
    rank: 767, thai: "ใหม่", es: "màai", spanish: "nuevo", english: "new", rtgs: "", cefr: null, freq: 767, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ใหม่มาก", es: "màai mâak", spanish: "Muy nuevo" },
    question: { thai: "ใหม่ไหม", es: "màai mǎi", spanish: "¿nuevo?" },
    answer: { thai: "ใหม่", es: "màai", spanish: "nuevo" }
  },
  {
    rank: 768, thai: "ดี", es: "dii", spanish: "bueno", english: "good", rtgs: "", cefr: null, freq: 768, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ดีมาก", es: "dii mâak", spanish: "Muy bueno" },
    question: { thai: "ดีไหม", es: "dii mǎi", spanish: "¿bueno?" },
    answer: { thai: "ดี", es: "dii", spanish: "bueno" }
  },
  {
    rank: 769, thai: "เลว", es: "liiao", spanish: "malo/bajo", english: "bad/low", rtgs: "", cefr: null, freq: 769, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "เลวมาก", es: "liiao mâak", spanish: "Muy malo/bajo" },
    question: { thai: "เลวไหม", es: "liiao mǎi", spanish: "¿malo/bajo?" },
    answer: { thai: "เลว", es: "liiao", spanish: "malo/bajo" }
  },
  {
    rank: 770, thai: "สวย", es: "sǔai", spanish: "hermoso", english: "beautiful", rtgs: "", cefr: null, freq: 770, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "สวยมาก", es: "sǔai mâak", spanish: "Muy hermoso" },
    question: { thai: "สวยไหม", es: "sǔai mǎi", spanish: "¿hermoso?" },
    answer: { thai: "สวย", es: "sǔai", spanish: "hermoso" }
  },
  {
    rank: 771, thai: "ขี้ระคาญ", es: "khîi-rá-khaan", spanish: "feo", english: "ugly", rtgs: "", cefr: null, freq: 771, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ขี้ระคาญมาก", es: "khîi-rá-khaan mâak", spanish: "Muy feo" },
    question: { thai: "ขี้ระคาญไหม", es: "khîi-rá-khaan mǎi", spanish: "¿feo?" },
    answer: { thai: "ขี้ระคาญ", es: "khîi-rá-khaan", spanish: "feo" }
  },
  {
    rank: 772, thai: "ใหญ่", es: "yài", spanish: "grande", english: "big", rtgs: "", cefr: null, freq: 772, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ใหญ่มาก", es: "yài mâak", spanish: "Muy grande" },
    question: { thai: "ใหญ่ไหม", es: "yài mǎi", spanish: "¿grande?" },
    answer: { thai: "ใหญ่", es: "yài", spanish: "grande" }
  },
  {
    rank: 773, thai: "เล็ก", es: "lék", spanish: "pequeño", english: "small", rtgs: "", cefr: null, freq: 773, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "เล็กมาก", es: "lék mâak", spanish: "Muy pequeño" },
    question: { thai: "เล็กไหม", es: "lék mǎi", spanish: "¿pequeño?" },
    answer: { thai: "เล็ก", es: "lék", spanish: "pequeño" }
  },
  {
    rank: 774, thai: "สูง", es: "sǔung", spanish: "alto", english: "tall/high", rtgs: "", cefr: null, freq: 774, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "สูงมาก", es: "sǔung mâak", spanish: "Muy alto" },
    question: { thai: "สูงไหม", es: "sǔung mǎi", spanish: "¿alto?" },
    answer: { thai: "สูง", es: "sǔung", spanish: "alto" }
  },
  {
    rank: 775, thai: "ต่ำ", es: "dtàm", spanish: "bajo", english: "low", rtgs: "", cefr: null, freq: 775, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ต่ำมาก", es: "dtàm mâak", spanish: "Muy bajo" },
    question: { thai: "ต่ำไหม", es: "dtàm mǎi", spanish: "¿bajo?" },
    answer: { thai: "ต่ำ", es: "dtàm", spanish: "bajo" }
  },
  {
    rank: 776, thai: "ยาว", es: "yao", spanish: "largo", english: "long", rtgs: "", cefr: null, freq: 776, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ยาวมาก", es: "yao mâak", spanish: "Muy largo" },
    question: { thai: "ยาวไหม", es: "yao mǎi", spanish: "¿largo?" },
    answer: { thai: "ยาว", es: "yao", spanish: "largo" }
  },
  {
    rank: 777, thai: "สั้น", es: "sân", spanish: "corto", english: "short", rtgs: "", cefr: null, freq: 777, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "สั้นมาก", es: "sân mâak", spanish: "Muy corto" },
    question: { thai: "สั้นไหม", es: "sân mǎi", spanish: "¿corto?" },
    answer: { thai: "สั้น", es: "sân", spanish: "corto" }
  },
  {
    rank: 778, thai: "หนา", es: "nǎa", spanish: "grueso", english: "thick", rtgs: "", cefr: null, freq: 778, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "หนามาก", es: "nǎa mâak", spanish: "Muy grueso" },
    question: { thai: "หนาไหม", es: "nǎa mǎi", spanish: "¿grueso?" },
    answer: { thai: "หนา", es: "nǎa", spanish: "grueso" }
  },
  {
    rank: 779, thai: "ลึก", es: "lúek", spanish: "profundo", english: "deep", rtgs: "", cefr: null, freq: 779, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ลึกมาก", es: "lúek mâak", spanish: "Muy profundo" },
    question: { thai: "ลึกไหม", es: "lúek mǎi", spanish: "¿profundo?" },
    answer: { thai: "ลึก", es: "lúek", spanish: "profundo" }
  },
  {
    rank: 780, thai: "ตื้น", es: "dtêuan", spanish: "poco profundo", english: "shallow", rtgs: "", cefr: null, freq: 780, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ตื้นมาก", es: "dtêuan mâak", spanish: "Muy poco profundo" },
    question: { thai: "ตื้นไหม", es: "dtêuan mǎi", spanish: "¿poco profundo?" },
    answer: { thai: "ตื้น", es: "dtêuan", spanish: "poco profundo" }
  },
  {
    rank: 781, thai: "หนัก", es: "nàk", spanish: "pesado", english: "heavy", rtgs: "", cefr: null, freq: 781, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "หนักมาก", es: "nàk mâak", spanish: "Muy pesado" },
    question: { thai: "หนักไหม", es: "nàk mǎi", spanish: "¿pesado?" },
    answer: { thai: "หนัก", es: "nàk", spanish: "pesado" }
  },
  {
    rank: 782, thai: "เบา", es: "bao", spanish: "ligero", english: "light", rtgs: "", cefr: null, freq: 782, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "เบามาก", es: "bao mâak", spanish: "Muy ligero" },
    question: { thai: "เบาไหม", es: "bao mǎi", spanish: "¿ligero?" },
    answer: { thai: "เบา", es: "bao", spanish: "ligero" }
  },
  {
    rank: 783, thai: "ร้อน", es: "ráwn", spanish: "caliente", english: "hot", rtgs: "", cefr: null, freq: 783, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ร้อนมาก", es: "ráwn mâak", spanish: "Muy caliente" },
    question: { thai: "ร้อนไหม", es: "ráwn mǎi", spanish: "¿caliente?" },
    answer: { thai: "ร้อน", es: "ráwn", spanish: "caliente" }
  },
  {
    rank: 784, thai: "เย็น", es: "yen", spanish: "atardecer", english: "evening", rtgs: "", cefr: null, freq: 784, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เย็นดี", es: "yen dii", spanish: "atardecer bueno" },
    question: { thai: "มีเย็นไหม", es: "mii yen mǎi", spanish: "¿Hay atardecer?" },
    answer: { thai: "มีเย็น", es: "mii yen", spanish: "Sí, hay atardecer" }
  },
  {
    rank: 785, thai: "อุ่น", es: "ùn", spanish: "tibio", english: "warm", rtgs: "", cefr: null, freq: 785, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "อุ่นมาก", es: "ùn mâak", spanish: "Muy tibio" },
    question: { thai: "อุ่นไหม", es: "ùn mǎi", spanish: "¿tibio?" },
    answer: { thai: "อุ่น", es: "ùn", spanish: "tibio" }
  },
  {
    rank: 786, thai: "แห้ง", es: "hǎae", spanish: "seco", english: "dry", rtgs: "", cefr: null, freq: 786, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "แห้งมาก", es: "hǎae mâak", spanish: "Muy seco" },
    question: { thai: "แห้งไหม", es: "hǎae mǎi", spanish: "¿seco?" },
    answer: { thai: "แห้ง", es: "hǎae", spanish: "seco" }
  },
  {
    rank: 787, thai: "เปียก", es: "bpìiak", spanish: "mojado", english: "wet", rtgs: "", cefr: null, freq: 787, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เปียกมาก", es: "bpìiak mâak", spanish: "Muy mojado" },
    question: { thai: "เปียกไหม", es: "bpìiak mǎi", spanish: "¿mojado?" },
    answer: { thai: "เปียก", es: "bpìiak", spanish: "mojado" }
  },
  {
    rank: 788, thai: "สะอาด", es: "sà-àat", spanish: "limpio", english: "clean", rtgs: "", cefr: null, freq: 788, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "สะอาดมาก", es: "sà-àat mâak", spanish: "Muy limpio" },
    question: { thai: "สะอาดไหม", es: "sà-àat mǎi", spanish: "¿limpio?" },
    answer: { thai: "สะอาด", es: "sà-àat", spanish: "limpio" }
  },
  {
    rank: 789, thai: "สกปรก", es: "sàk-kpròk", spanish: "sucio", english: "dirty", rtgs: "", cefr: null, freq: 789, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "สกปรกมาก", es: "sàk-kpròk mâak", spanish: "Muy sucio" },
    question: { thai: "สกปรกไหม", es: "sàk-kpròk mǎi", spanish: "¿sucio?" },
    answer: { thai: "สกปรก", es: "sàk-kpròk", spanish: "sucio" }
  },
  {
    rank: 790, thai: "แข็งแรง", es: "khǎeng-raaeng", spanish: "fuerte", english: "strong", rtgs: "", cefr: null, freq: 790, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "แข็งแรงมาก", es: "khǎeng-raaeng mâak", spanish: "Muy fuerte" },
    question: { thai: "แข็งแรงไหม", es: "khǎeng-raaeng mǎi", spanish: "¿fuerte?" },
    answer: { thai: "แข็งแรง", es: "khǎeng-raaeng", spanish: "fuerte" }
  },
  {
    rank: 791, thai: "อ่อนแอ", es: "àwn-aae", spanish: "débil", english: "weak", rtgs: "", cefr: null, freq: 791, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "อ่อนแอมาก", es: "àwn-aae mâak", spanish: "Muy débil" },
    question: { thai: "อ่อนแอไหม", es: "àwn-aae mǎi", spanish: "¿débil?" },
    answer: { thai: "อ่อนแอ", es: "àwn-aae", spanish: "débil" }
  },
  {
    rank: 792, thai: "ฉลาด", es: "chà-làat", spanish: "inteligente", english: "smart", rtgs: "", cefr: null, freq: 792, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ฉลาดมาก", es: "chà-làat mâak", spanish: "Muy inteligente" },
    question: { thai: "ฉลาดไหม", es: "chà-làat mǎi", spanish: "¿inteligente?" },
    answer: { thai: "ฉลาด", es: "chà-làat", spanish: "inteligente" }
  },
  {
    rank: 793, thai: "โง่", es: "ngôo", spanish: "tonto", english: "stupid", rtgs: "", cefr: null, freq: 793, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "โง่มาก", es: "ngôo mâak", spanish: "Muy tonto" },
    question: { thai: "โง่ไหม", es: "ngôo mǎi", spanish: "¿tonto?" },
    answer: { thai: "โง่", es: "ngôo", spanish: "tonto" }
  },
  {
    rank: 794, thai: "ใจดี", es: "jai-dii", spanish: "amable", english: "kind", rtgs: "", cefr: null, freq: 794, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ใจดีมาก", es: "jai-dii mâak", spanish: "Muy amable" },
    question: { thai: "ใจดีไหม", es: "jai-dii mǎi", spanish: "¿amable?" },
    answer: { thai: "ใจดี", es: "jai-dii", spanish: "amable" }
  },
  {
    rank: 795, thai: "ใจร้าย", es: "jai-ráai", spanish: "cruel", english: "cruel", rtgs: "", cefr: null, freq: 795, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "ใจร้ายมาก", es: "jai-ráai mâak", spanish: "Muy cruel" },
    question: { thai: "ใจร้ายไหม", es: "jai-ráai mǎi", spanish: "¿cruel?" },
    answer: { thai: "ใจร้าย", es: "jai-ráai", spanish: "cruel" }
  },
  {
    rank: 796, thai: "ตลก", es: "dtà-lòk", spanish: "divertido", english: "funny", rtgs: "", cefr: null, freq: 796, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ตลกมาก", es: "dtà-lòk mâak", spanish: "Muy divertido" },
    question: { thai: "ตลกไหม", es: "dtà-lòk mǎi", spanish: "¿divertido?" },
    answer: { thai: "ตลก", es: "dtà-lòk", spanish: "divertido" }
  },
  {
    rank: 797, thai: "ขี้เล่น", es: "khîi-lên", spanish: "juguetón", english: "playful", rtgs: "", cefr: null, freq: 797, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ขี้เล่นมาก", es: "khîi-lên mâak", spanish: "Muy juguetón" },
    question: { thai: "ขี้เล่นไหม", es: "khîi-lên mǎi", spanish: "¿juguetón?" },
    answer: { thai: "ขี้เล่น", es: "khîi-lên", spanish: "juguetón" }
  },
  {
    rank: 798, thai: "ขี้กลัว", es: "khîi-gluua", spanish: "cobarde", english: "cowardly", rtgs: "", cefr: null, freq: 798, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ขี้กลัวมาก", es: "khîi-gluua mâak", spanish: "Muy cobarde" },
    question: { thai: "ขี้กลัวไหม", es: "khîi-gluua mǎi", spanish: "¿cobarde?" },
    answer: { thai: "ขี้กลัว", es: "khîi-gluua", spanish: "cobarde" }
  },
  {
    rank: 799, thai: "กล้า", es: "glâa", spanish: "valiente", english: "brave", rtgs: "", cefr: null, freq: 799, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "กล้ามาก", es: "glâa mâak", spanish: "Muy valiente" },
    question: { thai: "กล้าไหม", es: "glâa mǎi", spanish: "¿valiente?" },
    answer: { thai: "กล้า", es: "glâa", spanish: "valiente" }
  },
  {
    rank: 800, thai: "ขยัน", es: "khà-yan", spanish: "trabajador", english: "diligent", rtgs: "", cefr: null, freq: 800, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ขยันมาก", es: "khà-yan mâak", spanish: "Muy trabajador" },
    question: { thai: "ขยันไหม", es: "khà-yan mǎi", spanish: "¿trabajador?" },
    answer: { thai: "ขยัน", es: "khà-yan", spanish: "trabajador" }
  },
  {
    rank: 801, thai: "ขี้เกียจ", es: "khîi-gìiat", spanish: "perezoso", english: "lazy", rtgs: "", cefr: null, freq: 801, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ขี้เกียจมาก", es: "khîi-gìiat mâak", spanish: "Muy perezoso" },
    question: { thai: "ขี้เกียจไหม", es: "khîi-gìiat mǎi", spanish: "¿perezoso?" },
    answer: { thai: "ขี้เกียจ", es: "khîi-gìiat", spanish: "perezoso" }
  },
  {
    rank: 802, thai: "ซื่อสัตย์", es: "sǔea-sàt", spanish: "honesto", english: "honest", rtgs: "", cefr: null, freq: 802, notes: "",
    category: "adjetivos", tone: "r",
    phrase: { thai: "ซื่อสัตย์มาก", es: "sǔea-sàt mâak", spanish: "Muy honesto" },
    question: { thai: "ซื่อสัตย์ไหม", es: "sǔea-sàt mǎi", spanish: "¿honesto?" },
    answer: { thai: "ซื่อสัตย์", es: "sǔea-sàt", spanish: "honesto" }
  },
  {
    rank: 803, thai: "โกหก", es: "goo-hòk", spanish: "mentiroso", english: "lying", rtgs: "", cefr: null, freq: 803, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "โกหกมาก", es: "goo-hòk mâak", spanish: "Muy mentiroso" },
    question: { thai: "โกหกไหม", es: "goo-hòk mǎi", spanish: "¿mentiroso?" },
    answer: { thai: "โกหก", es: "goo-hòk", spanish: "mentiroso" }
  },
  {
    rank: 804, thai: "รวย", es: "ruai", spanish: "rico", english: "rich", rtgs: "", cefr: null, freq: 804, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "รวยมาก", es: "ruai mâak", spanish: "Muy rico" },
    question: { thai: "รวยไหม", es: "ruai mǎi", spanish: "¿rico?" },
    answer: { thai: "รวย", es: "ruai", spanish: "rico" }
  },
  {
    rank: 805, thai: "จน", es: "jon", spanish: "hasta", english: "until", rtgs: "", cefr: null, freq: 805, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ทำงานจนเช้า", es: "tham ngaan jon cháo", spanish: "trabajar hasta la mañana, en: "work until morning" },
    question: { thai: "จนไหม", es: "jon mǎi", spanish: "¿hasta?" },
    answer: { thai: "จน", es: "jon", spanish: "hasta" }
  },
  {
    rank: 806, thai: "อดทน", es: "àt-thon", spanish: "paciente", english: "patient", rtgs: "", cefr: null, freq: 806, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "อดทนมาก", es: "àt-thon mâak", spanish: "Muy paciente" },
    question: { thai: "อดทนไหม", es: "àt-thon mǎi", spanish: "¿paciente?" },
    answer: { thai: "อดทน", es: "àt-thon", spanish: "paciente" }
  },
  {
    rank: 807, thai: "ละเอียด", es: "lá-ìiat", spanish: "detallado", english: "detailed", rtgs: "", cefr: null, freq: 807, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ละเอียดมาก", es: "lá-ìiat mâak", spanish: "Muy detallado" },
    question: { thai: "ละเอียดไหม", es: "lá-ìiat mǎi", spanish: "¿detallado?" },
    answer: { thai: "ละเอียด", es: "lá-ìiat", spanish: "detallado" }
  },
  {
    rank: 808, thai: "หยาบ", es: "yàap", spanish: "grosero", english: "coarse", rtgs: "", cefr: null, freq: 808, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "หยาบมาก", es: "yàap mâak", spanish: "Muy grosero" },
    question: { thai: "หยาบไหม", es: "yàap mǎi", spanish: "¿grosero?" },
    answer: { thai: "หยาบ", es: "yàap", spanish: "grosero" }
  },
  {
    rank: 809, thai: "เรียบง่าย", es: "rîiap-ngâai", spanish: "sencillo", english: "simple", rtgs: "", cefr: null, freq: 809, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "เรียบง่ายมาก", es: "rîiap-ngâai mâak", spanish: "Muy sencillo" },
    question: { thai: "เรียบง่ายไหม", es: "rîiap-ngâai mǎi", spanish: "¿sencillo?" },
    answer: { thai: "เรียบง่าย", es: "rîiap-ngâai", spanish: "sencillo" }
  },
  {
    rank: 810, thai: "ซับซ้อน", es: "sàp-sâwn", spanish: "complejo", english: "complex", rtgs: "", cefr: null, freq: 810, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ซับซ้อนมาก", es: "sàp-sâwn mâak", spanish: "Muy complejo" },
    question: { thai: "ซับซ้อนไหม", es: "sàp-sâwn mǎi", spanish: "¿complejo?" },
    answer: { thai: "ซับซ้อน", es: "sàp-sâwn", spanish: "complejo" }
  },
  {
    rank: 811, thai: "สำคัญ", es: "sǎm-kham", spanish: "importante", english: "important", rtgs: "", cefr: null, freq: 811, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "สำคัญมาก", es: "sǎm-kham mâak", spanish: "Muy importante" },
    question: { thai: "สำคัญไหม", es: "sǎm-kham mǎi", spanish: "¿importante?" },
    answer: { thai: "สำคัญ", es: "sǎm-kham", spanish: "importante" }
  },
  {
    rank: 812, thai: "จำเป็น", es: "jam-bpen", spanish: "necesario", english: "necessary", rtgs: "", cefr: null, freq: 812, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "จำเป็นมาก", es: "jam-bpen mâak", spanish: "Muy necesario" },
    question: { thai: "จำเป็นไหม", es: "jam-bpen mǎi", spanish: "¿necesario?" },
    answer: { thai: "จำเป็น", es: "jam-bpen", spanish: "necesario" }
  },
  {
    rank: 813, thai: "แน่นอน", es: "nâae-non", spanish: "seguro/cierto", english: "certain", rtgs: "", cefr: null, freq: 813, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "แน่นอนมาก", es: "nâae-non mâak", spanish: "Muy seguro/cierto" },
    question: { thai: "แน่นอนไหม", es: "nâae-non mǎi", spanish: "¿seguro/cierto?" },
    answer: { thai: "แน่นอน", es: "nâae-non", spanish: "seguro/cierto" }
  },
  {
    rank: 814, thai: "เป็นไปได้", es: "bpen-bpai-dâai", spanish: "posible", english: "possible", rtgs: "", cefr: null, freq: 814, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "เป็นไปได้มาก", es: "bpen-bpai-dâai mâak", spanish: "Muy posible" },
    question: { thai: "เป็นไปได้ไหม", es: "bpen-bpai-dâai mǎi", spanish: "¿posible?" },
    answer: { thai: "เป็นไปได้", es: "bpen-bpai-dâai", spanish: "posible" }
  },
  {
    rank: 815, thai: "ถูก", es: "thùuk", spanish: "correcto/barato", english: "right/cheap", rtgs: "", cefr: null, freq: 815, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ถูกมาก", es: "thùuk mâak", spanish: "Muy correcto/barato" },
    question: { thai: "ถูกไหม", es: "thùuk mǎi", spanish: "¿correcto/barato?" },
    answer: { thai: "ถูก", es: "thùuk", spanish: "correcto/barato" }
  },
  {
    rank: 816, thai: "ผิด", es: "phìt", spanish: "equivocado", english: "wrong", rtgs: "", cefr: null, freq: 816, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ผิดมาก", es: "phìt mâak", spanish: "Muy equivocado" },
    question: { thai: "ผิดไหม", es: "phìt mǎi", spanish: "¿equivocado?" },
    answer: { thai: "ผิด", es: "phìt", spanish: "equivocado" }
  },
  {
    rank: 817, thai: "ง่าย", es: "ngâai", spanish: "fácil", english: "easy", rtgs: "", cefr: null, freq: 817, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ง่ายมาก", es: "ngâai mâak", spanish: "Muy fácil" },
    question: { thai: "ง่ายไหม", es: "ngâai mǎi", spanish: "¿fácil?" },
    answer: { thai: "ง่าย", es: "ngâai", spanish: "fácil" }
  },
  {
    rank: 818, thai: "ยาก", es: "yâak", spanish: "difícil", english: "difficult", rtgs: "", cefr: null, freq: 818, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "ยากมาก", es: "yâak mâak", spanish: "Muy difícil" },
    question: { thai: "ยากไหม", es: "yâak mǎi", spanish: "¿difícil?" },
    answer: { thai: "ยาก", es: "yâak", spanish: "difícil" }
  },
  {
    rank: 819, thai: "ปลอดภัย", es: "blòwd-phai", spanish: "seguro", english: "safe", rtgs: "", cefr: null, freq: 819, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ปลอดภัยมาก", es: "blòwd-phai mâak", spanish: "Muy seguro" },
    question: { thai: "ปลอดภัยไหม", es: "blòwd-phai mǎi", spanish: "¿seguro?" },
    answer: { thai: "ปลอดภัย", es: "blòwd-phai", spanish: "seguro" }
  },
  {
    rank: 820, thai: "อันตราย", es: "an-traai", spanish: "peligroso", english: "dangerous", rtgs: "", cefr: null, freq: 820, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "อันตรายมาก", es: "an-traai mâak", spanish: "Muy peligroso" },
    question: { thai: "อันตรายไหม", es: "an-traai mǎi", spanish: "¿peligroso?" },
    answer: { thai: "อันตราย", es: "an-traai", spanish: "peligroso" }
  },
  {
    rank: 821, thai: "แพง", es: "paeng", spanish: "caro", english: "expensive", rtgs: "", cefr: null, freq: 821, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "แพงมาก", es: "paeng mâak", spanish: "Muy caro" },
    question: { thai: "แพงไหม", es: "paeng mǎi", spanish: "¿caro?" },
    answer: { thai: "แพง", es: "paeng", spanish: "caro" }
  },
  {
    rank: 822, thai: "ฟรี", es: "fii", spanish: "gratis", english: "free", rtgs: "", cefr: null, freq: 822, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ฟรีมาก", es: "fii mâak", spanish: "Muy gratis" },
    question: { thai: "ฟรีไหม", es: "fii mǎi", spanish: "¿gratis?" },
    answer: { thai: "ฟรี", es: "fii", spanish: "gratis" }
  },
  {
    rank: 823, thai: "พร้อม", es: "prom", spanish: "listo", english: "ready", rtgs: "", cefr: null, freq: 823, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "พร้อมมาก", es: "prom mâak", spanish: "Muy listo" },
    question: { thai: "พร้อมไหม", es: "prom mǎi", spanish: "¿listo?" },
    answer: { thai: "พร้อม", es: "prom", spanish: "listo" }
  },
  {
    rank: 824, thai: "เหมาะ", es: "mâw", spanish: "adecuado", english: "suitable", rtgs: "", cefr: null, freq: 824, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เหมาะมาก", es: "mâw mâak", spanish: "Muy adecuado" },
    question: { thai: "เหมาะไหม", es: "mâw mǎi", spanish: "¿adecuado?" },
    answer: { thai: "เหมาะ", es: "mâw", spanish: "adecuado" }
  },
  {
    rank: 825, thai: "เหมาะสม", es: "mâw-sǒm", spanish: "apropiado", english: "appropriate", rtgs: "", cefr: null, freq: 825, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เหมาะสมมาก", es: "mâw-sǒm mâak", spanish: "Muy apropiado" },
    question: { thai: "เหมาะสมไหม", es: "mâw-sǒm mǎi", spanish: "¿apropiado?" },
    answer: { thai: "เหมาะสม", es: "mâw-sǒm", spanish: "apropiado" }
  },
  {
    rank: 826, thai: "พอ", es: "poo", spanish: "suficiente", english: "enough", rtgs: "", cefr: null, freq: 826, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "พอมาก", es: "poo mâak", spanish: "Muy suficiente" },
    question: { thai: "พอไหม", es: "poo mǎi", spanish: "¿suficiente?" },
    answer: { thai: "พอ", es: "poo", spanish: "suficiente" }
  },
  {
    rank: 827, thai: "ครบ", es: "króp", spanish: "completo", english: "complete", rtgs: "", cefr: null, freq: 827, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ครบมาก", es: "króp mâak", spanish: "Muy completo" },
    question: { thai: "ครบไหม", es: "króp mǎi", spanish: "¿completo?" },
    answer: { thai: "ครบ", es: "króp", spanish: "completo" }
  },
  {
    rank: 828, thai: "เต็มที่", es: "dtem-thîi", spanish: "al máximo", english: "full", rtgs: "", cefr: null, freq: 828, notes: "",
    category: "adjetivos", tone: "l",
    phrase: { thai: "เต็มที่มาก", es: "dtem-thîi mâak", spanish: "Muy al máximo" },
    question: { thai: "เต็มที่ไหม", es: "dtem-thîi mǎi", spanish: "¿al máximo?" },
    answer: { thai: "เต็มที่", es: "dtem-thîi", spanish: "al máximo" }
  },
  {
    rank: 829, thai: "วัน", es: "wan", spanish: "día", english: "day", rtgs: "", cefr: null, freq: 829, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วันดี", es: "wan dii", spanish: "día bueno" },
    question: { thai: "มีวันไหม", es: "mii wan mǎi", spanish: "¿Hay día?" },
    answer: { thai: "มีวัน", es: "mii wan", spanish: "Sí, hay día" }
  },
  {
    rank: 830, thai: "คืน", es: "kǔuen", spanish: "noche", english: "night", rtgs: "", cefr: null, freq: 830, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คืนดี", es: "kǔuen dii", spanish: "noche bueno" },
    question: { thai: "มีคืนไหม", es: "mii kǔuen mǎi", spanish: "¿Hay noche?" },
    answer: { thai: "มีคืน", es: "mii kǔuen", spanish: "Sí, hay noche" }
  },
  {
    rank: 831, thai: "เช้า", es: "cháo", spanish: "mañana", english: "morning", rtgs: "", cefr: null, freq: 831, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เช้าดี", es: "cháo dii", spanish: "mañana bueno" },
    question: { thai: "มีเช้าไหม", es: "mii cháo mǎi", spanish: "¿Hay mañana?" },
    answer: { thai: "มีเช้า", es: "mii cháo", spanish: "Sí, hay mañana" }
  },
  {
    rank: 832, thai: "สาย", es: "sǎai", spanish: "mediodía/tarde", english: "late morning", rtgs: "", cefr: null, freq: 832, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สายดี", es: "sǎai dii", spanish: "mediodía/tarde bueno" },
    question: { thai: "มีสายไหม", es: "mii sǎai mǎi", spanish: "¿Hay mediodía/tarde?" },
    answer: { thai: "มีสาย", es: "mii sǎai", spanish: "Sí, hay mediodía/tarde" }
  },
  {
    rank: 833, thai: "เที่ยง", es: "thìang", spanish: "mediodía", english: "noon", rtgs: "", cefr: null, freq: 833, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เที่ยงดี", es: "thìang dii", spanish: "mediodía bueno" },
    question: { thai: "มีเที่ยงไหม", es: "mii thìang mǎi", spanish: "¿Hay mediodía?" },
    answer: { thai: "มีเที่ยง", es: "mii thìang", spanish: "Sí, hay mediodía" }
  },
  {
    rank: 834, thai: "บ่าย", es: "bàai", spanish: "tarde", english: "afternoon", rtgs: "", cefr: null, freq: 834, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บ่ายดี", es: "bàai dii", spanish: "tarde bueno" },
    question: { thai: "มีบ่ายไหม", es: "mii bàai mǎi", spanish: "¿Hay tarde?" },
    answer: { thai: "มีบ่าย", es: "mii bàai", spanish: "Sí, hay tarde" }
  },
  {
    rank: 835, thai: "ค่ำ", es: "khàm", spanish: "anochecer", english: "dusk", rtgs: "", cefr: null, freq: 835, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ค่ำดี", es: "khàm dii", spanish: "anochecer bueno" },
    question: { thai: "มีค่ำไหม", es: "mii khàm mǎi", spanish: "¿Hay anochecer?" },
    answer: { thai: "มีค่ำ", es: "mii khàm", spanish: "Sí, hay anochecer" }
  },
  {
    rank: 836, thai: "ทุกวัน", es: "thúk-wan", spanish: "cada día", english: "every day", rtgs: "", cefr: null, freq: 836, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "ออกกำลังกายทุกวัน", es: "ɔ̀ɔk gam-lang-kaai thúk-wan", spanish: "hacer ejercicio cada día, en: "exercise every day" },
    question: { thai: "ทุกวันไหม", es: "thúk-wan mǎi", spanish: "¿cada día?" },
    answer: { thai: "ทุกวัน", es: "thúk-wan", spanish: "cada día" }
  },
  {
    rank: 837, thai: "วันนี้", es: "wan-níi", spanish: "hoy", english: "today", rtgs: "", cefr: null, freq: 837, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วันนี้ดี", es: "wan-níi dii", spanish: "hoy bueno" },
    question: { thai: "มีวันนี้ไหม", es: "mii wan-níi mǎi", spanish: "¿Hay hoy?" },
    answer: { thai: "มีวันนี้", es: "mii wan-níi", spanish: "Sí, hay hoy" }
  },
  {
    rank: 838, thai: "เมื่อวาน", es: "mûea-waan", spanish: "ayer", english: "yesterday", rtgs: "", cefr: null, freq: 838, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เมื่อวานดี", es: "mûea-waan dii", spanish: "ayer bueno" },
    question: { thai: "มีเมื่อวานไหม", es: "mii mûea-waan mǎi", spanish: "¿Hay ayer?" },
    answer: { thai: "มีเมื่อวาน", es: "mii mûea-waan", spanish: "Sí, hay ayer" }
  },
  {
    rank: 839, thai: "พรุ่งนี้", es: "prùng-níi", spanish: "mañana", english: "tomorrow", rtgs: "", cefr: null, freq: 839, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "พรุ่งนี้ดี", es: "prùng-níi dii", spanish: "mañana bueno" },
    question: { thai: "มีพรุ่งนี้ไหม", es: "mii prùng-níi mǎi", spanish: "¿Hay mañana?" },
    answer: { thai: "มีพรุ่งนี้", es: "mii prùng-níi", spanish: "Sí, hay mañana" }
  },
  {
    rank: 840, thai: "มะรืน", es: "má-rǔen", spanish: "pasado mañana", english: "day after tomorrow", rtgs: "", cefr: null, freq: 840, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "มะรืนดี", es: "má-rǔen dii", spanish: "pasado mañana bueno" },
    question: { thai: "มีมะรืนไหม", es: "mii má-rǔen mǎi", spanish: "¿Hay pasado mañana?" },
    answer: { thai: "มีมะรืน", es: "mii má-rǔen", spanish: "Sí, hay pasado mañana" }
  },
  {
    rank: 841, thai: "เช้าวันนี้", es: "cháo-wan-níi", spanish: "esta mañana", english: "this morning", rtgs: "", cefr: null, freq: 841, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เช้าวันนี้ดี", es: "cháo-wan-níi dii", spanish: "esta mañana bueno" },
    question: { thai: "มีเช้าวันนี้ไหม", es: "mii cháo-wan-níi mǎi", spanish: "¿Hay esta mañana?" },
    answer: { thai: "มีเช้าวันนี้", es: "mii cháo-wan-níi", spanish: "Sí, hay esta mañana" }
  },
  {
    rank: 842, thai: "คืนนี้", es: "kǔuen-níi", spanish: "esta noche", english: "tonight", rtgs: "", cefr: null, freq: 842, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คืนนี้ดี", es: "kǔuen-níi dii", spanish: "esta noche bueno" },
    question: { thai: "มีคืนนี้ไหม", es: "mii kǔuen-níi mǎi", spanish: "¿Hay esta noche?" },
    answer: { thai: "มีคืนนี้", es: "mii kǔuen-níi", spanish: "Sí, hay esta noche" }
  },
  {
    rank: 843, thai: "คืนที่แล้ว", es: "kǔuen-thîi-láew", spanish: "anoche", english: "last night", rtgs: "", cefr: null, freq: 843, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คืนที่แล้วดี", es: "kǔuen-thîi-láew dii", spanish: "anoche bueno" },
    question: { thai: "มีคืนที่แล้วไหม", es: "mii kǔuen-thîi-láew mǎi", spanish: "¿Hay anoche?" },
    answer: { thai: "มีคืนที่แล้ว", es: "mii kǔuen-thîi-láew", spanish: "Sí, hay anoche" }
  },
  {
    rank: 844, thai: "สัปดาห์", es: "sàp-daa", spanish: "semana", english: "week", rtgs: "", cefr: null, freq: 844, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "สัปดาห์ดี", es: "sàp-daa dii", spanish: "semana bueno" },
    question: { thai: "มีสัปดาห์ไหม", es: "mii sàp-daa mǎi", spanish: "¿Hay semana?" },
    answer: { thai: "มีสัปดาห์", es: "mii sàp-daa", spanish: "Sí, hay semana" }
  },
  {
    rank: 845, thai: "เดือน", es: "duean", spanish: "mes", english: "month", rtgs: "", cefr: null, freq: 845, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เดือนดี", es: "duean dii", spanish: "mes bueno" },
    question: { thai: "มีเดือนไหม", es: "mii duean mǎi", spanish: "¿Hay mes?" },
    answer: { thai: "มีเดือน", es: "mii duean", spanish: "Sí, hay mes" }
  },
  {
    rank: 846, thai: "ปีนี้", es: "bpii-níi", spanish: "este año", english: "this year", rtgs: "", cefr: null, freq: 846, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปีนี้ดี", es: "bpii-níi dii", spanish: "este año bueno" },
    question: { thai: "มีปีนี้ไหม", es: "mii bpii-níi mǎi", spanish: "¿Hay este año?" },
    answer: { thai: "มีปีนี้", es: "mii bpii-níi", spanish: "Sí, hay este año" }
  },
  {
    rank: 847, thai: "ปีที่แล้ว", es: "bpii-thîi-láew", spanish: "el año pasado", english: "last year", rtgs: "", cefr: null, freq: 847, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปีที่แล้วดี", es: "bpii-thîi-láew dii", spanish: "el año pasado bueno" },
    question: { thai: "มีปีที่แล้วไหม", es: "mii bpii-thîi-láew mǎi", spanish: "¿Hay el año pasado?" },
    answer: { thai: "มีปีที่แล้ว", es: "mii bpii-thîi-láew", spanish: "Sí, hay el año pasado" }
  },
  {
    rank: 848, thai: "ปีหน้า", es: "bpii-nâa", spanish: "el año que viene", english: "next year", rtgs: "", cefr: null, freq: 848, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ปีหน้าดี", es: "bpii-nâa dii", spanish: "el año que viene bueno" },
    question: { thai: "มีปีหน้าไหม", es: "mii bpii-nâa mǎi", spanish: "¿Hay el año que viene?" },
    answer: { thai: "มีปีหน้า", es: "mii bpii-nâa", spanish: "Sí, hay el año que viene" }
  },
  {
    rank: 849, thai: "ชั่วโมง", es: "chûa-moong", spanish: "hora", english: "hour", rtgs: "", cefr: null, freq: 849, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ชั่วโมงดี", es: "chûa-moong dii", spanish: "hora bueno" },
    question: { thai: "มีชั่วโมงไหม", es: "mii chûa-moong mǎi", spanish: "¿Hay hora?" },
    answer: { thai: "มีชั่วโมง", es: "mii chûa-moong", spanish: "Sí, hay hora" }
  },
  {
    rank: 850, thai: "นาที", es: "naa-thii", spanish: "minuto", english: "minute", rtgs: "", cefr: null, freq: 850, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นาทีดี", es: "naa-thii dii", spanish: "minuto bueno" },
    question: { thai: "มีนาทีไหม", es: "mii naa-thii mǎi", spanish: "¿Hay minuto?" },
    answer: { thai: "มีนาที", es: "mii naa-thii", spanish: "Sí, hay minuto" }
  },
  {
    rank: 851, thai: "วินาที", es: "wi-naa-thii", spanish: "segundo", english: "second", rtgs: "", cefr: null, freq: 851, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "วินาทีดี", es: "wi-naa-thii dii", spanish: "segundo bueno" },
    question: { thai: "มีวินาทีไหม", es: "mii wi-naa-thii mǎi", spanish: "¿Hay segundo?" },
    answer: { thai: "มีวินาที", es: "mii wi-naa-thii", spanish: "Sí, hay segundo" }
  },
  {
    rank: 852, thai: "เดี๋ยว", es: "dǐao", spanish: "momento", english: "moment", rtgs: "", cefr: null, freq: 852, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เดี๋ยวดี", es: "dǐao dii", spanish: "momento bueno" },
    question: { thai: "มีเดี๋ยวไหม", es: "mii dǐao mǎi", spanish: "¿Hay momento?" },
    answer: { thai: "มีเดี๋ยว", es: "mii dǐao", spanish: "Sí, hay momento" }
  },
  {
    rank: 853, thai: "ตอนนี้", es: "dton-níi", spanish: "ahora", english: "now", rtgs: "", cefr: null, freq: 853, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ตอนนี้ไม่ว่าง", es: "dton-níi mâi wàang", spanish: "ahora estoy ocupado, en: "now I'm busy" },
    question: { thai: "ตอนนี้ไหม", es: "dton-níi mǎi", spanish: "¿ahora?" },
    answer: { thai: "ตอนนี้", es: "dton-níi", spanish: "ahora" }
  },
  {
    rank: 854, thai: "เดี๋ยวนี้", es: "dǐao-níi", spanish: "ahora mismo", english: "right now", rtgs: "", cefr: null, freq: 854, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "ต้องไปเดี๋ยวนี้", es: "dtɔ̂ɔŋ bpai dǐao-níi", spanish: "tengo que ir ahora mismo, en: "I must go right now" },
    question: { thai: "เดี๋ยวนี้ไหม", es: "dǐao-níi mǎi", spanish: "¿ahora mismo?" },
    answer: { thai: "เดี๋ยวนี้", es: "dǐao-níi", spanish: "ahora mismo" }
  },
  {
    rank: 855, thai: "เร็วๆ นี้", es: "reo-reo-níi", spanish: "pronto", english: "soon", rtgs: "", cefr: null, freq: 855, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "เร็วๆ นี้จะไป", es: "reo-reo níi jà bpai", spanish: "iré pronto, en: "I'll go soon" },
    question: { thai: "เร็วๆ นี้ไหม", es: "reo-reo-níi mǎi", spanish: "¿pronto?" },
    answer: { thai: "เร็วๆ นี้", es: "reo-reo-níi", spanish: "pronto" }
  },
  {
    rank: 856, thai: "ก่อนหน้า", es: "gòon-nǎa", spanish: "anterior", english: "previous", rtgs: "", cefr: null, freq: 856, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "สัปดาห์ก่อนหน้า", es: "sàp-daa gòon-nǎa", spanish: "la semana pasada, en: "last week" },
    question: { thai: "ก่อนหน้าไหม", es: "gòon-nǎa mǎi", spanish: "¿anterior?" },
    answer: { thai: "ก่อนหน้า", es: "gòon-nǎa", spanish: "anterior" }
  },
  {
    rank: 857, thai: "ภายหลัง", es: "phaai-lǎng", spanish: "después", english: "afterwards", rtgs: "", cefr: null, freq: 857, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ภายหลังจะบอก", es: "phaai-lǎng jà bɔ̀ɔk", spanish: "te lo diré después, en: "I'll tell you later" },
    question: { thai: "ภายหลังไหม", es: "phaai-lǎng mǎi", spanish: "¿después?" },
    answer: { thai: "ภายหลัง", es: "phaai-lǎng", spanish: "después" }
  },
  {
    rank: 858, thai: "ในที่สุด", es: "nai-thîi-sùt", spanish: "finalmente", english: "finally", rtgs: "", cefr: null, freq: 858, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "ในที่สุดก็ชนะ", es: "nai thîi-sùt gâ chá-ná", spanish: "finalmente ganó, en: "finally won" },
    question: { thai: "ในที่สุดไหม", es: "nai-thîi-sùt mǎi", spanish: "¿finalmente?" },
    answer: { thai: "ในที่สุด", es: "nai-thîi-sùt", spanish: "finalmente" }
  },
  {
    rank: 859, thai: "ตั้งแต่", es: "dtàng-dtàae", spanish: "desde", english: "since", rtgs: "", cefr: null, freq: 859, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "ตั้งแต่เมื่อวาน", es: "dtàng-dtàae mûea waan", spanish: "desde ayer, en: "since yesterday" },
    question: { thai: "ตั้งแต่ไหม", es: "dtàng-dtàae mǎi", spanish: "¿desde?" },
    answer: { thai: "ตั้งแต่", es: "dtàng-dtàae", spanish: "desde" }
  },
  {
    rank: 860, thai: "จนกระทั่ง", es: "jon-grà-thùang", spanish: "hasta", english: "until", rtgs: "", cefr: null, freq: 860, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "รอจนกระทั่งพรุ่งนี้", es: "rɔɔ jon-grà-thùang prùng-níi", spanish: "esperar hasta mañana, en: "wait until tomorrow" },
    question: { thai: "จนกระทั่งไหม", es: "jon-grà-thùang mǎi", spanish: "¿hasta?" },
    answer: { thai: "จนกระทั่ง", es: "jon-grà-thùang", spanish: "hasta" }
  },
  {
    rank: 861, thai: "ระหว่าง", es: "rá-wàang", spanish: "entre/durante", english: "between/during", rtgs: "", cefr: null, freq: 861, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "ระหว่างทำงาน", es: "rá-wàang tham ngaan", spanish: "durante el trabajo, en: "during work" },
    question: { thai: "ระหว่างไหม", es: "rá-wàang mǎi", spanish: "¿entre/durante?" },
    answer: { thai: "ระหว่าง", es: "rá-wàang", spanish: "entre/durante" }
  },
  {
    rank: 862, thai: "ขณะ", es: "khà-ná", spanish: "mientras", english: "while", rtgs: "", cefr: null, freq: 862, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "ขณะนี้ฝนตก", es: "khà-ná níi fǒn dtòk", spanish: "en este momento llueve, en: "at the moment it's raining" },
    question: { thai: "ขณะไหม", es: "khà-ná mǎi", spanish: "¿mientras?" },
    answer: { thai: "ขณะ", es: "khà-ná", spanish: "mientras" }
  },
  {
    rank: 863, thai: "ถ้า", es: "tâa", spanish: "si", english: "if", rtgs: "", cefr: null, freq: 863, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ถ้าฝนตกจะไม่ไป", es: "tâa fǒn dtòk jà mâi bpai", spanish: "si llueve no iré, en: "if it rains I won't go" },
    question: { thai: "ถ้าไหม", es: "tâa mǎi", spanish: "¿si?" },
    answer: { thai: "ถ้า", es: "tâa", spanish: "si" }
  },
  {
    rank: 864, thai: "หาก", es: "hàk", spanish: "si (condicional)", english: "if", rtgs: "", cefr: null, freq: 864, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "หากมีเวลา", es: "hàk mii we-laa", spanish: "si hay tiempo, en: "if there is time" },
    question: { thai: "หากไหม", es: "hàk mǎi", spanish: "¿si (condicional)?" },
    answer: { thai: "หาก", es: "hàk", spanish: "si (condicional)" }
  },
  {
    rank: 865, thai: "เพราะว่า", es: "phrɔ́-wâa", spanish: "porque", english: "because", rtgs: "", cefr: null, freq: 865, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "เพราะว่าฝนตกหนัก", es: "phrɔ̂-wâa fǒn dtòk nàk", spanish: "porque llueve fuerte, en: "because it rains heavily" },
    question: { thai: "เพราะว่าไหม", es: "phrɔ́-wâa mǎi", spanish: "¿porque?" },
    answer: { thai: "เพราะว่า", es: "phrɔ́-wâa", spanish: "porque" }
  },
  {
    rank: 866, thai: "เนื่องจาก", es: "nǔeang-jàak", spanish: "debido a", english: "due to", rtgs: "", cefr: null, freq: 866, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "เนื่องจากฝนตก", es: "nǔeang-jàak fǒn dtòk", spanish: "debido a la lluvia, en: "due to the rain" },
    question: { thai: "เนื่องจากไหม", es: "nǔeang-jàak mǎi", spanish: "¿debido a?" },
    answer: { thai: "เนื่องจาก", es: "nǔeang-jàak", spanish: "debido a" }
  },
  {
    rank: 867, thai: "ดังนั้น", es: "dang-nán", spanish: "por lo tanto", english: "therefore", rtgs: "", cefr: null, freq: 867, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ดังนั้นอย่าไป", es: "dang-nán yàa bpai", spanish: "por lo tanto, no vayas, en: "therefore, don't go" },
    question: { thai: "ดังนั้นไหม", es: "dang-nán mǎi", spanish: "¿por lo tanto?" },
    answer: { thai: "ดังนั้น", es: "dang-nán", spanish: "por lo tanto" }
  },
  {
    rank: 868, thai: "ฉะนั้น", es: "chà-nán", spanish: "por consiguiente", english: "therefore", rtgs: "", cefr: null, freq: 868, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ฉะนั้นผมจะไป", es: "chà-nán phǒm jà bpai", spanish: "por consiguiente, yo iré, en: "consequently, I'll go" },
    question: { thai: "ฉะนั้นไหม", es: "chà-nán mǎi", spanish: "¿por consiguiente?" },
    answer: { thai: "ฉะนั้น", es: "chà-nán", spanish: "por consiguiente" }
  },
  {
    rank: 869, thai: "แต่", es: "dtàae", spanish: "pero", english: "but", rtgs: "", cefr: null, freq: 869, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "อยากไปแต่ไม่ว่าง", es: "yàak bpai dtàae mâi wàang", spanish: "quería ir pero estoy ocupado, en: "I want to go but I'm busy" },
    question: { thai: "แต่ไหม", es: "dtàae mǎi", spanish: "¿pero?" },
    answer: { thai: "แต่", es: "dtàae", spanish: "pero" }
  },
  {
    rank: 870, thai: "อย่างไรก็ตาม", es: "yàang-rai-gâw-dtaam", spanish: "sin embargo", english: "however", rtgs: "", cefr: null, freq: 870, notes: "",
    category: "expresiones", tone: "r",
    phrase: { thai: "อย่างไรก็ตามจะไป", es: "yàang-rai gâw-dtaam jà bpai", spanish: "sin embargo, iré, en: "however, I'll go" },
    question: { thai: "อย่างไรก็ตามไหม", es: "yàang-rai-gâw-dtaam mǎi", spanish: "¿sin embargo?" },
    answer: { thai: "อย่างไรก็ตาม", es: "yàang-rai-gâw-dtaam", spanish: "sin embargo" }
  },
  {
    rank: 871, thai: "แม้ว่า", es: "máae-wâa", spanish: "aunque", english: "although", rtgs: "", cefr: null, freq: 871, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "แม้ว่าลำบากก็ทำ", es: "máae-wâa lam-bàak gâ tham", spanish: "aunque sea difícil lo hago, en: "although it's hard I do it" },
    question: { thai: "แม้ว่าไหม", es: "máae-wâa mǎi", spanish: "¿aunque?" },
    answer: { thai: "แม้ว่า", es: "máae-wâa", spanish: "aunque" }
  },
  {
    rank: 872, thai: "และ", es: "lae", spanish: "y", english: "and", rtgs: "", cefr: null, freq: 872, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "สวยและดี", es: "sǔuai lae dii", spanish: "hermoso y bueno, en: "beautiful and good" },
    question: { thai: "และไหม", es: "lae mǎi", spanish: "¿y?" },
    answer: { thai: "และ", es: "lae", spanish: "y" }
  },
  {
    rank: 873, thai: "แล้ว", es: "láew", spanish: "entonces/y", english: "then", rtgs: "", cefr: null, freq: 873, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "กินข้าวแล้ว", es: "gin kâao lɛ́ɛw", spanish: "ya comí, en: "already ate" },
    question: { thai: "แล้วไหม", es: "láew mǎi", spanish: "¿entonces/y?" },
    answer: { thai: "แล้ว", es: "láew", spanish: "entonces/y" }
  },
  {
    rank: 874, thai: "เพื่อที่จะ", es: "pêua-thîi-jà", spanish: "para que", english: "in order to", rtgs: "", cefr: null, freq: 874, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เพื่อที่จะได้เรียน", es: "pêua thîi-jà dâai rian", spanish: "para poder estudiar, en: "in order to be able to study" },
    question: { thai: "เพื่อที่จะไหม", es: "pêua-thîi-jà mǎi", spanish: "¿para que?" },
    answer: { thai: "เพื่อที่จะ", es: "pêua-thîi-jà", spanish: "para que" }
  },
  {
    rank: 875, thai: "โดย", es: "dooy", spanish: "por/mediante", english: "by", rtgs: "", cefr: null, freq: 875, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "เดินทางโดยรถไฟ", es: "dooen-thaang dooy rót-fai", spanish: "viajar en tren, en: "travel by train" },
    question: { thai: "โดยไหม", es: "dooy mǎi", spanish: "¿por/mediante?" },
    answer: { thai: "โดย", es: "dooy", spanish: "por/mediante" }
  },
  {
    rank: 876, thai: "ผ่าน", es: "pàan", spanish: "a través de", english: "through", rtgs: "", cefr: null, freq: 876, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เดินผ่านป่า", es: "dooen pàan bpàa", spanish: "caminar a través del bosque, en: "walk through the forest" },
    question: { thai: "ผ่านไหม", es: "pàan mǎi", spanish: "¿a través de?" },
    answer: { thai: "ผ่าน", es: "pàan", spanish: "a través de" }
  },
  {
    rank: 877, thai: "ตลอด", es: "dtà-lòt", spanish: "durante/todo", english: "throughout", rtgs: "", cefr: null, freq: 877, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "ทำงานตลอดคืน", es: "tham ngaan dtà-lòt khuue", spanish: "trabajar toda la noche, en: "work all night" },
    question: { thai: "ตลอดไหม", es: "dtà-lòt mǎi", spanish: "¿durante/todo?" },
    answer: { thai: "ตลอด", es: "dtà-lòt", spanish: "durante/todo" }
  },
  {
    rank: 878, thai: "บ่อย", es: "bòi", spanish: "a menudo", english: "often", rtgs: "", cefr: null, freq: 878, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "ไปตลาดบ่อย", es: "bpai dtà-làat bòi", spanish: "ir al mercado a menudo, en: "go to the market often" },
    question: { thai: "บ่อยไหม", es: "bòi mǎi", spanish: "¿a menudo?" },
    answer: { thai: "บ่อย", es: "bòi", spanish: "a menudo" }
  },
  {
    rank: 879, thai: "นานๆ", es: "naan-naan", spanish: "raramente", english: "rarely", rtgs: "", cefr: null, freq: 879, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "นานๆ ไปที", es: "naan-naan bpai thii", spanish: "ir raramente, en: "rarely go" },
    question: { thai: "นานๆไหม", es: "naan-naan mǎi", spanish: "¿raramente?" },
    answer: { thai: "นานๆ", es: "naan-naan", spanish: "raramente" }
  },
  {
    rank: 880, thai: "เป็นบางครั้ง", es: "bpen-baang-kráng", spanish: "a veces", english: "sometimes", rtgs: "", cefr: null, freq: 880, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "เป็นบางครั้งก็โกรธ", es: "bpen baang-kráng gàw gròot", spanish: "a veces se enoja, en: "sometimes he gets angry" },
    question: { thai: "เป็นบางครั้งไหม", es: "bpen-baang-kráng mǎi", spanish: "¿a veces?" },
    answer: { thai: "เป็นบางครั้ง", es: "bpen-baang-kráng", spanish: "a veces" }
  },
  {
    rank: 881, thai: "ไม่เคย", es: "mâi-khooei", spanish: "nunca", english: "never", rtgs: "", cefr: null, freq: 881, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ไม่เคยไปญี่ปุ่น", es: "mâi khooei bpai yîi-pùn", spanish: "nunca he ido a Japón, en: "never been to Japan" },
    question: { thai: "ไม่เคยไหม", es: "mâi-khooei mǎi", spanish: "¿nunca?" },
    answer: { thai: "ไม่เคย", es: "mâi-khooei", spanish: "nunca" }
  },
  {
    rank: 882, thai: "อีกครั้ง", es: "èek-kráng", spanish: "otra vez", english: "again", rtgs: "", cefr: null, freq: 882, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ลองอีกครั้ง", es: "lɔɔng èek-kráng", spanish: "intentar otra vez, en: "try again" },
    question: { thai: "อีกครั้งไหม", es: "èek-kráng mǎi", spanish: "¿otra vez?" },
    answer: { thai: "อีกครั้ง", es: "èek-kráng", spanish: "otra vez" }
  },
  {
    rank: 883, thai: "อีก", es: "èek", spanish: "más/otro", english: "more/again", rtgs: "", cefr: null, freq: 883, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "อีกหน่อย", es: "èek nòi", spanish: "un poco más, en: "a little more" },
    question: { thai: "อีกไหม", es: "èek mǎi", spanish: "¿más/otro?" },
    answer: { thai: "อีก", es: "èek", spanish: "más/otro" }
  },
  {
    rank: 884, thai: "ก็", es: "gâw", spanish: "también/entonces", english: "also/then", rtgs: "", cefr: null, freq: 884, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "ก็ดี", es: "gâw dii", spanish: "está bien entonces, en: "that's fine" },
    question: { thai: "ก็ไหม", es: "gâw mǎi", spanish: "¿también/entonces?" },
    answer: { thai: "ก็", es: "gâw", spanish: "también/entonces" }
  },
  {
    rank: 885, thai: "เท่านั้น", es: "tâo-nán", spanish: "solamente", english: "only", rtgs: "", cefr: null, freq: 885, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ฉันคนเดียวเท่านั้น", es: "chǎn khon diao tâo-nán", spanish: "solamente yo, en: "only me" },
    question: { thai: "เท่านั้นไหม", es: "tâo-nán mǎi", spanish: "¿solamente?" },
    answer: { thai: "เท่านั้น", es: "tâo-nán", spanish: "solamente" }
  },
  {
    rank: 886, thai: "เกือบ", es: "gùeap", spanish: "casi", english: "almost", rtgs: "", cefr: null, freq: 886, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "เกือบถึงแล้ว", es: "gùeap thǔeng lɛ́ɛw", spanish: "casi llego, en: "almost arrived" },
    question: { thai: "เกือบไหม", es: "gùeap mǎi", spanish: "¿casi?" },
    answer: { thai: "เกือบ", es: "gùeap", spanish: "casi" }
  },
  {
    rank: 887, thai: "น้อย", es: "nǎai", spanish: "poco", english: "little/few", rtgs: "", cefr: null, freq: 887, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "น้อยลง", es: "nǎai long", spanish: "menos, en: "less / reduced" },
    question: { thai: "น้อยไหม", es: "nǎai mǎi", spanish: "¿poco?" },
    answer: { thai: "น้อย", es: "nǎai", spanish: "poco" }
  },
  {
    rank: 888, thai: "เล็กน้อย", es: "lék-nǎai", spanish: "un poco", english: "a little", rtgs: "", cefr: null, freq: 888, notes: "",
    category: "adverbios", tone: "h",
    phrase: { thai: "เล็กน้อยก็พอ", es: "lék-nǎai gâw poo", spanish: "un poco es suficiente, en: "a little is enough" },
    question: { thai: "เล็กน้อยไหม", es: "lék-nǎai mǎi", spanish: "¿un poco?" },
    answer: { thai: "เล็กน้อย", es: "lék-nǎai", spanish: "un poco" }
  },
  {
    rank: 889, thai: "มากเกินไป", es: "mâak-gəən-bpai", spanish: "demasiado", english: "too much", rtgs: "", cefr: null, freq: 889, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "เผ็ดมากเกินไป", es: "phèt mâak-gəən-bpai", spanish: "demasiado picante, en: "too spicy" },
    question: { thai: "มากเกินไปไหม", es: "mâak-gəən-bpai mǎi", spanish: "¿demasiado?" },
    answer: { thai: "มากเกินไป", es: "mâak-gəən-bpai", spanish: "demasiado" }
  },
  {
    rank: 890, thai: "เหลือเกิน", es: "lǔea-gəən", spanish: "excesivo", english: "excessive", rtgs: "", cefr: null, freq: 890, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ดีเหลือเกิน", es: "dii lǔea-gəən", spanish: "es muy bueno, en: "it's so good" },
    question: { thai: "เหลือเกินไหม", es: "lǔea-gəən mǎi", spanish: "¿excesivo?" },
    answer: { thai: "เหลือเกิน", es: "lǔea-gəən", spanish: "excesivo" }
  },
  {
    rank: 891, thai: "พอสมควร", es: "poo-sǒm-khwaan", spanish: "razonable", english: "reasonably", rtgs: "", cefr: null, freq: 891, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "พอสมควรดี", es: "poo-sǒm-khwaan dii", spanish: "razonablemente bien, en: "reasonably good" },
    question: { thai: "พอสมควรไหม", es: "poo-sǒm-khwaan mǎi", spanish: "¿razonable?" },
    answer: { thai: "พอสมควร", es: "poo-sǒm-khwaan", spanish: "razonable" }
  },
  {
    rank: 892, thai: "ด้วย", es: "dûuai", spanish: "también/con", english: "also/with", rtgs: "", cefr: null, freq: 892, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ฉันไปด้วย", es: "chǎn bpai dûuai", spanish: "yo también voy, en: "I'll go too" },
    question: { thai: "ด้วยไหม", es: "dûuai mǎi", spanish: "¿también/con?" },
    answer: { thai: "ด้วย", es: "dûuai", spanish: "también/con" }
  },
  {
    rank: 893, thai: "เอง", es: "een", spanish: "mismo", english: "self", rtgs: "", cefr: null, freq: 893, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "ทำเอง", es: "tham een", spanish: "hacerlo uno mismo, en: "do it oneself" },
    question: { thai: "เองไหม", es: "een mǎi", spanish: "¿mismo?" },
    answer: { thai: "เอง", es: "een", spanish: "mismo" }
  },
  {
    rank: 894, thai: "จริงๆ", es: "jing-jing", spanish: "realmente", english: "really", rtgs: "", cefr: null, freq: 894, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "สวยจริงๆ", es: "sǔuai jing-jing", spanish: "realmente hermoso, en: "really beautiful" },
    question: { thai: "จริงๆไหม", es: "jing-jing mǎi", spanish: "¿realmente?" },
    answer: { thai: "จริงๆ", es: "jing-jing", spanish: "realmente" }
  },
  {
    rank: 895, thai: "แท้จริง", es: "tâae-jing", spanish: "verdadero", english: "true", rtgs: "", cefr: null, freq: 895, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "หัวใจแท้จริง", es: "hǔua-jai tâae-jing", spanish: "corazón verdadero, en: "true heart" },
    question: { thai: "แท้จริงไหม", es: "tâae-jing mǎi", spanish: "¿verdadero?" },
    answer: { thai: "แท้จริง", es: "tâae-jing", spanish: "verdadero" }
  },
  {
    rank: 896, thai: "เช่นกัน", es: "chên-gan", spanish: "también", english: "as well", rtgs: "", cefr: null, freq: 896, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ผมก็เช่นกัน", es: "phǒm gâw chên-gan", spanish: "yo también, en: "me too" },
    question: { thai: "เช่นกันไหม", es: "chên-gan mǎi", spanish: "¿también?" },
    answer: { thai: "เช่นกัน", es: "chên-gan", spanish: "también" }
  },
  {
    rank: 897, thai: "อีกด้วย", es: "èek-dûuai", spanish: "además", english: "as well", rtgs: "", cefr: null, freq: 897, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "สวยและฉลาดอีกด้วย", es: "sǔuai lae chà-làat èek-dûuai", spanish: "además es hermosa e inteligente, en: "also beautiful and smart" },
    question: { thai: "อีกด้วยไหม", es: "èek-dûuai mǎi", spanish: "¿además?" },
    answer: { thai: "อีกด้วย", es: "èek-dûuai", spanish: "además" }
  },
  {
    rank: 898, thai: "เป็นพิเศษ", es: "bpen-phí-sèt", spanish: "especialmente", english: "especially", rtgs: "", cefr: null, freq: 898, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "วันศุกร์เป็นพิเศษ", es: "wan sùk-krá bpen-phí-sèt", spanish: "especialmente el viernes, en: "especially Friday" },
    question: { thai: "เป็นพิเศษไหม", es: "bpen-phí-sèt mǎi", spanish: "¿especialmente?" },
    answer: { thai: "เป็นพิเศษ", es: "bpen-phí-sèt", spanish: "especialmente" }
  },
  {
    rank: 899, thai: "โดยเฉพาะ", es: "dooy-chà-phǒe", spanish: "particularmente", english: "particularly", rtgs: "", cefr: null, freq: 899, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "โดยเฉพาะอาหารไทย", es: "dooy chà-phǒe aa-hǎan thai", spanish: "particularmente la comida tailandesa, en: "particularly Thai food" },
    question: { thai: "โดยเฉพาะไหม", es: "dooy-chà-phǒe mǎi", spanish: "¿particularmente?" },
    answer: { thai: "โดยเฉพาะ", es: "dooy-chà-phǒe", spanish: "particularmente" }
  },
  {
    rank: 900, thai: "เนื่องกับ", es: "nǔeang-gàp", spanish: "relacionado con", english: "related to", rtgs: "", cefr: null, freq: 900, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "เรื่องเนื่องกับการเงิน", es: "rʉ̂aŋ nǔeang-gàp gaan-ngən", spanish: "asunto relacionado con dinero, en: "matter related to money" },
    question: { thai: "เนื่องกับไหม", es: "nǔeang-gàp mǎi", spanish: "¿relacionado con?" },
    answer: { thai: "เนื่องกับ", es: "nǔeang-gàp", spanish: "relacionado con" }
  },
  {
    rank: 901, thai: "เพื่อน", es: "pǔean", spanish: "amigo", english: "friend", rtgs: "", cefr: null, freq: 901, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เพื่อนดี", es: "pǔean dii", spanish: "amigo bueno" },
    question: { thai: "มีเพื่อนไหม", es: "mii pǔean mǎi", spanish: "¿Hay amigo?" },
    answer: { thai: "มีเพื่อน", es: "mii pǔean", spanish: "Sí, hay amigo" }
  },
  {
    rank: 902, thai: "ครอบครัว", es: "khrôp-khrǎa", spanish: "familia", english: "family", rtgs: "", cefr: null, freq: 902, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ครอบครัวดี", es: "khrôp-khrǎa dii", spanish: "familia bueno" },
    question: { thai: "มีครอบครัวไหม", es: "mii khrôp-khrǎa mǎi", spanish: "¿Hay familia?" },
    answer: { thai: "มีครอบครัว", es: "mii khrôp-khrǎa", spanish: "Sí, hay familia" }
  },
  {
    rank: 903, thai: "พ่อ", es: "phâw", spanish: "padre", english: "father", rtgs: "", cefr: null, freq: 903, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พ่อดี", es: "phâw dii", spanish: "padre bueno" },
    question: { thai: "มีพ่อไหม", es: "mii phâw mǎi", spanish: "¿Hay padre?" },
    answer: { thai: "มีพ่อ", es: "mii phâw", spanish: "Sí, hay padre" }
  },
  {
    rank: 904, thai: "แม่", es: "mâae", spanish: "madre", english: "mother", rtgs: "", cefr: null, freq: 904, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "แม่ดี", es: "mâae dii", spanish: "madre bueno" },
    question: { thai: "มีแม่ไหม", es: "mii mâae mǎi", spanish: "¿Hay madre?" },
    answer: { thai: "มีแม่", es: "mii mâae", spanish: "Sí, hay madre" }
  },
  {
    rank: 905, thai: "พ่อแม่", es: "phâw-mâae", spanish: "padres", english: "parents", rtgs: "", cefr: null, freq: 905, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พ่อแม่ดี", es: "phâw-mâae dii", spanish: "padres bueno" },
    question: { thai: "มีพ่อแม่ไหม", es: "mii phâw-mâae mǎi", spanish: "¿Hay padres?" },
    answer: { thai: "มีพ่อแม่", es: "mii phâw-mâae", spanish: "Sí, hay padres" }
  },
  {
    rank: 906, thai: "ลูก", es: "lûuk", spanish: "hijo", english: "child", rtgs: "", cefr: null, freq: 906, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ลูกดี", es: "lûuk dii", spanish: "hijo bueno" },
    question: { thai: "มีลูกไหม", es: "mii lûuk mǎi", spanish: "¿Hay hijo?" },
    answer: { thai: "มีลูก", es: "mii lûuk", spanish: "Sí, hay hijo" }
  },
  {
    rank: 907, thai: "ลูกชาย", es: "lûuk-chaai", spanish: "hijo varón", english: "son", rtgs: "", cefr: null, freq: 907, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ลูกชายดี", es: "lûuk-chaai dii", spanish: "hijo varón bueno" },
    question: { thai: "มีลูกชายไหม", es: "mii lûuk-chaai mǎi", spanish: "¿Hay hijo varón?" },
    answer: { thai: "มีลูกชาย", es: "mii lûuk-chaai", spanish: "Sí, hay hijo varón" }
  },
  {
    rank: 908, thai: "ลูกสาว", es: "lûuk-sǎao", spanish: "hija", english: "daughter", rtgs: "", cefr: null, freq: 908, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ลูกสาวดี", es: "lûuk-sǎao dii", spanish: "hija bueno" },
    question: { thai: "มีลูกสาวไหม", es: "mii lûuk-sǎao mǎi", spanish: "¿Hay hija?" },
    answer: { thai: "มีลูกสาว", es: "mii lûuk-sǎao", spanish: "Sí, hay hija" }
  },
  {
    rank: 909, thai: "พี่", es: "phîi", spanish: "hermano/a mayor", english: "older sibling", rtgs: "", cefr: null, freq: 909, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "พี่ดี", es: "phîi dii", spanish: "hermano/a mayor bueno" },
    question: { thai: "มีพี่ไหม", es: "mii phîi mǎi", spanish: "¿Hay hermano/a mayor?" },
    answer: { thai: "มีพี่", es: "mii phîi", spanish: "Sí, hay hermano/a mayor" }
  },
  {
    rank: 910, thai: "น้อง", es: "nóng", spanish: "hermano/a menor", english: "younger sibling", rtgs: "", cefr: null, freq: 910, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "น้องดี", es: "nóng dii", spanish: "hermano/a menor bueno" },
    question: { thai: "มีน้องไหม", es: "mii nóng mǎi", spanish: "¿Hay hermano/a menor?" },
    answer: { thai: "มีน้อง", es: "mii nóng", spanish: "Sí, hay hermano/a menor" }
  },
  {
    rank: 911, thai: "ปู่", es: "bpùu", spanish: "abuelo paterno", english: "grandfather", rtgs: "", cefr: null, freq: 911, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ปู่ดี", es: "bpùu dii", spanish: "abuelo paterno bueno" },
    question: { thai: "มีปู่ไหม", es: "mii bpùu mǎi", spanish: "¿Hay abuelo paterno?" },
    answer: { thai: "มีปู่", es: "mii bpùu", spanish: "Sí, hay abuelo paterno" }
  },
  {
    rank: 912, thai: "ย่า", es: "yâa", spanish: "abuela paterna", english: "grandmother", rtgs: "", cefr: null, freq: 912, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ย่าดี", es: "yâa dii", spanish: "abuela paterna bueno" },
    question: { thai: "มีย่าไหม", es: "mii yâa mǎi", spanish: "¿Hay abuela paterna?" },
    answer: { thai: "มีย่า", es: "mii yâa", spanish: "Sí, hay abuela paterna" }
  },
  {
    rank: 913, thai: "ยาย", es: "yaai", spanish: "abuela materna", english: "grandmother", rtgs: "", cefr: null, freq: 913, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ยายดี", es: "yaai dii", spanish: "abuela materna bueno" },
    question: { thai: "มียายไหม", es: "mii yaai mǎi", spanish: "¿Hay abuela materna?" },
    answer: { thai: "มียาย", es: "mii yaai", spanish: "Sí, hay abuela materna" }
  },
  {
    rank: 914, thai: "สามี", es: "sǎa-mii", spanish: "esposo", english: "husband", rtgs: "", cefr: null, freq: 914, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สามีดี", es: "sǎa-mii dii", spanish: "esposo bueno" },
    question: { thai: "มีสามีไหม", es: "mii sǎa-mii mǎi", spanish: "¿Hay esposo?" },
    answer: { thai: "มีสามี", es: "mii sǎa-mii", spanish: "Sí, hay esposo" }
  },
  {
    rank: 915, thai: "ภรรยา", es: "pan-ra-yaa", spanish: "esposa", english: "wife", rtgs: "", cefr: null, freq: 915, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ภรรยาดี", es: "pan-ra-yaa dii", spanish: "esposa bueno" },
    question: { thai: "มีภรรยาไหม", es: "mii pan-ra-yaa mǎi", spanish: "¿Hay esposa?" },
    answer: { thai: "มีภรรยา", es: "mii pan-ra-yaa", spanish: "Sí, hay esposa" }
  },
  {
    rank: 916, thai: "แฟน", es: "faen", spanish: "novio/pareja", english: "boyfriend/partner", rtgs: "", cefr: null, freq: 916, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "แฟนดี", es: "faen dii", spanish: "novio/pareja bueno" },
    question: { thai: "มีแฟนไหม", es: "mii faen mǎi", spanish: "¿Hay novio/pareja?" },
    answer: { thai: "มีแฟน", es: "mii faen", spanish: "Sí, hay novio/pareja" }
  },
  {
    rank: 917, thai: "คนรู้จัก", es: "khon-rúu-jàk", spanish: "conocido", english: "acquaintance", rtgs: "", cefr: null, freq: 917, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คนรู้จักดี", es: "khon-rúu-jàk dii", spanish: "conocido bueno" },
    question: { thai: "มีคนรู้จักไหม", es: "mii khon-rúu-jàk mǎi", spanish: "¿Hay conocido?" },
    answer: { thai: "มีคนรู้จัก", es: "mii khon-rúu-jàk", spanish: "Sí, hay conocido" }
  },
  {
    rank: 918, thai: "เพื่อนสนิท", es: "pǔean-sà-nìt", spanish: "mejor amigo", english: "best friend", rtgs: "", cefr: null, freq: 918, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เพื่อนสนิทดี", es: "pǔean-sà-nìt dii", spanish: "mejor amigo bueno" },
    question: { thai: "มีเพื่อนสนิทไหม", es: "mii pǔean-sà-nìt mǎi", spanish: "¿Hay mejor amigo?" },
    answer: { thai: "มีเพื่อนสนิท", es: "mii pǔean-sà-nìt", spanish: "Sí, hay mejor amigo" }
  },
  {
    rank: 919, thai: "ศัตรู", es: "sàt-trúu", spanish: "enemigo", english: "enemy", rtgs: "", cefr: null, freq: 919, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ศัตรูดี", es: "sàt-trúu dii", spanish: "enemigo bueno" },
    question: { thai: "มีศัตรูไหม", es: "mii sàt-trúu mǎi", spanish: "¿Hay enemigo?" },
    answer: { thai: "มีศัตรู", es: "mii sàt-trúu", spanish: "Sí, hay enemigo" }
  },
  {
    rank: 920, thai: "ครู", es: "khruu", spanish: "maestro", english: "teacher", rtgs: "", cefr: null, freq: 920, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ครูดี", es: "khruu dii", spanish: "maestro bueno" },
    question: { thai: "มีครูไหม", es: "mii khruu mǎi", spanish: "¿Hay maestro?" },
    answer: { thai: "มีครู", es: "mii khruu", spanish: "Sí, hay maestro" }
  },
  {
    rank: 921, thai: "อาจารย์", es: "aa-jaan", spanish: "profesor", english: "professor", rtgs: "", cefr: null, freq: 921, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาจารย์ดี", es: "aa-jaan dii", spanish: "profesor bueno" },
    question: { thai: "มีอาจารย์ไหม", es: "mii aa-jaan mǎi", spanish: "¿Hay profesor?" },
    answer: { thai: "มีอาจารย์", es: "mii aa-jaan", spanish: "Sí, hay profesor" }
  },
  {
    rank: 922, thai: "นักเรียน", es: "nák-riian", spanish: "estudiante (escuela)", english: "student", rtgs: "", cefr: null, freq: 922, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "นักเรียนดี", es: "nák-riian dii", spanish: "estudiante (escuela) bueno" },
    question: { thai: "มีนักเรียนไหม", es: "mii nák-riian mǎi", spanish: "¿Hay estudiante (escuela)?" },
    answer: { thai: "มีนักเรียน", es: "mii nák-riian", spanish: "Sí, hay estudiante (escuela)" }
  },
  {
    rank: 923, thai: "นักศึกษา", es: "nák-sǔuek-sǎa", spanish: "estudiante (universitario)", english: "student", rtgs: "", cefr: null, freq: 923, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "นักศึกษาดี", es: "nák-sǔuek-sǎa dii", spanish: "estudiante (universitario) bueno" },
    question: { thai: "มีนักศึกษาไหม", es: "mii nák-sǔuek-sǎa mǎi", spanish: "¿Hay estudiante (universitario)?" },
    answer: { thai: "มีนักศึกษา", es: "mii nák-sǔuek-sǎa", spanish: "Sí, hay estudiante (universitario)" }
  },
  {
    rank: 924, thai: "เจ้านาย", es: "jâo-naai", spanish: "jefe", english: "boss", rtgs: "", cefr: null, freq: 924, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เจ้านายดี", es: "jâo-naai dii", spanish: "jefe bueno" },
    question: { thai: "มีเจ้านายไหม", es: "mii jâo-naai mǎi", spanish: "¿Hay jefe?" },
    answer: { thai: "มีเจ้านาย", es: "mii jâo-naai", spanish: "Sí, hay jefe" }
  },
  {
    rank: 925, thai: "ลูกน้อง", es: "lûuk-nóng", spanish: "subordinado", english: "subordinate", rtgs: "", cefr: null, freq: 925, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ลูกน้องดี", es: "lûuk-nóng dii", spanish: "subordinado bueno" },
    question: { thai: "มีลูกน้องไหม", es: "mii lûuk-nóng mǎi", spanish: "¿Hay subordinado?" },
    answer: { thai: "มีลูกน้อง", es: "mii lûuk-nóng", spanish: "Sí, hay subordinado" }
  },
  {
    rank: 926, thai: "เพื่อนร่วมงาน", es: "pǔean-rùam-ngaan", spanish: "colega", english: "colleague", rtgs: "", cefr: null, freq: 926, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เพื่อนร่วมงานดี", es: "pǔean-rùam-ngaan dii", spanish: "colega bueno" },
    question: { thai: "มีเพื่อนร่วมงานไหม", es: "mii pǔean-rùam-ngaan mǎi", spanish: "¿Hay colega?" },
    answer: { thai: "มีเพื่อนร่วมงาน", es: "mii pǔean-rùam-ngaan", spanish: "Sí, hay colega" }
  },
  {
    rank: 927, thai: "พนักงาน", es: "phá-nák-ngaan", spanish: "empleado", english: "employee", rtgs: "", cefr: null, freq: 927, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "พนักงานดี", es: "phá-nák-ngaan dii", spanish: "empleado bueno" },
    question: { thai: "มีพนักงานไหม", es: "mii phá-nák-ngaan mǎi", spanish: "¿Hay empleado?" },
    answer: { thai: "มีพนักงาน", es: "mii phá-nák-ngaan", spanish: "Sí, hay empleado" }
  },
  {
    rank: 928, thai: "นายจ้าง", es: "naai-jâang", spanish: "empleador", english: "employer", rtgs: "", cefr: null, freq: 928, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นายจ้างดี", es: "naai-jâang dii", spanish: "empleador bueno" },
    question: { thai: "มีนายจ้างไหม", es: "mii naai-jâang mǎi", spanish: "¿Hay empleador?" },
    answer: { thai: "มีนายจ้าง", es: "mii naai-jâang", spanish: "Sí, hay empleador" }
  },
  {
    rank: 929, thai: "ลูกจ้าง", es: "lûuk-jâang", spanish: "empleado", english: "employee", rtgs: "", cefr: null, freq: 929, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ลูกจ้างดี", es: "lûuk-jâang dii", spanish: "empleado bueno" },
    question: { thai: "มีลูกจ้างไหม", es: "mii lûuk-jâang mǎi", spanish: "¿Hay empleado?" },
    answer: { thai: "มีลูกจ้าง", es: "mii lûuk-jâang", spanish: "Sí, hay empleado" }
  },
  {
    rank: 930, thai: "ธุรกิจ", es: "thú-rà-kìt", spanish: "negocio", english: "business", rtgs: "", cefr: null, freq: 930, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ธุรกิจดี", es: "thú-rà-kìt dii", spanish: "negocio bueno" },
    question: { thai: "มีธุรกิจไหม", es: "mii thú-rà-kìt mǎi", spanish: "¿Hay negocio?" },
    answer: { thai: "มีธุรกิจ", es: "mii thú-rà-kìt", spanish: "Sí, hay negocio" }
  },
  {
    rank: 931, thai: "บริษัท", es: "boo-rí-sàt", spanish: "empresa", english: "company", rtgs: "", cefr: null, freq: 931, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บริษัทดี", es: "boo-rí-sàt dii", spanish: "empresa bueno" },
    question: { thai: "มีบริษัทไหม", es: "mii boo-rí-sàt mǎi", spanish: "¿Hay empresa?" },
    answer: { thai: "มีบริษัท", es: "mii boo-rí-sàt", spanish: "Sí, hay empresa" }
  },
  {
    rank: 932, thai: "งาน", es: "ngaan", spanish: "trabajo/fiesta", english: "work/party", rtgs: "", cefr: null, freq: 932, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "งานดี", es: "ngaan dii", spanish: "trabajo/fiesta bueno" },
    question: { thai: "มีงานไหม", es: "mii ngaan mǎi", spanish: "¿Hay trabajo/fiesta?" },
    answer: { thai: "มีงาน", es: "mii ngaan", spanish: "Sí, hay trabajo/fiesta" }
  },
  {
    rank: 933, thai: "การงาน", es: "gaan-ngaan", spanish: "ocupación", english: "occupation", rtgs: "", cefr: null, freq: 933, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "การงานดี", es: "gaan-ngaan dii", spanish: "ocupación bueno" },
    question: { thai: "มีการงานไหม", es: "mii gaan-ngaan mǎi", spanish: "¿Hay ocupación?" },
    answer: { thai: "มีการงาน", es: "mii gaan-ngaan", spanish: "Sí, hay ocupación" }
  },
  {
    rank: 934, thai: "อาชีพ", es: "aa-chìip", spanish: "profesión", english: "profession", rtgs: "", cefr: null, freq: 934, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อาชีพดี", es: "aa-chìip dii", spanish: "profesión bueno" },
    question: { thai: "มีอาชีพไหม", es: "mii aa-chìip mǎi", spanish: "¿Hay profesión?" },
    answer: { thai: "มีอาชีพ", es: "mii aa-chìip", spanish: "Sí, hay profesión" }
  },
  {
    rank: 935, thai: "เงิน", es: "ngən", spanish: "dinero", english: "money", rtgs: "", cefr: null, freq: 935, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เงินดี", es: "ngən dii", spanish: "dinero bueno" },
    question: { thai: "มีเงินไหม", es: "mii ngən mǎi", spanish: "¿Hay dinero?" },
    answer: { thai: "มีเงิน", es: "mii ngən", spanish: "Sí, hay dinero" }
  },
  {
    rank: 936, thai: "เงินเดือน", es: "ngən-duean", spanish: "salario", english: "salary", rtgs: "", cefr: null, freq: 936, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เงินเดือนดี", es: "ngən-duean dii", spanish: "salario bueno" },
    question: { thai: "มีเงินเดือนไหม", es: "mii ngən-duean mǎi", spanish: "¿Hay salario?" },
    answer: { thai: "มีเงินเดือน", es: "mii ngən-duean", spanish: "Sí, hay salario" }
  },
  {
    rank: 937, thai: "รายได้", es: "raai-dâai", spanish: "ingreso", english: "income", rtgs: "", cefr: null, freq: 937, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "รายได้ดี", es: "raai-dâai dii", spanish: "ingreso bueno" },
    question: { thai: "มีรายได้ไหม", es: "mii raai-dâai mǎi", spanish: "¿Hay ingreso?" },
    answer: { thai: "มีรายได้", es: "mii raai-dâai", spanish: "Sí, hay ingreso" }
  },
  {
    rank: 938, thai: "ราคา", es: "raa-khaa", spanish: "precio", english: "price", rtgs: "", cefr: null, freq: 938, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ราคาดี", es: "raa-khaa dii", spanish: "precio bueno" },
    question: { thai: "มีราคาไหม", es: "mii raa-khaa mǎi", spanish: "¿Hay precio?" },
    answer: { thai: "มีราคา", es: "mii raa-khaa", spanish: "Sí, hay precio" }
  },
  {
    rank: 939, thai: "ค่า", es: "khâa", spanish: "valor/costo", english: "value/cost", rtgs: "", cefr: null, freq: 939, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "ค่าดี", es: "khâa dii", spanish: "valor/costo bueno" },
    question: { thai: "มีค่าไหม", es: "mii khâa mǎi", spanish: "¿Hay valor/costo?" },
    answer: { thai: "มีค่า", es: "mii khâa", spanish: "Sí, hay valor/costo" }
  },
  {
    rank: 940, thai: "ภาษี", es: "phaa-sǐi", spanish: "impuesto", english: "tax", rtgs: "", cefr: null, freq: 940, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ภาษีดี", es: "phaa-sǐi dii", spanish: "impuesto bueno" },
    question: { thai: "มีภาษีไหม", es: "mii phaa-sǐi mǎi", spanish: "¿Hay impuesto?" },
    answer: { thai: "มีภาษี", es: "mii phaa-sǐi", spanish: "Sí, hay impuesto" }
  },
  {
    rank: 941, thai: "ใบเสร็จ", es: "bai-sèt", spanish: "recibo", english: "receipt", rtgs: "", cefr: null, freq: 941, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ใบเสร็จดี", es: "bai-sèt dii", spanish: "recibo bueno" },
    question: { thai: "มีใบเสร็จไหม", es: "mii bai-sèt mǎi", spanish: "¿Hay recibo?" },
    answer: { thai: "มีใบเสร็จ", es: "mii bai-sèt", spanish: "Sí, hay recibo" }
  },
  {
    rank: 942, thai: "ส่วนลด", es: "sùan-lót", spanish: "descuento", english: "discount", rtgs: "", cefr: null, freq: 942, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ส่วนลดดี", es: "sùan-lót dii", spanish: "descuento bueno" },
    question: { thai: "มีส่วนลดไหม", es: "mii sùan-lót mǎi", spanish: "¿Hay descuento?" },
    answer: { thai: "มีส่วนลด", es: "mii sùan-lót", spanish: "Sí, hay descuento" }
  },
  {
    rank: 943, thai: "เงินทอน", es: "ngən-thon", spanish: "cambio (dinero)", english: "change", rtgs: "", cefr: null, freq: 943, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "เงินทอนดี", es: "ngən-thon dii", spanish: "cambio (dinero) bueno" },
    question: { thai: "มีเงินทอนไหม", es: "mii ngən-thon mǎi", spanish: "¿Hay cambio (dinero)?" },
    answer: { thai: "มีเงินทอน", es: "mii ngən-thon", spanish: "Sí, hay cambio (dinero)" }
  },
  {
    rank: 944, thai: "บาท", es: "bàat", spanish: "baht", english: "baht", rtgs: "", cefr: null, freq: 944, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "บาทดี", es: "bàat dii", spanish: "baht bueno" },
    question: { thai: "มีบาทไหม", es: "mii bàat mǎi", spanish: "¿Hay baht?" },
    answer: { thai: "มีบาท", es: "mii bàat", spanish: "Sí, hay baht" }
  },
  {
    rank: 945, thai: "ดอลลาร์", es: "dan-laa", spanish: "dólar", english: "dollar", rtgs: "", cefr: null, freq: 945, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ดอลลาร์ดี", es: "dan-laa dii", spanish: "dólar bueno" },
    question: { thai: "มีดอลลาร์ไหม", es: "mii dan-laa mǎi", spanish: "¿Hay dólar?" },
    answer: { thai: "มีดอลลาร์", es: "mii dan-laa", spanish: "Sí, hay dólar" }
  },
  {
    rank: 946, thai: "ยูโร", es: "yuu-roo", spanish: "euro", english: "euro", rtgs: "", cefr: null, freq: 946, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ยูโรดี", es: "yuu-roo dii", spanish: "euro bueno" },
    question: { thai: "มียูโรไหม", es: "mii yuu-roo mǎi", spanish: "¿Hay euro?" },
    answer: { thai: "มียูโร", es: "mii yuu-roo", spanish: "Sí, hay euro" }
  },
  {
    rank: 947, thai: "เหรียญ", es: "rǐan", spanish: "moneda", english: "coin", rtgs: "", cefr: null, freq: 947, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เหรียญดี", es: "rǐan dii", spanish: "moneda bueno" },
    question: { thai: "มีเหรียญไหม", es: "mii rǐan mǎi", spanish: "¿Hay moneda?" },
    answer: { thai: "มีเหรียญ", es: "mii rǐan", spanish: "Sí, hay moneda" }
  },
  {
    rank: 948, thai: "ธนบัตร", es: "thá-ná-bàt", spanish: "billete", english: "banknote", rtgs: "", cefr: null, freq: 948, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "ธนบัตรดี", es: "thá-ná-bàt dii", spanish: "billete bueno" },
    question: { thai: "มีธนบัตรไหม", es: "mii thá-ná-bàt mǎi", spanish: "¿Hay billete?" },
    answer: { thai: "มีธนบัตร", es: "mii thá-ná-bàt", spanish: "Sí, hay billete" }
  },
  {
    rank: 949, thai: "กระเป๋า", es: "grà-bpǎo", spanish: "bolso", english: "bag", rtgs: "", cefr: null, freq: 949, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "กระเป๋าดี", es: "grà-bpǎo dii", spanish: "bolso bueno" },
    question: { thai: "มีกระเป๋าไหม", es: "mii grà-bpǎo mǎi", spanish: "¿Hay bolso?" },
    answer: { thai: "มีกระเป๋า", es: "mii grà-bpǎo", spanish: "Sí, hay bolso" }
  },
  {
    rank: 950, thai: "รองเท้า", es: "rong-tháo", spanish: "zapatos", english: "shoes", rtgs: "", cefr: null, freq: 950, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "รองเท้าดี", es: "rong-tháo dii", spanish: "zapatos bueno" },
    question: { thai: "มีรองเท้าไหม", es: "mii rong-tháo mǎi", spanish: "¿Hay zapatos?" },
    answer: { thai: "มีรองเท้า", es: "mii rong-tháo", spanish: "Sí, hay zapatos" }
  },
  {
    rank: 951, thai: "เสื้อ", es: "sǔea", spanish: "camisa", english: "shirt", rtgs: "", cefr: null, freq: 951, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "เสื้อดี", es: "sǔea dii", spanish: "camisa bueno" },
    question: { thai: "มีเสื้อไหม", es: "mii sǔea mǎi", spanish: "¿Hay camisa?" },
    answer: { thai: "มีเสื้อ", es: "mii sǔea", spanish: "Sí, hay camisa" }
  },
  {
    rank: 952, thai: "กางเกง", es: "gaang-keng", spanish: "pantalones", english: "pants", rtgs: "", cefr: null, freq: 952, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "กางเกงดี", es: "gaang-keng dii", spanish: "pantalones bueno" },
    question: { thai: "มีกางเกงไหม", es: "mii gaang-keng mǎi", spanish: "¿Hay pantalones?" },
    answer: { thai: "มีกางเกง", es: "mii gaang-keng", spanish: "Sí, hay pantalones" }
  },
  {
    rank: 953, thai: "หมวก", es: "màk", spanish: "sombrero", english: "hat", rtgs: "", cefr: null, freq: 953, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "หมวกดี", es: "màk dii", spanish: "sombrero bueno" },
    question: { thai: "มีหมวกไหม", es: "mii màk mǎi", spanish: "¿Hay sombrero?" },
    answer: { thai: "มีหมวก", es: "mii màk", spanish: "Sí, hay sombrero" }
  },
  {
    rank: 954, thai: "นาฬิกา", es: "naa-lí-gaa", spanish: "reloj", english: "clock/watch", rtgs: "", cefr: null, freq: 954, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "นาฬิกาดี", es: "naa-lí-gaa dii", spanish: "reloj bueno" },
    question: { thai: "มีนาฬิกาไหม", es: "mii naa-lí-gaa mǎi", spanish: "¿Hay reloj?" },
    answer: { thai: "มีนาฬิกา", es: "mii naa-lí-gaa", spanish: "Sí, hay reloj" }
  },
  {
    rank: 955, thai: "แว่นตา", es: "wàaen-dtaa", spanish: "gafas", english: "glasses", rtgs: "", cefr: null, freq: 955, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "แว่นตาดี", es: "wàaen-dtaa dii", spanish: "gafas bueno" },
    question: { thai: "มีแว่นตาไหม", es: "mii wàaen-dtaa mǎi", spanish: "¿Hay gafas?" },
    answer: { thai: "มีแว่นตา", es: "mii wàaen-dtaa", spanish: "Sí, hay gafas" }
  },
  {
    rank: 956, thai: "ร่ม", es: "rôm", spanish: "paraguas", english: "umbrella", rtgs: "", cefr: null, freq: 956, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "ร่มดี", es: "rôm dii", spanish: "paraguas bueno" },
    question: { thai: "มีร่มไหม", es: "mii rôm mǎi", spanish: "¿Hay paraguas?" },
    answer: { thai: "มีร่ม", es: "mii rôm", spanish: "Sí, hay paraguas" }
  },
  {
    rank: 957, thai: "โทรศัพท์", es: "thoo-rá-sàp", spanish: "teléfono", english: "telephone", rtgs: "", cefr: null, freq: 957, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "โทรศัพท์ดี", es: "thoo-rá-sàp dii", spanish: "teléfono bueno" },
    question: { thai: "มีโทรศัพท์ไหม", es: "mii thoo-rá-sàp mǎi", spanish: "¿Hay teléfono?" },
    answer: { thai: "มีโทรศัพท์", es: "mii thoo-rá-sàp", spanish: "Sí, hay teléfono" }
  },
  {
    rank: 958, thai: "คอมพิวเตอร์", es: "khom-phíu-dtooe", spanish: "ordenador", english: "computer", rtgs: "", cefr: null, freq: 958, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "คอมพิวเตอร์ดี", es: "khom-phíu-dtooe dii", spanish: "ordenador bueno" },
    question: { thai: "มีคอมพิวเตอร์ไหม", es: "mii khom-phíu-dtooe mǎi", spanish: "¿Hay ordenador?" },
    answer: { thai: "มีคอมพิวเตอร์", es: "mii khom-phíu-dtooe", spanish: "Sí, hay ordenador" }
  },
  {
    rank: 959, thai: "อินเทอร์เน็ต", es: "in-thooe-nèt", spanish: "internet", english: "internet", rtgs: "", cefr: null, freq: 959, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อินเทอร์เน็ตดี", es: "in-thooe-nèt dii", spanish: "internet bueno" },
    question: { thai: "มีอินเทอร์เน็ตไหม", es: "mii in-thooe-nèt mǎi", spanish: "¿Hay internet?" },
    answer: { thai: "มีอินเทอร์เน็ต", es: "mii in-thooe-nèt", spanish: "Sí, hay internet" }
  },
  {
    rank: 960, thai: "อีเมล", es: "ii-meeo", spanish: "correo electrónico", english: "email", rtgs: "", cefr: null, freq: 960, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "อีเมลดี", es: "ii-meeo dii", spanish: "correo electrónico bueno" },
    question: { thai: "มีอีเมลไหม", es: "mii ii-meeo mǎi", spanish: "¿Hay correo electrónico?" },
    answer: { thai: "มีอีเมล", es: "mii ii-meeo", spanish: "Sí, hay correo electrónico" }
  },
  {
    rank: 961, thai: "เว็บไซต์", es: "wép-sài", spanish: "sitio web", english: "website", rtgs: "", cefr: null, freq: 961, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "เว็บไซต์ดี", es: "wép-sài dii", spanish: "sitio web bueno" },
    question: { thai: "มีเว็บไซต์ไหม", es: "mii wép-sài mǎi", spanish: "¿Hay sitio web?" },
    answer: { thai: "มีเว็บไซต์", es: "mii wép-sài", spanish: "Sí, hay sitio web" }
  },
  {
    rank: 962, thai: "สงคราม", es: "sǒng-khraam", spanish: "guerra", english: "war", rtgs: "", cefr: null, freq: 962, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "สงครามดี", es: "sǒng-khraam dii", spanish: "guerra bueno" },
    question: { thai: "มีสงครามไหม", es: "mii sǒng-khraam mǎi", spanish: "¿Hay guerra?" },
    answer: { thai: "มีสงคราม", es: "mii sǒng-khraam", spanish: "Sí, hay guerra" }
  },
  {
    rank: 963, thai: "คุณสมบัติ", es: "khun-sǒm-bàt", spanish: "propiedad", english: "property", rtgs: "", cefr: null, freq: 963, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "คุณสมบัติดี", es: "khun-sǒm-bàt dii", spanish: "propiedad bueno" },
    question: { thai: "มีคุณสมบัติไหม", es: "mii khun-sǒm-bàt mǎi", spanish: "¿Hay propiedad?" },
    answer: { thai: "มีคุณสมบัติ", es: "mii khun-sǒm-bàt", spanish: "Sí, hay propiedad" }
  },
  {
    rank: 964, thai: "สำรวจ", es: "sǎm-rùuat", spanish: "inspeccionar", english: "survey", rtgs: "", cefr: null, freq: 964, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันสำรวจ", es: "chǎn sǎm-rùuat", spanish: "Yo inspecciono" },
    question: { thai: "คุณสำรวจไหม", es: "khun sǎm-rùuat mǎi", spanish: "¿inspeccionar?" },
    answer: { thai: "สำรวจ", es: "sǎm-rùuat", spanish: "inspeccionar" }
  },
  {
    rank: 965, thai: "แตก", es: "dtàaek", spanish: "romper", english: "break", rtgs: "", cefr: null, freq: 965, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันแตก", es: "chǎn dtàaek", spanish: "Yo rompo" },
    question: { thai: "คุณแตกไหม", es: "khun dtàaek mǎi", spanish: "¿romper?" },
    answer: { thai: "แตก", es: "dtàaek", spanish: "romper" }
  },
  {
    rank: 966, thai: "เชิญ", es: "chəəi", spanish: "invitar", english: "invite", rtgs: "", cefr: null, freq: 966, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันเชิญ", es: "chǎn chəəi", spanish: "Yo invito" },
    question: { thai: "คุณเชิญไหม", es: "khun chəəi mǎi", spanish: "¿invitar?" },
    answer: { thai: "เชิญ", es: "chəəi", spanish: "invitar" }
  },
  {
    rank: 967, thai: "จากนั้น", es: "jàak-nán", spanish: "luego/después", english: "after that", rtgs: "", cefr: null, freq: 967, notes: "",
    category: "adverbios", tone: "m",
    phrase: { thai: "จากนั้นผมก็กลับบ้าน", es: "jàak-nán phǒm gâw glàp bâan", spanish: "luego yo volví a casa, en: "then I went home" },
    question: { thai: "จากนั้นไหม", es: "jàak-nán mǎi", spanish: "¿luego/después?" },
    answer: { thai: "จากนั้น", es: "jàak-nán", spanish: "luego/después" }
  },
  {
    rank: 968, thai: "วิทยาศาสตร์", es: "wít-tha-yaa-sàat", spanish: "ciencia", english: "science", rtgs: "", cefr: null, freq: 968, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "วิทยาศาสตร์ดี", es: "wít-tha-yaa-sàat dii", spanish: "ciencia bueno" },
    question: { thai: "มีวิทยาศาสตร์ไหม", es: "mii wít-tha-yaa-sàat mǎi", spanish: "¿Hay ciencia?" },
    answer: { thai: "มีวิทยาศาสตร์", es: "mii wít-tha-yaa-sàat", spanish: "Sí, hay ciencia" }
  },
  {
    rank: 969, thai: "อิสระ", es: "ìt-sà-rà", spanish: "libertad", english: "freedom", rtgs: "", cefr: null, freq: 969, notes: "",
    category: "sustantivos", tone: "r",
    phrase: { thai: "อิสระดี", es: "ìt-sà-rà dii", spanish: "libertad bueno" },
    question: { thai: "มีอิสระไหม", es: "mii ìt-sà-rà mǎi", spanish: "¿Hay libertad?" },
    answer: { thai: "มีอิสระ", es: "mii ìt-sà-rà", spanish: "Sí, hay libertad" }
  },
  {
    rank: 970, thai: "รอย", es: "rooi", spanish: "marca/huella", english: "mark/trace", rtgs: "", cefr: null, freq: 970, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "รอยดี", es: "rooi dii", spanish: "marca/huella bueno" },
    question: { thai: "มีรอยไหม", es: "mii rooi mǎi", spanish: "¿Hay marca/huella?" },
    answer: { thai: "มีรอย", es: "mii rooi", spanish: "Sí, hay marca/huella" }
  },
  {
    rank: 971, thai: "อิน", es: "in", spanish: "on (inglés)", english: "on", rtgs: "", cefr: null, freq: 971, notes: "",
    category: "expresiones", tone: "m",
    phrase: { thai: "ล็อกอินเข้าระบบ", es: "lók-in khâo rá-sòp", spanish: "iniciar sesión, en: "log in" },
    question: { thai: "อินไหม", es: "in mǎi", spanish: "¿on (inglés)?" },
    answer: { thai: "อิน", es: "in", spanish: "on (inglés)" }
  },
  {
    rank: 972, thai: "กลัว", es: "glua", spanish: "temer", english: "fear", rtgs: "", cefr: null, freq: 972, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันกลัว", es: "chǎn glua", spanish: "Yo temo" },
    question: { thai: "คุณกลัวไหม", es: "khun glua mǎi", spanish: "¿temer?" },
    answer: { thai: "กลัว", es: "glua", spanish: "temer" }
  },
  {
    rank: 973, thai: "เครื่อง", es: "krûeang", spanish: "máquina/aparato", english: "machine/device", rtgs: "", cefr: null, freq: 973, notes: "",
    category: "sustantivos", tone: "h",
    phrase: { thai: "เครื่องดี", es: "krûeang dii", spanish: "máquina/aparato bueno" },
    question: { thai: "มีเครื่องไหม", es: "mii krûeang mǎi", spanish: "¿Hay máquina/aparato?" },
    answer: { thai: "มีเครื่อง", es: "mii krûeang", spanish: "Sí, hay máquina/aparato" }
  },
  {
    rank: 974, thai: "ช่วยเหลือ", es: "chúai-luea", spanish: "ayudar (formal)", english: "help (formal)", rtgs: "", cefr: null, freq: 974, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันช่วยเหลือ", es: "chǎn chûai-lǔea", spanish: "Yo ayudo (formal)" },
    question: { thai: "คุณช่วยเหลือไหม", es: "khun chûai-lǔea mǎi", spanish: "¿ayudar (formal)?" },
    answer: { thai: "ช่วยเหลือ", es: "chûai-lǔea", spanish: "ayudar (formal)" }
  },
  {
    rank: 975, thai: "ได้ยิน", es: "dâai-yin", spanish: "oír", english: "hear", rtgs: "", cefr: null, freq: 975, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันได้ยิน", es: "chǎn dâai-yin", spanish: "Yo oír" },
    question: { thai: "คุณได้ยินไหม", es: "khun dâai-yin mǎi", spanish: "¿oír?" },
    answer: { thai: "ได้ยิน", es: "dâai-yin", spanish: "oír" }
  },
  {
    rank: 976, thai: "สนใจ", es: "sǎ-jai", spanish: "interesarse", english: "be interested", rtgs: "", cefr: null, freq: 976, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันสนใจ", es: "chǎn sǎ-jai", spanish: "Yo interesarse" },
    question: { thai: "คุณสนใจไหม", es: "khun sǎ-jai mǎi", spanish: "¿interesarse?" },
    answer: { thai: "สนใจ", es: "sǎ-jai", spanish: "interesarse" }
  },
  {
    rank: 977, thai: "จำ", es: "jam", spanish: "recordar", english: "remember", rtgs: "", cefr: null, freq: 977, notes: "",
    category: "verbos", tone: "m",
    phrase: { thai: "ฉันจำ", es: "chǎn jam", spanish: "Yo recuerdo" },
    question: { thai: "คุณจำไหม", es: "khun jam mǎi", spanish: "¿recordar?" },
    answer: { thai: "จำ", es: "jam", spanish: "recordar" }
  },
  {
    rank: 978, thai: "อังกฤษ", es: "ang-grìt", spanish: "inglés (idioma)", english: "English (language)", rtgs: "", cefr: null, freq: 978, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "อังกฤษดี", es: "ang-grìt dii", spanish: "inglés (idioma) bueno" },
    question: { thai: "มีอังกฤษไหม", es: "mii ang-grìt mǎi", spanish: "¿Hay inglés (idioma)?" },
    answer: { thai: "มีอังกฤษ", es: "mii ang-grìt", spanish: "Sí, hay inglés (idioma)" }
  },
  {
    rank: 979, thai: "สี่", es: "sìi", spanish: "cuatro", english: "four", rtgs: "", cefr: null, freq: 979, notes: "",
    category: "números", tone: "l",
    phrase: { thai: "สี่คน", es: "sìi khon", spanish: "cuatro personas, en: "four people" },
    question: { thai: "สี่ไหม", es: "sìi mǎi", spanish: "¿cuatro?" },
    answer: { thai: "สี่", es: "sìi", spanish: "cuatro" }
  },
  {
    rank: 980, thai: "นึก", es: "nûek", spanish: "pensar (para sí)", english: "think to oneself", rtgs: "", cefr: null, freq: 980, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันนึก", es: "chǎn núek", spanish: "Yo pienso (para sí)" },
    question: { thai: "คุณนึกไหม", es: "khun núek mǎi", spanish: "¿pensar (para sí)?" },
    answer: { thai: "นึก", es: "núek", spanish: "pensar (para sí)" }
  },
  {
    rank: 981, thai: "นับ", es: "nâp", spanish: "contar", english: "count", rtgs: "", cefr: null, freq: 981, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันนับ", es: "chǎn náp", spanish: "Yo cuento" },
    question: { thai: "คุณนับไหม", es: "khun náp mǎi", spanish: "¿contar?" },
    answer: { thai: "นับ", es: "náp", spanish: "contar" }
  },
  {
    rank: 982, thai: "ร้อง", es: "rông", spanish: "cantar/gritar", english: "sing/shout", rtgs: "", cefr: null, freq: 982, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันร้อง", es: "chǎn róng", spanish: "Yo canto/grito" },
    question: { thai: "คุณร้องไหม", es: "khun róng mǎi", spanish: "¿cantar/gritar?" },
    answer: { thai: "ร้อง", es: "róng", spanish: "cantar/gritar" }
  },
  {
    rank: 983, thai: "ตก", es: "tòk", spanish: "caer", english: "fall", rtgs: "", cefr: null, freq: 983, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันตก", es: "chǎn tòk", spanish: "Yo caigo" },
    question: { thai: "คุณตกไหม", es: "khun tòk mǎi", spanish: "¿caer?" },
    answer: { thai: "ตก", es: "tòk", spanish: "caer" }
  },
  {
    rank: 984, thai: "แบ่ง", es: "báeng", spanish: "dividir", english: "divide", rtgs: "", cefr: null, freq: 984, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันแบ่ง", es: "chǎn bàeng", spanish: "Yo divido" },
    question: { thai: "คุณแบ่งไหม", es: "khun bàeng mǎi", spanish: "¿dividir?" },
    answer: { thai: "แบ่ง", es: "bàeng", spanish: "dividir" }
  },
  {
    rank: 985, thai: "หัวเราะ", es: "hǔa-rô", spanish: "reír", english: "laugh", rtgs: "", cefr: null, freq: 985, notes: "",
    category: "verbos", tone: "r",
    phrase: { thai: "ฉันหัวเราะ", es: "chǎn hǔa-ró", spanish: "Yo reír" },
    question: { thai: "คุณหัวเราะไหม", es: "khun hǔa-ró mǎi", spanish: "¿reír?" },
    answer: { thai: "หัวเราะ", es: "hǔa-ró", spanish: "reír" }
  },
  {
    rank: 986, thai: "เน้น", es: "nêen", spanish: "enfatizar", english: "emphasize", rtgs: "", cefr: null, freq: 986, notes: "",
    category: "verbos", tone: "h",
    phrase: { thai: "ฉันเน้น", es: "chǎn nêen", spanish: "Yo enfatizo" },
    question: { thai: "คุณเน้นไหม", es: "khun nêen mǎi", spanish: "¿enfatizar?" },
    answer: { thai: "เน้น", es: "nêen", spanish: "enfatizar" }
  },
  {
    rank: 987, thai: "ดำ", es: "dam", spanish: "negro/bucear", english: "black/dive", rtgs: "", cefr: null, freq: 987, notes: "",
    category: "adjetivos", tone: "m",
    phrase: { thai: "ดำมาก", es: "dam mâak", spanish: "Muy negro/bucear" },
    question: { thai: "ดำไหม", es: "dam mǎi", spanish: "¿negro/bucear?" },
    answer: { thai: "ดำ", es: "dam", spanish: "negro/bucear" }
  },
  {
    rank: 988, thai: "ชัดเจน", es: "chât-jeen", spanish: "claro", english: "clear", rtgs: "", cefr: null, freq: 988, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "ชัดเจนมาก", es: "chát-jen mâak", spanish: "Muy claro" },
    question: { thai: "ชัดเจนไหม", es: "chát-jen mǎi", spanish: "¿claro?" },
    answer: { thai: "ชัดเจน", es: "chát-jen", spanish: "claro" }
  },
  {
    rank: 989, thai: "สุดท้าย", es: "sùt-thâai", spanish: "último/final", english: "last/final", rtgs: "", cefr: null, freq: 989, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "สุดท้ายมาก", es: "sùt-thǎai mâak", spanish: "Muy último/final" },
    question: { thai: "สุดท้ายไหม", es: "sùt-thǎai mǎi", spanish: "¿último/final?" },
    answer: { thai: "สุดท้าย", es: "sùt-thǎai", spanish: "último/final" }
  },
  {
    rank: 990, thai: "เหตุผล", es: "héet-pǒn", spanish: "razón", english: "reason", rtgs: "", cefr: null, freq: 990, notes: "",
    category: "sustantivos", tone: "f",
    phrase: { thai: "เหตุผลดี", es: "hèet-phǒen dii", spanish: "razón bueno" },
    question: { thai: "มีเหตุผลไหม", es: "mii hèet-phǒen mǎi", spanish: "¿Hay razón?" },
    answer: { thai: "มีเหตุผล", es: "mii hèet-phǒen", spanish: "Sí, hay razón" }
  },
  {
    rank: 991, thai: "ทอง", es: "thong", spanish: "oro", english: "gold", rtgs: "", cefr: null, freq: 991, notes: "",
    category: "sustantivos", tone: "m",
    phrase: { thai: "ทองดี", es: "thong dii", spanish: "oro bueno" },
    question: { thai: "มีทองไหม", es: "mii thong mǎi", spanish: "¿Hay oro?" },
    answer: { thai: "มีทอง", es: "mii thong", spanish: "Sí, hay oro" }
  },
  {
    rank: 992, thai: "ต่างประเทศ", es: "tàang-bprà-théet", spanish: "extranjero", english: "foreign/abroad", rtgs: "", cefr: null, freq: 992, notes: "",
    category: "sustantivos", tone: "l",
    phrase: { thai: "ต่างประเทศดี", es: "tàang-bprà-thâayt dii", spanish: "extranjero bueno" },
    question: { thai: "มีต่างประเทศไหม", es: "mii tàang-bprà-thâayt mǎi", spanish: "¿Hay extranjero?" },
    answer: { thai: "มีต่างประเทศ", es: "mii tàang-bprà-thâayt", spanish: "Sí, hay extranjero" }
  },
  {
    rank: 993, thai: "ทั่วไป", es: "thúa-bpai", spanish: "general", english: "general", rtgs: "", cefr: null, freq: 993, notes: "",
    category: "adjetivos", tone: "f",
    phrase: { thai: "ทั่วไปมาก", es: "thûa-gài mâak", spanish: "Muy general" },
    question: { thai: "ทั่วไปไหม", es: "thûa-gài mǎi", spanish: "¿general?" },
    answer: { thai: "ทั่วไป", es: "thûa-gài", spanish: "general" }
  },
  {
    rank: 994, thai: "มากมาย", es: "mâak-maai", spanish: "abundante", english: "plentiful", rtgs: "", cefr: null, freq: 994, notes: "",
    category: "adjetivos", tone: "h",
    phrase: { thai: "มากมายมาก", es: "mâak-maai mâak", spanish: "Muy abundante" },
    question: { thai: "มากมายไหม", es: "mâak-maai mǎi", spanish: "¿abundante?" },
    answer: { thai: "มากมาย", es: "mâak-maai", spanish: "abundante" }
  },
  {
    rank: 995, thai: "เหนือ", es: "nǔea", spanish: "norte/arriba", english: "north/above", rtgs: "", cefr: null, freq: 995, notes: "",
    category: "adverbios", tone: "r",
    phrase: { thai: "เดินทางขึ้นเหนือ", es: "dooen-thaang khʉ̂n nǔea", spanish: "viajar al norte, en: "travel up north" },
    question: { thai: "เหนือไหม", es: "nǔea mǎi", spanish: "¿norte/arriba?" },
    answer: { thai: "เหนือ", es: "nǔea", spanish: "norte/arriba" }
  },
  {
    rank: 996, thai: "สุด", es: "sùt", spanish: "extremo/lo más", english: "most/utmost", rtgs: "", cefr: null, freq: 996, notes: "",
    category: "adverbios", tone: "l",
    phrase: { thai: "สุดยอดเลย", es: "sùt-yòot looei", spanish: "¡es el mejor!, en: "it's the best!" },
    question: { thai: "สุดไหม", es: "sùt mǎi", spanish: "¿extremo/lo más?" },
    answer: { thai: "สุด", es: "sùt", spanish: "extremo/lo más" }
  },
  {
    rank: 997, thai: "เหรอ", es: "rǎeo", spanish: "partícula interrogativa", english: "question particle", rtgs: "", cefr: null, freq: 997, notes: "",
    category: "expresiones", tone: "r",
    phrase: { thai: "ไม่สบายเหรอ", es: "mâi sà-baai rǎeo", spanish: "¿Estás enfermo?" },
    question: { thai: "คุณไม่สบายเหรอ", es: "khun mâi sà-baai rǎeo", spanish: "¿Estás enfermo tú?" },
    answer: { thai: "ไม่เป็นอะไร", es: "mâi bpen a-rai", spanish: "No es nada" }
  },
  {
    rank: 998, thai: "แน่", es: "náae", spanish: "seguro/definitivo", english: "certain", rtgs: "", cefr: null, freq: 998, notes: "",
    category: "adverbios", tone: "f",
    phrase: { thai: "ใช่แน่ๆ", es: "châi nâae-nâae", spanish: "seguro que sí, en: "absolutely sure" },
    question: { thai: "แน่ไหม", es: "nâae mǎi", spanish: "¿seguro/definitivo?" },
    answer: { thai: "แน่", es: "nâae", spanish: "seguro/definitivo" }
  },
  {
    rank: 999, thai: "เกี่ยวข้อง", es: "gìao-khóong", spanish: "relacionado con", english: "related to", rtgs: "", cefr: null, freq: 999, notes: "",
    category: "verbos", tone: "l",
    phrase: { thai: "ฉันเกี่ยวข้อง", es: "chǎn gìao-khǒong", spanish: "Yo relacionado con" },
    question: { thai: "คุณเกี่ยวข้องไหม", es: "khun gìao-khǒong mǎi", spanish: "¿relacionado con?" },
    answer: { thai: "เกี่ยวข้อง", es: "gìao-khǒong", spanish: "relacionado con" }
  },
  {
    rank: 1000, thai: "แยก", es: "yáaek", spanish: "separar", english: "separate", rtgs: "", cefr: null, freq: 1000, notes: "",
    category: "verbos", tone: "f",
    phrase: { thai: "ฉันแยก", es: "chǎn yâaek", spanish: "Yo separo" },
    question: { thai: "คุณแยกไหม", es: "khun yâaek mǎi", spanish: "¿separar?" },
    answer: { thai: "แยก", es: "yâaek", spanish: "separar" }
  },
];

// ============================================================
// TOP1000 — 4-dataset model (Pareto course)
// Targets: 1000 words | 200 structures | 2000+ phrases | many conversations
// Sources: Chula corpus (words), Tatoeba API (phrases, future), Chula spreadsheet (meanings/examples)
// ============================================================

var TOP1000_CATEGORIES = ['expresiones', 'pronombres', 'verbos', 'sustantivos', 'adjetivos', 'adverbios'];

var TOP1000_STRUCTURE_CATEGORIES = [
  'preguntas', 'negación', 'tiempo', 'aspecto', 'modales', 'conectores',
  'comparación', 'condicionales', 'partículas', 'clasificadores',
  'serial-verbs', 'dirección', 'énfasis', 'cortesía', 'conversación'
];

var TOP1000_SITUATIONS = [
  'cafetería', 'restaurante', 'taxi', 'hotel', 'aeropuerto', 'trabajo',
  'amigos', 'citas', 'familia', 'gimnasio', 'boxeo', 'playa', 'surf',
  'compras', 'hospital', 'policía', 'transporte', 'mercado',
  'Tailandia rural', 'Bangkok'
];

// ===== Estructuras gramaticales (target: 200, seed: 8) =====
var TOP1000_STRUCTURES = [
  {
    id: 1, name: "Pregunta sí/no con ไหม", category: "preguntas", importance: 5,
    explanation: "La partícula ไหม al final de una frase afirmativa la convierte en pregunta sí/no.",
    when: "Preguntas neutras en presente o futuro. Informal.",
    mistakes: "Usar ไหม después de una frase ya negada (debe usarse ใช่ไหม). Confundir ไหม (partícula de pregunta) con ไม่ (negación) — suenan parecido pero tienen tono distinto.",
    colloquial: "En habla rápida, ไหม se contrae a มั้ย (mái).",
    examples: [
      { thai: "คุณไปไหม", rtgs: "khun bpai mǎi", spanish: "¿Vas?", english: "Are you going?" },
      { thai: "อร่อยไหม", rtgs: "a-ròi mǎi", spanish: "¿Está rico?", english: "Is it delicious?" },
      { thai: "มีไหม", rtgs: "mii mǎi", spanish: "¿Hay?", english: "Is there?" },
      { thai: "เข้าใจไหม", rtgs: "kâo-jai mǎi", spanish: "¿Entiendes?", english: "Do you understand?" },
      { thai: "พรุ่งนี้ว่างไหม", rtgs: "prùng-níi wâang mǎi", spanish: "¿Estás libre mañana?", english: "Are you free tomorrow?" }
    ]
  },
  {
    id: 2, name: "Negación con ไม่", category: "negación", importance: 5,
    explanation: "ไม่ va delante del verbo que se niega.",
    when: "Negar acciones, estados o cualidades en presente/futuro.",
    mistakes: "Colocar ไม่ después del verbo (orden español). Olvidar la asimilación tonal: ไม่ (tono alto) cambia a tono descendente cuando la siguiente sílaba lleva tono bajo o descendente (ej: ไม่ใช่ 'mâi-châi', ไม่ว่าง 'mâi-wâang').",
    colloquial: "En habla rápida ไม่ mantiene su forma; no se reduce. La negación enfática se marca con ไม่ใช่ (no es que) o ไม่ได้ (no poder/no haber).",
    examples: [
      { thai: "ไม่ไป", rtgs: "mâi bpai", spanish: "No voy", english: "Not going" },
      { thai: "ไม่ดี", rtgs: "mâi dii", spanish: "No es bueno", english: "Not good" },
      { thai: "ไม่เข้าใจ", rtgs: "mâi kâo-jai", spanish: "No entiendo", english: "I don't understand" },
      { thai: "ไม่มี", rtgs: "mâi mii", spanish: "No hay / No tengo", english: "There isn't / I don't have" },
      { thai: "ไม่ว่าง", rtgs: "mâi wâang", spanish: "No estoy libre", english: "I'm not free" }
    ]
  },
  {
    id: 3, name: "Futuro con จะ", category: "tiempo", importance: 5,
    explanation: "จะ va delante del verbo para marcar futuro o intención.",
    when: "Acciones futuras, planes, promesas.",
    mistakes: "Conjugar el verbo (en tailandés no se conjuga). Olvidar จะ en frases con 'mañana' asumiendo que el contexto basta.",
    colloquial: "En habla informal, จะ puede asimilarse a la sílaba siguiente (ej: 'จะไป' suena 'ja-bpai').",
    examples: [
      { thai: "พรุ่งนี้จะไป", rtgs: "prùng-níi jà bpai", spanish: "Mañana iré", english: "Tomorrow I'll go" },
      { thai: "จะกินข้าว", rtgs: "jà gin kâao", spanish: "Voy a comer", english: "I'll eat" },
      { thai: "จะโทรหา", rtgs: "jà too hǎa", spanish: "Llamaré", english: "I'll call" },
      { thai: "จะมาอีก", rtgs: "jà maa èek", spanish: "Vendré de nuevo", english: "I'll come again" },
      { thai: "อาทิตย์หน้าเจอกัน", rtgs: "aa-thít nâa joo gan", spanish: "La semana que viene nos vemos", english: "See you next week" }
    ]
  },
  {
    id: 4, name: "Pasado / cambio con แล้ว", category: "aspecto", importance: 5,
    explanation: "แล้ว al final marca que la acción ocurrió o que hay un cambio de estado.",
    when: "Acciones completadas, anuncios de cambio ('ya voy', 'ya llegué').",
    mistakes: "Poner แล้ว delante del verbo. Confundir con el แล้ว de coordinación ('y entonces').",
    colloquial: "En respuestas cortas funciona como 'ya está': 'แล้ว' = 'listo'.",
    examples: [
      { thai: "กินแล้ว", rtgs: "gin láew", spanish: "Ya comí", english: "Already ate" },
      { thai: "ไปแล้ว", rtgs: "bpai láew", spanish: "Ya fui", english: "Already went" },
      { thai: "ถึงแล้ว", rtgs: "tǔeng láew", spanish: "Ya llegué", english: "I've arrived" },
      { thai: "เสร็จแล้ว", rtgs: "sèt láew", spanish: "Ya terminé", english: "Finished" },
      { thai: "พร้อมแล้ว", rtgs: "prom láew", spanish: "Ya estoy listo", english: "I'm ready" }
    ]
  },
  {
    id: 5, name: "Modal de capacidad con ได้", category: "modales", importance: 5,
    explanation: "ได้ después del verbo indica capacidad o permiso.",
    when: "Expresar 'poder hacer algo' o 'estar permitido'.",
    mistakes: "Confundir ได้ (capacidad/permiso) con เป็น (saber hacer una habilidad aprendida).",
    colloquial: "En negativo, ไม่ได้ significa 'no poder' o 'no haber podido'.",
    examples: [
      { thai: "พูดได้", rtgs: "pùut dâai", spanish: "Puedo hablar", english: "I can speak" },
      { thai: "กินได้", rtgs: "gin dâai", spanish: "Se puede comer", english: "Edible / can eat" },
      { thai: "ไปได้", rtgs: "bpai dâai", spanish: "Puedo ir", english: "I can go" },
      { thai: "ทำได้", rtgs: "tam dâai", spanish: "Puedo hacerlo", english: "I can do it" },
      { thai: "เข้าได้ไหม", rtgs: "kâo dâai mǎi", spanish: "¿Puedo entrar?", english: "Can I come in?" }
    ]
  },
  {
    id: 6, name: "Clasificadores (contar sustantivos)", category: "clasificadores", importance: 4,
    explanation: "Para contar se usa: sustantivo + número + clasificador. Cada sustantivo tiene su clasificador.",
    when: "Contar objetos, personas, animales, tiempo.",
    mistakes: "Usar un clasificador equivocado (คน para personas, ตัว para animales, อัน para objetos pequeños, ใบ para hojas/vasos/papel, เล่ม para libros).",
    colloquial: "En habla informal el sustantivo se omite si está claro por el contexto: 'สองคน' en vez de 'คนสองคน' (dos personas).",
    examples: [
      { thai: "คนสองคน", rtgs: "khon sǎwng khon", spanish: "Dos personas", english: "Two people" },
      { thai: "หนังสือสามเล่ม", rtgs: "nǎng-sǔue sǎam lêm", spanish: "Tres libros", english: "Three books" },
      { thai: "รถสี่คัน", rtgs: "rót sìi kan", spanish: "Cuatro coches", english: "Four cars" },
      { thai: "แมวหนึ่งตัว", rtgs: "maeo nùeng dtua", spanish: "Un gato", english: "One cat" },
      { thai: "น้ำสองแก้ว", rtgs: "nám sǎwng gâao", spanish: "Dos vasos de agua", english: "Two glasses of water" }
    ]
  },
  {
    id: 7, name: "Partículas de cortesía ครับ / ค่ะ", category: "cortesía", importance: 5,
    explanation: "ครับ (khráp, hombre) y ค่ะ (khâ, mujer) al final suavizan la frase y muestran respeto.",
    when: "Hablado formal o cortés con desconocidos, mayores o en servicio.",
    mistakes: "Mezclar género (hombre usando ค่ะ). Usar ครับ entre amigos íntimos suena distante. Confundir ค่ะ (tono descendente, para afirmaciones) con คะ (tono alto, para preguntas).",
    colloquial: "Entre amigos se omite. Exagerarlo delata extranjero.",
    examples: [
      { thai: "สวัสดีครับ", rtgs: "sà-wàt-dii khráp", spanish: "Hola (hombre)", english: "Hello (male speaker)" },
      { thai: "ขอบคุณค่ะ", rtgs: "kàwp-khun khâ", spanish: "Gracias (mujer)", english: "Thank you (female speaker)" },
      { thai: "ไม่เป็นไรครับ", rtgs: "mâi bpen rai khráp", spanish: "No hay de qué (hombre)", english: "No problem (male)" },
      { thai: "เข้าใจแล้วค่ะ", rtgs: "kâo-jai láew khâ", spanish: "Ya entiendo (mujer)", english: "I understand now (female)" },
      { thai: "ครับ ๆ", rtgs: "khráp khráp", spanish: "Sí, sí (hombre)", english: "Yes, yes (male)" }
    ]
  },
  {
    id: 8, name: "Comparación con กว่า", category: "comparación", importance: 4,
    explanation: "X กว่า Y = X es más ... que Y. Va después del adjetivo.",
    when: "Comparar dos cosas en una cualidad.",
    mistakes: "Poner กว่า delante del adjetivo (orden español). Olvidar que no hay 'menos ... que' nativo — se usa ไม่...เท่า.",
    colloquial: "Para 'el más', combinar con ที่สุด: 'ดีที่สุด' = 'el mejor'.",
    examples: [
      { thai: "ใหญ่กว่า", rtgs: "yài kwàa", spanish: "Más grande", english: "Bigger" },
      { thai: "อร่อยกว่า", rtgs: "a-ròi kwàa", spanish: "Más rico", english: "Tastier" },
      { thai: "แพงกว่า", rtgs: "paeng kwàa", spanish: "Más caro", english: "More expensive" },
      { thai: "เร็วกว่า", rtgs: "reo kwàa", spanish: "Más rápido", english: "Faster" },
      { thai: "ดีกว่า", rtgs: "dii kwàa", spanish: "Mejor", english: "Better" }
    ]
  }
];

// ===== Banco de frases (target: 2000+, seed: 15) =====
// Cada frase: { id, thai, rtgs, spanish, english, newWords:[rank], structureId, note }
var TOP1000_PHRASES = [
  { id: 1, thai: "สวัสดีครับ", rtgs: "sà-wàt-dii khráp", spanish: "Hola (hombre)", english: "Hello (male)", newWords: [88], structureId: 7, note: "Saludo formal masculino." },
  { id: 2, thai: "สวัสดีค่ะ", rtgs: "sà-wàt-dii khâ", spanish: "Hola (mujer)", english: "Hello (female)", newWords: [88], structureId: 7, note: "Saludo formal femenino." },
  { id: 3, thai: "คุณสบายดีไหม", rtgs: "khun sà-baai-dii mǎi", spanish: "¿Estás bien?", english: "Are you well?", newWords: [88, 12], structureId: 1, note: "Saludo casual '¿cómo estás?'." },
  { id: 4, thai: "ขอบคุณมาก", rtgs: "kàwp-khun mâak", spanish: "Muchas gracias", english: "Thank you very much", newWords: [22], structureId: null, note: "Respuesta cortés común." },
  { id: 5, thai: "ไม่เป็นไร", rtgs: "mâi bpen rai", spanish: "No hay de qué / No importa", english: "Never mind / You're welcome", newWords: [2, 3], structureId: 2, note: "Doble uso: disculpa leve o respuesta a 'gracias'." },
  { id: 6, thai: "ผมไม่เข้าใจ", rtgs: "pǒm mâi kâo-jai", spanish: "No entiendo", english: "I don't understand", newWords: [3, 15], structureId: 2, note: "Frase de supervivencia para extranjeros." },
  { id: 7, thai: "พูดช้าลงได้ไหม", rtgs: "pùut cháa long dâai mǎi", spanish: "¿Puedes hablar más despacio?", english: "Can you speak slower?", newWords: [142, 87], structureId: 5, note: "Súper útil con nativos que hablan rápido." },
  { id: 8, thai: "ราคาเท่าไหร่", rtgs: "raa-khaa tâo-rài", spanish: "¿Cuánto cuesta?", english: "How much is it?", newWords: [45], structureId: null, note: "Compra esencial." },
  { id: 9, thai: "ห้องน้ำอยู่ที่ไหน", rtgs: "hâang-nám yùu thîi nǎi", spanish: "¿Dónde está el baño?", english: "Where is the bathroom?", newWords: [78, 4], structureId: null, note: "Pregunta de ubicación básica." },
  { id: 10, thai: "อร่อยมาก", rtgs: "a-ròi mâak", spanish: "Muy rico", english: "Very delicious", newWords: [120, 22], structureId: null, note: "Elogio al cocinero o al plato." },
  { id: 11, thai: "ผมจะไปกรุงเทพ", rtgs: "pǒm jà bpai grung-thêep", spanish: "Iré a Bangkok", english: "I'll go to Bangkok", newWords: [3, 5], structureId: 3, note: "Futuro simple con destino." },
  { id: 12, thai: "กินข้าวแล้ว", rtgs: "gin kâao láew", spanish: "Ya comí", english: "I've already eaten", newWords: [33, 4], structureId: 4, note: "Acción completada." },
  { id: 13, thai: "คนนี้ใจดี", rtgs: "khon níi jai-dii", spanish: "Esta persona es amable", english: "This person is kind-hearted", newWords: [12, 88, 22], structureId: null, note: "Demostrativo + sujeto + adjetivo." },
  { id: 14, thai: "รถคันนี้เร็วกว่า", rtgs: "rót kan níi reo kwàa", spanish: "Este coche es más rápido", english: "This car is faster", newWords: [210, 142], structureId: 8, note: "Comparación con clasificador 'คัน'." },
  { id: 15, thai: "พรุ่งนี้เจอกัน", rtgs: "prùng-níi joo gan", spanish: "Nos vemos mañana", english: "See you tomorrow", newWords: [5, 22], structureId: null, note: "Despedida casual futura." }
];

// ===== Conversaciones (target: muchas, seed: 3) =====
// Cada conversación: { id, situation, difficulty, lines: [{thai, rtgs, spanish, english}] }
var TOP1000_CONVERSATIONS = [
  {
    id: 1, situation: "taxi", difficulty: "corta",
    lines: [
      { thai: "ไปสนามบินได้ไหมครับ", rtgs: "bpai sà-nǎam-bin dâai mǎi khráp", spanish: "¿Puede llevarme al aeropuerto?", english: "Can you take me to the airport?" },
      { thai: "ได้ครับ", rtgs: "dâai khráp", spanish: "Sí, puedo.", english: "Yes, I can." },
      { thai: "นานเท่าไหร่ครับ", rtgs: "naan tâo-rài khráp", spanish: "¿Cuánto se tarda?", english: "How long does it take?" },
      { thai: "ประมาณสามสิบนาทีครับ", rtgs: "bprà-maan sǎam-sìp naa-thii khráp", spanish: "Aproximadamente treinta minutos.", english: "About thirty minutes." },
      { thai: "เท่าไหร่ครับ", rtgs: "tâo-rài khráp", spanish: "¿Cuánto cuesta?", english: "How much?" },
      { thai: "สองร้อยบาทครับ", rtgs: "sǎwng-róoy bàat khráp", spanish: "Doscientos baht.", english: "Two hundred baht." }
    ]
  },
  {
    id: 2, situation: "restaurante", difficulty: "media",
    lines: [
      { thai: "มีเมนูไหมครับ", rtgs: "mii mee-nǔu mǎi khráp", spanish: "¿Tienen carta?", english: "Do you have a menu?" },
      { thai: "ครับ เชิญครับ", rtgs: "khráp, chəəi khráp", spanish: "Sí, aquí tiene.", english: "Yes, here you go." },
      { thai: "ขอผัดไทยหนึ่งจานครับ", rtgs: "kǒo phàt-thai nùeng jaan khráp", spanish: "Quisiera un Pad Thai.", english: "I'd like one Pad Thai." },
      { thai: "เผ็ดไหมครับ", rtgs: "phèt mǎi khráp", spanish: "¿Lo quiere picante?", english: "Spicy?" },
      { thai: "เผ็ดนิดหน่อยครับ", rtgs: "phèt nít nòi khráp", spanish: "Un poco picante, por favor.", english: "A little spicy, please." },
      { thai: "จะดื่มอะไรดีครับ", rtgs: "jà dùuem a-rai dii khráp", spanish: "¿Qué quiere beber?", english: "What would you like to drink?" },
      { thai: "ขอน้ำเปล่าครับ", rtgs: "kǒo nám plào khráp", spanish: "Agua sin gas, por favor.", english: "Still water, please." },
      { thai: "อร่อยไหมครับ", rtgs: "a-ròi mǎi khráp", spanish: "¿Está rico?", english: "Is it delicious?" },
      { thai: "อร่อยมากครับ", rtgs: "a-ròi mâak khráp", spanish: "Muy rico.", english: "Very delicious." }
    ]
  },
  {
    id: 3, situation: "amigos", difficulty: "corta",
    lines: [
      { thai: "ไปไหน", rtgs: "bpai nǎi", spanish: "¿A dónde vas?", english: "Where are you going?" },
      { thai: "ไปกินข้าว", rtgs: "bpai gin kâao", spanish: "Voy a comer.", english: "Going to eat." },
      { thai: "ไปด้วยได้ไหม", rtgs: "bpai dûuai dâai mǎi", spanish: "¿Puedo ir contigo?", english: "Can I join?" },
      { thai: "ได้สิ ไปกัน", rtgs: "dâai sì, bpai gan", spanish: "Claro, vamos.", english: "Sure, let's go." },
      { thai: "กินอะไรดี", rtgs: "gin a-rai dii", spanish: "¿Qué comemos?", english: "What should we eat?" },
      { thai: "ส้มตำไหม", rtgs: "sôm-dtam mǎi", spanish: "¿Som tam (ensalada de papaya)?", english: "Som tam?" }
    ]
  }
];
