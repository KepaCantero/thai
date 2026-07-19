// Solo Leveling Phase 4: Status Window overlay.
//
// Full-screen (mobile) / centered modal (desktop) takeover that opens when
// the user clicks the HUD. Shows the full player profile — emblem, tier,
// XP bar, 5-stat grid, streak totals, and a placeholder for titles
// (Phase 7 will populate that section).
//
// Vanilla DOM only. All render code is wrapped in try/catch so a corrupt
// snapshot can never throw into a gameBus listener. Listeners are attached
// on open and detached on close — no global key listeners leak across
// sessions.

import { gameBus, type GameEventType } from '../state/events';
import {
  RANKS,
  STAT_KEYS,
  TIERS_PER_RANK,
  TOTAL_LEVELS,
  absoluteLevel,
  xpForNextLevel,
  type Rank,
  type StatKey,
} from '../state/player';
import { snapshotPlayer } from '../state/playerEngine';
import { setActiveTitle, snapshotTitles } from '../state/titleEngine';
import {
  TITLE_CATEGORY_LABELS,
  TITLE_CATEGORY_ORDER,
  TITLE_DEFS,
  type TitleCategory,
  type TitleDef,
} from '../state/titles';

const BODY_OPEN_CLASS = 'sl-window-open';
const OVERLAY_CLASS = 'sl-window-overlay';

const STAT_LABELS: Record<StatKey, string> = {
  vocab: 'Vocab',
  grammar: 'Grammar',
  pronunciation: 'Pronun.',
  listening: 'Listen.',
  reading: 'Reading',
};

/**
 * Event types we subscribe to so the window re-renders live as XP changes.
 * Same set as the HUD plus mode:open for completeness.
 */
const REFRESH_TYPES: readonly GameEventType[] = [
  'srs:review',
  'card:known',
  'card:unknown',
  'lesson:complete',
  'conv:play',
  'tone:correct',
  'tone:wrong',
  'shadow:rep',
  'mode:open',
  'study:tick',
];

let overlayEl: HTMLElement | null = null;
let docClickHandler: ((e: Event) => void) | null = null;
let docKeyHandler: ((e: KeyboardEvent) => void) | null = null;
let overlayClickHandler: ((e: Event) => void) | null = null;
let closeBtnHandler: (() => void) | null = null;
let titlesClickHandler: ((e: Event) => void) | null = null;
let isOpen = false;
let rafHandle: number | null = null;
const refreshOffs: Array<() => void> = [];
let mountedUnsubscribe: (() => void) | null = null;

function isMaxed(rank: Rank, tier: number): boolean {
  return rank === 'S' && tier >= TIERS_PER_RANK;
}

