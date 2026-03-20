---
name: salesforce
description: Salesforce CRM REST API. Use when user mentions "Salesforce", "SFDC", "Salesforce CRM", "leads", "opportunities", "SOQL", or asks about enterprise CRM data.
vm0_secrets:
  - SALESFORCE_CLIENT_ID
  - SALESFORCE_CLIENT_SECRET
  - SALESFORCE_INSTANCE_URL
---

# Salesforce REST API

Manage Contacts, Leads, Accounts, and Opportunities via the Salesforce REST API using OAuth 2.0 Client Credentials flow.

> Official docs: `https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/`

## When to Use

- Create or update Contacts and Leads from Clerk user data
- Query CRM records using SOQL
- Manage Accounts and Opportunities
- Search across Salesforce objects

## Prerequisites

**Step 1: Create a Connected App in Salesforce**

1. Go to **Setup > App Manager > New Connected App**
2. Enable **OAuth Settings**, select **"Enable Client Credentials Flow"**
3. Set scopes to **API** and **Manage user data via APIs**
4. Under **Manage > Edit Policies**, set permitted users to **Admin Pre-Approved** and assign a **Run-As User**
5. Copy the **Consumer Key** (Client ID) and **Consumer Secret** (Client Secret)

**Step 2: Export environment variables**

```bash
export SALESFORCE_CLIENT_ID=your_consumer_key
export SALESFORCE_CLIENT_SECRET=your_consumer_secret
export SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
```

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Salesforce** to have vm0 inject these automatically.

> **Important:** Salesforce access tokens expire and must be refreshed. Always fetch a fresh token before making API calls (see "Get Access Token" below). When using `$VAR` in commands that contain a pipe (`|`), always wrap the curl command in `bash -c '...'`.

## Core APIs

### Get Access Token

Fetch a short-lived access token using the Client Credentials flow. Store the returned `access_token` and `instance_url` for subsequent requests.

Write to `/tmp/sf_token.json`:

```bash
bash -c 'curl -s -X POST "$SALESFORCE_INSTANCE_URL/services/oauth2/token" -d "grant_type=client_credentials" -d "client_id=$SALESFORCE_CLIENT_ID" -d "client_secret=$SALESFORCE_CLIENT_SECRET"' | tee /tmp/sf_token.json | jq '{access_token: (.access_token | .[0:20] + "..."), instance_url}'
```

Export the token for use in subsequent calls:

```bash
export SALESFORCE_ACCESS_TOKEN=$(jq -r '.access_token' /tmp/sf_token.json)
```

---

### Query Contacts (SOQL)

Query contacts using SOQL. Replace the WHERE clause as needed:

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,FirstName,LastName,Email,Phone+FROM+Contact+LIMIT+20" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN"' | jq '[.records[] | {Id, FirstName, LastName, Email, Phone}]'
```

Docs: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm

---

### Search Contacts by Email

Replace `<email>` with the email address to search for:

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,FirstName,LastName,Email+FROM+Contact+WHERE+Email='"'"'<email>'"'"'+LIMIT+5" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN"' | jq '[.records[] | {Id, FirstName, LastName, Email}]'
```

---

### Get Contact

Replace `<contact-id>` with the Salesforce Contact ID (18-char string starting with `003`):

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/<contact-id>" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN"' | jq '{Id, FirstName, LastName, Email, Phone, AccountId}'
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
bash -c 'curl -s -X POST "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' | jq '{id, success}'
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
bash -c 'curl -s -X PATCH "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Contact/<contact-id>" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' -w "\nHTTP Status: %{http_code}\n"
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
bash -c 'curl -s -X POST "$SALESFORCE_INSTANCE_URL/services/data/v60.0/sobjects/Lead/" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN" --header "Content-Type: application/json" -d @/tmp/sf_request.json' | jq '{id, success}'
```

---

### Query Accounts

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/query?q=SELECT+Id,Name,Industry,AnnualRevenue+FROM+Account+LIMIT+20" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN"' | jq '[.records[] | {Id, Name, Industry, AnnualRevenue}]'
```

---

### SOQL Full-Text Search

Search across multiple objects using SOSL. Replace `<search-term>`:

```bash
bash -c 'curl -s "$SALESFORCE_INSTANCE_URL/services/data/v60.0/search?q=FIND+%7B<search-term>%7D+IN+ALL+FIELDS+RETURNING+Contact(Id,Name,Email),Lead(Id,Name,Email)" --header "Authorization: Bearer $SALESFORCE_ACCESS_TOKEN"' | jq '{searchRecords: [.searchRecords[] | {Id, Name, attributes}]}'
```

---

## Guidelines

1. **Token lifecycle**: Access tokens expire (typically 2 hours). Re-run the "Get Access Token" step if you receive a `401 INVALID_SESSION_ID` error.
2. **API version**: Use `/v60.0/` (Spring '26). Check your org's supported versions at `$SALESFORCE_INSTANCE_URL/services/data/`.
3. **Object IDs**: Contact IDs start with `003`, Account IDs with `001`, Lead IDs with `00Q`, Opportunity IDs with `006`.
4. **SOQL**: Use `+` for spaces in URL-encoded SOQL. String values in WHERE clauses must be single-quoted.
5. **Upsert**: Use `/sobjects/Contact/<external-field>/<value>` with PATCH to upsert by an external ID field.
6. **Connected App setup**: The Client Credentials flow requires explicit enablement in the Connected App policy settings — it is not on by default.
7. **Rate limits**: Per-org API limits apply (varies by Salesforce edition). Monitor `Sforce-Limit-Info` response header for remaining API calls.
