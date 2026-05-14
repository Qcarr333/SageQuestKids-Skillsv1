import { expect, test } from '@playwright/test';

test.describe('Gaming hub guardrails', () => {
  test('loads the game portal and exposes playable game cards', async ({ page }) => {
    await page.goto('/gaming');

    await expect(page.getByRole('heading', { name: 'Gaming' })).toBeVisible();
    await expect(page.getByText('Build keyboard, mouse, and computer skills')).toBeVisible();
    await expect(page.getByRole('button', { name: '3rd' })).toHaveClass(/bg-sky-600/);

    const startLinks = page.getByRole('link', { name: 'Start' });
    await expect(startLinks).toHaveCount(18);
    await expect(page.getByRole('link', { name: 'Preview' })).toBeVisible();
  });

  test('can navigate from the hub to Bug Trail Maze', async ({ page }) => {
    await page.goto('/gaming');
    await page
      .locator('article')
      .filter({ has: page.getByRole('heading', { name: 'Bug Trail Maze' }) })
      .getByRole('link', { name: 'Start' })
      .click();

    await expect(page).toHaveURL(/\/gaming\/bug-trail-maze$/);
    await expect(page.getByRole('heading', { name: 'Bug Trail Maze' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  });
});
