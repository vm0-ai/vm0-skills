---
name: voquill
description: Voquill API for medical lab workflows. Use when the user mentions Voquill, lab operations, medical testing workflows, or healthcare lab automation.
homepage: https://voquill.com
docs: https://docs.voquill.com/
---

## Prerequisites

Connect the **Voquill** connector at https://app.vm0.ai/connectors so `VOQUILL_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name VOQUILL_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $VOQUILL_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<VOQUILL_API_URL_FROM_DOCS>" --header "Authorization: Bearer $VOQUILL_API_KEY" | jq .
```
