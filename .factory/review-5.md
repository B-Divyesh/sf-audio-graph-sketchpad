# Review 5 — Hear a Web Audio graph before coding it

**Verdict: FAIL**

**Reviewed:** 6 September 2026 UTC  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Implementation candidate:** `2735a62eb0d45e5ae8d06d61bff346c2186f8fd8`  
**Documentation baseline:** `20f0193d8248b5380253ffb00b64fb9f31b96705`  
**Findings:** 3 (2 major, 1 minor)  
**Untested claims:** 0

The product works end to end and every registered claim passes. It does not pass this review because the live interface loses responsive layout at 200% text size, several links miss the required 44 × 44 CSS-pixel touch target, and both editor routes have an Axe landmark violation. A PASS requires zero findings of every severity.

## First screen before scrolling

Fresh Chromium contexts with no cookies, storage, or service worker opened `/` at 390 × 844 and 1440 × 900. Both started at `scrollY = 0`.

| Question | Phone | Desktop |
| --- | --- | --- |
| What job does it do? | **“Hear a Web Audio graph before coding it.”** | The same job is clear. |
| Who is it for? | **“For creative coders learning how six browser audio modules affect one another.”** | The same audience is clear. |
| What is the first action? | **“Try it with sample data.”** It is fully visible at `y=376`, before scrolling. | The same primary action is fully visible at `y=385`. |

The three facts—free, offline after the first visit, and stored in this browser—are also visible before scrolling in both contexts. The page made four same-origin requests, no external request, and logged no console or page error.

## Findings

### F-5-1 — Major — 200% text size causes clipped content and horizontal scrolling

- Location: live `/`, `/?demo=1`, `/privacy`, and `/terms` at a 390 × 844 viewport after setting the root text size to 200%.
- Evidence: `/`, `/privacy`, and `/terms` expand to 399 CSS pixels in a 390-pixel viewport. The header Privacy link ends at `x=399.1`. The demo expands to 562 pixels; its tempo range begins at `x=430.3`, and the number field ends at `x=562.3`.
- Impact: a low-vision visitor must pan horizontally, and the demo’s tempo controls are outside the viewport. This fails the attached requirement that text resize to 200% without loss.
- Required change: make the header wrap at enlarged text sizes and let the demo transport and tempo controls stack without fixed minimum widths. Add a 390-pixel, 200%-text regression test for every route.

### F-5-2 — Major — Required links are smaller than the 44 × 44 touch target

- Location: all live routes at 390 pixels, especially the persistent demo banner and legal-page recovery path.
- Evidence: the demo banner’s **Start for real** link is `101.6 × 24`; each legal **Return to Patchboard** link is `188 × 24`; the header **Demo** and **Terms** links are `42.8 × 44` and `42.4 × 44`; the footer **Terms** link is `41.5 × 44`.
- Impact: the undersized demo exit and legal recovery actions are harder to activate by touch. This fails the explicit 44 × 44 CSS-pixel baseline.
- Required change: give navigation, demo-banner, legal-return, and footer links a 44-pixel minimum width and height with suitable padding. Add a mobile target-size assertion that checks the clickable label or control.

### F-5-3 — Minor — The inspector creates a nested complementary landmark

- Location: live `/` and `/?demo=1`, desktop and phone.
- Evidence: a full Axe 4.10.2 scan reports `landmark-complementary-is-top-level` with moderate impact for `aside#inspector`: “The complementary landmark is contained in another landmark.” Legal and 404 routes have zero Axe violations.
- Impact: screen-reader landmark navigation receives an unnecessary nested complementary region for a panel that is part of the editor’s main task.
- Required change: use a labeled `section` or neutral container for the inspector, or move a true complementary landmark outside `main`. Run Axe without filtering out moderate and minor results.

## Demo and real-data isolation

The one-click action opens a used workbench, not another introduction. The first phone viewport shows the persistent **“Demo — sample data, nothing is saved”** label, **Neon steps**, active A, six modules, four cables, 920 Hz cutoff, 240 ms delay, the route summary, and **Start audio**.

The banner remained visible after scrolling. A normal patch named `REVIEW 5 REAL` was saved first. Demo edits changed the name, active variant, and cutoff; **Reset demo** restored A to 920 Hz and B to 2600 Hz. **Start for real** restored `REVIEW 5 REAL`, and the saved normal-session bytes were unchanged. No demo storage key was created.

## Claims

`.factory/claims.json` has 16 unique claims and exactly one tagged test for each. After `npm ci`, every declared command was run separately from this clean checkout.

