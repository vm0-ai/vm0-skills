---
name: brevo
description: Brevo email and SMS marketing platform. Use when user mentions "Brevo", "Sendinblue", "email campaigns", "SMS marketing", "contact lists", or asks about multi-channel marketing.
vm0_secrets:
  - BREVO_TOKEN
---

# Brevo API

Send transactional emails, SMS, and marketing campaigns. Manage contacts and lists via Brevo (formerly Sendinblue).

> Official docs: `https://developers.brevo.com/docs/getting-started`

## When to Use

- Import contacts from Clerk or another auth provider
- Send transactional emails (receipts, password resets, alerts)
- Create and send email marketing campaigns
- Manage contact lists and attributes
- Send SMS messages

## Prerequisites


Alternatively, generate an API key from your Brevo account under **Settings > SMTP & API > API Keys**, then export it:

```bash
export BREVO_TOKEN=your_api_key_here
```

> **Important:** Brevo uses the custom header `api-key` (not `Authorization: Bearer`). When using `$BREVO_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Get Account Info

Verify your API key and view account details:

```bash
bash -c 'curl -s "https://api.brevo.com/v3/account" --header "api-key: $BREVO_TOKEN" --header "accept: application/json"' | jq '{companyName, email, plan: .plan[0].type}'
```

---

### Create Contact

Write to `/tmp/brevo_request.json`:

```json
{
  "email": "user@example.com",
  "attributes": {
    "FIRSTNAME": "Jane",
    "LASTNAME": "Doe"
  },
  "listIds": [1],
  "updateEnabled": true
}
```

```bash
bash -c 'curl -s -X POST "https://api.brevo.com/v3/contacts" --header "api-key: $BREVO_TOKEN" --header "Content-Type: application/json" --header "accept: application/json" -d @/tmp/brevo_request.json' | jq '{id}'
```

Docs: https://developers.brevo.com/reference/create-contact

---

### Get Contact

Replace `<email-or-id>` with the contact's email address or numeric ID:

```bash
bash -c 'curl -s "https://api.brevo.com/v3/contacts/<email-or-id>" --header "api-key: $BREVO_TOKEN" --header "accept: application/json"' | jq '{id, email, attributes}'
```

---

### Update Contact

Replace `<email-or-id>` with the contact's email or ID.

Write to `/tmp/brevo_request.json`:

```json
{
  "attributes": {
    "PLAN": "pro",
    "SMS": "+13125551234"
  },
  "listIds": [2]
}
```

```bash
bash -c 'curl -s -X PUT "https://api.brevo.com/v3/contacts/<email-or-id>" --header "api-key: $BREVO_TOKEN" --header "Content-Type: application/json" -d @/tmp/brevo_request.json' -w "\nHTTP Status: %{http_code}\n"
```

---

### Delete Contact

Replace `<email-or-id>` with the contact's email or ID:

```bash
bash -c 'curl -s -X DELETE "https://api.brevo.com/v3/contacts/<email-or-id>" --header "api-key: $BREVO_TOKEN"' -w "\nHTTP Status: %{http_code}\n"
```

---

### List Contacts

```bash
bash -c 'curl -s "https://api.brevo.com/v3/contacts?limit=20&offset=0" --header "api-key: $BREVO_TOKEN" --header "accept: application/json"' | jq '{count, contacts: [.contacts[] | {id, email}]}'
```

---

### Send Transactional Email

Write to `/tmp/brevo_request.json`:

```json
{
  "sender": { "name": "Acme App", "email": "noreply@acme.com" },
  "to": [{ "email": "user@example.com", "name": "Jane Doe" }],
  "subject": "Your password reset link",
  "htmlContent": "<html><body><p>Click <a href='{{params.resetLink}}'>here</a> to reset your password.</p></body></html>",
  "params": {
    "resetLink": "https://app.acme.com/reset?token=abc123"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.brevo.com/v3/smtp/email" --header "api-key: $BREVO_TOKEN" --header "Content-Type: application/json" --header "accept: application/json" -d @/tmp/brevo_request.json' | jq '{messageId}'
```

Docs: https://developers.brevo.com/reference/send-transac-email

---

### Send Transactional Email via Template

Replace `<template-id>` with the ID from your Brevo dashboard.

Write to `/tmp/brevo_request.json`:

```json
{
  "sender": { "name": "Acme App", "email": "noreply@acme.com" },
  "to": [{ "email": "user@example.com", "name": "Jane Doe" }],
  "templateId": "<template-id>",
  "params": {
    "firstName": "Jane",
    "planName": "Pro"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.brevo.com/v3/smtp/email" --header "api-key: $BREVO_TOKEN" --header "Content-Type: application/json" --header "accept: application/json" -d @/tmp/brevo_request.json' | jq '{messageId}'
```

---

### List Contact Lists

```bash
bash -c 'curl -s "https://api.brevo.com/v3/contacts/lists?limit=20" --header "api-key: $BREVO_TOKEN" --header "accept: application/json"' | jq '[.lists[] | {id, name, totalBlacklisted, totalSubscribers}]'
```

---

### Import Contacts (Bulk)

Import multiple contacts at once. Write to `/tmp/brevo_request.json`:

```json
{
  "updateEnabled": true,
  "jsonBody": [
    {
      "email": "alice@example.com",
      "attributes": { "FIRSTNAME": "Alice", "PLAN": "free" }
    },
    {
      "email": "bob@example.com",
      "attributes": { "FIRSTNAME": "Bob", "PLAN": "pro" }
    }
  ],
  "listIds": [1]
}
```

```bash
bash -c 'curl -s -X POST "https://api.brevo.com/v3/contacts/import" --header "api-key: $BREVO_TOKEN" --header "Content-Type: application/json" --header "accept: application/json" -d @/tmp/brevo_request.json' | jq '{createdLists, processId}'
```

---

## Guidelines

1. **Auth header**: Use `api-key: YOUR_KEY` — not `Authorization: Bearer`. This is different from most other APIs.
2. **Attribute names**: Contact attributes must be in UPPERCASE (e.g., `FIRSTNAME`, `LASTNAME`, `PLAN`). Create custom attributes in Brevo dashboard under **Contacts > Settings > Contact attributes** first.
3. **List IDs**: Get list IDs from the List Contacts endpoint or from the Brevo dashboard URL.
4. **updateEnabled**: Set to `true` when creating contacts to upsert (update if exists, create if not).
5. **Template IDs**: Find template IDs in Brevo under **Templates** in the URL path.
6. **Pricing model**: Brevo charges per email sent (not per contact), making it cost-effective for large contact lists with moderate send frequency.
