---
name: x
description: X (Twitter) API for tweets and profiles. Use when user mentions "X",
  "Twitter", "x.com", "twitter.com", shares a tweet link, "check X", or asks about
  social media posts.
vm0_secrets:
  - X_TOKEN
---

# X (Twitter) API

Use the X API v2 via direct `curl` calls to **read tweets, search posts, view user profiles, timelines, and social graphs**.

> Official docs: `https://docs.x.com/x-api`

---

## When to Use

Use this skill when you need to:

- **View user profiles** - look up users by username or ID
- **Read tweets** - get tweet details by ID
- **Browse timelines** - get a user's tweets or mentions
- **Search posts** - find recent tweets matching a query
- **Explore social graphs** - list followers and following

---

## Prerequisites


Verify authentication:

```bash
curl -s "https://api.x.com/2/users/me" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .
```

### Available Scopes

The connector grants read-only access:

- `tweet.read` - Read tweets and timelines
- `users.read` - Read user profiles
- `follows.read` - Read followers and following

---

## How to Use

Base URL: `https://api.x.com/2`

---

### 1. Get Authenticated User Profile

Get the profile of the currently authenticated user:

```bash
curl -s "https://api.x.com/2/users/me?user.fields=id,name,username,description,profile_image_url,public_metrics,created_at,verified" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .data
```

---

### 2. Look Up User by Username

Get a user's profile by their username:

> **Note:** Replace `elonmusk` with the actual username you want to look up.

```bash
USERNAME="elonmusk"

curl -s "https://api.x.com/2/users/by/username/$USERNAME?user.fields=id,name,username,description,public_metrics,created_at,verified,profile_image_url" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .data
```

---

### 3. Look Up User by ID

Get a user's profile by their user ID:

> **Note:** Replace `12345` with the actual user ID. You can obtain user IDs from other endpoint responses.

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID?user.fields=id,name,username,description,public_metrics,created_at" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .data
```

---

### 4. Look Up Multiple Users

Get profiles for multiple users at once (up to 100):

> **Note:** Replace the IDs with actual user IDs, comma-separated.

```bash
curl -s "https://api.x.com/2/users?ids=12345,67890&user.fields=id,name,username,description,public_metrics" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .data
```

---

### 5. Get a Tweet by ID

Get details of a specific tweet:

> **Note:** Replace `1234567890` with the actual tweet ID.

```bash
TWEET_ID="1234567890"

curl -s "https://api.x.com/2/tweets/$TWEET_ID?tweet.fields=created_at,public_metrics,author_id,conversation_id,lang&expansions=author_id&user.fields=name,username" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .
```

---

### 6. Get Multiple Tweets

Get details for multiple tweets at once (up to 100):

> **Note:** Replace the IDs with actual tweet IDs, comma-separated.

```bash
curl -s "https://api.x.com/2/tweets?ids=1234567890,0987654321&tweet.fields=created_at,public_metrics,author_id,text&expansions=author_id&user.fields=name,username" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .
```

---

### 7. Get User's Tweets (Timeline)

Get recent tweets posted by a user:

> **Note:** Replace `USER_ID` with the actual user ID. Use the "Look Up User by Username" endpoint first to get the ID.

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID/tweets?max_results=10&tweet.fields=created_at,public_metrics,text&expansions=referenced_tweets.id" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, text: .text[0:120], created_at, public_metrics}'
```

Query parameters:
- `max_results` - 5 to 100 (default: 10)
- `start_time` / `end_time` - ISO 8601 datetime filter
- `since_id` / `until_id` - Tweet ID boundaries
- `pagination_token` - For paginating results
- `exclude` - Comma-separated: `retweets`, `replies`

---

### 8. Get User's Mentions

Get recent tweets that mention a user:

> **Note:** Replace `USER_ID` with the actual user ID.

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID/mentions?max_results=10&tweet.fields=created_at,public_metrics,author_id,text&expansions=author_id&user.fields=name,username" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, text: .text[0:120], author: .author_id, created_at}'
```

---

### 9. Get Reverse Chronological Timeline

Get the authenticated user's home timeline (tweets from people they follow):

> **Note:** Replace `USER_ID` with the authenticated user's ID (from "Get Authenticated User Profile").

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID/timelines/reverse_chronological?max_results=10&tweet.fields=created_at,public_metrics,author_id,text&expansions=author_id&user.fields=name,username" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, text: .text[0:120], created_at}'
```

---

### 10. Search Recent Tweets

Search for tweets from the past 7 days:

> **Note:** Replace the query with your search terms. The query supports operators like `from:`, `to:`, `has:`, `-is:retweet`, etc.

```bash
curl -s -G "https://api.x.com/2/tweets/search/recent" --data-urlencode "query=openai lang:en -is:retweet" --data-urlencode "max_results=10" --data-urlencode "tweet.fields=created_at,public_metrics,author_id,text" --data-urlencode "expansions=author_id" --data-urlencode "user.fields=name,username" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, text: .text[0:120], created_at, public_metrics}'
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

### 11. Get User's Followers

Get a list of users who follow a specific user:

> **Note:** Replace `USER_ID` with the actual user ID.

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID/followers?max_results=20&user.fields=id,name,username,description,public_metrics" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, name, username, followers_count: .public_metrics.followers_count}'
```

---

### 12. Get User's Following

Get a list of users that a specific user follows:

> **Note:** Replace `USER_ID` with the actual user ID.

```bash
USER_ID="12345"

curl -s "https://api.x.com/2/users/$USER_ID/following?max_results=20&user.fields=id,name,username,description,public_metrics" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq '.data[] | {id, name, username, followers_count: .public_metrics.followers_count}'
```

---

## Pagination

Most list endpoints support pagination via `pagination_token`. Check the `meta.next_token` field in the response:

```bash
curl -s "https://api.x.com/2/tweets/search/recent?query=example&max_results=10" --header "Authorization: Bearer $(printenv X_TOKEN)" | jq .meta
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
3. **User IDs vs usernames**: Most endpoints require numeric user IDs, not usernames. Use the username lookup endpoint first
4. **Fields are opt-in**: The API only returns `id` and `text` by default; always specify `tweet.fields` and `user.fields` for richer data
5. **7-day search window**: The recent search endpoint only covers the past 7 days
6. **Pagination**: Use `max_results` and `pagination_token` for large result sets
