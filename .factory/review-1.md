# Adversarial first-read review 1 — Patchboard

**Verdict: FAIL**  
**Reviewed:** 28 August 2026 UTC  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Candidate:** `395c48bdfb261ff11baada6cb7e29288629842f5`

Patchboard has a working, distinctive audio editor, but it does not meet the first-read, demo, claims, or routing contracts. Four findings are blocking. There are also unlisted claims, incomplete site structure, and copy defects. A PASS requires zero findings and no untested claim.

## Cold first read

Fresh Chromium contexts were opened without stored data or an active service worker at 390 × 844 and 1440 × 900. The page was assessed before scrolling.

| Question | 390 px phone | Desktop |
| --- | --- | --- |
| What does this do? | Partly clear: “Wire six browser-native modules” and “Hear what every cable changes” suggest an audible browser audio graph. | Clearer because part of the graph is visible: it is an audio-module patch editor. |
| For whom? | **Cannot answer.** “before the graph enters your code” only implies a programmer. It never names creative coders or people learning Web Audio. | **Cannot answer.** The same copy is present. |
| What should I click first? | **Cannot answer.** “Save locally,” “Share patch,” and “New patch” appear before “Start audio.” There is no sample-data action. | **Cannot answer confidently.** Four actions compete and none says it starts a safe sample. |

Exact first-screen text that failed: the H1 is only **“Patchboard”**; the audience line is **“Wire six browser-native modules. Hear what every cable changes before the graph enters your code.”**; the first actions are **“Save locally,” “Share patch,” “New patch,”** and **“Start audio.”** The required **“Try it with sample data”** action is absent.

## Findings, ordered by severity

### F-1-1 — BLOCKING — The first screen does not name the audience or one first action

- Location: live `/`, phone and desktop; `src/main.ts:110-133`.
- Exact text: **“Patchboard”**, **“Wire six browser-native modules. Hear what every cable changes before the graph enters your code.”**
- Why this fails: the H1 is a product name, not the job. The sentence does not explicitly say “creative coders learning Web Audio.” Four actions compete before the visitor understands whether data already exists or whether starting audio is safe.
- Concrete fix: use H1 **“Hear a Web Audio graph before coding it”**; follow with **“For creative coders learning how six browser audio modules affect one another.”** Make **“Try it with sample data”** the primary action and add **“Loads a ready-to-hear patch; nothing is saved.”** Place the real first step beside it.

### F-1-2 — BLOCKING — There is no demo, and `/demo` reads and writes real storage

- Location: live `/` and `/demo`; `src/main.ts:14,34-40,69-99,387-390`.
- Evidence: no sample-data action exists. Direct `/demo` returns the normal app with title **“Patchboard — hear your Web Audio graph.”** It has no **“Demo — sample data, nothing is saved”** banner, **“Reset demo,”** or **“Start for real.”**
- Isolation test: a real patch named `REAL DATA` was saved under `patchboard.session.v1`; `/demo` loaded it. Renaming the patch to `DEMO EDIT` on `/demo` overwrote that same key. The source has one unconditional `STORAGE_KEY` and treats every path except `/privacy` and `/terms` as the real app.
- Why this fails: a visitor cannot try the product in one click, and the nominal demo URL can alter real local data.
- Concrete fix: add the first-screen demo action and a real `/demo` route seeded with a realistic A/B patch. Use a separate `demo:` namespace or memory only. Add the persistent banner and both required actions. Reset must restore the sample. Leaving demo must discard it. Document this in `.factory/demo.md` and test that a real-data sentinel is unchanged.

### F-1-3 — BLOCKING — The mandatory claim registry and claim tests do not exist

- Location: `.factory/claims.json` is absent; no `@claim:` tag exists anywhere in the repository.
- Evidence: there were zero listed claim commands to run. In a clean clone at the candidate commit, `npm test` passed 5 unit and 10 Playwright checks, and `npm run build` passed. Those tests are not claim-tagged and do not provide the required one-to-one claim registry.
- Why this fails: the landing page and README make functionality, privacy, and offline claims that cannot be traced to mandatory sandbox tests. A passing general suite is not a substitute.
- Concrete fix: create `.factory/claims.json`. Give every retained claim exactly one tagged test that enters through the isolated demo. Split compound claims or remove them. The tests must assert outcomes, not control presence.

