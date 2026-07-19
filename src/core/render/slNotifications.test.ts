// Solo Leveling Phase 6: notifications tests.
//
// Reuses the minimal StubElement DOM pattern from slHud.test.ts (vitest's
// default env is 'node' — no jsdom). The sfx module is mocked so we can
// assert "sfx was called" and "throwing sfx doesn't break the toast".

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { gameBus } from '../state/events';

// --- Minimal DOM stub (copy of slHud.test.ts pattern) ----------------------

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
  // Test helper: fire a synthetic event at this element.
  _fire(type: string, e?: unknown): void {
    for (const fn of this.listeners[type] ?? []) fn(e ?? {});
  }
}

function matches(el: StubElement, sel: string): boolean {
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  return false;
}

function makeDoc() {
  const body = new StubElement();
  body.isConnected = true;
  const doc = {
    body,
    createElement(_tag: string): StubElement {
      return new StubElement();
    },
    addEventListener() {},
    removeEventListener() {},
  };
  return doc;
}

// --- Mocks -----------------------------------------------------------------

const playSfxMock = vi.fn();
vi.mock('../audio/sfx', () => ({
  playSfx: (...args: unknown[]) => playSfxMock(...args),
}));

// --- Tests -----------------------------------------------------------------

describe('slNotifications', () => {
  let doc: ReturnType<typeof makeDoc>;
  let fakeTimers: ReturnType<typeof vi.useFakeTimers>;

  beforeEach(async () => {
    doc = makeDoc();
    vi.stubGlobal('document', doc);
    vi.stubGlobal('window', { requestAnimationFrame: (cb: FrameRequestCallback) => { cb(0); return 0; } });
    fakeTimers = vi.useFakeTimers();
    playSfxMock.mockReset();
    gameBus.clear();
    const mod = await import('./slNotifications');
    mod.__resetSlNotificationsForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    gameBus.clear();
  });

  it('pushSlNotification adds a toast element to the stack', async () => {
    const { pushSlNotification } = await import('./slNotifications');
    pushSlNotification({ kind: 'info', title: 'Hello', body: 'World' });
    const stack = doc.body.querySelector('.sl-notifications-stack') as StubElement;
    expect(stack).toBeTruthy();
    const toast = stack.querySelector('.sl-notification') as StubElement;
    expect(toast).toBeTruthy();
    expect(toast.classList.contains('kind-info')).toBe(true);
    expect((toast.querySelector('.sl-notification-title') as StubElement).textContent).toBe('Hello');
    expect((toast.querySelector('.sl-notification-body') as StubElement).textContent).toBe('World');
  });

  it('plays sfx on push when provided', async () => {
    const { pushSlNotification } = await import('./slNotifications');
    pushSlNotification({ kind: 'success', title: 'X', sfx: 'quest-complete' });
    expect(playSfxMock).toHaveBeenCalledWith('quest-complete');
  });

  it('auto-dismisses after durationMs', async () => {
    const { pushSlNotification } = await import('./slNotifications');
    pushSlNotification({ kind: 'info', title: 'Temp', durationMs: 1000 });
    const stack = doc.body.querySelector('.sl-notifications-stack') as StubElement;
    expect(stack.querySelectorAll('.sl-notification').length).toBe(1);
    // Leaving class added at dismissal; remove() after 200ms fade.
    fakeTimers.advanceTimersByTime(1000);
    fakeTimers.advanceTimersByTime(250);
    expect(stack.querySelectorAll('.sl-notification').length).toBe(0);
  });

  it('level:up event (non rank-up) creates a LEVEL UP toast', async () => {
    const { mountSlNotifications } = await import('./slNotifications');
    mountSlNotifications();
    gameBus.emit({
      type: 'level:up',
      rank: 'E',
      tier: 2,
      levelsGained: 1,
      rankUp: false,
    });
    const toast = doc.body.querySelector('.sl-notification') as StubElement;
    expect(toast).toBeTruthy();
    expect((toast.querySelector('.sl-notification-title') as StubElement).textContent).toBe('LEVEL UP');
    expect(playSfxMock).toHaveBeenCalledWith('level-up');
  });

  it('level:up rankUp event creates a RANK UP toast', async () => {
    const { mountSlNotifications } = await import('./slNotifications');
    mountSlNotifications();
    gameBus.emit({
      type: 'level:up',
      rank: 'D',
      tier: 1,
      levelsGained: 1,
      rankUp: true,
    });
    const toast = doc.body.querySelector('.sl-notification') as StubElement;
    expect((toast.querySelector('.sl-notification-title') as StubElement).textContent).toBe('RANK UP! D-1');
    expect(playSfxMock).toHaveBeenCalledWith('rank-up');
  });

  it('a throwing sfx does not break the toast', async () => {
    playSfxMock.mockImplementation(() => {
      throw new Error('boom');
    });
    const { pushSlNotification } = await import('./slNotifications');
    expect(() =>
      pushSlNotification({ kind: 'info', title: 'OK', sfx: 'tick' }),
    ).not.toThrow();
    const toast = doc.body.querySelector('.sl-notification') as StubElement;
    expect(toast).toBeTruthy();
  });

  it('quest:complete event creates a QUEST COMPLETE toast', async () => {
    const { mountSlNotifications } = await import('./slNotifications');
    mountSlNotifications();
    gameBus.emit({ type: 'quest:complete', questId: 'q1' });
    const toast = doc.body.querySelector('.sl-notification') as StubElement;
    expect((toast.querySelector('.sl-notification-title') as StubElement).textContent).toBe('QUEST COMPLETE');
  });

  it('close button click dismisses the toast', async () => {
    const { pushSlNotification } = await import('./slNotifications');
    pushSlNotification({ kind: 'info', title: 'Sticky' });
    const stack = doc.body.querySelector('.sl-notifications-stack') as StubElement;
    const toast = stack.querySelector('.sl-notification') as StubElement;
    const close = toast.querySelector('.sl-notification-close') as StubElement;
    close._fire('click', { target: close });
    fakeTimers.advanceTimersByTime(250);
    expect(stack.querySelectorAll('.sl-notification').length).toBe(0);
  });

  it('unmount removes gameBus subscriptions', async () => {
    const { mountSlNotifications } = await import('./slNotifications');
    const before = gameBus.size();
    const unmount = mountSlNotifications();
    expect(gameBus.size()).toBeGreaterThan(before);
    unmount();
    expect(gameBus.size()).toBe(before);
  });
});
