# About Us — Interface Contracts

Route Contract
- Path: /about (presented in-app as #/about for hash routing; logical path remains /about per spec)
- Deep link: Navigating directly to index.html#/about opens the About Us view.
- Back navigation: A single control labeled "Back to App" navigates to the main Todo list at path '/'.

DOM Contract
- Heading: Exactly one h1 with innerText "About Us".
- Body: Exactly one p element; text MUST be non-empty and human-readable (default provided by spec).
- Back control: A single anchor element with role=link, accessible name "Back to App".
- Focus: The Back link is focusable via Tab and displays a visible focus indicator.

Behavioral Contract
- Keyboard: Enter or Space while the Back link is focused navigates to '/'.
- State: Navigating to/from /about MUST NOT modify todos or current filter selection.
- Storage: localStorage key "vue-todo.v1" is unchanged by visiting /about.
- Network: Visiting /about performs zero network requests.

Testing Hints
- Query by role: heading level 1 named "About Us"; link named "Back to App".
- Count of paragraphs equals 1.
- Simulate navigation by modifying location.hash and assert view switch without side effects.