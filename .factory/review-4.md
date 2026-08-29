# Adversarial first-read review 4 — Patchboard

**Verdict: PASS**

**Reviewed:** 29 August 2026 UTC  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Candidate reviewed locally:** `6a88820c504202644cd510504cba0cc9b8b5eca4`

There are no findings. This review was run again from cold contexts and a fresh clone; it is not a diff-only check.

## Cold first read

Fresh Chromium contexts with no cookies, storage, or existing service worker opened `/` at 390 × 844 and 1440 × 900. No scrolling occurred before reading.

| Question | Phone | Desktop |
| --- | --- | --- |
| What does this do? | Clear: it lets a visitor hear a Web Audio graph before writing code. | Clear. |
| For whom? | Clear: it explicitly names creative coders learning how browser audio modules affect one another. | Clear. |
| What should I click first? | Clear: the dominant action is **“Try it with sample data”**, followed by **“Loads a ready-to-hear patch; nothing is saved.”** | Clear. |

The first screen uses the job H1 **“Hear a Web Audio graph before coding it”**. It contains one clear primary action, three plain facts, and no competing primary action.

## Copy audit

Counts treat hyphenated words and `A/B` as one word. This is the complete static landing and README sentence inventory; labels and buttons are audited separately below. No sentence is over 22 words. No banned marketing term, unexplained visitor-facing jargon, term drift, content-free mood heading, or non-result button was found.

### Landing page

| Words | Sentence |
| ---: | --- |
| 7 | Audio and patches stay in this browser. |
| 8 | Hear a Web Audio graph before coding it. |
| 12 | For creative coders learning how six browser audio modules affect one another. |
| 5 | Try it with sample data. |
| 7 | Loads a ready-to-hear patch; nothing is saved. |
| 3 | Build your patch. |
| 1 | Free. |
| 6 | Works offline after your first visit. |
| 5 | Patches stay in this browser. |
| 6 | Build and hear a six-module graph. |
| 8 | Connect modules, start audio, then compare one change. |
| 6 | Patchboard makes sound in this browser. |
| 6 | It uses no samples or microphone. |
| 8 | A share link can carry both A/B variants. |
| 2 | You’re offline. |
| 7 | Cached Patchboard tools and patches remain available. |
| 3 | Audio is off. |
| 7 | Press Start audio when you are ready. |
| 6 | Select a module to inspect it. |
| 3 | No cables yet. |
| 9 | Choose “Edit cables,” then pick a source and destination. |
| 9 | Choose Edit cables, then select a source and destination. |
| 4 | Patchboard blocks feedback loops. |
| 2 | Start audio. |
| 12 | The 16-step beat position follows the same audio clock as each sound. |
| 4 | Copy A to B. |
| 11 | Change one value or cable, then switch variants while sound runs. |
| 9 | Patchboard needs no account, upload, sample library, or microphone. |
| 7 | It has no tracks or cloud projects. |
| 6 | Normal patches stay in this browser. |
| 6 | Demo changes disappear when you leave. |
| 10 | Build and hear small Web Audio graphs in your browser. |
| 9 | The link contains both A/B variants after the # character. |
| 3 | Patchboard uploads nothing. |
| 13 | Paste this function into your project, then call `startPatch()` from a user action. |
| 9 | This browser low-pass filter removes sound above the cutoff. |
| 6 | Resonance emphasizes sound near the cutoff. |
| 12 | Six connected modules show the kind of audio graph you can build. |
| 11 | Patchboard needs JavaScript to synthesize and route audio in your browser. |

Dynamic graph and feedback strings use the same sentence rules. For example, **“Current graph: Oscillator to Filter; Filter to Delay; Delay to Gain; Gain to Speaker.”** is 14 words, and the listed errors/status messages in `.factory/copy-audit.md` are all 12 words or fewer. Their capability statements map to registered claims below.

### README

| Words | Sentence |
| ---: | --- |
| 13 | Patchboard helps creative coders hear a small Web Audio graph before coding it. |
| 9 | Connect six browser audio modules and hear the result. |
| 11 | Compare A/B variants, then share the patch or copy working JavaScript. |
| 8 | Patchboard is for creative coders learning Web Audio. |
| 15 | Use it to understand a small graph before adding it to a performance or app. |
| 7 | This is not recording or music-production software. |
| 13 | It has no tracks, cloud projects, account, upload, sample library, or microphone control. |
| 12 | Generates audio in the browser and starts it only after your click. |
| 14 | Blocks graph feedback loops and shows the 16-step beat position from the audio clock. |
| 6 | Stores normal patches in this browser. |
| 6 | Demo changes disappear when you leave. |
| 7 | Restores two variants from a share link. |
| 10 | Browsers do not send the part after # to the server. |
| 8 | Generates Web Audio JavaScript for the active variant. |
| 6 | Works offline after the first visit. |
| 6 | Is free and needs no account. |
| 15 | Build, hear, and export a six-module Web Audio graph before adding it to your code. |

