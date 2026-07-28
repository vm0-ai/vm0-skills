---
name: x
description: X (Twitter) API for reading and publishing posts, profiles, timelines,
  search, media, and engagement actions. Use when user mentions "X", "Twitter",
  "x.com", "twitter.com", shares a post link, asks to check X, or asks to draft,
  publish, delete, like, or repost social media content.
---

## How to Use

Use `curl` directly against `https://api.x.com`. Agent-local wrapper commands may
fail even when the connector boundary can inject valid X API authentication for
direct `api.x.com` requests.

The connector supports both read and write operations. A direct user request such
as "post this on X" authorizes that specific write; do not require browser access.
If the user asks only for a draft or options, do not publish. Pipe responses through
`jq` when you need structured output.

### 1. Get Authenticated User Profile

```bash
curl -sS 'https://api.x.com/2/users/me?user.fields=id,name,username,description,public_metrics,created_at,verified'
```

### 2. Look Up User by Username

> **Note:** Replace `elonmusk` with the actual username. Leading `@` is optional.

```bash
curl -sS 'https://api.x.com/2/users/by/username/elonmusk?user.fields=id,name,username,description,public_metrics,created_at,verified,location,url'
```

### 3. Look Up User by ID

> **Note:** Replace `12345` with the actual user ID. You can obtain user IDs from other endpoint responses.

```bash
curl -sS 'https://api.x.com/2/users/12345?user.fields=id,name,username,description,public_metrics,created_at,verified,location,url'
```

### 4. Look Up Multiple Users

Get profiles for multiple users at once (up to 100):

> **Note:** Replace the IDs with actual user IDs, comma-separated.

```bash
curl -sS 'https://api.x.com/2/users?ids=12345,67890&user.fields=id,name,username,description,public_metrics,created_at,verified'
```

### 5. Get a Tweet by ID

> **Note:** Replace `1234567890` with the actual tweet ID. For full URLs like
> `https://x.com/user/status/1234567890`, extract the numeric status ID first.

```bash
curl -sS 'https://api.x.com/2/tweets/1234567890?tweet.fields=created_at,public_metrics,author_id,text,conversation_id,lang,referenced_tweets,entities&expansions=author_id&user.fields=name,username,verified'
```

### 6. Get Multiple Tweets

Get details for multiple tweets at once (up to 100):

> **Note:** Replace the IDs with actual tweet IDs, comma-separated.

```bash
curl -sS 'https://api.x.com/2/tweets?ids=1234567890,0987654321&tweet.fields=created_at,public_metrics,author_id,text,conversation_id,lang,referenced_tweets,entities&expansions=author_id&user.fields=name,username,verified'
```

### 7. Get User's Tweets (Timeline)

Get recent tweets posted by a user. If you only have the username, resolve it to a
user ID first:

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/by/username/elonmusk?user.fields=id' | jq -r '.data.id')"
curl -sS "https://api.x.com/2/users/${USER_ID}/tweets?max_results=10&tweet.fields=created_at,public_metrics,text,conversation_id,lang,referenced_tweets&exclude=retweets,replies"
```

Query parameters:

```bash
curl -sS 'https://api.x.com/2/users/USER_ID/tweets?max_results=10&tweet.fields=created_at,public_metrics,text&exclude=retweets,replies'
```

- `max_results` - 5 to 100 (default: 10)
- `start_time` / `end_time` - ISO 8601 datetime filter
- `since_id` / `until_id` - Tweet ID boundaries
- `pagination_token` - For paginating results
- `exclude` - Comma-separated: `retweets`, `replies`

### 8. Get User's Mentions

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/me?user.fields=id' | jq -r '.data.id')"
curl -sS "https://api.x.com/2/users/${USER_ID}/mentions?max_results=10&tweet.fields=created_at,public_metrics,text,author_id,conversation_id,lang&expansions=author_id&user.fields=name,username,verified"
```

### 9. Search Recent Tweets

Search for tweets from the past 7 days:

> **Note:** Replace the query with your search terms.

```bash
curl -sS --get 'https://api.x.com/2/tweets/search/recent' \
  --data-urlencode 'query=openai lang:en -is:retweet' \
  --data-urlencode 'max_results=10' \
  --data-urlencode 'tweet.fields=created_at,public_metrics,author_id,text,conversation_id,lang,referenced_tweets,entities' \
  --data-urlencode 'expansions=author_id' \
  --data-urlencode 'user.fields=name,username,verified'
```

Common search operators:
- `from:username` - Tweets from a specific user
- `to:username` - Tweets replying to a user
- `@username` - Tweets mentioning a user
- `#hashtag` - Tweets with a hashtag
- `has:links` / `has:images` / `has:videos` - Media filters
- `-is:retweet` - Exclude retweets
- `-is:reply` - Exclude replies
- `lang:en` - Filter by language
- `conversation_id:123` - Tweets in a conversation thread

### 10. Get User's Followers

> **Note:** Replace `elonmusk` with the actual username.

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/by/username/elonmusk?user.fields=id' | jq -r '.data.id')"
curl -sS "https://api.x.com/2/users/${USER_ID}/followers?max_results=20&user.fields=id,name,username,description,public_metrics,verified"
```

### 11. Get User's Following

> **Note:** Replace `elonmusk` with the actual username.

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/by/username/elonmusk?user.fields=id' | jq -r '.data.id')"
curl -sS "https://api.x.com/2/users/${USER_ID}/following?max_results=20&user.fields=id,name,username,description,public_metrics,verified"
```

