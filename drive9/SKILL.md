---
name: drive9
description: drive9.ai network filesystem for AI agents with semantic search, auto-embedding, and tiered storage on top of db9 + S3. Use when the user wants agent-accessible files with natural-language search, zero-copy rename/copy, or persistent context across sessions.
homepage: https://drive9.ai
docs: https://github.com/mem9-ai/drive9/blob/main/README.md
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DRIVE9_TOKEN` or `zero doctor check-connector --url https://api.drive9.ai/v1/fs/ --method GET`.

## How It Works

drive9 is a filesystem-like API for AI agents. Files are auto-embedded and full-text indexed so they can be retrieved by meaning, not just filename. Small files (<50 KB) live in db9 with instant embedding; large files go to S3 via presigned URLs. A single path namespace spans both tiers.

```
Account (DRIVE9_TOKEN)
└── Filesystem
    ├── Files (auto-embedded + FTS indexed)
    ├── Directories
    │   ├── .abstract.md  (~100 tokens, L0 scan)
    │   └── .overview.md  (~1k tokens, L1 scan)
    └── Semantic search index
```

Base URL: `https://api.drive9.ai`

All filesystem operations use the unified `/v1/fs/{path}` endpoint with method verbs and presence-based query-string modifiers. For example, `?list` and `?list=1` are equivalent because the server checks for parameter presence.

## Authentication

Use a drive9 API key as a bearer token:

```
Authorization: Bearer $DRIVE9_TOKEN
```

The server also accepts `X-API-Key: $DRIVE9_TOKEN` for compatibility. Get a key via the drive9.ai console or the `drive9 create` CLI.

## Environment Variables

| Variable | Description |
|---|---|
| `DRIVE9_TOKEN` | drive9 API key |

## Key Endpoints

### 1. Write a File

Body is the raw file contents. Replace `<path>` with a path such as `notes/todo.md`:

```bash
curl -s -X PUT "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "Content-Type: text/markdown" --data-binary @/tmp/payload.txt
```

Optional write headers:

| Header | Use |
|---|---|
| `X-Dat9-Expected-Revision` | Conditional write to prevent overwriting a newer revision |
| `X-Dat9-Tag: key=value` | Add a file tag on small-file writes |
| `X-Dat9-Description` | Add a file description |

### 2. Read a File

```bash
curl -s "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

### 3. List a Directory

```bash
curl -s "https://api.drive9.ai/v1/fs/<path>?list" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

### 4. Stat

Lightweight stat via headers:

```bash
curl -s -I "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

JSON metadata stat:

```bash
curl -s "https://api.drive9.ai/v1/fs/<path>?stat" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

### 5. Delete a File or Directory

```bash
curl -s -X DELETE "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

Recursive delete:

```bash
curl -s -X DELETE "https://api.drive9.ai/v1/fs/<path>?recursive" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

### 6. Make a Directory

```bash
curl -s -X POST "https://api.drive9.ai/v1/fs/<path>?mkdir" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

### 7. Zero-Copy Duplicate

One file can appear at multiple paths without re-uploading. The server expects `X-Dat9-Copy-Source`:

```bash
curl -s -X POST "https://api.drive9.ai/v1/fs/<destination>?copy" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "X-Dat9-Copy-Source: <source-path>"
```

### 8. Rename

The server expects `X-Dat9-Rename-Source`:

```bash
curl -s -X POST "https://api.drive9.ai/v1/fs/<new-path>?rename" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "X-Dat9-Rename-Source: <old-path>"
```

### 9. Search and Find

Content search:

```bash
curl -s --get "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN" --data-urlencode "grep=<query>" --data-urlencode "limit=20"
```

Find files by attributes:

```bash
curl -s --get "https://api.drive9.ai/v1/fs/<path>" --header "Authorization: Bearer $DRIVE9_TOKEN" --data-urlencode "find=" --data-urlencode "name=*.md"
```

### 10. Batch Operations

Batch stat:

```bash
curl -s -X POST "https://api.drive9.ai/v1/fs:batch-stat" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "Content-Type: application/json" --data-binary '{"paths":["/notes/a.md","/notes/b.md"]}'
```

Batch read small files:

```bash
curl -s -X POST "https://api.drive9.ai/v1/fs:batch-read-small" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "Content-Type: application/json" --data-binary '{"paths":["/notes/a.md"],"max_bytes":50000}'
```

### 11. Large File Uploads

For large files, prefer the drive9 CLI or SDK. If calling HTTP directly, use the V2 multipart upload flow:

```text
POST /v2/uploads/initiate
POST /v2/uploads/{id}/presign
POST /v2/uploads/{id}/presign-batch
POST /v2/uploads/{id}/complete
POST /v2/uploads/{id}/abort
```

Advanced append uploads use `POST /v1/fs/{path}?append` with a JSON body such as `{"append_size":123,"part_size":5242880}`. It returns an append upload plan; it does not append raw request bytes directly.

### 12. Change Events

SSE change stream:

```bash
curl -N "https://api.drive9.ai/v1/events" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

## Common Workflow: Persistent Agent Notes with Semantic Search

```bash
# 1. Create a directory
curl -s -X POST "https://api.drive9.ai/v1/fs/notes?mkdir" --header "Authorization: Bearer $DRIVE9_TOKEN"

# 2. Write an abstract so future agents can skim this directory cheaply
echo "Research notes on agent memory systems." > /tmp/drive9_abstract.md
curl -s -X PUT "https://api.drive9.ai/v1/fs/notes/.abstract.md" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "Content-Type: text/markdown" --data-binary @/tmp/drive9_abstract.md

# 3. Write a note
cat > /tmp/drive9_note.md << 'NOTE'
# Mem9 architecture
Cloud-persistent memory with hybrid vector + keyword search.
NOTE
curl -s -X PUT "https://api.drive9.ai/v1/fs/notes/mem9-arch.md" --header "Authorization: Bearer $DRIVE9_TOKEN" --header "Content-Type: text/markdown" --data-binary @/tmp/drive9_note.md

# 4. List
curl -s "https://api.drive9.ai/v1/fs/notes?list" --header "Authorization: Bearer $DRIVE9_TOKEN"

# 5. Search
curl -s --get "https://api.drive9.ai/v1/fs/notes" --header "Authorization: Bearer $DRIVE9_TOKEN" --data-urlencode "grep=memory systems" --data-urlencode "limit=20"

# 6. Read back
curl -s "https://api.drive9.ai/v1/fs/notes/mem9-arch.md" --header "Authorization: Bearer $DRIVE9_TOKEN"
```

## Guidelines

1. Use `--data-binary` (not `-d`) when writing files so bytes are preserved.
2. Populate `.abstract.md` (~100 tokens) and `.overview.md` (~1k tokens) in each directory so agents can scan L0/L1 before loading full content - 10x token savings.
3. Small files (<50 KB) are embedded and FTS-indexed automatically; large files go to S3 and are served via presigned URLs.
4. `?copy` and `?rename` are O(1) metadata operations - prefer them over re-upload.
