---
name: retro-noir-vector
description: Create retro graphic-noir films with flat printed color planes, small expressive silhouettes, monumental type and architecture, long shadows, scale contrasts and connected cross-dissolves. Use for cultural titles, music, fashion and illustrated narratives.
---

# Retro Noir Vector

Create a 15-22 second graphic film with one reusable visual sentence:

`graphic title/tableau -> silhouette action -> connected dissolving posters -> monumental scale change -> an earlier motif returns as the closing emblem`

Preserve the user's subject, title, palette and setting while carrying over the source's printed vector surface, silhouette drama, poster compositions and connected dissolves. Read [the source style analysis](references/style-analysis.md) before constructing the visual prompt; it documents multiple movement axes, scale changes and actual typography in the reference.

## Brief contract

Require or infer:

- exact title and optional closing line;
- a recurring subject or small cast with clear, distinguishable silhouettes;
- coherent local paths and a planned visual handoff when an axis or viewpoint changes;
- six to ten flat tableau locations;
- a limited palette and two or three recurring geometric motifs;
- an earlier motif that can return as a closing image.

Prefer paper airplane, ribbon, bird, bicycle, umbrella, ball, vehicle, or another silhouette that survives overlap. Identity-heavy people require a separate character lock.

## Reference contract

Use purpose-built full-screen stills only:

1. `style_subject_lock`: subject silhouette, material, palette, flat-plane construction, and shadow language.
2. `opening_lock`: exact title composition and subject entry position.
3. Two or three `tableau_lock_N`: representative environments with compatible subject scale and direction.
4. Optional `closing_lock`: final motif and title relationship.

Do not feed a multi-panel storyboard as one frame. Treat inspiration videos as analysis-only evidence and never pass them to video generation.

## Visual style lock

The target is a retro film-noir graphic rendered as hard-edged 2D flat-vector motion design, not soft craft paper, a pastel storybook, or a photoreal cinematic sequence. Every frame should be strong enough to work as a standalone suspense poster while still belonging to one continuous world.

### Vector surface and palette

- Build the image from opaque flat-vector color planes with clear silhouette edges and fine, visibly mottled print grain inside the fills. Preserve the flat shape construction; avoid thick paper layers, beveled edges or distressed craft textures.
- Use a restricted subset of a shared palette in each tableau. Cream, black and navy supply light/dark structure; crimson, burnt orange and mustard give hot accents; dusty pink, slate and muted blue/cyan support scene changes. Translate these roles into the user's palette. Avoid airbrushed gradients, bloom, neon rim light or glossy 3D material.
- Let the palette change by recombining the same color roles across tableaux rather than introducing a new color system in every scene.
- Keep close-ups in the same graphic medium. The reference's final eye is flat colored geometry with fine grain, so a photographic insert is not a style requirement.

### Silhouette and geometry

- Reduce subjects and environments to flat-vector silhouettes, sharp wedges, broad rectangles, circles, stripes, and one-point corridors. Preserve only the few internal details needed to identify the recurring subject.
- Use long, clean solid shadows that follow the local scene's diagonal geometry. Keep shadows attached and legible; their direction can change when the scene's lighting/composition changes.
- Give each tableau one dominant geometric proposition, such as a vertical stripe rhythm, an oblique bridge, a circular portal, monumental slabs, or receding frames. Compose with aggressive crops and asymmetrical negative space rather than centering every subject.
- Contrast small figures with enormous letters, face fragments and architecture. Create apparent depth through scale, overlap, flat parallax and one-point geometry. Preserve a compressed theatrical stage while allowing scene-to-scene changes of scale and viewpoint.

### Typography

- Separate two roles: heavy cropped sans capitals create title rhythm, while a large filled high-contrast serif glyph can become architecture through its stem, counter and shadow. The source's cream D is solid, not outlined. Use an approved initial or symbol for the architectural role; rotated title fragments and edge crops are welcome when the approved title still receives a clean read.
- Keep title typography on the same flat plane as the poster. Do not place it in a banner, box, subtitle strip, floating label, or translucent panel.
- Restrict readable copy to the approved title and closing line. Decorative pseudo-writing and incidental signage break the print-poster language.

### Mood and motion texture

Favor graphic tension, held poster compositions, measured figure movement and deliberate changes of scale. Lateral travel can alternate with a vertical climb, descent or leap when the composition makes the change clear. The result may be playful, cultural, romantic or mysterious while retaining silhouette drama and editorial restraint. Avoid cute layered-paper dioramas, watercolor softness, comic-book speed lines, glitch and cinematic lens effects.

## Reusable motion grammar

### Tableau construction

- Lock every shot like a theatrical stage or printed poster.
- Use large flat planes, hard silhouettes, deliberate crops, long geometric shadows, and one dominant spatial idea per tableau.
- Valid spatial ideas include stripes, corridor, stairs, repeating storefronts, circular sun, bridge, monumental letters, or stacked slabs.
- Preserve subject identity and a readable local trajectory through each passage. Introduce an axis, scale or viewpoint change with a clear shape or composition handoff; one direction for the entire film is optional.
- Keep the master view substantially locked within each tableau. Local lateral or vertical action, environmental scrolling and drawn perspective are allowed; avoid free-camera cinematic fly-throughs.

### Geometry-aware dissolve

Choose a clear connection for each handoff; aligning more than one property can strengthen it:

