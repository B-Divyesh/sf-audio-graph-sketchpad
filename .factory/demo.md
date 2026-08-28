# Patchboard demo

Open `https://audio-graph-sketchpad.sociobot.in/?demo=1` or `/demo`.

The sample is “Neon steps.” Variant B adds Noise → Filter, raises the filter cutoff and resonance, and lengthens the echo. Press **Start audio**, then **Hear A** and **Hear B** to compare it.

Demo state lives in JavaScript memory only. Demo mode never reads or writes `patchboard.session.v1`, the normal-mode local-storage key. **Reset demo** restores the bundled sample. **Start for real** discards the in-memory session and opens normal mode.

All claim tests start from `?demo=1` in a fresh browser context. Run them with `npm run test:claims`.
