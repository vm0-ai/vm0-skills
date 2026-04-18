---
name: dropbox-sign
description: Dropbox Sign (formerly HelloSign) API for electronic signatures. Use when user mentions "Dropbox Sign", "HelloSign", "e-signature", "send for signature", or "signature request".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DROPBOX_SIGN_TOKEN` or `zero doctor check-connector --url https://api.hellosign.com/v3/account --method GET`

## Authentication

Dropbox Sign uses HTTP Basic Auth with the API key as the **username** and an empty password. All curl examples below pass the token via `-u "$DROPBOX_SIGN_TOKEN:"` (note the trailing colon — it supplies the blank password).

## Test Mode

For development, append `test_mode=1` to every write request (the Dropbox Sign API accepts the form field on `send`, `send_with_template`, `create_embedded`, etc.). Test-mode signature requests are free and non-legally-binding — use them when wiring up or testing flows. To run in production mode, omit the field (defaults to production).

## Account

### Get Account Info

Verifies auth and returns the account email, plan quotas, and callback URL.

```bash
curl -s "https://api.hellosign.com/v3/account" -u "$DROPBOX_SIGN_TOKEN:" | jq '.account | {account_id, email_address, quotas, callback_url}'
```

## Signature Requests

### Send Signature Request (File Upload)

Send a document for signing. The body is multipart/form-data. Replace the local PDF path and signer fields as needed. Remove `test_mode=1` for production.

```bash
curl -s -X POST "https://api.hellosign.com/v3/signature_request/send" -u "$DROPBOX_SIGN_TOKEN:" -F "title=NDA Agreement" -F "subject=Please sign this NDA" -F "message=Please review and sign at your earliest convenience." -F "signers[0][email_address]=signer@example.com" -F "signers[0][name]=Jane Signer" -F "file[0]=@/tmp/contract.pdf" -F "test_mode=1" | jq '.signature_request | {signature_request_id, title, is_complete, signatures: [.signatures[] | {signature_id, signer_email_address, status_code}]}'
```

### Send Signature Request (File URL)

Provide a publicly reachable PDF URL instead of uploading the file.

```bash
curl -s -X POST "https://api.hellosign.com/v3/signature_request/send" -u "$DROPBOX_SIGN_TOKEN:" -F "title=NDA Agreement" -F "subject=Please sign" -F "signers[0][email_address]=signer@example.com" -F "signers[0][name]=Jane Signer" -F "file_url[0]=https://example.com/contract.pdf" -F "test_mode=1" | jq '.signature_request | {signature_request_id, title, is_complete}'
```

### Send with Template

Send a request from a saved reusable template. Replace `<template-id>` with the template ID obtained from `GET /v3/template/list`.

```bash
curl -s -X POST "https://api.hellosign.com/v3/signature_request/send_with_template" -u "$DROPBOX_SIGN_TOKEN:" -F "template_ids[0]=<template-id>" -F "subject=Please sign this contract" -F "signers[Client][name]=Jane Signer" -F "signers[Client][email_address]=signer@example.com" -F "test_mode=1" | jq '.signature_request | {signature_request_id, title, signatures: [.signatures[] | {signature_id, signer_role, signer_email_address, status_code}]}'
```

The `signers[Client]` key uses the template's role name (e.g. `Client`, `Manager`). Inspect the template to confirm role names before sending.

### Get Signature Request

Poll for status. Replace `<signature-request-id>` with the ID from the send response.

```bash
curl -s "https://api.hellosign.com/v3/signature_request/<signature-request-id>" -u "$DROPBOX_SIGN_TOKEN:" | jq '.signature_request | {signature_request_id, title, is_complete, is_declined, signatures: [.signatures[] | {signature_id, signer_email_address, status_code, signed_at}]}'
```

Useful `status_code` values: `awaiting_signature`, `signed`, `declined`, `on_hold`, `error_unknown`.

### List Signature Requests

