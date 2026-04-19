---
name: together
description: Together AI API for open-source model inference and fine-tuning. Use
  when the user mentions "Together AI", "Together", or wants to run open-source models
  (Llama, Mixtral, Qwen, FLUX) via an OpenAI-compatible API.
---

# Together AI

Together AI is a cloud platform for running open-source foundation models. Its API
is OpenAI-compatible, so any SDK or workflow built for OpenAI's `/v1/` endpoints
works with Together AI by changing the base URL and API key.

> Official docs: `https://docs.together.ai/reference`

---

## When to Use

Use this skill when you need to:

- Run open-source LLMs (Llama 3, Qwen, Mixtral, DeepSeek, etc.) via API
- Generate images with FLUX.1-schnell or FLUX.1-dev
- Create text embeddings with open-source embedding models
- Fine-tune a model on custom data
- List all available models on the Together AI platform

---

## Prerequisites

Connect the **Together AI** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name TOGETHER_TOKEN` or `zero doctor check-connector --url https://api.together.ai/v1/models --method GET`

---

## How to Use

### 1. Chat Completion (OpenAI-compatible)

Write to `/tmp/together_chat.json`:

```json
{
  "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "messages": [{"role": "user", "content": "Explain quantum entanglement in one paragraph."}],
  "max_tokens": 512
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_chat.json | jq '.choices[0].message.content'
```

**Popular chat models:**

- `meta-llama/Llama-3.3-70B-Instruct-Turbo` — Fast Llama 3.3 70B
- `meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo` — Llama 3.1 405B, most capable
- `Qwen/Qwen2.5-72B-Instruct-Turbo` — Qwen 2.5 72B
- `mistralai/Mixtral-8x22B-Instruct-v0.1` — Mixtral 8x22B
- `deepseek-ai/DeepSeek-V3` — DeepSeek V3

### 2. Chat with System Prompt

Write to `/tmp/together_chat.json`:

```json
{
  "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "messages": [
    {"role": "system", "content": "You are a concise technical assistant. Respond in JSON."},
    {"role": "user", "content": "List three uses of embeddings in NLP."}
  ],
  "max_tokens": 256
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_chat.json | jq '.choices[0].message.content'
```

### 3. Text Completion

Write to `/tmp/together_completion.json`:

```json
{
  "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "prompt": "The capital of France is",
  "max_tokens": 64,
  "stop": ["\n"]
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_completion.json | jq '.choices[0].text'
```

### 4. Image Generation (FLUX)

Write to `/tmp/together_image.json`:

```json
{
  "model": "black-forest-labs/FLUX.1-schnell",
  "prompt": "A photorealistic mountain lake at sunset, golden light reflecting on water",
  "width": 1024,
  "height": 768,
  "steps": 4,
  "n": 1
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/images/generations" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_image.json | jq '.data[0].url'
```

**Image models:**

- `black-forest-labs/FLUX.1-schnell` — Fast, 4 steps, free tier
- `black-forest-labs/FLUX.1-dev` — Higher quality, 20–50 steps

### 5. Embeddings

Write to `/tmp/together_embed.json`:

```json
{
  "model": "togethercomputer/m2-bert-80M-8k-retrieval",
  "input": "The quick brown fox jumps over the lazy dog"
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/embeddings" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_embed.json | jq '.data[0].embedding[:5]'
```

**Embedding models:**

- `togethercomputer/m2-bert-80M-8k-retrieval` — 8K context, retrieval-optimized
- `BAAI/bge-large-en-v1.5` — BGE large English embeddings
- `WhereIsAI/UAE-Large-V1` — UAE-Large, general-purpose

### 6. List Available Models

```bash
curl -s "https://api.together.ai/v1/models" --header "Authorization: Bearer $TOGETHER_TOKEN" | jq '[.[] | {id: .id, type: .type}] | .[:20]'
```

Filter by type (chat, language, image, embedding, code):

```bash
curl -s "https://api.together.ai/v1/models" --header "Authorization: Bearer $TOGETHER_TOKEN" | jq '[.[] | select(.type == "chat") | .id]'
```

### 7. Start a Fine-Tuning Job

Upload a JSONL training file first. Replace `<file-id>` with the file ID returned by the upload step.

Write to `/tmp/together_finetune.json`:

```json
{
  "training_file": "<file-id>",
  "model": "meta-llama/Llama-3.2-3B-Instruct-Reference",
  "n_epochs": 3,
  "learning_rate": 0.00005,
  "suffix": "my-custom-model"
}
```

Then run:

```bash
curl -s -X POST "https://api.together.ai/v1/fine-tunes" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_finetune.json | jq '{id: .id, status: .status}'
```

Check fine-tune job status (replace `<fine-tune-id>` with the ID from the response above):

```bash
curl -s "https://api.together.ai/v1/fine-tunes/<fine-tune-id>" --header "Authorization: Bearer $TOGETHER_TOKEN" | jq '{id: .id, status: .status, model_output_name: .model_output_name}'
```

### 8. Streaming Response

Write to `/tmp/together_stream.json`:

```json
{
  "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "messages": [{"role": "user", "content": "Write a haiku about open-source AI."}],
  "stream": true,
  "max_tokens": 128
}
```

Then run:

```bash
curl -s "https://api.together.ai/v1/chat/completions" --header "Content-Type: application/json" --header "Authorization: Bearer $TOGETHER_TOKEN" -d @/tmp/together_stream.json
```

Streaming returns Server-Sent Events with delta chunks.

---

## Guidelines

1. **OpenAI-compatible**: Together AI follows the OpenAI `/v1/` schema — `model`, `messages`, `max_tokens`, `temperature`, `stream`, and `tools` all work as expected
2. **Model IDs are `org/model-name` format**: always include the organization prefix (e.g., `meta-llama/Llama-3.3-70B-Instruct-Turbo`), not just the model name
3. **FLUX image steps**: `FLUX.1-schnell` needs only 4 steps; `FLUX.1-dev` needs 20–50 for best quality
4. **Rate limits**: free-tier accounts have lower rate limits; check `x-ratelimit-*` response headers if you hit 429 errors
5. **Fine-tuning base models**: use `-Reference` or `-Free` variants (e.g., `meta-llama/Llama-3.2-3B-Instruct-Reference`) which are designated for fine-tuning
