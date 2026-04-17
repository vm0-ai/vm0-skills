---
name: slack
description: Slack API for messages and channels. Use when user mentions "Slack",
  "slack.com", shares a Slack link, "send to Slack", "Slack channel", or asks about
  workspace.
---

# Slack API

Send messages, manage channels, search content, and interact with Slack workspaces via the Web API.

> Official docs: https://docs.slack.dev/reference/methods

---

## When to Use

Use this skill when you need to:

- Send, update, schedule, and delete messages
- Read channel history and thread replies
- Create, archive, and manage channels
- Search messages, files, and content
- Upload and manage files
- List and manage users and user groups
- Add and remove reactions, pins, and bookmarks
- Manage reminders
- View workspace and team info

---

## Prerequisites

Connect the **Slack API** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## Messages

### Send Message

```bash
curl -s -X POST "https://slack.com/api/chat.postMessage" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"text\": \"Hello, World\"}"
```

### Send with Block Kit

```bash
curl -s -X POST "https://slack.com/api/chat.postMessage" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"text\": \"Fallback text\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"*Alert:* Something happened\"}}, {\"type\": \"section\", \"fields\": [{\"type\": \"mrkdwn\", \"text\": \"*Status:*\\nActive\"}, {\"type\": \"mrkdwn\", \"text\": \"*Priority:*\\nHigh\"}]}]}"
```

Block Kit Builder: https://app.slack.com/block-kit-builder

### Reply in Thread

```bash
curl -s -X POST "https://slack.com/api/chat.postMessage" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"thread_ts\": \"<message-ts>\", \"text\": \"Thread reply\"}"
```

### Update Message

```bash
curl -s -X POST "https://slack.com/api/chat.update" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"ts\": \"<message-ts>\", \"text\": \"Updated message\"}"
```

### Delete Message

```bash
curl -s -X POST "https://slack.com/api/chat.delete" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"ts\": \"<message-ts>\"}"
```

### Schedule Message

```bash
curl -s -X POST "https://slack.com/api/chat.scheduleMessage" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"text\": \"Scheduled message\", \"post_at\": 1735689600}"
```

`post_at` is a Unix timestamp. Must be within 120 days.

### List Scheduled Messages

```bash
curl -s -X POST "https://slack.com/api/chat.scheduledMessages.list" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\"}"
```

### Delete Scheduled Message

```bash
curl -s -X POST "https://slack.com/api/chat.deleteScheduledMessage" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"scheduled_message_id\": \"<scheduled-id>\"}"
```

### Send Ephemeral Message

Only visible to the specified user.

```bash
curl -s -X POST "https://slack.com/api/chat.postEphemeral" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"user\": \"<user-id>\", \"text\": \"Only you can see this\"}"
```

### Get Permalink

```bash
curl -s "https://slack.com/api/chat.getPermalink?channel=<channel-id>&message_ts=<message-ts>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Channels (Conversations)

Slack uses a unified "conversations" API for public channels, private channels, DMs, and group DMs.

### List Channels

```bash
curl -s "https://slack.com/api/conversations.list?types=public_channel&limit=100" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

`types`: `public_channel`, `private_channel`, `mpim` (group DM), `im` (DM). Comma-separated for multiple.

### Get Channel Info

```bash
curl -s "https://slack.com/api/conversations.info?channel=<channel-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Get Channel History

```bash
curl -s "https://slack.com/api/conversations.history?channel=<channel-id>&limit=20" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

Params: `latest`, `oldest` (Unix timestamps), `inclusive`, `limit` (max 1000), `cursor`.

### Get Thread Replies

```bash
curl -s "https://slack.com/api/conversations.replies?channel=<channel-id>&ts=<thread-ts>&limit=50" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### List Channel Members

```bash
curl -s "https://slack.com/api/conversations.members?channel=<channel-id>&limit=100" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Create Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.create" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"project-updates\", \"is_private\": false}"
```

### Invite Users to Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.invite" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"users\": \"<user-id-1>,<user-id-2>\"}"
```

### Remove User from Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.kick" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"user\": \"<user-id>\"}"
```

### Join Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.join" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\"}"
```

### Leave Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.leave" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\"}"
```

### Set Channel Topic

```bash
curl -s -X POST "https://slack.com/api/conversations.setTopic" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"topic\": \"New topic text\"}"
```

### Set Channel Purpose

```bash
curl -s -X POST "https://slack.com/api/conversations.setPurpose" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"purpose\": \"Channel purpose text\"}"
```

### Rename Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.rename" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"name\": \"new-channel-name\"}"
```

### Archive Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.archive" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\"}"
```

### Unarchive Channel

```bash
curl -s -X POST "https://slack.com/api/conversations.unarchive" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\"}"
```

### Mark Channel as Read

```bash
curl -s -X POST "https://slack.com/api/conversations.mark" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"ts\": \"<message-ts>\"}"
```

### Open DM

```bash
curl -s -X POST "https://slack.com/api/conversations.open" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"users\": \"<user-id>\"}"
```

Returns a channel ID for the DM. Use multiple comma-separated user IDs for group DM.

---

## Users

### List Users

```bash
curl -s "https://slack.com/api/users.list?limit=100" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Get User Info

