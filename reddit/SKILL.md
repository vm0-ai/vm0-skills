---
name: reddit
description: Reddit API for accessing discussions and content. Use when user mentions
  "Reddit", "reddit.com", shares a Reddit link, "subreddit", or asks about Reddit
  discussions.
---

# Reddit

Access Reddit discussions, posts, and content through the Reddit API.

## Prerequisites

Connect the **Reddit** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name REDDIT_TOKEN` or `zero doctor check-connector --url https://oauth.reddit.com/api/v1/me --method GET`

## When to Use

- Search and read Reddit posts and comments
- Browse subreddit content
- Access Reddit discussions for research or monitoring

## Authentication

The `REDDIT_TOKEN` environment variable is automatically injected by the connector via OAuth.

## Core APIs

### Get Current User

```bash
curl -s "https://oauth.reddit.com/api/v1/me" -H "Authorization: Bearer $REDDIT_TOKEN" -H "User-Agent: vm0:skill:v1" | jq '{name, total_karma, created_utc}'
```

### Search Posts

Search Reddit for posts matching a query:

```bash
curl -s "https://oauth.reddit.com/search?q=<query>&sort=relevance&limit=10" -H "Authorization: Bearer $REDDIT_TOKEN" -H "User-Agent: vm0:skill:v1" | jq '.data.children[] | {title: .data.title, subreddit: .data.subreddit, score: .data.score, url: .data.url}'
```

Replace `<query>` with your search term (URL-encoded).

### Get Subreddit Posts

Get hot/new/top posts from a subreddit:

```bash
curl -s "https://oauth.reddit.com/r/<subreddit>/hot?limit=10" -H "Authorization: Bearer $REDDIT_TOKEN" -H "User-Agent: vm0:skill:v1" | jq '.data.children[] | {title: .data.title, score: .data.score, num_comments: .data.num_comments, url: .data.url}'
```

Replace `<subreddit>` with the subreddit name (e.g., `programming`). Change `hot` to `new`, `top`, or `rising` for different sorts.

### Get Post Comments

```bash
curl -s "https://oauth.reddit.com/r/<subreddit>/comments/<post-id>?limit=10" -H "Authorization: Bearer $REDDIT_TOKEN" -H "User-Agent: vm0:skill:v1" | jq '.[1].data.children[] | {author: .data.author, body: .data.body, score: .data.score}'
```

Replace `<subreddit>` and `<post-id>` with the actual values.

### Get Subreddit Info

```bash
curl -s "https://oauth.reddit.com/r/<subreddit>/about" -H "Authorization: Bearer $REDDIT_TOKEN" -H "User-Agent: vm0:skill:v1" | jq '{name: .data.display_name, title: .data.title, subscribers: .data.subscribers, description: .data.public_description}'
```

## Guidelines

1. **User-Agent required**: Reddit API requires a `User-Agent` header on all requests
2. **Rate limits**: OAuth clients get 60 requests per minute. Check `X-Ratelimit-Remaining` header
3. **Listing pagination**: Use `after` parameter with the `name` field of the last item (e.g., `after=t3_abc123`)
4. **OAuth scopes**: This connector has `identity` (read user info) and `read` (read content) scopes

## API Reference

- Docs: https://www.reddit.com/dev/api/
