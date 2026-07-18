// Spike 4: router implementation.

import type { ModeKey, Scope } from '../types';
import type { Mode, ModeContext, Router } from './types';

export function createRouter(): Router {
  const modes = new Map<ModeKey, Mode>();
  let current: Mode | null = null;

  return {
    register(mode) {
      modes.set(mode.key, mode);
    },
    has(key) {
      return modes.has(key);
    },
    switchTo(key, ctx) {
      if (current?.key === key) return;
      if (current) {
        current.unmount();
        current = null;
      }
      const next = modes.get(key);
      if (!next) return;
      next.mount(ctx);
      current = next;
    },
    notifyScopeChange(scope: Scope) {
      if (current?.onScopeChange) current.onScopeChange(scope);
    },
    current() {
      return current?.key ?? null;
    },
  };
}
