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

---

## How to Use

All examples below assume you have `CLICKUP_TOKEN` set.

Base URL: `https://api.clickup.com/api/v2`

ClickUp uses numeric IDs for all resources. The hierarchy is: Workspace (team) > Space > Folder > List > Task.

---

## User & Workspaces

### Get Authorized User

```bash
curl -s "https://api.clickup.com/api/v2/user" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.user | {id, username, email}'
```

### List Workspaces

```bash
curl -s "https://api.clickup.com/api/v2/team" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.teams[] | {id, name}'
```

---

## Spaces

### List Spaces in a Workspace

```bash
curl -s "https://api.clickup.com/api/v2/team/<team_id>/space?archived=false" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.spaces[] | {id, name}'
```

### Get Space Details

```bash
curl -s "https://api.clickup.com/api/v2/space/<space_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.'
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
curl -s -X POST "https://api.clickup.com/api/v2/team/<team_id>/space" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete Space

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/space/<space_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

---

## Folders

### List Folders in a Space

```bash
curl -s "https://api.clickup.com/api/v2/space/<space_id>/folder?archived=false" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.folders[] | {id, name}'
```

### Create Folder

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "New Folder"
}
```

```bash
curl -s -X POST "https://api.clickup.com/api/v2/space/<space_id>/folder" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Update Folder

Write to `/tmp/clickup_request.json`:

```json
{
  "name": "Updated Folder Name"
}
```

```bash
curl -s -X PUT "https://api.clickup.com/api/v2/folder/<folder_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete Folder

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/folder/<folder_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

---

## Lists

### List Lists in a Folder

```bash
curl -s "https://api.clickup.com/api/v2/folder/<folder_id>/list?archived=false" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.lists[] | {id, name, task_count}'
```

### List Folderless Lists in a Space

```bash
curl -s "https://api.clickup.com/api/v2/space/<space_id>/list?archived=false" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.lists[] | {id, name, task_count}'
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
curl -s -X POST "https://api.clickup.com/api/v2/folder/<folder_id>/list" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name}'
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
curl -s -X PUT "https://api.clickup.com/api/v2/list/<list_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name}'
```

### Delete List

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/list/<list_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

---

## Tasks

### List Tasks in a List

```bash
curl -s "https://api.clickup.com/api/v2/list/<list_id>/task?archived=false" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.tasks[] | {id, name, status: .status.status, assignees: [.assignees[].username], due_date}'
```

### Get Task Details

```bash
curl -s "https://api.clickup.com/api/v2/task/<task_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '{id, name, description, status: .status.status, priority: .priority, due_date, assignees: [.assignees[].username]}'
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
curl -s -X POST "https://api.clickup.com/api/v2/list/<list_id>/task" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name, status: .status.status}'
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
curl -s -X POST "https://api.clickup.com/api/v2/list/<list_id>/task" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name, assignees: [.assignees[].username]}'
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
curl -s -X PUT "https://api.clickup.com/api/v2/task/<task_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '{id, name, status: .status.status}'
```

### Delete Task

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/task/<task_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

### Get Filtered Team Tasks

```bash
curl -s "https://api.clickup.com/api/v2/team/<team_id>/task?statuses[]=to%20do&statuses[]=in%20progress&assignees[]=<user_id>&page=0" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.tasks[] | {id, name, status: .status.status}'
```

---

## Comments

### List Task Comments

```bash
curl -s "https://api.clickup.com/api/v2/task/<task_id>/comment" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.comments[] | {id, comment_text, user: .user.username, date}'
```

### Create Task Comment

Write to `/tmp/clickup_request.json`:

```json
{
  "comment_text": "This is a comment on the task."
}
```

```bash
curl -s -X POST "https://api.clickup.com/api/v2/task/<task_id>/comment" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '.'
```

### Update Comment

Write to `/tmp/clickup_request.json`:

```json
{
  "comment_text": "Updated comment text."
}
```

```bash
curl -s -X PUT "https://api.clickup.com/api/v2/comment/<comment_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '.'
```

### Delete Comment

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/comment/<comment_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

---

## Time Tracking

### List Time Entries

```bash
curl -s "https://api.clickup.com/api/v2/team/<team_id>/time_entries" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.data[] | {id, task: .task.name, duration, start, end}'
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
curl -s -X POST "https://api.clickup.com/api/v2/team/<team_id>/time_entries" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" --header "Content-Type: application/json" -d @/tmp/clickup_request.json | jq '.data | {id, duration, start}'
```

### Delete Time Entry

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/team/<team_id>/time_entries/<timer_id>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

---

## Tags

### List Space Tags

```bash
curl -s "https://api.clickup.com/api/v2/space/<space_id>/tag" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)" | jq '.tags[] | {name, tag_fg, tag_bg}'
```

### Add Tag to Task

```bash
curl -s -X POST "https://api.clickup.com/api/v2/task/<task_id>/tag/<tag_name>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
```

### Remove Tag from Task

```bash
curl -s -X DELETE "https://api.clickup.com/api/v2/task/<task_id>/tag/<tag_name>" --header "Authorization: Bearer $(printenv CLICKUP_TOKEN)"
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
