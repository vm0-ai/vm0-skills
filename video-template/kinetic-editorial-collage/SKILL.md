---
name: kinetic-editorial-collage
description: A fast warm-paper editorial collage where photographic cutouts, recurring evidence, oversized grotesk type, accent blocks, and local rule modules accumulate and repack through concurrent scale, crop, slide, and mask handoffs. Use for product launches, reports, collections, creative tools, or technology stories; not for generic moodboards, cinematic live action, quiet minimal films, or ordinary slideshows.
---

# Kinetic Editorial Collage

Create a 12-15 second paper-collage motion film with this reusable visual sentence:

`sparse specimen board -> opener assembles -> hero motif expands into an identity pivot -> evidence clusters accumulate around successive claims -> catalog field -> final identity board`

This is a shot, layout, and transition template, not a fixed campaign. Preserve the user's subject, approved copy, assets, and palette. Lock the front-facing canvas, layered accumulation, concurrent re-layouts, typographic rhythm, and final collection board.

## Brief contract

Require or infer:

- one exact final title of one to three words;
- one short opener and three to five exact claim or chapter phrases;
- two to four recurring anchor objects that appear early and survive across the film;
- three to five evidence clusters that may enter progressively, such as products, portraits, charts, photographs, diagrams, cards, or collection rows;
- one hero transition motif with a simple silhouette, such as a circle, book, card, dial, screen, or package;
- a paper, screen, or branded canvas material;
- one neutral, one dark, and two or three accent colors.

Prefer short phrases. Convert paragraphs into visual evidence rather than tiny text. The opener, claims, and final title may differ; do not force one title to replace every phrase.

## Reference contract

Use a small role-labeled asset set:

1. `anchor_lock`: two to four isolated hero objects with consistent rendering.
2. `canvas_lock`: background material, palette, local rule-line style, and typography hierarchy.
3. Optional `evidence_lock`: a clean sheet containing the charts, photos, portraits, product variants, or collection items allowed to enter progressively.
4. Optional `final_board_lock`: the intended final hierarchy when title or product identity must be exact.

Treat inspiration videos as analysis-only unless the user explicitly asks to use one as a motion reference. Never use a contact sheet or storyboard grid as a literal first frame.

## Visual style lock

The target is a contemporary art-book or independent magazine spread in motion, not a scrapbook, presentation slide, gallery of separate posters, or clean SaaS grid. Its energy comes from collision between photographic evidence, monumental typography, flat print color, and changing local structure on one tactile canvas.

### Canvas and color architecture

- Default to warm uncoated ivory paper with visible but restrained fiber and print grain. Let the paper remain a meaningful field rather than covering every pixel.
- Organize color by role: a warm neutral canvas, carbon-black type and rules, one hot accent such as signal red, one earthy accent such as ochre or acid yellow, and one cool counter-accent such as mint or pale cyan. If the user supplies another palette, preserve these contrast roles and alternating rhythm instead of copying the default hues literally.
- Use accent rectangles, circles, and strips as structural crops, masks, windows, or moving counterweights. Never use them as automatic backing plates behind text.

### Evidence material

- Mix materially different evidence on purpose: clean full-color product or object cutouts, monochrome portrait or documentary crops, black circular or waveform graphics, books or cards, diagrams, and small index marks. A film does not need every category, but it should combine photographic evidence with graphic information rather than repeat one hero object in every slot.
- Unify the inventory through crisp cut edges, shallow contact shadows, occasional photostat halftone, and consistent paper treatment. Keep the cutouts tactile and mostly front-facing; avoid glossy floating 3D renders.
- Establish two to four memorable anchors, then reuse the same recognizable instances as the board grows. Later density should come from accumulated evidence and changed scale, not unrelated new props.

### Layout and scale

- Compose asymmetrically with large areas of paper interrupted by dense local clusters. Alternate a sparse field with a compressed evidence zone; do not center every hero or distribute modules evenly.
- Create aggressive scale collisions: a giant cropped word or letter may span most of the frame while a row of tiny evidence cards, index marks, or rule lines crosses it. Use off-edge crops on photographs and type so the frame feels extracted from a larger editorial system.
- Rule lines and module borders are thin, local, and temporary. They may divide one quadrant or align a row, but a permanent equal-cell grid makes the result look like a dashboard.
- Let objects occlude letters and let letters pass behind photographs, while preserving one clean readable state for each approved phrase. Layering should feel deliberate, never like a pile of stickers.

### Typography and print finish

