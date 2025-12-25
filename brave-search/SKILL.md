---
name: brave-search
description: Brave Search API via curl. Use this skill for privacy-focused web, image, video, and news search with no tracking.
vm0_env:
  - BRAVE_API_KEY
---

# Brave Search API

Use the Brave Search API via direct `curl` calls to perform **privacy-focused web searches** with no user tracking.

> Official docs: `https://api.search.brave.com/app/documentation`

---

## When to Use

Use this skill when you need to:

- **Web search** with privacy-focused results
- **Image search** for finding images
- **Video search** for video content
- **News search** for current events
- **AI-powered summaries** of search results

---

## Prerequisites

1. Sign up at [Brave Search API](https://brave.com/search/api/)
2. Subscribe to a plan (Free tier available, credit card required for anti-fraud)
3. Get your API key from the [Dashboard](https://api-dashboard.search.brave.com/)

```bash
export BRAVE_API_KEY="your-api-key"
```

### Pricing

| Plan | Price | Rate Limit | Monthly Cap |
|------|-------|------------|-------------|
| Free | $0 | 1 query/sec | 2,000 queries |
| Base | $5/1000 | 20 query/sec | 20M queries |
| Pro | $9/1000 | 50 query/sec | Unlimited |

---


> **Important:** Do not pipe `curl` output directly to `jq` (e.g., `curl ... | jq`). Due to a Claude Code bug, environment variables in curl headers are silently cleared when pipes are used. Instead, use a two-step pattern:
> ```bash
> curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" > /tmp/response.json
> cat /tmp/response.json | jq .
> ```

## How to Use

All examples below assume you have `BRAVE_API_KEY` set.

The base URL for the API is:

- `https://api.search.brave.com/res/v1`

Authentication uses the `X-Subscription-Token` header.

---

### 1. Basic Web Search

Search the web with a query:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search?q=artificial+intelligence" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" > /tmp/resp_fb6234.json
cat /tmp/resp_fb6234.json | jq '.web.results[:3] | .[] | {title, url, description}'
```

---

### 2. Web Search with Parameters

Customize search with country, language, and result count:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=best restaurants" -d "country=us" -d "search_lang=en" -d "count=5" > /tmp/resp_1f7e9e.json
cat /tmp/resp_1f7e9e.json | jq '.web.results[] | {title, url}'
```

**Parameters:**

- `q`: Search query (required, max 400 chars / 50 words)
- `country`: Two-letter country code (e.g., `us`, `gb`, `jp`)
- `search_lang`: Language code (e.g., `en`, `zh`, `ja`)
- `count`: Results per page (1-20, default: 10)
- `offset`: Pagination offset (0-9, default: 0)

---

### 3. Safe Search Filter

Control explicit content filtering:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=programming tutorials" -d "safesearch=strict" > /tmp/resp_a45b2c.json
cat /tmp/resp_a45b2c.json | jq '.web.results[:3] | .[] | {title, url}'
```

**Options:** `off`, `moderate` (default), `strict`

---

### 4. Freshness Filter

Filter results by time:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=tech news" -d "freshness=pd" > /tmp/resp_892c7a.json
cat /tmp/resp_892c7a.json | jq '.web.results[:3] | .[] | {title, url, age}'
```

**Options:**

- `pd`: Past day (24 hours)
- `pw`: Past week
- `pm`: Past month
- `py`: Past year
- `YYYY-MM-DDtoYYYY-MM-DD`: Custom date range

---

### 5. Image Search

Search for images:

```bash
curl -s "https://api.search.brave.com/res/v1/images/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=sunset beach" -d "count=5" -d "safesearch=moderate" > /tmp/resp_e2deb1.json
cat /tmp/resp_e2deb1.json | jq '.results[] | {title, url: .properties.url, thumbnail: .thumbnail.src}'
```

Image search supports up to 200 results per request.

---

### 6. Video Search

Search for videos:

```bash
curl -s "https://api.search.brave.com/res/v1/videos/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=learn python" -d "count=5" > /tmp/resp_033dae.json
cat /tmp/resp_033dae.json | jq '.results[] | {title, url, duration}'
```

Video search supports up to 50 results per request.

---

### 7. News Search

Search for recent news articles:

```bash
curl -s "https://api.search.brave.com/res/v1/news/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=technology" -d "count=3" > /tmp/resp_4d6efb.json
cat /tmp/resp_4d6efb.json | jq '.results[:3] | .[] | {title, url, age}'
```

News search defaults to past day (`pd`) freshness.

---

### 8. Pagination

Get more results with offset:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" -G --data-urlencode "q=machine learning" -d "count=10" -d "offset=1" > /tmp/resp_0c6b19.json
cat /tmp/resp_0c6b19.json | jq '.web.results[] | {title, url}'
```

`offset=1` skips the first page of results.

---

### 9. Get Raw JSON Response

View the full response structure:

```bash
curl -s "https://api.search.brave.com/res/v1/web/search?q=test" -H "Accept: application/json" -H "X-Subscription-Token: ${BRAVE_API_KEY}" > /tmp/resp_5238c3.json
cat /tmp/resp_5238c3.json | jq 'keys'
```

Response includes: `query`, `mixed`, `type`, `web`, `videos`, `news`, etc.

---

## Response Structure

### Web Search Response

```json
{
  "query": { "original": "search term" },
  "web": {
  "results": [
  {
  "title": "Page Title",
  "url": "https://example.com",
  "description": "Page description...",
  "age": "2 days ago"
  }
  ]
  }
}
```

### Image Search Response

```json
{
  "results": [
  {
  "title": "Image Title",
  "properties": { "url": "https://..." },
  "thumbnail": { "src": "https://..." }
  }
  ]
}
```

---

## Guidelines

1. **URL encode queries**: Use `--data-urlencode` for special characters
2. **Respect rate limits**: Free tier is 1 query/second
3. **Use freshness for news**: Time-sensitive searches benefit from `pd` or `pw`
4. **Pagination limit**: Maximum offset is 9 (100 results total with count=10)
5. **Pro plan for local**: Local business search requires Pro subscription
6. **No tracking**: Brave doesn't track users or store search history
