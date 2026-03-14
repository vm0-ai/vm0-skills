---
name: asana
description: Asana API for tasks and projects. Use when user mentions "Asana", "asana.com",
  shares an Asana link, "Asana task", or asks about Asana workspace.
vm0_secrets:
  - ASANA_TOKEN
---

# Asana API

Manage tasks, projects, sections, tags, portfolios, and goals in Asana workspaces via the REST API.

> Official docs: `https://developers.asana.com/reference/rest-api-reference`

---

## When to Use

Use this skill when you need to:

- List workspaces and get current user info
- Create, update, delete, and search tasks
- Manage projects and sections within projects
- Add tags to tasks and manage tags
- List portfolios and goals
- Add followers or assignees to tasks

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Asana**. vm0 will automatically inject the required `ASANA_TOKEN` environment variable.

---


### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/asana-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $ASANA_TOKEN" "$@"
EOF
chmod +x /tmp/asana-curl
```

**Usage:** All examples below use `/tmp/asana-curl` instead of direct `curl` calls.

## How to Use

All examples below assume you have `ASANA_TOKEN` set.

Base URL: `https://app.asana.com/api/1.0`

Asana wraps all responses in a `data` field. Use `jq '.data'` to extract the actual content.

---

## User & Workspaces

### Get Current User

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/users/me" | jq '.data | {gid, name, email}'
```

### List Workspaces

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/workspaces" | jq '.data[] | {gid, name}'
```

---

## Projects

### List Projects in a Workspace

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/projects?workspace=<workspace-gid>&opt_fields=name,color,archived,created_at" | jq '.data[] | {gid, name, archived}'
```

### Get Project Details

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/projects/<project-gid>?opt_fields=name,notes,color,archived,created_at,modified_at,owner.name" | jq '.data'
```

### Create Project

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "My New Project",
    "notes": "Project description here",
    "workspace": "<workspace-gid>",
    "default_view": "list"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/projects" -d @/tmp/asana_request.json | jq '.data | {gid, name}'
```

### Update Project

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "Updated Project Name",
    "notes": "Updated description"
  }
}
```

```bash
/tmp/asana-curl -X PUT "https://app.asana.com/api/1.0/projects/<project-gid>" -d @/tmp/asana_request.json | jq '.data | {gid, name}'
```

### Delete Project

```bash
/tmp/asana-curl -X DELETE "https://app.asana.com/api/1.0/projects/<project-gid>"
```

---

## Tasks

### List Tasks in a Project

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/tasks?project=<project-gid>&opt_fields=name,completed,assignee.name,due_on,tags.name" | jq '.data[] | {gid, name, completed, due_on}'
```

### Get Task Details

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/tasks/<task-gid>?opt_fields=name,notes,completed,assignee.name,due_on,projects.name,tags.name,created_at,modified_at" | jq '.data'
```

### Create Task

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "My New Task",
    "notes": "Task description here",
    "projects": ["<project-gid>"],
    "due_on": "2026-04-01"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tasks" -d @/tmp/asana_request.json | jq '.data | {gid, name, due_on}'
```

### Create Task with Assignee

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "Assigned Task",
    "notes": "This task is assigned to someone",
    "projects": ["<project-gid>"],
    "assignee": "<user-gid>",
    "due_on": "2026-04-15"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tasks" -d @/tmp/asana_request.json | jq '.data | {gid, name, assignee}'
```

### Update Task

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "Updated Task Name",
    "due_on": "2026-05-01",
    "completed": false
  }
}
```

```bash
/tmp/asana-curl -X PUT "https://app.asana.com/api/1.0/tasks/<task-gid>" -d @/tmp/asana_request.json | jq '.data | {gid, name, completed, due_on}'
```

### Complete Task

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "completed": true
  }
}
```

```bash
/tmp/asana-curl -X PUT "https://app.asana.com/api/1.0/tasks/<task-gid>" -d @/tmp/asana_request.json | jq '.data | {gid, name, completed}'
```

### Delete Task

```bash
/tmp/asana-curl -X DELETE "https://app.asana.com/api/1.0/tasks/<task-gid>"
```

### Search Tasks in a Workspace

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/workspaces/<workspace-gid>/tasks/search?text=<search-text>&opt_fields=name,completed,assignee.name,due_on" | jq '.data[] | {gid, name, completed}'
```

---

## Sections

### List Sections in a Project

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/projects/<project-gid>/sections" | jq '.data[] | {gid, name}'
```

### Create Section

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "New Section"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/projects/<project-gid>/sections" -d @/tmp/asana_request.json | jq '.data | {gid, name}'
```

### Add Task to Section

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "task": "<task-gid>"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/sections/<section-gid>/addTask" -d @/tmp/asana_request.json
```

---

## Tags

### List Tags in a Workspace

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/tags?workspace=<workspace-gid>" | jq '.data[] | {gid, name}'
```

### Create Tag

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "Priority",
    "workspace": "<workspace-gid>"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tags" -d @/tmp/asana_request.json | jq '.data | {gid, name}'
```

### Add Tag to Task

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "tag": "<tag-gid>"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tasks/<task-gid>/addTag" -d @/tmp/asana_request.json
```

### Remove Tag from Task

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "tag": "<tag-gid>"
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tasks/<task-gid>/removeTag" -d @/tmp/asana_request.json
```

---

## Portfolios

### List Portfolios

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/portfolios?workspace=<workspace-gid>&owner=me&opt_fields=name,color,created_at" | jq '.data[] | {gid, name}'
```

### Get Portfolio Items

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/portfolios/<portfolio-gid>/items?opt_fields=name,created_at" | jq '.data[] | {gid, name}'
```

---

## Goals

### List Goals

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/goals?workspace=<workspace-gid>&opt_fields=name,status,due_on,owner.name" | jq '.data[] | {gid, name, status, due_on}'
```

---

## Subtasks

### List Subtasks

```bash
/tmp/asana-curl "https://app.asana.com/api/1.0/tasks/<task-gid>/subtasks?opt_fields=name,completed" | jq '.data[] | {gid, name, completed}'
```

### Create Subtask

Write to `/tmp/asana_request.json`:

```json
{
  "data": {
    "name": "My Subtask",
    "completed": false
  }
}
```

```bash
/tmp/asana-curl -X POST "https://app.asana.com/api/1.0/tasks/<task-gid>/subtasks" -d @/tmp/asana_request.json | jq '.data | {gid, name}'
```

---

## Guidelines

1. All responses are wrapped in a `data` field. Use `jq '.data'` to extract results.
2. Use `opt_fields` query parameter to request specific fields and reduce response size.
3. Asana uses `gid` (global ID) as the identifier for all resources.
4. Pagination: if the response has `next_page.uri`, fetch that URL to get more results.
5. Use `<placeholder>` for dynamic IDs that the user must replace (e.g., `<task-gid>`, `<project-gid>`).
6. Write request bodies to `/tmp/asana_request.json` before sending.
7. Rate limits: Asana allows ~1500 requests per minute. Back off on 429 responses.
8. Task search supports filters like `completed`, `assignee`, `projects`, and `text` as query parameters.
