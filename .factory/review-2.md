# Adversarial first-read review 2 — Patchboard

**Verdict: FAIL**

**Reviewed:** 29 August 2026 UTC  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Candidate:** `a612f02c3d16504346749957f25c087288bd0463`

The first read is now clear, the demo is isolated, the routes work, and the visual identity is specific to this product. The release still fails because the mobile demo does not show the seeded product in its first screen, Back loses scroll position, earlier terminology drift remains, and several passing claim tests do not exercise the behavior they claim to prove. A PASS requires zero findings and no untested claim.

The live HTML, JavaScript, and CSS hashes match a clean production build of the candidate.

## 1. Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900. Nothing was scrolled before this assessment.

| Question | Phone | Desktop |
| --- | --- | --- |
| What does this do? | Clear: it lets me hear a six-module Web Audio graph before writing it in code. | Clear. The editor controls also begin within the first viewport. |
| For whom? | Clear: “For creative coders learning how six browser audio modules affect one another.” | Clear from the same sentence. |
| What should I click first? | Clear: “Try it with sample data” is the dominant first action, followed by “Loads a ready-to-hear patch; nothing is saved.” | Clear. “Build your patch” is secondary. |

The H1 is **“Hear a Web Audio graph before coding it.”** The first-read requirement passes at both sizes. Evidence: `.factory/evidence/review-2-mobile-first-screen.png` and `.factory/evidence/review-2-desktop-first-screen.png`.

## 2. Findings, ordered by severity

### F-1-2 — BLOCKING — The one-click demo opens another introduction instead of the used product

- Location: live `/?demo=1`, 390 × 844; `src/main.ts:118-123`.
- Exact first-screen copy: **“Demo — sample data, nothing is saved”**, **“Hear a Web Audio graph before coding it”**, and a second action, **“Hear the sample patch.”**
- Evidence: after the required one click, the entire phone viewport contains the banner, repeated landing copy, facts, and artwork. The `Neon steps` patch name, graph, values, connections, and A/B state are below the fold. See `.factory/evidence/review-2-demo-mobile.png`.
- Why this fails: the first screen after clicking does not already show the product being used with realistic sample data. Requiring **“Hear the sample patch”** presents a second start action. This is a weak demo under the explicit demo contract.
- Concrete fix: make `/demo` open with the banner followed immediately by the seeded workbench. Put **“Neon steps,”** its visible connections, the active A/B variant, and **“Start audio”** in the first 844 px. Remove the repeated marketing hero and the second sample CTA from demo mode.
- Isolation status: the storage behavior itself passes. A real patch survived demo entry, edit, Reset, and exit; no `demo:` or other demo storage key was created.

### F-1-3 — BLOCKING — The claim registry exists, but several passing tests do not prove their registered claims

- Location: `.factory/claims.json`; `tests/e2e/claims.spec.ts`.
- Exact meta-claim: README says **“Each statement maps to a tagged browser test in .factory/claims.json.”**
- Evidence: all 16 commands exit 0 and every tag occurs exactly once. However, `demo-isolation` seeds normal data only after demo entry, and the tests identified in F-1-6, F-1-7, F-1-17, and F-1-23 do not assert the corresponding Patchboard outcomes. A green command is not evidence when its fixture bypasses the product or omits part of a promise.
- Why this fails: those public claims remain untested, so the one-to-one claims contract is only nominally satisfied.
- Concrete fix: repair those five tests as specified here and below. Keep one tag per claim and make each test enter through the demo, operate Patchboard, and assert the advertised observable result. For `demo-isolation`, save a valid normal patch before entering demo mode and verify it is neither read nor changed.

### F-1-6 — BLOCKING — `audible-edits` never changes a Patchboard cable

- Location: `tests/e2e/claims.spec.ts:25-35`.
- Exact claim: **“Changing a cable changes the generated audio output.”**
- Evidence: the test creates its own `OfflineAudioContext`, oscillator, and gain, then compares a disconnected fixture with a connected fixture. It never selects **“Edit cables,”** changes a Patchboard connection, reads the current patch, or invokes Patchboard’s graph builder.
- Why this fails: the test still passes if Patchboard cable editing stops affecting audio entirely. This is the same incomplete proof behind earlier F-1-6.
- Concrete fix: render two versions of the seeded Patchboard graph through the same graph-building code used by `AudioEngine`, with one real UI cable edit between them, and assert different output samples or RMS values.

