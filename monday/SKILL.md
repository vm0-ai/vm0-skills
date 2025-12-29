---
name: monday
description: Monday.com GraphQL API via curl. Use this skill to manage boards, items, and projects.
vm0_env:
  - MONDAY_API_KEY
---

# Monday.com API

Use the Monday.com GraphQL API via direct `curl` calls to **manage boards, items, and project data**.

> Official docs: `https://developer.monday.com/api-reference/`

---

## When to Use

Use this skill when you need to:

- **Query boards and items** from Monday.com
- **Create, update, or delete items** in boards
- **Manage board columns and groups**
- **Sync data** between Monday.com and other systems
- **Automate project workflows**

---

## Prerequisites

1. Log in to [Monday.com](https://monday.com/)
2. Go to your avatar → Developers → My Access Tokens
3. Generate a new API token
4. Store it in the environment variable `MONDAY_API_KEY`

```bash
export MONDAY_API_KEY="your-api-token"
```

### API Info

- GraphQL endpoint: `https://api.monday.com/v2`
- All requests are POST
- Requires `Authorization` header with API token
- Requires `API-Version` header (use `2024-10`)

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## How to Use

All examples below assume you have `MONDAY_API_KEY` set.

---

### 1. Get Current User

Query the authenticated user's info:

Write to `/tmp/monday_request.json`:

```json
{
  "query": "query { me { id name email } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

---

### 2. List All Boards

Get all boards in your account:

Write to `/tmp/monday_request.json`:

```json
{
  "query": "query { boards (limit: 10) { id name state items_count } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

---

### 3. Get Board Details

Get a specific board with its groups and columns:

```bash
BOARD_ID="1234567890"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "query { boards (ids: ${BOARD_ID}) { id name groups { id title } columns { id title type } } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:** Replace `BOARD_ID` with an actual board ID from the "List All Boards" response (example 2).

---

### 4. Get Items from a Board

Get items (rows) from a specific board:

```bash
BOARD_ID="1234567890"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "query { boards (ids: ${BOARD_ID}) { items_page (limit: 10) { items { id name column_values { id text value } } } } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:** Replace `BOARD_ID` with an actual board ID from the "List All Boards" response (example 2).

---

### 5. Create a New Item

Create a new item in a board:

```bash
BOARD_ID="1234567890"
GROUP_ID="topics"
ITEM_NAME="New Task"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "mutation { create_item (board_id: ${BOARD_ID}, group_id: \"${GROUP_ID}\", item_name: \"${ITEM_NAME}\") { id name } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:**
> - Replace `BOARD_ID` with an actual board ID from the "List All Boards" response (example 2)
> - Replace `GROUP_ID` with a group ID from the "Get Board Details" response (example 3, groups array)
> - Replace `ITEM_NAME` with your desired name for the new item

---

### 6. Create Item with Column Values

Create an item with specific column values:

```bash
BOARD_ID="1234567890"
GROUP_ID="topics"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "mutation ($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) { create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) { id name } }",
  "variables": {
    "boardId": "1234567890",
    "groupId": "topics",
    "itemName": "Task with Details",
    "columnValues": "{\"status\": {\"label\": \"Working on it\"}, \"date\": {\"date\": \"2025-01-15\"}}"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:**
> - Replace `boardId` with an actual board ID from the "List All Boards" response (example 2)
> - Replace `groupId` with a group ID from the "Get Board Details" response (example 3, groups array)
> - Replace `itemName` with your desired name for the new item

---

### 7. Update an Item

Update an existing item's column values:

```bash
ITEM_ID="9876543210"
BOARD_ID="1234567890"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "mutation ($boardId: ID!, $itemId: ID!, $columnValues: JSON!) { change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnValues) { id name } }",
  "variables": {
    "boardId": "1234567890",
    "itemId": "9876543210",
    "columnValues": "{\"status\": {\"label\": \"Done\"}}"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:**
> - Replace `boardId` with an actual board ID from the "List All Boards" response (example 2)
> - Replace `itemId` with an item ID from the "Get Items from a Board" response (example 4)

---

### 8. Delete an Item

Delete an item from a board:

```bash
ITEM_ID="9876543210"
```

Write to `/tmp/monday_request.json`:

```json
{
  "query": "mutation { delete_item (item_id: ${ITEM_ID}) { id } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:** Replace `ITEM_ID` with an actual item ID from the "Get Items from a Board" response (example 4).

---

### 9. Create a New Board

Create a new board:

Write to `/tmp/monday_request.json`:

```json
{
  "query": "mutation { create_board (board_name: \"My New Board\", board_kind: public) { id name } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

---

### 10. Search Items

Search for items across boards:

Write to `/tmp/monday_request.json`:

```json
{
  "query": "query { items_page_by_column_values (limit: 10, board_id: 1234567890, columns: [{column_id: \"name\", column_values: [\"Task\"]}]) { items { id name } } }"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.monday.com/v2" --header "Authorization: ${MONDAY_API_KEY}" --header "API-Version: 2024-10" --header "Content-Type: application/json" -d @/tmp/monday_request.json' | jq .
```

> **Note:** Replace the `board_id` value `1234567890` with an actual board ID from the "List All Boards" response (example 2).

---

## Common Column Types

| Column Type | Value Format |
|-------------|--------------|
| Status | `{"label": "Done"}` |
| Date | `{"date": "2025-01-15"}` |
| Text | `"Your text here"` |
| Number | `"123"` |
| Person | `{"id": 12345678}` |
| Dropdown | `{"labels": ["Option1", "Option2"]}` |
| Checkbox | `{"checked": true}` |

---

## Guidelines

1. **Use variables for complex queries**: GraphQL variables make escaping easier
2. **Check column IDs**: Use the board query to get exact column IDs before updating
3. **API versioning**: Always include `API-Version` header for consistent behavior
4. **Rate limits**: API has rate limits; add delays for bulk operations
5. **Column values are JSON strings**: When using `column_values`, pass as escaped JSON string
