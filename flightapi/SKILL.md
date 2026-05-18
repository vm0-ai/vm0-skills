---
name: flightapi
description: FlightAPI for flight schedules, airport status, fares, and trip planning data. Use when user mentions "FlightAPI", "flight search", "airline fares", "round trip", or wants to compare flight prices and timings.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name FLIGHTAPI_TOKEN` or `zero doctor check-connector --url https://api.flightapi.io/airport/$FLIGHTAPI_TOKEN/PEK --method GET`.

## How to Use

FlightAPI embeds the API key as a **path segment**:

```
https://api.flightapi.io/<endpoint>/$FLIGHTAPI_TOKEN/<params>
```

The base URL is `https://api.flightapi.io`. Always interpolate
`$FLIGHTAPI_TOKEN` directly into the path.

### 1. Departures from an airport

```bash
curl -s "https://api.flightapi.io/airport/$FLIGHTAPI_TOKEN?iata=PEK&mode=departures&day=1"
```

### 2. Arrivals at an airport

```bash
curl -s "https://api.flightapi.io/airport/$FLIGHTAPI_TOKEN?iata=SFO&mode=arrivals&day=1"
```

### 3. One-way fare search

```bash
curl -s "https://api.flightapi.io/onewaytrip/$FLIGHTAPI_TOKEN/PEK/SFO/2026-06-15/1/0/0/Economy/USD"
```

Path order: `<origin>/<destination>/<date>/<adults>/<children>/<infants>/<cabin>/<currency>`.

### 4. Round-trip fare search

```bash
curl -s "https://api.flightapi.io/roundtrip/$FLIGHTAPI_TOKEN/PEK/SFO/2026-06-15/2026-06-25/1/0/0/Economy/USD"
```

### 5. Flight tracking by flight number

```bash
curl -s "https://api.flightapi.io/airline/$FLIGHTAPI_TOKEN?num=UA889&name=UA&date=2026-06-15"
```

## Guidelines

1. **Token IS in the URL** — unusual but required; the firewall accepts it.
2. **IATA codes** — origin/destination/airline must be 3-letter (airports) or 2-letter (airlines) IATA codes.
3. **`day=1` / `day=2`** — for airport mode, `day` selects today/tomorrow/etc. up to the plan limit.
4. **Currency** — supports USD, EUR, GBP, INR, JPY, etc. Match what your downstream display uses.
5. **Cabin classes** — `Economy`, `Premium-Economy`, `Business`, `First` (case-sensitive).
