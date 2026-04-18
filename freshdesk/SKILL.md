---
name: freshdesk
description: Freshdesk API for customer support and helpdesk. Use when user mentions "Freshdesk", "support ticket", "helpdesk", "customer service", or asks about Freshworks helpdesk automation.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name FRESHDESK_TOKEN` or `zero doctor check-connector --url https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets --method GET`

## How to Use

All examples assume `FRESHDESK_TOKEN` (API key) and `FRESHDESK_DOMAIN` (your subdomain, e.g. `acme` from `acme.freshdesk.com`) are set.

Base URL: `https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2`

Authentication: HTTP Basic — API key as username, literal `X` as dummy password. The curl `-u` flag handles Base64 encoding for you:

```bash
-u "$FRESHDESK_TOKEN:X"
```

### 1. List Tickets

Get all tickets (default 30 per page):

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, subject, status, priority}'
```

With pagination:

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets?page=1&per_page=100" -u "$FRESHDESK_TOKEN:X"
```

Filter by updated date (tickets updated in last 30 days):

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets?updated_since=2026-03-18T00:00:00Z" -u "$FRESHDESK_TOKEN:X"
```

### 2. Get Ticket

Retrieve a specific ticket (replace `<ticket-id>` with the ID from the list response):

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>" -u "$FRESHDESK_TOKEN:X"
```

Include requester, company, and stats:

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>?include=requester,company,stats" -u "$FRESHDESK_TOKEN:X"
```

### 3. Create Ticket

Write to `/tmp/freshdesk_request.json`:

```json
{
  "subject": "Support needed",
  "description": "Customer cannot access their dashboard.",
  "email": "customer@example.com",
  "priority": 2,
  "status": 2
}
```

Then run:

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

Priority values: `1` (Low), `2` (Medium), `3` (High), `4` (Urgent)
Status values: `2` (Open), `3` (Pending), `4` (Resolved), `5` (Closed)
Source values: `1` (Email), `2` (Portal), `3` (Phone), `7` (Chat), `9` (Feedback widget), `10` (Outbound email)

### 4. Update Ticket

Write to `/tmp/freshdesk_request.json`:

```json
{
  "status": 4,
  "priority": 3,
  "tags": ["resolved", "billing"]
}
```

Then run (replace `<ticket-id>`):

```bash
curl -s -X PUT "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 5. Delete Ticket

```bash
curl -s -X DELETE "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>" -u "$FRESHDESK_TOKEN:X"
```

### 6. Filter Tickets (Advanced Search)

Freshdesk supports a query DSL. Write the query to `/tmp/freshdesk_query.txt`:

```
"status:2 AND priority:4"
```

Then run:

```bash
curl -s -G "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/search/tickets" -u "$FRESHDESK_TOKEN:X" --data-urlencode "query@/tmp/freshdesk_query.txt" | jq '.results[] | {id, subject, status, priority}'
```

Common filter operators: `:`, `>`, `<`, `AND`, `OR`. Filterable fields include `status`, `priority`, `agent_id`, `group_id`, `created_at`, `updated_at`, `tag`, and any custom field.

### 7. List Conversations (Notes and Replies) on a Ticket

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>/conversations" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, body_text, private, user_id, created_at}'
```

### 8. Reply to a Ticket

Public reply visible to the requester. Write to `/tmp/freshdesk_request.json`:

```json
{
  "body": "Thanks for reaching out — we are investigating and will update you shortly."
}
```

Then run:

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>/reply" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 9. Add a Private Note to a Ticket

Internal note not visible to the requester. Write to `/tmp/freshdesk_request.json`:

```json
{
  "body": "Escalating to engineering — related to incident #42.",
  "private": true
}
```

Then run:

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>/notes" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 10. List Contacts

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/contacts" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, name, email, company_id}'
```

### 11. Create Contact

Write to `/tmp/freshdesk_request.json`:

```json
{
  "name": "Jane Customer",
  "email": "jane@example.com",
  "phone": "+1-555-0100"
}
```

Then run:

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/contacts" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 12. Search Contacts

Write the query to `/tmp/freshdesk_query.txt`:

```
"email:'jane@example.com'"
```

Then run:

```bash
curl -s -G "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/search/contacts" -u "$FRESHDESK_TOKEN:X" --data-urlencode "query@/tmp/freshdesk_query.txt" | jq '.results[] | {id, name, email}'
```

### 13. List Companies

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/companies" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, name, domains}'
```

### 14. Create Company

Write to `/tmp/freshdesk_request.json`:

```json
{
  "name": "Acme Inc",
  "domains": ["acme.com"],
  "description": "Priority customer"
}
```

Then run:

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/companies" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 15. List Agents

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/agents" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, contact: {name: .contact.name, email: .contact.email}, available}'
```

### 16. Get Current Authenticated Agent

Useful to verify the API key works and see your own agent ID:

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/agents/me" -u "$FRESHDESK_TOKEN:X"
```

