---
name: sponge
description: Sponge financial infrastructure API for AI agents — wallets, cards, bank accounts, transfers, swaps, and x402/MPP payments. Use when user mentions "Sponge", "paysponge", "agent wallet", "agent payments", "x402", "MPP", or "Sponge Card".
---

# Sponge

[Sponge](https://paysponge.com) is the financial infrastructure for the agent economy. Master keys create and manage agent wallets; scoped agent keys execute wallet actions — transfers, swaps, card issuance, x402/MPP payments, Hyperliquid/Polymarket trades.

> Official docs: `https://docs.paysponge.com`

---

## When to Use

Use this skill when you need to:

- Provision a new agent wallet from a master account
- List, inspect, or rotate the agent keys in a Sponge platform
- Move funds between Sponge wallets or onto external addresses
- Issue or fetch a Sponge Card / virtual card for an agent
- Pay an x402- or MPP-enabled endpoint on behalf of an agent

---

## Prerequisites

Connect the **Sponge** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name SPONGE_MASTER_KEY` or `zero doctor check-connector --url https://api.wallet.paysponge.com/api/agents --method GET`

## Environment Variables

| Variable | Description |
|---|---|
| `SPONGE_MASTER_KEY` | Platform-level master key (prefix `sponge_master_...`). Used for control-plane operations and for fetching scoped agent keys. |

The master key is the only credential vm0 stores. Agent keys are looked up at runtime through the master key — never hard-code them.

---

## How to Use

Base URL: `https://api.wallet.paysponge.com`

All Sponge endpoints use a Bearer header: `Authorization: Bearer <master-or-agent-key>`.

### 1. List agents on the platform

```bash
curl -s -X GET "https://api.wallet.paysponge.com/api/agents" --header "Authorization: Bearer $SPONGE_MASTER_KEY" | jq '.agents[] | {id, name, description}'
```

### 2. Create a new agent

Write to `/tmp/sponge_agent.json`:

```json
{
  "name": "trading-bot-1",
  "description": "Created by vm0 agent",
  "dailySpendingLimit": "100"
}
```

```bash
curl -s -X POST "https://api.wallet.paysponge.com/api/agents" --header "Authorization: Bearer $SPONGE_MASTER_KEY" --header "Content-Type: application/json" -d @/tmp/sponge_agent.json | jq '{agentId: .agent.id, apiKey}'
```

The response includes a scoped `apiKey` — store it; this is the only chance to read it.

### 3. Fetch (or rotate) an agent's API key

Replace `<agent-id>` with the agent id from step 2.

```bash
curl -s -X GET "https://api.wallet.paysponge.com/api/agents/<agent-id>/api-key" --header "Authorization: Bearer $SPONGE_MASTER_KEY"
```

Rotate:

```bash
curl -s -X POST "https://api.wallet.paysponge.com/api/agents/<agent-id>/api-key/regenerate" --header "Authorization: Bearer $SPONGE_MASTER_KEY"
```

### 4. Get current agent (acts as a token health check)

When called with an agent key the endpoint returns the agent identity; when called with a master key it errors. Use it to verify a key before using it.

```bash
curl -s -X GET "https://api.wallet.paysponge.com/api/agents/me" --header "Authorization: Bearer <agent-key>"
```

### 5. Read agent wallet balances

Use the **agent** key returned from step 2 — the master key cannot move funds.

```bash
curl -s -X GET "https://api.wallet.paysponge.com/api/wallet/balances" --header "Authorization: Bearer <agent-key>"
```

### 6. Send an EVM transfer

Replace `<agent-key>` with the agent's runtime key.

Write to `/tmp/sponge_transfer.json`:

```json
{
  "chain": "base",
  "token": "USDC",
  "to": "0x0000000000000000000000000000000000000000",
  "amount": "1.00"
}
```

```bash
curl -s -X POST "https://api.wallet.paysponge.com/api/transfers/evm" --header "Authorization: Bearer <agent-key>" --header "Content-Type: application/json" -d @/tmp/sponge_transfer.json
```

### 7. Fetch a paid endpoint via x402 auto-pay

Sponge handles 402-payment-required upstream APIs automatically when you proxy the call through `x402/fetch`.

Write to `/tmp/sponge_x402.json`:

```json
{
  "url": "https://api.example.com/paid-resource",
  "method": "GET",
  "maxAmount": "0.50"
}
```

```bash
curl -s -X POST "https://api.wallet.paysponge.com/api/x402/fetch" --header "Authorization: Bearer <agent-key>" --header "Content-Type: application/json" -d @/tmp/sponge_x402.json
```

---

## Guidelines

1. Treat `SPONGE_MASTER_KEY` as the control-plane credential — never embed it in agent runtime traffic. Use it to mint or look up a scoped agent key, then switch.
2. Agent keys are scoped to a single agent — one per persona, never shared across agents.
3. Set `dailySpendingLimit`, `weeklySpendingLimit`, or `monthlySpendingLimit` on agent creation to bound autonomous spend.
4. Prefer the official SDKs (`@paysponge/sdk` TypeScript / `paysponge` Python) for non-trivial flows — they handle pagination, polling, and bridge state transitions.
5. For sustained agent-to-API spend, prefer the MPP or x402 flow over manual card issuance — fewer round trips and better failure handling.
