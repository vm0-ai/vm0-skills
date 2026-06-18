---
name: testerarmy
description: TesterArmy API for AI web and mobile app testing. Use when the user mentions TesterArmy, QA automation, test runs, or app testing agents.
homepage: https://tester.army
docs: https://docs.tester.army/api-reference/
---

## Prerequisites

Connect the **TesterArmy** connector at https://app.vm0.ai/connectors so `TESTERARMY_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TESTERARMY_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $TESTERARMY_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<TESTERARMY_API_URL_FROM_DOCS>" --header "Authorization: Bearer $TESTERARMY_API_KEY" | jq .
```
