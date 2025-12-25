---
name: youtube
description: YouTube Data API v3 via curl. Use this skill to search videos, get video/channel info, list playlists, and fetch comments.
vm0_env:
  - YOUTUBE_API_KEY
---

# YouTube Data API

Use the YouTube Data API v3 via direct `curl` calls to **search videos, retrieve video details, get channel information, list playlist items, and fetch comments**.

> Official docs: `https://developers.google.com/youtube/v3`

---

## When to Use

Use this skill when you need to:

- **Search videos** by keywords or filters
- **Get video details** (title, description, statistics, duration)
- **Get channel info** (subscriber count, video count, description)
- **List playlist items** (videos in a playlist)
- **Fetch comments** on videos
- **Get trending videos** by region

---

## Prerequisites

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Library"
4. Search for "YouTube Data API v3" and enable it

### 2. Get API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key

```bash
export YOUTUBE_API_KEY="AIzaSy..."
```

### 3. (Optional) Restrict API Key

For production use, restrict the key:
- Application restrictions: HTTP referrers, IP addresses
- API restrictions: YouTube Data API v3 only

---

## How to Use

Base URL: `https://www.googleapis.com/youtube/v3`

---

### 1. Search Videos

```bash
curl -s "https://www.googleapis.com/youtube/v3/search?part=snippet&q=kubernetes+tutorial&type=video&maxResults=5&key=${YOUTUBE_API_KEY}" > /tmp/resp_6cce9e.json
cat /tmp/resp_6cce9e.json | jq '.items[] | {videoId: .id.videoId, title: .snippet.title, channel: .snippet.channelTitle}'
```

---

### 2. Search with Filters

Search for videos uploaded this year, ordered by view count:

```bash
curl -s "https://www.googleapis.com/youtube/v3/search?part=snippet&q=react+hooks&type=video&order=viewCount&publishedAfter=2024-01-01T00:00:00Z&maxResults=10&key=${YOUTUBE_API_KEY}" > /tmp/resp_b00ff5.json
cat /tmp/resp_b00ff5.json | jq '.items[] | {videoId: .id.videoId, title: .snippet.title}'
```

---

### 3. Get Video Details

```bash
curl -s "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${VIDEO_ID}&key=${YOUTUBE_API_KEY}" > /tmp/resp_818ce8.json
cat /tmp/resp_818ce8.json | jq '.items[0] | {title: .snippet.title, views: .statistics.viewCount, likes: .statistics.likeCount, duration: .contentDetails.duration}'
```

---

### 4. Get Multiple Videos

```bash
curl -s "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3&key=${YOUTUBE_API_KEY}" > /tmp/resp_e1d9eb.json
cat /tmp/resp_e1d9eb.json | jq '.items[] | {id: .id, title: .snippet.title, views: .statistics.viewCount}'
```

---

### 5. Get Trending Videos

```bash
curl -s "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=10&key=${YOUTUBE_API_KEY}" > /tmp/resp_5a8cd6.json
cat /tmp/resp_5a8cd6.json | jq '.items[] | {title: .snippet.title, channel: .snippet.channelTitle, views: .statistics.viewCount}'
```

---

### 6. Get Channel by ID

```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}" > /tmp/resp_d8f5ab.json
cat /tmp/resp_d8f5ab.json | jq '.items[0] | {title: .snippet.title, subscribers: .statistics.subscriberCount, videos: .statistics.videoCount}'
```

---

### 7. Get Channel by Handle

```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=@GoogleDevelopers&key=${YOUTUBE_API_KEY}" > /tmp/resp_711dc8.json
cat /tmp/resp_711dc8.json | jq '.items[0] | {id: .id, title: .snippet.title, subscribers: .statistics.subscriberCount}'
```

---

### 8. Get Channel by Username

```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=GoogleDevelopers&key=${YOUTUBE_API_KEY}" > /tmp/resp_5229a4.json
cat /tmp/resp_5229a4.json | jq '.items[0] | {id: .id, title: .snippet.title, description: .snippet.description}'
```

---

