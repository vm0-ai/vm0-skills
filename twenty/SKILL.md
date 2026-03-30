---
name: twenty
description: Twenty CRM API for customer management. Use when user mentions "Twenty",
  "Twenty CRM", "open source CRM", or asks about Twenty.
vm0_secrets:
  - TWENTY_TOKEN
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
export TWENTY_TOKEN="your-api-key"
```

---

## How to Use

### 1. List Companies

```bash
curl -s -X GET "https://api.twenty.com/rest/companies" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.companies[:3]'
```

**With pagination:**

```bash
curl -s -X GET "https://api.twenty.com/rest/companies?limit=10&offset=0" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.companies'
```

### 2. Create a Company

Write to `/tmp/twenty_request.json`:

```json
{
  "name": "Acme Corp",
  "domainName": "acme.com",
  "address": "123 Main St, San Francisco, CA"
}
```

Then run:

```bash
curl -s -X POST "https://api.twenty.com/rest/companies" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json
```

### 3. List People (Contacts)

```bash
curl -s -X GET "https://api.twenty.com/rest/people" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.people[:3]'
```

### 4. Create a Person

Write to `/tmp/twenty_request.json`:

```json
{
  "name": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

Then run:

```bash
curl -s -X POST "https://api.twenty.com/rest/people" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json
```

### 5. Get a Specific Record

> **Note:** Replace `{companyId}` and `{personId}` with actual IDs obtained from the "List Companies" or "List People" endpoints above (look for the `id` field in the response).

```bash
# Get company by ID
curl -s -X GET "https://api.twenty.com/rest/companies/{companyId}" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)"

# Get person by ID
curl -s -X GET "https://api.twenty.com/rest/people/{personId}" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)"
```

### 6. Update a Record

> **Note:** Replace `{companyId}` with an actual company ID from the "List Companies" endpoint above.

Write to `/tmp/twenty_request.json`:

```json
{
  "name": "Acme Corporation",
  "employees": 500
}
```

Then run:

```bash
curl -s -X PATCH "https://api.twenty.com/rest/companies/{companyId}" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json
```

### 7. Delete a Record

> **Note:** Replace `{companyId}` with an actual company ID from the "List Companies" endpoint above.

```bash
curl -s -X DELETE "https://api.twenty.com/rest/companies/{companyId}" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)"
```

### 8. List Notes

```bash
curl -s -X GET "https://api.twenty.com/rest/notes" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.notes[:3]'
```

### 9. Create a Note

Write to `/tmp/twenty_request.json`:

```json
{
  "title": "Meeting Notes",
  "body": "Discussed Q1 roadmap and budget allocation."
}
```

Then run:

```bash
curl -s -X POST "https://api.twenty.com/rest/notes" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json
```

### 10. List Tasks

```bash
curl -s -X GET "https://api.twenty.com/rest/tasks" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.tasks[:3]'
```

### 11. Create a Task

Write to `/tmp/twenty_request.json`:

```json
{
  "title": "Follow up with client",
  "dueAt": "2025-01-15T10:00:00Z",
  "status": "TODO"
}
```

Then run:

```bash
curl -s -X POST "https://api.twenty.com/rest/tasks" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json
```

### 12. Get Metadata (Object Schema)

List all object types and their fields:

```bash
curl -s -X GET "https://api.twenty.com/rest/metadata/objects" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.objects[] | {name: .nameSingular, fields: [.fields[].name]}'
```

**Get metadata for a specific object:**

```bash
curl -s -X GET "https://api.twenty.com/rest/metadata/objects/companies" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)"
```

### 13. GraphQL Query

Write to `/tmp/twenty_request.json`:

```json
{
  "query": "query { companies(first: 5) { edges { node { id name domainName } } } }"
}
```

Then run:

```bash
curl -s -X POST "https://api.twenty.com/graphql" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" --header "Content-Type: application/json" -d @/tmp/twenty_request.json | jq '.data.companies.edges'
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
curl -s -X GET "https://api.twenty.com/rest/companies?filter={\"name\":{\"like\":\"%Acme%\"}}" --header "Authorization: Bearer $(printenv TWENTY_TOKEN)" | jq '.data.companies'
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
