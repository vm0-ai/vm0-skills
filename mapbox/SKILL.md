---
name: mapbox
description: Mapbox API for geocoding, directions, isochrones, matrix, and map matching. Use when user mentions "Mapbox", "isochrone", "map matching", or wants OSM-style location APIs with a developer-friendly key.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MAPBOX_TOKEN` or `zero doctor check-connector --url https://api.mapbox.com/geocoding/v5/mapbox.places/Beijing.json --method GET`.

## How to Use

Mapbox authenticates with an access token passed as the `access_token`
query parameter on every request. The base URL is
`https://api.mapbox.com`.

### 1. Forward geocode

```bash
curl -s -G "https://api.mapbox.com/geocoding/v5/mapbox.places/Beijing.json" \
  --data-urlencode "limit=5" \
  --data-urlencode "access_token=$MAPBOX_TOKEN"
```

### 2. Reverse geocode

```bash
curl -s -G "https://api.mapbox.com/geocoding/v5/mapbox.places/116.4074,39.9042.json" \
  --data-urlencode "access_token=$MAPBOX_TOKEN"
```

### 3. Driving directions

```bash
curl -s -G "https://api.mapbox.com/directions/v5/mapbox/driving/116.4074,39.9042;117.2010,39.0851" \
  --data-urlencode "geometries=geojson" \
  --data-urlencode "overview=full" \
  --data-urlencode "access_token=$MAPBOX_TOKEN"
```

### 4. Isochrone (15-minute walking polygon)

```bash
curl -s -G "https://api.mapbox.com/isochrone/v1/mapbox/walking/116.4074,39.9042" \
  --data-urlencode "contours_minutes=15" \
  --data-urlencode "polygons=true" \
  --data-urlencode "access_token=$MAPBOX_TOKEN"
```

### 5. Matrix (travel time between many points)

```bash
curl -s -G "https://api.mapbox.com/directions-matrix/v1/mapbox/driving/116.4074,39.9042;117.2010,39.0851;121.4737,31.2304" \
  --data-urlencode "access_token=$MAPBOX_TOKEN"
```

## Guidelines

1. **Public vs secret tokens** — `pk.` keys are safe for client use; `sk.` keys must stay server-side. The connector secret is the `pk.` token by default.
2. **Coordinate order is `lon,lat`** — opposite of Google. Double-check before sending.
3. **`geometries=geojson` is the friendliest format** — easier to plot than `polyline`.
4. **Free tier is generous** — 100k geocoding / 100k directions per month before billing kicks in.
