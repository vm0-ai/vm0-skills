---
name: google-sheets
description: Google Sheets API for spreadsheets. Use when user mentions "Google Sheets",
  "sheets.google.com", shares a spreadsheet link, "update sheet", or asks about Excel/Sheets
  data.
vm0_secrets:
  - GOOGLE_SHEETS_TOKEN
---

# Google Sheets API

Use the Google Sheets API via direct `curl` calls to **read, write, and manage spreadsheet data**.

> Official docs: `https://developers.google.com/sheets/api`

---

## When to Use

Use this skill when you need to:

- **Read data** from Google Sheets
- **Write or update** cell values
- **Append rows** to existing sheets
- **Create new spreadsheets**
- **Get spreadsheet metadata** (sheet names, properties)
- **Batch update** multiple ranges at once

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings → Connectors** and connect **Google Sheets**. vm0 will automatically inject the required `GOOGLE_SHEETS_TOKEN` environment variable.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

> **Placeholders:** Values in `{curly-braces}` like `{spreadsheet-id}` are placeholders. Replace them with actual values when executing.

> **Important:** In range notation, the sheet-name separator `!` must be URL encoded as `%21` in the URL path. For example, `Sheet1!A1:D10` becomes `Sheet1%21A1:D10`. All examples below use this encoding.

---

## How to Use

Base URL: `https://sheets.googleapis.com/v4/spreadsheets`

**Finding your Spreadsheet ID:**
The spreadsheet ID is in the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

---

### 1. Get Spreadsheet Metadata

Get information about a spreadsheet (sheets, properties):

```bash
bash -c 'curl -s "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN"' | jq '{title: .properties.title, sheets: [.sheets[].properties | {sheetId, title}]}'
```

---

### 2. Read Cell Values

Read a range of cells:

```bash
bash -c 'curl -s "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1%21A1:D10" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN"' | jq '.values'
```

---

### 3. Read Entire Sheet

Read all data from a sheet:

```bash
bash -c 'curl -s "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN"' | jq '.values'
```

---

### 4. Write Cell Values

Update a range of cells.

Write to `/tmp/gsheets_request.json`:

```json
{
  "values": [
    ["Name", "Email", "Status"]
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1%21A1:C1?valueInputOption=USER_ENTERED" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '.updatedCells'
```

**valueInputOption:**
- `RAW`: Values are stored as-is
- `USER_ENTERED`: Values are parsed as if typed by user (formulas evaluated)

---

### 5. Append Rows

Add new rows to the end of a sheet.

Write to `/tmp/gsheets_request.json`:

```json
{
  "values": [
    ["John Doe", "john@example.com", "Active"]
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1%21A:C:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '.updates | {updatedRange, updatedRows}'
```

---

### 6. Batch Read Multiple Ranges

Read multiple ranges in one request:

```bash
bash -c 'curl -s "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values:batchGet?ranges=Sheet1%21A1:B5&ranges=Sheet1%21D1:E5" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN"' | jq '.valueRanges'
```

---

### 7. Batch Update Multiple Ranges

Update multiple ranges in one request.

Write to `/tmp/gsheets_request.json`:

```json
{
  "valueInputOption": "USER_ENTERED",
  "data": [
    {
      "range": "Sheet1!A1",
      "values": [["Header 1"]]
    },
    {
      "range": "Sheet1!B1",
      "values": [["Header 2"]]
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values:batchUpdate" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '.totalUpdatedCells'
```

---

### 8. Clear Cell Values

Clear a range of cells.

Write to `/tmp/gsheets_request.json`:

```json
{}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1%21A2:C100:clear" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '.clearedRange'
```

---

### 9. Create New Spreadsheet

Write to `/tmp/gsheets_request.json`:

```json
{
  "properties": {
    "title": "My New Spreadsheet"
  },
  "sheets": [
    {
      "properties": {
        "title": "Data"
      }
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '{spreadsheetId, spreadsheetUrl}'
```

---

### 10. Add New Sheet

Add a new sheet to an existing spreadsheet.

Write to `/tmp/gsheets_request.json`:

```json
{
  "requests": [
    {
      "addSheet": {
        "properties": {
          "title": "New Sheet"
        }
      }
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}:batchUpdate" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json' | jq '.replies[0].addSheet.properties'
```

---

### 11. Delete Sheet

Delete a sheet from a spreadsheet (use sheetId from metadata).

Write to `/tmp/gsheets_request.json`:

```json
{
  "requests": [
    {
      "deleteSheet": {
        "sheetId": 123456789
      }
    }
  ]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}:batchUpdate" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN" --header "Content-Type: application/json" -d @/tmp/gsheets_request.json'
```

---

### 12. Search for Values

Find cells containing specific text (read all then filter):

```bash
bash -c 'curl -s "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet-id}/values/Sheet1" --header "Authorization: Bearer $GOOGLE_SHEETS_TOKEN"' | jq '[.values[] | select(.[0] | ascii_downcase | contains("search_term"))]'
```

---

## A1 Notation Reference

| Notation | Description |
|----------|-------------|
| `Sheet1!A1` | Single cell A1 in Sheet1 |
| `Sheet1!A1:B2` | Range from A1 to B2 |
| `Sheet1!A:A` | Entire column A |
| `Sheet1!1:1` | Entire row 1 |
| `Sheet1!A1:C` | From A1 to end of column C |
| `'Sheet Name'!A1` | Sheet names with spaces need quotes |

---

## Guidelines

1. **Rate limits**: Default quota is 300 requests per minute per project
2. **Use batch operations**: Combine multiple reads/writes to reduce API calls
3. **valueInputOption**: Use `USER_ENTERED` for formulas, `RAW` for literal strings
4. **URL encode ranges**: The sheet-name separator in ranges must be encoded as `%21` in URLs (e.g., `Sheet1%21A1:D10`)
