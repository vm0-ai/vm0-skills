---
name: oddpool
description: Oddpool API for prediction-market data. Use when the user mentions Oddpool, prediction markets, market series, or event market data.
homepage: https://oddpool.com
docs: https://docs.oddpool.com/llms.txt
---

## Prerequisites

Connect the **Oddpool** connector at https://app.vm0.ai/connectors so `ODDPOOL_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ODDPOOL_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $ODDPOOL_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<ODDPOOL_API_URL_FROM_DOCS>" --header "Authorization: Bearer $ODDPOOL_API_KEY" | jq .
```