function formatInt(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  return Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Build the static skeleton of the overlay once. Subsequent re-renders
 * locate elements by class and paint fresh values into them. Idempotent —
 * if `overlayEl` already exists, reuses it.
 */
function buildSkeleton(): HTMLElement {
  if (overlayEl) return overlayEl;

  const overlay = document.createElement('div');
  overlay.className = OVERLAY_CLASS;

  const win = document.createElement('div');
  win.className = 'sl-window';

  const close = document.createElement('button');
  close.className = 'sl-window-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Cerrar ventana');
  close.textContent = '✕';

  // Header: emblem + tier label
  const header = document.createElement('div');
  header.className = 'sl-window-header';

  const emblem = document.createElement('div');
  emblem.className = 'sl-window-emblem';
  emblem.setAttribute('data-rank', 'E');
  const emblemLetter = document.createElement('span');
  emblemLetter.className = 'sl-window-emblem-letter';
  emblemLetter.textContent = 'E';
  emblem.appendChild(emblemLetter);

  const tierLabel = document.createElement('div');
  tierLabel.className = 'sl-window-tier-label';
  tierLabel.textContent = 'E-1 · Lv 1';

  header.appendChild(emblem);
  header.appendChild(tierLabel);

  // XP section
  const xpWrap = document.createElement('div');
  xpWrap.className = 'sl-window-xp-wrap';
  const xpBar = document.createElement('div');
  xpBar.className = 'sl-window-xp-bar';
  const xpFill = document.createElement('div');
  xpFill.className = 'sl-window-xp-fill';
  xpFill.style.width = '0%';
  xpBar.appendChild(xpFill);
  const xpText = document.createElement('div');
  xpText.className = 'sl-window-xp-text';
  xpText.textContent = '0 / 0 XP';
  xpWrap.appendChild(xpBar);
  xpWrap.appendChild(xpText);

  // Stats section
  const statsTitle = document.createElement('div');
  statsTitle.className = 'sl-window-section-title';
  statsTitle.textContent = 'Stats';

  const statsGrid = document.createElement('div');
  statsGrid.className = 'sl-window-stats-grid';
  for (const k of STAT_KEYS) {
    const tile = document.createElement('div');
    tile.className = 'sl-window-stat-tile';
    tile.setAttribute('data-stat', k);

    const name = document.createElement('div');
    name.className = 'sl-window-stat-name';
    name.textContent = STAT_LABELS[k];

    const value = document.createElement('div');
    value.className = 'sl-window-stat-value';
    value.textContent = '0';

    const miniBar = document.createElement('div');
    miniBar.className = 'sl-window-stat-bar';
    const miniFill = document.createElement('div');
    miniFill.className = 'sl-window-stat-fill';
    miniFill.style.width = '0%';
    miniBar.appendChild(miniFill);

    tile.appendChild(name);
    tile.appendChild(value);
    tile.appendChild(miniBar);
    statsGrid.appendChild(tile);
  }

  // Progress section
  const progressTitle = document.createElement('div');
  progressTitle.className = 'sl-window-section-title';
  progressTitle.textContent = 'Progress';

  const progressList = document.createElement('div');
  progressList.className = 'sl-window-progress-list';

  const totalXpRow = makeProgressRow('Total XP', '0');
  const streakRow = makeProgressRow('Streak', '0 días');
  const longestRow = makeProgressRow('Longest streak', '0 días');
  progressList.appendChild(totalXpRow.el);
  progressList.appendChild(streakRow.el);
  progressList.appendChild(longestRow.el);

  // Titles section (Phase 7: tiles grouped by category, painted live).
  const titlesTitle = document.createElement('div');
  titlesTitle.className = 'sl-window-section-title';
  titlesTitle.textContent = 'Titles';
  const titlesBody = document.createElement('div');
  titlesBody.className = 'sl-window-titles';
  // Inner container is what paint() repopulates on each tick. A stable
  // inner element keeps the delegated click handler attached across paints.
  const titlesInner = document.createElement('div');
  titlesInner.className = 'sl-title-root';
  titlesBody.appendChild(titlesInner);

  win.appendChild(close);
  win.appendChild(header);
  win.appendChild(xpWrap);
  win.appendChild(statsTitle);
  win.appendChild(statsGrid);
  win.appendChild(progressTitle);
  win.appendChild(progressList);
  win.appendChild(titlesTitle);
  win.appendChild(titlesBody);
  overlay.appendChild(win);

  overlayEl = overlay;
  return overlay;
}

function makeProgressRow(label: string, value: string): {
  el: HTMLElement;
  value: HTMLElement;
} {
  const row = document.createElement('div');
  row.className = 'sl-window-progress-row';
  const lab = document.createElement('span');
  lab.className = 'sl-window-progress-label';
  lab.textContent = label;
  const val = document.createElement('span');
  val.className = 'sl-window-progress-value';
  val.textContent = value;
  row.appendChild(lab);
  row.appendChild(val);
  return { el: row, value: val };
}

/**
 * Paint the current snapshot into the skeleton. Defensive — any failure
 * is logged and swallowed so it can never crash a click handler or a
 * gameBus listener.
 */
