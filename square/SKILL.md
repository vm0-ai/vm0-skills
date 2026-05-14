---
name: square
description: Square API for payments, orders, customers, catalog, and invoices. Use when user mentions "Square", "Square POS", "point of sale", "process a payment", "Square invoice", "Square catalog", or needs to manage a Square seller account programmatically.
---

# Square

Square's Connect v2 API for managing payments, orders, customers, catalog items, invoices, and inventory in a Square seller account.

> Official docs: `https://developer.squareup.com/reference/square`

---

## When to Use

Use this skill when you need to:

- Take, list, or refund payments
- Create and manage orders, invoices, and customers
- Read or update catalog items, inventory, and locations
- Pull sales and transaction data from a Square seller account

---

## Prerequisites

Connect the **Square** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name SQUARE_TOKEN` or `zero doctor check-connector --url https://connect.squareup.com/v2/locations --method GET`

---

## Authentication

All endpoints require the access token passed as a Bearer token:

```
Authorization: Bearer $SQUARE_TOKEN
```

Always send a `Square-Version` header to pin the API version. Without it, the default version tied to the application is used.

## Environment Variables

| Variable | Description |
|---|---|
| `SQUARE_TOKEN` | Square access token (personal access token, format `EAAA...`) |

## Base URL

`https://connect.squareup.com` — production. All endpoints below are under the `/v2` path.

> Sandbox accounts use `https://connect.squareupsandbox.com` with a separate sandbox token. The vm0 Square connector is wired to production.

Rate limits are applied per account; a `429` response means you should back off and retry.

---

## How to Use

### Locations

A location ID is required by most order, payment, and inventory calls. List locations first to discover IDs.

```bash
curl -s -X GET "https://connect.squareup.com/v2/locations" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Retrieve a single location — replace `<location-id>`:

```bash
curl -s -X GET "https://connect.squareup.com/v2/locations/<location-id>" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

### Payments

List payments:

```bash
curl -s -X GET "https://connect.squareup.com/v2/payments?sort_order=DESC&limit=50" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Filter by date range and location:

```bash
curl -s -X GET "https://connect.squareup.com/v2/payments?location_id=<location-id>&begin_time=2026-05-01T00:00:00Z&end_time=2026-05-14T00:00:00Z" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Retrieve a payment — replace `<payment-id>`:

