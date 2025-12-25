---
name: pdf4me
description: Comprehensive PDF processing API for conversion, merge, split, compress, OCR, and more
vm0_env:
  - PDF4ME_API_KEY
---

# PDF4ME

Comprehensive PDF processing API with 60+ operations: convert, merge, split, compress, OCR, watermark, form filling, digital signatures, and more.

> Official docs: https://dev.pdf4me.com/apiv2/documentation/

---

## When to Use

Use this skill when you need to:

- Convert documents to/from PDF (Word, Excel, PowerPoint, HTML, images)
- Merge multiple PDFs into one
- Split PDF into multiple files
- Compress PDF to reduce file size
- Add watermarks, stamps, page numbers
- Extract text, tables, or images from PDF
- Fill PDF forms programmatically
- OCR scanned documents
- Protect/unlock PDF with password
- Create barcodes and QR codes

---

## Prerequisites

1. Create an account at https://dev.pdf4me.com/
2. Get your API key from https://dev.pdf4me.com/dashboard/#/api-keys/

Set environment variable:

```bash
export PDF4ME_API_KEY="your-api-key-here"
```

---


> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.
> ```bash
> bash -c 'curl -s "https://api.example.com" -H "Authorization: Bearer $API_KEY"' | jq .
> ```

## How to Use

### 1. Convert to PDF

Convert Word, Excel, PowerPoint, images to PDF:

```bash
# Convert a text file to PDF
echo "Hello, PDF4ME!" > /tmp/test.txt
BASE64_CONTENT=$(base64 < /tmp/test.txt)

curl -s -X POST "https://api.pdf4me.com/api/v2/ConvertToPdf" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${BASE64_CONTENT}\",
  \"docName\": \"test.txt\"
  }" | jq -r '.docContent' | base64 -d > /tmp/output.pdf
```

### 2. HTML to PDF

Convert HTML content to PDF:

```bash
HTML_CONTENT=$(echo '<html><body><h1>Hello World</h1><p>This is a test.</p></body></html>' | base64)

curl -s -X POST "https://api.pdf4me.com/api/v2/ConvertHtmlToPdf" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${HTML_CONTENT}\",
  \"docName\": \"test.html\",
  \"layout\": \"Portrait\",
  \"format\": \"A4\"
  }" --output /tmp/from-html.pdf
```

### 3. URL to PDF

Convert a webpage to PDF:

```bash
bash -c 'curl -s -X POST "https://api.pdf4me.com/api/v2/ConvertUrlToPdf" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d '"'"'{
  "webUrl": "https://example.com"
  }'"'"'' > /tmp/webpage.pdf
```

### 4. Merge PDFs

Combine multiple PDFs into one:

```bash
PDF1_BASE64=$(base64 < file1.pdf)
PDF2_BASE64=$(base64 < file2.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/Merge" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": [\"${PDF1_BASE64}\", \"${PDF2_BASE64}\"],
  \"docName\": \"merged.pdf\"
  }" | jq -r '.docContent' | base64 -d > merged.pdf
```

### 5. Split PDF

Split PDF by page ranges:

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/Split" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\",
  \"splitAction\": \"splitAfterPage\",
  \"splitAfterPage\": 2
  }"
```

### 6. Compress PDF

Reduce PDF file size:

```bash
PDF_BASE64=$(base64 < large.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/Compress" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"large.pdf\"
  }" | jq -r '.docContent' | base64 -d > compressed.pdf
```

### 7. PDF to Word

Convert PDF to editable Word document:

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/PdfToWord" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\"
  }" | jq -r '.docContent' | base64 -d > output.docx
```

### 8. PDF to Images

Create thumbnails/images from PDF pages:

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/CreateThumbnail" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\",
  \"imageFormat\": \"png\",
  \"width\": 800
  }"
```

### 9. Add Text Stamp/Watermark

Add text watermark to PDF:

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/TextStamp" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\",
  \"stampText\": \"CONFIDENTIAL\",
  \"pages\": \"all\",
  \"alignX\": \"center\",
  \"alignY\": \"middle\",
  \"alpha\": 0.3
  }" | jq -r '.docContent' | base64 -d > stamped.pdf
```

### 10. OCR - Extract Text from Scanned PDF

