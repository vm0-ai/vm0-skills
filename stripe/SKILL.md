---
name: stripe
description: Stripe API for payments. Use when user mentions "Stripe", "Link by
  Stripe", "payment", "subscription", "billing", "invoice", Checkout, or asks
  about payment processing.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name STRIPE_TOKEN` or `zero doctor check-connector --url https://api.stripe.com/v1/account --method GET`

## Authentication and Link

Use `STRIPE_TOKEN` for all Stripe API calls. It can be a secret key (`sk_test_*` / `sk_live_*`) or a restricted key (`rk_test_*` / `rk_live_*`). Link by Stripe does not have a separate Link API key; it is a Stripe payment method / customer wallet. Use `STRIPE_TOKEN` to create the seller-side Checkout Session or PaymentIntent, then the customer completes Link in a browser.

## Important: Stripe Uses Form-Encoded Bodies

Stripe API accepts `application/x-www-form-urlencoded` for POST requests, **not JSON**. Write request bodies to a `.txt` file using `key=value&key=value` format. Nested params use bracket syntax: `items[0][price]=price_xxx`.

## Core APIs

### Get Account Info

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/account" | jq '{id, business_profile, charges_enabled, payouts_enabled}'
```

Docs: https://docs.stripe.com/api/accounts/retrieve

### List Customers

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/customers?limit=10" | jq '.data[] | {id, name, email}'
```

Docs: https://docs.stripe.com/api/customers/list

### Get Customer

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/customers/<customer-id>" | jq '{id, name, email, created}'
```

### Create Customer

Write to `/tmp/stripe_request.txt`:

```
name=John Doe&email=john@example.com
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/customers" -d @/tmp/stripe_request.txt | jq '{id, name, email}'
```

Docs: https://docs.stripe.com/api/customers/create

### Update Customer

Write to `/tmp/stripe_request.txt`:

```
name=Jane Doe
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/customers/<customer-id>" -d @/tmp/stripe_request.txt | jq '{id, name, email}'
```

### Delete Customer

```bash
curl -s -u "$STRIPE_TOKEN:" -X DELETE "https://api.stripe.com/v1/customers/<customer-id>" | jq '{id, deleted}'
```

Docs: https://docs.stripe.com/api/customers/delete

### List Products

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/products?limit=10" | jq '.data[] | {id, name, active}'
```

Docs: https://docs.stripe.com/api/products/list

### Get Product

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/products/<product-id>" | jq '{id, name, description, active}'
```

### Create Product

Write to `/tmp/stripe_request.txt`:

```
name=Premium Plan&description=Full access to all features
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/products" -d @/tmp/stripe_request.txt | jq '{id, name, description}'
```

Docs: https://docs.stripe.com/api/products/create

### List Prices

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/prices?limit=10" | jq '.data[] | {id, product, unit_amount, currency, recurring}'
```

Docs: https://docs.stripe.com/api/prices/list

### Create Price

Write to `/tmp/stripe_request.txt`:

```
unit_amount=2000&currency=usd&recurring[interval]=month&product=<product-id>
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/prices" -d @/tmp/stripe_request.txt | jq '{id, unit_amount, currency, recurring}'
```

Docs: https://docs.stripe.com/api/prices/create

### List Subscriptions

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/subscriptions?limit=10" | jq '.data[] | {id, customer, status, items: .items.data[0].price.id}'
```

Docs: https://docs.stripe.com/api/subscriptions/list

### Get Subscription

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/subscriptions/<subscription-id>" | jq '{id, customer, status, current_period_start, current_period_end}'
```

### Create Subscription

Write to `/tmp/stripe_request.txt`:

```
customer=<customer-id>&items[0][price]=<price-id>
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/subscriptions" -d @/tmp/stripe_request.txt | jq '{id, customer, status}'
```

Docs: https://docs.stripe.com/api/subscriptions/create

### Cancel Subscription

```bash
curl -s -u "$STRIPE_TOKEN:" -X DELETE "https://api.stripe.com/v1/subscriptions/<subscription-id>" | jq '{id, status}'
```

Docs: https://docs.stripe.com/api/subscriptions/cancel

### List Invoices

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/invoices?limit=10" | jq '.data[] | {id, customer, status, amount_due, currency}'
```

Docs: https://docs.stripe.com/api/invoices/list

### Get Invoice

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/invoices/<invoice-id>" | jq '{id, customer, status, amount_due, amount_paid}'
```

### List Payment Intents

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/payment_intents?limit=10" | jq '.data[] | {id, amount, currency, status}'
```

Docs: https://docs.stripe.com/api/payment_intents/list

### Create Payment Intent

Write to `/tmp/stripe_request.txt`:

```
amount=2000&currency=usd&payment_method_types[]=card
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/payment_intents" -d @/tmp/stripe_request.txt | jq '{id, amount, currency, status}'
```

Docs: https://docs.stripe.com/api/payment_intents/create

### Get Payment Intent

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/payment_intents/<payment-intent-id>" | jq '{id, amount, currency, status}'
```

### Create Checkout Session

