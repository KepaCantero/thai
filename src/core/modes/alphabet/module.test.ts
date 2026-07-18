// Spike 5b: alphabet module tests.

import { describe, expect, it } from 'vitest';
import { createAlphaModule, DEFAULT_ALPHA_MODE, ALPHA_MODE_STORAGE_KEY } from './module';
import type { AlphaConsonant, AlphaMnMode } from './module';

function makeConsonants(): AlphaConsonant[] {
  return [
    { i: 1, thai: 'ก', cls: 'mid', sound: 'k', soundLike: 'ko', word: { thai: 'ไก่', en: 'chicken' }, mnemonic: { visual: 'chicken shape' } },
    { i: 2, thai: 'ข', cls: 'high', sound: 'k', soundLike: 'kǒo', word: { thai: 'ไข่', en: 'egg' }, emoji: '🥚', obsolete: true },
    { i: 3, thai: 'ค', cls: 'low', sound: 'k', soundLike: 'kaa', word: { thai: 'ควาย', en: 'buffalo' } },
  ];
}

function makeStore(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    _dump: () => Object.fromEntries(store),
  };
}

function makeDeps(opts: { store?: ReturnType<typeof makeStore> } = {}) {
  const store = opts.store ?? makeStore();
  let hostHtml = '';
  return {
    deps: {
      getConsonants: () => makeConsonants(),
      getModes: () => [
        { id: 'visual' as AlphaMnMode, label: 'Visual' },
        { id: 'full' as AlphaMnMode, label: 'Completo' },
        { id: 'story' as AlphaMnMode, label: 'Historia' },
      ],
      getStore: () => store,
      setHostHtml: (html: string) => { hostHtml = html; },
    },
    store,
    getHostHtml: () => hostHtml,
  };
}

describe('createAlphaModule', () => {
  it('defaults to visual mode when storage is empty', () => {
    const { deps } = makeDeps();
    const m = createAlphaModule(deps);
    expect(m.getMode()).toBe(DEFAULT_ALPHA_MODE);
    expect(m.getMode()).toBe('visual');
  });

  it('reads initial mode from storage', () => {
    const store = makeStore({ [ALPHA_MODE_STORAGE_KEY]: 'story' });
    const { deps } = makeDeps({ store });
    const m = createAlphaModule(deps);
    expect(m.getMode()).toBe('story');
  });

  it('falls back to visual when stored value is invalid', () => {
    const store = makeStore({ [ALPHA_MODE_STORAGE_KEY]: 'banana' });
    const { deps } = makeDeps({ store });
    const m = createAlphaModule(deps);
    expect(m.getMode()).toBe('visual');
  });

  it('setMode persists and re-renders the host', () => {
    const { deps, store, getHostHtml } = makeDeps();
    const m = createAlphaModule(deps);
    m.setMode('story');
    expect(m.getMode()).toBe('story');
    expect(store._dump()[ALPHA_MODE_STORAGE_KEY]).toBe('story');
    expect(getHostHtml()).toContain('alpha-mn-story');
  });

  it('setMode with the current value is a no-op', () => {
    const { deps, store } = makeDeps();
    const m = createAlphaModule(deps);
    m.setMode('visual');
    expect(store._dump()[ALPHA_MODE_STORAGE_KEY]).toBeUndefined();
  });

  it('renderView wraps render() in alpha-wrap', () => {
    const { deps, getHostHtml } = makeDeps();
    const m = createAlphaModule(deps);
    m.renderView();
    const html = getHostHtml();
    expect(html).toContain('alpha-wrap');
    expect(html).toContain('alpha-grid alpha-mn-visual');
    expect(html).toContain('alpha-chip');
  });

  it('render emits a card per consonant with class-based styling', () => {
    const { deps } = makeDeps();
    const m = createAlphaModule(deps);
    const html = m.render();
    expect(html).toContain('alpha-cls-mid');
    expect(html).toContain('alpha-cls-high');
    expect(html).toContain('alpha-cls-low');
    expect(html).toContain('alpha-obsolete'); // ข is obsolete
    expect(html).toContain('#1');
    expect(html).toContain('#3');
  });

  it('inline onclick for setAlphaMode references the new mode id', () => {
    const { deps } = makeDeps();
    const m = createAlphaModule(deps);
    const html = m.render();
    expect(html).toContain("setAlphaMode('visual')");
    expect(html).toContain("setAlphaMode('story')");
  });

  it('mnemonic is rendered only when present for the current mode', () => {
    const { deps } = makeDeps();
    const m = createAlphaModule(deps);
    expect(m.render()).toContain('MN[visual]:'); // ก has visual mnemonic
    m.setMode('story');
    // none of the test consonants have a story mnemonic
    expect(m.render()).not.toContain('MN[story]:');
  });

  it('inline onclick for speakText escapes single quotes in soundLike', () => {
    const consonants: AlphaConsonant[] = [
      { i: 1, thai: 'X', cls: 'mid', sound: 'x', soundLike: "x's", word: { thai: 'Y', en: 'z' } },
    ];
    const store = makeStore();
    const m = createAlphaModule({
      getConsonants: () => consonants,
      getModes: () => [{ id: 'visual' as AlphaMnMode, label: 'Visual' }],
      getStore: () => store,
      setHostHtml: () => {},
    });
    const html = m.render();
    expect(html).toContain("speakText('x\\'s')");
  });
});
