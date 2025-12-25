---
name: twenty
description: Open-source CRM API for managing people, companies, notes, tasks and custom objects
vm0_env:
  - TWENTY_API_KEY
  - TWENTY_API_URL
---

# Twenty CRM

Open-source modern CRM platform. Manage people, companies, opportunities, notes, and tasks via REST or GraphQL API.

> Official docs: https://docs.twenty.com/developers/api-and-webhooks/api

---

## When to Use

Use this skill when you need to:

- Manage contacts (people) and companies
- Track opportunities and deals
- Create notes and tasks
- Sync CRM data with other systems
- Query CRM metadata and custom fields
- Set up webhooks for CRM events

---

## Prerequisites

1. Create an account at https://app.twenty.com/
2. Go to **Settings → APIs & Webhooks** to generate an API key

Set environment variables:

```bash
# For Twenty Cloud
export TWENTY_API_KEY="your-api-key"
export TWENTY_API_URL="https://api.twenty.com"

# For self-hosted instances
export TWENTY_API_URL="https://your-domain.com"
```

---

## How to Use

### 1. List Companies

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/companies" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_36f057.json
cat /tmp/resp_36f057.json | jq '.data.companies[:3]'
```

**With pagination:**

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/companies?limit=10&offset=0" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_42537e.json
cat /tmp/resp_42537e.json | jq .
```

### 2. Create a Company

```bash
curl -s -X POST "${TWENTY_API_URL}/rest/companies" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "name": "Acme Corp",
  "domainName": "acme.com",
  "address": "123 Main St, San Francisco, CA"
  }' > /tmp/resp_101e17.json
cat /tmp/resp_101e17.json | jq .
```

### 3. List People (Contacts)

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/people" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_1a948c.json
cat /tmp/resp_1a948c.json | jq '.data.people[:3]'
```

### 4. Create a Person

```bash
curl -s -X POST "${TWENTY_API_URL}/rest/people" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "name": {
  "firstName": "John",
  "lastName": "Doe"
  },
  "email": "john@example.com",
  "phone": "+1234567890"
  }' > /tmp/resp_c0a221.json
cat /tmp/resp_c0a221.json | jq .
```

### 5. Get a Specific Record

```bash
# Get company by ID
curl -s -X GET "${TWENTY_API_URL}/rest/companies/{companyId}" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_c32154.json
cat /tmp/resp_c32154.json | jq .

# Get person by ID
curl -s -X GET "${TWENTY_API_URL}/rest/people/{personId}" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_25631f.json
cat /tmp/resp_25631f.json | jq .
```

### 6. Update a Record

```bash
curl -s -X PATCH "${TWENTY_API_URL}/rest/companies/{companyId}" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "name": "Acme Corporation",
  "employees": 500
  }' > /tmp/resp_bcf8dc.json
cat /tmp/resp_bcf8dc.json | jq .
```

### 7. Delete a Record

```bash
curl -s -X DELETE "${TWENTY_API_URL}/rest/companies/{companyId}" --header "Authorization: Bearer ${TWENTY_API_KEY}"
```

### 8. List Notes

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/notes" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_a11ad6.json
cat /tmp/resp_a11ad6.json | jq '.data.notes[:3]'
```

### 9. Create a Note

```bash
curl -s -X POST "${TWENTY_API_URL}/rest/notes" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "title": "Meeting Notes",
  "body": "Discussed Q1 roadmap and budget allocation."
  }' > /tmp/resp_5095a1.json
cat /tmp/resp_5095a1.json | jq .
```

### 10. List Tasks

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/tasks" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_7ff08c.json
cat /tmp/resp_7ff08c.json | jq '.data.tasks[:3]'
```

### 11. Create a Task

```bash
curl -s -X POST "${TWENTY_API_URL}/rest/tasks" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "title": "Follow up with client",
  "dueAt": "2025-01-15T10:00:00Z",
  "status": "TODO"
  }' > /tmp/resp_222043.json
cat /tmp/resp_222043.json | jq .
```

### 12. Get Metadata (Object Schema)

List all object types and their fields:

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/metadata/objects" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_04bf4f.json
cat /tmp/resp_04bf4f.json | jq '.data.objects[] | {name: .nameSingular, fields: [.fields[].name]}'
```

**Get metadata for a specific object:**

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/metadata/objects/companies" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_98e6e2.json
cat /tmp/resp_98e6e2.json | jq .
```

### 13. GraphQL Query

```bash
curl -s -X POST "${TWENTY_API_URL}/graphql" --header "Authorization: Bearer ${TWENTY_API_KEY}" --header "Content-Type: application/json" -d '{
  "query": "query { companies(first: 5) { edges { node { id name domainName } } } }"
  }' > /tmp/resp_3c862c.json
cat /tmp/resp_3c862c.json | jq '.data.companies.edges'
```

---

## API Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Core Objects** | `/rest/companies` | Manage companies |
| | `/rest/people` | Manage contacts |
| | `/rest/opportunities` | Manage deals/opportunities |
| | `/rest/notes` | Manage notes |
| | `/rest/tasks` | Manage tasks |
| | `/rest/activities` | Activity timeline |
| **Metadata** | `/rest/metadata/objects` | List all object schemas |
| | `/rest/metadata/objects/{name}` | Get specific object schema |
| | `/rest/metadata/picklists` | Get dropdown field options |
| **GraphQL** | `/graphql` | GraphQL endpoint |

---

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| `limit` | Number of records to return (default: 20) |
| `offset` | Number of records to skip |
| `filter` | Filter conditions (JSON) |
| `orderBy` | Sort order |

**Example with filters:**

```bash
curl -s -X GET "${TWENTY_API_URL}/rest/companies?filter={\"name\":{\"like\":\"%Acme%\"}}" --header "Authorization: Bearer ${TWENTY_API_KEY}" > /tmp/resp_2b0491.json
cat /tmp/resp_2b0491.json | jq .
```

---

## Response Format

```json
{
  "data": {
  "companies": [
  {
  "id": "uuid",
  "name": "Company Name",
  "domainName": "example.com",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
  }
  ]
  },
  "pageInfo": {
  "hasNextPage": true,
  "endCursor": "cursor-string"
  }
}
```

---

## Guidelines

1. **API Playground**: Test API calls at Settings → APIs & Webhooks in the Twenty app
2. **Rate Limits**: Cloud has rate limits; self-hosted has no limits
3. **GraphQL**: Use GraphQL for complex queries with relationships
4. **REST**: Use REST for simple CRUD operations
5. **Custom Objects**: Twenty supports custom objects; use metadata API to discover schema
6. **Webhooks**: Set up webhooks at Settings → APIs & Webhooks for real-time events

---

## Resources

- **API Docs**: https://docs.twenty.com/developers/api-and-webhooks/api
- **Webhooks**: https://docs.twenty.com/developers/api-and-webhooks/webhooks
- **GitHub**: https://github.com/twentyhq/twenty
- **Discord**: https://discord.gg/cx5n4Jzs57
