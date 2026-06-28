---
name: minicor
description: Minicor API for computer-use and RPA automation. Use when the user mentions Minicor, browser or desktop automation, RPA, or computer-use agents.
homepage: https://www.minicor.com
docs: https://www.minicor.com/docs
---

## Prerequisites

Connect the **Minicor** connector at https://app.vm0.ai/connectors so `MINICOR_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MINICOR_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $MINICOR_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<MINICOR_API_URL_FROM_DOCS>" --header "Authorization: Bearer $MINICOR_API_KEY" | jq .
```
