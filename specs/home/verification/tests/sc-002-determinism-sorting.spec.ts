import { test, expect } from '@playwright/test';

// SC-002: Determinism — sort by order asc; ties by createdAt asc; then id lexicographically.

test('SC-002 sorts pending todos deterministically with tie-breakers', async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        // order=1 tie -> createdAt tie -> id decides
        {
          id: 'b',
          text: 'Order1 createdAt1 id=b',
          completed: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          order: 1
        },
        {
          id: 'a',
          text: 'Order1 createdAt1 id=a',
          completed: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          order: 1
        },
        // order=1 but later createdAt
        {
          id: 'c',
          text: 'Order1 createdAt2 id=c',
          completed: false,
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
          order: 1
        },
        // order=0 comes first
        {
          id: 'z',
          text: 'Order0 id=z',
          completed: false,
          createdAt: '2026-01-05T00:00:00.000Z',
          updatedAt: '2026-01-05T00:00:00.000Z',
          order: 0
        }
      ]
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));
  });

  await page.goto('http://127.0.0.1:4173/');

  const list = page.getByRole('list', { name: 'Pending tasks' });
  const items = list.getByRole('listitem').locator('.pending-item__text');
  await expect(items).toHaveCount(4);

  await expect(items.nth(0)).toHaveText('Order0 id=z');
  await expect(items.nth(1)).toHaveText('Order1 createdAt1 id=a');
  await expect(items.nth(2)).toHaveText('Order1 createdAt1 id=b');
  await expect(items.nth(3)).toHaveText('Order1 createdAt2 id=c');
});
