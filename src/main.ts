import './style.css';
import { AudioEngine } from './audio';
import {
  NODE_DEFINITIONS,
  connectionError,
  decodeSession,
  encodeSession,
  isValidSession,
  makeDefaultSession,
  SHARE_SESSION_ERROR,
} from './patch';
import type { NodeId, Patch, Session } from './types';

const STORAGE_KEY = 'patchboard.session.v1';
const POSITIONS: Record<NodeId, { x: number; y: number }> = {
  osc: { x: 10, y: 20 },
  noise: { x: 10, y: 78 },
  filter: { x: 36, y: 20 },
  delay: { x: 36, y: 78 },
  gain: { x: 63, y: 49 },
  speaker: { x: 85, y: 49 },
};

const MOBILE_POSITIONS: Record<NodeId, { x: number; y: number }> = {
  osc: { x: 18, y: 15 },
  filter: { x: 72, y: 15 },
  gain: { x: 18, y: 50 },
  delay: { x: 72, y: 50 },
  noise: { x: 18, y: 84 },
  speaker: { x: 72, y: 84 },
};

const app = document.querySelector<HTMLDivElement>('#app')!;
const legalPath = window.location.pathname.replace(/\/$/, '');

if (legalPath === '/privacy' || legalPath === '/terms') {
  renderLegal(legalPath);
} else {
  startApp();
}

function renderLegal(path: string): void {
  const privacy = path === '/privacy';
  document.title = `${privacy ? 'Privacy' : 'Terms'} — Patchboard`;
  app.innerHTML = `
    <main id="main" class="legal-page" tabindex="-1">
      <p class="brand-kicker">Patchboard / ${privacy ? 'privacy' : 'terms'}</p>
      <h1>${privacy ? 'Your patches stay yours.' : 'Terms, in plain language.'}</h1>
      ${privacy ? `
        <h2>What is stored</h2>
        <p>Patchboard stores your current A/B patch, motion preference, and edit count in this browser’s local storage. Shared links carry the patch data in the URL fragment after the <code>#</code>. Fragments are not sent to the web server.</p>
        <h2>What leaves your device</h2>
        <p>No patch content, audio, identifiers, analytics, cookies, microphone input, or personal data is collected. The hosting provider may process ordinary request logs for security and reliability.</p>
        <h2>Delete your data</h2>
        <p>Use “New patch” in the app or clear this site’s storage in your browser. Uninstalling the offline app also removes its cached files.</p>
      ` : `
        <h2>Use of the tool</h2>
        <p>Patchboard is a free educational utility provided “as is.” You may use it to learn, sketch, and share synthesized Web Audio graphs. Do not use it to harm devices, people, or services.</p>
        <h2>Your patches</h2>
        <p>You retain all rights to patch settings you create. Shared links reveal their embedded patch to anyone who receives the link.</p>
        <h2>Warranty and changes</h2>
        <p>Browser audio behavior varies by device. There is no warranty of uninterrupted operation or fitness for a particular performance. These terms may be updated when the product materially changes.</p>
      `}
      <p>Effective 28 August 2026.</p>
      <a class="back" href="/">← Return to Patchboard</a>
    </main>`;
}

