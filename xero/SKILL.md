---
name: xero
description: Xero API for accounting. Use when user mentions "Xero", "accounting",
  "invoices", "bookkeeping", or asks about financial management.
vm0_secrets:
  - XERO_TOKEN
---

# Xero Accounting API

Manage accounting data including invoices, contacts, bank transactions, payments, accounts, financial reports, fixed assets, projects, and files via Xero's REST API.

> Official docs: https://developer.xero.com/documentation/api/accounting/overview

---

## When to Use

Use this skill when you need to:

- Manage invoices, quotes, credit notes, and purchase orders
- Manage contacts and contact groups
- View and create bank transactions and transfers
- Manage payments and batch payments
- View chart of accounts and organisation settings
- View financial reports (P&L, balance sheet, trial balance, aged reports, etc.)
- View and manage budgets
- Manage inventory items
- Manage fixed assets and depreciation
- Manage projects, tasks, and time entries
- Upload and organise files

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
    "tenantId": "YOUR-TENANT-ID",
    "tenantType": "ORGANISATION",
    "tenantName": "My Company"
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

Returns: Name, LegalName, BaseCurrency, CountryCode, FinancialYearEndDay/Month, TaxNumber, Timezone, PeriodLockDate, and more. All fields are read-only.

### Get Permitted Actions

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Organisation/Actions" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Returns array of `{Name, Status}` where Status is "ALLOWED" or "NOT-ALLOWED". Useful to check what operations are available.

---

## Contacts

### List Contacts (Paginated)

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts?page=1&pageSize=100" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Search Contacts

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts?searchTerm=john" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

`searchTerm` searches across: Name, FirstName, LastName, ContactNumber, CompanyNumber, EmailAddress.

### Filter Contacts

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress%3D%3D%22email%40example.com%22" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Optimized `where` filters: `Name`, `EmailAddress`, `AccountNumber`. Use `searchTerm` over `Name.Contains()` for performance.

### Get Contact by ID

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Contact

Required: `Name` (max 255 chars). Optional: EmailAddress, FirstName, LastName, CompanyNumber, AccountNumber, Phones, Addresses, ContactPersons (max 5), TaxNumber, DefaultCurrency, Website, PaymentTerms.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Contacts" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"New Customer\", \"FirstName\": \"Jane\", \"LastName\": \"Doe\", \"EmailAddress\": \"jane@example.com\", \"Phones\": [{\"PhoneType\": \"DEFAULT\", \"PhoneNumber\": \"555-1234\"}], \"Addresses\": [{\"AddressType\": \"STREET\", \"AddressLine1\": \"123 Main St\", \"City\": \"Auckland\", \"PostalCode\": \"1010\", \"Country\": \"NZ\"}]}"'
```

### Update Contact

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"Updated Name\", \"EmailAddress\": \"updated@example.com\"}"'
```

### Archive Contact

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"ContactStatus\": \"ARCHIVED\"}"'
```

Contacts cannot be deleted — only archived. Use `includeArchived=true` in list requests to see archived contacts.

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

### List Invoices (Summary)

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Without `page`, returns summary data only (no line items). Add `page=1` for full details.

### List with Pagination and Full Details

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices?page=1&pageSize=50" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Filter Invoices

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices?Statuses=AUTHORISED,PAID&ContactIDs=<contact-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Filter params: `IDs`, `InvoiceNumbers`, `ContactIDs`, `Statuses` (DRAFT/SUBMITTED/AUTHORISED/PAID/VOIDED), `createdByMyApp`, `SearchTerm` (searches InvoiceNumber and Reference).

### Advanced Where Filter

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices?where=Type%3D%3D%22ACCPAY%22%20AND%20Status%3D%3D%22AUTHORISED%22" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Optimized WHERE fields: Status, Contact.ContactID, Contact.Name, Reference, InvoiceNumber, Type, AmountPaid, Date, DueDate, AmountDue.

### Get Invoice by ID

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Invoice by Number

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices/<invoice-number>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Get Online Invoice URL

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/OnlineInvoice" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Only for ACCREC invoices that are not DRAFT.

### Create Sales Invoice (ACCREC)

Required: `Type`, `Contact` (with ContactID or Name), `LineItems` (each needs `Description`).

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCREC\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"DueDate\": \"2026-04-05\", \"LineAmountTypes\": \"Exclusive\", \"LineItems\": [{\"Description\": \"Consulting services\", \"Quantity\": 1, \"UnitAmount\": 500.00, \"AccountCode\": \"200\"}]}"'
```

