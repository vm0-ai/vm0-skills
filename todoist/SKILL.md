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

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Todoist**. vm0 will automatically inject the required `TODOIST_TOKEN` environment variable.


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/todoist-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $TODOIST_TOKEN" "$@"
EOF
chmod +x /tmp/todoist-curl
```

**Usage:** All examples below use `/tmp/todoist-curl` instead of direct `curl` calls.

## Core APIs

### Get All Projects

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/projects" | jq '.[] | {id, name, color, is_favorite}'
```

Docs: https://developer.todoist.com/rest/v2/#get-all-projects

---

### Get Project

Replace `<project-id>` with the actual project ID:

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/projects/<project-id>" | jq '{id, name, comment_count, color, is_shared, is_favorite, url}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/projects" -d @/tmp/todoist_request.json | jq '{id, name, url}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/projects/<project-id>" -d @/tmp/todoist_request.json | jq '{id, name, color}'
```

---

### Delete Project

Replace `<project-id>` with the actual project ID:

```bash
/tmp/todoist-curl -X DELETE "https://api.todoist.com/rest/v2/projects/<project-id>"
```

A `204` response means success.

---

### Get Active Tasks

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/tasks" | jq '.[] | {id, content, description, project_id, priority, due: .due.date, labels}'
```

Docs: https://developer.todoist.com/rest/v2/#get-active-tasks

### Get Active Tasks by Project

Replace `<project-id>` with the actual project ID:

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/tasks?project_id=<project-id>" | jq '.[] | {id, content, priority, due: .due.date}'
```

---

### Get Task

Replace `<task-id>` with the actual task ID:

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/tasks/<task-id>" | jq '{id, content, description, project_id, section_id, priority, due, labels, url}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/tasks" -d @/tmp/todoist_request.json | jq '{id, content, due: .due.date, url}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>" -d @/tmp/todoist_request.json | jq '{id, content, priority}'
```

---

### Complete Task

Replace `<task-id>` with the actual task ID:

```bash
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>/close"
```

A `204` response means success.

Docs: https://developer.todoist.com/rest/v2/#close-a-task

---

### Reopen Task

Replace `<task-id>` with the actual task ID:

```bash
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/tasks/<task-id>/reopen"
```

---

### Delete Task

Replace `<task-id>` with the actual task ID:

```bash
/tmp/todoist-curl -X DELETE "https://api.todoist.com/rest/v2/tasks/<task-id>"
```

---

### Get Sections

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/sections" | jq '.[] | {id, name, project_id, order}'
```

### Get Sections by Project

Replace `<project-id>` with the actual project ID:

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/sections?project_id=<project-id>" | jq '.[] | {id, name, order}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/sections" -d @/tmp/todoist_request.json | jq '{id, name, project_id}'
```

---

### Get Labels

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/labels" | jq '.[] | {id, name, color, order, is_favorite}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/labels" -d @/tmp/todoist_request.json | jq '{id, name, color}'
```

---

### Get Comments for Task

Replace `<task-id>` with the actual task ID:

```bash
/tmp/todoist-curl "https://api.todoist.com/rest/v2/comments?task_id=<task-id>" | jq '.[] | {id, content, posted_at}'
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
/tmp/todoist-curl -X POST "https://api.todoist.com/rest/v2/comments" -d @/tmp/todoist_request.json | jq '{id, content, posted_at}'
```

---

## Guidelines

1. **Priority values**: 1 (normal) to 4 (urgent) — higher number = higher priority
2. **Due strings**: Todoist supports natural language like "tomorrow", "every monday", "Jan 15 at 3pm"
3. **Rate limits**: Standard rate limits apply; avoid rapid-fire requests
4. **Task IDs**: All IDs are strings; use values from list/create responses
5. **Completed tasks**: Use the `/close` endpoint, not delete, to mark tasks done
