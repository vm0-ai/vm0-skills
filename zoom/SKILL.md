---
name: zoom
description: Zoom API for managing meetings, webinars, cloud recordings, and user
  data. Use when user mentions "Zoom", "Zoom meeting", "join URL", "cloud recording",
  or "webinar".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ZOOM_TOKEN` or `zero doctor check-connector --url https://api.zoom.us/v2/users/me --method GET`

## How to Use

Base URL: `https://api.zoom.us/v2`

All calls use `Authorization: Bearer $ZOOM_TOKEN`. The token is a short-lived (1 hour) OAuth access token — vm0 refreshes it automatically; skills never need to touch refresh tokens.

The `me` keyword can be substituted for a user ID when the authenticated user is the target (e.g. `/users/me/meetings`).

## Users

### Get Current User

```bash
curl -s "https://api.zoom.us/v2/users/me" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, email, first_name, last_name, account_id, type}'
```

### Get a User

```bash
curl -s "https://api.zoom.us/v2/users/<user-id>" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, email, first_name, last_name, type}'
```

## Meetings

### List Meetings

List meetings scheduled for the authenticated user. `type` can be `scheduled` (default), `live`, `upcoming`, `upcoming_meetings`, or `previous_meetings`.

```bash
curl -s "https://api.zoom.us/v2/users/me/meetings?type=upcoming&page_size=30" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.meetings[] | {id, topic, start_time, duration, join_url}'
```

### Get a Meeting

```bash
curl -s "https://api.zoom.us/v2/meetings/<meeting-id>" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, topic, start_time, duration, join_url, start_url, status, agenda, settings}'
```

### Create a Meeting

Meeting `type` values: `1` (instant), `2` (scheduled), `3` (recurring, no fixed time), `8` (recurring, fixed time).

Write to `/tmp/zoom_meeting.json`:

```json
{
  "topic": "Weekly sync",
  "type": 2,
  "start_time": "2026-05-01T10:00:00Z",
  "duration": 30,
  "timezone": "UTC",
  "agenda": "Review progress and blockers",
  "settings": {
    "join_before_host": true,
    "mute_upon_entry": true,
    "waiting_room": false,
    "auto_recording": "cloud"
  }
}
```

```bash
curl -s -X POST "https://api.zoom.us/v2/users/me/meetings" --header "Authorization: Bearer $ZOOM_TOKEN" --header "Content-Type: application/json" -d @/tmp/zoom_meeting.json | jq '{id, topic, start_time, join_url, start_url}'
```

### Update a Meeting

Zoom uses `PATCH` and only sends fields that changed. Write to `/tmp/zoom_meeting_update.json`:

```json
{
  "topic": "Weekly sync — rescheduled",
  "start_time": "2026-05-01T11:00:00Z",
  "duration": 45
}
```

```bash
curl -s -X PATCH "https://api.zoom.us/v2/meetings/<meeting-id>" --header "Authorization: Bearer $ZOOM_TOKEN" --header "Content-Type: application/json" -d @/tmp/zoom_meeting_update.json
```

Returns HTTP 204 with an empty body on success.

### Delete a Meeting

```bash
curl -s -X DELETE "https://api.zoom.us/v2/meetings/<meeting-id>" --header "Authorization: Bearer $ZOOM_TOKEN"
```

### End a Live Meeting

Set `action` to `end` to force-end an in-progress meeting.

Write to `/tmp/zoom_meeting_status.json`:

```json
{
  "action": "end"
}
```

```bash
curl -s -X PUT "https://api.zoom.us/v2/meetings/<meeting-id>/status" --header "Authorization: Bearer $ZOOM_TOKEN" --header "Content-Type: application/json" -d @/tmp/zoom_meeting_status.json
```

## Past Meeting Data

### List Past Meeting Participants

```bash
curl -s "https://api.zoom.us/v2/past_meetings/<meeting-uuid>/participants?page_size=100" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.participants[] | {id, name, user_email, join_time, leave_time, duration}'
```

The UUID is the `uuid` field from the meeting record, URL-encoded. If it contains `/` or `//`, encode twice.

