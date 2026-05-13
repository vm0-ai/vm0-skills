---
name: sendgrid
description: Twilio SendGrid API for transactional and marketing email. Use when user mentions "SendGrid", "send email", "transactional email", "email marketing", "email API", or "Twilio SendGrid".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SENDGRID_TOKEN` or `zero doctor check-connector --url https://api.sendgrid.com/v3/scopes --method GET`

## How to Use

All examples assume `SENDGRID_TOKEN` is set. SendGrid uses Bearer authentication on all v3 endpoints.

Base URL: `https://api.sendgrid.com/v3`

### 1. Verify the API Key

Returns the scopes attached to the current key. Useful for sanity-checking the connection.

```bash
curl -s "https://api.sendgrid.com/v3/scopes" --header "Authorization: Bearer $SENDGRID_TOKEN"
```

### 2. Send a Single Transactional Email

Write to `/tmp/sendgrid_request.json`:

```json
{
  "personalizations": [
    {
      "to": [{ "email": "recipient@example.com", "name": "Recipient" }],
      "subject": "Hello from vm0"
    }
  ],
  "from": { "email": "noreply@your-verified-domain.com", "name": "vm0" },
  "content": [
    { "type": "text/plain", "value": "This is a plain-text body." },
    { "type": "text/html", "value": "<p>This is an <strong>HTML</strong> body.</p>" }
  ]
}
```

Then send. A successful call returns `202 Accepted` with an empty body:

```bash
curl -s -X POST "https://api.sendgrid.com/v3/mail/send" --header "Authorization: Bearer $SENDGRID_TOKEN" --header "Content-Type: application/json" -d @/tmp/sendgrid_request.json
```

### 3. Send to Multiple Recipients with Personalization

Each `personalizations[]` entry produces a separate email. Substitution data is per-recipient.

Write to `/tmp/sendgrid_request.json`:

```json
{
  "personalizations": [
    { "to": [{ "email": "alice@example.com" }], "dynamic_template_data": { "first_name": "Alice" } },
    { "to": [{ "email": "bob@example.com" }], "dynamic_template_data": { "first_name": "Bob" } }
  ],
  "from": { "email": "noreply@your-verified-domain.com" },
  "template_id": "<your-template-id>"
}
```

```bash
curl -s -X POST "https://api.sendgrid.com/v3/mail/send" --header "Authorization: Bearer $SENDGRID_TOKEN" --header "Content-Type: application/json" -d @/tmp/sendgrid_request.json
```

### 4. List Dynamic Templates

```bash
curl -s "https://api.sendgrid.com/v3/templates?generations=dynamic&page_size=100" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.result[] | {id, name, generation}'
```

### 5. Get a Single Template (with all versions)

Replace `<template-id>` with an ID from the list above:

```bash
curl -s "https://api.sendgrid.com/v3/templates/<template-id>" --header "Authorization: Bearer $SENDGRID_TOKEN"
```

### 6. List Suppressions (Bounces, Blocks, Spam Reports)

Recent bounces:

```bash
curl -s "https://api.sendgrid.com/v3/suppression/bounces" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.[] | {email, reason, created}'
```

Other suppression lists follow the same shape — replace the path segment:
- `/v3/suppression/blocks`
- `/v3/suppression/spam_reports`
- `/v3/suppression/invalid_emails`
- `/v3/asm/suppressions/global` (global unsubscribes)

### 7. Remove an Address from a Suppression List

Replace `<email>` with the address to release. Returns `204 No Content` on success:

```bash
curl -s -X DELETE "https://api.sendgrid.com/v3/suppression/bounces/<email>" --header "Authorization: Bearer $SENDGRID_TOKEN"
```

### 8. List Verified Senders

Senders must be verified before they can appear in the `from` field.

```bash
curl -s "https://api.sendgrid.com/v3/verified_senders" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.results[] | {id, from_email, verified}'
```

