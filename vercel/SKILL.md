---
name: vercel
description: Vercel API via curl. Use this skill to manage deployments, projects, domains, and environment variables on Vercel.
vm0_secrets:
  - VERCEL_TOKEN
---

# Vercel API

Use the Vercel API via direct `curl` calls to manage **deployments, projects, domains, and environment variables**.

> Official docs: `https://vercel.com/docs/rest-api`

---

## When to Use

Use this skill when you need to:

- **List and manage projects** - view, create, and configure projects
- **Monitor deployments** - list deployments and check their status
- **Manage domains** - list, add, and configure domains
- **Handle environment variables** - create, update, and delete env vars
- **View teams** - list teams and team members

---

## Prerequisites

1. Connect your Vercel account at [vm0 Settings > Connectors](https://app.vm0.ai/settings/connectors) and click **vercel**
2. The `VERCEL_TOKEN` environment variable is automatically configured

Verify authentication:

```bash
bash -c 'curl -s "https://api.vercel.com/v2/user" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.user | {id, username, email}'
```

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"'
> ```

## How to Use

All examples below assume `VERCEL_TOKEN` is set.

Base URL: `https://api.vercel.com`

---

### 1. Get Current User

Get the authenticated user's profile:

```bash
bash -c 'curl -s "https://api.vercel.com/v2/user" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.user | {id, username, email, name}'
```

---

### 2. List Projects

Get all projects:

```bash
bash -c 'curl -s "https://api.vercel.com/v9/projects" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.projects[] | {id, name, framework, updatedAt}'
```

---

### 3. Get Project Details

Get details for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID from the "List Projects" output.

```bash
PROJECT=my-project bash -c 'curl -s "https://api.vercel.com/v9/projects/$PROJECT" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '{id, name, framework, nodeVersion, buildCommand, outputDirectory}'
```

---

### 4. List Deployments

Get recent deployments:

```bash
bash -c 'curl -s "https://api.vercel.com/v6/deployments?limit=10" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.deployments[] | {uid, name, url, state, created: .created}'
```

---

### 5. List Deployments for a Project

Get deployments for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project bash -c 'curl -s "https://api.vercel.com/v6/deployments?projectId=$PROJECT&limit=10" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.deployments[] | {uid, url, state, created: .created}'
```

---

### 6. Get Deployment Details

Get details for a specific deployment:

> **Note:** Replace `dpl_xxx` with an actual deployment ID from the "List Deployments" output.

```bash
DEPLOY_ID=dpl_xxx bash -c 'curl -s "https://api.vercel.com/v13/deployments/$DEPLOY_ID" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '{id, url, state, readyState, createdAt, buildingAt, ready}'
```

---

### 7. List Domains

Get all domains:

```bash
bash -c 'curl -s "https://api.vercel.com/v5/domains" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.domains[] | {name, verified, createdAt}'
```

---

### 8. List Project Domains

Get domains configured for a specific project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project bash -c 'curl -s "https://api.vercel.com/v9/projects/$PROJECT/domains" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.domains[] | {name, redirect, gitBranch}'
```

---

### 9. List Environment Variables

Get environment variables for a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project bash -c 'curl -s "https://api.vercel.com/v9/projects/$PROJECT/env" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.envs[] | {key, target, type}'
```

---

### 10. Create Environment Variable

Add an environment variable to a project:

> **Note:** Replace `my-project` with your actual project name or ID.

```bash
PROJECT=my-project bash -c 'curl -s -X POST "https://api.vercel.com/v10/projects/$PROJECT/env" -H "Authorization: Bearer $VERCEL_TOKEN" -H "Content-Type: application/json" -d "{\"key\":\"MY_VAR\",\"value\":\"my-value\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\",\"development\"]}"' | jq '.created | {key, target, type}'
```

---

### 11. List Teams

Get all teams you belong to:

```bash
bash -c 'curl -s "https://api.vercel.com/v2/teams" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '.teams[] | {id, slug, name, createdAt}'
```

---

### 12. Cancel Deployment

Cancel a deployment that is currently `BUILDING` or `QUEUED`. Deployments already in `READY` state cannot be canceled.

> **Note:** Replace `dpl_xxx` with an actual deployment ID of a building/queued deployment.

```bash
DEPLOY_ID=dpl_xxx bash -c 'curl -s -X PATCH "https://api.vercel.com/v12/deployments/$DEPLOY_ID/cancel" -H "Authorization: Bearer $VERCEL_TOKEN"' | jq '{id, readyState}'
```

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

1. **Team scope**: For team resources, add `?teamId=<team-id>` to requests
2. **Pagination**: Use `?limit=N&until=<timestamp>` for paginated results
3. **Rate limits**: Vercel has rate limits; implement backoff for 429 responses
4. **Project references**: You can use either project ID or project name in most endpoints
