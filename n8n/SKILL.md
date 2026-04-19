---
name: n8n
description: n8n API for managing workflows, executions, credentials, and tags. Use when user mentions "n8n", "workflow automation", "trigger workflow", "list executions", or asks to manage n8n workflows programmatically.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name N8N_TOKEN` or `zero doctor check-connector --url ${N8N_BASE_URL}/api/v1/workflows --method GET`

## Authentication

All endpoints require the API key in a header:

```
X-N8N-API-KEY: $N8N_TOKEN
```

## Environment Variables

| Variable | Description |
|---|---|
| `N8N_TOKEN` | n8n API key (generated in Settings → n8n API) |
| `N8N_BASE_URL` | Base URL of your n8n instance, e.g. `https://your-instance.app.n8n.cloud` |

## Base URL

All endpoints are at `${N8N_BASE_URL}/api/v1`.

> The API is not available during the n8n Cloud free trial. For self-hosted instances it requires n8n ≥ 0.174.

## Workflows

### List Workflows

```bash
curl -s "${N8N_BASE_URL}/api/v1/workflows" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

With pagination (max 250 per page):

```bash
curl -s "${N8N_BASE_URL}/api/v1/workflows?limit=50&cursor=<next-cursor>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

Filter by tag:

```bash
curl -s "${N8N_BASE_URL}/api/v1/workflows?tags=<tag-name>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get a Workflow

```bash
curl -s "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Activate a Workflow

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>/activate" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Deactivate a Workflow

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>/deactivate" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Create a Workflow

Write to `/tmp/n8n_workflow.json`:

```json
{
  "name": "<workflow-name>",
  "nodes": [],
  "connections": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/workflows" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_workflow.json
```

### Update a Workflow

Write the full updated workflow definition to `/tmp/n8n_workflow.json`:

```bash
curl -s -X PUT "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_workflow.json
```

### Delete a Workflow

```bash
curl -s -X DELETE "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get Workflow Tags

```bash
curl -s "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>/tags" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Update Workflow Tags

Write to `/tmp/n8n_tags.json`:

```json
[
  { "id": "<tag-id>" }
]
```

```bash
curl -s -X PUT "${N8N_BASE_URL}/api/v1/workflows/<workflow-id>/tags" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_tags.json
```

## Executions

### List Executions

```bash
curl -s "${N8N_BASE_URL}/api/v1/executions" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

Filter by workflow or status:

```bash
curl -s "${N8N_BASE_URL}/api/v1/executions?workflowId=<workflow-id>&status=error&limit=20" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

Available `status` values: `error`, `success`, `running`, `waiting`.

Include full execution data:

```bash
curl -s "${N8N_BASE_URL}/api/v1/executions?includeData=true&limit=5" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get an Execution

```bash
curl -s "${N8N_BASE_URL}/api/v1/executions/<execution-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Retry a Failed Execution

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/executions/<execution-id>/retry" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Stop a Running Execution

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/executions/<execution-id>/stop" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Delete an Execution

```bash
curl -s -X DELETE "${N8N_BASE_URL}/api/v1/executions/<execution-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Tags

### List Tags

```bash
curl -s "${N8N_BASE_URL}/api/v1/tags" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Create a Tag

Write to `/tmp/n8n_tag.json`:

```json
{
  "name": "<tag-name>"
}
```

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/tags" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_tag.json
```

### Update a Tag

Write to `/tmp/n8n_tag.json`:

```json
{
  "name": "<new-tag-name>"
}
```

```bash
curl -s -X PUT "${N8N_BASE_URL}/api/v1/tags/<tag-id>" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_tag.json
```

### Delete a Tag

```bash
curl -s -X DELETE "${N8N_BASE_URL}/api/v1/tags/<tag-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Credentials

### List Credentials

```bash
curl -s "${N8N_BASE_URL}/api/v1/credentials" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get a Credential

```bash
curl -s "${N8N_BASE_URL}/api/v1/credentials/<credential-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get Credential Schema

Retrieve the required fields for a given credential type (e.g. `githubApi`, `slackApi`):

```bash
curl -s "${N8N_BASE_URL}/api/v1/credentials/schema/<credential-type-name>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Delete a Credential

```bash
curl -s -X DELETE "${N8N_BASE_URL}/api/v1/credentials/<credential-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Variables

### List Variables

```bash
curl -s "${N8N_BASE_URL}/api/v1/variables" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Create a Variable

Write to `/tmp/n8n_variable.json`:

```json
{
  "key": "<variable-name>",
  "value": "<variable-value>"
}
```

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/variables" --header "X-N8N-API-KEY: $N8N_TOKEN" --header "Content-Type: application/json" -d @/tmp/n8n_variable.json
```

### Delete a Variable

```bash
curl -s -X DELETE "${N8N_BASE_URL}/api/v1/variables/<variable-id>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Users (instance owner only)

### List Users

```bash
curl -s "${N8N_BASE_URL}/api/v1/users" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

### Get a User

```bash
curl -s "${N8N_BASE_URL}/api/v1/users/<user-id-or-email>" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Security Audit

Generate a security audit report for the instance:

```bash
curl -s -X POST "${N8N_BASE_URL}/api/v1/audit" --header "X-N8N-API-KEY: $N8N_TOKEN"
```

## Response Codes

| Status | Description |
|---|---|
| `200` | Success |
| `201` | Created |
| `204` | Deleted successfully |
| `400` | Bad request / invalid body |
| `401` | Missing or invalid API key |
| `403` | Insufficient permissions |
| `404` | Resource not found |

## Guidelines

1. **API availability** — The REST API requires a paid n8n Cloud plan or a self-hosted instance. Free trial accounts return 401.
2. **Pagination** — List endpoints return up to 250 items. Use the `cursor` field from the response `nextCursor` to fetch subsequent pages.
3. **Workflow updates are full replaces** — `PUT /workflows/{id}` replaces the entire workflow definition. Always `GET` the workflow first, modify what you need, then `PUT` the full object.
4. **Credential values are write-only** — Credential data cannot be read back after creation for security reasons; you can only delete or update.
5. **Owner-only operations** — User management endpoints require the API key to belong to the instance owner.

## API Reference

- API overview: https://docs.n8n.io/api/
- API reference: https://docs.n8n.io/api/api-reference/
