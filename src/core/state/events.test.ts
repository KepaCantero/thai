import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gameBus } from './events';

describe('eventBus — basic subscribe/emit', () => {
  beforeEach(() => gameBus.clear());
  afterEach(() => gameBus.clear());

  it('delivers events to a subscribed listener', () => {
    const fn = vi.fn();
    gameBus.on('srs:review', fn);
    gameBus.emit({ type: 'srs:review', rating: 'good', deck: 'palabras' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      type: 'srs:review',
      rating: 'good',
      deck: 'palabras',
    });
  });

  it('returns an unsubscribe function', () => {
    const fn = vi.fn();
    const off = gameBus.on('tone:correct', fn);
    off();
    gameBus.emit({ type: 'tone:correct' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not deliver events of other types', () => {
    const fnReview = vi.fn();
    const fnKnown = vi.fn();
    gameBus.on('srs:review', fnReview);
    gameBus.on('card:known', fnKnown);
    gameBus.emit({ type: 'card:known', entryId: 'x' });
    expect(fnReview).not.toHaveBeenCalled();
    expect(fnKnown).toHaveBeenCalledTimes(1);
  });

  it('supports multiple listeners for the same type', () => {
    const a = vi.fn();
    const b = vi.fn();
    gameBus.on('tone:correct', a);
    gameBus.on('tone:correct', b);
    gameBus.emit({ type: 'tone:correct' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('off() removes only the requested listener', () => {
    const a = vi.fn();
    const b = vi.fn();
    gameBus.on('tone:correct', a);
    gameBus.on('tone:correct', b);
    gameBus.off('tone:correct', a);
    gameBus.emit({ type: 'tone:correct' });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});

describe('eventBus — once()', () => {
  beforeEach(() => gameBus.clear());
  afterEach(() => gameBus.clear());

  it('fires only on the first emit', () => {
    const fn = vi.fn();
    gameBus.once('tone:correct', fn);
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:correct' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not block other listeners of the same type', () => {
    const one = vi.fn();
    const persistent = vi.fn();
    gameBus.once('tone:correct', one);
    gameBus.on('tone:correct', persistent);
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:correct' });
    expect(one).toHaveBeenCalledTimes(1);
    expect(persistent).toHaveBeenCalledTimes(2);
  });
});

describe('eventBus — listener robustness', () => {
  beforeEach(() => gameBus.clear());
  afterEach(() => gameBus.clear());

  it('a throwing listener does not block siblings', () => {
    const bomb = vi.fn(() => {
      throw new Error('boom');
    });
    const ok = vi.fn();
    gameBus.on('tone:correct', bomb);
    gameBus.on('tone:correct', ok);
    gameBus.emit({ type: 'tone:correct' });
    expect(bomb).toHaveBeenCalledTimes(1);
    expect(ok).toHaveBeenCalledTimes(1);
  });

  it('a listener can unsubscribe itself during emit', () => {
    const first = vi.fn();
    // The listener captures the unsubscribe handle returned by `on`, then
    // invokes it from inside its own body. vi.fn wraps the impl so the spy
    // stays subscribed (matching what real listeners do).
    let off = () => {};
    const selfRemoving = vi.fn(() => {
      off();
    });
    gameBus.on('tone:correct', first);
    off = gameBus.on('tone:correct', selfRemoving);
    gameBus.emit({ type: 'tone:correct' });
    gameBus.emit({ type: 'tone:correct' });
    expect(first).toHaveBeenCalledTimes(2);
    expect(selfRemoving).toHaveBeenCalledTimes(1);
  });

  it('size() reports listeners per type and in total', () => {
    expect(gameBus.size('tone:correct')).toBe(0);
    gameBus.on('tone:correct', () => {});
    gameBus.on('tone:correct', () => {});
    gameBus.on('srs:review', () => {});
    expect(gameBus.size('tone:correct')).toBe(2);
    expect(gameBus.size()).toBe(3);
  });
});
