---
name: jam
description: Jam.dev API for bug reporting. Use when user mentions "Jam", "bug report",
  "screen recording", or asks about issue capture.
vm0_secrets:
  - JAM_TOKEN
---

# Jam

Use the Jam API to access **bug reports, debugging telemetry, console logs, network requests, and user events** captured by the Jam browser extension.

> Official docs: `https://jam.dev/docs/debug-a-jam/mcp`

---

## When to Use

Use this skill when you need to:

- **Retrieve bug report details** including metadata, reporters, and context
- **Access console logs** with error messages and stack traces from recorded sessions
- **Inspect network requests** to debug API failures, slow responses, or HTTP errors
- **Review user events** such as clicks, inputs, and page navigations
- **Get screenshots** from recorded bug reports for visual inspection
- **Analyze video recordings** to extract insights and detect issues
- **List and search Jams** across your workspace by text, type, folder, author, URL, or date
- **Add comments** to Jam recordings for collaboration

---

## Prerequisites

1. Sign up at [Jam](https://jam.dev/) and install the browser extension
2. Go to **Settings > Integrations > AI Agents** in your Jam workspace
3. Click **Create token**, specify a name, choose an expiration window (7 days to 1 year), and select scopes:
   - **mcp:read** - View Jam details, logs, events, and network activity
   - **mcp:write** - Move Jams between folders and add comments
4. Copy the token immediately (it is only shown once)

Token format: `jam_pat_<random-characters>`

```bash
export JAM_TOKEN="jam_pat_your-token-here"
```

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

Jam exposes its API through an MCP (Model Context Protocol) server at `https://mcp.jam.dev/mcp`. All interactions use JSON-RPC 2.0 over HTTP with Bearer token authentication. You need to initialize the MCP session first, then call tools.

### Base URL

- **MCP endpoint**: `https://mcp.jam.dev/mcp`

---

### 1. Initialize MCP Session

Start an MCP session to get a session URL for subsequent requests.

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d '"'"'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"vm0","version":"1.0.0"}}}'"'"'' -D /tmp/jam_headers.txt' | jq .
```

After initialization, check the response headers for the `Mcp-Session-Id` or use the session URL from the response. Save the session URL for subsequent calls:

```bash
SESSION_URL=$(grep -i "location:" /tmp/jam_headers.txt | tr -d '\r' | awk '{print $2}')
```

If no redirect location is returned, use the same endpoint with the session ID from the response headers.

---

### 2. List Available Tools

Discover all available MCP tools.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq '.result.tools[] | {name, description}'
```

---

### 3. List Jams

Search and filter Jams in your workspace.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "listJams",
    "arguments": {}
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

Filter by text, type, folder, author, URL, or date:

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "listJams",
    "arguments": {
      "text": "login bug",
      "type": "recording"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 4. Get Jam Details

Get a quick snapshot of a Jam including who made it, what happened, and which tools to try next. Replace `JAM_ID` with the actual Jam identifier (the URL slug or ID from listJams).

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "getDetails",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 5. Get Console Logs

Retrieve console logs from a Jam session, filtered by log level and count.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "getConsoleLogs",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID",
      "logLevel": "error",
      "limit": 50
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

Available `logLevel` values: `error`, `warn`, `info`, `log`, `debug`.

---

### 6. Get Network Requests

List all HTTP requests captured during the Jam recording, with optional filters.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "getNetworkRequests",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID",
      "statusCode": 500,
      "limit": 20
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

Filter parameters: `statusCode` (HTTP status code), `contentType` (e.g., `application/json`), `host` (e.g., `api.example.com`), `limit` (max results).

---

### 7. Get User Events

Read user interactions including clicks, inputs, and page navigations in plain language.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "getUserEvents",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 8. Get Screenshots

Extract screenshots from screenshot-type Jams for visual inspection.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "tools/call",
  "params": {
    "name": "getScreenshot",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 9. Get Video Transcript

Retrieve spoken captions from video Jams in WebVTT format with timestamps.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "tools/call",
  "params": {
    "name": "getVideoTranscript",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 10. Analyze Video

Use AI-powered analysis on Jam video recordings to extract insights, detect issues, and get structured feedback.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "tools/call",
  "params": {
    "name": "analyzeVideo",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 11. Get Custom Metadata

Access custom key-value metadata set via the `jam.metadata()` SDK in your application.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "tools/call",
  "params": {
    "name": "getMetadata",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 12. List Folders

Browse available folders in your Jam workspace.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "method": "tools/call",
  "params": {
    "name": "listFolders",
    "arguments": {}
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 13. List Team Members

Browse team members in your Jam workspace.

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 13,
  "method": "tools/call",
  "params": {
    "name": "listMembers",
    "arguments": {}
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 14. Add a Comment

Add a Markdown comment to a Jam recording (requires `mcp:write` scope).

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 14,
  "method": "tools/call",
  "params": {
    "name": "createComment",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID",
      "comment": "Investigated this issue - the root cause is a race condition in the auth middleware."
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

### 15. Move a Jam to a Folder

Move a Jam to a different folder (requires `mcp:write` scope).

Write to `/tmp/jam_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "method": "tools/call",
  "params": {
    "name": "updateJam",
    "arguments": {
      "jamUrl": "https://jam.dev/c/JAM_ID",
      "folder": "Triaged Bugs"
    }
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://mcp.jam.dev/mcp" --header "Content-Type: application/json" --header "Authorization: Bearer $JAM_TOKEN" -d @/tmp/jam_request.json' | jq .
```

---

## Guidelines

1. **Initialize first**: Always initialize an MCP session before calling tools. The session persists across multiple tool calls
2. **Use temp files for JSON**: Write JSON payloads to `/tmp/jam_request.json` to avoid shell quoting issues with nested JSON
3. **Token scopes matter**: `mcp:read` is sufficient for read operations (getDetails, getConsoleLogs, etc.). Use `mcp:write` only when you need to create comments or move Jams
4. **Token expiration**: PATs have mandatory expiration dates (7 days to 1 year). Plan for token rotation
5. **Jam URLs**: Most tools require a `jamUrl` parameter. Use the full URL format `https://jam.dev/c/JAM_ID`
6. **Debugging workflow**: Start with `getDetails` for an overview, then use `getConsoleLogs` (filter by `error`), `getNetworkRequests` (filter by 4xx/5xx status codes), and `getUserEvents` to build a complete picture
7. **Rate limits**: Jam enforces rate limits on their API. If you receive HTTP 429 responses, implement backoff
8. **MCP protocol**: All requests use JSON-RPC 2.0 format with `method: "tools/call"` and tool-specific arguments
