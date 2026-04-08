---
name: infisical
description: Infisical Cloud Secrets Manager API for retrieving and listing secrets. Use when user mentions "Infisical", "infisical secrets", "machine identity token", or asks about secrets management with Infisical.

---

# Infisical Cloud Secrets Manager API

Infisical is an open-source secrets manager. This skill enables fetching individual secrets or listing all secrets from an Infisical project and environment using a machine identity access token.

> Official docs: `https://infisical.com/docs/api-reference/overview/introduction`

## When to Use

- Retrieve the value of a specific secret from an Infisical project
- List all secrets in a given project and environment
- Inspect secrets with reference expansion and import resolution

## Prerequisites

Go to [vm0.ai](https://app.vm0.ai) **Settings → Connectors** and connect **Infisical**. vm0 will automatically inject the required `INFISICAL_TOKEN` environment variable.

Your `INFISICAL_TOKEN` must be a **machine identity access token** obtained via Universal Auth. Tokens expire after 2 hours by default; renew via `/api/v1/auth/universal-auth/renew` if needed.

> **Important:** When using `$(printenv INFISICAL_TOKEN)` in commands that contain a pipe (`|`), always use `$(printenv ...)` syntax — a known Claude Code issue silently clears `$VAR` references in pipelines.

## Core APIs

### Fetch a Single Secret by Name

Retrieve a secret by its key name from a specific Infisical project and environment.

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw/<SECRET_NAME>?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $(printenv INFISICAL_TOKEN)" | jq '{key: .secret.secretKey, value: .secret.secretValue, environment: .secret.environment}'
```

Replace `<SECRET_NAME>` with the exact secret key, `<workspace-id>` with your Infisical project ID (found in project settings), and `<env-slug>` with the environment slug (e.g., `dev`, `staging`, `prod`).

---

### List All Secrets in a Project/Environment

```bash
curl -s -X GET "https://app.infisical.com/api/v3/secrets/raw?workspaceId=<workspace-id>&environment=<env-slug>&secretPath=/" --header "Authorization: Bearer $(printenv INFISICAL_TOKEN)" | jq '.secrets[] | {key: .secretKey, value: .secretValue, environment: .environment}'
```

Replace `<workspace-id>` and `<env-slug>` as above.

To include secrets from sub-folders recursively, append `&recursive=true` to the query string.

---

## Guidelines

1. **Machine identity token:** Obtain via POST `/api/v1/auth/universal-auth/login` with `clientId` and `clientSecret`. Default TTL is 2 hours.
2. **Workspace ID:** Found in your Infisical project settings page. This is different from the project name/slug.
3. **Environment slugs:** Common values are `dev`, `staging`, `prod` — use the exact slug shown in your Infisical dashboard.
4. **Secret references:** By default, `expandSecretReferences` is `false`. Set to `true` to resolve cross-secret references in values.
5. **Rate limits (Infisical Cloud):** Free plan allows 200 read requests/min; Pro plan allows 350/min. Self-hosted instances have no rate limits.
6. **Security:** The `INFISICAL_TOKEN` grants access to all secrets the machine identity is authorized for. Store and rotate it carefully.
