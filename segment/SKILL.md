---
name: segment
description: Segment Public API for customer data platform configuration, including sources, destinations, warehouses, tracking plans, delivery metrics, and workspace administration. Use when user mentions "Segment", "Twilio Segment", "CDP", "sources", "destinations", "tracking plans", or data pipeline configuration.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SEGMENT_TOKEN` or `zero doctor check-connector --url "https://api.segmentapis.com/echo?message=ok" --method GET`.

## Official Docs

- Public API docs: https://docs.segmentapis.com/
- Sources: https://docs.segmentapis.com/tag/Sources/
- Destinations: https://docs.segmentapis.com/tag/Destinations/
- Tracking Plans: https://docs.segmentapis.com/tag/Tracking-Plans/

## Authentication

Connect the Segment connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors). The connector provides:

- `SEGMENT_TOKEN`: Segment Public API token

All requests use bearer auth:

```bash
Authorization: Bearer $SEGMENT_TOKEN
```

Base URL:

```bash
https://api.segmentapis.com
```

## Connectivity Test

Use the echo endpoint to confirm token and firewall wiring:

```bash
curl -s "https://api.segmentapis.com/echo?message=ok" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

## Sources

### List Sources

```bash
curl -s "https://api.segmentapis.com/sources" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### Get a Source

```bash
curl -s "https://api.segmentapis.com/sources/<source-id>" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### List Connected Destinations for a Source

```bash
curl -s "https://api.segmentapis.com/sources/<source-id>/connected-destinations" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

## Destinations

### List Destinations

```bash
curl -s "https://api.segmentapis.com/destinations" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### Get a Destination

```bash
curl -s "https://api.segmentapis.com/destinations/<destination-id>" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### List Destination Delivery Metrics

```bash
curl -s "https://api.segmentapis.com/destinations/<destination-id>/delivery-metrics" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

## Tracking Plans

### List Tracking Plans

```bash
curl -s "https://api.segmentapis.com/tracking-plans" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### Get a Tracking Plan

```bash
curl -s "https://api.segmentapis.com/tracking-plans/<tracking-plan-id>" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

### List Tracking Plan Rules

```bash
curl -s "https://api.segmentapis.com/tracking-plans/<tracking-plan-id>/rules" \
  --header "Authorization: Bearer $SEGMENT_TOKEN" | jq .
```

## Guidelines

- This connector uses Segment Public API tokens for workspace configuration. It does not provide HTTP Tracking API write keys.
- Public API access is permission-scoped. A 403 usually means the token lacks permission for that resource.
- Use read endpoints first to discover source, destination, and tracking plan IDs before making updates.
- Treat source write keys, destination settings, warehouse settings, and delivery metrics as sensitive data.
