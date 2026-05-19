---
name: brex
description: Brex API for corporate card, expenses, payments, transactions, accounts, and team data. Use when user mentions "Brex", "corporate card", "expenses", "card transactions", "spend limits", "payments", or Brex finance automation.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BREX_TOKEN` or `zero doctor check-connector --url https://api.brex.com/v2/accounts/card --method GET`.

## Official Docs

- Developer portal: https://developer.brex.com/
- Transactions API: https://developer.brex.com/openapi/transactions_api/
- Transactions examples: https://developer.brex.com/examples/transactions_examples

## Authentication

Connect the Brex connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors). The connector provides:

- `BREX_TOKEN`: Brex API token

All requests use bearer auth:

```bash
Authorization: Bearer $BREX_TOKEN
```

Base URL:

```bash
https://api.brex.com
```

## Transactions

### List Primary Card Transactions

```bash
curl -s "https://api.brex.com/v2/transactions/card/primary?limit=100" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

Use `next_cursor` from the response for pagination:

```bash
curl -s "https://api.brex.com/v2/transactions/card/primary?limit=100&cursor=<next-cursor>" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

### Get Cash Account Transactions

```bash
curl -s "https://api.brex.com/v2/transactions/cash/<cash-account-id>?limit=100" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

## Accounts

### List Card Accounts

```bash
curl -s "https://api.brex.com/v2/accounts/card" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

### List Cash Accounts

```bash
curl -s "https://api.brex.com/v2/accounts/cash" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

### Get Primary Cash Account

```bash
curl -s "https://api.brex.com/v2/accounts/cash/primary" \
  --header "Authorization: Bearer $BREX_TOKEN" | jq .
```

## Common Workflows

### Export Recent Card Spend

```bash
curl -s "https://api.brex.com/v2/transactions/card/primary?limit=100" \
  --header "Authorization: Bearer $BREX_TOKEN" \
  | jq '.items[] | {id, posted_at_date, description, type, amount}'
```

### Summarize Spend by Currency

```bash
curl -s "https://api.brex.com/v2/transactions/card/primary?limit=100" \
  --header "Authorization: Bearer $BREX_TOKEN" \
  | jq '.items | group_by(.amount.currency)[] | {currency: .[0].amount.currency, total_minor_units: map(.amount.amount) | add}'
```

## Guidelines

- Brex tokens are permission-scoped. If an endpoint returns 403, the token likely lacks the required scope.
- Use cursor pagination for bulk exports.
- Treat transaction, account, receipt, and employee data as sensitive financial data.
- Use read endpoints first; only perform payment or team-management writes when the user explicitly asks.
