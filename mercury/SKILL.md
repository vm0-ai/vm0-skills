---
name: mercury
description: Mercury API for banking. Use when user mentions "Mercury", "business
  banking", "bank account", or fintech operations.
vm0_secrets:
  - MERCURY_TOKEN
---

# Mercury Banking API

Manage business bank accounts, transactions, transfers, and financial operations via Mercury's REST API.

> Official docs: https://docs.mercury.com/reference/getaccount

---

## When to Use

Use this skill when you need to:

- View account balances and details
- List and search transactions
- Create internal transfers between accounts
- Manage recipients for external transfers
- Download account statements
- Access treasury account information

---

## Prerequisites

1. Sign up for a Mercury business bank account at https://mercury.com
2. Go to Settings > Developers > API Tokens
3. Create a new API token with appropriate permissions

Set environment variable:

```bash
export MERCURY_TOKEN="your-api-token"
```


---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/mercury-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $MERCURY_TOKEN" "$@"
EOF
chmod +x /tmp/mercury-curl
```

**Usage:** All examples below use `/tmp/mercury-curl` instead of direct `curl` calls.

## Accounts

### List All Accounts

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/accounts"
```

### Get Account by ID

Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>"
```

### Get Account Cards

Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/cards"
```

---

## Transactions

### List Account Transactions

Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/transactions"
```

### List Transactions with Filters

Filter by date range, status, or limit. Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/transactions?limit=50&start=2024-01-01&end=2024-12-31"
```

### Get Transaction by ID

Replace `<your-account-id>` and `<your-transaction-id>` with the actual IDs:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/transaction/<your-transaction-id>"
```

---

## Transfers

### Create Internal Transfer

Transfer funds between your Mercury accounts.

Write to `/tmp/mercury_request.json`:

```json
{
  "toAccountId": "target-account-id",
  "amount": 100.00,
  "note": "Internal transfer"
}
```

Then run. Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl -X POST "https://api.mercury.com/api/v1/account/<your-account-id>/internal-transfer" -d @/tmp/mercury_request.json
```

### Send Money Request

Initiate a money transfer request.

Write to `/tmp/mercury_request.json`:

```json
{
  "recipientId": "recipient-id",
  "amount": 100.00,
  "paymentMethod": "ach",
  "idempotencyKey": "unique-key-123"
}
```

Then run. Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl -X POST "https://api.mercury.com/api/v1/account/<your-account-id>/send-money" -d @/tmp/mercury_request.json
```

### Get Send Money Request Status

Replace `<your-request-id>` with the actual request ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/request-send-money/<your-request-id>"
```

---

## Recipients

### List All Recipients

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/recipients"
```

### Get Recipient by ID

Replace `<your-recipient-id>` with the actual recipient ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/recipient/<your-recipient-id>"
```

### Create Recipient

Write to `/tmp/mercury_request.json`:

```json
{
  "name": "Vendor Name",
  "emails": ["vendor@example.com"],
  "paymentMethod": "ach",
  "electronicRoutingInfo": {
    "accountNumber": "123456789",
    "routingNumber": "021000021",
    "bankName": "Example Bank",
    "electronicAccountType": "businessChecking"
  }
}
```

Then run:

```bash
/tmp/mercury-curl -X POST "https://api.mercury.com/api/v1/recipients" -d @/tmp/mercury_request.json
```

---

## Statements

### List Account Statements

Replace `<your-account-id>` with the actual account ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/statements"
```

### Download Statement PDF

Replace `<your-account-id>` and `<your-statement-id>` with the actual IDs:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/account/<your-account-id>/statement/<your-statement-id>/pdf" > statement.pdf
```

---

## Organization

### Get Organization Info

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/organization"
```

---

## Treasury

### List Treasury Accounts

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/treasury"
```

### Get Treasury Account by ID

Replace `<your-treasury-id>` with the actual treasury ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/treasury/<your-treasury-id>"
```

### List Treasury Transactions

Replace `<your-treasury-id>` with the actual treasury ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/treasury/<your-treasury-id>/transactions"
```

---

## Users

### List Users

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/users"
```

---

## Credit

### List Credit Accounts

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/credit"
```

---

## Accounts Receivable

### List Customers

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/accounts-receivable/customers"
```

### Create Customer

Write to `/tmp/mercury_request.json`:

```json
{
  "name": "Customer Name",
  "email": "customer@example.com"
}
```

Then run:

```bash
/tmp/mercury-curl -X POST "https://api.mercury.com/api/v1/accounts-receivable/customers" -d @/tmp/mercury_request.json
```

### List Invoices

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/accounts-receivable/invoices"
```

### Create Invoice

Write to `/tmp/mercury_request.json`:

```json
{
  "customerId": "customer-id",
  "lineItems": [{"description": "Service", "amount": 500.00}],
  "dueDate": "2024-12-31"
}
```

Then run:

```bash
/tmp/mercury-curl -X POST "https://api.mercury.com/api/v1/accounts-receivable/invoices" -d @/tmp/mercury_request.json
```

### Download Invoice PDF

Replace `<your-invoice-id>` with the actual invoice ID:

```bash
/tmp/mercury-curl "https://api.mercury.com/api/v1/accounts-receivable/invoice/<your-invoice-id>/pdf" > invoice.pdf
```

---

## Guidelines

1. **Rate Limits**: Mercury may enforce rate limits; implement appropriate backoff strategies for high-volume operations
2. **Idempotency**: Use `idempotencyKey` for transfer operations to prevent duplicate transactions
3. **Security**: Never expose API tokens in logs or client-side code
4. **Amounts**: All monetary amounts are typically in USD and represented as decimal numbers
5. **Pagination**: For large result sets, use `limit` and `offset` parameters where supported

---

## API Reference

- Documentation: https://docs.mercury.com/reference/getaccount
- Dashboard: https://dashboard.mercury.com
