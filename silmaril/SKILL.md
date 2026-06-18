---
name: silmaril
description: Silmaril API and SDK for AI application firewalls. Use when the user mentions Silmaril, AI security, prompt injection defense, or AI firewall workflows.
homepage: https://www.silmaril.dev
docs: https://www.silmaril.dev/docs
---

## Prerequisites

Connect the **Silmaril** connector at https://app.vm0.ai/connectors so `SILMARIL_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SILMARIL_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $SILMARIL_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<SILMARIL_API_URL_FROM_DOCS>" --header "Authorization: Bearer $SILMARIL_API_KEY" | jq .
```
