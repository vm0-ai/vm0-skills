---
name: ironclad
description: Ironclad API for contract lifecycle management. Use when user mentions "Ironclad", "contracts", "contract workflows", "CLM", "contract records", or needs to read/create workflows, records, or download contract documents.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name IRONCLAD_API_KEY` or `zero doctor check-connector --url https://$IRONCLAD_HOST/public/api/v1/workflows --method GET`

## Authentication

Ironclad uses a static API key passed as a Bearer token:

```
Authorization: Bearer $IRONCLAD_API_KEY
```

Generate the key in Ironclad under **Company Settings → API**. Keys are scoped to a single Ironclad instance.

## Environment Variables

| Variable | Description |
|---|---|
| `IRONCLAD_API_KEY` | Ironclad API key |
| `IRONCLAD_HOST` | API host for your Ironclad instance |

## Base URL

`https://$IRONCLAD_HOST/public/api/v1/` — set `IRONCLAD_HOST` to match your instance's data region:

| Region | Host |
|---|---|
| North America (default) | `ironcladapp.com` |
| Europe | `eu1.ironcladapp.com` |
| Demo | `demo.ironcladapp.com` |

## Workflows

### List Workflows

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/workflows" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

Paginate with `page` and `pageSize` query params.

### Retrieve a Workflow

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/workflows/<workflow-id>" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

### List Workflow Schemas

Schemas describe the launch form for each contract type:

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/workflow-schemas" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

### Launch a Workflow

Write to `/tmp/ironclad_workflow.json`:

```json
{
  "template": "<schema-id>",
  "creator": { "email": "user@example.com" },
  "attributes": {
    "counterpartyName": "Acme Corp",
    "agreementDate": { "type": "date", "value": "2026-01-15" }
  }
}
```

```bash
curl -s -X POST "https://$IRONCLAD_HOST/public/api/v1/workflows" -H "Authorization: Bearer $IRONCLAD_API_KEY" -H "Content-Type: application/json" -d @/tmp/ironclad_workflow.json
```

### Download a Workflow Document

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/workflows/<workflow-id>/document/<document-key>/download" -H "Authorization: Bearer $IRONCLAD_API_KEY" -o /tmp/contract.pdf
```

## Records

### List Records

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/records" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

### Retrieve a Record

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/records/<record-id>" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

### Create a Record

Write to `/tmp/ironclad_record.json`:

```json
{
  "type": "<record-type-id>",
  "name": "Acme MSA",
  "properties": {
    "counterpartyName": { "type": "text", "value": "Acme Corp" }
  }
}
```

```bash
curl -s -X POST "https://$IRONCLAD_HOST/public/api/v1/records" -H "Authorization: Bearer $IRONCLAD_API_KEY" -H "Content-Type: application/json" -d @/tmp/ironclad_record.json
```

## Approvals

### List Workflow Approvals

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/workflows/<workflow-id>/approvals" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

## Webhooks

### List Webhooks

```bash
curl -s "https://$IRONCLAD_HOST/public/api/v1/webhooks" -H "Authorization: Bearer $IRONCLAD_API_KEY"
```

### Create a Webhook

Write to `/tmp/ironclad_webhook.json`:

```json
{
  "events": ["workflow_launched", "workflow_completed"],
  "targetURL": "https://example.com/ironclad-hook"
}
```

```bash
curl -s -X POST "https://$IRONCLAD_HOST/public/api/v1/webhooks" -H "Authorization: Bearer $IRONCLAD_API_KEY" -H "Content-Type: application/json" -d @/tmp/ironclad_webhook.json
```

## Notes

- All POST bodies require `Content-Type: application/json`.
- List endpoints are paginated with `page` (0-indexed) and `pageSize` query params; the response includes `count` and `list`.
- `IRONCLAD_HOST` must match the region your Ironclad instance is hosted in — a North America key will not work against the EU host and vice versa.
