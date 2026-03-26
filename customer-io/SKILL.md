---
name: customer-io
description: Customer.io behavioral email and messaging platform. Use when user mentions "Customer.io", "behavioral emails", "lifecycle emails", "triggered messages", or asks about event-based email automation.
vm0_secrets:
  - CUSTOMERIO_APP_TOKEN
  - CUSTOMERIO_SITE_ID
  - CUSTOMERIO_TRACK_TOKEN
---

# Customer.io API

Send behavioral emails, SMS, and push notifications triggered by user events. Two separate APIs — the **Pipelines API** for identifying people and tracking events, and the **App API** for sending transactional messages.

> Official docs: `https://docs.customer.io/integrations/api/customerio-apis/`

## When to Use

- Sync users from Clerk or another auth provider as Customer.io people
- Track behavioral events (signed up, upgraded, churned) to trigger automated campaigns
- Send transactional emails (password reset, receipt, notification)
- Query or manage people profiles and segments

## Prerequisites


Alternatively, set these manually:

```bash
# For tracking people and events (Pipelines API)
export CUSTOMERIO_SITE_ID=your_site_id
export CUSTOMERIO_TRACK_TOKEN=your_track_api_key

# For sending transactional messages (App API)
export CUSTOMERIO_APP_TOKEN=your_app_api_key
```

Find credentials at **Workspace Settings > API & webhook credentials**.

> **Important:** When using `$VAR` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Identify a Person (Pipelines API)

Add or update a person's profile. Uses **Basic auth** with Site ID and Track API key combined and base64-encoded.

Write to `/tmp/cio_request.json`:

```json
{
  "userId": "clerk_user_abc123",
  "traits": {
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "plan": "free",
    "createdAt": 1700000000
  }
}
```

```bash
bash -c 'curl -s -X POST "https://cdp.customer.io/v1/identify" --header "Authorization: Basic $(printf "%s:%s" "$CUSTOMERIO_SITE_ID" "$CUSTOMERIO_TRACK_TOKEN" | base64 -w 0)" --header "Content-Type: application/json" -d @/tmp/cio_request.json'
```

Docs: https://docs.customer.io/integrations/data-in/connections/http-api/

---

### Track an Event (Pipelines API)

Send a behavioral event to trigger automated campaigns or journeys.

Write to `/tmp/cio_request.json`:

```json
{
  "userId": "clerk_user_abc123",
  "event": "plan_upgraded",
  "properties": {
    "from_plan": "free",
    "to_plan": "pro",
    "mrr": 49
  }
}
```

```bash
bash -c 'curl -s -X POST "https://cdp.customer.io/v1/track" --header "Authorization: Basic $(printf "%s:%s" "$CUSTOMERIO_SITE_ID" "$CUSTOMERIO_TRACK_TOKEN" | base64 -w 0)" --header "Content-Type: application/json" -d @/tmp/cio_request.json'
```

---

### Send Transactional Email (App API)

Send a one-off email using a template configured in Customer.io. Replace `<transactional-message-id>` with the ID from your Customer.io dashboard.

Write to `/tmp/cio_request.json`:

```json
{
  "transactional_message_id": "<transactional-message-id>",
  "to": "user@example.com",
  "identifiers": {
    "email": "user@example.com"
  },
  "message_data": {
    "firstName": "Jane",
    "resetLink": "https://app.example.com/reset?token=abc123"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.customer.io/v1/send/email" --header "Authorization: Bearer $CUSTOMERIO_APP_TOKEN" --header "Content-Type: application/json" -d @/tmp/cio_request.json'
```

Docs: https://docs.customer.io/journeys/transactional-api-examples/

---

### Delete a Person (App API)

Delete a person by their Customer.io ID. Replace `<person-id>` with the actual ID:

```bash
bash -c 'curl -s -X DELETE "https://api.customer.io/v1/customers/<person-id>" --header "Authorization: Bearer $CUSTOMERIO_APP_TOKEN"'
```

---

### Search People (App API)

Write to `/tmp/cio_request.json`:

```json
{
  "filter": {
    "and": [
      {
        "attribute": {
          "field": "email",
          "operator": "eq",
          "value": "user@example.com"
        }
      }
    ]
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.customer.io/v1/customers" --header "Authorization: Bearer $CUSTOMERIO_APP_TOKEN" --header "Content-Type: application/json" -d @/tmp/cio_request.json' | jq '{results: [.results[] | {id, email: .attributes.email}]}'
```

---

### List Segments (App API)

```bash
bash -c 'curl -s "https://api.customer.io/v1/segments" --header "Authorization: Bearer $CUSTOMERIO_APP_TOKEN"' | jq '[.segments[] | {id, name, type}]'
```

---

## Guidelines

1. **Two API systems**: Pipelines API (`cdp.customer.io`) handles identity and events; App API (`api.customer.io`) handles transactional sends and profile queries. Use different credentials for each.
2. **Basic auth encoding**: The Pipelines API uses `base64(site_id:track_api_key)` — not Bearer token.
3. **userId**: Use a stable, unique identifier (e.g., Clerk user ID). Do not use email as the primary ID if users can change their email.
4. **Event names**: Use `snake_case` by convention (e.g., `plan_upgraded`, `interview_scheduled`).
5. **Transactional message ID**: Find it in Customer.io under **Journeys > Transactional > [template]** in the URL or code example tab.
6. **Rate limit**: 100 requests per second (fair-use). Implement exponential backoff on HTTP 429.
7. **Regions**: Default region uses `api.customer.io`; EU region uses `api-eu.customer.io` and `track-eu.customer.io`.
