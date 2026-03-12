---
name: dropbox
description: Dropbox API for file storage. Use when user mentions "Dropbox", "dropbox.com",
  shares a Dropbox link, "upload to Dropbox", or asks about cloud storage.
vm0_secrets:
  - DROPBOX_TOKEN
---

# Dropbox API

Manage files and folders in Dropbox using the HTTP API v2.

> Official docs: `https://www.dropbox.com/developers/documentation/http/documentation`

## When to Use

- List files and folders
- Upload and download files
- Search for files by name or content
- Create and delete folders
- Move, copy, and rename files
- Get file metadata and sharing links

## Prerequisites

Go to [vm0.ai](https://vm0.ai) **Settings > Connectors** and connect **Dropbox**. vm0 will automatically inject the required `DROPBOX_TOKEN` environment variable.

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## Core APIs

### Get Current Account

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/users/get_current_account" --header "Authorization: Bearer $DROPBOX_TOKEN"' | jq '{account_id, name: .name.display_name, email}'
```

Docs: https://www.dropbox.com/developers/documentation/http/documentation#users-get_current_account

---

### List Folder

List files and folders at a given path. Use `""` for root.

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "",
  "recursive": false,
  "limit": 50
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/list_folder" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.entries[] | {name, path_display, ".tag", size, server_modified}'
```

Docs: https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder

### List Folder (subfolder)

Replace `<folder-path>` with the actual path (e.g., `/Documents`):

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "<folder-path>",
  "recursive": false,
  "limit": 50
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/list_folder" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.entries[] | {name, ".tag", size}'
```

---

### Get File Metadata

Replace `<file-path>` with the actual file path (e.g., `/Documents/report.pdf`):

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "<file-path>"
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/get_metadata" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '{name, path_display, ".tag", size, server_modified, id}'
```

---

### Search Files

Write to `/tmp/dropbox_request.json`:

```json
{
  "query": "report",
  "options": {
    "max_results": 20,
    "file_status": "active"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/search_v2" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.matches[] | {name: .metadata.metadata.name, path: .metadata.metadata.path_display}'
```

Docs: https://www.dropbox.com/developers/documentation/http/documentation#files-search_v2

---

### Create Folder

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "/New Folder",
  "autorename": false
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/create_folder_v2" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.metadata | {name, path_display, id}'
```

---

### Delete File or Folder

Replace `<path>` with the actual path:

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "<path>"
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/delete_v2" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.metadata | {name, path_display, ".tag"}'
```

---

### Move File or Folder

Write to `/tmp/dropbox_request.json`:

```json
{
  "from_path": "/old-location/file.txt",
  "to_path": "/new-location/file.txt",
  "autorename": false
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/move_v2" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.metadata | {name, path_display}'
```

---

### Copy File or Folder

Write to `/tmp/dropbox_request.json`:

```json
{
  "from_path": "/source/file.txt",
  "to_path": "/destination/file.txt",
  "autorename": false
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/files/copy_v2" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '.metadata | {name, path_display}'
```

---

### Upload File (small, up to 150MB)

Upload a local file. Replace `<dropbox-path>` with the target path and `<local-file>` with the local file path:

```bash
bash -c 'curl -s -X POST "https://content.dropboxapi.com/2/files/upload" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Dropbox-API-Arg: {\"path\": \"<dropbox-path>\", \"mode\": \"add\", \"autorename\": true}" --header "Content-Type: application/octet-stream" --data-binary @<local-file>' | jq '{name, path_display, size, id}'
```

Docs: https://www.dropbox.com/developers/documentation/http/documentation#files-upload

---

### Download File

Replace `<file-path>` with the actual file path:

```bash
bash -c 'curl -s -X POST "https://content.dropboxapi.com/2/files/download" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Dropbox-API-Arg: {\"path\": \"<file-path>\"}" -o /tmp/downloaded_file'
```

---

### Create Shared Link

Replace `<file-path>` with the actual file path:

Write to `/tmp/dropbox_request.json`:

```json
{
  "path": "<file-path>",
  "settings": {
    "requested_visibility": "public"
  }
}
```

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings" --header "Authorization: Bearer $DROPBOX_TOKEN" --header "Content-Type: application/json" -d @/tmp/dropbox_request.json' | jq '{url, path_lower, link_permissions}'
```

---

### Get Space Usage

```bash
bash -c 'curl -s -X POST "https://api.dropboxapi.com/2/users/get_space_usage" --header "Authorization: Bearer $DROPBOX_TOKEN"' | jq '{used, allocated: .allocation.allocated}'
```

---

## Guidelines

1. **Paths**: Always start with `/` for absolute paths; use `""` for root in list_folder
2. **API endpoints**: Use `api.dropboxapi.com` for metadata operations, `content.dropboxapi.com` for file content (upload/download)
3. **Upload limit**: The simple upload endpoint supports files up to 150MB; use upload sessions for larger files
4. **Rate limits**: Dropbox applies per-app and per-user rate limits; back off on 429 responses
5. **Case sensitivity**: Dropbox paths are case-insensitive but case-preserving
