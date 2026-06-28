---
name: armature
description: Armature API for agent session analytics and evaluations. Use when the user mentions Armature, agent traces, session analytics, or eval workflows.
homepage: https://armature.tech
docs: https://armature.tech/docs
---

## Prerequisites

Connect the **Armature** connector at https://app.vm0.ai/connectors so `ARMATURE_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ARMATURE_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $ARMATURE_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<ARMATURE_API_URL_FROM_DOCS>" --header "Authorization: Bearer $ARMATURE_API_KEY" | jq .
```
