---
name: trellis
description: Trellis API for short-rental operations. Use when the user mentions Trellis, short-term rentals, property operations, or rental workflow automation.
homepage: https://trellistech.com
docs: https://docs.trellistech.com
---

## Prerequisites

Connect the **Trellis** connector at https://app.vm0.ai/connectors so `TRELLIS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TRELLIS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $TRELLIS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<TRELLIS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $TRELLIS_API_KEY" | jq .
```
