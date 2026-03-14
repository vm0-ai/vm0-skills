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


---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/xero-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $XERO_TOKEN" "$@"
EOF
chmod +x /tmp/xero-curl
```

**Usage:** All examples below use `/tmp/xero-curl` instead of direct `curl` calls.

## Step 1: Get Tenant ID (Required First)

Every Xero API call needs a `xero-tenant-id` header. Get it from the connections endpoint:

```bash
/tmp/xero-curl "https://api.xero.com/connections"
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
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Organisation"
```

Returns: Name, LegalName, BaseCurrency, CountryCode, FinancialYearEndDay/Month, TaxNumber, Timezone, PeriodLockDate, and more. All fields are read-only.

### Get Permitted Actions

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Organisation/Actions"
```

Returns array of `{Name, Status}` where Status is "ALLOWED" or "NOT-ALLOWED". Useful to check what operations are available.

---

## Contacts

### List Contacts (Paginated)

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Contacts?page=1&pageSize=100"
```

### Search Contacts

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Contacts?searchTerm=john"
```

`searchTerm` searches across: Name, FirstName, LastName, ContactNumber, CompanyNumber, EmailAddress.

### Filter Contacts

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress%3D%3D%22email%40example.com%22"
```

Optimized `where` filters: `Name`, `EmailAddress`, `AccountNumber`. Use `searchTerm` over `Name.Contains()` for performance.

### Get Contact by ID

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>"
```

### Create Contact

Required: `Name` (max 255 chars). Optional: EmailAddress, FirstName, LastName, CompanyNumber, AccountNumber, Phones, Addresses, ContactPersons (max 5), TaxNumber, DefaultCurrency, Website, PaymentTerms.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Contacts"
```

### Update Contact

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>"
```

### Archive Contact

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Contacts/<contact-id>"
```

Contacts cannot be deleted — only archived. Use `includeArchived=true` in list requests to see archived contacts.

---

## Contact Groups

### List Contact Groups

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/ContactGroups"
```

### Create Contact Group

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/ContactGroups"
```

### Add Contacts to Group

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/ContactGroups/<group-id>/Contacts"
```

### Delete Contact Group

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/ContactGroups/<group-id>"
```

---

## Invoices

### List Invoices (Summary)

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices"
```

Without `page`, returns summary data only (no line items). Add `page=1` for full details.

### List with Pagination and Full Details

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices?page=1&pageSize=50"
```

### Filter Invoices

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices?Statuses=AUTHORISED,PAID&ContactIDs=<contact-id>"
```

Filter params: `IDs`, `InvoiceNumbers`, `ContactIDs`, `Statuses` (DRAFT/SUBMITTED/AUTHORISED/PAID/VOIDED), `createdByMyApp`, `SearchTerm` (searches InvoiceNumber and Reference).

### Advanced Where Filter

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices?where=Type%3D%3D%22ACCPAY%22%20AND%20Status%3D%3D%22AUTHORISED%22"
```

Optimized WHERE fields: Status, Contact.ContactID, Contact.Name, Reference, InvoiceNumber, Type, AmountPaid, Date, DueDate, AmountDue.

### Get Invoice by ID

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>"
```

### Get Invoice by Number

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices/<invoice-number>"
```

### Get Online Invoice URL

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/OnlineInvoice"
```

Only for ACCREC invoices that are not DRAFT.

### Create Sales Invoice (ACCREC)

Required: `Type`, `Contact` (with ContactID or Name), `LineItems` (each needs `Description`).

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Invoices"
```

### Create Bill (ACCPAY)

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Invoices"
```

ACCPAY (bills) do not support DiscountRate/DiscountAmount.

### Create Invoice with Discount and Tracking

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Invoices"
```

### Update Invoice Status (Approve)

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>"
```

Status transitions: DRAFT -> SUBMITTED -> AUTHORISED -> PAID (system-assigned when fully paid). AUTHORISED can be VOIDED. DRAFT/SUBMITTED can be DELETED.

