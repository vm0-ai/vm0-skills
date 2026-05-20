---
name: novita
description: Novita AI API for LLM inference, image generation, and video generation. Use
  when the user mentions "Novita", "Novita AI", "novita.ai", or wants to run open models
  (DeepSeek, Llama, Qwen) or generate images and videos through an OpenAI-compatible API.
---

# Novita AI

Novita AI is a cloud platform for running open foundation models and serverless
GPU workloads. Its LLM API is OpenAI-compatible, so any SDK or workflow built for
OpenAI's `/v1/` endpoints works by changing the base URL and API key. Image and
video generation use Novita's native asynchronous task API.

> Official docs: `https://novita.ai/docs/api-reference`

---

## When to Use

Use this skill when you need to:

- Run open LLMs (DeepSeek, Llama, Qwen, Mistral, etc.) via an OpenAI-compatible API
- Generate images from text prompts with Stable Diffusion or FLUX models
- Generate videos from text or image prompts
- List the models available on the Novita AI platform

---

## Prerequisites

Connect the **Novita AI** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name NOVITA_TOKEN` or `zero doctor check-connector --url https://api.novita.ai/openai/v1/models --method GET`

---

## How to Use

### 1. Chat Completion (OpenAI-compatible)

Write to `/tmp/novita_chat.json`:

```json
{
  "model": "deepseek/deepseek-v3-0324",
  "messages": [{"role": "user", "content": "Explain quantum entanglement in one paragraph."}],
  "max_tokens": 512
}
```

Then run:

```bash
curl -s "https://api.novita.ai/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $NOVITA_TOKEN" -d @/tmp/novita_chat.json | jq '.choices[0].message.content'
```

**Popular chat models:**

- `deepseek/deepseek-v3-0324` — DeepSeek V3, strong general reasoning
- `deepseek/deepseek-r1-turbo` — DeepSeek R1, fast reasoning variant
- `meta-llama/llama-3.3-70b-instruct` — Llama 3.3 70B
- `qwen/qwen-2.5-72b-instruct` — Qwen 2.5 72B
- `mistralai/mistral-nemo` — Mistral Nemo, lightweight

### 2. Chat with System Prompt

Write to `/tmp/novita_chat.json`:

```json
{
  "model": "deepseek/deepseek-v3-0324",
  "messages": [
    {"role": "system", "content": "You are a concise technical assistant. Respond in JSON."},
    {"role": "user", "content": "List three uses of embeddings in NLP."}
  ],
  "max_tokens": 256
}
```

Then run:

```bash
curl -s "https://api.novita.ai/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $NOVITA_TOKEN" -d @/tmp/novita_chat.json | jq '.choices[0].message.content'
```

### 3. Streaming Response

Write to `/tmp/novita_stream.json`:

```json
{
  "model": "deepseek/deepseek-v3-0324",
  "messages": [{"role": "user", "content": "Write a haiku about open-source AI."}],
  "stream": true,
  "max_tokens": 128
}
```

Then run:

```bash
curl -s "https://api.novita.ai/openai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $NOVITA_TOKEN" -d @/tmp/novita_stream.json
```

Streaming returns Server-Sent Events with delta chunks.

### 4. List Available Models

```bash
curl -s "https://api.novita.ai/openai/v1/models" --header "Authorization: Bearer $NOVITA_TOKEN" | jq '[.data[].id]'
```

### 5. Text-to-Image Generation

Image generation is asynchronous: the request returns a `task_id`, then you poll
for the result.

Write to `/tmp/novita_txt2img.json`:

```json
{
  "extra": {
    "response_image_type": "jpeg"
  },
  "request": {
    "prompt": "a photorealistic mountain lake at sunset, golden light reflecting on water",
    "model_name": "sd_xl_base_1.0.safetensors",
    "negative_prompt": "blurry, low quality, distorted",
    "width": 1024,
    "height": 1024,
    "image_num": 1,
    "steps": 20,
    "seed": -1,
    "sampler_name": "Euler a",
    "guidance_scale": 7.5
  }
}
```

Submit the task:

```bash
curl -s -X POST "https://api.novita.ai/v3/async/txt2img" --header "Content-Type: application/json" --header "Authorization: Bearer $NOVITA_TOKEN" -d @/tmp/novita_txt2img.json | jq '.task_id'
```

Poll for the result. Replace `<task-id>` with the `task_id` from the response above:

```bash
curl -s "https://api.novita.ai/v3/async/task-result?task_id=<task-id>" --header "Authorization: Bearer $NOVITA_TOKEN" | jq '{status: .task.status, images: [.images[].image_url]}'
```

When `task.status` is `TASK_STATUS_SUCCEED`, the `images` array holds the output URLs.

### 6. Text-to-Video Generation

Video generation uses the same async submit/poll pattern.

Write to `/tmp/novita_txt2video.json`:

```json
{
  "model_name": "wan2.1-t2v-14b",
  "width": 832,
  "height": 480,
  "steps": 20,
  "prompts": [
    {"prompt": "a paper airplane gliding over a calm ocean at dawn", "frames": 81}
  ],
  "seed": -1
}
```

Submit the task:

```bash
curl -s -X POST "https://api.novita.ai/v3/async/txt2video" --header "Content-Type: application/json" --header "Authorization: Bearer $NOVITA_TOKEN" -d @/tmp/novita_txt2video.json | jq '.task_id'
```

Poll for the result with the same `task-result` endpoint. Replace `<task-id>`:

```bash
curl -s "https://api.novita.ai/v3/async/task-result?task_id=<task-id>" --header "Authorization: Bearer $NOVITA_TOKEN" | jq '{status: .task.status, videos: [.videos[].video_url]}'
```

---

## Guidelines

1. **Two API surfaces**: LLM endpoints are OpenAI-compatible and live under `https://api.novita.ai/openai/v1/`; image and video generation use the native async API under `https://api.novita.ai/v3/async/`
2. **Async generation**: image and video tasks return a `task_id` immediately — always poll `task-result` until `task.status` is `TASK_STATUS_SUCCEED` before reading output URLs
3. **OpenAI compatibility**: `model`, `messages`, `max_tokens`, `temperature`, `stream`, and `tools` all behave as they do with OpenAI
4. **Browse models first**: model IDs change as new models launch — call the models endpoint (example 4) to confirm an exact ID before using it
5. **402 Payment Required**: this means the account is out of credits — add credits in the Novita dashboard's Billing section
