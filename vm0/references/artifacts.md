# Artifacts API Reference

Artifacts store output files from agent runs. Use artifacts to retrieve work products created by agents.

> **Note:** Artifacts are created automatically by agents during runs. Use this API to list and download artifact contents.

## List Artifacts

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, name, size, file_count}'
```

### Pagination

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts?limit=10&cursor=<cursor>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{data, pagination}'
```

Docs: https://docs.vm0.ai/docs/reference/api/artifacts

## Get Artifact

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, current_version_id, size, file_count}'
```

Response:

```json
{
  "id": "art_xxx",
  "name": "output-results",
  "current_version_id": "abc123def456...",
  "size": 4096,
  "file_count": 2,
  "current_version": {
    "id": "abc123def456...",
    "artifact_id": "art_xxx",
    "size": 4096,
    "file_count": 2,
    "message": "Run output",
    "created_by": "user_xxx",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## List Artifact Versions

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/artifacts/<artifact-id>/versions" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, size, file_count, created_at}'
```

Response:

```json
{
  "data": [
    {
      "id": "abc123def456...",
      "artifact_id": "art_xxx",
      "size": 4096,
      "file_count": 2,
      "message": "Latest output",
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

## Download Artifact

Downloads the artifact as a tar.gz archive. The endpoint returns a **302 redirect** to a presigned URL.

### Download Current Version

```bash
curl -L -o artifact.tar.gz "https://api.vm0.ai/v1/artifacts/<artifact-id>/download" \
  -H "Authorization: Bearer $VM0_API_KEY"
```

### Download Specific Version

Use a version ID or short prefix (minimum 8 characters):

```bash
curl -L -o artifact.tar.gz "https://api.vm0.ai/v1/artifacts/<artifact-id>/download?version_id=abc123de" \
  -H "Authorization: Bearer $VM0_API_KEY"
```

### Extract Downloaded Archive

```bash
tar -xzf artifact.tar.gz -C ./output/
```

> **Note:** The `-L` flag tells curl to follow the redirect to the presigned URL.

Docs: https://docs.vm0.ai/docs/reference/api/artifacts
