---
name: kugelaudio
description: KugelAudio API for text-to-speech and voice AI. Use when the user mentions KugelAudio, TTS, speech generation, or voice AI workflows.
homepage: https://www.kugelaudio.com
docs: https://docs.kugelaudio.com/
---

## Prerequisites

Connect the **KugelAudio** connector at https://app.vm0.ai/connectors so `KUGELAUDIO_API_KEY` is available.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name KUGELAUDIO_API_KEY`.

## Usage

Use the official docs to choose the endpoint and request body. Authenticated API calls typically use `Authorization: Bearer $KUGELAUDIO_API_KEY`; if the docs specify `x-api-key`, use that header instead.

```bash
curl -s "<KUGELAUDIO_API_URL_FROM_DOCS>" --header "Authorization: Bearer $KUGELAUDIO_API_KEY" | jq .
```
