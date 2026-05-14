---
name: notion
description: Notion API for pages and databases. Use when user mentions "Notion",
  "notion.so", "notion.site", shares a Notion link, "Notion page", "query Notion",
  or asks about Notion workspace.
---

## Setup

This skill uses Notion's official CLI (`ntn`). Install it once per session, then
export the token variable:

```bash
curl -fsSL https://ntn.dev | bash
export NOTION_API_TOKEN=will_replace_outside_sandbox
```

`ntn api`, `ntn pages`, `ntn datasources`, and `ntn files` all read
`NOTION_API_TOKEN`. The value itself does not matter — `NOTION_API_TOKEN` only
needs to be **non-empty** so `ntn` takes the API-token path instead of falling
back to `ntn login`. The real credential is injected at the network boundary by
the Notion connector when the request reaches `https://api.notion.com`. (Do not
use `ntn login` / `ntn workers` — those need an interactive browser session.)

`ntn` sends the `Notion-Version` header automatically; override with
`--notion-version` if ever needed.

## IMPORTANT: always close stdin

`ntn` tries to read a request body from stdin and will **hang forever** in this
sandbox if stdin is left open. Every invocation must either:

- redirect `< /dev/null` (for GET calls, flag-based calls, and inline body
  inputs), or
- supply the body via a heredoc (which closes stdin itself).

All examples below follow this rule — keep it when adapting them.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name NOTION_TOKEN` or
`zero doctor check-connector --url https://api.notion.com/v1/pages --method GET`.

If `ntn` reports `No workspace selected`, `NOTION_API_TOKEN` is unset or empty —
re-run the export from Setup. If a command hangs, you forgot to close stdin
(see above).

## Request Input Syntax (`ntn api`)

`ntn api <PATH>` defaults to GET. It switches to POST automatically when a body
is present. Provide a body in one of two ways:

- `-d '<JSON>'` — raw JSON string (still add `< /dev/null`). `-d @file` is **not**
  supported.
- stdin JSON — pipe or heredoc.

Inline inputs after the path (combine with `< /dev/null`):

- `Header:Value` — request header
- `name==value` — query parameter
- `path=value` — body string field
- `path:=json` — body typed field (numbers, booleans, arrays, objects, null)

Nested body paths: `properties[Status][select][name]=Done`,
`children[][paragraph][rich_text][0][text][content]=Hello`.

Run `ntn api ls < /dev/null` to list every supported endpoint, or
`ntn api <PATH> --spec < /dev/null` / `--docs` for one endpoint's schema and docs.

## Core APIs

### Read Page as Markdown

`ntn pages get` returns the full page (properties + content) rendered as
Markdown — preferred over walking blocks manually:

```bash
ntn pages get <your-page-id> < /dev/null
```

Add `--json` for the raw API payload.

### Read Page Metadata / Properties

```bash
ntn api /v1/pages/<your-page-id> < /dev/null | jq '{id, url, properties}'
```

### Read Block Children (Toggle, nested content, etc.)

Blocks with `has_children: true` contain nested content — fetch their children
by block ID:

```bash
ntn api /v1/blocks/<your-block-id>/children page_size==100 < /dev/null \
  | jq '.results[] | {type, id, has_children, text: (.[.type].rich_text // [] | map(.plain_text) | join(""))}'
```

### Search Workspace

```bash
ntn api /v1/search -d '{"query": "Meeting Notes", "page_size": 10}' < /dev/null \
  | jq '.results[] | {id, object, title: .properties.title.title[0].plain_text // .title[0].plain_text}'
```

Docs: https://developers.notion.com/reference/post-search

### Resolve a Database to its Data Source IDs

Notion's query API operates on data sources, not databases. Resolve first:

```bash
ntn datasources resolve <your-database-id> < /dev/null
```

### List Database Entries

```bash
ntn datasources query <your-data-source-id> --limit 100 < /dev/null
```

Or via the raw API:

```bash
ntn api /v1/data_sources/<your-data-source-id>/query -d '{"page_size": 100}' < /dev/null \
  | jq '.results[] | {id, properties}'
```

Docs: https://developers.notion.com/reference/query-a-data-source

### Query with Filter

