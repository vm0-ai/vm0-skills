---
name: anthropic-managed-agents
description: Anthropic Managed Agents API for programmatically creating, running, and streaming AI agents on Anthropic's cloud infrastructure. Use when the user mentions "Managed Agents", "Anthropic agent sessions", or needs to create/run/stream an Anthropic agent with tool use (bash, git, web), attach GitHub repositories, or inject secrets via Vault. Do NOT use for standard Claude Messages API — use the Claude API skill instead.
---

# Anthropic Managed Agents API

Use the Anthropic Managed Agents API via direct `curl` calls to **create agent definitions, provision cloud environments, run agent sessions, stream output in real time, and manage vault credentials**.

> Official API reference: `https://docs.anthropic.com/en/api/beta`

---

## When to Use

Use this skill when you need to:

- **Create an agent** — define a model, system prompt, and toolset once; reuse across many sessions
- **Run agent sessions** — launch a session against a cloud environment with a GitHub repo or uploaded file mounted
- **Stream session output** — read tool calls, text output, and status changes as they happen
- **Manage environments** — configure container networking and pre-installed packages
- **Inject secrets** — store credentials in a Vault and reference them in sessions without exposing plaintext

---

## Prerequisites

Connect the **Anthropic Managed Agents** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## How to Use

All examples assume `ANTHROPIC_MANAGED_AGENTS_TOKEN` is set. The base URL is `https://api.anthropic.com`.

---

### 1. Create an Agent

An agent is a reusable configuration (model + system prompt + toolset). Create it once; use it across many sessions.

Write to `/tmp/agent_create.json`:

```json
{
  "model": "claude-sonnet-4-6",
  "name": "Code Review Agent",
  "description": "Reviews pull requests and suggests improvements",
  "system": "You are an expert code reviewer. Analyze the code in the mounted repository, identify issues, and provide actionable feedback.",
  "tools": [
    {
      "type": "agent_toolset_20260401"
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://api.anthropic.com/v1/agents" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d @/tmp/agent_create.json | jq '{id: .id, name: .name}'
```

Save the returned `id` (e.g., `agent_011CZk...`) for use in sessions.

**Built-in tools in `agent_toolset_20260401`:** `bash`, `edit`, `read`, `write`, `glob`, `grep`, `web_fetch`, `web_search`

**Available models:** `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5`

---

### 2. List Agents

```bash
curl -s "https://api.anthropic.com/v1/agents" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" | jq '.data[] | {id: .id, name: .name, model: .model}'
```

---

### 3. Get an Agent

```bash
curl -s "https://api.anthropic.com/v1/agents/<AGENT_ID>" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" | jq '.'
```

---

### 4. Delete an Agent

```bash
curl -s -X DELETE "https://api.anthropic.com/v1/agents/<AGENT_ID>" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01"
```

---

### 5. Create an Environment

An environment defines the container configuration (network policy, packages) that sessions run in. Create once, reuse across sessions.

Write to `/tmp/env_create.json`:

```json
{
  "name": "Default Cloud Environment",
  "description": "Standard environment with unrestricted network access",
  "config": {
    "type": "cloud",
    "networking": {
      "type": "unrestricted"
    },
    "packages": {
      "pip": ["requests", "pandas"],
      "npm": ["typescript"]
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.anthropic.com/v1/environments" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d @/tmp/env_create.json | jq '{id: .id, name: .name}'
```

Save the returned `id` (e.g., `env_011...`) for session creation.

**Network options:**
- `{"type": "unrestricted"}` — full internet access
- `{"type": "limited", "allow_package_managers": true, "allow_mcp_servers": true, "allowed_hosts": ["api.github.com"]}` — restricted outbound

---

### 6. Create a Session (Start a Task)

A session runs one task: it mounts resources (repos, files), runs the agent, and produces output. Each session is a separate container.

Write to `/tmp/session_create.json`:

```json
{
  "agent": "agent_011CZk...",
  "environment_id": "env_011...",
  "title": "Review PR #42",
  "resources": [
    {
      "type": "github_repository",
      "url": "https://github.com/your-org/your-repo",
      "authorization_token": "ghp_xxx",
      "checkout": {
        "type": "branch",
        "name": "feature/your-branch"
      }
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://api.anthropic.com/v1/sessions" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d @/tmp/session_create.json | jq '{id: .id, status: .status}'
```

**Resource types:**
- `github_repository` — mounts a GitHub repo; requires `url`, `authorization_token` (GitHub PAT), and optional `checkout` (branch or commit SHA). Defaults to repo's default branch.
- `file` — mounts a file uploaded via the Files API; requires `file_id`.

**Checkout options:**
- `{"type": "branch", "name": "main"}`
- `{"type": "commit", "sha": "abc123..."}`

**With Vault secrets:**
```json
{
  "agent": "agent_011CZk...",
  "environment_id": "env_011...",
  "resources": [...],
  "vault_ids": ["vault_abc..."]
}
```

---

### 7. Stream Session Events

Stream real-time SSE events from a running session. The stream stays open until the session completes.

```bash
curl -s "https://api.anthropic.com/v1/sessions/<SESSION_ID>/events/stream" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Accept: text/event-stream"
```

