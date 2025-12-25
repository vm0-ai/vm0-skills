---
name: podchaser
description: Podchaser GraphQL API for podcast data, discovery, episodes, creators, and sponsorship information.
vm0_env:
  - PODCHASER_CLIENT_ID
  - PODCHASER_CLIENT_SECRET
  - PODCHASER_ACCESS_TOKEN
---

# Podchaser API

Access comprehensive podcast data including shows, episodes, creators, networks, charts, and sponsorship information via GraphQL.

> Official docs: `https://api-docs.podchaser.com/docs/overview`

---

## When to Use

Use this skill when you need to:

- Search and discover podcasts by topic, category, or keywords
- Get detailed podcast and episode metadata
- Access Apple Podcasts and Spotify chart rankings
- Find sponsorship and advertising data
- Retrieve episode transcripts
- Look up podcast creators and networks

---

## Prerequisites

1. Create an account at https://www.podchaser.com/
2. Go to Account Settings > API Settings to get your Client ID and Secret
3. Use Development credentials during integration (Production works identically)

Set environment variables:

```bash
export PODCHASER_CLIENT_ID="your-client-id"
export PODCHASER_CLIENT_SECRET="your-client-secret"
export PODCHASER_ACCESS_TOKEN="your-access-token"  # After obtaining via mutation
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## How to Use

### 1. Get Access Token

Request an access token (valid for 1 year, store it for reuse):

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" -d "{\"query\": \"mutation { requestAccessToken(input: { grant_type: CLIENT_CREDENTIALS, client_id: \\\"$PODCHASER_CLIENT_ID\\\", client_secret: \\\"$PODCHASER_CLIENT_SECRET\\\" }) { access_token token_type expires_in } }\"}"' | jq .
```

Save the returned `access_token` to `PODCHASER_ACCESS_TOKEN`.

### 2. Search Podcasts

Search for podcasts by keyword:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ podcasts(searchTerm: \"technology\", first: 5) { paginatorInfo { count } data { id title description author { name } } } }"}'"'"'' | jq .
```

### 3. Get Podcast Details

Get detailed information about a specific podcast by ID:

```bash
PODCAST_ID="123456"
bash -c "curl -s -X POST \"https://api.podchaser.com/graphql\" --header \"Content-Type: application/json\" --header \"Authorization: Bearer \$PODCHASER_ACCESS_TOKEN\" -d '{\"query\": \"{ podcast(identifier: { id: \\\"${PODCAST_ID}\\\" }) { id title description url imageUrl language ratingAverage ratingCount author { name } categories { title } } }\"}'" | jq .
```

### 4. Search Episodes

Search for episodes across all podcasts:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ episodes(searchTerm: \"AI\", first: 5) { paginatorInfo { count } data { id title description airDate length podcast { title } } } }"}'"'"'' | jq .
```

### 5. Get Podcast Episodes

Get episodes for a specific podcast:

```bash
PODCAST_ID="123456"
bash -c "curl -s -X POST \"https://api.podchaser.com/graphql\" --header \"Content-Type: application/json\" --header \"Authorization: Bearer \$PODCHASER_ACCESS_TOKEN\" -d '{\"query\": \"{ podcast(identifier: { id: \\\"${PODCAST_ID}\\\" }) { id title episodes(first: 10) { data { id title description airDate length } } } }\"}'" | jq .
```

### 6. Get Episode Details

Get detailed information about a specific episode:

```bash
EPISODE_ID="789012"
bash -c "curl -s -X POST \"https://api.podchaser.com/graphql\" --header \"Content-Type: application/json\" --header \"Authorization: Bearer \$PODCHASER_ACCESS_TOKEN\" -d '{\"query\": \"{ episode(identifier: { id: \\\"${EPISODE_ID}\\\" }) { id title description airDate length url imageUrl podcast { id title } } }\"}'" | jq .
```

### 7. Browse Categories

List available podcast categories:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ categories { id title slug } }"}'"'"'' | jq .
```

### 8. Filter Podcasts by Category

Get podcasts in a specific category:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ podcasts(filters: { categories: [\"technology\"] }, first: 10) { data { id title description ratingAverage } } }"}'"'"'' | jq .
```

