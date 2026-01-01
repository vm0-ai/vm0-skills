---
name: browserbase
description: Cloud browser infrastructure for AI agents - create sessions, persist contexts, and automate browsers
vm0_secrets:
  - BROWSERBASE_API_KEY
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
export BROWSERBASE_API_KEY="your-api-key-here"
export BROWSERBASE_PROJECT_ID="your-project-id-here"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
> ```

## How to Use

### 1. Create a Session

Create a new browser session:

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\"}"' | jq .
```

**With timeout and keepAlive:**

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"timeout\": 300, \"keepAlive\": true}"' | jq .
```

**With proxy enabled:**

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"proxies\": true}"' | jq .
```

**With specific region (us-west-2, us-east-1, eu-central-1, ap-southeast-1):**

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"region\": \"us-west-2\"}"' | jq .
```

**Response includes:**
- `id` - Session ID to use for connections
- `connectUrl` - WebSocket URL for Playwright/Puppeteer
- `seleniumRemoteUrl` - URL for Selenium connections
- `signingKey` - Key for HTTP connections

### 2. List Sessions

List all sessions with optional filters:

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

**Filter by status (RUNNING, ERROR, TIMED_OUT, COMPLETED):**

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions?status=RUNNING" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

**With pagination:**

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions?limit=10&page=1" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

**Query by user metadata:**

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions?q={\"userMetadata.env\":\"production\"}" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### 3. Get Session Details

Get details of a specific session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### 4. Update Session (Release)

Request to release a session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"status\": \"REQUEST_RELEASE\"}"' | jq .
```

### 5. Get Debug/Live URLs

Get live debugging URLs for a running session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'/debug" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

**Response includes:**
- `debuggerUrl` - Chrome DevTools debugger URL
- `debuggerFullscreenUrl` - Fullscreen debugger view
- `wsUrl` - WebSocket URL
- `pages` - Array of open pages with their debugger URLs

### 6. Get Session Logs

Retrieve logs from a session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'/logs" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### 7. Get Session Recording

Get the rrweb recording of a session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'/recording" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### 8. Get Session Downloads

Retrieve files downloaded during a session:

```bash
SESSION_ID="your-session-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/sessions/'"$SESSION_ID"'/downloads" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

---

## Contexts API

Contexts allow you to persist cookies, cache, and session storage across multiple browser sessions.

### Create a Context

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/contexts" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\"}"' | jq .
```

### List Contexts

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/contexts" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### Get Context Details

```bash
CONTEXT_ID="your-context-id"
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/contexts/'"$CONTEXT_ID"'" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### Create Session with Context

Use an existing context to restore cookies and login state:

```bash
CONTEXT_ID="your-context-id"
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"browserSettings\": {\"context\": {\"id\": \"'"$CONTEXT_ID"'\", \"persist\": true}}}"' | jq .
```

Set `persist: true` to save updates back to the context after the session ends.

### Delete Context

```bash
CONTEXT_ID="your-context-id"
bash -c 'curl -s -X DELETE "https://api.browserbase.com/v1/contexts/'"$CONTEXT_ID"'" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"'
```

---

## Extensions API

Upload and use Chrome extensions in your browser sessions.

### Upload Extension

Upload a ZIP file containing your Chrome extension:

```bash
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/extensions" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -F "file=@/path/to/extension.zip"' | jq .
```

### List Extensions

```bash
bash -c 'curl -s -X GET "https://api.browserbase.com/v1/extensions" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"' | jq .
```

### Create Session with Extension

```bash
EXTENSION_ID="your-extension-id"
bash -c 'curl -s -X POST "https://api.browserbase.com/v1/sessions" --header "Content-Type: application/json" --header "X-BB-API-Key: $BROWSERBASE_API_KEY" -d "{\"projectId\": \"$BROWSERBASE_PROJECT_ID\", \"extensionId\": \"'"$EXTENSION_ID"'\"}"' | jq .
```

### Delete Extension

```bash
EXTENSION_ID="your-extension-id"
bash -c 'curl -s -X DELETE "https://api.browserbase.com/v1/extensions/'"$EXTENSION_ID"'" --header "X-BB-API-Key: $BROWSERBASE_API_KEY"'
```

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/sessions` | POST | Create a new browser session |
| `/v1/sessions` | GET | List all sessions |
| `/v1/sessions/{id}` | GET | Get session details |
| `/v1/sessions/{id}` | POST | Update session (release) |
| `/v1/sessions/{id}/debug` | GET | Get live debug URLs |
| `/v1/sessions/{id}/logs` | GET | Get session logs |
| `/v1/sessions/{id}/recording` | GET | Get session recording (rrweb) |
| `/v1/sessions/{id}/downloads` | GET | Get downloaded files |
| `/v1/contexts` | POST | Create a new context |
| `/v1/contexts` | GET | List all contexts |
| `/v1/contexts/{id}` | GET | Get context details |
| `/v1/contexts/{id}` | DELETE | Delete a context |
| `/v1/extensions` | POST | Upload an extension |
| `/v1/extensions` | GET | List all extensions |
| `/v1/extensions/{id}` | DELETE | Delete an extension |

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

## Connect with Playwright

After creating a session, connect using Playwright:

```javascript
const { chromium } = require('playwright');

// Use the connectUrl from session creation response
const browser = await chromium.connectOverCDP(session.connectUrl);
const context = browser.contexts()[0];
const page = context.pages()[0];

await page.goto('https://example.com');
// ... automation code
await browser.close();
```

---

## Guidelines

1. **Session Lifecycle**: Sessions auto-terminate after timeout (default 5 minutes). Use `keepAlive: true` for longer sessions.
2. **Contexts**: Use contexts to persist login state and avoid repeated authentication.
3. **Proxies**: Enable proxies for geo-restricted content or to avoid rate limiting.
4. **Regions**: Choose a region close to your target websites for better performance.
5. **Debug URLs**: Use debug URLs for real-time human-in-the-loop debugging.
6. **Recordings**: Session replays use rrweb DOM reconstruction, not video files.
7. **Rate Limits**: Check your plan limits in the Browserbase dashboard.
