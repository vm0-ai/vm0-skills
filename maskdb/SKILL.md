---
name: maskdb
description: maskdb read-only masked Postgres query gateway. Use when user mentions "maskdb", "masked database", "masked query", or querying a Postgres database through a masked, structured API.
---

maskdb is a read-only REST gateway that turns a Postgres database into a masked, structured query API for AI agents. List databases, tables, schemas, and indexes, then run structured (non-SQL) reads. Masked columns are returned masked and can never be used to filter or sort.

> Official docs: `https://github.com/e7h4n/maskdb`

---

## When to Use

Use this skill when you need to:

- Discover the databases, tables, columns, and indexes an agent token can reach
- Run safe, read-only structured queries against a Postgres database
- Read data without exposing sensitive columns (they come back masked)

---

## Prerequisites

Connect the **maskdb** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name MASKDB_TOKEN` or `zero doctor check-connector --url https://api.maskdb.ai/v1/databases --method GET`

---

## How to Use

All requests are authenticated with `Authorization: Bearer $MASKDB_TOKEN`. The token is a maskdb **agent token** (read-only data plane) and is injected by vm0 from the connected connector. Base URL: `https://api.maskdb.ai`.

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

---

## Guidelines

1. **Read-only:** maskdb is a read-only data plane. There are no write, update, or delete endpoints, and raw SQL is never accepted.
2. **Masked columns:** Columns flagged `masked` in the schema may appear in `select` (returned masked) but using them in `where` or `order_by` is rejected with HTTP 400. Check the schema's `masked`/`filterable` flags before building a query.
3. **Discover first:** Call the schema endpoint before querying so you only reference real, filterable columns.
4. **Pagination:** Use `limit` and `offset` to page through large tables; the response `page` object reports `limit`, `offset`, and `returned`.
