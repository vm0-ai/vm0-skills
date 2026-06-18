---
name: salesgraph
description: Salesgraph API for revenue agents. Use when the user mentions Salesgraph, revenue workflows, sales automation, account research, or prospecting agents.
homepage: https://salesgraph.com
docs: https://docs.salesgraph.com
---

## Prerequisites

Connect the **Salesgraph** connector at https://app.vm0.ai/connectors so `SALESGRAPH_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SALESGRAPH_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $SALESGRAPH_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<SALESGRAPH_API_URL_FROM_DOCS>" --header "Authorization: Bearer $SALESGRAPH_API_KEY" | jq .
```
