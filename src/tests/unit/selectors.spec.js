import { describe, expect, it } from 'vitest';
import { selectPendingTodos, sortTodos } from '../../store/selectors';

describe('store/selectors', () => {
  it('selectPendingTodos returns only valid pending todos', () => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        {
          id: '1',
          text: 'A',
          completed: false,
          createdAt: '2026-05-05T09:00:00.000Z',
          order: 2
        },
        {
          id: '2',
          text: 'B',
          completed: true,
          createdAt: '2026-05-05T09:00:00.000Z',
          order: 1
        },
        { id: 'bad' }
      ]
    };

    expect(selectPendingTodos(state).map((t) => t.id)).toEqual(['1']);
  });

  it('sortTodos sorts by order asc, then createdAt asc, then id asc', () => {
    const items = [
      {
        id: 'b',
        text: 'B',
        completed: false,
        createdAt: '2026-05-05T09:00:00.000Z',
        order: 1
      },
      {
        id: 'a',
        text: 'A',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 1
      },
      {
        id: 'c',
        text: 'C',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 0
      }
    ];

    expect(sortTodos(items).map((t) => t.id)).toEqual(['c', 'a', 'b']);
  });

  it('selectPendingTodos skips invalid items; sortTodos assumes items already validated', () => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        {
          id: '1',
          text: 'X',
          completed: false,
          createdAt: '2026-05-05T09:00:00.000Z',
          order: 1
        },
        // invalid todo should be skipped by selectPendingTodos
        { id: 'bad', text: '', completed: false, createdAt: 'x', order: 1 }
      ]
    };

    const pending = selectPendingTodos(state);
    expect(pending.map((t) => t.id)).toEqual(['1']);

    const sorted = sortTodos(pending);
    expect(sorted.map((t) => t.id)).toEqual(['1']);
  });

  it('tie-breakers: same order uses createdAt then id', () => {
    const items = [
      {
        id: 'b',
        text: 'B',
        completed: false,
        createdAt: '2026-05-05T08:00:01.000Z',
        order: 1
      },
      {
        id: 'a',
        text: 'A',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 1
      },
      {
        id: 'c',
        text: 'C',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 1
      }
    ];

    expect(sortTodos(items).map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('invalid dates sort last; NaN order treated as Infinity', () => {
    const items = [
      {
        id: 'valid',
        text: 'valid',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 0
      },
      {
        id: 'badDate',
        text: 'badDate',
        completed: false,
        createdAt: 'not-a-date',
        order: 0
      },
      {
        id: 'nanOrder',
        text: 'nanOrder',
        completed: false,
        createdAt: '2026-05-05T07:00:00.000Z',
        order: Number.NaN
      }
    ];

    expect(sortTodos(items).map((t) => t.id)).toEqual(['valid', 'badDate', 'nanOrder']);
  });
});