- Use one heavy grotesk or condensed sans family at extreme scale, paired with a restrained neutral face for any approved microtype. Favor uppercase, tight leading, and strong horizontal baselines.
- Use solid black, outline, and occasional single-accent type states. A phrase may change from outline to solid or become a crop mask, but it may not sit on a caption bar, rounded label, translucent panel, shadow plate, or highlight strip.
- Keep paper fibers, ink grain, halftone, and slight edge roughness subtle enough that typography and object silhouettes remain crisp. Avoid distressed grunge overlays, torn-notebook clichés, tape on every object, or nostalgic scrapbook decoration.

### Motion character

Movement should resemble a designer rapidly reformatting one live magazine spread: rigid quarter-turns, sharp crop-window changes, precise slides, short scale overshoots, and foreground pieces acting as wipes while neighboring modules move at the same time. Avoid liquid morphing, smooth cinematic zooms, generic cross-fades, or one centered object changing at a time.

### Keyframe-first approval gate

Never generate the video on the same uninterrupted pass that establishes a new visual direction. First create seven 16:9 keyframes matching the seven-beat timeline below:

1. sparse opener;
2. identity pivot;
3. first evidence field;
4. typographic gate;
5. comparison or collection row;
6. catalog field;
7. final identity board.

Generate beat 1 first. After it is clean, use it only as a style-and-recurring-object reference for beats 2-7 while explicitly allowing each composition to change. Keep the same canvas material, palette, object rendering, typography family, and recurring anchors across all seven frames.

Every approved phrase must be exact and rendered directly on the canvas or on a real subject object. Do not place a rectangular banner, subtitle bar, label strip, highlight block, or separate background panel behind text merely to improve legibility. Reject extra words, pseudo-text, logos, and watermarks.

Crop all candidates to the intended 16:9 active canvas, assemble an ordered contact sheet, inspect each full-resolution frame, and show the set to the user. Stop before video generation. Video generation requires explicit approval of the keyframes; if the user requests changes, revise only the rejected frames and repeat this gate.

### Approved motion guide

Static reference videos are unsafe for this template: readable placeholders tend to leak into the result, while a guide with no words causes the model to preserve blank type blocks. Only after the keyframes are approved, render a copy-specific motion guide containing the user's own seven phrases.

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

Inspect the rendered guide once for spelling, then upload it with `okou web upload-file`. Tell the video model to preserve the approved keyframes, guide timing, exact copy, and trajectories while replacing the guide's generic shapes with the approved subject matter. Never repair model text by adding a solid background strip in post-production; retry the affected beat or use a typography treatment already approved in its keyframe.

Reference priority is:

1. approved keyframe composition, direct typography, and recurring-object identity;
2. exact copy already rendered into the custom guide;
3. supplied identity assets and the user's subject, palette, and evidence content;
4. custom-guide timing, layout density, and object trajectories;
5. generic guide shapes, which must be replaced by the user's subject matter.

If reference video is unavailable, omit the guide and follow the written grammar below. Never substitute the original inspiration video for the custom guide.

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

### Seven-beat timeline

| Time | Required beat |
| --- | --- |
| 0.0-1.6s | Sparse specimen board; anchors enter from crop edges; opener builds from outline to solid while evidence begins moving. |
| 1.6-3.0s | Hero motif rolls, rotates, or scales across the title zone; abbreviated identity or pivot phrase resolves over or around it. |
| 3.0-5.4s | First dense evidence field; local modules repack concurrently around claim 1. |
| 5.4-6.8s | Fast typographic gate; oversized letters, numerals, or a geometric wipe reveal claim 2. |
| 6.8-8.7s | Comparison or collection row forms around claim 3; introduce one new coherent evidence cluster. |
| 8.7-10.8s | Catalog field or editorial noun holds briefly while portraits, products, charts, or cards continue to settle. |
| 10.8-15.0s | Recurring anchors and evidence gather into the final identity board; title and optional subtitle resolve, with the last second calm and legible. |

Scale proportionally for 12 seconds. Keep all seven functions even if two adjacent beats share one continuing object. Before the final second, no layout may remain materially unchanged for more than about 1.2 seconds.

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

