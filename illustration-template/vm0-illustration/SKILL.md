---
name: vm0-illustration
description: "Generate vm0-style vm0 in-app spot illustrations: bold hand-drawn ink line art with white-filled interiors, a soft rounded color backdrop, transparent output, and simple iconic metaphors for product states."
---

# vm0 Illustration

Use this register-only image style when the user asks for a vm0 in-app spot illustration, empty-state artwork, billing/permission/error state artwork, or a small product UI illustration in the vm0 style.

This style is separate from Notion Illustration. Notion Illustration is black brush-pen editorial character artwork on pure white. vm0 Illustration is a vm0 product illustration style built around a single iconic object or metaphor, white-filled line art, and one soft color backdrop.

## Locked Style

- Square spot illustration, usually 1024 x 1024.
- Transparent final background.
- One central product metaphor or object, not a character scene.
- Bold black hand-drawn ink line drawing with confident, slightly imperfect strokes.
- Minimal detail: essential contours only, no crosshatching, no shading, no texture-heavy rendering.
- Pure white (`#FFFFFF`) filled interior inside the line art so the drawing stays opaque over the color shape. The interior must not be gray, dark, shaded, translucent, or blended with the backdrop.
- One soft rounded color block behind the drawing, like a halo, pill, oval, or rounded-square badge.
- The color block supports the drawing; it should not fully contain it.
- The drawing extends beyond the color block on 2-3 sides.
- The color block occupies roughly 30-50% of the canvas.
- Pixels outside the line art and color block must be transparent. Do not add any glow, vignette, cast shadow, ambient lighting, gray paper, or background wash.
- No logo, no text, no UI chrome, no watermark, no border.

## Color Direction

Prefer one accent color from the vm0 avatar/product palette:

- yellow: `#EDC43E`
- teal: `#3EB7B8`
- grey: `#97918A`
- pink: `#FF81B2`
- brown: `#E88033`
- wheat: `#EDC183`
- light pink: `#F3BAB1`
- sienna: `#C77242`
- peach: `#EBC2AA`

Pick one color per image. Use vibrant colors for friendly states and warmer neutral colors for permission, billing, or security states. Use pink sparingly.

## Prompt Construction

Turn the user's request into a short concrete metaphor, then generate one polished image in this style.

Good metaphors:

- no permission: a chunky padlock with a rounded shackle and keyhole, with a small key beside it
- empty schedule: a simple calendar page with one loose checkmark and a small sparkle
- empty chat: two rounded speech bubbles overlapping, one with a small sparkle
- billing plan: a small receipt or stacked card with a coin and checkmark
- product update: a gift box with lid lifting and a few sparkles
- retry/loop: two curved arrows chasing each other in a circular refresh loop

Use a concise prompt with these constraints:

```text
vm0-style vm0 in-app spot illustration of <metaphor>.
Square transparent-background PNG. Bold hand-drawn black ink line art with confident natural wobble and intentional small contour breaks. The object has an opaque pure white #FFFFFF filled interior, not gray, not dark, not shaded, and not blended with the backdrop. Behind it is a single soft rounded <color name> color block using <hex>, like a pill or rounded-square halo. The drawing extends beyond the color block on multiple sides. Pixels outside the drawing and color block are fully transparent. Minimal iconic detail only. No text, no logo, no UI, no border, no shadows, no glow, no vignette, no hatching, no gray background.
```

## Evaluation Checklist

- The image reads as one simple iconic product metaphor.
- The line art is bold and hand-drawn, not vector-clean.
- The object interior is pure white-filled, not transparent, gray, dark, shaded, or backdrop-colored.
- The color block sits behind the drawing and does not trap it inside.
- The final background is transparent.
- There is no glow, vignette, cast shadow, gray wash, or background outside the color block.
- There is no text, logo, UI chrome, border, or watermark.
