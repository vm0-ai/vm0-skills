# Controlled video: Okou supplies the content and timeline

## Exact pages, footage, audio, or layout

Okou owns the scene list, prepared visuals, narration mapping, and time-based composition. The managed HeyGen integration generates optional speech and transparent presenter takes using Okou credits; local HyperFrames rendering finishes the composition without a personal HeyGen account. **No avatar** and **no voiceover** are implemented by omitting those layers, not by asking a generative agent to remember an exclusion.

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

   The managed renderer currently produces a landscape transparent WebM. Verify alpha, duration, and framing. It is a composition layer, not the final MP4. For other ratios, fit the cutout without cropping essential content. Do not invent an `--aspect-ratio` flag or use a personal account as a fallback.
4. Check real speech duration with `ffprobe`; use transcription/timestamps to map scene cuts. A presenter take uses at most 600 seconds of audio. Longer narratives need separate bounded takes aligned to their narration segments, not a rejected overlong job. Mix narration once; mute the duplicate audio of any separately composited presenter.
5. Build the composition using the installed official HyperFrames workflow. Inspect `npx hyperframes@VERSION skills --help`; if the entrypoint is missing, inspect `skills update --help` and install the needed `hyperframes` skill, then read it and follow its selected authoring route. Use the project's pinned version; for a new project, `0.8.26` is the version whose commands were verified for this skill. Keep the version fixed throughout the job. If the workflow cannot be installed, report the missing dependency rather than inventing unsupported CLI flags or HTML attributes.
6. For static deck conversion, the mounted `ppt-avatar-video` skill's **composition builder** and geometry probes are reusable, but its JoggAI generation instructions do not accept the selected HeyGen IDs. Reuse only the builder after reading its manifest schema. Keep the source pages static. For a non-speaking avatar, use an actual available still; if a transparent still is unavailable, resolve the presentation choice instead of manufacturing an unrelated person.
7. Validate the composition before rendering:

   ```bash
   npx hyperframes@VERSION lint PROJECT --json
   npx hyperframes@VERSION check PROJECT --strict --samples 5 --json
   npx hyperframes@VERSION snapshot PROJECT --at FIRST,MIDDLE,LAST --no-end --describe false
   ```

   Use actual numeric snapshot times, check all source pages/segments required by the brief, and confirm no stretching, covered text, accidental audio duplication, or missing assets. A public Video Agent style ID is not a local-render option: any similar-looking custom composition is an adaptation and must have been described as such.
8. Render locally by default; this does not require a HeyGen API credential:

   ```bash
   npx hyperframes@VERSION render PROJECT --fps 30 --quality high --format mp4 \
     --workers 1 --output PROJECT/renders/final.mp4
   ```

   Set the intended dimensions in the composition itself and use a matching supported resolution preset only when necessary. A local-render `--resolution` preset is not the same as the cloud API's resolution/ratio pair. Use one worker in constrained runtimes and wait for completion. Do not add a cloud render as a second copy of an already-rendered video.

9. Decode the final MP4, inspect frames and audio, compare required pages/segments and narration against the plan, and upload the verified file.

The managed APIs own provider credentials, billing, and artifact persistence. Save returned results and any generation identifier before subsequent steps, wait for the existing job, and reuse completed assets after interruption. Do not retry a billed submission merely because a command or request timed out; inspect its existing generation status first.

The presenter CLI already waits for the managed job. A `GENERATION_TIMEOUT` error includes its `generationId`; resume with `GET /api/built-in-generations/{generationId}` on the same API origin, authenticated with the run's `OKOU_TOKEN`, and use its completed `result`. The CLI's origin is `OKOU_API_BACKEND_URL` (add HTTPS only if no scheme is present), otherwise `https://api.okou.ai`. A queued/running response is not failure. If an interruption left no known generation ID, reconcile the existing job before resubmitting; do not invent a `--resume` CLI flag.
