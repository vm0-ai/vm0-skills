---
name: resend
description: Resend email API via curl. Use this skill to send transactional emails, manage contacts, domains, and API keys.
vm0_secrets:
  - RESEND_API_KEY
---

# Resend Email API

Send transactional emails, manage contacts, and domains via Resend's REST API.

> Official docs: https://resend.com/docs/api-reference/introduction

---

## When to Use

Use this skill when you need to:

- Send transactional emails (welcome, password reset, notifications)
- Send batch emails to multiple recipients
- Manage email contacts and audiences
- Verify and manage sending domains
- Track email delivery status

---

## Prerequisites

1. Sign up at https://resend.com
2. Go to API Keys: https://resend.com/api-keys
3. Create a new API key

Set environment variable:

```bash
export RESEND_API_KEY="re_xxxxxxxxx"
```

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `{curly-braces}` like `{email-id}` are placeholders. Replace them with actual values when executing.

---

## Emails

### Send Email

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["{recipient-email}"],
  "subject": "{subject}",
  "html": "<p>{html-content}</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Send Email with Plain Text

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["{recipient-email}"],
  "subject": "{subject}",
  "text": "{plain-text-content}"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Send Email with CC/BCC

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["{recipient-email}"],
  "cc": ["{cc-email}"],
  "bcc": ["{bcc-email}"],
  "subject": "{subject}",
  "html": "<p>{html-content}</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Send Email with Reply-To

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["{recipient-email}"],
  "replyTo": "{reply-to-email}",
  "subject": "{subject}",
  "html": "<p>{html-content}</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Send Scheduled Email

Schedule email using natural language or ISO 8601 format:

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["{recipient-email}"],
  "subject": "{subject}",
  "html": "<p>{html-content}</p>",
  "scheduledAt": "in 1 hour"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Send Batch Emails

Send up to 100 emails in a single request:

Write to `/tmp/resend_request.json`:

```json
[
  {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["{recipient-1}"],
    "subject": "Hello 1",
    "html": "<p>Email 1</p>"
  },
  {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["{recipient-2}"],
    "subject": "Hello 2",
    "html": "<p>Email 2</p>"
  }
]
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails/batch" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Retrieve Email

```bash
bash -c 'curl -s "https://api.resend.com/emails/{email-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### List Sent Emails

```bash
bash -c 'curl -s "https://api.resend.com/emails" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Cancel Scheduled Email

```bash
bash -c 'curl -s -X POST "https://api.resend.com/emails/{email-id}/cancel" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

---

## Contacts

### Create Contact

Write to `/tmp/resend_request.json`:

```json
{
  "email": "{contact-email}",
  "firstName": "{first-name}",
  "lastName": "{last-name}",
  "unsubscribed": false
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/contacts" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Create Contact with Custom Properties

Write to `/tmp/resend_request.json`:

```json
{
  "email": "{contact-email}",
  "firstName": "{first-name}",
  "lastName": "{last-name}",
  "properties": {
    "company": "{company-name}",
    "role": "{role}"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/contacts" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Retrieve Contact

```bash
bash -c 'curl -s "https://api.resend.com/contacts/{contact-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### List Contacts

```bash
bash -c 'curl -s "https://api.resend.com/contacts" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### List Contacts with Pagination

```bash
bash -c 'curl -s "https://api.resend.com/contacts?limit=50" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Update Contact

Write to `/tmp/resend_request.json`:

```json
{
  "firstName": "{new-first-name}",
  "unsubscribed": true
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.resend.com/contacts/{contact-id}" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Delete Contact

```bash
bash -c 'curl -s -X DELETE "https://api.resend.com/contacts/{contact-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

---

## Domains

### List Domains

```bash
bash -c 'curl -s "https://api.resend.com/domains" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Retrieve Domain

```bash
bash -c 'curl -s "https://api.resend.com/domains/{domain-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Create Domain

Write to `/tmp/resend_request.json`:

```json
{
  "name": "{domain-name}"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/domains" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Verify Domain

```bash
bash -c 'curl -s -X POST "https://api.resend.com/domains/{domain-id}/verify" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Delete Domain

```bash
bash -c 'curl -s -X DELETE "https://api.resend.com/domains/{domain-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

---

## API Keys

### List API Keys

```bash
bash -c 'curl -s "https://api.resend.com/api-keys" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

### Create API Key

Write to `/tmp/resend_request.json`:

```json
{
  "name": "{key-name}"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/api-keys" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Create API Key with Permissions

Write to `/tmp/resend_request.json`:

```json
{
  "name": "{key-name}",
  "permission": "sending_access"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.resend.com/api-keys" --header "Authorization: Bearer $RESEND_API_KEY" --header "Content-Type: application/json" -d @/tmp/resend_request.json' | jq .
```

### Delete API Key

```bash
bash -c 'curl -s -X DELETE "https://api.resend.com/api-keys/{api-key-id}" --header "Authorization: Bearer $RESEND_API_KEY"' | jq .
```

---

## Email Parameters Reference

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Sender email (required). Format: `"Name <email@domain.com>"` |
| `to` | string[] | Recipients (required). Max 50 addresses |
| `subject` | string | Email subject (required) |
| `html` | string | HTML content |
| `text` | string | Plain text content |
| `cc` | string[] | CC recipients |
| `bcc` | string[] | BCC recipients |
| `replyTo` | string | Reply-to address |
| `scheduledAt` | string | Schedule time (ISO 8601 or natural language) |
| `tags` | array | Custom tags for tracking |
| `attachments` | array | File attachments (max 40MB total) |

---

## Response Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `400` | Invalid parameters |
| `401` | Missing API key |
| `403` | Invalid API key |
| `404` | Resource not found |
| `429` | Rate limit exceeded (2 req/sec) |
| `5xx` | Server error |

---

## Guidelines

1. **Rate Limits**: Default is 2 requests per second; implement backoff for 429 errors
2. **Sender Domain**: Use verified domains for production; `onboarding@resend.dev` for testing
3. **Batch Emails**: Use `/emails/batch` for sending to multiple recipients efficiently
4. **Idempotency**: Use `Idempotency-Key` header to prevent duplicate sends
5. **Scheduling**: Use natural language (`in 1 hour`) or ISO 8601 format for `scheduledAt`

---

## API Reference

- Documentation: https://resend.com/docs/api-reference/introduction
- Dashboard: https://resend.com/overview
- API Keys: https://resend.com/api-keys
- Domains: https://resend.com/domains
