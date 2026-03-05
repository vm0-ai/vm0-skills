---
name: xero
description: Xero Accounting API via curl. Use this skill to manage invoices, contacts, bank transactions, payments, accounts, reports, and organisation data.
vm0_secrets:
  - XERO_TOKEN
---

# Xero Accounting API

Manage accounting data including invoices, contacts, bank transactions, payments, accounts, and financial reports via Xero's REST API.

> Official docs: https://developer.xero.com/documentation/api/accounting/overview

---

## When to Use

Use this skill when you need to:

- Manage invoices, quotes, and purchase orders
- Manage contacts and contact groups
- View and create bank transactions and transfers
- Manage payments and batch payments
- View chart of accounts and organisation settings
- View financial reports (P&L, balance sheet, trial balance, etc.)
- View budgets

---

## Prerequisites

Connect Xero via the vm0 connector. The access token is provided as `$XERO_TOKEN`.

> **Important:** Xero API requires a `xero-tenant-id` header for all organisation-scoped requests. You must first call the `/connections` endpoint to get the tenant ID, then use it in subsequent requests.

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY"'
> ```

---

## Step 1: Get Tenant ID (Required First)

Every Xero API call needs a `xero-tenant-id` header. Get it from the connections endpoint:

```bash
bash -c 'curl -s "https://api.xero.com/connections" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "Content-Type: application/json"'
```

Response returns an array of connected orgs. Use the `tenantId` from the first (or desired) entry:

```json
[
  {
    "id": "abc-123",
    "authEventId": "def-456",
    "tenantId": "YOUR-TENANT-ID",
    "tenantType": "ORGANISATION",
    "tenantName": "My Company",
    "createdDateUtc": "2026-03-05T00:00:00.0000000",
    "updatedDateUtc": "2026-03-05T00:00:00.0000000"
  }
]
```

Store the `tenantId` and use it as the `xero-tenant-id` header in all subsequent requests.

---

## Organisation

### Get Organisation Info

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Organisation" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Contacts

### List Contacts

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Contact by ID

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Contact

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Contacts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"New Customer\", \"EmailAddress\": \"customer@example.com\", \"Phones\": [{\"PhoneType\": \"DEFAULT\", \"PhoneNumber\": \"555-1234\"}]}"'
```

### Update Contact

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"ContactID\": \"<contact-id>\", \"Name\": \"Updated Name\", \"EmailAddress\": \"updated@example.com\"}"'
```

---

## Contact Groups

### List Contact Groups

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/ContactGroups" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Contact Group

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/ContactGroups" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"VIP Customers\"}"'
```

### Add Contacts to Group

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/ContactGroups/<group-id>/Contacts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Contacts\": [{\"ContactID\": \"<contact-id>\"}]}"'
```

### Delete Contact Group

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/ContactGroups/<group-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"ContactGroupID\": \"<group-id>\", \"Status\": \"DELETED\"}"'
```

---

## Invoices

### List Invoices

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Invoice by ID

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Sales Invoice (Accounts Receivable)

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCREC\", \"Contact\": {\"Name\": \"Customer Name\"}, \"Date\": \"2026-03-05\", \"DueDate\": \"2026-04-05\", \"LineItems\": [{\"Description\": \"Consulting services\", \"Quantity\": 1, \"UnitAmount\": 500.00, \"AccountCode\": \"200\"}]}"'
```

### Create Bill (Accounts Payable)

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCPAY\", \"Contact\": {\"Name\": \"Supplier Name\"}, \"Date\": \"2026-03-05\", \"DueDate\": \"2026-04-05\", \"LineItems\": [{\"Description\": \"Office supplies\", \"Quantity\": 1, \"UnitAmount\": 150.00, \"AccountCode\": \"400\"}]}"'
```

### Update Invoice Status (Approve)

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"InvoiceID\": \"<invoice-id>\", \"Status\": \"AUTHORISED\"}"'
```

### Void Invoice

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"InvoiceID\": \"<invoice-id>\", \"Status\": \"VOIDED\"}"'
```

---

## Credit Notes

### List Credit Notes

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/CreditNotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Credit Note

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/CreditNotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCRECCREDIT\", \"Contact\": {\"Name\": \"Customer Name\"}, \"Date\": \"2026-03-05\", \"LineItems\": [{\"Description\": \"Refund for damaged goods\", \"Quantity\": 1, \"UnitAmount\": 100.00, \"AccountCode\": \"200\"}]}"'
```

---

## Quotes

### List Quotes

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Quotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Quote

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Quotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Contact\": {\"Name\": \"Customer Name\"}, \"Date\": \"2026-03-05\", \"ExpiryDate\": \"2026-04-05\", \"LineItems\": [{\"Description\": \"Website design\", \"Quantity\": 1, \"UnitAmount\": 2000.00, \"AccountCode\": \"200\"}]}"'
```

---

## Purchase Orders

### List Purchase Orders

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/PurchaseOrders" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Purchase Order

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/PurchaseOrders" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Contact\": {\"Name\": \"Supplier Name\"}, \"Date\": \"2026-03-05\", \"DeliveryDate\": \"2026-03-20\", \"LineItems\": [{\"Description\": \"Raw materials\", \"Quantity\": 100, \"UnitAmount\": 5.00, \"AccountCode\": \"300\"}]}"'
```

---

## Payments

### List Payments

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Payments" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Payment Against Invoice

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Payments" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Invoice\": {\"InvoiceID\": \"<invoice-id>\"}, \"Account\": {\"Code\": \"090\"}, \"Date\": \"2026-03-05\", \"Amount\": 500.00}"'
```

