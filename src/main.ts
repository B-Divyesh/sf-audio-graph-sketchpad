import './style.css';
import { AudioEngine } from './audio';
import { generateWebAudioCode } from './code';
import { NODE_DEFINITIONS, connectionError, decodeSession, encodeSession, isValidSession, makeDefaultSession, makeDemoSession, SHARE_SESSION_ERROR } from './patch';
import type { NodeId, Patch, Session } from './types';

const STORAGE_KEY = 'patchboard.session.v1';
const BUILD_ID = 'polish-2';
const SITE_URL = 'https://audio-graph-sketchpad.sociobot.in';
const app = document.querySelector<HTMLDivElement>('#app')!;
let cleanupRoute = (): void => undefined;

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Patchboard — hear a Web Audio graph', description: 'Connect six browser audio modules, hear the graph, compare two variants, and copy working Web Audio code.' },
  '/demo': { title: 'Demo — Patchboard', description: 'Try a ready-to-hear Patchboard graph with isolated sample data that is not saved.' },
  '/privacy': { title: 'Privacy — Patchboard', description: 'Learn what Patchboard stores in your browser and how to remove it.' },
  '/terms': { title: 'Terms — Patchboard', description: 'Read the terms for using the free Patchboard Web Audio sketchpad.' },
  '/404': { title: 'Page not found — Patchboard', description: 'This Patchboard page does not exist. Return to the audio graph sketchpad.' },
};

function normalizedPath(): string {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '/404.html' ? '/404' : path;
}

function isDemoRoute(): boolean {
  return normalizedPath() === '/demo' || new URLSearchParams(window.location.search).get('demo') === '1';
}

function setMeta(route: string): void {
  const key = routeMeta[route] ? route : '/404';
  const meta = routeMeta[key];
  const canonicalPath = key === '/404' ? '/404.html' : key;
  const canonical = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = meta.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelectorAll<HTMLMetaElement>('meta[property="og:title"], meta[name="twitter:title"]').forEach((element) => { element.content = meta.title; });
  document.querySelectorAll<HTMLMetaElement>('meta[property="og:description"], meta[name="twitter:description"]').forEach((element) => { element.content = meta.description; });
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = canonical;
}

function siteHeader(): string {
  return `<header class="site-header"><a class="wordmark" href="/" data-route aria-label="Patchboard home"><span aria-hidden="true">▦</span> Patchboard</a><nav class="site-nav" aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a></nav></header>`;
}

function siteFooter(): string {
  return `<footer class="site-footer"><p>Build and hear small Web Audio graphs in your browser.</p><nav class="footer-links" aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" rel="noreferrer">Web Audio reference (external)</a></nav><p>Built by Param Factory · ${BUILD_ID}</p></footer>`;
}

function renderLegal(route: '/privacy' | '/terms'): void {
  const privacy = route === '/privacy';
  app.innerHTML = `${siteHeader()}<main id="main" class="legal-page" tabindex="-1"><p class="brand-kicker">Patchboard / ${privacy ? 'privacy' : 'terms'}</p><h1>${privacy ? 'Patchboard privacy' : 'Patchboard terms'}</h1>${privacy ? `
    <h2>What this browser stores</h2><p>Normal mode stores your A/B patch, motion preference, and edit count in local storage.</p><p>Demo mode uses memory only. It never reads or changes your normal patch.</p>
    <h2>What leaves this browser</h2><p>Patchboard sends no patch, audio, identifier, analytics event, cookie, microphone input, or personal data.</p><p>A share link keeps patch data after the # character. Browsers do not include that fragment in a server request.</p>
      <h2>Remove your data</h2><p>Select “Start new patch” or clear this site’s storage.</p>` : `
    <h2>Using Patchboard</h2><p>Patchboard is a free educational tool provided “as is.” Use it to learn, sketch, and share synthesized audio graphs.</p>
    <h2>Your patches</h2><p>You keep all rights to patch settings you create. Anyone with your share link can read its embedded patch.</p>
    <h2>Limits</h2><p>Browser audio behavior varies by device. Patchboard offers no warranty for uninterrupted use or a live performance.</p>`}<p>Effective 28 August 2026.</p><a class="back" href="/" data-route>← Return to Patchboard</a></main>${siteFooter()}`;
}

