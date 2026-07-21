---
name: topvisor
description: Topvisor API v2 for SEO projects, keyword management, rank tracking,
  SERP data, and site audits. Use when user mentions "Topvisor", "rank tracking",
  "keyword positions", "SERP history", or managing SEO projects and keywords.
---

# Topvisor

Use Topvisor API v2 to manage SEO projects and keywords, retrieve search-ranking
history, and work with other Topvisor SEO services.

> Official docs: `https://topvisor.com/api/v2/`

---

## When to Use

Use this skill when you need to:

- List or manage Topvisor SEO projects
- Organize keyword groups and tracked keywords
- Retrieve keyword position history for a project and search region
- Call Topvisor API v2 services such as SERP snapshots and site audits

---

## Prerequisites

Connect the **Topvisor** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).
The connector requires both the Topvisor **User ID** and **API Key** from Account
Settings. Topvisor requires a funded account balance before an API key can be
created.

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name TOPVISOR_USER_ID`, `zero doctor check-connector --env-name TOPVISOR_TOKEN`, or `zero doctor check-connector --url https://api.topvisor.com/v2/json/get/projects_2/projects --method POST`.

---

## How to Use

Topvisor API v2 accepts only `POST` requests. Every request must send the User ID
and API key in separate headers.

### 1. List Projects

Set `show_searchers_and_regions` to `1` to include each project's enabled search
engines and regions. Write to `/tmp/topvisor_projects.json`:

```json
{
  "show_searchers_and_regions": 1,
  "limit": 100,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/get/projects_2/projects" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_projects.json
```

Docs: `https://topvisor.com/api/v2-services/projects_2/projects/`

### 2. List Keyword Groups

Replace `123456` with a project ID returned by the projects request. Write to
`/tmp/topvisor_groups.json`:

```json
{
  "project_id": 123456,
  "limit": 100,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/get/keywords_2/groups" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_groups.json
```

Docs: `https://topvisor.com/api/v2-services/keywords_2/groups/`

### 3. List Tracked Keywords

Replace `123456` with the project ID. Write to `/tmp/topvisor_keywords.json`:

```json
{
  "project_id": 123456,
  "limit": 100,
  "offset": 0,
  "show_trash": false
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/get/keywords_2/keywords" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_keywords.json
```

Docs: `https://topvisor.com/api/v2-services/keywords_2/keywords/`

### 4. Get Position History

Replace `123456` with the project ID, `0` with an enabled region index returned
by the projects request, and the example dates with the requested range. Write to
`/tmp/topvisor_positions.json`:

```json
{
  "project_id": 123456,
  "regions_indexes": [0],
  "date1": "2026-07-01",
  "date2": "2026-07-21",
  "show_headers": true,
  "show_exists_dates": true,
  "limit": 100,
  "offset": 0
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/get/positions_2/history" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_positions.json
```

Docs: `https://topvisor.com/api/v2-services/positions_2/history/`

### 5. Create a Project

This changes account state. Confirm the domain and project name before running.
Write to `/tmp/topvisor_create_project.json`:

```json
{
  "url": "example.com",
  "name": "Example SEO Project"
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/add/projects_2/projects" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_create_project.json
```

Docs: `https://topvisor.com/api/v2-services/projects_2/projects/add/`

### 6. Add a Tracked Keyword

This changes account state. Replace `123456` with the project ID and `789012`
with the target keyword group ID. Write to `/tmp/topvisor_add_keyword.json`:

```json
{
  "project_id": 123456,
  "to_id": 789012,
  "to_type": "in_group",
  "name": "example search keyword",
  "target": "https://example.com/target-page"
}
```

```bash
curl -s -X POST "https://api.topvisor.com/v2/json/add/keywords_2/keywords" --header "User-Id: $TOPVISOR_USER_ID" --header "Authorization: bearer $TOPVISOR_TOKEN" --header "Content-Type: application/json" -d @/tmp/topvisor_add_keyword.json
```

Docs: `https://topvisor.com/api/v2-services/keywords_2/keywords/add/`

---

## Guidelines

1. **Always use POST**: Topvisor API v2 does not accept GET requests, including for read operations.
2. **Keep credentials separate**: Send `TOPVISOR_USER_ID` in `User-Id` and `TOPVISOR_TOKEN` in `Authorization: bearer ...`.
3. **Limit result sets**: Topvisor caps responses at 10,000 items; use `limit` and `offset` for pagination.
4. **Respect concurrency limits**: Do not run more than five concurrent requests for the same IP address and User ID.
5. **Confirm mutations**: Adding, editing, or deleting projects and keywords changes account state and may trigger paid Topvisor operations.
6. **Check API-level errors**: Inspect Topvisor's JSON `code`, `message`, and `errors` fields even when the HTTP request succeeds.
