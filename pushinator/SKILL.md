---
name: pushinator
description: Pushinator API for push notifications. Use when user mentions "Pushinator",
  "push notification", "web push", or notifications.
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

Connect the **Pushinator** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## How to Use

Base URL: `https://api.pushinator.com`

**Required headers:**
- `Authorization: Bearer $PUSHINATOR_TOKEN`
- `Content-Type: application/json`

---

### 1. Send a Push Notification

Send a notification to all subscribers of a channel.

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "<your-channel-uuid>",
  "content": "Hello from Pushinator!"
}
```

Replace `<your-channel-uuid>` with your actual channel UUID, then run:

```bash
curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer $PUSHINATOR_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json
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

Notify when a deployment completes.

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "<your-channel-uuid>",
  "content": "Deployment complete! Project deployed to production."
}
```

Replace `<your-channel-uuid>` with your actual channel UUID, then run:

```bash
curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer $PUSHINATOR_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json
```

---

### 3. Send Alert with Emoji

Include emojis for visual distinction.

Write to `/tmp/pushinator_request.json`:

```json
{
  "channel_id": "<your-channel-uuid>",
  "content": "Build failed! Check the CI logs."
}
```

Replace `<your-channel-uuid>` with your actual channel UUID, then run:

```bash
curl -s -X POST "https://api.pushinator.com/api/v2/notifications/send" \
  --header "Authorization: Bearer $PUSHINATOR_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/pushinator_request.json
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
