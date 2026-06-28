---
name: netter
description: Netter API for AI data platforms. Use when the user mentions Netter, AI data pipelines, data platform APIs, or structured data workflows.
homepage: https://netter.ai
docs: https://netter.ai/docs
---

## Prerequisites

Connect the **Netter** connector at https://app.vm0.ai/connectors so `NETTER_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NETTER_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $NETTER_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<NETTER_API_URL_FROM_DOCS>" --header "Authorization: Bearer $NETTER_API_KEY" | jq .
```
