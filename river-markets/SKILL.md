---
name: river-markets
description: River Markets API for prediction-market execution and data. Use when the user mentions River Markets, prediction markets, trading execution, or market data.
homepage: https://rivermarkets.com
docs: https://docs.rivermarkets.com/introduction
---

## Prerequisites

Connect the **River Markets** connector at https://app.vm0.ai/connectors so `RIVER_MARKETS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RIVER_MARKETS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $RIVER_MARKETS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<RIVER_MARKETS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $RIVER_MARKETS_API_KEY" | jq .
```
