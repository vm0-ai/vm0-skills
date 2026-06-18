---
name: google-maps
description: Google Maps Platform API for supported OAuth-based geocoding, places, routes, and route matrix requests. Use when user mentions "Google Maps", "geocode", "directions", "places API", route matrix, or asks to look up an address, route, or place metadata.
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

The `check-connector --url` command verifies connector and firewall matching. It does not prove the Google API request body, field mask, billing, or project configuration is valid.

## Prerequisites

- Connect Google Maps under vm0.ai -> Settings -> Connectors (OAuth).
- The connected Google account must have access to a Google Cloud project with the relevant Maps Platform APIs enabled.
- The sandbox exposes `$GOOGLE_MAPS_TOKEN` as a placeholder for the connected OAuth access token.
- Send it only with `Authorization: Bearer $GOOGLE_MAPS_TOKEN`; vm0 replaces the header at the network boundary.
- Do not pass `$GOOGLE_MAPS_TOKEN` as a `key=` query parameter. It is not a Maps API key.

OAuth API hosts:

- Geocoding v4: `https://geocode.googleapis.com`
- Places API (New): `https://places.googleapis.com`
- Routes API: `https://routes.googleapis.com`

Recommended endpoints:

- `GET https://geocode.googleapis.com/v4/geocode/address/{address_query}`
- `GET https://geocode.googleapis.com/v4/geocode/location/{location_query}`
- `POST https://places.googleapis.com/v1/places:searchText`
- `GET https://places.googleapis.com/v1/places/{place_id}`
- `POST https://routes.googleapis.com/directions/v2:computeRoutes`
- `POST https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix`

## Billing and Field Masks

- Google Maps Platform requests are billable by Google. Keep requests scoped to what the user asked for.
- Always send an explicit `X-Goog-FieldMask` for Geocoding v4, Places API (New), and Routes API responses.
- Do not use wildcard field masks such as `*` unless the user explicitly needs every field.
- Route Matrix cost and latency scale with route elements: `origins.length * destinations.length`.

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

1. Prefer the newer OAuth-compatible APIs above. Legacy `maps.googleapis.com/maps/api/...` endpoints are not covered by this connector.
2. Keep field masks minimal and avoid wildcard `*` masks.
3. URL-encode address and coordinate path segments when using Geocoding v4 path bindings.
4. Keep request bodies small and ask only for fields needed by the user.
5. Check API-level errors in the JSON response; connector and permission errors usually surface as HTTP 4xx or 5xx responses before the Google API response.
