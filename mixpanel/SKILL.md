---
name: mixpanel
description: Mixpanel API for product analytics. Use when user mentions "Mixpanel",
  "product analytics", "event tracking", "funnels", "insights", or JQL queries.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MIXPANEL_SERVICE_ACCOUNT_USERNAME` or `zero doctor check-connector --url "https://mixpanel.com/api/2.0/insights?project_id=$MIXPANEL_PROJECT_ID" --method GET`

## How to Use

All examples below assume `MIXPANEL_SERVICE_ACCOUNT_USERNAME`, `MIXPANEL_SERVICE_ACCOUNT_SECRET`, and `MIXPANEL_PROJECT_ID` are set.

Authentication: HTTP Basic Auth with the Service Account username as the user and the Service Account secret as the password. Every request must also pass `project_id` as a query parameter.

Base URLs:
- Query / Insights / Funnels / JQL: `https://mixpanel.com`
- Raw event export: `https://data.mixpanel.com`
- Ingestion (track events, set profiles): `https://api.mixpanel.com`

### 1. Run Insights Query

Fetch a saved Insights report by bookmark id. Replace `<your-bookmark-id>` with the actual bookmark (saved report) id:

```bash
curl -s -G "https://mixpanel.com/api/2.0/insights" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" --data-urlencode "bookmark_id=<your-bookmark-id>" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 2. Segmentation Query

Aggregate a single event by a property over a date range:

```bash
curl -s -G "https://mixpanel.com/api/2.0/segmentation" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" --data-urlencode "event=Signed Up" --data-urlencode "from_date=2026-04-01" --data-urlencode "to_date=2026-04-17" --data-urlencode "unit=day" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 3. List Funnels

```bash
curl -s -G "https://mixpanel.com/api/2.0/funnels/list" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 4. Query a Funnel

Replace `<your-funnel-id>` with the id returned by the list call:

```bash
curl -s -G "https://mixpanel.com/api/2.0/funnels" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" --data-urlencode "funnel_id=<your-funnel-id>" --data-urlencode "from_date=2026-04-01" --data-urlencode "to_date=2026-04-17" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 5. Run a JQL Script

JQL (JavaScript Query Language) lets you run arbitrary map/reduce over events and profiles.

Write to `/tmp/mixpanel_jql.js`:

```
function main() {
  return Events({
    from_date: '2026-04-01',
    to_date:   '2026-04-17',
    event_selectors: [{ event: 'Signed Up' }]
  }).groupBy(['name'], mixpanel.reducer.count());
}
```

Then run:

```bash
curl -s -G "https://mixpanel.com/api/2.0/jql" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" --data-urlencode "script@/tmp/mixpanel_jql.js" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 6. Raw Event Export

Stream raw events for a date range as newline-delimited JSON. Use the `data.mixpanel.com` host for export:

```bash
curl -s -G "https://data.mixpanel.com/api/2.0/export" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" --data-urlencode "from_date=2026-04-17" --data-urlencode "to_date=2026-04-17" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

Add `--data-urlencode "event=[\"Signed Up\"]"` to filter to specific events.

### 7. Query User Profiles (Engage)

List or search user profiles. Use POST so large `where` filters fit:

Write to `/tmp/mixpanel_engage.json`:

```json
{
  "where": "properties[\"$email\"] == \"jane@example.com\""
}
```

Then run:

```bash
curl -s -X POST "https://mixpanel.com/api/2.0/engage?project_id=$MIXPANEL_PROJECT_ID" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET" --header "Content-Type: application/x-www-form-urlencoded" --data-urlencode "where@/tmp/mixpanel_engage.json"
```

### 8. Track an Event (Ingestion)

Ingestion uses `api.mixpanel.com` and expects a base64-encoded JSON payload in the `data` parameter. It uses your project token (embedded inside the payload) rather than Basic auth — but the Service Account credentials still work for the `/import` endpoint.

Write to `/tmp/mixpanel_track.json`:

```json
[
  {
    "event": "Signed Up",
    "properties": {
      "token": "<your-project-token>",
      "distinct_id": "user-123",
      "$insert_id": "unique-dedup-key-001",
      "time": 1744944000,
      "source": "web"
    }
  }
]
```

Then run:

```bash
curl -s -X POST "https://api.mixpanel.com/import?project_id=$MIXPANEL_PROJECT_ID&strict=1" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET" --header "Content-Type: application/json" -d @/tmp/mixpanel_track.json
```

The `/import` endpoint (Basic-auth) is preferred over the legacy `/track` endpoint for server-side ingestion because it supports deduplication via `$insert_id` and returns structured errors.

### 9. Update a User Profile ($set)

Write to `/tmp/mixpanel_engage_update.json`:

```json
[
  {
    "$token": "<your-project-token>",
    "$distinct_id": "user-123",
    "$set": {
      "$email": "jane@example.com",
      "plan": "pro"
    }
  }
]
```

Then run:

```bash
curl -s -X POST "https://api.mixpanel.com/engage?project_id=$MIXPANEL_PROJECT_ID" --header "Content-Type: application/json" -d @/tmp/mixpanel_engage_update.json
```

### 10. List Cohorts

```bash
curl -s -G "https://mixpanel.com/api/2.0/cohorts/list" --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"
```

### 11. Query Events by Cohort

Replace `<your-cohort-id>` with the id returned by the list call:

```bash
curl -s -X POST "https://mixpanel.com/api/2.0/engage?project_id=$MIXPANEL_PROJECT_ID" -u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET" --header "Content-Type: application/x-www-form-urlencoded" --data-urlencode "filter_by_cohort={\"id\":<your-cohort-id>}"
```

## Guidelines

1. **Always include `project_id`**: Every API call requires it as a query parameter — without it, Mixpanel returns an auth error that looks like a credentials problem.
2. **Use Basic auth with Service Accounts**: `-u "$MIXPANEL_SERVICE_ACCOUNT_USERNAME:$MIXPANEL_SERVICE_ACCOUNT_SECRET"` — not the legacy project API secret.
3. **Date format**: Query endpoints use `YYYY-MM-DD`; raw `/export` uses the same. Ingestion `time` field uses UNIX seconds.
4. **Prefer `/import` over `/track`** for server-side ingestion: supports deduplication via `$insert_id` and returns structured errors.
5. **Rate limits**: Query APIs are limited to 60 queries/hour, 5 concurrent queries per project. Export API has separate limits.
6. **Raw export uses a different host**: `data.mixpanel.com`, not `mixpanel.com`.

## API Reference

- Authentication: https://developer.mixpanel.com/reference/authentication
- Query API: https://developer.mixpanel.com/reference/overview
- JQL: https://developer.mixpanel.com/reference/jql
- Raw export: https://developer.mixpanel.com/reference/raw-event-export
- Ingestion (`/import`): https://developer.mixpanel.com/reference/import-events
