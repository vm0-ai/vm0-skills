---
name: clickup
description: ClickUp API for tasks and spaces. Use when user mentions "ClickUp", "clickup.com",
  shares a ClickUp link, "ClickUp task", or asks about ClickUp workspace.
vm0_secrets:
  - CLICKUP_TOKEN
---

# ClickUp API

Manage tasks, lists, folders, spaces, and workspaces in ClickUp via the REST API.

> Official docs: `https://developer.clickup.com/reference`

---

## When to Use

Use this skill when you need to:

- List workspaces, spaces, folders, and lists
- Create, update, delete, and search tasks
- Manage comments on tasks
- Track time entries for tasks
- Organize work with tags and custom fields

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **ClickUp**. vm0 will automatically inject the required `CLICKUP_TOKEN` environment variable.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/clickup-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $CLICKUP_TOKEN" "$@"
EOF
chmod +x /tmp/clickup-curl
```

**Usage:** All examples below use `/tmp/clickup-curl` instead of direct `curl` calls.

## How to Use

All examples below assume you have `CLICKUP_TOKEN` set.

Base URL: `https://api.clickup.com/api/v2`

ClickUp uses numeric IDs for all resources. The hierarchy is: Workspace (team) > Space > Folder > List > Task.

---

## User & Workspaces

### Get Authorized User

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/user" | jq '.user | {id, username, email}'
```

### List Workspaces

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/team" | jq '.teams[] | {id, name}'
```

---

## Spaces

### List Spaces in a Workspace

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/team/<team_id>/space?archived=false" | jq '.spaces[] | {id, name}'
```

### Get Space Details

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/space/<space_id>" | jq '.'
```

### Create Space

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "New Space",
  "multiple_assignees": true,
  "features": {
    "due_dates": { "enabled": true },
    "time_tracking": { "enabled": true }
  }
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/team/<team_id>/space" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete Space

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/space/<space_id>"
```

---

## Folders

### List Folders in a Space

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/space/<space_id>/folder?archived=false" | jq '.folders[] | {id, name}'
```

### Create Folder

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "New Folder"
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/space/<space_id>/folder" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Update Folder

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "Updated Folder Name"
}
```

```bash
/tmp/clickup-curl -X PUT "https://api.clickup.com/api/v2/folder/<folder_id>" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete Folder

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/folder/<folder_id>"
```

---

## Lists

### List Lists in a Folder

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/folder/<folder_id>/list?archived=false" | jq '.lists[] | {id, name, task_count}'
```

### List Folderless Lists in a Space

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/space/<space_id>/list?archived=false" | jq '.lists[] | {id, name, task_count}'
```

### Create List

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "New List",
  "content": "List description here"
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/folder/<folder_id>/list" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Update List

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "Updated List Name",
  "content": "Updated description"
}
```

```bash
/tmp/clickup-curl -X PUT "https://api.clickup.com/api/v2/list/<list_id>" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete List

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/list/<list_id>"
```

---

## Tasks

### List Tasks in a List

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/list/<list_id>/task?archived=false" | jq '.tasks[] | {id, name, status: .status.status, assignees: [.assignees[].username], due_date}'
```

### Get Task Details

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/task/<task_id>" | jq '{id, name, description, status: .status.status, priority: .priority, due_date, assignees: [.assignees[].username]}'
```

### Create Task

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "New Task",
  "description": "Task description here",
  "status": "to do",
  "priority": 3,
  "due_date": 1774934400000,
  "due_date_time": false
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/list/<list_id>/task" -d @/tmp/clickup_request.json | jq '{id, name, status: .status.status}'
```

### Create Task with Assignees

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "Assigned Task",
  "description": "Task with assignees",
  "assignees": [123456],
  "status": "to do",
  "priority": 2
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/list/<list_id>/task" -d @/tmp/clickup_request.json | jq '{id, name, assignees: [.assignees[].username]}'
```

### Update Task

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "Updated Task Name",
  "description": "Updated description",
  "status": "in progress",
  "priority": 1
}
```

```bash
/tmp/clickup-curl -X PUT "https://api.clickup.com/api/v2/task/<task_id>" -d @/tmp/clickup_request.json | jq '{id, name, status: .status.status}'
```

### Delete Task

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/task/<task_id>"
```

### Get Filtered Team Tasks

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/team/<team_id>/task?statuses[]=to%20do&statuses[]=in%20progress&assignees[]=<user_id>&page=0" | jq '.tasks[] | {id, name, status: .status.status}'
```

---

## Comments

### List Task Comments

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/task/<task_id>/comment" | jq '.comments[] | {id, comment_text, user: .user.username, date}'
```

### Create Task Comment

Write to `/tmp/clickup_request.json`:

```json
{
  "comment_text": "This is a comment on the task."
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/task/<task_id>/comment" -d @/tmp/clickup_request.json | jq '.'
```

### Update Comment

Write to `/tmp/clickup_request.json`:

```json
{
  "comment_text": "Updated comment text."
}
```

```bash
/tmp/clickup-curl -X PUT "https://api.clickup.com/api/v2/comment/<comment_id>" -d @/tmp/clickup_request.json | jq '.'
```

### Delete Comment

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/comment/<comment_id>"
```

---

## Time Tracking

### List Time Entries

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/team/<team_id>/time_entries" | jq '.data[] | {id, task: .task.name, duration, start, end}'
```

### Create Time Entry

Write to `/tmp/clickup_request.json`:

```json
{
  "description": "Working on task",
  "start": 1774934400000,
  "duration": 3600000,
  "tid": "<task_id>"
}
```

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/team/<team_id>/time_entries" -d @/tmp/clickup_request.json | jq '.data | {id, duration, start}'
```

### Delete Time Entry

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/team/<team_id>/time_entries/<timer_id>"
```

---

## Tags

### List Space Tags

```bash
/tmp/clickup-curl "https://api.clickup.com/api/v2/space/<space_id>/tag" | jq '.tags[] | {name, tag_fg, tag_bg}'
```

### Add Tag to Task

```bash
/tmp/clickup-curl -X POST "https://api.clickup.com/api/v2/task/<task_id>/tag/<tag_name>"
```

### Remove Tag from Task

```bash
/tmp/clickup-curl -X DELETE "https://api.clickup.com/api/v2/task/<task_id>/tag/<tag_name>"
```

---

## Guidelines

1. ClickUp uses numeric IDs for all resources. Use `jq` to extract `id` and `name` fields.
2. The resource hierarchy is: Workspace (team) > Space > Folder > List > Task. Lists can also exist directly under a Space (folderless lists).
3. Task statuses are lowercase strings (e.g., `to do`, `in progress`, `complete`). Available statuses depend on the list configuration.
4. Priority values: 1 (urgent), 2 (high), 3 (normal), 4 (low). Use `null` for no priority.
5. Dates are Unix timestamps in milliseconds. Convert with: `date -d "2026-04-01" +%s000`.
6. Pagination: tasks endpoint returns up to 100 results per page. Use `page=0`, `page=1`, etc.
7. Use `archived=false` query parameter to exclude archived items from list endpoints.
8. Write request bodies to `/tmp/clickup_request.json` before sending.
9. Rate limits: ClickUp allows 100 requests per minute per token. Back off on 429 responses.
10. Use `<placeholder>` for dynamic IDs that the user must replace (e.g., `<task_id>`, `<list_id>`).
