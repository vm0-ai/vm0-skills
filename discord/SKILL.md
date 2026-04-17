---
name: discord
description: Discord API for servers and messages. Use when user mentions "Discord",
  "discord.com", "discord.gg", shares a Discord link, "Discord server", or asks about
  Discord bots.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DISCORD_BOT_TOKEN` or `zero doctor check-connector --url https://discord.com/api/v10/users/@me --method GET`

## How to Use

Base URL: `https://discord.com/api/v10`

Authorization header: `Authorization: Bot YOUR_TOKEN`

### 1. Get Current Bot User

```bash
curl -s "https://discord.com/api/v10/users/@me" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '{id, username, discriminator}'
```

### 2. Send Message to Channel

Write to `/tmp/discord_request.json`:

```json
{
  "content": "Hello from bot!"
}
```

Then run (replace `<your-channel-id>` with the actual channel ID):

```bash
curl -s -X POST "https://discord.com/api/v10/channels/<your-channel-id>/messages" -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Type: application/json" -d @/tmp/discord_request.json
```

### 3. Send Embed Message

Write to `/tmp/discord_request.json`:

```json
{
  "embeds": [
    {
      "title": "Bot Message",
      "description": "This is from the bot API",
      "color": 5793266
    }
  ]
}
```

Then run (replace `<your-channel-id>` with the actual channel ID):

```bash
curl -s -X POST "https://discord.com/api/v10/channels/<your-channel-id>/messages" -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Type: application/json" -d @/tmp/discord_request.json
```

### 4. Get Channel Info

Replace `<your-channel-id>` with the actual channel ID:

```bash
curl -s "https://discord.com/api/v10/channels/<your-channel-id>" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '{id, name, type, guild_id}'
```

### 5. Get Channel Messages

Replace `<your-channel-id>` with the actual channel ID:

```bash
curl -s "https://discord.com/api/v10/channels/<your-channel-id>/messages?limit=10" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '.[] | {id, author: .author.username, content}'
```

### 6. Get Specific Message

Replace `<your-channel-id>` and `<your-message-id>` with the actual IDs:

```bash
curl -s "https://discord.com/api/v10/channels/<your-channel-id>/messages/<your-message-id>" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '{id, content, author: .author.username}'
```

### 7. Delete Message

Replace `<your-channel-id>` and `<your-message-id>` with the actual IDs:

```bash
curl -s -X DELETE "https://discord.com/api/v10/channels/<your-channel-id>/messages/<your-message-id>" -H "Authorization: Bot $DISCORD_BOT_TOKEN"
```

### 8. Add Reaction

Replace `<your-channel-id>` and `<your-message-id>` with the actual IDs:

```bash
curl -s -X PUT "https://discord.com/api/v10/channels/<your-channel-id>/messages/<your-message-id>/reactions/%F0%9F%91%8D/@me" -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Length: 0"
```

Note: Emoji must be URL encoded (👍 = `%F0%9F%91%8D`)

### 9. Get Guild (Server) Info

Replace `<your-guild-id>` with the actual guild ID:

```bash
curl -s "https://discord.com/api/v10/guilds/<your-guild-id>" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '{id, name, member_count, owner_id}'
```

### 10. List Guild Channels

Replace `<your-guild-id>` with the actual guild ID:

```bash
curl -s "https://discord.com/api/v10/guilds/<your-guild-id>/channels" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '.[] | {id, name, type}'
```

### 11. Get Guild Members

Replace `<your-guild-id>` with the actual guild ID:

```bash
curl -s "https://discord.com/api/v10/guilds/<your-guild-id>/members?limit=10" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '.[] | {user: .user.username, nick, joined_at}'
```

### 12. Get Guild Roles

Replace `<your-guild-id>` with the actual guild ID:

```bash
curl -s "https://discord.com/api/v10/guilds/<your-guild-id>/roles" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '.[] | {id, name, color, position}'
```

### 13. Create Webhook

Write to `/tmp/discord_request.json`:

```json
{
  "name": "My Webhook"
}
```

Then run (replace `<your-channel-id>` with the actual channel ID):

```bash
curl -s -X POST "https://discord.com/api/v10/channels/<your-channel-id>/webhooks" -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Type: application/json" -d @/tmp/discord_request.json | jq '{id, token, url: "https://discord.com/api/webhooks/\(.id)/\(.token)"}'
```

### 14. List Channel Webhooks

Replace `<your-channel-id>` with the actual channel ID:

```bash
curl -s "https://discord.com/api/v10/channels/<your-channel-id>/webhooks" -H "Authorization: Bot $DISCORD_BOT_TOKEN" | jq '.[] | {id, name, token}'
```

### 15. Create Text Channel

Write to `/tmp/discord_request.json`:

```json
{
  "name": "new-channel",
  "type": 0
}
```

Then run (replace `<your-guild-id>` with the actual guild ID):

```bash
curl -s -X POST "https://discord.com/api/v10/guilds/<your-guild-id>/channels" -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Type: application/json" -d @/tmp/discord_request.json | jq '{id, name}'
```

## Channel Types

| Type | Description |
|------|-------------|
| 0 | Text channel |
| 2 | Voice channel |
| 4 | Category |
| 5 | Announcement |
| 13 | Stage |
| 15 | Forum |

## Guidelines

1. **Rate limits**: Check `X-RateLimit-*` headers; implement backoff
2. **Token security**: Never expose bot tokens
3. **Permissions**: Bot needs appropriate permissions for each action
4. **Intents**: Enable required intents in Developer Portal
5. **API version**: Use `/v10` for latest stable API
