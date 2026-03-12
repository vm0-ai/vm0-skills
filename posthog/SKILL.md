---
name: posthog
description: PostHog API for product analytics. Use when user mentions "PostHog",
  "product analytics", "event tracking", or user analytics.
vm0_secrets:
  - POSTHOG_TOKEN
---

# PostHog API

Use the PostHog API via direct `curl` calls to manage **product analytics, feature flags, experiments, insights, dashboards, cohorts, annotations, and surveys**.

> Official docs: `https://posthog.com/docs/api`

---

## When to Use

Use this skill when you need to:

- **Manage feature flags** - create, update, list, and toggle feature flags
- **Run experiments** - create and monitor A/B tests
- **Query analytics** - run HogQL queries for custom analytics
- **Manage insights** - create and retrieve saved insights (trends, funnels, retention)
- **Manage dashboards** - create and organize dashboards
- **Track persons and events** - query user data and event streams
- **Manage cohorts** - create and query user segments
- **Create annotations** - add timeline markers for deployments or incidents
- **Manage surveys** - create and monitor in-app surveys

---

## Prerequisites

1. Connect your PostHog account at [vm0 Settings > Connectors](https://app.vm0.ai/settings/connectors) and click **posthog**
2. The `POSTHOG_TOKEN` environment variable is automatically configured

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

### Discovering Your Project ID

Most endpoints require a project ID. Get it from the projects endpoint:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name}'
```

### Verify Authentication

```bash
bash -c 'curl -s "https://us.posthog.com/api/users/@me/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{uuid, first_name, email}'
```

---

## How to Use

All examples below assume `POSTHOG_TOKEN` is set. Replace `<project-id>` with your actual project ID from the prerequisites step.

Base URL: `https://us.posthog.com/api`

---

## Organizations

### List Organizations

```bash
bash -c 'curl -s "https://us.posthog.com/api/organizations/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, slug, created_at}'
```

### Get Organization Details

Replace `<org-id>` with your organization ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/organizations/<org-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, name, slug, created_at, membership_level}'
```

---

## Projects

### List Projects

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, timezone}'
```

### Get Project Details

Replace `<project-id>` with your project ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, name, timezone, completed_snippet_onboarding, ingested_event}'
```

---

## Feature Flags

### List Feature Flags

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/feature_flags/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, key, name, active}'
```

### Get Feature Flag Details

Replace `<flag-id>` with the feature flag ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/feature_flags/<flag-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, key, name, active, filters, rollout_percentage}'
```

### Create Feature Flag

Write to `/tmp/posthog_request.json`:

```json
{
  "key": "my-new-flag",
  "name": "My New Feature Flag",
  "active": true,
  "filters": {
    "groups": [
      {
        "properties": [],
        "rollout_percentage": 100
      }
    ]
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/feature_flags/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, key, name, active}'
```

### Update Feature Flag

Write to `/tmp/posthog_request.json`:

```json
{
  "active": false
}
```

Replace `<flag-id>` with the feature flag ID:

```bash
bash -c 'curl -s -X PATCH "https://us.posthog.com/api/projects/<project-id>/feature_flags/<flag-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, key, name, active}'
```

### Delete Feature Flag

Replace `<flag-id>` with the feature flag ID:

```bash
bash -c 'curl -s -X DELETE "https://us.posthog.com/api/projects/<project-id>/feature_flags/<flag-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"'
```

---

## Experiments

### List Experiments

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/experiments/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, start_date, end_date, feature_flag_key}'
```

### Get Experiment Details

Replace `<experiment-id>` with the experiment ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/experiments/<experiment-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, name, description, start_date, end_date, feature_flag_key, parameters}'
```

### Create Experiment

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Button Color Test",
  "description": "Testing red vs blue button",
  "feature_flag_key": "button-color-test",
  "parameters": {
    "feature_flag_variants": [
      {"key": "control", "rollout_percentage": 50},
      {"key": "test", "rollout_percentage": 50}
    ]
  },
  "filters": {
    "events": [{"id": "$pageview", "name": "$pageview"}]
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/experiments/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, name, feature_flag_key}'
```

---

## Insights

### List Saved Insights

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/insights/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, short_id, name, filters}'
```

### Get Insight Details

Replace `<insight-id>` with the insight ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/insights/<insight-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, short_id, name, description, filters, last_refresh}'
```

### Create Trend Insight

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Daily Pageviews",
  "filters": {
    "insight": "TRENDS",
    "events": [{"id": "$pageview", "name": "$pageview", "math": "total"}],
    "date_from": "-30d"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/insights/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, short_id, name}'
```

### Create Funnel Insight

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Signup Funnel",
  "filters": {
    "insight": "FUNNELS",
    "events": [
      {"id": "$pageview", "order": 0},
      {"id": "signup_started", "order": 1},
      {"id": "signup_completed", "order": 2}
    ],
    "date_from": "-30d"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/insights/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, short_id, name}'
```

### Delete Insight

Replace `<insight-id>` with the insight ID:

```bash
bash -c 'curl -s -X DELETE "https://us.posthog.com/api/projects/<project-id>/insights/<insight-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"'
```

---

## Dashboards

### List Dashboards

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/dashboards/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, description, created_at}'
```

### Get Dashboard Details

Replace `<dashboard-id>` with the dashboard ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/dashboards/<dashboard-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, name, description, tiles: [.tiles[] | {id, insight: .insight.name}]}'
```

