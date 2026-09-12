# Voice and Talking-Avatar Fast Path

Open this guide only when the video uses generated voiceover or a real talking digital human. A talking avatar is generated video with a performed voice and an intrinsic duration; it is not the bundled static presenter PNG.

## Lock the shared contract first

Before starting external generation, lock one narration beat per scene:

`scene-id | narration text | Router layout id | media: voice|talking-avatar|silent | presenter position | viewer outcome`

The narration text, scene IDs, selected layouts, language, one HeyGen `voice_id`, and talking-avatar scenes are shared prerequisites. Resolve the voice once and reuse it across voice-only and talking-avatar scenes. Do not guess final seconds. Do not change the script after dispatch unless the media job is intentionally restarted.

## Run two lanes concurrently

### Media lane

- Voice-only from script: synthesize all scene-keyed narration with HeyGen voice/TTS in one batch when supported. The returned files are already scene segments; keep their ID-keyed durations and word timings.
- Existing long voice track: keep one source file. Derive scene boundaries from transcript or word timings and mount ranges from that source; do not export duplicate audio clips.
- Talking avatar generated directly from script: dispatch the selected avatar scenes with the same HeyGen `voice_id`. The returned video and its audio are one media result; do not also synthesize duplicate TTS for that scene.
- Talking avatar driven by a separate voice file: TTS must finish before that scene's avatar job can start. This dependency is serial inside the media lane; the visual lane still runs concurrently.
- Existing long talking-avatar video: keep one source file and reuse it across scene mounts with measured source offsets. Do not re-encode one file per scene.
- Generate independent avatar scenes concurrently when the provider supports it. Do not submit duplicate jobs merely to poll faster.

Use direct HeyGen voice and avatar generation for these media assets, not a complete Video Agent project per scene. Parallel submission changes wall time, not the intended generated seconds. Cost still rises when content is regenerated, overlapping handles or pauses are duplicated, or a more expensive avatar engine is selected.

Physical cutting is a fallback, not the default workflow. Use FFmpeg only when a provider cannot return scene-keyed media, HyperFrames cannot consume the source as a time range, or the requested deliverable explicitly requires standalone segment files.

### Visual lane

Initialize HyperFrames, install the deduplicated Registry items, generate the real scene HTML with provisional windows, and fill its content slots while media generates:

```bash
node <SKILL_DIR>/scripts/bootstrap-project.mjs \
  --project <PROJECT_DIR> \
  --host-id <id> \
  --presenter <off|on> \
  --presenter-scenes <talking-avatar-scene-ids> \
  --media-mode <voice|talking-avatar> \
  --language <tag> \
  --content-font <required-for-first-zh-ja-ko-build> \
  --scenes cover:auto,evidence:auto \
  --layout-map cover=orientation/headline-cover,evidence=data/kpi-grid
```

`auto` creates a six-second authoring window marked `data-vc-timing="provisional"`; it is not a duration estimate. Use `--presenter on` when any talking-avatar scene exists. If scene IDs or layouts are not locked yet, use `--prepare-only` instead and delay scene creation. Never render provisional timing.

## Join once, from real media timing

Measure each returned media file with `ffprobe`; prefer HeyGen's returned word timings when available. The actual voice or talking-avatar duration wins. Silent scenes retain their planned duration. Add only an intentional bounded pause, never a speculative percentage buffer.

Finalize the existing host and frames with exact seconds; this updates cumulative starts, full-window clip durations, and motion sidecars without rebuilding or overwriting authored scene content:

```bash
node <PROJECT_DIR>/scripts/finalize-timing.mjs \
  --project <PROJECT_DIR> \
  --scenes cover:7.42,evidence:9.18
```

Then replace the marked content slots and attach media:

- Scene-keyed voice files: use one uniquely identified `<audio>` per returned line, grouped as `voiceover` when there are several clips.
- One continuous voice file: mount it once across the host timeline. Scene starts come from its transcript or word timings; do not split or duplicate it.
- Talking avatar: replace the scene's static `<img class="presenter-media">` with a timed `<video class="presenter-media clip" muted playsinline>`, and add a separate uniquely identified `<audio>` using the same source. HyperFrames owns both; never call `play()`, `pause()`, or seek in script.
- Reused long avatar source: set `data-media-start` to that scene's measured source offset and `data-duration` to the scene range. Multiple scene mounts may point at the same source file.
- Never play the avatar video's embedded audio and a duplicate narration track together. The video stays muted; the separate audio element carries sound.
- Put `data-start` on the media or its plain wrapper, not both. Keep the avatar and its audio on the same scene-local window.
- Side and corner presenter layouts require a transparent/background-removed presenter asset. A generated clip with a baked background belongs in a presenter-led full-media divider unless background removal was explicitly requested.

Motion is fitted inside the real speech window. The presenter container remains still; the generated performance supplies human movement. Run Preflight only after media is mounted, then continue the normal Static and Preview review.
