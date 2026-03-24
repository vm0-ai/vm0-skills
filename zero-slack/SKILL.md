---
name: zero-slack
description: Slack integration via vm0 API. Use when Zero agent needs to do anything
  with Slack — send messages, post notifications, interact with channels, or any
  Slack-related task through the vm0 platform.
vm0_secrets:
  - VM0_TOKEN
vm0_vars:
  - VM0_API_URL
---

# Zero Slack (vm0 Integration)

Send Slack messages from Zero agents using the vm0 integration API. This skill routes messages through vm0's Slack connector instead of calling the Slack API directly.

---

## When to Use

- Send messages to Slack channels from a Zero agent
- Post notifications or status updates to Slack
- Communicate with team members via Slack channels through vm0

## Prerequisites

1. Go to [vm0.ai](https://vm0.ai) **Settings → Connectors** and connect **Slack**.
2. Ensure `VM0_API_URL` and `VM0_TOKEN` environment variables are available.

## Sending Slack Messages

Write to `/tmp/zero_slack_request.json`:

```json
{
  "channel": "<channel-id>",
  "text": "Hello from Zero!"
}
```

```bash
curl -s -X POST "$(printenv VM0_API_URL)/api/agent/integrations/slack/message" \
  -H "Authorization: Bearer $(printenv VM0_TOKEN)" \
  -H "Content-Type: application/json" \
  -d @/tmp/zero_slack_request.json
```

## Guidelines

- Always use a valid Slack channel ID (e.g., `C1234567890`), not a channel name.
- Keep messages concise and actionable.
- Use Slack mrkdwn formatting: `*bold*`, `_italic_`, `~strike~`, `` `code` ``, `<@U123>` for mentions, `<#C123>` for channel links.
