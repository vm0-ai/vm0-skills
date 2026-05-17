---
name: gemini
description: Google Gemini API for multimodal generative AI. Use when user mentions
  "Gemini", "Google AI", "Gemini Pro", "Gemini Flash", or "Google generative AI"
  (do NOT use for Vertex AI enterprise endpoints).
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GEMINI_TOKEN` or `zero doctor check-connector --url https://generativelanguage.googleapis.com/v1beta/models --method GET`

## How to Use

All examples below assume you have `GEMINI_TOKEN` set.

Base URL: `https://generativelanguage.googleapis.com/v1beta`

Authentication uses the `x-goog-api-key` header (preferred over `?key=` query parameter for safer logging).

### 1. Basic Text Generation

Generate text from a prompt:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "Hello, who are you?"}]}]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

**Available models:**

- `gemini-2.5-pro`: Most capable reasoning model (1M context)
- `gemini-2.5-flash`: Fast, cost-efficient, balanced quality (1M context)
- `gemini-2.5-flash-lite`: Lowest latency, highest throughput (1M context)
- `gemini-2.0-flash`: Previous generation flash model
- `gemini-1.5-pro`: Legacy long-context model (2M context)

### 2. Chat with System Instruction

Steer the model with a system instruction:

Write to `/tmp/gemini_request.json`:

```json
{
  "system_instruction": {"parts": [{"text": "You are a helpful assistant that responds in JSON format."}]},
  "contents": [{"parts": [{"text": "List 3 programming languages with their main use cases."}]}]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

### 3. Multi-Turn Conversation

Pass prior turns by alternating `user` and `model` roles:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [
    {"role": "user", "parts": [{"text": "My name is Ethan."}]},
    {"role": "model", "parts": [{"text": "Nice to meet you, Ethan."}]},
    {"role": "user", "parts": [{"text": "What did I just tell you?"}]}
  ]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

### 4. Streaming Response

Use the `streamGenerateContent` endpoint with `?alt=sse` for Server-Sent Events:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "Write a haiku about programming."}]}]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json
```

### 5. JSON Mode

Force structured JSON output via `responseMimeType` and an optional schema:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "Give me info about Paris: name, country, population."}]}],
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "country": {"type": "string"},
        "population": {"type": "integer"}
      },
      "required": ["name", "country", "population"]
    }
  }
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

### 6. Vision (Image Analysis)

Pass an inline image as base64:

```bash
IMAGE_B64=$(curl -s "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg" | base64 -w0)

cat > /tmp/gemini_request.json <<EOF
{
  "contents": [{
    "parts": [
      {"text": "What is in this image?"},
      {"inline_data": {"mime_type": "image/jpeg", "data": "$IMAGE_B64"}}
    ]
  }]
}
EOF

curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

For files larger than ~20 MB, upload via the Files API first and reference by `file_uri` instead of `inline_data`.

### 7. Function Calling (Tools)

Declare callable functions; the model responds with a `functionCall` part:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "What is the weather in Tokyo?"}]}],
  "tools": [{
    "function_declarations": [{
      "name": "get_weather",
      "description": "Get current weather for a location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
      }
    }]
  }]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].functionCall'
```

### 8. Generate Embeddings

Use the `embedContent` endpoint with an embedding model:

Write to `/tmp/gemini_request.json`:

```json
{
  "content": {"parts": [{"text": "The quick brown fox jumps over the lazy dog."}]}
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.embedding.values[:5]'
```

This extracts the first 5 dimensions of the embedding vector.

**Embedding models:**

- `text-embedding-004`: 768 dimensions, general-purpose
- `gemini-embedding-001`: Latest Gemini embedding model

### 9. Count Tokens

Estimate token cost before sending:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "How many tokens is this prompt?"}]}]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:countTokens" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.totalTokens'
```

### 10. Safety and Generation Settings

Tune output with `generationConfig` and relax/tighten safety filters:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "Write a short story about a robot learning to paint."}]}],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.95,
    "maxOutputTokens": 500
  },
  "safetySettings": [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"}
  ]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.candidates[0].content.parts[0].text'
```

### 11. List Available Models

Get all models accessible to your key:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models" -H "x-goog-api-key: $GEMINI_TOKEN" | jq -r '.models[].name' | head -20
```

### 12. Check Token Usage

Every response includes `usageMetadata`:

Write to `/tmp/gemini_request.json`:

```json
{
  "contents": [{"parts": [{"text": "Hi!"}]}]
}
```

Then run:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" -H "Content-Type: application/json" -H "x-goog-api-key: $GEMINI_TOKEN" -d @/tmp/gemini_request.json | jq '.usageMetadata'
```

Response includes:

- `promptTokenCount`: Input token count
- `candidatesTokenCount`: Output token count
- `totalTokenCount`: Sum of both

## Guidelines

1. **Choose the right model**: Use `gemini-2.5-flash` for most tasks, `gemini-2.5-pro` for complex reasoning, `gemini-2.5-flash-lite` when latency matters
2. **Set maxOutputTokens**: Prevent runaway generation and control costs
3. **Prefer the `x-goog-api-key` header**: Avoid `?key=` query parameter so the token does not leak into request logs
4. **Use streaming for long responses**: `streamGenerateContent?alt=sse` returns Server-Sent Events
5. **JSON mode needs responseMimeType**: Optionally pair with `responseSchema` for strict structured output
6. **Vision: inline for small files, Files API for large**: `inline_data` works up to ~20 MB; larger media must be uploaded first
7. **Count tokens before expensive calls**: Use `countTokens` to estimate cost on long contexts
8. **Monitor usage**: Check Google AI Studio regularly to avoid unexpected charges
