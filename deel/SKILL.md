---
name: deel
description: Deel API for global payroll and contractors. Use when user mentions "Deel",
  "contractors", "global payroll", or "EOR".
vm0_secrets:
  - DEEL_TOKEN
---

# Deel API

Manage contracts, people, time off, and organization data with the Deel REST API.

> Official docs: `https://developer.deel.com/docs`

## When to Use

- List and manage contracts (EOR, contractor, etc.)
- View employee and contractor profiles
- Manage time off requests
- Access organization and team information
- View invoice adjustments and payslips

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Deel**. vm0 will automatically inject the required `DEEL_TOKEN` environment variable.


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/deel-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $DEEL_TOKEN" "$@"
EOF
chmod +x /tmp/deel-curl
```

**Usage:** All examples below use `/tmp/deel-curl` instead of direct `curl` calls.

## Core APIs

### List Contracts

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/contracts?limit=10" | jq '.data[] | {id, title, type, status, worker: .worker.name}'
```

Docs: https://developer.deel.com/reference/list-contracts

---

### Get Contract Details

Replace `<contract-id>` with the actual contract ID:

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/contracts/<contract-id>" | jq '.data | {id, title, type, status, worker, start_date, client}'
```

---

### List People

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/people?limit=10" | jq '.data[] | {id, full_name, email, hiring_status, hiring_type}'
```

Docs: https://developer.deel.com/reference/list-people

---

### Get Person Details

Replace `<person-id>` with the actual person ID:

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/people/<person-id>" | jq '.data | {id, full_name, email, hiring_status, hiring_type, country, department}'
```

---

### List Time Off Requests

Replace `<hris-profile-id>` with the worker's HRIS profile ID:

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/time_offs/profile/<hris-profile-id>?limit=10" | jq '.data[] | {id, type, status, start_date, end_date}'
```

---

### Create Time Off Request

Write to `/tmp/deel_request.json`:

```json
{
  "contract_id": "<contract-id>",
  "type": "vacation",
  "start_date": "2026-04-01",
  "end_date": "2026-04-05",
  "reason": "Family vacation"
}
```

```bash
/tmp/deel-curl -X POST "https://api.deel.com/rest/v2/time_offs" -d @/tmp/deel_request.json | jq '.data | {id, type, status, start_date, end_date}'
```

---

### List Invoice Adjustments

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/invoice-adjustments?limit=10" | jq '.data[] | {id, type, amount, currency, status, contract_id}'
```

---

### Create Invoice Adjustment

Write to `/tmp/deel_request.json`:

```json
{
  "contract_id": "<contract-id>",
  "amount": 500,
  "currency": "USD",
  "type": "bonus",
  "description": "Performance bonus Q1 2026"
}
```

```bash
/tmp/deel-curl -X POST "https://api.deel.com/rest/v2/invoice-adjustments" -d @/tmp/deel_request.json | jq '.data | {id, type, amount, currency, status}'
```

---

### Get Organization Info

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/organizations" | jq '.data | {id, name, country, currency}'
```

---

### List Teams

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/teams?limit=10" | jq '.data[] | {id, name, members_count}'
```

---

### List Countries

Get supported countries for hiring:

```bash
/tmp/deel-curl "https://api.deel.com/rest/v2/countries" | jq '.data[:5] | .[] | {code, name}'
```

---

## Guidelines

1. **API versioning**: Use `/rest/v2/` endpoints for the latest API version
2. **Contract types**: Common types include `pay_as_you_go` (contractor), `ongoing` (employee/EOR), `milestone` (project-based)
3. **Time off types**: vacation, sick_leave, personal, parental, etc.
4. **Pagination**: Use `limit` and `offset` query parameters; default limit is 20
5. **Rate limits**: Standard API rate limits apply; back off on 429 responses
6. **Sandbox**: Deel offers a sandbox environment at `https://api-sandbox.demo.deel.com` for testing
7. **Invoice adjustments**: Only available for contractor contracts, not EOR
