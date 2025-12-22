name: instantly
description: Instantly.ai API via curl. Use this skill for cold email outreach automation, managing campaigns, leads, and email accounts.
vm0_env:

- INSTANTLY_API_KEY

---

# Instantly API

Use the Instantly API via direct `curl` calls to automate **cold email outreach**, manage campaigns, leads, and sending accounts.

> Official docs: `https://developer.instantly.ai/`

---

## When to Use

Use this skill when you need to:

- **Manage email campaigns** - create, launch, pause campaigns
- **Handle leads** - add, update, list leads in campaigns
- **Track analytics** - get campaign performance metrics
- **Manage sending accounts** - list and configure email accounts
- **Automate outreach** - bulk add leads, schedule sends

---

## Prerequisites

1. Sign up at [Instantly.ai](https://instantly.ai/) (Growth plan or above required for API)
2. Go to Settings > Integrations > API to create an API key
3. Select appropriate scopes for your use case

```bash
export INSTANTLY_API_KEY="your-api-key"
```

### API Scopes

Create API keys with specific permissions:
- `campaigns:read`, `campaigns:create`, `campaigns:update`
- `leads:read`, `leads:create`, `leads:update`, `leads:delete`
- `lead_lists:read`, `lead_lists:create`
- `analytics:read`
- `all:all` (full access)

---

## How to Use

All examples below assume you have `INSTANTLY_API_KEY` set.

The base URL for API V2 is:

- `https://api.instantly.ai/api/v2`

Authentication uses Bearer token in the `Authorization` header.

---

### 1. List Campaigns

Get all campaigns:

```bash
curl -s "https://api.instantly.ai/api/v2/campaigns" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '.items[] | {id, name, status}'
```

With filters:

```bash
curl -s "https://api.instantly.ai/api/v2/campaigns?status=ACTIVE&limit=10" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '.items[] | {id, name}'
```

**Status values:** `ACTIVE`, `PAUSED`, `COMPLETED`, `DRAFTED`

---

### 2. Get Single Campaign

Get campaign details by ID:

```bash
CAMPAIGN_ID="your-campaign-id"

curl -s "https://api.instantly.ai/api/v2/campaigns/${CAMPAIGN_ID}" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '{id, name, status, daily_limit}'
```

---

### 3. Create Campaign

Create a new campaign:

```bash
curl -s "https://api.instantly.ai/api/v2/campaigns" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Campaign",
    "daily_limit": 50
  }' \
  | jq .
```

---

### 4. Pause/Activate Campaign

Control campaign status:

```bash
CAMPAIGN_ID="your-campaign-id"

# Pause campaign
curl -s "https://api.instantly.ai/api/v2/campaigns/${CAMPAIGN_ID}/pause" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq .

# Activate campaign
curl -s "https://api.instantly.ai/api/v2/campaigns/${CAMPAIGN_ID}/activate" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq .
```

---

### 5. List Leads

List leads (POST endpoint due to complex filters):

```bash
curl -s "https://api.instantly.ai/api/v2/leads/list" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}' \
  | jq '.items[] | {id, email, first_name, last_name}'
```

Filter by campaign:

```bash
curl -s "https://api.instantly.ai/api/v2/leads/list" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "your-campaign-id",
    "limit": 20
  }' \
  | jq '.items[] | {email, status}'
```

---

### 6. Create Lead

Add a single lead:

```bash
curl -s "https://api.instantly.ai/api/v2/leads" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "company_name": "Acme Corp",
    "campaign_id": "your-campaign-id"
  }' \
  | jq .
```

With custom variables:

```bash
curl -s "https://api.instantly.ai/api/v2/leads" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "first_name": "Jane",
    "campaign_id": "your-campaign-id",
    "custom_variables": {
      "role": "CTO",
      "industry": "SaaS"
    }
  }' \
  | jq .
```

---

### 7. Bulk Add Leads

Add multiple leads at once:

```bash
curl -s "https://api.instantly.ai/api/v2/leads/bulk" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "your-campaign-id",
    "leads": [
      {"email": "lead1@example.com", "first_name": "Lead1"},
      {"email": "lead2@example.com", "first_name": "Lead2"},
      {"email": "lead3@example.com", "first_name": "Lead3"}
    ]
  }' \
  | jq .
```

---

### 8. Get Single Lead

Get lead by ID:

```bash
LEAD_ID="your-lead-id"

curl -s "https://api.instantly.ai/api/v2/leads/${LEAD_ID}" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq .
```

---

### 9. Update Lead

Update lead information:

```bash
LEAD_ID="your-lead-id"

curl -s "https://api.instantly.ai/api/v2/leads/${LEAD_ID}" \
  -X PATCH \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Updated Name",
    "custom_variables": {
      "notes": "High priority"
    }
  }' \
  | jq .
```

---

### 10. List Lead Lists

Get all lead lists:

```bash
curl -s "https://api.instantly.ai/api/v2/lead-lists" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '.items[] | {id, name}'
```

---

### 11. Create Lead List

Create a new lead list:

```bash
curl -s "https://api.instantly.ai/api/v2/lead-lists" \
  -X POST \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Prospects"
  }' \
  | jq .
```

---

### 12. Get Campaign Analytics

Get campaign performance metrics:

```bash
CAMPAIGN_ID="your-campaign-id"

curl -s "https://api.instantly.ai/api/v2/analytics/campaign/${CAMPAIGN_ID}" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '{sent, opened, replied, clicked}'
```

Get analytics for all campaigns:

```bash
curl -s "https://api.instantly.ai/api/v2/analytics/campaign" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq .
```

---

### 13. List Email Accounts

Get connected sending accounts:

```bash
curl -s "https://api.instantly.ai/api/v2/accounts" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '.items[] | {email, status, warmup_status}'
```

---

### 14. Test API Key

Verify your API key is valid:

```bash
curl -s "https://api.instantly.ai/api/v2/api-keys" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '.items[0] | {name, scopes}'
```

---

## Pagination

List endpoints support pagination:

```bash
# First page
curl -s "https://api.instantly.ai/api/v2/campaigns?limit=10" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq '{items: .items | length, next_starting_after: .next_starting_after}'

# Next page
curl -s "https://api.instantly.ai/api/v2/campaigns?limit=10&starting_after=CURSOR" \
  -H "Authorization: Bearer ${INSTANTLY_API_KEY}" \
  | jq .
```

---

## Guidelines

1. **Use API V2**: V1 is deprecated, use V2 endpoints only
2. **Bearer token auth**: Always use `Authorization: Bearer` header
3. **Scope your keys**: Create keys with minimal required permissions
4. **Custom variables**: Values must be string, number, boolean, or null (no objects/arrays)
5. **Leads list is POST**: Due to complex filters, listing leads uses POST not GET
6. **Rate limits**: Respect rate limits based on your plan tier
7. **Growth plan required**: API access requires Growth plan or above
