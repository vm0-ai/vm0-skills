---
name: atlassian
description: Atlassian API for Confluence and Jira. Use when user mentions "Confluence
  page", "Atlassian", or asks about wiki/documentation management.
---

# Atlassian API

Use the Atlassian Cloud REST APIs to manage Jira issues and Confluence pages.

> Official docs:
> - Jira: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
> - Confluence v2: https://developer.atlassian.com/cloud/confluence/rest/v2/

---

## When to Use

Use this skill when you need to:

- Create, update, and search Jira issues using JQL
- Transition Jira issues through workflow states
- Manage Jira comments, labels, worklogs, and attachments
- Create and update Confluence pages and blog posts
- Search Confluence content using CQL
- Manage Confluence spaces, labels, and comments

---

## Prerequisites

Connect the **Atlassian** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name ATLASSIAN_TOKEN` or `zero doctor check-connector --url https://your-domain.atlassian.net/rest/api/3/myself --method GET`

## Jira — User

### Get Current User

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/myself" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Search Users

```bash
curl -s -G "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/user/search" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "query=john"
```

---

## Jira — Projects

### List Projects

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/project" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Project

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/project/<project-key>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

---

## Jira — Issues

### Search Issues (JQL)

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/search/jql" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d "{\"jql\": \"project = PROJ AND status != Done ORDER BY created DESC\", \"maxResults\": 10, \"fields\": [\"key\", \"summary\", \"status\", \"assignee\", \"priority\"]}"
```

Common JQL: `project = PROJ`, `assignee = currentUser()`, `status = 'In Progress'`, `created >= -7d`, `labels = bug`, `priority = High`.

### Get Issue

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Create Issue

Jira v3 uses Atlassian Document Format (ADF) for rich text fields.

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d "{\"fields\": {\"project\": {\"key\": \"PROJ\"}, \"summary\": \"Bug: Login button not responding\", \"description\": {\"type\": \"doc\", \"version\": 1, \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"The login button is not responding.\"}]}]}, \"issuetype\": {\"name\": \"Bug\"}, \"priority\": {\"name\": \"High\"}, \"labels\": [\"mobile\"]}}"
```

### Update Issue

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  -d "{\"fields\": {\"summary\": \"Updated summary\", \"priority\": {\"name\": \"Highest\"}}}"
```

### Delete Issue

```bash
curl -s -X DELETE "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN"
```

### Assign Issue

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/assignee" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"accountId\": \"<account-id>\"}"
```

### Get Transitions

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/transitions" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Transition Issue (Change Status)

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/transitions" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"transition\": {\"id\": \"31\"}}"
```

### Add Comment

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/comment" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"body\": {\"type\": \"doc\", \"version\": 1, \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"Found the root cause. Working on a fix.\"}]}]}}"
```

### Get Comments

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/comment" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Add Labels

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"update\": {\"labels\": [{\"add\": \"urgent\"}, {\"add\": \"backend\"}]}}"
```

### Add Attachment

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/attachments" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "X-Atlassian-Token: no-check" \
  -F "file=@screenshot.png"
```

### Get Worklogs

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/worklog" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Add Worklog

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/rest/api/3/issue/<issue-key>/worklog" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"timeSpentSeconds\": 3600, \"comment\": {\"type\": \"doc\", \"version\": 1, \"content\": [{\"type\": \"paragraph\", \"content\": [{\"type\": \"text\", \"text\": \"Investigated and fixed the issue.\"}]}]}}"
```

---

## Confluence — Spaces (v2)

### List Spaces

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/spaces?limit=25" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Space

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/spaces/<space-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### List Pages in Space

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/spaces/<space-id>/pages?limit=25" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Space Labels

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/spaces/<space-id>/labels" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Space Permissions

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/spaces/<space-id>/permissions" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

---

## Confluence — Pages (v2)

### List Pages

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages?limit=25" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

Params: `space-id`, `title`, `status` (current/draft/archived), `body-format` (storage/atlas_doc_format/view), `limit`, `cursor`.

### Get Page

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>?body-format=storage" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

Body format: `storage` (XHTML), `atlas_doc_format` (ADF), `view` (rendered HTML).

### Create Page

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"spaceId\": \"<space-id>\", \"status\": \"current\", \"title\": \"My New Page\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>Page content in <strong>XHTML</strong> format.</p>\"}}"
```

### Create Child Page

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"spaceId\": \"<space-id>\", \"status\": \"current\", \"title\": \"Child Page\", \"parentId\": \"<parent-page-id>\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>Child page content.</p>\"}}"
```

### Update Page

Requires current version number (increment by 1).

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"id\": \"<page-id>\", \"status\": \"current\", \"title\": \"Updated Title\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>Updated content.</p>\"}, \"version\": {\"number\": 2, \"message\": \"Updated via API\"}}"
```

### Delete Page

```bash
curl -s -X DELETE "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN"
```

### Get Page Children

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/children" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Page Labels

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/labels" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Page Versions

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/versions" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Page Attachments

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/attachments" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Page Ancestors

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/ancestors" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

---

## Confluence — Comments (v2)

### List Footer Comments

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/pages/<page-id>/footer-comments" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Create Footer Comment

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/footer-comments" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"pageId\": \"<page-id>\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>This is a comment.</p>\"}}"
```

### Update Comment

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/footer-comments/<comment-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"version\": {\"number\": 2}, \"body\": {\"representation\": \"storage\", \"value\": \"<p>Updated comment.</p>\"}}"
```

### Delete Comment

```bash
curl -s -X DELETE "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/footer-comments/<comment-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN"
```

---

## Confluence — Blog Posts (v2)

### List Blog Posts

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/blogposts?limit=25" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Blog Post

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/blogposts/<blogpost-id>?body-format=storage" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Create Blog Post

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/blogposts" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"spaceId\": \"<space-id>\", \"status\": \"current\", \"title\": \"Release Notes v2.0\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>What's new in v2.0.</p>\"}}"
```

### Update Blog Post

```bash
curl -s -X PUT "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/blogposts/<blogpost-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"id\": \"<blogpost-id>\", \"status\": \"current\", \"title\": \"Release Notes v2.0 (Updated)\", \"body\": {\"representation\": \"storage\", \"value\": \"<p>Updated content.</p>\"}, \"version\": {\"number\": 2}}"
```

### Delete Blog Post

```bash
curl -s -X DELETE "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/blogposts/<blogpost-id>" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN"
```

---

## Confluence — Labels (v2)

### List Labels

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/labels" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

### Get Pages by Label

```bash
curl -s "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/api/v2/labels/<label-id>/pages" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json"
```

---

## Confluence — Search (v1)

> **Note:** CQL search is only available via the v1 API. There is no v2 equivalent.

### Search Content (CQL)

```bash
curl -s -G "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/rest/api/search" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "Accept: application/json" \
  --data-urlencode "cql=type=page AND space=DEV AND text~\"deployment guide\"" \
  --data-urlencode "limit=10"
```

Common CQL: `type=page AND space=DEV`, `text~"search term"`, `creator=currentUser()`, `lastModified >= "2026-01-01"`, `label="meeting-notes"`, `ancestor=12345`.

---

## Confluence — Attachments (v1)

### Upload Attachment

```bash
curl -s -X POST "https://$ATLASSIAN_DOMAIN.atlassian.net/wiki/rest/api/content/<page-id>/child/attachment" \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  --header "X-Atlassian-Token: nocheck" \
  -F "file=@document.pdf"
```

---

## Atlassian Document Format (ADF)

Jira API v3 uses ADF for rich text fields (`description`, `comment.body`):

```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "Plain text"},
        {"type": "text", "text": "Bold", "marks": [{"type": "strong"}]},
        {"type": "text", "text": "Code", "marks": [{"type": "code"}]}
      ]
    }
  ]
}
```

## Confluence Storage Format (XHTML)

Confluence uses XHTML for page bodies: `<p>`, `<h1>`-`<h6>`, `<strong>`, `<em>`, `<ul>/<ol>`, `<table>`, `<ac:structured-macro>`.

---

## Guidelines

1. **JQL for Jira searches**: Powerful filtering by any field combination.
2. **CQL for Confluence searches**: Full-text search, space filtering, label queries. Uses v1 endpoint.
3. **Check transitions first**: Before changing issue status, get available transitions.
4. **Version required for page updates**: Always get and increment the current version number.
5. **ADF for Jira rich text**: v3 API requires Atlassian Document Format for description and comments.
6. **XHTML for Confluence**: Use XHTML storage format for page content (representation: "storage").
7. **Account IDs**: Jira Cloud uses account IDs (not usernames) for user references.
8. **Pagination**: Jira uses `startAt` + `maxResults`. Confluence v2 uses cursor-based pagination with `cursor` and `limit`.
9. **Rate limits**: Back off on 429 responses.
10. **Confluence v2 API**: This skill uses `/wiki/api/v2` for pages, spaces, comments, blog posts. CQL search and attachments still use v1 (`/wiki/rest/api`).

---

## How to Look Up More API Details

- **Jira REST API v3**: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- **Confluence REST API v2**: https://developer.atlassian.com/cloud/confluence/rest/v2/
- **JQL Reference**: https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/
- **CQL Reference**: https://developer.atlassian.com/cloud/confluence/advanced-searching-using-cql/
- **ADF Reference**: https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
