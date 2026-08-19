---
name: presentation-template-import
description: Extract the reusable visual language of an uploaded PPTX so it can become a vm0 presentation template.
---

# Presentation Template Import

vm0 lets a user hand over one of their own decks and get a reusable template
back. When that happens, the API opens a chat thread and sends a single message:

> Import presentation template `<templateId>`. Follow the
> presentation-template-import skill exactly.

Everything below is that instruction.

The deck is evidence, not a thing to reproduce. The user wants their **visual
language** — colours, type, spacing, decoration, layout habits, brand marks —
not their content. A finished import must be usable for a completely different
subject.

## What the API has already established

The pages were rendered by the user's own browser from the deck they uploaded,
and the API verified that the deck is a readable OOXML presentation whose slide
count matches the number of page images. So:

- The archive opens. Do not re-validate it.
- The page images are the authoritative appearance. Never render, convert,
  replace, reorder, or upload page images, and do not produce intermediate
  visual files.
- There are no storage credentials, bucket names, or object keys in this run.
  The commands below are the only source and page I/O available.

## Pipeline

```bash
WORK_DIR="$(mktemp -d)"
mkdir -p "$WORK_DIR/pages" "$WORK_DIR/ooxml"

okou presentation-template source pull --id <templateId> --out "$WORK_DIR/source.pptx"
okou presentation-template pages pull  --id <templateId> --dir "$WORK_DIR/pages"
```

`pages pull` is atomic: nothing lands in the directory unless every page
downloads, so a directory that exists is a complete set in page order.

Extract a read-only copy of the archive into `$WORK_DIR/ooxml` and work from
both sources at once. One bounded pass, normally under five minutes. Do not run
similarity, proof, or rebuild loops — you are not trying to recreate the deck.

If the deck cannot yield a template, stop and say so:

```bash
okou presentation-template fail --id <templateId> --message "<what made it impossible>"
```

## The two kinds of evidence

**OOXML is exact structural evidence.** Read theme declarations, slide master
and layout inheritance, slide size, font declarations, media relationships, and
the original reusable resources. Prefer these values over anything estimated
from pixels — a hex colour read from the theme is right; the same colour
eyeballed from a screenshot is not.

**The rendered pages are final appearance evidence** for the fixed 16:9 vm0
surface. Use them to judge whitespace, density, decoration, the relationship
between images and text, and background effects. They tell you what the deck
*looks like*; they do not replace what the OOXML says it *is*.

## What to extract

Reusable brand marks, logos, icons, colour roles, typography evidence, clean
backgrounds, layout tendencies. Preserve usable original bytes for identity,
media, vector, and font assets.

## What to leave behind

Everything specific to this deck's subject: titles, people, numbers,
conclusions, claims, one-off semantic imagery, one-off decorations. A colour is
reusable; "Q3 revenue up 14%" is not. An icon set is reusable; a photo of the
founder is not.

## Two honesty rules

When text or semantic imagery cannot be cleanly separated from flattened
pixels, say so. Do not hand back a background that still has someone's headline
baked into it and call it clean.

Layout observations are prose about tendencies — "wide left margin, headline
sits low, two-column body is common". They are not layout ids, a schema, a
required page sequence, or fixed renderer input.
