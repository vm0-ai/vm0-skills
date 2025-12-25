---
name: plausible
description: Plausible Analytics API for querying website statistics and managing sites. Use this skill to get visitor counts, pageviews, traffic sources, and manage analytics sites.
vm0_env:
  - PLAUSIBLE_API_KEY
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

> **Important:** When piping `curl` output to `jq`, wrap the command in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" | jq .'
> ```

## Stats API (v2)

### Basic Query - Total Visitors

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{"site_id":"'$PLAUSIBLE_SITE_ID'","metrics":["visitors","pageviews"],"date_range":"7d"}
EOF
```

Docs: https://plausible.io/docs/stats-api

### Query with Dimensions (Breakdown)

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews", "bounce_rate"],
  "date_range": "30d",
  "dimensions": ["visit:source"]
}
EOF
```

### Top Pages

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "7d",
  "dimensions": ["event:page"],
  "order_by": [["pageviews", "desc"]],
  "pagination": {"limit": 10}
}
EOF
```

### Geographic Breakdown

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors"],
  "date_range": "30d",
  "dimensions": ["visit:country_name", "visit:city_name"]
}
EOF
```

### Device & Browser Stats

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors"],
  "date_range": "7d",
  "dimensions": ["visit:device"]
}
EOF
```

### Time Series (Daily)

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "30d",
  "dimensions": ["time:day"]
}
EOF
```

### Filter by Page Path

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "7d",
  "filters": [["contains", "event:page", ["/blog"]]]
}
EOF
```

### UTM Campaign Analysis

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "conversion_rate"],
  "date_range": "30d",
  "dimensions": ["visit:utm_source", "visit:utm_campaign"]
}
EOF
```

### Custom Date Range

```bash
curl -s -X POST 'https://plausible.io/api/v2/query' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": ["2024-01-01", "2024-01-31"]
}
EOF
```

## Site Provisioning API

### List Sites

```bash
bash -c 'curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" '"'"'https://plausible.io/api/v1/sites'"'"' | jq '"'"'.sites[] | {domain, timezone}'"'"''
```

Docs: https://plausible.io/docs/sites-api

### Create Site

```bash
curl -s -X POST 'https://plausible.io/api/v1/sites' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{"domain":"newsite.com","timezone":"America/New_York"}
EOF
```

### Get Site Details

```bash
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" 'https://plausible.io/api/v1/sites/example.com'
```

### Delete Site

```bash
curl -s -X DELETE -H "Authorization: Bearer $PLAUSIBLE_API_KEY" 'https://plausible.io/api/v1/sites/example.com'
```

### Create Goal

```bash
curl -s -X PUT 'https://plausible.io/api/v1/sites/goals' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{"site_id":"example.com","goal_type":"event","event_name":"Signup"}
EOF
```

### Create Page Goal

```bash
curl -s -X PUT 'https://plausible.io/api/v1/sites/goals' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{"site_id":"example.com","goal_type":"page","page_path":"/thank-you"}
EOF
```

### List Goals

```bash
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" 'https://plausible.io/api/v1/sites/goals?site_id=example.com'
```

### Create Shared Link

```bash
curl -s -X PUT 'https://plausible.io/api/v1/sites/shared-links' -H "Authorization: Bearer $PLAUSIBLE_API_KEY" -H 'Content-Type: application/json' -d @- << 'EOF'
{"site_id":"example.com","name":"Public Dashboard"}
EOF
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
| `conversion_rate` | float | Goal conversion rate |
| `events` | int | Total events |

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
