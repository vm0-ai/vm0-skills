---
name: luma
description: Luma AI Dream Machine API for AI video and image generation. Use when
  user mentions "Luma", "Dream Machine", "luma video", "luma image", or "lumalabs".
---

# Luma AI Dream Machine

Generate AI videos and images using Luma AI's Dream Machine API. Supports text-to-video, image-to-video, video extension, and image generation.

> Official docs: `https://docs.lumalabs.ai/docs/api`

---

## When to Use

Use this skill when you need to:

- Generate AI videos from text prompts (text-to-video)
- Generate AI videos from images (image-to-video)
- Extend existing videos forward or backward
- Generate AI images from text prompts
- Poll for and retrieve completed generation results
- List or delete past generations

---

## Prerequisites

Connect the **Luma** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name LUMAAI_API_KEY` or `zero doctor check-connector --url https://api.lumalabs.ai/dream-machine/v1/generations --method GET`

---

## How to Use

### 1. Generate a Video from Text

Submit a text-to-video generation request. Write to `/tmp/luma_video_request.json`:

```json
{
  "prompt": "A serene mountain lake at sunrise, mist rising from the water, cinematic slow pan",
  "model": "ray-2",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "duration": "5s",
  "loop": false
}
```

```bash
curl -s -X POST "https://api.lumalabs.ai/dream-machine/v1/generations/video" --header "Authorization: Bearer $LUMAAI_API_KEY" --header "Content-Type: application/json" -d @/tmp/luma_video_request.json | jq '{id, state, created_at}'
```

Save the returned `id` for polling.

### 2. Generate a Video from an Image (Image-to-Video)

Use a keyframe to anchor the starting image. Write to `/tmp/luma_video_request.json`:

```json
{
  "prompt": "The scene slowly comes alive, gentle waves, birds taking flight",
  "model": "ray-2",
  "aspect_ratio": "16:9",
  "duration": "5s",
  "keyframes": {
    "frame0": {
      "type": "image",
      "url": "<your-image-url>"
    }
  }
}
```

```bash
curl -s -X POST "https://api.lumalabs.ai/dream-machine/v1/generations/video" --header "Authorization: Bearer $LUMAAI_API_KEY" --header "Content-Type: application/json" -d @/tmp/luma_video_request.json | jq '{id, state}'
```

### 3. Poll Generation Status

Poll until `state` is `completed` or `failed`. Replace `<generation-id>` with the ID from the create response:

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations/<generation-id>" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq '{id, state, failure_reason, assets}'
```

State values:
- `dreaming`: Generation is in progress
- `completed`: Generation is finished — `assets.video` contains the download URL
- `failed`: Generation failed — `failure_reason` contains the error

### 4. Download the Completed Video

Once state is `completed`, the `assets.video` field contains a direct download URL:

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations/<generation-id>" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq -r '.assets.video'
```

Then download:

```bash
curl -L "<video-url>" -o /tmp/luma_output.mp4
```

### 5. Generate an Image from Text

Write to `/tmp/luma_image_request.json`:

```json
{
  "prompt": "A photorealistic portrait of a red fox in a forest at golden hour",
  "model": "photon-1",
  "aspect_ratio": "1:1"
}
```

```bash
curl -s -X POST "https://api.lumalabs.ai/dream-machine/v1/generations/image" --header "Authorization: Bearer $LUMAAI_API_KEY" --header "Content-Type: application/json" -d @/tmp/luma_image_request.json | jq '{id, state, created_at}'
```

### 6. Poll Image Generation Status

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations/<generation-id>" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq '{id, state, failure_reason, assets}'
```

Once `state` is `completed`, `assets.image` contains the image URL.

### 7. Extend an Existing Video

Extend a completed video by referencing its ID in keyframes. Write to `/tmp/luma_extend_request.json`:

```json
{
  "prompt": "Continue the scene with the camera pulling back to reveal the full landscape",
  "model": "ray-2",
  "aspect_ratio": "16:9",
  "duration": "5s",
  "keyframes": {
    "frame0": {
      "type": "generation",
      "id": "<source-generation-id>"
    }
  }
}
```

```bash
curl -s -X POST "https://api.lumalabs.ai/dream-machine/v1/generations/video" --header "Authorization: Bearer $LUMAAI_API_KEY" --header "Content-Type: application/json" -d @/tmp/luma_extend_request.json | jq '{id, state}'
```

### 8. List Recent Generations

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations?limit=10&offset=0" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq '.generations[] | {id, state, created_at}'
```

### 9. Delete a Generation

```bash
curl -s -X DELETE "https://api.lumalabs.ai/dream-machine/v1/generations/<generation-id>" --header "Authorization: Bearer $LUMAAI_API_KEY"
```

### 10. List Available Camera Motions

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations/camera_motion/list" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq '.[]'
```

### 11. List Available Creative Concepts

```bash
curl -s -X GET "https://api.lumalabs.ai/dream-machine/v1/generations/concepts/list" --header "Authorization: Bearer $LUMAAI_API_KEY" | jq '.[]'
```

---

## Guidelines

1. **Poll until terminal state**: Generation is async — after submitting, poll `GET /generations/<id>` until `state` is `completed` or `failed`. Typical generation takes 30–120 seconds.
2. **Video models**: Use `ray-2` for highest quality, `ray-flash-2` for faster/cheaper generation.
3. **Image models**: Use `photon-1` for highest quality, `photon-flash-1` for faster generation.
4. **Aspect ratios**: Supported values are `1:1`, `3:4`, `4:3`, `9:16`, `16:9` (default), `9:21`, `21:9`.
5. **Duration**: Video duration is `5s` or `9s`.
6. **Resolution**: Supported values are `540p`, `720p`, `1080p`, `4k`.
7. **Extend via keyframes**: To extend a video, reference the source generation `id` in `keyframes.frame0` with `type: "generation"`. To anchor end frame use `frame1`.
8. **Use JSON files for request bodies**: Always write request bodies to `/tmp/luma_*.json` to avoid shell quoting issues.
