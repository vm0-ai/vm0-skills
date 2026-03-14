---
name: bitrix
description: Bitrix24 CRM API. Use when user mentions "Bitrix", "CRM", "Bitrix24 contacts",
  or asks about CRM management.
vm0_secrets:
  - BITRIX_WEBHOOK_URL
---

# Bitrix24 API

Use the Bitrix24 REST API via direct `curl` calls to **manage CRM, tasks, and users** in your Bitrix24 workspace.

> Official docs: `https://apidocs.bitrix24.com/`

---

## When to Use

Use this skill when you need to:

- **Manage CRM leads** (create, update, list, delete)
- **Manage CRM deals** and sales funnels
- **Manage CRM contacts** and companies
- **Create and manage tasks**
- **Get user information**
- **Automate business workflows**

---

## Prerequisites

1. Log in to your [Bitrix24](https://www.bitrix24.com/) workspace
2. Go to Applications → Developer Resources → Ready-made scenarios → Other → Incoming webhook
3. Create a new webhook and select the required permissions (CRM, Tasks, Users)
4. Copy the webhook URL
5. Store it in the environment variable

```bash
export BITRIX_WEBHOOK_URL="https://your-domain.bitrix24.com/rest/1/your-secret-code"
```

#
### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/bitrix-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $BITRIX_WEBHOOK_URL" "$@"
EOF
chmod +x /tmp/bitrix-curl
```

**Usage:** All examples below use `/tmp/bitrix-curl` instead of direct `curl` calls.

## Webhook URL Format

```
https://[domain]/rest/[user-id]/[secret-code]/[method].json
```

- `domain`: Your Bitrix24 address
- `user-id`: Webhook creator's ID
- `secret-code`: Authentication token (keep secure)
- `method`: API method name

---


## How to Use

All examples assume `BITRIX_WEBHOOK_URL` is set to your webhook base URL.

---

### 1. Get Current User

Get information about the authenticated user:

```bash
/tmp/bitrix-curl -X GET "https://api.example.com"
```

**Response:**
```json
{
  "result": {
  "ID": "1",
  "NAME": "John",
  "LAST_NAME": "Doe",
  "EMAIL": "john@example.com"
  }
}
```

---

### 2. List Users

Get a list of users in the workspace:

```bash
/tmp/bitrix-curl -X GET "https://api.example.com" | jq '.result[] | {ID, NAME, LAST_NAME, EMAIL}'
```

---

## CRM - Leads

### 3. Create a Lead

Write to `/tmp/bitrix_request.json`:

```json
{
  "fields": {
    "TITLE": "New Lead from API",
    "NAME": "John",
    "LAST_NAME": "Doe",
    "PHONE": [{"VALUE": "+1234567890", "VALUE_TYPE": "WORK"}],
    "EMAIL": [{"VALUE": "john@example.com", "VALUE_TYPE": "WORK"}]
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

**Response:**
```json
{
  "result": 123
}
```

---

### 4. Get a Lead

Replace `<your-lead-id>` with the actual lead ID:

```bash
/tmp/bitrix-curl -X GET "https://api.example.com"
```

---

### 5. List Leads

```bash
/tmp/bitrix-curl -X GET "https://api.example.com" | jq '.result[] | {ID, TITLE, STATUS_ID}'
```

With filter:

Write to `/tmp/bitrix_request.json`:

```json
{
  "filter": {"STATUS_ID": "NEW"},
  "select": ["ID", "TITLE", "NAME", "PHONE"]
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

### 6. Update a Lead

Write to `/tmp/bitrix_request.json`:

```json
{
  "id": 123,
  "fields": {
    "STATUS_ID": "IN_PROCESS",
    "COMMENTS": "Updated via API"
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

### 7. Delete a Lead

Replace `<your-lead-id>` with the actual lead ID:

```bash
/tmp/bitrix-curl -X GET "https://api.example.com"
```

---

## CRM - Contacts

### 8. Create a Contact

Write to `/tmp/bitrix_request.json`:

```json
{
  "fields": {
    "NAME": "Jane",
    "LAST_NAME": "Smith",
    "PHONE": [{"VALUE": "+1987654321", "VALUE_TYPE": "MOBILE"}],
    "EMAIL": [{"VALUE": "jane@example.com", "VALUE_TYPE": "WORK"}]
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

### 9. List Contacts

```bash
/tmp/bitrix-curl -X GET "https://api.example.com" | jq '.result[] | {ID, NAME, LAST_NAME}'
```

---

## CRM - Deals

### 10. Create a Deal

Write to `/tmp/bitrix_request.json`:

```json
{
  "fields": {
    "TITLE": "New Deal from API",
    "STAGE_ID": "NEW",
    "OPPORTUNITY": 5000,
    "CURRENCY_ID": "USD"
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

### 11. List Deals

```bash
/tmp/bitrix-curl -X GET "https://api.example.com" | jq '.result[] | {ID, TITLE, STAGE_ID, OPPORTUNITY}'
```

---

### 12. Update Deal Stage

Write to `/tmp/bitrix_request.json`:

```json
{
  "id": 456,
  "fields": {
    "STAGE_ID": "WON"
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

## Tasks

### 13. Create a Task

Write to `/tmp/bitrix_request.json`:

```json
{
  "fields": {
    "TITLE": "New Task from API",
    "DESCRIPTION": "Task description here",
    "RESPONSIBLE_ID": 1,
    "DEADLINE": "2025-12-31"
  }
}
```

Then run:

```bash
/tmp/bitrix-curl -X POST "https://api.example.com" -d @/tmp/bitrix_request.json
```

---

### 14. List Tasks

```bash
/tmp/bitrix-curl -X GET "https://api.example.com" | jq '.result.tasks[] | {id, title, status}'
```

---

### 15. Complete a Task

Replace `<your-task-id>` with the actual task ID:

```bash
/tmp/bitrix-curl -X GET "https://api.example.com"
```

---

## Get Field Definitions

Get available fields for any entity:

```bash
# Lead fields
/tmp/bitrix-curl -X GET "https://api.example.com"

# Contact fields
/tmp/bitrix-curl -X GET "https://api.example.com"

# Deal fields
/tmp/bitrix-curl -X GET "https://api.example.com"
```

---

## Common Parameters

| Parameter | Description |
|-----------|-------------|
| `filter` | Filter results (e.g., `{"STATUS_ID": "NEW"}`) |
| `select` | Fields to return (e.g., `["ID", "TITLE"]`) |
| `order` | Sort order (e.g., `{"ID": "DESC"}`) |
| `start` | Pagination offset |

---

## Guidelines

1. **Keep webhook secret**: Never expose your webhook URL publicly
2. **Use POST for complex queries**: Filters and field selections work better with POST
3. **Check field names**: Use `*.fields.json` methods to get valid field names
4. **Rate limits**: Bitrix24 has rate limits; add delays for bulk operations
5. **Pagination**: Results are paginated; use `start` parameter for large datasets
