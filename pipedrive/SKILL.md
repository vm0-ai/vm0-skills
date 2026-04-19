---
name: pipedrive
description: Pipedrive CRM API for sales pipeline management. Use when user mentions "Pipedrive", "sales pipeline", "deals", "CRM", or asks about managing prospects, contacts, or organizations in Pipedrive.
---

# Pipedrive

Pipedrive is a CRM built around sales pipelines. This skill covers deals, persons, organizations, activities, notes, pipelines, stages, and search.

> Official docs: `https://developers.pipedrive.com/docs/api/v1`

---

## When to Use

Use this skill when you need to:

- Create or update deals in the sales pipeline
- Manage contacts (persons) and organizations
- Log activities (calls, meetings, tasks) against deals
- Add notes to deals, persons, or organizations
- Search for deals, persons, or organizations by keyword
- Read pipeline and stage structure
- Add deal participants

---

## Prerequisites

Connect the **Pipedrive** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name PIPEDRIVE_TOKEN` or `zero doctor check-connector --url https://api.pipedrive.com/v1/users/me --method GET`

---

## How to Use

### Check Current User

```bash
curl -s "https://api.pipedrive.com/v1/users/me" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '{id, name, email, default_currency, company_name}'
```

---

## Deals

### List Deals

```bash
curl -s "https://api.pipedrive.com/v1/deals?limit=20&status=open" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, title, value, currency, status, stage_id, person_id, org_id}'
```

Params: `limit` (max 500), `start` (pagination offset), `status` (`open`, `won`, `lost`, `all_not_deleted`), `stage_id`, `pipeline_id`, `filter_id`.

### Get a Deal

```bash
curl -s "https://api.pipedrive.com/v1/deals/<deal-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data | {id, title, value, currency, status, stage_id, person_id, org_id, pipeline_id}'
```

### Create a Deal

Write to `/tmp/request.json`:

```json
{
  "title": "Acme Corp - Enterprise Plan",
  "value": 12000,
  "currency": "USD",
  "stage_id": 1,
  "person_id": "<person-id>",
  "org_id": "<org-id>",
  "expected_close_date": "2026-06-30"
}
```

```bash
curl -s -X POST "https://api.pipedrive.com/v1/deals" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, title, value, stage_id}'
```

### Update a Deal

Write to `/tmp/request.json`:

```json
{
  "stage_id": 3,
  "value": 15000,
  "expected_close_date": "2026-07-15"
}
```

```bash
curl -s -X PUT "https://api.pipedrive.com/v1/deals/<deal-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, title, stage_id, value}'
```

### Delete a Deal

```bash
curl -s -X DELETE "https://api.pipedrive.com/v1/deals/<deal-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.success'
```

### Search Deals

```bash
curl -s "https://api.pipedrive.com/v1/deals/search?term=acme&limit=10" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data.items[] | .item | {id, title, value, status}'
```

Params: `term` (required, min 2 chars), `exact_match` (`true`/`false`), `fields` (comma-separated: `title`, `notes`, `custom_fields`), `person_id`, `organization_id`, `stage_id`, `status`, `limit`.

### Add Participant to a Deal

Write to `/tmp/request.json`:

```json
{
  "person_id": [42]
}
```

Replace `42` with the actual person ID. Then:

```bash
curl -s -X POST "https://api.pipedrive.com/v1/deals/<deal-id>/participants" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data[]'
```

---

## Persons (Contacts)

### List Persons

```bash
curl -s "https://api.pipedrive.com/v1/persons?limit=20" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, name, email, phone, org_id}'
```

Params: `limit`, `start`, `filter_id`.

### Get a Person

```bash
curl -s "https://api.pipedrive.com/v1/persons/<person-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data | {id, name, email, phone, org_id}'
```

### Create a Person

Write to `/tmp/request.json`:

```json
{
  "name": "Jane Smith",
  "email": [{"value": "jane@acme.com", "primary": true, "label": "work"}],
  "phone": [{"value": "+14155551234", "primary": true, "label": "work"}],
  "org_id": "<org-id>"
}
```

Replace `"<org-id>"` with the numeric org ID. Then:

```bash
curl -s -X POST "https://api.pipedrive.com/v1/persons" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, name, email, phone}'
```

### Update a Person

Write to `/tmp/request.json`:

```json
{
  "name": "Jane A. Smith",
  "phone": [{"value": "+14155559999", "primary": true, "label": "work"}]
}
```

