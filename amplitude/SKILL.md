---
name: amplitude
description: Amplitude product analytics API. Use when user mentions "Amplitude",
  "product analytics", "event export", "funnel analysis", "user retention",
  "behavioral cohorts", or "event ingestion".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name AMPLITUDE_API_KEY` or `zero doctor check-connector --url https://amplitude.com/api/2/events/segmentation --method GET`

## How to Use

All examples below assume `AMPLITUDE_API_KEY` and `AMPLITUDE_SECRET_KEY` are set. Amplitude's dashboard REST and Export APIs use HTTP Basic Auth with the API key as the username and the secret key as the password. The ingestion API (HTTP V2) embeds the API key in the request body instead.

- Dashboard + Export host: `https://amplitude.com` (EU: `https://analytics.eu.amplitude.com`)
- Ingestion host: `https://api2.amplitude.com` (EU: `https://api.eu.amplitude.com`)

Pass credentials to curl with `-u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY"`.

### 1. Export Raw Events

Export all events for a time range. Start and end use `YYYYMMDDTHH` format (hourly, UTC). Returns a ZIP archive of gzipped JSON lines.

```bash
curl -s -X GET "https://amplitude.com/api/2/export?start=20260101T00&end=20260101T23" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" -o /tmp/amplitude_export.zip
```

Limits: max 365-day window; data available 2+ hours after ingestion.

### 2. Event Segmentation (Dashboard Chart Data)

Get counts or uniques for an event over a date range. Parameters `e`, `start`, `end` are required; `i` sets the interval (1 = daily, -300000 = realtime 5-min, etc.).

Write to `/tmp/amplitude_event.json`:

```json
{
  "event_type": "Song Played"
}
```

Then run. `--data-urlencode` reads the JSON from the file so special characters in event names don't break the URL:

```bash
curl -s -G "https://amplitude.com/api/2/events/segmentation" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" --data-urlencode "e@/tmp/amplitude_event.json" --data-urlencode "start=20260101" --data-urlencode "end=20260107" --data-urlencode "i=1"
```

### 3. Funnel Analysis

Compute conversion across a sequence of events. Each `e` parameter is a JSON event definition; repeat `e` for each step.

Write to `/tmp/amplitude_step1.json`:

```json
{
  "event_type": "View Product"
}
```

Write to `/tmp/amplitude_step2.json`:

```json
{
  "event_type": "Add to Cart"
}
```

Write to `/tmp/amplitude_step3.json`:

```json
{
  "event_type": "Purchase"
}
```

Then run:

```bash
curl -s -G "https://amplitude.com/api/2/funnels" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" --data-urlencode "e@/tmp/amplitude_step1.json" --data-urlencode "e@/tmp/amplitude_step2.json" --data-urlencode "e@/tmp/amplitude_step3.json" --data-urlencode "start=20260101" --data-urlencode "end=20260107"
```

### 4. Retention Analysis

Compute retention between a starting event and a returning event.

Write to `/tmp/amplitude_start.json`:

```json
{
  "event_type": "Sign Up"
}
```

Write to `/tmp/amplitude_return.json`:

```json
{
  "event_type": "Active User"
}
```

Then run:

```bash
curl -s -G "https://amplitude.com/api/2/retention" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" --data-urlencode "se@/tmp/amplitude_start.json" --data-urlencode "re@/tmp/amplitude_return.json" --data-urlencode "start=20260101" --data-urlencode "end=20260107"
```

### 5. User Search

Look up a user by Amplitude ID, user ID, device ID, or email.

```bash
curl -s -G "https://amplitude.com/api/2/usersearch" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" --data-urlencode "user=user@example.com"
```

### 6. User Activity Stream

Get a single user's recent events. Replace `<amplitude-id>` with the numeric Amplitude ID from the user search response:

```bash
curl -s -G "https://amplitude.com/api/2/useractivity" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" --data-urlencode "user=<amplitude-id>"
```

### 7. Behavioral Cohorts

List all cohorts for the project:

```bash
curl -s -X GET "https://amplitude.com/api/3/cohorts" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY"
```

Download cohort membership. Replace `<cohort-id>` with an ID from the list response:

```bash
curl -s -X GET "https://amplitude.com/api/5/cohorts/request/<cohort-id>" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY"
```

### 8. Ingest Events (HTTP V2)

Send events directly to Amplitude. The HTTP V2 endpoint does **not** use Basic auth — the API key goes in the JSON body as `api_key`.

Write to `/tmp/amplitude_ingest.json`:

```json
{
  "api_key": "REPLACE_WITH_AMPLITUDE_API_KEY",
  "events": [
    {
      "user_id": "user-123",
      "event_type": "Button Clicked",
      "event_properties": {
        "button_name": "signup"
      },
      "time": 1767225600000
    }
  ]
}
```

Substitute the env var into the file before posting, then ingest:

```bash
sed -i "s/REPLACE_WITH_AMPLITUDE_API_KEY/$AMPLITUDE_API_KEY/" /tmp/amplitude_ingest.json
curl -s -X POST "https://api2.amplitude.com/2/httpapi" --header "Content-Type: application/json" -d @/tmp/amplitude_ingest.json
```

## Guidelines

1. **Basic auth credential order**: always `api_key:secret_key` (API key is the username, secret key is the password). Reversing the order silently returns 401.
2. **Two distinct credentials**: the API key alone is enough for ingestion; dashboard/export endpoints require **both** the API key and the secret key.
3. **EU data residency**: if your project is on the EU cluster, swap `amplitude.com` → `analytics.eu.amplitude.com` and `api2.amplitude.com` → `api.eu.amplitude.com`.
4. **Rate limits**: dashboard REST is ~1000 queries/hour per project; Export tops out at 4 GB per call; ingestion accepts up to 1000 events per request.
5. **Timestamp formats**: dashboard endpoints take `YYYYMMDD`; Export takes `YYYYMMDDTHH` (UTC hours); ingestion takes Unix milliseconds in `time`.
6. **Never expose the secret key** client-side — it grants full project-read access to raw events.

## API Reference

- Authentication: https://amplitude.com/docs/apis/authentication
- Export API: https://amplitude.com/docs/apis/analytics/export
- Dashboard REST: https://amplitude.com/docs/apis/analytics/dashboard-rest
- HTTP V2 Ingestion: https://amplitude.com/docs/apis/analytics/http-v2
- Behavioral Cohorts: https://amplitude.com/docs/apis/analytics/behavioral-cohorts
