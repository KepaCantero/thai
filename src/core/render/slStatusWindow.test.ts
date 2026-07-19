// Solo Leveling Phase 4: Status Window tests.
//
// Vitest's default environment here is 'node' (no jsdom), so we stub a
// minimal DOM. The stub is richer than slHud.test.ts because the Status
// Window uses closest(), removeEventListener, body.contains(), removeChild,
// parentElement, and attribute selectors — all of which the HUD never
// touched.

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
  private classSet = new Set<string>();
  private attrs = new Map<string, string>();
  private styles: Record<string, string> = {};
  private listeners: Record<string, Array<(e: unknown) => void>> = {};

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
  get parentElement(): StubElement | null {
    return this.parent;
  }
  appendChild<T extends StubElement>(c: T): T {
    this.children.push(c);
    c.parent = this;
    return c;
  }
  removeChild<T extends StubElement>(c: T): T {
    const i = this.children.indexOf(c);
    if (i >= 0) this.children.splice(i, 1);
    c.parent = null;
    return c;
  }
  contains(other: StubElement | null): boolean {
    if (!other) return false;
    let cur: StubElement | null = other;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parent;
    }
    return false;
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
    /* no-op for compat */
  }
  addEventListener(type: string, fn: (e: unknown) => void): void {
    (this.listeners[type] ??= []).push(fn);
  }
  removeEventListener(type: string, fn: (e: unknown) => void): void {
    const arr = this.listeners[type];
    if (!arr) return;
    const i = arr.indexOf(fn);
    if (i >= 0) arr.splice(i, 1);
  }
  /** Test helper: fire a DOM event at this element. */
  _fire(type: string, payload?: { target?: StubElement }): void {
    const arr = this.listeners[type];
    if (!arr) return;
    const event = { target: payload?.target ?? this };
    for (const fn of [...arr]) fn(event);
  }
  /** Test helper: list currently-attached listener counts by type. */
  _listenerCount(type: string): number {
    return this.listeners[type]?.length ?? 0;
  }
}

function matches(el: StubElement, sel: string): boolean {
  // Combined .class[attr="value"] — used by `.sl-window-stat-tile[data-stat="vocab"]`
  const combined = sel.match(/^\.([\w-]+)\[([\w-]+)="(.*)"\]$/);
  if (combined) {
    const [, cls, k, v] = combined;
    return el.classList.contains(cls) && el.getAttribute(k) === v;
  }
  // .class
  if (sel.startsWith('.')) {
    return el.classList.contains(sel.slice(1));
  }
  // [attr="value"] (quoted) — used by data-stat lookups
  const attrMatch = sel.match(/^\[([\w-]+)="(.*)"\]$/);
  if (attrMatch) {
    const [, k, v] = attrMatch;
    return el.getAttribute(k) === v;
  }
  // bare tag is not used here.
  return false;
}

/** Patched closest: walks parent chain, supporting #id and .class. */
function closestImpl(el: StubElement | null, sel: string): StubElement | null {
  let cur: StubElement | null = el;
  while (cur) {
    if (sel.startsWith('#')) {
      if (cur.id === sel.slice(1)) return cur;
    } else if (sel.startsWith('.')) {
      if (cur.classList.contains(sel.slice(1))) return cur;
    }
    cur = cur.parent;
  }
  return null;
}

function makeDoc() {
  const body = new StubElement();
  body.isConnected = true;
  const ids = new Map<string, StubElement>();
  const doc = {
    body,
    createElement(_tag: string): StubElement {
      const el = new StubElement();
      // Patch closest onto each new element so the click delegation test
      // works without a full DOM walker.
      (el as unknown as { closest: (s: string) => StubElement | null }).closest =
        (s: string): StubElement | null => closestImpl(el, s);
      return el;
    },
    getElementById(id: string): StubElement | null {
      return ids.get(id) ?? null;
    },
    addEventListener(type: string, fn: (e: unknown) => void): void {
      doc._docListeners.set(type, [...(doc._docListeners.get(type) ?? []), fn]);
    },
    removeEventListener(type: string, fn: (e: unknown) => void): void {
      const arr = doc._docListeners.get(type);
      if (!arr) return;
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    },
    _docListeners: new Map<string, Array<(e: unknown) => void>>(),
    _fireDoc(type: string, payload: unknown): void {
      const arr = doc._docListeners.get(type);
      if (!arr) return;
      for (const fn of [...arr]) fn(payload);
    },
    _register(id: string, el: StubElement): void {
      el.id = id;
      ids.set(id, el);
      body.appendChild(el);
      (el as unknown as { closest: (s: string) => StubElement | null }).closest =
        (s: string): StubElement | null => closestImpl(el, s);
    },
  };
  return doc;
}

// --- Mocks -----------------------------------------------------------------

const snapshotMock = vi.fn();
const titlesSnapshotMock = vi.fn();
const setActiveTitleMock = vi.fn();

vi.mock('../state/playerEngine', () => ({
  snapshotPlayer: (...args: unknown[]) => snapshotMock(...args),
}));