```bash
curl -s -X PUT "https://api.pipedrive.com/v1/persons/<person-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, name}'
```

### Search Persons

```bash
curl -s "https://api.pipedrive.com/v1/persons/search?term=jane&limit=10" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data.items[] | .item | {id, name, email, phones, organization}'
```

Params: `term` (required), `exact_match`, `fields` (comma-separated: `name`, `email`, `phone`, `notes`, `custom_fields`), `organization_id`, `limit`.

---

## Organizations

### List Organizations

```bash
curl -s "https://api.pipedrive.com/v1/organizations?limit=20" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, name, address, owner_id}'
```

### Get an Organization

```bash
curl -s "https://api.pipedrive.com/v1/organizations/<org-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data | {id, name, address, people_count, open_deals_count}'
```

### Create an Organization

Write to `/tmp/request.json`:

```json
{
  "name": "Acme Corp",
  "address": "123 Main Street, San Francisco, CA 94105"
}
```

```bash
curl -s -X POST "https://api.pipedrive.com/v1/organizations" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, name}'
```

### Update an Organization

Write to `/tmp/request.json`:

```json
{
  "name": "Acme Corporation",
  "address": "456 Market Street, San Francisco, CA 94105"
}
```

```bash
curl -s -X PUT "https://api.pipedrive.com/v1/organizations/<org-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, name}'
```

---

## Activities

### List Activities

```bash
curl -s "https://api.pipedrive.com/v1/activities?limit=20&done=0" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, type, subject, due_date, deal_id, person_id, done}'
```

Params: `limit`, `start`, `done` (`0` = pending, `1` = done), `user_id`, `type`.

### Create an Activity

Write to `/tmp/request.json`:

```json
{
  "subject": "Follow-up call with Acme Corp",
  "type": "call",
  "due_date": "2026-04-25",
  "due_time": "14:00",
  "duration": "00:30",
  "deal_id": "<deal-id>",
  "person_id": "<person-id>",
  "note": "Discuss contract terms and Q2 timeline"
}
```

Replace `"<deal-id>"` and `"<person-id>"` with numeric IDs. Then:

```bash
curl -s -X POST "https://api.pipedrive.com/v1/activities" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, subject, type, due_date, done}'
```

Activity types: `call`, `meeting`, `task`, `deadline`, `email`, `lunch`.

### Mark Activity as Done

Write to `/tmp/request.json`:

```json
{
  "done": 1
}
```

```bash
curl -s -X PUT "https://api.pipedrive.com/v1/activities/<activity-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, subject, done}'
```

---

## Notes

### List Notes

```bash
curl -s "https://api.pipedrive.com/v1/notes?limit=20" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, content, deal_id, person_id, org_id, add_time}'
```

Params: `limit`, `start`, `deal_id`, `person_id`, `org_id`.

### Create a Note

Write to `/tmp/request.json`:

```json
{
  "content": "Spoke with Jane — budget approved for Q3. They want a demo by May 1st.",
  "deal_id": "<deal-id>",
  "person_id": "<person-id>"
}
```

Replace `"<deal-id>"` and `"<person-id>"` with numeric IDs. Then:

```bash
curl -s -X POST "https://api.pipedrive.com/v1/notes" --header "x-api-token: $PIPEDRIVE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.data | {id, content, deal_id, add_time}'
```

---

## Pipelines and Stages

### List Pipelines

```bash
curl -s "https://api.pipedrive.com/v1/pipelines" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, name, order_nr, active}'
```

### List Stages

```bash
curl -s "https://api.pipedrive.com/v1/stages?pipeline_id=<pipeline-id>" --header "x-api-token: $PIPEDRIVE_TOKEN" | jq '.data[] | {id, name, pipeline_id, order_nr, deal_probability}'
```

Omit `pipeline_id` to retrieve stages from all pipelines.

---

## Guidelines

1. All list endpoints return paginated results — use `limit` and `start` to page through; check `data.additional_data.pagination.more_items_in_collection` to detect more pages.
2. The `x-api-token` header must be present on every request.
3. For deal participants, the `person_id` field in the request body must be an array even when adding a single person.
4. Activity types are fixed: `call`, `meeting`, `task`, `deadline`, `email`, `lunch` — do not use free-form strings.
5. Custom fields are returned with machine-generated hash keys; use `GET /v1/dealFields` or `GET /v1/personFields` to map keys to labels before displaying them.
