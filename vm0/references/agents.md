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
bash -c 'curl -s "https://api.vm0.ai/v1/agents/<agent-id>" -H "Authorization: Bearer $VM0_API_KEY"' | jq '{id, name, description, current_version}'
```

Response:

```json
{
  "id": "agt_xxx",
  "name": "my-agent",
  "description": "My agent description",
  "current_version_id": "ver_xxx",
  "current_version": {
    "id": "ver_xxx",
    "agent_id": "agt_xxx",
    "version_number": 1,
    "message": "Initial version",
    "created_by": "user_xxx",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

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
      "message": "Updated configuration",
      "created_by": "user_xxx",
      "created_at": "2024-01-02T00:00:00Z"
    },
    {
      "id": "ver_yyy",
      "agent_id": "agt_xxx",
      "version_number": 1,
      "message": "Initial version",
      "created_by": "user_xxx",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "has_more": false,
    "next_cursor": null
  }
}
```

Docs: https://docs.vm0.ai/docs/reference/api/agents
