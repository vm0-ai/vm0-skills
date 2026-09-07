---
name: seedance
description: Seedance video generation API by ByteDance. Use when user mentions "Seedance", "ByteDance video AI", "text-to-video", "image-to-video", or wants to generate AI videos using Seedance models.
---

## Troubleshooting

If requests fail, run `okou doctor check-connector --env-name SEEDANCE_TOKEN` or `okou doctor check-connector --url https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks --method POST`

## Keyframe review before video generation

Before any billed video submission through the CLI or a provider API:

1. Verify the exact provider/model version and endpoint/mode using `okou generate video -h` and current provider documentation as needed. Check supported image roles, counts, input combinations, and size/aspect-ratio limits before generating stills. A model family name or global CLI flag does not establish support; do not use paid jobs to probe capabilities. Choose the smallest useful approach:
   - **First-frame input:** start with one opening image and describe motion separately.
   - **First/last frames:** add a last frame only when the ending matters. Check that subject, scene, and motion can connect plausibly within the duration; incompatible endpoints can cause unnatural morphing.
   - **Reference images:** use a small set for subject/product/style consistency. Image order does not control a timeline, shot order, or timestamps unless the API explicitly supports that.
   - **Text only:** explain before making stills that they are concept previews for the user and prompt development, not model inputs. Include this limitation in the approval, or agree on an image-capable alternative; do not silently change the selected model/mode.
2. Prepare only the needed frames matching the user's subject, style, composition, and aspect ratio; reuse suitable supplied/approved images. Read `okou generate image -h` for supported prompt modes, keep the default image model unless the user names another, and use economical preview settings. Tell the user that images are billed and video generation will wait. Execute example payloads below only within an approved video plan. For multiple shots, preview distinct compositions only as needed; separate generations and editing must be included in the approved clip count and cost, not automatically assigned to every storyboard image.
3. Inspect and share the actual numbered frames using accessible URLs (upload local images), with individual links alongside any contact sheet. Identify each as first frame, last frame, visual reference, or concept preview only; show the exact crop for model inputs. Include planned motion, clip count, duration per clip, ratio, resolution, audio, provider/model/mode, and a current cost estimate when available; distinguish image/video costs, never invent prices, and resolve user-set spending caps. Explain the relevant limits briefly: previews align appearance but do not guarantee motion, transitions, temporal consistency, physics, text stability, first-attempt success, or lower total cost. More frames do not necessarily help.
4. Ask the user to approve the shown frames and described video approach, then end the turn. Do not start video jobs in the background or in parallel while waiting. A general video request, template choice, speed request, or silence is not approval. Reuse explicit approval for an unchanged plan; only an explicit instruction to skip preview review and proceed with paid generation for this video overrides the default. Revise affected frames/plan and seek approval again when changes are requested. For text-only generation, never imply the model receives the preview images.
5. Execute the approved strategy. For an image-capable mode, pass individual approved images using the verified roles and supported combinations, not a contact sheet. For an explicitly approved text-only plan, translate the approved visual direction into the prompt without unsupported image flags or claims of direct image conditioning. If the intended strategy is unsupported, get approval for a compatible plan before submitting. Keep the approved URLs, roles, and plan in the conversation; submit only the approved clips and parameters, wait for completion, and deliver the returned artifact.
6. Approval covers the described attempts, not unlimited spending. Obtain fresh approval for material frame/plan/cost changes, including model/mode or image roles, and for extra variants or paid retries outside the approved attempt limit and budget. Recover or poll an existing job when its status is uncertain instead of submitting a duplicate.

## How to Use

Video generation is **asynchronous**: submit a task → get a task ID → poll until `succeeded` → use the video URL (valid for 24 hours).

### 1. Text-to-Video (Standard — 1080p)

Write to `/tmp/seedance_request.json`:

```json
{
  "model": "dreamina-seedance-2-0-260128",
  "content": [
    { "type": "text", "text": "A golden retriever puppy playing in autumn leaves, cinematic slow motion" }
  ],
  "resolution": "1080p",
  "ratio": "16:9",
  "duration": 5
}
```

```bash
curl -s -X POST "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks" --header "Authorization: Bearer $SEEDANCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/seedance_request.json | jq -r '.id'
```

### 2. Text-to-Video (Fast — 720p, lower cost)

