// Solo Leveling Phase 2: HUD (rank emblem + XP bar) that mounts in the
// existing top-bar and updates reactively as the player gains XP.
//
// Vanilla DOM only — no React, no virtual DOM. Re-render is debounced via
// requestAnimationFrame so a burst of `srs:review` events doesn't repaint 10
// times. The render is wrapped in try/catch so a store failure can never
// break the rest of the page.

import { gameBus, type GameEventType } from '../state/events';
import {
  RANKS,
  TIERS_PER_RANK,
  xpForNextLevel,
  type Rank,
} from '../state/player';
import { snapshotPlayer } from '../state/playerEngine';

let mountedUnsubscribe: (() => void) | null = null;

function isMaxed(rank: Rank, tier: number): boolean {
  return rank === 'S' && tier >= TIERS_PER_RANK;
}

/**
 * Build the static HUD skeleton into `mountPoint`. Returns the handles
 * (elements + unsubscribe) the re-render path needs. Idempotent: if the
 * mount already contains our skeleton, reuses it.
 *
 * Split out from `mountSlHud` so tests can drive render without going
 * through the gameBus subscription lifecycle.
 */
function buildSkeleton(mountPoint: HTMLElement): {
  emblem: HTMLElement;
  emblemLetter: HTMLElement;
  tierLabel: HTMLElement;
  xpFill: HTMLElement;
  xpText: HTMLElement;
  streak: HTMLElement;
} {
  mountPoint.innerHTML = '';
  mountPoint.classList.add('sl-hud');

  const emblem = document.createElement('div');
  emblem.className = 'sl-emblem';
  emblem.setAttribute('data-rank', 'E');
  const emblemLetter = document.createElement('span');
  emblemLetter.className = 'sl-emblem-letter';
  emblemLetter.textContent = 'E';
  emblem.appendChild(emblemLetter);

  const tierLabel = document.createElement('span');
  tierLabel.className = 'sl-tier-label';
  tierLabel.textContent = 'E-1';

  const xpWrap = document.createElement('div');
  xpWrap.className = 'sl-xp-wrap';
  const xpBar = document.createElement('div');
  xpBar.className = 'sl-xp-bar';
  const xpFill = document.createElement('div');
  xpFill.className = 'sl-xp-fill';
  xpFill.style.width = '0%';
  xpBar.appendChild(xpFill);
  const xpText = document.createElement('span');
  xpText.className = 'sl-xp-text';
  xpWrap.appendChild(xpBar);
  xpWrap.appendChild(xpText);

  const streak = document.createElement('span');
  streak.className = 'sl-streak';
  streak.style.display = 'none';

  mountPoint.appendChild(emblem);
  mountPoint.appendChild(tierLabel);
  mountPoint.appendChild(xpWrap);
  mountPoint.appendChild(streak);

  return { emblem, emblemLetter, tierLabel, xpFill, xpText, streak };
}

/**
 * Paint the current `snapshotPlayer()` into the skeleton. Idempotent and
 * defensive — wraps every mutation in try/catch so a corrupt payload can
 * never throw into a gameBus listener (which would log but still be noisy).
 */
