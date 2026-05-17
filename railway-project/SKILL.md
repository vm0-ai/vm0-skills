---
name: railway-project
description: Railway GraphQL API with a project-scoped token for environment-bound automation — redeploy, read deployment status, manage variables inside a single project/environment. Use when the user wants Railway access restricted to one project, or mentions a "Railway project token" or "Project-Access-Token".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name RAILWAY_PROJECT_TOKEN` or `zero doctor check-connector --url https://backboard.railway.com/graphql/v2 --method POST`.

## Authentication

Railway exposes a single GraphQL endpoint. A **project token** is scoped to one environment inside one project, and is sent through a different header than account/workspace tokens:

```
Project-Access-Token: $RAILWAY_PROJECT_TOKEN
```

> Do NOT also send `Authorization: Bearer` — Railway will accept the project token but you should treat the two auth surfaces as mutually exclusive. If you need cross-project or account-level operations, switch to the broader **railway** skill.

## Environment Variables

| Variable | Description |
|---|---|
| `RAILWAY_PROJECT_TOKEN` | Railway project access token, scoped to one project/environment (UUID v4 format) |

## Base URL

`https://backboard.railway.com/graphql/v2` — every operation is a `POST` to this single endpoint.

> Official docs: https://docs.railway.com/reference/public-api

## Scope and Limitations

A project token only grants access to **its own** project + environment. Account-level queries (e.g. `me`, listing other projects, workspace membership) will be rejected or return empty results. The common safe operations with a project token are:

- Reading the project's services, deployments, and variables
- Triggering redeploys
- Upserting variables in the bound environment

## Patterns

- Every request is a `POST` with a JSON body of the form `{ "query": "...", "variables": { ... } }`.
- Write the body to `/tmp/railway_request.json` and reference it with `-d @/tmp/railway_request.json`. Never inline GraphQL strings with shell escaping.
- Railway's connection types use `edges { node { ... } }` cursor pagination.

## Verify Authentication

Project tokens cannot run `me`. Use a `__typename` ping or fetch the project directly. Replace `<project-id>` with the project the token is bound to:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query GetProject($id: String!) { project(id: $id) { id name } }",
  "variables": { "id": "<project-id>" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Discover the Schema

Run introspection against any type to look up exact field names before composing a real query:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "query Introspect($name: String!) { __type(name: $name) { name fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } }",
  "variables": { "name": "Mutation" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

Re-run with `"Query"`, `"Project"`, `"Service"`, `"Deployment"`, etc.

## Deployments

### List Deployments for a Service in the Bound Environment

Replace `<project-id>`, `<environment-id>`, and `<service-id>`:

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
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

### Redeploy a Deployment

Replace `<deployment-id>`:

Write to `/tmp/railway_request.json`:

```json
{
  "query": "mutation Redeploy($id: String!) { deploymentRedeploy(id: $id) { id status } }",
  "variables": { "id": "<deployment-id>" }
}
```

```bash
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
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
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Variables

### Read Variables for a Service

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
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
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
curl -s -X POST "https://backboard.railway.com/graphql/v2" --header "Project-Access-Token: $RAILWAY_PROJECT_TOKEN" --header "Content-Type: application/json" -d @/tmp/railway_request.json
```

## Guidelines

1. A project token authenticates against exactly one project — passing IDs from other projects will return GraphQL errors.
2. Run an introspection query whenever you need a field name you do not already know — the Railway schema evolves and is not versioned.
3. Parse the top-level `errors` array in every response; a 200 status with `errors[]` populated still means the operation failed.
4. Token leak risk: never echo `$RAILWAY_PROJECT_TOKEN` into logs, files, or shell output.
5. If you need cross-project operations or workspace-level queries, switch to the broader **railway** skill, which uses an account/workspace token.
