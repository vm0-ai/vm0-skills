---
name: insforge
description: InsForge API for backend and cloud infrastructure. Use when the user mentions InsForge, agent-native backends, cloud infrastructure APIs, or InsForge projects.
homepage: https://www.insforge.dev
docs: https://docs.insforge.dev/
---

## Prerequisites

Connect the **InsForge** connector at https://app.vm0.ai/connectors so `INSFORGE_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name INSFORGE_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $INSFORGE_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<INSFORGE_API_URL_FROM_DOCS>" --header "Authorization: Bearer $INSFORGE_API_KEY" | jq .
```
