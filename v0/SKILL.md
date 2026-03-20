---
name: v0
description: v0 by Vercel AI app builder API. Use when user mentions "v0", "v0.dev", wants to generate UI components or full-stack apps with AI, or manage v0 projects, chats, and deployments programmatically.
vm0_secrets:
  - V0_TOKEN
---

# v0 by Vercel API

Generate React/Next.js UI components and full-stack apps from natural language prompts, iterate on generated code, manage projects, and track deployments — all via v0's REST API.

> Official docs: `https://v0.app/docs/api/platform/overview`

---

## When to Use

Use this skill when you need to:

- Generate React/Next.js UI components or full-stack apps from a text prompt
- Iterate on previously generated code by sending follow-up messages
- List, create, or manage v0 projects programmatically
- Check or list deployments of v0-generated apps
- Use the `v0-1.0-md` model via an OpenAI-compatible chat completions endpoint

---

## Prerequisites

1. Sign up at [v0.dev](https://v0.dev) — requires a **Premium** ($20/mo) or **Team** ($30/user/mo) plan
2. Enable usage-based billing on your Vercel account
3. Go to [v0.dev/chat/settings/keys](https://v0.dev/chat/settings/keys) and create an API key

Set the environment variable:

```bash
export V0_TOKEN="your-api-key"
```

**Daily limits:** 10,000 API requests · 1,000 chat messages · 100 deployments

> **Important:** When using `$V0_TOKEN` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

---

## How to Use

Base URL: `https://api.v0.dev/v1`

---

### 1. Generate App or UI from Prompt

Create a new chat to generate code from a natural language prompt:

Write to `/tmp/v0_request.json`:

```json
{
  "message": "Build a React dashboard with a sidebar, stats cards, and a line chart using Tailwind CSS"
}
```

Then run:

```bash
curl -s -X POST "https://api.v0.dev/v1/chats" --header "Authorization: Bearer $(printenv V0_TOKEN)" --header "Content-Type: application/json" -d @/tmp/v0_request.json
```

The response includes:
- `id` — chat ID (used for follow-up messages)
- `webUrl` — link to the chat on v0.app
- `latestVersion.demoUrl` — live sandbox preview of the generated app
- `latestVersion.files` — generated source files

---

### 2. Iterate — Send Follow-up Message

Refine generated code by sending a follow-up to an existing chat. Replace `<chat-id>` with the ID from the previous response:

Write to `/tmp/v0_request.json`:

```json
{
  "message": "Add a dark mode toggle to the header and make the sidebar collapsible"
}
```

Then run:

```bash
curl -s -X POST "https://api.v0.dev/v1/chats/<chat-id>/messages" --header "Authorization: Bearer $(printenv V0_TOKEN)" --header "Content-Type: application/json" -d @/tmp/v0_request.json
```

---

### 3. Get Chat Details (Retrieve Generated Code)

Fetch the full chat including generated files. Replace `<chat-id>` with the target chat ID:

```bash
curl -s "https://api.v0.dev/v1/chats/<chat-id>" --header "Authorization: Bearer $(printenv V0_TOKEN)"
```

The `latestVersion.files` array contains the generated source code files.

---

### 4. List All Chats

```bash
bash -c 'curl -s "https://api.v0.dev/v1/chats" --header "Authorization: Bearer $V0_TOKEN"' | jq '.data[] | {id, name, webUrl}'
```

---

### 5. Create Project

Organize related chats under a named project:

Write to `/tmp/v0_request.json`:

```json
{
  "name": "Customer Dashboard",
  "description": "Internal analytics dashboard for customer team",
  "privacy": "private"
}
```

Then run:

```bash
curl -s -X POST "https://api.v0.dev/v1/projects" --header "Authorization: Bearer $(printenv V0_TOKEN)" --header "Content-Type: application/json" -d @/tmp/v0_request.json
```

To create a chat within a project, add `"projectId": "<project-id>"` to the chat creation request.

---

### 6. List Projects

```bash
bash -c 'curl -s "https://api.v0.dev/v1/projects" --header "Authorization: Bearer $V0_TOKEN"' | jq '.data[] | {id, name, privacy}'
```

---

### 7. List Deployments

```bash
bash -c 'curl -s "https://api.v0.dev/v1/deployments" --header "Authorization: Bearer $V0_TOKEN"' | jq '.data[] | {id, webUrl, status}'
```

---

### 8. Chat Completions (OpenAI-compatible)

Use the `v0-1.0-md` model directly for lightweight code generation without project context. This follows the standard OpenAI chat completions format:

Write to `/tmp/v0_request.json`:

```json
{
  "model": "v0-1.0-md",
  "messages": [
    {"role": "user", "content": "Create a login form with email and password fields using shadcn/ui and Tailwind CSS"}
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.v0.dev/v1/chat/completions" --header "Authorization: Bearer $V0_TOKEN" --header "Content-Type: application/json" -d @/tmp/v0_request.json' | jq '.choices[0].message.content'
```

**Context window:** 128,000 tokens input · 32,000 tokens output

---

## Guidelines

1. **Premium plan required**: API access requires a v0 Premium or Team subscription with Vercel usage-based billing enabled
2. **Iterate with follow-ups**: Use `POST /chats/<id>/messages` to refine code — it preserves full conversation context and is more token-efficient than creating a new chat
3. **demoUrl is the live preview**: Each chat response contains `latestVersion.demoUrl` — the live sandbox URL to preview the generated app; `webUrl` is the link to the v0.app chat interface
4. **Use projects for organization**: Group related chats under a project (via `projectId`) to share instructions and context across conversations
5. **Rate limits**: 1,000 chat messages and 100 deployments per day — prefer iterating within existing chats over creating new ones
