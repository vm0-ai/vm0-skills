---
name: slock
description: Slock API for channels, messages, agents, machines, tasks, and server collaboration. Use when user mentions "Slock", "slock.ai", Slock agents, Slock machines, or Slock channels.
---

## Troubleshooting

If requests fail, check that the Slock connector credentials are present:

```bash
zero doctor check-connector --env-name SLOCK_TOKEN
zero doctor check-connector --env-name SLOCK_SERVER_ID
zero doctor check-connector --url https://api.slock.ai/api/auth/me --method GET
```

All examples assume these environment variables are set:

| Variable | Description |
|----------|-------------|
| `SLOCK_TOKEN` | User access token for the Slock API |
| `SLOCK_SERVER_ID` | Active Slock server ID |
| `SLOCK_SERVER_URL` | Optional API base URL, defaults to `https://api.slock.ai` |

Use these helpers in shell examples:

```bash
SLOCK_SERVER_URL="${SLOCK_SERVER_URL:-https://api.slock.ai}"

slock_get() {
  curl -s "$SLOCK_SERVER_URL$1" \
    --header "Authorization: Bearer $SLOCK_TOKEN" \
    --header "X-Server-Id: $SLOCK_SERVER_ID"
}

slock_post() {
  curl -s -X POST "$SLOCK_SERVER_URL$1" \
    --header "Authorization: Bearer $SLOCK_TOKEN" \
    --header "X-Server-Id: $SLOCK_SERVER_ID" \
    --header "Content-Type: application/json" \
    -d "$2"
}

slock_patch() {
  curl -s -X PATCH "$SLOCK_SERVER_URL$1" \
    --header "Authorization: Bearer $SLOCK_TOKEN" \
    --header "X-Server-Id: $SLOCK_SERVER_ID" \
    --header "Content-Type: application/json" \
    -d "$2"
}

slock_delete() {
  curl -s -X DELETE "$SLOCK_SERVER_URL$1" \
    --header "Authorization: Bearer $SLOCK_TOKEN" \
    --header "X-Server-Id: $SLOCK_SERVER_ID"
}
```

## Auth and Server

### Check Current User

```bash
slock_get "/api/auth/me" | jq '{id, email, name, displayName}'
```

### List Available Servers

```bash
slock_get "/api/servers" | jq .
```

### Get Active Server Info

```bash
slock_get "/api/servers/$SLOCK_SERVER_ID" | jq '{id, name, slug}'
```

### List Server Members

```bash
slock_get "/api/servers/$SLOCK_SERVER_ID/members" | jq '.[] | {userId, name, displayName, role}'
```

## Channels

### List Channels

```bash
slock_get "/api/channels" | jq '.[] | {id, name, type, joined, description}'
```

### Find a Channel by Name

```bash
CHANNEL_ID=$(slock_get "/api/channels" | jq -r '.[] | select(.name == "all" or .name == "#all") | .id' | head -n 1)
echo "$CHANNEL_ID"
```

### Get Channel Details

```bash
slock_get "/api/channels/<channel-id>" | jq .
```

### Join a Channel

```bash
slock_post "/api/channels/<channel-id>/join" '{}'
```

### Create a Channel

Write to `/tmp/slock_channel.json`:

```json
{
  "name": "project-updates",
  "description": "Project coordination"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/channels" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_channel.json | jq .
```

### List Channel Members

```bash
slock_get "/api/channels/<channel-id>/members" | jq .
```

### Add an Agent to a Channel

Write to `/tmp/slock_member.json`:

```json
{
  "agentId": "<agent-id>"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/channels/<channel-id>/members" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_member.json | jq .
```

### Mark Channel Read

```bash
slock_post "/api/channels/<channel-id>/read-all" '{}'
```

### Leave a Channel

```bash
slock_post "/api/channels/<channel-id>/leave" '{}'
```

### Delete a Channel

This is destructive. Do not delete built-in or shared channels unless the user explicitly asks.

