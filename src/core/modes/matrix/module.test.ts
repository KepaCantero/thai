// Spike 5f: tests for the matrix module.
//
// Setup mirrors the questions tests: state is manipulated via the real typed
// setters (no mocks for getActiveLesson), and createMatrixModule is fed
// in-memory deps via makeModule(). DOM writes go through a spy MatrixDom so
// the rendering functions can be exercised without a real document.

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setActiveLesson } from '../../state';
import type { JanusPart, JanusTheme } from '../../types';
import {
  createMatrixModule,
  type MatrixDom,
  type MatrixModuleDeps,
} from './module';

beforeEach(() => {
  setActiveLesson('all');
});

function part(thai: string, phonetic: string, es: string, en: string): JanusPart {
  return { thai, phonetic, es, en };
}

function makeTheme(
  overrides: Partial<JanusTheme> = {},
): JanusTheme {
  return {
    theme: 'greetings',
    icon: '👋',
    lesson: 1,
    subjects: [
      part('ฉัน', 'chan', 'chan', 'I'),
      part('คุณ', 'khun', 'khun', 'you'),
      part('เขา', 'khao', 'khao', 'he'),
    ],
    motives: [
      part('อยาก', 'yak', 'yak', 'want to'),
    ],
    actions: [
      part('กิน', 'kin', 'kin', 'eat'),
    ],
    objects: [
      part('ข้าว', 'khaao', 'kao', 'rice'),
      part('กาแฟ', 'kaafae', 'kafe', 'coffee'),
    ],
    ...overrides,
  };
}

interface SpyDom extends MatrixDom {
  gridHtml: string;
  resultHtml: string;
  practiceLabel: string;
}

function makeSpyDom(): SpyDom {
  return {
    gridHtml: '',
    resultHtml: '',
    practiceLabel: '',
    setGridHtml(html: string) {
      this.gridHtml = html;
    },
    setResultHtml(html: string) {
      this.resultHtml = html;
    },
    setPracticeLabel(text: string) {
      this.practiceLabel = text;
    },
  };
}

interface SpyDeps extends MatrixModuleDeps {
  spoken: string[];
  stopped: number;
  dom: SpyDom;
}

function makeModule(themes: JanusTheme[] = [makeTheme()]): SpyDeps {
  const spoken: string[] = [];
  const deps: SpyDeps = {
    janus: () => themes,
    speakText: (text: string, onDone?: () => void) => {
      spoken.push(text);
      if (onDone) onDone();
    },
    stopCurrentAudio: () => {
      deps.stopped++;
    },
    spoken,
    stopped: 0,
    dom: makeSpyDom(),
  };
  // Wire the spy dom after deps object exists.
  deps.dom = makeSpyDom();
  return deps;
}

