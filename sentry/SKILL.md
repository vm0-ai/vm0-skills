---
name: sentry
description: Sentry API for error tracking. Use when user mentions "Sentry", "error
  tracking", "crash report", "exceptions", or asks about monitoring errors.
---

# Sentry API

Manage error tracking, issues, releases, monitors, and projects via the Sentry REST API.

> Official docs: https://docs.sentry.io/api/

---

## When to Use

Use this skill when you need to:

- List, search, resolve, or ignore issues
- View error events, stack traces, and event details
- Manage releases and deployments
- Configure monitors (cron monitoring)
- Manage alert rules
- View and manage projects and teams

---

## Prerequisites

Connect Sentry via the vm0 connector. The access token is provided as `$SENTRY_TOKEN`.

Base URL: `https://sentry.io/api/0`

> **Important:** Most endpoints require an organization slug. Call the organizations endpoint first to discover it.

---

## Organizations

### List Organizations

```bash
curl -s "https://sentry.io/api/0/organizations/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Organization

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Projects

### List Organization Projects

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/projects/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Project

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Update Project

```bash
curl -s -X PUT "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Updated Project Name\", \"slug\": \"updated-slug\"}"
```

### Delete Project

```bash
curl -s -X DELETE "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Issues

### List Organization Issues

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/issues/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

Params: `query` (Sentry search syntax), `sort` (`date`/`new`/`freq`/`priority`), `cursor`, `limit`.

### Search Issues

Use `query` param with Sentry search syntax and `-G` with `--data-urlencode`:

```bash
curl -s -G "https://sentry.io/api/0/organizations/<org-slug>/issues/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --data-urlencode "query=is:unresolved level:error"
```

Common queries: `is:unresolved`, `is:resolved`, `level:error`, `error.type:TypeError`, `assigned:me`, `first-release:1.0.0`.

### List Project Issues

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/issues/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Issue

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Resolve Issue

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"resolved\"}"
```

### Ignore Issue

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"ignored\"}"
```

### Unresolve Issue

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"unresolved\"}"
```

### Assign Issue

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"assignedTo\": \"user@example.com\"}"
```

### Bulk Update Issues

```bash
curl -s -X PUT "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/issues/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"resolved\", \"id\": [\"<issue-id-1>\", \"<issue-id-2>\"]}"
```

### Delete Issue

```bash
curl -s -X DELETE "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Events

### Get Latest Event for Issue

> **Note:** This endpoint is documented by Sentry but may not be in the OpenAPI spec. If it returns a firewall error, use List Issue Events with `limit=1` instead.

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/events/latest/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### List Issue Events

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/issues/<issue-id>/events/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### List Project Events

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/events/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Event by ID

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/events/<event-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Releases

### List Releases

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/releases/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Release

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/releases/<version>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Create Release

```bash
curl -s -X POST "https://sentry.io/api/0/organizations/<org-slug>/releases/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"version\": \"2.0.0\", \"projects\": [\"<project-slug>\"]}"
```

### Update Release

```bash
curl -s -X PUT "https://sentry.io/api/0/organizations/<org-slug>/releases/<version>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"dateReleased\": \"2026-04-08T12:00:00Z\"}"
```

### Delete Release

```bash
curl -s -X DELETE "https://sentry.io/api/0/organizations/<org-slug>/releases/<version>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### List Release Commits

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/releases/<version>/commits/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Monitors (Cron)

### List Monitors

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/monitors/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Monitor

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/monitors/<monitor-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Monitor Check-Ins

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/monitors/<monitor-slug>/checkins/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Update Monitor

```bash
curl -s -X PUT "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/monitors/<monitor-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Updated Monitor\", \"schedule\": {\"type\": \"crontab\", \"value\": \"0 * * * *\"}}"
```

### Delete Monitor

```bash
curl -s -X DELETE "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/monitors/<monitor-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Alert Rules

### List Alert Rules

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/alert-rules/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Alert Rule

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/alert-rules/<rule-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Project Rules (Issue Alerts)

### List Project Rules

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/rules/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Rule

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/rules/<rule-id>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Teams

### List Organization Teams

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/teams/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### Get Team

```bash
curl -s "https://sentry.io/api/0/teams/<org-slug>/<team-slug>/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

### List Team's Projects

```bash
curl -s "https://sentry.io/api/0/teams/<org-slug>/<team-slug>/projects/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Members

### List Organization Members

```bash
curl -s "https://sentry.io/api/0/organizations/<org-slug>/members/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
```

---

## Environments

### List Project Environments

```bash
curl -s "https://sentry.io/api/0/projects/<org-slug>/<project-slug>/environments/" \
  --header "Authorization: Bearer $SENTRY_TOKEN"
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

1. **Discover org slug first**: Call `GET /organizations/` to get your org slug before using other endpoints.
2. **Use organization endpoints**: List projects via `GET /organizations/{org}/projects/`, not `GET /projects/` (which is not in the API spec).
3. **Pagination**: Use `cursor` parameter. Response includes `Link` header with next/prev cursors.
4. **Search syntax**: Issues support Sentry's query language: `is:unresolved`, `level:error`, `assigned:me`, `first-release:`, `error.type:`, etc.
5. **Rate limits**: Back off on 429 responses.
6. **Scopes**: Ensure token has required scopes (`project:read`, `event:read`, `org:read`, etc.).

---

## How to Look Up More API Details

- **API Reference**: https://docs.sentry.io/api/
- **Issues**: https://docs.sentry.io/api/events/
- **Projects**: https://docs.sentry.io/api/projects/
- **Releases**: https://docs.sentry.io/api/releases/
- **Monitors**: https://docs.sentry.io/api/crons/
- **Teams**: https://docs.sentry.io/api/teams/
- **Scopes**: https://docs.sentry.io/api/permissions/
