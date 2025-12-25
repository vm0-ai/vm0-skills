---
name: axiom
description: Axiom observability platform for logs, events, and analytics via REST API
vm0_env:
  - AXIOM_API_TOKEN
---

# Axiom

Axiom is a cloud-native observability platform for storing, querying, and analyzing log and event data at scale. Use the REST API to ingest data, run queries using APL (Axiom Processing Language), and manage datasets programmatically.

> Official docs: `https://axiom.co/docs/restapi/introduction`

---

## When to Use

Use this skill when you need to:

- Send logs, metrics, or event data to Axiom
- Query and analyze data using APL (Axiom Processing Language)
- Manage datasets, monitors, and annotations
- Build observability pipelines and dashboards

---

## Prerequisites

1. Create an Axiom account at https://app.axiom.co/register
2. Create an API token with appropriate permissions (Settings > API Tokens)
3. Create a dataset to store your data

Set environment variable:

```bash
export AXIOM_API_TOKEN="xaat-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---


> **Important:** Do not pipe `curl` output directly to `jq` (e.g., `curl ... | jq`). Due to a Claude Code bug, environment variables in curl headers are silently cleared when pipes are used. Instead, use a two-step pattern:
> ```bash
> curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" > /tmp/response.json
> cat /tmp/response.json | jq .
> ```

## How to Use

### Base URLs

- **Ingest (US East)**: `https://us-east-1.aws.edge.axiom.co`
- **Ingest (EU Central)**: `https://eu-central-1.aws.edge.axiom.co`
- **API**: `https://api.axiom.co`

### 1. List Datasets

```bash
curl -s "https://api.axiom.co/v2/datasets" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" > /tmp/resp_a2bfa3.json
cat /tmp/resp_a2bfa3.json | jq .
```

### 2. Get Dataset Info

```bash
curl -s "https://api.axiom.co/v2/datasets/my-dataset" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" > /tmp/resp_7cf381.json
cat /tmp/resp_7cf381.json | jq .
```

### 3. Create Dataset

```bash
curl -s -X POST "https://api.axiom.co/v2/datasets" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/json" -d '{"name": "my-logs", "description": "Application logs"}' > /tmp/resp_8a9679.json
cat /tmp/resp_8a9679.json | jq .
```

### 4. Ingest Data (JSON)

```bash
curl -s -X POST "https://us-east-1.aws.edge.axiom.co/v1/ingest/my-dataset" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/json" -d '[{"message": "User logged in", "user_id": "123", "level": "info"}]' > /tmp/resp_6c58d1.json
cat /tmp/resp_6c58d1.json | jq .
```

### 5. Ingest Data (NDJSON)

```bash
curl -s -X POST "https://us-east-1.aws.edge.axiom.co/v1/ingest/my-dataset" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/x-ndjson" -d $'{"message": "Event 1", "level": "info"}\n{"message": "Event 2", "level": "warn"}' > /tmp/resp_11cab1.json
cat /tmp/resp_11cab1.json | jq .
```

### 6. Query Data with APL

```bash
curl -s -X POST "https://api.axiom.co/v1/datasets/_apl?format=tabular" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/json" -d '{"apl": "[\"my-dataset\"] | where level == \"error\" | limit 10", "startTime": "2024-01-01T00:00:00Z", "endTime": "2025-12-31T23:59:59Z"}' > /tmp/resp_f8c381.json
cat /tmp/resp_f8c381.json | jq .
```

### 7. Query with Aggregation

```bash
curl -s -X POST "https://api.axiom.co/v1/datasets/_apl?format=tabular" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/json" -d '{"apl": "[\"my-dataset\"] | summarize count() by level", "startTime": "2024-01-01T00:00:00Z", "endTime": "2025-12-31T23:59:59Z"}' > /tmp/resp_d1886a.json
cat /tmp/resp_d1886a.json | jq .
```

### 8. Create Annotation

```bash
curl -s -X POST "https://api.axiom.co/v2/annotations" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" -H "Content-Type: application/json" -d '{"datasets": ["my-dataset"], "type": "deployment", "title": "v1.2.0 deployed", "time": "2024-12-24T10:00:00Z"}' > /tmp/resp_5738dc.json
cat /tmp/resp_5738dc.json | jq .
```

### 9. List Monitors

```bash
curl -s "https://api.axiom.co/v2/monitors" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" > /tmp/resp_d89535.json
cat /tmp/resp_d89535.json | jq .
```

### 10. Get Current User

```bash
curl -s "https://api.axiom.co/v2/user" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" > /tmp/resp_8e156f.json
cat /tmp/resp_8e156f.json | jq .
```

### 11. Delete Dataset

```bash
curl -s -X DELETE "https://api.axiom.co/v2/datasets/my-dataset" -H "Authorization: Bearer ${AXIOM_API_TOKEN}" > /tmp/resp_c3f9ae.json
cat /tmp/resp_c3f9ae.json | jq .
```

---

## APL Query Examples

APL (Axiom Processing Language) is similar to Kusto Query Language (KQL). Use `["dataset-name"]` syntax for dataset names with special characters.

| Query | Description |
|-------|-------------|
| `["dataset"] \| limit 10` | Get first 10 events |
| `["dataset"] \| where level == "error"` | Filter by field value |
| `["dataset"] \| where message contains "timeout"` | Search in text |
| `["dataset"] \| summarize count() by level` | Count by group |
| `["dataset"] \| summarize avg(duration_ms) by bin(_time, 1h)` | Hourly average |
| `["dataset"] \| sort by _time desc \| limit 100` | Latest 100 events |
| `["dataset"] \| where _time > ago(1h)` | Events in last hour |

---

## Guidelines

1. **Use Edge URLs for Ingest**: Always use the edge endpoint (`us-east-1.aws.edge.axiom.co` or `eu-central-1.aws.edge.axiom.co`) for data ingestion, not `api.axiom.co`
2. **Batch Events**: Send multiple events in a single request for better performance
3. **Include Timestamps**: Events without timestamps will use server receive time
4. **Rate Limits**: Check `X-RateLimit-Remaining` header to avoid hitting limits
5. **APL Time Range**: Always specify `startTime` and `endTime` for queries to improve performance
6. **Data Formats**: JSON array is recommended; NDJSON and CSV are also supported
