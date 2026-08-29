# Adversarial review 2 handoff

## Outcome

Review 2 is complete with verdict **FAIL**. The full report is `.factory/review-2.md`.

No product code was modified. The only new evidence files are the cold mobile/desktop first-screen captures and the mobile demo first-screen capture under `.factory/evidence/`.

## Blocking issues

- F-1-2: the first mobile viewport after entering the demo repeats the landing hero; the seeded editor is below the fold.
- F-1-3, F-1-6, F-1-7, F-1-17, F-1-23: five passing claim tests bypass Patchboard or omit material parts of their claims.
- F-1-31: Back restores route and H1 focus but not the prior scroll position.
- F-1-39: README uses “16-step position” instead of the required consistent “16-step beat position.”

The report also records two unlisted claims and eleven minor plain-word/404 copy findings.

## Verification performed

- Opened the live root cold at 390 × 844 and 1440 × 900 before scrolling.
- Entered demo in one click; edited and reset the sample; verified a valid normal patch remained unchanged; verified no demo storage key appeared.
- Recorded the complete observed live request flow; all requests were same-origin.
- Ran every `.factory/claims.json` command separately from clean clone `/tmp/patchboard-review2-X68QbY/clone`: 16/16 exited 0.
- Ran `npm test` in that clone: 9 unit/structure tests and 31 browser tests passed; 17 duplicate-project tests were skipped as configured.
- Ran `npm run build`: `dist/` produced; JS was 34.56 KB raw / 11.86 KB gzip.
- Ran `npm run verify:live`: five routes checked, unknown route 404, no serious/critical axe issues, no unexpected console errors, no external requests, no mobile overflow, offline reload passed.
- Crawled all discovered links on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`; all returned 200 after fragments were removed.
- Confirmed clean-build/live SHA-256 equality for HTML, JavaScript, and CSS.
- Read and rechecked all 43 findings in `.factory/review-1.md`, every closure in `.factory/polish-1.md`, the earlier handoff, and both independent verification reports.

## Evidence

- `.factory/evidence/review-2-mobile-first-screen.png`
- `.factory/evidence/review-2-desktop-first-screen.png`
- `.factory/evidence/review-2-demo-mobile.png`

## Next step

Repair every finding in `.factory/review-2.md`, then repeat the full review rather than only the reopened checks. Do not treat the 16 green claim commands as acceptance until the five defective claim tests exercise the actual product behavior.
