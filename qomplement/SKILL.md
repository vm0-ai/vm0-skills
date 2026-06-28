---
name: qomplement
description: qomplement API for AI ERP and supply-chain operations. Use when the user mentions qomplement, ERP workflows, supply-chain automation, or operations planning.
homepage: https://qomplement.com
docs: https://docs.qomplement.com/
---

## Prerequisites

Connect the **qomplement** connector at https://app.vm0.ai/connectors so `QOMPLEMENT_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name QOMPLEMENT_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $QOMPLEMENT_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<QOMPLEMENT_API_URL_FROM_DOCS>" --header "Authorization: Bearer $QOMPLEMENT_API_KEY" | jq .
```
