---
name: clado
description: Clado API for natural-language LinkedIn-style people search, deep async research, and contact enrichment. Use when user mentions "Clado", "people search", "find a LinkedIn profile", "find an email", or wants targeted lead lists from a structured query.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CLADO_TOKEN` or `zero doctor check-connector --url https://search.clado.ai/api/credits --method GET`.

## How to Use

Clado authenticates with a Bearer token. The base URL is
`https://search.clado.ai`. Full reference:
<https://docs.clado.ai/api-reference/introduction>.

### 1. Natural-language people search (synchronous)

```bash
curl -s -G "https://search.clado.ai/api/search" \
  --data-urlencode "query=VP of Engineering at series B SaaS companies in the Bay Area" \
  --data-urlencode "limit=20" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

### 2. Deep research search (asynchronous)

Kick off a job:

```bash
curl -s -X POST "https://search.clado.ai/api/search/deep_research" \
  -H "Authorization: Bearer $CLADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Heads of Procurement at Fortune 500 manufacturers in Germany", "limit": 50}'
```

Poll for status / results:

```bash
curl -s "https://search.clado.ai/api/search/deep_research/$JOB_ID" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

Continue the same job with more results:

```bash
curl -s -X POST "https://search.clado.ai/api/search/deep_research/$JOB_ID/more" \
  -H "Authorization: Bearer $CLADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"additional_limit": 50}'
```

### 3. Enrich a LinkedIn profile

Find email + phone for a known LinkedIn URL:

```bash
curl -s -G "https://search.clado.ai/api/enrich/contacts" \
  --data-urlencode "linkedin_url=https://www.linkedin.com/in/patrickcollison" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

Real-time LinkedIn scrape (fresh data, costs more credits):

```bash
curl -s -G "https://search.clado.ai/api/enrich/scrape" \
  --data-urlencode "linkedin_url=https://www.linkedin.com/in/patrickcollison" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

Cached LinkedIn profile (cheaper, may be stale):

```bash
curl -s -G "https://search.clado.ai/api/enrich/linkedin" \
  --data-urlencode "linkedin_url=https://www.linkedin.com/in/patrickcollison" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

### 4. Check remaining credits

```bash
curl -s "https://search.clado.ai/api/credits" \
  -H "Authorization: Bearer $CLADO_TOKEN"
```

## Guidelines

1. **Natural-language `query` works** — Clado parses prompts like "founders of AI startups in NYC".
2. **Sync vs deep research** — `/api/search` returns fast top results; `/api/search/deep_research` digs deeper but is asynchronous.
3. **Scrape vs cached** — `/enrich/scrape` is real-time but expensive; prefer `/enrich/linkedin` (cached) unless freshness matters.
4. **Combine with Hunter** — Clado gives you names + LinkedIn URLs; `/enrich/contacts` resolves verified emails and phones directly.
5. **Compliance** — surfaces public profile data; check your jurisdiction before bulk outreach (GDPR, CASL, etc.).
6. **Cache results** — Clado credits are per call; cache (linkedin_url, snapshot_date) pairs to avoid repeat lookups.
