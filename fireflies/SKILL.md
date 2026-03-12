---
name: fireflies
description: Fireflies.ai API for meeting transcription. Use when user mentions "Fireflies",
  "meeting notes", "transcription", or "meeting summary".
vm0_secrets:
  - FIREFLIES_TOKEN
---

# Fireflies

Use the Fireflies.ai GraphQL API via direct `curl` calls to **transcribe and analyze meetings**.

> Official docs: `https://docs.fireflies.ai/`

---

## When to Use

Use this skill when you need to:

- **List and search meeting transcripts** by keyword, date, or participants
- **Fetch a single transcript** with full details, sentences, analytics, and summaries
- **Upload audio files** for transcription
- **Get user information** for the API key owner or team members

---

## Prerequisites

1. Sign up at https://app.fireflies.ai/
2. Navigate to **Settings > Developer Settings > API** to generate your API key
3. Copy the API key

```bash
export FIREFLIES_TOKEN="your-api-key"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `FIREFLIES_TOKEN` set.

Endpoint: `https://api.fireflies.ai/graphql`

The Fireflies API is **GraphQL-based**. All requests are `POST` to a single endpoint. Write the GraphQL query to `/tmp/fireflies_request.json`, then execute with curl.

---

## 1. Get Current User

Fetch details for the API key owner. Omit the `userId` variable to get the current user.

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query { user { user_id name email num_transcripts minutes_consumed is_admin integrations } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.user'
```

---

## 2. List Transcripts

Fetch a list of recent meeting transcripts.

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query { transcripts(limit: 10) { id title date duration organizer_email participants host_email } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcripts'
```

### Search by Keyword

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcripts($keyword: String) { transcripts(keyword: $keyword, limit: 10) { id title date duration } }",
  "variables": { "keyword": "product roadmap" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcripts'
```

### Filter by Date Range

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcripts($fromDate: DateTime, $toDate: DateTime) { transcripts(fromDate: $fromDate, toDate: $toDate, limit: 20) { id title date duration } }",
  "variables": { "fromDate": "2025-01-01T00:00:00.000Z", "toDate": "2025-12-31T23:59:59.000Z" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcripts'
```

### Filter by Participant

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcripts($participants: [String]) { transcripts(participants: $participants, limit: 10) { id title date participants } }",
  "variables": { "participants": ["alice@example.com"] }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcripts'
```

**Transcripts Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | String | Search in title and spoken words (max 255 chars) |
| `fromDate` / `toDate` | DateTime | ISO 8601 date range filter |
| `host_email` | String | Filter by host email |
| `organizers` | [String] | Filter by organizer emails |
| `participants` | [String] | Filter by participant emails |
| `mine` | Boolean | Only meetings owned by API key owner |
| `limit` | Int | Max results (default 50) |
| `skip` | Int | Pagination offset |

---

## 3. Get Single Transcript

Fetch full details for a specific transcript.

### Basic Info

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcript($transcriptId: String!) { transcript(id: $transcriptId) { id title date duration host_email organizer_email participants transcript_url audio_url } }",
  "variables": { "transcriptId": "your_transcript_id" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcript'
```

### With Summary and Action Items

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcript($transcriptId: String!) { transcript(id: $transcriptId) { id title summary { keywords action_items outline overview short_summary topics_discussed } } }",
  "variables": { "transcriptId": "your_transcript_id" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcript.summary'
```

### With Sentences (Full Transcript)

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcript($transcriptId: String!) { transcript(id: $transcriptId) { id title sentences { index speaker_name text start_time end_time } } }",
  "variables": { "transcriptId": "your_transcript_id" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcript.sentences'
```

### With Analytics

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query Transcript($transcriptId: String!) { transcript(id: $transcriptId) { id title analytics { sentiments { negative_pct neutral_pct positive_pct } speakers { name duration word_count words_per_minute questions filler_words } } } }",
  "variables": { "transcriptId": "your_transcript_id" }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.transcript.analytics'
```

---

## 4. Upload Audio for Transcription

Upload an audio file URL for Fireflies to transcribe. The file must be publicly accessible via HTTPS. Supported formats: mp3, mp4, wav, m4a, ogg.

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "mutation($input: AudioUploadInput) { uploadAudio(input: $input) { success title message } }",
  "variables": {
    "input": {
      "url": "https://example.com/meeting-recording.mp3",
      "title": "Team Standup 2025-01-15"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.uploadAudio'
```

### Upload with Attendees

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "mutation($input: AudioUploadInput) { uploadAudio(input: $input) { success title message } }",
  "variables": {
    "input": {
      "url": "https://example.com/meeting-recording.mp3",
      "title": "Product Review",
      "attendees": [
        { "displayName": "Alice", "email": "alice@example.com" },
        { "displayName": "Bob", "email": "bob@example.com" }
      ]
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.uploadAudio'
```

**Upload Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | String | Public HTTPS URL of audio/video file (required) |
| `title` | String | Title for the meeting |
| `attendees` | [Object] | Array of `{ displayName, email, phoneNumber }` |
| `webhook` | String | URL to notify when transcription completes |
| `custom_language` | String | Language code (e.g., `es`, `de`, `ja`) |
| `save_video` | Boolean | Retain video file |
| `client_reference_id` | String | Custom identifier for the upload |

---

## 5. List Team Users

Fetch all users in the team.

Write to `/tmp/fireflies_request.json`:

```json
{
  "query": "query { users { user_id name email is_admin num_transcripts minutes_consumed } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.fireflies.ai/graphql" --header "Content-Type: application/json" --header "Authorization: Bearer $FIREFLIES_TOKEN" -d @/tmp/fireflies_request.json' | jq '.data.users'
```

---

## Guidelines

1. **GraphQL single endpoint**: All requests go to `POST https://api.fireflies.ai/graphql` with the query in the JSON body
2. **Request only needed fields**: GraphQL lets you specify exactly which fields to return; keep queries minimal for better performance
3. **Pagination**: Use `limit` and `skip` parameters on the `transcripts` query. Maximum `limit` is 50
4. **Date format**: Use ISO 8601 format for `fromDate` and `toDate` (e.g., `2025-01-01T00:00:00.000Z`)
5. **Audio uploads are async**: After uploading, the transcription is queued. Use webhooks or poll the transcripts list to check completion
6. **File requirements**: Uploaded audio must be a valid HTTPS URL and publicly accessible. Supported formats: mp3, mp4, wav, m4a, ogg
7. **Check for errors**: GraphQL errors appear in the `errors` array of the response, not in HTTP status codes
