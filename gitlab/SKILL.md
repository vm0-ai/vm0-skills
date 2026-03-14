---
name: gitlab
description: GitLab API for repos and CI/CD. Use when user mentions "GitLab", "gitlab.com",
  shares a GitLab link, "GitLab repo", or asks about GitLab projects.
vm0_secrets:
  - GITLAB_TOKEN
vm0_vars:
  - GITLAB_HOST
---

# GitLab API

Use the GitLab REST API via direct `curl` calls to manage **projects, issues, merge requests, and pipelines**.

> Official docs: `https://docs.gitlab.com/ee/api/`

---

## When to Use

Use this skill when you need to:

- **Manage projects** - list, create, get project details
- **Handle issues** - create, update, close, list issues
- **Work with merge requests** - create, list, merge MRs
- **Check pipelines** - list jobs, view pipeline status
- **Manage users** - search users, get user info

---

## Prerequisites

1. Go to GitLab → User Settings → Access Tokens
2. Create a personal access token with `api` scope
3. Copy the generated token

```bash
export GITLAB_HOST="gitlab.com" # Or your self-hosted GitLab domain
export GITLAB_TOKEN="glpat-xxxxxxxxxxxx" # Personal access token with api scope
```

#
### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/gitlab-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $GITLAB_TOKEN" "$@"
EOF
chmod +x /tmp/gitlab-curl
```

**Usage:** All examples below use `/tmp/gitlab-curl` instead of direct `curl` calls.

## Rate Limits

GitLab.com has rate limits of ~2000 requests per minute for authenticated users. Self-hosted instances may vary.

---


## How to Use

All examples below assume `GITLAB_HOST` and `GITLAB_TOKEN` are set.

Base URL: `https://${GITLAB_HOST}/api/v4`

> Note: Project IDs can be numeric (e.g., `123`) or URL-encoded paths (e.g., `mygroup%2Fmyproject`).

---

### 1. Get Current User

Verify your authentication:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/user" | jq '{id, username, name, email, state}'
```

---

### 2. List Projects

Get projects accessible to you:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects?membership=true&per_page=20" | jq '.[] | {id, path_with_namespace, visibility, default_branch}'
```

Filter options:
- `membership=true` - Only projects you're a member of
- `owned=true` - Only projects you own
- `search=keyword` - Search by name
- `visibility=public|internal|private` - Filter by visibility

---

### 3. Get Project Details

Get details for a specific project. Replace `<project-id>` with the numeric project ID or URL-encoded path (e.g., `mygroup%2Fmyproject`):

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>" | jq '{id, name, path_with_namespace, default_branch, visibility, web_url}
```

---

### 4. List Project Issues

Get issues for a project. Replace `<project-id>` with the numeric project ID or URL-encoded path:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues?state=opened&per_page=20" | jq '.[] | {iid, title, state, author: .author.username, labels, web_url}'
```

Filter options:
- `state=opened|closed|all` - Filter by state
- `labels=bug,urgent` - Filter by labels
- `assignee_id=123` - Filter by assignee
- `search=keyword` - Search in title/description

---

### 5. Get Issue Details

Get a specific issue. Replace `<project-id>` and `<issue-iid>` with actual values:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues/<issue-iid>" | jq '{iid, title, description, state, author: .author.username, assignees: [.assignees[].username], labels, created_at, web_url}'
```

---

### 6. Create Issue

Create a new issue in a project. Replace `<project-id>` with the actual project ID:

Write to `/tmp/gitlab_request.json`:

```json
{
  "title": "Bug: Login page not loading",
  "description": "The login page shows a blank screen on mobile devices.",
  "labels": "bug,frontend"
}
```

Then run:

```bash
/tmp/gitlab-curl -X POST "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues" -d @/tmp/gitlab_request.json | jq '{iid, title, web_url}'
```

---

### 7. Create Issue with Assignee and Milestone

Create issue with additional fields. Replace `<project-id>`, `<assignee-id>`, and `<milestone-id>` with actual IDs:

Write to `/tmp/gitlab_request.json`:

```json
{
  "title": "Implement user profile page",
  "description": "Create a user profile page with avatar and bio.",
  "assignee_ids": [<assignee-id>],
  "milestone_id": <milestone-id>,
  "labels": "feature,frontend"
}
```

Then run:

```bash
/tmp/gitlab-curl -X POST "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues" -d @/tmp/gitlab_request.json | jq '{iid, title, web_url}'
```

---

### 8. Update Issue

Update an existing issue. Replace `<project-id>` and `<issue-iid>` with actual values:

Write to `/tmp/gitlab_request.json`:

```json
{
  "title": "Updated: Bug fix for login page",
  "labels": "bug,frontend,in-progress"
}
```

Then run:

```bash
/tmp/gitlab-curl -X PUT "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues/<issue-iid>" -d @/tmp/gitlab_request.json | jq '{iid, title, labels, updated_at}'
```

---

### 9. Close Issue

Close an issue. Replace `<project-id>` and `<issue-iid>` with actual values:

Write to `/tmp/gitlab_request.json`:

```json
{
  "state_event": "close"
}
```

Then run:

```bash
/tmp/gitlab-curl -X PUT "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues/<issue-iid>" -d @/tmp/gitlab_request.json | jq '{iid, title, state}'
```

Use `"state_event": "reopen"` to reopen a closed issue.

---

### 10. Add Comment to Issue

Add a note/comment to an issue. Replace `<project-id>` and `<issue-iid>` with actual values:

Write to `/tmp/gitlab_request.json`:

```json
{
  "body": "Investigating this issue. Will update soon."
}
```

Then run:

```bash
/tmp/gitlab-curl -X POST "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues/<issue-iid>/notes" -d @/tmp/gitlab_request.json | jq '{id, body, author: .author.username, created_at}'
```

---

### 11. List Merge Requests

Get merge requests for a project. Replace `<project-id>` with the actual project ID:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/merge_requests?state=opened&per_page=20" | jq '.[] | {iid, title, state, source_branch, target_branch, author: .author.username, web_url}'
```

