---
name: kinetic-editorial-collage
description: A fast front-facing editorial collage where recurring anchors, new evidence clusters, oversized type, and local grid modules accumulate and repack through concurrent scale, crop, slide, and mask handoffs. Use for product launches, reports, collections, creative tools, or technology stories; not for cinematic live action, quiet minimal films, or ordinary slideshows.
---

# Kinetic Editorial Collage

Create a 5-15 second paper-collage motion film with this reusable visual sentence:

`sparse specimen board -> opener assembles -> hero motif expands into an identity pivot -> evidence clusters accumulate around successive claims -> catalog field -> final identity board`

This is a shot, layout, and transition template, not a fixed campaign. Preserve the user's subject, approved copy, assets, and palette. Lock the front-facing canvas, layered accumulation, concurrent re-layouts, typographic rhythm, and final collection board.

## Brief contract

Require or infer:

- one exact final title of one to three words;
- duration-appropriate exact copy: an opener, one dense middle phrase and a final title for 5-7 seconds; five functional phrases for 8-11 seconds; or the full opener, pivot, three claims, catalog phrase and final title for 12-15 seconds;
- two to four recurring anchor objects that appear early and survive across the film;
- two to five evidence clusters that may enter progressively, such as products, portraits, charts, photographs, diagrams, cards, or collection rows;
- one hero transition motif with a simple silhouette, such as a circle, book, card, dial, screen, or package;
- a paper, screen, or branded canvas material;
- one neutral, one dark, and two or three accent colors.

Prefer short phrases. Convert paragraphs into visual evidence rather than tiny text. The opener, claims, and final title may differ; do not force one title to replace every phrase or compress seven text beats into a five-second film.

## Reference contract

Use a small role-labeled asset set:

1. `anchor_lock`: two to four isolated hero objects with consistent rendering.
2. `canvas_lock`: background material, palette, local rule-line style, and typography hierarchy.
3. Optional `evidence_lock`: a clean sheet containing the charts, photos, portraits, product variants, or collection items allowed to enter progressively.
4. Optional `final_board_lock`: the intended final hierarchy when title or product identity must be exact.

Treat inspiration videos as analysis-only unless the user explicitly asks for a one-off motion-reference reproduction. When the user explicitly approves still-frame composition reference, source screenshots may guide the mother-keyframe geometry once, but replace every source brand, person, product, word and recognizable image. Never pass the inspiration video into a reusable template run. Never use a contact sheet or storyboard grid as a literal first frame.

### Keyframe-first approval gate

Never generate the video on the same uninterrupted pass that establishes a new visual direction. Start with three 16:9 mother keyframes:

1. `sparse_opener`: a few recurring anchors and the exact opener on a largely open canvas;
2. `dense_transition`: the hardest mid-film re-layout at peak overlap, with inherited anchors, accumulated evidence, oversized cropped type, one dominant carrier and at least two coordinated secondary actions;
3. `final_board`: the complete recurring inventory repacked around the exact final title.

Generate `sparse_opener` first. After it is clean, use it as the canvas, palette, typography, object-rendering and recurring-anchor reference for the other two while explicitly allowing their compositions to change. Later frames must visibly reuse the established objects; three unrelated posters fail even when their colors match.

Use the approved mother trio directly for 5-7 seconds. For 8-11 seconds, expand to five keyframes by adding an identity pivot and a comparison or catalog state. For 12-15 seconds, expand to the full seven functions: sparse opener, identity pivot, first evidence field, typographic gate, comparison or collection row, catalog field and final identity board. Add frames only after the mother trio is coherent.

Every approved phrase must be exact and rendered directly on the canvas or on a real subject object. Do not place a rectangular banner, subtitle bar, label strip, highlight block or separate background panel behind text merely to improve legibility. Reject extra words, pseudo-text, logos and watermarks.

Crop all candidates to the intended 16:9 active canvas, assemble an ordered contact sheet, inspect each full-resolution frame and show the set to the user. Stop before video generation. Video generation requires explicit approval of the duration-appropriate keyframes; if the user requests changes, revise only the rejected frames and repeat this gate.

### Long-form copy-specific motion guide

For the full 12-15 second, seven-phrase form, static reference videos are unsafe: readable placeholders tend to leak into the result, while a guide with no words causes the model to preserve blank type blocks. Only after all seven keyframes are approved, render a copy-specific motion guide containing the user's own seven phrases.

Resolve `scripts/render_motion_guide.py` and `assets/motion-guide-base.mp4` relative to this `SKILL.md`, then run:

```bash
python3 scripts/render_motion_guide.py \
  --output /tmp/kinetic-editorial-motion-guide.mp4 \
  --opener "<exact opener>" \
  --pivot "<exact identity pivot>" \
  --claim-one "<exact claim 1>" \
  --claim-two "<exact claim 2>" \
  --claim-three "<exact claim 3>" \
  --catalog "<exact catalog phrase>" \
  --title "<exact final title>" \
  --subtitle "<optional exact subtitle>"
```

The renderer uses Python's standard library and ffmpeg; it makes no network calls. It overlays the user's exact copy onto an original, programmatically drawn motion base containing no readable placeholders and no pixels, people, logos, products, or audio from the inspiration source.