### Delete Payment

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Payments/<payment-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"PaymentID\": \"<payment-id>\", \"Status\": \"DELETED\"}"'
```

---

## Batch Payments

### List Batch Payments

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BatchPayments" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Bank Transactions

### List Bank Transactions

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BankTransactions" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### List with Paging

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BankTransactions?page=1&pageSize=50" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Spend Money Transaction

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/BankTransactions" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"SPEND\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"LineItems\": [{\"Description\": \"Office supplies\", \"UnitAmount\": 50.00, \"AccountCode\": \"404\"}], \"BankAccount\": {\"Code\": \"090\"}}"'
```

### Create Receive Money Transaction

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/BankTransactions" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"RECEIVE\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"LineItems\": [{\"Description\": \"Payment received\", \"UnitAmount\": 200.00, \"AccountCode\": \"200\"}], \"BankAccount\": {\"Code\": \"090\"}}"'
```

### Delete Bank Transaction

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/BankTransactions/<transaction-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"BankTransactionID\": \"<transaction-id>\", \"Status\": \"DELETED\"}"'
```

---

## Bank Transfers

### List Bank Transfers

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BankTransfers" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Bank Transfer

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/BankTransfers" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"BankTransfers\": [{\"FromBankAccount\": {\"Code\": \"090\"}, \"ToBankAccount\": {\"Code\": \"091\"}, \"Amount\": 500.00}]}"'
```

---

## Accounts (Chart of Accounts)

### List All Accounts

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Accounts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Account by ID

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Accounts/<account-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Account

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Accounts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Code\": \"201\", \"Name\": \"Sales - Clearance\", \"Type\": \"SALES\"}"'
```

### Archive Account

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Accounts/<account-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"AccountID\": \"<account-id>\", \"Status\": \"ARCHIVED\"}"'
```

### Delete Account

```bash
bash -c 'curl -s -X DELETE "https://api.xero.com/api.xro/2.0/Accounts/<account-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Manual Journals

### List Manual Journals

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/ManualJournals" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Manual Journal

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/ManualJournals" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Narration\": \"Year-end adjustment\", \"JournalLines\": [{\"LineAmount\": 100.00, \"AccountCode\": \"200\"}, {\"LineAmount\": -100.00, \"AccountCode\": \"400\"}]}"'
```

---

## Items

### List Items

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Items" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Item

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Items" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Code\": \"WIDGET-001\", \"Name\": \"Widget\", \"Description\": \"Standard widget\", \"PurchaseDetails\": {\"UnitPrice\": 5.00, \"AccountCode\": \"300\"}, \"SalesDetails\": {\"UnitPrice\": 12.00, \"AccountCode\": \"200\"}}"'
```

---

## Reports

### Profit and Loss

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-03-31" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Balance Sheet

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/BalanceSheet?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Trial Balance

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/TrialBalance?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Aged Receivables

The `contactId` parameter is required. Get it from the Contacts endpoint first.

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/AgedReceivablesByContact?contactId=<contact-id>&date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Aged Payables

The `contactId` parameter is required. Get it from the Contacts endpoint first.

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/AgedPayablesByContact?contactId=<contact-id>&date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Bank Summary

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/BankSummary?fromDate=2026-01-01&toDate=2026-03-31" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Executive Summary

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/ExecutiveSummary?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Budget Summary

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/BudgetSummary?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Budgets

### List Budgets

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Budgets" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Budget by ID (with date range)

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Budgets/<budget-id>?DateFrom=2026-01-01&DateTo=2026-12-31" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Currencies

### List Currencies

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Currencies" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Tax Rates

### List Tax Rates

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/TaxRates" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Tracking Categories

### List Tracking Categories

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/TrackingCategories" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Branding Themes

### List Branding Themes

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BrandingThemes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Users

### List Users

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Users" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Guidelines

1. **Tenant ID Required**: Always call `/connections` first to get the `tenantId`, then include it as `xero-tenant-id` header in every API call.
2. **Account Codes Vary by Org**: Account codes (e.g. `200`, `400`) differ between organisations. Always call `GET /Accounts` first to discover valid codes. Common patterns: revenue accounts (`4000`-`4999`), expense accounts (`5000`-`6999`), but these are not guaranteed.
3. **Bank Accounts Required**: Payments, bank transactions, and bank transfers require a BANK-type account. If none exists, create one first via `PUT /Accounts` with `Type: BANK`.
4. **Create vs Update**: Xero uses `PUT` to create and `POST` to update for most endpoints.
5. **Invoice Types**: `ACCREC` = sales invoice (accounts receivable), `ACCPAY` = bill (accounts payable).
6. **Credit Note Types**: `ACCRECCREDIT` = customer credit, `ACCPAYCREDIT` = supplier credit.
7. **Bank Transaction Types**: `SPEND` = money out, `RECEIVE` = money in.
8. **Status Workflow**: Draft -> SUBMITTED -> AUTHORISED -> PAID (for invoices). Use POST to update status.
9. **Deleting**: Most entities use `Status: DELETED` or `Status: VOIDED` via POST rather than HTTP DELETE.
10. **Rate Limits**: Xero enforces rate limits. Use `If-Modified-Since` header and pagination for large datasets.
11. **Pagination**: Bank transactions use `page` and `pageSize` parameters. Default 100 per page.
12. **Date Format**: Use `YYYY-MM-DD` for dates.

---

## API Reference

- Documentation: https://developer.xero.com/documentation/api/accounting/overview
- API Explorer: https://api-explorer.xero.com
- OAuth Scopes: https://developer.xero.com/documentation/guides/oauth2/scopes/
