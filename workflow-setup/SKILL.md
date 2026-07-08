---
name: workflow-setup
description: Set up and manage Zero workflows and workflow automations through the Zero CLI. Use when the user asks to create, edit, inspect, run, schedule, trigger, enable, disable, copy, or delete a workflow or automation; wants to modify, refine, improve, optimize, or update an existing workflow; or asks for help with workflow/trigger setup. Also use when the user describes a recurring or event-driven task without saying "workflow" — for example running something on a schedule or every morning/day/week, doing something when a new email, message, label, webhook, GitHub event, or calendar event arrives, "whenever X happens", monitoring or watching for something, reminding on a cadence, or keeping data in sync automatically. Keep this generic to all workflow trigger kinds; do not trigger only on a specific connector or event source.
---

# Zero Workflow Setup

Use this skill to help users create and manage Zero workflows and their
automations. A workflow is the reusable SOP/skill body. An automation is a
trigger attached to a workflow. The CLI represents automations as
`zero workflow trigger ...`; the user-facing conversation should usually call
them "automations" or "triggers" in plain language, not CLI objects.

Prefer workflow triggers over legacy automations unless the user explicitly asks
for the old automation system.

Run Zero CLI commands as:

```bash
npx -p @vm0/cli zero <command>
```

If `zero` is already installed in the environment, `zero <command>` is also
fine.

## User Experience Contract

Hide implementation details by default. Do not show raw commands, workflow IDs,
trigger IDs, cron expressions, JSON configs, webhook signing material, or
verification output unless the user asks for technical details, auditability, or
debugging context.

Speak in terms the user understands:

- "workflow" = the reusable instructions or SOP.
- "automation" = when and how that workflow should run automatically.
- "trigger" = the condition that starts the automation.
- "run now" = manually start the workflow once.
- "pause" / "turn back on" = disable / enable the automation while preserving
  its settings.

Default to a requirements-first conversation. Ask only for missing information
needed for the next action, and keep questions short. Prefer one question with
2-4 concrete choices over a generic template.

Good user-facing questions:

- "What should this workflow do each time it runs?"
- "When should it run: on a schedule, every few minutes, when an email arrives,
  when a Gmail label is applied, from a webhook, from a GitHub label, or when a
  calendar event is created?"
- "Should it only draft changes, or is it allowed to send messages / edit data /
  create issues?"
- "Do you want this paused for now, or enabled immediately after I create it?"

Avoid user-facing phrasing like:

- "Give me the cron expression."
- "Which workflow ID should I use?"
- "Should I call `zero workflow trigger add`?"
- "Send me the JSON config."

## Product Model

Follow the Automation x Workflow model:

- A workflow is a pure definition: name, description, instructions, optional
  supplementary files, and the agent that owns it.
- A workflow does not run automatically by itself.
- An automation is one trigger attached to one workflow.
- A workflow can have zero or more automations.
- Editing the instructions means editing the workflow.
- Editing schedule, email matching, labels, webhook, enable/disable, or delete
  means managing the automation/trigger.

When a user says "make this automatic", "set this to run every day", "notify me
when...", or "turn this workflow into an automation", create or update a trigger
on a workflow.

When a user says "save these steps", "create a workflow", "make a reusable SOP",
"edit the instructions", or "use this template", create or edit a workflow.

## Fast Path

1. Identify whether the request is about the workflow body, an automation, or
   both.
2. If the request mentions an existing workflow by name, list workflows when
   needed to resolve the name. If ambiguous, ask the user to choose by friendly
   name/description, not by ID.
3. If creating an automation and no suitable workflow exists, offer to create
   one with Zero first, then attach the automation.
4. Collect the minimum missing requirements in natural language.
5. Execute the Zero CLI command(s) in the background.
6. Verify with `workflow view` and/or `workflow trigger list` after create or
   update operations.
7. Report the result in plain language, including what will happen next and any
   safety limits. Keep technical IDs out of the normal response.

Do not inspect connector authorization or request permissions as part of the
default setup path. If the command reports connector authorization or permission
failure, stop the blocked action and use the relevant connector doctor or
permission flow requested by the platform instructions.

## Creation Flows

### Create Workflow With Zero

Use this when the user wants a new reusable workflow, has no suitable workflow
for an automation, or chooses "Create with Zero".

Collect:

- The workflow's job: what it should do when run.
- Inputs or sources it should use.
- Output or final deliverable.
- Allowed side effects.
- Any approval gates, safety limits, or recipients.
- Whether it should be enabled automatically later, and on what trigger.

Then draft concise workflow instructions and create the workflow:

```bash
zero workflow create <name> --agent <agent-id> --display-name "<display name>" --description "<description>" --instruction "<workflow instructions>"
```

