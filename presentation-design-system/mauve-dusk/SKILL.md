---
name: mauve-dusk
description: Mauve Dusk presentation look - soft lavender grounds, warm serif headlines, rounded cards, circle badges, and calm editorial pacing.
---

# Mauve Dusk - design system (visual language)

The look layer: colours, fonts, radius, and motifs. It carries no deck layout.

Source: `System MD/design-system.md` Mauve Dusk palette, Fraunces / Work Sans pairing, and soft radius tokens; selected by `tmpl-botane-organic.md` as the skin for this reference deck.

**Essence** - calm editorial softness: pale lavender grounds, muted mauve as the primary accent, cool blue and dusty pink supports, high-contrast ink, and generous whitespace. It works well for organic, wellness, lifestyle, hospitality, and slow-brand presentations.

## Colours - Mauve Dusk (8 role tokens)

| token | hex | role |
|---|---|---|
| `bg` | `#FAF7FB` | page background - pale lavender white |
| `surface` | `#FFFFFF` | cards / raised panels |
| `ink` | `#2B2533` | primary text + strong marks |
| `ink-soft` | `#635B70` | secondary / body text |
| `accent` | `#9C7BB8` | hero colour - muted mauve |
| `support-1` | `#8AA0C9` | soft blue |
| `support-2` | `#E0B6C9` | dusty pink |
| `support-3` | `#2B2533` | deep ink accent |
| `placeholder` | `#ECE7F0` | photo-frame fill |

- Bind colour to CSS role vars (`--bg --ink --accent --s1 --s2 --s3 --ph`) rather than hard-coding hex values in slide content.
- Use mauve as the main colour-field accent; rotate blue, dusty pink, and ink for secondary panels and icon badges.
- Body text stays in `ink` / `ink-soft`; use accent colours for panels, icons, dots, badges, and chart rings.

## Fonts

- **Fraunces** - warm serif display for headlines, large numbers, chapter titles, and badges. Keep weights at 400-600.
- **Work Sans** - quiet sans body for leads, captions, cards, legends, and annotations.
- Load both through Google Fonts when authoring HTML decks.

## Radius & motifs

- **radius: soft** - rounded cards, round icon tiles, soft photo rectangles, and circular badges.
- **motifs**: `colour-block-panel`, `circle-badge`, `icon-in-circle`, `soft-dot`, `donut-ring`, `rotated-side-title`.
- Keep the visual rhythm calm and airy: fewer motifs than a playful deck, but at least one repeated dot, circle, side-title, or panel on every slide.

## Usage & avoid rules

- Use `accent` as the single hero colour; keep `support-*` to secondary panels, chart segments, badges, icons, and small decoration.
- Keep support colours to 3 or fewer per slide. Do not use `support-*` for body text.
- Body copy uses `ink` or `ink-soft`. Accent-colour text is allowed only when it clears contrast against the ground.
- Text on colour-block panels must use a computed on-colour (`--t0`, `--t1`, `--t2`, or equivalent), never raw mauve/blue/pink text on a coloured fill.
- Use no more than two font families: Fraunces for display moments, Work Sans for all readable body and annotation text.
- Use radius tokens consistently: soft rectangles use medium/large radii; circular media, badges, dots, and icon tiles use `50%`.
- Avoid one-off hex values, decorative gradients not declared by the design system, and dense multi-hue slides that overpower the soft editorial mood.
