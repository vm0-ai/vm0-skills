---
name: html-ppt-aplocoto
description: 15-slot HTML presentation structure — cover · agenda · 3 section dividers · about · vision · team · services · process · gallery · stats · testimonials · pricelist · thank-you. Oversized headlines, full-bleed colour-field rhythm, a motif on every slide. Pairs with a visual-language design system such as playful-editorial.
---

# Aplocoto — 15-slot structure (template)

The structure layer: **what goes where**, palette-agnostic. Pairs with a design system for visual language (default `playful-editorial`). Colour/font are bound to CSS role vars so the skin is swappable.

Reference: `example.html` (rendered static deck) · `preview/slide-01..15.png`.

A 15-page deck for consumer / family / event / brand-pitch briefs. Follows the 15-slot **content-role contract** ([`../canonical-page-set.md`](../canonical-page-set.md)) — that defines each slot's role and required content; the slot map below adds aplocoto's layout per role.

## Slot map

| Slot | Title | Layout |
|---|---|---|
| 01 | Cover | 2 big-circle photo frames · year burst-badge · pill · giant 4-line all-caps headline on a colour ground |
| 02 | Agenda | vertical TOC list — 4 entries pointing to dividers 03 / 07 / 11 / 15 |
| 03 | Section divider: About | full ink ground · 3 decorative burst-badges · centred kicker + display title |
| 04 | About / Intro | text + photo split · lead + body + a chip pair |
| 05 | Mission / Vision | angled split (ink left + cream right) · 3-item numbered list with burst numerals |
| 06 | Team grid | 4 × 1 team cards (photo + name + role) |
| 07 | Section divider: Work | same as 03 |
| 08 | Services | 2 × 2 icon quad |
| 09 | Process | 4-step horizontal spine |
| 10 | Gallery | irregular photo grid + 2 hashtag pill overlays |
| 11 | Section divider: Proof | same as 03 |
| 12 | Stats / Impact | big-circle panel + 3 burst-badge stats on a colour ground |
| 13 | Testimonials | 3 quote cards (photo + quote + attribution) |
| 14 | Pricelist | 3 price cards (hue rotation) · ink "Most popular" pill on the middle card |
| 15 | Thank you | year burst-badge + pill on an ink ground |

## Layout & composition rules

- **Full density** — every slide carries a hero / colour-field + **≥3 decoration elements** (badge / pill / numeral / big-circle / photo frame). No sparse one-word slides.
- **One dominant hue per slide**; rotate the ground colour across the deck.
- **A motif on every slide** — the same burst-star / pill / numeral recurs (the visual fuse).
- **Text never sits on a decorative shape** — keep a clear band between text and motifs.
- **SVG-first** — shapes/charts as inline SVG/HTML (0 image credits); photo frames are gray placeholders for real photos.
- Sentence case for headings (kicker uppercase, wide tracking); title ≤ 6 words, lead ≤ 28, body bullet ≤ 14.

## Apply to other content

Replace content per slot, keep the layout:

| Brief | Content swap |
|---|---|
| Family / kids brand (default) | the demo content |
| Event programme | About → "What it is" · Team → speakers · Services → tracks · Pricelist → ticket tiers · Testimonials → past-attendee quotes |
| Internal review | About → "About this team" · Services → workstreams · Process → quarter plan · Stats → KPIs · Pricelist → budget tiers |
