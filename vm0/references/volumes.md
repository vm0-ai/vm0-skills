# Volumes API Reference

Volumes store input files for agent runs. Use volumes to provide data files, configurations, or other inputs to agents.

> **Note:** Volumes and Artifacts have nearly identical APIs. Volumes are for **inputs** (files you provide to agents), while Artifacts are for **outputs** (files agents create).

## List Volumes

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, name}'
```

### Pagination

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes?limit=10&cursor=<cursor>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{data, pagination}'
```

Docs: https://docs.vm0.ai/docs/reference/api/volumes

## Get Volume

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, current_version_id}'
```

Response:

```json
{
  "id": "vol_xxx",
  "name": "input-data",
  "current_version_id": "ver_xxx",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Create Volume

Volume names must be:
- Lowercase alphanumeric with hyphens
- No leading/trailing hyphens

```bash
curl -s -X POST "https://api.vm0.ai/v1/volumes" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "name": "my-input-data"
}
EOF
```

## Delete Volume

```bash
curl -s -X DELETE "https://api.vm0.ai/v1/volumes/<volume-id>" -H "Authorization: Bearer $VM0_API_KEY"
```

Returns `204 No Content` on success.

## List Volume Versions

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>/versions" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, created_at}'
```

## Upload Files (3-Step Process)

Uploading files to a volume requires three steps:

### Step 1: Prepare Upload

Request presigned URLs for your files:

Write to `/tmp/vm0_request.json`:

```json
{
  "files": [
    {"path": "data/input.csv", "size": 4096},
    {"path": "config/settings.json", "size": 512}
  ],
  "message": "Initial data upload"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/volumes/<volume-id>/upload" -H "Authorization: Bearer $VM0_API_KEY" -H "Content-Type: application/json" -d @/tmp/vm0_request.json' | jq '{upload_session_id, files}'
```

Response:

```json
{
  "upload_session_id": "upl_xxx",
  "files": [
    {
      "path": "data/input.csv",
      "upload_url": "https://storage.vm0.ai/presigned-url-1"
    },
    {
      "path": "config/settings.json",
      "upload_url": "https://storage.vm0.ai/presigned-url-2"
    }
  ]
}
```

### Step 2: Upload Files to Presigned URLs

Upload each file to its presigned URL:

```bash
curl -X PUT "https://storage.vm0.ai/presigned-url-1" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @data/input.csv
```

```bash
curl -X PUT "https://storage.vm0.ai/presigned-url-2" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @config/settings.json
```

### Step 3: Commit Upload

After all files are uploaded, commit to create a new version:

Write to `/tmp/vm0_request.json`:

```json
{
  "upload_session_id": "upl_xxx",
  "message": "Initial data upload"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/volumes/<volume-id>/commit" -H "Authorization: Bearer $VM0_API_KEY" -H "Content-Type: application/json" -d @/tmp/vm0_request.json' | jq '{id, files}'
```

Response (new version created):

```json
{
  "id": "ver_xxx",
  "volume_id": "vol_xxx",
  "files": [
    {"path": "data/input.csv", "size": 4096},
    {"path": "config/settings.json", "size": 512}
  ],
  "message": "Initial data upload",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Download Files

Get presigned download URLs:

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>/download" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.files[] | {path, download_url}'
```

### Download Specific Version

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>/download?version_id=ver_xxx" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.files[] | {path, download_url}'
```

Response:

```json
{
  "version_id": "ver_xxx",
  "files": [
    {
      "path": "data/input.csv",
      "download_url": "https://storage.vm0.ai/download-url-1"
    },
    {
      "path": "config/settings.json",
      "download_url": "https://storage.vm0.ai/download-url-2"
    }
  ]
}
```

Download files using the presigned URLs:

```bash
curl -o input.csv "https://storage.vm0.ai/download-url-1"
curl -o settings.json "https://storage.vm0.ai/download-url-2"
```

## Using Volumes in Runs

Mount volumes when creating a run:

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "agent": "my-agent",
  "prompt": "Process the input data",
  "volumes": {
    "input-data": "latest",
    "config-files": "ver_xxx"
  }
}
EOF
```

Volume values can be:
- `"latest"` - Use the most recent version
- `"ver_xxx"` - Use a specific version ID

Docs: https://docs.vm0.ai/docs/reference/api/volumes
