# About Us — Data Model

No new data model entities are introduced for the About Us feature. The existing app state remains unchanged.

Existing reference (from Constitution):
- Todo: { id: string (uuid), text: string, completed: boolean, createdAt: ISO string, updatedAt: ISO string, order: number }
- AppState: { todos: Todo[], filters: { status: 'all' | 'active' | 'completed' }, schemaVersion: number }

Constraints for About Us:
- Read-only view: MUST NOT mutate AppState or write to localStorage (key "vue-todo.v1").
- Visiting /about MUST NOT trigger reads or writes beyond what the app already does during initialization.
- Storage integrity: Contents before and after visiting /about are byte-for-byte identical.