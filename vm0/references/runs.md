# Runs API Reference

Runs represent agent executions. Create a run to execute an agent with a prompt.

## List Runs

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, status, agent_id}'
```

### Filter by Agent

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs?agent_id=<agent-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data'
```

### Filter by Status

Status values: `pending`, `running`, `completed`, `failed`, `cancelled`

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs?status=running" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data'
```

### Filter by Time

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs?since=2024-01-01T00:00:00Z" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data'
```

Docs: https://docs.vm0.ai/docs/reference/api/runs

## Create Run

Requires `prompt` plus one of: `agent`, `agent_id`, `session_id`, or `checkpoint_id`.

### Basic Run

Write to `/tmp/vm0_request.json`:

```json
{
  "agent": "my-agent",
  "prompt": "Hello, please introduce yourself"
}
```

Then run:

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/runs" -H "Authorization: Bearer $VM0_API_KEY" -H "Content-Type: application/json" -d @/tmp/vm0_request.json' | jq '{id, status}'
```

### Run with Variables and Secrets

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "agent": "my-agent",
  "prompt": "Process the data",
  "variables": {
    "DEBUG": "true",
    "LOG_LEVEL": "info"
  },
  "secrets": {
    "API_KEY": "secret-value"
  }
}
EOF
```

### Run with Volumes and Artifacts

Mount input volumes and output artifacts:

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "agent": "my-agent",
  "prompt": "Process input files and save results",
  "volumes": {
    "input-data": "latest",
    "config-files": "ver_xxx"
  },
  "artifacts": {
    "output-results": "latest"
  }
}
EOF
```

### Continue Session

Continue an existing session:

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "session_id": "ses_xxx",
  "prompt": "Continue with the next step"
}
EOF
```

### Resume from Checkpoint

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "checkpoint_id": "chk_xxx",
  "prompt": "Resume processing"
}
EOF
```

### Specify Agent Version

```bash
curl -s -X POST "https://api.vm0.ai/v1/runs" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "agent": "my-agent",
  "agent_version": "ver_xxx",
  "prompt": "Use specific version"
}
EOF
```

Response (202 Accepted):

```json
{
  "id": "run_xxx",
  "status": "pending",
  "agent_id": "agt_xxx",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Get Run

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, status, output}'
```

Response includes `output` when completed:

```json
{
  "id": "run_xxx",
  "status": "completed",
  "agent_id": "agt_xxx",
  "output": "Agent output text...",
  "created_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:01:00Z"
}
```

## Cancel Run

```bash
bash -c 'curl -s -X POST "https://api.vm0.ai/v1/runs/<run-id>/cancel" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, status}'
```

## Stream Events

Server-Sent Events (SSE) endpoint for real-time updates:

```bash
curl -N "https://api.vm0.ai/v1/runs/<run-id>/events" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Accept: text/event-stream"
```

Event types:
- `status` - Run status changed
- `output` - New output available
- `error` - Error occurred
- `complete` - Run finished
- `heartbeat` - Keep-alive signal

Resume from specific event:

```bash
curl -N "https://api.vm0.ai/v1/runs/<run-id>/events?last_event_id=evt_xxx" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Accept: text/event-stream"
```

> **Note:** For better SSE handling, consider using the `vm0` CLI or a dedicated SSE client library.

Docs: https://docs.vm0.ai/docs/reference/api/runs

## Get Logs

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>/logs" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[]'
```

### Filter by Type

Log types: `all`, `agent`, `system`, `network`

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>/logs?type=agent" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[]'
```

### Filter by Time Range

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>/logs?since=2024-01-01T00:00:00Z&until=2024-01-01T01:00:00Z" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[]'
```

### Sort Order

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>/logs?order=desc" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[]'
```

## Get Metrics

Resource usage statistics:

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/runs/<run-id>/metrics" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{cpu, memory, disk}'
```

Response includes CPU, memory, and disk usage:

```json
{
  "cpu": {
    "usage_percent": 45.2,
    "cores_used": 1.8
  },
  "memory": {
    "used_bytes": 2147483648,
    "limit_bytes": 4294967296
  },
  "disk": {
    "read_bytes": 1048576,
    "write_bytes": 524288
  }
}
```

Docs: https://docs.vm0.ai/docs/reference/api/runs
