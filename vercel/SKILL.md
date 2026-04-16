---
name: vercel
description: Vercel API for deployments. Use when user mentions "Vercel", "vercel.app",
  "vercel.com", shares a Vercel link, "deploy", or asks about hosting.
---

# Vercel API

Manage projects, deployments, domains, environment variables, edge config, teams, and webhooks via the Vercel REST API.

> Official docs: https://vercel.com/docs/rest-api

---

## When to Use

Use this skill when you need to:

- List and manage projects
- Monitor, redeploy, promote, and cancel deployments
- Manage domains and DNS records
- Handle environment variables
- Manage Edge Config stores
- Configure teams and members
- Manage webhooks and log drains

---

## Prerequisites

Connect Vercel via the vm0 connector. The access token is provided as `$VERCEL_TOKEN`.

Base URL: `https://api.vercel.com`

---

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name VERCEL_TOKEN` or `zero doctor check-connector --url https://api.vercel.com/v2/user --method GET`

## User

### Get Current User

```bash
curl -s "https://api.vercel.com/v2/user" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### List Auth Tokens

```bash
curl -s "https://api.vercel.com/v6/user/tokens" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Projects

### List Projects

```bash
curl -s "https://api.vercel.com/v10/projects" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Project

```bash
curl -s "https://api.vercel.com/v9/projects/<project-name>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

Use project name or ID.

### Create Project

```bash
curl -s -X POST "https://api.vercel.com/v11/projects" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"my-new-project\", \"framework\": \"nextjs\"}"
```

Only `name` is required. Optional: `framework`, `buildCommand`, `outputDirectory`, `rootDirectory`, `installCommand`.

### Update Project

```bash
curl -s -X PATCH "https://api.vercel.com/v9/projects/<project-name>" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"buildCommand\": \"next build\", \"outputDirectory\": \".next\"}"
```

### Delete Project

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/<project-name>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

Returns 204 on success. Permanently deletes the project and all its deployments.

### Pause Project

```bash
curl -s -X POST "https://api.vercel.com/v1/projects/<project-id>/pause" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Unpause Project

```bash
curl -s -X POST "https://api.vercel.com/v1/projects/<project-id>/unpause" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Deployments

### List Deployments

```bash
curl -s "https://api.vercel.com/v6/deployments?limit=10" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

Params: `limit`, `projectId`, `state` (BUILDING/READY/ERROR/QUEUED/CANCELED), `target` (production/preview), `until` (pagination timestamp).

### List Deployments for a Project

```bash
curl -s "https://api.vercel.com/v6/deployments?projectId=<project-name>&limit=10" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Deployment

```bash
curl -s "https://api.vercel.com/v13/deployments/<deployment-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Build Logs

```bash
curl -s "https://api.vercel.com/v3/deployments/<deployment-id>/events?limit=-1" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

Use `limit=-1` to get all log events.

### Get Runtime Logs

```bash
curl -s "https://api.vercel.com/v1/projects/<project-id>/deployments/<deployment-id>/runtime-logs" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Deployment (Redeploy)

```bash
curl -s -X POST "https://api.vercel.com/v13/deployments" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"my-project\", \"deploymentId\": \"<prev-deployment-id>\", \"target\": \"production\"}"
```

### Promote to Production (Rollback)

```bash
curl -s -X POST "https://api.vercel.com/v10/projects/<project-id>/promote/<deployment-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Cancel Deployment

Only works for BUILDING or QUEUED deployments.

```bash
curl -s -X PATCH "https://api.vercel.com/v12/deployments/<deployment-id>/cancel" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Delete Deployment

```bash
curl -s -X DELETE "https://api.vercel.com/v13/deployments/<deployment-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### List Deployment Aliases

```bash
curl -s "https://api.vercel.com/v2/deployments/<deployment-id>/aliases" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Domains

### List Domains

```bash
curl -s "https://api.vercel.com/v5/domains" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Domain

```bash
curl -s "https://api.vercel.com/v5/domains/<domain>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Domain Config

```bash
curl -s "https://api.vercel.com/v6/domains/<domain>/config" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Add Domain

