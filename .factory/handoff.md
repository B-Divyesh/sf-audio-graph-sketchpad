# Polish round 3 handoff

## Outcome

PASS. Every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` is closed. Patchboard remains a Vite + TypeScript static web product with its dark demoscene patch-panel identity.

The deployed product is <https://audio-graph-sketchpad.sociobot.in>. Repair commits are `9cf7bc8`, `bd83b40`, and `2735a62`. Azure deployment `31946662-1146-41f1-9a23-447fac2a5598` completed successfully.

## What changed

- Replaced the flaky recent-level comparison with `AudioEngine.measureOutput()`: a revision-bound measurement from the active speaker analyser over four beat intervals.
- The measurement waits until the current delay tail is below -80 dB, uses audio-clock time, reports RMS and peak, and aborts if the graph changes mid-window.
- Seeded the synthesized noise buffer and clear/rebuild delay feedback wiring on every reconnect.
- Strengthened `@claim:audible-edits` to require a 99% reduction in RMS and peak after removing Filter → Delay. It has no retry path.
- Strengthened demo reset, first-phone-viewport, privacy/request, and one-to-one claim-registry regression tests.
- Added Node types so `npx tsc --noEmit` is a real passing gate.
- Updated the catalog description to: “Build, hear, and export a six-module Web Audio graph before adding it to your code.”
- Updated visitor copy and the 404 label without changing the visual system.

The cumulative finding map is `.factory/polish-3.md`. The full sentence inventory is `.factory/copy-audit.md`.

## Exact verification

Final-code clean clone: `/tmp/tmp.fMKyoy08Ki/clone`. Repeated-suite clean clone: `/tmp/tmp.FZFoihjC18/clone`.

| Check | Result |
| --- | --- |
| Every `.factory/claims.json` command, run separately after `npm ci` | 16/16 passed |
| Focused deterministic `audible-edits`, two workers | 10/10 passed |
| Full local claim suite, `--repeat-each=3` | 48/48 passed |
| Full clean-clone claim suite, `--repeat-each=2` | 32/32 passed |
| Full live claim suite, `--repeat-each=2` | 32/32 passed |
| `npm test` locally and in the clean clone | 10 unit passed; 31 browser passed; 17 expected mobile claim skips |
| Full live `npm run test:e2e` | 31 passed; 17 expected mobile claim skips |
| `npx tsc --noEmit` | passed |
| `npm audit --audit-level=moderate` | 0 vulnerabilities |
| `npm run build` | passed; `dist/` produced |
| Build payload | JS 38.51 KB raw / 12.99 KB gzip; CSS 16.62 KB raw / 4.47 KB gzip |
| Factory URL verifier | title/lang/H1/main/alt/buttons passed; zero console errors |
| Playwright axe integration on root, demo, privacy, terms, and 404 | zero serious/critical findings |
| `npm run verify:live` | five routes; HTTP 404; zero console errors; zero external requests; no 390 px overflow; offline reload passed |
| Live Lighthouse mobile | Performance 100; Accessibility 100; Best Practices 100; SEO 100; FCP 0.9 s; LCP 1.1 s; TBT 30 ms; CLS 0 |

Live/local SHA-256 identity:

```text
index.html                    98c0b9a4c3d9546a1b1da1a7ffcf2a826ca2fa1d1937ba33037b6b108cd55c03
assets/index-BouiG31a.js     dcd0ff6a96a2dc845b16a5f1ca7feb081bd43109098904245cffa089741f9fd4
assets/index-BaTgB3zc.css    770771bf8f6cb4f9b2ea1d1743b4134c00b6d420deca0c64ed463b421aa38a11
sw.js                         1cbd53fc0b7552ebac06b3b0f2064afe8fc22af9fa34a0db61f229148dab73be
```

Screenshots and reports:

- `.factory/evidence/polish-3-live/screenshot-desktop.png`
- `.factory/evidence/polish-3-live/screenshot-mobile.png`
- `.factory/evidence/live-cold/demo-desktop.png`
- `.factory/evidence/live-cold/demo-mobile.png`
- `.factory/evidence/live-cold/404-live.png`
- `.factory/evidence/polish-3-live/lighthouse.json`
- `.factory/evidence/polish-3-live/verify.json`

## Run and verify

```sh
npm ci
npx tsc --noEmit
npm test
npm run test:claims
npm run build
npm run preview
```

Use `PLAYWRIGHT_BASE_URL=https://audio-graph-sketchpad.sociobot.in npm run test:e2e` for the live browser suite. Use `npm run verify:live` for the cold route, 404, accessibility, privacy, mobile, and offline audit.

## Known gaps and next steps

None. No finding, TODO, stub, or deferred minor item remains.
