---
name: smol-machines
description: smol machines API for microVMs and sandboxes. Use when the user mentions smol machines, microVMs, cloud sandboxes, or isolated compute.
homepage: https://smolmachines.com
docs: https://smolmachines.com/docs/cloud-api
---

## Prerequisites

Connect the **smol machines** connector at https://app.vm0.ai/connectors so `SMOL_MACHINES_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SMOL_MACHINES_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $SMOL_MACHINES_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<SMOL_MACHINES_API_URL_FROM_DOCS>" --header "Authorization: Bearer $SMOL_MACHINES_API_KEY" | jq .
```
