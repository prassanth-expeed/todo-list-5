const ALLOWED_FILTERS = new Set(['all', 'active', 'completed']);

export function isValidTodo(input) {
  if (!input || typeof input !== 'object') return false;
  const todo = input;

  if (typeof todo.id !== 'string' || todo.id.length === 0) return false;
  if (typeof todo.text !== 'string' || todo.text.trim().length === 0) return false;
  if (typeof todo.completed !== 'boolean') return false;
  if (typeof todo.createdAt !== 'string' || todo.createdAt.length === 0) return false;
  if (typeof todo.order !== 'number' || !Number.isFinite(todo.order)) return false;

  // updatedAt is optional.
  if (todo.updatedAt != null && typeof todo.updatedAt !== 'string') return false;

  return true;
}

export function validateAppState(input) {
  if (!input || typeof input !== 'object') return null;
  const state = input;

  if (!Array.isArray(state.todos)) return null;
  if (!state.filters || typeof state.filters !== 'object') return null;
  if (!ALLOWED_FILTERS.has(state.filters.status)) return null;
  if (typeof state.schemaVersion !== 'string' || state.schemaVersion.length === 0) {
    return null;
  }

  // Note: tolerate partially invalid todos in storage; selectors will skip invalid.
  return {
    schemaVersion: state.schemaVersion,
    filters: { status: state.filters.status },
    todos: state.todos
  };
}
