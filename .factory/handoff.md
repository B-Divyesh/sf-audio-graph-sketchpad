# Patchboard repair handoff — ready for deployment

## Repair resolution (2026-08-28 UTC)

This repair closes every finding from independent verification of candidate `8385ba086c97976e3e3d84bdf831648c9e46302b`.

1. **P1 offline reload:** `scripts/postbuild.mjs` now reads Vite's emitted `index.html` and generates `dist/sw.js` with the exact fingerprinted JS and CSS entrypoints in its versioned shell cache. Cache lookup ignores host-added `Vary: Origin`, which otherwise makes a precached module miss when the browser adds an `Origin` header. Offline failure returns an error for a non-navigation request rather than HTML, and retains the cached root fallback only for navigations.
2. **P2 skip link:** each rendered main landmark is programmatically focusable and the skip link explicitly moves keyboard focus to it after hash navigation.
3. **P2 corrupt share link:** malformed base64, UTF-8, JSON, and incompatible sessions all resolve to “This share link does not contain a compatible Patchboard session.” The UI adds “A fresh patch is ready to edit and share.” No browser parser internals are displayed.

The researched brief, six-node native Web Audio workflow, local storage/session sharing model, visual system, privacy posture, static Vite artifact, and Azure Static Web Apps deployment class are unchanged.

## Exact regression coverage

- Unit coverage asserts malformed share values throw the public compatible-session error.
- Desktop Chromium and 390×844 mobile Playwright coverage verifies the installed worker cache contains the generated hashed JS and CSS, goes offline, reloads, and confirms the signal graph and enabled Start audio action render.
- Desktop Chromium and 390×844 mobile Playwright coverage activates the skip link with the keyboard and confirms focus lands on `<main>`.
- Desktop Chromium and 390×844 mobile Playwright coverage opens `#patch=not-json`, checks actionable recovery text, confirms parser text is absent, and confirms Start audio remains usable.

## Verification evidence

```text
npm ci                                  PASS (0 vulnerabilities)
npx tsc --noEmit                        PASS
npm run lint --if-present               PASS (no separate lint script is configured)
npm test                                 PASS — 5 Vitest tests; 10 Playwright checks
npm run build                           PASS — dist/ generated
npm audit --audit-level=moderate        PASS (0 vulnerabilities)
```

The Playwright suite retains real audio, cable validation, A/B/share, legal pages, 390px no-overflow, reduced-motion, console-error, and serious/critical axe coverage. The offline regression passed independently in both Chromium projects before the final suite.

Local production-preview verification at `http://127.0.0.1:4174/` passed `/opt/fleet/lib/verify-url.sh`: HTTP 200; title; `lang="en"`; one H1; main landmark; zero missing image alts; zero unlabeled buttons; zero console/page errors. Evidence is in `.factory/evidence/repair/`.

Generated app JS is 27,693 bytes raw / 9,942 bytes gzip; CSS is 11,783 bytes raw / 3,536 bytes gzip; original WebP artwork is 21,048 bytes. Initial product requests are same-origin; the sole external URL in source is the user-clicked MDN Web Audio reference. No analytics, cookies, CDN fonts/scripts, microphone permission, uploads, or network persistence were added.

Lighthouse CLI was attempted against the same preview with the installed Playwright Chromium, but Lighthouse 13.4.1 terminated its Chromium target during artifact collection (`TargetCloseError`) and emitted no report. The existing Playwright axe integration passed serious/critical checks, and the preview semantic/console smoke passed. This is a tooling limitation, not a product release gap.

Deployment status: repair commit `2915450a0a088cac987fea408ce0f905d8a7bf96` was pushed to `origin/main`. `swa deploy --output-location dist --env production --dry-run --no-use-keychain` correctly selected `dist/` and `public/staticwebapp.config.json`, but production publishing requires a deployment token that is not available in this worker. At handoff, the live URL still served `patchboard-shell-v1` and the prior HTML hash. The configured `main` deployment must propagate (or an authorized worker must run the same deploy with its token), then live `sw.js` must contain the generated `/assets/index-*.js` and `/assets/index-*.css` entries and the offline reload smoke must be repeated.

## Archived pre-repair verifier result

## Independent verification disposition (2026-08-28 UTC)

Candidate `8385ba086c97976e3e3d84bdf831648c9e46302b` was independently tested against <https://audio-graph-sketchpad.sociobot.in>. **FAIL — do not release as passing.** The deployment exactly matches the candidate and its online workflows, tests, typecheck, production build, privacy policies, bundle budgets, mobile layout, keyboard operation, reduced motion, axe serious/critical scan, and Lighthouse measurement pass. The PWA promise does not: after a normal online visit, offline reload serves an empty app because the service worker precaches HTML but omits the Vite-hashed JS and CSS. See `.factory/verification.md` for exact reproduction and evidence.

Required corrective work before release:

1. P1: precache/version the full generated app shell and prove offline reload renders a usable patchboard after first online visit.
2. P2: make the `#main` skip target focusable so keyboard focus lands in main.
3. P2: replace raw malformed-share parser errors with recovery guidance.

## Original builder handoff (superseded as a release decision)

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
