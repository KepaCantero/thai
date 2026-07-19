// Solo Leveling Phase 5: Daily Quests panel tests.
//
// Vitest default env is 'node' — stub a minimal DOM (same shape slQuests.ts
// touches) so the test is fast and jsdom-free.

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { gameBus } from '../state/events';
import { freshDailyQuests, freshDailyQuestsInitialState } from '../state/quests';

// --- Minimal DOM stub ------------------------------------------------------

class StubElement {
  tagName = 'DIV';
  id = '';
  private _className = '';
  children: StubElement[] = [];
  parent: StubElement | null = null;
  isConnected = true;
  textContent = '';
  private _innerHTML = '';
  get innerHTML(): string {
    return this._innerHTML;
  }
  set innerHTML(v: string) {
    this._innerHTML = v;
    if (v === '') {
      for (const c of this.children) c.parent = null;
      this.children = [];
    }
  }
  private classSet = new Set<string>();
  private attrs = new Map<string, string>();
  private styles: Record<string, string> = {};
  private listeners: Record<string, Array<(e: unknown) => void>> = {};

  get className(): string {
    return this._className;
  }
  set className(v: string) {
    this._className = v;
    this.classSet.clear();
    for (const tok of v.split(/\s+/)) if (tok) this.classSet.add(tok);
  }

