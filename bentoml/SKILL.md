---
name: bentoml
description: BentoML and BentoCloud API for model serving, deployment endpoint calls,
  and protected BentoCloud inference endpoints. Use when user mentions "BentoML",
  "BentoCloud", "Bento", model serving, or protected deployment endpoints.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BENTO_CLOUD_API_KEY` or `zero doctor check-connector --url "$BENTO_CLOUD_API_ENDPOINT" --method GET`

## Official Docs

- BentoCloud API reference: https://docs.bentoml.com/en/latest/reference/bentocloud/bentocloud-api.html
- Protected deployment endpoints: https://docs.bentoml.com/en/latest/scale-with-bentocloud/manage-api-tokens.html
- Calling deployment endpoints: https://docs.bentoml.com/en/latest/scale-with-bentocloud/deployment/call-deployment-endpoints.html

## Prerequisites

Connect the **BentoML** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The connector provides:

- `BENTO_CLOUD_API_KEY`: BentoCloud API token
- `BENTO_CLOUD_API_ENDPOINT`: organization endpoint, for example `https://your-org.cloud.bentoml.com`

## How to Use

### Call a Protected Deployment Endpoint

Use the endpoint URL from the BentoCloud deployment page or Playground tab. Replace `<deployment-endpoint>` and `/summarize` with the actual endpoint URL and route for the deployment.

Write to `/tmp/bentoml_request.json`:

```json
{
  "text": "Summarize this text with the deployed Bento service."
}
```

Then run:

```bash
curl -s -X POST "https://<deployment-endpoint>/summarize" --header "Authorization: Bearer $BENTO_CLOUD_API_KEY" --header "Content-Type: application/json" -d @/tmp/bentoml_request.json
```

### Call a JSON Inference Route

Write to `/tmp/bentoml_request.json`:

```json
{
  "prompt": "Write a concise status update for this deployment."
}
```

Then run:

```bash
curl -s -X POST "https://<deployment-endpoint>/<route>" --header "Authorization: Bearer $BENTO_CLOUD_API_KEY" --header "Content-Type: application/json" -d @/tmp/bentoml_request.json | jq .
```

### Call a Text Response Route

```bash
curl -s -X POST "https://<deployment-endpoint>/<route>" --header "Authorization: Bearer $BENTO_CLOUD_API_KEY" --header "Content-Type: application/json" -d '{"text":"Hello from vm0"}'
```

### Access a BYOC Monitoring Federate Endpoint

Monitoring tokens are only available for BYOC customers. Replace `<cluster>` with the BentoCloud cluster name.

```bash
curl -s --get "https://prometheus.monitoring.<cluster>.bentoml.ai/federate" --header "Authorization: Bearer $BENTO_CLOUD_API_KEY" --data-urlencode 'match[]={yatai_ai_bento_function!=""}'
```

## Guidelines

- Use the exact endpoint URL and route from the BentoCloud Playground tab; BentoML deployments expose user-defined routes.
- Protected deployments require a token with Protected Endpoint Access.
- Use `BENTO_CLOUD_API_ENDPOINT` for BentoCloud organization API context and protected deployment URLs for inference calls.
- Do not print or store BentoCloud API tokens.
