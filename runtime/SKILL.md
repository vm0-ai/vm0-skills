---
name: runtime
description: Runtime API for agent runtimes and sandboxes. Use when the user mentions Runtime, runtm, agent runtime infrastructure, or sandboxed agent execution.
homepage: https://runtm.com
docs: https://docs.runtm.com/introduction
---

## Prerequisites

Connect the **Runtime** connector at https://app.vm0.ai/connectors so `RUNTIME_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RUNTIME_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $RUNTIME_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<RUNTIME_API_URL_FROM_DOCS>" --header "Authorization: Bearer $RUNTIME_API_KEY" | jq .
```
