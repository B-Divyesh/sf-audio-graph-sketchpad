# Review 5 handoff — Hear a Web Audio graph before coding it

## Outcome

FAIL with three findings and zero untested claims. This review changed no product code. `.factory/review-5.md` records the seven-day independent review of implementation candidate `2735a62eb0d45e5ae8d06d61bff346c2186f8fd8` from documentation baseline `20f0193d8248b5380253ffb00b64fb9f31b96705`.

## What was verified

- Fresh 390 px and 1440 px contexts confirmed the job, audience, first action, three facts, and no first-load console or external-request errors before scrolling.
- Direct demo entry, realistic populated output, persistent sample label, A/B audio controls, reset, normal-data isolation, and exit to real mode passed live.
- Every one of the 16 claim commands passed separately after `npm ci`; there are zero untested public claims.
- `npm test`, `npx tsc --noEmit`, `npm run build`, the full live browser suite, and `npm run verify:live` passed.
- Live HTML, JavaScript, CSS, and service worker hashes exactly match local `dist/` from the implementation candidate.
- Full-severity Axe, strict touch-target, and 200%-text checks found the three open accessibility defects described below.
- Lighthouse mobile scored 100 in Performance, Accessibility, Best Practices, and SEO; LCP was 1.1 s, TBT 50 ms, CLS 0, and measured editor interaction duration peaked at 24 ms.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run build
npm run verify:live
```

## Known gaps and next steps

1. **F-5-1, major:** 200% text creates horizontal overflow on all checked routes and clips the demo tempo controls.
2. **F-5-2, major:** demo exit, legal recovery, and several navigation links are smaller than 44 × 44 CSS pixels.
3. **F-5-3, minor:** Axe reports the editor inspector as a complementary landmark nested inside `main`.

Fix all three, deploy the new implementation, and rerun every claim command plus the full live accessibility checks. Do not declare PASS while any finding remains.
