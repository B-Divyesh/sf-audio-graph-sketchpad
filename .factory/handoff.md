# Repair 2 handoff — Hear a Web Audio graph before coding it

## Outcome

PASS. The three findings in `.factory/review-5.md` are fixed in implementation `4490bbc2d80456efde1660edf90ea45b1d30f365`. The later handoff commit changes documentation and evidence only.

The deployed product is <https://audio-graph-sketchpad.sociobot.in>. Azure Static Web Apps deployment `33300434-40da-46df-b909-df1e431581a7` completed successfully against the existing `sf-audio-graph-sketchpad` resource.

## Changes

- The phone header and demo transport now reflow into rows. Every checked route remains within a 390-pixel viewport when root text is enlarged to 200%, and every visible control remains in view.
- Header, footer, demo-exit, and legal-return links now provide at least a 44 × 44 CSS-pixel hit area.
- The parameter inspector is a labeled section instead of a complementary landmark nested in `main`.
- Browser regressions measure rendered 200% reflow, clipped controls, touch hit areas, first-screen placement, and all Axe violations. They do not assert implementation strings.
- The live verifier now checks every Axe impact, the designed 404, 200% reflow, clipped controls, and touch targets.
- `.factory/design.md` records the enlarged-text and target-size behavior. The visible build label is `repair-2`.

## User and demo verification

Fresh 390 × 844 and 1440 × 900 HTTPS contexts opened at scroll position zero. Both showed the job, **“Hear a Web Audio graph before coding it,”** the creative-coder audience, **“Try it with sample data,”** and the three free/offline/browser-storage facts before scrolling. There were no console errors.

The sample action opened the populated **Neon steps** patch with four cables, 920 Hz cutoff, 240 ms delay, A/B controls, and a persistent **“Demo — sample data, nothing is saved”** banner. Reset restored both bundled variants. Leaving demo restored the normal patch byte-for-byte; demo mode created no storage key. The live browser suite also covered audio start/stop, A/B changes, code export, sharing, invalid feedback, BPM boundaries, empty-graph recovery, keyboard focus, reduced motion, offline reload, legal routes, and the deliberate HTTP 404.

## Clean verification

A fresh clone at the implementation SHA was installed with `npm ci`. Every command in `.factory/claims.json` ran separately: 16 of 16 passed.

| Check | Result |
| --- | --- |
| `npm test` | PASS — 10 unit and 33 executed browser checks; 19 cross-project cases intentionally skipped |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — `dist/index.html` produced |
| `npm audit --audit-level=moderate` | PASS — zero vulnerabilities |
| `/opt/fleet/lib/verify-url.sh` | PASS — HTTPS 200, title, `lang`, one H1, main, alt text, labels, zero console errors |
| `npm run verify:live` | PASS — five routes, expected HTTP 404, zero Axe violations, zero external requests, zero undersized targets, no 200% overflow, offline reload |
| Live Playwright suite | PASS — 33 executed checks, including all registered claim flows |
| Lighthouse 12.8.2 mobile | 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.07 s, TBT 14 ms, CLS 0 |

Production output is 38,510 bytes of JavaScript and 17,145 bytes of CSS before compression. Lighthouse transferred 42,196 bytes. These remain inside the static-product budgets.

## Deployment identity

The live and local SHA-256 values match:

```text
index.html                         be917676845a6b03db9dd48f588b12e43c056acaf13ba82dbe4c3a5d1600306a
assets/index-BM2u3zq5.js          69692a295078d3de6704474792e8e11ed4aa61fc95054bcb97022ac4795d923d
assets/index-D1L0LHSO.css         2a7f0f6446e747960f0a5107415d2c57a89f28b14b8595d2b38a3b0065915851
sw.js                              770c22246f4cae57c469670d05c0c91275533e5ee672ce317a3133975188c84e
```

## Earlier findings and scope

All reports in `.factory/review-1.md` through `.factory/review-5.md`, both verification reports, and all three polish reports were read. The earlier-finding table in review 5 remains accurate: the complete claim suite, route tests, demo-isolation flow, offline test, keyboard/recovery tests, privacy request audit, metadata checks, and live suite passed again. F-5-1, F-5-2, and F-5-3 now have the direct rendered regressions listed above.

This is a free static product. Backend tenant, database, health, restart, rate-limit, billing-registration, and paid-entitlement checks do not apply. No AI feature is warranted for the deterministic graph-learning job.

## Known gaps

None found. Browser audio output still depends on the visitor's device and sound permission, as the public terms state.
