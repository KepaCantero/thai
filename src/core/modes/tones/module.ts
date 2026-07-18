// Spike 5: Tones mode — real extraction.
//
// Moves ~200 lines of tones logic out of public/app.js into a typed module.
// The module owns its own state (activeToneSel, playback queue, groups) and
// takes external dependencies via injection: legacy data (DATA, TONES,
// THAI_EN), the activeLesson value (still owned by app.js), and the audio/
// render helpers that haven't been migrated yet.
//
// Wiring lives in legacyBridge.ts, which constructs a module with adapters
// for the legacy globals and overrides window.renderTonesView,
// window.selectTone, window.tonesPlayWord, etc. Legacy app.js keeps its own
// definitions but they're never reached: by the time the user clicks anything,
// the bridge has overwritten them.
//
// The original function order is preserved so behavior matches exactly.

import type { DataShape, ToneKey, ToneMap } from '../../types';

export interface TonesItem {
  thai: string;
  phonetic: string;
  spanish: string;
  tone?: string;
  lesson?: number;
}

export interface TonePair {
  w1: TonesItem;
  w2: TonesItem;
  note: string;
}

export interface ToneCounts {
  [key: string]: number;
}

export interface TonesData {
  words: TonesItem[];
  pairs: TonePair[];
  counts: ToneCounts;
}

export interface TonesModuleDeps {
  /** Active DATA object; undefined during bootstrap before data.js loads. */
  getData(): DataShape | undefined;
  /** Tone map (config.js). Always available. */
  getTones(): ToneMap;
  /** Optional Thai→English lookup from config.js; may return {} if absent. */
  getThaiEn(): Record<string, string>;
  /** Current lesson filter: 'all' or a positive integer. */
  getActiveLesson(): string | number;
  /** Render the tone markers (config.js). */
  renderTone(toneStr: string | undefined, highlight?: ToneKey): string;
  /** Speak via the AudioGateway / legacy speakText. */
  speakText(text: string, onDone?: () => void): void;
  /** Stop any in-flight playback. */
  stopCurrentAudio(): void;
  /** Write innerHTML for #tonesStrip. */
  setStripHtml(html: string): void;
  /** Write innerHTML for #tonesContent. */
  setContentHtml(html: string): void;
  /** Highlight/dim the .tone-item matching the given thai text (or clear). */
  setItemOutlines(thai: string | null): void;
  /** Timer plumbing so tests don't wait for real setTimeout. */
  setTimeout(fn: () => void, ms: number): number;
  clearTimeout(id: number | undefined): void;
}

export interface TonesModule {
  /** Reads the current tone selection. */
  getActiveToneSel(): ToneKey | null;
  /** Public for tests; callers should normally use selectTone(). */
  setActiveToneSel(t: ToneKey | null): void;
  /** Pure data: filtered words, pairs, and per-tone counts. */
  getToneItems(): TonesData;
  /** Count of words matching the current lesson filter (used in the strip). */
  countAllWordsForLesson(): number;
  /** Render the strip + grid into the DOM. */
  render(): void;
  /** Change tone selection and re-render. */
  selectTone(t: ToneKey | null): void;
  /** Play all words matching the current filter; toggle off if playing. */
  playAllWords(): void;
  /** Play a per-tone group from the "All" view. */
  playGroup(key: ToneKey): void;
  /** Play a single word by index in the filtered list. */
  playWord(i: number): void;
  /** Play a pair by index (w1 → 1.2s gap → w2). */
  playPair(i: number): void;
  /** Stop any in-flight playback and clear highlights. */
  stop(): void;
}

function parseLesson(active: string | number): number | null {
  if (active === 'all') return null;
  const n = typeof active === 'number' ? active : parseInt(active, 10);
  return Number.isFinite(n) ? n : null;
}

