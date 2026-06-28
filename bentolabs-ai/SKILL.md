---
name: bentolabs-ai
description: BentoLabs AI API for agent observability. Use when the user mentions BentoLabs AI, Bento, agent observability, agent traces, or AI evaluation telemetry.
homepage: https://bentolabs.ai
docs: https://docs.bentolabs.ai/llms.txt
---

## Prerequisites

Connect the **BentoLabs AI** connector at https://app.vm0.ai/connectors so `BENTOLABS_AI_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BENTOLABS_AI_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $BENTOLABS_AI_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<BENTOLABS_AI_API_URL_FROM_DOCS>" --header "Authorization: Bearer $BENTOLABS_AI_API_KEY" | jq .
```
