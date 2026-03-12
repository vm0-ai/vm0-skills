---
name: hume
description: Hume AI API for emotion analysis. Use when user mentions "Hume", "emotion
  AI", "sentiment analysis", or voice emotion detection.
vm0_secrets:
  - HUME_TOKEN
---

# Hume AI API

Analyze emotions in text, audio, and video, generate expressive text-to-speech, and build speech-to-speech conversational agents via Hume's REST API.

> Official docs: https://dev.hume.ai/reference

---

## When to Use

Use this skill when you need to:

- Analyze emotions and expressions in text, audio, images, or video (batch processing)
- Generate expressive text-to-speech audio with emotional control
- Manage EVI (Empathic Voice Interface) configurations, prompts, and tools
- Retrieve chat transcripts and events from EVI conversations

---

## Prerequisites

1. Sign up at https://app.hume.ai
2. Navigate to the [API Keys page](https://app.hume.ai/keys)
3. Copy your API key

Set environment variable:

```bash
export HUME_TOKEN="your-api-key"
```

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `{curly-braces}` like `{job-id}` are placeholders. Replace them with actual values when executing.

---

## Expression Measurement (Batch)

### Start Inference Job from URLs

Write to `/tmp/hume_request.json`:

```json
{
  "urls": ["https://example.com/media-file.mp4"],
  "models": {
    "face": {},
    "prosody": {},
    "language": {}
  },
  "notify": true
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/batch/jobs" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

### Start Inference Job with Text

Write to `/tmp/hume_request.json`:

```json
{
  "text": ["I am so excited about this!", "This is really disappointing."],
  "models": {
    "language": {}
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/batch/jobs" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

### List Jobs

```bash
bash -c 'curl -s "https://api.hume.ai/v0/batch/jobs?limit=10" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### List Jobs by Status

```bash
bash -c 'curl -s "https://api.hume.ai/v0/batch/jobs?limit=10&status=COMPLETED" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### Get Job Details

```bash
bash -c 'curl -s "https://api.hume.ai/v0/batch/jobs/{job-id}" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### Get Job Predictions

```bash
bash -c 'curl -s "https://api.hume.ai/v0/batch/jobs/{job-id}/predictions" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### Download Job Artifacts

```bash
bash -c 'curl -s "https://api.hume.ai/v0/batch/jobs/{job-id}/artifacts" --header "X-Hume-Api-Key: $HUME_TOKEN" --output /tmp/hume_artifacts.zip'
```

---

## Text-to-Speech

### Synthesize Speech (JSON Response)

Write to `/tmp/hume_request.json`:

```json
{
  "utterances": [
    {
      "text": "Hello, how are you today?",
      "description": "A warm and friendly greeting"
    }
  ],
  "format": {
    "type": "mp3"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/tts" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

The response contains base64-encoded audio in `.generations[].audio`.

### Synthesize Speech with Specific Voice

Write to `/tmp/hume_request.json`:

```json
{
  "utterances": [
    {
      "text": "Welcome to our platform!",
      "speed": 1.0
    }
  ],
  "voice": {
    "name": "{voice-name}"
  },
  "format": {
    "type": "mp3"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/tts" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

### Synthesize and Save Audio File

Write to `/tmp/hume_request.json`:

```json
{
  "utterances": [
    {
      "text": "This is a test of text-to-speech synthesis."
    }
  ],
  "format": {
    "type": "mp3"
  }
}
```

Then extract and decode the audio:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/tts" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq -r '.generations[0].audio' | base64 -d > /tmp/hume_output.mp3
```

### Synthesize Multiple Utterances

Write to `/tmp/hume_request.json`:

```json
{
  "utterances": [
    {
      "text": "First sentence.",
      "description": "calm and measured"
    },
    {
      "text": "Second sentence!",
      "description": "excited and energetic",
      "trailing_silence": 0.5
    }
  ],
  "format": {
    "type": "mp3"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/tts" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

---

## EVI Configs

### List Configs

```bash
bash -c 'curl -s "https://api.hume.ai/v0/evi/configs?page_size=20" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### Create Config

Write to `/tmp/hume_request.json`:

```json
{
  "name": "My EVI Config"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/evi/configs" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

---

## EVI Prompts

### List Prompts

```bash
bash -c 'curl -s "https://api.hume.ai/v0/evi/prompts?page_size=20" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

### Create Prompt

Write to `/tmp/hume_request.json`:

```json
{
  "name": "Customer Support Agent",
  "text": "You are a friendly and empathetic customer support agent. Listen carefully and help resolve issues."
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.hume.ai/v0/evi/prompts" --header "Content-Type: application/json" --header "X-Hume-Api-Key: $HUME_TOKEN" -d @/tmp/hume_request.json' | jq .
```

---

## EVI Chats

### List Chat Events

```bash
bash -c 'curl -s "https://api.hume.ai/v0/evi/chats/{chat-id}?page_size=50&ascending_order=true" --header "X-Hume-Api-Key: $HUME_TOKEN"' | jq .
```

---

## Available Models for Expression Measurement

| Model | Description |
|-------|-------------|
| `face` | Facial expression analysis from images/video |
| `prosody` | Vocal expression analysis from audio |
| `language` | Emotion analysis from text |
| `ner` | Named entity recognition from text |
| `burst` | Non-speech vocal sounds (laughter, sighs) |
| `facemesh` | Detailed facial landmark detection |

---

## TTS Utterance Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | string | Content to convert to speech (required) |
| `description` | string | Acting directions or voice style prompt |
| `speed` | number | Speech rate multiplier (default: 1.0) |
| `trailing_silence` | number | Silence after utterance in seconds (default: 0) |

---

## Response Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `201` | Resource created |
| `400` | Invalid request parameters |
| `401` | Missing or invalid API key |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `5xx` | Server error |

---

## Guidelines

1. **Authentication**: Use `X-Hume-Api-Key` header (not Bearer token) for all requests
2. **Batch Jobs**: Jobs are asynchronous; poll the job details endpoint until status is `COMPLETED`
3. **Models**: Specify only the models you need in batch requests to reduce processing time
4. **TTS Description**: Use the `description` field to control emotional tone and style of generated speech
5. **Pagination**: EVI endpoints use zero-based page numbering with configurable page size (1-100)
6. **API Key Types**: Organization API Key for TTS and EVI; Personal API Key for Expression Measurement

---

## API Reference

- Documentation: https://dev.hume.ai/reference
- Portal: https://app.hume.ai
- API Keys: https://app.hume.ai/keys
