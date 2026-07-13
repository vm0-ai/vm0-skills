---
name: google-forms
description: Google Forms API for creating and editing forms, publishing forms, and reading responses. Use when user mentions "Google Forms", "forms.google.com", surveys, questionnaires, quizzes, or asks to manage form responses.
---

# Google Forms

Use the Google Forms API to create and edit forms, control publishing, and read
submitted responses.

> Official docs: `https://developers.google.com/workspace/forms/api/reference/rest`

## Prerequisites

Connect the **Google Forms** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name GOOGLE_FORMS_TOKEN` or `zero doctor check-connector --url https://forms.googleapis.com/v1/forms/<form-id> --method GET`

## How to Use

Base URL: `https://forms.googleapis.com/v1`

The Forms API does not provide a list endpoint. Get a form ID from a Forms URL
(`https://docs.google.com/forms/d/<form-id>/edit`) or from `forms.create`.

### Get a Form

```bash
curl -s "https://forms.googleapis.com/v1/forms/<form-id>" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" | jq '{formId, info, settings, items, responderUri, revisionId, publishSettings}'
```

### Create an Unpublished Form

The create request accepts only a title and optional document title. Add
questions and settings afterward with `batchUpdate`.

Write to `/tmp/google_forms_request.json`:

```json
{
  "info": {
    "title": "Customer Feedback",
    "documentTitle": "Customer Feedback Responses"
  }
}
```

Then run:

```bash
curl -s -X POST "https://forms.googleapis.com/v1/forms?unpublished=true" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_forms_request.json | jq '.error // {formId, info, responderUri, revisionId, publishSettings}'
```

### Add a Multiple-Choice Question

Write to `/tmp/google_forms_batch_update.json`:

```json
{
  "includeFormInResponse": true,
  "requests": [
    {
      "createItem": {
        "item": {
          "title": "How satisfied are you?",
          "questionItem": {
            "question": {
              "required": true,
              "choiceQuestion": {
                "type": "RADIO",
                "options": [
                  { "value": "Very satisfied" },
                  { "value": "Satisfied" },
                  { "value": "Neutral" },
                  { "value": "Dissatisfied" }
                ],
                "shuffle": false
              }
            }
          }
        },
        "location": {
          "index": 0
        }
      }
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://forms.googleapis.com/v1/forms/<form-id>:batchUpdate" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_forms_batch_update.json | jq '.error // {form: .form, replies: .replies, writeControl: .writeControl}'
```

### Update Form Title and Description

Write to `/tmp/google_forms_batch_update.json`:

```json
{
  "includeFormInResponse": true,
  "requests": [
    {
      "updateFormInfo": {
        "info": {
          "title": "Updated Customer Feedback",
          "description": "Tell us about your latest experience."
        },
        "updateMask": "title,description"
      }
    }
  ]
}
```

Then run:

```bash
curl -s -X POST "https://forms.googleapis.com/v1/forms/<form-id>:batchUpdate" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_forms_batch_update.json | jq '.error // {info: .form.info, writeControl: .writeControl}'
```

### Publish a Form and Accept Responses

Forms created through the API after June 30, 2026 are unpublished by default.
Set both publishing state fields explicitly.

Write to `/tmp/google_forms_publish.json`:

```json
{
  "publishSettings": {
    "publishState": {
      "isPublished": true,
      "isAcceptingResponses": true
    }
  },
  "updateMask": "publishState"
}
```

Then run:

```bash
curl -s -X POST "https://forms.googleapis.com/v1/forms/<form-id>:setPublishSettings" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_forms_publish.json | jq '.error // {formId, publishSettings}'
```

To stop accepting responses without unpublishing the form, set
`isPublished` to `true` and `isAcceptingResponses` to `false`.

### List Form Responses

```bash
curl -s "https://forms.googleapis.com/v1/forms/<form-id>/responses?pageSize=5000" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" | jq '.responses[]? | {responseId, createTime, lastSubmittedTime, respondentEmail, answers}'
```

Use `nextPageToken` as `pageToken` to retrieve another page. The API also
supports RFC 3339 timestamp filters such as `timestamp >= 2026-07-01T00:00:00Z`.

### Get One Response

```bash
curl -s "https://forms.googleapis.com/v1/forms/<form-id>/responses/<response-id>" --header "Authorization: Bearer $GOOGLE_FORMS_TOKEN" | jq '{responseId, createTime, lastSubmittedTime, respondentEmail, answers}'
```

## Guidelines

1. Create the empty form first, then add items and settings through `batchUpdate`.
2. Explicitly publish new forms before sharing their responder URL.
3. Use `writeControl.requiredRevisionId` for edits that must fail instead of overwriting a newer revision.
4. Keep question and response IDs as opaque strings returned by the API.
5. Use `pageToken` to paginate response collections and timestamp filters for incremental reads.
