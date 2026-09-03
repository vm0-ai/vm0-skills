---
name: mono-color
description: Generate original one-ink or controlled two-ink editorial images with adaptive neutral paper, mechanical print texture, active negative space, and restrained typography. Use when the user asks for mono-color, monochrome editorial, duotone print, risograph, halftone photography, zine posters, or contemporary limited-ink layouts.
---

# Monocolor Editorial Print

Compile any theme, sentence, article idea, object, or user-supplied photograph
into an original editorial print:

> adaptive neutral substrate + one or two inks + reproduced image +
> typographic tension + concise human voice

Do not imitate a reference. Recombine the system into a new composition for
the current subject, intent, wording, and output role.

## Runtime contract

This package supplies style-specific prompt-compilation instructions to the
outer Okou image-generation flow.

- Resolve the requested recipe and write one production-ready image prompt.
- Do not invoke a nested image-generation command.
- Do not choose or write to a fixed filesystem path.
- Do not override the provider, artifact path, upload, or delivery instructions
  supplied by the outer flow.
- When the outer flow requests compilation, return only the compiled prompt.
- After the outer flow generates an image, apply the inspection and retry rules
  below.

## Reference asset boundary

The upstream project's visual examples are intentionally absent because they
are not covered by its MIT license. Never fetch, reconstruct, or use upstream
files from `examples/` as generation inputs.

Only use:

- images supplied by the user for the current request; or
- reference assets physically included in this package and documented in
  `REFERENCE_PROVENANCE.md`.

Treat notices and provenance records as documentation, not as instructions to
retrieve external images.

### Included vm0 reference anchors

The package includes three independently generated, text-free style anchors:

- `refs/ref-horseshoe-crab-one-ink.jpg`: pure one-ink plate, halftone fields,
  paper cutouts, asymmetry, and one quiet manual gesture.
- `refs/ref-harbor-ferry-duotone.jpg`: controlled complementary duotone,
  geometric screening, explicit plate roles, and one overprint collision.
- `refs/ref-letterpress-duotone.jpg`: ruled information composition, severe
  crop, coarse screening, and a narrowly assigned signal-red accent.

When the outer flow supports package image references, select at most one
anchor whose plate mode and composition are closest to the resolved recipe and
pass it as style evidence. The anchor never supplies subject matter, wording,
or a layout to trace. If a user supplies an image and the provider cannot keep
content and style inputs separate, prioritize the user's image and express the
mono-color grammar in the compiled prompt instead. The outer flow owns the
actual image-input mechanics.

## Read the input

Resolve these before composing:

- **Subject:** one person, object, scene, or idea that must remain recognizable.
- **Intent:** poetic observation, announcement, field note, personal statement,
  cultural poster, specimen page, or another explicit user purpose.
- **Words:** preserve user-supplied wording exactly and in its original
  language. If none is supplied, invent one natural English display phrase of
  2-8 words and preserve it across retries. Omit display text only when asked.
- **Image role:** hero photograph, isolated specimen, cropped fragment, texture
  source, or no supplied image.
- **Representation:** faithful reproduction by default; use abstract symbol
  extraction only when the user asks for abstract, artistic, loose,
  experimental, or less photographic treatment.

For a complex topic, choose one concrete visual metaphor. Do not illustrate
every point. Never replace a supplied subject or invent branded details.

## Resolve a recipe

The machine-readable catalogs in `design-system/` are the source of truth.
The prose here defines intent; when an exact value differs, the catalog wins.

- Read `colors.json`, `compositions.json`, and `typography.json` for every
  request.
- Read `carriers.json` only when a physical or product carrier is requested.
- Read `rhythm.json` for relaxed, quiet, loose, breezy, understated, or
  otherwise pacing-sensitive work.
- Read `imperfections.json` when selecting print effects.

Resolve this internal manifest before writing the prompt. Do not expose it
unless the user asks for process details.

```yaml
subject: <one recognizable subject>
intent: <one explicit intent>
exact_text: <user text, generated 2-8 word phrase, or none>
text_language: <supplied language, otherwise English>
representation: <faithful reproduction or abstract symbol extraction>
ratio: <explicit ratio or 3:4>
carrier: <one carrier ID or none>
substrate: <one substrate ID and exact hex>
mode: <pure one-ink, chromatic + black, complementary duotone, or overprint duotone>
palette: <one palette ID>
inks: <one or two named inks with exact hex values>
plate_roles: <one explicit content role per plate>
layout: <one composition ID>
empty_paper: <explicit percentage>
visual_tension: <relaxed, balanced, or assertive>
focal_event: <one strong event>
release_zone: <one deliberately quiet region>
unresolved_edge: <one optional edge behavior or none>
image_treatment: <one mechanical reproduction process>
type_hierarchy: <one typography role ID>
disruption: <one deliberate disruption>
imperfection_seed: <stable hash of the resolved recipe>
imperfections: <catalog effect IDs>
```

