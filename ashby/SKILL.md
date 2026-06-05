---
name: ashby
description: Ashby API for applicant tracking and recruiting. Use when user mentions "Ashby", "ATS", "applicant tracking", "candidate", "job application", "recruiting pipeline", "job posting", "opening", or "hiring project".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name ASHBY_TOKEN` or `zero doctor check-connector --url https://api.ashbyhq.com/application.list --method POST`

Ashby returns `401` when the key is missing and `403` when the key is wrong, deactivated, or lacks permission for the endpoint. A `403` response with `missing_endpoint_permission` means the key is valid but needs the relevant Ashby API permission.

## Authentication

All requests require HTTP Basic Auth with the API key as the username and an empty password. With `curl`, pass the token as:

```bash
-u "$ASHBY_TOKEN:"
```

Ashby's API is RPC-style: endpoints are usually `POST /resource.method`, and request parameters go in JSON bodies. Include both JSON headers on API calls:

```bash
-H "Accept: application/json; version=1" -H "Content-Type: application/json"
```

## Environment Variables

| Variable | Description |
|---|---|
| `ASHBY_TOKEN` | Ashby API key |

## Key Endpoints

Base URL: `https://api.ashbyhq.com`

### 1. List Candidates

`POST /candidate.list`

Requires `candidatesRead`. Supports pagination and incremental sync.

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 25}'
```

### 2. Search Candidates

`POST /candidate.search`

Use this for targeted lookup by email or name. Responses are limited, so use `candidate.list` for broad syncs.

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.search" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe@example.com"}'
```

### 3. List Applications

`POST /application.list`

Requires `candidatesRead`. Useful filters include `status`, `jobId`, `createdAfter`, `limit`, `cursor`, and `syncToken`.

```bash
curl -s -X POST "https://api.ashbyhq.com/application.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 25, "status": "Active"}'
```

### 4. List Jobs

`POST /job.list`

Requires `jobsRead`. Lists open, closed, and archived jobs. Include `Draft` in the `status` parameter when draft jobs are needed.

```bash
curl -s -X POST "https://api.ashbyhq.com/job.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 25}'
```

### 5. List Openings

`POST /opening.list`

Requires `jobsRead`. Supports pagination and incremental sync.

```bash
curl -s -X POST "https://api.ashbyhq.com/opening.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 25}'
```

### 6. List Job Postings

`POST /jobPosting.list`

Requires `jobsRead`. If results will be shown publicly, set `listedOnly` to `true` so unlisted job postings are not displayed.

```bash
curl -s -X POST "https://api.ashbyhq.com/jobPosting.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"listedOnly": true}'
```

### 7. Public Job Board Postings

`GET /posting-api/job-board/{JOB_BOARD_NAME}`

This endpoint is for public career pages and does not use the API-key auth flow.

```bash
curl -s "https://api.ashbyhq.com/posting-api/job-board/<job-board-name>?includeCompensation=true"
```

### 8. List Projects

`POST /project.list`

Requires `candidatesRead`. Supports pagination and incremental sync.

```bash
curl -s -X POST "https://api.ashbyhq.com/project.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 25}'
```

## Pagination and Sync

List endpoints return `results`, `moreDataAvailable`, and, when more pages are available, `nextCursor`. Send the latest `nextCursor` as `cursor` until `moreDataAvailable` is `false`.

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 100, "cursor": "<nextCursor>"}'
```

For endpoints with `syncToken`, store the `syncToken` returned on the final page and send it on the next run to fetch only changes:

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"limit": 100, "syncToken": "<syncToken>"}'
```

If Ashby returns `incremental_sync_too_large` or `sync_token_expired`, discard the stored sync token and run a fresh full sync without `syncToken`.

## Common Workflows

### Find a Candidate by Email

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.search" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe@example.com"}'
```

### Pull Active Applications for a Job

Replace `<job-id>` with the Ashby job UUID:

```bash
curl -s -X POST "https://api.ashbyhq.com/application.list" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "<job-id>", "status": "Active", "limit": 100}'
```

### Add a Note to a Candidate

Requires `candidatesWrite`. If the organization uses the beta `X-On-Behalf-Of` flow, pass the Ashby user ID in that header.

```bash
curl -s -X POST "https://api.ashbyhq.com/candidate.createNote" \
  -u "$ASHBY_TOKEN:" \
  -H "Accept: application/json; version=1" \
  -H "Content-Type: application/json" \
  -H "X-On-Behalf-Of: <user-id>" \
  -d '{"candidateId": "<candidate-id>", "note": "Reached out by email.", "sendNotifications": false}'
```

## Notes

- Ashby API keys are long-lived and should be used from server-side code only.
- API keys have endpoint-level permissions. Request the smallest permissions needed for the workflow.
- Confidential jobs/projects and private candidate fields require explicit permission settings in Ashby.