function startApp(): void {
  let loadMessage = '';
  let loadKind: 'success' | 'error' | '' = '';
  let session = makeDefaultSession();

  const shared = new URLSearchParams(window.location.hash.slice(1)).get('patch');
  if (shared) {
    try {
      session = decodeSession(shared);
      loadMessage = `Shared patch “${session.variants[session.active].name}” loaded. Press Start audio to hear it.`;
      loadKind = 'success';
    } catch {
      loadMessage = `${SHARE_SESSION_ERROR} A fresh patch is ready to edit and share.`;
      loadKind = 'error';
    }
  } else {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isValidSession(parsed)) {
          session = parsed;
          loadMessage = `Local patch “${session.variants[session.active].name}” restored.`;
          loadKind = 'success';
        }
      }
    } catch {
      loadMessage = 'Local saving is unavailable. You can still build and share a patch this session.';
      loadKind = 'error';
    }
  }

  const engine = new AudioEngine();
  let selectedNode: NodeId = 'filter';
  let cableMode = false;
  let cableSource: NodeId | null = null;
  let currentBeat = -1;

  app.innerHTML = `
    <header class="site-header">
      <div>
        <p class="brand-kicker">Native Web Audio / local-first</p>
        <h1>Patchboard</h1>
        <p class="brand-sub">Wire six browser-native modules. Hear what every cable changes before the graph enters your code.</p>
      </div>
      <div class="header-actions" aria-label="Patch actions">
        <button id="save-button" type="button">Save locally</button>
        <button id="share-button" class="primary" type="button">Share patch</button>
        <button id="new-button" class="danger" type="button">New patch</button>
      </div>
    </header>
    <div id="network-banner" class="network-banner" role="status">You’re offline. The synth and saved patches still work.</div>
    <main id="main" tabindex="-1">
      <section class="intro-strip" aria-labelledby="intro-heading">
        <div class="intro-copy">
          <p class="eyebrow">A tiny audible notebook</p>
          <h2 id="intro-heading">Route it. Start it. Change one thing.</h2>
          <p>Every pulse is synthesized here—no samples, uploads, or microphone. The URL can carry both A and B versions.</p>
        </div>
        <img class="intro-art" src="/art/patch-spirit.webp" width="240" height="160" alt="Pixel-art circuit creature made from six connected audio modules" fetchpriority="high" decoding="async" />
      </section>

      <section class="transport" aria-label="Audio transport">
        <div class="transport-actions">
          <button id="transport-button" class="primary" type="button" aria-pressed="false">▶ Start audio</button>
        </div>
        <div class="tempo-control">
          <label for="bpm-range">Tempo</label>
          <input id="bpm-range" type="range" min="40" max="240" step="1" />
          <input id="bpm-number" class="number-field" type="number" min="40" max="240" step="1" aria-label="Tempo in beats per minute" />
        </div>
        <div class="beat-display" aria-label="16-step beat position">
          <span class="beat-label">Audio-clock probe / <span id="beat-readout">waiting</span></span>
          <div id="beat-grid" class="beat-grid" aria-hidden="true"></div>
        </div>
      </section>

      <div class="session-strip">
        <div class="patch-name-wrap">
          <label for="patch-name">Patch</label>
          <input id="patch-name" class="text-field" type="text" maxlength="48" autocomplete="off" />
        </div>
        <div class="variant-controls" aria-label="A and B comparison">
          <span class="shortcut">Hear variant</span>
          <button id="variant-a" type="button">A</button>
          <button id="variant-b" type="button">B</button>
          <button id="copy-variant" type="button">Copy A → B</button>
        </div>
      </div>
      <p id="status-line" class="status-line" role="status" aria-live="polite"></p>

      <div class="workspace">
        <section class="graph-panel" aria-labelledby="graph-heading">
          <div class="panel-header">
            <div>
              <h2 id="graph-heading">Signal graph</h2>
              <p id="route-help">Select a module to inspect it.</p>
            </div>
            <div class="panel-actions">
              <button id="cable-mode" type="button" aria-pressed="false">Edit cables</button>
              <label class="calm-control"><input id="calm-motion" type="checkbox" /> Calm motion</label>
            </div>
          </div>
          <figure id="graph-stage" class="graph-stage" aria-describedby="graph-summary">
            <svg id="cables" class="cables" aria-hidden="true"></svg>
            <div id="module-layer"></div>
            <div id="graph-empty" class="graph-empty" hidden>No cables yet. Choose “Edit cables,” then pick a source and destination.</div>
            <figcaption id="graph-summary" class="sr-only"></figcaption>
          </figure>
          <div class="connection-area">
            <h3>Connected cables <span id="connection-count"></span></h3>
            <ul id="connection-list" class="connection-list"></ul>
          </div>
        </section>
        <aside id="inspector" class="inspector" aria-labelledby="inspector-title"></aside>
      </div>

      <section class="learn-strip" aria-label="How to use Patchboard">
        <div class="learn-step"><strong>01 / Route</strong><p>Edit cables, choose a source, then a destination. Feedback loops are blocked.</p></div>
        <div class="learn-step"><strong>02 / Probe</strong><p>Start audio. The 16-step lamp is scheduled by the same clock as every pulse.</p></div>
        <div class="learn-step"><strong>03 / Compare</strong><p>Copy A to B, change one parameter or cable, then switch A/B while sound runs.</p></div>
      </section>
    </main>
    <footer class="site-footer">
      <p>Sound and patches stay on this device. Original AI-generated pixel artwork.</p>
      <nav class="footer-links" aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" rel="noreferrer">Web Audio reference</a></nav>
    </footer>
    <dialog id="share-dialog" aria-labelledby="share-title">
      <div class="dialog-body">
        <h2 id="share-title">Share this audible graph</h2>
        <p>Both A and B variants are encoded in the URL. Nothing is uploaded.</p>
        <label for="share-url">Share link</label>
        <input id="share-url" class="text-field" type="text" readonly />
      </div>
      <div class="dialog-actions">
        <button id="copy-link" class="primary" type="button">Copy link</button>
        <button id="close-share" type="button">Close</button>
      </div>
    </dialog>`;

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
  const shareUrl = byId<HTMLInputElement>('share-url');

  const patch = (): Patch => session.variants[session.active];

  function setStatus(message: string, kind: 'success' | 'error' | '' = ''): void {
    statusLine.textContent = message;
    statusLine.className = `status-line ${kind}`.trim();
  }

  function persist(announce = false): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      if (announce) setStatus(`“${patch().name}” saved in this browser.`, 'success');
    } catch {
      setStatus('This browser blocked local saving. Use Share patch to keep a link.', 'error');
    }
  }

  function syncSessionUi(): void {
    const current = patch();
    bpmRange.value = String(current.bpm);
    bpmNumber.value = String(current.bpm);
    nameInput.value = current.name;
    byId<HTMLButtonElement>('variant-a').setAttribute('aria-pressed', String(session.active === 'A'));
    byId<HTMLButtonElement>('variant-b').setAttribute('aria-pressed', String(session.active === 'B'));
    byId<HTMLButtonElement>('copy-variant').textContent = session.active === 'A' ? 'Copy A → B' : 'Copy B → A';
    byId<HTMLInputElement>('calm-motion').checked = session.calmMotion;
    document.body.classList.toggle('calm', session.calmMotion);
  }

  function renderModules(): void {
    moduleLayer.replaceChildren(...NODE_DEFINITIONS.map((definition) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'module';
      button.dataset.id = definition.id;
      button.style.setProperty('--x', String(POSITIONS[definition.id].x));
      button.style.setProperty('--y', String(POSITIONS[definition.id].y));
      button.style.setProperty('--mx', String(MOBILE_POSITIONS[definition.id].x));
      button.style.setProperty('--my', String(MOBILE_POSITIONS[definition.id].y));
      button.setAttribute('aria-label', `${definition.name} ${definition.kind}`);
      button.innerHTML = `<span class="module-glyph" aria-hidden="true">${definition.glyph}</span><span class="module-copy"><span class="module-name">${definition.name}</span><span class="module-kind">${definition.kind}</span></span>`;
      button.addEventListener('click', () => handleModule(definition.id));
      return button;
    }));
    syncModuleClasses();
  }

  function syncModuleClasses(): void {
    moduleLayer.querySelectorAll<HTMLButtonElement>('.module').forEach((button) => {
      button.classList.toggle('selected', button.dataset.id === selectedNode && !cableMode);
      button.classList.toggle('source-pending', button.dataset.id === cableSource);
      button.setAttribute('aria-pressed', String(button.dataset.id === cableSource || (!cableMode && button.dataset.id === selectedNode)));
    });
  }

  function handleModule(id: NodeId): void {
    if (!cableMode) {
      selectedNode = id;
      renderInspector();
      syncModuleClasses();
      setStatus(`${NODE_DEFINITIONS.find((node) => node.id === id)!.name} selected. Change a value to hear it immediately.`);
      return;
    }
    if (!cableSource) {
      const definition = NODE_DEFINITIONS.find((node) => node.id === id)!;
      if (!definition.sendsOutput) {
        setStatus('Speaker is the final output. Choose a module that can send a signal.', 'error');
        return;
      }
      cableSource = id;
      routeHelp.textContent = `${definition.name} selected. Now choose a destination.`;
      syncModuleClasses();
      setStatus(`${definition.name} is the cable source. Choose a destination.`);
      return;
    }
    const error = connectionError(patch(), cableSource, id);
    if (error) {
      setStatus(error, 'error');
      if (id === cableSource) {
        cableSource = null;
        routeHelp.textContent = 'Choose the module that sends the signal.';
        syncModuleClasses();
      }
      return;
    }
    const from = cableSource;
    patch().connections.push({ from, to: id });
    session.edits += 1;
    cableSource = null;
    engine.reconnect(patch());
    persist();
    renderGraph();
    routeHelp.textContent = 'Cable added. Choose another source, or finish editing.';
    setStatus(`Cable ${nodeName(from)} → ${nodeName(id)} connected. ${session.edits} cable edits this session.`, 'success');
  }

  function nodeName(id: NodeId): string {
    return NODE_DEFINITIONS.find((node) => node.id === id)!.name;
  }

  function renderGraph(): void {
    const current = patch();
    const list = byId<HTMLUListElement>('connection-list');
    list.replaceChildren(...current.connections.map((edge, index) => {
      const item = document.createElement('li');
      item.className = 'connection-chip';
      const name = document.createElement('span');
      name.textContent = `${nodeName(edge.from)} → ${nodeName(edge.to)}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove cable from ${nodeName(edge.from)} to ${nodeName(edge.to)}`);
      remove.addEventListener('click', () => {
        current.connections.splice(index, 1);
        session.edits += 1;
        engine.reconnect(current);
        persist();
        renderGraph();
        setStatus(`Cable ${nodeName(edge.from)} → ${nodeName(edge.to)} removed. Undo by reconnecting it in Edit cables.`, 'success');
      });
      item.append(name, remove);
      return item;
    }));
    byId<HTMLElement>('graph-empty').hidden = current.connections.length !== 0;
    byId<HTMLElement>('connection-count').textContent = `(${current.connections.length})`;
    byId<HTMLElement>('graph-summary').textContent = current.connections.length
      ? `Current graph: ${current.connections.map((edge) => `${nodeName(edge.from)} to ${nodeName(edge.to)}`).join('; ')}.`
      : 'The graph has no connected cables.';
    requestAnimationFrame(drawCables);
    syncModuleClasses();
  }

  function drawCables(): void {
    const bounds = stage.getBoundingClientRect();
    cableSvg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    cableSvg.replaceChildren(...patch().connections.flatMap((edge) => {
      const from = moduleLayer.querySelector<HTMLElement>(`[data-id="${edge.from}"]`)!.getBoundingClientRect();
      const to = moduleLayer.querySelector<HTMLElement>(`[data-id="${edge.to}"]`)!.getBoundingClientRect();
      const x1 = from.right - bounds.left;
      const y1 = from.top + from.height / 2 - bounds.top;
      const x2 = to.left - bounds.left;
      const y2 = to.top + to.height / 2 - bounds.top;
      const reach = Math.max(34, Math.abs(x2 - x1) * 0.46);
      const d = `M ${x1} ${y1} C ${x1 + reach} ${y1}, ${x2 - reach} ${y2}, ${x2} ${y2}`;
      return ['cable-shadow', 'cable'].map((className) => {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', d);
        pathElement.setAttribute('class', className);
        return pathElement;
      });
    }));
  }

  function renderInspector(): void {
    const definition = NODE_DEFINITIONS.find((node) => node.id === selectedNode)!;
    inspector.innerHTML = `<div class="inspector-head"><span class="module-kind">${definition.kind} module</span><h2 id="inspector-title">${definition.name}</h2></div><div id="inspector-body" class="inspector-body"></div>`;
    const body = byId<HTMLDivElement>('inspector-body');
    const group = document.createElement('fieldset');
    group.className = 'control-group';
    const legend = document.createElement('legend');
    legend.textContent = 'Live parameters';
    group.append(legend);
    const current = patch();

    const commit = (): void => {
      engine.update(current);
      persist();
      setStatus(`${definition.name} updated in variant ${session.active}.`, 'success');
    };

    if (selectedNode === 'osc') {
      group.append(makeSelect('Wave shape', current.params.osc.wave, ['sine', 'triangle', 'sawtooth', 'square'], (value) => {
        current.params.osc.wave = value as OscillatorType; commit();
      }));
      group.append(makeRange('Frequency', current.params.osc.frequency, 55, 880, 0.01, (value) => `${value.toFixed(2)} Hz`, (value) => {
        current.params.osc.frequency = value; commit();
      }));
    } else if (selectedNode === 'noise') {
      group.append(makeRange('Noise level', current.params.noise.level, 0, 0.5, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => {
        current.params.noise.level = value; commit();
      }));
    } else if (selectedNode === 'filter') {
      group.append(makeRange('Cutoff', current.params.filter.cutoff, 80, 12000, 1, (value) => `${Math.round(value)} Hz`, (value) => {
        current.params.filter.cutoff = value; commit();
      }));
      group.append(makeRange('Resonance', current.params.filter.resonance, 0.1, 18, 0.1, (value) => `${value.toFixed(1)} Q`, (value) => {
        current.params.filter.resonance = value; commit();
      }));
    } else if (selectedNode === 'delay') {
      group.append(makeRange('Delay time', current.params.delay.time, 0, 0.8, 0.01, (value) => `${Math.round(value * 1000)} ms`, (value) => {
        current.params.delay.time = value; commit();
      }));
      group.append(makeRange('Feedback', current.params.delay.feedback, 0, 0.72, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => {
        current.params.delay.feedback = value; commit();
      }));
    } else if (selectedNode === 'gain') {
      group.append(makeRange('Signal gain', current.params.gain.gain, 0, 1, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => {
        current.params.gain.gain = value; commit();
      }));
    } else {
      group.append(makeRange('Master volume', current.params.speaker.volume, 0, 1, 0.01, (value) => `${Math.round(value * 100)}%`, (value) => {
        current.params.speaker.volume = value; commit();
      }));
    }
    const note = document.createElement('p');
    note.className = 'inspector-note';
    note.textContent = inspectorNote(selectedNode);
    body.append(group, note);
  }

  function makeRange(labelText: string, initial: number, min: number, max: number, step: number, format: (value: number) => string, onInput: (value: number) => void): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'control-row';
    const id = `control-${selectedNode}-${labelText.toLowerCase().replace(/\s/g, '-')}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const output = document.createElement('output');
    output.htmlFor = id;
    output.textContent = format(initial);
    const input = document.createElement('input');
    input.id = id;
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(initial);
    input.addEventListener('input', () => {
      const value = Number(input.value);
      output.textContent = format(value);
      onInput(value);
    });
    wrap.append(label, output, input);
    return wrap;
  }

  function makeSelect(labelText: string, initial: string, values: string[], onChange: (value: string) => void): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'control-row';
    const id = `control-${selectedNode}-wave`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const select = document.createElement('select');
    select.id = id;
    select.style.gridColumn = '1 / -1';
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value[0].toUpperCase() + value.slice(1);
      option.selected = value === initial;
      select.append(option);
    });
    select.addEventListener('change', () => onChange(select.value));
    wrap.append(label, select);
    return wrap;
  }

  function inspectorNote(id: NodeId): string {
    const notes: Record<NodeId, string> = {
      osc: 'A native OscillatorNode. Its pitch is stable because scheduling uses the audio clock, not animation frames.',
      noise: 'A locally generated white-noise buffer. Keep its level low when combining it with the oscillator.',
      filter: 'A low-pass BiquadFilterNode. Raise resonance to make the cutoff frequency easier to hear.',
      delay: 'A native DelayNode with a bounded feedback path. Patchboard blocks graph-level feedback loops.',
      gain: 'A GainNode for balancing this route. Audio ramps prevent clicks while you move the control.',
      speaker: 'The terminal master GainNode. Its safety ceiling keeps combined routes at a comfortable level.',
    };
    return notes[id];
  }

  function renderBeat(): void {
    const dots = byId<HTMLDivElement>('beat-grid').children;
    Array.from(dots).forEach((dot, index) => dot.classList.toggle('active', index === currentBeat));
    byId<HTMLElement>('beat-readout').textContent = currentBeat < 0 ? 'waiting' : `step ${currentBeat + 1} / 16`;
  }

  function changeBpm(raw: string): void {
    const value = Math.max(40, Math.min(240, Math.round(Number(raw) || patch().bpm)));
    patch().bpm = value;
    bpmRange.value = String(value);
    bpmNumber.value = String(value);
    engine.update(patch());
    persist();
    setStatus(`Tempo set to ${value} BPM in variant ${session.active}.`, 'success');
  }

  async function toggleTransport(): Promise<void> {
    transportButton.disabled = true;
    try {
      if (engine.running) {
        await engine.stop();
        currentBeat = -1;
        transportButton.textContent = '▶ Start audio';
        transportButton.setAttribute('aria-pressed', 'false');
        cableSvg.classList.remove('running');
        renderBeat();
        setStatus('Audio stopped. Your patch is still here.', 'success');
      } else {
        await engine.start(patch(), (beat) => {
          currentBeat = beat;
          renderBeat();
        });
        transportButton.textContent = '■ Stop audio';
        transportButton.setAttribute('aria-pressed', 'true');
        cableSvg.classList.add('running');
        setStatus(`Audio running at ${patch().bpm} BPM. Change a parameter or switch A/B to compare.`, 'success');
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Audio could not start. Check this tab’s sound permission.', 'error');
    } finally {
      transportButton.disabled = false;
    }
  }

  function switchVariant(next: 'A' | 'B'): void {
    if (session.active === next) return;
    session.active = next;
    engine.update(patch());
    engine.reconnect(patch());
    syncSessionUi();
    renderGraph();
    renderInspector();
    persist();
    setStatus(`Variant ${next} is live. ${patch().connections.length} cables, ${patch().bpm} BPM.`, 'success');
  }

  function openShare(): void {
    persist();
    const encoded = encodeSession(session);
    const url = new URL('/', window.location.origin);
    url.hash = `patch=${encoded}`;
    shareUrl.value = url.toString();
    shareDialog.showModal();
    shareUrl.focus();
    shareUrl.select();
  }

  renderModules();
  for (let index = 0; index < 16; index += 1) {
    const dot = document.createElement('span');
    dot.className = `beat-dot${index % 4 === 0 ? ' bar' : ''}`;
    byId<HTMLDivElement>('beat-grid').append(dot);
  }
  syncSessionUi();
  renderGraph();
  renderInspector();
  renderBeat();
  if (loadMessage) setStatus(loadMessage, loadKind);
  else setStatus('Ready. Audio starts only when you press Start audio.');

  transportButton.addEventListener('click', toggleTransport);
  bpmRange.addEventListener('input', () => changeBpm(bpmRange.value));
  bpmNumber.addEventListener('change', () => changeBpm(bpmNumber.value));
  nameInput.addEventListener('input', () => {
    patch().name = nameInput.value.trimStart() || 'Untitled patch';
    persist();
  });
  byId<HTMLButtonElement>('save-button').addEventListener('click', () => persist(true));
  byId<HTMLButtonElement>('share-button').addEventListener('click', openShare);
  byId<HTMLButtonElement>('new-button').addEventListener('click', () => {
    if (!window.confirm('Start a new patch? This replaces the locally saved A and B variants. Shared links you already copied still work.')) return;
    void engine.stop();
    session = makeDefaultSession();
    selectedNode = 'filter';
    cableMode = false;
    cableSource = null;
    currentBeat = -1;
    transportButton.textContent = '▶ Start audio';
    transportButton.setAttribute('aria-pressed', 'false');
    cableSvg.classList.remove('running');
    syncSessionUi(); renderGraph(); renderInspector(); renderBeat(); persist();
    setStatus('New default patch ready.', 'success');
  });
  cableButton.addEventListener('click', () => {
    cableMode = !cableMode;
    cableSource = null;
    cableButton.setAttribute('aria-pressed', String(cableMode));
    cableButton.textContent = cableMode ? 'Finish cables' : 'Edit cables';
    routeHelp.textContent = cableMode ? 'Choose the module that sends the signal.' : 'Select a module to inspect it.';
    syncModuleClasses();
    setStatus(cableMode ? 'Cable editing on. Choose a source module, then a destination.' : 'Cable editing finished.', 'success');
  });
  byId<HTMLInputElement>('calm-motion').addEventListener('change', (event) => {
    session.calmMotion = (event.currentTarget as HTMLInputElement).checked;
    document.body.classList.toggle('calm', session.calmMotion);
    persist();
    setStatus(session.calmMotion ? 'Calm motion on. Signal movement is now static.' : 'Calm motion off. Live cables move while audio runs.', 'success');
  });
  byId<HTMLButtonElement>('variant-a').addEventListener('click', () => switchVariant('A'));
  byId<HTMLButtonElement>('variant-b').addEventListener('click', () => switchVariant('B'));
  byId<HTMLButtonElement>('copy-variant').addEventListener('click', () => {
    const target = session.active === 'A' ? 'B' : 'A';
    session.variants[target] = structuredClone(patch());
    persist();
    setStatus(`Variant ${session.active} copied to ${target}. Switch to ${target}, then change one thing.`, 'success');
  });
  byId<HTMLButtonElement>('copy-link').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareUrl.value);
      setStatus('Share link copied to your clipboard.', 'success');
      shareDialog.close();
    } catch {
      shareUrl.focus(); shareUrl.select();
      setStatus('Clipboard access was blocked. The link is selected; copy it with your keyboard.', 'error');
    }
  });
  byId<HTMLButtonElement>('close-share').addEventListener('click', () => shareDialog.close());
  shareDialog.addEventListener('click', (event) => {
    if (event.target === shareDialog) shareDialog.close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cableMode && !shareDialog.open) {
      cableSource = null; cableMode = false;
      cableButton.setAttribute('aria-pressed', 'false'); cableButton.textContent = 'Edit cables';
      routeHelp.textContent = 'Select a module to inspect it.'; syncModuleClasses();
      setStatus('Cable editing cancelled.');
    }
  });

  const updateNetwork = (): void => {
    byId<HTMLElement>('network-banner').classList.toggle('visible', !navigator.onLine);
  };
  window.addEventListener('online', updateNetwork);
  window.addEventListener('offline', updateNetwork);
  updateNetwork();
  new ResizeObserver(() => drawCables()).observe(stage);
  window.addEventListener('pagehide', () => { void engine.stop(); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => setStatus('Offline setup did not finish. The patch editor still works online.', 'error'));
    });
  }
}

// Hash navigation alone does not consistently move focus across browsers.
// Keep the visible skip link's native target behavior and explicitly place
// keyboard/screen-reader focus on the newly rendered main landmark.
document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', () => {
  requestAnimationFrame(() => document.getElementById('main')?.focus());
});
