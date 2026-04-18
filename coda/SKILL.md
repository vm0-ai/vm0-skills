---
name: coda
description: Coda API for docs, tables, rows, and pages. Use when user mentions "Coda", "coda.io", shares a Coda doc link, "Coda table", "Coda doc", or asks to read/write a Coda workspace.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CODA_TOKEN` or `zero doctor check-connector --url https://coda.io/apis/v1/whoami --method GET`

## Base URL

```
https://coda.io/apis/v1
```

## Authentication

All requests use a Bearer token:

```
Authorization: Bearer $CODA_TOKEN
```

## Core APIs

### Verify Token

```bash
curl -s "https://coda.io/apis/v1/whoami" --header "Authorization: Bearer $CODA_TOKEN" | jq '{name, loginId, type, tokenName, scoped, workspace: .workspace.name}'
```

Returns the user/token info. Use this to confirm the connector is working before running other calls.

Docs: https://coda.io/developers/apis/v1#operation/whoami

### List Docs

```bash
curl -s "https://coda.io/apis/v1/docs?limit=25" --header "Authorization: Bearer $CODA_TOKEN" | jq '.items[] | {id, name, href, browserLink, ownerName}'
```

Useful query parameters:

- `isOwner=true` — only docs you own
- `query=<search-text>` — name search
- `workspaceId=<workspace-id>` — filter by workspace
- `limit=<1-100>` — page size (default 25)
- `pageToken=<token>` — follow `.nextPageToken` for pagination

Docs: https://coda.io/developers/apis/v1#operation/listDocs

### Create a Doc

Write to `/tmp/coda_doc.json`:

```json
{
  "title": "Project Tracker",
  "timezone": "America/Los_Angeles"
}
```

```bash
curl -s -X POST "https://coda.io/apis/v1/docs" --header "Authorization: Bearer $CODA_TOKEN" --header "Content-Type: application/json" -d @/tmp/coda_doc.json | jq '{id, name, browserLink}'
```

Optional fields:

- `sourceDoc` — copy an existing doc by ID
- `folderId` — place the doc in a specific folder (defaults to your private folder)

Docs: https://coda.io/developers/apis/v1#operation/createDoc

### Get a Doc

Replace `<your-doc-id>` with your actual doc ID (the 10-character code after `_d` in a Coda URL, e.g. `abc123xyz0`):

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{id, name, browserLink, workspace: .workspace.name, ownerName, updatedAt}'
```

Docs: https://coda.io/developers/apis/v1#operation/getDoc

### List Pages in a Doc

Replace `<your-doc-id>` with your actual doc ID:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/pages?limit=50" --header "Authorization: Bearer $CODA_TOKEN" | jq '.items[] | {id, name, browserLink, contentType, isHidden}'
```

Docs: https://coda.io/developers/apis/v1#operation/listPages

### Get a Page

Replace `<your-doc-id>` and `<your-page-id>` with actual IDs:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/pages/<your-page-id>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{id, name, subtitle, contentType, parent: .parent.name}'
```

Docs: https://coda.io/developers/apis/v1#operation/getPage

### Export Page Content

Page content export is a two-step async flow: request export, then poll for the signed download URL.

Write to `/tmp/coda_export.json`:

```json
{
  "outputFormat": "markdown"
}
```

`outputFormat` accepts `html` or `markdown`.

Step 1 — request export. Replace `<your-doc-id>` and `<your-page-id>`:

```bash
curl -s -X POST "https://coda.io/apis/v1/docs/<your-doc-id>/pages/<your-page-id>/export" --header "Authorization: Bearer $CODA_TOKEN" --header "Content-Type: application/json" -d @/tmp/coda_export.json | jq '{id, status, href}'
```

Step 2 — poll until `status` is `complete`, then download. Replace `<your-request-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/pages/<your-page-id>/export/<your-request-id>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{status, downloadLink}'
```

When `status: "complete"`, fetch the content from `downloadLink` (no auth header needed — it is a pre-signed URL):

```bash
curl -s "<download-link-from-previous-response>"
```

Docs: https://coda.io/developers/apis/v1#tag/Pages/operation/beginContentExport

### List Tables in a Doc

Replace `<your-doc-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/tables?limit=50" --header "Authorization: Bearer $CODA_TOKEN" | jq '.items[] | {id, name, tableType, rowCount, browserLink}'
```

Use `tableType=table` to exclude views, or `tableType=view` to list only views.

Docs: https://coda.io/developers/apis/v1#operation/listTables

### Get a Table

Replace `<your-doc-id>` and `<your-table-id>` (the table ID from the previous call, or the table name):

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{id, name, rowCount, displayColumn: .displayColumn.name}'
```

Docs: https://coda.io/developers/apis/v1#operation/getTable

### List Columns

Replace `<your-doc-id>` and `<your-table-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/columns" --header "Authorization: Bearer $CODA_TOKEN" | jq '.items[] | {id, name, display, format: .format.type}'
```

Docs: https://coda.io/developers/apis/v1#operation/listColumns

### List Rows

Replace `<your-doc-id>` and `<your-table-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/rows?useColumnNames=true&limit=100" --header "Authorization: Bearer $CODA_TOKEN" | jq '.items[] | {id, name, values}'
```

Key query parameters:

- `useColumnNames=true` — return column names as keys in `values` (default keys are column IDs)
- `valueFormat=simpleWithArrays` — easier-to-read values (`simple`, `simpleWithArrays`, or `rich`)
- `query=<column-id-or-name>:"<value>"` — server-side filter, e.g. `query=Status:"Done"`
- `sortBy=natural` — preserve table's natural sort order
- `limit=<1-500>` and `pageToken=<token>` for pagination

Docs: https://coda.io/developers/apis/v1#operation/listRows

### Get a Single Row

