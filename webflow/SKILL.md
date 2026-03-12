---
name: webflow
description: Webflow API for CMS and sites. Use when user mentions "Webflow", "webflow.com",
  "webflow.io", shares a Webflow link, "update Webflow", or asks about Webflow site.
vm0_secrets:
  - WEBFLOW_TOKEN
---

# Webflow API

Manage Webflow sites, pages, CMS collections, items, assets, and forms via the REST API v2.

> Official docs: `https://developers.webflow.com/data/reference/rest-introduction`

---

## When to Use

Use this skill when you need to:

- **List and inspect sites** in a Webflow workspace
- **Read page metadata** and site structure
- **Manage CMS collections** — list, create, delete collections and fields
- **CRUD CMS items** — create, read, update, delete, and publish collection items
- **List and manage assets** (images, files) on a site
- **Retrieve form submissions** from Webflow forms

---

## Prerequisites

Connect your Webflow account via the vm0 platform (OAuth connector). The `WEBFLOW_TOKEN` environment variable is automatically configured.

Verify authentication:

```bash
bash -c 'curl -s "https://api.webflow.com/v2/token/authorized_by" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, email, firstName, lastName}'
```

Expected response: Your user information (id, email, name).

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY"' | jq '.[0]'
> ```

## How to Use

All examples assume `WEBFLOW_TOKEN` is set.

Base URL: `https://api.webflow.com/v2`

---

### 1. Get Authorized User

Get information about the authenticated user:

```bash
bash -c 'curl -s "https://api.webflow.com/v2/token/authorized_by" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, email, firstName, lastName}'
```

---

### 2. List Sites

List all sites accessible to the authenticated user:

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.sites[] | {id, displayName, shortName, lastPublished}'
```

---

### 3. Get Site Details

Retrieve details for a specific site. Replace `<site-id>` with an actual site ID from the list sites response.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites/<site-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, displayName, shortName, lastPublished, previewUrl}'
```

---

### 4. List Pages

List all pages for a site. Replace `<site-id>` with your site ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites/<site-id>/pages" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.pages[] | {id, title, slug, createdOn, lastUpdated}'
```

---

### 5. Get Page Metadata

Retrieve metadata for a specific page. Replace `<page-id>` with an actual page ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/pages/<page-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, title, slug, seo: {title: .seo.title, description: .seo.description}}'
```

---

### 6. Update Page Settings

Update SEO settings or other metadata for a page. Replace `<page-id>` with your page ID.

Write to `/tmp/webflow_page_update.json`:

```json
{
  "body": {
    "seo": {
      "title": "Updated Page Title",
      "description": "Updated meta description for this page"
    }
  }
}
```

```bash
bash -c 'curl -s -X PATCH "https://api.webflow.com/v2/pages/<page-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN" --header "Content-Type: application/json" -d @/tmp/webflow_page_update.json' | jq '{id, title, slug}'
```

---

### 7. List Collections

List all CMS collections for a site. Replace `<site-id>` with your site ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites/<site-id>/collections" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.collections[] | {id, displayName, singularName, slug}'
```

---

### 8. Get Collection Details

Retrieve schema and details for a specific collection, including field definitions. Replace `<collection-id>` with your collection ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/collections/<collection-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, displayName, singularName, slug, fields: [.fields[] | {id, displayName, slug, type, isRequired}]}'
```

---

### 9. List Collection Items

List all items in a CMS collection. Replace `<collection-id>` with your collection ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/collections/<collection-id>/items" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.items[] | {id, fieldData: .fieldData}'
```

Supports pagination with `offset` and `limit` query parameters:

```bash
bash -c 'curl -s "https://api.webflow.com/v2/collections/<collection-id>/items?offset=0&limit=10" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{pagination, items: [.items[] | {id, fieldData: .fieldData}]}'
```

---

### 10. Get Collection Item

Get a single item by ID. Replace `<collection-id>` and `<item-id>`.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/collections/<collection-id>/items/<item-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, fieldData}'
```

