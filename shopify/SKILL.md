---
name: shopify
description: Shopify Admin API for store operations. Use when user mentions "Shopify", "online store", "products", "orders", "inventory", "customers", "fulfillment", or e-commerce store management.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SHOPIFY_TOKEN` or `zero doctor check-connector --url "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/shop.json" --method GET`.

## Authentication

All requests use a long-lived Admin API access token from a [Shopify custom app](https://help.shopify.com/en/manual/apps/app-types/custom-apps). The token is passed via the `X-Shopify-Access-Token` header.

```
X-Shopify-Access-Token: $SHOPIFY_TOKEN
```

## Environment Variables

| Variable | Description |
|---|---|
| `SHOPIFY_TOKEN` | Admin API access token (starts with `shpat_`) |
| `SHOPIFY_SHOP` | Store subdomain only — for `acme.myshopify.com` set this to `acme` |

## Base URL

```
https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01
```

Shopify exposes a stable API version every quarter. `2025-01` is the current stable release — swap it for the version you target. See [API versioning](https://shopify.dev/docs/api/usage/versioning).

## REST Admin API

Docs: https://shopify.dev/docs/api/admin-rest

### Get shop info

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/shop.json" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.shop | {id, name, email, domain, myshopify_domain, plan_name, currency}'
```

### List products

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/products.json?limit=50" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.products[] | {id, title, handle, status, vendor, product_type}'
```

Docs: https://shopify.dev/docs/api/admin-rest/2025-01/resources/product

### Get a product

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/products/<product-id>.json" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.product'
```

### Create a product

Write the payload to `/tmp/shopify_product.json`:

```json
{
  "product": {
    "title": "Burton Custom Freestyle 151",
    "body_html": "<strong>Good snowboard!</strong>",
    "vendor": "Burton",
    "product_type": "Snowboard",
    "status": "draft",
    "tags": "Barnes & Noble, John's Fav"
  }
}
```

Then:

```bash
curl -s -X POST "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/products.json" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" --header "Content-Type: application/json" -d @/tmp/shopify_product.json | jq '.product | {id, title, status}'
```

### List orders

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/orders.json?status=any&limit=50" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.orders[] | {id, name, email, financial_status, fulfillment_status, total_price, created_at}'
```

Docs: https://shopify.dev/docs/api/admin-rest/2025-01/resources/order

### Get an order

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/orders/<order-id>.json" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.order'
```

### List customers

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/customers.json?limit=50" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.customers[] | {id, email, first_name, last_name, orders_count, total_spent}'
```

Docs: https://shopify.dev/docs/api/admin-rest/2025-01/resources/customer

### Search customers

```bash
curl -s -G "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/customers/search.json" --data-urlencode "query=email:jane@example.com" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.customers'
```

### Inventory levels for a location

```bash
curl -s "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/inventory_levels.json?location_ids=<location-id>" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.inventory_levels[] | {inventory_item_id, location_id, available}'
```

Docs: https://shopify.dev/docs/api/admin-rest/2025-01/resources/inventorylevel

## GraphQL Admin API

Shopify recommends GraphQL for new integrations. REST is still supported but GraphQL returns only what you ask for and has a higher cost-based rate limit.

Docs: https://shopify.dev/docs/api/admin-graphql

Endpoint: `POST https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/graphql.json`

Write the query to `/tmp/shopify_query.json`:

```json
{
  "query": "query { products(first: 10) { edges { node { id title status totalInventory } } } }"
}
```

Then:

```bash
curl -s -X POST "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/graphql.json" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" --header "Content-Type: application/json" -d @/tmp/shopify_query.json | jq '.data.products.edges[].node'
```

## Pagination

REST endpoints use cursor-based pagination via the `Link` header. Include `-i` to inspect headers, then follow the `rel="next"` URL verbatim (already contains `page_info`):

```bash
curl -sI "https://$SHOPIFY_SHOP.myshopify.com/admin/api/2025-01/products.json?limit=50" --header "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | grep -i '^link:'
```

Docs: https://shopify.dev/docs/api/usage/pagination-rest

## Rate Limits

REST Admin API is leaky-bucket limited (2 requests/second for standard plans). GraphQL uses a calculated-cost model (1000 points/minute). Check headers `X-Shopify-Shop-Api-Call-Limit` (REST) or the `extensions.cost` block (GraphQL).

Docs: https://shopify.dev/docs/api/usage/limits

## Guidelines

1. `SHOPIFY_SHOP` is the **subdomain only** (e.g. `acme`), not the full `.myshopify.com` URL — the firewall builds the host for you.
2. Always pin the API version in the path (`/admin/api/2025-01/...`). Shopify deprecates versions after ~12 months.
3. Token scopes are fixed at custom app install time; scope errors (403) mean the merchant must re-install the app with additional scopes.
4. Prefer GraphQL for read-heavy workflows (lower cost for selective fields); REST is fine for simple writes.
5. Use `--data-urlencode` with `-G` whenever a search query contains spaces or special characters — Shopify search syntax uses `field:value` pairs.
