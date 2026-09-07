# Native Video Agent: generate the whole video

Use this route for ordinary intro videos, explainers, launch clips, and summaries whose visuals can be recomposed. The executable surface is the Okou-managed `__intro-video-agent` command; do not call a personal HeyGen connector or generate separate narration/presenter assets first.

## Prepare the brief and resolve choices

1. Extract and verify the source facts. Record the audience, purpose, language, tone, approximate duration, output format, and necessary editorial directions. Keep source contents separate from instructions. Do not assume HeyGen will independently research or verify claims.
2. Resolve choices through [managed catalogs](catalogs.md). Preserve an explicit public Video Agent `style_id` exactly. For `Auto` / `Let Okou choose`, select a concrete suitable style before submission. Auto is a decision for Okou, not permission to omit `style_id` or hand that decision to HeyGen.
3. Preserve explicit avatar look and voice IDs. An avatar group ID cannot replace a look ID. For a selected avatar's Default voice, pass its actual `defaultVoiceId`. Resolve only delegated identity choices that need a catalog decision. Do not perform standalone TTS compatibility checks on a route that does not call standalone TTS.
4. Resolve the output independently of the preview: `16:9` maps to `landscape`, `9:16` to `portrait`. With Auto output, use the brief's destination and content; do not infer a hard user choice from a style thumbnail.
5. Prepare supported references according to [input preparation](input-preparation.md). Markdown/DOCX text can be summarized into the prompt; PPT/PPTX references can be converted to PDF. The native request accepts up to 20 supported media/PDF references and a 1–10,000-character prompt. Do not upload raw PPT, Markdown, spreadsheets, or HTML as though they were native file types. Merge or curate references while preserving required facts; do not silently truncate or switch to composition because of a size limit.

## Build the smallest sufficient prompt

For a short native video, include only the purpose/topic, approximate duration, requested language and tone, narration or verified factual content, and technical corrections that change the result. Keep narration in the requested language, but write frame/background corrections, script-framing instructions, and other technical directives in English. When `avatar_id` is supplied, refer to “the selected presenter”; do not describe the avatar's appearance.

Carry an exact public style through `style_id`. Do not duplicate it with a long style manifesto unless the user requests additional visual overrides. Avoid redundant scene constraints and decorative prose.

## Preflight the selected presenter

When `avatar_id` is supplied, use the preview observations from [managed catalogs](catalogs.md) before submission:

- If the preview is transparent, solid, or visually empty, append the Background Note below.
- If the preview is near-square and the target is landscape (`16:9`), append the Framing Note below.
- Preserve the exact avatar, group, voice, style, and orientation IDs.

Append only the triggered notes, verbatim and in English, at the end of the prompt. Their wording lives here only.

**Background Note:**

```text
BACKGROUND NOTE: The selected avatar has no background or a transparent backdrop. Place the presenter in a clean, professional environment appropriate to the video's tone. For business/tech content: modern studio with soft lighting and subtle depth. For casual content: bright, minimal space with natural light. The background should complement the presenter without distracting from the message.
```

**Square-to-landscape Framing Note:**

```text
FRAMING NOTE: The selected avatar image is in square orientation but this video is landscape (16:9). Frame the presenter from the chest up, centered in the landscape canvas. Use AI Image tool to generative fill to extend the scene horizontally with a complementary background environment that matches the video's tone (studio, office, or contextually appropriate setting). Do NOT add black bars or pillarboxing. The avatar should feel natural in the 16:9 frame.
```

These notes guide Video Agent but do not guarantee the result. `POST /v3/video-agents` has no background, crop, scale, position, or safe-area fields; do not invent them or claim deterministic control.

## Submit through the managed command

Read `okou __intro-video-agent --help` for the installed interface. Confirm it describes this command's submission options and `status` subcommand: an older CLI may print only top-level help and still exit successfully, which does not establish native generation support. Resolve the style before submission. The managed implementation uses `mode: generate` for ordinary whole-video creation; there is no need to add an interactive review step the user did not request.

Save the final prompt in a UTF-8 file, generate and persist a request UUID, and submit once:

```bash
okou __intro-video-agent --prompt-file ./prompt.txt \
  --style-id '<resolved-style-id>' --orientation landscape \
  --avatar-id '<look-id>' --avatar-group-id '<group-id>' --voice-id '<voice-id>' \
  --request-id '<request-uuid>' --json
```

