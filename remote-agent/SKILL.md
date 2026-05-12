---
name: remote-agent
description: VM0 remote-agent CLI for delegating work to an already linked local
  Codex or Claude host. Use when an agent should list remote-agent hosts or run
  tasks through `npx -p @vm0/cli zero remote-agent`.
---

# VM0 Remote Agent

Remote-agent lets this agent submit a prompt to an already linked machine running Codex or Claude Code. Use this skill when the current sandbox is not the right execution environment: for example, the task needs a user's local repo, local credentials, a long-running local agent CLI, or a specific workstation that has been registered as a remote-agent host.

Use the `zero remote-agent` entry point for agent-side operations:

```bash
npx -y -p @vm0/cli zero remote-agent <command>
```

The `-y` flag avoids npm's package-install prompt. Omit it only when an interactive install prompt is desired.

## Prerequisites

Authentication is required. The CLI reads tokens in this order: `ZERO_TOKEN`, `VM0_TOKEN`, then the local `~/.vm0/config.json` created by `vm0 auth login`.

If no token is available in the environment, authenticate with:

```bash
npx -y -p @vm0/cli vm0 auth login
```

`zero remote-agent` can list hosts and submit jobs only. It does not start or delete hosts. If there is no online host, ask the user or host operator to start one on the intended machine:

```bash
npx -y -p @vm0/cli vm0 remote-agent start \
  --name "<host-name>" \
  --workdir "<absolute-workdir>" \
  --backend codex \
  --permission-mode workspace-write
```

Host setup options are intentionally on the `vm0 remote-agent` command, not `zero remote-agent`.

Supported host backends are `codex` and `claude-code`. Codex permission modes are `default`, `read-only`, `workspace-write`, `danger-full-access`, and `bypassPermissions`. Claude Code permission modes are `default`, `acceptEdits`, `auto`, `dontAsk`, `plan`, and `bypassPermissions`.

## List Hosts

Always list hosts before targeting a specific host:

```bash
npx -y -p @vm0/cli zero remote-agent list
```

The output columns are `HOST ID`, `STATUS`, `BACKENDS`, `LAST SEEN`, and `NAME`. Use only hosts with `STATUS` = `online`.

Important: `run --host` takes the host `NAME`, not the host id. If multiple hosts have the same name, the run will fail as ambiguous.

## Run a Job

Run on any online host:

```bash
npx -y -p @vm0/cli zero remote-agent run "Check the repo status and summarize the current branch."
```

Run on a named host:

```bash
npx -y -p @vm0/cli zero remote-agent run \
  --host "<host-name>" \
  --timeout 3600 \
  "In /path/to/repo, run the tests for package X and report failures with file paths."
```

`--timeout` is seconds and defaults to `7200`. The command queues the job, polls until it finishes or times out, prints the remote output, and exits non-zero if the remote job fails.

For multiline prompts, pass one shell argument:

```bash
prompt=$(cat <<'EOF'
Task: inspect the current checkout and find why the build is failing.

Expected output:
- concise root cause
- exact commands run
- changed files, if any
- remaining risks
EOF
)

npx -y -p @vm0/cli zero remote-agent run --host "<host-name>" --timeout 7200 "$prompt"
```

## Prompting Guidelines

- Include the exact task, expected output, and any relevant repo paths or branches.
- State whether the remote agent may edit files, run tests, install dependencies, or only inspect.
- Do not assume the remote host has the same files as the current sandbox. Include enough context for the host's configured `--workdir`.
- Keep prompts below 60,000 characters.
- Ask for concise output. Remote job output keeps only the latest output up to the CLI limit, so request summaries plus file paths or commands rather than large logs.
- Treat remote-agent as execution on another machine. Do not send secrets or private data unless the task requires it and the user authorized it.

## Troubleshooting

- `Not authenticated`: set `ZERO_TOKEN` or `VM0_TOKEN`, or run `npx -y -p @vm0/cli vm0 auth login`.
- `Remote agent is not enabled`: the account or token lacks remote-agent access.
- `No linked remote-agent host found`: no host has been registered; ask the operator to start one with `vm0 remote-agent start`.
- `No online remote-agent host`: the host daemon stopped or its heartbeat is stale. Hosts are treated as closed after roughly 90 seconds without a heartbeat.
- `Remote-agent host not found`: rerun `list` and use the exact host `NAME`.
- `Multiple remote-agent hosts have this name`: `zero remote-agent run --host` cannot select by id; use a unique host name.
- `Remote-agent job timed out`: rerun with a larger `--timeout` or ask the remote agent to split the work.