function renderNotFound(): void {
  app.innerHTML = `${siteHeader()}<main id="main" class="not-found" tabindex="-1"><p class="brand-kicker">PATCH LOST / 404</p><h1>Page not found.</h1><p>The address does not match a Patchboard page.</p><a class="button-link primary" href="/" data-route>Return to Patchboard</a></main>${siteFooter()}`;
}

function renderRoute(options: { moveFocus?: boolean; scrollPosition?: number } = {}): void {
  cleanupRoute();
  cleanupRoute = (): void => undefined;
  const route = normalizedPath();
  const effectiveRoute = isDemoRoute() ? '/demo' : route;
  setMeta(effectiveRoute);
  if (effectiveRoute === '/privacy' || effectiveRoute === '/terms') renderLegal(effectiveRoute);
  else if (effectiveRoute === '/' || effectiveRoute === '/demo') cleanupRoute = startApp(effectiveRoute === '/demo');
  else renderNotFound();
  if (options.moveFocus) {
    window.scrollTo({ top: options.scrollPosition ?? 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLHeadingElement>('h1');
      heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
      const announcer = document.getElementById('route-announcer');
      if (announcer && heading) announcer.textContent = `${heading.textContent} page loaded.`;
    });
  }
}

function saveScrollPosition(): void {
  const state = history.state && typeof history.state === 'object' ? history.state : {};
  history.replaceState({ ...state, scrollY: window.scrollY }, '', window.location.href);
}

function navigate(url: URL): void {
  saveScrollPosition();
  history.pushState({ scrollY: 0 }, '', `${url.pathname}${url.search}${url.hash}`);
  renderRoute({ moveFocus: true, scrollPosition: 0 });
}
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href); if (url.origin !== window.location.origin) return;
  event.preventDefault(); navigate(url);
});
window.addEventListener('popstate', () => {
  const state = history.state && typeof history.state === 'object' ? history.state as { scrollY?: number } : {};
  renderRoute({ moveFocus: true, scrollPosition: state.scrollY ?? 0 });
});

