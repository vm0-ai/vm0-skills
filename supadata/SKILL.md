---
name: supadata
description: Supadata API via curl. Use this skill to extract transcripts from YouTube/TikTok/Instagram videos and scrape web content to markdown.
vm0_env:
  - SUPADATA_API_KEY
---

# Supadata API

Use the Supadata API via direct `curl` calls to **extract video transcripts** and **scrape web content** for AI applications.

> Official docs: `https://docs.supadata.ai/`

---

## When to Use

Use this skill when you need to:

- **Extract transcripts** from YouTube, TikTok, Instagram, X (Twitter), Facebook videos
- **Scrape web pages** to markdown format for AI processing
- **Get video/channel metadata** from social platforms
- **Crawl websites** to extract content from multiple pages

---

## Prerequisites

1. Sign up at [Supadata Dashboard](https://dash.supadata.ai/)
2. API key is automatically generated on signup (no credit card required)
3. Store your API key in environment variable

```bash
export SUPADATA_API_KEY="your-api-key"
```

### Pricing

- Transcript fetch (existing): 1 credit
- Transcript generation (AI): 2 credits/minute
- Free tier available

---

## How to Use

All examples below assume you have `SUPADATA_API_KEY` set.

The base URL for the API is:

- `https://api.supadata.ai/v1`

Authentication uses the `x-api-key` header.

---

### 1. Get YouTube Video Transcript

Extract transcript from a YouTube video:

```bash
curl -s "https://api.supadata.ai/v1/transcript" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -d "text=true" > /tmp/resp_1d1784.json
cat /tmp/resp_1d1784.json | jq .
```

**Parameters:**

- `url`: Video URL (required)
- `text`: Return plain text (`true`) or timestamped chunks (`false`, default)
- `lang`: Preferred language (ISO 639-1 code, e.g., `en`, `zh`)
- `mode`: `native` (existing only), `generate` (AI), `auto` (default)

---

### 2. Get Transcript with Timestamps

Get transcript with timing information:

```bash
curl -s "https://api.supadata.ai/v1/transcript" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -d "text=false" > /tmp/resp_c5aea7.json
cat /tmp/resp_c5aea7.json | jq '.content[:3]'
```

Response format:
```json
{
  "content": [
  {"text": "Hello", "offset": 0, "duration": 1500, "lang": "en"}
  ],
  "lang": "en",
  "availableLangs": ["en", "es", "zh"]
}
```

---

### 3. Get TikTok/Instagram/X Transcript

Extract transcript from other platforms:

```bash
# TikTok
curl -s "https://api.supadata.ai/v1/transcript" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.tiktok.com/@user/video/1234567890" -d "text=true" > /tmp/resp_3c629f.json
cat /tmp/resp_3c629f.json | jq .

# Instagram Reel
curl -s "https://api.supadata.ai/v1/transcript" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.instagram.com/reel/ABC123/" -d "text=true" > /tmp/resp_d2ba1b.json
cat /tmp/resp_d2ba1b.json | jq .
```

Supported platforms: YouTube, TikTok, Instagram, X (Twitter), Facebook

---

### 4. Native Transcript Only (Save Credits)

Fetch only existing transcripts without AI generation:

```bash
curl -s "https://api.supadata.ai/v1/transcript" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -d "text=true" -d "mode=native" > /tmp/resp_3de8c3.json
cat /tmp/resp_3de8c3.json | jq .
```

Use `mode=native` to avoid AI generation costs (1 credit vs 2 credits/min).

---

### 5. Get YouTube Channel Metadata

Get channel information:

```bash
curl -s "https://api.supadata.ai/v1/youtube/channel" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "id=@mkbhd" > /tmp/resp_bb5de4.json
cat /tmp/resp_bb5de4.json | jq '{name, subscriberCount, videoCount}'
```

Accepts channel URL, channel ID, or handle (e.g., `@mkbhd`).

---

### 6. Get YouTube Video Metadata

Get video information:

```bash
curl -s "https://api.supadata.ai/v1/youtube/video" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" > /tmp/resp_8a70f9.json
cat /tmp/resp_8a70f9.json | jq '{title, viewCount, likeCount, duration}'
```

---

### 7. Get Social Media Metadata

Get metadata from any supported platform:

```bash
curl -s "https://api.supadata.ai/v1/metadata" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.tiktok.com/@user/video/1234567890" > /tmp/resp_3d4674.json
cat /tmp/resp_3d4674.json | jq .
```

Works with YouTube, TikTok, Instagram, X, Facebook posts.

---

### 8. Scrape Web Page to Markdown

Extract web page content:

```bash
curl -s "https://api.supadata.ai/v1/web/scrape" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://example.com" > /tmp/resp_ce20a1.json
cat /tmp/resp_ce20a1.json | jq .
```

Returns page content in Markdown format, ideal for AI processing.

---

### 9. Map Website Links

Get all links from a website:

```bash
curl -s "https://api.supadata.ai/v1/web/map" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://example.com" > /tmp/resp_ed6800.json
cat /tmp/resp_ed6800.json | jq '.links[:10]'
```

---

### 10. Crawl Website (Async)

Start a crawl job for multiple pages:

```bash
# Start crawl
curl -s "https://api.supadata.ai/v1/web/crawl" -X POST -H "x-api-key: ${SUPADATA_API_KEY}" -H "Content-Type: application/json" -d '{"url": "https://example.com", "maxPages": 10}' > /tmp/resp_crawl.json
JOB_ID=$(cat /tmp/resp_crawl.json | jq -r '.jobId')

echo "Job ID: ${JOB_ID}"

# Check status
curl -s "https://api.supadata.ai/v1/web/crawl/${JOB_ID}" -H "x-api-key: ${SUPADATA_API_KEY}" > /tmp/resp_99f142.json
cat /tmp/resp_99f142.json | jq '{status, pagesCompleted}'
```

Status values: `queued`, `active`, `completed`, `failed`

---

### 11. Translate Transcript

Translate a YouTube transcript to another language:

```bash
curl -s "https://api.supadata.ai/v1/youtube/transcript/translate" -H "x-api-key: ${SUPADATA_API_KEY}" -G --data-urlencode "url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" -d "lang=zh" -d "text=true" > /tmp/resp_f104e7.json
cat /tmp/resp_f104e7.json | jq .
```

---

## Response Handling

**Synchronous (HTTP 200):** Direct result returned.

**Asynchronous (HTTP 202):** Returns `jobId` for polling:
```json
{"jobId": "abc123"}
```

Poll the job endpoint until status is `completed`.

---

## Guidelines

1. **Use `mode=native` to save credits**: Only fetches existing transcripts
2. **URL encode parameters**: Use `--data-urlencode` for URLs
3. **Check available languages**: Response includes `availableLangs` array
4. **Handle async responses**: Some requests return job IDs for polling
5. **Max file size**: 1GB for direct file URLs
6. **Supported formats**: MP4, WEBM, MP3, FLAC, MPEG, M4A, OGG, WAV
