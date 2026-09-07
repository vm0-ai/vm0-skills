---
name: cursor-led-variant-world
description: A fixed front-facing catalog film where a visible cursor selects variants and each selection re-themes the hero, exact title, palette, and motif world. Use for product families, collections, plans, destinations, menus, or template galleries; not for software tutorials or automatic carousels.
---

# Cursor-Led Variant World

Create a 5-15 second interaction film with one reusable visual sentence:

`stable catalog shell -> cursor arrives -> target reacts -> matching hero expands -> visual world re-themes -> next target -> final selection holds`

This is a **shot and interaction template**, not a fixed subject or palette. Preserve the user's subject, copy, and visual identity. Lock the causal cursor choreography and the single front-facing interface shell.

## Brief contract

Require or infer:

- one collection or brand title;
- three to six variants with exact short names;
- one consistent product or subject family;
- one palette and one motif family per variant;
- selector order and final selected state;
- optional final CTA of one to three words.

Match the variant count to the requested duration: use two variants for 5-7 seconds, three for 8-11 seconds, and preferably four for 12-15 seconds. Shorten the list or lengthen the film before making names unreadable or removing the cursor-cause beat.

## Reference contract

Use purpose-built still images:

1. `shell_lock`: a clean front-facing landing-page state with exact brand title, selector order, hero footprint, and typography hierarchy.
2. `variant_source`: all variants isolated at consistent scale, angle, lighting, and construction.
3. Optional `variant_lock_01...06`: one identity still per variant when a combined source cannot preserve them.

Do not use a multi-panel storyboard as a literal frame. Treat inspiration videos as analysis-only evidence unless the user explicitly requests a one-off motion-reference reproduction. A reusable template run must use only the user's assets and purpose-built locks, never the inspiration video.

### Keyframe-first approval gate

Before any video-generation call, create three 16:9 mother keyframes:

1. `initial_shell`: the unambiguous starting selection, complete shell, exact title and visible cursor entry.
2. `causal_peak`: the cursor tip visibly contacting the next target while the outgoing state masks away and the matching incoming hero expands. Preserve one clean copy of each approved name; do not morph letters through pseudo-text.
3. `final_selection`: the chosen final world, exact name and optional CTA in the unchanged shell.

Generate `initial_shell` first, then use it as the shell-and-object reference for the other two while allowing the local hero, palette, motifs and active state to change. The navigation, selector order, margins, title zone, CTA position and cursor rendering must remain identical.

For an 8-15 second film with more than two variants, add one clean state lock per intermediate variant only after the mother trio is coherent. Crop every frame to the active 16:9 canvas, inspect the full-resolution images, assemble an ordered contact sheet and show both to the user. Stop before video generation until the user explicitly approves the keyframes.

Render text directly in the interface or on a real subject object. Reject rectangular banners, subtitle bars, label strips, highlight blocks or separate background panels added only to make text readable.

### Reference input routing

Inspect `okou generate video -h` immediately before generation and honor the selected model's current media constraints. Do not pass `--model` unless the user named one.

MiniMax H3 treats first/last-frame inputs and ordinary image/video references as mutually exclusive. For a short run whose three approved frames all matter, pass the ordered frames as image references without first/last-frame flags. Use first/last-frame mode only when no midpoint lock is required. If a motion guide is necessary, build it only from approved user or generated assets and pass it as the sole video reference; never silently drop an approved middle state or substitute the inspiration video.

## Locked shot grammar

### Persistent shell

Keep these invariant across the whole film:

- front-facing orthographic page camera;
- brand, navigation, selector baseline, option order, margins, and CTA position;
- hero footprint and title hierarchy;
- one display type family and one small-label family.

Only the selected hero, exact active name, palette, motifs, particles, and local type behavior may change. The result must read as one responsive page, never as separate posters.

### Causal transition chain

For every variant, show this order:

1. Cursor travels to the next selector.
2. Target enlarges, lifts, gains a ring, or magnetically leans toward the cursor.
3. Outgoing title is fully hidden by a clean mask.
4. Outgoing hero squashes or folds back toward its own thumbnail.
5. Matching incoming hero expands from the selected thumbnail with one restrained spring overshoot.
6. Background palette radiates from the incoming hero.
7. Variant motifs and particles respond with delayed parallax.
8. Exact incoming name resolves and holds.

Never change the hero or world before the cursor reaches the target. Never hide the cursor, jump it between targets, or let the interface auto-advance.

### Timeline

For a 5-second film, use exactly two variants:

| Time | Required beat |
| --- | --- |
| 0.0-0.7s | Complete shell and starting world; cursor enters from a crop edge. |
| 0.7-2.4s | Cursor contact teaches the full causal chain and resolves variant two. |
| 2.4-4.2s | One final cursor-caused re-selection or return to the chosen final world. |
| 4.2-5.0s | Exact final name and state hold without camera drift. |

