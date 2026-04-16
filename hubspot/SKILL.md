---
name: hubspot
description: HubSpot CRM API for marketing and sales. Use when user mentions "HubSpot",
  "CRM", "HubSpot contacts", or asks about marketing automation.
---

# HubSpot CRM API

Manage contacts, companies, deals, tickets, and other CRM objects, plus files, marketing emails, forms, lists, and conversations via HubSpot's REST API v3/v4.

> Official docs: https://developers.hubspot.com/docs/api/overview

---

## When to Use

Use this skill when you need to:

- Create, update, search, and delete CRM objects (contacts, companies, deals, tickets, products, line items, quotes, tasks, notes, emails, meetings, calls)
- Create associations between CRM objects
- Search and filter CRM records with complex queries
- Manage deal and ticket pipelines and stages
- Manage CRM properties (custom fields)
- Manage contact lists and memberships
- Upload and manage files
- Send marketing and transactional emails
- Manage forms and form submissions
- View conversations and threads
- Manage users and account settings

---

## Prerequisites

Connect HubSpot via the vm0 connector. The access token is provided as `$HUBSPOT_TOKEN`.

---

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name HUBSPOT_TOKEN` or `zero doctor check-connector --url https://api.hubapi.com/crm/v3/objects/contacts?limit=10 --method GET`

## CRM Objects (Unified Pattern)

All CRM objects follow the same CRUD pattern at `/crm/v3/objects/{objectType}`. The `{objectType}` can be: `contacts`, `companies`, `deals`, `tickets`, `products`, `line_items`, `quotes`, `tasks`, `notes`, `emails`, `meetings`, `calls`.

> **Important:** Always specify `properties` query param to control which fields are returned. Without it, only default properties are included.

### List Objects

```bash
curl -s "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&properties=firstname,lastname,email" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

Params: `limit` (max 100), `after` (pagination cursor from `paging.next.after`), `properties` (comma-separated), `propertiesWithHistory`, `associations`.

### Get Object by ID

```bash
curl -s "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>?properties=firstname,lastname,email,phone,company" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Object

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"firstname\": \"Jane\", \"lastname\": \"Doe\", \"email\": \"jane@example.com\", \"phone\": \"+1-555-0100\", \"company\": \"Acme Corp\"}}"
```

### Update Object

```bash
curl -s -X PATCH "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"phone\": \"+1-555-0200\", \"company\": \"New Corp\"}}"
```

### Delete Object

```bash
curl -s -X DELETE "https://api.hubapi.com/crm/v3/objects/contacts/<contact-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

Moves to recycling bin. Can be restored within 90 days.

### Search Objects

Search supports complex filter groups with AND/OR logic.

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"filterGroups\": [{\"filters\": [{\"propertyName\": \"email\", \"operator\": \"CONTAINS_TOKEN\", \"value\": \"example.com\"}]}], \"properties\": [\"firstname\", \"lastname\", \"email\"], \"limit\": 10}"
```

Search operators: `EQ`, `NEQ`, `LT`, `LTE`, `GT`, `GTE`, `CONTAINS_TOKEN`, `NOT_CONTAINS_TOKEN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY`, `BETWEEN`.

### Batch Read

Read multiple objects by ID in a single request.

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/batch/read" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"inputs\": [{\"id\": \"<id-1>\"}, {\"id\": \"<id-2>\"}], \"properties\": [\"firstname\", \"lastname\", \"email\"]}"
```

### Batch Create

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/batch/create" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"inputs\": [{\"properties\": {\"firstname\": \"Alice\", \"email\": \"alice@example.com\"}}, {\"properties\": {\"firstname\": \"Bob\", \"email\": \"bob@example.com\"}}]}"
```

### Batch Update

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/batch/update" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"inputs\": [{\"id\": \"<id-1>\", \"properties\": {\"phone\": \"+1-555-0001\"}}, {\"id\": \"<id-2>\", \"properties\": {\"phone\": \"+1-555-0002\"}}]}"
```

### Merge Objects

