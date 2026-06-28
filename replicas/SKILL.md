---
name: replicas
description: Replicas API for cloud coding agents. Use when the user mentions Replicas, coding agents, cloud coding sessions, or agent development environments.
homepage: https://tryreplicas.com
docs: https://docs.tryreplicas.com
---

## Prerequisites

Connect the **Replicas** connector at https://app.vm0.ai/connectors so `REPLICAS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name REPLICAS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $REPLICAS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<REPLICAS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $REPLICAS_API_KEY" | jq .
```