---

### 11. Create Collection Item

Create a new item in a CMS collection. Replace `<collection-id>` with your collection ID.

Write to `/tmp/webflow_item.json`:

```json
{
  "fieldData": {
    "name": "New Blog Post",
    "slug": "new-blog-post"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.webflow.com/v2/collections/<collection-id>/items" --header "Authorization: Bearer $WEBFLOW_TOKEN" --header "Content-Type: application/json" -d @/tmp/webflow_item.json' | jq '{id, fieldData}'
```

---

### 12. Update Collection Item

Update an existing item. Replace `<collection-id>` and `<item-id>`.

Write to `/tmp/webflow_item_update.json`:

```json
{
  "fieldData": {
    "name": "Updated Blog Post Title"
  }
}
```

```bash
bash -c 'curl -s -X PATCH "https://api.webflow.com/v2/collections/<collection-id>/items/<item-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN" --header "Content-Type: application/json" -d @/tmp/webflow_item_update.json' | jq '{id, fieldData}'
```

---

### 13. Delete Collection Item

Delete an item from a collection. Replace `<collection-id>` and `<item-id>`.

```bash
bash -c 'curl -s -X DELETE "https://api.webflow.com/v2/collections/<collection-id>/items/<item-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"'
```

---

### 14. Publish Collection Items

Publish one or more staged items. Replace `<collection-id>` with your collection ID.

Write to `/tmp/webflow_publish.json`:

```json
{
  "itemIds": ["<item-id-1>", "<item-id-2>"]
}
```

```bash
bash -c 'curl -s -X POST "https://api.webflow.com/v2/collections/<collection-id>/items/publish" --header "Authorization: Bearer $WEBFLOW_TOKEN" --header "Content-Type: application/json" -d @/tmp/webflow_publish.json' | jq '{publishedItemIds}'
```

---

### 15. List Assets

List all assets (images, files) for a site. Replace `<site-id>` with your site ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites/<site-id>/assets" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.assets[] | {id, displayName, url, fileSize, contentType}'
```

---

### 16. Get Asset Details

Get details for a specific asset. Replace `<asset-id>` with your asset ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/assets/<asset-id>" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '{id, displayName, url, fileSize, contentType, createdOn}'
```

---

### 17. List Form Submissions

List submissions for a specific form. Replace `<form-id>` with your form ID.

```bash
bash -c 'curl -s "https://api.webflow.com/v2/forms/<form-id>/submissions" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.formSubmissions[] | {id, submittedAt, formData}'
```

To find form IDs, list all forms for a site first:

```bash
bash -c 'curl -s "https://api.webflow.com/v2/sites/<site-id>/forms" --header "Authorization: Bearer $WEBFLOW_TOKEN"' | jq '.forms[] | {id, displayName, siteId}'
```

---

### 18. Publish Site

Trigger a site publish. Replace `<site-id>` with your site ID.

Write to `/tmp/webflow_publish_site.json`:

```json
{
  "publishToWebflowSubdomain": true
}
```

```bash
bash -c 'curl -s -X POST "https://api.webflow.com/v2/sites/<site-id>/publish" --header "Authorization: Bearer $WEBFLOW_TOKEN" --header "Content-Type: application/json" -d @/tmp/webflow_publish_site.json'
```

---

## Guidelines

1. **Start with `/v2/token/authorized_by`**: Always verify auth first before calling other endpoints
2. **Get site ID first**: Most operations require a site ID — call List Sites first
3. **CMS workflow**: List collections -> get collection schema -> CRUD items -> publish items
4. **Staged vs Live items**: By default, item endpoints work with staged (draft) items. Use `/items/live` path for published items
5. **Pagination**: List endpoints support `offset` and `limit` query parameters (default limit is 100)
6. **Rate limits**: 60 requests per minute; back off on 429 responses
7. **Field data**: When creating/updating items, field values go inside the `fieldData` object, keyed by field slug
