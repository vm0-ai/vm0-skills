---
name: calendly
description: Calendly scheduling API. Use when user mentions "Calendly", "calendly.com", "schedule a meeting", "booking link", "event types", or asks about interview scheduling.
vm0_secrets:
  - CALENDLY_TOKEN
---

# Calendly API

Read scheduling data, list event types, retrieve scheduled meetings, and access invitee information via the Calendly API v2.

> Official docs: `https://developer.calendly.com/api-docs/`

## When to Use

- List available event types (e.g., 30-min intro call, 60-min interview)
- Retrieve scheduled meetings for a user or organization
- Get invitee details for a specific event
- Set up webhook subscriptions to receive real-time booking notifications
- Look up user and organization details

## Prerequisites


Alternatively, generate a Personal Access Token from your Calendly account under **Integrations > API & Webhooks**, then export it:

```bash
export CALENDLY_TOKEN=your_personal_access_token
```

> **Note:** Calendly's API is primarily read-only — you can retrieve scheduling data but **cannot directly create bookings** via API. Share Calendly scheduling links to let users self-book.
>
> **Important:** When using `$CALENDLY_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Get Current User

Returns the authenticated user's URI and organization URI — needed for subsequent calls:

```bash
bash -c 'curl -s "https://api.calendly.com/users/me" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '{uri, name, email, organization: .current_organization}'
```

---

### List Event Types

List all event types for the current user. First get your user URI from the step above.

Replace `<user-uri>` with the full URI from `GET /users/me` (e.g., `https://api.calendly.com/users/AAAAAAA`):

```bash
bash -c 'curl -s "https://api.calendly.com/event_types?user=<user-uri>" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '[.collection[] | {uri, name, duration, active, scheduling_url}]'
```

---

### List Scheduled Events

List upcoming scheduled events for a user. Replace `<user-uri>` with your user URI:

```bash
bash -c 'curl -s "https://api.calendly.com/scheduled_events?user=<user-uri>&status=active&count=20" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '[.collection[] | {uri, name, status, start_time, end_time, location: .location.type}]'
```

---

### List Past Scheduled Events

Replace `<user-uri>` with your user URI:

```bash
bash -c 'curl -s "https://api.calendly.com/scheduled_events?user=<user-uri>&status=canceled&count=20" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '[.collection[] | {uri, name, status, start_time}]'
```

---

### Get a Scheduled Event

Replace `<event-uuid>` with the UUID portion from a scheduled event URI:

```bash
bash -c 'curl -s "https://api.calendly.com/scheduled_events/<event-uuid>" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '{uri, name, status, start_time, end_time, invitees_counter}'
```

---

### List Invitees for an Event

Get all invitees (attendees) for a specific scheduled event. Replace `<event-uuid>`:

```bash
bash -c 'curl -s "https://api.calendly.com/scheduled_events/<event-uuid>/invitees" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '[.collection[] | {uri, name, email, status, created_at}]'
```

---

### Create Webhook Subscription

Receive real-time notifications when events are booked or canceled. Replace `<organization-uri>` with your org URI from `GET /users/me`.

Write to `/tmp/calendly_request.json`:

```json
{
  "url": "https://your-server.com/webhooks/calendly",
  "events": ["invitee.created", "invitee.canceled"],
  "organization": "<organization-uri>",
  "scope": "organization"
}
```

```bash
bash -c 'curl -s -X POST "https://api.calendly.com/webhook_subscriptions" --header "Authorization: Bearer $CALENDLY_TOKEN" --header "Content-Type: application/json" -d @/tmp/calendly_request.json' | jq '{uri, callback_url: .resource.callback_url, events: .resource.events}'
```

---

### List Webhook Subscriptions

```bash
bash -c 'curl -s "https://api.calendly.com/webhook_subscriptions?organization=<organization-uri>&scope=organization" --header "Authorization: Bearer $CALENDLY_TOKEN"' | jq '[.collection[] | {uri, callback_url, events, state}]'
```

---

### Delete Webhook Subscription

Replace `<webhook-uuid>` with the UUID from the webhook URI:

```bash
bash -c 'curl -s -X DELETE "https://api.calendly.com/webhook_subscriptions/<webhook-uuid>" --header "Authorization: Bearer $CALENDLY_TOKEN"' -w "\nHTTP Status: %{http_code}\n"
```

---

## Guidelines

1. **URIs as identifiers**: Calendly uses full URIs (e.g., `https://api.calendly.com/users/XXXXX`) as identifiers — not bare IDs. Always use the full URI in filter parameters.
2. **Read-only API**: You cannot create bookings or force-schedule meetings via API. Direct users to a Calendly scheduling link (`scheduling_url` in event types) for self-booking.
3. **Webhooks require paid plan**: Webhook subscriptions are only available on Standard plan and above.
4. **Scope**: Use `user` scope for individual events; `organization` scope for team-wide data.
5. **Pagination**: Use `page_token` from `pagination.next_page_token` to fetch subsequent pages.
6. **Event status**: `active` = upcoming/confirmed; `canceled` = canceled events.
