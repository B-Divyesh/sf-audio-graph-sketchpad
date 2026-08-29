# Adversarial first-read review 3 — Patchboard

**Verdict: FAIL**

**Reviewed:** 29 August 2026 UTC  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Repository candidate:** `54d107dab1cd317cdda924de23574a2afcdcf96d`

The product is clear on a cold phone visit, has a real isolated sample, and its visual system is product-specific. It still fails the acceptance bar because a registered claim test is nondeterministic in the complete, clean live claim run. A claim that can fail in its required command is not verified.

## 1. Cold first read

Fresh Chromium contexts, with no saved data or pre-existing service worker, opened the live root route at 390 × 844 and 1440 × 900. Assessment occurred before scrolling.

| Question | 390 px phone | Desktop |
| --- | --- | --- |
| What does this do? | Clear: it lets a visitor hear a Web Audio signal graph before writing code. | Clear. The graph workbench is also visible. |
| For whom? | Clear: “For creative coders learning how six browser audio modules affect one another.” | Clear. |
| What should I click first? | Clear: the visually dominant action is “Try it with sample data,” immediately followed by “Loads a ready-to-hear patch; nothing is saved.” | Clear. |

The first screen passed this check. The three visible facts are “Free.”, “Works offline after your first visit.”, and “Patches stay in this browser.” The first request log contained only the document, same-origin JS/CSS, and the self-hosted artwork. There were no console or page errors.

## 2. Copy audit

Counts treat hyphenated terms and `A/B` as one word. Buttons and headings are included where they carry visitor-facing copy. No audited sentence exceeds 22 words. No banned marketing adjective, metaphor heading, or non-result-naming button was found.

### Landing page

| Words | Exact copy |
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
| 3 | Audio is off. |
| 8 | Press Start audio when you are ready. |
| 6 | Select a module to inspect it. |
| 3 | No cables yet. |
| 8 | Choose “Edit cables,” then pick a source and destination. |
| 9 | Choose Edit cables, then select a source and destination. |
| 4 | Patchboard blocks feedback loops. |
| 2 | Start audio. |
| 12 | The 16-step beat position follows the same audio clock as each sound. |
| 4 | Copy A to B. |
| 11 | Change one value or cable, then switch variants while sound runs. |
| 9 | Patchboard needs no account, upload, sample library, or microphone. |
| 6 | It has no tracks or cloud projects. |
| 6 | Normal patches stay in this browser. |
| 5 | Demo changes disappear when you leave. |
| 10 | Build and hear small Web Audio graphs in your browser. |
| 9 | The link contains both A/B variants after the # character. |
| 3 | Patchboard uploads nothing. |
| 15 | Paste this function into your project, then call `startPatch()` from a user action. |
| 2 | You’re offline. |
| 8 | Cached Patchboard tools and patches remain available. |

Section headings (“Signal graph,” “How to use Patchboard,” and “Privacy and limits”) name their contents. Result-naming controls include “Start audio,” “Save in this browser,” “Copy Web Audio code,” “Start new patch,” “Reset demo,” and “Start for real.”

### README

| Words | Exact copy |
| ---: | --- |
| 13 | Patchboard helps creative coders hear a small Web Audio graph before coding it. |
| 9 | Connect six browser audio modules and hear the result. |
| 11 | Compare A/B variants, then share the patch or copy working JavaScript. |
| 7 | Patchboard is for creative coders learning Web Audio. |
| 15 | Use it to understand a small graph before adding it to a performance or app. |
| 7 | This is not recording or music-production software. |
| 13 | It has no tracks, cloud projects, account, upload, sample library, or microphone control. |
| 12 | Generates audio in the browser and starts it only after your click. |
| 13 | Blocks graph feedback loops and shows the 16-step beat position from the audio clock. |
| 6 | Stores normal patches in this browser. |
| 5 | Demo changes disappear when you leave. |
| 7 | Restores two variants from a share link. |
| 10 | Browsers do not send the part after # to the server. |
| 8 | Generates Web Audio JavaScript for the active variant. |
| 6 | Works offline after the first visit. |
| 6 | Is free and needs no account. |
| 11 | Each statement maps to a tagged browser test in `.factory/claims.json`. |
| 6 | Use Node.js 20 or newer. |
| 12 | Run `npm run test:unit` to check graph, share, demo, and code generation rules. |
| 13 | Run `npm run test:e2e` for desktop, mobile, routing, keyboard, offline, privacy, and accessibility checks. |
| 12 | Run `npm run test:claims` to execute every claim from the isolated demo. |
| 9 | Deploy the generated `dist/` directory as an Azure Static Web App. |
| 8 | Patchboard sends no patch or audio data elsewhere. |
| 10 | Normal patches stay in this browser, and demo edits disappear when you leave. |
| 9 | Read `/privacy` and `/terms` in the built app. |
| 8 | Demo details are in `.factory/demo.md`. |
| 12 | Read how the visual system and artwork were made in `.factory/design.md`. |

