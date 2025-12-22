---
name: apify
description: Web scraping and automation platform with pre-built Actors for common tasks
vm0_env:
  - APIFY_API_TOKEN
---

# Apify

Web scraping and automation platform. Run pre-built Actors (scrapers) or create your own. Access thousands of ready-to-use scrapers for popular websites.

> Official docs: https://docs.apify.com/api/v2

---

## When to Use

Use this skill when you need to:

- Scrape data from websites (Amazon, Google, LinkedIn, Twitter, etc.)
- Run pre-built web scrapers without coding
- Extract structured data from any website
- Automate web tasks at scale
- Store and retrieve scraped data

---

## Prerequisites

1. Create an account at https://apify.com/
2. Get your API token from https://console.apify.com/account#/integrations

Set environment variable:

```bash
export APIFY_API_TOKEN="apify_api_xxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## How to Use

### 1. Run an Actor (Async)

Start an Actor run asynchronously:

```bash
curl -s -X POST "https://api.apify.com/v2/acts/apify~web-scraper/runs" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://example.com"}],
    "maxPagesPerCrawl": 10
  }' | jq .
```

**Response contains `id` (run ID) and `defaultDatasetId` for fetching results.**

### 2. Run Actor Synchronously

Wait for completion and get results directly (max 5 min):

```bash
curl -s -X POST "https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://news.ycombinator.com"}],
    "maxPagesPerCrawl": 1
  }' | jq .
```

### 3. Check Run Status

Poll the run status:

```bash
curl -s "https://api.apify.com/v2/actor-runs/{runId}" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq '.data.status'
```

**Statuses**: `READY`, `RUNNING`, `SUCCEEDED`, `FAILED`, `ABORTED`, `TIMED-OUT`

### 4. Get Dataset Items

Fetch results from a completed run:

```bash
curl -s "https://api.apify.com/v2/datasets/{datasetId}/items" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq .
```

**With pagination:**

```bash
curl -s "https://api.apify.com/v2/datasets/{datasetId}/items?limit=100&offset=0" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq .
```

### 5. Popular Actors

#### Google Search Scraper

```bash
curl -s -X POST "https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?timeout=120" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "queries": "web scraping tools",
    "maxPagesPerQuery": 1,
    "resultsPerPage": 10
  }' | jq .
```

#### Website Content Crawler

```bash
curl -s -X POST "https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items?timeout=300" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://docs.example.com"}],
    "maxCrawlPages": 10,
    "crawlerType": "cheerio"
  }' | jq .
```

#### Instagram Scraper

```bash
curl -s -X POST "https://api.apify.com/v2/acts/apify~instagram-scraper/runs" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "directUrls": ["https://www.instagram.com/apaborotnikov/"],
    "resultsType": "posts",
    "resultsLimit": 10
  }' | jq .
```

#### Amazon Product Scraper

```bash
curl -s -X POST "https://api.apify.com/v2/acts/junglee~amazon-crawler/runs" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "categoryOrProductUrls": [{"url": "https://www.amazon.com/dp/B0BSHF7WHW"}],
    "maxItemsPerStartUrl": 1
  }' | jq .
```

### 6. List Your Runs

Get recent Actor runs:

```bash
curl -s "https://api.apify.com/v2/actor-runs?limit=10&desc=true" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq '.data.items[] | {id, actId, status, startedAt}'
```

### 7. Abort a Run

Stop a running Actor:

```bash
curl -s -X POST "https://api.apify.com/v2/actor-runs/{runId}/abort" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq .
```

### 8. List Available Actors

Browse public Actors:

```bash
curl -s "https://api.apify.com/v2/store?limit=20&category=ECOMMERCE" \
  --header "Authorization: Bearer ${APIFY_API_TOKEN}" | jq '.data.items[] | {name, username, title}'
```

---

## Popular Actors Reference

| Actor ID | Description |
|----------|-------------|
| `apify/web-scraper` | General web scraper |
| `apify/website-content-crawler` | Crawl entire websites |
| `apify/google-search-scraper` | Google search results |
| `apify/instagram-scraper` | Instagram posts/profiles |
| `junglee/amazon-crawler` | Amazon products |
| `apify/twitter-scraper` | Twitter/X posts |
| `apify/youtube-scraper` | YouTube videos |
| `apify/linkedin-scraper` | LinkedIn profiles |
| `lukaskrivka/google-maps` | Google Maps places |

Find more at: https://apify.com/store

---

## Run Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `timeout` | number | Run timeout in seconds |
| `memory` | number | Memory in MB (128, 256, 512, 1024, 2048, 4096) |
| `maxItems` | number | Max items to return (for sync endpoints) |
| `build` | string | Actor build tag (default: "latest") |
| `waitForFinish` | number | Wait time in seconds (for async runs) |

---

## Response Format

**Run object:**

```json
{
  "data": {
    "id": "HG7ML7M8z78YcAPEB",
    "actId": "HDSasDasz78YcAPEB",
    "status": "SUCCEEDED",
    "startedAt": "2024-01-01T00:00:00.000Z",
    "finishedAt": "2024-01-01T00:01:00.000Z",
    "defaultDatasetId": "WkzbQMuFYuamGv3YF",
    "defaultKeyValueStoreId": "tbhFDFDh78YcAPEB"
  }
}
```

---

## Guidelines

1. **Sync vs Async**: Use `run-sync-get-dataset-items` for quick tasks (<5 min), async for longer jobs
2. **Rate Limits**: 250,000 requests/min globally, 400/sec per resource
3. **Memory**: Higher memory = faster execution but more credits
4. **Timeouts**: Default varies by Actor; set explicit timeout for sync calls
5. **Pagination**: Use `limit` and `offset` for large datasets
6. **Actor Input**: Each Actor has different input schema - check Actor's page for details
7. **Credits**: Check usage at https://console.apify.com/billing
