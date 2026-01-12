# Agents API Reference

Agents are AI agent configurations that can be executed as runs. Each agent has versioned configurations.

## List Agents

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/agents" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, name, current_version_id}'
```

### Filter by Name

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/agents?name=my-agent" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data'
```

### Pagination

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/agents?limit=10&cursor=<cursor>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{data, pagination}'
```

Docs: https://docs.vm0.ai/docs/reference/api/agents

## Get Agent

Replace `<agent-id>` with your agent ID:

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/agents/<agent-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, config}'
```

Response:

```json
{
  "id": "agt_xxx",
  "name": "my-agent",
  "current_version_id": "ver_xxx",
  "config": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Create Agent

Agent names must be:
- 1-100 characters
- Lowercase alphanumeric with hyphens
- No leading/trailing hyphens

```bash
curl -s -X POST "https://api.vm0.ai/v1/agents" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "name": "my-new-agent",
  "config": {
    "image": "vm0/claude-code:latest",
    "resources": {
      "cpu": 2,
      "memory": "4Gi"
    }
  }
}
EOF
```

Docs: https://docs.vm0.ai/docs/reference/api/agents

## Update Agent

Updates create a new version automatically:

```bash
curl -s -X PUT "https://api.vm0.ai/v1/agents/<agent-id>" \
  -H "Authorization: Bearer $VM0_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "config": {
    "image": "vm0/claude-code:latest",
    "resources": {
      "cpu": 4,
      "memory": "8Gi"
    }
  }
}
EOF
```

## Delete Agent

```bash
curl -s -X DELETE "https://api.vm0.ai/v1/agents/<agent-id>" -H "Authorization: Bearer $VM0_API_KEY"
```

Returns `204 No Content` on success.

## List Agent Versions

```bash
bash -c 'curl -s "https://api.vm0.ai/v1/agents/<agent-id>/versions" -H "Authorization: Bearer $VM0_API_KEY"' | jq '.data[] | {id, version_number, created_at}'
```

Response:

```json
{
  "data": [
    {
      "id": "ver_xxx",
      "agent_id": "agt_xxx",
      "version_number": 2,
      "config": { ... },
      "created_at": "2024-01-02T00:00:00Z"
    },
    {
      "id": "ver_yyy",
      "agent_id": "agt_xxx",
      "version_number": 1,
      "config": { ... },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

Docs: https://docs.vm0.ai/docs/reference/api/agents
