---
name: google-meet
description: Google Meet API for managing meeting spaces, conference records, participants,
  recordings, and transcripts. Use when user mentions "Meet", "meeting space", "conference
  record", "meeting recording", "meeting transcript", or "Google Meet link".
---

# Google Meet API

Manage Google Meet spaces, conference records, participants, recordings, and transcripts via the Google Meet REST API.

> Official docs: https://developers.google.com/workspace/meet/api/reference/rest/v2

---

## Prerequisites

Connect the **Google Meet API** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## When to Use

Use this skill when you need to:

- Create and manage Google Meet meeting spaces
- Get or update meeting space configuration
- End an active conference in a meeting space
- List and retrieve conference records (past meetings)
- List participants in a conference
- List and retrieve meeting recordings
- List and retrieve meeting transcripts and transcript entries

---

---

> **Placeholders:** Values in `{curly-braces}` like `{space-name}` are placeholders. Replace them with actual values when executing.

---

## How to Use

Base URL: `https://meet.googleapis.com/v2`

---

## Spaces

A Space is a virtual place where conferences are held. Only one active conference can run in a space at a time.

### Create a Meeting Space

Create a new meeting space with a generated Meet link:

```bash
curl -s -X POST "https://meet.googleapis.com/v2/spaces" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{}' | jq '{name, meetingUri, meetingCode}'
```

Create with custom access configuration. Write to `/tmp/meet_request.json`:

```json
{
  "config": {
    "accessType": "TRUSTED",
    "entryPointAccess": "ALL",
    "attendanceReportGenerationType": "GENERATE_AUTOMATICALLY"
  }
}
```

Then run:

```bash
curl -s -X POST "https://meet.googleapis.com/v2/spaces" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/meet_request.json | jq '{name, meetingUri, meetingCode, config}'
```

### Get a Meeting Space

Get details for a space by name or meeting code:

```bash
curl -s "https://meet.googleapis.com/v2/spaces/{space-name}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '{name, meetingUri, meetingCode, config, activeConference}'
```

You can also use the meeting code (e.g. `abc-mnop-xyz`) as the space identifier:

```bash
curl -s "https://meet.googleapis.com/v2/spaces/{meeting-code}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '{name, meetingUri, meetingCode}'
```

### Update a Meeting Space

Patch space configuration. Write to `/tmp/meet_request.json`:

```json
{
  "config": {
    "accessType": "OPEN"
  }
}
```

Then run:

```bash
curl -s -X PATCH "https://meet.googleapis.com/v2/spaces/{space-name}?updateMask=config.accessType" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/meet_request.json | jq '{name, meetingUri, config}'
```

Available `accessType` values:
- `OPEN` — Anyone with the link can join
- `TRUSTED` — Only trusted users (those in same org or explicitly invited)
- `RESTRICTED` — Only explicitly invited users

### End an Active Conference

End the active conference in a meeting space:

```bash
curl -s -X POST "https://meet.googleapis.com/v2/spaces/{space-name}:endActiveConference" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{}'
```

---

## Conference Records

A ConferenceRecord represents a single instance of a meeting held in a space.

### List Conference Records

List all past conference records (most recent first):

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords?pageSize=20" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.conferenceRecords[]? | {name, startTime, endTime, space}'
```

Filter to records for a specific space:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords?filter=space%3D%22spaces%2F{space-name}%22&pageSize=10" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.conferenceRecords[]? | {name, startTime, endTime}'
```

Filter to only ongoing conferences:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords?filter=end_time%20IS%20NULL" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.conferenceRecords[]? | {name, startTime, space}'
```

### Get a Conference Record

Get details for a specific conference record:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '{name, startTime, endTime, expireTime, space}'
```

---

## Participants

### List Participants in a Conference

List all participants in a conference record:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/participants?pageSize=100" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.participants[]? | {name, earliestStartTime, latestEndTime}'
```

List only active (currently connected) participants:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/participants?filter=latest_end_time%20IS%20NULL" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.participants[]? | {name, earliestStartTime}'
```

### Get a Participant

Get details for a specific participant:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/participants/{participant-id}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.'
```

### List Participant Sessions

Get the individual sessions (join/leave events) for a participant:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/participants/{participant-id}/participantSessions" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.participantSessions[]? | {name, startTime, endTime}'
```

---

## Recordings

### List Recordings

List all recordings for a conference record:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/recordings" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.recordings[]? | {name, startTime, endTime, state}'
```

### Get a Recording

Get details for a specific recording (includes Drive file info):

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/recordings/{recording-id}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '{name, state, startTime, endTime, driveDestination}'
```

The `driveDestination` field contains the Google Drive file ID and export URI for downloading the recording.

---

## Transcripts

### List Transcripts

List all transcripts for a conference record:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/transcripts" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.transcripts[]? | {name, startTime, endTime, state}'
```

### Get a Transcript

Get details for a specific transcript:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/transcripts/{transcript-id}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '{name, state, startTime, endTime, docsDestination}'
```

The `docsDestination` field contains the Google Docs export ID and URI for the transcript document.

### List Transcript Entries

List the individual spoken segments in a transcript:

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords/{conference-record-id}/transcripts/{transcript-id}/entries?pageSize=100" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.entries[]? | {name, participant, text, startTime, endTime}'
```

---

## Common Patterns

### Get the Latest Meeting Record for a Space

```bash
curl -s "https://meet.googleapis.com/v2/conferenceRecords?filter=space%3D%22spaces%2F{space-name}%22&pageSize=1" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.conferenceRecords[0] | {name, startTime, endTime}'
```

### Check if a Meeting is Currently Active

```bash
curl -s "https://meet.googleapis.com/v2/spaces/{space-name}" \
  --header "Authorization: Bearer $GOOGLE_MEET_TOKEN" | jq '.activeConference'
```

Returns `null` if no active conference, or the conference record details if one is ongoing.

---

## Guidelines

1. **Space naming**: Spaces use the format `spaces/{space}` where `{space}` is a server-generated ID (e.g. `jQCFfuBOdN5z`). You can also use the friendly meeting code (e.g. `abc-mnop-xyz`) as an alias.
2. **Conference record IDs**: Use the format `conferenceRecords/{conferenceRecord}` as the parent path for participants, recordings, and transcripts.
3. **Ongoing vs ended**: Ongoing conferences have `endTime` unset. Use the `end_time IS NULL` filter to find active meetings.
4. **Pagination**: Use `pageToken` from `nextPageToken` in responses to fetch subsequent pages.
5. **Recordings and transcripts**: These are generated asynchronously. Check the `state` field — `ACTIVE` means generating, `ENDED` means complete.
6. **Drive and Docs integration**: Recordings link to Google Drive files; transcripts link to Google Docs. Use the Drive or Docs skill to access these artifacts.
7. **updateMask**: When PATCHing a space, specify `updateMask` as a comma-separated list of dot-notation field paths to avoid overwriting unintended fields.

---

## API Reference

- REST Reference: https://developers.google.com/workspace/meet/api/reference/rest/v2
- Spaces: https://developers.google.com/workspace/meet/api/reference/rest/v2/spaces
- Conference Records: https://developers.google.com/workspace/meet/api/reference/rest/v2/conferenceRecords
- Participants: https://developers.google.com/workspace/meet/api/reference/rest/v2/conferenceRecords.participants
- Recordings: https://developers.google.com/workspace/meet/api/reference/rest/v2/conferenceRecords.recordings
- Transcripts: https://developers.google.com/workspace/meet/api/reference/rest/v2/conferenceRecords.transcripts
- OAuth Scopes: https://developers.google.com/workspace/meet/api/reference/rest/v2/oauth-overview
