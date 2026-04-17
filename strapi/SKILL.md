---
name: strapi
description: Strapi CMS REST API for headless content management. Use when user mentions
  "Strapi", "CMS", "content types", "entries", or managing headless CMS content.
vm0_env:
  - STRAPI_TOKEN
  - STRAPI_BASE_URL
---

# Strapi CMS API

Use the Strapi REST API via direct `curl` calls to **manage content types, entries, and media** on your Strapi instance.

> Official docs: `https://docs.strapi.io/cms/api/rest`

---

## When to Use

Use this skill when you need to:

- **Manage content entries** — create, read, update, delete entries in any content type
- **Query and filter content** — search, sort, paginate, and filter entries
- **Upload media** — upload files and images to the Strapi media library
- **Discover schema** — find out what content types exist and their fields

---

## Prerequisites

Connect the **Strapi CMS API** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name - STRAPI_TOKEN` or `zero doctor check-connector --url https://docs.strapi.io/cms/api/rest --method GET`

## IMPORTANT: Discovery Workflow

**Before performing any content operations, always discover the user's content types first.** Every Strapi instance has different content types, fields, and relationships. Never assume what types exist.

### Step 1: Discover Content Types

```bash
curl -s "$STRAPI_BASE_URL/api/content-type-builder/content-types" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq '[.data[] | select(.schema.visible != false) | {uid: .uid, name: .schema.displayName, kind: .schema.kind, attributes: [.schema.attributes | to_entries[] | {name: .key, type: .value.type, required: .value.required}]}]'
```

This returns all content types with their fields. Key properties:

- `uid`: The unique identifier (e.g., `api::article.article`)
- `kind`: Either `collectionType` (multiple entries) or `singleType` (one entry)
- `attributes`: Fields with their types (`string`, `richtext`, `media`, `relation`, `enumeration`, etc.)

### Step 2: Identify the API ID

The API endpoint path is derived from the content type's plural name. For `api::article.article`, the endpoint is `/api/articles`. Common pattern:

- Collection type `article` → `GET /api/articles`
- Single type `homepage` → `GET /api/homepage`

If unsure, check the content type info from Step 1 — the `uid` follows the pattern `api::{singularName}.{singularName}`.

### Step 3: Proceed with Operations

Once you know the content types and their fields, proceed with the appropriate CRUD operations below.

---

## Collection Types (Multiple Entries)

### List Entries

```bash
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

### List with Pagination, Sort, and Filter

```bash
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID?pagination[page]=1&pagination[pageSize]=25&sort=createdAt:desc&filters[fieldName][\$eq]=value" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

### Get Single Entry

```bash
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

### Get Entry with Relations Populated

Use `populate` to include related data:

```bash
# Populate all first-level relations
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID?populate=*" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .

# Populate specific relations
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID?populate[0]=category&populate[1]=author" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .

# Deep populate nested relations
curl -s "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID?populate[author][populate]=avatar" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

### Create Entry

Write to `/tmp/strapi_request.json`:

```json
{
  "data": {
    "title": "My New Entry",
    "description": "Entry content here",
    "category": 1
  }
}
```

Then run:

```bash
curl -s -X POST "$STRAPI_BASE_URL/api/PLURAL_API_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/strapi_request.json | jq .
```

### Update Entry

Write to `/tmp/strapi_request.json`:

```json
{
  "data": {
    "title": "Updated Title"
  }
}
```

Then run:

```bash
curl -s -X PUT "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/strapi_request.json | jq .
```

### Delete Entry

```bash
curl -s -X DELETE "$STRAPI_BASE_URL/api/PLURAL_API_ID/DOCUMENT_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

---

## Single Types (One Entry)

### Get Single Type

```bash
curl -s "$STRAPI_BASE_URL/api/SINGULAR_API_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

### Update Single Type

Write to `/tmp/strapi_request.json`:

```json
{
  "data": {
    "title": "Updated Homepage Title",
    "seo": {
      "metaTitle": "Home",
      "metaDescription": "Welcome"
    }
  }
}
```

