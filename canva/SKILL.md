---
name: canva
description: Canva API for design creation. Use when user mentions "Canva", "create
  design", "Canva template", or asks about design graphics.
vm0_secrets:
  - CANVA_TOKEN
---

# Canva API

Use the Canva Connect API via direct `curl` calls to manage **designs, folders, assets, and comments**.

> Official docs: `https://www.canva.dev/docs/connect/`

---

## When to Use

Use this skill when you need to:

- **List and search designs** in a Canva account
- **Create new designs** (documents, presentations, whiteboards, or custom sizes)
- **Export designs** as PDF, PNG, JPG, or other formats
- **Upload assets** (images, videos) to Canva
- **Manage folders** and organize designs
- **Add comments** to designs for collaboration
- **Get user profile** information

---

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings → Connectors** and connect **Canva**. vm0 will automatically inject the required `CANVA_TOKEN` environment variable.

### Rate Limits

Canva API has per-user rate limits that vary by endpoint. Most read endpoints allow 100 requests/user, write endpoints allow 20-30 requests/user.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" --header "Authorization: Bearer $API_KEY"' | jq '.'
> ```

## How to Use

All examples below assume you have `CANVA_TOKEN` set.

Base URL: `https://api.canva.com/rest/v1`

---

### 1. Get Current User Profile

Get your user profile information:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/users/me/profile" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.profile'
```

---

### 2. List Designs

List designs in your account:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/designs?limit=20" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.items[] | {id, title, created_at, updated_at}'
```

To search designs by query:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/designs?query=marketing&limit=10" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.items[] | {id, title}'
```

Save a design ID from the results for use in subsequent commands.

---

### 3. Get Design Details

Get metadata for a specific design. Replace `<design-id>` with an actual design ID:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/designs/<design-id>" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.design | {id, title, owner, urls, created_at, updated_at, page_count}'
```

---

### 4. Create a New Design

Create a new document:

Write to `/tmp/canva_request.json`:

```json
{
  "design_type": {
    "type": "preset",
    "name": "doc"
  },
  "title": "My New Document"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/designs" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.design | {id, title, urls}'
```

**Preset names:** `doc`, `presentation`, `whiteboard`

To create a design with custom dimensions (in pixels, 40-8000):

Write to `/tmp/canva_request.json`:

```json
{
  "design_type": {
    "type": "custom",
    "width": 1080,
    "height": 1080
  },
  "title": "Instagram Post"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/designs" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.design | {id, title, urls}'
```

---

### 5. Export Design as PDF

Export a design as PDF. Replace `<design-id>` with an actual design ID:

Write to `/tmp/canva_request.json`:

```json
{
  "design_id": "<design-id>",
  "format": {
    "type": "pdf",
    "size": "a4"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/exports" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '{id: .job.id, status: .job.status}'
```

Then poll for completion. Replace `<export-id>` with the job ID from above:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/exports/<export-id>" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '{status: .job.status, urls: .job.urls}'
```

When status is `success`, download URLs are valid for 24 hours.

---

### 6. Export Design as PNG

Export a design as PNG. Replace `<design-id>` with an actual design ID:

Write to `/tmp/canva_request.json`:

```json
{
  "design_id": "<design-id>",
  "format": {
    "type": "png",
    "width": 1024,
    "transparent_background": true
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/exports" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '{id: .job.id, status: .job.status}'
```

Poll with the same export status endpoint as above.

---

### 7. List Design Pages

Get all pages of a design. Replace `<design-id>` with an actual design ID:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/designs/<design-id>/pages" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.items[] | {index: .index, title: .title, width: .width, height: .height}'
```

---

### 8. Create a Folder

Create a new folder to organize designs:

Write to `/tmp/canva_request.json`:

```json
{
  "name": "Marketing Assets",
  "parent_folder_id": "root"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/folders" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.folder | {id, name}'
```

---

### 9. List Folder Items

List items in a folder. Replace `<folder-id>` with an actual folder ID:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/folders/<folder-id>/items?limit=20" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.items[] | {type, id: .design.id // .folder.id, name: .design.title // .folder.name}'
```

---

### 10. Move Item to Folder

Move a design or folder to another folder. Replace `<item-id>` and `<target-folder-id>`:

Write to `/tmp/canva_request.json`:

```json
{
  "item_id": "<item-id>",
  "to": {
    "folder_id": "<target-folder-id>"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/folders/move" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json'
```

---

### 11. Get Asset Details

Get metadata for an uploaded asset. Replace `<asset-id>` with an actual asset ID:

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/assets/<asset-id>" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.asset | {id, name, tags, created_at, updated_at, thumbnail}'
```

---

### 12. Update Asset

Update an asset's name and tags. Replace `<asset-id>` with an actual asset ID:

Write to `/tmp/canva_request.json`:

```json
{
  "name": "Updated Logo",
  "tags": ["logo", "brand", "2025"]
}
```

Then run:

```bash
bash -c 'curl -s -X PATCH "https://api.canva.com/rest/v1/assets/<asset-id>" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.asset | {id, name, tags}'
```

---

### 13. Delete Asset

Delete an asset (moves to trash). Replace `<asset-id>` with an actual asset ID:

```bash
bash -c 'curl -s -X DELETE "https://api.canva.com/rest/v1/assets/<asset-id>" --header "Authorization: Bearer $CANVA_TOKEN"'
```

---

### 14. Create Comment Thread

Add a comment to a design. Replace `<design-id>`:

Write to `/tmp/canva_request.json`:

```json
{
  "message": "Can we adjust the colors here to match the brand guidelines?",
  "attached_to": {
    "type": "design"
  }
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/designs/<design-id>/comments" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.thread | {id, message}'
```

---

### 15. Reply to Comment Thread

Reply to an existing comment thread. Replace `<design-id>` and `<thread-id>`:

Write to `/tmp/canva_request.json`:

```json
{
  "message": "Updated the colors. Please review."
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.canva.com/rest/v1/designs/<design-id>/comments/<thread-id>/replies" --header "Authorization: Bearer $CANVA_TOKEN" --header "Content-Type: application/json" -d @/tmp/canva_request.json' | jq '.reply | {id, message}'
```

---

### 16. List Brand Templates

List available brand templates (requires Canva Enterprise):

```bash
bash -c 'curl -s "https://api.canva.com/rest/v1/brand-templates?limit=20" --header "Authorization: Bearer $CANVA_TOKEN"' | jq '.items[] | {id, title, created_at}'
```

---

## Guidelines

- **Async jobs**: Export, import, upload, autofill, and resize operations are asynchronous. Start the job with POST, then poll the status with GET using the returned job ID until `status` is `success` or `failed`.
- **Pagination**: List endpoints return a `continuation` token. Pass it as a query parameter to get the next page of results.
- **Design URLs**: The `urls.edit_url` and `urls.view_url` fields in design responses are valid for 30 days.
- **Export URLs**: Download URLs from export jobs are valid for 24 hours.
- **Custom dimensions**: Width and height must be between 40 and 8000 pixels.
- **Asset uploads**: For binary file uploads, use `Content-Type: application/octet-stream` with an `Asset-Upload-Metadata` header containing base64-encoded name.
- **Rate limits**: Read endpoints: ~100 req/user. Write endpoints: ~20-30 req/user. Export polling: ~120 req/user.
