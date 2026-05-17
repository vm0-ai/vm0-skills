---
name: railway
description: Railway GraphQL API (account/workspace token) for managing projects, services, deployments, environments, and variables. Use when the user mentions "Railway", "railway.com", "railway.app", deploying to Railway, managing Railway projects/services/deployments, or workspace-level Railway operations.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RAILWAY_TOKEN` or `zero doctor check-connector --url https://backboard.railway.com/graphql/v2 --method POST`.

## Authentication

Railway exposes a single GraphQL endpoint. Requests authenticate with an **account** or **workspace** token (use this skill) sent as a Bearer header:

```
Authorization: Bearer $RAILWAY_TOKEN
```

Account tokens span every workspace the user belongs to. Workspace tokens are scoped to a single workspace but expose the same query/mutation surface. For environment-scoped automation use the separate **railway-project** skill instead — it sends `Project-Access-Token` and has different scope rules.

## Environment Variables

| Variable | Description |
|---|---|
| `RAILWAY_TOKEN` | Railway account or workspace token (UUID v4 format) |

## Base URL

`https://backboard.railway.com/graphql/v2` — every operation is a `POST` to this single endpoint.

> Official docs: https://docs.railway.com/reference/public-api

## Patterns

- Every request is a `POST` with a JSON body of the form `{ "query": "...", "variables": { ... } }`.
- Write the body to `/tmp/railway_request.json` and reference it with `-d @/tmp/railway_request.json`. Never inline GraphQL strings with shell escaping.
- Railway's connection types use `edges { node { ... } }` cursor pagination.
- When you do not know the exact field name, run an introspection query first instead of guessing.

## Verify Authentication

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query { me { id name email } }"
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Discover the Schema

Use introspection to look up exact field names, argument types, and enum values before composing a real query.

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query Introspect($name: String!) { __type(name: $name) { name fields { name description args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } }",
  "variables": { "name": "Query" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

Re-run with `"name": "Mutation"`, `"name": "Project"`, `"name": "Service"`, etc. to drill into specific types.

## Projects

### List Projects

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query { projects { edges { node { id name description createdAt } } } }"
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

### Get a Project (with services and environments)

Replace `<project-id>` with the actual project ID:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query GetProject($id: String!) { project(id: $id) { id name description services { edges { node { id name } } } environments { edges { node { id name } } } } }",
  "variables": { "id": "<project-id>" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Deployments

### List Deployments for a Service

Replace `<project-id>`, `<environment-id>`, and `<service-id>` with the actual IDs returned by the project query above:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query Deployments($input: DeploymentListInput!) { deployments(first: 20, input: $input) { edges { node { id status createdAt staticUrl meta } } } }",
  "variables": {
    "input": {
      "projectId": "<project-id>",
      "environmentId": "<environment-id>",
      "serviceId": "<service-id>"
    }
  }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

### Redeploy a Deployment

Replace `<deployment-id>` with the deployment to redeploy:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "mutation Redeploy($id: String!) { deploymentRedeploy(id: $id) { id status } }",
  "variables": { "id": "<deployment-id>" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

### Trigger a New Deployment from Latest

Replace `<service-id>` and `<environment-id>`:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "mutation Trigger($serviceId: String!, $environmentId: String!) { serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId) }",
  "variables": {
    "serviceId": "<service-id>",
    "environmentId": "<environment-id>"
  }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Variables

### Read Variables for a Service Environment

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query Variables($projectId: String!, $environmentId: String!, $serviceId: String!) { variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId) }",
  "variables": {
    "projectId": "<project-id>",
    "environmentId": "<environment-id>",
    "serviceId": "<service-id>"
  }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

### Upsert a Variable

Write to `/tmp/railway_request.json`:

```json
{
  "query": "mutation Upsert($input: VariableUpsertInput!) { variableUpsert(input: $input) }",
  "variables": {
    "input": {
      "projectId": "<project-id>",
      "environmentId": "<environment-id>",
      "serviceId": "<service-id>",
      "name": "FEATURE_FLAG",
      "value": "enabled"
    }
  }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Authorization: Bearer $RAILWAY_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Guidelines

1. Always do an introspection query for the relevant type before building a new query — the schema evolves and Railway does not version its API.
2. Read mutations and queries return Railway-defined error objects in the top-level `errors` array; always parse and surface them rather than assuming a 200 status means success.
3. Token leak risk: never echo `$RAILWAY_TOKEN` into logs, files, or shell output.
4. For tighter blast radius on automation that only touches one project/environment, use the **railway-project** skill instead — its token is scoped and revokable per project.
