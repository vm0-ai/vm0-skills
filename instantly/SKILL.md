---
name: instantly
description: Instantly.ai API for cold email campaigns. Use when user mentions "Instantly",
  "cold email", "email campaign", or outreach automation.
vm0_secrets:
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
- **Manage sending accounts** - list and configure email accounts
- **Automate outreach** - schedule sends and manage lead lists

---

## Prerequisites

1. Sign up at [Instantly.ai](https://instantly.ai/) (Growth plan or above required for API)
2. Go to Settings > Integrations > API to create an API key
3. Select appropriate scopes for your use case

```bash
export INSTANTLY_API_KEY="your-api-key"
```

#
### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/instantly-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $INSTANTLY_API_KEY" "$@"
EOF
chmod +x /tmp/instantly-curl
```

**Usage:** All examples below use `/tmp/instantly-curl` instead of direct `curl` calls.

## API Scopes

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
/tmp/instantly-curl "https://api.instantly.ai/api/v2/campaigns" | jq '.items[] | {id, name, status}'
```

With filters:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/campaigns?status=ACTIVE&limit=10" | jq '.items[] | {id, name}'
```

**Status values:** `ACTIVE`, `PAUSED`, `COMPLETED`, `DRAFTED`

---

### 2. Get Single Campaign

Get campaign details by ID. Replace `<your-campaign-id>` with the actual campaign ID:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/campaigns/<your-campaign-id>" | jq '{id, name, status, daily_limit}'
```

---

### 3. Create Campaign

Create a new campaign (requires `campaign_schedule`):

Write to `/tmp/instantly_request.json`:

```json
{
  "name": "My New Campaign",
  "daily_limit": 50,
  "campaign_schedule": {
    "schedules": [
      {
        "name": "Weekday Schedule",
        "timezone": "America/Chicago",
        "days": {
          "monday": true,
          "tuesday": true,
          "wednesday": true,
          "thursday": true,
          "friday": true,
          "saturday": false,
          "sunday": false
        },
        "timing": {
          "from": "09:00",
          "to": "17:00"
        }
      }
    ]
  }
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/campaigns" -d @/tmp/instantly_request.json
```

---

### 4. Pause/Activate Campaign

Control campaign status. Replace `<your-campaign-id>` with the actual campaign ID:

```bash
# Pause campaign
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/campaigns/<your-campaign-id>/pause"

# Activate campaign
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/campaigns/<your-campaign-id>/activate"
```

---

### 5. List Leads

List leads (POST endpoint due to complex filters):

Write to `/tmp/instantly_request.json`:

```json
{
  "limit": 10
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/leads/list" -d @/tmp/instantly_request.json | jq '.items[] | {id, email, first_name, last_name}'
```

Filter by campaign:

Write to `/tmp/instantly_request.json`:

```json
{
  "campaign_id": "your-campaign-id",
  "limit": 20
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/leads/list" -d @/tmp/instantly_request.json | jq '.items[] | {email, status}'
```

---

### 6. Create Lead

Add a single lead:

Write to `/tmp/instantly_request.json`:

```json
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "company_name": "Acme Corp",
  "campaign_id": "your-campaign-id"
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/leads" -d @/tmp/instantly_request.json
```

With custom variables:

Write to `/tmp/instantly_request.json`:

```json
{
  "email": "jane@example.com",
  "first_name": "Jane",
  "campaign_id": "your-campaign-id",
  "custom_variables": {
    "role": "CTO",
    "industry": "SaaS"
  }
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/leads" -d @/tmp/instantly_request.json
```

---

### 7. Get Single Lead

Get lead by ID. Replace `<your-lead-id>` with the actual lead ID:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/leads/<your-lead-id>"
```

---

### 8. Update Lead

Update lead information:

Write to `/tmp/instantly_request.json`:

```json
{
  "first_name": "Updated Name",
  "custom_variables": {
    "notes": "High priority"
  }
}
```

Then run. Replace `<your-lead-id>` with the actual lead ID:

```bash
/tmp/instantly-curl -X PATCH "https://api.instantly.ai/api/v2/leads/<your-lead-id>" -d @/tmp/instantly_request.json
```

---

### 9. List Lead Lists

Get all lead lists:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/lead-lists" | jq '.items[] | {id, name}'
```

---

### 10. Create Lead List

Create a new lead list:

Write to `/tmp/instantly_request.json`:

```json
{
  "name": "Q1 Prospects"
}
```

Then run:

```bash
/tmp/instantly-curl -X POST "https://api.instantly.ai/api/v2/lead-lists" -d @/tmp/instantly_request.json
```

---

### 11. List Email Accounts

Get connected sending accounts:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/accounts" | jq '.items[] | {email, status, warmup_status}'
```

---

### 12. Test API Key

Verify your API key is valid:

```bash
/tmp/instantly-curl "https://api.instantly.ai/api/v2/api-keys" | jq '.items[0] | {name, scopes}'
```

---

## Pagination

List endpoints support pagination:

```bash
# First page
/tmp/instantly-curl "https://api.instantly.ai/api/v2/campaigns?limit=10" | jq '{items: .items | length, next_starting_after: .next_starting_after}'

# Next page (replace <your-cursor> with the next_starting_after value from the previous response)
/tmp/instantly-curl "https://api.instantly.ai/api/v2/campaigns?limit=10&starting_after=<your-cursor>" | jq '.items[] | {id, name}'
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
