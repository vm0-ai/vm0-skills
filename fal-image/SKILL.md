name: fal-image
description: fal.ai image generation API via curl. Use this skill to generate images from text prompts.
vm0_env:

- FAL_KEY

---

# fal.ai Image Generator

Use the fal.ai API via direct `curl` calls to **generate images from text prompts**.

> Official docs: `https://fal.ai/models/fal-ai/nano-banana-pro`

---

## When to Use

Use this skill when you need to:

- **Generate images from text descriptions**
- **Create illustrations or visual content**
- **Generate blog headers, thumbnails, or social media images**

---

## Prerequisites

1. Sign up at [fal.ai](https://fal.ai/)
2. Get your API key from the dashboard

```bash
export FAL_KEY="your-api-key"
```

---

## How to Use

All examples below assume you have `FAL_KEY` set.

### 1. Generate an Image

```bash
curl -s -X POST "https://fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "16:9",
    "resolution": "1K",
    "output_format": "png",
    "num_images": 1
  }' | jq .
```

**Response:**

```json
{
  "images": [{
    "url": "https://storage.googleapis.com/...",
    "width": 1920,
    "height": 1080,
    "content_type": "image/png"
  }]
}
```

### 2. Download the Generated Image

```bash
IMAGE_URL="https://storage.googleapis.com/..."

curl -sL -o /tmp/generated.png "${IMAGE_URL}"
```

### 3. Generate and Download in One Go

```bash
IMAGE_URL=$(curl -s -X POST "https://fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Modern AI technology concept, neural networks visualization",
    "aspect_ratio": "16:9",
    "resolution": "1K"
  }' | jq -r '.images[0].url')

curl -sL -o /tmp/generated.png "${IMAGE_URL}"
echo "Saved to /tmp/generated.png"
```

---

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | - | Text description of the image |
| `aspect_ratio` | No | 16:9 | Aspect ratio (1:1, 16:9, 4:3, 9:16, 21:9) |
| `resolution` | No | 1K | Image resolution (1K, 2K, 4K) |
| `output_format` | No | png | Output format (png, jpeg) |
| `num_images` | No | 1 | Number of images to generate |

---

## Aspect Ratios

| Ratio | Use Case |
|-------|----------|
| `1:1` | Square, social media posts |
| `16:9` | Landscape, blog headers, YouTube thumbnails |
| `4:3` | Standard landscape |
| `9:16` | Vertical, mobile, stories |
| `21:9` | Ultra-wide, cinematic |

---

## Examples

### Blog Header

```bash
curl -s -X POST "https://fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Abstract technology background with flowing data streams, blue and purple gradient, modern and clean",
    "aspect_ratio": "16:9",
    "resolution": "2K"
  }' | jq -r '.images[0].url'
```

### Square Social Media Post

```bash
curl -s -X POST "https://fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Minimalist workspace with laptop and coffee, soft morning light",
    "aspect_ratio": "1:1",
    "resolution": "1K"
  }' | jq -r '.images[0].url'
```

### Vertical Story Image

```bash
curl -s -X POST "https://fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Neon city street at night, rain reflections, cinematic",
    "aspect_ratio": "9:16",
    "resolution": "1K"
  }' | jq -r '.images[0].url'
```

---

## Prompt Guidelines

For best results:

1. **Be specific** - Describe the subject clearly
2. **Add style hints** - "modern", "minimalist", "photorealistic", "digital art", "cinematic"
3. **Specify colors/mood** - "blue and purple gradient", "warm tones", "dark and moody"
4. **Keep it concise** - Clear and focused descriptions work better

---

## Pricing

| Resolution | Cost |
|------------|------|
| 1K | ~$0.15/image |
| 2K | ~$0.15/image |
| 4K | ~$0.30/image |

---

## Guidelines

1. **Use jq**: Extract the image URL with `jq -r '.images[0].url'`
2. **Check errors**: API returns `{"error": ...}` on failure
3. **Download with -L**: Use `curl -sL` to follow redirects when downloading
4. **Prompt quality**: Better prompts = better images
