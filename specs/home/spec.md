Feature: Home (Pending Tasks View)

Overview
- Purpose: Provide a simple Home screen that shows all pending (active) tasks so users can immediately see what remains to be done.
- Framing: UI screen in a client-only Vue 3 app. No backend. State persisted in window.localStorage under the key "vue-todo.v1" per the project constitution.
- Scope of this spec: Display of pending tasks only. Creation, editing, toggling, and deletion are covered by other specs; where interactions are exposed on this screen, they are referenced but not specified in detail here.
- Iteration note: For this version, Home is read-only. No inline actions (complete, delete, edit) are presented in the list.

Definitions
- Pending / Active task: A Todo item where completed = false.
- Storage payload: AppState { todos: Todo[], filters: { status: 'all' | 'active' | 'completed' }, schemaVersion: string }
- Order: Numeric position used for display ordering; lower numbers appear first.

In Scope
- Rendering the list of all pending tasks derived from AppState.todos.
- Sort and display rules (order, text, basic metadata if shown).
- Empty state for when there are no pending tasks.
- Basic accessibility and keyboard reachability expectations for the list.
- Displaying a safe-reset notification if storage is corrupt/unparseable (as mandated by the constitution).

Out of Scope
- Adding, editing, deleting, completing/uncompleting tasks (specified elsewhere). This screen may surface controls that trigger those flows, but their behavior is not specified here beyond visibility and basic affordance.
- Non-English localization (assume English copy for now).
- Inline actions on items (toggle complete, delete, edit) — not available in this iteration; items are non-interactive.

Primary Screen
- Name: Home — Pending Tasks
- Default filter context: active (only pending tasks visible).
- Components (conceptual):
  - Header: Title (e.g., "Pending Tasks") and pending count.
  - List: A semantic list (ul/li or equivalent) of pending task items.
  - Empty State: Message when there are zero pending tasks.
  - Optional Global Notice Area: Displays storage reset/corruption notices.
  - Interaction scope for v0: No item-level action controls are displayed on the list items.

User Stories (Prioritized)
- US1 (P1): As a user, I want to land on Home and see all my pending tasks so I know what I need to do next.
  Acceptance (Given-When-Then):
  - GIVEN AppState with todos including both completed and not completed
    WHEN I open the app to the Home screen
    THEN I see only the todos where completed = false
    AND they are ordered by their order value ascending (ties break by createdAt ascending, then id lexicographically)
    AND the page header shows the total count of pending tasks.

- US2 (P1): As a user, I want a clear empty state when no tasks are pending so I understand there is nothing left to do.
  Acceptance:
  - GIVEN AppState where all todos have completed = true OR todos is empty
    WHEN I open the Home screen
    THEN the list area shows an empty state message (e.g., "No pending tasks")
    AND the pending count displays 0
    AND no placeholder items render.

- US3 (P1): As a user relying on keyboard and assistive tech, I need the pending list to be accessible and focusable where applicable.
  Acceptance:
  - GIVEN I navigate using keyboard only
    WHEN I tab through the Home screen
    THEN I can reach the header and any actionable controls on each task item (e.g., open, toggle, delete, if present)
    AND list semantics are announced correctly by a screen reader (list with N items)
    AND visible focus styles are present and do not rely on color alone.

- US4 (P1): As a user, I want the app to handle corrupt storage safely so the Home screen still loads in a known-good state.
  Acceptance:
  - GIVEN the localStorage payload under key "vue-todo.v1" is corrupt or unparseable
    WHEN I open the Home screen
    THEN the app performs a safe reset per constitution
    AND I see a visible notice that my data was reset due to corruption
    AND the pending list displays empty with a standard empty state message.

- US5 (P2): As a user, I want to see task text clearly without unsafe HTML so I can trust the app is secure.
  Acceptance:
  - GIVEN a pending task text contains characters that could be interpreted as HTML (e.g., <script>, <b>, &)
    WHEN the Home screen renders the list
    THEN the task text is displayed as plain text (escaped)
    AND no HTML is executed or rendered as markup.

- US6 (P1): As a user, I want the Home list to be read-only so I don’t accidentally change data from this screen.
  Acceptance:
  - GIVEN I view the Home screen
    WHEN I inspect each list item
    THEN I see no inline action controls for completing, deleting, or editing
    AND clicking or tapping the task text does not toggle completion or open edit
    AND keyboard navigation does not land on any per-item action controls.

