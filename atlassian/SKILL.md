---
name: atlassian
description: Atlassian API for Confluence and Jira. Use when user mentions "Confluence
  page", "Atlassian", or asks about wiki/documentation management.
vm0_secrets:
  - ATLASSIAN_TOKEN
vm0_vars:
  - ATLASSIAN_DOMAIN
- ATLASSIAN_EMAIL
---

# Atlassian API

Use the Atlassian Cloud REST APIs via direct `curl` calls to manage **Jira issues, Confluence pages, and other Atlassian products**.

> Official docs:
> - Jira: `https://developer.atlassian.com/cloud/jira/platform/rest/v3/`
> - Confluence: `https://developer.atlassian.com/cloud/confluence/rest/v2/`

---

## When to Use

Use this skill when you need to:

- **Create, update, and search Jira issues** using JQL
- **Transition Jira issues** through workflow states
- **Create and update Confluence pages** and blog posts
- **Search Confluence content** using CQL
- **Manage Confluence spaces** and their content hierarchy
- **Add comments** to Jira issues or Confluence pages

---

## Prerequisites

1. Log in to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**, give it a label, and click **Create**
3. Copy the generated token (you will not see it again)

```bash
export ATLASSIAN_DOMAIN="mycompany"          # e.g., "mycompany" (without .atlassian.net)
export ATLASSIAN_EMAIL="you@example.com"     # Your Atlassian account email
export ATLASSIAN_TOKEN="your-api-token"      # API token from step 2
```

### Authentication

All Atlassian Cloud APIs use HTTP Basic authentication with your email and API token:

```
-u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}"
```

### Rate Limits

Jira Cloud and Confluence Cloud have rate limits that vary by endpoint. For most REST API calls, expect limits around 100-500 requests per minute.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY"' | jq '.field'
> ```

## How to Use

All examples below assume `ATLASSIAN_DOMAIN`, `ATLASSIAN_EMAIL`, and `ATLASSIAN_TOKEN` are set.

Base URLs:
- Jira: `https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3`
- Confluence: `https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2`

---

## Jira

### 1. Get Current User

Verify your authentication:

```bash
bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/myself" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 2. List Projects

Get all Jira projects you have access to:

