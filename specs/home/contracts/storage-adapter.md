# Storage Adapter — Contract

Purpose: Provide a thin, testable interface around window.localStorage for reading/writing the AppState payload under the single key "vue-todo.v1" with tolerant reads and atomic, debounced writes.

Key: "vue-todo.v1"

Interface (pseudocode/TS-ish signature for clarity)

- loadState(): { state: AppState, wasReset: boolean }
  - Reads localStorage key
  - If missing: returns defaultState(), wasReset=false
  - If present but JSON.parse fails or schema invalid: performs safe reset (write defaultState()), returns { state: defaultState(), wasReset: true }

- saveState(state: AppState): void
  - Debounced (e.g., 150ms) full-payload write via JSON.stringify
  - No partial writes; replace the entire value

- validateAppState(input: unknown): AppState | null
  - Shape validator; ensures todos is array, required todo fields present with correct types, filters valid, schemaVersion string

- defaultState(): AppState
  - Returns an empty, valid AppState with filters.status='active' and current schemaVersion

Implementation notes
- Parsing: wrap JSON.parse in try/catch
- Validation: keep as pure functions in src/storage/validate.js so unit tests can cover them
- Debounce: small utility debounce; make it no-op in tests
- Security: never eval or otherwise execute; localStorage is plain string I/O

Events/flags
- wasReset flag should be plumbed to the store to expose a user-facing notice on first render after boot.

Edge handling
- If todos contain invalid entries, they are filtered out in selectors used by Home (skip-not-crash). The adapter may choose to leave them as-is in storage; normalization is optional but must not drop unknown fields.