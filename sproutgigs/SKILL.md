---
name: sproutgigs
description: SproutGigs API for managing buyer jobs, gigs, freelancer lists, profiles, balances, and task reviews. Use when user mentions "SproutGigs", "Picoworkers", "microtasks", "crowd tasks", "buyer jobs", "gig marketplace", or "task submissions".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SPROUTGIGS_API_SECRET` or `zero doctor check-connector --url https://sproutgigs.com/api/users/get-balances.php --method GET`

## Authentication

SproutGigs uses HTTP Basic Auth with the user ID as the username and API secret as the password.

```bash
curl -s "https://sproutgigs.com/api/users/get-balances.php" \
  -u "$SPROUTGIGS_USER_ID:$SPROUTGIGS_API_SECRET"
```

Get or reset the API secret from SproutGigs Account Settings -> Settings.

## Environment Variables

- `SPROUTGIGS_USER_ID` - SproutGigs user ID
- `SPROUTGIGS_API_SECRET` - SproutGigs API secret

## API Basics

Base URL: `https://sproutgigs.com/api`

SproutGigs' public docs show JSON request bodies for several `GET` endpoints. When an endpoint needs parameters, send JSON with `Content-Type: application/json`, even if the method is `GET`.

Rate limit: 1 request/second. Do not run SproutGigs API calls in parallel. If a request returns HTTP 429, wait at least 10 seconds before retrying.

Many write endpoints spend account balance or affect worker outcomes. Before calling `post-job`, `add-positions`, `feature-job`, `rate-*`, list block/unblock, or job stop/restart/resume operations, confirm the exact parameters unless the user has already explicitly authorized that action.

## Helper Pattern

```bash
sproutgigs() {
  local method="$1"
  local path="$2"
  local body="${3:-}"

  if [ -n "$body" ]; then
    curl -s -X "$method" "https://sproutgigs.com/api$path" \
      -u "$SPROUTGIGS_USER_ID:$SPROUTGIGS_API_SECRET" \
      -H "Content-Type: application/json" \
      -d "$body"
  else
    curl -s -X "$method" "https://sproutgigs.com/api$path" \
      -u "$SPROUTGIGS_USER_ID:$SPROUTGIGS_API_SECRET"
  fi
}
```

## Endpoint Inventory

### Gigs

- `GET /gigs/get-categories.php` - list gig categories and minimum prices
- `GET /gigs/get-gig.php` - get a gig by `gig_id`
- `GET /gigs/get-gigs.php` - list active gigs with filters and pagination
- `GET /gigs/get-gig-public-questions.php` - list public Q&A for a gig
- `GET /gigs/get-gig-reviews.php` - list gig reviews

Useful gig list body fields: `category_id`, `subcategory_ids`, `countries`, `min_price`, `max_price`, `search_term`, `page`, `results_per_page`, `order`.

```bash
sproutgigs GET /gigs/get-gigs.php '{
  "page": 1,
  "results_per_page": 10,
  "order": "newest"
}'
```

### Jobs

- `POST /jobs/add-positions.php` - add paid positions to a job
- `POST /jobs/edit-targeting.php` - edit job targeting
- `POST /jobs/feature-job.php` - feature a job
- `GET /jobs/get-categories.php` - list job categories
- `GET /jobs/get-job.php` - get one job
- `GET /jobs/get-jobs.php` - list jobs
- `GET /jobs/get-lists.php` - list account freelancer lists
- `POST /jobs/get-predicted-position.php` - estimate job position
- `GET /jobs/get-rated-tasks.php` - list rated tasks
- `GET /jobs/get-unrated-tasks.php` - list submitted tasks awaiting rating
- `GET /jobs/get-zones.php` - list available zones
- `POST /jobs/job-pause.php` - pause a job
- `POST /jobs/post-job.php` - create a job
- `POST /jobs/rate-multiple-tasks.php` - approve or reject multiple tasks
- `POST /jobs/rate-single-task.php` - approve or reject one task
- `POST /jobs/job-restart.php` - restart a stopped job
- `POST /jobs/job-resume.php` - resume a paused job
- `POST /jobs/set-speed.php` - update job speed
- `POST /jobs/set-ttr.php` - update time-to-rate
- `POST /jobs/set-daily-tasks-limit.php` - update daily task limit
- `POST /jobs/set-distribution.php` - update job distribution
- `POST /jobs/job-stop.php` - stop a job

Common discovery flow before posting a job:

```bash
sproutgigs GET /users/get-balances.php
sproutgigs GET /jobs/get-zones.php
sproutgigs GET /jobs/get-categories.php
sproutgigs GET /jobs/get-lists.php
```

Use the field names from SproutGigs' current API docs when creating or updating jobs; the docs contain the full required field list and accepted values for each write endpoint.

### Lists

- `GET /lists/get-public-lists.php` - list public freelancer lists
- `POST /lists/add-workers.php` - add freelancers to a list
- `POST /lists/block-workers.php` - block freelancers in a list
- `POST /lists/unblock-workers.php` - unblock freelancers in a list

### Profiles

- `GET /profiles/get-profile.php` - get a freelancer profile

```bash
sproutgigs GET /profiles/get-profile.php '{"user_id": "123456"}'
```

### Users

- `GET /users/get-balances.php` - get account balances

```bash
sproutgigs GET /users/get-balances.php
```

### Webhooks

SproutGigs documents webhooks for job status changes and submitted tasks. These are incoming notifications configured in SproutGigs, not outbound API calls to run from the agent.

## Common Workflows

### Check Account and Job Setup

```bash
sproutgigs GET /users/get-balances.php
sleep 1
sproutgigs GET /jobs/get-zones.php
sleep 1
sproutgigs GET /jobs/get-categories.php
```

### Review Submitted Tasks

```bash
sproutgigs GET /jobs/get-unrated-tasks.php '{"job_id": "JOB_ID", "page": 1, "results_per_page": 25}'
```

Inspect submissions before rating. Ratings are worker-impacting and often irreversible from the API, so do not bulk approve or reject without explicit user confirmation.

### Search Marketplace Gigs

```bash
sproutgigs GET /gigs/get-categories.php
sleep 1
sproutgigs GET /gigs/get-gigs.php '{"search_term": "wordpress", "page": 1, "results_per_page": 10}'
```

## Notes

- The API is marked beta in SproutGigs' docs.
- The public docs were last checked on 2026-05-19 and list a documentation update date of 2026-04-29.
- Prefer read endpoints first, then narrow write calls to one job/list/task batch at a time.
- Avoid automating worker-side task claiming or human-action simulation. This skill is for buyer-side job, gig, list, profile, balance, and review operations.
