import { test, expect } from '@playwright/test';

// SC-004: Security — task text containing HTML/script is displayed verbatim (escaped) and no HTML executes/renders.

test('SC-004 renders potentially unsafe text as plain text (no DOM injection)', async ({ page }) => {
  const payload = `<script>window.__xss = 'pwned'</script><b>bold</b>&`;

  await page.addInitScript((text) => {
    const state = {
      schemaVersion: '1.0.0',
      filters: { status: 'active' },
      todos: [
        {
          id: 'x1',
          text,
          completed: false,
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
          order: 1
        }
      ]
    };
    window.localStorage.setItem('vue-todo.v1', JSON.stringify(state));
  }, payload);

  await page.goto('http://127.0.0.1:4173/');

  // Visible text should include the literal payload (not interpreted as markup).
  await expect(page.getByText(payload, { exact: true })).toBeVisible();

  // No script/b tags should exist in the rendered DOM.
  await expect(page.locator('main script')).toHaveCount(0);
  await expect(page.locator('main b')).toHaveCount(0);

  // And no JS from the payload should have executed.
  await expect.poll(async () => page.evaluate(() => (window as any).__xss)).toBeUndefined();
});
