---
name: maskdb
description: maskdb read-only masked Postgres query gateway. Use when user mentions "maskdb", "masked database", "masked query", or querying a Postgres database through a masked, structured API.
---

maskdb is a read-only REST gateway that turns a Postgres database into a masked, structured query API for AI agents. List databases, tables, schemas, and indexes, then run structured (non-SQL) reads or simple aggregate queries. Masked columns are returned masked and can never be used to filter, sort, group, or aggregate.

> Official docs: `https://github.com/e7h4n/maskdb`

---

## When to Use

Use this skill when you need to:

- Discover the databases, tables, columns, and indexes a token can reach
- Run safe, read-only structured queries against a Postgres database
- Run grouped `count` / `sum` aggregate queries over unmasked columns
- Read data without exposing sensitive columns (they come back masked)
- Rotate a registered database connection string when the user explicitly asks and a `db:manage` token is available

---

## Prerequisites

Connect the **maskdb** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name MASKDB_TOKEN` or `zero doctor check-connector --url https://api.maskdb.ai/v1/databases --method GET`

---

## How to Use

All requests are authenticated with `Authorization: Bearer $MASKDB_TOKEN`. The usual token is a maskdb **token** with the `db:query` + `db:metadata` scopes (read-only) and is injected by vm0 from the connected connector. Base URL: `https://api.maskdb.ai`.

Control-plane operations need broader scopes. Only use them when the user explicitly asks for administrative changes and the available token has the matching scope. For example, replacing a database connection string requires `db:manage` and the token must be scoped to that database.

### 1. List Databases

List the databases this token can reach.

```bash
curl -s "https://api.maskdb.ai/v1/databases" --header "Authorization: Bearer $MASKDB_TOKEN"
```

### 2. List Tables

Replace `<database>` with a database name from the previous response.

```bash
curl -s "https://api.maskdb.ai/v1/databases/<database>/tables" --header "Authorization: Bearer $MASKDB_TOKEN"
```

### 3. Get Table Schema

Returns the columns with per-column `masked` and `filterable` flags. Replace `<database>` and `<table>`.

```bash
curl -s "https://api.maskdb.ai/v1/databases/<database>/tables/<table>/schema" --header "Authorization: Bearer $MASKDB_TOKEN"
```

### 4. List Table Indexes

```bash
curl -s "https://api.maskdb.ai/v1/databases/<database>/tables/<table>/indexes" --header "Authorization: Bearer $MASKDB_TOKEN"
```

### 5. Run a Structured Query

maskdb never accepts raw SQL. Build a structured request body and POST it to the query endpoint.

Write to `/tmp/maskdb_query.json`:

```json
{
  "table": "users",
  "select": ["id", "email", "country", "created_at"],
  "where": {
    "and": [
      { "col": "country", "op": "eq", "value": "US" },
      { "col": "created_at", "op": "gte", "value": "2026-01-01" }
    ]
  },
  "order_by": [{ "col": "created_at", "dir": "desc" }],
  "limit": 50,
  "offset": 0
}
```

Then run, replacing `<database>` with the target database:

```bash
curl -s -X POST "https://api.maskdb.ai/v1/databases/<database>/query" --header "Authorization: Bearer $MASKDB_TOKEN" --header "Content-Type: application/json" -d @/tmp/maskdb_query.json
```

The response shape is:

```json
{
  "rows": [{ "id": 1, "email": "j***@e***.com", "country": "US", "created_at": "2026-02-03" }],
  "masked": ["email"],
  "page": { "limit": 50, "offset": 0, "returned": 1 }
}
```

### 6. Filter with a Nested where Node

The `where` node is recursive. A leaf is `{ "col": "...", "op": "...", "value": ... }`; groups are `{ "and": [...] }`, `{ "or": [...] }`, and `{ "not": <node> }`.

Write to `/tmp/maskdb_query.json`:

```json
{
  "table": "orders",
  "select": ["id", "status", "amount"],
  "where": {
    "or": [
      { "col": "status", "op": "eq", "value": "paid" },
      {
        "and": [
          { "col": "status", "op": "eq", "value": "pending" },
          { "col": "amount", "op": "gte", "value": 100 }
        ]
      }
    ]
  },
  "limit": 100
}
```

```bash
curl -s -X POST "https://api.maskdb.ai/v1/databases/<database>/query" --header "Authorization: Bearer $MASKDB_TOKEN" --header "Content-Type: application/json" -d @/tmp/maskdb_query.json
```

### 7. Use the `in` and `is_null` Operators

Write to `/tmp/maskdb_query.json`:

```json
{
  "table": "users",
  "select": ["id", "plan"],
  "where": {
    "and": [
      { "col": "plan", "op": "in", "value": ["pro", "team"] },
      { "col": "deleted_at", "op": "is_null", "value": true }
    ]
  },
  "limit": 25
}
```

