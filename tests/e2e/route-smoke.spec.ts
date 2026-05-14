import { expect, test } from '@playwright/test';

const gameRoutes = [
  ['/gaming/typing-meteor-defense', 'Typing Meteor Defense'],
  ['/gaming/story-sort', 'Story Sort'],
  ['/gaming/precision-painter-studio', 'Precision Painter Studio'],
  ['/gaming/code-keys-workshop', 'Code Keys Workshop'],
  ['/gaming/rhythm-row-typing', 'Rhythm Row Typing'],
  ['/gaming/keyboard-expedition', 'Keyboard Expedition'],
  ['/gaming/bug-trail-maze', 'Bug Trail Maze'],
  ['/gaming/math-key-quest', 'Math Key Quest'],
  ['/gaming/word-builder-farm', 'Word Builder Farm'],
  ['/gaming/target-tracker', 'Target Tracker'],
  ['/gaming/circuit-builder-lab', 'Circuit Builder Lab'],
  ['/gaming/gravity-workshop', 'Gravity Workshop'],
  ['/gaming/discovery-trails', 'Discovery Trails'],
  ['/gaming/word-storm', 'Word Storm'],
  ['/gaming/memory-match', 'Memory Match'],
  ['/gaming/cipher-quest', 'Cipher Quest'],
  ['/gaming/droplets', 'Droplets'],
  ['/gaming/shakerz', 'Shakerz'],
] as const;

test.describe('Game route smoke guardrails', () => {
  for (const [route, title] of gameRoutes) {
    test(`${title} renders without browser console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.goto(route);

      await expect(page.getByRole('heading', { name: new RegExp(title, 'i') })).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  }
});
