---
name: netdata
description: Netdata Cloud API for observability metrics, spaces, rooms, nodes, contexts, alerts, and infrastructure monitoring data. Use when user mentions "Netdata", "netdata.cloud", "Netdata Cloud", or asks to query Netdata monitoring data.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NETDATA_TOKEN` or `zero doctor check-connector --url https://app.netdata.cloud/api/v2/spaces --method GET`.

## Authentication

Netdata Cloud uses API tokens, not third-party OAuth. Use the token from `NETDATA_TOKEN` as a Bearer token:

```bash
curl -s "https://app.netdata.cloud/api/v2/spaces" \
  --header "Authorization: Bearer $NETDATA_TOKEN"
```

Do not print or echo `NETDATA_TOKEN`. Netdata Cloud API tokens do not expire automatically, so treat them as long-lived secrets.

Base URL: `https://app.netdata.cloud`

## Workflow

1. Start by listing spaces unless the user already supplied a space ID.
2. Identify the room, node, and context needed for the task.
3. Use v2 endpoints for simple discovery and quick metric reads.
4. Use the room-scoped v3 POST endpoint for Netdata Cloud metric queries that need explicit scope, filtering, grouping, or aggregation.
5. Report the time window, context names, and any node or room filters used.

## Discovery

### List Spaces

```bash
curl -s "https://app.netdata.cloud/api/v2/spaces" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN"
```

### List Nodes

```bash
curl -s "https://app.netdata.cloud/api/v2/nodes" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN"
```

### List Contexts

Use contexts to discover metric names such as `system.cpu`, `system.ram`, or service-specific collectors.

```bash
curl -s "https://app.netdata.cloud/api/v2/contexts" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN"
```

### Full-text Search

```bash
curl -s -G "https://app.netdata.cloud/api/v2/q" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN" \
  --data-urlencode "q=<search-term>"
```

## Metrics

### Quick v2 Metric Query

Use this for a simple recent time-series query. `after=-600` means the last 10 minutes.

```bash
curl -s -G "https://app.netdata.cloud/api/v2/data" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN" \
  --data-urlencode "contexts=system.cpu" \
  --data-urlencode "after=-600"
```

### Room-scoped v3 Metric Query

Use the Cloud v3 endpoint when the user specifies a room, wants aggregation, or needs tighter selectors.

Write to `/tmp/netdata_data.json`:

```json
{
  "scope": {"contexts": ["system.cpu"]},
  "selectors": {
    "nodes": ["*"],
    "contexts": ["*"],
    "instances": ["*"],
    "dimensions": ["*"],
    "labels": ["*"],
    "alerts": ["*"]
  },
  "window": {"after": -600, "before": 0, "points": 5},
  "aggregations": {
    "metrics": [{"group_by": ["selected"], "aggregation": "sum"}],
    "time": {"time_group": "average"}
  },
  "format": "json2",
  "options": ["jsonwrap", "minify", "unaligned"],
  "timeout": 30000
}
```

Then run:

```bash
curl -s -X POST "https://app.netdata.cloud/api/v3/spaces/<space-id>/rooms/<room-id>/data" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN" \
  --data @/tmp/netdata_data.json
```

Common `aggregations.time.time_group` values: `average`, `min`, `max`, `sum`, `median`, `stddev`, `percentile`, `incremental-sum`. For advanced groups other than `average`, `min`, `max`, or `sum`, include `"tier": 0` in `window`.

## Alerts

### Misconfigured Alerts in a Room

```bash
curl -s "https://app.netdata.cloud/api/v2/spaces/<space-id>/rooms/<room-id>/alerts:misconfigured" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer $NETDATA_TOKEN"
```

## Notes

- Netdata Cloud API tokens authenticate `app.netdata.cloud`; direct Local Agent endpoints are separate and may use a different bearer token or no token depending on Agent configuration.
- Legacy local-Agent-only endpoints such as `/api/v1/charts` and `/api/v1/data` return 404 against `app.netdata.cloud`.
- Prefer narrow time windows and explicit contexts to avoid large responses.

## API Reference

- Netdata APIs: https://learn.netdata.cloud/docs/developer-and-contributor-corner/rest-api
- API tokens: https://learn.netdata.cloud/docs/netdata-cloud/authentication-%26-authorization/api-tokens
- Cloud API docs: https://app.netdata.cloud/api/docs/
