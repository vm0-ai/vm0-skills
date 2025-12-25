---
name: figma
description: Figma REST API for accessing design files, comments, components, and projects. Use this skill to read file contents, export images, manage comments, and integrate with Figma workspaces.
vm0_env:
  - FIGMA_API_TOKEN
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
- **List projects and files** in a team
- **Access design tokens** and styles
- **Get component information** from design systems
- **Retrieve team and project metadata**

---

## Prerequisites

### Getting Your API Token

1. Log in to [Figma](https://www.figma.com/)
2. Go to **Settings** page: https://www.figma.com/settings
3. Scroll down to **Personal access tokens** section
4. Click **Generate new token**
5. Enter a token name (e.g., `vm0-skills-test`)
6. Click **Create** and **immediately copy the token** (format: `figd_...`)
   - ⚠️ The token is only shown once - save it securely
   - If lost, you must delete and create a new token

```bash
export FIGMA_API_TOKEN="figd_..."
```

### Verify Token

Test your token with this command:

```bash
bash -c 'curl -s -X GET "https://api.figma.com/v1/me" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq .'
```

Expected response: Your user information (id, email, handle)

### Finding File Keys

Figma file URLs contain the file key:

```
URL: https://www.figma.com/design/abc123XYZ/My-Design-File
File Key: abc123XYZ
```

The file key is the alphanumeric string between `/design/` (or `/file/`) and the next `/`.

### Rate Limits

- 60 requests per minute per IP address
- 429 status code = rate limited, retry after delay

---


> **Important:** When piping `curl` output to `jq`, wrap the command in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY" | jq .'
> ```

## How to Use

All examples assume `FIGMA_API_TOKEN` is set.

Base URL: `https://api.figma.com/v1`

---

### 1. Get File

Retrieve complete file structure including frames, components, and styles:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'{name, lastModified, version, document: .document.children[0].name}'"'"''
```

Get specific version:

```bash
bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}?version=123" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq .'
```

---

### 2. Get File Nodes

Retrieve specific nodes from a file by node IDs:

```bash
FILE_KEY="abc123XYZ"
NODE_IDS="1:2,1:3"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_IDS}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.nodes'"'"''
```

Node IDs can be found in the file structure or by appending `?node-id=X-Y` to the Figma URL.

---

### 3. Get File Images

Export nodes as images in PNG, JPG, SVG, or PDF format:

```bash
FILE_KEY="abc123XYZ"
NODE_IDS="1:2,1:3"

bash -c 'curl -s -X GET "https://api.figma.com/v1/images/${FILE_KEY}?ids=${NODE_IDS}&format=png&scale=2" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.images'"'"''
```

**Parameters:**
- `format`: `png`, `jpg`, `svg`, `pdf` (default: `png`)
- `scale`: `0.5`, `1`, `2`, `4` (default: `1`)
- `svg_outline_text`: `true` to convert text to outlines in SVG
- `svg_include_id`: `true` to include node IDs in SVG

Download an exported image:

```bash
curl -s -X GET "https://api.figma.com/v1/images/${FILE_KEY}?ids=1:2&format=png" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" > /tmp/resp.json
IMAGE_URL=$(cat /tmp/resp.json | jq -r '.images["1:2"]')

curl -s -o output.png "$IMAGE_URL"
```

---

### 4. Get Image Fills

Get download URLs for all images used in a file:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}/images" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.meta.images'"'"''
```

---

### 5. Get File Comments

List all comments on a file:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}/comments" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.comments[] | {id, message: .message, user: .user.handle, created_at}'"'"''
```

---

### 6. Post Comment

Add a comment to a file:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X POST "https://api.figma.com/v1/files/${FILE_KEY}/comments" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" -H "Content-Type: application/json" -d '"'"'{"message": "This looks great!", "client_meta": {"x": 100, "y": 200}}'"'"' | jq .'
```

To comment on a specific node, add `client_meta` with node coordinates.

---

### 7. Delete Comment

Delete a comment by ID:

```bash
FILE_KEY="abc123XYZ"
COMMENT_ID="123456"

curl -s -X DELETE "https://api.figma.com/v1/files/${FILE_KEY}/comments/${COMMENT_ID}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}"
```

---

### 8. Get File Versions

List version history of a file:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}/versions" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.versions[] | {id, created_at, label, description, user: .user.handle}'"'"''
```

---

### 9. Get Team Projects

List all projects in a team:

```bash
TEAM_ID="123456"

bash -c 'curl -s -X GET "https://api.figma.com/v1/teams/${TEAM_ID}/projects" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.projects[] | {id, name}'"'"''
```

To find your team ID, go to your Figma team page and extract it from the URL: `https://www.figma.com/files/team/123456/TeamName`

---

