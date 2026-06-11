---
name: google-analytics
description: Google Analytics 4 Data and Admin APIs for reports, properties, accounts, metadata, and real-time analytics. Use when user mentions "Google Analytics", "GA4", "analytics reports", "traffic", "active users", "sessions", or asks for website/app analytics from Google.
---

# Google Analytics

Use the Google Analytics Data API for GA4 reporting and the Google Analytics
Admin API for account/property management.

## Troubleshooting

If requests fail, run:

```bash
zero doctor check-connector --env-name GOOGLE_ANALYTICS_TOKEN
zero doctor check-connector --url https://analyticsdata.googleapis.com/v1beta/properties/0:runReport --method POST
zero doctor check-connector --url https://analyticsadmin.googleapis.com/v1beta/accounts --method GET
```

## Prerequisites

- Connect Google Analytics under vm0.ai -> Settings -> Connectors (OAuth).
- The connected Google account must have access to the GA4 account/property.
- The access token is injected as `$GOOGLE_ANALYTICS_TOKEN`.
- Base URLs:
  - Data API: `https://analyticsdata.googleapis.com`
  - Admin API: `https://analyticsadmin.googleapis.com`

GA4 property IDs are numeric, for example `properties/123456789`. They are not
the measurement ID like `G-XXXXXXXXXX`.

## 1. List Accounts

```bash
curl -s "https://analyticsadmin.googleapis.com/v1beta/accounts" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  | jq '.accounts[] | {name, displayName, regionCode}'
```

## 2. List Properties

Replace `<account-id>` with the numeric ID from `accounts/<account-id>`.

```bash
curl -s -G "https://analyticsadmin.googleapis.com/v1beta/properties" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  --data-urlencode "filter=parent:accounts/<account-id>" \
  | jq '.properties[] | {name, displayName, propertyType, timeZone, currencyCode}'
```

## 3. Run a Basic Report

Write to `/tmp/ga4_report.json`:

```json
{
  "dateRanges": [{ "startDate": "30daysAgo", "endDate": "yesterday" }],
  "dimensions": [{ "name": "date" }],
  "metrics": [
    { "name": "activeUsers" },
    { "name": "sessions" },
    { "name": "screenPageViews" }
  ],
  "orderBys": [{ "dimension": { "dimensionName": "date" } }]
}
```

Then run:

```bash
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/<property-id>:runReport" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/ga4_report.json \
  | jq '.rows[] | {date: .dimensionValues[0].value, activeUsers: .metricValues[0].value, sessions: .metricValues[1].value, pageViews: .metricValues[2].value}'
```

## 4. Top Pages

Write to `/tmp/ga4_top_pages.json`:

```json
{
  "dateRanges": [{ "startDate": "7daysAgo", "endDate": "yesterday" }],
  "dimensions": [{ "name": "pagePath" }],
  "metrics": [{ "name": "screenPageViews" }, { "name": "activeUsers" }],
  "orderBys": [{ "metric": { "metricName": "screenPageViews" }, "desc": true }],
  "limit": 10
}
```

Then run:

```bash
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/<property-id>:runReport" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/ga4_top_pages.json \
  | jq '.rows[] | {page: .dimensionValues[0].value, pageViews: .metricValues[0].value, activeUsers: .metricValues[1].value}'
```

## 5. Real-Time Active Users

Write to `/tmp/ga4_realtime.json`:

```json
{
  "dimensions": [{ "name": "unifiedScreenName" }],
  "metrics": [{ "name": "activeUsers" }],
  "limit": 10
}
```

Then run:

```bash
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/<property-id>:runRealtimeReport" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/ga4_realtime.json \
  | jq '.rows[] | {screen: .dimensionValues[0].value, activeUsers: .metricValues[0].value}'
```

## 6. Discover Available Dimensions and Metrics

```bash
curl -s "https://analyticsdata.googleapis.com/v1beta/properties/<property-id>/metadata" \
  --header "Authorization: Bearer $GOOGLE_ANALYTICS_TOKEN" \
  | jq '{dimensions: [.dimensions[].apiName], metrics: [.metrics[].apiName]}'
```

## Guidelines

1. Use Admin API first when the user does not know the account or property ID.
2. Prefer `yesterday` as the end date for stable daily reports; today's data may be incomplete.
3. Keep dimensions and metrics compatible. If a report fails, call metadata and verify the API names.
4. Use `limit` and `offset` for paging larger reports.
5. Do not confuse GA4 property IDs with stream measurement IDs.