Write to `/tmp/seedance_request.json`:

```json
{
  "model": "dreamina-seedance-2-0-fast-260128",
  "content": [
    { "type": "text", "text": "A timelapse of clouds rolling over mountain peaks, epic wide angle" }
  ],
  "resolution": "720p",
  "ratio": "16:9",
  "duration": 5
}
```

```bash
curl -s -X POST "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks" --header "Authorization: Bearer $SEEDANCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/seedance_request.json | jq -r '.id'
```

### 3. Poll for Task Status

Replace `<task-id>` with the ID returned from the create call above.

```bash
curl -s "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks/<task-id>" --header "Authorization: Bearer $SEEDANCE_TOKEN" | jq '{status: .status, video_url: .content.video_url, duration: .duration, resolution: .resolution}'
```

Poll until `status` is `succeeded`. Terminal states: `succeeded`, `failed`, `expired`, `cancelled`.

### 4. Image-to-Video (Animate a First Frame)

Write to `/tmp/seedance_request.json`:

```json
{
  "model": "dreamina-seedance-2-0-260128",
  "content": [
    {
      "type": "image_url",
      "image_url": { "url": "https://example.com/your-image.jpg" },
      "role": "first_frame"
    },
    { "type": "text", "text": "The camera slowly zooms in on the subject" }
  ],
  "resolution": "1080p",
  "ratio": "16:9",
  "duration": 5
}
```

```bash
curl -s -X POST "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks" --header "Authorization: Bearer $SEEDANCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/seedance_request.json | jq -r '.id'
```

### 5. Reference-to-Video (Character/Style Reference)

Write to `/tmp/seedance_request.json`:

```json
{
  "model": "dreamina-seedance-2-0-260128",
  "content": [
    {
      "type": "image_url",
      "image_url": { "url": "https://example.com/character.jpg" },
      "role": "reference_image"
    },
    { "type": "text", "text": "The character walks forward confidently in an urban environment" }
  ],
  "resolution": "1080p",
  "ratio": "9:16",
  "duration": 5
}
```

```bash
curl -s -X POST "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks" --header "Authorization: Bearer $SEEDANCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/seedance_request.json | jq -r '.id'
```

### 6. Download Generated Video

Replace `<video-url>` with the `content.video_url` from the completed task.

```bash
curl -sL "<video-url>" -o /tmp/seedance_output.mp4
```

## Model Reference

| Model ID | Tier | Max Resolution | Duration |
|---|---|---|---|
| `dreamina-seedance-2-0-260128` | Standard | 1080p | 4–15s or `-1` (smart) |
| `dreamina-seedance-2-0-fast-260128` | Fast | 720p | 4–15s or `-1` (smart) |

## Key Parameters

| Parameter | Values | Default | Description |
|---|---|---|---|
| `resolution` | `480p`, `720p`, `1080p` | `720p` | Output resolution |
| `ratio` | `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `21:9`, `adaptive` | `adaptive` | Aspect ratio |
| `duration` | `4`–`15` or `-1` | `5` | Duration in seconds; `-1` = smart auto |
| `generate_audio` | `true`/`false` | `true` | Include AI-generated audio |
| `seed` | integer | `-1` | Fixed seed for reproducibility; `-1` = random |
| `watermark` | `true`/`false` | `false` | Add watermark to output |
| `return_last_frame` | `true`/`false` | `false` | Also return the last frame as a PNG URL |

## Image Role Values

| Role | Description |
|---|---|
| `first_frame` | Image used as the first frame of the video |
| `last_frame` | Image used as the last frame of the video |
| `reference_image` | Character/style reference (up to 9 images) |
| `reference_video` | Video style reference (up to 3 videos, URL only — no Base64) |
| `reference_audio` | Audio reference (up to 3 clips) |

## Guidelines

1. **Video URLs expire in 24 hours** — download immediately after `status: succeeded`
2. **Async flow** — always poll GET after POST; do not re-submit the same task
3. **Rate limits** — 3 concurrent tasks and 180 RPM for individual accounts
4. **Image input** — supports public URLs or Base64 (`data:image/jpeg;base64,...`); video input is URL only
5. **No flex tier** — Seedance only supports `service_tier: "default"`
6. **Task records expire** — task IDs are deleted after 7 days
