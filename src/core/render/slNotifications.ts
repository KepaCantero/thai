// Solo Leveling Phase 6: floating toast notifications ("system windows").
//
// Vanilla DOM stack of dismissible toasts at bottom-center. Each toast plays
// an optional SFX on push. Subscribes to gameBus for level-up / title-unlock /
// quest-complete / all-clear so the rest of the app doesn't have to know
// about toasts.
//
// Every public entry point is wrapped in try/catch — a toast failure must
// never break a gameBus listener fan-out.

import { gameBus } from '../state/events';
import { playSfx, type SfxName } from '../audio/sfx';

export interface SlNotificationOptions {
  kind: 'info' | 'success' | 'warning' | 'level-up';
  title: string;
  body?: string;
  sfx?: SfxName;
  durationMs?: number;
}

const ICON_BY_KIND: Record<SlNotificationOptions['kind'], string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠',
  'level-up': '↑',
};

let stack: HTMLElement | null = null;
let mountedUnsubscribe: (() => void) | null = null;

function ensureStack(): HTMLElement | null {
  try {
    if (stack && stack.isConnected) return stack;
    if (typeof document === 'undefined' || !document.body) return null;
    const el = document.createElement('div');
    el.className = 'sl-notifications-stack';
    document.body.appendChild(el);
    stack = el;
    return el;
  } catch {
    return null;
  }
}

function dismissToast(toast: HTMLElement): void {
  try {
    toast.classList.add('sl-notification--leaving');
    // Wait one frame for the fade-out animation, then remove.
    setTimeout(() => {
      try {
        toast.remove();
      } catch {
        /* ignore */
      }
    }, 200);
  } catch {
    /* ignore */
  }
}

export function pushSlNotification(opts: SlNotificationOptions): void {
  try {
    const container = ensureStack();
    if (!container) return;

    if (opts.sfx) {
      try {
        playSfx(opts.sfx);
      } catch {
        /* sfx failure must not break the toast */
      }
    }

    const toast = document.createElement('div');
    toast.className = `sl-notification kind-${opts.kind}`;
    toast.setAttribute('role', 'status');

    const icon = document.createElement('span');
    icon.className = 'sl-notification-icon';
    icon.textContent = ICON_BY_KIND[opts.kind] ?? 'ℹ️';

    const text = document.createElement('div');
    text.className = 'sl-notification-text';

    const titleEl = document.createElement('div');
    titleEl.className = 'sl-notification-title';
    titleEl.textContent = opts.title;

    text.appendChild(titleEl);
    if (opts.body) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'sl-notification-body';
      bodyEl.textContent = opts.body;
      text.appendChild(bodyEl);
    }

    const close = document.createElement('button');
    close.className = 'sl-notification-close';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '×';
    close.addEventListener('click', () => dismissToast(toast));

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(close);

    // Click anywhere on the toast (except the close button) also dismisses.
    toast.addEventListener('click', (e) => {
      const t = e.target as HTMLElement | null;
      if (t && t.classList && t.classList.contains('sl-notification-close')) return;
      dismissToast(toast);
    });

    container.appendChild(toast);

    const duration = opts.durationMs;
    // level-up toasts default to sticky (durationMs undefined); explicit
    // 0 also means "sticky".
    if (duration !== undefined && duration > 0) {
      setTimeout(() => dismissToast(toast), duration);
    }
  } catch (err) {
    console.error('[sl-notifications] push failed:', err);
  }
}

export function mountSlNotifications(): () => void {
  const offs: Array<() => void> = [];

  offs.push(
    gameBus.on('level:up', (e) => {
      try {
        if (e.rankUp) {
          pushSlNotification({
            kind: 'level-up',
            title: `RANK UP! ${e.rank}-${e.tier}`,
            body: `${e.levelsGained} level${e.levelsGained === 1 ? '' : 's'} gained`,
            sfx: 'rank-up',
            durationMs: 8000,
          });
        } else {
          pushSlNotification({
            kind: 'level-up',
            title: 'LEVEL UP',
            body: `Now ${e.rank}-${e.tier}`,
            sfx: 'level-up',
          });
        }
      } catch {
        /* ignore */
      }
    }),
  );

  offs.push(
    gameBus.on('title:unlock', (e) => {
      pushSlNotification({
        kind: 'info',
        title: 'TITLE UNLOCKED',
        body: e.label,
        sfx: 'title-unlock',
        durationMs: 6000,
      });
    }),
  );

  offs.push(
    gameBus.on('quest:complete', (e) => {
      pushSlNotification({
        kind: 'success',
        title: 'QUEST COMPLETE',
        body: e.questId,
        sfx: 'quest-complete',
        durationMs: 3000,
      });
    }),
  );

  offs.push(
    gameBus.on('quest:allclear', () => {
      pushSlNotification({
        kind: 'success',
        title: 'ALL QUESTS CLEAR',
        body: 'Daily quests complete',
        sfx: 'all-clear',
        durationMs: 6000,
      });
    }),
  );

  // Touch the stack so it exists on mount.
  ensureStack();

  const unsubscribe = (): void => {
    for (const off of offs) {
      try {
        off();
      } catch {
        /* ignore */
      }
    }
    offs.length = 0;
    try {
      if (stack && stack.isConnected) stack.remove();
    } catch {
      /* ignore */
    }
    stack = null;
  };

  mountedUnsubscribe = unsubscribe;
  return unsubscribe;
}

export function wireSlNotifications(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  }
  mountSlNotifications();
}

export function __resetSlNotificationsForTests(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
  }
  mountedUnsubscribe = null;
  stack = null;
}
