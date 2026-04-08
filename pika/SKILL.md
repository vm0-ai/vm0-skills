---
name: pikastream
description: Pika Developer API for joining video meetings (Google Meet, Zoom) as a real-time AI avatar with voice cloning. Use when user mentions "Pika", "PikaStream", "pikastream", "join a meeting as AI", "AI avatar meeting", or "video meeting bot".
---

# Pika Developer API (PikaStream)

PikaStream lets an AI agent join Google Meet or Zoom calls as a real-time avatar with voice cloning. Billed at **$0.275/min**.

> GitHub: `https://github.com/Pika-Labs/Pika-Skills`
> Dev portal: `https://www.pika.me/dev/`

## Prerequisites

Go to [vm0.ai](https://app.vm0.ai) **Settings → Connectors** and connect **Pika** with your Developer Key. vm0 will automatically inject the `PIKA_TOKEN` environment variable.

To get a Developer Key: visit [pika.me/dev](https://www.pika.me/dev/) and create a key (format: `dk_...`).

> **Important:** When using `$(printenv PIKA_TOKEN)` in commands that contain a pipe (`|`), always use `$(printenv ...)` syntax — a known Claude Code issue silently clears `$VAR` references in pipelines.

## Base URL

```
https://srkibaanghvsriahb.pika.art
```

## Authentication

All requests use a `DevKey` header:

```
Authorization: DevKey $(printenv PIKA_TOKEN)
```

---

## Core APIs

### Check Balance

```bash
curl -s "https://srkibaanghvsriahb.pika.art/developer/balance" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" | jq '.data // .'
```

Returns `{ "balance": <int> }`. Minimum 100 credits required before joining a meeting.

---

### Join a Meeting

```bash
curl -s -X POST "https://srkibaanghvsriahb.pika.art/proxy/realtime/meeting-session" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" \
  -H "X-Skill-Name: pikastream" \
  -F "meet_url=<google-meet-or-zoom-url>" \
  -F "bot_name=<display-name>" \
  -F "platform=<google_meet|zoom>" \
  -F "image=@<path-to-avatar.png>" \
  -F "voice_id=<voice-id>" \
  -F "system_prompt=<context for the bot>" | jq '.'
```

| Field | Required | Description |
|-------|----------|-------------|
| `meet_url` | Yes | Google Meet (`meet.google.com/...`) or Zoom URL |
| `bot_name` | Yes | Display name shown in the meeting |
| `platform` | Yes | `google_meet` or `zoom` (inferred from URL if omitted) |
| `image` | Yes | Avatar image file (portrait/headshot, PNG or JPG, > 1 KB) |
| `voice_id` | No | Voice clone ID. Default: `English_radiant_girl` |
| `system_prompt` | No | Background context for the bot's in-meeting conversation |
| `meeting_password` | No | Meeting password if required |

Returns: `{ "session_id": "...", "platform": "...", "status": "created" }`

---

### Poll Session Status

```bash
curl -s "https://srkibaanghvsriahb.pika.art/proxy/realtime/session/<session_id>" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" | jq '{status, video_worker_connected, meeting_bot_connected}'
```

| `status` | Meaning |
|----------|---------|
| `created` | Bot is starting up |
| `ready` | Bot is live in the meeting |
| `error` | Something went wrong |
| `closed` | Session ended |

Poll every 2 seconds. The bot is ready when `status == "ready"` or both `video_worker_connected` and `meeting_bot_connected` are `true`. Default timeout: 90s.

---

### Leave a Meeting

```bash
curl -s -X DELETE "https://srkibaanghvsriahb.pika.art/proxy/realtime/session/<session_id>" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" | jq '.'
```

Returns: `{ "session_id": "...", "closed": true }`

Billing stops when this call completes.

---

### List Topup Products

```bash
curl -s "https://srkibaanghvsriahb.pika.art/developer/topup/products" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" | jq '.data // . | .products[]? | {name, numCredits, productId}'
```

---

### Create Topup Checkout

```bash
curl -s -X POST "https://srkibaanghvsriahb.pika.art/developer/topup" \
  -H "Authorization: DevKey $(printenv PIKA_TOKEN)" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "<productId>"}' | jq '.data // . | {checkout_url}'
```

Returns a `checkout_url`. Share with the user to complete payment, then poll `/developer/balance` until balance ≥ 100.

---

## Guidelines

1. **Check balance first:** Always run the balance check before joining. Minimum 100 credits required.
2. **Avatar is mandatory:** The bot cannot join without an image file > 1 KB.
3. **Platform inference:** `meet.google.com` → `google_meet`; `zoom.us` or `zoom.com` → `zoom`.
4. **Voice clones expire:** Cloned voices are deleted after 7 days of non-use.
5. **Pricing:** $0.275/min, billed from join until `DELETE` is called.
6. **Post-meeting notes:** After leaving, the API may provide a meeting notes URL in the session response.
