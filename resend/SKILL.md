---
name: resend
description: Resend API for email delivery. Use when user mentions "Resend", "send
  email", "email API", or transactional email.
vm0_secrets:
  - RESEND_TOKEN
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
export RESEND_TOKEN="re_xxxxxxxxx"
```


> **Placeholders:** Values in `{curly-braces}` like `{email-id}` are placeholders. Replace them with actual values when executing.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/resend-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $RESEND_TOKEN" "$@"
EOF
chmod +x /tmp/resend-curl
```

**Usage:** All examples below use `/tmp/resend-curl` instead of direct `curl` calls.

## Emails

### Send Email

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["<your-recipient-email>"],
  "subject": "<your-subject>",
  "html": "<p><your-html-content></p>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails" -d @/tmp/resend_request.json
```

### Send Email with Plain Text

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["<your-recipient-email>"],
  "subject": "<your-subject>",
  "text": "<your-plain-text-content>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails" -d @/tmp/resend_request.json
```

### Send Email with CC/BCC

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["<your-recipient-email>"],
  "cc": ["<your-cc-email>"],
  "bcc": ["<your-bcc-email>"],
  "subject": "<your-subject>",
  "html": "<p><your-html-content></p>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails" -d @/tmp/resend_request.json
```

### Send Email with Reply-To

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["<your-recipient-email>"],
  "replyTo": "<your-reply-to-email>",
  "subject": "<your-subject>",
  "html": "<p><your-html-content></p>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails" -d @/tmp/resend_request.json
```

### Send Scheduled Email

Schedule email using natural language or ISO 8601 format:

Write to `/tmp/resend_request.json`:

```json
{
  "from": "Acme <onboarding@resend.dev>",
  "to": ["<your-recipient-email>"],
  "subject": "<your-subject>",
  "html": "<p><your-html-content></p>",
  "scheduledAt": "in 1 hour"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails" -d @/tmp/resend_request.json
```

### Send Batch Emails

Send up to 100 emails in a single request:

Write to `/tmp/resend_request.json`:

```json
[
  {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["<your-recipient-1>"],
    "subject": "Hello 1",
    "html": "<p>Email 1</p>"
  },
  {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["<your-recipient-2>"],
    "subject": "Hello 2",
    "html": "<p>Email 2</p>"
  }
]
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails/batch" -d @/tmp/resend_request.json
```

### Retrieve Email

```bash
/tmp/resend-curl "https://api.resend.com/emails/<your-email-id>"
```

### List Sent Emails

```bash
/tmp/resend-curl "https://api.resend.com/emails"
```

### Cancel Scheduled Email

```bash
/tmp/resend-curl -X POST "https://api.resend.com/emails/<your-email-id>/cancel"
```

---

## Contacts

### Create Contact

Write to `/tmp/resend_request.json`:

```json
{
  "email": "<your-contact-email>",
  "firstName": "<your-first-name>",
  "lastName": "<your-last-name>",
  "unsubscribed": false
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/contacts" -d @/tmp/resend_request.json
```

### Create Contact with Custom Properties

Write to `/tmp/resend_request.json`:

```json
{
  "email": "<your-contact-email>",
  "firstName": "<your-first-name>",
  "lastName": "<your-last-name>",
  "properties": {
    "company": "<your-company-name>",
    "role": "<your-role>"
  }
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/contacts" -d @/tmp/resend_request.json
```

### Retrieve Contact

```bash
/tmp/resend-curl "https://api.resend.com/contacts/<your-contact-id>"
```

### List Contacts

```bash
/tmp/resend-curl "https://api.resend.com/contacts"
```

### List Contacts with Pagination

```bash
/tmp/resend-curl "https://api.resend.com/contacts?limit=50"
```

### Update Contact

Write to `/tmp/resend_request.json`:

```json
{
  "firstName": "<your-new-first-name>",
  "unsubscribed": true
}
```

Then run:

```bash
/tmp/resend-curl -X PATCH "https://api.resend.com/contacts/<your-contact-id>" -d @/tmp/resend_request.json
```

### Delete Contact

```bash
/tmp/resend-curl -X DELETE "https://api.resend.com/contacts/<your-contact-id>"
```

---

## Domains

### List Domains

```bash
/tmp/resend-curl "https://api.resend.com/domains"
```

### Retrieve Domain

```bash
/tmp/resend-curl "https://api.resend.com/domains/<your-domain-id>"
```

### Create Domain

Write to `/tmp/resend_request.json`:

```json
{
  "name": "<your-domain-name>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/domains" -d @/tmp/resend_request.json
```

### Verify Domain

```bash
/tmp/resend-curl -X POST "https://api.resend.com/domains/<your-domain-id>/verify"
```

### Delete Domain

```bash
/tmp/resend-curl -X DELETE "https://api.resend.com/domains/<your-domain-id>"
```

---

## API Keys

### List API Keys

```bash
/tmp/resend-curl "https://api.resend.com/api-keys"
```

### Create API Key

Write to `/tmp/resend_request.json`:

```json
{
  "name": "<your-key-name>"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/api-keys" -d @/tmp/resend_request.json
```

### Create API Key with Permissions

Write to `/tmp/resend_request.json`:

```json
{
  "name": "<your-key-name>",
  "permission": "sending_access"
}
```

Then run:

```bash
/tmp/resend-curl -X POST "https://api.resend.com/api-keys" -d @/tmp/resend_request.json
```

### Delete API Key

```bash
/tmp/resend-curl -X DELETE "https://api.resend.com/api-keys/<your-api-key-id>"
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