function startApp(demoMode: boolean): () => void {
  let loadMessage = '';
  let loadKind: 'success' | 'error' | '' = '';
  let session: Session = demoMode ? makeDemoSession() : makeDefaultSession();
  const shared = demoMode ? null : new URLSearchParams(window.location.hash.slice(1)).get('patch');
  if (shared) {
    try { session = decodeSession(shared); loadMessage = `Shared patch “${session.variants[session.active].name}” loaded. Press Start audio to hear it.`; loadKind = 'success'; }
    catch { loadMessage = `${SHARE_SESSION_ERROR} A fresh patch is ready to edit and share.`; loadKind = 'error'; }
  } else if (!demoMode) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const parsed: unknown = JSON.parse(saved); if (isValidSession(parsed)) { session = parsed; loadMessage = `Saved patch “${session.variants[session.active].name}” restored.`; loadKind = 'success'; } }
    } catch { loadMessage = 'Local saving is unavailable. You can still build and share a patch in this tab.'; loadKind = 'error'; }
  }

  const engine = new AudioEngine();
  const aborter = new AbortController();
  const { signal } = aborter;
  let selectedNode: NodeId = 'filter';
  let cableMode = false;
  let cableSource: NodeId | null = null;
  let currentBeat = -1;

  app.innerHTML = `${siteHeader()}${demoMode ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><div><button id="reset-demo" type="button">Reset demo</button><a href="/" data-route>Start for real</a></div></aside>` : ''}
    <div id="network-banner" class="network-banner" role="status">You’re offline. Cached Patchboard tools and patches remain available.</div>
    <main id="main" class="${demoMode ? 'demo-main' : ''}" tabindex="-1">
      ${demoMode ? `<section class="demo-workbench-heading" aria-labelledby="page-heading"><div><p class="brand-kicker">Sample patch / variant ${session.active}</p><h1 id="page-heading">Neon steps sample patch</h1><p class="demo-values">920 Hz cutoff · 240 ms delay · 4 cables</p></div><p class="demo-connections">Oscillator → Filter → Delay → Gain → Speaker</p></section>` : `<section class="first-screen" aria-labelledby="page-heading"><div class="hero-copy"><p class="brand-kicker">Audio and patches stay in this browser</p><h1 id="page-heading">Hear a Web Audio graph before coding it</h1><p class="audience">For creative coders learning how six browser audio modules affect one another.</p><div class="hero-actions"><a class="button-link primary" href="/?demo=1" data-route>Try it with sample data</a><span>Loads a ready-to-hear patch; nothing is saved.</span><a class="button-link secondary" href="#workbench">Build your patch</a></div><ul class="plain-facts" aria-label="Key facts"><li>Free.</li><li>Works offline after your first visit.</li><li>Patches stay in this browser.</li></ul></div><img class="hero-art" src="/art/patch-spirit.webp" width="240" height="160" alt="Six connected modules show the kind of audio graph you can build." fetchpriority="high" decoding="async" /></section>
      <section class="intro-strip" aria-labelledby="intro-heading"><div class="intro-copy"><p class="eyebrow">Build and hear a six-module graph</p><h2 id="intro-heading">Connect modules, start audio, then compare one change</h2><p>Patchboard makes sound in this browser. It uses no samples or microphone. A share link can carry both A/B variants.</p></div></section>`}
      <section id="workbench" class="workbench" aria-label="Patchboard workbench">${demoMode ? '' : '<div class="workbench-actions" aria-label="Patch actions"><button id="save-button" type="button">Save in this browser</button><button id="share-button" type="button">Share patch</button><button id="code-button" type="button">Copy Web Audio code</button><button id="new-button" class="danger" type="button">Start new patch</button></div>'}
        <section class="transport" aria-label="Audio transport"><div class="transport-actions"><button id="transport-button" class="primary" type="button" aria-pressed="false">▶ Start audio</button></div><div class="tempo-control"><label for="bpm-range">Tempo</label><input id="bpm-range" type="range" min="40" max="240" step="1" /><input id="bpm-number" class="number-field" type="number" min="40" max="240" step="1" aria-label="Tempo in beats per minute" /></div><div class="beat-display" aria-label="16-step beat position"><span class="beat-label">16-step beat position / <span id="beat-readout">Starts with audio</span></span><div id="beat-grid" class="beat-grid" aria-hidden="true"></div></div></section>
        <div class="session-strip"><div class="patch-name-wrap"><label for="patch-name">Patch</label><input id="patch-name" class="text-field" type="text" maxlength="48" autocomplete="off" /></div><div class="variant-controls" aria-label="A and B comparison"><span class="shortcut">Hear variant</span><button id="variant-a" type="button">Hear A</button><button id="variant-b" type="button">Hear B</button><button id="copy-variant" type="button">Copy A → B</button></div></div><p id="status-line" class="status-line" role="status" aria-live="polite"></p>
        <div class="workspace"><section class="graph-panel" aria-labelledby="graph-heading"><div class="panel-header"><div><h2 id="graph-heading">Signal graph</h2><p id="route-help">Select a module to inspect it.</p></div><div class="panel-actions"><button id="cable-mode" type="button" aria-pressed="false">Edit cables</button><label class="calm-control"><input id="calm-motion" type="checkbox" /> Reduce motion</label></div></div><figure id="graph-stage" class="graph-stage" aria-describedby="graph-summary"><svg id="cables" class="cables" aria-hidden="true"></svg><div id="module-layer"></div><div id="graph-empty" class="graph-empty" hidden>No cables yet. Choose “Edit cables,” then pick a source and destination.</div><figcaption id="graph-summary" class="sr-only"></figcaption></figure><div class="connection-area"><h3>Connected cables <span id="connection-count"></span></h3><ul id="connection-list" class="connection-list"></ul></div></section><aside id="inspector" class="inspector" aria-labelledby="inspector-title"></aside></div>${demoMode ? '<div class="workbench-actions demo-actions" aria-label="Patch actions"><button id="share-button" type="button">Share patch</button><button id="code-button" type="button">Copy Web Audio code</button></div>' : ''}
      </section>
      <section class="learn-strip" aria-labelledby="how-heading"><h2 id="how-heading" class="sr-only">How to use Patchboard</h2><div class="learn-step"><strong>01 / Connect modules</strong><p>Choose Edit cables, then select a source and destination. Patchboard blocks feedback loops.</p></div><div class="learn-step"><strong>02 / Follow the beat position</strong><p>Start audio. The 16-step beat position follows the same audio clock as each sound.</p></div><div class="learn-step"><strong>03 / Compare variants</strong><p>Copy A to B. Change one value or cable, then switch variants while sound runs.</p></div></section>
      <section class="privacy-limits" aria-labelledby="limits-heading"><h2 id="limits-heading">Privacy and limits</h2><p>Patchboard needs no account, upload, sample library, or microphone. It has no tracks or cloud projects.</p><p>Normal patches stay in this browser. Demo changes disappear when you leave.</p></section>
    </main>${siteFooter()}
    <dialog id="share-dialog" aria-labelledby="share-title"><div class="dialog-body"><h2 id="share-title">Share this audio graph</h2><p>The link contains both A/B variants after the # character. Patchboard uploads nothing.</p><label for="share-url">Share link</label><input id="share-url" class="text-field" type="text" readonly /></div><div class="dialog-actions"><button id="copy-link" class="primary" type="button">Copy share link</button><button id="close-share" type="button">Close share dialog</button></div></dialog>
    <dialog id="code-dialog" aria-labelledby="code-title"><div class="dialog-body"><h2 id="code-title">Web Audio code for variant ${session.active}</h2><p>Paste this function into your project, then call <code>startPatch()</code> from a user action.</p><label for="code-output">Generated JavaScript</label><textarea id="code-output" class="code-output" readonly></textarea></div><div class="dialog-actions"><button id="copy-code" class="primary" type="button">Copy JavaScript</button><button id="close-code" type="button">Close code dialog</button></div></dialog>`;

  const byId = <T extends Element>(id: string): T => document.getElementById(id) as unknown as T;
  const statusLine = byId<HTMLParagraphElement>('status-line');
  const stage = byId<HTMLElement>('graph-stage');
  const cableSvg = byId<SVGSVGElement>('cables');
  const moduleLayer = byId<HTMLDivElement>('module-layer');
  const inspector = byId<HTMLElement>('inspector');
  const bpmRange = byId<HTMLInputElement>('bpm-range');
  const bpmNumber = byId<HTMLInputElement>('bpm-number');
  const nameInput = byId<HTMLInputElement>('patch-name');
  const transportButton = byId<HTMLButtonElement>('transport-button');
  const cableButton = byId<HTMLButtonElement>('cable-mode');
  const routeHelp = byId<HTMLParagraphElement>('route-help');
  const shareDialog = byId<HTMLDialogElement>('share-dialog');
  const codeDialog = byId<HTMLDialogElement>('code-dialog');
  const shareUrl = byId<HTMLInputElement>('share-url');
  const codeOutput = byId<HTMLTextAreaElement>('code-output');
  const patch = (): Patch => session.variants[session.active];

  function setStatus(message: string, kind: 'success' | 'error' | '' = ''): void { statusLine.textContent = message; statusLine.className = `status-line ${kind}`.trim(); }
  function persist(announce = false): void {
    if (demoMode) { if (announce) setStatus('Demo changes stay in this tab only.', 'success'); return; }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); if (announce) setStatus(`“${patch().name}” saved in this browser.`, 'success'); }
    catch { setStatus('This browser blocked local saving. Use Share patch to keep a link.', 'error'); }
  }
  function syncSessionUi(): void {
    const current = patch(); bpmRange.value = String(current.bpm); bpmNumber.value = String(current.bpm); nameInput.value = current.name;
    byId<HTMLButtonElement>('variant-a').setAttribute('aria-pressed', String(session.active === 'A')); byId<HTMLButtonElement>('variant-b').setAttribute('aria-pressed', String(session.active === 'B'));
    byId<HTMLButtonElement>('copy-variant').textContent = session.active === 'A' ? 'Copy A → B' : 'Copy B → A'; byId<HTMLInputElement>('calm-motion').checked = session.calmMotion; document.body.classList.toggle('calm', session.calmMotion);
  }
  function renderModules(): void {
    moduleLayer.replaceChildren(...NODE_DEFINITIONS.map((definition) => { const button = document.createElement('button'); button.type = 'button'; button.className = `module module--${definition.id}`; button.dataset.id = definition.id; button.setAttribute('aria-label', `${definition.name} ${definition.kind}`); button.innerHTML = `<span class="module-glyph" aria-hidden="true">${definition.glyph}</span><span class="module-copy"><span class="module-name">${definition.name}</span><span class="module-kind">${definition.kind}</span></span>`; button.addEventListener('click', () => handleModule(definition.id), { signal }); return button; })); syncModuleClasses();
  }
  function syncModuleClasses(): void { moduleLayer.querySelectorAll<HTMLButtonElement>('.module').forEach((button) => { button.classList.toggle('selected', button.dataset.id === selectedNode && !cableMode); button.classList.toggle('source-pending', button.dataset.id === cableSource); button.setAttribute('aria-pressed', String(button.dataset.id === cableSource || (!cableMode && button.dataset.id === selectedNode))); }); }
  function nodeName(id: NodeId): string { return NODE_DEFINITIONS.find((node) => node.id === id)!.name; }
  function handleModule(id: NodeId): void {
    if (!cableMode) { selectedNode = id; renderInspector(); syncModuleClasses(); setStatus(`${nodeName(id)} selected. Change a value to hear it immediately.`); return; }
    if (!cableSource) { const definition = NODE_DEFINITIONS.find((node) => node.id === id)!; if (!definition.sendsOutput) { setStatus('Speaker is the final output. Choose a module that can send a signal.', 'error'); return; } cableSource = id; routeHelp.textContent = `${definition.name} selected. Now choose a destination.`; syncModuleClasses(); setStatus(`${definition.name} is the cable source. Choose a destination.`); return; }
    const error = connectionError(patch(), cableSource, id); if (error) { setStatus(error, 'error'); if (id === cableSource) { cableSource = null; routeHelp.textContent = 'Choose the module that sends the signal.'; syncModuleClasses(); } return; }
    const from = cableSource; patch().connections.push({ from, to: id }); session.edits += 1; cableSource = null; engine.reconnect(patch()); persist(); renderGraph(); routeHelp.textContent = 'Cable added. Choose another source, or finish editing.'; setStatus(`Cable ${nodeName(from)} → ${nodeName(id)} connected.`, 'success');
  }
  function renderGraph(): void {
    const current = patch(); const list = byId<HTMLUListElement>('connection-list');
    list.replaceChildren(...current.connections.map((edge, index) => { const item = document.createElement('li'); item.className = 'connection-chip'; const name = document.createElement('span'); name.textContent = `${nodeName(edge.from)} → ${nodeName(edge.to)}`; const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove cable from ${nodeName(edge.from)} to ${nodeName(edge.to)}`); remove.addEventListener('click', () => { current.connections.splice(index, 1); session.edits += 1; engine.reconnect(current); persist(); renderGraph(); setStatus(`Cable ${nodeName(edge.from)} → ${nodeName(edge.to)} removed. Reconnect it to undo.`, 'success'); }, { signal }); item.append(name, remove); return item; }));
    byId<HTMLElement>('graph-empty').hidden = current.connections.length !== 0; byId<HTMLElement>('connection-count').textContent = `(${current.connections.length})`; byId<HTMLElement>('graph-summary').textContent = current.connections.length ? `Current graph: ${current.connections.map((edge) => `${nodeName(edge.from)} to ${nodeName(edge.to)}`).join('; ')}.` : 'The graph has no connected cables.'; requestAnimationFrame(drawCables); syncModuleClasses();
  }
  function drawCables(): void {
    const bounds = stage.getBoundingClientRect(); cableSvg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    cableSvg.replaceChildren(...patch().connections.flatMap((edge) => { const from = moduleLayer.querySelector<HTMLElement>(`[data-id="${edge.from}"]`)!.getBoundingClientRect(); const to = moduleLayer.querySelector<HTMLElement>(`[data-id="${edge.to}"]`)!.getBoundingClientRect(); const x1 = from.right - bounds.left; const y1 = from.top + from.height / 2 - bounds.top; const x2 = to.left - bounds.left; const y2 = to.top + to.height / 2 - bounds.top; const reach = Math.max(34, Math.abs(x2 - x1) * 0.46); const d = `M ${x1} ${y1} C ${x1 + reach} ${y1}, ${x2 - reach} ${y2}, ${x2} ${y2}`; return ['cable-shadow', 'cable'].map((className) => { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); path.setAttribute('class', className); return path; }); }));
  }
  function renderInspector(): void {
    const definition = NODE_DEFINITIONS.find((node) => node.id === selectedNode)!; inspector.innerHTML = `<div class="inspector-head"><span class="module-kind">${definition.kind} module</span><h2 id="inspector-title">${definition.name}</h2></div><div id="inspector-body" class="inspector-body"></div>`;
    const body = byId<HTMLDivElement>('inspector-body'); const group = document.createElement('fieldset'); group.className = 'control-group'; const legend = document.createElement('legend'); legend.textContent = 'Live parameters'; group.append(legend); const current = patch(); const commit = (): void => { engine.update(current); persist(); setStatus(`${definition.name} updated in variant ${session.active}.`, 'success'); };
    if (selectedNode === 'osc') { group.append(makeSelect('Wave shape', current.params.osc.wave, ['sine', 'triangle', 'sawtooth', 'square'], (value) => { current.params.osc.wave = value as OscillatorType; commit(); })); group.append(makeRange('Frequency', current.params.osc.frequency, 55, 880, 0.01, (value) => `${value.toFixed(2)} Hz`, (value) => { current.params.osc.frequency = value; commit(); })); }
    else if (selectedNode === 'noise') group.append(makeRange('Noise level', current.params.noise.level, 0, 0.5, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => { current.params.noise.level = value; commit(); }));
    else if (selectedNode === 'filter') { group.append(makeRange('Cutoff', current.params.filter.cutoff, 80, 12000, 1, (value) => `${Math.round(value)} Hz`, (value) => { current.params.filter.cutoff = value; commit(); })); group.append(makeRange('Resonance', current.params.filter.resonance, 0.1, 18, 0.1, (value) => `${value.toFixed(1)} Q`, (value) => { current.params.filter.resonance = value; commit(); })); }
    else if (selectedNode === 'delay') { group.append(makeRange('Delay time', current.params.delay.time, 0, 0.8, 0.01, (value) => `${Math.round(value * 1000)} ms`, (value) => { current.params.delay.time = value; commit(); })); group.append(makeRange('Feedback', current.params.delay.feedback, 0, 0.72, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => { current.params.delay.feedback = value; commit(); })); }
    else if (selectedNode === 'gain') group.append(makeRange('Signal gain', current.params.gain.gain, 0, 1, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => { current.params.gain.gain = value; commit(); }));
    else group.append(makeRange('Master volume', current.params.speaker.volume, 0, 1, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => { current.params.speaker.volume = value; commit(); }));
    const note = document.createElement('p'); note.className = 'inspector-note'; note.textContent = inspectorNote(selectedNode); body.append(group, note);
  }
  function makeRange(labelText: string, initial: number, min: number, max: number, step: number, format: (value: number) => string, onInput: (value: number) => void): HTMLElement {
    const wrap = document.createElement('div'); wrap.className = 'control-row'; const id = `control-${selectedNode}-${labelText.toLowerCase().replace(/\s/g, '-')}`; const label = document.createElement('label'); label.htmlFor = id; label.textContent = labelText; const output = document.createElement('output'); output.htmlFor = id; output.textContent = format(initial); const input = document.createElement('input'); input.id = id; input.type = 'range'; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(initial); input.addEventListener('input', () => { const value = Number(input.value); output.textContent = format(value); onInput(value); }, { signal }); wrap.append(label, output, input); return wrap;
  }
  function makeSelect(labelText: string, initial: string, values: string[], onChange: (value: string) => void): HTMLElement {
    const wrap = document.createElement('div'); wrap.className = 'control-row'; const id = `control-${selectedNode}-wave`; const label = document.createElement('label'); label.htmlFor = id; label.textContent = labelText; const select = document.createElement('select'); select.id = id; select.className = 'wide-control'; values.forEach((value) => { const option = document.createElement('option'); option.value = value; option.textContent = value[0].toUpperCase() + value.slice(1); option.selected = value === initial; select.append(option); }); select.addEventListener('change', () => onChange(select.value), { signal }); wrap.append(label, select); return wrap;
  }
  function inspectorNote(id: NodeId): string {
    return { osc: 'This browser oscillator sets the pitched signal.', noise: 'Patchboard generates white noise in this browser. Lower its level before mixing it with the oscillator.', filter: 'This browser low-pass filter removes sound above the cutoff. Resonance emphasizes sound near the cutoff.', delay: 'Set the repeat time and feedback amount here.', gain: 'Set the level for signals that pass through this module.', speaker: 'Set the final output level here.' }[id];
  }
  function renderBeat(): void { Array.from(byId<HTMLDivElement>('beat-grid').children).forEach((dot, index) => dot.classList.toggle('active', index === currentBeat)); byId<HTMLElement>('beat-readout').textContent = currentBeat < 0 ? 'Starts with audio' : `step ${currentBeat + 1} / 16`; }
  function changeBpm(raw: string): void { const value = Math.max(40, Math.min(240, Math.round(Number(raw) || patch().bpm))); patch().bpm = value; bpmRange.value = String(value); bpmNumber.value = String(value); engine.update(patch()); persist(); setStatus(`Tempo set to ${value} BPM in variant ${session.active}.`, 'success'); }
  async function toggleTransport(): Promise<void> {
    transportButton.disabled = true;
    try { if (engine.running) { await engine.stop(); currentBeat = -1; transportButton.textContent = '▶ Start audio'; transportButton.setAttribute('aria-pressed', 'false'); cableSvg.classList.remove('running'); renderBeat(); setStatus('Audio stopped. Your patch is still here.', 'success'); } else { await engine.start(patch(), (beat) => { currentBeat = beat; renderBeat(); }); transportButton.textContent = '■ Stop audio'; transportButton.setAttribute('aria-pressed', 'true'); cableSvg.classList.add('running'); setStatus(`Audio running at ${patch().bpm} BPM. Change one value or switch variants to compare.`, 'success'); } }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Audio could not start. Check this tab’s sound permission.', 'error'); } finally { transportButton.disabled = false; }
  }
  function switchVariant(next: 'A' | 'B'): void { if (session.active === next) return; session.active = next; engine.update(patch()); engine.reconnect(patch()); syncSessionUi(); renderGraph(); renderInspector(); persist(); setStatus(`Variant ${next} is live. ${patch().connections.length} cables at ${patch().bpm} BPM.`, 'success'); }
  function openShare(): void { persist(); const url = new URL('/', window.location.origin); url.hash = `patch=${encodeSession(session)}`; shareUrl.value = url.toString(); shareDialog.showModal(); shareUrl.focus(); shareUrl.select(); }
  function openCode(): void { codeOutput.value = generateWebAudioCode(patch()); byId<HTMLElement>('code-title').textContent = `Web Audio code for variant ${session.active}`; codeDialog.showModal(); codeOutput.focus(); codeOutput.select(); }

  renderModules(); for (let index = 0; index < 16; index += 1) { const dot = document.createElement('span'); dot.className = `beat-dot${index % 4 === 0 ? ' bar' : ''}`; byId<HTMLDivElement>('beat-grid').append(dot); }
  syncSessionUi(); renderGraph(); renderInspector(); renderBeat(); if (loadMessage) setStatus(loadMessage, loadKind); else setStatus(demoMode ? 'Sample ready. Press Start audio, then switch between Hear A and Hear B.' : 'Audio is off. Press Start audio when you are ready.');
  transportButton.addEventListener('click', toggleTransport, { signal }); bpmRange.addEventListener('input', () => changeBpm(bpmRange.value), { signal }); bpmNumber.addEventListener('change', () => changeBpm(bpmNumber.value), { signal }); nameInput.addEventListener('input', () => { patch().name = nameInput.value.trimStart() || 'Untitled patch'; persist(); }, { signal });
  byId<HTMLButtonElement>('save-button')?.addEventListener('click', () => persist(true), { signal }); byId<HTMLButtonElement>('share-button').addEventListener('click', openShare, { signal }); byId<HTMLButtonElement>('code-button').addEventListener('click', openCode, { signal });
  byId<HTMLButtonElement>('new-button')?.addEventListener('click', () => { if (!window.confirm('Start a new patch? This replaces the saved A and B variants. Shared links you copied will still work.')) return; void engine.stop(); session = makeDefaultSession(); selectedNode = 'filter'; cableMode = false; cableSource = null; currentBeat = -1; transportButton.textContent = '▶ Start audio'; transportButton.setAttribute('aria-pressed', 'false'); cableSvg.classList.remove('running'); syncSessionUi(); renderGraph(); renderInspector(); renderBeat(); persist(); setStatus('New default patch ready.', 'success'); }, { signal });
  byId<HTMLButtonElement>('reset-demo')?.addEventListener('click', () => { void engine.stop(); session = makeDemoSession(); selectedNode = 'filter'; cableMode = false; cableSource = null; currentBeat = -1; transportButton.textContent = '▶ Start audio'; transportButton.setAttribute('aria-pressed', 'false'); cableSvg.classList.remove('running'); syncSessionUi(); renderGraph(); renderInspector(); renderBeat(); setStatus('Demo reset to the original sample.', 'success'); }, { signal });
  cableButton.addEventListener('click', () => { cableMode = !cableMode; cableSource = null; cableButton.setAttribute('aria-pressed', String(cableMode)); cableButton.textContent = cableMode ? 'Finish cables' : 'Edit cables'; routeHelp.textContent = cableMode ? 'Choose the module that sends the signal.' : 'Select a module to inspect it.'; syncModuleClasses(); setStatus(cableMode ? 'Cable editing on. Choose a source module, then a destination.' : 'Cable editing finished.', 'success'); }, { signal });
  byId<HTMLInputElement>('calm-motion').addEventListener('change', (event) => { session.calmMotion = (event.currentTarget as HTMLInputElement).checked; document.body.classList.toggle('calm', session.calmMotion); persist(); setStatus(session.calmMotion ? 'Reduced motion on. Signal movement is static.' : 'Reduced motion off. Live cables move while audio runs.', 'success'); }, { signal });
  byId<HTMLButtonElement>('variant-a').addEventListener('click', () => switchVariant('A'), { signal }); byId<HTMLButtonElement>('variant-b').addEventListener('click', () => switchVariant('B'), { signal }); byId<HTMLButtonElement>('copy-variant').addEventListener('click', () => { const target = session.active === 'A' ? 'B' : 'A'; session.variants[target] = structuredClone(patch()); persist(); setStatus(`Variant ${session.active} copied to ${target}. Switch to ${target}, then change one thing.`, 'success'); }, { signal });
  byId<HTMLButtonElement>('copy-link').addEventListener('click', async () => { try { await navigator.clipboard.writeText(shareUrl.value); setStatus('Share link copied.', 'success'); shareDialog.close(); } catch { shareUrl.focus(); shareUrl.select(); setStatus('Clipboard access was blocked. The link is selected for keyboard copying.', 'error'); } }, { signal });
  byId<HTMLButtonElement>('copy-code').addEventListener('click', async () => { try { await navigator.clipboard.writeText(codeOutput.value); setStatus('Web Audio code copied.', 'success'); codeDialog.close(); } catch { codeOutput.focus(); codeOutput.select(); setStatus('Clipboard access was blocked. The code is selected for keyboard copying.', 'error'); } }, { signal });
  byId<HTMLButtonElement>('close-share').addEventListener('click', () => shareDialog.close(), { signal }); byId<HTMLButtonElement>('close-code').addEventListener('click', () => codeDialog.close(), { signal }); [shareDialog, codeDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }, { signal }));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && cableMode && !shareDialog.open && !codeDialog.open) { cableSource = null; cableMode = false; cableButton.setAttribute('aria-pressed', 'false'); cableButton.textContent = 'Edit cables'; routeHelp.textContent = 'Select a module to inspect it.'; syncModuleClasses(); setStatus('Cable editing cancelled.'); } }, { signal });
  const updateNetwork = (): void => { byId<HTMLElement>('network-banner').classList.toggle('visible', !navigator.onLine); }; window.addEventListener('online', updateNetwork, { signal }); window.addEventListener('offline', updateNetwork, { signal }); updateNetwork(); const resizeObserver = new ResizeObserver(drawCables); resizeObserver.observe(stage);
  if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => setStatus('Offline setup did not finish. The editor still works online.', 'error')); }, { once: true, signal });
  return () => { aborter.abort(); resizeObserver.disconnect(); void engine.stop(); document.body.classList.remove('calm'); };
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
saveScrollPosition();
renderRoute();
document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.getElementById('main');
  main?.focus();
  main?.scrollIntoView();
});