Events are Server-Sent Events (SSE). Each event has a `type` field:
- `agent.message` — agent text output
- `agent.tool_use` — tool invocation (bash command, file read, etc.)
- `agent.tool_result` — tool output
- `agent.thinking` — extended thinking progress signal
- `agent.mcp_tool_use` — MCP tool invocation
- `agent.mcp_tool_result` — MCP tool output

Parse agent message text output only:

```bash
curl -s "https://api.anthropic.com/v1/sessions/<SESSION_ID>/events/stream" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Accept: text/event-stream" | grep '^data:' | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if line.startswith('data: '):
        try:
            ev = json.loads(line[6:])
            # agent.message events contain content blocks with text
            if ev.get('type') == 'agent.message':
                for block in ev.get('content', []):
                    if block.get('type') == 'text':
                        print(block.get('text', ''), end='', flush=True)
        except:
            pass
"
```

### 7b. Send Events to a Session (Follow-up Messages)

While a session is idle (waiting), send follow-up messages or tool results:

```bash
curl -s -X POST "https://api.anthropic.com/v1/sessions/<SESSION_ID>/events" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "type": "user.message",
        "content": [{"type": "text", "text": "Now focus on the security implications."}]
      }
    ]
  }'
```

### 7c. List Past Events

Replay all events from a completed or running session:

```bash
curl -s "https://api.anthropic.com/v1/sessions/<SESSION_ID>/events" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" | jq '.data[] | {type: .type, id: .id}'
```

---

### 8. Get Session Status

```bash
curl -s "https://api.anthropic.com/v1/sessions/<SESSION_ID>" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" | jq '{id: .id, status: .status, title: .title}'
```

**Session statuses:** `running`, `idle`, `terminated`

---

### 9. List Sessions

```bash
# List all sessions for an agent
curl -s "https://api.anthropic.com/v1/sessions?agent_id=<AGENT_ID>&limit=10" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" | jq '.data[] | {id: .id, status: .status, title: .title}'
```

Supports filters: `agent_id`, `agent_version`, `created_at[gt/gte/lt/lte]`, `include_archived`, `order` (`asc`/`desc`), `limit`, `page`.

---

### 10. Full End-to-End Example: Code Review Workflow

```bash
# Step 1: Create agent (one-time setup)
AGENT_ID=$(curl -s -X POST "https://api.anthropic.com/v1/agents" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "name": "Code Reviewer",
    "system": "Review the code changes in the repository and provide detailed feedback on correctness, style, and potential issues.",
    "tools": [{"type": "agent_toolset_20260401"}]
  }' | jq -r '.id')
echo "Agent: $AGENT_ID"

# Step 2: Create environment (one-time setup)
ENV_ID=$(curl -s -X POST "https://api.anthropic.com/v1/environments" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d '{"name": "Default", "config": {"type": "cloud", "networking": {"type": "unrestricted"}}}' | jq -r '.id')
echo "Environment: $ENV_ID"

# Step 3: Start a session for this PR review task
SESSION_ID=$(curl -s -X POST "https://api.anthropic.com/v1/sessions" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Content-Type: application/json" \
  -d "{
    \"agent\": \"$AGENT_ID\",
    \"environment_id\": \"$ENV_ID\",
    \"title\": \"Code Review\",
    \"resources\": [{
      \"type\": \"github_repository\",
      \"url\": \"https://github.com/your-org/your-repo\",
      \"authorization_token\": \"$GITHUB_TOKEN\",
      \"checkout\": {\"type\": \"branch\", \"name\": \"feature/my-feature\"}
    }]
  }" | jq -r '.id')
echo "Session: $SESSION_ID"

# Step 4: Stream the output until complete
curl -s "https://api.anthropic.com/v1/sessions/$SESSION_ID/events/stream" \
  -H "x-api-key: $ANTHROPIC_MANAGED_AGENTS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Accept: text/event-stream" | grep '^data:' | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if line.startswith('data: '):
        try:
            ev = json.loads(line[6:])
            t = ev.get('type', '')
            if t == 'text':
                print(ev.get('text', ''), end='', flush=True)
            elif t == 'status_change':
                print(f\"\n[Status: {ev.get('status')}]\", flush=True)
        except:
            pass
"
```

---

## Guidelines

1. **Agent lifecycle**: Create an agent once; reuse its ID for all sessions. Agents are versioned — each update increments the version.
2. **Environment lifecycle**: Create an environment once per container config. Reference the same `env_id` across many sessions.
3. **Sessions are single-use**: Each session runs one task in an isolated container. For follow-up questions, create a new session.
4. **Stream before polling**: Use the SSE stream (`/events/stream`) to get real-time output. Only fall back to `GET /v1/sessions/{id}` for status checks after the stream closes.
5. **GitHub auth**: Pass a GitHub PAT with `repo` scope as `authorization_token` in repository resources. The token is used only for that session.
6. **Vaults for secrets**: Store long-lived credentials (API keys, tokens) in a Vault and pass `vault_ids` instead of embedding secrets in session payloads.
7. **Model selection**: Use `claude-sonnet-4-6` for most coding tasks (speed + quality balance). Use `claude-opus-4-6` for complex multi-file refactors.
8. **Beta header required**: All Managed Agents endpoints require `anthropic-beta: managed-agents-2026-04-01`. Requests without it will fail.
9. **Billing**: Sessions consume Claude API credits (tokens), not claude.ai subscription quota. Monitor usage in [Claude Console](https://console.anthropic.com/).
