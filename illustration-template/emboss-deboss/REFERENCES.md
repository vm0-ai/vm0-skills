# Reference guide

These examples were generated with Okou's built-in `gpt-image-1`, high quality,
1024 x 1536, on 2026-09-06. Start with the four approved references below for
visible relief and text-mode handling. They were edited from our own generated
posters; no visual inputs from the source post were used. Exact prompts, source
artifact IDs and URLs, output artifact IDs, and hashes are recorded in
[provenance.json](./provenance.json).

## Primary references

| Reference | What to study | Verified result |
| --- | --- | --- |
| [Moon mooring](./refs/ref-moon-mooring-indigo.jpg) · [prompt](./prompts/ref-moon-mooring-indigo.txt) | Chinese title and a moon on indigo paper; separate raised focal forms and quiet recessed water marks | Exact title 月泊; visible letter side walls, moon shoulder, and attached shadows in the complete poster |
| [Beyond](./refs/ref-beyond-ivory.jpg) · [prompt](./prompts/ref-beyond-ivory.txt) | Ivory blind-embossed English title balances a small sun and a winding mountain valley | Complete word BEYOND; readable paper-colored letter profiles and quiet fine grain |
| [Wind space](./refs/ref-wind-space-blush.jpg) · [prompt](./prompts/ref-wind-space-blush.txt) | Vertical Japanese title separated from a raised ginkgo leaf; recessed wind path | All four characters 風の余白 are present, upright, in the correct top-to-bottom order |
| [Moon and boat, no text](./refs/ref-moon-boat-no-text.jpg) · [prompt](./prompts/ref-moon-boat-no-text.txt) | A raised ochre moon and tiny boat relate across quiet indigo paper without a title | No visible writing or title remnants; raised moon rim and attached shadow. The boat stayed farther right than requested, while the minimal composition remained coherent |

Use Moon mooring primarily for title and moon geometry; its grain is stronger
than in the other three selected images, which are better targets for quiet paper.

These are visual targets, not guarantees of exact geometry or reproducibility.
The source prompts record the actual generation instructions, including local
pixel or millimeter cues; those numbers are illustrative for those images, not
universal settings. Keep the user's subject and exact copy independent of them.

## Observed revision lessons

- The first poetic posters had pleasing compositions, but the title and moon
  were too flat. Naming the raised face, shoulder, shaded wall, and attached
  contact shadow produced visibly stronger relief.
- Successive edits of already edited images amplified coarse grain. Returning
  to the cleaner original posters, specifying quiet fibers, and using the
  provider's lower input-fidelity setting produced the selected English,
  Japanese, and no-text versions. This is an available repair approach, not a
  requirement to use low input fidelity for every edit or provider.
- An earlier horizontal Japanese version omitted 白 when the title competed
  with the leaf. A vertical column with space for all four glyphs corrected it.
  Check every character; vertical layout is one remedy, not a Japanese-only rule.
- The no-text edition removed the title cleanly, but did not follow every
  requested position exactly. Inspect the actual composition rather than
  claiming prompt compliance from the generation result alone.

## Earlier palette references

These three text-only generations remain useful for palette and composition
exploration. Their subtler relief should not set the target for a request for
stronger depth.

| Reference | Material and layout | Observed result |
| --- | --- | --- |
| [Make room](./refs/ref-make-room-ivory.jpg) · [prompt](./prompts/ref-make-room-ivory.txt) | Ivory paper, forest ink, upper-left serif title, open pressed circle | Exact English headline; quiet space; fine fibers and subtle edge relief |
| [Slow mornings](./refs/ref-slow-mornings-cobalt.jpg) · [prompt](./prompts/ref-slow-mornings-cobalt.txt) | Cobalt paper, warm-white title below, blind cup motif above | Exact English headline; the model used serif rather than the requested sans |
| [Growth](./refs/ref-growth-sage.jpg) · [prompt](./prompts/ref-growth-sage.txt) | Sage paper, vertical Chinese title at upper right, rising botanical stem | Both Chinese characters are correct; a third leaf was added |

References are optional guidance and need not be supplied as generation inputs.
The user's reference choices and the outer generation flow take precedence.

## Provenance of the design direction

The user supplied [Adrian Punk's public post about emboss and deboss
posters](https://x.com/AdrianPunk115/status/2095082810172473824). Its general
print-design approach informed this independently written prompt resource:
paper texture, relief, directional lighting, economical typography, and
visual metaphors. The source post's images were inspected during research;
they are not included in this package or used as image-generation inputs.
The author's prompt text is not reproduced in the package.
