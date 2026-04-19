---
name: pinecone
description: Pinecone vector database API for storing, querying, and managing vector embeddings. Use when user mentions "Pinecone", "vector database", "vector search", "semantic search", "embeddings", "similarity search", "upsert vectors", or "index".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name PINECONE_API_KEY` or `zero doctor check-connector --url https://api.pinecone.io/indexes --method GET`

## Authentication

All requests require an API key in the header:

```
Api-Key: $PINECONE_API_KEY
```

> Official docs: `https://docs.pinecone.io/reference/api/`

## Indexes

### List Indexes

```bash
curl -s -X GET "https://api.pinecone.io/indexes" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

### Describe Index

```bash
curl -s -X GET "https://api.pinecone.io/indexes/<index-name>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

### Create Index (Serverless)

Write to `/tmp/pinecone_create_index.json`:

```json
{
  "name": "<index-name>",
  "dimension": 1536,
  "metric": "cosine",
  "spec": {
    "serverless": {
      "cloud": "aws",
      "region": "us-east-1"
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.pinecone.io/indexes" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_create_index.json
```

Supported metrics: `cosine`, `euclidean`, `dotproduct`. Common dimension sizes: `1536` (OpenAI text-embedding-3-small), `3072` (text-embedding-3-large), `768` (many open-source models).

### Delete Index

```bash
curl -s -X DELETE "https://api.pinecone.io/indexes/<index-name>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

## Vectors

Pinecone data plane operations are performed against the index host URL, which is returned in the `host` field when you describe an index (e.g. `https://<index-name>-<project-id>.svc.<environment>.pinecone.io`).

Retrieve the host first:

```bash
curl -s -X GET "https://api.pinecone.io/indexes/<index-name>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

Use the `host` value from the response in all data plane requests below. Replace `<index-host>` with the full host URL (e.g. `https://my-index-abc123.svc.aped-1234-56ab.pinecone.io`).

### Upsert Vectors

Write to `/tmp/pinecone_upsert.json`:

```json
{
  "vectors": [
    {
      "id": "<vector-id>",
      "values": [0.1, 0.2, 0.3],
      "metadata": {
        "text": "<source-text>",
        "source": "<source-name>"
      }
    }
  ],
  "namespace": "<namespace>"
}
```

Then run:

```bash
curl -s -X POST "<index-host>/vectors/upsert" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_upsert.json
```

The `namespace` field is optional — omit it to use the default namespace. The `values` array must match the index dimension exactly. Up to 100 vectors per upsert request.

### Query Vectors

Write to `/tmp/pinecone_query.json`:

```json
{
  "vector": [0.1, 0.2, 0.3],
  "topK": 10,
  "includeMetadata": true,
  "includeValues": false,
  "namespace": "<namespace>"
}
```

Then run:

```bash
curl -s -X POST "<index-host>/query" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_query.json
```

Returns `matches` array with `id`, `score`, and optionally `values` and `metadata`. Scores are cosine similarity (higher = more similar).

### Query by Vector ID

Write to `/tmp/pinecone_query_by_id.json`:

```json
{
  "id": "<vector-id>",
  "topK": 10,
  "includeMetadata": true,
  "namespace": "<namespace>"
}
```

Then run:

```bash
curl -s -X POST "<index-host>/query" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_query_by_id.json
```

### Fetch Vectors by ID

```bash
curl -s -X GET "<index-host>/vectors/fetch?ids=<id1>&ids=<id2>&namespace=<namespace>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

### Delete Vectors by ID

Write to `/tmp/pinecone_delete.json`:

```json
{
  "ids": ["<id1>", "<id2>"],
  "namespace": "<namespace>"
}
```

Then run:

```bash
curl -s -X POST "<index-host>/vectors/delete" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_delete.json
```

### Delete All Vectors in Namespace

Write to `/tmp/pinecone_delete_all.json`:

```json
{
  "deleteAll": true,
  "namespace": "<namespace>"
}
```

Then run:

```bash
curl -s -X POST "<index-host>/vectors/delete" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_delete_all.json
```

### Describe Index Stats

```bash
curl -s -X GET "<index-host>/describe_index_stats" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

Returns total vector count and per-namespace breakdown.

### List Vector IDs

```bash
curl -s -X GET "<index-host>/vectors/list?namespace=<namespace>&limit=100" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

Use the `pagination_token` from the response to page through results.

## Collections (Backups)

### List Collections

```bash
curl -s -X GET "https://api.pinecone.io/collections" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

### Create Collection from Index

Write to `/tmp/pinecone_create_collection.json`:

```json
{
  "name": "<collection-name>",
  "source": "<source-index-name>"
}
```

Then run:

```bash
curl -s -X POST "https://api.pinecone.io/collections" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04" --header "Content-Type: application/json" -d @/tmp/pinecone_create_collection.json
```

### Describe Collection

```bash
curl -s -X GET "https://api.pinecone.io/collections/<collection-name>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

### Delete Collection

```bash
curl -s -X DELETE "https://api.pinecone.io/collections/<collection-name>" --header "Api-Key: $PINECONE_API_KEY" --header "X-Pinecone-API-Version: 2025-04"
```

## Prerequisites

Connect the **Pinecone** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name PINECONE_API_KEY` or `zero doctor check-connector --url https://api.pinecone.io/indexes --method GET`

## Guidelines

1. **Index host vs. control plane**: Use `https://api.pinecone.io` for index management (create, list, delete). Use the per-index `host` URL for vector operations (upsert, query, fetch, delete vectors).
2. **Namespaces**: Namespaces partition vectors within an index. The default namespace is `""` (empty string). Always specify a namespace for multi-tenant use cases.
3. **Dimension matching**: The `values` array in every upsert must exactly match the index `dimension`. Mismatches return 400 errors.
4. **Upsert limits**: Max 100 vectors per upsert request, up to 2 MB total payload.
5. **API version header**: Always include `X-Pinecone-API-Version: 2025-04` to pin the API version.
6. **Index readiness**: After creation, wait for `status.ready == true` before upserting. Poll with Describe Index.
