---
name: hugging-face
description: Hugging Face API for ML models. Use when user mentions "Hugging Face",
  "HF", "transformers", or asks about ML model inference.
vm0_secrets:
  - HUGGING_FACE_TOKEN
---

# Hugging Face API

Use the Hugging Face API via direct `curl` calls to **search models and datasets**, **run serverless inference**, and **manage Hub repositories**.

> Official docs: `https://huggingface.co/docs/hub/en/api`
> OpenAPI spec: `https://huggingface.co/.well-known/openapi.json`

---

## When to Use

Use this skill when you need to:

- **Search and discover** models, datasets, and spaces on the Hugging Face Hub
- **Run serverless inference** (text generation, image generation, embeddings, etc.)
- **Get model or dataset metadata** (tags, downloads, likes, card info)
- **Manage repositories** (create, delete, list files)
- **Verify account access** with whoami

---

## Prerequisites

1. Sign up at [Hugging Face](https://huggingface.co/join)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens) and create a new token
3. Select appropriate permissions (read access for browsing, write for repo management)

```bash
export HUGGING_FACE_TOKEN="hf_..."
```

### Rate Limits

All API calls are subject to Hugging Face rate limits. Authenticated requests have higher limits than anonymous ones. Upgrade to a Pro or Enterprise account for elevated access.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq .
> ```

## How to Use

All examples below assume you have `HUGGING_FACE_TOKEN` set.

The base URLs are:

- Hub API: `https://huggingface.co/api`
- Inference API: `https://router.huggingface.co`

---

### 1. Verify Account (whoami)

Check your token and account information:

```bash
bash -c 'curl -s "https://huggingface.co/api/whoami-v2" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '{name: .name, email: .email, type: .type}'
```

---

### 2. Search Models

Search for models with filters:

```bash
bash -c 'curl -s "https://huggingface.co/api/models?search=llama&sort=downloads&direction=-1&limit=5" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

**Filter by pipeline task:**

```bash
bash -c 'curl -s "https://huggingface.co/api/models?pipeline_tag=text-generation&sort=trending&limit=5" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

**Common query parameters:**

- `search` - Search term
- `pipeline_tag` - Filter by task (text-generation, text-to-image, fill-mask, etc.)
- `sort` - Sort by: downloads, likes, trending, created_at, lastModified
- `direction` - Sort direction: -1 (descending), 1 (ascending)
- `limit` - Number of results (default 30)
- `author` - Filter by author/organization (e.g. `meta-llama`)
- `filter` - Filter by tags (e.g. `pytorch`, `en`)

---

### 3. Get Model Details

Get detailed information about a specific model:

```bash
bash -c 'curl -s "https://huggingface.co/api/models/meta-llama/Llama-3.1-8B-Instruct" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '{id, downloads, likes, pipeline_tag, tags: .tags[:5]}'
```

---

### 4. Search Datasets

Search for datasets:

```bash
bash -c 'curl -s "https://huggingface.co/api/datasets?search=squad&sort=downloads&direction=-1&limit=5" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

---

### 5. Get Dataset Details

Get detailed information about a specific dataset:

```bash
bash -c 'curl -s "https://huggingface.co/api/datasets/squad" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '{id, downloads, likes, tags: .tags[:5]}'
```

---

### 6. Search Spaces

Search for Spaces:

```bash
bash -c 'curl -s "https://huggingface.co/api/spaces?search=chatbot&sort=likes&direction=-1&limit=5" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

---

### 7. List Repository Files

List files in a model repository:

```bash
bash -c 'curl -s "https://huggingface.co/api/models/meta-llama/Llama-3.1-8B-Instruct/tree/main" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[] | {path: .rfilename, size}'
```

For datasets, replace `models` with `datasets`:

```bash
bash -c 'curl -s "https://huggingface.co/api/datasets/squad/tree/main" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[] | {path: .rfilename, size}'
```

---

### 8. Run Serverless Inference (Text Generation)

Run text generation using the Inference API with an OpenAI-compatible endpoint:

Write to `/tmp/hugging_face_request.json`:

```json
{
  "model": "meta-llama/Llama-3.1-8B-Instruct",
  "messages": [
    {
      "role": "user",
      "content": "What is the capital of France?"
    }
  ],
  "max_tokens": 100
}
```

Then run:

```bash
bash -c 'curl -s "https://router.huggingface.co/hf-inference/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" -d @/tmp/hugging_face_request.json' | jq -r '.choices[0].message.content'
```

---

### 9. Run Serverless Inference (Text-to-Image)

Generate an image from text:

```bash
bash -c 'curl -s "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" --header "Content-Type: application/json" -d '"'"'{"inputs": "A cute cat wearing sunglasses"}'"'"'' --output /tmp/hugging_face_image.png'
```

The response is the raw image binary saved to the output file.

---

### 10. Run Serverless Inference (Embeddings)

Generate text embeddings:

Write to `/tmp/hugging_face_request.json`:

```json
{
  "inputs": "Hello, how are you?"
}
```

Then run:

```bash
bash -c 'curl -s "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" --header "Content-Type: application/json" -d @/tmp/hugging_face_request.json' | jq '.[0][:5]'
```

---

### 11. Run Serverless Inference (Text Classification)

Classify text using sentiment analysis or other classification models:

Write to `/tmp/hugging_face_request.json`:

```json
{
  "inputs": "I love using Hugging Face!"
}
```

Then run:

```bash
bash -c 'curl -s "https://router.huggingface.co/hf-inference/models/distilbert-base-uncased-finetuned-sst-2-english" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" --header "Content-Type: application/json" -d @/tmp/hugging_face_request.json' | jq .
```

---

### 12. List Models with Inference Provider Support

Find models available for serverless inference:

```bash
bash -c 'curl -s "https://huggingface.co/api/models?inference_provider=all&pipeline_tag=text-generation&sort=trending&limit=10" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

Filter by a specific provider:

```bash
bash -c 'curl -s "https://huggingface.co/api/models?inference_provider=hf-inference&pipeline_tag=text-to-image&limit=5" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.[].id'
```

---

### 13. Get Model Inference Providers

Check which inference providers serve a specific model:

```bash
bash -c 'curl -s "https://huggingface.co/api/models/meta-llama/Llama-3.1-8B-Instruct?expand[]=inferenceProviderMapping" --header "Authorization: Bearer $HUGGING_FACE_TOKEN"' | jq '.inferenceProviderMapping'
```

---

### 14. Create a Repository

Create a new model repository:

Write to `/tmp/hugging_face_request.json`:

```json
{
  "name": "my-new-model",
  "type": "model",
  "private": true
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://huggingface.co/api/repos/create" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" --header "Content-Type: application/json" -d @/tmp/hugging_face_request.json' | jq .
```

**Repository types:** `model`, `dataset`, `space`

---

### 15. Delete a Repository

Delete a repository (requires write token):

Write to `/tmp/hugging_face_request.json`:

```json
{
  "name": "my-new-model",
  "type": "model"
}
```

Then run:

```bash
bash -c 'curl -s -X DELETE "https://huggingface.co/api/repos/delete" --header "Authorization: Bearer $HUGGING_FACE_TOKEN" --header "Content-Type: application/json" -d @/tmp/hugging_face_request.json' | jq .
```

---

## Guidelines

1. **Use Bearer authentication**: Pass the token via `Authorization: Bearer $HUGGING_FACE_TOKEN` header
2. **Prefer serverless inference for quick tasks**: Use the Inference API for prototyping; deploy Inference Endpoints for production
3. **Check model availability**: Not all models support serverless inference; use the `inference_provider` filter to find available models
4. **Use the OpenAI-compatible chat endpoint** for text generation: `https://router.huggingface.co/hf-inference/v1/chat/completions`
5. **Complex JSON payloads**: Write JSON to a temp file and use `-d @/tmp/hugging_face_request.json` to avoid shell quoting issues
6. **Respect rate limits**: Authenticated requests have higher rate limits; consider a Pro account for heavy usage
7. **Model IDs use org/name format**: Always specify the full model ID (e.g. `meta-llama/Llama-3.1-8B-Instruct`)
