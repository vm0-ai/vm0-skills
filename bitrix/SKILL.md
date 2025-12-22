name: bitrix
description: Bitrix24 REST API via curl. Use this skill to manage CRM (leads, deals, contacts), tasks, and users.
vm0_env:

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

### Webhook URL Format

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
curl -s -X GET "${BITRIX_WEBHOOK_URL}/user.current.json" | jq .
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
curl -s -X GET "${BITRIX_WEBHOOK_URL}/user.get.json" | jq '.result[] | {ID, NAME, LAST_NAME, EMAIL}'
```

---

## CRM - Leads

### 3. Create a Lead

```bash
curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.lead.add.json" \
  --header "Content-Type: application/json" \
  -d '{
    "fields": {
      "TITLE": "New Lead from API",
      "NAME": "John",
      "LAST_NAME": "Doe",
      "PHONE": [{"VALUE": "+1234567890", "VALUE_TYPE": "WORK"}],
      "EMAIL": [{"VALUE": "john@example.com", "VALUE_TYPE": "WORK"}]
    }
  }' | jq .
```

**Response:**
```json
{
  "result": 123
}
```

---

### 4. Get a Lead

```bash
LEAD_ID="123"

curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.lead.get.json?id=${LEAD_ID}" | jq .
```

---

### 5. List Leads

```bash
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.lead.list.json" | jq '.result[] | {ID, TITLE, STATUS_ID}'
```

With filter:

```bash
curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.lead.list.json" \
  --header "Content-Type: application/json" \
  -d '{
    "filter": {"STATUS_ID": "NEW"},
    "select": ["ID", "TITLE", "NAME", "PHONE"]
  }' | jq .
```

---

### 6. Update a Lead

```bash
LEAD_ID="123"

curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.lead.update.json" \
  --header "Content-Type: application/json" \
  -d "{
    \"id\": ${LEAD_ID},
    \"fields\": {
      \"STATUS_ID\": \"IN_PROCESS\",
      \"COMMENTS\": \"Updated via API\"
    }
  }" | jq .
```

---

### 7. Delete a Lead

```bash
LEAD_ID="123"

curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.lead.delete.json?id=${LEAD_ID}" | jq .
```

---

## CRM - Contacts

### 8. Create a Contact

```bash
curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.contact.add.json" \
  --header "Content-Type: application/json" \
  -d '{
    "fields": {
      "NAME": "Jane",
      "LAST_NAME": "Smith",
      "PHONE": [{"VALUE": "+1987654321", "VALUE_TYPE": "MOBILE"}],
      "EMAIL": [{"VALUE": "jane@example.com", "VALUE_TYPE": "WORK"}]
    }
  }' | jq .
```

---

### 9. List Contacts

```bash
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.contact.list.json" | jq '.result[] | {ID, NAME, LAST_NAME}'
```

---

## CRM - Deals

### 10. Create a Deal

```bash
curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.deal.add.json" \
  --header "Content-Type: application/json" \
  -d '{
    "fields": {
      "TITLE": "New Deal from API",
      "STAGE_ID": "NEW",
      "OPPORTUNITY": 5000,
      "CURRENCY_ID": "USD"
    }
  }' | jq .
```

---

### 11. List Deals

```bash
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.deal.list.json" | jq '.result[] | {ID, TITLE, STAGE_ID, OPPORTUNITY}'
```

---

### 12. Update Deal Stage

```bash
DEAL_ID="456"

curl -s -X POST "${BITRIX_WEBHOOK_URL}/crm.deal.update.json" \
  --header "Content-Type: application/json" \
  -d "{
    \"id\": ${DEAL_ID},
    \"fields\": {
      \"STAGE_ID\": \"WON\"
    }
  }" | jq .
```

---

## Tasks

### 13. Create a Task

```bash
curl -s -X POST "${BITRIX_WEBHOOK_URL}/tasks.task.add.json" \
  --header "Content-Type: application/json" \
  -d '{
    "fields": {
      "TITLE": "New Task from API",
      "DESCRIPTION": "Task description here",
      "RESPONSIBLE_ID": 1,
      "DEADLINE": "2025-12-31"
    }
  }' | jq .
```

---

### 14. List Tasks

```bash
curl -s -X GET "${BITRIX_WEBHOOK_URL}/tasks.task.list.json" | jq '.result.tasks[] | {id, title, status}'
```

---

### 15. Complete a Task

```bash
TASK_ID="789"

curl -s -X GET "${BITRIX_WEBHOOK_URL}/tasks.task.complete.json?taskId=${TASK_ID}" | jq .
```

---

## Get Field Definitions

Get available fields for any entity:

```bash
# Lead fields
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.lead.fields.json" | jq .

# Contact fields
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.contact.fields.json" | jq .

# Deal fields
curl -s -X GET "${BITRIX_WEBHOOK_URL}/crm.deal.fields.json" | jq .
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
