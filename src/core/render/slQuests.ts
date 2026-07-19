// Solo Leveling Phase 5: floating Daily Quests window.
//
// Classic Solo Leveling "daily window" aesthetic — a small glass panel that
// floats at the bottom-right of the viewport, above all content, always
// visible. Shows the 4 daily quests, their progress bars, and a countdown
// to local midnight. Re-renders (rAF-debounced) on every quest-relevant
// gameBus event.

import { gameBus } from '../state/events';
import { snapshotQuests } from '../state/questEngine';
import {
  QUEST_DEFS,
  allCompleted,
  penaltyActive,
  type DailyQuestsState,
  type QuestProgress,
} from '../state/quests';

const QUEST_EVENT_TYPES = QUEST_DEFS.map((d) => d.eventType);

let mountedUnsubscribe: (() => void) | null = null;
let collapsed = false;

const today = (): string => new Date().toISOString().slice(0, 10);

/** ms from now until local midnight. */
function msUntilMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

function fmtHMS(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function fmtCount(q: QuestProgress, unit: string): string {
  if (unit === 'sec') {
    const mins = Math.floor(q.progress / 60);
    const goalMins = Math.floor(q.goal / 60);
    return `${mins}/${goalMins} min`;
  }
  return `${Math.floor(q.progress)}/${q.goal}`;
}

/**
 * Paint the current snapshot into the panel. Idempotent + defensive — wraps
 * every mutation in try/catch so a corrupt payload can never throw into a
 * gameBus listener.
 */
export function renderSlQuests(): void {
  const root = document.querySelector<HTMLElement>('.sl-quests-panel');
  if (!root) return;

  try {
    const state: DailyQuestsState = snapshotQuests();
    const isPenalty = penaltyActive(state, today());
    const allDone = allCompleted(state);

    root.classList.toggle('sl-quests-penalty', isPenalty);
    root.classList.toggle('sl-quests-collapsed', collapsed);

    // Header
    const countdown = root.querySelector<HTMLElement>('.sl-quests-countdown');
    if (countdown) countdown.textContent = fmtHMS(msUntilMidnight());

    const header = root.querySelector<HTMLElement>('.sl-quests-header');
    if (header) {
      header.classList.toggle('sl-quests-allclear', allDone);
      const allClearBadge = header.querySelector<HTMLElement>(
        '.sl-quests-allclear-badge',
      );
      if (allClearBadge) allClearBadge.style.display = allDone ? '' : 'none';

      const penaltyBadge = header.querySelector<HTMLElement>(
        '.sl-quests-penalty-badge',
      );
      if (penaltyBadge) penaltyBadge.style.display = isPenalty ? '' : 'none';
    }

    // Quest rows
    const body = root.querySelector<HTMLElement>('.sl-quests-body');
    if (!body) return;
    body.style.display = collapsed ? 'none' : '';

    // Rebuild rows each render — 4 rows is cheap and avoids stale state.
    body.innerHTML = '';
    for (const def of QUEST_DEFS) {
      const q = state.quests.find((x) => x.id === def.id);
      if (!q) continue;

      const row = document.createElement('div');
      row.className = 'sl-quest-row';
      if (q.completed) row.classList.add('sl-quest-row-done');

      const label = document.createElement('div');
      label.className = 'sl-quest-label';
      const check = document.createElement('span');
      check.className = 'sl-quest-check';
      check.textContent = '✓ ';
      check.style.display = q.completed ? '' : 'none';
      label.appendChild(check);
      label.appendChild(document.createTextNode(def.label));
      row.appendChild(label);

      const bar = document.createElement('div');
      bar.className = 'sl-quest-bar';
      const fill = document.createElement('div');
      fill.className = 'sl-quest-bar-fill';
      const pct =
        q.goal > 0 ? Math.min(100, (q.progress / q.goal) * 100) : 0;
      fill.style.width = `${pct.toFixed(2)}%`;
      bar.appendChild(fill);
      row.appendChild(bar);

      const count = document.createElement('div');
      count.className = 'sl-quest-count';
      count.textContent = fmtCount(q, def.unit);
      row.appendChild(count);

      body.appendChild(row);
    }
  } catch (err) {
    console.error('[sl-quests] render failed:', err);
  }
}

function buildPanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'sl-quests-panel';

  const header = document.createElement('div');
  header.className = 'sl-quests-header';
  const title = document.createElement('span');
  title.className = 'sl-quests-title';
  title.textContent = 'DAILY QUESTS';

  const badges = document.createElement('span');
  badges.className = 'sl-quests-badges';
  const penaltyBadge = document.createElement('span');
  penaltyBadge.className = 'sl-quests-penalty-badge';
  penaltyBadge.textContent = '⚠ PENALTY';
  penaltyBadge.style.display = 'none';
  const allClearBadge = document.createElement('span');
  allClearBadge.className = 'sl-quests-allclear-badge';
  allClearBadge.textContent = '✓ ALL CLEAR';
  allClearBadge.style.display = 'none';
  badges.appendChild(penaltyBadge);
  badges.appendChild(allClearBadge);

  const countdown = document.createElement('span');
  countdown.className = 'sl-quests-countdown';
  countdown.textContent = '--:--:--';

  header.appendChild(title);
  header.appendChild(badges);
  header.appendChild(countdown);
  panel.appendChild(header);

  const body = document.createElement('div');
  body.className = 'sl-quests-body';
  panel.appendChild(body);

  // Toggle collapse on header click.
  header.addEventListener('click', () => {
    collapsed = !collapsed;
    renderSlQuests();
  });

  return panel;
}

/**
 * Mount the panel on document.body, render once, start the countdown timer
 * (recursive setTimeout — drift-free), and subscribe to every quest event
 * type for rAF-debounced re-renders. Returns an unmount function.
 */
export function mountSlQuests(): () => void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  }

  const panel = buildPanel();
  try {
    document.body.appendChild(panel);
  } catch {
    /* jsdom / SSR fallback — ignore */
  }

  renderSlQuests();

  let rafHandle: number | null = null;
  const scheduleRender = (): void => {
    if (rafHandle !== null) return;
    rafHandle = requestAnimationFrame(() => {
      rafHandle = null;
      renderSlQuests();
    });
  };

  const offs: Array<() => void> = [];
  for (const t of QUEST_EVENT_TYPES) {
    offs.push(gameBus.on(t, scheduleRender));
  }

  // Recursive setTimeout for the countdown — drift-free across tab-suspend.
  let timerHandle: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  const tick = (): void => {
    if (stopped) return;
    try {
      const cd = panel.querySelector<HTMLElement>('.sl-quests-countdown');
      if (cd) cd.textContent = fmtHMS(msUntilMidnight());
    } catch {
      /* ignore */
    }
    timerHandle = setTimeout(tick, 1000);
  };
  timerHandle = setTimeout(tick, 1000);

  const unsubscribe = (): void => {
    stopped = true;
    if (timerHandle !== null) {
      clearTimeout(timerHandle);
      timerHandle = null;
    }
    if (rafHandle !== null) {
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
    }
    for (const off of offs) off();
    offs.length = 0;
    try {
      panel.remove();
    } catch {
      /* ignore */
    }
  };

  mountedUnsubscribe = unsubscribe;
  return unsubscribe;
}

/** Boot wiring for src/main.ts. */
export function wireSlQuests(): void {
  if (typeof document === 'undefined') return;
  mountSlQuests();
}

/** Test-only: clear module-level unsubscribe handle + collapse state. */
export function __resetSlQuestsForTests(): void {
  collapsed = false;
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
  }
  mountedUnsubscribe = null;
}
