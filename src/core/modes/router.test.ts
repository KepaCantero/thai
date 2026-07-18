// Spike 4: router tests.

import { describe, expect, it, vi } from 'vitest';
import { createRouter } from './router';
import { createTonesMode } from './tonesMode';
import type { Mode, ModeContext } from './types';
import type { Scope } from '../types';

function makeCtx(): ModeContext {
  return { setProgress: vi.fn(), scope: 'lecciones' };
}

type MockFn<T extends (...a: any[]) => any> = ReturnType<typeof vi.fn<T>>;

function makeMode(
  key: any,
  hooks?: {
    mount?: MockFn<(ctx: ModeContext) => void>;
    unmount?: MockFn<() => void>;
    onScopeChange?: MockFn<(scope: Scope) => void>;
  },
): Mode & {
  mountM: MockFn<(ctx: ModeContext) => void>;
  unmountM: MockFn<() => void>;
  scopeM: MockFn<(scope: Scope) => void>;
} {
  const mountM = hooks?.mount ?? vi.fn<(ctx: ModeContext) => void>();
  const unmountM = hooks?.unmount ?? vi.fn<() => void>();
  const scopeM = hooks?.onScopeChange ?? vi.fn<(scope: Scope) => void>();
  return { key, mount: mountM, unmount: unmountM, onScopeChange: scopeM, mountM, unmountM, scopeM };
}

describe('createRouter', () => {
  it('starts with no current mode', () => {
    expect(createRouter().current()).toBeNull();
  });

  it('mounts a registered mode on switchTo', () => {
    const r = createRouter();
    const m = makeMode('tones');
    r.register(m);
    r.switchTo('tones', makeCtx());
    expect(m.mountM).toHaveBeenCalledTimes(1);
    expect(r.current()).toBe('tones');
  });

  it('switchTo the same key is a no-op', () => {
    const r = createRouter();
    const m = makeMode('tones');
    r.register(m);
    r.switchTo('tones', makeCtx());
    r.switchTo('tones', makeCtx());
    expect(m.mountM).toHaveBeenCalledTimes(1);
  });

  it('unmounts the previous mode on switch', () => {
    const r = createRouter();
    const a = makeMode('tones');
    const b = makeMode('cards');
    r.register(a); r.register(b);
    r.switchTo('tones', makeCtx());
    r.switchTo('cards', makeCtx());
    expect(a.unmountM).toHaveBeenCalledTimes(1);
    expect(b.mountM).toHaveBeenCalledTimes(1);
    expect(r.current()).toBe('cards');
  });

  it('switch to an unregistered key unmounts current and mounts nothing', () => {
    const r = createRouter();
    const a = makeMode('tones');
    r.register(a);
    r.switchTo('tones', makeCtx());
    r.switchTo('matrix', makeCtx());
    expect(a.unmountM).toHaveBeenCalledTimes(1);
    expect(r.current()).toBeNull();
  });

  it('has() reflects registry', () => {
    const r = createRouter();
    r.register(makeMode('tones'));
    expect(r.has('tones')).toBe(true);
    expect(r.has('matrix')).toBe(false);
  });

  it('notifyScopeChange forwards to the active mode only', () => {
    const r = createRouter();
    const active = makeMode('tones');
    const inactive = makeMode('cards');
    r.register(active); r.register(inactive);
    r.switchTo('tones', makeCtx());
    r.notifyScopeChange('top1000');
    expect(active.scopeM).toHaveBeenCalledWith('top1000');
    expect(inactive.scopeM).not.toHaveBeenCalled();
  });

  it('notifyScopeChange is a no-op when no mode is active', () => {
    const r = createRouter();
    expect(() => r.notifyScopeChange('top1000')).not.toThrow();
  });

  it('notifyScopeChange no-ops for modes without onScopeChange', () => {
    const r = createRouter();
    const m: Mode = { key: 'tones', mount: vi.fn(), unmount: vi.fn() };
    r.register(m);
    r.switchTo('tones', makeCtx());
    expect(() => r.notifyScopeChange('top1000')).not.toThrow();
  });
});

describe('createTonesMode', () => {
  it('mount shows host, sets progress, and renders', () => {
    const host = { style: { display: 'none' } } as unknown as HTMLElement;
    const render = vi.fn();
    const stop = vi.fn();
    const mode = createTonesMode({ host: () => host, render, stop });
    const ctx = makeCtx();
    mode.mount(ctx);
    expect(host.style.display).toBe('flex');
    expect(ctx.setProgress).toHaveBeenCalledWith('Tones');
    expect(render).toHaveBeenCalledTimes(1);
    expect(stop).not.toHaveBeenCalled();
  });

  it('unmount stops playback and hides host', () => {
    const host = { style: { display: 'flex' } } as unknown as HTMLElement;
    const render = vi.fn();
    const stop = vi.fn();
    const mode = createTonesMode({ host: () => host, render, stop });
    mode.mount(makeCtx());
    mode.unmount();
    expect(stop).toHaveBeenCalledTimes(1);
    expect(host.style.display).toBe('none');
  });

  it('integrates with router: switchTo tones calls mount, switchTo cards calls unmount', () => {
    const host = { style: { display: 'none' } } as unknown as HTMLElement;
    const render = vi.fn();
    const stop = vi.fn();
    const r = createRouter();
    r.register(createTonesMode({ host: () => host, render, stop }));
    r.register(makeMode('cards'));
    r.switchTo('tones', makeCtx());
    expect(host.style.display).toBe('flex');
    expect(render).toHaveBeenCalledTimes(1);
    r.switchTo('cards', makeCtx());
    expect(stop).toHaveBeenCalledTimes(1);
    expect(host.style.display).toBe('none');
  });
});
