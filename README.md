# Patchboard

Patchboard helps creative coders hear a small Web Audio graph before coding it.

Connect six browser audio modules and hear the result. Compare A/B variants, then share the patch or copy working JavaScript.

Live: <https://audio-graph-sketchpad.sociobot.in>

Try it with sample data: <https://audio-graph-sketchpad.sociobot.in/?demo=1>

## Who it is for

Patchboard is for creative coders learning Web Audio. Use it to understand a small graph before adding it to a performance or app.

This is not recording or music-production software. It has no tracks, cloud projects, account, upload, sample library, or microphone control.

## What it does

- Generates audio in the browser and starts it only after your click.
- Blocks graph feedback loops and shows the 16-step beat position from the audio clock.
- Stores normal patches in this browser. Demo changes disappear when you leave.
- Restores two variants from a share link. Browsers do not send the part after `#` to the server.
- Generates Web Audio JavaScript for the active variant.
- Works offline after the first visit.
- Is free and needs no account.

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

Deploy the generated `dist/` directory as an Azure Static Web App.

## Privacy

Patchboard sends no patch or audio data elsewhere. Normal patches stay in this browser, and demo edits disappear when you leave.

Read `/privacy` and `/terms` in the built app. Demo details are in [.factory/demo.md](.factory/demo.md).

Read how the visual system and artwork were made in [.factory/design.md](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
