import { test, expect } from '@playwright/test';

// SC-001/SC-004 adjunct: Corrupt storage triggers safe reset notice and loads empty state.

test('Corrupt localStorage payload shows reset notice and empty state', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('vue-todo.v1', '{ this is not valid json');
  });

  await page.goto('http://127.0.0.1:4173/');

  await expect(page.getByRole('heading', { name: 'Pending Tasks' })).toBeVisible();
  await expect(page.getByText('0 pending', { exact: true })).toBeVisible();
  await expect(page.getByText('No pending tasks', { exact: true })).toBeVisible();

  await expect(
    page.getByRole('status', { name: 'Notice' }).getByText(
      'Your saved data was reset because it could not be read.',
      { exact: true }
    )
  ).toBeVisible();
});
