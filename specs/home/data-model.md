# Home Feature — Data Model

This feature reuses the app-wide data model defined in the Constitution and constrains/derives from it for the Home (Pending Tasks) screen.

## Core Types

- Todo
  - id: string (uuid)
  - text: string (non-empty, trimmed for rendering)
  - completed: boolean
  - createdAt: ISO 8601 string
  - updatedAt: ISO 8601 string
  - order: number (integer; lower renders earlier)

- AppState
  - todos: Todo[]
  - filters: { status: 'all' | 'active' | 'completed' }
  - schemaVersion: string (semver-like: e.g., "1.0.0")

- Storage
  - Key: "vue-todo.v1"
  - Payload: JSON.stringify(AppState)

## Constraints and Validation

- Required Todo fields: id, text, completed, createdAt, order
- Optional: updatedAt (if absent, treat as createdAt for non-critical views)
- Text rendering: bound via Vue text bindings (no v-html)
- Skipping invalid items: If a todo is missing required fields or has invalid types, it is excluded from Home’s list and not counted
- Filters: On Home, filters.status must be 'active' (enforced on entry)

## Derivatives Used by Home

- PendingTodos = todos where completed === false
- SortedPending = sort(PendingTodos) by:
  1) order ascending (NaN treated as +Infinity)
  2) createdAt ascending (invalid dates sorted last)
  3) id lexicographically ascending
- PendingCount = SortedPending.length

## Default/Empty State

```
{
  "todos": [],
  "filters": { "status": "active" },
  "schemaVersion": "1.0.0"
}
```

## Utility Function Contracts (for reference)

- isValidTodo(todo: unknown): boolean
- normalizeTodo(todo: Partial<Todo>): Todo | null
- selectPendingTodos(state: AppState): Todo[]
- sortTodos(items: Todo[]): Todo[]  // stable, deterministic as per rules above

## Example Payload

```
{
  "schemaVersion": "1.0.0",
  "filters": { "status": "all" },
  "todos": [
    {
      "id": "7d1c2baf-1b6e-4b5b-8e76-ec3b1c0a1001",
      "text": "Buy milk & eggs <script>alert('x')</script>",
      "completed": false,
      "createdAt": "2026-05-05T09:00:00.000Z",
      "updatedAt": "2026-05-05T09:00:00.000Z",
      "order": 10
    },
    {
      "id": "7d1c2baf-1b6e-4b5b-8e76-ec3b1c0a1002",
      "text": "Take out trash",
      "completed": true,
      "createdAt": "2026-05-04T20:00:00.000Z",
      "updatedAt": "2026-05-04T20:00:00.000Z",
      "order": 5
    }
  ]
}
```

Rendering on Home would include only the first todo, with text safely escaped.