Then run:

```bash
curl -s -X PUT "$STRAPI_BASE_URL/api/SINGULAR_API_ID" \
  --header "Authorization: Bearer $STRAPI_TOKEN" \
  --header "Content-Type: application/json" \
  -d @/tmp/strapi_request.json | jq .
```

---

## Media Upload

### Upload a File

```bash
curl -s -X POST "$STRAPI_BASE_URL/api/upload" \
  --header "Authorization: Bearer $STRAPI_TOKEN" \
  -F "files=@/path/to/file.jpg" | jq '.[0] | {id, name, url, mime}'
```

### Upload and Attach to Entry

```bash
curl -s -X POST "$STRAPI_BASE_URL/api/upload" \
  --header "Authorization: Bearer $STRAPI_TOKEN" \
  -F "files=@/path/to/image.jpg" \
  -F "ref=api::article.article" \
  -F "refId=DOCUMENT_ID" \
  -F "field=cover" | jq .
```

---

## Filtering Reference

Strapi uses operator-based filtering:

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `filters[title][$eq]=Hello` |
| `$ne` | Not equal | `filters[title][$ne]=Hello` |
| `$lt` | Less than | `filters[price][$lt]=100` |
| `$lte` | Less than or equal | `filters[price][$lte]=100` |
| `$gt` | Greater than | `filters[price][$gt]=50` |
| `$gte` | Greater than or equal | `filters[price][$gte]=50` |
| `$in` | In array | `filters[id][$in][0]=1&filters[id][$in][1]=2` |
| `$contains` | Contains (case-sensitive) | `filters[title][$contains]=word` |
| `$containsi` | Contains (case-insensitive) | `filters[title][$containsi]=word` |
| `$startsWith` | Starts with | `filters[title][$startsWith]=He` |
| `$null` | Is null | `filters[image][$null]=true` |
| `$notNull` | Is not null | `filters[image][$notNull]=true` |

### Combining Filters

```bash
# AND: multiple filters on different fields
curl -s "$STRAPI_BASE_URL/api/articles?filters[status][\$eq]=published&filters[category][\$eq]=news" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .

# OR: use $or operator
curl -s "$STRAPI_BASE_URL/api/articles?filters[\$or][0][status][\$eq]=published&filters[\$or][1][status][\$eq]=draft" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

---

## Pagination

```bash
# Page-based (default)
curl -s "$STRAPI_BASE_URL/api/articles?pagination[page]=1&pagination[pageSize]=25" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq '.meta.pagination'

# Offset-based
curl -s "$STRAPI_BASE_URL/api/articles?pagination[start]=0&pagination[limit]=25" \
  --header "Authorization: Bearer $STRAPI_TOKEN" | jq .
```

Response includes pagination metadata:

```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

---

## Guidelines

1. **Always discover first**: Run the content type discovery endpoint before performing operations — never guess content type names or field names
2. **Wrap data in `data` key**: All create and update payloads must wrap the fields in a `data` object
3. **Use `populate` for relations**: By default, relations are not included in responses. Use `populate=*` for all first-level relations, or specify specific fields
4. **Check response format**: Successful responses return `{ data: { id, attributes, ... }, meta: { ... } }`
5. **Error format**: Errors return `{ error: { status, name, message, details } }`
6. **API token scope**: The operations available depend on the token type (Full Access, Read-Only, or Custom permissions per content type)
7. **Document IDs**: Strapi v5 uses document IDs (not numeric IDs) for CRUD operations
8. **Sort syntax**: Use `sort=field:asc` or `sort=field:desc`. Multiple sorts: `sort[0]=field1:asc&sort[1]=field2:desc`

---

## API Reference

- REST API: `https://docs.strapi.io/cms/api/rest`
- Filtering: `https://docs.strapi.io/cms/api/rest/filters-locale-publication`
- Population: `https://docs.strapi.io/cms/api/rest/populate-select`
- API Tokens: `https://docs.strapi.io/cms/features/api-tokens`
