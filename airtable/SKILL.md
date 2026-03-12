---
name: airtable
description: Airtable API for bases and records. Use when user mentions "Airtable",
  "airtable.com", shares an Airtable link, "create record", or asks about Airtable
  base.
vm0_secrets:
  - AIRTABLE_TOKEN
---

# Airtable API

Manage bases, tables, records, and comments in Airtable.

> Official docs: `https://airtable.com/developers/web/api/introduction`

## When to Use

- List and inspect Airtable bases and tables
- Read, create, update, and delete records
- Manage table schemas (fields, views)
- Read and write record comments
- Get current user info

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Airtable**. vm0 will automatically inject the required `AIRTABLE_TOKEN` environment variable.

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## Core APIs

### Get Current User

```bash
bash -c 'curl -s "https://api.airtable.com/v0/meta/whoami" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq .
```

### List Bases

```bash
bash -c 'curl -s "https://api.airtable.com/v0/meta/bases" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq '.bases[] | {id, name, permissionLevel}'
```

### Get Base Schema (List Tables)

Replace `<base-id>` with your actual base ID (starts with `app`):

```bash
bash -c 'curl -s "https://api.airtable.com/v0/meta/bases/<base-id>/tables" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq '.tables[] | {id, name, fields: [.fields[] | {id, name, type}]}'
```

### List Records

Replace `<base-id>` and `<table-id-or-name>` with actual values. Table name must be URL-encoded if it contains spaces.

```bash
bash -c 'curl -s "https://api.airtable.com/v0/<base-id>/<table-id-or-name>?maxRecords=10" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq '.records[] | {id, fields, createdTime}'
```

### List Records with Field Selection

```bash
bash -c 'curl -s "https://api.airtable.com/v0/<base-id>/<table-id-or-name>?maxRecords=10&fields%5B%5D=Name&fields%5B%5D=Status" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq '.records[] | {id, fields}'
```

### Get a Single Record

```bash
bash -c 'curl -s "https://api.airtable.com/v0/<base-id>/<table-id-or-name>/<record-id>" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq .
```

### Create Records

Write the request body to a temp file, then send it:

```bash
cat > /tmp/request.json << 'BODY'
{
  "records": [
    {
      "fields": {
        "Name": "New Record",
        "Status": "Todo"
      }
    }
  ]
}
BODY
bash -c 'curl -s -X POST "https://api.airtable.com/v0/<base-id>/<table-id-or-name>" --header "Authorization: Bearer $AIRTABLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json' | jq '.records[] | {id, fields}'
```

### Update Records (PATCH)

PATCH updates only the specified fields, leaving others unchanged:

```bash
cat > /tmp/request.json << 'BODY'
{
  "records": [
    {
      "id": "<record-id>",
      "fields": {
        "Status": "Done"
      }
    }
  ]
}
BODY
bash -c 'curl -s -X PATCH "https://api.airtable.com/v0/<base-id>/<table-id-or-name>" --header "Authorization: Bearer $AIRTABLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json' | jq '.records[] | {id, fields}'
```

### Delete Records

```bash
bash -c 'curl -s -X DELETE "https://api.airtable.com/v0/<base-id>/<table-id-or-name>?records%5B%5D=<record-id>" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq .
```

### List Record Comments

```bash
bash -c 'curl -s "https://api.airtable.com/v0/<base-id>/<table-id-or-name>/<record-id>/comments" --header "Authorization: Bearer $AIRTABLE_TOKEN"' | jq '.comments[] | {id, author, text, createdTime}'
```

### Add a Comment to a Record

```bash
cat > /tmp/request.json << 'BODY'
{
  "text": "This is a comment added via the API."
}
BODY
bash -c 'curl -s -X POST "https://api.airtable.com/v0/<base-id>/<table-id-or-name>/<record-id>/comments" --header "Authorization: Bearer $AIRTABLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json' | jq .
```

### Create a Table

```bash
cat > /tmp/request.json << 'BODY'
{
  "name": "New Table",
  "fields": [
    {"name": "Name", "type": "singleLineText"},
    {"name": "Notes", "type": "multilineText"},
    {"name": "Status", "type": "singleSelect", "options": {"choices": [{"name": "Todo"}, {"name": "In Progress"}, {"name": "Done"}]}}
  ]
}
BODY
bash -c 'curl -s -X POST "https://api.airtable.com/v0/meta/bases/<base-id>/tables" --header "Authorization: Bearer $AIRTABLE_TOKEN" --header "Content-Type: application/json" -d @/tmp/request.json' | jq '{id, name, fields: [.fields[] | {id, name, type}]}'
```

## Guidelines

1. Base IDs start with `app`, table IDs start with `tbl`, record IDs start with `rec`, field IDs start with `fld`.
2. Use `maxRecords` parameter to limit results. Default returns up to 100 records.
3. For pagination, use the `offset` value from the response in the next request.
4. URL-encode table names that contain spaces (e.g., `My%20Table`). Using table IDs avoids this issue.
5. The create/update endpoints accept up to 10 records per request.
6. Field names are case-sensitive and must match exactly.
7. Use PATCH for partial updates (only specified fields change) and PUT for full replacement.
