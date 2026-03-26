---
name: salesforce
description: Salesforce CRM REST API. Use when user mentions "Salesforce", "SFDC", "Salesforce CRM", "leads", "opportunities", "SOQL", or asks about enterprise CRM data.
vm0_secrets:
  - SALESFORCE_TOKEN
  - SALESFORCE_INSTANCE_URL
---

# Salesforce REST API

Manage Contacts, Leads, Accounts, and Opportunities via the Salesforce REST API.

> Official docs: `https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/`

## When to Use

- Create or update Contacts and Leads from Clerk user data
- Query CRM records using SOQL
- Manage Accounts and Opportunities
- Search across Salesforce objects

## Prerequisites


> **Important:** When using `$VAR` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'` to avoid silent variable clearing — a known Claude Code issue.

## Core APIs

### Query Contacts (SOQL)

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,FirstName,LastName,Email,Phone+FROM+Contact+LIMIT+20" --header "Authorization: Bearer $SALESFORCE_TOKEN"' | jq '[.records[] | {Id, FirstName, LastName, Email, Phone}]'
```

Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm

---

### Search Contacts by Email

Replace `<email>` with the email address to search for:

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,FirstName,LastName,Email+FROM+Contact+WHERE+Email=%27<email>%27+LIMIT+5" --header "Authorization: Bearer $SALESFORCE_TOKEN"' | jq '[.records[] | {Id, FirstName, LastName, Email}]'
```

---

### Get Contact

Replace `<contact-id>` with the Salesforce Contact ID (18-char string starting with `003`):

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/<contact-id>" --header "Authorization: Bearer $SALESFORCE_TOKEN"' | jq '{Id, FirstName, LastName, Email, Phone, AccountId}'
```

---

### Create Contact

Write to `/tmp/sf_request.json`:

```json
{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Email": "jane.doe@example.com",
  "Phone": "+1-555-0100",
  "Title": "Software Engineer",
  "LeadSource": "Web"
}
```

```bash
bash -c 'curl -s -X POST "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/" --header "Authorization: Bearer $SALESFORCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' | jq '{id, success}'
```

---

### Update Contact

Replace `<contact-id>` with the Contact ID.

Write to `/tmp/sf_request.json`:

```json
{
  "Phone": "+1-555-0200",
  "Title": "Senior Engineer"
}
```

```bash
bash -c 'curl -s -X PATCH "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/<contact-id>" --header "Authorization: Bearer $SALESFORCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' -w "\nHTTP Status: %{http_code}\n"
```

---

### Create Lead

Write to `/tmp/sf_request.json`:

```json
{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Email": "jane.doe@example.com",
  "Company": "Acme Corp",
  "LeadSource": "Web",
  "Status": "Open - Not Contacted"
}
```

```bash
bash -c 'curl -s -X POST "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Lead/" --header "Authorization: Bearer $SALESFORCE_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' | jq '{id, success}'
```

---

### Query Accounts

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,Name,Industry,AnnualRevenue+FROM+Account+LIMIT+20" --header "Authorization: Bearer $SALESFORCE_TOKEN"' | jq '[.records[] | {Id, Name, Industry, AnnualRevenue}]'
```

---

### SOSL Full-Text Search

Search across multiple objects. Replace `<search-term>`:

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/search?q=FIND+%7B<search-term>%7D+IN+ALL+FIELDS+RETURNING+Contact(Id,Name,Email),Lead(Id,Name,Email)" --header "Authorization: Bearer $SALESFORCE_TOKEN"' | jq '[.searchRecords[] | {Id, Name, type: .attributes.type}]'
```

---

## Guidelines

1. **Token expiry**: If you receive `401 INVALID_SESSION_ID`, the token has expired.
2. **API version**: Uses `/v60.0/` (Spring '26). Check supported versions at `$SALESFORCE_INSTANCE_URL/services/data/`.
3. **Object IDs**: Contact IDs start with `003`, Account IDs with `001`, Lead IDs with `00Q`, Opportunity IDs with `006`.
4. **SOQL strings**: Single-quote string values in WHERE clauses, URL-encoded as `%27` (e.g., `WHERE+Email=%27user@example.com%27`).
5. **Upsert**: Use `PATCH /sobjects/Contact/<external-field>/<value>` to upsert by an external ID field.
6. **Rate limits**: Per-org API limits vary by Salesforce edition. Monitor the `Sforce-Limit-Info` response header for remaining API calls.
