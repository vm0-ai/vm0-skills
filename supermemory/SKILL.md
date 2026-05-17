---
name: supermemory
description: Supermemory API for AI agent memory, context, and RAG. Use when user mentions "Supermemory", "memory layer", "agent memory", "context infrastructure", "semantic recall", or "RAG".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SUPERMEMORY_API_KEY` or `zero doctor check-connector --url https://api.supermemory.ai/v3/documents/list --method POST`

## Authentication

All requests require an API key passed in the Authorization header:

```
Authorization: Bearer $SUPERMEMORY_API_KEY
```

Get your API key from: [console.supermemory.ai](https://console.supermemory.ai) → **API Keys** → create or copy your key.

## Environment Variables

| Variable | Description |
|---|---|
| `SUPERMEMORY_API_KEY` | Supermemory API key (starts with `sm_`) |

## Key Endpoints

Base URL: `https://api.supermemory.ai`

### 1. Add a Document / Memory

`POST /v3/documents`

Ingest a single document. Content can be raw text, a URL, or a file reference. Use `containerTag` to scope the memory to a user, project, or agent.

Write to `/tmp/supermemory_add.json`:

```json
{
  "content": "I prefer dark mode in all applications.",
  "containerTag": "user-123",
  "metadata": {
    "category": "preferences"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.supermemory.ai/v3/documents" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" --header "Content-Type: application/json" -d @/tmp/supermemory_add.json
```

Optional fields:
- `customId` — your own stable identifier for the document (used for upsert/delete-by-id)
- `taskType` — `"memory"` (default) for full context layer, or `"superrag"` for managed RAG
- `containerTag` accepts alphanumeric, hyphens, underscores, and dots (max 100 chars)

### 2. Batch Add Documents

`POST /v3/documents/batch`

Ingest up to 600 documents in a single request.

Write to `/tmp/supermemory_batch.json`:

```json
{
  "documents": [
    { "content": "First memory" },
    { "content": "Second memory" }
  ],
  "containerTag": "user-123"
}
```

Then run:

```bash
curl -s -X POST "https://api.supermemory.ai/v3/documents/batch" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" --header "Content-Type: application/json" -d @/tmp/supermemory_batch.json
```

### 3. Search Memories (Semantic Recall)

`POST /v4/search`

Semantic search across memories. Scope with `containerTag` and tune precision with `threshold` (0–1, default 0.6).

Write to `/tmp/supermemory_search.json`:

```json
{
  "q": "display preferences",
  "containerTag": "user-123",
  "threshold": 0.6
}
```

Then run:

```bash
curl -s -X POST "https://api.supermemory.ai/v4/search" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" --header "Content-Type: application/json" -d @/tmp/supermemory_search.json
```

Optional fields:
- `filters` — metadata predicates with AND/OR logic (up to 5 nesting levels)
- `limit` — max results to return

### 4. List Documents

`POST /v3/documents/list`

Paginated list of documents with optional filters.

Write to `/tmp/supermemory_list.json`:

```json
{
  "containerTags": ["user-123"],
  "limit": 50
}
```

Then run:

```bash
curl -s -X POST "https://api.supermemory.ai/v3/documents/list" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" --header "Content-Type: application/json" -d @/tmp/supermemory_list.json
```

### 5. Get a Document

`GET /v3/documents/<document-id>`

Retrieve a single document and its current processing status.

```bash
curl -s "https://api.supermemory.ai/v3/documents/<document-id>" --header "Authorization: Bearer $SUPERMEMORY_API_KEY"
```

### 6. Update a Document

`PATCH /v3/documents/<document-id>`

Update content, metadata, or container assignment.

Write to `/tmp/supermemory_update.json`:

```json
{
  "metadata": {
    "category": "preferences",
    "verified": true
  }
}
```

Then run:

```bash
curl -s -X PATCH "https://api.supermemory.ai/v3/documents/<document-id>" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" --header "Content-Type: application/json" -d @/tmp/supermemory_update.json
```

### 7. Delete a Document

`DELETE /v3/documents/<document-id>`

```bash
curl -s -X DELETE "https://api.supermemory.ai/v3/documents/<document-id>" --header "Authorization: Bearer $SUPERMEMORY_API_KEY"
```

### 8. Upload a File

`POST /v3/documents/file`

Upload a file (PDF, image, audio, etc.) for processing. Uses `multipart/form-data`.

```bash
curl -s -X POST "https://api.supermemory.ai/v3/documents/file" --header "Authorization: Bearer $SUPERMEMORY_API_KEY" -F "file=@/path/to/document.pdf" -F "containerTag=user-123"
```

### 9. Connections (External Integrations)

Supermemory can pull from Notion, Google Drive, Gmail, GitHub, OneDrive, and S3. Connections are managed from the dashboard, but you can list and sync them via API.

```bash
# List all connections
curl -s "https://api.supermemory.ai/v3/connections" --header "Authorization: Bearer $SUPERMEMORY_API_KEY"

# Trigger a sync
curl -s -X POST "https://api.supermemory.ai/v3/connections/<connection-id>/sync" --header "Authorization: Bearer $SUPERMEMORY_API_KEY"
```

## Container Tags (Scoping)

Container tags are how Supermemory partitions data. Use them like namespaces:

| Pattern | Example | Use |
|---|---|---|
| Per user | `user-123` | End-user memory |
| Per agent | `agent-sales-bot` | Agent identity |
| Per project | `project-q2-launch` | Workspace/project memory |
| Combined | `user-123:project-q2` | Cross-cutting scope |

Tags accept alphanumeric, `-`, `_`, and `.`, up to 100 characters.

## Document Status Lifecycle

Documents progress through: `queued → extracting → chunking → embedding → indexing → done`. Search results only include documents in the `done` state.

## Notes

- Search defaults to semantic vector recall; combine with `filters` for hybrid metadata + semantic queries
- `customId` enables idempotent upserts — re-posting the same `customId` updates the existing document
- The `taskType: "superrag"` mode returns answer-shaped responses suitable for direct LLM grounding
- Rate limits and storage quotas depend on your Supermemory plan; check [console.supermemory.ai](https://console.supermemory.ai) for current usage

## API Reference

- Documentation: https://supermemory.ai/docs
- API Reference: https://supermemory.ai/docs/api-reference
- Dashboard: https://console.supermemory.ai
