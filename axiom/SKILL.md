---
name: axiom
description: Axiom observability API for logs and analytics. Use when user mentions
  "logs", "query logs", "Axiom", or asks about event analytics.
---

# Axiom

Axiom is a cloud-native observability platform for storing, querying, and analyzing log and event data at scale. Use the REST API to ingest data, run queries using APL (Axiom Processing Language), and manage datasets, monitors, dashboards, annotations, and notifiers.

> Official docs: https://axiom.co/docs/restapi/introduction

---

## When to Use

Use this skill when you need to:

- Send logs, metrics, or event data to Axiom
- Query and analyze data using APL (Axiom Processing Language)
- Manage datasets, fields, and virtual fields
- Create and manage monitors and notifiers (alerts)
- Manage dashboards and saved queries
- Create annotations (deployment markers, incidents, etc.)
- Manage organization users and RBAC

---

## Prerequisites

Connect Axiom via the vm0 connector. The access token is provided as `$AXIOM_TOKEN`.

### Base URLs

- **API**: `https://api.axiom.co`
- **Ingest (US East)**: `https://us-east-1.aws.edge.axiom.co`
- **Ingest (EU Central)**: `https://eu-central-1.aws.edge.axiom.co`

> **Important:** Always use edge URLs for data ingestion, not `api.axiom.co`.

---

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name AXIOM_TOKEN` or `zero doctor check-connector --url https://api.axiom.co/v2/datasets --method GET`

## Datasets

### List Datasets

```bash
curl -s "https://api.axiom.co/v2/datasets" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Dataset

```bash
curl -s "https://api.axiom.co/v2/datasets/<dataset-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Dataset

```bash
curl -s -X POST "https://api.axiom.co/v2/datasets" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"my-logs\", \"description\": \"Application logs\"}"
```

### Update Dataset

```bash
curl -s -X PUT "https://api.axiom.co/v2/datasets/<dataset-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"description\": \"Updated description\"}"
```

### Delete Dataset

```bash
curl -s -X DELETE "https://api.axiom.co/v2/datasets/<dataset-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Trim Dataset

Remove data older than a specified duration.

```bash
curl -s -X POST "https://api.axiom.co/v2/datasets/<dataset-id>/trim" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"maxDuration\": \"30d\"}"
```

### Get Dataset Fields

```bash
curl -s "https://api.axiom.co/v2/datasets/<dataset-id>/fields" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Field Info

```bash
curl -s "https://api.axiom.co/v2/datasets/<dataset-id>/fields/<field-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Update Field

```bash
curl -s -X PUT "https://api.axiom.co/v2/datasets/<dataset-id>/fields/<field-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"description\": \"Response time in ms\", \"unit\": \"ms\"}"
```

---

## Ingest

### Ingest JSON

```bash
curl -s -X POST "https://us-east-1.aws.edge.axiom.co/v1/datasets/<dataset-name>/ingest" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "[{\"message\": \"User logged in\", \"user_id\": \"123\", \"level\": \"info\"}]"
```

### Ingest NDJSON

```bash
curl -s -X POST "https://us-east-1.aws.edge.axiom.co/v1/datasets/<dataset-name>/ingest" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/x-ndjson" \
  --data-binary @events.ndjson
```

> **Tip:** Batch multiple events in a single request for better performance. Events without `_time` field will use server receive time.

---

## Queries (APL)

APL (Axiom Processing Language) is similar to Kusto Query Language (KQL).

### Run APL Query

```bash
curl -s -X POST "https://api.axiom.co/v1/datasets/_apl?format=tabular" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"apl\": \"['my-logs'] | where level == 'error' | limit 10\", \"startTime\": \"2026-01-01T00:00:00Z\", \"endTime\": \"2026-12-31T23:59:59Z\"}"
```

### Query with Aggregation

```bash
curl -s -X POST "https://api.axiom.co/v1/datasets/_apl?format=tabular" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"apl\": \"['my-logs'] | summarize count() by level\", \"startTime\": \"2026-01-01T00:00:00Z\", \"endTime\": \"2026-12-31T23:59:59Z\"}"
```

### APL Examples

| Query | Description |
|-------|-------------|
| `['dataset'] \| limit 10` | Get first 10 events |
| `['dataset'] \| where level == "error"` | Filter by field value |
| `['dataset'] \| where message contains "timeout"` | Search in text |
| `['dataset'] \| summarize count() by level` | Count by group |
| `['dataset'] \| summarize avg(duration_ms) by bin(_time, 1h)` | Hourly average |
| `['dataset'] \| sort by _time desc \| limit 100` | Latest 100 events |
| `['dataset'] \| where _time > ago(1h)` | Events in last hour |

---

## Monitors

### List Monitors

```bash
curl -s "https://api.axiom.co/v2/monitors" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Monitor

