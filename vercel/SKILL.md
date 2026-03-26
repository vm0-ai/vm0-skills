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


Verify authentication:

```bash
curl -s "https://api.vercel.com/v2/user" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.user | {id, username, email}'
```

---


## How to Use

All examples below assume `VERCEL_TOKEN` is set.

Base URL: `https://api.vercel.com`

---

### 1. Get Current User

Get the authenticated user's profile:

```bash
curl -s "https://api.vercel.com/v2/user" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.user | {id, username, email, name}'
```

---

### 2. List Projects

Get all projects:

```bash
curl -s "https://api.vercel.com/v9/projects" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.projects[] | {id, name, framework, updatedAt}'
```

---

### 3. Get Project Details

Get details for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID from the "List Projects" output.

```bash
curl -s "https://api.vercel.com/v9/projects/my-project" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '{id, name, framework, nodeVersion, buildCommand, outputDirectory}'
```

---

### 4. Create Project

Create a new project:

```bash
curl -s -X POST "https://api.vercel.com/v11/projects" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -H "Content-Type: application/json" -d '{"name":"my-new-project","framework":"nextjs"}' | jq '{id, name, framework}'
```

Only `name` is required. Optional fields: `framework`, `buildCommand`, `outputDirectory`, `rootDirectory`, `installCommand`.

---

### 5. Delete Project

Delete a project:

> **Warning:** This permanently deletes the project and all its deployments.

> **Note:** Replace `my-project` with the project name or ID.

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/my-project" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

Returns `204 No Content` on success.

---

### 6. List Deployments

Get recent deployments:

```bash
curl -s "https://api.vercel.com/v6/deployments?limit=10" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.deployments[] | {uid, name, url, state, created: .created}'
```

---

### 7. List Deployments for a Project

Get deployments for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
curl -s "https://api.vercel.com/v6/deployments?projectId=my-project&limit=10" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.deployments[] | {uid, url, state, created: .created}'
```

---

### 8. Get Deployment Details

Get details for a specific deployment:

> **Note:** Replace `dpl_xxx` with an actual deployment ID from the "List Deployments" output.

```bash
curl -s "https://api.vercel.com/v13/deployments/dpl_xxx" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '{id, url, state, readyState, createdAt, buildingAt, ready}'
```

---

### 9. Get Deployment Build Logs

Get build logs for a deployment:

> **Note:** Replace `dpl_xxx` with an actual deployment ID. Use `limit=-1` to get all logs.

```bash
curl -s "https://api.vercel.com/v3/deployments/dpl_xxx/events?limit=-1" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.[] | select(.type == "command" or .type == "stdout" or .type == "stderr") | {type, text}'
```

---

### 10. Redeploy a Deployment

Trigger a redeployment of a previous deployment:

> **Note:** Replace `my-project` with your project name and `dpl_xxx` with the deployment ID to redeploy.

```bash
curl -s -X POST "https://api.vercel.com/v13/deployments" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -H "Content-Type: application/json" -d '{"name":"my-project","deploymentId":"dpl_xxx","target":"production"}' | jq '{id, url, readyState, target}'
```

Add `"withLatestCommit": true` to force using the latest commit instead of the original deployment's commit.

---

### 11. Promote Deployment to Production

Point all production domains to a specific deployment (rollback):

> **Note:** Replace `prj_xxx` with your project ID and `dpl_xxx` with the deployment ID to promote.

```bash
curl -s -X POST "https://api.vercel.com/v1/projects/prj_xxx/rollback/dpl_xxx" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

Returns `201 Created` on success.

---

### 12. Cancel Deployment

Cancel a deployment that is currently `BUILDING` or `QUEUED`. Deployments already in `READY` state cannot be canceled.

> **Note:** Replace `dpl_xxx` with an actual deployment ID of a building/queued deployment.

```bash
curl -s -X PATCH "https://api.vercel.com/v12/deployments/dpl_xxx/cancel" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '{id, readyState}'
```

---

### 13. List Domains

Get all domains:

```bash
curl -s "https://api.vercel.com/v5/domains" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.domains[] | {name, verified, createdAt}'
```

---

### 14. List Project Domains

Get domains configured for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
curl -s "https://api.vercel.com/v9/projects/my-project/domains" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.domains[] | {name, redirect, gitBranch}'
```

---

### 15. Add Domain to Project

Add a domain to a project:

> **Note:** Replace `my-project` with your project name or ID and `example.com` with the domain to add.

```bash
curl -s -X POST "https://api.vercel.com/v10/projects/my-project/domains" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -H "Content-Type: application/json" -d '{"name":"example.com"}' | jq '{name, verified, verification}'
```

If `verified` is `false`, complete the DNS verification challenge shown in the `verification` array.

---

### 16. Remove Domain from Project

Remove a domain from a project:

> **Note:** Replace `my-project` with your project name or ID and `example.com` with the domain.

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/my-project/domains/example.com" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

---

### 17. List Environment Variables

Get environment variables for a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
curl -s "https://api.vercel.com/v9/projects/my-project/env" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.envs[] | {id, key, target, type}'
```

---

### 18. Create Environment Variable

Add an environment variable to a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
curl -s -X POST "https://api.vercel.com/v10/projects/my-project/env" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -H "Content-Type: application/json" -d '{"key":"MY_VAR","value":"my-value","type":"encrypted","target":["production","preview","development"]}' | jq '.created | {key, target, type}'
```

---

### 19. Delete Environment Variable

Delete an environment variable from a project:

> **Note:** Replace `my-project` with the project name or ID. Get the env var `id` from "List Environment Variables" output.

```bash
curl -s -X DELETE "https://api.vercel.com/v9/projects/my-project/env/xxx" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '{id, key}'
```

---

### 20. List Webhooks

Get all webhooks:

```bash
curl -s "https://api.vercel.com/v1/webhooks" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" | jq '.[] | {id, url, events, projectIds}'
```

---

### 21. Create Webhook

Create a webhook for deployment events:

> **Note:** Replace the `url` with your webhook endpoint. Optionally scope to specific projects with `projectIds`.

```bash
curl -s -X POST "https://api.vercel.com/v1/webhooks" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -H "Content-Type: application/json" -d '{"url":"https://example.com/webhook","events":["deployment.created","deployment.succeeded","deployment.error"]}' | jq '{id, url, events, secret}'
```

The `secret` is only returned at creation time. Save it to verify webhook payloads via the `x-vercel-signature` header.

Common events: `deployment.created`, `deployment.succeeded`, `deployment.error`, `deployment.canceled`, `deployment.ready`, `project.created`, `project.removed`.

---

### 22. Delete Webhook

Delete a webhook:

> **Note:** Replace `hook_xxx` with the webhook ID from "List Webhooks" output.

```bash
curl -s -X DELETE "https://api.vercel.com/v1/webhooks/hook_xxx" -H "Authorization: Bearer $(printenv VERCEL_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
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