```bash
bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/project" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 3. Search Issues with JQL

Search issues using Jira Query Language.

Write to `/tmp/atlassian_request.json`:

```json
{
  "jql": "project = PROJ AND status NOT IN (Done) ORDER BY created DESC",
  "maxResults": 10,
  "fields": ["key", "summary", "status", "assignee", "priority"]
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/search/jql" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json' | jq '.issues[] | {key, summary: .fields.summary, status: .fields.status.name}'
```

Common JQL examples:
- `project = PROJ` - Issues in project
- `assignee = currentUser()` - Your issues
- `status = "In Progress"` - By status
- `created >= -7d` - Created in last 7 days
- `labels = bug` - By label
- `priority = High` - By priority

---

### 4. Get Issue Details

Get full details of a Jira issue:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 5. Create Issue

Create a new Jira issue (API v3 uses Atlassian Document Format for description).

Write to `/tmp/atlassian_request.json`:

```json
{
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
    "issuetype": {"name": "Bug"},
    "priority": {"name": "High"},
    "labels": ["mobile", "urgent"]
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 6. Update Issue

Update an existing Jira issue.

Write to `/tmp/atlassian_request.json`:

```json
{
  "fields": {
    "summary": "Updated: Login button not responding on iOS",
    "priority": {"name": "Highest"},
    "labels": ["bug", "ios", "urgent"]
  }
}
```

Then run:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X PUT "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

Returns 204 No Content on success.

---

### 7. Get Available Transitions

Get possible status transitions for a Jira issue:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/transitions" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 8. Transition Issue (Change Status)

Move a Jira issue to a different status.

Write to `/tmp/atlassian_request.json`:

```json
{
  "transition": {
    "id": "31"
  }
}
```

Then run:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/transitions" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

Returns 204 No Content on success.

---

### 9. Add Comment to Issue

Add a comment to a Jira issue.

Write to `/tmp/atlassian_request.json`:

```json
{
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
}
```

Then run:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/comment" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 10. Assign Issue

Assign a Jira issue to a user.

Write to `/tmp/atlassian_request.json`:

```json
{
  "accountId": "5b10ac8d82e05b22cc7d4ef5"
}
```

Then run:

```bash
ISSUE_KEY="PROJ-123"

bash -c 'curl -s -X PUT "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/issue/${ISSUE_KEY}/assignee" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 11. Search Users

Find Jira users by email or name:

```bash
bash -c 'curl -s -G "https://${ATLASSIAN_DOMAIN}.atlassian.net/rest/api/3/user/search" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --data-urlencode "query=john"'
```

---

## Confluence

### 12. List Spaces

Get all Confluence spaces you have access to:

```bash
bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/spaces" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"' | jq '.results[] | {id, key, name, type}'
```

---

### 13. Get Space Details

Get details for a specific Confluence space:

```bash
SPACE_ID="12345"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/spaces/${SPACE_ID}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 14. List Pages in a Space

Get pages within a specific space:

```bash
SPACE_ID="12345"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/spaces/${SPACE_ID}/pages" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"' | jq '.results[] | {id, title, status}'
```

---

### 15. Get Page Content

Get a specific Confluence page with its body content:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}?body-format=storage" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

Body format options: `storage` (XHTML), `atlas_doc_format` (ADF), `view` (rendered HTML).

---

### 16. Create Page

Create a new Confluence page.

Write to `/tmp/atlassian_request.json`:

```json
{
  "spaceId": "12345",
  "status": "current",
  "title": "My New Page",
  "body": {
    "representation": "storage",
    "value": "<p>This is the page content in <strong>XHTML storage format</strong>.</p><h2>Section 1</h2><p>Details here.</p>"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 17. Create Child Page

Create a page as a child of an existing page.

Write to `/tmp/atlassian_request.json`:

```json
{
  "spaceId": "12345",
  "status": "current",
  "title": "Child Page Title",
  "parentId": "67890",
  "body": {
    "representation": "storage",
    "value": "<p>Content of the child page.</p>"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 18. Update Page

Update an existing Confluence page (requires current version number).

First get the current version:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"' | jq '.version.number'
```

Then write to `/tmp/atlassian_request.json` (increment the version number):

```json
{
  "id": "67890",
  "status": "current",
  "title": "Updated Page Title",
  "body": {
    "representation": "storage",
    "value": "<p>Updated content.</p>"
  },
  "version": {
    "number": 2,
    "message": "Updated via API"
  }
}
```

Then run:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X PUT "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 19. Search Confluence Content (CQL)

Search Confluence using CQL (Confluence Query Language):

```bash
bash -c 'curl -s -G "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/rest/api/search" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --data-urlencode "cql=type=page AND space=DEV AND text~\"deployment guide\"" --data-urlencode "limit=10"' | jq '.results[] | {title: .content.title, id: .content.id, space: .content._expandable.space}'
```

Common CQL examples:
- `type=page AND space=DEV` - Pages in a space
- `text~"search term"` - Full-text search
- `creator=currentUser()` - Content you created
- `lastModified >= "2024-01-01"` - Recently modified
- `label="meeting-notes"` - By label
- `ancestor=12345` - Child pages of a specific page

---

### 20. Get Page Comments

List comments on a Confluence page:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}/footer-comments" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"'
```

---

### 21. Add Comment to Page

Add a footer comment to a Confluence page.

Write to `/tmp/atlassian_request.json`:

```json
{
  "pageId": "67890",
  "body": {
    "representation": "storage",
    "value": "<p>This is a comment added via the API.</p>"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/footer-comments" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json" --header "Content-Type: application/json" -d @/tmp/atlassian_request.json'
```

---

### 22. Delete Page

Delete a Confluence page:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X DELETE "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}"'
```

Returns 204 No Content on success.

---

### 23. List Labels on a Page

Get all labels attached to a Confluence page:

```bash
PAGE_ID="67890"

bash -c 'curl -s -X GET "https://${ATLASSIAN_DOMAIN}.atlassian.net/wiki/api/v2/pages/${PAGE_ID}/labels" -u "${ATLASSIAN_EMAIL}:${ATLASSIAN_TOKEN}" --header "Accept: application/json"' | jq '.results[] | {id, name}'
```

---

## Atlassian Document Format (ADF)

Jira API v3 uses ADF for rich text fields like `description` and `comment.body`:

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
    }
  ]
}
```

## Confluence Storage Format (XHTML)

Confluence uses XHTML storage format for page bodies:

- `<p>Paragraph</p>` - Paragraphs
- `<h1>` through `<h6>` - Headings
- `<strong>Bold</strong>` - Bold text
- `<em>Italic</em>` - Italic text
- `<ul><li>Item</li></ul>` - Bullet lists
- `<ol><li>Item</li></ol>` - Numbered lists
- `<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[code here]]></ac:plain-text-body></ac:structured-macro>` - Code blocks
- `<table><tr><td>Cell</td></tr></table>` - Tables

---

## Guidelines

1. **Use JQL for Jira searches**: JQL is powerful for filtering issues by any field combination
2. **Use CQL for Confluence searches**: CQL supports full-text search, space filtering, and label-based queries
3. **Check transitions first**: Before changing Jira issue status, get available transitions for the issue
4. **Handle pagination**: Jira uses `startAt` and `maxResults`; Confluence v2 uses cursor-based pagination with `cursor` and `limit` parameters
5. **Version required for page updates**: When updating Confluence pages, always get and increment the current version number
6. **ADF for Jira rich text**: Jira API v3 requires Atlassian Document Format for description and comments
7. **XHTML for Confluence**: Confluence uses XHTML storage format for page content
8. **Use account IDs**: Jira Cloud uses account IDs (not usernames) for user references
9. **Rate limiting**: Implement exponential backoff if you receive 429 responses
10. **Confluence v2 API**: Prefer `/wiki/api/v2` endpoints for better pagination and response structure; use `/wiki/rest/api` for CQL search