Inspect the rendered guide once for spelling, then upload it with `okou web upload-file`. Tell the video model to preserve the approved keyframes, guide timing, exact copy and trajectories while replacing the guide's generic shapes with the approved subject matter. Never repair model text by adding a solid background strip in post-production; retry the affected beat or use a typography treatment already approved in its keyframe.

Do not use the seven-phrase guide for a 5-11 second film. Drive those tiers with the ordered approved keyframes and the written duration grammar below so the short film does not become unreadable.

Reference priority is:

1. approved keyframe composition, direct typography, and recurring-object identity;
2. exact copy already rendered into the custom guide;
3. supplied identity assets and the user's subject, palette, and evidence content;
4. custom-guide timing, layout density, and object trajectories;
5. generic guide shapes, which must be replaced by the user's subject matter.

### Reference input routing

Inspect `okou generate video -h` immediately before generation and honor the selected model's current media constraints. Do not pass `--model` unless the user named one.

MiniMax H3 treats first/last-frame inputs and ordinary image/video references as mutually exclusive. For a short run whose three approved mother frames all matter, pass the ordered frames as image references without first/last-frame flags. Use first/last-frame mode only when no midpoint lock is required. For the long form, if the selected model cannot combine the approved keyframes with the copy-specific motion guide, ask whether frame fidelity or motion fidelity takes priority; never silently discard keyframes or substitute the inspiration video.

For the long form, if reference video is unavailable, omit the guide and follow the written grammar below. Never substitute the original inspiration video for the custom guide.

## Locked shot grammar

### Layered accumulation

- Establish two to four recurring anchors during the opening. Keep at least two recognizable throughout the film, even when cropped, scaled, recolored, or briefly occluded.
- Add one coherent evidence cluster at a time. The opening does not need to reveal the entire inventory.
- Reuse prior anchors and evidence in later layouts; do not reset to an empty canvas between phrases.
- Let several layers coexist. The film should become richer and denser before resolving into the final board.
- Do not mutate an established object into an unrelated prop.

### Concurrent re-layout

Each transition has one dominant carrier and two or more coordinated secondary actions:

- a circle rolls or scales while neighboring modules split and type changes state;
- a card or package rotates while a photograph crops in and a row aligns;
- a strip stretches while products populate its baseline and a claim slides into place;
- a foreground cutout crosses the canvas while local rule lines redraw and the next phrase resolves;
- a large letter, numeral, or shape becomes a temporary wipe while recurring objects re-enter at matching edges.

The carrier does not need to cover the whole frame. Preserve visual continuity through matching position, edge, scale, silhouette, or direction. Avoid ordinary cuts, generic cross-fades, and one-object-at-a-time slideshow motion.

### Duration grammar

For a 5-second film, keep three functions:

| Time | Required beat |
| --- | --- |
| 0.0-1.2s | Begin from the approved sparse opener; anchors enter from crop edges while the exact opener resolves. |
| 1.2-3.4s | One dominant anchor carries a concurrent multi-layer re-layout into the approved dense transition; inherited evidence stays visible while new evidence enters. |
| 3.4-5.0s | A local shape or letter wipe repacks every recurring anchor into the approved final board; keep the final 0.6-0.8 seconds calm and legible. |

For 8-11 seconds, use five functions: sparse opener, identity pivot, dense evidence field, comparison or catalog state, and final identity board. Keep at least 0.8 seconds for the final board and give every transition one dominant carrier plus two coordinated secondary actions.

For 12-15 seconds, use the full seven-beat timeline:

| Time | Required beat |
| --- | --- |
| 0.0-1.6s | Sparse specimen board; anchors enter from crop edges; opener builds from outline to solid while evidence begins moving. |
| 1.6-3.0s | Hero motif rolls, rotates, or scales across the title zone; abbreviated identity or pivot phrase resolves over or around it. |
| 3.0-5.4s | First dense evidence field; local modules repack concurrently around claim 1. |
| 5.4-6.8s | Fast typographic gate; oversized letters, numerals, or a geometric wipe reveal claim 2. |
| 6.8-8.7s | Comparison or collection row forms around claim 3; introduce one new coherent evidence cluster. |
| 8.7-10.8s | Catalog field or editorial noun holds briefly while portraits, products, charts, or cards continue to settle. |
| 10.8-15.0s | Recurring anchors and evidence gather into the final identity board; title and optional subtitle resolve, with the last second calm and legible. |

Scale the table proportionally for 12 seconds. Keep all seven functions even if two adjacent beats share one continuing object. Before the final second, no layout may remain materially unchanged for more than about 1.2 seconds.

## Typography, canvas, and motion

