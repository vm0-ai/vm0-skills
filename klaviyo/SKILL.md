---
name: klaviyo
description: Klaviyo API for e-commerce marketing automation — profiles, lists, events, campaigns, and metrics. Use when user mentions "Klaviyo", "email marketing", "flows", "subscribe profile", "campaign", "segment", or server-side event tracking for e-commerce.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name KLAVIYO_TOKEN` or `zero doctor check-connector --url https://a.klaviyo.com/api/accounts --method GET`

## Authentication

All requests require three headers:

```
Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN
revision: 2026-04-15
accept: application/vnd.api+json
```

For write requests, also include `content-type: application/vnd.api+json`.

The `revision` header pins the API version. Bump to a newer date only when you need a new feature — older revisions stay supported.

## Environment Variables

| Variable | Description |
|---|---|
| `KLAVIYO_TOKEN` | Klaviyo private API key (format: `pk_...`, 37 chars) |

## Key Endpoints

Base URL: `https://a.klaviyo.com`

All payloads follow the JSON:API spec — the body is always wrapped in `{"data": {"type": "...", "attributes": {...}}}`.

### Accounts

#### Get Account (sanity check)

```bash
curl -s "https://a.klaviyo.com/api/accounts" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

### Profiles

#### Get Profiles (paginated)

```bash
curl -s "https://a.klaviyo.com/api/profiles?page[size]=20" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

Useful filters (pass via `filter=` query string, URL-encoded):

- `equals(email,"user@example.com")`
- `equals(phone_number,"+15551234567")`
- `greater-than(created,2026-01-01T00:00:00Z)`

#### Get Profile by ID

```bash
curl -s "https://a.klaviyo.com/api/profiles/<your-profile-id>" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

#### Create Profile

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "profile",
    "attributes": {
      "email": "<your-recipient-email>",
      "phone_number": "<your-phone-e164>",
      "first_name": "<your-first-name>",
      "last_name": "<your-last-name>",
      "properties": {
        "plan": "pro"
      }
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/profiles" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

Returns `201 Created` with the new profile ID. A `409 Conflict` means a profile with that email already exists — use the returned ID to PATCH instead.

#### Update Profile

Replace `<your-profile-id>` with the real ID.

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "profile",
    "id": "<your-profile-id>",
    "attributes": {
      "first_name": "<your-new-first-name>",
      "properties": {
        "last_purchase_total": 129.99
      }
    }
  }
}
```

Then run:

```bash
curl -s -X PATCH "https://a.klaviyo.com/api/profiles/<your-profile-id>" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

### Events (server-side tracking)

#### Create Event

Fires a metric event that can trigger flows. The `metric` is auto-created on first use.

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "metric": {
        "data": {
          "type": "metric",
          "attributes": { "name": "Placed Order" }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "attributes": { "email": "<your-recipient-email>" }
        }
      },
      "properties": {
        "OrderId": "<your-order-id>",
        "Items": ["SKU-1", "SKU-2"]
      },
      "value": 129.99,
      "time": "2026-04-18T10:00:00Z"
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/events" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

Returns `202 Accepted` — the event is queued. If the profile does not exist, Klaviyo creates it from the supplied identifier.

### Lists

#### Get Lists

```bash
curl -s "https://a.klaviyo.com/api/lists" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

#### Create List

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "list",
    "attributes": {
      "name": "<your-list-name>"
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/lists" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

#### Add Profiles to a List (no consent change)

Use this to silently add already-known profiles to a list. Replace `<your-list-id>` in both the URL and the body.

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": [
    { "type": "profile", "id": "<your-profile-id-1>" },
    { "type": "profile", "id": "<your-profile-id-2>" }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/lists/<your-list-id>/relationships/profiles" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

### Subscriptions

#### Subscribe Profiles (with consent)

Use this when you have explicit consent — this is the endpoint that flips marketing-opt-in to `SUBSCRIBED` and can add the profile to a list. Replace `<your-list-id>`.

Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "profile-subscription-bulk-create-job",
    "attributes": {
      "custom_source": "Marketing Event",
      "profiles": {
        "data": [
          {
            "type": "profile",
            "attributes": {
              "email": "<your-recipient-email>",
              "subscriptions": {
                "email": {
                  "marketing": { "consent": "SUBSCRIBED" }
                }
              }
            }
          }
        ]
      }
    },
    "relationships": {
      "list": {
        "data": { "type": "list", "id": "<your-list-id>" }
      }
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

Returns `202 Accepted`. Max 1000 profiles per job. Requires scopes `lists:write`, `profiles:write`, `subscriptions:write`.

### Metrics

#### Get Metrics

```bash
curl -s "https://a.klaviyo.com/api/metrics" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

#### Query Metric Aggregates

Replace `<your-metric-id>`. Write to `/tmp/klaviyo_request.json`:

```json
{
  "data": {
    "type": "metric-aggregate",
    "attributes": {
      "metric_id": "<your-metric-id>",
      "measurements": ["count", "sum_value"],
      "interval": "day",
      "filter": [
        "greater-or-equal(datetime,2026-04-01T00:00:00Z)",
        "less-than(datetime,2026-05-01T00:00:00Z)"
      ]
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://a.klaviyo.com/api/metric-aggregates" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json" --header "content-type: application/vnd.api+json" -d @/tmp/klaviyo_request.json
```

### Segments

#### Get Segments

```bash
curl -s "https://a.klaviyo.com/api/segments" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

### Campaigns

Campaigns are tagged by channel — you must pass a `messages.channel` filter.

#### Get Email Campaigns

```bash
curl -s "https://a.klaviyo.com/api/campaigns?filter=equals(messages.channel,'email')" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

#### Get SMS Campaigns

```bash
curl -s "https://a.klaviyo.com/api/campaigns?filter=equals(messages.channel,'sms')" --header "Authorization: Klaviyo-API-Key $KLAVIYO_TOKEN" --header "revision: 2026-04-15" --header "accept: application/vnd.api+json"
```

## Response Codes

| Status | Description |
|--------|-------------|
| `200` | Success (GET / PATCH) |
| `201` | Created (POST profile / list) |
| `202` | Accepted (events, bulk jobs — processed async) |
| `400` | Invalid JSON:API payload |
| `401` | Missing / invalid API key |
| `403` | API key lacks required scope |
| `404` | Resource not found |
| `409` | Duplicate profile (email / phone already exists — returned ID is in `errors[].meta.duplicate_profile_id`) |
| `429` | Rate limit hit — respect `Retry-After` header |

## Guidelines

1. **Always send `revision`** — omitting it returns `400`. Use `2026-04-15` unless the skill needs a newer feature.
2. **JSON:API wrapping** — every body is `{"data": {"type": "...", "attributes": {...}}}`. Forgetting the envelope returns `400`.
3. **Rate limits** — most endpoints are 75 req/s burst, 700 req/min steady. Bulk jobs are the right tool when you have thousands of profiles.
4. **Consent matters** — use `POST /api/profile-subscription-bulk-create-jobs` (not list-membership) to change marketing opt-in. Adding a profile to a list alone does NOT consent them to marketing.
5. **409 on create profile** — the duplicate's ID is returned in the error payload; switch to `PATCH /api/profiles/{id}`.
6. **Private vs public key** — this skill only uses the private key (`pk_...`). The 6-character public key (Site ID) is for client-side tracking and is not needed here.

## API Reference

- Overview: https://developers.klaviyo.com/en/reference/api_overview
- Authentication: https://developers.klaviyo.com/en/docs/authenticate_
- OpenAPI spec: https://developers.klaviyo.com/en/reference/openapi
- Changelog / revisions: https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy
