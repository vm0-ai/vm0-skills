---
name: tldv
description: tl;dv API for meeting recordings. Use when user mentions "tl;dv", "meeting
  recording", "meeting summary", or asks about call analysis.
vm0_secrets:
  - TLDV_TOKEN
---

# tl;dv API

Access meeting recordings, transcripts, highlights, and AI-generated notes from tl;dv via the REST API.

> Official docs: `https://doc.tldv.io/index.html`

---

## When to Use

Use this skill when you need to:

- List and retrieve meeting recordings from Zoom, Google Meet, or Microsoft Teams
- Get structured transcripts with speaker identification and timestamps
- Access AI-generated meeting highlights, topics, and summaries
- Download meeting recordings
- Import external meeting recordings into tl;dv

---

---

## How to Use

All examples below assume you have `TLDV_TOKEN` set.

Base URL: `https://pasta.tldv.io`

API version: `v1alpha1` (alpha — endpoints may change before stable v1 release).

Authentication uses the `x-api-key` header (not Bearer).

---

## Health Check

### Verify API Connectivity

```bash
curl -s "https://pasta.tldv.io/v1alpha1/health" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq .
```

---

## Meetings

### List Meetings

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '.results[] | {id, name, happenedAt, duration, organizer: .organizer.name}'
```

### List Meetings with Pagination

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings?page=1&pageSize=10" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '{page, pages, total, meetings: [.results[] | {id, name, happenedAt}]}'
```

### Get Meeting by ID

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '{id, name, happenedAt, duration, url, organizer, invitees}'
```

### Download Meeting Recording

Returns a 302 redirect to a signed download URL (expires after 6 hours). Use `-L` to follow the redirect, or omit it to inspect the URL:

```bash
curl -s -I "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/download" --header "x-api-key: $(printenv TLDV_TOKEN)" | grep -i location
```

To download the recording directly:

```bash
curl -s -L -o /tmp/tldv_recording.mp4 "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/download" --header "x-api-key: $(printenv TLDV_TOKEN)"
```

### Import a Meeting

Write to `/tmp/tldv_request.json`:

```json
{
  "url": "https://example.com/recording.mp4"
}
```

```bash
curl -s -X POST "https://pasta.tldv.io/v1alpha1/meetings/import" --header "x-api-key: $(printenv TLDV_TOKEN)" --header "Content-Type: application/json" -d @/tmp/tldv_request.json | jq .
```

---

## Transcripts

### Get Meeting Transcript

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/transcript" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '.data[] | {speaker, text, startTime, endTime}'
```

### Get Full Transcript as Plain Text

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/transcript" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq -r '.data[] | "\(.speaker): \(.text)"'
```

---

## Highlights / Notes

### Get Meeting Highlights

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/highlights" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '.data[] | {text, startTime, source, topic: .topic.title, summary: .topic.summary}'
```

### Get Topic Summaries Only

```bash
curl -s "https://pasta.tldv.io/v1alpha1/meetings/<meeting_id>/highlights" --header "x-api-key: $(printenv TLDV_TOKEN)" | jq '[.data[] | .topic | select(. != null)] | unique_by(.title) | .[] | {title, summary}'
```

---

## Guidelines

1. Authentication uses the `x-api-key` header, not `Authorization: Bearer`. Every request must include `--header "x-api-key: $(printenv TLDV_TOKEN)"`.
2. The API is versioned at `v1alpha1`. This is an alpha API — endpoints and response formats may change.
3. All requests must use HTTPS. Plain HTTP requests are rejected.
4. API access requires the meeting organizer to have a Pro, Business, or Enterprise plan. Free plan organizers have no API access.
5. Meeting IDs are strings. Use `jq` to extract `id` fields from list responses.
6. Transcripts are only returned when processing is complete. If a meeting was just recorded, the transcript may not be available yet.
7. Download URLs from the `/download` endpoint expire after 6 hours.
8. Pagination: the meetings list returns `page`, `pages`, `total`, and `pageSize` fields. Use `?page=N` to navigate pages.
9. Use `<placeholder>` for dynamic IDs that the user must replace (e.g., `<meeting_id>`).
10. Write request bodies to `/tmp/tldv_request.json` before sending.
