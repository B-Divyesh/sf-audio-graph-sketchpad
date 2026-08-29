# Review 3 handoff

## Outcome

Wrote and committed the independent adversarial review in `.factory/review-3.md`. No product code was changed.

## Verdict

**FAIL** — F-3-1 is blocking: the required full live claim command intermittently fails `@claim:audible-edits`.

## Verification run

- Fresh live cold contexts at 390 × 844 and 1440 × 900.
- One-click `/?demo=1` sample, reset/exit isolation, local-storage sentinel, and same-origin request behavior.
- Every registry command run individually against the deployed site; each passed once. The same 16 commands all passed again from a fresh `/tmp` clone after `npm ci`.
- One full fresh-clone live `npm run test:claims` run passed 16/16. An earlier full live command against the same checked-out source and matching deployed assets produced 15 passes and an `audible-edits` failure.
- Five subsequent individual `audible-edits` reruns passed, confirming the test is flaky rather than proving the observed full-suite failure irrelevant.
- Local `npm run build`, local `npm test`, and `npm run verify:live` passed.
- Confirmed live JS/CSS hashes match the fresh local build; checked all internal links, titles, metadata, 404, history focus/scroll, privacy requests, mobile width, and visual identity.

## How to reproduce the blocker

```sh
npm ci
PLAYWRIGHT_BASE_URL=https://audio-graph-sketchpad.sociobot.in npm run test:claims
```

If the test passes on a retry, run the command again: the initial full clean live run in this review failed `@claim:audible-edits` with post-removal audio level `0.5068359375` against a required value below `0.2998046875`.

## Next step

Make the output-change test deterministic at the product/analyser level, then rerun the complete review checklist. See F-3-1 for the exact required repair.
