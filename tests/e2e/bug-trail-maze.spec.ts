import { expect, test } from '@playwright/test';

test.describe('Bug Trail Maze guardrails', () => {
  test('starts, pauses, resumes, and ends a round with a summary', async ({ page }) => {
    await page.goto('/gaming/bug-trail-maze');

    await expect(page.getByRole('heading', { name: 'Bug Trail Maze' })).toBeVisible();
    await expect(page.getByLabel('Select grade')).toBeVisible();

    await page.getByRole('button', { name: 'Start', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'End Round' })).toBeVisible();

    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();

    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    await page.getByRole('button', { name: 'End Round' }).click();
    await expect(page.getByText(/Round XP:/)).toBeVisible();
    await expect(page.getByRole('button', { name: /play again/i })).toBeVisible();
  });

  test('keeps accessibility support controls available during play', async ({ page }) => {
    await page.goto('/gaming/bug-trail-maze');
    await page.getByRole('button', { name: 'Start', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Mute Sounds' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reduce Motion' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Wider Path Assist' })).toBeVisible();

    await page.getByRole('button', { name: 'Wider Path Assist' }).click();
    await expect(page.getByRole('button', { name: 'Normal Path Width' })).toBeVisible();
  });
});