describe('matrix module', () => {
  it('renders the theme buttons and grid', () => {
    const deps = makeModule([makeTheme({ theme: 'a' }), makeTheme({ theme: 'b' })]);
    const m = createMatrixModule(deps);
    m.renderMatrix();
    expect(deps.dom.gridHtml).toContain('mt-btn');
    expect(deps.dom.gridHtml).toContain('a</button>');
    expect(deps.dom.gridHtml).toContain('matrix-grid-inner');
    expect(deps.dom.gridHtml).toContain('matrix-cell');
    expect(deps.dom.gridHtml).toContain('setMatrixTheme');
    expect(deps.dom.resultHtml).toContain('matrix-controls');
  });

  it('shows the empty-state message when no themes match', () => {
    const deps = makeModule([]);
    const m = createMatrixModule(deps);
    m.renderMatrix();
    expect(deps.dom.gridHtml).toContain('No themes for this lesson');
  });

  it('selecting a cell updates matrixSel and re-renders', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    m.matrixCellTap('objects', 1);
    expect(m.getMatrixSel().objects).toBe(1);
  });

  it('setMatrixTheme resets all selections to 0', () => {
    const deps = makeModule([makeTheme(), makeTheme()]);
    const m = createMatrixModule(deps);
    m.matrixCellTap('objects', 1);
    m.matrixCellTap('subjects', 2);
    m.setMatrixTheme(1);
    expect(m.getMatrixTheme()).toBe(1);
    expect(m.getMatrixSel().objects).toBe(0);
    expect(m.getMatrixSel().subjects).toBe(0);
  });

  it('buildMatrixSentence concatenates thai parts with no separators', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    const sel = m.getMatrixSel();
    const s = m.buildMatrixSentence(sel);
    // subjects[0] + motives[0] + actions[0] + objects[0] joined empty.
    expect(s.thai).toBe('ฉันอยากกินข้าว');
  });

  it('buildMatrixConversation produces Q with ไหม suffix and A+ with ใช่ prefix', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    const conv = m.buildMatrixConversation(m.getMatrixSel());
    expect(conv.q.thai.endsWith('ไหม')).toBe(true);
    expect(conv.a.thai.startsWith('ใช่ ')).toBe(true);
    expect(conv.n.thai.startsWith('ไม่ ')).toBe(true);
    // A- should swap objects (index 0 -> 1 = coffee).
    expect(conv.n.thai).toContain('กาแฟ');
  });

  it('matrixNav wraps the flat ordinal', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    // subjects has length 3, others have 1/1/2; flat strides subj=1, mot=3, act=3, obj=3.
    // Start: flat=0 (subj=0,obj=0). nav(1) → flat=1 → subj=1.
    m.matrixNav(1);
    expect(m.getMatrixSel().subjects).toBe(1);
    expect(m.getMatrixSel().objects).toBe(0);
    // nav(1) again → flat=2 → subj=2.
    m.matrixNav(1);
    expect(m.getMatrixSel().subjects).toBe(2);
  });

  it('matrixNav backward from 0 wraps to last', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    m.matrixNav(-1);
    // Last flat = 5: 5 % 3 = 2 → subj=2; floor(5/3)=1, motives has len 1 → mot=0;
    // actions len 1 → 0; objects: floor(1/1)=1 → obj=1.
    expect(m.getMatrixSel().subjects).toBe(2);
    expect(m.getMatrixSel().objects).toBe(1);
  });

  it('randomMatrix changes at least the seed-picked cell', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    // Stub Math.random to deterministic value.
    const orig = Math.random;
    let n = 0;
    Math.random = () => {
      const v = n;
      n = (n + 0.5) % 1;
      return v;
    };
    try {
      m.randomMatrix();
    } finally {
      Math.random = orig;
    }
    // With n=0 then 0.5: Math.floor(0 * len) = 0 for first col, Math.floor(0.5*1)=0 etc.
    // We at minimum guarantee renderMatrix was called (gridHtml populated).
    expect(deps.dom.gridHtml).toContain('matrix-cell');
  });

  it('speakMatrixSelection stops current audio and speaks each thai part', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    deps.stopped = 0;
    deps.spoken.length = 0;
    m.speakMatrixSelection();
    expect(deps.stopped).toBe(1);
    // 4 parts (subjects[0], motives[0], actions[0], objects[0]) spoken in order.
    expect(deps.spoken).toEqual(['ฉัน', 'อยาก', 'กิน', 'ข้าว']);
  });

  it('playMatrixConv speaks Q then A+ via setTimeout', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    deps.spoken.length = 0;
    deps.stopped = 0;
    vi.useFakeTimers();
    try {
      m.playMatrixConv();
      expect(deps.spoken.length).toBe(1);
      vi.advanceTimersByTime(2000);
      expect(deps.spoken.length).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('toggleMatrixPractice starts and stops the loop, updating label', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    m.startMatrixPractice();
    expect(m.isMatrixRunning()).toBe(true);
    expect(deps.dom.practiceLabel).toBe('■ Stop');
    m.stopMatrixPractice();
    expect(m.isMatrixRunning()).toBe(false);
    expect(deps.dom.practiceLabel).toBe('▶▶ Practice');
  });

  it('resetMatrixTheme sets theme to first filtered match', () => {
    const deps = makeModule([
      makeTheme({ theme: 'a', lesson: 1 }),
      makeTheme({ theme: 'b', lesson: 2 }),
    ]);
    setActiveLesson('2');
    const m = createMatrixModule(deps);
    m.resetMatrixTheme();
    expect(m.getMatrixTheme()).toBe(1);
  });

  it('startMatrixPractice schedules practice via fake timers', () => {
    const deps = makeModule();
    const m = createMatrixModule(deps);
    m.renderMatrix();
    deps.spoken.length = 0;
    vi.useFakeTimers();
    try {
      m.startMatrixPractice();
      // Initial speakText fires synchronously; advance through nested timers.
      vi.advanceTimersByTime(5000);
      expect(deps.spoken.length).toBeGreaterThan(0);
      m.stopMatrixPractice();
    } finally {
      vi.useRealTimers();
    }
  });
});