### Create Dashboard

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Engineering Dashboard",
  "description": "Key engineering metrics"
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/dashboards/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, name}'
```

### Delete Dashboard

Replace `<dashboard-id>` with the dashboard ID:

```bash
bash -c 'curl -s -X DELETE "https://us.posthog.com/api/projects/<project-id>/dashboards/<dashboard-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"'
```

---

## HogQL Queries

Run arbitrary analytics queries using HogQL (PostHog's SQL dialect).

### Run a HogQL Query

Write to `/tmp/posthog_request.json`:

```json
{
  "query": {
    "kind": "HogQLQuery",
    "query": "SELECT event, count() as cnt FROM events GROUP BY event ORDER BY cnt DESC LIMIT 10"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/query/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{columns, results}'
```

### Count Events by Day

Write to `/tmp/posthog_request.json`:

```json
{
  "query": {
    "kind": "HogQLQuery",
    "query": "SELECT toDate(timestamp) as day, count() as cnt FROM events WHERE timestamp > now() - INTERVAL 7 DAY GROUP BY day ORDER BY day DESC"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/query/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{columns, results}'
```

### Query Persons

Write to `/tmp/posthog_request.json`:

```json
{
  "query": {
    "kind": "HogQLQuery",
    "query": "SELECT distinct_id, properties.$browser as browser, properties.$os as os FROM persons LIMIT 10"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/query/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{columns, results}'
```

---

## Events

### List Recent Events

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/events/?limit=10" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, event, distinct_id, timestamp}'
```

### Filter Events by Type

Replace `$pageview` with the event name you want to filter:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/events/?event=%24pageview&limit=10" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, event, distinct_id, timestamp, properties}'
```

---

## Persons

### List Persons

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/persons/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, distinct_ids, properties}'
```

### Search Persons

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/persons/?search=user@example.com" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, distinct_ids}'
```

### Get Person Details

Replace `<person-id>` with the person ID:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/persons/<person-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '{id, distinct_ids, properties, created_at}'
```

---

## Cohorts

### List Cohorts

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/cohorts/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, count, created_at}'
```

### Create Cohort

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Power Users",
  "groups": [
    {
      "properties": [
        {
          "key": "$pageview",
          "type": "behavioral",
          "value": "performed_event",
          "event_type": "events",
          "time_value": 7,
          "time_interval": "day",
          "total_periods": 3
        }
      ]
    }
  ]
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/cohorts/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, name}'
```

---

## Annotations

### List Annotations

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/annotations/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, content, date_marker, scope}'
```

### Create Annotation

Write to `/tmp/posthog_request.json`:

```json
{
  "content": "Deployed v2.1.0",
  "date_marker": "2026-03-10T00:00:00Z",
  "scope": "organization"
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/annotations/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, content, date_marker}'
```

### Delete Annotation

Replace `<annotation-id>` with the annotation ID:

```bash
bash -c 'curl -s -X DELETE "https://us.posthog.com/api/projects/<project-id>/annotations/<annotation-id>/" --header "Authorization: Bearer $POSTHOG_TOKEN"'
```

---

## Actions

### List Actions

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/actions/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, steps}'
```

### Create Action

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "Clicked Sign Up",
  "steps": [
    {
      "event": "$autocapture",
      "properties": [
        {"key": "$element_text", "value": "Sign Up", "type": "element"}
      ]
    }
  ]
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/actions/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, name}'
```

---

## Surveys

### List Surveys

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/surveys/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {id, name, type, start_date, end_date}'
```

### Create Survey

Write to `/tmp/posthog_request.json`:

```json
{
  "name": "NPS Survey",
  "type": "popover",
  "questions": [
    {
      "type": "rating",
      "question": "How likely are you to recommend us?",
      "display": "number",
      "scale": 10,
      "lowerBoundLabel": "Not likely",
      "upperBoundLabel": "Very likely"
    }
  ]
}
```

```bash
bash -c 'curl -s -X POST "https://us.posthog.com/api/projects/<project-id>/surveys/" --header "Authorization: Bearer $POSTHOG_TOKEN" --header "Content-Type: application/json" -d @/tmp/posthog_request.json' | jq '{id, name, type}'
```

---

## Event Definitions

### List Event Definitions

Discover what events are tracked in your project:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/event_definitions/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {name, volume_30_day, query_usage_30_day}'
```

---

## Property Definitions

### List Property Definitions

Discover what properties are available:

```bash
bash -c 'curl -s "https://us.posthog.com/api/projects/<project-id>/property_definitions/" --header "Authorization: Bearer $POSTHOG_TOKEN"' | jq '.results[] | {name, property_type, is_numerical}'
```

---

## Guidelines

1. **Discover project ID first**: Call the projects endpoint to get your project ID before using other endpoints
2. **Pagination**: Responses use `count`, `next`, and `previous` fields. Use `?limit=N&offset=M` for pagination
3. **HogQL for complex queries**: Use the query endpoint with HogQL for custom analytics that go beyond the standard endpoints
4. **Rate limits**: PostHog has rate limits; implement backoff for 429 responses
5. **US vs EU**: Use `us.posthog.com` for US Cloud or `eu.posthog.com` for EU Cloud
6. **Event names**: PostHog built-in events start with `$` (e.g., `$pageview`, `$autocapture`). URL-encode the `$` as `%24` in query parameters