### F-1-7 — BLOCKING — `synthesized-audio` does not test sample loading or microphone access

- Location: `tests/e2e/claims.spec.ts:37-44`.
- Exact claim: **“Patchboard generates audio in the browser without samples or microphone access.”**
- Evidence: the test checks for visible `audio`, `video`, and file-input elements, then records only cross-origin requests after the page has loaded. It does not intercept `getUserMedia`, same-origin audio requests, `fetch`, XHR, or media decoding.
- Why this fails: an implementation could request the microphone or fetch a same-origin sample and still pass. This is a half-fixed recurrence of F-1-7.
- Concrete fix: install spies before loading the demo for `navigator.mediaDevices.getUserMedia`, `fetch`, XHR, and media decode/play APIs; record all requests by method and resource type; start Patchboard; assert no microphone call and no audio/sample request while confirming its generated audio graph starts.

### F-1-17 — BLOCKING — `resonance-output` tests an unrelated filter instead of the product control

- Location: `tests/e2e/claims.spec.ts:119-125`.
- Exact claim: **“Resonance emphasizes sound near the cutoff.”**
- Evidence: the test constructs a new oscillator and filter with hard-coded Q values. It never changes Patchboard’s **“Resonance”** control or confirms that the active Patchboard filter receives that value.
- Why this fails: the browser’s generic filter can pass while Patchboard’s resonance control is disconnected. The earlier finding is only half-fixed.
- Concrete fix: change the demo’s Resonance input, render or inspect the actual Patchboard graph through shared production code, and compare the active filter/output before and after the UI change.

### F-1-23 — BLOCKING — `local-only` never verifies that normal patches use browser storage

- Location: `tests/e2e/claims.spec.ts:102-107`.
- Exact claim: **“Normal patches use browser storage, demo uses memory, and editing sends no data elsewhere.”**
- Evidence: the test starts in demo mode, writes a sentinel directly to `patchboard.session.v1`, and confirms demo actions do not replace it. It never opens normal mode, saves a normal patch, reloads it, or checks other storage mechanisms.
- Why this fails: the normal-storage clause can regress while the test remains green. The test also does not prove the broad phrase “uses memory” beyond one local-storage key. This reopens F-1-23.
- Concrete fix: create and save a named patch in normal mode, reload and verify it, enter demo with that valid sentinel already present, mutate and leave the demo, then verify the normal patch is unchanged and the demo mutation cannot be restored from localStorage, sessionStorage, IndexedDB, or Cache Storage.

### F-1-31 — BLOCKING — Back restores the route and focus but loses the prior scroll position

- Location: live `/` → `/privacy` → Back; `src/main.ts:74-91`.
- Evidence: the root was at `scrollY = 634` before opening Privacy. After Back and a settled animation frame it returned at `scrollY = 88`. The code calls `window.scrollTo({top: 0})` for every route change and stores no scroll position in history state.
- Why this fails: Back does not restore the place the visitor left. The route/focus portion of earlier F-1-31 is fixed, but its scroll-history requirement is not; the required history regression is therefore blocking again under the review instructions.
- Concrete fix: save each history entry’s scroll position before `pushState`, scroll new forward navigations to the top, and restore the saved position on `popstate`. Focus the H1 with `{preventScroll: true}` so focus does not overwrite the restored position. Add Back and Forward assertions for URL, H1 focus, and scroll position.

### F-1-39 — BLOCKING — The timing display still has two names

- Location: live editor and README line 20.
- Exact copy: live uses **“16-step beat position”**; README says **“16-step position from the audio clock.”**
- Why this fails: earlier F-1-39 required **“16-step beat position”** everywhere. Omitting “beat” reintroduces terminology drift, so that earlier finding is not fully fixed.
- Concrete fix: rewrite the README bullet as **“Blocks graph feedback loops and shows the 16-step beat position from the audio clock.”**

### F-2-1 — Major — The public artwork claim is absent from the claim registry

- Location: landing footer.
- Exact quote: **“Original AI-generated pixel artwork.”**
- Why this fails: it is a public provenance claim with no `.factory/claims.json` entry. It also gives the visitor no information needed to use Patchboard.
- Concrete fix: remove this sentence from the public footer and keep provenance in `.factory/design.md`. If it must remain public, add a static provenance check tied to the shipped source asset and generation record.

### F-2-2 — Major — The README’s static-site claim is unlisted

