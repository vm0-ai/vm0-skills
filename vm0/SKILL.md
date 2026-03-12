---
name: vm0
description: VM0 platform API for agents. Use when user mentions "VM0", "vm0 agent",
  "deploy agent", or asks about VM0 platform operations.
vm0_secrets:
  - VM0_TOKEN
---

# VM0 Agent Self-Management

Use this skill to inspect and update the current agent's own configuration — its skills, instructions, and environment variables — by cloning, editing, and redeploying via `vm0 compose`.

> Official docs: https://docs.vm0.ai

---

## When to Use

Use this skill when you need to:

- Understand the current agent's `vm0.yaml` configuration
- Add or remove skills from the current agent
- Update the agent's instructions file
- Change environment variables or secrets references
- Redeploy the agent after configuration changes

---

## vm0.yaml Format

Every agent is defined by a `vm0.yaml` file:

```yaml
version: "1.0"

agents:
  my-agent:
    framework: claude-code
    instructions: AGENTS.md
    skills:
      - https://github.com/vm0-ai/vm0-skills/tree/main/github
      - https://github.com/vm0-ai/vm0-skills/tree/main/slack
    environment:
      SOME_VAR: "literal-value"
      API_KEY: "${{ secrets.API_KEY }}"
      DEBUG: "${{ vars.DEBUG }}"
```

### Fields

| Field | Description |
|-------|-------------|
| `version` | Config version — always `"1.0"` |
| `agents` | Map of agent definitions (key = agent name) |
| `framework` | Agent runtime — use `claude-code` |
| `instructions` | Path to the instructions/system-prompt file (e.g. `AGENTS.md`) |
| `skills` | List of skill URLs to inject into the agent |
| `environment` | Environment variables available at runtime |

### Variable Syntax

| Syntax | When to use |
|--------|-------------|
| `"literal-value"` | Plain non-sensitive config |
| `"${{ secrets.NAME }}"` | Sensitive values (API keys, tokens) |
| `"${{ vars.NAME }}"` | Non-sensitive remote variables |

> **Important:** Each skill's `SKILL.md` declares its own required secrets and vars in the frontmatter (`vm0_secrets` / `vm0_vars`). These are automatically injected when the skill is loaded — do **not** redeclare them in `environment`. Only put entries in `environment` that are specific to this agent and not already covered by a skill's frontmatter.

---

## Finding Skills

Skills come from two marketplaces. Search both when looking for new capabilities.

### 1. skills.sh (33,700+ community skills)

```bash
curl -s "https://skills.sh/api/search?q={keyword}"
```

### 2. vm0-ai/vm0-skills (70+ curated integrations)

Browse at: https://github.com/vm0-ai/vm0-skills

> **Priority rule:** If a skill exists in both marketplaces, prefer the `vm0-ai/vm0-skills` version — it is optimized for VM0 agent workflows and has consistent quality.

### Converting search results to vm0.yaml URLs

Skills are referenced in `vm0.yaml` as GitHub tree URLs:

| Source | URL format |
|--------|------------|
| `vm0-ai/vm0-skills` | `https://github.com/vm0-ai/vm0-skills/tree/main/{skill-name}` |
| `anthropics/skills` | `https://github.com/anthropics/skills/tree/main/skills/{skill-name}` |
| `vercel-labs/agent-skills` | `https://github.com/vercel-labs/agent-skills/tree/main/skills/{skill-name}` |
| Other repos | `https://github.com/{owner}/{repo}/tree/main/skills/{skill-name}` |

### Checking required credentials

After picking a skill, read its `SKILL.md` to see what secrets or vars it needs:

```bash
curl -s "https://raw.githubusercontent.com/vm0-ai/vm0-skills/main/{skill-name}/SKILL.md" | head -20
```

Look for `vm0_secrets` and `vm0_vars` in the frontmatter. Store any missing values before deploying:

```bash
vm0 secret set SKILL_TOKEN --body "value"
```

---

## CLI: clone & compose

### Clone — download current agent config

`vm0 agent clone` downloads a deployed agent's configuration to the local filesystem. It writes `vm0.yaml` and the instructions file (e.g. `AGENTS.md`) to a local directory.

```bash
# Clone into a new subdirectory (directory must not already exist)
vm0 agent clone {agent-name} ./agent-config

# Clone into current directory
vm0 agent clone {agent-name} .
```

What it downloads:
- `vm0.yaml` — the compose configuration
- The instructions file referenced in `vm0.yaml` (e.g. `AGENTS.md`)

> **Note:** Secret values are preserved as `${{ secrets.NAME }}` placeholders — the actual values are never written to disk.

---

### Compose — deploy updated config

`vm0 compose` deploys a `vm0.yaml` to the platform, creating or updating the agent.

```bash
# Deploy with confirmation prompt
vm0 compose vm0.yaml

# Deploy non-interactively (skip confirmation)
vm0 compose vm0.yaml -y
```

If the yaml references secrets that don't yet exist on the platform, `compose` will prompt to set them (use `-y` to skip in automated contexts).

---

## Self-Update Pattern

An agent can modify its own configuration by combining clone → edit → compose. This lets the agent update itself — adding new skills, changing instructions, or updating env vars — without any human intervention.

### 1. Clone own config

```bash
vm0 agent clone {current-agent-name} /tmp/self-config
```

### 2. Inspect current state

```bash
cat /tmp/self-config/vm0.yaml
cat /tmp/self-config/AGENTS.md
```

### 3. Edit vm0.yaml

For example, add a new skill:

```bash
# Edit /tmp/self-config/vm0.yaml to add a skill entry under skills:
#   - https://github.com/vm0-ai/vm0-skills/tree/main/notion
```

Or update the instructions file:

```bash
# Edit /tmp/self-config/AGENTS.md to refine the system prompt
```

### 4. Redeploy

```bash
cd /tmp/self-config
vm0 compose vm0.yaml -y
```

The agent is now updated. The next run will use the new configuration.

---

## Guidelines

1. **Agent name**: When self-updating, the agent name comes from the `agents:` key in `vm0.yaml`. The current agent name is available in the `VM0_AGENT_NAME` environment variable if set.
2. **Clone target must not exist**: `vm0 agent clone` fails if the destination directory already exists. Use a fresh path like `/tmp/self-config` or add a timestamp.
3. **compose -y for automation**: Always pass `-y` when running compose non-interactively to skip confirmation prompts.
4. **Instructions file**: The instructions file path in `vm0.yaml` is relative to the directory where `vm0 compose` is run. Keep both files in the same directory.
5. **Secrets are not cloned**: Secret values are never downloaded — only the `${{ secrets.NAME }}` reference is preserved. Don't try to read secret values from the cloned config.
