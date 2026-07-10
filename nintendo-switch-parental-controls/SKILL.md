---
name: nintendo-switch-parental-controls
description: Use the connected Nintendo Switch Parental Controls app API to inspect supervised Nintendo Switch or Switch 2 play activity, announcements, GameChat settings and requests, account data, and explicitly approved parental-control changes. Trigger for family play-time summaries, supervised console activity, Nintendo parental settings, GameChat approvals, play timers, device labels, or troubleshooting the Nintendo Switch Parental Controls connector.
---

# Nintendo Switch Parental Controls

Use the vm0 connector for Nintendo Switch Parental Controls app data. Prefer the default-allowed read workflow. Treat PIN-bearing reads, device pairing, and every mutation as sensitive.

This integration documents the private app protocol observed in Nintendo Switch Parental Controls 2.4.0, build 660. It is not a public Nintendo API and can change without notice.

## Prerequisites

- Connect **Nintendo Switch Parental Controls** under vm0.ai -> Settings -> Connectors with the adult Nintendo Account used by the app.
- Use `https://app.lp1.znma.srv.nintendo.net` for app actions.
- Use `https://api.accounts.nintendo.com` only for the Nintendo Account profile.
- Let vm0 inject the app identity, version, language, smart-device ID, and credential headers. Do not replace the `X-Moon-*` headers.
- Never print, persist, or return token or smart-device-ID environment values.

The connector exposes these runtime bindings:

- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN`: ID token for all `/v2/actions/*` and `/v3/actions/*` requests.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN`: account token for `/2.0.0/users/me` only.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_SMART_DEVICE_ID`: registered app-instance ID; vm0 injects it as a header.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_LANGUAGE`: Nintendo profile language.
- `$NINTENDO_SWITCH_PARENTAL_CONTROLS_DEVICE_CATALOG`: safe JSON containing only `deviceId` and `label`.

Check the connection without exposing credentials:

```bash
zero doctor check-connector --env-name NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN
zero doctor check-connector --env-name NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN
zero doctor check-connector --url https://app.lp1.znma.srv.nintendo.net/v2/actions/user/fetchUser --method GET
```

## Safe Read Workflow

### 1. Select a Device

Use the sanitized catalog instead of granting raw device-record access:

```bash
printf '%s\n' "$NINTENDO_SWITCH_PARENTAL_CONTROLS_DEVICE_CATALOG" \
  | jq -r '.devices[] | [.deviceId, .label] | @tsv'
```

If the catalog is missing after a console was added or renamed, reconnect the connector. Do not request PIN-bearing device permissions merely to discover an ID.

### 2. Read Daily Play Activity

```bash
DEVICE_ID=<device-id>
curl -fsS -G \
  "https://app.lp1.znma.srv.nintendo.net/v2/actions/playSummary/fetchDailySummaries" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "deviceId=$DEVICE_ID" \
  | jq .
```

Daily summaries can provide player identifiers needed by GameChat reads. Do not assume a fixed response shape; inspect the current response before selecting fields.

### 3. Read Monthly Play Activity

Latest summary:

```bash
curl -fsS -G \
  "https://app.lp1.znma.srv.nintendo.net/v2/actions/playSummary/fetchLatestMonthlySummary" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "deviceId=$DEVICE_ID" \
  | jq .
```

Specific month:

```bash
curl -fsS -G \
  "https://app.lp1.znma.srv.nintendo.net/v2/actions/playSummary/fetchMonthlySummary" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "deviceId=$DEVICE_ID" \
  --data-urlencode "year=<year>" \
  --data-urlencode "month=<month>" \
  --data-urlencode "containLatest=true" \
  | jq .
```

### 4. Read Account and App User Data

Nintendo Account profile:

```bash
curl -fsS "https://api.accounts.nintendo.com/2.0.0/users/me" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_ACCOUNT_TOKEN" \
  | jq '{id, nickname, country, language}'
```

Parental Controls app user:

```bash
curl -fsS "https://app.lp1.znma.srv.nintendo.net/v2/actions/user/fetchUser" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  | jq .
```

### 5. Read Announcements

```bash
curl -fsS -G \
  "https://app.lp1.znma.srv.nintendo.net/v2/actions/announcement/fetchAnnouncements" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "appLanguage=$NINTENDO_SWITCH_PARENTAL_CONTROLS_LANGUAGE" \
  | jq .
```

### 6. Read GameChat Data

Use a `deviceId` from the safe catalog and a `playerId` from safe play summaries. GameChat may be unavailable for the account, player, or region.

```bash
PLAYER_ID=<player-id>
curl -fsS -G \
  "https://app.lp1.znma.srv.nintendo.net/v2/actions/chat/fetchCameraSetting" \
  --header "Authorization: Bearer $NINTENDO_SWITCH_PARENTAL_CONTROLS_TOKEN" \
  --data-urlencode "deviceId=$DEVICE_ID" \
  --data-urlencode "playerId=$PLAYER_ID" \
  | jq .
```

## Safety Rules for Sensitive Reads and Mutations

- Ask for the exact user intent before requesting a default-denied permission.
- Confirm the target device and effect before every mutation.
- Never retrieve, reveal, guess, or store unlock PINs, synchronized PINs, pairing codes, notification tokens, or serial numbers unless the user explicitly requests the specific sensitive read and has authorized its permission.
- Do not call raw federation or notification-token routes as routine setup. The connector owns its smart-device lifecycle and does not consume push notifications.
- Do not guess POST bodies. Use a body verified for app 2.4.0 and the requested operation.
- Treat raw `POST /v2/actions/logout` as destructive: it can invalidate this connector. Reconnect is the supported recovery.
- Do not call hidden legacy `/moon/v1` APIs; they are not present in app 2.4.0.

## Firewall Permissions

Unknown routes are denied. The permission list below covers the account profile and all 45 app action routes.

### Default Allowed Reads

- `nintendo-switch-parental-controls-account-read`
  - `GET https://api.accounts.nintendo.com/2.0.0/users/me`
  - `GET /v2/actions/user/fetchUser`
- `nintendo-switch-parental-controls-announcements-read`
  - `GET /v2/actions/announcement/fetchAnnouncements`
- `nintendo-switch-parental-controls-game-chat-read`
  - `GET /v2/actions/chat/fetchCameraChatRequests`
  - `GET /v2/actions/chat/fetchCameraSetting`
  - `GET /v2/actions/chat/fetchChatRequests`
  - `GET /v2/actions/chat/fetchChatSetting`
  - `GET /v2/actions/chat/fetchTermOfUse`
- `nintendo-switch-parental-controls-play-summary-read`
  - `GET /v2/actions/playSummary/fetchDailySummaries`
  - `GET /v2/actions/playSummary/fetchLatestMonthlySummary`
  - `GET /v2/actions/playSummary/fetchMonthlySummary`

### Default Denied Sensitive Reads

These responses can include a serial number, unlock PIN, synchronized PIN, or pairing state.

- `nintendo-switch-parental-controls-device-credentials-read`
  - `GET /v3/actions/device/fetchExtraPlayingTimeState`
  - `GET /v3/actions/deviceFederation/checkDeviceFederation`
  - `GET /v3/actions/user/fetchOwnedDevice`
  - `GET /v3/actions/user/fetchOwnedDevices`
- `nintendo-switch-parental-controls-settings-credentials-read`
  - `GET /v3/actions/parentalControlSetting/fetchParentalControlSetting`

### Default Denied Writes

- `nintendo-switch-parental-controls-game-chat-write`
  - `POST /v2/actions/chat/acceptCameraChatRequest`
  - `POST /v2/actions/chat/acceptChatRequest`
  - `POST /v2/actions/chat/agreeChildTerm`
  - `POST /v2/actions/chat/checkRelationship`
  - `POST /v2/actions/chat/rejectCameraChatRequest`
  - `POST /v2/actions/chat/rejectChatRequest`
  - `POST /v2/actions/chat/requestRelationshipCorrection`
  - `POST /v2/actions/chat/suspendCameraChat`
  - `POST /v2/actions/chat/updateCameraChatSetting`
  - `POST /v2/actions/chat/updateCameraSetting`
  - `POST /v2/actions/chat/updateMemo`
  - `POST /v2/actions/chat/withdrawChatRequest`
- `nintendo-switch-parental-controls-play-time-write`
  - `POST /v2/actions/device/confirmExtraPlayingTime`
  - `POST /v2/actions/device/updateExtraPlayingTime`
  - `POST /v3/actions/parentalControlSetting/updatePlayTimer`
- `nintendo-switch-parental-controls-device-pairing-write`
  - `POST /v2/actions/deviceFederation/startDeviceFederation`
  - `POST /v2/actions/user/confirmCopiedOwnedDevice`
  - `POST /v3/actions/federation`
- `nintendo-switch-parental-controls-feedback-write`
  - `POST /v2/actions/feedback/sendFeedback`
- `nintendo-switch-parental-controls-smart-device-write`
  - `POST /v2/actions/logout`
  - `POST /v2/actions/smartDevice/updateNotificationToken`
- `nintendo-switch-parental-controls-settings-write`
  - `POST /v2/actions/parentalControlSetting/updateRestrictionLevel`
  - `POST /v2/actions/parentalControlSetting/updateUnlockCode`
- `nintendo-switch-parental-controls-device-write`
  - `POST /v3/actions/device/unregisterDevice`
  - `POST /v3/actions/device/updateDeviceLabel`
  - `POST /v3/actions/user/updateOwnedDeviceSortOrder`
- `nintendo-switch-parental-controls-notifications-write`
  - `POST /v2/actions/user/clearAlarmSettingNotice`
  - `POST /v2/actions/user/updateNotificationSetting`
- `nintendo-switch-parental-controls-summary-acknowledgement-write`
  - `POST /v3/actions/user/confirmFirstDailySummary`
  - `POST /v3/actions/user/confirmNewMonthlySummary`

## Troubleshooting

- **401 or expired connection:** let vm0 refresh once, then reconnect if the request still fails. Never expose a token while debugging.
- **Permission denied:** request only the named permission required for the user's operation. Do not weaken unknown-route or credential-read defaults.
- **Empty or stale device catalog:** reconnect after confirming the console is linked in the official app.
- **No play summaries:** confirm the selected device has activity for the requested period. Daily boundaries use the connector's registered app context.
- **No player ID or GameChat data:** read daily summaries first; the player or region may not support GameChat.
- **Schema or route error after an app update:** stop rather than guessing. Record the current app version and revalidate the protocol before changing a request.
- **Raw logout was called:** reconnect the connector; do not silently re-federate and reverse the user's action.
