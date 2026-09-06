# Verification 3 — Hear a Web Audio graph before coding it

## Decision

**PASS.** The independent review found zero defects, zero untested claims, and zero unlisted public claims.

- Findings: **0**
- Untested claims: **0**
- Implementation reviewed: `4490bbc2d80456efde1660edf90ea45b1d30f365`
- Documentation baseline: `e386a2f7e5d3136ec368db1fa22f212212d45d2e`
- Deployment: `33300434-40da-46df-b909-df1e431581a7`
- Live URL: <https://audio-graph-sketchpad.sociobot.in>
- Review date: 6 September 2026 UTC

The live HTML, JavaScript, CSS, and service worker match the clean build from the implementation commit byte for byte. The later documentation commit does not change the product image.

## First screen before scrolling

Fresh 1440 × 900 desktop and 390 × 844 phone contexts opened the live root at scroll position zero.

| Question | Answer shown on both screens | Evidence |
| --- | --- | --- |
| What is the job? | **Hear a Web Audio graph before coding it** | H1 bottom was 293 px on desktop and 309 px on phone. |
| Who is it for? | **Creative coders learning how six browser audio modules affect one another** | Audience copy bottom was 365 px on desktop and 408 px on phone. |
| What is the first action? | **Try it with sample data** | Action bottom was 431 px on desktop and 474 px on phone. |
| What are the main facts? | Free; works offline after the first visit; patches stay in this browser | Facts bottom was 479 px on desktop and 700 px on phone. |

All four items were visible before scrolling. The words are direct, the H1 names the job, and no metaphor or mood heading is used.

## Demo and user paths

The first action opened the sample in one click. The first phone viewport showed a used workbench, its patch name, values, graph, connections, and **Start audio** control.

| Check | Result |
| --- | --- |
| Persistent label | PASS — **Demo — sample data, nothing is saved** remained present. |
| Populated sample | PASS — **Neon steps**, four cables, A at 920 Hz and 240 ms, B at 2600 Hz and 360 ms with 42% feedback. |
| Sound and A/B | PASS — Start audio changed the transport to Stop audio; A and B exposed their distinct values. |
| Reset | PASS — reset restored variant A, 920 Hz, 240 ms, and four original cables. |
| Real-data isolation | PASS — a saved `VERIFY 3 REAL PATCH` session remained byte-for-byte unchanged through demo edits, reset, and exit. No `demo:` storage key was created. |
| Normal path | PASS — edit, save, reload, audio start/stop, A/B, sharing, and code export worked. |
| Invalid path | PASS — Gain → Filter feedback was rejected with a plain error and no graph mutation. A corrupt share link opened a safe fresh patch. |
| Boundary path | PASS — tempo accepted 40 and 240 BPM; values 1 and 999 clamped to those limits. |
| Recovery path | PASS — after all cables were removed, the empty guidance appeared and Oscillator → Speaker could be added. |
| Keyboard | PASS — skip link, route focus, cable editing with Space/Enter, Escape cancellation, range keys, and dialog Escape worked. Share-dialog focus moved to the share link. |
| Reduced motion | PASS — the browser preference was recognized and no infinite running animation remained. The visible setting also reports its state. |
| Offline | PASS — after one online visit, the cached demo reloaded offline and Start audio remained usable. |
| Privacy requests | PASS — the complete sample flow made zero cross-origin requests, set no cookie, and did not access the microphone or samples. |

Update behavior is not a public promise. Backend, tenant, database, restart, health, and 429 checks do not apply to this static product.

## Declared claims

Every command in `.factory/claims.json` was run separately from a clean checkout after `npm ci`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Normal patch survived demo edit, reset, and exit unchanged. |
| `six-modules` | PASS | Six modules rendered and Noise → Delay connected through the UI. |
| `audible-edits` | PASS | Removing Filter → Delay changed the running analyser output by the required amount. |
| `synthesized-audio` | PASS | Audio started without microphone, fetch, XHR, decode, media playback, or sample requests. |
| `fragment-ab-share` | PASS | A share link restored distinct A and B values. |
| `fragment-private-share` | PASS | The navigation request omitted `#patch=` while the patch restored. |
| `offline-reload` | PASS | Hashed assets were cached; the sample reloaded and started offline. |
| `gesture-only-audio` | PASS | No graph was built before **Start audio**. |
| `feedback-blocked` | PASS | The cycle attempt left the cable count unchanged and announced the error. |
| `audio-clock-schedule` | PASS | Consecutive scheduled events matched 108 BPM on the audio clock. |
| `local-only` | PASS | Normal storage persisted, demo state did not, requests stayed on approved same-origin shell paths, and no cookie appeared. |
| `native-filter-node` | PASS | The active engine reported a low-pass `BiquadFilterNode`. |
| `resonance-output` | PASS | Product controls changed active cutoff/Q and increased the measured filter response. |
| `code-export` | PASS | Generated JavaScript contained active values and connections and executed in a fresh audio context. |
| `free-use` | PASS | The real editor opened without login, password, or checkout controls. |
| `scope-limits` | PASS | No upload, microphone, track, account, sample-library, or cloud-project control exists. |

