---
name: metabase
description: Metabase API for business intelligence. Use when user mentions "Metabase",
  "dashboard", "BI", "SQL query", or data visualization.
vm0_secrets:
  - METABASE_TOKEN
---

# Metabase API

Use the Metabase API via direct `curl` calls to **query data, manage dashboards, cards (questions), collections, databases, and users** on your Metabase instance.

> Official docs: `https://www.metabase.com/docs/latest/api` (live OpenAPI docs available at your instance's `/api/docs`)

---

## When to Use

Use this skill when you need to:

- **Run queries** and retrieve data from connected databases
- **Manage dashboards** and their cards (questions)
- **Create and update cards** (saved questions)
- **Organize content** into collections
- **Manage databases** and their connections
- **Administer users** and permission groups

---

## Prerequisites

1. Log in to your Metabase instance as an admin
2. Go to **Admin** > **Settings** > **Authentication** > **API Keys**
3. Click **Create API Key**
4. Enter a name and select a group for the key
5. Copy the generated API key

```bash
export METABASE_TOKEN="your-api-key"
```

### Base URL

Replace `METABASE_URL` in all examples with your Metabase instance URL (e.g., `https://your-instance.metabase.com`). For Metabase Cloud, this is typically `https://your-instance.metabaseapp.com`.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `METABASE_TOKEN` set. Authentication uses the `x-api-key` header.

---

### 1. Get Current User Info

Retrieve information about the authenticated user.

```bash
bash -c 'curl -s "METABASE_URL/api/user/current" --header "x-api-key: $METABASE_TOKEN"' | jq .
```

---

### 2. List Databases

Retrieve all connected databases.

```bash
bash -c 'curl -s "METABASE_URL/api/database" --header "x-api-key: $METABASE_TOKEN"' | jq '.data[] | {id, name, engine}'
```

---

### 3. Get Database Details

Retrieve details of a specific database including its tables.

```bash
bash -c 'curl -s "METABASE_URL/api/database/DATABASE_ID?include=tables" --header "x-api-key: $METABASE_TOKEN"' | jq .
```

---

### 4. Run a Query (Dataset)

Execute a query and return results. This is the primary endpoint for running queries.

Write to `/tmp/metabase_request.json`:

```json
{
  "database": 1,
  "type": "native",
  "native": {
    "query": "SELECT * FROM orders LIMIT 10"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/dataset" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d @/tmp/metabase_request.json' | jq '{columns: [.data.cols[].name], row_count: .row_count}'
```

---

### 5. List Cards (Saved Questions)

Retrieve all saved questions.

```bash
bash -c 'curl -s "METABASE_URL/api/card" --header "x-api-key: $METABASE_TOKEN"' | jq '.[] | {id, name, display, database_id}'
```

---

### 6. Get Card Details

Retrieve a specific card (question) by ID.

```bash
bash -c 'curl -s "METABASE_URL/api/card/CARD_ID" --header "x-api-key: $METABASE_TOKEN"' | jq '{id, name, display, dataset_query}'
```

---

### 7. Run a Card Query

Execute a saved question and return its results.

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/card/CARD_ID/query" --header "x-api-key: $METABASE_TOKEN"' | jq '{columns: [.data.cols[].name], row_count: .row_count}'
```

---

### 8. Create a Card (Question)

Create a new saved question.

Write to `/tmp/metabase_request.json`:

```json
{
  "name": "Total Orders by Status",
  "dataset_query": {
    "database": 1,
    "type": "native",
    "native": {
      "query": "SELECT status, COUNT(*) as total FROM orders GROUP BY status"
    }
  },
  "display": "table",
  "visualization_settings": {},
  "collection_id": null
}
```

Then run:

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/card" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d @/tmp/metabase_request.json' | jq '{id, name}'
```

---

### 9. Update a Card

Update a saved question's properties.

Write to `/tmp/metabase_request.json`:

```json
{
  "name": "Updated Question Name",
  "description": "Updated description"
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "METABASE_URL/api/card/CARD_ID" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d @/tmp/metabase_request.json' | jq .
```

---

### 10. List Dashboards

Retrieve all dashboards.

```bash
bash -c 'curl -s "METABASE_URL/api/dashboard" --header "x-api-key: $METABASE_TOKEN"' | jq '.[] | {id, name, collection_id}'
```

---

### 11. Get Dashboard Details

Retrieve a dashboard with all its cards.

```bash
bash -c 'curl -s "METABASE_URL/api/dashboard/DASHBOARD_ID" --header "x-api-key: $METABASE_TOKEN"' | jq '{id, name, dashcards: [.dashcards[] | {id, card_id, card: .card.name}]}'
```

---

### 12. Create a Dashboard

Create a new dashboard.

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/dashboard" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d '"'"'{"name":"My Dashboard","collection_id":null}'"'"'' | jq '{id, name}'
```

---

### 13. Add a Card to Dashboard

Add an existing saved question to a dashboard.

Write to `/tmp/metabase_request.json`:

```json
{
  "cardId": 1,
  "row": 0,
  "col": 0,
  "size_x": 6,
  "size_y": 4
}
```

Then run:

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/dashboard/DASHBOARD_ID/cards" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d @/tmp/metabase_request.json' | jq .
```

---

### 14. List Collections

Retrieve all collections (folders for organizing content).

```bash
bash -c 'curl -s "METABASE_URL/api/collection" --header "x-api-key: $METABASE_TOKEN"' | jq '.[] | {id, name, location}'
```

---

### 15. Get Collection Items

Retrieve all items in a specific collection.

```bash
bash -c 'curl -s "METABASE_URL/api/collection/COLLECTION_ID/items" --header "x-api-key: $METABASE_TOKEN"' | jq '.data[] | {id, name, model}'
```

---

### 16. Create a Collection

Create a new collection for organizing dashboards and questions.

```bash
bash -c 'curl -s -X POST "METABASE_URL/api/collection" --header "Content-Type: application/json" --header "x-api-key: $METABASE_TOKEN" -d '"'"'{"name":"My Collection","parent_id":null}'"'"'' | jq '{id, name}'
```

---

### 17. Search

Search across cards, dashboards, and collections.

```bash
bash -c 'curl -s "METABASE_URL/api/search?q=revenue" --header "x-api-key: $METABASE_TOKEN"' | jq '.data[] | {id, name, model, collection}'
```

Filter by model type:

```bash
bash -c 'curl -s "METABASE_URL/api/search?q=revenue&models=card" --header "x-api-key: $METABASE_TOKEN"' | jq '.data[] | {id, name}'
```

---

### 18. List Users

Retrieve all users in the Metabase instance.

```bash
bash -c 'curl -s "METABASE_URL/api/user" --header "x-api-key: $METABASE_TOKEN"' | jq '.data[] | {id, email, first_name, last_name, is_active}'
```

---

### 19. Get Permission Groups

List all permission groups.

```bash
bash -c 'curl -s "METABASE_URL/api/permissions/group" --header "x-api-key: $METABASE_TOKEN"' | jq '.[] | {id, name, member_count}'
```

---

### 20. Get Table Metadata

Retrieve metadata for a specific table including columns and types.

```bash
bash -c 'curl -s "METABASE_URL/api/table/TABLE_ID/query_metadata" --header "x-api-key: $METABASE_TOKEN"' | jq '{name, fields: [.fields[] | {name, base_type, semantic_type}]}'
```

---

## Guidelines

1. **Instance URL**: Replace `METABASE_URL` with your actual Metabase instance URL in all requests
2. **API keys vs sessions**: API keys (via `x-api-key` header) are recommended over session tokens for programmatic access
3. **Database IDs**: Most query operations require a database ID. Use the list databases endpoint to find IDs
4. **Native vs structured queries**: The dataset endpoint supports both `native` (raw SQL) and `query` (structured MBQL) query types
5. **Card terminology**: In the Metabase API, "cards" refer to saved questions, not dashboard cards. Dashboard cards are referred to as "dashcards"
6. **Collection organization**: Use collections to organize dashboards and cards. The root collection has `id: "root"`
7. **Query results format**: Query results include `data.cols` (column metadata) and `data.rows` (row data as arrays)
8. **Live API docs**: Access interactive OpenAPI documentation at your instance's `/api/docs` endpoint for the complete API reference
