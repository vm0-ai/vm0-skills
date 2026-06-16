---
name: html-ppt-aplocoto
description: 15-slot HTML presentation structure — cover · agenda · 3 section dividers · about · vision · team · services · process · gallery · stats · testimonials · pricelist · thank-you. Oversized headlines, full-bleed colour-field rhythm, a motif on every slide.
---

# Aplocoto — 15-slot structure (template)

The structure layer: **what goes where**, palette-agnostic. Colour/font are bound to CSS role vars so the skin is swappable.

Reference: `build.mjs` (source generator) -> `example.html` (rendered static deck) · `preview/slide-01..15.png`.

A 15-page deck for consumer / family / event / brand-pitch briefs. Each slot's **role and required content** are defined in the [content-role contract](../canonical-page-set.md); the slot map below adds aplocoto's **layout** for each slot (by number).

## Slot map (layout per slot)

| Slot | Layout |
|---|---|
| 01 | 2 big-circle photo frames · year burst-badge · pill · giant 4-line all-caps headline on a colour ground |
| 02 | vertical TOC list — 4 entries pointing to dividers 03 / 07 / 11 / 15 |
| 03 | full ink ground · 3 decorative burst-badges · centred kicker + display title |
| 04 | text + photo split · lead + body + a chip pair |
| 05 | angled split (ink left + cream right) · 3-item numbered list with burst numerals |
| 06 | 4 × 1 team cards (photo + name + role) |
| 07 | same as 03 |
| 08 | 2 × 2 icon quad |
| 09 | 4-step horizontal spine |
| 10 | irregular photo grid + 2 hashtag pill overlays |
| 11 | same as 03 |
| 12 | big-circle panel + 3 burst-badge stats on a colour ground |
| 13 | 3 quote cards (photo + quote + attribution) |
| 14 | 3 price cards (hue rotation) · ink "Most popular" pill on the middle card |
| 15 | year burst-badge + pill on an ink ground |

## Layout & composition rules

- **Full density** — every slide carries a hero / colour-field + **≥3 decoration elements** (badge / pill / numeral / big-circle / photo frame). No sparse one-word slides.
- **One dominant hue per slide**; rotate the ground colour across the deck.
- **A motif on every slide** — the same burst-star / pill / numeral recurs (the visual fuse).
- **Text never sits on a decorative shape** — keep a clear band between text and motifs.
- **SVG-first** — shapes/charts as inline SVG/HTML (0 image credits); photo frames are gray placeholders for real photos.
- **Final decks must fill media slots** — any photo frame in this template is a required visual slot. Use real, approved imagery when available; if no suitable image exists, replace the frame with an intentional chart / diagram / quote / logo composition instead of leaving an empty placeholder.
- Sentence case for headings (kicker uppercase, wide tracking); title ≤ 6 words, lead ≤ 28, body bullet ≤ 14.

## Build the reference deck

Run from this directory:

```bash
node build.mjs
```

The script regenerates `example.html` from structured demo data and small layout helpers (burst badges, pills, media frames, cards, dividers). The checked-in previews are screenshots of the generated example deck.

## Apply to other content

Replace content per slot, keep the layout:

| Brief | Content swap |
|---|---|
| Family / kids brand (default) | the demo content |
| Event programme | About → "What it is" · Team → speakers · Services → tracks · Pricelist → ticket tiers · Testimonials → past-attendee quotes |
| Internal review | About → "About this team" · Services → workstreams · Process → quarter plan · Stats → KPIs · Pricelist → budget tiers |