- Location: README line 46.
- Exact quote: **“The product remains a static site.”**
- Why this fails: a deployer can rely on this architectural claim, but it has no claim entry.
- Concrete fix: delete the second sentence and keep the actionable instruction **“Deploy the generated `dist/` directory as an Azure Static Web App.”** Alternatively, register and test a `static-build` claim that proves the built artifact has no server dependency.

### F-2-3 — Minor — Storage uses “device” and “browser” for the same concept

- Location: landing first-screen label and facts/footer.
- Exact copy: **“Browser audio / saved on this device”** versus **“Patches stay in this browser”** and **“Normal patches use this browser’s local storage.”**
- Why this fails: “device” could imply other browsers or profiles on the phone, which is broader than the actual storage boundary.
- Concrete fix: remove the redundant label, or rewrite it as **“Audio and patches stay in this browser.”**

### F-2-4 — Minor — The audience changes from “creative coders” to “developers”

- Location: landing audience line; README line 13.
- Exact copy: **“For creative coders…”** versus **“Patchboard is for developers learning Web Audio.”**
- Why this fails: the same audience has two names, weakening the clear positioning established on the first screen.
- Concrete fix: use **“creative coders”** in both places: **“Patchboard is for creative coders learning Web Audio.”**

### F-2-5 — Minor — “Clear boundaries” is a decorative mood label

- Location: landing, immediately above **“Privacy and limits.”**
- Exact quote: **“Clear boundaries.”**
- Why this fails: it does not name new content and could appear on an unrelated product. The following heading already names the section.
- Concrete fix: delete the label.

### F-2-6 — Minor — “Calm motion” does not name the setting’s result

- Location: editor checkbox.
- Exact quote: **“Calm motion.”**
- Why this fails: “calm” is subjective and does not say whether motion is reduced or disabled.
- Concrete fix: rename it **“Reduce motion.”**

### F-2-7 — Minor — The README demo link uses a different, technical name

- Location: README line 9.
- Exact quote: **“Try the isolated sample.”** The product CTA says **“Try it with sample data.”**
- Why this fails: “isolated” describes implementation, and the same action has two labels.
- Concrete fix: use **“Try it with sample data:”** followed by the demo URL.

### F-2-8 — Minor — “DAW” is unexplained jargon

- Location: README line 15.
- Exact quote: **“This is not a DAW.”**
- Why this fails: a reader learning browser audio may not know the acronym.
- Concrete fix: write **“This is not recording or music-production software.”**

### F-2-9 — Minor — “Payment gate” is internal product jargon

- Location: README line 25.
- Exact quote: **“Is free to use without an account or payment gate.”**
- Why this fails: “payment gate” describes an implementation pattern rather than the user’s result.
- Concrete fix: write **“Is free and needs no account.”**

### F-2-10 — Minor — Storage copy exposes implementation terms

- Location: README line 21.
- Exact copy: **“Stores normal patches in browser local storage. The demo uses memory only.”**
- Why this fails: “local storage” and “uses memory” are implementation terms, while the landing already states the user-visible result plainly.
- Concrete fix: write **“Stores normal patches in this browser. Demo changes disappear when you leave.”**

### F-2-11 — Minor — “Fragment” is unexplained URL jargon

- Location: README line 22.
- Exact quote: **“Restores two variants from a share link without sending its fragment to the server.”**
- Why this fails: the useful fact is what the browser sends, not the term “fragment.”
- Concrete fix: write **“Restores two variants from a share link. Browsers do not send the part after `#` to the server.”**

### F-2-12 — Minor — “Generated-art provenance” is documentation jargon

- Location: README line 54.
- Exact quote: **“The visual system and generated-art provenance are in .factory/design.md.”**
- Why this fails: “provenance” is less direct than saying what the document contains.
- Concrete fix: write **“Read how the visual system and artwork were made in `.factory/design.md`.”**

### F-2-13 — Minor — The 404 H1 is an audio metaphor

- Location: live unknown routes and `/404.html`.
- Exact quote: **“This page is not connected.”**
- Why this fails: it can mean a network failure and does not plainly name the error when headings are read alone.
- Concrete fix: use H1 **“Page not found.”** Keep the product-specific art and supporting copy for visual identity.

## 3. Copy audit

Counting treats hyphenated terms, slash forms such as A/B, and URLs as one word. Standalone symbols are not words. The landing inventory covers the cold rendered page plus authored offline, empty, dialog, image-alt, and no-script sentences reachable from it. Dynamic sentences containing user-entered values were checked separately and introduce no additional long or banned-word finding.