### 9. List Playlist Items

```bash
curl -s "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=20&key=${YOUTUBE_API_KEY}" > /tmp/resp_1c95e4.json
cat /tmp/resp_1c95e4.json | jq '.items[] | {position: .snippet.position, title: .snippet.title, videoId: .snippet.resourceId.videoId}'
```

---

### 10. Get Channel Uploads Playlist

First get the channel's uploads playlist ID, then list videos:

```bash
curl -s "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}" > /tmp/resp_ca02c1.json
cat /tmp/resp_ca02c1.json | jq -r '.items[0].contentDetails.relatedPlaylists.uploads'
```

---

### 11. Get Video Comments

```bash
curl -s "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&maxResults=20&order=relevance&key=${YOUTUBE_API_KEY}" > /tmp/resp_733c82.json
cat /tmp/resp_733c82.json | jq '.items[] | {author: .snippet.topLevelComment.snippet.authorDisplayName, text: .snippet.topLevelComment.snippet.textDisplay, likes: .snippet.topLevelComment.snippet.likeCount}'
```

---

### 12. Search Comments

```bash
curl -s "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&searchTerms=great+video&maxResults=10&key=${YOUTUBE_API_KEY}" > /tmp/resp_fd3efb.json
cat /tmp/resp_fd3efb.json | jq '.items[] | {author: .snippet.topLevelComment.snippet.authorDisplayName, text: .snippet.topLevelComment.snippet.textDisplay}'
```

---

### 13. Get Video Categories

```bash
curl -s "https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${YOUTUBE_API_KEY}" > /tmp/resp_70db30.json
cat /tmp/resp_70db30.json | jq '.items[] | {id: .id, title: .snippet.title}'
```

---

### 14. Search Videos by Category

```bash
curl -s "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=28&maxResults=10&key=${YOUTUBE_API_KEY}" > /tmp/resp_651157.json
cat /tmp/resp_651157.json | jq '.items[] | {videoId: .id.videoId, title: .snippet.title}'
```

Note: Category 28 = Science & Technology

---

### 15. Get Playlists from Channel

```bash
curl -s "https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=20&key=${YOUTUBE_API_KEY}" > /tmp/resp_a97aea.json
cat /tmp/resp_a97aea.json | jq '.items[] | {id: .id, title: .snippet.title, description: .snippet.description}'
```

---

## Common Video Categories

| ID | Category |
|----|----------|
| 1 | Film & Animation |
| 10 | Music |
| 17 | Sports |
| 20 | Gaming |
| 22 | People & Blogs |
| 24 | Entertainment |
| 25 | News & Politics |
| 26 | Howto & Style |
| 27 | Education |
| 28 | Science & Technology |

---

## Part Parameter Options

### Videos
- `snippet` - Title, description, thumbnails, channel
- `statistics` - Views, likes, comments count
- `contentDetails` - Duration, definition, caption
- `status` - Upload status, privacy, license
- `player` - Embeddable player

### Channels
- `snippet` - Title, description, thumbnails
- `statistics` - Subscribers, videos, views
- `contentDetails` - Related playlists (uploads, likes)
- `brandingSettings` - Channel customization

---

## Pagination

Use `nextPageToken` from response to get more results:

```bash
curl -s "https://www.googleapis.com/youtube/v3/search?part=snippet&q=python&type=video&maxResults=50&pageToken=${NEXT_PAGE_TOKEN}&key=${YOUTUBE_API_KEY}" > /tmp/resp_5e43cd.json
cat /tmp/resp_5e43cd.json | jq '.items[] | {title: .snippet.title}'
```

---

## Guidelines

1. **Quota limits**: API has 10,000 units/day quota. Search costs 100 units, most others cost 1 unit
2. **Rate limits**: Implement exponential backoff on 403/429 errors
3. **API key security**: Never expose API keys in client-side code
4. **Caching**: Cache responses to reduce quota usage
5. **Video IDs**: Extract from URLs like `youtube.com/watch?v=VIDEO_ID` or `youtu.be/VIDEO_ID`
