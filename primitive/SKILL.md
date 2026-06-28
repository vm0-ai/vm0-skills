---
name: primitive
description: primitive API for email infrastructure. Use when the user mentions primitive, email infrastructure, mail APIs, or programmatic email workflows.
homepage: https://www.primitive.dev
docs: https://www.primitive.dev/openapi.json
---

## Prerequisites

Connect the **primitive** connector at https://app.vm0.ai/connectors so `PRIMITIVE_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name PRIMITIVE_API_KEY`.

## Usage

Use the official OpenAPI spec to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $PRIMITIVE_API_KEY`; if the spec specifies `x-api-key`, use that header instead.

```bash
curl -s "<PRIMITIVE_API_URL_FROM_OPENAPI>" --header "Authorization: Bearer $PRIMITIVE_API_KEY" | jq .
```
