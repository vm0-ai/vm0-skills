---
name: computer-use
description: Operate the user's connected desktop apps through Zero Computer Use. Use when a task explicitly asks for zero computer-use, desktop computer use, opening or inspecting a local app, reading a GUI, clicking UI elements, using Slack/Safari/Chrome/Arc/Notion/Finder or another desktop app, taking an app screenshot, or performing a UI workflow that cannot be completed through normal APIs alone.
---

# Computer Use

## Overview

Use `npx -p @vm0/cli zero computer-use <command>` to inspect and operate apps on the connected Zero Desktop host. Treat it as a GUI control surface: read the app state, inspect screenshots, then act through accessibility elements whenever possible.

## Core Workflow

1. Confirm the host is available:

```bash
npx -p @vm0/cli zero computer-use list-apps
```

2. Inspect the target app:

```bash
npx -p @vm0/cli zero computer-use get-app-state --app Slack --timeout 10
```

3. Read the JSON result:

- `snapshotId` is required for follow-up actions against the same state.
- `appState` is expected to be a local file path containing the full accessibility tree. Read or filter that file to find element indexes, roles, labels, URLs, and the focused element.
- `screenshot` is a local image path under `/tmp/vm0/computer-use/...`; inspect it with the image viewer when visual judgment matters.
- During rollout, older CLI versions may still return `appState` as an inline string. If it is not a path, save the JSON output to a temp file and extract/filter the inline string.

4. Act on elements first:

```bash
npx -p @vm0/cli zero computer-use click --app Slack --snapshot-id <snapshotId> --element-index <index>
npx -p @vm0/cli zero computer-use set-value --app Slack --snapshot-id <snapshotId> --element-index <index> --value "text"
npx -p @vm0/cli zero computer-use type-text --app Slack --text "literal text"
npx -p @vm0/cli zero computer-use press-key --app Slack --key Command+L
npx -p @vm0/cli zero computer-use scroll --app Slack --snapshot-id <snapshotId> --element-index <index> --direction down --pages 1
```

5. Re-read state after every meaningful UI change. Element indexes and coordinates can become stale after navigation, scrolling, or opening a new window.

Post-action commands also return a fresh state. Treat successful `open-app`, `click`, `scroll`, `set-value`, `perform-action`, `type-text`, and `press-key` responses as new snapshots with their own `snapshotId`, `appState` file, screenshot, and compact action metadata.

## Reading App State

Accessibility trees can be very large. Prefer the `appState` file returned by the command:

```bash
state_json=/tmp/computer-use-state.json
npx -p @vm0/cli zero computer-use get-app-state --app Slack --timeout 10 > "$state_json"
app_state_path=$(node -e "const fs=require('fs'); const r=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); console.log(r.appState)" "$state_json")
rg -n "Ethan|showcase|sites\\.vm0|Send now" "$app_state_path"
```

If the CLI still returns inline app state instead of a path, use the transition workaround:

```bash
npx -p @vm0/cli zero computer-use get-app-state --app Slack --timeout 10 > /tmp/slack-state.json
node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync('/tmp/slack-state.json','utf8')).appState; s.split('\\n').forEach((l,i)=>{ if(/Ethan|showcase|sites\\.vm0|Send now/.test(l)) console.log((i+1)+': '+l) })"
```

Use filtered output to locate clickable `link`, `button`, `text field`, `checkbox`, or `outline row` entries and their element indexes.

## Action Rules

- Prefer `--element-index` or `--element` over coordinate clicks.
- Use `--x/--y` only when the screenshot clearly shows the target but the accessibility tree has no useful element.
- Always pass the matching `--snapshot-id` from the state used to pick the element or coordinate.
- Use `open-app --app <name>` when the app is not visible or not running.
- Use `press-key` for reliable shortcuts such as `Command+L`, `Command+T`, `Command+W`, `Enter`, and arrow keys.
- Use `type-text` only after confirming focus is in the right field.
- Avoid destructive UI actions unless the user explicitly requested them and the current state confirms the target.

## Slack Pattern

For Slack reading tasks:

1. Run `get-app-state --app Slack`.
2. Inspect the screenshot to understand channel/thread layout.
3. Filter the `appState` file for sender names, link domains, message text, composer labels, and `Send now`.
4. Click Slack links by element index when the user specifically asked to use the GUI.
5. If the task is simply to send a message and no GUI interaction is required, prefer `zero slack message send` for reliability; note that this is a Slack API shortcut, not desktop computer use.

For Slack thread messages, watch for composer options like `Also send to #channel`. If the user asked to post in the channel rather than only reply in a thread, either select that option in Slack or use `zero slack message send -c <channel-id>`.

## Browser Pattern

After clicking a link from another app:

1. Check likely browsers with `get-app-state --app Arc`, `--app Safari`, or `--app Google Chrome`.
2. Inspect the address field, page title, and screenshot.
3. Use `press-key --key Command+L` plus `type-text` and `Enter` when direct navigation is faster than finding a link.
4. For visual review, always inspect the screenshot path. Browser accessibility text alone is not enough for layout, design, or image-heavy pages.

## Reporting Back

State what was actually done through computer-use: apps inspected, key screenshots reviewed, and whether actions succeeded. If a desktop action times out or the host is unavailable, say that directly and use a stable fallback only when it still satisfies the user request.
