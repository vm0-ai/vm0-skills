---
name: gumroad
description: >
  Gumroad e-commerce platform. Use when the user mentions "Gumroad", wants to
  manage products, retrieve sales data, handle customers, or work with their
  Gumroad store.
---

# Gumroad

Gumroad is a creator-focused e-commerce platform for selling digital and physical products. The API lets you manage products, retrieve sales, handle customers, apply offer codes, and subscribe to sale events.

> Official docs: `https://gumroad.com/api`

---

## When to Use

Use this skill when you need to:

- List, create, update, or delete products in a Gumroad store
- Retrieve sales data, individual purchases, or customer information
- Create and manage offer codes (discounts)
- Manage product variants and custom fields
- Verify a license key for a product
- Mark physical sales as shipped or issue refunds

---

## Prerequisites

Connect the **Gumroad** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name GUMROAD_TOKEN` or `zero doctor check-connector --url https://api.gumroad.com/v2/user --method GET`

---

## How to Use

All examples assume `GUMROAD_TOKEN` is set via the Gumroad connector.

Base URL: `https://api.gumroad.com/v2`
Auth: `Authorization: Bearer $GUMROAD_TOKEN`

### 1. Get Current User Info

```bash
curl -s "https://api.gumroad.com/v2/user" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" | jq '.user | {name, email, sales_cents}'
```

### 2. List All Products

```bash
curl -s "https://api.gumroad.com/v2/products" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" | jq '.products[] | {id, name, price: .price_cents, sales_count}'
```

### 3. Get a Single Product

```bash
PRODUCT_ID="your_product_id"
curl -s "https://api.gumroad.com/v2/products/$PRODUCT_ID" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" | jq '.product'
```

### 4. Create a Product

Write to `/tmp/gumroad_product.json`:

```json
{
  "name": "My Product",
  "price": 999,
  "description": "A great product"
}
```

Then run:

```bash
curl -s -X POST "https://api.gumroad.com/v2/products" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/gumroad_product.json | jq '.product | {id, name, short_url}'
```

### 5. List Sales

```bash
curl -s "https://api.gumroad.com/v2/sales" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" | jq '.sales[] | {id, product_name, price, email: .email, created_at}'
```

Supports pagination via `page_key` returned in the response.

### 6. Verify a License Key

```bash
PRODUCT_PERMALINK="your_product_permalink"
LICENSE_KEY="XXXX-XXXX-XXXX-XXXX"
curl -s -X POST "https://api.gumroad.com/v2/licenses/verify" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" \
  -d "product_permalink=$PRODUCT_PERMALINK&license_key=$LICENSE_KEY" | jq '{success, uses}'
```

### 7. Create an Offer Code

```bash
PRODUCT_ID="your_product_id"
curl -s -X POST "https://api.gumroad.com/v2/products/$PRODUCT_ID/offer_codes" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" \
  -d "name=LAUNCH20&amount_off=20&offer_type=percent" | jq '.offer_code'
```

### 8. Mark a Sale as Shipped

```bash
SALE_ID="your_sale_id"
curl -s -X PUT "https://api.gumroad.com/v2/sales/$SALE_ID/mark_as_shipped" \
  --header "Authorization: Bearer $GUMROAD_TOKEN" \
  -d "tracking_url=https://tracking.example.com/abc123" | jq '.sale | {id, shipped}'
```

---

## Guidelines

1. **Prices are in cents**: `price_cents: 999` means $9.99
2. **Pagination**: `GET /v2/sales` returns up to 10 results per page; use `page_key` from the response to fetch the next page
3. **License verification does not require auth**: The `/v2/licenses/verify` endpoint works with just `product_permalink` and `license_key` — the token is optional but recommended for rate limit headroom
4. **Product permalink vs ID**: Use `id` for API calls; `permalink` is the URL slug shown in the Gumroad dashboard
5. **Offer code types**: `amount_off` (cents) or `percent_off` (1–100); specify via `offer_type=cents` or `offer_type=percent`
