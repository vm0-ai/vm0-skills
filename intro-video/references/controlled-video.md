# Controlled video: Okou supplies the content and timeline

## Exact presenter speech without custom composition

For a direct talking-avatar video, the connected HeyGen API accepts `POST /v3/videos` with `type: "avatar"`. This renders supplied speech; it does not research a topic or design a whole explainer from a prompt.

Write an actual request JSON file using exactly one speech source:

```json
{
  "type": "avatar",
  "avatar_id": "SELECTED_LOOK_ID",
  "script": "The user's finalized spoken script.",
  "voice_id": "RESOLVED_VOICE_ID",
  "engine": {"type": "avatar_iii"},
  "aspect_ratio": "16:9",
  "resolution": "1080p",
  "output_format": "mp4"
}
```

Check the selected look's `supported_api_engines` before setting an engine. The form's current catalog contains Avatar III-compatible public looks; do not switch identities to use another engine. `motion_prompt` controls supported body/hand motion, not source analysis or video structure. To lip-sync prepared narration, replace `script`/voice settings with `audio_url` or `audio_asset_id`; never send competing audio sources.

POST with `x-api-key: $HEYGEN_TOKEN`, persist `.data.video_id`, and read `GET /v3/videos/{video_id}` until the video is completed or failed. Apply the same no-duplicate-job and final verification rules as Video Agent. A script-driven avatar can use its exact default voice even when that voice is not supported by the separate Starfish TTS endpoint.

## Exact pages, footage, audio, or layout

Okou owns the scene list, prepared visuals, narration mapping, and time-based composition. HeyGen generates optional speech and transparent presenter takes; HyperFrames Cloud renders the composition. **No avatar** and **no voiceover** are implemented by omitting those layers, not by asking a generative agent to remember an exclusion.

1. Prepare required source visuals and decide scene order. For page-for-page conversion, retain all pages as static bitmaps; no restyling or invented marketing arc. For recordings, keep the selected source segments and verify crop/readability. Choose custom motion only when the brief calls for it.
2. Finalize one narration unit per scene. If the user requested silence, omit narration. If original audio was selected, extract or retain the intended track without TTS. For synthetic speech with a compatible exact voice, use the managed command:

   ```bash
   okou __intro-video-voice --voice-id VOICE_ID --text "FINAL_SCRIPT" --json
   ```

   Keep long or quote-sensitive scripts in a file and pass their contents as one safely quoted argument; the current command does not accept stdin. Split only to respect its 5,000-character limit. Retain every returned permanent audio URL and download needed assets into the composition project.
3. Generate a speaking presenter only if requested. Reuse that same audio:

   ```bash
   okou __intro-video-presenter --avatar-id LOOK_ID --avatar-group-id GROUP_ID \
     --audio-url NARRATION_URL --json
   ```

   The managed renderer currently produces a landscape transparent WebM. Verify alpha, duration, and framing. It is a composition layer, not the final MP4. For other ratios, fit the cutout without cropping essential content or use the connected direct avatar API with a supported ratio. Do not invent an `--aspect-ratio` flag on this managed command.
4. Check real speech duration with `ffprobe`; use transcription/timestamps to map scene cuts. A presenter take uses at most 600 seconds of audio. Longer narratives need separate bounded takes aligned to their narration segments, not a rejected overlong job. Mix narration once; mute the duplicate audio of any separately composited presenter.
5. Build the composition using the installed official HyperFrames workflow. Inspect `npx hyperframes@VERSION skills --help`, load its `hyperframes` entrypoint, and follow the route it selects. Use the project's pinned version; for a new project use a tested installed version and keep it fixed throughout the job. If the workflow is unavailable, report the missing dependency rather than inventing unsupported CLI flags or HTML attributes.
6. For static deck conversion, the mounted `ppt-avatar-video` skill's **composition builder** and geometry probes are reusable, but its JoggAI generation instructions do not accept the selected HeyGen IDs. Reuse only the builder after reading its manifest schema. Keep the source pages static. For a non-speaking avatar, use an actual available still; if a transparent still is unavailable, resolve the presentation choice instead of manufacturing an unrelated person.
7. Validate the composition before the billed render:

   ```bash
   npx hyperframes@VERSION lint PROJECT --json
   npx hyperframes@VERSION check PROJECT --strict --samples 5 --json
   npx hyperframes@VERSION snapshot PROJECT --at FIRST,MIDDLE,LAST --no-end --describe false
   npx hyperframes@VERSION cloud render PROJECT --dry-run --json
   ```

   Use actual numeric snapshot times, check all source pages/segments required by the brief, and confirm no stretching, covered text, accidental audio duplication, or missing assets. The public Video Agent style ID is not a cloud render option: any similar-looking custom composition is an adaptation and must have been described as such.
8. Render through HeyGen's HyperFrames Cloud using the connected credential. Inspect the pinned CLI help for exact flags. A supported invocation is:

   ```bash
   HEYGEN_API_KEY="$HEYGEN_TOKEN" npx hyperframes@VERSION cloud render PROJECT \
     --fps 30 --quality high --format mp4 --resolution 1080p --aspect-ratio 16:9 \
     --wait --output PROJECT/renders/final.mp4 --idempotency-key JOB_KEY --json
   ```

   Substitute the approved ratio/settings, and keep the same key for retries of the same render. Package the entry HTML and all referenced assets; a cloud renderer cannot read runtime-local paths outside the project. The underlying endpoint is `POST /v3/hyperframes/renders`, whose `project` field is a ZIP asset/URL/base64. It renders authored HTML rather than choosing content from a prompt.
9. Decode the final MP4, inspect frames and audio, compare required pages/segments and narration against the plan, and upload the verified file.

For simple consecutive full-frame scenes, `POST /v3/videos` with `type: "studio"` can replace a custom composition. Inspect [the Studio schema](https://developers.heygen.com/studio-videos) first. It supports up to 50 avatar, image, and video scenes; each fills the frame. It does not create a picture-in-picture avatar over the same slide. Do not use the old v2 `video_inputs` shape in a v3 request.
