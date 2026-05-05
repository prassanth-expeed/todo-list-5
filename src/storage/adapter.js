import { validateAppState } from './validate';

export const STORAGE_KEY = 'vue-todo.v1';
export const SCHEMA_VERSION = '1.0.0';

export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    filters: { status: 'active' },
    todos: []
  };
}

function createDebounced(fn, ms) {
  let handle = null;
  let lastArgs = null;

  return (...args) => {
    lastArgs = args;

    if (handle != null) {
      clearTimeout(handle);
    }

    handle = setTimeout(() => {
      handle = null;
      fn(...(lastArgs ?? []));
    }, ms);
  };
}

export function createStorageAdapter({ storage = window.localStorage, debounceMs = 150 } = {}) {
  const write = (state) => {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const saveState = debounceMs === 0 ? write : createDebounced(write, debounceMs);

  const loadState = () => {
    const empty = defaultState();

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw == null) {
        return { state: empty, wasReset: false };
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Corrupt JSON.
        write(empty);
        return { state: empty, wasReset: true };
      }

      const validated = validateAppState(parsed);
      if (!validated) {
        write(empty);
        return { state: empty, wasReset: true };
      }

      return { state: validated, wasReset: false };
    } catch {
      // Any unexpected storage error (quota, blocked, etc.) should not crash.
      return { state: empty, wasReset: true };
    }
  };

  return {
    defaultState,
    loadState,
    saveState
  };
}
