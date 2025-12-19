---
name: rss-fetch
description: Fetch and parse RSS feeds from provided URLs. Use this skill when you need to gather news articles from RSS sources.
---

# RSS Feed Fetcher

This skill fetches and parses RSS feeds from provided URLs, extracting article titles, descriptions, links, and publication dates.

## When to Use

Use this skill when:
- Need to gather recent news articles from RSS feeds
- Want to collect content from multiple sources
- Building a content pipeline from RSS sources

## How to Use

Execute the script with RSS feed URLs as arguments:

```bash
scripts/rss-fetch.sh "url1" "url2" "url3" ...
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| urls | Yes | One or more RSS feed URLs to fetch |

### Example

```bash
scripts/rss-fetch.sh \
  "https://example.com/feed.xml" \
  "https://blog.example.org/rss"
```

## Output

Results are saved to `/tmp/rss/feeds.json` with this structure:

```json
{
  "fetched_at": "2024-01-15T10:30:00Z",
  "sources": ["example.com", "blog.example.org"],
  "articles": [
    {
      "title": "Article Title",
      "description": "Article summary...",
      "link": "https://example.com/article",
      "pubDate": "2024-01-15T09:00:00Z",
      "source": "example.com"
    }
  ]
}
```

After fetching, read `/tmp/rss/feeds.json` to see all available articles.

## Guidelines

1. Pass all RSS URLs as arguments to fetch from multiple sources
2. After fetching, analyze the articles to find relevant topics
3. Use the article links as sources for your generated content
