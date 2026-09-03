---
name: ppt-avatar-video
description: Convert a PPT, PPTX, or PDF directly into a presenter video by preserving each page as a static full-frame slide and overlaying one transparent talking avatar. Use for fast deck-to-video requests without bespoke motion design; do not use for cinematic intros, slide redesign, or tutorial screen recordings.
---

# PPT Avatar Video

Produce the final video quickly. This is a conversion workflow, not a motion-design workflow.

## Scope boundary

- Preserve every source page as a static full-frame image in the original order.
- Place one transparent talking avatar above the slides for the whole program.
- Use hard cuts between pages by default. Add only a short dissolve when the user explicitly requests it.
- Do not select a design preset, construct an arc, search the HyperFrames catalog, choose blueprints or rules, redesign slides, or author per-slide animation.
- Do not invoke a general intro-video or motion-graphics workflow unless the user explicitly asks for custom motion.
- Default to direct final delivery. Pause for preview approval only when the user asks to review first.

## Preserve the requested configuration

Use supplied source, aspect ratio, avatar ID, voice ID, presenter anchor, and presenter scale exactly. Do not list or search avatars or voices when IDs are already supplied. Map 16:9 to `landscape`, 9:16 to `portrait`, and 1:1 to `square` for avatar generation. Transparent JoggAI output requires `--screen-style 3 --no-caption`.

If the user does not specify placement, use bottom-right. If scale is absent, use a visible presenter width of 14% of the frame. Scale refers to the non-transparent avatar bounds, not the full video canvas. Align the visible avatar's bottom edge with the frame bottom on every page.

If an exact supplied avatar or voice is rejected, report that blocker. Never silently substitute another identity or voice.

## Fast path

### 1. Rasterize the deck once

For a web-chat upload, download it with `okou web download-file`. Render ordered pages with:

```bash
okou presentation screenshot --input SOURCE --out PROJECT/assets/slides --width WIDTH --height HEIGHT --json
```

Use the requested final frame size, normally 1920x1080. Do not separately convert PPT to PPTX unless text or speaker-note extraction genuinely requires it. Never recreate or restyle a source page.

### 2. Write one narration unit per page

Prefer, in order: user script, speaker notes, visible slide text, then a concise literal description of the page. Keep one sentence or short paragraph per page and preserve page order. Do not invent a marketing story arc merely because the deck is sparse.

Join the page units into one script and retain the page-to-unit mapping. As soon as the script is stable, start one talking-avatar generation job. Do not generate standalone TTS: the avatar-video result already contains the requested voice audio.

Before generation, run the current type help once, then use the supplied IDs directly. Put long or quote-sensitive narration in a file and pipe it through standard input:

```bash
okou generate avatar-video --provider built-in \
  --avatar-id AVATAR_ID \
  --voice-id VOICE_ID \
  --aspect-ratio AVATAR_RATIO \
  --screen-style 3 \
  --no-caption \
  --video-name VIDEO_NAME \
  --json < PROJECT/narration.txt
```

While that provider job runs, stage the slide assets and prepare the composition manifest. Run these independent branches concurrently when the execution surface permits it.

### 3. Recover page timings

Download the returned transparent WebM as `assets/presenter.webm` and probe its exact duration. Transcribe it once with `okou video transcribe --file PROJECT/assets/presenter.webm` and align each narration unit to its page. Put a cut at the start of the next unit, or at the midpoint of a real silence gap between units. The first page starts at zero and the final page extends through the exact media duration.

If transcription is unavailable, distribute the measured duration in proportion to spoken word counts, then assign rounding residue to the last page. Do not use the provider's rounded duration when `ffprobe` is available.

### 4. Measure alpha bounds without re-encoding

Resolve this skill's mounted directory from the path shown in the available-skills list, then run:

```bash
node SKILL_DIR/scripts/probe-alpha-bbox.mjs PROJECT/assets/presenter.webm
```

Copy its `sourceWidth`, `sourceHeight`, and `bbox` values into the manifest. The composition builder uses CSS clipping and positioning so the visible cutout has the requested width and bottom alignment. Do not crop or transcode the VP9 WebM locally.