### Void Invoice

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>"
```

Only AUTHORISED invoices can be voided. DRAFT/SUBMITTED should use Status: DELETED.

### Email Invoice

Email requires a paying Xero plan. Returns 204 on success. Limits: 1000/day (paying), 20/day (trial), 0/day (demo).

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/Email"
```

---

## Credit Notes

### List Credit Notes

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/CreditNotes"
```

### Create Credit Note

Type: `ACCRECCREDIT` (customer credit) or `ACCPAYCREDIT` (supplier credit).

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/CreditNotes"
```

### Allocate Credit Note to Invoice

Credit note must be AUTHORISED first.

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/CreditNotes/<credit-note-id>/Allocations"
```

---

## Quotes

### List Quotes

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Quotes?page=1"
```

Filter params: `Status` (DRAFT/SENT/ACCEPTED/DECLINED/INVOICED), `ContactID`, `DateFrom`, `DateTo`, `ExpiryDateFrom`, `ExpiryDateTo`, `QuoteNumber`.

### Create Quote

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Quotes"
```

### Update Quote Status

Status transitions: DRAFT -> SENT -> ACCEPTED/DECLINED -> INVOICED. All statuses can go to DELETED. Contact and Date are required even for status-only updates.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Quotes"
```

---

## Purchase Orders

### List Purchase Orders

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/PurchaseOrders?page=1"
```

Filter params: `status`, `DateFrom`, `DateTo`, `order`, `page`, `pageSize` (max 1000).

### Create Purchase Order

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/PurchaseOrders"
```

### Update Purchase Order

Include `LineItemID` on existing line items to update them — omitting it deletes and recreates the line item.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/PurchaseOrders/<po-id>"
```

---

## Payments

### List Payments

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Payments?page=1"
```

Optimized WHERE filters: PaymentType, Status, Date (range operators), Invoice.InvoiceID, Reference.

### Create Payment Against Invoice

Required: invoice/credit note ID, bank account (Code or AccountID), Date, Amount. Amount must not exceed the outstanding balance.

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Payments"
```

### Create Payment Against Credit Note

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Payments"
```

### Delete Payment

Payments cannot be modified, only deleted. Batch-created payments cannot be deleted.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Payments/<payment-id>"
```

---

## Batch Payments

### List Batch Payments

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/BatchPayments"
```

---

## Bank Transactions

### List Bank Transactions (Paginated)

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/BankTransactions?page=1&pageSize=50"
```

### Filter Bank Transactions

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/BankTransactions?where=Type%3D%3D%22SPEND%22%20AND%20Status%3D%3D%22AUTHORISED%22&page=1"
```

### Create Spend Money Transaction

Types: `SPEND` (money out), `RECEIVE` (money in), `SPEND-TRANSFER`, `RECEIVE-TRANSFER`, `SPEND-OVERPAYMENT`, `RECEIVE-OVERPAYMENT`, `SPEND-PREPAYMENT`, `RECEIVE-PREPAYMENT`.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/BankTransactions"
```

### Create Receive Money Transaction

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/BankTransactions"
```

### Delete Bank Transaction

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/BankTransactions/<transaction-id>"
```

---

## Bank Transfers

### List Bank Transfers

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/BankTransfers"
```

### Create Bank Transfer

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/BankTransfers"
```

---

## Accounts (Chart of Accounts)

### List All Accounts

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Accounts"
```

### Filter Accounts by Type

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Accounts?where=Type%3D%3D%22BANK%22"
```

Account types: BANK, CURRENT, CURRLIAB, DEPRECIATN, DIRECTCOSTS, EQUITY, EXPENSE, FIXED, INVENTORY, LIABILITY, NONCURRENT, OTHERINCOME, OVERHEADS, PREPAYMENT, REVENUE, SALES, TERMLIAB, PAYGLIABILITY, SUPERANNUATIONEXPENSE, SUPERANNUATIONLIABILITY, WAGESEXPENSE.

### Get Account by ID

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Accounts/<account-id>"
```

### Create Account

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Accounts"
```

### Archive Account

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Accounts/<account-id>"
```

