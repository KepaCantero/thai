// Spike 1: domain types for the Thai Flashcards app.
//
// These types describe the *current* shape of the data, not aspirations.
// They are derived from public/data.js, public/top1000*.js, public/shadowing.js,
// public/audio-manifest.js, and public/config.js. No runtime values here —
// downstream modules will import these as we extract code from public/app.js.

// ============================================================================
// Tones
// ============================================================================

/** Five-tone key used throughout the app. */
export type ToneKey = 'm' | 'l' | 'r' | 'f' | 'h';

export interface Tone {
  symbol: string;
  name: string;
  color: string;
}

export type ToneMap = Record<ToneKey, Tone>;

/**
 * Tone string as stored on entries. Either a single tone key ("r", "f", ...)
 * or a hyphen-joined compound for multi-syllable entries ("l-l-m", "h-m-r").
 */
export type ToneString = string;

// ============================================================================
// Language primitives
// ============================================================================

/** A Thai-script string. Used pervasively; alias documents intent. */
export type Thai = string;

/** Phonetic transcription (RTGS-like with tone contours via diacritics). */
export type Phonetic = string;

/** Approximated phonetic for Spanish speakers. */
export type EsPhonetic = string;

/** Spanish translation. */
export type Spanish = string;

/** English translation. */
export type English = string;

/** Category slug (e.g. "verbos", "comida", "saludos"). */
export type Category = string;

/** Lesson number (1-indexed). 0 is used for non-lesson content in some datasets. */
export type Lesson = number;

// ============================================================================
// Minimal translation unit shared by Word / Phrase / Practica
// ============================================================================

export interface BaseEntry {
  thai: Thai;
  phonetic: Phonetic;
  es: EsPhonetic;
  tone: ToneString;
  spanish: Spanish;
  en: English;
  category: Category;
  lesson?: Lesson;
  toneNote?: string;
  image?: string;
}

// ============================================================================
// DATA.words, DATA.phrases, DATA.practica
// ============================================================================

export type Word = BaseEntry;
export type Phrase = BaseEntry;
export type Practica = BaseEntry;

// ============================================================================
// DATA.conversations — Q/A pairs (Spanish-primary content)
// ============================================================================

export interface ConversationSide {
  thai: Thai;
  phonetic: Phonetic;
  es: EsPhonetic;
  tone: ToneString;
  spanish: Spanish;
  en: English;
}

export interface Conversation extends ConversationSide {
  /** 'q_' prefix on every ConversationSide key when flattened. */
  q_thai: Thai;
  q_phonetic: Phonetic;
  q_es: EsPhonetic;
  q_tone: ToneString;
  q_spanish: Spanish;
  q_en: English;
  a_thai: Thai;
  a_phonetic: Phonetic;
  a_es: EsPhonetic;
  a_tone: ToneString;
  a_spanish: Spanish;
  a_en: English;
  category: Category;
  lesson: Lesson;
  /**
   * false = pending native-teacher review (Comprehensible Thai cthai section).
   * Absent / true = reviewed. See isVerifiedEntry in app.js.
   */
  verified?: boolean;
}

// ============================================================================
// DATA.pairs — minimal tone contrast pairs
// ============================================================================

export interface Pair {
  w1: Thai;
  w2: Thai;
  note: string;
  category: Category;
}

// ============================================================================
// DATA.janus — sentence builder matrix (subjects × motives × actions × objects)
// ============================================================================

export interface JanusPart {
  thai: Thai;
  phonetic: Phonetic;
  es: EsPhonetic;
  en: English;
}

export interface JanusTheme {
  theme: string;
  icon: string;
  lesson: Lesson;
  subjects: JanusPart[];
  motives: JanusPart[];
  actions: JanusPart[];
  objects: JanusPart[];
}

// ============================================================================
// DATA namespace
// ============================================================================

export interface DataShape {
  words: Word[];
  phrases: Phrase[];
  conversations: Conversation[];
  janus: JanusTheme[];
  pairs: Pair[];
  practica: Practica[];
}

// ============================================================================
// TOP1000 — frequency-listed vocabulary with phrase/question/answer scaffolds
// ============================================================================

export type Top1000Category =
  | 'expresiones'
  | 'pronombres'
  | 'verbos'
  | 'sustantivos'
  | 'adjetivos'
  | 'adverbios';

/** CEFR proficiency band, or null when not yet assigned. */
export type CefrBand = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;

