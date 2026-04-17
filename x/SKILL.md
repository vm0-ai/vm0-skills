---
name: x
description: X (Twitter) API for tweets and profiles. Use when user mentions "X",
  "Twitter", "x.com", "twitter.com", shares a tweet link, "check X", or asks about
  social media posts.
---

# X (Twitter) API

Use `xurl` CLI to **read tweets, search posts, view user profiles, timelines, and social graphs**.

> xurl docs: `https://github.com/xdevplatform/xurl`

---

## When to Use

Use this skill when you need to:

- **View user profiles** - look up users by username or ID
- **Read tweets** - get tweet details by ID or URL
- **Browse timelines** - get a user's tweets or mentions
- **Search posts** - find recent tweets matching a query
- **Explore social graphs** - list followers and following

---

## Prerequisites

Connect the **X (Twitter) API** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## How to Use

### 1. Get Authenticated User Profile

```bash
xurl whoami
```

---

### 2. Look Up User by Username

> **Note:** Replace `elonmusk` with the actual username. Leading `@` is optional.

```bash
xurl user elonmusk
```

---

### 3. Look Up User by ID

> **Note:** Replace `12345` with the actual user ID. You can obtain user IDs from other endpoint responses.

```bash
xurl /2/users/12345?user.fields=id,name,username,description,public_metrics,created_at
```

---

### 4. Look Up Multiple Users

Get profiles for multiple users at once (up to 100):

> **Note:** Replace the IDs with actual user IDs, comma-separated.

```bash
xurl '/2/users?ids=12345,67890&user.fields=id,name,username,description,public_metrics'
```

---

### 5. Get a Tweet by ID

> **Note:** Replace `1234567890` with the actual tweet ID. Full URLs like `https://x.com/user/status/1234567890` also work.

```bash
xurl read 1234567890
```

---

### 6. Get Multiple Tweets

Get details for multiple tweets at once (up to 100):

> **Note:** Replace the IDs with actual tweet IDs, comma-separated.

```bash
xurl '/2/tweets?ids=1234567890,0987654321&tweet.fields=created_at,public_metrics,author_id,text&expansions=author_id&user.fields=name,username'
```

---

### 7. Get User's Tweets (Timeline)

Get recent tweets posted by the authenticated user:

```bash
xurl timeline -n 10
```

Query parameters for raw API (if you need another user's timeline):

```bash
xurl '/2/users/USER_ID/tweets?max_results=10&tweet.fields=created_at,public_metrics,text&exclude=retweets,replies'
```

- `max_results` - 5 to 100 (default: 10)
- `start_time` / `end_time` - ISO 8601 datetime filter
- `since_id` / `until_id` - Tweet ID boundaries
- `pagination_token` - For paginating results
- `exclude` - Comma-separated: `retweets`, `replies`

---

### 8. Get User's Mentions

```bash
xurl mentions -n 10
```

---

### 9. Search Recent Tweets

Search for tweets from the past 7 days:

> **Note:** Replace the query with your search terms.

```bash
xurl search "openai lang:en -is:retweet" -n 10
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

---

### 10. Get User's Followers

> **Note:** Replace `elonmusk` with the actual username.

```bash
xurl followers --of elonmusk -n 20
```

---

### 11. Get User's Following

> **Note:** Replace `elonmusk` with the actual username.

```bash
xurl following --of elonmusk -n 20
```

---

## Pagination

Most list endpoints support pagination. For shortcut commands, use `-n` to control result count.

For raw API endpoints, check the `meta.next_token` field in the response:

```bash
xurl '/2/tweets/search/recent?query=example&max_results=10' | jq .meta
```

Use the returned `next_token` value as `pagination_token` in the next request to get more results.

---

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

---

## Guidelines

1. **Read-only access**: This connector only grants read permissions; you cannot post, like, or retweet
2. **Rate limits**: X API has strict rate limits; avoid rapid successive calls
3. **Prefer shortcut commands**: Use `xurl search`, `xurl user`, `xurl read` etc. over raw API paths when possible
4. **Raw API fallback**: For bulk lookups or advanced queries, use `xurl '/2/...'` with query parameters
5. **Fields are opt-in (raw API only)**: Raw endpoints only return `id` and `text` by default; specify `tweet.fields` and `user.fields` for richer data. Shortcut commands include common fields automatically
6. **7-day search window**: The recent search endpoint only covers the past 7 days
7. **Pagination**: Use `-n` for shortcut commands, `max_results` and `pagination_token` for raw API
