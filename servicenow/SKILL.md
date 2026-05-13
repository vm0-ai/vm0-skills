---
name: servicenow
description: ServiceNow Table API for ITSM, incidents, change requests, and CMDB. Use when user mentions "ServiceNow", "incident", "change request", "ITSM", "CMDB", "Now Platform", or "service catalog".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SERVICENOW_USERNAME` or `zero doctor check-connector --url https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident?sysparm_limit=1 --method GET`

## How to Use

All examples assume `SERVICENOW_USERNAME`, `SERVICENOW_PASSWORD`, and `SERVICENOW_INSTANCE` (the subdomain before `.service-now.com`) are set. ServiceNow uses HTTP Basic auth — username and password on every request.

Base URL: `https://$SERVICENOW_INSTANCE.service-now.com/api/now/`

Pass credentials with `-u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD"`.

The Table API (`/api/now/table/<table>`) is the workhorse — almost every record type (incident, change_request, problem, cmdb_ci, sys_user, etc.) is reachable through it.

### 1. Verify the Credentials

Fetch one incident to confirm the connection. `sysparm_limit=1` keeps the response small:

```bash
curl -s "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident?sysparm_limit=1" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json"
```

A `401` means bad credentials; a `403` means the user lacks the required role (typically `itil` for incidents).

### 2. List Incidents

`sysparm_query` accepts ServiceNow's encoded query string (filters joined with `^`):

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=active=true^priority=1" --data-urlencode "sysparm_fields=number,short_description,priority,state,assigned_to.name,sys_id" --data-urlencode "sysparm_limit=25"
```

Common encoded-query operators: `=`, `!=`, `>`, `<`, `LIKE`, `STARTSWITH`, `IN`, `^OR`, `^EQ`, `ORDERBY`, `ORDERBYDESC`.

### 3. Get a Single Incident

Replace `<sys-id>` with the 32-character `sys_id` from a list response:

```bash
curl -s "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident/<sys-id>?sysparm_display_value=true" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json"
```

`sysparm_display_value=true` returns human-readable labels instead of raw IDs.

### 4. Create an Incident

Write to `/tmp/servicenow_request.json`:

```json
{
  "short_description": "App login intermittently fails for SSO users",
  "description": "Users from acme.com see a 502 about 1/20 logins since 09:00 UTC.",
  "category": "software",
  "impact": "2",
  "urgency": "2",
  "caller_id": "<sys-user-sys-id>"
}
```

```bash
curl -s -X POST "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

`priority` is auto-calculated from `impact` × `urgency`.

### 5. Update an Incident

Write to `/tmp/servicenow_request.json` with only the fields to change, then run (replace `<sys-id>`):

```json
{
  "state": "6",
  "close_code": "Solved (Permanently)",
  "close_notes": "Reinstated session affinity in load balancer."
}
```

```bash
curl -s -X PATCH "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident/<sys-id>" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

Common incident `state` values: `1` New, `2` In Progress, `3` On Hold, `6` Resolved, `7` Closed, `8` Canceled.

### 6. Delete a Record (admin only)

Use sparingly — most workflows resolve / cancel rather than delete:

```bash
curl -s -X DELETE "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident/<sys-id>" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD"
```

### 7. List Change Requests

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/change_request" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=state!=closed^ORDERBYDESCsys_created_on" --data-urlencode "sysparm_fields=number,short_description,state,risk,assignment_group.name,sys_id" --data-urlencode "sysparm_limit=25"
```

### 8. Create a Standard Change

Write to `/tmp/servicenow_request.json`:

```json
{
  "short_description": "Restart prod-app-3 after kernel patch",
  "description": "Maintenance window 2026-05-20 02:00–04:00 UTC.",
  "type": "standard",
  "category": "Software",
  "risk": "3",
  "impact": "3"
}
```

```bash
curl -s -X POST "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/change_request" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

### 9. Look Up a User by Email

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/sys_user" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=email=user@example.com" --data-urlencode "sysparm_fields=sys_id,name,email,user_name,department.name"
```

The returned `sys_id` is what you pass for `caller_id`, `assigned_to`, etc.

### 10. Query CMDB Configuration Items

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/cmdb_ci" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=nameLIKEprod-app" --data-urlencode "sysparm_fields=name,sys_class_name,operational_status,sys_id" --data-urlencode "sysparm_limit=20"
```

### 11. Add a Work Note (Journal Field)

`work_notes` is internal-only; `comments` is customer-visible. Update either via PATCH:

Write to `/tmp/servicenow_request.json`:

```json
{ "work_notes": "Engaged on-call DBA, awaiting query plan." }
```

```bash
curl -s -X PATCH "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident/<sys-id>" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

