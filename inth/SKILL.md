---
name: inth
description: Inth API for privacy-compliance infrastructure. Use when the user mentions Inth, privacy compliance, data subject requests, consent, or compliance automation.
homepage: https://inth.com
docs: https://inth.com/docs/getting-started
---

## Prerequisites

Connect the **Inth** connector at https://app.vm0.ai/connectors so `INTH_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name INTH_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $INTH_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<INTH_API_URL_FROM_DOCS>" --header "Authorization: Bearer $INTH_API_KEY" | jq .
```
