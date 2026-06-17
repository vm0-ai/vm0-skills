---
name: html-ppt-business-data
description: 15-slot HTML presentation structure for business metrics and reports - cover, agenda, dividers, company context, commitments, team, services, process, gallery, proof metrics, testimonials, pricing, and contact. Big numbers, stat strips, bars/rings, photo squares, dark/accent data slides.
---

# Business Data - 15-slot structure (template)

The structure layer: what goes where, palette-agnostic. Colour, font, radius, and motif rendering are provided by the selected design system.

Reference: `build.mjs` (source generator) -> `example.html` (rendered static deck) -> `preview/slide-01..15.png`.

This is a number-first data deck for annual reports, market analysis, business reviews, growth stories, and metric-led service pitches. Every slide is anchored by one or more big numbers, charts, stat blocks, or a large image.

## Source Contract

The reusable template comes from `PPT Template MD/business-data/tmpl-business-data.md`:

- `density: balanced`
- `archetypes: cover, big-stat, stat-cards, comparison, chart, device-mockup, quote, thank-you`
- `content_fit: auto`
- `render: svg-first`
- execution rule: lead each slide with one or more big numbers; layer kicker -> title -> hero number -> readable body -> sub-stat row / chart / image.

`System MD/visual-design.md` supplies the shared composition vocabulary: number-hero, stats, chart, quote, device-mockup, focal hierarchy, safe distance, labelled charts, and projection-safe text. `canonical-page-set.md` supplies the fixed 15 content roles.

## Canonical Slot Mapping

| Slot | Business Data treatment |
|---|---|
| 01 Cover | wordmark/kicker, giant title, large right-side photo block, 3-stat strip |
| 02 Agenda / TOC | numbered section list with target pages and a supporting photo square |
| 03 About divider | dark plum section divider with chapter number and plus marks |
| 04 About / Intro | large side photo, company narrative, and horizontal bar chart |
| 05 Mission / Vision | three measured commitments with numbered badges and side photo |
| 06 Team | four-member grid with photo squares and roles |
| 07 Work divider | dark plum section divider |
| 08 Services | 2 x 2 service cards with icon tiles |
| 09 Process | four-step horizontal process spine |
| 10 Gallery / Portfolio | four project photo squares plus short context copy |
| 11 Proof divider | dark plum section divider |
| 12 Stats / Impact | accent-ground big-stat page with hero metric, donut, and sub-stats |
| 13 Testimonials | three quote cards with customer attribution |
| 14 Pricelist | three pricing/retainer cards with one highlighted tier |
| 15 Thank you / Contact | accent-ground close with contact and large photo block |

## Layout Rules

- Balanced density: every slide needs a clear hero, but should still leave enough whitespace for projection readability.
- The number is the graphic whenever possible: stat strips, big-stat pages, charts, or numeric badges should create the visual rhythm.
- Use large photo blocks for cover, agenda, about, mission, gallery, and thank-you slots; final decks should replace placeholders with approved imagery or intentional charts.
- Use dark divider slides for chapter rhythm and one accent-ground data slide for the bold proof claim.
- Keep text hierarchy consistent: kicker, title, hero number/stat, body, supporting chart or image.
- Bars and rings must be labelled with values; they are not decorative-only shapes.
- Use SVG/HTML primitives for charts and icons; avoid rasterizing charts into screenshots.

## Content Fit

- Titles should stay short enough to leave room for the metric or chart.
- Body copy should be readable at projection scale; use short leads and compact captions.
- Numbers must not overflow their stat block, card, or accent panel.
- If content is too dense for a slot, reduce copy before reducing the visual hierarchy.

## Build The Reference Deck

Run from this directory:

```bash
node build.mjs
```

The script regenerates `example.html` as a static 15-slide deck with no runtime theme switcher and no scripts. Preview PNGs are screenshots of this generated reference deck.

## Apply To Other Content

- Annual report: use revenue, retention, market count, team size, customer quotes, and plan tiers.
- Market analysis: use market size, segment shares, trend bars, proof metrics, and recommendation tiers.
- Business review: use KPIs, operating mix, process cadence, project gallery, impact stats, testimonials, and next-period commitments.
- Service pitch: use outcomes, delivery process, case snapshots, proof metrics, customer quotes, and engagement options.
