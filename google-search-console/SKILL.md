---
name: google-search-console
description: Google Search Console API for SEO and indexing data. Use when user mentions "Search Console", "GSC", "search analytics", "impressions/clicks", "keyword rankings", "sitemaps", "URL inspection", or "indexing status".
---

# Google Search Console

Read Search Console data for verified sites — search analytics (queries, clicks, impressions, CTR, position), sitemaps, and URL inspection (indexing status).

> Official docs: `https://developers.google.com/webmaster-tools/v1/api_reference_index`

---

## When to Use

Use this skill when you need to:

- Pull keyword/page performance: clicks, impressions, CTR, average position
- Check which sitemaps are submitted and their processing status
- Inspect a specific URL's index coverage and crawl status

---

## Prerequisites

- Connect **Google Search Console** under vm0.ai → Settings → Connectors (OAuth).
- The connected Google account must already be a verified owner/user of the property in Search Console.
- The access token is injected as `$GOOGLE_SEARCH_CONSOLE_TOKEN`. Access is read-only (`webmasters.readonly`).

**Base URL:** `https://searchconsole.googleapis.com`

**`siteUrl` formats** — must be URL-encoded in the path:
- URL-prefix property: `https://www.example.com/` → `https%3A%2F%2Fwww.example.com%2F`
- Domain property: `sc-domain:example.com` → `sc-domain%3Aexample.com`

---

## 1. List Verified Sites

Find the exact `siteUrl` values you have access to (use one of these in later calls):

```bash
curl -s "https://searchconsole.googleapis.com/webmasters/v3/sites" --header "Authorization: Bearer $GOOGLE_SEARCH_CONSOLE_TOKEN" | jq '.siteEntry[] | {siteUrl, permissionLevel}'
```

---

## 2. Query Search Analytics

The core report. Returns rows of metrics grouped by the requested dimensions. Dimensions: `query`, `page`, `country`, `device`, `searchAppearance`, `date`.

Write the request body to `/tmp/gsc_query.json` (top 25 queries by clicks for a date range):

```json
{
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "dimensions": ["query"],
  "rowLimit": 25,
  "orderBy": [{ "field": "clicks", "descending": true }]
}
```

Then run (replace `<site-url-encoded>` with a value from step 1):

```bash
curl -s -X POST "https://searchconsole.googleapis.com/webmasters/v3/sites/<site-url-encoded>/searchAnalytics/query" --header "Authorization: Bearer $GOOGLE_SEARCH_CONSOLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsc_query.json | jq '.rows[] | {query: .keys[0], clicks, impressions, ctr, position}'
```

**By page instead of query:** set `"dimensions": ["page"]` and read `page: .keys[0]`.

**Filtering** — add a `dimensionFilterGroups` block, e.g. only rows where the page contains `/blog/`:

```json
{
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "dimensions": ["query"],
  "dimensionFilterGroups": [
    { "filters": [{ "dimension": "page", "operator": "contains", "expression": "/blog/" }] }
  ],
  "rowLimit": 25
}
```

> Note: Search Console data lags ~2-3 days and the most recent days may be incomplete.

---

## 3. List Sitemaps

See which sitemaps are submitted and whether Google has processed them:

```bash
curl -s "https://searchconsole.googleapis.com/webmasters/v3/sites/<site-url-encoded>/sitemaps" --header "Authorization: Bearer $GOOGLE_SEARCH_CONSOLE_TOKEN" | jq '.sitemap[] | {path, lastSubmitted, lastDownloaded, isPending, errors, warnings, contents}'
```

### Get a Single Sitemap

`<feedpath>` is the full sitemap URL, URL-encoded:

```bash
curl -s "https://searchconsole.googleapis.com/webmasters/v3/sites/<site-url-encoded>/sitemaps/<feedpath-encoded>" --header "Authorization: Bearer $GOOGLE_SEARCH_CONSOLE_TOKEN" | jq '{path, lastDownloaded, errors, warnings, contents}'
```

---

## 4. Inspect a URL (Indexing Status)

Check whether a specific URL is indexed, its coverage state, and last crawl time.

Write to `/tmp/gsc_inspect.json` (`siteUrl` here is the raw, un-encoded property; `inspectionUrl` must belong to that property):

```json
{
  "inspectionUrl": "https://www.example.com/blog/my-post",
  "siteUrl": "https://www.example.com/"
}
```

Then run:

```bash
curl -s -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" --header "Authorization: Bearer $GOOGLE_SEARCH_CONSOLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsc_inspect.json | jq '.inspectionResult.indexStatusResult | {verdict, coverageState, lastCrawlTime, googleCanonical, indexingState, robotsTxtState}'
```

---

## Notes

- Access is **read-only**: submitting/deleting sitemaps and adding/removing sites require the full `webmasters` scope, which this connector does not request.
- `searchAnalytics/query` caps at `rowLimit` 25000 per request; paginate with `startRow` for larger pulls.
- Use the exact `siteUrl` string returned by step 1 — a trailing-slash or http/https mismatch returns 403.