### 17. List Groups

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/groups" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, name, agent_ids}'
```

### 18. Assign Ticket to an Agent and Group

Write to `/tmp/freshdesk_request.json` (replace agent/group IDs with values from the previous list endpoints):

```json
{
  "responder_id": <agent-id>,
  "group_id": <group-id>,
  "status": 2
}
```

Then run:

```bash
curl -s -X PUT "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

### 19. List Solution Categories (Knowledge Base)

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/solutions/categories" -u "$FRESHDESK_TOKEN:X" | jq '.[] | {id, name, description}'
```

List folders in a category:

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/solutions/categories/<category-id>/folders" -u "$FRESHDESK_TOKEN:X"
```

List articles in a folder:

```bash
curl -s "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/solutions/folders/<folder-id>/articles" -u "$FRESHDESK_TOKEN:X"
```

### 20. Create a Solution Article

Write to `/tmp/freshdesk_request.json`:

```json
{
  "title": "How to reset your password",
  "description": "<p>Follow these steps to reset your password...</p>",
  "status": 2
}
```

Status values for articles: `1` (Draft), `2` (Published).

Then run (replace `<folder-id>`):

```bash
curl -s -X POST "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/solutions/folders/<folder-id>/articles" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

## Common Workflows

### Triage: Find all urgent unassigned tickets

Write to `/tmp/freshdesk_query.txt`:

```
"priority:4 AND agent_id:null AND status:2"
```

Then run:

```bash
curl -s -G "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/search/tickets" -u "$FRESHDESK_TOKEN:X" --data-urlencode "query@/tmp/freshdesk_query.txt" | jq '.results[] | {id, subject, requester_id, created_at}'
```

### Close old resolved tickets

Find resolved tickets updated before a cutoff, then bulk-close them one by one (Freshdesk has no bulk-update endpoint for arbitrary fields).

Write to `/tmp/freshdesk_query.txt`:

```
"status:4 AND updated_at:<'2026-03-01'"
```

```bash
curl -s -G "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/search/tickets" -u "$FRESHDESK_TOKEN:X" --data-urlencode "query@/tmp/freshdesk_query.txt" | jq -r '.results[].id'
```

For each ID returned, write to `/tmp/freshdesk_request.json`:

```json
{ "status": 5 }
```

Then run for each `<ticket-id>`:

```bash
curl -s -X PUT "https://$FRESHDESK_DOMAIN.freshdesk.com/api/v2/tickets/<ticket-id>" --header "Content-Type: application/json" -u "$FRESHDESK_TOKEN:X" -d @/tmp/freshdesk_request.json
```

## Rate Limits

Account-wide limits, varying by plan:

| Plan | Calls/Hour |
|------|------------|
| Free / Growth | 1,000 |
| Pro | 5,000 |
| Enterprise | 10,000 |

Some endpoints have lower per-minute sub-limits (e.g. create/update ticket, create contact). Always check these response headers:

- `X-RateLimit-Total` — account limit for this window
- `X-RateLimit-Remaining` — remaining quota
- `X-RateLimit-Used-CurrentRequest` — cost of the current call
- `Retry-After` — seconds to wait on a `429` response

## Guidelines

1. Use the `-u "$FRESHDESK_TOKEN:X"` pattern — `X` is a literal dummy password, Base64 encoding is handled by curl.
2. The base URL is subdomain-specific: always include `$FRESHDESK_DOMAIN` and `.freshdesk.com`.
3. Ticket `status` and `priority` are integers, not strings — see the enum lists above.
4. Search queries must be wrapped in double quotes and URL-encoded. Using `--data-urlencode "query@/tmp/freshdesk_query.txt"` is the reliable pattern.
5. No bulk-update endpoint exists — iterate per-ticket, and respect `Retry-After` on 429 responses.
6. Creating a ticket requires a requester — provide `email`, `phone`, `requester_id`, `twitter_id`, or `facebook_id`.
7. Dates accept ISO-8601 with a `Z` suffix (e.g. `2026-04-18T12:00:00Z`).
8. Use `updated_since` on list endpoints for incremental syncs — avoid fetching the full backlog repeatedly.
9. Paginate with `page` and `per_page` (max 100). Watch for the `link` response header for the next page.
10. The Sprout plan does not include API access — if you get `401 Unauthorized` on every call, verify your plan.

## API Reference

- Main documentation: https://developers.freshdesk.com/api/
- Authentication: https://support.freshdesk.com/en/support/solutions/articles/50000003346-api-key-based-authentication
- Tickets: https://developers.freshdesk.com/api/#tickets
- Conversations: https://developers.freshdesk.com/api/#conversations
- Contacts: https://developers.freshdesk.com/api/#contacts
- Companies: https://developers.freshdesk.com/api/#companies
- Agents: https://developers.freshdesk.com/api/#agents
- Groups: https://developers.freshdesk.com/api/#groups
- Solutions (KB): https://developers.freshdesk.com/api/#solutions
- Search: https://developers.freshdesk.com/api/#filter_tickets
- Rate limits: https://developers.freshdesk.com/api/#ratelimit
