---
name: dify
description: Dify API for LLM app building. Use when user mentions "Dify", "LLM app",
  "AI workflow", or asks about Dify platform.
vm0_secrets:
  - DIFY_TOKEN
---

# Dify API

Build and interact with AI-powered workflows, chatbots, and text generation apps via Dify's REST API.

> Official docs: `https://docs.dify.ai/en/use-dify/publish/developing-with-apis`

---

## When to Use

Use this skill when you need to:

- **Run AI workflows** with custom inputs and retrieve results
- **Chat with AI apps** in multi-turn conversations
- **Generate text completions** from configured prompts
- **Manage knowledge bases** (create, list, add documents, query)
- **Upload files** for use in AI app conversations or workflows

---

## Prerequisites

1. Sign up at [Dify Cloud](https://cloud.dify.ai) or deploy a self-hosted instance
2. Create an application (Chatbot, Text Generator, or Workflow)
3. Go to the app's **API Access** page and generate an API key

```bash
export DIFY_TOKEN="app-xxxxxxxxxxxxxxxxxx"
```


> **Placeholders:** Values in `{curly-braces}` like `{conversation_id}` are placeholders. Replace them with actual values when executing.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/dify-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $DIFY_TOKEN" "$@"
EOF
chmod +x /tmp/dify-curl
```

**Usage:** All examples below use `/tmp/dify-curl` instead of direct `curl` calls.

## Chat Messages

### Send Chat Message (Blocking)

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {},
  "query": "What is Dify?",
  "response_mode": "blocking",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/chat-messages" -d @/tmp/dify_request.json | jq .
```

### Send Chat Message (Streaming)

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {},
  "query": "Explain quantum computing simply",
  "response_mode": "streaming",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/chat-messages" -d @/tmp/dify_request.json
```

Streaming returns Server-Sent Events (SSE) with incremental chunks.

### Continue a Conversation

To continue an existing conversation, include the `conversation_id` from the first response:

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {},
  "query": "Tell me more about that",
  "response_mode": "blocking",
  "conversation_id": "{conversation_id}",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/chat-messages" -d @/tmp/dify_request.json | jq .
```

### Stop Chat Message Generation

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/chat-messages/{task_id}/stop""'"'{"user": "user-123"}'"'"'' | jq .
```

---

## Text Completion

### Create Completion Message

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {
    "text": "Summarize the following: Dify is an open-source LLM app development platform."
  },
  "response_mode": "blocking",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/completion-messages" -d @/tmp/dify_request.json | jq .
```

The `inputs` object keys depend on the variables configured in your Dify app's prompt template.

---

## Workflow Execution

### Execute Workflow (Blocking)

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {
    "query": "Analyze this data and provide insights"
  },
  "response_mode": "blocking",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/workflows/run" -d @/tmp/dify_request.json | jq .
```

Response includes `workflow_run_id`, `status`, `outputs`, `elapsed_time`, and `total_tokens`.

### Execute Workflow (Streaming)

Write to `/tmp/dify_request.json`:

```json
{
  "inputs": {
    "query": "Generate a report on AI trends"
  },
  "response_mode": "streaming",
  "user": "user-123"
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/workflows/run" -d @/tmp/dify_request.json
```

### Get Workflow Run Detail

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/workflows/run/{workflow_run_id}" | jq .
```

---

## Conversations

### List Conversations

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/conversations?user=user-123&limit=20" | jq .
```

### Get Conversation History Messages

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/messages?user=user-123&conversation_id={conversation_id}&limit=20" | jq .
```

### Delete Conversation

```bash
/tmp/dify-curl -X DELETE "https://api.dify.ai/v1/conversations/{conversation_id}""'"'{"user": "user-123"}'"'"'' | jq .
```

### Rename Conversation

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/conversations/{conversation_id}/name""'"'{"name": "My Chat Session", "user": "user-123"}'"'"'' | jq .
```

---

## Message Feedback

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/messages/{message_id}/feedbacks""'"'{"rating": "like", "user": "user-123"}'"'"'' | jq .
```

Rating values: `like`, `dislike`, or `null` (to remove feedback).

---

## Suggested Questions

Get follow-up question suggestions after a message:

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/messages/{message_id}/suggested?user=user-123" | jq .
```

---

## File Upload

Upload a file for use in conversations:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/files/upload" | jq .
```

Use the returned `id` in chat messages by adding it to the `files` array in the request body.

---

## Application Info

### Get Application Parameters

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/parameters?user=user-123" | jq .
```

### Get Application Meta Info

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/meta?user=user-123" | jq .
```

---

## Knowledge Base Management

Knowledge base APIs use a separate **Dataset API key** (not the app API key). Generate it from the Knowledge page's API section.

### Create Knowledge Base

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/datasets""'"'{"name": "My Knowledge Base"}'"'"'' | jq .
```

### List Knowledge Bases

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/datasets?page=1&limit=20" | jq .
```

### Delete Knowledge Base

```bash
/tmp/dify-curl -X DELETE "https://api.dify.ai/v1/datasets/{dataset_id}" | jq .
```

### Create Document by Text

Write to `/tmp/dify_request.json`:

```json
{
  "name": "example-document",
  "text": "This is the content of the document to be indexed.",
  "indexing_technique": "high_quality",
  "process_rule": {
    "mode": "automatic"
  }
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/datasets/{dataset_id}/document/create_by_text" -d @/tmp/dify_request.json | jq .
```

### List Documents in Knowledge Base

```bash
/tmp/dify-curl -X GET "https://api.dify.ai/v1/datasets/{dataset_id}/documents?page=1&limit=20" | jq .
```

### Delete Document

```bash
/tmp/dify-curl -X DELETE "https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}" | jq .
```

### Query Knowledge Base (Retrieval)

Write to `/tmp/dify_request.json`:

```json
{
  "query": "What is machine learning?",
  "retrieval_model": {
    "search_method": "semantic_search",
    "reranking_enable": false
  },
  "top_k": 3
}
```

Then run:

```bash
/tmp/dify-curl -X POST "https://api.dify.ai/v1/datasets/{dataset_id}/retrieve" -d @/tmp/dify_request.json | jq .
```

---

## Guidelines

1. **Each app has its own API key** starting with `app-`. Generate keys from the app's API Access page
2. **Knowledge base APIs use a separate key** generated from the Knowledge page's API section
3. **Use `response_mode: "blocking"`** for simple integrations; use `"streaming"` for real-time UI
4. **Conversation continuity** requires passing `conversation_id` from previous responses
5. **The `user` field is required** in most endpoints for usage tracking and rate limiting
6. **The `inputs` keys** depend on variables configured in your Dify app's prompt template
7. **API conversations are isolated** from WebApp conversations and cannot be shared
8. **Complex JSON payloads** should be written to `/tmp/dify_request.json` and referenced with `-d @/tmp/dify_request.json`