Merge two records of the same type. The primary record survives.

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/merge" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"primaryObjectId\": \"<primary-id>\", \"objectIdToMerge\": \"<duplicate-id>\"}"
```

---

## Common CRM Object Examples

The pattern above works for all object types. Here are property examples for the most common ones:

### Create Company

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/companies" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"name\": \"Acme Corp\", \"domain\": \"acme.com\", \"industry\": \"Technology\"}}"
```

### Create Deal

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/deals" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"dealname\": \"Enterprise License\", \"amount\": \"50000\", \"dealstage\": \"appointmentscheduled\", \"pipeline\": \"default\", \"closedate\": \"2026-06-30T00:00:00.000Z\"}}"
```

### Create Ticket

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/tickets" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"subject\": \"Login issue\", \"content\": \"User cannot log in after password reset\", \"hs_pipeline\": \"0\", \"hs_pipeline_stage\": \"1\"}}"
```

### Create Task

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/tasks" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"hs_task_subject\": \"Follow up with client\", \"hs_task_body\": \"Discuss renewal terms\", \"hs_task_status\": \"NOT_STARTED\", \"hs_task_priority\": \"HIGH\", \"hs_timestamp\": \"2026-04-15T09:00:00.000Z\"}}"
```

### Create Note

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/objects/notes" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"properties\": {\"hs_note_body\": \"Had a productive call. Client interested in annual plan.\", \"hs_timestamp\": \"2026-04-08T14:00:00.000Z\"}}"
```

---

## Associations (v4)

Associations link CRM objects together (e.g., contact → company, deal → contact).

### Create Association (Default Type)