### Landing-page sentences

| # | Words | Exact sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 12 | For creative coders learning how six browser audio modules affect one another. | — |
| 2 | 7 | Loads a ready-to-hear patch; nothing is saved. | — |
| 3 | 1 | Free. | — |
| 4 | 6 | Works offline after your first visit. | — |
| 5 | 5 | Patches stay in this browser. | F-2-3 terminology |
| 6 | 6 | Patchboard makes sound in this browser. | — |
| 7 | 6 | It uses no samples or microphone. | F-1-7 proof |
| 8 | 8 | A share link can carry both A/B variants. | — |
| 9 | 3 | Audio is off. | — |
| 10 | 7 | Press Start audio when you are ready. | — |
| 11 | 7 | Select a module to inspect it. | — |
| 12 | 14 | Current graph: Oscillator to Filter; Filter to Delay; Delay to Gain; Gain to Speaker. | — |
| 13 | 9 | This browser low-pass filter removes sound above the cutoff. | — |
| 14 | 6 | Resonance emphasizes sound near the cutoff. | F-1-17 proof |
| 15 | 9 | Choose Edit cables, then select a source and destination. | — |
| 16 | 4 | Patchboard blocks feedback loops. | — |
| 17 | 2 | Start audio. | — |
| 18 | 12 | The 16-step beat position follows the same audio clock as each sound. | — |
| 19 | 4 | Copy A to B. | — |
| 20 | 11 | Change one value or cable, then switch variants while sound runs. | — |
| 21 | 9 | Patchboard needs no account, upload, sample library, or microphone. | — |
| 22 | 7 | It has no tracks or cloud projects. | — |
| 23 | 7 | Normal patches use this browser’s local storage. | F-1-23 proof; F-2-10 jargon |
| 24 | 8 | Demo changes stay only in the open tab. | — |
| 25 | 10 | Build and hear small Web Audio graphs in your browser. | — |
| 26 | 4 | Original AI-generated pixel artwork. | F-2-1; F-2-12 wording class |
| 27 | 2 | You’re offline. | — |
| 28 | 7 | Cached Patchboard tools and patches remain available. | — |
| 29 | 3 | No cables yet. | — |
| 30 | 9 | Choose “Edit cables,” then pick a source and destination. | — |
| 31 | 9 | The link contains both A/B variants after the # character. | — |
| 32 | 3 | Patchboard uploads nothing. | — |
| 33 | 13 | Paste this function into your project, then call startPatch() from a user action. | — |
| 34 | 12 | Six connected modules show the kind of audio graph you can build. | — |
| 35 | 11 | Patchboard needs JavaScript to synthesize and route audio in your browser. | — |

No landing sentence exceeds 22 words. No banned marketing adjective appears.

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Browser audio / saved on this device | 6 | F-2-3; inconsistent storage boundary |
| Hear a Web Audio graph before coding it | 8 | Pass; job-naming H1 |
| Try it with sample data | 5 | Pass; result-naming action |
| Build your patch | 3 | Pass; result-naming action |
| Build and hear a six-module graph | 6 | Pass |
| Connect modules, start audio, then compare one change | 8 | Pass |
| Save in this browser / Share patch / Copy Web Audio code / Start new patch | 4 / 2 / 4 / 3 | Pass; result-naming actions |
| Start audio / Hear A / Hear B / Copy A → B / Edit cables | 2 / 2 / 2 / 3 / 2 | Pass; result-naming actions |
| Signal graph / How to use Patchboard / Privacy and limits | 2 / 4 / 3 | Pass; section-naming headings |
| Calm motion | 2 | F-2-6; vague setting label |
| Clear boundaries | 2 | F-2-5; decorative label |
| Share this audio graph / Web Audio code for variant A | 4 / 6 | Pass; dialog headings |
| Copy share link / Close share dialog / Copy JavaScript / Close code dialog | 3 / 3 / 2 / 3 | Pass; result-naming actions |
| Remove cable from [source] to [destination] | 6 | Pass; accessible action name |

The demo-only actions **“Hear the sample patch,” “Reset demo,”** and **“Start for real”** use verbs, but F-1-2 fails the placement and one-click outcome rather than their grammar.

### README sentences

