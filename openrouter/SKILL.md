---
name: openrouter
description: OpenRouter API for routing prompts to hundreds of LLMs through a single OpenAI-compatible endpoint. Use when user mentions "OpenRouter", "LLM router", "OSS model", or asks to call multiple models behind one API key.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name OPENROUTER_TOKEN` or `zero doctor check-connector --url https://openrouter.ai/api/v1/chat/completions --method POST`.

## How to Use

OpenRouter exposes an OpenAI-compatible API at
`https://openrouter.ai/api/v1`. Authenticate with a Bearer token. The
`model` field accepts dozens of vendor-prefixed slugs (e.g.
`anthropic/claude-3.5-sonnet`, `meta-llama/llama-3.1-70b-instruct`,
`google/gemini-1.5-pro`).

### 1. Basic chat completion

Write to `/tmp/openrouter_request.json`:

```json
{
  "model": "openai/gpt-4o-mini",
  "messages": [{"role": "user", "content": "Summarize this in one line: VM0 is the agent platform"}]
}
```

Then run:

```bash
curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/openrouter_request.json
```

### 2. Try a Claude model

Write to `/tmp/openrouter_request.json`:

```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [{"role": "user", "content": "Write a haiku about debugging"}]
}
```

Then run:

```bash
curl -s -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/openrouter_request.json
```

### 3. List available models

```bash
curl -s "https://openrouter.ai/api/v1/models" \
  -H "Authorization: Bearer $OPENROUTER_TOKEN"
```

### 4. Streaming completion

Write to `/tmp/openrouter_request.json`:

```json
{
  "model": "openai/gpt-4o-mini",
  "stream": true,
  "messages": [{"role": "user", "content": "Count to 5"}]
}
```

Then run:

```bash
curl -sN -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/openrouter_request.json
```

### 5. Check credit balance

```bash
curl -s "https://openrouter.ai/api/v1/credits" \
  -H "Authorization: Bearer $OPENROUTER_TOKEN"
```

## Guidelines

1. **Model slugs are `vendor/model`** — `anthropic/claude-3.5-sonnet`, `meta-llama/llama-3.1-70b-instruct`, etc.
2. **OpenAI-compatible** — request/response shapes match `chat/completions`; existing OpenAI client libraries work.
3. **`HTTP-Referer` & `X-Title` headers** — optional but recommended; OpenRouter shows them on the leaderboard.
4. **Set `route: "fallback"`** — automatically retry on a backup provider if the primary is down.
5. **Pricing is per-model** — check `https://openrouter.ai/models` for current rates before high-volume calls.
