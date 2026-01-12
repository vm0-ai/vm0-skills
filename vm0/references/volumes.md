# Volumes API Reference

Volumes store input files for agent runs. Use volumes to provide data files, configurations, or other inputs to agents.

> **Note:** Volumes are created via the CLI (`vm0 push`). Use this API to list and download volume contents.

## List Volumes

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, name, size, file_count}'
```

### Pagination

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes?limit=10&cursor=<cursor>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{data, pagination}'
```

Docs: https://docs.vm0.ai/docs/reference/api/volumes

## Get Volume

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, current_version_id, size, file_count}'
```

Response:

```json
{
  "id": "vol_xxx",
  "name": "input-data",
  "current_version_id": "abc123def456...",
  "size": 4096,
  "file_count": 2,
  "current_version": {
    "id": "abc123def456...",
    "volume_id": "vol_xxx",
    "size": 4096,
    "file_count": 2,
    "message": "Initial upload",
    "created_by": "user_xxx",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## List Volume Versions

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/volumes/<volume-id>/versions" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, size, file_count, created_at}'
```

Response:

```json
{
  "data": [
    {
      "id": "abc123def456...",
      "volume_id": "vol_xxx",
      "size": 4096,
      "file_count": 2,
      "message": "Updated data",
      "created_by": "user_xxx",
      "created_at": "2024-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "has_more": false,
    "next_cursor": null
  }
}
```

## Download Volume

Downloads the volume as a tar.gz archive. The endpoint returns a **302 redirect** to a presigned URL.

### Download Current Version

```bash
curl -L -o volume.tar.gz "https://api.vm0.ai/v1/volumes/<volume-id>/download" \
  -H "Authorization: Bearer $VM0_API_KEY"
```

### Download Specific Version

Use a version ID or short prefix (minimum 8 characters):

```bash
curl -L -o volume.tar.gz "https://api.vm0.ai/v1/volumes/<volume-id>/download?version_id=abc123de" \
  -H "Authorization: Bearer $VM0_API_KEY"
```

### Extract Downloaded Archive

```bash
tar -xzf volume.tar.gz -C ./data/
```

> **Note:** The `-L` flag tells curl to follow the redirect to the presigned URL.

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
    "config-files": "abc123de"
  }
}
EOF
```

Volume values can be:
- `"latest"` - Use the most recent version
- `"abc123de"` - Use a specific version ID or short prefix

Docs: https://docs.vm0.ai/docs/reference/api/volumes
