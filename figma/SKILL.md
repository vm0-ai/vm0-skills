---
name: figma
description: Figma REST API for accessing design files, comments, components, and projects. Use this skill to read file contents, export images, manage comments, and integrate with Figma workspaces.
vm0_secrets:
  - FIGMA_TOKEN
---

# Figma API

Access and manage design files, components, comments, and projects in Figma workspaces via REST API.

> Official docs: `https://developers.figma.com/docs/rest-api/`

---

## When to Use

Use this skill when you need to:

- **Read design files** and extract components, styles, and frames
- **Export images** from Figma designs in various formats (PNG, JPG, SVG, PDF)
- **Get file version history** and track changes
- **Manage comments** on design files
- **Access design tokens** and styles
- **Get component information** from design systems

---

## Prerequisites

Connect your Figma account via the vm0 platform (OAuth connector). The `FIGMA_TOKEN` environment variable is automatically configured.

Verify authentication:

```bash
bash -c 'curl -s "https://api.figma.com/v1/me" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '{id, email, handle}'
```

Expected response: Your user information (id, email, handle).

### Finding File Keys

Figma file URLs contain the file key:

```
URL: https://www.figma.com/design/abc123XYZ/My-Design-File
File Key: abc123XYZ
```

The file key is the alphanumeric string between `/design/` (or `/file/`) and the next `/`.

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq '.[0]'
> ```

## How to Use

All examples assume `FIGMA_TOKEN` is set.

Base URL: `https://api.figma.com/v1`

---

### 1. Get Current User

Get information about the authenticated user (no parameters needed):

```bash
bash -c 'curl -s "https://api.figma.com/v1/me" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '{id, email, handle, img_url}'
```

---

### 2. Get File

Retrieve complete file structure including frames, components, and styles.

> **Note:** Replace `my-file-key` with your actual file key from a Figma URL.

```bash
FILE_KEY=my-file-key bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '{name, lastModified, version, document: .document.children[0].name}'
```

---

### 3. Get File Nodes

Retrieve specific nodes from a file by node IDs.

> **Note:** Replace `my-file-key` with your file key and `1:2` with actual node IDs (comma-separated, e.g., `1:2,1:3`).

```bash
FILE_KEY=my-file-key NODE_IDS=1:2 bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=$NODE_IDS" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.nodes'
```

Node IDs can be found in the file structure or from the Figma URL `?node-id=X-Y` parameter (convert `-` to `:`).

---

### 4. Get File Images

Export nodes as images in PNG, JPG, SVG, or PDF format.

> **Note:** Replace `my-file-key` with your file key and `1:2` with actual node IDs.

```bash
FILE_KEY=my-file-key NODE_IDS=1:2 bash -c 'curl -s "https://api.figma.com/v1/images/$FILE_KEY?ids=$NODE_IDS&format=png&scale=2" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.images'
```

**Parameters:**
- `format`: `png`, `jpg`, `svg`, `pdf` (default: `png`)
- `scale`: `0.5`, `1`, `2`, `4` (default: `1`)

---

### 5. Get Image Fills

Get download URLs for all images used in a file.

> **Note:** Replace `my-file-key` with your file key.

```bash
FILE_KEY=my-file-key bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY/images" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.meta.images'
```

---

### 6. Get File Comments

List all comments on a file.

> **Note:** Replace `my-file-key` with your file key.

```bash
FILE_KEY=my-file-key bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY/comments" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.comments[] | {id, message: .message, user: .user.handle, created_at}'
```

---

### 7. Post Comment

Add a comment to a file. Figma requires `client_meta` with a `node_id` to anchor the comment.

> **Note:** Replace `my-file-key` with your file key and `1:2` with an actual node ID.

```bash
FILE_KEY=my-file-key NODE_ID=1:2 bash -c 'curl -s -X POST "https://api.figma.com/v1/files/$FILE_KEY/comments" -H "Authorization: Bearer $FIGMA_TOKEN" -H "Content-Type: application/json" -d "{\"message\":\"This looks great!\",\"client_meta\":{\"node_id\":\"'$NODE_ID'\",\"node_offset\":{\"x\":0,\"y\":0}}}"' | jq '{id, message}'
```

---

### 8. Get File Versions

List version history of a file.

> **Note:** Replace `my-file-key` with your file key.

```bash
FILE_KEY=my-file-key bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY/versions" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.versions[] | {id, created_at, label, description, user: .user.handle}'
```

---

### 9. Get Project Files

List all files in a project.

> **Note:** Replace `12345` with your project ID. Project IDs can be found in Figma URLs or from team project listings.

```bash
PROJECT_ID=12345 bash -c 'curl -s "https://api.figma.com/v1/projects/$PROJECT_ID/files" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.files[] | {key, name, last_modified}'
```

---

### 10. Get Component Sets

Get component sets (variants) in a file.

> **Note:** Replace `my-file-key` with your file key.

```bash
FILE_KEY=my-file-key bash -c 'curl -s "https://api.figma.com/v1/files/$FILE_KEY/component_sets" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '.meta.component_sets[] | {key, name, description}'
```

---

### 11. Get Component

Get metadata for a specific component.

> **Note:** Replace `my-component-key` with your component key from the component sets output.

```bash
COMPONENT_KEY=my-component-key bash -c 'curl -s "https://api.figma.com/v1/components/$COMPONENT_KEY" -H "Authorization: Bearer $FIGMA_TOKEN"' | jq '{key, name, description, containing_frame}'
```

---

## Understanding File Structure

Figma files have a hierarchical structure:

```
FILE
└── CANVAS (page)
    ├── FRAME
    │   ├── RECTANGLE
    │   ├── TEXT
    │   └── GROUP
    │       └── VECTOR
    └── FRAME
        └── COMPONENT
```

Common node types: `CANVAS`, `FRAME`, `GROUP`, `VECTOR`, `BOOLEAN_OPERATION`, `STAR`, `LINE`, `ELLIPSE`, `REGULAR_POLYGON`, `RECTANGLE`, `TEXT`, `SLICE`, `COMPONENT`, `COMPONENT_SET`, `INSTANCE`

---

## Guidelines

1. **Start with `/v1/me`**: Always verify auth first before calling other endpoints
2. **File key from URL**: Extract the file key from Figma URLs (`/design/<file-key>/...`)
3. **Node IDs**: Node IDs are in format `X:Y` (e.g., `1:2`) — in URLs they appear as `X-Y`, convert `-` to `:`
4. **Rate limits**: 60 requests per minute; implement backoff for 429 responses
5. **Optimize exports**: Use appropriate scale and format for image exports
6. **Pagination**: Some endpoints return paginated results; check for `next_page` in responses
