---
name: gong
description: Gong API for revenue intelligence. Use when user mentions "Gong", "sales calls", "call recordings", "call transcripts", "conversation intelligence", or needs to read calls, transcripts, users, or deals from Gong.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GONG_ACCESS_KEY` or `zero doctor check-connector --url https://$GONG_API_BASE/v2/users --method GET`

## Authentication

Gong uses HTTP Basic authentication. The username is your **Access Key** and the password is your **Access Key Secret**. With curl, pass them via the `-u` flag (it handles Base64 encoding):

```bash
-u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

Generate the key pair in Gong under **Company Settings → Ecosystem → API**. It requires the "Technical Administrator" permission profile.

## Environment Variables

| Variable | Description |
|---|---|
| `GONG_ACCESS_KEY` | Gong API Access Key |
| `GONG_ACCESS_KEY_SECRET` | Gong API Access Key Secret |
| `GONG_API_BASE` | API host for your Gong tenant (e.g. `api.gong.io`, or your region-specific host) |

## Base URL

`https://$GONG_API_BASE` — the host is shown on the same screen where you generate the API key ("API Base URL"). Standard tenants use `api.gong.io`; EU and other regional tenants have a region-specific host. All endpoints are under `/v2/`.

Rate limit: 3 requests/second and 10,000 requests/day per API key.

## Calls

### List Calls

Calls in a date range (ISO 8601 timestamps, max 90-day window):

```bash
curl -s "https://$GONG_API_BASE/v2/calls?fromDateTime=2026-01-01T00:00:00Z&toDateTime=2026-01-31T00:00:00Z" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

Paginate with the `cursor` query param returned in `records.cursor`.

### Retrieve a Call

```bash
curl -s "https://$GONG_API_BASE/v2/calls/<call-id>" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

### Extensive Call Data

Rich call data (parties, context, content, interaction stats) with filters. Write to `/tmp/gong_extensive.json`:

```json
{
  "filter": {
    "fromDateTime": "2026-01-01T00:00:00Z",
    "toDateTime": "2026-01-31T00:00:00Z"
  },
  "contentSelector": {
    "exposedFields": {
      "parties": true,
      "content": { "structure": true, "topics": true, "trackers": true },
      "interaction": { "speakers": true }
    }
  }
}
```

```bash
curl -s -X POST "https://$GONG_API_BASE/v2/calls/extensive" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET" -H "Content-Type: application/json" -d @/tmp/gong_extensive.json
```

### Call Transcripts

Write to `/tmp/gong_transcript.json`:

```json
{
  "filter": {
    "callIds": ["<call-id>"]
  }
}
```

```bash
curl -s -X POST "https://$GONG_API_BASE/v2/calls/transcript" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET" -H "Content-Type: application/json" -d @/tmp/gong_transcript.json
```

## Users

### List Users

```bash
curl -s "https://$GONG_API_BASE/v2/users" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

### Retrieve a User

```bash
curl -s "https://$GONG_API_BASE/v2/users/<user-id>" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

## Workspaces

```bash
curl -s "https://$GONG_API_BASE/v2/workspaces" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

## Scorecards

```bash
curl -s "https://$GONG_API_BASE/v2/settings/scorecards" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET"
```

## CRM Calls / Deals

Aggregated activity stats for users. Write to `/tmp/gong_activity.json`:

```json
{
  "filter": {
    "fromDateTime": "2026-01-01T00:00:00Z",
    "toDateTime": "2026-01-31T00:00:00Z"
  }
}
```

```bash
curl -s -X POST "https://$GONG_API_BASE/v2/stats/activity/aggregate" -u "$GONG_ACCESS_KEY:$GONG_ACCESS_KEY_SECRET" -H "Content-Type: application/json" -d @/tmp/gong_activity.json
```

## Notes

- All POST bodies require `Content-Type: application/json`.
- List endpoints are cursor-paginated: pass `records.cursor` from the previous response as the `cursor` query param (GET) or body field (POST).
- Date filters use ISO 8601 UTC timestamps and are capped at a 90-day window per request.
