---
name: x
description: X (Twitter) API for tweets and profiles. Use when user mentions "X",
  "Twitter", "x.com", "twitter.com", shares a tweet link, "check X", or asks about
  social media posts.
---

## Authentication

The `X_TOKEN` Bearer is injected automatically at the network boundary for
direct HTTPS calls to `https://api.x.com`. You do not need to register an app,
run an OAuth flow, or manage refresh tokens. Just `curl` and the boundary does
the rest.

If a request returns 401, run:

```bash
zero doctor check-connector --url https://api.x.com/2/users/me --method GET
```

## Base URL

```
https://api.x.com
```

All examples below assume `X_TOKEN` is available in the environment. Use
`curl -sS` to surface HTTP status codes on failure.

## Endpoints

### 1. Authenticated User Profile

```bash
curl -sS "https://api.x.com/2/users/me" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 2. Look Up User by Username

> Replace `elonmusk` with the actual username. Leading `@` is optional.

```bash
curl -sS "https://api.x.com/2/users/by/username/elonmusk?user.fields=id,name,username,description,public_metrics,created_at,verified" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 3. Look Up User by ID

> Replace `12345` with the actual user ID. You can obtain user IDs from other
> endpoint responses.

```bash
curl -sS "https://api.x.com/2/users/12345?user.fields=id,name,username,description,public_metrics,created_at,verified" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 4. Look Up Multiple Users

Up to 100 IDs per request:

```bash
curl -sS "https://api.x.com/2/users?ids=12345,67890&user.fields=id,name,username,description,public_metrics" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 5. Get a Tweet by ID

> Replace `1234567890` with the actual tweet ID. Full URLs like
> `https://x.com/user/status/1234567890` also work — extract the ID after
> `/status/`.

```bash
curl -sS "https://api.x.com/2/tweets/1234567890?tweet.fields=created_at,public_metrics,author_id,text,lang,conversation_id&expansions=author_id&user.fields=name,username" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 6. Get Multiple Tweets

Up to 100 IDs per request:

```bash
curl -sS "https://api.x.com/2/tweets?ids=1234567890,0987654321&tweet.fields=created_at,public_metrics,author_id,text,lang&expansions=author_id&user.fields=name,username" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 7. Get a User's Tweets (Timeline)

Recent tweets posted by the authenticated user:

```bash
curl -sSG "https://api.x.com/2/users/me/tweets" \
  --data-urlencode "max_results=10" \
  --data-urlencode "tweet.fields=created_at,public_metrics,text" \
  --data-urlencode "exclude=retweets,replies" \
  -H "Authorization: Bearer $X_TOKEN"
```

For another user's timeline, replace `me` with the user ID:

```bash
curl -sSG "https://api.x.com/2/users/USER_ID/tweets" \
  --data-urlencode "max_results=10" \
  --data-urlencode "tweet.fields=created_at,public_metrics,text" \
  --data-urlencode "exclude=retweets,replies" \
  -H "Authorization: Bearer $X_TOKEN"
```

- `max_results` - 5 to 100 (default: 10)
- `start_time` / `end_time` - ISO 8601 datetime filter
- `since_id` / `until_id` - Tweet ID boundaries
- `pagination_token` - For paginating results
- `exclude` - Comma-separated: `retweets`, `replies`

### 8. Get Mentions of the Authenticated User

```bash
curl -sSG "https://api.x.com/2/users/me/mentions" \
  --data-urlencode "max_results=10" \
  --data-urlencode "tweet.fields=created_at,public_metrics,text,author_id" \
  --data-urlencode "expansions=author_id" \
  --data-urlencode "user.fields=name,username" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 9. Search Recent Tweets

Search for tweets from the past 7 days. Use `-G` so `curl` builds the query
string from `--data-urlencode` pairs (handles spaces and special characters
correctly):

```bash
curl -sSG "https://api.x.com/2/tweets/search/recent" \
  --data-urlencode "query=openai lang:en -is:retweet" \
  --data-urlencode "max_results=10" \
  --data-urlencode "tweet.fields=created_at,public_metrics,author_id,text" \
  --data-urlencode "expansions=author_id" \
  --data-urlencode "user.fields=name,username" \
  -H "Authorization: Bearer $X_TOKEN"
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

### 10. Get a User's Followers

> Replace `elonmusk` with the actual username. For numeric IDs, use
> `users/ID/followers` instead.

```bash
curl -sSG "https://api.x.com/2/users/by/username/elonmusk/followers" \
  --data-urlencode "max_results=20" \
  --data-urlencode "user.fields=id,name,username,description,public_metrics" \
  -H "Authorization: Bearer $X_TOKEN"
```

### 11. Get a User's Following

```bash
curl -sSG "https://api.x.com/2/users/by/username/elonmusk/following" \
  --data-urlencode "max_results=20" \
  --data-urlencode "user.fields=id,name,username,description,public_metrics" \
  -H "Authorization: Bearer $X_TOKEN"
```

## Pagination

Most list endpoints support pagination. After a request, check
`meta.next_token` in the response and pass it back as `pagination_token` on the
next call:

```bash
NEXT=$(curl -sS "https://api.x.com/2/tweets/search/recent?query=example&max_results=10" \
  -H "Authorization: Bearer $X_TOKEN" | jq -r .meta.next_token)

curl -sSG "https://api.x.com/2/tweets/search/recent" \
  --data-urlencode "query=example" \
  --data-urlencode "max_results=10" \
  --data-urlencode "pagination_token=$NEXT" \
  -H "Authorization: Bearer $X_TOKEN"
```

## Common `user.fields`

| Field | Description |
|-------|-------------|
| `id` | Unique user ID |
| `name` | Display name |
| `username` | Handle (without `@`) |
| `description` | Bio text |
| `created_at` | Account creation time |
| `public_metrics` | Followers, following, tweet, listed counts |
| `profile_image_url` | Avatar URL |
| `verified` | Verification status |
| `location` | User-defined location |
| `url` | User-defined URL |

## Common `tweet.fields`

| Field | Description |
|-------|-------------|
| `id` | Tweet ID |
| `text` | Tweet content |
| `created_at` | Post time |
| `author_id` | Author's user ID |
| `public_metrics` | Retweets, replies, likes, quotes, bookmarks, impressions |
| `conversation_id` | Thread root tweet ID |
| `lang` | Detected language |
| `referenced_tweets` | Retweet/quote/reply references |
| `entities` | URLs, hashtags, mentions, cashtags |

## Guidelines

1. **Read-only access**: This connector only grants read permissions; you cannot
   post, like, retweet, or follow.
2. **Use `curl -G` with `--data-urlencode` for query parameters** - it handles
   spaces, quotes, and special characters in the query string correctly. Plain
   `?query=...&max_results=...` in a URL breaks on any of these.
3. **Fields are opt-in**: Raw endpoints return only `id` and `text` by default.
   Always specify `tweet.fields` and `user.fields` for richer data, and
   `expansions=author_id` + `user.fields` to resolve author usernames in tweet
   responses.
4. **7-day search window**: The recent search endpoint only covers the past
   7 days. For older searches you need the academic / full-archive endpoint,
   which requires elevated API access.
5. **Rate limits**: X API enforces per-endpoint and per-user rate limits. Avoid
   rapid successive calls; on 429 back off and retry.
6. **No `xurl`**: The legacy `xurl` helper requires a locally registered X app
   and an OAuth flow that does not run in this sandbox. Use `curl` directly —
   the `X_TOKEN` bearer is injected by the runtime boundary for
   `https://api.x.com/*` calls.
