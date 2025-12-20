---
name: firecrawl
description: Web scraping and crawling API for AI. Use this skill to scrape webpages, crawl entire websites, discover URLs, search the web, or extract structured data from pages. Ideal for gathering web content for LLM processing.
vm0_env:
  - FIRECRAWL_API_KEY
---

# Firecrawl

Turn websites into LLM-ready markdown or structured data. Firecrawl is a powerful web data API designed for AI applications.

## When to Use

- Scrape a single webpage and convert to markdown/html
- Crawl an entire website and extract all pages
- Discover all URLs on a website quickly
- Search the web and get full page content
- Extract structured data from pages using AI
- Gather training data or research content
- Monitor competitor websites or prices

## Prerequisites

Set the `FIRECRAWL_API_KEY` environment variable:

```bash
export FIRECRAWL_API_KEY=fc-your-api-key
```

Get your API key from: https://www.firecrawl.dev/

## How to Use

### Script Location

The script is located at `scripts/firecrawl.sh` relative to this skill file.

### Global Options

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| --output-dir | No | `$TMPDIR/firecrawl` | Output directory for results |

### Commands

The script supports 5 operations: `scrape`, `crawl`, `map`, `search`, `extract`

### 1. Scrape - Single Page

Extract content from a single webpage.

```bash
firecrawl.sh scrape "https://example.com"
firecrawl.sh scrape "https://example.com" --format html
firecrawl.sh scrape "https://example.com" --format markdown --main-only
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| url | Yes | - | URL to scrape |
| --format | No | markdown | Output format: markdown, html, rawHtml, screenshot, links |
| --main-only | No | false | Extract only main content, skip headers/footers |
| --timeout | No | 30000 | Request timeout in milliseconds |

### 2. Crawl - Entire Website

Crawl all pages of a website (async operation).

```bash
firecrawl.sh crawl "https://example.com"
firecrawl.sh crawl "https://example.com" --limit 50 --depth 2
firecrawl.sh crawl "https://example.com" --include "/blog/*" --exclude "/admin/*"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| url | Yes | - | Starting URL to crawl |
| --limit | No | 100 | Maximum number of pages to crawl |
| --depth | No | 3 | Maximum crawl depth |
| --include | No | - | Path pattern to include (e.g., /blog/*) |
| --exclude | No | - | Path pattern to exclude (e.g., /admin/*) |
| --wait | No | true | Wait for crawl to complete |

### 3. Map - URL Discovery

Get a list of all URLs on a website quickly.

```bash
firecrawl.sh map "https://example.com"
firecrawl.sh map "https://example.com" --search "product"
firecrawl.sh map "https://example.com" --limit 500
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| url | Yes | - | Website URL to map |
| --search | No | - | Filter URLs containing this keyword |
| --limit | No | 1000 | Maximum URLs to return |

### 4. Search - Web Search

Search the web and get full page content.

```bash
firecrawl.sh search "AI news 2024"
firecrawl.sh search "machine learning tutorials" --limit 5
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| query | Yes | - | Search query string |
| --limit | No | 10 | Number of results |
| --format | No | markdown | Content format for results |

### 5. Extract - AI Data Extraction

Extract structured data from pages using AI.

```bash
firecrawl.sh extract "https://example.com/product" --prompt "Extract product name and price"
firecrawl.sh extract "https://example.com/*" --prompt "Extract all article titles and dates"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| url | Yes | - | URL or URL pattern (use /* for multiple pages) |
| --prompt | Yes | - | Natural language description of data to extract |
| --schema | No | - | JSON schema for structured output |

## Output

Results are saved to the output directory (default: `$TMPDIR/firecrawl`):

```bash
# Save to temp directory (default)
firecrawl.sh scrape "https://example.com"

# Save to specific directory
firecrawl.sh --output-dir ./output scrape "https://example.com"
```

| Operation | Output Files |
|-----------|-------------|
| scrape | `scrape_[timestamp].json`, `scrape_[timestamp].md` |
| crawl | `crawl_[job_id].json` |
| map | `map_[timestamp].json` |
| search | `search_[timestamp].json` |
| extract | `extract_[timestamp].json` |

## Examples

### Scrape a documentation page

```bash
firecrawl.sh scrape "https://docs.example.com/api" --format markdown --main-only
```

### Crawl a blog

```bash
firecrawl.sh crawl "https://blog.example.com" --include "/posts/*" --limit 20
```

### Find all product pages

```bash
firecrawl.sh map "https://shop.example.com" --search "product"
```

### Research a topic

```bash
firecrawl.sh search "best practices for API design" --limit 5
```

### Extract product data

```bash
firecrawl.sh extract "https://shop.example.com/product/123" \
  --prompt "Extract product name, price, description, and availability"
```

## Guidelines

1. **Rate Limits**: Be mindful of API rate limits (429 errors). Add delays between requests if needed.
2. **Crawl Limits**: Set reasonable `--limit` values to avoid excessive API usage.
3. **Main Content**: Use `--main-only` for cleaner output without navigation/footer.
4. **Async Crawls**: Large crawls run asynchronously. The script polls for completion.
5. **Extract Prompts**: Be specific in extraction prompts for better results.
6. **Error Handling**: Check output JSON for error messages on failures.

## API Reference

- Documentation: https://docs.firecrawl.dev/
- Scrape API: https://docs.firecrawl.dev/features/scrape
- Crawl API: https://docs.firecrawl.dev/features/crawl
- Map API: https://docs.firecrawl.dev/features/map
- Extract API: https://docs.firecrawl.dev/features/extract