```bash
curl -s -X POST "https://api.vercel.com/v7/domains" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"example.com\"}"
```

### Update Domain

```bash
curl -s -X PATCH "https://api.vercel.com/v3/domains/<domain>" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"op\": \"update\", \"redirectTarget\": \"www.example.com\"}"
```

### Delete Domain

```bash
curl -s -X DELETE "https://api.vercel.com/v6/domains/<domain>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Project Domains

### List Project Domains

```bash
curl -s "https://api.vercel.com/v9/projects/<project-name>/domains" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Add Domain to Project

```bash
curl -s -X POST "https://api.vercel.com/v10/projects/<project-name>/domains" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"example.com\"}"
```

### Verify Project Domain

```bash
curl -s -X POST "https://api.vercel.com/v9/projects/<project-name>/domains/<domain>/verify" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Update Project Domain

```bash
curl -s -X PATCH "https://api.vercel.com/v9/projects/<project-name>/domains/<domain>" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"redirect\": \"www.example.com\", \"redirectStatusCode\": 301}"
```

### Remove Domain from Project

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/<project-name>/domains/<domain>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## DNS Records

### List DNS Records

```bash
curl -s "https://api.vercel.com/v5/domains/<domain>/records" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create DNS Record

```bash
curl -s -X POST "https://api.vercel.com/v2/domains/<domain>/records" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"www\", \"type\": \"CNAME\", \"value\": \"cname.vercel-dns.com\"}"
```

### Delete DNS Record

```bash
curl -s -X DELETE "https://api.vercel.com/v2/domains/<domain>/records/<record-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Environment Variables

### List Project Env Vars

```bash
curl -s "https://api.vercel.com/v10/projects/<project-name>/env" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Env Var

```bash
curl -s "https://api.vercel.com/v1/projects/<project-name>/env/<env-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Env Var

```bash
curl -s -X POST "https://api.vercel.com/v10/projects/<project-name>/env" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"key\": \"MY_VAR\", \"value\": \"my-value\", \"type\": \"encrypted\", \"target\": [\"production\", \"preview\", \"development\"]}"
```

`type`: `plain`, `encrypted`, `secret`, `sensitive`. `target`: `production`, `preview`, `development`.

### Update Env Var

```bash
curl -s -X PATCH "https://api.vercel.com/v9/projects/<project-name>/env/<env-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"value\": \"new-value\", \"target\": [\"production\"]}"
```

### Delete Env Var

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/<project-name>/env/<env-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Edge Config

### List Edge Configs

```bash
curl -s "https://api.vercel.com/v1/edge-config" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Edge Config

```bash
curl -s "https://api.vercel.com/v1/edge-config/<edge-config-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Edge Config

```bash
curl -s -X POST "https://api.vercel.com/v1/edge-config" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"slug\": \"my-edge-config\"}"
```

### Update Edge Config Items

```bash
curl -s -X PATCH "https://api.vercel.com/v1/edge-config/<edge-config-id>/items" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"items\": [{\"operation\": \"upsert\", \"key\": \"greeting\", \"value\": \"hello\"}]}"
```

Operations: `upsert`, `delete`.

### Get Edge Config Items

```bash
curl -s "https://api.vercel.com/v1/edge-config/<edge-config-id>/items" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Single Item

```bash
curl -s "https://api.vercel.com/v1/edge-config/<edge-config-id>/item/<key>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Delete Edge Config

```bash
curl -s -X DELETE "https://api.vercel.com/v1/edge-config/<edge-config-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Teams

### List Teams

```bash
curl -s "https://api.vercel.com/v2/teams" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Team

```bash
curl -s "https://api.vercel.com/v2/teams/<team-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Team

```bash
curl -s -X POST "https://api.vercel.com/v1/teams" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"slug\": \"my-team\", \"name\": \"My Team\"}"
```

### Update Team

```bash
curl -s -X PATCH "https://api.vercel.com/v2/teams/<team-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Updated Team Name\"}"
```

### List Team Members

