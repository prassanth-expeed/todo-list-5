# App Store — Contract

Purpose: Centralize client-side state with a minimal provide/inject store using Vue 3 Composition API, without introducing Pinia for v0.

Store shape (JS, Composition API)

- state: reactive({
    schemaVersion: string,
    filters: { status: 'all' | 'active' | 'completed' },
    todos: Todo[],
    notice: { kind: 'storage-reset', message: string } | null
  })

- getters/derived (computed):
  - pendingTodos: todos filtered where completed === false and isValidTodo(todo)
  - sortedPendingTodos: sort(pendingTodos) by order asc, createdAt asc, id asc
  - pendingCount: sortedPendingTodos.length

- actions:
  - boot(): loads from storage via storage adapter; sets state and notice if wasReset
  - ensureActiveFilter(): sets filters.status = 'active' (used by Home on mount)
  - setNotice(notice | null)

- persistence hooks (future iterations):
  - on state change (mutations elsewhere), call saveState debounced. Home v0 does not mutate, so only read-path is used here.

Provide/Inject
- createStore() returns { state, getters, actions }
- provide('appStore', store) at App root
- useStore() injects the store in components

Error handling
- boot() never throws; on any error, sets default state and notice.

Testing
- Provide pure functions for selectors and sort in src/store/selectors.js for easy unit testing without Vue runtime.