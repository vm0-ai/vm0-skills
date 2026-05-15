---
name: local-browser
description: VM0 Local Browser connector for using a user's paired browser extension. Use when a task needs current tabs, page snapshots, screenshots, selected text, page metadata, or user-approved browser actions through `npx -p @vm0/cli zero local-browser`.
---

# VM0 Local Browser

Local Browser lets this agent inspect and control a user's already paired browser through VM0. Reads are queued to an online browser host. Writes require explicit user approval before the extension executes them.

Use it when the user asks to work with their current browser, inspect an open page, capture screenshots, summarize selected text, or perform browser actions in a page they control.

```bash
npx -y -p @vm0/cli zero local-browser <command>
```

`-y` avoids npm's install prompt. Use `npx -p @vm0/cli ...` without `-y` only when an interactive prompt is acceptable.

## Prerequisites

Check hosts when the task depends on a browser being online or when a host reference is ambiguous:

```bash
npx -y -p @vm0/cli zero local-browser hosts list
```

If there is no online host, ask the user to connect the Local Browser connector from VM0 and keep the extension running. If multiple hosts are online and the user named one, pass `--host-id <host-id>` to commands that support targeting.

## Read Browser Context

Use read commands before write commands whenever possible so you can target the right tab, URL, text, or selector.

List tabs:

```bash
npx -y -p @vm0/cli zero local-browser tabs list
```

Get the current tab:

```bash
npx -y -p @vm0/cli zero local-browser tabs current
```

Read the current page snapshot:

```bash
npx -y -p @vm0/cli zero local-browser page snapshot
```

Capture a screenshot:

```bash
npx -y -p @vm0/cli zero local-browser page screenshot
```

Read selected text or metadata:

```bash
npx -y -p @vm0/cli zero local-browser page selection
npx -y -p @vm0/cli zero local-browser page metadata
```

## User-Approved Actions

Write commands create an approval request. The user must approve it before the extension executes it.

Navigate or open a tab:

```bash
npx -y -p @vm0/cli zero local-browser page navigate "https://example.com"
npx -y -p @vm0/cli zero local-browser tabs open "https://example.com"
```

Click or type:

```bash
npx -y -p @vm0/cli zero local-browser page click --selector "button[type=submit]"
npx -y -p @vm0/cli zero local-browser page type --selector "input[name=q]" --text "search terms"
```

Scroll or manage tabs:

```bash
npx -y -p @vm0/cli zero local-browser page scroll --direction down --amount 800
npx -y -p @vm0/cli zero local-browser tabs activate --tab-id "<tab-id>"
npx -y -p @vm0/cli zero local-browser tabs close --tab-id "<tab-id>"
```

## Audit And Cleanup

Inspect approved-write history when a user asks what happened or when debugging a failed browser action:

```bash
npx -y -p @vm0/cli zero local-browser audit list --limit 20
npx -y -p @vm0/cli zero local-browser audit list --run-id "<run-id>"
```

Revoke a host only when the user asks to disconnect it:

```bash
npx -y -p @vm0/cli zero local-browser hosts revoke --host-id "<host-id>"
```

## Safety

- Prefer read-only commands unless the user asked for an action.
- Do not enter passwords, payment details, or sensitive personal data unless the user explicitly instructs it for that exact task.
- Treat every write as user-visible browser control. Keep actions narrow and explain the intended action before issuing commands if the request is ambiguous.
- Do not rely on arbitrary JavaScript or CDP access; use the supported `zero local-browser` commands.
