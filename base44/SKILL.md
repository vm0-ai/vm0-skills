---
name: base44
description: Base44 API and MCP integration for creating, listing, and managing AI apps.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BASE44_TOKEN` or `zero doctor check-connector --url https://app.base44.com/api/apps --method GET`

## How to Use

Base44 exposes two useful integration surfaces:

- App REST API at `https://app.base44.com/api/apps`
- MCP endpoint at `https://app.base44.com/mcp`

Use the App REST API for direct app management, and use MCP when an agent needs to discover and call Base44 tools.

## Discover the Full Interface

### MCP Tools and Schemas

`tools/list` is the source of truth for the current MCP interface. It returns every available tool with descriptions and input schemas.

Write to `/tmp/base44_mcp_request.json`:

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
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d @/tmp/base44_mcp_request.json | sed -n 's/^data: //p' | jq '.result.tools[] | {name, description, inputSchema}'
```

Inspect one tool schema before calling it:

```bash
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d @/tmp/base44_mcp_request.json | sed -n 's/^data: //p' | jq --arg name "create_base44_app" '.result.tools[] | select(.name == $name) | {name, description, inputSchema}'
```

Current confirmed MCP tools:

- `create_base44_app`
- `edit_base44_app`
- `get_app_status`
- `get_app_preview_url`
- `list_user_apps`
- `list_entity_schemas`
- `create_entity_schema`
- `update_entity_schema`
- `query_entities`
- `create_entities`
- `update_entities`

### App REST API Endpoints

Base44 does not currently expose a machine-readable discovery document for the App REST API. Use the confirmed endpoint map below for common app operations. For edge cases, check the official Base44 CLI source at `https://github.com/base44/cli`.

| Operation | Method | Path |
| --- | --- | --- |
| Create app | `POST` | `/api/apps` |
| List apps | `GET` | `/api/apps` |
| Get app config | `GET` | `/api/apps/{app_id}` |
| Update auth config | `PUT` | `/api/apps/{app_id}` |
| Download app source | `GET` | `/api/apps/{app_id}/eject` |
| Get published URL | `GET` | `/api/apps/platform/{app_id}/published-url` |
| Upload site archive | `POST` | `/api/apps/{app_id}/deploy-dist` |
| Sync entity schemas | `PUT` | `/api/apps/{app_id}/entity-schemas` |
| List backend functions | `GET` | `/api/apps/{app_id}/backend-functions` |
| Deploy backend function | `PUT` | `/api/apps/{app_id}/backend-functions/{function_name}` |
| Delete backend function | `DELETE` | `/api/apps/{app_id}/backend-functions/{function_name}` |
| Fetch function logs | `GET` | `/api/apps/{app_id}/functions-mgmt/{function_name}/logs` |
| List agents | `GET` | `/api/apps/{app_id}/agent-configs` |
| Sync agents | `PUT` | `/api/apps/{app_id}/agent-configs` |
| List connectors | `GET` | `/api/apps/{app_id}/external-auth/list` |
| List available connector integrations | `GET` | `/api/apps/{app_id}/external-auth/available-integrations` |
| Set connector integration | `PUT` | `/api/apps/{app_id}/external-auth/integrations/{integration_type}` |
| Get connector OAuth status | `GET` | `/api/apps/{app_id}/external-auth/status` |
| Remove connector integration | `DELETE` | `/api/apps/{app_id}/external-auth/integrations/{integration_type}/remove` |
| List secrets | `GET` | `/api/apps/{app_id}/secrets` |
| Set secrets | `POST` | `/api/apps/{app_id}/secrets` |
| Delete secret | `DELETE` | `/api/apps/{app_id}/secrets?secret_name={secret_name}` |
| Install Stripe | `POST` | `/api/apps/{app_id}/payments/stripe/install` |
| Get Stripe status | `GET` | `/api/apps/{app_id}/payments/stripe/status` |
| Remove Stripe | `DELETE` | `/api/apps/{app_id}/payments/stripe` |

## App REST API

### List Apps

```bash
curl -s "https://app.base44.com/api/apps?limit=10" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### Create an App

Write to `/tmp/base44_create_app.json`:

```json
{
  "name": "hello",
  "user_description": "Backend for 'hello'",
  "is_managed_source_code": false,
  "public_settings": "public_without_login"
}
```

Then run:

```bash
curl -s -X POST "https://app.base44.com/api/apps" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" -d @/tmp/base44_create_app.json | jq .
```

### Get an App

Replace `<app-id>` with the Base44 app ID.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### Download App Source

Replace `<app-id>` with the Base44 app ID. This downloads a tar archive of the app source.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>/eject" --header "Authorization: Bearer $BASE44_TOKEN" --output /tmp/base44-app.tar
```

### Get Published URL

Replace `<app-id>` with the Base44 app ID.

```bash
curl -s "https://app.base44.com/api/apps/platform/<app-id>/published-url" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### List App Secrets

Replace `<app-id>` with the Base44 app ID. The API lists secret metadata, not secret values.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>/secrets" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### List Backend Functions

Replace `<app-id>` with the Base44 app ID.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>/backend-functions" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### List Agents

Replace `<app-id>` with the Base44 app ID.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>/agent-configs" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

### List Connectors

Replace `<app-id>` with the Base44 app ID.

```bash
curl -s "https://app.base44.com/api/apps/<app-id>/external-auth/list" --header "Authorization: Bearer $BASE44_TOKEN" | jq .
```

## MCP API

### Initialize MCP

```bash
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"vm0","version":"1.0.0"}}}' | sed -n 's/^data: //p' | jq .
```

### List MCP Tools

Write to `/tmp/base44_mcp_request.json`:

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
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d @/tmp/base44_mcp_request.json | sed -n 's/^data: //p' | jq '.result.tools[] | {name, description}'
```

### List User Apps with MCP

Write to `/tmp/base44_mcp_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "list_user_apps",
    "arguments": {}
  }
}
```

Then run:

```bash
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d @/tmp/base44_mcp_request.json | sed -n 's/^data: //p' | jq .
```

### Create an App with MCP

Write to `/tmp/base44_mcp_request.json`:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "create_base44_app",
    "arguments": {
      "name": "hello"
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://app.base44.com/mcp" --header "Authorization: Bearer $BASE44_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json, text/event-stream" -d @/tmp/base44_mcp_request.json | sed -n 's/^data: //p' | jq .
```

## Guidelines

1. Use `BASE44_TOKEN` in examples. The vm0 connector maps the stored OAuth access token to this runtime environment variable.
2. Use the REST App API for direct app CRUD operations and published URL lookups.
3. Use MCP for agent workflows that need tool discovery, app editing, app status checks, preview URLs, entity schemas, or entity queries.
4. Prefer read-only calls such as listing apps and tools before making write calls.
5. Create and edit app calls mutate the connected Base44 account. Confirm the intended app name and target app ID before writing.
6. Keep `Authorization: Bearer $BASE44_TOKEN` on both REST API and MCP requests.
