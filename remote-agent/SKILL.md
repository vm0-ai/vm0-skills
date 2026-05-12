---
name: remote-agent
description: VM0 remote-agent CLI for delegating work to an already linked local
  Codex or Claude host. Use when an agent should list remote-agent hosts or run
  tasks through `npx -p @vm0/cli zero remote-agent`.
---

# VM0 Remote Agent

Remote-agent lets this agent submit a natural-language job to a remote-agent host that is already available in VM0. The host runs Codex or Claude Code in its configured environment, then returns the result to the current agent.

Use it when the current sandbox is not the right execution environment, such as when the task needs a user's local repo, local files, local tools, or a specific workstation.

```bash
npx -y -p @vm0/cli zero remote-agent <command>
```

`-y` avoids npm's install prompt. Use `npx -p @vm0/cli ...` without `-y` only when an interactive prompt is acceptable.

## List Hosts

List remote-agent hosts only when the user asks to see hosts, when they ask to
choose between hosts, or when an explicit host reference is ambiguous:

```bash
npx -y -p @vm0/cli zero remote-agent list
```

The output columns are:

- `HOST ID`: host identifier shown for reference
- `STATUS`: `online` hosts can accept jobs; `closed` hosts cannot
- `BACKENDS`: supported agent backend, such as `codex` or `claude-code`
- `LAST SEEN`: how recently the host checked in
- `NAME`: the host name used by `run --host`

Important: `run --host` takes the host `NAME`, not the host id. If multiple hosts have the same name, the run will fail as ambiguous.

## Run a Job

When the user invokes `/remote-agent <task>`:

- If they explicitly name a host, run the task with `--host "<host-name>"`.
- If they do not specify a host, do not list hosts first; run directly on any online host.
- Treat everything after `/remote-agent` as the remote job prompt, preserving the user's intent.

Run on any online host:

```bash
npx -y -p @vm0/cli zero remote-agent run "Check the repo status and summarize the current branch."
```

Run on a specific host by name:

```bash
npx -y -p @vm0/cli zero remote-agent run \
  --host "<host-name>" \
  --timeout 3600 \
  "In /path/to/repo, run the tests for package X and report failures with file paths."
```

Options:

- `--host <name>`: send the job to a named host from `zero remote-agent list`
- `--timeout <seconds>`: maximum time to wait; defaults to `7200`

The command queues the job, polls until it finishes or times out, prints the remote output, and exits non-zero if the remote job fails.

## Inspect Runs

Use run inspection commands when the user asks for previous remote-agent jobs,
when `run` times out, or when you need to check a job without re-running it.

List recent remote-agent runs:

```bash
npx -y -p @vm0/cli zero remote-agent runs list
```

Useful filters:

```bash
npx -y -p @vm0/cli zero remote-agent runs list --status running
npx -y -p @vm0/cli zero remote-agent runs list --host "<host-name>" --limit 10
npx -y -p @vm0/cli zero remote-agent runs list --json
```

The list output shows job id, status, host, backend, creation time, and a prompt
preview. Use the job id for status and result lookups.

Check one job's status:

```bash
npx -y -p @vm0/cli zero remote-agent runs status <job-id>
```

Print one job's final result:

```bash
npx -y -p @vm0/cli zero remote-agent runs result <job-id>
```

`runs result` prints successful job output to stdout. For failed jobs it prints
the remote error and exits non-zero. For queued or running jobs, use `runs status`
first or wait before asking for the result.

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
- Do not assume the remote host has the same files as the current sandbox. Include enough context for the host's configured working directory.
- Keep prompts below 60,000 characters.
- Ask for concise output. Remote job output keeps only the latest output up to the CLI limit, so request summaries plus file paths or commands rather than large logs.
- Treat remote-agent as execution on another machine. Do not send secrets or private data unless the task requires it and the user authorized it.