### Create Bill (ACCPAY)

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCPAY\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"DueDate\": \"2026-04-05\", \"LineItems\": [{\"Description\": \"Office supplies\", \"Quantity\": 10, \"UnitAmount\": 15.00, \"AccountCode\": \"400\"}]}"'
```

ACCPAY (bills) do not support DiscountRate/DiscountAmount.

### Create Invoice with Discount and Tracking

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Invoices" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCREC\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"DueDate\": \"2026-04-05\", \"Reference\": \"PO-123\", \"LineItems\": [{\"Description\": \"Widget A\", \"Quantity\": 100, \"UnitAmount\": 10.00, \"DiscountRate\": 5, \"AccountCode\": \"200\", \"Tracking\": [{\"Name\": \"Region\", \"Option\": \"East\"}]}]}"'
```

### Update Invoice Status (Approve)

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"InvoiceID\": \"<invoice-id>\", \"Status\": \"AUTHORISED\"}"'
```

Status transitions: DRAFT -> SUBMITTED -> AUTHORISED -> PAID (system-assigned when fully paid). AUTHORISED can be VOIDED. DRAFT/SUBMITTED can be DELETED.

### Void Invoice

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"InvoiceID\": \"<invoice-id>\", \"Status\": \"VOIDED\"}"'
```

Only AUTHORISED invoices can be voided. DRAFT/SUBMITTED should use Status: DELETED.

### Email Invoice

Email requires a paying Xero plan. Returns 204 on success. Limits: 1000/day (paying), 20/day (trial), 0/day (demo).

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/Email" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{}"'
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

Type: `ACCRECCREDIT` (customer credit) or `ACCPAYCREDIT` (supplier credit).

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/CreditNotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"ACCRECCREDIT\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"LineItems\": [{\"Description\": \"Refund for damaged goods\", \"Quantity\": 1, \"UnitAmount\": 100.00, \"AccountCode\": \"200\"}]}"'
```

### Allocate Credit Note to Invoice

Credit note must be AUTHORISED first.

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/CreditNotes/<credit-note-id>/Allocations" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Allocations\": [{\"Amount\": 100.00, \"Invoice\": {\"InvoiceID\": \"<invoice-id>\"}}]}"'
```

---

## Quotes

### List Quotes

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Quotes?page=1" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Filter params: `Status` (DRAFT/SENT/ACCEPTED/DECLINED/INVOICED), `ContactID`, `DateFrom`, `DateTo`, `ExpiryDateFrom`, `ExpiryDateTo`, `QuoteNumber`.

### Create Quote

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Quotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"ExpiryDate\": \"2026-04-05\", \"Title\": \"Website Redesign\", \"Summary\": \"Complete website redesign including UX audit\", \"LineItems\": [{\"Description\": \"UX Audit\", \"Quantity\": 1, \"UnitAmount\": 2000.00, \"AccountCode\": \"200\"}, {\"Description\": \"Design & Development\", \"Quantity\": 1, \"UnitAmount\": 8000.00, \"AccountCode\": \"200\"}]}"'
```

### Update Quote Status

Status transitions: DRAFT -> SENT -> ACCEPTED/DECLINED -> INVOICED. All statuses can go to DELETED. Contact and Date are required even for status-only updates.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Quotes" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"QuoteID\": \"<quote-id>\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"Status\": \"SENT\"}"'
```

---

## Purchase Orders

### List Purchase Orders

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/PurchaseOrders?page=1" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Filter params: `status`, `DateFrom`, `DateTo`, `order`, `page`, `pageSize` (max 1000).