```bash
curl -s -X PUT "https://api.hubapi.com/crm/v4/objects/contacts/<contact-id>/associations/default/companies/<company-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Association (Labeled)

```bash
curl -s -X PUT "https://api.hubapi.com/crm/v4/objects/contacts/<contact-id>/associations/companies/<company-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "[{\"associationCategory\": \"HUBSPOT_DEFINED\", \"associationTypeId\": 1}]"
```

Common association type IDs: `1` (contact→company), `3` (deal→contact), `5` (deal→company), `27` (ticket→contact), `339` (ticket→company).

### List Associations

```bash
curl -s "https://api.hubapi.com/crm/v4/objects/contacts/<contact-id>/associations/companies" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Remove Association

```bash
curl -s -X DELETE "https://api.hubapi.com/crm/v4/objects/contacts/<contact-id>/associations/companies/<company-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Batch Read Associations

```bash
curl -s -X POST "https://api.hubapi.com/crm/v4/associations/contacts/companies/batch/read" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"inputs\": [{\"id\": \"<contact-id-1>\"}, {\"id\": \"<contact-id-2>\"}]}"
```

---

## Pipelines

Pipelines define workflow stages for deals and tickets.

### List Pipelines

```bash
curl -s "https://api.hubapi.com/crm/v3/pipelines/deals" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

Replace `deals` with `tickets` or other object types that support pipelines.

### Get Pipeline Stages

```bash
curl -s "https://api.hubapi.com/crm/v3/pipelines/deals/<pipeline-id>/stages" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Pipeline

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/pipelines/deals" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"label\": \"Enterprise Sales\", \"displayOrder\": 1, \"stages\": [{\"label\": \"Qualified\", \"displayOrder\": 0, \"metadata\": {\"probability\": \"0.2\"}}, {\"label\": \"Proposal\", \"displayOrder\": 1, \"metadata\": {\"probability\": \"0.6\"}}]}"
```

### Update Pipeline

```bash
curl -s -X PATCH "https://api.hubapi.com/crm/v3/pipelines/deals/<pipeline-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"label\": \"Enterprise Sales v2\"}"
```

### Create Stage

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/pipelines/deals/<pipeline-id>/stages" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"label\": \"Negotiation\", \"displayOrder\": 2, \"metadata\": {\"probability\": \"0.8\"}}"
```

---

## Properties

Properties are the fields/columns on CRM objects. Each object type has its own set.

### List Properties

```bash
curl -s "https://api.hubapi.com/crm/v3/properties/contacts" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Property

```bash
curl -s "https://api.hubapi.com/crm/v3/properties/contacts/<property-name>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Property

```bash
curl -s -X POST "https://api.hubapi.com/crm/v3/properties/contacts" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"favorite_color\", \"label\": \"Favorite Color\", \"type\": \"string\", \"fieldType\": \"text\", \"groupName\": \"contactinformation\"}"
```

Property types: `string`, `number`, `date`, `datetime`, `enumeration`, `bool`. Field types: `text`, `textarea`, `number`, `date`, `select`, `radio`, `checkbox`, `booleancheckbox`.

### Update Property

```bash
curl -s -X PATCH "https://api.hubapi.com/crm/v3/properties/contacts/<property-name>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"label\": \"Preferred Color\"}"
```

---

## Lists

Static and dynamic contact lists.

### List All Lists

```bash
curl -s "https://api.hubapi.com/crm/lists/v3" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get List by ID

```bash
curl -s "https://api.hubapi.com/crm/lists/v3/<list-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get List Memberships

```bash
curl -s "https://api.hubapi.com/crm/lists/v3/<list-id>/memberships" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create List

```bash
curl -s -X POST "https://api.hubapi.com/crm/lists/v3" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"VIP Customers\", \"objectTypeId\": \"0-1\", \"processingType\": \"MANUAL\"}"
```

`objectTypeId`: `0-1` (contacts), `0-2` (companies). `processingType`: `MANUAL` (static) or `DYNAMIC` (filter-based).

### Add Members to List

```bash
curl -s -X PUT "https://api.hubapi.com/crm/lists/v3/<list-id>/memberships/add" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "[\"<record-id-1>\", \"<record-id-2>\"]"
```

### Remove Members from List

```bash
curl -s -X PUT "https://api.hubapi.com/crm/lists/v3/<list-id>/memberships/remove" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "[\"<record-id-1>\", \"<record-id-2>\"]"
```

### Search Lists

```bash
curl -s -X POST "https://api.hubapi.com/crm/lists/v3/search" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"query\": \"VIP\", \"count\": 10}"
```

---

## Files

### Search Files

```bash
curl -s "https://api.hubapi.com/files/v3/files/search?query=receipt" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get File by ID

```bash
curl -s "https://api.hubapi.com/files/v3/files/<file-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Signed Download URL

```bash
curl -s "https://api.hubapi.com/files/v3/files/<file-id>/signed-url" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Upload File

```bash
curl -s -X POST "https://api.hubapi.com/files/v3/files" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  -F "file=@document.pdf" \
  -F "options={\"access\": \"PRIVATE\", \"overwrite\": false};type=application/json" \
  -F "folderId=<folder-id>"
```

`access`: `PUBLIC_INDEXABLE`, `PUBLIC_NOT_INDEXABLE`, `PRIVATE`.

### Update File

```bash
curl -s -X PATCH "https://api.hubapi.com/files/v3/files/<file-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"new-name.pdf\", \"parentFolderId\": \"<folder-id>\"}"
```

### Delete File

```bash
curl -s -X DELETE "https://api.hubapi.com/files/v3/files/<file-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Folder

```bash
curl -s -X POST "https://api.hubapi.com/files/v3/folders" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Receipts\", \"parentFolderId\": \"<parent-folder-id>\"}"
```

---

## Marketing Emails

### List Emails

```bash
curl -s "https://api.hubapi.com/marketing/v3/emails" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Email by ID

```bash
curl -s "https://api.hubapi.com/marketing/v3/emails/<email-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Create Email

```bash
curl -s -X POST "https://api.hubapi.com/marketing/v3/emails" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"March Newsletter\", \"subject\": \"Our March Update\"}"
```

### Send Transactional Email

```bash
curl -s -X POST "https://api.hubapi.com/marketing/v3/transactional/single-email/send" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"emailId\": \"<template-id>\", \"message\": {\"to\": \"recipient@example.com\", \"from\": \"sender@example.com\", \"sendId\": \"unique-send-id\"}, \"contactProperties\": {\"firstname\": \"Jane\"}}"
```

---

## Forms

### List Forms

```bash
curl -s "https://api.hubapi.com/marketing/v3/forms" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Form by ID

```bash
curl -s "https://api.hubapi.com/marketing/v3/forms/<form-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

---

## Conversations

### List Threads

```bash
curl -s "https://api.hubapi.com/conversations/v3/conversations/threads" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Thread

```bash
curl -s "https://api.hubapi.com/conversations/v3/conversations/threads/<thread-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### List Messages in Thread

```bash
curl -s "https://api.hubapi.com/conversations/v3/conversations/threads/<thread-id>/messages" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Send Message to Thread

```bash
curl -s -X POST "https://api.hubapi.com/conversations/v3/conversations/threads/<thread-id>/messages" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"type\": \"MESSAGE\", \"text\": \"Thanks for reaching out! Let me look into this.\", \"senderActorId\": \"A-<user-id>\"}"
```

### List Inboxes

```bash
curl -s "https://api.hubapi.com/conversations/v3/conversations/inboxes" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

---

## Settings & Users

### Get Account Info

```bash
curl -s "https://api.hubapi.com/account-info/v3/details" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### List Users

```bash
curl -s "https://api.hubapi.com/settings/v3/users/roles" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get User by ID

```bash
curl -s "https://api.hubapi.com/settings/v3/users/<user-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### List Teams

```bash
curl -s "https://api.hubapi.com/settings/v3/users/teams" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

---

## Owners

Owners are users who can be assigned to CRM records.

### List Owners

```bash
curl -s "https://api.hubapi.com/crm/v3/owners" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

### Get Owner by ID

```bash
curl -s "https://api.hubapi.com/crm/v3/owners/<owner-id>" \
  --header "Authorization: Bearer $HUBSPOT_TOKEN"
```

---

## Guidelines

1. **Unified CRM pattern**: All CRM objects use the same endpoints at `/crm/v3/objects/{objectType}`. Learn it once, use it for contacts, companies, deals, tickets, products, line_items, quotes, tasks, notes, emails, meetings, calls.
2. **Properties are required**: Always specify `properties` query param. Without it, only a handful of default fields are returned.
3. **Search limits**: Search returns max 10,000 results. For larger datasets, use `after` pagination or narrow your filters.
4. **Search operators**: `EQ`, `NEQ`, `LT`, `LTE`, `GT`, `GTE`, `BETWEEN`, `CONTAINS_TOKEN`, `NOT_CONTAINS_TOKEN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY`.
5. **Pagination**: Use `after` cursor from response `paging.next.after`. Max `limit` is 100 per page.
6. **Rate limits**: 100 requests per 10 seconds for private apps. Batch endpoints count as one request but have their own limits (100 inputs per batch).
7. **Associations v4**: Use `/crm/v4/` for associations (not v3). Default associations use PUT with `/default/` in the path. Labeled associations use PUT with a body specifying `associationTypeId`.
8. **Pipeline stages**: Always call `GET /crm/v3/pipelines/{objectType}` first to discover valid pipeline IDs and stage IDs before creating deals or tickets.
9. **Account codes and IDs**: Pipeline IDs, stage IDs, owner IDs, and property names are all account-specific. Always discover them via API first.
10. **Deleting**: DELETE moves objects to recycling bin (90-day retention). No permanent delete via API.
11. **Date format**: Use ISO-8601 with timezone: `2026-03-05T09:00:00.000Z`. Date properties use midnight UTC.

---

## How to Look Up More API Details

HubSpot docs are well-structured. Key pages:

- **CRM Objects**: `https://developers.hubspot.com/docs/api/crm/contacts` (replace `contacts` with any object type)
- **Search**: `https://developers.hubspot.com/docs/api/crm/search`
- **Associations v4**: `https://developers.hubspot.com/docs/api/crm/associations`
- **Pipelines**: `https://developers.hubspot.com/docs/api/crm/pipelines`
- **Properties**: `https://developers.hubspot.com/docs/api/crm/properties`
- **Lists**: `https://developers.hubspot.com/docs/api/crm/lists`
- **Files**: `https://developers.hubspot.com/docs/api/files/files`
- **Marketing Emails**: `https://developers.hubspot.com/docs/api/marketing/marketing-email`
- **Transactional Email**: `https://developers.hubspot.com/docs/api/marketing-api/transactional-emails`
- **Forms**: `https://developers.hubspot.com/docs/api/marketing/forms`
- **Conversations**: `https://developers.hubspot.com/docs/api/conversations/conversations`
- **Owners**: `https://developers.hubspot.com/docs/api/crm/owners`
