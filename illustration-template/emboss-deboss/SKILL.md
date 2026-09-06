---
name: emboss-deboss
description: Compose poetic editorial posters and covers in tactile matte paper, with clearly raised lettering and forms, recessed contours, fine fibers, and intentional negative space. Supports Chinese, English, Japanese, and text-free artwork. Use for /emboss-deboss, embossed paper posters, debossed typography, letterpress covers, or paper-relief design.
---

# Emboss & Deboss

Turn a theme into a finished artwork that looks physically pressed into thick,
uncoated paper. Typography, a visual metaphor, relief, and empty space form one
composition. The mood is quiet and poetic; the depth is unmistakable at the size
of the complete poster.

This is a prompt-compilation resource. Return one resolved image prompt for the
current image to the outer Okou generation flow. The outer flow owns generation,
provider, model, reference inputs, size, retries, output directory, and delivery.
Do not start a nested generator or change the selected model.

## Interpret the brief

Accept a theme alone. Optional inputs include exact text, language or no-text
mode, palette, aspect ratio, intended use, and relief treatment. Explicit user
choices override defaults; vary only unspecified choices.

- Find the relationship, movement, or feeling behind the theme and express it
  through one concrete visual metaphor.
- Preserve supplied visible text exactly, including language, characters, case,
  and punctuation. Line breaks may change unless the user fixes them. Do not
  translate supplied text without a request to do so.
- For a theme without supplied copy, create a short headline in the requested
  language, otherwise the user's language. A no-text request overrides this
  headline default. Omit unsupplied subtitles, brands, dates, and footnotes.
- Resolve the composition, palette, typography, and raised/recessed elements
  before returning the prompt. Do not give the image model a menu of options.
- Default to portrait 2:3. Recompose for square or landscape; do not crop a
  portrait into another format. Use a size supported by the selected model.

## Paper and relief

- Use one continuous sheet of thick matte cotton or uncoated paper, seen
  front-on. Fine, irregular fibers continue across faces, shoulders, and grooves.
  Broad empty areas stay calm; grain must not compete with the relief edges.
- Keep the design integral to the sheet, with low sculpted paper relief. Do not
  make the relief so faint that it appears flat when the whole poster is visible.
- Use one soft directional side light, upper left by default, low enough to
  reveal height. All forms share its direction and shadow behavior.
- **Emboss:** specify a raised matte face, a lit shoulder toward the light, a
  shaded side wall away from it, and a short attached contact shadow on the
  surrounding paper. Letter counters remain at the lower paper level. Color
  contrast, an outline, or a blurred shadow alone does not establish volume.
- **Deboss:** specify a sunken center, a shaded upper-left inner wall, and a
  restrained opposite-edge highlight under the default light. A printed dark
  line alone does not establish a recessed channel.
- Include both processes by default: a raised title or main form can sit beside
  a recessed route, water line, leaf vein, or contour. Honor requests for only
  embossing or only debossing. Keep supporting relief quieter than the focal form.
- Give the headline and primary solid form enough edge definition to read in
  the complete composition. For an embossed moon or disk, describe a gently
  convex face, continuous rounded shoulder, shaded side wall, and attached base
  shadow. A flat colored circle or glow halo is insufficient.
- Use blind pressing on a major element where the brief permits: its face keeps
  the paper's color, and coherent edge lighting makes it legible. Selected ink
  may color raised faces, but must not replace their physical relief.
- Use one or two principal colors, with a small purposeful accent if needed.
  Ivory, cobalt, sage, blush, charcoal, and butter yellow are valid paper colors.

Avoid coarse sand or concrete grain, gritty speckles, oversharpening, plastic,
foam, clay, stone, chrome, glossy bevels, inflated lettering, deep block extrusion,
floating cutouts, and detached drop shadows. Exclude desks, frames, mockup books,
curled sheets, and separate stacked layers unless the user requests a mockup.

## Poetic composition

Build a relationship rather than a collection of decorative symbols. A small
boat can answer a large moon across empty water; a distant sun can balance a
recessed valley; a leaf can end a wind path. Choose the metaphor for the user's
theme, without automatically repeating these subjects.

Use one main metaphor and at most two supporting marks. Quiet space often covers
roughly 40–60% of the canvas, adjusted for the brief. Give that space a purpose:
distance, stillness, anticipation, or a path for the eye.

Select a fitting spatial relationship:

| Layout | Relationship |
| --- | --- |
| Open field | A compact focal group faces a generous empty area |
| Ascending path | A recessed route connects a lower origin to a raised destination |
| Edge dialogue | Unequal forms or text groups balance opposite edges |
| Interwoven | Type and a stem, thread, or contour share a direction without hiding strokes |
| Offset monument | One large off-center form balances a small secondary anchor |
| Split rhythm | Two unequal groups relate across a continuous pressed contour |

Specify positions, relative scale, and clear gaps. Let text and image share an
axis or contour while protecting every required glyph. Avoid accidental tangency,
repetitive contour clutter, and placing an unrelated icon beside a headline.

