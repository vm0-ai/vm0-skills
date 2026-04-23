---
name: browser-use
description: Browser Use Cloud API for AI-powered browser automation. Use when user mentions "Browser Use", "browser automation", "web task", "AI agent browser", "run browser task", or "automated browser session".
---

# Browser Use

Browser Use Cloud runs AI agents in hosted browsers to complete web tasks. You submit a natural-language task prompt; the agent navigates the browser, interacts with pages, and returns a result.

> Official docs: `https://docs.browser-use.com/cloud/api-reference`

---

## When to Use

Use this skill when you need to:

- Run an AI agent to complete a web task (e.g. "search for X and return results")
- Automate multi-step browser interactions via natural language
- Check task status or retrieve results from a completed browser session
- View a live stream of an agent working in a browser
- Manage browser sessions and billing

---

## Prerequisites

Connect the **Browser Use** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name BROWSER_USE_TOKEN` or `zero doctor check-connector --url https://api.browser-use.com/api/v2/tasks --method GET`

---

## How to Use

### 1. Run a Task

Submit a natural-language task. The agent will open a browser and complete it.

Write to `/tmp/browser_use_task.json`:

```json
{
  "task": "Search for the top Hacker News post and return the title and URL."
}
```

```bash
curl -s -X POST "https://api.browser-use.com/api/v2/tasks" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN" --header "Content-Type: application/json" -d @/tmp/browser_use_task.json
```

Returns `{"id": "<task-id>", "sessionId": "<session-id>"}`.

### 2. Get Task Status and Result

Poll until `status` is `"finished"` or `"failed"`. The `output` field contains the agent's result.

```bash
curl -s "https://api.browser-use.com/api/v2/tasks/<task-id>" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN"
```

Task `status` values: `created`, `running`, `paused`, `finished`, `failed`, `stopped`.

### 3. Watch a Live Session

Get the live browser stream URL from the session.

```bash
curl -s "https://api.browser-use.com/api/v2/sessions/<session-id>" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN"
```

The response includes `"liveUrl"` — open it in a browser to watch the agent in real time.

### 4. Stop a Session

```bash
curl -s -X PATCH "https://api.browser-use.com/api/v2/sessions/<session-id>" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN" --header "Content-Type: application/json" -d '{"action": "stop"}'
```

### 5. List Tasks

```bash
curl -s "https://api.browser-use.com/api/v2/tasks" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN"
```

Optional query params: `pageSize`, `pageNumber`, `sessionId`, `status`.

### 6. Run a Task with Advanced Settings

Customize the model, timeouts, and browser behavior.

Write to `/tmp/browser_use_task.json`:

```json
{
  "task": "Go to linkedin.com and find the CEO of Anthropic.",
  "browserSettings": {
    "viewport": {
      "width": 1280,
      "height": 800
    }
  },
  "maxSteps": 30,
  "useVision": true
}
```

```bash
curl -s -X POST "https://api.browser-use.com/api/v2/tasks" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN" --header "Content-Type: application/json" -d @/tmp/browser_use_task.json
```

### 7. Get Account Billing

Check credit balances and plan information.

```bash
curl -s "https://api.browser-use.com/api/v2/billing/account" --header "X-Browser-Use-API-Key: $BROWSER_USE_TOKEN"
```

Returns `monthlyCreditsBalanceUsd`, `additionalCreditsBalanceUsd`, `totalCreditsBalanceUsd`, and plan details.

---

## Guidelines

1. **Poll for results**: Tasks are async — poll `GET /api/v2/tasks/<task-id>` until `status` is `finished` or `failed`.
2. **Sessions persist**: After a task finishes, the session stays open. Stop it explicitly with PATCH if you don't need it.
3. **Task writing**: Clear, specific task prompts produce better results. Include the exact URL if applicable.
4. **Credits**: Each task consumes credits. Check balance via the billing endpoint before running large batches.
5. **Session limit**: Sessions are capped at 15 minutes of total runtime.