### 9. Marketing Campaigns — List Contacts

Marketing Campaigns uses a separate path under `/v3/marketing`:

```bash
curl -s "https://api.sendgrid.com/v3/marketing/contacts" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.result[] | {id, email, first_name, last_name}'
```

### 10. Add or Update a Contact

Upsert is asynchronous and returns a `job_id`. Write to `/tmp/sendgrid_request.json`:

```json
{
  "contacts": [
    { "email": "newcontact@example.com", "first_name": "Pat", "last_name": "Sample" }
  ]
}
```

```bash
curl -s -X PUT "https://api.sendgrid.com/v3/marketing/contacts" --header "Authorization: Bearer $SENDGRID_TOKEN" --header "Content-Type: application/json" -d @/tmp/sendgrid_request.json
```

### 11. List Marketing Lists

```bash
curl -s "https://api.sendgrid.com/v3/marketing/lists" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.result[] | {id, name, contact_count}'
```

### 12. Get Email Activity Stats

Aggregate stats by day for a date range:

```bash
curl -s "https://api.sendgrid.com/v3/stats?start_date=2026-04-01&end_date=2026-05-01&aggregated_by=day" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.[] | {date, stats: .stats[0].metrics}'
```

Aggregate by week or month by setting `aggregated_by=week` or `aggregated_by=month`.

## Common Workflows

### Send a templated email to a single recipient

```bash
# 1. Find the template you want to use
curl -s "https://api.sendgrid.com/v3/templates?generations=dynamic" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq '.result[] | {id, name}'

# 2. Build the request with the template ID and per-recipient data
# Write to /tmp/sendgrid_request.json
# {
#   "personalizations": [{ "to": [{"email": "user@example.com"}], "dynamic_template_data": {"name": "Pat"} }],
#   "from": { "email": "noreply@your-domain.com" },
#   "template_id": "d-abcdef0123456789"
# }
curl -s -X POST "https://api.sendgrid.com/v3/mail/send" --header "Authorization: Bearer $SENDGRID_TOKEN" --header "Content-Type: application/json" -d @/tmp/sendgrid_request.json
```

### Audit recent bounces

```bash
curl -s "https://api.sendgrid.com/v3/suppression/bounces?start_time=1714521600" --header "Authorization: Bearer $SENDGRID_TOKEN" | jq 'group_by(.reason) | map({reason: .[0].reason, count: length})'
```

`start_time` is a Unix epoch timestamp.

## Guidelines

1. The `from.email` must be a verified sender or part of a verified sending domain — unverified senders return `403`.
2. `Authorization: Bearer $SENDGRID_TOKEN` is the only supported auth scheme on v3.
3. `/v3/mail/send` returns `202 Accepted` with an empty body on success — no message ID is returned in the body; use the `X-Message-Id` response header for tracking.
4. Marketing Campaigns endpoints live under `/v3/marketing/` and use a different rate-limit pool than `/v3/mail/send`.
5. Contact upserts are asynchronous — you get a `job_id`, then poll `/v3/marketing/contacts/imports/<job_id>` for status.
6. Dates accept ISO 8601 (`2026-04-18`) or Unix epoch depending on the endpoint — check the docs per call.
7. Pagination uses `page_size` and `page_token`; `Link` response header carries the cursor for the next page.
8. Rate limits vary by endpoint (e.g., `/v3/mail/send` allows ~600 requests per minute on most plans) — watch `X-RateLimit-Remaining` and `X-RateLimit-Reset`.

## API Reference

- API reference: https://www.twilio.com/docs/sendgrid/api-reference
- Mail Send v3: https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
- Marketing Campaigns: https://www.twilio.com/docs/sendgrid/api-reference/marketing-campaigns-contacts
- Suppressions: https://www.twilio.com/docs/sendgrid/api-reference/suppressions-bounces
- Stats: https://www.twilio.com/docs/sendgrid/api-reference/stats
