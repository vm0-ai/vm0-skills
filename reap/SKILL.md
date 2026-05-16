---
name: reap
description: Reap API for modular fintech infrastructure, including users, companies,
  accounts, cards, virtual assets, activities, and reconciliations. Use when user
  mentions "Reap", fintech cards, wallets, compliance, or embedded finance APIs.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name REAP_API_KEY` or `zero doctor check-connector --url "$REAP_API_BASE_URL/users" --method GET`

## Official Docs

- API reference: https://docs.reap.global/api-reference/overview
- Authentication: https://docs.reap.global/api-reference/authentication
- OpenAPI spec: https://docs.reap.global/api-reference/openapi.json

## Prerequisites

Connect the **Reap** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The connector provides:

- `REAP_API_KEY`: Reap project API key
- `REAP_API_BASE_URL`: Reap API base URL, usually `https://sandbox.api.reap.global/v1` or `https://prod.api.reap.global/v1`

Every request must include `Authorization: Bearer $REAP_API_KEY` and `Reap-Version: 2025-02-14`.

## Users

### List Users

```bash
curl -s "$REAP_API_BASE_URL/users?limit=20" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Get User by ID

```bash
curl -s "$REAP_API_BASE_URL/users/<user-id>" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Create User

Write to `/tmp/reap_user.json`:

```json
{
  "email": "john.doe@example.com",
  "phoneNumber": "+14155552671",
  "firstName": "John",
  "lastName": "Doe",
  "termsAcceptance": {
    "version": "2026-01-17",
    "ipAddress": "192.168.1.1"
  }
}
```

Then run:

```bash
curl -s -X POST "$REAP_API_BASE_URL/users" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" --header "Content-Type: application/json" -d @/tmp/reap_user.json | jq .
```

## Accounts

### List Accounts

```bash
curl -s "$REAP_API_BASE_URL/accounts?limit=20" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Get Account Balance

```bash
curl -s "$REAP_API_BASE_URL/accounts/<account-id>/balance" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Get Account Assets

```bash
curl -s "$REAP_API_BASE_URL/accounts/<account-id>/assets" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

## Cards

### List Cards

```bash
curl -s "$REAP_API_BASE_URL/cards?limit=20" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Get Card by ID

```bash
curl -s "$REAP_API_BASE_URL/cards/<card-id>" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Freeze Card

```bash
curl -s -X POST "$REAP_API_BASE_URL/cards/<card-id>/freeze" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### Unfreeze Card

```bash
curl -s -X POST "$REAP_API_BASE_URL/cards/<card-id>/unfreeze" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

## Activities and Reconciliations

### List Activities

```bash
curl -s "$REAP_API_BASE_URL/activities?limit=20" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

### List Reconciliations

```bash
curl -s "$REAP_API_BASE_URL/reconciliations?limit=20" --header "Authorization: Bearer $REAP_API_KEY" --header "Reap-Version: 2025-02-14" | jq .
```

## Guidelines

- Use cursor pagination by passing `cursor=<nextCursor>` from the previous response.
- Sandbox and production API keys are environment-scoped; match the key to `REAP_API_BASE_URL`.
- Treat card detail reveal URLs as sensitive. Do not log, store, or expose them outside the immediate secure display flow.
- Reap APIs are program-mode dependent; some company fields apply only to corporate programs.
