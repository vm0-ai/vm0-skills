---
name: arga-labs
description: Arga Labs API for API twins and sandboxes. Use when the user mentions Arga Labs, API twins, API mocks, sandboxes, or generated API environments.
homepage: https://argalabs.com
docs: https://argalabs.com/docs
---

## Prerequisites

Connect the **Arga Labs** connector at https://app.vm0.ai/connectors so `ARGA_LABS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ARGA_LABS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $ARGA_LABS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<ARGA_LABS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $ARGA_LABS_API_KEY" | jq .
```
