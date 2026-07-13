---
name: bill
description: BILL Spend & Expense API for budgets, users, cards, transactions, and reimbursements. Use when the user mentions BILL, Bill.com, Divvy, expense cards, budgets, or reimbursements.
---

## Prerequisites

1. Connect BILL in Zero at Settings > Connectors > BILL.
2. Requests require `BILL_TOKEN` and use the production base URL `https://gateway.prod.bill.com/connect`.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BILL_TOKEN` or `zero doctor check-connector --url https://gateway.prod.bill.com/connect/v3/spend/budgets --method GET`.

## Budgets

### List Budgets

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/budgets" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '[.[] | {uuid, name, limit, recurringLimit, recurringInterval, retired}]'
```

### Get a Budget

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/budgets/<budget-uuid>" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '{uuid, name, limit, recurringLimit, recurringInterval, owners, members, retired}'
```

### Create a Budget

Write to `/tmp/bill_budget.json`:

```json
{
  "name": "Engineering tools",
  "owners": ["<owner-user-uuid>"],
  "recurringInterval": "MONTHLY",
  "recurringLimit": 1000,
  "receiptRequired": true
}
```

```bash
curl -sS -X POST "https://gateway.prod.bill.com/connect/v3/spend/budgets" --header "apiToken: $BILL_TOKEN" --header "Content-Type: application/json" --header "Accept: application/json" -d @/tmp/bill_budget.json | jq '{uuid, name, recurringLimit, recurringInterval}'
```

## Users and Cards

### List Users

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/users" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '[.[] | {uuid, firstName, lastName, email, role, retired}]'
```

### List Vendor Cards

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/cards" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '[.[] | {uuid, cardName, status, lastFour, userUuid, budgetUuid}]'
```

## Transactions and Reimbursements

### List Transactions

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/transactions" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '[.[] | {uuid, transactionType, merchantName, amount, status, transactionTime, userUuid, budgetUuid}]'
```

### List Reimbursements

```bash
curl -sS "https://gateway.prod.bill.com/connect/v3/spend/reimbursements" --header "apiToken: $BILL_TOKEN" --header "Accept: application/json" | jq '[.[] | {uuid, amount, status, merchantName, userUuid, createdTime}]'
```

## Guidelines

1. The `apiToken` header is case-sensitive; do not use Bearer authentication.
2. Ask before creating users, cards, budgets, or reimbursements because these change financial controls.
3. Treat card details and transaction data as sensitive financial information.
4. BILL limits Spend & Expense API traffic to 60 requests per token per minute.

## API Reference

- https://developer.bill.com/docs/spend-expense-api
- https://developer.bill.com/docs/authentication-with-api-token
