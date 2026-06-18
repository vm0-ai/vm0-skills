---
name: ardent
description: Ardent API for Postgres branching. Use when the user mentions Ardent, database branching, Postgres branches, or database preview environments.
homepage: https://tryardent.com
docs: https://docs.tryardent.com/
---

## Prerequisites

Connect the **Ardent** connector at https://app.vm0.ai/connectors so `ARDENT_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ARDENT_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $ARDENT_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<ARDENT_API_URL_FROM_DOCS>" --header "Authorization: Bearer $ARDENT_API_KEY" | jq .
```