### F-1-4 — BLOCKING — Unknown routes render the product as HTTP 200 instead of a designed 404

- Location: live `/definitely-missing-review-1` and `/404.html`; `public/staticwebapp.config.json:2-15`; `scripts/postbuild.mjs:4-7`.
- Evidence: both unknown URLs return `200 text/html` and render the normal Patchboard H1. There is no 404 source or build artifact and no `responseOverrides.404` configuration.
- Why this fails: a mistyped or stale URL falsely looks valid. This is broken routing under the site-structure contract.
- Concrete fix: build a product-styled `404.html` with a plain heading and home link. Configure `responseOverrides: {"404":{"rewrite":"/404.html"}}` without combining rewrite and status code in a route entry. Verify an unknown path returns and renders the intended 404 behavior.

### Unlisted claim findings

Each sentence below is claim-like and has no `.factory/claims.json` entry. Retaining it requires the listed observable demo test; otherwise remove or narrow it.

| ID | Severity | Exact quote and location | Concrete fix |
| --- | --- | --- | --- |
| F-1-5 | Major | **“Wire six browser-native modules.”** — landing header | Add `six-modules`; assert the seeded demo exposes and can connect exactly six supported modules. |
| F-1-6 | Major | **“Hear what every cable changes before the graph enters your code.”** — landing header | Add `audible-edits`; compare rendered audio output before and after one seeded cable change. |
| F-1-7 | Major | **“Every pulse is synthesized here—no samples, uploads, or microphone.”** — landing intro | Split the sentence. Test locally generated audio, absence of audio-file/microphone use, and the full request log. |
| F-1-8 | Major | **“The URL can carry both A and B versions.”** — landing intro | Add `fragment-ab-share`; create distinct A/B variants, open the generated URL in a clean context, and compare both variants. |
| F-1-9 | Major | **“The synth and saved patches still work.”** — offline banner | Add `offline-reload`; seed demo data, install the worker, go offline, reload, play, and inspect the same demo patch. |
| F-1-10 | Major | **“Audio starts only when you press Start audio.”** — initial status | Add `gesture-only-audio`; assert no running audio context before the click and a running context after it. |
| F-1-11 | Major | **“Feedback loops are blocked.”** — How to use | Add `feedback-blocked`; attempt a cycle and assert the graph remains unchanged with a useful error. |
| F-1-12 | Major | **“The 16-step lamp is scheduled by the same clock as every pulse.”** — How to use | Add `audio-clock-schedule`; instrument the scheduler and assert lamp steps derive from the same audio-clock schedule. |
| F-1-13 | Major | **“Sound and patches stay on this device.”** — footer | Add `local-only`; record all demo requests and storage writes through edit, play, save, reset, and share. |
| F-1-14 | Major | **“Both A and B variants are encoded in the URL.”** — share dialog | Cover this location with `fragment-ab-share` and assert decoded values, not only `#patch=` presence. |
| F-1-15 | Major | **“Nothing is uploaded.”** — share dialog | Cover this location with `local-only`; assert no non-origin request during the complete share flow. |
| F-1-16 | Major | **“A low-pass BiquadFilterNode.”** — initial Filter inspector | Add `native-filter-node`; inspect the engine graph or a controlled audio fixture to prove the node type. |
| F-1-17 | Major | **“Raise resonance to make the cutoff frequency easier to hear.”** — initial Filter inspector | Add `resonance-output`; use an offline audio fixture to show the stated output change, or rewrite as a neutral control instruction. |
| F-1-18 | Major | **“Patchboard is a local-first Web Audio sketchpad for creative coders.”** — README line 3 | Map “local-first” to the `local-only` and `offline-reload` entries, or replace it with narrower tested facts. |
| F-1-19 | Major | **“Wire six native browser audio modules, hear an audio-clock BPM probe, inspect live parameters, compare A/B variants, and share the complete patch in a URL fragment—without samples, accounts, uploads, or microphone access.”** — README line 3 | Split it and map each retained capability/privacy statement to `six-modules`, `audible-edits`, `fragment-ab-share`, and `local-only`. |
| F-1-20 | Major | **“It is intentionally not a DAW: there are no tracks, cloud projects, or sample libraries.”** — README line 9 | Add a negative-scope test/inspection entry or rewrite this as a clearly labeled product limitation backed by the brief. |
| F-1-21 | Major | **“Unit tests cover graph and share encoding rules.”** — README line 23 | Rewrite to an instruction: **“Run `npm test` to check graph and share encoding rules.”** This avoids a freestanding coverage claim. |
| F-1-22 | Major | **“Playwright runs desktop and 390px mobile workflows, keyboard recovery paths, an actual offline reload after service-worker installation, and an axe accessibility scan.”** — README line 23 | Replace with the exact test commands and outputs, or add traceable claim tags for the named behavior. |
| F-1-23 | Major | **“Patch data is saved only in browser local storage.”** — README line 27 | Cover it with `local-only`; assert the storage namespace and request log in demo and real modes. |
| F-1-24 | Major | **“Share links encode data after `#`, which browsers do not send to the server.”** — README line 27 | Add `fragment-private-share`; capture the navigation request and assert the fragment is absent while decoded patch data remains correct. |
| F-1-25 | Major | **“After one successful online visit, a service worker caches the generated app shell—including the fingerprinted JavaScript and CSS—so an offline reload remains usable.”** — README line 27 | Add `offline-reload`; assert the hashed assets are cached and the demo remains usable after an offline reload. |

