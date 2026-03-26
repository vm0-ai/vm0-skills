---
name: gamma
description: Gamma API for creating presentations, documents, and websites from text. Use when user mentions "Gamma", "create presentation", "generate slides", "make a deck", "create a document with Gamma", or "generate a webpage".
vm0_secrets:
  - GAMMA_TOKEN
---

# Gamma API

Generate polished presentations, documents, websites, and social posts from text using Gamma's AI-powered API. Supports custom themes, export formats (PDF, PPTX, PNG), and asynchronous generation with status polling.

> Official docs: `https://developers.gamma.app`

---

## When to Use

Use this skill when you need to:

- Generate a presentation or slide deck from an outline or topic description
- Create a document or webpage using AI from text input
- Generate branded content using a specific Gamma theme
- Export presentations to PDF or PPTX
- Batch-produce content variations from a fixed template

---

## Prerequisites


> **Important:** When using `$GAMMA_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

---

## Core APIs

### 1. Create Generation (from text)

Generates a presentation, document, website, or social post from text input. Generation is asynchronous — use the returned `generationId` to poll for status.

Write to `/tmp/gamma_request.json`:

```json
{
  "inputText": "Your outline or topic text here",
  "textMode": "generate",
  "format": "presentation",
  "numCards": 10,
  "textOptions": {
    "amount": "medium",
    "language": "en"
  },
  "imageOptions": {
    "source": "pexels"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://public-api.gamma.app/v1.0/generations" --header "X-API-KEY: $GAMMA_TOKEN" --header "Content-Type: application/json" -d @/tmp/gamma_request.json'
```

Response includes `generationId`. Use it to poll for status (see below).

**`textMode` options:**
- `generate` — AI rewrites the input into polished content
- `condense` — compress verbose input
- `preserve` — keep the original text structure

**`format` options:** `presentation`, `document`, `social`, `webpage`

**`exportAs` options (optional):** `pdf`, `pptx`, `png`

---

### 2. Poll Generation Status

Poll every 5 seconds until `status` is `completed` or `failed`.

```bash
curl -s "https://public-api.gamma.app/v1.0/generations/<your-generation-id>" --header "X-API-KEY: $(printenv GAMMA_TOKEN)"
```

**Pending response:**
```json
{ "generationId": "...", "status": "pending" }
```

**Completed response:**
```json
{
  "generationId": "...",
  "status": "completed",
  "gammaId": "...",
  "gammaUrl": "https://gamma.app/docs/...",
  "exportUrl": "https://gamma.app/export/...",
  "credits": { "deducted": 5, "remaining": 195 }
}
```

`gammaUrl` is the shareable link. `exportUrl` (when `exportAs` was set) is a signed download URL valid for ~1 week.

---

### 3. Create Generation from Template

Generate content using an existing Gamma template. The template must be a single-page document.

Write to `/tmp/gamma_template_request.json`:

```json
{
  "prompt": "Describe what content to fill into the template",
  "gammaId": "<your-template-gamma-id>",
  "imageOptions": {
    "style": "professional photography"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://public-api.gamma.app/v1.0/generations/from-template" --header "X-API-KEY: $GAMMA_TOKEN" --header "Content-Type: application/json" -d @/tmp/gamma_template_request.json'
```

Response includes `generationId` — poll with the same status endpoint.

---

### 4. List Themes

Retrieve available workspace themes to use as `themeId` in generation requests.

```bash
curl -s "https://public-api.gamma.app/v1.0/themes" --header "X-API-KEY: $(printenv GAMMA_TOKEN)"
```

With search filter:

```bash
curl -s "https://public-api.gamma.app/v1.0/themes?query=dark&limit=10" --header "X-API-KEY: $(printenv GAMMA_TOKEN)"
```

Use the `id` field value as `themeId` in generation requests.

---

### 5. List Folders

Retrieve workspace folders to use as `folderIds` in generation requests.

```bash
curl -s "https://public-api.gamma.app/v1.0/folders" --header "X-API-KEY: $(printenv GAMMA_TOKEN)"
```

Use the `id` field value in the `folderIds` array in generation requests.

---

## Advanced Generation Options

### With theme, folder, and sharing

Write to `/tmp/gamma_request.json`:

```json
{
  "inputText": "Q1 2025 Product Roadmap\n---\nGoals\n---\nKey Initiatives\n---\nTimeline",
  "textMode": "preserve",
  "format": "presentation",
  "themeId": "<your-theme-id>",
  "folderIds": ["<your-folder-id>"],
  "exportAs": "pdf",
  "cardOptions": {
    "dimensions": "16x9"
  },
  "sharingOptions": {
    "externalAccess": "view"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://public-api.gamma.app/v1.0/generations" --header "X-API-KEY: $GAMMA_TOKEN" --header "Content-Type: application/json" -d @/tmp/gamma_request.json'
```

Use `\n---\n` in `inputText` to manually split slides/cards.

---

## Guidelines

1. **Async pattern**: Generation always returns a `generationId` first. Always poll `GET /v1.0/generations/<id>` until `status` is `completed` or `failed`. Poll every 5 seconds.
2. **Credits**: Text costs 1–3 credits per card; AI-generated images cost 2–125 credits per image. Check `credits.remaining` in the completed response.
3. **Rate limits**: Responses include `x-ratelimit-remaining` headers. On 429, pause 30+ seconds before retrying.
4. **Export URLs**: Signed `exportUrl` values expire in ~1 week. Download promptly if needed.
5. **Image URLs in input**: Any image URLs embedded in `inputText` must be long-lived (signed URLs need 7+ day expiration).
6. **Plan requirement**: API access requires Pro, Ultra, Teams, or Business plan.
