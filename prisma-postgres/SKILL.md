---
name: prisma-postgres
description: Prisma Postgres API for database. Use when user mentions "Prisma Postgres",
  "Prisma database", or asks about Prisma acceleration.
vm0_secrets:
  - PRISMA_POSTGRES_TOKEN
---

# Prisma Postgres Management API

Manage Prisma Postgres projects, databases, connections, backups, and usage metrics via the Management API.

> Official docs: `https://www.prisma.io/docs/postgres/introduction/management-api`

---

## When to Use

- Create and manage Prisma Postgres projects and databases
- Create and manage database connections (pooled, direct, accelerate)
- List available regions for deploying databases
- View database usage metrics (operations and storage)
- Manage database backups and restore from backups

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Prisma Postgres**. vm0 will automatically inject the required `PRISMA_POSTGRES_TOKEN` environment variable.

To obtain a token manually:

1. Go to [Prisma Console](https://console.prisma.io/)
2. Navigate to your workspace **Settings > Service Tokens**
3. Click **New Service Token** and store the generated token securely

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

---

## Core APIs

### List Projects

```bash
bash -c 'curl -s "https://api.prisma.io/v1/projects" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, name, createdAt}'
```

Docs: https://www.prisma.io/docs/postgres/introduction/management-api

---

### Get Project Details

Replace `<project-id>` with the actual project ID:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/projects/<project-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '{id, name, createdAt}'
```

---

### Create Project

Write to `/tmp/prisma_request.json`:

```json
{
  "name": "my-project",
  "region": "us-east-1",
  "createDatabase": true
}
```

```bash
bash -c 'curl -s -X POST "https://api.prisma.io/v1/projects" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d @/tmp/prisma_request.json' | jq '{id, name, databases}'
```

Available regions can be listed with the regions endpoint below.

---

### Update Project

Replace `<project-id>` with the actual project ID.

Write to `/tmp/prisma_request.json`:

```json
{
  "name": "updated-project-name"
}
```

```bash
bash -c 'curl -s -X PATCH "https://api.prisma.io/v1/projects/<project-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d @/tmp/prisma_request.json' | jq '{id, name}'
```

---

### Delete Project

Replace `<project-id>` with the actual project ID:

```bash
bash -c 'curl -s -X DELETE "https://api.prisma.io/v1/projects/<project-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" -w "\nHTTP Status: %{http_code}\n"'
```

Returns HTTP 204 on success.

---

### List Databases

List all databases, optionally filtered by project:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/databases?projectId=<project-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, name, region, createdAt}'
```

---

### Get Database Details

Replace `<database-id>` with the actual database ID:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/databases/<database-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '{id, name, region, connections}'
```

---

### Create Database

Replace `<project-id>` with the actual project ID.

Write to `/tmp/prisma_request.json`:

```json
{
  "name": "my-database",
  "region": "us-east-1"
}
```

```bash
bash -c 'curl -s -X POST "https://api.prisma.io/v1/projects/<project-id>/databases" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d @/tmp/prisma_request.json' | jq '{id, name, region, connections}'
```

---

### Update Database

Replace `<database-id>` with the actual database ID.

Write to `/tmp/prisma_request.json`:

```json
{
  "name": "renamed-database"
}
```

```bash
bash -c 'curl -s -X PATCH "https://api.prisma.io/v1/databases/<database-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d @/tmp/prisma_request.json' | jq '{id, name}'
```

---

### Delete Database

Replace `<database-id>` with the actual database ID (cannot delete default databases):

```bash
bash -c 'curl -s -X DELETE "https://api.prisma.io/v1/databases/<database-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" -w "\nHTTP Status: %{http_code}\n"'
```

Returns HTTP 204 on success.

---

### List Connections

List all connections for a specific database. Replace `<database-id>`:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/databases/<database-id>/connections" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, name, endpoints}'
```

---

### Create Connection

Create a new connection string for a database. Replace `<database-id>`:

```bash
bash -c 'curl -s -X POST "https://api.prisma.io/v1/databases/<database-id>/connections" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d '"'"'{"name": "my-connection"}'"'"'' | jq '{id, name, endpoints}'
```

The response includes connection strings for direct, pooled, and accelerate endpoints.

---

### Delete Connection

Replace `<connection-id>` with the actual connection ID:

```bash
bash -c 'curl -s -X DELETE "https://api.prisma.io/v1/connections/<connection-id>" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" -w "\nHTTP Status: %{http_code}\n"'
```

Returns HTTP 204 on success.

---

### List Database Backups

Replace `<database-id>` with the actual database ID:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/databases/<database-id>/backups?limit=10" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, createdAt}'
```

---

### Restore Database from Backup

Replace `<target-database-id>` with the database to restore into.

Write to `/tmp/prisma_request.json`:

```json
{
  "source": {
    "type": "backup",
    "databaseId": "<source-database-id>",
    "backupId": "<backup-id>"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.prisma.io/v1/databases/<target-database-id>/restore" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN" --header "Content-Type: application/json" -d @/tmp/prisma_request.json' | jq '{id, name, status}'
```

Cannot restore to default databases.

---

### Get Database Usage Metrics

Replace `<database-id>` with the actual database ID:

```bash
bash -c 'curl -s "https://api.prisma.io/v1/databases/<database-id>/usage?startDate=2025-01-01T00:00:00Z&endDate=2025-01-31T23:59:59Z" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq .
```

Returns operations (ops) and storage (GiB) metrics for the specified period.

---

### List Available Regions

```bash
bash -c 'curl -s "https://api.prisma.io/v1/regions/postgres" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, displayName, status}'
```

---

### List Workspaces

```bash
bash -c 'curl -s "https://api.prisma.io/v1/workspaces" --header "Authorization: Bearer $PRISMA_POSTGRES_TOKEN"' | jq '.[] | {id, name}'
```

---

## Guidelines

1. **Default database**: Projects created with `createDatabase: true` include a default database that cannot be deleted
2. **Regions**: Choose the region closest to your application; databases cannot be moved after creation
3. **Connection types**: Each database connection provides direct, pooled, and accelerate endpoints for different use cases
4. **Backups**: Remote database backups are not supported; use the restore endpoint to restore from existing backups
5. **Pagination**: List endpoints support `cursor` and `limit` query parameters for pagination (default limit: 100)
6. **Rate limits**: API rate limits apply; if you receive HTTP 429, implement exponential backoff