The terms are consistent: **creative coders**, **this browser**, **sample data**, **sample patch**, **16-step beat position**, **variant**, **cable**, and **graph**. Headings name their sections, including **“Connect modules, start audio, then compare one change”** and **“Privacy and limits.”** Buttons name their results: for example **“Start audio,” “Edit cables,” “Save in this browser,” “Copy Web Audio code,” “Copy share link,”** and **“Start for real.”** No rewrite is proposed because no copy flag remains.

## Demo, sandbox, and privacy

- The first-screen sample action reaches `/?demo=1` in one click. `/demo` also opens the same isolated sample directly.
- At 390 px, the first demo screen already shows the populated **Neon steps** patch, active variant, values, four-cable route, Start audio control, patch name, graph heading, and persistent **“Demo — sample data, nothing is saved”** banner.
- The banner has **Reset demo** and **Start for real**. Reset restored A (920 Hz) and B (2600 Hz plus Noise → Filter) in the independent claim test.
- A saved normal-patch sentinel remained byte-for-byte unchanged through demo edit, reset, and exit. The demo created no `demo:` browser-storage entry and uses its in-memory session.
- The live request log contained only the Patchboard origin; live verification found zero external requests, cookies, analytics calls, or console errors. Offline demo reload remained usable after service-worker installation.

## Claims

`.factory/claims.json` contains 16 unique records. From a fresh clone at the candidate commit, `npm ci` completed, then every registered command was run individually. All passed; the final Playwright result was `{"status":"passed","failedTests":[]}`.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `six-modules` | PASS |
| `audible-edits` | PASS |
| `synthesized-audio` | PASS |
| `fragment-ab-share` | PASS |
| `fragment-private-share` | PASS |
| `offline-reload` | PASS |
| `gesture-only-audio` | PASS |
| `feedback-blocked` | PASS |
| `audio-clock-schedule` | PASS |
| `local-only` | PASS |
| `native-filter-node` | PASS |
| `resonance-output` | PASS |
| `code-export` | PASS |
| `free-use` | PASS |
| `scope-limits` | PASS |

The independent test run includes the real UI cable removal and active analyser measurement for `audible-edits`, normal-storage save/reload and demo isolation for `local-only`, request recording for privacy, and actual product filter controls for `resonance-output`. Each claim-like landing and README capability sentence has a matching registry entry. No unlisted claim remains.

## Structure, accessibility, and visual identity

