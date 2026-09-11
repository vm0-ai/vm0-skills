---
name: presenter-authority-broadcast
description: "Own the fast end-to-end HyperFrames workflow for Authority Broadcast presenter videos. Use when the user selects Authority Broadcast or needs institutional public information with sober navy fields, deadline emphasis, and accountable fact hierarchy."
---

# Authority Broadcast

## Workflow ownership and context budget

This owns the workflow after HyperFrames. Do not route through `general-video`. Skip `DESIGN.md`, `frame.md`, storyboards, frame packets, and animation maps. Keep the brief and sources. Edit up to twelve starter-based scenes inline.

## Fast production workflow

### 1. Lock beats and media mode

Record one semantic or narration beat per scene:

`scene-id | Router layout id | presenter: off|static|talking-avatar | viewer outcome`

Fix silent/static scene timing now. For voice or a talking avatar, open [VOICE-AVATAR.md](references/VOICE-AVATAR.md) and generate media alongside draft assembly. Real media duration wins.

### 2. Select from the executable layout library

Read only [ROUTER.md](references/ROUTER.md) with this file; it maps all 40 layouts to capacity, official items, motion, and presenter guidance.

- Choose the smallest sufficient row.
- If names are insufficient, inspect the [gallery](assets/layouts/index.html) or [contact sheet](assets/layouts/contact-sheet.jpg); every proof links to its executable HTML starter.
- Do not preload `template.json`, catalogs, media generation, or generic video Skills.

### 3. Resolve presenter and language once

- Presenter `off`: no presenter DOM or reserved bay.
- Presenter `static`: use bundled `p1.png` or `p2.png` under bootstrap `--presenter on`.
- Presenter `talking-avatar`: generated video, never a static PNG; follow the linked fast path.
- For `zh`, `ja`, or `ko`, pass one licensed local `--content-font`.
- Resolve one project palette: `authority-broadcast`, `monumental-minimal`, `black-gold`, `obsidian-champagne`, `petrol-brass`, `parchment-oxblood`, `porcelain-carbon`, or `custom`. Everything lives in this package; palette names never route elsewhere. Inspect the Gallery when color intent is unspecified; define custom palettes once through [STYLE.md](references/STYLE.md), never per layout.

### 4. Bootstrap once

For a new or untouched blank project, run one command from any directory:

```bash
node <SKILL_DIR>/scripts/bootstrap-project.mjs \
  --project <PROJECT_DIR> \
  --host-id <id> \
  --presenter <off|on> \
  --media-mode none \
  --color-system authority-broadcast \
  --presenter-scenes <optional-id,id> \
  --language <tag> \
  --content-font <required-for-first-zh-ja-ko-build> \
  --scenes cover:8,evidence:10,close:7 \
  --layout-map cover=orientation/authority-cover,evidence=data/kpi-grid,close=orientation/public-action-close
```

Bootstrap initializes HyperFrames, stages starters, installs deduplicated official items, isolates blocks, and creates host/scene/motion contracts. It records `COLOR-SYSTEM.json` and propagates the palette to every scene; it never chooses layouts, writes content, or renders.

For a supplied collection, use `--color-system custom --color-tokens <CSS_FILE>`; geometry stays unchanged.

To recolor an authored project, run `node <SKILL_DIR>/scripts/set-color-system.mjs --project . --color-system <name>`; content and scenes stay intact.

For an existing authored project, do not bootstrap over it. Use [AUTHORING.md](references/AUTHORING.md) for the narrow staging or migration command.

### 5. Replace scene-local content slots; preserve the layout

Each generated scene contains its Authority stage. Bootstrap fuses components and isolates every block source.

- `C` uses a content-complete official component; `M` uses an Authority adapter combining official behaviors. Replace only `default` values inside `AUTHORITY_CONTENT_SLOT`.
- `B` scenes: replace only visible literals or data inside the marked slot under `compositions/official/`.
- Never submit Registry demos or placeholders. Components lacking required content fields stay behind an `M` adapter.
- Never alter the shared installed Registry source or the frame's official mount.
- Do not reconstruct a preview PNG with ordinary DOM.
- Keep source, host mount, timeline key, and motion sidecar IDs and durations identical.
- Defaults demonstrate 70–85% capacity. Replace every sample; use a smaller layout for sparse content or split overflow.

After bootstrap, insert verified facts, values, units, dates, uncertainty, disclosures, and citations into the bounded slots.

### 6. Use native semantic motion

Keep background, presenter, and recurring structure settled. Preserve semantic behavior: text hierarchy, data-based charts, exact values, causal processes, shared-basis comparisons, and intact geography. Open [MOTION.md](references/MOTION.md) only when required.

### 7. Run deterministic review

After editing the first representative scene, run Preflight once before repeating the same content treatment:

```bash
node <SKILL_DIR>/scripts/review-project.mjs --project . --phase preflight
```

Preflight combines the Authority contract/font checks with HyperFrames lint, so asset paths, invalid IDs, unsupported scripts, and structural failures stop before browser sampling.

After all static content is complete:

```bash
node <SKILL_DIR>/scripts/review-project.mjs --project . --phase static
node <SKILL_DIR>/scripts/review-project.mjs --project . --phase preview
npx hyperframes@<pinned> preview --background
```

Preview performs the one full check with contrast. A later Preview call automatically checks only changed scenes when shared files are unchanged, or reuses the previous result when nothing changed. Give the user the Studio URL and keep Preview alive.

After approval:

```bash
node <SKILL_DIR>/scripts/review-project.mjs --project . --phase release
npx hyperframes@<pinned> render --quality high --output renders/authority-broadcast.mp4
test -s renders/authority-broadcast.mp4
ffprobe -v error -show_format renders/authority-broadcast.mp4
```

Release reuses current successful Preview coverage. Never render before approval.

Use the version the project pins in its `package.json` scripts for every `hyperframes` call, the same one `review-project.mjs` resolves; a bare `npx hyperframes` floats to the latest release mid-project.

## Content and presenter invariants

- Content completeness, readable scale, and centering inside the real available region outrank presenter presence and decorative chrome.
- Omit layout names, counters, source rails, and upper-left title blocks unless the source requires them.
- A full presenter stays at the template standard size. It may switch sides but must not be shrunk to force coexistence.
- If it does not fit, use the grounded bottom-corner `head-shoulders` treatment with the supplied soft transparent circular fade, move the person to a presenter-led divider, or omit it from that scene.
- Never float or hard-crop a person. At rest and motion peaks, keep face, hands, text, axes, legends, connectors, citations, and media disjoint.
- Full-canvas Registry blocks remain presenter-free.

## Open an exception guide only when needed

- [AUTHORING.md](references/AUTHORING.md): existing projects, staging, migration, or capacity exceptions.
- [PRESENTER-ADAPTATION.md](references/PRESENTER-ADAPTATION.md): ambiguous presenter recurrence or fit.
- [MOTION.md](references/MOTION.md): native motion is inadequate or fails inspection.
- [LAYOUT-CATALOG.md](references/LAYOUT-CATALOG.md), [HYPERFRAMES-LAYOUT-MAP.md](references/HYPERFRAMES-LAYOUT-MAP.md), and [MOTION-CATALOG.md](references/MOTION-CATALOG.md): inspect only the selected entry on an exception.
- [STYLE.md](references/STYLE.md): invent beyond supplied evidence or correct identity drift.

English files are the operational source.
