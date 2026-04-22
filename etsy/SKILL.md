---
name: etsy
description: Etsy Open API v3 for shop and listing management. Use when user mentions "Etsy", "shop listings", "Etsy orders", "product listings", or "Etsy seller".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ETSY_TOKEN` or `zero doctor check-connector --url https://openapi.etsy.com/v3/application/openapi-ping --method GET`

## Authentication

All requests require your API credentials passed in the header:

```
x-api-key: $ETSY_TOKEN
```

`ETSY_TOKEN` must be set to `<keystring>:<shared_secret>` — both values joined with a colon. Get them from the [Etsy Developer Portal](https://www.etsy.com/developers/your-apps) under Your Apps.

> **Note:** Shop receipt and transaction endpoints require OAuth 2.0 and are not accessible with an API key alone.

## Environment Variables

| Variable | Description |
|---|---|
| `ETSY_TOKEN` | Etsy API credentials in `keystring:shared_secret` format |

## Key Endpoints

Base URL: `https://openapi.etsy.com`

### 1. Ping / Health Check

```bash
curl -s "https://openapi.etsy.com/v3/application/openapi-ping" --header "x-api-key: $ETSY_TOKEN"
```

### 2. Get Shop by Shop ID

```bash
curl -s "https://openapi.etsy.com/v3/application/shops/<your-shop-id>" --header "x-api-key: $ETSY_TOKEN"
```

Response includes shop name, URL, listing count, and seller details.

### 3. Find Shops by Name

```bash
curl -s "https://openapi.etsy.com/v3/application/shops?shop_name=<your-shop-name>&limit=10" --header "x-api-key: $ETSY_TOKEN"
```

### 4. List Active Listings for a Shop

```bash
curl -s "https://openapi.etsy.com/v3/application/shops/<your-shop-id>/listings/active?limit=25" --header "x-api-key: $ETSY_TOKEN"
```

Returns listing IDs, titles, prices, quantities, and URLs.

### 5. Get a Single Listing

```bash
curl -s "https://openapi.etsy.com/v3/application/listings/<your-listing-id>" --header "x-api-key: $ETSY_TOKEN"
```

### 6. Search Active Listings (All Shops)

Write to `/tmp/etsy_search.json` is not needed — use query parameters:

```bash
curl -s "https://openapi.etsy.com/v3/application/listings/active?keywords=<your-search-term>&limit=25&sort_on=score" --header "x-api-key: $ETSY_TOKEN"
```

Key parameters:
- `keywords` — search terms
- `limit` — results per page (max 100)
- `offset` — pagination offset
- `sort_on` — `score`, `created`, `price`, `updated`
- `sort_order` — `asc` or `desc`
- `min_price` / `max_price` — price range filter

### 7. Get Listing Images

```bash
curl -s "https://openapi.etsy.com/v3/application/listings/<your-listing-id>/images" --header "x-api-key: $ETSY_TOKEN"
```

### 8. Get Listing Inventory

```bash
curl -s "https://openapi.etsy.com/v3/application/listings/<your-listing-id>/inventory" --header "x-api-key: $ETSY_TOKEN"
```

## Guidelines

1. **Rate Limits**: Etsy enforces rate limits per API key — avoid tight polling loops
2. **Receipts/Orders**: Transaction and receipt endpoints require OAuth 2.0 authorization, not API key auth
3. **Pagination**: Use `limit` (max 100) and `offset` parameters for large result sets
4. **Listing States**: Use `/listings/active` for publicly visible listings; other states (draft, expired) require OAuth

## API Reference

- Documentation: https://developers.etsy.com/documentation/
- API Reference: https://developers.etsy.com/documentation/reference/
- Developer Portal: https://www.etsy.com/developers/your-apps
