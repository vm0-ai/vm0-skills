---
name: loops
description: Loops email platform for SaaS. Use when user mentions "Loops", "Loops.so", "email marketing", "onboarding emails", "transactional email", or asks about SaaS lifecycle emails.
vm0_secrets:
  - LOOPS_TOKEN
---

# Loops API

Send onboarding, marketing, and transactional emails to SaaS users via Loops.

> Official docs: `https://loops.so/docs/api-reference`

## When to Use

- Add or update contacts synced from Clerk or another auth provider
- Trigger automated email sequences via events (e.g., user signed up, upgraded plan)
- Send one-off transactional emails (password reset, invoice, etc.)
- List or manage mailing lists and contact properties

## Prerequisites


Alternatively, generate an API key from your Loops dashboard under **Settings > API**, then export it:

```bash
export LOOPS_TOKEN=your_api_key_here
```

> **Important:** When using `$LOOPS_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Test API Key

Verify your API key is valid:

```bash
bash -c 'curl -s "https://app.loops.so/api/v1/api-key" --header "Authorization: Bearer $LOOPS_TOKEN"'
```

---

### Create Contact

Write to `/tmp/loops_request.json`:

```json
{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "userId": "clerk_user_abc123",
  "subscribed": true,
  "userGroup": "free"
}
```

```bash
bash -c 'curl -s -X POST "https://app.loops.so/api/v1/contacts/create" --header "Authorization: Bearer $LOOPS_TOKEN" --header "Content-Type: application/json" -d @/tmp/loops_request.json'
```

Docs: https://loops.so/docs/api-reference/create-contact

---

### Update Contact

Write to `/tmp/loops_request.json`:

```json
{
  "email": "user@example.com",
  "userGroup": "pro",
  "planUpgradedAt": "2024-01-15"
}
```

```bash
bash -c 'curl -s -X PUT "https://app.loops.so/api/v1/contacts/update" --header "Authorization: Bearer $LOOPS_TOKEN" --header "Content-Type: application/json" -d @/tmp/loops_request.json'
```

---

### Find Contact

Find a contact by email address. Replace `<email>` with the actual email:

```bash
bash -c 'curl -s "https://app.loops.so/api/v1/contacts/find?email=<email>" --header "Authorization: Bearer $LOOPS_TOKEN"'
```

---

### Delete Contact

Write to `/tmp/loops_request.json`:

```json
{
  "email": "user@example.com"
}
```

```bash
bash -c 'curl -s -X DELETE "https://app.loops.so/api/v1/contacts/delete" --header "Authorization: Bearer $LOOPS_TOKEN" --header "Content-Type: application/json" -d @/tmp/loops_request.json'
```

---

### Send Event

Trigger an automated email loop by sending an event. Events map to loops configured in your Loops dashboard.

Write to `/tmp/loops_request.json`:

```json
{
  "email": "user@example.com",
  "eventName": "signup",
  "eventProperties": {
    "planType": "free",
    "signupSource": "landing_page"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://app.loops.so/api/v1/events/send" --header "Authorization: Bearer $LOOPS_TOKEN" --header "Content-Type: application/json" -d @/tmp/loops_request.json'
```

Docs: https://loops.so/docs/api-reference/send-event

---

### Send Transactional Email

Send a one-off email using a transactional template. Replace `<transactional-id>` with the ID from your Loops dashboard.

Write to `/tmp/loops_request.json`:

```json
{
  "transactionalId": "<transactional-id>",
  "email": "user@example.com",
  "dataVariables": {
    "firstName": "Jane",
    "resetLink": "https://app.example.com/reset?token=abc123"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://app.loops.so/api/v1/transactional" --header "Authorization: Bearer $LOOPS_TOKEN" --header "Content-Type: application/json" -d @/tmp/loops_request.json'
```

Docs: https://loops.so/docs/api-reference/send-transactional-email

---

### List Transactional Emails

```bash
bash -c 'curl -s "https://app.loops.so/api/v1/transactional" --header "Authorization: Bearer $LOOPS_TOKEN"' | jq '[.[] | {id, name}]'
```

---

### List Mailing Lists

```bash
bash -c 'curl -s "https://app.loops.so/api/v1/lists" --header "Authorization: Bearer $LOOPS_TOKEN"' | jq '[.[] | {id, name}]'
```

---

### List Contact Properties

```bash
bash -c 'curl -s "https://app.loops.so/api/v1/contacts/customFields" --header "Authorization: Bearer $LOOPS_TOKEN"' | jq '[.[] | {key, label, type}]'
```

---

## Guidelines

1. **Contact identity**: Use `email` as the primary identifier. Optionally pass `userId` (e.g., Clerk user ID) to link contacts across systems.
2. **Event names**: Must exactly match the event name configured in your Loops dashboard loop trigger.
3. **Transactional IDs**: Find the `transactionalId` in Loops under **Transactional > [template] > API**.
4. **Rate limit**: 10 requests per second per team. Implement exponential backoff on HTTP 429.
5. **Field length**: Maximum 500 characters per field value.
6. **No CORS**: All requests must be server-side — never expose the API key to the browser.
