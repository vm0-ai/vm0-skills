---
name: jotform
description: JotForm API for form management. Use when user mentions "JotForm", "forms",
  "submissions", or asks about form data.
vm0_secrets:
  - JOTFORM_TOKEN
---

# Jotform API

Use the Jotform API via direct `curl` calls to **manage forms, submissions, questions, webhooks, and account data**.

> Official docs: `https://api.jotform.com/docs/`

---

## When to Use

Use this skill when you need to:

- **List and retrieve forms** from a Jotform account
- **Manage form submissions** (list, create, update, delete)
- **Read and modify form questions** and properties
- **Set up webhooks** for form submission notifications
- **Access user account info** including usage, settings, and folders

---

## Prerequisites

1. Log in to your [Jotform account](https://www.jotform.com/myaccount/api)
2. Navigate to **Settings** > **API**
3. Click **Create New Key**
4. Copy your **API Key**

```bash
export JOTFORM_TOKEN="your-api-key"
```

### API Base URLs

| Region | URL |
|--------|-----|
| Standard | `https://api.jotform.com` |
| EU | `https://eu-api.jotform.com` |
| HIPAA | `https://hipaa-api.jotform.com` |

All examples below use `https://api.jotform.com`. Replace with the appropriate regional URL if needed.

---

> **Important:** When using `$VAR` in a command that pipes to another command, wrap the command containing `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

## How to Use

All examples below assume you have `JOTFORM_TOKEN` set. Authentication uses the `APIKEY` header.

---

### 1. Get User Account Info

Retrieve information about the authenticated user.

```bash
bash -c 'curl -s "https://api.jotform.com/user" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 2. Get Account Usage

Check API usage limits and current consumption.

```bash
bash -c 'curl -s "https://api.jotform.com/user/usage" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 3. List All Forms

Retrieve all forms in the account. Supports pagination with `limit` and `offset`.

```bash
bash -c 'curl -s "https://api.jotform.com/user/forms?limit=20&offset=0" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content[] | {id, title, status, created_at}'
```

Filter forms by status:

```bash
bash -c 'curl -s "https://api.jotform.com/user/forms?limit=20&filter=%7B%22status%3Ane%22%3A%22DELETED%22%7D" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content[] | {id, title, status}'
```

---

### 4. Get Form Details

Retrieve details for a specific form. Replace `FORM_ID` with the actual form ID.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 5. Get Form Questions

List all questions (fields) in a form.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/questions" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

Get a specific question by ID:

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/question/QUESTION_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 6. List Form Submissions

Get submissions for a specific form. Supports `limit`, `offset`, `orderby`, and `filter`.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/submissions?limit=20&offset=0&orderby=created_at" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content[] | {id, created_at, status}'
```

---

### 7. Get a Single Submission

Retrieve details for a specific submission.

```bash
bash -c 'curl -s "https://api.jotform.com/submission/SUBMISSION_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 8. Create a Submission

Submit new data to a form. Field keys follow the format `submission[QUESTION_ID]`.

```bash
bash -c 'curl -s -X POST "https://api.jotform.com/form/FORM_ID/submissions" --header "APIKEY: $JOTFORM_TOKEN" -d "submission[1]=John" -d "submission[2]=Doe" -d "submission[3]=john@example.com"' | jq .
```

---

### 9. Update a Submission

Edit an existing submission.

```bash
bash -c 'curl -s -X POST "https://api.jotform.com/submission/SUBMISSION_ID" --header "APIKEY: $JOTFORM_TOKEN" -d "submission[1]=Jane" -d "submission[2]=Smith"' | jq .
```

---

### 10. Delete a Submission

Delete a submission by ID.

```bash
bash -c 'curl -s -X DELETE "https://api.jotform.com/submission/SUBMISSION_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 11. Get Form Properties

Retrieve all properties of a form (title, colors, fonts, etc.).

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/properties" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

Get a specific property:

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/properties/PROPERTY_KEY" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 12. List Form Webhooks

Get all webhooks configured for a form.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/webhooks" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 13. Create a Webhook

Add a webhook URL to receive form submission notifications.

```bash
bash -c 'curl -s -X POST "https://api.jotform.com/form/FORM_ID/webhooks" --header "APIKEY: $JOTFORM_TOKEN" -d "webhookURL=https://example.com/webhook"' | jq .
```

---

### 14. Delete a Webhook

Remove a webhook from a form.

```bash
bash -c 'curl -s -X DELETE "https://api.jotform.com/form/FORM_ID/webhooks/WEBHOOK_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 15. List Form Files

Get all files uploaded through a form.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/files" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 16. Clone a Form

Create a copy of an existing form.

```bash
bash -c 'curl -s -X POST "https://api.jotform.com/form/FORM_ID/clone" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 17. Delete a Form

Delete a form by ID.

```bash
bash -c 'curl -s -X DELETE "https://api.jotform.com/form/FORM_ID" --header "APIKEY: $JOTFORM_TOKEN"' | jq .
```

---

### 18. List User Folders

Get all folders in the account.

```bash
bash -c 'curl -s "https://api.jotform.com/user/folders" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

### 19. Get All User Submissions

Retrieve all submissions across all forms.

```bash
bash -c 'curl -s "https://api.jotform.com/user/submissions?limit=20&offset=0" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content[] | {id, form_id, created_at, status}'
```

---

### 20. Get Form Reports

List all reports for a form.

```bash
bash -c 'curl -s "https://api.jotform.com/form/FORM_ID/reports" --header "APIKEY: $JOTFORM_TOKEN"' | jq '.content'
```

---

## Guidelines

1. **Authentication**: Use the `APIKEY` header for all requests. Do not pass the API key as a URL parameter in production
2. **Pagination**: Use `limit` and `offset` query parameters to paginate large result sets. Default limit varies by endpoint
3. **Filtering**: Use the `filter` query parameter with URL-encoded JSON for advanced filtering (e.g., `filter={"status:ne":"DELETED"}`)
4. **Regional URLs**: Use `eu-api.jotform.com` for EU accounts or `hipaa-api.jotform.com` for HIPAA-compliant accounts
5. **Submission field keys**: When creating or updating submissions, field keys use the format `submission[QUESTION_ID]` where the question ID comes from the form questions endpoint
6. **Response format**: All responses return JSON with a `responseCode` (200 for success) and `content` field containing the data
7. **Rate limits**: Jotform enforces API rate limits based on your plan. Monitor the response headers for rate limit information
8. **Form IDs**: Form IDs are numeric. You can find them in the form URL or by listing all forms
