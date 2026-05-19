---
name: atlascloud
description: Atlas Cloud API for multimodal AI model inference. Use when user mentions "Atlas Cloud", "atlascloud", "multimodal models", or asks for OpenAI-compatible chat, image generation, video generation, or media upload through Atlas Cloud.
---

# Atlas Cloud

Atlas Cloud provides chat, image, video, and media generation APIs behind one API key. The chat API is OpenAI-compatible; image and video jobs are asynchronous and return a prediction ID that must be polled.

> Official docs: `https://www.atlascloud.ai/docs/en/models/get-start`

---

## When to Use

Use this skill when you need to:

- Run OpenAI-compatible chat completions through Atlas Cloud
- Generate images from text prompts
- Generate videos from text prompts or uploaded images
- Upload media for image-to-video, image editing, or other model workflows
- Poll asynchronous generation jobs until they complete

---

## Prerequisites

Connect the **Atlas Cloud** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name ATLASCLAUDE_TOKEN` or `zero doctor check-connector --url https://api.atlascloud.ai/v1/chat/completions --method POST`

---

## How to Use

Atlas Cloud uses `Authorization: Bearer $ATLASCLAUDE_TOKEN`.

### 1. Chat Completion

Write to `/tmp/atlascloud_chat.json`:

```json
{
  "model": "deepseek-v3",
  "messages": [
    { "role": "system", "content": "You are a concise assistant." },
    { "role": "user", "content": "Explain async image generation in one paragraph." }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://api.atlascloud.ai/v1/chat/completions" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" --header "Content-Type: application/json" -d @/tmp/atlascloud_chat.json | jq -r '.choices[0].message.content'
```

### 2. Streaming Chat Completion

Write to `/tmp/atlascloud_stream.json`:

```json
{
  "model": "deepseek-v3",
  "stream": true,
  "messages": [{ "role": "user", "content": "Count from 1 to 5." }]
}
```

Then run:

```bash
curl -sN -X POST "https://api.atlascloud.ai/v1/chat/completions" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" --header "Content-Type: application/json" -d @/tmp/atlascloud_stream.json
```

### 3. Generate an Image

Write to `/tmp/atlascloud_image.json`:

```json
{
  "model": "seedream-3.0",
  "prompt": "A serene Japanese garden with cherry blossoms, watercolor style"
}
```

Then run:

```bash
curl -s -X POST "https://api.atlascloud.ai/api/v1/model/generateImage" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" --header "Content-Type: application/json" -d @/tmp/atlascloud_image.json | jq '{id: .data.id, status: .data.status}'
```

Save `.data.id` as the prediction ID.

### 4. Generate a Video

Write to `/tmp/atlascloud_video.json`:

```json
{
  "model": "kling-v2.0",
  "prompt": "A rocket launching into space with dramatic lighting and smoke effects"
}
```

Then run:

```bash
curl -s -X POST "https://api.atlascloud.ai/api/v1/model/generateVideo" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" --header "Content-Type: application/json" -d @/tmp/atlascloud_video.json | jq '{id: .data.id, status: .data.status}'
```

### 5. Poll a Prediction

Replace `<prediction-id>` with the ID returned by an image or video request:

```bash
curl -s "https://api.atlascloud.ai/api/v1/model/prediction/<prediction-id>" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" | jq '{status: .data.status, outputs: .data.outputs, error: .data.error}'
```

Poll every 2-5 seconds until `status` is `completed` or `failed`.

### 6. Upload Media

Use uploaded media URLs for image-to-video or image-editing models:

```bash
curl -s -X POST "https://api.atlascloud.ai/api/v1/model/uploadMedia" --header "Authorization: Bearer $ATLASCLAUDE_TOKEN" -F "file=@/tmp/source.png" | jq -r '.url'
```

Then pass the returned URL to the model-specific request, usually as `image_url`.

---

## Guidelines

1. **Use the correct base URL**: chat completions use `https://api.atlascloud.ai/v1`; image, video, upload, and polling APIs use `https://api.atlascloud.ai/api/v1`.
2. **Treat image and video jobs as async**: always save `.data.id` and poll before using outputs.
3. **Check model pages before adding parameters**: model-specific names and parameters vary; use the Atlas Cloud model library when a request needs sizing, duration, aspect ratio, seed, LoRA, or image input options.
4. **Use short polling intervals for images and longer intervals for video**: 2 seconds is reasonable for images; 5 seconds is better for videos.
5. **Handle failures explicitly**: if `status` is `failed`, read `.data.error` and adjust model name, parameters, input media URL, prompt, or account balance.
