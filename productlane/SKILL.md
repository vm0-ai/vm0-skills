---
name: productlane
description: Productlane API for feedback management. Use when user mentions "Productlane",
  "feedback", "feature request", or product insights.
vm0_secrets:
  - PRODUCTLANE_TOKEN
---

# Productlane API

Manage your public roadmap, helpdesk, feedback threads, companies, contacts, changelogs, and documentation via Productlane's REST API.

> Official docs: `https://productlane.mintlify.dev/docs/api-reference`

---

## When to Use

Use this skill when you need to:

- **Manage feedback threads** — create, list, update, and send messages
- **Manage companies and contacts** — create, update, delete, and query customer data
- **Publish changelogs** — create and update changelog entries with markdown content
- **View roadmap** — list projects and issues from the public portal
- **Manage documentation** — create and organize help articles
- **Manage users** — invite members and update roles

---

## Prerequisites

1. Log in to [Productlane](https://productlane.com/) and go to Settings
2. Navigate to **Integrations** > **API**
3. Create or copy your API key

Set environment variable:

```bash
export PRODUCTLANE_TOKEN="your-api-key"
```

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY"'
> ```

---

## Workspaces

### Get Workspace

Retrieve workspace information. Replace `<workspace-id>` with the actual workspace ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/workspaces/<workspace-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

---

## Companies

### List Companies

```bash
bash -c 'curl -s "https://productlane.com/api/v1/companies?take=20" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### List Companies with Filters

Filter by name or domain:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/companies?name=Acme&take=10" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Company by ID

Replace `<company-id>` with the actual company ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/companies/<company-id>?groupUpvotes=true" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Company

Write to `/tmp/productlane_request.json`:

```json
{
  "name": "Acme Corp",
  "domains": ["acme.com"],
  "size": 50,
  "revenue": 1000000
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/companies" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update Company

Write to `/tmp/productlane_request.json`:

```json
{
  "name": "Acme Corporation",
  "size": 100
}
```

Then run. Replace `<company-id>` with the actual company ID:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/companies/<company-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Delete Company

Replace `<company-id>` with the actual company ID:

```bash
bash -c 'curl -s -X DELETE "https://productlane.com/api/v1/companies/<company-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Linear Customer Options

Get available Linear customer statuses and tiers. Requires Linear integration with `customer:read` or `customer:write` scope:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/companies/linear-options" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

---

## Contacts

### List Contacts

```bash
bash -c 'curl -s "https://productlane.com/api/v1/contacts?take=20" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Contact by ID or Email

Replace `<contact-id-or-email>` with the actual contact ID or email address:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/contacts/<contact-id-or-email>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Contact

Link to a company using `companyId` (recommended), `companyName`, or `companyExternalId` — these are mutually exclusive.

Write to `/tmp/productlane_request.json`:

```json
{
  "email": "jane@acme.com",
  "name": "Jane Doe",
  "companyId": "<company-id>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/contacts" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update Contact

Write to `/tmp/productlane_request.json`:

```json
{
  "name": "Jane Smith"
}
```

Then run. Replace `<contact-id>` with the actual contact ID:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/contacts/<contact-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Delete Contact

Replace `<contact-id>` with the actual contact ID:

```bash
bash -c 'curl -s -X DELETE "https://productlane.com/api/v1/contacts/<contact-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

---

## Threads (Feedback)

### List Threads

```bash
bash -c 'curl -s "https://productlane.com/api/v1/threads?take=20" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### List Threads with Filters

Filter by state (`NEW`, `PROCESSED`), issue, or project:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/threads?state=NEW&take=50" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Thread by ID

Replace `<thread-id>` with the actual thread ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/threads/<thread-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Thread

Required fields: `title`, `text`, `contactEmail`, `painLevel`.

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "Feature request: Dark mode",
  "text": "<p>It would be great to have a dark mode option for the dashboard.</p>",
  "contactEmail": "jane@acme.com",
  "actorName": "Jane Doe",
  "painLevel": "MEDIUM"
}
```

**Pain level values:** `UNKNOWN`, `LOW`, `MEDIUM`, `HIGH`

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/threads" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update Thread

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "Feature request: Dark mode (updated)"
}
```

Then run. Replace `<thread-id>` with the actual thread ID:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/threads/<thread-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Send Message to Thread

Send an email or Slack message to a thread. Replace `<thread-id>` with the actual thread ID:

Write to `/tmp/productlane_request.json`:

```json
{
  "text": "Thank you for your feedback! We are working on this feature."
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/threads/<thread-id>/messages" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

---

## Changelogs

### List Changelogs

Replace `<workspace-id>` with the actual workspace ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/changelogs/<workspace-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Changelog

Replace `<workspace-id>` and `<changelog-id>` with the actual IDs:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/changelogs/<workspace-id>/<changelog-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Changelog

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "March 2026 Update",
  "content": "## New Features\n\n- Dark mode support\n- Improved search\n- New API endpoints"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/changelogs" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update Changelog

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "March 2026 Update (Revised)",
  "content": "## New Features\n\n- Dark mode support\n- Improved search\n- New API endpoints\n- Bug fixes"
}
```

Then run. Replace `<changelog-id>` with the actual changelog ID:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/changelogs/<changelog-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Delete Changelog

Replace `<changelog-id>` with the actual changelog ID:

```bash
bash -c 'curl -s -X DELETE "https://productlane.com/api/v1/changelogs/<changelog-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

---

## Portal / Roadmap

### List Projects

Replace `<workspace-id>` with the actual workspace ID. The workspace must have its portal published:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/projects/<workspace-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Project

Replace `<workspace-id>` and `<project-id>` with the actual IDs:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/projects/<workspace-id>/<project-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### List Issues

Replace `<workspace-id>` with the actual workspace ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/issues/<workspace-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Issue

Replace `<workspace-id>` and `<issue-id>` with the actual IDs:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/issues/<workspace-id>/<issue-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Upvote a Project or Issue

Write to `/tmp/productlane_request.json`:

```json
{
  "projectId": "<project-id>",
  "email": "jane@acme.com"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/portal/upvotes" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Get Upvotes

```bash
bash -c 'curl -s "https://productlane.com/api/v1/portal/upvotes?projectId=<project-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Delete Upvote

Replace `<upvote-id>` with the actual upvote ID:

```bash
bash -c 'curl -s -X DELETE "https://productlane.com/api/v1/portal/upvotes/<upvote-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

---

## Documentation

### List Articles

Replace `<workspace-id>` with the actual workspace ID:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/docs/articles/<workspace-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Get Article

Replace `<workspace-id>` and `<article-id>` with the actual IDs:

```bash
bash -c 'curl -s "https://productlane.com/api/v1/docs/articles/<workspace-id>/<article-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Article

Requires `groupId`. Create a doc group first if needed.

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "Getting Started",
  "content": "## Welcome\n\nThis guide will help you get started with our product.",
  "groupId": "<group-id>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/docs/articles" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update Article

Write to `/tmp/productlane_request.json`:

```json
{
  "title": "Getting Started (Updated)",
  "content": "## Welcome\n\nThis updated guide will help you get started."
}
```

Then run. Replace `<article-id>` with the actual article ID:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/docs/articles/<article-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Delete Article

Replace `<article-id>` with the actual article ID:

```bash
bash -c 'curl -s -X DELETE "https://productlane.com/api/v1/docs/articles/<article-id>" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Create Doc Group

Write to `/tmp/productlane_request.json`:

```json
{
  "name": "User Guides"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/docs/groups" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Move Articles to Group

Write to `/tmp/productlane_request.json`:

```json
{
  "articleIds": ["<article-id-1>", "<article-id-2>"],
  "groupId": "<group-id>"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/docs/groups/move-articles" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

---

## Users

### List Members

```bash
bash -c 'curl -s "https://productlane.com/api/v1/users" --header "Authorization: Bearer $PRODUCTLANE_TOKEN"'
```

### Invite User

Write to `/tmp/productlane_request.json`:

```json
{
  "email": "newuser@acme.com"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://productlane.com/api/v1/users/invite" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

### Update User Role

Only admins can change roles. Valid roles: `ADMIN`, `USER`, `VIEWER`.

Write to `/tmp/productlane_request.json`:

```json
{
  "userId": "<user-id>",
  "role": "USER"
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://productlane.com/api/v1/users/role" --header "Authorization: Bearer $PRODUCTLANE_TOKEN" --header "Content-Type: application/json" -d @/tmp/productlane_request.json'
```

---

## Guidelines

1. **Base URL**: All endpoints use `https://productlane.com/api/v1/`
2. **Pagination**: Use `skip` and `take` query parameters for paginated endpoints (default `take` is 10)
3. **Markdown support**: Changelog and documentation article `content` fields support markdown format
4. **HTML support**: Thread `text` field supports HTML content
5. **Thread fields**: Use `contactEmail` (not `email`) and uppercase `painLevel` values (`UNKNOWN`, `LOW`, `MEDIUM`, `HIGH`)
6. **Doc articles**: `groupId` is required when creating articles — create a doc group first
7. **Company linking**: When creating contacts, use exactly one of `companyId` (recommended), `companyName`, or `companyExternalId`
8. **Public endpoints**: Workspace, portal issues/projects, and published changelogs/articles can be accessed without authentication
9. **Security**: Never expose API keys in logs or client-side code

---

## API Reference

- Documentation: https://productlane.mintlify.dev/docs/api-reference
- Dashboard: https://productlane.com
- API settings: https://productlane.com/settings/integrations/api
