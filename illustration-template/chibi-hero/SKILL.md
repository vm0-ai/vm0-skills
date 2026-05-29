---
name: chibi-hero
description: "Chibi mobile-RPG mascot illustration — oversized-head super-deformed character, warm-dark hand-drawn outlines, cel-shaded flat color fills, single character caught mid-action on a transparent background. Trigger when the user says /chibi-hero, asks for a 'chibi hero', a 'chibi RPG mascot', a 'pocket adventurer character', a 'super-deformed hero illustration', or briefs with an archetype + palette + weapon + pose in this style."
---

# Chibi Hero Illustration

Use this register-only image style when the user asks for a chibi RPG mascot, a pocket adventurer, a super-deformed hero illustration, a `/chibi-hero` piece, or any new character in this oversized-head mobile-RPG style.

This style sits next to `ink-mascot` (single object mascot with stick limbs and headline) and `sticker-sheet` (multi-sticker contact sheet) but is distinct: Chibi Hero is a **single full-body hero character** — chibi proportions, bold warm-brown outline, cel-shaded flat fills, mid-action pose, **always isolated on transparent background**. The character is the whole piece. No scene, no headline, no extra furniture.

Bundled reference imagery — five canonical outputs that demonstrate the framework across the dial space:

- `ref-mage-arcane.png` — Arcane Mage in mid-cast, hands glowing, deep teal + lavender + pale gold palette. Demonstrates the **Cool-Arcane palette** and the **L2 layered-robe** archetype.
- `ref-ranger-forest.png` — Forest Ranger in low-crouched sneak with longbow, olive + leaf-brown + moss palette. Demonstrates the **Forest-Scout palette** and the **L2 cloak + quiver + bracer** archetype.
- `ref-knight-armored.png` — Armored Knight in forward charge lunge with sword + kite shield, steel-blue + crimson + gold palette. Demonstrates the **Steel-and-Crimson palette** and the **L3 full-plate** archetype with cape and decorative sigil.
- `ref-alchemist-tinkerer.png` — Alchemist mid-stumble with smoking flask, mustard + teal + copper palette. Demonstrates the **Tinkerer palette** and the **L3 full-kit** archetype with goggles, pouches, and vial bandolier.
- `ref-cleric-prayer.png` — Cleric in raised-mace prayer pose, warm gold + ivory + soft cyan palette. Demonstrates the **Devout palette** and **L2** at a quieter emotional register — proves the locked frame holds even when the pose energy turns reverent.

## Locked Style Fundamentals (never vary)

| Axis | Spec |
|---|---|
| **Proportions** | Chibi / super-deformed — head ≈ 1× body height, head dominates the silhouette. Tiny torso, short legs, oversized hands relative to the forearm. |
| **Line treatment** | Bold **warm dark brown** outline (deep cocoa, NOT pure black). Even confident weight, no calligraphic taper. Outline hugs every silhouette and major form break. |
| **Fills** | Cel-shaded flat color, exactly **one** tier of subtle darker shadow per surface. No gradients. No soft airbrush. No rim lights. A flat highlight on hair or metal is allowed but stays as a single shape. |
| **Background** | Single character isolated on transparent. **No scene, no ground line, no environment.** Optional tiny ellipse ground shadow under the feet — never a horizon. |
| **Pose** | Always **mid-action and dynamic** — running, lunging, casting, sneaking, leaping, swinging, mid-stumble, raised in prayer. Never a static T-pose or front-facing parade rest. |
| **Face** | Simplified and expressive. Slit / narrow / determined eyes by default; round playful eyes only when the mood dial explicitly calls for it. Tiny mouth or none. No fine facial detail — no eyelashes, no nose shading, no skin texture. |
| **View** | 3/4 angle, camera at eye level. Never pure profile, never pure front. |
| **Canvas** | Square 1024×1024, transparent PNG. Comfortable canvas padding (~8–12% margin on at least 3 sides). |

### The chibi-silhouette rule (critical)

The head is the dominant mass. If the head reads as smaller than the torso, the piece has slipped into normal proportions and is wrong. The eye should land on the head first, then trail down to the body and the weapon.

### The warm-brown-outline rule (critical)

Outlines are warm dark brown (deep cocoa), **never pure black**. Pure black flattens the warmth of the palette and reads as digital sticker rather than hand-drawn mobile-RPG art. Same brown across the whole figure — no varying ink colors.

### The transparent-isolation rule (critical)

