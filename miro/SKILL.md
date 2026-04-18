---
name: miro
description: Miro REST API for online whiteboard and visual collaboration. Use when user mentions "Miro", "miro board", "whiteboard", "sticky notes", "visual collaboration", or asks to create boards, sticky notes, shapes, or diagrams on Miro.
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name MIRO_TOKEN` or `zero doctor check-connector --url https://api.miro.com/v1/oauth-token --method GET`

## Base URL

```
https://api.miro.com
```

Miro officially uses OAuth 2.0, but apps in the Developer Portal can issue a **non-expiring access token** (service-account style). The `MIRO_TOKEN` environment variable holds that token; all requests pass it as `Authorization: Bearer $MIRO_TOKEN`.

> Official docs: `https://developers.miro.com/reference/overview`

## How to Use

### 1. Verify Current Token

Inspect the current access token (scopes, team, user):

```bash
curl -s "https://api.miro.com/v1/oauth-token" --header "Authorization: Bearer $MIRO_TOKEN" | jq '{type, scopes, team: .team.name, user: .user.name}'
```

Use this as a connection smoke test before running any board operations.

### 2. List Boards

List boards the token has access to. Default page size is 20; max is 50.

```bash
curl -s "https://api.miro.com/v2/boards?limit=50" --header "Authorization: Bearer $MIRO_TOKEN" | jq '.data[] | {id, name, viewLink: .viewLink}'
```

Filter by team or owner:

```bash
curl -s "https://api.miro.com/v2/boards?team_id=<team-id>&owner=<user-id>" --header "Authorization: Bearer $MIRO_TOKEN" | jq '.data[] | {id, name}'
```

Save a board ID from the output for subsequent calls.

### 3. Get Board Details

Replace `<board-id>` with an actual board ID:

```bash
curl -s "https://api.miro.com/v2/boards/<board-id>" --header "Authorization: Bearer $MIRO_TOKEN" | jq '{id, name, description, viewLink, currentUserMembership}'
```

### 4. Create a Board

Write to `/tmp/miro_request.json`:

```json
{
  "name": "Sprint Planning 2026-Q2",
  "description": "Planning board for Q2 sprint kickoff",
  "policy": {
    "permissionsPolicy": {
      "collaborationToolsStartAccess": "all_editors",
      "copyAccess": "team_editors",
      "sharingAccess": "team_members_with_editing_rights"
    },
    "sharingPolicy": {
      "access": "private",
      "teamAccess": "edit"
    }
  }
}
```

Then run:

```bash
curl -s -X POST "https://api.miro.com/v2/boards" --header "Authorization: Bearer $MIRO_TOKEN" --header "Content-Type: application/json" -d @/tmp/miro_request.json | jq '{id, name, viewLink}'
```

### 5. List Items on a Board

List every item (sticky notes, shapes, text, images, frames, etc.) on a board. Replace `<board-id>`:

```bash
curl -s "https://api.miro.com/v2/boards/<board-id>/items?limit=50" --header "Authorization: Bearer $MIRO_TOKEN" | jq '.data[] | {id, type, text: .data.content // .data.title // .data.text}'
```

Filter by item type (`sticky_note`, `shape`, `text`, `image`, `card`, `frame`, `connector`, `document`, `embed`, `preview`):

```bash
curl -s "https://api.miro.com/v2/boards/<board-id>/items?type=sticky_note&limit=50" --header "Authorization: Bearer $MIRO_TOKEN" | jq '.data[] | {id, content: .data.content, position}'
```

### 6. Create a Sticky Note

Write to `/tmp/miro_request.json`:

```json
{
  "data": {
    "content": "Ship the v2 onboarding flow by EOW",
    "shape": "square"
  },
  "style": {
    "fillColor": "light_yellow"
  },
  "position": {
    "x": 0,
    "y": 0
  },
  "geometry": {
    "width": 200
  }
}
```

Then run. Replace `<board-id>`:

```bash
curl -s -X POST "https://api.miro.com/v2/boards/<board-id>/sticky_notes" --header "Authorization: Bearer $MIRO_TOKEN" --header "Content-Type: application/json" -d @/tmp/miro_request.json | jq '{id, type, content: .data.content}'
```

