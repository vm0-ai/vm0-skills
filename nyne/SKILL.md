---
name: nyne
description: Nyne API for orchestrating AI sales agents that prospect, qualify, and book meetings. Use when user mentions "Nyne", "AI SDR", "AI sales agent", or wants to automate outbound and meeting scheduling end-to-end.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NYNE_TOKEN` or `zero doctor check-connector --url https://api.nyne.ai/v1/campaigns --method GET`.

## How to Use

Nyne authenticates with a Bearer token. The base URL is
`https://api.nyne.ai`.

### 1. List campaigns

```bash
curl -s "https://api.nyne.ai/v1/campaigns" \
  -H "Authorization: Bearer $NYNE_TOKEN"
```

### 2. Create a campaign

Write to `/tmp/nyne_request.json`:

```json
{
  "name": "VM0 Q3 EA outbound",
  "target_persona": "Executive Assistant at 100-500 person SaaS",
  "outreach_channels": ["email"],
  "calendar_link": "https://cal.com/ethan/intro"
}
```

Then run:

```bash
curl -s -X POST "https://api.nyne.ai/v1/campaigns" \
  -H "Authorization: Bearer $NYNE_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/nyne_request.json
```

### 3. Add leads to a campaign

Write to `/tmp/nyne_request.json`:

```json
{
  "leads": [
    { "email": "jane@example.com", "first_name": "Jane", "company": "Example Corp" },
    { "email": "joe@another.com", "first_name": "Joe", "company": "Another Inc" }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://api.nyne.ai/v1/campaigns/$CAMPAIGN_ID/leads" \
  -H "Authorization: Bearer $NYNE_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/nyne_request.json
```

### 4. Get reply / meeting analytics

```bash
curl -s "https://api.nyne.ai/v1/campaigns/$CAMPAIGN_ID/analytics" \
  -H "Authorization: Bearer $NYNE_TOKEN"
```

### 5. List booked meetings

```bash
curl -s -G "https://api.nyne.ai/v1/meetings" \
  --data-urlencode "status=booked" \
  --data-urlencode "limit=50" \
  -H "Authorization: Bearer $NYNE_TOKEN"
```

## Guidelines

1. **Connect a sending mailbox first** — Nyne sends from your warmed-up Gmail / Outlook; complete the OAuth flow in the Nyne dashboard before pushing leads.
2. **`target_persona` matters** — Nyne tailors copy from the persona string; be specific (role + company stage + pain point).
3. **Lead deduplication** — Nyne dedupes by email; pushing the same address twice is a no-op, not an error.
4. **Webhook for replies** — register a webhook on the campaign to receive `reply.positive`, `reply.negative`, `meeting.booked` events.
5. **Pacing** — Nyne respects a per-mailbox daily send cap; bulk-pushing 10k leads will queue, not blast.
