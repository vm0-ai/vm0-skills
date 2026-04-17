---
name: db9
description: db9.ai serverless database for AI agents — Postgres-compatible with built-in embeddings, full-text search, vector search, and database branching. Use when the user wants to spin up disposable databases, run SQL, manage tokens, create branches, or query embeddings.
homepage: https://db9.ai
docs: https://db9.ai/docs
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DB9_API_KEY` or `zero doctor check-connector --url https://api.db9.ai/customer/databases --method GET`

## How It Works

db9 is a serverless, Postgres-compatible database built for AI agents. You provision a database in under a second, then either run SQL via the **control-plane REST API** or connect directly over the **Postgres wire protocol (pgwire)** with a short-lived connect token.

```
Account (DB9_API_KEY)
└── Database
    ├── Branch (lightweight fork for experiments)
    ├── Role (tenant-scoped login: tenant_id.role)
    ├── Connect token (db9ck_…) — pgwire access
    ├── Publishable key (db9pk_…) — browser SDK
    └── SQL execution (HTTP or pgwire)
```

Base URL: `https://api.db9.ai`

## Authentication

All requests use Bearer token auth:

```
Authorization: Bearer $DB9_API_KEY
```

The server-side API key is a 128-character hex string (no prefix). Never send it to any domain other than `api.db9.ai`.

## Environment Variables

| Variable | Description |
|---|---|
| `DB9_API_KEY` | db9 server-side API key (128-char hex) |

## Key Endpoints

### 1. Create a Database

Write the payload to `/tmp/db9_create.json`:

```json
{
  "name": "myapp"
}
```

```bash
curl -s -X POST "https://api.db9.ai/customer/databases" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_create.json
```

The response includes the `id` of the new database — use it as `<database-id>` below.

### 2. List Databases

```bash
curl -s "https://api.db9.ai/customer/databases" --header "Authorization: Bearer $DB9_API_KEY"
```

### 3. Run SQL

Write the query to `/tmp/db9_sql.json`:

```json
{
  "query": "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, bio TEXT)"
}
```

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_sql.json
```

### 4. Insert with Parameters

Write `/tmp/db9_insert.json`:

```json
{
  "query": "INSERT INTO users (name, bio) VALUES ($1, $2) RETURNING id",
  "params": ["Alice", "Researcher focused on agent memory"]
}
```

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_insert.json
```

### 5. Semantic Search with Embeddings

db9 ships built-in embedding functions — no external API call needed.

Write `/tmp/db9_search.json`:

```json
{
  "query": "SELECT id, name, bio FROM users ORDER BY EMBED(bio) <=> EMBED($1) LIMIT 5",
  "params": ["machine learning"]
}
```

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_search.json
```

### 6. Create a Branch

Lightweight forks for safe experiments — write `/tmp/db9_branch.json`:

```json
{
  "name": "experiment-1",
  "from": "main"
}
```

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/branches" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_branch.json
```

### 7. Generate a Connect Token (pgwire)

For direct Postgres-protocol access (ORMs, psql, etc.):

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/connect-tokens" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d '{"ttl_seconds": 3600}'
```

The response returns a `db9ck_…` token usable as the Postgres password for `tenant_id.role@db9-server:port`.

### 8. Generate a Publishable Key (browser)

```bash
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/publishable-keys" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d '{"exposed_schemas": ["public"]}'
```

The returned `db9pk_…` key is safe to embed client-side for Browser SDK use.

### 9. Delete a Database

```bash
curl -s -X DELETE "https://api.db9.ai/customer/databases/<database-id>" --header "Authorization: Bearer $DB9_API_KEY"
```

## Common Workflow: One-Shot Database with Semantic Search

```bash
# 1. Provision
curl -s -X POST "https://api.db9.ai/customer/databases" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d '{"name": "notes-demo"}'

# 2. Create schema — replace <database-id>
echo '{"query": "CREATE TABLE notes (id SERIAL PRIMARY KEY, content TEXT)"}' > /tmp/db9_schema.json
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_schema.json

# 3. Insert
echo '{"query": "INSERT INTO notes (content) VALUES ($1)", "params": ["I love distributed systems"]}' > /tmp/db9_insert.json
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_insert.json

# 4. Semantic search
echo '{"query": "SELECT content FROM notes ORDER BY EMBED(content) <=> EMBED($1) LIMIT 3", "params": ["Kubernetes"]}' > /tmp/db9_search.json
curl -s -X POST "https://api.db9.ai/customer/databases/<database-id>/sql" --header "Authorization: Bearer $DB9_API_KEY" --header "Content-Type: application/json" -d @/tmp/db9_search.json
```

## Guidelines

1. The REST API is the control plane (CRUD, SQL execution, branching, tokens). For long-lived connections or ORM integration, prefer pgwire via a connect token.
2. Use branches for destructive experiments — they are cheap and disposable.
3. `EMBED(…)` and pgvector operators (`<=>`, `<->`, `<#>`) work out of the box; no external embedding API required.
4. Never embed `DB9_API_KEY` in client-side code — use a publishable key (`db9pk_…`) for browser access.
