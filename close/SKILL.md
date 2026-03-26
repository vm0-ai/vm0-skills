---
name: close
description: Close CRM API for sales management. Use when user mentions "Close CRM",
  "Close.io", "sales leads", or asks about sales pipeline.
vm0_secrets:
  - CLOSE_TOKEN
---

# Close CRM API

Manage leads, contacts, opportunities, tasks, and activities in Close CRM.

> Official docs: `https://developer.close.com/`

## When to Use

- List, search, create, update, and delete leads
- Manage contacts within leads
- Track opportunities (deals) and their statuses
- Create and manage tasks
- View activities (calls, emails, notes, meetings)
- Get current user and organization info

## Core APIs

### Get Current User

```bash
curl -s "https://api.close.com/api/v1/me/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '{id, email, first_name, last_name}'
```

### Get Organization Info

```bash
curl -s "https://api.close.com/api/v1/organization/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[0] | {id, name}'
```

### List Users

```bash
curl -s "https://api.close.com/api/v1/user/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, email, first_name, last_name}'
```

## Leads

### List Leads

```bash
curl -s "https://api.close.com/api/v1/lead/?_limit=10" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, display_name, status_label, created_by_name}'
```

### Get a Lead

```bash
curl -s "https://api.close.com/api/v1/lead/<lead-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '{id, display_name, status_label, contacts, opportunities}'
```

### Create a Lead

Write to `/tmp/request.json`:

```json
{
  "name": "Acme Corp",
  "contacts": [
    {
      "name": "Jane Smith",
      "emails": [
        {
          "type": "office",
          "email": "jane@acme.com"
        }
      ],
      "phones": [
        {
          "type": "office",
          "phone": "+14155551234"
        }
      ]
    }
  ]
}
```

```bash
curl -s -X POST "https://api.close.com/api/v1/lead/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, display_name}'
```

### Update a Lead

Write to `/tmp/request.json`:

```json
{
  "name": "Acme Corporation"
}
```

```bash
curl -s -X PUT "https://api.close.com/api/v1/lead/<lead-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, display_name}'
```

### Delete a Lead

```bash
curl -s -X DELETE "https://api.close.com/api/v1/lead/<lead-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)"
```

## Contacts

### List Contacts

```bash
curl -s "https://api.close.com/api/v1/contact/?_limit=10" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, name, lead_id, emails, phones}'
```

### Get a Contact

```bash
curl -s "https://api.close.com/api/v1/contact/<contact-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '{id, name, title, lead_id, emails, phones}'
```

### Create a Contact

Write to `/tmp/request.json`:

```json
{
  "lead_id": "<lead-id>",
  "name": "John Doe",
  "title": "VP of Engineering",
  "emails": [
    {
      "type": "office",
      "email": "john@acme.com"
    }
  ],
  "phones": [
    {
      "type": "mobile",
      "phone": "+14155559876"
    }
  ]
}
```

```bash
curl -s -X POST "https://api.close.com/api/v1/contact/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, name, lead_id}'
```

### Update a Contact

Write to `/tmp/request.json`:

```json
{
  "title": "CTO"
}
```

```bash
curl -s -X PUT "https://api.close.com/api/v1/contact/<contact-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, name, title}'
```

### Delete a Contact

```bash
curl -s -X DELETE "https://api.close.com/api/v1/contact/<contact-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)"
```

## Opportunities

### List Opportunities

```bash
curl -s "https://api.close.com/api/v1/opportunity/?_limit=10" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, lead_name, status_label, status_type, value, value_currency}'
```

### Get an Opportunity

```bash
curl -s "https://api.close.com/api/v1/opportunity/<opportunity-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '{id, lead_name, status_label, status_type, value, value_currency, confidence, note}'
```

### Create an Opportunity

First, list available opportunity statuses to get a valid `status_id`:

```bash
curl -s "https://api.close.com/api/v1/status/opportunity/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, label, type}'
```

Write to `/tmp/request.json`:

```json
{
  "lead_id": "<lead-id>",
  "status_id": "<status-id>",
  "value": 5000,
  "value_currency": "USD",
  "note": "Enterprise license deal",
  "confidence": 75
}
```

```bash
curl -s -X POST "https://api.close.com/api/v1/opportunity/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, lead_name, status_label, value}'
```

### Update an Opportunity

Write to `/tmp/request.json`:

```json
{
  "value": 10000,
  "confidence": 90
}
```

```bash
curl -s -X PUT "https://api.close.com/api/v1/opportunity/<opportunity-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, status_label, value, confidence}'
```

### Delete an Opportunity

```bash
curl -s -X DELETE "https://api.close.com/api/v1/opportunity/<opportunity-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)"
```

## Tasks

### List Tasks

```bash
curl -s "https://api.close.com/api/v1/task/?_limit=10&is_complete=false" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, _type, text, date, is_complete, assigned_to_name, lead_name}'
```

### Get a Task

```bash
curl -s "https://api.close.com/api/v1/task/<task-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '{id, _type, text, date, is_complete, lead_name}'
```

### Create a Task

Write to `/tmp/request.json`:

```json
{
  "_type": "lead",
  "lead_id": "<lead-id>",
  "text": "Follow up on proposal",
  "date": "2026-03-15",
  "assigned_to": "<user-id>"
}
```

```bash
curl -s -X POST "https://api.close.com/api/v1/task/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, text, date, is_complete}'
```

### Complete a Task

Write to `/tmp/request.json`:

```json
{
  "is_complete": true
}
```

```bash
curl -s -X PUT "https://api.close.com/api/v1/task/<task-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, text, is_complete}'
```

### Delete a Task

```bash
curl -s -X DELETE "https://api.close.com/api/v1/task/<task-id>/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)"
```

## Activities

### List Activities

Filter by type: `Call`, `Email`, `EmailThread`, `Note`, `Meeting`, `SMS`, `LeadStatusChange`, `OpportunityStatusChange`, `TaskCompleted`.

```bash
curl -s "https://api.close.com/api/v1/activity/?_limit=10" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, _type, lead_id, date_created}'
```

### List Activities for a Lead

```bash
curl -s "https://api.close.com/api/v1/activity/?lead_id=<lead-id>&_limit=10" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, _type, date_created}'
```

### Create a Note Activity

Write to `/tmp/request.json`:

```json
{
  "lead_id": "<lead-id>",
  "note": "Had a productive call with the team. They are interested in the enterprise plan."
}
```

```bash
curl -s -X POST "https://api.close.com/api/v1/activity/note/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id, note, date_created}'
```

## Lead Statuses

### List Lead Statuses

```bash
curl -s "https://api.close.com/api/v1/status/lead/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, label}'
```

## Pipelines

### List Pipelines

```bash
curl -s "https://api.close.com/api/v1/pipeline/" --header "Authorization: Bearer $(printenv CLOSE_TOKEN)" | jq '.data[] | {id, name}'
```

## Guidelines

1. All API endpoints use the base URL `https://api.close.com/api/v1/`
2. Authentication uses Bearer token: `--header "Authorization: Bearer $(printenv CLOSE_TOKEN)"`
3. Leads are the primary object — contacts, opportunities, tasks, and activities all belong to leads
4. Use `_limit` and `_skip` query parameters for pagination (default limit is 100, max is 200)
5. When creating contacts, always provide a `lead_id` to associate them with an existing lead
6. Opportunity statuses have a `status_type` of `active`, `won`, or `lost` — list available statuses before creating opportunities
7. Tasks support types: `lead` (general) and `outgoing_call` — use `lead` type for most tasks
8. Use `_fields` query parameter to select specific fields and reduce response size
