---
name: mathpix
description: Mathpix API for converting images, PDFs, and handwriting into LaTeX, Markdown, DOCX, or structured JSON. Use when user mentions "Mathpix", "OCR math", "image to LaTeX", "PDF to docx", or "extract equations".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MATHPIX_APP_KEY` or `zero doctor check-connector --url https://api.mathpix.com/v3/text --method POST`.

## How to Use

Mathpix authenticates with TWO headers on every request:

- `app_id` → `MATHPIX_APP_ID` (variable, not a secret)
- `app_key` → `MATHPIX_APP_KEY` (secret)

The base URL is `https://api.mathpix.com`.

### 1. Convert an image of math to LaTeX + text

Write to `/tmp/mathpix_request.json`:

```json
{
  "src": "https://mathpix.com/examples/equation.png",
  "formats": ["text", "latex_styled"],
  "ocr": ["math", "text"]
}
```

Then run:

```bash
curl -s -X POST "https://api.mathpix.com/v3/text" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/mathpix_request.json
```

### 2. Convert a local image file

```bash
curl -s -X POST "https://api.mathpix.com/v3/text" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY" \
  -F 'options_json={"formats": ["text", "latex_styled"]}' \
  -F "file=@/tmp/equation.png"
```

### 3. Process a PDF (async — submit then poll)

```bash
# Submit
curl -s -X POST "https://api.mathpix.com/v3/pdf" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY" \
  -F 'options_json={"conversion_formats": {"docx": true, "tex.zip": true, "md": true}}' \
  -F "file=@/tmp/paper.pdf"
# Response: { "pdf_id": "..." }

# Poll
curl -s "https://api.mathpix.com/v3/pdf/$PDF_ID" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY"

# Download converted markdown
curl -s "https://api.mathpix.com/v3/pdf/$PDF_ID.md" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY" -o /tmp/paper.md
```

### 4. Strokes (digital ink) to LaTeX

Write to `/tmp/mathpix_request.json`:

```json
{
  "strokes": {
    "strokes": {
      "x": [[10, 20, 30]],
      "y": [[50, 50, 50]]
    }
  },
  "formats": ["latex_styled"]
}
```

Then run:

```bash
curl -s -X POST "https://api.mathpix.com/v3/strokes" \
  -H "app_id: $MATHPIX_APP_ID" \
  -H "app_key: $MATHPIX_APP_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/mathpix_request.json
```

## Guidelines

1. **Two-header auth** — Mathpix is NOT Bearer-style; both `app_id` and `app_key` must be present on every call.
2. **Pick formats up front** — request `text`, `latex_styled`, `mathml`, `html`, or `data` (per-token positions). Each adds to response size.
3. **PDFs are async** — never block on a PDF call; submit, poll every few seconds.
4. **`ocr` array gates content** — `["math"]` skips prose; `["text"]` skips equations; both together is the default for mixed pages.
5. **Confidence scoring** — Mathpix returns `confidence` (0-1) and `confidence_rate` per request; treat < 0.7 as low-quality.