function paint(): void {
  if (!overlayEl) return;
  try {
    const snap = snapshotPlayer();
    const rank: Rank = (RANKS as readonly string[]).includes(snap.rank)
      ? (snap.rank as Rank)
      : 'E';
    const tier = Math.max(1, Math.min(TIERS_PER_RANK, snap.tier | 0));
    const xp = Math.max(0, Number.isFinite(snap.xp) ? snap.xp : 0);
    const lvl = Math.max(1, Math.min(TOTAL_LEVELS, absoluteLevel(rank, tier)));

    const emblem = overlayEl.querySelector<HTMLElement>('.sl-window-emblem');
    const emblemLetter = overlayEl.querySelector<HTMLElement>(
      '.sl-window-emblem-letter',
    );
    const tierLabel = overlayEl.querySelector<HTMLElement>(
      '.sl-window-tier-label',
    );
    if (emblem) emblem.setAttribute('data-rank', rank);
    if (emblemLetter) emblemLetter.textContent = rank;
    if (tierLabel) tierLabel.textContent = `${rank}-${tier} · Lv ${lvl}`;

    const xpFill = overlayEl.querySelector<HTMLElement>('.sl-window-xp-fill');
    const xpText = overlayEl.querySelector<HTMLElement>('.sl-window-xp-text');
    const maxed = isMaxed(rank, tier);
    if (xpFill && xpText) {
      if (maxed) {
        xpFill.style.width = '100%';
        xpFill.classList.add('sl-maxed');
        xpText.textContent = 'MAX';
      } else {
        const need = xpForNextLevel(rank, tier);
        const pct =
          need === Infinity || need <= 0 ? 0 : Math.min(100, (xp / need) * 100);
        xpFill.style.width = `${pct.toFixed(2)}%`;
        xpFill.classList.remove('sl-maxed');
        xpText.textContent = `${formatInt(xp)} / ${formatInt(need)} XP`;
      }
    }

    // Stats: mini bars relative to the max stat across all 5.
    const stats = snap.stats;
    let maxStat = 1;
    for (const k of STAT_KEYS) {
      const v = Math.max(0, Math.floor(stats[k] | 0));
      if (v > maxStat) maxStat = v;
    }
    for (const k of STAT_KEYS) {
      const tile = overlayEl.querySelector<HTMLElement>(
        `.sl-window-stat-tile[data-stat="${k}"]`,
      );
      if (!tile) continue;
      const v = Math.max(0, Math.floor(stats[k] | 0));
      const valueEl = tile.querySelector<HTMLElement>('.sl-window-stat-value');
      const fillEl = tile.querySelector<HTMLElement>('.sl-window-stat-fill');
      if (valueEl) valueEl.textContent = formatInt(v);
      if (fillEl) fillEl.style.width = `${((v / maxStat) * 100).toFixed(2)}%`;
    }

    // Progress rows
    const rows = overlayEl.querySelectorAll<HTMLElement>(
      '.sl-window-progress-value',
    );
    if (rows.length >= 3) {
      rows[0].textContent = formatInt(
        Math.max(0, Number.isFinite(snap.totalXp) ? snap.totalXp : 0),
      );
      rows[1].textContent = `🔥 ${Math.max(0, snap.streak | 0)} días`;
      rows[2].textContent = `${Math.max(0, snap.longestStreak | 0)} días`;
    }

    paintTitles();
  } catch (err) {
    console.error('[sl-status-window] paint failed:', err);
  }
}

/**
 * Rebuild the titles grid from the current TitlesState. Called on every
 * paint() so newly-unlocked titles show up live. The root element (with the
 * delegated click handler attached) stays in place; only its children are
 * replaced.
 */
function paintTitles(): void {
  if (!overlayEl) return;
  const root = overlayEl.querySelector<HTMLElement>('.sl-title-root');
  if (!root) return;

  try {
    const state = snapshotTitles();
    const unlocked = new Set(state.unlocked);
    const active = state.activeTitle;

    // Clear children.
    root.textContent = '';

    if (unlocked.size === 0) {
      const hint = document.createElement('div');
      hint.className = 'sl-title-empty';
      hint.textContent = 'Study more to unlock titles.';
      root.appendChild(hint);
      return;
    }

    // Group titles by category (in canonical order). Skip a category if it
    // has no definitions at all (keeps the UI clean if catalogue shrinks).
    for (const cat of TITLE_CATEGORY_ORDER) {
      const defs = TITLE_DEFS.filter((d) => d.category === cat);
      if (defs.length === 0) continue;

      const header = document.createElement('div');
      header.className = 'sl-title-category-header';
      header.textContent = TITLE_CATEGORY_LABELS[cat];
      root.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'sl-title-grid';
      for (const def of defs) {
        grid.appendChild(buildTitleTile(def, unlocked.has(def.id), active === def.id));
      }
      root.appendChild(grid);
    }
  } catch (err) {
    console.error('[sl-status-window] paintTitles failed:', err);
  }
}

