// Spike 5d: tests for the questions module.
//
// Setup mirrors the cards tests: state is manipulated via the real typed
// setters (no mocks), deletedQaStore is stubbed in-memory (node environment),
// and createQuestionsModule is fed in-memory deps via makeModule(). DOM writes
// go through a spy QuestionsDom so the rendering functions can be exercised
// without a real document.

import { beforeEach, describe, expect, it, vi } from 'vitest';

let deletedQaState: string[] = [];
vi.mock('../../persistence/stores', () => ({
  deletedQaStore: {
    get: () => deletedQaState,
    set: (v: string[]) => { deletedQaState = v; },
  },
}));

import { setActiveLesson, setDeck, setMode } from '../../state';
import type { Card, QaItem } from '../../types';
import {
  createQuestionsModule,
  type QuestionsDom,
  type QuestionsModuleDeps,
} from './module';

beforeEach(() => {
  setActiveLesson('all');
  setMode('questions');
  setDeck([]);
  deletedQaState = [];
});

function makeItem(overrides: Partial<QaItem> = {}): QaItem {
  return {
    type: 'qa',
    source: 'conversación',
    topic: 'saludos',
    tense: 'presente',
    q_thai: 'ไปไหน',
    q_phonetic: 'pai nǎi',
    q_es: 'pai nai',
    q_en: 'Where are you going?',
    q_spanish: '¿A dónde vas?',
    a_thai: 'ไปตลาด',
    a_phonetic: 'pai dtalàat',
    a_es: 'pai talat',
    a_en: "I'm going to the market.",
    a_spanish: 'Voy al mercado.',
    ...overrides,
  };
}

interface SpyDom extends QuestionsDom {
  gridHtml: string;
  progress: string;
}

function makeSpyDom(): SpyDom {
  return {
    gridHtml: '',
    progress: '',
    setGridHtml(html: string) { this.gridHtml = html; },
    setProgress(text: string) { this.progress = text; },
  };
}

function makeModule(overrides: Partial<QuestionsModuleDeps> = {}): {
  mod: ReturnType<typeof createQuestionsModule>;
  dom: SpyDom;
  speakText: ReturnType<typeof vi.fn>;
  stopCurrentAudio: ReturnType<typeof vi.fn>;
  renderWB: ReturnType<typeof vi.fn>;
  haptic: ReturnType<typeof vi.fn>;
  buildQuestionsDeck: ReturnType<typeof vi.fn>;
} {
  const dom = makeSpyDom();
  const speakText = vi.fn();
  const stopCurrentAudio = vi.fn();
  const renderWB = vi.fn((t: string) => `<wb>${t}</wb>`);
  const haptic = vi.fn();
  const buildQuestionsDeck = vi.fn((): QaItem[] => []);
  const mod = createQuestionsModule({
    buildQuestionsDeck,
    speakText,
    stopCurrentAudio,
    renderWB,
    haptic,
    confirm: () => true,
    dom,
    ...overrides,
  });
  return { mod, dom, speakText, stopCurrentAudio, renderWB, haptic, buildQuestionsDeck };
}