### F-1-26 — Major — The implied handoff to code is missing

- Location: brief user/job statement; live editor and footer.
- Exact context: the product is for coders inspecting a graph **“before the graph enters your code,”** but the only export is a Patchboard share URL.
- Why this matters: after finding a useful graph, the obvious next job is to recreate it in a performance or toy. Manually translating every node, parameter, and cable loses the value of the sketch.
- Concrete fix: add **“Copy Web Audio code”** for the active variant. Generate readable JavaScript that creates the chosen native nodes, applies current values, connects the graph, and includes an explicit start function. Add a claim entry and execute the exported snippet in a fresh fixture. AI is not needed for this deterministic transformation.

### F-1-27 — Major — The landing skeleton omits explicit limitations/privacy and price facts

- Location: live `/` first screen and lower page.
- Evidence: the first screen has no three short facts. “local-first” and a compound no-samples sentence are not substitutes. There is no named limitations/privacy section and the landing page never says the tool is free.
- Concrete fix: add three tested facts under the primary action: **“Free.” “Works offline after your first visit.” “Patches stay in this browser.”** Add a plainly titled **“Privacy and limits”** section covering no microphone, samples, account, or cloud projects.

### F-1-28 — Major — Required canonical and social metadata are missing

- Location: live all routes; `index.html:3-10`.
- Evidence: canonical, Open Graph title/description/image, Twitter card, and apple-touch icon are absent. Privacy and Terms reuse the root description. `/demo` also retains the root title instead of **“Demo — Patchboard.”**
- Concrete fix: emit route-correct canonical/title/description metadata; add OG and Twitter tags with a real 1200 × 630 image derived from the original pixel art; add a 180 px apple-touch icon. Set titles before route content is announced.

### F-1-29 — Major — `sitemap.xml` is missing but falsely returns HTML with status 200