For 8-11 seconds, use three variants and preserve 0.8-1.2 seconds for the final hold. For 12-15 seconds, use:

| Time | Required beat |
| --- | --- |
| 0.0-1.2s | Stable shell assembles; cursor enters from a crop edge. |
| 1.2-3.8s | First target reaction and complete world transformation teach the rule. |
| 3.8-11.8s | Cursor advances through the remaining variants; 1.8-2.4s per state. |
| 11.8-13.5s | Brief selector recap or return to the chosen final state. |
| 13.5-15.0s | Optional CTA responds; final selected state holds for at least one second. |

Do not squeeze additional variants into the short tiers. Never remove the opening teaching beat, visible cursor cause or final hold.

## Motion, type, and camera

- Camera stays locked; no dolly, orbit, cutaway, or handheld drift.
- Local hero tilt, shallow layered parallax, foreground overlap, spring physics, elastic overshoot, squash-and-stretch, and masked replacement are allowed.
- Derive one unique motion accent from each variant's motif while preserving the shared chain.
- Show only approved exact text. Hide outgoing words before revealing replacements; never morph letters through pseudo-text.
- The cursor tip must visibly contact or hover over every activated target.

## Prompt construction

Write one cohesive prompt in this exact order:

`subject -> scene -> motion -> camera -> light -> style`

Include:

- **Subject:** collection title, exact variant names, consistent subject family, final selection, CTA.
- **Scene:** one fixed front-facing catalog shell; selector order, hero zone, title zone, and per-variant palette/motif bundles.
- **Motion:** the full causal transition chain and proportional timeline.
- **Camera:** locked orthographic page view with only local layered parallax.
- **Light:** coherent studio or illustrated lighting across variants; palette changes must not change object identity.
- **Style:** polished interactive product-motion design, crisp masks, tactile springs, clean readable typography, user-specified art direction.

End the prompt with:

`safe for all audiences, nonviolent, no explicit content`

Do not merely say “cursor animation.” Name the cursor path, target reaction, hero origin, title mask, palette propagation, and final hold.

## Generation parameters

- **aspectRatio:** `16:9`.
- **duration:** `5-15s`; match the variant count and timeline tier above.
- **resolution:** prefer `1080p` or higher when supported; use `720p` only when the selected tier requires it.
- **generateAudio:** on when the model supports it; request restrained UI clicks, soft whooshes, and one tonal accent per state. No voiceover by default.
- **image inputs:** role-label every URL as `initial_shell`, `causal_peak`, `final_selection`, `shell_lock`, `variant_source`, or `variant_lock_N`.
- **negativePrompt:** `camera cuts, dolly, orbit, automatic carousel, invisible cursor jump, interface layout drift, mismatched hero and selector, blended products, duplicate cursor, illegible text, pseudo-letters, rectangular banner behind text, subtitle bar, label strip, separate text background panel, excessive particles, watermark`.

## Acceptance gates

Reject and retry when any answer is no:

- Does every state change have a visible cursor cause?
- Were the mother keyframes shown at full resolution and explicitly approved before video generation?
- Does the same shell survive without layout or camera drift?
- Does each selector activate the matching hero and exact name?
- Are all requested worlds distinct while belonging to one family, with at least two worlds in a 5-7 second film?
- Are outgoing and incoming objects separated rather than blended?
- Are all approved names readable with no transitional pseudo-letters?
- Is every text treatment integrated without an artificial banner, subtitle bar or backing panel?
- Does the final state hold for at least 0.8 seconds in a 5-second film and at least one second in longer films?

## Worked examples

1. A lighting collection: `DUSK`, `HALO`, `EMBER`, `MOSS`; the cursor changes fixture form, room tint, and geometric light motifs inside one showroom shell.
2. A travel collection: `OSLO`, `KYOTO`, `MEXICO CITY`, `MARRAKECH`; one ticket-card family changes city image, route color, and local motif system.
3. A pricing family: `START`, `GROW`, `SCALE`, `ENTERPRISE`; one plan shell changes module density, accent color, and capability icon world.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://static.vm0.io/vm0/artifact-templates/video/ba839737-b025-4b32-994e-f2084018a3cc/thumbnail-cursor-led-variant-world.jpg` |
| Preview video | `https://static.vm0.io/vm0/artifact-templates/video/ba839737-b025-4b32-994e-f2084018a3cc/preview-cursor-led-variant-world.mp4` |
| Canonical | fixed shell · cursor causes every change · matching hero expands from target · title and world re-theme · final selection holds |