Stage only the final presenter WebM and slide images. Do not keep an uncropped duplicate or an unused still inside the cloud-render project.

### 5. Build the static composition

Create `composition-input.json` in the project using this schema:

```json
{
  "id": "deck-video",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "background": "#000000",
  "hyperframesVersion": "0.8.26",
  "slides": [
    { "path": "assets/slides/page-001.png", "duration": 4.2 },
    { "path": "assets/slides/page-002.png", "duration": 5.1 }
  ],
  "presenter": {
    "path": "assets/presenter.webm",
    "sourceWidth": 1920,
    "sourceHeight": 1080,
    "bbox": { "x": 618, "y": 184, "width": 596, "height": 874 },
    "visibleWidthFraction": 0.14,
    "anchor": "bottom-right"
  }
}
```

Use the project-pinned HyperFrames version rather than updating during a job. Then run:

```bash
node SKILL_DIR/scripts/build-project.mjs --manifest PROJECT/composition-input.json --out PROJECT
```

The builder creates one `data-no-timeline` root composition with static image clips, one persistent transparent video clip, and one audio clip. That marker is the HyperFrames contract for an intentionally static composition; do not add a fake GSAP tween merely to make geometry change. Do not replace the composition with individually authored slide HTML files.

### 6. Run one pre-render gate

After inputs and timing are final, run one `lint`, one strict `check`, and a small snapshot set covering the first, middle, and last pages. Fix failures and rerun only the affected fast check; run the full strict check once more only if composition structure or timing changed.

```bash
npx --yes hyperframes@0.8.26 lint PROJECT --json
npx --yes hyperframes@0.8.26 check PROJECT --strict --samples 5 --json
npx --yes hyperframes@0.8.26 snapshot PROJECT --at FIRST,MIDDLE,LAST --no-end --describe false
```

Do not run text-layout or contrast audits against bitmap slide contents. Those pixels belong to the source presentation and contain no authored DOM text. Verify instead:

- page count and order;
- no stretching or unintended cropping;
- transparent avatar decoding;
- requested visible width and anchor;
- captions absent;
- final slide timing equals presenter duration.

### 7. Render in the cloud once

Cloud is the default final renderer. If `HYPERFRAMES_API_KEY` and `HEYGEN_API_KEY` are absent but `HEYGEN_TOKEN` is present, pass it to the command as `HEYGEN_API_KEY="$HEYGEN_TOKEN"` without printing the token.

Run a dry-run size check, then one idempotent render using the same key for any safe retry:

```bash
npx --yes hyperframes@0.8.26 cloud render PROJECT --dry-run --json

HEYGEN_API_KEY="$HEYGEN_TOKEN" npx --yes hyperframes@0.8.26 cloud render PROJECT \
  --fps FPS --quality high --format mp4 --resolution 1080p \
  --aspect-ratio ASPECT --wait --output PROJECT/renders/final.mp4 \
  --idempotency-key IDEMPOTENCY_KEY --json
```

Use local final rendering only when the user explicitly requests it or cloud access is unavailable. Do not render a full local copy merely as a cloud comparison.

### 8. Final verification and delivery

Run `ffprobe`, a full `ffmpeg` decode, and final ASR comparison concurrently where possible. Confirm resolution, fps, frame count, video duration, audio duration, page order, narration completeness, and presenter placement. For web chat, deliver the verified file with `okou web upload-file -f PROJECT/renders/final.mp4`.

Report a compact timing table with: deck download, page rasterization, narration preparation, avatar generation, alpha-bound probe, composition build, pre-render QA, cloud package/upload, queue/render, download, final QA, and delivery. Distinguish provider time from agent/tool overhead.

## Retry and cost rules

- Use an idempotency key for every cloud render.
- Retry one transient provider or cloud failure at most once. Do not submit a second billed generation when the first job may still be running.
- A request to create the final video authorizes the normal avatar-generation and cloud-render charges. Any materially different regeneration needs fresh user direction.