```bash
ntn datasources query <your-data-source-id> \
  --filter '{"property": "Status", "select": {"equals": "Done"}}' \
  --sort 'Date desc' --limit 50 < /dev/null
```

### Query with Multiple Filters

`--filter-file -` reads the filter JSON from stdin, so a heredoc satisfies the
close-stdin rule:

```bash
ntn datasources query <your-data-source-id> --filter-file - << 'EOF'
{
  "and": [
    {"property": "Status", "select": {"does_not_equal": "Archived"}},
    {"property": "Due", "date": {"on_or_before": "2024-12-31"}}
  ]
}
EOF
```

### Get Database Schema

```bash
ntn api /v1/databases/<your-database-id> < /dev/null \
  | jq '{title: .title[0].plain_text, properties: .properties | keys}'
```

Docs: https://developers.notion.com/reference/retrieve-a-database

### Create Page in Database

Pass the body via heredoc (closes stdin, no `-d` needed):

```bash
ntn api /v1/pages << 'EOF'
{
  "parent": {"database_id": "your-database-id"},
  "properties": {
    "Name": {"title": [{"text": {"content": "New Task"}}]},
    "Status": {"select": {"name": "To Do"}},
    "Due": {"date": {"start": "2024-12-31"}}
  }
}
EOF
```

Docs: https://developers.notion.com/reference/post-page

### Create Page with Markdown Content

`ntn pages create` accepts Markdown directly — no block JSON needed:

```bash
ntn pages create --parent page:<parent-page-id> --content '## Introduction

This is the content.' < /dev/null
```

For full control over properties and blocks, use the raw API:

```bash
ntn api /v1/pages << 'EOF'
{
  "parent": {"page_id": "parent-page-id"},
  "properties": {
    "title": {"title": [{"text": {"content": "My New Page"}}]}
  },
  "children": [
    {"object": "block", "type": "heading_2", "heading_2": {"rich_text": [{"text": {"content": "Introduction"}}]}},
    {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "This is the content."}}]}}
  ]
}
EOF
```

### Update Page Properties

```bash
ntn api /v1/pages/<your-page-id> -X PATCH \
  -d '{"properties": {"Status": {"select": {"name": "In Progress"}}}}' < /dev/null
```

Docs: https://developers.notion.com/reference/patch-page

### Archive Page

```bash
ntn api /v1/pages/<your-page-id> -X PATCH archived:=true < /dev/null
```

### Get Block Children

```bash
ntn api /v1/blocks/<your-block-id>/children page_size==100 < /dev/null \
  | jq '.results[] | {type, id}'
```

Docs: https://developers.notion.com/reference/get-block-children

### Append Blocks to Page

```bash
ntn api /v1/blocks/<your-page-id>/children -X PATCH << 'EOF'
{
  "children": [
    {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "New paragraph added."}}]}},
    {"object": "block", "type": "to_do", "to_do": {"rich_text": [{"text": {"content": "Task item"}}], "checked": false}}
  ]
}
EOF
```

Docs: https://developers.notion.com/reference/patch-block-children

### Delete Block

```bash
ntn api /v1/blocks/<your-block-id> -X DELETE < /dev/null
```

### List Users

```bash
ntn api /v1/users < /dev/null | jq '.results[] | {id, name, type}'
```

Docs: https://developers.notion.com/reference/get-users

### Get Current Bot

```bash
ntn api /v1/users/me < /dev/null
```

### Create Database

```bash
ntn api /v1/databases << 'EOF'
{
  "parent": {"page_id": "parent-page-id"},
  "title": [{"text": {"content": "Task Tracker"}}],
  "properties": {
    "Name": {"title": {}},
    "Status": {"select": {"options": [
      {"name": "To Do", "color": "gray"},
      {"name": "In Progress", "color": "blue"},
      {"name": "Done", "color": "green"}
    ]}},
    "Due Date": {"date": {}},
    "Assignee": {"people": {}},
    "Priority": {"select": {"options": [
      {"name": "High", "color": "red"},
      {"name": "Medium", "color": "yellow"},
      {"name": "Low", "color": "green"}
    ]}}
  }
}
EOF
```

Docs: https://developers.notion.com/reference/create-a-database

## Property Types

### Setting Properties (Create/Update)

