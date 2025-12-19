---
name: fal-image
description: Generate images using fal.ai API. Use this skill when you need to generate images from text prompts.
---

# fal.ai Image Generator

This skill generates high-quality images using the fal.ai API (Nano Banana Pro model).

## When to Use

Use this skill when:
- Need to generate images from text descriptions
- Want to create illustrations or visual content
- Require AI-generated imagery

## Prerequisites

The `FAL_KEY` environment variable must be set with your fal.ai API key.

## How to Use

Execute the script with a prompt describing the desired image:

```bash
scripts/fal-image.sh "prompt" [aspect_ratio] [resolution]
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| prompt | Yes | - | Text description of the image to generate |
| aspect_ratio | No | 16:9 | Image aspect ratio (1:1, 16:9, 4:3, 9:16, etc.) |
| resolution | No | 1K | Image resolution (1K, 2K, 4K) |

### Examples

```bash
# Generate a 16:9 image with default settings
scripts/fal-image.sh "Modern AI technology concept, neural networks and data visualization, blue and purple gradient" "16:9" "1K"

# Generate a square image
scripts/fal-image.sh "Modern tech startup office with developers" "1:1"

# Generate a high-resolution vertical image
scripts/fal-image.sh "Abstract neural network visualization" "9:16" "2K"
```

## Output

- Images are saved to `/tmp/images/generated_[timestamp].png`
- The script outputs the file path upon completion
- Image URL from fal.ai is also displayed

## Prompt Guidelines

For best results:

1. Describe the subject clearly and specifically
2. Include style hints: "modern", "professional", "digital art", "photorealistic", "minimalist"
3. Specify colors or mood when relevant
4. Keep prompts concise but descriptive

## Response Format

The fal.ai API returns:
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

The `url` field can be used directly as an image URL (e.g., for cover images or embedding).

## Pricing

- 1K resolution: ~$0.15 per image
- 2K resolution: ~$0.15 per image
- 4K resolution: ~$0.30 per image
