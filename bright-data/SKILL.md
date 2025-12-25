---
name: bright-data
description: Bright Data API via curl. Use this skill for account management, usage monitoring, and billing information.
vm0_env:
  - BRIGHTDATA_API_KEY
---

# Bright Data API

Use the Bright Data API via direct `curl` calls for **account management**, **usage monitoring**, and **billing information**.

> Official docs: `https://docs.brightdata.com/`

---

## When to Use

Use this skill when you need to:

- **Check account status** - Verify API key and account state
- **Monitor usage** - Track bandwidth and request usage
- **Manage zones** - List and monitor active zones

---

## Prerequisites

1. Sign up at [Bright Data](https://brightdata.com/)
2. Get your API key from [Settings > Users](https://brightdata.com/cp/setting/users)

```bash
export BRIGHTDATA_API_KEY="your-api-key"
```

---


> **Important:** Do not pipe `curl` output directly to `jq` (e.g., `curl ... | jq`). Due to a Claude Code bug, environment variables in curl headers are silently cleared when pipes are used. Instead, use a two-step pattern:
> ```bash
> curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" > /tmp/response.json
> cat /tmp/response.json | jq .
> ```

## How to Use

All examples below assume you have `BRIGHTDATA_API_KEY` set.

Authentication uses Bearer token in the `Authorization` header.

---

### 1. Check Account Status

Verify your API key and account status:

```bash
curl -s "https://api.brightdata.com/status" -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" > /tmp/resp_1dfcfd.json
cat /tmp/resp_1dfcfd.json | jq .
```

**Response:**
```json
{
  "status": "active",
  "customer": "hl_xxxxxxxx",
  "can_make_requests": true,
  "ip": "x.x.x.x"
}
```

---

### 2. Get Active Zones

List all active zones in your account:

```bash
curl -s "https://api.brightdata.com/zone/get_active_zones" -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" > /tmp/resp_20ae7d.json
cat /tmp/resp_20ae7d.json | jq '.[] | {name, type}'
```

---

### 3. Get Zone Info

Get details about a specific zone:

```bash
ZONE_NAME="your-zone-name"

curl -s "https://api.brightdata.com/zone?zone=${ZONE_NAME}" -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" > /tmp/resp_2ba5dc.json
cat /tmp/resp_2ba5dc.json | jq .
```

---

### 4. Get Bandwidth Usage

Get bandwidth usage statistics:

```bash
curl -s "https://api.brightdata.com/customer/bw" -H "Authorization: Bearer ${BRIGHTDATA_API_KEY}" > /tmp/resp_4786de.json
cat /tmp/resp_4786de.json | jq .
```

---

## Response Format

### Account Status Response

```json
{
  "status": "active",
  "customer": "hl_xxxxxxxx",
  "can_make_requests": true,
  "ip": "x.x.x.x"
}
```

### Zone List Response

```json
[
  {
  "name": "zone_name",
  "type": "serp"
  }
]
```

---

## Guidelines

1. **API key only**: These endpoints work with just the API key
2. **Check status first**: Verify account is active before other operations
3. **Monitor usage**: Regularly check bandwidth usage
4. **Create zones in UI**: Zone creation requires the control panel