```bash
curl -s "https://api.hellosign.com/v3/signature_request/list?page=1&page_size=20" -u "$DROPBOX_SIGN_TOKEN:" | jq '{list_info, requests: [.signature_requests[] | {signature_request_id, title, is_complete, created_at}]}'
```

Add `query=` to filter. Example: `?query=subject:Contract+complete:false`.

### Cancel Signature Request

Cancels an incomplete signature request (emails a cancellation notice to the signers).

```bash
curl -s -X POST "https://api.hellosign.com/v3/signature_request/cancel/<signature-request-id>" -u "$DROPBOX_SIGN_TOKEN:"
```

A successful cancel returns HTTP 200 with an empty body.

### Send Reminder

Resend the signing email to a specific signer on an open request.

```bash
curl -s -X POST "https://api.hellosign.com/v3/signature_request/remind/<signature-request-id>" -u "$DROPBOX_SIGN_TOKEN:" -F "email_address=signer@example.com" | jq '.signature_request | {signature_request_id, signatures: [.signatures[] | {signer_email_address, last_reminded_at}]}'
```

## Files

### Download Signed Files

Download the final signed PDF. Use `file_type=pdf` for a flat PDF or `file_type=zip` for all documents as a ZIP.

```bash
curl -s "https://api.hellosign.com/v3/signature_request/files/<signature-request-id>?file_type=pdf" -u "$DROPBOX_SIGN_TOKEN:" --output /tmp/signed_document.pdf
```

### Get Signed File Download URL

Returns a short-lived S3 URL instead of the binary — useful when you want to share the link rather than download the bytes.

```bash
curl -s "https://api.hellosign.com/v3/signature_request/files/<signature-request-id>?get_url=1&file_type=pdf" -u "$DROPBOX_SIGN_TOKEN:" | jq '{file_url, expires_at}'
```

## Templates

### List Templates

```bash
curl -s "https://api.hellosign.com/v3/template/list?page=1&page_size=20" -u "$DROPBOX_SIGN_TOKEN:" | jq '{list_info, templates: [.templates[] | {template_id, title, message, signer_roles: [.signer_roles[].name]}]}'
```

### Get Template

```bash
curl -s "https://api.hellosign.com/v3/template/<template-id>" -u "$DROPBOX_SIGN_TOKEN:" | jq '.template | {template_id, title, message, signer_roles: [.signer_roles[].name], custom_fields: [.custom_fields[] | {name, type, required}]}'
```

## Common Status Codes

| `status_code` | Meaning |
|---|---|
| `awaiting_signature` | Signer has not yet signed |
| `signed` | Signer has signed |
| `declined` | Signer declined to sign |
| `on_hold` | Blocked by a prior signer in the signing order |
| `error_unknown` | Dropbox Sign could not deliver the request |

## Guidelines

1. **Always include `test_mode=1` while developing.** Test-mode requests are free, do not email real recipients with legally binding documents, and are clearly marked as "TEST MODE" in the signing UI. Remove the flag only once you are ready to send a real signature request.
2. **Auth is Basic with an empty password.** Pass `-u "$DROPBOX_SIGN_TOKEN:"` (trailing colon matters). Do not send `Authorization: Bearer ...` — it will be rejected.
3. **Bodies are `multipart/form-data`, not JSON.** Use `-F` for every field; arrays use indexed keys like `signers[0][name]`. Nested objects use the same bracket syntax (`form_fields_per_document[0][0][type]=text`).
4. **Signing order:** add `signers[0][order]=0`, `signers[1][order]=1` to require sequential signing.
5. **Use templates for repeated contracts.** Create the template once in the Dropbox Sign UI, then send via `send_with_template` — it's faster and lets non-technical teammates edit the document layout.
6. **Poll `GET /signature_request/{id}` or configure a callback URL.** The API supports webhook callbacks for `signature_request_signed`, `signature_request_all_signed`, etc. — far cheaper than polling.
7. **Signed file URLs from `get_url=1` expire quickly** (typically within a few minutes). Download immediately or regenerate on demand.
