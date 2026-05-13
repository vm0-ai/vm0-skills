---
name: altium-365
description: Altium 365 Requirements and Systems Portal REST API for PCB requirements management. Use when user mentions "Altium 365", "Altium", "PCB", "EDA", "Requirements Portal", or "Systems Portal".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ALTIUM365_TOKEN` or `zero doctor check-connector --url $ALTIUM365_WORKSPACE_URL/rest/projects --method GET`

## How to Use

All examples assume `ALTIUM365_TOKEN` (Personal User Token) and `ALTIUM365_WORKSPACE_URL` (e.g. `https://acme.365.altium.com`) are set. Altium 365 uses Bearer authentication on the Requirements & Systems Portal REST API.

Base URL: `$ALTIUM365_WORKSPACE_URL/rest`

The workspace URL is specific to your Altium 365 deployment — find it in the address bar of the Requirements & Systems Portal. User tokens are valid for three months from creation.

### 1. Verify the Token

Pull the project list as a connectivity sanity check:

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects?limit=1" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json"
```

A `401 Unauthorized` typically means the token has expired or never had Portal access; a `404` usually means the workspace URL is wrong.

### 2. List Projects

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects?limit=50" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" | jq '.items[] | {id, name, description}'
```

### 3. Get a Specific Project

Replace `<project-id>` with an `id` from the list response:

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json"
```

### 4. List Requirements in a Project

Requirements are the core unit — each represents a system or component requirement that traces through design and verification.

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/requirements?limit=100" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" | jq '.items[] | {id, name, status, priority}'
```

### 5. Create a Requirement

Write to `/tmp/altium365_request.json`:

```json
{
  "name": "REQ-PWR-001 — System operates from 12V ± 5% input",
  "description": "Board must regulate cleanly from 11.4V to 12.6V input.",
  "priority": "high",
  "status": "draft"
}
```

```bash
curl -s -X POST "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/requirements" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### 6. Update a Requirement

Write to `/tmp/altium365_request.json` with only the changed fields (replace `<requirement-id>`):

```json
{ "status": "approved", "priority": "critical" }
```

```bash
curl -s -X PATCH "$ALTIUM365_WORKSPACE_URL/rest/requirements/<requirement-id>" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### 7. Delete a Requirement

```bash
curl -s -X DELETE "$ALTIUM365_WORKSPACE_URL/rest/requirements/<requirement-id>" --header "Authorization: Bearer $ALTIUM365_TOKEN"
```

### 8. List Components in a Project

Components map requirements onto subsystems / blocks in the system design:

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/components" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" | jq '.items[] | {id, name, parent_id}'
```

### 9. Create a Component

Write to `/tmp/altium365_request.json`:

```json
{
  "name": "Power Subsystem",
  "description": "12V → 3.3V / 5V regulation and protection",
  "parent_id": "<parent-component-id>"
}
```

```bash
curl -s -X POST "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/components" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### 10. Link a Requirement to a Component (Trace)

Write to `/tmp/altium365_request.json`:

```json
{ "requirement_id": "<requirement-id>", "component_id": "<component-id>" }
```

```bash
curl -s -X POST "$ALTIUM365_WORKSPACE_URL/rest/traces" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### 11. List Verification Tests

Verification tests close the loop on each requirement:

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/tests" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" | jq '.items[] | {id, name, status, last_run_at}'
```

### 12. Record a Test Result

Write to `/tmp/altium365_request.json`:

```json
{
  "test_id": "<test-id>",
  "result": "passed",
  "notes": "Verified at 11.4V, 12.0V, 12.6V — all within ±2% target rail.",
  "ran_at": "2026-05-12T14:00:00Z"
}
```

```bash
curl -s -X POST "$ALTIUM365_WORKSPACE_URL/rest/tests/<test-id>/results" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### 13. Export Requirements as JSON

The list endpoint is itself the export — pull all pages with a large `limit`:

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/requirements?limit=1000" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Accept: application/json" > /tmp/altium365_requirements.json
```

For >1000 items, paginate with the `cursor` field returned in the response.

## Common Workflows

### Bulk-approve all "review" requirements in a project

```bash
# 1. Find candidate IDs
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/requirements?status=review&limit=200" --header "Authorization: Bearer $ALTIUM365_TOKEN" | jq -r '.items[].id'

# 2. For each <requirement-id>, PATCH status to approved
# Write /tmp/altium365_request.json: { "status": "approved" }
curl -s -X PATCH "$ALTIUM365_WORKSPACE_URL/rest/requirements/<requirement-id>" --header "Authorization: Bearer $ALTIUM365_TOKEN" --header "Content-Type: application/json" -d @/tmp/altium365_request.json
```

### Find requirements without any trace links

```bash
curl -s "$ALTIUM365_WORKSPACE_URL/rest/projects/<project-id>/requirements?has_traces=false&limit=200" --header "Authorization: Bearer $ALTIUM365_TOKEN" | jq '.items[] | {id, name, status}'
```

## Guidelines

1. The base host is workspace-specific — every team has their own subdomain on `*.365.altium.com`. There is no single global API host.
2. User tokens are minted in **Altium 365 → Settings → User Tokens** and expire after **three months** — surface 401s as "token expired, please reconnect," not as bad credentials.
3. This is the **Requirements & Systems Portal** REST API. Other Altium 365 surfaces (Workspace, Manufacturing Portal, ConcordPro) use OAuth and are not covered here.
4. IDs are UUIDs / opaque strings — store them as-is.
5. Pagination uses a `cursor` field plus `limit` (default 50, max 1000). The response includes `next_cursor` when more pages exist.
6. PATCH is the safe verb for partial updates. PUT replaces the entire resource and any omitted field becomes `null`.
7. Dates are ISO 8601 with `Z` suffix; localize on the client side.
8. Trace links are uni-directional (`requirement → component`, `requirement → test`). Listing inbound traces for a component or test uses the parent resource's `/traces` subpath.
9. Token security: scope tokens to the smallest set of projects the integration needs — Altium 365 supports per-project ACLs on tokens.

## API Reference

- REST / Python API overview: https://www.altium.com/documentation/altium-365/requirements-systems-portal/rest-python-api-documentation
- Authentication: https://www.altium.com/documentation/altium-365/requirements-systems-portal/rest-python-api-authentication
- Projects, requirements, components: see the same docs index
- Altium 365 platform docs: https://www.altium.com/documentation/altium-365
