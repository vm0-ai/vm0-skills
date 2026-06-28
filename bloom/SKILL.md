---
name: bloom
description: Bloom API and MCP for brand generation. Use when the user mentions Bloom, brand generation, design systems, brand assets, or marketing creative workflows.
homepage: https://www.trybloom.ai
docs: https://www.trybloom.ai/docs/api
---

## Prerequisites

Connect the **Bloom** connector at https://app.vm0.ai/connectors so `BLOOM_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BLOOM_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $BLOOM_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<BLOOM_API_URL_FROM_DOCS>" --header "Authorization: Bearer $BLOOM_API_KEY" | jq .
```
