---
name: onyx
description: Onyx (cloud.onyx.app) AI knowledge base API — search internal documents, send AI chat messages, and ingest content. Use when user mentions "Onyx", "Danswer", "knowledge base search", "internal search", or "RAG search".
---

# Onyx

Onyx is an AI-powered knowledge base that connects to 40+ internal tools (Slack, Notion, Google Drive, Confluence, and more) and lets you search, chat, and ingest documents via API.

> Official docs: `https://docs.onyx.app/developers/overview`

---

## When to Use

Use this skill when you need to:

- Search your company's internal knowledge base
- Ask questions answered by internal documents
- Index new documents or content into Onyx
- Start or continue an AI chat session grounded in internal data

---

## Prerequisites

Connect the **Onyx** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name ONYX_TOKEN` or `zero doctor check-connector --url https://cloud.onyx.app/api/chat/get-user-chat-sessions --method GET`

---

## How to Use

### 1. Search Internal Documents

`POST /api/search/handle-search-request`

Write to `/tmp/onyx_search.json`:
```json
{
  "query": "How does our onboarding process work?",
  "search_type": "semantic",
  "filters": {},
  "offset": 0,
  "limit": 10
}
```

```bash
curl -s -X POST "https://cloud.onyx.app/api/search/handle-search-request" --header "Authorization: Bearer $ONYX_TOKEN" --header "Content-Type: application/json" -d @/tmp/onyx_search.json | jq '.top_documents[] | {title: .semantic_identifier, score: .score, link: .link}'
```

### 2. Create a New Chat Session

`POST /api/chat/create-chat-session`

Write to `/tmp/onyx_session.json`:
```json
{
  "persona_id": null,
  "description": null
}
```

```bash
curl -s -X POST "https://cloud.onyx.app/api/chat/create-chat-session" --header "Authorization: Bearer $ONYX_TOKEN" --header "Content-Type: application/json" -d @/tmp/onyx_session.json | jq '.chat_session_id'
```

### 3. Send a Chat Message

`POST /api/chat/send-chat-message`

Replace `<chat-session-id>` with the session ID from step 2.

Write to `/tmp/onyx_message.json`:
```json
{
  "message": "What is our vacation policy?",
  "chat_session_id": "<chat-session-id>",
  "parent_message_id": null,
  "search_filters": {},
  "stream": false,
  "include_citations": true
}
```

```bash
curl -s -X POST "https://cloud.onyx.app/api/chat/send-chat-message" --header "Authorization: Bearer $ONYX_TOKEN" --header "Content-Type: application/json" -d @/tmp/onyx_message.json | jq '.answer'
```

### 4. List Chat Sessions

```bash
curl -s "https://cloud.onyx.app/api/chat/get-user-chat-sessions" --header "Authorization: Bearer $ONYX_TOKEN" | jq '.sessions[] | {id: .id, description: .description}'
```

### 5. Ingest a Document

`POST /api/onyx-api/ingestion`

Replace `<cc-pair-id>` with your connector pair ID (visible in the Admin Panel URL, e.g. `https://cloud.onyx.app/admin/connector/308`).

Write to `/tmp/onyx_ingest.json`:
```json
{
  "document": {
    "id": "custom-doc-001",
    "sections": [
      {
        "text": "Document content to index.",
        "link": "https://example.com/doc"
      }
    ],
    "source": "ingestion_api",
    "semantic_identifier": "My Custom Document",
    "metadata": {},
    "doc_updated_at": null
  },
  "cc_pair_id": <cc-pair-id>
}
```

```bash
curl -s -X POST "https://cloud.onyx.app/api/onyx-api/ingestion" --header "Authorization: Bearer $ONYX_TOKEN" --header "Content-Type: application/json" -d @/tmp/onyx_ingest.json
```

---

## Guidelines

1. PAT tokens (`onyx_pat_...`) work for all non-admin endpoints; Admin API Keys are required for endpoints prefixed with `/admin/`
2. For multi-turn conversations, always pass `chat_session_id` and `parent_message_id` to maintain context
3. Use `search/handle-search-request` for raw document retrieval; use `chat/send-chat-message` for synthesized AI answers

