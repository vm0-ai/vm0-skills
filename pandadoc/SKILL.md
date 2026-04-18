---
name: pandadoc
description: PandaDoc API for contracts, proposals, quotes, and e-signatures.
  Use when user mentions "PandaDoc", "proposal", "quote", "contract send",
  or wants to create/send a document for signature from a template or PDF.
homepage: https://www.pandadoc.com
docs: https://developers.pandadoc.com/reference/about
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name PANDADOC_TOKEN` or `zero doctor check-connector --url https://api.pandadoc.com/public/v1/documents --method GET`

## Authentication

PandaDoc uses a **custom** `API-Key` auth scheme on the standard `Authorization` header — it is NOT `Bearer`. All examples below use:

```
Authorization: API-Key $PANDADOC_TOKEN
```

Base URL: `https://api.pandadoc.com/public/v1`

## Environment Variables

| Variable | Description |
|---|---|
| `PANDADOC_TOKEN` | PandaDoc API key (Production or Sandbox). Only Org Admins can generate keys. |

## Documents

### 1. List Documents

List documents in the workspace. Supports filtering by `status`, `template_id`, `tag`, `q` (name search), `created_from`, `created_to`, pagination (`page`, `count` max 100).

```bash
curl -s "https://api.pandadoc.com/public/v1/documents?count=20" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '.results[] | {id, name, status, date_created, date_modified}'
```

### 2. Get Document Details

Replace `<document-id>` with the document's UUID.

```bash
curl -s "https://api.pandadoc.com/public/v1/documents/<document-id>/details" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '{id, name, status, recipients, metadata, date_created, date_completed}'
```

### 3. Get Document Status (lightweight)

```bash
curl -s "https://api.pandadoc.com/public/v1/documents/<document-id>" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '{id, name, status, date_modified}'
```

### 4. Create Document from Template

Write to `/tmp/pandadoc_create_from_template.json`:

```json
{
  "name": "Sample Contract",
  "template_uuid": "<template-id>",
  "recipients": [
    {
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "role": "Client"
    }
  ],
  "tokens": [
    { "name": "Client.FirstName", "value": "Jane" },
    { "name": "Client.Company", "value": "Acme Corp" }
  ],
  "fields": {
    "Amount": { "value": "5000" }
  },
  "metadata": {
    "source": "vm0"
  },
  "tags": ["api-created"]
}
```

```bash
curl -s -X POST "https://api.pandadoc.com/public/v1/documents" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_create_from_template.json | jq '{id, name, status, uuid}'
```

Document creation is asynchronous. Poll the status endpoint until it is `document.draft` before sending.

### 5. Create Document from a PDF URL

Write to `/tmp/pandadoc_create_from_pdf.json`:

```json
{
  "name": "Contract from PDF",
  "url": "https://example.com/contract.pdf",
  "recipients": [
    {
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "role": "Client"
    }
  ],
  "parse_form_fields": false,
  "fields": {},
  "tags": ["api-created"]
}
```

```bash
curl -s -X POST "https://api.pandadoc.com/public/v1/documents" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_create_from_pdf.json | jq '{id, name, status}'
```

### 6. Send Document for Signature

Poll `GET /documents/<document-id>` until `status == "document.draft"`, then send.

Write to `/tmp/pandadoc_send.json`:

```json
{
  "message": "Please review and sign this document.",
  "subject": "Please sign: Sample Contract",
  "silent": false
}
```

```bash
curl -s -X POST "https://api.pandadoc.com/public/v1/documents/<document-id>/send" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_send.json | jq '{id, name, status}'
```

Set `silent: true` to skip email notifications (you deliver the sign link yourself).

### 7. Download Signed PDF

Downloads the PDF (signed if completed, current state otherwise).

```bash
curl -s "https://api.pandadoc.com/public/v1/documents/<document-id>/download" --header "Authorization: API-Key $PANDADOC_TOKEN" --output /tmp/signed_document.pdf
```

Add `?watermark=true` to include the unsigned watermark on in-progress documents.

### 8. Create a Signing Session Link

Generate a short-lived (default 900s) direct signing URL for a recipient. Replace `<document-id>` and provide the recipient's email.

Write to `/tmp/pandadoc_session.json`:

```json
{
  "recipient": "jane@example.com",
  "lifetime": 900
}
```

