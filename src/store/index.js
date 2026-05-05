import { computed, inject, reactive } from 'vue';
import { createStorageAdapter } from '../storage/adapter';
import { selectPendingTodos, sortTodos } from './selectors';

export const STORE_KEY = Symbol('appStore');

export function createStore({ adapter = createStorageAdapter() } = {}) {
  const state = reactive({
    schemaVersion: '1.0.0',
    filters: { status: 'active' },
    todos: [],
    notice: null
  });

  const pendingTodos = computed(() => selectPendingTodos(state));
  const sortedPendingTodos = computed(() => sortTodos(pendingTodos.value));
  const pendingCount = computed(() => sortedPendingTodos.value.length);

  const setNotice = (notice) => {
    state.notice = notice;
  };

  const boot = async () => {
    try {
      const { state: loaded, wasReset } = adapter.loadState();

      state.schemaVersion = loaded.schemaVersion;
      state.filters = loaded.filters;
      state.todos = loaded.todos;

      if (wasReset) {
        setNotice({
          kind: 'storage-reset',
          message: 'Your saved data was reset because it could not be read.'
        });
      }
    } catch {
      state.schemaVersion = '1.0.0';
      state.filters = { status: 'active' };
      state.todos = [];
      setNotice({
        kind: 'storage-reset',
        message: 'Your saved data was reset because it could not be read.'
      });
    }
  };

  const ensureActiveFilter = () => {
    if (!state.filters) state.filters = { status: 'active' };
    state.filters.status = 'active';
  };

  return {
    state,
    pendingTodos,
    sortedPendingTodos,
    pendingCount,
    boot,
    ensureActiveFilter,
    setNotice
  };
}

export function useStore() {
  const store = inject(STORE_KEY, null);
  if (!store) {
    throw new Error('App store not provided');
  }
  return store;
}
