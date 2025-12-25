---
name: jira
description: Jira Cloud REST API via curl. Use this skill to create, update, search, and manage issues, projects, and workflows in Jira.
vm0_env:
  - JIRA_DOMAIN
  - JIRA_EMAIL
  - JIRA_API_TOKEN
---

# Jira API

Use the Jira Cloud REST API via direct `curl` calls to manage **issues, projects, and workflows**.

> Official docs: `https://developer.atlassian.com/cloud/jira/platform/rest/v3/`

---

## When to Use

Use this skill when you need to:

- **Create issues** in Jira projects
- **Search issues** using JQL (Jira Query Language)
- **Update issues** (status, assignee, priority, etc.)
- **Get issue details** and comments
- **List projects** and their metadata
- **Transition issues** through workflow states
- **Add comments** to issues

---

## Prerequisites

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Copy the generated token (you won't see it again)

```bash
export JIRA_DOMAIN="mycompany" # e.g., "mycompany" or "mycompany.atlassian.net"
export JIRA_EMAIL="you@example.com" # Your Atlassian account email
export JIRA_API_TOKEN="your-api-token" # API token from step 2
```

### Rate Limits

Jira Cloud has rate limits that vary by endpoint. For most REST API calls, expect limits around 100-500 requests per minute.

---

## How to Use

All examples below assume `JIRA_DOMAIN`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` are set.

Base URL: `https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3`

> Note: `${JIRA_DOMAIN%.atlassian.net}` strips the suffix if present, so both `mycompany` and `mycompany.atlassian.net` work.

---

### 1. Get Current User

Verify your authentication:

```bash
curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/myself" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_da957b.json
cat /tmp/resp_da957b.json | jq '{accountId, emailAddress, displayName, active}'
```

---

### 2. List Projects

Get all projects you have access to:

```bash
curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/project" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_6be647.json
cat /tmp/resp_6be647.json | jq '.[] | {id, key, name}'
```

---

### 3. Get Project Details

Get details for a specific project:

```bash
PROJECT_KEY="PROJ"

curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/project/${PROJECT_KEY}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_042e4e.json
cat /tmp/resp_042e4e.json | jq '{id, key, name, projectTypeKey, lead: .lead.displayName}'
```

---

### 4. Get Issue Types for Project

List available issue types (Task, Bug, Story, etc.):

```bash
PROJECT_KEY="PROJ"

curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/project/${PROJECT_KEY}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_042e4e.json
cat /tmp/resp_042e4e.json | jq '.issueTypes[] | {id, name, subtask}'
```

---

### 5. Search Issues with JQL

Search issues using Jira Query Language:

```bash
curl -s -G "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/search/jql" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --data-urlencode "jql=project = PROJ AND status != Done ORDER BY created DESC" --data-urlencode "maxResults=10" --data-urlencode "fields=key,summary,status,assignee,priority" > /tmp/resp_c4bbe8.json
cat /tmp/resp_c4bbe8.json | jq '.issues[] | {key, summary: .fields.summary, status: .fields.status.name, assignee: .fields.assignee.displayName, priority: .fields.priority.name}'
```

Common JQL examples:
- `project = PROJ` - Issues in project
- `assignee = currentUser()` - Your issues
- `status = "In Progress"` - By status
- `created >= -7d` - Created in last 7 days
- `labels = bug` - By label
- `priority = High` - By priority

---

### 6. Get Issue Details

Get full details of an issue:

```bash
ISSUE_KEY="PROJ-123"

curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_a8cff0.json
cat /tmp/resp_a8cff0.json | jq '{key, summary: .fields.summary, status: .fields.status.name, assignee: .fields.assignee.displayName, priority: .fields.priority.name, created: .fields.created, updated: .fields.updated}'
```

---

### 7. Create Issue

Create a new issue (API v3 uses Atlassian Document Format for description):

```bash
curl -s -X POST "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d '{
  "fields": {
  "project": {"key": "PROJ"},
  "summary": "Bug: Login button not responding",
  "description": {
  "type": "doc",
  "version": 1,
  "content": [
  {
  "type": "paragraph",
  "content": [
  {"type": "text", "text": "The login button on the mobile app is not responding when tapped."}
  ]
  }
  ]
  },
  "issuetype": {"name": "Bug"}
  }
}' > /tmp/resp_0cbba0.json
cat /tmp/resp_0cbba0.json | jq '{id, key, self}'
```

---

### 8. Create Issue with Priority and Labels

Create issue with additional fields:

```bash
curl -s -X POST "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d '{
  "fields": {
  "project": {"key": "PROJ"},
  "summary": "Implement user authentication",
  "description": {
  "type": "doc",
  "version": 1,
  "content": [
  {
  "type": "paragraph",
  "content": [
  {"type": "text", "text": "Add OAuth2 authentication flow for the mobile app."}
  ]
  }
  ]
  },
  "issuetype": {"name": "Story"},
  "priority": {"name": "High"},
  "labels": ["backend", "security"]
  }
}' > /tmp/resp_526677.json
cat /tmp/resp_526677.json | jq '{id, key, self}'
```

---

### 9. Update Issue

Update an existing issue:

```bash
ISSUE_KEY="PROJ-123"

