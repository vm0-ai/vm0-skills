---
name: apollo
description: Apollo.io API for B2B prospecting and cold outreach automation. Use when user mentions "Apollo", "Apollo.io", "prospect", "cold email", "people search", "contact enrichment", "email sequence", or "outreach automation".
---

# Apollo Skill

Apollo.io is a B2B sales intelligence platform. Use this skill to search for contacts and companies, enrich contact data (including emails), and add contacts to outreach sequences.

## Authentication

All requests require an API key passed in the header:

```
x-api-key: $APOLLO_TOKEN
```

Get your API key from: Apollo dashboard → Settings → Integrations → API → Create API Key.

> **Note:** Adding contacts to sequences requires a **Master API Key** (not a standard key).

## Environment Variables

| Variable | Description |
|---|---|
| `APOLLO_TOKEN` | Apollo API key (standard or master) |

## Key Endpoints

Base URL: `https://api.apollo.io`

### 1. Search People

`POST /api/v1/mixed_people/api_search`

Find people by job title, company, industry, location, etc. **Does not return email addresses** — use Enrich to get emails.

```bash
curl -X POST https://api.apollo.io/api/v1/mixed_people/api_search \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "per_page": 25,
    "person_titles": ["CEO", "Founder"],
    "person_locations": ["United States"],
    "organization_num_employees_ranges": ["1,50"]
  }'
```

Key filter parameters:
- `person_titles` — job titles (array)
- `person_locations` — cities, states, or countries (array)
- `organization_num_employees_ranges` — e.g. `["1,50", "51,200"]`
- `q_keywords` — keyword search string

Response includes `people` array with `id`, `name`, `title`, `organization_name`, `linkedin_url`.

### 2. Search Organizations

`POST /api/v1/mixed_companies/search`

Find companies by industry, size, location, etc.

```bash
curl -X POST https://api.apollo.io/api/v1/mixed_companies/search \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "per_page": 25,
    "organization_locations": ["San Francisco, CA"],
    "organization_num_employees_ranges": ["1,50"],
    "q_organization_keyword_tags": ["SaaS", "B2B"]
  }'
```

### 3. Enrich a Person (get email)

`POST /api/v1/people/match`

Look up a specific person and retrieve their email. Consumes credits.

```bash
curl -X POST https://api.apollo.io/api/v1/people/match \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Tim",
    "last_name": "Cook",
    "organization_name": "Apple",
    "reveal_personal_emails": false
  }'
```

Parameters:
- `first_name`, `last_name`, `organization_name` — used to match the person
- `linkedin_url` — alternative identifier (preferred when available)
- `reveal_personal_emails` — set `true` to include personal emails (uses more credits)

Response includes `person.email` and full contact details.

### 4. Bulk Enrich People

`POST /api/v1/people/bulk_match`

Enrich up to 10 people in one request.

```bash
curl -X POST https://api.apollo.io/api/v1/people/bulk_match \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "details": [
      {"first_name": "Alice", "last_name": "Smith", "organization_name": "Acme Corp"},
      {"linkedin_url": "https://linkedin.com/in/bob-jones"}
    ]
  }'
```

Max 10 items per request. Response is `matches` array, one per input.

### 5. Add Contacts to a Sequence

`POST /api/v1/emailer_campaigns/{sequence_id}/add_contact_ids`

Add contacts to an email sequence. **Requires Master API Key.**

```bash
curl -X POST "https://api.apollo.io/api/v1/emailer_campaigns/{SEQUENCE_ID}/add_contact_ids" \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_ids": ["CONTACT_ID_1", "CONTACT_ID_2"],
    "emailer_campaign_id": "SEQUENCE_ID",
    "send_email_from_email_account_id": "EMAIL_ACCOUNT_ID"
  }'
```

To find sequence IDs, use `POST /api/v1/emailer_campaigns/search`.

## Common Workflows

### Full Cold Outreach Pipeline

```bash
# Step 1: Search for target people
curl -s -X POST https://api.apollo.io/api/v1/mixed_people/api_search \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"person_titles": ["VP Sales"], "per_page": 10}'

# Step 2: Enrich to get email
curl -s -X POST https://api.apollo.io/api/v1/people/match \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Jane", "last_name": "Doe", "organization_name": "Acme"}'

# Step 3: Add to sequence (requires Master API Key)
curl -s -X POST "https://api.apollo.io/api/v1/emailer_campaigns/$SEQUENCE_ID/add_contact_ids" \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"contact_ids\": [\"$CONTACT_ID\"], \"emailer_campaign_id\": \"$SEQUENCE_ID\"}"
```

### Find Sequences

```bash
curl -X POST https://api.apollo.io/api/v1/emailer_campaigns/search \
  -H "x-api-key: $APOLLO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"per_page": 25}'
```

## Notes

- People Search does **not** return emails — always follow up with Enrich
- Adding to sequences requires a **Master API Key** (Settings → Integrations → API → Master Key)
- Bulk enrichment: max 10 records per request
- Contact IDs used in sequences are created automatically when you enrich a person
