# Patchboard

Patchboard is a local-first Web Audio sketchpad for creative coders. Wire six native browser audio modules, hear an audio-clock BPM probe, inspect live parameters, compare A/B variants, and share the complete patch in a URL fragment—without samples, accounts, uploads, or microphone access.

Live: <https://audio-graph-sketchpad.sociobot.in>

## Who it is for

It is built for developers learning Web Audio who want to understand a small graph before moving it into a performance, toy, or larger app. It is intentionally not a DAW: there are no tracks, cloud projects, or sample libraries.

## Run and verify

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

The production command is exactly `npm run build`; deploy the generated `dist/` directory. Unit tests cover graph and share encoding rules. Playwright runs desktop and 390px mobile workflows, keyboard recovery paths, an actual offline reload after service-worker installation, and an axe accessibility scan.

## Privacy and offline behavior

Patch data is saved only in browser local storage. Share links encode data after `#`, which browsers do not send to the server. After one successful online visit, a service worker caches the generated app shell—including the fingerprinted JavaScript and CSS—so an offline reload remains usable. See `/privacy` and `/terms` in the built app.

The product brief lives in `.factory/brief.json`; the original visual system and generated-art provenance live in `.factory/design.md` and `assets/src/`.

## License

MIT. See `LICENSE`.