## Text and language modes

Use no more than two type families. Choose strokes substantial enough to carry
paper relief, while keeping counters open. Distinguish supplied supporting text
through size, weight, spacing, or ink. Keep required text within a safe margin of
about 6% of the shortest edge, unless a different layout is explicitly requested.

- **Chinese:** preserve complete character structures and the supplied simplified
  or traditional forms. Use natural horizontal or vertical reading order; never
  slice, merge, or substitute characters.
- **English:** preserve whole words, spelling, case, and deliberate line breaks.
  Use the width of the actual phrase to balance the composition. Do not stretch
  letters or rotate through a vertical stack merely to reuse another language's
  layout.
- **Japanese:** use natural wording when composing new copy and preserve supplied
  kanji, kana, and punctuation exactly. Horizontal or vertical Mincho/Gothic type
  can work. For vertical text, keep glyphs upright in reading order and reserve
  room for every character. If text collides with a motif, move the motif or
  recompose the title; do not omit a character to make it fit.
- **No text:** explicitly require no letters, characters, numbers, logos, seals,
  signatures, or watermarks. Rebalance the primary form, secondary anchor, and
  empty space after removing type. In an edit, restore clean paper where the old
  title was; check for residual strokes, ghost embossing, or replacement symbols.

For requested language-varied batches, cover English, Japanese, and no-text
versions when the requested count permits; include Chinese when requested or
when further variety is useful. Each image has one resolved mode unless the user
asks for bilingual text. Do not impose a language mix on a fixed-language series.

## Controlled variation

Keep fine matte paper, coherent side lighting, readable relief, and the quiet
editorial mood consistent. For a varied batch, change at least two unconstrained
choices: palette, typography, composition, metaphor, or relief placement.

Language changes may require a new layout. A no-text edition needs a complete
visual composition of its own. Preserve any user-fixed brand system, subject,
palette, layout, or exact wording across variants.

## Prompt shape

Resolve these fields into concrete prose for the current image:

```text
Output: one complete front-on artwork; requested ratio and supported size.
Intent: the theme and one specific visual relationship that expresses it.
Text mode: language and exact visible strings, or explicitly no text.
Paper: matte sheet color, fine quiet fibers, continuous material.
Composition: element positions, relative scale, clear gaps, purposeful empty space.
Typography, if present: family, stroke weight, line breaks, ink or blind treatment.
Emboss, if used: named raised faces, lit shoulders, shaded walls, attached shadows.
Deboss, if used: named recessed centers, inner walls, and consistent edge shading.
Lighting: one soft directional side light that reveals relief at whole-poster size.
Exclusions: extra text, coarse grain, flat substitutes for relief, incompatible materials.
```

When editing, name the accepted features to preserve and the specific defect to
repair. Describe geometry rather than merely requesting "more 3D". Treat any
millimeter or pixel cues in reference prompts as illustrative for those images,
not universal physical measurements or settings to copy across resolutions.

## References and revision

Read [REFERENCES.md](./REFERENCES.md) when choosing material, text-mode, or repair
examples. Start with the approved Chinese moon, English, Japanese, and text-free
references. Earlier references remain useful for palette exploration, but their
subtler relief is not the target when stronger depth is requested.

References are optional guidance, not required generation inputs. Keep the user's
subject and wording independent of them. The style also works from text alone.

If repeated image edits amplify grain or halos, return to the cleanest suitable
source or recompile from the brief within the outer flow's reference policy.
Keep the accepted composition and specify fine fibers plus explicit relief
geometry. Do not keep increasing texture, sharpening, or contrast to simulate
depth. Any reference-strength adjustment belongs to the selected provider's
supported controls and must respect the user's preservation requirements.

## Verify the output

When the outer flow returns an image, inspect both the complete poster and close
views of the title, focal form, and representative recessed detail:

- **Relief:** raised faces, side walls, and attached shadows read at whole-poster
  size; recessed details sit below the sheet. A title and moon both pass when
  present. The result remains paper, with no floating or bulky extruded forms.
- **Light and grain:** one light direction explains all edges; fine fibers are
  visible close up without making the broad paper areas noisy.
- **Composition:** one coherent metaphor, deliberate scale and spacing, and
  purposeful negative space. A thumbnail retains a clear focal point.
- **Text:** compare every character against the exact requested strings. Check
  spelling, case, punctuation, kanji/kana, reading order, missing or repeated
  glyphs, clipping, and extra copy. Do not rely on OCR alone.
- **No-text mode:** inspect the former title area and the rest of the sheet for
  lettering, symbols, signatures, or residual embossed strokes.
- **Brief:** verify the requested ratio, text mode, palette, and fixed choices.

For weak relief, correct the affected shoulder, wall, contact shadow, or inner
edge before changing the whole composition. For wrong text, preserve the exact
wording and simplify nearby shapes or allocate more space. Retry only within the
outer flow's budget; if a defect remains, report it instead of silently rewriting
the text or presenting the image as verified.
