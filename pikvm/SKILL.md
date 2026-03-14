---
name: pikvm
description: PiKVM API for remote KVM. Use when user mentions "PiKVM", "KVM over IP",
  "remote server", or hardware management.
vm0_secrets:
  - PIKVM_AUTH
  - PIKVM_URL
---

# PiKVM Remote Control

Control remote computers via PiKVM REST API with mouse, keyboard, and power management.

## When to Use

- Take screenshots of remote machine
- Move mouse and click
- Type text or press keyboard keys
- Execute keyboard shortcuts (Cmd+Space, Ctrl+Alt+Del, etc.)
- Power control (on/off/reset)
- Automate remote desktop operations

## Prerequisites

```bash
export PIKVM_URL=https://pikvm.example.com
export PIKVM_AUTH=admin:admin
```

#
#
### Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/pikvm-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $PIKVM_AUTH" "$@"
EOF
chmod +x /tmp/pikvm-curl
```

**Usage:** All examples below use `/tmp/pikvm-curl` instead of direct `curl` calls.

## Setup API Wrapper

Create a helper script for API calls:

```bash
cat > /tmp/pikvm-curl << 'EOF'
#!/bin/bash
curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $PIKVM_AUTH" "$@"
EOF
chmod +x /tmp/pikvm-curl
```

**Usage:** All examples below use `/tmp/pikvm-curl` instead of direct `curl` calls.

## Get Credentials

1. Access your PiKVM web interface
2. Default credentials: `admin:admin`


## Coordinate System

**Mouse coordinates use screen center as origin (0,0)**:
- Negative X = left, Positive X = right
- Negative Y = up, Positive Y = down

For 1920x1080 screen:
- Top-left: `(-960, -540)`
- Center: `(0, 0)`
- Bottom-right: `(960, 540)`

---

## Usage

### Take Screenshot

```bash
/tmp/pikvm-curl -k -s -o /tmp/screenshot.jpg "${PIKVM_URL}/api/streamer/snapshot"
```

### Type Text

Text must be sent as raw body with `Content-Type: text/plain`:

```bash
/tmp/pikvm-curl -k -s -X POST -d '{"event": "click", "button": "left"}' "${PIKVM_URL}/api/hid/events"
  -H "Content-Type: text/plain" \
  -u "$PIKVM_AUTH" \
  -d "Hello World" \
  "${PIKVM_URL}/api/hid/print?limit=0"'
```

### Move Mouse

Move to absolute position (0,0 = screen center):

```bash
/tmp/pikvm-curl -k -s -X POST -d '{"event": "key", "key": "Enter"}' "${PIKVM_URL}/api/hid/events"
  -u "$PIKVM_AUTH" \
  "${PIKVM_URL}/api/hid/events/send_mouse_move?to_x=-500&to_y=-300"'
```

### Mouse Click

```bash
# Press
/tmp/pikvm-curl -X POST

# Release
/tmp/pikvm-curl -X POST
```

### Press Key

Press and release with `state=true` then `state=false`:

```bash
# Press Enter
/tmp/pikvm-curl -X POST

/tmp/pikvm-curl -X POST
```

### Key Combo (e.g., Cmd+Space for Spotlight)

Press all keys in order, then release in reverse:

```bash
# Press Cmd
/tmp/pikvm-curl -X POST

# Press Space
/tmp/pikvm-curl -X POST

# Release Space
/tmp/pikvm-curl -X POST

# Release Cmd
/tmp/pikvm-curl -X POST
```

### Mouse Scroll

```bash
/tmp/pikvm-curl -X POST
```

### Get Device Info

```bash
/tmp/pikvm-curl | jq .
```

### ATX Power Control

```bash
# Power on
/tmp/pikvm-curl -X POST

# Power off
/tmp/pikvm-curl -X POST

# Hard reset
/tmp/pikvm-curl -X POST
```

---

## Common Key Names

```
MetaLeft (Cmd), ControlLeft, AltLeft, ShiftLeft
Enter, Space, Escape, Tab, Backspace, Delete
ArrowUp, ArrowDown, ArrowLeft, ArrowRight
KeyA-KeyZ, Digit0-Digit9, F1-F12
PageUp, PageDown, Home, End
Equal (+), Minus (-)
```

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/streamer/snapshot` | GET | Screenshot (JPEG) |
| `/api/hid/print` | POST | Type text (body: raw text) |
| `/api/hid/events/send_mouse_move` | POST | Move mouse (`to_x`, `to_y`) |
| `/api/hid/events/send_mouse_button` | POST | Click (`button`, `state`) |
| `/api/hid/events/send_mouse_wheel` | POST | Scroll (`delta_x`, `delta_y`) |
| `/api/hid/events/send_key` | POST | Key press (`key`, `state`) |
| `/api/atx/power` | POST | Power control (`action`) |
| `/api/info` | GET | Device info |
| `/api/atx` | GET | ATX status |

## API Reference

- Official docs: https://docs.pikvm.org/api/
