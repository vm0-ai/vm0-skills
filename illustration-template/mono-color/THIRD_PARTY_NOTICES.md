# Third-Party Notices

## mono-color-skill

This directory contains a modified subset of
[`yanliudesign/mono-color-skill`](https://github.com/yanliudesign/mono-color-skill).

- Upstream version: `1.2.0`
- Upstream revision: `c8ff70597ddedcd65f21a0b528f6a70c35690b0a`
- Upstream copyright: Copyright (c) 2026 Yan Liu
- Upstream license: MIT; the complete, unmodified text is included in
  [`LICENSE`](./LICENSE).

### Imported upstream components

- `SKILL.md`, modified as described below
- `design-system/carriers.json`
- `design-system/colors.json`
- `design-system/compositions.json`
- `design-system/imperfections.json`
- `design-system/rhythm.json`
- `design-system/typography.json`
- `UPSTREAM-ASSET-LICENSE.md`, preserved from upstream `ASSET-LICENSE.md`

### vm0 modifications

- Adapted the instructions to Okou's outer prompt-compilation, generation, and
  artifact-delivery contract.
- Removed the upstream hard-coded Claude Desktop output path.
- Removed dependencies on visual assets that are unavailable for commercial
  redistribution.
- Condensed duplicated catalog prose while retaining the machine-readable
  design system as the exact source of truth.
- Clarified that recipe resolution can be stable while generated pixels may
  vary when a provider exposes no seed.
- Added an explicit reference-asset boundary, package verification, and
  independently generated reference provenance.
- Added `REFERENCES.md` as a local exclusion notice so the relative citation in
  the preserved upstream asset-license text does not point to an absent file.

### Excluded upstream assets

No file from the upstream `examples/` directory is included. That directory
contains both upstream-generated artwork reserved by Yan Liu and third-party
visual references whose copyright remains with their respective rights
holders. Those files must not be copied into this package, supplied as
commercial generation inputs, uploaded to vm0 storage, or used as product
previews without the required rights-holder permission.

Reference images included beside this notice are independently generated for
vm0 without upstream visual inputs. Their provenance is recorded in
[`REFERENCE_PROVENANCE.md`](./REFERENCE_PROVENANCE.md).

The upstream project and its author do not endorse vm0 merely because the MIT
licensed software and documentation are used here.
