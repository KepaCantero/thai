// Solo Leveling Phase 6: rank-up modal tests.
//
// Minimal StubElement DOM pattern (same as slHud.test.ts / slNotifications).
// Asserts: modal opens on rankUp=true level:up, ignores rankUp=false, and
// Escape closes it.

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { gameBus } from '../state/events';

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
    for (const tok of v.split(/\s+/)) {
      if (tok) this.classSet.add(tok);
    }
  }
  appendChild<T extends StubElement>(c: T): T {
    this.children.push(c);
    c.parent = this;
    return c;
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
  remove(): void {
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      if (idx >= 0) this.parent.children.splice(idx, 1);
    }
    this.parent = null;
    this.isConnected = false;
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
  removeEventListener(type: string, fn: (e: unknown) => void): void {
    const arr = this.listeners[type];
    if (!arr) return;
    const idx = arr.indexOf(fn);
    if (idx >= 0) arr.splice(idx, 1);
  }
  _fire(type: string, e?: unknown): void {
    for (const fn of this.listeners[type] ?? []) fn(e ?? {});
  }
}

function matches(el: StubElement, sel: string): boolean {
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  return false;
}

describe('slLevelUpModal', () => {
  let body: StubElement;
  let doc: {
    body: StubElement;
    createElement: (t: string) => StubElement;
    addEventListener: (t: string, fn: (e: unknown) => void) => void;
    removeEventListener: (t: string, fn: (e: unknown) => void) => void;
  };
  let keydownHandlers: Array<(e: { key: string }) => void>;

  beforeEach(async () => {
    body = new StubElement();
    body.isConnected = true;
    keydownHandlers = [];
    doc = {
      body,
      createElement: () => new StubElement(),
      addEventListener: (_t: string, fn: (e: unknown) => void) => {
        keydownHandlers.push(fn as (e: { key: string }) => void);
      },
      removeEventListener: (_t: string, fn: (e: unknown) => void) => {
        const idx = keydownHandlers.indexOf(fn as (e: { key: string }) => void);
        if (idx >= 0) keydownHandlers.splice(idx, 1);
      },
    };
    vi.stubGlobal('document', doc);
    vi.useFakeTimers();
    gameBus.clear();
    const mod = await import('./slLevelUpModal');
    mod.__resetSlLevelUpModalForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    gameBus.clear();
  });

  it('rankUp=true level:up sets the body class to open the modal', async () => {
    const { mountSlLevelUpModal } = await import('./slLevelUpModal');
    mountSlLevelUpModal();
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    expect(body.classList.contains('sl-levelup-open')).toBe(true);
  });

  it('rankUp=false level:up does NOT open the modal', async () => {
    const { mountSlLevelUpModal } = await import('./slLevelUpModal');
    mountSlLevelUpModal();
    gameBus.emit({ type: 'level:up', rank: 'E', tier: 2, levelsGained: 1, rankUp: false });
    expect(body.classList.contains('sl-levelup-open')).toBe(false);
  });

  it('Escape closes the modal', async () => {
    const { mountSlLevelUpModal } = await import('./slLevelUpModal');
    mountSlLevelUpModal();
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    expect(body.classList.contains('sl-levelup-open')).toBe(true);
    for (const fn of keydownHandlers) fn({ key: 'Escape' });
    expect(body.classList.contains('sl-levelup-open')).toBe(false);
  });

  it('auto-dismisses after the hold period', async () => {
    const { mountSlLevelUpModal } = await import('./slLevelUpModal');
    mountSlLevelUpModal();
    gameBus.emit({ type: 'level:up', rank: 'D', tier: 1, levelsGained: 1, rankUp: true });
    expect(body.classList.contains('sl-levelup-open')).toBe(true);
    vi.advanceTimersByTime(2600);
    expect(body.classList.contains('sl-levelup-open')).toBe(false);
  });

  it('showSlLevelUpModal sets the emblem rank and tier label', async () => {
    const { mountSlLevelUpModal, showSlLevelUpModal } = await import('./slLevelUpModal');
    mountSlLevelUpModal();
    showSlLevelUpModal('S', 5);
    const emblem = body.querySelector('.sl-levelup-emblem') as StubElement;
    expect(emblem.getAttribute('data-rank')).toBe('S');
    expect((emblem.querySelector('.sl-levelup-emblem-letter') as StubElement).textContent).toBe('S');
    expect((body.querySelector('.sl-levelup-tier') as StubElement).textContent).toBe('S-5');
  });

  it('unmount removes the level:up subscription', async () => {
    const { mountSlLevelUpModal } = await import('./slLevelUpModal');
    const before = gameBus.size();
    const unmount = mountSlLevelUpModal();
    expect(gameBus.size()).toBeGreaterThan(before);
    unmount();
    expect(gameBus.size()).toBe(before);
  });
});