Filter options:
- `state=opened|closed|merged|all` - Filter by state
- `scope=created_by_me|assigned_to_me|all` - Filter by involvement
- `labels=review-needed` - Filter by labels

---

### 12. Get Merge Request Details

Get a specific merge request. Replace `<project-id>` and `<mr-iid>` with actual values:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/merge_requests/<mr-iid>" | jq '{iid, title, state, source_branch, target_branch, author: .author.username, merge_status, has_conflicts, web_url}'
```

---

### 13. Create Merge Request

Create a new merge request. Replace `<project-id>` with the actual project ID:

Write to `/tmp/gitlab_request.json`:

```json
{
  "source_branch": "feature/user-profile",
  "target_branch": "main",
  "title": "Add user profile page",
  "description": "This MR adds a new user profile page with avatar support."
}
```

Then run:

```bash
/tmp/gitlab-curl -X POST "https://${GITLAB_HOST}/api/v4/projects/<project-id>/merge_requests" -d @/tmp/gitlab_request.json | jq '{iid, title, web_url}'
```

---

### 14. Merge a Merge Request

Merge an MR (if it's ready). Replace `<project-id>` and `<mr-iid>` with actual values:

Write to `/tmp/gitlab_request.json`:

```json
{
  "merge_when_pipeline_succeeds": true
}
```

Then run:

```bash
/tmp/gitlab-curl -X PUT "https://${GITLAB_HOST}/api/v4/projects/<project-id>/merge_requests/<mr-iid>/merge" -d @/tmp/gitlab_request.json | jq '{iid, title, state, merged_by: .merged_by.username}'
```

Options:
- `merge_when_pipeline_succeeds=true` - Auto-merge when pipeline passes
- `squash=true` - Squash commits before merging
- `should_remove_source_branch=true` - Delete source branch after merge

---

### 15. List Pipelines

Get pipelines for a project. Replace `<project-id>` with the actual project ID:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/pipelines?per_page=10" | jq '.[] | {id, status, ref, sha: .sha[0:8], created_at, web_url}'
```

---

### 16. Get Pipeline Details

Get details of a specific pipeline. Replace `<project-id>` and `<pipeline-id>` with actual values:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/pipelines/<pipeline-id>" | jq '{id, status, ref, duration, finished_at, web_url}'
```

---

### 17. List Pipeline Jobs

Get jobs in a pipeline. Replace `<project-id>` and `<pipeline-id>` with actual values:

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/projects/<project-id>/pipelines/<pipeline-id>/jobs" | jq '.[] | {id, name, stage, status, duration}'
```

---

### 18. Search Users

Search for users:

Write to `/tmp/gitlab_search.txt`:

```
john
```

```bash
/tmp/gitlab-curl "https://${GITLAB_HOST}/api/v4/users" | jq '.[] | {id, username, name, state}'
```

---

### 19. Create Project

Create a new project:

Write to `/tmp/gitlab_request.json`:

```json
{
  "name": "my-new-project",
  "visibility": "private",
  "initialize_with_readme": true
}
```

Then run:

```bash
/tmp/gitlab-curl -X POST "https://${GITLAB_HOST}/api/v4/projects" -d @/tmp/gitlab_request.json | jq '{id, path_with_namespace, web_url}'
```

---

### 20. Delete Issue

Delete an issue (requires admin or owner permissions). Replace `<project-id>` and `<issue-iid>` with actual values:

```bash
/tmp/gitlab-curl -X DELETE "https://${GITLAB_HOST}/api/v4/projects/<project-id>/issues/<issue-iid>"
```

Returns 204 No Content on success.

---

## Project ID Encoding

When using project paths instead of numeric IDs, URL-encode the path:

- `mygroup/myproject` → `mygroup%2Fmyproject`
- `mygroup/subgroup/myproject` → `mygroup%2Fsubgroup%2Fmyproject`

```bash
# Using numeric ID
PROJECT_ID="123"

# Using encoded path
PROJECT_ID="mygroup%2Fmyproject"
```

---

## Guidelines

1. **Use IID for issues/MRs**: Within a project, use `iid` (internal ID like #1, #2) not the global `id`
2. **URL-encode project paths**: If using paths instead of numeric IDs, encode slashes as `%2F`
3. **Handle pagination**: Use `per_page` and `page` params for large result sets
4. **Check merge status**: Before merging, verify `merge_status` is `can_be_merged`
5. **Rate limiting**: Implement backoff if you receive 429 responses
6. **Self-hosted GitLab**: Set `GITLAB_HOST` to your instance domain (without https://)
