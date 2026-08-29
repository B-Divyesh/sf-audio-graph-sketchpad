import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PATCHBOARD_VERIFY_URL || 'https://audio-graph-sketchpad.sociobot.in';
const evidence = new URL('../.factory/evidence/live-cold/', import.meta.url);
await mkdir(evidence, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'allow' });
const page = await context.newPage();
const errors = [];
const external = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(base).origin) external.push(request.url()); });

let response = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
assert(response?.status() === 200, 'root did not return 200');
assert(await page.title() === 'Patchboard — hear a Web Audio graph', 'root title is wrong');
assert(await page.locator('h1').count() === 1, 'root must have one h1');
assert(await page.locator('main').count() === 1, 'root must have one main');
await page.evaluate(() => localStorage.setItem('patchboard.session.v1', 'LIVE SENTINEL'));
await page.getByRole('link', { name: 'Try it with sample data' }).click();
assert(new URL(page.url()).searchParams.get('demo') === '1', 'sample action did not enter ?demo=1');
await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('LIVE DEMO EDIT');
await page.getByRole('button', { name: 'Reset demo' }).click();
assert(await page.getByRole('textbox', { name: 'Patch', exact: true }).inputValue() === 'Neon steps', 'demo reset failed');
assert(await page.evaluate(() => localStorage.getItem('patchboard.session.v1')) === 'LIVE SENTINEL', 'demo touched normal storage');
await page.screenshot({ path: new URL('demo-desktop.png', evidence).pathname, fullPage: true });
let axe = await new AxeBuilder({ page }).analyze();
assert(!axe.violations.some((item) => ['serious', 'critical'].includes(item.impact)), 'demo has serious axe violations');

await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
assert(await page.title() === 'Privacy — Patchboard', 'privacy title is wrong');
assert(await page.getByRole('heading', { level: 1 }).evaluate((node) => node === document.activeElement), 'route focus did not move to privacy h1');
await page.goBack();
assert(await page.getByRole('heading', { level: 1 }).evaluate((node) => node === document.activeElement), 'back focus did not return to h1');

for (const [route, title] of [['/demo', 'Demo — Patchboard'], ['/privacy', 'Privacy — Patchboard'], ['/terms', 'Terms — Patchboard']]) {
  response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  assert(response?.status() === 200, `${route} did not return 200`);
  assert(await page.title() === title, `${route} title is wrong`);
  assert(await page.locator('h1').count() === 1, `${route} must have one h1`);
  assert(await page.getByRole('contentinfo').getByText('Built by Param Factory', { exact: false }).count() === 1, `${route} footer is missing`);
  axe = await new AxeBuilder({ page }).analyze();
  assert(!axe.violations.some((item) => ['serious', 'critical'].includes(item.impact)), `${route} has serious axe violations`);
}

assert(errors.length === 0, `console errors on successful routes: ${errors.join(' | ')}`);
errors.length = 0;

response = await page.goto(`${base}/definitely-missing-polish-1`, { waitUntil: 'networkidle' });
assert(response?.status() === 404, 'unknown route did not return HTTP 404');
assert(await page.title() === 'Page not found — Patchboard', '404 title is wrong');
assert(await page.getByRole('heading', { level: 1 }).textContent() === 'Page not found.', '404 page did not render');
await page.screenshot({ path: new URL('404-live.png', evidence).pathname, fullPage: true });
assert(errors.every((error) => error.startsWith('Failed to load resource: the server responded with a status of 404')), `unexpected 404-page console error: ${errors.join(' | ')}`);
errors.length = 0;

const sitemap = await context.request.get(`${base}/sitemap.xml`);
assert(sitemap.status() === 200 && (sitemap.headers()['content-type'] || '').includes('xml'), 'sitemap is not XML');
assert((await sitemap.text()).includes(`${base}/demo`), 'sitemap omits demo');

const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '390px page overflows horizontally');
await mobile.screenshot({ path: new URL('demo-mobile.png', evidence).pathname, fullPage: true });
await mobile.waitForFunction(() => navigator.serviceWorker.controller !== null);
await context.setOffline(true);
await mobile.reload({ waitUntil: 'domcontentloaded' });
assert(await mobile.getByRole('button', { name: 'Start audio' }).isEnabled(), 'offline demo is not usable');
await context.setOffline(false);

assert(errors.length === 0, `console errors after 404 route: ${errors.join(' | ')}`);
assert(external.length === 0, `unexpected external requests: ${external.join(' | ')}`);
await browser.close();
console.log(JSON.stringify({ base, routes: 5, unknownStatus: 404, axeSeriousCritical: 0, consoleErrors: 0, externalRequests: 0, mobileOverflow: false, offlineReload: true }));
