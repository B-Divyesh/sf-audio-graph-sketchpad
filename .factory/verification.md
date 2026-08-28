# Independent verification — FAIL

**Work order:** `audio-graph-sketchpad-verify-1`  
**Candidate:** `8385ba086c97976e3e3d84bdf831648c9e46302b`  
**Live URL:** <https://audio-graph-sketchpad.sociobot.in>  
**Verified:** 2026-08-28 (UTC)

## Result

**FAIL.** The live deployment is byte-for-byte the requested candidate for the HTML, application JS, CSS, and artwork, and the online product works. However, the declared PWA/offline promise fails: after an ordinary successful online load, an offline reload renders cached HTML with an empty `#app`, so the patchboard is unusable offline.

## Release-blocking defect

### P1 — Offline reload is a blank application

Reproduction against the production build on `http://127.0.0.1:4173/`:

1. Load the app online and wait until `navigator.serviceWorker.controller` is present.
2. Set the browser offline and reload.
3. The navigation succeeds from the cached `/` response, but `#app` has no text/content and there are no failed requests because the module never becomes available to render the UI.

The service-worker cache contains only `/`, `/privacy/`, `/terms/`, the artwork, icon, and manifest. It does **not** contain either required hashed application asset:

```
/assets/index-BDBzc2xU.js
/assets/index-DJxUlDug.css
```

This conflicts with the README and prior handoff statement that the app shell works offline after a successful online load, and with the PWA/offline acceptance check. `public/sw.js` precaches a hand-maintained list that omits the Vite-generated asset names.

## Other defects

### P2 — Skip link does not move keyboard focus to main content

Tab exposes a visible cyan 3px focus ring on “Skip to patchboard.” Activating it changes the URL to `#main`, but `document.activeElement` remains `BODY`; `<main id="main">` is not programmatically focusable. This does not satisfy the keyboard/screen-reader skip-to-main requirement, despite avoiding a serious/critical axe finding.

### P2 — Corrupt share-link recovery exposes parser internals

Loading `/#patch=not-json` keeps the editor usable but announces `Unexpected token '�' ... is not valid JSON` instead of a clear recovery message. The product has an intended compatible-session message in its codec, but malformed base64/JSON errors are surfaced directly. This is not actionable for a creative coder and does not meet the error-language contract.

## Passing evidence

### Clean checkout and automated checks

The checkout was clean and at the requested candidate before installation.

```text
npm ci                                      PASS (0 vulnerabilities)
npx tsc --noEmit                            PASS
npm test                                    PASS (5 Vitest + 4 Playwright)
npm run build                               PASS
npm audit --audit-level=moderate            PASS (0 vulnerabilities)
```

There is no lint script in `package.json`.

The exact build generated `dist/`, with application JS 27.51 KB raw / 9.93 KB gzip and CSS 11.78 KB raw / 3.52 KB gzip. Both are below the static-product budgets; the 21.05 KB WebP artwork is also below the 300 KB mobile budget.

### Product workflows and failure paths

Independent Playwright exercise on desktop covered:

- six visible native nodes; explicit Start/Stop audio; scheduler advanced to `step 2 / 16` after start, with no autoplay before the gesture;
- normal A/B workflow: copy A to B, select B (`aria-pressed="true"`), and generate a share URL whose state is after `#patch=`;
- boundary tempo input: `999` clamps to `240`, `1` clamps to `40`;
- invalid cable recovery: Speaker-as-source, self cable, duplicate cable, and feedback loop each produce a specific live-status error and leave the editor usable;
- New patch confirmation supports both cancel and confirm;
- corrupt fragment leaves Start audio available (but has the P2 message problem above);
- share dialog focuses/selects its URL and closes with Escape;
- no console errors or page errors.

At 390×844, `scrollWidth === innerWidth === 390`; the graph is intentionally 430px high and the inspector becomes static/stacked. Under reduced motion, the running-cable animation duration resolves to `0.00001s`. A desktop axe scan returned zero serious or critical violations. The supplied `verify-url.sh` also passed locally: title, `lang="en"`, one H1, main landmark, image alt, and zero page/console errors.

### Privacy and browser policy

- Runtime request capture on local and live initial load found no external requests. The only external URL in product source is an optional, user-clicked MDN reference link.
- Patch state uses local storage; share state is a URL fragment; no analytics, cookies, microphone API, uploads, or CDN-hosted fonts/scripts were found.
- Live CSP is `default-src 'self'` with `connect-src 'self'`, `media-src 'none'`, and `frame-ancestors 'none'`; it also sends `Permissions-Policy: microphone=(), camera=(), geolocation=()`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, and `nosniff`.
- Live hashed JS/CSS and artwork use `Cache-Control: public, max-age=31536000, immutable`; HTML/SW use 30-second must-revalidate caching.

### Deployment identity and live smoke test

SHA-256 matched local `dist/` to live responses for the following files:

```text
index.html                         af8dda7af57fd6dcb97b4c9fd2945a424ac28c4fa9bf6267a5a51e3320653627
assets/index-BDBzc2xU.js           055f8bb252fef3d916af24111b368a4908365a4d91050632da5ac28a21ad79ab
assets/index-DJxUlDug.css          284bc9d2be4fb5df00f7c663c36b8bb19ab37e4e73d56f640e373d93a568a683
art/patch-spirit.webp              f4aecebb261c871189a9ac3c4809f44aaec1bcd0c89b404beaf34f2ba0d4b342
```

Fresh live Chromium smoke testing found six modules, working explicit audio start and audio-clock progression, working Privacy and Terms pages, zero page or console errors, and no initial outbound requests.

### Performance measurement

Local production Lighthouse mobile measurement:

```text
Performance 99 | Accessibility 100 | Best Practices 100 | SEO 100
FCP 1.0 s | LCP 1.6 s | CLS 0 | TBT 110 ms | transfer 37 KiB
```

## Required disposition

Do not release this candidate as passing until the P1 offline reload is fixed and independently reverified. The two P2 accessibility/error-recovery issues should be addressed in the same corrective change.
