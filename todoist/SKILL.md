---
name: todoist
description: Todoist API for task management. Use when user mentions "Todoist", "my
  tasks", "create todo", or asks about Todoist projects.
vm0_secrets:
  - TODOIST_TOKEN
---

# Todoist API

Manage tasks, projects, sections, labels, and comments with the Todoist REST API v2.

> Official docs: `https://developer.todoist.com/rest/v2`

## When to Use

- Create, update, complete, and delete tasks
- Organize tasks into projects and sections
- Add labels and comments to tasks
- List and filter tasks by project or label
- Manage projects (create, update, delete)

## Core APIs

### Get All Projects

```bash
curl -s "https://api.todoist.com/rest/v2/projects" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, name, color, is_favorite}'
```

Docs: https://developer.todoist.com/rest/v2/#get-all-projects

---

### Get Project

Replace `<project-id>` with the actual project ID:

```bash
curl -s "https://api.todoist.com/rest/v2/projects/<project-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '{id, name, comment_count, color, is_shared, is_favorite, url}'
```

---

### Create Project

Write to `/tmp/todoist_request.json`:

```json
{
  "name": "My New Project"
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/projects" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, name, url}'
```

Docs: https://developer.todoist.com/rest/v2/#create-a-new-project

---

### Update Project

Replace `<project-id>` with the actual project ID.

Write to `/tmp/todoist_request.json`:

```json
{
  "name": "Renamed Project",
  "color": "blue"
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/projects/<project-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, name, color}'
```

---

### Delete Project

Replace `<project-id>` with the actual project ID:

```bash
curl -s -X DELETE "https://api.todoist.com/rest/v2/projects/<project-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

A `204` response means success.

---

### Get Active Tasks

```bash
curl -s "https://api.todoist.com/rest/v2/tasks" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, content, description, project_id, priority, due: .due.date, labels}'
```

Docs: https://developer.todoist.com/rest/v2/#get-active-tasks

### Get Active Tasks by Project

Replace `<project-id>` with the actual project ID:

```bash
curl -s "https://api.todoist.com/rest/v2/tasks?project_id=<project-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, content, priority, due: .due.date}'
```

---

### Get Task

Replace `<task-id>` with the actual task ID:

```bash
curl -s "https://api.todoist.com/rest/v2/tasks/<task-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '{id, content, description, project_id, section_id, priority, due, labels, url}'
```

---

### Create Task

Write to `/tmp/todoist_request.json`:

```json
{
  "content": "Buy groceries",
  "description": "Milk, eggs, bread",
  "project_id": "<project-id>",
  "priority": 3,
  "due_string": "tomorrow at 10am",
  "labels": ["errands"]
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/tasks" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, content, due: .due.date, url}'
```

Docs: https://developer.todoist.com/rest/v2/#create-a-new-task

---

### Update Task

Replace `<task-id>` with the actual task ID.

Write to `/tmp/todoist_request.json`:

```json
{
  "content": "Buy groceries and snacks",
  "priority": 4
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, content, priority}'
```

---

### Complete Task

Replace `<task-id>` with the actual task ID:

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>/close" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

A `204` response means success.

Docs: https://developer.todoist.com/rest/v2/#close-a-task

---

### Reopen Task

Replace `<task-id>` with the actual task ID:

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>/reopen" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

---

### Delete Task

Replace `<task-id>` with the actual task ID:

```bash
curl -s -X DELETE "https://api.todoist.com/rest/v2/tasks/<task-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" -w "\nHTTP Status: %{http_code}\n"
```

---

### Get Sections

```bash
curl -s "https://api.todoist.com/rest/v2/sections" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, name, project_id, order}'
```

### Get Sections by Project

Replace `<project-id>` with the actual project ID:

```bash
curl -s "https://api.todoist.com/rest/v2/sections?project_id=<project-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, name, order}'
```

---

### Create Section

Write to `/tmp/todoist_request.json`:

```json
{
  "project_id": "<project-id>",
  "name": "Backlog"
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/sections" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, name, project_id}'
```

---

### Get Labels

```bash
curl -s "https://api.todoist.com/rest/v2/labels" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, name, color, order, is_favorite}'
```

### Create Label

Write to `/tmp/todoist_request.json`:

```json
{
  "name": "urgent",
  "color": "red"
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/labels" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, name, color}'
```

---

### Get Comments for Task

Replace `<task-id>` with the actual task ID:

```bash
curl -s "https://api.todoist.com/rest/v2/comments?task_id=<task-id>" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" | jq '.[] | {id, content, posted_at}'
```

### Create Comment

Write to `/tmp/todoist_request.json`:

```json
{
  "task_id": "<task-id>",
  "content": "This task needs review before closing."
}
```

```bash
curl -s -X POST "https://api.todoist.com/rest/v2/comments" --header "Authorization: Bearer $(printenv TODOIST_TOKEN)" --header "Content-Type: application/json" -d @/tmp/todoist_request.json | jq '{id, content, posted_at}'
```

---

## Guidelines

1. **Priority values**: 1 (normal) to 4 (urgent) — higher number = higher priority
2. **Due strings**: Todoist supports natural language like "tomorrow", "every monday", "Jan 15 at 3pm"
3. **Rate limits**: Standard rate limits apply; avoid rapid-fire requests
4. **Task IDs**: All IDs are strings; use values from list/create responses
5. **Completed tasks**: Use the `/close` endpoint, not delete, to mark tasks done
