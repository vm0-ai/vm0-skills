---
name: dropbox
description: Dropbox API for file storage. Use when user mentions "Dropbox", "dropbox.com",
  shares a Dropbox link, "upload to Dropbox", or asks about cloud storage.
---

# Dropbox API

Manage files, folders, sharing, and file requests in Dropbox using the HTTP API v2.

> Official docs: https://www.dropbox.com/developers/documentation/http/documentation

---

## When to Use

Use this skill when you need to:

- List, search, upload, download, move, copy, or delete files and folders
- Get file metadata, revisions, and previews
- Create and manage shared links and folder sharing
- Manage file requests
- Check storage usage

---

## Prerequisites

Connect Dropbox via the vm0 connector. The access token is provided as `$DROPBOX_TOKEN`.

### Base URLs

- **API** (metadata operations): `https://api.dropboxapi.com`
- **Content** (upload/download): `https://content.dropboxapi.com`

> **Important:** Dropbox API uses POST for nearly all operations, including reads. Parameters are sent as JSON body, not query params.

---

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name DROPBOX_TOKEN` or `zero doctor check-connector --url https://api.dropboxapi.com/2/users/get_current_account --method POST`

## User

### Get Current Account

```bash
curl -s -X POST "https://api.dropboxapi.com/2/users/get_current_account" \
  --header "Authorization: Bearer $DROPBOX_TOKEN"
```

### Get Space Usage

```bash
curl -s -X POST "https://api.dropboxapi.com/2/users/get_space_usage" \
  --header "Authorization: Bearer $DROPBOX_TOKEN"
```

---

## Files & Folders

### List Folder

Use `""` for root, or `/path/to/folder` for subfolders.

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/list_folder" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"\", \"recursive\": false, \"limit\": 100}"
```

### List Folder (Continue)

When `has_more` is true in the response, use the cursor to get more results.

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/list_folder/continue" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"cursor\": \"<cursor>\"}"
```

### Get Latest Cursor

Get a cursor for the current state without listing files. Useful for detecting changes later.

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"\", \"recursive\": true}"
```

### Get File/Folder Metadata

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/get_metadata" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\"}"
```

### Search Files

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/search:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"query\": \"report\", \"options\": {\"max_results\": 20, \"file_status\": \"active\"}}"
```

### Search Continue

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/search/continue:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"cursor\": \"<cursor>\"}"
```

### Create Folder

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/create_folder:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/New Folder\", \"autorename\": false}"
```

### Delete File or Folder

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/delete:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/path/to/delete\"}"
```

### Permanently Delete

Requires Dropbox Business with permanent delete enabled.

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/permanently_delete" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/path/to/delete\"}"
```

### Move File or Folder

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/move:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"from_path\": \"/old/file.txt\", \"to_path\": \"/new/file.txt\", \"autorename\": false}"
```

### Copy File or Folder

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/copy:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"from_path\": \"/source/file.txt\", \"to_path\": \"/dest/file.txt\", \"autorename\": false}"
```

### List File Revisions

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/list_revisions" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\", \"limit\": 10}"
```

### Restore File to Revision

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/restore" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\", \"rev\": \"<revision-id>\"}"
```

### Save URL to Dropbox

Download a URL directly into Dropbox.

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/save_url" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Downloads/file.pdf\", \"url\": \"https://example.com/file.pdf\"}"
```

### Get Tags

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/tags/get" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"paths\": [\"/Documents/report.pdf\"]}"
```

### Add Tag

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/tags/add" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\", \"tag_text\": \"important\"}"
```