### Get Past Meeting Summary

```bash
curl -s "https://api.zoom.us/v2/past_meetings/<meeting-uuid>" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, uuid, topic, start_time, end_time, participants_count, total_minutes}'
```

## Cloud Recordings

### List User Recordings

Required query parameters: `from` and `to` (ISO date strings). Lists recordings created within the date range (max 30 days).

```bash
curl -s "https://api.zoom.us/v2/users/me/recordings?from=2026-04-01&to=2026-04-30&page_size=30" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.meetings[] | {id, uuid, topic, start_time, recording_count, share_url}'
```

### Get Recordings for a Meeting

```bash
curl -s "https://api.zoom.us/v2/meetings/<meeting-id>/recordings" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, topic, recording_files: [.recording_files[] | {id, file_type, recording_type, download_url, play_url, status}]}'
```

`download_url` requires appending `?access_token=$ZOOM_TOKEN` (or a dedicated download token) to authenticate the download.

### Get Recording Transcript

If Zoom AI Companion or cloud recording transcripts are enabled, the transcript appears in `recording_files` with `file_type: "TRANSCRIPT"`. Download it via the file's `download_url`.

```bash
curl -s "https://api.zoom.us/v2/meetings/<meeting-id>/recordings" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.recording_files[] | select(.file_type == "TRANSCRIPT") | {id, download_url}'
```

## Webinars

### List Webinars

```bash
curl -s "https://api.zoom.us/v2/users/me/webinars?page_size=30" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.webinars[] | {id, topic, start_time, duration, join_url}'
```

### Get a Webinar

```bash
curl -s "https://api.zoom.us/v2/webinars/<webinar-id>" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '{id, topic, start_time, duration, join_url, registration_url}'
```

## Common Patterns

### Find the Most Recent Cloud Recording

```bash
curl -s "https://api.zoom.us/v2/users/me/recordings?from=2026-04-01&to=2026-04-30&page_size=1" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.meetings[0] | {id, uuid, topic, start_time, recording_files: [.recording_files[] | {file_type, recording_type, download_url}]}'
```

### Get the Join URL for the Next Scheduled Meeting

```bash
curl -s "https://api.zoom.us/v2/users/me/meetings?type=upcoming&page_size=1" --header "Authorization: Bearer $ZOOM_TOKEN" | jq '.meetings[0] | {topic, start_time, join_url}'
```

## Guidelines

1. **Meeting ID vs UUID**: Numeric meeting IDs identify a series; UUIDs identify a specific instance. Past-meeting endpoints (`/past_meetings/...`) require the UUID, and UUIDs containing `/` must be URL-encoded (double-encoded if they start with `/` or contain `//`).
2. **Pagination**: Responses include `next_page_token` when more pages exist. Pass it back as a query parameter to fetch subsequent pages. `page_size` defaults to 30, max 300 for most endpoints.
3. **Date ranges**: `/recordings` and historical endpoints cap ranges at 30 days. Split longer ranges into multiple calls.
4. **Timezones**: `start_time` in requests should be UTC (trailing `Z`) unless `timezone` is also provided. Responses always use UTC.
5. **Downloading recordings**: `download_url` is not bearer-authenticated — append `?access_token=$ZOOM_TOKEN` as a query parameter or request a short-lived download token. Do NOT send `Authorization: Bearer` for the file download itself.
6. **Rate limits**: Meeting-create endpoints are Light (≤20 req/s); recording list endpoints are Heavy (≤20 req/min). Back off on HTTP 429 using the `Retry-After` header.
7. **API version**: All endpoints use `/v2`. Older `/v1` endpoints are deprecated and return 404.

## API Reference

- REST API index: https://developers.zoom.us/docs/api/
- Meetings: https://developers.zoom.us/docs/api/meetings/
- Cloud Recording: https://developers.zoom.us/docs/api/cloud-recording/
- Webinars: https://developers.zoom.us/docs/api/webinars/
- Users: https://developers.zoom.us/docs/api/users/
- OAuth scopes reference: https://developers.zoom.us/docs/integrations/oauth-scopes/
