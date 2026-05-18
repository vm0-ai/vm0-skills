---
name: google-maps
description: Google Maps Platform API for geocoding, places, directions, and distance matrix. Use when user mentions "Google Maps", "geocode", "directions", "places API", or asks to look up an address, route, or place metadata.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GOOGLE_MAPS_TOKEN` or `zero doctor check-connector --url https://maps.googleapis.com/maps/api/geocode/json --method GET`.

## How to Use

Google Maps Platform authenticates with an API key passed as the `key`
query parameter on every request. The base URL is
`https://maps.googleapis.com`.

### 1. Forward geocode an address

```bash
curl -s -G "https://maps.googleapis.com/maps/api/geocode/json" \
  --data-urlencode "address=1600 Amphitheatre Parkway, Mountain View, CA" \
  --data-urlencode "key=$GOOGLE_MAPS_TOKEN"
```

### 2. Reverse geocode coordinates

```bash
curl -s -G "https://maps.googleapis.com/maps/api/geocode/json" \
  --data-urlencode "latlng=37.4220,-122.0841" \
  --data-urlencode "key=$GOOGLE_MAPS_TOKEN"
```

### 3. Directions (driving)

```bash
curl -s -G "https://maps.googleapis.com/maps/api/directions/json" \
  --data-urlencode "origin=Beijing" \
  --data-urlencode "destination=Tianjin" \
  --data-urlencode "mode=driving" \
  --data-urlencode "key=$GOOGLE_MAPS_TOKEN"
```

### 4. Place search (text query)

```bash
curl -s -G "https://maps.googleapis.com/maps/api/place/textsearch/json" \
  --data-urlencode "query=coffee in Palo Alto" \
  --data-urlencode "key=$GOOGLE_MAPS_TOKEN"
```

### 5. Distance Matrix

```bash
curl -s -G "https://maps.googleapis.com/maps/api/distancematrix/json" \
  --data-urlencode "origins=Beijing|Shanghai" \
  --data-urlencode "destinations=Tianjin|Hangzhou" \
  --data-urlencode "key=$GOOGLE_MAPS_TOKEN"
```

## Guidelines

1. **Enable the right API** — Geocoding, Places, Directions, and Distance Matrix are billed separately and must each be enabled in your GCP project.
2. **URL-encode all user input** — addresses, queries, and place names often contain spaces, commas, and unicode; always use `--data-urlencode`.
3. **Respect rate limits** — default per-second QPS is low for new keys; back off on `OVER_QUERY_LIMIT`.
4. **Status is in the body** — Google returns 200 even on errors; check the `status` field (e.g. `OK`, `ZERO_RESULTS`, `REQUEST_DENIED`).
5. **Restrict keys in production** — lock down by referrer / IP / API surface in the GCP console.
