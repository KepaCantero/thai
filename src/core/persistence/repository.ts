// Spike 2: typed persistence layer.
//
// The legacy code in public/*.js calls localStorage directly in 25+ spots with
// ad-hoc JSON.parse/stringify and inconsistent try/catch handling. This module
// centralizes the persistence so future spikes (and the eventual mode
// extraction) can use a uniform, typed API. The legacy scripts keep their
// direct localStorage calls until each is migrated.
//
// Design goals:
//   - Never throw: read failures fall back to the default; write failures are
//     swallowed (with a console.warn) — matches current behavior in app.js.
//   - Adapter-based: tests pass in an in-memory adapter; production uses
//     localStorage. Future migrations to IndexedDB or a remote sync can swap
//     the adapter without touching call sites.
//   - JSON by default; callers can override serialize/deserialize (e.g. for
//     versioned schemas like thai_srs_state).

/** Minimal subset of the Storage interface that we depend on. */
export interface PersistenceAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Wraps window.localStorage so callers don't have to handle SecurityError
 * (e.g. cookies disabled, sandboxed iframe) or undefined window (SSR / tests
 * without jsdom). On any failure, behaves as if storage is empty.
 */
export const localStorageAdapter: PersistenceAdapter = {
  getItem(key) {
    try {
      return typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(key)
        : null;
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn('[persistence] setItem failed', key, err);
    }
  },
  removeItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn('[persistence] removeItem failed', key, err);
    }
  },
};

/** Factory: an in-memory adapter, useful for tests and SSR. */
export function memoryAdapter(initial: Record<string, string> = {}): PersistenceAdapter {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

export interface StoreOptions<T> {
  adapter?: PersistenceAdapter;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

export interface Store<T> {
  readonly key: string;
  get(): T;
  set(value: T): void;
  remove(): void;
  /** Read-modify-write; returns the new value. */
  update(fn: (current: T) => T): T;
}

const identity = <T>(x: T): T => x;

/**
 * Define a typed store for a single key. Default value is returned on any
 * read failure (missing key, JSON parse error, adapter exception).
 */
export function defineStore<T>(key: string, defaultValue: T, opts: StoreOptions<T> = {}): Store<T> {
  const adapter = opts.adapter ?? localStorageAdapter;
  const serialize = opts.serialize ?? ((v: T) => JSON.stringify(v));
  const deserialize = opts.deserialize ?? ((raw: string) => JSON.parse(raw) as T);

  const get = (): T => {
    const raw = adapter.getItem(key);
    if (raw == null) return defaultValue;
    try {
      return deserialize(raw);
    } catch (err) {
      console.warn('[persistence] deserialize failed, returning default', key, err);
      return defaultValue;
    }
  };

  const set = (value: T): void => {
    let raw: string;
    try {
      raw = serialize(value);
    } catch (err) {
      console.warn('[persistence] serialize failed, not writing', key, err);
      return;
    }
    adapter.setItem(key, raw);
  };

  const remove = (): void => {
    adapter.removeItem(key);
  };

  const update = (fn: (current: T) => T): T => {
    const next = fn(get());
    set(next);
    return next;
  };

  return { key, get, set, remove, update };
}

export interface NamespacedStore<T> {
  readonly prefix: string;
  get(id: string): T;
  set(id: string, value: T): void;
  remove(id: string): void;
  /** Read-modify-write; returns the new value. */
  update(id: string, fn: (current: T) => T): T;
}


/**
 * Define a store keyed by a dynamic suffix — e.g. `sh_times_<convId>`.
 * Each id maps to its own localStorage key.
 */
export function defineNamespacedStore<T>(
  prefix: string,
  defaultValue: T,
  opts: StoreOptions<T> = {}
): NamespacedStore<T> {
  const adapter = opts.adapter ?? localStorageAdapter;
  const serialize = opts.serialize ?? ((v: T) => JSON.stringify(v));
  const deserialize = opts.deserialize ?? ((raw: string) => JSON.parse(raw) as T);

  const keyFor = (id: string) => `${prefix}${id}`;

  const get = (id: string): T => {
    const raw = adapter.getItem(keyFor(id));
    if (raw == null) return defaultValue;
    try {
      return deserialize(raw);
    } catch (err) {
      console.warn('[persistence] deserialize failed, returning default', keyFor(id), err);
      return defaultValue;
    }
  };

  const set = (id: string, value: T): void => {
    let raw: string;
    try {
      raw = serialize(value);
    } catch (err) {
      console.warn('[persistence] serialize failed, not writing', keyFor(id), err);
      return;
    }
    adapter.setItem(keyFor(id), raw);
  };

  const remove = (id: string): void => {
    adapter.removeItem(keyFor(id));
  };

  const update = (id: string, fn: (current: T) => T): T => {
    const next = fn(get(id));
    set(id, next);
    return next;
  };

  return { prefix, get, set, remove, update };
}
