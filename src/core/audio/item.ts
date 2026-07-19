// Audio item helpers shared between gateway wiring and legacy bridges.
//
// The legacy audio.js exposes getAudioText(item) which inspects the item's
// `type` discriminator to pick the right Thai string(s). Cards come in three
// shapes — plain words/phrases, conversations (q+a pair), and "pair" cards
// (two related words). This module captures that shape so wiring.ts and any
// typed consumer can share it without depending on the legacy file.

export interface AudioItemWord {
  type?: 'word' | 'phrase';
  thai: string;
}

export interface AudioItemConversation {
  type: 'conversation';
  q_thai: string;
  a_thai: string;
}

export interface AudioItemPair {
  type: 'pair';
  w1: { thai: string };
  w2: { thai: string };
}

export type AudioItem = AudioItemWord | AudioItemConversation | AudioItemPair;

/**
 * Returns the Thai string (or compound "a ... b" for conversations and pairs)
 * that should be passed to speakText for the given card item.
 *
 * Mirrors public/audio.js:getAudioText exactly:
 *   - conversation -> "q_thai ... a_thai" (static backend splits on " ... ")
 *   - pair         -> "w1.thai ... w2.thai"
 *   - word/phrase  -> item.thai
 */
export function getAudioText(item: AudioItem): string {
  if (!item) return '';
  if (item.type === 'conversation') {
    return `${item.q_thai} ... ${item.a_thai}`;
  }
  if (item.type === 'pair') {
    return `${item.w1.thai} ... ${item.w2.thai}`;
  }
  return item.thai;
}
