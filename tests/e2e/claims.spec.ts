import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/?demo=1');
});

async function saveNormalPatch(page: import('@playwright/test').Page, name: string): Promise<string> {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill(name);
  await page.getByRole('button', { name: 'Save in this browser' }).click();
  return page.evaluate(() => localStorage.getItem('patchboard.session.v1') ?? '');
}

test('@claim:demo-isolation sample edits and reset never touch a saved normal patch', async ({ page }) => {
  const normalPatch = await saveNormalPatch(page, 'NORMAL PATCH');
  expect(normalPatch).toContain('NORMAL PATCH');
  await page.goto('/?demo=1');
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('DEMO EDIT');
  expect(await page.evaluate(() => localStorage.getItem('patchboard.session.v1'))).toBe(normalPatch);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('Neon steps');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('NORMAL PATCH');
  expect(await page.evaluate(() => localStorage.getItem('patchboard.session.v1'))).toBe(normalPatch);
});

test('@claim:six-modules demo exposes exactly six connectable modules', async ({ page }) => {
  await expect(page.locator('.module')).toHaveCount(6);
  await page.getByRole('button', { name: 'Edit cables' }).click();
  await page.getByRole('button', { name: /Noise Source/ }).click();
  await page.getByRole('button', { name: /Delay Space/ }).click();
  await expect(page.getByText('Noise → Delay', { exact: true })).toBeVisible();
});

test('@claim:audible-edits removing a Patchboard cable changes its running audio output', async ({ page }) => {
  await page.evaluate(() => {
    (window as unknown as { levels: number[] }).levels = [];
    window.addEventListener('patchboard:audio-level', ((event: CustomEvent<{ level: number }>) => { (window as unknown as { levels: number[] }).levels.push(event.detail.level); }) as unknown as EventListener);
  });
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect.poll(() => page.evaluate(() => Math.max(...(window as unknown as { levels: number[] }).levels, 0))).toBeGreaterThan(1);
  const connectedLevel = await page.evaluate(() => Math.max(...(window as unknown as { levels: number[] }).levels, 0));
  await page.getByRole('button', { name: 'Remove cable from Filter to Delay' }).click();
  await expect(page.locator('#status-line')).toContainText('removed');
  await page.waitForTimeout(1600);
  const disconnectedLevel = await page.evaluate(() => {
    const levels = (window as unknown as { levels: number[] }).levels;
    return Math.max(...levels.slice(-20), 0);
  });
  expect(disconnectedLevel).toBeLessThan(connectedLevel * 0.25);
});

