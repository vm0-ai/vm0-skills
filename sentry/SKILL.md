---
name: sentry
description: Sentry API via curl. Use this skill to manage error tracking, list issues, resolve errors, and monitor releases in Sentry.
vm0_env:
  - SENTRY_HOST
  - SENTRY_TOKEN
  - SENTRY_ORG
---

# Sentry API

Use the Sentry API via direct `curl` calls to manage **error tracking, issues, projects, and releases**.

> Official docs: `https://docs.sentry.io/api/`

---

## When to Use

Use this skill when you need to:

- **List and search issues** - find errors and exceptions
- **Resolve or ignore issues** - manage issue status
- **View issue details** - get stack traces and event data
- **Manage projects** - list and configure projects
- **Track releases** - create and monitor releases
- **View events** - get detailed error events

---

## Prerequisites

1. Go to Sentry → Settings → Developer Settings → Internal Integrations
2. Create a new Internal Integration with required scopes (see below)
3. Copy the generated token

```bash
export SENTRY_HOST="sentry.io" # Or your self-hosted Sentry domain
export SENTRY_TOKEN="sntrys_..." # Auth token from Internal Integration
export SENTRY_ORG="your-org-slug" # Your organization slug
```

### Required Scopes

- `project:read` - List and view projects
- `event:read` - View issues and events
- `event:write` - Update issues (resolve, ignore, assign)
- `release:read` - View releases
- `release:write` - Create releases

---


> **Important:** Do not pipe `curl` output directly to `jq` (e.g., `curl ... | jq`). Due to a Claude Code bug, environment variables in curl headers are silently cleared when pipes are used. Instead, use a two-step pattern:
> ```bash
> curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" > /tmp/response.json
> cat /tmp/response.json | jq .
> ```

## How to Use

All examples below assume `SENTRY_HOST`, `SENTRY_TOKEN`, and `SENTRY_ORG` are set.

Base URL: `https://${SENTRY_HOST}/api/0`

---

### 1. List Your Projects

Get all projects you have access to:

```bash
curl -s "https://${SENTRY_HOST}/api/0/projects/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_eb121f.json
cat /tmp/resp_eb121f.json | jq '.[] | {slug, name, platform, dateCreated}'
```

---

### 2. Get Project Details

Get details for a specific project:

```bash
PROJECT_SLUG="my-project"

curl -s "https://${SENTRY_HOST}/api/0/projects/${SENTRY_ORG}/${PROJECT_SLUG}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_5209e4.json
cat /tmp/resp_5209e4.json | jq '{slug, name, platform, status, dateCreated}'
```

---

### 3. List Organization Issues

Get all issues across the organization:

```bash
curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_c1db5f.json
cat /tmp/resp_c1db5f.json | jq '.[] | {id, shortId, title, culprit, status, count, userCount, firstSeen, lastSeen}'
```

Query parameters:
- `query=is:unresolved` - Filter by status
- `query=error.type:TypeError` - Filter by error type
- `sort=date` - Sort by last seen (default)
- `sort=new` - Sort by first seen
- `sort=freq` - Sort by event count

---

### 4. List Project Issues

Get issues for a specific project:

```bash
PROJECT_SLUG="my-project"

curl -s "https://${SENTRY_HOST}/api/0/projects/${SENTRY_ORG}/${PROJECT_SLUG}/issues/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_21045c.json
cat /tmp/resp_21045c.json | jq '.[] | {id, shortId, title, status, count, lastSeen}'
```

---

### 5. Search Issues

Search issues with query:

```bash
curl -s -G "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --data-urlencode "query=is:unresolved level:error" > /tmp/resp_92cbbb.json
cat /tmp/resp_92cbbb.json | jq '.[] | {shortId, title, level, count}'
```

Common query filters:
- `is:unresolved` / `is:resolved` / `is:ignored` - By status
- `level:error` / `level:warning` / `level:info` - By level
- `assigned:me` / `assigned:none` - By assignee
- `browser:Chrome` - By browser
- `os:Windows` - By OS
- `release:1.0.0` - By release version

---

### 6. Get Issue Details

Get details for a specific issue:

```bash
ISSUE_ID="123456789"

curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_f2dfaf.json
cat /tmp/resp_f2dfaf.json | jq '{id, shortId, title, culprit, status, level, count, userCount, firstSeen, lastSeen, assignedTo}'
```

---

### 7. Get Latest Event for Issue

Get the most recent event for an issue:

```bash
ISSUE_ID="123456789"

curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/events/latest/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_ba7688.json
cat /tmp/resp_ba7688.json | jq '{eventID, message, platform, dateCreated, tags, contexts}'
```

---

### 8. List Issue Events

Get all events for an issue:

```bash
ISSUE_ID="123456789"

curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/events/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_f70a35.json
cat /tmp/resp_f70a35.json | jq '.[] | {eventID, message, dateCreated}'
```

---

### 9. Resolve Issue

