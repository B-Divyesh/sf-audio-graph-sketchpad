# Review 6 — Hear a Web Audio graph before coding it

## Verdict

**PASS — 0 findings and 0 untested claims.**

- Live URL: <https://audio-graph-sketchpad.sociobot.in>
- Implementation candidate: `4490bbc2d80456efde1660edf90ea45b1d30f365`
- Documentation baseline reviewed: `205f06a89e26998649ecdd45622f65ee947384e5`
- Artifact class: static web; backend, tenant, restart, rate-limit, CLI, library, and desktop checks do not apply.

The commits after the implementation candidate change reports and evidence only. Fresh SHA-256 comparisons matched live HTML, JavaScript, CSS, service worker, and product artwork to the clean production build.

## First screen before scrolling

Fresh browser contexts had no stored data, cookies, or active service worker.

| Check | Desktop, 1440 × 900 | Phone, 390 × 844 |
| --- | --- | --- |
| Job | **Hear a Web Audio graph before coding it**; bottom at 293 px | Same; bottom at 309 px |
| Audience | **For creative coders learning how six browser audio modules affect one another.**; bottom at 365 px | Same; bottom at 408 px |
| First action | **Try it with sample data**; bottom at 431 px | Same; bottom at 474 px |
| Three facts | Free; offline after the first visit; patches stay in this browser; bottom at 479 px | Same; bottom at 700 px |
| Structure | HTTP 200, correct title, one H1, one main, no overflow or console error | Same |

The job, audience, action, and result are plain and visible without scrolling. Screenshots are `/work/.evidence/review-6/desktop-first-screen.png` and `/work/.evidence/review-6/phone-first-screen.png`.

## Sample, normal data, and recovery paths

- One click opened `/?demo=1` with title **Demo — Patchboard**.
- The persistent banner said **Demo — sample data, nothing is saved** and kept **Reset demo** and **Start for real** available.
- The populated sample was **Neon steps**, variant A, 920 Hz cutoff, 240 ms delay, and four cables along Oscillator → Filter → Delay → Gain → Speaker.
- Variant B selected correctly, used 2600 Hz cutoff and 7.5 resonance, used 360 ms delay with 42% feedback, and added Noise → Filter.
- Starting audio changed the transport to **Stop audio** and reported 108 BPM.
- After editing the sample name and cutoff, reset restored variant A, **Neon steps**, 920 Hz, and four original cables.
- A valid normal patch named **REVIEW 6 REAL PATCH** remained byte-for-byte unchanged through demo edits, reset, and exit. No `demo:` storage key existed.
- A Gain → Filter cycle was rejected as feedback without changing the four-cable graph.
- Tempo values 1 and 999 were clamped to the documented 40 and 240 BPM limits.
- Removing every cable showed the empty-state instruction. Space and Enter then connected Oscillator → Speaker.
- A corrupt share link recovered to a fresh patch without exposing parser details.
- Missing Web Audio reported **Web Audio is not available in this browser. Try a current browser.** and left the action available.
- Blocked local storage left the editor usable and told the user to use a share link.
- Cancelling **Start new patch** preserved the patch; confirming it restored **First light**.

The populated phone view is `/work/.evidence/review-6/demo-phone-populated.png`. Detailed manual results are `/work/.evidence/review-6/live-manual.json`.

## Declared claims

`.factory/claims.json` has 16 unique entries and exactly one matching test tag for each. Every declared command was run separately from the clean clone at `205f06a`; all passed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Normal patch survived sample edit, reset, and exit unchanged. |
| `six-modules` | PASS | Six modules rendered and Noise → Delay connected through the UI. |
| `audible-edits` | PASS | Removing Filter → Delay changed measured active output after the delay tail settled. |
| `synthesized-audio` | PASS | Start used no microphone, sample, fetch, XHR, decode, or media playback. |
| `fragment-ab-share` | PASS | The generated link restored distinct A and B settings. |
| `fragment-private-share` | PASS | The navigation request omitted `#patch=` while the patch restored. |
| `offline-reload` | PASS | Hashed assets were cached; the sample reloaded and started offline. |
| `gesture-only-audio` | PASS | The graph was not built before **Start audio**. |
| `feedback-blocked` | PASS | A cycle attempt announced the rule and did not change the graph. |
| `audio-clock-schedule` | PASS | Consecutive scheduled events matched 108 BPM on the audio clock. |
| `local-only` | PASS | Normal storage persisted; demo data did not; no external request or cookie appeared. |
| `native-filter-node` | PASS | The running engine reported a low-pass `BiquadFilterNode`. |
| `resonance-output` | PASS | Product controls changed live cutoff/Q and the measured filter response. |
| `code-export` | PASS | Generated JavaScript contained active values and connections and executed in a fresh audio context. |
| `free-use` | PASS | The normal editor opened without login, password, or checkout controls. |
| `scope-limits` | PASS | No upload, microphone, track, account, sample-library, or cloud-project control exists. |