Every claim-like landing/README sentence maps to a registry entry. No unlisted landing or README claim was found. The README’s command sentences are documentation instructions, not product promises.

## 3. Demo and sandbox behavior

“Try it with sample data” took one click to `/?demo=1`. Its first 390 px screen already displayed the **Neon steps** sample patch, four real cable connections, selected A/B state, cutoff and delay values, the graph, and **Start audio**. The persistent “Demo — sample data, nothing is saved” banner contains **Reset demo** and **Start for real**.

The `demo-isolation` flow passed independently: save a normal patch, edit and reset the demo, leave it, and confirm the normal patch is unchanged. The source keeps demo state in memory and bypasses `patchboard.session.v1`. The `local-only` claim flow passed independently; its request log contains no cross-origin request. The separate live verifier also passed offline reload and recorded zero external requests.

## 4. Claims and tests

All 16 commands listed in `.factory/claims.json` were run individually against the live site using `PLAYWRIGHT_BASE_URL=https://audio-graph-sketchpad.sociobot.in`. Each individual command passed once. The commands were then repeated from a fresh `/tmp` clone after `npm ci`; all 16 passed. The complete command in that fresh clone also passed once. `audible-edits` additionally passed five isolated reruns.

However, an earlier required complete live command against the same checked-out source and matching deployed assets failed:

```text
PLAYWRIGHT_BASE_URL=https://audio-graph-sketchpad.sociobot.in npm run test:claims

1 failed, 15 passed
@claim:audible-edits removing a Patchboard cable changes its running audio output
Expected: < 0.2998046875
Received:   0.5068359375
```

The failing test starts the sample, removes **Filter → Delay**, waits 1600 ms, and compares the live analyser result. Its fixed ratio threshold is not stable enough to count as reliable release proof: later retries passing does not negate an observed failure. Per the claims contract, a failing registered claim test is a release blocker.

Local `npm run build` passed and generated `dist/` (36.24 kB JS raw / 12.33 kB gzip). Local `npm test` passed (9 unit tests and 48 Playwright project checks). The fresh local JS and CSS hashes match the live assets. `npm run verify:live` passed: five routes, real 404, zero serious/critical axe violations, zero console errors, zero external requests, no 390 px overflow, and offline demo reload.

## 5. Structure, routing, and identity

Verified live:

- Titles, descriptions, canonical URLs, OG/Twitter metadata, favicon, and apple touch icon are present. Route titles are `Patchboard — hear a Web Audio graph`, `Demo — Patchboard`, `Privacy — Patchboard`, `Terms — Patchboard`, and `Page not found — Patchboard`.
- Every checked route has one H1 and one main landmark. `/robots.txt` and `/sitemap.xml` return valid expected content.
- The unknown-route response is HTTP 404 and renders the designed “Page not found.” recovery page.
- Root, demo, privacy, terms, and 404 share the same linked wordmark/header/footer. Header and footer links returned 200; the sole external MDN link is visibly marked “(external).”
- Deep links render route state; Back restores root scroll position and focus to the H1; route changes update the polite live region. The skip link places focus on main.
- The dark demoscene patch-panel surface, square signal-cable visualization, hand-built module glyphs, and original `patch-spirit` art are visibly specific to synthesized audio graphs rather than a generic SaaS template.

The brief implies code handoff, not an AI action. The existing deterministic **Copy Web Audio code** action is the useful completion step. No decorative AI feature or embedded provider key was found.

## 6. Earlier-finding verification

The table confirms the live behavior and current source/test coverage, not merely the repair notes. “Fixed” means the original defect is absent. The new flaky-claim defect is separately recorded as F-3-1.

