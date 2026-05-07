---
name: luma
description: Luma event platform API for managing events, guests, tickets, and calendar data. Use when user mentions "Luma", "lu.ma", "event", "ticket", "guest list", "RSVP", or "calendar event".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name LUMA_API_KEY` or `zero doctor check-connector --url https://public-api.luma.com/v1/user/get-self --method GET`

## Authentication

All requests require an API key passed in the header:

```
x-luma-api-key: $LUMA_API_KEY
```

Get your API key from: Luma → Calendars Home → select calendar → Settings → Developer → API Keys.

> A Luma Plus subscription is required for API access. Each API key is scoped to a single calendar.

## Rate Limits

- Calendar API keys: 200 requests/min
- Organization API keys: 500 requests/min

## Key Endpoints

Base URL: `https://public-api.luma.com`

### Events

**Get Event**
`GET /v1/event/get?id=evt-...`

Returns admin information about an event you have manage access for.

```bash
curl -s "https://public-api.luma.com/v1/event/get?id=$EVENT_ID" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

**List Calendar Events**
`GET /v1/calendar/list-events`

List all events managed by the calendar. Supports pagination, date filtering, and status.

```bash
curl -s "https://public-api.luma.com/v1/calendar/list-events?pagination_limit=25" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

Parameters:
- `before` / `after` — ISO 8601 datetime filter
- `pagination_cursor` — cursor from previous response `next_cursor`
- `pagination_limit` — results per page
- `status` — `approved` (default) or `pending`

### Guests

**Get Guest**
`GET /v1/event/get-guest?event_id=evt-...&id=gst-...`

Look up a guest by guest ID, ticket key, guest key, or email.

```bash
curl -s "https://public-api.luma.com/v1/event/get-guest?event_id=$EVENT_ID&id=$GUEST_ID" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

**List Guests**
`GET /v1/event/get-guests?event_id=evt-...`

Paginated list of guests registered or invited to an event.

```bash
curl -s "https://public-api.luma.com/v1/event/get-guests?event_id=$EVENT_ID&pagination_limit=50" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

Parameters:
- `approval_status` — filter: `approved`, `session`, `pending_approval`, `invited`, `declined`, `waitlist`
- `sort_column` — `name`, `email`, `created_at`, `registered_at`, `checked_in_at`
- `sort_direction` — `asc`, `desc`

### Calendar

**Get Calendar**
`GET /v1/calendar/get`

Returns calendar info: name, slug, description, location, social handles.

```bash
curl -s "https://public-api.luma.com/v1/calendar/get" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

**List People**
`GET /v1/calendar/list-people`

Search and filter people associated with the calendar.

```bash
curl -s "https://public-api.luma.com/v1/calendar/list-people?pagination_limit=25" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

Parameters:
- `query` — search over names and emails
- `member_status` — `approved`, `pending`, `approved-pending-payment`, `declined`
- `sort_column` — `created_at`, `event_checked_in_count`, `event_approved_count`, `name`, `revenue_usd_cents`

**List Admins**
`GET /v1/calendar/admins/list`

```bash
curl -s "https://public-api.luma.com/v1/calendar/admins/list" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

### Tickets

**List Ticket Types**
`GET /v1/event/ticket-types/list?event_id=evt-...`

```bash
curl -s "https://public-api.luma.com/v1/event/ticket-types/list?event_id=$EVENT_ID" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

### Coupons

**List Event Coupons**
`GET /v1/event/coupons?event_id=evt-...`

```bash
curl -s "https://public-api.luma.com/v1/event/coupons?event_id=$EVENT_ID" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

**List Calendar Coupons**
`GET /v1/calendar/coupons`

```bash
curl -s "https://public-api.luma.com/v1/calendar/coupons" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

### User

**Get Current User**
`GET /v1/user/get-self`

Test authentication and get the authenticated user's info.

```bash
curl -s "https://public-api.luma.com/v1/user/get-self" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

### Lookup

**Lookup Entity by Slug**
`GET /v1/entity/lookup?slug=...`

Resolve a calendar or event by its slug.

```bash
curl -s "https://public-api.luma.com/v1/entity/lookup?slug=$SLUG" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

## Common Workflows

### Check Upcoming Events

```bash
curl -s "https://public-api.luma.com/v1/calendar/list-events?pagination_limit=10" \
  -H "x-luma-api-key: $LUMA_API_KEY" | jq '.entries[] | {name: .event.name, start: .event.start_at, url: .event.url}'
```

### Get Guest List for an Event

```bash
curl -s "https://public-api.luma.com/v1/event/get-guests?event_id=$EVENT_ID&pagination_limit=50" \
  -H "x-luma-api-key: $LUMA_API_KEY" | jq '.entries[] | {name: .user_name, email: .user_email, status: .approval_status}'
```

### Find a Person by Email

```bash
curl -s "https://public-api.luma.com/v1/calendar/list-people?query=$EMAIL&pagination_limit=5" \
  -H "x-luma-api-key: $LUMA_API_KEY" | jq '.entries[] | {name: .user.name, email: .email, events: .event_approved_count}'
```

## Notes

- All list endpoints use cursor-based pagination: pass `pagination_cursor` from the prior response's `next_cursor`
- All datetime fields use ISO 8601 format
- The `api_id` parameter is deprecated across all endpoints; use `id` instead
- Event IDs start with `evt-`, guest IDs with `gst-`, ticket type IDs with `ett-`
- Full OpenAPI spec available at `https://public-api.luma.com/openapi.json`