Landing, dialogs, legal pages, README, demo documentation, catalog copy, and metadata were cross-checked against this registry. No missing, false, incomplete, or untested public claim was found.

## Accessibility, privacy, routes, and performance

- Keyboard: skip link moves focus to `main`; cable editing works with Space and Enter; Escape cancels editing and closes dialogs; share-dialog focus moves to its selected link field; route changes focus and announce the new H1.
- Screen and text: all five routes fit at 390 px and at 200% text without horizontal panning or clipped controls. Every visible interactive target is at least 44 × 44 CSS px.
- Semantics: each route has `lang=en`, a route title, one H1, header, navigation, main, footer, ordered headings, labels, and image alt text. Full Axe checks on desktop and phone found zero violations at every impact level.
- Focus and contrast: designed focus rings remain visible; Axe contrast checks pass. Zoom is not disabled.
- Motion: the operating-system reduced-motion preference is detected. With audio running, zero infinite animations remained. The visible **Reduce motion** control also stopped signal movement.
- Privacy: the complete edit, audio, reset, share, and exit flow made no cross-origin request and set no cookie. The CSP permits only same-origin connections; Permissions Policy disables microphone, camera, and geolocation.
- Offline: after an online visit, the current hashed shell reloaded and the sample could start with the browser offline.
- Routes: `/`, `/demo`, `/privacy`, and `/terms` return 200 with distinct titles, H1s, descriptions, and canonical URLs. An unknown URL deliberately returns HTTP 404 and renders the designed **Page not found** route; `/404.html` itself returns 200 as the recovery document.
- Links: every discovered internal link and the labeled external Web Audio reference returned 200. `robots.txt` and XML `sitemap.xml` are valid and linked.
- Security headers: HSTS, `nosniff`, strict-origin referrer policy, permissions policy, and a same-origin CSP are live. `frame-ancestors 'none'` is a response header.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.90 s, LCP 1.05 s, TBT 57 ms, CLS 0, transfer 40,535 bytes.
- Build budget: emitted JavaScript is 38,510 bytes uncompressed and 12.99 KB gzip; CSS is 17,145 bytes uncompressed and 4.56 KB gzip.

The product-specific dark patch-panel system, cyan signal/amber tempo palette, monospace hierarchy, stepped controls, original circuit artwork, and reduced-motion behavior match `.factory/design.md`. A model feature would not improve this deterministic audio-graph job; code export is the useful handoff, so no missed AI feature is a finding.

## Earlier findings

Every earlier review, verification, and polish report was read. These dispositions were proved again with the fresh live contexts, clean claim commands, complete local/live suites, source inspection, and artifact comparison.