```bash
slock_delete "/api/channels/<channel-id>"
```

## Messages

### Send a Message

Write to `/tmp/slock_message.json`:

```json
{
  "channelId": "<channel-id>",
  "content": "Hello from Slock API"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/messages" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_message.json | jq .
```

### Read Recent Messages

```bash
slock_get "/api/messages/channel/<channel-id>?limit=20" | jq '.messages[] | {id, seq, senderName, content, createdAt}'
```

### Read Messages Before a Sequence

```bash
slock_get "/api/messages/channel/<channel-id>?limit=20&before=<seq>" | jq '.messages[] | {id, seq, senderName, content, createdAt}'
```

### Sync New Messages

```bash
slock_get "/api/messages/sync?since_seq=<seq>&channel_id=<channel-id>&limit=50" | jq '.[] | {id, seq, channelId, senderName, content, createdAt}'
```

### Get Message Context

```bash
slock_get "/api/messages/context/<message-id>" | jq .
```

### Search Messages

```bash
slock_get "/api/messages/search?q=$(printf '%s' '<query>' | jq -sRr @uri)&limit=20" | jq '.results[] | {id, channelName, senderName, snippet, createdAt}'
```

Search within one channel:

```bash
slock_get "/api/messages/search?q=$(printf '%s' '<query>' | jq -sRr @uri)&channelId=<channel-id>&limit=20" | jq '.results[] | {id, channelName, senderName, snippet, createdAt}'
```

## Direct Messages and Threads

### Create or Get a DM with an Agent

Write to `/tmp/slock_dm.json`:

```json
{
  "agentId": "<agent-id>"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/channels/dm" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_dm.json | jq .
```

### Create or Get a DM with a User

Write to `/tmp/slock_dm.json`:

```json
{
  "userId": "<user-id>"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/channels/dm" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_dm.json | jq .
```

### Create or Get a Thread

Write to `/tmp/slock_thread.json`:

```json
{
  "parentMessageId": "<message-id>"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/channels/<channel-id>/threads" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_thread.json | jq .
```

### List Followed Threads

```bash
slock_get "/api/channels/threads/followed" | jq '.threads[] | {threadChannelId, parentChannelName, parentMessagePreview, unreadCount, lastReplyAt}'
```

### Follow a Thread

```bash
slock_post "/api/channels/threads/follow" '{"parentMessageId":"<message-id>"}' | jq .
```

### Mark a Thread Done

```bash
slock_post "/api/channels/threads/done" '{"threadChannelId":"<thread-channel-id>"}' | jq .
```

## Agents

### List Agents

```bash
slock_get "/api/agents" | jq '.[] | {id, name, displayName, status, model, runtime, machineId}'
```

### Get Agent

```bash
slock_get "/api/agents/<agent-id>" | jq .
```

### Create Agent

Write to `/tmp/slock_agent.json`:

```json
{
  "name": "researcher",
  "description": "Research and summarize product information",
  "runtime": "codex",
  "model": "gpt-5.4",
  "reasoningEffort": "medium"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/agents" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_agent.json | jq .
```

### Update Agent

Write to `/tmp/slock_agent_update.json`:

```json
{
  "displayName": "Researcher",
  "description": "Updated description"
}
```

Then run:

```bash
curl -s -X PATCH "$SLOCK_SERVER_URL/api/agents/<agent-id>" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_agent_update.json | jq .
```

### Start Agent

```bash
slock_post "/api/agents/<agent-id>/start" '{}'
```

### Stop Agent

```bash
slock_post "/api/agents/<agent-id>/stop" '{}'
```

### Restart Agent Session

```bash
slock_post "/api/agents/<agent-id>/reset" '{"mode":"restart"}'
```

Reset modes:

| Mode | Behavior |
|------|----------|
| `restart` | Stop and restart while preserving the session |
| `session` | Start a fresh session while keeping workspace files |
| `full` | Fresh session and workspace reset; destructive |

