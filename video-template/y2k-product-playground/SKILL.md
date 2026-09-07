---
name: y2k-product-playground
description: Create playful Y2K product films with a dominant tactile 3D hero, broad oversized sans type, mixed flat and molded graphics, and coordinated palette-world transitions. Use for product families, collections and branded lookbooks; add catalog interaction only when requested.
---

# Y2K Product Playground

Create a 12-15 second product film with one reusable visual sentence:

`stable graphic stage -> active hero retreats -> new title and color world expand -> next hero rises -> motifs settle -> final product holds`

Preserve the user's subject, copy and palette while carrying over the source's product/type scale, material contrast, graphic motifs and responsive motion. Read [the source style analysis](references/style-analysis.md) before constructing the visual prompt; it separates timestamped observations from reusable choices and source-specific interface devices.

## Brief contract

Require or infer:

- one collection or brand title;
- three to six variants with exact short names;
- one consistent product or subject family;
- one palette and one motif family per variant;
- variant order and final product state;
- whether an interactive catalog is explicitly requested; otherwise use a pointer-free product film;
- optional final CTA of one to three words.

Prefer four variants for a 15-second film. Shorten the list before making names unreadable.

## Reference contract

Use purpose-built still images only:

1. `shell_lock`: a clean front-facing graphic stage with the exact brand title, dominant hero, broad headline and palette/motif hierarchy. Add a small selector row only for an interactive brief. Do not bake a cursor into this still.
2. `variant_source`: all variants isolated at consistent scale, angle, lighting, and construction. This is an identity reference, not a layout reference; do not turn its inventory into equal-sized main products on screen.
3. Optional `variant_lock_01...06`: one identity still per variant when a combined source cannot preserve them.

Do not use a multi-panel storyboard as a literal frame. Treat inspiration videos as analysis-only evidence and never pass them to video generation. Keep still-image inputs cursor-free. An explicitly requested pointer belongs only to the temporal interaction layer.

## Visual style lock

The target combines premium material-rich product imagery, playful Y2K graphics and contemporary editorial scale. The signature is a large central product overlapping broad type, surrounded by flat shapes and tactile molded ornaments that change as one color world. Navigation, selectors and a mouse pointer belong to the source's catalog demonstration and are optional for style transfer.

### Canvas and hierarchy

- Use one full-bleed stage: a flat field and broad lettering behind a material-rich hero, with a few motifs crossing in front. Crop some large ornaments at the edges; keep smaller brand and supporting text peripheral.
- Keep one dominant hero and one oversized variant name. A low row of miniatures is optional for a catalog; navigation-heavy layouts and equal main-product cards weaken the visual hierarchy.
- Place the hero in a central band, with modest offsets as its silhouette changes. Tall products can fill roughly 70-90% of the height when settled. For round or wide subjects, match that visual weight without stretching the object. Spread a broad headline behind it, often across two lines, with deliberate occlusion and at least one readable state.
- Omit the mouse pointer by default. When interaction is explicitly requested, use a small conventional flat black/white pointer at about 2-3% of frame height, at most 32 px at 1080p. It stays near selectors and leaves the hero/title clear. No giant arrow, cursor mascot, volume or glow. This smaller-pointer treatment is a user-feedback correction, not a claim about the source arrow's size.

### Product, type, and material

- Give every variant a materially convincing hero: glass, metal, ceramic, fabric, food or another appropriate surface. Preserve photographic-looking highlights and small surface details while contrasting gloss with matte, grain, fuzz or translucency in the surrounding ornaments. Use the user's real variant differences; do not invent a different product merely to change hue.
- Light the hero like a studio object. Mix smooth specular forms, textured objects and flat graphic masks in shallow layered space. The recognizable look comes from their material contrast, not a single uniform rendering treatment.
- Use heavy, broad geometric/grotesk capitals with regular proportions, often in a compact two-line block. Solid fills and occasional fine outlines are visible in the source; inflated 1970s bubble letters and tall condensed headlines are not the default. Pair the title with compact bold sans labels. Never stretch glyphs to fill the canvas vertically.
- Render names directly in the color field. Do not add a pill, card, ribbon, subtitle bar, glow plate, or translucent backing behind text.

### Palette behavior

- Build each variant as a coordinated color world: one dominant field, contrasting title, a unifying light or dark neutral, and a few derived accents. Cream connects many source states; black, green, caramel, pink/red, brown and teal/yellow are observed worlds, not a required palette sequence.
- Keep saturation confident and clean, with hard graphic shapes and at most a restrained soft gradient caused by light. Avoid neon HUD color, glassmorphism, or generic blue-purple SaaS gradients.
- Draw from a funky Y2K motion-graphic vocabulary: organic blobs, checkerboards, wavy lines, spirals, squiggles, dots, chunky stars, warped grids, floating spheres, rings, and hand-drawn shapes. Select a small theme-specific subset for each state and derive it from the hero's silhouette, material, or ingredients. Motifs should frame the product, not become unrelated decoration.

### Motion character

Use a quick compression or downward retreat, an expanding shape mask, a rising/scaling replacement hero and staggered ornament arrivals. A circular mask may reveal the new title and field while outgoing content remains outside it. Let local rotation and light drift continue after the main reveal. Preserve solid product identity during the handoff. A responsive spring-like result is the goal; no particular web animation engine is established by the reference.

## Reusable motion grammar

### Persistent shell

Keep these invariant across the whole film:

- front-facing master canvas and a stable product/type hierarchy;
- brand position and margins; selector baseline, navigation and CTA placement only when those elements are used;
- hero footprint and title hierarchy;
- one display type family and one small-label family.

Change the active hero, exact name, palette, motifs and local type behavior as a coordinated bundle within this shared stage.

### World transition chain

