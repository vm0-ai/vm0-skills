---
name: attio
description: Attio REST API for AI-native CRM operations — manage companies, people, deals, and custom objects, plus notes, tasks, lists, and comments. Use when the user mentions "Attio", "CRM record", "create company", "add person", "list entry", "CRM note", or "CRM task".
homepage: https://attio.com
docs: https://docs.attio.com/rest-api/overview
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ATTIO_TOKEN` or `zero doctor check-connector --url https://api.attio.com/v2/self --method GET`

## How It Works

Attio is an AI-native CRM. Your workspace is organized into **objects** (standard ones: `companies`, `people`, `deals`, `users`, `workspaces`; plus any custom objects you create). Each object contains **records**, and records can be grouped into **lists** via **entries**. Records can also be annotated with **notes**, **tasks**, **comments** (on threads), and **attribute history**.

```
Workspace
└── Objects (companies, people, deals, ...custom)
    └── Records
        ├── attribute values (history supported)
        ├── entries (memberships in lists)
        ├── notes
        ├── tasks
        └── comment threads
```

Base URL: `https://api.attio.com`

## Authentication

All requests use Bearer token auth:

```
Authorization: Bearer $ATTIO_TOKEN
```

## Prerequisites

Connect the **Attio** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## Environment Variables

| Variable | Description |
|---|---|
| `ATTIO_TOKEN` | Attio workspace access token |

## Key Endpoints

### 1. Identify the Current Token

Check which workspace the token is bound to and which scopes it holds.

```bash
curl -s "https://api.attio.com/v2/self" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 2. List Objects

Return every object in the workspace, including custom ones.

```bash
curl -s "https://api.attio.com/v2/objects" --header "Authorization: Bearer $ATTIO_TOKEN"
```

Fetch a single object by slug or UUID — replace `<object>` with e.g. `companies`, `people`, `deals`, or an object UUID:

```bash
curl -s "https://api.attio.com/v2/objects/<object>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 3. Query (List) Records

List records for an object. Uses `POST /v2/objects/<object>/records/query` because the body carries filter/sort/pagination.

Write `/tmp/attio_query.json`:

```json
{
  "filter": {},
  "sorts": [
    { "attribute": "created_at", "direction": "desc" }
  ],
  "limit": 100,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/objects/companies/records/query" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_query.json
```

Filter by a single attribute (e.g. find a person by name):

```json
{
  "filter": { "name": "Ada Lovelace" },
  "limit": 10
}
```

### 4. Get a Single Record

Replace `<object>` and `<record-id>` with real values (both are UUIDs or — for `<object>` — slugs):

