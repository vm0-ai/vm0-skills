---
name: html-ppt-botane-organic
description: 15-slot HTML presentation structure — cover · agenda · 3 section dividers · about · vision · team · services · process · gallery · stats · testimonials · pricelist · thank-you. Colour-block panels, circular media, rotated side-titles, icon cycles, and donut stats.
---

# Botane Organic — 15-slot structure (template)

The structure layer: **what goes where**, palette-agnostic. Colour/font are bound to CSS role vars so the skin is swappable.

Reference: `build.mjs` (source generator) -> `example.html` (rendered static deck) · `preview/slide-01..15.png`.

A 15-page deck for organic / natural / wellness / hospitality / slow-brand briefs. Its source contract is `PPT Template MD/botane-organic/tmpl-botane-organic.md`: balanced density, SVG-first rendering, automatic content fitting, and these Botane signature devices declared by the template block:

- `cover` - colour-block + serif wordmark.
- `numbered-circle-list` - numbered circle badges plus short title/body rows.
- `process-cycle` - icons-in-circles connected by a spine.
- `side-title-photo` - rotated vertical title with a large media frame.
- `donut-statement` - donut ring with centred value and supporting stats.
- `thank-you` - colour-block close with large media and contact.

`System MD/visual-design.md` supplies the shared density, shape-layering, safe-distance, render, and pre-flight principles; the [content-role contract](../canonical-page-set.md) supplies the 15 canonical roles. The simplified slot map below applies Botane Organic's source devices to those canonical roles.

## Slot map (layout per slot)

| Slot | Layout |
|---|---|
| 01 | serif wordmark column · full-height right colour-block panel · large circular media frame · small accent dots |
| 02 | narrow full-height colour strip · vertical TOC list — 4 entries pointing to dividers 03 / 07 / 11 / 15 · small circular media accent |
| 03 | left half colour-block chapter panel · serif display title · large circular media frame on the right |
| 04 | tall inset left photo panel · rotated side-title · right editorial text column with kicker, headline, lead, body |
| 05 | 3-item numbered circle-badge list · right full-height colour block · small circular media accent |
| 06 | calm heading band · 3 × 1 team cards (photo + name + role) |
| 07 | same as 03 |
| 08 | 2 × 2 rounded icon-card quad · each card has a line icon-in-circle plus title/body |
| 09 | 4-step horizontal process spine · alternating above/below labels · icon-in-circle nodes on one connector |
| 10 | rotated side-title · short editorial copy column · 4-cell irregular 3-column photo grid |
| 11 | same as 03 |
| 12 | left headline + proof copy · donut ring with centre percentage · stacked supporting stats |
| 13 | 2 quote cards (photo + quote + attribution) on colour-blocked grounds |
| 14 | 3 price cards (hue rotation) · dark "Most loved" pill on the middle card |
| 15 | inverse cover split · left colour-block panel + circular media · large serif thank-you message and contact |

## Layout & composition rules

- **Balanced editorial density** — every slide carries a structural motif (colour-block panel / circular media / side-title / icon node / donut / rounded card), but the page should still feel calm and spacious.
- **Colour blocks define structure** — use panels for covers, chapter dividers, closing slides, and side fields. Text on a colour panel must use the matching on-colour token.
- **A circular motif on every slide** — media circles, numbered circle-badges, icon-in-circle nodes, soft dots, and donut rings are the visual fuse of the deck.
- **Rotated side-titles are signature accents** — use them on about / gallery / feature slides where they clarify the composition; do not add them to every page.
- **Process and proof have fixed devices** — sequences use the 4-step horizontal spine; breakdowns use a donut ring plus labelled supporting stats.
- **SVG-first** — icons, connector lines, donut charts, dots, cards, and panels are inline SVG/HTML (0 image credits); photo frames are gray placeholders for real photos.
- **Final decks must fill media slots** — any circular or rectangular photo frame in this template is a required visual slot. Use real, approved imagery when available; if no suitable image exists, replace the frame with an intentional product render / map / diagram / quote / logo composition instead of leaving an empty placeholder.
- Sentence case for headings (kicker uppercase, wide tracking); title ≤ 7 words, lead ≤ 28, body bullet ≤ 16.

## Build the reference deck

Run from this directory:

```bash
node build.mjs
```

The script regenerates `example.html` from structured demo data and inline layout helpers (colour blocks, circular media frames, numbered badges, icon cards, process spine, donut stats, quote cards, and price cards). The checked-in previews are screenshots of the generated example deck.

## Apply to other content

Replace content per slot, keep the layout:

| Brief | Content swap |
|---|---|
| Wellness / organic brand (default) | the demo content |
| Hospitality / venue | About → place story · Team → hosts · Services → rooms / experiences · Gallery → property photos · Pricelist → packages |
| Community programme | Vision → commitments · Process → participation path · Stats → outcomes · Testimonials → participant quotes |
| Product line | Services → ranges · Gallery → product uses · Stats → repeat purchase / units / impact · Pricelist → bundles |
