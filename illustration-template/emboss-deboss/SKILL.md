---
name: emboss-deboss
description: Minimal editorial posters and covers pressed into tactile matte paper. Shallow raised lettering and recessed graphic contours share one soft side light, fine paper fibers, restrained color, generous negative space, and one theme-driven visual metaphor. Trigger for /emboss-deboss, embossed paper posters, debossed typography, letterpress covers, or tactile print design.
---

# Emboss & Deboss

Turn a theme or a short sentence into one finished poster that looks physically
pressed into thick, uncoated paper. Typography, a single visual metaphor, paper
relief, and empty space form one composition. The result should feel like an
independent magazine or an art-book cover.

This is a prompt-compilation resource. Return one resolved image prompt to the
outer Okou image-generation flow. Use its provider, model, reference inputs,
output directory, and delivery contract. Do not start a nested generator or
change the selected model.

## Interpret the brief

Accept a theme alone. Optional inputs are exact headline, subtitle, brand text,
palette, aspect ratio, intended use, and a preferred relief treatment. Honor
explicit user choices before defaults and vary only unspecified choices.

1. Identify the idea behind the theme: a relationship, movement, feeling, or
   change. Translate it into one concrete visual metaphor.
2. If the user supplies visible text, preserve its spelling, language, case,
   and punctuation exactly. A line break may change; the wording may not.
3. If only a theme is given, write a short headline in the user's language.
   Omit optional subtitle, brand, date, edition, and footnote when not supplied.
   Never invent business claims, logos, signatures, or an attribution on the art.
4. Select one composition, a coherent palette, typography, and which elements
   rise or recede. Resolve these choices before calling the image model; do not
   hand it a menu of alternatives or ask it to randomize the whole design.
5. Default to a portrait 2:3 poster. Square and landscape covers use the same
   material rules with a newly composed layout, rather than cropping a portrait.
   Map the requested ratio to a size supported by the selected model.

## Material rules

- Fill the frame with a single, flat sheet of dyed or natural uncoated paper.
  Use a fine, irregular fiber grain. The paper remains matte, including on the
  raised faces and inside the impressions.
- Show the sheet front-on, with no perspective tilt, surrounding desk, frame,
  book mockup, photographed hand, curled edge, or separate stacked layers.
- Keep relief shallow: a fraction of the paper thickness, with compressed,
  slightly softened fiber edges. The design is part of the sheet.
- Use one broad soft light from the upper left unless the user specifies a
  different direction. Keep this light consistent across every element.
- **Emboss:** the face rises slightly above the sheet. A narrow lit edge faces
  the light and a small external shadow falls toward the lower right.
- **Deboss:** the contour or letter is pressed into the sheet. The recessed
  interior carries a narrow shadow at its upper-left inner wall and a restrained
  opposite edge highlight. Its center must sit below the surrounding surface.
- Include both processes by default: for example, a raised headline beside a
  recessed path, or a raised leaf above a recessed title. If the user asks for
  only one process, use only that process.
- At least one major element is blind pressed: its face keeps the paper's own
  color and the relief is read through edge light and shadow. Keep another
  readable anchor when the headline would otherwise disappear at thumbnail size.
- Ink may color selected lettering or a small detail. Use one or two principal
  colors; an optional tiny accent must have a compositional purpose. Dark blue,
  green, pink, or yellow paper is as valid as ivory.

Avoid plastic, inflated rubber, foam, clay, chrome, metallic engraving, glossy
bevels, deep extruded 3D letters, stone carving, laser-cut holes, floating objects,
drop-shadow UI tiles, ornamental gradients, noisy distress, and harsh spotlights.
Natural local shading from the paper relief is necessary.

## Composition and typography

Use one main metaphor and at most two small supporting marks. Leave roughly
40–60% of the canvas quiet. Let the title and metaphor interact through a shared
axis, a contour, a deliberate gap, or an overlapping region with readable text.

