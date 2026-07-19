// Public surface for the render module (word-breakdown).

export {
  __resetWordDictForTests,
  buildWordDict,
  renderWB,
  translateWords,
} from './wordDict';
export type { TranslatedWord, WordDict, WordDictEntry } from './wordDict';
