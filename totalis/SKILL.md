---
name: totalis
description: Totalis API for prediction-market derivatives and trading. Use when the user mentions Totalis, prediction-market derivatives, trading APIs, or market positions.
homepage: https://totalis.trade
docs: https://docs.totalis.trade/api-reference/introduction
---

## Prerequisites

Connect the **Totalis** connector at https://app.vm0.ai/connectors so `TOTALIS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TOTALIS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $TOTALIS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<TOTALIS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $TOTALIS_API_KEY" | jq .
```
