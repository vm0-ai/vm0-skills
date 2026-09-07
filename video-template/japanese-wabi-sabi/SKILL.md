---
name: japanese-wabi-sabi
description: A Japanese wabi-sabi lifestyle video style — natural imperfection, warm soft morning light, negative space, aged organic materials (wood, stone, moss), and a quiet unhurried mood. Applies to whatever subject the user brings. Trigger on /japanese-wabi-sabi, "wabi-sabi", "Japanese minimalist lifestyle", "quiet aesthetic", or "calm muji-style video".
---

# Japanese Wabi-Sabi

A **wabi-sabi lifestyle style**, not a fixed scene. Keep the user's subject exactly as briefed — an object, a corner, a moment — and render it in the quiet, imperfect, softly-lit look below. The style supplies the *mood*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** find beauty in **imperfection, age, and quiet** — a small, humble subject held in soft light and empty space, unhurried. The goal is **calm and intimacy** (the beauty of the incomplete and impermanent), not spectacle or polish.

**Touchstones:** Japanese wabi-sabi philosophy, Muji / Kinfolk lifestyle films, slow-living and tea-ceremony aesthetics, soft natural-light still-life.

**What makes it distinct:** **intimacy + imperfection + soft warm light**. Small in scale and gentle — the opposite of grand or saturated. Aged organic materials, negative space, and a single hushed moment.

## Style dimensions (locked)

- **Visual tone — warm & natural, muted**: soft warm morning light, understated muted colors; never punchy or saturated.
- **Camera — slow push-in**: a slow, gentle drift toward the subject; often a low, intimate angle; shallow depth of field.
- **Editing pace — slow & meditative**: long, quiet, breathing takes; no cutting.
- **Narrative mode — observational**: a quiet found moment; no narration.
- **Production type — live action**: photoreal, tactile real-world footage.
- **Emotional tone — calm & meditative**: serene, intimate, contemplative.
- **Style reference — wabi-sabi**: imperfection, aging, and quiet beauty in impermanence.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the subject. Hit these beats in Seedance order:

`subject (as briefed) → intimate setting with aged organic materials → small quiet motion (drifting steam, a falling petal, soft breeze) → slow gentle push-in, shallow focus → soft warm morning light → muted wabi-sabi calm`

**Always convey:** natural imperfection and aged organic textures (wood, stone, moss, ceramic) · soft warm morning light · generous negative space · shallow depth of field · a quiet unhurried single moment · muted understated color.

**Never:** urban clutter, artificial/hard light, saturated punchy color, fast pacing, glossy perfection, busy composition.

Adapt the humble subject and its textures to the brief. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` (or `9:16` for vertical lifestyle clips).
- **resolution & model tier**: pick a tier that supports the resolution — fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5–8s`; let one small motion and the light breathe.
- **negativePrompt**: `urban clutter, artificial light, hard light, saturated colors, fast pacing, glossy perfection, busy composition, low resolution`.
- **generateAudio**: optional — soft ambient (birdsong, water, breeze) suits the calm.
- **seed**: mild lever for text-to-video; for look consistency use `firstFrameImageUrl`.
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Hold the user's subject in soft warm light and empty space, small and quiet, with aged natural textures. If the brief wants something bold, bright, fast, or grand, this isn't the fit.

## Worked examples

Same quiet wabi-sabi look; the subject changes.

1. **"a cobblestone alley at dawn"** → low-angle on a wet stone path, fallen cherry petals, moss and aged ceramics, soft warm light (the picker thumbnail).
2. **"a cup of tea"** → a weathered ceramic teacup on an aged wooden veranda, faint steam, soft morning light, shallow focus (see reference still).
3. **"a potted plant by a window"** → a single plant in soft diffused light, dust motes drifting, muted tones, negative space.
4. **"handmade pottery"** → an imperfect clay bowl on linen, gentle push-in catching the glaze texture, warm quiet light.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/a7a69fe3-9e6c-48fd-af55-62c8a57a0371/thumbnail-japanese-wabi-sabi.jpg` |
| Reference still — teacup (Seedream, seed 55) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/418fc568-a83d-483f-b344-a494b962c0dd/image-418fc568.png` |
| Canonical | aged organic textures · soft warm light · negative space · shallow focus · slow gentle pace · muted color |

> The reference still holds the wabi-sabi look on a different subject (teacup vs. alley) — the style is subject-invariant. Use a user-approved frame of the brief's subject as the video input.
