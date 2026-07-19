// Solo Leveling Phase 2: HUD tests.
//
// Vitest's default environment here is 'node', so we stub a minimal DOM
// (just the surface slHud.ts touches: getElementById, createElement,
// isConnected, classList, setAttribute, style, textContent, innerHTML,
// querySelector). This keeps the test fast and dependency-free.

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { gameBus } from '../state/events';
import { defaultPlayerState } from '../state/player';

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
    // Handle comma-separated selectors.
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
    /* no-op for compat */
  }
  addEventListener(type: string, fn: (e: unknown) => void): void {
    (this.listeners[type] ??= []).push(fn);
  }
}

function matches(el: StubElement, sel: string): boolean {
  if (sel.startsWith('.')) {
    return el.classList.contains(sel.slice(1));
  }
  return false;
}

function makeDoc() {
  const body = new StubElement();
  body.isConnected = true;
  const ids = new Map<string, StubElement>();
  const doc = {
    body,
    getElementById(id: string): StubElement | null {
      return ids.get(id) ?? null;
    },
    createElement(_tag: string): StubElement {
      return new StubElement();
    },
    _register(id: string, el: StubElement): void {
      el.id = id;
      ids.set(id, el);
      body.appendChild(el);
    },
  };
  return doc;
}

// --- Mocks -----------------------------------------------------------------

const snapshotMock = vi.fn();

vi.mock('../state/playerEngine', () => ({
  snapshotPlayer: (...args: unknown[]) => snapshotMock(...args),
}));

// Force rAF to fire synchronously so we don't need timers.
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
  cb(0);
  return 0;
});
vi.stubGlobal('cancelAnimationFrame', () => {});

// --- Tests -----------------------------------------------------------------

describe('slHud', () => {
  let doc: ReturnType<typeof makeDoc>;
  let mount: StubElement;

  beforeEach(async () => {
    doc = makeDoc();
    mount = new StubElement();
    doc._register('sl-hud', mount);
    vi.stubGlobal('document', doc);
    snapshotMock.mockReset();
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    gameBus.clear();
    const mod = await import('./slHud');
    mod.__resetSlHudForTests();
  });

  afterEach(() => {
    gameBus.clear();
  });

  it('renders fresh E-1 player with 0% XP and no streak', async () => {
    const { renderSlHud } = await import('./slHud');
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    renderSlHud();
    const emblem = mount.querySelector('.sl-emblem') as StubElement;
    expect(emblem?.getAttribute('data-rank')).toBe('E');
    expect(
      (mount.querySelector('.sl-emblem-letter') as StubElement).textContent,
    ).toBe('E');
    expect(
      (mount.querySelector('.sl-tier-label') as StubElement).textContent,
    ).toBe('E-1');
    const fill = mount.querySelector('.sl-xp-fill') as StubElement;
    expect(fill.style.width).toBe('0.00%');
    const streak = mount.querySelector('.sl-streak') as StubElement;
    expect(streak.style.display).toBe('none');
  });

  it('renders mid-game C-5 player with correct XP % and streak', async () => {
    const { renderSlHud } = await import('./slHud');
    snapshotMock.mockReturnValue({
      ...defaultPlayerState(),
      v: 1,
      rank: 'C',
      tier: 5,
      xp: 500,
      streak: 7,
    });
    renderSlHud();
    const emblem = mount.querySelector('.sl-emblem') as StubElement;
    expect(emblem.getAttribute('data-rank')).toBe('C');
    expect(
      (mount.querySelector('.tier-label, .sl-tier-label') as StubElement)
        .textContent,
    ).toBe('C-5');
    const fill = mount.querySelector('.sl-xp-fill') as StubElement;
    // xpForNextLevel(C,5) = floor(100 * 1.4^(30-1)) — large; pct tiny but > 0.
    const pct = parseFloat(fill.style.width);
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThan(1);
    const streak = mount.querySelector('.sl-streak') as StubElement;
    expect(streak.style.display).not.toBe('none');
    expect(streak.textContent).toBe('🔥 7');
  });

  it('shows MAX state at S-10', async () => {
    const { renderSlHud } = await import('./slHud');
    snapshotMock.mockReturnValue({
      ...defaultPlayerState(),
      v: 1,
      rank: 'S',
      tier: 10,
      xp: 0,
    });
    renderSlHud();
    const fill = mount.querySelector('.sl-xp-fill') as StubElement;
    expect(fill.style.width).toBe('100%');
    expect(fill.classList.contains('sl-maxed')).toBe(true);
    expect(mount.classList.contains('sl-hud--maxed')).toBe(true);
    expect(
      (mount.querySelector('.sl-xp-text') as StubElement).textContent,
    ).toBe('MAX');
  });

  it('hides streak when streak is 0 or 1', async () => {
    const { renderSlHud } = await import('./slHud');
    for (const streak of [0, 1]) {
      snapshotMock.mockReturnValue({
        ...defaultPlayerState(),
        v: 1,
        streak,
      });
      renderSlHud();
      const el = mount.querySelector('.sl-streak') as StubElement;
      expect(el.style.display).toBe('none');
    }
  });

  it('re-renders when a gameBus event fires', async () => {
    const { mountSlHud } = await import('./slHud');
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    mountSlHud(mount as unknown as HTMLElement);
    const fillBefore = mount.querySelector('.sl-xp-fill') as StubElement;
    expect(fillBefore.style.width).toBe('0.00%');

    snapshotMock.mockReturnValue({
      ...defaultPlayerState(),
      v: 1,
      rank: 'E',
      tier: 1,
      xp: 50,
    });
    gameBus.emit({ type: 'tone:correct' });

    const fillAfter = mount.querySelector('.sl-xp-fill') as StubElement;
    // need for E-1 = 100; 50/100 = 50%.
    expect(fillAfter.style.width).toBe('50.00%');
  });

  it('unmount removes all gameBus subscriptions', async () => {
    const { mountSlHud } = await import('./slHud');
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    const before = gameBus.size();
    const unmount = mountSlHud(mount as unknown as HTMLElement);
    const during = gameBus.size();
    expect(during).toBeGreaterThan(before);
    unmount();
    expect(gameBus.size()).toBe(before);
  });

  it('renderSlHud is a no-op when #sl-hud is missing', async () => {
    const { renderSlHud } = await import('./slHud');
    vi.stubGlobal('document', {
      ...doc,
      getElementById: () => null,
    });
    expect(() => renderSlHud()).not.toThrow();
  });

  it('renderSlHud swallows a throwing snapshot', async () => {
    const { renderSlHud } = await import('./slHud');
    snapshotMock.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() => renderSlHud()).not.toThrow();
  });
});