export interface Top1000Word {
  rank: number;
  thai: Thai;
  es: EsPhonetic;
  spanish: Spanish;
  english: English;
  rtgs: string;
  cefr: CefrBand;
  freq: number;
  notes: string;
  category: Top1000Category | string;
  tone: ToneString;
  phrase: {
    thai: Thai;
    es: EsPhonetic;
    spanish: Spanish;
    en: English;
  };
  question: {
    thai: Thai;
    es: EsPhonetic;
    spanish: Spanish;
  };
  answer: {
    thai: Thai;
    es: EsPhonetic;
    spanish: Spanish;
  };
}

/** Word-segmented phrase: key is the source phrase/segment id (as string). */
export interface Top1000PhraseSegment {
  thai: Thai;
  es: EsPhonetic;
  en: English;
  rank: number;
}

export type Top1000PhraseSegmentMap = Record<string, Top1000PhraseSegment[]>;

// ============================================================================
// SHADOWING — synced audio + transcript conversations
// ============================================================================

export type ShadowingLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export interface ShadowingLine {
  speaker: 'A' | 'B' | string;
  speakerLabel: string;
  thai: Thai;
  es: EsPhonetic;
  english: English;
  spanish: Spanish;
  /** Start time of the line within the audio file, in seconds. */
  t: number;
}

export interface ShadowingConversation {
  id: string;
  title: string;
  titleTh: Thai;
  description: string;
  level: ShadowingLevel;
  lesson: Lesson;
  audio: string;
  lines: ShadowingLine[];
}

// ============================================================================
// AUDIO_MANIFEST — Thai text → pre-generated audio file id
// ============================================================================

/** key = Thai text, value = audio file id (served under /audio/<id>.<ext>). */
export type AudioManifest = Record<string, string>;

// ============================================================================
// Card — the unified deck item rendered by the flashcard UI.
// ============================================================================

export type CardType = 'word' | 'phrase' | 'pair' | 'conversation' | 'practica';

export interface Card {
  type: CardType;
  thai: Thai;
  phonetic?: Phonetic;
  es?: EsPhonetic;
  tone?: ToneString;
  spanish?: Spanish;
  en?: English;
  category?: Category;
  lesson?: Lesson;
  image?: string;
  toneNote?: string;
  // type-specific extensions:
  w1?: Pair['w1'];
  w2?: Pair['w2'];
  note?: Pair['note'];
  q_thai?: Conversation['q_thai'];
  q_phonetic?: Conversation['q_phonetic'];
  q_es?: Conversation['q_es'];
  q_tone?: Conversation['q_tone'];
  q_spanish?: Conversation['q_spanish'];
  q_en?: Conversation['q_en'];
  a_thai?: Conversation['a_thai'];
  a_phonetic?: Conversation['a_phonetic'];
  a_es?: Conversation['a_es'];
  a_tone?: Conversation['a_tone'];
  a_spanish?: Conversation['a_spanish'];
  a_en?: Conversation['a_en'];
  verified?: boolean;
}

// ============================================================================
// QaItem — Q&A deck item built from conversations for Questions mode
// ============================================================================

export type QaTopic =
  | 'futuro'
  | 'querer'
  | 'gustar'
  | 'negación'
  | 'progresivo'
  | 'pasado'
  | 'pregunta sí/no'
  | 'pregunta dónde'
  | 'pregunta qué'
  | 'pregunta cuánto'
  | 'presente'
  | string;

export interface QaItem {
  type: 'qa';
  source: string;
  topic: Category;
  tense: QaTopic;
  q_thai: Thai;
  q_phonetic: Phonetic;
  q_es: EsPhonetic;
  q_en: English;
  q_spanish: Spanish;
  a_thai: Thai;
  a_phonetic: Phonetic;
  a_es: EsPhonetic;
  a_en: English;
  a_spanish: Spanish;
}

// ============================================================================
// Mode / Scope / Filter — UI navigation state
// ============================================================================

export type Scope = 'lecciones' | 'top1000' | 'comprehensive';

export type ModeKey =
  | 'cards'
  | 'dashboard'
  | 'tones'
  | 'matrix'
  | 'shadowing'
  | 'questions'
  | 'srs'
  | 'top1000'
  | 'alphabet';

export interface ModeDescriptor {
  key: ModeKey;
  label: string;
  icon: string;
  cls: string;
}
