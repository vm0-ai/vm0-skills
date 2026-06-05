---
name: lark
description: Lark API for collaboration. Use when user mentions "Lark", "Lark docs", or asks about ByteDance workspace tools.
---

## Troubleshooting

If Lark requests fail after the Lark connector is connected, check the runtime token and API access:

```bash
zero doctor check-connector --env-name LARK_TOKEN
zero doctor check-connector --url https://open.larksuite.com/open-apis/bot/v3/info --method GET
```

`LARK_TOKEN` is the Lark API bearer token available after the Lark connector is connected; do not use it as an app secret.

## Authentication Helper

Use this helper in shell examples to read the bearer token and fail clearly when it is missing from the runtime:

```bash
get_lark_token() {
  if [ -z "${LARK_TOKEN:-}" ]; then
    echo "Error: LARK_TOKEN is not set. Connect the Lark connector, then run zero doctor check-connector --env-name LARK_TOKEN." >&2
    return 1
  fi
  printf '%s\n' "$LARK_TOKEN"
}

# Usage in commands
TOKEN=$(get_lark_token)
```

## Examples

### 1. Authentication - Verify Token

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/bot/v3/info" \
  -H "Authorization: Bearer ${TOKEN}"
```

### 2. Messaging - Send Messages

#### Send Text Message to User

Write to `/tmp/lark_request.json`:
```json
{
  "receive_id": "ou_xxx",
  "msg_type": "text",
  "content": "{\"text\": \"Hello World\"}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Send Text Message to Group Chat

Write to `/tmp/lark_request.json`:
```json
{
  "receive_id": "oc_xxx",
  "msg_type": "text",
  "content": "{\"text\": \"Group message\"}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=chat_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Send Rich Text (Post) Message

Write to `/tmp/lark_request.json`:
```json
{
  "receive_id": "ou_xxx",
  "msg_type": "post",
  "content": "{\"zh_cn\": {\"title\": \"Title\", \"content\": [[{\"tag\": \"text\", \"text\": \"Content\"}]]}}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Send Interactive Card Message

Write to `/tmp/lark_request.json`:
```json
{
  "receive_id": "oc_xxx",
  "msg_type": "interactive",
  "content": "{\"header\": {\"title\": {\"tag\": \"plain_text\", \"content\": \"Alert\"}}, \"elements\": [{\"tag\": \"div\", \"text\": {\"tag\": \"plain_text\", \"content\": \"Message\"}}]}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=chat_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Reply to Message

Write to `/tmp/lark_request.json`:
```json
{
  "msg_type": "text",
  "content": "{\"text\": \"Reply content\"}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages/om_xxx/reply" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Get Chat History

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/im/v1/messages?container_id_type=chat&container_id=oc_xxx&page_size=20" \
  -H "Authorization: Bearer ${TOKEN}"
```

### 3. Chat Management - Group Operations

#### Create Group Chat

Write to `/tmp/lark_request.json`:
```json
{
  "name": "Project Team",
  "description": "Project discussion group",
  "user_id_list": ["ou_xxx", "ou_yyy"]
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/chats?user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### List All Chats

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/im/v1/chats" \
  -H "Authorization: Bearer ${TOKEN}"
```

#### Get Chat Info

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/im/v1/chats/oc_xxx" \
  -H "Authorization: Bearer ${TOKEN}"
```

#### Add Members to Chat

Write to `/tmp/lark_request.json`:
```json
{
  "id_list": ["ou_xxx", "ou_yyy"]
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/chats/oc_xxx/members?member_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Remove Members from Chat

Write to `/tmp/lark_request.json`:
```json
{
  "id_list": ["ou_xxx"]
}
```

```bash
TOKEN=$(get_lark_token)
curl -X DELETE "https://open.larksuite.com/open-apis/im/v1/chats/oc_xxx/members?member_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

### 4. Contacts - Directory Queries

#### Get User Info

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/contact/v3/users/ou_xxx?user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}"
```

#### Look Up User IDs by Email or Mobile

Write to `/tmp/lark_request.json`:
```json
{
  "emails": ["user@example.com"],
  "mobiles": ["+15551234567"],
  "include_resigned": false
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/contact/v3/users/batch_get_id?user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### List Departments

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/contact/v3/departments?parent_department_id=0" \
  -H "Authorization: Bearer ${TOKEN}"
```

#### Get Department Members

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/contact/v3/users/find_by_department?department_id=od_xxx&user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}"
```

### 5. Calendar - Schedule Management

#### List Calendars

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/calendar/v4/calendars" \
  -H "Authorization: Bearer ${TOKEN}"
```

#### Create Calendar

Write to `/tmp/lark_request.json`:
```json
{
  "summary": "Project Calendar",
  "description": "Calendar for project events"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/calendar/v4/calendars" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### Create Calendar Event

Note: Replace `<calendar_id>` with an actual calendar ID from List Calendars API.

```bash
TOKEN=$(get_lark_token)

# Convert ISO 8601 to Unix timestamp
START_TS=$(date -d "2025-01-15T10:00:00+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-15T10:00:00+08:00" +%s)
END_TS=$(date -d "2025-01-15T11:00:00+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-15T11:00:00+08:00" +%s)

# Write request with timestamps
cat > /tmp/lark_request.json <<EOF
{
  "summary": "Team Meeting",
  "description": "Weekly sync",
  "start_time": {"timestamp": "${START_TS}"},
  "end_time": {"timestamp": "${END_TS}"}
}
EOF

curl -X POST "https://open.larksuite.com/open-apis/calendar/v4/calendars/<calendar_id>/events" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

#### List Calendar Events

```bash
TOKEN=$(get_lark_token)

# Convert date range
START_TS=$(date -d "2025-01-01T00:00:00+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-01T00:00:00+08:00" +%s)
END_TS=$(date -d "2025-01-31T23:59:59+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-31T23:59:59+08:00" +%s)

curl -X GET "https://open.larksuite.com/open-apis/calendar/v4/calendars/<calendar_id>/events?start_time=${START_TS}&end_time=${END_TS}" \
  -H "Authorization: Bearer ${TOKEN}"
```

### 6. Bot Information

#### Get Bot Info

```bash
TOKEN=$(get_lark_token)
curl -X GET "https://open.larksuite.com/open-apis/bot/v3/info" \
  -H "Authorization: Bearer ${TOKEN}"
```

## Workflows

### Send System Alert to Group

Write to `/tmp/lark_request.json`:
```json
{
  "receive_id": "oc_xxx",
  "msg_type": "interactive",
  "content": "{\"header\": {\"title\": {\"tag\": \"plain_text\", \"content\": \"System Alert\"}, \"template\": \"red\"}, \"elements\": [{\"tag\": \"div\", \"text\": {\"tag\": \"lark_md\", \"content\": \"**Error:** Service down\"}}]}"
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=chat_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

### Create Team Group with Members

Write to `/tmp/lark_request.json`:
```json
{
  "name": "Q1 Project",
  "description": "Q1 project discussion",
  "user_id_list": ["ou_abc", "ou_def", "ou_ghi"]
}
```

```bash
TOKEN=$(get_lark_token)
curl -X POST "https://open.larksuite.com/open-apis/im/v1/chats?user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

### Query Organization Structure

```bash
TOKEN=$(get_lark_token)

# Get root departments
curl -X GET "https://open.larksuite.com/open-apis/contact/v3/departments?parent_department_id=0" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.data.items[] | {id: .department_id, name: .name}'

# Get members in a department
curl -X GET "https://open.larksuite.com/open-apis/contact/v3/users/find_by_department?department_id=od_xxx&user_id_type=open_id" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.data.items[] | {id: .user_id, name: .name}'
```

### Schedule a Meeting

```bash
TOKEN=$(get_lark_token)

START_TS=$(date -d "2025-01-20T09:00:00+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-20T09:00:00+08:00" +%s)
END_TS=$(date -d "2025-01-20T10:30:00+08:00" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-20T10:30:00+08:00" +%s)

# Write request with timestamps
cat > /tmp/lark_request.json <<EOF
{
  "summary": "Sprint Planning",
  "description": "Sprint 5 planning session",
  "start_time": {"timestamp": "${START_TS}"},
  "end_time": {"timestamp": "${END_TS}"}
}
EOF

curl -X POST "https://open.larksuite.com/open-apis/calendar/v4/calendars/<calendar_id>/events" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/lark_request.json
```

## Message Types Reference

| Type | msg_type | content Format |
|------|----------|----------------|
| Text | `text` | `{"text": "message"}` |
| Rich Text | `post` | `{"zh_cn": {"title": "...", "content": [...]}}` |
| Image | `image` | `{"image_key": "img_xxx"}` |
| Card | `interactive` | `{"header": {...}, "elements": [...]}` |

## ID Types Reference

| ID Type | Description | Example |
|---------|-------------|---------|
| `open_id` | User open ID (default) | `ou_xxx` |
| `user_id` | User ID | `abc123` |
| `union_id` | Union ID across apps | `on_xxx` |
| `email` | User email address | `user@example.com` |
| `chat_id` | Group chat ID | `oc_xxx` |

## Guidelines

1. **Authentication**: Use the `get_lark_token` helper in shell examples so commands fail clearly when `LARK_TOKEN` is missing from the runtime.

2. **Rate Limits**: Lark has rate limits per app. Add delays for bulk operations to avoid hitting limits.

3. **ID Types**: Use `open_id` for most user operations. Use `chat_id` when targeting group chats.

4. **Card Builder**: Design complex interactive cards using Lark Card Builder: https://open.larksuite.com/tool/cardbuilder

5. **Error Handling**: Check the `code` field in responses. `0` means success, non-zero indicates an error.

6. **Content Escaping**: Message content must be JSON-escaped when passed as string. Use `jq` to build complex payloads:
   ```bash
   CONTENT=$(jq -cn --arg text "Hello" '{text: $text}')
   jq -n \
     --arg receive_id "ou_xxx" \
     --arg content "$CONTENT" \
     '{receive_id: $receive_id, msg_type: "text", content: $content}' \
     > /tmp/lark_request.json
   ```

7. **Date Conversion**: Calendar events require Unix timestamps. Use `date` command with appropriate flags for your OS:
   - Linux: `date -d "2025-01-15T10:00:00+08:00" +%s`
   - macOS: `date -j -f "%Y-%m-%dT%H:%M:%S%z" "2025-01-15T10:00:00+08:00" +%s`

## API Reference

- API Documentation: https://open.larksuite.com/document/home/index
- API Explorer: https://open.larksuite.com/api-explorer
- Card Builder: https://open.larksuite.com/tool/cardbuilder
- Permissions: https://open.larksuite.com/document/home/introduction-to-scope-and-authorization/overview