The rendered root, demo, legal pages, dialogs, status messages, README, and copy audit were cross-checked against the registry. Each public behavior is covered by one of these claims or is clearly a legal condition or limitation. No extra claim was found.

## Routes, accessibility, privacy, and links

- `/`, `/demo`, `/privacy`, and `/terms` returned HTTPS 200. A random missing route deliberately returned HTTP 404 and rendered the designed **Page not found** screen with a return link.
- Each checked route had its own title, one H1, one main landmark, shared navigation and footer, route-correct canonical and social metadata, and zero Axe violations.
- The factory URL check found `lang=en`, one H1, a main landmark, no missing image alt, no unlabeled button, and no console or page error.
- At 390 px, every visible interactive target measured at least 44 × 44 CSS pixels. At 200% root text size, all five checked routes stayed within the viewport and no control was clipped.
- Focus moved to route H1s, Back/Forward restored focus and scroll, the skip link focused main, and native controls exposed their names, roles, and states.
- All product links, crawl files, icons, artwork, and the labeled external Web Audio reference returned 200.
- The response sends CSP, HSTS, `X-Content-Type-Options`, Referrer Policy, Permissions Policy, and `frame-ancestors 'none'`. No third-party script, font, analytics, or tracker loaded.
- `/privacy` and `/terms` are present and readable. The privacy wording matches the observed browser storage, fragment, request, cookie, sample, and microphone behavior.

## Earlier findings

Every earlier review, verification, and polish report was read. These are the current dispositions from fresh source, clean-suite, and live evidence.

| Finding | Current disposition |
| --- | --- |
| P1 offline blank app | Fixed — generated hashed assets cache and the live sample reloads offline. |
| P2 skip-link focus | Fixed — Enter moves focus to `main`. |
| P2 corrupt-share copy | Fixed — recovery gives compatible-session guidance without parser details. |
| F-1-1 | Fixed — job, audience, first action, and facts fit before scrolling on phone and desktop. |
| F-1-2 | Fixed — one-click sample is populated, labeled, resettable, memory-only, and isolated. |
| F-1-3 | Fixed — 16 registry entries map one-to-one to 16 independently passing commands. |
| F-1-4 | Fixed — unknown live routes return HTTP 404 with designed recovery. |
| F-1-5 | Fixed — six modules render and a new cable can be connected. |
| F-1-6 | Fixed — a real UI cable removal changes measured active output. |
| F-1-7 | Fixed — audio start uses no sample, microphone, decode, fetch, XHR, or media play. |
| F-1-8 | Fixed — a link restores distinct A/B variants. |
| F-1-9 | Fixed — the cached demo reloads and runs offline. |
| F-1-10 | Fixed — graph creation waits for the explicit audio action. |
| F-1-11 | Fixed — feedback attempts do not mutate the graph. |
| F-1-12 | Fixed — beat events follow the audio clock at the declared spacing. |
| F-1-13 | Fixed — precise privacy wording is backed by request, cookie, and storage checks. |
| F-1-14 | Fixed — the dialog and link contain both variants. |
| F-1-15 | Fixed — sharing makes no upload or external request. |
| F-1-16 | Fixed — the active engine uses a low-pass `BiquadFilterNode`. |
| F-1-17 | Fixed — active cutoff and resonance controls change the measured filter response. |
| F-1-18 | Fixed — untested “local-first” copy remains absent. |
| F-1-19 | Fixed — capability copy is short and claim-mapped. |
| F-1-20 | Fixed — plain scope limits are visible and tested. |
| F-1-21 | Fixed — README gives the exact unit command. |
| F-1-22 | Fixed — README gives exact browser and claim commands; both pass. |
| F-1-23 | Fixed — normal save/reload and demo isolation pass together. |
| F-1-24 | Fixed — server navigation omits the URL data after `#`. |
| F-1-25 | Fixed — hashed shell assets cache and work offline. |
| F-1-26 | Fixed — active values and connections export as executable JavaScript. |
| F-1-27 | Fixed — price, offline, storage, privacy, and limits are present. |
| F-1-28 | Fixed — titles, descriptions, canonical tags, social art, and icons are route-correct. |
| F-1-29 | Fixed — sitemap is XML and robots links it. |
| F-1-30 | Fixed — shared header and footer appear on each route. |
| F-1-31 | Fixed — deep links, history, scroll, H1 focus, and announcements pass. |
| F-1-32 | Fixed — the Web Audio link is labeled external and returns 200. |
| F-1-33 | Fixed — the former long README capability sentence remains split. |
| F-1-34 | Fixed — the audience is consistently “creative coders.” |
| F-1-35 | Fixed — offline wording is short and claim-backed. |
| F-1-36 | Fixed — visitor copy uses observable browser terms. |
| F-1-37 | Fixed — the intro label names the six-module job. |
| F-1-38 | Fixed — the how-to heading names connect, start, and compare. |
| F-1-39 | Fixed — “16-step beat position” is consistent. |
| F-1-40 | Fixed — filter copy states the audible result before the API class. |
| F-1-41 | Fixed — actions name their results. |
| F-1-42 | Fixed — legal H1s name their pages. |
| F-1-43 | Fixed — artwork alt explains its graph-building purpose. |
| F-2-1 | Fixed — no public AI-artwork claim remains. |
| F-2-2 | Fixed — README has no architecture boast. |
| F-2-3 | Fixed — storage wording consistently says “this browser.” |
| F-2-4 | Fixed — audience wording remains “creative coders.” |
| F-2-5 | Fixed — decorative “Clear boundaries” remains absent. |
| F-2-6 | Fixed — the setting is named **Reduce motion**. |
| F-2-7 | Fixed — README uses **Try it with sample data**. |
| F-2-8 | Fixed — unexplained “DAW” remains absent. |
| F-2-9 | Fixed — “payment gate” remains absent; free/no-account behavior passes. |
| F-2-10 | Fixed — README describes observable browser behavior. |
| F-2-11 | Fixed — visitor copy explains the part after `#` without URL jargon. |
| F-2-12 | Fixed — artwork documentation uses direct wording. |
| F-2-13 | Fixed — the 404 H1 is **Page not found**. |
| F-3-1 | Fixed — deterministic four-beat `audible-edits` passed alone, in the clean suite, and live. |
| F-5-1 | Fixed — all checked phone routes reflow at 200% without overflow or clipped controls. |
| F-5-2 | Fixed — all visible targets on all checked phone routes are at least 44 × 44 px. |
| F-5-3 | Fixed — the inspector is a labeled section; Axe reports zero violations on every route. |

