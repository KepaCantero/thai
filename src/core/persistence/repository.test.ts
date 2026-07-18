// Spike 2: smoke tests for the persistence layer using an in-memory adapter.
// Run with: npm test

import { describe, expect, it } from 'vitest';
import { defineNamespacedStore, defineStore, memoryAdapter } from './repository';

describe('defineStore', () => {
  it('returns the default when the key is absent', () => {
    const adapter = memoryAdapter();
    const s = defineStore('k', { n: 0 }, { adapter });
    expect(s.get()).toEqual({ n: 0 });
  });

  it('round-trips JSON-serializable values', () => {
    const adapter = memoryAdapter();
    const s = defineStore<string[]>('items', [], { adapter });
    s.set(['a', 'b']);
    expect(s.get()).toEqual(['a', 'b']);
    expect(adapter.getItem('items')).toBe(JSON.stringify(['a', 'b']));
  });

  it('falls back to default when JSON is corrupted', () => {
    const adapter = memoryAdapter({ broken: '{not valid json' });
    const s = defineStore<number[]>('broken', [], { adapter });
    expect(s.get()).toEqual([]);
  });

  it('update() performs read-modify-write', () => {
    const adapter = memoryAdapter();
    const s = defineStore<number>('counter', 0, { adapter });
    s.update((n) => n + 1);
    s.update((n) => n + 5);
    expect(s.get()).toBe(6);
  });

  it('remove() clears the key', () => {
    const adapter = memoryAdapter();
    const s = defineStore<string>('k', 'def', { adapter });
    s.set('hello');
    s.remove();
    expect(s.get()).toBe('def');
  });
});

describe('defineNamespacedStore', () => {
  it('isolates values per id under a shared prefix', () => {
    const adapter = memoryAdapter();
    const s = defineNamespacedStore<number[]>('sh_times_', [], { adapter });
    s.set('conv-a', [1, 2, 3]);
    s.set('conv-b', [4]);
    expect(s.get('conv-a')).toEqual([1, 2, 3]);
    expect(s.get('conv-b')).toEqual([4]);
    expect(s.get('conv-c')).toEqual([]);
    expect(adapter.getItem('sh_times_conv-a')).toBe(JSON.stringify([1, 2, 3]));
  });

  it('remove() only clears the targeted id', () => {
    const adapter = memoryAdapter();
    const s = defineNamespacedStore<number[]>('sh_times_', [], { adapter });
    s.set('a', [1]);
    s.set('b', [2]);
    s.remove('a');
    expect(s.get('a')).toEqual([]);
    expect(s.get('b')).toEqual([2]);
  });
});
