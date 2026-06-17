---
name: berry-pop
description: Berry Pop presentation look - magenta/plum accent system, Space Grotesk display, Lexend body, soft corners, plus marks, stat blocks, photo squares, bars, and rings.
---

# Berry Pop - design system (visual language)

The look layer: colours, fonts, radius, and visual motifs. It carries no slide order, content role, or page-specific layout.

Source: `System MD/design-system.md` defines the Berry Pop palette, Space Grotesk / Lexend pairing, soft radius personality, component roles, and contrast rules. `PPT Template MD/business-data/tmpl-business-data.md` selects this skin for the Business Data template.

## Essence

Bold consumer/lifestyle data energy: a pale pink canvas, dark plum ink, one magenta hero accent, purple/pink support colours, and soft rounded geometry. It should feel confident and number-led without becoming heavy or corporate.

## Colour Roles

- `bg` `#FFFAFC` - page canvas.
- `surface` `#FFFFFF` - cards and raised panels.
- `ink` `#2E1A2C` - primary text and strong marks.
- `ink-soft` `#6A5566` - secondary/body text.
- `accent` `#D63A8E` - hero numbers, key rules, primary chart series, small plus marks.
- `support-1` `#8E5BD0` - secondary chart series and decorative fills.
- `support-2` `#F4B8D4` - light support fill, soft chart segment, tint panel.
- `support-3` `#2E1A2C` - dark plum emphasis fill.
- `placeholder` `#F0E6EC` - photo-frame and chart-track neutral.

## Colour Rules

- Body text uses `ink` or `ink-soft`, never `accent` or `support-*`.
- Use one dominant hue per slide; support colours are for decoration, charts, and small flourishes.
- Limit decoration to at most three colours on one slide.
- Text on colour fills must use computed on-colours, not raw white/black guesses.
- When a colour becomes a full slide or large panel ground, use the contrast-safe ground variant (`--g*`) with its paired text colour (`--t*`).
- The accent is not always safe as small text on `bg`; use the computed key colour (`--ka`) for accent-like text.

## Typography

- Display: `Space Grotesk`, weights 400-600.
- Body: `Lexend`, weights 300-600.
- Impact comes from size and spacing, not very heavy weights.
- Keep to these two families; do not introduce a third family for captions or numbers.

## Geometry And Motifs

- Radius personality: soft. Cards, badges, photo squares, and chart containers use medium/large rounded corners.
- Plus marks act as data-point markers and small connective decoration.
- Stat blocks are the main visual units: large number, short label, and a clear caption.
- Photo squares use the neutral placeholder fill until replaced with approved imagery.
- Bars and rings are inline SVG/HTML and use `accent` plus `support-*` as data series.

## Avoid

- Do not use support colours for paragraph/body text.
- Do not make every slide magenta; rotate light, accent, and dark plum emphasis.
- Do not add gradients unless the template explicitly asks for a fill-only gradient.
- Do not use sharp, square Bauhaus-style corners; this skin is soft.
- Do not put text over decorative plus marks, chart fills, or photo placeholders without a clear contrast band.
