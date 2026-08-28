import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('complete desktop workflow has no console or accessibility errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Patchboard');
  await expect(page.locator('h1')).toHaveText('Hear a Web Audio graph before coding it');
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
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('For creative coders learning how six browser audio modules affect one another.')).toBeVisible();
});

test('first-screen sample action enters the isolated demo in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
});

test('metadata and crawl files are route-correct', async ({ page, request }) => {
  for (const [route, title] of [['/', 'Patchboard — hear a Web Audio graph'], ['/demo', 'Demo — Patchboard'], ['/privacy', 'Privacy — Patchboard'], ['/terms', 'Terms — Patchboard'], ['/404.html', 'Page not found — Patchboard']] as const) {
    await page.goto(route); await expect(page).toHaveTitle(title); await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('main')).toHaveCount(1); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/audio-graph-sketchpad\.sociobot\.in\//); await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /patchboard-social\.png$/);
    const axe = await new AxeBuilder({ page: page as never }).analyze(); expect(axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
  const sitemap = await request.get('/sitemap.xml'); expect(sitemap.ok()).toBe(true); expect(sitemap.headers()['content-type']).toContain('xml'); expect(await sitemap.text()).toContain('/demo');
  const robots = await request.get('/robots.txt'); expect(await robots.text()).toContain('Sitemap: https://audio-graph-sketchpad.sociobot.in/sitemap.xml');
});

test('shared legal routes set titles and restore focus through history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page).toHaveTitle('Privacy — Patchboard');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Patchboard privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByRole('contentinfo')).toContainText('Built by Param Factory');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hear a Web Audio graph before coding it');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not connected');
  await expect(page.getByRole('link', { name: 'Return to Patchboard' })).toHaveAttribute('href', '/');
});
