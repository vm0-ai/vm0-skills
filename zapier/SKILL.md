---
name: zapier
description: Zapier API for workflow automation. Use when user mentions "Zapier",
  "zap", "automation", or asks about connecting apps.
vm0_secrets:
  - ZAPIER_TOKEN
---

# Zapier AI Actions API

Use the Zapier AI Actions API via direct `curl` calls to **execute pre-configured actions across 6000+ apps** using natural language instructions. AI Actions removes the complexity of building integrations by providing a single universal API that handles authentication, API calls, and edge cases for supported apps.

> Official docs: `https://actions.zapier.com/docs/using-the-api`

---

## When to Use

Use this skill when you need to:

- **Execute automated actions** across apps like Gmail, Slack, Google Sheets, Salesforce, and thousands more
- **Trigger workflows** using natural language instructions without building direct integrations
- **Preview action results** before executing them
- **List and manage configured AI actions** available to your account

---

## Prerequisites

1. Sign up or log in at [Zapier](https://zapier.com)
2. Go to [AI Actions](https://actions.zapier.com/) and configure the actions you want to expose
3. Click **Manage Actions** to create and enable actions (e.g., "Gmail: Send Email", "Slack: Send Message")
4. Get your API key from the [credentials page](https://actions.zapier.com/credentials/)

```bash
export ZAPIER_TOKEN="your-zapier-api-key"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `ZAPIER_TOKEN` set. Authentication uses the `x-api-key` header.

---

### 1. Check API Key

Verify that your API key is valid.

```bash
bash -c 'curl -s "https://actions.zapier.com/api/v2/check/" --header "x-api-key: $ZAPIER_TOKEN"' | jq .
```

---

### 2. List Exposed Actions

Retrieve all actions you have configured and exposed in your Zapier AI Actions dashboard.

```bash
bash -c 'curl -s "https://actions.zapier.com/api/v1/exposed/" --header "x-api-key: $ZAPIER_TOKEN"' | jq '.results[] | {id, description, params}'
```

---

### 3. Execute an AI Action

Execute a configured action using natural language instructions. Replace `ACTION_ID` with the action ID from the list above.

```bash
bash -c 'curl -s -X POST "https://actions.zapier.com/api/v2/ai-actions/ACTION_ID/execute/" --header "Content-Type: application/json" --header "x-api-key: $ZAPIER_TOKEN" -d '"'"'{"instructions": "Send a message saying hello to the #general channel"}'"'"'' | jq .
```

---

### 4. Execute with Parameter Hints

Supply parameter hints to guide the AI in filling action fields. Supported modes: `locked` (use exact value), `guess` (AI matches text), `choose_from` (AI selects from list), `ignored` (skip parameter).

Write to `/tmp/zapier_request.json`:

```json
{
  "instructions": "Send an email about the weekly report",
  "params": {
    "to": {
      "mode": "locked",
      "value": "team@example.com"
    },
    "subject": {
      "mode": "locked",
      "value": "Weekly Report"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://actions.zapier.com/api/v2/ai-actions/ACTION_ID/execute/" --header "Content-Type: application/json" --header "x-api-key: $ZAPIER_TOKEN" -d @/tmp/zapier_request.json' | jq .
```

---

### 5. Preview an Action (Dry Run)

Preview what the action would do without actually executing it. Add `preview_only=true` as a query parameter.

```bash
bash -c 'curl -s -X POST "https://actions.zapier.com/api/v2/ai-actions/ACTION_ID/execute/?preview_only=true" --header "Content-Type: application/json" --header "x-api-key: $ZAPIER_TOKEN" -d '"'"'{"instructions": "Create a new row in the Sales spreadsheet with name John and amount 500"}'"'"'' | jq .
```

---

### 6. Execute a V1 Exposed Action

Execute an action using the V1 endpoint. Replace `ACTION_ID` with the exposed action ID.

```bash
bash -c 'curl -s -X POST "https://actions.zapier.com/api/v1/dynamic/exposed/ACTION_ID/execute/" --header "Content-Type: application/json" --header "x-api-key: $ZAPIER_TOKEN" -d '"'"'{"instructions": "Send a Slack message to #dev saying deployment complete"}'"'"'' | jq .
```

---

## Guidelines

1. **Configure actions first**: Before using the API, you must configure and enable actions in the [Zapier AI Actions dashboard](https://actions.zapier.com/). The API can only execute actions you have set up
2. **Use natural language**: The `instructions` field accepts plain English descriptions of what you want to do. The AI interprets and maps instructions to the correct action parameters
3. **Parameter modes**: Use `locked` mode when you know the exact value, `guess` when the AI should match text to available options, and `choose_from` to provide a list of valid IDs
4. **Preview before executing**: Use `preview_only=true` to verify the AI correctly interprets your instructions before running the action
5. **Response statuses**: Check the `status` field in responses - values are `success`, `error`, `empty`, or `preview`
6. **Rate limits**: Zapier enforces rate limits on API calls. Implement backoff if you receive HTTP 429 responses
7. **Action IDs**: Each configured action has a unique ID. Use the list endpoint to discover available action IDs
