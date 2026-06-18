---
name: stablebrowse
description: StableBrowse API for browser automation. Use when the user mentions StableBrowse, browser automation, web agents, or hosted browsing workflows.
homepage: https://stablebrowse.com
docs: https://docs.stablebrowse.com/introduction
---

## Prerequisites

Connect the **StableBrowse** connector at https://app.vm0.ai/connectors so `STABLEBROWSE_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name STABLEBROWSE_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $STABLEBROWSE_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<STABLEBROWSE_API_URL_FROM_DOCS>" --header "Authorization: Bearer $STABLEBROWSE_API_KEY" | jq .
```
