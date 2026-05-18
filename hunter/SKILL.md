---
name: hunter
description: Hunter.io API for finding and verifying professional email addresses. Use when user mentions "Hunter", "find email", "verify email", or wants to prospect contacts at a specific company domain.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name HUNTER_TOKEN` or `zero doctor check-connector --url https://api.hunter.io/v2/account --method GET`.

## How to Use

Hunter authenticates with an API key passed as the `api_key` query
parameter on every request. The base URL is `https://api.hunter.io`.

### 1. Domain search (find all emails at a company)

```bash
curl -s -G "https://api.hunter.io/v2/domain-search" \
  --data-urlencode "domain=stripe.com" \
  --data-urlencode "limit=10" \
  --data-urlencode "api_key=$HUNTER_TOKEN"
```

### 2. Email finder (guess a specific person's email)

```bash
curl -s -G "https://api.hunter.io/v2/email-finder" \
  --data-urlencode "domain=stripe.com" \
  --data-urlencode "first_name=Patrick" \
  --data-urlencode "last_name=Collison" \
  --data-urlencode "api_key=$HUNTER_TOKEN"
```

### 3. Email verifier

```bash
curl -s -G "https://api.hunter.io/v2/email-verifier" \
  --data-urlencode "email=patrick@stripe.com" \
  --data-urlencode "api_key=$HUNTER_TOKEN"
```

### 4. Email count for a domain (free, no quota)

```bash
curl -s -G "https://api.hunter.io/v2/email-count" \
  --data-urlencode "domain=stripe.com" \
  --data-urlencode "api_key=$HUNTER_TOKEN"
```

### 5. Account info / remaining quota

```bash
curl -s -G "https://api.hunter.io/v2/account" \
  --data-urlencode "api_key=$HUNTER_TOKEN"
```

## Guidelines

1. **Confidence score** — every result includes `confidence` (0-100); treat <50 as low-quality before reaching out.
2. **Email-finder vs domain-search** — domain-search returns everyone Hunter knows; email-finder is a targeted single-person lookup that costs more credits.
3. **Always verify before sending** — use `email-verifier` immediately after `email-finder` to avoid bounces.
4. **Quota is per request, not per result** — fetching 100 emails costs 1 domain-search credit.
