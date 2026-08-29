# Polish round 2 — zero-finding repair map

Candidate repaired from `a612f02c3d16504346749957f25c087288bd0463` using every review finding. Local evidence is in `.factory/evidence/polish-2-demo-mobile.png`, `.factory/evidence/polish-2-root-desktop.png`, and `.factory/evidence/polish-2-404.png`. The final deployed URL check is recorded in the handoff.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job H1, named creative coders, and retained one dominant sample action. | `first-screen sample action enters the isolated demo in one click`; root screenshot. |
| F-1-2 | Removed the demo marketing hero. Demo now opens directly on Neon steps with banner, active variant, values, connection summary, Start audio, patch name, and graph visible at 390 px. | `polish-2-demo-mobile.png`; `first-screen sample action enters the isolated demo in one click`. |
| F-1-3 | Kept the one-to-one claim registry and replaced the five nominal tests with real product flows. | `npm run test:claims` — 16/16 passed. |
| F-1-4 | Retained the designed 404 and Static Web Apps response override. | `designed 404 route has a recovery link`; `polish-2-404.png`. |
| F-1-5 | Retained six modules and UI cable creation coverage. | `@claim:six-modules`. |
| F-1-6 | Starts Patchboard, removes its Filter → Delay cable through the UI, and measures the running graph analyser output. | `@claim:audible-edits`. |
| F-1-7 | Adds pre-load spies for microphone, fetch, XHR, media decode, and media play before starting Patchboard. | `@claim:synthesized-audio`. |
| F-1-8 | Retained distinct A/B share-link round trip. | `@claim:fragment-ab-share`. |
| F-1-9 | Retained cached offline demo reload and start. | `@claim:offline-reload`. |
| F-1-10 | Retained explicit-gesture graph-start check. | `@claim:gesture-only-audio`. |
| F-1-11 | Retained feedback-loop rejection without graph mutation. | `@claim:feedback-blocked`. |
| F-1-12 | Retained audio-clock schedule timestamps at 108 BPM. | `@claim:audio-clock-schedule`. |
| F-1-13 | Retained no-outbound-request coverage through editing and sharing. | `@claim:local-only`. |
| F-1-14 | Retained complete A/B data in the share dialog and URL. | `@claim:fragment-ab-share`. |
| F-1-15 | Retained same-origin share-flow audit. | `@claim:local-only`. |
| F-1-16 | Retained actual engine `BiquadFilterNode` and low-pass type inspection. | `@claim:native-filter-node`. |
| F-1-17 | Changes the actual Cutoff and Resonance controls, checks active engine values, then compares the active production Biquad filter response. | `@claim:resonance-output`. |
| F-1-18 | README keeps only tested browser-storage and offline wording. | README; `@claim:local-only`; `@claim:offline-reload`. |
| F-1-19 | README capability sentences remain split and point to registered claims. | `.factory/copy-audit.md`; 16 claim tests. |
| F-1-20 | Retained plain limits and absent-control check. | `@claim:scope-limits`. |
| F-1-21 | README gives the exact unit-test command. | `npm run test:unit` — 9 passed. |
| F-1-22 | README gives exact browser and claim commands. | `npm test`; `npm run test:claims`. |
| F-1-23 | Saves and reloads a normal patch, enters demo, mutates/leaves it, checks browser stores/cache bodies, and records requests. | `@claim:local-only`. |
| F-1-24 | Retained fragment-free navigation request assertion. | `@claim:fragment-private-share`. |
| F-1-25 | Retained generated hashed-shell cache assertion and offline reload. | `@claim:offline-reload`. |
| F-1-26 | Retained deterministic active-graph JavaScript export and execution. | `@claim:code-export`; unit code test. |
| F-1-27 | Retained Free, offline, and browser-storage facts plus Privacy and limits. | root screenshot; `@claim:free-use`, `@claim:offline-reload`, `@claim:local-only`. |
| F-1-28 | Retained per-route titles, descriptions, canonical, OG/Twitter image, and icons. | `metadata and crawl files are route-correct`. |
| F-1-29 | Retained XML sitemap and robots reference. | `metadata and crawl files are route-correct`. |
| F-1-30 | Retained shared header, nav, footer, factory credit, and build ID. | `shared legal routes restore focus and scroll position through history`. |
| F-1-31 | Saves scroll in history state, restores it on Back/Forward, and focuses the route H1 without scrolling. | `shared legal routes restore focus and scroll position through history` in Chromium and mobile. |
| F-1-32 | Retained the labeled external MDN link. | route/metadata browser test. |
| F-1-33 | Kept README capability copy below the sentence limit. | `.factory/copy-audit.md`. |
| F-1-34 | Uses “creative coders” consistently in README and landing. | README; `.factory/copy-audit.md`. |
| F-1-35 | Retained short tested offline wording. | README; `@claim:offline-reload`. |
| F-1-36 | Uses “this browser” for the storage boundary. | landing, README, `.factory/copy-audit.md`. |
| F-1-37 | Retained the job-naming six-module intro. | root screenshot. |
| F-1-38 | Retained the explicit connect/start/compare heading. | root screenshot. |
| F-1-39 | Uses “16-step beat position” in UI and README. | README; `@claim:audio-clock-schedule`. |
| F-1-40 | Retained result-first filter explanation and product-control proof. | `@claim:native-filter-node`; `@claim:resonance-output`. |
| F-1-41 | Retained result-naming transport, variant, and dialog actions. | browser workflow test. |
| F-1-42 | Retained legal H1s naming Patchboard and route. | `shared legal routes restore focus and scroll position through history`. |
| F-1-43 | Retained purpose-based artwork alt text. | axe route test; root screenshot. |
| F-2-1 | Removed the public AI-artwork footer claim; provenance remains in design documentation. | footer source; root screenshot. |
| F-2-2 | Removed the redundant static-site architecture claim from README. | README copy audit. |
| F-2-3 | Replaced “saved on this device” with “this browser.” | landing; README; copy audit. |
| F-2-4 | Replaced “developers” with “creative coders.” | README; copy audit. |
| F-2-5 | Removed the decorative “Clear boundaries” label. | landing source; root screenshot. |
| F-2-6 | Renamed “Calm motion” to “Reduce motion” and updated its feedback. | editor UI; browser workflow test. |
| F-2-7 | Changed the README demo label to “Try it with sample data.” | README. |
| F-2-8 | Replaced unexplained “DAW” with recording/music-production wording. | README; copy audit. |
| F-2-9 | Replaced “payment gate” with “free and needs no account.” | README; `@claim:free-use`. |
| F-2-10 | Replaced README implementation terms with user-visible storage behavior. | README; `@claim:local-only`. |
| F-2-11 | Replaced “fragment” with the plain explanation of the part after `#`. | README; `@claim:fragment-private-share`. |
| F-2-12 | Replaced “generated-art provenance” with direct artwork wording. | README; copy audit. |
| F-2-13 | Replaced the metaphor H1 with “Page not found.” | 404 browser test; `polish-2-404.png`. |

No AI runtime feature was added: deterministic graph-to-code export is the useful, testable handoff for this local browser tool.