function buildTitleTile(
  def: TitleDef,
  isUnlocked: boolean,
  isActive: boolean,
): HTMLElement {
  const tile = document.createElement('div');
  // Locked → muted; unlocked → normal; active → cyan glow + ribbon.
  tile.className = 'sl-title-tile';
  if (isActive) tile.classList.add('sl-title-tile-active');
  else if (isUnlocked) tile.classList.add('sl-title-tile-unlocked');
  else tile.classList.add('sl-title-tile-locked');
  tile.setAttribute('data-title-id', def.id);
  tile.setAttribute('data-category', def.category);

  if (isUnlocked) {
    // Unlock-equippable tiles are keyboard-focusable buttons.
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', `Equip title ${def.label}`);
  } else {
    tile.setAttribute('aria-disabled', 'true');
  }

  const label = document.createElement('div');
  label.className = 'sl-title-tile-label';
  label.textContent = isUnlocked ? def.label : '🔒 ' + def.label;

  const desc = document.createElement('div');
  desc.className = 'sl-title-tile-desc';
  desc.textContent = def.description;

  tile.appendChild(label);
  tile.appendChild(desc);
  return tile;
}

/**
 * Delegated click handler for the titles grid. Equipping is the only action —
 * clicking a locked tile is a no-op.
 */
function onTitlesClick(e: Event): void {
  try {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const tile = target.closest<HTMLElement>('.sl-title-tile');
    if (!tile) return;
    if (tile.classList.contains('sl-title-tile-locked')) return;
    const id = tile.getAttribute('data-title-id');
    if (!id) return;
    // Toggle: clicking the active title unequips it.
    const wasActive = tile.classList.contains('sl-title-tile-active');
    const ok = setActiveTitle(wasActive ? null : id);
    if (ok) paintTitles();
  } catch (err) {
    console.error('[sl-status-window] titles click failed:', err);
  }
}

/**
 * Attach the open/close listeners. Called on open; detached on close so
 * no Escape listener leaks while the window is hidden.
 */
function attachLifecycle(): void {
  if (!overlayEl) return;
  closeBtnHandler = (): void => {
    try {
      closeSlStatusWindow();
    } catch {
      /* ignore */
    }
  };
  overlayClickHandler = (e: Event): void => {
    // Close when the click lands on the backdrop (overlay itself), not the
    // inner window.
    const target = e.target as HTMLElement | null;
    if (target && target.classList.contains(OVERLAY_CLASS)) {
      try {
        closeSlStatusWindow();
      } catch {
        /* ignore */
      }
    }
  };
  docKeyHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      try {
        closeSlStatusWindow();
      } catch {
        /* ignore */
      }
    }
  };

  const closeBtn = overlayEl.querySelector<HTMLElement>('.sl-window-close');
  closeBtn?.addEventListener('click', closeBtnHandler);
  overlayEl.addEventListener('click', overlayClickHandler);

  // Delegated click handler on the titles grid (Phase 7). Attached to the
  // stable `.sl-title-root` element so it survives paint() rebuilds.
  titlesClickHandler = onTitlesClick;
  const titlesRoot = overlayEl.querySelector<HTMLElement>('.sl-title-root');
  titlesRoot?.addEventListener('click', titlesClickHandler);

  document.addEventListener('keydown', docKeyHandler);
}

function detachLifecycle(): void {
  if (docKeyHandler) {
    document.removeEventListener('keydown', docKeyHandler);
    docKeyHandler = null;
  }
  if (overlayEl && titlesClickHandler) {
    const titlesRoot = overlayEl.querySelector<HTMLElement>('.sl-title-root');
    titlesRoot?.removeEventListener('click', titlesClickHandler);
    titlesClickHandler = null;
  }
  if (overlayEl && overlayClickHandler) {
    overlayEl.removeEventListener('click', overlayClickHandler);
    overlayClickHandler = null;
  }
  if (overlayEl) {
    const closeBtn = overlayEl.querySelector<HTMLElement>('.sl-window-close');
    if (closeBtn && closeBtnHandler) {
      closeBtn.removeEventListener('click', closeBtnHandler);
    }
  }
  closeBtnHandler = null;
}