| Type | Format |
|------|--------|
| Title | `{"title": [{"text": {"content": "value"}}]}` |
| Rich Text | `{"rich_text": [{"text": {"content": "value"}}]}` |
| Number | `{"number": 42}` |
| Select | `{"select": {"name": "Option"}}` |
| Multi-select | `{"multi_select": [{"name": "Tag1"}, {"name": "Tag2"}]}` |
| Date | `{"date": {"start": "2024-01-01", "end": "2024-01-31"}}` |
| Checkbox | `{"checkbox": true}` |
| URL | `{"url": "https://example.com"}` |
| Email | `{"email": "user@example.com"}` |
| Phone | `{"phone_number": "+1234567890"}` |
| People | `{"people": [{"id": "user-id"}]}` |
| Relation | `{"relation": [{"id": "page-id"}]}` |

## Block Types

### Text Blocks

```json
{"type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "Text"}}]}}
{"type": "heading_1", "heading_1": {"rich_text": [{"text": {"content": "H1"}}]}}
{"type": "heading_2", "heading_2": {"rich_text": [{"text": {"content": "H2"}}]}}
{"type": "heading_3", "heading_3": {"rich_text": [{"text": {"content": "H3"}}]}}
{"type": "quote", "quote": {"rich_text": [{"text": {"content": "Quote"}}]}}
{"type": "callout", "callout": {"rich_text": [{"text": {"content": "Note"}}], "icon": {"emoji": "💡"}}}
```

### List Blocks

```json
{"type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"text": {"content": "Item"}}]}}
{"type": "numbered_list_item", "numbered_list_item": {"rich_text": [{"text": {"content": "Item"}}]}}
{"type": "to_do", "to_do": {"rich_text": [{"text": {"content": "Task"}}], "checked": false}}
{"type": "toggle", "toggle": {"rich_text": [{"text": {"content": "Toggle"}}]}}
```

### Code Block

```json
{"type": "code", "code": {"rich_text": [{"text": {"content": "console.log('Hello')"}}], "language": "javascript"}}
```

### Divider

```json
{"type": "divider", "divider": {}}
```

## Filter Operators

### Text/Title/Rich Text
`equals`, `does_not_equal`, `contains`, `does_not_contain`, `starts_with`, `ends_with`, `is_empty`, `is_not_empty`

### Number
`equals`, `does_not_equal`, `greater_than`, `less_than`, `greater_than_or_equal_to`, `less_than_or_equal_to`, `is_empty`, `is_not_empty`

### Date
`equals`, `before`, `after`, `on_or_before`, `on_or_after`, `is_empty`, `is_not_empty`, `past_week`, `past_month`, `past_year`, `next_week`, `next_month`, `next_year`

### Select/Multi-select
`equals`, `does_not_equal`, `is_empty`, `is_not_empty`, `contains` (multi-select), `does_not_contain` (multi-select)

### Checkbox
`equals`, `does_not_equal`

## Rich Text Annotations

```json
{
  "text": {"content": "Styled text", "link": {"url": "https://example.com"}},
  "annotations": {
    "bold": true,
    "italic": false,
    "strikethrough": false,
    "underline": false,
    "code": false,
    "color": "red"
  }
}
```

**Colors**: `default`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red`, `gray_background`, `brown_background`, etc.

## Pagination

All list endpoints support cursor-based pagination. `ntn datasources query`
exposes `--start-cursor`; the raw API uses `start_cursor` in the body:

```bash
# First request — response includes {"next_cursor": "abc123", "has_more": true}
ntn api /v1/data_sources/<your-data-source-id>/query -d '{"page_size": 100}' < /dev/null

# Next page
ntn api /v1/data_sources/<your-data-source-id>/query \
  -d '{"page_size": 100, "start_cursor": "<your-cursor>"}' < /dev/null
```

## Rate Limits

- Average: 3 requests/second
- Burst: Higher for short periods
- 429 response = retry with exponential backoff

## API Reference

- Main Docs: https://developers.notion.com
- API Reference: https://developers.notion.com/reference
- CLI: `ntn --help`, `ntn api ls`, `ntn api <PATH> --docs`
- Integration Settings: https://www.notion.so/profile/integrations
