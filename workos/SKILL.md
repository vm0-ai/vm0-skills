---
name: workos
description: WorkOS API for enterprise SSO, SCIM directory sync, RBAC fine-grained authorization, and audit logs. Use when user mentions "WorkOS", "SSO", "SAML", "SCIM", "directory sync", "enterprise authentication", "audit log", or "fine-grained authorization".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name WORKOS_TOKEN` or `zero doctor check-connector --url https://api.workos.com/organizations --method GET`

## Authentication

All requests require a secret API key passed as a Bearer token:

```
Authorization: Bearer $WORKOS_TOKEN
```

> Official docs: `https://workos.com/docs/reference`

## Environment Variables

| Variable | Description |
|---|---|
| `WORKOS_TOKEN` | WorkOS secret API key (`sk_live_...` or `sk_test_...`) |

## Key Endpoints

Base URL: `https://api.workos.com`

---

## Organizations

### List Organizations

```bash
curl -s "https://api.workos.com/organizations" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Response includes a `data` array of organization objects, each with `id`, `name`, `domains`, and `created_at`.

### Get Organization

```bash
curl -s "https://api.workos.com/organizations/<organization-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Create Organization

Write to `/tmp/workos_org.json`:

```json
{
  "name": "<your-organization-name>",
  "domains": ["<your-domain.com>"]
}
```

```bash
curl -s -X POST "https://api.workos.com/organizations" --header "Authorization: Bearer $WORKOS_TOKEN" --header "Content-Type: application/json" -d @/tmp/workos_org.json
```

### Delete Organization

```bash
curl -s -X DELETE "https://api.workos.com/organizations/<organization-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## SSO Connections

### List SSO Connections

```bash
curl -s "https://api.workos.com/connections" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Filter by organization:

```bash
curl -s "https://api.workos.com/connections?organization_id=<organization-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Get SSO Connection

```bash
curl -s "https://api.workos.com/connections/<connection-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Delete SSO Connection

```bash
curl -s -X DELETE "https://api.workos.com/connections/<connection-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## Directory Sync (SCIM)

### List Directories

```bash
curl -s "https://api.workos.com/directories" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Filter by organization:

```bash
curl -s "https://api.workos.com/directories?organization_id=<organization-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Get Directory

```bash
curl -s "https://api.workos.com/directories/<directory-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### List Directory Users

```bash
curl -s "https://api.workos.com/directory_users?directory=<directory-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Response includes a `data` array of directory user objects with `id`, `username`, `emails`, `first_name`, `last_name`, `state`, and group memberships.

### Get Directory User

```bash
curl -s "https://api.workos.com/directory_users/<directory-user-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### List Directory Groups

```bash
curl -s "https://api.workos.com/directory_groups?directory=<directory-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Get Directory Group

```bash
curl -s "https://api.workos.com/directory_groups/<directory-group-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## User Management

### List Users

```bash
curl -s "https://api.workos.com/user_management/users" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Filter options via query parameters: `email`, `organization_id`, `limit` (default 10, max 100), `after` (cursor for pagination).

### Get User

```bash
curl -s "https://api.workos.com/user_management/users/<user-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Create User

Write to `/tmp/workos_user.json`:

```json
{
  "email": "<user@example.com>",
  "first_name": "<First>",
  "last_name": "<Last>",
  "email_verified": true
}
```

```bash
curl -s -X POST "https://api.workos.com/user_management/users" --header "Authorization: Bearer $WORKOS_TOKEN" --header "Content-Type: application/json" -d @/tmp/workos_user.json
```

### Update User

Write to `/tmp/workos_user_update.json`:

```json
{
  "first_name": "<Updated First>",
  "last_name": "<Updated Last>"
}
```

```bash
curl -s -X PUT "https://api.workos.com/user_management/users/<user-id>" --header "Authorization: Bearer $WORKOS_TOKEN" --header "Content-Type: application/json" -d @/tmp/workos_user_update.json
```

### Delete User

```bash
curl -s -X DELETE "https://api.workos.com/user_management/users/<user-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## Organization Memberships

### List Organization Memberships

```bash
curl -s "https://api.workos.com/user_management/organization_memberships?organization_id=<organization-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Create Organization Membership

Write to `/tmp/workos_membership.json`:

```json
{
  "user_id": "<user-id>",
  "organization_id": "<organization-id>"
}
```

```bash
curl -s -X POST "https://api.workos.com/user_management/organization_memberships" --header "Authorization: Bearer $WORKOS_TOKEN" --header "Content-Type: application/json" -d @/tmp/workos_membership.json
```

### Delete Organization Membership

```bash
curl -s -X DELETE "https://api.workos.com/user_management/organization_memberships/<membership-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## Audit Logs

### List Audit Log Events

Write to `/tmp/workos_audit_export.json`:

```json
{
  "organization_id": "<organization-id>",
  "actions": ["user.signed_in", "user.signed_out"],
  "range_start": "2024-01-01T00:00:00.000Z",
  "range_end": "2024-12-31T23:59:59.999Z"
}
```

Create an export first:

```bash
curl -s -X POST "https://api.workos.com/audit_logs/exports" --header "Authorization: Bearer $WORKOS_TOKEN" --header "Content-Type: application/json" -d @/tmp/workos_audit_export.json
```

Then poll the export using the returned `id` until `state` is `ready`:

```bash
curl -s "https://api.workos.com/audit_logs/exports/<export-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

When `state` is `ready`, download the CSV from the `url` field in the response.

---

## Roles (RBAC)

### List Roles

```bash
curl -s "https://api.workos.com/roles" --header "Authorization: Bearer $WORKOS_TOKEN"
```

### Get Role

```bash
curl -s "https://api.workos.com/roles/<role-id>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

---

## Pagination

All list endpoints support cursor-based pagination via `after` and `limit` parameters:

```bash
curl -s "https://api.workos.com/organizations?limit=20&after=<cursor>" --header "Authorization: Bearer $WORKOS_TOKEN"
```

Response includes `list_metadata.after` (cursor for the next page, `null` when on the last page) and `list_metadata.before`.

---

## Prerequisites

Connect the **WorkOS** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name WORKOS_TOKEN` or `zero doctor check-connector --url https://api.workos.com/organizations --method GET`

---

## Guidelines

1. **API key types**: Use `sk_live_...` keys for production and `sk_test_...` for sandbox/testing environments. The test environment has separate organizations and users.
2. **Pagination**: All list endpoints return up to 100 records per page. Use the `after` cursor from `list_metadata.after` to retrieve subsequent pages.
3. **Audit Log exports**: Audit log data is exported asynchronously — create an export, then poll until `state` is `ready` before downloading.
4. **Organization domains**: SSO connections and directory sync are scoped to organizations. Always retrieve the organization ID before managing connections or directories.
5. **Rate limits**: WorkOS enforces per-environment rate limits. Implement exponential backoff for `429` responses.
