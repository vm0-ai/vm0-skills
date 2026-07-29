---
name: joggai
description: JoggAI API v2 for AI avatar videos, product videos, lip sync,
  script generation, and video translation. Use when user mentions "JoggAI",
  "Jogg", avatar video generation, product-to-video, or JoggAI automation.
---

# JoggAI

Use JoggAI API v2 to create and track AI-generated videos, discover avatars and
voices, generate scripts, and configure webhooks.

> Official docs: `https://docs.jogg.ai/api-reference/v2/QuickStart/GettingStarted`

---

## When to Use

Use this skill when you need to:

- Create talking-avatar videos from a script or audio source
- Generate product videos from product URLs or structured product details
- Create lip-sync or translated-video tasks
- Discover JoggAI avatars, voices, templates, and visual styles
- Generate AI scripts and monitor asynchronous generation tasks
- Configure webhooks for video-generation events

---

## Prerequisites

Connect the **JoggAI** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name JOGGAI_TOKEN` or `zero doctor check-connector --url https://api.jogg.ai/v2/user/whoami --method GET`

---

## Authentication

JoggAI uses an API key in the `x-api-key` request header:

```text
x-api-key: $JOGGAI_TOKEN
```

Base URL: `https://api.jogg.ai`

---

## How to Use

### 1. Verify the Account and Quota

Get the authenticated account:

```bash
curl -s "https://api.jogg.ai/v2/user/whoami" --header "x-api-key: $JOGGAI_TOKEN"
```

Get the remaining API quota:

```bash
curl -s "https://api.jogg.ai/v2/user/remaining_quota" --header "x-api-key: $JOGGAI_TOKEN"
```

### 2. Discover Avatars and Voices

List public portrait avatars:

```bash
curl -s "https://api.jogg.ai/v2/avatars/public?page=1&page_size=20&aspect_ratio=portrait" --header "x-api-key: $JOGGAI_TOKEN"
```

List public English voices:

```bash
curl -s "https://api.jogg.ai/v2/voices?page=1&page_size=20&language=english" --header "x-api-key: $JOGGAI_TOKEN"
```

Copy an avatar `id` and a `voice_id` from these responses before creating a
talking-avatar video.

### 3. Create a Talking-Avatar Video

This operation consumes JoggAI credits. Confirm the script, avatar, voice,
aspect ratio, and caption choice before running it.

Replace the complete quoted `<avatar-id>` value with a numeric avatar ID
without quotes, and replace `<voice-id>` with a voice ID. Write to
`/tmp/joggai_avatar_video.json`:

```json
{
  "avatar": {
    "avatar_type": 0,
    "avatar_id": "<avatar-id>"
  },
  "voice": {
    "type": "script",
    "voice_id": "<voice-id>",
    "script": "Welcome to our product overview."
  },
  "aspect_ratio": "portrait",
  "screen_style": 1,
  "caption": true,
  "video_name": "Product overview"
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/create_video_from_avatar" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_avatar_video.json
```

The response returns `data.video_id`.

### 4. Check a Talking-Avatar Video

Replace `<video-id>` with the video ID returned by the creation request:

```bash
curl -s "https://api.jogg.ai/v2/avatar_video/<video-id>" --header "x-api-key: $JOGGAI_TOKEN"
```

Wait for `data.status` to become `completed`. The completed response includes
`video_url` and `cover_url`. Stop polling if the status becomes `failed`.

### 5. Create and Check a Lip-Sync Video

This operation consumes credits. Confirm both source URLs before running it.
Write to `/tmp/joggai_lip_sync.json`:

```json
{
  "video_url": "https://example.com/source-video.mp4",
  "audio_url": "https://example.com/source-audio.wav",
  "playback_type": "normal"
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/create_lip_sync_video" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_lip_sync.json
```

The response returns `data.task_id`. Replace `<task-id>` with that value:

```bash
curl -s "https://api.jogg.ai/v2/lip_sync_video/<task-id>" --header "x-api-key: $JOGGAI_TOKEN"
```

### 6. Generate an AI Script

Script generation is asynchronous and consumes quota. Confirm the product
details, target audience, style, language, and requested duration first. Write
to `/tmp/joggai_script.json`:

```json
{
  "language": "english",
  "video_length_seconds": "30",
  "script_style": "Storytime",
  "product_info": {
    "source_type": "details",
    "data": {
      "name": "Insulated water bottle",
      "description": "A reusable bottle that keeps drinks cold throughout the day."
    }
  },
  "target_audience": "Outdoor enthusiasts"
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/ai_scripts" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_script.json
```

The response returns `data.task_id`. Replace `<task-id>` with that value:

```bash
curl -s "https://api.jogg.ai/v2/ai_scripts/results/<task-id>" --header "x-api-key: $JOGGAI_TOKEN"
```

When `data.status` is `completed`, read
`data.data.generated_scripts[].script_paragraphs`.

