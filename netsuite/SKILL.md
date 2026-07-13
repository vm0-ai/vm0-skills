---
name: netsuite
description: Oracle NetSuite REST Web Services, SuiteQL, and RESTlets for ERP, accounting, CRM, inventory, and business operations. Use when the user mentions NetSuite, SuiteQL, SuiteTalk, or RESTlets.
---

## Prerequisites

1. Connect NetSuite in Zero at Settings > Connectors > NetSuite.
2. Requests require `NETSUITE_TOKEN` and `NETSUITE_ACCOUNT_SUBDOMAIN`.
3. REST Web Services use `https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com`.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NETSUITE_TOKEN` or `zero doctor check-connector --url https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/record/v1/metadata-catalog --method GET`.

## SuiteQL

### Run a Query

Write to `/tmp/netsuite_suiteql.json`:

```json
{
  "q": "SELECT id, companyname, email FROM customer ORDER BY id FETCH FIRST 50 ROWS ONLY"
}
```

```bash
curl -sS -X POST "https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/query/v1/suiteql?limit=50" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Content-Type: application/json" --header "Prefer: transient" -d @/tmp/netsuite_suiteql.json | jq '{count, hasMore, items}'
```

### Paginate SuiteQL Results

```bash
curl -sS -X POST "https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/query/v1/suiteql?limit=100&offset=<offset>" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Content-Type: application/json" --header "Prefer: transient" -d @/tmp/netsuite_suiteql.json | jq '{count, offset, totalResults, hasMore, items}'
```

## Records

### List Customers

```bash
curl -sS "https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/record/v1/customer?limit=50" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Accept: application/json" | jq '{count, hasMore, items: [.items[] | {id, refName, links}]}'
```

### Get a Record

```bash
curl -sS "https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/record/v1/<record-type>/<record-id>" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Accept: application/json" | jq '{id, externalId, entityId, companyName, email, links}'
```

### Create a Customer

Write to `/tmp/netsuite_customer.json`:

```json
{
  "companyName": "Acme Corp",
  "email": "billing@example.com",
  "subsidiary": {
    "id": "<subsidiary-id>"
  }
}
```

```bash
curl -sS -D /tmp/netsuite_headers.txt -o /tmp/netsuite_response.json -X POST "https://$NETSUITE_ACCOUNT_SUBDOMAIN.suitetalk.api.netsuite.com/services/rest/record/v1/customer" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Content-Type: application/json" -d @/tmp/netsuite_customer.json
```

The created record URL is returned in the `Location` response header.

## RESTlets

```bash
curl -sS "https://$NETSUITE_ACCOUNT_SUBDOMAIN.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=<script-id>&deploy=<deployment-id>" --header "Authorization: Bearer $NETSUITE_TOKEN" --header "Accept: application/json" | jq '{status, data, error}'
```

## Guidelines

1. Use the account domain prefix such as `1234567-sb1`, not the display account ID `1234567_SB1`.
2. SuiteQL requests require `Prefer: transient`.
3. Record schemas and required fields vary by enabled features and subsidiaries; inspect the metadata catalog before writes.
4. Ask before creating, updating, or deleting ERP records.
5. NetSuite governance limits apply. Paginate and back off on 429 responses.

## API Reference

- https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/book_1559132836.html
