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

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

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
bash -c 'curl -s "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.subscriber | {entitlements, subscriptions, non_subscriptions}'
```

### Get Active Entitlements

Extract only the active entitlements for a customer.

```bash
bash -c 'curl -s "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.subscriber.entitlements | to_entries[] | select(.value.expires_date == null or (.value.expires_date | fromdateiso8601 > now)) | {name: .key, product: .value.product_identifier, expires: .value.expires_date}'
```

### Create or Update a Customer

Create a new customer or update attributes for an existing one.

```bash
bash -c 'curl -s -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/attributes" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d '"'"'{"attributes": {"$email": {"value": "user@example.com"}, "$displayName": {"value": "John Doe"}}}'"'"'' | jq .
```

### Delete a Customer

Permanently delete a customer and their data (for GDPR compliance).

```bash
bash -c 'curl -s -X DELETE "https://api.revenuecat.com/v1/subscribers/APP_USER_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/entitlements/ENTITLEMENT_ID/promotional" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

### Revoke Promotional Entitlements

Revoke all promotional entitlements for a customer.

```bash
bash -c 'curl -s -X POST "https://api.revenuecat.com/v1/subscribers/APP_USER_ID/entitlements/ENTITLEMENT_ID/revoke_promotionals" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v1/receipts" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

---

## Offerings (API v2)

### List Offerings

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {id, lookup_key, display_name, is_current}'
```

### Get an Offering

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

### Delete an Offering

```bash
bash -c 'curl -s -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
```

---

## Products (API v2)

### List Products

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/products" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {id, store_identifier, app_id, type}'
```

### Get a Product

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/products/PRODUCT_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/products" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

### Delete a Product

```bash
bash -c 'curl -s -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/products/PRODUCT_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
```

---

## Entitlements (API v2)

### List Entitlements

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {id, lookup_key, display_name}'
```

### Get an Entitlement

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

### Attach Products to an Entitlement

```bash
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID/actions/attach_products" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d '"'"'{"product_ids": ["PRODUCT_ID_1", "PRODUCT_ID_2"]}'"'"'' | jq .
```

### Delete an Entitlement

```bash
bash -c 'curl -s -X DELETE "https://api.revenuecat.com/v2/projects/PROJECT_ID/entitlements/ENTITLEMENT_ID" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq .
```

---

## Packages (API v2)

### List Packages in an Offering

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {id, lookup_key, display_name}'
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
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d @/tmp/revenuecat_request.json' | jq .
```

### Attach Products to a Package

```bash
bash -c 'curl -s -X POST "https://api.revenuecat.com/v2/projects/PROJECT_ID/offerings/OFFERING_ID/packages/PACKAGE_ID/actions/attach_products" --header "Content-Type: application/json" --header "Authorization: Bearer $REVENUECAT_TOKEN" -d '"'"'{"product_ids": ["PRODUCT_ID"]}'"'"'' | jq .
```

---

## Customer Subscriptions (API v2)

### List Customer Subscriptions

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/customers/APP_USER_ID/subscriptions" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {id, product_identifier, store, status, expires_date}'
```

### List Customer Active Entitlements

```bash
bash -c 'curl -s "https://api.revenuecat.com/v2/projects/PROJECT_ID/customers/APP_USER_ID/active_entitlements" --header "Authorization: Bearer $REVENUECAT_TOKEN"' | jq '.items[] | {entitlement_identifier, expires_date}'
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
