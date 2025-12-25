name: devto-publish
description: Dev.to API via curl. Use this skill to publish and manage articles on Dev.to.
vm0_env:

- DEVTO_API_KEY

---

# Dev.to Publisher

Use the Dev.to API via direct `curl` calls to **publish and manage articles**.

> Official docs: `https://developers.forem.com/api/v1`

---

## When to Use

Use this skill when you need to:

- **Publish articles** to Dev.to
- **Update existing articles**
- **Manage drafts**
- **Fetch your published articles**

---

## Prerequisites

1. Go to https://dev.to/settings/extensions
2. Scroll to "DEV Community API Keys"
3. Generate a new API key

```bash
export DEVTO_API_KEY="your-api-key"
```

---


> **Important:** Do not pipe `curl` output directly to `jq` (e.g., `curl ... | jq`). Due to a Claude Code bug, environment variables in curl headers are silently cleared when pipes are used. Instead, use a two-step pattern:
> ```bash
> curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" > /tmp/response.json
> cat /tmp/response.json | jq .
> ```

## How to Use

All examples below assume you have `DEVTO_API_KEY` set.

### 1. Publish an Article

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "My Awesome Article",
  "body_markdown": "## Introduction\n\nThis is my article content.\n\n## Conclusion\n\nThanks for reading!",
  "published": false,
  "tags": ["javascript", "webdev"]
  }
  }' > /tmp/resp_67f890.json
cat /tmp/resp_67f890.json | jq '{id, url, published}'
```

**Response:**

```json
{
  "id": 123456,
  "url": "https://dev.to/username/my-awesome-article-abc",
  "published": false
}
```

### 2. Publish Immediately

Set `published: true` to publish right away:

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "Published Article",
  "body_markdown": "Content here...",
  "published": true,
  "tags": ["tutorial"]
  }
  }' > /tmp/resp_098390.json
cat /tmp/resp_098390.json | jq '{id, url, published}'
```

### 3. Publish with Cover Image

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "Article with Cover",
  "body_markdown": "Content here...",
  "published": true,
  "tags": ["webdev", "tutorial"],
  "main_image": "https://example.com/cover.png"
  }
  }' > /tmp/resp_3f6a97.json
cat /tmp/resp_3f6a97.json | jq '{id, url}'
```

### 4. Publish from Markdown File

```bash
TITLE="My Article Title"
CONTENT=$(cat article.md | jq -Rs '.')

curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d "{
  \"article\": {
  \"title\": \"${TITLE}\",
  \"body_markdown\": ${CONTENT},
  \"published\": false,
  \"tags\": [\"programming\"]
  }
  }" | jq '{id, url, published}'
```

---

## Managing Articles

### 5. Get Your Articles

```bash
curl -s "https://dev.to/api/articles/me?per_page=10" -H "api-key: ${DEVTO_API_KEY}" > /tmp/resp_b5e6b0.json
cat /tmp/resp_b5e6b0.json | jq '.[] | {id, title, published, url}'
```

### 6. Get Published Articles Only

```bash
curl -s "https://dev.to/api/articles/me/published?per_page=10" -H "api-key: ${DEVTO_API_KEY}" > /tmp/resp_4fbb7b.json
cat /tmp/resp_4fbb7b.json | jq '.[] | {id, title, url}'
```

### 7. Get Unpublished (Drafts)

```bash
curl -s "https://dev.to/api/articles/me/unpublished" -H "api-key: ${DEVTO_API_KEY}" > /tmp/resp_b0fd55.json
cat /tmp/resp_b0fd55.json | jq '.[] | {id, title}'
```

### 8. Get Single Article

```bash
ARTICLE_ID="123456"

curl -s "https://dev.to/api/articles/${ARTICLE_ID}" -H "api-key: ${DEVTO_API_KEY}" > /tmp/resp_677b7c.json
cat /tmp/resp_677b7c.json | jq '{id, title, url, published}'
```

### 9. Update an Article

```bash
ARTICLE_ID="123456"

curl -s -X PUT "https://dev.to/api/articles/${ARTICLE_ID}" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "Updated Title",
  "body_markdown": "Updated content..."
  }
  }' > /tmp/resp_3212f1.json
cat /tmp/resp_3212f1.json | jq '{id, url}'
```

### 10. Publish a Draft

```bash
ARTICLE_ID="123456"

curl -s -X PUT "https://dev.to/api/articles/${ARTICLE_ID}" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "published": true
  }
  }' > /tmp/resp_d10458.json
cat /tmp/resp_d10458.json | jq '{id, url, published}'
```

---

## Article Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | string | Article title (required) |
| `body_markdown` | string | Content in Markdown |
| `published` | boolean | `true` to publish, `false` for draft |
| `tags` | array | Up to 4 tags (lowercase, no spaces) |
| `main_image` | string | Cover image URL |
| `canonical_url` | string | Original article URL (for cross-posts) |
| `series` | string | Series name to group articles |

---

## Examples

### Tech Tutorial

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "Getting Started with Docker",
  "body_markdown": "## What is Docker?\n\nDocker is a platform for developing...\n\n## Installation\n\n```bash\nbrew install docker\n```\n\n## Your First Container\n\n```bash\ndocker run hello-world\n```",
  "published": true,
  "tags": ["docker", "devops", "tutorial", "beginners"]
  }
  }' > /tmp/resp_0c84dd.json
cat /tmp/resp_0c84dd.json | jq '{url}'
```

### Cross-post from Blog

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "My Blog Post",
  "body_markdown": "Content from my blog...",
  "published": true,
  "canonical_url": "https://myblog.com/original-post",
  "tags": ["webdev"]
  }
  }' > /tmp/resp_2bca75.json
cat /tmp/resp_2bca75.json | jq '{url}'
```

### Article in a Series

```bash
curl -s -X POST "https://dev.to/api/articles" -H "api-key: ${DEVTO_API_KEY}" -H "Content-Type: application/json" -d '{
  "article": {
  "title": "React Hooks - Part 1: useState",
  "body_markdown": "First part of the series...",
  "published": true,
  "series": "React Hooks Deep Dive",
  "tags": ["react", "javascript", "hooks"]
  }
  }' > /tmp/resp_405b32.json
cat /tmp/resp_405b32.json | jq '{url}'
```

---

## Guidelines

1. **Max 4 tags**: Dev.to limits articles to 4 tags
2. **Lowercase tags**: Tags should be lowercase without spaces
3. **Escape markdown**: Use `jq -Rs` to properly escape markdown content
4. **Cover images**: Must be URLs, not local files
5. **Draft first**: Set `published: false` to review before publishing
6. **Check response**: Always verify the returned URL