```bash
curl -s -X GET "https://connect.squareup.com/v2/payments/<payment-id>" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Create a payment. Write to `/tmp/square_payment.json` — `source_id` comes from a payment token (card nonce) generated client-side; `idempotency_key` must be unique per request:

```json
{
  "idempotency_key": "<unique-uuid>",
  "amount_money": {
    "amount": 1000,
    "currency": "USD"
  },
  "source_id": "<payment-source-id>",
  "location_id": "<location-id>"
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/payments" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_payment.json
```

### Refunds

Write to `/tmp/square_refund.json`:

```json
{
  "idempotency_key": "<unique-uuid>",
  "payment_id": "<payment-id>",
  "amount_money": {
    "amount": 1000,
    "currency": "USD"
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/refunds" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_refund.json
```

### Orders

Search orders for a location. Write to `/tmp/square_order_search.json`:

```json
{
  "location_ids": ["<location-id>"],
  "query": {
    "filter": {
      "date_time_filter": {
        "created_at": {
          "start_at": "2026-05-01T00:00:00Z",
          "end_at": "2026-05-14T00:00:00Z"
        }
      },
      "state_filter": {
        "states": ["COMPLETED"]
      }
    },
    "sort": {
      "sort_field": "CREATED_AT",
      "sort_order": "DESC"
    }
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/orders/search" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_order_search.json
```

Create an order. Write to `/tmp/square_order.json`:

```json
{
  "idempotency_key": "<unique-uuid>",
  "order": {
    "location_id": "<location-id>",
    "line_items": [
      {
        "name": "Coffee",
        "quantity": "2",
        "base_price_money": {
          "amount": 350,
          "currency": "USD"
        }
      }
    ]
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/orders" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_order.json
```

Retrieve an order — replace `<order-id>`:

```bash
curl -s -X GET "https://connect.squareup.com/v2/orders/<order-id>" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

### Customers

List customers:

```bash
curl -s -X GET "https://connect.squareup.com/v2/customers?limit=100" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Create a customer. Write to `/tmp/square_customer.json`:

```json
{
  "given_name": "<first-name>",
  "family_name": "<last-name>",
  "email_address": "<email>",
  "phone_number": "<phone>"
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/customers" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_customer.json
```

Search customers by email. Write to `/tmp/square_customer_search.json`:

```json
{
  "query": {
    "filter": {
      "email_address": {
        "exact": "<email>"
      }
    }
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/customers/search" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_customer_search.json
```

### Catalog

List catalog objects (items, categories, taxes, discounts):

```bash
curl -s -X GET "https://connect.squareup.com/v2/catalog/list?types=ITEM,CATEGORY" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

Create or update a catalog item. Write to `/tmp/square_catalog_item.json` — use a temporary client ID prefixed with `#` for new objects:

```json
{
  "idempotency_key": "<unique-uuid>",
  "object": {
    "type": "ITEM",
    "id": "#coffee",
    "item_data": {
      "name": "Coffee",
      "description": "House blend",
      "variations": [
        {
          "type": "ITEM_VARIATION",
          "id": "#coffee-regular",
          "item_variation_data": {
            "name": "Regular",
            "pricing_type": "FIXED_PRICING",
            "price_money": {
              "amount": 350,
              "currency": "USD"
            }
          }
        }
      ]
    }
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/catalog/object" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_catalog_item.json
```

### Invoices

Search invoices for a location. Write to `/tmp/square_invoice_search.json`:

```json
{
  "query": {
    "filter": {
      "location_ids": ["<location-id>"]
    }
  }
}
```

```bash
curl -s -X POST "https://connect.squareup.com/v2/invoices/search" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16" --header "Content-Type: application/json" -d @/tmp/square_invoice_search.json
```

Retrieve an invoice — replace `<invoice-id>`:

```bash
curl -s -X GET "https://connect.squareup.com/v2/invoices/<invoice-id>" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

### Inventory

Retrieve inventory counts for a catalog variation — replace `<catalog-object-id>`:

```bash
curl -s -X GET "https://connect.squareup.com/v2/inventory/<catalog-object-id>" --header "Authorization: Bearer $SQUARE_TOKEN" --header "Square-Version: 2025-04-16"
```

---

## Guidelines

1. **Idempotency keys** — every `POST` that creates a resource (payments, refunds, orders, customers, catalog objects) requires a unique `idempotency_key`. Reusing a key returns the original result instead of creating a duplicate, which is the safe way to retry.
2. **Money is in the smallest currency unit** — `amount` fields are integers in cents (e.g. `1000` = $10.00 USD).
3. **Location IDs are required** — most order, payment, and inventory operations need a `location_id`; call `/v2/locations` first to discover them.
4. **Pin the API version** — always send `Square-Version`; Square ships breaking changes behind dated versions.
5. **Production vs sandbox** — the vm0 connector targets `connect.squareup.com` (production). A production access token will not work against the sandbox host and vice versa.
6. **Pagination** — list endpoints return a `cursor`; pass it back as the `cursor` query parameter to fetch the next page.

## Response Codes

| Status | Description |
|---|---|
| `200` | Success |
| `400` | Bad request / invalid body |
| `401` | Missing or invalid access token |
| `403` | Token lacks the required permission |
| `404` | Resource not found |
| `429` | Rate limit exceeded — back off and retry |

## API Reference

- API reference: https://developer.squareup.com/reference/square
- Payments API: https://developer.squareup.com/reference/square/payments-api
- Orders API: https://developer.squareup.com/reference/square/orders-api
- Customers API: https://developer.squareup.com/reference/square/customers-api
- Catalog API: https://developer.squareup.com/reference/square/catalog-api
- Invoices API: https://developer.squareup.com/reference/square/invoices-api
