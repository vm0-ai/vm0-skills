# Artifacts API Reference

Artifacts store output files from agent runs. Use artifacts to retrieve work products created by agents.

## List Artifacts

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, name}'
```

### Pagination

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts?limit=10&cursor=<cursor>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{data, pagination}'
```

Docs: https://docs.vm0.ai/docs/reference/api/artifacts

## Get Artifact

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, current_version_id}'
```

Response:

```json
{
  "id": "art_xxx",
  "name": "output-results",
  "current_version_id": "ver_xxx",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Create Artifact

Artifact names must be:
- Lowercase alphanumeric with hyphens
- No leading/trailing hyphens

```bash
curl -s -X POST "https://api.vm0.ai/v1/artifacts" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "name": "my-output-data"
}
EOF
```

## Delete Artifact

```bash
curl -s -X DELETE "https://api.vm0.ai/v1/artifacts/<artifact-id>" -H "Authorization: Bearer $VM0_API_KEY"
```

Returns `204 No Content` on success.

## List Artifact Versions

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>/versions" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, created_at}'
```

## Upload Files (3-Step Process)

Uploading files to an artifact requires three steps:

### Step 1: Prepare Upload

Request presigned URLs for your files:

Write to `/tmp/vm0_request.json`:

```json
{
  "files": [
    {"path": "results/output.json", "size": 1024},
    {"path": "results/report.pdf", "size": 2048}
  ],
  "message": "Added analysis results"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/artifacts/<artifact-id>/upload" -H "Authorization: Bearer $VM0_API_KEY" -H "Content-Type: application/json" -d @/tmp/vm0_request.json' | jq '{upload_session_id, files}'
```

Response:

```json
{
  "upload_session_id": "upl_xxx",
  "files": [
    {
      "path": "results/output.json",
      "upload_url": "https://storage.vm0.ai/presigned-url-1"
    },
    {
      "path": "results/report.pdf",
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
  --data-binary @results/output.json
```

```bash
curl -X PUT "https://storage.vm0.ai/presigned-url-2" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @results/report.pdf
```

### Step 3: Commit Upload

After all files are uploaded, commit to create a new version:

Write to `/tmp/vm0_request.json`:

```json
{
  "upload_session_id": "upl_xxx",
  "message": "Added analysis results"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/artifacts/<artifact-id>/commit" -H "Authorization: Bearer $VM0_API_KEY" -H "Content-Type: application/json" -d @/tmp/vm0_request.json' | jq '{id, files}'
```

Response (new version created):

```json
{
  "id": "ver_xxx",
  "artifact_id": "art_xxx",
  "files": [
    {"path": "results/output.json", "size": 1024},
    {"path": "results/report.pdf", "size": 2048}
  ],
  "message": "Added analysis results",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Download Files

Get presigned download URLs:

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>/download" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.files[] | {path, download_url}'
```

### Download Specific Version

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>/download?version_id=ver_xxx" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.files[] | {path, download_url}'
```

Response:

```json
{
  "version_id": "ver_xxx",
  "files": [
    {
      "path": "results/output.json",
      "download_url": "https://storage.vm0.ai/download-url-1"
    },
    {
      "path": "results/report.pdf",
      "download_url": "https://storage.vm0.ai/download-url-2"
    }
  ]
}
```

Download files using the presigned URLs:

```bash
curl -o output.json "https://storage.vm0.ai/download-url-1"
curl -o report.pdf "https://storage.vm0.ai/download-url-2"
```

Docs: https://docs.vm0.ai/docs/reference/api/artifacts
