---
name: e2b
description: E2B API for creating and managing secure cloud sandboxes for AI code
  execution. Use when user mentions "E2B", "code sandbox", "run code in sandbox",
  or "E2B sandbox".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name E2B_API_KEY` or `zero doctor check-connector --url https://api.e2b.app/sandboxes --method GET`

## How to Use

> Official docs: `https://e2b.dev/docs/api-reference`

### 1. Create a Sandbox

Create a new sandbox (ephemeral VM). The default template is a Debian-based image with common runtimes.

Write `/tmp/e2b_create.json`:
```json
{
  "templateID": "base"
}
```

```bash
curl -s -X POST "https://api.e2b.app/sandboxes" --header "Content-Type: application/json" --header "X-API-Key: $E2B_API_KEY" -d @/tmp/e2b_create.json
```

**Response includes:**
- `sandboxID` — Use this in all subsequent requests
- `templateID` — Template the sandbox was created from
- `alias` — Human-readable alias
- `clientID` — Client identifier

**With a longer timeout (seconds, default 300):**

Write `/tmp/e2b_create.json`:
```json
{
  "templateID": "base",
  "timeout": 900
}
```

```bash
curl -s -X POST "https://api.e2b.app/sandboxes" --header "Content-Type: application/json" --header "X-API-Key: $E2B_API_KEY" -d @/tmp/e2b_create.json
```

**With metadata tags:**

Write `/tmp/e2b_create.json`:
```json
{
  "templateID": "base",
  "metadata": {
    "purpose": "code-review",
    "user": "agent"
  }
}
```

```bash
curl -s -X POST "https://api.e2b.app/sandboxes" --header "Content-Type: application/json" --header "X-API-Key: $E2B_API_KEY" -d @/tmp/e2b_create.json
```

### 2. List Running Sandboxes

List all currently running sandboxes for your team:

```bash
curl -s -X GET "https://api.e2b.app/sandboxes" --header "X-API-Key: $E2B_API_KEY"
```

### 3. Get Sandbox Status

Get the status and details of a specific sandbox. Replace `<sandbox-id>` with the actual `sandboxID` from the create response:

```bash
curl -s -X GET "https://api.e2b.app/sandboxes/<sandbox-id>" --header "X-API-Key: $E2B_API_KEY"
```

### 4. Refresh Sandbox Timeout

Extend the running time of a sandbox before it auto-terminates. Replace `<sandbox-id>` with the actual sandbox ID:

Write `/tmp/e2b_refresh.json`:
```json
{
  "timeout": 300
}
```

```bash
curl -s -X POST "https://api.e2b.app/sandboxes/<sandbox-id>/refreshes" --header "Content-Type: application/json" --header "X-API-Key: $E2B_API_KEY" -d @/tmp/e2b_refresh.json
```

### 5. Kill a Sandbox

Terminate a sandbox immediately. Replace `<sandbox-id>` with the actual sandbox ID:

```bash
curl -s -X DELETE "https://api.e2b.app/sandboxes/<sandbox-id>" --header "X-API-Key: $E2B_API_KEY"
```

### 6. List Available Templates

List all sandbox templates available for your team:

```bash
curl -s -X GET "https://api.e2b.app/templates" --header "X-API-Key: $E2B_API_KEY"
```

**Response includes:**
- `templateID` — Use this as `templateID` when creating sandboxes
- `aliases` — Human-readable names (e.g. `base`, `python`, `nodejs`)
- `buildID` — Current build identifier

## Prerequisites

Connect the **E2B** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name E2B_API_KEY` or `zero doctor check-connector --url https://api.e2b.app/sandboxes --method GET`

## Guidelines

1. **Sandbox lifecycle**: Sandboxes are ephemeral and auto-terminate after the timeout (default 5 minutes). Always capture the `sandboxID` from the create response for subsequent operations.
2. **Timeout management**: Use the refresh endpoint to extend sandbox life if your task runs longer than expected.
3. **Template selection**: Use `base` for general-purpose sandboxes. List templates first to see all available options including specialized Python/Node.js environments.
4. **Metadata**: Tag sandboxes with metadata to track purpose, user, or task — useful for auditing and cleanup.
5. **Cleanup**: Always delete sandboxes when done to avoid unnecessary charges and hitting concurrency limits.
6. **Concurrency**: Check your plan's sandbox concurrency limit before spawning many sandboxes simultaneously.
