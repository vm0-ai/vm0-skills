---
name: discord
description: Discord API via curl. Use this skill to send messages via webhooks, interact with channels, and manage Discord bots.
vm0_env:
  - DISCORD_BOT_TOKEN
  - DISCORD_WEBHOOK_URL
---

# Discord API

Use the Discord API via direct `curl` calls to **send messages, manage channels, and automate Discord interactions**.

> Official docs: `https://discord.com/developers/docs`

---

## When to Use

Use this skill when you need to:

- **Send messages** to Discord channels via webhooks
- **Send notifications** with embeds and attachments
- **Manage channels** (create, edit, delete)
- **Get server information** (guilds, members, roles)
- **Interact with users** via bot commands

---

## Prerequisites

### Option 1: Webhook (Simple, No Bot Required)

1. In Discord, go to Server Settings → Integrations → Webhooks
2. Click "New Webhook" and configure name/channel
3. Copy the webhook URL

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/xxxx/yyyy"
```

### Option 2: Bot Token (Full API Access)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and add a Bot
3. Copy the bot token
4. Invite bot to your server with appropriate permissions

```bash
export DISCORD_BOT_TOKEN="your-bot-token"
```

**Authorization header format:** `Authorization: Bot YOUR_TOKEN`

---

## How to Use

Base URL: `https://discord.com/api/v10`

---

## Webhook Examples

Webhooks are the simplest way to send messages - no bot setup required.

### 1. Send Simple Message

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "Hello from webhook!"}' | jq '.'
```

---

### 2. Send Message with Username Override

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"content": "Alert message", "username": "Alert Bot", "avatar_url": "https://i.imgur.com/4M34hi2.png"}' | jq '.'
```

---

### 3. Send Rich Embed

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"embeds": [{"title": "Status Update", "description": "Deployment completed successfully", "color": 5763719, "fields": [{"name": "Environment", "value": "Production", "inline": true}, {"name": "Version", "value": "v1.2.3", "inline": true}], "footer": {"text": "Deployed at"}, "timestamp": "2025-01-01T12:00:00.000Z"}]}' | jq '.'
```

**Embed colors:** Use decimal values (green: 5763719, red: 15548997, blue: 5793266, yellow: 16776960)

---

### 4. Send File Attachment

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -F "file1=@screenshot.png" -F 'payload_json={"content": "Here is the screenshot"}' | jq '.'
```

---

### 5. Send Multiple Embeds

```bash
curl -s -X POST "${DISCORD_WEBHOOK_URL}" -H "Content-Type: application/json" -d '{"embeds": [{"title": "First", "description": "First embed", "color": 5763719}, {"title": "Second", "description": "Second embed", "color": 15548997}]}' | jq '.'
```

---

## Bot API Examples

Bot token required for these operations.

### 6. Send Message to Channel

```bash
CHANNEL_ID="your-channel-id"

curl -s -X POST "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" -H "Content-Type: application/json" -d '{"content": "Hello from bot!"}' | jq '{id, content, timestamp}'
```

---

### 7. Get Channel Info

```bash
CHANNEL_ID="your-channel-id"

curl -s "https://discord.com/api/v10/channels/${CHANNEL_ID}" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '{id, name, type}'
```

---

### 8. Get Channel Messages

```bash
CHANNEL_ID="your-channel-id"

curl -s "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '.[] | {id, author: .author.username, content}'
```

---

### 9. Get Guild (Server) Info

```bash
GUILD_ID="your-guild-id"

curl -s "https://discord.com/api/v10/guilds/${GUILD_ID}" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '{id, name, member_count, owner_id}'
```

---

### 10. List Guild Channels

```bash
GUILD_ID="your-guild-id"

curl -s "https://discord.com/api/v10/guilds/${GUILD_ID}/channels" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '.[] | {id, name, type}'
```

---

### 11. Get Guild Members

```bash
GUILD_ID="your-guild-id"

curl -s "https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=10" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '.[] | {user: .user.username, nick, joined_at}'
```

---

### 12. Create Webhook

```bash
CHANNEL_ID="your-channel-id"

curl -s -X POST "https://discord.com/api/v10/channels/${CHANNEL_ID}/webhooks" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" -H "Content-Type: application/json" -d '{"name": "My Webhook"}' | jq '{id, token, url: "https://discord.com/api/webhooks/\(.id)/\(.token)"}'
```

---

### 13. Add Reaction to Message

```bash
CHANNEL_ID="your-channel-id"
MESSAGE_ID="your-message-id"
EMOJI="👍"

curl -s -X PUT "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${MESSAGE_ID}/reactions/${EMOJI}/@me" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" -H "Content-Length: 0"
```

---

### 14. Delete Message

```bash
CHANNEL_ID="your-channel-id"
MESSAGE_ID="your-message-id"

curl -s -X DELETE "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${MESSAGE_ID}" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}"
```

---

### 15. Get Current Bot User

```bash
curl -s "https://discord.com/api/v10/users/@me" -H "Authorization: Bot ${DISCORD_BOT_TOKEN}" | jq '{id, username, discriminator}'
```

---

## Finding IDs

Enable Developer Mode in Discord:
1. User Settings → App Settings → Advanced → Developer Mode
2. Right-click any channel/user/server → Copy ID

---

## Channel Types

| Type | Description |
|------|-------------|
| 0 | Text channel |
| 2 | Voice channel |
| 4 | Category |
| 5 | Announcement channel |
| 10 | Announcement thread |
| 11 | Public thread |
| 12 | Private thread |
| 13 | Stage channel |
| 15 | Forum channel |

---

## Guidelines

1. **Rate limits**: Discord enforces rate limits; check `X-RateLimit-*` headers
2. **Webhook security**: Never expose webhook URLs publicly
3. **Bot permissions**: Ensure bot has required permissions for each operation
4. **API versioning**: Use `/v10` for latest stable API
5. **Embed limits**: Max 10 embeds per message, 6000 characters total
6. **File limits**: Max 8MB for regular users, 50MB for Nitro
