# About Us — Research & Rationale

Routing Choice
- We favor a tiny in-app hash router to avoid introducing Vue Router for a single secondary page. Hash routing works on static hosting without server rewrite rules and keeps bundle size minimal, aligned with the Constitution’s Simplicity-First principle.
- If the app later requires more routes, nested routes, guards, or history-mode URLs, we can adopt Vue Router 4 with a clear migration path.

Back Navigation Behavior
- An explicit link to the root (href="#/") is deterministic and resilient regardless of user’s navigation history or entry point (e.g., landing directly on /about). It also preserves native link semantics for accessibility and middle-click/long-press behavior.
- We supplement with a Space key handler to match Enter activation.

Testing Scope
- Vitest covers DOM contracts and route transitions by manipulating location.hash in a JSDOM environment. This provides confidence with minimal tooling overhead. A full Playwright E2E can be deferred until more navigation complexity appears.

Accessibility Notes
- Ensure focus-visible styles are present and sufficiently contrasted. Using a semantic anchor ensures screen readers announce it properly. Keep the page structure minimal and keyboard path short.

Performance Considerations
- Implementation is static; no watchers over large collections on About view. Avoid unnecessary reactivity in the router; debounce hashchange if needed, though route changes are infrequent and user-driven.

Offline & Safety
- No network calls; About loads from the same bundle as the app. Even with corrupted storage, the About view renders independently of state initialization, and Back link remains operable.

---

## Manual a11y & performance check (T010)

Date: 2026-05-05
Browser: Chromium (dev container environment)

Checklist / results
- Tab order: From About page, Tab focuses the single "Back to App" link as expected.
- Focus visibility: `:focus-visible` outline is clearly visible around the link.
- Keyboard activation: Enter activates the link natively; Space activates via keydown handler.
- Zoom 200%: Text remains readable; layout remains within a single-column flow.
- Reduced motion: `prefers-reduced-motion: reduce` disables transitions/animations (none are used beyond the global guard).
- Performance: About view is static markup; no long tasks (>50ms) observed attributable to the screen.