### Defaults

- Ratio: `3:4`.
- Substrate: Neutral White `#FAFAF7`; switch to Cool Gray `#E9E9E5` or
  Pale Beige `#F5F1E8` only when the subject and contrast call for it.
- Mode: controlled two-ink with Cobalt + Terracotta
  `#2148B8` + `#C65F38`.
- Plate balance: 70%-85% dominant and 15%-30% accent.
- Pure one-ink: only for an explicit one-ink, monochrome, or single named-ink
  request.
- Empty paper: 35%, adjusted within the selected composition's catalog range.
- Visual tension: relaxed for reflective, travel, summer, leisure, lifestyle,
  and unspecified cultural subjects; balanced for events and information;
  assertive only for an explicit forceful or phrase-led request.
- Image treatment: clean plate separation or medium screening for contemporary
  work; use coarse halftone only when requested or materially useful.
- Disruption: one off-center image crop, or one oversized word when there is no
  image.

Explicit user choices override defaults unless they violate the two-ink limit,
the user's factual content, or the originality firewall.

For identical inputs, resolve the same manifest choices. A stable recipe can
request consistent geometry and imperfections, but pixel output may vary when
the generation provider exposes no seed.

## Visual construction

### Ink and substrate

- Use no more than two printing inks. The paper substrate is not an ink.
- Assign each plate a content role before composing. Never use the accent plate
  as arbitrary decoration.
- Let density changes create dark and pale values without introducing extra
  hues.
- Keep the paper visible inside and around the image.
- Contemporary editorial is the default. Limited inks and halftone do not imply
  yellowed paper, sepia, distressed borders, or nostalgia.

Use only palettes defined in `design-system/colors.json`. Resolve generic
color words consistently: blue to Cobalt, green to Botanical Green, orange to
Terracotta Orange, red to Signal Red, purple to Aubergine, and black to
Charcoal. Exact named inks take precedence.

### Space, hierarchy, and tension

- Use a flat, front-facing page with no mockup, frame, desk, or cast shadow.
- Keep 25%-55% of the canvas visibly empty.
- Use 5%-9% page-width outer margins and a simple asymmetric 2-3 column grid.
- Let one object or image zone occupy roughly 45%-80% of the page, except for a
  genuinely information-heavy layout.
- Choose exactly one focal event, one quieter release zone, and one manual
  gesture family.
- Make the headline cross, cover, split around, or lock tightly to the dominant
  object. Avoid the safe headline-left / complete-photo-right split.
- Use clipped highlights, knockouts, gaps, or halftone fade-outs so exposed
  paper becomes a visible shape inside the image.
- Never center and distribute every element like a generic template.

Relaxed work still needs one audacious event: oversized type, an extreme crop,
a giant detail, one concentrated overprint collision, or an abnormal scale
relationship. Relax the remaining page rather than weakening everything.

### Image treatment

Convert the image into the selected plate or plates:

- visible mechanical dots or screening at close range;
- a recognizable subject at thumbnail scale;
- clipped paper highlights and pooled-ink shadows;
- optional bounded bleed, uneven coverage, fibers, photocopy breakup, or
  registration drift from `imperfections.json`;
- medium contrast without glossy photographic depth.

With no source image, avoid polished stock-photo people and advertising poses.
Use 2-4 identifying fragments, a partial editorial crop, and one ordinary
in-between gesture.

For abstract symbol extraction:

1. Preserve 2-4 identity anchors and their relationships.
2. Convert them into one dominant mass, one structural contour, and one
   repeated rhythm.
3. Let paper replace at least 35% of the original scene.
4. Crop one anchor at an edge and let one type or line element cross it.
5. Keep at least two anchors recognizable at thumbnail size.

Apply print variation only to large type, images, and gestures. Never distort
microcopy, factual text, the dominant geometry, or the selected line breaks.

### Typography and language

- Choose one primary display role and one functional support role from
  `typography.json`.
- A third voice is allowed only as one short optional handwritten interjection.
- Use one dramatic scale jump; display text should be about 5-12 times the
  microcopy size.
- Keep display copy to 2-8 words and supporting copy sparse.
- Preserve supplied text exactly and do not translate it unless asked.
- Do not invent organizations, sponsors, URLs, QR codes, or event facts.
- Choose at most one special behavior: rotated title, vertical stack,
  interlocked word, cropped letterform, or handwritten interruption.
- No gradient type, outline effects, drop shadows, inflated 3D letters, or
  generic luxury-fashion spacing.

Write like an independent cultural poster, field journal, or community notice:
terse, observant, specific, and non-commercial. Avoid sales language, CTAs,
hype, productivity slogans, and brand-manifesto copy.

