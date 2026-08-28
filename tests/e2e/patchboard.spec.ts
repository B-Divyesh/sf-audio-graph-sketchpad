import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('builds, hears, compares, and shares a patch', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/Patchboard/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Signal graph' })).toBeVisible();

  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect(page.getByRole('button', { name: 'Stop audio' })).toBeVisible();

  await page.getByRole('button', { name: 'Edit cables' }).click();
  await page.getByRole('button', { name: /Noise Source/ }).click();
  await page.getByRole('button', { name: /Filter Shape/ }).click();
  await expect(page.getByText('Noise → Filter', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Finish cables' }).click();
  await page.getByRole('button', { name: /Filter Shape/ }).click();
  await page.getByLabel('Cutoff').fill('2600');
  await page.getByRole('button', { name: 'Copy A → B' }).click();
  await page.getByRole('button', { name: 'B', exact: true }).click();
  await expect(page.getByRole('button', { name: 'B', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Share patch' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Share link')).toHaveValue(/#patch=/);
  await page.getByRole('button', { name: 'Close' }).click();

  if (testInfo.project.name === 'chromium') {
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
});

test('fits a 390px viewport and exposes legal pages', async ({ page }) => {
  await page.goto('/');
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your patches stay yours.');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms, in plain language.');
});

test('offline reload uses the generated app shell after an online visit', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  const cachedUrls = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const requests = await Promise.all(cacheNames.map(async (cacheName) => (await caches.open(cacheName)).keys()));
    return requests.flat().map((request) => new URL(request.url).pathname);
  });
  expect(cachedUrls).toContain('/');
  expect(cachedUrls).toContainEqual(expect.stringMatching(/^\/assets\/index-.*\.js$/));
  expect(cachedUrls).toContainEqual(expect.stringMatching(/^\/assets\/index-.*\.css$/));

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Signal graph' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start audio' })).toBeEnabled();
  } finally {
    await context.setOffline(false);
  }
});

test('skip link moves keyboard focus to the main landmark', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to patchboard' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('a corrupt share link gives recovery guidance without parser details', async ({ page }) => {
  await page.goto('/#patch=not-json');
  await expect(page.locator('#status-line')).toHaveText(/compatible Patchboard session\. A fresh patch is ready to edit and share\./);
  await expect(page.locator('#status-line')).not.toContainText('Unexpected token');
  await expect(page.getByRole('button', { name: 'Start audio' })).toBeEnabled();
});