| Claim | Result | Observable proof |
| --- | --- | --- |
| `demo-isolation` | PASS | Normal data survived demo edit, reset, and exit unchanged. |
| `six-modules` | PASS | Six modules rendered and Noise → Delay connected through the UI. |
| `audible-edits` | PASS | Removing Filter → Delay changed the measured running output. |
| `synthesized-audio` | PASS | Start used no microphone, sample, fetch, XHR, decode, or media playback. |
| `fragment-ab-share` | PASS | Distinct A and B values survived the share-link round trip. |
| `fragment-private-share` | PASS | The navigation request omitted `#patch=` while the patch restored. |
| `offline-reload` | PASS | The cached demo reloaded and started with the browser offline. |
| `gesture-only-audio` | PASS | No graph was built before **Start audio**. |
| `feedback-blocked` | PASS | A Gain → Filter cycle was rejected without changing the graph. |
| `audio-clock-schedule` | PASS | Consecutive scheduled times matched 108 BPM on the audio clock. |
| `local-only` | PASS | Normal storage persisted; demo data did not; requests stayed on the known shell paths; no cookie appeared. |
| `native-filter-node` | PASS | The running engine reported a low-pass `BiquadFilterNode`. |
| `resonance-output` | PASS | Product controls changed active Q/cutoff and the measured filter response. |
| `code-export` | PASS | Generated JavaScript contained active values/connections and executed in a fresh audio context. |
| `free-use` | PASS | The real editor opened without login, password, or checkout controls. |
| `scope-limits` | PASS | No upload, microphone, track, account, sample-library, or cloud-project control exists. |

Landing, legal, metadata, and README copy were cross-checked against the registry. No missing, false, incomplete, or untested public claim was found. Untested claim count is zero.

## Normal, invalid, boundary, and recovery paths

- Normal: the live desktop and mobile suites completed audio start/stop, cable editing, A/B switching, share restoration, code export, normal save/reload, and demo reset/exit.
- Invalid: a feedback cycle kept the cable count at four and announced **“That cable would create a feedback loop.”** A malformed share fragment opened a fresh patch with safe recovery guidance and no parser detail.
- Boundary: tempo input clamped `1` to `40` and `999` to `240`. Removing every cable exposed the named empty state.
- Recovery: after the empty state, keyboard-operable cable editing restored Oscillator → Filter and hid the empty state.
- Keyboard and focus: Tab reached the skip link; Enter moved focus to `main`; Space enabled cable editing; Enter connected modules; range and number controls responded to arrow keys. The share dialog focused its read-only link, trapped modal interaction, closed with Escape, and restored focus to **Share patch**. Back and Forward restored route focus and root scroll position.
- Motion: under `prefers-reduced-motion: reduce`, a running cable had a `0.00001s` animation duration and one iteration. The visible **Reduce motion** control removed animation and dash movement and announced the result.

## Routes, privacy, offline behavior, and performance

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles. The unknown review URL returns deliberate HTTP 404 and the designed **Page not found** recovery page; that expected response is not a defect.
- Every discovered internal link and in-page target resolved. The labeled external Web Audio reference returned 200.
- All checked successful routes have `lang`, one H1, `main`, labels, alt text, canonical and social metadata, shared navigation/footer, and no console error. The CSP is delivered as a response header and permits only the resources in use.
- Live editing produced no external request, cookie, analytics call, microphone request, or media-file request. The product is static, so backend tenant isolation, restart persistence, health, and 429 checks do not apply.
- Offline reload and audio start passed after service-worker installation. There is no public update-behavior promise. The generated worker uses a content-versioned cache and deletes older cache names on activation.
- The live HTML, 38,506-byte JavaScript, 16,617-byte CSS, and service worker match the local `dist/` files byte for byte. This proves the live runtime is the implementation candidate despite later report-only commits.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 50 ms, CLS 0, total transfer 41 KiB. A separate Event Timing run over five editor interactions measured a maximum interaction duration of 24 ms. Lighthouse does not include Axe best-practice violations in its score, so F-5-3 remains valid.

## Earlier finding disposition

Every earlier review and verification report was read. All earlier findings remain fixed; the three findings above are newly exposed by full-severity Axe, strict touch-target measurement, and 200% text testing.

