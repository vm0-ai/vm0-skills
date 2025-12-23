---
name: google-sheets
description: Google Sheets API via curl. Use this skill to read, write, and manage spreadsheet data programmatically.
vm0_env:
  - GOOGLE_ACCESS_TOKEN
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

### Option 1: Using gcloud CLI (Recommended)

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate with your Google account:

```bash
gcloud auth login
gcloud auth application-default login --scopes="https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive"
```

3. Get access token:

```bash
export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token)
```

### Option 2: Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the Google Sheets API
3. Create a Service Account and download JSON key
4. Share your spreadsheet with the service account email
5. Generate access token:

```bash
gcloud auth activate-service-account --key-file=service-account.json
export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token)
```

### Option 3: API Key (Read-only, Public Sheets)

For publicly accessible sheets, you can use an API key:

```bash
export GOOGLE_API_KEY="your-api-key"
```

---

## How to Use

All examples below assume you have `GOOGLE_ACCESS_TOKEN` set.

Base URL: `https://sheets.googleapis.com/v4/spreadsheets`

**Finding your Spreadsheet ID:**
The spreadsheet ID is in the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

---

### 1. Get Spreadsheet Metadata

Get information about a spreadsheet (sheets, properties):

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" | jq '{title: .properties.title, sheets: [.sheets[].properties | {sheetId, title}]}'
```

---

### 2. Read Cell Values

Read a range of cells:

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:D10" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" | jq '.values'
```

---

### 3. Read Entire Sheet

Read all data from a sheet:

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" | jq '.values'
```

---

### 4. Read with API Key (Public Sheets)

For publicly accessible sheets:

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:D10?key=${GOOGLE_API_KEY}" | jq '.values'
```

---

### 5. Write Cell Values

Update a range of cells:

```bash
curl -s -X PUT "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:C1?valueInputOption=USER_ENTERED" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"values": [["Name", "Email", "Status"]]}' | jq '.updatedCells'
```

**valueInputOption:**
- `RAW`: Values are stored as-is
- `USER_ENTERED`: Values are parsed as if typed by user (formulas evaluated)

---

### 6. Append Rows

Add new rows to the end of a sheet:

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"values": [["John Doe", "john@example.com", "Active"]]}' | jq '{updatedRange, updatedRows}'
```

---

### 7. Batch Read Multiple Ranges

Read multiple ranges in one request:

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?ranges=Sheet1!A1:B5&ranges=Sheet1!D1:E5" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" | jq '.valueRanges'
```

---

### 8. Batch Update Multiple Ranges

Update multiple ranges in one request:

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"valueInputOption": "USER_ENTERED", "data": [{"range": "Sheet1!A1", "values": [["Header 1"]]}, {"range": "Sheet1!B1", "values": [["Header 2"]]}]}' | jq '.totalUpdatedCells'
```

---

### 9. Clear Cell Values

Clear a range of cells:

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A2:C100:clear" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{}' | jq '.clearedRange'
```

---

### 10. Create New Spreadsheet

Create a new spreadsheet:

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"properties": {"title": "My New Spreadsheet"}, "sheets": [{"properties": {"title": "Data"}}]}' | jq '{spreadsheetId, spreadsheetUrl}'
```

---

### 11. Add New Sheet

Add a new sheet to an existing spreadsheet:

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"requests": [{"addSheet": {"properties": {"title": "New Sheet"}}}]}' | jq '.replies[0].addSheet.properties'
```

---

### 12. Delete Sheet

Delete a sheet from a spreadsheet (use sheetId from metadata):

```bash
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"requests": [{"deleteSheet": {"sheetId": 123456789}}]}' | jq '.'
```

---

### 13. Search for Values

Find cells containing specific text (read all then filter):

```bash
curl -s "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1" -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" | jq '[.values[] | select(.[0] | ascii_downcase | contains("search_term"))]'
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

1. **Token expiration**: Access tokens expire after ~1 hour; refresh with `gcloud auth print-access-token`
2. **Share with service account**: When using service accounts, share the spreadsheet with the service account email
3. **Rate limits**: Default quota is 300 requests per minute per project
4. **Use batch operations**: Combine multiple reads/writes to reduce API calls
5. **valueInputOption**: Use `USER_ENTERED` for formulas, `RAW` for literal strings
6. **URL encode ranges**: Ranges with special characters need URL encoding (e.g., spaces → `%20`)
