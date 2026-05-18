---
name: postalform
description: PostalForm API for sending direct mail, postcards, and physical letters from your app. Use when user mentions "PostalForm", "direct mail", "send a postcard", or "physical letter".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name POSTALFORM_TOKEN` or `zero doctor check-connector --url https://api.postalform.com/v1/letters --method POST`.

## How to Use

PostalForm authenticates with a Bearer token. The base URL is
`https://api.postalform.com`.

### 1. Send a postcard

Write to `/tmp/postalform_request.json`:

```json
{
  "to": {
    "name": "Jane Doe",
    "address_line1": "1 Hacker Way",
    "city": "Menlo Park",
    "state": "CA",
    "postal_code": "94025",
    "country": "US"
  },
  "from": {
    "name": "VM0 HQ",
    "address_line1": "548 Market St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94104",
    "country": "US"
  },
  "front_html": "<h1>Hi from VM0!</h1>",
  "back_html": "<p>Thanks for being a beta user.</p>"
}
```

Then run:

```bash
curl -s -X POST "https://api.postalform.com/v1/postcards" \
  -H "Authorization: Bearer $POSTALFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/postalform_request.json
```

### 2. Send a one-page letter

Write to `/tmp/postalform_request.json`:

```json
{
  "to": { "name": "Jane Doe", "address_line1": "1 Hacker Way", "city": "Menlo Park", "state": "CA", "postal_code": "94025", "country": "US" },
  "from": { "name": "VM0 HQ", "address_line1": "548 Market St", "city": "San Francisco", "state": "CA", "postal_code": "94104", "country": "US" },
  "html": "<p>Dear Jane, thanks for using vm0...</p>",
  "color": false,
  "double_sided": false
}
```

Then run:

```bash
curl -s -X POST "https://api.postalform.com/v1/letters" \
  -H "Authorization: Bearer $POSTALFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/postalform_request.json
```

### 3. Get letter status

```bash
curl -s "https://api.postalform.com/v1/letters/$LETTER_ID" \
  -H "Authorization: Bearer $POSTALFORM_TOKEN"
```

### 4. List recent sends

```bash
curl -s -G "https://api.postalform.com/v1/letters" \
  --data-urlencode "limit=20" \
  -H "Authorization: Bearer $POSTALFORM_TOKEN"
```

### 5. Cancel a queued send (before printing)

```bash
curl -s -X DELETE "https://api.postalform.com/v1/letters/$LETTER_ID" \
  -H "Authorization: Bearer $POSTALFORM_TOKEN"
```

## Guidelines

1. **Address verification** — PostalForm validates the recipient address on submission; bad addresses fail fast with a `422`.
2. **HTML templating** — supports basic HTML/CSS; embedded images must be HTTPS URLs.
3. **Cancellation window** — once printed (`status: printed`), a send cannot be cancelled.
4. **International** — most plans cover US destinations; check supported countries before sending abroad.
5. **Test mode** — use a `live: false` flag in non-prod environments to dry-run without printing.
