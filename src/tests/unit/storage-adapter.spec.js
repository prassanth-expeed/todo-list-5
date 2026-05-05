import { describe, expect, it } from 'vitest';
import { createStorageAdapter, STORAGE_KEY } from '../../storage/adapter';

function createMemoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    }
  };
}

describe('storage/adapter', () => {
  it('returns default state when missing', () => {
    const storage = createMemoryStorage();
    const adapter = createStorageAdapter({ storage, debounceMs: 0 });
    const { state, wasReset } = adapter.loadState();

    expect(wasReset).toBe(false);
    expect(state).toEqual({
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: []
    });
  });

  it('corrupt JSON triggers safe reset and wasReset flag', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{not json' });
    const adapter = createStorageAdapter({ storage, debounceMs: 0 });

    const { state, wasReset } = adapter.loadState();

    expect(wasReset).toBe(true);
    expect(state.todos).toEqual([]);

    // Ensure it wrote back a known-good payload.
    const written = storage.getItem(STORAGE_KEY);
    expect(() => JSON.parse(written)).not.toThrow();
  });

  it('invalid schema triggers safe reset and wasReset flag', () => {
    const storage = createMemoryStorage({
      [STORAGE_KEY]: JSON.stringify({ schemaVersion: '1.0.0', filters: { status: 'active' }, todos: {} })
    });
    const adapter = createStorageAdapter({ storage, debounceMs: 0 });

    const { state, wasReset } = adapter.loadState();

    expect(wasReset).toBe(true);
    expect(state.todos).toEqual([]);
  });
});
