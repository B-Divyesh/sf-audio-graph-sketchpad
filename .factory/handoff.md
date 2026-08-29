# Polish round 2 handoff

## Outcome

Repair candidate: `248aba0c2cbab1d8ce2877723fc0469502e5d233` (following `0a2db5d`). It closes every blocking, major, and minor finding in `.factory/review-1.md` and `.factory/review-2.md` without changing the static Vite deployment class.

The demo is now a one-click, memory-only workbench: `/?demo=1` shows the Neon steps sample itself in the initial 390 × 844 viewport, with the persistent banner, reset, exit, active variant, values, connection summary, Start audio control, patch name, and graph. Normal patches remain isolated in `patchboard.session.v1`.

## Verification

Fresh clone: `/tmp/patchboard-final-clean-rRwvcW/clone` at `248aba0`.

- `npm ci` — passed; 0 vulnerabilities.
- `npm run test:claims` — 16/16 claim tests passed. Each registry entry is exercised through the demo entry point; reopened audible, synthesis, resonance, normal-storage, and isolation proof gaps now operate Patchboard itself.
- `npm test` — passed: 9 unit/structure checks and 48 Playwright project checks (the expected duplicate mobile claim cases are skipped by design).
- `npm run build` — passed; `dist/` generated. Initial JS is 36.24 KB raw / 12.33 KB gzip. CSS is 16.62 KB raw / 4.47 KB gzip.
- `npm audit --audit-level=moderate` — passed; 0 vulnerabilities.
- Local visual checks: `.factory/evidence/polish-2-demo-mobile.png`, `.factory/evidence/polish-2-root-desktop.png`, and `.factory/evidence/polish-2-404.png`.
- Local accessibility is covered by the route axe tests (zero serious/critical findings), visible focus/skip-link tests, mobile overflow checks, reduced-motion checks, and route-title/404 tests.

## How to run

```sh
npm ci
npm test
npm run test:claims
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample. See `.factory/demo.md` for reset and storage behavior.

## Deployment and live re-check

Deployed with `/opt/fleet/lib/deploy-static.sh audio-graph-sketchpad dist`. Azure deployment `5745589b-b5e0-461e-bf17-328e4ea91c45` completed successfully to the existing Static Web App and custom domain.

`npm run verify:live` passed against `https://audio-graph-sketchpad.sociobot.in` after deployment:

```json
{"routes":5,"unknownStatus":404,"axeSeriousCritical":0,"consoleErrors":0,"externalRequests":0,"mobileOverflow":false,"offlineReload":true}
```

Fresh cold live contexts rechecked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/404.html`, and an unknown URL. The live demo contains the new direct workbench rather than the repeated hero; reset/exit isolation, 404 wording, route focus/scroll, metadata, accessibility, privacy requests, and offline reload all passed. Live captures are `.factory/evidence/live-cold/demo-desktop.png`, `.factory/evidence/live-cold/demo-mobile.png`, and `.factory/evidence/live-cold/404-live.png`.

All 16 individual commands from `.factory/claims.json` were also run separately from the clean clone; `/tmp/patchboard-individual-claims.log` records 16 commands and 16 one-test passes.

Known product gaps: none. No runtime AI feature is appropriate; code export is deterministic and tested.
