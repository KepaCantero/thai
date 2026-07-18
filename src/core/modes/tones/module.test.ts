// Spike 5: tests for the TonesModule. Focus is on getToneItems (pure data)
// and the action surface; render() output is exercised via the dev server.

import { describe, expect, it, vi } from 'vitest';
import { createTonesModule } from './module';
import type { DataShape, ToneMap } from '../../types';

function makeTones(): ToneMap {
  return {
    m: { symbol: '→', name: 'mid', color: '#888' },
    l: { symbol: '↓', name: 'low', color: '#3aa' },
    r: { symbol: '↗', name: 'rising', color: '#a3a' },
    f: { symbol: '↘', name: 'falling', color: '#a33' },
    h: { symbol: '↑', name: 'high', color: '#3a3' },
  };
}

function makeData(): DataShape {
  return {
    words: [
      { thai: 'หมา', phonetic: 'mǎa', es: 'maa', tone: 'r', spanish: 'perro', en: 'dog', category: 'animales', lesson: 1 },
      { thai: 'ม้า', phonetic: 'máa', es: 'maa', tone: 'h', spanish: 'caballo', en: 'horse', category: 'animales', lesson: 1 },
      { thai: 'ข้าว', phonetic: 'kâao', es: 'kao', tone: 'f-l', spanish: 'arroz', en: 'rice', category: 'comida', lesson: 2 },
      { thai: 'น้ำ', phonetic: 'náam', es: 'nam', tone: 'r', spanish: 'agua', en: 'water', category: 'comida', lesson: 2 },
      { thai: 'คน', phonetic: 'khon', es: 'jon', tone: 'm', spanish: 'persona', en: 'person', category: 'gentes', lesson: 1 },
    ],
    pairs: [
      { w1: 'หมา', w2: 'ม้า', note: 'r vs h', category: 'tones' },
      { w1: 'ข้าว', w2: 'น้ำ', note: 'f-l vs r', category: 'tones' },
    ],
    conversations: [],
    janus: [],
    practica: [],
  } as unknown as DataShape;
}

function makeDeps(overrides: Partial<Parameters<typeof createTonesModule>[0]> = {}) {
  const calls = { stripHtml: [] as string[], contentHtml: [] as string[], outlines: [] as (string | null)[] };
  const deps = {
    getData: () => makeData(),
    getTones: () => makeTones(),
    getThaiEn: () => ({ 'หมา': 'dog' }),
    getActiveLesson: () => 'all' as string | number,
    renderTone: (s?: string, h?: string) => `[${s ?? ''}${h ? '|' + h : ''}]`,
    speakText: vi.fn((_t: string, _d?: () => void) => {}),
    stopCurrentAudio: vi.fn(() => {}),
    setStripHtml: (html: string) => { calls.stripHtml.push(html); },
    setContentHtml: (html: string) => { calls.contentHtml.push(html); },
    setItemOutlines: vi.fn((thai: string | null) => { calls.outlines.push(thai); }),
    setTimeout: vi.fn((_fn: () => void, _ms: number) => Math.floor(Math.random() * 1e9)),
    clearTimeout: vi.fn(() => {}),
    ...overrides,
  };
  return { deps, calls };
}

describe('createTonesModule — getToneItems', () => {
  it('returns all words when no tone is selected and lesson is all', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    const data = m.getToneItems();
    expect(data.words).toHaveLength(5);
    expect(data.pairs).toHaveLength(2);
  });

  it('filters words by selected tone (single-key match)', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.setActiveToneSel('r');
    const data = m.getToneItems();
    // หมา (r) and น้ำ (r) — not ข้าว (f-l, which contains 'l' and 'f' but not 'r')
    expect(data.words.map((w) => w.thai).sort()).toEqual(['น้ำ', 'หมา']);
  });

  it('filters words by selected tone across compound tone strings', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.setActiveToneSel('l');
    const data = m.getToneItems();
    // ข้าว has 'f-l' which contains 'l'
    expect(data.words.map((w) => w.thai)).toEqual(['ข้าว']);
  });

  it('counts per primary tone across all lesson words', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    const { counts } = m.getToneItems();
    expect(counts).toEqual({ m: 1, l: 1, r: 2, f: 1, h: 1 });
  });

  it('respects lesson filter', () => {
    const { deps } = makeDeps({ getActiveLesson: () => 1 });
    const m = createTonesModule(deps);
    const data = m.getToneItems();
    expect(data.words.map((w) => w.thai).sort()).toEqual(['คน', 'ม้า', 'หมา']);
  });

  it('keeps pairs where either side matches the selected tone', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.setActiveToneSel('h');
    const data = m.getToneItems();
    // pair หมา/ม้า — ม้า is 'h' so this pair qualifies
    expect(data.pairs).toHaveLength(1);
    expect(data.pairs[0].w1.thai).toBe('หมา');
  });

  it('returns empty when DATA is missing (bootstrap race)', () => {
    const { deps } = makeDeps({ getData: () => undefined });
    const m = createTonesModule(deps);
    expect(m.getToneItems()).toEqual({ words: [], pairs: [], counts: {} });
  });
});

