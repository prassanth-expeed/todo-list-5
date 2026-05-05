import { test, expect } from '@playwright/test';

// SC-001: Accuracy — rendered items equals { todos | completed=false } and header count matches.

test('SC-001 shows only pending tasks and count matches', async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'completed' },
      todos: [
        {
          id: 'a',
          text: 'Pay rent',
          completed: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          order: 2
        },
        {
          id: 'b',
          text: 'Book dentist appointment',
          completed: true,
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
          order: 1
        },
        {
          id: 'c',
          text: 'Buy groceries',
          completed: false,
          createdAt: '2026-01-03T00:00:00.000Z',
          updatedAt: '2026-01-03T00:00:00.000Z',
          order: 3
        }
      ]
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));
  });

  await page.goto('http://127.0.0.1:4173/');

  await expect(page.getByRole('heading', { name: 'Pending Tasks' })).toBeVisible();
  await expect(page.getByText('2 pending', { exact: true })).toBeVisible();

  const list = page.getByRole('list', { name: 'Pending tasks' });
  await expect(list).toBeVisible();
  await expect(list.getByRole('listitem')).toHaveCount(2);

  // Completed item must not render.
  await expect(page.getByText('Book dentist appointment')).toHaveCount(0);

  // Pending items must render.
  await expect(page.getByText('Pay rent')).toBeVisible();
  await expect(page.getByText('Buy groceries')).toBeVisible();
});