- **Subject:** exact opener, pivot phrase, claims, final title and subtitle; recurring anchors; progressive evidence clusters.
- **Scene:** one persistent canvas, palette, local grid language, type hierarchy, and the density arc from sparse to collected.
- **Motion:** the seven-beat timeline; one dominant carrier plus at least two secondary actions for every re-layout; exact readable windows for copy.
- **Camera:** locked front-facing master canvas with no perspective changes.
- **Light:** flat soft illumination, shallow cutout shadows, restrained highlights, consistent across all beats.
- **Style:** contemporary art-book collage on warm uncoated paper, mixing crisp photographic evidence, photostat texture, carbon-black local rules, structural red/ochre/cool accent blocks, extreme-scale grotesk typography, deliberate occlusion, and a fast reformatting rhythm. Translate the user's brand into these material and contrast roles rather than defaulting to a scrapbook or dashboard.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say "dynamic collage." Name the exact text, recurring anchors, progressive evidence, seven layout functions, and the carrier plus secondary actions for each transition.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `15s` when using the copy-specific guide; `12-15s` for text-only fallback.
- **resolution:** prefer `1080p` or higher when supported.
- **generateAudio:** on when supported; request a brisk percussive editorial bed with paper slides, snaps, restrained scratches, and one low final accent. No voiceover by default.
- **video input:** only after keyframe approval, pass the uploaded copy-specific `motion_guide` as the motion reference. Do not pass the original inspiration video.
- **image inputs:** role-label approved keyframes as `beat_01` through `beat_07`; also label any separate user assets as `anchor_lock`, `canvas_lock`, `evidence_lock`, or `final_board_lock`. When a model cannot combine the approved frame inputs with reference video, do not silently discard the keyframes; ask whether frame fidelity or motion fidelity takes priority, or select a supported mode that preserves both.
- **negativePrompt:** `generic moodboard, nostalgic scrapbook, sticker pile, torn-notebook collage, clean SaaS dashboard, equal card grid, glossy floating 3D renders, generic guide shapes in final output, rectangular banner behind text, subtitle bar, label strip, highlight block, separate text background panel, unreadable placeholder glyphs, ordinary slideshow, one phrase at a time on an empty screen, full-screen erase between every phrase, generic cross-fades, permanent full-canvas tile grid, single giant object held for seconds, long empty title hold, cinematic camera move, 3D fly-through, unrelated objects, object mutation, pseudo-text, misspelling, stock-ad polish, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Were all seven keyframes reviewed at full resolution and explicitly approved before any video generation call?
- Is typography integrated directly into the canvas or a real subject object, with no artificial banner, subtitle bar, label strip, highlight block, or background panel?
- Are there seven distinct layout functions, including the identity pivot and catalog field?
- Do at least two recognizable anchors persist while evidence accumulates progressively?
- Does every transition combine one dominant carrier with at least two coordinated secondary actions?
- Does the canvas stay front-facing while local modules, rather than the camera, create energy?
- Are rule lines local and changing rather than a permanent rigid screen grid?
- Does the film retain the warm-paper editorial collision of photographic evidence, structural accent color, extreme-scale type, and deliberate occlusion instead of becoming a scrapbook or dashboard?
- Is every approved phrase exact and cleanly readable at least once, without demanding total isolation from adjacent beats?
- Does the output preserve the exact copy from the custom guide while replacing its generic shapes with the user's subject matter?
- Is the pre-final pacing dense, with no unintended multi-second empty hold or prolonged single-object takeover?
- Does the final board gather the recurring anchors and evidence into a legible title hierarchy for the last second?

## Worked examples

1. `FIELD ATLAS`: opener `READ THE TERRAIN`, pivot `ATLAS`, claims `OBSERVE`, `MAP SIGNALS`, `CONNECT ROUTES`, catalog phrase `FIELD NOTES`, final `FIELD ATLAS`.
2. `STUDIO SYSTEM`: opener `MAKE FASTER`, pivot `SYSTEM`, claims `TEST IDEAS`, `REFINE`, `SHIP TOGETHER`, catalog phrase `TOOLKIT`, final `STUDIO SYSTEM`.
3. `MARKET SIGNALS`: opener `SEE THE SHIFT`, pivot `SIGNALS`, claims `WATCH`, `COMPARE`, `DECIDE`, catalog phrase `EVIDENCE`, final `MARKET SIGNALS`.

## Inspiration provenance

The motion and style grammar were reverse-engineered from the public reference supplied by the user: `https://x.com/haoailab/status/2095223988201120039/video/1`. The reference establishes a warm-paper modernist editorial surface, photographic evidence mixed with books, devices, portraits and waveform-like graphics, a black/red/ochre/mint contrast system, giant grotesk type, layered accumulation, concurrent local re-layouts, and a final identity board. Preserve those visual relationships, not the literal palette or subject matter. Do not reuse its brand, claims, people, products, or footage unless the user explicitly requests that specific reproduction.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/thumbnail-kinetic-editorial-collage.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/preview-kinetic-editorial-collage.mp4` |
| Canonical | fixed paper canvas · layered accumulation · seven functional beats · concurrent local re-layouts · final identity board |
