import { test, expect } from '@playwright/test';

// SC-006: Read-only — no per-item action controls are present; items are non-interactive.

test('SC-006 list items contain no buttons/checkboxes/links and clicking text does nothing', async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        {
          id: 'r1',
          text: 'Read-only task',
          completed: false,
          createdAt: '2026-04-01T00:00:00.000Z',
          updatedAt: '2026-04-01T00:00:00.000Z',
          order: 1
        }
      ]
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));
  });

  await page.goto('http://127.0.0.1:4173/');

  const list = page.getByRole('list', { name: 'Pending tasks' });
  const item = list.getByRole('listitem').first();

  await expect(item.locator('button, input, a, [role="button"], [role="checkbox"]')).toHaveCount(0);

  const before = await page.getByText('1 pending', { exact: true }).textContent();
  await page.getByText('Read-only task', { exact: true }).click();
  const after = await page.getByText('1 pending', { exact: true }).textContent();

  expect(after).toBe(before);
});
