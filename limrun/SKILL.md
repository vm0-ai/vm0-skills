---
name: limrun
description: Limrun API for remote mobile builds and simulators. Use when the user mentions Limrun, mobile builds, iOS or Android simulators, or app testing environments.
homepage: https://limrun.com
docs: https://docs.limrun.com/docs
---

## Prerequisites

Connect the **Limrun** connector at https://app.vm0.ai/connectors so `LIMRUN_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name LIMRUN_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $LIMRUN_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<LIMRUN_API_URL_FROM_DOCS>" --header "Authorization: Bearer $LIMRUN_API_KEY" | jq .
```
