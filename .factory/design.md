# Patchboard visual thesis

## Direction

Patchboard is a pocket demoscene instrument: a dark, one-screen workbench that feels like a hand-labeled tracker from a 1990s intro, rebuilt with crisp contemporary spacing. The pixel language belongs to synthesized sound and graph inspection—the moving square “charge” makes routing causal, while a restrained scanline texture makes the canvas feel active before sound starts. It is explicitly a single dark mode; the black-room setting preserves the illusion of a lit hardware patch panel and gives the signal colors stable meaning.

Clarity wins over nostalgia. Controls use real words, every cable carries a source-to-destination label for assistive technology, and the graph remains a conventional left-to-right flow. Demoscene details live at the edges: stepped corners, 1px highlights, eight-bit meter blocks, and terse status copy.

## Color tokens

| Token | Value | Purpose |
| --- | --- | --- |
| Void | `#090c10` | page background |
| Panel | `#101820` | primary work surface |
| Raised | `#17242d` | controls and inspector |
| Grid | `#293b45` | borders and dormant cables |
| Paper | `#f0f7f4` | primary copy (18.1:1 on Void) |
| Muted | `#a9bbc0` | secondary copy (9.5:1 on Void) |
| Signal | `#5fffe1` | live graph, focus, success |
| Tempo | `#ffc857` | scheduler, selected node |
| Hot | `#ff638f` | errors and destructive actions |
| Ink | `#07100e` | text on Signal/Tempo |

Color never works alone: live/dormant connections differ by line style and animation, selected nodes receive a double outline and label, and every status has text.

## Type and spacing

No font files or third-party requests. Headings, numbers, node labels, and controls use the platform monospace stack (`ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace`) for the tracker character. Explanations use the platform UI stack (`Inter` where installed, system-ui, sans-serif) for reading comfort. Body copy is never below 16px. Type steps are 12px metadata, 16px body, 20px section, 28px title, and a fluid 40–64px display wordmark.

The spacing base is 4px, with primary intervals of 8, 12, 16, 24, 32, and 48px. Controls are at least 44px tall and adjacent actions have at least 8px of air. Desktop uses a wide graph plus a 296px inspector; at 390px the inspector stacks under the graph, transport actions wrap, and nonessential keyboard-hint copy disappears.

## Interaction grammar

- Nodes are movable modules, but editing a route is deliberately discrete: select a source node and then an available destination. This works identically with click, Enter, or Space and avoids fragile drag-only wiring.
- Each node exposes one large output jack and an input state. Signal-generating nodes cannot accept input; the destination is terminal. Invalid choices explain the rule in the live status line.
- Selecting a node opens its parameters in the inspector. Every parameter change updates the running audio immediately, so A/B comparison is simply click/keyboard between two settings or bypassing an effect.
- The transport is the global instrument switch. Starting is always an explicit gesture. The amber scheduler lamp and bar counter explain timing independently of signal animation.
- Buttons depress by 2px and return to their origin; panels do not float gratuitously.

## Motion policy

Signal packets move left-to-right along connected SVG cables only while audio is running. The tempo lamp advances once per beat, and meters decay rather than jump. UI transitions are 160ms and use opacity/transform only. A visible “Calm motion” setting and `prefers-reduced-motion` both stop cable packets, meter easing, and decorative scan movement; state changes remain legible through text, solid line weight, and the tempo counter. Nothing flashes faster than 2Hz.

## Original asset plan and provenance

The sole raster illustration is `public/art/patch-spirit.webp`, used in the welcome/empty guidance panel and social preview. It depicts a tiny abstract circuit creature routing a luminous pulse through six modules. It clarifies the product metaphor without pretending to be a screenshot. UI icons and the logomark are hand-authored geometric SVG/CSS shapes in the repository.

Prompt sheet:

> Use case: stylized-concept. Asset type: compact website welcome illustration. A tiny abstract audio circuit creature made from six chunky electronic modules routes one luminous square pulse through patch cables inside a dark midnight workbench. Authentic 16-bit demoscene pixel art, hard-edged pixel clusters, limited palette of near-black, oxidized blue, phosphor cyan, and warm amber, subtle CRT bloom but no blur. Isometric three-quarter composition centered with generous dark negative space, playful and technically precise. No people, no instruments, no UI screenshot, no readable text, no letters, no watermark, no logo, no gradients, no brands.

Generated with the Factory Azure image deployment through `/opt/fleet/lib/gen-image.sh` on 2026-08-28. The output is original project artwork. Source PNG and prompt sidecar live in `assets/src/`; the optimized WebP ships in `public/art/`.

