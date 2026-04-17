---
name: manus
description: Manus API for AI agent task execution. Use when user mentions "Manus", "run an agent task", "AI agent", or needs to automate multi-step research, analysis, or content tasks via Manus.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MANUS_TOKEN` or `zero doctor check-connector --url https://api.manus.ai/v2/task.detail?task_id= --method GET`

## Tasks

### Create a Task

Write to `/tmp/manus_task.json`:

```json
{
  "message": {
    "content": [
      {
        "type": "text",
        "text": "<your task prompt>"
      }
    ]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/task.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_task.json
```

Response includes `task_id` and `task_url` to track the task.

### Create a Task with Options

Write to `/tmp/manus_task.json`:

```json
{
  "message": {
    "content": [
      {
        "type": "text",
        "text": "<your task prompt>"
      }
    ]
  },
  "title": "<custom task title>",
  "locale": "en",
  "agent_profile": "manus-1.6",
  "share_visibility": "private",
  "interactive_mode": false
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/task.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_task.json
```

**`agent_profile` options:**
- `manus-1.6` — default, balanced performance
- `manus-1.6-lite` — faster, lower cost
- `manus-1.6-max` — highest quality, more thorough

### Create a Task with File Attachments

First upload the file (see Files section), then include the `file_id` in the task:

Write to `/tmp/manus_task.json`:

```json
{
  "message": {
    "content": [
      {
        "type": "text",
        "text": "<your task prompt>"
      },
      {
        "type": "file",
        "file_id": "<your-file-id>"
      }
    ]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/task.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_task.json
```

### Create a Task in a Project

Write to `/tmp/manus_task.json`:

```json
{
  "project_id": "<your-project-id>",
  "message": {
    "content": [
      {
        "type": "text",
        "text": "<your task prompt>"
      }
    ]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/task.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_task.json
```

### Create a Task with Connectors

Pass connector UUIDs from your Manus integrations page to give the agent access to external tools (Gmail, Notion, Google Calendar, etc.):

Write to `/tmp/manus_task.json`:

```json
{
  "message": {
    "content": [
      {
        "type": "text",
        "text": "<your task prompt>"
      }
    ],
    "connectors": ["<connector-uuid-1>", "<connector-uuid-2>"]
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/task.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_task.json
```

### Get Task Detail

Replace `<task-id>` with the `task_id` from the create response:

```bash
curl -s "https://api.manus.ai/v2/task.detail?task_id=<task-id>" --header "x-manus-api-key: $MANUS_TOKEN"
```

Response includes `status`, `credit_usage`, and `task_url`. Poll this endpoint to track task completion.

**Task status values:** `pending`, `running`, `completed`, `failed`, `cancelled`

## Projects

### Create a Project

Write to `/tmp/manus_project.json`:

```json
{
  "name": "<project name>",
  "instruction": "<default instruction applied to all tasks in this project>"
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/project.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_project.json
```

Response includes `project.id` — use this as `project_id` when creating tasks.

### List Projects

```bash
curl -s "https://api.manus.ai/v2/project.list" --header "x-manus-api-key: $MANUS_TOKEN"
```

## Files

Files are uploaded in two steps: first request a presigned upload URL, then PUT the file content to that URL. Files expire 48 hours after upload.

### Step 1 — Request Upload URL

Write to `/tmp/manus_file_upload.json`:

```json
{
  "filename": "<your-filename.pdf>"
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/file.upload" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_file_upload.json
```

The response contains `file.id` and `upload_url` (valid for 3 minutes).

### Step 2 — Upload File Content

Replace `<presigned-upload-url>` with the `upload_url` from Step 1:

```bash
curl -s -X PUT "<presigned-upload-url>" --header "Content-Type: application/octet-stream" --data-binary @/path/to/your/file.pdf
```

### Get File Detail

Check the file status before attaching it to a task. Only files with `status: uploaded` can be used:

```bash
curl -s "https://api.manus.ai/v2/file.detail?file_id=<file-id>" --header "x-manus-api-key: $MANUS_TOKEN"
```

## Webhooks

Webhooks deliver async task status updates to your HTTPS endpoint. Manus sends a POST request with the task result when the task completes or changes state.

### Create a Webhook

The endpoint URL must be publicly accessible and return a 2xx response:

Write to `/tmp/manus_webhook.json`:

```json
{
  "url": "https://your-endpoint.example.com/webhook"
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/webhook.create" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_webhook.json
```

Response includes `webhook.id` — save this to delete the webhook later.

### Delete a Webhook

Write to `/tmp/manus_webhook_delete.json`:

```json
{
  "webhook_id": "<your-webhook-id>"
}
```

Then run:

```bash
curl -s -X POST "https://api.manus.ai/v2/webhook.delete" --header "x-manus-api-key: $MANUS_TOKEN" --header "Content-Type: application/json" -d @/tmp/manus_webhook_delete.json
```

## API Parameters Reference

### task.create Body

| Parameter | Type | Required | Description |
|---|---|---|---|
| `message` | object | Yes | Task prompt and configuration |
| `message.content` | array | Yes | Array of content parts (text, file, voice) |
| `message.connectors` | string[] | No | Connector UUIDs to enable |
| `message.enable_skills` | string[] | No | Skill IDs available to the agent |
| `message.force_skills` | string[] | No | Skill IDs the agent must invoke |
| `project_id` | string | No | Associates task with a project |
| `title` | string | No | Custom task title |
| `locale` | string | No | Output language (e.g. `en`, `zh-CN`) |
| `agent_profile` | enum | No | `manus-1.6`, `manus-1.6-lite`, `manus-1.6-max` |
| `interactive_mode` | boolean | No | Allow agent to ask follow-up questions |
| `share_visibility` | enum | No | `private`, `team`, or `public` |
| `hide_in_task_list` | boolean | No | Hide from webapp task list |

## Guidelines

1. **Polling**: Tasks are asynchronous. Poll `task.detail` until `status` is `completed` or `failed`. For production use, prefer webhooks.
2. **File expiry**: Uploaded files expire after 48 hours — upload just before task creation.
3. **Presigned URL expiry**: The `upload_url` from `file.upload` expires in 3 minutes — PUT the file immediately after receiving it.
4. **Rate limits**: 10 requests per second per API key.
5. **Credits**: Tasks consume credits based on complexity. Use `manus-1.6-lite` to reduce cost for simple tasks.
6. **Projects**: Use projects to apply shared instructions to groups of related tasks.

## API Reference

- API Reference: https://open.manus.im/docs/api-reference
- Manus Dashboard: https://manus.im
- Integration Settings: https://manus.im/settings/integration