Replace `<your-doc-id>`, `<your-table-id>`, and `<your-row-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/rows/<your-row-id>?useColumnNames=true" --header "Authorization: Bearer $CODA_TOKEN" | jq '{id, name, values}'
```

Docs: https://coda.io/developers/apis/v1#operation/getRow

### Insert / Upsert Rows

Rows use the `cells` array with `column` set to either the column ID or column name.

Write to `/tmp/coda_rows.json`:

```json
{
  "rows": [
    {
      "cells": [
        {"column": "Name", "value": "Design review"},
        {"column": "Status", "value": "In Progress"},
        {"column": "Due", "value": "2026-05-01"}
      ]
    },
    {
      "cells": [
        {"column": "Name", "value": "Launch plan"},
        {"column": "Status", "value": "To Do"}
      ]
    }
  ],
  "keyColumns": ["Name"]
}
```

- Omit `keyColumns` to always insert new rows.
- Include `keyColumns` (array of column IDs/names) to upsert: rows matching on those columns are updated instead of inserted.

Replace `<your-doc-id>` and `<your-table-id>`:

```bash
curl -s -X POST "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/rows?disableParsing=false" --header "Authorization: Bearer $CODA_TOKEN" --header "Content-Type: application/json" -d @/tmp/coda_rows.json | jq '{requestId, addedRowIds}'
```

Returns `202 Accepted` with a `requestId`. Writes are asynchronous — poll `/apis/v1/docs/{docId}/mutationStatus/{requestId}` for completion if you need to block on it.

Docs: https://coda.io/developers/apis/v1#operation/upsertRows

### Update a Row

Write to `/tmp/coda_row_update.json`:

```json
{
  "row": {
    "cells": [
      {"column": "Status", "value": "Done"}
    ]
  }
}
```

Replace `<your-doc-id>`, `<your-table-id>`, and `<your-row-id>`:

```bash
curl -s -X PUT "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/rows/<your-row-id>" --header "Authorization: Bearer $CODA_TOKEN" --header "Content-Type: application/json" -d @/tmp/coda_row_update.json | jq '{id, requestId}'
```

Docs: https://coda.io/developers/apis/v1#operation/updateRow

### Delete Rows

Write to `/tmp/coda_delete.json`:

```json
{
  "rowIds": ["i-aBcDeFg", "i-HiJkLmN"]
}
```

Replace `<your-doc-id>` and `<your-table-id>`:

```bash
curl -s -X DELETE "https://coda.io/apis/v1/docs/<your-doc-id>/tables/<your-table-id>/rows" --header "Authorization: Bearer $CODA_TOKEN" --header "Content-Type: application/json" -d @/tmp/coda_delete.json | jq '{requestId, rowIds}'
```

Docs: https://coda.io/developers/apis/v1#operation/deleteRows

### Check Mutation Status

Write operations are asynchronous and return a `requestId`. Poll this endpoint until `completed: true` before assuming a mutation is applied.

Replace `<your-doc-id>` and `<your-request-id>`:

```bash
curl -s "https://coda.io/apis/v1/docs/<your-doc-id>/mutationStatus/<your-request-id>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{completed, warning}'
```

Docs: https://coda.io/developers/apis/v1#operation/getMutationStatus

### Resolve a Coda URL

Translate a browser URL (e.g. a doc link copied from the Coda UI) into its corresponding API resource (doc, page, table, column, or row) with IDs.

```bash
curl -s "https://coda.io/apis/v1/resolveBrowserLink?url=<url-encoded-coda-link>" --header "Authorization: Bearer $CODA_TOKEN" | jq '{type, resource: .resource.id, href: .resource.href}'
```

Docs: https://coda.io/developers/apis/v1#operation/resolveBrowserLink

## Finding IDs

- **Doc ID**: the 10-character code after `_d` in a Coda URL. `https://coda.io/d/My-Doc_dABC123xyz0/...` → doc ID is `ABC123xyz0`.
- **Page ID**: last segment after `#_` in a page URL, or use **List Pages** above.
- **Table / Column / Row IDs**: prefixed strings like `grid-...`, `c-...`, `i-...`. Use the list endpoints above, or **Resolve a Coda URL** to extract them from a browser link.

Alternative to IDs: most row/table endpoints also accept the human-readable name (e.g. `Tasks` instead of `grid-xyz`). Pass `useColumnNames=true` on row reads to return column names in the `values` object.

## Value Formats

When reading rows, the `valueFormat` query parameter controls how cell values are serialized:

| Value | Description |
|---|---|
| `simple` | Scalars as primitives; references rendered as display values |
| `simpleWithArrays` | Same as `simple` but multi-value cells stay as arrays (recommended) |
| `rich` | Full structured objects with formatting metadata — verbose |

When writing rows, wrap string/number/boolean values directly: `{"column": "Name", "value": "Foo"}`. For multi-select or lists, pass an array: `{"column": "Tags", "value": ["red", "blue"]}`. Date columns accept ISO-8601 strings.

## Pagination

List endpoints return a `nextPageToken` when there are more items:

```bash
# First request
curl -s "https://coda.io/apis/v1/docs?limit=50" --header "Authorization: Bearer $CODA_TOKEN" | jq '{items: (.items | length), nextPageToken}'

# Follow-up: replace <your-page-token> with the value above
curl -s "https://coda.io/apis/v1/docs?limit=50&pageToken=<your-page-token>" --header "Authorization: Bearer $CODA_TOKEN"
```

## Rate Limits

- Most endpoints: around 100 requests/minute per token
- Bulk writes: combine multiple rows into a single upsert request rather than one request per row
- 429 response → back off and retry with exponential delay

## API Reference

- API root: https://coda.io/developers/apis/v1
- API token settings: https://coda.io/account (Account Settings → API Settings)
