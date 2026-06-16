---
name: luxury-watch-product
description: A dark luxury product macro video style - premium materials in extreme close-up, black studio, pinpoint specular highlights, ultra-shallow focus, engraved or mechanical detail, and refined reveal pacing. Applies to watches, jewelry, pens, cameras, and other high-end objects. Trigger on /luxury-watch-product, "Luxury Watch Product", "premium product macro", "dark luxury product video", or "metal detail reveal".
---

# Luxury Watch Product

A **dark luxury product macro style**, not a fixed watch. Keep the user's object exactly as briefed - a watch, pen, ring, camera, fragrance cap, or machined component - and render it in the locked premium macro look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (vm0's default video model): the prompt follows Seedance's `subject -> scene -> motion -> camera -> light -> style` ordering.

## What this style is

**The essence:** make a small object feel **rare, engineered, and expensive** by treating its surface as a landscape. The viewer should read metal grain, engraving, bevels, indices, screws, or mechanism detail before they read the whole object.

**Touchstones:** Swiss watch macro advertising, premium jewelry films, high-end instrument commercials, dark-studio luxury product cinematography.

**What makes it distinct:** **darkness + pinpoint light + extreme material detail**. This is not the bright white tech reveal. The picker thumbnail is not a full watch hero shot; it is an ultra-close view of a watch dial's engraved texture and hands.

## Style dimensions (locked)

- **Visual tone - cinematic dark luxury**: black background, gold/steel highlights, deep contrast, controlled reflections.
- **Camera - steady macro**: locked macro frame, slow slider move, micro orbit, or tiny rack focus; never handheld.
- **Editing pace - rhythmic reveal**: polished, measured reveal beats; not frantic, not still-life-only.
- **Narrative mode - product reveal**: each shot reveals why the object is valuable - material, mechanism, precision.
- **Production type - live action**: photoreal product footage or CGI-grade product realism.
- **Light**: pinpoint studio lighting and narrow specular highlights; the light should skim metal edges and engraved surfaces.
- **Emotional tone - aspirational precision**: refined, controlled, engineered, collectible.
- **Style reference - premium product macro**: dark luxury object detail with ultra-shallow focus.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the product. Hit these beats in Seedance order:

`premium object or detail (as briefed) -> dark black studio -> subtle product motion or rack focus -> steady extreme macro camera -> pinpoint specular lighting -> cinematic luxury product grade`

**Always convey:** extreme close-up on premium material, engraved or mechanical detail, black studio background, pinpoint specular highlights, ultra-shallow depth of field, slow precise reveal, refined luxury mood.

**Never:** lifestyle context, hands, natural environment, white seamless tech look, flat lighting, full product from far away, casual tabletop scene.

Adapt the material, detail, and reveal move to the product. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` for cinematic product films; `9:16` for vertical premium ads.
- **resolution and model tier**: pick a tier that supports the resolution - fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5-8s`; one slow rack focus, glint pass, or micro slide is enough.
- **negativePrompt**: `lifestyle context, hands, natural environment, white seamless background, flat lighting, wide full product shot, plastic material, cluttered tabletop, low resolution, distorted product geometry`.
- **generateAudio**: optional - subtle mechanical ticks or refined ambient design can help; often added in edit.
- **seed**: mild lever for text-to-video; use `firstFrameImageUrl` for look consistency.
- **firstFrameImageUrl** (strongest stability lever): generate one dark macro still (see *Reference still*) and pass it as the first frame.

## How to apply

Get extremely close. The object should feel premium because the viewer can see how it is made: engraving, bevels, polished metal, glass, screws, indices, machined texture. If the brief needs bright retail clarity or a product-in-use lifestyle scene, use another product style.

## Worked examples

Same dark macro look; the object changes.

1. **"a luxury watch dial"** -> engraved dial texture fills the frame, hands crossing in shallow focus, pinpoint light skimming metal (the picker thumbnail).
2. **"a fountain pen nib"** -> gold nib and guilloche barrel in a black studio, specular glints, shallow focus (see reference still).
3. **"a diamond ring"** -> prongs and facets in extreme macro, one narrow highlight rolling across polished metal.
4. **"a camera lens"** -> aperture blades and engraved focus ring, slow rack focus, black background, controlled reflections.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/016fd6d1-05d9-4709-a7d8-0799409fa1d9/thumbnail-luxury-watch-product.jpg` |
| Reference still - fountain pen nib (Seedream, seed 61) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/f2f41ff1-d6c8-4ace-9a3e-2a3511f2e425/image-f2f41ff1.png` |
| Canonical | black studio, extreme material macro, metal speculars, engraved detail, ultra-shallow focus, refined reveal |

> The reference still holds the dark luxury macro look on a different object (fountain pen vs. watch dial) - the style is product-invariant. Pass it as `firstFrameImageUrl` to lock the look.
