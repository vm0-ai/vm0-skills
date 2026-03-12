---
name: make
description: Make (Integromat) API for automation. Use when user mentions "Make",
  "Integromat", "automation", or workflow building.
vm0_secrets:
  - MAKE_TOKEN
---

# Make API

Use the Make API via direct `curl` calls to **manage scenarios, organizations, teams, connections, data stores, and webhooks** on the Make automation platform.

> Official docs: `https://developers.make.com/api-documentation`

---

## When to Use

Use this skill when you need to:

- **List, create, run, and manage automation scenarios**
- **Control scenario execution** (start, stop, run on demand, replay)
- **Manage organizations and teams** including users and roles
- **Configure connections and webhooks** for integrations
- **Work with data stores** for persistent data across scenarios

---

## Prerequisites

1. Log in to your [Make account](https://www.make.com/en/login)
2. Go to your profile icon > **Profile** > **API Access**
3. Click **Add token**, enter a name, and select the required scopes
4. Copy the generated API token

```bash
export MAKE_TOKEN="your-api-token"
```

### API Base URLs

Your base URL depends on your Make zone. Check your Make dashboard URL to determine your zone.

| Zone | Base URL |
|------|----------|
| EU1 | `https://eu1.make.com/api/v2` |
| EU2 | `https://eu2.make.com/api/v2` |
| US1 | `https://us1.make.com/api/v2` |
| US2 | `https://us2.make.com/api/v2` |

All examples below use `https://eu1.make.com/api/v2`. Replace with your zone URL as needed.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `MAKE_TOKEN` set. Authentication uses `Token` scheme in the Authorization header.

---

### 1. Get Current User Info

Retrieve information about the authenticated user.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/users/me" --header "Authorization: Token $MAKE_TOKEN"' | jq .
```

---

### 2. List Organizations

Retrieve all organizations the user belongs to.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/organizations" --header "Authorization: Token $MAKE_TOKEN"' | jq '.organizations'
```

---

### 3. List Teams

Get all teams in an organization. Replace `ORG_ID` with the organization ID.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/organizations/ORG_ID/teams" --header "Authorization: Token $MAKE_TOKEN"' | jq '.teams'
```

---

### 4. List Scenarios

Retrieve all scenarios for a team. Replace `TEAM_ID` with the team ID.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios?teamId=TEAM_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.scenarios[] | {id, name, isEnabled, scheduling}'
```

Paginate with `pg[offset]` and `pg[limit]`:

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios?teamId=TEAM_ID&pg%5Boffset%5D=0&pg%5Blimit%5D=20" --header "Authorization: Token $MAKE_TOKEN"' | jq '.scenarios[] | {id, name}'
```

---

### 5. Get Scenario Details

Retrieve details of a specific scenario. Replace `SCENARIO_ID` with the scenario ID.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.scenario'
```

---

### 6. Create a Scenario

Create a new scenario in a team.

Write to `/tmp/make_request.json`:

```json
{
  "teamId": 123,
  "name": "My New Scenario",
  "blueprint": "{\"name\":\"My New Scenario\",\"flow\":[],\"metadata\":{\"version\":1}}"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d @/tmp/make_request.json' | jq .
```

---

### 7. Update a Scenario

Update scenario properties (name, scheduling, etc.).

Write to `/tmp/make_request.json`:

```json
{
  "name": "Updated Scenario Name"
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d @/tmp/make_request.json' | jq .
```

---

### 8. Start a Scenario

Activate a scenario so it runs on its schedule.

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/start" --header "Authorization: Token $MAKE_TOKEN"' | jq .
```

---

### 9. Stop a Scenario

Deactivate a running scenario.

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/stop" --header "Authorization: Token $MAKE_TOKEN"' | jq .
```

---

### 10. Run a Scenario On Demand

Execute a scenario immediately. The scenario must be active.

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/run" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d '"'"'{}'"'"'' | jq .
```

Run with input data:

Write to `/tmp/make_request.json`:

```json
{
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/run" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d @/tmp/make_request.json' | jq .
```

---

### 11. Clone a Scenario

Duplicate an existing scenario.

Write to `/tmp/make_request.json`:

```json
{
  "name": "Cloned Scenario",
  "teamId": 123
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/clone" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d @/tmp/make_request.json' | jq .
```

---

### 12. Delete a Scenario

Remove a scenario permanently.

```bash
bash -c 'curl -s -X DELETE "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq .
```

---

### 13. Get Scenario Usage

Retrieve 30-day usage analytics (operations, data transfer, centicredits).

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/usage" --header "Authorization: Token $MAKE_TOKEN"' | jq .
```

---

### 14. Get Scenario Logs

Retrieve execution logs for a scenario.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios/SCENARIO_ID/logs" --header "Authorization: Token $MAKE_TOKEN"' | jq '.scenarioLogs[] | {id, status, duration, operations}'
```

---

### 15. List Connections

Retrieve all connections for a team.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/connections?teamId=TEAM_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.connections[] | {id, name, accountName, accountType}'
```

---

### 16. List Webhooks (Hooks)

Get all webhooks for a team.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/hooks?teamId=TEAM_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.hooks[] | {id, name, url, enabled}'
```

---

### 17. List Data Stores

Get all data stores for a team.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/data-stores?teamId=TEAM_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.dataStores[] | {id, name, records, size}'
```

---

### 18. Get Data Store Records

Retrieve records from a data store.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/data-stores/DATASTORE_ID/data" --header "Authorization: Token $MAKE_TOKEN"' | jq '.records'
```

---

### 19. Create Data Store Record

Add a record to a data store.

Write to `/tmp/make_request.json`:

```json
{
  "key": "record-key-1",
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://eu1.make.com/api/v2/data-stores/DATASTORE_ID/data" --header "Content-Type: application/json" --header "Authorization: Token $MAKE_TOKEN" -d @/tmp/make_request.json' | jq .
```

---

### 20. List Scenario Folders

Get all scenario folders for a team.

```bash
bash -c 'curl -s "https://eu1.make.com/api/v2/scenarios-folders?teamId=TEAM_ID" --header "Authorization: Token $MAKE_TOKEN"' | jq '.scenariosFolders[] | {id, name}'
```

---

## Guidelines

1. **Zone selection**: Always use the correct zone base URL matching your Make account. Check your dashboard URL to determine your zone (eu1, eu2, us1, or us2)
2. **Token scopes**: API tokens require specific scopes. Ensure your token has the necessary scopes for the endpoints you use
3. **Pagination**: Use `pg[offset]` and `pg[limit]` query parameters for paginated endpoints. URL-encode brackets as `%5B` and `%5D`
4. **Column selection**: Use `cols[]` parameter to request only specific fields in responses
5. **Team context**: Most resources belong to a team. Include `teamId` in queries to scope results
6. **Scenario activation**: Scenarios must be active (started) before they can be run on demand
7. **Blueprint format**: When creating scenarios, the blueprint is passed as a JSON string (stringified JSON within JSON)
8. **Rate limits**: Make enforces API rate limits. Implement backoff if you receive HTTP 429 responses
