---
name: granola
description: Granola API for meeting notes. Use when user mentions "Granola", "meeting
  notes", or AI note-taking.
vm0_secrets:
  - GRANOLA_TOKEN
---

# Granola

Granola is an AI-powered meeting notes platform that automatically captures meeting transcripts, generates summaries, and organizes notes. Use the Enterprise API to programmatically access meeting notes, transcripts, summaries, attendees, and calendar event details.

> Official docs: `https://docs.granola.ai/introduction`

---

## When to Use

Use this skill when you need to:

- Retrieve meeting notes with summaries and transcripts
- List and filter meeting notes by date or update time
- Access calendar event details and attendee information for meetings
- Build integrations for CRM sync, knowledge bases, or custom workflows

---

## Prerequisites

1. You must be on the Granola Enterprise plan
2. Sign in to your Granola account as a workspace administrator
3. Go to **Settings > Workspaces > API** tab
4. Click **Generate API Key** and copy the key

Set environment variables:

```bash
export GRANOLA_TOKEN="your-granola-api-key"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

### Base URL

- **API**: `https://public-api.granola.ai`

### 1. List Notes

Retrieve all accessible meeting notes with pagination. Returns up to 30 notes per page.

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?page_size=10" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

### 2. List Notes with Pagination

Use the `cursor` from a previous response to fetch the next page.

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?page_size=10&cursor=CURSOR_VALUE" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

### 3. List Notes Filtered by Date

Filter notes created after or before a specific date, or updated after a specific date.

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?created_after=2025-01-01&page_size=20" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?created_before=2025-06-01&created_after=2025-01-01" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?updated_after=2025-03-01" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

### 4. Get a Specific Note

Retrieve detailed information about a single note including summaries, attendees, and calendar event details. Note IDs follow the pattern `not_` followed by 14 alphanumeric characters.

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes/not_XXXXXXXXXXXXXX" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

### 5. Get a Note with Transcript

Include the full meeting transcript by adding the `include=transcript` query parameter.

```bash
bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes/not_XXXXXXXXXXXXXX?include=transcript" --header "Authorization: Bearer $GRANOLA_TOKEN"' | jq .
```

### 6. Iterate Through All Notes

Paginate through all available notes using cursors.

```bash
CURSOR=""
while true; do
  if [ -z "$CURSOR" ]; then
    RESPONSE=$(bash -c 'curl -s -X GET "https://public-api.granola.ai/v1/notes?page_size=30" --header "Authorization: Bearer $GRANOLA_TOKEN"')
  else
    RESPONSE=$(bash -c "curl -s -X GET \"https://public-api.granola.ai/v1/notes?page_size=30&cursor=$CURSOR\" --header \"Authorization: Bearer \$GRANOLA_TOKEN\"")
  fi
  echo "$RESPONSE" | jq '.data[] | {id, title}'
  HAS_MORE=$(echo "$RESPONSE" | jq -r '.hasMore')
  if [ "$HAS_MORE" != "true" ]; then break; fi
  CURSOR=$(echo "$RESPONSE" | jq -r '.cursor')
done
```

---

## Response Structure

### List Notes Response

| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Array of note summary objects |
| `hasMore` | boolean | Whether more pages are available |
| `cursor` | string | Cursor for next page (present when hasMore is true) |

### Note Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Note ID (format: `not_` + 14 chars) |
| `title` | string | Note title |
| `owner` | object | Owner with name and email |
| `created_at` | string | ISO 8601 creation timestamp |
| `updated_at` | string | ISO 8601 last update timestamp |

### Full Note Fields (in addition to summary fields)

| Field | Type | Description |
|-------|------|-------------|
| `calendar_event` | object | Calendar event with title, invitees, organizer, scheduled times |
| `attendees` | array | List of meeting attendees |
| `summaries` | object | AI-generated summaries in text and markdown format |
| `transcript` | array | Transcript entries with speaker, text, and timestamps (only when `include=transcript`) |

---

## Guidelines

1. **API Key Scope**: API keys provide read-only access to publicly accessible notes within the workspace and notes shared in workspace-wide folders
2. **Rate Limits**: The API enforces a burst limit of 25 requests per 5 seconds and a sustained limit of 5 requests per second (300 per minute). Check for HTTP 429 responses and implement backoff
3. **Pagination**: Use cursor-based pagination with `page_size` (1-30, default 10) and `cursor` parameters. Always check `hasMore` to determine if more pages exist
4. **Transcripts**: Transcripts are not included by default. Use `include=transcript` query parameter when you need transcript data to reduce payload size
5. **Note ID Format**: Note IDs follow the pattern `not_` followed by 14 alphanumeric characters (e.g., `not_AbCdEfGhIjKlMn`)
6. **Enterprise Only**: This API is only available on the Granola Enterprise plan
