Feature: About Us

Overview
- A minimal, client-only About Us screen for the Vue Todo app. The screen presents a title, a single short paragraph, and a Back to App link that returns the user to the main Todo list without altering state.

Framing
- UI screen in a client-only web app (no backend). Acceptance focuses on visible content and observable navigation behavior.

In Scope
- Dedicated About Us screen reachable via a stable, direct link.
- Static content: title (h1), exactly one body paragraph, and a Back to App link.
- Keyboard accessibility for navigation and activation of the Back link.

Out of Scope (for this iteration)
- Detailed privacy statements, app version, contact links, team/credits.
- Internationalization/localization.
- Analytics or telemetry.

Primary Personas
- Any user of the Todo app who wants to understand what the app is and return to their tasks.

Navigation Contract (What, not how)
- The app SHALL expose an About Us screen addressable via a direct route path: /about.
- The About Us screen SHALL include a clearly labeled control to return to the main Todo list screen ("Back to App").

Content Contract
- Title: "About Us" (level-one heading).
- Body: Exactly one paragraph of copy. Default text (may be revised in content pass): "A simple, offline-ready Todo app that keeps your data in your browser so you can stay focused on your tasks."
- Back Link: A single, clearly labeled interactive element: "Back to App".

User Stories (Prioritized)
- US1 (P1): View About Us
  As a user, I can view a minimal About Us page so I know what this app is.
  Acceptance (Given-When-Then):
  - GIVEN the app is running
    WHEN I navigate directly to /about
    THEN I see a page with an h1 titled "About Us", exactly one non-empty paragraph, and a visible "Back to App" link.
  - GIVEN I am offline
    WHEN I open /about
    THEN the same content is available without errors.

- US2 (P1): Return to the Todo list
  As a user, I can return from the About Us page back to the main Todo list without losing my current state.
  Acceptance (Given-When-Then):
  - GIVEN I have an existing set of todos and a current filter selection
    WHEN I navigate to /about and then activate the "Back to App" link
    THEN I return to the main Todo list screen AND my todos and current filter selection remain unchanged.
  - GIVEN I arrived at /about from the Todo list
    WHEN I use the browser Back action
    THEN I am returned to the Todo list screen.

- US3 (P1): Keyboard accessibility
  As a keyboard-only user, I can reach and activate the Back to App link.
  Acceptance (Given-When-Then):
  - GIVEN focus is on the About Us page
    WHEN I use Tab/Shift+Tab
    THEN I can focus the "Back to App" link AND the focus indicator is visible.
  - GIVEN the Back to App link is focused
    WHEN I press Enter or Space
    THEN I am navigated back to the main Todo list screen.

Functional Requirements
- FR-001: The application SHALL render an About Us screen at the route path /about.
- FR-002: The About Us screen SHALL display a single level-one heading with the text "About Us".
- FR-003: The About Us screen SHALL display exactly one paragraph of body text; it MUST be non-empty and human-readable.
- FR-004: The About Us screen SHALL include a single, clearly labeled interactive control labeled "Back to App" that navigates to the main Todo list screen.
- FR-005: Activating the Back to App control SHALL NOT modify existing todos or the current filter selection.
- FR-006: The About Us screen SHALL be fully operable with keyboard-only input, including tab focus and activation of the Back to App control by Enter or Space.
- FR-007: Visiting the About Us screen SHALL NOT trigger any network requests.

Non-Functional Requirements & Constraints
- NFR-001 (Accessibility): The About Us screen SHALL use semantic markup (h1 for title; paragraph for body) and provide a visible focus outline for interactive elements.
- NFR-002 (Performance): Rendering /about SHOULD occur without perceptible delay on typical devices; there SHALL be no long main-thread tasks (>50ms) attributable to this screen.
- NFR-003 (Offline): The About Us screen SHALL function identically without internet connectivity.

Success Criteria (Measurable)
- SC-001: Navigating to /about displays the required elements (title, one paragraph, Back link) in under 1 second on a typical modern device and browser.
- SC-002: End-to-end test: Starting on the Todo list with at least one todo and a non-default filter, navigating to /about and activating Back returns to the Todo list with todos and filter unchanged.
- SC-003: Accessibility check: Tabbing from the page body focuses the Back link with a visible indicator; activating with Enter/Space navigates back successfully.
- SC-004: Storage integrity: Local storage contents (key "vue-todo.v1") are unchanged before vs. after visiting /about and returning.

Edge Cases
- EC-001: If local storage is corrupted or empty, /about still loads and shows the minimal content; Back navigates to the main screen without throwing errors.
- EC-002: With browser zoom at 200% or reduced motion preferences enabled, content remains readable and the Back link remains operable.
- EC-003: Very small viewport (mobile portrait): Title, paragraph, and Back link remain visible within a single scroll viewport.

Dependencies
- None (static, client-only screen; no backend).

Open Questions
- None for Minimal scope A. Future iterations may add privacy note, version, and links.
