# Input preparation and limits

Verified against the [Video Agent guide](https://developers.heygen.com/docs/video-agent), [uploads](https://developers.heygen.com/docs/upload-assets), [usage limits](https://developers.heygen.com/docs/usage-limits), and [official OpenAPI](https://developers.heygen.com/openapi/external-api.json) on 2026-09-05. Check the endpoint's current schema if a requested option is absent here; general limits pages can be less specific than the endpoint schema.

## Convert based on the intended use

Download chat attachments with `okou web download-file` after reading its help. Inspect real content, not only suffixes. Keep an input inventory recording source name, role, extracted facts, prepared path, MIME type, bytes, and any duration/page count needed for the chosen route.

| Input role | Preparation |
| --- | --- |
| Prompt only | Research missing facts with `okou web-search` and read selected sources. Write a compact factual brief. Do not assume Video Agent will browse or cite evidence. |
| PPT/PPTX used as references | Extract text and speaker notes; convert to PDF for native Video Agent attachment, or summarize into the prompt. Verify converted page count and representative pages. |
| PPT/PDF that must retain layout | Use `okou presentation screenshot --input SOURCE --out PROJECT/assets/slides --width 1920 --height 1080 --json`; retain every required page and order. Use these bitmaps in controlled composition. |
| DOC/DOCX/text/HTML | Extract relevant text and images; use a concise brief in the prompt or export a PDF. A DOCX, HTML project, or webpage URL is not a native Video Agent document input. |
| Spreadsheet/CSV/data | Calculate and verify the needed facts first; prepare charts, a short PDF, or script. Do not send a raw spreadsheet and assume it will be read. |
| Image | Convert unsupported images to PNG/JPEG and verify legibility. A brand mark or UI screenshot must not be hallucinated from a textual description when actual pixels are available. |
| Audio/video/recording | Probe codec, duration, dimensions, and tracks. Transcribe when needed. Convert unsupported formats to MP4/WebM or MP3/WAV; preserve only requested segments. For original audio, verify that the selected segments have the intended track. |
| Existing HyperFrames project | Read and validate the project, then render locally. Do not attach HTML or a composition ZIP to Video Agent as though it accepts an editable timeline. |
| Other or corrupt file | Try the available reader/converter. Explain the specific unreadable input; continue only if it is nonessential to a faithful result. Do not impose a new user-upload category restriction. |

A screen recording is an ordinary video input. With a synchronized same-stem `.clicks.json` sidecar, use `okou video camera --help` for the existing camera plan/review flow. Never synthesize click telemetry. This does not add a new screen-recording UI entry.

## Keep limits attached to their actual endpoint

| API | Constraints that affect planning |
| --- | --- |
| Video Agent `/v3/video-agents` | Nonempty prompt, at most 10,000 characters; at most 20 attachments. Native references: PNG/JPEG, MP4/WebM, MP3/WAV, PDF. Files are references, not a page/frame-retention contract. |
| Asset upload `/v3/assets` and URL inputs | 32 MB per file. URLs must be public HTTPS **file** URLs, without login or Okou authorization headers. Resolve or upload local/private files first. |
| Direct upload `/v3/assets/direct-uploads` | Initialize with exact bytes/MIME, obey returned `max_bytes`, PUT bytes with returned headers, then POST `/v3/assets/{asset_id}/complete`. A `pending_upload` ID is not usable. Larger upload capacity does not remove downstream generation limits. |
| Avatar `/v3/videos` | Script at most 5,000 characters or audio at most 600 seconds; provide exactly one of `script`, `audio_url`, `audio_asset_id`. Media input limits are separately documented: video 100 MB, image/audio 50 MB, image/video under 2K. For an asset/URL ingestion path also honor its smaller cap. |
| TTS `/v3/voices/speech` | Text 1–5,000 characters; Starfish voice required; speed 0.5–2.0. Optional language/locale are in the provider schema; the current managed command only exposes text/voice and uses provider language detection. Do not invent managed CLI flags. |
| Studio `/v3/videos` | At most 50 full-frame scenes. An image scene uses either a silent duration or one narration source, not both. Arbitrary overlapping layers need a composition or an appropriate existing template. |
| HyperFrames Cloud | Takes a packaged composition, not a creative brief. Explicit fps/format/resolution/ratio exist on this endpoint and do not transfer to Video Agent. |

For more than 20 useful attachments, curate/merge derived references without discarding required facts, or choose controlled composition. Do not truncate the file list silently. For an oversized prompt, summarize references while retaining instructions; do not silently cut a required verbatim script. For long speech, split at scene or sentence boundaries, generate each necessary segment once, and keep timings aligned.

The non-managed endpoint limits above explain provider boundaries; they do not authorize direct uploads or personal-account execution. In the current platform flow, prepare source visuals locally and pass narration audio through the managed presenter command, which resolves supported artifact URLs. A login page with status 200 is not a valid media file.
