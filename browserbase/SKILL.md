---
name: browserbase
description: Browserbase API for headless browser automation. Use when user mentions
  "headless browser", "browser automation", or "Browserbase".
vm0_secrets:
  - BROWSERBASE_TOKEN
- BROWSERBASE_PROJECT_ID
---

# Browserbase

Cloud browser infrastructure for AI agents and automation. Create browser sessions, persist authentication with contexts, debug live sessions, and retrieve session recordings.

> Official docs: https://docs.browserbase.com/

---

## When to Use

Use this skill when you need to:

- Create cloud browser sessions for Playwright/Puppeteer automation
- Persist login state and cookies across sessions using Contexts
- Debug browser sessions in real-time with live URLs
- Retrieve session recordings and logs for debugging
- Manage browser sessions programmatically (list, get, update)
- Run browser automation with proxy and stealth support

---

## Prerequisites

1. Create an account at https://www.browserbase.com/
2. Get your API Key from the dashboard Settings page
3. Get your Project ID from the dashboard Settings page

Set environment variables:

```bash
export BROWSERBASE_TOKEN="your-api-key-here"
export BROWSERBASE_PROJECT_ID="your-project-id-here"
```

> **Note:** Free plans have a concurrent session limit of 1. You'll receive a 429 error if you exceed this limit. Check your plan details in the Browserbase dashboard.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/browserbase-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "api-key: $BROWSERBASE_TOKEN" "$@"
EOF
chmod +x /tmp/browserbase-curl
```

**Usage:** All examples below use `/tmp/browserbase-curl` instead of direct `curl` calls.

## How to Use

### 1. Create a Session

Create a new browser session:

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>"
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions" -d @/tmp/request.json
```

**With timeout and keepAlive:**

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>",
  "timeout": 300,
  "keepAlive": true
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions" -d @/tmp/request.json
```

**With proxy enabled (requires paid plan):**

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>",
  "proxies": true
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions" -d @/tmp/request.json
```

> **Note:** Proxies are not available on the free plan. You'll receive a 402 error if you try to use this feature without upgrading.

**With specific region (us-west-2, us-east-1, eu-central-1, ap-southeast-1):**

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>",
  "region": "us-west-2"
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions" -d @/tmp/request.json
```

**Response includes:**
- `id` - Session ID to use for connections
- `connectUrl` - WebSocket URL for Playwright/Puppeteer
- `seleniumRemoteUrl` - URL for Selenium connections
- `signingKey` - Key for HTTP connections

### 2. List Sessions

List all sessions with optional filters:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions"
```

**Filter by status (RUNNING, ERROR, TIMED_OUT, COMPLETED):**

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions?status=RUNNING"
```

**Query by user metadata:**

> **Note:** The query syntax for user metadata filtering uses single quotes: `user_metadata['key']:'value'`. To avoid complex shell escaping, write the query to a file and use `--data-urlencode "q@filename"`.

Write `/tmp/query.txt` with content:
```
user_metadata['test']:'true'
```

Then query sessions:
```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions"
```

**More examples:**

Query by stagehand metadata - write `/tmp/query.txt`:
```
user_metadata['stagehand']:'true'
```

Query by environment - write `/tmp/query.txt`:
```
user_metadata['env']:'production'
```

Then run:
```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions"
```

### 3. Get Session Details

Get details of a specific session. Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions/<your-session-id>"
```

### 4. Update Session (Release)

Request to release a session before its timeout to avoid additional charges. Replace `<your-session-id>` with the actual session ID:

Write `/tmp/request.json`:
```json
{
  "status": "REQUEST_RELEASE"
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions/<your-session-id>" -d @/tmp/request.json
```

The session status will change to `COMPLETED` and `endedAt` timestamp will be set.

### 5. Get Debug/Live URLs

Get live debugging URLs for a running session. Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions/<your-session-id>/debug"
```

> **Note:** Debug URLs may only be available after a browser client has connected to the session via WebSocket.

**Response includes:**
- `debuggerUrl` - Chrome DevTools debugger URL
- `debuggerFullscreenUrl` - Fullscreen debugger view
- `wsUrl` - WebSocket URL
- `pages` - Array of open pages with their debugger URLs

### 6. Get Session Logs

Retrieve logs from a session. Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions/<your-session-id>/logs"
```

