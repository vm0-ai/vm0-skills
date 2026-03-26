---
name: cal-com
description: Cal.com open-source scheduling API. Use when user mentions "Cal.com", "cal.com", "open source scheduling", "booking", "event types", or asks about interview or meeting scheduling.
vm0_secrets:
  - CALCOM_TOKEN
---

# Cal.com API

Manage bookings, event types, and availability via the Cal.com REST API v2.

> Official docs: `https://cal.com/docs/api-reference/v2/introduction`

## When to Use

- List event types (meeting formats available for booking)
- Create, retrieve, or cancel bookings programmatically
- Check a user's availability for scheduling
- Integrate booking flows into your own application

## Prerequisites


Alternatively, generate an API key from your Cal.com account under **Settings > Security > API Keys** (key is prefixed with `cal_live_`), then export it:

```bash
export CALCOM_TOKEN=cal_live_your_key_here
```

> **Important:** All Cal.com API v2 requests require the `cal-api-version: 2024-08-13` header. When using `$CALCOM_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Get Current User

```bash
bash -c 'curl -s "https://api.cal.com/v2/me" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '{id, email, name, username, timeZone}'
```

---

### List Event Types

```bash
bash -c 'curl -s "https://api.cal.com/v2/event-types" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '[.data[] | {id, title, slug, length, hidden}]'
```

---

### Get Event Type

Replace `<event-type-id>` with the numeric ID from the list above:

```bash
bash -c 'curl -s "https://api.cal.com/v2/event-types/<event-type-id>" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '.data | {id, title, length, description, locations}'
```

---

### Get Availability

Check available slots for an event type. Replace `<username>` and `<event-type-slug>` with actual values. Dates in `YYYY-MM-DD` format:

```bash
bash -c 'curl -s "https://api.cal.com/v2/slots/available?username=<username>&eventTypeSlug=<event-type-slug>&startTime=2025-01-15&endTime=2025-01-22&timeZone=America/New_York" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '{slots: [.data.slots | to_entries[] | {date: .key, times: [.value[] | .time]}] | .[0:3]}'
```

---

### Create Booking

Write to `/tmp/calcom_request.json`:

```json
{
  "start": "2025-01-20T14:00:00.000Z",
  "eventTypeId": 123,
  "attendee": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "timeZone": "America/New_York",
    "language": "en"
  },
  "metadata": {
    "source": "clerk_sync"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.cal.com/v2/bookings" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13" --header "Content-Type: application/json" -d @/tmp/calcom_request.json' | jq '{uid, status, start, end, attendees: [.attendees[] | {name, email}]}'
```

Docs: https://cal.com/docs/api-reference/v2/bookings/create-a-booking

---

### List Bookings

```bash
bash -c 'curl -s "https://api.cal.com/v2/bookings?take=20" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '[.data[] | {uid, status, title, start, end, attendeeName: .attendees[0].name}]'
```

---

### Get Booking

Replace `<booking-uid>` with the booking UID from the list above:

```bash
bash -c 'curl -s "https://api.cal.com/v2/bookings/<booking-uid>" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13"' | jq '{uid, status, title, start, end, attendees}'
```

---

### Cancel Booking

Replace `<booking-uid>` with the booking UID.

Write to `/tmp/calcom_request.json`:

```json
{
  "cancellationReason": "Schedule conflict"
}
```

```bash
bash -c 'curl -s -X DELETE "https://api.cal.com/v2/bookings/<booking-uid>/cancel" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13" --header "Content-Type: application/json" -d @/tmp/calcom_request.json' | jq '{status}'
```

---

### Reschedule Booking

Replace `<booking-uid>` with the booking UID.

Write to `/tmp/calcom_request.json`:

```json
{
  "start": "2025-01-22T15:00:00.000Z",
  "reschedulingReason": "Attendee requested different time"
}
```

```bash
bash -c 'curl -s -X POST "https://api.cal.com/v2/bookings/<booking-uid>/reschedule" --header "Authorization: Bearer $CALCOM_TOKEN" --header "cal-api-version: 2024-08-13" --header "Content-Type: application/json" -d @/tmp/calcom_request.json' | jq '{uid, status, start, end}'
```

---

## Guidelines

1. **API version header**: Always include `cal-api-version: 2024-08-13` — requests without this header will fail.
2. **API key prefix**: Cal.com API keys are prefixed with `cal_live_` (production) or `cal_test_` (test environment).
3. **eventTypeId**: Required when creating a booking — get it from the List Event Types endpoint.
4. **Timestamps**: Use ISO 8601 format with UTC timezone (e.g., `2025-01-20T14:00:00.000Z`).
5. **Rate limits**: 120 requests per minute with API key auth. Response headers include `X-RateLimit-Remaining`.
6. **Self-hosted**: If using a self-hosted Cal.com instance, replace `api.cal.com` with your own domain.
7. **Booking confirmation**: If an event type requires manual confirmation, bookings start with `pending` status until confirmed.
