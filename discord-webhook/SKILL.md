---
name: discord-webhook
description: Discord Webhook API via curl. Use this skill to send messages, embeds, and files to Discord channels without a bot.
vm0_env:
  - DISCORD_WEBHOOK_URL
---

# Discord Webhook

Use Discord Webhooks via direct `curl` calls to **send messages to Discord channels** without setting up a bot.

> Official docs: `https://discord.com/developers/docs/resources/webhook`

---

## When to Use

Use this skill when you need to:

- **Send notifications** to Discord channels
- **Post alerts** from CI/CD pipelines
- **Share updates** with rich embeds
- **Upload files** to channels
- **Simple integrations** without bot complexity

---

## Prerequisites

1. In Discord, go to Server Settings → Integrations → Webhooks
2. Click "New Webhook"
3. Choose a name and target channel
4. Click "Copy Webhook URL"

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/1234567890/abcdefg..."
```

**Security:** Never expose webhook URLs publicly - they require no authentication.

---


> **Important:** When piping `curl` output to `jq`, wrap the command in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" | jq .'
> ```

## How to Use

All examples below assume you have `DISCORD_WEBHOOK_URL` set.

---

### 1. Send Simple Message

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "Hello from webhook!"}'
```

---

### 2. Send with Custom Username and Avatar

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "Alert!", "username": "Alert Bot", "avatar_url": "https://i.imgur.com/4M34hi2.png"}'
```

---

### 3. Send Rich Embed

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"embeds": [{"title": "Deployment Complete", "description": "Version 1.2.3 deployed to production", "color": 5763719, "fields": [{"name": "Environment", "value": "Production", "inline": true}, {"name": "Status", "value": "Success", "inline": true}], "timestamp": "2025-01-01T12:00:00.000Z"}]}'
```

**Common colors (decimal):**
- Green: `5763719`
- Red: `15548997`
- Blue: `5793266`
- Yellow: `16776960`
- Orange: `16744192`

---

### 4. Send Error Alert

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"embeds": [{"title": "Error Alert", "description": "Database connection failed", "color": 15548997, "fields": [{"name": "Service", "value": "api-server"}, {"name": "Error", "value": "Connection timeout"}], "footer": {"text": "Monitor"}}]}'
```

---

### 5. Send File Attachment

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -F "file1=@screenshot.png" -F 'payload_json={"content": "Screenshot attached"}'
```

---

### 6. Send Multiple Files

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -F "file1=@error.log" -F "file2=@debug.log" -F 'payload_json={"content": "Log files attached"}'
```

---

### 7. Send Multiple Embeds

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"embeds": [{"title": "Build Started", "color": 16776960}, {"title": "Tests Passed", "color": 5763719}, {"title": "Deployed", "color": 5793266}]}'
```

---

### 8. Send with Mention

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "<@USER_ID> Check this out!", "allowed_mentions": {"users": ["USER_ID"]}}'
```

Replace `USER_ID` with actual Discord user ID.

---

### 9. Send Silent Message (No Notification)

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "Silent update", "flags": 4096}'
```

---

### 10. CI/CD Pipeline Notification

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"username": "GitHub Actions", "embeds": [{"title": "Pipeline Status", "color": 5763719, "fields": [{"name": "Repository", "value": "myorg/myrepo", "inline": true}, {"name": "Branch", "value": "main", "inline": true}, {"name": "Commit", "value": "abc1234", "inline": true}, {"name": "Status", "value": "✅ Success"}], "timestamp": "2025-01-01T12:00:00.000Z"}]}'
```

---

## Embed Structure

```json
{
  "title": "Title text",
  "description": "Description text",
  "url": "https://example.com",
  "color": 5763719,
  "fields": [
  {"name": "Field 1", "value": "Value 1", "inline": true}
  ],
  "author": {"name": "Author", "icon_url": "https://..."},
  "footer": {"text": "Footer text"},
  "thumbnail": {"url": "https://..."},
  "image": {"url": "https://..."},
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## Guidelines

1. **Rate limits**: 30 requests per 60 seconds per webhook
2. **Message limit**: 2000 characters for content
3. **Embed limits**: Max 10 embeds, 6000 total characters
4. **File limits**: Max 8MB per file (50MB with Nitro boost)
5. **Security**: Treat webhook URLs like passwords