The character is the whole piece. No background scene, no floor, no environmental props, no atmosphere. The optional ground-shadow ellipse is the only acknowledgement of the world. This is what makes the asset reusable as a mascot, avatar, or card art.

### The mid-action rule (critical)

Every piece is caught in motion. A standing-still chibi is wrong. Even a meditative cleric is mid-gesture (head bowed, mace raised). Pick a verb before you pick a costume.

## Dials (vary per piece)

- **Archetype** — the hero class. Examples: ninja, mage, knight, ranger, alchemist, bard, cleric, rogue, monk, summoner, beastmaster, paladin, druid, necromancer.
- **Palette** — outfit color family. Canonical anchors:
  - **Warm Earthy** — auburn + slate + scarlet (the original reference DNA)
  - **Cool Arcane** — teal + lavender + pale gold
  - **Forest Scout** — olive + leaf-brown + moss
  - **Steel-and-Crimson** — brushed steel-blue + crimson + gold
  - **Tinkerer** — mustard + teal + copper
  - **Devout** — warm gold + ivory + soft cyan
  - **Desert Ochre** — sand + terracotta + bone-white
  - **Ice Wraith** — pale ice + silver + deep navy
- **Hero prop** — the weapon or signature object. Examples: spear, longbow, staff, dual daggers, tome, hammer, sword + kite shield, smoking flask, lute, scythe, holy mace, war horn, summoning crystal.
- **Pose energy** — the verb. Examples: sprint, lunge, mid-cast, low sneak, leap, ready stance, mid-stumble, swing, raised prayer, drawn-bow hold.
- **Outfit complexity** —
  - **L1**: simple tunic / hood / pants. One layer, no accessories.
  - **L2**: layered cloak or armor + belt + 1–2 accessory pieces (bracer, scarf, pouch, pendant).
  - **L3**: full kit — pauldrons, pouches, sashes, scabbard, trinkets, goggles, capes, plumes. Visually busy but still readable.
- **Mood** — the face read. Examples: determined, fierce, stoic, focused, mischievous, gleeful, weary, smug, serene-focused.

## Prompt template

```
Chibi RPG hero character illustration, super-deformed proportions with oversized head about 1:1 head-to-body ratio. Character: {ARCHETYPE} in {POSE_ENERGY} pose, holding {HERO_PROP}. {PALETTE_NAME} palette: {PALETTE_DETAIL}. {COMPLEXITY} outfit: {OUTFIT_DETAIL}. Bold warm-dark brown outline of confident even weight, NOT pure black. Cel-shaded flat color fills with one subtle tier of shadow. 3/4 view, simplified expressive face with {MOOD} eyes, no fine detail. Single character isolated on transparent background, no scene, no ground. Square 1024×1024 canvas. Style is chibi mobile-RPG mascot — clean vector look, confident hand-drawn outlines, warm earthy line color.
```

## Example briefs

**Brief 1 — Rogue**
> "Rogue chibi hero in mid-sprint with dual daggers raised, plum + charcoal + lime palette, L3 with hood, half-mask, belt pouches, dagger sheaths along the thigh, smug grin."

**Brief 2 — Beastmaster**
> "Beastmaster chibi hero in ready stance with a hunting horn at the hip, warm rust + bone-white + leather brown, L2 fur cloak + tribal beads + simple bracer, fierce determined gaze."

**Brief 3 — Druid**
> "Druid chibi hero mid-cast with a swirl of leaves around an outstretched hand, sage green + bark brown + warm sunlight gold, L2 layered robe with vine sash, serene-focused eyes."

## Model guidance

This style is designed for a single full-body hero character on a transparent background — the kind of crisp vector-look figure a strong text-to-image model can compose in one pass from a detailed prompt. Recommended pairing: a strong general image model (e.g. GPT-image class) at **high** quality, square **1024×1024**, **transparent background** explicitly requested, no in-house style wrapper layered on top. Keep prompts long enough to bake in the locked frame language (chibi proportions, warm dark brown outline, cel-shaded flat fills, transparent background, mid-action pose) verbatim — those phrases are what hold the look across archetypes.

## Anti-patterns

- Multiple characters per piece — solo only.
- Background scene, ground line, or environmental props — strictly isolated.
- Pure black outline — must be warm dark brown.
- Soft / painterly / gradient shading — cel-shading with one shadow tier only.
- Static T-pose or symmetrical parade rest — every piece is mid-action.
- Pure profile or pure front view — 3/4 only.
- Normal human proportions — head must dominate the silhouette.
