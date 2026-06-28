---
name: workflow-setup
description: Set up and manage Zero workflows and workflow triggers through the Zero CLI. Use when the user asks to create, edit, inspect, run, schedule, trigger, enable, disable, or delete a workflow, or asks for help with `zero workflow` / `zero workflow trigger` commands. Keep this generic to all workflow trigger kinds; do not trigger only on a specific connector or event source.
---

# Zero Workflow Setup

Use the Zero CLI to create and manage durable workflows and workflow triggers.
Focus on the user's desired automation, then map it to `zero workflow` and
`zero workflow trigger` commands.

Run Zero CLI commands as:

```bash
npx -p @vm0/cli zero <command>
```

If `zero` is already installed in the environment, `zero <command>` is also
fine.

## Fast Path

1. Clarify the workflow objective and trigger when they are missing.
2. Check existing workflows before creating a new one:
   ```bash
   zero workflow list
   zero workflow list --agent <agent-id>
   ```
3. Create or edit the workflow definition.
4. Add or update the workflow trigger.
5. Verify with `workflow view` and `workflow trigger list`.
6. Report the workflow id, trigger id, trigger summary, and any blocker.

Do not inspect connector authorization or request permissions as part of the
default setup path. If the workflow run later fails with a permission denial,
then use the connector-specific doctor flow requested by the platform
instructions.

## Questions To Ask

Ask only for missing information needed to execute the next command:

- Workflow: create a new workflow, edit an existing workflow, or inspect one?
- Agent: which agent should host it? Default to `$ZERO_AGENT_ID` when the user
  does not specify another agent.
- Definition: workflow name, display name, description, and instruction text.
- Trigger: trigger kind and the required parameters for that kind.
- Replacement: if an existing trigger appears to cover the same event, ask
  whether to keep both, disable the old trigger, or update it.

Do not fork/copy a workflow unless the user explicitly asks to copy, fork, move,
or reuse an existing workflow on another agent. The normal setup path is
`workflow create` or `workflow edit`, then `workflow trigger add` or
`workflow trigger update`.

## Workflow Commands

List visible workflows:

```bash
zero workflow list
zero workflow list --agent <agent-id>
```

Create a workflow:

```bash
zero workflow create <name> \
  --agent <agent-id> \
  --display-name "<display name>" \
  --description "<description>" \
  --instruction "<workflow instructions>"
```

Use `--instruction-file <path>` for longer instructions. Use `--dir <path>` only
for supplementary workflow files; do not include a root `SKILL.md` in that
directory because workflow upload synthesizes it from workflow metadata and
instruction.

Edit a workflow:

```bash
zero workflow edit <workflow-id> --instruction-file ./instruction.md
zero workflow edit <workflow-id> --display-name "<name>" --description "<text>"
```

Inspect or run a workflow:

```bash
zero workflow view <workflow-id>
zero workflow run <workflow-id>
```

Delete a workflow only when the user explicitly asks:

```bash
zero workflow delete <workflow-id> -y
```

## Trigger Commands

Always check the current CLI help for the latest trigger kinds and options:

```bash
zero workflow trigger --help
zero workflow trigger add --help
zero workflow trigger update --help
```

Current trigger kinds include:

- `cron`: scheduled by cron expression.
- `once`: one-time run at an ISO timestamp.
- `loop`: repeated interval such as `15m`, `1h`, or `90s`.
- `gmail-new-message`: inbound Gmail message match rules.
- `gmail-label-applied`: Gmail label applied event.
- `webhook`: externally invoked webhook trigger.

Add triggers:

```bash
zero workflow trigger add <workflow> cron --expr "0 9 * * *" -z Asia/Shanghai
zero workflow trigger add <workflow> once --at "2026-06-10T09:00" -z UTC
zero workflow trigger add <workflow> loop --every 15m
zero workflow trigger add <workflow> webhook
```

For trigger kinds with match criteria, prefer explicit criteria from the user.
If no criteria are provided and the CLI says that means "match all", call that
out before creating the trigger.

Examples for Gmail trigger criteria, when the user chooses a Gmail trigger:

```bash
zero workflow trigger add <workflow> gmail-new-message --from-contains "@example.com"
zero workflow trigger add <workflow> gmail-new-message --subject-contains "invoice"
zero workflow trigger add <workflow> gmail-new-message --config ./gmail-trigger.json
zero workflow trigger add <workflow> gmail-label-applied --label "Support"
```

Manage triggers:

```bash
zero workflow trigger list <workflow>
zero workflow trigger show <trigger-id>
zero workflow trigger update <trigger-id> --every 10m
zero workflow trigger disable <trigger-id>
zero workflow trigger enable <trigger-id>
zero workflow trigger remove <trigger-id>
```

Disable or remove triggers only when the user explicitly approves that action.

## Verification

After creating or updating a workflow:

```bash
zero workflow view <workflow-id>
zero workflow trigger list <workflow-id>
```

For webhook triggers, preserve the creation output because the signing secret is
printed only once.

Final response format:

- Workflow: name and id.
- Trigger: kind, id, enabled status, and match/schedule summary.
- Checks run: list/view/trigger list.
- Blockers: missing user criteria, command failure, or permission denial.
