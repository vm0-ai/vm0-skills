---
name: stripe
description: Stripe API for payments. Use when user mentions "Stripe", "payment",
  "subscription", "billing", "invoice", or asks about payment processing.
vm0_secrets:
  - STRIPE_TOKEN
---

# Stripe API

Manage payments, customers, subscriptions, and billing with the Stripe API.

> Official docs: `https://docs.stripe.com/api`

## When to Use

- Manage customers (create, update, list, delete)
- Create products and prices for billing
- Manage subscriptions and invoices
- Create and track payment intents
- View account balance and transactions
- List charges and events

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Stripe**. vm0 will automatically inject the required `STRIPE_TOKEN` environment variable.

## Important: Stripe Uses Form-Encoded Bodies

Stripe API accepts `application/x-www-form-urlencoded` for POST requests, **not JSON**. Write request bodies to a `.txt` file using `key=value&key=value` format. Nested params use bracket syntax: `items[0][price]=price_xxx`.

## Core APIs

### Get Account Info

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/account"' | jq '{id, business_profile, charges_enabled, payouts_enabled}'
```

Docs: https://docs.stripe.com/api/accounts/retrieve

---

### List Customers

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/customers?limit=10"' | jq '.data[] | {id, name, email}'
```

Docs: https://docs.stripe.com/api/customers/list

### Get Customer

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/customers/<customer-id>"' | jq '{id, name, email, created}'
```

### Create Customer

Write to `/tmp/stripe_request.txt`:

```
name=John Doe&email=john@example.com
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/customers" -d @/tmp/stripe_request.txt' | jq '{id, name, email}'
```

Docs: https://docs.stripe.com/api/customers/create

### Update Customer

Write to `/tmp/stripe_request.txt`:

```
name=Jane Doe
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/customers/<customer-id>" -d @/tmp/stripe_request.txt' | jq '{id, name, email}'
```

### Delete Customer

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X DELETE "https://api.stripe.com/v1/customers/<customer-id>"' | jq '{id, deleted}'
```

Docs: https://docs.stripe.com/api/customers/delete

---

### List Products

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/products?limit=10"' | jq '.data[] | {id, name, active}'
```

Docs: https://docs.stripe.com/api/products/list

### Get Product

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/products/<product-id>"' | jq '{id, name, description, active}'
```

### Create Product

Write to `/tmp/stripe_request.txt`:

```
name=Premium Plan&description=Full access to all features
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/products" -d @/tmp/stripe_request.txt' | jq '{id, name, description}'
```

Docs: https://docs.stripe.com/api/products/create

---

### List Prices

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/prices?limit=10"' | jq '.data[] | {id, product, unit_amount, currency, recurring}'
```

Docs: https://docs.stripe.com/api/prices/list

### Create Price

Write to `/tmp/stripe_request.txt`:

```
unit_amount=2000&currency=usd&recurring[interval]=month&product=<product-id>
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/prices" -d @/tmp/stripe_request.txt' | jq '{id, unit_amount, currency, recurring}'
```

Docs: https://docs.stripe.com/api/prices/create

---

### List Subscriptions

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/subscriptions?limit=10"' | jq '.data[] | {id, customer, status, items: .items.data[0].price.id}'
```

Docs: https://docs.stripe.com/api/subscriptions/list

### Get Subscription

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/subscriptions/<subscription-id>"' | jq '{id, customer, status, current_period_start, current_period_end}'
```

### Create Subscription

Write to `/tmp/stripe_request.txt`:

```
customer=<customer-id>&items[0][price]=<price-id>
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/subscriptions" -d @/tmp/stripe_request.txt' | jq '{id, customer, status}'
```

Docs: https://docs.stripe.com/api/subscriptions/create

### Cancel Subscription

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X DELETE "https://api.stripe.com/v1/subscriptions/<subscription-id>"' | jq '{id, status}'
```

Docs: https://docs.stripe.com/api/subscriptions/cancel

---

### List Invoices

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/invoices?limit=10"' | jq '.data[] | {id, customer, status, amount_due, currency}'
```

Docs: https://docs.stripe.com/api/invoices/list

### Get Invoice

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/invoices/<invoice-id>"' | jq '{id, customer, status, amount_due, amount_paid}'
```

---

### List Payment Intents

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/payment_intents?limit=10"' | jq '.data[] | {id, amount, currency, status}'
```

Docs: https://docs.stripe.com/api/payment_intents/list

### Create Payment Intent

Write to `/tmp/stripe_request.txt`:

```
amount=2000&currency=usd&payment_method_types[]=card
```

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/payment_intents" -d @/tmp/stripe_request.txt' | jq '{id, amount, currency, status}'
```

Docs: https://docs.stripe.com/api/payment_intents/create

### Get Payment Intent

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/payment_intents/<payment-intent-id>"' | jq '{id, amount, currency, status}'
```

---

### List Charges

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/charges?limit=10"' | jq '.data[] | {id, amount, currency, status, customer}'
```

Docs: https://docs.stripe.com/api/charges/list

### Get Charge

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/charges/<charge-id>"' | jq '{id, amount, currency, status, paid}'
```

---

### Get Balance

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/balance"' | jq '{available, pending}'
```

Docs: https://docs.stripe.com/api/balance/balance_retrieve

### List Balance Transactions

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/balance_transactions?limit=10"' | jq '.data[] | {id, amount, currency, type, status}'
```

Docs: https://docs.stripe.com/api/balance_transactions/list

---

### List Events

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/events?limit=10"' | jq '.data[] | {id, type, created}'
```

Docs: https://docs.stripe.com/api/events/list

### Get Event

```bash
bash -c 'curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/events/<event-id>"' | jq '{id, type, data: .data.object.id}'
```

Docs: https://docs.stripe.com/api/events/retrieve

## Guidelines

1. Stripe authenticates via HTTP Basic Auth: `-u "$STRIPE_TOKEN:"` (colon after key, no password)
2. POST bodies use form-encoded format (`key=value&key=value`), not JSON
3. Nested params use bracket syntax: `items[0][price]=price_xxx`
4. Write request bodies to `/tmp/stripe_request.txt` before sending
5. Use `<placeholder>` for dynamic IDs that the user must replace
6. Empty list responses (`{"data": [], "has_more": false}`) are normal for test-mode accounts
7. All monetary amounts are in the smallest currency unit (e.g., cents for USD)