### 7. Create a Product from a URL

Product creation analyzes the supplied URL. Confirm that the URL is public and
contains the intended product before running it. Write to
`/tmp/joggai_product.json`:

```json
{
  "url": "https://example.com/products/example-product"
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/product" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_product.json
```

Copy the returned product ID before creating a product video.

### 8. Create and Check a Product Video

First list public avatars, voices, visual styles, and background music to obtain
valid IDs:

```bash
curl -s "https://api.jogg.ai/v2/visual_styles?aspect_ratio=portrait" --header "x-api-key: $JOGGAI_TOKEN"
```

```bash
curl -s "https://api.jogg.ai/v2/musics?page=1&page_size=20" --header "x-api-key: $JOGGAI_TOKEN"
```

Creating a product video consumes credits. Confirm every selected value before
running it. Replace each `<...>` placeholder with the corresponding value. For
`<avatar-id>` and `<music-id>`, replace the complete quoted placeholder with a
JSON integer without quotes. Write to `/tmp/joggai_product_video.json`:

```json
{
  "product_id": "<product-id>",
  "visual_style": "<visual-style-name>",
  "video_spec": {
    "aspect_ratio": "portrait",
    "length": "30",
    "caption": true,
    "name": "Product video"
  },
  "avatar": {
    "id": "<avatar-id>",
    "type": 0
  },
  "voice": {
    "id": "<voice-id>"
  },
  "audio": {
    "music_id": "<music-id>"
  },
  "script": {
    "style": "Storytime",
    "language": "english"
  }
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/create_video_from_product" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_product_video.json
```

Replace `<product-video-id>` with the returned `data.video_id`:

```bash
curl -s "https://api.jogg.ai/v2/product_video/<product-video-id>" --header "x-api-key: $JOGGAI_TOKEN"
```

### 9. Translate a Video

This operation consumes credits. Use the target-languages endpoint before
selecting `output_language`:

```bash
curl -s "https://api.jogg.ai/v2/video_translate/target_languages" --header "x-api-key: $JOGGAI_TOKEN"
```

Write to `/tmp/joggai_translate.json`:

```json
{
  "video_url": "https://example.com/source-video.mp4",
  "output_language": "spanish",
  "title": "Spanish product video",
  "translate_audio_only": false,
  "add_subtitles": true
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/video_translate/" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_translate.json
```

Replace `<translation-id>` with the returned `data.video_translate_id`:

```bash
curl -s "https://api.jogg.ai/v2/video_translate/<translation-id>" --header "x-api-key: $JOGGAI_TOKEN"
```

### 10. List or Add Webhook Endpoints

List configured webhook endpoints:

```bash
curl -s "https://api.jogg.ai/v2/endpoints" --header "x-api-key: $JOGGAI_TOKEN"
```

Before adding a webhook, confirm the HTTPS destination and subscribed event
types. Use the events endpoint to discover valid event names:

```bash
curl -s "https://api.jogg.ai/v2/events" --header "x-api-key: $JOGGAI_TOKEN"
```

Write to `/tmp/joggai_webhook.json`:

```json
{
  "url": "https://example.com/webhooks/joggai",
  "status": "enabled",
  "events": [
    "generated_avatar_video_success",
    "generated_avatar_video_failed"
  ]
}
```

```bash
curl -s -X POST "https://api.jogg.ai/v2/endpoint" --header "x-api-key: $JOGGAI_TOKEN" --header "Content-Type: application/json" -d @/tmp/joggai_webhook.json
```

---

## Guidelines

1. **Check both HTTP and API status**: JoggAI responses include a top-level `code` and `msg`; an HTTP response alone does not prove the operation succeeded.
2. **Treat generation as asynchronous**: Creation endpoints return video or task IDs. Poll the matching status endpoint with a reasonable delay, or use webhooks.
3. **Confirm credit-consuming operations**: Video, lip-sync, translation, and script generation can deduct quota. Check remaining quota before large jobs.
4. **Use discovered IDs**: Retrieve current avatar, voice, music, template, language, and visual-style values instead of assuming examples remain available.
5. **Respect plan limits**: JoggAI rate limits and API access depend on the subscription plan. Back off on rate-limit responses.
6. **Protect the API key**: Send `JOGGAI_TOKEN` only to `https://api.jogg.ai` through the `x-api-key` header.
7. **Use HTTPS webhooks**: Validate webhook event names through `/v2/events` and verify webhook signatures before processing events.

## API Reference

- OpenAPI v2: `https://docs.jogg.ai/api-reference/v2/openapi-v2.yaml`
- Getting started: `https://docs.jogg.ai/api-reference/v2/QuickStart/GettingStarted`
- Rate limits: `https://docs.jogg.ai/api-reference/v2/QuickStart/RateLimits`
- Error handling: `https://docs.jogg.ai/api-reference/v2/QuickStart/ErrorHandling`
