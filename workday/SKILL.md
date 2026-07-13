---
name: workday
description: Workday REST APIs for HCM, staffing, recruiting, finance, and tenant data. Use when the user mentions Workday, workers, staffing, recruiting, HRIS, or Workday finance.
---

## Prerequisites

1. Connect Workday in Zero at Settings > Connectors > Workday.
2. Requests require `WORKDAY_TOKEN`, `WORKDAY_HOST`, and `WORKDAY_TENANT`.
3. API service names and versions depend on the connected Workday tenant.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name WORKDAY_TOKEN` or check a concrete tenant endpoint with `zero doctor check-connector --url https://$WORKDAY_HOST/api/staffing/v7/$WORKDAY_TENANT/workers --method GET`.

## Workers

### List Workers

Replace `<staffing-version>` with a version enabled in the tenant.

```bash
curl -sS --get "https://$WORKDAY_HOST/api/staffing/<staffing-version>/$WORKDAY_TENANT/workers" --header "Authorization: Bearer $WORKDAY_TOKEN" --header "Accept: application/json" --data-urlencode "limit=50" | jq '{total, data: [.data[] | {id, descriptor, href}]}'
```

### Get a Worker

```bash
curl -sS "https://$WORKDAY_HOST/api/staffing/<staffing-version>/$WORKDAY_TENANT/workers/<worker-id>" --header "Authorization: Bearer $WORKDAY_TOKEN" --header "Accept: application/json" | jq '{id, descriptor, person, position, organization, status}'
```

## Workday Query Language

### List Available Data Sources

```bash
curl -sS "https://$WORKDAY_HOST/api/wql/v1/$WORKDAY_TENANT/dataSources" --header "Authorization: Bearer $WORKDAY_TOKEN" --header "Accept: application/json" | jq '{total, data: [.data[] | {id, name, description}]}'
```

### Run a WQL Query

```bash
curl -sS --get "https://$WORKDAY_HOST/api/wql/v1/$WORKDAY_TENANT/data" --header "Authorization: Bearer $WORKDAY_TOKEN" --header "Accept: application/json" --data-urlencode "query=SELECT worker FROM allWorkers LIMIT 50" | jq '{total, data}'
```

## Other Tenant Services

Use the same URL structure for enabled APIs:

```text
https://$WORKDAY_HOST/api/<service>/<version>/$WORKDAY_TENANT/<resource>
```

Common services include `staffing`, `recruiting`, `organizations`, and finance APIs. Discover the exact service version and resource schema from the Workday REST API Explorer for the tenant.

## Guidelines

1. Zero refreshes the Workday access token automatically with the integration user's refresh token.
2. Do not infer service versions or field schemas; Workday availability varies by release, tenant configuration, and security group.
3. Use narrow WQL projections and limits because worker and finance data can be large and sensitive.
4. Ask before changing worker, recruiting, payroll, or finance records.
5. Never expose worker personal data, compensation, or credentials in logs.

## API Reference

- https://community.workday.com/sites/default/files/file-hosting/restapi/index.html
- https://community.workday.com/sites/default/files/file-hosting/restapi/index.html#workday-query-language-wql
