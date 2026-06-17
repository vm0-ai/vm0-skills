---
name: google-maps
description: Google Maps Platform API for geocoding, places, routes, and distance matrices. Use when user mentions "Google Maps", "geocode", "directions", "places API", route matrix, or asks to look up an address, route, or place metadata.
---

# Google Maps

Use Google Maps Platform APIs with the Google Maps OAuth connector.

## Troubleshooting

If requests fail, run:

```bash
zero doctor check-connector --env-name GOOGLE_MAPS_TOKEN
zero doctor check-connector --url https://geocode.googleapis.com/v4/geocode/address/Beijing --method GET
zero doctor check-connector --url https://places.googleapis.com/v1/places:searchText --method POST
zero doctor check-connector --url https://routes.googleapis.com/directions/v2:computeRoutes --method POST
```

## Prerequisites

- Connect Google Maps under vm0.ai -> Settings -> Connectors (OAuth).
- The connected Google account must have access to a Google Cloud project with the relevant Maps Platform APIs enabled.
- The OAuth access token is injected as `$GOOGLE_MAPS_TOKEN`.
- Send the token with `Authorization: Bearer $GOOGLE_MAPS_TOKEN`.
- Do not pass `$GOOGLE_MAPS_TOKEN` as a `key=` query parameter; the sandbox value is a placeholder, not an API key.

Base URLs:

- Geocoding v4: `https://geocode.googleapis.com`
- Places API (New): `https://places.googleapis.com`
- Routes API: `https://routes.googleapis.com`

## 1. Forward Geocode an Address

```bash
curl -s "https://geocode.googleapis.com/v4/geocode/address/Beijing%20Zhongguancun" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "X-Goog-FieldMask: results.formattedAddress,results.location" \
  | jq '.results[] | {formattedAddress, location}'
```

## 2. Reverse Geocode Coordinates

```bash
curl -s "https://geocode.googleapis.com/v4/geocode/location/39.9799664,116.3160877" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "X-Goog-FieldMask: results.formattedAddress,results.location" \
  | jq '.results[] | {formattedAddress, location}'
```

## 3. Search Places by Text

Use an `X-Goog-FieldMask` that includes only the fields needed for the task.

```bash
curl -s -X POST "https://places.googleapis.com/v1/places:searchText" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "Content-Type: application/json" \
  --header "X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri" \
  -d '{"textQuery":"coffee in Palo Alto","maxResultCount":5}' \
  | jq '.places[] | {id, name: .displayName.text, formattedAddress, location, googleMapsUri}'
```

## 4. Get Place Details

```bash
curl -s "https://places.googleapis.com/v1/places/ChIJl_iF0xO7j4AR-hSIJRPYIvA" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "X-Goog-FieldMask: id,displayName,formattedAddress,location,googleMapsUri" \
  | jq '{id, name: .displayName.text, formattedAddress, location, googleMapsUri}'
```

## 5. Compute Driving Directions

```bash
curl -s -X POST "https://routes.googleapis.com/directions/v2:computeRoutes" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "Content-Type: application/json" \
  --header "X-Goog-FieldMask: routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline" \
  -d '{"origin":{"address":"Beijing Zhongguancun"},"destination":{"address":"Tiananmen Square Beijing"},"travelMode":"DRIVE"}' \
  | jq '.routes[] | {duration, distanceMeters, encodedPolyline: .polyline.encodedPolyline}'
```

## 6. Compute a Route Matrix

```bash
curl -s -X POST "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix" \
  --header "Authorization: Bearer $GOOGLE_MAPS_TOKEN" \
  --header "Content-Type: application/json" \
  --header "X-Goog-FieldMask: originIndex,destinationIndex,duration,distanceMeters,status" \
  -d '{"origins":[{"waypoint":{"address":"Beijing Zhongguancun"}}],"destinations":[{"waypoint":{"address":"Tiananmen Square Beijing"}}],"travelMode":"DRIVE"}' \
  | jq '.[] | {originIndex, destinationIndex, duration, distanceMeters, status}'
```

## Guidelines

1. Prefer the newer OAuth-compatible APIs above over legacy `maps.googleapis.com/maps/api/...` endpoints.
2. Always send an explicit `X-Goog-FieldMask` for Geocoding v4, Places API (New), and Routes API responses.
3. URL-encode address path segments for Geocoding v4.
4. Keep request bodies small and ask only for fields needed by the user.
5. Check API-level errors in the JSON response; connector and permission errors usually surface as HTTP 4xx or 5xx responses before the Google API response.