Select a composition that fits the idea and format:

| Layout | Relationship | Suitable concepts |
| --- | --- | --- |
| Open field | Small offset title faces a generous unoccupied area bounded by a pressed arc | Clarity, rest, space |
| Ascending path | A single recessed route connects a lower starting point to raised type above | Learning, progress, travel |
| Edge dialogue | A large title at one edge balances a smaller relief at the opposite edge | Contrast, confidence, focus |
| Interwoven | A simple stem, thread, or line shares a stroke direction with the title | Craft, connection, growth |
| Offset monument | A single large blind-pressed form sits off center with a compact text cluster | Calm, strength, remembrance |
| Split rhythm | Two unequal text groups relate across one continuous pressed contour | Work and life, before and after |

Choose a refined serif, condensed sans, geometric sans, or another appropriate
editorial typeface. Use no more than two type families. Give the headline a clear
scale advantage; distinguish supplied supporting copy through size, weight,
spacing, or ink contrast. Do not add text simply to fill a third hierarchy level.

For Chinese, maintain complete, recognizable character structures and natural
reading order. Vertical titles are allowed when they help the composition; do
not slice a character in half. For Latin text, keep complete words and deliberate
line breaks. Do not stretch letters arbitrarily. Keep all required text inside
a safe margin of at least 6% of the shortest edge.

## Controlled variation

Within a series, retain the paper grain, shallow relief, restrained palette,
single light direction, and quiet editorial mood. Change at least two of the
unconstrained axes between requested variants:

- Paper color and ink relationship.
- Type family and headline scale.
- Composition and title location.
- Theme-specific metaphor.
- Which element is raised and which is recessed.

Do not rotate through layouts mechanically when the user's theme calls for a
particular relationship. If the user supplies a fixed brand system or asks for a
consistent series, its fixed choices take precedence over variation.

Useful palette relationships include ivory / forest ink, cobalt / warm white,
sage / dark green, blush / burgundy, charcoal / pale gray, and butter yellow /
ochre. These are optional starting points, not a locked list.

## Prompt shape

Resolve the following into continuous, concrete prose:

```text
Output: one finished front-on poster; requested ratio and supported size.
Theme and intent: the user's idea, expressed through one specific metaphor.
Visible text: an exact list of strings, or explicitly no text.
Paper: one matte fiber sheet, its color and fine-grain character.
Layout: precise title and metaphor positions, relative scale, and quiet space.
Typography: selected family, line breaks, hierarchy, ink or blind treatment.
Emboss: name the raised elements and their shallow edge behavior.
Deboss: name the recessed elements and their inner shadow behavior.
Lighting: one broad upper-left side light shared by all elements.
Exclusions: extra text, mockup surroundings, glossy or deep 3D material.
```

Preserve the chosen physical process in the final prompt. Merely writing
"premium embossed poster" is insufficient: specify the raised and recessed
elements separately and tie their shadows to the same light source.

## References

Read [REFERENCES.md](./REFERENCES.md) for three independently generated examples.
Inspect them as material and composition references; do not copy their wording or
motifs into unrelated briefs. None is a required image-to-image input. The style
works from text alone, and the user's own reference handling takes precedence.

## Verify the output

Inspect the image returned by the outer generation flow:

- Paper fibers are visible without looking like sand or concrete.
- Both raised and recessed forms read correctly under one light direction,
  unless the user explicitly selected only one process.
- The image has one clear metaphor and intentional empty space.
- Required text is exact, legible, and uncropped, with no invented extra copy.
- A thumbnail still has a readable focal point; blind pressing is not invisible.
- The composition follows the requested ratio and is a complete artwork.

If the process looks inverted or too deep, specify the affected edge and reduce
its relief. If lettering is wrong, retain the exact requested wording, simplify
the adjacent shape, and retry through the outer generation flow. Never silently
rewrite the user's headline to hide a rendering error.
