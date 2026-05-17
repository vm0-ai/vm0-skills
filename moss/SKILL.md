---
name: moss
description: Moss real-time semantic search API for conversational and voice AI agents. Use when user mentions "Moss", "moss.dev", "real-time semantic search", "voice agent retrieval", or "low-latency RAG".
---

# Moss

[Moss](https://www.moss.dev) is a real-time semantic search runtime for conversational and voice AI agents. Indexes and queries live next to the agent (server, browser, or device) so retrieval lands in under 10 ms.

> Official docs: `https://docs.moss.dev/docs/start/quickstart`

---

## When to Use

Use this skill when you need to:

- Build a low-latency retrieval layer for a voice or chat agent
- Manage a Moss index (create, add docs, search, update, delete)
- Bulk-load knowledge base content into a Moss project
- Inspect or list the indexes that already exist in a Moss project

---

## Prerequisites

Connect the **Moss** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name MOSS_PROJECT_KEY` or `zero doctor check-connector --url https://api.moss.dev/v1/indexes --method GET`

## Environment Variables

| Variable | Description |
|---|---|
| `MOSS_PROJECT_ID` | Moss project identifier (paired with the project key) |
| `MOSS_PROJECT_KEY` | Moss project API key |

Both values come from the Moss portal — pair them on every request.

---

## How to Use

Base URL: `https://api.moss.dev`

Every request includes both the project id and the project key. Moss accepts them as headers (`X-Moss-Project-Id` + `Authorization: Bearer …`); the SDK passes them through the same way.

### 1. List indexes in a project

```bash
curl -s -X GET "https://api.moss.dev/v1/indexes" --header "X-Moss-Project-Id: $MOSS_PROJECT_ID" --header "Authorization: Bearer $MOSS_PROJECT_KEY"
```

### 2. Create an index

Write to `/tmp/moss_index.json`:

```json
{
  "name": "support-kb",
  "description": "Support knowledge base"
}
```

```bash
curl -s -X POST "https://api.moss.dev/v1/indexes" --header "X-Moss-Project-Id: $MOSS_PROJECT_ID" --header "Authorization: Bearer $MOSS_PROJECT_KEY" --header "Content-Type: application/json" -d @/tmp/moss_index.json
```

### 3. Add documents to an index

Replace `<index-name>` with the index you created above.

Write to `/tmp/moss_docs.json`:

```json
{
  "docs": [
    { "text": "How do I track my order?" },
    { "text": "What is the refund policy?" }
  ]
}
```

```bash
curl -s -X POST "https://api.moss.dev/v1/indexes/<index-name>/docs" --header "X-Moss-Project-Id: $MOSS_PROJECT_ID" --header "Authorization: Bearer $MOSS_PROJECT_KEY" --header "Content-Type: application/json" -d @/tmp/moss_docs.json
```

### 4. Semantic search

Replace `<index-name>` with your index.

Write to `/tmp/moss_query.json`:

```json
{
  "query": "how do refunds work?",
  "top_k": 5
}
```

```bash
curl -s -X POST "https://api.moss.dev/v1/indexes/<index-name>/search" --header "X-Moss-Project-Id: $MOSS_PROJECT_ID" --header "Authorization: Bearer $MOSS_PROJECT_KEY" --header "Content-Type: application/json" -d @/tmp/moss_query.json | jq '.results[] | {score, text: .doc.text}'
```

### 5. Delete an index

Replace `<index-name>` with the index to remove.

```bash
curl -s -X DELETE "https://api.moss.dev/v1/indexes/<index-name>" --header "X-Moss-Project-Id: $MOSS_PROJECT_ID" --header "Authorization: Bearer $MOSS_PROJECT_KEY"
```

---

## Guidelines

1. Pair `MOSS_PROJECT_ID` and `MOSS_PROJECT_KEY` on every request — Moss scopes credentials per project, not per token.
2. Keep indexes small and topical; Moss is optimised for hot, conversational retrieval, not for archival search.
3. Prefer the Python or TypeScript SDK (`MossClient(PROJECT_ID, PROJECT_KEY)`) when you control the runtime — it streams updates and packages indexes for browser/device deployment automatically.
4. For voice agents, run the search call in parallel with model thinking so the <10 ms latency budget is preserved.
