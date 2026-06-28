---
name: archer
description: Archer API for gifting, rewards, and payouts. Use when the user mentions Archer, Archer Money, gift cards, rewards, or payout workflows.
homepage: https://archermoney.com
docs: https://docs.archermoney.com
---

## Prerequisites

Connect the **Archer** connector at https://app.vm0.ai/connectors so `ARCHER_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ARCHER_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $ARCHER_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<ARCHER_API_URL_FROM_DOCS>" --header "Authorization: Bearer $ARCHER_API_KEY" | jq .
```