export function renderSlHud(): void {
  const mount = document.getElementById('sl-hud');
  if (!mount) return;
  // Defensive: bail if detached. document.body is null in some test setups;
  // treat that as "still usable" so unit tests don't need a fully wired body.
  if (document.body && !mount.isConnected) return;

  try {
    const snap = snapshotPlayer();
    const rank: Rank = (RANKS as readonly string[]).includes(snap.rank)
      ? (snap.rank as Rank)
      : 'E';
    const tier = Math.max(1, Math.min(TIERS_PER_RANK, snap.tier | 0));
    const xp = Math.max(0, Number.isFinite(snap.xp) ? snap.xp : 0);

    // Lazy skeleton: if a previous render built it, reuse. Otherwise build.
    let emblem = mount.querySelector<HTMLElement>('.sl-emblem');
    let emblemLetter = mount.querySelector<HTMLElement>('.sl-emblem-letter');
    let tierLabel = mount.querySelector<HTMLElement>('.sl-tier-label');
    let xpFill = mount.querySelector<HTMLElement>('.sl-xp-fill');
    let xpText = mount.querySelector<HTMLElement>('.sl-xp-text');
    let streak = mount.querySelector<HTMLElement>('.sl-streak');
    if (
      !emblem ||
      !emblemLetter ||
      !tierLabel ||
      !xpFill ||
      !xpText ||
      !streak
    ) {
      const skel = buildSkeleton(mount);
      emblem = skel.emblem;
      emblemLetter = skel.emblemLetter;
      tierLabel = skel.tierLabel;
      xpFill = skel.xpFill;
      xpText = skel.xpText;
      streak = skel.streak;
    }

    emblem.setAttribute('data-rank', rank);
    emblemLetter.textContent = rank;
    tierLabel.textContent = `${rank}-${tier}`;

    const need = xpForNextLevel(rank, tier);
    const maxed = isMaxed(rank, tier);

    if (maxed) {
      xpFill.style.width = '100%';
      xpFill.classList.add('sl-maxed');
      xpText.textContent = 'MAX';
      mount.classList.add('sl-hud--maxed');
    } else {
      const pct = need === Infinity || need <= 0 ? 0 : Math.min(100, (xp / need) * 100);
      xpFill.style.width = `${pct.toFixed(2)}%`;
      xpFill.classList.remove('sl-maxed');
      mount.classList.remove('sl-hud--maxed');
      xpText.textContent = `${formatInt(xp)} / ${formatInt(need)} XP`;
    }

    if (snap.streak >= 2) {
      streak.textContent = `🔥 ${snap.streak}`;
      streak.style.display = '';
    } else {
      streak.style.display = 'none';
      streak.textContent = '';
    }
  } catch (err) {
    // Never let a render failure break the page or the bus fan-out.
    console.error('[sl-hud] render failed:', err);
  }
}

function formatInt(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  return Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Mount the HUD into `mountPoint`, render once, and subscribe to gameBus
 * so any XP-granting event triggers a debounced re-render. Returns an
 * unmount function that removes the subscription and clears the mount.
 */
export function mountSlHud(mountPoint: HTMLElement): () => void {
  // Build skeleton explicitly so the HUD exists even before the first
  // gameBus event fires. renderSlHud is the single source of truth for
  // subsequent repaints (it locates the mount by id).
  mountPoint.id = mountPoint.id || 'sl-hud';
  buildSkeleton(mountPoint);
  renderSlHud();

  let rafHandle: number | null = null;
  const scheduleRender = (): void => {
    if (rafHandle !== null) return;
    rafHandle = requestAnimationFrame(() => {
      rafHandle = null;
      renderSlHud();
    });
  };

  // Subscribe to every event type — the engine fans out XP mutations and
  // we just repaint. One subscription per type keeps the bus tidy.
  const offs: Array<() => void> = [];
  const ALL_TYPES: GameEventType[] = [
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
  for (const t of ALL_TYPES) {
    offs.push(gameBus.on(t, scheduleRender));
  }

  const unsubscribe = (): void => {
    if (rafHandle !== null) {
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
    }
    for (const off of offs) off();
    offs.length = 0;
    try {
      mountPoint.innerHTML = '';
      mountPoint.classList.remove('sl-hud');
      mountPoint.classList.remove('sl-hud--maxed');
    } catch {
      /* ignore */
    }
  };

  mountedUnsubscribe = unsubscribe;
  return unsubscribe;
}

/**
 * Boot wiring for src/main.ts. Looks up #sl-hud, mounts, and stores the
 * unsubscribe handle on a module-level variable so a re-boot can clean
 * up first.
 */
export function wireSlHud(): void {
  const prev = mountedUnsubscribe;
  if (prev) {
    try {
      prev();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  }
  const el = document.getElementById('sl-hud');
  if (!el) {
    console.warn('[sl-hud] mount point #sl-hud not found — HUD disabled');
    return;
  }
  mountSlHud(el);
}

/** Test-only: clear the module-level unsubscribe handle between cases. */
export function __resetSlHudForTests(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
  }
  mountedUnsubscribe = null;
}