```bash
curl -s "https://api.vercel.com/v3/teams/<team-id>/members" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Invite Team Member

```bash
curl -s -X POST "https://api.vercel.com/v2/teams/<team-id>/members" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"email\": \"user@example.com\", \"role\": \"MEMBER\"}"
```

Roles: `OWNER`, `MEMBER`, `VIEWER`, `DEVELOPER`, `BILLING`.

### Remove Team Member

```bash
curl -s -X DELETE "https://api.vercel.com/v1/teams/<team-id>/members/<uid>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Webhooks

### List Webhooks

```bash
curl -s "https://api.vercel.com/v1/webhooks" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Webhook

```bash
curl -s "https://api.vercel.com/v1/webhooks/<webhook-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Webhook

```bash
curl -s -X POST "https://api.vercel.com/v1/webhooks" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"url\": \"https://example.com/webhook\", \"events\": [\"deployment.created\", \"deployment.succeeded\", \"deployment.error\"]}"
```

Common events: `deployment.created`, `deployment.succeeded`, `deployment.error`, `deployment.canceled`, `deployment.ready`, `project.created`, `project.removed`.

The `secret` is only returned at creation time — save it to verify webhook payloads.

### Delete Webhook

```bash
curl -s -X DELETE "https://api.vercel.com/v1/webhooks/<webhook-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Log Drains

### List Log Drains

```bash
curl -s "https://api.vercel.com/v1/log-drains" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Create Log Drain

```bash
curl -s -X POST "https://api.vercel.com/v1/log-drains" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"My Drain\", \"type\": \"json\", \"url\": \"https://example.com/logs\", \"sources\": [\"static\", \"lambda\", \"edge\", \"build\"]}"
```

`type`: `json`, `ndjson`, `syslog`. `sources`: `static`, `lambda`, `edge`, `build`, `external`.

### Delete Log Drain

```bash
curl -s -X DELETE "https://api.vercel.com/v1/log-drains/<id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Aliases

### List Aliases

```bash
curl -s "https://api.vercel.com/v4/aliases" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Get Alias

```bash
curl -s "https://api.vercel.com/v4/aliases/<alias-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Assign Alias to Deployment

```bash
curl -s -X POST "https://api.vercel.com/v2/deployments/<deployment-id>/aliases" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"alias\": \"my-alias.vercel.app\"}"
```

### Delete Alias

```bash
curl -s -X DELETE "https://api.vercel.com/v2/aliases/<alias-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Certificates

### Get Certificate

```bash
curl -s "https://api.vercel.com/v8/certs/<cert-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

### Issue Certificate

```bash
curl -s -X POST "https://api.vercel.com/v8/certs" \
  --header "Authorization: Bearer $VERCEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"domains\": [\"example.com\"]}"
```

### Delete Certificate

```bash
curl -s -X DELETE "https://api.vercel.com/v8/certs/<cert-id>" \
  --header "Authorization: Bearer $VERCEL_TOKEN"
```

---

## Deployment States

| State | Description |
|-------|-------------|
| `QUEUED` | Waiting to build |
| `BUILDING` | Build in progress |
| `READY` | Deployment is live |
| `ERROR` | Build or deployment failed |
| `CANCELED` | Deployment was canceled |

---

## Guidelines

1. **Pagination**: Use `?limit=N&until=<timestamp>` for paginated results. The `until` value comes from the last item's timestamp.
2. **Project references**: Most endpoints accept project name or project ID as `{idOrName}`.
3. **API versioning**: Vercel uses per-endpoint versioning (e.g., `/v10/projects`, `/v13/deployments`). Always use the version shown in this document.
4. **Rate limits**: Back off on 429 responses. Use `Retry-After` header.
5. **Team scope**: For team resources, add `?teamId=<team-id>` query param or use team tokens.
6. **Environment targets**: Env vars can target `production`, `preview`, `development`, or any combination.
7. **Edge Config**: Use Edge Config for feature flags and runtime configuration that needs to be read at the edge with zero latency.

---

## How to Look Up More API Details

- **REST API Reference**: https://vercel.com/docs/rest-api
- **Endpoints**: https://vercel.com/docs/rest-api/endpoints
- **Authentication**: https://vercel.com/docs/rest-api/authentication
- **Edge Config**: https://vercel.com/docs/edge-config
- **Webhooks**: https://vercel.com/docs/webhooks
