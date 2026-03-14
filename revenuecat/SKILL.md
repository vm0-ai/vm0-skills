---
name: revenuecat
description: RevenueCat API for in-app purchases. Use when user mentions "RevenueCat",
  "in-app purchase", "subscription", or mobile monetization.
vm0_secrets:
  - REVENUECAT_TOKEN
---

# RevenueCat API

Manage in-app subscriptions, customers, entitlements, offerings, and products in RevenueCat via the REST API.

> Official docs: `https://www.revenuecat.com/docs/api-v2`
>
> API v1 reference: `https://www.revenuecat.com/docs/api-v1`

---

## When to Use

Use this skill when you need to:

- Look up customer subscription status and entitlements
- Manage offerings, products, and entitlements configuration
- Grant or revoke promotional entitlements
- Retrieve purchase and transaction history
- Delete customers for GDPR compliance

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **RevenueCat**. vm0 will automatically inject the required `REVENUECAT_TOKEN` environment variable.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/revenuecat-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $REVENUECAT_TOKEN" "$@"
EOF
chmod +x /tmp/revenuecat-curl
```

**Usage:** All examples below use `/tmp/revenuecat-curl` instead of direct `curl` calls.

## How to Use

All examples below assume you have `REVENUECAT_TOKEN` set.

RevenueCat has two API versions:
- **API v1** (`https://api.revenuecat.com/v1`): Mature, recommended for subscriber lookups
- **API v2** (`https://api.revenuecat.com/v2`): Newer, project-scoped, for managing products/offerings/entitlements

Both use Bearer token authentication.

Replace `PROJECT_ID` with your RevenueCat project ID and `APP_USER_ID` with the customer's app user ID.

---

## Customers (API v1)

### Get Customer Info

Retrieve a customer's subscription status, entitlements, and purchase history. This is the most commonly used endpoint.

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" | jq '.subscriber | {entitlements, subscriptions, non_subscriptions}'
```

### Get Active Entitlements

Extract only the active entitlements for a customer.

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" | jq '.subscriber.entitlements | to_entries[] | select(.value.expires_date == null or (.value.expires_date | fromdateiso8601 > now)) | {name: .key, product: .value.product_identifier, expires: .value.expires_date}'
```

### Create or Update a Customer

Create a new customer or update attributes for an existing one.

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/attributes""'"'{"attributes": {"$email": {"value": "user@example.com"}, "$displayName": {"value": "John Doe"}}}'"'"'' | jq .
```

### Delete a Customer

Permanently delete a customer and their data (for GDPR compliance).

```bash
/tmp/revenuecat-curl -X DELETE "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" | jq .
```

---

## Promotional Entitlements (API v1)

### Grant a Promotional Entitlement

Grant a customer access to an entitlement for a specific duration.

Write to `/tmp/revenuecat_request.json`:

```json
{
  "duration": "monthly",
  "start_time_ms": 1672531200000
}
```

Duration values: `daily`, `three_day`, `weekly`, `monthly`, `two_month`, `three_month`, `six_month`, `yearly`, `lifetime`.

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/entitlements/ENTITLEMENT_ID/promotional" -d @/tmp/revenuecat_request.json | jq .
```

### Revoke Promotional Entitlements

Revoke all promotional entitlements for a customer.

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/entitlements/ENTITLEMENT_ID/revoke_promotionals" | jq .
```

---

## Receipts (API v1)

### Submit a Receipt

Post a receipt from a store (Apple, Google, Stripe, etc.) to RevenueCat.

Write to `/tmp/revenuecat_request.json`:

```json
{
  "app_user_id": "APP_USER_ID",
  "fetch_token": "RECEIPT_TOKEN",
  "product_id": "com.example.premium_monthly"
}
```

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v1/receipts" -d @/tmp/revenuecat_request.json | jq .
```

---

## Offerings (API v2)

### List Offerings

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings" | jq '.items[] | {id, lookup_key, display_name, is_current}'
```

### Get an Offering

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID" | jq .
```

### Create an Offering

Write to `/tmp/revenuecat_request.json`:

```json
{
  "lookup_key": "premium",
  "display_name": "Premium"
}
```

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings" -d @/tmp/revenuecat_request.json | jq .
```

### Delete an Offering

```bash
/tmp/revenuecat-curl -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID" | jq .
```

---

## Products (API v2)

### List Products

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/products" | jq '.items[] | {id, store_identifier, app_id, type}'
```

### Get a Product

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/products/PRODUCT_ID" | jq .
```

### Create a Product

Write to `/tmp/revenuecat_request.json`:

```json
{
  "store_identifier": "com.example.premium_monthly",
  "app_id": "APP_ID",
  "type": "subscription"
}
```

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/products" -d @/tmp/revenuecat_request.json | jq .
```

### Delete a Product

```bash
/tmp/revenuecat-curl -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/products/PRODUCT_ID" | jq .
```

---

## Entitlements (API v2)

### List Entitlements

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements" | jq '.items[] | {id, lookup_key, display_name}'
```

### Get an Entitlement

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID" | jq .
```

### Create an Entitlement

Write to `/tmp/revenuecat_request.json`:

```json
{
  "lookup_key": "premium",
  "display_name": "Premium Access"
}
```

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements" -d @/tmp/revenuecat_request.json | jq .
```

### Attach Products to an Entitlement

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID/actions/attach_products""'"'{"product_ids": ["PRODUCT_ID_1", "PRODUCT_ID_2"]}'"'"'' | jq .
```

### Delete an Entitlement

```bash
/tmp/revenuecat-curl -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID" | jq .
```

---

## Packages (API v2)

### List Packages in an Offering

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages" | jq '.items[] | {id, lookup_key, display_name}'
```

### Create a Package

Write to `/tmp/revenuecat_request.json`:

```json
{
  "lookup_key": "monthly",
  "display_name": "Monthly",
  "position": 1
}
```

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages" -d @/tmp/revenuecat_request.json | jq .
```

### Attach Products to a Package

```bash
/tmp/revenuecat-curl -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages/PACKAGE_ID/actions/attach_products""'"'{"product_ids": ["PRODUCT_ID"]}'"'"'' | jq .
```

---

## Customer Subscriptions (API v2)

### List Customer Subscriptions

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/customers/APP_USER_ID/subscriptions" | jq '.items[] | {id, product_identifier, store, status, expires_date}'
```

### List Customer Active Entitlements

```bash
/tmp/revenuecat-curl "https://api.revenuecat.com/v2/projects/PROJECT_ID/customers/APP_USER_ID/active_entitlements" | jq '.items[] | {entitlement_identifier, expires_date}'
```

---

## Guidelines

1. **Two API versions**: Use v1 for subscriber lookups (more comprehensive), v2 for managing products/offerings/entitlements configuration
2. **Authentication**: Both versions use Bearer token. Always use `--header "Authorization: Bearer $REVENUECAT_TOKEN"`
3. **Secret vs public keys**: Use Secret API keys (prefix `sk_`) for server-side calls. Never expose secret keys in client apps
4. **Project ID**: API v2 endpoints are scoped to a project. Find your project ID in RevenueCat dashboard settings
5. **App User ID**: Customer identifiers can contain special characters. URL-encode them when passing in URL paths
6. **Rate limits**: RevenueCat enforces rate limits. Implement exponential backoff for HTTP 429 responses
7. **Subscriber attributes**: Use reserved attribute keys prefixed with `$` (e.g., `$email`, `$displayName`, `$phoneNumber`) for standard fields
8. **Promotional entitlements**: Duration-based promotionals automatically expire. Use `lifetime` for permanent access
