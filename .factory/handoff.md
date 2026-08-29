# Review 4 handoff — Patchboard

## Outcome

PASS. This review changed no product code. `.factory/review-4.md` records the complete adversarial first-read review of the live product and candidate commit `6a88820c504202644cd510504cba0cc9b8b5eca4`.

## What was verified

- Fresh 390 px and desktop browser contexts confirmed the landing screen communicates the job, audience, and first click before scrolling.
- Direct `/demo` and `/?demo=1` opened the populated Neon steps sample workbench with the persistent sandbox banner, Reset demo, and Start for real.
- Normal-storage isolation, same-origin-only requests, no cookies/analytics, and offline demo reload were checked against the live site.
- Every one of the 16 `.factory/claims.json` commands was run individually from a new clone after `npm ci`; all passed.
- `npm test` passed in that clean clone: 10 unit checks and 48 browser cases. `npm run build` produced `dist/`.
- `npm run verify:live` passed: five routes, HTTP 404, zero serious/critical axe findings, zero console errors, zero external requests, no mobile overflow, and offline reload.
- Live metadata, dead links, deep links, Back/Forward focus and scroll, shared navigation/footer, robots, sitemap, 404, and visual identity were rechecked.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run build
npm run verify:live
```

## Known gaps and next steps

None. No review finding remains. Future product changes should rerun the commands above and preserve the demo isolation and registered-claim coverage.
