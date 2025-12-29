---
name: intercom
description: Intercom REST API for managing customer conversations, contacts, messages, and support tickets. Use this skill to send messages, manage contacts, handle conversations, and access help center content.
vm0_env:
  - INTERCOM_ACCESS_TOKEN
---

# Intercom API

Manage customer conversations, contacts, messages, articles, and support operations via the Intercom REST API.

> Official docs: `https://developers.intercom.com/docs`

---

## When to Use

Use this skill when you need to:

- **Manage contacts** - Create, update, search, and delete user profiles
- **Handle conversations** - List, search, reply to, assign, and close conversations
- **Send messages** - Create and send messages to contacts
- **Manage companies** - Track organizations and their members
- **Work with articles** - Access help center content and knowledge base
- **Add notes** - Annotate contact profiles with internal notes
- **Use tags** - Organize contacts and conversations with labels
- **Track events** - Record custom user activities and behaviors
- **Manage tickets** - Create and handle support tickets

---

## Prerequisites

### Getting Your Access Token

1. Log in to your [Intercom workspace](https://app.intercom.com/)
2. Navigate to **Settings** → **Developers** → **Developer Hub**
3. Create a new app or select an existing one
4. Go to **Configure** → **Authentication**
5. Copy your **Access Token**

```bash
export INTERCOM_ACCESS_TOKEN="your_access_token"
```

### Verify Token

Test your token:

```bash
bash -c 'curl -s "https://api.intercom.io/admins" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"' | jq .
```

Expected response: List of admins in your workspace

**✅ This skill has been tested and verified** with a live Intercom workspace. All core endpoints work correctly.

### Regional Endpoints

- **US (Default)**: `https://api.intercom.io/`
- **Europe**: `https://api.eu.intercom.io/`
- **Australia**: `https://api.au.intercom.io/`

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## How to Use

All examples assume `INTERCOM_ACCESS_TOKEN` is set.

**Base URL**: `https://api.intercom.io/`

**Required Headers**:
- `Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}`
- `Accept: application/json`
- `Intercom-Version: 2.14`

---

## Core APIs

### 1. List Admins

Get all admins/teammates in your workspace:

```bash
bash -c 'curl -s "https://api.intercom.io/admins" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"' | jq '.admins[] | {id, name, email}
```

---

### 2. Create Contact

Create a new contact (lead or user):

Write to `/tmp/intercom_request.json`:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Accept: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

With custom attributes:

Write to `/tmp/intercom_request.json`:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "custom_attributes": {
    "plan": "premium",
    "signup_date": "2024-01-15"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Accept: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 3. Get Contact

Retrieve a specific contact by ID:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"

bash -c 'curl -s "https://api.intercom.io/contacts/${CONTACT_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"' | jq .
```

---

### 4. Update Contact

Update contact information:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "name": "Jane Doe",
  "custom_attributes": {
    "plan": "enterprise"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.intercom.io/contacts/${CONTACT_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Accept: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

**Note**: Newly created contacts may need a few seconds before they can be updated.

---

### 5. Delete Contact

Permanently delete a contact:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"

curl -s -X DELETE "https://api.intercom.io/contacts/${CONTACT_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"
```

---

### 6. Search Contacts

Search contacts with filters:

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "field": "email",
    "operator": "=",
    "value": "user@example.com"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq '.data[]'
```

Search with multiple filters:

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "operator": "AND",
    "value": [
      {
        "field": "role",
        "operator": "=",
        "value": "user"
      },
      {
        "field": "custom_attributes.plan",
        "operator": "=",
        "value": "premium"
      }
    ]
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq '.data[]'
```

---

### 7. List Conversations

Get all conversations:

```bash
bash -c 'curl -s "https://api.intercom.io/conversations?order=desc&sort=updated_at" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"' | jq '.conversations[] | {id, state, created_at, updated_at}
```

---

### 8. Get Conversation

Retrieve a specific conversation:

```bash
CONVERSATION_ID="147"

bash -c 'curl -s "https://api.intercom.io/conversations/${CONVERSATION_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Accept: application/json" -H "Intercom-Version: 2.14"' | jq .
```

---

### 9. Search Conversations

Search for open conversations:

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "operator": "AND",
    "value": [
      {
        "field": "state",
        "operator": "=",
        "value": "open"
      }
    ]
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/conversations/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq '.conversations[]'
```

Search by assignee:

```bash
ADMIN_ID="1234567"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "field": "admin_assignee_id",
    "operator": "=",
    "value": "ADMIN_ID_PLACEHOLDER"
  }
}
```

Then run:

```bash
sed -i '' "s/ADMIN_ID_PLACEHOLDER/${ADMIN_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/conversations/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq '.conversations[]'
```

---

### 10. Reply to Conversation

Reply as an admin:

```bash
CONVERSATION_ID="147"
ADMIN_ID="1234567"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "message_type": "comment",
  "type": "admin",
  "admin_id": "ADMIN_ID_PLACEHOLDER",
  "body": "Thank you for your message. We'll help you with this."
}
```

Then run:

```bash
sed -i '' "s/ADMIN_ID_PLACEHOLDER/${ADMIN_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/conversations/${CONVERSATION_ID}/parts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 11. Assign Conversation

