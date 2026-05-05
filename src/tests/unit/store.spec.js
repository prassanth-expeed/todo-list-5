import { describe, expect, it } from 'vitest';
import { createStore } from '../../store';

function createFakeAdapter({ state, wasReset = false } = {}) {
  return {
    loadState() {
      return {
        state:
          state ??
          {
            schemaVersion: '1.0.0',
            filters: { status: 'active' },
            todos: []
          },
        wasReset
      };
    },
    saveState() {}
  };
}

describe('store', () => {
  it('boot loads state and sets notice on wasReset', async () => {
    const adapter = createFakeAdapter({ wasReset: true });
    const store = createStore({ adapter });

    await store.boot();

    expect(store.state.todos).toEqual([]);
    expect(store.state.notice?.kind).toBe('storage-reset');
  });

  it('computed pendingCount and sortedPendingTodos are derived from state', async () => {
    const adapter = createFakeAdapter({
      state: {
        schemaVersion: '1.0.0',
        filters: { status: 'active' },
        todos: [
          {
            id: '2',
            text: 'B',
            completed: false,
            createdAt: '2026-05-05T09:00:00.000Z',
            order: 2
          },
          {
            id: '1',
            text: 'A',
            completed: false,
            createdAt: '2026-05-05T08:00:00.000Z',
            order: 1
          },
          {
            id: '3',
            text: 'Done',
            completed: true,
            createdAt: '2026-05-05T07:00:00.000Z',
            order: 0
          }
        ]
      }
    });

    const store = createStore({ adapter });
    await store.boot();

    expect(store.pendingCount.value).toBe(2);
    expect(store.sortedPendingTodos.value.map((t) => t.id)).toEqual(['1', '2']);
  });

  it("ensureActiveFilter enforces filters.status='active'", () => {
    const adapter = createFakeAdapter();
    const store = createStore({ adapter });

    store.state.filters.status = 'completed';
    store.ensureActiveFilter();

    expect(store.state.filters.status).toBe('active');
  });
});
