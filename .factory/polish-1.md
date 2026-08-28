# Polish round 1 — cumulative finding closure

Candidate `94b64f9b57724e37bcce6f4b0f894ed6f1cf0bb9` was repaired and deployed to <https://audio-graph-sketchpad.sociobot.in>. Local screenshots: `.factory/evidence/root-desktop.png`, `.factory/evidence/demo-mobile.png`, and `.factory/evidence/not-found.png`. Cold live screenshots: `.factory/evidence/live-cold/demo-desktop.png`, `.factory/evidence/live-cold/demo-mobile.png`, and `.factory/evidence/live-cold/404-live.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the brand-only H1 with the requested job headline, named creative coders, and made the sample action primary. | `first-screen sample action enters the isolated demo in one click`; live `/`; desktop and mobile screenshots. |
| F-1-2 | Added `?demo=1` and `/demo`, an opinionated A/B fixture, memory-only state, persistent banner, reset, and exit. | `@claim:demo-isolation`; `.factory/demo.md`; live `/?demo=1` sentinel check. |
| F-1-3 | Added 16 registry entries with exactly one tagged outcome test per entry. | `.factory/claims.json`; 16/16 individual clean-clone commands and 16/16 live claim tests passed. |
| F-1-4 | Added styled `404.html`, removed the catch-all rewrite, and configured `responseOverrides.404`. | `static hosting structure`; `designed 404 route has a recovery link`; live random URL returned HTTP 404. |
| F-1-5 | Kept six modules and made their count/connectability testable from the sample. | `@claim:six-modules`; live claim pass. |
| F-1-6 | Proved that connecting a native graph changes rendered audio output. | `@claim:audible-edits`; live claim pass. |
| F-1-7 | Split the synthesis/privacy copy and removed jargon. | `@claim:synthesized-audio`; `@claim:local-only`; live request log had zero external requests. |
| F-1-8 | Standardized “variant” and verified complete A/B round-trip data. | `@claim:fragment-ab-share`; live claim pass. |
| F-1-9 | Rewrote the offline banner precisely and verified a usable offline demo reload. | `@claim:offline-reload`; live cold audit reports `offlineReload: true`. |
| F-1-10 | Reworded initial status and instrumented graph creation after the user gesture. | `@claim:gesture-only-audio`; live claim pass. |
| F-1-11 | Retained the plain feedback-loop rule and tested rejection without graph mutation. | `@claim:feedback-blocked`; live claim pass. |
| F-1-12 | Named the display consistently and exposed audio schedule timestamps for verification. | `@claim:audio-clock-schedule`; live claim pass. |
| F-1-13 | Replaced the broad footer claim with a precise product line; storage/privacy claims are registered. | `@claim:local-only`; live request/storage audit pass. |
| F-1-14 | Share dialog now says the link contains both A/B variants after `#`. | `@claim:fragment-ab-share`; live restored-value check. |
| F-1-15 | Share flow remains same-origin and uploads nothing. | `@claim:local-only`; live external request count 0. |
| F-1-16 | Put the audible filter result first and verified the engine creates a low-pass `BiquadFilterNode`. | `@claim:native-filter-node`; live claim pass. |
| F-1-17 | Reworded resonance plainly and compared low/high-Q native renders. | `@claim:resonance-output`; live claim pass. |
| F-1-18 | Removed “local-first” from README and stated exact storage/offline behavior. | `@claim:local-only`; `@claim:offline-reload`; `.factory/copy-audit.md`. |
| F-1-19 | Split the 33-word README capability sentence into short tested statements. | README; claim tests for modules, audio, sharing, privacy, and code export. |
| F-1-20 | Labeled the non-DAW scope as limits and verified absent controls. | `@claim:scope-limits`; live claim pass. |
| F-1-21 | Replaced the coverage boast with exact test commands. | README “Run and verify”; clean-clone `npm run test:unit` pass. |
| F-1-22 | Replaced the Playwright boast with exact commands. | README; clean-clone `npm run test:e2e` passed 31 checks. |
| F-1-23 | Registered and tested normal/demo storage behavior. | `@claim:local-only`; `@claim:demo-isolation`; live sentinel unchanged. |
| F-1-24 | Registered and tested that URL fragments are absent from navigation requests. | `@claim:fragment-private-share`; live claim pass. |
| F-1-25 | Registered and tested hashed shell caching plus offline reload/use. | `@claim:offline-reload`; live claim pass. |
| F-1-26 | Added deterministic code export for active values, nodes, connections, and explicit start. | `@claim:code-export`; `tests/unit/code.test.ts`; exported code executed in a fresh browser test. |
| F-1-27 | Added Free, offline, and browser-storage facts plus a named Privacy and limits section. | `@claim:free-use`, `@claim:offline-reload`, `@claim:local-only`, `@claim:scope-limits`; live screenshots. |
| F-1-28 | Added canonical, route titles/descriptions, OG/Twitter image metadata, and apple-touch icon. | `metadata and crawl files are route-correct`; live route-title audit passed. |
| F-1-29 | Added real XML sitemap and robots reference. | `metadata and crawl files are route-correct`; live `/sitemap.xml` returned XML 200. |
| F-1-30 | Added shared linked wordmark, three-link navigation, full footer, factory credit, and build ID to every route. | `shared legal routes set titles and restore focus through history`; live five-route audit. |
| F-1-31 | Added History API routing, scroll reset, H1 focus, and a polite route announcer. | `shared legal routes set titles and restore focus through history`; cold live forward/back focus pass. |
| F-1-32 | Renamed the link to “Web Audio reference (external).” | Footer source and live screenshots. |
| F-1-33 | Replaced the 33-word README sentence with two short sentences. | `.factory/copy-audit.md`; banned/long-copy scan clean. |
| F-1-34 | Replaced the 25-word audience sentence with two short sentences. | README Who it is for; `.factory/copy-audit.md`. |
| F-1-35 | Replaced the long offline sentence with short tested wording. | README; `@claim:offline-reload`. |
| F-1-36 | Replaced “native” and “local-first” marketing jargon with direct browser/storage wording. | Repository banned-term scan returned no matches; `.factory/copy-audit.md`. |
| F-1-37 | Replaced the metaphor eyebrow with “Build and hear a six-module graph.” | Live `/`; desktop/mobile screenshots. |
| F-1-38 | Replaced pronoun heading with “Connect modules, start audio, then compare one change.” | Live `/`; desktop/mobile screenshots. |
| F-1-39 | Uses “16-step beat position” everywhere and “Starts with audio” before playback. | `@claim:audio-clock-schedule`; live editor check. |
| F-1-40 | Inspector now explains the audible result before technical detail. | `@claim:native-filter-node`; `@claim:resonance-output`; live screenshot. |
| F-1-41 | Renamed controls to “Start new patch,” “Hear A,” “Hear B,” and specific dialog-close labels. | Full browser workflow and live claim suite. |
| F-1-42 | Legal H1s are “Patchboard privacy” and “Patchboard terms.” | `shared legal routes set titles and restore focus through history`; live route audit. |
| F-1-43 | Artwork alt now explains that the six modules demonstrate a buildable graph. | Factory live verification: `imgsMissingAlt: 0`; root source and screenshots. |

## Earlier regression checks

- Offline blank-app regression: `@claim:offline-reload` passes locally, from a clean clone, and live.
- Skip-link regression: `skip link moves keyboard focus to main` passes in desktop and mobile projects.
- Corrupt-share regression: `corrupt share link gives safe recovery guidance` passes without parser details.

No prior `.factory/polish-*.md` existed. `.factory/review-1.md`, `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff were all reviewed.
