// Solo Leveling Phase 6: full-screen rank-up modal.
//
// Triggered ONLY on rank-up level-ups (rankUp: true). Builds a hidden modal
// in document.body on mount; showSlLevelUpModal toggles a body class that
// drives the CSS animation (ring expansion + RANK UP text + emblem pop).
//
// Auto-dismisses after 2.5s, or on click / Escape. Defensive: every public
// entry point is try/catch-wrapped so a modal failure never breaks gameBus.

import { gameBus } from '../state/events';
import type { Rank } from '../state/player';

const HOLD_MS = 2500;
const BODY_CLASS = 'sl-levelup-open';

let modal: HTMLElement | null = null;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;
let dismissTimer: ReturnType<typeof setTimeout> | null = null;
let mountedUnsubscribe: (() => void) | null = null;

function clearDismissTimer(): void {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
}

function hideModal(): void {
  try {
    clearDismissTimer();
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove(BODY_CLASS);
    }
    if (modal) {
      modal.classList.remove('sl-levelup-modal--active');
    }
  } catch {
    /* ignore */
  }
}

export function showSlLevelUpModal(rank: Rank, tier: number): void {
  try {
    if (!modal || typeof document === 'undefined' || !document.body) return;
    const emblem = modal.querySelector('.sl-levelup-emblem');
    if (emblem) {
      emblem.setAttribute('data-rank', rank);
      const letter = emblem.querySelector('.sl-levelup-emblem-letter');
      if (letter) letter.textContent = rank;
    }
    const tierEl = modal.querySelector('.sl-levelup-tier');
    if (tierEl) tierEl.textContent = `${rank}-${tier}`;

    // Toggle the body class which drives the CSS animation (the modal's
    // display is bound to body.sl-levelup-open via styles.css). We re-add
    // the class unconditionally — if it was already present from a previous
    // show, the modal-emblem data-rank / tier text get refreshed above; CSS
    // keyframes replay because we strip and re-add the active marker.
    try {
      document.body.classList.remove(BODY_CLASS);
      // Force a reflow-equivalent by re-adding synchronously. In real
      // browsers the remove/add pair within one microtask would coalesce;
      // the emblem attributes update is what visibly changes between back-
      // to-back rank-ups.
      document.body.classList.add(BODY_CLASS);
      modal.classList.add('sl-levelup-modal--active');
    } catch {
      /* ignore */
    }

    clearDismissTimer();
    dismissTimer = setTimeout(() => hideModal(), HOLD_MS);
  } catch (err) {
    console.error('[sl-levelup] show failed:', err);
  }
}

function buildModal(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'sl-levelup-modal';
  root.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'sl-levelup-backdrop';

  const ring = document.createElement('div');
  ring.className = 'sl-levelup-ring';

  const wrap = document.createElement('div');
  wrap.className = 'sl-levelup-content';

  const text = document.createElement('div');
  text.className = 'sl-levelup-text';
  text.textContent = 'RANK UP';

  const emblem = document.createElement('div');
  emblem.className = 'sl-levelup-emblem';
  emblem.setAttribute('data-rank', 'E');
  const letter = document.createElement('span');
  letter.className = 'sl-levelup-emblem-letter';
  letter.textContent = 'E';
  emblem.appendChild(letter);

  const tier = document.createElement('div');
  tier.className = 'sl-levelup-tier';
  tier.textContent = 'E-1';

  wrap.appendChild(emblem);
  wrap.appendChild(text);
  wrap.appendChild(tier);

  root.appendChild(backdrop);
  root.appendChild(ring);
  root.appendChild(wrap);

  // Click anywhere dismisses.
  root.addEventListener('click', () => hideModal());

  return root;
}

export function mountSlLevelUpModal(): () => void {
  if (typeof document === 'undefined' || !document.body) {
    return () => {};
  }
  if (!modal) {
    modal = buildModal();
    document.body.appendChild(modal);
  }

  // Escape closes.
  keyHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') hideModal();
  };
  document.addEventListener('keydown', keyHandler);

  // Subscribe to level:up; only act on rank-up boundary crossings.
  const off = gameBus.on('level:up', (e) => {
    if (e.rankUp) showSlLevelUpModal(e.rank, e.tier);
  });

  const unsubscribe = (): void => {
    try {
      off();
    } catch {
      /* ignore */
    }
    if (keyHandler) {
      try {
        document.removeEventListener('keydown', keyHandler);
      } catch {
        /* ignore */
      }
      keyHandler = null;
    }
    clearDismissTimer();
    hideModal();
    try {
      if (modal && modal.isConnected) modal.remove();
    } catch {
      /* ignore */
    }
    modal = null;
  };

  mountedUnsubscribe = unsubscribe;
  return unsubscribe;
}

export function wireSlLevelUpModal(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
    mountedUnsubscribe = null;
  }
  mountSlLevelUpModal();
}

export function __resetSlLevelUpModalForTests(): void {
  if (mountedUnsubscribe) {
    try {
      mountedUnsubscribe();
    } catch {
      /* ignore */
    }
  }
  mountedUnsubscribe = null;
  modal = null;
  keyHandler = null;
  dismissTimer = null;
}
