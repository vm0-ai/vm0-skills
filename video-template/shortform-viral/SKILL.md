---
name: shortform-viral
description: A short-form viral video style — vertical 9:16, fast hook, authentic handheld creator energy, bright saturated casual look, and a fast cut rhythm. Applies to whatever the user is filming. Trigger on /shortform-viral, "TikTok style", "Reels style", "viral short video", or "UGC creator clip".
---

# Shortform Viral

A **social short-form style**, not a fixed scene. Keep the user's subject exactly as briefed — a product, a moment, people, a place — and shoot it like a creator's phone clip below. The style supplies the *energy*; the user supplies the *what*. Tuned for **Seedance** (the platform's default video model): the prompt follows Seedance's `subject → scene → motion → camera → light → style` ordering.

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Generate a small set of still keyframes in the user's chosen subject and this style. Start with one opening frame for a single shot; add only distinct shots or essential end states. Reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. The reference-output images below illustrate style; they do not approve a different subject or this video's composition.
2. Inspect and share the actual frames using user-accessible URLs (upload local images). Show the exact crop intended for the video. Number multiple frames; a contact sheet may accompany individual links. Include planned motion, clip count, duration per clip, aspect ratio, resolution, audio, provider/model, and a current cost estimate when available; distinguish image and video costs, never invent prices, and resolve any user-set spending cap. Explain briefly that stills preview appearance while generated motion/timing may vary.
3. Ask the user to approve these frames and this video plan, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval already given for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested.
4. After approval, use the approved individual images as supported first-frame, last-frame, or reference-image inputs. Read `okou generate video -h` or the provider's current input contract; never pass a contact sheet or silently drop image conditioning. If unsupported, get approval for a compatible plan before generating. Keep the approved URLs and plan in the conversation and submit only the approved clips and parameters.
5. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## What this style is

**The essence:** feel like a real person filmed it on their phone and it blew up — **authentic, immediate, high-energy**. The goal is **relatable spontaneity and a fast hook**, not polish. It should look unproduced on purpose.

**Touchstones:** TikTok / Reels creator content, GRWM and day-in-the-life clips, candid travel/lifestyle UGC, run-and-gun phone footage.

**What makes it distinct:** **vertical, handheld, fast, bright**. The opposite of a locked tripod and a slow cinematic grade — its credibility comes from looking casual and real.

## Style dimensions (locked)

- **Visual tone — warm & natural, bright saturated**: punchy daylight, casual phone-camera look, lively color; not a graded "film" look.
- **Camera — handheld raw**: natural handheld movement, slight shake and reframes, follows the action; feels human-held.
- **Editing pace — fast cut**: quick rhythmic cuts; a strong hook in the **first second**. (Seedance can do multi-shot — use it here.)
- **Narrative mode — observational**: candid, in-the-moment; no formal narration.
- **Production type — live action**: real-world phone-grade footage.
- **Emotional tone — playful & fun**: upbeat, joyful, casual energy.
- **Style reference — short-form viral**: authentic creator content built to stop the scroll.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the subject. Hit these beats in Seedance order:

`subject (as briefed) → casual real-world setting → energetic action → handheld camera following it → bright natural light → playful creator vibe`

**Always convey:** vertical 9:16 phone framing · a strong action/hook right away · natural handheld movement · bright saturated casual daylight · playful authentic energy · fast pacing.

**Never:** formal studio/tripod look, slow meditative pacing, cinematic letterbox, heavy color grade, staged stiffness.

Adapt the action and setting to the subject. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `9:16` (vertical — non-negotiable for this style).
- **resolution & model tier**: pick a tier that supports the resolution — fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5–8s`; pack a hook + a beat or two of payoff. Multi-shot is welcome.
- **negativePrompt**: `formal studio look, tripod locked frame, cinematic letterbox, slow pacing, heavy color grade, staged, stiff, low resolution`.
- **generateAudio**: **on** — casual ambient/energy helps the authentic feel (swap for trending audio in edit).
- **seed**: mild lever for text-to-video. For look consistency use `firstFrameImageUrl`.
- **firstFrameImageUrl**: use the user-approved opening keyframe from the review above. Preserve the planned motion around that visual anchor.

## How to apply

Shoot the user's subject like a creator would: vertical, in the moment, energetic, bright. If the brief wants a slow, premium, cinematic feel, this is the wrong style — pick a cinematic or product style instead.

## Worked examples

Same casual creator energy; the subject changes.

1. **"unboxing our snack product"** → hands ripping open the pack to camera, quick cuts to a bite and a reaction, vertical, bright kitchen daylight, playful.
2. **"a beach day with friends"** → friends running and laughing toward the water, handheld follow, bright saturated, fast cuts (see reference still / picker thumbnail).
3. **"a coffee shop morning"** → POV walking in, quick cuts of the order and first sip, casual handheld, warm daylight.
4. **"a sneaker drop"** → fast hook on feet stepping into frame, quick spins and angles, vertical, energetic.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/40ab801f-16bc-4e29-8370-6b10cd394e30/thumbnail-shortform-viral.jpg` |
| Reference still — rooftop party (Seedream, seed 51, 9:16) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/06064f7a-abdb-4284-9562-507d6dce7ed4/image-06064f7a.png` |
| Canonical | vertical 9:16 · handheld · bright saturated · fast cuts · playful creator energy |

> The reference still holds the casual bright-energy look on a different subject (rooftop party vs. beach crew) — the style is subject-invariant.
