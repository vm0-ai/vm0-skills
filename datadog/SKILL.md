---
name: datadog
description: Datadog API for logs, metrics, traces, monitors, dashboards, incidents, events, and service health. Use when the user mentions Datadog, observability, logs, monitors, traces, or incidents.
---

## Prerequisites

1. Connect Datadog in Zero at Settings > Connectors > Datadog.
2. Requests require `DATADOG_TOKEN` and `DATADOG_DOMAIN`.
3. Use `https://api.$DATADOG_DOMAIN`; do not hardcode a Datadog region.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DATADOG_TOKEN` or check a concrete endpoint with `zero doctor check-connector --url https://api.$DATADOG_DOMAIN/api/v1/dashboard --method GET`.

## Monitors and Dashboards

### List Monitors

```bash
curl -sS "https://api.$DATADOG_DOMAIN/api/v1/monitor" --header "Authorization: Bearer $DATADOG_TOKEN" --header "Accept: application/json" | jq '[.[] | {id, name, type, overall_state, tags, modified}]'
```

### Get a Monitor

```bash
curl -sS "https://api.$DATADOG_DOMAIN/api/v1/monitor/<monitor-id>" --header "Authorization: Bearer $DATADOG_TOKEN" --header "Accept: application/json" | jq '{id, name, type, query, message, overall_state, tags, options}'
```

### List Dashboards

```bash
curl -sS "https://api.$DATADOG_DOMAIN/api/v1/dashboard" --header "Authorization: Bearer $DATADOG_TOKEN" --header "Accept: application/json" | jq '[.dashboards[] | {id, title, layout_type, modified_at, author_handle}]'
```

## Logs

### Search Recent Error Logs

Write to `/tmp/datadog_logs_search.json`:

```json
{
  "filter": {
    "query": "status:error",
    "from": "now-1h",
    "to": "now"
  },
  "sort": "-timestamp",
  "page": {
    "limit": 50
  }
}
```

```bash
curl -sS -X POST "https://api.$DATADOG_DOMAIN/api/v2/logs/events/search" --header "Authorization: Bearer $DATADOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/datadog_logs_search.json | jq '[.data[] | {id, timestamp: .attributes.timestamp, service: .attributes.service, status: .attributes.status, message: .attributes.message}]'
```

## Metrics and Events

### Query Metrics

Unix timestamps are required for `from` and `to`.

```bash
curl -sS --get "https://api.$DATADOG_DOMAIN/api/v1/query" --header "Authorization: Bearer $DATADOG_TOKEN" --data-urlencode "from=<unix-start>" --data-urlencode "to=<unix-end>" --data-urlencode "query=avg:system.cpu.user{*}" | jq '[.series[] | {metric, scope, pointlist}]'
```

### Search Events

```bash
curl -sS "https://api.$DATADOG_DOMAIN/api/v2/events?filter[from]=now-1h&filter[to]=now&page[limit]=50" --header "Authorization: Bearer $DATADOG_TOKEN" --header "Accept: application/json" | jq '[.data[] | {id, type, attributes: {title: .attributes.attributes.title, timestamp: .attributes.attributes.timestamp}}]'
```

## Guidelines

1. Preserve `DATADOG_DOMAIN`; OAuth returns the correct region for the connected organization.
2. OAuth scopes vary by endpoint. A 403 often means the integration needs an additional scope or the user lacks the corresponding Datadog permission.
3. Use narrow time ranges for logs and metrics, then paginate with the returned cursor.
4. Ask before muting, editing, or deleting monitors and incidents.

## API Reference

- https://docs.datadoghq.com/api/latest/
- https://docs.datadoghq.com/extend/authorization/oauth2_in_datadog/
