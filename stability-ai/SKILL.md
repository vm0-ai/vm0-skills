---
name: stability-ai
description: Stability AI API for AI image generation using Stable Diffusion. Use when user mentions "Stability AI", "Stable Diffusion", "SDXL", "SD3", "image generation", "inpainting", "outpainting", "image upscaling", or "sketch to image".
---

# Stability AI

Stability AI provides state-of-the-art image generation, editing, and upscaling via their REST API (v2beta / v1). Models include SD3, SDXL Ultra, and Core for text-to-image, plus editing tools for inpainting, outpainting, and sketch-to-image conversion.

> Official docs: `https://platform.stability.ai/docs/api-reference`

---

## When to Use

Use this skill when you need to:

- Generate images from text prompts (SD3 / SDXL Ultra / Core)
- Upscale images with conservative or creative upscaling
- Edit images with inpainting (fill masked regions)
- Extend images with outpainting
- Convert sketches to polished images

---

## Prerequisites

Connect the **Stability AI** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name STABILITY_TOKEN` or `zero doctor check-connector --url https://api.stability.ai/v1/user/account --method GET`

---

## How to Use

**Important:** Most generation endpoints return binary image data by default. Use `--output /tmp/image.png` to save the file. To receive base64 JSON instead, add `--header "Accept: application/json"`.

### 1. Check Account and Credits

Verify your API key is working and check your credit balance:

```bash
curl -s -X GET "https://api.stability.ai/v1/user/account" --header "Authorization: Bearer $STABILITY_TOKEN"
```

### 2. Generate Image — Core (Recommended, Fastest)

Write to `/tmp/stability_request.json`:

```json
{
  "prompt": "A photorealistic mountain landscape at golden hour, 4k, highly detailed",
  "output_format": "png"
}
```

Then run (saves image to file):

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/generate/core" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F prompt="A photorealistic mountain landscape at golden hour, 4k, highly detailed" -F output_format="png" --output /tmp/generated_image.png
```

### 3. Generate Image — Ultra (SDXL, Highest Quality)

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/generate/ultra" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F prompt="A futuristic city skyline at night with neon lights, cinematic" -F output_format="png" --output /tmp/generated_ultra.png
```

### 4. Generate Image — SD3 (Stable Diffusion 3)

Write to `/tmp/sd3_gen.sh`:

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/generate/sd3" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F prompt="An abstract digital painting with vibrant colors and geometric shapes" -F model="sd3-large" -F output_format="png" --output /tmp/generated_sd3.png
```

Available `model` values: `sd3-large`, `sd3-large-turbo`, `sd3-medium`

### 5. Generate Image and Get Base64 JSON Response

Write to `/tmp/stability_b64.json`:

Use `"Accept: application/json"` to receive base64-encoded image in JSON:

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/generate/core" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: application/json" -F prompt="A serene Japanese zen garden with cherry blossoms" -F output_format="png" | jq -r '.image' | base64 -d > /tmp/generated_b64.png
```

### 6. Conservative Image Upscale

Upscale an existing image (provide a local file path):

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/upscale/conservative" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F image="@/tmp/source_image.png" -F prompt="high quality, sharp details" -F output_format="png" --output /tmp/upscaled_image.png
```

### 7. Inpainting (Edit a Region of an Image)

Inpainting requires the source image and a mask (white = area to fill, black = keep):

Write to `/tmp/inpaint_note.txt`:

```
Provide: -F image="@/tmp/source.png" and -F mask="@/tmp/mask.png"
The mask should be the same size as the source image.
White pixels in the mask will be replaced; black pixels are preserved.
```

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/edit/inpaint" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F image="@/tmp/source.png" -F mask="@/tmp/mask.png" -F prompt="A beautiful garden with blooming flowers" -F output_format="png" --output /tmp/inpainted.png
```

### 8. Outpainting (Extend an Image Beyond Its Borders)

Extend an image by specifying pixel amounts to add on each side:

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/edit/outpaint" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F image="@/tmp/source.png" -F left=200 -F right=200 -F prompt="Seamlessly extend the scene" -F output_format="png" --output /tmp/outpainted.png
```

### 9. Sketch to Image

Convert a sketch or line art into a polished image:

```bash
curl -s -X POST "https://api.stability.ai/v2beta/stable-image/control/sketch" --header "Authorization: Bearer $STABILITY_TOKEN" --header "Accept: image/*" -F image="@/tmp/sketch.png" -F prompt="A detailed architectural drawing rendered as a photorealistic building" -F output_format="png" --output /tmp/sketch_result.png
```

---

## Guidelines

1. **Image format**: Use `-F output_format="png"` for lossless quality; `webp` or `jpeg` for smaller files
2. **Prompts**: Be descriptive — include style, lighting, quality descriptors like "photorealistic", "4k", "cinematic"
3. **Negative prompts**: Add `-F negative_prompt="blurry, low quality, distorted"` to any generation endpoint to exclude unwanted elements
4. **Aspect ratio**: Add `-F aspect_ratio="16:9"` (or `1:1`, `9:16`, `21:9`, `2:3`, `3:2`, `4:5`, `5:4`) to Core and Ultra
5. **Credits**: Each generation costs credits. Check balance with the `/v1/user/account` endpoint
6. **File outputs**: Always save binary responses with `--output /tmp/filename.png`; never pipe binary to jq
7. **SD3 turbo**: Use `sd3-large-turbo` for faster (lower-quality) generations; omit `negative_prompt` with turbo models
