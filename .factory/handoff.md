# Patchboard v1 handoff

## What shipped

- A production Vite + TypeScript static app with six real Web Audio nodes: oscillator, generated white noise, low-pass filter, delay with bounded feedback, gain, and speaker output.
- Click, touch, and keyboard-operable source-to-destination cable editing. Duplicate cables, source inputs, terminal-output routing, self-links, and graph feedback loops are rejected with actionable live-region messages.
- Explicit user-gesture transport, audio-clock look-ahead BPM scheduling, 16-step timing probe, animated live signal cables, smooth audio-parameter ramps, and a first-class calm-motion toggle plus `prefers-reduced-motion` handling.
- Whole-patch A/B variants that can be cloned, edited, and switched while audio runs.
- Local autosave and explicit save feedback, strict URL-fragment encoding/validation for share links, corrupt-link recovery, confirmation before reset, offline state messaging, and a versioned service-worker shell.
- Responsive desktop and purposefully rearranged 390px node layout; no horizontal overflow. Semantic landmarks, one H1, visible focus treatment, 44px targets, labeled controls, graph text alternative, and native dialog focus behavior.
- Original Factory-generated pixel artwork, retained source/prompt provenance, optimized 768×512 WebP (21 KB), hand-authored SVG icon, install manifest, Azure Static Web Apps cache/security configuration, privacy page, and terms page.

## Run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

Deployment command: `npm run build`

Deployment root: `dist/` (contains `index.html`, plus static `/privacy/` and `/terms/` entry points)

Verification completed on 2026-08-28:

- `npx tsc --noEmit`: passed with strict TypeScript.
- `npm test`: 5 unit tests and 4 Playwright project tests passed. Tests cover graph rules, unsafe share rejection, codec round trips, real AudioContext startup, cable changes, parameter changes, A/B, sharing, 390px layout, legal pages, console errors, and serious/critical axe findings.
- `npm run build`: passed. Initial application JS 27.51 KB raw / 9.93 KB gzip; CSS 11.78 KB raw / 3.52 KB gzip; total Lighthouse transfer 37 KB. These are well below the 200 KB JS and 50 KB CSS budgets.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, title present, `lang="en"`, one H1, main landmark present, zero missing image alts, zero unlabeled buttons, and zero page/console errors.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.5s, CLS 0. INP is not emitted for a non-interactive lab navigation.
- Evidence is saved in `.factory/evidence/`.

## Known limits and next steps

- Audio scheduling uses the browser audio clock, but audible latency still depends on the user’s browser, output device, and power-saving policy. The timing probe demonstrates scheduling; it is not a hardware-latency calibrator.
- Offline operation is available after one successful online load installs the service worker. URL-fragment sharing naturally requires a way to send the URL.
- Microphone input, samples, DAW tracks, MIDI, cloud projects, and graph-level feedback are intentionally outside the v1 brief.
- A useful next iteration would export the current graph as a small Web Audio code snippet while keeping the product local-first.
