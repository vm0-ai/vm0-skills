---
name: html-ppt-botane-organic
description: 15-slot HTML presentation structure for organic, wellness, and slow-brand decks - colour-block panels, circular media, icon cycles, side titles, donut stats, and soft editorial whitespace.
---

# Botane Organic - 15-slot structure (template)

The structure layer: **what goes where**, palette-agnostic. Colour/font should be bound to CSS role vars so the skin remains swappable.

Reference: `build.mjs` (source generator) -> `example.html` (rendered static deck) and `preview/slide-01..15.png`.

A 15-page deck for organic / natural / wellness / hospitality / slow-brand briefs. Each slot's **role and required content** are defined in the [content-role contract](../canonical-page-set.md); the slot map below adds Botane Organic's **layout** for each slot.

## Slot map (layout per slot)

| Slot | Layout |
|---|---|
| 01 | cover split - serif wordmark on the left, full-height colour block on the right, large circular media frame |
| 02 | agenda - slim colour strip, vertical TOC list, small circular media accent |
| 03 | section divider - left half colour-block panel, large serif chapter title, circular media frame on the right |
| 04 | about - full-height soft photo panel on the left, rotated side-title, editorial text column on the right |
| 05 | mission / vision - numbered circle-badge list, right-side colour block, small circular media accent |
| 06 | team - quiet heading band, 3-column team grid with rounded media cards |
| 07 | same divider system as slot 03 |
| 08 | services - 2 x 2 rounded icon cards with line icons inside circle / rounded-square badges |
| 09 | process - four-step horizontal cycle / spine with alternating copy and icon-in-circle nodes |
| 10 | gallery - rotated side-title, short text column, irregular photo grid |
| 11 | same divider system as slot 03 |
| 12 | stats - large headline and proof copy on the left, donut ring with centre statement plus supporting stat stack on the right |
| 13 | testimonials - large heading, two or three quote cards with small media / attribution |
| 14 | pricelist - three rounded pricing cards, middle tier can carry a dark "Most loved" pill |
| 15 | thank-you - inverse cover split, colour block and circular media on the left, large serif closing message on the right |

## Layout & composition rules

- **Balanced density** - use large whitespace and calm editorial pacing, but every slide still needs a visible structural motif: colour block, circle, dot, rotated side-title, icon node, donut, or card group.
- **Circular media is required** where the slot includes a circle or photo frame. Use real, approved imagery when available; if no suitable image exists, replace the frame with an intentional diagram, product render, map, quote composition, or logo mark instead of leaving an empty placeholder.
- **Colour blocks carry structure** - panels should define chapters, covers, closing slides, and supporting side fields. Text on panels must use the matching on-colour token.
- **Icon style** - use thin line icons inside circular or soft-rounded badges. Choose icons only when they name the concept directly, such as leaf, sprout, sun, recycle, cup, book, heart, or cycle.
- **Side-title style** - rotated uppercase side labels are a signature device. Use them sparingly on about / gallery / feature slides, not on every page.
- **Chart style** - stats should prefer a donut ring with a centre number and a short labelled legend or supporting stat stack.
- **SVG-first** - shapes, icons, connectors, donut charts, and badges should be inline SVG/HTML; photo frames are the only expected raster media slots.
- Sentence case for headings (kicker uppercase, wide tracking); title <= 7 words, lead <= 28 words, body bullet <= 16 words.

## Apply to other content

| Brief | Content swap |
|---|---|
| Wellness / organic brand (default) | the demo content |
| Hospitality / venue | About -> place story · Team -> hosts · Services -> rooms / experiences · Gallery -> property photos · Pricelist -> packages |
| Community programme | Mission -> commitments · Process -> participation path · Stats -> outcomes · Testimonials -> participant quotes |
| Product line | Services -> ranges · Gallery -> product uses · Stats -> repeat purchase / units / impact · Pricelist -> bundles |

## Build the reference deck

Run from this directory:

```bash
node build.mjs
```

The script regenerates `example.html` from structured demo data and local layout helpers. It bakes the Mauve Dusk tokens into static CSS and removes the theme switcher/runtime script before writing the delivered reference HTML.
