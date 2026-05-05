# About Us — Implementation Plan

## Summary
A minimal, client-only About Us page for the Vue Todo app, rendered at the route path /about, displaying an h1 “About Us”, exactly one body paragraph, and a Back to App link that returns to the main Todo list without altering state or storage.

## Technical Context
- App architecture: Vue 3 + Vite, JavaScript (ES2022), plain CSS. Client-only; no backend; offline-ready.
- Persistence: window.localStorage under key "vue-todo.v1" with a versioned schema; reads tolerant, writes atomic and debounced. The About page MUST NOT read or write storage beyond normal app boot.
- State: Central reactive store via provide/inject (no Pinia unless growth requires). About page is read-only and does not depend on store mutations.
- Accessibility: Semantic markup, visible focus styles, keyboard operable navigation.
- Performance: Keep changes minimal; no long main-thread tasks; no new heavy deps.

## Constitution Check
- Simplicity-First: Adds a single static view with minimal code and no new heavy dependencies.
- Client-Only & Offline: No networking, fully static; works offline.
- Data Integrity: No storage mutations from /about; storage integrity preserved.
- A11y & Keyboard: h1 + p semantics; Back link is keyboard-focusable with visible outline; Enter/Space activation supported.
- Maintainable Vue 3 Architecture: SFC with Composition API; tiny in-app router keeps dependency surface minimal while enabling deep-linking.
- Technology Constraints: Vue 3 + Vite + JS; plain CSS; no UI framework.
- Performance Budgets: Negligible additional code; no long tasks.
- Security: No dynamic HTML injection; static copy only.

## Architecture and Key Decisions
- Routing: Introduce a tiny in-app hash-based router (no new dependency). Route table includes '/' (Todo list) and '/about' (About Us). Uses location.hash so deep links work on static hosting without server rewrites.
- View: Create AboutView.vue with semantic structure: h1 "About Us", exactly one non-empty paragraph, and a single interactive anchor labeled "Back to App".
- Navigation Back: Use an explicit link to the main screen via href="#/". For keyboard parity, handle Space key on the link to trigger navigation in addition to native Enter support, while preserving link semantics.
- State & Persistence: The shared store remains provided at the app root so navigating to /about and back does not reset or mutate todos or filters; AboutView performs no storage I/O.
- Styling: Plain CSS with focus-visible outline. Respect reduced motion preferences.
- Testing: Vitest-based unit/component tests to validate content presence, keyboard activation, route navigation, and that localStorage remains unchanged. Manual a11y pass per constitution.

## Project Structure
Framework-idiomatic Vite + Vue 3 layout at repository root:
- package.json, vite.config.ts (or .js), index.html, public/
- src/
  - main.js
  - App.vue
  - router/router.js (tiny in-app router)
  - store/store.js (existing simple reactive store)
  - views/
    - TodoView.vue (existing)
    - AboutView.vue (new)
  - components/ (shared UI; minimal)
  - styles/base.css (focus-visible, variables)
- tests/
  - unit/
    - AboutView.spec.js
    - router.spec.js (if needed)

Note: If the current project already has a different but idiomatic structure, keep it; only add the minimal new files.

## Data Model (external file)
See specs/about-us/data-model.md. No schema changes; About is read-only.

## API / Interface Contracts (external file)
See specs/about-us/contracts/about-contracts.md. Contracts cover route path, DOM structure, labels, and navigation expectations.

## Implementation Steps
1) Tiny Router (src/router/router.js)
   - Implement a reactive currentRoute ref parsing location.hash into a path string ('/' when empty).
   - Provide: currentRoute, navigate(path) that sets location.hash = '#'+path, and subscribe to 'hashchange' to update currentRoute.
   - Define route table: {
       '/': { name: 'Todo' },
       '/about': { name: 'About' }
     } for simple checks/testing.

2) Integrate Router in App.vue
   - Provide router via provide() at the root.
   - Conditionally render <TodoView v-if="currentRoute.value === '/'" /> and <AboutView v-else-if="currentRoute.value === '/about'" />.
   - Ensure the store (todos/filters) is created and provided above views so it persists across route changes.

3) AboutView.vue
   - Markup: <h1>About Us</h1> then exactly one <p> with default copy: "A simple, offline-ready Todo app that keeps your data in your browser so you can stay focused on your tasks." then a single <a href="#/" aria-label="Back to App">Back to App</a>.
   - Keyboard: Add keydown handler to treat Space as activation (preventDefault + click()). Enter works natively.
   - A11y: Ensure link is tabbable and has visible :focus-visible outline. No other interactive elements.

4) Styles
   - Ensure base.css includes focus styles (e.g., :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }).
   - Keep text readable at 200% zoom and small viewports; no overflow clipping.

5) No Storage/Network Work
   - Verify AboutView has no imports that read/write storage. Visiting /about does not trigger any fetch or storage writes.

6) Tests (Vitest)
   - AboutView.spec.js: asserts presence of h1 "About Us", exactly one p (non-empty), and a link named "Back to App". Simulate Enter and Space activation to assert navigate('/') is called or location.hash becomes '#/'.
   - Router.spec.js (optional): parse and normalization of hash to path; navigating updates currentRoute; unknown paths fallback to '/'.
   - Storage integrity: Snapshot localStorage (vue-todo.v1) before/after navigating to /about and back; assert unchanged.

7) Documentation
   - Update README (if present) with /about route mention.

## Risks and Mitigations
- Route Path Semantics: Using hash-based routing yields URLs like index.html#/about. Acceptability: In-app route path remains '/about'; deep linking works offline. Mitigation: If strict history URLs are later required, swap tiny router for Vue Router 4 in history mode with server fallback.
- Keyboard Space on Links: Native anchors don’t activate on Space. Mitigation: add a keydown Space handler while keeping anchor semantics and role.
- State Loss on Navigation: If store were scoped within views, navigating could reset it. Mitigation: Ensure store is provided at App root.
- Over-specifying Structure: If current code layout differs, adapt steps to the existing structure; do not introduce unnecessary churn.

## Acceptance Checklist Mapping
- FR-001..FR-007: /about route exists, semantic content present, single Back link, keyboard operable, no network, no state/storage changes.
- SC-001: Measures under 1 second render.
- SC-002: State preserved before/after navigation.
- SC-003: Tabbing focuses Back link; Enter/Space navigate back.
- SC-004: localStorage key "vue-todo.v1" unchanged.
- Edge Cases: Corrupt/empty storage does not affect About; small viewport and reduced motion remain accessible.

## Out of Scope (this iteration)
- Privacy, version, contact links, team/credits, i18n, analytics.

## Rollout
- Additive change. No migrations. Can be toggled via feature flag if desired (optional).