```bash
curl -s "https://slack.com/api/users.info?user=<user-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Look Up User by Email

```bash
curl -s "https://slack.com/api/users.lookupByEmail?email=<user-email>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Get User Profile

```bash
curl -s "https://slack.com/api/users.profile.get?user=<user-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Set User Profile

```bash
curl -s -X POST "https://slack.com/api/users.profile.set" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"profile\": {\"status_text\": \"On vacation\", \"status_emoji\": \":palm_tree:\", \"status_expiration\": 0}}"
```

### Set Presence

```bash
curl -s -X POST "https://slack.com/api/users.setPresence" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"presence\": \"away\"}"
```

Values: `auto`, `away`.

### List User's Channels

```bash
curl -s "https://slack.com/api/users.conversations?user=<user-id>&types=public_channel,private_channel&limit=100" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Search

### Search Messages

```bash
curl -s "https://slack.com/api/search.messages?query=budget%20report&count=20&sort=timestamp" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

Params: `query` (supports Slack search modifiers like `from:@user`, `in:#channel`, `before:2026-04-01`), `count` (max 100), `sort` (`score` or `timestamp`), `sort_dir` (`asc` or `desc`).

### Search Files

```bash
curl -s "https://slack.com/api/search.files?query=presentation&count=20" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Search All

```bash
curl -s "https://slack.com/api/search.all?query=project%20update&count=20" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Files

### Upload File

Step 1: Get upload URL.

```bash
curl -s -X POST "https://slack.com/api/files.getUploadURLExternal" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"filename\": \"report.pdf\", \"length\": 12345}"
```

Step 2: Upload to the returned URL, then call `files.completeUploadExternal` with the `file_id`.

```bash
curl -s -X POST "https://slack.com/api/files.completeUploadExternal" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"files\": [{\"id\": \"<file-id>\", \"title\": \"Report\"}], \"channel_id\": \"<channel-id>\"}"
```

### Legacy Upload (Simpler)

```bash
curl -s -X POST "https://slack.com/api/files.upload" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  -F "channels=<channel-id>" \
  -F "file=@/path/to/file.txt" \
  -F "title=My File"
```

> **Note:** `files.upload` is deprecated but still functional. For new integrations, use the two-step `getUploadURLExternal` + `completeUploadExternal` flow.

### List Files

```bash
curl -s "https://slack.com/api/files.list?channel=<channel-id>&count=20" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Get File Info

```bash
curl -s "https://slack.com/api/files.info?file=<file-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Delete File

```bash
curl -s -X POST "https://slack.com/api/files.delete" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"file\": \"<file-id>\"}"
```

---

## Reactions

### Add Reaction

```bash
curl -s -X POST "https://slack.com/api/reactions.add" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"timestamp\": \"<message-ts>\", \"name\": \"thumbsup\"}"
```

### Remove Reaction

```bash
curl -s -X POST "https://slack.com/api/reactions.remove" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"timestamp\": \"<message-ts>\", \"name\": \"thumbsup\"}"
```

### Get Reactions on a Message

```bash
curl -s "https://slack.com/api/reactions.get?channel=<channel-id>&timestamp=<message-ts>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### List User's Reactions

```bash
curl -s "https://slack.com/api/reactions.list?user=<user-id>&count=20" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Pins

### Pin a Message

```bash
curl -s -X POST "https://slack.com/api/pins.add" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"timestamp\": \"<message-ts>\"}"
```

### Unpin a Message

```bash
curl -s -X POST "https://slack.com/api/pins.remove" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel\": \"<channel-id>\", \"timestamp\": \"<message-ts>\"}"
```

### List Pins

```bash
curl -s "https://slack.com/api/pins.list?channel=<channel-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Bookmarks

### List Bookmarks

```bash
curl -s -X POST "https://slack.com/api/bookmarks.list" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel_id\": \"<channel-id>\"}"
```

### Add Bookmark

```bash
curl -s -X POST "https://slack.com/api/bookmarks.add" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel_id\": \"<channel-id>\", \"title\": \"Project Wiki\", \"type\": \"link\", \"link\": \"https://wiki.example.com\"}"
```

### Remove Bookmark

```bash
curl -s -X POST "https://slack.com/api/bookmarks.remove" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"channel_id\": \"<channel-id>\", \"bookmark_id\": \"<bookmark-id>\"}"
```

---

## User Groups

### List User Groups

```bash
curl -s "https://slack.com/api/usergroups.list?include_users=true" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Create User Group

```bash
curl -s -X POST "https://slack.com/api/usergroups.create" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Engineering\", \"handle\": \"engineering\", \"description\": \"Engineering team\"}"
```

### Update User Group Members

```bash
curl -s -X POST "https://slack.com/api/usergroups.users.update" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"usergroup\": \"<usergroup-id>\", \"users\": \"<user-id-1>,<user-id-2>\"}"
```

### List User Group Members