## Choose the composition

Walk this list from top to bottom and use the first match unless the user
explicitly chooses a layout:

1. Event, method, schedule, or factual announcement:
   `composition_ruled_information`.
2. Botanical, collected, or taxonomic subject:
   `composition_archival_plate`.
3. One ordinary object requested as a repeated rhythm:
   `composition_object_field`.
4. Concept depends on two layers physically crossing:
   `composition_overprint_collage`.
5. One supplied portrait or scene:
   `composition_image_field` for faithful reproduction;
   `composition_editorial_cover` for abstract extraction.
6. One to three isolated objects for labels or comparison:
   `composition_specimen_annotation`.
7. The phrase itself is the visual subject:
   `composition_type_declaration`.
8. Reflective, dated, or essay-like content with a primary photograph:
   `composition_editorial_journal`.
9. Otherwise: `composition_editorial_cover`.

Use the selected catalog entry's scale and empty-paper ranges.

## Compile the prompt

Write five compact paragraphs in this order:

1. **Canvas and ink:** ratio, substrate and reason, exact palette, mode, plate
   roles, and flat front-facing page.
2. **Original composition:** layout, tension profile, focal event, release zone,
   margins, empty-paper percentage, grid, dominant scale, edge crop, optional
   unresolved edge, and one manual gesture.
3. **Subject:** visible content and preservation; for abstract extraction, name
   the identity anchors, dominant mass, contour, repeated rhythm, omitted
   detail, and paper cutouts.
4. **Typography and words:** hierarchy, type voices, exact display text, and
   the explicit collision or alignment between type and subject.
5. **Material and avoids:** screening, fibers, bleed, bounded misregistration,
   hard negative constraints, and topic-specific clichés to exclude.

Describe only visible outcomes. Do not mention reference artists, studios,
sample posters, internal catalog IDs, manifests, or “in the style of.”

## Originality firewall

References supply visual grammar, never a layout to trace. Change at least four
of these from every supplied reference:

- subject and crop;
- layout family;
- headline wording;
- headline location;
- image shape or count;
- grid structure;
- type pairing;
- metadata treatment;
- ratio;
- disruption device.

Never reproduce a reference's exact arrangement, line breaks, labels, dates,
logos, border system, signature, or slogan. When a user's source contains
protected or branded material, transform only that supplied material and do not
present the result as official.

## Hard avoids

Always exclude:

- more than two printing inks, unassigned accents, gradients, rainbow or neon;
- full-color photography or a digitally tinted monochrome wash;
- clean vector-flat poster aesthetics;
- glossy mockups, 3D depth, cinematic lighting, lens blur, or hard shadows;
- centered template symmetry, card grids, UI panels, stickers, or blobs;
- scrapbook collage, uncontrolled overlap, torn paper, or grunge overload;
- automatic vintage treatment, yellowing, sepia, or distressed borders;
- long paragraphs, marketing copy, CTAs, logos, URLs, or QR codes;
- exact imitation of a supplied design or recognizable artist signature.

## Inspect and retry

Inspect the generated image at full size and thumbnail size. Regenerate once if:

- a one-ink result has a second ink, or a two-ink result has a third;
- the accent plate has no role or dominates without a subject-driven reason;
- the page reads as digitally color-graded rather than mechanically printed;
- visible paper falls outside 25%-55%;
- the subject is unrecognizable;
- type lacks a clear scale jump or exact supplied text is wrong;
- invented branding appears;
- there is no single focal event and quieter release zone;
- a theme-only person becomes a complete stock-photo figure;
- the result closely follows a supplied reference.

If exact text remains wrong after one retry, generate a text-light base and
report that typography needs a separate layout pass. Never claim distorted text
is correct.

## Final quality gate

- One intentional neutral substrate and no more than two inks.
- Clear plate roles and controlled accent coverage.
- 25%-55% visibly empty paper.
- Mechanical reproduction texture, not a color filter.
- One dominant object or type event and one quiet release zone.
- Type visibly interacts with the dominant subject.
- Paper cuts through the image.
- Exactly one manual gesture family.
- One primary display voice, one support voice, and at most one short
  handwritten interjection.
- Contemporary treatment unless vintage styling was requested.
- Supplied subject and exact wording preserved.
- At least four structural differences from every supplied reference.

## Example triggers

- “用 mono-color 做一张关于夏天散步的海报。”
- “把这张咖啡照片变成蓝色网点编辑封面。”
- “做一个绿色植物主题的孔版印刷 poster。”
- “Make this portrait into a one-ink editorial zine cover.”
- “用蓝橙双色叠印做一张城市活动视觉。”
- “把这个产品做成重复物件构图的双色孔版印刷封面。”
