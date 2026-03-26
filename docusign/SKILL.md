---
name: docusign
description: DocuSign API for electronic signatures. Use when user mentions "DocuSign",
  "e-signature", "sign document", or "send for signature".
vm0_secrets:
  - DOCUSIGN_TOKEN
---

# DocuSign eSignature API

Create, send, and manage electronic signature envelopes via the DocuSign eSignature REST API v2.1.

> Official docs: `https://developers.docusign.com/docs/esign-rest-api/reference/`

---

## When to Use

Use this skill when you need to:

- Send documents for electronic signature
- Create and manage envelopes
- List and use templates
- Check envelope and recipient status
- Download signed documents

---

## Prerequisites


> **Important:** DocuSign API requires a `base_uri` and `account_id` obtained from the userinfo endpoint. Always call "Get User Info" first to determine the correct base URI and account ID before making API calls.

> **Placeholders:** Values in `<angle-brackets>` like `<envelope-id>` are placeholders. Replace them with actual values when executing.

---

## User Info

### Get User Info

Call this first to obtain the `base_uri` and `account_id` needed for all subsequent API calls.

```bash
curl -s "https://account.docusign.com/oauth/userinfo" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '{sub: .sub, name: .name, email: .email, accounts: [.accounts[] | {account_id, account_name, base_uri, is_default}]}'
```

Use the `base_uri` and `account_id` from the default account (where `is_default` is `true`) for all subsequent API calls. The API base path is `{base_uri}/restapi/v2.1/accounts/{account_id}`.

---

## Envelopes

### List Envelopes

List envelopes from the last 30 days. Replace `<base-uri>` and `<account-id>` with values from userinfo.

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes?from_date=2025-01-01T00:00:00Z&count=10" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '{totalSetSize, envelopes: [.envelopes[]? | {envelopeId, status, emailSubject, sentDateTime}]}'
```

### Get Envelope

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '{envelopeId, status, emailSubject, sentDateTime, completedDateTime}'
```

### Create and Send Envelope

Send a document for signing. First, write the request body to `/tmp/docusign_envelope.json`:

```json
{
  "emailSubject": "Please sign this document",
  "emailBlurb": "Please review and sign the attached document.",
  "status": "sent",
  "recipients": {
    "signers": [
      {
        "email": "<signer-email>",
        "name": "<signer-name>",
        "recipientId": "1",
        "routingOrder": "1",
        "tabs": {
          "signHereTabs": [
            {
              "anchorString": "/sn1/",
              "anchorUnits": "pixels",
              "anchorXOffset": "10",
              "anchorYOffset": "0"
            }
          ]
        }
      }
    ]
  },
  "documents": [
    {
      "documentBase64": "<base64-encoded-document>",
      "name": "Contract.pdf",
      "fileExtension": "pdf",
      "documentId": "1"
    }
  ]
}
```

```bash
curl -s -X POST "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" --header "Content-Type: application/json" -d @/tmp/docusign_envelope.json | jq '{envelopeId, status, statusDateTime, uri}'
```

### Create Draft Envelope

Same as above but set `"status": "created"` in the JSON body to save as draft without sending.

### Void Envelope

Write to `/tmp/docusign_void.json`:

```json
{
  "status": "voided",
  "voidedReason": "Document needs revision"
}
```

```bash
curl -s -X PUT "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" --header "Content-Type: application/json" -d @/tmp/docusign_void.json | jq '{envelopeId, status}'
```

---

## Recipients

### List Envelope Recipients

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>/recipients" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '.signers[] | {recipientId, name, email, status, signedDateTime}'
```

---

## Documents

### List Envelope Documents

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>/documents" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '.envelopeDocuments[] | {documentId, name, type, uri}'
```

### Download Document

Downloads the signed document. Save to a file:

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>/documents/<document-id>" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" --header "Accept: application/pdf" --output /tmp/signed_document.pdf
```

### Download Combined Documents

Download all documents in the envelope as a single PDF:

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes/<envelope-id>/documents/combined" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" --header "Accept: application/pdf" --output /tmp/combined_documents.pdf
```

---

## Templates

### List Templates

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/templates" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '.envelopeTemplates[] | {templateId, name, description, created, lastModified}'
```

### Get Template

```bash
curl -s "<base-uri>/restapi/v2.1/accounts/<account-id>/templates/<template-id>" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" | jq '{templateId, name, description, emailSubject}'
```

### Send Envelope from Template

Write to `/tmp/docusign_template_envelope.json`:

```json
{
  "templateId": "<template-id>",
  "templateRoles": [
    {
      "email": "<signer-email>",
      "name": "<signer-name>",
      "roleName": "<role-name>"
    }
  ],
  "status": "sent"
}
```

```bash
curl -s -X POST "<base-uri>/restapi/v2.1/accounts/<account-id>/envelopes" --header "Authorization: Bearer $(printenv DOCUSIGN_TOKEN)" --header "Content-Type: application/json" -d @/tmp/docusign_template_envelope.json | jq '{envelopeId, status, statusDateTime, uri}'
```

---

## Guidelines

1. Always call the userinfo endpoint first to get the correct `base_uri` and `account_id`.
2. The base URI varies by account (e.g., `https://na1.docusign.net`, `https://eu.docusign.net`). Always use the value from userinfo.
3. Envelope `status` values: `created` (draft), `sent`, `delivered`, `completed`, `declined`, `voided`.
4. When sending documents, Base64-encode the file content for the `documentBase64` field.
5. Use `anchorString` in sign-here tabs to position signature fields relative to text in the document.
6. The `from_date` parameter is required when listing envelopes — use ISO 8601 format.
