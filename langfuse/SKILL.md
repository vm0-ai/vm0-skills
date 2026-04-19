---
name: langfuse
description: Langfuse LLM observability and tracing API. Use when user mentions
  "Langfuse", "LLM tracing", "trace ingestion", "eval scores", "prompt management",
  "LLM observability", "ingest traces", "list traces", or "create score".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name LANGFUSE_PUBLIC_KEY` or `zero doctor check-connector --url https://cloud.langfuse.com/api/public/traces --method GET`

## How to Use

All examples below assume `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` are set. Langfuse uses HTTP Basic Auth with the Public Key as the username and the Secret Key as the password.

- EU Cloud (default): `https://cloud.langfuse.com`
- US Cloud: `https://us.cloud.langfuse.com`

Pass credentials to curl with `-u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"`.

### 1. Batch Ingest Traces and Events

Send traces, spans, generations, events, and scores in a single batch. Each item in `batch` has a `type` (e.g. `trace-create`, `span-create`, `generation-create`, `score-create`) and a `body`.

Write to `/tmp/langfuse_ingest.json`:

```json
{
  "batch": [
    {
      "id": "<event-uuid>",
      "type": "trace-create",
      "timestamp": "2026-04-19T10:00:00.000Z",
      "body": {
        "id": "<trace-id>",
        "name": "my-llm-pipeline",
        "userId": "user-123",
        "input": {"prompt": "Hello world"},
        "output": {"completion": "Hi there!"},
        "metadata": {"env": "production"}
      }
    }
  ]
}
```

```bash
curl -s -X POST "https://cloud.langfuse.com/api/public/ingestion" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY" --header "Content-Type: application/json" -d @/tmp/langfuse_ingest.json
```

### 2. List Traces

Retrieve traces for the project. Supports pagination via `page` and `limit`, and filtering by `userId`, `name`, `sessionId`, `tags`, and date range.

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/traces?limit=20&page=1" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

Filter by user and date range:

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/traces?userId=user-123&fromTimestamp=2026-04-01T00:00:00Z&toTimestamp=2026-04-19T23:59:59Z" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

### 3. Get a Single Trace

Fetch full detail for one trace. Replace `<trace-id>` with the trace ID from the list response or your own ingestion ID:

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/traces/<trace-id>" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

### 4. Create an Evaluation Score

Attach a numeric or categorical score to a trace (or span/generation). Required fields: `name`, `value`, and either `traceId` or `observationId`.

Write to `/tmp/langfuse_score.json`:

```json
{
  "traceId": "<trace-id>",
  "name": "quality",
  "value": 0.92,
  "comment": "Excellent response",
  "source": "API"
}
```

```bash
curl -s -X POST "https://cloud.langfuse.com/api/public/scores" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY" --header "Content-Type: application/json" -d @/tmp/langfuse_score.json
```

### 5. List Sessions

List all tracing sessions. Sessions group related traces by a shared `sessionId`.

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/sessions?limit=20&page=1" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

### 6. List and Fetch Prompts

List all prompt templates managed in Langfuse:

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/prompts?limit=20&page=1" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

Fetch a specific prompt by name. Replace `<prompt-name>` with the prompt slug:

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/prompts/<prompt-name>" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

### 7. Daily Metrics

Retrieve per-day aggregated usage metrics (token counts, latency, cost, trace counts):

```bash
curl -s -X GET "https://cloud.langfuse.com/api/public/metrics/daily?days=7" -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"
```

## Guidelines

1. **Basic auth credential order**: always `LANGFUSE_PUBLIC_KEY:LANGFUSE_SECRET_KEY` (public key is the username, secret key is the password).
2. **Region selection**: EU Cloud (`cloud.langfuse.com`) is the default. Switch to US Cloud (`us.cloud.langfuse.com`) if your project was created at `us.cloud.langfuse.com`. Self-hosted instances use their own base URL.
3. **Batch ingestion**: always use `POST /api/public/ingestion` for writing traces, spans, generations, and events — do not call individual write endpoints. Up to 5 MB or 1000 events per batch.
4. **Trace IDs**: the `id` in each ingestion body is your own UUID — generate it in advance so you can reference the trace in subsequent score or span calls.
5. **Score sources**: set `source` to `"API"` for programmatic scores, `"HUMAN"` for manual annotations, or `"EVAL"` for model-based evaluations.
6. **Timestamp format**: all timestamps must be ISO 8601 with timezone offset (e.g. `2026-04-19T10:00:00.000Z`).

## API Reference

- Authentication: https://langfuse.com/docs/api
- Ingestion API: https://langfuse.com/docs/api#tag/Ingestion/POST/api/public/ingestion
- Traces API: https://langfuse.com/docs/api#tag/Trace/GET/api/public/traces
- Scores API: https://langfuse.com/docs/api#tag/Score/POST/api/public/scores
- Prompts API: https://langfuse.com/docs/api#tag/Prompt/GET/api/public/prompts
- Metrics API: https://langfuse.com/docs/api#tag/Metrics/GET/api/public/metrics/daily