| Earlier finding(s) | Status | Confirmation |
| --- | --- | --- |
| F-1-1 | Fixed | Cold root first screen names job, audience, and sample action at 390 px and desktop. |
| F-1-2 | Fixed | Direct sample workbench, persistent banner, reset, exit, and memory-only session verified. |
| F-1-3 | Fixed | Registry has 16 one-to-one tagged entries; see F-3-1 for execution reliability. |
| F-1-4 | Fixed | Unknown live URL returns HTTP 404 and renders the styled recovery page. |
| F-1-5 | Fixed | Six visible modules and demo cable creation passed. |
| F-1-6 | Fixed | Test now removes a real Patchboard cable and measures its running analyser; its flakiness is F-3-1. |
| F-1-7 | Fixed | Product-start test spies microphone, fetch/XHR, decoder, and media play. |
| F-1-8 | Fixed | Distinct A/B share-link round trip passed. |
| F-1-9 | Fixed | Offline demo reload and Start audio passed. |
| F-1-10 | Fixed | Audio graph is built only after Start audio. |
| F-1-11 | Fixed | Cycle attempt remains rejected without changing cables. |
| F-1-12 | Fixed | 108 BPM schedule test uses product audio-clock events. |
| F-1-13 | Fixed | Precise browser/request claim replaces the old broad footer wording. |
| F-1-14 | Fixed | Dialog URL restores both variants. |
| F-1-15 | Fixed | Share-flow request check remains same-origin. |
| F-1-16 | Fixed | Product graph exposes a low-pass `BiquadFilterNode`. |
| F-1-17 | Fixed | Product cutoff/resonance controls update the active filter and response. |
| F-1-18 | Fixed | “local-first” is absent; tested browser-storage wording is used. |
| F-1-19 | Fixed | README capability copy is split and registered. |
| F-1-20 | Fixed | Explicit recording/music-production limits and absent-control test exist. |
| F-1-21 | Fixed | README gives the exact unit-test command. |
| F-1-22 | Fixed | README gives exact browser/claim commands. |
| F-1-23 | Fixed | Normal patch is saved/reloaded before demo mutation and verified after exit. |
| F-1-24 | Fixed | Navigation test proves `#patch=` is absent from the request. |
| F-1-25 | Fixed | Generated worker caches hashed shell assets; offline reload passed. |
| F-1-26 | Fixed | Active-graph JavaScript export is generated and executed in browser test. |
| F-1-27 | Fixed | First screen has free/offline/browser facts and named limits. |
| F-1-28 | Fixed | Per-route metadata and project social art are live. |
| F-1-29 | Fixed | Sitemap is XML 200 and robots links it. |
| F-1-30 | Fixed | Shared header/footer are present on all checked routes. |
| F-1-31 | Fixed | History test restores root scroll and route H1 focus. |
| F-1-32 | Fixed | MDN link names itself as external. |
| F-1-33 | Fixed | README’s former long capability sentence is split. |
| F-1-34 | Fixed | “creative coders” is used consistently. |
| F-1-35 | Fixed | Offline wording is short and test-backed. |
| F-1-36 | Fixed | Storage boundary uses “this browser.” |
| F-1-37 | Fixed | Intro label names the six-module graph. |
| F-1-38 | Fixed | How-to heading names the connect/start/compare task. |
| F-1-39 | Fixed | UI and README use “16-step beat position.” |
| F-1-40 | Fixed | Filter result precedes implementation detail. |
| F-1-41 | Fixed | Controls use result-naming verbs. |
| F-1-42 | Fixed | Legal H1s name Patchboard privacy and terms. |
| F-1-43 | Fixed | Artwork alt describes its graph-building purpose. |
| F-2-1 | Fixed | No public AI-artwork product claim remains. |
| F-2-2 | Fixed | README no longer makes a static-site architecture claim. |
| F-2-3 | Fixed | “This browser” is used for storage. |
| F-2-4 | Fixed | “developers” no longer replaces “creative coders.” |
| F-2-5 | Fixed | Decorative “Clear boundaries” label is absent. |
| F-2-6 | Fixed | Setting is named “Reduce motion.” |
| F-2-7 | Fixed | README label is “Try it with sample data.” |
| F-2-8 | Fixed | “DAW” is replaced by plain recording/music-production wording. |
| F-2-9 | Fixed | “payment gate” is replaced by “free and needs no account.” |
| F-2-10 | Fixed | README explains observable browser behavior rather than storage mechanics. |
| F-2-11 | Fixed | README explains “the part after #” rather than “fragment.” |
| F-2-12 | Fixed | README uses direct artwork wording. |
| F-2-13 | Fixed | 404 H1 is “Page not found.” |

## Findings

### F-3-1 — BLOCKING — `audible-edits` is flaky in the required complete claim run

- **Location:** `.factory/claims.json` entry `audible-edits`; `tests/e2e/claims.spec.ts:38-54`.
- **Exact claim:** “Changing a cable changes the generated audio output.”
- **Evidence:** In the clean live `npm run test:claims` run, 15 claim tests passed and this one failed: expected post-removal analyser output below `0.2998046875`; received `0.5068359375`. Five later single-test retries passed, confirming nondeterminism rather than resolving the failure.
- **Why this fails:** A visitor relies on cable edits changing what they hear. The required test command cannot reliably verify that core promise. The acceptance contract treats any failing claim test as blocking.
- **Concrete fix:** Replace the timing-sensitive maximum-of-recent-realtime-samples assertion with a deterministic product-level measurement. For example, expose the active Patchboard analyser’s RMS over a fixed post-reconnect audio-clock window, wait for the reconnect to complete, and assert a conservative measured change after removing Filter → Delay. Run the full 16-test claim command repeatedly in a clean context before release.

## What would make this perfect

Make `npm run test:claims` stable across repeated clean live and local runs by fixing F-3-1. Then rerun every individual registry command, the full claim suite, `npm test`, `npm run build`, and the cold mobile/desktop audit. With that one verification gap closed, this review would have no remaining finding.
