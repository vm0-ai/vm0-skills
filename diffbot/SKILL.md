---
name: diffbot
description: Diffbot API for extracting structured article, product, and entity data from web pages or its knowledge graph. Use when user mentions "Diffbot", "extract article", "scrape product", or wants clean structured data from a URL.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DIFFBOT_TOKEN` or `zero doctor check-connector --url https://api.diffbot.com/v3/article --method GET`.

## How to Use

Diffbot authenticates with an API token passed as the `token` query
parameter on every request. The base URL is `https://api.diffbot.com`.

### 1. Extract an article from a URL

```bash
curl -s -G "https://api.diffbot.com/v3/article" \
  --data-urlencode "url=https://www.bbc.com/news" \
  --data-urlencode "token=$DIFFBOT_TOKEN"
```

### 2. Extract a product listing

```bash
curl -s -G "https://api.diffbot.com/v3/product" \
  --data-urlencode "url=https://www.amazon.com/dp/B08N5WRWNW" \
  --data-urlencode "token=$DIFFBOT_TOKEN"
```

### 3. Auto-detect page type (Analyze API)

```bash
curl -s -G "https://api.diffbot.com/v3/analyze" \
  --data-urlencode "url=https://github.com/vm0-ai" \
  --data-urlencode "token=$DIFFBOT_TOKEN"
```

### 4. Knowledge Graph search (organizations, people)

```bash
curl -s -G "https://kg.diffbot.com/kg/v3/dql" \
  --data-urlencode "query=type:Organization name:\"Stripe\"" \
  --data-urlencode "size=5" \
  --data-urlencode "token=$DIFFBOT_TOKEN"
```

### 5. Enhance an entity (resolve a name to a knowledge-graph record)

```bash
curl -s -G "https://kg.diffbot.com/kg/v3/enhance" \
  --data-urlencode "type=Organization" \
  --data-urlencode "name=Anthropic" \
  --data-urlencode "token=$DIFFBOT_TOKEN"
```

## Guidelines

1. **Pick the narrowest endpoint** — `article` / `product` / `discussion` are faster and more accurate than `analyze`.
2. **Knowledge Graph uses `kg.diffbot.com`** — a separate host from the extraction APIs (`api.diffbot.com`).
3. **`fields=` parameter** — limit returned fields to reduce response size and credit cost.
4. **JavaScript rendering** — Diffbot already executes JS for SPAs; no need to pre-render.
5. **Rate limits** — 5 concurrent calls per token on standard plans; back off on `429`.
