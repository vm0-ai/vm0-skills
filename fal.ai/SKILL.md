---
name: fal-image
description: fal.ai AI image generation. Use this skill when you need to use fal, fal.ai, or generate images from text prompts using AI text-to-image models.
vm0_env:
  - FAL_KEY
---

# fal.ai Image Generator

Use the fal.ai API to **generate images from text prompts**.

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

Use `generate.sh` to generate images. It reads the prompt from stdin and outputs the image URL.

### Basic Usage

```bash
echo "A futuristic city at sunset, cyberpunk style" | ./generate.sh
```

### Specify Model

```bash
echo "A cute cat eating a cookie" | ./generate.sh nano-banana-pro
echo "Abstract art" | ./generate.sh recraft-v3
```

### Download the Generated Image

```bash
echo "A cute cat" | ./generate.sh | xargs curl -sL -o /tmp/image.png
```

---

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `prompt` | Yes | - | Text description of the image (via stdin) |
| `model` | No | nano-banana-pro | Model name (first argument) |

---

## Available Models

| Model | Description |
|-------|-------------|
| `nano-banana-pro` | Fast, good quality (default) |
| `recraft-v3` | High quality vector/illustration |
| `flux/schnell` | Fast generation |
| `flux-pro` | High quality |

See more at: https://fal.ai/models

---

## Prompt Guidelines

For best results:

1. **Be specific** - Describe the subject clearly
2. **Add style hints** - "modern", "minimalist", "photorealistic", "digital art", "cinematic"
3. **Specify colors/mood** - "blue and purple gradient", "warm tones", "dark and moody"
4. **Keep it concise** - Clear and focused descriptions work better

---

## Examples

```bash
# Blog header
echo "Abstract technology background with flowing data streams, blue and purple gradient" | ./generate.sh

# Social media post
echo "Minimalist workspace with laptop and coffee, soft morning light" | ./generate.sh

# Vertical story
echo "Neon city street at night, rain reflections, cinematic" | ./generate.sh
```
