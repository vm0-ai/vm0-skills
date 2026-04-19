---
name: exa
description: Exa AI-native semantic web search for AI agents. Use when user mentions "Exa", "neural search", "semantic search", "web search", "find similar pages", "crawl content", or "retrieve web content".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name EXA_API_KEY` or `zero doctor check-connector --url https://api.exa.ai/search --method POST`

## Authentication

All requests require an API key in the header:

```
x-api-key: $EXA_API_KEY
```

Get your API key from: [dashboard.exa.ai](https://dashboard.exa.ai) → Account → API Keys → Create API Key.

## Environment Variables

| Variable | Description |
|---|---|
| `EXA_API_KEY` | Exa API key (starts with `exa_`) |

## Key Endpoints

Base URL: `https://api.exa.ai`

---

### 1. Search

`POST /search`

Neural or keyword search across the web. Returns URLs, titles, and optionally full content.

Write to `/tmp/exa_search.json`:

```json
{
  "query": "best practices for building AI agents",
  "type": "auto",
  "numResults": 10,
  "contents": {
    "text": true
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_search.json
```

Key parameters:
- `query` (required) — the search query string
- `type` — `"auto"` (default), `"neural"` (semantic), or `"keyword"`
- `numResults` — number of results (default 10, max 100)
- `includeDomains` — restrict results to these domains (array of strings)
- `excludeDomains` — exclude these domains (array of strings)
- `startPublishedDate` / `endPublishedDate` — ISO 8601 date range filter
- `contents.text` — include full text of each result
- `contents.highlights` — include relevant excerpts

Response includes `results` array with `url`, `title`, `publishedDate`, `score`, and optionally `text` / `highlights`.

---

### 2. Search with Domain Filtering

Filter results to specific trusted sources:

Write to `/tmp/exa_search.json`:

```json
{
  "query": "machine learning research 2024",
  "type": "neural",
  "numResults": 5,
  "includeDomains": ["arxiv.org", "openai.com", "deepmind.google"],
  "startPublishedDate": "2024-01-01T00:00:00.000Z"
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_search.json
```

---

### 3. Search with Highlights

Return relevant excerpts instead of full page text:

Write to `/tmp/exa_search.json`:

```json
{
  "query": "how does retrieval augmented generation work",
  "numResults": 5,
  "contents": {
    "highlights": {
      "numSentences": 3,
      "highlightsPerUrl": 2
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_search.json
```

---

### 4. Fetch Page Contents by URL

`POST /contents`

Retrieve the full text of specific URLs without a search query.

Write to `/tmp/exa_contents.json`:

```json
{
  "ids": ["https://example.com/article-1", "https://example.com/article-2"],
  "contents": {
    "text": true
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/contents" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_contents.json
```

The `ids` field accepts either Exa result IDs (from a prior `/search` response) or plain URLs.

---

### 5. Find Similar Pages

`POST /findSimilar`

Given a URL, find semantically similar pages on the web.

Write to `/tmp/exa_similar.json`:

```json
{
  "url": "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "numResults": 10,
  "excludeSourceDomain": true
}
```

Then run:

```bash
curl -s -X POST "https://api.exa.ai/findSimilar" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_similar.json
```

Parameters:
- `url` (required) — the reference URL to find pages similar to
- `numResults` — number of similar results to return
- `excludeSourceDomain` — if `true`, excludes results from the same domain as the reference URL
- `contents` — same as `/search` contents object (text, highlights, summary)

---

## Common Workflows

### Research Pipeline: Search then Fetch Full Text

```bash
# Step 1: Search for relevant pages
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_search.json
```

From the response, copy the `id` values of the most relevant results. Then:

Write to `/tmp/exa_contents.json`:

```json
{
  "ids": ["<result-id-1>", "<result-id-2>"],
  "contents": {
    "text": true
  }
}
```

```bash
# Step 2: Fetch full text of chosen results
curl -s -X POST "https://api.exa.ai/contents" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_contents.json
```

### News Monitoring

Write to `/tmp/exa_search.json`:

```json
{
  "query": "AI agent frameworks news",
  "type": "keyword",
  "numResults": 10,
  "category": "news",
  "startPublishedDate": "2025-01-01T00:00:00.000Z"
}
```

```bash
curl -s -X POST "https://api.exa.ai/search" --header "x-api-key: $EXA_API_KEY" --header "Content-Type: application/json" -d @/tmp/exa_search.json
```

---

## Notes

- `type: "auto"` lets Exa choose neural vs keyword based on the query — best default
- Neural search (`type: "neural"`) excels at conceptual/semantic queries
- Keyword search (`type: "keyword"`) is better for exact phrase matching
- `contents.text` fetches the full page; `contents.highlights` returns excerpts — use highlights for large result sets to reduce token usage
- Free tier: 1,000 requests/month
- Rate limits: check your dashboard for current plan limits

## API Reference

- Documentation: https://exa.ai/docs/reference/search-api-guide
- Dashboard: https://dashboard.exa.ai
- API Keys: https://dashboard.exa.ai/api-keys
