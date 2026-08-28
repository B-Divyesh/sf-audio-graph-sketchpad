# Patchboard

Patchboard helps creative coders hear a small Web Audio graph before coding it.

Connect six browser audio modules and hear the result. Compare A/B variants, then share the patch or copy working JavaScript.

Live: <https://audio-graph-sketchpad.sociobot.in>

Try the isolated sample: <https://audio-graph-sketchpad.sociobot.in/?demo=1>

## Who it is for

Patchboard is for developers learning Web Audio. Use it to understand a small graph before adding it to a performance or app.

This is not a DAW. It has no tracks, cloud projects, account, upload, sample library, or microphone control.

## What it does

- Generates audio in the browser and starts it only after your click.
- Blocks graph feedback loops and shows a 16-step position from the audio clock.
- Stores normal patches in browser local storage. The demo uses memory only.
- Restores two variants from a share link without sending its fragment to the server.
- Generates Web Audio JavaScript for the active variant.
- Works offline after the first visit.
- Is free to use without an account or payment gate.

Each statement maps to a tagged browser test in [.factory/claims.json](.factory/claims.json).

## Run and verify

Use Node.js 20 or newer.

```sh
npm ci
npm test
npm run build
npm run preview
```

Run `npm run test:unit` to check graph, share, demo, and code generation rules.

Run `npm run test:e2e` for desktop, mobile, routing, keyboard, offline, privacy, and accessibility checks.

Run `npm run test:claims` to execute every claim from the isolated demo.

Deploy the generated `dist/` directory as an Azure Static Web App. The product remains a static site.

## Privacy

Patchboard sends no patch or audio data elsewhere. Normal patches stay in this browser, and demo edits disappear when you leave.

Read `/privacy` and `/terms` in the built app. Demo details are in [.factory/demo.md](.factory/demo.md).

The visual system and generated-art provenance are in [.factory/design.md](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