```bash
curl -s "https://slack.com/api/usergroups.users.list?usergroup=<usergroup-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Reminders

### List Reminders

```bash
curl -s "https://slack.com/api/reminders.list" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Add Reminder

```bash
curl -s -X POST "https://slack.com/api/reminders.add" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"text\": \"Review the PR\", \"time\": 1735689600}"
```

`time` is a Unix timestamp or natural language (e.g., `in 15 minutes`, `tomorrow at 9am`).

### Complete Reminder

```bash
curl -s -X POST "https://slack.com/api/reminders.complete" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"reminder\": \"<reminder-id>\"}"
```

### Delete Reminder

```bash
curl -s -X POST "https://slack.com/api/reminders.delete" \
  --header "Authorization: Bearer $SLACK_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"reminder\": \"<reminder-id>\"}"
```

---

## Do Not Disturb

### Get DND Status

```bash
curl -s "https://slack.com/api/dnd.info?user=<user-id>" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Set Snooze

```bash
curl -s "https://slack.com/api/dnd.setSnooze?num_minutes=60" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### End DND

```bash
curl -s -X POST "https://slack.com/api/dnd.endDnd" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Emoji

### List Custom Emoji

```bash
curl -s "https://slack.com/api/emoji.list" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Team Info

### Get Workspace Info

```bash
curl -s "https://slack.com/api/team.info" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

### Get Team Profile Fields

```bash
curl -s "https://slack.com/api/team.profile.get" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

---

## Auth

### Test Token

```bash
curl -s -X POST "https://slack.com/api/auth.test" \
  --header "Authorization: Bearer $SLACK_TOKEN"
```

Returns workspace, user, and bot info for the token. Useful for verifying connectivity and discovering the bot's user ID.

---

## Guidelines

1. **Channel IDs, not names**: All API methods require channel IDs (e.g., `C1234567890`), not display names. Use `conversations.list` to discover IDs.
2. **Message timestamps**: Messages are identified by their `ts` (timestamp) field, not a numeric ID. Format: `"1735689600.000100"`.
3. **Pagination**: Use `cursor` and `limit` params. Next page cursor is in `response_metadata.next_cursor`. Keep paginating until cursor is empty.
4. **GET vs POST**: Read methods (list, info, history) are typically GET with query params. Write methods (post, update, delete, create) are POST with JSON body.
5. **Rate limits**: Methods are grouped into tiers. Tier 1: 1/sec, Tier 2: 20/min, Tier 3: 50/min, Tier 4: 100+/min. Check `Retry-After` header on 429 responses.
6. **Block Kit**: Use `blocks` array for rich message formatting. Always include a `text` field as fallback for notifications. Builder: https://app.slack.com/block-kit-builder
7. **Threading**: Set `thread_ts` to reply in a thread. The parent message's `ts` is the `thread_ts`.
8. **Conversation types**: `public_channel`, `private_channel`, `im` (1:1 DM), `mpim` (group DM). Many methods accept a `types` param to filter.
9. **User IDs**: Users are identified by IDs like `U1234567890`. Use `users.lookupByEmail` to find a user by email.
10. **File uploads**: The legacy `files.upload` still works but is deprecated. Prefer the two-step flow: `files.getUploadURLExternal` → upload → `files.completeUploadExternal`.

---

## Message Formatting

| Syntax | Result |
|--------|--------|
| `*bold*` | **bold** |
| `_italic_` | _italic_ |
| `~strike~` | ~~strike~~ |
| `` `code` `` | `code` |
| `<URL\|text>` | hyperlink |
| `<@U123>` | @mention user |
| `<#C123>` | #channel link |
| `<!here>` | @here |
| `<!channel>` | @channel |

---

## Admin API (Enterprise Grid Only)

The `admin.*` methods (100+ endpoints) are only available on Slack Enterprise Grid plans. They cover:

- **admin.conversations** — manage channels across an Enterprise org (create, archive, set teams, bulk move)
- **admin.users** — manage users across workspaces (assign, invite, remove, set admin/owner roles)
- **admin.teams** — manage workspaces (create, list, get settings)
- **admin.apps** — approve/restrict apps across the org
- **admin.invites** — manage workspace invite requests
- **admin.roles** — assign and list role-based access
- **admin.usergroups** — manage user groups across workspaces
- **admin.barriers** — manage information barriers
- **admin.workflows** — manage workflow builder workflows
- **admin.analytics** — access workspace analytics data
- **admin.audit** — access audit logs

> **Note:** These methods require Enterprise Grid admin tokens with `admin.*` scopes. They will return `missing_scope` or `not_allowed` errors on non-Enterprise workspaces. See docs for details.

---

## How to Look Up More API Details

- **All Methods**: https://docs.slack.dev/reference/methods
- **Admin Methods**: https://docs.slack.dev/reference/methods?filter=admin
- **Scopes**: https://docs.slack.dev/reference/scopes
- **Block Kit Reference**: https://docs.slack.dev/reference/block-kit
- **Rate Limits**: https://docs.slack.dev/apis/web-api/rate-limits
- **Events API**: https://docs.slack.dev/apis/events-api