- Location: live `/sitemap.xml`; `public/robots.txt`.
- Evidence: the URL returns the root HTML as `text/html`, not XML. `robots.txt` has no sitemap reference.
- Concrete fix: generate a real XML sitemap listing `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 only where appropriate. Add its absolute URL to `robots.txt` and exclude it from the SPA fallback.

### F-1-30 — Major — Header and footer structure is inconsistent across routes

- Location: live `/`, `/privacy`, `/terms`; `src/main.ts:45-66,108-119,192-195`.
- Evidence: legal routes have no header or footer. The app header has no linked wordmark or navigation. The root footer lacks **“Built by Param Factory”** and a version/build ID.
- Concrete fix: render one shared skip link, linked wordmark, navigation of at most four links, and standard footer on every route. Include Demo, Privacy, Terms, the product one-liner, factory credit, and build ID.

### F-1-31 — Major — Route changes do not move or announce focus

- Location: navigation from `/` to `/privacy` and browser Back.
- Evidence: after selecting Privacy, `document.activeElement` was `BODY`, not the new H1. Back returned to `/` but also left focus on `BODY`. Deep links and Back otherwise rendered the expected routes.
- Concrete fix: use a route controller with `pushState`/`popstate`, set scroll appropriately, focus the new H1 with `tabindex="-1"`, and announce the route in an `aria-live="polite"` region. Add forward/back focus tests.

### F-1-32 — Minor — The external link is not identified as external

- Location: footer link **“Web Audio reference.”**
- Why this fails: the structure contract says external links identify that fact; this link is the only one that leaves the site.
- Concrete fix: label it **“Web Audio reference (external)”** and keep `rel="noreferrer"`.

### F-1-33 — Minor — README capability sentence is 33 words

- Location: README line 3.
- Exact text: the sentence beginning **“Wire six native browser audio modules…”**
- Concrete rewrite: **“Connect six browser audio modules and hear the result. Compare A/B variants, then share the patch as a URL. No samples, account, upload, or microphone are required.”** Add claim entries before retaining the facts.

### F-1-34 — Minor — README audience sentence is 25 words

- Location: README line 9.
- Exact text: **“It is built for developers learning Web Audio who want to understand a small graph before moving it into a performance, toy, or larger app.”**
- Concrete rewrite: **“Patchboard is for developers learning Web Audio. Use it to understand a small graph before adding it to a performance or app.”**

### F-1-35 — Minor — README offline sentence is 25 words

- Location: README line 27.
- Exact text: the sentence beginning **“After one successful online visit…”**
- Concrete rewrite: **“After your first online visit, a service worker caches the app shell. You can then reload Patchboard offline.”** Retain only with `offline-reload` coverage.

### F-1-36 — Minor — The landing and README use unexplained implementation jargon

- Location: landing kicker **“Native Web Audio / local-first,”** landing **“browser-native modules,”** and README **“local-first Web Audio sketchpad”** / **“native browser audio modules.”**
- Why this fails: “native” and “local-first” do not tell a cold visitor what to do or what stays private.
- Concrete rewrite: **“Browser audio / saved on this device.”** Back the storage statement with `local-only`.

### F-1-37 — Minor — The intro heading is a metaphor

- Location: landing eyebrow **“A tiny audible notebook.”**
- Why this fails: it could describe unrelated music products and does not name the section.
- Concrete rewrite: **“Build and hear a six-module graph.”**

### F-1-38 — Minor — The section heading uses pronouns instead of naming the job

- Location: landing H2 **“Route it. Start it. Change one thing.”**
- Why this fails: “it” has no meaning when headings are read out of context.
- Concrete rewrite: **“Connect modules, start audio, then compare one change.”**

### F-1-39 — Minor — One display has three inconsistent names

- Location: **“Audio-clock probe / waiting,” “16-step lamp,”** and the accessible label **“16-step beat position.”**
- Why this fails: “probe” is jargon, “lamp” is a visual metaphor, and neither matches the accessible name.
- Concrete fix: use **“16-step beat position”** everywhere; change “waiting” to **“Starts with audio.”**

### F-1-40 — Minor — The default inspector explains an API class before the result

- Location: **“A low-pass BiquadFilterNode. Raise resonance to make the cutoff frequency easier to hear.”**
- Why this fails: the first sentence is jargon; the visitor needs the audible result first.
- Concrete rewrite: **“This browser low-pass filter removes sound above the cutoff. Increase resonance to emphasize sound near the cutoff.”** Test both retained claims.

### F-1-41 — Minor — Four button labels do not name their result

- Location: **“New patch,” “A,” “B,”** and **“Close.”**
- Why this fails: the first is a noun phrase, the variant buttons require nearby context, and Close does not name what closes.
- Concrete rewrites: **“Start new patch,” “Hear A,” “Hear B,”** and **“Close share dialog.”** Existing **“Start audio,” “Save locally,” “Share patch,” “Copy A → B,”** and **“Edit cables”** pass.

### F-1-42 — Minor — Legal H1s are slogans instead of page names

- Location: `/privacy` H1 **“Your patches stay yours.”** and `/terms` H1 **“Terms, in plain language.”**
- Why this fails: the headings do not identify the product and route when heard alone.
- Concrete rewrites: **“Patchboard privacy”** and **“Patchboard terms.”**

### F-1-43 — Minor — The artwork alt text describes pixels but not their purpose

- Location: landing image alt **“Pixel-art circuit creature made from six connected audio modules.”**
- Why this fails: the wording identifies the drawing but does not explain why it is relevant to the editor.
- Concrete rewrite: **“Six connected modules show the kind of audio graph you can build.”** If the image is only decorative, use an empty alt attribute instead.

## Copy audit

Word counting treats a hyphenated term or URL as one word. Sentence fragments, headings, labels, and buttons are included because the brief explicitly requires them to be audited. The landing list covers the initial rendered DOM plus its offline banner, empty state, and share dialog. Dynamic values such as patch names and cable counts are not new authored sentences.

### Landing page

| # | Words | Exact copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 4 | Native Web Audio / local-first | F-1-36 |
| 2 | 1 | Patchboard | F-1-1 |
| 3 | 4 | Wire six browser-native modules. | F-1-5; jargon also addressed by F-1-36 |
| 4 | 11 | Hear what every cable changes before the graph enters your code. | F-1-1, F-1-6 |
| 5 | 2 | Save locally | — |
| 6 | 2 | Share patch | — |
| 7 | 2 | New patch | F-1-41 |
| 8 | 2 | You’re offline. | — |
| 9 | 7 | The synth and saved patches still work. | F-1-9 |
| 10 | 4 | A tiny audible notebook | F-1-37 |
| 11 | 2 | Route it. | F-1-38 |
| 12 | 2 | Start it. | F-1-38 |
| 13 | 3 | Change one thing. | F-1-38 |
| 14 | 10 | Every pulse is synthesized here—no samples, uploads, or microphone. | F-1-7 |
| 15 | 9 | The URL can carry both A and B versions. | F-1-8; use “variants” consistently |
| 16 | 2 | Start audio | — |
| 17 | 1 | Tempo | — |
| 18 | 3 | Audio-clock probe / waiting | F-1-39 |
| 19 | 1 | Patch | — |
| 20 | 2 | Hear variant | — |
| 21a | 1 | A | F-1-41 |
| 21b | 1 | B | F-1-41 |
| 21c | 3 | Copy A → B | — |
| 22 | 1 | Ready. | — |
| 23 | 8 | Audio starts only when you press Start audio. | F-1-10 |
| 24 | 2 | Signal graph | — |
| 25 | 6 | Select a module to inspect it. | — |
| 26 | 2 | Edit cables | — |
| 27 | 2 | Calm motion | — |
| 28 | 14 | Current graph: Oscillator to Filter; Filter to Delay; Delay to Gain; Gain to Speaker. | — |
| 29 | 2 | Connected cables | — |
| 30 | 2 | Shape module | — |
| 31 | 1 | Filter | — |
| 32 | 2 | Live parameters | — |
| 33 | 3 | A low-pass BiquadFilterNode. | F-1-16, F-1-40 |
| 34 | 10 | Raise resonance to make the cutoff frequency easier to hear. | F-1-17, F-1-40 |
| 35 | 1 | Route | — |
| 36 | 8 | Edit cables, choose a source, then a destination. | — |
| 37 | 4 | Feedback loops are blocked. | F-1-11 |
| 38 | 1 | Probe | F-1-39 |
| 39 | 2 | Start audio. | — |
| 40 | 12 | The 16-step lamp is scheduled by the same clock as every pulse. | F-1-12, F-1-39 |
| 41 | 1 | Compare | — |
| 42 | 15 | Copy A to B, change one parameter or cable, then switch A/B while sound runs. | — |
| 43 | 7 | Sound and patches stay on this device. | F-1-13 |
| 44 | 4 | Original AI-generated pixel artwork. | Provenance is recorded in `.factory/design.md`; no copy flag. |
| 45 | 1 | Privacy | — |
| 46 | 1 | Terms | — |
| 47 | 3 | Web Audio reference | F-1-32 |
| 48 | 4 | Share this audible graph | — |
| 49 | 10 | Both A and B variants are encoded in the URL. | F-1-14 |
| 50 | 3 | Nothing is uploaded. | F-1-15 |
| 51 | 2 | Share link | — |
| 52 | 2 | Copy link | — |
| 53 | 1 | Close | F-1-41 |
| 54 | 3 | No cables yet. | — |
| 55 | 9 | Choose “Edit cables,” then pick a source and destination. | — |
| 56 | 9 | Pixel-art circuit creature made from six connected audio modules | F-1-43 |
| 57 | 10 | Patchboard needs JavaScript to synthesize and route audio in your browser. | — |

No landing sentence exceeds 22 words. No banned marketing adjective appears. The flagged problems are the brand-only H1, unlisted claims, jargon, metaphor, non-informative headings, inconsistent terminology, and button labels.

### README

| # | Words | Exact copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 1 | Patchboard | — |
| 2 | 10 | Patchboard is a local-first Web Audio sketchpad for creative coders. | F-1-18; “local-first” jargon in F-1-36 |
| 3 | 33 | Wire six native browser audio modules, hear an audio-clock BPM probe, inspect live parameters, compare A/B variants, and share the complete patch in a URL fragment—without samples, accounts, uploads, or microphone access. | F-1-19, F-1-33 |
| 4 | 3 | Live: https://audio-graph-sketchpad.sociobot.in | — |
| 5 | 4 | Who it is for | — |
| 6 | 25 | It is built for developers learning Web Audio who want to understand a small graph before moving it into a performance, toy, or larger app. | F-1-34 |
| 7 | 15 | It is intentionally not a DAW: there are no tracks, cloud projects, or sample libraries. | F-1-20 |
| 8 | 3 | Run and verify | — |
| 9 | 5 | Requires Node.js 20 or newer. | — |
| 10 | 13 | The production command is exactly npm run build; deploy the generated dist/ directory. | — |
| 11 | 8 | Unit tests cover graph and share encoding rules. | F-1-21 |
| 12 | 22 | Playwright runs desktop and 390px mobile workflows, keyboard recovery paths, an actual offline reload after service-worker installation, and an axe accessibility scan. | F-1-22 |
| 13 | 4 | Privacy and offline behavior | — |
| 14 | 9 | Patch data is saved only in browser local storage. | F-1-23 |
| 15 | 13 | Share links encode data after #, which browsers do not send to the server. | F-1-24 |
| 16 | 25 | After one successful online visit, a service worker caches the generated app shell—including the fingerprinted JavaScript and CSS—so an offline reload remains usable. | F-1-25, F-1-35 |
| 17 | 8 | See /privacy and /terms in the built app. | — |
| 18 | 18 | The product brief lives in .factory/brief.json; the original visual system and generated-art provenance live in .factory/design.md and assets/src/. | — |
| 19 | 1 | License | — |
| 20 | 1 | MIT. | — |
| 21 | 2 | See LICENSE. | — |

Three README sentences exceed 22 words: rows 3, 6, and 16. Their rewrites are in F-1-33 through F-1-35. No banned marketing adjective appears.

### Terminology table

| Concept | Current terms | Required single term |
| --- | --- | --- |
| A/B alternative | “version,” “variant” | **variant** |
| Timing display | “audio-clock probe,” “16-step lamp,” “16-step beat position” | **16-step beat position** |
| Audio building block | “module,” exact API names ending in `Node` | **module** in instructions; define API class names only in technical detail |
| Saved design | “patch” | **patch** |
| Connections/topology | “cable,” “graph” | Keep **cable** for one connection and **graph** for the complete topology; explain this once. |

## Demo, storage, privacy, and offline evidence

- No demo CTA or demo banner exists. `/demo` is normal mode and uses `patchboard.session.v1`.
- The sentinel test confirmed `/demo` reads real state and writes demo edits back to the same key.
- During a live flow covering `/`, `/demo`, Start audio, Share patch, Close, and Edit cables, every request stayed on `audio-graph-sketchpad.sociobot.in`. No third-party request occurred.
- That request log supports the current implementation, but it does not satisfy privacy claim verification because there is no isolated demo or claim-tagged test.
- Live offline regression passed after worker installation: an offline reload rendered six modules and an enabled Start audio button.

## Claims and clean-clone test evidence

The required `.factory/claims.json` does not exist, so there were no listed claim commands. No test contains `@claim:`. General gates from a clean local clone of the candidate:

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 0 vulnerabilities |
| `npm test` | PASS; 5 unit and 10 Playwright checks |
| `npm run build` | PASS; `dist/` produced |
| Build size | JS 27.69 KB raw / 9.99 KB gzip; CSS 11.78 KB raw / 3.52 KB gzip |
| Factory `verify-url.sh` | PASS; HTTPS 200, title, `lang=en`, one H1, main, image alt, labeled buttons, no console errors |
| Playwright axe, `/`, `/demo`, `/privacy`, `/terms`, unknown route | 0 serious or critical violations |

These passes do not override F-1-3 or the unlisted claims.

## History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The existing handoff and both independent verification files were read. The handoff says three earlier verification defects were fixed; each was re-tested live and checked in source:

| Earlier defect | Live result | Code result |
| --- | --- | --- |
| Offline reload rendered a blank app | Fixed: offline reload showed six modules and enabled Start audio. | `scripts/postbuild.mjs` discovers and caches the hashed JS/CSS assets. |
| Skip link left focus on `BODY` | Fixed: keyboard activation placed focus on `MAIN#main`. | `src/main.ts` explicitly focuses `#main`. |
| Corrupt share link exposed parser internals | Fixed in a fresh page: **“This share link does not contain a compatible Patchboard session. A fresh patch is ready to edit and share.”** | The decode error is caught and replaced with `SHARE_SESSION_ERROR`. |

