name: browserless
description: Headless browser as a service for screenshots, PDFs, scraping, and automation
vm0_env:
  - BROWSERLESS_API_TOKEN

---

# Browserless

Headless Chrome browser as a service. Take screenshots, generate PDFs, scrape JS-rendered pages, and run Puppeteer/Playwright scripts without managing browser infrastructure.

> Official docs: https://docs.browserless.io/

---

## When to Use

Use this skill when you need to:

- Scrape JavaScript-heavy pages (React, Vue, Angular)
- Take full-page or element screenshots
- Generate PDFs from web pages
- Execute custom JavaScript in a browser context
- Bypass bot detection with stealth mode
- Run Puppeteer/Playwright scripts in the cloud

---

## Prerequisites

1. Create an account at https://www.browserless.io/
2. Get your API token from https://account.browserless.io/

Set environment variable:

```bash
export BROWSERLESS_API_TOKEN="your-api-token-here"
```

---

## How to Use

### 1. Scrape Data (CSS Selectors)

Extract structured JSON using CSS selectors:

```bash
curl -s -X POST "https://production-sfo.browserless.io/scrape?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "elements": [
      {"selector": "h1"},
      {"selector": "p"}
    ]
  }' | jq .
```

**With wait options:**

```bash
curl -s -X POST "https://production-sfo.browserless.io/scrape?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://news.ycombinator.com",
    "elements": [{"selector": ".titleline > a"}],
    "gotoOptions": {
      "waitUntil": "networkidle2",
      "timeout": 30000
    }
  }' | jq '.data[0].results[:3]'
```

### 2. Take Screenshots

**Full page screenshot:**

```bash
curl -s -X POST "https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "fullPage": true,
      "type": "png"
    }
  }' --output screenshot.png
```

**Element screenshot:**

```bash
curl -s -X POST "https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "type": "png"
    },
    "selector": "h1"
  }' --output element.png
```

**With viewport size:**

```bash
curl -s -X POST "https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "viewport": {
      "width": 1920,
      "height": 1080
    },
    "options": {
      "type": "jpeg",
      "quality": 80
    }
  }' --output screenshot.jpg
```

### 3. Generate PDF

```bash
curl -s -X POST "https://production-sfo.browserless.io/pdf?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "format": "A4",
      "printBackground": true,
      "margin": {
        "top": "1cm",
        "bottom": "1cm"
      }
    }
  }' --output page.pdf
```

### 4. Get Rendered HTML

Get fully rendered HTML after JavaScript execution:

```bash
curl -s -X POST "https://production-sfo.browserless.io/content?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "gotoOptions": {
      "waitUntil": "networkidle0"
    }
  }'
```

### 5. Execute Custom JavaScript

Run JavaScript in the browser and get results:

```bash
curl -s -X POST "https://production-sfo.browserless.io/function?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "code": "module.exports = async ({ page }) => { await page.goto(\"https://example.com\"); return await page.title(); }"
  }' | jq .
```

**Extract data with custom script:**

```bash
curl -s -X POST "https://production-sfo.browserless.io/function?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "code": "module.exports = async ({ page }) => { await page.goto(\"https://news.ycombinator.com\"); return await page.$$eval(\".titleline > a\", links => links.slice(0,5).map(a => ({title: a.innerText, url: a.href}))); }"
  }' | jq .
```

### 6. Unblock Protected Sites

Bypass bot detection:

```bash
curl -s -X POST "https://production-sfo.browserless.io/unblock?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "browserWSEndpoint": false,
    "cookies": false,
    "content": true,
    "screenshot": false
  }' | jq .
```

### 7. Download Files

Trigger and capture file downloads:

```bash
curl -s -X POST "https://production-sfo.browserless.io/download?token=${BROWSERLESS_API_TOKEN}" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/file.pdf"
  }' --output downloaded.pdf
```

### 8. Stealth Mode

Enable stealth mode to avoid detection:

```bash
curl -s -X POST "https://production-sfo.browserless.io/scrape?token=${BROWSERLESS_API_TOKEN}&stealth=true" \
  --header "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "elements": [{"selector": "body"}]
  }' | jq .
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scrape` | POST | Extract data with CSS selectors |
| `/screenshot` | POST | Capture screenshots (PNG/JPEG) |
| `/pdf` | POST | Generate PDF documents |
| `/content` | POST | Get rendered HTML |
| `/function` | POST | Execute custom Puppeteer code |
| `/unblock` | POST | Bypass bot protection |
| `/download` | POST | Download files |

---

## Common Options

### gotoOptions

Control page navigation:

```json
{
  "gotoOptions": {
    "waitUntil": "networkidle2",
    "timeout": 30000
  }
}
```

**waitUntil values:**
- `load` - Wait for load event
- `domcontentloaded` - Wait for DOMContentLoaded
- `networkidle0` - No network connections for 500ms
- `networkidle2` - Max 2 network connections for 500ms

### waitFor Options

```json
{
  "waitForTimeout": 1000,
  "waitForSelector": {"selector": ".loaded", "timeout": 5000},
  "waitForFunction": {"fn": "() => document.ready", "timeout": 5000}
}
```

### Viewport

```json
{
  "viewport": {
    "width": 1920,
    "height": 1080,
    "deviceScaleFactor": 2
  }
}
```

---

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| `token` | API token (required) |
| `stealth` | Enable stealth mode (`true`/`false`) |
| `blockAds` | Block advertisements |
| `proxy` | Use proxy server |

---

## Response Format

**Scrape response:**

```json
{
  "data": [
    {
      "selector": "h1",
      "results": [
        {
          "text": "Example Domain",
          "html": "Example Domain",
          "attributes": [{"name": "class", "value": "title"}],
          "width": 400,
          "height": 50,
          "top": 100,
          "left": 50
        }
      ]
    }
  ]
}
```

---

## Guidelines

1. **waitUntil**: Use `networkidle2` for most pages, `networkidle0` for SPAs
2. **Timeouts**: Default is 30s; increase for slow pages
3. **Stealth Mode**: Enable for sites with bot detection
4. **Screenshots**: Use `jpeg` with quality 80 for smaller files
5. **Rate Limits**: Check your plan limits at https://account.browserless.io/
6. **Regions**: Use region-specific endpoints for better latency:
   - `production-sfo.browserless.io` (US West)
   - `production-lon.browserless.io` (Europe)