describe('createTonesModule — countAllWordsForLesson', () => {
  it('returns total when lesson is all', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    expect(m.countAllWordsForLesson()).toBe(5);
  });

  it('returns subset when lesson is set', () => {
    const { deps } = makeDeps({ getActiveLesson: () => 2 });
    const m = createTonesModule(deps);
    expect(m.countAllWordsForLesson()).toBe(2);
  });
});

describe('createTonesModule — selectTone', () => {
  it('updates state and re-renders', () => {
    const { deps, calls } = makeDeps();
    const m = createTonesModule(deps);
    m.selectTone('r');
    expect(m.getActiveToneSel()).toBe('r');
    // render called once via selectTone → at least one strip + content write
    expect(calls.stripHtml.length).toBeGreaterThanOrEqual(1);
    expect(calls.contentHtml.length).toBeGreaterThanOrEqual(1);
  });
});

describe('createTonesModule — playback', () => {
  it('playWord calls speakText with the right thai text', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playWord(0);
    expect(deps.speakText).toHaveBeenCalledWith('หมา');
  });

  it('playWord out-of-range is a no-op', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playWord(999);
    expect(deps.speakText).not.toHaveBeenCalled();
  });

  it('playAllWords starts the queue and speaks the first word', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playAllWords();
    expect(deps.stopCurrentAudio).toHaveBeenCalled();
    expect(deps.speakText).toHaveBeenCalledWith('หมา', expect.any(Function));
  });

  it('playAllWords twice toggles off (second call stops)', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playAllWords();
    m.playAllWords();
    // first call sets queue; second call sees queue is set and stops
    expect(deps.setItemOutlines).toHaveBeenCalledWith(null);
  });

  it('playPair speaks w1; second speak is scheduled via setTimeout when w1 fires onDone', () => {
    // Drive the speakText onDone so the setTimeout for w2 actually fires.
    const { deps } = makeDeps();
    (deps.speakText as any).mockImplementation((_t: string, onDone?: () => void) => {
      if (onDone) onDone();
    });
    const m = createTonesModule(deps);
    m.playPair(0);
    expect(deps.speakText).toHaveBeenNthCalledWith(1, 'หมา', expect.any(Function));
    expect(deps.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1200);
  });

  it('playPair out-of-range is a no-op', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playPair(99);
    expect(deps.speakText).not.toHaveBeenCalled();
  });

  it('stop clears the queue, cancels timers, and clears highlights', () => {
    const { deps } = makeDeps();
    const m = createTonesModule(deps);
    m.playAllWords();
    m.stop();
    expect(deps.clearTimeout).toHaveBeenCalled();
    expect(deps.setItemOutlines).toHaveBeenCalledWith(null);
  });
});

describe('createTonesModule — render', () => {
  it('renders the strip with All button and per-tone counts', () => {
    const { deps, calls } = makeDeps();
    const m = createTonesModule(deps);
    m.render();
    const strip = calls.stripHtml[0];
    expect(strip).toContain('All</div>');
    expect(strip).toContain('5 words'); // countAllWordsForLesson → 5
    expect(strip).toContain('selectTone(\'r\')');
    expect(strip).toContain('2 words'); // tone 'r' has 2
  });

  it('in "All" view, renders a per-tone section with group playback + a pairs section', () => {
    const { deps, calls } = makeDeps();
    const m = createTonesModule(deps);
    m.render();
    const html = calls.contentHtml[0];
    // "All" view groups by primary tone: m(1), r(2: หมา + น้ำ), f(1), h(1).
    // Each group gets a "Play all" button that triggers tonesPlayGroup.
    expect(html).toContain("tonesPlayGroup('r')");
    expect(html).toContain('2 words'); // group r
    expect(html).toContain('Minimal pairs');
    // Word items reference their global index in data.words.
    expect(html).toContain('onclick="tonesPlayWord(0)"'); // หมา
  });

  it('in selected-tone view, shows one section + pairs filtered', () => {
    const { deps, calls } = makeDeps();
    const m = createTonesModule(deps);
    m.setActiveToneSel('r');
    m.render();
    const html = calls.contentHtml[0];
    expect(html).toContain('Minimal pairs contrasting rising');
  });

  it('empty state when nothing matches', () => {
    const { deps, calls } = makeDeps({ getActiveLesson: () => 999 });
    const m = createTonesModule(deps);
    m.render();
    const html = calls.contentHtml[0];
    expect(html).toContain('No tone-tagged content');
    expect(html).toContain('Lesson 999');
  });
});
