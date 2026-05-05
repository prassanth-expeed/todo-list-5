import { computed, reactive, readonly, watch } from 'vue';

const STORAGE_KEY = 'vue-todo.v1';
const SCHEMA_VERSION = 1;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeStatus(status) {
  return status === 'active' || status === 'completed' ? status : 'all';
}

function sanitizeTodo(raw, index) {
  if (!raw || typeof raw !== 'object') return null;
  const text = typeof raw.text === 'string' ? raw.text : '';
  if (!text.trim()) return null;

  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : nowIso();
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;
  const order = typeof raw.order === 'number' ? raw.order : index;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : crypto.randomUUID(),
    text: text.trim(),
    completed: Boolean(raw.completed),
    createdAt,
    updatedAt,
    order
  };
}

function sanitizeState(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const todos = Array.isArray(raw.todos) ? raw.todos : [];

  const sanitizedTodos = todos
    .map((t, idx) => sanitizeTodo(t, idx))
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  const filters = raw.filters && typeof raw.filters === 'object' ? raw.filters : {};

  return {
    schemaVersion: typeof raw.schemaVersion === 'number' ? raw.schemaVersion : SCHEMA_VERSION,
    todos: sanitizedTodos,
    filters: {
      status: sanitizeStatus(filters.status)
    }
  };
}

function loadInitialState() {
  const raw = safeParse(localStorage.getItem(STORAGE_KEY) ?? '');
  const sanitized = sanitizeState(raw);
  if (sanitized) return sanitized;

  return {
    schemaVersion: SCHEMA_VERSION,
    todos: [],
    filters: { status: 'all' }
  };
}

function createDebounced(fn, waitMs) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, waitMs);
  };
}

export function createStore() {
  const state = reactive(loadInitialState());

  const persist = () => {
    const payload = {
      schemaVersion: state.schemaVersion,
      todos: state.todos,
      filters: state.filters
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const persistDebounced = createDebounced(persist, 150);

  watch(
    () => state,
    () => persistDebounced(),
    { deep: true }
  );

  const filteredTodos = computed(() => {
    if (state.filters.status === 'active') return state.todos.filter((t) => !t.completed);
    if (state.filters.status === 'completed') return state.todos.filter((t) => t.completed);
    return state.todos;
  });

  function addTodo(text) {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return;

    const ts = nowIso();
    const maxOrder = state.todos.reduce((m, t) => Math.max(m, t.order), -1);
    state.todos.push({
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: ts,
      updatedAt: ts,
      order: maxOrder + 1
    });
  }

  function setFilterStatus(status) {
    state.filters.status = sanitizeStatus(status);
  }

  return {
    state: readonly(state),
    filteredTodos,
    addTodo,
    setFilterStatus
  };
}

export function getStorageKey() {
  return STORAGE_KEY;
}