### Create Purchase Order

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/PurchaseOrders" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"DeliveryDate\": \"2026-03-20\", \"Reference\": \"PO-001\", \"DeliveryAddress\": \"123 Warehouse St\", \"LineItems\": [{\"Description\": \"Raw materials\", \"Quantity\": 100, \"UnitAmount\": 5.00, \"AccountCode\": \"300\"}]}"'
```

### Update Purchase Order

Include `LineItemID` on existing line items to update them — omitting it deletes and recreates the line item.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/PurchaseOrders/<po-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"PurchaseOrderID\": \"<po-id>\", \"Status\": \"AUTHORISED\"}"'
```

---

## Payments

### List Payments

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Payments?page=1" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Optimized WHERE filters: PaymentType, Status, Date (range operators), Invoice.InvoiceID, Reference.

### Create Payment Against Invoice

Required: invoice/credit note ID, bank account (Code or AccountID), Date, Amount. Amount must not exceed the outstanding balance.

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Payments" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Invoice\": {\"InvoiceID\": \"<invoice-id>\"}, \"Account\": {\"Code\": \"090\"}, \"Date\": \"2026-03-05\", \"Amount\": 500.00}"'
```

### Create Payment Against Credit Note

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Payments" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"CreditNote\": {\"CreditNoteID\": \"<credit-note-id>\"}, \"Account\": {\"Code\": \"090\"}, \"Date\": \"2026-03-05\", \"Amount\": 100.00}"'
```

### Delete Payment

Payments cannot be modified, only deleted. Batch-created payments cannot be deleted.

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

### List Bank Transactions (Paginated)

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BankTransactions?page=1&pageSize=50" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Filter Bank Transactions

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/BankTransactions?where=Type%3D%3D%22SPEND%22%20AND%20Status%3D%3D%22AUTHORISED%22&page=1" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Spend Money Transaction

Types: `SPEND` (money out), `RECEIVE` (money in), `SPEND-TRANSFER`, `RECEIVE-TRANSFER`, `SPEND-OVERPAYMENT`, `RECEIVE-OVERPAYMENT`, `SPEND-PREPAYMENT`, `RECEIVE-PREPAYMENT`.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/BankTransactions" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Type\": \"SPEND\", \"Contact\": {\"ContactID\": \"<contact-id>\"}, \"Date\": \"2026-03-05\", \"LineItems\": [{\"Description\": \"Office supplies\", \"UnitAmount\": 50.00, \"AccountCode\": \"404\"}], \"BankAccount\": {\"Code\": \"090\"}}"'
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

### Filter Accounts by Type

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Accounts?where=Type%3D%3D%22BANK%22" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Account types: BANK, CURRENT, CURRLIAB, DEPRECIATN, DIRECTCOSTS, EQUITY, EXPENSE, FIXED, INVENTORY, LIABILITY, NONCURRENT, OTHERINCOME, OVERHEADS, PREPAYMENT, REVENUE, SALES, TERMLIAB, PAYGLIABILITY, SUPERANNUATIONEXPENSE, SUPERANNUATIONLIABILITY, WAGESEXPENSE.

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

Only accounts with no transactions can be deleted. Otherwise, archive them.

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

Journal lines must balance (sum to zero). Each line needs LineAmount and AccountCode.

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/ManualJournals" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Narration\": \"Year-end adjustment\", \"Date\": \"2026-03-05\", \"JournalLines\": [{\"LineAmount\": 100.00, \"AccountCode\": \"200\", \"Description\": \"Revenue adjustment\"}, {\"LineAmount\": -100.00, \"AccountCode\": \"400\", \"Description\": \"Expense adjustment\"}]}"'
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

