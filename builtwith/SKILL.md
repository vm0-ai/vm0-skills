---
name: builtwith
description: BuiltWith API for looking up the technology stack, traffic, and contact data for any website. Use when user mentions "BuiltWith", "tech stack", "what is X built with", or wants to qualify a prospect by detected SaaS tools.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BUILTWITH_TOKEN` or `zero doctor check-connector --url https://api.builtwith.com/v21/api.json --method GET`.

## How to Use

BuiltWith authenticates with an API key passed as the `KEY` (uppercase)
query parameter on every request. The base URL is
`https://api.builtwith.com`.

### 1. Full technology profile for a domain

```bash
curl -s -G "https://api.builtwith.com/v21/api.json" \
  --data-urlencode "KEY=$BUILTWITH_TOKEN" \
  --data-urlencode "LOOKUP=stripe.com"
```

### 2. Domains using a specific technology

```bash
curl -s -G "https://api.builtwith.com/lists2/api.json" \
  --data-urlencode "KEY=$BUILTWITH_TOKEN" \
  --data-urlencode "TECH=Stripe"
```

### 3. Trends API (adoption history)

```bash
curl -s -G "https://api.builtwith.com/trends/v6/api.json" \
  --data-urlencode "KEY=$BUILTWITH_TOKEN" \
  --data-urlencode "TECH=Snowflake"
```

### 4. Company lookup (firmographics)

```bash
curl -s -G "https://api.builtwith.com/v14/companyApi.json" \
  --data-urlencode "KEY=$BUILTWITH_TOKEN" \
  --data-urlencode "LOOKUP=stripe.com"
```

### 5. Domain relationships

```bash
curl -s -G "https://api.builtwith.com/rv1/api.json" \
  --data-urlencode "KEY=$BUILTWITH_TOKEN" \
  --data-urlencode "LOOKUP=stripe.com"
```

## Guidelines

1. **Parameter casing matters** — `KEY` (uppercase) and `LOOKUP` (uppercase) are required.
2. **Pick the right product** — `v21/api.json` (technology profile), `lists2` (domain enumeration), `trends` (history), `companyApi` (firmographics).
3. **Free tier is narrow** — lists / trends require paid plans; the basic technology profile is included on most tiers.
4. **Response is huge** — domains can list hundreds of detected technologies; filter by category server-side via `LIVEONLY=yes`.
5. **Combine with Hunter / Clado** — pull tech stack, then find email contacts.