| # | Words | Exact sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 13 | Patchboard helps creative coders hear a small Web Audio graph before coding it. | — |
| 2 | 9 | Connect six browser audio modules and hear the result. | — |
| 3 | 11 | Compare A/B variants, then share the patch or copy working JavaScript. | — |
| 4 | 7 | Patchboard is for developers learning Web Audio. | F-2-4 terminology |
| 5 | 15 | Use it to understand a small graph before adding it to a performance or app. | — |
| 6 | 5 | This is not a DAW. | F-2-8 jargon |
| 7 | 13 | It has no tracks, cloud projects, account, upload, sample library, or microphone control. | — |
| 8 | 12 | Generates audio in the browser and starts it only after your click. | — |
| 9 | 13 | Blocks graph feedback loops and shows a 16-step position from the audio clock. | F-1-39 terminology |
| 10 | 7 | Stores normal patches in browser local storage. | F-1-23 proof; F-2-10 jargon |
| 11 | 5 | The demo uses memory only. | F-2-10 jargon |
| 12 | 14 | Restores two variants from a share link without sending its fragment to the server. | F-2-11 jargon |
| 13 | 8 | Generates Web Audio JavaScript for the active variant. | — |
| 14 | 6 | Works offline after the first visit. | — |
| 15 | 10 | Is free to use without an account or payment gate. | F-2-9 jargon |
| 16 | 10 | Each statement maps to a tagged browser test in .factory/claims.json. | F-1-3 |
| 17 | 5 | Use Node.js 20 or newer. | — |
| 18 | 13 | Run npm run test:unit to check graph, share, demo, and code generation rules. | — |
| 19 | 14 | Run npm run test:e2e for desktop, mobile, routing, keyboard, offline, privacy, and accessibility checks. | — |
| 20 | 12 | Run npm run test:claims to execute every claim from the isolated demo. | F-1-3 |
| 21 | 11 | Deploy the generated dist/ directory as an Azure Static Web App. | Necessary deployment instruction |
| 22 | 6 | The product remains a static site. | F-2-2 unlisted claim |
| 23 | 8 | Patchboard sends no patch or audio data elsewhere. | F-1-7/F-1-23 proof |
| 24 | 13 | Normal patches stay in this browser, and demo edits disappear when you leave. | F-1-23 proof |
| 25 | 8 | Read /privacy and /terms in the built app. | — |
| 26 | 5 | Demo details are in .factory/demo.md. | — |
| 27 | 9 | The visual system and generated-art provenance are in .factory/design.md. | F-2-12 jargon |
| 28 | 1 | MIT. | — |
| 29 | 2 | See LICENSE. | — |

No README sentence exceeds 22 words. No banned marketing adjective appears. README headings — **“Patchboard,” “Who it is for,” “What it does,” “Run and verify,” “Privacy,”** and **“License”** — make sense out of context. The standalone demo link label **“Try the isolated sample”** is F-2-7. Code-block commands are not sentences.

### Terminology table

| Concept | Current terms | Required term |
| --- | --- | --- |
| Intended user | creative coder; developer | creative coder |
| Browser storage boundary | device; browser; browser local storage | browser |
| Demo entry | sample data; isolated sample; sample patch | sample data for the entry action; sample patch for the loaded object |
| Timing display | 16-step beat position; 16-step position | 16-step beat position |
| Alternate sound | variant A / variant B | variant |
| One connection / full topology | cable / graph | Keep both; they name different things |

## 4. Demo, sandbox, privacy, and offline evidence

| Check | Result |
| --- | --- |
| One-click entry | The landing CTA opens `/?demo=1` in one click. |
| First screen shows used product | **BLOCKING FAIL — F-1-2.** The seeded editor is below the mobile fold. |
| Sample quality | PASS once scrolled: “Neon steps”; variant B adds Noise → Filter and changes filter/delay values. |
| Persistent banner | PASS: “Demo — sample data, nothing is saved,” Reset demo, Start for real. |
| Reset | PASS: an edited name and cutoff returned to “Neon steps” and 920 Hz. |
| Real-data isolation | PASS in an independent live flow: a valid normal patch remained byte-for-byte unchanged through demo entry, edits, reset, and exit. |
| Demo persistence | PASS in code and live behavior: demo state is a JavaScript object; no demo storage key was created. |
| Request log | PASS: root → demo → edit → reset → exit produced only same-origin HTML, JS, CSS, and artwork requests. |
| Offline | PASS: `npm run verify:live` completed an offline demo reload with an enabled Start audio action. |

