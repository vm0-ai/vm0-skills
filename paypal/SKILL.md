---
name: paypal
description: PayPal REST APIs for orders, payments, invoices, payouts, disputes, and transaction reporting. Use when the user mentions PayPal, payment orders, captures, invoices, payouts, or disputes.
---

## Prerequisites

1. Connect PayPal in Zero at Settings > Connectors > PayPal.
2. Requests require `PAYPAL_TOKEN` and use `https://api-m.paypal.com`.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name PAYPAL_TOKEN` or `zero doctor check-connector --url https://api-m.paypal.com/v1/reporting/balances --method GET`.

## Orders

### Get an Order

```bash
curl -sS "https://api-m.paypal.com/v2/checkout/orders/<order-id>" --header "Authorization: Bearer $PAYPAL_TOKEN" --header "Accept: application/json" | jq '{id, status, intent, purchase_units, payer}'
```

### Create an Order

Write to `/tmp/paypal_order.json`:

```json
{
  "intent": "CAPTURE",
  "purchase_units": [
    {
      "reference_id": "order-123",
      "amount": {
        "currency_code": "USD",
        "value": "25.00"
      }
    }
  ]
}
```

```bash
curl -sS -X POST "https://api-m.paypal.com/v2/checkout/orders" --header "Authorization: Bearer $PAYPAL_TOKEN" --header "Content-Type: application/json" --header "PayPal-Request-Id: <unique-idempotency-key>" -d @/tmp/paypal_order.json | jq '{id, status, links}'
```

### Capture an Approved Order

```bash
curl -sS -X POST "https://api-m.paypal.com/v2/checkout/orders/<order-id>/capture" --header "Authorization: Bearer $PAYPAL_TOKEN" --header "Content-Type: application/json" --header "PayPal-Request-Id: <unique-idempotency-key>" | jq '{id, status, purchase_units}'
```

## Reporting

### List Transactions

Timestamps must be RFC 3339 and the date range must not exceed the endpoint limit.

```bash
curl -sS --get "https://api-m.paypal.com/v1/reporting/transactions" --header "Authorization: Bearer $PAYPAL_TOKEN" --data-urlencode "start_date=2026-07-01T00:00:00Z" --data-urlencode "end_date=2026-07-31T23:59:59Z" --data-urlencode "fields=all" --data-urlencode "page_size=100" | jq '{total_items, total_pages, transaction_details: [.transaction_details[] | {transaction_info, payer_info, cart_info}]}'
```

### Get Balances

```bash
curl -sS "https://api-m.paypal.com/v1/reporting/balances" --header "Authorization: Bearer $PAYPAL_TOKEN" --header "Accept: application/json" | jq '{balances, account_id, as_of_time}'
```

## Invoices

### List Invoices

```bash
curl -sS "https://api-m.paypal.com/v2/invoicing/invoices?page=1&page_size=20&total_required=true" --header "Authorization: Bearer $PAYPAL_TOKEN" --header "Accept: application/json" | jq '{total_items, total_pages, items: [.items[] | {id, status, detail, amount}]}'
```

## Guidelines

1. This connector uses live PayPal APIs. Confirm amounts, currency, recipient, and intent before any payment mutation.
2. Use a unique `PayPal-Request-Id` for idempotent create and capture operations.
3. Never capture, refund, or send a payout without explicit user authorization.
4. A 403 can mean the PayPal REST app lacks the product permission required by the endpoint.

## API Reference

- https://developer.paypal.com/api/rest/
- https://developer.paypal.com/api/rest/authentication/
