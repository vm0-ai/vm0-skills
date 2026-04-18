---
name: buffer
description: Buffer API for social media post scheduling and channel management. Use when user mentions "Buffer", "bufferapp", "schedule post", "social media queue", "cross-post", or managing Twitter/X, LinkedIn, Instagram, Facebook, TikTok, Threads, Mastodon, Bluesky, Pinterest, YouTube, or Google Business posts through Buffer.
homepage: https://buffer.com
docs: https://developers.buffer.com
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BUFFER_TOKEN` or `zero doctor check-connector --url https://api.buffer.com --method POST`

> **Beta API.** Buffer's public API is currently in **beta**. Personal API keys replace the legacy OAuth v1 API. Only organization **owners** can create keys (paid accounts: up to 5 keys, free accounts: 1 key). The legacy REST API at `api.bufferapp.com/1/*` still exists but is not accepting new developer applications and requires OAuth — it is not used by this connector.

## How It Works

Buffer is a social media scheduling platform. The beta API is **GraphQL-only**, served from a single endpoint. Every request is a `POST` with a JSON `{"query": "...", "variables": {...}}` body.

```
Account
└── Organizations
    └── Channels (Twitter, LinkedIn, Instagram, Facebook, TikTok, Threads, Mastodon, Bluesky, Pinterest, YouTube, Google Business)
        └── Posts (draft | scheduled | sent)
```

Base URL: `https://api.buffer.com`

## Authentication

All requests require a personal API key passed as a Bearer token:

```
Authorization: Bearer $BUFFER_TOKEN
Content-Type: application/json
```

Requests without a valid key return `401 Unauthorized`.

## Environment Variables

| Variable | Description |
|---|---|
| `BUFFER_TOKEN` | Buffer personal API key (from Developer Dashboard) |

## Key Operations

All calls hit the same endpoint: `POST https://api.buffer.com`. Change only the GraphQL document.

### 1. List Organizations

Write `/tmp/buffer_orgs.json`:

```json
{
  "query": "query GetOrganizations { account { organizations { id name } } }"
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_orgs.json
```

### 2. List Channels (Connected Social Accounts)

Write `/tmp/buffer_channels.json` — replace `<organization-id>` with an id from step 1:

```json
{
  "query": "query GetChannels($organizationId: String!) { channels(input: { organizationId: $organizationId }) { id name service serviceId serviceType timezone } }",
  "variables": { "organizationId": "<organization-id>" }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_channels.json
```

### 3. Create a Scheduled Post

Buffer publishes the same text to one or more channels. Write `/tmp/buffer_create_post.json` — replace `<channel-id>` with a channel id from step 2. `scheduledAt` is an ISO-8601 timestamp; omit it to add to the end of the queue.

```json
{
  "query": "mutation CreatePost($input: PostCreateInput!) { createPost(input: $input) { id status scheduledAt text } }",
  "variables": {
    "input": {
      "organizationId": "<organization-id>",
      "channelIds": ["<channel-id>"],
      "text": "Launching today: our new onboarding flow. Read more at https://example.com",
      "scheduledAt": "2026-05-01T15:00:00Z",
      "status": "scheduled"
    }
  }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_create_post.json
```

Valid `status` values:
- `draft` — saved as a draft, not queued
- `scheduled` — queued at `scheduledAt`
- `needsApproval` — posted to the approval queue

### 4. Create a Post with Media

Attach images or a video by passing a `media` object. Write `/tmp/buffer_create_image_post.json`:

```json
{
  "query": "mutation CreatePost($input: PostCreateInput!) { createPost(input: $input) { id status } }",
  "variables": {
    "input": {
      "organizationId": "<organization-id>",
      "channelIds": ["<channel-id>"],
      "text": "Ship log: weekly changelog is live.",
      "media": {
        "photos": [
          { "url": "https://example.com/screenshot.png", "altText": "Changelog screenshot" }
        ]
      },
      "status": "scheduled",
      "scheduledAt": "2026-05-01T15:00:00Z"
    }
  }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_create_image_post.json
```

For video, swap `photos` for `video: { url: "<url>", thumbnailUrl: "<url>" }`.

### 5. List Pending/Scheduled Posts

Write `/tmp/buffer_posts.json`:

```json
{
  "query": "query GetPosts($input: PostsInput!) { posts(input: $input) { edges { node { id status text scheduledAt channel { id service } } } pageInfo { hasNextPage endCursor } } }",
  "variables": {
    "input": {
      "organizationId": "<organization-id>",
      "status": ["scheduled"],
      "first": 25
    }
  }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_posts.json | jq '.data.posts.edges[].node'
```

Change `status` to `["sent"]` for history, `["draft"]` for drafts, or `["needsApproval"]` for the approval queue.

### 6. Update a Post

Write `/tmp/buffer_update_post.json` — replace `<post-id>`:

```json
{
  "query": "mutation UpdatePost($input: PostUpdateInput!) { updatePost(input: $input) { id text scheduledAt } }",
  "variables": {
    "input": {
      "postId": "<post-id>",
      "text": "Updated copy.",
      "scheduledAt": "2026-05-02T15:00:00Z"
    }
  }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_update_post.json
```

### 7. Delete a Post

Write `/tmp/buffer_delete_post.json`:

```json
{
  "query": "mutation DeletePost($input: PostDeleteInput!) { deletePost(input: $input) { id } }",
  "variables": { "input": { "postId": "<post-id>" } }
}
```

```bash
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_delete_post.json
```

### 8. Publish Immediately (Share Now)

Set `status: "scheduled"` and `scheduledAt` to a timestamp a few seconds in the past, or use the dedicated share mutation when available. For queue-top placement, omit `scheduledAt` and set `shareNext: true` in the input.

## Common Workflows

### Cross-Post to Multiple Channels

Put all target channel IDs in the same `channelIds` array. Buffer fans out one post per channel and returns a single parent post id.

```json
{
  "query": "mutation CreatePost($input: PostCreateInput!) { createPost(input: $input) { id } }",
  "variables": {
    "input": {
      "organizationId": "<organization-id>",
      "channelIds": ["<twitter-channel-id>", "<linkedin-channel-id>", "<bluesky-channel-id>"],
      "text": "Launching today.",
      "status": "scheduled",
      "scheduledAt": "2026-05-01T15:00:00Z"
    }
  }
}
```

### Paginate Sent Posts

```bash
# First page
curl -s -X POST "https://api.buffer.com" --header "Authorization: Bearer $BUFFER_TOKEN" --header "Content-Type: application/json" -d @/tmp/buffer_posts.json | jq '{next: .data.posts.pageInfo.endCursor, nodes: [.data.posts.edges[].node | {id, text, scheduledAt}]}'
```

Replace the `"first"` field in `input` with `"after": "<endCursor>"` to continue.

## Guidelines

1. **Send payloads as JSON files** with `-d @/tmp/filename.json` — do not inline complex GraphQL documents.
2. **Query introspection** is the fastest way to discover unfamiliar fields: `{"query": "{ __schema { queryType { fields { name } } } }"}`.
3. **Rate limits are per-client** and rolling — personal API keys share one bucket; if you have multiple keys, create a distinct key per integration.
4. **Analytics data is not exposed** in the beta API yet. For post-level stats, use Buffer's web dashboard.
5. **Do not edit posts** that have already been sent — Buffer's API currently rejects `updatePost` once `status: "sent"`.
6. **Organization IDs are stable**; cache them instead of re-querying on every request.
