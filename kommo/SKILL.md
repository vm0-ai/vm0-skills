---
name: kommo
description: Kommo CRM API via curl. Use this skill for managing leads, contacts, companies, tasks, and sales pipelines.
vm0_env:
  - KOMMO_SUBDOMAIN
  - KOMMO_API_KEY
---

# Kommo API

Use the Kommo API via direct `curl` calls for **CRM management** including leads, contacts, companies, tasks, and sales pipelines.

> Official docs: `https://developers.kommo.com/`

---

## When to Use

Use this skill when you need to:

- **Manage leads** - Create, list, update leads in your sales pipeline
- **Handle contacts** - Add and retrieve customer contact information
- **Track companies** - Manage company records and associations
- **Create tasks** - Schedule follow-ups and meetings
- **View pipelines** - Get sales pipeline stages and statuses

---

## Prerequisites

1. Sign up at [Kommo](https://www.kommo.com/)
2. Create a private integration:
  - Go to Settings > Integrations > Create Integration
  - Select "Private integration"
  - Go to "Keys and scopes" tab
  - Click "Generate long-lived token"
  - Copy the token (it cannot be retrieved again)
3. Note your subdomain from your Kommo URL: `https://{subdomain}.kommo.com`

```bash
export KOMMO_SUBDOMAIN="your-subdomain" # e.g., "mycompany" (not "mycompany.kommo.com")
export KOMMO_API_KEY="your-long-lived-token"
```

---

## How to Use

All examples below assume you have environment variables set.

The base URL is: `https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4`

Authentication uses Bearer token in the `Authorization` header.

**Rate limit:** Maximum 7 requests per second.

---

### 1. List Leads

Get all leads in your account:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["leads"][] | {id, name, price}'
```

With filters:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads?limit=10&page=1" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["leads"]'
```

---

### 2. Get Lead by ID

Get a specific lead:

```bash
LEAD_ID="12345"

curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/${LEAD_ID}" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq .
```

---

### 3. Create Lead

Create a new lead:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '[{
  "name": "New Lead",
  "price": 5000
}]' | jq '.["_embedded"]["leads"]'
```

---

### 4. Create Lead with Contact and Company

Create a lead with associated contact and company:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/complex" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '[{
  "name": "Lead with Contact",
  "price": 10000,
  "_embedded": {
  "contacts": [{
  "first_name": "John",
  "last_name": "Doe"
  }],
  "companies": [{
  "name": "Acme Corp"
  }]
  }
}]' | jq .
```

---

### 5. Update Lead

Update an existing lead:

```bash
LEAD_ID="12345"

curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/${LEAD_ID}" -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '{
  "price": 7500,
  "name": "Updated Lead Name"
}' | jq .
```

---

### 6. List Contacts

Get all contacts:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/contacts" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["contacts"][] | {id, name}'
```

---

### 7. Get Contact by ID

Get a specific contact:

```bash
CONTACT_ID="12345"

curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/contacts/${CONTACT_ID}" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq .
```

---

### 8. Create Contact

Create a new contact:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/contacts" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '[{
  "first_name": "Jane",
  "last_name": "Smith"
}]' | jq '.["_embedded"]["contacts"]'
```

---

### 9. List Companies

Get all companies:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/companies" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["companies"][] | {id, name}'
```

---

### 10. Create Company

Create a new company:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/companies" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '[{
  "name": "New Company Inc"
}]' | jq '.["_embedded"]["companies"]'
```

---

### 11. List Tasks

Get all tasks:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/tasks" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["tasks"][] | {id, text, complete_till}'
```

---

### 12. Create Task

Create a new task:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/tasks" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" -d '[{
  "text": "Follow up with client",
  "complete_till": '$(( $(date +%s) + 86400 ))',
  "task_type_id": 1
}]' | jq '.["_embedded"]["tasks"]'
```

**Task types:** `1` = Follow-up, `2` = Meeting

---

### 13. List Pipelines

Get all sales pipelines:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/pipelines" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["pipelines"][] | {id, name}'
```

---

### 14. Get Pipeline Stages

Get stages for a specific pipeline:

```bash
PIPELINE_ID="12345"

curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads/pipelines/${PIPELINE_ID}" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '.["_embedded"]["statuses"][] | {id, name}'
```

---

### 15. Get Account Info

Get account information:

```bash
curl -s "https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/account" -H "Accept: application/json" -H "Authorization: Bearer ${KOMMO_API_KEY}" | jq '{id, name, subdomain, currency}'
```

---

## Response Format

### Lead Response

```json
{
  "id": 12345,
  "name": "Lead Name",
  "price": 5000,
  "responsible_user_id": 123,
  "pipeline_id": 456,
  "status_id": 789
}
```

### Contact Response

```json
{
  "id": 12345,
  "name": "John Doe",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

## Guidelines

1. **Rate limit**: Maximum 7 requests per second, 429 returned if exceeded
2. **Array format**: POST requests for creating entities expect an array of objects
3. **Use pagination**: Add `?limit=N&page=N` for large result sets
4. **Task timestamps**: `complete_till` is Unix timestamp in seconds
5. **If-Modified-Since**: Use this header for efficient polling of list endpoints
