---
name: infisical
description: Infisical Cloud Secrets Manager API for retrieving and listing secrets. Use when user mentions "Infisical", "infisical secrets", "machine identity token", or asks about secrets management with Infisical.
---

# Infisical Cloud Secrets Manager API

Infisical is an open-source secrets manager. This skill enables fetching individual secrets or listing all secrets from an Infisical project and environment using Machine Identity credentials.

> Official docs: `https://infisical.com/docs/api-reference/overview/introduction`

## When to Use

- Retrieve the value of a specific secret from an Infisical project
- List all secrets in a given project and environment
- Inspect secrets with reference expansion and import resolution

## Prerequisites

Connect the **Infisical Cloud Secrets Manager API** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

## Core APIs

### 1. Obtain an Access Token

All API calls require a Bearer token. Exchange your Machine Identity credentials for a temporary access token (default TTL: 2 hours):

Write to `/tmp/infisical_login.json`:

```json
{
  "clientId": "<client-id>",
  "clientSecret": "<client-secret>"
}
```

Replace `<client-id>` and `<client-secret>` with your actual `INFISICAL_CLIENT_ID` and `INFISICAL_CLIENT_SECRET` values.

Then run:

```bash
curl -s -X POST "https://app.infisical.com/api/v1/auth/universal-auth/login" --header "Content-Type: application/json" -d @/tmp/infisical_login.json | jq -r '.accessToken' > /tmp/infisical_token.txt
```

Verify the token was saved:

```bash
cat /tmp/infisical_token.txt | head -c 50
```

Use `$(cat /tmp/infisical_token.txt)` in subsequent requests.

---

### 2. Fetch a Single Secret by Name

Retrieve a secret by its key name from a specific Infisical project and environment.

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw/<SECRET_NAME>?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $(cat /tmp/infisical_token.txt)" | jq '{key: .secret.secretKey, value: .secret.secretValue, environment: .secret.environment}'
```

Replace `<SECRET_NAME>` with the exact secret key, `<workspace-id>` with your Infisical project ID (found in project settings), and `<env-slug>` with the environment slug (e.g., `dev`, `staging`, `prod`).

---

### 3. List All Secrets in a Project/Environment

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $(cat /tmp/infisical_token.txt)" | jq '.secrets[] | {key: .secretKey, value: .secretValue, environment: .environment}'
```

Replace `<workspace-id>` and `<env-slug>` as above.

To include secrets from sub-folders recursively, append `&recursive=true` to the query string.

---

## Guidelines

1. **Token exchange:** POST `/api/v1/auth/universal-auth/login` with `clientId` and `clientSecret`. Default TTL is 2 hours; renew via `/api/v1/auth/universal-auth/renew` if needed.
2. **Workspace ID:** Found in your Infisical project settings page. This is different from the project name/slug.
3. **Environment slugs:** Common values are `dev`, `staging`, `prod` — use the exact slug shown in your Infisical dashboard.
4. **Secret references:** By default, `expandSecretReferences` is `false`. Set to `true` to resolve cross-secret references in values.
5. **Rate limits (Infisical Cloud):** Free plan allows 200 read requests/min; Pro plan allows 350/min. Self-hosted instances have no rate limits.
6. **Security:** The access token grants access to all secrets the machine identity is authorized for. Clean up `/tmp/infisical_token.txt` when done.