export function createTonesModule(deps: TonesModuleDeps): TonesModule {
  // --- state (module-private) ----------------------------------------------
  let activeToneSel: ToneKey | null = null;
  let queue: TonesItem[] | null = null;
  let queueIdx = 0;
  let queueTimer: number | undefined;
  // tone key -> filtered words (populated by render() for the "All" view)
  const groups: Partial<Record<ToneKey, TonesItem[]>> = {};

  // --- pure data -----------------------------------------------------------

  function getToneItems(): TonesData {
    const data = deps.getData();
    if (!data) return { words: [], pairs: [], counts: {} };
    const lessonNum = parseLesson(deps.getActiveLesson());
    const tone = activeToneSel;

    const matchLesson = (item: { lesson?: number }) =>
      !lessonNum || (item.lesson || 1) === lessonNum;
    const matchTone = (t?: string) =>
      !tone || (!!t && t.split('-').indexOf(tone) !== -1);

    const words = data.words.filter((w) => matchLesson(w) && matchTone(w.tone));

    let pairs: TonePair[] = [];
    if (data.pairs) {
      const wordMap: Record<string, typeof data.words[number]> = {};
      data.words.forEach((w) => { wordMap[w.thai] = w; });
      pairs = data.pairs
        .filter((p) => {
          if (!matchLesson(p as unknown as { lesson?: number })) return false;
          const w1 = wordMap[p.w1], w2 = wordMap[p.w2];
          if (!w1 || !w2) return false;
          if (!tone) return true;
          return (
            (!!w1.tone && w1.tone.split('-').indexOf(tone) !== -1) ||
            (!!w2.tone && w2.tone.split('-').indexOf(tone) !== -1)
          );
        })
        .map((p) => ({
          w1: wordMap[p.w1] as unknown as TonesItem,
          w2: wordMap[p.w2] as unknown as TonesItem,
          note: p.note,
        }));
    }

    const tones = deps.getTones();
    const counts: ToneCounts = {};
    Object.keys(tones).forEach((k) => { counts[k] = 0; });
    data.words.forEach((w) => {
      if (!matchLesson(w) || !w.tone) return;
      w.tone.split('-').forEach((t) => {
        if (counts[t] != null) counts[t]++;
      });
    });

    return { words, pairs, counts };
  }

  function countAllWordsForLesson(): number {
    const data = deps.getData();
    if (!data) return 0;
    const lessonNum = parseLesson(deps.getActiveLesson());
    return data.words.filter((w) => !lessonNum || (w.lesson || 1) === lessonNum).length;
  }

  // --- rendering -----------------------------------------------------------

  function renderTonesWordsSection(
    toneKey: ToneKey,
    words: TonesItem[],
    idxMap: Record<string, number>,
    isGroup: boolean,
  ): string {
    const tones = deps.getTones();
    const info = tones[toneKey];
    const titleHtml =
      '<span style="color:' + info.color + '">' + info.symbol + ' ' + info.name + '</span>';
    const playCall = isGroup
      ? "tonesPlayGroup('" + toneKey + "')"
      : 'tonesPlayAllWords()';
    const thaiEn = deps.getThaiEn();
    return (
      '<div class="tones-section">' +
        '<div class="tones-section-head">' +
          '<div><div class="tones-section-title">' + titleHtml + ' — ' + words.length + ' words</div></div>' +
          '<button class="ts-play-all" onclick="' + playCall + '">&#9654; Play all</button>' +
        '</div><div class="tones-grid">' +
        words
          .map((w) => {
            const gi = idxMap[w.thai];
            return (
              '<div class="tone-item" data-thai="' + w.thai + '" onclick="tonesPlayWord(' + gi + ')">' +
                '<div class="ti-thai">' + w.thai + '</div>' +
                '<div class="ti-ph">' + w.phonetic + '</div>' +
                '<div class="ti-en">' + (thaiEn[w.thai] || w.spanish) + '</div>' +
                (w.tone ? '<div class="ti-tone">' + deps.renderTone(w.tone, toneKey) + '</div>' : '') +
              '</div>'
            );
          })
          .join('') +
        '</div></div>'
    );
  }

  function render(): void {
    const data = getToneItems();
    const tones = deps.getTones();
    const thaiEn = deps.getThaiEn();

    // Strip of 5 tones + All
    let stripHtml =
      '<button class="tone-card' + (!activeToneSel ? ' active' : '') + '" style="color:#aaa" onclick="selectTone(null)">' +
      '<div class="tc-symbol">&#9834;</div><div class="tc-name">All</div><div class="tc-count">' +
      countAllWordsForLesson() + ' words</div></button>';
    Object.keys(tones).forEach((k) => {
      const info = tones[k as ToneKey];
      const cls = activeToneSel === k ? ' active' : '';
      stripHtml +=
        '<button class="tone-card' + cls + '" style="color:' + info.color + '" onclick="selectTone(\'' + k + '\')">' +
        '<div class="tc-symbol">' + info.symbol + '</div>' +
        '<div class="tc-name">' + info.name + '</div>' +
        '<div class="tc-count">' + data.counts[k] + ' words</div></button>';
    });
    deps.setStripHtml(stripHtml);

    // Index map: thai -> position in data.words (so tonesPlayWord(i) stays correct in grouped sections)
    const idxMap: Record<string, number> = {};
    data.words.forEach((w, i) => { idxMap[w.thai] = i; });

    // Reset per-render groups registry (used by tonesPlayGroup)
    for (const k of Object.keys(groups) as ToneKey[]) delete groups[k];

    let html = '';

    if (activeToneSel) {
      if (data.words.length) {
        html += renderTonesWordsSection(activeToneSel, data.words, idxMap, false);
      }
    } else {
      Object.keys(tones).forEach((k) => {
        const key = k as ToneKey;
        const group = data.words.filter((w) => !!w.tone && w.tone.split('-')[0] === k);
        if (group.length) {
          groups[key] = group;
          html += renderTonesWordsSection(key, group, idxMap, true);
        }
      });
    }

    // Minimal pairs section
    if (data.pairs.length) {
      html +=
        '<div class="tones-section">' +
          '<div class="tones-section-head">' +
            '<div><div class="tones-section-title">Minimal pairs' +
              (activeToneSel ? ' contrasting ' + tones[activeToneSel].name : '') +
            '</div>' +
            '<div class="tones-section-sub">' + data.pairs.length + ' pairs — tap to compare</div></div>' +
          '</div><div class="tones-grid">' +
          data.pairs
            .map((p) => {
              return (
                '<div class="tone-item" onclick="tonesPlayPair(' + data.pairs.indexOf(p) + ')">' +
                  '<div class="ti-thai">' + p.w1.thai + ' / ' + p.w2.thai + '</div>' +
                  '<div class="ti-ph">' + p.w1.phonetic + ' · ' + p.w2.phonetic + '</div>' +
                  '<div class="ti-en">' +
                    (thaiEn[p.w1.thai] || p.w1.spanish) + ' / ' + (thaiEn[p.w2.thai] || p.w2.spanish) +
                  '</div>' +
                  '<div class="ti-tone">' +
                    deps.renderTone(p.w1.tone, activeToneSel ?? undefined) + ' vs ' +
                    deps.renderTone(p.w2.tone, activeToneSel ?? undefined) +
                  '</div>' +
                '</div>'
              );
            })
            .join('') +
          '</div></div>';
      }

    if (!html) {
      const lesson = deps.getActiveLesson();
      html =
        '<div class="tones-empty">No tone-tagged content' +
        (lesson !== 'all' ? ' for Lesson ' + lesson : '') + '.</div>';
    }

    deps.setContentHtml(html);
  }

  // --- actions -------------------------------------------------------------

  function selectTone(t: ToneKey | null): void {
    activeToneSel = t;
    render();
  }

  function playNextWord(): void {
    if (!queue || queueIdx >= queue.length) { stop(); return; }
    const w = queue[queueIdx];
    deps.setItemOutlines(w.thai);
    deps.stopCurrentAudio();
    deps.speakText(w.thai, () => {
      if (!queue) return;
      queueTimer = deps.setTimeout(() => {
        queueIdx++;
        playNextWord();
      }, 800);
    });
  }

  function playAllWords(): void {
    const data = getToneItems();
    if (!data.words.length) return;
    if (queue) { stop(); return; }
    queue = data.words;
    queueIdx = 0;
    playNextWord();
  }

  function playGroup(key: ToneKey): void {
    const list = groups[key] || [];
    if (!list.length) return;
    if (queue) { stop(); return; }
    queue = list;
    queueIdx = 0;
    playNextWord();
  }

  function playWord(i: number): void {
    const data = getToneItems();
    if (!data.words[i]) return;
    deps.stopCurrentAudio();
    deps.speakText(data.words[i].thai);
  }

  function playPair(i: number): void {
    const data = getToneItems();
    if (!data.pairs[i]) return;
    deps.stopCurrentAudio();
    deps.speakText(data.pairs[i].w1.thai, () => {
      const w2 = data.pairs[i].w2.thai;
      deps.setTimeout(() => { deps.speakText(w2); }, 1200);
    });
  }

  function stop(): void {
    queue = null;
    deps.clearTimeout(queueTimer);
    queueTimer = undefined;
    deps.stopCurrentAudio();
    deps.setItemOutlines(null);
  }

  return {
    getActiveToneSel: () => activeToneSel,
    setActiveToneSel: (t) => { activeToneSel = t; },
    getToneItems,
    countAllWordsForLesson,
    render,
    selectTone,
    playAllWords,
    playGroup,
    playWord,
    playPair,
    stop,
  };
}
