# Controlled video: Okou orchestrates the content, audio, and timeline

Read this only after the main skill selects controlled composition. It is the route for requirements HeyGen Video Agent cannot honor: no added narration (`No voiceover`), no audio at all (`silent`), a retained source track (`Original audio`), exact pages, frames, footage, timing, layout, or geometry, and a verbatim script that must also hit an exact duration. Video Agent always writes and voices narration and treats attached audio as reference material, so these outcomes exist only because Okou composes the video itself. A source attachment, Auto style, missing native access, or a failed native job is not a trigger for this route.

## Exact pages, footage, audio, or layout

Okou owns the scene list, prepared visuals, narration mapping, and time-based composition. The managed HeyGen integration generates optional speech and transparent presenter takes using Okou credits; local HyperFrames rendering finishes the composition without a personal HeyGen account. **No avatar**, **no voiceover**, **silent**, and **original audio** are implemented by including or omitting audio and presenter layers in the composition, not by asking a generative agent to remember an exclusion. Okou owns the audio decision on this route.

Resolve Auto style from the [managed catalog](catalogs.md) only when the brief calls for a style treatment. Use the selected style only for permitted added graphics and treatments. Preserve original page/footage pixels and geometry where required; explain that the resulting treatment is a controlled adaptation, not native preset execution. Resolve a conflict only when the user explicitly requires both native preset execution and incompatible preservation controls.

Style selection does not authorize extra decorative layers. If the user permits no visual additions, record the selected style and explain that the original visuals determine the appearance; do not add graphics just to demonstrate the choice.

## Lock the plan

Before asset generation, lock the required pages or footage, scene order, preservation geometry, source-audio policy, narration units, presenter overlay, output ratio, and fixed timing requirements. For page-for-page work, retain every page as a static bitmap with no restyling or invented marketing arc. For recordings, retain the selected segments and verify crop/readability. Choose custom motion only when requested.

For a narrative video without pages to preserve, an Okou intro-video template pack ([`Template-artifact/Template-IntroVideo`](https://github.com/vm0-ai/Template-artifact/tree/main/Template-IntroVideo): a narrative arc, a colour world, and per-beat HTML compositions with text slots) may supply the visual system; its arc must match the recipe chosen in [recipes](recipes.md), and Okou fills the slots from the brief. For static deck conversion, the mounted `ppt-avatar-video` skill's **composition builder** and geometry probes are reusable, but its JoggAI generation instructions do not accept the selected HeyGen IDs. Reuse only the builder after reading its manifest schema. Keep source pages static. For a non-speaking avatar, use an available still; if a transparent still is unavailable, resolve the presentation choice instead of manufacturing an unrelated person.

## Prepare independent lanes

After the plan is locked, run these lanes concurrently and cache every probe, conversion, catalog result, and generated asset:

1. **Visuals:** prepare only the required page bitmaps, footage segments, and permitted added graphics.
2. **Narration/audio:** finalize one narration unit per scene. `No voiceover` omits added narration but does not delete source audio; `silent` removes every audio track. For original audio, probe that the intended track exists and extract or retain it without TTS. For synthetic speech with a compatible exact voice, use the managed command:

   ```bash
   okou __intro-video-voice --voice-id VOICE_ID --text "FINAL_SCRIPT" --json
   ```

   Keep long or quote-sensitive scripts in a file and pass their contents as one safely quoted argument; the command does not accept stdin. Split only for its 5,000-character limit. Retain each permanent audio URL and download needed assets into the project.
3. **HyperFrames project:** initialize the project from the locked plan without waiting for visuals or narration. Inspect `npx hyperframes@VERSION skills --help`; if the entrypoint is missing, inspect `skills update --help`, install the needed `hyperframes` skill, then read and follow it. Use the project's pinned version; for a new project, use verified version `0.8.26`. Keep it fixed. If installation fails, report the dependency instead of inventing CLI flags or HTML attributes.

Generate a speaking presenter only if requested. Its sole preparation dependency is the finalized narration audio; start it as soon as that audio is available while other lanes continue, and reuse that same audio:

```bash
okou __intro-video-presenter --avatar-id LOOK_ID --avatar-group-id GROUP_ID \
  --audio-url NARRATION_URL --json
```

The managed renderer produces a landscape transparent WebM. Verify alpha, duration, and framing: on the direct video endpoint a near-square look fitted to the frame width (`cover`) loses the top of its head, while `contain` keeps it, and the managed command exposes no fit control. If a take arrives cropped, report it as a platform fit defect with the look dimensions instead of retrying the same take. It is a composition layer, not the final MP4. For other ratios, fit it without cropping essential content. Do not invent an `--aspect-ratio` flag or use a personal account.

Check real speech duration with `ffprobe`; use transcription/timestamps only as needed to map scene cuts. A presenter take uses at most 600 seconds of audio. Split longer narratives into bounded takes aligned to narration segments. Mix narration once and mute duplicate presenter audio. Do not repeat preparation or generate speculative alternate-route assets.

## Assemble, validate, and render once

When the lanes finish, assemble the cached assets and final timings once. Validate before the final render:

```bash
npx hyperframes@VERSION lint PROJECT --json
npx hyperframes@VERSION check PROJECT --strict --samples 5 --json
npx hyperframes@VERSION snapshot PROJECT --at FIRST,MIDDLE,LAST --no-end --describe false
```

Use numeric snapshot times, check every required page/segment, and confirm no stretching, covered text, duplicate audio, or missing assets. A public Video Agent style ID is not a local-render option; any similar custom treatment is an adaptation and must have been described as such.

Render locally once after validation; this does not require a HeyGen API credential:

```bash
npx hyperframes@VERSION render PROJECT --fps 30 --quality high --format mp4 \
  --workers 1 --output PROJECT/renders/final.mp4
```

Set the independently resolved dimensions in the composition (for example 1920×1080 for 16:9 or 1080×1920 for 9:16). Reflow adapted graphics; fit fidelity-critical pages or footage without cropping. A style reference's ratio is source metadata, not an output override. A local `--resolution` preset is not the cloud API's resolution/ratio pair. Use one worker in constrained runtimes and wait for completion. Do not add a cloud render.

Decode the final MP4, inspect frames and audio, compare required pages/segments and narration against the plan, and upload the verified file.

The managed APIs own provider credentials, billing, and artifact persistence. Save returned results and any generation identifier before subsequent steps, wait for the existing job, and reuse completed assets after interruption. Do not retry a billed submission merely because a command or request timed out; inspect its existing generation status first.

The presenter CLI already waits for the managed job. A `GENERATION_TIMEOUT` error includes its `generationId`; resume with `GET /api/built-in-generations/{generationId}` on the same API origin, authenticated with the run's `OKOU_TOKEN`, and use its completed `result`. The CLI's origin is `OKOU_API_BACKEND_URL` (add HTTPS only if no scheme is present), otherwise `https://api.okou.ai`. A queued/running response is not failure. If an interruption left no known generation ID, reconcile the existing job before resubmitting; do not invent a `--resume` CLI flag.
