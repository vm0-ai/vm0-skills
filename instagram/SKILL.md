---
name: instagram
description: Instagram Graph API integration via curl. Use this skill to fetch and publish Instagram media.
vm0_env:
  - INSTAGRAM_ACCESS_TOKEN
  - INSTAGRAM_BUSINESS_ACCOUNT_ID
---

# Instagram API (Graph API)

Use the Instagram Graph API by directly executing `curl` commands to **read and publish Instagram content**.

> Official docs: `https://developers.facebook.com/docs/instagram-api`

---

## When to Use

Use this skill when you need to:

- **Fetch recent media (photos / videos / Reels)** from an account
- **Get detailed information** about a specific media item (caption, type, link, time, etc.)
- **Search recent media by hashtag**
- **Publish image posts via API** (with caption)

---

## Prerequisites

1. You must have an **Instagram Business / Creator account** linked to a **Facebook Page**
2. Create an app in Facebook Developers and enable **Instagram Basic Display / Instagram Graph API** permissions
3. Obtain:
  - `INSTAGRAM_ACCESS_TOKEN`: a long-lived user access token
  - `INSTAGRAM_BUSINESS_ACCOUNT_ID`: your Instagram Business account ID

Set the environment variables, for example:

```bash
export INSTAGRAM_ACCESS_TOKEN="EAAG..."
export INSTAGRAM_BUSINESS_ACCOUNT_ID="1784140xxxxxxx"
```

These examples use Graph API version `v21.0`. You can replace this with the latest version if needed.

### Required permissions (scopes)

Depending on which endpoints you use, make sure your app has requested and been approved for (at least):

- `instagram_basic`
- `pages_show_list`
- `instagram_content_publish` (for publishing media)
- `instagram_manage_insights` and related permissions (for insights / some hashtag use cases)

---


> **Important:** When piping `curl` output to `jq`, wrap the command in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" | jq .'
> ```

## How to Use

All examples below assume you have already set:

```bash
INSTAGRAM_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID
```

### 1. Fetch recent media for the account

Fetch the most recent media (photos / videos / Reels) for the account:

```bash
bash -c 'curl -s -X GET "https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

**Notes:**

- Each item in the returned JSON represents a media object
- Common fields:
  - `id`: media ID (used for details / insights later)
  - `caption`: caption text
  - `media_type`: `IMAGE` / `VIDEO` / `CAROUSEL_ALBUM`
  - `media_url`: direct URL to the media
  - `permalink`: Instagram permalink
  - `timestamp`: creation time

---

### 2. Get details for a single media

If you already have a media `id`, you can fetch more complete information:

```bash
MEDIA_ID="1789xxxxxxxxxxxx"

bash -c 'curl -s -X GET "https://graph.facebook.com/v21.0/${MEDIA_ID}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

---

### 3. Search media by hashtag

> Note: hashtag search requires proper business use cases and permissions as defined by Facebook/Instagram. Refer to the official docs.

This usually involves two steps:

#### 3.1 Get the hashtag ID

```bash
HASHTAG_NAME="travel"

bash -c 'curl -s -X GET "https://graph.facebook.com/v21.0/ig_hashtag_search?user_id=${INSTAGRAM_BUSINESS_ACCOUNT_ID}&q=${HASHTAG_NAME}" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

Take the returned `id` (we call it `HASHTAG_ID`).

#### 3.2 Fetch recent media for the hashtag

```bash
HASHTAG_ID="178434113xxxxxxxx"

bash -c 'curl -s -X GET "https://graph.facebook.com/v21.0/${HASHTAG_ID}/recent_media?user_id=${INSTAGRAM_BUSINESS_ACCOUNT_ID}&fields=id,caption,media_type,media_url,permalink,timestamp" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

---

### 4. Publish an image post

Publishing an image post via the Graph API usually requires **two steps**:

1. **Create a media container**
2. **Publish the container to the feed**

#### 4.1 Create a media container

```bash
IMAGE_URL="https://example.com/image.jpg"
CAPTION="Hello from Instagram API 👋"

bash -c 'curl -s -X POST "https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media" -F "image_url=${IMAGE_URL}" -F "caption=${CAPTION}" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

The response will contain an `id` (media container ID), for example:

```json
{
  "id": "1790xxxxxxxxxxxx"
}
```

Store this ID (for example as `CREATION_ID`).

#### 4.2 Publish the media container to the feed

```bash
CREATION_ID="1790xxxxxxxxxxxx"

bash -c 'curl -s -X POST "https://graph.facebook.com/v21.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish" -F "creation_id=${CREATION_ID}" --header "Authorization: Bearer ${INSTAGRAM_ACCESS_TOKEN}" | jq .'
```

If successful, the response will contain the final media `id`:

```json
{
  "id": "1791yyyyyyyyyyyy"
}
```

You can then use the "Get details for a single media" command to fetch its `permalink`.

---

### 5. Common errors and troubleshooting

1. **Permissions / OAuth errors**

  - Typical error message: `(#10) Application does not have permission for this action`
  - Check:
  - Whether the app has been reviewed / approved
  - Whether the required Instagram permissions are enabled
  - Whether `INSTAGRAM_ACCESS_TOKEN` is a valid long-lived token

2. **Unsupported account type**

  - Most Graph API features require **Business / Creator** accounts
  - Make sure the Instagram account type is correct and linked to a Facebook Page

3. **Rate limits**
  - Too many requests in a short period may hit rate limits; add delays for bulk operations

---

## Guidelines

1. **Use `jq`**: all examples use `jq` to pretty-print JSON, which is helpful for both agents and humans
2. **Do not log tokens**: `INSTAGRAM_ACCESS_TOKEN` is sensitive; avoid printing it in logs or chat transcripts
3. **Validate curl commands in a test environment first**: confirm flows before wiring them into automation / agents
4. **Keep API version up to date**: periodically check Facebook docs and update the `v21.0` version in URLs to the latest
