---
name: duffel
description: Duffel API for booking flights and hotels (stays). Use when user mentions "Duffel", "book flight", "flight search", "airline API", "hotel booking", "stays API", or travel booking.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DUFFEL_TOKEN` or `zero doctor check-connector --url https://api.duffel.com/air/airlines --method GET`

## Authentication

All requests require an access token passed in the `Authorization` header using the `Bearer` scheme, plus a `Duffel-Version` header to pin the API version.

```
Authorization: Bearer $DUFFEL_TOKEN
Duffel-Version: v2
```

Tokens starting with `duffel_test_` access test mode (sandbox airlines, fake cards); tokens starting with `duffel_live_` access live mode. Test mode cannot be used with live tokens, and vice versa.

Official docs: https://duffel.com/docs/api

## Flights

Booking a flight follows this flow: create an **offer request** → pick an **offer** → create an **order** → optionally **cancel** it.

### 1. Create Offer Request (search flights)

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "passengers": [
      { "type": "adult" }
    ],
    "slices": [
      {
        "origin": "LHR",
        "destination": "JFK",
        "departure_date": "<your-departure-date>"
      }
    ],
    "cabin_class": "economy"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/air/offer_requests" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

The response contains an `offer_request.id` (`orq_...`) and the first page of `offers`. For multi-city or return trips, add more entries to `slices`.

### 2. List Offers for a Request

Fetch more offers (with pagination, sorting, filtering) for the same offer request:

```bash
curl -s "https://api.duffel.com/air/offers?offer_request_id=<your-offer-request-id>&limit=50&sort=total_amount" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

Useful query params:

| Param | Description |
|---|---|
| `offer_request_id` | Required — scope results to one request |
| `limit` | 1–200 (default 50) |
| `sort` | `total_amount` or `total_duration` |
| `max_connections` | `0`, `1`, or `2` |
| `after` / `before` | Pagination cursors |

### 3. Get a Single Offer

```bash
curl -s "https://api.duffel.com/air/offers/<your-offer-id>?return_available_services=true" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

`return_available_services=true` includes ancillaries (bags, seats) you can add when creating the order.

### 4. Create Order (book the flight)

Replace `<your-offer-id>` and passenger fields with real values. Passenger IDs come from the offer response (`offer.passengers[].id`).

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "type": "instant",
    "selected_offers": ["<your-offer-id>"],
    "passengers": [
      {
        "id": "<your-offer-passenger-id>",
        "given_name": "Jane",
        "family_name": "Doe",
        "title": "ms",
        "gender": "f",
        "born_on": "1990-01-15",
        "email": "jane@example.com",
        "phone_number": "+14155551234"
      }
    ],
    "payments": [
      {
        "type": "balance",
        "amount": "<your-offer-total-amount>",
        "currency": "<your-offer-total-currency>"
      }
    ]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/air/orders" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

`payments[].type` is usually `balance` (drawn from your Duffel account balance). The `amount` and `currency` must match the offer's `total_amount` / `total_currency`.

### 5. Get Order

```bash
curl -s "https://api.duffel.com/air/orders/<your-order-id>" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

### 6. List Orders

```bash
curl -s "https://api.duffel.com/air/orders?limit=50" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

### 7. Cancel Order

Cancellation is two steps: create a pending cancellation (to preview the refund), then confirm it.

Create pending cancellation:

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "order_id": "<your-order-id>"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/air/order_cancellations" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

The response includes a `refund_amount` preview and a cancellation id (`ore_...`). Confirm it to actually cancel:

```bash
curl -s -X POST "https://api.duffel.com/air/order_cancellations/<your-cancellation-id>/actions/confirm" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

### 8. Seat Maps (optional)

```bash
curl -s "https://api.duffel.com/air/seat_maps?offer_id=<your-offer-id>" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

## Stays (Hotels)

Booking a stay follows this flow: **search** → **fetch all rates** → **create quote** → **create booking**.