Functional Requirements
- FR-001: On initial load, the Home screen sets/uses filters.status = 'active' and renders only todos with completed = false from AppState.todos.
- FR-002: Items are sorted by order ascending; if order values are equal, sort by createdAt ascending; if still equal, sort by id lexicographically ascending. Sorting is stable and deterministic.
- FR-003: Each item displays at minimum the task text. No HTML injection is allowed for task text.
- FR-004: The header shows a pending count equal to the number of rendered items.
- FR-005: Empty state is shown only when there are zero rendered items. Empty state includes a concise message (e.g., "No pending tasks").
- FR-006: The list is rendered with semantic markup (e.g., ul/li) and appropriate ARIA attributes only if needed; do not over-specify ARIA on native semantics.
- FR-007: All actionable controls within an item (if present) must be reachable by keyboard using standard tab order, with visible focus outlines.
- FR-008: Corrupt or unparseable storage triggers a safe reset of state and a visible notification/banner on the Home screen. No crashes or blank screens.
- FR-009: Rendering must tolerate partially invalid todos (e.g., missing optional fields). Invalid todos are skipped rather than crashing the view; a best-effort pending list is shown from valid items only.
- FR-010: Performance: With up to 200 pending items, the Home screen initial render completes within 1 second on a typical modern device; no long main-thread tasks (>50ms) in common flows.
- FR-011: Mobile: The list is readable and usable on small screens (legible font size, wrapping long text, no horizontal scroll required for core content).
- FR-012: Read-only: No per-item action controls (complete, delete, edit) are rendered on the Home list in this iteration; items are non-interactive except for text selection.

Non-Functional and Constraints (traceable to Constitution)
- NF-001: Client-only; no network requests are made on Home.
- NF-002: Persistence uses localStorage under key "vue-todo.v1" with a versioned schema; reads are validated and tolerant.
- NF-003: Accessibility: semantic structure, keyboard navigation, visible focus, and sufficient color contrast per WCAG basics.
- NF-004: Security: No v-html for task text; all user content is escaped via bindings.
- NF-005: Performance budgets as specified in FR-010 and constitution; bundle size budgets maintained at app level.

Edge Cases
- EC-001: Very long task text wraps to multiple lines without layout breakage; item height grows naturally.
- EC-002: Duplicate order values across items still produce a deterministic sequence using tie-breakers.
- EC-003: Mixed validity: Some todos invalid (e.g., text missing); valid pending items still render; invalid ones are ignored for the list and count.
- EC-004: Storage present with older schemaVersion: data is migrated on load elsewhere; Home receives valid AppState post-migration and renders normally.
- EC-005: Zero todos and filters.status pre-set to 'completed' or 'all' from a prior session: entering Home enforces 'active' for this screen and computes list/count accordingly.

Success Criteria
- SC-001: Accuracy — For any given valid AppState, the set of rendered items equals { todos | completed = false } and the count equals the size of that set.
- SC-002: Determinism — Given the same AppState input, the rendered order is identical across refreshes (order, createdAt, id tie-breakers).
- SC-003: Accessibility — Automated checks (e.g., axe) report 0 critical issues on the Home screen; keyboard can reach all actionable elements in the list.
- SC-004: Security — Rendering a task with text containing HTML/script produces no DOM nodes interpreted from that text; text appears verbatim (escaped).
- SC-005: Performance — With a seeded dataset of 200 pending items, First Interaction on Home occurs within 1s and no single task blocks the main thread >50ms.
- SC-006: Read-only — No per-item controls are present in the rendered DOM; automated queries for buttons/checkboxes inside list items return none.

Open Questions
- OQ-001: Should the Home screen allow inline completion (toggle) of tasks, or is it strictly read-only display? If allowed, what visual affordance and keyboard shortcut apply?
- OQ-002: Should the header include quick navigation to other filters (All, Completed), or is filter switching handled on a separate screen/control?
- OQ-003: Should a creation affordance (e.g., "+ Add task") appear in the empty state or header, or is task creation available elsewhere only?

Resolutions
- R-001 (2026-05-05): OQ-001 resolved — Keep it read-only for now. No inline completion or delete on Home v0. Future iterations may revisit.

Notes
- This spec intentionally avoids prescribing component structure or styling details beyond accessibility and semantics. Implementation choices belong in the plan/tasks documents.
