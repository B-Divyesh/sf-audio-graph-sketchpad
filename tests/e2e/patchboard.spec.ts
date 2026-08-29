import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('complete desktop workflow has no console or accessibility errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Patchboard');
  await expect(page.locator('h1')).toHaveText('Neon steps sample patch');
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect(page.getByRole('button', { name: 'Stop audio' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit cables' }).click();
  await page.getByRole('button', { name: /Noise Source/ }).click();
  await page.getByRole('button', { name: /Delay Space/ }).click();
  await expect(page.getByText('Noise → Delay', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy Web Audio code' }).click();
  await expect(page.getByRole('dialog', { name: /Web Audio code/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close code dialog' }).click();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('mobile first screen fits and keeps the sample action visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');
  const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(size.scroll).toBeLessThanOrEqual(size.viewport);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hear a Web Audio graph before coding it');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('For creative coders learning how six browser audio modules affect one another.')).toBeVisible();
  await expect(page.getByText('Free.', { exact: true })).toBeVisible();
  await expect(page.getByText('Works offline after your first visit.', { exact: true })).toBeVisible();
  await expect(page.getByText('Patches stay in this browser.', { exact: true })).toBeVisible();
});

test('first-screen sample action enters the isolated demo in one click', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
  if (testInfo.project.name === 'mobile') {
    for (const locator of [
      page.getByText('Demo — sample data, nothing is saved'),
      page.getByRole('heading', { level: 1 }),
      page.getByText('920 Hz cutoff · 240 ms delay · 4 cables'),
      page.getByText('Oscillator → Filter → Delay → Gain → Speaker'),
      page.getByRole('button', { name: 'Start audio' }),
      page.getByRole('textbox', { name: 'Patch', exact: true }),
      page.getByRole('heading', { name: 'Signal graph' }),
    ]) {
      const box = await locator.boundingBox();
      expect(box, 'demo content must have a rendered box').not.toBeNull();
      expect(box!.y, 'demo content must begin in the first phone viewport').toBeLessThan(844);
    }
  }
});

test('metadata and crawl files are route-correct', async ({ page, request }) => {
  for (const [route, title] of [['/', 'Patchboard — hear a Web Audio graph'], ['/demo', 'Demo — Patchboard'], ['/privacy', 'Privacy — Patchboard'], ['/terms', 'Terms — Patchboard'], ['/404.html', 'Page not found — Patchboard']] as const) {
    await page.goto(route); await expect(page).toHaveTitle(title); await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('main')).toHaveCount(1); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/audio-graph-sketchpad\.sociobot\.in\//); await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /patchboard-social\.png$/);
    const axe = await new AxeBuilder({ page: page as never }).analyze(); expect(axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
  const sitemap = await request.get('/sitemap.xml'); expect(sitemap.ok()).toBe(true); expect(sitemap.headers()['content-type']).toContain('xml'); expect(await sitemap.text()).toContain('/demo');
  const robots = await request.get('/robots.txt'); expect(await robots.text()).toContain('Sitemap: https://audio-graph-sketchpad.sociobot.in/sitemap.xml');
});

test('shared legal routes restore focus and scroll position through history', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 634));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  await page.locator('.site-nav a[href="/privacy"]').evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page).toHaveTitle('Privacy — Patchboard');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Patchboard privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByRole('contentinfo')).toContainText('Built by Param Factory');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hear a Web Audio graph before coding it');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Patchboard privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Patchboard');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Patchboard terms');
});

test('skip link moves keyboard focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('corrupt share link gives safe recovery guidance', async ({ page }) => {
  await page.goto('/#patch=not-json');
  await expect(page.locator('#status-line')).toHaveText(/compatible Patchboard session\. A fresh patch is ready/);
  await expect(page.locator('#status-line')).not.toContainText('Unexpected token');
});

test('designed 404 route has a recovery link', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Patchboard');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found.');
  await expect(page.getByRole('link', { name: 'Return to Patchboard' })).toHaveAttribute('href', '/');
});
