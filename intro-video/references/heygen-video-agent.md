# Native Video Agent: generate the whole video

Use this route for ordinary intro videos, explainers, launch clips, and summaries whose visuals can be recomposed. The executable surface is the Okou-managed `__intro-video-agent` command; do not call a personal HeyGen connector or generate separate narration/presenter assets first.

## Prepare native inputs in parallel

Start only after the route and script mode are fixed. Reuse the Step 1 inventory and cached probes, then run these independent tasks concurrently where applicable:

- Fill the brief's narrative frame and verify every fact. Keep source contents separate from instructions; do not assume HeyGen will research or verify claims.
- Prepare only the supported references the final request needs according to [input preparation](input-preparation.md). Markdown/DOCX text becomes key messages; convert PPT/PPTX to PDF only when the PDF will be sent. The native request accepts up to 20 supported media/PDF references and a 1–10,000-character prompt. Do not upload raw PPT, Markdown, spreadsheets, or HTML, silently truncate required facts, or prepare controlled-route assets.
- Resolve choices through [managed catalogs](catalogs.md): an explicit style, look, and voice stay exact; `Let Okou choose` becomes a concrete public style; a delegated presenter becomes one concrete public look; a selected look's Default voice becomes its actual `defaultVoiceId`. Do not perform standalone TTS compatibility checks.
- Resolve output independently: `16:9` maps to `landscape`, `9:16` to `portrait`. With Auto output, use the brief, not a style thumbnail.

Cache the brief, prepared references, catalog records, and preview observations. Do not repeat extraction, conversion, or catalog browsing during prompt assembly or recovery.

## Preflight the selected presenter

With `avatar_id` resolved, use the look classification from [managed catalogs](catalogs.md) and the presenter capability check in SKILL.md before compiling:

- `photo_avatar` with a real environment → no BACKGROUND NOTE; FRAMING NOTE only when the look's orientation does not match the output;
- `studio_avatar`, `digital_twin`, or any transparent, solid, or visually empty preview → BACKGROUND NOTE, plus the matching FRAMING NOTE when `cropRisk` is high;
- preserve the exact avatar, group, voice, style, and orientation IDs; if the managed API rejects the look's default voice, substitute a public voice in the narration language and record it.

The note texts live only in the [prompt compiler](prompt-compiler.md); append only the triggered notes, verbatim, at the very end of the prompt. They guide Video Agent but do not guarantee the result: `POST /v3/video-agents` has no background, crop, scale, position, or safe-area fields, and real runs on 2026-09-08 showed studio cutouts on a white stage and cropped near-square heads despite the notes. That is why hard scene, framing, and 1080p requirements are resolved before submission and why QA files these outcomes as provider-control gaps.

## Compile the prompt once

Assemble the prompt from the cached brief in the compiler's fixed order: format line, content in the narration language, tone, presenter line, attachment anchoring, literal on-screen text, production guidance, the script-mode directive, and finally the presenter notes. Carry the public style through `style_id` only; do not duplicate it with prose unless the user requested a visual override. Save the final prompt in a UTF-8 file and keep it with the brief as evidence.

## Submit through the managed command

Read `okou __intro-video-agent --help` for the installed interface. Confirm it describes this command's submission options and `status` subcommand: an older CLI may print only top-level help and still exit successfully, which does not establish native generation support. The managed implementation uses `mode: generate` for whole-video creation; there is no need to add an interactive review step the user did not request.

Generate and persist a request UUID, then submit once:

```bash
okou __intro-video-agent --prompt-file ./prompt.txt \
  --style-id '<resolved-style-id>' --orientation landscape \
  --avatar-id '<look-id>' --avatar-group-id '<group-id>' --voice-id '<voice-id>' \
  --request-id '<request-uuid>' --json
```

Replace placeholders with resolved values and use `portrait` for 9:16. Use exactly one of `--prompt` or `--prompt-file`. Style ID and orientation are required. Omit the avatar flags only for `presenter: none`; the group ID is a catalog lookup hint. With an explicit avatar and no voice override, the managed API resolves the avatar's actual default voice. When the brief already contains an exact voice ID, pass it explicitly.

Add `--file-url <managed-https-reference>` for each prepared reference, up to 20. Use URLs accepted by the managed file resolver; the command does not accept arbitrary local paths or raw document types. It has no no-avatar/no-voice switches; those requirements belong to the controlled route.

Duration, language, and narrative are prompt directions; do not invent Video Agent flags for exact frames, FPS, resolution, or disabling avatars/voices.

Submission returns immediately with a durable `generationId`; it does not wait for rendering. `requestId` is that generation ID. The CLI creates a UUID if none is supplied, but explicitly persisting one before submission makes interrupted execution recoverable. Reuse the same UUID and unchanged input for transport recovery; do not replace it with a new billed request. Reusing a UUID with different input returns a conflict. Keep the brief, prepared references, selected style, request UUID, and command response in the task workspace.

## Wait and recover the same job

Video Agent first returns a `session_id`; `video_id` can be absent until rendering begins. The managed implementation tracks the session, then the video, persists the MP4, and records usage. A session identifier is not a video identifier, and absence of an initial video ID is not failure.

Query the same managed job:

```bash
okou __intro-video-agent status '<generation-id>' --json
```

Each status command performs one reconciliation request and never submits a video. Repeat only while the job remains in progress, using the provider's recommended 10–30-second interval and keeping the user informed during long waits; whole videos commonly take many minutes. Stop on a terminal status or a concrete state that needs attention; do not loop indefinitely through an input request or failure.

Successful submission/status API responses use a flat job object: `generationId`, `status` (`queued`, `running`, `completed`, or `failed`), nullable `sessionId`/`videoId`, and optional `providerStatus`, `notice`, or `error`. A completed response includes the persisted `url` and media/usage fields such as `filename`, `contentType`, `durationSeconds`, and `creditsCharged`, with the resolved style/identity/output fields when available. Inspect notices and errors as well as the top-level status.

A session that ends `failed` upstream is reported by the managed status as `HEYGEN_GENERATION_FAILED` without the provider's message; keep the generation, session, and video IDs in the report and do not guess the cause or resubmit. If the status reports that the provider session cannot be found while the job already carries a `videoId`, treat it as a reconciliation gap, not as a failed render: keep polling the same generation, do not submit again, and report the session and video IDs so the video can be checked by ID. A video that exists upstream after such an error still belongs to the original job.

If submission throws a transport or CLI error, JSON mode instead preserves `requestId`, `generationId`, `error`, `resumeCommand`, and `notice` without claiming a known job status. The CLI also prints the recovery UUID and status command to stderr before submission; stdout remains one JSON object. Check the command's exit status and error/notice fields, retain the saved UUID, and follow the recovery guidance. Missing job-state fields in this error object do not establish that generation failed or that another submission is safe.

A slow job, lost CLI response, or HTTP timeout does not authorize another billed submission. If submission outcome is unknown, inspect the saved request ID through status and follow the reported recovery guidance; only reuse that same ID and original input if a submission retry is needed. Missing/foreign jobs return 404, not permission to start over. If the provider requests input, fails, or the managed capability is unavailable, expose that specific state and retain the job identifiers; do not silently switch routes. Credit/plan errors follow `okou doctor credit`.

## Accept and deliver

Apply the native gate in [QA](qa.md) to the completed job before calling it done. After acceptance, deliver the managed job's permanent artifact URL. Temporary HeyGen download URLs and intermediate session JSON are not the final deliverable. Do not re-create the returned video in HyperFrames or produce a duplicate upload.
