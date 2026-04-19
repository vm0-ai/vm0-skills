---
name: replicate
description: Replicate API for running open-source ML models in the cloud. Use when user mentions "Replicate", "run a model on Replicate", "AI image generation", "SDXL", "FLUX", "Llama", or "open-source ML inference".
---

# Replicate

Replicate lets you run open-source machine learning models via a simple HTTP API. Submit a prediction, poll until it completes, and retrieve the output URLs.

> Official docs: `https://replicate.com/docs/reference/http`

---

## When to Use

Use this skill when you need to:

- Generate images using SDXL, FLUX Schnell, or other diffusion models
- Run text generation with Llama or other open-source LLMs
- Execute any model hosted on replicate.com
- Poll the status of an async prediction job

---

## Prerequisites

Connect the **Replicate** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name REPLICATE_API_TOKEN` or `zero doctor check-connector --url https://api.replicate.com/v1/models --method GET`

---

## How to Use

All predictions are asynchronous: submit a job, then poll until `status` is `succeeded` or `failed`.

### 1. Run a Model by Version ID

Write to `/tmp/replicate_prediction.json`:

```json
{
  "version": "<model-version-id>",
  "input": {
    "prompt": "A photorealistic cat sitting on a chair"
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_prediction.json | jq '{id, status, urls}'
```

The response includes a prediction `id` and a `urls.get` URL for polling.

### 2. Run the Latest Version of a Model

Replace `<owner>` and `<model-name>` with the model's owner and name (e.g. `black-forest-labs` / `flux-schnell`).

Write to `/tmp/replicate_prediction.json`:

```json
{
  "input": {
    "prompt": "A photorealistic cat sitting on a chair"
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/models/<owner>/<model-name>/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_prediction.json | jq '{id, status, urls}'
```

### 3. Poll Prediction Status

Replace `<prediction-id>` with the `id` from the create response.

```bash
curl -s "https://api.replicate.com/v1/predictions/<prediction-id>" --header "Authorization: Bearer $REPLICATE_API_TOKEN" | jq '{id, status, output, error}'
```

Keep polling every 2–5 seconds until `status` is `succeeded` or `failed`.

| `status`    | Meaning                                |
|-------------|----------------------------------------|
| `starting`  | Model is cold-starting                 |
| `processing`| Model is running                       |
| `succeeded` | Output is ready in the `output` field  |
| `failed`    | Check the `error` field for details    |
| `canceled`  | Prediction was canceled                |

### 4. Generate an Image with FLUX Schnell

Write to `/tmp/replicate_flux.json`:

```json
{
  "input": {
    "prompt": "A serene mountain lake at sunrise, photorealistic",
    "num_outputs": 1
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_flux.json | jq '{id, status, urls}'
```

### 5. Generate an Image with Stability AI SDXL

Write to `/tmp/replicate_sdxl.json`:

```json
{
  "input": {
    "prompt": "A cyberpunk cityscape at night, neon lights, 4k",
    "negative_prompt": "blurry, low quality",
    "num_outputs": 1,
    "width": 1024,
    "height": 1024
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/models/stability-ai/sdxl/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_sdxl.json | jq '{id, status, urls}'
```

### 6. Run a Text Generation Model (Llama 3 70B)

Write to `/tmp/replicate_llama.json`:

```json
{
  "input": {
    "prompt": "Explain quantum entanglement in simple terms.",
    "max_tokens": 512
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/models/meta/llama-3-70b-instruct/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_llama.json | jq '{id, status, urls}'
```

Text generation responses stream tokens as an array. Poll until `succeeded`, then read `output` (an array of strings — join them for the full response).

### 7. List Recent Predictions

```bash
curl -s "https://api.replicate.com/v1/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" | jq '.results[] | {id, status, created_at, urls}'
```

### 8. Search for Models

```bash
curl -s "https://api.replicate.com/v1/models" --header "Authorization: Bearer $REPLICATE_API_TOKEN" | jq '.results[] | {url, description}'
```

### 9. Get Model Details

Replace `<owner>/<model-name>` with the model identifier.

```bash
curl -s "https://api.replicate.com/v1/models/<owner>/<model-name>" --header "Authorization: Bearer $REPLICATE_API_TOKEN" | jq '{url, description, latest_version}'
```

### 10. Run via a Deployment

Replace `<deployment-owner>` and `<deployment-name>` with the deployment's owner and name.

Write to `/tmp/replicate_deploy.json`:

```json
{
  "input": {
    "prompt": "A futuristic robot in a garden"
  }
}
```

```bash
curl -s -X POST "https://api.replicate.com/v1/deployments/<deployment-owner>/<deployment-name>/predictions" --header "Authorization: Bearer $REPLICATE_API_TOKEN" --header "Content-Type: application/json" -d @/tmp/replicate_deploy.json | jq '{id, status, urls}'
```

---

## Guidelines

1. **Always poll after submit**: Predictions are async. Never assume instant completion — always poll `GET /v1/predictions/<id>` until `status` is `succeeded` or `failed`.
2. **Poll interval**: 2–5 seconds is reasonable. Cold-starting models may take 30–60 seconds on the first prediction.
3. **Image output**: `output` will be an array of URLs (e.g. `["https://replicate.delivery/..."]`). Download with `curl -L`.
4. **Text output**: `output` is an array of token strings. Join them: `| jq '.output | join("")'`.
5. **Popular models**:
   - Image: `black-forest-labs/flux-schnell`, `stability-ai/sdxl`
   - Text: `meta/llama-3-70b-instruct`
6. **Version vs. latest**: Use `/v1/models/<owner>/<name>/predictions` to always run the latest version. Use `/v1/predictions` with a `version` ID to pin a specific version.
