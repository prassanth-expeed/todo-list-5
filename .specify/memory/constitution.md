# Vue Todo (Browser Storage) Constitution

## Core Principles

### I. Simplicity-First (Non-Negotiable)
- Build the smallest useful Todo app: add, edit, complete/uncomplete, delete, and filter todos.
- Prefer standard browser APIs and minimal dependencies; avoid frameworks or libraries unless they remove clear complexity.
- Keep UI minimal and fast; no backend, no auth, no networking.

### II. Client-Only and Offline-Ready
- The app must function fully without internet access; all state is stored in the browser.
- Persistence uses window.localStorage under a single namespaced key: "vue-todo.v1".
- Reads are tolerant (validate and default), writes are atomic (replace full payload) and debounced to avoid excessive I/O.

### III. Data Integrity with Versioned Persistence
- Define a stable data model:
  - Todo: { id: string (uuid), text: string, completed: boolean, createdAt: ISO string, updatedAt: ISO string, order: number }
  - AppState: { todos: Todo[], filters: { status: 'all' | 'active' | 'completed' } }
- Include a storage schemaVersion field. If schema changes, migrate on load without data loss; never silently drop data.
- Corrupt or unparseable storage triggers a safe reset with user notification.

### IV. Accessible, Usable, and Keyboard-First UX
- Meet basic a11y: semantic elements, ARIA where needed, focus management, visible focus styles, and sufficient color contrast.
- Keyboard support: add, edit, toggle, delete, and filter via keyboard without requiring a mouse.
- Respect user preferences (reduced motion) and ensure readable on mobile and desktop.

### V. Maintainable Vue 3 Architecture
- Use Vue 3 Single File Components (SFC) with the Composition API.
- Centralize app state with a simple reactive store (provide/inject) rather than adding a dependency; add Pinia only if growth requires it.
- Keep components small, cohesive, and testable. Separate persistence (storage) concerns from presentation and state.
- Code quality: ESLint + Prettier enforced; consistent naming and folder structure.

## Technology Stack & Constraints

- Framework & Tooling: Vue 3 + Vite, JavaScript (ES2022). TypeScript is optional; adopt only if type friction arises.
- Styling: Plain CSS with CSS variables; avoid large UI frameworks. Light utility classes are acceptable if they do not bloat bundle size.
- Storage: window.localStorage under key "vue-todo.v1" with a schemaVersion; payload kept well under storage limits (~5MB). Consider IndexedDB only if future features exceed localStorage suitability.
- Browser Support: Evergreen desktop and mobile browsers (latest 2 versions of Chrome, Edge, Firefox, Safari). No IE support.
- Performance Budgets: Initial JS bundle under 150KB gzip; First Interaction under 1s on typical laptops/phones; avoid long main-thread tasks (>50ms) in common flows.
- Security & Safety: No remote code or data. Escape user-provided text via Vue bindings (no v-html for todo content). Guard against XSS by never injecting raw HTML from todos.

## Development Workflow & Quality Gates

- Branching: main (protected), feature/* branches for work. Small, focused PRs.
- Commits: Conventional Commits style recommended (feat, fix, chore, refactor, docs, test, ci).
- Lint/Format: ESLint + Prettier run pre-commit (or in CI). CI fails on lint or build errors.
- Testing (lightweight):
  - Unit: Pure functions (e.g., storage adapter, filters) tested with Vitest.
  - Component: Minimal snapshot or render tests for core components.
  - Manual a11y pass before release (tab order, screen reader labels, contrast).
- Build & Release: Vite build must pass. Tag releases with SemVer (e.g., v0.1.0). Maintain a CHANGELOG once public.
- Documentation: README documents running, building, data model, and keyboard shortcuts.

## Governance

- This Constitution defines non-negotiable principles for this project. It supersedes ad-hoc practices.
- Amendments: Propose via PR describing rationale and migration plan (if data model/storage affected). Version this document with SemVer:
  - MAJOR: Breaking changes to principles or governance
  - MINOR: New principles/sections or significant additions
  - PATCH: Wording clarifications or small process tweaks
- Compliance: All PRs and releases verify adherence to Core Principles, Technology Constraints, and Quality Gates. Exceptions must be documented and time-boxed.

**Version**: 1.0.0 | **Ratified**: 2026-05-05 | **Last Amended**: 2026-05-05