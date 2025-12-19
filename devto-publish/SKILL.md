---
name: devto-publish
description: Publish articles to Dev.to. Use this skill when the article is ready and user wants to publish.
---

# Dev.to Publisher

This skill publishes articles to Dev.to using their official API.

## When to Use

Use this skill when:
- You have a markdown article ready to publish
- You want to publish content to Dev.to platform

## Prerequisites

The `DEVTO_API_KEY` environment variable must be set with your Dev.to API key.

To get your API key:
1. Go to https://dev.to/settings/extensions
2. Scroll to "DEV Community API Keys"
3. Enter a description and click "Generate API Key"
4. Copy the key

## How to Use

```bash
scripts/devto-publish.sh <article_file> [--title "Title"] [--tags "tag1,tag2,tag3"] [--published true|false] [--image url]
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| article_file | Yes | - | Path to markdown file |
| --title | No | From file | Article title (overrides H1 in file) |
| --tags | No | - | Comma-separated tags (max 4) |
| --published | No | false | Set to `true` to publish immediately |
| --image | No | - | Cover image URL |

### Examples

```bash
# Publish as draft
scripts/devto-publish.sh article.md --tags "javascript,webdev"

# Publish immediately with cover image
scripts/devto-publish.sh article.md \
  --tags "ai,tech" \
  --image "https://example.com/cover.png" \
  --published true
```

## Response

Returns the Dev.to article URL on success.

Response saved to `/tmp/devto/publish_response.json`:
```json
{
  "id": 123456,
  "title": "Article Title",
  "url": "https://dev.to/username/article-slug",
  "published": true
}
```

**Always report the `url` back to the user after successful publishing.**

## Guidelines

1. Dev.to supports up to 4 tags per post
2. Tags should be lowercase, no spaces
3. Cover images must be URLs (not local file paths)
4. Markdown is fully supported including code blocks with syntax highlighting