describe('questions module', () => {
  describe('renderQuestions', () => {
    it('renders empty hint when deck is empty', () => {
      const { mod, dom, buildQuestionsDeck } = makeModule();
      buildQuestionsDeck.mockReturnValue([]);

      mod.renderQuestions();

      expect(dom.gridHtml).toContain('No hay preguntas para esta lección');
      expect(dom.progress).toBe('0 Q&A');
    });

    it('renders N cards and writes count to progress', () => {
      const items = [makeItem(), makeItem({ q_thai: 'a', a_thai: 'b' }), makeItem({ q_thai: 'c', a_thai: 'd' })];
      const { mod, dom, buildQuestionsDeck } = makeModule();
      buildQuestionsDeck.mockReturnValue(items);

      mod.renderQuestions();

      expect(dom.progress).toBe('3 Q&A');
      // Three cards rendered — count q-card root divs.
      const matches = dom.gridHtml.match(/class="q-card"/g) || [];
      // cthaiMode adds extra classes; in non-cthai 'all' lesson it stays 'q-card'.
      expect(matches.length).toBe(3);
    });

    it('sorts cards by topic then tense', () => {
      const items = [
        makeItem({ topic: 'verbos', tense: 'pasado', q_thai: 'x1', a_thai: 'y1' }),
        makeItem({ topic: 'saludos', tense: 'presente', q_thai: 'x2', a_thai: 'y2' }),
        makeItem({ topic: 'verbos', tense: 'futuro', q_thai: 'x3', a_thai: 'y3' }),
      ];
      const { mod, dom, buildQuestionsDeck } = makeModule();
      buildQuestionsDeck.mockReturnValue(items);

      mod.renderQuestions();

      // saludos|presente comes before verbos|futuro comes before verbos|pasado.
      const firstIdx = dom.gridHtml.indexOf('x2');
      const secondIdx = dom.gridHtml.indexOf('x3');
      const thirdIdx = dom.gridHtml.indexOf('x1');
      expect(firstIdx).toBeLessThan(secondIdx);
      expect(secondIdx).toBeLessThan(thirdIdx);
    });

    it('renders cthai-only flipped cards when activeLesson is cthai', () => {
      setActiveLesson('cthai');
      const items = [makeItem()];
      const { mod, dom, buildQuestionsDeck } = makeModule();
      buildQuestionsDeck.mockReturnValue(items);

      mod.renderQuestions();

      expect(dom.gridHtml).toContain('q-card flipped cthai-only');
      expect(dom.gridHtml).not.toContain('qCardClick');
      expect(dom.gridHtml).not.toContain('qc-front');
    });
  });

  describe('renderQCard', () => {
    it('emits the inline onclick handler in non-cthai mode', () => {
      setActiveLesson('all');
      const { mod } = makeModule();
      const html = mod.renderQCard(makeItem(), 0);
      expect(html).toContain('onclick="qCardClick(this, 0)"');
      expect(html).toContain('qc-front');
      expect(html).toContain('¿A dónde vas?');
    });

    it('emits play-Q and play-A buttons bound to playQAudio', () => {
      const { mod } = makeModule();
      const html = mod.renderQCard(makeItem(), 7);
      expect(html).toContain("playQAudio(7,'q')");
      expect(html).toContain("playQAudio(7,'a')");
    });

    it('omits the back-side A block when a_thai is empty', () => {
      const { mod } = makeModule();
      const html = mod.renderQCard(makeItem({ a_thai: '' }), 0);
      // Front side still carries the Spanish answer label.
      expect(html).toContain('Pregunta');
      // No back-side play button for the answer, and no word breakdown for it.
      expect(html).not.toContain("playQAudio(0,'a')");
      expect(html).not.toContain('<wb></wb>');
    });

    it('renders word-by-word breakdown when renderWB is provided', () => {
      const { mod } = makeModule();
      const html = mod.renderQCard(makeItem(), 0);
      expect(html).toContain('<div class="qc-wb"><wb>ไปไหน</wb></div>');
      expect(html).toContain('<div class="qc-wb"><wb>ไปตลาด</wb></div>');
    });
  });

  describe('qCardClick', () => {
    it('toggles flipped class, persists state, stops audio, and speaks Q then A', () => {
      const { mod, dom, buildQuestionsDeck, speakText, stopCurrentAudio } = makeModule();
      buildQuestionsDeck.mockReturnValue([makeItem()]);
      mod.renderQuestions();

      const el = { classList: { contains: () => false, toggle: () => {} } } as unknown as HTMLElement;
      const spyToggle = vi.spyOn(el.classList, 'toggle' as any);

      // Capture the onDone callback passed to the first speakText call.
      mod.qCardClick(el, 0);

      expect(spyToggle).toHaveBeenCalledWith('flipped');
      expect(stopCurrentAudio).toHaveBeenCalled();
      expect(speakText).toHaveBeenCalledTimes(1);
      expect(speakText).toHaveBeenCalledWith('ไปไหน', expect.any(Function));

      // Simulate audio completion — should trigger the answer playback.
      const onDone = speakText.mock.calls[0][1] as () => void;
      onDone();
      expect(speakText).toHaveBeenCalledTimes(2);
      expect(speakText).toHaveBeenLastCalledWith('ไปตลาด');
    });

    it('speaks only A when Q is missing', () => {
      const { mod, buildQuestionsDeck, speakText } = makeModule();
      buildQuestionsDeck.mockReturnValue([makeItem({ q_thai: '' })]);
      mod.renderQuestions();
      const el = { classList: { contains: () => true, toggle: () => {} } } as unknown as HTMLElement;
      mod.qCardClick(el, 0);
      expect(speakText).toHaveBeenCalledTimes(1);
      expect(speakText).toHaveBeenLastCalledWith('ไปตลาด');
    });

    it('is a no-op when the index is out of range', () => {
      const { mod, buildQuestionsDeck, speakText, stopCurrentAudio } = makeModule();
      buildQuestionsDeck.mockReturnValue([]);
      mod.renderQuestions();
      const el = { classList: { contains: () => false, toggle: () => {} } } as unknown as HTMLElement;
      mod.qCardClick(el, 99);
      expect(stopCurrentAudio).toHaveBeenCalled();
      expect(speakText).not.toHaveBeenCalled();
    });
  });

  describe('playQAudio', () => {
    it('speaks just the Q or just the A and stops prior audio', () => {
      const { mod, buildQuestionsDeck, speakText, stopCurrentAudio } = makeModule();
      buildQuestionsDeck.mockReturnValue([makeItem()]);
      mod.renderQuestions();

      mod.playQAudio(0, 'q');
      expect(speakText).toHaveBeenLastCalledWith('ไปไหน');

      mod.playQAudio(0, 'a');
      expect(speakText).toHaveBeenLastCalledWith('ไปตลาด');

      expect(stopCurrentAudio).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteQCard', () => {
    it('persists deletion to the store and re-renders in questions mode', () => {
      const { mod, dom, buildQuestionsDeck, haptic } = makeModule();
      buildQuestionsDeck.mockReturnValue([makeItem()]);
      mod.renderQuestions();

      buildQuestionsDeck.mockReturnValue([]); // simulate the deletion taking effect
      deletedQaState = [];

      mod.deleteQCard(0);

      expect(deletedQaState).toEqual(['ไปไหน||ไปตลาด']);
      expect(haptic).toHaveBeenCalledWith(15);
      expect(dom.progress).toBe('0 Q&A'); // re-rendered with empty deck
    });

    it('does nothing when confirm is cancelled', () => {
      const { mod, buildQuestionsDeck } = makeModule({ confirm: () => false });
      buildQuestionsDeck.mockReturnValue([makeItem()]);
      mod.renderQuestions();

      mod.deleteQCard(0);

      expect(deletedQaState).toEqual([]);
    });

    it('delegates to renderDashboard when in cards mode', () => {
      setMode('cards');
      const card = { q_thai: 'q', a_thai: 'a' } as unknown as Card;
      setDeck([card]);
      const renderDashboard = vi.fn();
      const g = globalThis as unknown as { renderDashboard?: () => void };
      g.renderDashboard = renderDashboard;

      const { mod } = makeModule();
      mod.deleteQCard(0);

      expect(deletedQaState).toEqual(['q||a']);
      expect(renderDashboard).toHaveBeenCalled();

      delete g.renderDashboard;
    });

    it('is a no-op when the index is out of range', () => {
      const { mod } = makeModule();
      mod.deleteQCard(99);
      expect(deletedQaState).toEqual([]);
    });
  });

  describe('getQDeck', () => {
    it('returns the rendered deck', () => {
      const items = [makeItem(), makeItem({ q_thai: 'x' })];
      const { mod, buildQuestionsDeck } = makeModule();
      buildQuestionsDeck.mockReturnValue(items);
      mod.renderQuestions();
      expect(mod.getQDeck()).toHaveLength(2);
    });
  });
});
