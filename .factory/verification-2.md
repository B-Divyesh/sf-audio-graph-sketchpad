# Independent verification 2 — PASS

**Work order:** `audio-graph-sketchpad-verify-2`  
**Candidate tested:** `ddf6025787dbcd15c2c85cd6cf1f38523f20d050`  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Verified:** 2026-08-28 UTC

## Release decision

**PASS.** This candidate meets the researched brief and static-web acceptance contract. It is a local-first, six-node native Web Audio patchboard with explicit user-gesture audio, a BPM timing probe, cable editing with safe graph validation, A/B comparison, URL-fragment sharing, privacy/terms pages, reduced-motion handling, and a working offline shell.

The live deployment is the candidate artifact, not merely a functional approximation: SHA-256 values matched the fresh local production build for `index.html`, the fingerprinted JS/CSS, artwork, and generated service worker.

## Clean-checkout quality gates

The working tree was clean and at the requested SHA before `npm ci`.

| Command/check | Result |
| --- | --- |
| `npm ci` | PASS — 0 audit vulnerabilities |
| `npx tsc --noEmit` | PASS |
| lint | No lint script is declared in `package.json`; no separate lint gate exists. |
| `npm test` | PASS — 5 Vitest unit assertions and 10 Playwright checks (desktop Chromium + 390×844 mobile) |
| `npm run build` | PASS — exact production command produced `dist/` |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities |
| factory `verify-url.sh` against live | PASS — HTTPS 200; title, `lang=en`, one H1, main, image alt, labeled buttons, and zero console/page errors |
| Lighthouse 12.8.2, live mobile simulated throttling | PASS — Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.2 s, CLS 0, TBT 150 ms |

Production sizes: JS 27,693 bytes raw / 9,942 gzip; CSS 11,783 bytes raw / 3,536 gzip; WebP artwork 21,048 bytes. All are within the 200 KB JS, 50 KB CSS, and 300 KB mobile-image budgets.

## Independent end-to-end evidence

Fresh live Chromium testing exercised:

- initial state has six native graph modules and does not autoplay; explicit Start advances the audio-clock step probe and Stop returns the transport to idle;
- normal flow: edit graph, copy A to B, switch B (`aria-pressed=true`), and create a share URL containing only `#patch=` state;
- boundaries: tempo input `999` clamps to 240 BPM and `1` clamps to 40 BPM;
- invalid/recovery paths: Speaker-as-source, self-cable, duplicate cable, and graph feedback each announce a specific error while preserving a usable editor; corrupt share state shows compatible-session recovery guidance and keeps Start audio enabled; reset works for both cancel and confirm;
- keyboard: the visible Skip to patchboard link is first in tab order and places focus on `<main>` after Enter;
- desktop and 390×844 mobile: no horizontal overflow at 390 px and the inspector stacks below the graph; reduced-motion CSS reduces running cable animation to 0.00001 s; axe found zero serious/critical violations;
- console/page errors: zero during independent live testing and factory smoke verification.

## PWA, deployment, privacy, and policies

- The active live worker is `/sw.js`; `registration.update()` completed, and its `patchboard-shell-43f1c71b7723` cache contains `/`, `/privacy/`, `/terms/`, the exact hashed JS/CSS, artwork, icon, and manifest. After a normal online visit, an offline reload rendered all six modules and an enabled Start button.
- Initial live runtime requests were same-origin only: `/`, fingerprinted JS/CSS, and the local WebP. The only external URL in source is a user-clicked MDN reference. There are no analytics, cookies, uploads, microphone access, CDN fonts, or third-party scripts.
- Patch data is local storage; sharing is URL-fragment encoded. Privacy and Terms pages render live.
- Live headers include self-only CSP (`connect-src 'self'`, `media-src 'none'`, `frame-ancestors 'none'`), `Permissions-Policy: microphone=(), camera=(), geolocation=()`, HSTS, `nosniff`, and strict-origin referrer policy. Hashed assets and artwork are `max-age=31536000, immutable`; HTML and worker are 30-second must-revalidate.

## Live artifact identity

```text
local dist/index.html                  c7a60f517e37419060702378d15c511cb6c5c231bf8374fe1ff41b4238d2d95a
live /                                c7a60f517e37419060702378d15c511cb6c5c231bf8374fe1ff41b4238d2d95a
local/live assets/index-N61_tMEA.js   b3dce9b271aeea960d55932b48b1f89ca65e1058ed8f5928af822a017262a0a5
local/live assets/index-DJxUlDug.css  284bc9d2be4fb5df00f7c663c36b8bb19ab37e4e73d56f640e373d93a568a683
local/live art/patch-spirit.webp      f4aecebb261c871189a9ac3c4809f44aaec1bcd0c89b404beaf34f2ba0d4b342
local/live sw.js                      8bb10dbf0966762190259b9aa144b59d6c3c3ba897e2bc63994398c71abb50f6
```

## Defects by severity

None found. The P1 offline-shell and P2 keyboard/corrupt-share issues documented in the earlier verification are fixed in this candidate and passed fresh local and live regression checks.
