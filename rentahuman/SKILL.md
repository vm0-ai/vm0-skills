---
name: rentahuman
description: RentAHuman API for hiring humans from agent workflows. Use when the user mentions RentAHuman, human-in-the-loop tasks, human operators, or agent task delegation.
homepage: https://rentahuman.ai
docs: https://rentahuman.ai/docs
---

## Prerequisites

Connect the **RentAHuman** connector at https://app.vm0.ai/connectors so `RENTAHUMAN_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RENTAHUMAN_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $RENTAHUMAN_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<RENTAHUMAN_API_URL_FROM_DOCS>" --header "Authorization: Bearer $RENTAHUMAN_API_KEY" | jq .
```
