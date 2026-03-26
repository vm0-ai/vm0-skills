---
name: similarweb
description: Similarweb API for web analytics. Use when user mentions "Similarweb",
  "website traffic", "competitor analysis", or market intelligence.
vm0_secrets:
  - SIMILARWEB_TOKEN
---

# SimilarWeb API

Analyze website traffic, engagement metrics, traffic sources, keywords, and competitive intelligence.

> Official docs: `https://developers.similarweb.com/docs/getting-started`

## When to Use

- Analyze website traffic and engagement metrics (visits, bounce rate, pages per visit)
- Break down traffic sources (search, social, referral, direct, display, mail)
- Research organic and paid keywords driving traffic to a website
- Find competitors and similar websites
- Check API capabilities and remaining credits

## Prerequisites


> **Note:** SimilarWeb REST API passes the API key as a query parameter (`api_key`). The Batch API uses the `api-key` header instead.

## Core APIs

### Check API Capabilities

Check what data your API key has access to:

```bash
curl -s "https://api.similarweb.com/capabilities?api_key=$(printenv SIMILARWEB_TOKEN)" | jq '{remaining_hits: .remaining_hits, web_desktop_data, web_mobile_data}'
```

### Total Traffic and Engagement

Get total visits for a domain. Replace `<domain>` with the target domain (e.g., `amazon.com`):

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/total-traffic-and-engagement/visits?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&granularity=monthly&main_domain_only=false" | jq '.[] | {date, visits}'
```

### Engagement Metrics (Pages per Visit, Average Duration, Bounce Rate)

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/total-traffic-and-engagement/pages-per-visit?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&granularity=monthly&main_domain_only=false" | jq '.[] | {date, pages_per_visit}'
```

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/total-traffic-and-engagement/average-visit-duration?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&granularity=monthly&main_domain_only=false" | jq '.[] | {date, average_visit_duration}'
```

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/total-traffic-and-engagement/bounce-rate?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&granularity=monthly&main_domain_only=false" | jq '.[] | {date, bounce_rate}'
```

### Traffic Sources Overview

Get breakdown of traffic by channel (direct, search, social, referral, mail, display):

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/traffic-sources/overview?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&granularity=monthly&main_domain_only=false" | jq '.overview[] | {source_type, share: (.share[0].visits // .share[0].value)}'
```

### Organic Search Keywords

Get top organic keywords driving traffic to a domain:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/search/organic-keywords?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&limit=10" | jq '.search[] | {keyword: .search_term, share, visits, position}'
```

### Paid Search Keywords

Get top paid keywords:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/search/paid-keywords?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&limit=10" | jq '.search[] | {keyword: .search_term, share, visits, position}'
```

### Referral Sites

Get top referring websites:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/referrals/referrals?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world&limit=10" | jq '.referrals[] | {site, share, visits}'
```

### Social Traffic

Get traffic breakdown by social network:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/traffic-sources/social?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&country=world" | jq '.social[] | {page: .page, visits}'
```

### Similar Sites (Competitors)

Find websites similar to a given domain:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/similar-sites/similarsites?api_key=$(printenv SIMILARWEB_TOKEN)" | jq '.similar_sites[] | {url, score}'
```

### Website Category and Global Rank

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/category-rank/category-rank?api_key=$(printenv SIMILARWEB_TOKEN)" | jq '{category, global_rank, category_rank}'
```

### Audience Geography

Get traffic distribution by country:

```bash
curl -s "https://api.similarweb.com/v1/website/<domain>/geo/traffic-by-country?api_key=$(printenv SIMILARWEB_TOKEN)&start_date=2025-01&end_date=2025-03&main_domain_only=false" | jq '.records[] | {country: .country_code, share, visits}' | head -20
```

## Batch API

The Batch API uses a different authentication method (header-based) and is for large-scale data extraction.

### Check Batch API Credits

```bash
curl -s "https://api.similarweb.com/v3/batch/credits" --header "api-key: $(printenv SIMILARWEB_TOKEN)" | jq '{total_credits, used_credits, remaining_credits}'
```

### Describe Available Tables

```bash
curl -s "https://api.similarweb.com/v3/batch/tables/describe" --header "api-key: $(printenv SIMILARWEB_TOKEN)" | jq '.tables[] | {name, description}'
```

## Guidelines

1. **Date format**: Use `YYYY-MM` for `start_date` and `end_date` parameters (e.g., `2025-01`).
2. **Country codes**: Use ISO 2-letter codes (e.g., `us`, `gb`, `de`) or `world` for worldwide data.
3. **Granularity**: Use `monthly`, `weekly`, or `daily` for time-series data.
4. **Rate limits**: The API has rate limits based on your subscription. If you get 429 errors, wait before retrying.
5. **Domain format**: Use bare domain without protocol (e.g., `amazon.com`, not `https://amazon.com`).
6. **main_domain_only**: Set to `false` to include subdomains, `true` for the main domain only.