The privacy behavior is currently sound. The finding is that its registered automated proof is incomplete.

## 5. Claim-command results from a clean clone

Clean clone: `/tmp/patchboard-review2-X68QbY/clone` at `a612f02`. Every command was run separately.

| Claim ID | Command result | Proof assessment |
| --- | --- | --- |
| demo-isolation | PASS | Product passes independent live check; registered test does not seed normal data before demo entry. Covered by F-1-3. |
| six-modules | PASS | Adequate outcome test. |
| audible-edits | PASS | **Invalid proof; F-1-6.** |
| synthesized-audio | PASS | **Incomplete proof; F-1-7.** |
| fragment-ab-share | PASS | Adequate round-trip test. |
| fragment-private-share | PASS | Adequate navigation-request test. |
| offline-reload | PASS | Adequate cache, reload, and use test. |
| gesture-only-audio | PASS | Adequate explicit-start test, supported by source inspection. |
| feedback-blocked | PASS | Adequate graph-mutation rejection test. |
| audio-clock-schedule | PASS | Adequate product scheduling-event test. |
| local-only | PASS | **Incomplete compound-claim proof; F-1-23.** |
| native-filter-node | PASS | Adequate product graph-node test. |
| resonance-output | PASS | **Invalid product proof; F-1-17.** |
| code-export | PASS | Adequate generated-code execution test. |
| free-use | PASS | Adequate no-login/payment-gate smoke test. |
| scope-limits | PASS | Adequate control/scope inspection. |

Unlisted public claims are F-2-1 and F-2-2. No other landing/README product promise lacks a registry entry; several listed promises remain untested because of the test defects above.

## 6. Earlier-finding verification

Every item in `.factory/review-1.md`, `.factory/polish-1.md`, and the earlier handoff was checked against both the live site and current source. “Reopened” means the earlier closure is incomplete and is blocking again under this review’s instructions.

