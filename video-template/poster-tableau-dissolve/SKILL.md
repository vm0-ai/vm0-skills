---
name: poster-tableau-dissolve
description: A flat editorial title film of locked poster tableaux connected by geometry-aware dissolves while one recurring subject travels in one screen direction. Use for fashion, music, festivals, culture, destinations, illustrated narratives, or atmospheric brand films; not for photoreal action coverage or free-camera 3D journeys.
---

# Poster-Tableau Dissolve

Create a 15-22 second graphic film with one reusable visual sentence:

`title tableau -> recurring subject enters -> flat worlds dissolve around one continuous trajectory -> monumental passage -> closing motif echoes the opening`

This is a **shot and transition template**, not a fixed retro look. Preserve the user's subject, title, palette, and setting. Lock the poster composition, one-direction travel, and geometry-aware dissolve grammar.

## Brief contract

Require or infer:

- exact title and optional closing line;
- one recurring moving subject with a clear silhouette;
- one fixed screen direction;
- six to ten flat tableau locations;
- a limited palette and two or three recurring geometric motifs;
- one opening-to-closing visual echo.

Prefer paper airplane, ribbon, bird, bicycle, umbrella, ball, vehicle, or another silhouette that survives overlap. Identity-heavy people require a separate character lock.

## Reference contract

Use purpose-built full-screen stills only:

1. `style_subject_lock`: subject silhouette, material, palette, flat-plane construction, and shadow language.
2. `opening_lock`: exact title composition and subject entry position.
3. Two or three `tableau_lock_N`: representative environments with compatible subject scale and direction.
4. Optional `closing_lock`: final motif and title relationship.

Do not feed a multi-panel storyboard as one frame. Treat inspiration videos as analysis-only evidence and never pass them to video generation.

## Locked shot grammar

### Tableau construction

- Lock every shot like a theatrical stage or printed poster.
- Use large flat planes, hard silhouettes, deliberate crops, long geometric shadows, and one dominant spatial idea per tableau.
- Valid spatial ideas include stripes, corridor, stairs, repeating storefronts, circular sun, bridge, monumental letters, or stacked slabs.
- Keep subject scale, baseline, silhouette, and screen direction plausible through every dissolve.
- Allow local lateral action only; no dolly, orbit, handheld drift, or cinematic fly-through.

### Geometry-aware dissolve

Every handoff must align at least two of these:

- subject position and velocity;
- one dominant diagonal, vertical edge, circle, or vanishing point;
- one large color block in the same screen region;
- a shadow or trail that becomes architecture in the next scene.

Begin the next tableau's geometry before the previous one disappears. The subject continues through the overlap without freezing, reversing, duplicating, or teleporting. A plain opacity fade between unrelated images fails the template.

### Timeline

| Time | Required beat |
| --- | --- |
| 0.0-2.0s | Exact title tableau establishes palette, crops, motifs, and travel direction. |
| 2.0-5.0s | Subject enters; first aligned dissolve teaches continuous travel. |
| 5.0-9.0s | Two wide poster worlds change environment while preserving stride or flight. |
| 9.0-13.0s | Scale escalation: giant glyph, circle, or shadow becomes monumental architecture. |
| 13.0-18.5s | Perspective corridor or street tableau increases depth without moving the camera. |
| 18.5-22.0s | Opening motif returns at a new scale; exact closing line or title holds. |

For a 15-second output, keep the same six functions and compress intermediate holds. Do not remove the monumental passage or closing echo.

## Typography and continuity

- Limit text to the exact title and optional closing line.
- Letters may become flat architecture only when their original geometry remains legible.
- Alternate wide tableaux with at most one extreme detail and one perspective corridor.
- Increase or vary scale without losing the subject trajectory.
- Never create decorative pseudo-writing, unrelated signage, or a second copy of the subject during overlap.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** exact title, recurring subject, fixed travel direction, closing line.
- **Scene:** ordered flat tableaux, limited palette, recurring motifs, opening and closing echo.
- **Motion:** continuous trajectory and the two-property spatial alignment for every dissolve.
- **Camera:** one locked orthographic poster view per tableau; no free-camera language.
- **Light:** graphic flat light and long directional shadows consistent with the palette.
- **Style:** premium editorial title design, screenprint or cut-paper depth, bold crops, crisp silhouettes, geometry-led transitions.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say “smooth transitions.” State which subject path, edge, circle, color block, shadow, or vanishing point bridges each handoff.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `15-22s`; choose a model tier that supports the requested length.
- **resolution:** prefer `1080p` or higher when supported.
- **generateAudio:** on when supported; request restrained rhythmic texture and soft transition swells, no voiceover by default.
- **image inputs:** role-label each URL as `style_subject_lock`, `opening_lock`, `tableau_lock_N`, or `closing_lock`.
- **negativePrompt:** `hard-cut montage, unrelated opacity fades, duplicated subject, ghost subject, reversed direction, teleporting, camera dolly, orbit, handheld drift, photoreal 3D fly-through, busy signage, pseudo-text, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Is every shot readable as a strong flat poster composition?
- Does one recognizable subject travel in one direction throughout?
- Does each dissolve align at least two spatial properties?
- Is there no generic fade, teleport, duplicate subject, or free-camera move?
- Does scale vary or escalate without losing the visual thread?
- Does the final motif visibly echo the opening?
- Is the exact title clean at the opening and closing?

## Worked examples

1. `PASSAGE`: a paper airplane travels left-to-right through sun, striped city, stairs, corridor, and giant circular portal tableaux.
2. `AFTER DARK`: a red bicycle crosses nightlife posters, repeating windows, a diagonal bridge, and a moon that becomes the closing record label.
3. `TIDELINE`: a ribbon-like fish moves right-to-left through wave bands, beach umbrellas, breakwater slabs, and a sun that returns as an eye-like closing motif.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/8684bf6d-daf4-45c4-a287-163d48724867/thumbnail-poster-tableau-dissolve.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/8684bf6d-daf4-45c4-a287-163d48724867/preview-poster-tableau-dissolve.mp4` |
| Canonical | locked flat tableaux · one subject and direction · spatially aligned dissolves · scale escalation · closing visual echo |