```bash
curl -s -X POST "https://api.maskdb.ai/v1/databases/<database>/query" --header "Authorization: Bearer $MASKDB_TOKEN" --header "Content-Type: application/json" -d @/tmp/maskdb_query.json
```

### 8. Run an Aggregate Query

Use the aggregate endpoint for grouped counts and sums. Aggregate queries never accept raw SQL. `where`, `group_by`, `count(col)`, and `sum(col)` can only reference enabled, unmasked columns. Use `count` without `col` for `count(*)`.

Write to `/tmp/maskdb_aggregate.json`:

```json
{
  "table": "orders",
  "where": { "col": "status", "op": "eq", "value": "paid" },
  "group_by": ["country"],
  "metrics": [
    { "op": "count", "as": "orders" },
    { "op": "sum", "col": "amount", "as": "revenue" }
  ],
  "order_by": [{ "col": "revenue", "dir": "desc" }],
  "limit": 50,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.maskdb.ai/v1/databases/<database>/aggregate" --header "Authorization: Bearer $MASKDB_TOKEN" --header "Content-Type: application/json" -d @/tmp/maskdb_aggregate.json
```

The response shape is:

```json
{
  "rows": [{ "country": "US", "orders": "42", "revenue": "1234.56" }],
  "masked": [],
  "page": { "limit": 50, "offset": 0, "returned": 1 }
}
```

---

## Admin: Replace a Database Connection String

Use `PUT /v1/databases/<database>/connection` to rotate or reset the upstream Postgres connection string for an existing database registration.

Requirements:

- The token must have `db:manage`.
- The token must include the target database in its `databases` reach.
- In vm0, the MaskDB firewall permission for this endpoint is `db:manage`, which is denied by default for the standard read-only connector policy.

Write the request body to `/tmp/maskdb_connection.json`:

```json
{
  "connection_string": "postgresql://readonly:REDACTED@host/database?sslmode=require"
}
```

Then run:

```bash
curl -s -X PUT "https://api.maskdb.ai/v1/databases/<database>/connection" --header "Authorization: Bearer $MASKDB_TOKEN" --header "Content-Type: application/json" -d @/tmp/maskdb_connection.json
```

The endpoint validates the replacement by connecting and running `SELECT 1` before saving it. If validation fails, the old encrypted connection string is retained. A successful response looks like:

```json
{
  "ok": true,
  "db_id": "<database>",
  "name": "prod"
}
```

This changes only the encrypted upstream connection string for the existing database id. It does not create a new database registration, change masking policy, or broaden any token's database reach.

---

## Query Reference

| Field | Type | Description |
|-------|------|-------------|
| `table` | string | Table to read (required) |
| `select` | string[] | Columns to return; masked columns are allowed and returned masked |
| `where` | node | Recursive filter node (leaf or `and`/`or`/`not` group) |
| `order_by` | array | List of `{ "col": "...", "dir": "asc" \| "desc" }` |
| `limit` | number | Max rows to return |
| `offset` | number | Rows to skip (pagination) |

**Operators:** `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `in`, `is_null`.

## Aggregate Reference

Use `POST /v1/databases/<database>/aggregate`.

- `table`: table to aggregate (required)
- `where`: optional recursive filter node; same operators as row queries
- `group_by`: optional array of enabled, unmasked columns
- `metrics`: required array of aggregate metrics
- `metrics[].op`: `count` or `sum`
- `metrics[].col`: optional for `count`; required for `sum`
- `metrics[].as`: optional output alias; required when the default alias would not be a simple identifier
- `order_by`: optional list of returned group columns or metric aliases
- `limit`: max groups to return
- `offset`: groups to skip

Aggregate restrictions:

- `where` can only reference enabled, unmasked columns.
- `group_by` can only reference enabled, unmasked columns.
- `count(col)` can only reference enabled, unmasked columns.
- `sum(col)` can only reference enabled, unmasked numeric columns.
- `count(*)` is written as `{ "op": "count" }`.
- Raw expressions, joins, `HAVING`, `DISTINCT`, and aggregates over masked columns are not supported.

---

## Guidelines

1. **Read-only data plane:** maskdb queries are read-only. There are no row write, update, or delete endpoints, and raw SQL is never accepted. Control-plane endpoints such as connection-string replacement require explicit administrative scopes.
2. **Masked columns:** Columns flagged `masked` in the schema may appear in row-query `select` (returned masked) but using them in `where`, `order_by`, `group_by`, `count(col)`, or `sum(col)` is rejected with HTTP 400. Check the schema's `masked`/`filterable` flags before building a query.
3. **Discover first:** Call the schema endpoint before querying so you only reference real, filterable columns.
4. **Pagination:** Use `limit` and `offset` to page through large tables; the response `page` object reports `limit`, `offset`, and `returned`.
