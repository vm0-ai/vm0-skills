---
name: nyne
description: Nyne API for async people search, contact and company enrichment, social-profile lookup, and persona graphs. Use when user mentions "Nyne", "people enrichment", "company enrichment", "social profile lookup", or wants async B2B prospecting data.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NYNE_API_KEY` or `zero doctor check-connector --url https://api.nyne.ai/person/search --method POST`.

## How to Use

Nyne authenticates with **two headers** on every request:

- `X-API-Key: $NYNE_API_KEY`
- `X-API-Secret: $NYNE_API_SECRET`

The base URL is `https://api.nyne.ai`. Full reference:
<https://api.nyne.ai/documentation>.

Most endpoints are asynchronous: a `POST` returns a `request_id`, then you
poll with `GET <same path>?request_id=...`. You can also pass a
`callback_url` to receive results via webhook.

### 1. People search (async)

Start a job:

```bash
curl -s -X POST "https://api.nyne.ai/person/search" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"query": "Heads of Procurement at Fortune 500 manufacturers in Germany", "type": "premium", "limit": 25, "show_emails": true}'
```

Poll for results:

```bash
curl -s -G "https://api.nyne.ai/person/search" \
  --data-urlencode "request_id=$REQUEST_ID" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET"
```

### 2. Enrich a person by email / phone / LinkedIn URL

```bash
curl -s -X POST "https://api.nyne.ai/person/enrichment" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "person@example.com", "callback_url": "https://your.app/webhook/nyne"}'
```

Then poll:

```bash
curl -s -G "https://api.nyne.ai/person/enrichment" \
  --data-urlencode "request_id=$REQUEST_ID" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET"
```

### 3. Find social profiles by email or phone

```bash
curl -s -X POST "https://api.nyne.ai/person/social-profiles" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email": "person@example.com"}'
```

### 4. Persona / interests graph (async)

```bash
curl -s -X POST "https://api.nyne.ai/person/interests" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"linkedin_url": "https://www.linkedin.com/in/patrickcollison"}'
```

### 5. Company search (async)

```bash
curl -s -X POST "https://api.nyne.ai/company/search" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"industry": "SaaS", "location": "San Francisco", "max_results": 5}'
```

### 6. Enrich a company by domain

```bash
curl -s -X POST "https://api.nyne.ai/company/enrichment" \
  -H "X-API-Key: $NYNE_API_KEY" \
  -H "X-API-Secret: $NYNE_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"domain": "stripe.com"}'
```

## Guidelines

1. **Two-header auth** — every request needs both `X-API-Key` and `X-API-Secret`; do not use `Authorization: Bearer`.
2. **Async pattern** — for `POST` endpoints, capture the returned `request_id` and `GET` the same path with `?request_id=...` to retrieve results.
3. **Webhooks beat polling** — pass `callback_url` in the `POST` body for long-running jobs (search, enrichment, persona) and skip the polling loop.
4. **`show_emails: true`** — required on `person/search` if you want email addresses in results; without it you get profile data only.
5. **Cache results** — Nyne credits are per request; cache (email-or-linkedin, snapshot_date) pairs to avoid repeat lookups.
