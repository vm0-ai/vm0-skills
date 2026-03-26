---
name: ahrefs
description: Ahrefs SEO API for backlink and keyword analysis. Use when user mentions
  "SEO", "backlinks", "domain rating", "keyword research", or asks about site metrics.
vm0_secrets:
  - AHREFS_TOKEN
---

# Ahrefs API

Access SEO data including backlink profiles, domain ratings, organic keywords, and site metrics with the Ahrefs API v3.

> Official docs: `https://docs.ahrefs.com`

## When to Use

- Check domain or URL rating
- Analyze backlink profiles and referring domains
- Research organic keywords and rankings
- Get site traffic estimates
- Monitor competitor SEO metrics

## Core APIs

### Get Domain Rating

Get the domain rating for a target. Replace `<target-domain>` with the actual domain (e.g., `ahrefs.com`):

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/domain-rating?target=<target-domain>&date=2026-03-01" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '{domain_rating, ahrefs_rank}'
```

Docs: https://docs.ahrefs.com/reference/domain-rating

---

### Get Backlinks Overview

Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/backlinks-stats?target=<target-domain>&date=2026-03-01&mode=subdomains" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '{live, all_time, live_refdomains, all_time_refdomains}'
```

---

### Get Backlinks

Get individual backlinks for a target. Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/all-backlinks?target=<target-domain>&date=2026-03-01&mode=subdomains&limit=10&select=url_from,url_to,ahrefs_rank,domain_rating_source,anchor,first_seen,last_seen" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '.backlinks[] | {url_from, url_to, anchor, domain_rating_source}'
```

Docs: https://docs.ahrefs.com/reference/all-backlinks

---

### Get Referring Domains

Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/refdomains?target=<target-domain>&date=2026-03-01&mode=subdomains&limit=10&select=domain,domain_rating,backlinks,first_seen,last_seen" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '.refdomains[] | {domain, domain_rating, backlinks}'
```

---

### Get Organic Keywords

Get keywords a domain ranks for organically. Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/organic-keywords?target=<target-domain>&date=2026-03-01&country=us&mode=subdomains&limit=10&select=keyword,position,volume,url,traffic" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '.keywords[] | {keyword, position, volume, traffic, url}'
```

Docs: https://docs.ahrefs.com/reference/organic-keywords

---

### Get Organic Traffic Overview

Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/metrics?target=<target-domain>&date=2026-03-01&mode=subdomains" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '{organic_traffic, organic_keywords, organic_cost, paid_traffic, paid_keywords}'
```

---

### Get URL Rating

Get URL rating for a specific page. Replace `<target-url>` with the full URL:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/url-rating?target=<target-url>&date=2026-03-01" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '{url_rating, ahrefs_rank}'
```

---

### Get Top Pages

Get top pages by organic traffic. Replace `<target-domain>` with the actual domain:

```bash
curl -s "https://api.ahrefs.com/v3/site-explorer/top-pages?target=<target-domain>&date=2026-03-01&country=us&mode=subdomains&limit=10&select=url,traffic,keywords,top_keyword,position" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '.pages[] | {url, traffic, keywords, top_keyword, position}'
```

---

### Keywords Explorer - Volume

Get search volume for specific keywords. Replace `<keyword>` in the request:

Write to `/tmp/ahrefs_request.json`:

```json
{
  "keywords": ["seo tools", "backlink checker"],
  "country": "us"
}
```

```bash
curl -s -X POST "https://api.ahrefs.com/v3/keywords-explorer/volume?select=keyword,volume,difficulty,cpc,global_volume" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" --header "Content-Type: application/json" -d @/tmp/ahrefs_request.json | jq '.keywords[] | {keyword, volume, difficulty, cpc}'
```

---

### Get Limits (Check API Usage)

```bash
curl -s "https://api.ahrefs.com/v3/subscription-info" --header "Authorization: Bearer $(printenv AHREFS_TOKEN)" | jq '{rows_limit, rows_left, subscription}'
```

---

## Guidelines

1. **Date parameter**: Most endpoints require a `date` parameter in `YYYY-MM-DD` format; use recent dates for current data
2. **Mode**: Use `subdomains` to include all subdomains, `domain` for exact domain, `prefix` for URL prefix, `exact` for exact URL
3. **Country codes**: Use ISO 3166-1 alpha-2 codes (us, gb, de, etc.) for country-specific data
4. **Select parameter**: Specify fields to return with `select` to reduce response size
5. **Rate limits**: API usage is metered by rows returned; check `/v3/subscription-info` for remaining quota
6. **Limits**: Use `limit` and `offset` for pagination (max 1000 per request)
