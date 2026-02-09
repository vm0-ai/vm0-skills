---
name: agentmail
description: AgentMail API via curl. Use this skill to create email inboxes for AI agents, send/receive/reply to emails, manage threads, drafts, webhooks, domains, and pods.
vm0_secrets:
  - AGENTMAIL_API_KEY
---

# AgentMail API

Create and manage email inboxes for AI agents. Send, receive, and reply to emails in threads via AgentMail's REST API.

> Official docs: https://docs.agentmail.to

---

## When to Use

Use this skill when you need to:

- Create email inboxes for AI agents on the fly
- Send emails and reply to conversation threads
- Manage drafts with scheduled sending
- Set up webhooks for real-time email event notifications
- Register and verify custom sending domains
- Organize inboxes with pods
- Track email delivery metrics

---

## Prerequisites

1. Sign up at https://console.agentmail.to
2. Go to API Keys section and create a new key

Set environment variable:

```bash
export AGENTMAIL_API_KEY="your-api-key"
```

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `{curly-braces}` like `{inbox-id}` are placeholders. Replace them with actual values when executing.

---

## Inboxes

### Create Inbox

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"username": "my-agent", "display_name": "My Agent"}'"'"'' | jq .
```

Create with idempotent `client_id` (safe to retry without creating duplicates):

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"username": "my-agent", "display_name": "My Agent", "client_id": "my-agent-inbox"}'"'"'' | jq .
```

### List Inboxes

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

With pagination:

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes?limit=10" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Inbox

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Update Inbox

```bash
bash -c 'curl -s -X PATCH "https://api.agentmail.to/v0/inboxes/{inbox-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"display_name": "New Name"}'"'"'' | jq .
```