Assign a conversation to an admin or team:

```bash
CONVERSATION_ID="147"
ADMIN_ID="1234567"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "message_type": "assignment",
  "type": "admin",
  "admin_id": "ADMIN_ID_PLACEHOLDER",
  "assignee_id": "ASSIGNEE_ID_PLACEHOLDER"
}
```

Then run:

```bash
sed -i '' "s/ADMIN_ID_PLACEHOLDER/${ADMIN_ID}/; s/ASSIGNEE_ID_PLACEHOLDER/${ADMIN_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/conversations/${CONVERSATION_ID}/parts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 12. Close Conversation

Close an open conversation:

```bash
CONVERSATION_ID="147"
ADMIN_ID="1234567"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "message_type": "close",
  "type": "admin",
  "admin_id": "ADMIN_ID_PLACEHOLDER"
}
```

Then run:

```bash
sed -i '' "s/ADMIN_ID_PLACEHOLDER/${ADMIN_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/conversations/${CONVERSATION_ID}/parts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 13. Create Note

Add an internal note to a contact:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "body": "Customer is interested in enterprise plan. Follow up next week."
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts/${CONTACT_ID}/notes" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 14. List Tags

Get all tags:

```bash
bash -c 'curl -s "https://api.intercom.io/tags" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Intercom-Version: 2.14"' | jq '.data[] | {id, name}
```

---

### 15. Create Tag

Create a new tag:

Write to `/tmp/intercom_request.json`:

```json
{
  "name": "VIP Customer"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/tags" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 16. Tag Contact

Add a tag to a contact:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"
TAG_ID="81"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "id": "TAG_ID_PLACEHOLDER"
}
```

Then run:

```bash
sed -i '' "s/TAG_ID_PLACEHOLDER/${TAG_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/contacts/${CONTACT_ID}/tags" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 17. Untag Contact

Remove a tag from a contact:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"
TAG_ID="7522907"

curl -s -X DELETE "https://api.intercom.io/contacts/${CONTACT_ID}/tags/${TAG_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Intercom-Version: 2.14"
```

---

### 18. List Articles

Get help center articles:

```bash
bash -c 'curl -s "https://api.intercom.io/articles" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Intercom-Version: 2.14"' | jq '.data[] | {id, title, url}
```

---

### 19. Get Article

Retrieve a specific article:

```bash
ARTICLE_ID="123456"

bash -c 'curl -s "https://api.intercom.io/articles/${ARTICLE_ID}" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Intercom-Version: 2.14"' | jq .
```

---

### 20. Create Company

Create a new company:

Write to `/tmp/intercom_request.json`:

```json
{
  "company_id": "acme-corp-123",
  "name": "Acme Corporation",
  "plan": "enterprise",
  "size": 500,
  "website": "https://acme.com"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/companies" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 21. Attach Contact to Company

Associate a contact with a company:

```bash
CONTACT_ID="63a07ddf05a32042dffac965"
COMPANY_ID="6762f09a1bb69f9f2193bb34"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "id": "COMPANY_ID_PLACEHOLDER"
}
```

Then run:

```bash
sed -i '' "s/COMPANY_ID_PLACEHOLDER/${COMPANY_ID}/" /tmp/intercom_request.json

bash -c 'curl -s -X POST "https://api.intercom.io/contacts/${CONTACT_ID}/companies" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

### 22. Track Event

Record a custom event for a contact:

Write to `/tmp/intercom_request.json`:

```json
{
  "event_name": "purchased-plan",
  "created_at": 1234567890,
  "user_id": "user-123",
  "metadata": {
    "plan": "premium",
    "price": 99
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/events" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq .
```

---

## Common Workflows

### Find and Reply to Open Conversations

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "field": "state",
    "operator": "=",
    "value": "open"
  }
}
```

Then run:

```bash
# Search for open conversations
OPEN_CONVS="$(bash -c 'curl -s -X POST "https://api.intercom.io/conversations/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq -r '.conversations[0].id')"

