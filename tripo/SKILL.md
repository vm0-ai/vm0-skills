---
name: tripo
description: Tripo 3D API for generating 3D models from text or images. Use when the
  user mentions "Tripo", "Tripo 3D", "Tripo3D", "tripo3d.ai", text-to-3D, image-to-3D,
  or wants to generate, refine, texture, or animate a 3D model (mesh, GLB, FBX, USDZ).
---

# Tripo 3D

Tripo (by VAST) turns text prompts and images into high-fidelity 3D models. All
generation is asynchronous: you submit a task, receive a `task_id`, then poll the
task until it finishes and download the result.

> Official docs: `https://platform.tripo3d.ai/docs/introduction`

---

## When to Use

Use this skill when you need to:

- Generate a 3D model from a text prompt (text-to-3D)
- Generate a 3D model from one image or multiple views (image-to-3D, multiview-to-3D)
- Refine a draft model into a higher-quality version
- Re-texture, stylize, convert (GLB/FBX/USDZ), animate, or post-process a model
- Check the account balance (wallet)

---

## Prerequisites

Connect the **Tripo** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The connector injects `TRIPO_API_KEY` (a `tsk_`-prefixed key) and authenticates
every request with `Authorization: Bearer $TRIPO_API_KEY`.

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name TRIPO_API_KEY` or `zero doctor check-connector --url https://api.tripo3d.ai/v2/openapi/wallet --method GET`

Base URL for all endpoints: `https://api.tripo3d.ai/v2/openapi`

---

## How to Use

### 1. Text to 3D Model

Submit the task:

```bash
curl -s -X POST "https://api.tripo3d.ai/v2/openapi/task" --header "Content-Type: application/json" --header "Authorization: Bearer $TRIPO_API_KEY" -d '{"type": "text_to_model", "prompt": "a small cute robot, clean topology"}' | jq '.data.task_id'
```

The response shape is `{"code": 0, "data": {"task_id": "..."}}`. Take the
`task_id` and poll it (see **Polling** below).

Useful optional fields: `model_version` (e.g. `v2.5-20250123`, `v3.0-20250812`),
`negative_prompt`, `texture` (bool), `pbr` (bool), `face_limit` (int).

### 2. Image to 3D Model

First upload the image to get a `file_token`:

```bash
curl -s -X POST "https://api.tripo3d.ai/v2/openapi/upload/sts" --header "Authorization: Bearer $TRIPO_API_KEY" -F "file=@/tmp/input.png" | jq '.data.image_token'
```

Then submit the generation task with that token. Replace `<image-token>`:

```bash
curl -s -X POST "https://api.tripo3d.ai/v2/openapi/task" --header "Content-Type: application/json" --header "Authorization: Bearer $TRIPO_API_KEY" -d '{"type": "image_to_model", "file": {"type": "png", "file_token": "<image-token>"}}' | jq '.data.task_id'
```

`file.type` should match the image format (`png`, `jpg`, `webp`). Suggested
resolution ≥ 256×256.

### 3. Multiview to 3D Model

Provide up to four orthographic views (front, left, back, right) as uploaded
tokens. Use `null` for any view you do not have. Replace the `<*-token>` values:

```bash
curl -s -X POST "https://api.tripo3d.ai/v2/openapi/task" --header "Content-Type: application/json" --header "Authorization: Bearer $TRIPO_API_KEY" -d '{"type": "multiview_to_model", "files": [{"type": "png", "file_token": "<front-token>"}, {"type": "png", "file_token": "<left-token>"}, {"type": "png", "file_token": "<back-token>"}, {"type": "png", "file_token": "<right-token>"}]}' | jq '.data.task_id'
```

### 4. Polling a Task

Replace `<task-id>` with the `task_id` returned from any submit call:

```bash
curl -s "https://api.tripo3d.ai/v2/openapi/task/<task-id>" --header "Authorization: Bearer $TRIPO_API_KEY" | jq '{status: .data.status, progress: .data.progress, model: .data.output.pbr_model}'
```

`status` values: `queued`, `running` (ongoing) → `success`, `failed`, `banned`,
`expired`, `cancelled` (finalized). Poll every few seconds until the status is
finalized. On `success`, `data.output` holds the result URLs.

### 5. Download the Result

> **Important:** output URLs (`model`, `base_model`, `pbr_model`,
> `rendered_image`, etc.) expire **5 minutes** after the task succeeds. Download
> immediately once `status` is `success`. Replace `<model-url>`:

```bash
curl -s -L "<model-url>" -o /tmp/tripo_model.glb
```

### 6. Refine, Texture, Animate, Post-process

These are also tasks; chain them by passing the source task's id. Examples:

- **Refine a draft:** `{"type": "refine_model", "draft_model_task_id": "<task-id>"}`
- **Texture:** `{"type": "texture_model", "original_model_task_id": "<task-id>", "texture": true, "pbr": true}`
- **Animate (rig + retarget):** `{"type": "animate_rig", "original_model_task_id": "<task-id>"}` then `{"type": "animate_retarget", "original_model_task_id": "<rig-task-id>", "animation": "preset:walk"}`
- **Convert / stylize (post-process):** `{"type": "convert_model", "original_model_task_id": "<task-id>", "format": "FBX"}` (formats include `GLTF`, `FBX`, `OBJ`, `STL`, `USDZ`)

Submit each to `POST /task` and poll the same way.

### 7. Check Balance (Wallet)

```bash
curl -s "https://api.tripo3d.ai/v2/openapi/wallet" --header "Authorization: Bearer $TRIPO_API_KEY" | jq '.data'
```

---

## Guidelines

1. **Everything is async** — every generation returns a `task_id`; always poll `GET /task/{task_id}` until `status` is finalized before reading `output`
2. **Download fast** — output URLs expire 5 minutes after success; persist the file immediately
3. **Upload before image input** — `image_to_model` / `multiview_to_model` need a `file_token` from `POST /upload/sts` (or `POST /upload`), not a raw URL
4. **Pick a model version** — omit `model_version` to use the default, or pin a version (e.g. `v3.0-20250812`) for reproducibility; newer versions support more parameters
5. **Status `failed` / `expired`** — retry and report the `task_id` to Tripo support if it recurs; `banned` means the prompt or image violated content policy
6. **Cost** — generation consumes account credits; check `GET /wallet` before large batches and top up in the Tripo billing dashboard
