---
name: chert
description: Chert API for iMessage infrastructure. Use when the user mentions Chert, iMessage automation, Apple Messages workflows, or messaging infrastructure.
homepage: https://trychert.com
docs: https://docs.trychert.com/introduction
---

## Prerequisites

Connect the **Chert** connector at https://app.vm0.ai/connectors so `CHERT_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CHERT_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $CHERT_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<CHERT_API_URL_FROM_DOCS>" --header "Authorization: Bearer $CHERT_API_KEY" | jq .
```