curl -s -X PUT "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d '{
  "fields": {
  "summary": "Updated: Login button not responding on iOS",
  "priority": {"name": "Highest"},
  "labels": ["bug", "ios", "urgent"]
  }
  }'
```

Returns 204 No Content on success.

---

### 10. Get Available Transitions

Get possible status transitions for an issue:

```bash
ISSUE_KEY="PROJ-123"

curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/transitions" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_2a1fa5.json
cat /tmp/resp_2a1fa5.json | jq '.transitions[] | {id, name, to: .to.name}'
```

---

### 11. Transition Issue (Change Status)

Move issue to a different status:

```bash
ISSUE_KEY="PROJ-123"
TRANSITION_ID="31" # Get from transitions endpoint

curl -s -X POST "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/transitions" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d "{\"transition\": {\"id\": \"${TRANSITION_ID}\"}}"
```

Returns 204 No Content on success.

---

### 12. Add Comment

Add a comment to an issue:

```bash
ISSUE_KEY="PROJ-123"

curl -s -X POST "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/comment" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d '{
  "body": {
  "type": "doc",
  "version": 1,
  "content": [
  {
  "type": "paragraph",
  "content": [
  {"type": "text", "text": "Investigated and found the root cause. Working on a fix."}
  ]
  }
  ]
  }
}' > /tmp/resp_e8b901.json
cat /tmp/resp_e8b901.json | jq '{id, created, author: .author.displayName}'
```

---

### 13. Get Issue Comments

List all comments on an issue:

```bash
ISSUE_KEY="PROJ-123"

curl -s -X GET "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/comment" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" > /tmp/resp_fcb6f7.json
cat /tmp/resp_fcb6f7.json | jq '.comments[] | {id, author: .author.displayName, created, body: .body.content[0].content[0].text}'
```

---

### 14. Assign Issue

Assign an issue to a user:

```bash
ISSUE_KEY="PROJ-123"
ACCOUNT_ID="5b10ac8d82e05b22cc7d4ef5" # Get from /rest/api/3/user/search

curl -s -X PUT "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/assignee" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d "{\"accountId\": \"${ACCOUNT_ID}\"}"
```

---

### 15. Search Users

Find users by email or name:

```bash
curl -s -G "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/user/search" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" --header "Accept: application/json" --data-urlencode "query=john" > /tmp/resp_cb31c6.json
cat /tmp/resp_cb31c6.json | jq '.[] | {accountId, displayName, emailAddress}'
```

---

### 16. Delete Issue

Delete an issue (use with caution):

```bash
ISSUE_KEY="PROJ-123"

curl -s -X DELETE "https://${JIRA_DOMAIN%.atlassian.net}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}" -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}"
```

Returns 204 No Content on success.

---

## Atlassian Document Format (ADF)

Jira API v3 uses ADF for rich text fields like `description` and `comment.body`. Basic structure:

```json
{
  "type": "doc",
  "version": 1,
  "content": [
  {
  "type": "paragraph",
  "content": [
  {"type": "text", "text": "Plain text"},
  {"type": "text", "text": "Bold text", "marks": [{"type": "strong"}]},
  {"type": "text", "text": "Code", "marks": [{"type": "code"}]}
  ]
  },
  {
  "type": "bulletList",
  "content": [
  {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Item 1"}]}]},
  {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Item 2"}]}]}
  ]
  },
  {
  "type": "codeBlock",
  "attrs": {"language": "python"},
  "content": [{"type": "text", "text": "print('hello')"}]
  }
  ]
}
```

---

## Guidelines

1. **Use JQL for complex queries**: JQL is powerful for filtering issues by any field combination
2. **Check transitions first**: Before changing status, get available transitions for the issue
3. **Handle pagination**: Use `startAt` and `maxResults` for large result sets
4. **Use account IDs**: Jira Cloud uses account IDs (not usernames) for user references
5. **ADF for rich text**: API v3 requires Atlassian Document Format for description and comments
6. **Rate limiting**: Implement exponential backoff if you receive 429 responses
