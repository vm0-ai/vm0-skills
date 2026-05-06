---
name: infisical
description: Infisical Cloud Secrets Manager API for retrieving and listing secrets. Use when user mentions "Infisical", "infisical secrets", or asks about secrets management with Infisical.
---

## Core APIs

All API calls authenticate with the `INFISICAL_TOKEN` environment variable via Bearer token.

### 1. Fetch a Single Secret by Name

Retrieve a secret by its key name from a specific Infisical project and environment.

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw/<SECRET_NAME>?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $INFISICAL_TOKEN" | jq '{key: .secret.secretKey, value: .secret.secretValue, environment: .secret.environment}'
```

Replace `<SECRET_NAME>` with the exact secret key, `<workspace-id>` with your Infisical project ID (found in project settings), and `<env-slug>` with the environment slug (e.g., `dev`, `staging`, `prod`).

### 2. List All Secrets in a Project/Environment

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $INFISICAL_TOKEN" | jq '.secrets[] | {key: .secretKey, value: .secretValue, environment: .environment}'
```

Replace `<workspace-id>` and `<env-slug>` as above.

To include secrets from sub-folders recursively, append `&recursive=true` to the query string.

## Guidelines

1. **Authentication:** All requests use `INFISICAL_TOKEN` as a Bearer token. No token exchange is needed — the connector uses Token Auth, not Universal Auth.
2. **Workspace ID:** Found in your Infisical project settings page. This is different from the project name/slug.
3. **Environment slugs:** Common values are `dev`, `staging`, `prod` — use the exact slug shown in your Infisical dashboard.
4. **Secret references:** By default, `expandSecretReferences` is `false`. Set to `true` to resolve cross-secret references in values.
5. **Rate limits (Infisical Cloud):** Free plan allows 200 read requests/min; Pro plan allows 350/min. Self-hosted instances have no rate limits.