vi.mock('../state/titleEngine', () => ({
  snapshotTitles: () => titlesSnapshotMock(),
  setActiveTitle: (id: string | null) => setActiveTitleMock(id),
}));

// `../state/titles` is a pure catalogue — imported for real so the rendering
// exercises the real TITLE_DEFS + category groupings.

vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
  cb(0);
  return 0;
});
vi.stubGlobal('cancelAnimationFrame', () => {});

// --- Tests -----------------------------------------------------------------

describe('slStatusWindow', () => {
  let doc: ReturnType<typeof makeDoc>;
  let hud: StubElement;

  beforeEach(async () => {
    doc = makeDoc();
    hud = new StubElement();
    doc._register('sl-hud', hud);
    vi.stubGlobal('document', doc);
    snapshotMock.mockReset();
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    titlesSnapshotMock.mockReset();
    titlesSnapshotMock.mockReturnValue({
      v: 1,
      unlocked: [],
      activeTitle: null,
      lifetimeKnown: 0,
      lifetimeReviews: 0,
      lifetimeConvPlays: 0,
      lifetimeShadowReps: 0,
      allClearDays: 0,
    });
    setActiveTitleMock.mockReset();
    setActiveTitleMock.mockReturnValue(true);
    gameBus.clear();
    const mod = await import('./slStatusWindow');
    mod.__resetSlStatusWindowForTests();
  });

  afterEach(() => {
    gameBus.clear();
  });

  it('mountSlStatusWindow appends overlay to document.body', async () => {
    const { mountSlStatusWindow } = await import('./slStatusWindow');
    const before = doc.body.children.length;
    mountSlStatusWindow();
    expect(doc.body.children.length).toBeGreaterThanOrEqual(before);
    // An overlay element exists in the tree.
    const found = doc.body.querySelector('.sl-window-overlay');
    expect(found).not.toBeNull();
  });

  it('openSlStatusWindow sets body.sl-window-open class', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    expect(doc.body.classList.contains('sl-window-open')).toBe(false);
    openSlStatusWindow();
    expect(doc.body.classList.contains('sl-window-open')).toBe(true);
  });

  it('closeSlStatusWindow removes the body.sl-window-open class', async () => {
    const { mountSlStatusWindow, openSlStatusWindow, closeSlStatusWindow } =
      await import('./slStatusWindow');
    mountSlStatusWindow();
    openSlStatusWindow();
    closeSlStatusWindow();
    expect(doc.body.classList.contains('sl-window-open')).toBe(false);
  });

  it('clicking #sl-hud opens the window via delegation', async () => {
    const { mountSlStatusWindow } = await import('./slStatusWindow');
    mountSlStatusWindow();
    // Simulate a delegated click landing on a child of #sl-hud.
    doc._fireDoc('click', { target: hud });
    expect(doc.body.classList.contains('sl-window-open')).toBe(true);
  });

  it('Escape key closes the open window', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    openSlStatusWindow();
    expect(doc.body.classList.contains('sl-window-open')).toBe(true);
    doc._fireDoc('keydown', { key: 'Escape' });
    expect(doc.body.classList.contains('sl-window-open')).toBe(false);
  });

  it('re-render after a gameBus event updates the XP bar', async () => {
    const {
      mountSlStatusWindow,
      openSlStatusWindow,
    } = await import('./slStatusWindow');
    mountSlStatusWindow();
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const fillBefore = overlay.querySelector(
      '.sl-window-xp-fill',
    ) as StubElement;
    expect(fillBefore.style.width).toBe('0.00%');

    snapshotMock.mockReturnValue({
      ...defaultPlayerState(),
      v: 1,
      rank: 'E',
      tier: 1,
      xp: 50,
    });
    gameBus.emit({ type: 'tone:correct' });

    const fillAfter = overlay.querySelector(
      '.sl-window-xp-fill',
    ) as StubElement;
    // xpForNextLevel(E,1) = 100; 50/100 = 50%.
    expect(fillAfter.style.width).toBe('50.00%');
  });

  it('unmount removes the overlay from the body', async () => {
    const { mountSlStatusWindow } = await import('./slStatusWindow');
    const unmount = mountSlStatusWindow();
    expect(doc.body.querySelector('.sl-window-overlay')).not.toBeNull();
    unmount();
    expect(doc.body.querySelector('.sl-window-overlay')).toBeNull();
  });

  it('wireSlStatusWindow is idempotent (no double overlay)', async () => {
    const { wireSlStatusWindow } = await import('./slStatusWindow');
    wireSlStatusWindow();
    wireSlStatusWindow();
    const overlays = doc.body.querySelectorAll('.sl-window-overlay');
    expect(overlays.length).toBe(1);
  });

  it('clicking the backdrop (overlay itself) closes the window', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    overlay._fire('click', { target: overlay });
    expect(doc.body.classList.contains('sl-window-open')).toBe(false);
  });

  it('renders the 5 stat tiles', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    snapshotMock.mockReturnValue({
      ...defaultPlayerState(),
      v: 1,
      stats: {
        vocab: 42,
        grammar: 18,
        pronunciation: 7,
        listening: 23,
        reading: 11,
      },
    });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const tiles = overlay.querySelectorAll('.sl-window-stat-tile');
    expect(tiles.length).toBe(5);
    // Vocab is the max → its mini bar should be 100%.
    const vocabTile = overlay.querySelector(
      '.sl-window-stat-tile[data-stat="vocab"]',
    ) as StubElement;
    const vocabFill = vocabTile.querySelector(
      '.sl-window-stat-fill',
    ) as StubElement;
    expect(vocabFill.style.width).toBe('100.00%');
  });

  it('does not re-render while the window is closed', async () => {
    const { mountSlStatusWindow } = await import('./slStatusWindow');
    mountSlStatusWindow();
    snapshotMock.mockReturnValue({ ...defaultPlayerState(), v: 1 });
    // Window is closed — emit events; the rAF-scheduled paint should no-op.
    const beforeCalls = snapshotMock.mock.calls.length;
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    // rAF fires synchronously in the stub. snapshotMock is called by paint(),
    // but paint only runs if isOpen. So no new calls beyond the initial mount.
    expect(snapshotMock.mock.calls.length).toBe(beforeCalls);
  });

  it('paint swallows a throwing snapshot without crashing open', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    snapshotMock.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() => openSlStatusWindow()).not.toThrow();
  });

  // --- Phase 7: titles rendering -------------------------------------------

  it('shows the empty hint when no titles are unlocked', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const hint = overlay.querySelector('.sl-title-empty');
    expect(hint).not.toBeNull();
    expect((hint as StubElement).textContent).toContain('Study more');
  });

  it('renders category headers + a tile per title once something unlocks', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    titlesSnapshotMock.mockReturnValue({
      v: 1,
      unlocked: ['awakened', 'first-steps'],
      activeTitle: null,
      lifetimeKnown: 10,
      lifetimeReviews: 0,
      lifetimeConvPlays: 0,
      lifetimeShadowReps: 0,
      allClearDays: 0,
    });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    // Category headers: every category with at least one title definition.
    // 'reading' has no titles in the catalogue, so it's skipped (7 total).
    const headers = overlay.querySelectorAll('.sl-title-category-header');
    expect(headers.length).toBe(7);
    // Two unlocked tiles.
    const unlocked = overlay.querySelectorAll('.sl-title-tile-unlocked');
    expect(unlocked.length).toBe(2);
    // Every other catalogue title shows up as a locked tile.
    const locked = overlay.querySelectorAll('.sl-title-tile-locked');
    expect(locked.length).toBeGreaterThanOrEqual(1);
    // No active tile yet.
    expect(overlay.querySelectorAll('.sl-title-tile-active').length).toBe(0);
    // No empty hint when unlocked > 0.
    expect(overlay.querySelector('.sl-title-empty')).toBeNull();
  });

  it('marks the active title with the active class', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    titlesSnapshotMock.mockReturnValue({
      v: 1,
      unlocked: ['awakened'],
      activeTitle: 'awakened',
      lifetimeKnown: 0,
      lifetimeReviews: 0,
      lifetimeConvPlays: 0,
      lifetimeShadowReps: 0,
      allClearDays: 0,
    });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const active = overlay.querySelector(
      '.sl-title-tile-active[data-title-id="awakened"]',
    );
    expect(active).not.toBeNull();
  });

  it('clicking an unlocked tile calls setActiveTitle and re-paints', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    titlesSnapshotMock.mockReturnValue({
      v: 1,
      unlocked: ['awakened'],
      activeTitle: null,
      lifetimeKnown: 0,
      lifetimeReviews: 0,
      lifetimeConvPlays: 0,
      lifetimeShadowReps: 0,
      allClearDays: 0,
    });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const tile = overlay.querySelector(
      '.sl-title-tile-unlocked[data-title-id="awakened"]',
    ) as StubElement;
    expect(tile).not.toBeNull();
    // Simulate a delegated click landing on the tile.
    const root = overlay.querySelector('.sl-title-root') as StubElement;
    root._fire('click', { target: tile });
    expect(setActiveTitleMock).toHaveBeenCalledWith('awakened');
  });

  it('clicking a locked tile does not call setActiveTitle', async () => {
    const { mountSlStatusWindow, openSlStatusWindow } = await import(
      './slStatusWindow'
    );
    mountSlStatusWindow();
    titlesSnapshotMock.mockReturnValue({
      v: 1,
      unlocked: ['awakened'],
      activeTitle: null,
      lifetimeKnown: 0,
      lifetimeReviews: 0,
      lifetimeConvPlays: 0,
      lifetimeShadowReps: 0,
      allClearDays: 0,
    });
    openSlStatusWindow();
    const overlay = doc.body.querySelector('.sl-window-overlay') as StubElement;
    const tile = overlay.querySelector(
      '.sl-title-tile-locked',
    ) as StubElement;
    expect(tile).not.toBeNull();
    const root = overlay.querySelector('.sl-title-root') as StubElement;
    root._fire('click', { target: tile });
    expect(setActiveTitleMock).not.toHaveBeenCalled();
  });
});