### 10. Get Project Files

List all files in a project:

```bash
PROJECT_ID="123456"

bash -c 'curl -s -X GET "https://api.figma.com/v1/projects/${PROJECT_ID}/files" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.files[] | {key, name, last_modified}'"'"''
```

---

### 11. Get Team Components

Get all published components in a team:

```bash
TEAM_ID="123456"

bash -c 'curl -s -X GET "https://api.figma.com/v1/teams/${TEAM_ID}/components" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.meta.components[] | {key, name, description, containing_frame: .containing_frame.name}'"'"''
```

---

### 12. Get Component

Get metadata for a specific component:

```bash
COMPONENT_KEY="abc123"

bash -c 'curl -s -X GET "https://api.figma.com/v1/components/${COMPONENT_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'{key, name, description, containing_frame}'"'"''
```

---

### 13. Get Team Styles

Get all published styles (colors, text, effects, grids) in a team:

```bash
TEAM_ID="123456"

bash -c 'curl -s -X GET "https://api.figma.com/v1/teams/${TEAM_ID}/styles" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.meta.styles[] | {key, name, description, style_type}'"'"''
```

**Style types:** `FILL`, `TEXT`, `EFFECT`, `GRID`

---

### 14. Get Style

Get metadata for a specific style:

```bash
STYLE_KEY="abc123"

bash -c 'curl -s -X GET "https://api.figma.com/v1/styles/${STYLE_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'{key, name, description, style_type}'"'"''
```

---

### 15. Get Current User

Get information about the authenticated user:

```bash
bash -c 'curl -s -X GET "https://api.figma.com/v1/me" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'{id, email, handle, img_url}'"'"''
```

---

### 16. Get Team Members

List all members of a team:

```bash
TEAM_ID="123456"

bash -c 'curl -s -X GET "https://api.figma.com/v1/teams/${TEAM_ID}/members" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.members[] | {id, email: .user.email, handle: .user.handle, role}'"'"''
```

---

### 17. Get Component Sets

Get component sets (variants) in a file:

```bash
FILE_KEY="abc123XYZ"

bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}/component_sets" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.meta.component_sets[] | {key, name, description}'"'"''
```

---

### 18. Search Files

Search for files in a team (requires team ID):

```bash
TEAM_ID="123456"
QUERY="button"

bash -c 'curl -s -X GET "https://api.figma.com/v1/teams/${TEAM_ID}/files?name=${QUERY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.files[] | {key, name, last_modified}'"'"''
```

---

## Common Workflows

### Export All Frames as Images

```bash
FILE_KEY="abc123XYZ"

# Get all frame IDs
curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" > /tmp/resp.json
FRAME_IDS=$(cat /tmp/resp.json | jq -r '.document.children[0].children[] | select(.type=="FRAME") | .id' | paste -sd "," -)

# Export frames
bash -c 'curl -s -X GET "https://api.figma.com/v1/images/${FILE_KEY}?ids=${FRAME_IDS}&format=png&scale=2" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.images'"'"''
```

### Extract Design Tokens

```bash
FILE_KEY="abc123XYZ"

# Get color styles
bash -c 'curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" | jq '"'"'.styles | to_entries[] | select(.value.styleType == "FILL") | {name: .value.name, key: .value.key}'"'"''
```

### Monitor File Changes

```bash
FILE_KEY="abc123XYZ"

# Get current version
curl -s -X GET "https://api.figma.com/v1/files/${FILE_KEY}" -H "X-Figma-Token: ${FIGMA_API_TOKEN}" > /tmp/resp.json
CURRENT_VERSION=$(cat /tmp/resp.json | jq -r '.version')

echo "Current version: $CURRENT_VERSION"
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

1. **Cache file data**: File requests can be large; cache results when possible
2. **Use webhooks**: For real-time updates, consider Figma webhooks instead of polling
3. **Respect rate limits**: Implement exponential backoff for 429 responses
4. **Version control**: Use `version` parameter to access specific file versions
5. **Optimize exports**: Use appropriate scale and format for image exports to reduce file size
6. **Node IDs**: Node IDs are in format `X:Y` (e.g., `1:2`) and must be URL-encoded in some endpoints
7. **Team scope**: Many operations require team-level access; ensure your token has team permissions
8. **Pagination**: Some endpoints return paginated results; check for `next_page` in responses

---

## API Reference

- Main Documentation: https://developers.figma.com/docs/rest-api/
- Authentication: https://developers.figma.com/docs/rest-api/authentication/
- API Endpoints: https://developers.figma.com/docs/api/
- Webhooks: https://developers.figma.com/docs/webhooks/
- Plugins: https://www.figma.com/plugin-docs/
- Token Settings: https://www.figma.com/settings (under Personal access tokens)
