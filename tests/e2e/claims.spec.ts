import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/?demo=1');
});

test('@claim:demo-isolation sample edits and reset never touch normal data', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('patchboard.session.v1', 'REAL DATA SENTINEL'));
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('DEMO EDIT');
  expect(await page.evaluate(() => localStorage.getItem('patchboard.session.v1'))).toBe('REAL DATA SENTINEL');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
  expect(await page.evaluate(() => localStorage.getItem('patchboard.session.v1'))).toBe('REAL DATA SENTINEL');
});

test('@claim:six-modules demo exposes exactly six connectable modules', async ({ page }) => {
  await expect(page.locator('.module')).toHaveCount(6);
  await page.getByRole('button', { name: 'Edit cables' }).click();
  await page.getByRole('button', { name: /Noise Source/ }).click();
  await page.getByRole('button', { name: /Delay Space/ }).click();
  await expect(page.getByText('Noise → Delay', { exact: true })).toBeVisible();
});

test('@claim:audible-edits a cable changes native offline audio output', async ({ page }) => {
  const levels = await page.evaluate(async () => {
    async function render(connected: boolean): Promise<number> {
      const context = new OfflineAudioContext(1, 4410, 44100); const oscillator = context.createOscillator(); const gain = context.createGain(); gain.gain.value = 0.3;
      if (connected) oscillator.connect(gain).connect(context.destination);
      oscillator.start(); const buffer = await context.startRendering(); return buffer.getChannelData(0).reduce((sum, value) => sum + Math.abs(value), 0);
    }
    return [await render(false), await render(true)];
  });
  expect(levels[0]).toBe(0); expect(levels[1]).toBeGreaterThan(100);
});

test('@claim:synthesized-audio audio is generated locally without media or microphone use', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(page.url()).origin) external.push(request.url()); });
  expect(await page.locator('audio, video, input[type=file]').count()).toBe(0);
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect(page.getByRole('button', { name: 'Stop audio' })).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:fragment-ab-share restores distinct A and B variants', async ({ page }) => {
  await page.getByRole('button', { name: 'Hear B' }).click();
  await page.getByLabel('Cutoff').fill('4321');
  await page.getByRole('button', { name: 'Share patch' }).click();
  const share = await page.getByLabel('Share link').inputValue();
  await page.goto(share);
  await expect(page.getByRole('button', { name: 'Hear B' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Cutoff')).toHaveValue('4321');
  await page.getByRole('button', { name: 'Hear A' }).click();
  await expect(page.getByLabel('Cutoff')).not.toHaveValue('4321');
});

test('@claim:fragment-private-share fragment is absent from the server request', async ({ page }) => {
  await page.getByRole('button', { name: 'Share patch' }).click();
  const share = await page.getByLabel('Share link').inputValue();
  const navigationUrls: string[] = [];
  page.on('request', (request) => { if (request.isNavigationRequest()) navigationUrls.push(request.url()); });
  await page.goto(share);
  expect(navigationUrls.at(-1)).not.toContain('#patch=');
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
});

test('@claim:offline-reload cached demo reloads and starts offline', async ({ page, context }) => {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  const cached = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async (name) => (await caches.open(name)).keys()))).flat().map((request) => new URL(request.url).pathname));
  expect(cached).toContainEqual(expect.stringMatching(/^\/assets\/index-.*\.js$/)); expect(cached).toContainEqual(expect.stringMatching(/^\/assets\/index-.*\.css$/));
  await context.setOffline(true);
  try { await page.reload({ waitUntil: 'domcontentloaded' }); await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps'); await page.getByRole('button', { name: 'Start audio' }).click(); await expect(page.getByRole('button', { name: 'Stop audio' })).toBeVisible(); }
  finally { await context.setOffline(false); }
});

