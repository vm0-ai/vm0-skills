---
name: reducto
description: Reducto API for parsing, OCR, and chunking PDFs, scans, and complex documents into structured JSON or markdown. Use when user mentions "Reducto", "parse PDF", "OCR", "document extraction", or wants structured output from a messy file.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name REDUCTO_TOKEN` or `zero doctor check-connector --url https://platform.reducto.ai/parse --method POST`.

## How to Use

Reducto authenticates with a Bearer token. The base URL is
`https://platform.reducto.ai`. Most flows upload a file (or pass a URL),
get back a structured document, optionally then chunk it for RAG.

### 1. Parse a public PDF URL

Write to `/tmp/reducto_request.json`:

```json
{
  "document_url": "https://arxiv.org/pdf/1706.03762.pdf",
  "options": {
    "ocr_mode": "agentic",
    "extraction_mode": "ocr"
  }
}
```

Then run:

```bash
curl -s -X POST "https://platform.reducto.ai/parse" \
  -H "Authorization: Bearer $REDUCTO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/reducto_request.json
```

### 2. Upload + parse a local file

```bash
# Step 1: upload
UPLOAD=$(curl -s -X POST "https://platform.reducto.ai/upload" \
  -H "Authorization: Bearer $REDUCTO_TOKEN" \
  -F "file=@/tmp/contract.pdf")
PRESIGNED=$(echo "$UPLOAD" | jq -r '.presigned_url')

# Step 2: parse using the presigned URL Reducto returned
cat > /tmp/reducto_request.json <<EOF
{"document_url": "$PRESIGNED"}
EOF

curl -s -X POST "https://platform.reducto.ai/parse" \
  -H "Authorization: Bearer $REDUCTO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/reducto_request.json
```

### 3. Chunk a parsed document for RAG

Write to `/tmp/reducto_request.json`:

```json
{
  "document_url": "https://arxiv.org/pdf/1706.03762.pdf",
  "options": {
    "chunking": {
      "chunk_mode": "section",
      "chunk_size": 1024
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://platform.reducto.ai/parse" \
  -H "Authorization: Bearer $REDUCTO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/reducto_request.json
```

### 4. Structured extraction with a schema

Write to `/tmp/reducto_request.json`:

```json
{
  "document_url": "https://example.com/invoice.pdf",
  "schema": {
    "type": "object",
    "properties": {
      "invoice_number": {"type": "string"},
      "total_amount": {"type": "number"},
      "line_items": {"type": "array"}
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://platform.reducto.ai/extract" \
  -H "Authorization: Bearer $REDUCTO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @/tmp/reducto_request.json
```

## Guidelines

1. **Pick the right mode** — `ocr_mode: agentic` is the most accurate for scans/handwriting; `standard` is faster and cheaper for clean PDFs.
2. **Chunk mode** — `section` (semantic), `page` (page-bounded), or `variable` (token-based) — pick based on your RAG strategy.
3. **`extract` vs `parse`** — `extract` requires a `schema` and returns typed JSON; `parse` returns the whole document as markdown + JSON.
4. **Async for big docs** — anything > 50 pages should use the async job endpoint; poll the `job_id`.
5. **Multilingual works** — Reducto handles CJK, Arabic, and Cyrillic out of the box.
