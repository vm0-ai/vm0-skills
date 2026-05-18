---
name: clerk
description: Clerk Backend API for identity. Use when user mentions "Clerk", "Clerk.com", "user lookup", "ban user", "organization membership", "invitation", or asks about user/org administration.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name CLERK_TOKEN` or `zero doctor check-connector --url https://api.clerk.com/v1/users/count --method GET`

## Authentication

All requests require a Bearer token. Use `sk_test_*` for sandbox/dev and `sk_live_*` for production:

```
Authorization: Bearer $CLERK_TOKEN
```

Get the key from Clerk Dashboard → API Keys → Secret keys.

## Users

### Count Users

```bash
curl -s "https://api.clerk.com/v1/users/count" --header "Authorization: Bearer $CLERK_TOKEN"
```

### List Users

Supports `limit` (max 500), `offset`, `email_address`, `phone_number`, `username`, `user_id`, `external_id`, `organization_id`, `query`, `order_by`:

```bash
curl -s "https://api.clerk.com/v1/users?limit=100&order_by=-created_at" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Find User by Email

Returns an array — Clerk allows multiple users per email if confirmed across instances. Replace `<email>` with the actual email:

```bash
curl -s "https://api.clerk.com/v1/users?email_address=<email>" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Get User by ID

Replace `<user-id>` with the actual Clerk user ID (starts with `user_`):

```bash
curl -s "https://api.clerk.com/v1/users/<user-id>" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Update User

Write to `/tmp/clerk_request.json`:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "public_metadata": { "plan": "pro" }
}
```

Replace `<user-id>` with the actual user ID:

```bash
curl -s -X PATCH "https://api.clerk.com/v1/users/<user-id>" --header "Authorization: Bearer $CLERK_TOKEN" --header "Content-Type: application/json" -d @/tmp/clerk_request.json
```

### Ban / Unban User

Replace `<user-id>` with the actual user ID:

```bash
curl -s -X POST "https://api.clerk.com/v1/users/<user-id>/ban" --header "Authorization: Bearer $CLERK_TOKEN"
curl -s -X POST "https://api.clerk.com/v1/users/<user-id>/unban" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Lock / Unlock User

Replace `<user-id>` with the actual user ID:

```bash
curl -s -X POST "https://api.clerk.com/v1/users/<user-id>/lock" --header "Authorization: Bearer $CLERK_TOKEN"
curl -s -X POST "https://api.clerk.com/v1/users/<user-id>/unlock" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Delete User

Hard-deletes the user and all sessions. Replace `<user-id>` with the actual user ID:

```bash
curl -s -X DELETE "https://api.clerk.com/v1/users/<user-id>" --header "Authorization: Bearer $CLERK_TOKEN"
```

### List User's Organization Memberships

Replace `<user-id>` with the actual user ID:

```bash
curl -s "https://api.clerk.com/v1/users/<user-id>/organization_memberships" --header "Authorization: Bearer $CLERK_TOKEN"
```

## Organizations

### List Organizations

Supports `limit` (max 500), `offset`, `query`, `order_by`:

```bash
curl -s "https://api.clerk.com/v1/organizations?limit=100&order_by=-created_at" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Get Organization by ID

Replace `<organization-id>` with the actual org ID (starts with `org_`):

```bash
curl -s "https://api.clerk.com/v1/organizations/<organization-id>" --header "Authorization: Bearer $CLERK_TOKEN"
```

### List Organization Memberships

Replace `<organization-id>` with the actual org ID:

```bash
curl -s "https://api.clerk.com/v1/organizations/<organization-id>/memberships?limit=100" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Create Organization Membership

Write to `/tmp/clerk_request.json`:

```json
{
  "user_id": "user_xxx",
  "role": "org:member"
}
```

Replace `<organization-id>` with the actual org ID:

```bash
curl -s -X POST "https://api.clerk.com/v1/organizations/<organization-id>/memberships" --header "Authorization: Bearer $CLERK_TOKEN" --header "Content-Type: application/json" -d @/tmp/clerk_request.json
```

### Remove Organization Member

Replace `<organization-id>` and `<user-id>` with the actual IDs:

```bash
curl -s -X DELETE "https://api.clerk.com/v1/organizations/<organization-id>/memberships/<user-id>" --header "Authorization: Bearer $CLERK_TOKEN"
```

## Invitations

### List Pending Invitations

```bash
curl -s "https://api.clerk.com/v1/invitations?status=pending" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Create Invitation

Write to `/tmp/clerk_request.json`:

```json
{
  "email_address": "user@example.com",
  "redirect_url": "https://app.example.com/accept",
  "public_metadata": { "source": "manual" }
}
```

```bash
curl -s -X POST "https://api.clerk.com/v1/invitations" --header "Authorization: Bearer $CLERK_TOKEN" --header "Content-Type: application/json" -d @/tmp/clerk_request.json
```

### Revoke Invitation

Replace `<invitation-id>` with the actual invitation ID:

```bash
curl -s -X POST "https://api.clerk.com/v1/invitations/<invitation-id>/revoke" --header "Authorization: Bearer $CLERK_TOKEN"
```

## Sessions

### List Sessions

Filter by `user_id`, `client_id`, or `status`:

```bash
curl -s "https://api.clerk.com/v1/sessions?status=active&limit=100" --header "Authorization: Bearer $CLERK_TOKEN"
```

### Revoke Session

Replace `<session-id>` with the actual session ID:

```bash
curl -s -X POST "https://api.clerk.com/v1/sessions/<session-id>/revoke" --header "Authorization: Bearer $CLERK_TOKEN"
```

## Guidelines

1. **Test vs Live**: Secret keys are environment-scoped. `sk_test_*` only works on the development instance; `sk_live_*` only works on production. Confirm the environment before destructive operations.
2. **Pagination**: Use `limit` (max 500) and `offset`. Total count is in the `total_count` field of the response wrapper.
3. **Destructive operations** (delete, ban, lock, revoke) are irreversible or hard to reverse — verify the target user/org ID before running.
4. **Rate limits**: Backend API allows 1,000 requests/10 seconds per instance. Implement exponential backoff on HTTP 429.
5. **User metadata**: Use `public_metadata` for data visible to the user, `private_metadata` for backend-only data, `unsafe_metadata` for end-user-mutable data.

## API Reference

- Documentation: https://clerk.com/docs/reference/backend-api
- OpenAPI spec: https://github.com/clerk/openapi-specs
- Dashboard: https://dashboard.clerk.com
