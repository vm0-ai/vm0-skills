---
name: neon
description: Neon API for serverless Postgres. Use when user mentions "Neon", "Neon
  database", "serverless Postgres", or asks about Neon projects.
vm0_secrets:
  - NEON_TOKEN
---

# Neon API

Manage serverless Postgres projects, branches, databases, roles, and compute endpoints with the Neon API v2.

> Official docs: `https://api-docs.neon.tech/reference/getting-started`

## When to Use

- Create and manage Neon projects
- Create and manage branches (for dev/preview environments)
- Manage databases and roles within projects
- Start/stop and configure compute endpoints
- Get connection URIs for databases

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Neon**. vm0 will automatically inject the required `NEON_TOKEN` environment variable.


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/neon-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $NEON_TOKEN" "$@"
EOF
chmod +x /tmp/neon-curl
```

**Usage:** All examples below use `/tmp/neon-curl` instead of direct `curl` calls.

## Core APIs

### List Projects

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects" | jq '.projects[] | {id, name, region_id, created_at, pg_version}'
```

Docs: https://api-docs.neon.tech/reference/listprojects

---

### Get Project Details

Replace `<project-id>` with the actual project ID:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>" | jq '.project | {id, name, region_id, pg_version, created_at, store_passwords}'
```

---

### Create Project

Write to `/tmp/neon_request.json`:

```json
{
  "project": {
    "name": "my-new-project",
    "region_id": "aws-us-east-2",
    "pg_version": 16
  }
}
```

```bash
/tmp/neon-curl -X POST "https://console.neon.tech/api/v2/projects" -d @/tmp/neon_request.json | jq '{project: {id: .project.id, name: .project.name}, connection_uris: .connection_uris}'
```

Docs: https://api-docs.neon.tech/reference/createproject

Available regions: `aws-us-east-2`, `aws-us-west-2`, `aws-eu-central-1`, `aws-ap-southeast-1`

---

### Delete Project

Replace `<project-id>` with the actual project ID:

```bash
/tmp/neon-curl -X DELETE "https://console.neon.tech/api/v2/projects/<project-id>" | jq '.project | {id, name}'
```

---

### List Branches

Replace `<project-id>` with the actual project ID:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>/branches" | jq '.branches[] | {id, name, primary, created_at, current_state}'
```

Docs: https://api-docs.neon.tech/reference/listprojectbranches

---

### Create Branch

Replace `<project-id>` with the actual project ID.

Write to `/tmp/neon_request.json`:

```json
{
  "branch": {
    "name": "dev-branch"
  },
  "endpoints": [
    {
      "type": "read_write"
    }
  ]
}
```

```bash
/tmp/neon-curl -X POST "https://console.neon.tech/api/v2/projects/<project-id>/branches" -d @/tmp/neon_request.json | jq '{branch: {id: .branch.id, name: .branch.name}, endpoints: [.endpoints[] | {host: .host, id: .id}]}'
```

---

### Delete Branch

Replace `<project-id>` and `<branch-id>`:

```bash
/tmp/neon-curl -X DELETE "https://console.neon.tech/api/v2/projects/<project-id>/branches/<branch-id>" | jq '.branch | {id, name}'
```

---

### List Databases

Replace `<project-id>` and `<branch-id>`:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>/branches/<branch-id>/databases" | jq '.databases[] | {id, name, owner_name}'
```

---

### Create Database

Replace `<project-id>` and `<branch-id>`.

Write to `/tmp/neon_request.json`:

```json
{
  "database": {
    "name": "mydb",
    "owner_name": "neondb_owner"
  }
}
```

```bash
/tmp/neon-curl -X POST "https://console.neon.tech/api/v2/projects/<project-id>/branches/<branch-id>/databases" -d @/tmp/neon_request.json | jq '.database | {id, name, owner_name}'
```

---

### List Roles

Replace `<project-id>` and `<branch-id>`:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>/branches/<branch-id>/roles" | jq '.roles[] | {name, protected}'
```

---

### List Endpoints (Compute)

Replace `<project-id>`:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>/endpoints" | jq '.endpoints[] | {id, host, branch_id, type, current_state, autoscaling_limit_min_cu, autoscaling_limit_max_cu}'
```

---

### Get Connection URI

Replace `<project-id>` with the actual project ID. Optionally add `database_name` and `role_name` query params:

```bash
/tmp/neon-curl "https://console.neon.tech/api/v2/projects/<project-id>/connection_uri?database_name=neondb&role_name=neondb_owner" | jq '.uri'
```

Docs: https://api-docs.neon.tech/reference/getconnectionuri

---

### Start Endpoint

Replace `<project-id>` and `<endpoint-id>`:

```bash
/tmp/neon-curl -X POST "https://console.neon.tech/api/v2/projects/<project-id>/endpoints/<endpoint-id>/start" | jq '.endpoint | {id, host, current_state}'
```

---

### Suspend Endpoint

Replace `<project-id>` and `<endpoint-id>`:

```bash
/tmp/neon-curl -X POST "https://console.neon.tech/api/v2/projects/<project-id>/endpoints/<endpoint-id>/suspend" | jq '.endpoint | {id, host, current_state}'
```

---

## Guidelines

1. **Branching model**: Neon uses a git-like branching model; every project has a main branch, and you can create dev/preview branches from it
2. **Compute endpoints**: Each branch can have a compute endpoint; endpoints auto-suspend after inactivity
3. **Connection strings**: Use the connection URI endpoint to get ready-to-use Postgres connection strings
4. **Regions**: Choose the region closest to your application; projects cannot be moved after creation
5. **Rate limits**: API rate limits apply; check response headers for remaining quota
6. **Default database**: New projects come with a `neondb` database and `neondb_owner` role