### 1. Search Stays

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "rooms": 1,
    "location": {
      "radius": 5,
      "geographic_coordinates": {
        "latitude": 51.5071,
        "longitude": -0.1416
      }
    },
    "check_in_date": "<your-check-in-date>",
    "check_out_date": "<your-check-out-date>",
    "guests": [
      { "type": "adult" }
    ]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/stays/search" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

Each result has a `search_result_id` (`srr_...`) and `cheapest_rate_total_amount`. To search by a specific property instead of an area, swap `location` for `accommodation.id` (obtained from Accommodation endpoints).

### 2. Fetch All Rates for a Search Result

The search response only contains the cheapest rate. To see all available rooms and rates, call:

```bash
curl -s -X POST "https://api.duffel.com/stays/search_results/<your-search-result-id>/actions/fetch_all_rates" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

Each rate in the response has a `rate.id` (`rat_...`) you will quote.

### 3. Create Quote

A quote locks in the price and availability for a rate.

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "rate_id": "<your-rate-id>"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/stays/quotes" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

The response contains `quote.id` (`quo_...`), valid for a short window (minutes).

### 4. Create Booking

Write to `/tmp/duffel_request.json`:

```json
{
  "data": {
    "quote_id": "<your-quote-id>",
    "guests": [
      {
        "given_name": "Jane",
        "family_name": "Doe",
        "born_on": "1990-01-15"
      }
    ],
    "email": "jane@example.com",
    "phone_number": "+14155551234",
    "accommodation_special_requests": "Late check-in"
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.duffel.com/stays/bookings" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2" --header "Content-Type: application/json" -d @/tmp/duffel_request.json
```

### 5. Get / List / Cancel Booking

```bash
curl -s "https://api.duffel.com/stays/bookings/<your-booking-id>" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

```bash
curl -s "https://api.duffel.com/stays/bookings?limit=50" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

```bash
curl -s -X POST "https://api.duffel.com/stays/bookings/<your-booking-id>/actions/cancel" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

## Supporting Resources

### List Airlines

```bash
curl -s "https://api.duffel.com/air/airlines?limit=200" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

### Lookup Aircraft

```bash
curl -s "https://api.duffel.com/air/aircraft/<your-aircraft-id>" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

### Lookup Airport / Place

```bash
curl -s "https://api.duffel.com/places/suggestions?query=london" --header "Authorization: Bearer $DUFFEL_TOKEN" --header "Duffel-Version: v2"
```

`query` accepts a city name, airport code, or free text; responses include IATA codes to plug into `slices[].origin` / `destination`.

## Response Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `201` | Created (orders, bookings, quotes) |
| `400` | Invalid request body |
| `401` | Missing or invalid `Authorization` header |
| `404` | Resource not found |
| `422` | Validation failed (e.g. passenger missing required field) |
| `429` | Rate limit exceeded |
| `5xx` | Server / airline error |

## Guidelines

1. **Always send `Duffel-Version: v2`** — requests without it are rejected.
2. **Test vs live** — a `duffel_test_` token cannot see orders created with a `duffel_live_` token, and vice versa.
3. **Offers expire** — after a few minutes, an offer can no longer be booked. Re-run the offer request if you hit expiration.
4. **Order `payments.amount` must match the offer's `total_amount` exactly**, including decimal places.
5. **Stays quotes expire within minutes** — create the booking promptly after quoting.
6. **Cancellations are two-step** (create pending, then confirm) so you can show the refund amount before committing.
7. Use the IATA 3-letter airport code in `origin`/`destination` (e.g. `LHR`, `JFK`). Use `/places/suggestions` to look up codes from free-text input.

## API Reference

- Overview: https://duffel.com/docs/api
- Offer Requests: https://duffel.com/docs/api/v2/offer-requests
- Offers: https://duffel.com/docs/api/v2/offers
- Orders: https://duffel.com/docs/api/v2/orders
- Order Cancellations: https://duffel.com/docs/api/order-cancellations
- Stays Search: https://duffel.com/docs/api/v2/search
- Stays Bookings: https://duffel.com/docs/api/v2/bookings/get-booking
- Test mode: https://duffel.com/docs/api/overview/test-mode