  appendChild<T extends StubElement>(c: T): T {
    this.children.push(c);
    c.parent = this;
    return c;
  }
  removeChild<T extends StubElement>(c: T): T {
    const idx = this.children.indexOf(c);
    if (idx >= 0) this.children.splice(idx, 1);
    c.parent = null;
    return c;
  }
  remove(): void {
    if (this.parent) this.parent.removeChild(this);
  }
  querySelector(sel: string): StubElement | null {
    return this.querySelectorAll(sel)[0] ?? null;
  }
  querySelectorAll(sel: string): StubElement[] {
    const sels = sel.split(',').map((s) => s.trim());
    const out: StubElement[] = [];
    const walk = (el: StubElement): void => {
      for (const c of el.children) {
        if (sels.some((s) => matches(c, s))) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  classList = {
    add: (...names: string[]): void => {
      for (const n of names) this.classSet.add(n);
      this._syncClassName();
    },
    remove: (...names: string[]): void => {
      for (const n of names) this.classSet.delete(n);
      this._syncClassName();
    },
    contains: (name: string): boolean => this.classSet.has(name),
    toggle: (name: string, force?: boolean): void => {
      const on = force ?? !this.classSet.has(name);
      if (on) this.classSet.add(name);
      else this.classSet.delete(name);
      this._syncClassName();
    },
  };
  private _syncClassName(): void {
    this._className = [...this.classSet].join(' ');
  }
  setAttribute(k: string, v: string): void {
    this.attrs.set(k, v);
  }
  getAttribute(k: string): string | null {
    return this.attrs.get(k) ?? null;
  }
  get style(): Record<string, string> {
    return this.styles;
  }
  set style(_v: unknown) {
    /* no-op */
  }
  addEventListener(type: string, fn: (e: unknown) => void): void {
    (this.listeners[type] ??= []).push(fn);
  }
}

function matches(el: StubElement, sel: string): boolean {
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  return false;
}

function makeDoc() {
  const body = new StubElement();
  body.isConnected = true;
  return {
    body,
    createElement: (_tag: string) => new StubElement(),
    createTextNode: (text: string) => {
      const el = new StubElement();
      el.textContent = text;
      return el;
    },
    querySelector: (sel: string) => body.querySelector(sel),
  };
}

// --- Mocks -----------------------------------------------------------------

const snapshotMock = vi.fn();

vi.mock('../state/questEngine', () => ({
  snapshotQuests: () => snapshotMock(),
}));

// Force rAF to fire synchronously; setTimeout is a no-op so the recursive
// countdown timer doesn't run during tests.
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
  cb(0);
  return 0;
});
vi.stubGlobal('cancelAnimationFrame', () => {});
vi.stubGlobal('setTimeout', (): ReturnType<typeof setTimeout> => 0 as unknown as ReturnType<typeof setTimeout>);
vi.stubGlobal('clearTimeout', () => {});

const TODAY = new Date().toISOString().slice(0, 10);

describe('slQuests', () => {
  let doc: ReturnType<typeof makeDoc>;

  beforeEach(async () => {
    doc = makeDoc();
    vi.stubGlobal('document', doc);
    snapshotMock.mockReset();
    snapshotMock.mockReturnValue(freshDailyQuestsInitialState());
    gameBus.clear();
    const mod = await import('./slQuests');
    mod.__resetSlQuestsForTests();
  });

  afterEach(() => {
    gameBus.clear();
  });

  it('mounts a panel on document.body with 4 quest rows', async () => {
    const { mountSlQuests } = await import('./slQuests');
    snapshotMock.mockReturnValue(freshDailyQuests(TODAY));
    mountSlQuests();
    const panel = doc.body.querySelector('.sl-quests-panel') as StubElement;
    expect(panel).toBeTruthy();
    const rows = panel.querySelectorAll('.sl-quest-row');
    expect(rows.length).toBe(4);
  });

  it('unmount removes panel + all bus subscriptions', async () => {
    const { mountSlQuests } = await import('./slQuests');
    snapshotMock.mockReturnValue(freshDailyQuests(TODAY));
    const before = gameBus.size();
    const unmount = mountSlQuests();
    expect(gameBus.size()).toBeGreaterThan(before);
    unmount();
    expect(gameBus.size()).toBe(before);
    expect(doc.body.querySelector('.sl-quests-panel')).toBeNull();
  });

  it('re-renders when a quest event fires', async () => {
    const { mountSlQuests } = await import('./slQuests');
    snapshotMock.mockReturnValue(freshDailyQuests(TODAY));
    mountSlQuests();
    const panel = doc.body.querySelector('.sl-quests-panel') as StubElement;
    const before = panel.querySelectorAll('.sl-quest-row-done').length;

    // Mark lessons complete in the next snapshot.
    const s2 = freshDailyQuests(TODAY);
    const lessons = s2.quests.find((q) => q.id === 'lessons')!;
    lessons.progress = 1;
    lessons.completed = true;
    snapshotMock.mockReturnValue(s2);
    gameBus.emit({ type: 'lesson:complete', lesson: 'L01' });

    const after = panel.querySelectorAll('.sl-quest-row-done').length;
    expect(after).toBeGreaterThan(before);
  });

  it('applies penalty class when penaltyActive is true', async () => {
    const { mountSlQuests } = await import('./slQuests');
    const s = freshDailyQuests(TODAY, 2);
    s.penaltyUntil = '2999-01-01'; // far future so penaltyActive is true
    snapshotMock.mockReturnValue(s);
    mountSlQuests();
    const panel = doc.body.querySelector('.sl-quests-panel') as StubElement;
    expect(panel.classList.contains('sl-quests-penalty')).toBe(true);
    const badge = panel.querySelector(
      '.sl-quests-penalty-badge',
    ) as StubElement;
    expect(badge.style.display).not.toBe('none');
  });

  it('applies all-clear class when every quest is complete', async () => {
    const { mountSlQuests } = await import('./slQuests');
    const s = freshDailyQuests(TODAY);
    for (const q of s.quests) {
      q.progress = q.goal;
      q.completed = true;
    }
    snapshotMock.mockReturnValue(s);
    mountSlQuests();
    const panel = doc.body.querySelector('.sl-quests-panel') as StubElement;
    const header = panel.querySelector('.sl-quests-header') as StubElement;
    expect(header.classList.contains('sl-quests-allclear')).toBe(true);
  });

  it('renderSlQuests is defensive and does not throw on missing panel', async () => {
    const { renderSlQuests } = await import('./slQuests');
    vi.stubGlobal('document', { ...doc, querySelector: () => null });
    expect(() => renderSlQuests()).not.toThrow();
  });
});
