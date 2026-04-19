---
name: mem0
description: Mem0 API for persistent AI memory across conversations and sessions. Use when user mentions "Mem0", "persistent memory", "AI memory", "remember across sessions", "memory search", or "store memory".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MEM0_API_KEY` or `zero doctor check-connector --url https://api.mem0.ai/v1/memories --method GET`

## Authentication

All requests require an API key passed in the Authorization header:

```
Authorization: Token $MEM0_API_KEY
```

Get your API key from: [app.mem0.ai](https://app.mem0.ai) → **API Keys** → create or copy your key.

## Environment Variables

| Variable | Description |
|---|---|
| `MEM0_API_KEY` | Mem0 API key (starts with `m0-`) |

## Key Endpoints

Base URL: `https://api.mem0.ai`

### 1. Add a Memory

`POST /v1/memories/`

Store a new memory for a user, agent, or session.

Write to `/tmp/mem0_add.json`:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I prefer dark mode in all applications."
    }
  ],
  "user_id": "<your-user-id>"
}
```

Then run:

```bash
curl -s -X POST "https://api.mem0.ai/v1/memories/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_add.json
```

Optional fields alongside `user_id`:
- `agent_id` — scope memory to a specific agent
- `run_id` — scope memory to a specific run/session
- `metadata` — arbitrary key/value pairs to attach to the memory
- `output_format` — set to `"v1.1"` for structured results with `relations` and `facts`

Response includes `results` array with each stored memory's `id`, `memory`, and `event` (`ADD`, `UPDATE`, or `NONE`).

### 2. Search Memories (Semantic)

`POST /v1/memories/search/`

Search memories semantically using a natural language query.

Write to `/tmp/mem0_search.json`:

```json
{
  "query": "display preferences",
  "user_id": "<your-user-id>"
}
```

Then run:

```bash
curl -s -X POST "https://api.mem0.ai/v1/memories/search/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_search.json
```

Optional fields:
- `limit` — max results to return (default 100)
- `filters` — object of metadata key/value filters
- `threshold` — minimum similarity score (0–1)

Response includes a `results` array of matching memories with `id`, `memory`, `score`, and `metadata`.

### 3. Get All Memories

`GET /v1/memories/?user_id=<your-user-id>`

Retrieve all memories for a user (or agent/run).

```bash
curl -s "https://api.mem0.ai/v1/memories/?user_id=<your-user-id>" --header "Authorization: Token $MEM0_API_KEY"
```

To filter by agent or run, add `agent_id=<agent-id>` or `run_id=<run-id>` as query parameters.

Response includes a paginated `results` array.

### 4. Get a Specific Memory

`GET /v1/memories/<memory-id>/`

Retrieve a single memory by its ID.

```bash
curl -s "https://api.mem0.ai/v1/memories/<memory-id>/" --header "Authorization: Token $MEM0_API_KEY"
```

### 5. Update a Memory

`PUT /v1/memories/<memory-id>/`

Update the text content of an existing memory.

Write to `/tmp/mem0_update.json`:

```json
{
  "memory": "I prefer light mode in all applications."
}
```

Then run:

```bash
curl -s -X PUT "https://api.mem0.ai/v1/memories/<memory-id>/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_update.json
```

### 6. Delete a Memory

`DELETE /v1/memories/<memory-id>/`

Delete a specific memory.

```bash
curl -s -X DELETE "https://api.mem0.ai/v1/memories/<memory-id>/" --header "Authorization: Token $MEM0_API_KEY"
```

### 7. Delete All Memories for a User

`DELETE /v1/memories/?user_id=<your-user-id>`

Delete all memories scoped to a user.

```bash
curl -s -X DELETE "https://api.mem0.ai/v1/memories/?user_id=<your-user-id>" --header "Authorization: Token $MEM0_API_KEY"
```

### 8. Get Memory History

`GET /v1/memories/<memory-id>/history/`

Retrieve the change history for a specific memory (shows ADD, UPDATE, DELETE events over time).

```bash
curl -s "https://api.mem0.ai/v1/memories/<memory-id>/history/" --header "Authorization: Token $MEM0_API_KEY"
```

## Common Workflows

### Personalized Agent with Persistent Context

```bash
# Step 1: Store user preferences at end of session
# Write to /tmp/mem0_add.json:
# { "messages": [{"role": "user", "content": "I work in the fintech industry and prefer concise summaries."}], "user_id": "user-123" }
curl -s -X POST "https://api.mem0.ai/v1/memories/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_add.json

# Step 2: Retrieve relevant memories at start of next session
# Write to /tmp/mem0_search.json:
# { "query": "user industry and preferences", "user_id": "user-123", "limit": 5 }
curl -s -X POST "https://api.mem0.ai/v1/memories/search/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_search.json
```

### Store Memory with Metadata Tags

Write to `/tmp/mem0_tagged.json`:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "My team uses Slack for internal communication."
    }
  ],
  "user_id": "<your-user-id>",
  "metadata": {
    "category": "tools",
    "source": "onboarding"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.mem0.ai/v1/memories/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_tagged.json
```

### Filter Memories by Metadata

Write to `/tmp/mem0_filter.json`:

```json
{
  "query": "communication tools",
  "user_id": "<your-user-id>",
  "filters": {
    "category": "tools"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.mem0.ai/v1/memories/search/" --header "Authorization: Token $MEM0_API_KEY" --header "Content-Type: application/json" -d @/tmp/mem0_filter.json
```

## Memory Scoping

Memories can be scoped at multiple levels using these mutually-optional parameters:

| Parameter | Scope |
|---|---|
| `user_id` | Per end-user (most common) |
| `agent_id` | Per AI agent identity |
| `run_id` | Per individual conversation run |

Combine them to scope memories to a specific user+agent pair, or user+run.

## Notes

- Mem0 uses LLM-powered deduplication: re-adding similar content updates the existing memory rather than creating a duplicate
- The `search` endpoint performs semantic vector search, not keyword matching
- Memory IDs are UUIDs; capture them from the `results[].id` field in POST responses when you need to update or delete specific entries
- Rate limits and storage quotas depend on your Mem0 plan; check [app.mem0.ai](https://app.mem0.ai) for current usage

## API Reference

- Documentation: https://docs.mem0.ai/api-reference
- Dashboard: https://app.mem0.ai
- API Keys: https://app.mem0.ai/api-keys
