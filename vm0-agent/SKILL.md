---
name: vm0-agent
description: Build and deploy AI agents using VM0's agent-native infrastructure. This skill guides you through the complete agent creation workflow - from understanding requirements to deployment and scheduling.
vm0_secrets:
  - VM0_API_KEY
---

# About VM0

VM0 is an agent-native cloud infrastructure platform that provides secure sandbox environments for AI agents like Claude Code. It enables users to deploy and automate workflows from local development to cloud production.

## What VM0 Provides

**Execution Infrastructure**: VM0 provides the runtime environment - it does NOT provide AI capabilities itself. The AI intelligence comes from coding agents like Claude Code. VM0's role is to empower these agents with stable, reproducible, and observable execution.

**Key Capabilities**:

- **Stateful Agent Sessions**: Preserve memory, reasoning context, and session continuity across executions
- **Checkpoint & Replay**: Snapshot every run for debugging, forking, and reproducibility
- **70+ Pre-built Skills**: Integrations with GitHub, Slack, Notion, Perplexity, and more via https://github.com/vm0-ai/vm0-skills
- **Observable Execution**: Real-time logs, metrics, and tool calls for complete visibility
- **Versioned Storage**: Volumes (input) and Artifacts (output) synced between sandbox and cloud
- **Natural Language Configuration**: Define workflows in markdown (AGENTS.md, SKILL.md) instead of code

## Platform Architecture

- **Instructions (AGENTS.md)**: Natural language workflow definitions
- **Volumes**: Input file storage agents can read from
- **Artifacts**: Output file storage for agent results
- **Environment Variables**: Secure credential and secret management

## From Local to Cloud

VM0 bridges the gap between local agent development and cloud automation. Develop workflows locally with Claude Code, then deploy them to VM0 for:

- Scheduled execution (daily, weekly, on-demand)
- Reliable automation without keeping your laptop running
- Team collaboration with shared agents and outputs
- Production-grade observability and debugging

# Operation: create

When the user uses /vm0-agent create, enter this workflow

This is an interactive agent creation workflow. To avoid deviating from the workflow path, you first need to create a todo.md in the temporary directory like /tmp to track the entire process, and update this todo.md after each user interaction

The initial content of todo.md is as follows

```markdown
- [ ] research: intent analysis, understand what the user wants the Agent to help them do
- [ ] innovate: propose solutions based on intent analysis
- [ ] compose: create the vm0 agent
- [ ] token collect: guide the user to complete the various tokens needed for the agent
- [ ] test run: run the agent and confirm with the user if the results are satisfactory
- [ ] schedule: guide the user to set up scheduled tasks

## Research

In this step, interactively ask the user what they want to do. Use the ask user tools to ask questions at each step. You can start with the first question: "In your daily work, what routine information processing tasks would you like me to help automate?"

- Option 1: I read some blogs every day, so I want an information processing workflow, such as reading blogs and then sending me summaries
- Option 2: I want to understand the quality of my code repository, so I want a workflow that can help me regularly check code repository changes and tell me the code quality based on my defined Code Review rules
- Option 3: ...

After the user answers the question, use 1-5 questions to refine it, such as which blogs to get information from, where the code repository is, etc. When designing these questions, guide the user to think in terms of a three-step workflow: Fetch / Process / Output. Finally, form a three-step workflow

## Innovate

In this step, refine the technical details in the user's workflow. This step requires understanding the various SaaS capabilities under https://github.com/vm0-ai/vm0-skills to help users generate a vm0.yaml and AGENTS.md for use in vm0

Give the user several options for confirmation using the ask user tools. Users can also add more information. This process can be repeated several times

## Compose

- [ ] Based on the conclusions from innovate, create vm0.yaml and AGENTS.md
- [ ] Use the capabilities of vm0-skills to compose the agent

## Token Collect

- [ ] For each skill used and each secret used in vm0.yaml, you can learn how to obtain it from the corresponding skill or search online, and guide the user to get the token
- [ ] Confirm that the user has provided each token, and record these tokens in the .env.local file as TOKEN=value

## Test run

- [ ] Explain in advance that the run may take a relatively long time, 1-20 minutes
- [ ] Use the vm0-cli skill capabilities to run the agent with cook, using --env-file=.env.local to pass the token
- [ ] If the workflow writes files to the workspace, explain to the user where and how to view the artifact
- [ ] Explain to the user what command cook executed, and introduce the CLI capabilities of vm0
- [ ] Ask the user if the results meet expectations and what needs further adjustment. If the user wants adjustments, update the entire todo.md as it may need to return to the Research phase. However, starting over should also be based on previously discussed information and the vm0.yaml / AGENTS.md in the current project

## Schedule

Enter this phase when the user is satisfied with the test run results

- [ ] Use the vm-cli skill capabilities to guide the user to set up scheduled tasks
- [ ] After successful setup, ask the user if they want to enable the timer
- [ ] Explain to the user the schedule-related capabilities in vm0 cli, such as how to list, disable, and enable scheduled tasks
```

# AGENTS.md

AGENTS.md is used to describe a workflow. It is an ordinary, natural language-described process document. Avoid describing technical details in AGENTS.md, such as not writing scripts or other code in AGENTS.md

# vm0.yaml

Go to https://docs.vm0.ai/docs/reference/configuration/vm0-yaml to learn about technical details
