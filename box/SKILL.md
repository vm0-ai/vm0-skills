---
name: box
description: Box API for file storage, folders, uploads, collaboration, and search.
  Use when user mentions "Box", "box.com", "Box folder", "upload to Box", or
  asks about Box files.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name BOX_TOKEN` or `zero doctor check-connector --url https://api.box.com/2.0/users/me --method GET`

## How to Use

Base URL: `https://api.box.com/2.0`

All calls use `Authorization: Bearer $BOX_TOKEN`. The token is an OAuth access token refreshed automatically by vm0.

## User

### Get Current User

```bash
curl -s "https://api.box.com/2.0/users/me" \
  --header "Authorization: Bearer $BOX_TOKEN" | jq '{id, name, login, type}'
```

## Folders

### Get Root Folder Items

Use folder ID `0` for the root folder.

```bash
curl -s "https://api.box.com/2.0/folders/0/items?limit=100" \
  --header "Authorization: Bearer $BOX_TOKEN" | jq '.entries[] | {id, type, name, size, modified_at}'
```

### Get Folder

```bash
curl -s "https://api.box.com/2.0/folders/<folder-id>" \
  --header "Authorization: Bearer $BOX_TOKEN" | jq '{id, name, item_collection, path_collection}'
```

### Create Folder

Write to `/tmp/box_folder.json`:

```json
{
  "name": "Project Files",
  "parent": {
    "id": "0"
  }
}
```

```bash
curl -s -X POST "https://api.box.com/2.0/folders" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/box_folder.json | jq '{id, name, parent}'
```

### Update Folder Name

```bash
curl -s -X PUT "https://api.box.com/2.0/folders/<folder-id>" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{"name":"Updated folder name"}' | jq '{id, name}'
```

### Delete Folder

```bash
curl -s -X DELETE "https://api.box.com/2.0/folders/<folder-id>?recursive=true" \
  --header "Authorization: Bearer $BOX_TOKEN"
```

## Files

### Get File Metadata

```bash
curl -s "https://api.box.com/2.0/files/<file-id>" \
  --header "Authorization: Bearer $BOX_TOKEN" | jq '{id, name, size, extension, modified_at, shared_link}'
```

### Download File

```bash
curl -L "https://api.box.com/2.0/files/<file-id>/content" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  -o /tmp/box-download.bin
```

### Upload File

Box uploads use `https://upload.box.com/api/2.0/files/content`.

```bash
curl -s -X POST "https://upload.box.com/api/2.0/files/content" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  -F 'attributes={"name":"report.txt","parent":{"id":"0"}}' \
  -F file=@/tmp/report.txt | jq '.entries[0] | {id, name, size}'
```

### Upload New Version

```bash
curl -s -X POST "https://upload.box.com/api/2.0/files/<file-id>/content" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  -F file=@/tmp/report.txt | jq '.entries[0] | {id, name, modified_at}'
```

### Copy File

```bash
curl -s -X POST "https://api.box.com/2.0/files/<file-id>/copy" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{"parent":{"id":"0"},"name":"Copy of report.txt"}' | jq '{id, name}'
```

### Delete File

```bash
curl -s -X DELETE "https://api.box.com/2.0/files/<file-id>" \
  --header "Authorization: Bearer $BOX_TOKEN"
```

## Search

### Search Content

```bash
curl -s "https://api.box.com/2.0/search?query=report&limit=20" \
  --header "Authorization: Bearer $BOX_TOKEN" | jq '.entries[] | {id, type, name}'
```

## Collaboration

### Create Collaboration

Write to `/tmp/box_collaboration.json`:

```json
{
  "item": {
    "type": "folder",
    "id": "<folder-id>"
  },
  "accessible_by": {
    "type": "user",
    "login": "teammate@example.com"
  },
  "role": "viewer"
}
```

```bash
curl -s -X POST "https://api.box.com/2.0/collaborations" \
  --header "Authorization: Bearer $BOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/box_collaboration.json | jq '{id, role, status}'
```
