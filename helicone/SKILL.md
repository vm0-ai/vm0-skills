---
name: helicone
description: Helicone API for LLM observability — request logging, cost tracking, and performance analytics. Use when user mentions "Helicone", "LLM logs", "AI cost tracking", "request tracing", "token usage", "latency analytics", or "prompt monitoring".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name HELICONE_TOKEN` or `zero doctor check-connector --url https://api.helicone.ai/v1/request --method GET`

## Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: Bearer $HELICONE_TOKEN
```

Get your API key from: helicone.ai → Settings → API Keys → create a new key.

## Environment Variables

| Variable | Description |
|---|---|
| `HELICONE_TOKEN` | Helicone API key (starts with `sk-helicone-`) |

## Key Endpoints

Base URL: `https://api.helicone.ai`

### 1. List Requests

`POST /v1/request/query`

Fetch LLM request logs with filtering, pagination, and sorting.

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 10,
  "offset": 0,
  "sort": {
    "created_at": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json
```

Response includes `data` array with `request_id`, `model`, `prompt_tokens`, `completion_tokens`, `latency`, `cost`, `created_at`, and the full request/response bodies.

### 2. Filter Requests by Model

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 25,
  "offset": 0,
  "filter": {
    "request": {
      "model": {
        "contains": "gpt-4"
      }
    }
  },
  "sort": {
    "created_at": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json
```

### 3. Filter Requests by Date Range

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 100,
  "offset": 0,
  "filter": {
    "request": {
      "created_at": {
        "gte": "2024-01-01T00:00:00Z",
        "lte": "2024-12-31T23:59:59Z"
      }
    }
  },
  "sort": {
    "created_at": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json
```

### 4. Filter Requests by User

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 25,
  "offset": 0,
  "filter": {
    "request": {
      "user_id": {
        "equals": "<your-user-id>"
      }
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json
```

### 5. Get Aggregated Cost Stats

`POST /v1/request/query`

Use aggregation fields to compute total cost and token usage over a time window.

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 1000,
  "offset": 0,
  "filter": {
    "request": {
      "created_at": {
        "gte": "2024-01-01T00:00:00Z"
      }
    }
  },
  "sort": {
    "created_at": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json | jq '[.data[] | {model: .model, cost: .cost_usd, prompt_tokens: .prompt_tokens, completion_tokens: .completion_tokens}]'
```

### 6. Get a Single Request

`GET /v1/request/<request-id>`

Retrieve the full details of a specific request by ID.

```bash
curl -s "https://api.helicone.ai/v1/request/<request-id>" --header "Authorization: Bearer $HELICONE_TOKEN"
```

Replace `<request-id>` with the UUID returned in a query response.

### 7. List Properties (Custom Metadata Keys)

`GET /v1/property/query`

List all custom property keys used across your requests.

```bash
curl -s "https://api.helicone.ai/v1/property/query" --header "Authorization: Bearer $HELICONE_TOKEN"
```

### 8. Filter Requests by Custom Property

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 25,
  "offset": 0,
  "filter": {
    "properties": {
      "<your-property-key>": {
        "equals": "<your-property-value>"
      }
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json
```

### 9. Get Usage Over Time (Dashboard Stats)

`POST /v1/request/query`

To compute cost per day, group results by date client-side:

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 500,
  "offset": 0,
  "filter": {
    "request": {
      "created_at": {
        "gte": "2024-01-01T00:00:00Z"
      }
    }
  },
  "sort": {
    "created_at": "asc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json | jq 'group_by(.created_at[:10]) | map({date: .[0].created_at[:10], total_cost: (map(.cost_usd // 0) | add), requests: length})'
```

## Common Workflows

### Audit LLM Spend by Model

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json | jq 'group_by(.model) | map({model: .[0].model, total_cost: (map(.cost_usd // 0) | add), request_count: length, avg_latency_ms: (map(.latency // 0) | add / length | floor)})'
```

### Find Slowest Requests

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 20,
  "offset": 0,
  "sort": {
    "latency": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json | jq '[.data[] | {request_id: .request_id, model: .model, latency_ms: .latency, created_at: .created_at}]'
```

### Find Most Expensive Requests

Write to `/tmp/helicone_request.json`:

```json
{
  "limit": 20,
  "offset": 0,
  "sort": {
    "cost": "desc"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.helicone.ai/v1/request/query" --header "Authorization: Bearer $HELICONE_TOKEN" --header "Content-Type: application/json" -d @/tmp/helicone_request.json | jq '[.data[] | {request_id: .request_id, model: .model, cost_usd: .cost_usd, prompt_tokens: .prompt_tokens, completion_tokens: .completion_tokens}]'
```

## Response Fields Reference

| Field | Type | Description |
|---|---|---|
| `request_id` | string | Unique request UUID |
| `model` | string | LLM model name (e.g. `gpt-4o`) |
| `prompt_tokens` | number | Input token count |
| `completion_tokens` | number | Output token count |
| `latency` | number | Response time in milliseconds |
| `cost_usd` | number | Estimated cost in USD |
| `created_at` | string | ISO 8601 timestamp |
| `user_id` | string | User identifier (set via Helicone-User-Id header) |
| `properties` | object | Custom key-value metadata set at request time |
| `status` | number | HTTP status code returned by the LLM provider |

## Guidelines

1. **Pagination**: Use `limit` and `offset` for large result sets; max `limit` is 1000 per request
2. **Cost accuracy**: `cost_usd` is an estimate based on published model pricing — actual billing may differ
3. **Custom properties**: Set `Helicone-Property-*` headers in your LLM proxy calls to attach searchable metadata
4. **User tracking**: Set `Helicone-User-Id` header to attribute costs and requests to individual users
5. **Rate limits**: Default rate limits apply; implement exponential backoff on 429 responses

## API Reference

- Documentation: https://docs.helicone.ai/rest/request/get-v1requests
- Dashboard: https://helicone.ai
- API Keys: https://helicone.ai/settings/api-keys
