# Reference Asset Provenance

The three reference images in `refs/` were generated for vm0 on 2026-09-03.
They were not copied from, traced from, or conditioned on any file in the
upstream `examples/` directory. No user image, third-party image, artist name,
studio name, or upstream visual reference was supplied at any generation step.

The base images were created through Okou's built-in image pipeline with the
server-default `gpt-image-1` model, medium quality, and a `1024x1536` output
size. The selected bases were then edited through the same built-in pipeline
with `gpt-image-1`, medium quality, high input fidelity, and only their own
newly generated base image as input. Rejected generation candidates are not
included in this package.

## `refs/ref-horseshoe-crab-one-ink.jpg`

- Final SHA-256:
  `c95ff6969b89e4418927b69eaf40b1ae0e778a4ea7d2128974ea5b599e153732`
- Final artifact ID: `r7ip0ecbn4`
- Final artifact:
  `https://cdn.vm0.io/artifacts/r7ip0ecbn4.jpg`
- Base artifact ID: `e9r83zcafp`
- Base artifact supplied to the edit:
  `https://cdn.vm0.io/cdn-cgi/image/fit=scale-down,format=auto,quality=85,metadata=none/artifacts/e9r83zcafp.jpg`
- Base SHA-256:
  `8e2b0844d294f254dc18f91f504f7187f941160ad760e59d0a8f8e627269672f`

Base prompt:

```text
GRAPHIC ONE-COLOR SCREEN PRINT, NOT A PHOTOGRAPH. A clean modern vertical editorial illustration on a pure warm-white rectangular page with no surrounding scene. Depict one simplified horseshoe crab from directly above as bold geometric shapes, large and cropped slightly at the lower edge. Every printed shape is botanical green; the only other visible color is the warm-white paper. Build the shell with crisp mechanical halftone-dot fields, dense flat green shapes, clipped highlights, and white negative-space cutouts. Use an asymmetric contemporary composition with generous margins, a calm open-paper zone in the upper right, and one thin empty green circle with a short leader line. No realism, photographic texture, three-dimensional depth, cast shadow, notebook, book binding, deckled edge, torn paper, stains, yellowing, beige, brown, gray, black, or any extra color. No typography or characters anywhere: no words, letters, numbers, symbols, codes, labels, logos, signatures, or watermark.
```

Edit prompt:

```text
Edit the supplied image while preserving the horseshoe-crab shape, green halftone treatment, asymmetrical placement, white negative space, and green circle. Remove the photographed notebook presentation completely: replace the entire background and every edge with one seamless clean warm-white uncoated-paper field that fills the canvas. Remove all black borders, binding, torn or deckled edges, stains, yellowing, beige and brown marks. The finished image must look like a flat contemporary one-color screen print, not a photographed object. Every non-white pixel must read as botanical green; no black, gray, beige, brown, shadow, text, letters, numbers, symbols, logo, signature, or watermark.
```

Human review: one green ink plus paper, one recognizable subject, visible
halftone fields, exposed-paper cutouts, a single gesture, active upper release
zone, no text, and no mockup surround.

## `refs/ref-harbor-ferry-duotone.jpg`

- Final SHA-256:
  `de39ce18c8af087092658414d59c2e379b7f94d3cb08ae0f21466c8805bcc74a`
- Final artifact ID: `g1di7axs4x`
- Final artifact:
  `https://cdn.vm0.io/artifacts/g1di7axs4x.jpg`
- Base artifact ID: `mqbdvn79hu`
- Base artifact supplied to the edit:
  `https://cdn.vm0.io/cdn-cgi/image/fit=scale-down,format=auto,quality=85,metadata=none/artifacts/mqbdvn79hu.jpg`
- Base SHA-256:
  `bc233a89c6020b0d9c846f808396342446785b0c44de7ae0615e3004b5c38cb3`

Base prompt:

