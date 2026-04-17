---
name: computer
description: Computer connector for exposing local services to remote sandboxes via
  authenticated ngrok tunnels. Use when user mentions "computer use", "tunnel",
  "ngrok", "expose local", or needs to bridge local services to a sandbox.
---

# Computer Connector

Expose local services to remote sandboxes via authenticated ngrok tunnels.

## When to Use

- Bridge a local development server to a remote sandbox
- Expose local ports through a secure tunnel
- Connect sandbox environments to on-premise services


## Prerequisites

Connect the **Computer Connector** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).
## Environment Variables

- `COMPUTER_CONNECTOR_BRIDGE_TOKEN` — Authentication token for the ngrok bridge
- `COMPUTER_CONNECTOR_DOMAIN` — Tunnel domain for routing traffic
