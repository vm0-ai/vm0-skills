---
name: quickbooks
description: QuickBooks Online Accounting API for company info, customers,
  vendors, invoices, bills, accounts, reports, and accounting queries. Use when
  user mentions "QuickBooks", "QBO", "Intuit", "invoice", "bill", or accounting
  data.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name QUICKBOOKS_TOKEN` or `zero doctor check-connector --url https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/companyinfo/$QUICKBOOKS_REALM_ID --method GET`

## How to Use

Base URL: `https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID`

All calls use `Authorization: Bearer $QUICKBOOKS_TOKEN`. The `QUICKBOOKS_REALM_ID` variable is captured during OAuth and is required in every QuickBooks Online Accounting API URL.

QuickBooks query parameters often need `minorversion`. Add `?minorversion=75` when an endpoint requires the latest fields.

## Company

### Get Company Info

```bash
curl -s "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/companyinfo/$QUICKBOOKS_REALM_ID?minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" | jq '.CompanyInfo | {Id, CompanyName, LegalName, Country, FiscalYearStartMonth}'
```

### Query Company Info

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from CompanyInfo" | jq '.QueryResponse.CompanyInfo'
```

## Queries

### Run a Query

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Customer maxresults 20" | jq '.QueryResponse.Customer[] | {Id, DisplayName, PrimaryEmailAddr}'
```

### Count Records

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select count(*) from Invoice" | jq '.QueryResponse.totalCount'
```

## Customers

### List Customers

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Customer order by DisplayName maxresults 50" | jq '.QueryResponse.Customer[] | {Id, DisplayName, Balance}'
```

### Get Customer

```bash
curl -s "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/customer/<customer-id>?minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" | jq '.Customer'
```

### Create Customer

Write to `/tmp/quickbooks_customer.json`:

```json
{
  "DisplayName": "Acme Corp",
  "PrimaryEmailAddr": {
    "Address": "billing@example.com"
  }
}
```

```bash
curl -s -X POST "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/customer?minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d @/tmp/quickbooks_customer.json | jq '.Customer | {Id, DisplayName}'
```

## Invoices

### List Invoices

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Invoice order by TxnDate desc maxresults 20" | jq '.QueryResponse.Invoice[] | {Id, DocNumber, TxnDate, TotalAmt, Balance}'
```

### Get Invoice

```bash
curl -s "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/invoice/<invoice-id>?minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" | jq '.Invoice'
```

### Create Invoice

Write to `/tmp/quickbooks_invoice.json`:

```json
{
  "CustomerRef": {
    "value": "<customer-id>"
  },
  "Line": [
    {
      "Amount": 100,
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "ItemRef": {
          "value": "<item-id>"
        }
      }
    }
  ]
}
```

```bash
curl -s -X POST "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/invoice?minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d @/tmp/quickbooks_invoice.json | jq '.Invoice | {Id, DocNumber, TotalAmt, Balance}'
```

## Vendors and Bills

### List Vendors

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Vendor order by DisplayName maxresults 50" | jq '.QueryResponse.Vendor[] | {Id, DisplayName, Balance}'
```

### List Bills

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Bill order by TxnDate desc maxresults 20" | jq '.QueryResponse.Bill[] | {Id, TxnDate, TotalAmt, Balance}'
```

## Accounts and Items

### List Accounts

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Account order by Name maxresults 100" | jq '.QueryResponse.Account[] | {Id, Name, AccountType, CurrentBalance}'
```

### List Items

```bash
curl -s --get "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/query" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=select * from Item order by Name maxresults 100" | jq '.QueryResponse.Item[] | {Id, Name, Type, UnitPrice}'
```

## Reports

### Profit and Loss

```bash
curl -s "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/reports/ProfitAndLoss?start_date=2026-01-01&end_date=2026-12-31&minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" | jq '.Header, .Rows'
```

### Balance Sheet

```bash
curl -s "https://quickbooks.api.intuit.com/v3/company/$QUICKBOOKS_REALM_ID/reports/BalanceSheet?date=2026-12-31&minorversion=75" \
  --header "Authorization: Bearer $QUICKBOOKS_TOKEN" \
  --header "Accept: application/json" | jq '.Header, .Rows'
```