| Earlier ID | Result | Fresh evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Job H1, audience, and primary sample action are visible at 390 px and desktop. |
| F-1-2 | **Reopened** | Isolation works, but the first demo viewport is not the used product. |
| F-1-3 | **Reopened** | Registry/tags exist and commands pass; five tests do not prove their claims. |
| F-1-4 | Fixed | Random live URL returns HTTP 404 and the styled page; hosting config uses `responseOverrides`. |
| F-1-5 | Fixed | Six modules render; Noise → Delay can be connected in demo. |
| F-1-6 | **Reopened** | Test bypasses Patchboard and changes a fixture connection only. |
| F-1-7 | **Reopened** | Test does not intercept microphone or same-origin sample access. |
| F-1-8 | Fixed | Distinct A/B values survive a share-link round trip. |
| F-1-9 | Fixed | Live offline demo reload succeeds. |
| F-1-10 | Fixed | Audio graph starts only after Start audio. |
| F-1-11 | Fixed | Cycle attempt leaves cable count unchanged and announces the feedback error. |
| F-1-12 | Fixed | Product schedule events use audio-clock timestamps at the expected BPM interval. |
| F-1-13 | Fixed | Old broad footer sentence is gone; full live request flow was same-origin. |
| F-1-14 | Fixed | Share dialog and test restore both variants. |
| F-1-15 | Fixed | Share flow generated no external request. |
| F-1-16 | Fixed | Product event reports a low-pass `BiquadFilterNode`. |
| F-1-17 | **Reopened** | Resonance test uses an unrelated hard-coded filter. |
| F-1-18 | Fixed | “local-first” is absent from landing and README. |
| F-1-19 | Fixed | The former 33-word README sentence is split and under the cap. |
| F-1-20 | Fixed | Limits are explicit and `scope-limits` checks absent controls. |
| F-1-21 | Fixed | README gives an exact unit-test command. |
| F-1-22 | Fixed | README gives an exact end-to-end command; clean suite passes. |
| F-1-23 | **Reopened** | `local-only` never saves/reloads a normal-mode patch. |
| F-1-24 | Fixed | Navigation request omits the fragment while the patch restores. |
| F-1-25 | Fixed | Generated worker caches hashed assets; live offline reload passes. |
| F-1-26 | Fixed | Copy Web Audio code exports and executes active graph values/connections. |
| F-1-27 | Fixed | Three facts and Privacy and limits are present. |
| F-1-28 | Fixed | Route-specific title/description/canonical/OG plus icons are live. |
| F-1-29 | Fixed | `/sitemap.xml` returns XML 200 and robots points to it. |
| F-1-30 | Fixed | Header/footer are shared across `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| F-1-31 | **Reopened** | H1 focus works, but Back changes scrollY from 634 to 88. |
| F-1-32 | Fixed | Footer says “Web Audio reference (external).” |
| F-1-33 | Fixed | README capability copy is split; no sentence exceeds 22 words. |
| F-1-34 | Fixed for length | Audience sentence is short; new terminology issue is F-2-4. |
| F-1-35 | Fixed | Offline sentence is six words and its behavior passes live. |
| F-1-36 | Fixed for original terms | “native” and “local-first” are absent; new device/browser drift is F-2-3. |
| F-1-37 | Fixed | Intro label names the six-module graph. |
| F-1-38 | Fixed | H2 names connect/start/compare actions without pronouns. |
| F-1-39 | **Reopened** | README again omits “beat” from the display name. |
| F-1-40 | Fixed | Inspector explains the audible filter result before implementation detail. |
| F-1-41 | Fixed | Action labels name their results, including dialog-close controls. |
| F-1-42 | Fixed | Legal H1s name Patchboard privacy and terms. |
| F-1-43 | Fixed | Artwork alt explains what the six modules demonstrate. |

Earlier independent-verification regressions also remain fixed: the offline shell renders, the skip link focuses `main`, and malformed share data shows safe recovery text rather than parser internals.

## 7. Structure, links, accessibility, and identity

| Check | Result |
| --- | --- |
| Titles | PASS: root **“Patchboard — hear a Web Audio graph”**; Demo/Privacy/Terms and 404 use route-specific patterns. |
| One H1/main | PASS on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`. |
| Metadata | PASS: descriptions, canonical, OG/Twitter image metadata, SVG favicon, and apple-touch icon are present and route-correct after render. |
| 404 routing | PASS behavior: unknown URL returns HTTP 404 and recovery link. Copy fails F-2-13. |
| Deep links | PASS: `/demo`, `/privacy`, and `/terms` return 200 and render directly. |
| Back/Forward | Route and H1 focus pass after the animation frame; scroll restoration fails F-1-31. |
| Dead-link crawl | PASS: every discovered internal link and the labeled MDN external link returned 200. |
| Header/footer | PASS on all tested routes. |
| Sitemap/robots | PASS. |
| Accessibility | PASS for zero serious/critical axe findings, one H1, landmarks, alt, keyboard skip, visible focus, reduced motion, and 390 px width. |
| Console | PASS: zero unexpected console/page errors on successful routes. |
| Visual identity | PASS: the stepped dark patch panel, cyan/amber signal palette, pixel art, scan texture, module geometry, and cable motion are product-specific, not a generic SaaS template. |

## 8. Quality gates and artifact identity

| Check | Result |
| --- | --- |
| `npm ci` in clean clone | PASS; 0 vulnerabilities |
| All 16 listed claim commands | 16/16 exit 0; proof defects remain above |
| `npm test` in clean clone | PASS; 9 unit/structure and 31 browser tests, 17 expected project skips |
| `npm run build` | PASS; `dist/` produced |
| JS payload | 34.56 KB raw / 11.86 KB gzip |
| CSS payload | 15.53 KB raw / 4.27 KB gzip |
| `npm run verify:live` | PASS summary: five routes, HTTP 404, axe 0 serious/critical, console 0, external requests 0, no mobile overflow, offline reload true |
| Candidate/live identity | PASS: SHA-256 matches for `index.html`, `index-B8E4KbJu.js`, and `index-c05sy8SN.css` |

## 9. Missed leverage and AI check

No additional AI feature is justified. The graph-to-code transformation is deterministic and already present. Share links provide import/export of both variants, so account sync would conflict with the local, no-account brief rather than fill an obvious gap. No runtime AI endpoint, embedded provider key, Azure key, analytics script, or third-party font/script appears in source or the live request log.

## What would make this perfect

Make the demo route show the seeded editor in its first phone viewport; replace the five defective claim tests with tests that operate Patchboard itself; restore scroll on Back/Forward; use **“16-step beat position”** everywhere; remove the two unlisted claims; and apply every plain-word rewrite above. Then rerun all claim commands, the complete suite, the live crawl, demo storage/request audit, and this full review from fresh contexts. The acceptance standard is zero findings, including minor copy findings.
