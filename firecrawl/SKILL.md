name: firecrawl
description: Firecrawl web scraping API via curl. Use this skill to scrape webpages, crawl websites, discover URLs, search the web, or extract structured data.
vm0_env:

- FIRECRAWL_API_KEY

---

# Firecrawl

Use the Firecrawl API via direct `curl` calls to **scrape websites and extract data for AI**.

> Official docs: `https://docs.firecrawl.dev/`

---

## When to Use

Use this skill when you need to:

- **Scrape a webpage** and convert to markdown/HTML
- **Crawl an entire website** and extract all pages
- **Discover all URLs** on a website
- **Search the web** and get full page content
- **Extract structured data** using AI

---

## Prerequisites

1. Sign up at https://www.firecrawl.dev/
2. Get your API key from the dashboard

```bash
export FIRECRAWL_API_KEY="fc-your-api-key"
```

---

## How to Use

All examples below assume you have `FIRECRAWL_API_KEY` set.

Base URL: `https://api.firecrawl.dev/v1`

---

## 1. Scrape - Single Page

Extract content from a single webpage.

### Basic Scrape

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"]
  }' | jq .
```

### Scrape with Options

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com/api",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "timeout": 30000
  }' | jq '.data.markdown'
```

### Get HTML Instead

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["html"]
  }' | jq '.data.html'
```

### Get Screenshot

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["screenshot"]
  }' | jq '.data.screenshot'
```

**Scrape Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | URL to scrape (required) |
| `formats` | array | `markdown`, `html`, `rawHtml`, `screenshot`, `links` |
| `onlyMainContent` | boolean | Skip headers/footers |
| `timeout` | number | Timeout in milliseconds |

---

## 2. Crawl - Entire Website

Crawl all pages of a website (async operation).

### Start a Crawl

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/crawl" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "limit": 50,
    "maxDepth": 2
  }' | jq .
```

**Response:**

```json
{
  "success": true,
  "id": "crawl-job-id-here"
}
```

### Check Crawl Status

```bash
JOB_ID="crawl-job-id-here"

curl -s "https://api.firecrawl.dev/v1/crawl/${JOB_ID}" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" | jq '{status, completed, total}'
```

### Get Crawl Results

```bash
JOB_ID="crawl-job-id-here"

curl -s "https://api.firecrawl.dev/v1/crawl/${JOB_ID}" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" | jq '.data[] | {url: .metadata.url, title: .metadata.title}'
```

### Crawl with Path Filters

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/crawl" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://blog.example.com",
    "limit": 20,
    "maxDepth": 3,
    "includePaths": ["/posts/*"],
    "excludePaths": ["/admin/*", "/login"]
  }' | jq .
```

**Crawl Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | Starting URL (required) |
| `limit` | number | Max pages to crawl (default: 100) |
| `maxDepth` | number | Max crawl depth (default: 3) |
| `includePaths` | array | Paths to include (e.g., `/blog/*`) |
| `excludePaths` | array | Paths to exclude |

---

## 3. Map - URL Discovery

Get all URLs from a website quickly.

### Basic Map

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/map" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }' | jq '.links[:10]'
```

### Map with Search Filter

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/map" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shop.example.com",
    "search": "product",
    "limit": 500
  }' | jq '.links'
```

**Map Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | Website URL (required) |
| `search` | string | Filter URLs containing keyword |
| `limit` | number | Max URLs to return (default: 1000) |

---

## 4. Search - Web Search

Search the web and get full page content.

### Basic Search

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/search" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI news 2024",
    "limit": 5
  }' | jq '.data[] | {title: .metadata.title, url: .url}'
```

### Search with Full Content

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/search" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning tutorials",
    "limit": 3,
    "scrapeOptions": {
      "formats": ["markdown"]
    }
  }' | jq '.data[] | {title: .metadata.title, content: .markdown[:500]}'
```

**Search Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query (required) |
| `limit` | number | Number of results (default: 10) |
| `scrapeOptions` | object | Options for scraping results |

---

## 5. Extract - AI Data Extraction

Extract structured data from pages using AI.

### Basic Extract

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/extract" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com/product/123"],
    "prompt": "Extract the product name, price, and description"
  }' | jq '.data'
```

### Extract with Schema

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/extract" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com/product/123"],
    "prompt": "Extract product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "price": {"type": "number"},
        "currency": {"type": "string"},
        "inStock": {"type": "boolean"}
      }
    }
  }' | jq '.data'
```

### Extract from Multiple URLs

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/extract" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com/product/1",
      "https://example.com/product/2"
    ],
    "prompt": "Extract product name and price"
  }' | jq '.data'
```

**Extract Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `urls` | array | URLs to extract from (required) |
| `prompt` | string | Description of data to extract (required) |
| `schema` | object | JSON schema for structured output |

---

## Practical Examples

### Scrape Documentation

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/scrape" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.python.org/3/tutorial/",
    "formats": ["markdown"],
    "onlyMainContent": true
  }' | jq -r '.data.markdown' > python-tutorial.md
```

### Find All Blog Posts

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/map" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://blog.example.com",
    "search": "post"
  }' | jq -r '.links[]'
```

### Research a Topic

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/search" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "best practices REST API design 2024",
    "limit": 5,
    "scrapeOptions": {"formats": ["markdown"]}
  }' | jq '.data[] | {title: .metadata.title, url: .url}'
```

### Extract Pricing Data

```bash
curl -s -X POST "https://api.firecrawl.dev/v1/extract" \
  -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com/pricing"],
    "prompt": "Extract all pricing tiers with name, price, and features"
  }' | jq '.data'
```

### Poll Crawl Until Complete

```bash
JOB_ID="your-crawl-job-id"

while true; do
  STATUS=$(curl -s "https://api.firecrawl.dev/v1/crawl/${JOB_ID}" \
    -H "Authorization: Bearer ${FIRECRAWL_API_KEY}" | jq -r '.status')
  echo "Status: $STATUS"
  [ "$STATUS" = "completed" ] && break
  sleep 5
done
```

---

## Response Format

### Scrape Response

```json
{
  "success": true,
  "data": {
    "markdown": "# Page Title\n\nContent...",
    "metadata": {
      "title": "Page Title",
      "description": "...",
      "url": "https://..."
    }
  }
}
```

### Crawl Status Response

```json
{
  "success": true,
  "status": "completed",
  "completed": 50,
  "total": 50,
  "data": [...]
}
```

---

## Guidelines

1. **Rate limits**: Add delays between requests to avoid 429 errors
2. **Crawl limits**: Set reasonable `limit` values to control API usage
3. **Main content**: Use `onlyMainContent: true` for cleaner output
4. **Async crawls**: Large crawls are async; poll `/crawl/{id}` for status
5. **Extract prompts**: Be specific for better AI extraction results
6. **Check success**: Always check `success` field in responses