test('@claim:synthesized-audio Patchboard starts a browser graph without samples or microphone access', async ({ page }) => {
  await page.addInitScript(() => {
    const audit = { microphoneCalls: 0, fetches: [] as string[], xhrs: [] as string[], decodes: 0, mediaPlays: 0 };
    (window as unknown as { audioAudit: typeof audit }).audioAudit = audit;
    if (navigator.mediaDevices?.getUserMedia) {
      const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = ((constraints: MediaStreamConstraints) => { audit.microphoneCalls += 1; return getUserMedia(constraints); }) as typeof navigator.mediaDevices.getUserMedia;
    }
    const fetch = window.fetch.bind(window); window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => { audit.fetches.push(String(input)); return fetch(input, init); }) as typeof window.fetch;
    const open = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function(...args: [string, string | URL, boolean?, string?, string?]) { audit.xhrs.push(String(args[1])); return open.call(this, ...args); } as unknown as typeof XMLHttpRequest.prototype.open;
    const decode = BaseAudioContext.prototype.decodeAudioData; BaseAudioContext.prototype.decodeAudioData = function(...args: Parameters<BaseAudioContext['decodeAudioData']>) { audit.decodes += 1; return decode.apply(this, args); };
    const play = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function() { audit.mediaPlays += 1; return play.call(this); };
  });
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await page.evaluate(() => { (window as unknown as { graphBuilt: boolean }).graphBuilt = false; window.addEventListener('patchboard:graph-built', () => { (window as unknown as { graphBuilt: boolean }).graphBuilt = true; }); });
  expect(await page.locator('audio, video, input[type=file]').count()).toBe(0);
  await page.getByRole('button', { name: 'Start audio' }).click();
  await expect(page.getByRole('button', { name: 'Stop audio' })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { graphBuilt: boolean }).graphBuilt)).toBe(true);
  expect(await page.evaluate(() => (window as unknown as { audioAudit: { microphoneCalls: number; fetches: string[]; xhrs: string[]; decodes: number; mediaPlays: number } }).audioAudit)).toEqual({ microphoneCalls: 0, fetches: [], xhrs: [], decodes: 0, mediaPlays: 0 });
  expect(requests.filter((url) => /\.(?:mp3|wav|ogg|m4a|aac)(?:$|[?#])/i.test(url))).toEqual([]);
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

test('@claim:local-only normal storage survives an isolated demo and no edit sends data elsewhere', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('NORMAL STORAGE PATCH');
  await page.getByRole('button', { name: 'Save in this browser' }).click();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('NORMAL STORAGE PATCH');
  const normalPatch = await page.evaluate(() => localStorage.getItem('patchboard.session.v1'));
  await page.goto('/?demo=1');
  await page.getByRole('textbox', { name: 'Patch', exact: true }).fill('DEMO MUTATION');
  await page.getByRole('button', { name: 'Start audio' }).click();
  await page.getByRole('button', { name: 'Share patch' }).click();
  await page.getByRole('button', { name: 'Close share dialog' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('textbox', { name: 'Patch', exact: true })).toHaveValue('NORMAL STORAGE PATCH');
  const storage = await page.evaluate(async () => ({
    local: Object.values(localStorage), session: Object.values(sessionStorage),
    databases: 'databases' in indexedDB ? (await indexedDB.databases()).map((database) => database.name) : [],
    cacheBodies: await Promise.all((await Promise.all((await caches.keys()).map(async (name) => (await caches.open(name)).keys()))).flat().map(async (request) => (await (await caches.match(request))?.text() ?? ''))),
  }));
  expect(normalPatch).toContain('NORMAL STORAGE PATCH');
  expect(storage.local.join('')).toContain('NORMAL STORAGE PATCH');
  expect(JSON.stringify(storage)).not.toContain('DEMO MUTATION');
  expect(requests.filter((url) => new URL(url).origin !== new URL(page.url()).origin)).toEqual([]);
});

test('@claim:native-filter-node engine uses a low-pass BiquadFilterNode', async ({ page }) => {
  await page.evaluate(() => { (window as unknown as { graphDetail?: unknown }).graphDetail = undefined; window.addEventListener('patchboard:graph-built', ((event: CustomEvent) => { (window as unknown as { graphDetail: unknown }).graphDetail = event.detail; }) as EventListener); });
  await page.getByRole('button', { name: 'Start audio' }).click();
  const detail = await page.evaluate(() => (window as unknown as { graphDetail: { filterClass: string; filterType: string } }).graphDetail);
  expect(detail).toMatchObject({ filterClass: 'BiquadFilterNode', filterType: 'lowpass' }); await expect(page.getByText('This browser low-pass filter removes sound above the cutoff.')).toBeVisible();
});

test('@claim:resonance-output changing Patchboard resonance changes its active filter and output', async ({ page }) => {
  await page.evaluate(() => {
    (window as unknown as { levels: number[]; updates: Array<{ filterQ: number; cutoff: number }> }).levels = [];
    (window as unknown as { updates: Array<{ filterQ: number; cutoff: number }> }).updates = [];
    window.addEventListener('patchboard:audio-level', ((event: CustomEvent<{ level: number }>) => { (window as unknown as { levels: number[] }).levels.push(event.detail.level); }) as unknown as EventListener);
    window.addEventListener('patchboard:graph-updated', ((event: CustomEvent<{ filterQ: number; cutoff: number }>) => { (window as unknown as { updates: Array<{ filterQ: number; cutoff: number }> }).updates.push(event.detail); }) as unknown as EventListener);
  });
  await page.getByLabel('Cutoff').fill('165');
  await page.getByLabel('Resonance').fill('0.1');
  await page.getByRole('button', { name: 'Start audio' }).click();
  await page.waitForTimeout(450);
  const lowResonance = await page.evaluate(() => Math.max(...(window as unknown as { levels: number[] }).levels.slice(-10), 0));
  await page.getByLabel('Resonance').fill('12');
  await page.waitForTimeout(450);
  const highResonance = await page.evaluate(() => Math.max(...(window as unknown as { levels: number[] }).levels.slice(-10), 0));
  const updates = await page.evaluate(() => (window as unknown as { updates: Array<{ filterQ: number; cutoff: number }> }).updates);
  expect(updates.at(-1)).toMatchObject({ filterQ: 12, cutoff: 165 });
  expect(highResonance).toBeGreaterThan(lowResonance * 1.1);
});

test('@claim:code-export generated JavaScript contains values and active connections', async ({ page }) => {
  await page.getByRole('button', { name: 'Copy Web Audio code' }).click(); const code = await page.getByLabel('Generated JavaScript').inputValue();
  expect(code).toContain('async function startPatch'); expect(code).toContain('oscillator.connect(filter)'); expect(code).toContain('speaker.connect(context.destination)'); expect(code).toContain('filter.frequency.value = 920'); expect(code).not.toContain('fetch(');
  const result = await page.evaluate(async (source) => { const start = new Function(`${source}; return startPatch;`)() as (context: AudioContext) => Promise<{ context: AudioContext; nodes: { filter: BiquadFilterNode; delay: DelayNode } }>; const built = await start(new AudioContext()); const values = { cutoff: built.nodes.filter.frequency.value, delay: built.nodes.delay.delayTime.value }; await built.context.close(); return values; }, code);
  expect(result.cutoff).toBe(920); expect(result.delay).toBeCloseTo(0.24, 4);
});

test('@claim:free-use editor opens without account or payment gate', async ({ page }) => {
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('Free.', { exact: true })).toBeVisible(); await expect(page.getByRole('button', { name: 'Start audio' })).toBeEnabled(); await expect(page.locator('input[type=password], [href*="checkout"], [href*="login"]')).toHaveCount(0);
});

test('@claim:scope-limits has no upload, microphone, track, account, or cloud controls', async ({ page }) => {
  await expect(page.locator('input[type=file], audio, video')).toHaveCount(0); await expect(page.getByText('Patchboard needs no account, upload, sample library, or microphone.')).toBeVisible(); expect(await page.evaluate(() => document.body.innerText.includes('Sign in'))).toBe(false);
});