### Delete Inbox

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/inboxes/{inbox-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Messages

### Send Email

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "subject": "Hello from my agent",
  "text": "Plain text body",
  "html": "<p>HTML body</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/send" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Send Email with CC/BCC

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/send" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Send Email with Labels

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "subject": "Hello",
  "text": "Plain text body",
  "labels": ["outreach", "onboarding"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/send" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Send Email with Attachment

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "subject": "Report attached",
  "text": "Please find the report attached.",
  "attachments": [
    {
      "filename": "report.txt",
      "content_type": "text/plain",
      "content": "<base64-encoded-content>"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/send" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

To base64 encode a file:

```bash
base64 -w 0 /path/to/file.pdf
```

### Reply to Message

Write to `/tmp/agentmail_request.json`:

```json
{
  "text": "Thanks for your message!",
  "html": "<p>Thanks for your message!</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/{message-id}/reply" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Reply All

Write to `/tmp/agentmail_request.json`:

```json
{
  "reply_all": true,
  "text": "Thanks everyone!",
  "html": "<p>Thanks everyone!</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/{message-id}/reply" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### List Messages

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

With filters:

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages?labels=unreplied&limit=10" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Message

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/{message-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Update Message Labels

Write to `/tmp/agentmail_request.json`:

```json
{
  "add_labels": ["replied"],
  "remove_labels": ["unreplied"]
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/{message-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Get Message Attachment

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/messages/{message-id}/attachments/{attachment-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

Returns a `download_url` (temporary pre-signed URL) and `expires_at`. Download the file:

```bash
curl -s -o attachment.bin "{download-url}"
```

---

## Threads

### List Threads

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/threads" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

With filters:

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/threads?labels=unreplied&after=2025-01-01T00:00:00Z&limit=10" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Thread

Returns thread with all messages ordered by timestamp ascending:

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/threads/{thread-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Thread Attachment

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/threads/{thread-id}/attachments/{attachment-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Delete Thread

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/inboxes/{inbox-id}/threads/{thread-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Drafts

### Create Draft

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "subject": "Draft email",
  "text": "This is a draft.",
  "html": "<p>This is a draft.</p>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Create Scheduled Draft

Write to `/tmp/agentmail_request.json`:

```json
{
  "to": ["recipient@example.com"],
  "subject": "Scheduled email",
  "text": "This will be sent later.",
  "send_at": "2025-12-01T10:00:00Z"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### List Drafts

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Draft

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts/{draft-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Update Draft

Write to `/tmp/agentmail_request.json`:

```json
{
  "subject": "Updated subject",
  "text": "Updated body"
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts/{draft-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Send Draft

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts/{draft-id}/send" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{}'"'"'' | jq .
```

### Delete Draft

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/inboxes/{inbox-id}/drafts/{draft-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Webhooks

### Create Webhook

Write to `/tmp/agentmail_request.json`:

```json
{
  "url": "https://your-server.com/webhooks",
  "event_types": ["message.received", "message.sent", "message.delivered"],
  "client_id": "my-webhook"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/webhooks" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

Supported event types: `message.received`, `message.sent`, `message.delivered`, `message.bounced`, `message.complained`, `message.rejected`, `domain.verified`

### Create Webhook for Specific Inboxes

Write to `/tmp/agentmail_request.json`:

```json
{
  "url": "https://your-server.com/webhooks",
  "event_types": ["message.received"],
  "inbox_ids": ["{inbox-id-1}", "{inbox-id-2}"],
  "client_id": "inbox-webhook"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/webhooks" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### List Webhooks

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/webhooks" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Webhook

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/webhooks/{webhook-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Update Webhook (Add/Remove Inboxes)

Write to `/tmp/agentmail_request.json`:

```json
{
  "add_inbox_ids": ["{new-inbox-id}"],
  "remove_inbox_ids": ["{old-inbox-id}"]
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.agentmail.to/v0/webhooks/{webhook-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d @/tmp/agentmail_request.json' | jq .
```

### Delete Webhook

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/webhooks/{webhook-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Domains

### Create Domain

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/domains" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"domain": "yourdomain.com", "feedback_enabled": true}'"'"'' | jq .
```

Returns DNS records (TXT, CNAME, MX) that must be added to your DNS provider.

### List Domains

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/domains" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Domain

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/domains/{domain-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Verify Domain

Trigger DNS verification after adding records:

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/domains/{domain-id}/verify" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

Domain status values: `NOT_STARTED`, `PENDING`, `INVALID`, `FAILED`, `VERIFYING`, `VERIFIED`

### Delete Domain

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/domains/{domain-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Pods

Pods are organizational groups for inboxes.

### Create Pod

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/pods" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"name": "Support Team", "client_id": "support-pod"}'"'"'' | jq .
```

### List Pods

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/pods" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Get Pod

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/pods/{pod-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Delete Pod

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/pods/{pod-id}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Metrics

### Get Delivery Metrics

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/metrics?start_timestamp=2025-01-01T00:00:00Z&end_timestamp=2025-12-31T23:59:59Z" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

Filter by event type:

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/metrics?start_timestamp=2025-01-01T00:00:00Z&end_timestamp=2025-12-31T23:59:59Z&event_types=message.sent&event_types=message.bounced" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

Supported event types: `message.sent`, `message.delivered`, `message.bounced`, `message.delayed`, `message.rejected`, `message.complained`, `message.received`

---

## API Keys

### List API Keys

```bash
bash -c 'curl -s "https://api.agentmail.to/v0/api-keys" --header "Authorization: Bearer $AGENTMAIL_API_KEY"' | jq .
```

### Create API Key

```bash
bash -c 'curl -s -X POST "https://api.agentmail.to/v0/api-keys" --header "Authorization: Bearer $AGENTMAIL_API_KEY" --header "Content-Type: application/json" -d '"'"'{"name": "production-key"}'"'"'' | jq .
```

The `api_key` value is only returned once at creation time. Save it immediately.

### Delete API Key

```bash
bash -c 'curl -s -X DELETE "https://api.agentmail.to/v0/api-keys/{api-key}" --header "Authorization: Bearer $AGENTMAIL_API_KEY"'
```

---

## Webhook Event Payload

When a webhook fires, AgentMail sends a POST request with this JSON payload:

```json
{
  "type": "event",
  "event_type": "message.received",
  "event_id": "unique-event-id",
  "message": {
    "inbox_id": "...",
    "thread_id": "...",
    "message_id": "...",
    "from": "sender@example.com",
    "to": ["your-inbox@agentmail.to"],
    "subject": "Hello",
    "text": "Message body",
    "html": "<p>Message body</p>",
    "attachments": []
  },
  "thread": {
    "thread_id": "...",
    "subject": "Hello",
    "message_count": 1
  }
}
```

Your endpoint should return HTTP 200 immediately and process the payload asynchronously.

---

## Send Parameters Reference

| Parameter | Type | Description |
|-----------|------|-------------|
| `to` | string[] | Recipients |
| `cc` | string[] | CC recipients |
| `bcc` | string[] | BCC recipients |
| `reply_to` | string[] | Reply-to addresses |
| `subject` | string | Email subject |
| `text` | string | Plain text body |
| `html` | string | HTML body |
| `labels` | string[] | Custom labels |
| `attachments` | object[] | Attachments (with `filename`, `content_type`, `content` as base64 or `url`) |
| `headers` | object | Custom email headers |

---

## Response Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `400` | Invalid parameters |
| `403` | Forbidden (sending not allowed) |
| `404` | Resource not found |

---

## Guidelines

1. **Always send both text and HTML**: Provide both formats for best deliverability across email clients
2. **Use client_id for idempotency**: When creating inboxes, webhooks, or drafts, use `client_id` to prevent duplicates on retries
3. **Use labels for state tracking**: Tag messages as `unreplied`/`replied` to manage conversation state
4. **Use webhooks over polling**: Webhooks are the recommended way to handle incoming emails in production
5. **Custom domains improve deliverability**: Set up verified custom domains for production use
6. **Default domain**: Without a custom domain, inboxes use `@agentmail.to`
7. **Webhook response**: Return HTTP 200 immediately from webhook endpoints; process payloads asynchronously

---

## API Reference

- Documentation: https://docs.agentmail.to
- API Reference: https://docs.agentmail.to/api-reference/inboxes/list
- Console: https://console.agentmail.to
- Quickstart: https://docs.agentmail.to/quickstart
- Node.js SDK: https://www.npmjs.com/package/agentmail
- Python SDK: `pip install agentmail`
