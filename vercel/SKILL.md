---
name: vercel
description: Vercel API for deployments. Use when user mentions "Vercel", "vercel.app",
  "vercel.com", shares a Vercel link, "deploy", or asks about hosting.
vm0_secrets:
  - VERCEL_TOKEN
---

# Vercel API

Use the Vercel API via direct `curl` calls to manage **deployments, projects, domains, environment variables, and webhooks**.

> Official docs: `https://vercel.com/docs/rest-api`

---

## When to Use

Use this skill when you need to:

- **List and manage projects** - view, create, delete, and configure projects
- **Monitor and control deployments** - list, redeploy, promote to production, cancel, and view build logs
- **Manage domains** - list, add, and remove domains from projects
- **Handle environment variables** - list, create, and delete env vars
- **Manage webhooks** - create, list, and delete webhooks for deployment events

---

## Prerequisites

1. Connect your Vercel account at [vm0 Settings > Connectors](https://app.vm0.ai/settings/connectors) and click **vercel**
2. The `VERCEL_TOKEN` environment variable is automatically configured

Verify authentication:

```bash
/tmp/vercel-curl "https://api.vercel.com/v2/user" | jq '.user | {id, username, email}'
```

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/vercel-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $VERCEL_TOKEN" "$@"
EOF
chmod +x /tmp/vercel-curl
```

**Usage:** All examples below use `/tmp/vercel-curl` instead of direct `curl` calls.

## How to Use

All examples below assume `VERCEL_TOKEN` is set.

Base URL: `https://api.vercel.com`

---

### 1. Get Current User

Get the authenticated user's profile:

```bash
/tmp/vercel-curl "https://api.vercel.com/v2/user" | jq '.user | {id, username, email, name}'
```

---

### 2. List Projects

Get all projects:

```bash
/tmp/vercel-curl "https://api.vercel.com/v9/projects" | jq '.projects[] | {id, name, framework, updatedAt}'
```

---

### 3. Get Project Details

Get details for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID from the "List Projects" output.

```bash
PROJECT=my-project /tmp/vercel-curl "https://api.vercel.com/v9/projects/$PROJECT" | jq '{id, name, framework, nodeVersion, buildCommand, outputDirectory}'
```

---

### 4. Create Project

Create a new project:

```bash
/tmp/vercel-curl -X POST "https://api.vercel.com/v11/projects" | jq '{id, name, framework}'
```

Only `name` is required. Optional fields: `framework`, `buildCommand`, `outputDirectory`, `rootDirectory`, `installCommand`.

---

### 5. Delete Project

Delete a project:

> **Warning:** This permanently deletes the project and all its deployments.

> **Note:** Replace `my-project` with the project name or ID.

```bash
PROJECT=my-project /tmp/vercel-curl -X DELETE "https://api.vercel.com/v9/projects/$PROJECT"
```

Returns `204 No Content` on success.

---

### 6. List Deployments

Get recent deployments:

```bash
/tmp/vercel-curl "https://api.vercel.com/v6/deployments?limit=10" | jq '.deployments[] | {uid, name, url, state, created: .created}'
```

---

### 7. List Deployments for a Project

Get deployments for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project /tmp/vercel-curl "https://api.vercel.com/v6/deployments?projectId=$PROJECT&limit=10" | jq '.deployments[] | {uid, url, state, created: .created}'
```

---

### 8. Get Deployment Details

Get details for a specific deployment:

> **Note:** Replace `dpl_xxx` with an actual deployment ID from the "List Deployments" output.

```bash
DEPLOY_ID=dpl_xxx /tmp/vercel-curl "https://api.vercel.com/v13/deployments/$DEPLOY_ID" | jq '{id, url, state, readyState, createdAt, buildingAt, ready}'
```

---

### 9. Get Deployment Build Logs

Get build logs for a deployment:

> **Note:** Replace `dpl_xxx` with an actual deployment ID. Use `limit=-1` to get all logs.

```bash
DEPLOY_ID=dpl_xxx /tmp/vercel-curl "https://api.vercel.com/v3/deployments/$DEPLOY_ID/events?limit=-1" | jq '.[] | select(.type == "command" or .type == "stdout" or .type == "stderr") | {type, text}'
```

---

### 10. Redeploy a Deployment

Trigger a redeployment of a previous deployment:

> **Note:** Replace `my-project` with your project name and `dpl_xxx` with the deployment ID to redeploy.

```bash
PROJECT=my-project DEPLOY_ID=dpl_xxx /tmp/vercel-curl -X POST "https://api.vercel.com/v13/deployments" | jq '{id, url, readyState, target}'
```

Add `"withLatestCommit": true` to force using the latest commit instead of the original deployment's commit.

---

### 11. Promote Deployment to Production

Point all production domains to a specific deployment (rollback):

> **Note:** Replace `prj_xxx` with your project ID and `dpl_xxx` with the deployment ID to promote.

```bash
PROJECT_ID=prj_xxx DEPLOY_ID=dpl_xxx /tmp/vercel-curl -X POST "https://api.vercel.com/v1/projects/$PROJECT_ID/rollback/$DEPLOY_ID"
```

Returns `201 Created` on success.

---

### 12. Cancel Deployment

Cancel a deployment that is currently `BUILDING` or `QUEUED`. Deployments already in `READY` state cannot be canceled.

> **Note:** Replace `dpl_xxx` with an actual deployment ID of a building/queued deployment.

```bash
DEPLOY_ID=dpl_xxx /tmp/vercel-curl -X PATCH "https://api.vercel.com/v12/deployments/$DEPLOY_ID/cancel" | jq '{id, readyState}'
```

---

### 13. List Domains

Get all domains:

```bash
/tmp/vercel-curl "https://api.vercel.com/v5/domains" | jq '.domains[] | {name, verified, createdAt}'
```

---

### 14. List Project Domains

Get domains configured for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project /tmp/vercel-curl "https://api.vercel.com/v9/projects/$PROJECT/domains" | jq '.domains[] | {name, redirect, gitBranch}'
```

---

### 15. Add Domain to Project

Add a domain to a project:

> **Note:** Replace `my-project` with your project name or ID and `example.com` with the domain to add.

```bash
PROJECT=my-project /tmp/vercel-curl -X POST "https://api.vercel.com/v10/projects/$PROJECT/domains" | jq '{name, verified, verification}'
```

If `verified` is `false`, complete the DNS verification challenge shown in the `verification` array.

---

### 16. Remove Domain from Project

Remove a domain from a project:

> **Note:** Replace `my-project` with your project name or ID and `example.com` with the domain.

```bash
PROJECT=my-project DOMAIN=example.com /tmp/vercel-curl -X DELETE "https://api.vercel.com/v9/projects/$PROJECT/domains/$DOMAIN"
```

---

### 17. List Environment Variables

Get environment variables for a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project /tmp/vercel-curl "https://api.vercel.com/v9/projects/$PROJECT/env" | jq '.envs[] | {id, key, target, type}'
```

---

### 18. Create Environment Variable

Add an environment variable to a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project /tmp/vercel-curl -X POST "https://api.vercel.com/v10/projects/$PROJECT/env" | jq '.created | {key, target, type}'
```

---

### 19. Delete Environment Variable

Delete an environment variable from a project:

> **Note:** Replace `my-project` with the project name or ID. Get the env var `id` from "List Environment Variables" output.

```bash
PROJECT=my-project ENV_ID=xxx /tmp/vercel-curl -X DELETE "https://api.vercel.com/v9/projects/$PROJECT/env/$ENV_ID" | jq '{id, key}'
```

---

### 20. List Webhooks

Get all webhooks:

```bash
/tmp/vercel-curl "https://api.vercel.com/v1/webhooks" | jq '.[] | {id, url, events, projectIds}'
```

---

### 21. Create Webhook

Create a webhook for deployment events:

> **Note:** Replace the `url` with your webhook endpoint. Optionally scope to specific projects with `projectIds`.

```bash
/tmp/vercel-curl -X POST "https://api.vercel.com/v1/webhooks" | jq '{id, url, events, secret}'
```

The `secret` is only returned at creation time. Save it to verify webhook payloads via the `x-vercel-signature` header.

Common events: `deployment.created`, `deployment.succeeded`, `deployment.error`, `deployment.canceled`, `deployment.ready`, `project.created`, `project.removed`.

---

### 22. Delete Webhook

Delete a webhook:

> **Note:** Replace `hook_xxx` with the webhook ID from "List Webhooks" output.

```bash
HOOK_ID=hook_xxx /tmp/vercel-curl -X DELETE "https://api.vercel.com/v1/webhooks/$HOOK_ID"
```

Returns `204 No Content` on success.

---

## Deployment States

| State | Description |
|-------|-------------|
| `BUILDING` | Build in progress |
| `READY` | Deployment is live |
| `ERROR` | Build or deployment failed |
| `CANCELED` | Deployment was canceled |
| `QUEUED` | Waiting to build |

---

## Guidelines

1. **Pagination**: Use `?limit=N&until=<timestamp>` for paginated results
2. **Rate limits**: Vercel has rate limits; implement backoff for 429 responses
3. **Project references**: You can use either project ID or project name in most endpoints