- Use one bold grotesk family with solid and outline states. Favor large words on a stable horizontal baseline.
- A departing and arriving phrase may overlap for 0.2-0.4 seconds during a deliberate mask or outline-to-solid handoff. Do not require full-screen erasure between phrases.
- Give every approved phrase a clean readable state. Transitional overlap must not create pseudo-words or imply an unintended combined claim.
- Keep the camera fixed and front-facing. Motion happens inside the canvas through crop, scale, rotation, slide, mask, and local parallax; no dolly, orbit, handheld drift, or perspective scene change.
- Use crisp snaps, brisk ease-outs, rigid quarter-turns or half-turns, short overshoots, and slight tactile jitter. Avoid one long smooth zoom dominating the film.
- Use warm tactile paper, photographed or illustrated cutouts, rough-but-controlled edges, shallow contact shadows, and occasional grain.
- Rule lines and module borders are local compositional devices that may appear, split, and disappear. Do not impose a permanent full-screen tile grid on every beat.
- Keep the collage asymmetrical but balanced. Allow strategic occlusion and cropped type while preserving one clearly readable state for each phrase.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** every exact phrase required by the selected duration tier; recurring anchors; progressive evidence clusters; final title and optional subtitle.
- **Scene:** one persistent canvas, palette, local grid language, type hierarchy, and the density arc from sparse to collected.
- **Motion:** the duration-selected layout functions; one dominant carrier plus at least two secondary actions for every re-layout; exact readable windows for copy.
- **Camera:** locked front-facing master canvas with no perspective changes.
- **Light:** flat soft illumination, shallow cutout shadows, restrained highlights, consistent across all beats.
- **Style:** premium modernist editorial collage, tactile analog surface, oversized typography, fast layered rhythm, and the user's specified brand direction.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say "dynamic collage." Name the exact text, recurring anchors, progressive evidence, duration-selected layout functions, and the carrier plus secondary actions for each transition.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `5-15s`; use the three-, five- or seven-function tier above. Use `15s` when using the copy-specific seven-phrase guide.
- **resolution:** prefer `1080p` or higher when supported.
- **generateAudio:** on when supported; request a brisk percussive editorial bed with paper slides, snaps, restrained scratches, and one low final accent. No voiceover by default.
- **video input:** for the long form only and after keyframe approval, pass the uploaded copy-specific `motion_guide` as the motion reference. Do not pass the original inspiration video.
- **image inputs:** role-label the three, five or seven approved keyframes in time order; also label separate user assets as `anchor_lock`, `canvas_lock`, `evidence_lock`, or `final_board_lock`. Follow the reference input routing above.
- **negativePrompt:** `generic guide shapes in final output, rectangular banner behind text, subtitle bar, label strip, highlight block, separate text background panel, unreadable placeholder glyphs, ordinary slideshow, one phrase at a time on an empty screen, full-screen erase between every phrase, generic cross-fades, permanent full-canvas tile grid, single giant object held for seconds, long empty title hold, cinematic camera move, 3D fly-through, unrelated objects, object mutation, cluttered scrapbook, pseudo-text, misspelling, stock-ad polish, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Were all duration-appropriate keyframes reviewed at full resolution and explicitly approved before any video generation call?
- Is typography integrated directly into the canvas or a real subject object, with no artificial banner, subtitle bar, label strip, highlight block, or background panel?
- Are there three, five or seven distinct layout functions matching the selected duration tier?
- Do at least two recognizable anchors persist while evidence accumulates progressively?
- Does every transition combine one dominant carrier with at least two coordinated secondary actions?
- Does the canvas stay front-facing while local modules, rather than the camera, create energy?
- Are rule lines local and changing rather than a permanent rigid screen grid?
- Is every approved phrase exact and cleanly readable at least once, without demanding total isolation from adjacent beats?
- When the long-form custom guide is used, does the output preserve its exact copy while replacing generic shapes with the user's subject matter?
- Is the pre-final pacing dense, with no unintended multi-second empty hold or prolonged single-object takeover?
- Does the final board gather the recurring anchors and evidence into a legible title hierarchy for the selected final hold: 0.6-0.8 seconds at 5 seconds, or at least one second in longer films?

## Worked examples

1. `FIELD ATLAS`: opener `READ THE TERRAIN`, pivot `ATLAS`, claims `OBSERVE`, `MAP SIGNALS`, `CONNECT ROUTES`, catalog phrase `FIELD NOTES`, final `FIELD ATLAS`.
2. `STUDIO SYSTEM`: opener `MAKE FASTER`, pivot `SYSTEM`, claims `TEST IDEAS`, `REFINE`, `SHIP TOGETHER`, catalog phrase `TOOLKIT`, final `STUDIO SYSTEM`.
3. `MARKET SIGNALS`: opener `SEE THE SHIFT`, pivot `SIGNALS`, claims `WATCH`, `COMPARE`, `DECIDE`, catalog phrase `EVIDENCE`, final `MARKET SIGNALS`.

## Inspiration provenance

The motion grammar was reverse-engineered from the public reference supplied by the user: `https://x.com/haoailab/status/2095223988201120039/video/1`. The reference establishes layered accumulation, seven functional beats, concurrent local re-layouts, progressive evidence, and a final identity board. Do not reuse its brand, claims, people, or footage unless the user explicitly requests that specific reproduction.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/thumbnail-kinetic-editorial-collage.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/preview-kinetic-editorial-collage.mp4` |
| Canonical | fixed paper canvas · layered accumulation · seven functional beats · concurrent local re-layouts · final identity board |
