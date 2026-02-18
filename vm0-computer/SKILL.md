---
name: vm0-computer
description: Access the user's local computer files via WebDAV through the VM0 Computer Connector. Use when you need to read, write, or list files on the user's local machine from within a VM0 sandbox.
vm0_secrets:
  - COMPUTER_CONNECTOR_BRIDGE_TOKEN
  - COMPUTER_CONNECTOR_DOMAIN
---

# VM0 Computer Connector

Access the user's local filesystem from a VM0 sandbox over a secure WebDAV tunnel established by the VM0 Computer Connector.

---

## When to Use

Use this skill when you need to:

- List files and directories on the user's local machine
- Read files from the user's computer into the sandbox
- Write or update files on the user's local machine
- Transfer outputs back to the user's local filesystem

---

## How to Use

The WebDAV root is `https://webdav.$COMPUTER_CONNECTOR_DOMAIN/`. All requests must include the `x-vm0-token` authentication header.

> **Important:** Wrap curl commands that use `$VAR` in `bash -c '...'`. Due to a Claude Code bug, environment variables are silently cleared when pipes are used directly.

### 1. List Files in a Directory

Use `PROPFIND` to list the contents of a directory (depth 1):

```bash
bash -c 'curl -s -X PROPFIND "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN" --header "Depth: 1"'
```

List a subdirectory:

```bash
bash -c 'curl -s -X PROPFIND "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/reports/" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN" --header "Depth: 1"'
```

### 2. Download a File from the Local Machine

```bash
bash -c 'curl -s -o /tmp/myfile.pdf "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/myfile.pdf" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN"'
```

Read a text file directly:

```bash
bash -c 'curl -s "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/notes.txt" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN"'
```

### 3. Upload a File to the Local Machine

Write a local sandbox file to the user's `~/Downloads`:

```bash
bash -c 'curl -s -X PUT "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/output-report.txt" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN" --header "Content-Type: text/plain" --data-binary @/home/user/output-report.txt'
```

Upload from stdin (inline content):

```bash
bash -c 'curl -s -X PUT "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/result.json" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN" --header "Content-Type: application/json" -d '\"'\"'{"status": "done"}'\"'\"''
```

### 4. Delete a File

```bash
bash -c 'curl -s -X DELETE "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/old-file.txt" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN"'
```

### 5. Create a Directory

```bash
bash -c 'curl -s -X MKCOL "https://webdav.$COMPUTER_CONNECTOR_DOMAIN/new-folder/" --header "x-vm0-token: $COMPUTER_CONNECTOR_BRIDGE_TOKEN"'
```