- Live `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown URL returned real HTTP 404 and the designed recovery page.
- Route titles, one H1, `<main>`, language, descriptions, canonicals, OG/Twitter art, favicon, apple-touch icon, robots, and sitemap were present and route-correct. The canonical 404 is `/404.html`.
- Every discovered internal link and the labeled external Web Audio reference returned 200. Hash links point at existing page landmarks.
- Header, skip link, three-link navigation, footer, Privacy, Terms, factory credit, and build ID are consistent across all routes.
- History API navigation restores the route, H1 focus, polite announcement, and scroll position. A direct live history check restored root scroll above 600 px after Back and returned Privacy to 0 on Forward.
- `npm run verify:live` passed all five route checks: zero serious/critical axe findings, zero successful-route console errors, zero external requests, no 390 px overflow, and usable offline reload.
- The stepped dark patch panel, platform-monospace tracker typography, cyan/amber signal palette, cable graph, and original pixel-art circuit illustration match `.factory/design.md` and are distinct from a generic SaaS template.

## Earlier findings rechecked

Every prior finding was verified against both live behavior and the current source/test coverage.

| Earlier ID | Confirmation |
| --- | --- |
| F-1-1 | Job H1, named audience, and one primary sample action are present at 390 px and desktop. |
| F-1-2 | Direct demo opens a used, populated, memory-only workbench with banner, reset, and exit. |
| F-1-3 | Registry has one tagged test per listed claim; all 16 commands pass. |
| F-1-4 | Unknown live route returns HTTP 404 with a product-styled recovery page. |
| F-1-5 | Exactly six modules render and the demo can add Noise → Delay. |
| F-1-6 | Removing Filter → Delay through the UI changes the running product analyser output. |
| F-1-7 | Start-audio flow has no sample, microphone, decode, fetch, XHR, or media-play use. |
| F-1-8 | Distinct A/B variants survive a share-link round trip. |
| F-1-9 | Offline demo reload works after the first visit. |
| F-1-10 | Graph construction begins only after Start audio. |
| F-1-11 | Feedback-cycle attempts do not mutate the graph and explain the block. |
| F-1-12 | The beat position uses the product audio clock at the declared BPM spacing. |
| F-1-13 | Browser/request privacy wording is precise and request/cookie checks pass. |
| F-1-14 | The dialog and link include both variants. |
| F-1-15 | Share flow produces no upload or external request. |
| F-1-16 | The active engine exposes a low-pass `BiquadFilterNode`. |
| F-1-17 | The active cutoff/resonance controls alter the active filter response. |
| F-1-18 | Untested “local-first” wording is absent. |
| F-1-19 | Capability copy is split and claim-mapped. |
| F-1-20 | Plain product limits are visible and absent controls are tested. |
| F-1-21 | README gives the exact unit-test command. |
| F-1-22 | README gives exact browser and claims commands. |
| F-1-23 | Normal save/reload and demo isolation are both tested. |
| F-1-24 | Navigation omits the `#` patch data while restoration works. |
| F-1-25 | Hashed app shell assets cache for offline reload. |
| F-1-26 | Active values and connections export as executable Web Audio code. |
| F-1-27 | First screen has free/offline/browser facts and named limits. |
| F-1-28 | Required metadata and project social art are live. |
| F-1-29 | Sitemap is XML 200 and robots references it. |
| F-1-30 | Shared header/footer are present on each checked route. |
| F-1-31 | Deep links, Back/Forward scroll restoration, H1 focus, and route announcement work. |
| F-1-32 | The MDN link labels itself external. |
| F-1-33 | README capability copy is below 22 words. |
| F-1-34 | Audience is consistently “creative coders.” |
| F-1-35 | Offline wording is short and claim-backed. |
| F-1-36 | Visitor copy uses observable browser terms rather than implementation jargon. |
| F-1-37 | The intro label names the six-module job. |
| F-1-38 | The how-to heading names connect/start/compare work. |
| F-1-39 | “16-step beat position” is consistent in product and README. |
| F-1-40 | Filter copy starts with the audible result. |
| F-1-41 | Actions name their result. |
| F-1-42 | Legal H1s name the Patchboard page. |
| F-1-43 | Artwork alt explains its graph-building purpose. |
| F-2-1 | No public AI-artwork product claim remains. |
| F-2-2 | README has no static-site architecture boast. |
| F-2-3 | Storage boundary consistently says “this browser.” |
| F-2-4 | “Creative coders” is retained consistently. |
| F-2-5 | Decorative “Clear boundaries” is absent. |
| F-2-6 | The control is named “Reduce motion.” |
| F-2-7 | README uses “Try it with sample data.” |
| F-2-8 | Unexplained “DAW” is absent. |
| F-2-9 | “Payment gate” is absent; free/no-account wording is tested. |
| F-2-10 | README describes observable browser behavior. |
| F-2-11 | Visitor copy explains the part after `#` without “fragment.” |
| F-2-12 | Artwork wording is direct and useful. |
| F-2-13 | The 404 H1 is “Page not found.” |
| F-3-1 | The deterministic four-beat analyser measurement passed independently in the complete claim run. |
| P1 | Generated hashed assets remain available to the offline service worker. |
| P2 (skip link) | Keyboard skip moves focus to main. |
| P2 (corrupt share) | Corrupt link recovery gives compatible-session guidance without parser internals. |

## Missed leverage and AI check

No missing AI feature is found. The brief calls for hearing, inspecting, comparing, sharing, and embedding a small browser graph; the deterministic code export and A/B share link already provide the obvious handoff. Adding a model call would require a key, network disclosure, and a less reliable path without improving that job. No provider key, Azure endpoint, decorative AI feature, or runtime AI request is present.

## What would make this perfect

No product change is required by this round. Preserve the one-click isolated demo, claim-per-test discipline, route-history regression test, and browser-storage privacy boundary as future changes are made; a regression in any of those would reopen this review.