/**
 * Subscribe to gameBus so the window repaints live while open. Detached
 * when the window closes — no wasted cycles while hidden.
 */
function attachRefresh(): void {
  if (refreshOffs.length > 0) return;
  const schedule = (): void => {
    if (!isOpen) return;
    if (rafHandle !== null) return;
    rafHandle = requestAnimationFrame(() => {
      rafHandle = null;
      paint();
    });
  };
  for (const t of REFRESH_TYPES) {
    refreshOffs.push(gameBus.on(t, schedule));
  }
}

function detachRefresh(): void {
  if (rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
  for (const off of refreshOffs) off();
  refreshOffs.length = 0;
}

/**
 * Boot-secure open. Builds the skeleton if needed, paints, attaches
 * lifecycle listeners, and locks body scroll.
 */
export function openSlStatusWindow(): void {
  try {
    const overlay = buildSkeleton();
    if (!document.body.contains(overlay)) {
      document.body.appendChild(overlay);
    }
    paint();
    attachLifecycle();
    attachRefresh();
    isOpen = true;
    document.body.classList.add(BODY_OPEN_CLASS);
  } catch (err) {
    console.error('[sl-status-window] open failed:', err);
  }
}

/**
 * Close. Detaches listeners + refresh subscription, unlocks body scroll.
 * Leaves the overlay in the DOM so re-opening is cheap.
 */
export function closeSlStatusWindow(): void {
  try {
    detachLifecycle();
    detachRefresh();
    isOpen = false;
    document.body.classList.remove(BODY_OPEN_CLASS);
  } catch (err) {
    console.error('[sl-status-window] close failed:', err);
  }
}

/**
 * Mount the overlay + HUD click handler. Returns an unmount that tears
 * everything down (used by tests and re-boots).
 */
export function mountSlStatusWindow(): () => void {
  // Build skeleton and attach it to body up front. CSS keeps it hidden
  // (display: none) until body.sl-window-open flips it on. This matches the
  // spec: "appends the overlay DOM to document.body" in mount.
  const overlay = buildSkeleton();
  if (!document.body.contains(overlay)) {
    document.body.appendChild(overlay);
  }

  docClickHandler = (e: Event): void => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Any click inside #sl-hud opens the window. closest() handles clicks
      // on the inner emblem/tier/xp elements too.
      if (target.closest && target.closest('#sl-hud')) {
        openSlStatusWindow();
      }
    } catch {
      /* never throw from a delegated click */
    }
  };
  document.addEventListener('click', docClickHandler);

  const unsubscribe = (): void => {
    try {
      closeSlStatusWindow();
    } catch {
      /* ignore */
    }
    if (docClickHandler) {
      document.removeEventListener('click', docClickHandler);
      docClickHandler = null;
    }
    detachLifecycle();
    detachRefresh();
    if (overlayEl && overlayEl.parentElement) {
      overlayEl.parentElement.removeChild(overlayEl);
    }
    overlayEl = null;
  };

  mountedUnsubscribe = unsubscribe;
  return unsubscribe;
}

/**
 * Boot wiring for src/main.ts. Idempotent — calling twice cleans up the
 * previous mount first, so a re-boot doesn't double-add overlays.
 */
export function wireSlStatusWindow(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  }
  mountSlStatusWindow();
}

/** Test-only: tear down any mounted state. */
export function __resetSlStatusWindowForTests(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  } else {
    // Still clear module-level handles so cases that bypass mount() can't
    // leak state into the next case.
    detachLifecycle();
    detachRefresh();
    if (overlayEl && overlayEl.parentElement) {
      overlayEl.parentElement.removeChild(overlayEl);
    }
    overlayEl = null;
    isOpen = false;
  }
}