- subject position and velocity;
- one dominant diagonal, vertical edge, circle, or vanishing point;
- one large color block in the same screen region;
- a shadow or trail that becomes architecture in the next scene.

Begin the next tableau's geometry before the previous one disappears. Visible double exposure is part of the cross-dissolve language; maintain a clear action or motif through that overlap and resolve to a clean new tableau. Avoid persistent accidental clones or unrelated fades. A planned change of cast, axis or viewpoint is allowed when the visual connection remains readable.

### Example 22-second arrangement

This is a reusable production arrangement. The source's observed timing is recorded separately in the style analysis.

| Time | Required beat |
| --- | --- |
| 0.0-2.0s | Exact title tableau establishes palette, crops and silhouette/motif vocabulary. |
| 2.0-5.0s | Figure action and the first connected dissolve establish the motion language. |
| 5.0-9.0s | A detail or wide tableau changes scale; a repeated environment carries a coherent local path. |
| 9.0-13.0s | Scale escalation: giant glyph, circle, or shadow becomes monumental architecture. |
| 13.0-18.5s | Perspective corridor or street tableau increases depth without moving the camera. |
| 18.5-22.0s | An earlier motif returns at a new scale; include the exact closing line or title when requested. |

For a 15-second output, keep the same six functions and compress intermediate holds. Do not remove the monumental passage or closing echo.

## Typography and continuity

- Limit text to the exact title and optional closing line.
- Letters may become flat architecture only when their original geometry remains legible.
- Contrast wide tableaux, extreme details and drawn-perspective passages when they serve the brief; there is no source-derived one-close-up limit.
- Vary scale while carrying a recognizable silhouette, shape or color relationship through the handoff.
- Avoid decorative pseudo-writing and unintended persistent clones. A specified cast or brief cross-dissolve superimposition is distinct from an accidental duplicate.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** exact title, recurring subject or small cast, local paths and optional closing line.
- **Scene:** ordered flat tableaux, limited palette, recurring motifs and an earlier-to-closing visual echo.
- **Motion:** local actions, scale changes and the shape/color/trajectory connection carrying each visible dissolve.
- **Camera:** locked poster compositions, with scene-to-scene viewpoint changes and drawn one-point perspective when useful.
- **Light:** graphic flat light and long directional shadows consistent with the palette.
- **Style:** retro graphic-noir motion design with cream/navy/black value structure, restrained hot and muted accents, fine print grain inside flat fills, small silhouettes against monumental geometry, cropped heavy sans titles, occasional filled serif architecture and long solid shadows. Keep the same 2D medium in both wide shots and extreme details.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say “smooth transitions.” State which subject path, edge, circle, color block, shadow, or vanishing point bridges each handoff.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `15-22s`; choose a model tier that supports the requested length.
- **resolution:** prefer `1080p` or higher when supported.
- **generateAudio:** on when supported; request restrained rhythmic texture and soft transition swells, no voiceover by default.
- **image inputs:** role-label each URL as `style_subject_lock`, `opening_lock`, `tableau_lock_N`, or `closing_lock`.
- **negativePrompt:** `soft pastel storybook, thick paper diorama, watercolor wash, glossy 3D render, photoreal close-up, gradients, bloom, lens flare, unrelated fades, persistent accidental subject clones, detached shadow, unexplained teleporting, camera fly-through, orbit, handheld drift, busy signage, text box, subtitle strip, pseudo-text, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Is every shot readable as a strong flat poster composition?
- Do recurring silhouettes or motifs connect the tableaux, with readable local motion and deliberate axis changes?
- Does each dissolve have an identifiable shape, color, placement or trajectory connection?
- Do brief overlaps resolve cleanly without persistent clones, unexplained teleporting or a free-camera move?
- Does scale vary or escalate without losing the visual thread?
- Does the final motif visibly echo an earlier image?
- Is approved title/closing copy clean wherever the brief requires it?
- Do hard flat-vector planes, limited colors, long shadows, monumental type, and locked theatrical composition survive every tableau?
- Does the result avoid soft craft-paper, photoreal, and free-camera aesthetics?

## Worked examples

1. `PASSAGE`: a paper airplane travels left-to-right through sun, striped city, stairs, corridor, and giant circular portal tableaux.
2. `AFTER DARK`: a red bicycle crosses nightlife posters, repeating windows, a diagonal bridge, and a moon that becomes the closing record label.
3. `TIDELINE`: a ribbon-like fish moves right-to-left through wave bands, beach umbrellas, breakwater slabs, and a sun that returns as an eye-like closing motif.

## Inspiration provenance

The [public reference](https://x.com/GeekCatX/status/2092675263054450807) supplies visual evidence; its [disclosed prompt](https://x.com/GeekCatX/status/2092675517749358878) supplies secondary intent. The [style analysis](references/style-analysis.md) distinguishes actual cross-dissolves, multiple paths, filled serif type and flat close-ups from optional production recipes. Replace source characters, props, words and scene order with the user's content while preserving those visual relationships.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/8684bf6d-daf4-45c4-a287-163d48724867/thumbnail-poster-tableau-dissolve.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/8684bf6d-daf4-45c4-a287-163d48724867/preview-poster-tableau-dissolve.mp4` |
| Canonical | flat printed tableaux · small silhouettes and monumental geometry · connected dissolves · scale contrasts · returning visual motif |
