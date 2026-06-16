---
name: playful-editorial
description: Playful-editorial presentation look — saturated colour fields, scalloped sunburst badges and pill chips, oversized stacked headlines. Carnival palette · Archivo + Manrope · pill radius. The design system (visual language); pairs with a structure template such as aplocoto.
---

# Playful Editorial — design system (visual language)

The look layer: **colours, fonts, radius, motifs**. Pairs with a structure template (default `aplocoto`); carries no layout.

**Essence** — playful editorial: high-saturation colour fields, scalloped sunburst badges and pill chips, oversized stacked headlines kept legible by editorial restraint. Vibrant: a neutral cream base + 4 co-equal saturated accents.

## Colours — carnival (8 role tokens)

| token | hex | role |
|---|---|---|
| `bg` | `#FFFDF7` | page background — neutral cream |
| `surface` | `#FFFFFF` | cards / raised panels |
| `ink` | `#221C14` | primary text + strong marks |
| `ink-soft` | `#5E564A` | secondary / body text |
| `accent` | `#FF7A1A` | hero colour — tangerine |
| `support-1` | `#E5388E` | magenta |
| `support-2` | `#F5B73E` | gold |
| `support-3` | `#1FB6A6` | teal |
| `placeholder` | `#EFEADF` | photo-frame fill |

- **One dominant hue per slide**; the deck rotates accent → support across pages.
- **≤3 decoration colours per slide**; body text only in `ink` / `ink-soft`, never an accent.
- Bind colour to CSS role vars (`--bg --ink --accent --support-1 …`), **not literal hex**, so the look stays swappable.

## Fonts

- **Archivo** — grotesque display, strong at scale (headlines).
- **Manrope** — semi-rounded, soft-tech body.
- Both are Google Fonts (OFL/Apache, free for commercial use); load via a Google Fonts `<link>`.

## Radius & motifs

- **radius: pill** — chips, tags, the bar under a title.
- **motifs**: `burst-star` (scalloped sunburst), `big-circle`, `blob` — re-coloured from the accent array. The **same motif recurs on every slide** as the visual fuse that unifies the deck.