## Write Operations

Only perform the specific mutation the user requested. Preserve the approved text
and media exactly unless the user also asks for edits.

### Create a Post

Use `jq` to JSON-escape user-provided text safely:

```bash
POST_TEXT='Hello from the X API'
curl -sS -X POST 'https://api.x.com/2/tweets' \
  -H 'Content-Type: application/json' \
  --data "$(jq -nc --arg text "$POST_TEXT" '{text: $text}')"
```

The response contains the new post ID at `.data.id`. Return a link in the form
`https://x.com/i/status/POST_ID` after publishing.

To reply or quote a post, add one of these objects to the request body:

```json
{"reply":{"in_reply_to_tweet_id":"POST_ID"}}
{"quote_tweet_id":"POST_ID"}
```

### Upload Media and Create a Post

For a one-shot image upload:

```bash
MEDIA_RESPONSE="$(curl -sS -X POST 'https://api.x.com/2/media/upload' \
  -F 'media=@/absolute/path/image.png' \
  -F 'media_category=tweet_image')"
MEDIA_ID="$(printf '%s' "$MEDIA_RESPONSE" | jq -r '.data.id')"

POST_TEXT='Post text'
curl -sS -X POST 'https://api.x.com/2/tweets' \
  -H 'Content-Type: application/json' \
  --data "$(jq -nc --arg text "$POST_TEXT" --arg media_id "$MEDIA_ID" \
    '{text: $text, media: {media_ids: [$media_id]}}')"
```

For video, GIF, or a large file, use the current v2 chunked upload protocol:

1. `POST /2/media/upload/initialize` with JSON containing `media_type`,
   `total_bytes`, and `media_category` such as `tweet_video`.
2. Split the file into chunks and send each to
   `POST /2/media/upload/{id}/append` as multipart fields `media` and
   `segment_index`, starting at `0`.
3. `POST /2/media/upload/{id}/finalize`.
4. Poll `GET /2/media/upload?media_id=ID&command=STATUS`, respecting
   `processing_info.check_after_secs`, until the state is `succeeded` or `failed`.
5. Create the post with the returned media ID. Do not publish before processing
   succeeds.

Do not use the legacy `command=INIT`, `APPEND`, and `FINALIZE` protocol against
the v2 endpoint.

### Delete a Post

```bash
curl -sS -X DELETE 'https://api.x.com/2/tweets/POST_ID'
```

### Like or Unlike a Post

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/me' | jq -r '.data.id')"
curl -sS -X POST "https://api.x.com/2/users/${USER_ID}/likes" \
  -H 'Content-Type: application/json' \
  --data '{"tweet_id":"POST_ID"}'

curl -sS -X DELETE "https://api.x.com/2/users/${USER_ID}/likes/POST_ID"
```

### Repost or Undo a Repost

```bash
USER_ID="$(curl -sS 'https://api.x.com/2/users/me' | jq -r '.data.id')"
curl -sS -X POST "https://api.x.com/2/users/${USER_ID}/retweets" \
  -H 'Content-Type: application/json' \
  --data '{"tweet_id":"POST_ID"}'

curl -sS -X DELETE "https://api.x.com/2/users/${USER_ID}/retweets/POST_ID"
```

## Pagination

Most list endpoints support pagination. Use `max_results` to control result count.

Check the `meta.next_token` field in the response:

```bash
curl -sS --get 'https://api.x.com/2/tweets/search/recent' \
  --data-urlencode 'query=example' \
  --data-urlencode 'max_results=10' | jq .meta
```

Use the returned `next_token` value as `pagination_token` in the next request to get more results.

## Common user.fields

| Field | Description |
|-------|-------------|
| `id` | Unique user ID |
| `name` | Display name |
| `username` | Handle (without @) |
| `description` | Bio text |
| `created_at` | Account creation date |
| `public_metrics` | Followers, following, tweet, and listed counts |
| `profile_image_url` | Avatar URL |
| `verified` | Verification status |
| `location` | User-defined location |
| `url` | User-defined URL |

## Common tweet.fields

| Field | Description |
|-------|-------------|
| `id` | Unique tweet ID |
| `text` | Tweet content |
| `created_at` | Post timestamp |
| `author_id` | Author's user ID |
| `public_metrics` | Retweets, replies, likes, quotes, bookmarks, impressions |
| `conversation_id` | Thread root tweet ID |
| `lang` | Detected language |
| `referenced_tweets` | Retweet/quote/reply references |
| `entities` | URLs, hashtags, mentions, cashtags |

## Guidelines

1. **Read and write access**: The connector can publish and delete posts, upload media, and perform engagement actions in addition to reads
2. **Explicit writes**: Only mutate X when the user requests that action; a draft request is not permission to publish
3. **Verify mutations**: Check the API response and return the resulting post link or action result
4. **Diagnose denials**: If a write is blocked, inspect connector permissions before claiming the connector is read-only
5. **Rate limits**: X API has strict rate limits; avoid rapid successive calls
6. **Use direct curl**: Call `https://api.x.com/2/...` with `curl -sS`
7. **Let the connector inject auth**: Do not hard-code bearer tokens in commands or docs
8. **Fields are opt-in**: Endpoints only return minimal fields by default; specify `tweet.fields` and `user.fields` for richer data
9. **7-day search window**: The recent search endpoint only covers the past 7 days
10. **Pagination**: Use `max_results` and `pagination_token`
