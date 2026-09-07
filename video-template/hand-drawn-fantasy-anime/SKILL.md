---
name: hand-drawn-fantasy-anime
description: A hand-drawn fantasy animation video style - painterly 2D backgrounds, expressive simple characters, lush nature, soft diffused light, warm storybook color, and gentle magical wonder. Applies to any fantasy, character, nature, or adventure subject. Trigger on /hand-drawn-fantasy-anime, "hand-drawn fantasy animation", "painterly 2D fantasy", "storybook anime", or "warm forest animation".
---

# Hand Drawn Fantasy Anime

A **hand-drawn fantasy animation style**, not a fixed character, studio, or franchise. Keep the user's subject exactly as briefed - a child, creature, village, forest path, airship, animal companion, or magical object - and render it in the locked painterly 2D fantasy look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject -> scene -> motion -> camera -> light -> style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** make the world feel **handmade, alive, and gently enchanted** - simple expressive characters moving through lush painted nature, with soft light and small magical details. The goal is **wonder, warmth, and emotional innocence**, not spectacle or combat.

**Touchstones:** hand-painted family fantasy animation, classic cel-animation character design, watercolor and gouache forest backgrounds, storybook adventure films, nature-centered animated fables.

**What makes it distinct:** **painterly background + simple expressive 2D character + gentle natural magic**. The picker thumbnail shows a child in a glowing forest with soft blue-green depth, painted tree trunks, floating light creatures, and a calm sense of discovery.

**Brand-safety note:** do not name or request any specific protected studio, director, franchise, or character. Describe only the visual traits: hand-drawn 2D animation, painterly backgrounds, expressive characters, lush nature, soft diffused light, and gentle wonder.

## Style dimensions (locked)

- **Visual tone - warm natural fantasy**: lush greens, amber light, soft blues in depth, warm highlights, gentle color richness.
- **Camera - slow push-in**: a patient drift or slow push toward the character or discovery moment.
- **Editing pace - slow and meditative**: let the painted world breathe; no rapid cutting.
- **Narrative mode - linear story moment**: a clear small encounter or discovery, not abstract graphics.
- **Production type - 2D animation**: hand-drawn or painterly digital 2D; visible brushwork in backgrounds, clean simple character linework.
- **Emotional tone - playful wonder**: gentle, curious, kind, childlike.
- **Style reference - hand-drawn fantasy animation**: painterly storybook nature with expressive animated characters.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the subject. Hit these beats in Seedance order:

`subject (as briefed) -> lush painterly fantasy setting -> gentle motion or discovery beat -> slow push-in -> soft diffused natural light -> hand-drawn 2D fantasy animation`

**Always convey:** hand-drawn 2D animation, painterly background with visible brushwork, expressive simple character design, lush natural setting, soft diffused light, warm storybook palette, gentle magical details, calm wonder.

**Never:** 3D CGI, photorealism, live action, hard digital render, plastic textures, harsh neon, generic flat vector art, dark gritty combat mood, copied franchise character, named protected studio style.

Adapt the creature, character, environment, and small motion to the brief. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` for storybook cinematic scenes; `9:16` for vertical character moments.
- **resolution and model tier**: pick a tier that supports the resolution - fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5-8s`; one slow discovery moment is stronger than a busy sequence.
- **negativePrompt**: `3D CGI, photorealistic, live action, hard digital render, plastic texture, harsh neon, flat vector art, dark gritty combat, copied franchise character, named protected studio style, low resolution`.
- **generateAudio**: optional - soft forest ambience, tiny chimes, wind, or gentle creature sounds can help.
- **seed**: mild lever for text-to-video; use `firstFrameImageUrl` for look consistency.
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Keep the world soft, painted, and emotionally clear. Give the subject a small discovery or encounter, not a noisy action plot. If the brief asks for photoreal fantasy, 3D game cinematics, or a named franchise look, this style is not the fit.

## Worked examples

Same hand-drawn fantasy register; the subject changes.

1. **"a child in a glowing forest"** -> expressive child character walking through blue-green trees, floating light creatures, soft painterly forest depth (the picker thumbnail).
2. **"a young apprentice and a moss creature"** -> apprentice kneeling on an overgrown stone bridge beside a tiny moss creature, warm painted forest, glowing motes (see reference still).
3. **"a fox delivering a letter"** -> small fox courier crossing a sunlit meadow path, hand-painted grass, gentle wind in flowers, soft amber light.
4. **"a floating village at dusk"** -> simple expressive villagers looking up at a small airship, painted clouds, warm windows, slow push-in.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/ad08022e-5b28-4e80-a67f-cbe5d27cbc03/thumbnail-hand-drawn-fantasy-anime.jpg` |
| Reference still - apprentice and moss creature (Seedream, seed 63) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/d892e1cb-a7af-465c-89a0-79b1380011ac/image-d892e1cb.png` |
| Canonical | hand-drawn 2D, painterly forest, expressive simple character, soft diffused light, warm storybook palette, gentle wonder |

> The reference still holds the hand-drawn fantasy animation look on a different subject (apprentice and moss creature vs. child in glowing forest) - the style is subject-invariant. Use a user-approved frame of the brief's subject as the video input.
