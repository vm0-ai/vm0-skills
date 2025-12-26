---
name: gmail
description: Gmail API via curl. Use this skill to read, send, and manage emails, labels, drafts, and threads.
vm0_env:
  - GMAIL_CLIENT_ID
  - GMAIL_CLIENT_SECRET
  - GMAIL_REFRESH_TOKEN
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

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Gmail API: https://console.cloud.google.com/apis/library/gmail.googleapis.com

### 2. Configure OAuth Consent Screen

1. Go to https://console.cloud.google.com/auth/branding
2. Set User Type to "External" (or "Internal" for Workspace)
3. Add your email as test user

### 3. Create OAuth Client ID

1. Go to https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Desktop app"
4. Download or note the Client ID and Client Secret

### 4. Get Refresh Token

**Option A: OAuth Playground (Recommended for testing)**

1. Go to https://developers.google.com/oauthplayground/
2. Click Settings (gear icon) > Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. Select scopes (e.g., `https://www.googleapis.com/auth/gmail.modify`)
5. Click "Authorize APIs" and sign in
6. Click "Exchange authorization code for tokens"
7. Copy the `refresh_token`

**Option B: Manual Flow**

```bash
# Generate auth URL and open in browser
CLIENT_ID="your-client-id"
REDIRECT_URI="urn:ietf:wg:oauth:2.0:oob"
SCOPE="https://www.googleapis.com/auth/gmail.modify"

echo "https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent"

# After authorization, exchange code for tokens
AUTH_CODE="code-from-browser"
CLIENT_SECRET="your-client-secret"

curl -s -X POST "https://oauth2.googleapis.com/token" -d "client_id=${CLIENT_ID}" -d "client_secret=${CLIENT_SECRET}" -d "code=${AUTH_CODE}" -d "grant_type=authorization_code" -d "redirect_uri=${REDIRECT_URI}" | jq .
```

### 5. Set Environment Variables

```bash
export GMAIL_CLIENT_ID="your-client-id"
export GMAIL_CLIENT_SECRET="your-client-secret"
export GMAIL_REFRESH_TOKEN="your-refresh-token"
```

---

## Get Access Token

Access tokens expire after 1 hour. Use refresh token to get a new one and save to `/tmp`:

```bash
bash -c 'curl -s -X POST "https://oauth2.googleapis.com/token" -d "client_id=$GMAIL_CLIENT_ID" -d "client_secret=$GMAIL_CLIENT_SECRET" -d "refresh_token=$GMAIL_REFRESH_TOKEN" -d "grant_type=refresh_token"' | jq -r '.access_token' > /tmp/gmail_token.txt

# Verify token was obtained
head -c 20 /tmp/gmail_token.txt && echo "..."
```

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

---

## User Profile

### Get Profile

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/profile" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

---

## Messages

### List Messages

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### List Messages with Query

Search using Gmail query syntax:

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
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
export MESSAGE_ID="message-id-here"
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Get Message (Metadata Only)

```bash
export MESSAGE_ID="message-id-here"
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Send Email

```bash
# Create RFC 2822 message and base64url encode
export RAW_MESSAGE=$(echo -e "To: recipient@example.com\r\nSubject: Test Email\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nHello, this is a test email." | base64 | tr '+/' '-_' | tr -d '=')

bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d "{\"raw\": \"$RAW_MESSAGE\"}"' | jq .
```

### Send Email with Helper Function

```bash
gmail_send() {
  export RAW_MESSAGE=$(echo -e "To: $1\r\nSubject: $2\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n$3" | base64 | tr '+/' '-_' | tr -d '=')
  bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d "{\"raw\": \"$RAW_MESSAGE\"}"'
}

gmail_send "recipient@example.com" "Test Subject" "Hello World!"
```

### Reply to Thread

```bash
export THREAD_ID="thread-id-here"
REPLY_TO_ID="message-id-to-reply"

# Include In-Reply-To and References headers for proper threading
export RAW_MESSAGE=$(echo -e "To: recipient@example.com\r\nSubject: Re: Original Subject\r\nIn-Reply-To: <${REPLY_TO_ID}>\r\nReferences: <${REPLY_TO_ID}>\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nThis is a reply." | base64 | tr '+/' '-_' | tr -d '=')

bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d "{\"raw\": \"$RAW_MESSAGE\", \"threadId\": \"$THREAD_ID\"}"' | jq .
```

### Modify Message Labels

```bash
export MESSAGE_ID="message-id-here"
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID/modify" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d '"'"'{"addLabelIds": ["STARRED"], "removeLabelIds": ["UNREAD"]}'"'"'' | jq .
```

### Trash Message

```bash
export MESSAGE_ID="message-id-here"
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID/trash" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Delete Message Permanently

```bash
export MESSAGE_ID="message-id-here"
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"'
```

---

## Threads

### List Threads

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=10" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Get Thread

```bash
export THREAD_ID="thread-id-here"
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/threads/$THREAD_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Trash Thread

```bash
export THREAD_ID="thread-id-here"
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/threads/$THREAD_ID/trash" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

---

## Labels

### List Labels

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/labels" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq '.labels[] | {id, name, type}'
```

### Create Label

```bash
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/labels" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d '"'"'{"name": "My Custom Label", "labelListVisibility": "labelShow", "messageListVisibility": "show"}'"'"'' | jq .
```

### Delete Label

```bash
export LABEL_ID="Label_xxx"
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/labels/$LABEL_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"'
```

---

## Drafts

### List Drafts

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/drafts" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Create Draft

```bash
export MESSAGE=$(echo -e "To: recipient@example.com\r\nSubject: Draft Email\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nThis is a draft." | base64 | tr '+/' '-_' | tr -d '=')

bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d "{\"message\": {\"raw\": \"$MESSAGE\"}}"' | jq .
```

### Send Draft

```bash
export DRAFT_ID="draft-id-here"
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts/send" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d "{\"id\": \"$DRAFT_ID\"}"' | jq .
```

### Delete Draft

```bash
export DRAFT_ID="draft-id-here"
bash -c 'curl -s -X DELETE "https://gmail.googleapis.com/gmail/v1/users/me/drafts/$DRAFT_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"'
```

---

## Attachments

### Get Attachment

```bash
export MESSAGE_ID="message-id-here"
export ATTACHMENT_ID="attachment-id-here"
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID/attachments/$ATTACHMENT_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq -r '.data' | base64 -d > attachment.bin
```

---

## Settings

### Get Vacation Settings

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Update Vacation Settings

```bash
bash -c 'curl -s -X PUT "https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d '"'"'{"enableAutoReply": true, "responseSubject": "Out of Office", "responseBodyPlainText": "I am currently out of office.", "restrictToContacts": false, "restrictToDomain": false}'"'"'' | jq .
```

### List Filters

```bash
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq .
```

### Create Filter

```bash
bash -c 'curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/settings/filters" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)" --header "Content-Type: application/json" -d '"'"'{"criteria": {"from": "newsletter@example.com"}, "action": {"addLabelIds": ["TRASH"], "removeLabelIds": ["INBOX"]}}'"'"'' | jq .
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
export MESSAGE_ID="message-id-here"
bash -c 'curl -s "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID" --header "Authorization: Bearer $(cat /tmp/gmail_token.txt)"' | jq -r '.payload.body.data // .payload.parts[0].body.data' | tr '_-' '/+' | base64 -d
```

---

## Guidelines

1. **Token Refresh**: Access tokens expire in 1 hour; always refresh before API calls
2. **Rate Limits**: Gmail API has quota limits; implement exponential backoff
3. **Batch Requests**: Use batch endpoints for multiple operations
4. **Message Format**: Messages must be RFC 2822 compliant and base64url encoded
5. **Scopes**: Request minimum required scopes for your use case

---

## API Reference

- REST Reference: https://developers.google.com/workspace/gmail/api/reference/rest
- Guides: https://developers.google.com/workspace/gmail/api/guides
- OAuth Playground: https://developers.google.com/oauthplayground/
- Scopes: https://developers.google.com/identity/protocols/oauth2/scopes#gmail
