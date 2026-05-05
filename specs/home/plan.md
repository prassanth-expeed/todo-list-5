# Plan — Home (Pending Tasks)

Status: v0, initial planning

## Summary
Implement a Home screen in a Vue 3 + Vite client-only app that displays only active (not completed) todos in a read-only list with a header showing the pending count, deterministic sorting, an empty state, and a safe-reset notice upon storage corruption.

## Technical Context
- Stack: Vue 3 (SFC, Composition API) + Vite, JavaScript (ES2022). Styling via plain CSS.
- Persistence: localStorage under key "vue-todo.v1" with schemaVersion, per Constitution. No backend.
- Architecture: Minimal provide/inject store; no Pinia for v0. Storage adapter encapsulates localStorage and tolerant reads.
- A11y: Semantic list, keyboard-friendly focus styles. No per-item controls in v0.
- Performance: Handle up to 200 pending items within 1s initial render; pure computed selectors.

## Constitution Check
- Client-only, offline-ready: YES
- Single namespaced localStorage key with versioning: YES
- Data integrity and tolerant reads with safe reset + notice: YES
- Accessible, keyboard-first basics: YES
- Maintainable Vue 3 architecture (SFCs, Composition API, centralized store): YES
- Tooling (lint/test) to be aligned at repo level: out of scope for this plan but expected.

## Project Structure
- package.json, vite.config.js, index.html at root (to be created if not present)
- src/
  - main.js (createApp, provide store, mount App)
  - App.vue (shell; renders HomeView)
  - components/
    - PendingList.vue (renders ul/li of pending tasks)
  - views/
    - HomeView.vue (header, count, optional GlobalNotice, PendingList)
  - store/
    - index.js (createStore, useStore)
    - selectors.js (pending, sorting)
  - storage/
    - adapter.js (loadState, saveState, validate, defaultState)
    - validate.js (schema guards)
  - styles/
    - base.css (focus styles, variables)
  - tests/
    - unit/ (selectors, storage)
    - component/ (HomeView)

## Data Model
See specs/home/data-model.md for full details. Home derives `sortedPendingTodos` and `pendingCount` from AppState.

## API/Interface Contracts
- Storage Adapter Contract: specs/home/contracts/storage-adapter.md
- Store Contract: specs/home/contracts/store.md

## Implementation Steps
1) Storage adapter
- Implement validateAppState and isValidTodo guards
- Implement loadState with try/catch, schema validation, and safe reset (returns wasReset flag)
- Implement saveState with debounce (no-op in tests)

2) Store (provide/inject)
- createStore(): reactive state + computed selectors + boot() action; expose ensureActiveFilter()
- App bootstrap: in main.js, create store, await boot(), provide, mount

3) HomeView.vue
- On mount, call ensureActiveFilter()
- Render header: "Pending Tasks" + count from pendingCount
- If notice.kind === 'storage-reset', render a dismissible banner (setNotice(null) on close)
- Render PendingList with items = sortedPendingTodos
- Render empty state when count === 0 with copy: "No pending tasks"

4) PendingList.vue
- Semantic ul/li
- Render only todo.text via mustache binding (escaped). No buttons/checkboxes.
- Handle long text by wrapping; no horizontal scroll

5) Styles
- Base focus styles (use :focus-visible)
- Minimal spacing and readable font sizes

6) Testing (Vitest)
- selectors: pending filter and sort tie-breakers
- storage: corrupt JSON triggers safe reset and notice flag
- component: HomeView shows count, empty state, and no per-item controls in DOM

## Risks and Mitigations
- Risk: Over-engineering store early. Mitigation: keep minimal provide/inject per Constitution; revisit Pinia later if needed.
- Risk: Silent data loss on validation. Mitigation: skip invalid todos for rendering only; do not mutate storage; consider telemetry (N/A offline-only).
- Risk: A11y regressions. Mitigation: manual keyboard pass and axe checks before release.
- Risk: Performance with very long texts. Mitigation: CSS word-wrap and avoid heavy per-item logic.

## Open Decisions
- Notice placement: Use a global banner below the header in HomeView for v0.
- Routing: Defer vue-router; mount HomeView directly in App.vue for v0.

## Acceptance Traceability
- US1/FR-001..FR-004/FR-009/FR-012: HomeView + selectors implement pending-only, sorted, count, read-only
- US2/FR-005: Empty state renders when count=0
- US3/FR-006/FR-007: Semantic list and focus styles (no item controls in v0)
- US4/FR-008: storage adapter sets wasReset; banner shown
- US5/NF-004: text escaped via bindings
- FR-010/Performance: selectors are pure and efficient; list capped by design

## Tasks (High-Level)
- Storage adapter and validation utilities
- Store with boot/ensureActiveFilter and computed selectors
- HomeView + PendingList components
- Styles (base.css)
- Tests (selectors, storage, component)

## Next Iterations (Not in v0)
- Add inline actions (toggle complete) and keyboard affordances (if product approves)
- Introduce vue-router for multi-view navigation
- Consider Pinia if store complexity increases