No earlier finding reopened.

## Commands and measurements

| Command or measurement | Result |
| --- | --- |
| `npm ci` at `4490bbc` | PASS — 61 packages installed; zero vulnerabilities. |
| All 16 claim commands, separately | PASS — 16/16; no untested claim. |
| `npm test` | PASS — 10 unit checks and 33 executed browser checks; 19 intentional cross-project skips. |
| `npx tsc --noEmit` | PASS. |
| `npm run build` | PASS — `dist/index.html` produced. |
| `npm audit --audit-level=moderate` | PASS — zero vulnerabilities. |
| Live Playwright suite | PASS — 33 executed checks; 19 intentional cross-project skips. |
| `npm run verify:live` | PASS — five routes, expected 404, zero Axe violations, zero console errors, zero external requests, no default or 200% overflow, no undersized targets, offline reload usable. |
| `/opt/fleet/lib/verify-url.sh` | PASS — HTTPS 200, title, `lang`, H1, main, alt and label checks, zero console errors. |
| Lighthouse 12.8.2 mobile | PASS — 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.05 s, TBT 52 ms, CLS 0, transfer 40,553 bytes. |

The production build contains 38,510 bytes of JavaScript and 17,145 bytes of CSS before compression. Vite reports 12.99 KB gzip JavaScript and 4.56 KB gzip CSS. These are inside the static-product budgets.

## Deployment identity

| Artifact | Clean build SHA-256 | Live SHA-256 |
| --- | --- | --- |
| `index.html` | `be917676845a6b03db9dd48f588b12e43c056acaf13ba82dbe4c3a5d1600306a` | same |
| `assets/index-BM2u3zq5.js` | `69692a295078d3de6704474792e8e11ed4aa61fc95054bcb97022ac4795d923d` | same |
| `assets/index-D1L0LHSO.css` | `2a7f0f6446e747960f0a5107415d2c57a89f28b14b8595d2b38a3b0065915851` | same |
| `sw.js` | `770c22246f4cae57c469670d05c0c91275533e5ee672ce317a3133975188c84e` | same |

## Scope decision

No AI feature is missing. This job is deterministic graph construction, audible comparison, inspection, sharing, and code export. A model call would add cost, keys, network dependence, and privacy work without improving that job.

## Final result

**PASS — 0 findings and 0 untested claims.**
