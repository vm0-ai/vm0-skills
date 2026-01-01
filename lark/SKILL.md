---
name: lark
description: Lark/Feishu API integration for messaging, group management, contacts, and calendar. Use this skill to send messages, manage chats, query contacts, and sync calendar events with Lark/Feishu.
vm0_secrets:
  - LARK_APP_SECRET
vm0_vars:
  - LARK_APP_ID
---

# Lark (Feishu) API

Complete Lark/Feishu integration for enterprise collaboration, including messaging, group management, contacts, and calendar.

## When to Use

- Send automated notifications to users or groups
- Build interactive bot workflows
- Manage group chats and members
- Query contacts and organization structure
- Sync calendar events and schedules
- Integrate Lark with other systems

## Prerequisites

Set the following environment variables:

```bash
export LARK_APP_ID=cli_xxxxx
export LARK_APP_SECRET=xxxxx
```

Get your credentials from: https://open.larkoffice.com/

### Required Permissions

Enable these API scopes in your Lark app:
- `im:message` - Send and read messages
- `im:chat` - Manage group chats
- `contact:user.base:readonly` - Read contacts
- `calendar:calendar` - Manage calendars

## How to Use

### Commands

The script supports 6 modules: `auth`, `message`, `chat`, `contact`, `calendar`, `bot`

---

### 1. Auth - Get Access Token

Obtain and cache tenant access token.

```bash
scripts/lark.sh auth
```

Token is cached to `/tmp/lark/token.json` and reused until expiration.

---

### 2. Message - Send and Manage Messages

#### Send Text Message

```bash
scripts/lark.sh message send --to "ou_xxx" --type "open_id" --text "Hello World"
scripts/lark.sh message send --to "oc_xxx" --type "chat_id" --text "Group message"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| --to | Yes | - | Recipient ID (user or chat) |
| --type | No | open_id | ID type: open_id, user_id, union_id, email, chat_id |
| --text | Yes* | - | Text message content |

#### Send Rich Text (Post)

Write to `/tmp/post.json`:

```json
{
  "zh_cn": {
    "title": "Title",
    "content": [[{"tag": "text", "text": "Content"}]]
  }
}
```

```bash
scripts/lark.sh message send --to "ou_xxx" --type "open_id" --post "$(bash -c 'cat /tmp/post.json')"
```

#### Send Card Message

Write to `/tmp/card.json`:

```json
{
  "header": {"title": {"tag": "plain_text", "content": "Alert"}},
  "elements": [{"tag": "div", "text": {"tag": "plain_text", "content": "Message"}}]
}
```

```bash
scripts/lark.sh message send --to "oc_xxx" --type "chat_id" --card "$(bash -c 'cat /tmp/card.json')"
```

#### Reply to Message

```bash
scripts/lark.sh message reply --message-id "om_xxx" --text "Reply content"
```

#### Get Chat History

```bash
scripts/lark.sh message list --chat-id "oc_xxx" --limit 20
```

---

### 3. Chat - Group Management

#### Create Group

```bash
scripts/lark.sh chat create --name "Project Team" --members "ou_xxx,ou_yyy"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| --name | Yes | - | Group name |
| --members | No | - | Comma-separated member IDs |
| --description | No | - | Group description |

#### List Groups

```bash
scripts/lark.sh chat list
```

#### Get Group Info

```bash
scripts/lark.sh chat info --chat-id "oc_xxx"
```

#### Add Members

```bash
scripts/lark.sh chat add-member --chat-id "oc_xxx" --members "ou_xxx,ou_yyy"
```

#### Remove Members

```bash
scripts/lark.sh chat remove-member --chat-id "oc_xxx" --members "ou_xxx"
```

---

### 4. Contact - Directory Queries

#### Get User Info

```bash
scripts/lark.sh contact user --user-id "ou_xxx" --type "open_id"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| --user-id | Yes | - | User ID |
| --type | No | open_id | ID type: open_id, user_id, union_id |

#### Search Users

```bash
scripts/lark.sh contact search --query "John"
```

#### List Departments

```bash
scripts/lark.sh contact departments --parent-id "0"
```

#### Get Department Members

```bash
scripts/lark.sh contact members --department-id "xxx"
```

---

### 5. Calendar - Schedule Management

#### List Calendars

```bash
scripts/lark.sh calendar list
```

#### Create Event

```bash
scripts/lark.sh calendar create-event --calendar-id "xxx" --summary "Team Meeting" --start "2025-01-15T10:00:00+08:00" --end "2025-01-15T11:00:00+08:00" --description "Weekly sync"
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| --calendar-id | Yes | - | Calendar ID |
| --summary | Yes | - | Event title |
| --start | Yes | - | Start time (ISO 8601) |
| --end | Yes | - | End time (ISO 8601) |
| --description | No | - | Event description |

#### List Events

```bash
scripts/lark.sh calendar events --calendar-id "xxx" --start "2025-01-01T00:00:00+08:00" --end "2025-01-31T23:59:59+08:00"
```

---

### 6. Bot - Bot Information

```bash
scripts/lark.sh bot info
```

Returns bot name, open_id, and capabilities.

---

## Message Types

| Type | Parameter | Example |
|------|-----------|---------|
| Text | --text | `--text "Hello"` |
| Rich Text | --post | `--post '{"zh_cn":{"title":"..."}}'` |
| Image | --image | `--image "img_xxx"` |
| Card | --card | `--card '{"header":...}'` |

## Examples

### Send Alert to Group

Write to `/tmp/alert.json`:

```json
{
  "header": {
    "title": {"tag": "plain_text", "content": "System Alert"},
    "template": "red"
  },
  "elements": [{
    "tag": "div",
    "text": {"tag": "lark_md", "content": "**Error:** Service down"}
  }]
}
```

```bash
scripts/lark.sh message send --to "oc_xxx" --type "chat_id" --card "$(bash -c 'cat /tmp/alert.json')"
```

### Create Team Group with Members

```bash
scripts/lark.sh chat create --name "Q1 Project" --members "ou_abc,ou_def,ou_ghi" --description "Q1 project discussion"
```

### Query Organization Structure

```bash
# Get root departments
scripts/lark.sh contact departments --parent-id "0"

# Get members in a department
scripts/lark.sh contact members --department-id "od_xxx"
```

### Schedule a Meeting

```bash
scripts/lark.sh calendar create-event --calendar-id "primary" --summary "Sprint Planning" --start "2025-01-20T09:00:00+08:00" --end "2025-01-20T10:30:00+08:00" --description "Sprint 5 planning session"
```

## Guidelines

1. **Token Caching**: Tokens are cached for 2 hours. Run `auth` to refresh if expired.
2. **Rate Limits**: Lark has rate limits. Add delays for bulk operations.
3. **ID Types**: Use correct ID type (open_id for most cases, chat_id for groups).
4. **Card Builder**: Use Lark Card Builder for complex cards: https://open.larkoffice.com/tool/cardbuilder
5. **Error Codes**: Check response code field. 0 means success.

## API Reference

- Documentation: https://open.larkoffice.com/document/home/index
- API Explorer: https://open.larkoffice.com/api-explorer
- Card Builder: https://open.larkoffice.com/tool/cardbuilder