Sticky note `fillColor` values: `gray`, `light_yellow`, `yellow`, `orange`, `light_green`, `green`, `dark_green`, `cyan`, `light_pink`, `pink`, `violet`, `red`, `light_blue`, `blue`, `dark_blue`, `black`.

### 7. Create a Shape

Write to `/tmp/miro_request.json`:

```json
{
  "data": {
    "content": "Decision",
    "shape": "rhombus"
  },
  "style": {
    "fillColor": "#ffffff",
    "borderColor": "#1a1a1a",
    "borderWidth": 2,
    "color": "#1a1a1a"
  },
  "position": {
    "x": 300,
    "y": 0
  },
  "geometry": {
    "width": 240,
    "height": 160
  }
}
```

Then run. Replace `<board-id>`:

```bash
curl -s -X POST "https://api.miro.com/v2/boards/<board-id>/shapes" --header "Authorization: Bearer $MIRO_TOKEN" --header "Content-Type: application/json" -d @/tmp/miro_request.json | jq '{id, type, shape: .data.shape}'
```

Common `shape` values: `rectangle`, `round_rectangle`, `circle`, `triangle`, `rhombus`, `parallelogram`, `star`, `arrow`, `pentagon`, `hexagon`, `octagon`, `cloud`, `flow_chart_predefined_process`.

### 8. Create a Text Element

Write to `/tmp/miro_request.json`:

```json
{
  "data": {
    "content": "<p><strong>Q2 OKRs</strong></p>"
  },
  "style": {
    "color": "#1a1a1a",
    "fontFamily": "arial",
    "fontSize": "24",
    "textAlign": "center"
  },
  "position": {
    "x": 0,
    "y": -300
  },
  "geometry": {
    "width": 400
  }
}
```

Then run. Replace `<board-id>`:

```bash
curl -s -X POST "https://api.miro.com/v2/boards/<board-id>/texts" --header "Authorization: Bearer $MIRO_TOKEN" --header "Content-Type: application/json" -d @/tmp/miro_request.json | jq '{id, content: .data.content}'
```

Text `content` supports inline HTML tags: `<p>`, `<a>`, `<strong>`, `<b>`, `<em>`, `<i>`, `<s>`, `<u>`, `<span>`.

### 9. Delete an Item

Delete any item by ID. Replace `<board-id>` and `<item-id>`:

```bash
curl -s -X DELETE "https://api.miro.com/v2/boards/<board-id>/items/<item-id>" --header "Authorization: Bearer $MIRO_TOKEN"
```

Returns `204 No Content` on success.

### 10. Share a Board

Invite members via email. Write to `/tmp/miro_request.json`:

```json
{
  "emails": ["teammate@example.com"],
  "role": "editor",
  "message": "Please review the Q2 planning board"
}
```

Then run. Replace `<board-id>`:

```bash
curl -s -X POST "https://api.miro.com/v2/boards/<board-id>/members" --header "Authorization: Bearer $MIRO_TOKEN" --header "Content-Type: application/json" -d @/tmp/miro_request.json | jq '.data[] | {id, role, email}'
```

Valid roles: `viewer`, `commenter`, `editor`, `coowner`, `owner`.

## Guidelines

1. **Non-expiring token path:** The Miro connector stores a non-expiring access token issued by a Developer Portal app. That choice is permanent when the app is created — if you need a different token (extra scopes, different team), create a new app or reinstall the existing one, then reconnect in vm0.
2. **Coordinate system:** Board positions use absolute XY coordinates with `(0, 0)` at the board center. Positive X is right, positive Y is down. Units are pixels in the board's coordinate space.
3. **Geometry:** For sticky notes, provide only `width` — Miro keeps the square aspect ratio. For shapes, provide both `width` and `height`.
4. **Pagination:** List endpoints return a `cursor` in the response; pass it as `?cursor=<value>` to fetch the next page. Max `limit` is 50.
5. **Rate limits:** ~200 req/min per app across the team. Bulk creation is faster through `POST /v2/boards/{board_id}/items/bulk` when creating many items.
6. **Item types:** The unified `items` endpoint returns every item regardless of subtype. Use the subtype-specific endpoints (`/sticky_notes`, `/shapes`, `/texts`, `/cards`, `/images`, `/frames`, `/connectors`) only for creation — they accept richer payloads.