| Finding | Current disposition |
| --- | --- |
| Verification P1, offline blank app | Fixed — current hashed assets cache, reload, and start offline. |
| Verification P2, skip link | Fixed — keyboard activation focuses `main`. |
| Verification P2, corrupt share | Fixed — recovery gives compatible-session guidance without parser details. |
| F-1-1 | Fixed — job, audience, primary sample action, result, and facts fit before scrolling. |
| F-1-2 | Fixed — the one-click sample is populated, labeled, resettable, memory-only, and isolated. |
| F-1-3 | Fixed — 16 registry entries map one-to-one to 16 independently passing commands. |
| F-1-4 | Fixed — unknown live routes return HTTP 404 with designed recovery. |
| F-1-5 | Fixed — six modules render and a cable can be connected. |
| F-1-6 | Fixed — a real UI cable removal changes measured active output. |
| F-1-7 | Fixed — start uses no sample, microphone, decode, fetch, XHR, or media play. |
| F-1-8 | Fixed — a link restores distinct A/B variants. |
| F-1-9 | Fixed — the cached sample reloads and starts offline. |
| F-1-10 | Fixed — graph creation waits for the explicit audio action. |
| F-1-11 | Fixed — feedback attempts do not mutate the graph. |
| F-1-12 | Fixed — beat events follow the audio clock at the declared spacing. |
| F-1-13 | Fixed — privacy wording is backed by request, cookie, and storage checks. |
| F-1-14 | Fixed — the dialog and generated link contain both variants. |
| F-1-15 | Fixed — sharing makes no upload or external request. |
| F-1-16 | Fixed — the active engine uses a low-pass `BiquadFilterNode`. |
| F-1-17 | Fixed — active cutoff and resonance controls change the measured response. |
| F-1-18 | Fixed — untested “local-first” wording remains absent. |
| F-1-19 | Fixed — capability copy is short and claim-mapped. |
| F-1-20 | Fixed — plain scope limits are visible and tested. |
| F-1-21 | Fixed — README gives the exact unit command. |
| F-1-22 | Fixed — README gives exact browser and claim commands; both pass. |
| F-1-23 | Fixed — normal save/reload and sample isolation pass together. |
| F-1-24 | Fixed — navigation omits data after `#` while restoration works. |
| F-1-25 | Fixed — hashed shell assets cache and work offline. |
| F-1-26 | Fixed — active values and connections export as executable JavaScript. |
| F-1-27 | Fixed — price, offline, storage, privacy, and limits are present. |
| F-1-28 | Fixed — titles, descriptions, canonical tags, social art, and icons are route-correct. |
| F-1-29 | Fixed — the sitemap is XML and `robots.txt` links it. |
| F-1-30 | Fixed — the shared header and footer appear on each route. |
| F-1-31 | Fixed — deep links, history, scroll, H1 focus, and announcements pass. |
| F-1-32 | Fixed — the Web Audio link is labeled external and returns 200. |
| F-1-33 | Fixed — the former long README capability sentence remains split. |
| F-1-34 | Fixed — the audience is consistently “creative coders.” |
| F-1-35 | Fixed — offline wording is short and claim-backed. |
| F-1-36 | Fixed — visitor copy uses observable browser terms. |
| F-1-37 | Fixed — the intro label names the six-module job. |
| F-1-38 | Fixed — the how-to heading names connect, start, and compare. |
| F-1-39 | Fixed — **16-step beat position** is consistent. |
| F-1-40 | Fixed — filter copy states the audible result before the API class. |
| F-1-41 | Fixed — actions name their results. |
| F-1-42 | Fixed — legal H1s name their pages. |
| F-1-43 | Fixed — artwork alt explains its graph-building purpose. |
| F-2-1 | Fixed — no public AI-artwork claim remains. |
| F-2-2 | Fixed — README has no static-site architecture boast. |
| F-2-3 | Fixed — storage wording consistently says “this browser.” |
| F-2-4 | Fixed — audience wording remains “creative coders.” |
| F-2-5 | Fixed — decorative **Clear boundaries** remains absent. |
| F-2-6 | Fixed — the setting is named **Reduce motion**. |
| F-2-7 | Fixed — README uses **Try it with sample data**. |
| F-2-8 | Fixed — unexplained **DAW** remains absent. |
| F-2-9 | Fixed — **payment gate** remains absent; free/no-account behavior passes. |
| F-2-10 | Fixed — README describes observable browser behavior. |
| F-2-11 | Fixed — visitor copy explains the part after `#` without URL jargon. |
| F-2-12 | Fixed — artwork documentation uses direct wording. |
| F-2-13 | Fixed — the 404 H1 is **Page not found**. |
| F-3-1 | Fixed — deterministic four-beat `audible-edits` passed alone, locally, and live. |
| F-5-1 | Fixed — all phone routes reflow at 200% without overflow or clipped controls. |
| F-5-2 | Fixed — all visible phone targets are at least 44 × 44 CSS px. |
| F-5-3 | Fixed — the inspector is a labeled section; Axe finds zero violations. |

No earlier finding reopened.

## Commands and artifact evidence

| Check | Result |
| --- | --- |
| `npm ci` in clean clone | PASS — 61 packages installed; zero vulnerabilities. |
| All 16 commands in `.factory/claims.json`, separately | PASS — 16/16. |
| `npm test` | PASS — 10 unit and 33 executed browser checks; 19 intentional cross-project skips. |
| `npx tsc --noEmit` | PASS. |
| `npm run build` | PASS — `dist/index.html` produced. |
| `npm audit --audit-level=moderate` | PASS — zero vulnerabilities. |
| Live Playwright suite | PASS — 33 executed checks; 19 intentional cross-project skips. |
| `npm run verify:live` | PASS — five routes, expected 404, zero Axe violations, zero console errors, zero external requests, no overflow, no undersized target, offline reload usable. |
| Factory `verify-url.sh` | PASS — HTTPS 200, title, `lang`, H1, main, alt, labels, and zero console errors. |
| Live artifact comparison | PASS — HTML, JS, CSS, service worker, and artwork hashes match the clean build. |
| Lighthouse 12.8.2 mobile | PASS — 100/100/100/100. |

## Final result

**PASS — 0 findings and 0 untested claims.**