Required: `Code` (max 30 chars). Optional: Name (max 50), Description (max 4000), IsSold, IsPurchased, PurchaseDetails, SalesDetails.

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/Items" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Code\": \"WIDGET-001\", \"Name\": \"Widget\", \"Description\": \"Standard widget for sale\", \"PurchaseDetails\": {\"UnitPrice\": 5.00, \"AccountCode\": \"300\"}, \"SalesDetails\": {\"UnitPrice\": 12.00, \"AccountCode\": \"200\"}}"'
```

### Update Item

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Items/<item-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Code\": \"WIDGET-001\", \"Name\": \"Widget Premium\", \"SalesDetails\": {\"UnitPrice\": 15.00, \"AccountCode\": \"200\"}}"'
```

### Delete Item

```bash
bash -c 'curl -s -X DELETE "https://api.xero.com/api.xro/2.0/Items/<item-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Reports

All report endpoints are read-only (GET only). Reports return a nested Rows/Cells structure. Parse rows by RowType: "Header" (column headers), "Section" (category groups with nested Rows), "Row" (data lines), "SummaryRow" (totals).

### Profit and Loss

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-03-31" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `fromDate`, `toDate`, `periods` (comparison periods), `timeframe` (MONTH/QUARTER/YEAR), `trackingCategoryID`, `trackingOptionID`, `standardLayout`, `paymentsOnly`.

### Profit and Loss with Comparison Periods

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-03-31&periods=2&timeframe=MONTH" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Balance Sheet

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/BalanceSheet?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `date` (point-in-time snapshot), `periods`, `timeframe`, `trackingOptionID1`, `trackingOptionID2`, `standardLayout`, `paymentsOnly`.

### Balance Sheet with Comparison

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/BalanceSheet?date=2026-03-31&periods=2&timeframe=MONTH" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Trial Balance

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/TrialBalance?date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Only two params: `date` and `paymentsOnly`. No tracking category support via API.

### Aged Receivables

Requires `contactId` parameter. Get it from the Contacts endpoint first.

```bash
bash -c 'curl -s "https://api.xero.com/api.xro/2.0/Reports/AgedReceivablesByContact?contactId=<contact-id>&date=2026-03-05" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Aged Payables

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

Adding currencies requires a plan that supports multi-currency. See docs: `https://r.jina.ai/https://developer.xero.com/documentation/api/accounting/currencies`

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

### Create Tracking Category

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/TrackingCategories" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"Region\"}"'
```

### Add Tracking Option

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/api.xro/2.0/TrackingCategories/<category-id>/Options" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"North\"}"'
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

## Attachments

### Upload Attachment to Invoice

Max 10 attachments per entity, 25MB each.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/Attachments/receipt.pdf" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/pdf" \
  --data-binary @receipt.pdf'
```

Attachments work on: Invoices, CreditNotes, BankTransactions, Contacts, Accounts, ManualJournals, PurchaseOrders, Receipts, RepeatingInvoices. Replace the entity path accordingly.

---

## Fixed Assets (Assets API)

Base URL: `https://api.xero.com/assets.xro/1.0` (different from accounting API).

> **Note:** Fixed Assets API requires a Xero plan that includes the Fixed Assets feature (Business or above). Starter plans will return "Forbidden".
>
> Documentation:
> - Assets: `https://r.jina.ai/https://developer.xero.com/documentation/api/assets/assets`
> - Asset Types: `https://r.jina.ai/https://developer.xero.com/documentation/api/assets/asset-types`

---

## Projects API

Base URL: `https://api.xero.com/projects.xro/2.0` (different from accounting API).

### List Projects

```bash
bash -c 'curl -s "https://api.xero.com/projects.xro/2.0/projects?states=INPROGRESS&page=1&pageSize=50" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `projectIds`, `contactID`, `states` (INPROGRESS/CLOSED), `page`, `pageSize` (max 500).

### Get Project by ID

```bash
bash -c 'curl -s "https://api.xero.com/projects.xro/2.0/projects/<project-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Project

Required: `contactId`, `name`. Optional: `deadlineUTC`, `estimateAmount`. Currency auto-set to org default. `contactId` cannot be changed after creation.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/projects.xro/2.0/projects" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"contactId\": \"<contact-id>\", \"name\": \"Website Redesign\", \"deadlineUTC\": \"2026-06-30T00:00:00\", \"estimateAmount\": 10000.00}"'
```

### Update Project

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/projects.xro/2.0/projects/<project-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Website Redesign v2\", \"estimateAmount\": 15000.00}"'
```