### 7. Get Session Recording

Get the rrweb recording of a session. Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions/<your-session-id>/recording"
```

### 8. Get Session Downloads

Retrieve files downloaded during a session (returns ZIP file). Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/sessions/<your-session-id>/downloads" --output downloads.zip
```

### 9. Upload Files to Session

Upload files to use in a browser session. Replace `<your-session-id>` with the actual session ID:

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions/<your-session-id>/uploads"
```

---

## Contexts API

Contexts allow you to persist cookies, cache, and session storage across multiple browser sessions.

### Create a Context

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>"
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/contexts" -d @/tmp/request.json
```

Save the returned `id` to use in sessions.

### Get Context Details

Retrieve details of a specific context. Replace `<your-context-id>` with the actual context ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/contexts/<your-context-id>"
```

**Response includes:**
- `id` - Context identifier
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `projectId` - The Project ID linked to the context

### Create Session with Context

Use an existing context to restore cookies and login state. Replace `<your-context-id>` with the actual context ID:

Write `/tmp/request.json`:
```json
{
  "projectId": "<your-project-id>",
  "browserSettings": {
    "context": {
      "id": "<your-context-id>",
      "persist": true
    }
  }
}
```

```bash
/tmp/browserbase-curl -X POST "https://api.browserbase.com/v1/sessions" -d @/tmp/request.json
```

Set `persist: true` to save updates back to the context after the session ends.

### Delete Context

Delete a context when it's no longer needed. Replace `<your-context-id>` with the actual context ID:

```bash
/tmp/browserbase-curl -X DELETE "https://api.browserbase.com/v1/contexts/<your-context-id>"
```

Successful deletion returns HTTP 204 (No Content).

---

## Projects API

### Get Project Usage

Retrieve project-wide usage statistics (browser minutes and proxy bytes). Replace `<your-project-id>` with your actual project ID:

```bash
/tmp/browserbase-curl -X GET "https://api.browserbase.com/v1/projects/<your-project-id>/usage"
```

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/sessions` | POST | Create a new browser session |
| `/v1/sessions` | GET | List all sessions |
| `/v1/sessions/{id}` | GET | Get session details (returns array) |
| `/v1/sessions/{id}` | POST | Update session (release) |
| `/v1/sessions/{id}/debug` | GET | Get live debug URLs |
| `/v1/sessions/{id}/logs` | GET | Get session logs |
| `/v1/sessions/{id}/recording` | GET | Get session recording (rrweb) |
| `/v1/sessions/{id}/downloads` | GET | Get downloaded files (ZIP) |
| `/v1/sessions/{id}/uploads` | POST | Upload files to session |
| `/v1/contexts` | POST | Create a new context |
| `/v1/contexts/{id}` | GET | Get context details |
| `/v1/contexts/{id}` | DELETE | Delete a context |
| `/v1/projects/{id}/usage` | GET | Get project usage stats |

---

## Session Status Values

| Status | Description |
|--------|-------------|
| `RUNNING` | Session is currently active |
| `COMPLETED` | Session ended successfully |
| `ERROR` | Session ended with an error |
| `TIMED_OUT` | Session exceeded timeout |
| `REQUEST_RELEASE` | Request to end session |

---

## Guidelines

1. **Session Lifecycle**: Sessions auto-terminate after timeout (default 5 minutes). Use `keepAlive: true` for longer sessions.
2. **Contexts**: Use contexts to persist login state and avoid repeated authentication.
3. **Proxies**: Enable proxies for geo-restricted content or to avoid rate limiting.
4. **Regions**: Choose a region close to your target websites for better performance.
5. **Debug URLs**: Use debug URLs for real-time human-in-the-loop debugging.
6. **Recordings**: Session replays use rrweb DOM reconstruction, not video files.
7. **Rate Limits**: Check your plan limits in the Browserbase dashboard.
