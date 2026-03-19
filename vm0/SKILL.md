---
name: vm0
description: VM0 platform API for agents. Use when user mentions "VM0", "vm0 agent",
  "deploy agent", "create agent", "self update", "update myself", "add skill",
  "remove skill", "connect to Gmail", "connect to Slack", "connect to Dropbox",
  "access my Gmail", "access my calendar", or asks about VM0 platform operations,
  agent configuration, connecting/integrating with external services, or
  "connect to {service}" / "access my {service}" patterns for SaaS integrations.
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

## Operation: Self Update

**Usage:** `self update` or `update myself` or similar

This operation enables the agent to update itself based on user requirements.

### Step 1: Understand the current agent

Use `vm0 whoami` to learn the current agent's name, then clone it to /tmp to work with its current configuration:

```bash
# Use npx to run vm0 commands without installation
npx -y @vm0/cli agent clone <agent-name> /tmp/<agent-name>

cat /tmp/<agent-name>/AGENTS.md
cat /tmp/<agent-name>/vm0.yaml
```

### Step 2: Understand User Intent

Ask clarifying questions to understand what the user wants to update:

- What new operation should be added?
- What existing operation needs modification?
- What skills need to be added/removed?
- What configuration changes are needed?

### Step 3: Reference Documentation (if needed)

If unsure about file formats, check the official documentation https://docs.vm0.ai/docs/reference/configuration/vm0-yaml

Key vm0.yaml fields:

- `version`: Configuration version (currently "1.0")
- `agents`: Map of agent definitions
  - `framework`: Agent framework (claude-code)
  - `instructions`: Path to AGENTS.md
  - `skills`: List of skill URLs
  - `environment`: Environment variables

### Step 4: Modify Configuration Files

Based on user requirements, modify the appropriate files:

**For AGENTS.md changes:**

- Add new operation sections following the existing format
- Update existing operations as needed
- Ensure consistent markdown formatting

**For vm0.yaml changes:**

- Add/remove skills from the skills list

### Step 5: Compose the Agent

Deploy the updated configuration:

```bash
cd /tmp/<agent-name>
npx -y @vm0/cli compose vm0.yaml
```

Note: `npx -y @vm0/cli compose` is idempotent. If configuration hasn't changed, the version hash stays the same.

---

## Operation: SaaS/Service Connection

**Usage:** `connect to Gmail`, `access my Dropbox`, `integrate with Slack`, or similar

This operation helps the user connect external SaaS services to their agent.

### Step 1: Check existing skills

First, follow the Self Update workflow (Steps 1) to clone the agent and inspect its `vm0.yaml`. Check if the requested service skill is already in the `skills` list.

### Step 2: If skill exists

Proceed with the standard connection flow — guide the user to `https://app.vm0.ai/team/<agent-name>` for connector setup.

### Step 3: If skill not found

Search for it in the `vm0-ai/vm0-skills` repository:

```bash
# List available skills in the official repository
gh api repos/vm0-ai/vm0-skills/contents --jq '.[].name' | grep -i {service-name}
```

### Step 4: If found in vm0-skills

Add the skill to the agent's `vm0.yaml` using the Self Update workflow (Steps 4–5), then guide the user to `https://app.vm0.ai/team/<agent-name>` for connector setup.

### Step 5: If not found anywhere

Inform the user: "This service is not supported yet. Please check the [vm0-ai/vm0-skills repository](https://github.com/vm0-ai/vm0-skills) for available integrations or request a new skill."

**Note:** Available skills can be browsed at https://github.com/vm0-ai/vm0-skills

---

## Guidelines

1. **Agent name**: When self-updating, the agent name comes from the `agents:` key in `vm0.yaml`. The current agent name is available in the `VM0_AGENT_NAME` environment variable if set.
2. **Clone target must not exist**: `vm0 agent clone` fails if the destination directory already exists. Use a fresh path like `/tmp/self-config` or add a timestamp.
3. **compose -y for automation**: Always pass `-y` when running compose non-interactively to skip confirmation prompts.
4. **Instructions file**: The instructions file path in `vm0.yaml` is relative to the directory where `vm0 compose` is run. Keep both files in the same directory.
5. **Secrets are not cloned**: Secret values are never downloaded — only the `${{ secrets.NAME }}` reference is preserved. Don't try to read secret values from the cloned config.
