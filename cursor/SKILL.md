---
name: cursor
description: Cursor Cloud Agents API for launching and managing background coding
  agents. Use when the user mentions "Cursor", "Cursor agents", "Cursor background
  agents", "cloud agents", "cursor.com", or wants to start, monitor, follow up on,
  or cancel an autonomous coding agent on a GitHub repository.
---

# Cursor

Cursor Cloud Agents (formerly Background Agents) run autonomous coding tasks on
your GitHub repositories in the cloud. The REST API lets you launch an agent with
a prompt, stream or poll its runs, send follow-up instructions, inspect
artifacts, and manage the agent lifecycle.

> Official docs: `https://cursor.com/docs/background-agent/api/overview`

---

## When to Use

Use this skill when you need to:

- Launch a Cursor agent to work on a GitHub repository from a natural-language prompt
- List your agents and check their status
- Send a follow-up prompt to an active agent
- Poll or stream the runs an agent produces
- List the models and repositories available to your account
- Archive, unarchive, or permanently delete an agent

---

## Prerequisites

Connect the **Cursor** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The API key is created from the [Cursor Dashboard → API Keys](https://cursor.com/dashboard/api).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name CURSOR_TOKEN` or `zero doctor check-connector --url https://api.cursor.com/v1/me --method GET`

---

## How to Use

All requests go to `https://api.cursor.com` and authenticate with a Bearer token:
`Authorization: Bearer $CURSOR_TOKEN`.

### 1. Check the API Key

Confirm the connector works and see which account the key belongs to:

```bash
curl -s "https://api.cursor.com/v1/me" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 2. List Available Models

Model IDs change as new models launch — confirm an exact ID before launching an agent:

```bash
curl -s "https://api.cursor.com/v1/models" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 3. List Accessible Repositories

```bash
curl -s "https://api.cursor.com/v1/repositories" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 4. Launch an Agent

Write the request body to `/tmp/cursor_agent.json`:

```json
{
  "prompt": {
    "text": "Add input validation to the signup form and write tests."
  },
  "source": {
    "repository": "https://github.com/your-org/your-repo",
    "ref": "main"
  }
}
```

Then create the agent (this enqueues the initial run):

```bash
curl -s -X POST "https://api.cursor.com/v1/agents" --header "Content-Type: application/json" --header "Authorization: Bearer $CURSOR_TOKEN" -d @/tmp/cursor_agent.json | jq
```

The response includes the agent `id` — use it in the calls below.

### 5. List Agents

```bash
curl -s "https://api.cursor.com/v1/agents" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 6. Get Agent Status

Replace `<agent-id>` with the `id` from step 4:

```bash
curl -s "https://api.cursor.com/v1/agents/<agent-id>" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 7. List and Inspect Runs

List the runs for an agent:

```bash
curl -s "https://api.cursor.com/v1/agents/<agent-id>/runs" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

Get a single run's status and results. Replace `<run-id>`:

```bash
curl -s "https://api.cursor.com/v1/agents/<agent-id>/runs/<run-id>" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 8. Send a Follow-up Prompt

Active agents accept follow-up prompts as new runs. Write to `/tmp/cursor_followup.json`:

```json
{
  "prompt": {
    "text": "Also update the README to document the new validation rules."
  }
}
```

Then submit it:

```bash
curl -s -X POST "https://api.cursor.com/v1/agents/<agent-id>/runs" --header "Content-Type: application/json" --header "Authorization: Bearer $CURSOR_TOKEN" -d @/tmp/cursor_followup.json | jq
```

### 9. Cancel an Active Run

```bash
curl -s -X POST "https://api.cursor.com/v1/agents/<agent-id>/runs/<run-id>/cancel" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 10. List Artifacts

```bash
curl -s "https://api.cursor.com/v1/agents/<agent-id>/artifacts" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

### 11. Manage the Agent Lifecycle

Archive, unarchive, or permanently delete an agent:

```bash
curl -s -X POST "https://api.cursor.com/v1/agents/<agent-id>/archive" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
curl -s -X POST "https://api.cursor.com/v1/agents/<agent-id>/unarchive" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
curl -s -X DELETE "https://api.cursor.com/v1/agents/<agent-id>" --header "Authorization: Bearer $CURSOR_TOKEN" | jq
```

---

## Guidelines

1. **Bearer auth**: every request needs `Authorization: Bearer $CURSOR_TOKEN`; the same key also works as Basic auth (`-u $CURSOR_TOKEN:`) but prefer Bearer here
2. **Agent then runs**: creating an agent (`POST /v1/agents`) enqueues the first run automatically; subsequent instructions are added as new runs under that agent
3. **Confirm IDs first**: call the models (example 2) and repositories (example 3) endpoints to confirm valid values before launching an agent
4. **Async work**: agents run asynchronously — poll `GET /v1/agents/{id}/runs/{runId}` until the run reports a terminal status before reading results
5. **Artifact URLs expire**: presigned download URLs from the artifacts endpoint are short-lived (about 15 minutes) — fetch them just before downloading
6. **401 Unauthorized**: the key is missing or invalid — reconnect the Cursor connector at app.vm0.ai/connectors
