---
name: typeform
description: Typeform API for forms, responses, and webhooks. Use when user mentions "Typeform", "survey", "form builder", "collect responses", "form submissions", or needs to build/read/delete forms programmatically.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TYPEFORM_TOKEN` or `zero doctor check-connector --url https://api.typeform.com/forms --method GET`

## Authentication

All endpoints require a personal access token passed as a Bearer token:

```
Authorization: Bearer $TYPEFORM_TOKEN
```

Token format is `tfp_<40-hex>`.

## Environment Variables

| Variable | Description |
|---|---|
| `TYPEFORM_TOKEN` | Typeform personal access token (`tfp_...`) |

## Base URL

`https://api.typeform.com` (EU-data-residency accounts use `https://api.eu.typeform.com`).

Rate limit: 2 requests/second per account on Create and Responses APIs.

## Forms

### List Forms

```bash
curl -s "https://api.typeform.com/forms" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

With pagination and search:

```bash
curl -s "https://api.typeform.com/forms?page=1&page_size=25&search=<your-query>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Retrieve a Form

Replace `<form-id>`:

```bash
curl -s "https://api.typeform.com/forms/<form-id>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Create a Form

Write to `/tmp/typeform_form.json`:

```json
{
  "title": "<your-form-title>",
  "fields": [
    {
      "title": "What is your name?",
      "type": "short_text",
      "ref": "name"
    },
    {
      "title": "How would you rate us?",
      "type": "rating",
      "ref": "rating",
      "properties": {
        "shape": "star",
        "steps": 5
      }
    }
  ]
}
```

```bash
curl -s -X POST "https://api.typeform.com/forms" --header "Authorization: Bearer $TYPEFORM_TOKEN" --header "Content-Type: application/json" -d @/tmp/typeform_form.json
```

### Update a Form (Full Replace)

Write the complete form definition to `/tmp/typeform_form.json`, then replace `<form-id>`:

```bash
curl -s -X PUT "https://api.typeform.com/forms/<form-id>" --header "Authorization: Bearer $TYPEFORM_TOKEN" --header "Content-Type: application/json" -d @/tmp/typeform_form.json
```

### Update a Form (JSON Patch)

Write a JSON Patch array to `/tmp/typeform_patch.json`:

```json
[
  { "op": "replace", "path": "/title", "value": "<your-new-title>" }
]
```

```bash
curl -s -X PATCH "https://api.typeform.com/forms/<form-id>" --header "Authorization: Bearer $TYPEFORM_TOKEN" --header "Content-Type: application/json" -d @/tmp/typeform_patch.json
```

### Delete a Form

```bash
curl -s -X DELETE "https://api.typeform.com/forms/<form-id>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Retrieve Form Messages (validation text)

```bash
curl -s "https://api.typeform.com/forms/<form-id>/messages" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

## Responses

### List Responses

```bash
curl -s "https://api.typeform.com/forms/<form-id>/responses" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

Useful query parameters:

| Parameter | Description |
|---|---|
| `page_size` | Max 1000, default 25 |
| `since` / `until` | ISO 8601 timestamps |
| `after` / `before` | Cursor tokens (exclusive) |
| `response_type` | `completed`, `partial`, or `started` |
| `included_response_ids` | Comma-separated response IDs |
| `query` | Search string matched against answers |
| `fields` | Comma-separated field refs to include |
| `sort` | `{field_id},{asc|desc}` |

Example — only completed responses in the last 7 days:

```bash
curl -s "https://api.typeform.com/forms/<form-id>/responses?response_type=completed&since=2026-04-11T00:00:00Z&page_size=100" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Delete Responses

Pass comma-separated response IDs:

```bash
curl -s -X DELETE "https://api.typeform.com/forms/<form-id>/responses?included_response_ids=<response-id-1>,<response-id-2>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Download a File Upload

Replace `<form-id>`, `<response-id>`, and `<filename>` (all returned in the response payload):