### Delete Account

Only accounts with no transactions can be deleted. Otherwise, archive them.

```bash
/tmp/xero-curl -X DELETE "https://api.xero.com/api.xro/2.0/Accounts/<account-id>"
```

---

## Manual Journals

### List Manual Journals

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/ManualJournals"
```

### Create Manual Journal

Journal lines must balance (sum to zero). Each line needs LineAmount and AccountCode.

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/ManualJournals"
```

---

## Items

### List Items

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Items"
```

### Create Item

Required: `Code` (max 30 chars). Optional: Name (max 50), Description (max 4000), IsSold, IsPurchased, PurchaseDetails, SalesDetails.

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/Items"
```

### Update Item

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Items/<item-id>"
```

### Delete Item

```bash
/tmp/xero-curl -X DELETE "https://api.xero.com/api.xro/2.0/Items/<item-id>"
```

---

## Reports

All report endpoints are read-only (GET only). Reports return a nested Rows/Cells structure. Parse rows by RowType: "Header" (column headers), "Section" (category groups with nested Rows), "Row" (data lines), "SummaryRow" (totals).

### Profit and Loss

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-03-31"
```

Params: `fromDate`, `toDate`, `periods` (comparison periods), `timeframe` (MONTH/QUARTER/YEAR), `trackingCategoryID`, `trackingOptionID`, `standardLayout`, `paymentsOnly`.

### Profit and Loss with Comparison Periods

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-03-31&periods=2&timeframe=MONTH"
```

### Balance Sheet

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/BalanceSheet?date=2026-03-05"
```

Params: `date` (point-in-time snapshot), `periods`, `timeframe`, `trackingOptionID1`, `trackingOptionID2`, `standardLayout`, `paymentsOnly`.

### Balance Sheet with Comparison

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/BalanceSheet?date=2026-03-31&periods=2&timeframe=MONTH"
```

### Trial Balance

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/TrialBalance?date=2026-03-05"
```

Only two params: `date` and `paymentsOnly`. No tracking category support via API.

### Aged Receivables

Requires `contactId` parameter. Get it from the Contacts endpoint first.

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/AgedReceivablesByContact?contactId=<contact-id>&date=2026-03-05"
```

### Aged Payables

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/AgedPayablesByContact?contactId=<contact-id>&date=2026-03-05"
```

### Bank Summary

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/BankSummary?fromDate=2026-01-01&toDate=2026-03-31"
```

### Executive Summary

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/ExecutiveSummary?date=2026-03-05"
```

### Budget Summary

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Reports/BudgetSummary?date=2026-03-05"
```

---

## Budgets

### List Budgets

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Budgets"
```

### Get Budget by ID (with date range)

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Budgets/<budget-id>?DateFrom=2026-01-01&DateTo=2026-12-31"
```

---

## Currencies

### List Currencies

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Currencies"
```

Adding currencies requires a plan that supports multi-currency. See docs: `https://r.jina.ai/https://developer.xero.com/documentation/api/accounting/currencies`

---

## Tax Rates

### List Tax Rates

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/TaxRates"
```

---

## Tracking Categories

### List Tracking Categories

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/TrackingCategories"
```

### Create Tracking Category

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/TrackingCategories"
```

### Add Tracking Option

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/api.xro/2.0/TrackingCategories/<category-id>/Options"
```

---

## Branding Themes

### List Branding Themes

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/BrandingThemes"
```

---

## Users

### List Users

```bash
/tmp/xero-curl "https://api.xero.com/api.xro/2.0/Users"
```

---

## Attachments

### Upload Attachment to Invoice

Max 10 attachments per entity, 25MB each.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/api.xro/2.0/Invoices/<invoice-id>/Attachments/receipt.pdf"
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
/tmp/xero-curl "https://api.xero.com/projects.xro/2.0/projects?states=INPROGRESS&page=1&pageSize=50"
```

Params: `projectIds`, `contactID`, `states` (INPROGRESS/CLOSED), `page`, `pageSize` (max 500).