For every variant, show this order:

1. A visual beat cues the next world. In an interactive brief, the small pointer reaches its selector first and the selector reacts.
2. The outgoing hero compresses or retreats toward a consistent lower origin.
3. An expanding shape mask replaces the field and title; overlap is controlled by the mask rather than letter mutation.
4. The next hero rises and expands from that origin, or from its thumbnail when a selector row is present.
5. The incoming hero settles with a short spring-like overshoot.
6. Palette and motifs finish the same world change.
7. Smaller ornaments respond on delayed paths or rotations.
8. Exact incoming name resolves and holds.

For explicitly interactive films, let pointer contact precede the state change; it can leave after the reaction. For style-only product films, use the same responsive world transition without drawing interface interaction.

### Example 15-second arrangement

This is a production arrangement for a new brief. The source's observed timings and longer final-world hold are documented in the style analysis.

| Time | Required beat |
| --- | --- |
| 0.0-1.2s | Graphic stage and first product assemble; optional catalog interaction enters at the edge. |
| 1.2-3.8s | The first reveal and complete world transformation establish the motion language. |
| 3.8-11.8s | Coordinated world transitions reveal the remaining variants; about 1.8-2.4s per state. |
| 11.8-13.5s | Final product world settles while secondary motifs keep moving. |
| 13.5-15.0s | Optional CTA responds; final selected state holds for at least one second. |

Scale proportionally for a 12-second output. Do not remove the opening teaching beat or final hold.

## Motion, type, and camera

- Camera stays locked; no dolly, orbit, cutaway, or handheld drift.
- Local hero tilt, shallow layered parallax, foreground overlap, spring physics, elastic overshoot, squash-and-stretch, and masked replacement are allowed.
- Derive one unique motion accent from each variant's motif while preserving the shared chain.
- Show only approved exact text. Use masks to control outgoing/incoming overlap; never morph letters through pseudo-text.
- If interaction is requested, keep the small pointer's tip near its activated target without obscuring the label.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** collection title, exact variant names, consistent subject family, final selection, CTA.
- **Scene:** one front-facing graphic stage, dominant central hero, broad title behind it, and coordinated palette/motif bundles; selectors only when requested.
- **Motion:** the world transition chain and relative reveal/settle timings; pointer causality only for an interactive brief.
- **Camera:** locked master canvas with local object depth and layered parallax.
- **Light:** coherent studio or illustrated lighting across variants; palette changes must not change object identity.
- **Style:** a material-rich central product overlapping broad heavy sans capitals, cream or another unifying field, glossy and textured molded ornaments mixed with flat blobs and warped checkerboards, cropped peripheral forms, shallow studio depth and spring-like scale/mask transitions. Keep the output pointer-free unless interaction is requested.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Name the hero's exit and entry, the shape carrying the field/title change, material contrasts, motif paths and final hold. Do not reduce the style to the phrase "Y2K animation."

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `12-15s`; prefer `15s` for four or more variants.
- **resolution:** prefer `1080p` or higher when supported; use `720p` only when the selected tier requires it.
- **generateAudio:** on when the model supports it; request soft whooshes and one tonal accent per state. Add restrained UI clicks only for an interactive brief. No voiceover by default.
- **image inputs:** role-label every URL in the prompt as `shell_lock`, `variant_source`, or `variant_lock_N`.
- **negativePrompt:** `giant mouse arrow, cursor mascot, cursor baked into reference still, browser chrome, equal main-product card grid, generic blue-purple gradient, inflated bubble lettering, vertically stretched headline, small peripheral hero, plain empty product backdrop, uniform plastic material, camera orbit, disconnected slideshow, mismatched product identity, blended products, text backing plate, illegible text, pseudo-letters, watermark`. For a style-only brief also exclude `mouse pointer, cursor, click indicator`.

## Acceptance gates

Reject and retry when any answer is no:

- Is the style-only film pointer-free? If interaction was requested, does a small subordinate pointer visibly cue each selection?
- Does a dominant material-rich hero overlap broad regular-proportion type, with flat and tactile ornaments around it?
- Does the same shell survive without layout or camera drift?
- Does each state resolve to the matching hero and exact name, including its selector when present?
- Are at least three worlds distinct while belonging to one family?
- Are outgoing and incoming objects separated rather than blended?
- Are all approved names readable with no transitional pseudo-letters?
- Does the result read as a bold product lookbook rather than ordinary website UI?
- Do product identity, title, palette and derived motifs change together while retaining visible material contrast?
- Does the final state hold for at least one second?

## Worked examples

1. A lighting collection: `DUSK`, `HALO`, `EMBER`, `MOSS`; large glass, metal and ceramic lights emerge through color masks with derived rings, tubes and light discs.
2. A fragrance collection: `SALT`, `MOSS`, `GLOW`; oversized bottles overlap broad names while liquid, granular and frosted motifs change with each scent world.
3. An explicitly interactive footwear catalog: a small pointer selects miniatures while one large shoe, its title and rubber/mesh-inspired graphics change together.

## Inspiration provenance

Visual and motion observations come from the [public reference](https://x.com/ShamsAmin56/status/2092188350476337613); its [disclosed prompt](https://x.com/ShamsAmin56/status/2092188357053071786) provides secondary intent. The [style analysis](references/style-analysis.md) records actual frames, the source's interface devices and the smaller-pointer user correction separately. Transfer the visual relationships using the user's products and copy.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/ba839737-b025-4b32-994e-f2084018a3cc/thumbnail-cursor-led-variant-world.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/ba839737-b025-4b32-994e-f2084018a3cc/preview-cursor-led-variant-world.mp4` |
| Canonical | central tactile hero · broad sans title behind product · mixed 2D/3D motifs · coordinated world transitions · optional catalog interaction |
