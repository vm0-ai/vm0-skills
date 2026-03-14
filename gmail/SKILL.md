---
name: gmail
description: Gmail API for email management. Use when user says "check email", "send
  email", "search Gmail", "my inbox", or mentions Gmail messages.
vm0_secrets:
  - GMAIL_TOKEN
---

# Gmail API

Read, send, and manage emails via Google's Gmail REST API.

> Official docs: https://developers.google.com/workspace/gmail/api/reference/rest

---

## When to Use

Use this skill when you need to:

- Read and search emails
- Send emails or reply to threads
- Manage drafts
- Create and manage labels
- List and modify threads
- Get user profile information

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings → Connectors** and connect **Gmail**. vm0 will automatically inject the required `GMAIL_TOKEN` environment variable.

---


> **Placeholders:** Values in `{curly-braces}` like `{message-id}` are placeholders. Replace them with actual values when executing.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/gmail-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $GMAIL_TOKEN" "$@"
EOF
chmod +x /tmp/gmail-curl
```

**Usage:** All examples below use `/tmp/gmail-curl` instead of direct `curl` calls.

## User Profile

### Get Profile

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/profile"
```

---

## Messages

### List Messages

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10"
```

### List Messages with Query

Search using Gmail query syntax:

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10"
```

Common queries:
- `is:unread` - Unread messages
- `from:example@gmail.com` - From specific sender
- `subject:hello` - Subject contains "hello"
- `after:2024/01/01` - After date
- `has:attachment` - Has attachments
- `label:INBOX` - In inbox

### Get Message

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}"
```

### Get Message (Metadata Only)

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date"
```

### Send Email

```bash
# Encode subject using RFC 2047 MIME encoding for non-ASCII characters
ENCODED_SUBJECT="=?UTF-8?B?$(printf '%s' "{subject}" | base64 -w 0)?="

# Create RFC 2822 message and base64url encode
RAW_MESSAGE=$(printf "To: {recipient-email}\r\nSubject: ${ENCODED_SUBJECT}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{body-text}" | base64 -w 0 | tr '+/' '-_' | tr -d '=')
```

Write to `/tmp/gmail_request.json`:

```json
{
  "raw": "$RAW_MESSAGE"
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" -d @/tmp/gmail_request.json
```

### Reply to Thread

```bash
# Encode subject using RFC 2047 MIME encoding for non-ASCII characters
ENCODED_SUBJECT="=?UTF-8?B?$(printf '%s' "Re: {original-subject}" | base64 -w 0)?="

# Include In-Reply-To and References headers for proper threading
RAW_MESSAGE=$(printf "To: {recipient-email}\r\nSubject: ${ENCODED_SUBJECT}\r\nIn-Reply-To: <{original-message-id}>\r\nReferences: <{original-message-id}>\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{reply-text}" | base64 -w 0 | tr '+/' '-_' | tr -d '=')
```

Write to `/tmp/gmail_request.json`:

```json
{
  "raw": "$RAW_MESSAGE",
  "threadId": "{thread-id}"
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" -d @/tmp/gmail_request.json
```

### Modify Message Labels

Write to `/tmp/gmail_request.json`:

```json
{
  "addLabelIds": ["STARRED"],
  "removeLabelIds": ["UNREAD"]
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/modify" -d @/tmp/gmail_request.json
```

### Trash Message

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/trash"
```

### Delete Message Permanently

```bash
/tmp/gmail-curl -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}"
```

---

## Threads

### List Threads

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=10"
```

### Get Thread

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread-id}"
```

### Trash Thread

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread-id}/trash"
```

---

## Labels

### List Labels

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/labels" | jq '.labels[] | {id, name, type}'
```

### Create Label

Write to `/tmp/gmail_request.json`:

```json
{
  "name": "{label-name}",
  "labelListVisibility": "labelShow",
  "messageListVisibility": "show"
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/labels" -d @/tmp/gmail_request.json
```

### Delete Label

```bash
/tmp/gmail-curl -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/labels/{label-id}"
```

---

## Drafts

### List Drafts

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/drafts"
```

### Create Draft

```bash
# Encode subject using RFC 2047 MIME encoding for non-ASCII characters
ENCODED_SUBJECT="=?UTF-8?B?$(printf '%s' "{subject}" | base64 -w 0)?="

RAW_MESSAGE=$(printf "To: {recipient-email}\r\nSubject: ${ENCODED_SUBJECT}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{body-text}" | base64 -w 0 | tr '+/' '-_' | tr -d '=')
```

Write to `/tmp/gmail_request.json`:

```json
{
  "message": {
    "raw": "$RAW_MESSAGE"
  }
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts" -d @/tmp/gmail_request.json
```

### Send Draft

Write to `/tmp/gmail_request.json`:

```json
{
  "id": "{draft-id}"
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts/send" -d @/tmp/gmail_request.json
```

### Delete Draft

```bash
/tmp/gmail-curl -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/drafts/{draft-id}"
```

---

## Attachments

### Get Attachment

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/attachments/{attachment-id}" | jq -r '.data' | base64 -d > attachment.bin
```

---

## Settings

### Get Vacation Settings

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation"
```

### Update Vacation Settings

Write to `/tmp/gmail_request.json`:

```json
{
  "enableAutoReply": true,
  "responseSubject": "Out of Office",
  "responseBodyPlainText": "I am currently out of office.",
  "restrictToContacts": false,
  "restrictToDomain": false
}
```

Then run:

```bash
/tmp/gmail-curl -X PUT "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation" -d @/tmp/gmail_request.json
```

### List Filters

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters"
```

### Create Filter

Write to `/tmp/gmail_request.json`:

```json
{
  "criteria": {
    "from": "{filter-email}"
  },
  "action": {
    "addLabelIds": ["TRASH"],
    "removeLabelIds": ["INBOX"]
  }
}
```

Then run:

```bash
/tmp/gmail-curl -X POST "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters" -d @/tmp/gmail_request.json
```

---

## Common Scopes

| Scope | Permission |
|-------|------------|
| `gmail.readonly` | Read-only access |
| `gmail.send` | Send emails only |
| `gmail.compose` | Create drafts and send |
| `gmail.modify` | Read, send, delete, manage |
| `gmail.labels` | Manage labels only |
| `gmail.settings.basic` | Manage basic settings |
| `gmail.settings.sharing` | Manage sensitive settings |

Use full URL: `https://www.googleapis.com/auth/gmail.modify`

---

## Decode Message Body

Gmail returns message body as base64url encoded. To decode:

```bash
/tmp/gmail-curl "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}" | jq -r '.payload.body.data // .payload.parts[0].body.data' | tr '_-' '/+' | base64 -d
```

---

## Guidelines

1. **Rate Limits**: Gmail API has quota limits; implement exponential backoff
2. **Batch Requests**: Use batch endpoints for multiple operations
3. **Message Format**: Messages must be RFC 2822 compliant and base64url encoded

---

## API Reference

- REST Reference: https://developers.google.com/workspace/gmail/api/reference/rest
- Guides: https://developers.google.com/workspace/gmail/api/guides
- OAuth Playground: https://developers.google.com/oauthplayground/
- Scopes: https://developers.google.com/identity/protocols/oauth2/scopes#gmail
