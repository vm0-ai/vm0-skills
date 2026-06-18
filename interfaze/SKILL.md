---
name: interfaze
description: Interfaze API for deterministic AI models. Use when the user mentions Interfaze, deterministic AI, model APIs, or predictable AI outputs.
homepage: https://interfaze.ai
docs: https://interfaze.ai/docs
---

## Prerequisites

Connect the **Interfaze** connector at https://app.vm0.ai/connectors so `INTERFAZE_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name INTERFAZE_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $INTERFAZE_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<INTERFAZE_API_URL_FROM_DOCS>" --header "Authorization: Bearer $INTERFAZE_API_KEY" | jq .
```
