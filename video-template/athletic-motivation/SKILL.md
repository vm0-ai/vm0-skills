---
name: athletic-motivation
description: A high-intensity sports advertising video style - extreme close-ups on effort, sweat, muscle tension, gear, motion blur, Dutch angles, fast cut rhythm, high-contrast desaturated grade, and dramatic rim light. Applies to any athlete, sport, or training action. Trigger on /athletic-motivation, "Athletic Motivation Ad", "sports motivation video", "training ad", or "sweat and effort commercial".
---

# Athletic Motivation Ad

A **sports motivation advertising style**, not a fixed sport. Keep the user's athlete or action exactly as briefed - running, boxing, cycling, lifting, climbing, team drills - and shoot it in the locked high-effort look below. The style supplies the *look*; the user supplies the *what*. Tuned for **Seedance** (vm0's default video model): the prompt follows Seedance's `subject -> scene -> motion -> camera -> light -> style` ordering.

## What this style is

**The essence:** make effort feel **physical, urgent, and earned** - the body under pressure, gear in motion, sweat catching light, every frame close to the threshold. The goal is **drive and controlled aggression**, not casual fun.

**Touchstones:** major sports-brand training ads, athlete manifesto films, pre-race hype videos, high-contrast performance commercials.

**What makes it distinct:** **effort close-up + kinetic edit + dramatic rim light**. The picker thumbnail is a low close-up of a runner's shoe and calf over a dark track, with motion blur and lane lines. This is not short-form viral creator energy and not a calm wellness scene.

## Style dimensions (locked)

- **Visual tone - cinematic high contrast**: desaturated, gritty, dark track/gym/terrain textures, white highlights on sweat and gear.
- **Camera - extreme close-up**: muscles, hands, shoes, breath, tape, grips, chalk, sweat; low angles and Dutch angles are welcome.
- **Editing pace - fast cut**: rapid 1-2 second beats, motion blur, impact rhythm. If a single generation cannot create true edits, build the energy inside the shot and assemble cuts in edit.
- **Narrative mode - linear effort story**: preparation, strain, peak effort, breakthrough.
- **Production type - live action**: photoreal athlete footage.
- **Light**: dramatic backlit rim light at peak effort; sweat and edges should catch the light.
- **Emotional tone - inspiring intensity**: tough, focused, motivational, not playful.
- **Style reference - athletic motivation ad**: performance-commercial close-ups and grit.

## Prompt construction

Write **one cohesive video prompt in your own words**, adapted to the sport. Hit these beats in Seedance order:

`athlete/action (as briefed) -> gritty training or competition setting -> explosive effort motion with sweat/gear detail -> extreme close-ups, low angle, Dutch angle -> dramatic rim light -> high-contrast desaturated sports-ad grade`

**Always convey:** muscle tension, sweat, gear detail, motion blur, fast rhythmic energy, dramatic backlit rim light, high-contrast desaturated grade, peak-effort moment.

**Never:** calm atmosphere, static camera, soft lighting, wellness yoga mood, casual creator footage, bright cheerful lifestyle look.

Adapt the sport, body detail, and action beats to the brief. Put aspect ratio, negatives, and seed in the **params**.

## Generation parameters

- **aspectRatio**: `16:9` for campaign ads; `9:16` for vertical sports social cuts.
- **resolution and model tier**: pick a tier that supports the resolution - fast tiers cap lower (often `720p`); `1080p` needs a full tier.
- **duration**: `5-8s`; for true fast-cut ads, generate multiple short shots and assemble them.
- **negativePrompt**: `calm atmosphere, static camera, soft lighting, wellness mood, casual creator footage, bright cheerful lifestyle, slow meditative pacing, clean studio product look, low resolution, distorted limbs`.
- **generateAudio**: **on** if supported - breath, foot strikes, glove impact, rope slap, or gym ambience strengthens the ad feel.
- **seed**: mild lever for text-to-video; use `firstFrameImageUrl` for look consistency.
- **firstFrameImageUrl** (strongest stability lever): generate one high-intensity still (see *Reference still*) and pass it as the first frame.

## How to apply

Stay close to the effort. Show body mechanics, sweat, gear, and impact. If the brief is casual sports lifestyle, playful challenge content, or calm wellness, this style is too intense.

## Worked examples

Same athletic-ad register; the sport changes.

1. **"a runner training at dawn"** -> low close-up of shoes striking a dark track, calf tension, lane lines streaking, motion blur (the picker thumbnail).
2. **"a boxer before a match"** -> close-up of a boxer tightening white hand wraps, sweat and rim light, gritty gym (see reference still).
3. **"a climber on an overhang"** -> chalked fingers gripping rock, forearm tension, low angle, high contrast, dust in backlight.
4. **"a cyclist sprint finish"** -> legs pumping, chain and wheel blur, harsh rim light, desaturated race intensity.

## Reference output

| Field | Value |
| --- | --- |
| Picker thumbnail | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/5a95669a-b86c-4817-9d82-250da7509b54/thumbnail-athletic-motivation.jpg` |
| Reference still - boxer hand wraps (Seedream, seed 62) | `https://cdn.vm0.io/artifacts/user_3EWY21Oe3f15kfs3yYmbGgDb3NV/be3365b8-9cdc-48b0-ab60-009b14218d3a/image-be3365b8.png` |
| Canonical | extreme effort close-up, sweat, gear detail, motion blur, Dutch/low angle, high-contrast rim light |

> The reference still holds the athletic motivation look on a different sport (boxing vs. running) - the style is sport-invariant. Pass it as `firstFrameImageUrl` to lock the look.
