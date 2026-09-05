# Video Agent: HeyGen creates the whole video

Use only when the route in `SKILL.md` permits creative reinterpretation **and the user explicitly authorized connected-account execution/billing**. This is not the default Okou-credit route; the current platform has no managed native Video Agent endpoint. Okou prepares a factual brief and supported references; HeyGen chooses the narrative/visual execution and renders the MP4. Do not separately synthesize the same narration or render another HyperFrames copy.

## Build the request

The current [create-session schema](https://developers.heygen.com/reference/create-video-agent-session) has these fields only: `prompt`, `mode`, `avatar_id`, `voice_id`, `style_id`, `brand_kit_id`, `brand_glossary_id`, `orientation`, `files`, `callback_url`, `callback_id`, `incognito_mode`.

Write `PROJECT/video-agent-request.json`. This is an illustrative shape; replace example IDs with actual selected/returned IDs and omit irrelevant fields:

```json
{
  "prompt": "Create an approximately 60-second English product introduction for operations managers. Use only the verified facts below and the attached reference. Explain the problem, show the outcome, and finish with the requested next step. References may be adapted; do not invent product capabilities. [Insert the actual facts, requested content, tone, and style direction.]",
  "mode": "generate",
  "orientation": "landscape",
  "avatar_id": "SELECTED_LOOK_ID",
  "voice_id": "RESOLVED_VOICE_ID",
  "style_id": "SELECTED_STYLE_ID",
  "files": [{"type": "asset_id", "asset_id": "UPLOADED_REFERENCE_ID"}],
  "incognito_mode": true
}
```

- Put approximate duration, language, audience, story, required facts, exclusions, and caption preferences into the prompt. They are directions, not guaranteed render settings. Do not add `duration_sec`, `fps`, `resolution`, `caption`, `scenes`, or a nested `config` object.
- Explicit `style_id` uses the native public Video Agent style. Omit it for no preset, or resolve a suitable public style when delegated.
- If the user chose an avatar and Default voice, pass both the exact avatar and its default voice ID. If a voice override was selected, pass that exact override.
- If automatic avatar selection resolves to no avatar, change to controlled composition. Do not represent no-avatar or no-voice with null/empty IDs.
- Use `mode: "generate"` for normal direct delivery. `chat` permits multi-turn revisions but may auto-proceed on confirmations; it is not a reliable user-approval barrier. If the user requests storyboard approval before rendering, obtain that approval in Okou before starting a billed generation.
- Brand kit/glossary IDs must exist in the connected account. No implicit brand configuration changes or new public share page are required.

## Submit once and resume the same session

Resolve this skill directory from its mounted path, then use the bundled helper:

```bash
node SKILL_DIR/scripts/heygen-agent.mjs validate PROJECT/video-agent-request.json
node SKILL_DIR/scripts/heygen-agent.mjs submit PROJECT/video-agent-request.json PROJECT/heygen-job.json
node SKILL_DIR/scripts/heygen-agent.mjs status PROJECT/heygen-job.json
```

`submit` performs one `POST /v3/video-agents`. It refuses to overwrite an existing state file. The file is created before submission so an interrupted or timed-out POST cannot silently start a duplicate when retried. An uncertain submission needs reconciliation against the connected account, not deletion of the state file and a new generation.

Use status checks about 15–30 seconds apart. Each `status` command reads once, persists any assigned `video_id`, and then checks `GET /v3/videos/{video_id}` on subsequent calls. Session status `completed` is not enough: only a completed **video** with a download URL is deliverable. `waiting_for_input` requires reading the session messages and resolving the actual choice; `reviewing` is still nonterminal. The helper never approves choices or submits follow-up messages on the user's behalf.

On provider failure, read the stored failure fields and explain the cause. On 429 honor `Retry-After`; on a network error resume status reads. Do not submit a second billed job merely because generation is slow. Do not claim the helper can cancel a session or make safe POST retries with undocumented idempotency.

When the helper reports a completed video:

```bash
node SKILL_DIR/scripts/heygen-agent.mjs download PROJECT/heygen-job.json PROJECT/final.mp4
ffprobe -v error -show_streams -show_format -of json PROJECT/final.mp4
ffmpeg -v error -i PROJECT/final.mp4 -f null -
```

Inspect representative frames and listen to/transcribe the narration. Check the actual source claims, language, identity/voice, and requested duration. An approximate duration may vary; do not promise an exact second or exact source-page retention on this route. If it does not meet a hard requirement, explain the specific mismatch rather than silently resubmitting.

Upload the verified local MP4 with `okou web upload-file`. The provider URL is temporary; it is not the final durable user artifact.