None of those earlier IDs is reopened. The present FAIL comes from a full review against the supplied first-read/demo/claims/site-structure contract, not a diff-only check.

## Structure and accessibility checklist

| Check | Result |
| --- | --- |
| Root title pattern | PASS: **“Patchboard — hear your Web Audio graph”**, under 60 characters. |
| Route titles | Privacy and Terms pass; Demo fails and is covered by F-1-2/F-1-28. |
| One H1 | Technical count passes; root and legal H1 wording fails F-1-1/F-1-42. |
| Description, language, main, image alt | PASS on the root. Legal descriptions are not route-specific. |
| Canonical, OG/Twitter, social image, apple-touch | FAIL: F-1-28. |
| Favicon | PASS: local SVG favicon. |
| Robots and sitemap | Robots exists; sitemap fails F-1-29. |
| 404 | BLOCKING FAIL: F-1-4. |
| Deep links and Back | `/privacy` and `/terms` deep links render; Back returns to root. Focus fails F-1-31. |
| Dead-link crawl | Root, Privacy, Terms, and MDN links returned 200. The sitemap/404 false-200 behavior is separately reported. |
| Header/footer consistency | FAIL: F-1-30. |
| Keyboard and focus styles | Skip link regression passes; existing Playwright keyboard tests pass. Route focus fails F-1-31. |
| Serious/critical axe issues | None on tested routes. |
| Console/page errors | None in the tested live flows. |
| Same-origin runtime requests | PASS in the observed flow; claims coverage is still missing. |
| Visual identity | PASS: the dark stepped patch-panel layout, cyan/amber signal palette, pixel artwork, scan texture, and cable motion are product-specific rather than a generic SaaS template. |

## Missed leverage and AI check

F-1-26 identifies the missing deterministic code export implied by the brief. A generated Web Audio snippet is more useful and more honest than adding AI. No AI runtime feature exists, no decorative AI feature is presented, and no provider key or Azure endpoint appears in the product source. The artwork attribution is supported by `.factory/design.md` and `assets/src/`.

## What would make this perfect

Resolve every finding above and rerun the review from a fresh context. In particular: make the first screen state the job, audience, sample action, and three facts; implement a truly isolated `/demo`; create one-to-one claim entries and tagged outcome tests; add a real 404 and complete route metadata/structure; simplify every flagged sentence and control label; and export executable Web Audio code. “Perfect” here means the next review finds zero blocking or minor issues and no untested claim.
