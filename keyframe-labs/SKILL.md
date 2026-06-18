---
name: keyframe-labs
description: Keyframe Labs API for realtime AI video personas. Use when the user mentions Keyframe Labs, video personas, realtime video agents, or AI avatar video.
homepage: https://keyframelabs.com
docs: https://docs.keyframelabs.com
---

## Prerequisites

Connect the **Keyframe Labs** connector at https://app.vm0.ai/connectors so `KEYFRAME_LABS_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name KEYFRAME_LABS_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $KEYFRAME_LABS_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<KEYFRAME_LABS_API_URL_FROM_DOCS>" --header "Authorization: Bearer $KEYFRAME_LABS_API_KEY" | jq .
```