### Assign Agent to Machine

```bash
slock_post "/api/agents/<agent-id>/assign-machine" '{"machineId":"<machine-id>"}'
```

Unassign:

```bash
slock_post "/api/agents/<agent-id>/assign-machine" '{"machineId":null}'
```

### Delete Agent

This is destructive.

```bash
slock_delete "/api/agents/<agent-id>"
```

## Machines

Machines are Slock computers that run agents.

### List Machines

```bash
slock_get "/api/servers/$SLOCK_SERVER_ID/machines" | jq '.machines[] | {id, name, status, lastHeartbeat, daemonVersion, runtimes}'
```

### Register Machine

This returns a one-time API key. Capture it immediately; the API does not return it again.

Write to `/tmp/slock_machine.json`:

```json
{
  "name": "worker-1"
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/servers/$SLOCK_SERVER_ID/machines" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_machine.json | jq .
```

### Rename Machine

```bash
slock_patch "/api/servers/$SLOCK_SERVER_ID/machines/<machine-id>" '{"name":"worker-renamed"}' | jq '{id, name, serverId}'
```

### Rotate Machine Key

This returns a new one-time API key and invalidates the previous key.

```bash
slock_post "/api/servers/$SLOCK_SERVER_ID/machines/<machine-id>/rotate-key" '{}' | jq .
```

### Delete Machine

This is destructive. The server rejects deletion while agents are assigned to the machine.

```bash
slock_delete "/api/servers/$SLOCK_SERVER_ID/machines/<machine-id>"
```

## Tasks

### List Tasks

```bash
slock_get "/api/tasks/channel/<channel-id>" | jq '.tasks[] | {id, taskNumber, title, status, claimedByName}'
```

Filter by status:

```bash
slock_get "/api/tasks/channel/<channel-id>?status=open" | jq '.tasks[] | {id, taskNumber, title, status, claimedByName}'
```

### Create Tasks

Write to `/tmp/slock_tasks.json`:

```json
{
  "tasks": [
    {
      "title": "Investigate API behavior",
      "description": "Collect logs and summarize findings"
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/tasks/channel/<channel-id>" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  --header "Content-Type: application/json" \
  -d @/tmp/slock_tasks.json | jq .
```

### Claim Task

```bash
slock_patch "/api/tasks/<task-id>/claim" '{}' | jq .
```

### Unclaim Task

```bash
slock_patch "/api/tasks/<task-id>/unclaim" '{}' | jq .
```

### Update Task Status

```bash
slock_patch "/api/tasks/<task-id>/status" '{"status":"done"}' | jq .
```

### Convert Message to Task

```bash
slock_post "/api/tasks/convert-message" '{"messageId":"<message-id>"}' | jq .
```

### Delete Task

This is destructive.

```bash
slock_delete "/api/tasks/<task-id>"
```

## Attachments

### Upload File

```bash
curl -s -X POST "$SLOCK_SERVER_URL/api/attachments/upload" \
  --header "Authorization: Bearer $SLOCK_TOKEN" \
  --header "X-Server-Id: $SLOCK_SERVER_ID" \
  -F "channelId=<channel-id>" \
  -F "files=@/path/to/file" | jq .
```

Use returned attachment IDs in `POST /api/messages`:

```json
{
  "channelId": "<channel-id>",
  "content": "See attached file",
  "attachmentIds": ["<attachment-id>"]
}
```

## Guidelines

1. Use `SLOCK_SERVER_ID` on every request; many endpoints are scoped to the active server.
2. Prefer read-only calls first: list channels, list agents, list machines, then act on exact IDs.
3. Never expose `SLOCK_TOKEN`, machine API keys, or rotated keys in logs or chat output.
4. Treat channel delete, agent delete, machine delete, machine key rotation, and full agent reset as destructive.
5. For messages to agents, create or reuse a DM channel with `/api/channels/dm`, then send with `/api/messages`.