```bash
curl -s -L "https://api.typeform.com/forms/<form-id>/responses/<response-id>/fields/<field-id>/files/<filename>" --header "Authorization: Bearer $TYPEFORM_TOKEN" -o /tmp/typeform_upload
```

## Webhooks

### List Webhooks on a Form

```bash
curl -s "https://api.typeform.com/forms/<form-id>/webhooks" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Create or Update a Webhook

Webhooks are addressed by a user-chosen `<tag>` (string key you pick). A PUT creates or replaces the webhook under that tag.

Write to `/tmp/typeform_webhook.json`:

```json
{
  "url": "<your-callback-url>",
  "enabled": true,
  "verify_ssl": true,
  "secret": "<your-signing-secret>"
}
```

```bash
curl -s -X PUT "https://api.typeform.com/forms/<form-id>/webhooks/<tag>" --header "Authorization: Bearer $TYPEFORM_TOKEN" --header "Content-Type: application/json" -d @/tmp/typeform_webhook.json
```

### Retrieve a Single Webhook

```bash
curl -s "https://api.typeform.com/forms/<form-id>/webhooks/<tag>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Delete a Webhook

```bash
curl -s -X DELETE "https://api.typeform.com/forms/<form-id>/webhooks/<tag>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

## Workspaces

### List Workspaces

```bash
curl -s "https://api.typeform.com/workspaces" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Create a Workspace

Write to `/tmp/typeform_workspace.json`:

```json
{
  "name": "<your-workspace-name>"
}
```

```bash
curl -s -X POST "https://api.typeform.com/workspaces" --header "Authorization: Bearer $TYPEFORM_TOKEN" --header "Content-Type: application/json" -d @/tmp/typeform_workspace.json
```

## Themes

### List Themes

```bash
curl -s "https://api.typeform.com/themes" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

### Retrieve a Theme

```bash
curl -s "https://api.typeform.com/themes/<theme-id>" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

## Account

```bash
curl -s "https://api.typeform.com/me" --header "Authorization: Bearer $TYPEFORM_TOKEN"
```

## Common Field Types

When building forms, these are the values for the `type` field:

- `short_text`, `long_text`, `email`, `phone_number`, `website`, `number`
- `multiple_choice`, `dropdown`, `picture_choice`, `yes_no`, `legal`
- `rating`, `opinion_scale`, `nps`
- `date`, `file_upload`, `payment`, `matrix`, `ranking`
- Layout: `statement`, `group`, `welcome_screen`, `thankyou_screen`

## Response Codes

| Status | Description |
|---|---|
| `200` | Success |
| `201` | Created |
| `204` | No content (delete success) |
| `400` | Bad request / invalid JSON |
| `401` | Missing or invalid token |
| `403` | Token lacks required scope |
| `404` | Form/response/webhook not found |
| `429` | Rate limit exceeded (2 req/sec) |

## Guidelines

1. **Scopes matter** — personal access tokens only work for actions covered by the scopes they were minted with (`forms:read`, `forms:write`, `responses:read`, `responses:write`, `webhooks:read`, `webhooks:write`, `workspaces:read`, `workspaces:write`, `themes:read`, `themes:write`, `accounts:read`). A 403 usually means the token needs a wider scope.
2. **EU accounts** — if a user's workspace is on the EU data residency tier, swap `https://api.typeform.com` for `https://api.eu.typeform.com` in every call.
3. **Paginate responses** — use `after`/`before` cursor tokens for datasets above ~1000 responses rather than `page_size` alone.
4. **Webhook signing** — pass a `secret` when creating a webhook; incoming payloads then carry a `Typeform-Signature` header you should verify on the receiving end.

## API Reference

- API docs: https://www.typeform.com/developers/
- Create API: https://www.typeform.com/developers/create/
- Responses API: https://www.typeform.com/developers/responses/
- Webhooks API: https://www.typeform.com/developers/webhooks/
- Scopes: https://www.typeform.com/developers/get-started/scopes/