Make scanned PDFs searchable:

```bash
PDF_BASE64=$(base64 < scanned.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/PdfOcr" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"scanned.pdf\",
  \"ocrLanguage\": \"eng\"
  }" | jq -r '.docContent' | base64 -d > searchable.pdf
```

### 11. Protect PDF with Password

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/ProtectDocument" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\",
  \"password\": \"secret123\"
  }" | jq -r '.docContent' | base64 -d > protected.pdf
```

### 12. Extract Pages

Extract specific pages from PDF:

```bash
PDF_BASE64=$(base64 < input.pdf)

curl -s -X POST "https://api.pdf4me.com/api/v2/ExtractPages" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d "{
  \"docContent\": \"${PDF_BASE64}\",
  \"docName\": \"input.pdf\",
  \"pageNrs\": [1, 3, 5]
  }" | jq -r '.docContent' | base64 -d > extracted.pdf
```

---

## API Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Convert** | `/api/v2/ConvertToPdf` | Word/Excel/PPT/Image → PDF |
| | `/api/v2/ConvertHtmlToPdf` | HTML → PDF |
| | `/api/v2/UrlToPdf` | URL → PDF |
| | `/api/v2/MarkdownToPdf` | Markdown → PDF |
| | `/api/v2/PdfToWord` | PDF → Word |
| | `/api/v2/PdfToExcel` | PDF → Excel |
| | `/api/v2/PdfToPowerpoint` | PDF → PowerPoint |
| **Merge/Split** | `/api/v2/Merge` | Merge multiple PDFs |
| | `/api/v2/Split` | Split PDF |
| | `/api/v2/ExtractPages` | Extract specific pages |
| **Optimize** | `/api/v2/Compress` | Compress PDF |
| | `/api/v2/Linearize` | Optimize for web |
| **Edit** | `/api/v2/TextStamp` | Add text watermark |
| | `/api/v2/ImageStamp` | Add image watermark |
| | `/api/v2/AddPageNumber` | Add page numbers |
| | `/api/v2/Rotate` | Rotate pages |
| **Extract** | `/api/v2/CreateThumbnail` | PDF → Images |
| | `/api/v2/ExtractResources` | Extract images/fonts |
| | `/api/v2/ExtractTable` | Extract tables |
| **OCR** | `/api/v2/PdfOcr` | OCR scanned PDFs |
| **Security** | `/api/v2/ProtectDocument` | Password protect |
| | `/api/v2/UnlockPdf` | Remove password |
| **Forms** | `/api/v2/FillPdfForm` | Fill form fields |
| | `/api/v2/ExtractFormData` | Extract form data |
| **Barcode** | `/api/v2/CreateBarcode` | Generate barcode |
| | `/api/v2/AddBarcodeToPdf` | Add barcode to PDF |
| | `/api/v2/ReadBarcodeFromPdf` | Read barcode from PDF |

---

## Request Format

All endpoints use POST with JSON body:

```bash
curl -X POST "https://api.pdf4me.com/api/v2/{endpoint}" --header "Authorization: ${PDF4ME_API_KEY}" --header "Content-Type: application/json" -d '{
  "docContent": "base64-encoded-file",
  "docName": "filename.ext",
  ...other parameters
  }'
```

## Response Format

```json
{
  "docContent": "base64-encoded-result",
  "docName": "output.pdf",
  "pageCount": 5
}
```

---

## Guidelines

1. **File Size**: Max 20MB per file (varies by plan)
2. **Base64**: All file content must be base64 encoded
3. **Formats**: Supports PDF, Word, Excel, PowerPoint, HTML, images
4. **OCR Languages**: eng, deu, fra, spa, ita, por, etc.
5. **Rate Limits**: Check your plan at https://dev.pdf4me.com/pricing/
6. **Free Tier**: 50 API calls/month
7. **Postman**: Import from https://dev.pdf4me.com/apiv2/documentation/postman/

---

## Resources

- **API Docs**: https://dev.pdf4me.com/apiv2/documentation/
- **Code Samples**: https://github.com/pdf4me/pdf4me-api-samples
- **Postman Collection**: https://dev.pdf4me.com/apiv2/documentation/postman/
- **Dashboard**: https://dev.pdf4me.com/dashboard/
