---
name: copper
description: Copper CRM Developer API for people, companies, leads, opportunities, projects, tasks, and activities. Use when the user mentions Copper CRM, sales pipelines, leads, or opportunities.
---

## Prerequisites

1. Connect Copper in Zero at Settings > Connectors > Copper.
2. Requests require `COPPER_TOKEN` and use `https://api.copper.com/developer_api/v1`.

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name COPPER_TOKEN` or `zero doctor check-connector --url https://api.copper.com/developer_api/v1/account --method GET`.

## Account

### Get Account Details

```bash
curl -sS "https://api.copper.com/developer_api/v1/account" --header "Authorization: Bearer $COPPER_TOKEN" | jq '{id, name, primary_timezone, settings}'
```

## People and Companies

### Search People

Write to `/tmp/copper_people_search.json`:

```json
{
  "page_size": 50,
  "sort_by": "name",
  "sort_direction": "asc"
}
```

```bash
curl -sS -X POST "https://api.copper.com/developer_api/v1/people/search" --header "Authorization: Bearer $COPPER_TOKEN" --header "Content-Type: application/json" -d @/tmp/copper_people_search.json | jq '[.[] | {id, name, emails, company_name, title}]'
```

### Get a Person

```bash
curl -sS "https://api.copper.com/developer_api/v1/people/<person-id>" --header "Authorization: Bearer $COPPER_TOKEN" | jq '{id, name, emails, phone_numbers, company_name, title, details}'
```

### Search Companies

```bash
curl -sS -X POST "https://api.copper.com/developer_api/v1/companies/search" --header "Authorization: Bearer $COPPER_TOKEN" --header "Content-Type: application/json" -d @/tmp/copper_people_search.json | jq '[.[] | {id, name, email_domain, phone_numbers, address}]'
```

## Leads and Opportunities

### Search Leads

```bash
curl -sS -X POST "https://api.copper.com/developer_api/v1/leads/search" --header "Authorization: Bearer $COPPER_TOKEN" --header "Content-Type: application/json" -d @/tmp/copper_people_search.json | jq '[.[] | {id, name, company_name, status_id, assignee_id, monetary_value}]'
```

### Search Opportunities

```bash
curl -sS -X POST "https://api.copper.com/developer_api/v1/opportunities/search" --header "Authorization: Bearer $COPPER_TOKEN" --header "Content-Type: application/json" -d @/tmp/copper_people_search.json | jq '[.[] | {id, name, company_id, pipeline_id, pipeline_stage_id, status, monetary_value, close_date}]'
```

### Update an Opportunity

Write only changed fields to `/tmp/copper_opportunity.json`:

```json
{
  "name": "Enterprise renewal",
  "monetary_value": 25000
}
```

```bash
curl -sS -X PUT "https://api.copper.com/developer_api/v1/opportunities/<opportunity-id>" --header "Authorization: Bearer $COPPER_TOKEN" --header "Content-Type: application/json" -d @/tmp/copper_opportunity.json | jq '{id, name, monetary_value, status, close_date}'
```

## Guidelines

1. Copper search endpoints use `POST` even though they only read data.
2. Resolve pipeline and stage IDs before changing opportunity stages.
3. Ask before creating, updating, or deleting CRM records.
4. Access tokens currently do not expire; never display or log `COPPER_TOKEN`.

## API Reference

- https://developer.copper.com/
- https://developer.copper.com/introduction/oauth/flow.html