Use `--instruction-file <path>` for longer instructions. Use `--dir <path>` only
for supplementary files. Never include a root `SKILL.md` in `--dir`; the workflow
upload synthesizes it from workflow metadata and instruction.

After creation, stay in the conversation. Say that the workflow has been saved
and offer the natural next action, such as setting when it should run.

### Save Conversation As Workflow

Use this when the user wants to preserve steps from a completed conversation.

Summarize the actual steps into reusable instructions, ask the user to confirm or
adjust the name/instructions, then create a workflow under the current agent
unless they specify another agent.

Do not add a trigger unless the user explicitly asks to automate it.

### Create Automation For Existing Workflow

Use this when the user wants a workflow to run automatically.

Collect:

- Which workflow should be automated.
- The trigger type and required trigger settings.
- Whether to enable it immediately.
- Whether the workflow is allowed to send messages, modify systems, spend money,
  delete data, or contact customers.

Check existing triggers for that workflow before creating a new one. If a similar
automation already exists, ask whether to keep both, update the existing one, or
disable the old one.

### Template Or Uploaded Workflow

If the user starts from a template or uploaded file, treat the source as a draft
for workflow instructions. Confirm the workflow name, job, and safety limits
before creating it. Do not expose file packaging details unless import fails.

## Trigger Requirement Mapping

Map friendly trigger choices to CLI kinds:

- Fixed schedule -> `cron`
- One-time scheduled run -> `once`
- Fixed interval -> `loop`
- Web trigger -> `webhook`
- New email -> `gmail-new-message`
- Email label -> `gmail-label-applied`
- GitHub label -> `github-label-applied`
- New Google Calendar event -> `google-calendar-event-created`

### Fixed Schedule

Ask for cadence, wall-clock time, timezone, and business-day assumptions. Convert
the answer to a cron expression yourself. If the user says "daily" and their
timezone is known from context, use it. If timezone is missing and timing matters,
ask.

Command shape:

```bash
zero workflow trigger add <workflow> cron --expr "0 9 * * *" -z Asia/Shanghai
zero workflow trigger update <trigger-id> --expr "0 9 * * *" -z Asia/Shanghai
```

### One-Time Scheduled Run

Use this when the user wants it to run once at a future time, not recur.

Ask for the exact date, time, and timezone. If the user uses relative wording
such as "tomorrow", resolve it to a concrete date in the final confirmation.

Command shape:

```bash
zero workflow trigger add <workflow> once --at "2026-06-10T09:00" -z Asia/Shanghai
zero workflow trigger update <trigger-id> --at "2026-06-10T09:00" -z UTC
```

### Fixed Interval

Ask for the interval in natural language. Convert it to a CLI duration such as
`15m`, `1h`, or `90s`.

Command shape:

```bash
zero workflow trigger add <workflow> loop --every 15m
zero workflow trigger update <trigger-id> --every 10m
```

### New Email

Ask what incoming Gmail messages should match. Supported natural-language fields
are sender, recipient, cc, subject, and body. Avoid matching every inbound email
unless the user explicitly confirms that broad scope.

For simple matching, use flags:

```bash
zero workflow trigger add <workflow> gmail-new-message --from-contains "@example.com"
zero workflow trigger add <workflow> gmail-new-message --subject-contains "invoice"
```

For complex matching, create a temporary config file and pass `--config`. The
config must be a JSON object with a top-level `match` object. Supported fields:
`from`, `subject`, `body`, `to`, `cc`. Supported matchers: `contains`,
`containsAny`, `doesNotContain`, `doesNotContainAny`.

### Email Label

Ask only for missing details:

1. Which exact Gmail label should trigger the workflow?
2. What should happen when that label is applied?
3. What side effects are allowed?
4. If the label does not exist, may it be created?

Before adding the trigger, check whether the Gmail label exists. If it is missing
and the user already allowed creation, create the label first, then add the
trigger. If creation was not approved, stop and ask. This avoids creating a
workflow, failing the trigger bind, then doing a label-creation retry.

Command shape:

```bash
zero workflow trigger add <workflow> gmail-label-applied --label "Support"
zero workflow trigger update <trigger-id> --label "Support"
```

### Web Trigger

Ask who or what will call the webhook, what payload shape they expect to send,
and whether they can store and sign with the webhook secret.

After creating the trigger, preserve the creation output because the signing
secret is printed only once. In the normal user response, share only the webhook
URL and say that signing details are available if they need to wire it up. If the
user is the implementer and asks for details, provide the signing instructions
without exposing the secret to channels where it does not belong.

Command shape:

```bash
zero workflow trigger add <workflow> webhook
```

### GitHub Label

