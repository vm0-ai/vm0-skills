---
name: clado
description: Clado API for searching and enriching a B2B people graph for prospecting and recruiting. Use when user mentions "Clado", "people search", "find a contact", or wants targeted lead lists from a structured query.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CLADO_TOKEN` or `zero doctor check-connector --url https://search.clado.ai/api/search --method POST`.

## How to Use

Clado authenticates with a Bearer token. The base URL is
`https://search.clado.ai`.

### 1. Search people by role + company

Write to `/tmp/clado_request.json`:

```json
{
  "query": "VP of Engineering at series B SaaS companies in the Bay Area",
  "limit": 20
}
```

Then run:

```bash
curl -s -X POST "https://search.clado.ai/api/search" \
  -H "Authorization: Bearer $CLADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/clado_request.json
```

### 2. Search with structured filters

Write to `/tmp/clado_request.json`:

```json
{
  "filters": {
    "title": "Head of Sales",
    "industry": "Fintech",
    "company_size": ["51-200", "201-500"],
    "location": ["United States"]
  },
  "limit": 50
}
```

Then run:

```bash
curl -s -X POST "https://search.clado.ai/api/search" \
  -H "Authorization: Bearer $CLADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/clado_request.json
```

### 3. Enrich a known person (by name + company)

Write to `/tmp/clado_request.json`:

```json
{
  "name": "Patrick Collison",
  "company": "Stripe"
}
```

Then run:

```bash
curl -s -X POST "https://search.clado.ai/api/enrich" \
  -H "Authorization: Bearer $CLADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/clado_request.json
```

### 4. Get account / quota info

```bash
curl -s "https://search.clado.ai/api/account" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

## Guidelines

1. **Natural-language `query` works** — Clado parses prompts like "founders of AI startups in NYC".
2. **Combine with Hunter** — Clado gives you names; Hunter resolves verified emails.
3. **Pagination** — most endpoints accept `cursor` / `limit`; default `limit` is 10.
4. **Compliance** — surfaces public profile data; check your jurisdiction before bulk outreach (GDPR, CASL, etc.).
5. **Cache results** — Clado credits are per call; cache (person_id, snapshot_date) pairs to avoid repeat lookups.
