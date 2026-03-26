---
name: sentry
description: Sentry API for error tracking. Use when user mentions "Sentry", "error
  tracking", "crash report", "exceptions", or asks about monitoring errors.
vm0_secrets:
  - SENTRY_TOKEN
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


Verify authentication:

```bash
curl -s "https://sentry.io/api/0/organizations/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[0] | {slug, name}'
```

### Discovering Your Organization Slug

Most endpoints require your organization slug. Get it from the organizations endpoint above — the `slug` field is what you need.

---

## How to Use

All examples below assume `SENTRY_TOKEN` is set. Replace `my-org` with your actual organization slug from the prerequisites step.

Base URL: `https://sentry.io/api/0`

---

### 1. List Organizations

Get all organizations you have access to:

```bash
curl -s "https://sentry.io/api/0/organizations/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {slug, name, dateCreated}'
```

---

### 2. List Your Projects

Get all projects you have access to:

```bash
curl -s "https://sentry.io/api/0/projects/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {slug, name, platform, dateCreated}'
```

---

### 3. Get Project Details

Get details for a specific project:

> **Note:** Replace `my-org` with your organization slug and `my-project` with your actual project slug from the "List Your Projects" output.

```bash
curl -s "https://sentry.io/api/0/projects/my-org/my-project/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '{slug, name, platform, status, dateCreated}'
```

---

### 4. List Organization Issues

Get all issues across the organization:

> **Note:** Replace `my-org` with your organization slug.

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/issues/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {id, shortId, title, culprit, status, count, userCount, firstSeen, lastSeen}'
```

Query parameters:
- `query=is:unresolved` - Filter by status
- `query=error.type:TypeError` - Filter by error type
- `sort=date` - Sort by last seen (default)
- `sort=new` - Sort by first seen
- `sort=freq` - Sort by event count

---

### 5. List Project Issues

Get issues for a specific project:

> **Note:** Replace `my-org` and `my-project` with your actual values.

```bash
curl -s "https://sentry.io/api/0/projects/my-org/my-project/issues/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {id, shortId, title, status, count, lastSeen}'
```

---

### 6. Search Issues

Search issues with query:

> **Note:** Replace `my-org` with your organization slug.

```bash
curl -s -G "https://sentry.io/api/0/organizations/my-org/issues/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" --data-urlencode "query=is:unresolved level:error" | jq '.[] | {shortId, title, level, count}'
```

---

### 7. Get Issue Details

Get details for a specific issue:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID from the "List Issues" output (use the `id` field, not `shortId`).

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/issues/123456789/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '{id, shortId, title, culprit, status, level, count, userCount, firstSeen, lastSeen, assignedTo}'
```

---

### 8. Get Latest Event for Issue

Get the most recent event for an issue:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID.

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/issues/123456789/events/latest/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '{eventID, message, platform, dateCreated, tags, contexts}'
```

---

### 9. List Issue Events

Get all events for an issue:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID.

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/issues/123456789/events/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {eventID, message, dateCreated}'
```

---

### 10. Resolve Issue

Mark an issue as resolved:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID.

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/my-org/issues/123456789/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" -H "Content-Type: application/json" -d '{"status":"resolved"}' | jq '{id, shortId, status}'
```

---

### 11. Ignore Issue

Ignore an issue:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID.

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/my-org/issues/123456789/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" -H "Content-Type: application/json" -d '{"status":"ignored"}' | jq '{id, shortId, status}'
```

---

### 12. Unresolve Issue

Reopen a resolved issue:

> **Note:** Replace `my-org` with your organization slug and `123456789` with an actual issue ID.

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/my-org/issues/123456789/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" -H "Content-Type: application/json" -d '{"status":"unresolved"}' | jq '{id, shortId, status}'
```

---

### 13. List Releases

Get all releases for the organization:

> **Note:** Replace `my-org` with your organization slug.

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/releases/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {version, dateCreated, newGroups, projects: [.projects[].slug]}'
```

---

### 14. Get Release Details

Get details for a specific release:

> **Note:** Replace `my-org` with your organization slug and `1.0.0` with an actual release version.

```bash
curl -s "https://sentry.io/api/0/organizations/my-org/releases/1.0.0/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '{version, dateCreated, dateReleased, newGroups, lastEvent, projects}'
```

---

### 15. List Project Error Events

Get recent error events for a project:

> **Note:** Replace `my-org` and `my-project` with your actual values.

```bash
curl -s "https://sentry.io/api/0/projects/my-org/my-project/events/" -H "Authorization: Bearer $(printenv SENTRY_TOKEN)" | jq '.[] | {eventID, title, message, dateCreated}'
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

1. **Discover org slug first**: Call the organizations endpoint to get your org slug before using other endpoints
2. **Pagination**: Use `cursor` parameter for paginated results
3. **Query syntax**: Use Sentry's query language for powerful filtering
4. **Rate limits**: Sentry has rate limits; implement backoff for 429 responses
5. **Scopes matter**: Ensure your token has required scopes for each operation
