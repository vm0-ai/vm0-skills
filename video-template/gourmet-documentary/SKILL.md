---
name: gourmet-documentary
description: A sensory culinary-documentary video style — macro food texture, rising steam, warm backlight, rich saturated color, shallow depth of field, and artisan hands in frame. Applies to whatever food/craft the user brings. Trigger on /gourmet-documentary, "food documentary", "Chef's Table style", "appetizing food video", or "sensory food close-up".
---

# Gourmet Documentary

A **sensory food-documentary style**, not a fixed dish. Keep the user's food or craft exactly as briefed — sashimi, coffee, bread, a cocktail — and shoot it in the intimate macro look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** make food feel **irresistible and crafted by human hands** — get close enough to read every texture, catch the steam, and feel the care. The goal is **appetite and craft reverence**, an intimate sensory moment.

**Touchstones:** *Chef's Table*, *Salt Fat Acid Heat*, high-end recipe films, artisan-craft documentaries, premium food advertising macro work.

**What makes it distinct:** **macro intimacy + warmth + the human hand**. Not a wide table scene, not cold or clinical — tight, warm, tactile, with a craftsperson's hands in the frame.

## Style dimensions (locked)

- **Visual tone — warm & natural**: warm appetizing tones, rich saturated food color, soft naturalistic light.
- **Camera — extreme close-up / macro**: tight on texture and detail; subtle slow moves (slow push or slow slide) that explore the surface.
- **Editing pace — slow & meditative**: lingering shots that let texture and steam breathe. No fast cutting.
- **Narrative mode — observational**: no narrator; the food and hands tell it.
- **Production type — live action**: photoreal food footage.
- **Emotional tone — warm & nostalgic**: comforting, sensory, hand-made warmth.
- **Style reference — gourmet documentary**: the macro, steam-and-texture register of prestige food films.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the food. Hit these beats in Seedance order:

`food/craft (as briefed) → close intimate setting → a craft action + rising steam/motion → macro slow camera → warm backlight → rich warm grade, shallow focus`

**Always convey:** macro close-up on food texture · visible steam or motion (a pour, a sprinkle, a cut) · artisan hands in frame · warm backlight catching the surface · rich saturated warm color · shallow depth of field · slow lingering pace.

**Never:** cold/clinical lighting, fast editing, wide industrial/canteen setting, flat desaturated color, plastic-looking food.

Adapt the dish, the craft action, and the texture to the brief. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` (or `9:16` for social food clips).
- **resolution & model tier**: pick a tier that supports the resolution — fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5–8s`; let one slow macro move and the steam breathe.
- **negativePrompt**: `cold lighting, clinical look, fast cuts, wide industrial kitchen, flat desaturated color, plastic food, low resolution`.
- **generateAudio**: **on** — sizzle / pour / ambient kitchen sound strengthens the sensory feel.
- **seed**: mild lever for text-to-video; for look consistency use `firstFrameImageUrl`.
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Get intimate and warm: macro on texture, catch the steam, keep a craftsperson's hands in frame. If the brief wants a wide restaurant scene or a fast hype edit, this isn't the fit.

## Worked examples

Same warm macro look; the food changes.

1. **"latte art"** → macro of a barista pouring a rosetta, steam rising, warm backlight, slow push-in, shallow focus (see reference still).
2. **"fresh bread"** → hands tearing a warm loaf, steam escaping the crumb, golden backlight, slow lingering macro.
3. **"a cocktail"** → a slow pour over ice, condensation and citrus oils catching light, warm tones, shallow focus.
4. **"sashimi plating"** → chef's hands placing micro-herbs with tweezers, macro on the fish grain, warm key light (the picker thumbnail).

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/30ab1733-bec0-4ddb-9e15-8f707377af7b/thumbnail-gourmet-documentary.jpg` |
| Reference still — latte pour (Seedream, seed 52) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/71642cf3-f879-4684-a6a1-afeb52fb723a/image-71642cf3.png` |
| Canonical | macro texture · rising steam · warm backlight · artisan hands · shallow focus · slow pace |

> The reference still holds the warm macro look on a different subject (coffee vs. sashimi) — the style is subject-invariant. Use a user-approved frame of the brief's subject as the video input.