| Earlier finding | Current disposition and fresh evidence |
| --- | --- |
| F-1-1 | Fixed: job, audience, and one sample action are visible before scrolling on phone and desktop. |
| F-1-2 | Fixed: direct demo is populated, memory-only, labeled, resettable, and has a real-mode exit. |
| F-1-3 | Fixed: 16 registry records map one-to-one to 16 passing commands. |
| F-1-4 | Fixed: unknown live URL returns HTTP 404 with a designed recovery page. |
| F-1-5 | Fixed: exactly six modules render and Noise → Delay connects. |
| F-1-6 | Fixed: real UI cable removal changes measured running output. |
| F-1-7 | Fixed: audio start invokes no sample, microphone, decode, fetch, XHR, or media play. |
| F-1-8 | Fixed: distinct A/B variants survive a share link. |
| F-1-9 | Fixed: cached demo reload and audio start work offline. |
| F-1-10 | Fixed: graph creation starts only after the explicit audio action. |
| F-1-11 | Fixed: feedback attempts leave the graph unchanged and announce the rule. |
| F-1-12 | Fixed: beat events follow the audio clock at the declared BPM spacing. |
| F-1-13 | Fixed: precise browser/request wording is backed by storage, cookie, and request checks. |
| F-1-14 | Fixed: dialog and URL restore both variants. |
| F-1-15 | Fixed: sharing makes no upload or external request. |
| F-1-16 | Fixed: the active engine exposes a low-pass `BiquadFilterNode`. |
| F-1-17 | Fixed: the active cutoff and resonance controls change the measured filter response. |
| F-1-18 | Fixed: untested “local-first” wording remains absent. |
| F-1-19 | Fixed: capability copy is split and claim-mapped. |
| F-1-20 | Fixed: plain scope limits are visible and tested. |
| F-1-21 | Fixed: README gives the exact unit command. |
| F-1-22 | Fixed: README gives exact browser and claim commands; both pass. |
| F-1-23 | Fixed: normal save/reload and demo isolation pass together. |
| F-1-24 | Fixed: the server request omits the fragment while restoration works. |
| F-1-25 | Fixed: hashed shell assets cache and work offline. |
| F-1-26 | Fixed: active graph values and connections export as executable JavaScript. |
| F-1-27 | Fixed: price, offline, storage, privacy, and limits are present. |
| F-1-28 | Fixed: route metadata and product social art are live. |
| F-1-29 | Fixed: sitemap is XML 200 and robots points to it. |
| F-1-30 | Fixed for structure: shared header/footer appear on every route. Target sizing is the new F-5-2. |
| F-1-31 | Fixed: deep links, Back/Forward scroll, H1 focus, and announcements pass. |
| F-1-32 | Fixed: the MDN link says it is external and returns 200. |
| F-1-33 | Fixed: the former long README capability sentence remains split. |
| F-1-34 | Fixed: the audience remains “creative coders.” |
| F-1-35 | Fixed: offline wording is short and claim-backed. |
| F-1-36 | Fixed: visitor copy uses observable browser terms. |
| F-1-37 | Fixed: the intro label names the six-module job. |
| F-1-38 | Fixed: the how-to heading names connect, start, and compare. |
| F-1-39 | Fixed: “16-step beat position” remains consistent. |
| F-1-40 | Fixed: filter copy states the audible result before the API class. |
| F-1-41 | Fixed: buttons name their results. |
| F-1-42 | Fixed: legal H1s name the page. |
| F-1-43 | Fixed: artwork alt explains its graph-building purpose. |
| F-2-1 | Fixed: no public AI-artwork claim exists. |
| F-2-2 | Fixed: README has no architecture boast. |
| F-2-3 | Fixed: storage wording consistently says “this browser.” |
| F-2-4 | Fixed: audience wording remains “creative coders.” |
| F-2-5 | Fixed: decorative “Clear boundaries” remains absent. |
| F-2-6 | Fixed: the setting is named “Reduce motion.” |
| F-2-7 | Fixed: README uses “Try it with sample data.” |
| F-2-8 | Fixed: unexplained “DAW” remains absent. |
| F-2-9 | Fixed: “payment gate” remains absent; free/no-account behavior passes. |
| F-2-10 | Fixed: README describes observable browser behavior. |
| F-2-11 | Fixed: visitor copy explains the part after `#` without URL jargon. |
| F-2-12 | Fixed: artwork documentation uses direct wording. |
| F-2-13 | Fixed: 404 H1 remains “Page not found.” |
| F-3-1 | Fixed: deterministic four-beat `audible-edits` passed alone, in the clean suite, and live. |
| Verification P1 | Fixed: the generated worker caches current hashed assets; offline reload and Start audio pass. |
| Verification P2, skip link | Fixed: keyboard activation moves focus to `main`. |
| Verification P2, corrupt share | Fixed: recovery gives safe compatibility guidance without parser internals. |

## Commands and results

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 61 packages installed, zero vulnerabilities. |
| `npm test` | PASS; 10 unit checks and 31 executed browser checks passed; 17 cross-project tests were intentionally skipped. |
| All 16 commands in `.factory/claims.json`, run separately | PASS; one claim test passed per command. |
| `npx tsc --noEmit` | PASS. |
| `npm run build` | PASS; `dist/` contains `index.html`. |
| `PLAYWRIGHT_BASE_URL=https://audio-graph-sketchpad.sociobot.in npm run test:e2e` | PASS; 31 executed checks passed, 17 cross-project checks skipped. |
| `npm run verify:live` | PASS; five routes, expected HTTP 404, no serious/critical Axe issue, no console error, no external request, no mobile overflow at default text size, offline reload passed. |
| Full Axe scan on five routes at desktop and phone sizes | FAIL; F-5-3 is a moderate violation on both editor routes. |
| 390-pixel touch-target audit | FAIL; F-5-2. |
| 390-pixel 200%-text audit | FAIL; F-5-1. |
| Lighthouse mobile | PASS; 100/100/100/100 and Core Web Vitals lab budgets met. |

## Missed leverage and AI check

No missing AI feature is a finding. The brief asks for deterministic audio-graph learning, A/B comparison, sharing, and code handoff. The existing code export is the useful next step; a model call would add keys, cost, disclosure, and network dependence without improving the core job.

## What would make this pass

Fix F-5-1 through F-5-3 and add regression coverage for 200% text reflow, all 44 × 44 touch targets, and Axe results at every impact level. Then rerun every claim command and the live checks against the deployed candidate.