```text
GRAPHIC TWO-COLOR RISOGRAPH COLLAGE, NOT A PHOTOGRAPH. A clean modern vertical editorial illustration on a pure warm-white rectangular page with no surrounding scene. Depict exactly one simplified small passenger ferry in a bold side profile, large and unmistakable, moving right through geometric wave shapes with its bow cropped at the right edge. Construct the ferry and waves only from cobalt-blue flat shapes, cobalt halftone-dot fields, warm-white paper knockouts, and one terracotta-orange diagonal wake ribbon that overprints the hull. Slight plate misregistration is visible along selected edges. Keep a broad calm open-paper zone in the upper left. No second vessel, background ship, duplicate fragment, realistic ocean photo, people, tiny markings, three-dimensional lighting, cast shadow, vintage paper, torn edge, or any color beyond cobalt, terracotta, and warm white. No typography or characters anywhere: no words, letters, numbers, symbols, codes, labels, flags, logos, signatures, or watermark.
```

Edit prompt:

```text
Edit the supplied image while preserving the single ferry, cobalt geometric wave shapes, cobalt halftone fields, terracotta diagonal wake ribbon, asymmetric placement, and large empty upper-left area. Remove the vintage or torn-paper presentation completely: replace the entire background and every edge with one seamless clean warm-white uncoated-paper field that fills the canvas. Remove all tears, deckled edges, stains, yellowing, beige marks and stray edge artifacts. The finished image must look like a flat contemporary two-color risograph collage, not a photographed object. Use only cobalt blue, terracotta orange and warm-white paper. Keep exactly one ferry and add nothing. No text, letters, numbers, symbols, codes, labels, flags, logo, signature, or watermark.
```

Human review: two inks plus paper, one recognizable ferry, mechanical screen
texture, clear plate roles, a single overprint collision, active upper release
zone, no text, and no mockup surround.

## `refs/ref-letterpress-duotone.jpg`

- Final SHA-256:
  `0995e4c9558ed5f60fc75ef6d4373bc8e32c4a6391f017633412b216fc3cf87b`
- Final artifact ID: `3i3i8o6324`
- Final artifact:
  `https://cdn.vm0.io/artifacts/3i3i8o6324.jpg`
- Base artifact ID: `tqoik5t06f`
- Base artifact supplied to the edit:
  `https://cdn.vm0.io/cdn-cgi/image/fit=scale-down,format=auto,quality=85,metadata=none/artifacts/tqoik5t06f.jpg`
- Base SHA-256:
  `75b53a617ab93ec87a731401bf461ab5cf536ee13f6afb02b5b459be38811467`

Base prompt:

```text
A flat front-facing vertical contemporary editorial print on cool-gray uncoated paper. Show one industrial letterpress cylinder and its large handwheel in a severe close crop, filling the upper right and center while leaving a calm open-paper zone in the lower left. Render the machine through visibly coarse charcoal halftone dots and newspaper screening, with exposed-paper highlights rather than smooth grayscale photography. Use two printing inks only: charcoal for the machine and thin grid rules, signal red only for one large partially overprinted circle behind the handwheel. Keep an asymmetric ruled composition, crisp geometry, controlled print grain, and a small amount of red-to-charcoal registration drift. The artwork must contain no typography and no characters of any kind: no words, letters, numbers, symbols, codes, labels, legends, measurement marks, logos, signatures, or watermark. No other hue, gradients, neon, full-color imagery, cinematic depth, hard shadows, sepia, yellowed paper, torn paper, doodle clutter, or card layout.
```

Edit prompt:

```text
Edit the supplied image while preserving the letterpress machine crop, large handwheel, charcoal-and-signal-red palette, red circle, thin grid rules, asymmetry, and open lower-left area. Convert the smooth photographic machine surfaces into visibly coarse charcoal newspaper halftone dots and flat screened ink, with warm-gray paper showing through the highlights. Replace the torn patch and every damaged paper area with one seamless clean cool-gray uncoated-paper field; remove stains and ripped edges. Keep this a flat contemporary two-ink editorial print, not a photographed poster. Use only charcoal, signal red, and cool-gray paper. No text, letters, numbers, symbols, codes, labels, logo, signature, or watermark.
```

Human review: two inks plus paper, one recognizable close-cropped machine,
coarse screening, exposed substrate, one accent event, active lower release
zone, no text, and no mockup surround.
