---
name: gmail
description: Gmail API via curl. Use this skill to read, send, and manage emails, labels, drafts, and threads.
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

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `{curly-braces}` like `{message-id}` are placeholders. Replace them with actual values when executing.

---

## User Profile

### Get Profile

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/profile" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

---

## Messages

### List Messages

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### List Messages with Query

Search using Gmail query syntax:

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10" --header "Authorization: Bearer $GMAIL_TOKEN"'
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
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Get Message (Metadata Only)

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Send Email

```bash
# Create RFC 2822 message and base64url encode
RAW_MESSAGE=$(echo -e "To: {recipient-email}\r\nSubject: {subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{body-text}" | base64 | tr '+/' '-_' | tr -d '=')
```

Write to `/tmp/gmail_request.json`:

```json
{
  "raw": "$RAW_MESSAGE"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
```

### Reply to Thread

```bash
# Include In-Reply-To and References headers for proper threading
RAW_MESSAGE=$(echo -e "To: {recipient-email}\r\nSubject: Re: {original-subject}\r\nIn-Reply-To: <{original-message-id}>\r\nReferences: <{original-message-id}>\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{reply-text}" | base64 | tr '+/' '-_' | tr -d '=')
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/modify" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
```

### Trash Message

```bash
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/trash" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Delete Message Permanently

```bash
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

---

## Threads

### List Threads

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=10" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Get Thread

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread-id}" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Trash Thread

```bash
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread-id}/trash" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

---

## Labels

### List Labels

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/labels" --header "Authorization: Bearer $GMAIL_TOKEN"' | jq '.labels[] | {id, name, type}'
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/labels" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
```

### Delete Label

```bash
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/labels/{label-id}" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

---

## Drafts

### List Drafts

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/drafts" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

### Create Draft

```bash
RAW_MESSAGE=$(echo -e "To: {recipient-email}\r\nSubject: {subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n{body-text}" | base64 | tr '+/' '-_' | tr -d '=')
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts/send" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
```

### Delete Draft

```bash
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/drafts/{draft-id}" --header "Authorization: Bearer $GMAIL_TOKEN"'
```

---

## Attachments

### Get Attachment

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}/attachments/{attachment-id}" --header "Authorization: Bearer $GMAIL_TOKEN"' | jq -r '.data' | base64 -d > attachment.bin
```

---

## Settings

### Get Vacation Settings

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation" --header "Authorization: Bearer $GMAIL_TOKEN"'
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
bash -c 'curl -s -X PUT "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
```

### List Filters

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters" --header "Authorization: Bearer $GMAIL_TOKEN"'
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
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters" --header "Authorization: Bearer $GMAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/gmail_request.json'
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
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/{message-id}" --header "Authorization: Bearer $GMAIL_TOKEN"' | jq -r '.payload.body.data // .payload.parts[0].body.data' | tr '_-' '/+' | base64 -d
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