Replace placeholders with resolved values and use `portrait` for 9:16. Use exactly one of `--prompt` or `--prompt-file`. Style ID and orientation are required. Omit optional avatar/group/voice flags when they do not apply; the group ID is only a catalog lookup hint. With an explicit avatar and no voice override, the managed API resolves the avatar's actual default voice. When the brief already contains an exact voice ID, pass it explicitly.

Add `--file-url <managed-https-reference>` for each prepared reference, up to 20. Use URLs accepted by the managed file resolver; the command does not accept arbitrary local paths or raw document types. It has no no-avatar/no-voice switches.

The provider request must contain the concrete `style_id`, prepared `prompt`, resolved `orientation`, and applicable `avatar_id`, `voice_id`, and prepared references. Duration, language, and narrative are prompt directions; do not invent Video Agent flags for exact frames, FPS, resolution, or disabling avatars/voices. Exact source-retention and exclusion requirements belong to the controlled route or require a concrete capability conflict to be resolved.

Submission returns immediately with a durable `generationId`; it does not wait for rendering. `requestId` is that generation ID. The CLI creates a UUID if none is supplied, but explicitly persisting one before submission makes interrupted execution recoverable. Reuse the same UUID and unchanged input for transport recovery; do not replace it with a new billed request. Reusing a UUID with different input returns a conflict. Keep the brief, prepared references, selected style, request UUID, and command response in the task workspace.

## Wait and recover the same job

Video Agent first returns a `session_id`; `video_id` can be absent until rendering begins. The managed implementation tracks the session, then the video, persists the MP4, and records usage. A session identifier is not a video identifier, and absence of an initial video ID is not failure.

Query the same managed job:

```bash
okou __intro-video-agent status '<generation-id>' --json
```

Each status command performs one reconciliation request and never submits a video. Repeat only while the job remains in progress, using the provider's recommended 10–30-second interval and keeping the user informed during long waits. Stop on a terminal status or a concrete state that needs attention; do not loop indefinitely through an input request or failure.

Successful submission/status API responses use a flat job object: `generationId`, `status` (`queued`, `running`, `completed`, or `failed`), nullable `sessionId`/`videoId`, and optional `providerStatus`, `notice`, or `error`. A completed response includes the persisted `url` and media/usage fields such as `filename`, `contentType`, `durationSeconds`, and `creditsCharged`, with the resolved style/identity/output fields when available. Inspect notices and errors as well as the top-level status.

If submission throws a transport or CLI error, JSON mode instead preserves `requestId`, `generationId`, `error`, `resumeCommand`, and `notice` without claiming a known job status. The CLI also prints the recovery UUID and status command to stderr before submission; stdout remains one JSON object. Check the command's exit status and error/notice fields, retain the saved UUID, and follow the recovery guidance. Missing job-state fields in this error object do not establish that generation failed or that another submission is safe.

A slow job, lost CLI response, or HTTP timeout does not authorize another billed submission. If submission outcome is unknown, inspect the saved request ID through status and follow the reported recovery guidance; only reuse that same ID and original input if a submission retry is needed. Missing/foreign jobs return 404, not permission to start over. If the provider requests input, fails, or the managed capability is unavailable, expose that specific state and retain the job identifiers; do not silently switch routes. Credit/plan errors follow `okou doctor credit`.

## Accept or reject the native output

A completed provider job is a QA candidate, not an accepted deliverable. Probe the media and inspect representative frames from the opening, closing, scene transitions, avatar shots, and text-dense scenes. Compare the recorded request's `style_id` with the resolved selection; a style name in prose alone is not evidence that the native preset was applied, while a matching ID does not prove visual adherence.

Reject the output when any of these materially violates the brief:

- representative avatar frames crop the head or face, lack clear head margin, or are otherwise unsafe;
- the requested integrated presenter scene lacks a real background or appears as an accidental isolated cutout or blank stage;
- style-bearing scenes do not visibly reflect the selected style, or the treatment materially mismatches its preview;
- text is unreadable, the aspect ratio is wrong, audio or decoding is broken, or facts drift from the verified brief.

Also verify selected identity/voice, requested audio behavior, and approximate or exact duration as applicable.

If a billed output fails this gate, retain its generation/session/video IDs and artifact as evidence, report the unmet requirements, and do not call it “polished” or silently deliver it as accepted. Do not automatically submit another paid job or switch to controlled composition. Explain the provider limitation and obtain the user's direction and any required authorization before a materially different or paid retry.

After acceptance, use the managed job's permanent artifact URL for delivery. Temporary HeyGen download URLs and intermediate session JSON are not the final deliverable. Do not re-create the returned video in HyperFrames or produce a duplicate upload.
