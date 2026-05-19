---
name: faire
description: Faire External API for wholesale brand operations, including products, orders, inventory, shipments, packing slips, and retailer data. Use when user mentions "Faire", "wholesale marketplace", "brand orders", "product inventory", or independent retailer wholesale workflows.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name FAIRE_TOKEN` or `zero doctor check-connector --url "https://www.faire.com/external-api/v2/orders?limit=10" --method GET`.

## Official Docs

- External API V2 docs: https://faire.github.io/external-api-v2-docs/
- Faire support: https://www.faire.com/support/

## Authentication

Connect the Faire connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors). The connector provides:

- `FAIRE_TOKEN`: Faire access token

All requests pass the token in the `X-FAIRE-ACCESS-TOKEN` header:

```bash
X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN
```

Base URL:

```bash
https://www.faire.com/external-api/v2
```

## Orders

### List Orders

```bash
curl -s "https://www.faire.com/external-api/v2/orders?limit=50&page=1" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

Useful filters include `created_at_min`, `updated_at_min`, `ship_after_max`, `excluded_states`, and `original_order_id`.

### Get an Order

```bash
curl -s "https://www.faire.com/external-api/v2/orders/<order-id>" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

## Products

### List Products

```bash
curl -s "https://www.faire.com/external-api/v2/products?limit=50&page=1" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

### Get a Product

```bash
curl -s "https://www.faire.com/external-api/v2/products/<product-id>" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

## Inventory

### Get Inventory by Variant IDs

```bash
curl -s "https://www.faire.com/external-api/v2/product-inventory/by-product-variant-ids?ids=<variant-id>" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

### Get Inventory by SKU

```bash
curl -s "https://www.faire.com/external-api/v2/product-inventory/by-skus?skus=<sku>" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

### Update Inventory by Variant IDs

Write the payload to `/tmp/faire_inventory.json`:

```json
{
  "inventories": [
    {
      "product_variant_id": "<variant-id>",
      "on_hand_quantity": 25
    }
  ]
}
```

Then:

```bash
curl -s -X PATCH "https://www.faire.com/external-api/v2/product-inventory/by-product-variant-ids" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/faire_inventory.json | jq .
```

## Shipments

### List Shipments for an Order

```bash
curl -s "https://www.faire.com/external-api/v2/orders/<order-id>/shipments" \
  --header "X-FAIRE-ACCESS-TOKEN: $FAIRE_TOKEN" | jq .
```

## Guidelines

- Faire API access is usually scoped to a brand account. Verify the token belongs to the correct brand before writes.
- Use page and limit parameters for bulk sync jobs.
- Inventory writes can affect product sellability. Confirm SKU or variant IDs before updating inventory.
- Treat retailer details, shipping labels, packing slips, and payout data as sensitive business data.
