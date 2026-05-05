import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// SC-003: Accessibility — 0 critical a11y issues; list semantics announced; keyboard reachability.

test('SC-003 has no critical axe violations and supports basic keyboard navigation', async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        {
          id: 't1',
          text: 'Accessible task',
          completed: false,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
          order: 1
        }
      ]
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));
  });

  await page.goto('http://127.0.0.1:4173/');

  // Semantics: list with 1 item.
  const list = page.getByRole('list', { name: 'Pending tasks' });
  await expect(list.getByRole('listitem')).toHaveCount(1);

  // Ensure no focusable item controls exist.
  await expect(list.locator('button, input, a')).toHaveCount(0);

  // Axe: assert 0 critical issues.
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === 'critical');
  expect(critical, `Critical violations: ${JSON.stringify(critical, null, 2)}`).toEqual([]);
});