### Remove Tag

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/tags/remove" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\", \"tag_text\": \"important\"}"
```

---

## Upload & Download

### Upload File (up to 150 MB)

```bash
curl -s -X POST "https://content.dropboxapi.com/2/files/upload" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Dropbox-API-Arg: {\"path\": \"/Documents/report.pdf\", \"mode\": \"add\", \"autorename\": true}" \
  --header "Content-Type: application/octet-stream" \
  --data-binary @report.pdf
```

`mode`: `add` (fail if exists), `overwrite`, `update` (with rev).

### Download File

```bash
curl -s -X POST "https://content.dropboxapi.com/2/files/download" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Dropbox-API-Arg: {\"path\": \"/Documents/report.pdf\"}" \
  -o report.pdf
```

### Get Temporary Download Link

```bash
curl -s -X POST "https://api.dropboxapi.com/2/files/get_temporary_link" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\"}"
```

Returns a temporary link (4 hours) that doesn't require auth.

### Get Thumbnail

```bash
curl -s -X POST "https://content.dropboxapi.com/2/files/get_thumbnail:2" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Dropbox-API-Arg: {\"resource\": {\".tag\": \"path\", \"path\": \"/Photos/image.jpg\"}, \"format\": \"jpeg\", \"size\": \"w256h256\"}" \
  -o thumbnail.jpg
```

---

## Sharing

### Create Shared Link

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\", \"settings\": {\"requested_visibility\": \"public\"}}"
```

Visibility: `public`, `team_only`, `password` (with `link_password`).

### List Shared Links

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/list_shared_links" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Documents/report.pdf\"}"
```

### Modify Shared Link

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/modify_shared_link_settings" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"url\": \"https://www.dropbox.com/s/xxx/file.pdf\", \"settings\": {\"requested_visibility\": \"team_only\"}}"
```

### Revoke Shared Link

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/revoke_shared_link" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"url\": \"https://www.dropbox.com/s/xxx/file.pdf\"}"
```

### Share Folder

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/share_folder" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"path\": \"/Shared Project\", \"acl_update_policy\": \"editors\"}"
```

### Add Folder Member

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/add_folder_member" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"shared_folder_id\": \"<folder-id>\", \"members\": [{\"member\": {\".tag\": \"email\", \"email\": \"user@example.com\"}, \"access_level\": {\".tag\": \"editor\"}}]}"
```

### List Folder Members

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/list_folder_members" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"shared_folder_id\": \"<folder-id>\"}"
```

### Remove Folder Member

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/remove_folder_member" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"shared_folder_id\": \"<folder-id>\", \"member\": {\".tag\": \"email\", \"email\": \"user@example.com\"}, \"leave_a_copy\": false}"
```

### List Shared Folders

```bash
curl -s -X POST "https://api.dropboxapi.com/2/sharing/list_folders" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"limit\": 100}"
```

---

## File Requests

### List File Requests

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/list" \
  --header "Authorization: Bearer $DROPBOX_TOKEN"
```

### Create File Request

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/create" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"title\": \"Upload receipts\", \"destination\": \"/File Requests/Receipts\", \"open\": true}"
```

### Get File Request

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/get" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"id\": \"<file-request-id>\"}"
```

### Update File Request

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/update" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"id\": \"<file-request-id>\", \"title\": \"Upload Q2 receipts\", \"open\": true}"
```

### Delete File Requests

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/delete" \
  --header "Authorization: Bearer $DROPBOX_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"ids\": [\"<file-request-id>\"]}"
```

### Count File Requests

```bash
curl -s -X POST "https://api.dropboxapi.com/2/file_requests/count" \
  --header "Authorization: Bearer $DROPBOX_TOKEN"
```

---

## Guidelines

1. **All POST**: Dropbox API uses POST for nearly everything, including reads. Don't use GET.
2. **Paths**: Start with `/` for absolute paths. Use `""` (empty string) for root in `list_folder`. Paths are case-insensitive but case-preserving.
3. **Base URLs**: Use `api.dropboxapi.com` for metadata operations, `content.dropboxapi.com` for file content (upload/download/thumbnail).
4. **Upload limit**: Simple upload supports up to 150 MB. For larger files, use upload sessions (`upload_session/start`, `append`, `finish`).
5. **Pagination**: When `has_more` is true, call the `*/continue` endpoint with the returned cursor.
6. **Rate limits**: Back off on 429 responses. Use `Retry-After` header.
7. **Shared links**: Use `create_shared_link_with_settings` (not deprecated `create_shared_link`).
8. **Batch operations**: `copy_batch`, `move_batch`, `delete_batch` are available for bulk operations.

---

## How to Look Up More API Details

- **Full API Reference**: https://www.dropbox.com/developers/documentation/http/documentation
- **Files**: https://www.dropbox.com/developers/documentation/http/documentation#files
- **Sharing**: https://www.dropbox.com/developers/documentation/http/documentation#sharing
- **File Requests**: https://www.dropbox.com/developers/documentation/http/documentation#file_requests
- **Users**: https://www.dropbox.com/developers/documentation/http/documentation#users
- **Paper**: https://www.dropbox.com/developers/documentation/http/documentation#paper
