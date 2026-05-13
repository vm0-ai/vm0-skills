---
name: testrail
description: TestRail API for QA test case management. Use when user mentions "TestRail", "test cases", "test runs", "test results", "test plans", "QA management", or "Gurock TestRail".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name TESTRAIL_TOKEN` or `zero doctor check-connector --url https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_projects --method GET`

## How to Use

All examples assume `TESTRAIL_EMAIL`, `TESTRAIL_TOKEN` (API key), and `TESTRAIL_INSTANCE` (the subdomain before `.testrail.io`) are set. TestRail uses HTTP Basic auth — email as username, API key as password.

Base URL: `https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/`

Pass credentials with `-u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"`. Self-hosted instances use a different domain; set `TESTRAIL_INSTANCE` appropriately if your team runs TestRail Server.

### 1. List Projects

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_projects" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.projects[] | {id, name, suite_mode, is_completed}'
```

`suite_mode`: `1` = single suite, `2` = single suite + baselines, `3` = multiple suites.

### 2. Get a Single Project

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_project/<project-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"
```

### 3. List Test Suites in a Project

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_suites/<project-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.[] | {id, name, description}'
```

### 4. List Sections in a Suite

Sections organize cases into a tree. Replace `<project-id>` and `<suite-id>`:

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_sections/<project-id>&suite_id=<suite-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.sections[] | {id, name, parent_id, depth}'
```

### 5. List Test Cases

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_cases/<project-id>&suite_id=<suite-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.cases[] | {id, title, priority_id, type_id, section_id}'
```

Filter by section or other criteria:

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_cases/<project-id>&suite_id=<suite-id>&section_id=<section-id>&priority_id=4" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"
```

### 6. Get a Specific Test Case

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_case/<case-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"
```

### 7. Create a Test Case

Write to `/tmp/testrail_request.json`:

```json
{
  "title": "User can log in with valid credentials",
  "type_id": 1,
  "priority_id": 4,
  "custom_steps": "1. Open login page\n2. Enter valid credentials\n3. Click Login",
  "custom_expected": "User lands on dashboard"
}
```

Replace `<section-id>` with the destination section ID:

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/add_case/<section-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json
```

### 8. Update a Test Case

Write to `/tmp/testrail_request.json` with only the fields you want to change, then run (replace `<case-id>`):

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/update_case/<case-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json
```

### 9. List Test Runs

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_runs/<project-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.runs[] | {id, name, suite_id, is_completed, passed_count, failed_count}'
```

### 10. Create a Test Run

A run binds cases to a planned execution. Write to `/tmp/testrail_request.json`:

```json
{
  "suite_id": <suite-id>,
  "name": "Sprint 42 — Regression",
  "include_all": false,
  "case_ids": [<case-id>, <case-id>]
}
```

Set `include_all` to `true` to include every case in the suite; otherwise list specific `case_ids`. Replace `<project-id>`:

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/add_run/<project-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json
```

### 11. List Tests in a Run

`tests` are case-in-run instances and have IDs distinct from the underlying case IDs:

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_tests/<run-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.tests[] | {id, case_id, title, status_id}'
```

### 12. Add a Result for a Test

Write to `/tmp/testrail_request.json`:

```json
{
  "status_id": 1,
  "comment": "Verified on Chrome 124 and Firefox 125.",
  "elapsed": "3m 20s",
  "version": "1.2.3"
}
```

Status IDs: `1` Passed, `2` Blocked, `3` Untested, `4` Retest, `5` Failed (defaults — your instance may have custom statuses).

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/add_result/<test-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json
```

### 13. Bulk-Add Results by Case ID

Useful for posting CI results in one call. Write to `/tmp/testrail_request.json`:

```json
{
  "results": [
    { "case_id": 101, "status_id": 1, "comment": "Passed" },
    { "case_id": 102, "status_id": 5, "comment": "Failed — see attached log" }
  ]
}
```

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/add_results_for_cases/<run-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json
```

### 14. Close a Test Run

Archives the run and prevents further result entry:

```bash
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/close_run/<run-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"
```

### 15. List Milestones

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_milestones/<project-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.milestones[] | {id, name, due_on, is_completed}'
```

### 16. List Users

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_users" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.[] | {id, name, email, role_id, is_active}'
```

## Common Workflows

### Post CI results for a sprint run

```bash
# 1. Find (or create) the run for this sprint
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_runs/<project-id>&is_completed=0" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.runs[] | {id, name}'

# 2. Bulk-post results by case_id (see step 13)
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/add_results_for_cases/<run-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" --header "Content-Type: application/json" -d @/tmp/testrail_request.json

# 3. Close the run when sprint completes
curl -s -X POST "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/close_run/<run-id>" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN"
```

### Find failing tests in the latest run

```bash
curl -s "https://$TESTRAIL_INSTANCE.testrail.io/index.php?/api/v2/get_tests/<run-id>&status_id=5" -u "$TESTRAIL_EMAIL:$TESTRAIL_TOKEN" | jq '.tests[] | {case_id, title, refs}'
```

## Guidelines

1. URLs use TestRail's quirky `index.php?/api/v2/<endpoint>/<id>` query-string style — extra parameters use `&key=value`, never `?key=value` (the `?` is already consumed by `/api/v2/...`).
2. Authentication is HTTP Basic: email as username, API key as password. Generate the key in **My Settings → API Keys** (admin must have **Enable API** turned on for the instance).
3. `case_ids` belong to the suite; `test_id` belongs to a specific run — don't confuse them when adding results.
4. Bulk endpoints (e.g. `add_results_for_cases`) succeed atomically — if any record fails validation, the entire batch is rejected.
5. Pagination: list endpoints with many records return a `_links` object with `next`/`prev` and use `offset` + `limit` query params (default limit 250, max 250 from v6.7+).
6. Status, priority, and type IDs differ if your instance was customized — pull `/get_statuses`, `/get_priorities`, `/get_case_types` first if you're not sure.
7. Custom fields are exposed as `custom_<system_name>` keys (e.g., `custom_steps`, `custom_expected`).
8. Self-hosted TestRail Server uses a different host than `testrail.io` — change `TESTRAIL_INSTANCE` to your full host (still go through `index.php?/api/v2/`).
9. Rate limit: TestRail Cloud enforces 180 requests per minute per user by default. `429` responses include a `Retry-After` header.

## API Reference

- API overview: https://support.testrail.com/hc/en-us/articles/7077083596436-Introduction-to-the-TestRail-API
- Cases: https://support.testrail.com/hc/en-us/articles/7077295410732-Cases
- Runs: https://support.testrail.com/hc/en-us/articles/7077874763156-Runs
- Tests: https://support.testrail.com/hc/en-us/articles/7077874763156-Tests
- Results: https://support.testrail.com/hc/en-us/articles/7077819312404-Results
- Authentication: https://support.testrail.com/hc/en-us/articles/7077039051284-Accessing-the-TestRail-API
