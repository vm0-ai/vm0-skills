---
name: wrike
description: Wrike API for project management. Use when user mentions "Wrike", "wrike.com",
  shares a Wrike link, "Wrike task", or asks about Wrike workspace.
vm0_secrets:
  - WRIKE_TOKEN
---

# Wrike API

Manage tasks, folders, projects, spaces, comments, timelogs, and workflows in Wrike via the REST API v4.

> Official docs: `https://developers.wrike.com/overview/`

---

## When to Use

Use this skill when you need to:

- List and manage spaces, folders, and projects
- Create, update, delete, and search tasks
- Add and manage comments on tasks and folders
- Track time with timelogs
- Query contacts and workflows

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Wrike**. vm0 will automatically inject the required `WRIKE_TOKEN` environment variable.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/wrike-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $WRIKE_TOKEN" "$@"
EOF
chmod +x /tmp/wrike-curl
```

**Usage:** All examples below use `/tmp/wrike-curl` instead of direct `curl` calls.

## How to Use

All examples below assume you have `WRIKE_TOKEN` set.

Base URL: `https://www.wrike.com/api/v4`

Wrike uses alphanumeric IDs for all resources. The hierarchy is: Space > Folder/Project > Task. Projects are folders with additional properties (owners, start/end dates, status). All responses follow the format `{"kind": "...", "data": [...]}`.

---

## Spaces

### List All Spaces

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/spaces" | jq '.data[] | {id, title}'
```

### Get Space by ID

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/spaces/<space_id>" | jq '.data[0]'
```

### Create Space

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "New Space"
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/spaces" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title}'
```

### Delete Space

```bash
/tmp/wrike-curl -X DELETE "https://www.wrike.com/api/v4/spaces/<space_id>"
```

---

## Folders & Projects

### Get Folder Tree

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/folders" | jq '.data[] | {id, title, scope}'
```

### Get Folders in a Space

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/spaces/<space_id>/folders" | jq '.data[] | {id, title, childIds}'
```

### Get Subfolders

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/folders/<folder_id>/folders" | jq '.data[] | {id, title}'
```

### Get Folder by ID

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/folders/<folder_id>" | jq '.data[0]'
```

### Create Folder

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "New Folder"
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/folders/<parent_folder_id>/folders" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title}'
```

### Create Project

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "New Project",
  "project": {
    "status": "Green",
    "startDate": "2026-04-01",
    "endDate": "2026-06-30"
  }
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/folders/<parent_folder_id>/folders" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title, project}'
```

### Update Folder

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "Updated Folder Name"
}
```

```bash
/tmp/wrike-curl -X PUT "https://www.wrike.com/api/v4/folders/<folder_id>" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title}'
```

### Delete Folder

```bash
/tmp/wrike-curl -X DELETE "https://www.wrike.com/api/v4/folders/<folder_id>"
```

---

## Tasks

### List Tasks in a Folder

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/folders/<folder_id>/tasks" | jq '.data[] | {id, title, status, importance, dates}'
```

### List Tasks in a Space

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/spaces/<space_id>/tasks" | jq '.data[] | {id, title, status, importance}'
```

### Get Task by ID

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/tasks/<task_id>" | jq '.data[0] | {id, title, description, status, importance, dates, responsibleIds}'
```

### Create Task

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "New Task",
  "description": "Task description here",
  "status": "Active",
  "importance": "Normal",
  "dates": {
    "start": "2026-04-01",
    "due": "2026-04-15"
  },
  "responsibles": ["<contact_id>"]
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/folders/<folder_id>/tasks" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title, status}'
```

### Update Task

Write to `/tmp/wrike_request.json`:

```json
{
  "title": "Updated Task Name",
  "status": "Completed",
  "importance": "High"
}
```

```bash
/tmp/wrike-curl -X PUT "https://www.wrike.com/api/v4/tasks/<task_id>" -d @/tmp/wrike_request.json | jq '.data[0] | {id, title, status}'
```

### Delete Task

```bash
/tmp/wrike-curl -X DELETE "https://www.wrike.com/api/v4/tasks/<task_id>"
```

---

## Comments

### List Comments on a Task

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/tasks/<task_id>/comments" | jq '.data[] | {id, text, authorId, createdDate}'
```

### List Comments on a Folder

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/folders/<folder_id>/comments" | jq '.data[] | {id, text, authorId, createdDate}'
```

### Create Comment on a Task

Write to `/tmp/wrike_request.json`:

```json
{
  "text": "This is a comment on the task."
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/tasks/<task_id>/comments" -d @/tmp/wrike_request.json | jq '.data[0]'
```

### Update Comment

Write to `/tmp/wrike_request.json`:

```json
{
  "text": "Updated comment text."
}
```

```bash
/tmp/wrike-curl -X PUT "https://www.wrike.com/api/v4/comments/<comment_id>" -d @/tmp/wrike_request.json | jq '.data[0]'
```

### Delete Comment

```bash
/tmp/wrike-curl -X DELETE "https://www.wrike.com/api/v4/comments/<comment_id>"
```

---

## Contacts

### List All Contacts

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/contacts" | jq '.data[] | {id, firstName, lastName, type, profiles}'
```

### Get Contact by ID

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/contacts/<contact_id>" | jq '.data[0]'
```

---

## Timelogs

### List Timelogs for a Task

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/tasks/<task_id>/timelogs" | jq '.data[] | {id, taskId, hours, trackedDate, comment}'
```

### Create Timelog

Write to `/tmp/wrike_request.json`:

```json
{
  "hours": 2.5,
  "trackedDate": "2026-04-01",
  "comment": "Working on implementation"
}
```

```bash
/tmp/wrike-curl -X POST "https://www.wrike.com/api/v4/tasks/<task_id>/timelogs" -d @/tmp/wrike_request.json | jq '.data[0] | {id, hours, trackedDate}'
```

### Delete Timelog

```bash
/tmp/wrike-curl -X DELETE "https://www.wrike.com/api/v4/timelogs/<timelog_id>"
```

---

## Workflows

### List Workflows

```bash
/tmp/wrike-curl "https://www.wrike.com/api/v4/workflows" | jq '.data[] | {id, name, customStatuses}'
```

---

## Guidelines

1. Wrike uses alphanumeric string IDs for all resources. Use `jq` to extract `id` and `title` fields.
2. The resource hierarchy is: Space > Folder/Project > Task. Projects are folders with additional properties (owners, start/end dates, status).
3. Task statuses include `Active`, `Completed`, `Deferred`, `Cancelled`, and custom statuses defined in workflows.
4. Importance values: `High`, `Normal`, `Low`.
5. Dates use `YYYY-MM-DD` format (e.g., `2026-04-01`).
6. All responses follow the format `{"kind": "...", "data": [...]}`. The `data` field is always an array.
7. You can query up to 100 resources by ID in a single request using comma-separated IDs (e.g., `/tasks/id1,id2,id3`).
8. Write request bodies to `/tmp/wrike_request.json` before sending.
9. Rate limits: Wrike allows 400 requests per minute per access token. Back off on 429 responses.
10. Use `<placeholder>` for dynamic IDs that the user must replace (e.g., `<task_id>`, `<folder_id>`).
