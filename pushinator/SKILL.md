---
name: pushinator
description: Pushinator push notification API via curl. Use this skill to send push notifications to mobile devices.
vm0_env:
  - PUSHINATOR_API_KEY
---

# Pushinator API

Use the Pushinator API via direct `curl` calls to **send push notifications** to mobile devices.

> Official docs: `https://pushinator.com/api`

---

## When to Use

Use this skill when you need to:

- **Send push notifications** to mobile devices
- **Alert users** about events, deployments, or updates
- **Integrate notifications** into CI/CD pipelines
- **Notify yourself** when long-running tasks complete

---

## Prerequisites

1. Sign up at [Pushinator](https://pushinator.com/)
2. Download the Pushinator app on your mobile device
3. Create a channel in the [Console](https://console.pushinator.com/)
4. Generate an API token at [Tokens](https://console.pushinator.com/tokens)
5. Store credentials in environment variables

```bash
export PUSHINATOR_API_KEY="your-api-token"
```

### Pricing

- **Free**: 3 devices, 200 notifications/month
- **Pro** ($9.99/mo): 20 devices, 2,000 notifications/month
- **Scale** ($29.99/mo): 50 devices, 20,000 notifications/month

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## How to Use

Base URL: `https://api.pushinator.com`

**Required headers:**
- `Authorization: Bearer ${PUSHINATOR_API_KEY}`
- `Content-Type: application/json`

---

### 1. Send a Push Notification

Send a notification to all subscribers of a channel:

```bash
CHANNEL_ID="your-channel-uuid"
```

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "YOUR_CHANNEL_ID",
  "content": "Hello from Pushinator!"
}
```

Then run:

```bash
sed -i '' "s/YOUR_CHANNEL_ID/${CHANNEL_ID}/" /tmp/pushinator_request.json

curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer ${PUSHINATOR_API_KEY}" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json | jq .
```

**Response:**
```json
{
  "success": true,
  "message": "Notification created and being sent to subscribers"
}
```

---

### 2. Send Deployment Notification

Notify when a deployment completes:

```bash
CHANNEL_ID="your-channel-uuid"
```

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "YOUR_CHANNEL_ID",
  "content": "Deployment complete! Project deployed to production."
}
```

Then run:

```bash
sed -i '' "s/YOUR_CHANNEL_ID/${CHANNEL_ID}/" /tmp/pushinator_request.json

curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer ${PUSHINATOR_API_KEY}" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json | jq .
```

---

### 3. Send Alert with Emoji

Include emojis for visual distinction:

```bash
CHANNEL_ID="your-channel-uuid"
```

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "YOUR_CHANNEL_ID",
  "content": "Build failed! Check the CI logs."
}
```

Then run:

```bash
sed -i '' "s/YOUR_CHANNEL_ID/${CHANNEL_ID}/" /tmp/pushinator_request.json

curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer ${PUSHINATOR_API_KEY}" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json | jq .
```

---

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel_id` | string | Yes | UUID of the notification channel |
| `content` | string | Yes | Notification message text |

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 2xx | Success - notification sent |
| 4xx | Invalid request or missing parameters |
| 5xx | Server error - retry recommended |

---

## Guidelines

1. **Keep messages concise**: Push notifications have limited display space
2. **Use channels for topics**: Create separate channels for different notification types
3. **Rate limiting**: Stay within your plan's monthly notification limit
4. **Include context**: Make notifications actionable with relevant details