```bash
curl -s "https://api.attio.com/v2/objects/<object>/records/<record-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 5. Create a Record

Write `/tmp/attio_create_record.json`. Top-level keys inside `values` are **attribute slugs** (for standard attributes) or **attribute UUIDs** (for custom attributes):

```json
{
  "data": {
    "values": {
      "name": "Acme Inc.",
      "domains": ["acme.com"],
      "description": "Imported by vm0 agent"
    }
  }
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/objects/companies/records" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_create_record.json
```

Throws on conflicts of unique attributes — use the Assert endpoint (next) if you prefer upsert semantics.

### 6. Assert (Upsert) a Record

Create or update-in-place by a matching attribute. Pass `matching_attribute` as a query parameter.

Write `/tmp/attio_assert_record.json`:

```json
{
  "data": {
    "values": {
      "domains": ["acme.com"],
      "name": "Acme Inc."
    }
  }
}
```

```bash
curl -s -X PUT "https://api.attio.com/v2/objects/companies/records?matching_attribute=domains" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_assert_record.json
```

### 7. Update a Record

`PATCH` performs a partial merge (multi-select values are appended); `PUT` fully overwrites the values you supply. Replace `<record-id>`.

Write `/tmp/attio_update_record.json`:

```json
{
  "data": {
    "values": {
      "description": "Updated description"
    }
  }
}
```

```bash
curl -s -X PATCH "https://api.attio.com/v2/objects/companies/records/<record-id>" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_update_record.json
```

### 8. Delete a Record

```bash
curl -s -X DELETE "https://api.attio.com/v2/objects/companies/records/<record-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 9. Search Records Across Objects

Search spans every object the token can read.

Write `/tmp/attio_search.json`:

```json
{
  "query": "ada",
  "limit": 25
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/objects/records/search" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_search.json
```

### 10. List Entries on a Record

Every list a record belongs to (e.g. which sales lists a company is on) — replace `<object>` (slug or UUID) and `<record-id>`:

```bash
curl -s "https://api.attio.com/v2/objects/<object>/records/<record-id>/entries" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Lists & Entries

### 11. List All Lists

```bash
curl -s "https://api.attio.com/v2/lists" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 12. Get a List

Replace `<list>` with the list slug or UUID:

```bash
curl -s "https://api.attio.com/v2/lists/<list>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 13. Query Entries in a List

Write `/tmp/attio_list_query.json`:

```json
{
  "filter": {},
  "sorts": [{ "attribute": "created_at", "direction": "desc" }],
  "limit": 100,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/lists/<list>/entries/query" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_list_query.json
```

### 14. Add a Record to a List (Create Entry)

Write `/tmp/attio_create_entry.json` — replace the parent record id:

```json
{
  "data": {
    "parent_record_id": "<record-id>",
    "parent_object": "companies",
    "entry_values": {}
  }
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/lists/<list>/entries" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_create_entry.json
```

### 15. Update or Delete an Entry

Replace `<entry-id>`:

```bash
curl -s -X PATCH "https://api.attio.com/v2/entries/<entry-id>" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_update_entry.json
curl -s -X DELETE "https://api.attio.com/v2/entries/<entry-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Notes

### 16. List Notes

Filter by `parent_object` + `parent_record_id` via query string:

```bash
curl -s "https://api.attio.com/v2/notes?parent_object=companies&parent_record_id=<record-id>&limit=25" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 17. Create a Note

Write `/tmp/attio_create_note.json` — `format` is `plaintext` or `markdown`:

```json
{
  "data": {
    "parent_object": "companies",
    "parent_record_id": "<record-id>",
    "title": "Discovery call recap",
    "format": "markdown",
    "content": "## Key takeaways\n- Budget approved\n- Decision by EOQ"
  }
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/notes" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_create_note.json
```

### 18. Get or Delete a Note

Replace `<note-id>`:

```bash
curl -s "https://api.attio.com/v2/notes/<note-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
curl -s -X DELETE "https://api.attio.com/v2/notes/<note-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Tasks

### 19. List Tasks

```bash
curl -s "https://api.attio.com/v2/tasks?limit=25" --header "Authorization: Bearer $ATTIO_TOKEN"
```

### 20. Create a Task

Write `/tmp/attio_create_task.json`. `linked_records` accepts either raw record IDs (via `target_record_id`) or the shorthand `"<record-id>"` form — the nested form below is the explicit one. `assignees[].referenced_actor_id` is a workspace member UUID from `GET /v2/workspace-members`.

```json
{
  "data": {
    "content": "Send follow-up deck",
    "format": "plaintext",
    "deadline_at": "2026-05-01T15:00:00.000000000Z",
    "is_completed": false,
    "linked_records": [
      {
        "target_object": "companies",
        "target_record_id": "<record-id>"
      }
    ],
    "assignees": [
      {
        "referenced_actor_type": "workspace-member",
        "referenced_actor_id": "<workspace-member-id>"
      }
    ]
  }
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/tasks" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_create_task.json
```

### 21. Update, Complete, or Delete a Task

Replace `<task-id>`. Toggle `is_completed` to mark done.

Write `/tmp/attio_update_task.json`:

```json
{
  "data": {
    "is_completed": true
  }
}
```

```bash
curl -s -X PATCH "https://api.attio.com/v2/tasks/<task-id>" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_update_task.json
curl -s -X DELETE "https://api.attio.com/v2/tasks/<task-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Comments & Threads

### 22. Create a Comment

Comments live on threads attached to a record or a note. Write `/tmp/attio_create_comment.json`:

```json
{
  "data": {
    "format": "plaintext",
    "content": "Nice work — looping in the team.",
    "author": {
      "type": "workspace-member",
      "id": "<workspace-member-id>"
    },
    "thread_id": "<thread-id>"
  }
}
```

```bash
curl -s -X POST "https://api.attio.com/v2/comments" --header "Authorization: Bearer $ATTIO_TOKEN" --header "Content-Type: application/json" -d @/tmp/attio_create_comment.json
```

Fetch a thread and its comments — replace `<thread-id>`:

```bash
curl -s "https://api.attio.com/v2/threads/<thread-id>" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Workspace Members

Resolve `<workspace-member-id>` for assignees/authors:

```bash
curl -s "https://api.attio.com/v2/workspace_members" --header "Authorization: Bearer $ATTIO_TOKEN"
```

## Guidelines

1. Use object slugs (`companies`, `people`, `deals`, `users`, `workspaces`) for the five standard objects; use object UUIDs for custom objects — both work in the `<object>` path segment.
2. Attribute slugs (e.g. `name`, `domains`) work for built-in attributes; custom attributes must be referenced by UUID.
3. `POST /v2/objects/<object>/records` throws on unique-attribute conflict — use `PUT /v2/objects/<object>/records?matching_attribute=<slug>` for upsert semantics.
4. `PATCH` on a record does a shallow merge (multi-selects append); `PUT` overwrites. Pick the one that matches intent.
5. Default pagination is `limit: 500, offset: 0` for record queries; cap large scans with explicit `limit`.
6. Send all request bodies as JSON files with `-d @/tmp/filename.json` to avoid shell-escaping issues.
