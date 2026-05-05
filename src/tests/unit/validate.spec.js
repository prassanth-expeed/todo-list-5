import { describe, expect, it } from 'vitest';
import { isValidTodo, validateAppState } from '../../storage/validate';

describe('storage/validate', () => {
  it('isValidTodo returns true for valid todo (updatedAt optional)', () => {
    expect(
      isValidTodo({
        id: 'a',
        text: 'Hello',
        completed: false,
        createdAt: '2026-05-05T09:00:00.000Z',
        order: 1
      })
    ).toBe(true);
  });

  it('isValidTodo rejects invalid todos', () => {
    expect(isValidTodo(null)).toBe(false);
    expect(
      isValidTodo({
        id: 'a',
        text: '',
        completed: false,
        createdAt: '2026-05-05T09:00:00.000Z',
        order: 1
      })
    ).toBe(false);
    expect(
      isValidTodo({
        id: 'a',
        text: 'x',
        completed: false,
        createdAt: '2026-05-05T09:00:00.000Z',
        order: NaN
      })
    ).toBe(false);
  });

  it('validateAppState accepts valid shape', () => {
    const result = validateAppState({
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: []
    });

    expect(result).toEqual({
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: []
    });
  });

  it('validateAppState rejects invalid shape', () => {
    expect(validateAppState(null)).toBe(null);
    expect(validateAppState({})).toBe(null);
    expect(
      validateAppState({ schemaVersion: '1.0.0', filters: { status: 'nope' }, todos: [] })
    ).toBe(null);
    expect(
      validateAppState({ schemaVersion: '1.0.0', filters: { status: 'active' }, todos: {} })
    ).toBe(null);
  });
});
