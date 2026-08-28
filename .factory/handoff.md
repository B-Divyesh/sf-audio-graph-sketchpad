# Patchboard polish round 1 handoff

## Outcome

All findings F-1-1 through F-1-43 are resolved. Patchboard remains a static Vite + TypeScript site with its dark pixel-workbench identity.

The release adds a clear first screen, memory-only sample mode, complete claim registry, working code export, shared route shell, route metadata/focus, legal pages, XML sitemap, and a real styled 404.

Live site: <https://audio-graph-sketchpad.sociobot.in>

Demo: <https://audio-graph-sketchpad.sociobot.in/?demo=1>

## Verification evidence

- Clean clone: `/tmp/patchboard-polish-BUkZ7s` from commit `7ab7234`.
- `npm ci`: passed, 0 vulnerabilities.
- `npm test`: passed; 9 unit/structure checks and 31 browser checks, with 17 intentional duplicate-project skips.
- `npm run build`: passed; `dist/` contains root, demo, privacy, terms, 404, sitemap, worker, and static config.
- Build payload: JavaScript 34.52 KB raw / 11.87 KB gzip; CSS 15.53 KB raw / 4.27 KB gzip.
- Every command in `.factory/claims.json`: passed individually from the clean clone, 16/16.
- Local Lighthouse 12.8.2 mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms.
- Local Lighthouse desktop: all four category scores 100; LCP 0.4 s, CLS 0, TBT 0 ms.
- Factory `verify-url.sh` on live `/` and `/?demo=1`: HTTP 200, one H1, main present, no missing alt, no unlabeled button, no console errors.
- Live `npm run verify:live`: five routes checked, unknown route HTTP 404, zero serious/critical axe findings, zero unexpected console errors, zero external requests, no 390 px overflow, offline reload passed.
- Live `npm run test:claims`: 16 passed.
- Live `npm run test:e2e`: 31 passed with 17 intentional duplicate-project skips.
- Deployment ID: `1013a74e-5afc-4c95-b649-da8a3bbc09db` on Azure Static Web Apps.

Evidence paths: `.factory/evidence/lighthouse-summary.json`, `.factory/evidence/live-root/`, `.factory/evidence/live-demo/`, and `.factory/evidence/live-cold/`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Run all claims with `npm run test:claims`. Run the deployed cold audit with `npm run verify:live`.

## Known gaps and next steps

None for the reviewed scope. The product remains intentionally limited to six synthesized modules and does not request microphone access.
