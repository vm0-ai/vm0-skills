---
name: heygen
description: HeyGen API for AI video avatars. Use when user mentions "HeyGen", "AI
  avatar", "video avatar", or "AI presenter".
vm0_secrets:
  - HEYGEN_TOKEN
---

# HeyGen API

Use the HeyGen API via direct `curl` calls to create **AI-generated videos** with digital avatars, text-to-speech voices, and video templates.

> Official docs: `https://docs.heygen.com/reference`

---

## When to Use

Use this skill when you need to:

- **Create AI avatar videos** from text scripts with digital presenters
- **List available avatars and voices** to choose the right presenter and narration
- **Generate videos from templates** with variable substitution
- **Translate videos** into 175+ languages with natural voice dubbing
- **Check video generation status** and retrieve completed video URLs

---

## Prerequisites

1. Sign up at [HeyGen](https://www.heygen.com/) and create an account
2. Go to your account settings and generate an API key
3. Store your API key in the environment variable `HEYGEN_TOKEN`

```bash
export HEYGEN_TOKEN="your-heygen-api-key"
```

### API Limits

- API key is passed via the `x-api-key` header
- Video generation consumes API credits based on duration
- Generated video URLs expire after 7 days

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "x-api-key: $API_KEY"' | jq .
> ```

## How to Use

All examples below assume you have `HEYGEN_TOKEN` set.

The base URL for the HeyGen API is:

- v1 endpoints: `https://api.heygen.com/v1`
- v2 endpoints: `https://api.heygen.com/v2`

---

### 1. List Available Avatars

Get all avatars available to your account:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/avatars" --header "x-api-key: $HEYGEN_TOKEN"' | jq '.data.avatars[] | {avatar_id, avatar_name, gender}'
```

Each avatar has an `avatar_id` needed for video generation.

---

### 2. Get Avatar Details

Retrieve detailed information about a specific avatar. Replace `<avatar_id>` with an actual avatar ID:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/avatar/<avatar_id>/details" --header "x-api-key: $HEYGEN_TOKEN"' | jq .data
```

---

### 3. List Available Voices

Get all AI voices for video narration:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/voices" --header "x-api-key: $HEYGEN_TOKEN"' | jq '.data.voices[] | {voice_id, name, language, gender}'
```

Voice properties include:
- `voice_id`: Unique identifier for use in video generation
- `language`: Primary language (e.g., "English", "Multilingual")
- `gender`: "female", "male", or "unknown"
- `emotion_support`: Whether the voice supports emotion variations

---

### 4. Create an Avatar Video

Generate a video with an AI avatar presenter. Replace `<avatar_id>` and `<voice_id>` with actual IDs from the list endpoints.

Write to `/tmp/heygen_request.json`:

```json
{
  "video_inputs": [
    {
      "character": {
        "type": "avatar",
        "avatar_id": "<avatar_id>",
        "avatar_style": "normal"
      },
      "voice": {
        "type": "text",
        "input_text": "Hello! Welcome to our product demo. Let me walk you through the key features.",
        "voice_id": "<voice_id>",
        "speed": 1.0
      },
      "background": {
        "type": "color",
        "value": "#FFFFFF"
      }
    }
  ],
  "dimension": {
    "width": 1920,
    "height": 1080
  },
  "title": "Product Demo Video"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.heygen.com/v2/video/generate" --header "x-api-key: $HEYGEN_TOKEN" --header "Content-Type: application/json" -d @/tmp/heygen_request.json' | jq .
```

The response contains a `video_id` to track the generation progress.

---

### 5. Check Video Status

Poll for video generation status using the `video_id` from the generate response. Replace `<video_id>` with the actual video ID:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v1/video_status.get?video_id=<video_id>" --header "x-api-key: $HEYGEN_TOKEN"' | jq '{status: .data.status, video_url: .data.video_url, duration: .data.duration}'
```

Status values:
- `pending`: Video is queued
- `processing`: Video is being rendered
- `completed`: Video is ready (includes `video_url`)
- `failed`: Generation failed (includes error details)

---

### 6. List Videos

Retrieve all videos associated with your account:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v1/video.list" --header "x-api-key: $HEYGEN_TOKEN"' | jq .
```

---

### 7. Delete a Video

Remove a video from your account. Replace `<video_id>` with the actual video ID:

```bash
bash -c 'curl -s -X DELETE "https://api.heygen.com/v1/video.delete" --header "x-api-key: $HEYGEN_TOKEN" --header "Content-Type: application/json" -d '"'"'{"video_id": "<video_id>"}'"'"'' | jq .
```

---

### 8. List Templates

Get all video templates created in your account:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/templates" --header "x-api-key: $HEYGEN_TOKEN"' | jq .data
```

---

### 9. Get Template Details

Retrieve a template configuration and its variables. Replace `<template_id>` with the actual template ID:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/template/<template_id>" --header "x-api-key: $HEYGEN_TOKEN"' | jq .data
```

---

### 10. Generate Video from Template

Create a video using a template with variable substitution. Replace `<template_id>` and variable keys with actual values from the template details.

Write to `/tmp/heygen_request.json`:

```json
{
  "caption": false,
  "title": "Video from Template",
  "variables": {
    "script": {
      "name": "script",
      "type": "text",
      "properties": {
        "content": "Your custom script text goes here."
      }
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.heygen.com/v2/template/<template_id>/generate" --header "x-api-key: $HEYGEN_TOKEN" --header "Content-Type: application/json" -d @/tmp/heygen_request.json' | jq .
```

---

### 11. Translate a Video

Translate an existing video into another language. Replace `<video_url>` and `<language>` with actual values:

Write to `/tmp/heygen_request.json`:

```json
{
  "video_url": "<video_url>",
  "output_language": "<language>",
  "title": "Translated Video"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.heygen.com/v2/video_translate" --header "x-api-key: $HEYGEN_TOKEN" --header "Content-Type: application/json" -d @/tmp/heygen_request.json' | jq .
```

---

### 12. List Supported Translation Languages

Get all languages available for video translation:

```bash
bash -c 'curl -s -X GET "https://api.heygen.com/v2/video_translate/target_languages" --header "x-api-key: $HEYGEN_TOKEN"' | jq .data
```

---

### 13. Share a Video

Generate a public sharing URL for a video. Replace `<video_id>` with the actual video ID:

```bash
bash -c 'curl -s -X POST "https://api.heygen.com/v1/video/share" --header "x-api-key: $HEYGEN_TOKEN" --header "Content-Type: application/json" -d '"'"'{"video_id": "<video_id>"}'"'"'' | jq .
```

---

## Guidelines

1. **Poll for completion**: Video generation is asynchronous. After calling the generate endpoint, poll `video_status.get` until status is `completed` or `failed`
2. **Download promptly**: Video and thumbnail URLs expire after 7 days
3. **Use templates for consistency**: Create templates in the HeyGen dashboard and use the template generate endpoint for repeatable video production
4. **Choose appropriate avatars**: List avatars first to find one matching your use case, then get details for supported styles
5. **Monitor credits**: Video generation consumes API credits based on video duration
6. **Use JSON files for complex bodies**: Write request bodies to `/tmp/heygen_request.json` to avoid shell quoting issues
