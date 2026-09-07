# Native Video Agent: generate the whole video

Use this route for ordinary intro videos, explainers, launch clips, and summaries whose visuals can be recomposed. The executable surface is the Okou-managed `__intro-video-agent` command; do not call a personal HeyGen connector or generate separate narration/presenter assets first.

## Prepare the brief and resolve choices

1. Extract and verify the source facts. Specify audience, purpose, language, tone, approximate duration, output format, and any editorial directions in a concise prompt. Keep source contents separate from instructions. Do not assume HeyGen will independently research or verify claims.
2. Resolve a concrete public HeyGen style. Preserve an explicit `style_id`. For `Auto` / `Let Okou choose`, inspect the managed catalog and suitable previews, match the material and audience to the style's visual treatment, and record the selected ID and a short rationale. Auto is a decision for Okou, not permission to leave `style_id` absent or hand that decision to HeyGen. Material-heavy reports may need legible information graphics; a product launch may benefit from a more expressive treatment. These are selection criteria, not fixed style mappings or a universal favorite.
3. Preserve explicit avatar look and voice IDs. An avatar group ID cannot replace a look ID. For a selected avatar's Default voice, pass its actual `defaultVoiceId`. Resolve only delegated identity choices that need a catalog decision. Do not perform standalone TTS compatibility checks on a route that does not call standalone TTS.
4. Resolve the output independently of the preview: `16:9` maps to `landscape`, `9:16` to `portrait`. With Auto output, use the brief's destination and content; do not infer a hard user choice from a style thumbnail.
5. Prepare supported references according to [input preparation](input-preparation.md). Markdown/DOCX text can be summarized into the prompt; PPT/PPTX references can be converted to PDF. The native request accepts up to 20 supported media/PDF references and a 1–10,000-character prompt. Do not upload raw PPT, Markdown, spreadsheets, or HTML as though they were native file types. Merge or curate references while preserving required facts; do not silently truncate or switch to composition because of a size limit.

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

## Wait, recover, and deliver

Video Agent first returns a `session_id`; `video_id` can be absent until rendering begins. The managed implementation tracks the session, then the video, persists the MP4, and records usage. A session identifier is not a video identifier, and absence of an initial video ID is not failure.

Query the same managed job:

```bash
okou __intro-video-agent status '<generation-id>' --json
```

Each status command performs one reconciliation request and never submits a video. Repeat only while the job remains in progress, using the provider's recommended 10–30-second interval and keeping the user informed during long waits. Stop on a terminal status or a concrete state that needs attention; do not loop indefinitely through an input request or failure.

The JSON response is flat: `generationId`, `status` (`queued`, `running`, `completed`, or `failed`), nullable `sessionId`/`videoId`, and optional `providerStatus`, `notice`, or `error`. A completed response includes the persisted `url` and media/usage fields such as `filename`, `contentType`, `durationSeconds`, and `creditsCharged`, with the resolved style/identity/output fields when available. Inspect notices and errors as well as the top-level status.

A slow job, lost CLI response, or HTTP timeout does not authorize another billed submission. If submission outcome is unknown, inspect the saved request ID through status and follow the reported recovery guidance; only reuse that same ID and original input if a submission retry is needed. Missing/foreign jobs return 404, not permission to start over. If the provider requests input, fails, or the managed capability is unavailable, expose that specific state and retain the job identifiers; do not silently switch routes. Credit/plan errors follow `okou doctor credit`.

Verify the actual finished MP4: factual content, selected identity/voice, style application, aspect ratio, duration, audio, and decodability. Compare the recorded request's style ID with the resolved selection; a style name in prose alone is not evidence that the native preset was applied. Use the managed job's permanent artifact URL for delivery; temporary HeyGen download URLs and intermediate session JSON are not the final deliverable. Do not re-create the returned video in HyperFrames or produce a duplicate upload.