### Close/Reopen Project

```bash
bash -c 'curl -s -X PATCH "https://api.xero.com/projects.xro/2.0/projects/<project-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"CLOSED\"}"'
```

### List Tasks in Project

```bash
bash -c 'curl -s "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `taskIds`, `chargeType` (TIME/FIXED/NON_CHARGEABLE), `page`, `pageSize`.

### Create Task

Required: `name` (max 100 chars), `rate` ({currency, value}), `chargeType`.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Design Phase\", \"rate\": {\"currency\": \"NZD\", \"value\": 150.00}, \"chargeType\": \"TIME\", \"estimateMinutes\": 2400}"'
```

### Delete Task

```bash
bash -c 'curl -s -X DELETE "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks/<task-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Fails if task has time entries or INVOICED status.

### List Time Entries

```bash
bash -c 'curl -s "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time?page=1" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `userId`, `taskId`, `dateAfterUtc`, `dateBeforeUtc`, `isChargeable`, `invoiceId`, `states` (ACTIVE/LOCKED/INVOICED).

### Get Project Users

The Projects API uses its own user IDs, different from the Accounting API `/Users` endpoint. Get project-specific user IDs first:

```bash
bash -c 'curl -s "https://api.xero.com/projects.xro/2.0/projectsusers" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Time Entry

Required: `userId` (from `/projectsusers`, NOT from Accounting `/Users`), `taskId`, `dateUtc`, `duration` (minutes, 1-59940).

```bash
bash -c 'curl -s -X POST "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"userId\": \"<projects-user-id>\", \"taskId\": \"<task-id>\", \"dateUtc\": \"2026-03-05T09:00:00\", \"duration\": 120, \"description\": \"Design mockups\"}"'
```

### Delete Time Entry

```bash
bash -c 'curl -s -X DELETE "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time/<time-entry-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

INVOICED entries cannot be deleted.

---

## Files API

Base URL: `https://api.xero.com/files.xro/1.0` (different from accounting API).

### List Files

```bash
bash -c 'curl -s "https://api.xero.com/files.xro/1.0/Files?page=1&pagesize=50&sort=CreatedDateUtc&direction=DESC" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

Params: `page`, `pagesize` (max 100), `sort` (Name/Size/CreatedDateUtc), `direction` (ASC/DESC).

### Get File Metadata

```bash
bash -c 'curl -s "https://api.xero.com/files.xro/1.0/Files/<file-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Download File Content

```bash
bash -c 'curl -s "https://api.xero.com/files.xro/1.0/Files/<file-id>/Content" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  -o downloaded_file.pdf'
```

### Upload File to Inbox

Max 10 MB per file. Uses multipart form.

```bash
bash -c 'curl -s -X POST "https://api.xero.com/files.xro/1.0/Files" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  -F "Name=receipt.pdf" \
  -F "file=@receipt.pdf"'
```

### Upload File to Folder

```bash
bash -c 'curl -s -X POST "https://api.xero.com/files.xro/1.0/Files/<folder-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  -F "Name=invoice.pdf" \
  -F "file=@invoice.pdf"'
```

### Rename / Move File

```bash
bash -c 'curl -s -X PUT "https://api.xero.com/files.xro/1.0/Files/<file-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"new_name.pdf\", \"FolderId\": \"<target-folder-id>\"}"'
```

### Delete File

```bash
bash -c 'curl -s -X DELETE "https://api.xero.com/files.xro/1.0/Files/<file-id>" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### List Folders

```bash
bash -c 'curl -s "https://api.xero.com/files.xro/1.0/Folders" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

### Create Folder

```bash
bash -c 'curl -s -X POST "https://api.xero.com/files.xro/1.0/Folders" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>" \
  --header "Content-Type: application/json" \
  -d "{\"Name\": \"Receipts 2026\"}"'
```

### Get Inbox