Mark an issue as resolved:

```bash
ISSUE_ID="123456789"

curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{"status": "resolved"}' > /tmp/resp_3989f8.json
cat /tmp/resp_3989f8.json | jq '{id, shortId, status}'
```

---

### 10. Resolve in Next Release

Mark issue as resolved in next release:

```bash
ISSUE_ID="123456789"

curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{"status": "resolvedInNextRelease"}' > /tmp/resp_67ca2a.json
cat /tmp/resp_67ca2a.json | jq '{id, shortId, status}'
```

---

### 11. Ignore Issue

Ignore an issue:

```bash
ISSUE_ID="123456789"

curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{"status": "ignored"}' > /tmp/resp_e791c5.json
cat /tmp/resp_e791c5.json | jq '{id, shortId, status}'
```

Ignore with duration (in minutes):

```bash
curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{"status": "ignored", "statusDetails": {"ignoreDuration": 60}}' > /tmp/resp_fdc632.json
cat /tmp/resp_fdc632.json | jq '{id, shortId, status}'
```

---

### 12. Unresolve Issue

Reopen a resolved issue:

```bash
ISSUE_ID="123456789"

curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{"status": "unresolved"}' > /tmp/resp_03991b.json
cat /tmp/resp_03991b.json | jq '{id, shortId, status}'
```

---

### 13. Assign Issue

Assign an issue to a user:

```bash
ISSUE_ID="123456789"
USER_EMAIL="developer@example.com"

curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d "{\"assignedTo\": \"${USER_EMAIL}\"}" > /tmp/resp_f4dba4.json
cat /tmp/resp_f4dba4.json | jq '{id, shortId, assignedTo}'
```

---

### 14. Bulk Update Issues

Update multiple issues at once:

```bash
curl -s -X PUT "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d '{
  "id": ["123456789", "987654321"],
  "status": "resolved"
}' > /tmp/resp_a9fc9b.json
cat /tmp/resp_a9fc9b.json | jq '.'
```

---

### 15. Delete Issue

Delete an issue (requires admin permissions):

```bash
ISSUE_ID="123456789"

curl -s -X DELETE "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/issues/${ISSUE_ID}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" -w "\nHTTP Status: %{http_code}"
```

---

### 16. List Releases

Get all releases for the organization:

```bash
curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/releases/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_36c081.json
cat /tmp/resp_36c081.json | jq '.[] | {version, dateCreated, newGroups, projects: [.projects[].slug]}'
```

---

### 17. Get Release Details

Get details for a specific release:

```bash
RELEASE_VERSION="1.0.0"

curl -s "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/releases/${RELEASE_VERSION}/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_f17ff1.json
cat /tmp/resp_f17ff1.json | jq '{version, dateCreated, dateReleased, newGroups, lastEvent, projects}'
```

---

### 18. Create Release

Create a new release:

```bash
PROJECT_SLUG="my-project"

curl -s -X POST "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/releases/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d "{
  \"version\": \"1.0.1\",
  \"projects\": [\"${PROJECT_SLUG}\"]
}" | jq '{version, dateCreated}'
```

---

### 19. Create Release with Commits

Create release with associated commits:

```bash
PROJECT_SLUG="my-project"

curl -s -X POST "https://${SENTRY_HOST}/api/0/organizations/${SENTRY_ORG}/releases/" --header "Authorization: Bearer ${SENTRY_TOKEN}" --header "Content-Type: application/json" -d "{
  \"version\": \"1.0.2\",
  \"projects\": [\"${PROJECT_SLUG}\"],
  \"refs\": [{
  \"repository\": \"owner/repo\",
  \"commit\": \"abc123def456\"
  }]
}" | jq '{version, dateCreated}'
```

---

### 20. List Project Error Events

Get recent error events for a project:

```bash
PROJECT_SLUG="my-project"

curl -s "https://${SENTRY_HOST}/api/0/projects/${SENTRY_ORG}/${PROJECT_SLUG}/events/" --header "Authorization: Bearer ${SENTRY_TOKEN}" > /tmp/resp_e62cb8.json
cat /tmp/resp_e62cb8.json | jq '.[] | {eventID, title, message, dateCreated}'
```

---

## Issue Status Values

| Status | Description |
|--------|-------------|
| `unresolved` | Active issue (default) |
| `resolved` | Manually resolved |
| `resolvedInNextRelease` | Auto-resolve on next release |
| `ignored` | Ignored (won't alert) |

---

## Guidelines

1. **Use organization slug**: Most endpoints use org slug, not ID
2. **Pagination**: Use `cursor` parameter for paginated results
3. **Query syntax**: Use Sentry's query language for powerful filtering
4. **Rate limits**: Sentry has rate limits; implement backoff for 429 responses
5. **Self-hosted**: For self-hosted Sentry, set `SENTRY_HOST` to your domain
6. **Scopes matter**: Ensure your token has required scopes for each operation
