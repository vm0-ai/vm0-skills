---
name: microsoft-365
description: Microsoft Graph API for Microsoft 365, including OneDrive,
  SharePoint, Teams channels, and Teams chats. Use when user mentions
  "Microsoft 365", "OneDrive", "SharePoint", "Teams", or "Microsoft Graph".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MICROSOFT_365_TOKEN` or `zero doctor check-connector --url https://graph.microsoft.com/v1.0/me --method GET`

## How to Use

Base URL: `https://graph.microsoft.com`

All calls use `Authorization: Bearer $MICROSOFT_365_TOKEN`. `MICROSOFT_GRAPH_TOKEN` is also bound to the same OAuth access token for compatibility.

## User

### Get Current User

```bash
curl -s "https://graph.microsoft.com/v1.0/me" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '{id, displayName, userPrincipalName, mail}'
```

## OneDrive

### List Root Drive Items

```bash
curl -s "https://graph.microsoft.com/v1.0/me/drive/root/children" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, folder, file, size, webUrl}'
```

### Get Item Metadata

```bash
curl -s "https://graph.microsoft.com/v1.0/me/drive/items/<item-id>" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '{id, name, size, file, folder, webUrl}'
```

### Download File

```bash
curl -L "https://graph.microsoft.com/v1.0/me/drive/items/<item-id>/content" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" \
  -o /tmp/onedrive-download.bin
```

### Upload Small File

This works for files up to 250 MB.

```bash
curl -s -X PUT "https://graph.microsoft.com/v1.0/me/drive/root:/Uploads/report.txt:/content" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" \
  --header "Content-Type: text/plain" \
  --data-binary @/tmp/report.txt | jq '{id, name, size, webUrl}'
```

### Create Folder

```bash
curl -s -X POST "https://graph.microsoft.com/v1.0/me/drive/root/children" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{"name":"Project Files","folder":{},"@microsoft.graph.conflictBehavior":"rename"}' | jq '{id, name, webUrl}'
```

### Search Files

```bash
curl -s "https://graph.microsoft.com/v1.0/me/drive/root/search(q='report')" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, webUrl}'
```

## SharePoint

### List Sites

```bash
curl -s "https://graph.microsoft.com/v1.0/sites?search=*" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, displayName, webUrl}'
```

### Get Site by Hostname and Path

```bash
curl -s "https://graph.microsoft.com/v1.0/sites/<tenant>.sharepoint.com:/sites/<site-name>" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '{id, name, displayName, webUrl}'
```

### List Site Drives

```bash
curl -s "https://graph.microsoft.com/v1.0/sites/<site-id>/drives" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, driveType, webUrl}'
```

### List SharePoint Drive Items

```bash
curl -s "https://graph.microsoft.com/v1.0/drives/<drive-id>/root/children" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, folder, file, webUrl}'
```

### List Site Lists

```bash
curl -s "https://graph.microsoft.com/v1.0/sites/<site-id>/lists" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, name, displayName, webUrl}'
```

## Teams

### List Joined Teams

```bash
curl -s "https://graph.microsoft.com/v1.0/me/joinedTeams" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, displayName, description}'
```

### List Team Channels

```bash
curl -s "https://graph.microsoft.com/v1.0/teams/<team-id>/channels" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, displayName, description, membershipType}'
```

### List Channel Messages

```bash
curl -s "https://graph.microsoft.com/v1.0/teams/<team-id>/channels/<channel-id>/messages" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, from, createdDateTime, body}'
```

### Send Channel Message

Write to `/tmp/teams_message.json`:

```json
{
  "body": {
    "content": "Hello from Zero"
  }
}
```

```bash
curl -s -X POST "https://graph.microsoft.com/v1.0/teams/<team-id>/channels/<channel-id>/messages" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/teams_message.json | jq '{id, createdDateTime, webUrl}'
```

### List Chats

```bash
curl -s "https://graph.microsoft.com/v1.0/chats" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" | jq '.value[] | {id, topic, chatType}'
```

### Send Chat Message

```bash
curl -s -X POST "https://graph.microsoft.com/v1.0/chats/<chat-id>/messages" \
  --header "Authorization: Bearer $MICROSOFT_365_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{"body":{"content":"Hello from Zero"}}' | jq '{id, createdDateTime}'
```
