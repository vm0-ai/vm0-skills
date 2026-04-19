---
name: zep
description: Zep API for long-term memory and conversation history management in AI agents. Use when user mentions "Zep", "conversation memory", "session memory", "memory search", "user facts", "agent memory", or "long-term memory".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ZEP_TOKEN` or `zero doctor check-connector --url https://api.getzep.com/api/v2/sessions --method GET`

## Authentication

All requests require an API key passed in the header:

```
Authorization: Api-Key $ZEP_TOKEN
```

> Official docs: `https://help.getzep.com/api`

## Environment Variables

| Variable | Description |
|---|---|
| `ZEP_TOKEN` | Zep API key from app.getzep.com → Settings → API Keys |

## Prerequisites

Connect the **Zep** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name ZEP_TOKEN` or `zero doctor check-connector --url https://api.getzep.com/api/v2/sessions --method GET`

## Key Concepts

- **Users** — represent end users whose memory you are managing
- **Sessions** — conversation threads tied to a user; each session accumulates message history
- **Memory** — the distilled facts and context extracted from a session's messages
- **Search** — full-text and semantic search across memory and facts

Base URL: `https://api.getzep.com`

---

## Users

### Create a User

Write to `/tmp/zep_user.json`:

```json
{
  "user_id": "<your-user-id>",
  "email": "<user-email>",
  "first_name": "<first-name>",
  "last_name": "<last-name>",
  "metadata": {}
}
```

```bash
curl -s -X POST "https://api.getzep.com/api/v2/users" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_user.json
```

### Get a User

```bash
curl -s "https://api.getzep.com/api/v2/users/<user-id>" --header "Authorization: Api-Key $ZEP_TOKEN"
```

### List Users

```bash
curl -s "https://api.getzep.com/api/v2/users?limit=50" --header "Authorization: Api-Key $ZEP_TOKEN"
```

### Update a User

Write to `/tmp/zep_user_update.json`:

```json
{
  "email": "<new-email>",
  "first_name": "<new-first-name>",
  "last_name": "<new-last-name>",
  "metadata": {}
}
```

```bash
curl -s -X PATCH "https://api.getzep.com/api/v2/users/<user-id>" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_user_update.json
```

### Delete a User

```bash
curl -s -X DELETE "https://api.getzep.com/api/v2/users/<user-id>" --header "Authorization: Api-Key $ZEP_TOKEN"
```

---

## Sessions

### Create a Session

Write to `/tmp/zep_session.json`:

```json
{
  "session_id": "<your-session-id>",
  "user_id": "<user-id>",
  "metadata": {}
}
```

```bash
curl -s -X POST "https://api.getzep.com/api/v2/sessions" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_session.json
```

### Get a Session

```bash
curl -s "https://api.getzep.com/api/v2/sessions/<session-id>" --header "Authorization: Api-Key $ZEP_TOKEN"
```

### List Sessions

```bash
curl -s "https://api.getzep.com/api/v2/sessions?limit=50" --header "Authorization: Api-Key $ZEP_TOKEN"
```

### List Sessions for a User

```bash
curl -s "https://api.getzep.com/api/v2/users/<user-id>/sessions" --header "Authorization: Api-Key $ZEP_TOKEN"
```

---

## Memory

### Add Messages to a Session

Write to `/tmp/zep_messages.json`:

```json
{
  "messages": [
    {
      "role": "user",
      "role_type": "user",
      "content": "What's the weather like today?"
    },
    {
      "role": "assistant",
      "role_type": "assistant",
      "content": "It's sunny and 72°F in San Francisco."
    }
  ]
}
```

```bash
curl -s -X POST "https://api.getzep.com/api/v2/sessions/<session-id>/memory" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_messages.json
```

### Get Memory for a Session

Returns the distilled memory context and recent messages for a session.

```bash
curl -s "https://api.getzep.com/api/v2/sessions/<session-id>/memory" --header "Authorization: Api-Key $ZEP_TOKEN"
```

### Delete Memory for a Session

```bash
curl -s -X DELETE "https://api.getzep.com/api/v2/sessions/<session-id>/memory" --header "Authorization: Api-Key $ZEP_TOKEN"
```

---

## Search

### Search Memory Across a User's Sessions

Write to `/tmp/zep_search.json`:

```json
{
  "text": "user's preference for dark mode",
  "search_scope": "facts",
  "search_type": "similarity",
  "limit": 10
}
```

```bash
curl -s -X POST "https://api.getzep.com/api/v2/users/<user-id>/search" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_search.json
```

Key parameters:
- `text` — the query string
- `search_scope` — `"facts"` (extracted facts) or `"messages"` (raw messages)
- `search_type` — `"similarity"` (semantic) or `"mmr"` (max marginal relevance)
- `limit` — max results to return (default 10)

### Search Sessions for a User

```bash
curl -s -X POST "https://api.getzep.com/api/v2/sessions/<session-id>/search" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_search.json
```

---

## Facts

### Get Facts for a User

Returns all extracted facts about a user across their sessions.

```bash
curl -s "https://api.getzep.com/api/v2/users/<user-id>/facts" --header "Authorization: Api-Key $ZEP_TOKEN"
```

---

## Common Workflows

### Persist a Conversation Turn

```bash
# 1. Ensure the user exists (create if needed)
curl -s "https://api.getzep.com/api/v2/users/<user-id>" --header "Authorization: Api-Key $ZEP_TOKEN"

# 2. Ensure the session exists (create if needed)
curl -s "https://api.getzep.com/api/v2/sessions/<session-id>" --header "Authorization: Api-Key $ZEP_TOKEN"

# 3. Add the new messages to the session
curl -s -X POST "https://api.getzep.com/api/v2/sessions/<session-id>/memory" --header "Authorization: Api-Key $ZEP_TOKEN" --header "Content-Type: application/json" -d @/tmp/zep_messages.json
```

### Load Context for a New Agent Turn

```bash
# Retrieve distilled memory + recent messages to inject into the system prompt
curl -s "https://api.getzep.com/api/v2/sessions/<session-id>/memory" --header "Authorization: Api-Key $ZEP_TOKEN"
```

---

## Guidelines

1. **Session IDs** — use stable, deterministic IDs (e.g. a conversation UUID) so the same session is reused across agent runs
2. **User IDs** — use a stable identifier (e.g. the user's account ID) rather than ephemeral values
3. **Memory context** — inject the `context` field from the memory response into the agent's system prompt to provide long-term continuity
4. **Facts vs messages** — search `facts` scope for structured user preferences; search `messages` scope for verbatim conversation recall
5. **Rate limits** — Zep enforces per-project rate limits; handle `429` responses with exponential backoff
