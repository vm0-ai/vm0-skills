---
name: wandb
description: Weights & Biases (W&B) API for ML experiment tracking, LLM observability (Weave), run management, and artifact versioning. Use when user mentions "W&B", "Weights & Biases", "wandb", "Weave", "experiment tracking", "ML runs", "model artifacts", or "LLM tracing".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name WANDB_API_KEY` or `zero doctor check-connector --url https://api.wandb.ai/graphql --method POST`

## Authentication

All requests require an API key passed as a Bearer token:

```
Authorization: Bearer $WANDB_API_KEY
```

## Key Endpoints

Base URL: `https://api.wandb.ai`

W&B exposes two main interfaces:
- **REST API** — run management, artifacts, reports
- **GraphQL API** — flexible queries at `https://api.wandb.ai/graphql`

---

### 1. Fetch Runs for a Project

List all runs in a project with their metrics and config.

```bash
curl -s "https://api.wandb.ai/api/v1/runs/<entity>/<project>" --header "Authorization: Bearer $WANDB_API_KEY"
```

Replace `<entity>` with your W&B username or team name, and `<project>` with your project name.

Response includes an array of run objects with `name`, `state`, `summary` (final metrics), and `config`.

### 2. Fetch a Single Run

```bash
curl -s "https://api.wandb.ai/api/v1/runs/<entity>/<project>/<run-id>" --header "Authorization: Bearer $WANDB_API_KEY"
```

### 3. Update Run Tags or Notes

Write to `/tmp/wandb_run_patch.json`:

```json
{
  "tags": ["production", "v2"],
  "notes": "Best performing checkpoint at epoch 10"
}
```

```bash
curl -s -X PATCH "https://api.wandb.ai/api/v1/runs/<entity>/<project>/<run-id>" --header "Authorization: Bearer $WANDB_API_KEY" --header "Content-Type: application/json" -d @/tmp/wandb_run_patch.json
```

### 4. Query Runs via GraphQL

GraphQL is the most powerful interface for filtering and aggregating runs. Write to `/tmp/wandb_query.json`:

```json
{
  "query": "query FetchRuns($project: String!, $entity: String!) { project(name: $project, entityName: $entity) { runs(first: 10, order: \"-summary_metrics.val_acc\") { edges { node { name displayName state createdAt summary config } } } } }",
  "variables": {
    "project": "<your-project>",
    "entity": "<your-entity>"
  }
}
```

```bash
curl -s -X POST "https://api.wandb.ai/graphql" --header "Authorization: Bearer $WANDB_API_KEY" --header "Content-Type: application/json" -d @/tmp/wandb_query.json
```

### 5. List Artifacts for a Project

```bash
curl -s "https://api.wandb.ai/api/v1/artifacts/<entity>/<project>" --header "Authorization: Bearer $WANDB_API_KEY"
```

### 6. Download an Artifact File

First fetch the artifact manifest to get file download URLs:

```bash
curl -s "https://api.wandb.ai/api/v1/artifacts/<entity>/<project>/<artifact-sequence-name>/<artifact-version>" --header "Authorization: Bearer $WANDB_API_KEY"
```

Replace `<artifact-version>` with `latest` or a specific version like `v3`.

### 7. List Reports (Saved Views)

```bash
curl -s "https://api.wandb.ai/api/v1/reports/<entity>/<project>" --header "Authorization: Bearer $WANDB_API_KEY"
```

### 8. Log a Custom Metric to a Run (via GraphQL Mutation)

Write to `/tmp/wandb_upsert.json`:

```json
{
  "query": "mutation UpsertRun($entity: String!, $project: String!, $name: String!, $summary: JSONString) { upsertBucket(input: {entityName: $entity, projectName: $project, name: $name, summaryMetrics: $summary}) { bucket { id name } } }",
  "variables": {
    "entity": "<your-entity>",
    "project": "<your-project>",
    "name": "<run-id>",
    "summary": "{\"custom_metric\": 0.95}"
  }
}
```

```bash
curl -s -X POST "https://api.wandb.ai/graphql" --header "Authorization: Bearer $WANDB_API_KEY" --header "Content-Type: application/json" -d @/tmp/wandb_upsert.json
```

---

## Prerequisites

Connect the **Weights & Biases** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name WANDB_API_KEY` or `zero doctor check-connector --url https://api.wandb.ai/graphql --method POST`

---

## Guidelines

1. **Entity vs. Project**: `entity` is your W&B username or team slug; `project` is the project name — both are required for most endpoints
2. **GraphQL for complex queries**: prefer GraphQL (`/graphql`) for filtering by metrics, sorting, or aggregating many runs; REST is better for simple CRUD
3. **Run IDs**: run IDs are short alphanumeric strings (e.g. `abc12def`) visible in the W&B UI URL: `wandb.ai/<entity>/<project>/runs/<run-id>`
4. **Artifact versions**: versions are zero-indexed integers prefixed with `v` (e.g. `v0`, `v1`); use `latest` as a shorthand for the most recent version
5. **Rate limits**: W&B enforces per-user rate limits; for bulk operations use pagination with `first`/`after` in GraphQL cursors

## API Reference

- Documentation: https://docs.wandb.ai/ref/rest
- GraphQL API: https://docs.wandb.ai/ref/query-panel/graphql
- Python SDK: https://docs.wandb.ai/ref/python
- Weave (LLM observability): https://wandb.github.io/weave/
