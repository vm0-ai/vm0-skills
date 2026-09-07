---
name: gourmet-documentary
description: A sensory culinary-documentary video style — macro food texture, rising steam, warm backlight, rich saturated color, shallow depth of field, and artisan hands in frame. Applies to whatever food/craft the user brings. Trigger on /gourmet-documentary, "food documentary", "Chef's Table style", "appetizing food video", or "sensory food close-up".
---

# Gourmet Documentary

A **sensory food-documentary style**, not a fixed dish. Keep the user's food or craft exactly as briefed — sashimi, coffee, bread, a cocktail — and shoot it in the intimate macro look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Verify the exact provider/model version and endpoint/mode using `okou generate video -h` and current provider documentation as needed. Check supported image roles, counts, input combinations, and size/aspect-ratio limits before generating stills. A model family name or global CLI flag does not establish support; do not use paid jobs to probe capabilities. Choose the smallest useful approach:
   - **First-frame input:** start with one opening image and describe motion separately.
   - **First/last frames:** add a last frame only when the ending matters. Check that subject, scene, and motion can connect plausibly within the duration; incompatible endpoints can cause unnatural morphing.
   - **Reference images:** use a small set for subject/product/style consistency. Image order does not control a timeline, shot order, or timestamps unless the API explicitly supports that.
   - **Text only:** explain before making stills that they are concept previews for the user and prompt development, not model inputs. Include this limitation in the approval, or agree on an image-capable alternative; do not silently change the selected model/mode.
2. Prepare only the needed frames of the user's subject in this style; reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style, not approval of this video's composition. For multiple shots, preview distinct compositions only as needed; separate generations and editing must be included in the approved clip count and cost, not automatically assigned to every storyboard image.
3. Inspect and share the actual numbered frames using accessible URLs (upload local images), with individual links alongside any contact sheet. Identify each as first frame, last frame, visual reference, or concept preview only; show the exact crop for model inputs. Include planned motion, clip count, duration per clip, ratio, resolution, audio, provider/model/mode, and a current cost estimate when available; distinguish image/video costs, never invent prices, and resolve user-set spending caps. Explain the relevant limits briefly: previews align appearance but do not guarantee motion, transitions, temporal consistency, physics, text stability, first-attempt success, or lower total cost. More frames do not necessarily help.
4. Ask the user to approve the shown frames and described video approach, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested. For text-only generation, never imply the model receives the preview images.
5. Execute the approved strategy. For an image-capable mode, pass individual approved images using the verified roles and supported combinations, not a contact sheet. For an explicitly approved text-only plan, translate the approved visual direction into the prompt without unsupported image flags or claims of direct image conditioning. If the intended strategy is unsupported, get approval for a compatible plan before submitting. Keep the approved URLs, roles, and plan in the conversation; submit only the approved clips and parameters, wait for completion, and deliver the returned artifact.
6. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes, including model/mode or image roles, and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

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
- **firstFrameImageUrl**: use the approved opening frame only when the selected mode supports first-frame input; otherwise follow the approved reference-image or text-only strategy above.

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

> The reference still holds the warm macro look on a different subject (coffee vs. sashimi) — the style is subject-invariant. For image-capable modes, use a user-approved frame of the brief's subject with its verified input role; text-only previews guide the prompt only.
