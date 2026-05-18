---
name: suno
description: Suno API for generating AI music tracks, vocals, instrumentals, and lyrics from a text prompt. Use when user mentions "Suno", "generate music", "AI song", "make a track", or "compose audio".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SUNO_TOKEN` or `zero doctor check-connector --url https://api.sunoapi.org/api/v1/generate --method POST`.

## How to Use

Suno (via sunoapi.org) authenticates with a Bearer token. The base URL
is `https://api.sunoapi.org`. Generation is asynchronous: kick off a
job, then poll until it returns audio URLs.

### 1. Generate a song from a prompt

Write to `/tmp/suno_request.json`:

```json
{
  "prompt": "A calm lo-fi study beat with mellow piano and soft drums",
  "customMode": false,
  "instrumental": false,
  "model": "V4"
}
```

Then run:

```bash
curl -s -X POST "https://api.sunoapi.org/api/v1/generate" \
  -H "Authorization: Bearer $SUNO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/suno_request.json
```

The response contains a `taskId` — keep it for polling.

### 2. Generate with custom lyrics + style

Write to `/tmp/suno_request.json`:

```json
{
  "prompt": "Verse: I built an agent that ships code at 3 AM\nChorus: Zero, Zero, watch it go",
  "style": "indie folk, acoustic guitar",
  "title": "Zero Agent Ballad",
  "customMode": true,
  "instrumental": false,
  "model": "V4"
}
```

Then run:

```bash
curl -s -X POST "https://api.sunoapi.org/api/v1/generate" \
  -H "Authorization: Bearer $SUNO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/suno_request.json
```

### 3. Poll for the result

```bash
curl -s -G "https://api.sunoapi.org/api/v1/generate/record-info" \
  --data-urlencode "taskId=$TASK_ID" \
  -H "Authorization: Bearer $SUNO_TOKEN"
```

When `status` is `SUCCESS`, the response includes `audio_url` (mp3) and
`video_url` (mp4).

### 4. Generate instrumental only

Set `instrumental: true` in the request body.

### 5. Extend an existing song

Write to `/tmp/suno_request.json`:

```json
{
  "audioId": "<id from a previous generation>",
  "continueAt": 60,
  "prompt": "Build to a triumphant bridge with strings",
  "model": "V4"
}
```

Then run:

```bash
curl -s -X POST "https://api.sunoapi.org/api/v1/generate/extend" \
  -H "Authorization: Bearer $SUNO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/suno_request.json
```

## Guidelines

1. **Always poll** — generation takes 30-90 seconds; do not wait synchronously.
2. **Model selection** — `V4` is the latest; older models (`V3_5`, `V3`) cost fewer credits.
3. **`customMode`** — when `true`, both `prompt` (lyrics) and `style` are required.
4. **Output is two clips** — Suno returns two variants per generation by default.
5. **Save the `audio_url` quickly** — Suno's hosted URLs expire; download and re-host if you need persistence.