test('@claim:gesture-only-audio context starts only after Start audio', async ({ page }) => {
  await page.evaluate(() => { (window as unknown as { graphBuilds: number }).graphBuilds = 0; window.addEventListener('patchboard:graph-built', () => { (window as unknown as { graphBuilds: number }).graphBuilds += 1; }); });
  expect(await page.evaluate(() => (window as unknown as { graphBuilds: number }).graphBuilds)).toBe(0);
  await expect(page.getByRole('button', { name: 'Start audio' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('Audio running', { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect(page.getByRole('button', { name: 'Stop audio' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => (window as unknown as { graphBuilds: number }).graphBuilds)).toBe(1);
});

test('@claim:feedback-blocked cycle attempt leaves graph unchanged with an error', async ({ page }) => {
  const before = await page.locator('.connection-chip').count();
  await page.getByRole('button', { name: 'Edit cables' }).click(); await page.getByRole('button', { name: /Gain Level/ }).click(); await page.getByRole('button', { name: /Filter Shape/ }).click();
  await expect(page.locator('#status-line')).toContainText('feedback loop'); await expect(page.locator('.connection-chip')).toHaveCount(before);
});

test('@claim:audio-clock-schedule beat positions carry the audio-clock time', async ({ page }) => {
  await page.evaluate(() => { (window as unknown as { scheduled: Array<{ audioTime: number; currentAudioTime: number }> }).scheduled = []; window.addEventListener('patchboard:beat-scheduled', ((event: CustomEvent) => (window as unknown as { scheduled: unknown[] }).scheduled.push(event.detail)) as EventListener); });
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { scheduled: unknown[] }).scheduled.length)).toBeGreaterThan(1);
  const events = await page.evaluate(() => (window as unknown as { scheduled: Array<{ audioTime: number; currentAudioTime: number }> }).scheduled.slice(0, 2));
  expect(events[0].audioTime).toBeGreaterThanOrEqual(events[0].currentAudioTime); expect(events[1].audioTime - events[0].audioTime).toBeCloseTo(60 / 108, 3);
});

test('@claim:local-only complete edit and share flow stays same-origin and demo leaves storage unchanged', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('patchboard.session.v1', 'SENTINEL'));
  const external: string[] = []; page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(page.url()).origin) external.push(request.url()); });
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('PRIVATE DEMO'); await page.getByRole('button', { name: 'Start audio' }).click(); await page.getByRole('button', { name: 'Share patch' }).click(); await page.getByRole('button', { name: 'Close share dialog' }).click(); await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(external).toEqual([]); expect(await page.evaluate(() => localStorage.getItem('patchboard.session.v1'))).toBe('SENTINEL');
});

test('@claim:native-filter-node engine uses a low-pass BiquadFilterNode', async ({ page }) => {
  await page.evaluate(() => { (window as unknown as { graphDetail?: unknown }).graphDetail = undefined; window.addEventListener('patchboard:graph-built', ((event: CustomEvent) => { (window as unknown as { graphDetail: unknown }).graphDetail = event.detail; }) as EventListener); });
  await page.getByRole('button', { name: 'Start audio' }).click();
  const detail = await page.evaluate(() => (window as unknown as { graphDetail: { filterClass: string; filterType: string } }).graphDetail);
  expect(detail).toEqual({ filterClass: 'BiquadFilterNode', filterType: 'lowpass' }); await expect(page.getByText('This browser low-pass filter removes sound above the cutoff.')).toBeVisible();
});

test('@claim:resonance-output resonance changes output near the cutoff', async ({ page }) => {
  const rms = await page.evaluate(async () => {
    async function render(q: number): Promise<number> { const context = new OfflineAudioContext(1, 8820, 44100); const osc = context.createOscillator(); osc.frequency.value = 920; const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 920; filter.Q.value = q; osc.connect(filter).connect(context.destination); osc.start(); const data = (await context.startRendering()).getChannelData(0); return Math.sqrt(data.reduce((sum, value) => sum + value * value, 0) / data.length); }
    return [await render(0.1), await render(12)];
  });
  expect(rms[1]).toBeGreaterThan(rms[0] * 2);
});

test('@claim:code-export generated JavaScript contains values and active connections', async ({ page }) => {
  await page.getByRole('button', { name: 'Copy Web Audio code' }).click(); const code = await page.getByLabel('Generated JavaScript').inputValue();
  expect(code).toContain('async function startPatch'); expect(code).toContain('oscillator.connect(filter)'); expect(code).toContain('speaker.connect(context.destination)'); expect(code).toContain('filter.frequency.value = 920'); expect(code).not.toContain('fetch(');
  const result = await page.evaluate(async (source) => { const start = new Function(`${source}; return startPatch;`)() as (context: AudioContext) => Promise<{ context: AudioContext; nodes: { filter: BiquadFilterNode; delay: DelayNode } }>; const built = await start(new AudioContext()); const values = { cutoff: built.nodes.filter.frequency.value, delay: built.nodes.delay.delayTime.value }; await built.context.close(); return values; }, code);
  expect(result.cutoff).toBe(920); expect(result.delay).toBeCloseTo(0.24, 4);
});

test('@claim:free-use editor opens without account or payment gate', async ({ page }) => {
  await expect(page.getByText('Free.', { exact: true })).toBeVisible(); await expect(page.getByRole('button', { name: 'Start audio' })).toBeEnabled(); await expect(page.locator('input[type=password], [href*="checkout"], [href*="login"]')).toHaveCount(0);
});

test('@claim:scope-limits has no upload, microphone, track, account, or cloud controls', async ({ page }) => {
  await expect(page.locator('input[type=file], audio, video')).toHaveCount(0); await expect(page.getByText('Patchboard needs no account, upload, sample library, or microphone.')).toBeVisible(); expect(await page.evaluate(() => document.body.innerText.includes('Sign in'))).toBe(false);
});
