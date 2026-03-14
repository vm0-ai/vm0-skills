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

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Close**. vm0 will automatically inject the required `CLOSE_TOKEN` environment variable.


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/close-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $CLOSE_TOKEN" "$@"
EOF
chmod +x /tmp/close-curl
```

**Usage:** All examples below use `/tmp/close-curl` instead of direct `curl` calls.

## Core APIs

### Get Current User

```bash
/tmp/close-curl "https://api.close.com/api/v1/me/" | jq '{id, email, first_name, last_name}'
```

### Get Organization Info

```bash
/tmp/close-curl "https://api.close.com/api/v1/organization/" | jq '.data[0] | {id, name}'
```

### List Users

```bash
/tmp/close-curl "https://api.close.com/api/v1/user/" | jq '.data[] | {id, email, first_name, last_name}'
```

## Leads

### List Leads

```bash
/tmp/close-curl "https://api.close.com/api/v1/lead/?_limit=10" | jq '.data[] | {id, display_name, status_label, created_by_name}'
```

### Get a Lead

```bash
/tmp/close-curl "https://api.close.com/api/v1/lead/<lead-id>/" | jq '{id, display_name, status_label, contacts, opportunities}'
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
/tmp/close-curl -X POST "https://api.close.com/api/v1/lead/" -d @/tmp/request.json | jq '{id, display_name}'
```

### Update a Lead

Write to `/tmp/request.json`:

```json
{
  "name": "Acme Corporation"
}
```

```bash
/tmp/close-curl -X PUT "https://api.close.com/api/v1/lead/<lead-id>/" -d @/tmp/request.json | jq '{id, display_name}'
```

### Delete a Lead

```bash
/tmp/close-curl -X DELETE "https://api.close.com/api/v1/lead/<lead-id>/"
```

## Contacts

### List Contacts

```bash
/tmp/close-curl "https://api.close.com/api/v1/contact/?_limit=10" | jq '.data[] | {id, name, lead_id, emails, phones}'
```

### Get a Contact

```bash
/tmp/close-curl "https://api.close.com/api/v1/contact/<contact-id>/" | jq '{id, name, title, lead_id, emails, phones}'
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
/tmp/close-curl -X POST "https://api.close.com/api/v1/contact/" -d @/tmp/request.json | jq '{id, name, lead_id}'
```

### Update a Contact

Write to `/tmp/request.json`:

```json
{
  "title": "CTO"
}
```

```bash
/tmp/close-curl -X PUT "https://api.close.com/api/v1/contact/<contact-id>/" -d @/tmp/request.json | jq '{id, name, title}'
```

### Delete a Contact

```bash
/tmp/close-curl -X DELETE "https://api.close.com/api/v1/contact/<contact-id>/"
```

## Opportunities

### List Opportunities

```bash
/tmp/close-curl "https://api.close.com/api/v1/opportunity/?_limit=10" | jq '.data[] | {id, lead_name, status_label, status_type, value, value_currency}'
```

### Get an Opportunity

```bash
/tmp/close-curl "https://api.close.com/api/v1/opportunity/<opportunity-id>/" | jq '{id, lead_name, status_label, status_type, value, value_currency, confidence, note}'
```

### Create an Opportunity

First, list available opportunity statuses to get a valid `status_id`:

```bash
/tmp/close-curl "https://api.close.com/api/v1/status/opportunity/" | jq '.data[] | {id, label, type}'
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
/tmp/close-curl -X POST "https://api.close.com/api/v1/opportunity/" -d @/tmp/request.json | jq '{id, lead_name, status_label, value}'
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
/tmp/close-curl -X PUT "https://api.close.com/api/v1/opportunity/<opportunity-id>/" -d @/tmp/request.json | jq '{id, status_label, value, confidence}'
```

### Delete an Opportunity

```bash
/tmp/close-curl -X DELETE "https://api.close.com/api/v1/opportunity/<opportunity-id>/"
```

## Tasks

### List Tasks

```bash
/tmp/close-curl "https://api.close.com/api/v1/task/?_limit=10&is_complete=false" | jq '.data[] | {id, _type, text, date, is_complete, assigned_to_name, lead_name}'
```

### Get a Task

```bash
/tmp/close-curl "https://api.close.com/api/v1/task/<task-id>/" | jq '{id, _type, text, date, is_complete, lead_name}'
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
/tmp/close-curl -X POST "https://api.close.com/api/v1/task/" -d @/tmp/request.json | jq '{id, text, date, is_complete}'
```

### Complete a Task

Write to `/tmp/request.json`:

```json
{
  "is_complete": true
}
```

```bash
/tmp/close-curl -X PUT "https://api.close.com/api/v1/task/<task-id>/" -d @/tmp/request.json | jq '{id, text, is_complete}'
```

### Delete a Task

```bash
/tmp/close-curl -X DELETE "https://api.close.com/api/v1/task/<task-id>/"
```

## Activities

### List Activities

Filter by type: `Call`, `Email`, `EmailThread`, `Note`, `Meeting`, `SMS`, `LeadStatusChange`, `OpportunityStatusChange`, `TaskCompleted`.

```bash
/tmp/close-curl "https://api.close.com/api/v1/activity/?_limit=10" | jq '.data[] | {id, _type, lead_id, date_created}'
```

### List Activities for a Lead

```bash
/tmp/close-curl "https://api.close.com/api/v1/activity/?lead_id=<lead-id>&_limit=10" | jq '.data[] | {id, _type, date_created}'
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
/tmp/close-curl -X POST "https://api.close.com/api/v1/activity/note/" -d @/tmp/request.json | jq '{id, note, date_created}'
```

## Lead Statuses

### List Lead Statuses

```bash
/tmp/close-curl "https://api.close.com/api/v1/status/lead/" | jq '.data[] | {id, label}'
```

## Pipelines

### List Pipelines

```bash
/tmp/close-curl "https://api.close.com/api/v1/pipeline/" | jq '.data[] | {id, name}'
```

## Guidelines

1. All API endpoints use the base URL `https://api.close.com/api/v1/`
2. Authentication uses Bearer token: `--header "Authorization: Bearer $CLOSE_TOKEN"`
3. Leads are the primary object — contacts, opportunities, tasks, and activities all belong to leads
4. Use `_limit` and `_skip` query parameters for pagination (default limit is 100, max is 200)
5. When creating contacts, always provide a `lead_id` to associate them with an existing lead
6. Opportunity statuses have a `status_type` of `active`, `won`, or `lost` — list available statuses before creating opportunities
7. Tasks support types: `lead` (general) and `outgoing_call` — use `lead` type for most tasks
8. Use `_fields` query parameter to select specific fields and reduce response size
