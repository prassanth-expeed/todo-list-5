import { test, expect } from '@playwright/test';

// SC-005: Performance — with 200 pending items, first interaction on Home occurs within 1s.
// Note: Long-task (>50ms) detection is best-effort in E2E; we assert render budget + that the app is responsive.

test('SC-005 renders 200 pending items within 1s budget (best-effort)', async ({ page }) => {
  await page.addInitScript(() => {
    const todos = Array.from({ length: 200 }).map((_, i) => ({
      id: `id-${String(i).padStart(3, '0')}`,
      text: `Task ${i + 1}`,
      completed: false,
      createdAt: new Date(2026, 0, 1, 0, 0, i).toISOString(),
      updatedAt: new Date(2026, 0, 1, 0, 0, i).toISOString(),
      order: i
    }));

    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));

    (window as any).__markStart = performance.now();
  });

  await page.goto('http://127.0.0.1:4173/');

  const list = page.getByRole('list', { name: 'Pending tasks' });
  await expect(list.getByRole('listitem')).toHaveCount(200);

  // Measure time from init-script mark to list fully present.
  const elapsed = await page.evaluate(() => performance.now() - (window as any).__markStart);
  expect(elapsed).toBeLessThan(1000);

  // First interaction check: click in header should succeed.
  await page.getByRole('heading', { name: 'Pending Tasks' }).click({ timeout: 1000 });
});