Use Checkout Sessions for hosted checkout pages and Link test purchases. Open the returned `url` in a browser to complete payment.

Write to `/tmp/stripe_request.txt`:

```
line_items[0][price_data][unit_amount]=2000&line_items[0][price_data][currency]=usd&line_items[0][price_data][product_data][name]=Test item&line_items[0][quantity]=1&mode=payment
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/checkout/sessions" \
  -d @/tmp/stripe_request.txt \
  --data-urlencode success_url="https://example.com/success" \
  --data-urlencode cancel_url="https://example.com/cancel" \
  | jq '{id, url, status, payment_status}'
```

Docs: https://docs.stripe.com/api/checkout/sessions/create

### Create Checkout Session with Link

Prefer Stripe dynamic payment methods when possible: enable Link in Stripe payment method settings and omit `payment_method_types`. If manually listing payment methods, include both `card` and `link`.

Write to `/tmp/stripe_request.txt`:

```
line_items[0][price_data][unit_amount]=2000&line_items[0][price_data][currency]=usd&line_items[0][price_data][product_data][name]=Test item&line_items[0][quantity]=1&mode=payment&payment_method_types[0]=card&payment_method_types[1]=link
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/checkout/sessions" \
  -d @/tmp/stripe_request.txt \
  --data-urlencode success_url="https://example.com/success" \
  --data-urlencode cancel_url="https://example.com/cancel" \
  | jq '{id, url, status, payment_status}'
```

Sandbox Link checkout is a browser flow. Create the session with a test-mode `STRIPE_TOKEN`, open the returned `url`, and authenticate the Link account with a six-digit code. Any unlisted six-digit code succeeds; `000001` is invalid, `000002` is expired, and `000003` exceeds attempts. Do not store real user data in sandbox Link accounts.

Docs: https://docs.stripe.com/payments/link/checkout-link

### Get Checkout Session

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/checkout/sessions/<checkout-session-id>" | jq '{id, payment_status, status, payment_intent, customer_details}'
```

Docs: https://docs.stripe.com/api/checkout/sessions/retrieve

### Create Payment Link

Payment Links (`plink_*`) are reusable hosted payment URLs. They are different from Link by Stripe, the customer wallet/payment method.

Write to `/tmp/stripe_request.txt`:

```
line_items[0][price]=<price-id>&line_items[0][quantity]=1
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/payment_links" -d @/tmp/stripe_request.txt | jq '{id, url, active}'
```

Docs: https://docs.stripe.com/api/payment-link/create

### List Payment Links

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/payment_links?limit=10" | jq '.data[] | {id, url, active}'
```

Docs: https://docs.stripe.com/api/payment-link/list

### List Charges

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/charges?limit=10" | jq '.data[] | {id, amount, currency, status, customer}'
```

Docs: https://docs.stripe.com/api/charges/list

### Get Charge

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/charges/<charge-id>" | jq '{id, amount, currency, status, paid}'
```

### Create Refund

Write to `/tmp/stripe_request.txt`:

```
payment_intent=<payment-intent-id>
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/refunds" -d @/tmp/stripe_request.txt | jq '{id, payment_intent, charge, amount, currency, status}'
```

Docs: https://docs.stripe.com/api/refunds/create

### List Refunds

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/refunds?limit=10" | jq '.data[] | {id, payment_intent, charge, amount, status}'
```

Docs: https://docs.stripe.com/api/refunds/list

### Create Setup Intent

Use SetupIntents to save a customer's payment method for future payments. Creating the SetupIntent is server-side; confirming it usually requires a browser/client flow.

Write to `/tmp/stripe_request.txt`:

```
customer=<customer-id>&usage=off_session&automatic_payment_methods[enabled]=true
```

```bash
curl -s -u "$STRIPE_TOKEN:" -X POST "https://api.stripe.com/v1/setup_intents" -d @/tmp/stripe_request.txt | jq '{id, customer, status, client_secret}'
```

Docs: https://docs.stripe.com/api/setup_intents/create

### List Customer Payment Methods

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/customers/<customer-id>/payment_methods?type=card" | jq '.data[] | {id, type, card: .card.last4}'
```

Docs: https://docs.stripe.com/api/payment_methods/customer_list

### Get Balance

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/balance" | jq '{available, pending}'
```

Docs: https://docs.stripe.com/api/balance/balance_retrieve

### List Balance Transactions

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/balance_transactions?limit=10" | jq '.data[] | {id, amount, currency, type, status}'
```

Docs: https://docs.stripe.com/api/balance_transactions/list

### List Events

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/events?limit=10" | jq '.data[] | {id, type, created}'
```

Docs: https://docs.stripe.com/api/events/list

### Get Event

```bash
curl -s -u "$STRIPE_TOKEN:" "https://api.stripe.com/v1/events/<event-id>" | jq '{id, type, data: .data.object.id}'
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
8. Link checkout still uses `STRIPE_TOKEN`; there is no separate Link API key
9. Payment Links (`plink_*`) are reusable hosted payment URLs; do not confuse them with Link by Stripe
