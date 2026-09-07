---
name: cyberpunk-anime
description: A 2D cyberpunk anime video style — hand-drawn cel-look characters in a neon megacity, rain-slicked streets, electric teal-and-magenta palette, and a melancholic mood. Applies to whatever character/scene the user brings. Trigger on /cyberpunk-anime, "cyberpunk anime", "neon anime city", "lo-fi anime night", or "2D anime cyberpunk scene".
---

# Cyberpunk Anime

A **2D cyberpunk anime style**, not a fixed scene. Keep the user's character or subject exactly as briefed — and render it as hand-drawn anime in the neon-city look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering, and the look is **2D animation** (state this explicitly so the model doesn't drift to live action / 3D).

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** a lonely, beautiful **neon-noir mood in hand-drawn anime** — a small human moment dwarfed by a glowing, rain-soaked megacity. The goal is **atmosphere and melancholy**, the quiet feeling of a city at night, not action spectacle.

**Touchstones:** *Blade Runner*-flavored anime, lo-fi "chillhop" anime loops, *Ghost in the Shell* / cyberpunk OVA backgrounds, neon city night illustrations.

**What makes it distinct:** **2D cel animation + neon + rain + melancholy**. Not live action, not 3D CGI, not warm or natural — flat cel shading, electric teal/magenta neon, wet reflective streets, a pensive lone figure.

## Style dimensions (locked)

- **Visual tone — neon cyberpunk**: electric teal and magenta neon against deep night; glowing signage, wet reflective surfaces.
- **Camera — dutch / slow drift**: subtly tilted or slowly drifting framing; atmospheric, observational, not frenetic.
- **Editing pace — fast cut (restrained)**: can cut between moody beats; keep it atmospheric, not action-frantic.
- **Narrative mode — abstract / mood**: vibe over plot; a feeling, not a story beat.
- **Production type — 2D animation**: hand-drawn cel-shaded anime. **Explicitly not live action, not 3D CGI.**
- **Emotional tone — melancholic**: pensive, lonely, bittersweet calm.
- **Style reference — cyberpunk anime**: neon megacity OVA backgrounds, rain and reflections.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the subject. Hit these beats in Seedance order:

`character/subject (as briefed) → neon rain-slicked city setting → quiet motion (rain, steam, drifting figure) → subtly tilted/drifting camera → teal-magenta neon glow → 2D cel anime style, melancholic`

**Always convey:** **2D hand-drawn anime, cel-shaded** · neon megacity backdrop with glowing signage · rain-slicked reflective streets · electric teal + magenta palette · a melancholic, lonely mood · atmospheric framing.

**Never:** live-action footage, 3D CGI, photorealism, warm natural daylight, bright cheerful tone.

Adapt the character and city details to the brief. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` (cinematic anime) or `9:16` for vertical loops.
- **resolution & model tier**: pick a tier that supports the resolution — fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5–8s`; let rain, neon flicker, and a slow drift carry it.
- **negativePrompt**: `live action, photorealistic, 3D CGI render, warm daylight, bright cheerful tone, natural landscape, low resolution, extra fingers`.
- **generateAudio**: **on** for rain/city ambience (pairs well with lo-fi music in edit).
- **seed**: mild lever for text-to-video; for look/character consistency use `firstFrameImageUrl`.
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Render the user's subject as **2D cel anime** in a neon rain-city. Always state the 2D-anime medium in the prompt (the model drifts to live action otherwise). If the brief wants photoreal or a bright/warm mood, this isn't the fit.

## Worked examples

Same neon-anime look; the subject changes.

1. **"a lone hacker"** → a hooded figure looking down a rain-slicked neon alley, glowing signage, melancholic, slow drift (the picker thumbnail).
2. **"someone eating ramen at night"** → a lone figure at a glowing ramen stall, steam and neon reflections in wet pavement, pensive calm (see reference still).
3. **"a girl on a train platform"** → standing under flickering neon, rain outside, teal-magenta glow, subtly tilted framing.
4. **"a cat on a fire escape"** → a cat silhouetted against neon signs, rain, reflective puddles below.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/b870f6c1-95a8-4ab6-aa0d-a125cb57dd3e/thumbnail-cyberpunk-anime.jpg` |
| Reference still — ramen stall (Seedream, seed 53) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/4084db29-b61f-4491-b90d-54a48220601c/image-4084db29.png` |
| Canonical | 2D cel anime · neon megacity · rain-slicked reflections · teal+magenta · melancholic · drifting frame |

> The reference still holds the neon-anime look on a different subject (ramen stall vs. hooded figure) — the style is subject-invariant. Use a user-approved frame of the brief's subject as the video input.