### 9. Get Chart Rankings

Get Apple Podcasts chart data:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ podcasts(filters: { hasAppleChartRank: true }, sort: { sortBy: APPLE_CHART_RANK, direction: ASC }, first: 10) { data { id title appleChartRank } } }"}'"'"'' | jq .
```

### 10. Get Creator/Host Information

Search for podcast creators:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ creators(searchTerm: \"Joe Rogan\", first: 5) { data { id name bio podcasts { data { id title } } } } }"}'"'"'' | jq .
```

### 11. Preview Query Cost

Check how many points a query will cost before executing:

```bash
bash -c 'curl -s -X POST "https://api.podchaser.com/graphql/cost" --header "Content-Type: application/json" --header "Authorization: Bearer $PODCHASER_ACCESS_TOKEN" -d '"'"'{"query": "{ podcasts(searchTerm: \"tech\", first: 10) { data { id title description episodes(first: 5) { data { id title } } } } }"}'"'"'' | jq .
```

---

## GraphQL Schema Reference

### Main Queries

| Query | Description |
|-------|-------------|
| `podcast(identifier: {id: "..."})` | Get single podcast by ID |
| `podcasts(searchTerm: "...", first: N)` | Search podcasts |
| `episode(identifier: {id: "..."})` | Get single episode by ID |
| `episodes(searchTerm: "...", first: N)` | Search episodes |
| `creators(searchTerm: "...", first: N)` | Search creators/hosts |
| `categories` | List all categories |
| `networks` | List podcast networks |

### Podcast Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | Unique identifier |
| `title` | String | Podcast title |
| `description` | String | Podcast description |
| `url` | String | Podcast website URL |
| `imageUrl` | String | Cover art URL |
| `language` | String | Primary language |
| `ratingAverage` | Float | Average user rating |
| `ratingCount` | Int | Number of ratings |
| `author` | Creator | Podcast author/creator |
| `categories` | [Category] | Associated categories |
| `episodes` | [Episode] | Podcast episodes |
| `appleChartRank` | Int | Apple Podcasts chart rank |
| `spotifyChartRank` | Int | Spotify chart rank |

### Episode Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | Unique identifier |
| `title` | String | Episode title |
| `description` | String | Episode description |
| `airDate` | Date | Publication date |
| `length` | Int | Duration in seconds |
| `url` | String | Episode URL |
| `imageUrl` | String | Episode artwork URL |
| `podcast` | Podcast | Parent podcast |
| `transcript` | String | Episode transcript |

### Filter Options

| Filter | Values |
|--------|--------|
| `categories` | Category slugs |
| `language` | ISO language codes |
| `hasAppleChartRank` | Boolean |
| `hasSpotifyChartRank` | Boolean |

### Sort Options

| sortBy | Description |
|--------|-------------|
| `RELEVANCE` | Search relevance |
| `POPULARITY` | Overall popularity |
| `RATING` | User rating |
| `APPLE_CHART_RANK` | Apple ranking |
| `SPOTIFY_CHART_RANK` | Spotify ranking |
| `LATEST_EPISODE` | Most recent episode |

---

## Rate Limits

- **Request Limit**: 50 requests per 10 seconds
- **Points System**: Query cost based on fields returned
- **Response Headers**:
  - `X-Podchaser-Points-Remaining`: Available points
  - `X-Podchaser-Query-Cost`: Points consumed

**Example costs:**
- Basic podcast metadata: ~9 points
- Search 10 podcasts with details: ~100 points

---

## Guidelines

1. **Store Access Token**: Tokens last 1 year, avoid requesting new tokens for each query
2. **Preview Costs**: Use `/graphql/cost` endpoint to estimate query cost before execution
3. **Use Limited Scope**: For client-side apps, request tokens with `limited_scope: true` (1 hour expiry)
4. **Optimize Queries**: Request only needed fields to minimize points consumption
5. **Handle Rate Limits**: Check `Retry-After` header on 429 responses
6. **Security**: Never expose regular access tokens in client-side code
