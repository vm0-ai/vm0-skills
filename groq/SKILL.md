---
name: groq
description: >
  Groq ultra-fast LLM inference (LPU engine). Use when the user mentions
  "Groq", "llama on Groq", or asks for fast inference with Llama, Mixtral,
  or Gemma models.
---

# Groq

Groq provides ultra-fast LLM inference using its custom LPU (Language Processing Unit) hardware. The API is fully OpenAI-compatible, so any workflow that works against `api.openai.com` can be pointed at `api.groq.com/openai/v1` with minimal changes.

> Official docs: `https://console.groq.com/docs/overview`

---

## When to Use

Use this skill when you need to:

- Run chat completions at extremely low latency (Groq LPU is significantly faster than GPU-based inference)
- Use open-weight models such as Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, or Gemma 2 9B
- Transcribe audio using Whisper via an OpenAI-compatible endpoint
- List available models on Groq's platform
- Drop in a fast, cost-effective inference backend where OpenAI compatibility is assumed

---

## Prerequisites

Connect the **Groq** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name GROQ_API_KEY` or `zero doctor check-connector --url https://api.groq.com/openai/v1/models --method GET`

---

## How to Use

All examples below assume you have `GROQ_API_KEY` set via the Groq connector.

Base URL: `https://api.groq.com/openai/v1`

### 1. Basic Chat Completion

Write to `/tmp/groq_request.json`:

```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [{"role": "user", "content": "Explain LPU inference in one paragraph."}]
}
```

Then run:

```bash
curl -s "https://api.groq.com/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $GROQ_API_KEY" -d @/tmp/groq_request.json | jq '.choices[0].message.content'
```

**Key models:**

- `llama-3.3-70b-versatile` — Llama 3.3 70B; best quality, still very fast
- `llama-3.1-8b-instant` — Llama 3.1 8B; lowest latency
- `mixtral-8x7b-32768` — Mixtral 8x7B with 32K context
- `gemma2-9b-it` — Google Gemma 2 9B instruct
- `whisper-large-v3` — Audio transcription (see section 4)

### 2. Chat Completion with System Prompt

Write to `/tmp/groq_request.json`:

```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {"role": "system", "content": "You are a concise technical assistant. Reply in JSON only."},
    {"role": "user", "content": "List the top 3 use cases for LPU-based inference."}
  ]
}
```

Then run:

```bash
curl -s "https://api.groq.com/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $GROQ_API_KEY" -d @/tmp/groq_request.json | jq '.choices[0].message.content'
```

### 3. Streaming Chat Completion

For real-time token output, set `stream: true`. The response is Server-Sent Events (SSE).

Write to `/tmp/groq_request.json`:

```json
{
  "model": "llama-3.1-8b-instant",
  "messages": [{"role": "user", "content": "Write a haiku about fast inference."}],
  "stream": true
}
```

Then run:

```bash
curl -s "https://api.groq.com/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $GROQ_API_KEY" -d @/tmp/groq_request.json
```

Each SSE chunk is a `data: {...}` line with a `delta.content` field. The stream ends with `data: [DONE]`.

### 4. Audio Transcription (Whisper)

Transcribe audio files using Groq's hosted `whisper-large-v3` model.

```bash
curl -s "https://api.groq.com/openai/v1/audio/transcriptions" --header "Authorization: Bearer $GROQ_API_KEY" -F "file=@audio.mp3" -F "model=whisper-large-v3" | jq '.text'
```

Supported formats: `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm` (max 25 MB per file).

> **Note:** The `vtt` and `srt` response formats are not supported by Groq — use the default `json` format.

### 5. List Available Models

Retrieve all models currently available on the Groq platform:

```bash
curl -s "https://api.groq.com/openai/v1/models" --header "Authorization: Bearer $GROQ_API_KEY" | jq -r '.data[].id' | sort
```

### 6. Check Token Usage

Token usage is returned in every non-streaming chat completion response:

Write to `/tmp/groq_request.json`:

```json
{
  "model": "llama-3.1-8b-instant",
  "messages": [{"role": "user", "content": "Hi!"}]
}
```

Then run:

```bash
curl -s "https://api.groq.com/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $GROQ_API_KEY" -d @/tmp/groq_request.json | jq '.usage'
```

Response includes `prompt_tokens`, `completion_tokens`, and `total_tokens`.

---

## Guidelines

1. **Pick the right model for the job**: Use `llama-3.3-70b-versatile` for quality-first tasks; use `llama-3.1-8b-instant` when latency or cost is the priority
2. **Groq is OpenAI-compatible**: Any skill or code targeting `api.openai.com/v1` can be redirected to `api.groq.com/openai/v1` — just swap the base URL and API key
3. **Streaming is the default expectation on Groq**: Because inference is so fast, streaming responses are common; handle SSE with a plain curl call and parse `data:` lines
4. **Watch unsupported parameters**: `logprobs`, `logit_bias`, `top_logprobs`, and `messages[].name` are not supported; omit them to avoid errors
5. **Temperature 0 is not allowed**: If you need deterministic output, use a very small positive value such as `0.01`
6. **Audio format restrictions**: Whisper on Groq does not support `vtt` or `srt` output formats; use the default `json` response format
7. **Check the model list regularly**: Groq adds and retires models; always confirm the model ID with `GET /openai/v1/models` before coding against a specific model
