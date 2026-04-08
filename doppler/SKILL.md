---
name: doppler
description: Doppler Secrets Manager API for retrieving and listing secrets. Use when user mentions "Doppler", "doppler secrets", "dp.st token", or asks about secrets management with Doppler.

---

# Doppler Secrets Manager API

Doppler is a secrets manager that lets you fetch, list, and manage secrets across projects and environments. This skill enables retrieving individual secrets or listing all secrets from a Doppler project config using a service token.

> Official docs: `https://docs.doppler.com/reference/api`

## When to Use

- Fetch the value of a specific secret from a Doppler config
- List all secrets in a Doppler project/config
- Inspect raw vs. computed secret values (with variable interpolation)

## Prerequisites

Go to [vm0.ai](https://app.vm0.ai) **Settings → Connectors** and connect **Doppler**. vm0 will automatically inject the required `DOPPLER_TOKEN` environment variable.

Your `DOPPLER_TOKEN` must be a **Service Token** (format: `dp.st.*`). Service tokens are scoped to a specific project and config.

> **Important:** When using `$(printenv DOPPLER_TOKEN)` in commands that contain a pipe (`|`), always use `$(printenv ...)` syntax — a known Claude Code issue silently clears `$VAR` references in pipelines.

## Core APIs

### Fetch a Single Secret by Name

```bash
curl -s "https://api.doppler.com/v3/configs/config/secret" \
  -H "Authorization: Bearer $(printenv DOPPLER_TOKEN)" \
  -G \
  --data-urlencode "project=<project-slug>" \
  --data-urlencode "config=<config-name>" \
  --data-urlencode "name=<SECRET_NAME>" | jq '{name: .secret.name, raw: .secret.value.raw, computed: .secret.value.computed}'
```

Replace `<project-slug>` with your Doppler project slug, `<config-name>` with the config (e.g., `dev`, `prd`), and `<SECRET_NAME>` with the exact secret key.

---

### List All Secrets in a Config

```bash
curl -s "https://api.doppler.com/v3/configs/config/secrets" \
  -H "Authorization: Bearer $(printenv DOPPLER_TOKEN)" \
  -G \
  --data-urlencode "project=<project-slug>" \
  --data-urlencode "config=<config-name>" | jq '.secrets | to_entries[] | {name: .key, raw: .value.raw, computed: .value.computed}'
```

---

### Download All Secrets as JSON

```bash
curl -s "https://api.doppler.com/v3/configs/config/secrets/download" \
  -H "Authorization: Bearer $(printenv DOPPLER_TOKEN)" \
  -G \
  --data-urlencode "project=<project-slug>" \
  --data-urlencode "config=<config-name>" \
  --data-urlencode "format=json"
```

Returns a flat key/value JSON object of all secrets.

---

### List Projects

```bash
curl -s "https://api.doppler.com/v3/projects" \
  -H "Authorization: Bearer $(printenv DOPPLER_TOKEN)" | jq '.projects[] | {id, name, slug}'
```

---

### List Configs in a Project

```bash
curl -s "https://api.doppler.com/v3/configs" \
  -H "Authorization: Bearer $(printenv DOPPLER_TOKEN)" \
  -G \
  --data-urlencode "project=<project-slug>" | jq '.configs[] | {name, environment, locked}'
```

---

## Guidelines

1. **Service Token scope:** A `dp.st.*` token is scoped to a single project + config. It cannot access other projects.
2. **Project slug:** Find via "List Projects". This is the URL-safe identifier, not the display name.
3. **Config name:** Typically matches the environment name (e.g., `dev`, `staging`, `prd`). List configs to verify.
4. **raw vs. computed:** `raw` is the stored value; `computed` has variable references resolved.
5. **Rate limits:** Doppler imposes per-token rate limits on the free plan. Avoid polling in tight loops.
6. **Security:** Service tokens grant read (and optionally write) access to all secrets in the scoped config. Rotate them regularly.
