---
name: aviationstack
description: AviationStack API for real-time flight status, schedules, airline, airport, route, and historical aviation data. Use when user mentions "AviationStack", "flight status", "flight tracking", or asks to look up a flight number, route, or airport.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name AVIATIONSTACK_TOKEN` or `zero doctor check-connector --url https://api.aviationstack.com/v1/flights --method GET`.

## How to Use

AviationStack authenticates with an access key passed as the
`access_key` query parameter on every request. The base URL is
`https://api.aviationstack.com`.

### 1. Real-time flights by flight number

```bash
curl -s -G "https://api.aviationstack.com/v1/flights" \
  --data-urlencode "flight_iata=UA889" \
  --data-urlencode "access_key=$AVIATIONSTACK_TOKEN"
```

### 2. All flights departing from an airport

```bash
curl -s -G "https://api.aviationstack.com/v1/flights" \
  --data-urlencode "dep_iata=PEK" \
  --data-urlencode "limit=25" \
  --data-urlencode "access_key=$AVIATIONSTACK_TOKEN"
```

### 3. Historical flight (date in YYYY-MM-DD)

```bash
curl -s -G "https://api.aviationstack.com/v1/flights" \
  --data-urlencode "flight_iata=UA889" \
  --data-urlencode "flight_date=2026-05-11" \
  --data-urlencode "access_key=$AVIATIONSTACK_TOKEN"
```

### 4. Airline lookup

```bash
curl -s -G "https://api.aviationstack.com/v1/airlines" \
  --data-urlencode "iata_code=UA" \
  --data-urlencode "access_key=$AVIATIONSTACK_TOKEN"
```

### 5. Airport lookup

```bash
curl -s -G "https://api.aviationstack.com/v1/airports" \
  --data-urlencode "iata_code=SFO" \
  --data-urlencode "access_key=$AVIATIONSTACK_TOKEN"
```

## Guidelines

1. **Free tier is HTTP-only** — paid plans unlock `https://`. The connector and firewall are configured for HTTPS.
2. **`flight_date` accuracy** — required for historical lookups; recent flights default to today UTC.
3. **Filter early** — narrow with `dep_iata`/`arr_iata`/`airline_iata` to avoid burning quota on large result sets.
4. **Status field** — `flight_status` can be `scheduled`, `active`, `landed`, `cancelled`, `incident`, or `diverted`.