### 12. List Attachments on a Record

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/attachment" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=table_name=incident^table_sys_id=<sys-id>"
```

### 13. Upload an Attachment

Replace `<table>` (e.g. `incident`) and `<sys-id>`. `--data-binary` sends the file bytes raw; `Content-Type` should match the file:

```bash
curl -s -X POST "https://$SERVICENOW_INSTANCE.service-now.com/api/now/attachment/file?table_name=<table>&table_sys_id=<sys-id>&file_name=report.pdf" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --header "Content-Type: application/pdf" --data-binary @/path/to/report.pdf
```

### 14. List the Tables You Can Query

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/sys_db_object" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=super_class.name=task" --data-urlencode "sysparm_fields=name,label"
```

### 15. Aggregate / Count (Aggregate API)

Counts open P1 incidents per assignment group:

```bash
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/stats/incident" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Accept: application/json" --data-urlencode "sysparm_query=active=true^priority=1" --data-urlencode "sysparm_group_by=assignment_group" --data-urlencode "sysparm_count=true"
```

## Common Workflows

### Auto-create an incident from an alert

```bash
# 1. Look up the caller's sys_id by email
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/sys_user" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --data-urlencode "sysparm_query=email=alerts@example.com" --data-urlencode "sysparm_fields=sys_id" | jq -r '.result[0].sys_id'

# 2. Build /tmp/servicenow_request.json with caller_id set, then POST
curl -s -X POST "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

### Close every On-Hold incident older than 60 days

```bash
# 1. Query candidates (replace 2026-03-15 with cutoff)
curl -s -G "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --data-urlencode "sysparm_query=state=3^sys_updated_on<2026-03-15 00:00:00" --data-urlencode "sysparm_fields=sys_id,number" | jq -r '.result[].sys_id'

# 2. For each <sys-id>, PATCH to state=7 (Closed) with close fields populated
# Write /tmp/servicenow_request.json: {"state":"7","close_code":"Closed/Resolved by Caller","close_notes":"Auto-closed after 60 days stale"}
curl -s -X PATCH "https://$SERVICENOW_INSTANCE.service-now.com/api/now/table/incident/<sys-id>" -u "$SERVICENOW_USERNAME:$SERVICENOW_PASSWORD" --header "Content-Type: application/json" -d @/tmp/servicenow_request.json
```

## Guidelines

1. Every record has a 32-character hex `sys_id` — it's the immutable primary key, distinct from human-readable numbers like `INC0010001`.
2. Encoded-query syntax (`sysparm_query=state=2^active=true^ORimpact=1`) is the only filter language for the Table API. Reference: ServiceNow's "Encoded Query Strings" docs.
3. `sysparm_display_value=true` returns labels (e.g. `Critical`) instead of internal values (`1`). For writes, always send internal values.
4. Reference fields can be dot-walked in `sysparm_fields` (e.g. `assigned_to.name`, `caller_id.email`) — saves an extra round trip.
5. Pagination: `sysparm_limit` (default 10000, but practical max ~1000), `sysparm_offset`. Response headers include `X-Total-Count` and `Link` for the next page.
6. The user must have the right role on each table — `itil` for incident/problem/change, `cmdb_read` for CMDB, `admin` for sys_user_role assignment, etc. `403` errors usually mean missing roles, not bad creds.
7. PATCH is the right verb for partial updates; PUT replaces the entire record (often loses data unless every field is sent).
8. Attachments live in the `sys_attachment` table; uploads use `application/binary` semantics — see step 13.
9. Aggregate / stats endpoints (`/api/now/stats/<table>`) avoid pulling thousands of rows for counts.
10. Rate limit: instance-specific, but the default is ~600 requests/min per user; expect throttling at scale. Response code `429` returns `Retry-After`.

## API Reference

- Table API: https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/c_TableAPI
- Aggregate API: https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/c_AggregateAPI
- Attachment API: https://developer.servicenow.com/dev.do#!/reference/api/rome/rest/c_AttachmentAPI
- Encoded query strings: https://docs.servicenow.com/bundle/rome-platform-user-interface/page/use/common-ui-elements/reference/r_OpAvailableFiltersQueries.html
- Authentication options: https://docs.servicenow.com/bundle/rome-application-development/page/integrate/inbound-rest/concept/c_InboundRESTBasicAuth.html
