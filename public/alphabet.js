// Thai alphabet — only consonants the user requested
// Format per entry: thai letter | emoji (graphic mnemonic) | sound | "as in [soundLike] [word.thai] ([english])" | mnemonic {visual, full, story}

var ALPHABET_CONSONANTS = [
  { i: 1, thai: "ก", emoji: "🐔", sound: "k / g", soundLike: "go", cls: "mid",
    word: { thai: "gai", rtgs: "gai", en: "chicken" },
    mnemonic: {
      visual: "Pierna de 'G' con un pie — un pollo (gai) parado.",
      full: "Forma de G con pie. Pollo = gai → K/G. Clase MEDIA.",
      story: "Un pollo llamado gai se para sobre una pata como la letra G. Hace K/G suave, sin prisa — clase media."
    } },

  { i: 2, thai: "ข", emoji: "🥚", sound: "kh", soundLike: "khor", cls: "high",
    word: { thai: "khai", rtgs: "khai", en: "egg" },
    mnemonic: {
      visual: "Huevo (khai) sobre un nido — la protuberancia arriba.",
      full: "El huevo está ARRIBA → clase ALTA. Sonido KH.",
      story: "Llevas un huevo (khai) en lo alto de la cabeza, equilibrándolo — por eso ALTA. Suena KH como la 'j' andaluza."
    } },

  { i: 3, thai: "ฃ", emoji: "🍶", sound: "kh", soundLike: "khor", cls: "low",
    word: { thai: "khuat", rtgs: "khuat", en: "bottle" }, obsolete: true,
    mnemonic: {
      visual: "Botella (khuat) con cuello fino y largo.",
      full: "Botella tumbada, LOW. Obsoleta — ya no se usa.",
      story: "Una botella (khuat) olvidada, tumbada. Tan poco usada que la retiraron del abecedario — puedes saltártela."
    } },

  { i: 4, thai: "ค", emoji: "🐃", sound: "kh", soundLike: "khor", cls: "low",
    word: { thai: "khwai", rtgs: "khwai", en: "water buffalo" },
    mnemonic: {
      visual: "Cuernos de búfalo (khwai) en espiral.",
      full: "Cuernos curvos, búfalo → LOW. Sonido KH grave.",
      story: "Un búfalo de agua (khwai) con cuernos en espiral te mira desde el barro — pesado, grave, clase LOW."
    } },

  { i: 5, thai: "ฅ", emoji: "🧍", sound: "kh", soundLike: "khor", cls: "low",
    word: { thai: "khon", rtgs: "khon", en: "person" }, obsolete: true,
    mnemonic: {
      visual: "Persona (khon) sin cuernos — solo cabeza y hombros.",
      full: "Cuerpo recortado, persona LOW. Obsoleta.",
      story: "Una persona (khon) se asoma por encima de la cerca: solo cabeza y hombros. Tan rara vez se usa que es obsoleta."
    } },

  { i: 6, thai: "ฆ", emoji: "🔔", sound: "kh", soundLike: "khor", cls: "low",
    word: { thai: "ra-khang", rtgs: "rá-khang", en: "bell" },
    mnemonic: {
      visual: "Campana (rá-khang) con su badajo cruzado arriba.",
      full: "Campana con X arriba, LOW. Sonido KH.",
      story: "Una campana del templo (rá-khang) con su badajo cruzado tañe — sonido KH grave, clase LOW."
    } },

  { i: 7, thai: "ง", emoji: "🐍", sound: "ng", soundLike: "ngo", cls: "low",
    word: { thai: "ngu", rtgs: "ngu", en: "snake" },
    mnemonic: {
      visual: "S de serpiente (ngu) deslizándose.",
      full: "S sinuosa, serpiente → LOW. Sonido NG.",
      story: "Una serpiente (ngu) se desliza dibujando una S en la arena. Hace 'ng' como un gato nasal — clase LOW."
    } },

  { i: 8, thai: "จ", emoji: "🍽️", sound: "ch / j", soundLike: "jor", cls: "mid",
    word: { thai: "jan", rtgs: "jan", en: "plate" },
    mnemonic: {
      visual: "Plato (jan) de un solo trazo.",
      full: "Plato con borde, MID. Sonido CH/J.",
      story: "Un plato (jan) redondo pintado con un solo golpe de pincel. Lo golpeas y hace CH/J — clase media."
    } },

  { i: 9, thai: "ฉ", emoji: "🥂", sound: "ch", soundLike: "cho", cls: "high",
    word: { thai: "ching", rtgs: "ching", en: "cymbals" },
    mnemonic: {
      visual: "Platillos (ching) a punto de chocar, en alto.",
      full: "Platillos en alto → ALTA. Sonido CH agudo.",
      story: "Dos platillos (ching) cuelgan en lo alto del templo, listos para chocar — estridente, clase ALTA."
    } },

  { i: 10, thai: "ช", emoji: "🐘", sound: "ch", soundLike: "cho", cls: "low",
    word: { thai: "chang", rtgs: "chang", en: "elephant" },
    mnemonic: {
      visual: "Trompa de elefante (chang) cayendo.",
      full: "Trompa que cae, elefante → LOW. Sonido CH grave.",
      story: "Un elefante (chang) deja caer su trompa enrollada — pesado, grave, clase LOW."
    } },

  { i: 11, thai: "ซ", emoji: "⛓️", sound: "s", soundLike: "zho", cls: "low",
    word: { thai: "so", rtgs: "so", en: "chain" },
    mnemonic: {
      visual: "Eslabón de cadena (so) curvado.",
      full: "Cadena curva, LOW. Sonido S.",
      story: "Una cadena (so) con un eslabón retorcido brilla en el suelo — sus eslabones hacen S, clase LOW."
    } },

  { i: 12, thai: "ฌ", emoji: "🌳", sound: "ch", soundLike: "cho", cls: "low",
    word: { thai: "choe", rtgs: "choe", en: "tree" },
    mnemonic: {
      visual: "Árbol (choe) con copa y ramas.",
      full: "Árbol con copa, LOW. Sonido CH.",
      story: "Un árbol (choe) con dos ramas se yergue en el patio — sus hojas susurran CH, clase LOW."
    } },

  { i: 13, thai: "ญ", emoji: "👩", sound: "y", soundLike: "yo", cls: "low",
    word: { thai: "ying", rtgs: "ying", en: "woman" },
    mnemonic: {
      visual: "Mujer (ying) con falda larga hasta el suelo.",
      full: "Falda hasta el suelo, mujer LOW. Sonido Y.",
      story: "Una mujer (ying) con falda que arrastra hasta el suelo camina despacio — hace Y, clase LOW."
    } },

  { i: 14, thai: "ฎ", emoji: "👑", sound: "d", soundLike: "door", cls: "mid",
    word: { thai: "cha-da", rtgs: "cha-da", en: "headdress" },
    mnemonic: {
      visual: "Corona (cha-da) con una cola que cae abajo.",
      full: "Corona con cola, MID. Sonido D.",
      story: "Una corona ceremonial (cha-da) termina con una cola que toca el suelo — suena D, clase media."
    } },

  { i: 15, thai: "ฏ", emoji: "🗡️", sound: "t / d", soundLike: "d/to", cls: "mid",
    word: { thai: "pa-tak", rtgs: "pa-tak", en: "goad, javelin" },
    mnemonic: {
      visual: "Lanza (pa-tak) recta con un gancho en la punta.",
      full: "Pica recta, MID. Sonido T/D.",
      story: "Una lanza (pa-tak) recta con gancho pincha al búfalo para que avance — hace T/D, clase media."
    } },

  { i: 16, thai: "ฐ", emoji: "🏛️", sound: "th", soundLike: "tho", cls: "high",
    word: { thai: "than", rtgs: "than", en: "base" },
    mnemonic: {
      visual: "Pedestal (than) ancho con plataforma.",
      full: "Base con plataforma → ALTA. Sonido TH.",
      story: "Un pedestal ancho (than) sostiene una estatua en lo alto — TH aspirado, clase ALTA."
    } },

  { i: 17, thai: "ฑ", emoji: "👸", sound: "th", soundLike: "tall", cls: "low",
    word: { thai: "montho", rtgs: "montho", en: "Mandodari, character from Ramayana" },
    mnemonic: {
      visual: "Reina Mandodarí (montho) con cola de vestido.",
      full: "Reina con cola, LOW. Sonido TH.",
      story: "La reina Mandodarí (montho) del Ramayana arrastra su cola de vestido real — TH, clase LOW."
    } },

  { i: 18, thai: "ฒ", emoji: "🧓", sound: "th", soundLike: "tall", cls: "low",
    word: { thai: "phu-thao", rtgs: "phu-thao", en: "elder" },
    mnemonic: {
      visual: "Espalda encorvada del anciano (phu-thao).",
      full: "Joroba arriba, anciano LOW. Sonido TH.",
      story: "Un anciano (phu-thao) camina encorvado con la espalda curva — TH grave, clase LOW."
    } },

  { i: 19, thai: "ณ", emoji: "🧘", sound: "n", soundLike: "nor", cls: "low",
    word: { thai: "nen", rtgs: "nen", en: "samanera" },
    mnemonic: {
      visual: "Monje novicio (nen) pequeño, casi un garabato.",
      full: "Letra mínima, novicio LOW. Sonido N.",
      story: "Un monje novicio (nen) hace una pequeña reverencia — letra simple, N nasal, clase LOW."
    } },

  { i: 20, thai: "ด", emoji: "🧒", sound: "d", soundLike: "door", cls: "mid",
    word: { thai: "dek", rtgs: "dek", en: "child" },
    mnemonic: {
      visual: "Cabeza redonda de niño (dek) sentado.",
      full: "Bucle redondo, niño MID. Sonido D.",
      story: "Un niño (dek) con la cabeza redonda se sienta en el suelo — hace D, clase media."
    } }
];
