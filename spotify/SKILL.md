---
name: spotify
description: Spotify Web API for music streaming. Use when user mentions "Spotify", "play music", "Spotify playlist", "top tracks", "now playing", "Spotify artist", or asks about music playback or library.
vm0_secrets:
  - SPOTIFY_TOKEN
---

# Spotify Web API

Access Spotify's music catalog, manage playlists, control playback, and retrieve personalized listening data via the Spotify Web API.

> Official docs: `https://developer.spotify.com/documentation/web-api`

---

## When to Use

Use this skill when you need to:

- Search for tracks, albums, artists, or playlists
- Get current user profile and listening stats
- Retrieve the user's top tracks and artists
- List and manage playlists
- Control music playback (requires Spotify Premium)
- Get currently playing track or recent listening history

---

## Prerequisites

Go to [vm0.ai](https://app.vm0.ai) **Settings → Connectors** and connect **Spotify**. vm0 will automatically inject the required `SPOTIFY_TOKEN` environment variable.

> **Important:** The Spotify access token expires after 1 hour. If you receive a 401 error, the token needs to be refreshed via the Connector settings.

> **Note:** Playback control endpoints (play, pause, skip) require a **Spotify Premium** account.

---

## User Profile

### Get Current User Profile

```bash
curl -s "https://api.spotify.com/v1/me" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '{id, display_name, email, product, followers: .followers.total}'
```

---

## Search

### Search Tracks, Artists, Albums, or Playlists

Write to `/tmp/spotify_query.txt`:
```
<your-search-query>
```

```bash
curl -s -G "https://api.spotify.com/v1/search" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --data-urlencode "q@/tmp/spotify_query.txt" --data-urlencode "type=track,artist,album" -d "limit=5" | jq '{tracks: [.tracks.items[]? | {id, name, artists: [.artists[].name], album: .album.name, uri}], artists: [.artists.items[]? | {id, name, genres, uri}]}'
```

To search for playlists only:

```bash
curl -s -G "https://api.spotify.com/v1/search" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --data-urlencode "q@/tmp/spotify_query.txt" --data-urlencode "type=playlist" -d "limit=5" | jq '[.playlists.items[]? | {id, name, owner: .owner.display_name, tracks: .tracks.total, uri}]'
```

---

## Personalized Data

### Get Top Tracks

Requires scope: `user-top-read`.

`time_range` options: `short_term` (4 weeks), `medium_term` (6 months), `long_term` (all time).

```bash
curl -s "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.items[] | {name, artists: [.artists[].name], album: .album.name, uri}]'
```

### Get Top Artists

Requires scope: `user-top-read`.

```bash
curl -s "https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.items[] | {name, genres, popularity, uri}]'
```

### Get Recently Played Tracks

Requires scope: `user-read-recently-played`.

```bash
curl -s "https://api.spotify.com/v1/me/player/recently-played?limit=20" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.items[] | {played_at, track: .track.name, artists: [.track.artists[].name], uri: .track.uri}]'
```

---

## Playlists

### List Current User's Playlists

Requires scope: `playlist-read-private`.

```bash
curl -s "https://api.spotify.com/v1/me/playlists?limit=20" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.items[] | {id, name, owner: .owner.display_name, total_tracks: .tracks.total, uri}]'
```

### Get Playlist Tracks

Replace `<playlist-id>` with the actual playlist ID:

```bash
curl -s "https://api.spotify.com/v1/playlists/<playlist-id>/tracks?limit=50&fields=items(track(id,name,artists,album(name),uri))" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.items[] | {name: .track.name, artists: [.track.artists[].name], album: .track.album.name, uri: .track.uri}]'
```

### Create Playlist

Requires scope: `playlist-modify-public` or `playlist-modify-private`.

First, get your user ID:

```bash
curl -s "https://api.spotify.com/v1/me" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq -r '.id'
```

Write to `/tmp/spotify_playlist.json`:
```json
{
  "name": "<your-playlist-name>",
  "description": "<your-playlist-description>",
  "public": false
}
```

Replace `<user-id>` with your Spotify user ID:

```bash
curl -s -X POST "https://api.spotify.com/v1/users/<user-id>/playlists" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/spotify_playlist.json | jq '{id, name, uri}'
```

### Add Tracks to Playlist

Requires scope: `playlist-modify-public` or `playlist-modify-private`.

Write to `/tmp/spotify_add_tracks.json`:
```json
{
  "uris": [
    "spotify:track:<track-id-1>",
    "spotify:track:<track-id-2>"
  ]
}
```

Replace `<playlist-id>` with the target playlist ID:

```bash
curl -s -X POST "https://api.spotify.com/v1/playlists/<playlist-id>/tracks" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/spotify_add_tracks.json | jq '{snapshot_id}'
```

---

## Playback Control

> **Requires Spotify Premium.** All playback endpoints need an active Spotify client running on a device.

### Get Playback State

Requires scope: `user-read-playback-state`.

```bash
curl -s "https://api.spotify.com/v1/me/player" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '{device: .device.name, is_playing, track: .item.name, artists: [.item.artists[]?.name], progress_ms, duration_ms: .item.duration_ms}'
```

### Start or Resume Playback

Requires scope: `user-modify-playback-state`.

Play a specific playlist or album by URI:

Write to `/tmp/spotify_play.json`:
```json
{
  "context_uri": "spotify:playlist:<playlist-id>"
}
```

```bash
curl -s -X PUT "https://api.spotify.com/v1/me/player/play" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/spotify_play.json
```

Play specific tracks by URI:

Write to `/tmp/spotify_play.json`:
```json
{
  "uris": [
    "spotify:track:<track-id-1>",
    "spotify:track:<track-id-2>"
  ]
}
```

```bash
curl -s -X PUT "https://api.spotify.com/v1/me/player/play" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/spotify_play.json
```

### Pause Playback

Requires scope: `user-modify-playback-state`.

```bash
curl -s -X PUT "https://api.spotify.com/v1/me/player/pause" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)"
```

### Skip to Next Track

Requires scope: `user-modify-playback-state`.

```bash
curl -s -X POST "https://api.spotify.com/v1/me/player/next" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)"
```

### Skip to Previous Track

Requires scope: `user-modify-playback-state`.

```bash
curl -s -X POST "https://api.spotify.com/v1/me/player/previous" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)"
```

### Set Volume

Requires scope: `user-modify-playback-state`. Replace `<volume>` with a value between 0 and 100:

```bash
curl -s -X PUT "https://api.spotify.com/v1/me/player/volume?volume_percent=<volume>" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)"
```

---

## Albums & Artists

### Get Album

Replace `<album-id>` with the Spotify album ID:

```bash
curl -s "https://api.spotify.com/v1/albums/<album-id>" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '{id, name, artists: [.artists[].name], release_date, total_tracks, uri}'
```

### Get Artist

Replace `<artist-id>` with the Spotify artist ID:

```bash
curl -s "https://api.spotify.com/v1/artists/<artist-id>" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '{id, name, genres, popularity, followers: .followers.total, uri}'
```

### Get Artist's Top Tracks

Replace `<artist-id>` with the Spotify artist ID:

```bash
curl -s "https://api.spotify.com/v1/artists/<artist-id>/top-tracks" --header "Authorization: Bearer $(printenv SPOTIFY_TOKEN)" | jq '[.tracks[] | {name, album: .album.name, popularity, uri}]'
```

---

## Guidelines

1. **Token Expiry**: Access tokens expire after 1 hour. A 401 response means the token needs refreshing via the Connector settings.
2. **Scopes**: Different endpoints require different OAuth scopes. Ensure the connected Spotify app has the necessary scopes granted (listed per endpoint above).
3. **Premium Required**: All playback control endpoints (`/me/player/play`, `/me/player/pause`, `/me/player/next`, etc.) require a Spotify Premium subscription.
4. **Rate Limits**: Spotify enforces rate limits. If you receive a 429 response, back off and retry after the `Retry-After` header value (in seconds).
5. **Spotify URIs vs IDs**: Resources can be referenced by URI (`spotify:track:<id>`) or bare ID depending on the endpoint. Search results include both `id` and `uri` fields.
