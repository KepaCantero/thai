// DOM helper. Ported from public/config.js:192. Lazily resolves at call
// time so callers survive being invoked before DOMContentLoaded.

export function $(id: string): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.getElementById(id);
}
