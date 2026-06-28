---
name: render
description: Render API for managing PaaS services, deploys, environment groups, databases, logs, metrics, and workspaces. Use when user mentions "Render", "render.com", "PaaS", "deploy service", "trigger deploy", or managing hosted apps on Render.
---

# Render

Use the Render API to inspect and manage services, deploys, environment variables, projects, databases, logs, metrics, and workspace resources.

> Official docs: `https://render.com/docs/api`

---

## When to Use

Use this skill when you need to:

- List or inspect Render services and workspaces
- Trigger or inspect deploys for Render services
- Read service environment variables, environment groups, logs, and operational metadata

---

## Prerequisites

Connect the **Render** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name RENDER_API_KEY` or `zero doctor check-connector --url https://api.render.com/v1/users --method GET`

---

## Authentication

All requests use the Render API key as a Bearer token:

```bash
curl -s "https://api.render.com/v1/users" --header "Authorization: Bearer $RENDER_API_KEY"
```

Render API keys can access every workspace and service available to the Render account that created the key.

---

## How to Use

### 1. Get the Authenticated User

Use this as a lightweight connection check.

```bash
curl -s "https://api.render.com/v1/users" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 2. List Workspaces

```bash
curl -s "https://api.render.com/v1/owners" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 3. List Services

```bash
curl -s "https://api.render.com/v1/services" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 4. Retrieve a Service

Replace `<service-id>` with the service ID from `GET /services`.

```bash
curl -s "https://api.render.com/v1/services/<service-id>" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 5. List Deploys for a Service

```bash
curl -s "https://api.render.com/v1/services/<service-id>/deploys" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 6. Trigger a Deploy

Write to `/tmp/render_deploy_request.json`:

```json
{
  "clearCache": "do_not_clear"
}
```

Then run:

```bash
curl -s -X POST "https://api.render.com/v1/services/<service-id>/deploys" --header "Authorization: Bearer $RENDER_API_KEY" --header "Content-Type: application/json" -d @/tmp/render_deploy_request.json
```

Set `clearCache` to `clear` only when deliberately rebuilding without Render's build cache.

### 7. Retrieve a Deploy

```bash
curl -s "https://api.render.com/v1/services/<service-id>/deploys/<deploy-id>" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 8. List Service Environment Variables

```bash
curl -s "https://api.render.com/v1/services/<service-id>/env-vars" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 9. List Environment Groups

```bash
curl -s "https://api.render.com/v1/env-groups" --header "Authorization: Bearer $RENDER_API_KEY"
```

### 10. List Log Label Values

Use this to discover available log labels before querying logs.

```bash
curl -s "https://api.render.com/v1/logs/values" --header "Authorization: Bearer $RENDER_API_KEY"
```

---

## Guidelines

1. Treat the API key as broad account access; prefer a Render user or workspace role with only the access needed for the task.
2. Use `GET /users` first when diagnosing auth failures.
3. Use IDs returned by list endpoints (`<service-id>`, `<deploy-id>`, `<owner-id>`) instead of names when calling resource-specific endpoints.
4. Trigger deploys carefully; deploy requests affect live services unless the target service is a preview or staging service.
5. For endpoints not covered here, consult the official API reference and keep the same `Authorization: Bearer $RENDER_API_KEY` header.