```bash
curl -s "https://api.axiom.co/v2/monitors/<monitor-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Monitor History

```bash
curl -s "https://api.axiom.co/v2/monitors/<monitor-id>/history" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Monitor

```bash
curl -s -X POST "https://api.axiom.co/v2/monitors" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"High Error Rate\", \"aplQuery\": \"['my-logs'] | where level == 'error' | summarize count()\", \"threshold\": 100, \"comparison\": \"Above\", \"frequency\": \"5m\", \"range\": \"5m\", \"notifierIds\": [\"<notifier-id>\"]}"
```

### Update Monitor

```bash
curl -s -X PUT "https://api.axiom.co/v2/monitors/<monitor-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"High Error Rate v2\", \"threshold\": 50}"
```

### Delete Monitor

```bash
curl -s -X DELETE "https://api.axiom.co/v2/monitors/<monitor-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Notifiers

### List Notifiers

```bash
curl -s "https://api.axiom.co/v2/notifiers" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Notifier

```bash
curl -s "https://api.axiom.co/v2/notifiers/<notifier-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Notifier

```bash
curl -s -X POST "https://api.axiom.co/v2/notifiers" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Slack Alerts\", \"type\": \"slack\", \"properties\": {\"slackUrl\": \"https://hooks.slack.com/services/xxx\"}}"
```

Types: `slack`, `email`, `pagerduty`, `webhook`, `opsgenie`, `discord`, `msteams`.

### Update Notifier

```bash
curl -s -X PUT "https://api.axiom.co/v2/notifiers/<notifier-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Slack Alerts v2\"}"
```

### Delete Notifier

```bash
curl -s -X DELETE "https://api.axiom.co/v2/notifiers/<notifier-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Annotations

### List Annotations

```bash
curl -s "https://api.axiom.co/v2/annotations" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Annotation

```bash
curl -s "https://api.axiom.co/v2/annotations/<annotation-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Annotation

```bash
curl -s -X POST "https://api.axiom.co/v2/annotations" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"datasets\": [\"my-logs\"], \"type\": \"deployment\", \"title\": \"v1.2.0 deployed\", \"time\": \"2026-04-08T10:00:00Z\"}"
```

### Update Annotation

```bash
curl -s -X PUT "https://api.axiom.co/v2/annotations/<annotation-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"title\": \"v1.2.0 deployed (hotfix)\"}"
```

### Delete Annotation

```bash
curl -s -X DELETE "https://api.axiom.co/v2/annotations/<annotation-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Dashboards

### List Dashboards

```bash
curl -s "https://api.axiom.co/v2/dashboards" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Dashboard

```bash
curl -s "https://api.axiom.co/v2/dashboards/uid/<dashboard-uid>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Dashboard

```bash
curl -s -X POST "https://api.axiom.co/v2/dashboards" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"API Overview\", \"description\": \"Key API metrics\"}"
```

### Update Dashboard

```bash
curl -s -X PUT "https://api.axiom.co/v2/dashboards/uid/<dashboard-uid>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"API Overview v2\"}"
```

### Delete Dashboard

```bash
curl -s -X DELETE "https://api.axiom.co/v2/dashboards/uid/<dashboard-uid>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Starred Queries

### List Starred Queries

