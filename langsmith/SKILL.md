---
name: langsmith
description: LangSmith API for LLM observability, tracing, evaluation, and dataset management. Use when user mentions "LangSmith", "LangChain tracing", "LLM traces", "run evaluation", "create dataset", "annotate traces", or "monitor LLM".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name LANGSMITH_API_KEY` or `zero doctor check-connector --url https://api.smith.langchain.com/api/v1/runs --method GET`

## Authentication

All requests require an API key passed in the header:

```
X-Api-Key: $LANGSMITH_API_KEY
```

> Official docs: `https://docs.smith.langchain.com/reference/api`

## Environment Variables

| Variable | Description |
|---|---|
| `LANGSMITH_API_KEY` | LangSmith API key |

## Key Endpoints

Base URL: `https://api.smith.langchain.com`

---

## Runs (Traces)

### List Runs

List runs (traces) in a project with optional filters.

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/runs?session_name=<your-project-name>&limit=20" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

Key query parameters:
- `session_name` — project name to filter by
- `run_type` — filter by type: `llm`, `chain`, `tool`, `retriever`, `embedding`
- `limit` — number of results (default 20, max 100)
- `error` — set `true` to return only errored runs
- `start_time` — ISO 8601 datetime, e.g. `2024-01-01T00:00:00Z`

Response includes `runs` array. Each run has `id`, `name`, `run_type`, `status`, `inputs`, `outputs`, `error`, `start_time`, `end_time`, `total_tokens`, `prompt_tokens`, `completion_tokens`.

### Get a Run

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/runs/<run-id>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Query Runs (Advanced Filtering)

Write to `/tmp/langsmith_runs_query.json`:

```json
{
  "session_name": "<your-project-name>",
  "run_type": "llm",
  "limit": 50,
  "error": false,
  "start_time": "2024-01-01T00:00:00Z"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/runs/query" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_runs_query.json
```

---

## Projects (Sessions)

### List Projects

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/sessions" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

Response includes an array of projects with `id`, `name`, `description`, `run_count`, `latency_p50`, `latency_p99`, `total_tokens`, `feedback_stats`.

### Get a Project by Name

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/sessions?name=<your-project-name>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Create a Project

Write to `/tmp/langsmith_project.json`:

```json
{
  "name": "<your-project-name>",
  "description": "<optional description>"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/sessions" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_project.json
```

---

## Datasets

### List Datasets

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/datasets" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

Response includes `datasets` array with `id`, `name`, `description`, `created_at`, `example_count`.

### Create a Dataset

Write to `/tmp/langsmith_dataset.json`:

```json
{
  "name": "<your-dataset-name>",
  "description": "<optional description>",
  "data_type": "kv"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/datasets" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_dataset.json
```

`data_type` options: `kv` (key-value, default), `llm` (chat messages format).

### Get a Dataset

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/datasets/<dataset-id>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Delete a Dataset

```bash
curl -s -X DELETE "https://api.smith.langchain.com/api/v1/datasets/<dataset-id>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

---

## Dataset Examples

### List Examples in a Dataset

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/examples?dataset_id=<dataset-id>&limit=50" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Create an Example

Write to `/tmp/langsmith_example.json`:

```json
{
  "dataset_id": "<dataset-id>",
  "inputs": {
    "question": "What is the capital of France?"
  },
  "outputs": {
    "answer": "Paris"
  }
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/examples" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_example.json
```

### Batch Create Examples

Write to `/tmp/langsmith_examples_batch.json`:

```json
{
  "inputs": [
    {"question": "What is 2+2?"},
    {"question": "What is the capital of France?"}
  ],
  "outputs": [
    {"answer": "4"},
    {"answer": "Paris"}
  ],
  "dataset_id": "<dataset-id>"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/examples/bulk" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_examples_batch.json
```

### Delete an Example

```bash
curl -s -X DELETE "https://api.smith.langchain.com/api/v1/examples/<example-id>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

---

## Feedback

### Add Feedback to a Run

Write to `/tmp/langsmith_feedback.json`:

```json
{
  "run_id": "<run-id>",
  "key": "correctness",
  "score": 1.0,
  "comment": "The answer is correct and well-formatted"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/feedback" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_feedback.json
```

`score` is a float between 0.0 and 1.0. Use `key` to name the feedback metric (e.g. `correctness`, `helpfulness`, `relevance`).

### List Feedback for a Run

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/feedback?run_id=<run-id>" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

---

## Annotation Queues

### List Annotation Queues

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/annotation-queues" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Add Runs to an Annotation Queue

Write to `/tmp/langsmith_queue_runs.json`:

```json
[
  {"run_id": "<run-id-1>"},
  {"run_id": "<run-id-2>"}
]
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/annotation-queues/<queue-id>/runs" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_queue_runs.json
```

---

## Common Workflows

### Inspect Failed Runs

```bash
curl -s -X GET "https://api.smith.langchain.com/api/v1/runs?session_name=<your-project-name>&error=true&limit=20" --header "X-Api-Key: $LANGSMITH_API_KEY"
```

### Export Runs to a Dataset (for Evaluation)

Step 1 — create a dataset:

Write to `/tmp/langsmith_dataset.json`:

```json
{
  "name": "evaluation-set-v1",
  "description": "Curated examples for evaluation"
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/datasets" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_dataset.json
```

Step 2 — add examples from run inputs/outputs. Replace `<dataset-id>` with the ID returned above and `<run-id>` with the run you want to capture:

Write to `/tmp/langsmith_example.json`:

```json
{
  "dataset_id": "<dataset-id>",
  "source_run_id": "<run-id>",
  "inputs": {"question": "<input from the run>"},
  "outputs": {"answer": "<expected output>"}
}
```

```bash
curl -s -X POST "https://api.smith.langchain.com/api/v1/examples" --header "X-Api-Key: $LANGSMITH_API_KEY" --header "Content-Type: application/json" -d @/tmp/langsmith_example.json
```

---

## Guidelines

1. **Project names are case-sensitive** — use exact names when filtering runs by `session_name`
2. **Run IDs are UUIDs** — always copy from API responses; do not guess or construct them
3. **Feedback scores** are floats 0.0–1.0; use consistent `key` names across runs for aggregation to work
4. **Rate limits** — LangSmith enforces rate limits per API key; implement exponential backoff on 429 errors
5. **Large datasets** — use the `/examples/bulk` endpoint instead of creating examples one by one; max 100 per batch
