---
name: ramp
description: Ramp developer API for cards, transactions, receipts, reimbursements, users, and spend controls. Use when the user mentions Ramp, corporate cards, spend management, receipts, or reimbursements.
---

## Prerequisites

1. Connect Ramp in Zero at Settings > Connectors > Ramp.
2. Requests require `RAMP_TOKEN` and use `https://api.ramp.com/developer/v1`.
3. The connected app must include the OAuth scopes required by each endpoint.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RAMP_TOKEN` or `zero doctor check-connector --url https://api.ramp.com/developer/v1/users --method GET`.

## Users and Cards

### List Users

```bash
curl -sS "https://api.ramp.com/developer/v1/users?page_size=50" --header "Authorization: Bearer $RAMP_TOKEN" --header "Accept: application/json" | jq '{page, data: [.data[] | {id, first_name, last_name, email, status, department_id, location_id}]}'
```

### List Cards

```bash
curl -sS "https://api.ramp.com/developer/v1/cards?page_size=50" --header "Authorization: Bearer $RAMP_TOKEN" --header "Accept: application/json" | jq '{page, data: [.data[] | {id, display_name, state, cardholder_id, card_program_id, spending_restrictions}]}'
```

## Transactions and Receipts

### List Transactions

```bash
curl -sS --get "https://api.ramp.com/developer/v1/transactions" --header "Authorization: Bearer $RAMP_TOKEN" --data-urlencode "page_size=50" --data-urlencode "from_date=2026-07-01T00:00:00Z" --data-urlencode "to_date=2026-07-31T23:59:59Z" | jq '{page, data: [.data[] | {id, amount, merchant_name, state, transaction_date, card_id, user_id}]}'
```

### Get a Transaction

```bash
curl -sS "https://api.ramp.com/developer/v1/transactions/<transaction-id>" --header "Authorization: Bearer $RAMP_TOKEN" --header "Accept: application/json" | jq '{id, amount, merchant_name, state, transaction_date, card_id, user_id, receipts, accounting_category}'
```

### List Receipts

```bash
curl -sS "https://api.ramp.com/developer/v1/receipts?page_size=50" --header "Authorization: Bearer $RAMP_TOKEN" --header "Accept: application/json" | jq '{page, data: [.data[] | {id, transaction_id, user_id, receipt_url, created_at}]}'
```

## Reimbursements

### List Reimbursements

```bash
curl -sS "https://api.ramp.com/developer/v1/reimbursements?page_size=50" --header "Authorization: Bearer $RAMP_TOKEN" --header "Accept: application/json" | jq '{page, data: [.data[] | {id, amount, merchant_name, status, user_id, created_at}]}'
```

## Guidelines

1. Ramp uses short-lived access tokens; Zero refreshes the client-credentials token automatically.
2. A 403 usually means the connected app is missing the endpoint's scope.
3. Follow pagination links or cursors from the response instead of assuming all records fit in one page.
4. Ask before changing spend controls, cards, users, or reimbursements.
5. Treat card, receipt, and transaction data as sensitive financial information.

## API Reference

- https://docs.ramp.com/developer-api/v1/
- https://docs.ramp.com/developer-api/v1/authentication/
