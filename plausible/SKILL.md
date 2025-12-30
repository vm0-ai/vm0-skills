---
name: plausible
description: Plausible Analytics API for querying website statistics and managing sites. Use this skill to get visitor counts, pageviews, traffic sources, and manage analytics sites.
vm0_secrets:
  - PLAUSIBLE_API_KEY
vm0_vars:
  - PLAUSIBLE_SITE_ID
---

# Plausible Analytics API

Query website analytics and manage sites with Plausible's privacy-friendly analytics platform.

## When to Use

- Query visitor statistics and pageviews
- Analyze traffic sources and referrers
- Get geographic and device breakdowns
- Track conversions and goals
- Manage analytics sites programmatically

## Prerequisites

```bash
export PLAUSIBLE_API_KEY=your-api-key
export PLAUSIBLE_SITE_ID=example.com
```

### Get API Key

1. Log in to Plausible: https://plausible.io/login
2. Go to Account Settings (top-right menu)
3. Navigate to "API Keys" in sidebar
4. Click "New API Key"
5. Choose key type:
  - **Stats API** - For querying analytics data
  - **Sites API** - For managing sites programmatically
6. Save the key (shown only once)

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## Stats API (v2)

### Basic Query - Total Visitors

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews"],
  "date_range": "7d"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

Docs: https://plausible.io/docs/stats-api

### Query with Dimensions (Breakdown)

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews", "bounce_rate"],
  "date_range": "30d",
  "dimensions": ["visit:source"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Top Pages

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews"],
  "date_range": "7d",
  "dimensions": ["event:page"],
  "order_by": [["pageviews", "desc"]],
  "pagination": {
    "limit": 10
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Geographic Breakdown

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors"],
  "date_range": "30d",
  "dimensions": ["visit:country_name", "visit:city_name"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Device & Browser Stats

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors"],
  "date_range": "7d",
  "dimensions": ["visit:device"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Time Series (Daily)

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews"],
  "date_range": "30d",
  "dimensions": ["time:day"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Filter by Page Path

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews"],
  "date_range": "7d",
  "filters": [["contains", "event:page", ["/blog"]]]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### UTM Campaign Analysis

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "conversion_rate"],
  "date_range": "30d",
  "dimensions": ["visit:utm_source", "visit:utm_campaign"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Custom Date Range

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "metrics": ["visitors", "pageviews"],
  "date_range": ["2024-01-01", "2024-01-31"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v2/query" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

## Site Provisioning API

### List Sites

```bash
bash -c 'curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" '"'"'https://plausible.io/api/v1/sites'"'"'' | jq '.sites[] | {domain, timezone}
```

Docs: https://plausible.io/docs/sites-api

### Create Site

Write to `/tmp/plausible_request.json`:

```json
{
  "domain": "newsite.com",
  "timezone": "America/New_York"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://plausible.io/api/v1/sites" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d @/tmp/plausible_request.json' | jq .
```

### Get Site Details

```bash
bash -c 'curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/sites/$PLAUSIBLE_SITE_ID"' | jq .
```

### Delete Site

> **Warning:** This will permanently delete the site and all its data.

```bash
bash -c 'curl -s -X DELETE -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/sites/$PLAUSIBLE_SITE_ID"'
```

### Create Goal

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "goal_type": "event",
  "event_name": "Signup"
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "https://plausible.io/api/v1/sites/goals" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### Create Page Goal

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "goal_type": "page",
  "page_path": "/thank-you"
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "https://plausible.io/api/v1/sites/goals" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

### List Goals

```bash
bash -c 'curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/sites/goals?site_id=$PLAUSIBLE_SITE_ID"' | jq .
```

### Create Shared Link

Write to `/tmp/plausible_request.json`:

```json
{
  "site_id": "${PLAUSIBLE_SITE_ID}",
  "name": "Public Dashboard"
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "https://plausible.io/api/v1/sites/shared-links" -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H "Content-Type: application/json" -d "$(envsubst < /tmp/plausible_request.json)"' | jq .
```

## Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `visitors` | int | Unique visitors |
| `visits` | int | Total sessions |
| `pageviews` | int | Page views |
| `bounce_rate` | float | Bounce rate (%) |
| `visit_duration` | int | Avg duration (seconds) |
| `views_per_visit` | float | Pages per session |
| `conversion_rate` | float | Goal conversion rate (requires goal to be configured) |
| `events` | int | Total events |

> **Note:** The `conversion_rate` metric requires at least one goal to be configured for your site. Create a goal first using the "Create Goal" or "Create Page Goal" endpoints before querying conversion rates.

## Available Dimensions

### Event Dimensions
- `event:goal` - Custom goals
- `event:page` - Page path
- `event:hostname` - Hostname

### Visit Dimensions
- `visit:source` - Traffic source
- `visit:referrer` - Full referrer URL
- `visit:utm_source` - UTM source
- `visit:utm_medium` - UTM medium
- `visit:utm_campaign` - UTM campaign
- `visit:country_name` - Country
- `visit:region_name` - Region/State
- `visit:city_name` - City
- `visit:device` - Device type
- `visit:browser` - Browser name
- `visit:browser_version` - Browser version
- `visit:os` - Operating system
- `visit:os_version` - OS version

### Time Dimensions
- `time` - Auto granularity
- `time:hour` - Hourly
- `time:day` - Daily
- `time:week` - Weekly
- `time:month` - Monthly

## Filter Operators

| Operator | Description |
|----------|-------------|
| `is` | Equals any value |
| `is_not` | Not equals |
| `contains` | Contains substring |
| `matches` | Regex match |

### Complex Filters

```json
["and", [
  ["is", "visit:country_name", ["United States"]],
  ["contains", "event:page", ["/blog"]]
]]
```

## Date Range Options

| Value | Description |
|-------|-------------|
| `day` | Today |
| `7d` | Last 7 days |
| `28d` | Last 28 days |
| `30d` | Last 30 days |
| `month` | Current month |
| `6mo` | Last 6 months |
| `12mo` | Last 12 months |
| `year` | Current year |
| `all` | All time |
| `["2024-01-01", "2024-12-31"]` | Custom range |

## Rate Limits

- 600 requests per hour per API key

## API Reference

- Stats API: https://plausible.io/docs/stats-api
- Sites API: https://plausible.io/docs/sites-api
- Main Docs: https://plausible.io/docs
