---
name: snowflake
description: Snowflake API for data warehouse operations. Use when user mentions "Snowflake", "data warehouse", "SQL API", "warehouse", "database", "schema", or asks to query Snowflake data.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name SNOWFLAKE_PAT` or `zero doctor check-connector --url https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases --method GET`

### Error 390432: `Network policy is required`

Snowflake refuses PAT authentication for any user that is not bound to a network policy. The account admin must attach one before the PAT can authenticate. Steps (perform in Snowsight):

1. Open [https://app.snowflake.com](https://app.snowflake.com) and sign in with an `ACCOUNTADMIN` or `SECURITYADMIN` role.
2. In the left sidebar go to **Projects → Worksheets** and open (or create) a SQL worksheet.
3. Run `SHOW USERS;` and note the value in the `name` column for the PAT-owning user.
4. Run the policy creation statement on its own:

   ```sql
   CREATE NETWORK POLICY pat_policy ALLOWED_IP_LIST = ('0.0.0.0/0');
   ```

5. Then run the user binding statement on its own (replace `USER_NAME` with the value from step 3 — **no quotes**):

   ```sql
   ALTER USER USER_NAME SET NETWORK_POLICY = pat_policy;
   ```

Execute the two statements separately — Snowsight rejects them when pasted and submitted together. `0.0.0.0/0` is a deliberately permissive list to unblock the connector; tighten it to the runner egress range once available. Prefer `ALTER USER` over `ALTER ACCOUNT` so the policy does not affect other login paths.

## How to Use

All examples assume these environment variables are set:

- `SNOWFLAKE_PAT`: Snowflake programmatic access token secret
- `SNOWFLAKE_ACCOUNT`: Snowflake account identifier, for example `myorganization-myaccount`

**Base URL**: `https://${SNOWFLAKE_ACCOUNT}.snowflakecomputing.com/api`

**Authentication**: Programmatic Access Token

```bash
--header "Authorization: Bearer $SNOWFLAKE_PAT"
```

## SQL API

### 1. Validate Connection

Write to `/tmp/snowflake_statement.json`:

```json
{
  "statement": "SELECT CURRENT_USER() AS user, CURRENT_ROLE() AS role, CURRENT_VERSION() AS version",
  "timeout": 60
}
```

Then run:

```bash
curl -s -X POST "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/statements/" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" \
  --header "Content-Type: application/json" \
  -d @/tmp/snowflake_statement.json | jq .
```

### 2. Run a Query With Context

Write to `/tmp/snowflake_statement.json`:

```json
{
  "statement": "SELECT * FROM MY_TABLE LIMIT 10",
  "timeout": 60,
  "database": "MY_DATABASE",
  "schema": "PUBLIC",
  "warehouse": "COMPUTE_WH",
  "role": "ANALYST"
}
```

Then run:

```bash
curl -s -X POST "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/statements/" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" \
  --header "Content-Type: application/json" \
  -d @/tmp/snowflake_statement.json | jq .
```

### 3. Check Statement Status

Replace `<statement-handle>` with the handle returned by a SQL API request.

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/statements/<statement-handle>" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 4. Cancel a Statement

```bash
curl -s -X POST "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/statements/<statement-handle>/cancel" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

## REST APIs

### 5. List Databases

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 6. Get Database Details

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases/<database-name>" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 7. List Schemas

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases/<database-name>/schemas" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 8. List Tables

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases/<database-name>/schemas/<schema-name>/tables" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 9. Get Table Details

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/databases/<database-name>/schemas/<schema-name>/tables/<table-name>" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 10. List Warehouses

```bash
curl -s "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/warehouses" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 11. Resume a Warehouse

```bash
curl -s -X POST "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/warehouses/<warehouse-name>:resume" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

### 12. Suspend a Warehouse

```bash
curl -s -X POST "https://$SNOWFLAKE_ACCOUNT.snowflakecomputing.com/api/v2/warehouses/<warehouse-name>:suspend" \
  --header "Authorization: Bearer $SNOWFLAKE_PAT" | jq .
```

## Guidelines

1. **Account identifier**: Use the account identifier portion before `.snowflakecomputing.com`, such as `myorganization-myaccount`.
2. **PAT setup**: Snowflake may require network policy and authentication policy configuration before a PAT can authenticate.
3. **Least privilege**: Use a PAT tied to a user or service user with the minimum role needed for the requested data and operations.
4. **Warehouse context**: Queries that scan tables usually need a `warehouse` in the request body or an active default warehouse for the user.
5. **Identifier encoding**: URL-encode database, schema, table, and warehouse names if they contain spaces, slashes, quotes, or other special characters.
6. **Async execution**: Long-running SQL API requests return a statement handle; poll `/api/v2/statements/<statement-handle>` until the query completes.
