# Research — Home (Pending Tasks)

This document captures decisions and references that inform the implementation plan.

## 1) Storage Strategy and Corruption Handling
- Per Constitution: localStorage under key "vue-todo.v1", tolerant reads, atomic full-payload writes, debounced I/O.
- Home must present a notice when a safe reset occurs. Implementation options:
  - Global store flag `notice: { kind: 'storage-reset', message: string } | null` set during boot if corruption detected.
  - A composable `useStorage()` returns `{ state, notice }` so Home can render the notice area.
- Validation approach: schema-guard functions that check shape of AppState and Todo entries. Invalid todos skipped for Home rendering.

## 2) Sorting Stability
- Implement a pure sort function with explicit tie-breakers: order asc, createdAt asc, id asc. Use `Intl.Collator('en')` only if locale-sensitive; for now, lexicographic compare via `<`/`>` is sufficient and smaller.
- Ensure sort is stable across browsers: since modern JS engines have stable `.sort`, but we still implement full comparator.

## 3) Accessibility Notes
- Use native `ul`/`li` elements; avoid redundant ARIA.
- The header should include an `aria-live="polite"` region for the pending count only if counts update while focused; for v0 static load it's optional.
- Provide visible focus styles for any actionable elements (none per spec for v0). The notice close button (if added) must be keyboard reachable.

## 4) Performance Considerations
- Avoid per-item watchers. Compute filtered + sorted array once from store via computed.
- With up to 200 items, simple rendering is fine. Consider `v-memo` or keying to avoid re-renders only if needed later.

## 5) Testing Strategy
- Unit tests (Vitest):
  - selectPendingTodos filters completed=false
  - sortTodos applies tie-breakers deterministically
  - storage read: corrupt JSON triggers safe reset flag and returns default state
  - invalid todos skipped without throwing
- Shallow component tests: HomeView renders count, empty state, and no controls in items.

## 6) Routing
- Optional for v0. If added, define a Home route `/` bound to HomeView. Otherwise mount HomeView directly in App.vue.

## 7) Copy and Empty State
- Empty message: "No pending tasks"
- Reset notice: "Your data was reset due to a storage error." Keep concise; may link to a help doc in future.

## 8) Security
- Ensure all todo text is rendered via mustache bindings `{{ todo.text }}` (escaped). No v-html. Sanitize not required since escaping is automatic.