```bash
bash -c 'curl -s "https://api.xero.com/files.xro/1.0/Inbox" \
  --header "Authorization: Bearer $XERO_TOKEN" \
  --header "xero-tenant-id: <tenant-id>"'
```

---

## Guidelines

1. **Tenant ID Required**: Always call `/connections` first to get the `tenantId`, then include it as `xero-tenant-id` header in every API call.
2. **Account Codes Vary by Org**: Account codes differ between organisations. Always call `GET /Accounts` first to discover valid codes before creating invoices or transactions.
3. **Bank Accounts Required**: Payments, bank transactions, and bank transfers require a BANK-type account. Use `GET /Accounts?where=Type=="BANK"` to find one.
4. **Create vs Update**: Xero uses `PUT` to create and `POST` to update for most Accounting API endpoints. Projects API uses standard REST (POST to create, PUT to update).
5. **Invoice Types**: `ACCREC` = sales invoice (accounts receivable), `ACCPAY` = bill (accounts payable).
6. **Credit Note Types**: `ACCRECCREDIT` = customer credit, `ACCPAYCREDIT` = supplier credit.
7. **Bank Transaction Types**: `SPEND` = money out, `RECEIVE` = money in.
8. **Status Workflow**: DRAFT -> SUBMITTED -> AUTHORISED -> PAID (for invoices). Only AUTHORISED invoices can be voided.
9. **Deleting**: Most entities use `Status: DELETED` or `Status: VOIDED` via POST rather than HTTP DELETE.
10. **Rate Limits**: Xero has a 5,000 API calls/day limit. Use `If-Modified-Since` header and pagination for large datasets.
11. **Pagination**: Default 100 per page for Accounting API. Max varies: 1000 for some, 200 for Assets, 500 for Projects.
12. **Date Format**: Use `YYYY-MM-DD` for dates. DateTime uses ISO-8601 (`2026-03-05T09:00:00`).
13. **LineItemID on Updates**: Always include `LineItemID` when updating line items, or they get deleted and recreated.
14. **100k Record Limit**: GET requests returning >100,000 records return a 400 error. Use filters and pagination.
15. **Different Base URLs**: Accounting API uses `api.xro/2.0`, Assets API uses `assets.xro/1.0`, Projects API uses `projects.xro/2.0`, Files API uses `files.xro/1.0`.

---

## How to Look Up More API Details

Xero developer docs are JS-rendered, so standard fetch won't work. Use `r.jina.ai` to access them:

```
https://r.jina.ai/https://developer.xero.com/documentation/api/accounting/<endpoint>
```

Key documentation pages:
- **Accounting API**: `https://developer.xero.com/documentation/api/accounting/overview`
- **Invoices**: `https://developer.xero.com/documentation/api/accounting/invoices`
- **Contacts**: `https://developer.xero.com/documentation/api/accounting/contacts`
- **Payments**: `https://developer.xero.com/documentation/api/accounting/payments`
- **Bank Transactions**: `https://developer.xero.com/documentation/api/accounting/banktransactions`
- **Reports**: `https://developer.xero.com/documentation/api/accounting/reports`
- **Assets**: `https://developer.xero.com/documentation/api/assets/assets`
- **Asset Types**: `https://developer.xero.com/documentation/api/assets/asset-types`
- **Projects**: `https://developer.xero.com/documentation/api/projects/projects`
- **Tasks**: `https://developer.xero.com/documentation/api/projects/tasks`
- **Time Entries**: `https://developer.xero.com/documentation/api/projects/time`
- **Files**: `https://developer.xero.com/documentation/api/files/files`
- **Folders**: `https://developer.xero.com/documentation/api/files/folders`
- **OAuth Scopes**: `https://developer.xero.com/documentation/guides/oauth2/scopes/`
- **API Explorer**: `https://api-explorer.xero.com`

Example: to read the full Invoices API documentation:

```bash
bash -c 'curl -s "https://r.jina.ai/https://developer.xero.com/documentation/api/accounting/invoices"'
```

This returns the full rendered page content as markdown, including all endpoints, parameters, field definitions, and examples.
