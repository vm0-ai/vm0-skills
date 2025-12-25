name: hackernews
description: Hacker News API via curl. Use this skill to fetch top stories, new posts, comments, and user profiles from Hacker News.

---

# Hacker News API

Use the official Hacker News API via direct `curl` calls to **fetch stories, comments, and user data**.

> Official docs: `https://github.com/HackerNews/API`

---

## When to Use

Use this skill when you need to:

- **Fetch top/best/new stories** from Hacker News
- **Get story details** including title, URL, score, comments
- **Retrieve comments** and discussion threads
- **Look up user profiles** and their submissions
- **Monitor trending tech topics** and discussions

---

## Prerequisites

**No API key required!** The Hacker News API is completely free and open.

Base URL: `https://hacker-news.firebaseio.com/v0`

---

## How to Use

### 1. Get Top Stories

Fetch IDs of the current top 500 stories:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" > /tmp/resp_fdee43.json
cat /tmp/resp_fdee43.json | jq '.[:10]'
```

### 2. Get Best Stories

Fetch the best stories (highest voted over time):

```bash
curl -s "https://hacker-news.firebaseio.com/v0/beststories.json" > /tmp/resp_04f8fe.json
cat /tmp/resp_04f8fe.json | jq '.[:10]'
```

### 3. Get New Stories

Fetch the newest stories:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/newstories.json" > /tmp/resp_733fd4.json
cat /tmp/resp_733fd4.json | jq '.[:10]'
```

### 4. Get Ask HN Stories

Fetch "Ask HN" posts:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/askstories.json" > /tmp/resp_833486.json
cat /tmp/resp_833486.json | jq '.[:10]'
```

### 5. Get Show HN Stories

Fetch "Show HN" posts:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/showstories.json" > /tmp/resp_297bf8.json
cat /tmp/resp_297bf8.json | jq '.[:10]'
```

### 6. Get Job Stories

Fetch job postings:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/jobstories.json" > /tmp/resp_9633d8.json
cat /tmp/resp_9633d8.json | jq '.[:10]'
```

---

## Item Details

### 7. Get Story/Comment/Job Details

Fetch full details for any item by ID:

```bash
ITEM_ID="8863"

curl -s "https://hacker-news.firebaseio.com/v0/item/${ITEM_ID}.json" > /tmp/resp_7f2a30.json
cat /tmp/resp_7f2a30.json | jq .
```

**Response fields:**

| Field | Description |
|-------|-------------|
| `id` | Unique item ID |
| `type` | `story`, `comment`, `job`, `poll`, `pollopt` |
| `by` | Username of author |
| `time` | Unix timestamp |
| `title` | Story title (stories only) |
| `url` | Story URL (if external link) |
| `text` | Content text (Ask HN, comments) |
| `score` | Upvote count |
| `descendants` | Total comment count |
| `kids` | Array of child comment IDs |

### 8. Get Multiple Stories with Details

Fetch top 5 stories with full details:

```bash
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" > /tmp/topstories.json
for id in $(cat /tmp/topstories.json | jq '.[:5][]'); do
  curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json" > /tmp/resp_d9f85b.json
  cat /tmp/resp_d9f85b.json | jq '{id, title, score, url, by}'
done
```

### 9. Get Story with Comments

Fetch a story and its top-level comments:

```bash
STORY_ID="8863"

# Get story
STORY=$(curl -s "https://hacker-news.firebaseio.com/v0/item/${STORY_ID}.json")
echo "$STORY" | jq '{title, score, descendants}'

# Get first 3 comments
for kid in $(echo "$STORY" | jq '.kids[:3][]'); do
  curl -s "https://hacker-news.firebaseio.com/v0/item/${kid}.json" > /tmp/resp_6ce63a.json
  cat /tmp/resp_6ce63a.json | jq '{by, text}'
done
```

---

## User Data

### 10. Get User Profile

Fetch user details:

```bash
USERNAME="pg"

curl -s "https://hacker-news.firebaseio.com/v0/user/${USERNAME}.json" > /tmp/resp_c74d41.json
cat /tmp/resp_c74d41.json | jq .
```

**Response fields:**

| Field | Description |
|-------|-------------|
| `id` | Username |
| `created` | Account creation timestamp |
| `karma` | User's karma score |
| `about` | User bio (HTML) |
| `submitted` | Array of item IDs submitted |

### 11. Get User's Recent Submissions

```bash
USERNAME="pg"

curl -s "https://hacker-news.firebaseio.com/v0/user/${USERNAME}.json" > /tmp/resp_c74d41.json
cat /tmp/resp_c74d41.json | jq '.submitted[:5]'
```

---

## Real-time Updates

### 12. Get Max Item ID

Get the current largest item ID (useful for polling new items):

```bash
curl -s "https://hacker-news.firebaseio.com/v0/maxitem.json"
```

### 13. Get Changed Items and Profiles

Get recently changed items and profiles (for real-time updates):

```bash
curl -s "https://hacker-news.firebaseio.com/v0/updates.json" > /tmp/resp_fa51d8.json
cat /tmp/resp_fa51d8.json | jq .
```

---

## Practical Examples

### Fetch Today's Top 10 with Scores

```bash
echo "=== Top 10 Hacker News Stories ==="
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" > /tmp/topstories.json
for id in $(cat /tmp/topstories.json | jq '.[:10][]'); do
curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json" > /tmp/resp_d9f85b.json
cat /tmp/resp_d9f85b.json | jq -r '"\(.score) points | \(.title) | \(.url // "Ask HN")"'
done
```

### Find High-Scoring Stories (100+ points)

```bash
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" > /tmp/topstories.json
for id in $(cat /tmp/topstories.json | jq '.[:30][]'); do
curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json" > /tmp/resp_d9f85b.json
cat /tmp/resp_d9f85b.json | jq -r 'select(.score >= 100) | "\(.score) | \(.title)"'
done
```

### Get Latest AI/ML Related Stories

```bash
curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" > /tmp/topstories.json
for id in $(cat /tmp/topstories.json | jq '.[:50][]'); do
curl -s "https://hacker-news.firebaseio.com/v0/item/${id}.json" > /tmp/resp_d9f85b.json
cat /tmp/resp_d9f85b.json | jq -r 'select(.title | test("AI|GPT|LLM|Machine Learning|Neural"; "i")) | "\(.score) | \(.title)"'
done
```

---

## API Endpoints Summary

| Endpoint | Description |
|----------|-------------|
| `/v0/topstories.json` | Top 500 stories |
| `/v0/beststories.json` | Best stories |
| `/v0/newstories.json` | Newest 500 stories |
| `/v0/askstories.json` | Ask HN stories |
| `/v0/showstories.json` | Show HN stories |
| `/v0/jobstories.json` | Job postings |
| `/v0/item/{id}.json` | Item details |
| `/v0/user/{id}.json` | User profile |
| `/v0/maxitem.json` | Current max item ID |
| `/v0/updates.json` | Changed items/profiles |

---

## Guidelines

1. **No rate limits documented**: But be respectful, add delays for bulk fetching
2. **Use jq for filtering**: Filter JSON responses to extract needed data
3. **Cache results**: Stories don't change frequently, cache when possible
4. **Batch requests carefully**: Each item requires a separate API call
5. **Handle nulls**: Some fields may be null or missing (e.g., `url` for Ask HN)
6. **Unix timestamps**: All times are Unix timestamps, convert as needed