Ask for the GitHub label, whether it should apply to issues, pull requests, or
both, and whether only the user's own label actions should count or anyone's.

Command shape:

```bash
zero workflow trigger add <workflow> github-label-applied --label "triage" --subject both --actor me
zero workflow trigger update <trigger-id> --label "triage" --subject pull-requests --actor anyone
```

GitHub label triggers require the GitHub App installation in the workspace. If
the command fails for authorization, use the GitHub connector doctor flow instead
of guessing.

### Google Calendar Event Created

Ask which calendar should be watched. Default to the primary calendar only when
the user's wording clearly implies their own main calendar.

Command shape:

```bash
zero workflow trigger add <workflow> google-calendar-event-created --calendar-id primary
```

Current CLI behavior does not support updating this trigger kind. If the user
wants to change the calendar, create a replacement trigger and remove/disable the
old one only with user approval.

## Management Flows

### Inspect

Use:

```bash
zero workflow list
zero workflow list --agent <agent-id>
zero workflow view <workflow-id>
zero workflow trigger list <workflow>
zero workflow trigger show <trigger-id>
```

Summarize in product language: what the workflow does, whether it has
automations, when it next runs, whether it is enabled, and what it is allowed to
do.

### Edit Workflow Instructions

When the user asks to change what the workflow does, edit the workflow
instruction:

```bash
zero workflow edit <workflow-id> --instruction-file ./instruction.md
zero workflow edit <workflow-id> --display-name "<name>" --description "<text>"
```

Ask for confirmation before making changes that broaden side effects.

### Edit Automation

When the user asks to change when or how it runs, update the trigger. Keep the
conversation inline: ask for the new schedule, interval, label, email matching,
GitHub matching, or replacement behavior, then run the update command.

Do not imply that workflow instructions changed when only the trigger changed.

### Run Now

When the user wants to test or manually run once:

```bash
zero workflow run <workflow-id>
```

Tell the user it has started in a new thread. Include the log command only when
they ask for technical details or progress debugging.

### Pause Or Resume

Use disable/enable for an automation. This preserves its settings:

```bash
zero workflow trigger disable <trigger-id>
zero workflow trigger enable <trigger-id>
```

Ask before pausing broad or business-critical automations if the impact is not
obvious.

### Delete

Only delete a workflow or trigger when the user explicitly asks and confirms the
target.

Use trigger removal when deleting one automation:

```bash
zero workflow trigger remove <trigger-id>
```

Use workflow deletion when deleting the workflow itself:

```bash
zero workflow delete <workflow-id> -y
```

Explain the effect in plain language: deleting an automation stops that one
automatic run path; deleting a workflow removes the reusable SOP and its attached
triggers.

### Copy Or Fork

Only copy/fork a workflow when the user asks to reuse it on another agent:

```bash
zero workflow copy <workflow-id> --to-agent <agent-id>
```

Tell the user the workflow has been copied to the target agent.

### Run History

If the user asks for run history, first inspect the trigger details for last run
and next run. If they need full execution logs, use the available logs/search
tooling with a known run ID or relevant workflow context. Do not claim full
history is available from `zero workflow trigger` if the CLI only returns summary
fields.

## Safety Rules

- Ask before enabling or testing workflows that send external messages, modify
  production systems, spend money, delete data, or contact customers.
- Do not silently create recurring triggers when the user only asked to discuss
  an automation.
- For broad triggers, say the scope plainly, e.g. "This would run for every
  incoming email. Should I narrow it down?"
- Treat webhook secrets as sensitive. Preserve the creation output, but do not
  expose full secrets in normal responses unless the user explicitly needs the
  creation-time secret.
- Disable or remove triggers only when the user explicitly approves that action.
- Do not fork/copy a workflow unless the user explicitly asks to copy, fork,
  move, or reuse an existing workflow on another agent.

## Verification

After creating or updating a workflow:

```bash
zero workflow view <workflow-id>
```

After creating, updating, enabling, disabling, or removing a trigger:

```bash
zero workflow trigger list <workflow-id>
zero workflow trigger show <trigger-id>
```

Keep verification output internal unless the user needs technical detail.

## Final Response Defaults

Default final response:

- State the outcome in plain language.
- Name the workflow and the automation behavior.
- Mention enabled/paused status.
- Mention important safety behavior, such as "draft only, never sends".
- Tell the user the natural next action, such as applying a Gmail label or using
  the webhook URL.

Do not include workflow IDs, trigger IDs, raw commands, cron expressions, JSON,
or check lists by default.

Technical final response format, when needed:

- Workflow: name and id.
- Automation/trigger: kind, id, enabled status, and match/schedule summary.
- Checks run: list/view/trigger list/show.
- Blockers: missing user criteria, command failure, or permission denial.
