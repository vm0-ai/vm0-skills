---
name: greenhouse
description: Greenhouse Harvest API for applicant tracking and recruiting. Use when user mentions "Greenhouse", "ATS", "applicant tracking", "candidate", "job application", "recruiting pipeline", "job post", "scheduled interview", or "offer".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name GREENHOUSE_TOKEN` or `zero doctor check-connector --url https://harvest.greenhouse.io/v1/candidates --method GET`

## Authentication

Greenhouse Harvest uses **HTTP Basic Auth** with the API token as the **username** and a **blank password**. The token is sent in the `Authorization` header as `Basic base64(TOKEN:)` (note the trailing colon — blank password).

Encode the header on the fly with `printf` and `base64`:

```bash
curl -s "https://harvest.greenhouse.io/v1/candidates?per_page=5" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

All examples below reuse this header. Write POST bodies to `/tmp/*.json` and pass with `-d @/tmp/file.json` per house style.

## Environment Variables

| Variable | Description |
|---|---|
| `GREENHOUSE_TOKEN` | Harvest API key (v1/v2) |

## Key Endpoints

Base URL: `https://harvest.greenhouse.io`

### 1. List Candidates

Paginated. `per_page` max is 500 (default 100). Pagination uses RFC-5988 `Link` response headers (`rel="next"`, `rel="prev"`, `rel="last"`).

```bash
curl -s "https://harvest.greenhouse.io/v1/candidates?per_page=100&page=1" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Useful query parameters:

- `per_page` — 1 to 500
- `page` — 1-based pagination cursor
- `created_after` / `updated_after` — ISO-8601 timestamp
- `email` — exact email match
- `job_id` — filter by associated job

To follow pagination, read the `Link` header. Show it by adding `-D -` (dump headers):

```bash
curl -s -D - "https://harvest.greenhouse.io/v1/candidates?per_page=100&page=1" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)" -o /tmp/greenhouse_candidates.json
```

The `Link` header looks like: `<https://harvest.greenhouse.io/v1/candidates?page=2&per_page=100>; rel="next", ...`.

### 2. Get a Single Candidate

Replace `<candidate-id>` with the actual candidate ID:

```bash
curl -s "https://harvest.greenhouse.io/v1/candidates/<candidate-id>" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

### 3. Create a Candidate

**Required fields:** `first_name`, `last_name`. Also commonly set: `company`, `title`, `emails`, `phone_numbers`, `applications`.

**Required header:** `On-Behalf-Of: <greenhouse-user-id>` — the Greenhouse user ID the request is made on behalf of (used for auditing). Find user IDs with `GET /v1/users`.

Write to `/tmp/greenhouse_candidate.json`:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "company": "Acme Corp",
  "title": "Staff Engineer",
  "emails": [
    { "value": "jane.doe@example.com", "type": "personal" }
  ],
  "phone_numbers": [
    { "value": "+1-555-123-4567", "type": "mobile" }
  ]
}
```

Then run. Replace `<greenhouse-user-id>` with the actual user ID:

```bash
curl -s -X POST "https://harvest.greenhouse.io/v1/candidates" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)" --header "On-Behalf-Of: <greenhouse-user-id>" --header "Content-Type: application/json" -d @/tmp/greenhouse_candidate.json
```

### 4. List Applications

An application is a candidate's submission to a specific job. Paginated the same way as candidates.

```bash
curl -s "https://harvest.greenhouse.io/v1/applications?per_page=100&page=1&status=active" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Useful query parameters:

- `status` — `active`, `converted`, `hired`, `rejected`
- `job_id` — filter by job
- `created_after` / `created_before` / `last_activity_after` — ISO-8601 timestamps
- `skip_count=true` — faster; drops `rel="last"` from the Link header

### 5. List Jobs

```bash
curl -s "https://harvest.greenhouse.io/v1/jobs?status=open&per_page=100" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Useful query parameters:

- `status` — `open`, `closed`, `draft`
- `department_id`, `office_id`
- `created_after` / `updated_after` — ISO-8601 timestamps

### 6. List Job Posts

Job posts are the public-facing postings attached to jobs.

```bash
curl -s "https://harvest.greenhouse.io/v1/job_posts?active=true&live=true&per_page=100" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

### 7. List Offers

```bash
curl -s "https://harvest.greenhouse.io/v1/offers?status=sent&per_page=100" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Useful query parameters:

- `status` — `draft`, `approval_sent`, `approved`, `sent`, `sent_manually`, `accepted`, `rejected`, `deprecated`
- `created_after` / `updated_after` — ISO-8601 timestamps

### 8. List Scheduled Interviews

```bash
curl -s "https://harvest.greenhouse.io/v1/scheduled_interviews?per_page=100" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Useful query parameters:

- `application_id` — filter to a single application
- `updated_after`, `starts_after`, `ends_before` — ISO-8601 timestamps
- `actionable` — `true` to return only interviews awaiting scorecard feedback

### 9. Add a Note to a Candidate's Activity Feed

**Required header:** `On-Behalf-Of: <greenhouse-user-id>`.

Write to `/tmp/greenhouse_note.json`:

```json
{
  "user_id": 158108,
  "body": "Reached out via LinkedIn on 2026-04-18. Awaiting response.",
  "visibility": "admin_only"
}
```

`visibility` is one of `admin_only`, `private`, `public`. Then run. Replace `<candidate-id>` and `<greenhouse-user-id>`:

```bash
curl -s -X POST "https://harvest.greenhouse.io/v1/candidates/<candidate-id>/activity_feed/notes" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)" --header "On-Behalf-Of: <greenhouse-user-id>" --header "Content-Type: application/json" -d @/tmp/greenhouse_note.json
```

## Common Workflows

### Find a Candidate by Email, Then Read Their Activity Feed

```bash
curl -s "https://harvest.greenhouse.io/v1/candidates?email=jane.doe@example.com" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

Replace `<candidate-id>` with the `id` from the previous response:

```bash
curl -s "https://harvest.greenhouse.io/v1/candidates/<candidate-id>/activity_feed" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

### Pull All Applications for an Open Job

Replace `<job-id>` with the actual job ID:

```bash
curl -s "https://harvest.greenhouse.io/v1/applications?job_id=<job-id>&status=active&per_page=500" --header "Authorization: Basic $(printf "%s:" "$GREENHOUSE_TOKEN" | base64 -w 0)"
```

## Notes

- **Harvest v1/v2 will be deprecated on August 31, 2026.** Greenhouse is migrating to Harvest v3 (OAuth-based). Plan to migrate before the deprecation date. Until then, v1 continues to work. This skill targets v1 endpoints.
- **Basic Auth encoding** uses a trailing colon — `base64(TOKEN:)` — because the password is blank.
- **Rate limits:** Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers; limits are per 10-second window. On HTTP 429, honour the `Retry-After` header.
- **`On-Behalf-Of` header** is required for all POST/PATCH/DELETE requests. Pass the integer ID of the acting Greenhouse user.
- **Pagination** uses the RFC-5988 `Link` header. The maximum `per_page` value is 500.
- **Permission scoping:** each API key has endpoint-level permissions configured at creation time in the Greenhouse Dev Center. A 403 response usually means the key is missing a scope — not an auth failure.