```bash
curl -s "https://api.axiom.co/v2/apl-starred-queries" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Starred Query

```bash
curl -s -X POST "https://api.axiom.co/v2/apl-starred-queries" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Error count by service\", \"query\": \"['my-logs'] | where level == 'error' | summarize count() by service\"}"
```

### Update Starred Query

```bash
curl -s -X PUT "https://api.axiom.co/v2/apl-starred-queries/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Error count by service (updated)\"}"
```

### Delete Starred Query

```bash
curl -s -X DELETE "https://api.axiom.co/v2/apl-starred-queries/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Virtual Fields

### List Virtual Fields

```bash
curl -s "https://api.axiom.co/v2/vfields" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Virtual Field

```bash
curl -s -X POST "https://api.axiom.co/v2/vfields" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"is_slow\", \"dataset\": \"my-logs\", \"expression\": \"duration_ms > 1000\"}"
```

### Update Virtual Field

```bash
curl -s -X PUT "https://api.axiom.co/v2/vfields/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"expression\": \"duration_ms > 2000\"}"
```

### Delete Virtual Field

```bash
curl -s -X DELETE "https://api.axiom.co/v2/vfields/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Views (Saved Views)

### List Views

```bash
curl -s "https://api.axiom.co/v2/views" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create View

```bash
curl -s -X POST "https://api.axiom.co/v2/views" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Error Logs\", \"dataset\": \"my-logs\", \"query\": \"['my-logs'] | where level == 'error'\"}"
```

### Update View

```bash
curl -s -X PUT "https://api.axiom.co/v2/views/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Critical Errors\"}"
```

### Delete View

```bash
curl -s -X DELETE "https://api.axiom.co/v2/views/<id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Organization & Users

### Get Organization

```bash
curl -s "https://api.axiom.co/v2/orgs" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get Current User

```bash
curl -s "https://api.axiom.co/v2/user" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### List Users

```bash
curl -s "https://api.axiom.co/v2/users" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Get User

```bash
curl -s "https://api.axiom.co/v2/users/<user-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## API Tokens

### List Tokens

```bash
curl -s "https://api.axiom.co/v2/tokens" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Create Token

```bash
curl -s -X POST "https://api.axiom.co/v2/tokens" \
  --header "Authorization: Bearer $AXIOM_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"CI Pipeline\", \"description\": \"Token for CI/CD\"}"
```

### Regenerate Token

```bash
curl -s -X POST "https://api.axiom.co/v2/tokens/<token-id>/regenerate" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

### Delete Token

```bash
curl -s -X DELETE "https://api.axiom.co/v2/tokens/<token-id>" \
  --header "Authorization: Bearer $AXIOM_TOKEN"
```

---

## Guidelines

1. **Use Edge URLs for Ingest**: Always use the edge endpoint (`us-east-1.aws.edge.axiom.co` or `eu-central-1.aws.edge.axiom.co`) for data ingestion, not `api.axiom.co`.
2. **Batch Events**: Send multiple events in a single request for better performance.
3. **Include Timestamps**: Events without `_time` field will use server receive time.
4. **Rate Limits**: Check `X-RateLimit-Remaining` header to avoid hitting limits.
5. **APL Time Range**: Always specify `startTime` and `endTime` for queries to improve performance.
6. **Data Formats**: JSON array is recommended for ingest; NDJSON and CSV are also supported.
7. **Dataset Names**: In APL queries, use `['dataset-name']` syntax (square brackets + quotes) for dataset names.
8. **Monitors + Notifiers**: Monitors define alert conditions (APL query + threshold); notifiers define delivery channels (Slack, email, PagerDuty, etc.). Link them via `notifierIds`.

---

## How to Look Up More API Details

- **REST API Intro**: https://axiom.co/docs/restapi/introduction
- **Datasets**: https://axiom.co/docs/restapi/datasets
- **Ingest**: https://axiom.co/docs/restapi/ingest
- **Query (APL)**: https://axiom.co/docs/restapi/query
- **APL Reference**: https://axiom.co/docs/apl/introduction
- **Monitors**: https://axiom.co/docs/restapi/monitors
- **Annotations**: https://axiom.co/docs/restapi/annotations
- **Dashboards**: https://axiom.co/docs/restapi/dashboards
