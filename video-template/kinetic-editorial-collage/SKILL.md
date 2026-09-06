---
name: kinetic-editorial-collage
description: A fast modular editorial collage where one persistent asset inventory repacks around oversized exact typography through tile, mask, scale, and match-motion handoffs. Use for product launches, reports, creative tools, collections, event recaps, or technology stories; not for unrelated montage, cinematic live action, or free-camera scenes.
---

# Kinetic Editorial Collage

Create a 12-15 second modular motion-design film with one reusable visual sentence:

`sparse specimen board -> headline arrives -> one object bridges each re-layout -> same inventory repacks around new text beats -> evidence grid -> final collection board`

This is a **shot, layout, and transition template**, not a copy of any source campaign. Preserve the user's subject, approved copy, assets, and palette. Lock the persistent canvas, recurring inventory, oversized typography, and object-carried handoffs.

## Brief contract

Require or infer:

- one title of one to three words;
- three to five exact secondary text beats, each one to three words;
- four to eight recurring objects or image motifs;
- one hero object and one evidence motif such as a chart, waveform, strip, map, diagram, or photograph;
- a paper, screen, or branded canvas material;
- one neutral, one dark, and two or three accent colors.

Use short approved copy. If the brief contains paragraphs, convert them into visual evidence rather than tiny text.

## Reference contract

Use a small role-labeled asset set:

1. `inventory_lock`: four to eight isolated objects or clean cutouts with consistent rendering.
2. `canvas_lock`: paper grain, background material, palette, grid, and typography hierarchy.
3. Optional `evidence_lock`: one chart, waveform, map, interface crop, or photograph that must remain recognizable.
4. Optional `hero_lock`: the main product or object when identity accuracy is critical.

Never pass an inspiration video into generation. Do not treat a contact sheet or storyboard grid as a literal first frame. Encode the motion grammar in the written prompt and use references only to preserve the user's own assets.

## Locked shot grammar

### Persistent asset inventory

- Start with four to eight named assets and reuse that same inventory in every beat.
- Assets may leave the crop and return, but they must not mutate into unrelated props.
- Keep one evidence motif visible or returning so the sequence reads as one system.
- Introduce no more than one minor new accent after the opening inventory is established.

### Object-carried re-layout

Every transition must be physically handed off by at least one continuing element:

- a rectangle scales and becomes the next grid cell;
- a circle rotates and becomes a window, record, dial, or mask;
- a strip stretches and pulls the following row into place;
- an object crosses the frame edge and returns at the matching edge or scale;
- oversized type is masked by a foreground asset before the replacement appears.

No ordinary cuts and no generic cross-fades. The viewer should be able to point to the object that caused each new layout.

### Timeline

| Time | Required beat |
| --- | --- |
| 0.0-2.2s | Sparse canvas; three to five assets slide from crop edges; outlined title becomes solid. |
| 2.2-4.5s | Hero object scales forward and hands its shape into layout two; text beat 1. |
| 4.5-7.0s | Circle, strip, or card rotates or stretches into a new module system; text beat 2. |
| 7.0-9.5s | Inventory packs into aligned rows or a comparison grid; text beat 3. |
| 9.5-12.2s | Evidence motif enlarges; foreground object masks the next exact phrase; optional text beat 4. |
| 12.2-15.0s | All recurring assets gather into a balanced final board; exact title returns and holds. |

Scale the beat lengths proportionally for 12 seconds. Keep at least five distinct layouts and the final one-second hold.

## Typography, camera, and surface

- Use one oversized grotesk family with outline and solid variants; type may sit behind objects but an entire approved phrase must remain readable.
- Fully mask outgoing text before replacing it. Never morph letters through pseudo-text.
- Camera is a fixed front-facing master canvas. A single two-to-four-percent push-in across the whole film is allowed; no dolly, orbit, handheld drift, or perspective scene change.
- Use crisp ease-out slides, one restrained overshoot per hero enlargement, sharp masks, 90-degree or half-turn rotations, and tactile paper-depth shadows.
- Make layouts asymmetrical but aligned. Preserve intentional negative space; do not fill every gap with decoration.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** exact title, exact secondary beats, named hero, recurring inventory, evidence motif.
- **Scene:** one persistent canvas, palette, grid, and ordered layout functions.
- **Motion:** the six-beat timeline and the specific object that carries every transition.
- **Camera:** fixed front-facing master canvas with only a subtle global push-in.
- **Light:** flat soft illumination, shallow paper or cutout shadows, restrained object highlights.
- **Style:** premium modernist editorial collage, oversized exact typography, tactile analog surface, fast legible motion-design rhythm, user-specified brand direction.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say “dynamic collage.” Name the inventory, exact copy, six layouts, and each object-carried handoff.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `12-15s`; prefer `15s` for five or six layouts.
- **resolution:** prefer `1080p` or higher when supported.
- **generateAudio:** on when supported; request a precise percussive editorial bed with soft paper slides, snaps, and one low accent at the final gather. No voiceover by default.
- **image inputs:** role-label each URL as `inventory_lock`, `canvas_lock`, `evidence_lock`, or `hero_lock`.
- **negativePrompt:** `unrelated montage, generic cross-fades, cinematic camera move, 3D fly-through, new unrelated objects, object morphing, cluttered scrapbook, fully obscured title, pseudo-text, misspelling, excessive microcopy, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Does one recognizable asset inventory persist across the film?
- Does at least one object visibly carry every layout transition?
- Are there at least five materially different but coherent arrangements?
- Is the camera still a front-facing master canvas?
- Are all approved phrases exact, readable, and free of pseudo-text?
- Is foreground occlusion deliberate rather than hiding the message?
- Does the final board gather the recurring inventory and hold for one second?

## Worked examples

1. `FIELD ATLAS`: notebook, compass, camera, contour map, specimen cards, leaves, and one archival photograph re-layout around `OBSERVE`, `MAP`, `CONNECT`, `DISCOVER`.
2. `STUDIO SYSTEM`: keyboard, pen, swatch cards, grid notebook, speaker, and interface crop re-layout around `MAKE`, `TEST`, `REFINE`, `SHIP`.
3. `MARKET SIGNALS`: report cover, chart strip, microphone, newspaper crop, phone, and portrait tiles re-layout around `WATCH`, `COMPARE`, `DECIDE`, `MOVE`.

## Inspiration provenance

The motion grammar was reverse-engineered from the public reference supplied by the user: `https://x.com/haoailab/status/2095223988201120039/video/1`. The source is analysis-only. Do not reuse its FastH3 branding, product claims, typography copy, object inventory, palette sequence, people, or footage, and never provide the source video as a generation input.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/thumbnail-kinetic-editorial-collage.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/40667930-5be5-4894-a592-0d052ae35996/preview-kinetic-editorial-collage.mp4` |
| Canonical | persistent canvas · same asset inventory · oversized exact type · object-carried re-layouts · final collection board |