```bash
curl -s -X POST "https://api.pandadoc.com/public/v1/documents/<document-id>/session" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_session.json | jq '{id, expires_at}'
```

Open the signing page at `https://app.pandadoc.com/s/<session-id>`.

### 9. Change Document Status

Mark a document as paid, for example. Valid transitions depend on current status.

Write to `/tmp/pandadoc_status.json`:

```json
{
  "status": 2
}
```

Status codes: `2` = paid (only valid when status is `document.completed`).

```bash
curl -s -X PATCH "https://api.pandadoc.com/public/v1/documents/<document-id>/status" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_status.json
```

### 10. Delete Document

```bash
curl -s -X DELETE "https://api.pandadoc.com/public/v1/documents/<document-id>" --header "Authorization: API-Key $PANDADOC_TOKEN"
```

## Templates

### List Templates

Filter by `tag`, `q` (name search), `folder_uuid`. Paginate with `page` and `count` (max 100).

```bash
curl -s "https://api.pandadoc.com/public/v1/templates?count=20" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '.results[] | {id, name, date_created, date_modified}'
```

### Template Details

Replace `<template-id>`.

```bash
curl -s "https://api.pandadoc.com/public/v1/templates/<template-id>/details" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '{id, name, content_placeholders, fields, pricing, roles, tokens}'
```

Use `roles[].name` when constructing `recipients[].role` in the create-from-template body.

## Contacts

### List Contacts

```bash
curl -s "https://api.pandadoc.com/public/v1/contacts" --header "Authorization: API-Key $PANDADOC_TOKEN" | jq '.[] | {id, email, first_name, last_name, company}'
```

### Create Contact

Write to `/tmp/pandadoc_contact.json`:

```json
{
  "email": "new.contact@example.com",
  "first_name": "New",
  "last_name": "Contact",
  "company": "Acme Corp",
  "job_title": "Procurement"
}
```

```bash
curl -s -X POST "https://api.pandadoc.com/public/v1/contacts" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_contact.json | jq '{id, email, first_name, last_name}'
```

### Get / Update / Delete Contact

```bash
curl -s "https://api.pandadoc.com/public/v1/contacts/<contact-id>" --header "Authorization: API-Key $PANDADOC_TOKEN"
```

Update via PATCH — write partial fields to `/tmp/pandadoc_contact_patch.json`:

```json
{
  "job_title": "VP Procurement"
}
```

```bash
curl -s -X PATCH "https://api.pandadoc.com/public/v1/contacts/<contact-id>" --header "Authorization: API-Key $PANDADOC_TOKEN" --header "Content-Type: application/json" -d @/tmp/pandadoc_contact_patch.json
```

```bash
curl -s -X DELETE "https://api.pandadoc.com/public/v1/contacts/<contact-id>" --header "Authorization: API-Key $PANDADOC_TOKEN"
```

## Document Status Values

| Status | Meaning |
|---|---|
| `document.uploaded` | Document created but still processing (not yet draft) |
| `document.draft` | Ready to send |
| `document.sent` | Sent to recipients, awaiting signatures |
| `document.viewed` | Opened by at least one recipient |
| `document.waiting_approval` | Pending internal approval |
| `document.approved` | Internally approved |
| `document.rejected` | Internally rejected |
| `document.waiting_pay` | Completed, awaiting payment |
| `document.paid` | Paid |
| `document.completed` | All recipients signed |
| `document.voided` | Voided |
| `document.declined` | Declined by a recipient |
| `document.expired` | Past expiration date |
| `document.external_review` | Sent to external reviewer |

## Guidelines

1. The `Authorization` header uses the **`API-Key`** prefix, not `Bearer`. Bearer is only for OAuth access tokens.
2. Document creation is asynchronous — always poll `GET /documents/<id>` until status is `document.draft` before calling `/send`.
3. For Production API keys you need a paid plan with API access; Sandbox keys are free but documents have no legal validity.
4. UUIDs (`id`, `uuid`, `template_uuid`) are dynamic — capture them from responses rather than hard-coding.
5. `count` is capped at 100 per page on list endpoints; paginate with `page` (1-indexed).
6. Session links (`/documents/<id>/session`) expire in `lifetime` seconds (default 900). Request a new one when expired.
7. Rate limits apply per workspace — on `429`, back off exponentially and retry.
