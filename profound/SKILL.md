---
name: profound
description: Profound API for AI search visibility, answer engine insights, citations, sentiment, fanouts, prompts, agents, and Agent Analytics. Use when user mentions "Profound", "GEO", "AEO", "AI search visibility", "answer engine optimization", "LLM citations", or "AI visibility analytics".
---

# Profound

Use the Profound REST API to retrieve AI search visibility, citations, sentiment,
fanout, prompt, category, and agent data for an organization.

> Official docs: `https://docs.tryprofound.com/rest-api/introduction`

---

## When to Use

Use this skill when you need to:

- Analyze brand or competitor visibility across AI answer engines
- Pull citation, sentiment, fanout, or visibility reports from Profound
- Discover Profound categories, assets, regions, models, personas, and prompts
- List or run Profound Agents
- Retrieve Agent Analytics bot or referral traffic reports

---

## Prerequisites

Connect the **Profound** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The connector injects `PROFOUND_API_KEY` and authenticates requests with the
`X-API-Key` header. Profound API access is Enterprise-only and currently in
beta; if the API Keys page is unavailable, request access from Profound support.

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name PROFOUND_API_KEY` or `zero doctor check-connector --url https://api.tryprofound.com/v1/org/categories --method GET`

Base URL for REST API endpoints: `https://api.tryprofound.com`

---

## How to Use

### 1. List Categories

Use categories to find the `category_id` required by most report endpoints.

```bash
curl -s "https://api.tryprofound.com/v1/org/categories" --header "X-API-Key: $PROFOUND_API_KEY" | jq '.[] | {id, name, organization: .organization.name}'
```

Docs: `https://docs.tryprofound.com/api-reference/organization/get-categories.md`

### 2. List Organization Metadata

```bash
curl -s "https://api.tryprofound.com/v1/org/assets" --header "X-API-Key: $PROFOUND_API_KEY" | jq '.[] | {id, name, organization: .organization.name}'
```

```bash
curl -s "https://api.tryprofound.com/v1/org/models" --header "X-API-Key: $PROFOUND_API_KEY" | jq '.[] | {id, name}'
```

```bash
curl -s "https://api.tryprofound.com/v1/org/regions" --header "X-API-Key: $PROFOUND_API_KEY" | jq '.[] | {id, name}'
```

Docs: `https://docs.tryprofound.com/cookbook/setup/data-model.md`

### 3. Query Visibility

Write to `/tmp/profound_visibility_request.json`:

```json
{
  "category_id": "<category-id>",
  "start_date": "2026-06-01",
  "end_date": "2026-06-17",
  "metrics": ["visibility_score", "share_of_voice", "mentions_count"],
  "dimensions": ["date", "asset_name"],
  "date_interval": "day",
  "pagination": {
    "limit": 100
  }
}
```

```bash
curl -s -X POST "https://api.tryprofound.com/v1/reports/visibility" --header "X-API-Key: $PROFOUND_API_KEY" --header "Content-Type: application/json" -d @/tmp/profound_visibility_request.json | jq '.data[]'
```

Docs: `https://docs.tryprofound.com/api-reference/reports/query-visibility.md`

### 4. Query Citations

Write to `/tmp/profound_citations_request.json`:

```json
{
  "category_id": "<category-id>",
  "start_date": "2026-06-01",
  "end_date": "2026-06-17",
  "metrics": ["count", "citation_share"],
  "dimensions": ["root_domain", "asset_name"],
  "pagination": {
    "limit": 100
  }
}
```

```bash
curl -s -X POST "https://api.tryprofound.com/v1/reports/citations" --header "X-API-Key: $PROFOUND_API_KEY" --header "Content-Type: application/json" -d @/tmp/profound_citations_request.json | jq '.data[]'
```

Docs: `https://docs.tryprofound.com/api-reference/reports/query-citations.md`

### 5. Query Sentiment

Write to `/tmp/profound_sentiment_request.json`:

```json
{
  "category_id": "<category-id>",
  "start_date": "2026-06-01",
  "end_date": "2026-06-17",
  "metrics": ["positive", "negative", "occurrences"],
  "dimensions": ["date", "asset_name"],
  "date_interval": "day",
  "pagination": {
    "limit": 100
  }
}
```

```bash
curl -s -X POST "https://api.tryprofound.com/v1/reports/sentiment" --header "X-API-Key: $PROFOUND_API_KEY" --header "Content-Type: application/json" -d @/tmp/profound_sentiment_request.json | jq '.data[]'
```

Docs: `https://docs.tryprofound.com/api-reference/reports/query-sentiment.md`

### 6. List Agents

```bash
curl -s "https://api.tryprofound.com/v1/agents?limit=100" --header "X-API-Key: $PROFOUND_API_KEY" | jq '.data[] | {id, name, status, created_at}'
```

Docs: `https://docs.tryprofound.com/api-reference/agents/list-agents.md`

### 7. Run an Agent

Write to `/tmp/profound_agent_run_request.json` using the schema required by
the specific agent. Replace `<agent-id>` with an agent ID from `GET /v1/agents`.

```json
{
  "inputs": {}
}
```

```bash
curl -s -X POST "https://api.tryprofound.com/v1/agents/<agent-id>/runs" --header "X-API-Key: $PROFOUND_API_KEY" --header "Content-Type: application/json" -d @/tmp/profound_agent_run_request.json | jq '{id, status}'
```

Docs: `https://docs.tryprofound.com/api-reference/agents/run-an-agent.md`

### 8. Get Agent Run Status

Replace `<agent-id>` with the agent ID and `<agent-run-id>` with the run ID
returned by the previous request.

```bash
curl -s "https://api.tryprofound.com/v1/agents/<agent-id>/runs/<agent-run-id>" --header "X-API-Key: $PROFOUND_API_KEY" | jq '{id, status, result}'
```

Docs: `https://docs.tryprofound.com/api-reference/agents/get-an-agent-run.md`

---

## Guidelines

1. **Find IDs first**: Most reports require a `category_id`; use `/v1/org/categories` before querying reports.
2. **Prefer `X-API-Key`**: Profound also supports query parameter auth, but the header keeps secrets out of URLs and logs.
3. **Use explicit date ranges**: Report endpoints require `start_date` and `end_date`; accepted formats include `YYYY-MM-DD`, `YYYY-MM-DD HH:MM`, and full ISO timestamps.
4. **Expect JSON**: Profound REST API responses are JSON. Report responses generally include `info` and `data`.
5. **Paginate deliberately**: Use the endpoint's `pagination` object or cursor fields when available; keep limits small for exploratory analysis.
6. **Watch rate limits**: Default API limit is 600 requests per hour per API key. Honor `X-RateLimit-*` and `Retry-After` headers.
7. **Beta API**: Endpoints and response shapes may change while Profound's REST API is in beta. Check the linked official docs when a request fails unexpectedly.
