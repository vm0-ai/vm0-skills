---
name: line
description: LINE API for messaging. Use when user mentions "LINE", "LINE message",
  "LINE bot", or asks about LINE platform.
vm0_secrets:
  - LINE_TOKEN
---

# LINE Messaging API

Use the LINE Messaging API via direct `curl` calls to **send messages, manage users, configure rich menus, set up webhooks, and access analytics** for LINE Official Accounts and bots.

> Official docs: `https://developers.line.biz/en/reference/messaging-api/`

---

## When to Use

Use this skill when you need to:

- **Send messages** to users via push, reply, multicast, or broadcast
- **Retrieve user profiles** and follower information
- **Manage rich menus** for interactive bot interfaces
- **Configure webhooks** for receiving events from LINE
- **Access analytics** including message delivery stats and follower demographics

---

## Prerequisites

1. Log in to the [LINE Developers Console](https://developers.line.biz/console)
2. Select your provider and channel (or create a new Messaging API channel)
3. Go to the **Messaging API** tab
4. Issue or copy the **Channel access token (long-lived)**

```bash
export LINE_TOKEN="your-channel-access-token"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `LINE_TOKEN` set. Authentication uses Bearer token in the Authorization header.

### Base URL

- `https://api.line.me`

---

### 1. Get Bot Info

Retrieve information about the bot associated with the channel access token.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/info" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 2. Get User Profile

Retrieve a user's display name, profile image, and status message. Replace `USER_ID` with the actual user ID.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/profile/USER_ID" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 3. Get Follower IDs

Retrieve a list of user IDs that have added the bot as a friend. Supports pagination with `start` parameter.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/followers/ids?limit=100" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

For pagination, use the `next` token from the response:

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/followers/ids?limit=100&start=CONTINUATION_TOKEN" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 4. Send Push Message

Send a message to a specific user. Replace `USER_ID` with the target user ID.

Write to `/tmp/line_request.json`:

```json
{
  "to": "USER_ID",
  "messages": [
    {
      "type": "text",
      "text": "Hello from the LINE bot!"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/push" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 5. Send Reply Message

Reply to a user event using a reply token received from a webhook event. Reply tokens expire after a short time.

Write to `/tmp/line_request.json`:

```json
{
  "replyToken": "REPLY_TOKEN",
  "messages": [
    {
      "type": "text",
      "text": "Thanks for your message!"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/reply" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 6. Send Multicast Message

Send the same message to multiple users at once (up to 500 user IDs).

Write to `/tmp/line_request.json`:

```json
{
  "to": ["USER_ID_1", "USER_ID_2", "USER_ID_3"],
  "messages": [
    {
      "type": "text",
      "text": "This is a multicast message!"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/multicast" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 7. Send Broadcast Message

Send a message to all users who have added the bot as a friend.

Write to `/tmp/line_request.json`:

```json
{
  "messages": [
    {
      "type": "text",
      "text": "This broadcast goes to all followers!"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/broadcast" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 8. Check Message Quota

Get the monthly message quota for the LINE Official Account.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/message/quota" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

Check how many messages have been sent this month:

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/message/quota/consumption" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 9. Send Image Message

Send an image to a user.

Write to `/tmp/line_request.json`:

```json
{
  "to": "USER_ID",
  "messages": [
    {
      "type": "image",
      "originalContentUrl": "https://example.com/image.jpg",
      "previewImageUrl": "https://example.com/image_preview.jpg"
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/push" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 10. Send Template Message (Buttons)

Send a button template message with actions.

Write to `/tmp/line_request.json`:

```json
{
  "to": "USER_ID",
  "messages": [
    {
      "type": "template",
      "altText": "Button template",
      "template": {
        "type": "buttons",
        "title": "Menu",
        "text": "Please select an option",
        "actions": [
          {
            "type": "message",
            "label": "Option 1",
            "text": "option1"
          },
          {
            "type": "uri",
            "label": "Visit Website",
            "uri": "https://example.com"
          }
        ]
      }
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/message/push" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 11. Get Webhook Endpoint

Retrieve the current webhook URL configuration.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/channel/webhook/endpoint" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 12. Set Webhook Endpoint

Configure the webhook URL where LINE sends events.

```bash
bash -c 'curl -s -X PUT "https://api.line.me/v2/bot/channel/webhook/endpoint" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d '"'"'{"endpoint":"https://example.com/webhook"}'"'"'' | jq .
```

---

### 13. Test Webhook

Test the webhook endpoint connectivity.

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/channel/webhook/test" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d '"'"'{"endpoint":"https://example.com/webhook"}'"'"'' | jq .
```

---

### 14. List Rich Menus

Get all rich menus created for the bot.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/richmenu/list" --header "Authorization: Bearer $LINE_TOKEN"' | jq '.richmenus[] | {richMenuId, name, size}'
```

---

### 15. Create Rich Menu

Create a new rich menu.

Write to `/tmp/line_request.json`:

```json
{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": false,
  "name": "Main Menu",
  "chatBarText": "Menu",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1250,
        "height": 1686
      },
      "action": {
        "type": "message",
        "text": "Left button tapped"
      }
    },
    {
      "bounds": {
        "x": 1250,
        "y": 0,
        "width": 1250,
        "height": 1686
      },
      "action": {
        "type": "message",
        "text": "Right button tapped"
      }
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.line.me/v2/bot/richmenu" --header "Content-Type: application/json" --header "Authorization: Bearer $LINE_TOKEN" -d @/tmp/line_request.json' | jq .
```

---

### 16. Delete Rich Menu

Delete a rich menu by ID.

```bash
bash -c 'curl -s -X DELETE "https://api.line.me/v2/bot/richmenu/RICH_MENU_ID" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 17. Get Message Delivery Statistics

Get the number of messages delivered on a specific date (format: `yyyyMMdd`).

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/insight/message/delivery?date=20260301" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 18. Get Follower Demographics

Retrieve demographic data about followers (gender, age, area distribution).

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/insight/demographic" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 19. Get Group Summary

Retrieve information about a group chat the bot is a member of.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/group/GROUP_ID/summary" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

### 20. Get Group Member Profile

Retrieve the profile of a specific member in a group chat.

```bash
bash -c 'curl -s "https://api.line.me/v2/bot/group/GROUP_ID/member/USER_ID" --header "Authorization: Bearer $LINE_TOKEN"' | jq .
```

---

## Message Types

LINE supports multiple message types in the `messages` array:

| Type | Description |
|------|-------------|
| `text` | Plain text message |
| `image` | Image with original and preview URLs |
| `video` | Video with original and preview URLs |
| `audio` | Audio file with duration |
| `location` | Location with title, address, and coordinates |
| `sticker` | LINE sticker with package and sticker IDs |
| `template` | Interactive template (buttons, confirm, carousel) |
| `flex` | Flexible layout message using Flex Message JSON |

---

## Guidelines

1. **Message limits**: Push messages count toward your monthly quota. Free plans have limited push messages. Reply messages are free
2. **Reply tokens**: Reply tokens from webhook events expire quickly. Process and reply promptly
3. **Multicast limit**: Multicast supports up to 500 user IDs per request
4. **Rich menu images**: After creating a rich menu, upload an image separately using the content upload endpoint
5. **User IDs**: User IDs are channel-specific. The same user has different IDs across different channels
6. **Message objects**: Each request can contain up to 5 message objects in the `messages` array
7. **HTTPS required**: All image, video, and audio URLs must use HTTPS
8. **Webhook verification**: LINE sends a signature in the `x-line-signature` header for webhook verification using HMAC-SHA256
