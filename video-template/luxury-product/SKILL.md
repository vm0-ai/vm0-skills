---
name: luxury-product
description: A dark luxury product macro video style - premium materials in extreme close-up, black studio, pinpoint specular highlights, ultra-shallow focus, engraved or mechanical detail, and refined reveal pacing. Applies to watches, jewelry, pens, cameras, fragrance caps, and other high-end objects. Trigger on /luxury-product, "Luxury Product", "premium product macro", "dark luxury product video", or "metal detail reveal".
---

# Luxury Product Macro

A **dark luxury product macro style**, not a watch template. Keep the user's object exactly as briefed - a watch, pen, ring, camera, fragrance cap, lighter, bottle detail, or machined component - and render it in the locked premium macro look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject -> scene -> motion -> camera -> light -> style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** make a small object feel **rare, engineered, and expensive** by treating its surface as a landscape. The viewer should read metal grain, engraving, bevels, indices, screws, or mechanism detail before they read the whole object.

**Touchstones:** premium product macro advertising, jewelry and instrument films, precision-object commercials, dark-studio luxury product cinematography.

**What makes it distinct:** **darkness + pinpoint light + extreme material detail**. This is not the bright white tech reveal. The picker thumbnail uses a watch dial as an example, but the style is broader: any premium object can be treated through engraved texture, bevels, polished metal, glass, or mechanism detail.

## Style dimensions (locked)

- **Visual tone - cinematic dark luxury**: black background, gold/steel highlights, deep contrast, controlled reflections.
- **Camera - steady macro**: locked macro frame, slow slider move, micro orbit, or tiny rack focus; never handheld.
- **Editing pace - rhythmic reveal**: polished, measured reveal beats; not frantic, not still-life-only.
- **Narrative mode - product reveal**: each shot reveals why the object is valuable - material, mechanism, precision.
- **Production type - live action**: photoreal product footage or CGI-grade product realism.
- **Light**: pinpoint studio lighting and narrow specular highlights; the light should skim metal edges and engraved surfaces.
- **Emotional tone - aspirational precision**: refined, controlled, engineered, collectible.
- **Style reference - luxury product macro**: dark premium object detail with ultra-shallow focus.

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
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Get extremely close. The object should feel premium because the viewer can see how it is made: engraving, bevels, polished metal, glass, screws, indices, machined texture. If the brief needs bright retail clarity or a product-in-use lifestyle scene, use another product style.

## Worked examples

Same dark macro look; the object changes.

1. **"a luxury watch dial"** -> engraved dial texture fills the frame, hands crossing in shallow focus, pinpoint light skimming metal (the picker thumbnail example).
2. **"a fountain pen nib"** -> gold nib and guilloche barrel in a black studio, specular glints, shallow focus (see reference still).
3. **"a diamond ring"** -> prongs and facets in extreme macro, one narrow highlight rolling across polished metal.
4. **"a camera lens"** -> aperture blades and engraved focus ring, slow rack focus, black background, controlled reflections.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/016fd6d1-05d9-4709-a7d8-0799409fa1d9/thumbnail-luxury-watch-product.jpg` |
| Reference still - fountain pen nib (Seedream, seed 61) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/f2f41ff1-d6c8-4ace-9a3e-2a3511f2e425/image-f2f41ff1.png` |
| Canonical | black studio, extreme material macro, metal speculars, engraved detail, ultra-shallow focus, refined reveal |

> The reference still holds the dark luxury macro look on a different object (fountain pen vs. the watch-dial thumbnail example) - the style is product-invariant. Use a user-approved frame of the brief's subject as the video input.