### Get Project by ID

```bash
/tmp/xero-curl "https://api.xero.com/projects.xro/2.0/projects/<project-id>"
```

### Create Project

Required: `contactId`, `name`. Optional: `deadlineUTC`, `estimateAmount`. Currency auto-set to org default. `contactId` cannot be changed after creation.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/projects.xro/2.0/projects"
```

### Update Project

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/projects.xro/2.0/projects/<project-id>"
```

### Close/Reopen Project

```bash
/tmp/xero-curl -X PATCH "https://api.xero.com/projects.xro/2.0/projects/<project-id>"
```

### List Tasks in Project

```bash
/tmp/xero-curl "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks"
```

Params: `taskIds`, `chargeType` (TIME/FIXED/NON_CHARGEABLE), `page`, `pageSize`.

### Create Task

Required: `name` (max 100 chars), `rate` ({currency, value}), `chargeType`.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks"
```

### Delete Task

```bash
/tmp/xero-curl -X DELETE "https://api.xero.com/projects.xro/2.0/projects/<project-id>/tasks/<task-id>"
```

Fails if task has time entries or INVOICED status.

### List Time Entries

```bash
/tmp/xero-curl "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time?page=1"
```

Params: `userId`, `taskId`, `dateAfterUtc`, `dateBeforeUtc`, `isChargeable`, `invoiceId`, `states` (ACTIVE/LOCKED/INVOICED).

### Get Project Users

The Projects API uses its own user IDs, different from the Accounting API `/Users` endpoint. Get project-specific user IDs first:

```bash
/tmp/xero-curl "https://api.xero.com/projects.xro/2.0/projectsusers"
```

### Create Time Entry

Required: `userId` (from `/projectsusers`, NOT from Accounting `/Users`), `taskId`, `dateUtc`, `duration` (minutes, 1-59940).

```bash
/tmp/xero-curl -X POST "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time"
```

### Delete Time Entry

```bash
/tmp/xero-curl -X DELETE "https://api.xero.com/projects.xro/2.0/projects/<project-id>/time/<time-entry-id>"
```

INVOICED entries cannot be deleted.

---

## Files API

Base URL: `https://api.xero.com/files.xro/1.0` (different from accounting API).

### List Files

```bash
/tmp/xero-curl "https://api.xero.com/files.xro/1.0/Files?page=1&pagesize=50&sort=CreatedDateUtc&direction=DESC"
```

Params: `page`, `pagesize` (max 100), `sort` (Name/Size/CreatedDateUtc), `direction` (ASC/DESC).

### Get File Metadata

```bash
/tmp/xero-curl "https://api.xero.com/files.xro/1.0/Files/<file-id>"
```

### Download File Content

```bash
/tmp/xero-curl "https://api.xero.com/files.xro/1.0/Files/<file-id>/Content"
```

### Upload File to Inbox

Max 10 MB per file. Uses multipart form.

```bash
/tmp/xero-curl -X POST "https://api.xero.com/files.xro/1.0/Files"
```

### Upload File to Folder

```bash
/tmp/xero-curl -X POST "https://api.xero.com/files.xro/1.0/Files/<folder-id>"
```

### Rename / Move File

```bash
/tmp/xero-curl -X PUT "https://api.xero.com/files.xro/1.0/Files/<file-id>"
```

### Delete File

```bash
/tmp/xero-curl -X DELETE "https://api.xero.com/files.xro/1.0/Files/<file-id>"
```

### List Folders

```bash
/tmp/xero-curl "https://api.xero.com/files.xro/1.0/Folders"
```

### Create Folder

```bash
/tmp/xero-curl -X POST "https://api.xero.com/files.xro/1.0/Folders"
```

### Get Inbox

```bash
/tmp/xero-curl "https://api.xero.com/files.xro/1.0/Inbox"
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
/tmp/xero-curl "https://r.jina.ai/https://developer.xero.com/documentation/api/accounting/invoices"
```

This returns the full rendered page content as markdown, including all endpoints, parameters, field definitions, and examples.