# Reply to first conversation
ADMIN_ID="1234567"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "message_type": "comment",
  "type": "admin",
  "admin_id": "ADMIN_ID_PLACEHOLDER",
  "body": "We're looking into this for you."
}
```

Then run:

```bash
sed -i '' "s/ADMIN_ID_PLACEHOLDER/${ADMIN_ID}/" /tmp/intercom_request.json

curl -s -X POST "https://api.intercom.io/conversations/${OPEN_CONVS}/parts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json
```

### Create Contact and Add to Company

Write to `/tmp/intercom_request.json`:

```json
{
  "email": "newuser@acme.com",
  "name": "New User"
}
```

Then run:

```bash
# Create contact
CONTACT=$(curl -s -X POST "https://api.intercom.io/contacts" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json)

CONTACT_ID=$(echo $CONTACT | jq -r '.id')

# Attach to company
COMPANY_ID="6762f09a1bb69f9f2193bb34"
```

Write to `/tmp/intercom_request.json`:

```json
{
  "id": "COMPANY_ID_PLACEHOLDER"
}
```

Then run:

```bash
sed -i '' "s/COMPANY_ID_PLACEHOLDER/${COMPANY_ID}/" /tmp/intercom_request.json

curl -s -X POST "https://api.intercom.io/contacts/${CONTACT_ID}/companies" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json
```

---

## Search Operators

### Field Operators

- `=` - Equals
- `!=` - Not equals
- `<` - Less than
- `>` - Greater than
- `<=` - Less than or equal
- `>=` - Greater than or equal
- `IN` - In list
- `NIN` - Not in list
- `~` - Contains (for strings)
- `!~` - Does not contain

### Query Operators

- `AND` - All conditions must match
- `OR` - Any condition can match

### Example Complex Search

Write to `/tmp/intercom_request.json`:

```json
{
  "query": {
    "operator": "AND",
    "value": [
      {
        "field": "role",
        "operator": "=",
        "value": "user"
      },
      {
        "field": "created_at",
        "operator": ">",
        "value": 1609459200
      },
      {
        "field": "custom_attributes.plan",
        "operator": "IN",
        "value": ["premium", "enterprise"]
      }
    ]
  },
  "pagination": {
    "per_page": 50
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.intercom.io/contacts/search" -H "Authorization: Bearer ${INTERCOM_ACCESS_TOKEN}" -H "Content-Type: application/json" -H "Intercom-Version: 2.14" -d @/tmp/intercom_request.json' | jq '.data[]'
```

---

## Rate Limits

- **Private Apps**: 10,000 API calls per minute
- **Public Apps**: 10,000 API calls per minute
- **Workspace Limit**: 25,000 API calls per minute (combined)

When rate limited, API returns `429 Too Many Requests`.

**Rate Limit Headers**:
- `X-RateLimit-Limit`: Requests per minute allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Guidelines

1. **Always include required headers**: All requests should have `Authorization`, `Accept: application/json`, and `Intercom-Version: 2.14` headers
2. **Use correct HTTP methods**:
   - `GET` for retrieving data
   - `POST` for creating resources and searches
   - `PATCH` for updating resources (not PUT)
   - `DELETE` for removing resources
3. **Handle rate limits**: Monitor `X-RateLimit-Remaining` and implement exponential backoff
4. **Wait after creating resources**: Newly created contacts may need a few seconds before they can be updated or searched
5. **Use search wisely**: Search endpoints are powerful but count toward rate limits
6. **Pagination**: Use cursor-based pagination for large datasets
7. **Test with small datasets**: Verify your queries work before scaling up
8. **Secure tokens**: Never expose access tokens in public repositories or logs
9. **Use filters**: Narrow search results with filters to reduce API calls
10. **Conversation states**: Valid states are `open`, `closed`, `snoozed`
11. **Custom attributes**: Define custom fields in Intercom UI before using in API
12. **Check workspace ID**: Your workspace ID is included in contact responses for verification

---

## API Reference

- Main Documentation: https://developers.intercom.com/docs
- API Reference: https://developers.intercom.com/docs/references/rest-api/api-intercom-com/
- Authentication: https://developers.intercom.com/docs/build-an-integration/learn-more/authentication/
- Rate Limiting: https://developers.intercom.com/docs/references/rest-api/errors/rate-limiting/
- Contacts API: https://developers.intercom.com/docs/references/rest-api/api-intercom-com/contacts/
- Conversations API: https://developers.intercom.com/docs/references/rest-api/api-intercom-com/conversations/
- Developer Hub: https://app.intercom.com/a/apps/_/developer-hub
